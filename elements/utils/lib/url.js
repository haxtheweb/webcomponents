/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
export let badURLProtocols = ["javascript:", "vbscript:", "data:"];

function urlValueToProtocolCheck(value) {
  if (typeof value !== "string") {
    return "";
  }
  return (
    value
      .trim()
      // strip control characters on purpose (URL sanitizing)
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u001F\u007F\s]+/g, "")
      .toLowerCase()
  );
}

function protocolFromValue(value) {
  const normalizedValue = urlValueToProtocolCheck(value);
  if (!normalizedValue) {
    return "";
  }
  const match = normalizedValue.match(/^([a-z][a-z0-9+.-]*:)/i);
  return match && match[1] ? match[1].toLowerCase() : "";
}

export function hasUnsafeURLProtocol(value) {
  const protocol = protocolFromValue(value);
  if (!protocol) {
    return false;
  }
  return badURLProtocols.includes(protocol);
}

export function sanitizeURLValue(value, fallback = "") {
  if (value === null || typeof value === "undefined") {
    return fallback;
  }
  if (typeof value !== "string") {
    return fallback;
  }
  const normalizedValue = value.trim();
  if (normalizedValue === "") {
    return fallback;
  }
  if (hasUnsafeURLProtocol(normalizedValue)) {
    return fallback;
  }
  return normalizedValue;
}

/**
 * Host matching for URLs, so "is this a YouTube link" is decided by the parsed
 * hostname rather than by a substring that can also appear in a path, query
 * string or look-alike domain (https://evil.example/?u=youtube.com), which is
 * CodeQL js/incomplete-url-substring-sanitization.
 *
 * True when `value` is an http(s) URL (absolute or protocol-relative) whose
 * hostname is one of `domains` or a subdomain of one.
 * @param {string} value
 * @param {string|string[]} domains bare domain(s) such as "youtube.com"
 * @param {{allowSchemeless?: boolean}} [options] allowSchemeless treats a value
 *   such as "youtu.be/abc" (no scheme, not a path) as https, for user-typed
 *   or pasted links
 * @returns {boolean}
 */
export function urlHostMatches(value, domains, options = {}) {
  if (typeof value !== "string" || value === "") {
    return false;
  }
  value = value.trim();
  if (
    options.allowSchemeless &&
    !/^[a-z][a-z0-9+.-]*:/i.test(value) &&
    !value.startsWith("/") &&
    !value.startsWith("#")
  ) {
    value = "https://" + value;
  }
  let url;
  try {
    // the base only resolves protocol-relative values ("//host/path");
    // relative paths resolve to the placeholder host, which never matches
    url = new URL(value, "https://placeholder.invalid/");
  } catch {
    return false;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return false;
  }
  const host = url.hostname.toLowerCase();
  const list = Array.isArray(domains) ? domains : [domains];
  return list.some(
    (domain) =>
      typeof domain === "string" &&
      domain !== "" &&
      (host === domain.toLowerCase() ||
        host.endsWith("." + domain.toLowerCase())),
  );
}

export function sanitizeEmbeddableURL(value, fallback = "") {
  const normalizedValue = sanitizeURLValue(value, "");
  if (normalizedValue === "") {
    return fallback;
  }
  const protocol = protocolFromValue(normalizedValue);
  if (protocol && !["http:", "https:"].includes(protocol)) {
    return fallback;
  }
  try {
    const parsed =
      globalThis.location && globalThis.location.href
        ? new URL(normalizedValue, globalThis.location.href)
        : new URL(normalizedValue);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return fallback;
    }
  } catch {
    return fallback;
  }
  return normalizedValue;
}

/**
 * Whether a URL targets a different origin than the current page.
 * Only http(s) URLs count: javascript:, about:, data:, blob: and similar
 * report an opaque ("null") or inherited origin, and a frame loading one
 * runs with the embedding page's origin (or can, once allow-same-origin is
 * granted), so they are never treated as cross-origin. Unparseable values
 * are treated as same-origin too, so the stricter sandbox applies to them.
 */
export function isCrossOriginURL(value) {
  if (!value || !globalThis.location || !globalThis.location.href) {
    return false;
  }
  try {
    const parsed = new URL(value, globalThis.location.href);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }
    return parsed.origin !== globalThis.location.origin;
  } catch {
    return false;
  }
}

/**
 * Whether a URL points at a same-origin uploaded .html/.xml style document
 * (under /files/). Uploads of these types are allowed, but they must never be
 * embedded in a frame since they would run with the page's origin.
 */
export function isSameOriginUploadedMarkup(value) {
  if (!value || !globalThis.location || !globalThis.location.href) {
    return false;
  }
  try {
    const parsed = new URL(value, globalThis.location.href);
    // first "/files/", then any text, then the extension. Searching the
    // remainder avoids the backtracking of /\/files\/.*\.(x?html?|xml)$/i
    const files = /\/files\//i.exec(parsed.pathname);
    return (
      parsed.origin === globalThis.location.origin &&
      files !== null &&
      /\.(x?html?|xml)$/i.test(
        parsed.pathname.slice(files.index + files[0].length),
      )
    );
  } catch {
    return false;
  }
}

/**
 * Sandbox value for an iframe loading `source`. allow-scripts combined with
 * allow-same-origin on a same-origin source lets the framed document remove
 * its own sandbox, so allow-same-origin is only granted to cross-origin
 * sources (where it is relative to the foreign origin).
 */
export function iframeSandboxForSource(source) {
  return isCrossOriginURL(source)
    ? "allow-scripts allow-same-origin"
    : "allow-scripts";
}

// https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
export function validURL(str) {
  let url;
  try {
    url = new URL(str);
  } catch {
    let pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((?:[a-z\\d](?:[a-z\\d-]*[a-z\\d])?\\.)+[a-z]{2,}|" + // domain name (labels cannot nest quantifiers)
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i",
    ); // fragment locator
    return !!pattern.test(str);
  }
  return url.protocol === "https:";
}
