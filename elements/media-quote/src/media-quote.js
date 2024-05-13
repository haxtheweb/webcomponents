/**
 * Copyright 2024
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { DDD } from "@lrnwebcomponents/d-d-d/d-d-d.js";

/**
 * `media-quote`
 * `A quote focused around a piece of media with citation`
 * @demo demo/index.html
 * @element media-quote
 */
class MediaQuote extends DDD {
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
    mediaSrc = '';
  }

  static get styles() {
    return [
      super.styles,
      css`
        
    `];
  }

  render() {
    return html`
        <div class='media-quote-container'>
          <div class='text-overlay'> 
          
          </div>
        </div>
        
    `
  }

  static get properties() {
    return {
      ...super.properties
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
globalThis.customElements.define(MediaQuote.tag, MediaQuote);
export { MediaQuote };
