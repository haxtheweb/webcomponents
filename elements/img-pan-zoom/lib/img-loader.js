import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
/*
`img-loader` preloads images

all `img-loader` code comes from <a href="https://github.com/PolymerElements/iron-image/blob/master/iron-image.html">iron image</a>
*/
class ImgLoader extends PolymerElement {
  static get template() {
    return html`
      <img id="img" hidden="" src="[[src]]" />
    `;
  }

  static get tag() {
    return "img-loader";
  }

  static get properties() {
    return {
      src: {
        observer: "_srcChanged",
        type: String
      },
      /**
       * Read-only value that is true when the image is loaded.
       */
      loaded: {
        notify: true,
        readOnly: true,
        type: Boolean,
        value: false
      },
      /**
       * Read-only value that tracks the loading state of the image when the `preload`
       * option is used.
       */
      loading: {
        notify: true,
        readOnly: true,
        type: Boolean,
        value: false
      },
      /**
       * Read-only value that indicates that the last set `src` failed to load.
       */
      error: {
        notify: true,
        readOnly: true,
        type: Boolean,
        value: false
      }
    };
  }

  ready() {
    super.ready();

    var img = this.shadowRoot.querySelector("#img");

    img.onload = function() {
      if (
        this.shadowRoot.querySelector("#img").src !== this._resolveSrc(this.src)
      )
        return;
      this._setLoading(false);
      this._setLoaded(true);
      this._setError(false);
    }.bind(this);

    img.onerror = function() {
      if (
        this.shadowRoot.querySelector("#img").src !== this._resolveSrc(this.src)
      )
        return;
      this._reset();
      this._setLoading(false);
      this._setLoaded(false);
      this._setError(true);
    }.bind(this);

    this._resolvedSrc = "";
  }

  _srcChanged(newSrc, oldSrc) {
    var newResolvedSrc = this._resolveSrc(newSrc);
    if (newResolvedSrc === this._resolvedSrc) return;
    this._resolvedSrc = newResolvedSrc;
    this._reset();
    this._load(newSrc);
  }

  _load(src) {
    if (src) {
      this.shadowRoot.querySelector("#img").src = src;
    } else {
      this.shadowRoot.querySelector("#img").removeAttribute("src");
    }
    this._setLoading(!!src);
    this._setLoaded(false);
    this._setError(false);
  }

  _reset() {
    this.shadowRoot.querySelector("#img").removeAttribute("src");
    this._setLoading(false);
    this._setLoaded(false);
    this._setError(false);
  }

  _resolveSrc(testSrc) {
    var baseURI = /** @type {string} */ (this.ownerDocument.baseURI);
    return new URL(this.resolveUrl(testSrc, baseURI), baseURI).href;
  }
}
window.customElements.define(ImgLoader.tag, ImgLoader);
export { ImgLoader };
