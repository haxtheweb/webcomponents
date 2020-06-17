import { LitElement, html } from "lit-element/lit-element.js";
/*
`img-loader` preloads images
*/
class ImgLoader extends LitElement {
  /**
   * LitElement render
   */
  render() {
    return html`
      <img loading="lazy" id="img" hidden="" src="${this.src}" aria-describedby="${this.describedBy || ''}" />
    `;
  }
  /**
   * convention
   */
  static get tag() {
    return "img-loader";
  }
  /**
   * LitElement / popular convention
   */
  static get properties() {
    return {
      src: {
        type: String
      },
      /**
       * Read-only value that is true when the image is loaded.
       */
      loaded: {
        type: Boolean
      },
      /**
       * Read-only value that tracks the loading state of the image when the `preload`
       * option is used.
       */
      loading: {
        type: Boolean
      },
      /**
       * aria-describedby attribute
       */
      describedBy: {
        type: String,
        attribute: "described-by"
      },
      /**
       * Read-only value that indicates that the last set `src` failed to load.
       */
      error: {
        type: Boolean
      }
    };
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.loaded = false;
    this.error = false;
    this.loading = false;
  }
  /**
   * LitElement properties changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "src") {
        this._srcChanged(this[propName], oldValue);
      }
      if (["error", "loaded", "loading"].includes(propName)) {
        // notify
        this.dispatchEvent(
          new CustomEvent(`${propName}-changed`, {
            detail: {
              value: this[propName]
            }
          })
        );
      }
    });
  }
  /**
   * LitElement ready
   */
  firstUpdated() {
    var img = this.shadowRoot.querySelector("#img");
    img.onload = () => {
      this.loading = false;
      this.loaded = true;
      this.error = false;
    };
    img.onerror = () => {
      this._reset();
      this.loading = false;
      this.loaded = false;
      this.error = true;
    };
    this._resolvedSrc = "";
  }

  _srcChanged(newSrc, oldSrc) {
    this._resolvedSrc = newSrc;
    this._reset();
    this._load(newSrc);
  }

  _load(src) {
    if (src) {
      this.shadowRoot.querySelector("#img").src = src;
    } else {
      this.shadowRoot.querySelector("#img").removeAttribute("src");
    }
    this.loading = !!src;
    this.loaded = false;
    this.error = false;
  }

  _reset() {
    this.shadowRoot.querySelector("#img").removeAttribute("src");
    this.loading = false;
    this.loaded = false;
    this.error = false;
  }
}
window.customElements.define(ImgLoader.tag, ImgLoader);
export { ImgLoader };
