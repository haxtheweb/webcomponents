/**
 * Small helpers shared by the HAXcms admin sections and theme pickers.
 */

/**
 * Resolve a theme thumbnail that names a package ("@haxtheweb/...") to a
 * URL; anything else is returned as given. `baseUrl` is the caller's
 * import.meta.url: the last fallback resolves four folders up from it,
 * so each caller keeps resolving from its own location.
 */
export function resolveThemeThumbnail(thumbnail = "", baseUrl = "") {
  if (!thumbnail || typeof thumbnail !== "string") {
    return "";
  }
  if (thumbnail.indexOf("@haxtheweb/") === 0) {
    const scopeMarker = "/@haxtheweb/";
    const markerIndex = baseUrl.indexOf(scopeMarker);
    if (markerIndex !== -1) {
      const scopedBase = baseUrl.substring(0, markerIndex + scopeMarker.length);
      const packagePath = thumbnail.replace("@haxtheweb/", "");
      return `${scopedBase}${packagePath}`;
    }
    let basePath = "";
    if (
      globalThis.WCAutoloadBasePath &&
      typeof globalThis.WCAutoloadBasePath === "string"
    ) {
      basePath = globalThis.WCAutoloadBasePath;
    } else if (
      globalThis.WCGlobalBasePath &&
      typeof globalThis.WCGlobalBasePath === "string"
    ) {
      basePath = globalThis.WCGlobalBasePath;
    }
    if (basePath) {
      if (basePath.charAt(basePath.length - 1) !== "/") {
        basePath += "/";
      }
      return `${basePath}${thumbnail}`;
    }
    const packagePath = `../../../../${thumbnail}`;
    return new URL(packagePath, baseUrl).href;
  }
  return thumbnail;
}

/** the first node in the event's composed path that has a data-action */
export function actionTargetFromEvent(e) {
  const path =
    e && typeof e.composedPath === "function" ? e.composedPath() : [];
  for (let i = 0; i < path.length; i++) {
    const candidate = path[i];
    if (
      candidate &&
      typeof candidate.getAttribute === "function" &&
      candidate.getAttribute("data-action")
    ) {
      return candidate;
    }
  }
  return null;
}

/** Escape in an open choice popover closes it through host._closeChoice() */
export function closeChoiceOnEscape(e, host) {
  if (e && e.key === "Escape") {
    e.preventDefault();
    e.stopPropagation();
    host._closeChoice();
  }
}

/** block category order: Writing / Text first, Other last, then A-Z */
export function compareCategories(a, b) {
  const categoryA = a || "Other";
  const categoryB = b || "Other";
  const first = ["Writing", "Text"];
  const last = ["Other"];
  if (first.includes(categoryA) && !first.includes(categoryB)) return -1;
  if (!first.includes(categoryA) && first.includes(categoryB)) return 1;
  if (last.includes(categoryA) && !last.includes(categoryB)) return 1;
  if (!last.includes(categoryA) && last.includes(categoryB)) return -1;
  if (first.includes(categoryA) && first.includes(categoryB)) {
    return first.indexOf(categoryA) - first.indexOf(categoryB);
  }
  if (categoryA < categoryB) return -1;
  if (categoryA > categoryB) return 1;
  return 0;
}
