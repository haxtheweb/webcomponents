/**
 * Copyright 2024
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { DDD } from "@lrnwebcomponents/d-d-d/d-d-d.js";

/**
 * `media-quote`
 * `A quote focused around a piece of media with citation and optional caption`
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
    this.mediaSrc = '';
    this.mediaAlt = '';
    this.caption = '';
    
    // Citation
    this.author = '';
    this.authorProfession = '';
  }

  static get styles() {
    return [
      super.styles,
        css`
          /* https://oer.hax.psu.edu/bto108/sites/haxcellence/documentation/ddd */
          .media-quote-container {
            font-family: var(--ddd-font-primary);
            display: flex;
            justify-content: center;
          }
          
          .text-overlay {
            z-index: 2;
          }

          .quote {
            display: inline-block;
            padding: var(--ddd-spacing-0) var(--ddd-spacing-3);
            font-style: italic;
            width: 35%;
            box-decoration-break: clone;
            font-size: var(--ddd-font-size-ms);
            position: absolute;
            top: 20%;
            right: 50%;
          }

          .content {
            box-decoration-break: clone;
          }

          .content, .citation {
            background-color: var(--ddd-theme-default-beaverBlue);
            padding: var(--ddd-spacing-0) var(--ddd-spacing-2);
          }

          .citation {
            display: inline-block;
            font-style: italic;
            font-size: 0;
          }
            .author {
              font-weight: bold; /* var(--ddd-font-primary-bold) */
            }
            .author, .author-profession {
              font-size: var(--ddd-font-size-xxs);
            }

          figure {
            width: 60%;
            z-index: 0;
          }

          img {
            width: 100%;
          }

          figcaption {
            color: var(--ddd-theme-default-beaverBlue);
            width: 100%;
            border-top: solid;
            border-color: var(--ddd-theme-default-beaverBlue);
            margin-top: var(--ddd-spacing-1);
            padding-top: var(--ddd-spacing-1);
          }
      `,];
  }

  render() {
    return html`
        <div class='media-quote-container'>
          <figure>
            <div class='text-overlay'> 
              <p class='quote'>
                <span class='content'><slot></slot></span> <br> <br>
                ${this.author !== '' ? html`
                  <span class='citation'>
                    <span class='author'>${this.author}</span> 
                      ${this.authorProfession !== '' ? html`
                        <span class='author-profession'>, ${this.authorProfession}</span>
                    ` : ''}
                  </span>
              ` : ''}
              </p>  
            </div>
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
      },
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
