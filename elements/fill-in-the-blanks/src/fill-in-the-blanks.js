/**
 * Copyright 2024
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { MatchingQuestion } from "@lrnwebcomponents/matching-question/matching-question.js";

/**
 * `fill-in-the-blanks`
 * `Fill in the blanks question`
 * @demo demo/index.html
 * @element fill-in-the-blanks
 */
class FillInTheBlanks extends MatchingQuestion {
  /**
   * Convention we use
   */
  static get tag() {
    return "fill-in-the-blanks";
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
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
