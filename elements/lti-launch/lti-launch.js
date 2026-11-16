/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import {
  DDDBlockStyles,
  renderDDDBlockHeader,
} from "@haxtheweb/d-d-d/lib/DDDBlock.js";
import { DDDAccentStyles } from "@haxtheweb/d-d-d/lib/DDDAccent.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import {
  activityId,
  buildStatement,
  XAPI_ACTIVITY_TYPES,
  XAPI_EXTENSIONS,
} from "@haxtheweb/user-action/lib/xapi.js";
import {
  frameSandbox,
  launchPlan,
  loginRequestFields,
  opaqueValue,
  safeHttpUrl,
} from "./lib/lti-launch-url.js";

const MIN_HEIGHT = 200;
const MAX_HEIGHT = 2000;
const DEFAULT_HEIGHT = 480;

/**
 * `lti-launch`
 * A block that opens an external learning tool: the tool's title and
 * description with a launch button, in a new window or embedded.
 *
 * - Plain link: `launch-url` opens the tool.
 * - LTI 1.3: with `login-url`, `client-id` and `deployment-id` set, the
 *   button posts the third-party-initiated login request (iss,
 *   target_link_uri, client_id, lti_deployment_id, login_hint,
 *   lti_message_hint) to the tool's login address with a real form.
 *
 * This is the front-end piece only. Finishing an LTI 1.3 launch needs a
 * platform back end (the OIDC authentication response, a signed id_token
 * and a public key set) that this element does not contain. Client id and
 * deployment id are public identifiers; keys and secrets never belong in
 * this element's attributes.
 *
 * Rule: only absolute http: and https: addresses are ever opened, posted to
 * or framed (lib/lti-launch-url.js).
 *
 * @fires lti-launch-request - bubbles, composed, cancelable; LTI mode only,
 *   before the login request is posted. detail: { display, loginUrl,
 *   params: { iss, target_link_uri, client_id, lti_deployment_id,
 *   login_hint, lti_message_hint } }. A host may set params.login_hint and
 *   params.lti_message_hint; preventDefault() stops the launch.
 * @fires user-engagement - bubbles, composed; when the learner launches.
 *   detail: { activityDisplay ("attempted"), objectName, statement }
 * @demo demo/index.html
 * @element lti-launch
 */
export class LtiLaunch extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "lti-launch";
  }

  constructor() {
    super();
    this.title = "";
    this.description = "";
    this.launchUrl = "";
    this.display = "window";
    this.loginUrl = "";
    this.clientId = "";
    this.deploymentId = "";
    this.issuer = "";
    this.loginHint = "";
    this.ltiMessageHint = "";
    this.embedHeight = DEFAULT_HEIGHT;
    this._directionsOpen = false;
    this._launched = false;
    this._status = "";
    this._frameName = "";
    this._pageOrigin = "";
    this._haxstate = false;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      label: "External tool",
      labelLti: "External tool · LTI 1.3",
      theTool: "the tool",
      directions: "Directions",
      showDirections: "Show directions",
      hideDirections: "Hide directions",
      directionsWindow: "The button opens a new window with the tool in it.",
      directionsEmbed:
        "The button opens the tool on this page. If it does not load, open it in a new window instead.",
      directionsLti:
        "This site signs you in to the tool, so you do not need a separate account.",
      openWindow: "Open {title} (new window)",
      openEmbed: "Open {title}",
      openInstead: "Open in a new window instead",
      frameTitle: "{title} (external tool)",
      openedWindow: "A new window opened with the tool.",
      openedEmbed: "The tool opened on this page.",
      needsUrl:
        "This block needs a launch address that starts with http:// or https://.",
      needsSignIn:
        "This tool needs this site's sign-in service, which is not available here. Nothing was opened.",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
  }

  static get properties() {
    return {
      ...super.properties,
      /** Name of the tool, shown in the header and on the button */
      title: { type: String },
      /** What the tool is for, shown above the button */
      description: { type: String },
      /** Address of the tool (absolute http or https) */
      launchUrl: { type: String, attribute: "launch-url" },
      /** window (a new window) or embed (a frame on this page) */
      display: { type: String, reflect: true },
      /** LTI 1.3: the tool's login initiation address */
      loginUrl: { type: String, attribute: "login-url" },
      /** LTI 1.3: client id the tool gave this site (a public identifier) */
      clientId: { type: String, attribute: "client-id" },
      /** LTI 1.3: deployment id (a public identifier) */
      deploymentId: { type: String, attribute: "deployment-id" },
      /** LTI 1.3: issuer; the page origin when empty */
      issuer: { type: String },
      /** LTI 1.3: opaque login hint for the platform back end */
      loginHint: { type: String, attribute: "login-hint" },
      /** LTI 1.3: opaque message hint for the platform back end */
      ltiMessageHint: { type: String, attribute: "lti-message-hint" },
      /** Height of the embedded frame in pixels (200 to 2000) */
      embedHeight: { type: Number, attribute: "embed-height" },
      /** Accent for the chip and button (a SimpleColors name) */
      accentColor: { type: String, attribute: "accent-color", reflect: true },
      _directionsOpen: { state: true },
      _launched: { state: true },
      _status: { state: true },
      _frameName: { state: true },
      _pageOrigin: { state: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      DDDBlockStyles,
      DDDAccentStyles,
      css`
        :host {
          display: block;
          margin: var(--ddd-stack-gap, var(--ddd-spacing-4)) 0;
          /* accent priority, last match wins: DDD default, theme palette
             (data-palette), accent-color on the element */
          --ddd-component-lti-launch-accent: var(
            --ddd-accent-color,
            var(
              --ddd-palette-accent,
              light-dark(
                var(--ddd-theme-default-nittanyNavy),
                var(--ddd-theme-default-linkLight)
              )
            )
          );
          --ddd-component-lti-launch-accent-ink: var(
            --ddd-accent-color-ink,
            var(
              --ddd-palette-accent-ink,
              light-dark(
                var(--ddd-theme-default-white),
                var(--ddd-theme-default-potentialMidnight)
              )
            )
          );
          --ddd-component-lti-launch-line: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
        }
        :host([hidden]),
        [hidden] {
          display: none !important;
        }
        .ddd-block {
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }
        :host([accent-color]) .ddd-block {
          --ddd-block-chip-background: var(--ddd-accent-color);
          --ddd-block-chip-color: var(--ddd-accent-color-ink);
        }
        .directions {
          padding-block: var(--ddd-spacing-3);
          padding-inline: var(--ddd-surface-padding, var(--ddd-spacing-4));
          border-bottom: var(--ddd-border-xs);
          border-color: var(--ddd-component-lti-launch-line);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150);
        }
        .directions ul {
          margin: var(--ddd-spacing-0);
          padding-inline-start: var(--ddd-spacing-5);
        }
        .directions li {
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150);
        }
        .directions li::marker {
          color: var(--ddd-palette-marker, currentColor);
        }
        .body {
          padding: var(--ddd-surface-padding, var(--ddd-spacing-4));
        }
        .body p {
          margin: var(--ddd-spacing-0);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150);
          overflow-wrap: anywhere;
        }
        .note {
          padding: var(--ddd-spacing-3);
          border: var(--ddd-border-xs);
          border-style: dashed;
          border-color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneGray)
          );
          border-radius: var(--ddd-radius-xs);
        }
        .frame {
          display: block;
          box-sizing: border-box;
          width: 100%;
          border: var(--ddd-border-xs);
          border-inline-style: hidden;
          border-bottom-style: hidden;
          border-color: var(--ddd-component-lti-launch-line);
          background-color: var(--ddd-theme-default-white);
        }
        form {
          display: contents;
        }
        .action-bar {
          justify-content: flex-end;
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        .status {
          flex: 1 1 auto;
          min-width: var(--ddd-spacing-0);
        }
        .ddd-block .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--ddd-spacing-2);
          box-sizing: border-box;
          min-height: var(--ddd-control-height-sm);
          margin: var(--ddd-spacing-0);
          padding-block: var(--ddd-spacing-1);
          padding-inline: var(--ddd-spacing-4);
          border: var(--ddd-border-xs);
          border-color: var(--ddd-component-lti-launch-accent);
          border-radius: var(--ddd-radius-xs);
          background-color: var(--ddd-component-lti-launch-accent);
          color: var(--ddd-component-lti-launch-accent-ink);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
          line-height: var(--ddd-lh-120);
          text-align: center;
          text-decoration: none;
          overflow-wrap: anywhere;
          cursor: pointer;
          --simple-icon-color: currentColor;
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
        }
        .btn simple-icon-lite {
          flex: none;
        }
        .ddd-block .btn.quiet {
          border-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
          background-color: var(--ddd-block-background, transparent);
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
        }
        .btn:focus-visible,
        .frame:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    // the resource the author saved, read before anything can write one
    if (typeof this._xapiAuthoredResource !== "string") {
      this._xapiAuthoredResource = this.getAttribute("resource") || "";
    }
    // browser only values, never worked out while rendering
    if (!this._frameName) {
      const bytes = new Uint8Array(8);
      globalThis.crypto.getRandomValues(bytes);
      this._frameName = `lti-launch-${Array.from(bytes, (b) =>
        b.toString(16).padStart(2, "0"),
      ).join("")}`;
    }
    this._pageOrigin =
      globalThis.location && globalThis.location.origin
        ? globalThis.location.origin
        : "";
  }

  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    // a different tool or display: what was opened is no longer shown
    if (
      ["launchUrl", "loginUrl", "clientId", "deploymentId", "display"].some(
        (name) => changedProperties.has(name),
      )
    ) {
      this._launched = false;
      this._status = "";
    }
  }

  // what the settings allow: { mode: "none" | "link" | "lti", ... }
  _plan() {
    return launchPlan({
      launchUrl: this.launchUrl,
      loginUrl: this.loginUrl,
      clientId: this.clientId,
      deploymentId: this.deploymentId,
    });
  }

  _embedded() {
    return this.display === "embed";
  }

  _height() {
    const n = Math.floor(Number(this.embedHeight));
    if (!Number.isFinite(n)) {
      return DEFAULT_HEIGHT;
    }
    return Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, n));
  }

  _name() {
    return (this.title || "").trim() || this.t.theTool;
  }

  // "{key}" placeholders in a translated string
  _fill(text, values) {
    let out = String(text == null ? "" : text);
    Object.keys(values).forEach((key) => {
      out = out.split(`{${key}}`).join(String(values[key]));
    });
    return out;
  }

  _editing() {
    if (this._haxstate) {
      return true;
    }
    const store =
      globalThis.HaxStore &&
      typeof globalThis.HaxStore.requestAvailability === "function"
        ? globalThis.HaxStore.requestAvailability()
        : null;
    return Boolean(store && store.editMode);
  }

  _toggleDirections() {
    this._directionsOpen = !this._directionsOpen;
  }

  // plain link, new window: the link itself does the opening
  _linkClicked(e) {
    if (this._editing()) {
      e.preventDefault();
      return;
    }
    this._status = this.t.openedWindow;
    this._attempted();
  }

  // plain link, embedded: show the frame
  async _embedClicked(e) {
    if (this._editing()) {
      e.preventDefault();
      return;
    }
    this._launched = true;
    this._status = this.t.openedEmbed;
    this._attempted();
    await this.updateComplete;
    const frame = this.shadowRoot.querySelector("iframe");
    if (frame) {
      frame.focus();
    }
  }

  /**
   * LTI 1.3 third-party-initiated login: the form is about to be posted to
   * the tool. A host can fill in the hints or cancel through
   * `lti-launch-request`; without an issuer or a login hint nothing is sent.
   */
  _formSubmit(e) {
    const plan = this._plan();
    const form = e.currentTarget;
    if (this._editing() || plan.mode !== "lti") {
      e.preventDefault();
      return;
    }
    // the fallback button posts the same form to a new window
    const toWindow =
      !this._embedded() ||
      Boolean(e.submitter && e.submitter.hasAttribute("formtarget"));
    const params = loginRequestFields(plan, {
      issuer: this.issuer,
      pageOrigin: this._pageOrigin,
      loginHint: this.loginHint,
      messageHint: this.ltiMessageHint,
    });
    const request = new CustomEvent("lti-launch-request", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        display: toWindow ? "window" : "embed",
        loginUrl: plan.loginUrl,
        params,
      },
    });
    if (!this.dispatchEvent(request)) {
      e.preventDefault();
      return;
    }
    // only the hints come back from the host; the rest is the author's
    const given =
      request.detail && request.detail.params ? request.detail.params : {};
    const fields = loginRequestFields(plan, {
      issuer: this.issuer,
      pageOrigin: this._pageOrigin,
      loginHint: opaqueValue(given.login_hint),
      messageHint: opaqueValue(given.lti_message_hint),
    });
    if (!fields.iss || !fields.login_hint) {
      e.preventDefault();
      this._status = this.t.needsSignIn;
      return;
    }
    Object.keys(fields).forEach((name) => {
      const input = form.querySelector(`input[name="${name}"]`);
      if (input) {
        input.value = fields[name];
      }
    });
    if (!toWindow) {
      this._launched = true;
    }
    this._status = toWindow ? this.t.openedWindow : this.t.openedEmbed;
    this._attempted();
  }

  /**
   * xAPI statements this element sends (see
   * scripts/generate-xapi-vocabulary.mjs). A score a tool reports is sent
   * by the platform back end, not by this element.
   */
  static get xapiVocabulary() {
    return {
      tag: "lti-launch",
      event: "user-engagement",
      verbs: ["attempted"],
      objectType: "http://adlnet.gov/expapi/activities/interaction",
      result: [],
      countsTowardCompletion: false,
      done: "never required; the block cannot know the learner finished in the tool. It records that the tool was opened",
    };
  }

  // what identifies this block when it has no id
  xapiFingerprint() {
    return `${this.title || ""}\u0001${safeHttpUrl(this.launchUrl)}`;
  }

  // learner data: the tool was opened. Never while HAX is editing.
  _attempted() {
    if (this._editing()) {
      return;
    }
    const name = this._name().slice(0, 120);
    this.dispatchEvent(
      new CustomEvent("user-engagement", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          activityDisplay: "attempted",
          objectName: name,
          statement: buildStatement({
            verb: "attempted",
            object: {
              id: activityId(this, this.xapiFingerprint()),
              name,
              type: XAPI_ACTIVITY_TYPES.interactionGeneric,
            },
            context: {
              extensions: { [XAPI_EXTENSIONS.element]: LtiLaunch.tag },
            },
          }),
        },
      }),
    );
  }

  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      preProcessNodeToContent: "haxpreProcessNodeToContent",
    };
  }

  /**
   * While authoring nothing launches and nothing stays open.
   */
  haxeditModeChanged(val) {
    this._haxstate = Boolean(val);
    if (this._haxstate) {
      this._launched = false;
      this._status = "";
    }
  }

  /**
   * Before HAX saves: keep one plain link to the tool in the light DOM, so
   * the page still has a way to the tool when scripts do not run.
   */
  haxpreProcessNodeToContent(node) {
    const href = safeHttpUrl(
      node.launchUrl || node.getAttribute("launch-url") || "",
    );
    const links = Array.from(node.children).filter(
      (child) => child.getAttribute("slot") === "fallback",
    );
    links.slice(href ? 1 : 0).forEach((link) => link.remove());
    if (!href) {
      return node;
    }
    let link = links[0];
    if (!link || link.tagName !== "A") {
      if (link) {
        link.remove();
      }
      link = globalThis.document.createElement("a");
      link.setAttribute("slot", "fallback");
      node.appendChild(link);
    }
    link.setAttribute("href", href);
    link.textContent = (node.getAttribute("title") || "").trim() || href;
    return node;
  }

  render() {
    const plan = this._plan();
    const embedded = this._embedded();
    return html`
      <div class="ddd-block" role="group" aria-labelledby="header">
        ${renderDDDBlockHeader({
          id: "header",
          icon: "icons:extension",
          label: plan.mode === "lti" ? this.t.labelLti : this.t.label,
          title: this.title,
          actions: html`<button
            type="button"
            class="ddd-block-action"
            id="directions-toggle"
            aria-controls="directions"
            aria-expanded="${this._directionsOpen ? "true" : "false"}"
            aria-label="${
              this._directionsOpen
                ? this.t.hideDirections
                : this.t.showDirections
            }"
            title="${this.t.directions}"
            @click="${this._toggleDirections}"
          >
            <simple-icon-lite
              icon="icons:info-outline"
              aria-hidden="true"
            ></simple-icon-lite>
          </button>`,
        })}
        <div
          id="directions"
          class="directions"
          ?hidden="${!this._directionsOpen}"
        >
          <span class="sr-only">${this.t.directions}: </span>
          <ul>
            <li>
              ${embedded ? this.t.directionsEmbed : this.t.directionsWindow}
            </li>
            ${
              plan.mode === "lti"
                ? html`<li>${this.t.directionsLti}</li>`
                : nothing
            }
          </ul>
        </div>
        <div class="ddd-block-body body">
          ${
            this.description
              ? html`<p id="description">${this.description}</p>`
              : nothing
          }
          ${
            plan.mode === "none"
              ? html`<p class="note" id="needs-url">${this.t.needsUrl}</p>`
              : nothing
          }
        </div>
        ${plan.mode !== "none" && embedded ? this._renderFrame(plan) : nothing}
        ${
          plan.mode === "lti"
            ? html`<form
                id="login"
                method="post"
                action="${plan.loginUrl}"
                target="${embedded ? this._frameName : "_blank"}"
                rel="noopener"
                @submit="${this._formSubmit}"
              >
                ${this._renderFields(plan)}${this._renderFooter(plan)}
              </form>`
            : this._renderFooter(plan)
        }
      </div>
    `;
  }

  // the login request as real form fields; hints are filled in on submit
  _renderFields(plan) {
    const fields = loginRequestFields(plan, {
      issuer: this.issuer,
      pageOrigin: this._pageOrigin,
      loginHint: this.loginHint,
      messageHint: this.ltiMessageHint,
    });
    return Object.keys(fields).map(
      (name) =>
        html`<input type="hidden" name="${name}" value="${fields[name]}" />`,
    );
  }

  // a plain link frame loads when opened; an LTI frame is posted into
  _renderFrame(plan) {
    return html`<iframe
      class="frame"
      id="frame"
      name="${this._frameName}"
      title="${this._fill(this.t.frameTitle, { title: this._name() })}"
      src="${plan.mode === "link" && this._launched ? plan.launchUrl : nothing}"
      sandbox="${frameSandbox(
        [plan.launchUrl, plan.loginUrl],
        this._pageOrigin,
      )}"
      allow="fullscreen"
      loading="lazy"
      referrerpolicy="strict-origin-when-cross-origin"
      style="height: ${this._height()}px"
      ?hidden="${!this._launched}"
    ></iframe>`;
  }

  _renderFooter(plan) {
    const embedded = this._embedded();
    const name = this._name();
    let actions = nothing;
    if (plan.mode === "lti") {
      actions = html`${
          embedded
            ? html`<button
                type="submit"
                class="btn quiet"
                id="open-instead"
                formtarget="_blank"
              >
                ${this.t.openInstead}
              </button>`
            : nothing
        }<button type="submit" class="btn" id="launch">
          ${this._launchLabel(embedded, name)}
        </button>`;
    } else if (plan.mode === "link" && embedded) {
      actions = html`<a
          class="btn quiet"
          id="open-instead"
          href="${plan.launchUrl}"
          target="_blank"
          rel="noopener noreferrer"
          @click="${this._linkClicked}"
          >${this.t.openInstead}</a
        ><button
          type="button"
          class="btn"
          id="launch"
          @click="${this._embedClicked}"
        >
          ${this._launchLabel(true, name)}
        </button>`;
    } else if (plan.mode === "link") {
      actions = html`<a
        class="btn"
        id="launch"
        href="${plan.launchUrl}"
        target="_blank"
        rel="noopener noreferrer"
        @click="${this._linkClicked}"
        >${this._launchLabel(false, name)}</a
      >`;
    }
    return html`<div class="ddd-block-footer action-bar">
      <div class="status" id="status" role="status" aria-live="polite">
        ${this._status}
      </div>
      ${actions}
    </div>`;
  }

  _launchLabel(embedded, name) {
    return html`<simple-icon-lite
        icon="${embedded ? "icons:launch" : "icons:open-in-new"}"
        aria-hidden="true"
      ></simple-icon-lite
      >${this._fill(embedded ? this.t.openEmbed : this.t.openWindow, {
        title: name,
      })}`;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(LtiLaunch.tag, LtiLaunch);
