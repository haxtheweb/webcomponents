/**
 * Copyright 2021
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
//import { ESGlobalBridgeStore } from "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
//import { javascriptBarcodeReader } from "https://cdn.skypack.dev/javascript-barcode-reader";
import { MultiFormatReader, BarcodeFormat} from '@zxing/library';
import * as ZXing from '@zxing/library';

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
        visibility: visible;
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
        <video id="video" width="640" height="480" muted autoplay playsinline />
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
    await sleep(1000) //Best delay function I could find
    if(this.__video.videoWidth > 0) {
      this._drawFrame(this.__video);
    }
    this.__animationFrameId = requestAnimationFrame(this._onFrame.bind(this));
  };

  _drawFrame(frameData) {
    this.__context.drawImage(frameData, 0, 0, 640, 480, 0, 0, 640, 480);
    this._processFrame().then(r => console.log("Hit draw frame promise#1"));
  }

  /*capture()
  {
    const canvas = document.getElementById('canvas');
    const video = document.getElementById('video');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    canvas.toBlob() = (blob) => {
      const img = new Image();
      img.src = window.URL.createObjectUrl(blob);
    };
  }*/

  async _processFrame() {


    console.log("Hit draw frame promise#2:");
    console.log("Hit Process Frame"+new Date().getTime());
    //take an img, then process

    const codeReader = new ZXing.BrowserBarcodeReader()
    console.log('ZXing code reader initialized#Only')
    const imgCanvas = this.shadowRoot.querySelector("#canvas");
    const img = imgCanvas.getContext("2d");
    this.decodeFun(img);

     /**let selectedDeviceId;

      codeReader.getVideoInputDevices()
        .then((videoInputDevices) => {
          const sourceSelect = this.shadowRoot.querySelector('#sourceSelect')
          console.log('source'+sourceSelect)
          selectedDeviceId = videoInputDevices[0].deviceId
          if (videoInputDevices.length > 1) {
            videoInputDevices.forEach((element) => {
              const sourceOption = this.shadowRoot.querySelector('#option')
              sourceOption.text = element.label
              sourceOption.value = element.deviceId
              sourceSelect.appendChild(sourceOption)
            })

            sourceSelect.onchange = () => {
              selectedDeviceId = sourceSelect.value;
            }

            const sourceSelectPanel = this.shadowRoot.querySelector('sourceSelectPanel')
            sourceSelectPanel.style.display = 'block'
          }

          this.shadowRoot.querySelector('#startButton').addEventListener('click', () => {
            codeReader.decodeOnceFromVideoDevice(false, video).then((result) => {
              console.log(result)
              this.shadowRoot.querySelector('#result').textContent = result.text
            }).catch((err) => {
              console.error(err)
              this.shadowRoot.querySelector('#result').textContent = err
            })
            console.log(`Started continous decode from camera with id ${selectedDeviceId}`)
          })

          this.shadowRoot.querySelector('#resetButton').addEventListener('click', () => {
            this.shadowRoot.querySelector('#result').textContent = '';
            codeReader.reset();
            console.log('Reset.')
          })

        })
        .catch((err) => {
          console.error(err)
        })
    /**
    const hints = new Map();
    const formats = [BarcodeFormat.QR_CODE, BarcodeFormat.DATA_MATRIX];

    hints.set(zxing.POSSIBLE_FORMATS, formats);

    const reader = new MultiFormatReader();

    reader.setHints(hints);

    const luminanceSource = new zxing(imgByteArray, 640, 480);
    const binaryBitmap = new zxing(new zxing(luminanceSource));

    reader.decode(binaryBitmap);




    const codeReader = new ZXing.BrowserBarcodeReader();

    console.log('ZXing code reader initialized');

    const decodeFun = (e) => {

      /**const parent = e.target.parentNode.parentNode;
      const img = parent.getElementsByClassName('img')[0].cloneNode(true);
      const resultEl = parent.getElementsByClassName('result')[0];
      const img = this.__context.getImageData(0, 0, 640, 480);

      codeReader.decodeFromImage(img)
        .then(result => {
          console.log(result);
          resultEl.textContent = result.text;
        })
        .catch(err => {
          console.error(err);
          resultEl.textContent = err;
        });

      console.log(`Started decode for image from ${img.src}`)
    };

    for (const element of document.getElementsByClassName('decodeButton')) {
      element.addEventListener('click', decodeFun, false);
    }

    /**if(!this.__jobProcessingFrame) {
      this.__jobProcessingFrame = true;

      const imageData = this.__context.getImageData(0, 0, 640, 480);
      const data = await this.__barcodeProxy.detect(imageData); //Unhandled Promise Rejection: TypeError: undefined is not an object
      if (data) {
        this.dispatchEvent(new CustomEvent('barcodes-found', {
          bubbles: true,
          composed: true,
          detail: {
            barcodes: data
          }
        }));
      }
      this.__jobProcessingFrame = false;
    }*/
  }

  async start() {
    // bigger video = more memory = more OOM on constrained devices
    const constraints = {
      'audio': false,
      'video': {
        width: { min: 640, ideal: 640, max: 1280 },
        height: { min: 480, ideal: 480, max: 720 },
        facingMode: {
          exact: 'environment',
        }
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
decodeFun(img)
{
  console.log("DecodeFun")
  codeReader.decodeFromImage(img)
    .then(result => {
      console.log("Result:"+result);
      resultEl.textContent = result.text;
    })
    .catch(err => {
      console.error(err);
      resultEl.textContent = err;
    });

  console.log(`Started decode for image from ${img.src}`)
}

}
customElements.define(BarcodeReader.tag, BarcodeReader);
export { BarcodeReader };
