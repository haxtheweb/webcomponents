/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { record } from "./lib/vmsg-fork.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
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
          display: block;
          font-family: var(--ddd-font-navigation, sans-serif);
        }
        simple-icon-button-lite {
          font-size: var(--ddd-font-size-3xs, 11px);
          padding: var(--ddd-spacing-1, 4px) var(--ddd-spacing-2, 8px);
          margin: var(--ddd-spacing-1, 4px);
          border-radius: var(--ddd-radius-sm, 4px);
          background-color: var(--ddd-theme-default-keystoneYellow, #ffd100);
          color: var(--ddd-theme-default-coalyGray, #444);
          border: var(--ddd-border-sm) solid
            var(--ddd-theme-default-limestoneGray, #ccc);
        }
      `,
    ];
  }
  render() {
    return html`
      ${!this.recording
        ? html`
            <simple-icon-button-lite
              icon="av:mic"
              @click="${this.toggleRecording}"
              >${this.label}</simple-icon-button-lite
            >
          `
        : html``}
      <slot></slot>
    `;
  }
  static get properties() {
    return {
      recording: {
        type: Boolean,
      },
      label: {
        type: String,
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
    this.label = "Activate Recorder";
  }
  toggleRecording(e) {
    this.recording = !this.recording;
  }
  updated(changedProperties) {
    if (changedProperties.has("recording") && this.recording) {
      this.recorder();
    }
  }
  /**
   * Toggle the LAME bridge
   */
  recorder() {
    // need to start...
    record(
      {
        wasmURL: new URL("./lib/vmsg.wasm", import.meta.url).href,
      },
      this,
    ).then((blob) => {
      this.dispatchEvent(
        new CustomEvent("voice-recorder-recording-blob", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {
            value: blob,
          },
        }),
      );
      this.recording = false;
      this.innerHTML = "";
    });
  }
}
globalThis.customElements.define(VoiceRecorder.tag, VoiceRecorder);
export { VoiceRecorder };
