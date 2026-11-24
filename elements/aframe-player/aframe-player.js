/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import "@haxtheweb/es-global-bridge/es-global-bridge.js";
import { HaxConsentController } from "@haxtheweb/hax-consent-gate/lib/hax-consent-embeds.js";

// the A-Frame release this player drives
const AFRAME_URL = "https://aframe.io/releases/0.9.2/aframe.min.js";
/**
 * `aframe-player`
 * `A wrapper to do data binding into aframe`
 *
 * Privacy: the A-Frame library comes from aframe.io, so neither it nor the
 * scene loads until the visitor allows the "aframe" service in HaxConsent;
 * a hax-consent-gate panel stands in the scene's place until then.
 *
 * @demo demo/index.html
 * @element aframe-player
 */
class AframePlayer extends SchemaBehaviors(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          position: relative;
        }
        .a-hidden {
          display: hidden;
        }
      `,
    ];
  }
  render() {
    if (!this._consent.allowed) {
      return html`<div style="width:${this.width};max-width:100%;">
        ${this._consent.gate({ aspect: this._aspect() })}
      </div>`;
    }
    return html`
      <a-scene
        id="scene"
        class="embedded"
        embedded
        ?arjs="${this.ar}"
        style="height:${this.height};width:${this.width};"
      >
        <a-sky color="${this.skyColor}"></a-sky>
        <a-marker-camera preset="hiro"></a-marker-camera>
      </a-scene>
    `;
  }

  static get tag() {
    return "aframe-player";
  }
  constructor() {
    super();
    this.windowControllers = new AbortController();
    this.course = "";
    this.height = "480px";
    this.width = "640px";
    this.skyColor = "#DCDCDC";
    this.ar = false;
    this.x = "0";
    this.y = "0";
    this.z = "0";
    this.position = {};
    this._consent = new HaxConsentController(this, () => AFRAME_URL);
  }
  /**
   * The scene's shape for the consent panel, when width and height are
   * plain pixel sizes
   */
  _aspect() {
    const w = parseFloat(this.width);
    const h = parseFloat(this.height);
    return w > 0 && h > 0 && /px$/.test(this.width) && /px$/.test(this.height)
      ? `${w} / ${h}`
      : "16 / 9";
  }
  updated(changedProperties) {
    // the library loads once the scene is drawn, which waits for consent
    if (!this._consent.allowed) {
      // the scene left with the choice; a later allow draws a new one
      this.__entity = undefined;
    } else if (globalThis.AFRAME) {
      this._aframeLoaded();
    } else if (!this.__aframeRequested) {
      this.__aframeRequested = true;
      globalThis.ESGlobalBridge.requestAvailability().load(
        "aframePlayer",
        AFRAME_URL,
      );
    }
    changedProperties.forEach((oldValue, propName) => {
      if (["x", "y", "z", "width", "height"].includes(propName)) {
        this.position = this._computePosition(
          this.x,
          this.y,
          this.z,
          this.width,
          this.height,
        );
      }
      if (propName == "position") {
        this._positionChanged(this[propName]);
      }
    });
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * Source to reference for the 3D object
       */
      source: {
        type: String,
      },
      /**
       * height of the element
       */
      height: {
        type: String,
      },
      /**
       * width of the element
       */
      width: {
        type: String,
      },
      /**
       * Color of the sky / background.
       */
      skyColor: {
        type: String,
        attribute: "sky-color",
      },
      /**
       * If this is for augmented reality or not.
       */
      ar: {
        type: Boolean,
      },
      /**
       * x position for the AR element.
       */
      x: {
        type: String,
      },
      /**
       * y position for the AR element.
       */
      y: {
        type: String,
      },
      /**
       * z position for the AR element.
       */
      z: {
        type: String,
      },
      /**
       * Generate a position object when coordinates change.
       */
      position: {
        type: Object,
      },
    };
  }
  createRenderRoot() {
    return this;
  }
  disconnectedCallback() {
    this.windowControllers.abort();
    super.disconnectedCallback();
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
  /**
   * Attached.
   */
  connectedCallback() {
    super.connectedCallback();
    // security follow-up: this third-party script is loaded through
    // ESGlobalBridge without Subresource Integrity. Add an integrity hash
    // (sha384 of the exact pinned release, computed with
    // curl URL | openssl dgst -sha384 -binary | openssl base64 -A) once the
    // bridge accepts one; not added here because aframe.io was unreachable
    // from the audit sandbox and a guessed hash would break the player.
    if (typeof TWEEN === "object") this._aframeLoaded.bind(this);
    // a fresh controller: the one in the constructor is spent once this
    // element has been removed and put back
    if (this.windowControllers.signal.aborted) {
      this.windowControllers = new AbortController();
    }
    globalThis.addEventListener(
      "es-bridge-aframePlayer-loaded",
      this._aframeLoaded.bind(this),
      { signal: this.windowControllers.signal },
    );
  }

  _aframeLoaded(_el) {
    const scene = this.querySelector("#scene");
    if (!scene || this.__entity) {
      return;
    }
    // ensure that this doesn't put full screen styles on the page!
    scene.removeFullScreenStyles();
    this.__entity = globalThis.document.createElement("a-entity");
    this.__entity.setAttribute("gltf-model", "url(" + this.source + ")");
    this._positionChanged(this.position);
    scene.appendChild(this.__entity);
  }

  /**
   * Generate position object based on format a-frame expects.
   */
  _computePosition(x, y, z, _width, _height) {
    return {
      x: x,
      y: y,
      z: z,
    };
  }

  /**
   * When position is updated, inject this into a-frame tag.
   */
  _positionChanged(position) {
    if (this.__entity !== undefined)
      this.__entity.setAttribute("position", position);
  }
}
globalThis.customElements.define(AframePlayer.tag, AframePlayer);
export { AframePlayer };
