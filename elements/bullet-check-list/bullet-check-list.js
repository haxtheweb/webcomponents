/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css, nothing } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import {
  DDDBlockStyles,
  renderDDDBlockHeader,
} from "@haxtheweb/d-d-d/lib/DDDBlock.js";
import { DDDStatusTokens } from "@haxtheweb/d-d-d/lib/DDDStatusTokens.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import {
  activityId,
  buildStatement,
  legacyActivityId,
  XAPI_ACTIVITY_TYPES,
  XAPI_EXTENSIONS,
} from "@haxtheweb/user-action/lib/xapi.js";

/**
 * `bullet-check-list`
 * `A GitHub style list of checkboxes whose state is remembered on this machine`
 *
 * Storage key scheme (localStorage):
 *   bullet-check-list:v1:<location.pathname>:<id>[:<n>]
 * - <id> is the `storage-id` attribute when set, otherwise a deterministic
 *   fingerprint (FNV-1a hash) of the title plus the item labels.
 * - <n> is only appended when more than one list on the same page resolves to
 *   the same <id>; it is the zero based document order among those lists and
 *   is omitted for the first one so keys stay stable if a duplicate is added.
 * - HAX generates and saves a random `storage-id` the first time the element
 *   is edited, so authored lists keep their key when labels are re-worded.
 * Value: JSON {"v":1,"checked":["<item label>", ...]}
 *
 * Learner progress: every tick also goes out as an xAPI statement
 * (user-engagement detail.statement; progressed, then completed when all
 * are ticked) that the learner profile keeps. Ticks saved under the key
 * above before that existed are announced once with a
 * `learner-progress-import` event so the profile picks them up. The key is
 * still written and read for backwards compatibility; when it is empty the
 * list asks the profile (`learner-progress-request`) for its ticks.
 *
 * @demo demo/index.html
 * @element bullet-check-list
 */

export const BulletCheckListStatusList = ["stop", "warning", "success", "info"];

// FNV-1a 32 bit, hex. Deterministic and tiny; not a security feature.
export function bulletCheckListHash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

class BulletCheckList extends SchemaBehaviors(I18NMixin(DDD)) {
  static get tag() {
    return "bullet-check-list";
  }

  /**
   * xAPI statements this element sends (see scripts/generate-xapi-vocabulary.mjs)
   */
  static get xapiVocabulary() {
    return {
      tag: "bullet-check-list",
      event: "user-engagement",
      verbs: ["progressed", "completed"],
      objectType: "http://adlnet.gov/expapi/activities/objective",
      result: ["completion", "response", "score"],
      countsTowardCompletion: true,
      done: "every item ticked",
    };
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this._progressListeners) {
      this._progressListeners = new AbortController();
      globalThis.addEventListener(
        "learner-progress-cleared",
        () => {
          this._checked = [];
        },
        { signal: this._progressListeners.signal },
      );
    }
  }

  disconnectedCallback() {
    if (this._progressListeners) {
      this._progressListeners.abort();
      this._progressListeners = null;
    }
    super.disconnectedCallback();
  }

  /**
   * Author content that identifies this list for its xAPI activity id
   */
  xapiFingerprint() {
    return BulletCheckList.baseId(this);
  }

  static get styles() {
    return [
      super.styles,
      DDDStatusTokens,
      DDDBlockStyles,
      css`
        :host {
          display: block;
          color: var(--text-color);
          width: auto;
          --text-color: var(
            --ddd-component-bullet-check-list-text-color,
            light-dark(
              var(--ddd-theme-default-coalyGray),
              var(--ddd-theme-default-white)
            )
          );
          --background-color: var(
            --ddd-component-bullet-check-list-background,
            transparent
          );
          --accent-color: light-dark(
            var(--ddd-theme-default-info),
            var(--ddd-theme-default-skyBlue)
          );
          --on-accent-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          --focus-color: var(
            --ddd-component-bullet-check-list-focus,
            light-dark(
              var(--ddd-theme-default-nittanyNavy),
              var(--ddd-theme-default-white)
            )
          );
          --bcl-line: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          --bcl-muted: var(
            --ddd-component-bullet-check-list-text-color,
            light-dark(
              var(--ddd-theme-default-slateGray),
              var(--ddd-theme-default-limestoneGray)
            )
          );
          --bcl-done: light-dark(
            var(--ddd-theme-default-opportunityGreen),
            var(--ddd-theme-default-futureLime)
          );
          --bcl-on-done: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          --bcl-current: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            color-mix(in srgb, var(--ddd-theme-default-white) 8%, transparent)
          );
          margin: var(--ddd-spacing-5) 0;
        }
        :host([hidden]) {
          display: none;
        }
        /* an author picked DDD primary replaces the default (info) colour; a
           status keeps its own meaning */
        :host([data-primary]:not([status])) {
          --accent-color: var(--ddd-theme-primary);
          --on-accent-color: var(--ddd-theme-bgContrast, white);
        }
        :host([status="stop"]) {
          --accent-color: var(--ddd-theme-default-original87Pink);
          --on-accent-color: var(--ddd-theme-default-white);
        }
        :host([status="warning"]) {
          --accent-color: var(--ddd-theme-default-keystoneYellow);
          --on-accent-color: var(--ddd-theme-default-nittanyNavy);
        }
        :host([status="success"]) {
          --accent-color: light-dark(
            var(--ddd-theme-default-success),
            var(--ddd-theme-default-opportunityGreen)
          );
          --on-accent-color: var(--ddd-theme-default-white);
        }
        :host([status="info"]) {
          --accent-color: light-dark(
            var(--ddd-theme-default-info),
            var(--ddd-theme-default-skyBlue)
          );
        }

        .ddd-block {
          --ddd-block-background: var(--background-color);
          --ddd-block-accent: var(
            --ddd-component-bullet-check-list-border,
            var(--accent-color)
          );
          --ddd-block-chip-background: var(
            --ddd-component-bullet-check-list-icon-background,
            var(--accent-color)
          );
          --ddd-block-chip-color: var(--on-accent-color);
          color: var(--text-color);
          border-top: var(--ddd-border-size-md) solid var(--ddd-block-accent);
        }
        .ddd-block-title {
          color: var(--text-color);
        }
        .ddd-block-label {
          color: var(--bcl-muted);
        }
        .ddd-block-chip simple-icon {
          --simple-icon-height: var(--ddd-icon-3xs);
          --simple-icon-width: var(--ddd-icon-3xs);
          color: var(--on-accent-color);
        }

        ul,
        ol {
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 0;
        }
        li {
          position: relative;
          margin: 0;
          padding-block: var(--ddd-spacing-3);
          padding-inline: var(--ddd-spacing-3) var(--ddd-spacing-4);
          border-bottom: var(--ddd-border-xs);
          border-color: var(--bcl-line);
          border-inline-start: var(--ddd-border-size-lg) solid transparent;
        }
        li:last-child {
          border-bottom: none;
        }
        li[aria-current="step"] {
          border-inline-start-color: var(--accent-color);
          background-color: var(--bcl-current);
          font-weight: var(--ddd-font-weight-bold);
        }
        label {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: var(--ddd-spacing-3);
          cursor: pointer;
          font-size: var(--ddd-font-size-3xs);
          line-height: var(--ddd-lh-150);
        }
        /* the real checkbox sits on top of the round marker, transparent, so
           clicks, keyboard focus and screen readers all reach the native
           control while the marker draws its state */
        input[type="checkbox"] {
          position: absolute;
          inset-inline-start: 0;
          top: 0;
          z-index: 1;
          width: var(--ddd-icon-xs);
          height: var(--ddd-icon-xs);
          margin: 0;
          opacity: 0;
          cursor: pointer;
        }
        input[type="checkbox"]:disabled {
          cursor: default;
        }
        .marker {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: none;
          box-sizing: border-box;
          width: var(--ddd-icon-xs);
          height: var(--ddd-icon-xs);
          border: var(--ddd-border-sm);
          border-color: var(--bcl-muted);
          border-radius: var(--ddd-radius-circle);
          color: var(--text-color);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-5xs);
          font-weight: var(--ddd-font-weight-bold);
          line-height: 1;
          --simple-icon-color: currentColor;
          --simple-icon-width: var(--ddd-icon-4xs);
          --simple-icon-height: var(--ddd-icon-4xs);
        }
        .marker .dot {
          width: var(--ddd-spacing-2);
          height: var(--ddd-spacing-2);
          border-radius: var(--ddd-radius-circle);
          background-color: currentColor;
        }
        li[aria-current="step"] .marker {
          border-color: var(--text-color);
        }
        li.checked .marker {
          border-color: var(--bcl-done);
          background-color: var(--bcl-done);
          color: var(--bcl-on-done);
        }
        input[type="checkbox"]:focus-visible + .marker {
          outline: var(--ddd-border-size-md) solid var(--focus-color);
          outline-offset: var(--ddd-spacing-1);
        }
        input[type="checkbox"]:hover:not(:disabled) + .marker {
          border-color: var(--text-color);
        }
        .text {
          flex: 1 1 auto;
          min-width: 0;
          padding-block-start: var(--ddd-spacing-1);
          overflow-wrap: anywhere;
        }
        label.locked {
          cursor: default;
        }
        li.locked:not(.checked) .marker {
          border-style: dashed;
          color: var(--bcl-muted);
        }
        li.locked:not(.checked) .text {
          color: var(--bcl-muted);
        }
        li.locked:not(.checked):not(:last-child) {
          border-bottom-style: dashed;
        }
        .checked .text {
          text-decoration: line-through;
        }
        .badge {
          flex: 0 0 auto;
          margin-inline-start: auto;
          margin-block-start: var(--ddd-spacing-1);
          padding: 0 var(--ddd-spacing-2);
          border: var(--ddd-border-sm);
          border-color: currentColor;
          border-radius: var(--ddd-radius-rounded);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-6xs);
          font-weight: var(--ddd-font-weight-bold);
          line-height: var(--ddd-lh-150);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        /* directions strip under the header, as on quiz questions */
        .directions {
          padding-block: var(--ddd-spacing-3);
          padding-inline: var(--ddd-surface-padding, var(--ddd-spacing-4));
          border-bottom: var(--ddd-border-xs);
          border-color: var(--bcl-line);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150);
        }
        .directions p {
          margin: 0;
        }
        /* the footer is the action bar: status on the left, meter right */
        .ddd-block-footer {
          justify-content: space-between;
          background-color: var(--ddd-status-answered-bg);
        }
        .ddd-block[data-complete] .ddd-block-footer {
          border-top: var(--ddd-border-size-md) var(--ddd-status-correct-line)
            var(--ddd-status-correct-signal);
        }
        .status {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          min-height: var(--ddd-icon-xxs);
        }
        .status-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: none;
          width: var(--ddd-icon-xxs);
          height: var(--ddd-icon-xxs);
          border-radius: var(--ddd-radius-circle);
          background-color: var(--ddd-status-correct-signal);
          color: var(--ddd-status-default-bg);
          --simple-icon-color: currentColor;
          --simple-icon-width: var(--ddd-icon-4xs);
          --simple-icon-height: var(--ddd-icon-4xs);
        }
        .status-word {
          color: var(--ddd-status-correct-ink);
        }
        .progress {
          margin: 0;
          font-size: var(--ddd-font-size-4xs);
        }
        .meter {
          flex: 0 1 var(--ddd-spacing-30);
          min-width: var(--ddd-spacing-16);
          height: var(--ddd-spacing-2);
          margin-inline-end: var(--ddd-spacing-2);
          border-radius: var(--ddd-radius-rounded);
          background-color: var(--bcl-line);
          overflow: hidden;
        }
        .meter span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background-color: var(--bcl-done);
        }
        @media (prefers-reduced-motion: no-preference) {
          li,
          .marker {
            transition:
              border-color var(--ddd-duration-normal, 0.3s) ease-in-out,
              background-color var(--ddd-duration-normal, 0.3s) ease-in-out;
          }
          .meter span {
            transition: width var(--ddd-duration-normal, 0.3s) ease-in-out;
          }
        }
        @media (forced-colors: active) {
          li[aria-current="step"] {
            border-inline-start-color: Highlight;
          }
          li.checked .marker {
            border-color: CanvasText;
            background-color: Canvas;
            color: CanvasText;
          }
          input[type="checkbox"]:focus-visible + .marker {
            outline-color: Highlight;
          }
          .meter span {
            background-color: CanvasText;
          }
        }
      `,
    ];
  }

  constructor() {
    super();
    this.title = "";
    this.items = [];
    this.ordered = false;
    this.status = "info";
    this.storageId = "";
    this.typeof = "oer:LearningComponent";
    this._checked = [];
    this._haxstate = false;
    this._storageKey = null;
    this.t = {
      progress: "{done} of {total} complete",
      currentStep: "Current step",
      checklist: "Checklist",
      blockLabel: "Checklist · {done} of {total}",
      directions: "Directions",
      showDirections: "Show directions",
      hideDirections: "Hide directions",
      checklistDirections:
        "Tick each item as you finish it. Your ticks are kept so you can pick up where you left off.",
      orderedDirections:
        "Work through the steps in order and tick each one as you finish it. Your ticks are kept so you can pick up where you left off.",
      complete: "Complete",
    };
    // directions start closed, as they do on quiz questions
    this._directionsOpen = false;
    this.registerLocalization({
      context: this,
      basePath: import.meta.url,
    });
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * Visible name of the list; also the accessible name of the group.
       */
      title: { type: String, reflect: true },
      /**
       * Array of {label, checked, disabled}. `checked` items are pre-completed
       * by the author and, like `disabled` ones, can not be changed by readers.
       */
      items: { type: Array },
      /**
       * Render a numbered list instead of a bulleted one.
       */
      ordered: { type: Boolean, reflect: true },
      /**
       * Color / icon treatment, matches stop-note: stop, warning, success, info.
       */
      status: { type: String, reflect: true },
      /**
       * Optional author supplied id used to build the localStorage key.
       */
      storageId: { type: String, attribute: "storage-id", reflect: true },
      /**
       * OER Schema type. Reflected (rather than set in firstUpdated) so it is
       * also in the server rendered HTML that crawlers read.
       */
      typeof: { type: String, reflect: true },
      _checked: { type: Array, state: true },
      _haxstate: { type: Boolean, state: true },
    };
  }

  /**
   * Items cleaned up: only objects / strings with a label are kept.
   */
  get _items() {
    return (Array.isArray(this.items) ? this.items : [])
      .map((item) => (typeof item === "string" ? { label: item } : item || {}))
      .filter((item) => typeof item.label === "string" && item.label.trim())
      .map((item) => ({
        key: item.label.trim(),
        label: item.label.trim(),
        preChecked: !!item.checked,
        locked: !!item.checked || !!item.disabled,
      }));
  }

  _isChecked(item) {
    return item.preChecked || this._checked.includes(item.key);
  }

  /**
   * Id portion of the storage key, before duplicate disambiguation.
   */
  static baseId(el) {
    if (el.storageId) {
      return String(el.storageId);
    }
    const labels = (Array.isArray(el.items) ? el.items : [])
      .map((i) => (typeof i === "string" ? i : i && i.label) || "")
      .join("\u0001");
    return `h${bulletCheckListHash(`${el.title || ""}\u0001${labels}`)}`;
  }

  _computeStorageKey() {
    let path = "";
    try {
      path = globalThis.location.pathname || "";
    } catch {
      path = "";
    }
    const base = BulletCheckList.baseId(this);
    let n = 0;
    try {
      const root = this.getRootNode();
      const peers = Array.from(root.querySelectorAll(BulletCheckList.tag));
      n = peers
        .filter((peer) => BulletCheckList.baseId(peer) === base)
        .indexOf(this);
    } catch {
      n = 0;
    }
    return `bullet-check-list:v1:${path}:${base}${n > 0 ? `:${n}` : ""}`;
  }

  _readStore() {
    try {
      const raw = globalThis.localStorage.getItem(this._storageKey);
      const data = raw ? JSON.parse(raw) : null;
      if (data && Array.isArray(data.checked)) {
        return data.checked.filter((k) => typeof k === "string");
      }
    } catch {
      // storage blocked, full or corrupt: behave as if nothing is saved
    }
    return [];
  }

  _writeStore() {
    try {
      globalThis.localStorage.setItem(
        this._storageKey,
        JSON.stringify({ v: 1, checked: this._checked }),
      );
      return true;
    } catch {
      // keep working in memory only
      return false;
    }
  }

  _loadState() {
    this._storageKey = this._computeStorageKey();
    const keys = this._items.map((i) => i.key);
    this._checked = this._readStore().filter((k) => keys.includes(k));
    // after this update: hand legacy ticks to the profile once, or read
    // the ticks back from it when the legacy key is empty
    const key = this._storageKey;
    Promise.resolve().then(() => this._syncProgress(key));
  }

  _syncProgress(key) {
    if (!this.isConnected || this._haxstate || this._storageKey !== key) {
      return;
    }
    if (this._checked.length) {
      if (this._importedKey !== key) {
        this._importedKey = key;
        const items = this._items;
        const done = items.filter((i) => this._isChecked(i)).length;
        this.dispatchEvent(
          new CustomEvent("learner-progress-import", {
            bubbles: true,
            composed: true,
            detail: {
              statement: this._statement(
                done === items.length ? "completed" : "progressed",
                done,
                items.length,
                true,
              ),
            },
          }),
        );
      }
      return;
    }
    const detail = {
      activityId: activityId(this),
      tag: BulletCheckList.tag,
      record: null,
    };
    // the id earlier versions used (content fingerprint), moved over once
    const legacy = legacyActivityId(this);
    if (legacy !== detail.activityId) {
      detail.legacyActivityId = legacy;
    }
    globalThis.dispatchEvent(
      new CustomEvent("learner-progress-request", { detail }),
    );
    const record = detail.record;
    if (record && typeof record.response === "string" && record.response) {
      const keys = this._items.map((i) => i.key);
      const ticks = record.response
        .split("[,]")
        .filter((k) => keys.includes(k));
      if (ticks.length) {
        this._importedKey = key;
        this._checked = ticks;
        this._writeStore();
      }
    }
  }

  // xAPI statement for the current ticks
  _statement(verb, done, total, imported = false) {
    const ext = { [XAPI_EXTENSIONS.element]: BulletCheckList.tag };
    if (imported) {
      ext[XAPI_EXTENSIONS.imported] = true;
    }
    return buildStatement({
      verb,
      object: {
        id: activityId(this),
        name: this.title || this._storageKey,
        type: XAPI_ACTIVITY_TYPES.objective,
      },
      result: {
        completion: total > 0 && done === total,
        response: this._items
          .filter((i) => this._isChecked(i) && !i.preChecked)
          .map((i) => i.key)
          .join("[,]"),
        score: { raw: done, max: total, min: 0 },
      },
      context: { extensions: ext },
    });
  }

  willUpdate(changedProperties) {
    if (super.willUpdate) super.willUpdate(changedProperties);
    if (
      this.isConnected &&
      (changedProperties.has("items") ||
        changedProperties.has("storageId") ||
        changedProperties.has("title") ||
        this._storageKey === null)
    ) {
      this._loadState();
    }
    if (
      changedProperties.has("status") &&
      this.status &&
      !BulletCheckListStatusList.includes(this.status)
    ) {
      this.status = "info";
    }
  }

  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    // ?checked in the template only sets the default state (and is what the
    // server renders), so keep the live state of each box in step with it
    const items = this._items;
    const inputs = this.shadowRoot
      ? this.shadowRoot.querySelectorAll("input[type='checkbox']")
      : [];
    inputs.forEach((input, index) => {
      if (items[index]) {
        input.checked = this._isChecked(items[index]);
      }
    });
  }

  _toggle(item, e) {
    if (this._haxstate || item.locked) {
      // authors editing in HAX never change reader state
      e.target.checked = this._isChecked(item);
      return;
    }
    const on = e.target.checked;
    this._checked = on
      ? [...this._checked.filter((k) => k !== item.key), item.key]
      : this._checked.filter((k) => k !== item.key);
    this._writeStore();
    const items = this._items;
    const done = items.filter((i) => this._isChecked(i)).length;
    this._fire("progressed", item, done, items.length);
    if (on && items.length && done === items.length) {
      this._fire("completed", item, done, items.length);
    }
  }

  _fire(activityDisplay, item, done, total) {
    this.dispatchEvent(
      new CustomEvent("user-engagement", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          activityDisplay,
          objectName: this.title || this._storageKey,
          objectDetail: item.label,
          resultCompletion: done === total,
          resultScore: total ? done / total : 0,
          statement: this._statement(activityDisplay, done, total),
        },
      }),
    );
    this.dispatchEvent(
      new CustomEvent("bullet-check-list-changed", {
        bubbles: true,
        composed: true,
        detail: { checked: [...this._checked], done, total },
      }),
    );
  }

  render() {
    const items = this._items;
    const done = items.filter((i) => this._isChecked(i)).length;
    const current = items.findIndex((i) => !this._isChecked(i) && !i.locked);
    const label = this.title || this.t.checklist;
    const pct = items.length ? Math.round((done / items.length) * 100) : 0;
    const rows = items.map((item, index) => {
      const checked = this._isChecked(item);
      const disabled = item.locked || this._haxstate;
      const classes = [checked ? "checked" : "", item.locked ? "locked" : ""]
        .filter(Boolean)
        .join(" ");
      return html`<li
        class="${classes}"
        aria-current="${index === current ? "step" : "false"}"
      >
        <label class="${disabled ? "locked" : ""}">
          <input
            type="checkbox"
            ?checked="${checked}"
            ?disabled="${disabled}"
            @change="${(e) => this._toggle(item, e)}"
          />
          <span class="marker" aria-hidden="true"
            >${
              checked
                ? html`<simple-icon-lite icon="check"></simple-icon-lite>`
                : this.ordered
                  ? index + 1
                  : html`<span class="dot"></span>`
            }</span
          >
          <span class="text">${item.label}</span>
          ${
            index === current
              ? html`<span class="badge">${this.t.currentStep}</span>`
              : ``
          }
        </label>
      </li>`;
    });
    const complete = items.length > 0 && done === items.length;
    return html`
      <div class="ddd-block" ?data-complete="${complete}">
        ${renderDDDBlockHeader({
          chip: html`<simple-icon
            icon="hax:clipboard-pulse"
            no-colorize
            aria-hidden="true"
          ></simple-icon>`,
          label: this.t.blockLabel
            .replace("{done}", done)
            .replace("{total}", items.length),
          title: this.title ? html`<span id="title">${this.title}</span>` : "",
          titleTag: "h3",
          actions: html`<button
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
          <p>
            <span class="sr-only">${this.t.directions}: </span>${
              this.ordered
                ? this.t.orderedDirections
                : this.t.checklistDirections
            }
          </p>
        </div>
        <div class="ddd-block-body">
          <div
            role="group"
            aria-labelledby="${this.title ? "title" : nothing}"
            aria-label="${ifDefined(this.title ? undefined : label)}"
          >
            ${
              this.ordered
                ? html`<ol role="list">
                    ${rows}
                  </ol>`
                : html`<ul role="list">
                    ${rows}
                  </ul>`
            }
          </div>
        </div>
        <div class="ddd-block-footer">
          <div class="status">
            ${
              complete
                ? html`<span class="status-chip" aria-hidden="true"
                    ><simple-icon-lite icon="icons:check"></simple-icon-lite
                  ></span>`
                : nothing
            }
            <p class="progress" role="status">
              ${
                complete
                  ? html`<strong class="status-word"
                      >${this.t.complete}</strong
                    >`
                  : this.t.progress
                      .replace("{done}", done)
                      .replace("{total}", items.length)
              }
            </p>
          </div>
          <span class="meter" aria-hidden="true"
            ><span style="width: ${pct}%"></span
          ></span>
        </div>
      </div>
    `;
  }

  _toggleDirections() {
    this._directionsOpen = !this._directionsOpen;
    this.requestUpdate();
  }

  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
    };
  }

  /**
   * While authoring, block interaction / persistence and make sure the
   * list owns a stable storage-id that is saved with the content.
   */
  haxeditModeChanged(val) {
    if (super.haxeditModeChanged) super.haxeditModeChanged(val);
    this._haxstate = val;
    if (val && !this.storageId) {
      this.storageId = BulletCheckList.generateId();
    }
  }

  haxactiveElementChanged(el, val) {
    if (super.haxactiveElementChanged) super.haxactiveElementChanged(el, val);
    if (val && !this.storageId) {
      this.storageId = BulletCheckList.generateId();
    }
    return false;
  }

  static generateId() {
    try {
      return `bcl-${globalThis.crypto.randomUUID()}`;
    } catch {
      return `bcl-${Date.now().toString(36)}-${Math.random()
        .toString(36)
        .slice(2, 10)}`;
    }
  }

  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}
globalThis.customElements.define(BulletCheckList.tag, BulletCheckList);
export { BulletCheckList };
