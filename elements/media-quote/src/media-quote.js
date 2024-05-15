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
    this.src = '';
    this.alt = '';
    this.caption = '';
    
    // Citation
    this.author = '';
    this.authorDetail = '';
  }

  static get styles() {
    return [
      super.styles,
        css`
          /* https://oer.hax.psu.edu/bto108/sites/haxcellence/documentation/ddd */
          :host {
            display: block;
          }
          
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
            width: 30%;
            font-size: var(--ddd-font-size-ms);
            position: absolute;
            top: 20%;
            left: 15%
          }

          .content {
            box-decoration-break: clone;
          }

          .content, .citation {
            padding: var(--ddd-spacing-0) var(--ddd-spacing-2);
            background-color: var(--ddd-theme-default-beaverBlue);
          }

          .citation {
            margin-top: var(--ddd-spacing-4);
            display: inline-block;
            font-style: italic;
            font-size: 0; /* Prevents a space between author and authorDetail comma on both sides */
            box-decoration-break: clone;
          }
            .author {
              font-weight: var(--ddd-font-weight-bold);
            }
            .author, .author-detail {
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
            border-top: var(--ddd-border-lg);
            margin-top: var(--ddd-spacing-1);
            padding-top: var(--ddd-spacing-1);
          }

          /* @media screen and (max-width: 1550px) and (min-width: 1350px) {
            .quote {
              font-size: var(--ddd-font-size-xs);
            }

            .author, .author-detail {
              font-size: var(--ddd-font-size-xxs);
            }
          }

          @media screen and (max-width: 1349px) and (min-width: 1000px) {
            .quote {
              position: relative;
              width: 100%;
              top: 0%;
              left: 0%;
            }
          } */
      `,];
  }

  render() {
    return html`
        <div class="media-quote-container">
          <figure>
            <div class="text-overlay"> 
              <p class="quote">
                <span class="content"><slot></slot></span>
                ${this.author !== '' ? html`
                  <span class="citation">
                    <span class="author">- ${this.author}</span> 
                      ${this.authorDetail !== '' ? html`
                        <span class="author-detail">, ${this.authorDetail}</span>
                      ` : ''}
                  </span>
                ` : ''}
              </p>  
            </div>
            <img src="${this.src}" alt="${this.alt}">
            ${this.caption !== '' ? html`<figcaption>${this.caption}</figcaption>` : ''}
          </figure>
        </div>
    `
  }

  static get properties() {
    return {
      ...super.properties,
      src: {
        type: String,
      },
      alt: {
        type: String,
      },
      caption: {
        type: String,
      },
      author: {
        type: String,
      },
      authorDetail: {
        type: String,
        attribute: "author-detail",
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
