/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Storage adapters for user-scaffold.
 *
 * user-scaffold keeps two kinds of long-term data:
 * - long-term memory (ltMemory), which holds the learner profile: small,
 *   read synchronously while a page renders. Default: localStorage under the
 *   key it has always used, `user-scaffold-ltMemory`.
 * - the statements list: every xAPI statement recorded, which only grows.
 *   localStorage has a ~5MB per origin budget shared by every site on that
 *   origin and is synchronous, so a growing log would eventually fail writes
 *   for everything else (theme, editor and ltMemory itself). Default:
 *   IndexedDB, async, versioned, one database with a per-site index.
 *
 * Interfaces (any object with these methods can be passed to
 * UserScaffold.setMemoryAdapter / setStatementAdapter):
 *
 * MemoryAdapter { load(): Object, save(obj: Object): boolean, clear(): void }
 * StatementAdapter {
 *   add(site: string, statement: Object): Promise<boolean>,
 *   list(site: string): Promise<Object[]>,
 *   clear(site: string): Promise<void>,
 *   clearAll(): Promise<void> (optional; every site, "clear this device")
 * }
 *
 * HAXcmsServerStatementAdapter and LRSStatementAdapter are documented stubs:
 * they will send statements for a signed-in learner (HAXcms endpoint in
 * haxcms-nodejs + haxcms-php with identical specs, or an owner configured
 * LRS). Sending learner data anywhere is an owner setting, never automatic.
 */
import {
  localStorageSet,
  localStorageGet,
  localStorageDelete,
} from "@haxtheweb/utils/lib/storage.js";

export const LT_MEMORY_KEY = "user-scaffold-ltMemory";

/**
 * Long-term memory in localStorage (the original behaviour)
 */
export class LocalStorageMemoryAdapter {
  constructor(key = LT_MEMORY_KEY) {
    this.key = key;
  }
  load() {
    const data = localStorageGet(this.key, {});
    return data && typeof data === "object" ? data : {};
  }
  save(obj) {
    try {
      localStorageSet(this.key, obj);
      return true;
    } catch {
      return false;
    }
  }
  clear() {
    try {
      localStorageDelete(this.key);
    } catch {
      // storage blocked
    }
  }
}

/**
 * Long-term memory that lasts only for this page (tests, private mode)
 */
export class MemoryMemoryAdapter {
  constructor(initial = {}) {
    this.data = JSON.parse(JSON.stringify(initial));
  }
  load() {
    return JSON.parse(JSON.stringify(this.data));
  }
  save(obj) {
    this.data = JSON.parse(JSON.stringify(obj));
    return true;
  }
  clear() {
    this.data = {};
  }
}

/**
 * Statements kept in memory only
 */
export class MemoryStatementAdapter {
  constructor() {
    this.sites = new Map();
  }
  async add(site, statement) {
    const list = this.sites.get(site) || [];
    if (!list.find((s) => s.id === statement.id)) {
      list.push(JSON.parse(JSON.stringify(statement)));
    }
    this.sites.set(site, list);
    return true;
  }
  async list(site) {
    return JSON.parse(JSON.stringify(this.sites.get(site) || []));
  }
  async clear(site) {
    this.sites.delete(site);
  }
  async clearAll() {
    this.sites.clear();
  }
}

export const STATEMENT_DB = "user-scaffold-statements";
export const STATEMENT_DB_VERSION = 1;
const STATEMENT_STORE = "statements";

/**
 * Statements in IndexedDB. Records: { id, site, v: 1, stored, statement }.
 * Falls back to memory when IndexedDB is missing or blocked.
 */
export class IndexedDBStatementAdapter {
  constructor(options = {}) {
    this.dbName = options.dbName || STATEMENT_DB;
    this.indexedDB = options.indexedDB || globalThis.indexedDB;
    this._db = null;
    this._fallback = null;
  }
  _open() {
    if (this._db) {
      return this._db;
    }
    this._db = new Promise((resolve, reject) => {
      if (!this.indexedDB) {
        reject(new Error("no indexedDB"));
        return;
      }
      let req;
      try {
        req = this.indexedDB.open(this.dbName, STATEMENT_DB_VERSION);
      } catch (err) {
        reject(err);
        return;
      }
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STATEMENT_STORE)) {
          const os = db.createObjectStore(STATEMENT_STORE, { keyPath: "id" });
          os.createIndex("site", "site", { unique: false });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
      req.onblocked = () => reject(new Error("indexedDB blocked"));
    }).catch((err) => {
      this._fallback = this._fallback || new MemoryStatementAdapter();
      this._db = null;
      throw err;
    });
    return this._db;
  }
  async _tx(mode, fn) {
    const db = await this._open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STATEMENT_STORE, mode);
      const os = tx.objectStore(STATEMENT_STORE);
      let out;
      Promise.resolve(fn(os)).then((v) => {
        out = v;
      });
      tx.oncomplete = () => resolve(out);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }
  async add(site, statement) {
    try {
      await this._tx("readwrite", (os) => {
        os.put({
          id: statement.id,
          site,
          v: 1,
          stored: new Date().toISOString(),
          statement: JSON.parse(JSON.stringify(statement)),
        });
      });
      return true;
    } catch {
      return this._fallback ? this._fallback.add(site, statement) : false;
    }
  }
  async list(site) {
    try {
      const rows = await this._tx(
        "readonly",
        (os) =>
          new Promise((resolve, reject) => {
            const req = os.index("site").getAll(site);
            req.onsuccess = () => resolve(req.result || []);
            req.onerror = () => reject(req.error);
          }),
      );
      return (rows || [])
        .sort((a, b) =>
          String(a.statement.timestamp).localeCompare(
            String(b.statement.timestamp),
          ),
        )
        .map((r) => r.statement);
    } catch {
      return this._fallback ? this._fallback.list(site) : [];
    }
  }
  async clear(site) {
    try {
      await this._tx(
        "readwrite",
        (os) =>
          new Promise((resolve, reject) => {
            const req = os.index("site").openCursor(site);
            req.onsuccess = () => {
              const cursor = req.result;
              if (cursor) {
                cursor.delete();
                cursor.continue();
              } else {
                resolve();
              }
            };
            req.onerror = () => reject(req.error);
          }),
      );
    } catch {
      // nothing stored or storage blocked
    }
    if (this._fallback) {
      await this._fallback.clear(site);
    }
  }
  // every statement of every site
  async clearAll() {
    try {
      await this._tx("readwrite", (os) => {
        os.clear();
      });
    } catch {
      // nothing stored or storage blocked
    }
    if (this._fallback) {
      await this._fallback.clearAll();
    }
  }
}

/**
 * Stub: statements sent to the HAXcms backend for a signed-in learner.
 * Not part of this release; the endpoint will be added to haxcms-nodejs and
 * haxcms-php with identical OpenAPI specs.
 */
export class HAXcmsServerStatementAdapter {
  constructor(options = {}) {
    this.endpoint = options.endpoint || null;
  }
  async add(_site, _statement) {
    throw new Error("HAXcmsServerStatementAdapter is not implemented yet");
  }
  async list(_site) {
    return [];
  }
  async clear(_site) {}
  async clearAll() {}
}

/**
 * Stub: statements sent to an owner configured xAPI Learning Record Store
 * (POST {endpoint}/statements, X-Experience-API-Version: 1.0.3). Only for
 * signed-in learners, never automatic.
 */
export class LRSStatementAdapter {
  constructor(options = {}) {
    this.endpoint = options.endpoint || null;
  }
  async add(_site, _statement) {
    throw new Error("LRSStatementAdapter is not implemented yet");
  }
  async list(_site) {
    return [];
  }
  async clear(_site) {}
  async clearAll() {}
}
