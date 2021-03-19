import { html, css, LitElement } from "lit-element/lit-element.js";

class LetterGrade extends LitElement {
  constructor() {
    super();
    this.pointsSystem = "pts";
    this.score = null;
    this.total = null;
    this.gradeScale = [];
    this._letterIndex = null;
    this.letter = "";
    this.showScale = false;
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
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
          letter-spacing: -2px;
        }
        .score,
        .range {
          font-weight: var(--letter-grade-range-font-weight, normal);
          font-size: var(--letter-grade-range-font-size, 12px);
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
    `;
  }
  static get properties() {
    return {
      score: { type: Number },
      total: { type: Number },
      pointsSystem: { type: String, attribute: "points-system" },
      gradeScale: { type: Array, attribute: "grade-scale" },
      letter: { type: String, reflect: true },
      showScale: { type: Boolean, reflect: true, attribute: "show-scale" },
    };
  }
  static get tag() {
    return "letter-grade";
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (
        ["total", "score", "gradeScale"].includes(propName) &&
        this[propName]
      ) {
        if (this.gradeScale.length > 0) {
          clearTimeout(this.__debounce);
          this.__debounce = setTimeout(() => {
            this.letter = this.calculateLetterGrade();
          }, 0);
        }
      }
    });
  }
  /**
   * return the letter grade based on score and gradeScale existing
   */
  calculateLetterGrade() {
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
