import { html, css } from "lit";
import { HAXStore } from "./hax-store.js";
import { HaxUploadField } from "./hax-upload-field.js";
import { autorun, toJS } from "mobx";

class HaxTrayUpload extends HaxUploadField {
  /**
   * Convention we use
   */
  static get tag() {
    return "hax-tray-upload";
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.hideInput = true;
    // Enable screen recording for the tray upload
    this.noScreenRecord = false;
    this.__mediaBatchTotal = 0;
    this.__mediaBatch = [];
    this.__mediaBatchPlaceHolder = null;
    this.__winEvents = this.__winEvents || {};
    this.__winEvents = {
      ...this.__winEvents,
      "place-holder-file-drop": "_placeHolderFileDrop",
      "hax-file-upload": "_uploadFile",
    };
    autorun(() => {
      const _mobx_val_0 = toJS(HAXStore.editMode);
      Promise.resolve().then(() => {
        this._editModeChanged(_mobx_val_0);
      });
    });
  }
  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "t") {
        this.label = this.t.uploadMedia;
      }
    });
  }
  _editModeChanged(editMode) {
    if (
      !editMode &&
      this.shadowRoot &&
      this.shadowRoot.querySelector("#fileupload")
    ) {
      this.shadowRoot.querySelector("#fileupload").files = [];
    }
  }
  /**
   * Respond to successful file upload, now inject url into url field and
   * do a gizmo guess from there!
   */
  _fileUploadResponse(e) {
    super._fileUploadResponse(e);
    // if we don't have a URL we shouldn't do asset configuration
    // the super class if successful will have set the #url field to a parsed value
    if (e.detail.xhr.status === 200 && this.shadowRoot.querySelector("#url")) {
      // Handle image dropped on a media player for thumbnail assignment
      if (HAXStore.__mediaThumbnailTarget) {
        const file = e.detail.file;
        if (file && file.type && file.type.startsWith("image/")) {
          HAXStore.__mediaThumbnailTarget.thumbnailSrc =
            this.shadowRoot.querySelector("#url").value;
          HAXStore.__mediaThumbnailTarget = null;
          if (
            HAXStore.activePlaceHolder &&
            HAXStore.activePlaceHolder.parentNode
          ) {
            HAXStore.activePlaceHolder.remove();
          }
          HAXStore.activePlaceHolder = null;
          this.option = "fileupload";
          return;
        }
      }

      // Handle batch media uploads into a media-playlist
      if (this.__mediaBatchTotal > 0) {
        const file = e.detail.file;
        const isMedia =
          file &&
          ((file.type &&
            (file.type.startsWith("audio/") ||
              file.type.startsWith("video/"))) ||
            /\.(mp3|mp4|webm|ogg|wav|mov|mkv|avi|m4a|m4v)$/i.test(
              file.name,
            ));
        if (isMedia) {
          this.__mediaBatch.push({
            url: this.shadowRoot.querySelector("#url").value,
            name: file.name,
            type: file.type,
          });
          if (this.__mediaBatch.length >= this.__mediaBatchTotal) {
            const playlist =
              globalThis.document.createElement("media-playlist");
            this.__mediaBatch.forEach((item) => {
              const isAudio =
                (item.type && item.type.startsWith("audio/")) ||
                /\.(mp3|ogg|wav|m4a|flac|aac)$/i.test(item.name);
              const media = globalThis.document.createElement(
                isAudio ? "audio-player" : "video-player",
              );
              media.source = item.url;
              media.mediaTitle = item.name;
              playlist.appendChild(media);
            });
            if (
              HAXStore.activeHaxBody &&
              this.__mediaBatchPlaceHolder
            ) {
              HAXStore.activeHaxBody.haxReplaceNode(
                this.__mediaBatchPlaceHolder,
                playlist,
              );
            }
            HAXStore.activePlaceHolder = null;
            HAXStore.activeNode = playlist;
            globalThis.dispatchEvent(
              new CustomEvent("hax-drop-focus-event", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: playlist,
              }),
            );
            this.__mediaBatchTotal = 0;
            this.__mediaBatch = [];
            this.__mediaBatchPlaceHolder = null;
            this.option = "fileupload";
            return;
          }
          this.option = "fileupload";
          return;
        }
      }

      this.newAssetConfigure();
      // ensures that if we have selfie / audio it closes those widgets
      this.option = "fileupload";
    }
  }

  _canUpload() {
    return !this.__allowUpload;
  }

  /**
   * Configure asset after upload or URL passed in.
   */
  newAssetConfigure() {
    let values = {
      source: this.shadowRoot.querySelector("#url").value,
      title: this.shadowRoot.querySelector("#url").value,
    };
    HAXStore.insertLogicFromValues(values, this);
  }
  /**
   * A file event was detected from a drag and drop in the interface, most likely
   * from a place-holder tag
   */
  _placeHolderFileDrop(e) {
    // reference the active place holder element since place holders are
    // the only things possible for seeing these
    HAXStore.activePlaceHolder = e.detail.placeHolderElement;
    // Check for multiple media files to batch into a media-playlist
    const files = Array.from(e.detail.dataTransfer.files || []);
    const mediaFiles = files.filter((f) => {
      const type = f.type || "";
      const name = f.name || "";
      return (
        type.startsWith("audio/") ||
        type.startsWith("video/") ||
        /\.(mp3|mp4|webm|ogg|wav|mov|mkv|avi|m4a|m4v)$/i.test(name)
      );
    });
    if (mediaFiles.length >= 2) {
      this.__mediaBatchTotal = mediaFiles.length;
      this.__mediaBatch = [];
      this.__mediaBatchPlaceHolder = HAXStore.activePlaceHolder;
    } else {
      this.__mediaBatchTotal = 0;
      this.__mediaBatch = [];
      this.__mediaBatchPlaceHolder = null;
    }
    // ! I can't believe this actually works. This takes the event
    // ! that was a drop event else where on the page and then repoints
    // ! it to simulate the drop event using the same event structure that
    // ! would have happened if they had used this element in the first place
    this.shadowRoot.querySelector("#fileupload").handleDrop(e.detail);
  }
  /**
   * A file event was detected from a drag and drop in the interface, most likely
   * from a place-holder tag
   */
  _uploadFile(e) {
    // reference the active place holder element since place holders are
    // the only things possible for seeing these
    HAXStore.activePlaceHolder = e.detail.placeHolderElement;
    HAXStore.activePlaceHolderOperationType = e.detail.operationType;
    // store the callback if provided
    HAXStore.activePlaceHolderCallback = e.detail.callback;
    // ! I can't believe this actually works. This takes the event
    // ! that was a drop event else where on the page and then repoints
    // ! it to simulate the drop event using the same event structure that
    // ! would have happened if they had used this element in the first place
    this.shadowRoot.querySelector("#fileupload").addFile(e.detail.file);
    this.shadowRoot.querySelector("#fileupload").uploadFiles();
  }
}

globalThis.customElements.define(HaxTrayUpload.tag, HaxTrayUpload);
export { HaxTrayUpload };
