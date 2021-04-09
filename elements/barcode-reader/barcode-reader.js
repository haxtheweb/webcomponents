/**
 * Copyright 2021
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
//import { BrowserQRCodeReader } from '@zxing/browser';
var vid;
/**
 * `barcode-reader`
 * `Reads barcodes`
 * @demo demo/index.html
 * @element barcode-reader
 * Amalgamation of https://github.com/justinribeiro/barcode-reader/blob/master/barcode-reader.js for LitElement & render
 * & https://github.com/zxing-js for img processing.
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
        display: none;
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
        background: linear-gradient(
          to bottom,
          transparent 51%,
          red 51%,
          transparent 52%
        );
      }
    `;
  }

  /**
   * LitElement render callback
   */
  render() {
    return html`
      <!--<div>
        <div id="overlay">
          <div id="scanline"></div>
        </div>
        <canvas id="canvas" width="640" height="480"></canvas>
        <video id="video" width="640" height="480" muted autoplay playsinline/>
      </div>
      <pre><code id="result"></code></pre>
      <div>
        <a class="button" id="startButton">Start</a>
        <a class="button" id="resetButton">Reset</a>
        <p id="result">Result:</p>
      </div>-->
      <br /><br /><br /><br /><br /><br />
      <h1>Pure JS Barcode Reader</h1>
      <div>Barcode result: <span id="dbr"></span></div>
      <div class="select">
        <label for="videoSource">Video source: </label
        ><select id="videoSource"></select>
      </div>
      <button id="go">Read Barcode</button>
      <div>
        <video muted autoplay id="video" playsinline="true"></video>
        <canvas
          id="canvas"
          width="640"
          height="480"
          style="display: none; float: bottom;"
        ></canvas>
      </div>
    `;
  }

  constructor() {
    super();
    window.ESGlobalBridge.requestAvailability();
    window.ESGlobalBridge.instance.load(
      "ZXing",
      decodeURIComponent(import.meta.url) + "/../lib/zxing.js"
    );
    window.addEventListener(`es-bridge-zxing-loaded`, this._control.bind(this));
  }

  _control() {
    let videoElement = this.shadowRoot.querySelector("#video");
    let canvas = this.shadowRoot.querySelector("#canvas");
    let ctx = canvas.getContext("2d");
    var videoSelect = this.shadowRoot.querySelector("select#videoSource");
    let videoOption = this.shadowRoot.getElementById("videoOption");
    let buttonGo = this.shadowRoot.getElementById("go");
    let barcode_result = this.shadowRoot.getElementById("dbr");

    let isPaused = false;
    let videoWidth = 640,
      videoHeight = 480;
    let mobileVideoWidth = 240,
      mobileVideoHeight = 320;
    let isPC = true;

    let ZXing = null;
    let decodePtr = null;

    var tick = function () {
      console.log("tick");
      if (window.ZXing) {
        console.log("loaded zxing instance");
        ZXing = new window.ZXing();
        decodePtr = ZXing.Runtime.addFunction(decodeCallback);
      } else {
        setTimeout(tick, 100);
      }
    };
    tick();

    var decodeCallback = function (ptr, len, resultIndex, resultCount) {
      console.log("decodeCallback");
      var result = new Uint8Array(ZXing.HEAPU8.buffer, ptr, len);
      console.log(String.fromCharCode.apply(null, result));
      barcode_result.textContent = String.fromCharCode.apply(null, result);
      buttonGo.disabled = false;
      if (isPC) {
        canvas.style.display = "block";
      } else {
        mobileCanvas.style.display = "block";
      }
    };

    // check devices
    function browserRedirect() {
      console.log("browserRedirect");
      var deviceType;
      var sUserAgent = navigator.userAgent.toLowerCase();
      var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
      var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
      var bIsMidp = sUserAgent.match(/midp/i) == "midp";
      var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
      var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
      var bIsAndroid = sUserAgent.match(/android/i) == "android";
      var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
      var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
      if (
        bIsIpad ||
        bIsIphoneOs ||
        bIsMidp ||
        bIsUc7 ||
        bIsUc ||
        bIsAndroid ||
        bIsCE ||
        bIsWM
      ) {
        deviceType = "phone";
      } else {
        deviceType = "pc";
      }
      return deviceType;
    }

    if (browserRedirect() == "pc") {
      isPC = true;
    } else {
      isPC = false;
    }

    // stackoverflow: http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata/5100158
    function dataURItoBlob(dataURI) {
      console.log("dataURItoBlob");
      // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString;
      if (dataURI.split(",")[0].indexOf("base64") >= 0)
        byteString = atob(dataURI.split(",")[1]);
      else byteString = unescape(dataURI.split(",")[1]);

      // separate out the mime component
      var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ia], {
        type: mimeString,
      });
    }

    // add button event
    buttonGo.onclick = function () {
      console.log("Click");
      if (isPC) {
        canvas.style.display = "none";
      } else {
        mobileCanvas.style.display = "none";
      }

      isPaused = false;
      scanBarcode();
      buttonGo.disabled = true;
    };

    // scan barcode
    function scanBarcode() {
      console.log("scanBarcode");
      barcode_result.textContent = "";
      if (ZXing == null) {
        buttonGo.disabled = false;
        alert("Barcode Reader is not ready!");
        return;
      }

      var data = null,
        context = null,
        width = 0,
        height = 0,
        dbrCanvas = null;

      if (isPC) {
        context = ctx;
        width = videoWidth;
        height = videoHeight;
        dbrCanvas = canvas;
      } else {
        context = mobileCtx;
        width = mobileVideoWidth;
        height = mobileVideoHeight;
        dbrCanvas = mobileCanvas;
      }

      context.drawImage(videoElement, 0, 0, width, height);

      var barcodeCanvas = document.createElement("canvas");
      barcodeCanvas.width = vid.videoWidth;
      barcodeCanvas.height = vid.videoHeight;
      var barcodeContext = barcodeCanvas.getContext("2d");
      var imageWidth = vid.videoWidth,
        imageHeight = vid.videoHeight;
      barcodeContext.drawImage(videoElement, 0, 0, imageWidth, imageHeight);
      // read barcode
      var imageData = barcodeContext.getImageData(
        0,
        0,
        imageWidth,
        imageHeight
      );
      var idd = imageData.data;
      var image = ZXing._resize(imageWidth, imageHeight);
      console.time("decode barcode");
      for (var i = 0, j = 0; i < idd.length; i += 4, j++) {
        ZXing.HEAPU8[image + j] = idd[i];
      }
      var err = ZXing._decode_any(decodePtr);
      console.timeEnd("decode barcode");
      console.log("error code", err);
      if (err == -2) {
        setTimeout(scanBarcode, 30);
      }
    }
    // https://github.com/samdutton/simpl/tree/gh-pages/getusermedia/sources
    var videoSelect = this.shadowRoot.querySelector("select#videoSource");

    navigator.mediaDevices
      .enumerateDevices()
      .then(gotDevices)
      .then(getStream)
      .catch(handleError);

    videoSelect.onchange = getStream;

    function gotDevices(deviceInfos) {
      console.log("gotDevices");
      for (var i = deviceInfos.length - 1; i >= 0; --i) {
        var deviceInfo = deviceInfos[i];
        var option = document.createElement("option");
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === "videoinput") {
          option.text =
            deviceInfo.label || "camera " + (videoSelect.length + 1);
          videoSelect.appendChild(option);
        } else {
          console.log("Found one other kind of source/device: ", deviceInfo);
        }
      }
    }

    function getStream() {
      console.log("getStream");
      buttonGo.disabled = false;
      if (window.stream) {
        window.stream.getTracks().forEach(function (track) {
          track.stop();
        });
      }

      var constraints = {
        video: {
          deviceId: { exact: videoSelect.value },
        },
      };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(gotStream)
        .catch(handleError);
    }

    function gotStream(stream) {
      console.log("gotStream");
      window.stream = stream; // make stream available to console
      videoElement.srcObject = stream;
    }

    function handleError(error) {
      console.log("handleError");
      console.log("Error: ", error);
    }
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
    this.start().then((r) => console.log("Hit"));
    this.__context = this.shadowRoot.querySelector("canvas").getContext("2d");
    this.__video = this.shadowRoot.querySelector("video");
    this.__videoInputSelector = this.shadowRoot.querySelector("#videoInput");
    vid = this.shadowRoot.getElementById("video");
  }

  async _onFrame() {
    const sleep = (delay) =>
      new Promise((resolve) => setTimeout(resolve, delay));
    await sleep(5000); //Best delay function I could find
    if (this.__video.videoWidth > 0) {
      this._drawFrame(this.__video);
    }
    this.__animationFrameId = requestAnimationFrame(this._onFrame.bind(this));
  }

  _drawFrame(frameData) {
    this.__context.drawImage(frameData, 0, 0, 640, 480, 0, 0, 640, 480);
    this._processFrame().then((r) => console.log("Hit draw frame promise#1"));
  }

  async _processFrame() {
    console.log("Hit Process Frame");

    const sourceElem = this.shadowRoot.querySelector("#video");
    //const devices = await navigator.mediaDevices.enumerateDevices();
    //console.log(devices);
    //console.log(devices[3].toString());
    //console.log(devices[3].toString().includes("video"));
    //const videoDevices = devices.filter(device => device.kind === 'videoinput');
    //console.log(videoDevices[0]);
    //console.log(videoDevices[0].deviceId);
    //console.log(videoDevices[3].toString());
    // choose your media device (webcam, frontal camera, back camera, etc.)
    //const selectedDeviceId = videoDevices[0].deviceId;
    //console.log("ID:"+selectedDeviceId);

    console.log("After hit");
  }

  async start() {
    this._control();
    // bigger video = more memory = more OOM on constrained devices
    const constraints = {
      audio: false,
      video: {
        width: { min: 640, ideal: 640, max: 1280 },
        height: { min: 480, ideal: 480, max: 720 },
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
}
customElements.define(BarcodeReader.tag, BarcodeReader);
export { BarcodeReader };
