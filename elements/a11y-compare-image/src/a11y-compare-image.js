import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `a11y-compare-image`
 * Layers images over each other with a slider interface to compare them
 * @demo demo/index.html
 * @element a11y-compare-image
 */
class a11yCompareImage extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: inline-flex;
          margin: 15px 0;
        }
        :host([hidden]) {
          display: none !important;
        }
        figure {
          margin: 0;
        }
        #container,
        #container > div {
          margin: 0;
          padding: 0;
        }
        #container > div {
          position: relative;
        }
        #top {
          top: 0;
          left: 0;
          position: absolute;
          opacity: var(--a11y-compare-image-opacity, 1);
          width: var(--a11y-compare-image-width, 50%);
          overflow: hidden;
        }
        ::slotted([slot="top"]) {
          width: var(--a11y-compare-image-image-width);
        }
        ::slotted([slot="top"]),
        #bottom {
          display: block;
        }
        #bottom {
          width: 100%;
        }
        #slider {
          width: calc(100% + 32px);
          margin: -15px 0 0 -16px;
        }
        ::slotted([slot="bottom"]) {
          max-width: 100%;
        }
      `
    ];
  }
  constructor() {
    super();
    this.opacity = false;
    import("@polymer/iron-image/iron-image.js");
    import("@polymer/paper-slider/paper-slider.js");
  }
  render() {
    return html`
      <figure>
        <figcaption>
          <slot name="heading"></slot>
          <div id="description"><slot name="description"></slot></div>
        </figcaption>
        <div id="container">
          <div>
            <slot id="bottom" name="bottom"></slot>
            <div id="top">
              <slot name="top"></slot>
            </div>
          </div>
        </div>
        <paper-slider id="slider" value="50"></paper-slider>
      </figure>
    `;
  }

  static get tag() {
    return "a11y-compare-image";
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * src for top image
       */
      bottomAlt: {
        type: String,
        attribute: "bottom-alt"
      },
      /**
       * aria-describedby for top image
       */
      bottomDescriptionId: {
        type: String,
        attribute: "bottom-description-id"
      },
      /**
       * src for top image
       */
      bottomSrc: {
        type: String,
        attribute: "bottom-src"
      },
      /**
       * text for button that displays longdesc
       */
      longdescText: {
        type: String,
        attribute: "summary-text"
      },
      /**
       * mode for the slider: wipe
       */
      opacity: {
        type: Boolean
      },
      /**
       * @deprecated Use `slot=heading`
       */
      title: {
        type: String
      },
      /**
       * src for top image
       */
      topAlt: {
        type: String,
        attribute: "top-alt"
      },
      /**
       * aria-describedby for top image
       */
      topDescriptionId: {
        type: String,
        attribute: "top-description-id"
      },
      /**
       * src for top image
       */
      topSrc: {
        type: String,
        attribute: "top-src"
      }
    };
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (["topSrc"].includes(propName)) {
        this._slide();
      }
    });
  }
  firstUpdated() {
    this._slide();
    this.shadowRoot
      .querySelector("#slider")
      .addEventListener("immediate-value-changed", e => {
        this._slide();
      });
  }
  /**
   * updates the slider
   */
  _slide() {
    let top = this.shadowRoot.querySelector("#top"),
      slider = this.shadowRoot.querySelector("#slider");
    if (this.opacity === false) {
      top.style.setProperty(
        "--a11y-compare-image-width",
        slider.immediateValue + "%"
      );
      top.style.setProperty(
        "--a11y-compare-image-image-width",
        10000 / slider.immediateValue + "%"
      );
      top.style.setProperty("--a11y-compare-image-opacity", 1);
    } else {
      top.style.setProperty("--a11y-compare-image-width", "100%");
      top.style.setProperty("--a11y-compare-image-image-width", "100%");
      top.style.setProperty(
        "--a11y-compare-image-opacity",
        slider.immediateValue / 100
      );
    }
  }
}
window.customElements.define(a11yCompareImage.tag, a11yCompareImage);
export { a11yCompareImage };
