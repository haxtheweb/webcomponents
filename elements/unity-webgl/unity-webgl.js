/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";

const ATTRS = [
  "target",
  "compression",
  "streamingurl",
  "companyname",
  "productname",
  "productversion",
  "width",
  "height",
  "background",
];
/**
 * `unity-webgl`
 * `Unity WebGL player`
 *
 * @demo demo/index.html
 * @element unity-webgl
 */
class UnityWebgl extends I18NMixin(HTMLElement) {
  /**
   * This is a convention, not the standard
   */
  static get tag() {
    return "unity-webgl";
  }
  /**
   * object life cycle
   */
  constructor() {
    super();
    // create a template element for processing shadowRoot
    this.template = globalThis.document.createElement("template");
    // create a shadowRoot
    this.attachShadow({ mode: "open" });
    this.t = this.t || {};
    this.t = {
      ...this.t,
      simulation: "Simulation",
      fullScreen: "Full screen",
      exitFullScreen: "Exit full screen",
    };
    this._fullscreen = false;
    this._fullscreenChanged = this._fullscreenChanged.bind(this);
    this._toggleFullscreen = this._toggleFullscreen.bind(this);
    // translations only touch the header text, never the running player
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
      updateCallback: "_updateStrings",
    });
  }
  /**
   * Escape a string before it is written into the shadow template
   */
  _escape(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  get _label() {
    return `${this.t.simulation} · Unity`;
  }
  get _fullscreenLabel() {
    return this._fullscreen ? this.t.exitFullScreen : this.t.fullScreen;
  }
  /**
   * Full screen is offered only where the browser supports it
   */
  get _canFullscreen() {
    return !!(
      globalThis.document &&
      globalThis.document.fullscreenEnabled &&
      globalThis.HTMLElement &&
      globalThis.HTMLElement.prototype.requestFullscreen
    );
  }
  get _frameBody() {
    return this.shadowRoot.querySelector(".frame-body");
  }
  _fullscreenChanged() {
    const body = this._frameBody;
    this._fullscreen = !!(
      body &&
      this.shadowRoot.fullscreenElement &&
      this.shadowRoot.fullscreenElement === body
    );
    this._updateStrings();
  }
  /**
   * Toggle the frame body (the canvas) in and out of full screen
   */
  _toggleFullscreen() {
    const body = this._frameBody;
    if (this._fullscreen && globalThis.document.exitFullscreen) {
      globalThis.document.exitFullscreen();
    } else if (body && body.requestFullscreen) {
      const request = body.requestFullscreen();
      if (request && request.catch) {
        request.catch(() => {});
      }
    }
  }
  /**
   * Refresh the header text in place; re-rendering would reboot the player
   */
  _updateStrings() {
    if (!this.shadowRoot) {
      return;
    }
    const label = this.shadowRoot.querySelector(".frame-label");
    if (label) {
      label.textContent = this._label;
    }
    const button = this.shadowRoot.querySelector(".frame-open");
    if (button) {
      button.setAttribute("aria-label", this._fullscreenLabel);
      button.setAttribute("title", this._fullscreenLabel);
      button.setAttribute("aria-pressed", this._fullscreen ? "true" : "false");
      const icon = button.querySelector("simple-icon-lite");
      if (icon) {
        icon.setAttribute(
          "icon",
          this._fullscreen ? "icons:fullscreen-exit" : "icons:fullscreen",
        );
      }
    }
  }
  /**
   * This is a convention, not the standard to return HTML of the element
   */
  get html() {
    return `
    <style>
      :host {
        display: block;
        width: ${this.width};
        max-width: 100%;
      }
      /* labelled frame shared with the other DDD learning blocks */
      .frame {
        box-sizing: border-box;
        border: var(--ddd-border-xs);
        border-color: light-dark(
          var(--ddd-theme-default-limestoneLight),
          var(--ddd-theme-default-slateGray)
        );
        border-radius: var(--ddd-radius-md);
        overflow: hidden;
        font-family: var(--ddd-font-primary);
      }
      .frame-header {
        display: flex;
        align-items: center;
        gap: var(--ddd-spacing-3);
        padding-block: var(--ddd-spacing-2);
        padding-inline: var(--ddd-spacing-4) var(--ddd-spacing-2);
        border-bottom: var(--ddd-border-xs);
        border-color: light-dark(
          var(--ddd-theme-default-limestoneLight),
          var(--ddd-theme-default-slateGray)
        );
        min-height: var(--ddd-control-height-sm);
      }
      .frame-chip {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: none;
        width: var(--ddd-icon-xs);
        height: var(--ddd-icon-xs);
        border-radius: var(--ddd-radius-circle);
        background-color: light-dark(
          var(--ddd-theme-default-beaverBlue),
          var(--ddd-theme-default-skyBlue)
        );
        color: light-dark(
          var(--ddd-theme-default-white),
          var(--ddd-theme-default-potentialMidnight)
        );
        --simple-icon-width: var(--ddd-icon-3xs);
        --simple-icon-height: var(--ddd-icon-3xs);
      }
      .frame-label {
        flex: 1 1 auto;
        min-width: 0;
        font-family: var(--ddd-font-navigation);
        font-size: var(--ddd-font-size-4xs);
        font-weight: var(--ddd-font-weight-medium);
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: light-dark(
          var(--ddd-theme-default-slateGray),
          var(--ddd-theme-default-limestoneLight)
        );
      }
      :host(:lang(ar)) .frame-label,
      :host(:lang(fa)) .frame-label,
      :host(:lang(he)) .frame-label,
      :host(:lang(ur)) .frame-label {
        letter-spacing: 0;
      }
      .frame-open {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: none;
        box-sizing: border-box;
        width: var(--ddd-control-height-sm);
        height: var(--ddd-control-height-sm);
        padding: var(--ddd-spacing-0);
        border: var(--ddd-border-xs);
        border-color: light-dark(
          var(--ddd-theme-default-limestoneLight),
          var(--ddd-theme-default-slateGray)
        );
        border-radius: var(--ddd-radius-rounded);
        background-color: transparent;
        color: light-dark(
          var(--ddd-theme-default-nittanyNavy),
          var(--ddd-theme-default-linkLight)
        );
        cursor: pointer;
        --simple-icon-width: var(--ddd-icon-3xs);
        --simple-icon-height: var(--ddd-icon-3xs);
      }
      .frame-open:hover {
        border-color: light-dark(
          var(--ddd-theme-default-nittanyNavy),
          var(--ddd-theme-default-linkLight)
        );
      }
      .frame-open:focus-visible {
        outline: var(--ddd-focus-ring);
        outline-offset: var(--ddd-focus-offset);
      }
      .frame-body {
        display: block;
      }
      .frame-body canvas {
        display: block;
        max-width: 100%;
      }
      /* the player fills the screen; Unity follows the canvas size */
      .frame-body:fullscreen {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--ddd-theme-default-coalyGray);
      }
      .frame-body:fullscreen canvas {
        width: 100% !important;
        height: 100% !important;
      }
    </style>
    <div class="frame" role="group" aria-labelledby="label">
      <div class="frame-header">
        <span class="frame-chip" aria-hidden="true"><simple-icon-lite icon="hardware:videogame-asset"></simple-icon-lite></span>
        <span class="frame-label" id="label">${this._escape(this._label)}</span>
        ${
          this._canFullscreen
            ? `<button class="frame-open" type="button" aria-label="${this._escape(
                this._fullscreenLabel,
              )}" title="${this._escape(
                this._fullscreenLabel,
              )}" aria-pressed="${
                this._fullscreen ? "true" : "false"
              }"><simple-icon-lite icon="${
                this._fullscreen ? "icons:fullscreen-exit" : "icons:fullscreen"
              }" aria-hidden="true"></simple-icon-lite></button>`
            : ""
        }
      </div>
      <div class="frame-body">
        <canvas role="img" aria-label="Unity WebGL player" style="width: ${this.width}; height: ${this.height}; background: ${this.background}"></canvas>
      </div>
    </div>`;
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    if (globalThis.ShadyCSS) {
      globalThis.ShadyCSS.styleElement(this);
    }
    // set initial values based on attributes in dom node
    ATTRS.forEach((a) => {
      this[a] = this.getAttribute(a);
    });
    if (globalThis.document) {
      globalThis.document.addEventListener(
        "fullscreenchange",
        this._fullscreenChanged,
      );
    }
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    if (globalThis.document) {
      globalThis.document.removeEventListener(
        "fullscreenchange",
        this._fullscreenChanged,
      );
    }
  }
  /**
   * Render / rerender the shadowRoot
   */
  render() {
    this.shadowRoot.innerHTML = null;
    this.template.innerHTML = this.html;

    if (globalThis.ShadyCSS) {
      globalThis.ShadyCSS.prepareTemplate(this.template, this.constructor.tag);
    }
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
    const fullscreenButton = this.shadowRoot.querySelector(".frame-open");
    if (fullscreenButton) {
      fullscreenButton.addEventListener("click", this._toggleFullscreen);
    }
    let script = globalThis.document.createElement("script");
    script.onload = () => {
      // do stuff with the script
      createUnityInstance(this.shadowRoot.querySelector("canvas"), {
        dataUrl: this.target + ".data." + this.compression,
        frameworkUrl: this.target + ".framework.js." + this.compression,
        codeUrl: this.target + ".wasm." + this.compression,
        streamingAssetsUrl: this.streamingurl,
        company_name: this.companyname,
        product_name: this.productname,
        product_version: this.productversion,
      });
    };
    script.src = this.target + ".loader.js";
    this.shadowRoot.appendChild(script);
    script.onerror = function () {
      console.log("Error loading " + this.src);
    };
  }

  static get observedAttributes() {
    // const set above
    return ATTRS;
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (this.shadowRoot && newValue && oldValue != newValue) {
      clearTimeout(this._debounce);
      this._debounce = setTimeout(() => {
        this.render();
      }, 0);
    }
  }

  set target(val) {
    this.setAttribute("target", val);
  }
  set compression(val) {
    this.setAttribute("compression", val);
  }
  set streamingurl(val) {
    this.setAttribute("streamingurl", val);
  }
  set companyname(val) {
    this.setAttribute("companyname", val);
  }
  set productname(val) {
    this.setAttribute("productname", val);
  }
  set productversion(val) {
    this.setAttribute("productversion", val);
  }
  set width(val) {
    this.setAttribute("width", val);
  }
  set height(val) {
    this.setAttribute("height", val);
  }
  set background(val) {
    this.setAttribute("background", val);
  }

  get target() {
    return this.getAttribute("target");
  }
  get compression() {
    return this.getAttribute("compression");
  }
  get streamingurl() {
    return this.getAttribute("streamingurl");
  }
  get companyname() {
    return this.getAttribute("companyname");
  }
  get productname() {
    return this.getAttribute("productname");
  }
  get productversion() {
    return this.getAttribute("productversion");
  }
  get width() {
    return this.getAttribute("width");
  }
  get height() {
    return this.getAttribute("height");
  }
  get background() {
    return this.getAttribute("background");
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}
globalThis.customElements.define(UnityWebgl.tag, UnityWebgl);
export { UnityWebgl };
