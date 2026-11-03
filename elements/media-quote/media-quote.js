/**
 * Copyright 2024
 * @license Apache-2.0, see License.md for full text.
 */
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { html, css, nothing } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";

/**
 * `media-quote`
 * `A quote focused around a piece of media with citation and optional caption`
 * @demo demo/index.html
 * @element media-quote
 */
class MediaQuote extends I18NMixin(DDD) {
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
    this.t = this.t || {};
    this.t = {
      ...this.t,
      showCaption: "Show Caption",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });

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
    this.hasAuthor = false;
    this.hasAuthorDetail = false;
    this.hasCaption = false;
    if (this.querySelector) {
      const author = this.querySelector('[slot="author"]');
      const authorDetail = this.querySelector('[slot="author-detail"]');
      const caption = this.querySelector('[slot="caption"]');
      // coerce to booleans so consumers get false (not null) when the slot
      // is absent; these flags are combined with the matching properties at
      // render time so either authoring path displays the content
      this.hasAuthor = !!(author && author.textContent.trim().length > 0);
      this.hasAuthorDetail = !!(
        authorDetail && authorDetail.textContent.trim().length > 0
      );
      this.hasCaption = !!(caption && caption.textContent.trim().length > 0);
    }
  }

  static get styles() {
    return [
      super.styles,
      css`
        /* https://haxtheweb.org/documentation/ddd */
        :host {
          display: block;
          container-type: inline-size;
          /* thin rule beside the quote: accent-color when picked, then the
             DDD accent, then the link blue. grey is the inherited default
             accent-color so it is treated as unset */
          --media-quote-rule-color: var(
            --ddd-theme-accent,
            light-dark(
              var(--ddd-theme-default-link),
              var(--ddd-theme-default-linkLight)
            )
          );
        }
        :host([accent-color]:not([accent-color="grey"])) {
          --media-quote-rule-color: var(--simple-colors-default-theme-accent-7);
        }

        .media-quote-container {
          font-family: var(--ddd-font-primary);
        }

        figure {
          margin: var(--ddd-spacing-0);
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          border-radius: var(--ddd-radius-md);
          overflow: hidden;
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }

        /* image on the start side, quote beside it */
        .top-content {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
        }
        .top-content.has-image {
          grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
        }

        img {
          display: block;
          grid-row: 1;
          grid-column: 1;
          width: 100%;
          height: 100%;
          min-height: var(--ddd-spacing-30);
          object-fit: cover;
        }

        .text-overlay {
          grid-row: 1;
          grid-column: -2;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: var(--ddd-spacing-3);
          padding: var(--ddd-spacing-4) var(--ddd-spacing-5);
          box-shadow: inset var(--ddd-spacing-1) 0 0
            var(--media-quote-rule-color);
        }
        :host(:dir(rtl)) .text-overlay {
          box-shadow: inset calc(-1 * var(--ddd-spacing-1)) 0 0
            var(--media-quote-rule-color);
        }

        .content {
          margin: var(--ddd-spacing-0);
          font-family: var(--ddd-font-secondary);
          font-style: italic;
          font-weight: var(--ddd-font-weight-regular);
          font-size: var(--ddd-font-size-xxs);
          line-height: var(--ddd-lh-140);
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
        }
        .content ::slotted(*) {
          margin: var(--ddd-spacing-0);
        }

        .citation {
          font-size: var(--ddd-font-size-5xs);
          line-height: var(--ddd-lh-150);
        }

        .author {
          display: inline;
          font-weight: var(--ddd-font-weight-bold);
        }

        .author-detail {
          display: inline;
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }

        .author ::slotted(*),
        .author-detail ::slotted(*) {
          display: inline;
        }

        .caption {
          border-top: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
        }

        details {
          width: 100%;
          max-width: unset;
        }

        summary {
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-5xs);
          font-weight: var(--ddd-font-weight-medium);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
          cursor: pointer;
        }
        summary:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: calc(-1 * var(--ddd-focus-offset));
        }

        figcaption {
          padding: var(--ddd-spacing-0) var(--ddd-spacing-4)
            var(--ddd-spacing-3);
          font-size: var(--ddd-font-size-5xs);
          line-height: var(--ddd-lh-150);
        }

        p {
          margin: 0;
        }

        @container (max-width: 560px) {
          .top-content.has-image {
            grid-template-columns: minmax(0, 1fr);
          }
          img {
            max-height: var(--ddd-spacing-30);
            min-height: unset;
          }
          .text-overlay {
            grid-row: 2;
            grid-column: 1;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="media-quote-container">
        <figure>
          <div class="top-content ${this.src ? "has-image" : ""}">
            <div class="text-overlay">
              <div class="quote">
                <blockquote class="content">
                  <slot name="quote">${this.quote}</slot>
                </blockquote>
              </div>
              ${this.hasAuthor || this.author
                ? html`
                    <div class="citation">
                      <span class="author"
                        ><slot name="author">${this.author}</slot></span
                      >${this.hasAuthorDetail || this.authorDetail
                        ? html`<span class="author-detail"
                            ><span aria-hidden="true"> · </span
                            ><slot name="author-detail"
                              >${this.authorDetail}</slot
                            ></span
                          >`
                        : ""}
                    </div>
                  `
                : ""}
            </div>
            ${this.src
              ? html`<img src="${this.src}" alt="${this.alt}" />`
              : nothing}
          </div>
          ${this.hasCaption || this.caption
            ? html`
                <div class="caption">
                  <details>
                    <summary>${this.t.showCaption}</summary>
                    <figcaption>
                      <slot name="caption">${this.caption}</slot>
                    </figcaption>
                  </details>
                </div>
              `
            : ""}
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
        reflect: true,
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
        reflect: true,
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
