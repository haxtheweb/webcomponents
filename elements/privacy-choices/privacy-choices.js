/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { HaxConsent } from "@haxtheweb/utils/lib/hax-consent.js";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import { HAX_CONSENT_SERVICES } from "@haxtheweb/hax-consent-gate/hax-consent-gate.js";
import { HaxUiAdminTokens } from "@haxtheweb/d-d-d/lib/HaxUiAdminTokens.js";
import { HaxUiAdminControls } from "@haxtheweb/d-d-d/lib/HaxUiAdminControls.js";

/**
 * `privacy-choices`
 * Every third-party service HaxConsent knows, with the visitor's choice for
 * each. Ticking stores "allow", unticking stores "deny", and Withdraw all
 * returns every service to "ask me first". Changes reach open players and
 * gates without a reload, through hax-consent-changed. Choices made for
 * other hosts on embeds (embed:<host>) are listed after the known services.
 * Authors place it on a privacy page; HAXcms also opens it from the user
 * menu for signed-in users, with `in-dialog`: it then fills the dialog
 * below its titlebar, the list scrolls and Withdraw all sits in the HAX UI
 * action bar at the bottom, like the other site admin dialogs.
 * @demo demo/index.html
 * @element privacy-choices
 */
export class PrivacyChoices extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "privacy-choices";
  }
  constructor() {
    super();
    this._status = "";
    this.inDialog = false;
    this.t = {
      heading: "Services this site can use",
      allowPrefix: "Allow",
      stateAllow: "Allowed",
      stateDeny: "Not allowed",
      stateAsk: "Not chosen yet: asks first",
      withdrawAll: "Withdraw all choices",
      changedAllow: "Saved: {service} is allowed.",
      changedDeny: "Saved: {service} is not allowed.",
      withdrawn: "All choices withdrawn. Each service will ask again.",
      serviceLabel_google_analytics: "Google Analytics",
      serviceLabel_youtube: "YouTube",
      serviceLabel_vimeo: "Vimeo",
      serviceLabel_google_maps: "Google Maps",
      serviceLabel_speech: "Voice input",
      serviceLabel_github: "GitHub",
      serviceLabel_webstatus: "webstatus.dev",
      serviceLabel_aframe: "A-Frame",
      serviceSends_google_analytics:
        "Counts visits and pages read. Google receives your IP address and may set cookies.",
      serviceSends_youtube:
        "Plays videos from YouTube. Google receives your IP address and may set cookies.",
      serviceSends_vimeo:
        "Plays videos from Vimeo. Vimeo receives your IP address; this site asks it not to track you.",
      serviceSends_google_maps:
        "Shows maps from Google Maps. Google receives your IP address and may set cookies.",
      serviceSends_speech:
        "When your browser can't understand speech on your device, your voice goes to its speech service (Google, Apple or Microsoft).",
      serviceSends_github:
        "Shows repository cards and other content from GitHub. GitHub receives your IP address and may set cookies.",
      serviceSends_webstatus:
        "Shows Baseline browser support badges from webstatus.dev, a Google Chrome project. Google receives your IP address.",
      serviceSends_aframe:
        "Loads the A-Frame library from aframe.io to show 3D scenes. aframe.io receives your IP address.",
      serviceSends_embed:
        "Shows content from {host}. {host} receives your IP address and may set cookies.",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/privacy-choices.ar.json", import.meta.url).href +
        "/../",
    });
    this._onConsent = () => this.requestUpdate();
  }
  static get properties() {
    return {
      ...super.properties,
      _status: { type: String },
      /** drawn as a site admin dialog's body: scrolling list, action bar */
      inDialog: { type: Boolean, reflect: true, attribute: "in-dialog" },
    };
  }
  connectedCallback() {
    super.connectedCallback();
    globalThis.addEventListener("hax-consent-changed", this._onConsent);
  }
  disconnectedCallback() {
    globalThis.removeEventListener("hax-consent-changed", this._onConsent);
    super.disconnectedCallback();
  }
  static get styles() {
    return [
      super.styles,
      HaxUiAdminTokens,
      HaxUiAdminControls,
      css`
        :host {
          display: block;
          font-family: var(--ddd-font-navigation);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          margin: var(--ddd-spacing-4) var(--ddd-spacing-0);
        }
        .wrap {
          border: var(--ddd-border-sm);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-slateGray)
          );
          border-radius: var(--ddd-radius-sm);
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          padding: var(--ddd-spacing-2) var(--ddd-spacing-5)
            var(--ddd-spacing-5);
        }
        .heading {
          margin: var(--ddd-spacing-3) var(--ddd-spacing-0) var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-xs);
          font-weight: var(--ddd-font-weight-bold);
        }
        ul {
          list-style: none;
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
        }
        li {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 0 var(--ddd-spacing-3);
          align-items: start;
          padding: var(--ddd-spacing-3) var(--ddd-spacing-0);
          border-bottom: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-slateGray)
          );
        }
        li simple-icon-lite {
          margin-top: var(--ddd-spacing-2);
          --simple-icon-width: var(--ddd-icon-xs);
          --simple-icon-height: var(--ddd-icon-xs);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }
        simple-fields-field {
          --simple-fields-font-family: var(--ddd-font-navigation);
          --simple-fields-font-size: var(--ddd-font-size-3xs);
          --simple-fields-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --simple-fields-background-color: transparent;
          --simple-fields-accent-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --simple-fields-margin: var(--ddd-spacing-0);
          --simple-fields-margin-small: var(--ddd-spacing-0);
          font-weight: var(--ddd-font-weight-bold);
        }
        .sends,
        .state {
          margin: var(--ddd-spacing-0);
          font-size: var(--ddd-font-size-3xs);
          line-height: var(--ddd-lh-150);
        }
        .state {
          font-style: italic;
        }
        .footer {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-3) var(--ddd-spacing-5);
          margin-top: var(--ddd-spacing-4);
        }
        :host(:not([in-dialog])) button {
          min-height: var(--ddd-spacing-11);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-3xs);
          font-weight: var(--ddd-font-weight-bold);
          border-radius: var(--ddd-radius-sm);
          border: var(--ddd-border-md);
          border-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          cursor: pointer;
        }
        :host(:not([in-dialog])) button:hover {
          background-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
        }
        :host(:not([in-dialog])) button:active {
          transform: translateY(1px);
        }
        :host(:not([in-dialog])) button:focus-visible {
          outline: var(--ddd-border-md);
          outline-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          outline-offset: 2px;
        }
        .status {
          margin: var(--ddd-spacing-0);
          font-size: var(--ddd-font-size-3xs);
        }
        /* in a site admin dialog: fill it below its titlebar; the list
           scrolls and the action bar stays, so the dialog never scrolls */
        :host([in-dialog]) {
          margin: var(--ddd-spacing-0);
          height: calc(
            var(--simple-modal-height, 80vh) - var(
                --simple-modal-titlebar-height,
                48px
              )
          );
          min-height: 300px;
          background-color: var(--hax-ui-surface);
          color: var(--hax-ui-text);
        }
        :host([in-dialog]) .wrap {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 0;
          padding: var(--ddd-spacing-0);
          border: none;
          border-radius: 0;
          background-color: transparent;
        }
        :host([in-dialog]) .body {
          flex: 1 1 auto;
          min-height: 0;
          overflow-y: auto;
          padding: var(--ddd-spacing-1) var(--ddd-spacing-5)
            var(--ddd-spacing-3);
        }
        /* admin type and lines, like the rest of the site admin dialogs */
        :host([in-dialog]) .wrap {
          font-family: var(--hax-ui-admin-font-family);
        }
        :host([in-dialog]) .heading {
          margin: var(--ddd-spacing-4) var(--ddd-spacing-0) var(--ddd-spacing-1);
          font-size: 16px;
        }
        :host([in-dialog]) li {
          border-color: var(--hax-ui-line);
        }
        :host([in-dialog]) simple-fields-field {
          --simple-fields-font-family: var(--hax-ui-admin-font-family);
          --simple-fields-font-size: var(--hax-ui-admin-font-size);
          --simple-fields-color: var(--hax-ui-text);
          --simple-fields-accent-color: var(--hax-ui-accent-strong);
        }
        :host([in-dialog]) li simple-icon-lite {
          margin-top: var(--ddd-spacing-1);
          color: var(--hax-ui-text-muted);
        }
        :host([in-dialog]) .sends {
          font-size: var(--hax-ui-admin-font-size);
          line-height: 1.45;
        }
        :host([in-dialog]) .state {
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }
        :host([in-dialog]) li:last-child {
          border-bottom: none;
        }
        :host([in-dialog]) .footer {
          flex: none;
          flex-wrap: nowrap;
          gap: var(--ddd-spacing-3);
          min-height: 56px;
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-5);
          border-top: 1px solid var(--hax-ui-line);
          background-color: var(--hax-ui-surface);
        }
        /* status on the left, the action on the right, as in every HAX UI
           action bar */
        :host([in-dialog]) .status {
          order: -1;
          flex: 1;
          min-width: 0;
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }
      `,
    ];
  }
  _label(id) {
    if (id.indexOf("embed:") === 0) {
      return id.slice(6);
    }
    return this.t["serviceLabel_" + id.replace(/-/g, "_")] || id;
  }
  _sends(id) {
    if (id.indexOf("embed:") === 0) {
      return this.t.serviceSends_embed.replace(/\{host\}/g, id.slice(6));
    }
    return this.t["serviceSends_" + id.replace(/-/g, "_")];
  }
  /**
   * The known services, then any other host a visitor answered on an embed
   */
  get services() {
    const known = HAX_CONSENT_SERVICES.map((s) => s.id);
    const others = Object.keys(HaxConsent.choices())
      .filter((id) => known.indexOf(id) === -1 && id.indexOf("embed:") === 0)
      .sort()
      .map((id) => ({ id: id, icon: "social:public" }));
    return HAX_CONSENT_SERVICES.concat(others);
  }
  _state(id) {
    const v = HaxConsent.get(id);
    return v === "allow"
      ? this.t.stateAllow
      : v === "deny"
        ? this.t.stateDeny
        : this.t.stateAsk;
  }
  render() {
    return html`<div class="wrap">
      <div class="body">
        <p class="heading" id="heading">${this.t.heading}</p>
        <ul aria-labelledby="heading">
          ${this.services.map(
            (s) =>
              html`<li>
                <simple-icon-lite
                  icon="${s.icon}"
                  aria-hidden="true"
                ></simple-icon-lite>
                <div>
                  <simple-fields-field
                    type="checkbox"
                    label="${this.t.allowPrefix} ${this._label(s.id)}"
                    .value="${HaxConsent.allowed(s.id)}"
                    @value-changed="${(e) => this._change(s.id, e.detail.value)}"
                  ></simple-fields-field>
                  <p class="sends">${this._sends(s.id)}</p>
                  <p class="state">${this._state(s.id)}</p>
                </div>
              </li>`,
          )}
        </ul>
      </div>
      <div class="footer">
        <button
          id="withdraw"
          type="button"
          class="${this.inDialog ? "hax-ui-btn" : ""}"
          @click="${this._withdrawAll}"
        >
          ${this.t.withdrawAll}
        </button>
        <p class="status" role="status">${this._status}</p>
      </div>
    </div>`;
  }
  _change(id, checked) {
    const on = checked === true || checked === "true";
    const next = on ? "allow" : "deny";
    // simple-fields-field also fires for the value it was drawn with (which
    // can be undefined before it settles): only a real change is stored, so
    // a redraw never turns "ask" into "deny"
    if (on === HaxConsent.allowed(id)) {
      return;
    }
    HaxConsent.set(id, next);
    this._status = (
      next === "allow" ? this.t.changedAllow : this.t.changedDeny
    ).replace("{service}", this._label(id));
  }
  _withdrawAll() {
    HaxConsent.clearAll();
    this._status = this.t.withdrawn;
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}
globalThis.customElements.define(PrivacyChoices.tag, PrivacyChoices);
