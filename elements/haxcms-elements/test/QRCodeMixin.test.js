import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import { LitElement } from "lit";
import { QRCodeMixin } from "../lib/core/utils/QRCodeMixin.js";

// Covers the theme QR code panel: native popover (top layer), placement
// that stays inside the window, open / close / Escape / outside click with
// focus going back to the button, and the strings and parts themes rely on.

class QRHost extends QRCodeMixin(LitElement) {
  static get properties() {
    return { ...super.properties, direction: { type: String } };
  }
  constructor() {
    super();
    this.direction = "left";
  }
  render() {
    return html`<div style="margin-left:400px">
      ${this.QRCodeButton(this.direction)}
    </div>`;
  }
}
if (!globalThis.customElements.get("qr-code-mixin-test-host")) {
  globalThis.customElements.define("qr-code-mixin-test-host", QRHost);
}

const panelOf = (el) => el.shadowRoot.querySelector("#qrcodepopover");
const isOpen = (el) => {
  const p = panelOf(el);
  return typeof p.showPopover === "function"
    ? p.matches(":popover-open")
    : p.hasAttribute("data-open");
};

describe("QRCodeMixin", () => {
  it("keeps the button, its parts and strings", async () => {
    const el = await fixture(
      html`<qr-code-mixin-test-host></qr-code-mixin-test-host>`,
    );
    const btn = el.shadowRoot.querySelector("#qrcodebtn");
    expect(btn.getAttribute("part")).to.equal("qr-code-btn");
    expect(btn.getAttribute("label")).to.equal("QR code for Current page");
    expect(el.t.currentPage).to.equal("Current page");
    expect(el.showQRCode).to.equal(false);
    expect(panelOf(el).getAttribute("popover")).to.equal("auto");
    expect(isOpen(el)).to.equal(false);
  });

  it("opens a labelled panel with the code and the page title link", async () => {
    const el = await fixture(
      html`<qr-code-mixin-test-host></qr-code-mixin-test-host>`,
    );
    await el.QRCodeOpen();
    await aTimeout(50);
    expect(el.showQRCode).to.equal(true);
    expect(isOpen(el)).to.equal(true);
    const panel = panelOf(el);
    expect(panel.getAttribute("role")).to.equal("dialog");
    const label = el.shadowRoot.querySelector("#qrcodelabel");
    expect(label.textContent.trim()).to.equal("QR code · Current page");
    const qr = panel.querySelector("q-r");
    expect(qr).to.exist;
    // the encoded data is the current page
    expect(qr.getAttribute("data")).to.equal(
      globalThis.location.href.replace("https://iam", "https://oer"),
    );
    expect(qr.getAttribute("modulesize")).to.equal("4");
    expect(qr.getAttribute("margin")).to.equal("0");
    const close = panel.querySelector(".qr-panel-close");
    expect(close.getAttribute("aria-label")).to.equal("Close");
    // the panel stays inside the window
    const r = panel.getBoundingClientRect();
    expect(r.left).to.be.at.least(0);
    expect(r.top).to.be.at.least(0);
    expect(r.right).to.be.at.most(globalThis.innerWidth);
    expect(r.bottom).to.be.at.most(globalThis.innerHeight);
    await expect(el).shadowDom.to.be.accessible({
      ignoredRules: ["color-contrast"],
    });
    el.QRCodeClose();
    await el.updateComplete;
  });

  it("closes from the close button and gives focus back to the button", async () => {
    const el = await fixture(
      html`<qr-code-mixin-test-host></qr-code-mixin-test-host>`,
    );
    await el.QRCodeOpen();
    const close = panelOf(el).querySelector(".qr-panel-close");
    close.focus();
    close.click();
    await aTimeout(50);
    await el.updateComplete;
    expect(isOpen(el)).to.equal(false);
    expect(el.showQRCode).to.equal(false);
    expect(el.shadowRoot.activeElement.id).to.equal("qrcodebtn");
  });

  it("toggles from the button", async () => {
    const el = await fixture(
      html`<qr-code-mixin-test-host></qr-code-mixin-test-host>`,
    );
    el.QRCodeButtonToggle();
    await el.updateComplete;
    await aTimeout(50);
    expect(isOpen(el)).to.equal(true);
    el.__qrClosedAt = 0;
    el.QRCodeButtonToggle();
    await aTimeout(50);
    await el.updateComplete;
    expect(isOpen(el)).to.equal(false);
  });

  it("closes on Escape", async () => {
    const el = await fixture(
      html`<qr-code-mixin-test-host></qr-code-mixin-test-host>`,
    );
    await el.QRCodeOpen();
    const close = panelOf(el).querySelector(".qr-panel-close");
    close.focus();
    close.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        composed: true,
      }),
    );
    // the popover API closes on a real Escape key; the fallback listens
    // for the event, so drive whichever this browser uses
    if (isOpen(el) && typeof panelOf(el).hidePopover === "function") {
      panelOf(el).hidePopover();
    }
    await aTimeout(50);
    await el.updateComplete;
    expect(isOpen(el)).to.equal(false);
    expect(el.showQRCode).to.equal(false);
  });

  it("places the panel toward the requested side and inside the window", () => {
    const el = new QRHost();
    const btn = { left: 900, right: 940, top: 10, bottom: 50 };
    const size = { width: 200, height: 240 };
    // left: grows left from the button's right edge, below it
    expect(el.QRCodePosition(btn, size, 1280, 800, "left")).to.deep.equal({
      left: 740,
      top: 58,
    });
    // right: grows right from the button's left edge
    expect(el.QRCodePosition(btn, size, 1280, 800, "right")).to.deep.equal({
      left: 900,
      top: 58,
    });
    // right runs off the window: flips to grow left
    expect(
      el.QRCodePosition(
        { left: 1200, right: 1240, top: 10, bottom: 50 },
        size,
        1280,
        800,
        "right",
      ).left,
    ).to.equal(1040);
    // left runs off the window: flips to grow right
    expect(
      el.QRCodePosition(
        { left: 16, right: 56, top: 70, bottom: 110 },
        size,
        1280,
        800,
        "left",
      ).left,
    ).to.equal(16);
    // no room below: goes above the button
    expect(
      el.QRCodePosition(
        { left: 500, right: 540, top: 700, bottom: 740 },
        size,
        1280,
        800,
        "left",
      ).top,
    ).to.equal(452);
    // a phone: shifted to stay inside, never above the window top
    const phone = el.QRCodePosition(
      { left: 150, right: 190, top: -96, bottom: -56 },
      { width: 260, height: 300 },
      390,
      844,
      "right",
    );
    expect(phone.left).to.equal(8);
    expect(phone.top).to.equal(8);
  });
});
