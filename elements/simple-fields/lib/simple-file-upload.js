/**
 * Copyright 2025 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `simple-file-upload`
 * `Accessible, DDD-styled file upload with XHR, drag-and-drop, and feature parity.`
 *
 * @customElement
 * @element simple-file-upload
 * @class SimpleFileUpload
 * @extends {DDD}
 */
class SimpleFileUpload extends I18NMixin(DDD) {
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
          border-bottom: var(--ddd-border-size-xs) solid
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
          outline: var(--ddd-border-size-xs) solid
            var(--ddd-theme-default-skyBlue, #009dc7);
          outline-offset: 0;
        }
        .drop-zone {
          border-radius: var(--ddd-radius-sm, 2px);
          padding: var(--ddd-spacing-2, 8px);
          text-align: center;
          transition: border-color 0.2s ease;
        }
        .drop-zone[dragover] {
          outline: var(--ddd-drop-zone-outline-width)
            var(--ddd-drop-zone-outline-style)
            var(
              --ddd-drop-zone-outline-color,
              var(--ddd-theme-default-skyBlue, #009dc7)
            );
          outline-offset: -2px;
          border-color: transparent;
          background: light-dark(
            color-mix(
              in srgb,
              var(
                  --ddd-drop-zone-background-color,
                  var(--ddd-theme-default-skyBlue, #009dc7)
                )
                10%,
              transparent
            ),
            color-mix(
              in srgb,
              var(
                  --ddd-drop-zone-background-color,
                  var(--ddd-theme-default-skyBlue, #009dc7)
                )
                20%,
              transparent
            )
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
    this.t = this.t || {};
    this.t = {
      ...this.t,
      dropFilesHere: "Drop files here",
      uploadQueue: "Upload queue",
      pending: "Pending",
      preparing: "Preparing",
      uploading: "Uploading",
      complete: "Complete",
      aborted: "Aborted",
      cancelled: "Cancelled",
      error: "Error",
      errorWithStatus: "Error: {status}",
      cancel: "Cancel",
      cancelUploadOf: "Cancel upload of {name}",
      retry: "Retry",
      retryUploadOf: "Retry upload of {name}",
      remove: "Remove",
      removeFromQueue: "Remove {name} from queue",
      fileTypeNotAccepted: "File type not accepted: {name}",
      uploadFailed: "Upload failed: {status}",
      networkError: "Network error",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../locales/", import.meta.url).href,
    });
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
    globalThis.addEventListener("dragover", this._preventWindowDrop, true);
    globalThis.addEventListener("drop", this._preventWindowDrop, true);
  }

  disconnectedCallback() {
    this.removeEventListener("dragenter", this._onDragEnter);
    this.removeEventListener("dragleave", this._onDragLeave);
    this.removeEventListener("dragover", this._onDragOver);
    this.removeEventListener("drop", this._onDrop);
    globalThis.removeEventListener("dragover", this._preventWindowDrop, true);
    globalThis.removeEventListener("drop", this._preventWindowDrop, true);
    super.disconnectedCallback();
  }

  render() {
    return html`
      <!--
        The hidden file input is reached via .click() (focusFileInput) but
        is otherwise not part of the keyboard tab order or the AT tree.
        tabindex="-1" removes it from the tab sequence; aria-hidden="true"
        hides it from the accessibility tree. Together they satisfy the
        aria-hidden-focus axe rule (focusable content must not be aria-hidden
        OR must be in the tab order).
      -->
      <input
        class="hidden-input"
        type="file"
        id="fileInput"
        tabindex="-1"
        ?multiple="${true}"
        .accept="${this.accept || ""}"
        .capture="${this.capture || ""}"
        @change="${this._onFileInputChange}"
        aria-hidden="true"
      />
      <slot name="add-button"></slot>
      <div
        class="drop-zone"
        part="drop-zone"
        ?dragover="${this._dragover}"
        ?hidden="${this.nodrop}"
        aria-dropeffect="move"
      >
        <slot name="drop-label">
          <span part="drop-label-icon" aria-hidden="true"></span>
          <span part="drop-label">${this.t.dropFilesHere}</span>
        </slot>
      </div>
      <div part="file-list" role="list" aria-label="${this.t.uploadQueue}">
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
                        ${this._statusLabel(file.status)}
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
                        aria-label="${this.t.cancelUploadOf.replace(
                          "{name}",
                          () => file.name,
                        )}"
                        title="${this.t.cancel}"
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
                        aria-label="${this.t.retryUploadOf.replace(
                          "{name}",
                          () => file.name,
                        )}"
                        title="${this.t.retry}"
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
                        aria-label="${this.t.removeFromQueue.replace(
                          "{name}",
                          () => file.name,
                        )}"
                        title="${this.t.remove}"
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
   * Translate an internal file status value for display. Status values
   * stay in English internally because they are compared in logic.
   * @param {String} status
   */
  _statusLabel(status) {
    const labels = {
      Pending: this.t.pending,
      Preparing: this.t.preparing,
      Uploading: this.t.uploading,
      Complete: this.t.complete,
      Aborted: this.t.aborted,
      Cancelled: this.t.cancelled,
      Error: this.t.error,
    };
    if (!status) {
      return this.t.pending;
    }
    if (labels[status]) {
      return labels[status];
    }
    const errorStatus = /^Error: (.*)$/.exec(status);
    if (errorStatus) {
      return this.t.errorWithStatus.replace("{status}", () => errorStatus[1]);
    }
    return status;
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
      const error = this.t.fileTypeNotAccepted.replace(
        "{name}",
        () => file.name,
      );
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
   * Start uploading all pending files in the queue, ONE AT A TIME.
   * #3050: sequential uploads prevent server-call flooding when a user drops
   * many files at once and keep per-file progress perceptible. Each file's
   * full XHR lifecycle (load / error / abort) is awaited before the next file
   * starts, for every consumer of <simple-file-upload>.
   */
  async uploadFiles() {
    // Snapshot the pending files so removals mid-loop (a successful upload
    // splices itself out of this.files) don't drift the iteration index.
    const pending = this.files.filter(
      (f) => !f.complete && !f.abort && !f.error && !f.xhr,
    );
    for (let i = 0; i < pending.length; i++) {
      await this._uploadFile(pending[i]);
    }
  }

  /**
   * Upload a single queued file via XHR. Returns a Promise that resolves once
   * the XHR reaches a terminal state (load / error / abort) or is skipped
   * (already uploading / cancelled before send / no target), so callers can
   * await the full lifecycle before starting the next file (#3050).
   */
  _uploadFile(file) {
    return new Promise((resolve) => {
      if (file.xhr) {
        resolve(false);
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
        resolve(false);
        return;
      }

      if (!this.target || !this.method) {
        file.xhr = null;
        file.status = "Pending";
        this.requestUpdate();
        resolve(false);
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
          file.error = this.t.uploadFailed.replace(
            "{status}",
            () => xhr.status,
          );
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
          // Remove by reference so the index stays correct regardless of
          // other removals shifting this.files underneath us.
          setTimeout(() => {
            const idx = this.files.indexOf(file);
            if (idx !== -1) {
              this._removeFile(idx);
            }
          }, 0);
        }
        resolve(xhr.status === 200);
      });

      xhr.addEventListener("error", () => {
        file.error = this.t.networkError;
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
        resolve(false);
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
        resolve(false);
      });

      xhr.send(formData);
    });
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
    // Note: do not auto-call uploadFiles() here. Caller decides when to
    // start the next lifecycle (e.g. the user clicks Retry). Auto-call
    // would synchronously push status from "Pending" to "Uploading" via
    // _uploadFile's setup before this method even returns, making the
    // post-retry Pending state unobservable.
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
    // relatedTarget may be a node inside the host element (light DOM child)
    // OR a node inside our shadow DOM (the drop-zone, file-list, etc.).
    // `this.contains` only reaches light DOM descendants, so also check the
    // shadow root so dragleave on a shadow-DOM child doesn't clear the
    // dragover state.
    const target = e.relatedTarget;
    if (
      !target ||
      (!this.contains(target) &&
        !(this.shadowRoot && this.shadowRoot.contains(target)))
    ) {
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
