/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { unzipSync, strFromU8 } from "fflate";

/**
 * Reads a raw .h5p file (a zip) entirely in memory and exposes it as a small
 * virtual file system, so nothing has to be unpacked on a server.
 *
 * A .h5p package is self contained: h5p.json, content/content.json, content
 * assets, and every library the content needs, each in a "Machine.Name-1.2"
 * folder with its own library.json.
 */
const MIME = {
  js: "text/javascript",
  css: "text/css",
  json: "application/json",
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  mp4: "video/mp4",
  m4v: "video/mp4",
  webm: "video/webm",
  ogv: "video/ogg",
  mp3: "audio/mpeg",
  m4a: "audio/mp4",
  wav: "audio/wav",
  ogg: "audio/ogg",
  vtt: "text/vtt",
  woff: "font/woff",
  woff2: "font/woff2",
  ttf: "font/ttf",
  otf: "font/otf",
  eot: "application/vnd.ms-fontobject",
  pdf: "application/pdf",
  html: "text/html",
  txt: "text/plain",
};

export function mimeFor(path) {
  const ext = String(path).split(".").pop().toLowerCase();
  return MIME[ext] || "application/octet-stream";
}

/** Chunked base64 so large assets do not blow the call stack. */
export function toDataUri(bytes, mime) {
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return `data:${mime};base64,${btoa(bin)}`;
}

/** Resolve "a/b/../c.png" style relative paths against a base directory. */
export function resolvePath(baseDir, rel) {
  const out = baseDir ? baseDir.split("/").filter(Boolean) : [];
  for (const part of rel.split("/")) {
    if (part === "..") out.pop();
    else if (part && part !== ".") out.push(part);
  }
  return out.join("/");
}

export class H5PPackage {
  constructor(files) {
    /** @type {Map<string, Uint8Array>} */
    this.files = files;
    this._urls = new Map();
    this.h5p = this.json("h5p.json");
    if (!this.h5p || !this.h5p.mainLibrary) {
      throw new Error("This file is not an H5P package (h5p.json is missing).");
    }
    this.contentJson = this.text("content/content.json");
    if (this.contentJson === null) {
      throw new Error("This H5P package has no content/content.json.");
    }
    this.libraryFolders = [...files.keys()]
      .filter((p) => p.endsWith("/library.json") && p.split("/").length === 2)
      .map((p) => p.split("/")[0]);
    this.libraries = this.resolveLibraries();
  }

  has(path) {
    return this.files.has(path);
  }

  bytes(path) {
    return this.files.get(path) || null;
  }

  text(path) {
    const b = this.files.get(path);
    return b ? strFromU8(b) : null;
  }

  json(path) {
    const t = this.text(path);
    return t === null ? null : JSON.parse(t);
  }

  /** Find the folder for a { machineName, majorVersion, minorVersion } dependency. */
  folderFor(dep) {
    const exact = `${dep.machineName}-${dep.majorVersion}.${dep.minorVersion}`;
    if (this.libraryFolders.includes(exact)) return exact;
    // be forgiving: same major version, highest minor available
    const prefix = `${dep.machineName}-${dep.majorVersion}.`;
    const near = this.libraryFolders
      .filter((f) => f.startsWith(prefix))
      .sort((a, b) => parseInt(b.split(".").pop()) - parseInt(a.split(".").pop()));
    return near[0] || null;
  }

  /**
   * Depth-first walk of preloadedDependencies so every library comes after
   * the libraries it depends on: the order H5P needs scripts and styles in.
   */
  resolveLibraries() {
    const ordered = [];
    const seen = new Set();
    const missing = [];
    const visit = (dep) => {
      const folder = this.folderFor(dep);
      if (!folder) {
        missing.push(`${dep.machineName} ${dep.majorVersion}.${dep.minorVersion}`);
        return;
      }
      if (seen.has(folder)) return;
      seen.add(folder);
      const lib = this.json(`${folder}/library.json`);
      (lib.preloadedDependencies || []).forEach(visit);
      ordered.push({
        folder,
        machineName: lib.machineName,
        title: lib.title,
        license: lib.license,
        js: (lib.preloadedJs || []).map((f) => f.path),
        css: (lib.preloadedCss || []).map((f) => f.path),
      });
    };
    (this.h5p.preloadedDependencies || []).forEach(visit);
    if (missing.length) {
      throw new Error(
        "This package is missing libraries it needs: " + missing.join(", "),
      );
    }
    return ordered;
  }

  /** The "Machine.Name 1.2" string H5P uses to find the main runnable. */
  get mainLibraryString() {
    const dep = this.h5p.preloadedDependencies.find(
      (d) => d.machineName === this.h5p.mainLibrary,
    );
    return `${dep.machineName} ${dep.majorVersion}.${dep.minorVersion}`;
  }

  get totalBytes() {
    let n = 0;
    this.files.forEach((b) => (n += b.length));
    return n;
  }

  /**
   * blob: URL for a content asset (video, image, audio), cached. Paths come
   * from content.json and are relative to the content/ folder.
   */
  contentUrl(path) {
    let p = String(path).replace(/^\/+/, "");
    let key = "content/" + p;
    if (!this.files.has(key)) {
      try {
        key = "content/" + decodeURIComponent(p);
      } catch (e) {
        /* leave key as is */
      }
    }
    const bytes = this.files.get(key);
    if (!bytes) return null;
    if (!this._urls.has(key)) {
      this._urls.set(
        key,
        URL.createObjectURL(new Blob([bytes], { type: mimeFor(key) })),
      );
    }
    return this._urls.get(key);
  }

  dispose() {
    this._urls.forEach((u) => URL.revokeObjectURL(u));
    this._urls.clear();
  }
}

/**
 * @param {Uint8Array} bytes the raw .h5p file
 * @returns {H5PPackage}
 */
export function unpackH5P(bytes) {
  let entries;
  try {
    entries = unzipSync(bytes);
  } catch (e) {
    throw new Error("Could not read this file as a zip archive (.h5p).");
  }
  const files = new Map();
  const names = Object.keys(entries);
  // some exporters wrap everything in one top level folder; unwrap it
  let strip = "";
  if (!entries["h5p.json"]) {
    const hit = names.find((n) => /^[^/]+\/h5p\.json$/.test(n));
    if (hit) strip = hit.slice(0, hit.indexOf("/") + 1);
  }
  for (const name of names) {
    let p = name.replace(/\\/g, "/");
    if (strip) {
      if (!p.startsWith(strip)) continue;
      p = p.slice(strip.length);
    }
    p = p.replace(/^\.?\/+/, "");
    if (!p || p.endsWith("/")) continue;
    // never let an entry climb out of the package
    if (p.split("/").includes("..") || p.startsWith("__MACOSX/")) continue;
    files.set(p, entries[name]);
  }
  return new H5PPackage(files);
}
