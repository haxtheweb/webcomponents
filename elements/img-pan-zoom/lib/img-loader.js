import { LitElement, html } from "lit";
/*
`img-loader` preloads images
*/
class ImgLoader extends LitElement {
  /**
   * LitElement render
   */
  render() {
    return html``;
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
        type: String,
      },
      /**
       * Read-only value that is true when the image is loaded.
       */
      loaded: {
        type: Boolean,
      },
      /**
       * Read-only value that tracks the loading state of the image when the `preload`
       * option is used.
       */
      loading: {
        type: Boolean,
      },
      /**
       * aria-describedby attribute
       */
      describedBy: {
        type: String,
        attribute: "described-by",
      },
      /**
       * Read-only value that indicates that the last set `src` failed to load.
       */
      error: {
        type: Boolean,
      },
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
      if (propName == "src") this._loadPageSrc();
      if (["error", "loaded", "loading"].includes(propName)) {
        // notify
        this.dispatchEvent(
          new CustomEvent(`${propName}-changed`, {
            detail: {
              value: this[propName],
            },
          }),
        );
      }
    });
  }
  _loadPageSrc() {
    if (this.__imageLoader) this.__imageLoader.remove();
    if (this.src) {
      this.__imageLoader = new Image();
      this.__imageLoader.onload = () => {
        this.loading = false;
        this.loaded = true;
        if (this.__imageLoader) this.__imageLoader.remove();
      };
      this.__imageLoader.onerror = () => {
        this.loading = false;
        this.loaded = false;
        if (this.__imageLoader) this.__imageLoader.remove();
      };
      this.__imageLoader.src = this.src;
    }
    this.loading = !!this.src;
    this.loaded = false;
  }
}
customElements.define(ImgLoader.tag, ImgLoader);
export { ImgLoader };
