/**
 * Copyright 2025 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";

/**
 * `simple-file-upload`
 * `Accessible, DDD-styled file upload with XHR, drag-and-drop, and feature parity.`
 *
 * @customElement
 * @element simple-file-upload
 * @class SimpleFileUpload
 * @extends {DDD}
 */
class SimpleFileUpload extends DDD {
  static get tag() {
    return "simple-file-upload";
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          position: relative;
          overflow: visible;
          padding: var(--ddd-spacing-2, 8px);
          border: none;
          font-family: var(--ddd-font-navigation, sans-serif);
          font-size: var(--ddd-font-size-4xs, 10px);
          color: light-dark(
            var(--ddd-theme-default-coalyGray, currentColor),
            var(--ddd-theme-default-white, currentColor)
          );
        }
        :host([dragover]) {
          border-color: var(
            --simple-fields-secondary-accent-color,
            var(--ddd-theme-default-skyBlue, #009dc7)
          );
        }
        :host([nodrop]) {
          pointer-events: none;
        }
        [part="drop-label"] {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          padding: 0;
          width: 100%;
          margin-top: -16px;
          color: inherit;
        }
        [part="drop-label-icon"] {
          display: none;
        }
        [part="file-list"] {
          max-height: 140px;
          overflow-x: hidden;
          overflow-y: auto;
        }
        .file-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--ddd-spacing-1, 4px) 0;
          gap: var(--ddd-spacing-2, 8px);
          border-bottom: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray, #ccc),
              var(--ddd-primary-5, #444)
            );
        }
        .file-row:last-child {
          border-bottom: none;
        }
        .file-info {
          flex: 1 1 auto;
          min-width: 0;
        }
        .file-name {
          font-size: var(--ddd-font-size-4xs, 10px);
          word-break: break-word;
        }
        .file-status {
          font-size: var(--ddd-font-size-5xs);
          opacity: 0.85;
        }
        .file-error {
          color: var(--ddd-theme-default-error, #b40000);
        }
        .file-progress {
          inline-size: 100%;
          block-size: 4px;
          border-radius: var(--ddd-radius-xs, 2px);
          background: light-dark(
            var(--ddd-theme-default-limestoneGray, #ccc),
            var(--ddd-primary-5, #444)
          );
          margin-top: var(--ddd-spacing-1, 4px);
        }
        .file-progress-bar {
          block-size: 100%;
          border-radius: var(--ddd-radius-xs, 2px);
          background: var(--ddd-theme-default-skyBlue, #009dc7);
          transition: inline-size 0.2s ease;
        }
        .file-actions {
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1, 4px);
        }
        .file-actions button {
          background: transparent;
          border: none;
          color: inherit;
          cursor: pointer;
          padding: var(--ddd-spacing-1, 4px);
          font-size: var(--ddd-font-size-5xs);
          line-height: 1;
          border-radius: var(--ddd-radius-xs, 2px);
        }
        .file-actions button:focus-visible {
          outline: var(--ddd-border-xs) solid
            var(--ddd-theme-default-skyBlue, #009dc7);
          outline-offset: 0;
        }
        .drop-zone {
          border: var(--ddd-border-sm) dashed
            light-dark(
              var(--ddd-theme-default-limestoneGray, #ccc),
              var(--ddd-primary-5, #444)
            );
          border-radius: var(--ddd-radius-sm, 2px);
          padding: var(--ddd-spacing-2, 8px);
          text-align: center;
          transition: border-color 0.2s ease;
        }
        .drop-zone[dragover] {
          outline: var(--ddd-drop-zone-outline-width) var(--ddd-drop-zone-outline-style) var(--ddd-drop-zone-outline-color, var(--ddd-theme-default-skyBlue, #009dc7));
          outline-offset: -2px;
          border-color: transparent;
          background: light-dark(
            color-mix(in srgb, var(--ddd-drop-zone-background-color, var(--ddd-theme-default-skyBlue, #009dc7)) 10%, transparent),
            color-mix(in srgb, var(--ddd-drop-zone-background-color, var(--ddd-theme-default-skyBlue, #009dc7)) 20%, transparent)
          );
        }
        .hidden-input {
          position: absolute;
          inline-size: 1px;
          block-size: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        @media (max-width: 640px) {
          [part="file-list"] {
            max-height: 48px;
            font-size: var(--ddd-font-size-5xs);
          }
        }
      `,
    ];
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * Array of files being uploaded / in queue.
       * Each item: { name, progress, status, error, xhr, complete, abort, held, _file }
       */
      files: {
        type: Array,
        attribute: false,
      },
      /**
       * HTTP method for upload requests
       */
      method: {
        type: String,
      },
      /**
       * Target URL for upload requests
       */
      target: {
        type: String,
      },
      /**
       * HTTP headers to include in upload requests
       */
      headers: {
        type: Object,
      },
      /**
       * Accepted file types (e.g. "image/*,.pdf")
       */
      accept: {
        type: String,
      },
      /**
       * Whether to send credentials with requests
       */
      withCredentials: {
        type: Boolean,
        attribute: "with-credentials",
      },
      /**
       * FormData field name for the file
       */
      formDataName: {
        type: String,
        attribute: "form-data-name",
      },
      /**
       * Disable drag-and-drop
       */
      nodrop: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Capture attribute for file input (camera/microphone)
       */
      capture: {
        type: String,
      },
      /**
       * Whether the user is currently dragging over the drop zone
       */
      _dragover: {
        type: Boolean,
        reflect: true,
        attribute: "dragover",
      },
    };
  }

  constructor() {
    super();
    this.files = [];
    this.method = "POST";
    this.target = "";
    this.headers = {};
    this.accept = "";
    this.withCredentials = false;
    this.formDataName = "file";
    this.nodrop = false;
    this.capture = "";
    this._dragover = false;
    this._preventWindowDrop = (e) => {
      e.preventDefault();
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("dragenter", this._onDragEnter);
    this.addEventListener("dragleave", this._onDragLeave);
    this.addEventListener("dragover", this._onDragOver);
    this.addEventListener("drop", this._onDrop);
    window.addEventListener("dragover", this._preventWindowDrop, true);
    window.addEventListener("drop", this._preventWindowDrop, true);
  }

  disconnectedCallback() {
    this.removeEventListener("dragenter", this._onDragEnter);
    this.removeEventListener("dragleave", this._onDragLeave);
    this.removeEventListener("dragover", this._onDragOver);
    this.removeEventListener("drop", this._onDrop);
    window.removeEventListener("dragover", this._preventWindowDrop, true);
    window.removeEventListener("drop", this._preventWindowDrop, true);
    super.disconnectedCallback();
  }

  render() {
    return html`
      <input
        class="hidden-input"
        type="file"
        id="fileInput"
        ?multiple="${true}"
        .accept="${this.accept || ""}"
        .capture="${this.capture || ""}"
        @change="${this._onFileInputChange}"
        aria-hidden="true"
      />
      <slot name="add-button"></slot>
      <div
        class="drop-zone"
        ?dragover="${this._dragover}"
        ?hidden="${this.nodrop}"
        aria-dropeffect="move"
      >
        <slot name="drop-label">
          <span part="drop-label-icon" aria-hidden="true"></span>
          <span part="drop-label">Drop files here</span>
        </slot>
      </div>
      <div part="file-list" role="list" aria-label="Upload queue">
        ${this.files.map(
          (file, index) => html`
            <div class="file-row" role="listitem" aria-label="${file.name}">
              <div class="file-info">
                <div class="file-name">${file.name}</div>
                ${file.error
                  ? html`
                      <div class="file-status file-error">${file.error}</div>
                    `
                  : html`
                      <div class="file-status">
                        ${file.status || "Pending"}
                        ${file.progress > 0 && file.progress < 100
                          ? ` (${file.progress}%)`
                          : ""}
                      </div>
                    `}
                ${file.progress > 0 && file.progress < 100
                  ? html`
                      <div class="file-progress" aria-hidden="true">
                        <div
                          class="file-progress-bar"
                          style="inline-size: ${file.progress}%;"
                        ></div>
                      </div>
                    `
                  : ""}
              </div>
              <div class="file-actions">
                ${!file.complete && !file.abort && !file.error
                  ? html`
                      <button
                        @click="${() => this._abortFile(index)}"
                        aria-label="Cancel upload of ${file.name}"
                        title="Cancel"
                      >
                        ×
                      </button>
                    `
                  : ""}
                ${file.error ||
                file.status === "Cancelled" ||
                file.status === "Aborted"
                  ? html`
                      <button
                        @click="${() => this._retryFile(index)}"
                        aria-label="Retry upload of ${file.name}"
                        title="Retry"
                      >
                        ↻
                      </button>
                    `
                  : ""}
                ${file.complete ||
                file.abort ||
                file.error ||
                file.status === "Cancelled" ||
                file.status === "Aborted"
                  ? html`
                      <button
                        @click="${() => this._removeFile(index)}"
                        aria-label="Remove ${file.name} from queue"
                        title="Remove"
                      >
                        🗑
                      </button>
                    `
                  : ""}
              </div>
            </div>
          `,
        )}
      </div>
      <slot></slot>
    `;
  }

  /**
   * Add a file to the upload queue.
   * @param {File} file
   */
  addFile(file) {
    if (!file || !(file instanceof File)) {
      return;
    }
    // Check accept
    if (this.accept && !this._fileTypeAccepted(file)) {
      const error = `File type not accepted: ${file.name}`;
      this.dispatchEvent(
        new CustomEvent("file-reject", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: {
            file: file,
            error: error,
          },
        }),
      );
      return;
    }
    const uploadFile = {
      name: file.name,
      progress: 0,
      status: "Pending",
      error: "",
      xhr: null,
      complete: false,
      abort: false,
      held: false,
      _file: file,
    };
    this.files = [...this.files, uploadFile];
  }

  /**
   * Handle a drop event by adding files to the queue.
   * @param {DragEvent} event
   */
  handleDrop(event) {
    if (this.nodrop || !event) {
      return;
    }
    if (event.preventDefault) {
      event.preventDefault();
    }
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    this._dragover = false;
    const dataTransfer = event.dataTransfer;
    if (dataTransfer && dataTransfer.files) {
      for (let i = 0; i < dataTransfer.files.length; i++) {
        this.addFile(dataTransfer.files[i]);
      }
    }
    this.uploadFiles();
  }

  /**
   * Start uploading all files in the queue.
   */
  uploadFiles() {
    for (let i = 0; i < this.files.length; i++) {
      const file = this.files[i];
      const canUpload = !file.complete && !file.abort && !file.error && !file.xhr;
      if (canUpload) {
        this._uploadFile(file, i);
      }
    }
  }

  _uploadFile(file, index) {
    if (file.xhr) {
      return;
    }
    const xhr = new XMLHttpRequest();
    file.xhr = xhr;
    file.status = "Preparing";
    this.requestUpdate();

    const formData = new FormData();
    formData.append(this.formDataName || "file", file._file);

    const beforeEvent = new CustomEvent("upload-before", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        file: file._file,
        formData: formData,
        xhr: xhr,
      },
    });
    this.dispatchEvent(beforeEvent);

    if (beforeEvent.defaultPrevented) {
      file.xhr = null;
      file.status = "Pending";
      this.requestUpdate();
      return;
    }

    if (!this.target || !this.method) {
      file.xhr = null;
      file.status = "Pending";
      this.requestUpdate();
      return;
    }

    file.status = "Uploading";
    this.requestUpdate();
    xhr.open(this.method, this.target, true);
    if (this.withCredentials) {
      xhr.withCredentials = true;
    }
    if (this.headers && typeof this.headers === "object") {
      const keys = Object.keys(this.headers);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        xhr.setRequestHeader(key, this.headers[key]);
      }
    }

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        file.progress = Math.round((e.loaded / e.total) * 100);
        this.requestUpdate();
      }
    });

    xhr.addEventListener("load", () => {
      file.progress = 100;
      file.complete = true;
      file.status = xhr.status === 200 ? "Complete" : `Error: ${xhr.status}`;
      if (xhr.status !== 200) {
        file.error = `Upload failed: ${xhr.status}`;
      }
      this.dispatchEvent(
        new CustomEvent("upload-response", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: {
            file: file._file,
            xhr: xhr,
          },
        }),
      );
      this.requestUpdate();
      if (xhr.status === 200) {
        setTimeout(() => {
          this._removeFile(index);
        }, 0);
      }
    });

    xhr.addEventListener("error", () => {
      file.error = "Network error";
      file.status = "Error";
      this.dispatchEvent(
        new CustomEvent("upload-response", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: {
            file: file._file,
            xhr: xhr,
          },
        }),
      );
      this.requestUpdate();
    });

    xhr.addEventListener("abort", () => {
      file.abort = true;
      file.status = "Aborted";
      this.dispatchEvent(
        new CustomEvent("upload-response", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: {
            file: file._file,
            xhr: xhr,
          },
        }),
      );
      this.requestUpdate();
    });

    xhr.send(formData);
  }

  _abortFile(index) {
    const file = this.files[index];
    if (file && file.xhr && typeof file.xhr.abort === "function") {
      file.xhr.abort();
    }
    file.abort = true;
    file.status = "Aborted";
    this.requestUpdate();
  }

  _retryFile(index) {
    const file = this.files[index];
    if (!file) return;
    file.error = "";
    file.status = "Pending";
    file.complete = false;
    file.abort = false;
    file.xhr = null;
    file.progress = 0;
    this.requestUpdate();
    this.uploadFiles();
  }

  _removeFile(index) {
    const newFiles = [...this.files];
    if (index < 0 || index >= newFiles.length) {
      return;
    }
    const file = newFiles[index];
    if (file && file.xhr && typeof file.xhr.abort === "function") {
      file.xhr.abort();
    }
    newFiles.splice(index, 1);
    this.files = newFiles;
  }

  _onFileInputChange(e) {
    const input = e.target;
    if (input && input.files) {
      for (let i = 0; i < input.files.length; i++) {
        this.addFile(input.files[i]);
      }
    }
    // Reset input so the same file can be selected again
    input.value = "";
    this.uploadFiles();
  }

  _onDragEnter(e) {
    if (this.nodrop) return;
    e.preventDefault();
    this._dragover = true;
  }

  _onDragLeave(e) {
    if (this.nodrop) return;
    e.preventDefault();
    if (!this.contains(e.relatedTarget)) {
      this._dragover = false;
    }
  }

  _onDragOver(e) {
    if (this.nodrop) return;
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "move";
    }
  }

  _onDrop(e) {
    this.handleDrop(e);
  }

  _fileTypeAccepted(file) {
    if (!this.accept) return true;
    const acceptedTypes = this.accept.split(",").map((t) => t.trim());
    for (let i = 0; i < acceptedTypes.length; i++) {
      const type = acceptedTypes[i];
      if (type === file.type) return true;
      if (type.endsWith("/*")) {
        const prefix = type.slice(0, -1);
        if (file.type.startsWith(prefix)) return true;
      }
      if (
        type.startsWith(".") &&
        file.name.toLowerCase().endsWith(type.toLowerCase())
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Focus the hidden file input via the add-button slot.
   * This is used by the browse button in simple-fields-upload.
   */
  focusFileInput() {
    const input = this.shadowRoot.querySelector("#fileInput");
    if (input) {
      input.click();
    }
  }
}

globalThis.customElements.define(SimpleFileUpload.tag, SimpleFileUpload);
export { SimpleFileUpload };
