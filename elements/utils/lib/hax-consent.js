/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { localStorageGet, localStorageSet } from "./storage.js";
/**
 * One consent store for every third-party service a HAX page can reach
 * (YouTube, Vimeo, maps, the browser speech service).
 *
 * Invariant: an element that would contact a third party asks
 * `HaxConsent.get(service) === "allow"` first and makes no request to that
 * service, preconnects and thumbnails included, until it is true.
 *
 * Choices are kept in localStorage when it works and in memory when it does
 * not. Every change fires `hax-consent-changed` on globalThis with
 * `{ service, value }` so open players and settings panels follow along.
 */
const STORE_KEY = "hax-consent";

class HaxConsentStore {
  constructor() {
    const saved = localStorageGet(STORE_KEY, {});
    this._choices = saved && typeof saved === "object" ? saved : {};
    // where a site lists these choices; elements link to it when it is set
    this.choicesUrl = null;
  }
  /**
   * @param {string} service
   * @returns {string|null} "allow", "deny", or null when not chosen yet
   */
  get(service) {
    return this._choices[service] || null;
  }
  /**
   * @param {string} service
   * @param {string|null} value "allow", "deny" or null to ask again
   */
  set(service, value) {
    if (value) {
      this._choices[service] = value;
    } else {
      delete this._choices[service];
    }
    localStorageSet(STORE_KEY, this._choices);
    globalThis.dispatchEvent(
      new CustomEvent("hax-consent-changed", {
        detail: { service: service, value: this.get(service) },
      }),
    );
  }
  allowed(service) {
    return this.get(service) === "allow";
  }
  /**
   * Every service with a stored choice, including per-host choices made on
   * embeds (service names like "embed:example.com").
   * @returns {Object} a copy: service name to "allow" or "deny"
   */
  choices() {
    return Object.assign({}, this._choices);
  }
  clearAll() {
    Object.keys(this._choices).forEach((service) => this.set(service, null));
  }
}

globalThis.HaxConsent = globalThis.HaxConsent || new HaxConsentStore();
export const HaxConsent = globalThis.HaxConsent;

// hosts with a service of their own; any other third-party host is asked
// about once, as "embed:<hostname>"
const KNOWN_HOSTS = [
  ["youtube", ["youtube.com", "youtube-nocookie.com", "youtu.be"]],
  ["vimeo", ["vimeo.com"]],
];

/**
 * Whether hostname is domain or one of its subdomains. Compared on the
 * parsed hostname at a dot boundary, never as a substring of the URL.
 */
function hostIs(hostname, domain) {
  return hostname === domain || hostname.endsWith("." + domain);
}

/**
 * The HaxConsent service a URL belongs to, or null when it needs no
 * consent (same origin, not http(s), or not a URL).
 * @param {string} url
 * @returns {{service: string, host: string}|null}
 */
export function consentServiceForUrl(url) {
  if (!url || !globalThis.location || !globalThis.location.href) {
    return null;
  }
  let parsed;
  try {
    parsed = new URL(url, globalThis.location.href);
  } catch {
    return null;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return null;
  }
  if (parsed.origin === globalThis.location.origin) {
    return null;
  }
  const hostname = parsed.hostname.toLowerCase();
  for (const [service, domains] of KNOWN_HOSTS) {
    if (domains.some((d) => hostIs(hostname, d))) {
      return { service: service, host: hostname };
    }
  }
  // Google Maps embeds: google.<tld>/maps/... and maps.google.<tld>
  const labels = hostname.split(".");
  const googleAt = labels.indexOf("google");
  // what follows "google" is its public suffix: com, de, co.uk, com.au
  const suffix = googleAt === -1 ? [] : labels.slice(googleAt + 1);
  const googleDomain =
    suffix.length === 1 ||
    (suffix.length === 2 && (suffix[0] === "co" || suffix[0] === "com"));
  if (
    googleAt !== -1 &&
    googleDomain &&
    (labels[googleAt - 1] === "maps" ||
      parsed.pathname === "/maps" ||
      parsed.pathname.indexOf("/maps/") === 0)
  ) {
    return { service: "google-maps", host: hostname };
  }
  return { service: "embed:" + hostname, host: hostname };
}
