/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { SimpleIconsetStore } from "@haxtheweb/simple-icon/lib/simple-iconset.js";
import { LitElement, html, css, svg } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import { IntersectionObserverMixin } from "@haxtheweb/intersection-element/lib/IntersectionObserverMixin.js";
import { LoadingHelper } from "@haxtheweb/replace-tag/lib/LoadingHelper.js";
// lazy image loading part of an element
export const lazyImageLoader = function (SuperClass) {
  return class extends IntersectionObserverMixin(SuperClass) {
    constructor() {
      super();
      this.IOVisibleLimit = 0.1;
      this.IOThresholds = [0.0, 0.1, 0.25, 0.5, 0.75, 1.0];
      this.replacementDelay = 1000;
      this.imageLoaded = false;
      this.loadingImg = "loading:bars";
    }
    /**
     * LitElement life cycle - property changed
     */
    updated(changedProperties) {
      if (super.updated) {
        super.updated(changedProperties);
      }
      changedProperties.forEach((oldValue, propName) => {
        if (propName == "imageLoaded" && !this.imageLoaded && this.shadowRoot) {
          if (this.shadowRoot.querySelector("image")) {
            const loadingImg = SimpleIconsetStore.getIcon(
              this.loadingImg,
              this,
            );
            this.shadowRoot
              .querySelector("image")
              .setAttribute("xlink:href", loadingImg);
          }
        }
        // only allows a max of replacementDelay before just doing it anyway
        if (
          propName == "elementVisible" &&
          this.elementVisible &&
          !this.imageLoaded
        ) {
          clearTimeout(this.__debouce);
          this.__debouce = setTimeout(() => {
            this.imageLoaded = true;
          }, this.replacementDelay);
        }
      });
    }
    _lazyImageLoadComplete() {
      this.imageLoaded = true;
    }
    firstUpdated(changedProperties) {
      if (super.firstUpdated) {
        super.firstUpdated(changedProperties);
      }
      if (this.shadowRoot.querySelector("image")) {
        const loadingImg = SimpleIconsetStore.getIcon(this.loadingImg, this);
        this.shadowRoot
          .querySelector("image")
          .setAttribute("xlink:href", loadingImg);
      }
      // check if it completed ahead of time for really fast connections
      var img = this.shadowRoot.querySelector('img[loading="lazy"]');
      if (img) {
        if (img.complete) {
          this._lazyImageLoadComplete();
        } else {
          img.addEventListener("load", this._lazyImageLoadComplete.bind(this));
          img.addEventListener("error", () => {
            this._lazyImageLoadComplete.bind(this);
          });
        }
      }
    }
    static get styles() {
      let styles = [];
      if (super.styles) {
        styles = super.styles;
      }
      return [
        styles,
        css`
          img[loading="lazy"] {
            width: 100%;
            margin-top: -200px;
            min-height: 200px;
            float: left;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
          }
          :host([image-loaded]) img[loading="lazy"] {
            margin-top: unset;
            float: unset;
            opacity: 1;
          }
        `,
      ];
    }
    static get properties() {
      return {
        ...super.properties,
        imageLoaded: {
          type: Boolean,
          reflect: true,
          attribute: "image-loaded",
        },
      };
    }
    renderSVGLoader() {
      return html`${!this.imageLoaded
        ? svg`
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="max-height:400px;width:100%;margin:auto;background:#f1f2f3;display:block;z-index:1;position:relative" preserveAspectRatio="xMidYMid" viewBox="0 0 300 200">
      <image
        xlink:href=""
        focusable="false"
        preserveAspectRatio="xMidYMid meet"
      ></image>
      </svg>`
        : ``}`;
    }
  };
};

/**
 * `lazy-image-helpers`
 * `helpers for building lazy loading images`
 *
 * @microcopy - language worth noting:
 * @demo demo/index.html
 * @element lazy-image-helpers
 */
class lazyImage extends LoadingHelper(lazyImageLoader(LitElement)) {
  static get tag() {
    return "lazy-image";
  }
  static get properties() {
    return {
      ...super.properties,
      src: {
        type: String,
        reflect: true,
      },
      /**
       * Alt text for image.
       */
      alt: {
        type: String,
        reflect: true,
      },
      /**
       * Aria-describedby data passed down to appropriate tag
       */
      describedBy: {
        type: String,
        attribute: "described-by",
      },
    };
  }
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
        .image-wrap {
          min-height: 250px;
          max-height: 400px;
          overflow: hidden;
        }
      `,
    ];
  }
  render() {
    return html`<div class="image-wrap">
      ${this.renderSVGLoader()}
      <img
        src="${this.src}"
        alt="${this.alt}"
        aria-describedby="${this.describedBy || ""}"
        loading="lazy"
      />
    </div>`;
  }
}
customElements.define(lazyImage.tag, lazyImage);
export { lazyImage };
