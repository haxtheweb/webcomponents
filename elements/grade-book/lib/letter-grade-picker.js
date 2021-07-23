import { LitElement, html, css, nothing } from "lit";
import { GradeBookStore } from "./grade-book-store.js";
import { autorun, toJS } from "mobx";
import "./letter-grade.js";
/**
 * `letter-grade-picker`
 * `A headless gradebook that supports multiple backends with rubrics`
 * @demo demo/letter-grade-picker.html Letter grade picker
 * @element letter-grade-picker
 */
class LetterGradePicker extends LitElement {
  constructor() {
    super();
    this.value = null;
    this.label = null;
    this.reveal = false;
    this.arrow = false;
    this.input = false;
    this.possible = 0;
    this.score = 0;
  }
  static get properties() {
    return {
      value: { type: String },
      label: { type: String },
      reveal: { type: Boolean },
      arrow: { type: Boolean },
      input: { type: Boolean },
      possible: { type: Number },
      score: { type: Number },
    };
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
          font-size: 18px;
        }
        letter-grade {
          display: inline-flex;
          filter: brightness(80%) saturate(50%);
        }
        .wrapper {
          display: flex;
        }
        span.prefix,
        .wrapper ::slotted(*) {
          margin-right: 10px;
          width: 90px;
          line-height: 38px;
          display: block;
          padding: 0;
          text-align: end;
          height: 38px;
        }
        button {
          background-color: transparent;
          padding: 0;
          margin: 0;
          border: none;
          border-radius: none;
          cursor: pointer;
        }
        button[active="active"] letter-grade,
        letter-grade[active="active"] {
          filter: brightness(90%) saturate(4);
          outline: 2px solid black;
          outline-offset: -2px;
        }
        button[data-selected-value] letter-grade {
          filter: brightness(100%) saturate(1);
          outline: 4px solid black;
          outline-offset: -4px;
        }
        .score-wrapper {
          display: flex;
          font-size: 28px;
          line-height: 36px;
          word-spacing: -4px;
        }
        simple-fields-field {
          width: 64px;
          margin: 0px -8px 0px 16px;
          --simple-fields-font-size: 28px;
        }
      `,
    ];
  }
  render() {
    return html`
      <div class="wrapper">
        <slot name="prefix"><span class="prefix">${this.label}</span></slot>
        ${GradeBookStore.gradeScale.map(
          (scale, index) => html`
            <button
              ?data-selected-value="${scale.letter == this.value}"
              letter="${scale.letter}"
              id="btn${index}"
              @click="${this.clickScore}"
              @mousedown="${this.activeEventOn}"
              @mouseover="${this.activeEventOn}"
              @focusin="${this.activeEventOn}"
              @mouseout="${this.activeEventOff}"
              @focusout="${this.activeEventOff}"
            >
              <letter-grade
                interactive
                display-only
                letter="${scale.letter}"
                mini
              ></letter-grade>
            </button>
          `
        )}
        ${this.input
          ? html`
              <span class="score-wrapper">
                <simple-fields-field
                  type="number"
                  part="simple-fields-field"
                  min="0"
                  value="${this.score}"
                  max="${this.possible}"
                  @value-changed="${this.scoreUpdated}"
                  maxlength="10"
                ></simple-fields-field>
                / ${this.possible}</span
              >
            `
          : nothing}
        <slot name="suffix"></slot>
        ${this.input ? html`` : nothing}
      </div>
    `;
  }
  activeEventOn(e) {
    e.target.setAttribute("active", "active");
  }
  activeEventOff(e) {
    e.target.removeAttribute("active");
  }

  clickScore(e) {
    this.value = e.target.getAttribute("letter");
    // Value on event can influence score
    const scaleItem = toJS(
      GradeBookStore.gradeScale.find((item) => {
        return this.value === item.letter;
      })
    );
    // forces it to be 2 decimal max
    this.score =
      Math.round((scaleItem.highRange / 100) * this.possible * 100) / 100;
  }
  scoreUpdated(e) {
    // Score on input change can influence value
    const newScore =
      Math.round((e.detail.value / this.possible) * 100 * 100) / 100;
    const scaleItem = toJS(
      GradeBookStore.gradeScale.find((item) => {
        return item.highRange >= newScore && newScore >= item.lowRange;
      })
    );
    this.value = scaleItem.letter;
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "input" && this[propName]) {
        import("@lrnwebcomponents/simple-fields/lib/simple-fields-field.js");
      }
      if (propName === "reveal" && this[propName]) {
      }
      if (["value", "score"].includes(propName)) {
        this.dispatchEvent(
          new CustomEvent(`${propName}-changed`, {
            composed: false,
            bubbles: false,
            cancelable: true,
            detail: this,
          })
        );
      }
    });
  }
  static get tag() {
    return "letter-grade-picker";
  }
}
customElements.define(LetterGradePicker.tag, LetterGradePicker);
export { LetterGradePicker };
