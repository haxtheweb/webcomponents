import { css, html } from "lit";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";

export const HAXCMSOperationButtons = function (SuperClass) {
  return class extends SuperClass {
    constructor() {
      super();
      if (!this.t) {
        this.t = {};
      }
      if (this.t) {
        this.t = {
          ...this.t,
          edit: "Edit",
          save: "Save",
          cancel: "Cancel",
          editStack: "Edit stack",
          import: "Import",
          archive: "Archive",
        };
      }
    }
    static get styles() {
      let styles = [];
      if (super.styles) {
        styles = super.styles;
      }
      return [
        ...styles,
        css`
          .operation-buttons-wrapper {
            display: flex;
            justify-content: flex-end;
            height: 0px;
            margin: 0;
            padding: 0;
            color: var(--simple-colors-default-theme-orange-7, orange);
            background-color: var(
              --simple-colors-default-theme-orange-1,
              white
            );
          }
          .operation-buttons-wrapper .btn {
            display: inline-flex;
            margin: 0 16px 0 0;
            height: 12px;
            max-width: 200px;
            opacity: 0.8;
            transition: all 0.3s ease-in-out;
          }
          .operation-buttons-wrapper .btn:hover,
          .operation-buttons-wrapper .btn:focus {
            opacity: 0.9;
          }
          .operation-buttons-wrapper .btn:active {
            opacity: 1;
            color: #000000;
          }
          .operation-buttons-wrapper .btn[part="edit-mode-active"] {
            opacity: 1;
          }
        `,
      ];
    }
    // this should be called in the template of the theme using it
    // and is intended to be used just above the content container
    // though not required for usage
    HAXCMSRenderOperationButtons() {
      import("@lrnwebcomponents/simple-icon/simple-icon.js");
      import("@lrnwebcomponents/simple-icon/lib/simple-icons.js");
      import("@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js");
      return html`
        <div class="operation-buttons-wrapper">
          <simple-icon-button-lite
            class="btn ${this.editMode ? `edit-mode-active` : ``}"
            icon="lrn:write"
            @click="${this._editButtonTap}"
            >${!this.editMode
              ? this.t.edit
              : this.t.save}</simple-icon-button-lite
          >
          <simple-icon-button-lite
            class="btn"
            icon="lrn:content"
            @click="${this._editButtonTap}"
            >${this.t.editStack}</simple-icon-button-lite
          >
          <simple-icon-button-lite class="btn" icon="icons:archive"
            >${this.t.archive}</simple-icon-button-lite
          >
          <simple-icon-button-lite class="btn" icon="icons:file-upload"
            >${this.t.import}</simple-icon-button-lite
          >
        </div>
      `;
    }
    _editButtonTap(e) {
      this.editMode = !this.editMode;
      // save button shifted to edit
      if (!this.editMode) {
        this.dispatchEvent(
          new CustomEvent("haxcms-save-node", {
            bubbles: true,
            composed: true,
            cancelable: false,
            detail: store.activeItem,
          })
        );
      }
      globalThis.dispatchEvent(
        new CustomEvent("simple-modal-hide", {
          bubbles: true,
          cancelable: true,
          detail: {},
        })
      );
    }
    _cancelButtonTap(e) {
      this.editMode = false;
      this.dispatchEvent(
        new CustomEvent("hax-cancel", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: e.detail,
        })
      );
      globalThis.dispatchEvent(
        new CustomEvent("simple-modal-hide", {
          bubbles: true,
          cancelable: true,
          detail: {},
        })
      );
    }
  };
};
