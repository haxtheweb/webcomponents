import { LitElement, html } from "lit";

export class RandomWord extends LitElement {
  static get tag() {
    return "random-word";
  }

  constructor() {
    super();
    this.key = null;
    this.phrases = {};
    this.word = null;
  }

  static get properties() {
    return {
      key: { type: String },
      phrases: { type: Object },
      word: { type: String },
    };
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (["key", "phrases"].includes(propName)) {
        this.getNewWord();
      }
      // wipe slot and rebuild
      if (propName === "word" && this[propName]) {
        this.innerHTML = "";
        this.innerHTML = this.word;
        // inform others if they want to tap into events
        this.dispatchEvent(
          new CustomEvent("word-changed", { detail: this.word }),
        );
      }
    });
  }

  getNewWord() {
    if (this.phrases && this.key && this.phrases[this.key]) {
      this.word =
        this.phrases[this.key][
          Math.floor(Math.random() * this.phrases[this.key].length)
        ];
    }
  }

  render() {
    return html`<slot></slot>`;
  }
}
customElements.define(RandomWord.tag, RandomWord);
