import { html, css, LitElement } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-fields/lib/simple-fields-field.js";
import { SimpleFieldsButtonStyles } from "./simple-fields-ui.js";
import { SimpleFieldsFieldsetBehaviors } from "./simple-fields-fieldset.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-toolbar/simple-toolbar.js";
import "@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-button.js";
import "@vaadin/vaadin-upload/vaadin-upload.js";
/**
 * `simple-fields-upload` takes in a JSON schema of type array and builds a form,
 * exposing a `value` property that represents an array described by the schema.
 *
 * @customElement
 * @group simple-fields
 * @element simple-fields-upload
 * @extends simple-fields-fieldset
 * @demo ./demo/upload.html
 * @class SimpleFieldsUpload
 * @extends {SimpleFieldsFieldsetBehaviors(LitElement)}
 */
class SimpleFieldsUpload extends SimpleFieldsFieldsetBehaviors(LitElement) {
  static get tag() {
    return "simple-fields-upload";
  }
  static get styles() {
    return [
      ...super.styles,
      ...SimpleFieldsButtonStyles,
      css`
        :host {
          pointer-events: all;
          overflow: visible;
          transition: 0.3s all ease;
          --simple-login-camera-aspect: 1.777777777777;
          --simple-camera-snap-color: var(--simple-fields-color, currentColor);
          --simple-camera-snap-background: var(
            --simple-fields-background-color,
            unset
          );
          --simple-camera-snap-border-radius: 2px;
          --lumo-font-family: var(--simple-fields-font-family, sans-serif);
          --lumo-error-color: var(--simple-fields-error-color, #b40000);
          --lumo-primary-font-color: var(--simple-fields-color, currentColor);
          --lumo-base-color: var(--simple-fields-background-color, transparent);
        }
        #url-browse,
        #drop-camera {
          width: 100%;
          font-family: var(--simple-fields-button-font-family, sans-serif);
          font-size: var(--simple-fields-button-font-size, 14px);
        }
        #drop-camera {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
        }
        #browse {
          margin-right: 0;
        }
        #url {
          margin-bottom: var(--simple-fields-margin-small, 8px);
        }
        #url::part(option-inner) {
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        #drop,
        #photo {
          white-space: nowrap;
        }
        #upload-options {
          transition: height 0.3s linear;
        }
        #cancel-camera {
          display: block;
          margin: 0;
          margin: -12px -12px 0;
          z-index: 2;
        }
        #cancel-camera::part(button) {
          width: 24px;
        }
        simple-toolbar-button {
          margin: 0 5px;
        }
        vaadin-upload {
          padding: 0 var(--simple-fields-margin-small, 8px)
            var(--simple-fields-margin-small, 8px);
          position: relative;
          overflow: visible;
        }
        vaadin-upload::part(drop-label-icon) {
          display: none;
        }
        vaadin-upload::part(add-button) {
          font-family: var(--simple-fields-font-family, sans-serif);
          color: var(--simple-fields-color, currentColor);
        }
        vaadin-upload::part(drop-label) {
          font-family: var(--simple-fields-font-family, sans-serif);
          color: var(--simple-fields-color, currentColor);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 calc(1 * var(--simple-fields-margin-small, 8px));
          width: calc(100% - 2 * var(--simple-fields-margin-small) - 2px);
        }
        vaadin-upload.option-selfie::part(drop-label) {
          display: block;
        }
        vaadin-upload.option-selfie #drop-camera {
          display: none;
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
    this.autocomplete = "off";
    this.noCamera = false;
    // @todo leave this off until we can do more testing
    // the wiring is all there but the UI pattern is not
    this.noVoiceRecord = true;
  }
  render() {
    return html`
      <fieldset part="fieldset">${this.legend} ${this.fields}</fieldset>
    `;
  }
  /**
   * LitElement life cycle - render callback
   */
  get fields() {
    return html`
      <div id="url-browse">
        <simple-fields-field
          id="url"
          ?autofocus="${this.autofocus}"
          autocomplete="${this.autocomplete}"
          value="${this.value || ""}"
          @value-changed="${this.valueChanged}"
          label="URL"
          .description="${this.description}"
          type="url"
          auto-validate=""
          part="url"
          @click="${(e) => e.preventDefault()}"
          @mousedown="${(e) => e.preventDefault()}"
          @focus="${(e) => e.preventDefault()}"
        >
          <simple-toolbar-button
            id="browse"
            label="Browse..."
            show-text-label
            @click="${this._handleBrowse}"
            controls="fieldset"
            slot="suffix"
            part="browse"
          >
          </simple-toolbar-button>
        </simple-fields-field>
      </div>
      <div id="upload-options">
        <vaadin-upload
          capture
          class="option-${this.option}"
          form-data-name="file-upload"
          id="fileupload"
          @upload-before="${this._fileAboutToUpload}"
          @upload-response="${this._fileUploadResponse}"
          part="upload"
        >
          <button id="add-hidden" slot="add-button" hidden></button>
          <div
            id="drop-camera"
            slot="drop-label"
            part="drop-area"
            ?hidden="${this.option == "selfie" || this.option == "audio"}"
          >
            <span id="drop" part="drop-area-text">
              <simple-icon-lite
                icon="file-upload"
                part="drop-area-icon"
              ></simple-icon-lite>
              Drop media here ${!navigator.mediaDevices ? "" : html` or `}
            </span>
            <simple-toolbar-button
              icon="image:camera-alt"
              label="Take photo"
              show-text-label
              @mousedown="${(e) => e.preventDefault()}"
              @focus="${(e) => e.preventDefault()}"
              @click="${this._handleCameraOption}"
              controls="fieldset"
              part="take-photo"
              ?hidden="${!navigator.mediaDevices || this.noCamera}"
            >
            </simple-toolbar-button>
            <simple-toolbar-button
              icon="image:camera-alt"
              label="Record Audio"
              show-text-label
              @mousedown="${(e) => e.preventDefault()}"
              @focus="${(e) => e.preventDefault()}"
              @click="${this._handleAudioOption}"
              controls="fieldset"
              part="record-audio"
              ?hidden="${!navigator.mediaDevices || this.noVoiceRecord}"
            >
            </simple-toolbar-button>
          </div>
          <simple-toolbar-button
            id="cancel-camera"
            icon="icons:clear"
            label="Cancel"
            @mousedown="${(e) => e.preventDefault()}"
            @focus="${(e) => e.preventDefault()}"
            @click="${this._handleCancel}"
            controls="fieldset"
            slot="drop-label"
            part="cancel-media"
            ?hidden="${this.option !== "selfie" && this.option !== "audio"}"
          >
          </simple-toolbar-button>
          <div
            id="camerahole"
            ?hidden="${this.option !== "selfie"}"
            part="camera"
            slot="drop-label"
            part="camera-preview"
          ></div>
          <div
            id="voicerecorder"
            ?hidden="${this.option !== "audio"}"
            slot="drop-label"
            part="voice-preview"
          ></div>
        </vaadin-upload>
      </div>
    `;
  }
  /**
   * display camera snap
   *
   * @param {event} e
   * @memberof SimpleFieldsUpload
   */
  _handleCameraOption(e) {
    e.preventDefault();
    this.option = "selfie";
    this._takeSelfie(e);
  }
  /**
   * display voice recorder
   *
   * @param {event} e
   * @memberof SimpleFieldsUpload
   */
  _handleAudioOption(e) {
    e.preventDefault();
    this.option = "voice";
    this._voiceRecorder(e);
  }
  /**
   * cancel camera and audio / display upload options
   *
   * @param {event} e
   * @memberof SimpleFieldsUpload
   */
  _handleCancel(e) {
    e.preventDefault();
    this.option = "fileupload";
  }
  /**
   * when browse button is clicked trigger the hidden add button in vaadin-upload
   *
   * @param {event} e
   * @memberof SimpleFieldsUpload
   */
  _handleBrowse(e) {
    e.preventDefault();
    this.shadowRoot
      .querySelector("#add-hidden")
      .dispatchEvent(new CustomEvent("click", e));
  }
  /**
   * update the value
   *
   * @param {*} e
   * @memberof SimpleFieldsUpload
   */
  valueChanged(e) {
    this.value = e.detail.value;
  }
  /**
   * LitElement life cycle - properties changed callback
   */
  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
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
    if (this.field && this.__delayedFocus) this.focus();
  }
  /**
   * LitElement / popular convention
   */
  static get properties() {
    return {
      ...super.properties,
      /**
       * Hint for expected file type in file upload controls
       */
      accept: {
        type: String,
      },
      /**
       * Hint for form autofill feature
       */
      autocomplete: {
        type: String,
      },
      /**
       * Automatically focus on field when the page is loaded
       */
      autofocus: {
        type: Boolean,
      },
      value: {
        type: String,
      },
      option: {
        type: String,
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
  get field() {
    if (this.shadowRoot) {
      if (this.option == "selfie" && this.shadowRoot.querySelector("#cancel")) {
        return this.shadowRoot.querySelector("#cancel");
      } else if (
        this.option == "audio" &&
        this.shadowRoot.querySelector("#cancel")
      ) {
        return this.shadowRoot.querySelector("#cancel");
      } else if (this.shadowRoot.querySelector("#url")) {
        return this.shadowRoot.querySelector("#url");
      }
      return false;
    }
  }
  /**
   * focuses on field
   */
  focus() {
    if (this.field) {
      this.field.focus();
      this.__delayedFocus = false;
    } else {
      this.__delayedFocus = true;
    }
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
   * LitElement
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // test on load for if we have a media device
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
