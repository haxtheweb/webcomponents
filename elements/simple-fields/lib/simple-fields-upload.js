import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/simple-fields/lib/simple-fields-field.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
import "@vaadin/vaadin-upload/vaadin-upload.js";
/**
 * `simple-fields-upload` takes in a JSON schema of type array and builds a form,
 * exposing a `value` property that represents an array described by the schema.
 *
 * @group simple-fields
 * @element simple-fields-upload
 * @extends a11y-tab
 * @extends simple-fields-fieldset
 * @demo ./demo/upload.html
 */
class SimpleFieldsUpload extends SimpleColors {
  static get tag() {
    return "simple-fields-upload";
  }
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          visibility: visible;
          transition: 0.3s all ease;
          box-sizing: border-box;
          pointer-events: all;
          overflow: visible;
          font-family: var(--simple-fields-font-family, sans-serif);
          --simple-login-camera-aspect: 1.777777777777;
          --simple-camera-snap-color: var(--simple-fields-color, black);
          --simple-camera-snap-background: var(
            --simple-fields-background-color,
            #fff
          );
          --simple-camera-snap-border-radius: 2px;
          --lumo-font-family: var(--simple-fields-font-family, sans-serif);
          --lumo-error-color: var(--simple-fields-error-color, #dd2c00);
          --lumo-primary-font-color: var(--simple-fields-color, black);
          --lumo-base-color: var(--simple-fields-background-color, #fff);
          --lumo-primary-contrast-color: var(
            --simple-fields-background-color,
            #fff
          );
          --lumo-primary-color: var(--simple-fields-color, black);
          --lumo-dark-primary-color: var(--simple-fields-color, black);
          --lumo-light-primary-color: var(--simple-fields-color, black);
          --lumo-primary-text-color: var(--simple-fields-color, black);
          --lumo-body-text-color: var(--simple-fields-color, black);
          --lumo-header-text-color: var(--simple-fields-color, black);
          --lumo-secondary-text-color: var(--simple-fields-color, black);
          --lumo-contrast-20pct: transparent;
          --lumo-disabled-text-color: var(--simple-fields-border-color, #999);
          color: var(--simple-fields-color, black);
          background-color: var(--simple-fields-background-color, #fff);
        }
        vaadin-upload[dragover] {
          border-color: var(
            --simple-fields-secondary-accent-color,
            var(--simple-colors-default-theme-accent-3, #77e2ff)
          );
        }
        vaadin-upload-file {
          --disabled-text-color: #var(--simple-fields-border-color, #999);
        }
        :host(:last-of-type) {
          margin-bottom: 0;
        }
        #description {
          font-family: var(--simple-fields-detail-font-family, sans-serif);
          font-size: var(--simple-fields-detail-font-size, 12px);
          line-height: var(--simple-fields-detail-line-height, 22px);
        }
        fieldset {
          padding: 0;
          margin: var(--simple-fields-margin-small, 8px) 0
            var(--simple-fields-margin, 16px);
          border: 1px solid var(--simple-fields-border-color-light, #ccc);
          border-radius: var(--simple-fields-border-radius, 2px);
          transition: all 0.3s ease-in-out;
        }
        #label {
          font-family: var(--simple-fields-font-family, sans-serif);
          font-size: var(--simple-fields-font-size, 16px);
          line-height: var(--simple-fields-line-height, 22px);
        }
        :host([error]) #label {
          color: var(--simple-fields-error-color, #dd2c00);
          transition: all 0.3s ease-in-out;
        }
        #options {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          flex: 1 1 auto;
          float: right;
          margin: -5px 5px 5px;
        }
        simple-icon-button {
          opacity: 0.8;
          border-radius: 3px;
          margin: 0 2px;
        }
        simple-icon-button[aria-pressed="true"],
        simple-icon-button:focus-within,
        simple-icon-button:hover {
          outline: 1px solid var(--simple-fields-border-color, #999);
          opacity: 1;
        }
        #uploads {
          clear: both;
          padding: 0 var(--simple-fields-margin-small, 8px)
            var(--simple-fields-margin, 16px);
        }
        vaadin-upload {
          padding: 0;
          margin: 0 calc(0px - var(--lumo-space-s)) 0 0;
        }
        simple-camera-snap {
          --simple-camera-snap-button-container-bottom: 2px;
          --simple-camera-snap-button-container-z-index: 5;
          --simple-camera-snap-button-border-radius: 100%;
          --simple-camera-snap-button-opacity: 0.7;
        }
      `,
    ];
  }
  /**
   * HTMLElement life cycle
   */
  constructor() {
    super();
    this.label = null;
    this.noCamera = false;
    this.options = [];
    // @todo leave this off until we can do more testing
    // the wiring is all there but the UI pattern is not
    this.noVoiceRecord = true;
  }
  /**
   * LitElement life cycle - render callback
   */
  render() {
    return html`
      <fieldset id="fieldset" part="fieldset">
        <legend id="label" ?hidden="${!this.label}" part="legend">
          ${this.label}:
        </legend>
        <div id="options" part="options">
          ${!this.options || !this.options.map
            ? ""
            : this.options.map((option) =>
                !option[0]
                  ? ""
                  : html`
                      <simple-icon-button
                        aria-hidden="true"
                        icon="${option[0].icon}"
                        label=${option[0].alt}
                        aria-pressed="${this.option == option[0].value
                          ? "true"
                          : "false"}"
                        @click="${(e) =>
                          this.optionChanged(option[0].value, e)}"
                        controls="${option[0].value}"
                        part="option-icon"
                      >
                      </simple-icon-button>
                    `
              )}
        </div>
        <div id="uploads" part="fields">
          <simple-fields-field
            id="url"
            ?hidden="${this.option !== "url"}"
            value="${this.value || ""}"
            @value-changed="${this.valueChanged}"
            label="URL"
            type="url"
            auto-validate=""
            part="url"
          ></simple-fields-field>
          <vaadin-upload
            capture
            form-data-name="file-upload"
            ?hidden="${this.option !== "fileupload"}"
            id="fileupload"
            @upload-before="${this._fileAboutToUpload}"
            @upload-response="${this._fileUploadResponse}"
            part="upload"
          ></vaadin-upload>
          <div
            id="camerahole"
            ?hidden="${this.option !== "selfie"}"
            part="camera"
          ></div>
          <div
            id="voicerecorder"
            ?hidden="${this.option !== "audio"}"
            part="voice"
          ></div>
          <div
            id="description"
            ?hidden="${!this.description}"
            part="description"
          >
            ${this.description}
          </div>
        </div>
      </fieldset>
    `;
  }
  optionChanged(option, e) {
    this.option = option;
    // make sure there's not null here, possible when dynamically  built
    if (!option) {
      if (
        this.options &&
        this.options[0] &&
        this.options[0][0] &&
        this.options[0][0].value
      ) {
        this.option = this.options[0][0].value;
      }
    }
    if (option === "selfie") this._takeSelfie(e);
    if (option === "audio") this._voiceRecorder(e);
  }
  valueChanged(e) {
    this.value = e.detail.value;
  }
  /**
   * LitElement life cycle - properties changed callback
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      // notify
      if (propName == "value") {
        this.dispatchEvent(
          new CustomEvent("value-changed", {
            detail: {
              value: this[propName],
            },
          })
        );
      }
    });
  }
  /**
   * LitElement / popular convention
   */
  static get properties() {
    return {
      label: {
        type: String,
      },
      description: {
        type: String,
      },
      value: {
        type: String,
      },
      option: {
        type: String,
      },
      options: {
        type: Array,
      },
      /**
       * Used when we want to ensure there is not a web cam option like video upload.
       */
      noCamera: {
        type: Boolean,
        attribute: "no-camera",
      },
      /**
       * No Voice Recording
       */
      noVoiceRecord: {
        type: Boolean,
        attribute: "no-voice-record",
      },
    };
  }
  /**
   * Respond to uploading a file
   */
  _fileAboutToUpload(e) {
    this.dispatchEvent(
      new CustomEvent("upload-before", {
        bubbles: true,
        cancelable: true,
        composed: false,
        detail: e.detail,
      })
    );
  }
  /**
   * Respond to successful file upload, now inject url into url field and
   * do a gizmo guess from there!
   */
  _fileUploadResponse(e) {
    // set the value of the url which will update our URL and notify
    this.shadowRoot.querySelector("#url").value = item.url;
    this.dispatchEvent(
      new CustomEvent("upload-response", {
        bubbles: true,
        cancelable: true,
        composed: false,
        detail: e.detail,
      })
    );
  }
  /**
   * Set the input options as far as url, upload, or webcam input
   */
  _setInputOptions() {
    // hide the button if this environment can't support it anyway
    let options = [
      [
        {
          alt: "Upload",
          icon: "icons:file-upload",
          value: "fileupload",
        },
      ],
      [
        {
          alt: "URL",
          icon: "icons:link",
          value: "url",
        },
      ],
    ];
    if (!navigator.mediaDevices || this.noCamera) {
      this.shadowRoot.querySelector("#camerahole").style.display = "none";
    } else {
      options.push([
        {
          alt: "Camera",
          icon: "image:photo-camera",
          value: "selfie",
        },
      ]);
    }
    if (!navigator.mediaDevices || this.noVoiceRecord) {
      this.shadowRoot.querySelector("#voicerecorder").style.display = "none";
    } else {
      /*options.push([
        {
          alt: "Audio",
          icon: "hardware:keyboard-voice",
          value: "audio"
        }
      ]);*/
    }
    return options;
  }
  /**
   * LitElement
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // test on load for if we have a media device
    this.options = [...this._setInputOptions()];
    // default to URL if we have a value of any kind
    if (this.value) {
      this.option = "url";
    } else {
      this.option = "fileupload";
    }
  }
  /**
   * We got a new photo
   */
  __newPhotoShowedUp(e) {
    let file = new File([e.detail.raw], "headshot" + e.timeStamp + ".jpg");
    this.shadowRoot.querySelector("#fileupload")._addFile(file);
  }
  /**
   * We got a new photo
   */
  __newAudioShowedUp(e) {
    let file = new File([e.detail.value], "voice-memo" + e.timeStamp + ".mp3");
    this.shadowRoot.querySelector("#fileupload")._addFile(file);
  }
  /**
   * Invoke the camera to set itself up
   */
  _takeSelfie(e) {
    if (!this.camera) {
      import("@lrnwebcomponents/simple-login/lib/simple-camera-snap.js");
      this.camera = document.createElement("simple-camera-snap");
      this.camera.autoplay = true;
      this.camera.addEventListener(
        "simple-camera-snap-image",
        this.__newPhotoShowedUp.bind(this)
      );
      this.shadowRoot.querySelector("#camerahole").appendChild(this.camera);
    }
  }
  _voiceRecorder(e) {
    if (!this.voice) {
      import("@lrnwebcomponents/voice-recorder/voice-recorder.js");
      this.voice = document.createElement("voice-recorder");
      this.voice.addEventListener(
        "voice-recorder-recording",
        this.__newAudioShowedUp.bind(this)
      );
      this.shadowRoot.querySelector("#voicerecorder").appendChild(this.voice);
    }
  }
  /**
   * Helper to take a multi-dimensional object and convert
   * it's reference into the real value. This allows for variable input defined
   * in a string to actually hit the deeper part of an object structure.
   */
  _resolveObjectPath(path, obj) {
    return path.split(".").reduce(function (prev, curr) {
      return prev ? prev[curr] : null;
    }, obj || self);
  }
}
window.customElements.define(SimpleFieldsUpload.tag, SimpleFieldsUpload);
export { SimpleFieldsUpload };
