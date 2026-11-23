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
  clearAll() {
    Object.keys(this._choices).forEach((service) => this.set(service, null));
  }
}

globalThis.HaxConsent = globalThis.HaxConsent || new HaxConsentStore();
export const HaxConsent = globalThis.HaxConsent;
