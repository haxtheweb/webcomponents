import { html, css, LitElement } from "lit-element/lit-element.js";

class LetterGrade extends LitElement {
  constructor() {
    super();
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
        .wrap {
          padding: var(--letter-grade-wrap-padding, 4px);
          border: var(--letter-grade-wrap-border, 1px solid black);
        }
        .letter {
          font-weight: var(--letter-grade-letter-font-weight, bold);
          font-size: var(--letter-grade-letter-font-size, 36px);
        }
        .score,
        .range {
          font-weight: var(--letter-grade-range-font-weight, normal);
          font-size: var(--letter-grade-range-font-size, 16px);
        }
      `,
    ];
  }
  render() {
    return html`
      <div class="wrap">
        <span class="letter"
          >${this.letter}${this.showScale && this._letterIndex !== null
            ? html`<span class="score">(${this.score}/${this.total})</span>`
            : ``}</span
        >
        ${this.showScale && this._letterIndex !== null
          ? html`<span class="range"
              >${this.gradeScale[this._letterIndex].lowRange}% -
              ${this.gradeScale[this._letterIndex].highRange}%</span
            >`
          : ``}
      </div>
    `;
  }
  static get properties() {
    return {
      score: { type: Number },
      total: { type: Number },
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
