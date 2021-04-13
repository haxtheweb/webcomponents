/**
 * Copyright 2021
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
var vid;
/**
 * `barcode-reader`
 * `Element to read barcodes and QR codes through a video stream`
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
        bottom: 70px;
        right: 0;
        background-color: transparent;
        border-style: solid;
        border-color: rgba(0, 0, 0, 0.5);
        pointer-events: none;
        z-index: 20;
        border-width: 2em;
      }

      #hidden {
        display: none;
      }
      #hidden2 {
        display: none;
      }
    `;
  }
  static get properties() {
    return {
      value: {
        type: String,
        reflect: true,
      },
    };
  }

  /**
   * LitElement render callback
   */
  render() {
    return html`
      <div id="hidden">
        <div id="overlay"></div>
        <div>
          <video muted autoplay id="video" playsinline="true"></video>
          <canvas
            id="canvas"
            width="640"
            height="480"
            style="display: none; float: bottom;"
          ></canvas>
        </div>
      </div>
      <div>
        Result: <span><input type="text" .value="${this.value}" /> </span
        ><button id="render">Show scanner</button>
      </div>
      <div id="hidden2">
        <div class="select">
          <label for="videoSource">Video source: </label>
          <select id="videoSource"></select>
        </div>
        <button id="go">Scan</button>
      </div>
    `;
  }

  //Ask for video when show scanner button
  // Set default for input arg
  // Add args for screen size

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

    let isPaused = false;
    let videoWidth = 640,
      videoHeight = 480;
    let mobileVideoWidth = 240,
      mobileVideoHeight = 320;
    let isPC = true;

    let ZXing = null;
    let decodePtr = null;

    var tick = function () {
      if (window.ZXing) {
        console.log("loaded zxing instance");
        ZXing = new window.ZXing();
        decodePtr = ZXing.Runtime.addFunction(decodeCallback);
      } else {
        setTimeout(tick, 100);
      }
    };
    tick();

    // we got a match!
    var decodeCallback = async (ptr, len, resultIndex, resultCount) => {
      const sleep = (delay) =>
        new Promise((resolve) => setTimeout(resolve, delay));
      await sleep(100);
      var result = new Uint8Array(ZXing.HEAPU8.buffer, ptr, len);
      console.log(String.fromCharCode.apply(null, result));
      this.value = String.fromCharCode.apply(null, result);
      buttonGo.removeAttribute("disabled");
    };

    // check devices
    function browserRedirect() {
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
    function dataURItoBlob(dataURI) {
      var byteString;
      if (dataURI.split(",")[0].indexOf("base64") >= 0)
        byteString = atob(dataURI.split(",")[1]);
      else byteString = unescape(dataURI.split(",")[1]);
      var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ia], {
        type: mimeString,
      });
    }
    buttonGo.onclick = () => {
      console.log("click");
      this.value = "";
      canvas.style.display = "none";
      isPaused = false;
      scanBarcode();
      buttonGo.setAttribute("disabled", "");
    };

    // scan barcode
    function scanBarcode() {
      if (ZXing == null) {
        buttonGo.removeAttribute("disabled");
        alert("Barcode Reader is not ready!");
        return;
      }

      var data = null,
        context = null,
        width = 0,
        height = 0,
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
      }
      context.drawImage(videoElement, 0, 0, width, height);
      var barcodeCanvas = document.createElement("canvas");
      barcodeCanvas.width = vid.videoWidth;
      barcodeCanvas.height = vid.videoHeight;
      var barcodeContext = barcodeCanvas.getContext("2d");
      var imageWidth = vid.videoWidth,
        imageHeight = vid.videoHeight;
      barcodeContext.drawImage(videoElement, 0, 0, imageWidth, imageHeight);
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
      console.log(err);
      if (err == -2) {
        setTimeout(scanBarcode, 30);
      } else if (err == -3) {
        console.error("error code: ", err);
        buttonGo.removeAttribute("disabled");
      } else if (err === 0) {
        buttonGo.removeAttribute("disabled");
        console.log(buttonGo.attributes);
      }
    }
    var videoSelect = this.shadowRoot.querySelector("select#videoSource");
    navigator.mediaDevices
      .enumerateDevices()
      .then(gotDevices)
      .then(getStream)
      .catch(handleError);

    videoSelect.onchange = getStream;

    function gotDevices(deviceInfos) {
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
      buttonGo.removeAttribute("disabled");
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
      window.stream = stream; // make stream available to console
      videoElement.srcObject = stream;
    }

    function handleError(error) {
      console.error("Error: ", error);
    }
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "barcode-reader";
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "value") {
        this.dispatchEvent(
          new CustomEvent("value-changed", {
            detail: this,
          })
        );
      }
    });
  }
  /**
   * LitElement ready
   */
  firstUpdated() {
    this.start().then((r) => console.log());
    this.__context = this.shadowRoot.querySelector("canvas").getContext("2d");
    this.__video = this.shadowRoot.querySelector("video");
    this.__videoInputSelector = this.shadowRoot.querySelector("#videoInput");
    vid = this.shadowRoot.getElementById("video");
    this._renderVideo();
  }

  async _onFrame() {
    if (this.__video.videoWidth > 0) {
      this._drawFrame(this.__video);
    }
    this.__animationFrameId = requestAnimationFrame(this._onFrame.bind(this));
  }

  _drawFrame(frameData) {
    this.__context.drawImage(frameData, 0, 0, 640, 480, 0, 0, 640, 480);
    this._processFrame().then((r) => console.log());
  }

  async start() {
    this._control();
  }
  async _renderVideo() {
    let video = this.shadowRoot.getElementById("hidden");
    let button = this.shadowRoot.getElementById("render");
    let extraButtons = this.shadowRoot.getElementById("hidden2");
    video.style.display = "none";
    this.shadowRoot.getElementById("render").addEventListener("click", () => {
      if (video.style.display === "none") {
        video.style.display = "inline";
        button.innerHTML = "Hide Scanner";
        extraButtons.style.display = "inline";
      } else {
        video.style.display = "none";
        button.innerHTML = "Show Scanner";
        extraButtons.style.display = "none";
      }
    });
  }
}
customElements.define(BarcodeReader.tag, BarcodeReader);
export { BarcodeReader };
