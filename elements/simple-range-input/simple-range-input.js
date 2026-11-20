/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
// haxtheweb/issues#3107: full SimpleColors -> DDD migration. DDD extends
// SimpleColorsSuper, so the accent-color / dark / contrast theming and
// its --simple-colors-default-theme-accent-* palette vars all keep
// working, while the DDDSuper constructor registers the DDD design
// system (globally injecting the --ddd-* variables the terminal
// fallbacks below now lean on)
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
/**
 * `simple-range-input`
 * `simple styling on a range input`
 *
 * @demo demo/index.html
 * @element simple-range-input
 */
class SimpleRangeInput extends DDD {
  /**
   * object life cycle
   */
  constructor() {
    super();
    this.dragging = false;
    this.label = "Range input";
    this.min = 0;
    this.max = 100;
    this.step = 1;
    this.value = 0;
    this.immediateValue = 0;
    this.disabled = false;
    this.lift = false;
    this.__liftNow = 0;
    this.__liftGrabbed = false;
    this.__liftFrame = null;
    this.__liftRelease = () => {
      globalThis.removeEventListener("pointerup", this.__liftRelease);
      globalThis.removeEventListener("pointercancel", this.__liftRelease);
      this.__liftGrabbed = this.__liftKeyboardFocus();
      this._animateLift();
    };
    // the lift shows while the pin is grabbed: pointer held down on it, or
    // keyboard focus on the input
    this.addEventListener("pointerdown", () => {
      if (!this.lift || this.disabled) {
        return;
      }
      this.__liftGrabbed = true;
      globalThis.addEventListener("pointerup", this.__liftRelease);
      globalThis.addEventListener("pointercancel", this.__liftRelease);
      this._animateLift();
    });
    this.addEventListener("focusin", () => {
      if (this.lift && !this.disabled && this.__liftKeyboardFocus()) {
        this.__liftGrabbed = true;
        this._animateLift();
      }
    });
    this.addEventListener("focusout", () => {
      if (this.lift) {
        this.__liftGrabbed = false;
        this._animateLift();
      }
    });
    this.addEventListener("mousedown", () => {
      this.dragging = true;
    });
    this.addEventListener("mouseup", () => {
      this.dragging = false;
      this.value = this.immediateValue;
    });
    // Only treat value-changing keys as drag interactions. Tab and other
    // non-value keys would otherwise set value = immediateValue on keyup,
    // committing a stale immediateValue and yanking the slider back.
    let valueKeys = [
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
      "PageUp",
      "PageDown",
    ];
    this.addEventListener("keydown", (e) => {
      if (valueKeys.includes(e.key)) {
        // a click-focused input has no :focus-visible, so arrow keys after
        // a click still need to raise the pin
        if (this.lift && !this.disabled && !this.__liftGrabbed) {
          this.__liftGrabbed = true;
          this._animateLift();
        }
        this.dragging = true;
        setTimeout(() => {
          this.value = this.immediateValue;
        }, 0);
      }
    });
    this.addEventListener("keyup", (e) => {
      if (valueKeys.includes(e.key)) {
        this.dragging = false;
        this.value = this.immediateValue;
      }
    });
  }
  static get properties() {
    return {
      ...super.properties,
      dragging: { type: Boolean, reflect: true },
      immediateValue: { type: Number, attribute: "immediate-value" },
      value: { type: Number, reflect: true },
      min: { type: Number },
      step: { type: Number },
      max: { type: Number },
      label: { type: String },
      disabled: { type: Boolean, reflect: true },
      /**
       * Pin lift: the track bends up into a bump under the pin while it is
       * grabbed (pointer down or keyboard focus), so you can see where you
       * are and that you have hold of it, even under a fingertip. For
       * scrubbers along a long track (media seek bars); leave it off for
       * short sliders and settings. Sized by the --ddd-range-lift-* tokens.
       */
      lift: { type: Boolean, reflect: true },
    };
  }
  /**
   * This is a convention, not the standard
   */
  static get tag() {
    return "simple-range-input";
  }
  // Template return function
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: var(--simple-range-input-track-height, 10px);
          height: var(--simple-range-input-pin-height, 20px);
        }
        :host([disabled]) {
          pointer-events: none;
        }
        /* haxtheweb/issues#3107: the dark attribute drives color-scheme so
           the light-dark() pairs in the track / thumb fallbacks track it */
        :host([dark]) {
          color-scheme: dark;
        }
        input[type="range"] {
          -webkit-appearance: none;
          margin: 0;
          padding: 0;
          width: 100%;
          /* a 24px tall pointer target around the track */
          min-height: 24px;
          background: transparent;
        }
        input[type="range"]:focus {
          outline: none;
        }
        /* keyboard focus draws a visible DDD focus ring around the whole
           slider (the thumb ring alone is too faint to find) */
        input[type="range"]:focus-visible {
          outline: var(
            --simple-range-input-focus-ring,
            var(--ddd-focus-ring, 2px solid currentColor)
          );
          outline-offset: var(--ddd-focus-offset, 2px);
          border-radius: var(--ddd-radius-xs, 2px);
        }
        /* focus ring fallback pairs a dark ring with a light one via
           light-dark() so focus stays visible under a dark color scheme */
        input[type="range"]:focus::-webkit-slider-thumb {
          border: 2px solid
            var(
              --simple-range-input-focus-border-color,
              var(
                --simple-colors-default-theme-accent-8,
                light-dark(
                  var(--ddd-theme-default-coalyGray),
                  var(--ddd-theme-default-white)
                )
              )
            );
          box-shadow: 0 0 0 2px
            var(
              --simple-range-input-focus-ring-color,
              light-dark(rgba(0, 0, 0, 0.3), rgba(255, 255, 255, 0.4))
            );
        }
        input[type="range"]:focus::-moz-range-thumb {
          border: 2px solid
            var(
              --simple-range-input-focus-border-color,
              var(
                --simple-colors-default-theme-accent-8,
                light-dark(
                  var(--ddd-theme-default-coalyGray),
                  var(--ddd-theme-default-white)
                )
              )
            );
          box-shadow: 0 0 0 2px
            var(
              --simple-range-input-focus-ring-color,
              light-dark(rgba(0, 0, 0, 0.3), rgba(255, 255, 255, 0.4))
            );
        }
        input[type="range"]:focus::-ms-thumb {
          border: 2px solid
            var(
              --simple-range-input-focus-border-color,
              var(
                --simple-colors-default-theme-accent-8,
                light-dark(
                  var(--ddd-theme-default-coalyGray),
                  var(--ddd-theme-default-white)
                )
              )
            );
          box-shadow: 0 0 0 2px
            var(
              --simple-range-input-focus-ring-color,
              light-dark(rgba(0, 0, 0, 0.3), rgba(255, 255, 255, 0.4))
            );
        }
        input[type="range"]::-webkit-slider-runnable-track {
          width: 100%;
          height: var(--simple-range-input-track-height, 10px);
          cursor: pointer;
          box-shadow: var(
            --simple-range-input-box-shadow,
            0px 0px 0px #000000,
            0px 0px 0px #0d0d0d
          );
          background: var(
            --simple-range-input-bg,
            var(
              --simple-colors-default-theme-accent-2,
              light-dark(
                var(--ddd-theme-default-limestoneLight),
                var(--ddd-theme-default-coalyGray)
              )
            )
          );
          border-radius: var(--simple-range-input-track-border-radius, 2px);
          border: var(--simple-range-input-border, 0px solid #000000);
        }
        input[type="range"]::-webkit-slider-thumb {
          box-shadow: var(
            --simple-range-input-box-shadow,
            0px 0px 0px #000000,
            0px 0px 0px #0d0d0d
          );
          border: var(--simple-range-input-border, 0px solid #000000);
          height: var(--simple-range-input-pin-height, 20px);
          width: var(
            --simple-range-input-pin-width,
            var(--simple-range-input-pin-height, 20px)
          );
          border-radius: var(--simple-range-input-border-radius, 50%);
          background: var(
            --simple-range-input-color,
            var(
              --simple-colors-default-theme-accent-8,
              light-dark(
                var(--ddd-theme-default-coalyGray),
                var(--ddd-theme-default-white)
              )
            )
          );
          cursor: pointer;
          margin: calc(
              0.5 *
                (
                  var(--simple-range-input-track-height, 10px) - var(
                      --simple-range-input-pin-height,
                      20px
                    )
                )
            )
            0;
          -webkit-appearance: none;
        }
        input[type="range"]:focus::-webkit-slider-runnable-track {
          background: var(
            --simple-range-input-bg,
            var(
              --simple-colors-default-theme-accent-2,
              light-dark(
                var(--ddd-theme-default-limestoneLight),
                var(--ddd-theme-default-coalyGray)
              )
            )
          );
        }
        input[type="range"]::-moz-range-track {
          width: 100%;
          height: var(--simple-range-input-track-height, 10px);
          cursor: pointer;
          box-shadow: var(
            --simple-range-input-box-shadow,
            0px 0px 0px #000000,
            0px 0px 0px #0d0d0d
          );
          background: var(
            --simple-range-input-bg,
            var(
              --simple-colors-default-theme-accent-2,
              light-dark(
                var(--ddd-theme-default-limestoneLight),
                var(--ddd-theme-default-coalyGray)
              )
            )
          );
          border-radius: var(--simple-range-input-track-border-radius, 2px);
          border: var(--simple-range-input-border, 0px solid #000000);
        }
        input[type="range"]::-moz-range-thumb {
          box-shadow: var(
            --simple-range-input-box-shadow,
            0px 0px 0px #000000,
            0px 0px 0px #0d0d0d
          );
          border: var(--simple-range-input-border, 0px solid #000000);
          height: var(--simple-range-input-pin-height, 20px);
          width: var(
            --simple-range-input-pin-width,
            var(--simple-range-input-pin-height, 20px)
          );
          border-radius: var(--simple-range-input-border-radius, 50%);
          background: var(
            --simple-range-input-color,
            var(
              --simple-colors-default-theme-accent-8,
              light-dark(
                var(--ddd-theme-default-coalyGray),
                var(--ddd-theme-default-white)
              )
            )
          );
          cursor: pointer;
          margin: calc(
              0.5 *
                (
                  var(--simple-range-input-track-height, 10px) - var(
                      --simple-range-input-pin-height,
                      20px
                    )
                )
            )
            0;
        }
        input[type="range"]::-ms-track {
          width: 100%;
          height: var(--simple-range-input-track-height, 10px);
          cursor: pointer;
          background: transparent;
          border-color: transparent;
          border-width: var(--simple-range-input-pin-height, 20px) 0;
          color: transparent;
        }
        input[type="range"]::-ms-fill-lower {
          background: var(
            --simple-range-input-bg,
            var(
              --simple-colors-default-theme-accent-2,
              light-dark(
                var(--ddd-theme-default-limestoneLight),
                var(--ddd-theme-default-coalyGray)
              )
            )
          );
          border: var(--simple-range-input-border, 0px solid #000000);
          border-radius: var(--simple-range-input-track-border-radius, 2px);
          box-shadow: var(
            --simple-range-input-box-shadow,
            0px 0px 0px #000000,
            0px 0px 0px #0d0d0d
          );
        }
        input[type="range"]::-ms-fill-upper {
          background: var(
            --simple-range-input-bg,
            var(
              --simple-colors-default-theme-accent-2,
              light-dark(
                var(--ddd-theme-default-limestoneLight),
                var(--ddd-theme-default-coalyGray)
              )
            )
          );
          border: var(--simple-range-input-border, 0px solid #000000);
          border-radius: var(--simple-range-input-track-border-radius, 2px);
          box-shadow: var(
            --simple-range-input-box-shadow,
            0px 0px 0px #000000,
            0px 0px 0px #0d0d0d
          );
        }
        input[type="range"]::-ms-thumb {
          box-shadow: var(
            --simple-range-input-box-shadow,
            0px 0px 0px #000000,
            0px 0px 0px #0d0d0d
          );
          border: var(--simple-range-input-border, 0px solid #000000);
          height: var(--simple-range-input-pin-height, 20px);
          width: var(
            --simple-range-input-pin-width,
            var(--simple-range-input-pin-height, 20px)
          );
          border-radius: var(--simple-range-input-border-radius, 50%);
          background: var(
            --simple-range-input-color,
            var(
              --simple-colors-default-theme-accent-8,
              light-dark(
                var(--ddd-theme-default-coalyGray),
                var(--ddd-theme-default-white)
              )
            )
          );
          cursor: pointer;
          margin: calc(
              0.5 *
                (
                  var(--simple-range-input-track-height, 10px) - var(
                      --simple-range-input-pin-height,
                      20px
                    )
                )
            )
            0;
        }
        input[type="range"]:focus::-ms-fill-lower {
          background: var(
            --simple-range-input-bg,
            var(
              --simple-colors-default-theme-accent-2,
              light-dark(
                var(--ddd-theme-default-limestoneLight),
                var(--ddd-theme-default-coalyGray)
              )
            )
          );
        }
        input[type="range"]:focus::-ms-fill-upper {
          background: var(
            --simple-range-input-bg,
            var(
              --simple-colors-default-theme-accent-2,
              light-dark(
                var(--ddd-theme-default-limestoneLight),
                var(--ddd-theme-default-coalyGray)
              )
            )
          );
        }
        /* high contrast: the track and thumb are drawn with fills, which
           forced colors removes, so draw them in system colors */
        @media (forced-colors: active) {
          input[type="range"]::-webkit-slider-runnable-track {
            forced-color-adjust: none;
            background: Canvas;
            border: 1px solid CanvasText;
            box-shadow: none;
          }
          input[type="range"]::-webkit-slider-thumb {
            forced-color-adjust: none;
            background: Highlight;
            border: 1px solid CanvasText;
            box-shadow: none;
          }
          input[type="range"]::-moz-range-track {
            forced-color-adjust: none;
            background: Canvas;
            border: 1px solid CanvasText;
            box-shadow: none;
          }
          input[type="range"]::-moz-range-thumb {
            forced-color-adjust: none;
            background: Highlight;
            border: 1px solid CanvasText;
            box-shadow: none;
          }
        }
        /* pin lift: an SVG path draws the track and bends it up under the
           pin while it is grabbed; the native input stays on top for
           pointer, keyboard and assistive technology */
        #wrap {
          position: relative;
          width: 100%;
        }
        :host([lift]) {
          --simple-range-input-lift-height-active: var(
            --simple-range-input-lift-height,
            var(--ddd-range-lift-height, 12px)
          );
          height: auto;
          padding-block-start: var(--simple-range-input-lift-height-active);
        }
        @media (pointer: coarse) {
          :host([lift]) {
            --simple-range-input-lift-height-active: var(
              --simple-range-input-lift-height-coarse,
              var(--ddd-range-lift-height-coarse, 24px)
            );
          }
        }
        #lift {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
          pointer-events: none;
        }
        #lift path {
          fill: none;
          stroke-linecap: round;
          stroke-width: var(--simple-range-input-track-height, 10px);
        }
        #lift-track {
          stroke: var(
            --simple-range-input-track-color,
            var(
              --simple-colors-default-theme-accent-2,
              light-dark(
                var(--ddd-theme-default-limestoneLight),
                var(--ddd-theme-default-coalyGray)
              )
            )
          );
        }
        #lift-fill {
          stroke: var(
            --simple-range-input-fill-color,
            var(
              --simple-range-input-track-color,
              var(
                --simple-colors-default-theme-accent-2,
                light-dark(
                  var(--ddd-theme-default-limestoneLight),
                  var(--ddd-theme-default-coalyGray)
                )
              )
            )
          );
        }
        #lift-probe {
          position: absolute;
          visibility: hidden;
          pointer-events: none;
          width: var(
            --simple-range-input-pin-width,
            var(--simple-range-input-pin-height, 20px)
          );
          height: var(--simple-range-input-lift-height-active);
        }
        #lift-spread {
          position: absolute;
          visibility: hidden;
          pointer-events: none;
          height: 0;
          width: var(
            --simple-range-input-lift-width,
            var(--ddd-range-lift-width, 64px)
          );
        }
        :host([lift]) input[type="range"]::-webkit-slider-runnable-track,
        :host([lift]) input[type="range"]:focus::-webkit-slider-runnable-track {
          background: transparent;
          border-color: transparent;
          box-shadow: none;
        }
        :host([lift]) input[type="range"]::-moz-range-track {
          background: transparent;
          border-color: transparent;
          box-shadow: none;
        }
        :host([lift]) input[type="range"]::-webkit-slider-thumb {
          transform: translateY(
            calc(-1 * var(--simple-range-input-lift-now, 0px))
          );
        }
        :host([lift]) input[type="range"]::-moz-range-thumb {
          transform: translateY(
            calc(-1 * var(--simple-range-input-lift-now, 0px))
          );
        }
        @media (forced-colors: active) {
          #lift {
            forced-color-adjust: none;
          }
          #lift-track {
            stroke: CanvasText;
          }
          #lift-fill {
            stroke: Highlight;
          }
          :host([lift]) input[type="range"]::-webkit-slider-runnable-track {
            border-color: transparent;
          }
          :host([lift]) input[type="range"]::-moz-range-track {
            border-color: transparent;
          }
        }
        #label {
          position: absolute;
          left: -10000px;
          top: auto;
          width: 1px;
          height: 1px;
          overflow: hidden;
        }
      `,
    ];
  }
  render() {
    return html`<div id="wrap">
        ${
          this.lift
            ? html`<svg id="lift" aria-hidden="true" focusable="false">
                  <g id="lift-mirror">
                    <path id="lift-track"></path>
                    <path id="lift-fill"></path>
                  </g></svg
                ><span id="lift-probe"></span><span id="lift-spread"></span>`
            : ``
        }<input
          @input="${this._inputChanged}"
          @changed="${this._valueChanged}"
          ?disabled="${this.disabled}"
          type="range"
          min="${this.min}"
          step="${this.step}"
          max="${this.max}"
          .value="${this.value}"
          aria-labelledby="label"
        />
      </div>
      <label id="label">${this.label}</label>`;
  }
  /**
   * keyboard focus (not a click) on the native input
   */
  __liftKeyboardFocus() {
    let input = this.shadowRoot ? this.shadowRoot.querySelector("input") : null;
    if (!input || this.shadowRoot.activeElement !== input) {
      return false;
    }
    try {
      return input.matches(":focus-visible");
    } catch {
      return true;
    }
  }
  /**
   * sizes the lift reads from its tokens, resolved through the probe
   */
  __liftMetrics() {
    let probe = this.shadowRoot.querySelector("#lift-probe");
    let wrap = this.shadowRoot.querySelector("#wrap");
    let style = globalThis.getComputedStyle(this);
    let rest = parseFloat(
      style.getPropertyValue("--simple-range-input-lift-rest") ||
        style.getPropertyValue("--ddd-range-lift-rest"),
    );
    let durationRaw =
      style.getPropertyValue("--simple-range-input-lift-duration").trim() ||
      style.getPropertyValue("--ddd-range-lift-duration").trim();
    let duration = durationRaw === "" ? 150 : parseFloat(durationRaw);
    if (durationRaw.endsWith("s") && !durationRaw.endsWith("ms")) {
      duration = duration * 1000;
    }
    let reduced =
      globalThis.matchMedia &&
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return {
      width: wrap.offsetWidth,
      height: wrap.offsetHeight,
      pin: probe.offsetWidth,
      spread: this.shadowRoot.querySelector("#lift-spread").offsetWidth,
      liftHeight: probe.offsetHeight,
      rest: isNaN(rest) ? 0 : Math.min(1, Math.max(0, rest)),
      duration: reduced || isNaN(duration) ? 0 : duration,
      rtl: style.direction === "rtl",
    };
  }
  /**
   * move the lift toward its grabbed or resting height
   */
  _animateLift() {
    if (!this.lift || !this.shadowRoot) {
      return;
    }
    let probe = this.shadowRoot.querySelector("#lift-probe");
    if (!probe) {
      return;
    }
    let m = this.__liftMetrics();
    let target = m.liftHeight * (this.__liftGrabbed ? 1 : m.rest);
    let from = this.__liftNow;
    if (this.__liftFrame) {
      globalThis.cancelAnimationFrame(this.__liftFrame);
      this.__liftFrame = null;
    }
    if (m.duration === 0 || from === target) {
      this.__liftNow = target;
      this._drawLift();
      return;
    }
    let start = null;
    let step = (now) => {
      if (start === null) {
        start = now;
      }
      let t = Math.min(1, (now - start) / m.duration);
      // ease out: quick to rise under the finger, settles softly
      let eased = 1 - Math.pow(1 - t, 3);
      this.__liftNow = from + (target - from) * eased;
      this._drawLift();
      this.__liftFrame = t < 1 ? globalThis.requestAnimationFrame(step) : null;
    };
    this.__liftFrame = globalThis.requestAnimationFrame(step);
  }
  /**
   * draw the track as two paths split at the pin: the filled part before
   * it and the rest after it, bending up to the current lift height
   */
  _drawLift() {
    if (!this.lift || !this.shadowRoot) {
      return;
    }
    let svg = this.shadowRoot.querySelector("#lift");
    let input = this.shadowRoot.querySelector("input");
    if (!svg || !input) {
      return;
    }
    let m = this.__liftMetrics();
    let w = m.width;
    let base = m.height / 2;
    let trackHeight =
      parseFloat(
        globalThis.getComputedStyle(svg.querySelector("path")).strokeWidth,
      ) || 0;
    let x0 = trackHeight / 2;
    let x1 = Math.max(x0, w - trackHeight / 2);
    let min = parseFloat(input.min) || 0;
    let max = parseFloat(input.max);
    let value = parseFloat(input.value) || 0;
    let p = max > min ? (value - min) / (max - min) : 0;
    p = Math.min(1, Math.max(0, p));
    // the native thumb centre travels between half a pin from each end
    let cx = m.pin / 2 + p * Math.max(0, w - m.pin);
    cx = Math.min(x1, Math.max(x0, cx));
    let h = this.__liftNow;
    let half = m.spread / 2;
    let a = Math.max(x0, cx - half);
    let b = Math.min(x1, cx + half);
    let peak = base - h;
    let r = (n) => Math.round(n * 100) / 100;
    let before = `M${r(x0)} ${r(base)} L${r(a)} ${r(base)} C${r(a + (cx - a) / 2)} ${r(base)} ${r(cx - (cx - a) / 2)} ${r(peak)} ${r(cx)} ${r(peak)}`;
    let after = `M${r(cx)} ${r(peak)} C${r(cx + (b - cx) / 2)} ${r(peak)} ${r(b - (b - cx) / 2)} ${r(base)} ${r(b)} ${r(base)} L${r(x1)} ${r(base)}`;
    svg.setAttribute("viewBox", `0 0 ${r(w)} ${r(m.height)}`);
    svg
      .querySelector("#lift-mirror")
      .setAttribute(
        "transform",
        m.rtl ? `translate(${r(w)} 0) scale(-1 1)` : "",
      );
    svg.querySelector("#lift-fill").setAttribute("d", before);
    svg.querySelector("#lift-track").setAttribute("d", after);
    // the pin rides on the peak
    this.style.setProperty("--simple-range-input-lift-now", `${r(h)}px`);
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.__liftObserver && this.shadowRoot) {
      let wrap = this.shadowRoot.querySelector("#wrap");
      if (wrap) {
        this.__liftObserver.observe(wrap);
      }
    }
  }
  disconnectedCallback() {
    if (this.__liftObserver) {
      this.__liftObserver.disconnect();
    }
    if (this.__liftFrame) {
      globalThis.cancelAnimationFrame(this.__liftFrame);
      this.__liftFrame = null;
    }
    globalThis.removeEventListener("pointerup", this.__liftRelease);
    globalThis.removeEventListener("pointercancel", this.__liftRelease);
    super.disconnectedCallback();
  }
  _inputChanged(e) {
    // convert the string from the input event so the Number-typed
    // immediateValue property holds an actual number
    this.immediateValue = parseFloat(e.target.value);
  }
  _valueChanged(e) {
    // convert here too so value stays a Number
    this.value = parseFloat(e.target.value);
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // helps ensure a flood of initial stampping input does not occur
    // this is because of a vanilla element + event monitoring to set initials
    setTimeout(() => {
      this.__ready = true;
    }, 0);
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has("lift") && !this.lift) {
      this.style.removeProperty("--simple-range-input-lift-now");
      if (this.__liftObserver) {
        this.__liftObserver.disconnect();
      }
    }
    if (changedProperties.has("lift") && this.lift && this.shadowRoot) {
      if (!this.__liftObserver && globalThis.ResizeObserver) {
        this.__liftObserver = new globalThis.ResizeObserver(() => {
          this._drawLift();
        });
      }
      if (this.__liftObserver) {
        this.__liftObserver.observe(this.shadowRoot.querySelector("#wrap"));
      }
      this._animateLift();
    } else if (
      this.lift &&
      (changedProperties.has("value") ||
        changedProperties.has("immediateValue") ||
        changedProperties.has("min") ||
        changedProperties.has("max"))
    ) {
      this._drawLift();
    }
    if (this.shadowRoot && this.__ready) {
      changedProperties.forEach((oldValue, propName) => {
        if (propName === "immediateValue") {
          if (this.dragging) {
            this.dispatchEvent(
              new CustomEvent("immediate-value-changed", {
                detail: {
                  value: this.immediateValue,
                },
              }),
            );
          } else {
            this.value = this.immediateValue;
          }
        }
        if (propName === "value") {
          this.dispatchEvent(
            new CustomEvent("value-changed", {
              detail: {
                value: this.value,
              },
            }),
          );
        }
      });
    }
  }
}
globalThis.customElements.define(SimpleRangeInput.tag, SimpleRangeInput);
export { SimpleRangeInput };
