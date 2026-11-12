/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Preview: a logged in author sees the site as a visitor would, at the size
 * of the device they pick, including edits they have not saved yet
 * (haxtheweb/issues#2951). Login state never changes; the store's
 * previewMode only changes what is drawn.
 *
 * Device sizes and orientation need a real viewport (media queries and the
 * theme's responsive size read the window), so anything other than "this
 * window", and any preview of unsaved edits, renders the page in a
 * same-origin frame. The frame is named PREVIEW_FRAME_NAME; a page loaded
 * under that name starts in preview and never loads the editor.
 */
export const PREVIEW_FRAME_NAME = "haxcms-preview-frame";

/**
 * The frame's window name: PREVIEW_FRAME_NAME, plus ":" and the id of the
 * page preview started on, so the frame keeps that page (and its parents)
 * visible even when it is unpublished.
 * @param {string|null} keepId
 * @returns {string}
 */
export function previewFrameName(keepId) {
  return keepId ? PREVIEW_FRAME_NAME + ":" + keepId : PREVIEW_FRAME_NAME;
}

/**
 * Read a window name written by previewFrameName.
 * @param {string} name
 * @returns {{inFrame: boolean, keepId: string|null}}
 */
export function parsePreviewFrameName(name) {
  const value = typeof name === "string" ? name : "";
  if (value === PREVIEW_FRAME_NAME) {
    return { inFrame: true, keepId: null };
  }
  if (value.indexOf(PREVIEW_FRAME_NAME + ":") === 0) {
    const keepId = value.slice(PREVIEW_FRAME_NAME.length + 1);
    return { inFrame: true, keepId: keepId || null };
  }
  return { inFrame: false, keepId: null };
}

/**
 * The address the preview frame loads: this page on this origin, with no
 * query or hash. Leading slashes are collapsed so a path such as
 * "//elsewhere.example/x" can never become another origin.
 * @param {Location} location
 * @returns {string}
 */
export function previewFrameSrc(location) {
  const loc = location || globalThis.location;
  const path = String(loc.pathname || "/").replace(/^\/+/, "");
  return loc.origin + "/" + path;
}

/**
 * Devices offered in the preview menu, in menu order. Sizes are CSS pixels
 * and never shown to people; the menu uses the names.
 */
export const PREVIEW_DEVICES = [
  { id: "window", icon: "av:web-asset", label: "previewThisWindow" },
  {
    id: "big",
    icon: "hardware:tv",
    label: "previewBigScreen",
    width: 1920,
    height: 1080,
  },
  {
    id: "desktop",
    icon: "hardware:desktop-windows",
    label: "previewDesktop",
    width: 1440,
    height: 900,
  },
  {
    id: "tablet",
    icon: "hardware:tablet",
    label: "previewTablet",
    width: 820,
    height: 1180,
    rotates: true,
  },
  {
    id: "phone",
    icon: "hardware:phone-iphone",
    label: "previewPhone",
    width: 390,
    height: 844,
    rotates: true,
  },
];

/**
 * Look up a device by id; unknown ids get "this window".
 * @param {string} id
 * @returns {Object}
 */
export function previewDevice(id) {
  for (let i = 0; i < PREVIEW_DEVICES.length; i++) {
    if (PREVIEW_DEVICES[i].id === id) {
      return PREVIEW_DEVICES[i];
    }
  }
  return PREVIEW_DEVICES[0];
}

/**
 * Size of the preview frame for a device inside the space available.
 * "This window" fills the space at 1:1. A device keeps its own CSS size so
 * its layout is real, and is scaled down (never up) to fit.
 * @param {string} id device id
 * @param {boolean} sideways swap width and height (tablet and phone)
 * @param {{width: number, height: number}} available
 * @returns {{width: number, height: number, scale: number, full: boolean, rotates: boolean}}
 */
export function previewFrameSize(id, sideways, available) {
  const device = previewDevice(id);
  const availWidth = Math.max(1, Number(available && available.width) || 1);
  const availHeight = Math.max(1, Number(available && available.height) || 1);
  if (!device.width) {
    return {
      width: availWidth,
      height: availHeight,
      scale: 1,
      full: true,
      rotates: false,
    };
  }
  const turn = !!(sideways && device.rotates);
  const width = turn ? device.height : device.width;
  const height = turn ? device.width : device.height;
  const scale = Math.min(1, availWidth / width, availHeight / height);
  return {
    width,
    height,
    scale,
    full: false,
    rotates: !!device.rotates,
  };
}

/**
 * True when a click would take the frame to another page: an <a href> that
 * is not a fragment on the same page. Uses composedPath so links inside
 * shadow roots (menus, prev / next) count.
 * @param {Event} event
 * @param {Window} win the window the click happened in
 * @returns {boolean}
 */
export function isPreviewNavigationClick(event, win) {
  const path = event && event.composedPath ? event.composedPath() : [];
  for (let i = 0; i < path.length; i++) {
    const el = path[i];
    if (el && el.tagName === "A" && el.hasAttribute("href")) {
      const href = el.getAttribute("href") || "";
      if (href.indexOf("#") === 0) {
        return false;
      }
      try {
        const location = win ? win.location : globalThis.location;
        const url = new URL(href, el.baseURI || location.href);
        if (url.pathname === location.pathname && url.hash) {
          return false;
        }
      } catch {
        return true;
      }
      return true;
    }
  }
  return false;
}

/**
 * Keep a preview of unsaved edits on its page: links and the router's
 * history pushes do nothing, and onBlocked is told so the author knows why.
 * @param {Window} win the frame's window
 * @param {Function} onBlocked
 * @returns {Function} undoes the lock
 */
export function lockPreviewFrame(win, onBlocked) {
  if (!win || !win.history) {
    return () => {};
  }
  const tell = typeof onBlocked === "function" ? onBlocked : () => {};
  const onClick = (e) => {
    if (isPreviewNavigationClick(e, win)) {
      e.preventDefault();
      e.stopImmediatePropagation();
      tell();
    }
  };
  win.addEventListener("click", onClick, true);
  const history = win.history;
  const pushState = history.pushState;
  history.pushState = function () {
    tell();
  };
  return () => {
    win.removeEventListener("click", onClick, true);
    history.pushState = pushState;
  };
}

/**
 * Wait for the site in the frame to finish loading its page, then hand back
 * that window's HAXcms store. Resolves null if it never does.
 *
 * The frame is logged in, so after its first render the site builder loads
 * site.json and the page body once more with a fresh timestamp (the copy
 * edits start from). Anything shown before that load lands is replaced by
 * it, so this also waits for the builder's freshManifestReady.
 * @param {Window} win
 * @param {number} timeout ms
 * @returns {Promise<Object|null>}
 */
export function waitForPreviewStore(win, timeout = 20000) {
  const started = Date.now();
  return waitForRenderedStore(win, timeout).then((frameStore) => {
    if (!frameStore) {
      return null;
    }
    let builder = null;
    try {
      builder = win.document.querySelector("haxcms-site-builder");
    } catch {
      return null;
    }
    if (!builder || !builder.freshManifestReady) {
      return frameStore;
    }
    const left = Math.max(0, timeout - (Date.now() - started));
    return Promise.race([
      builder.freshManifestReady,
      new Promise((resolve) => setTimeout(resolve, left)),
    ]).then(() => frameStore);
  });
}

function waitForRenderedStore(win, timeout) {
  const started = Date.now();
  return new Promise((resolve) => {
    const check = () => {
      let frameStore = null;
      try {
        frameStore =
          win && win.HAXCMS && win.HAXCMS.instance
            ? win.HAXCMS.instance.store
            : null;
      } catch {
        // the frame navigated somewhere this page can't read
        resolve(null);
        return;
      }
      if (
        frameStore &&
        frameStore.appReady &&
        frameStore.themeElement &&
        frameStore.activeItemContent &&
        frameStore.themeElement.childNodes.length > 0
      ) {
        resolve(frameStore);
        return;
      }
      if (Date.now() - started > timeout) {
        resolve(null);
        return;
      }
      setTimeout(check, 100);
    };
    check();
  });
}

/**
 * Render HTML as the frame's current page body through the frame's own
 * site builder, so it goes through exactly the path a saved page takes
 * (id normalizing, script removal, sanitizing, tag replacement).
 * @param {Window} win
 * @param {Object} frameStore the frame's HAXcms store
 * @param {string} html content, as haxToContent() returns it
 * @returns {boolean} whether the builder took it
 */
export function showContentInPreview(win, frameStore, html) {
  if (!win || !win.document || typeof html !== "string") {
    return false;
  }
  const builder = win.document.querySelector("haxcms-site-builder");
  if (!builder || typeof builder._updateActiveItemContent !== "function") {
    return false;
  }
  builder._updateActiveItemContent(
    html,
    frameStore ? frameStore.activeItem : null,
  );
  return true;
}
