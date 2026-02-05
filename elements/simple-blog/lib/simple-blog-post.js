import { html, css } from "lit";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
/**
 * @deprecatedApply - required for @apply / invoking @apply css var convention
 */
import "@polymer/polymer/lib/elements/custom-style.js";
/**
 * `simple-blog-post`
 * @element simple-blog-post
 * `A simple blog and associated elements`
 */
class SimpleBlogPost extends SimpleColors {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          min-height: 80vh;
        }
        main {
          transition:
            opacity 0.2s ease-in-out,
            visibility 0.2s ease-in-out;
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          opacity: 1;
          visibility: visible;
        }
        @media only screen and (max-width: 900px) {
          main {
            padding: 0 32px;
          }
        }
        section {
          width: 100%;
          font-family: var(--ddd-font-body);
          color: light-dark(#333, var(--ddd-accent-6, #f5f5f5));
        }
        section ::slotted(*) {
          font-weight: var(--ddd-font-weight-regular);
          font-style: normal;
          font-size: var(--ddd-font-size-xs);
          line-height: 1.5;
          margin: 0;
          padding-bottom: var(--ddd-spacing-6);
          color: light-dark(#333, var(--ddd-accent-6, #f5f5f5));
          -webkit-hyphens: auto;
          -moz-hyphens: auto;
          hyphens: auto;
        }
        :host([has-image]) .article-image {
          position: absolute;
          background-color: var(--haxcms-color, black);
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
        }
        .post-image-image {
          background-size: cover;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          text-indent: -9999px;
          padding-top: 33%;
          z-index: 1;
        }
        .post-meta {
          font-family: var(--ddd-font-primary);
        }
        :host([has-image]) .post-meta {
          position: absolute;
          bottom: 80px;
          left: 30%;
          right: 30%;
          padding-top: 60px;
          z-index: 9;
          font-family:
            Open Sans,
            MundoSans,
            "Helvetica Neue",
            Arial,
            Helvetica,
            sans-serif;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
        }
        /**
         * Hide the slotted content during edit mode
         */
        :host([edit-mode]) #slot {
          display: none;
        }
      `,
    ];
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "simple-blog-post";
  }
  // render function
  render() {
    return html`
      <custom-style>
        <style>
          site-active-title {
            font-weight: var(--ddd-font-weight-bold);
            font-style: normal;
            letter-spacing: -0.04em;
            font-size: var(--ddd-font-size-xl);
            line-height: 1.1;
            color: light-dark(black, var(--ddd-accent-6, #f5f5f5));
          }
          :host([has-image]) site-active-title {
            font-weight: var(--ddd-font-weight-bold);
            font-style: normal;
            letter-spacing: -0.04em;
            font-size: var(--ddd-font-size-xl);
            line-height: 1.1;
            margin-bottom: var(--ddd-spacing-4);
            text-shadow:
              0 1px 16px rgba(0, 0, 0, 0.5),
              0 0 1px rgba(0, 0, 0, 0.5);
            color: light-dark(white, var(--ddd-accent-6, #f5f5f5));
          }
        </style>
      </custom-style>
      <main>
        <article>
          <div class="article-image">
            ${this.hasImage
              ? html`
                  <div
                    id="image"
                    class="post-image-image"
                    style='background-image: url("${this.image}");'
                  ></div>
                `
              : ``}
            <div class="post-meta">
              <site-active-title></site-active-title>
            </div>
          </div>
          <section id="contentcontainer">
            <div id="slot"><slot></slot></div>
          </section>
        </article>
      </main>
    `;
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "hasImage") {
        this._hasImageChanged(this[propName], oldValue);
      }
    });
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * calculate if we have a header image.
       */
      hasImage: {
        type: Boolean,
        reflect: true,
        attribute: "has-image",
      },
      /**
       * editting state for the page
       */
      editMode: {
        type: Boolean,
        reflect: true,
        attribute: "edit-mode",
      },
      image: {
        type: String,
      },
    };
  }

  /**
   * Ready life cycle
   */
  constructor() {
    super();
    this.windowControllers = new AbortController();
    this.editMode = false;
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js"
    );
  }
  connectedCallback() {
    super.connectedCallback();
    this.__disposer = [];
    setTimeout(() => {
      globalThis.addEventListener("scroll", this._scrollListener.bind(this), {
        signal: this.windowControllers.signal,
      });
      autorun((reaction) => {
        const fields = toJS(store.activeItemFields);
        this.hasImage = this._computeHasImage(fields);
        if (this.hasImage) {
          this.image = fields.images[0].src;
        }
        this.__disposer.push(reaction);
      });
    }, 0);
  }
  /**
   * Detatched life cycle
   */
  disconnectedCallback() {
    this.windowControllers.abort();
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    super.disconnectedCallback();
  }

  /**
   * Scroll event listener to do image effects.
   */
  _scrollListener(e) {
    if (this.hasImage) {
      let top =
        (globalThis.pageYOffset || globalThis.document.scrollTop) -
        (globalThis.document.clientTop || 0);
      if (top < 0 || top > 1500) {
        return;
      }
      this.shadowRoot.querySelector("#image").style.transform =
        "translate3d(0px, " + top / 3 + "px, 0px)";
      this.shadowRoot.querySelector("#image").style.opacity =
        1 - Math.max(top / 700, 0);
    }
  }

  /**
   * image has changed, ensure we set padding appropriately.
   */
  _hasImageChanged(newValue, oldValue) {
    if (newValue) {
      setTimeout(() => {
        let rect = this.shadowRoot
          .querySelector("#image")
          .getBoundingClientRect();
        this.shadowRoot.querySelector("#contentcontainer").style.paddingTop =
          rect.height + "px";
      }, 0);
    } else {
      this.shadowRoot.querySelector("#contentcontainer").style.paddingTop =
        null;
    }
  }

  /**
   * see if there's an image in the metadata blob.
   */
  _computeHasImage(fields) {
    if (
      fields &&
      typeof fields.images !== typeof undefined &&
      typeof fields.images[0] !== typeof undefined &&
      typeof fields.images[0].src !== typeof undefined
    ) {
      return true;
    }
    return false;
  }
}
globalThis.customElements.define(SimpleBlogPost.tag, SimpleBlogPost);
export { SimpleBlogPost };
