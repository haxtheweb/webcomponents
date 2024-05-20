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

    // Design
    this.hasFilter = false;

    // Logic
    this._isCaptionOpen = false; // not set by user
  }

  static get styles() {
    return [
      super.styles,
        css`
          /* https://oer.hax.psu.edu/bto108/sites/haxcellence/documentation/ddd */
          :host {
            display: block;
            container-type: inline-size;
          }

          /* :host([filter]) img {
            filter: blur(3px);
          } */
          
          .media-quote-container {
            font-family: var(--ddd-font-primary);
            display: flex;
            justify-content: center;
          }
          
          .top-content {
            position: relative;
          }

          .text-overlay {
            display: inline-block;
            padding: var(--ddd-spacing-0) var(--ddd-spacing-3);
            font-style: italic;
            width: 40%;
            font-size: var(--ddd-font-size-ms);
            position: absolute;
            top: 10%;
            left: -15%;
            z-index: 2;
          }

          .content {
            box-decoration-break: clone;
          }

          .content, .citation {
            padding: var(--ddd-spacing-0) var(--ddd-spacing-2);
            background-color: var(--ddd-theme-primary, var(--ddd-primary-1));
            color: var(--lowContrast-override, var(--ddd-theme-bgContrast));
          }

          .citation {
            margin-top: var(--ddd-spacing-4);
            display: inline-block;
            font-style: italic;
            font-size: 0; /* Prevents a space between author and author detail comma on both sides  */
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
            z-index: 1;
          }

          .caption {
            display: flex;
            justify-content: center;
          }

          details {
            width: 100%;
            border: var(--ddd-border-lg);
            border-color: var(--ddd-theme-primary, var(--ddd-primary-1));
          }

          figcaption {
            color: var(--ddd-theme-default-potentialMidnight); 
            width: 95%;
            padding: var(--ddd-spacing-2);
          }

          @container (max-width: 1261px) and (min-width: 1000px) {
            .quote {
              font-size: var(--ddd-font-size-xs);
            }

            .author, .author-detail {
              font-size: var(--ddd-font-size-xxs);
            }
          }

          @container (max-width: 999px) { /* Mobile devices */
            .text-overlay {
              position: relative;
              width: 90%;
              top: 0%;
              left: 0%;
              font-size: var(--ddd-font-size-xs);
            }

            .text-overlay {
              text-align: center;
            }

            .author, .author-detail {
              font-size: var(--ddd-font-size-xxs);
            }

            figure {
              width: 100%;
            }

            .content {
              box-decoration-break: unset;
              display: block;
            }

            .content, .citation {
              padding: var(--ddd-spacing-2) var(--ddd-spacing-2);
            }
          }
      `,
    ];
  }

  render() {
    const HAS_AUTHOR = this.querySelector('[slot="author"]') && this.querySelector('[slot="author"]').textContent.trim().length > 0;
    const HAS_AUTHOR_DETAIL = this.querySelector('[slot="author-detail"]') && this.querySelector('[slot="author-detail"]').textContent.trim().length > 0;
    const HAS_CAPTION = this.querySelector('[slot="caption"]') && this.querySelector('[slot="caption"]').textContent.trim().length > 0;
    
    return html`
        <div class="media-quote-container">
          <figure>
            <div class="top-content">
              <div class="text-overlay"> 
                <p class="quote">
                  <span class="content"><slot name="quote"></slot></span>
                    ${HAS_AUTHOR ? html`
                      <span class="citation">
                        <span class="author">- <slot name="author">${this.author}</slot></span> 
                        ${HAS_AUTHOR_DETAIL ? html`
                          <span class="author-detail">, <slot name="author-detail"></slot></span>
                        ` : ''}
                      </span>
                    ` : ''}
                </p>  
              </div>
              <img src="${this.src}" alt="${this.alt}">
            </div>
            ${HAS_CAPTION ? html`
              <div class="caption">
                <details>
                  <summary>
                    <span class='show-hide'>Show Caption</span>
                  </summary>
                  <figcaption><slot name="caption"></slot></figcaption>
                </details>
              </div>
            ` : ''}
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
      hasFilter: {
        type: Boolean,
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