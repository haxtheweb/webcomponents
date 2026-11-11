/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import {
  DDDBlockStyles,
  renderDDDBlockHeader,
} from "@haxtheweb/d-d-d/lib/DDDBlock.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import {
  activityId,
  buildStatement,
  interactionComponents,
  XAPI_EXTENSIONS,
} from "@haxtheweb/user-action/lib/xapi.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";

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
    this.typeof = "oer:Practice";
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
      practice: "Practice",
      reflect: "Reflect",
      nudge: "Nudge",
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
       * OER Schema type. Reflected so it is also in server rendered HTML.
       */
      typeof: { type: String, reflect: true },
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
      DDDBlockStyles,
      css`
        :host {
          display: block;
          font-family: var(--ddd-font-navigation);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          /* do not inherit a tight line-height from the surrounding theme,
             it squashes the options and packs the nudge text together */
          line-height: var(--ddd-lh-150);
        }
        .ddd-block {
          --ddd-block-background: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        fieldset {
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
          border: none;
          min-width: 0;
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }
        /* A native legend straddles the top border, so half of it sits outside
           the box on whatever background the page has (unreadable dark on dark).
           Floating it full width lays it out as a normal block inside the box. */
        legend {
          float: inline-start;
          width: 100%;
          box-sizing: border-box;
          padding: var(--ddd-spacing-4) var(--ddd-spacing-4)
            var(--ddd-spacing-0);
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-3xs);
          font-weight: var(--ddd-font-weight-bold);
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
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
          clear: both;
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4)
            var(--ddd-spacing-4);
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
        /* pill choices; selected is a navy 2px border on a light blue fill */
        .option label {
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: var(--ddd-control-height-sm);
          min-height: var(--ddd-control-height-sm);
          padding: var(--ddd-spacing-0) var(--ddd-spacing-4);
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-slateGray)
          );
          border-radius: var(--ddd-radius-rounded);
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
          line-height: var(--ddd-lh-120);
          cursor: pointer;
        }
        :host([input="mood"]) .option label {
          font-size: var(--ddd-font-size-xxs);
        }
        .option label:hover {
          border-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
        }
        .option input:focus-visible + label {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .option input:checked + label {
          /* 1px border + 1px inset ring reads as 2px without shifting layout */
          border-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
          box-shadow: inset 0 0 0 var(--ddd-border-size-xs)
            light-dark(
              var(--ddd-theme-default-nittanyNavy),
              var(--ddd-theme-default-linkLight)
            );
          background-color: light-dark(
            var(--ddd-theme-default-skyMaxLight),
            var(--ddd-theme-default-nittanyNavy)
          );
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
        }
        /* author picked DDD colours: primary marks the chosen point, accent
           tints the nudge that answers it */
        :host([data-primary]) .option input:checked + label {
          border-color: var(--ddd-theme-primary);
          box-shadow: inset 0 0 0 var(--ddd-border-size-xs)
            var(--ddd-theme-primary);
        }
        :host([data-accent]) .nudge {
          background-color: var(--ddd-theme-accent);
          color: var(--ddd-theme-colorContrast, black);
        }
        .nudge {
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
          border-top: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          background-color: light-dark(
            var(--ddd-theme-default-skyMaxLight),
            var(--ddd-theme-default-nittanyNavy)
          );
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-4xs);
        }
        .nudge p {
          margin: var(--ddd-spacing-0);
        }
        .nudge strong {
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
        }
        .nudge a {
          display: inline-block;
          margin-top: var(--ddd-spacing-2);
          color: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-linkLight)
          );
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
      <div class="ddd-block">
        ${renderDDDBlockHeader({
          icon: "icons:face",
          label: this.t.practice + " · " + this.t.reflect,
        })}
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
                    ?checked="${this.response === item.value}"
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
            ${
              nudge && nudge.nudge
                ? html`<div class="nudge" part="nudge">
                    <p><strong>${this.t.nudge}:</strong> ${nudge.nudge}</p>
                    ${
                      link
                        ? html`<a href="${link}" part="link"
                            >${this.t.reviewLink}</a
                          >`
                        : nothing
                    }
                  </div>`
                : nothing
            }
          </div>
        </fieldset>
      </div>
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
  /**
   * xAPI statements this element sends (see scripts/generate-xapi-vocabulary.mjs)
   */
  static get xapiVocabulary() {
    return {
      tag: "self-reflective-nudge",
      event: "user-engagement",
      verbs: ["answered"],
      objectType: "http://adlnet.gov/expapi/activities/cmi.interaction",
      interactionType: "likert",
      definition: ["name", "interactionType", "scale"],
      response: "the id of the scale point chosen (no right answer)",
      result: ["completion", "response"],
      countsTowardCompletion: true,
      done: "a response was chosen",
    };
  }
  // learner data: a reflection is a likert interaction with no right answer;
  // scale ids come from the scale's values so they stay the same in every
  // language
  _engagementDetail(selected) {
    const points = interactionComponents(
      this.scale.map((item) => `${this.input}:${item.value}`),
    ).map((c, i) => ({ ...c, description: this.scale[i].label }));
    // the scale getter builds new objects each call, so match by value
    const index = this.scale.findIndex((item) => item.value === selected.value);
    const name = this.activePrompt;
    return {
      activityDisplay: "answered",
      objectName: String(name).slice(0, 120),
      statement: buildStatement({
        verb: "answered",
        object: {
          id: activityId(this, `${this.input}\u0001${name}`),
          name: String(name).slice(0, 120),
          interactionType: "likert",
          scale: points.map(({ id, description }) => ({ id, description })),
        },
        result: {
          completion: true,
          response: index >= 0 ? points[index].id : "",
        },
        context: {
          extensions: { [XAPI_EXTENSIONS.element]: "self-reflective-nudge" },
        },
      }),
    };
  }
  _fireResponse() {
    const selected = this.scale.find((item) => item.value === this.response);
    const nudge = this.selectedNudge;
    if (selected) {
      this.dispatchEvent(
        new CustomEvent("user-engagement", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: this._engagementDetail(selected),
        }),
      );
    }
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

  connectedCallback() {
    super.connectedCallback();
    // HAX (or any script) can change the light DOM after first paint. Watch
    // from connect, not first render, so it also works after the element is
    // moved (disconnect then connect never runs firstUpdated again).
    if (!this._observer) {
      this._observer = new MutationObserver(() => this.loadLightDomData());
      this._observer.observe(this, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ["data-min-value", "data-max-value", "data-link"],
      });
    }
    // the light DOM may have changed while the element was disconnected
    if (this.hasUpdated) {
      this.loadLightDomData();
    }
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // defer a microtask so setting nudges does not schedule a second update
    // from within firstUpdated (Lit change-in-update warning)
    queueMicrotask(() => this.loadLightDomData());
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    // ?checked in the template only sets the default state (and is what the
    // server renders), so keep the live state of the radios in step with the
    // response, e.g. when it is reset after the student has already clicked
    if (changedProperties.has("response") || changedProperties.has("input")) {
      this.shadowRoot
        .querySelectorAll("input[type='radio']")
        .forEach((radio) => {
          radio.checked = this.response === Number(radio.value);
        });
    }
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
