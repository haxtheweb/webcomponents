/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { DDDAnimations } from "@haxtheweb/d-d-d/lib/DDDStyles.js";
import { DDDBlockStyles } from "@haxtheweb/d-d-d/lib/DDDBlock.js";

/**
 * `a11y-compare-image`
 * Layers images over each other with a slider interface to compare them.
 * One native range input drives everything: in wipe mode it covers the
 * image (drag the handle, click anywhere, touch or keyboard), in opacity
 * mode it sits in the bottom bar between the two image names.
 * Colours come from DDD. `dark` inverts the slider controls.
 * @demo demo/index.html
 * @element a11y-compare-image
 */
class a11yCompareImage extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      DDDAnimations,
      DDDBlockStyles,
      css`
        :host {
          display: block;
          color-scheme: light dark;
          font-family: var(--ddd-font-primary);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }
        /* slider controls (handle and fade range): a fill and an ink
           colour that follow the page colour scheme; the dark attribute
           inverts only these, as it always inverted the slider bar */
        :host {
          --a11y-compare-image-control-fill: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          --a11y-compare-image-control-ink: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
        }
        :host([dark]) {
          --a11y-compare-image-control-fill: light-dark(
            var(--ddd-theme-default-potentialMidnight),
            var(--ddd-theme-default-white)
          );
          --a11y-compare-image-control-ink: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-nittanyNavy)
          );
          /* inverted, the ink can match the page (navy on midnight), so
             the filled part of the fade track takes the fill colour */
          --a11y-compare-image-control-progress: var(
            --a11y-compare-image-control-fill
          );
        }
        :host([hidden]) {
          display: none !important;
        }
        figure {
          margin: 0;
          padding: 0;
        }
        figcaption ::slotted(*) {
          margin-block: 0 var(--ddd-spacing-2);
        }
        .stage {
          position: relative;
          box-sizing: border-box;
          width: min(
            100%,
            var(--a11y-compare-image-max-width, 100%),
            calc(
              var(--a11y-compare-image-max-height, 100000px) *
                var(--a11y-compare-image-ratio, 1.7778)
            )
          );
          aspect-ratio: var(--a11y-compare-image-ratio, 1.7778);
          margin-inline: auto;
          border-radius: var(--a11y-compare-image-stage-radius, 0);
          overflow: hidden;
          touch-action: pan-y;
        }
        .stage-wrap {
          padding: var(--a11y-compare-image-stage-padding, 0);
        }
        #container,
        #wipe,
        #placeholder,
        #layer {
          position: absolute;
          inset: 0;
          margin: 0;
          padding: 0;
        }
        #container,
        #layer {
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
        #layer {
          opacity: var(--a11y-compare-image-opacity, 1);
          clip-path: inset(
            0 calc(100% - var(--a11y-compare-image-width, 50%)) 0 0
          );
        }
        :host(:dir(rtl)) #layer {
          clip-path: inset(
            0 0 0 calc(100% - var(--a11y-compare-image-width, 50%))
          );
        }
        #placeholder {
          opacity: 0;
        }
        #placeholder ::slotted([slot="bottom"]) {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        /* wipe mode: the range input covers the whole stage, invisible */
        #input.overlay {
          position: absolute;
          inset: 0;
        }
        .overlay #slider {
          position: absolute;
          top: 0;
          height: 100%;
          /* wider than the stage by one thumb, so the thumb centre maps
             0 to 100 onto the full stage width */
          inset-inline-start: calc(0px - var(--a11y-compare-image-handle) / 2);
          width: calc(100% + var(--a11y-compare-image-handle));
          margin: 0;
          padding: 0;
          opacity: 0;
          cursor: ew-resize;
          touch-action: pan-y;
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
        }
        .overlay #slider::-webkit-slider-runnable-track {
          height: 100%;
        }
        .overlay #slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: var(--a11y-compare-image-handle);
          height: 100%;
        }
        .overlay #slider::-moz-range-track {
          height: 100%;
          background: transparent;
        }
        .overlay #slider::-moz-range-thumb {
          width: var(--a11y-compare-image-handle);
          height: 100%;
          border: 0;
          background: transparent;
        }
        :host {
          --a11y-compare-image-handle: 44px;
        }
        .divider {
          position: absolute;
          top: 0;
          bottom: 0;
          inset-inline-start: var(--a11y-compare-image-position, 50%);
          width: 2px;
          margin-inline-start: -1px;
          background-color: var(--ddd-theme-default-white);
          box-shadow: 0 0 0 1px var(--ddd-theme-default-potential50);
          pointer-events: none;
        }
        .handle {
          position: absolute;
          top: 50%;
          inset-inline-start: var(--a11y-compare-image-position, 50%);
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          width: var(--a11y-compare-image-handle);
          height: var(--a11y-compare-image-handle);
          margin-block-start: calc(0px - var(--a11y-compare-image-handle) / 2);
          margin-inline-start: calc(0px - var(--a11y-compare-image-handle) / 2);
          border: var(--ddd-border-sm);
          border-color: var(--a11y-compare-image-control-ink);
          border-radius: var(--ddd-radius-circle);
          background-color: var(--a11y-compare-image-control-fill);
          color: var(--a11y-compare-image-control-ink);
          box-shadow: 0 2px 8px var(--ddd-theme-default-potential50);
          pointer-events: none;
          transition: transform 0.15s ease;
        }
        .handle svg {
          width: var(--ddd-icon-3xs);
          height: var(--ddd-icon-3xs);
        }
        .stage:hover .handle {
          transform: scale(1.08);
        }
        #slider:focus-visible ~ .handle {
          outline: 3px solid
            light-dark(
              var(--ddd-theme-default-link),
              var(--ddd-theme-default-linkLight)
            );
          outline-offset: 3px;
        }
        .knob-enticement {
          animation: pulse 2s infinite;
          --ddd-animation-pulse-color: var(--ddd-primary-1-rgb, 30, 64, 124);
          --ddd-animation-pulse-size: var(--ddd-spacing-4, 16px);
        }
        .track .knob-enticement {
          position: absolute;
          top: 50%;
          inset-inline-start: var(--a11y-compare-image-position, 50%);
          width: var(--ddd-icon-3xs);
          height: var(--ddd-icon-3xs);
          margin-block-start: calc(0px - var(--ddd-icon-3xs) / 2);
          margin-inline-start: calc(0px - var(--ddd-icon-3xs) / 2);
          border-radius: var(--ddd-radius-circle);
          pointer-events: none;
        }
        .marker {
          position: absolute;
          width: 2px;
          margin-inline-start: -1px;
          pointer-events: none;
        }
        .overlay .marker {
          bottom: 0;
          height: var(--ddd-spacing-3);
          background-color: var(--ddd-theme-default-white);
          box-shadow: 0 0 0 1px var(--ddd-theme-default-potential50);
        }
        .track .marker {
          top: 50%;
          height: var(--ddd-spacing-4);
          margin-block-start: calc(0px - var(--ddd-spacing-4) / 2);
          background-color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        .marker[hidden] {
          display: none;
        }
        /* bottom bar */
        .bar {
          flex-wrap: nowrap;
          padding-inline: var(--ddd-spacing-4);
          font-family: var(--ddd-font-navigation);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        .nm {
          flex: 0 1 34%;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: var(--ddd-font-weight-bold);
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
        }
        .nm.end {
          text-align: end;
          margin-inline-start: auto;
        }
        /* in fade mode the range takes the room between the names */
        .fade .nm {
          flex: 0 1 auto;
          max-width: 30%;
        }
        .readout {
          flex: 1 1 auto;
          text-align: center;
          font-variant-numeric: tabular-nums;
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
        }
        .track {
          position: relative;
          flex: 1 1 auto;
          min-width: var(--ddd-spacing-20, 80px);
          display: flex;
          align-items: center;
        }
        /* fade range: styled like a small handle on a neutral track, the
           part up to the thumb in the ink colour */
        .track #slider {
          --a11y-compare-image-track: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          --a11y-compare-image-track-fill: linear-gradient(
            to right,
            var(
                --a11y-compare-image-control-progress,
                var(--a11y-compare-image-control-ink)
              )
              0 var(--a11y-compare-image-position, 50%),
            var(--a11y-compare-image-track)
              var(--a11y-compare-image-position, 50%) 100%
          );
          width: 100%;
          height: var(--ddd-spacing-6, 24px);
          margin: 0;
          padding: 0;
          cursor: pointer;
          background: transparent;
          -webkit-appearance: none;
          appearance: none;
        }
        :host(:dir(rtl)) .track #slider {
          --a11y-compare-image-track-fill: linear-gradient(
            to left,
            var(
                --a11y-compare-image-control-progress,
                var(--a11y-compare-image-control-ink)
              )
              0 var(--a11y-compare-image-position, 50%),
            var(--a11y-compare-image-track)
              var(--a11y-compare-image-position, 50%) 100%
          );
        }
        .track #slider::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: var(--ddd-radius-rounded);
          background: var(--a11y-compare-image-track-fill);
        }
        .track #slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          box-sizing: border-box;
          width: var(--ddd-icon-3xs);
          height: var(--ddd-icon-3xs);
          margin-top: calc((6px - var(--ddd-icon-3xs)) / 2);
          border: var(--ddd-border-sm);
          border-color: var(--a11y-compare-image-control-ink);
          border-radius: var(--ddd-radius-circle);
          background-color: var(--a11y-compare-image-control-fill);
        }
        .track #slider::-moz-range-track {
          height: 6px;
          border-radius: var(--ddd-radius-rounded);
          background: var(--a11y-compare-image-track);
        }
        .track #slider::-moz-range-progress {
          height: 6px;
          border-radius: var(--ddd-radius-rounded);
          background: var(
            --a11y-compare-image-control-progress,
            var(--a11y-compare-image-control-ink)
          );
        }
        .track #slider::-moz-range-thumb {
          box-sizing: border-box;
          width: var(--ddd-icon-3xs);
          height: var(--ddd-icon-3xs);
          border: var(--ddd-border-sm);
          border-color: var(--a11y-compare-image-control-ink);
          border-radius: var(--ddd-radius-circle);
          background-color: var(--a11y-compare-image-control-fill);
        }
        .track #slider:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        /* fit: fill the available height (full screen), never crop */
        :host([fit]) {
          display: flex;
          flex-direction: column;
          min-height: 0;
        }
        :host([fit]) figure {
          display: flex;
          flex-direction: column;
          flex: 1 1 auto;
          min-height: 0;
        }
        /* the stage keeps the image aspect ratio and is the largest box
           that fits the space left over, so the divider, handle and click
           mapping track the visible picture (no letterbox bands) */
        :host([fit]) .stage-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1 1 auto;
          min-height: 0;
          container-type: size;
        }
        :host([fit]) .stage {
          flex: none;
          width: min(
            100cqw,
            calc(100cqh * var(--a11y-compare-image-ratio, 1.7778))
          );
          height: auto;
          margin: 0;
          aspect-ratio: var(--a11y-compare-image-ratio, 1.7778);
        }
        :host([fit]) #container,
        :host([fit]) #layer {
          background-size: contain;
        }
        :host([fit]) #placeholder ::slotted([slot="bottom"]) {
          object-fit: contain;
        }
        @media (prefers-reduced-motion: reduce) {
          .handle {
            transition: none;
          }
          .stage:hover .handle {
            transform: none;
          }
          .knob-enticement {
            animation: none;
          }
        }
      `,
    ];
  }
  constructor() {
    super();
    this.opacity = false;
    this.fit = false;
    this.position = 50;
    this.dark = false;
    this.__markers = [];
    this.__upperAlt = "";
    this.__lowerAlt = "";
    this.label = "Compare images";
    this.dataPulse = false;
    this.addEventListener(
      "mouseenter",
      () => {
        this.dataPulse = false;
      },
      { once: true },
    );
    this.addEventListener(
      "focusin",
      () => {
        this.dataPulse = false;
      },
      { once: true },
    );
    // a layer finished loading (first load or a cache-busted refresh):
    // pick up its src and size the stage to the bottom image
    this.addEventListener(
      "load",
      (e) => {
        if (e.target && e.target.tagName === "IMG") {
          this._slide();
        }
      },
      true,
    );
  }
  connectedCallback() {
    super.connectedCallback();
    if (globalThis.MutationObserver && !this.__observer) {
      // layers can be swapped or edited after first paint (HAX settings,
      // a parent re-render); keep the backgrounds and names in sync
      this.__observer = new MutationObserver(() => this._slide());
      this.__observer.observe(this, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["src", "alt", "slot"],
      });
    }
  }
  disconnectedCallback() {
    if (this.__observer) {
      this.__observer.disconnect();
      this.__observer = null;
    }
    super.disconnectedCallback();
  }
  /**
   * Spoken value: "60% City in 2020, 40% Field in 1990" for two named
   * layers, otherwise just the percent
   */
  get _valueText() {
    const p = Math.round(Number(this.position) || 0);
    if (this.__upperAlt && this.__lowerAlt) {
      return `${p}% ${this.__upperAlt}, ${100 - p}% ${this.__lowerAlt}`;
    }
    return `${p}%`;
  }
  _renderSlider() {
    return html`<input
      id="slider"
      type="range"
      min="0"
      max="100"
      step="1"
      .value="${String(this.position)}"
      aria-label="${this.label}"
      aria-valuetext="${this._valueText}"
      @input="${this._valueChanged}"
      @change="${this._valueChanged}"
      @keydown="${this._keydown}"
    />`;
  }
  _renderMarkers() {
    return this.__markers.map(
      (marker) => html`
        <div
          class="marker"
          aria-hidden="true"
          .style="inset-inline-start: ${marker}%;"
          ?hidden="${marker === 100}"
        ></div>
      `,
    );
  }
  render() {
    const twoLayers = this.__upperAlt || this.__lowerAlt;
    const p = Math.round(Number(this.position) || 0);
    return html` <figure>
      <figcaption>
        <slot name="heading"></slot>
        <div id="description"><slot name="description"></slot></div>
      </figcaption>
      <div class="stage-wrap">
        <div class="stage" part="stage">
          <div id="container" style="background-image: url(${this.__lower})">
            <div id="wipe">
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
          ${
            !this.opacity
              ? html`<div id="input" class="overlay">
                  ${this._renderSlider()}
                  <span class="divider" aria-hidden="true"></span>
                  <span
                    class="handle ${this.dataPulse ? "knob-enticement" : ""}"
                    aria-hidden="true"
                    ><svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M9 7l-5 5 5 5"></path>
                      <path d="M15 7l5 5-5 5"></path></svg
                  ></span>
                  ${this._renderMarkers()}
                </div>`
              : nothing
          }
        </div>
      </div>
      ${
        !this.opacity
          ? html`<div
              class="ddd-block-footer bar"
              part="footer"
              aria-hidden="true"
            >
              ${
                this.__upperAlt
                  ? html`<span class="nm">${this.__upperAlt}</span>`
                  : nothing
              }
              <span class="readout"
                >${twoLayers ? `${p}% · ${100 - p}%` : `${p}%`}</span
              >
              ${
                this.__lowerAlt
                  ? html`<span class="nm end">${this.__lowerAlt}</span>`
                  : nothing
              }
            </div>`
          : html`<div class="ddd-block-footer bar fade" part="footer">
              ${
                this.__lowerAlt
                  ? html`<span class="nm" aria-hidden="true"
                      >${this.__lowerAlt}</span
                    >`
                  : nothing
              }
              <div id="input" class="track">
                ${this._renderMarkers()} ${this._renderSlider()}
                ${
                  this.dataPulse
                    ? html`<span
                        class="knob-enticement"
                        aria-hidden="true"
                      ></span>`
                    : nothing
                }
              </div>
              ${
                this.__upperAlt
                  ? html`<span class="nm end" aria-hidden="true"
                      >${this.__upperAlt}</span
                    >`
                  : nothing
              }
            </div>`
      }
    </figure>`;
  }
  /**
   * Range input (or a legacy immediate-value-changed detail) moved
   */
  _valueChanged(e) {
    if (e && e.detail && typeof e.detail.value !== "undefined") {
      this.position = Number(e.detail.value);
    } else if (e && e.target && typeof e.target.value !== "undefined") {
      this.position = Number(e.target.value);
    }
  }
  /**
   * Page Up / Page Down move 10, Home / End jump to either end; set here so
   * every browser behaves the same
   */
  _keydown(e) {
    const current = Number(this.position) || 0;
    let next = null;
    switch (e.key) {
      case "PageUp":
        next = current + 10;
        break;
      case "PageDown":
        next = current - 10;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = 100;
        break;
    }
    if (next !== null) {
      e.preventDefault();
      this.position = Math.min(100, Math.max(0, next));
    }
  }
  static get tag() {
    return "a11y-compare-image";
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * invert the slider controls for a dark surface
       */
      dark: {
        type: Boolean,
        reflect: true,
      },
      activeLayer: {
        type: Number,
        attribute: "active-layer",
        reflect: true,
      },
      dataPulse: {
        type: Boolean,
        reflect: true,
        attribute: "data-pulse",
      },
      /**
       * mode for the slider: wipe
       */
      opacity: {
        type: Boolean,
      },
      /**
       * fill the available height and fit the images without cropping
       * (used for full screen)
       */
      fit: {
        type: Boolean,
        reflect: true,
      },
      label: {
        type: String,
      },
      position: {
        type: Number,
        reflect: true,
      },
      __lower: {
        type: String,
      },
      __upper: {
        type: String,
      },
      __upperAlt: {
        type: String,
      },
      __lowerAlt: {
        type: String,
      },
      __markers: {
        type: Array,
      },
    };
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) super.firstUpdated(changedProperties);
    this._slide();
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (
        (propName === "position" && this.position !== oldValue) ||
        (propName === "opacity" && typeof oldValue !== "undefined")
      ) {
        this._slide();
      }
    });
  }
  /**
   * updates the slider
   */
  _slide() {
    if (!this.shadowRoot) {
      return;
    }
    // the wipe geometry custom properties live on #wipe, whose style
    // attribute is never re-committed by the template, so they survive the
    // style attribute re-commit that #container gets on every __lower change
    let wipe = this.shadowRoot.querySelector("#wipe");
    let layers = this.querySelectorAll("[slot=top],[slot=bottom]");
    // the handle, divider and readout all read the position from here
    this.style.setProperty(
      "--a11y-compare-image-position",
      this.position + "%",
    );
    let input = this.shadowRoot.querySelector("#input");
    if (input) {
      input.style.setProperty(
        "--a11y-compare-image-position",
        this.position + "%",
      );
    }
    // size the stage to the first layer so nothing is cropped
    if (layers[0] && layers[0].naturalWidth && layers[0].naturalHeight) {
      this.style.setProperty(
        "--a11y-compare-image-ratio",
        String(layers[0].naturalWidth / layers[0].naturalHeight),
      );
    }
    // This is the total number of transitions between layers
    let total = layers.length - 1;
    //This is percent of the slider for each section
    let section = 100 / total;
    // Index of the upper image
    let active = Math.floor(this.position / section) || 0;
    // This is the layer number that is current on top.
    this.activeLayer = active + 1;
    // Set background images
    this.__upper = layers[active + 1]
      ? layers[active + 1].src
      : layers[active]
        ? layers[active].src
        : "";
    this.__lower = layers[active] ? layers[active].src : "";
    // names for the bottom bar and the spoken value; only a plain two
    // image comparison has a fixed "this one vs that one"
    if (layers.length === 2) {
      this.__upperAlt = layers[1].getAttribute("alt") || "";
      this.__lowerAlt = layers[0].getAttribute("alt") || "";
    } else {
      this.__upperAlt = "";
      this.__lowerAlt = "";
    }
    // Adding Fake markers behind the slider.
    if (total !== this.__markers.length) {
      this._updateMarkers(total);
    }
    if (wipe && this.opacity === false) {
      wipe.style.setProperty("--a11y-compare-image-width", this.position + "%");
      wipe.style.setProperty("--a11y-compare-image-opacity", 1);
    } else if (wipe) {
      wipe.style.setProperty("--a11y-compare-image-width", "100%");
      wipe.style.setProperty(
        "--a11y-compare-image-opacity",
        this.position / 100,
      );
    }
  }
  _updateMarkers(total) {
    this.__markers = [];
    if (total > 0) {
      let step = 100 / total;
      for (let i = step; i <= 100; i += step) {
        this.__markers.push(i);
      }
    }
  }
}
globalThis.customElements.define(a11yCompareImage.tag, a11yCompareImage);
export { a11yCompareImage };
