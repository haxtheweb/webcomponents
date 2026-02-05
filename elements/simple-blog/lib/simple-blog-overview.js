import { html, css } from "lit";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
/**
 * `simple-blog-overview`
 * @element simple-blog-overview
 * `Overview / preview of the text of the post with title`
 *
 *  @microcopy - the mental model for this element
 *  - this is one post in a listing of many most likely
 *  - a posting has only text preview
 *
 */
class SimpleBlogOverview extends SimpleColors {
  /**
   * LitElement render style
   */
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          outline: none;
          text-transform: none;
        }
        div.card {
          box-shadow: var(--ddd-boxShadow-sm, 0 2px 6px rgba(0, 0, 0, 0.15));
          padding: 32px 16px;
          margin: 0;
          min-width: unset;
          width: 100%;
          background-color: light-dark(#ffffff, var(--ddd-primary-4, #222));
          border-radius: var(--ddd-radius-md, 4px);
          transition:
            box-shadow 0.2s ease-in-out,
            transform 0.2s ease-in-out;
        }
        .post-title {
          letter-spacing: -0.04em;
          font-weight: var(--ddd-font-weight-bold);
          font-style: normal;
          display: block;
          font-size: var(--ddd-font-size-md);
          line-height: 1.2;
          margin: 0 0 var(--ddd-spacing-2);
          font-family: var(--ddd-font-primary);
        }
        .post-title a {
          text-decoration: none;
          color: light-dark(#333332, var(--ddd-accent-6, #f5f5f5));
        }
        .post-excerpt,
        simple-datetime {
          letter-spacing: -0.02em;
          font-weight: var(--ddd-font-weight-light);
          font-style: normal;
          font-size: var(--ddd-font-size-xs);
          line-height: 1.4;
          color: light-dark(
            var(--simple-colors-default-theme-grey-10),
            var(--ddd-accent-6, #e0e0e0)
          );
          font-family: var(--ddd-font-body);
        }
        .post-excerpt p {
          text-transform: none;
        }
        :host([elevation="2"]) div.card {
          box-shadow: var(--ddd-boxShadow-md, 0 8px 20px rgba(0, 0, 0, 0.25));
          transform: translateY(-2px);
        }
        .post-meta {
          font-size: var(--ddd-font-size-2xs);
          color: light-dark(#b3b3b1, var(--ddd-accent-6, #cccccc));
          line-height: 1.6;
          margin-top: var(--ddd-spacing-2);
        }
        a,
        a:visited,
        a:hover,
        a:focus,
        a:active {
          color: inherit;
        }
      `,
    ];
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "simple-blog-overview";
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.elevation = 0;
    import("@haxtheweb/simple-datetime/simple-datetime.js");
    setTimeout(() => {
      this.addEventListener("mousedown", this.tapEventOn.bind(this));
      this.addEventListener("mouseover", this.tapEventOn.bind(this));
      this.addEventListener("mouseout", this.tapEventOff.bind(this));
      this.addEventListener("focusin", this.tapEventOn.bind(this));
      this.addEventListener("focusout", this.tapEventOff.bind(this));
    }, 0);
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <a href="${this.link}" itemprop="url" title="${this.title}">
        <div class="card">
          <article
            class="post"
            itemtype="http://schema.org/BlogPosting"
            role="article"
          >
            <div class="article-item">
              <header class="post-header">
                <h3 class="post-title" itemprop="name">${this.title}</h3>
              </header>
              <section class="post-excerpt" itemprop="description">
                <p>${this.description}</p>
              </section>
              <div class="post-meta">
                <simple-datetime
                  format="M jS, Y"
                  timestamp="${this.changed}"
                  unix=""
                ></simple-datetime>
              </div>
            </div>
          </article>
        </div>
      </a>
    `;
  }
  /**
   * LitElement / popular convention
   */
  static get properties() {
    return {
      ...super.properties,
      /**
       * ID of this item, this is used for selection UX when back button hit, leave this here
       */
      itemId: {
        type: String,
        reflect: true,
        attribute: "item-id",
      },
      /**
       * Title
       */
      title: {
        type: String,
      },
      /**
       * Body of text
       */
      body: {
        type: String,
      },
      /**
       * Link referencing the page content.
       */
      link: {
        type: String,
      },
      /**
       * timestamp (unix) of last time changed
       */
      changed: {
        type: Number,
      },
      /**
       * elevation
       */
      elevation: {
        type: Number,
        reflect: true,
      },
    };
  }
  /**
   * special handling for taps on the thing
   */
  tapEventOn(e) {
    this.elevation = 2;
  }
  /**
   * Hover off stop showing the deeper shadow.
   */
  tapEventOff(e) {
    this.elevation = 0;
  }
}

globalThis.customElements.define(SimpleBlogOverview.tag, SimpleBlogOverview);
export { SimpleBlogOverview };
