import "@haxtheweb/es-global-bridge/es-global-bridge.js";
/**
 * Inspiration from https://github.com/wanoo21/MyCamera
 */
class SimpleLoginCamera extends HTMLElement {
  static get tag() {
    return "simple-login-camera";
  }
  constructor() {
    super();
    this.windowControllers = new AbortController();
    if (globalThis.WCGlobalBasePath) {
      this.basePath = globalThis.WCGlobalBasePath;
    } else {
      this.basePath =
        new URL("./simple-login-camera.js", import.meta.url).href +
        "/../../../../";
    }
    this.t = {
      record: "Record",
      pause: "Pause record",
      stopSave: "Stop & Save",
      clickToTakePhoto: "Click to take photo",
    };
    globalThis.dispatchEvent(
      new CustomEvent("i18n-manager-register-element", {
        detail: {
          context: this,
          namespace: "simple-login",
          localesPath:
            new URL("../locales/simple-login.es.json", import.meta.url).href +
            "/../",
          updateCallback: "render",
          locales: ["es"],
        },
      }),
    );
    const location = `${this.basePath}msr/MediaStreamRecorder.min.js`;
    globalThis.ESGlobalBridge.requestAvailability().load("msr", location);
    globalThis.addEventListener(
      "es-bridge-msr-loaded",
      this._msrLoaded.bind(this),
      { signal: this.windowControllers.signal },
    );

    this.template = globalThis.document.createElement("template");
    this._shadow = this.attachShadow({ mode: "closed" });
    this.render();
    this._video = this._shadow.querySelector("video");
    this._error = this._shadow.querySelector("p");
    this._record = this._shadow.querySelector("button.record");
    this._pauseRecord = this._shadow.querySelector("button.pause-record");
    globalThis.document.addEventListener(
      "DOMContentLoaded",
      this.documentLoaded.bind(this),
      { signal: this.windowControllers.signal },
    );

    if (!this.hasAttribute("record")) {
      this._record.remove();
      this._pauseRecord.remove();
    } else {
      this._record.addEventListener("click", () => {
        if (!this._record.hasAttribute("recording")) {
          this._record.innerText = this.t.stopSave;
          this._record.setAttribute("recording", "");
          return this._startRecording();
        } else {
          this._record.innerText = this.t.record;
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

  render() {
    this._shadow.innerHTML = null;
    this.template.innerHTML = this.html;

    if (globalThis.ShadyCSS) {
      globalThis.ShadyCSS.prepareTemplate(this.template, this.tag);
    }
    this._shadow.appendChild(this.template.content.cloneNode(true));
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
      `my-camera-${new Date().toISOString().replace(/:|\./g, "-")}.${type}`,
    );
  }

  _cameraStream() {
    if (!navigator.mediaDevices.getUserMedia) {
      return Promise.reject(
        new Error("getUserMedia is not implemented in this browser"),
      );
    }
    return globalThis.navigator.mediaDevices.getUserMedia({
      video: {
        width: { min: 320, ideal: 1280, max: 1920 },
        height: { min: 240, ideal: 720, max: 1080 },
        facingMode: "user",
      },
      audio: this.hasAttribute("audio"),
    });
  }
  async takeASnap() {
    const canvas = globalThis.document.createElement("canvas"); // create a canvas
    const ctx = canvas.getContext("2d"); // get its context
    canvas.width = this._video.videoWidth; // set its size to the one of the video
    canvas.height = this._video.videoHeight;
    ctx.drawImage(this._video, 0, 0); // the video
    return await new Promise((res, rej) => {
      canvas.toBlob(res, "image/jpeg"); // request a Blob from the canvas
    });
  }
  renderImage(blob) {
    // uses the <a download> to download a Blob
    let img = globalThis.document.createElement("img");
    img.src = URL.createObjectURL(blob);
    return img;
  }
  imageBlob(blob) {
    return blob;
  }
  download(blob) {
    // uses the <a download> to download a Blob
    let a = globalThis.document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "screenshot.jpg";
    globalThis.document.body.appendChild(a);
    a.click();
  }
  _addVideoAtributes() {
    this._video.autoplay = this.hasAttribute("autoplay");
    this._video.controls = this.hasAttribute("controls");
  }
  _msrLoaded(e) {
    this._applyMSR();
    this._shadow.querySelector("#wrapper").addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("site-listing-video-activate", {
          detail: this,
          bubbles: true,
          composed: true,
        }),
      );
    });
  }
  async _applyMSR() {
    globalThis.addEventListener(
      "site-listing-video-activate",
      async () => {
        try {
          this._video.srcObject = await this._cameraStream();
          globalThis.stream = this._video.srcObject;
          this._addVideoAtributes();
          if (this.hasAttribute("record")) {
            this.MediaStreamRecorder = new MediaStreamRecorder(
              this._video.srcObject,
            );
            // this.MediaStreamRecorder.mimeType = 'video/webm';
            this.MediaStreamRecorder.ondataavailable =
              this._saveVideo.bind(this);
          }
          setTimeout(() => {
            this.dispatchEvent(
              new CustomEvent("simple-login-camera-icon-click", {
                detail: this,
                bubbles: true,
                composed: true,
              }),
            );
          }, 100);
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
        }
      },
      { signal: this.windowControllers.signal },
    );
  }

  connectedCallback() {
    if (
      globalThis.ESGlobalBridge.requestAvailability().imports["msr"] === true
    ) {
      this._applyMSR();
    }
    this._t = { ...this.t };
  }
  /**
   * Try to apply when fully loaded dom
   */
  documentLoaded(e) {
    if (
      globalThis.ESGlobalBridge.requestAvailability().imports["msr"] === true
    ) {
      this._applyMSR();
    }
  }

  disconnectedCallback() {
    this.windowControllers.abort();
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
          display: flex;
        }
        #wrapper {
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          flex-wrap: wrap;
          position: relative;
          background-color: var(--simple-login-camera-background, var(--background-color, #ccc));
        }
        video {
          margin-left: calc(100% * var(--simple-login-camera-aspect, 1) / 2 - 177.77777777777% / 2);          
          width: calc(177.77777777777% / var(--simple-login-camera-aspect, 1));
          background-color: rgba(0, 0, 0, 0);
        }
        .error {
          color: black;
          background-color: white;
          font-size: 26px;
          text-align: center;
          padding: 10px;
          position: absolute;
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
      <div id="wrapper" part="wrapper">
        <video part="video"></video>
        <p class="error" part="error">${this.t.clickToTakePhoto}</p>
        <div class="custom-controls" part="controls">
          <button class="record" part="record">${this.t.record}</button>
          <button class="pause-record" hidden part="pause">${this.t.pause}</button>
        </div>
      </div>
    `;
  }
}
// only show this element if we're on a secure environment
if (navigator.mediaDevices) {
  customElements.define(SimpleLoginCamera.tag, SimpleLoginCamera);
}
export { SimpleLoginCamera };
