import { html, css, LitElement } from "lit-element/lit-element.js";
import { GradeBookStore } from "./grade-book-store.js";
import { autorun, toJS } from "mobx";
import "./letter-grade.js";

class LetterGradePicker extends LitElement {
  constructor() {
    super();
    this.value = null;
  }
  static get properties() {
    return {
      value: {
        type: String,
      },
    };
  }
  static get styles() {
    return [
      css`
        :host {
          display: flex;
        }
        letter-grade {
          display: inline-flex;
          filter: brightness(80%) saturate(50%);
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
      `,
    ];
  }
  render() {
    return html`
      ${GradeBookStore.gradeScale.map(
        (scale) => html`
          <button
            ?data-selected-value="${scale.letter == this.value}"
            letter="${scale.letter}"
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
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "value") {
        this.dispatchEvent(
          new CustomEvent("value-changed", {
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
