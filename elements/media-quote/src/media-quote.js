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
    
    // Media Item (Img)
    mediaSrc = '';
    mediaAlt = '';
    caption = '';
    
    // Citation
    author = '';
    authorProfession = '';
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
            <p class='quote'><slot></slot></p>
            ${this.author !== '' ? html`
              <div class='citation'>
                <p><span class='author'>${this.author}</span><span class='author-profession'>, ${this.authorProfession}</span></p>
              </div>
            ` : ''}
          </div>
          <figure>
            <img src="${this.mediaSrc}" alt="${this.mediaAlt}">
            ${this.caption !== '' ? html`<figcaption>${this.caption}</figcaption>` : ''}
          </figure>
        </div>
        
    `
  }

  static get properties() {
    return {
      ...super.properties,
      mediaSrc: {
        type: String,
        attribute: "media-src",
      },
      mediaAlt: {
        type: String,
        attribute: "media-alt",
      },
      caption: {
        type: String,
        attribute: "caption",
      },
      author: {
        type: String,
        attribute: "author",
      },
      authorProfession: {
        type: String,
        attribute: "author-profession",
      }
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
