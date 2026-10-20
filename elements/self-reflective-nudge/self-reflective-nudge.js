/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * Letter grades on the standard 0-4 scale (F = 0 ... A = 4)
 */
const GRADE_SCALE = [
  { label: "F", value: 0 },
  { label: "D", value: 1 },
  { label: "C", value: 2 },
  { label: "B", value: 3 },
  { label: "A", value: 4 },
];

/**
 * Mood faces on a 0-4 scale (low ... great). The text key is looked up in
 * this.t so it is translatable and available to assistive technology.
 */
const MOOD_SCALE = [
  { emoji: "😞", key: "moodVeryLow", value: 0 },
  { emoji: "🙁", key: "moodLow", value: 1 },
  { emoji: "😐", key: "moodOkay", value: 2 },
  { emoji: "🙂", key: "moodGood", value: 3 },
  { emoji: "😄", key: "moodGreat", value: 4 },
];

/**
 * `self-reflective-nudge`
 * `Ask a student to reflect on how they are doing (a grade or a mood) and offer a self-corrective nudge based on their answer.`
 *
 * Nudges are authored as light DOM children so the content stays portable and
 * readable. Each child carries the range it applies to as data attributes:
 * ```html
 * <self-reflective-nudge input="grade" prompt="What did you get on the last quiz?">
 *   <p data-max-value="1" data-link="node/15">Try the end of lesson exercises.</p>
 *   <p data-min-value="2">Great, keep it up!</p>
 * </self-reflective-nudge>
 * ```
 *
 * @demo demo/index.html
 * @element self-reflective-nudge
 */
export class SelfReflectiveNudge extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "self-reflective-nudge";
  }

  constructor() {
    super();
    this.prompt = "";
    this.input = "grade";
    this.response = null;
    this.nudges = [];
    this._observer = null;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      gradePrompt: "What did you get on the last quiz?",
      moodPrompt: "How do you think you are doing?",
      reviewLink: "Review this material",
      grade: "Grade",
      moodVeryLow: "Very low",
      moodLow: "Low",
      moodOkay: "Okay",
      moodGood: "Good",
      moodGreat: "Great",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      /**
       * Question posed to the student. Falls back to a default for the input type.
       */
      prompt: { type: String },
      /**
       * Kind of input to show: "grade" (letter grade) or "mood" (emoji faces)
       */
      input: { type: String, reflect: true },
      /**
       * Value of the scale position the student selected, null until answered
       */
      response: { type: Number, reflect: true },
      /**
       * Array of { minValue, maxValue, nudge, link }. Written to / read from the light DOM.
       */
      nudges: { type: Array },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          font-family: var(--ddd-font-navigation);
          color: var(--ddd-theme-default-coalyGray);
          /* do not inherit a tight line-height from the surrounding theme,
             it squashes the options and packs the nudge text together */
          line-height: var(--ddd-lh-150);
        }
        fieldset {
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-4);
          border: var(--ddd-border-sm);
          border-color: var(--ddd-theme-default-limestoneGray);
          border-radius: var(--ddd-radius-sm);
          background-color: var(--ddd-theme-default-white);
        }
        legend {
          padding: 0 var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-weight-bold);
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }
        .options {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2);
          margin-top: var(--ddd-spacing-2);
        }
        .option {
          position: relative;
        }
        /* radios stay in the accessibility tree and keyboard order, the label is the visible control */
        .option input {
          position: absolute;
          opacity: 0;
          inset: var(--ddd-spacing-0);
          margin: var(--ddd-spacing-0);
          cursor: pointer;
        }
        .option label {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: var(--ddd-spacing-12);
          min-height: var(--ddd-spacing-12);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-3);
          border: var(--ddd-border-md);
          border-color: var(--ddd-theme-default-limestoneGray);
          border-radius: var(--ddd-radius-sm);
          background-color: var(--ddd-theme-default-white);
          font-size: var(--ddd-font-size-l);
          font-weight: var(--ddd-font-weight-bold);
          line-height: var(--ddd-lh-120);
          cursor: pointer;
        }
        :host([input="mood"]) .option label {
          font-size: var(--ddd-font-size-xl);
        }
        .option label:hover {
          background-color: var(--ddd-theme-default-limestoneLight);
        }
        .option input:focus-visible + label {
          outline: var(--ddd-border-md);
          outline-color: var(--ddd-theme-default-keystoneYellow);
          outline-offset: var(--ddd-spacing-1);
        }
        .option input:checked + label {
          border-color: var(--ddd-theme-default-beaverBlue);
          background-color: var(--ddd-theme-default-beaverBlue);
          color: var(--ddd-theme-default-white);
        }
        .nudge {
          margin-top: var(--ddd-spacing-4);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
          border-left: var(--ddd-border-lg);
          border-color: var(--ddd-theme-default-skyBlue);
          background-color: var(--ddd-theme-default-limestoneMaxLight);
          font-size: var(--ddd-font-size-s);
        }
        .nudge p {
          margin: var(--ddd-spacing-0);
        }
        .nudge a {
          display: inline-block;
          margin-top: var(--ddd-spacing-2);
          color: var(--ddd-theme-default-link);
          font-weight: var(--ddd-font-weight-bold);
        }
      `,
    ];
  }

  /**
   * Scale for the active input type
   */
  get scale() {
    if (this.input === "mood") {
      return MOOD_SCALE.map((item) => ({
        value: item.value,
        display: item.emoji,
        label: this.t[item.key],
      }));
    }
    return GRADE_SCALE.map((item) => ({
      value: item.value,
      display: item.label,
      label: `${this.t.grade} ${item.label}`,
    }));
  }

  /**
   * Prompt to display, authored value or the default for the input type
   */
  get activePrompt() {
    if (this.prompt) {
      return this.prompt;
    }
    return this.input === "mood" ? this.t.moodPrompt : this.t.gradePrompt;
  }

  /**
   * The first nudge whose range contains the response, or null.
   * A missing minValue / maxValue means the range is open on that side.
   */
  get selectedNudge() {
    if (this.response === null || this.response === undefined) {
      return null;
    }
    const nudges = Array.isArray(this.nudges) ? this.nudges : [];
    return (
      nudges.find(
        (item) =>
          item &&
          (this._isNil(item.minValue) || this.response >= item.minValue) &&
          (this._isNil(item.maxValue) || this.response <= item.maxValue),
      ) || null
    );
  }

  _isNil(value) {
    return value === null || value === undefined || value === "";
  }

  /**
   * Nudge links come from authored content, so only allow safe destinations.
   * Relative paths (node/15) and http(s) / mailto style links are fine,
   * script-bearing protocols are not.
   */
  _safeLink(link) {
    if (!link || typeof link !== "string") {
      return null;
    }
    const trimmed = link.trim();
    // strip whitespace / control characters browsers ignore inside a protocol
    // eslint-disable-next-line no-control-regex
    const normalized = trimmed.replace(/[\u0000- ]/g, "");
    if (/^(javascript|data|vbscript):/i.test(normalized)) {
      return null;
    }
    return trimmed;
  }

  render() {
    const nudge = this.selectedNudge;
    const link = nudge ? this._safeLink(nudge.link) : null;
    return html`
      <fieldset part="fieldset">
        <legend>${this.activePrompt}</legend>
        <div class="options">
          ${this.scale.map(
            (item) => html`
              <div class="option">
                <input
                  type="radio"
                  name="response"
                  id="option-${item.value}"
                  .value="${String(item.value)}"
                  .checked="${this.response === item.value}"
                  @change="${this._optionChanged}"
                />
                <label for="option-${item.value}" title="${item.label}">
                  <span aria-hidden="true">${item.display}</span>
                  <span class="sr-only">${item.label}</span>
                </label>
              </div>
            `,
          )}
        </div>
        <div class="nudge-region" role="status" aria-live="polite">
          ${nudge && nudge.nudge
            ? html`<div class="nudge" part="nudge">
                <p>${nudge.nudge}</p>
                ${link
                  ? html`<a href="${link}" part="link">${this.t.reviewLink}</a>`
                  : nothing}
              </div>`
            : nothing}
        </div>
      </fieldset>
    `;
  }

  // only user selection fires the event, an authored response attribute does not
  _optionChanged(e) {
    this.response = parseInt(e.target.value);
    this._fireResponse();
  }

  /**
   * Tell the page what was answered and which nudge it produced so an LMS,
   * analytics layer or parent component can react to it
   */
  _fireResponse() {
    const selected = this.scale.find((item) => item.value === this.response);
    const nudge = this.selectedNudge;
    this.dispatchEvent(
      new CustomEvent("self-reflective-nudge-response", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          input: this.input,
          response: this.response,
          label: selected ? selected.label : null,
          nudge: nudge ? nudge.nudge : null,
          link: nudge ? this._safeLink(nudge.link) : null,
        },
      }),
    );
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // defer a microtask so setting nudges does not schedule a second update
    // from within firstUpdated (Lit change-in-update warning)
    queueMicrotask(() => this.loadLightDomData());
    // HAX (or any script) can change the light DOM after first paint
    this._observer = new MutationObserver(() => this.loadLightDomData());
    this._observer.observe(this, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["data-min-value", "data-max-value", "data-link"],
    });
  }

  disconnectedCallback() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    super.disconnectedCallback();
  }

  /**
   * Read nudges off the light DOM. Unlike multiple-choice the data is left in
   * place: the nudge text is not sensitive and keeping it makes the content
   * portable. It is never slotted so it is not rendered twice.
   */
  loadLightDomData() {
    const nodes = Array.from(this.children).filter(
      (node) =>
        node.hasAttribute("data-min-value") ||
        node.hasAttribute("data-max-value") ||
        node.hasAttribute("data-nudge"),
    );
    if (nodes.length === 0) {
      return;
    }
    const nudges = nodes.map((node) => this._nodeToNudge(node));
    // avoid a re-render when the data did not change
    if (JSON.stringify(nudges) !== JSON.stringify(this.nudges)) {
      this.nudges = nudges;
    }
  }

  _nodeToNudge(node) {
    const toNumber = (attr) => {
      const raw = node.getAttribute(attr);
      if (raw === null || raw.trim() === "") {
        return null;
      }
      const num = Number(raw);
      return Number.isNaN(num) ? null : num;
    };
    return {
      minValue: toNumber("data-min-value"),
      maxValue: toNumber("data-max-value"),
      nudge: node.textContent.trim(),
      link: node.getAttribute("data-link") || null,
    };
  }

  /**
   * HAX preprocess Node to Content hook. Writes the nudges array (edited in the
   * HAX form) into the light DOM at save time so the array never needs to be
   * stored as an attribute. Mirrors the pattern used by multiple-choice.
   */
  haxpreProcessNodeToContent(node) {
    if (node.nudges && Array.isArray(node.nudges)) {
      // clear anything previously written so page to page saves stay in sync
      Array.from(node.children).forEach((child) => {
        if (
          child.hasAttribute("data-min-value") ||
          child.hasAttribute("data-max-value") ||
          child.hasAttribute("data-nudge")
        ) {
          child.remove();
        }
      });
      node.nudges.forEach((item) => {
        if (!item) {
          return;
        }
        const p = globalThis.document.createElement("p");
        // always mark the element so a nudge with an open range is still found
        p.setAttribute("data-nudge", "");
        if (!this._isNil(item.minValue)) {
          p.setAttribute("data-min-value", String(item.minValue));
        }
        if (!this._isNil(item.maxValue)) {
          p.setAttribute("data-max-value", String(item.maxValue));
        }
        if (item.link) {
          p.setAttribute("data-link", item.link);
        }
        p.textContent = item.nudge || "";
        node.appendChild(p);
      });
    }
    return node;
  }

  /**
   * Implements haxHooks to tie into the HAX life-cycle if HAX exists.
   */
  haxHooks() {
    return {
      preProcessNodeToContent: "haxpreProcessNodeToContent",
    };
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(SelfReflectiveNudge.tag, SelfReflectiveNudge);
