/**
 * Copyright 2021
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
//import { ESGlobalBridgeStore } from "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
//import { javascriptBarcodeReader } from "https://cdn.skypack.dev/javascript-barcode-reader";
import { MultiFormatReader, BarcodeFormat} from '@zxing/library';
import * as ZXing from '@zxing/library';
import * as ZXingBrowser from '@zxing/browser';
import { BrowserQRCodeReader } from '@zxing/browser';

/**
 * `barcode-reader`
 * `Reads barcodes`
 * @demo demo/index.html
 * @element barcode-reader
 * Amalgamation of https://github.com/justinribeiro/barcode-reader/blob/master/barcode-reader.js for LitElement & render
 * & https://github.com/zxing-js/library for img processing.
 */
class BarcodeReader extends LitElement {
  /**
   * LitElement style callback
   */
  static get styles() {
    return css`
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
        visibility: hidden;
        background: linear-gradient(to bottom, transparent 51%, red 51%, transparent 52%)
      }
    `;
  }

  /**
   * LitElement render callback
   */
  render() {
    return html`
      <div>
        <div id="overlay">
          <div id="scanline"></div>
        </div>
        <canvas id="canvas" width="640" height="480"></canvas>
        <video id="video" width="640" height="480" muted autoplay playsinline/>
      </div>
      <!--<pre><code id="result"></code></pre>-->
      <div>
        <a class="button" id="startButton">Start</a>
        <a class="button" id="resetButton">Reset</a>
        <p id="result">Result:</p>
      </div>
    `;
  }

  constructor() {
    super();

    this.__context = null;
    this.__video = null;
    // Module scripts are not supported on DedicatedWorker yet. You can try the
    // feature with '--enable-experimental-web-platform-features' flag (see
    // https://crbug.com/680046)
    //
    // This path is also specific to the demo/index.html; have to fix
    //this.__barcodeProxy = Comlink.proxy(new Worker('../barcode-worker.js', { type: "module" }));
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
  firstUpdated() {
    this.start().then(r => console.log('Hit'));
    this.__context = this.shadowRoot.querySelector('canvas').getContext('2d');
    this.__video = this.shadowRoot.querySelector('video');
    this.__videoInputSelector = this.shadowRoot.querySelector('#videoInput');
  }

  async _onFrame() {
    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
    await sleep(5000) //Best delay function I could find
    if(this.__video.videoWidth > 0) {
      this._drawFrame(this.__video);
    }
    this.__animationFrameId = requestAnimationFrame(this._onFrame.bind(this));
  };

  _drawFrame(frameData) {
    this.__context.drawImage(frameData, 0, 0, 640, 480, 0, 0, 640, 480);
    this._processFrame().then(r => console.log("Hit draw frame promise#1"));
  }

  async _processFrame() {
    console.log("Hit draw frame promise#2:");
    //console.log("Hit Process Frame"+new Date().getTime());
    //take an img, then process

    console.log('ZXing code reader initialized')
    const codeReader = new BrowserQRCodeReader();
    const sourceElem = this.shadowRoot.querySelector('#video');
    //or use decodeFromVideoElement for videos
    //console.log(sourceElem);
    //Bad hit:ArgumentException: `callbackFn` is a required parameter, you cannot capture results without it.
    //Unhandled Promise Rejection: TypeError: undefined is not an object (evaluating 'BrowserQRCodeReader.BrowserCodeReader.listVideoInputDevices')
    //const videoInputDevices = await codeReader.BrowserCodeReader.listVideoInputDevices();
    //const codeReader = new BrowserQRCodeReader();

    //const videoInputDevices = await ZXingBrowser.BrowserCodeReader.listVideoInputDevices();

    //choose your media device (webcam, frontal camera, back camera, etc.)
    //const selectedDeviceId = videoInputDevices[0].deviceId;
    //console.log(`Started decode from camera with id ${selectedDeviceId}`);

    const previewElem = this.shadowRoot.querySelector('#video');
    console.log(previewElem);

    // you can use the controls to stop() the scan or switchTorch() if available
    const controls = await codeReader.decodeFromVideoElement(previewElem, (result, error, controls) => {
      console.log(controls)
      console.log(result);
      console.log(error);
    });

    // stops scanning after 20 seconds
    setTimeout(() => controls.stop(), 10000);
    /**const devices = await navigator.mediaDevices.enumerateDevices();
    //console.log(devices);
    //console.log(devices[3].toString());
    //console.log(devices[3].toString().includes("video"));
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    //console.log(videoDevices[0]);
    //console.log(videoDevices[0].deviceId);
    //console.log(videoDevices[3].toString());
    // choose your media device (webcam, frontal camera, back camera, etc.)
    const selectedDeviceId = videoDevices[0].deviceId;
    //console.log("ID:"+selectedDeviceId);

    console.log(`Started decode from camera with id ${selectedDeviceId}`);

    const controls = await codeReader.decodeFromVideoDevice(selectedDeviceId, sourceElem, (result, error, controls)=>
    {
      console.log(result+":"+error);
      if(typeof result != "undefined")
      {
        console.log("Good hit: "+result);
      }
      else
      {
        console.log("Error: "+error);
      }
      console.log("Controls"+controls);
    });
      //.then(result=>{console.log("Good hit:"+result);},err=>{console.log("Bad hit:"+err);});

    console.log("After process");
    //console.log(resultVideo+":Result");
    setTimeout(() => controls.stop(), 20000);

    /**const canvas = this.shadowRoot.querySelector("canvas");
    //const img = canvas.toDataURL("image/jpeg", 1.0);
    const resultEl = this.shadowRoot.querySelector('#result');

    const codeReader = new BrowserQRCodeReader();
    console.log("DecodeFun")
    codeReader.decodeFromCanvas(canvas)
      .then(result => {
        console.log("Result:"+result);
        resultEl.textContent = result.text;
      })
      .catch(err => {
        console.error(err);
        resultEl.textContent = err;
      });*/
    console.log("After hit")
  }

  async start() {
    // bigger video = more memory = more OOM on constrained devices
    const constraints = {
      'audio': false,
      'video': {
        width: { min: 640, ideal: 640, max: 1280 },
        height: { min: 480, ideal: 480, max: 720 }
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    this.__video.addEventListener('loadeddata', (e) => {
      this.__animationFrameId = requestAnimationFrame(this._onFrame.bind(this));
    });

    this.__video.srcObject = stream;
    this.__stream = stream;
  }

  stop() {
    this.__stream.getTracks()[0].stop();
  }


}
customElements.define(BarcodeReader.tag, BarcodeReader);
export { BarcodeReader };
