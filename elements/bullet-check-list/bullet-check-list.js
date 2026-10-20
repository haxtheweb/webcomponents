import { html, css, nothing } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";

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

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          color: var(--text-color);
          width: auto;
          --text-color: var(
            --ddd-component-bullet-check-list-text-color,
            var(--ddd-theme-default-coalyGray)
          );
          --background-color: var(
            --ddd-component-bullet-check-list-background,
            var(--ddd-theme-default-infoLight)
          );
          --accent-color: light-dark(
            var(--ddd-theme-default-info),
            var(--ddd-theme-default-skyBlue)
          );
          --focus-color: var(
            --ddd-component-bullet-check-list-focus,
            light-dark(
              var(--ddd-theme-default-nittanyNavy),
              var(--ddd-theme-default-white)
            )
          );
          margin: var(--ddd-spacing-5) 0;
        }
        :host([hidden]) {
          display: none;
        }
        :host([status="stop"]) {
          --accent-color: var(--ddd-theme-default-original87Pink);
          --background-color: var(--ddd-theme-default-errorLight);
        }
        :host([status="warning"]) {
          --accent-color: var(--ddd-theme-default-keystoneYellow);
          --background-color: var(--ddd-theme-default-warningLight);
        }
        :host([status="success"]) {
          --accent-color: light-dark(
            var(--ddd-theme-default-success),
            var(--ddd-theme-default-opportunityGreen)
          );
          --background-color: var(--ddd-theme-default-successLight);
        }
        :host([status="info"]) {
          --accent-color: light-dark(
            var(--ddd-theme-default-info),
            var(--ddd-theme-default-skyBlue)
          );
          --background-color: var(--ddd-theme-default-infoLight);
        }

        simple-icon {
          --simple-icon-height: var(--ddd-icon-4xl);
          --simple-icon-width: var(--ddd-icon-4xl);
        }

        .container {
          display: flex;
          width: auto;
        }
        .icon_wrap {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          background-color: var(
            --ddd-component-bullet-check-list-icon-background,
            var(--accent-color)
          );
          padding: var(--ddd-spacing-2);
        }
        .icon_wrap simple-icon {
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
        }
        .message_wrap {
          padding: var(--ddd-spacing-1) var(--ddd-spacing-6);
          flex: 1 1 auto;
          min-width: 0;
          color: var(--text-color);
          background-color: var(--background-color);
          border-right: var(--ddd-border-lg);
          border-color: var(
            --ddd-component-bullet-check-list-border,
            var(--accent-color)
          );
        }
        .main_message {
          margin: var(--ddd-spacing-4) 0 var(--ddd-spacing-2);
        }
        ul,
        ol {
          margin: 0 0 var(--ddd-spacing-2);
          padding: 0;
        }
        ul {
          list-style: none;
        }
        ol {
          list-style: decimal;
          padding-left: var(--ddd-spacing-8);
        }
        li {
          margin: 0;
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          border-left: var(--ddd-border-lg);
          border-color: transparent;
        }
        li[aria-current="step"] {
          border-color: var(--accent-color);
          font-weight: var(--ddd-font-weight-bold);
        }
        label {
          display: flex;
          align-items: flex-start;
          gap: var(--ddd-spacing-2);
          cursor: pointer;
          font-size: var(--ddd-font-size-s);
          line-height: var(--ddd-lh-150);
        }
        input[type="checkbox"] {
          flex: 0 0 auto;
          width: var(--ddd-icon-xxs);
          height: var(--ddd-icon-xxs);
          margin: var(--ddd-spacing-1) 0 0;
          accent-color: var(--accent-color);
          cursor: pointer;
        }
        input[type="checkbox"]:focus-visible {
          outline: var(--ddd-border-lg);
          outline-color: var(--focus-color);
          outline-offset: 2px;
        }
        input[type="checkbox"]:disabled {
          cursor: default;
        }
        label.locked {
          cursor: default;
        }
        .checked .text {
          text-decoration: line-through;
        }
        .badge {
          flex: 0 0 auto;
          margin-left: auto;
          padding: 0 var(--ddd-spacing-2);
          border: var(--ddd-border-sm);
          border-radius: var(--ddd-radius-xs);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          text-transform: uppercase;
        }
        .progress {
          margin: 0 0 var(--ddd-spacing-3);
          font-size: var(--ddd-font-size-4xs);
        }
        @media (prefers-reduced-motion: no-preference) {
          li {
            transition: border-color var(--ddd-duration-normal, 0.3s)
              ease-in-out;
          }
        }
        @media (forced-colors: active) {
          li[aria-current="step"] {
            border-color: Highlight;
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
    this._checked = [];
    this._haxstate = false;
    this._storageKey = null;
    this.t = {
      progress: "{done} of {total} complete",
      currentStep: "Current step",
      checklist: "Checklist",
    };
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

  firstUpdated(changedProperties) {
    if (super.firstUpdated) super.firstUpdated(changedProperties);
    this.setAttribute("typeof", "oer:LearningComponent");
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
    const rows = items.map((item, index) => {
      const checked = this._isChecked(item);
      const disabled = item.locked || this._haxstate;
      return html`<li
        class="${checked ? "checked" : ""}"
        aria-current="${index === current ? "step" : "false"}"
      >
        <label class="${disabled ? "locked" : ""}">
          <input
            type="checkbox"
            .checked="${checked}"
            ?disabled="${disabled}"
            @change="${(e) => this._toggle(item, e)}"
          />
          <span class="text">${item.label}</span>
          ${index === current
            ? html`<span class="badge">${this.t.currentStep}</span>`
            : ``}
        </label>
      </li>`;
    });
    return html`
      <div class="container">
        <div class="icon_wrap">
          <simple-icon
            icon="hax:clipboard-pulse"
            no-colorize
            aria-hidden="true"
          ></simple-icon>
        </div>
        <div class="message_wrap">
          ${this.title
            ? html`<h3 class="main_message" id="title">${this.title}</h3>`
            : ``}
          <div
            role="group"
            aria-labelledby="${this.title ? "title" : nothing}"
            aria-label="${ifDefined(this.title ? undefined : label)}"
          >
            ${this.ordered
              ? html`<ol>
                  ${rows}
                </ol>`
              : html`<ul role="list">
                  ${rows}
                </ul>`}
          </div>
          <p class="progress" role="status">
            ${this.t.progress
              .replace("{done}", done)
              .replace("{total}", items.length)}
          </p>
        </div>
      </div>
    `;
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
