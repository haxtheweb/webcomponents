import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
/**
 * Inspiration from https://github.com/wanoo21/MyCamera
 */
class SimpleLoginCamera extends HTMLElement {
  static get tag() {
    return "simple-login-camera";
  }
  // simple path from a url modifier
  pathFromUrl(url) {
    return url.substring(0, url.lastIndexOf("/") + 1);
  }
  constructor() {
    super();
    if (window.WCGlobalBasePath) {
      this.basePath = window.WCGlobalBasePath;
    } else {
      this.basePath =
        this.pathFromUrl(decodeURIComponent(import.meta.url)) + "../../../";
    }
    const location = `${this.basePath}msr/MediaStreamRecorder.min.js`;
    window.ESGlobalBridge.requestAvailability();
    window.ESGlobalBridge.instance.load("msr", location);
    window.addEventListener("es-bridge-msr-loaded", this._msrLoaded.bind(this));
    this._shadow = this.attachShadow({ mode: "closed" });
    this._shadow.innerHTML = this.html;
    this._video = this._shadow.querySelector("video");
    this._error = this._shadow.querySelector("p");
    this._record = this._shadow.querySelector("button.record");
    this._pauseRecord = this._shadow.querySelector("button.pause-record");
    document.addEventListener(
      "DOMContentLoaded",
      this.documentLoaded.bind(this)
    );
    if (!this.hasAttribute("record")) {
      this._record.remove();
      this._pauseRecord.remove();
    } else {
      this._record.addEventListener("click", () => {
        if (!this._record.hasAttribute("recording")) {
          this._record.innerText = "Stop & Save";
          this._record.setAttribute("recording", "");
          return this._startRecording();
        } else {
          this._record.innerText = "Record";
          this._record.removeAttribute("recording");
          return this._stopRecording();
        }
      });
      this._pauseRecord.addEventListener("click", () => {
        if (!this._pauseRecord.hasAttribute("resume")) {
          this._pauseRecord.innerText = "Resume record";
          this._pauseRecord.setAttribute("resume", "");
          return this._pauseRecording();
        } else {
          this._pauseRecord.innerText = "Pause record";
          this._pauseRecord.removeAttribute("resume");
          return this._resumeRecording();
        }
      });
    }
  }

  static get observedAttributes() {
    return ["autoplay", "controls", "audio"];
  }

  _startRecording() {
    this._pauseRecord.removeAttribute("hidden");
    this.MediaStreamRecorder.start(100);
  }

  _stopRecording() {
    this._pauseRecord.setAttribute("hidden", "");
    this._pauseRecord.removeAttribute("resume");
    this.MediaStreamRecorder.stop();
  }

  _pauseRecording() {
    this._record.setAttribute("disabled", "");
    this.MediaStreamRecorder.pause();
  }

  _resumeRecording() {
    this._record.removeAttribute("disabled");
    this.MediaStreamRecorder.resume();
  }

  _saveVideo(blob) {
    const type = blob.type.split("/").pop();
    this.MediaStreamRecorder.save(
      blob,
      `my-camera-${new Date().toISOString().replace(/:|\./g, "-")}.${type}`
    );
  }

  _cameraStream() {
    if (!navigator.mediaDevices.getUserMedia) {
      return Promise.reject(
        new Error("getUserMedia is not implemented in this browser")
      );
    }
    return navigator.mediaDevices.getUserMedia({
      video: {
        width: { min: 320, ideal: 1280, max: 1920 },
        height: { min: 240, ideal: 720, max: 1080 },
        facingMode: "user",
      },
      audio: this.hasAttribute("audio"),
    });
  }
  takeASnap() {
    const canvas = document.createElement("canvas"); // create a canvas
    const ctx = canvas.getContext("2d"); // get its context
    canvas.width = this._video.videoWidth; // set its size to the one of the video
    canvas.height = this._video.videoHeight;
    ctx.drawImage(this._video, 0, 0); // the video
    return new Promise((res, rej) => {
      canvas.toBlob(res, "image/jpeg"); // request a Blob from the canvas
    });
  }
  renderImage(blob) {
    // uses the <a download> to download a Blob
    let img = document.createElement("img");
    img.src = URL.createObjectURL(blob);
    return img;
  }
  imageBlob(blob) {
    return blob;
  }
  download(blob) {
    // uses the <a download> to download a Blob
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "screenshot.jpg";
    document.body.appendChild(a);
    a.click();
  }
  _addVideoAtributes() {
    this._video.autoplay = this.hasAttribute("autoplay");
    this._video.controls = this.hasAttribute("controls");
  }
  _msrLoaded(e) {
    this._applyMSR();
  }
  async _applyMSR() {
    try {
      this._video.srcObject = await this._cameraStream();
      this._addVideoAtributes();
      if (this.hasAttribute("record")) {
        this.MediaStreamRecorder = new MediaStreamRecorder(
          this._video.srcObject
        );
        // this.MediaStreamRecorder.mimeType = 'video/webm';
        this.MediaStreamRecorder.ondataavailable = this._saveVideo.bind(this);
      }
      this._error.remove();
    } catch (error) {
      this._video.remove();
      this._record.remove();
      this._pauseRecord.remove();
      if (error.name === "ConstraintNotSatisfiedError") {
        this._error.innerText =
          "The resolution is not supported by your device.";
      } else if (error.name === "NotAllowedError") {
        this._error.innerText =
          "Permissions have not been granted to use your camera and " +
          "microphone, you need to allow the page access to your devices in " +
          "order for the demo to work.";
      } else {
        this._error.innerText = error.message;
        throw Error(error);
      }
      // this._shadow.appendChild(this._error);
    }
  }

  connectedCallback() {
    if (window.ESGlobalBridge && window.ESGlobalBridge.imports["msr"]) {
      this._applyMSR();
    }
  }
  /**
   * Try to apply when fully loaded dom
   */
  documentLoaded(e) {
    if (window.ESGlobalBridge && window.ESGlobalBridge.imports["msr"]) {
      this._applyMSR();
    }
  }

  disconnectedCallback() {
    document.removeEventListener(
      "DOMContentLoaded",
      this.documentLoaded.bind(this)
    );
    window.removeEventListener(
      "es-bridge-msr-loaded",
      this._msrLoaded.bind(this)
    );
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // console.log(newValue);
    // console.log(name);
    // console.log(typeof newValue);
    // // if (newValue === '' || newValue === null) return;
    // if (newValue || newValue === null) {
    //   this.setAttribute(name, '');
    // } else {
    //   this.removeAttribute(name);
    // }
    // this._addVideoAtributes();
  }

  get html() {
    return `
      <style>
        :host {
          width: var(--simple-login-camera-width, 200px);
          height: var(--simple-login-camera-height, 200px);
        }
        #wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          position: relative;
          background-color: var(--simple-login-camera-background, var(--background-color, #ccc));
          width: var(--simple-login-camera-width, 200px);
          height: var(--simple-login-camera-height, 200px);
        }
        video {
          width: calc(var(--simple-login-camera-height, 200px) * 16 / 9);
          height: var(--simple-login-camera-height, 200px);
          background-color: rgba(0, 0, 0, 0);
        }
        .error {
          color: var(-simple-login-camera-error, var(--color, red));
          font-size: 1em;
          text-align: center;
        }
        .custom-controls {
          top: 8px;
          right: 8px;
          position: absolute;
        }
        .custom-controls button {
          padding: 8px 10px;
        }
        [hidden] {
          display: none;
        }
      </style>
      <div id="wrapper">
        <video></video>
        <p class="error"></p>
        <div class="custom-controls">
          <button class="record">Record</button>
          <button class="pause-record" hidden>Pause record</button>
        </div>
      </div>
    `;
  }
}
// only show this element if we're on a secure environment
if (navigator.mediaDevices) {
  window.customElements.define(SimpleLoginCamera.tag, SimpleLoginCamera);
}
export { SimpleLoginCamera };
