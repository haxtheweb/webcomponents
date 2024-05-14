/**
 * Copyright 2024
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";

/**
 * `matching-question`
 * `Match concepts question type`
 * @demo demo/index.html
 * @element matching-question
 */
class MatchingQuestion extends LitElement {
  /**
   * Convention we use
   */
  static get tag() {
    return "matching-question";
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
globalThis.customElements.define(MatchingQuestion.tag, MatchingQuestion);
export { MatchingQuestion };
