/**
 * Copyright 2024
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";

/**
 * `media-quote`
 * `A quote focused around a piece of media with citation`
 * @demo demo/index.html
 * @element media-quote
 */
class MediaQuote extends LitElement {
  /**
   * Convention we use
   */
  static get tag() {
    return "media-quote";
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
globalThis.customElements.define(MediaQuote.tag, MediaQuote);
export { MediaQuote };
