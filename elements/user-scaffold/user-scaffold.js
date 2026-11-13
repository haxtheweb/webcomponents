/**
 * Copyright 2023 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { validURL } from "@haxtheweb/utils/lib/url.js";
import {
  LocalStorageMemoryAdapter,
  IndexedDBStatementAdapter,
} from "./lib/user-scaffold-storage.js";
import {
  observable,
  makeObservable,
  computed,
  configure,
  autorun,
  toJS,
} from "mobx";
configure({ enforceActions: false }); // strict mode off
// register globally so we can make sure there is only one
globalThis.UserScaffold = globalThis.UserScaffold || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same user-scaffold element, making it a singleton.
globalThis.UserScaffold.requestAvailability = () => {
  // if there is no single instance, generate one and append it to end of the document
  if (
    !globalThis.UserScaffold.instance &&
    globalThis.document &&
    globalThis.document.body
  ) {
    globalThis.UserScaffold.instance =
      globalThis.document.createElement("user-scaffold");
    if (globalThis.document && globalThis.document.body) {
      globalThis.document.body.appendChild(globalThis.UserScaffold.instance);
    }
  }
  return globalThis.UserScaffold.instance;
};
export const UserScaffoldInstance =
  globalThis.UserScaffold.requestAvailability();

const MEMORYINTERVALPOLLING = 300;
export const USER_PROFILE_VERSION = 1;
const PROFILE_KEY = "profile";
// verbs that finish an activity on their own
const DONE_VERBS = ["completed", "passed", "failed"];
const verbKeyOf = (statement) => {
  const v = statement && statement.verb ? statement.verb : {};
  return (
    (v.display && v.display["en-US"]) ||
    String(v.id || "")
      .split("/")
      .pop() ||
    "interacted"
  );
};
// result extensions whose IRI ends in "/progress" say how far through an
// activity the learner is, 0 to 1: the xAPI video profile
// (https://w3id.org/xapi/video/extensions/progress, media) and HAX
// (https://haxtheweb.org/xapi/extensions/progress, page reading)
const PROGRESS_EXTENSION = "progress";
// a progress value as a share from 0 to 1, or null; a value above 1 is read
// as a percentage (statements imported from tools that send 0 to 100)
const progressShare = (value) => {
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (typeof n !== "number" || !isFinite(n)) {
    return null;
  }
  const share = n > 1 ? n / 100 : n;
  return Math.min(1, Math.max(0, share));
};
const round3 = (n) => Math.round(n * 1000) / 1000;
// verbs an element sends at most once per activity, ever; progressed counts
// once per progress share (0.25, 0.5, 0.75), so elements that report going
// through media or slides in steps can tell what was already sent
const MILESTONE_VERBS = ["attempted", "progressed", "completed"];
export const milestoneKey = (verb, progress) =>
  verb === "progressed" && typeof progress === "number"
    ? `progressed@${round3(progress)}`
    : verb;
// the most ranges an activity's coverage keeps (a learner skipping around a
// very long video); past it the closest ranges are joined
const MAX_COVERED_RANGES = 200;
/**
 * Inclusive whole-number ranges ([[from, to], ...]: seconds of media, slide
 * indexes) sorted and joined where they touch or overlap; anything that is
 * not a pair of numbers is dropped
 */
export const mergeRanges = (ranges) => {
  const list = (Array.isArray(ranges) ? ranges : [])
    .filter(
      (r) =>
        Array.isArray(r) &&
        r.length === 2 &&
        isFinite(Number(r[0])) &&
        isFinite(Number(r[1])),
    )
    .map((r) => {
      const a = Math.max(0, Math.floor(Number(r[0])));
      const b = Math.max(0, Math.floor(Number(r[1])));
      return a <= b ? [a, b] : [b, a];
    })
    .sort((x, y) => x[0] - y[0]);
  const out = [];
  list.forEach((r) => {
    const prev = out[out.length - 1];
    if (prev && r[0] <= prev[1] + 1) {
      prev[1] = Math.max(prev[1], r[1]);
    } else {
      out.push([r[0], r[1]]);
    }
  });
  while (out.length > MAX_COVERED_RANGES) {
    let at = 0;
    let gap = Infinity;
    for (let i = 1; i < out.length; i++) {
      const g = out[i][0] - out[i - 1][1];
      if (g < gap) {
        gap = g;
        at = i;
      }
    }
    out[at - 1][1] = out[at][1];
    out.splice(at, 1);
  }
  return out;
};
const extensionOf = (obj, suffix) => {
  const ext = obj && obj.extensions ? obj.extensions : {};
  const key = Object.keys(ext).find((k) => k.endsWith(`/${suffix}`));
  return key ? ext[key] : undefined;
};
const newUuid = () => {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") {
    return c.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (ch) => {
    const r = Math.floor(Math.random() * 16);
    return (ch === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
};
/**
 * `user-scaffold`
 * `memory and context to establish and maintain appropriate user scaffolding`
 *
 * Learner profile: long-term memory holds ONE profile for the person using
 * this browser (readProfile()), shaped as
 *   { v, preferences: { darkMode, soundStatus, audioDescription: {<src>: bool} },
 *     session: { firstVisit, lastVisit, visits, lastLogin },
 *     sites: { <siteKey>: { url, title, actor, firstVisit, lastVisit,
 *       pages: { <pageId>: { title, url, firstVisit, lastVisit, visits,
 *         activities: [activityId], trackable, trackableByTag, legacyRead
 *         (done before reading was tracked; counts as read) } },
 *       activities: { <activityId>: { page, tag, name, verb, verbs, count,
 *         first, last, trackable, done, progress (0 to 1, highest progress
 *         extension sent), reading (the page's own reading activity),
 *         status, success, firstTry (result of the first answer), attempts,
 *         maxAttempts, score, response (xAPI result.response, component ids
 *         for choice / matching / sequencing), responseText (the same in
 *         plain words, when the recorder resolved it), migratedFrom,
 *         milestones (attempted / progressed@share / completed keys already
 *         sent), state ({ covered: [[from, to]], resume }, where the learner
 *         is in media or slides, see updateActivityState) } },
 *       counts: { byElement: { <tag>: { <verb>: n } }, byVerb: { <verb>: n } },
 *       statementCount } },
 *     migrations: { <name>: when it ran } }
 * Every xAPI statement recorded is also appended to the statements list
 * (IndexedDB by default, see lib/user-scaffold-storage.js). Nothing here is
 * sent anywhere; the actor of each site is a random per-device account.
 *
 * @demo demo/index.html
 * @element user-scaffold
 */
export class UserScaffold extends HTMLElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "user-scaffold";
  }

  constructor() {
    super();
    // DEBUG MODE
    this.debug = false;
    this.windowControllers = new AbortController();
    this.stMemory = {
      interactionDelay: 0,
      interactionCount: 0,
    };
    this._memoryAdapter = new LocalStorageMemoryAdapter();
    this._statementAdapter = new IndexedDBStatementAdapter();
    this._seenStatements = new Set();
    this.ltMemory = this._memoryAdapter.load();
    this.action = {
      type: null,
      architype: null,
    };
    this.data = {
      raw: null,
      value: null,
      architype: null,
    };
    this.active = true;
    // event wiring
    this.userActionArchitypes();
    makeObservable(this, {
      debug: observable,
      stMemory: observable,
      ltMemory: observable,
      action: observable,
      data: observable,
      active: observable,
      memory: computed,
    });
    autorun(() => {
      if (this.debug) {
        console.trace(this);
      }
    });
  }
  // @todo active / inactive state -- any program NOT scaffold needs to sete active false
  // required action - here'es something and you MUST pick one (docx, cancel edited page)
  // suggested action - here's some things you MIGHT want to do (link that inserts title instead)

  // brings in our standard user action architypes
  // these should provide the basis for understanding
  // what the user is attempting to do in an application
  userActionArchitypes() {
    // count idle time (interactionDelay) until the cap, then stop; an
    // interaction resets the delay to 0 and starts counting again
    this._scheduleInteractionTick();
    // events
    globalThis.addEventListener("click", this.userMouseAction.bind(this), {
      signal: this.windowControllers.signal,
    });
    // @todo COMMENT IN AFTER WE GET UX PATTERN DOWN FOR USERS PASTING
    /*globalThis.addEventListener("paste", this.userPasteAction.bind(this), {
      signal: this.windowControllers.signal,
    });
    globalThis.addEventListener("keydown", this.userKeyDownAction.bind(this), {
      signal: this.windowControllers.signal,
    });*/
    globalThis.addEventListener("drop", this.userDropAction.bind(this), {
      signal: this.windowControllers.signal,
    });
    globalThis.addEventListener("dragover", this.userDragAction.bind(this), {
      signal: this.windowControllers.signal,
    });
    // another tab of this origin saved long-term memory: take its copy, so
    // the next save here does not write back a stale profile over it
    globalThis.addEventListener("storage", this._onStorage.bind(this), {
      signal: this.windowControllers.signal,
    });
  }
  /**
   * One step of the idle counter: same cadence and cap as the old
   * always-on 300ms interval, but it stops once the cap is reached instead of
   * waking the page 3 times a second forever. interactionInterval holds the
   * pending timer id (null when not counting).
   */
  _scheduleInteractionTick() {
    if (this.interactionInterval || this.__interactionStopped) {
      return;
    }
    this.interactionInterval = setTimeout(() => {
      this.interactionInterval = null;
      if (!this.active) {
        // not tracking right now; keep checking so counting resumes
        this._scheduleInteractionTick();
        return;
      }
      // limit writes; not going to track beyond the cap
      if (this.readMemory("interactionDelay") <= MEMORYINTERVALPOLLING * 10) {
        this.incrementWriteMemory(
          "interactionDelay",
          MEMORYINTERVALPOLLING * 2,
        );
        this._scheduleInteractionTick();
      }
    }, MEMORYINTERVALPOLLING);
  }
  _onStorage(e) {
    const adapter = this._memoryAdapter;
    if (
      e &&
      adapter &&
      adapter.key &&
      e.key === adapter.key &&
      typeof adapter.load === "function"
    ) {
      this.ltMemory = adapter.load() || {};
    }
  }
  userKeyDownAction(e) {
    if (e.isTrusted) {
      this.action = {
        type: "key",
        architype: "input",
      };
      this.data = {
        raw: e.key,
        value: e.key,
        architype: "text",
      };
      this.writeMemory("recentTarget", e.target);
      this.writeMemory("interactionDelay", 0);
    }
  }
  // user has pasted, anywhere which is them indicating
  // they want to bring something into the application
  userPasteAction(e) {
    if (e.isTrusted) {
      this.action = {
        type: "paste",
        architype: "input",
      };
      let pasteContent = "";
      // default is text
      let architype = "text";
      // intercept paste event
      if (e.clipboardData || e.originalEvent.clipboardData) {
        pasteContent = (e.originalEvent || e).clipboardData.getData(
          "text/html",
        );
        // if it is purely plain text it could fail to come across as HTML and be empty
        if (pasteContent == "") {
          pasteContent = (e.originalEvent || e).clipboardData.getData("text");
        } else {
          architype = "text/html";
        }
      } else if (globalThis.clipboardData) {
        pasteContent = globalThis.clipboardData.getData("Text");
      }
      const raw = pasteContent;
      pasteContent = pasteContent.trim();
      // clear empty span tags that can pop up
      pasteContent = pasteContent.replace(/<span>\s*?<\/span>/g, " ");
      //remove styling
      // (property names cannot contain whitespace, ":", ";" or quotes, and the
      // value class already covers whitespace, so each declaration can only be
      // consumed one way and matching stays linear)
      pasteContent = pasteContent.replace(
        /style="(?:[^\s:;"]+:[^;"]+;\s*)*"/g,
        "",
      );
      // clean up div tags that can come in from contenteditable pastes
      // p tags make more sense in the content area
      pasteContent = pasteContent.replace(/<div/g, "<p");
      pasteContent = pasteContent.replace(/<\/div>/g, "</p>");
      let safe = pasteContent;
      // evaluate architype based on what this might be..
      // look for base64 like copy and paste of an image from clipboard
      if (this.isBase64(pasteContent)) {
        architype = "base64";
      } else if (e.clipboardData.files.length > 0) {
        architype = "file";
        if (e.clipboardData.files.length > 1) {
          architype = "files";
        }
      } else if (validURL(pasteContent)) {
        architype = "url";
      }

      this.data = {
        raw: raw,
        value: safe,
        architype: architype,
      };
    }
  }
  // dropping a file in implies certain capabilities
  userDropAction(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    if (e.isTrusted) {
      if (e.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        [...e.dataTransfer.items].forEach((item, _i) => {
          // If dropped items aren't files, reject them
          if (item.kind === "file") {
            let file = item.getAsFile();
            this.action = {
              type: "drop",
              architype: "input",
            };
            this.data = {
              event: e,
              file: file,
              raw: e.dataTransfer.items[0].type,
              value: e.dataTransfer.items[0].type,
              architype: e.dataTransfer.items[0].kind,
            };
          }
        });
      } else {
        // Use DataTransfer interface to access the file(s)
        // this branch only runs when e.dataTransfer.items is absent,
        // so describe the drop from the file itself
        [...e.dataTransfer.files].forEach((file, _i) => {
          this.action = {
            type: "drop",
            architype: "input",
          };
          this.data = {
            event: e,
            file: file,
            raw: file.type,
            value: file.type,
            architype: "file",
          };
        });
      }
    }
  }
  // dragging a file in implies certain capabilities
  userDragAction(e) {
    if (
      e.isTrusted &&
      e.dataTransfer &&
      e.dataTransfer.items &&
      e.dataTransfer.items.length > 0
    ) {
      this.action = {
        type: "drag",
        architype: "input",
      };
      this.data = {
        raw: e.dataTransfer.items[0].type,
        value: e.dataTransfer.items[0].type,
        architype: e.dataTransfer.items[0].kind,
      };
    }
  }

  // reset interaction counter
  userMouseAction(e) {
    // don't respond to fake click events
    if (e.isTrusted) {
      this.action = {
        type: "click",
        architype: "input",
      };
      this.writeMemory("recentTarget", e.target);
      this.writeMemory("interactionDelay", 0);
      this.incrementWriteMemory("interactionCount", 1);
    }
  }
  incrementWriteMemory(key, value, type = "short") {
    let prop = "stMemory";
    if (type == "long") {
      prop = "ltMemory";
    }
    this.writeMemory(key, this[prop][key] + value, type);
  }
  // write memory state for long or short term memory
  // short is default, while long also is going to write localStorage
  writeMemory(key, value, type = "short") {
    let prop = "stMemory";
    if (type == "long") {
      prop = "ltMemory";
      this[prop][key] = value;
      this._saveLongTerm();
    } else {
      this[prop][key] = value;
      // an interaction reset the idle counter: start counting again
      if (key === "interactionDelay" && value <= MEMORYINTERVALPOLLING * 10) {
        this._scheduleInteractionTick();
      }
    }
  }
  // remove from memory
  deleteMemory(key, type = "short") {
    let prop = "stMemory";
    if (type == "long") {
      prop = "ltMemory";
      delete this[prop][key];
      // keep the rest of long-term memory (the learner profile lives there);
      // removing the whole storage key used to drop every other value
      this._saveLongTerm();
    } else {
      delete this[prop][key];
    }
  }
  // read memory state
  // presence check instead of a falsy check so stored values of 0 (e.g.
  // a palette index of 0) read back as 0 instead of null
  readMemory(key) {
    if (key in this.memory) {
      return toJS(this.memory[key]);
    }
    return null;
  }
  // combine long and short term memory
  // this should ensure that short overrides long if
  // key is the same
  get memory() {
    return { ...this.ltMemory, ...this.stMemory };
  }
  _saveLongTerm() {
    return this._memoryAdapter.save(toJS(this.ltMemory));
  }
  /**
   * Swap where long-term memory is kept (see lib/user-scaffold-storage.js).
   * Reloads long-term memory from the new adapter.
   */
  setMemoryAdapter(adapter) {
    if (adapter && typeof adapter.load === "function") {
      this._memoryAdapter = adapter;
      this.ltMemory = adapter.load() || {};
    }
  }
  /**
   * Swap where the statements list is kept (memory, IndexedDB, later the
   * HAXcms server or an LRS)
   */
  setStatementAdapter(adapter) {
    if (adapter && typeof adapter.add === "function") {
      this._statementAdapter = adapter;
    }
  }
  get statementAdapter() {
    return this._statementAdapter;
  }
  // the profile object inside long-term memory, created on first use
  _profile() {
    let p = this.ltMemory[PROFILE_KEY];
    if (!p || typeof p !== "object" || p.v !== USER_PROFILE_VERSION) {
      this.ltMemory[PROFILE_KEY] = {
        v: USER_PROFILE_VERSION,
        preferences: {},
        session: {},
        sites: {},
        // a new profile has nothing recorded before reading was tracked
        migrations: { readingProgress: new Date().toISOString() },
      };
      p = this.ltMemory[PROFILE_KEY];
    } else if (!p.migrations || !p.migrations.readingProgress) {
      this._migrateReading(p);
    }
    return p;
  }
  /**
   * Once per profile recorded before page reading was tracked
   * (haxtheweb/issues#3269): a page that was done then (every trackable
   * activity on it done) is marked legacyRead, so it stays done now that a
   * page also has to be read. Nothing else changes.
   */
  _migrateReading(p) {
    p.migrations = p.migrations || {};
    Object.values(p.sites || {}).forEach((siteRec) => {
      if (!siteRec || !siteRec.pages || !siteRec.activities) {
        return;
      }
      Object.values(siteRec.pages).forEach((page) => {
        const acts = (page.activities || [])
          .map((id) => siteRec.activities[id])
          .filter((a) => a && a.trackable !== false);
        const trackable = Math.max(page.trackable || 0, acts.length);
        if (acts.length && acts.filter((a) => a.done).length >= trackable) {
          page.legacyRead = true;
        }
      });
    });
    p.migrations.readingProgress = new Date().toISOString();
    this._saveLongTerm();
  }
  /**
   * Plain copy of the learner profile
   */
  readProfile() {
    return toJS(this._profile());
  }
  readPreference(key, fallback = null) {
    const prefs = this._profile().preferences;
    return key in prefs ? toJS(prefs[key]) : fallback;
  }
  writePreference(key, value) {
    const prefs = this._profile().preferences;
    if (JSON.stringify(toJS(prefs[key])) !== JSON.stringify(value)) {
      prefs[key] = value;
      this._saveLongTerm();
    }
  }
  /**
   * Note a visit (and a sign in when login is true)
   */
  recordSession({ login = false } = {}) {
    const s = this._profile().session;
    const now = new Date().toISOString();
    if (!s.firstVisit) {
      s.firstVisit = now;
    }
    s.lastVisit = now;
    s.visits = (s.visits || 0) + 1;
    if (login) {
      s.lastLogin = now;
    }
    this._saveLongTerm();
  }
  /**
   * The record kept for one site
   */
  readSite(site) {
    const rec = this._profile().sites[site];
    return rec ? toJS(rec) : null;
  }
  _site(site, info = {}) {
    const sites = this._profile().sites;
    if (!sites[site]) {
      sites[site] = {
        url: info.url || site,
        title: info.title || "",
        actor: {
          objectType: "Agent",
          account: { homePage: info.url || site, name: newUuid() },
        },
        firstVisit: new Date().toISOString(),
        lastVisit: null,
        pages: {},
        activities: {},
        counts: { byElement: {}, byVerb: {} },
        statementCount: 0,
      };
    }
    if (info.title && sites[site].title !== info.title) {
      sites[site].title = info.title;
    }
    return sites[site];
  }
  /**
   * Pseudonymous xAPI actor for a site: a random account kept on this
   * device, never a name or email.
   */
  siteActor(site, info = {}) {
    const existed = Boolean(this._profile().sites[site]);
    const rec = this._site(site, info);
    if (!existed) {
      this._saveLongTerm();
    }
    return toJS(rec.actor);
  }
  _page(siteRec, page, info = {}) {
    if (!siteRec.pages[page]) {
      siteRec.pages[page] = {
        title: info.title || "",
        url: info.url || "",
        firstVisit: null,
        lastVisit: null,
        visits: 0,
        activities: [],
      };
    }
    const p = siteRec.pages[page];
    if (info.title) {
      p.title = info.title;
    }
    if (info.url) {
      p.url = info.url;
    }
    return p;
  }
  /**
   * Note that a page of a site was opened
   */
  recordPageVisit(site, page, info = {}) {
    if (!site || !page) {
      return;
    }
    const siteRec = this._site(site, info.site || {});
    const p = this._page(siteRec, page, info);
    const now = new Date().toISOString();
    if (!p.firstVisit) {
      p.firstVisit = now;
    }
    p.lastVisit = now;
    p.visits = (p.visits || 0) + 1;
    siteRec.lastVisit = now;
    this._saveLongTerm();
  }
  /**
   * How many trackable elements a page holds, overall and per tag
   */
  setPageTrackable(site, page, count, byTag = {}) {
    if (!site || !page) {
      return;
    }
    const p = this._page(this._site(site), page);
    if (
      p.trackable !== count ||
      JSON.stringify(toJS(p.trackableByTag || {})) !== JSON.stringify(byTag)
    ) {
      p.trackable = count;
      p.trackableByTag = { ...byTag };
      this._saveLongTerm();
    }
  }
  /**
   * Record one xAPI statement for a site. Updates the activity summary,
   * counts and the page it belongs to, and appends the statement to the
   * statements list. Returns the activity summary, or null when skipped
   * (already recorded, or an import for an activity that already has data).
   * @param {string} site
   * @param {Object} statement xAPI statement
   * @param {Object} meta { page, tag, trackable, imported, pageTitle,
   *   responseText (result.response in plain words), legacyId (an older id
   *   of the same activity whose data moves to this one, once), replay
   *   (rebuilding from stored statements: not deduplicated, not stored),
   *   reading (the statement is about reading the page itself) }
   */
  recordStatement(site, statement, meta = {}) {
    if (!site || !statement || !statement.object || !statement.object.id) {
      return null;
    }
    // meta.replay: rebuilding the profile from statements already stored
    // (repairSite); not new, so neither deduplicated nor stored again
    if (
      !meta.replay &&
      statement.id &&
      this._seenStatements.has(statement.id)
    ) {
      return null;
    }
    const siteRec = this._site(site);
    const id = statement.object.id;
    // activity ids key a plain object; never let one reach its prototype
    if (
      typeof id !== "string" ||
      id === "__proto__" ||
      id === "constructor" ||
      id === "prototype"
    ) {
      return null;
    }
    if (meta.legacyId) {
      this._migrateActivity(siteRec, meta.legacyId, id);
    }
    const existing = siteRec.activities[id];
    if (meta.imported && existing && existing.count > 0) {
      return null;
    }
    if (statement.id) {
      this._seenStatements.add(statement.id);
    }
    const verb = verbKeyOf(statement);
    const def = statement.object.definition || {};
    const result = statement.result || {};
    const ctxExt = statement.context || {};
    const tag = meta.tag || extensionOf(ctxExt, "element") || "";
    const ts = statement.timestamp || new Date().toISOString();
    const act = existing || {
      page: meta.page || "",
      tag,
      name: "",
      first: ts,
      count: 0,
      verbs: {},
      done: false,
    };
    if (meta.page && !act.page) {
      act.page = meta.page;
    }
    const nameMap = def.name || {};
    const name = nameMap[Object.keys(nameMap)[0]];
    if (name) {
      act.name = name;
    }
    if (def.interactionType) {
      act.interactionType = def.interactionType;
    }
    act.trackable = meta.trackable !== false;
    if (meta.reading) {
      act.reading = true;
    }
    act.verb = verb;
    act.verbs[verb] = (act.verbs[verb] || 0) + 1;
    act.count += 1;
    act.last = ts;
    if (typeof result.success === "boolean") {
      act.success = result.success;
      if (verb === "answered") {
        act.status = result.success ? "correct" : "incorrect";
        // the result of the first answer, kept once (first-try accuracy)
        if (typeof act.firstTry !== "boolean") {
          act.firstTry = result.success;
        }
      }
    }
    if (result.score) {
      act.score = { ...result.score };
    }
    if (result.response != null) {
      act.response = result.response;
      // the response in plain words (component ids resolved through the
      // object definition by the caller), for dashboards on this device
      if (typeof meta.responseText === "string") {
        act.responseText = meta.responseText;
      } else {
        delete act.responseText;
      }
    }
    const attempts = extensionOf(result, "attempts");
    if (attempts != null) {
      act.attempts = attempts;
    }
    const maxAttempts = extensionOf(result, "max-attempts");
    if (maxAttempts != null) {
      act.maxAttempts = maxAttempts;
    }
    if (result.completion === true || DONE_VERBS.includes(verb)) {
      act.done = true;
    }
    // how far through, kept at its highest (progress never goes back)
    const progress = progressShare(extensionOf(result, PROGRESS_EXTENSION));
    if (progress !== null && progress > (act.progress || 0)) {
      act.progress = progress;
    }
    if (MILESTONE_VERBS.includes(verb)) {
      const key = milestoneKey(verb, progress);
      act.milestones = Array.isArray(act.milestones) ? act.milestones : [];
      if (!act.milestones.includes(key)) {
        act.milestones.push(key);
      }
    }
    if (meta.imported) {
      act.imported = true;
    }
    siteRec.activities[id] = act;
    if (act.page) {
      const p = this._page(siteRec, act.page, { title: meta.pageTitle });
      if (!p.activities.includes(id)) {
        p.activities.push(id);
      }
    }
    const byEl = siteRec.counts.byElement;
    const elKey = tag || "unknown";
    byEl[elKey] = byEl[elKey] || {};
    byEl[elKey][verb] = (byEl[elKey][verb] || 0) + 1;
    siteRec.counts.byVerb[verb] = (siteRec.counts.byVerb[verb] || 0) + 1;
    siteRec.statementCount = (siteRec.statementCount || 0) + 1;
    this._saveLongTerm();
    if (this._statementAdapter && !meta.replay) {
      Promise.resolve(this._statementAdapter.add(site, statement)).catch(
        () => {},
      );
    }
    return toJS(act);
  }
  /**
   * Summary for one activity of a site, or null. legacyId: the id an older
   * version of the element keyed the same activity by (its content
   * fingerprint); when only that one has data it is moved to activityId
   * first, once.
   */
  readActivity(site, activityId, legacyId) {
    const siteRec = this._profile().sites[site];
    if (siteRec && legacyId) {
      this._migrateActivity(siteRec, legacyId, activityId);
    }
    const act = siteRec ? siteRec.activities[activityId] : null;
    return act ? toJS(act) : null;
  }
  /**
   * Where a learner is in an activity they go through in order (media,
   * slides), kept on its summary as `state` and overwritten as they go:
   * this is NOT a statement and adds nothing to the statements list. Coverage
   * only grows (merged with what was covered before) and progress never goes
   * back; resume is replaced each time.
   * @param {string} site
   * @param {string} activityId the id statements about the activity use
   * @param {Object} state { covered: [[from, to], ...] whole-number inclusive
   *   ranges (seconds, slide indexes), resume: number (where to pick up),
   *   progress: 0 to 1 }
   * @param {Object} meta { page, tag, name, trackable }
   * @returns {Object|null} the activity summary, or null when skipped
   */
  updateActivityState(site, activityId, state = {}, meta = {}) {
    if (
      !site ||
      typeof activityId !== "string" ||
      !activityId ||
      activityId === "__proto__" ||
      activityId === "constructor" ||
      activityId === "prototype" ||
      !state ||
      typeof state !== "object"
    ) {
      return null;
    }
    const siteRec = this._site(site);
    const ts = new Date().toISOString();
    const act = siteRec.activities[activityId] || {
      page: meta.page || "",
      tag: meta.tag || "",
      name: "",
      first: ts,
      count: 0,
      verbs: {},
      done: false,
    };
    if (meta.page && !act.page) {
      act.page = meta.page;
    }
    if (meta.tag && !act.tag) {
      act.tag = meta.tag;
    }
    if (meta.name && !act.name) {
      act.name = String(meta.name);
    }
    if (typeof act.trackable !== "boolean") {
      act.trackable = meta.trackable !== false;
    }
    const prev = act.state && typeof act.state === "object" ? act.state : {};
    const next = { ...prev };
    if (Array.isArray(state.covered)) {
      next.covered = mergeRanges(
        (Array.isArray(prev.covered) ? prev.covered : []).concat(state.covered),
      );
    }
    const resume = Number(state.resume);
    if (state.resume != null && isFinite(resume) && resume >= 0) {
      next.resume = round3(resume);
    }
    act.state = next;
    const progress = progressShare(state.progress);
    if (progress !== null && progress > (act.progress || 0)) {
      act.progress = progress;
    }
    act.last = ts;
    siteRec.activities[activityId] = act;
    if (act.page) {
      const p = this._page(siteRec, act.page);
      if (!p.activities.includes(activityId)) {
        p.activities.push(activityId);
      }
    }
    this._saveLongTerm();
    return toJS(act);
  }
  /**
   * Move what was saved under activity id `from` to `to` (also in the page
   * lists), when `to` has nothing yet. Statements already in the statement
   * list keep the object id they were sent with. Returns true when moved.
   */
  _migrateActivity(siteRec, from, to) {
    if (
      !siteRec ||
      !from ||
      !to ||
      from === to ||
      !siteRec.activities[from] ||
      siteRec.activities[to]
    ) {
      return false;
    }
    const act = siteRec.activities[from];
    act.migratedFrom = from;
    siteRec.activities[to] = act;
    delete siteRec.activities[from];
    Object.keys(siteRec.pages || {}).forEach((pid) => {
      const list = siteRec.pages[pid].activities || [];
      const at = list.indexOf(from);
      if (at > -1) {
        if (list.includes(to)) {
          list.splice(at, 1);
        } else {
          list.splice(at, 1, to);
        }
      }
    });
    this._saveLongTerm();
    return true;
  }
  /**
   * Status of a page: "done" when it was read and every trackable activity
   * on it is done, "in-progress" when some of that is under way,
   * "visited" when opened with nothing under way, "not-started" otherwise.
   */
  pageStatus(site, page) {
    return this.pageProgress(site, page).status;
  }
  /**
   * Progress of one page (haxtheweb/issues#3269). A page is done when the
   * learner read it (scrolled through its content: the activity recorded
   * with meta.reading) and engaged every trackable item on it.
   * @returns {{ status: string, engaged: number, done: number,
   *   trackable: number, percent: number, reading: Object, items: Object[],
   *   itemsDone: number, itemsTotal: number }}
   *   engaged / done / trackable: trackable elements (as before; reading is
   *   not one of them), engaged ones, done ones and how many the page holds;
   *   reading: { key, kind: "reading", tag, progress, done };
   *   items: reading first, then each trackable item { key (activity id, or
   *   "<tag>#<n>" for one not engaged yet), kind: "activity", tag, progress,
   *   done }; an item's progress is 1 when done, else the highest progress
   *   extension it sent (media 0.5 = half watched), else 0;
   *   percent: the average progress of all items, 0 to 1
   */
  pageProgress(site, page) {
    const siteRec = this._profile().sites[site];
    const p = siteRec ? siteRec.pages[page] : null;
    const itemProgress = (a) =>
      a.done ? 1 : Math.min(1, Math.max(0, Number(a.progress) || 0));
    if (!p) {
      const reading = {
        key: "",
        kind: "reading",
        tag: "",
        progress: 0,
        done: false,
      };
      return {
        status: "not-started",
        engaged: 0,
        done: 0,
        trackable: 0,
        percent: 0,
        reading,
        items: [reading],
        itemsDone: 0,
        itemsTotal: 1,
      };
    }
    const entries = (p.activities || [])
      .map((id) => [id, siteRec.activities[id]])
      .filter(([, a]) => a);
    const acts = entries.filter(([, a]) => a.trackable !== false && !a.reading);
    const readEntry = entries.find(([, a]) => a.reading);
    const readProgress = Math.max(
      p.legacyRead ? 1 : 0,
      readEntry ? itemProgress(readEntry[1]) : 0,
    );
    const reading = {
      key: readEntry
        ? readEntry[0]
        : String(p.url || "")
            .split("#")[0]
            .split("?")[0],
      kind: "reading",
      tag: readEntry ? readEntry[1].tag || "" : "",
      progress: readProgress,
      done: readProgress >= 1,
    };
    const done = acts.filter(([, a]) => a.done).length;
    // done = every trackable activity on the page is done, not only the
    // ones the learner has touched so far
    const trackable = Math.max(p.trackable || 0, acts.length);
    const items = [
      reading,
      ...acts.map(([id, a]) => ({
        key: id,
        kind: "activity",
        tag: a.tag || "",
        progress: itemProgress(a),
        done: Boolean(a.done),
      })),
    ];
    // trackable elements on the page not engaged yet, by tag where known
    let waiting = trackable - acts.length;
    const byTag = p.trackableByTag || {};
    const pending = (tag) => {
      const n = items.filter((i) => i.tag === tag).length + 1;
      items.push({
        key: `${tag}#${n}`,
        kind: "activity",
        tag,
        progress: 0,
        done: false,
      });
      waiting--;
    };
    Object.keys(byTag).forEach((tag) => {
      const engagedTag = acts.filter(([, a]) => a.tag === tag).length;
      for (let i = engagedTag; i < (byTag[tag] || 0) && waiting > 0; i++) {
        pending(tag);
      }
    });
    while (waiting > 0) {
      pending("");
    }
    const sum = items.reduce((t, i) => t + i.progress, 0);
    let status = "visited";
    if (reading.done && done >= trackable) {
      status = "done";
    } else if (acts.length || reading.progress > 0) {
      status = "in-progress";
    } else if (!p.visits) {
      status = "not-started";
    }
    return {
      status,
      engaged: acts.length,
      done,
      trackable,
      percent: round3(sum / items.length),
      reading,
      items,
      itemsDone: items.filter((i) => i.done).length,
      itemsTotal: items.length,
    };
  }
  /**
   * { done, total, byPage, engaged, percent, percentByPage } for a site;
   * pages limits it to those page ids (the site outline), otherwise every
   * page the profile knows. byPage: status of each page; percent: the
   * average of the page percents (pageProgress) over those pages, 0 to 1.
   */
  siteProgress(site, pages) {
    const siteRec = this._profile().sites[site];
    const ids = Array.isArray(pages)
      ? pages
      : siteRec
        ? Object.keys(siteRec.pages)
        : [];
    const byPage = {};
    const percentByPage = {};
    let done = 0;
    let sum = 0;
    ids.forEach((id) => {
      const pp = this.pageProgress(site, id);
      byPage[id] = pp.status;
      percentByPage[id] = pp.percent;
      sum += pp.percent;
      if (pp.status === "done") {
        done++;
      }
    });
    // anything that counts toward a page being done: a trackable activity,
    // or reading under way
    const engaged = siteRec
      ? Object.values(siteRec.activities).some((a) =>
          a.reading
            ? a.done || (Number(a.progress) || 0) > 0
            : a.trackable !== false,
        )
      : false;
    return {
      done,
      total: ids.length,
      byPage,
      engaged,
      percent: ids.length ? round3(sum / ids.length) : 0,
      percentByPage,
    };
  }
  /**
   * Copy preferences that elements kept under their own localStorage keys
   * into the profile, once per key. The old keys are left in place and stay
   * readable. Covered: video-player-ad-<source> (audio description per
   * video), app-hax-darkMode, app-hax-soundStatus.
   */
  importLegacyPreferences(storage = globalThis.localStorage) {
    const p = this._profile();
    p.migrations = p.migrations || {};
    let changed = false;
    try {
      if (!storage) {
        return false;
      }
      const ad = { ...(toJS(p.preferences.audioDescription) || {}) };
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key && key.indexOf("video-player-ad-") === 0) {
          const src = key.slice("video-player-ad-".length);
          if (!(src in ad)) {
            ad[src] = storage.getItem(key) === "true";
            changed = true;
          }
        }
      }
      if (changed) {
        p.preferences.audioDescription = ad;
      }
      [
        ["app-hax-darkMode", "darkMode"],
        ["app-hax-soundStatus", "soundStatus"],
      ].forEach(([key, pref]) => {
        const raw = storage.getItem(key);
        if (raw !== null && !(pref in p.preferences)) {
          try {
            p.preferences[pref] = JSON.parse(raw);
            changed = true;
          } catch {
            // not JSON; leave it
          }
        }
      });
    } catch {
      return false;
    }
    if (changed) {
      p.migrations.legacyPreferences = new Date().toISOString();
      this._saveLongTerm();
    }
    return changed;
  }
  /**
   * Counts for dashboards and insights, grouped one way, over a scope of
   * the site outline. Page tags, sections and ancestors are resolved at read
   * time from the outline given (the site manifest items), so the profile
   * never goes stale when an author retags or moves a page.
   * @param {Object} o
   * @param {string} o.site site key
   * @param {Array} [o.outline] [{ id, parent, title, tags }] (tags: array or
   *   comma separated string); without it, page / verb / element grouping
   *   and the "all" / "page" scopes still work
   * @param {string} [o.scope] "page" | "parent" (the page's parent and every
   *   page below it) | "branch" (the page and every page below it) |
   *   "children" (only the pages below it) | "all" (default)
   * @param {string} [o.pageId] outline item id the scope is relative to
   * @param {string} [o.groupBy] "page" (default) | "tag" | "section" (top
   *   level ancestor) | "verb" | "element" | "activity" (o.kindOf)
   * @param {string[]} [o.pages] explicit page ids to cover, used instead of
   *   scope / pageId when given
   * @param {string} [o.sectionRoot] for groupBy "section": group under the
   *   children of this outline item instead of the top level (pages outside
   *   it keep their top level section; the root itself is its own group)
   * @param {Function} [o.kindOf] for groupBy "activity": (activity, id) =>
   *   group key, or "" to leave the activity out of the groups (it still
   *   counts in totals); without it activities group by their last verb
   * @param {boolean} [o.trackableOnly] leave out activities that do not count
   *   toward a page being done (page visits, user-action)
   * @returns {{ scope, pageId, groupBy, pages: string[], groups: Object,
   *   totals: Object }} each group: { activities, done, statements,
   *   answered, correct, accuracy, firstTryCorrect, firstTryAccuracy,
   *   engaged (trackable activities), engagedDone, trackable, pages,
   *   visited (pages opened) }
   */
  summarize({
    site,
    outline,
    scope = "all",
    pageId,
    groupBy = "page",
    pages: only,
    sectionRoot,
    kindOf,
    trackableOnly = false,
  } = {}) {
    const siteRec = this.readSite(site) || { pages: {}, activities: {} };
    const items = Array.isArray(outline) ? outline : [];
    const byId = Object.create(null);
    items.forEach((i) => {
      byId[i.id] = i;
    });
    const childrenOf = (id) =>
      items.filter((i) => i.parent === id).map((i) => i.id);
    const below = (id) => {
      const out = [];
      const walk = (pid) =>
        childrenOf(pid).forEach((cid) => {
          out.push(cid);
          walk(cid);
        });
      walk(id);
      return out;
    };
    const known = Array.from(
      new Set([...items.map((i) => i.id), ...Object.keys(siteRec.pages)]),
    );
    let pages = known;
    if (Array.isArray(only)) {
      pages = only.filter((id) => typeof id === "string" && id);
    } else if (scope === "page") {
      pages = [pageId];
    } else if (scope === "branch") {
      pages = [pageId, ...below(pageId)];
    } else if (scope === "children") {
      pages = below(pageId);
    } else if (scope === "parent") {
      const parent = byId[pageId] ? byId[pageId].parent : null;
      pages = parent ? [parent, ...below(parent)] : known;
    }
    const inScope = new Set(pages);
    const tagsOf = (id) => {
      const t = byId[id] ? byId[id].tags : null;
      const list = Array.isArray(t) ? t : String(t || "").split(",");
      const clean = list.map((x) => String(x).trim()).filter(Boolean);
      return clean.length ? clean : ["(untagged)"];
    };
    const sectionOf = (id) => {
      if (sectionRoot && id === sectionRoot) {
        return id;
      }
      let cur = byId[id];
      let guard = 0;
      while (cur && cur.parent && byId[cur.parent] && guard++ < 50) {
        if (sectionRoot && cur.parent === sectionRoot) {
          return cur.id;
        }
        cur = byId[cur.parent];
      }
      return cur ? cur.id : id;
    };
    const blank = () => ({
      activities: 0,
      done: 0,
      statements: 0,
      answered: 0,
      correct: 0,
      accuracy: null,
      firstTryCorrect: 0,
      firstTryAccuracy: null,
      engaged: 0,
      engagedDone: 0,
      trackable: 0,
      pages: 0,
      visited: 0,
    });
    // a Map, so a tag or verb such as "__proto__" is just another key
    const groupMap = new Map();
    const group = (key) => {
      const k = String(key);
      if (!groupMap.has(k)) {
        groupMap.set(k, blank());
      }
      return groupMap.get(k);
    };
    const totals = blank();
    const pageKeys = (id) =>
      groupBy === "tag"
        ? tagsOf(id)
        : groupBy === "section"
          ? [sectionOf(id)]
          : groupBy === "page"
            ? [id]
            : null;
    pages.forEach((id) => {
      const p = siteRec.pages[id];
      if (!p) {
        return;
      }
      const visited = p.visits > 0 ? 1 : 0;
      totals.pages++;
      totals.visited += visited;
      totals.trackable += p.trackable || 0;
      const keys = pageKeys(id);
      if (keys) {
        keys.forEach((k) => {
          const g = group(k);
          g.pages++;
          g.visited += visited;
          g.trackable += p.trackable || 0;
        });
      }
    });
    Object.keys(siteRec.activities).forEach((aid) => {
      const a = siteRec.activities[aid];
      if (!inScope.has(a.page)) {
        return;
      }
      if (trackableOnly && a.trackable === false) {
        return;
      }
      const add = (g, statements) => {
        g.activities++;
        g.statements += statements;
        if (a.done) {
          g.done++;
        }
        if (a.trackable !== false) {
          g.engaged++;
          if (a.done) {
            g.engagedDone++;
          }
        }
        if (typeof a.success === "boolean") {
          g.answered++;
          if (a.success) {
            g.correct++;
          }
          // first answer right; records from before firstTry was kept
          // count when they were right within one attempt
          const first =
            typeof a.firstTry === "boolean"
              ? a.firstTry
              : a.success && (a.attempts == null || a.attempts <= 1);
          if (first) {
            g.firstTryCorrect++;
          }
        }
      };
      add(totals, a.count || 0);
      if (groupBy === "verb") {
        Object.keys(a.verbs || {}).forEach((v) => add(group(v), a.verbs[v]));
      } else if (groupBy === "element") {
        add(group(a.tag || "unknown"), a.count || 0);
      } else if (groupBy === "activity") {
        const key =
          typeof kindOf === "function" ? kindOf(a, aid) : a.verb || "";
        if (key) {
          add(group(key), a.count || 0);
        }
      } else {
        (pageKeys(a.page) || []).forEach((k) => add(group(k), a.count || 0));
      }
    });
    const groups = Object.fromEntries(groupMap);
    [totals, ...groupMap.values()].forEach((g) => {
      g.accuracy = g.answered
        ? Math.round((g.correct / g.answered) * 1000) / 1000
        : null;
      g.firstTryAccuracy = g.answered
        ? Math.round((g.firstTryCorrect / g.answered) * 1000) / 1000
        : null;
    });
    return { scope, pageId: pageId || null, groupBy, pages, groups, totals };
  }
  /**
   * Statements recorded for a site (async)
   */
  async statements(site) {
    return this._statementAdapter ? this._statementAdapter.list(site) : [];
  }
  /**
   * Bring a site's profile record back in line with its stored statements,
   * which are the source of truth; the profile record is a cache of them
   * (it can lose writes, e.g. when an older tab saved long-term memory over
   * a newer one). Activities the profile does not know, or knows from fewer
   * statements than are stored (stale), are rebuilt by replaying their
   * statements through recordStatement, oldest first, so they come out as
   * if recorded live; up to date ones are left alone, so running this again
   * changes nothing. Activities with more history than the stored
   * statements (statements kept only in memory) are kept.
   * Page visits are raised to the number of page reads stored.
   * @param {string} site
   * @param {Object[]} statements the site's stored statements
   * @param {Object} o
   * @param {Function} o.pageOf (statement) => outline item id, or ""
   * @param {Function} [o.trackableOf] (tag) => counts toward a page being done
   * @param {string} [o.pageElement] element tag of page reads ("haxcms-page")
   * @returns {number} statements replayed plus pages whose visits changed
   */
  repairSite(site, statements, { pageOf, trackableOf, pageElement } = {}) {
    if (!site || !Array.isArray(statements) || typeof pageOf !== "function") {
      return 0;
    }
    const existing = this._profile().sites[site];
    const known = new Set(
      existing ? Object.keys(existing.activities || {}) : [],
    );
    const sorted = statements
      .filter((st) => st && st.object && st.object.id)
      .sort((a, b) =>
        String(a.timestamp || "").localeCompare(String(b.timestamp || "")),
      );
    let changed = 0;
    // where the learner was (state) is not in any statement: it is kept
    // across a rebuild
    const keptState = new Map();
    // an activity the profile has with fewer statements than are stored is
    // stale (it missed writes): drop it and replay all of its statements
    const perObject = new Map();
    sorted.forEach((st) =>
      perObject.set(st.object.id, (perObject.get(st.object.id) || 0) + 1),
    );
    perObject.forEach((n, id) => {
      const act =
        existing &&
        Object.prototype.hasOwnProperty.call(existing.activities, id)
          ? existing.activities[id]
          : null;
      if (act && (act.count || 0) < n) {
        if (act.state) {
          keptState.set(id, { state: act.state, progress: act.progress });
        }
        delete existing.activities[id];
        known.delete(id);
      }
    });
    const reads = new Map();
    sorted.forEach((st) => {
      const page = pageOf(st) || "";
      const ctx = st.context || {};
      const tag = extensionOf(ctx, "element") || "";
      if (page && pageElement && tag === pageElement) {
        const r = reads.get(page) || { count: 0, first: "", last: "" };
        r.count += 1;
        r.first = r.first || st.timestamp || "";
        r.last = st.timestamp || r.last;
        reads.set(page, r);
      }
      if (known.has(st.object.id)) {
        return;
      }
      const done = this.recordStatement(site, st, {
        page,
        tag,
        trackable:
          typeof trackableOf === "function" ? Boolean(trackableOf(tag)) : true,
        reading: Boolean(pageElement) && tag === pageElement,
        replay: true,
      });
      if (done) {
        changed++;
      }
    });
    if (keptState.size) {
      const siteRec = this._site(site);
      keptState.forEach((kept, id) => {
        const act = siteRec.activities[id];
        if (act) {
          act.state = kept.state;
          if ((Number(kept.progress) || 0) > (act.progress || 0)) {
            act.progress = kept.progress;
          }
        }
      });
      this._saveLongTerm();
    }
    if (reads.size) {
      const siteRec = this._site(site);
      reads.forEach((r, page) => {
        const p = this._page(siteRec, page);
        if ((p.visits || 0) < r.count) {
          p.visits = r.count;
          p.firstVisit = p.firstVisit || r.first || null;
          if (!p.lastVisit || String(r.last) > String(p.lastVisit)) {
            p.lastVisit = r.last || p.lastVisit;
          }
          if (
            !siteRec.lastVisit ||
            String(r.last) > String(siteRec.lastVisit)
          ) {
            siteRec.lastVisit = r.last || siteRec.lastVisit;
          }
          changed++;
        }
      });
      this._saveLongTerm();
    }
    return changed;
  }
  /**
   * Forget everything recorded for a site on this device
   */
  async clearSite(site) {
    const sites = this._profile().sites;
    if (sites[site]) {
      delete sites[site];
      this._saveLongTerm();
    }
    if (this._statementAdapter) {
      await this._statementAdapter.clear(site);
    }
  }
  /**
   * Forget the whole learner profile on this device (preferences, session
   * and every site) and every statement kept for any site. Other long-term
   * memory keys are kept. The next site visit starts a new profile with new
   * pseudonymous actors.
   */
  async clearAll() {
    const sites = Object.keys(this._profile().sites || {});
    delete this.ltMemory[PROFILE_KEY];
    this._saveLongTerm();
    const adapter = this._statementAdapter;
    if (adapter) {
      if (typeof adapter.clearAll === "function") {
        await adapter.clearAll();
      } else {
        for (const site of sites) {
          await adapter.clear(site);
        }
      }
    }
  }
  /**
   * detect base64 object
   */
  isBase64(str) {
    try {
      return btoa(atob(str)) == str;
    } catch {
      return false;
    }
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    this.__interactionStopped = true;
    if (this.interactionInterval) {
      clearTimeout(this.interactionInterval);
      this.interactionInterval = null;
    }
    this.windowControllers.abort();
  }
}
globalThis.customElements.define(UserScaffold.tag, UserScaffold);
