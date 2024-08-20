import { css, html } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";

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
          editPage: "Edit page",
        };
      }
    }
    static get styles() {
      let styles = [];
      if (super.styles) {
        styles = super.styles;
      }
      return [
        styles,
        css`
          .operation-buttons-wrapper {
            display: flex;
            justify-content: flex-end;
            height: 0px;
            margin: 0;
            padding: 0;
          }
          .operation-buttons-wrapper .btn {
            margin: 0 16px 0 0;
            transition: all 0.3s ease-in-out;
          }
          .operation-buttons-wrapper .btn:active {
            opacity: 1;
          }
        `,
      ];
    }
    // this should be called in the template of the theme using it
    // and is intended to be used just above the content container
    // though not required for usage
    HAXCMSRenderOperationButtons() {
      return html`
        ${this.isLoggedIn
          ? html`
              <div class="operation-buttons-wrapper">
                <simple-icon-button-lite
                  class="btn ${this.editMode ? `edit-mode-active` : ``}"
                  icon="hax:page-edit"
                  ?disabled="${this.editMode}"
                  @click="${this._editButtonTap}"
                  >${this.t.editPage}</simple-icon-button-lite
                >
              </div>
            `
          : ``}
      `;
    }
    _editButtonTap(e) {
      this.editMode = !this.editMode;
    }
  };
};
