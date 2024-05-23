import { css, html } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import { HAXCMSI18NMixin } from "./HAXCMSI18NMixin.js";

const QRCodeMixin = function (SuperClass) {
  return class extends HAXCMSI18NMixin(SuperClass) {
    constructor() {
      super();
      this.showQRCode = false;
      this.t.currentPage = "Current page";
      this.t.qrCodeForCurrentPage = "QR code for Current page";
    }
    /**
     * life cycle, element is afixed to the DOM
     */
    firstUpdated(changedProperties) {
      if (super.firstUpdated) {
        super.firstUpdated(changedProperties);
      }
      // hook up the pop over menu with trap to ensure theme is rendering a QR code
      if (this.shadowRoot.querySelector("#qrcodepopover")) {
        this.qrcodebtn = this.shadowRoot.querySelector("#qrcodebtn");
        this.shadowRoot.querySelector("#qrcodepopover").target = this.qrcodebtn;
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
          simple-popover:not(:defined) {
            display: none;
          }
          simple-popover {
            padding: 2px;
          }
          .qr-code-btn {
            color: inherit;
            --simple-icon-height: 24px;
            --simple-icon-width: 24px;
          }
          #qrcodebtnwrapper {
            display: inline-flex;
          }
        `,
      ];
    }

    QRCodeButton(direction = "left") {
      import("@haxtheweb/simple-popover/simple-popover.js");
      import("@haxtheweb/q-r/q-r.js");
      return html`
        <div
          id="qrcodebtnwrapper"
          part="${this.editMode ? `edit-mode-active` : ``}"
        >
          <simple-icon-button-lite
            part="qr-code-btn"
            class="qr-code-btn btn"
            icon="hax:qr-code"
            label="${this.t.qrCodeForCurrentPage}"
            @click="${this.QRCodeButtonToggle}"
            id="qrcodebtn"
          ></simple-icon-button-lite>
          <simple-tooltip for="qrcodebtn" position="${direction}">
            ${this.t.currentPage}
          </simple-tooltip>
          <simple-popover
            ?hidden="${!this.showQRCode}"
            id="qrcodepopover"
            position="${direction}"
            fit-to-visible-bounds
            auto
          >
            ${this.showQRCode
              ? html`
                  <div style="width:190px;height:190px;">
                    <q-r
                      modulesize="4"
                      margin="0"
                      title="${store.activeTitle}"
                      data="${
                        globalThis.location.href.replace(
                          "https://iam",
                          "https://oer",
                        ) /* @hack needs to be from a registry! */
                      }"
                    ></q-r>
                  </div>
                `
              : ``}
          </simple-popover>
        </div>
      `;
    }
    QRCodeButtonToggle(e) {
      this.showQRCode = !this.showQRCode;
    }
    static get properties() {
      let props = {};
      if (super.properties) {
        props = super.properties;
      }
      return {
        ...props,
        showQRCode: {
          type: Boolean,
        },
      };
    }
  };
};

export { QRCodeMixin };
