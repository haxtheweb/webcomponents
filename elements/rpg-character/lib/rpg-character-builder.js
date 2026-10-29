/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
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
    this._labels = {};
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
      _labels: { type: Object, state: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          font-family: var(--ddd-font-navigation);
          color: var(--ddd-theme-default-coalyGray);
        }
        .builder {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-6);
          align-items: flex-start;
        }
        .preview {
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--ddd-spacing-3);
          padding: var(--ddd-spacing-4);
          border: var(--ddd-border-sm);
          border-radius: var(--ddd-radius-sm);
          background-color: var(--ddd-theme-default-limestoneMaxLight);
        }
        .controls {
          flex: 1 1 320px;
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-4);
        }
        fieldset {
          border: var(--ddd-border-xs);
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-3);
          margin: 0;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: var(--ddd-spacing-3);
        }
        legend {
          font-weight: var(--ddd-font-weight-bold);
          padding: 0 var(--ddd-spacing-2);
        }
        label {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
          font-size: var(--ddd-font-size-4xs);
        }
        label.toggle {
          flex-direction: row;
          align-items: center;
        }
        input,
        select,
        button {
          font-family: inherit;
          font-size: var(--ddd-font-size-4xs);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          border: var(--ddd-border-xs);
          border-radius: var(--ddd-radius-xs);
        }
        button {
          cursor: pointer;
          background-color: var(--ddd-theme-default-beaverBlue);
          color: var(--ddd-theme-default-white);
          border-color: var(--ddd-theme-default-beaverBlue);
        }
        button:hover,
        button:focus-visible {
          background-color: var(--ddd-theme-default-nittanyNavy);
        }
        .code-row {
          display: flex;
          gap: var(--ddd-spacing-2);
          align-items: flex-end;
          width: 100%;
        }
        .code-row label {
          flex: 1 1 auto;
        }
        .status {
          min-height: var(--ddd-spacing-5);
          font-size: var(--ddd-font-size-4xs);
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
      // eslint-disable-next-line baseline-js/use-baseline -- writeText works in Chrome, Firefox and Safari; failure falls back to selecting the text
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
    return html`<label
      >${title || this._title(name)}
      <select
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
      </select></label
    >`;
  }

  renderLook(name, key) {
    const slot = codeSlots.find((s) => s.name === name);
    const current = Number(this.character[name]);
    return html`<label
      >${this.t[key]}
      <select
        data-slot="${name}"
        @change="${(e) => this._set(name, Number(e.target.value))}"
      >
        ${slot.values.map(
          (value) =>
            html`<option value="${value}" ?selected="${current === value}">
              ${value + 1}
            </option>`,
        )}
      </select></label
    >`;
  }

  renderToggle(name) {
    const title = name === "circle" ? this.t.circle : this._title(name);
    return html`<label class="toggle"
      ><input
        type="checkbox"
        data-slot="${name}"
        .checked="${this.character[name]}"
        @change="${(e) => this._set(name, e.target.checked)}"
      />${title}</label
    >`;
  }

  render() {
    const character = this.character;
    return html`
      <div class="builder">
        <figure class="preview" aria-label="${this.t.preview}">
          <rpg-character
            code="${this.code}"
            width="226"
            height="284"
          ></rpg-character>
        </figure>
        <div class="controls">
          <fieldset>
            <legend>${this.t.characterBuilder}</legend>
            <label
              >${this.t.name}
              <input
                id="seed"
                .value="${this.seed}"
                @input="${this._seedChanged}"
            /></label>
            <button type="button" @click="${this.randomize}">
              ${this.t.randomize}
            </button>
          </fieldset>
          <fieldset>
            <legend>${this.t.look}</legend>
            ${lookSlots.map(([name, key]) => this.renderLook(name, key))}
          </fieldset>
          <fieldset>
            <legend>${this.t.style}</legend>
            ${styleSlots.map((name) => this.renderSelect(name))}
          </fieldset>
          <fieldset>
            <legend>${this.t.gear}</legend>
            ${gearSlots.map((name) => this.renderSelect(name))}
            <label
              >${this._title("flagText")}
              <input
                maxlength="4"
                data-slot="flagText"
                .value="${character.flagText}"
                @input="${(e) => this._set("flagText", e.target.value)}"
            /></label>
          </fieldset>
          <fieldset>
            <legend>${this.t.extras}</legend>
            ${toggleSlots.map((name) => this.renderToggle(name))}
          </fieldset>
          <div class="code-row">
            <label
              >${this._title("code")}
              <input
                id="code"
                .value="${this.code}"
                @change="${this._codeTyped}"
            /></label>
            <button type="button" @click="${this.copyCode}">
              ${this.t.copyCode}
            </button>
          </div>
          <div class="status" role="status" aria-live="polite">
            ${this.status}
          </div>
        </div>
      </div>
    `;
  }
}

globalThis.customElements.define(RpgCharacterBuilder.tag, RpgCharacterBuilder);
export { RpgCharacterBuilder };
