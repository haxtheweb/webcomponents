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
    this.__winEvents = this.__winEvents || {};
    this.__winEvents = {
      ...this.__winEvents,
      "place-holder-file-drop": "_placeHolderFileDrop",
      "hax-file-upload": "_uploadFile",
    };
    autorun(() => {
      this._editModeChanged(toJS(HAXStore.editMode));
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
    // @todo put in logic to support the response actually
    // just outright returning a haxElement. This is rare
    // but if the HAX developer has control over the endpoint
    // then they could get HAX to streamline some workflows
    // or by-pass the gizmo selection step to improve UX
    // for end users even further. Examples could be a media
    // management system that has remote rendering (cms-token)
    // or a highly specific endpoint that we know we can only
    // present in one way effectively Box / Google doc viewer.
    this.newAssetConfigure();
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
    // ! I can't believe this actually works. This takes the event
    // ! that was a drop event else where on the page and then repoints
    // ! it to simulate the drop event using the same event structure that
    // ! would have happened if they had used this element in the first place
    this.shadowRoot.querySelector("#fileupload")._onDrop(e.detail);
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
    // ! I can't believe this actually works. This takes the event
    // ! that was a drop event else where on the page and then repoints
    // ! it to simulate the drop event using the same event structure that
    // ! would have happened if they had used this element in the first place
    this.shadowRoot.querySelector("#fileupload")._addFile(e.detail.file);
  }
}

customElements.define(HaxTrayUpload.tag, HaxTrayUpload);
export { HaxTrayUpload };
