/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { autorun } from "mobx";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { LearnerProgress } from "@haxtheweb/haxcms-elements/lib/core/haxcms-learner-progress.js";

/**
 * `site-progress-clear`
 * `Says where learner progress is kept and lets the visitor clear it`
 *
 * "Your progress is saved on this device only. Clear my progress". Shown
 * once the site has progress or the page has trackable activities, never
 * while editing. Clearing removes this site's learner profile data and
 * statements on this device (and bullet-check-list's own ticks) and is
 * announced politely.
 *
 * @element site-progress-clear
 * @fires learner-progress-cleared - on window, after clearing
 */
export class SiteProgressClear extends I18NMixin(DDDSuper(LitElement)) {
  static get tag() {
    return "site-progress-clear";
  }
  constructor() {
    super();
    this._visible = false;
    this._message = "";
    this.t = {
      ...this.t,
      savedOnDevice: "Your progress is saved on this device only.",
      clearMyProgress: "Clear my progress",
      progressCleared: "Your progress on this site was cleared.",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../../locales/", import.meta.url).href,
    });
    this.__disposer = [];
  }
  connectedCallback() {
    super.connectedCallback();
    LearnerProgress.start();
    this.__disposer.push(
      autorun(() => {
        const site = LearnerProgress.siteProgress();
        const page = LearnerProgress.pageProgress();
        const edit = store.editMode;
        Promise.resolve().then(() => {
          this._visible = !edit && (site.engaged || page.trackable > 0);
        });
      }),
    );
  }
  disconnectedCallback() {
    this.__disposer.forEach((d) => d());
    this.__disposer = [];
    super.disconnectedCallback();
  }
  static get properties() {
    return {
      ...super.properties,
      _visible: { type: Boolean, state: true },
      _message: { type: String, state: true },
    };
  }
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          margin: var(--ddd-spacing-6) 0 var(--ddd-spacing-2);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        .row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-2);
        }
        button {
          font: inherit;
          font-weight: var(--ddd-font-weight-bold);
          background: transparent;
          border: 0;
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          min-height: 24px;
          border-radius: var(--ddd-radius-xs);
          color: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-linkLight)
          );
          text-decoration: underline;
          cursor: pointer;
        }
        button:hover,
        button:focus-visible {
          text-decoration-thickness: 2px;
        }
        button:focus-visible {
          outline: var(--ddd-border-sm);
          outline-color: currentColor;
          outline-offset: 2px;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          margin: -1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }
      `,
    ];
  }
  async clearProgress() {
    await LearnerProgress.clear();
    this._message = this.t.progressCleared;
  }
  renderRow() {
    if (!this._visible) {
      return nothing;
    }
    return html`<div class="row" part="row">
      <span>${this.t.savedOnDevice}</span>
      <button type="button" part="button" @click="${this.clearProgress}">
        ${this.t.clearMyProgress}
      </button>
    </div>`;
  }
  render() {
    return html`${this.renderRow()}<span
        class="sr-only"
        role="status"
        aria-live="polite"
        >${this._message}</span
      >`;
  }
}
globalThis.customElements.define(SiteProgressClear.tag, SiteProgressClear);
