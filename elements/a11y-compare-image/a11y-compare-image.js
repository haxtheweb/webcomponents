import { LitElement, html, css } from "lit";
import "@lrnwebcomponents/simple-range-input/simple-range-input.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * `a11y-compare-image`
 * Layers images over each other with a slider interface to compare them
 * @demo demo/index.html
 * @element a11y-compare-image
 */
class a11yCompareImage extends SimpleColors {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: inline-flex;
          margin: 15px 0;
          --simple-range-input-track-height: 4px;
          --simple-range-input-pin-height: 20px;
          --simple-range-offet: calc(
            var(--simple-range-input-pin-height, 20px) / 2
          );
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
          top: calc(0px - var(--simple-range-offet, 10px));
          left: 0;
          position: absolute;
          width: 100%;
          margin: 0;
        }
        .marker {
          top: calc(0px - var(--simple-range-input-pin-height, 20px) / 2);
          position: absolute;
          width: 1px;
          outline: 1px solid
            var(
              --simple-range-input-bg,
              var(--simple-colors-default-theme-accent-2, grey)
            );
          background-color: var(
            --simple-range-input-color,
            var(--simple-colors-default-theme-accent-8, grey)
          );
          padding-top: var(--simple-range-input-pin-height, 20px);
        }
        ::slotted([slot="bottom"]) {
          max-width: 100%;
        }
      `,
    ];
  }
  constructor() {
    super();
    this.opacity = false;
    this.position = 50;
    this.accentColor = "blue";
    this.__markers = [];
    this._slide();
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
            (marker) =>
              html`
                <div
                  class="marker"
                  style="left: ${marker}%;"
                  ?hidden="${marker == 100}"
                ></div>
              `
          )}
          <simple-range-input
            accent-color="${this.accentColor}"
            ?dark="${this.dark}"
            id="slider"
            @immediate-value-changed="${this._valueChanged}"
            .value="${this.position}"
          ></simple-range-input>
        </div>
      </figure>
    `;
  }
  _valueChanged(e) {
    this.position = e.detail.value;
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
        reflect: true,
      },
      /**
       * mode for the slider: wipe
       */
      opacity: {
        type: Boolean,
      },
      position: {
        type: Number,
        attribute: "position",
        reflect: true,
      },
      __lower: {
        type: String,
      },
      __upper: {
        type: String,
      },
      __markers: {
        type: Array,
      },
    };
  }
  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "position" && this.position !== oldValue) {
        this._slide();
      }
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
    // Index of the upper image
    let active = Math.floor(this.position / section) || 0;
    // This is the layer number that is current on top.
    this.activeLayer = active + 1;
    // This is the slider percent when upper image is at 0.
    let lastSection = section * active;
    // How far we are into the current section.
    let relativePosition = this.position - lastSection;
    /* Percentage into the current section
    if (this.position === 100 && relativePosition === 0) {
    } else {
      this.position = (relativePosition * 100) / section || 0;
    }*/
    // Set background images
    this.__upper = layers[active + 1]
      ? layers[active + 1].src
      : layers[active]
      ? layers[active].src
      : "";
    this.__lower = layers[active] ? layers[active].src : "";
    // Adding Fake markers behind the slider.
    if (total - 1 != this.__markers.length) {
      this._updateMarkers(total);
    }
    if (container && this.opacity === false) {
      container.style.setProperty(
        "--a11y-compare-image-width",
        this.position + "%"
      );
      container.style.setProperty("--a11y-compare-image-opacity", 1);
    } else if (container) {
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
      for (let i = step; i <= 100; i += step) {
        this.__markers.push(i);
      }
    }
  }
}
window.customElements.define(a11yCompareImage.tag, a11yCompareImage);
export { a11yCompareImage };
