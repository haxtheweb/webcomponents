/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { H5P_L10N } from "./h5p-l10n.js";
import { toDataUri, resolvePath, mimeFor } from "./h5p-package.js";

/**
 * Plays an unpacked H5PPackage (see h5p-package.js) with no server and no
 * service worker.
 *
 * H5P core normally writes <script src> / <link href> tags for every library
 * into an iframe, so every library file has to be reachable by URL. Here the
 * package's own files are in memory, so we write that iframe ourselves:
 *   - library JavaScript is inserted as inline scripts, in dependency order
 *   - library CSS is inlined with its url() assets turned into data: URIs
 *   - content assets (video, images, audio) are served as blob: URLs by
 *     overriding H5P.getPath inside the frame
 * H5P core itself (frame.bundle.js from h5p-standalone, MIT) is still used
 * unchanged to boot the content.
 */

const cache = {};
const cached = (key, make) => (cache[key] = cache[key] || make());

function ensureIntegration() {
  globalThis.H5P = globalThis.H5P || {};
  const I = (globalThis.H5PIntegration = globalThis.H5PIntegration || {});
  I.baseUrl = I.baseUrl || globalThis.location.origin;
  I.url = I.url || "h5p-package:";
  I.contents = I.contents || {};
  I.core = I.core || { styles: [], scripts: [] };
  I.ajax = I.ajax || {};
  I.saveFreq = I.saveFreq || false;
  I.postUserStatistics = false;
  I.l10n = { H5P: { ...H5P_L10N.H5P, ...((I.l10n && I.l10n.H5P) || {}) } };
  return I;
}

/** Load H5P core into the page once; the frames call back into it. */
function loadCoreIntoPage(coreBase) {
  return cached("page-core:" + coreBase, async () => {
    ensureIntegration();
    if (globalThis.H5P.init) return; // already there (h5p-standalone path)
    globalThis.H5P.preventInit = true;
    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = coreBase + "frame.bundle.js";
      s.onload = resolve;
      s.onerror = () => reject(new Error("Could not load H5P core."));
      document.head.append(s);
    });
  });
}

function fetchCoreSource(coreBase) {
  return cached("core-js:" + coreBase, async () => {
    const res = await fetch(coreBase + "frame.bundle.js");
    if (!res.ok) throw new Error("Could not load H5P core.");
    return res.text();
  });
}

/** Library CSS with relative url(...) references inlined from the package. */
function inlineCss(pkg, folder, path) {
  const css = pkg.text(`${folder}/${path}`);
  if (css === null) return "";
  const baseDir = [folder, ...path.split("/").slice(0, -1)].join("/");
  return css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (match, _q, url) => {
    if (/^(data:|https?:|blob:|\/\/|#)/i.test(url)) return match;
    const key = resolvePath(baseDir, url.split(/[?#]/)[0]);
    const bytes = pkg.bytes(key);
    return bytes ? `url("${toDataUri(bytes, mimeFor(key))}")` : match;
  });
}

function addScript(doc, code, name) {
  const s = doc.createElement("script");
  s.text = `${code}\n//# sourceURL=h5p-package/${name}`;
  doc.head.append(s);
}

/** Runs inside the frame, after core and libraries, before content starts. */
const FRAME_SHIM = (id) => `
(function () {
  var pkgs = window.parent.__h5pPackages || {};
  var pkg = pkgs[${JSON.stringify(id)}];
  if (!pkg) return;
  var origPath = H5P.getPath;
  H5P.getPath = function (path, contentId) {
    var p = String(path), hash = "", i = p.indexOf("#");
    if (i > -1) { hash = p.slice(i); p = p.slice(0, i); }
    var url = pkg.contentUrl(p);
    return url ? url + hash : origPath.call(H5P, path, contentId);
  };
  var origContent = H5P.getContentPath;
  H5P.getContentPath = function (path) {
    return pkg.contentUrl(path) || origContent.call(H5P, path);
  };
})();`;

/**
 * @param {HTMLElement} container where the player goes
 * @param {import("./h5p-package.js").H5PPackage} pkg
 * @param {{ id: string, coreBase: string, title?: string }} opts
 * @returns {Promise<{ iframe: HTMLIFrameElement, dispose: Function }>}
 */
export async function renderH5PPackage(container, pkg, opts) {
  const { id, coreBase } = opts;
  const [coreSource] = await Promise.all([
    fetchCoreSource(coreBase),
    loadCoreIntoPage(coreBase),
  ]);
  const I = ensureIntegration();
  const title = opts.title || pkg.h5p.title || "H5P content";

  globalThis.__h5pPackages = globalThis.__h5pPackages || {};
  globalThis.__h5pPackages[id] = pkg;
  I.contents["cid-" + id] = {
    library: pkg.mainLibraryString,
    title,
    url: "h5p-package:",
    contentUrl: "h5p-package:/content",
    jsonContent: pkg.contentJson,
    styles: [],
    scripts: [],
    fullScreen: false,
    displayOptions: {
      frame: false,
      copyright: false,
      embed: false,
      export: false,
      icon: false,
      copy: false,
    },
    metadata: { title, license: pkg.h5p.license || "U" },
  };

  const wrapper = document.createElement("div");
  wrapper.className = "h5p-iframe-wrapper";
  const iframe = document.createElement("iframe");
  iframe.className = "h5p-iframe";
  iframe.id = "h5p-iframe-" + id;
  iframe.title = title;
  iframe.setAttribute("data-content-id", id);
  iframe.setAttribute("scrolling", "no");
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("allowfullscreen", "true");
  iframe.style.cssText = "width:100%;height:100%;border:none;display:block;";
  wrapper.append(iframe);
  container.append(wrapper);

  const doc = iframe.contentDocument;
  const lang = (pkg.h5p.language && pkg.h5p.language !== "und" && pkg.h5p.language) || "en";
  doc.open();
  doc.write(
    '<!doctype html><html class="h5p-iframe" lang="' +
      lang +
      '"><head><meta charset="utf-8"><base target="_parent">' +
      '<link rel="stylesheet" href="' +
      coreBase +
      'styles/h5p.css"></head><body>' +
      '<div class="h5p-content" data-content-id="' +
      id +
      '"></div></body></html>',
  );
  doc.close();

  // library styles first, then scripts, each library after its dependencies
  for (const lib of pkg.libraries) {
    for (const css of lib.css) {
      const style = doc.createElement("style");
      style.textContent = inlineCss(pkg, lib.folder, css);
      style.setAttribute("data-h5p-library", lib.folder);
      doc.head.append(style);
    }
  }
  addScript(doc, coreSource, "core/frame.bundle.js");
  addScript(
    doc,
    "window.H5PIntegration = window.parent.H5PIntegration;" +
      "window.H5P = window.H5P || {}; H5P.externalEmbed = false;",
    "core/integration.js",
  );
  for (const lib of pkg.libraries) {
    for (const js of lib.js) {
      const code = pkg.text(`${lib.folder}/${js}`);
      if (code !== null) addScript(doc, code, `${lib.folder}/${js}`);
    }
  }
  addScript(doc, FRAME_SHIM(id), "core/package-shim.js");

  return {
    iframe,
    dispose() {
      wrapper.remove();
      delete I.contents["cid-" + id];
      delete globalThis.__h5pPackages[id];
      pkg.dispose();
    },
  };
}
