export var badURLProtocols = ["javascript:", "vbscript:", "data:"];

function urlValueToProtocolCheck(value) {
  if (typeof value !== "string") {
    return "";
  }
  return value
    .trim()
    .replace(/[\u0000-\u001F\u007F\s]+/g, "")
    .toLowerCase();
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
  } catch (e) {
    return fallback;
  }
  return normalizedValue;
}
