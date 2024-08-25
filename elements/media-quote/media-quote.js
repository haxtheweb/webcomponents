/**
 * Copyright 2024
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";

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
    this.src = "";
    this.alt = "";

    // Surrounding Elements
    this.quote = "";
    this.author = "";
    this.authorDetail = "";
    this.caption = "";

    // Design
    this.hasFilter = false;

    // Logic
    this._isCaptionOpen = false; // not set by user
    if (this.querySelector) {
      this.hasAuthor =
        this.querySelector('[slot="author"]') &&
        this.querySelector('[slot="author"]').textContent.trim().length > 0;
      this.hasAuthorDetail =
        this.querySelector('[slot="author-detail"]') &&
        this.querySelector('[slot="author-detail"]').textContent.trim().length >
          0;
      this.hasCaption =
        this.querySelector('[slot="caption"]') &&
        this.querySelector('[slot="caption"]').textContent.trim().length > 0;
    }
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
          overflow-y: hidden; /* in case of really long input */
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
          text-align: left;
        }

        .content {
          box-decoration-break: clone;
        }

        .content,
        .citation {
          display: inline;
          padding: var(--ddd-spacing-0) var(--ddd-spacing-2);
          background-color: var(--ddd-theme-primary, var(--ddd-primary-1));
          color: var(
            --lowContrast-override,
            var(--ddd-theme-bgContrast, white)
          );
        }

        .content ::slotted(*) {
          display: inline;
          box-decoration-break: clone;
          -webkit-box-decoration-break: clone;
          padding: var(--ddd-spacing-4);
        }

        .citation {
          margin-top: var(--ddd-spacing-3);
          display: inline-block;
          font-style: italic;
          font-size: 0; /* Prevents a space between author and author detail comma on both sides  */
        }

        .author {
          display: inline;
          font-weight: var(--ddd-font-weight-bold);
        }

        .author,
        .author-detail {
          display: inline;
          font-size: var(--ddd-font-size-xxs);
        }

        .author ::slotted(*) {
          display: inline;
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
          max-width: unset;
          border: var(--ddd-border-lg);
          border-color: var(--ddd-theme-primary, var(--ddd-primary-1));
        }

        figcaption {
          padding: var(--ddd-spacing-4);
          font-size: var(--ddd-font-size-4xs);
          color: light-dark(black, white);
          background-color: light-dark(
            white,
            var(--ddd-theme-default-coalyGray)
          );
        }

        summary {
          font-size: var(--ddd-font-size-4xs);
          padding: 0 var(--ddd-spacing-2);
        }

        p {
          margin: 0;
        }

        @container (max-width: 1261px) and (min-width: 1000px) {
          .text-overlay {
            font-size: var(--ddd-font-size-xs);
          }
          .quote {
            font-size: var(--ddd-font-size-xs);
            line-height: normal;
          }

          .author,
          .author-detail {
            font-size: var(--ddd-font-size-4xs);
          }
        }

        @container (max-width: 999px) {
          /* Mobile devices */
          .quote {
            padding: 0;
          }
          .text-overlay {
            position: relative;
            width: 100%;
            top: 0%;
            left: 0%;
            font-size: var(--ddd-font-size-xs);
          }

          .text-overlay {
            text-align: center;
            padding: 0;
          }

          .author,
          .author-detail {
            font-size: var(--ddd-font-size-xxs);
          }

          figure {
            width: 100%;
          }

          .content {
            box-decoration-break: unset;
            display: block;
          }

          .content,
          .citation {
            padding: var(--ddd-spacing-2) 0;
          }

          .citation {
            width: 100%;
            margin-top: 0;
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
                  <div class="content"><slot name="quote">${this.quote}</slot></div>
                    ${
                      this.hasAuthor
                        ? html`
                            <div class="citation">
                              <div class="author">
                                - <slot name="author">${this.author}</slot>
                              </div>
                              ${this.hasAuthorDetail || this.authorDetail
                                ? html`
                                    <div class="author-detail">
                                      ,
                                      <slot name="author-detail"
                                        >${this.authorDetail}</slot
                                      >
                                    </div>
                                  `
                                : ""}
                            </div>
                          `
                        : ""
                    }
                </p>  
              </div>
              <img src="${this.src}" alt="${this.alt}">
            </div>
            ${
              this.hasCaption
                ? html`
                    <div class="caption">
                      <details>
                        <summary>Show Caption</summary>
                        <figcaption>
                          <slot name="caption">${this.caption}</slot>
                        </figcaption>
                      </details>
                    </div>
                  `
                : ""
            }
          </figure>
        </div>
    `;
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
        attribute: "filter",
      },
      quote: {
        type: String,
      },
      author: {
        type: String,
      },
      authorDetail: {
        type: String,
        attribute: "author-detail",
      },
      caption: {
        type: String,
      },
    };
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
