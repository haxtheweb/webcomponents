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
            container-name: media-quote;
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
            border: var(--ddd-border-lg);
            border-color: var(--ddd-theme-primary, var(--ddd-primary-1));
          }

          .controller:hover {
            cursor: pointer;
          }

          .controller {
            background-color: var(--ddd-theme-primary, var(--ddd-primary-1));
            color: var(--lowContrast-override, var(--ddd-theme-bgContrast));
            display: flex;
            align-items: center;
            padding: var(--ddd-spacing-0) var(--ddd-spacing-2);
          }

          .controller-text {
            display: flex;
            justify-content: space-between;
            width: 100%;
          }

          .controller:hover .show-hide, .controller:focus .show-hide {
            text-decoration: underline;
          }

          .caption-content {
            display: none;
          }

          figcaption {
            color: var(--ddd-theme-default-potentialMidnight); /* TODO needs to contrast background color in dark mode */
            width: 98%;
            padding: var(--ddd-spacing-2);
          }

          @container media-quote (max-width: 1261px) and (min-width: 1000px) {
            .quote {
              font-size: var(--ddd-font-size-xs);
            }

            .author, .author-detail {
              font-size: var(--ddd-font-size-xxs);
            }
          }

          @container media-quote (max-width: 999px) { /* Mobile devices */
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

            figcaption {
              width: 95%;
            }
          }
      `,
    ];
  }

  render() {
    return html`
        <div class="media-quote-container">
          <figure>
            <div class="top-content">
              <div class="text-overlay"> 
                <p class="quote">
                  <span class="content"><slot name="quote"></slot></span>
                    ${this.querySelector('[slot="author"]') && this.querySelector('[slot="author"]').textContent.trim().length > 0 ? html`
                      <span class="citation">
                        <span class="author">- <slot name="author"></slot></span> 
                        ${this.querySelector('[slot="author-detail"]') && this.querySelector('[slot="author-detail"]').textContent.trim().length > 0 ? html`
                          <span class="author-detail">, <slot name="author-detail"></slot></span>
                        ` : ''}
                      </span>
                    ` : ''}
                </p>  
              </div>
              <img src="${this.src}" alt="${this.alt}">
            </div>
            ${this.querySelector('[slot="caption"]') && this.querySelector('[slot="caption"]').textContent.trim().length > 0 ? html`
              <div class="caption">
                <div class='controller' @click=${this.controlCaption}>
                  <p class="controller-text">
                    <span class='show-hide'>Show Caption</span>
                    <span class="triangle">&#9660;</span>
                  </p>
                </div>
                <div class="caption-content">
                  <figcaption><slot name="caption"></slot></figcaption>
                </div>
              </div>
            ` : ''}
          </figure>
        </div>
    `
  }

  controlCaption() {
    const CONTROLLER_TEXT = this.shadowRoot.querySelector('.show-hide');
    const TRIANGLE = this.shadowRoot.querySelector('.triangle');
    const CAPTION_CONTENT = this.shadowRoot.querySelector('.caption-content');

    if (this._isCaptionOpen) {
      CONTROLLER_TEXT.textContent = 'Show Caption';
      TRIANGLE.innerHTML = '&#9660;';
      CAPTION_CONTENT.style.display = 'none';
      this._isCaptionOpen = false;
    } else {
      CONTROLLER_TEXT.textContent = 'Hide Caption';
      TRIANGLE.innerHTML = '&#9650;';
      CAPTION_CONTENT.style.display = 'block';
      this._isCaptionOpen = true;
    }
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