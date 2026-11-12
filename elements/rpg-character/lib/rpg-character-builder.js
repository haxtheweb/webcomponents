/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { HaxUiAdminStyles } from "@haxtheweb/d-d-d/lib/HaxUiAdminStyles.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { I18NManagerStore } from "@haxtheweb/i18n-manager/i18n-manager.js";
import {
  RpgCharacter,
  traitsFromSeed,
  encodeCharacter,
  decodeCharacter,
  codeSlots,
} from "../rpg-character.js";

// numeric look traits, in display order, with how many variants each has
const lookSlots = [
  ["base", "body"],
  ["skin", "skin"],
  ["hair", "hair"],
  ["hatColor", "hairColor"],
  ["face", "face"],
  ["faceItem", "faceItem"],
  ["accessories", "accessory"],
  ["shirt", "shirt"],
  ["pants", "pants"],
];
const styleSlots = ["preset", "hat", "mask", "makeup", "expression", "pose"];
const gearSlots = ["item", "offhand", "feet", "pet"];
const toggleSlots = ["shaved", "seasonal", "fire", "circle"];

/**
 * `rpg-character-builder`
 * Pick every part of an rpg-character with a live preview, and get back a
 * character code that recreates it anywhere (`<rpg-character code="...">`).
 *
 * @demo demo/builder.html
 * @element rpg-character-builder
 * @fires value-changed - detail.value is the new character code
 */
class RpgCharacterBuilder extends I18NMixin(DDD) {
  static get tag() {
    return "rpg-character-builder";
  }

  constructor() {
    super();
    this.code = "";
    this.seed = "";
    this.status = "";
    this.actions = false;
    this.saveLabel = "";
    this.cancelLabel = "";
    this._labels = {};
    this._initialCode = null;
    this.t = {
      characterBuilder: "Character builder",
      name: "Name",
      randomize: "Randomize",
      look: "Look",
      style: "Style",
      gear: "Gear",
      extras: "Extras",
      body: "Body",
      skin: "Skin",
      hair: "Hair",
      hairColor: "Hair color",
      face: "Face",
      faceItem: "Glasses",
      accessory: "Neckwear",
      shirt: "Shirt",
      pants: "Pants",
      circle: "Circle background",
      copyCode: "Copy code",
      copied: "Copied!",
      invalidCode: "That is not a character code.",
      preview: "Character preview",
      previous: "Previous {name}",
      next: "Next {name}",
      variant: "{current} of {total}",
      save: "Save",
      cancel: "Cancel",
      unsavedChanges: "Unsaved changes",
      noUnsavedChanges: "No unsaved changes",
      codeHelp:
        "Paste a code to load a character, or copy this one to use it anywhere.",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../locales", import.meta.url).href,
    });
    // option and setting labels come from rpg-character's own (already
    // translated) HAX settings so they are never translated twice
    I18NManagerStore.registerLocalization({
      namespace: "rpg-character.haxProperties",
      localesPath: new URL("../locales", import.meta.url).href,
    });
  }

  static get properties() {
    return {
      ...super.properties,
      /** The character code being built; set it to load a character */
      code: { type: String, reflect: true },
      /** Name the look (skin, hair...) is derived from */
      seed: { type: String },
      status: { type: String },
      /**
       * Draw a Cancel / Save action bar (in a dialog). Save fires
       * rpg-character-builder-save, Cancel rpg-character-builder-cancel.
       */
      actions: { type: Boolean, reflect: true },
      /** Label for Save in the action bar */
      saveLabel: { type: String, attribute: "save-label" },
      /** Label for Cancel in the action bar */
      cancelLabel: { type: String, attribute: "cancel-label" },
      _labels: { type: Object, state: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      ...HaxUiAdminStyles,
      css`
        /* the HAX UI admin look (hax-ui-admin.md): tokens and controls come
           from HaxUiAdminStyles in d-d-d, so no editor dependency */
        :host {
          display: block;
          box-sizing: border-box;
          color-scheme: var(--hax-ui-color-scheme, inherit);
          container: rpgb / inline-size;
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
        }
        /* in a dialog: fill it below its titlebar, the options scroll and
           the action bar stays */
        :host([actions]) {
          height: calc(
            var(--simple-modal-height, 80vh) - var(
                --simple-modal-titlebar-height,
                48px
              )
          );
          min-height: 360px;
        }
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }
        .frame {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 0;
        }
        .builder {
          flex: 1;
          min-height: 0;
          display: grid;
          grid-template-columns: 300px minmax(0, 1fr);
        }

        /* preview panel */
        .preview {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-4, 16px);
          padding: var(--ddd-spacing-5, 20px);
          border-right: 1px solid var(--hax-ui-line);
          background-color: var(--hax-ui-sunken);
          overflow: auto;
        }
        .stage {
          display: grid;
          place-items: center;
          margin: 0;
          padding: var(--ddd-spacing-3, 12px);
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius-lg);
          background-color: var(--hax-ui-surface);
        }
        .stage rpg-character {
          display: block;
          max-width: 100%;
        }
        .stacked {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .stacked > label,
        .label {
          font-size: 12px;
          font-weight: var(--ddd-font-weight-bold, 700);
          color: var(--hax-ui-text-muted);
        }
        .inline {
          display: flex;
          gap: 8px;
        }
        .inline input {
          flex: 1;
          min-width: 0;
        }
        .help {
          margin: 0;
          font-size: 12px;
          color: var(--hax-ui-text-muted);
        }
        .status {
          min-height: 18px;
          font-size: 12px;
          color: var(--hax-ui-text-muted);
        }
        .status.error {
          color: var(--hax-ui-danger);
          font-weight: var(--ddd-font-weight-bold, 700);
        }

        /* options */
        .options {
          overflow: auto;
          padding: 4px var(--ddd-spacing-5, 20px) var(--ddd-spacing-5, 20px);
        }
        section {
          margin: 0;
          padding: 0;
        }
        h3 {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: var(--ddd-spacing-5, 20px) 0 4px;
          font-size: 11px;
          font-weight: var(--ddd-font-weight-bold, 700);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--hax-ui-text-muted);
        }
        h3::after {
          content: "";
          flex: 1;
          border-top: 1px solid var(--hax-ui-line);
        }
        .rows {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          column-gap: var(--ddd-spacing-6, 24px);
        }
        .row {
          display: grid;
          grid-template-columns: 112px minmax(0, 1fr);
          align-items: center;
          gap: 12px;
          min-height: 44px;
          border-bottom: 1px solid var(--hax-ui-line);
        }
        .row > label,
        .row > .label {
          font-size: 14px;
          font-weight: var(--ddd-font-weight-medium, 500);
          color: var(--hax-ui-text);
        }
        .control {
          display: flex;
          align-items: center;
          gap: 4px;
          min-width: 0;
        }
        .control .hax-ui-select {
          flex: 1;
          min-width: 0;
        }
        .inline .hax-ui-input {
          flex: 1;
          width: auto;
          min-width: 0;
        }
        /* the look steppers are square .hax-ui-btn */
        .step {
          flex: none;
          width: var(--hax-ui-row-height);
          padding: 0;
          font-size: 16px;
          line-height: 1;
        }
        .variant {
          flex: none;
          min-width: 52px;
          font-size: 12px;
          text-align: center;
          color: var(--hax-ui-text-muted);
          font-variant-numeric: tabular-nums;
        }
        /* extras are native checkbox switches drawn as .hax-ui-switch is
           (that class needs a button with aria-checked) */
        input[type="checkbox"] {
          appearance: none;
          flex: none;
          position: relative;
          width: 36px;
          height: 20px;
          margin: 0;
          border-radius: var(--hax-ui-radius-pill);
          background-color: var(--hax-ui-text-muted);
          cursor: pointer;
          transition: background-color var(--hax-ui-duration)
            var(--hax-ui-easing);
        }
        input[type="checkbox"]::after {
          content: "";
          position: absolute;
          top: 2px;
          left: 2px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: var(--hax-ui-surface);
          transition: transform var(--hax-ui-duration) var(--hax-ui-easing);
        }
        input[type="checkbox"]:checked {
          background-color: var(--hax-ui-accent-strong);
        }
        input[type="checkbox"]:checked::after {
          transform: translateX(16px);
        }
        input[type="checkbox"]:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }

        /* action bar (in a dialog) */
        .ftr {
          flex: none;
          display: flex;
          align-items: center;
          gap: 12px;
          min-height: 56px;
          padding: 8px var(--ddd-spacing-5, 20px);
          border-top: 1px solid var(--hax-ui-line);
          background-color: var(--hax-ui-surface);
        }
        .ftr .st {
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--hax-ui-text-muted);
        }
        .ftr .st.dirty {
          color: var(--hax-ui-text);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--hax-ui-accent-strong);
        }

        /* narrow (a phone): the preview sits on top, beside the name, and
           everything scrolls above the action bar */
        @container rpgb (max-width: 720px) {
          .builder {
            display: block;
            overflow: auto;
          }
          .preview {
            display: grid;
            grid-template-columns: 112px minmax(0, 1fr);
            align-items: start;
            gap: 12px;
            padding: 12px;
            border-right: 0;
            border-bottom: 1px solid var(--hax-ui-line);
            overflow: visible;
          }
          .stage {
            grid-row: span 3;
            padding: 4px;
          }
          .stage rpg-character {
            width: 100px;
            height: 126px;
          }
          .code-field {
            grid-column: 1 / -1;
          }
          .options {
            overflow: visible;
            padding: 0 12px 12px;
          }
          .rows {
            grid-template-columns: minmax(0, 1fr);
          }
          .row {
            grid-template-columns: 96px minmax(0, 1fr);
          }
          .ftr {
            position: sticky;
            bottom: 0;
            padding: 8px 12px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          input[type="checkbox"],
          input[type="checkbox"]::after {
            transition: none;
          }
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this._loadLabels();
  }

  /**
   * English labels from rpg-character's HAX settings, overlaid with the
   * active language's translation when there is one.
   */
  async _loadLabels() {
    const labels = {};
    const merge = (configure) => {
      (configure || []).forEach((entry) => {
        const current = labels[entry.property] || { options: {} };
        labels[entry.property] = {
          title: entry.title || current.title,
          options: { ...current.options, ...(entry.options || {}) },
        };
      });
    };
    try {
      const response = await fetch(RpgCharacter.haxProperties);
      if (response.ok) {
        const schema = await response.json();
        merge(schema.settings && schema.settings.configure);
      }
    } catch {
      // labels fall back to option values
    }
    try {
      const translated = await I18NManagerStore.loadNamespaceFile(
        "rpg-character.haxProperties",
      );
      if (translated && translated.settings) {
        merge(translated.settings.configure);
      }
    } catch {
      // English labels are fine
    }
    this._labels = labels;
  }

  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    if (changedProperties.has("t") && changedProperties.get("t")) {
      this._loadLabels();
    }
    // a character to start from: the code if given, else the seed's look
    if (!this.code && !decodeCharacter(this.code)) {
      const start = this.seed || "rpg";
      this.code = encodeCharacter(traitsFromSeed(start));
    }
    // with an action bar, changes are staged against what it opened with
    if (this.actions && this._initialCode === null && this.code) {
      this._initialCode = this.code;
    }
  }

  /** true when the code differs from what the builder opened with */
  get dirty() {
    return this._initialCode !== null && this.code !== this._initialCode;
  }

  _save() {
    this.dispatchEvent(
      new CustomEvent("rpg-character-builder-save", {
        bubbles: true,
        composed: true,
        detail: { code: this.code },
      }),
    );
  }

  _cancel() {
    this.dispatchEvent(
      new CustomEvent("rpg-character-builder-cancel", {
        bubbles: true,
        composed: true,
        detail: { code: this.code },
      }),
    );
  }

  /** step a numbered look choice (body, skin...) to the previous or next */
  _step(name, delta) {
    const slot = codeSlots.find((s) => s.name === name);
    const total = slot.values.length;
    const current = Number(this.character[name]);
    const index = slot.values.indexOf(current);
    const next = slot.values[(index + delta + total) % total];
    this._set(name, next);
  }

  get character() {
    return decodeCharacter(this.code) || decodeCharacter("1-");
  }

  _set(name, value) {
    const character = this.character;
    character[name] = value;
    this._commit(encodeCharacter(character));
  }

  _commit(code) {
    if (code === this.code) {
      return;
    }
    this.code = code;
    this.status = "";
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        bubbles: true,
        composed: true,
        detail: { value: code },
      }),
    );
  }

  _seedChanged(e) {
    this.seed = e.target.value;
    // a new name gives a new look; style and gear choices are kept
    const character = this.character;
    const traits = traitsFromSeed(this.seed || "rpg");
    lookSlots.forEach(([slot]) => {
      character[slot] = traits[slot];
    });
    this._commit(encodeCharacter(character));
  }

  _codeTyped(e) {
    const value = e.target.value.trim();
    if (decodeCharacter(value)) {
      this._commit(value);
    } else {
      this.status = this.t.invalidCode;
    }
  }

  randomize() {
    const pick = (list) => list[Math.floor(Math.random() * list.length)];
    const character = traitsFromSeed(Math.random().toString(36).substring(2));
    character.base = Number(character.base);
    styleSlots.concat(gearSlots).forEach((name) => {
      // mostly keep it simple: each slot is set about a third of the time
      const values = this._slotValues(name);
      character[name] = Math.random() < 0.33 ? pick(values) : "none";
    });
    character.flagText = "";
    this._commit(encodeCharacter(character));
  }

  async copyCode() {
    try {
      await globalThis.navigator.clipboard.writeText(this.code);
      this.status = this.t.copied;
    } catch {
      // clipboard blocked: select the text so it can be copied by hand
      const field = this.shadowRoot.querySelector("#code");
      if (field) {
        field.select();
      }
    }
  }

  _slotValues(name) {
    const slot = codeSlots.find((s) => s.name === name);
    // "random" is not something a builder can save
    return slot.values.filter((v) => v !== "none" && v !== "random");
  }

  _label(name, value) {
    const entry = this._labels[name];
    if (entry && entry.options && entry.options[value]) {
      return entry.options[value];
    }
    return value;
  }

  _title(name) {
    const entry = this._labels[name];
    return entry && entry.title ? entry.title : name;
  }

  renderSelect(name, title) {
    const current = this.character[name];
    const none = this._label(name, "none");
    const id = `opt-${name}`;
    return html`<div class="row">
      <label for="${id}">${title || this._title(name)}</label>
      <div class="control">
        <select
          class="hax-ui-select compact"
          id="${id}"
          data-slot="${name}"
          @change="${(e) => this._set(name, e.target.value)}"
        >
          <option value="none" ?selected="${current === "none"}">
            ${none === "none" ? "-" : none}
          </option>
          ${this._slotValues(name).map(
            (value) =>
              html`<option value="${value}" ?selected="${current === value}">
                ${this._label(name, value)}
              </option>`,
          )}
        </select>
      </div>
    </div>`;
  }

  renderLook(name, key) {
    const slot = codeSlots.find((s) => s.name === name);
    const current = Number(this.character[name]);
    const label = this.t[key];
    const id = `opt-${name}`;
    const total = slot.values.length;
    const at = slot.values.indexOf(current) + 1;
    return html`<div class="row">
      <label for="${id}">${label}</label>
      <div class="control">
        <button
          type="button"
          class="hax-ui-btn step"
          data-step="${name}"
          aria-label="${this.t.previous.replace("{name}", () => label)}"
          @click="${() => this._step(name, -1)}"
        >
          ‹
        </button>
        <select
          class="hax-ui-select compact"
          id="${id}"
          data-slot="${name}"
          @change="${(e) => this._set(name, Number(e.target.value))}"
        >
          ${slot.values.map(
            (value) =>
              html`<option value="${value}" ?selected="${current === value}">
                ${value + 1}
              </option>`,
          )}
        </select>
        <span class="variant" aria-hidden="true"
          >${this.t.variant
            .replace("{current}", () => at)
            .replace("{total}", () => total)}</span
        >
        <button
          type="button"
          class="hax-ui-btn step"
          aria-label="${this.t.next.replace("{name}", () => label)}"
          @click="${() => this._step(name, 1)}"
        >
          ›
        </button>
      </div>
    </div>`;
  }

  renderToggle(name) {
    const title = name === "circle" ? this.t.circle : this._title(name);
    const id = `opt-${name}`;
    return html`<div class="row">
      <label for="${id}">${title}</label>
      <div class="control">
        <input
          id="${id}"
          type="checkbox"
          role="switch"
          data-slot="${name}"
          .checked="${this.character[name]}"
          @change="${(e) => this._set(name, e.target.checked)}"
        />
      </div>
    </div>`;
  }

  render() {
    const character = this.character;
    const invalid = this.status === this.t.invalidCode;
    return html`
      <div class="frame">
        <div class="builder">
          <div class="preview">
            <figure class="stage" aria-label="${this.t.preview}">
              <rpg-character
                code="${this.code}"
                width="226"
                height="284"
              ></rpg-character>
            </figure>
            <div class="stacked">
              <label for="seed">${this.t.name}</label>
              <div class="inline">
                <input
                  class="hax-ui-input compact"
                  id="seed"
                  .value="${this.seed}"
                  @input="${this._seedChanged}"
                />
              </div>
            </div>
            <button type="button" class="hax-ui-btn" @click="${this.randomize}">
              <span aria-hidden="true">⚄</span> ${this.t.randomize}
            </button>
            <div class="stacked code-field">
              <label for="code">${this._title("code")}</label>
              <div class="inline">
                <input
                  class="hax-ui-input compact"
                  id="code"
                  aria-describedby="code-help code-status"
                  .value="${this.code}"
                  @change="${this._codeTyped}"
                />
                <button
                  type="button"
                  class="hax-ui-btn"
                  @click="${this.copyCode}"
                >
                  ${this.t.copyCode}
                </button>
              </div>
              <p class="help" id="code-help">${this.t.codeHelp}</p>
              <div
                class="status ${invalid ? "error" : ""}"
                id="code-status"
                role="status"
                aria-live="polite"
              >
                ${this.status}
              </div>
            </div>
          </div>
          <div class="options">
            <section aria-labelledby="h-look">
              <h3 id="h-look">${this.t.look}</h3>
              <div class="rows">
                ${lookSlots.map(([name, key]) => this.renderLook(name, key))}
              </div>
            </section>
            <section aria-labelledby="h-style">
              <h3 id="h-style">${this.t.style}</h3>
              <div class="rows">
                ${styleSlots.map((name) => this.renderSelect(name))}
              </div>
            </section>
            <section aria-labelledby="h-gear">
              <h3 id="h-gear">${this.t.gear}</h3>
              <div class="rows">
                ${gearSlots.map((name) => this.renderSelect(name))}
                <div class="row">
                  <label for="opt-flagText">${this._title("flagText")}</label>
                  <div class="control">
                    <input
                      class="hax-ui-input compact"
                      id="opt-flagText"
                      maxlength="4"
                      data-slot="flagText"
                      .value="${character.flagText}"
                      @input="${(e) => this._set("flagText", e.target.value)}"
                    />
                  </div>
                </div>
              </div>
            </section>
            <section aria-labelledby="h-extras">
              <h3 id="h-extras">${this.t.extras}</h3>
              <div class="rows">
                ${toggleSlots.map((name) => this.renderToggle(name))}
              </div>
            </section>
          </div>
        </div>
        ${this.actions ? this.renderActions() : ""}
      </div>
    `;
  }

  renderActions() {
    const dirty = this.dirty;
    return html`<div class="ftr">
      <div class="st ${dirty ? "dirty" : ""}" role="status" aria-live="polite">
        ${
          dirty
            ? html`<span class="dot" aria-hidden="true"></span>${
                  this.t.unsavedChanges
                }`
            : this.t.noUnsavedChanges
        }
      </div>
      <button
        type="button"
        class="hax-ui-btn ghost cancel"
        @click="${this._cancel}"
      >
        ${this.cancelLabel || this.t.cancel}
      </button>
      <button
        type="button"
        class="hax-ui-btn ${dirty ? "primary" : ""} save"
        ?disabled="${!dirty}"
        @click="${this._save}"
      >
        ${this.saveLabel || this.t.save}
      </button>
    </div>`;
  }
}

globalThis.customElements.define(RpgCharacterBuilder.tag, RpgCharacterBuilder);
export { RpgCharacterBuilder };
