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
 * Unparseable values are treated as same-origin so the stricter
 * sandbox applies to them.
 */
export function isCrossOriginURL(value) {
  if (!value || !globalThis.location || !globalThis.location.href) {
    return false;
  }
  try {
    return (
      new URL(value, globalThis.location.href).origin !==
      globalThis.location.origin
    );
  } catch (e) {
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
    return (
      parsed.origin === globalThis.location.origin &&
      /\/files\/.*\.(x?html?|xml)$/i.test(parsed.pathname)
    );
  } catch (e) {
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
