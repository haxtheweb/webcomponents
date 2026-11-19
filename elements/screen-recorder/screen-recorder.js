/**
 * Copyright 2025 The Pennsylvania State University
 * Copyright 2025 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { DDDBlockStyles } from "@haxtheweb/d-d-d/lib/DDDBlock.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";

/**
 * `screen-recorder`
 * A webcomponent that allows users to record their screen and download the recording
 * @demo index.html
 * @element screen-recorder
 */
export class ScreenRecorder extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "screen-recorder";
  }

  /**
   * Containers to record into, in order of preference. A browser's own
   * default can be a container the file name does not describe (Chrome may
   * pick Matroska with H.264, Safari MP4), which other browsers cannot play
   * and upload checks that compare content to extension refuse. WebM first
   * because it plays everywhere; MP4 for browsers that cannot record WebM.
   */
  static get recordingFormats() {
    return [
      { mimeType: "video/webm", extension: "webm" },
      { mimeType: "video/mp4", extension: "mp4" },
    ];
  }

  /**
   * First entry of recordingFormats this browser can record, or null when
   * it reports none (the browser default is used).
   */
  static supportedRecordingFormat() {
    const Recorder = globalThis.MediaRecorder;
    if (!Recorder || typeof Recorder.isTypeSupported !== "function") {
      return null;
    }
    const formats = ScreenRecorder.recordingFormats;
    for (let i = 0; i < formats.length; i++) {
      if (Recorder.isTypeSupported(formats[i].mimeType)) {
        return formats[i];
      }
    }
    return null;
  }

  /**
   * File extension that matches a recorded MIME type.
   */
  static extensionForMimeType(mimeType) {
    const type = String(mimeType || "").toLowerCase();
    if (type.indexOf("mp4") !== -1) {
      return "mp4";
    }
    if (type.indexOf("matroska") !== -1) {
      return "mkv";
    }
    return "webm";
  }

  constructor() {
    super();
    this.recording = false;
    this.videoSrc = "";
    this.downloadUrl = "";
    this.errorMessage = "";
    this.completeBlob = null;
    this.recorder = null;
    this.chunks = [];
    this.stream = null;
    this.audioStream = null;
    this.includeSystemAudio = true;
    this.includeMicrophoneAudio = true;
    // file extension of the last recording's container; names the download
    this.recordingExtension = "webm";

    this.t = this.t || {};
    this.t = {
      ...this.t,
      startRecording: "Start Recording",
      stopRecording: "Stop Recording",
      downloadVideo: "Download Video",
      systemAudio: "Include System Audio",
      microphoneAudio: "Include Microphone",
      recordingStarted: "Recording started",
      recordingStopped: "Recording stopped",
      audioOptions: "Audio Options",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/screen-recorder.ar.json", import.meta.url).href +
        "/../",
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      recording: { type: Boolean },
      videoSrc: { type: String },
      downloadUrl: { type: String },
      errorMessage: { type: String, attribute: "error-message" },
      includeSystemAudio: { type: Boolean },
      includeMicrophoneAudio: { type: Boolean },
    };
  }

  // Lit scoped styles
  // the sr-only helper class ships in DDDReset through the DDDSuper chain
  static get styles() {
    return [
      super.styles,
      DDDBlockStyles,
      css`
        :host {
          display: block;
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          font-family: var(--ddd-font-navigation);
        }
        .video-container {
          text-align: center;
        }
        .video-container video {
          max-width: 100%;
          height: auto;
          border: var(--ddd-border-sm);
          border-radius: var(--ddd-radius-sm);
        }
        .controls {
          text-align: center;
          margin: var(--ddd-spacing-2) 0;
        }
        /* record, stop and download are DDD block actions: icon and
           words, a visible edge, hover, focus ring and held-down state;
           download is the link itself, not a button nested in a link */
        .controls {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: var(--ddd-spacing-2);
        }
        .error-region {
          margin: var(--ddd-spacing-2) 0;
          padding: var(--ddd-spacing-1, 4px) var(--ddd-spacing-2, 8px);
          border-radius: var(--ddd-radius-sm, 4px);
          background-color: var(--ddd-theme-default-error, #d32f2f);
          color: white;
          font-family: var(--ddd-font-navigation, sans-serif);
          font-size: var(--ddd-font-size-3xs, 11px);
          text-align: center;
        }
        .hidden {
          display: none !important;
        }
        .audio-options {
          text-align: center;
        }
        .audio-options h2 {
          margin: 0 0 var(--ddd-spacing-1) 0;
          font-size: var(--ddd-font-size-3xs);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          font-family: var(--ddd-font-navigation);
        }
        .checkbox-container {
          display: inline-block;
          margin: var(--ddd-spacing-1);
        }
        .checkbox-container label {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: var(--ddd-font-size-4xs);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          font-family: var(--ddd-font-navigation);
        }
        .checkbox-container input[type="checkbox"] {
          margin-inline-end: var(--ddd-spacing-1);
          cursor: pointer;
        }
      `,
    ];
  }

  // Lit render the HTML
  render() {
    return html`
      <div class="wrapper">
        <div class="video-container">
          <video
            controls
            class="${this.videoSrc ? "" : "hidden"}"
            .src="${this.videoSrc}"
          ></video>
        </div>

        <div
          class="error-region ${this.errorMessage ? "" : "hidden"}"
          role="alert"
        >
          ${this.errorMessage}
        </div>

        <div class="audio-options ${this.recording ? "hidden" : ""}">
          <h2>${this.t.audioOptions}</h2>
          <div class="checkbox-container">
            <label>
              <input
                type="checkbox"
                .checked="${this.includeSystemAudio}"
                @change="${this._toggleSystemAudio}"
              />
              ${this.t.systemAudio}
            </label>
          </div>
          <div class="checkbox-container">
            <label>
              <input
                type="checkbox"
                .checked="${this.includeMicrophoneAudio}"
                @change="${this._toggleMicrophoneAudio}"
              />
              ${this.t.microphoneAudio}
            </label>
          </div>
        </div>

        <div class="controls">
          <button
            type="button"
            class="ddd-block-action has-text ${this.recording ? "hidden" : ""}"
            @click="${this._startRecording}"
          >
            <simple-icon-lite
              icon="av:fiber-smart-record"
              aria-hidden="true"
            ></simple-icon-lite>
            <span>${this.t.startRecording}</span>
          </button>

          <button
            type="button"
            class="ddd-block-action has-text ${this.recording ? "" : "hidden"}"
            @click="${this._stopRecording}"
          >
            <simple-icon-lite
              icon="av:stop"
              aria-hidden="true"
            ></simple-icon-lite>
            <span>${this.t.stopRecording}</span>
          </button>

          <a
            class="ddd-block-action has-text download-link ${
              this.downloadUrl ? "" : "hidden"
            }"
            href="${this.downloadUrl}"
            download="screen-recording-${Date.now()}.${this.recordingExtension}"
          >
            <simple-icon-lite
              icon="icons:file-download"
              aria-hidden="true"
            ></simple-icon-lite>
            <span>${this.t.downloadVideo}</span>
          </a>
        </div>

        <div class="sr-only" aria-live="polite">
          ${this.recording ? this.t.recordingStarted : this.t.recordingStopped}
        </div>
        <slot></slot>
      </div>
    `;
  }

  /**
   * Toggle system audio option
   */
  _toggleSystemAudio(e) {
    this.includeSystemAudio = e.target.checked;
  }

  /**
   * Toggle microphone audio option
   */
  _toggleMicrophoneAudio(e) {
    this.includeMicrophoneAudio = e.target.checked;
  }

  /**
   * Start screen recording
   */
  async _startRecording() {
    try {
      // Get display media with system audio if requested
      this.stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          mediaSource: "screen",
        },
        audio: this.includeSystemAudio,
      });

      let finalStream = this.stream;

      // If microphone audio is also requested, we need to combine streams
      if (this.includeMicrophoneAudio) {
        try {
          this.audioStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });

          // Create a new MediaStream combining video and both audio tracks
          const audioContext = new AudioContext();
          const destination = audioContext.createMediaStreamDestination();

          // Add system audio if available
          if (
            this.includeSystemAudio &&
            this.stream.getAudioTracks().length > 0
          ) {
            const systemAudioSource = audioContext.createMediaStreamSource(
              this.stream,
            );
            systemAudioSource.connect(destination);
          }

          // Add microphone audio
          const micAudioSource = audioContext.createMediaStreamSource(
            this.audioStream,
          );
          micAudioSource.connect(destination);

          // Create final stream with video from display and mixed audio
          finalStream = new MediaStream([
            ...this.stream.getVideoTracks(),
            ...destination.stream.getAudioTracks(),
          ]);
        } catch (micError) {
          console.warn("Could not access microphone:", micError);
          // Continue with just system audio
        }
      }

      const format = ScreenRecorder.supportedRecordingFormat();
      this.recorder = format
        ? new MediaRecorder(finalStream, { mimeType: format.mimeType })
        : new MediaRecorder(finalStream);
      this.chunks = [];

      this.recorder.ondataavailable = (e) => {
        this.chunks.push(e.data);
      };

      this.recorder.onstop = () => {
        this._onRecordingStop();
      };

      this.recorder.start();
      this.recording = true;
    } catch (error) {
      console.error("Error starting screen recording:", error);
      this.errorMessage = "Error starting screen recording: " + error.message;
    }
  }

  /**
   * Stop screen recording
   */
  _stopRecording() {
    if (this.recorder && this.recorder.state === "recording") {
      this.recorder.stop();
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    if (this.audioStream) {
      this.audioStream.getTracks().forEach((track) => {
        track.stop();
      });
      this.audioStream = null;
    }

    this.recording = false;
  }

  /**
   * Handle recording stop event
   */
  _onRecordingStop() {
    const mimeType =
      (this.recorder && this.recorder.mimeType) ||
      (this.chunks.length > 0 && this.chunks[0].type) ||
      "video/webm";
    this.recordingExtension = ScreenRecorder.extensionForMimeType(mimeType);
    this.completeBlob = new Blob(this.chunks, {
      type: mimeType,
    });

    this.videoSrc = URL.createObjectURL(this.completeBlob);
    this.downloadUrl = this.videoSrc;

    // Dispatch event for external listeners (like SimpleFieldsUpload)
    this.dispatchEvent(
      new CustomEvent("screen-recorder-blob", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          blob: this.completeBlob,
          mimeType: mimeType,
          extension: this.recordingExtension,
        },
      }),
    );

    // Clean up
    this.chunks = [];
  }

  /**
   * Clean up URLs and streams when component is disconnected
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.videoSrc && this.videoSrc.startsWith("blob:")) {
      URL.revokeObjectURL(this.videoSrc);
    }

    // Clean up any active streams
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
    if (this.audioStream) {
      this.audioStream.getTracks().forEach((track) => track.stop());
    }
  }
}

globalThis.customElements.define(ScreenRecorder.tag, ScreenRecorder);
