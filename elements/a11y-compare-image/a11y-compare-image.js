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
        #container,
        #input {
          position: relative;
        }
        /* Added background-size: cover to adjust the bottom layer to match top in first example */
        #container {
          background-size: cover;
          background-repeat: no-repeat;
        }

        #layer {
          top: 0;
          left: 0;
          position: absolute;
          height: 100%;
          opacity: var(--a11y-compare-image-opacity, 1);
          width: var(--a11y-compare-image-width, 50%);
          background-size: cover;
          background-position-x: 0%;
          background-repeat: no-repeat;
        }
        #placeholder {
          opacity: 0;
        }
        
        #bottom {
          width: 100%;
        }
        #slider {
          top: 0;
          left: 0;
          padding-top: 10px;
          position: absolute;
          width: calc(100% + 32px);
          margin: -15px 0 0 -16px;
        }
        .marker {
          top: 6px;
          position: absolute;
          width: 1px;
          outline: 2px solid #bbb;
          background-color: #bbb;
          padding-top: 10px;
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
    this.position = 0;
    this.__markers = [];
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
        <div id="container" style="background-image: url(${this.__lower})">
          <div>
            <div id="placeholder">
              <slot id="bottom" name="bottom"></slot>
            </div>
            <slot name="top" hidden></slot>
            <div
              id="layer"
              style="background-image: url(${this.__upper})"
            ></div>
            <slot></slot>
          </div>
        </div>
        <div id="input">
          ${this.__markers.map(
            marker =>
              html`
                <div class="marker" style="left: ${marker}%;"></div>
              `
          )}
          <paper-slider id="slider" value="0"></paper-slider>
        </div>
      </figure>
    `;
  }

  static get tag() {
    return "a11y-compare-image";
  }
  static get properties() {
    return {
      ...super.properties,
      activeLayer: {
        type: Number,
        attribute: "active-layer",
        reflect: true
      },
      /**
       * mode for the slider: wipe
       */
      opacity: {
        type: Boolean
      },
      position: {
        type: Number,
        attribute: "position",
        reflect: true
      },
      __lower: {
        type: String
      },
      __upper: {
        type: String
      },
      __markers: {
        type: Array
      }
    };
  }
  firstUpdated() {
    let slider = this.shadowRoot.querySelector("#slider");
    slider.value = this.position || 0;
    this._slide();
    slider.addEventListener("immediate-value-changed", e => {
      this._slide();
    });
  }
  /**
   * updates the slider
   */
  _slide() {
    let container = this.shadowRoot.querySelector("#container");
    let layers = this.querySelectorAll("[slot=top],[slot=bottom]");
    // This is the total number of transitions between layers
    let total = layers.length - 1;
    //This is percent of the slider for each section
    let section = 100 / total;
    let slider = this.shadowRoot.querySelector("#slider");
    // Index of the upper image
    let active = Math.floor(slider.immediateValue / section) || 0;
    // This is the layer number that is current on top.
    this.activeLayer = active + 1;
    // This is the slider percent when upper image is at 0.
    let lastSection = section * active;
    // How far we are into the current section.
    let relativePosition = slider.immediateValue - lastSection;
    // Percentage into the current section
    this.position = (relativePosition * 100) / section || 0;
    // Set background images
    this.__upper = layers[active + 1].src || layers[active].src;
    this.__lower = layers[active].src;
    // Adding Fake markers behind the slider.
    if (total - 1 != this.__markers.length) {
      this._updateMarkers(total);
    }
    if (this.opacity === false) {
      container.style.setProperty(
        "--a11y-compare-image-width",
        this.position + "%"
      );
      container.style.setProperty("--a11y-compare-image-opacity", 1);
    } else {
      container.style.setProperty("--a11y-compare-image-width", "100%");
      container.style.setProperty(
        "--a11y-compare-image-opacity",
        this.position / 100
      );
    }
  }
  _updateMarkers(total) {
    this.__markers = [];
    if (total != 0) {
      let step = 100 / total;
      for (let i = step; i < 100; i += step) {
        this.__markers.push(i);
      }
    }
  }
}
window.customElements.define(a11yCompareImage.tag, a11yCompareImage);
export { a11yCompareImage };
