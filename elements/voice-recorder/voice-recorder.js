/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { record } from "./lib/vmsg-fork.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
/**
 * `voice-recorder`
 * `LAME bridge`
 *
 * @demo demo/index.html
 * @element voice-recorder
 */
class VoiceRecorder extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: inline-flex;
        }
      `,
    ];
  }
  render() {
    return html`
      <button @click="${this.recordState}">
        <simple-icon icon="${this.iconState}"></simple-icon>${this.textState}
      </button>
      <slot></slot>
    `;
  }
  static get properties() {
    return {
      iconState: {
        type: String,
      },
      textState: {
        type: String,
      },
      recording: {
        type: Boolean,
      },
    };
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "voice-recorder";
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.recording = false;
  }
  recordState(e) {
    this.recording = !this.recording;
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "recording") {
        if (this[propName]) {
          this.textState = "stop";
          this.iconState = "av:stop";
        } else {
          this.textState = "Record";
          this.iconState = "av:play-arrow";
        }
        // observer to act on the recording piece
        this.toggleRecording(this[propName], oldValue);
      }
    });
  }
  /**
   * Toggle the LAME bridge
   */
  toggleRecording(newValue, oldValue) {
    if (newValue) {
      // need to start...
      record(
        {
          wasmURL: new URL("./lib/vmsg.wasm", import.meta.url).href,
        },
        this
      ).then((blob) => {
        this.dispatchEvent(
          new CustomEvent("voice-recorder-recording", {
            value: blob,
          })
        );
      });
    }
  }
}
customElements.define(VoiceRecorder.tag, VoiceRecorder);
export { VoiceRecorder };
