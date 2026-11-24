/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html } from "lit";
import {
  HaxConsent,
  consentServiceForUrl,
} from "@haxtheweb/utils/lib/hax-consent.js";
import { sanitizeEmbeddableURL } from "@haxtheweb/utils/lib/url.js";

/**
 * Consent for embedded third-party content.
 *
 * Invariant: a cross-origin frame or embed makes no request to its host
 * until HaxConsent says "allow" for that host's service. Until then a
 * hax-consent-gate panel stands where it would be. Allowing loads it in
 * place; withdrawing the choice puts the panel back, without a reload.
 */

const GATE_TAG = "hax-consent-gate";
// elements that wrap an authored <iframe> and would hide a panel placed
// inside them; the panel goes in front of the wrapper instead
const WRAPPERS = "responsive-iframe";
// elements that gate their own frame: only its src is moved aside here, to
// data-hax-consent-src, where the element reads it and draws its own panel
const SELF_GATED = "iframe-loader";
const loadGate = () => import("../hax-consent-gate.js");
// the URL each held-back frame will load once allowed; kept here rather
// than read back from the page, and shared by every copy of this module
const HELD = (globalThis.__haxConsentHeldFrames =
  globalThis.__haxConsentHeldFrames || new WeakMap());

function makeGate(doc, consent) {
  const gate = doc.createElement(GATE_TAG);
  gate.setAttribute("variant", "panel");
  gate.setAttribute("service", consent.service);
  gate.setAttribute("host", consent.host);
  gate.setAttribute("data-hax-consent-gate", "");
  return gate;
}

function holdBack(iframe, consent) {
  const doc = iframe.ownerDocument;
  const anchor = (iframe.parentElement && iframe.closest(WRAPPERS)) || iframe;
  HELD.set(iframe, iframe.src);
  iframe.setAttribute("data-hax-consent-src", iframe.getAttribute("src"));
  iframe.setAttribute("data-hax-consent-service", consent.service);
  iframe.removeAttribute("src");
  anchor.setAttribute("data-hax-consent-display", anchor.style.display || "");
  anchor.style.display = "none";
  if (anchor.parentNode) {
    anchor.parentNode.insertBefore(makeGate(doc, consent), anchor);
  }
}

function release(iframe) {
  const anchor = (iframe.parentElement && iframe.closest(WRAPPERS)) || iframe;
  const gate = anchor.previousElementSibling;
  if (gate && gate.hasAttribute("data-hax-consent-gate")) {
    gate.remove();
  }
  if (anchor.hasAttribute("data-hax-consent-display")) {
    anchor.style.display = anchor.getAttribute("data-hax-consent-display");
    anchor.removeAttribute("data-hax-consent-display");
  }
  // security: the URL the frame had when it was held back, never one read
  // back from the page, and only http(s)
  const src = sanitizeEmbeddableURL(HELD.get(iframe), null);
  HELD.delete(iframe);
  iframe.removeAttribute("data-hax-consent-src");
  if (src) {
    iframe.src = src;
  }
}

/**
 * Hold back every cross-origin <iframe> under root that this visitor has
 * not allowed. Call it on content that is not in the page yet (a parsed
 * fragment), so nothing loads before the check.
 * @param {ParentNode} root
 * @returns {number} how many frames are waiting for consent
 */
export function gateIframes(root) {
  if (!root || !root.querySelectorAll) {
    return 0;
  }
  let held = 0;
  root.querySelectorAll("iframe[src]").forEach((iframe) => {
    const consent = consentServiceForUrl(iframe.getAttribute("src"));
    if (consent && !HaxConsent.allowed(consent.service)) {
      if (iframe.parentElement && iframe.closest(SELF_GATED)) {
        iframe.setAttribute("data-hax-consent-src", iframe.getAttribute("src"));
        iframe.removeAttribute("src");
      } else {
        holdBack(iframe, consent);
      }
      held++;
    }
  });
  if (held) {
    loadGate();
  }
  return held;
}

// frames this module held back follow every later change of choice
if (!globalThis.__haxConsentEmbedsListening) {
  globalThis.__haxConsentEmbedsListening = true;
  globalThis.addEventListener("hax-consent-changed", (e) => {
    if (!e.detail || !globalThis.document) {
      return;
    }
    const service = e.detail.service;
    globalThis.document
      .querySelectorAll("iframe[data-hax-consent-service]")
      .forEach((iframe) => {
        if (iframe.getAttribute("data-hax-consent-service") !== service) {
          return;
        }
        const waiting = iframe.hasAttribute("data-hax-consent-src");
        if (e.detail.value === "allow" && waiting) {
          release(iframe);
        } else if (e.detail.value !== "allow" && !waiting) {
          const consent = consentServiceForUrl(iframe.getAttribute("src"));
          if (consent) {
            holdBack(iframe, consent);
            loadGate();
          }
        }
      });
  });
}

/**
 * Lit reactive controller for an element that embeds third-party content.
 * The host asks `allowed` before it renders or loads the embed, and renders
 * `gate()` in its place until then. Changes of choice re-render the host.
 *
 *   this._consent = new HaxConsentController(this, () => this.source);
 *   render() {
 *     return this._consent.allowed ? html`<iframe ...>` : this._consent.gate();
 *   }
 */
export class HaxConsentController {
  /**
   * @param {ReactiveControllerHost} host
   * @param {Function} getUrl returns the URL the embed would load
   */
  constructor(host, getUrl) {
    this.host = host;
    this.getUrl = getUrl;
    this._onChange = (e) => {
      const consent = this.consent;
      if (consent && e.detail && e.detail.service === consent.service) {
        this.host.requestUpdate();
      }
    };
    host.addController(this);
  }
  hostConnected() {
    globalThis.addEventListener("hax-consent-changed", this._onChange);
  }
  hostDisconnected() {
    globalThis.removeEventListener("hax-consent-changed", this._onChange);
  }
  /** {service, host} for the current URL, or null when none is needed */
  get consent() {
    return consentServiceForUrl(this.getUrl());
  }
  /** whether the embed may load now */
  get allowed() {
    const consent = this.consent;
    return !consent || HaxConsent.allowed(consent.service);
  }
  /**
   * the panel that stands in for the embed until it is allowed
   * @param {Object} [options] { aspect } a CSS aspect-ratio for the panel,
   *   "auto" for a short embed such as a badge (default 16 / 9)
   */
  gate(options = {}) {
    const consent = this.consent;
    if (!consent) {
      return html``;
    }
    loadGate();
    return html`<hax-consent-gate
      variant="panel"
      service="${consent.service}"
      host="${consent.host}"
      style="${
        options.aspect ? `--hax-consent-gate-aspect: ${options.aspect}` : ""
      }"
    ></hax-consent-gate>`;
  }
}
