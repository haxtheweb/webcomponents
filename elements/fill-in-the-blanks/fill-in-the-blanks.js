/**
 * Copyright 2024
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { MarkTheWords } from "@lrnwebcomponents/mark-the-words/mark-the-words.js";

/**
 * `fill-in-the-blanks`
 * `Fill in the blanks question`
 * @demo demo/index.html
 * @element fill-in-the-blanks
 */
class FillInTheBlanks extends MarkTheWords {
  /**
   * Convention we use
   */
  static get tag() {
    return "fill-in-the-blanks";
  }

  static get styles() {
    return [super.styles, css`
    
    simple-fields-field {
      display: inline-block;
      margin-bottom: 0;
      vertical-align: middle;
    }
    simple-fields-field[type="textfield"] {
      width: 140px;
      padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
    }
    `];
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
  }

  renderInteraction() {
    return html`<div class="text-wrap"><div class="text">
      ${this.wordList.map(word => html`
      ${word.text.startsWith('[') && word.text.endsWith(']') ? this.renderFillInBlankField(word.text.replace('[','').replace(']','')) : html`${word.text} `}
      `)}
      </div></div>`;
  }

  renderFillInBlankField(word) {
    let ary = word.split("|");
    if (ary.length !== 1) {
      let selectItems = [{
        text: "",
        value: null,
      }, ...ary.map((item) => {
        return {
          text: item,
          value: item
        };
      })];
    return html`
      <simple-fields-field
        type="select"
        .itemsList="${selectItems}"
      ></simple-fields-field>`;        
    }
    else {
      return html`
      <simple-fields-field type="textfield"></simple-fields-field>`;
  
    }
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}
globalThis.customElements.define(FillInTheBlanks.tag, FillInTheBlanks);
export { FillInTheBlanks };
