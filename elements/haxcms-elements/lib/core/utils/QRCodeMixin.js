import { css, html } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import { HAXCMSI18NMixin } from "./HAXCMSI18NMixin.js";

// space kept between the panel, its button and the window edge
const QR_GAP = 8;

/**
 * QRCodeMixin: a "QR code for Current page" button for a theme
 * (this.QRCodeButton() / this.QRCodeButton("right")).
 *
 * The panel is a native popover, so it renders in the browser's top layer:
 * no theme header, sidebar, overflow or z-index can clip it. It is placed
 * from the button's position, toward the requested side ("left": it grows
 * to the left of the button, "right": to the right), below the button when
 * there is room and above it otherwise, and shifted to stay inside the
 * window. The code sits on its own white tile (black on white, so it scans
 * in dark mode). Escape, the close button or a click outside close it, and
 * focus returns to the button. Browsers without the popover API get the
 * same panel as a fixed layer.
 */
const QRCodeMixin = function (SuperClass) {
  return class extends HAXCMSI18NMixin(SuperClass) {
    constructor() {
      super();
      this.showQRCode = false;
      this.__qrDirection = "left";
      this.__qrClosedAt = 0;
      this.__qrOutside = this.__qrOutside.bind(this);
      this.__qrKeydown = this.__qrKeydown.bind(this);
      this.__qrReposition = this.__qrReposition.bind(this);
      this.t.currentPage = "Current page";
      this.t.qrCodeForCurrentPage = "QR code for Current page";
      this.t.qrCode = "QR code";
      if (!this.t.close) {
        this.t.close = "Close";
      }
    }
    /**
     * life cycle, element is afixed to the DOM
     */
    firstUpdated(changedProperties) {
      if (super.firstUpdated) {
        super.firstUpdated(changedProperties);
      }
      // the theme renders a QR code button
      if (this.shadowRoot.querySelector("#qrcodepopover")) {
        this.qrcodebtn = this.shadowRoot.querySelector("#qrcodebtn");
      }
    }

    disconnectedCallback() {
      this.__qrListen(false);
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
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
          .qr-code-btn {
            color: inherit;
            --simple-icon-height: 24px;
            --simple-icon-width: 24px;
          }
          #qrcodebtnwrapper {
            display: inline-flex;
          }
          /* the panel: a DDD card in the top layer, sized to its content */
          #qrcodepopover {
            position: fixed;
            inset: auto;
            margin: var(--ddd-spacing-0);
            box-sizing: border-box;
            width: max-content;
            max-width: calc(100vw - var(--ddd-spacing-4));
            max-height: calc(100vh - var(--ddd-spacing-4));
            overflow: auto;
            padding: var(--ddd-spacing-3);
            border: var(--ddd-border-xs);
            border-color: light-dark(
              var(--ddd-theme-default-limestoneLight),
              var(--ddd-theme-default-slateGray)
            );
            border-radius: var(--ddd-radius-md);
            background-color: light-dark(
              var(--ddd-theme-default-white),
              var(--ddd-theme-default-coalyGray)
            );
            color: light-dark(
              var(--ddd-theme-default-coalyGray),
              var(--ddd-theme-default-white)
            );
            box-shadow: var(--ddd-boxShadow-md);
            font-family: var(--ddd-font-navigation);
            text-align: start;
          }
          #qrcodepopover:not([data-open]) {
            display: none;
          }
          #qrcodepopover[data-open] {
            display: block;
            z-index: var(--ddd-z-modal, 1000);
          }
          .qr-panel-header {
            display: flex;
            align-items: center;
            gap: var(--ddd-spacing-2);
            margin-bottom: var(--ddd-spacing-2);
          }
          .qr-panel-chip {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex: none;
            width: var(--ddd-icon-xxs);
            height: var(--ddd-icon-xxs);
            border-radius: var(--ddd-radius-circle);
            background-color: light-dark(
              var(--ddd-theme-default-beaverBlue),
              var(--ddd-theme-default-skyBlue)
            );
            color: light-dark(
              var(--ddd-theme-default-white),
              var(--ddd-theme-default-potentialMidnight)
            );
            --simple-icon-color: currentColor;
            --simple-icon-width: var(--ddd-icon-4xs);
            --simple-icon-height: var(--ddd-icon-4xs);
          }
          .qr-panel-label {
            flex: 1 1 auto;
            min-width: 0;
            font-size: var(--ddd-font-size-4xs);
            font-weight: var(--ddd-font-weight-medium);
            letter-spacing: 0.06em;
            text-transform: uppercase;
            line-height: var(--ddd-lh-120);
            color: light-dark(
              var(--ddd-theme-default-slateGray),
              var(--ddd-theme-default-limestoneLight)
            );
          }
          :host(:lang(ar)) .qr-panel-label,
          :host(:lang(fa)) .qr-panel-label,
          :host(:lang(he)) .qr-panel-label,
          :host(:lang(ur)) .qr-panel-label,
          :host(:lang(zh)) .qr-panel-label,
          :host(:lang(ja)) .qr-panel-label,
          :host(:lang(ko)) .qr-panel-label {
            letter-spacing: 0;
          }
          .qr-panel-close {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex: none;
            box-sizing: border-box;
            width: var(--ddd-icon-xs);
            height: var(--ddd-icon-xs);
            margin: var(--ddd-spacing-0);
            padding: var(--ddd-spacing-0);
            border: var(--ddd-border-xs);
            border-color: light-dark(
              var(--ddd-theme-default-limestoneLight),
              var(--ddd-theme-default-slateGray)
            );
            border-radius: var(--ddd-radius-circle);
            background-color: var(--ddd-theme-default-potential0);
            color: light-dark(
              var(--ddd-theme-default-nittanyNavy),
              var(--ddd-theme-default-linkLight)
            );
            cursor: pointer;
            --simple-icon-color: currentColor;
            --simple-icon-width: var(--ddd-icon-4xs);
            --simple-icon-height: var(--ddd-icon-4xs);
          }
          .qr-panel-close:hover {
            border-color: currentColor;
          }
          .qr-panel-close:focus-visible {
            outline: var(--ddd-focus-ring);
            outline-offset: var(--ddd-focus-offset);
          }
          #qrcodepopover q-r {
            display: block;
          }
          /* the panel is the frame; keep q-r's white tile and title link */
          #qrcodepopover q-r::part(frame) {
            display: flex;
            border: none;
            border-radius: 0;
            padding: 0;
          }
          @media (forced-colors: active) {
            #qrcodepopover {
              border-color: CanvasText;
            }
          }
        `,
      ];
    }

    QRCodeButton(direction = "left") {
      import("@haxtheweb/q-r/q-r.js");
      this.__qrDirection = direction;
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
          <div
            id="qrcodepopover"
            popover="auto"
            role="dialog"
            aria-labelledby="qrcodelabel"
            @beforetoggle="${this.__qrBeforeToggle}"
            @toggle="${this.__qrToggled}"
          >
            ${
              this.showQRCode
                ? html`
                    <div class="qr-panel-header">
                      <span class="qr-panel-chip" aria-hidden="true">
                        <simple-icon-lite icon="hax:qr-code"></simple-icon-lite>
                      </span>
                      <span class="qr-panel-label" id="qrcodelabel"
                        >${this.t.qrCode} · ${this.t.currentPage}</span
                      >
                      <button
                        type="button"
                        class="qr-panel-close"
                        aria-label="${this.t.close}"
                        title="${this.t.close}"
                        @click="${this.QRCodeClose}"
                      >
                        <simple-icon-lite
                          icon="close"
                          aria-hidden="true"
                        ></simple-icon-lite>
                      </button>
                    </div>
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
                  `
                : ``
            }
          </div>
        </div>
      `;
    }
    QRCodeButtonToggle(_e) {
      // a click on the button while open is also an outside click: the
      // popover has just closed itself, so don't open it again
      if (Date.now() - this.__qrClosedAt < 300) {
        return;
      }
      if (this.showQRCode) {
        this.QRCodeClose();
      } else {
        this.QRCodeOpen();
      }
    }
    /**
     * Show the panel next to the button
     */
    async QRCodeOpen() {
      this.showQRCode = true;
      await this.updateComplete;
      const panel = this.__qrPanel();
      if (!panel) {
        return;
      }
      panel.setAttribute("data-open", "");
      if (this.__qrHasPopover(panel)) {
        if (!panel.matches(":popover-open")) {
          panel.showPopover();
        }
      } else {
        this.__qrListen(true);
      }
      this.__qrReposition();
      // q-r sizes itself once the code is drawn; place it again then
      const qr = panel.querySelector("q-r");
      if (qr && qr.updateComplete) {
        qr.updateComplete.then(() => this.__qrReposition());
      }
      setTimeout(this.__qrReposition, 150);
      const close = panel.querySelector(".qr-panel-close");
      if (close) {
        close.focus();
      }
    }
    /**
     * Hide the panel; focus goes back to the button
     */
    QRCodeClose(_e) {
      const panel = this.__qrPanel();
      if (panel && this.__qrHasPopover(panel)) {
        if (panel.matches(":popover-open")) {
          panel.hidePopover();
          return;
        }
      }
      this.__qrClosed();
    }
    __qrPanel() {
      return this.shadowRoot
        ? this.shadowRoot.querySelector("#qrcodepopover")
        : null;
    }
    __qrHasPopover(panel) {
      return typeof panel.showPopover === "function";
    }
    // closing (pressing the button counts as a click outside): remember
    // when, so that same press doesn't open it again
    __qrBeforeToggle(e) {
      if (e.newState === "closed") {
        this.__qrClosedAt = Date.now();
      }
    }
    // the popover opened or closed (button, Escape, click outside)
    __qrToggled(e) {
      if (e.newState === "open") {
        this.__qrListen(true);
      } else {
        this.__qrClosed();
      }
    }
    __qrClosed() {
      const panel = this.__qrPanel();
      const root = this.shadowRoot;
      const inside =
        panel &&
        root &&
        root.activeElement &&
        panel.contains(root.activeElement);
      const doc = globalThis.document;
      const lost = !doc.activeElement || doc.activeElement === doc.body;
      this.__qrListen(false);
      if (panel) {
        panel.removeAttribute("data-open");
      }
      this.showQRCode = false;
      if (inside || lost) {
        const btn = root ? root.querySelector("#qrcodebtn") : null;
        if (btn) {
          btn.focus();
        }
      }
    }
    // keep the panel placed while open; without the popover API also close
    // on Escape and outside clicks like a popover would
    __qrListen(on) {
      const method = on ? "addEventListener" : "removeEventListener";
      globalThis[method]("resize", this.__qrReposition);
      globalThis[method]("scroll", this.__qrReposition, true);
      const panel = this.__qrPanel();
      if (!panel || !this.__qrHasPopover(panel) || !on) {
        globalThis.document[method]("keydown", this.__qrKeydown);
        globalThis.document[method]("pointerdown", this.__qrOutside, true);
      }
    }
    __qrKeydown(e) {
      if (e.key === "Escape" && this.showQRCode) {
        this.QRCodeClose();
      }
    }
    __qrOutside(e) {
      const panel = this.__qrPanel();
      const btn = this.shadowRoot
        ? this.shadowRoot.querySelector("#qrcodebtn")
        : null;
      const path = e.composedPath ? e.composedPath() : [];
      if (
        this.showQRCode &&
        panel &&
        !path.includes(panel) &&
        !path.includes(btn)
      ) {
        this.QRCodeClose();
      }
    }
    /**
     * Place the panel from the button's position: on the requested side,
     * below the button when it fits (else above), kept inside the window.
     */
    __qrReposition() {
      const panel = this.__qrPanel();
      const btn = this.shadowRoot
        ? this.shadowRoot.querySelector("#qrcodebtn")
        : null;
      if (!panel || !btn || !this.showQRCode) {
        return;
      }
      const pos = this.QRCodePosition(
        btn.getBoundingClientRect(),
        panel.getBoundingClientRect(),
        globalThis.innerWidth || 0,
        globalThis.innerHeight || 0,
        this.__qrDirection,
      );
      panel.style.left = `${pos.left}px`;
      panel.style.top = `${pos.top}px`;
    }
    /**
     * Where the panel goes (viewport px) for a button rect, a panel size, a
     * window size and a direction ("left" grows left from the button's
     * right edge, "right" grows right from its left edge).
     * @returns {Object} { left, top }
     */
    QRCodePosition(button, panel, vw, vh, direction) {
      const w = panel.width;
      const h = panel.height;
      let left = direction === "right" ? button.left : button.right - w;
      // flip to the other side when the requested one runs off the window
      if (direction === "right" && left + w > vw - QR_GAP) {
        left = button.right - w;
      } else if (direction !== "right" && left < QR_GAP) {
        left = button.left;
      }
      left = Math.max(QR_GAP, Math.min(left, vw - w - QR_GAP));
      let top = button.bottom + QR_GAP;
      if (top + h > vh - QR_GAP && button.top - QR_GAP - h >= QR_GAP) {
        top = button.top - QR_GAP - h;
      }
      top = Math.max(QR_GAP, Math.min(top, vh - h - QR_GAP));
      return { left: Math.round(left), top: Math.round(top) };
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
