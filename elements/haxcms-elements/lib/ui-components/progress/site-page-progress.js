/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { autorun } from "mobx";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { LearnerProgress } from "@haxtheweb/haxcms-elements/lib/core/haxcms-learner-progress.js";

/**
 * `site-page-progress`
 * `How many of the trackable activities on this page the visitor has done`
 *
 * Shows "2 of 4 activities done" with a progress bar, only on pages that
 * hold trackable activities (questions, checklists, games, media) and never
 * while editing. Reads the learner profile kept on this device.
 *
 * @element site-page-progress
 */
export class SitePageProgress extends I18NMixin(DDDSuper(LitElement)) {
  static get tag() {
    return "site-page-progress";
  }
  constructor() {
    super();
    this.done = 0;
    this.total = 0;
    this._editMode = false;
    this.t = {
      ...this.t,
      activitiesDone: "{done} of {total} activities done",
      pageProgress: "Page progress",
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
        const p = LearnerProgress.pageProgress();
        const edit = store.editMode;
        Promise.resolve().then(() => {
          this.done = p.done;
          this.total = p.trackable;
          this._editMode = Boolean(edit);
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
      /**
       * Activities done on this page (read only, from the learner profile)
       */
      done: { type: Number, reflect: true },
      /**
       * Trackable activities on this page (read only)
       */
      total: { type: Number, reflect: true },
      _editMode: { type: Boolean, state: true },
    };
  }
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          margin: var(--ddd-spacing-2) 0 var(--ddd-spacing-4);
          font-family: var(--ddd-font-navigation);
          --site-page-progress-fill: light-dark(
            var(--ddd-theme-default-opportunityGreen),
            var(--ddd-theme-default-futureLime)
          );
          --site-page-progress-track: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
        }
        :host([hidden]) {
          display: none;
        }
        .label {
          display: block;
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
          margin-bottom: var(--ddd-spacing-1);
        }
        .bar {
          height: var(--ddd-spacing-2);
          max-width: 320px;
          border-radius: var(--ddd-radius-rounded);
          background-color: var(--site-page-progress-track);
          overflow: hidden;
        }
        .fill {
          display: block;
          height: 100%;
          border-radius: var(--ddd-radius-rounded);
          background-color: var(--site-page-progress-fill);
          transition: width var(--ddd-duration-normal, 0.3s) ease-in-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .fill {
            transition: none;
          }
        }
        @media (forced-colors: active) {
          .bar {
            border: var(--ddd-border-xs);
            border-color: CanvasText;
          }
          .fill {
            background-color: CanvasText;
          }
        }
      `,
    ];
  }
  render() {
    if (!this.total || this._editMode) {
      return nothing;
    }
    const done = Math.min(this.done, this.total);
    const text = this.t.activitiesDone
      .replace("{done}", done)
      .replace("{total}", this.total);
    return html`<span class="label" id="label" part="label">${text}</span>
      <div
        class="bar"
        part="bar"
        role="progressbar"
        aria-label="${this.t.pageProgress}"
        aria-valuemin="0"
        aria-valuemax="${this.total}"
        aria-valuenow="${done}"
        aria-valuetext="${text}"
      >
        <span
          class="fill"
          part="fill"
          style="width: ${Math.round((done / this.total) * 100)}%"
        ></span>
      </div>`;
  }
}
globalThis.customElements.define(SitePageProgress.tag, SitePageProgress);
