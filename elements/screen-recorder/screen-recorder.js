/**
 * Copyright 2025 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
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

  constructor() {
    super();
    this.recording = false;
    this.videoSrc = "";
    this.downloadUrl = "";
    this.completeBlob = null;
    this.recorder = null;
    this.chunks = [];
    this.stream = null;
    this.audioStream = null;
    this.includeSystemAudio = true;
    this.includeMicrophoneAudio = true;
    
    this.t = this.t || {};
    this.t = {
      ...this.t,
      startRecording: "Start Recording",
      stopRecording: "Stop Recording",
      downloadVideo: "Download Video",
      systemAudio: "Include System Audio",
      microphoneAudio: "Include Microphone",
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
      includeSystemAudio: { type: Boolean },
      includeMicrophoneAudio: { type: Boolean },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: light-dark(var(--ddd-theme-default-coalyGray), var(--ddd-theme-default-white));
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
      .controls simple-icon-button-lite {
        background-color: var(--ddd-theme-default-error, #d32f2f);
        color: white;
        border: none;
        padding: var(--ddd-spacing-1, 4px) var(--ddd-spacing-2, 8px);
        margin: var(--ddd-spacing-1, 4px);
        border-radius: var(--ddd-radius-sm, 4px);
        font-family: var(--ddd-font-navigation, sans-serif);
        font-size: var(--ddd-font-size-4xs, 10px);
        cursor: pointer;
        transition: background-color 0.2s ease;
        min-width: 60px;
        text-align: center;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        --simple-icon-width: 12px;
        --simple-icon-height: 12px;
      }
      .controls button:hover {
        background-color: var(--ddd-theme-default-original87Pink);
      }
      .controls button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      .download-link {
        text-decoration: none;
      }
      .download-link simple-icon-button-lite {
        background-color: var(--ddd-theme-default-keystoneYellow, #ffd100) !important;
        color: var(--ddd-theme-default-coalyGray, #444) !important;
      }
      .download-link simple-icon-button-lite:hover {
        background-color: var(--ddd-theme-default-original87Pink, #ff6b9d) !important;
      }
      .hidden {
        display: none !important;
      }
      .audio-options {
        text-align: center;
      }
      .audio-options h4 {
        margin: 0 0 var(--ddd-spacing-1) 0;
        font-size: var(--ddd-font-size-3xs);
        color: light-dark(var(--ddd-theme-default-coalyGray), var(--ddd-theme-default-white));
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
        color: light-dark(var(--ddd-theme-default-coalyGray), var(--ddd-theme-default-white));
        font-family: var(--ddd-font-navigation);
      }
      .checkbox-container input[type="checkbox"] {
        margin-right: var(--ddd-spacing-1);
        cursor: pointer;
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
      <div class="wrapper">
        <div class="video-container">
          <video 
            controls 
            class="${this.videoSrc ? '' : 'hidden'}"
            .src="${this.videoSrc}"
          ></video>
        </div>
        
        <div class="audio-options ${this.recording ? 'hidden' : ''}">
          <h4>Audio Options</h4>
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
          <simple-icon-button-lite
            icon="av:fiber-smart-record"
            class="${this.recording ? 'hidden' : ''}"
            @click="${this._startRecording}"
          >
            ${this.t.startRecording}
          </simple-icon-button-lite>
          
          <simple-icon-button-lite
            icon="av:stop"
            class="${this.recording ? '' : 'hidden'}"
            @click="${this._stopRecording}"
          >
            ${this.t.stopRecording}
          </simple-icon-button-lite>
          
          <a 
            class="download-link ${this.downloadUrl ? '' : 'hidden'}"
            href="${this.downloadUrl}"
            download="screen-recording-${Date.now()}.webm"
          >
            <simple-icon-button-lite icon="icons:file-download">
              ${this.t.downloadVideo}
            </simple-icon-button-lite>
          </a>
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
          mediaSource: 'screen'
        },
        audio: this.includeSystemAudio
      });
      
      let finalStream = this.stream;
      
      // If microphone audio is also requested, we need to combine streams
      if (this.includeMicrophoneAudio) {
        try {
          this.audioStream = await navigator.mediaDevices.getUserMedia({
            audio: true
          });
          
          // Create a new MediaStream combining video and both audio tracks
          const audioContext = new AudioContext();
          const destination = audioContext.createMediaStreamDestination();
          
          // Add system audio if available
          if (this.includeSystemAudio && this.stream.getAudioTracks().length > 0) {
            const systemAudioSource = audioContext.createMediaStreamSource(this.stream);
            systemAudioSource.connect(destination);
          }
          
          // Add microphone audio
          const micAudioSource = audioContext.createMediaStreamSource(this.audioStream);
          micAudioSource.connect(destination);
          
          // Create final stream with video from display and mixed audio
          finalStream = new MediaStream([
            ...this.stream.getVideoTracks(),
            ...destination.stream.getAudioTracks()
          ]);
        } catch (micError) {
          console.warn('Could not access microphone:', micError);
          // Continue with just system audio
        }
      }
      
      this.recorder = new MediaRecorder(finalStream);
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
      console.error('Error starting screen recording:', error);
      alert('Error starting screen recording: ' + error.message);
    }
  }

  /**
   * Stop screen recording
   */
  _stopRecording() {
    if (this.recorder && this.recorder.state === 'recording') {
      this.recorder.stop();
    }
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        track.stop();
      });
    }
    
    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => {
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
    this.completeBlob = new Blob(this.chunks, {
      type: this.chunks[0].type
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
    if (this.videoSrc && this.videoSrc.startsWith('blob:')) {
      URL.revokeObjectURL(this.videoSrc);
    }
    
    // Clean up any active streams
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => track.stop());
    }
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(ScreenRecorder.tag, ScreenRecorder);