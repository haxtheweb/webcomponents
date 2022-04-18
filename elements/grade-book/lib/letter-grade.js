import { html, css, LitElement } from "lit";
import { GradeBookStore } from "./grade-book-store.js";
import { autorun, toJS } from "mobx";
class LetterGrade extends LitElement {
  constructor() {
    super();
    this.pointsSystem = "pts";
    this.score = null;
    this.total = null;
    this.gradeScale = [];
    this.displayOnly = false;
    this._letterIndex = null;
    this.letter = "";
    this.showScale = false;
    this.value = "";
    this.mini = false;
    this.label = "";
    this.active = false;
    autorun(() => {
      this.gradeScale = toJS(GradeBookStore.gradeScale);
    });
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        :host([letter="/"]) {
          --letter-grade-default-letter-background-color: #cccccc;
        }
        :host([letter="F"]) {
          --letter-grade-default-letter-background-color: #ff4444;
        }
        :host([letter="D"]) {
          --letter-grade-default-letter-background-color: #ff7744;
        }
        :host([letter="C"]),
        :host([letter="C+"]) {
          --letter-grade-default-letter-background-color: #ffff00;
        }
        :host([letter="B"]),
        :host([letter="B-"]) {
          --letter-grade-default-letter-background-color: #ffff66;
        }
        :host([letter="B+"]),
        :host([letter="A-"]) {
          --letter-grade-default-letter-background-color: #aaffaa;
        }
        :host([letter="A"]) {
          --letter-grade-default-letter-background-color: #55ff55;
        }
        :host([show-scale]) .wrap {
          height: var(--letter-grade-wrap-height, 64px);
          width: var(--letter-grade-wrap-width, 64px);
        }
        :host([mini]) .wrap {
          height: var(--letter-grade-wrap-height, 20px);
          width: var(--letter-grade-wrap-width, 20px);
          border: 1px solid black;
          border-radius: 0px;
          padding: 8px;
        }
        :host([mini]) .letter {
          font-size: var(--letter-grade-letter-font-size, 12px);
          line-height: var(
            --letter-grade-letter-line-height,
            var(--letter-grade-letter-font-size, 20px)
          );
        }
        .wrap {
          height: var(--letter-grade-wrap-height, 40px);
          width: var(--letter-grade-wrap-width, 40px);
          padding: var(--letter-grade-wrap-padding, 16px);
          border: var(--letter-grade-wrap-border, 4px solid black);
          border-radius: 50%;
          box-shadow: rgb(0 0 0 / 20%) 0px 5px 5px 0px;
          text-align: center;
          justify-content: center;
          vertical-align: middle;
          background-color: var(
            --letter-grade-wrap-background-color,
            var(--letter-grade-default-letter-background-color, transparent)
          );
        }
        .letter {
          font-weight: var(--letter-grade-letter-font-weight, bold);
          font-size: var(--letter-grade-letter-font-size, 40px);
          line-height: var(
            --letter-grade-letter-line-height,
            var(--letter-grade-letter-font-size, 40px)
          );
          letter-spacing: 2px;
        }
        .score,
        .range {
          font-weight: var(--letter-grade-range-font-weight, normal);
          font-size: var(--letter-grade-range-font-size, 12px);
        }
        simple-tooltip {
          --simple-tooltip-background: #000000;
          --simple-tooltip-opacity: 1;
          --simple-tooltip-text-color: #ffffff;
          --simple-tooltip-delay-in: 0;
          --simple-tooltip-duration-in: 200ms;
          --simple-tooltip-duration-out: 0;
          --simple-tooltip-border-radius: 0;
          --simple-tooltip-font-size: 14px;
        }
      `,
    ];
  }
  render() {
    return html`
      <div class="wrap">
        <div class="letter">${this.letter}</div>
        ${this.showScale && this._letterIndex !== null
          ? html`<div class="score">
              (${this.score}/${this.total} ${this.pointsSystem})
            </div>`
          : ``}
        ${this.showScale && this._letterIndex !== null
          ? html`<div class="range">
              ${this.gradeScale[this._letterIndex].lowRange}% -
              ${this.gradeScale[this._letterIndex].highRange}%
            </div>`
          : ``}
      </div>
      ${this.mini
        ? html`<simple-tooltip position="top"
            >${this.label}<br />${this.score != null
              ? html`(${this.score}/${this.total} ${this.pointsSystem})`
              : ``}</simple-tooltip
          >`
        : ``}
    `;
  }
  static get properties() {
    return {
      score: { type: Number },
      total: { type: Number },
      value: { type: Number },
      pointsSystem: { type: String, attribute: "points-system" },
      gradeScale: { type: Array },
      letter: { type: String, reflect: true },
      showScale: { type: Boolean, reflect: true, attribute: "show-scale" },
      mini: { type: Boolean, reflect: true },
      label: { type: String },
      displayOnly: { type: Boolean, attribute: "display-only" },
      active: { type: Boolean, reflect: true },
    };
  }
  static get tag() {
    return "letter-grade";
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "mini" && this[propName] && this.label) {
        import("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");
      }
      if (
        ["total", "score", "gradeScale"].includes(propName) &&
        !this.displayOnly
      ) {
        if (this.gradeScale.length > 0) {
          this.letter = this.calculateLetterGrade();
        }
      }
      if (propName === "letter" && this.gradeScale[this._letterIndex]) {
        // progressive enhancement like PDF printing
        this.innerHTML = `
        <div>---------------------------------------</div>
        <div style="font-size:36px;line-height:48px;">${this.letter}</div>
        <div style="font-size:20px;line-height:24px;">${this.score}/${
          this.total
        } ${this.pointsSystem}</div>
        <div style="font-size:16px;line-height:24px;">Range: ${
          this.gradeScale[this._letterIndex].lowRange
        }% -
        ${this.gradeScale[this._letterIndex].highRange}%</div>
        <div>---------------------------------------</div>
        `;
      }
    });
  }
  /**
   * return the letter grade based on score and gradeScale existing
   */
  calculateLetterGrade() {
    // support no score, meaning it is not turned in / evaluated
    if (this.score === null) {
      return "/";
    }
    let percent = (this.score / this.total) * 100;
    // account for us having MORE points than max
    if (this.gradeScale[0] && percent >= this.gradeScale[0].highRange) {
      this._letterIndex = 0;
      return this.gradeScale[0].letter;
    } else {
      for (var i in this.gradeScale) {
        let val = this.gradeScale[i];
        if (percent <= val.highRange && percent >= val.lowRange) {
          this._letterIndex = i;
          return this.gradeScale[i].letter;
        }
      }
      this._letterIndex = this.gradeScale.length - 1;
      return this.gradeScale[this.gradeScale.length - 1].letter;
    }
  }
}

customElements.define(LetterGrade.tag, LetterGrade);
export { LetterGrade };
