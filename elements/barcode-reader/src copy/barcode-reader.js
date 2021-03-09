/**
 * Copyright 2021
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import javascriptBarcodeReader from "javascript-barcode-reader";

/**
 * `barcode-reader`
 * `Camera input to read barcodes`
 * @demo demo/index.html
 * @element barcode-reader
 * Amalgamation of https://github.com/justinribeiro/barcode-reader/blob/master/barcode-reader.js for taking images
 * & https://codesandbox.io/s/javascript-barcode-reader-liium for image processing
 */
class BarcodeReader extends LitElement {
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.useable = false; //Allowed to use camera
    this.cam = false; //If a camera exists
  }
  /**
   * LitElement style callback
   */
  static get styles() {
    // support for using in other classes
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [
      ...styles,
      /**css`
      :host {
        display: block;
        position: relative;
      }
      canvas {
        display:none;
      }
      video {
        width: 100%;
        height: 100%;
      }
      #overlay {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: transparent;
        border-style: solid;
        border-color: rgba(0, 0, 0, 0.5);
        pointer-events: none;
        z-index: 20;
        border-width: 2em;
      }
      #scanline {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        visibility: visible;
        background: linear-gradient(to bottom, transparent 51%, red 51%, transparent 52%)
      }
    `,**/
    ];
  }
  /**
   * LitElement render callback
   * Visual
   */
  render() {
    return html`<p>Test</p>`;
    /**return html`
      <div id="overlay">
        <div id="scanline"></div>
      </div>
      <canvas width="640" height="480"></canvas>
      <video width="640" height="480" muted autoplay playsinline/>
      <div id="app">Barcode: <span id="barcode-title">...</span></div>
      <div>
        <input type="text" id="result-code"><br>
        <input type="submit" id="submit-code" value="Submit">
        <input type="reset">
      </div>
    `;*/
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "barcode-reader";
  }
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    this.__context = this.shadowRoot.querySelector("canvas").getContext("2d");
    this.__video = this.shadowRoot.querySelector("video");
    this.__videoInputSelector = this.shadowRoot.querySelector("#videoInput");
  }
  _onFrame() {
    if (this.__video.videoWidth > 0) {
      this._drawFrame(this.__video);
    }
    this.__animationFrameId = requestAnimationFrame(this._onFrame.bind(this));
  }

  _drawFrame(frameData) {
    this.__context.drawImage(frameData, 0, 0, 640, 480, 0, 0, 640, 480);
    this._processFrame();
  }

  async _processFrame() {
    if (!this.__jobProcessingFrame) {
      this.__jobProcessingFrame = true;

      const imageData = this.__context.getImageData(0, 0, 640, 480);
      const data = await this.__barcodeProxy.detect(imageData);
      if (data) {
        this.dispatchEvent(
          new CustomEvent("barcodes-found", {
            bubbles: true,
            composed: true,
            detail: {
              barcodes: data,
            },
          })
        );
      }
      let image = new Image();
      image.crossOrigin = "Anonymous";
      image.src = "./code-93.jpg";
      image.onload = function () {
        javascriptBarcodeReader({
          image: image,
          barcode: "code-93",
        })
          .then((result) => {
            document.getElementById("barcode-title").innerHTML = result;
          })
          .catch(console.log);
      };
      this.__jobProcessingFrame = false;
    }
  }

  async start() {
    // bigger video = more memory = more OOM on constrained devices
    const constraints = {
      audio: false,
      video: {
        width: { min: 640, ideal: 640, max: 1280 },
        height: { min: 480, ideal: 480, max: 720 },
        facingMode: {
          exact: "environment",
        },
      },
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    this.__video.addEventListener("loadeddata", (e) => {
      this.__animationFrameId = requestAnimationFrame(this._onFrame.bind(this));
    });

    this.__video.srcObject = stream;
    this.__stream = stream;
  }

  stop() {
    this.__stream.getTracks()[0].stop();
  }

  /**
   * Just making a new method to work in
   */
  read() {
    if (
      "mediaDevices" in navigator &&
      "getUserMedia" in navigator.mediaDevices
    ) {
      console.log("Let's get this party started");
      navigator.mediaDevices.getUserMedia({ video: true }); //.then(r =>{} )
    }
  }

  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {});
  }
}
customElements.define(BarcodeReader.tag, BarcodeReader);
export { BarcodeReader };
