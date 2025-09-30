import { html, css, LitElement } from "lit";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";
import { SimpleFieldsButtonStyles } from "./simple-fields-ui.js";
import { SimpleFieldsFieldsetBehaviors } from "./simple-fields-fieldset.js";
import "./simple-fields-url-combo.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-toolbar/simple-toolbar.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
import "@vaadin/vaadin-upload/vaadin-upload.js";
import "@haxtheweb/responsive-utility/responsive-utility.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
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
class SimpleFieldsUpload extends I18NMixin(
  SimpleFieldsFieldsetBehaviors(LitElement),
) {
  static get tag() {
    return "simple-fields-upload";
  }
  static get styles() {
    return [
      super.styles,
      ...SimpleFieldsButtonStyles,
      css`
        :host {
          pointer-events: all;
          overflow: visible;
          --simple-login-camera-aspect: 1.777777777777;
          --simple-camera-snap-color: var(--ddd-theme-default-coalyGray, currentColor);
          --simple-camera-snap-background: var(
            --ddd-theme-default-white,
            white
          );
          --simple-camera-snap-border-radius: var(--ddd-radius-sm);
          --lumo-font-family: var(--ddd-font-navigation, sans-serif);
          --lumo-error-color: var(--ddd-theme-default-error, #b40000);
          --lumo-primary-font-color: var(--ddd-theme-default-coalyGray, currentColor);
          --lumo-base-color: var(--ddd-theme-default-white, white);
        }
        :host([responsive-size="xs"]),
        div[part="description"] {
          font-size: var(--ddd-font-size-4xs, 10px);
          --simple-fields-font-size: var(--ddd-font-size-4xs, 10px);
          --simple-fields-button-font-size: var(--ddd-font-size-3xs, 11px);
          --simple-fields-legend-font-size: var(--ddd-font-size-3xs, 11px);
          --simple-fields-detail-font-size: var(--ddd-font-size-4xs, 10px);
        }
        fieldset {
          padding: 0px;
          max-width: 100%;
        }
        #upload,
        div[slot="drop-label"] {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          width: 100%;
          padding: var(--ddd-spacing-2, 8px);
        }
        #upload {
          border-radius: var(--ddd-radius-sm, 2px);
          border: var(--ddd-border-sm) dashed var(--ddd-theme-default-limestoneGray, #ccc);
        }
        #url {
          flex: 1 1 100%;
          margin: var(--ddd-spacing-2, 8px) 0;
          background-color: transparent;
        }
        #upload-options {
          position: relative;
        }
        div[slot="drop-label"] > * {
          flex: 0 1 auto;
        }
        simple-fields-url-combo[always-expanded]::part(listbox) {
          background-color: transparent;
        }
        
        simple-toolbar-button {
          display: inline-flex;
          font-family: var(--ddd-font-navigation, sans-serif);
          font-size: var(--ddd-font-size-4xs, 10px);
          color: var(--ddd-theme-default-coalyGray, black);
          margin: var(--ddd-spacing-1, 4px);
          padding: var(--ddd-spacing-1, 4px);
          border: none;
          border-radius: var(--ddd-radius-sm, 4px);
          text-align: center;
          --simple-icon-width: 24px;
          --simple-icon-height: 24px;
        }
        simple-toolbar-button[part="cancel-media"] {
          position: absolute;
          right: 0;
          top: 0;
          z-index: 2;
          padding: var(--ddd-spacing-1, 4px);
          opacity: 0.7;
        }
        span[part="drop-area-text"] {
          font-family: var(--ddd-font-navigation, sans-serif);
          font-size: var(--ddd-font-size-3xs, 11px);
          white-space: nowrap;
          margin: var(--ddd-spacing-1, 4px);
        }
        vaadin-upload {
          padding: var(--ddd-spacing-2, 8px);
          position: relative;
          overflow: visible;
          border: none !important;
          --lumo-font-size-s: var(--ddd-font-size-4xs, 10px);
        }
        vaadin-upload::part(file-list) {
          max-height: 140px;
          overflow-x: hidden;
          overflow-y: auto;
        }
        vaadin-upload[dragover] {
          border-color: var(
            --simple-fields-secondary-accent-color,
            var(--simple-colors-default-theme-accent-3, #77e2ff)
          );
        }
        vaadin-upload::part(drop-label) {
          font-family: var(--simple-fields-font-family, sans-serif);
          color: var(--simple-fields-color, currentColor);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          padding: 0;
          width: 100%;
          margin-top: -16px;
        }
        vaadin-upload.option-selfie::part(drop-label) {
          display: block;
        }
        vaadin-upload::part(drop-label-icon) {
          display: none;
        }
        vaadin-upload {
          --disabled-text-color: #var(--simple-fields-border-color, #999);
          --lumo-contrast-60pct: currentColor;
          --lumo-contrast-90pct: currentColor;
        }
        simple-camera-snap {
          --simple-camera-snap-button-container-bottom: var(--ddd-spacing-1, 4px);
          --simple-camera-snap-button-container-z-index: 5;
          --simple-camera-snap-button-border-radius: var(--ddd-radius-rounded, 100%);
          --simple-camera-snap-button-opacity: 0.8;
          max-width: 200px;
          margin: 0 auto;
        }

        /** voice stuff which is in lite dom below */
        .vmsg-button {
          border: var(--ddd-border-sm) solid var(--ddd-theme-default-limestoneGray, #ccc);
          border-radius: var(--ddd-radius-sm, 4px);
          padding: var(--ddd-spacing-1, 4px) var(--ddd-spacing-2, 8px);
          margin: 0 var(--ddd-spacing-1, 4px);
          font-family: var(--ddd-font-navigation, sans-serif);
          font-size: var(--ddd-font-size-4xs, 10px);
          min-width: 60px;
          text-align: center;
          cursor: pointer;
        }
        .vmsg-button.vmsg-record-button,
        .vmsg-button.vmsg-stop-button {
          background-color: var(--ddd-theme-default-error, #d32f2f);
          color: white;
        }
        .vmsg-button.vmsg-save-button {
          background-color: var(--ddd-theme-default-success, #4caf50);
          color: white;
        }
        .vmsg-timer {
          padding: var(--ddd-spacing-1, 4px);
          font-family: var(--ddd-font-navigation, sans-serif);
          font-size: var(--ddd-font-size-3xs, 11px);
        }
        #add-hidden {
          display: none;
        }
        /** account for mobile devices not sending this event accurately */
        @media (max-width: 640px) {
          #browse {
            display: none;
          }
          #add-hidden {
            display: block;
            float: right;
            width: 100%;
            margin: 0 0 16px 0;
          }
          vaadin-upload::part(file-list) {
            max-height: 48px;
            font-size: 8px;
          }
        }
      `,
    ];
  }
  /**
   * HTMLElement life cycle
   */
  constructor() {
    super();
    this.voice = null;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      dropMediaHereOr: "drop media here or",
      upload: "Upload",
      takePhoto: "Take photo",
      recordAudio: "Record audio",
      recordScreen: "Record screen",
      cancel: "Cancel",
      uploadMedia: "Upload media",
    };
    this.registerLocalization({
      context: this,
      namespace: "simple-fields",
      localesPath:
        new URL("../locales/simple-fields.es.json", import.meta.url).href +
        "/../",
    });
    this.hideInput = false;
    this.itemsList = [];
    this.autocomplete = "off";
    this.noCamera = false;
    // @todo leave this off until we can do more testing
    // the wiring is all there but the UI pattern is not
    this.noVoiceRecord = false;
    // Screen recording defaults to disabled, only enabled on specific components
    this.noScreenRecord = true;
    this.responsiveSize = "sm";
  }
  render() {
    return html`
      <fieldset part="fieldset">${this.legend} ${this.fields}</fieldset>
    `;
  }
  get sources() {
    return html`
      <simple-toolbar-button
        id="browse"
        ?disabled="${this.disabled}"
        label="${this.t.upload}.."
        ?show-text-label="${this.responsiveSize.indexOf("s") < 0}"
        icon="icons:file-upload"
        show-text-label
        @click="${this._handleBrowse}"
        controls="fieldset"
        part="browse"
      >
      </simple-toolbar-button>
      <simple-toolbar-button
        icon="image:camera-alt"
        ?disabled="${this.disabled}"
        label="${this.t.takePhoto}.."
        ?show-text-label="${this.responsiveSize.indexOf("s") < 0}"
        @mousedown="${(e) => e.preventDefault()}"
        @focus="${(e) => e.preventDefault()}"
        @click="${this._handleCameraOption}"
        controls="fieldset"
        part="take-photo"
        ?hidden="${!navigator.mediaDevices || this.noCamera}"
      >
      </simple-toolbar-button>
      <simple-toolbar-button
        icon="hardware:keyboard-voice"
        ?disabled="${this.disabled}"
        label="${this.t.recordAudio}.."
        ?show-text-label="${this.responsiveSize.indexOf("s") < 0}"
        @mousedown="${(e) => e.preventDefault()}"
        @focus="${(e) => e.preventDefault()}"
        @click="${this._handleAudioOption}"
        controls="fieldset"
        part="record-audio"
        ?hidden="${!navigator.mediaDevices || this.noVoiceRecord}"
      >
      </simple-toolbar-button>
      <simple-toolbar-button
        icon="hardware:desktop-windows"
        ?disabled="${this.disabled}"
        label="${this.t.recordScreen}.."
        ?show-text-label="${this.responsiveSize.indexOf("s") < 0}"
        @mousedown="${(e) => e.preventDefault()}"
        @focus="${(e) => e.preventDefault()}"
        @click="${this._handleScreenOption}"
        controls="fieldset"
        part="record-screen"
        ?hidden="${!navigator.mediaDevices || this.noScreenRecord}"
      >
      </simple-toolbar-button>
    `;
  }

  _fileUploadResponse(e) {
    // placeholder as those implementing this will need to respond to it
    // elements upstream of this class typically will know how they
    // want to handle the response
  }
  /**
   * LitElement life cycle - render callback
   */
  get fields() {
    return html`
      <div id="upload-options">
        <vaadin-upload
          capture=""
          class="option-${this.option}"
          form-data-name="file-upload"
          id="fileupload"
          @upload-before="${this._fileAboutToUpload}"
          @upload-response="${this._fileUploadResponse}"
          part="upload"
          ?nodrop="${this.disabled}"
        >
          <button
            ?disabled="${this.disabled}"
            id="add-hidden"
            slot="add-button"
          >
            ${this.t.upload}..
          </button>
          <div
            part="browse-area"
            ?hidden="${this.option == "selfie" ||
            this.option == "audio" ||
            this.option == "screenrecord" ||
            this.hideInput}"
          >
            <simple-fields-url-combo
              id="url"
              ?autofocus="${this.autofocus}"
              autocomplete="both"
              value="${this.value || ""}"
              label="URL"
              type="url"
              auto-validate=""
              part="url"
              ?disabled="${this.disabled}"
              ?always-expanded="${this.responsiveSize.indexOf("s") < 0}"
              display-as="${this.responsiveSize.indexOf("l") > -1
                ? "grid"
                : ""}"
              .itemsList="${this.itemsList}"
              @click="${(e) => e.stopImmediatePropagation()}"
              @mousedown="${(e) => e.stopImmediatePropagation()}"
              @focus="${(e) => e.stopImmediatePropagation()}"
              @value-changed="${this.valueChanged}"
            >
            </simple-fields-url-combo>
          </div>
          <div id="upload">
            <span part="drop-area-text">${this.t.dropMediaHereOr}</span>
            <div class="sources" part="sources">
              ${this.sources}
            </div>
          </div>
          <simple-toolbar-button
            id="cancel"
            icon="icons:clear"
            ?disabled="${this.disabled}"
            label="${this.t.cancel}"
            @mousedown="${(e) => e.preventDefault()}"
            @focus="${(e) => e.preventDefault()}"
            @click="${this._handleCancel}"
            controls="fieldset"
            slot="drop-label"
            part="cancel-media"
            ?hidden="${this.option !== "selfie" &&
            this.option !== "audio" &&
            this.option !== "screenrecord"}"
          >
          </simple-toolbar-button>
          <div
            id="camerahole"
            ?hidden="${this.option !== "selfie"}"
            part="camera"
            part="camera-preview"
          ></div>
          <div
            id="voicerecorder"
            ?hidden="${this.option !== "audio"}"
            part="voice-preview"
          ></div>
          <div
            id="screenrecorder"
            ?hidden="${this.option !== "screenrecord"}"
            part="screen-preview"
          ></div>
          ${this.desc}
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
    this.option = "audio";
    this._voiceRecorder(e);
  }
  /**
   * display screen recorder
   *
   * @param {event} e
   * @memberof SimpleFieldsUpload
   */
  _handleScreenOption(e) {
    e.preventDefault();
    this.option = "screenrecord";
    this._screenRecorder(e);
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
          }),
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
      hideInput: {
        type: Boolean,
        attribute: "hide-input",
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
      /**
       * No Screen Recording - defaults to true (disabled) for most components
       */
      noScreenRecord: {
        type: Boolean,
        attribute: "no-screen-record",
      },
      responsiveSize: {
        type: String,
        attribute: "responsive-size",
        reflect: true,
      },
      responsiveWidth: {
        type: Number,
        attribute: "responsive-width",
        reflect: true,
      },
      itemsList: {
        type: Object,
        attribute: "items-list",
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
      } else if (
        this.option == "screenrecord" &&
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
      }),
    );
    this.dispatchEvent(
      new CustomEvent("upload-response", {
        bubbles: true,
        cancelable: true,
        composed: false,
        detail: e.detail,
      }),
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
    globalThis.ResponsiveUtility.requestAvailability();

    /**
     * needs the size of parent container to add responsive styling
     * @event responsive-element
     */
    globalThis.dispatchEvent(
      new CustomEvent("responsive-element", {
        detail: {
          element: this,
          attribute: "responsive-size",
          relativeToParent: true,
          sm: 150,
          md: 300,
          lg: 600,
          xl: 1200,
        },
      }),
    );
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
    let file = new File(
      [e.detail.value],
      "voice-recording-" + e.timeStamp + ".mp3",
    );
    this.shadowRoot.querySelector("#fileupload")._addFile(file);
    this.voice.remove();
    setTimeout(() => {
      this.voice = null;
    }, 0);
  }
  /**
   * We got a new screen recording
   */
  __newScreenRecordingShowedUp(e) {
    let file = new File(
      [e.detail.blob],
      "screen-recording-" + e.timeStamp + ".webm",
    );
    this.shadowRoot.querySelector("#fileupload")._addFile(file);
    this.screenRecorder.remove();
    setTimeout(() => {
      this.screenRecorder = null;
    }, 0);
  }
  /**
   * Invoke the camera to set itself up
   */
  _takeSelfie(e) {
    if (!this.camera) {
      import("@haxtheweb/simple-login/lib/simple-camera-snap.js").then(() => {
        this.camera = globalThis.document.createElement("simple-camera-snap");
        this.camera.autoplay = true;
        this.camera.addEventListener(
          "simple-camera-snap-image",
          this.__newPhotoShowedUp.bind(this),
        );
        this.shadowRoot.querySelector("#camerahole").appendChild(this.camera);
      });
    }
  }
  _voiceRecorder(e) {
    if (!this.voice) {
      import("@haxtheweb/voice-recorder/voice-recorder.js").then(() => {
        this.voice = globalThis.document.createElement("voice-recorder");
        this.voice.addEventListener(
          "voice-recorder-recording-blob",
          this.__newAudioShowedUp.bind(this),
        );
        this.voice.recording = true;
        this.shadowRoot.querySelector("#voicerecorder").appendChild(this.voice);
      });
    }
  }
  _screenRecorder(e) {
    if (!this.screenRecorder) {
      import("@haxtheweb/screen-recorder/screen-recorder.js").then(() => {
        this.screenRecorder =
          globalThis.document.createElement("screen-recorder");
        this.screenRecorder.addEventListener(
          "screen-recorder-blob",
          this.__newScreenRecordingShowedUp.bind(this),
        );
        this.shadowRoot
          .querySelector("#screenrecorder")
          .appendChild(this.screenRecorder);
      });
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
globalThis.customElements.define(SimpleFieldsUpload.tag, SimpleFieldsUpload);
export { SimpleFieldsUpload };
