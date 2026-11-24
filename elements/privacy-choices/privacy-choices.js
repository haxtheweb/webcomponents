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

/**
 * `privacy-choices`
 * Every third-party service HaxConsent knows, with the visitor's choice for
 * each. Ticking stores "allow", unticking stores "deny", and Withdraw all
 * returns every service to "ask me first". Changes reach open players and
 * gates without a reload, through hax-consent-changed. Choices made for
 * other hosts on embeds (embed:<host>) are listed after the known services.
 * Authors place it on a privacy page; HAXcms also opens it from the user
 * menu for signed-in users.
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
        button {
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
        button:hover {
          background-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
        }
        button:active {
          transform: translateY(1px);
        }
        button:focus-visible {
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
      <div class="footer">
        <button id="withdraw" @click="${this._withdrawAll}">
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
