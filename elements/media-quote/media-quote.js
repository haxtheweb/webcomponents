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
    this.filter = false;

    // Logic
    this.captionOpen = false; // not set by user
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
            top: 10%;
            left: 15%
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
            z-index: 1;
          }

          .closed, .opened {
            border: var(--ddd-border-lg);
            border-color: var(--ddd-theme-primary, var(--ddd-primary-1));
          }

          .closed:hover .controller-text, 
          .opened:hover .controller-text, 
          .closed:focus .controller-text, 
          .opened:focus .controller-text {
            text-decoration: underline;
          }

          .controller:hover {
            cursor: pointer;
          }

          .controller {
            background-color: var(--ddd-theme-primary, var(--ddd-primary-1));
            color: var(--lowContrast-override, var(--ddd-theme-bgContrast));
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--ddd-spacing-0) var(--ddd-spacing-2);
          }

          .caption-content {
            display: none;
          }

          figcaption {
            color: var(--ddd-theme-default-potentialMidnight); /* TODO needs to contrast background color in dark mode */
            width: 100%;
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

          @container media-quote (max-width: 999px) {
            .quote {
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
      `,];
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
            </div>
            <img src="${this.src}" alt="${this.alt}">
            ${this.querySelector('[slot="caption"]') && this.querySelector('[slot="caption"]').textContent.trim().length > 0 ? html`
              <div class="closed">
                <div class='controller' @click=${this.controlCaption}>
                  <p class="controller-text">Show Caption</p>
                  <p class="triangle">&#9660;</p>
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
    const controllerText = this.shadowRoot.querySelector('.controller-text');
    const triangle = this.shadowRoot.querySelector('.triangle');
    const captionContent = this.shadowRoot.querySelector('.caption-content');

    if (this.captionOpen) {
      controllerText.textContent = 'Show Caption';
      triangle.innerHTML = '&#9660;';
      captionContent.style.display = 'none';
      this.captionOpen = false;
    } else {
      controllerText.textContent = 'Hide Caption';
      triangle.innerHTML = '&#9650;';
      captionContent.style.display = 'block';
      this.captionOpen = true;
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
      filter: {
        type: Boolean,
      },
      captionOpen: {
        type: Boolean,
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