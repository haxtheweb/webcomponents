import { fixture, expect, html } from "@open-wc/testing";

import "../lib/hax-cancel-dialog.js";
import { HaxUiDialogConfirm } from "@haxtheweb/d-d-d/lib/HaxUiDialogFrame.js";

describe("hax-cancel-dialog", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`<hax-cancel-dialog></hax-cancel-dialog>`);
    await el.updateComplete;
  });

  it("instantiates", () => {
    expect(el.tagName.toLowerCase()).to.equal("hax-cancel-dialog");
    expect(el.t.cancelTitle).to.equal("Confirm Cancel");
    expect(el.t.cancelYes).to.equal("Yes");
    expect(el.t.cancelNo).to.equal("No");
  });

  it("has cancelWithoutSaving text", () => {
    expect(el.t.cancelWithoutSaving).to.contain("changes");
  });

  it("keeps #dialog for hax-store to open it from the tray", () => {
    const dialog = el.shadowRoot.querySelector("#dialog");
    expect(dialog).to.exist;
    expect(dialog.getAttribute("modal-id")).to.equal("hax-cancel");
    expect(typeof dialog.associateEvents).to.equal("function");
  });

  describe("the admin confirm card", () => {
    it("is a destructive hax-confirm-dialog with the same labels", () => {
      const card = el.shadowRoot.querySelector("#hax-cancel-confirm");
      expect(card.tagName.toLowerCase()).to.equal("hax-confirm-dialog");
      expect(card.hasAttribute("destructive")).to.equal(true);
      expect(card.getAttribute("message")).to.equal(el.t.cancelWithoutSaving);
      expect(card.getAttribute("confirm-label")).to.equal("Yes");
      expect(card.getAttribute("cancel-label")).to.equal("No");
    });

    it("passes the confirm card frame to the modal", () => {
      const dialog = el.shadowRoot.querySelector("#dialog");
      const cs = getComputedStyle(dialog);
      expect(cs.getPropertyValue("--simple-modal-width").trim()).to.equal(
        HaxUiDialogConfirm["--simple-modal-width"],
      );
      expect(
        cs.getPropertyValue("--simple-modal-titlebar-height").trim(),
      ).to.equal("auto");
    });
  });

  describe("confirming", () => {
    it("answers with simple-modal-confirmed and the modal's invokedBy", () => {
      const modal = globalThis.SimpleModal.requestAvailability();
      const trigger = globalThis.document.createElement("button");
      modal.invokedBy = trigger;
      const card = globalThis.document.createElement("hax-confirm-dialog");
      card.id = "hax-cancel-confirm";
      globalThis.document.body.appendChild(card);
      let detail = null;
      const handler = (e) => {
        detail = e.detail;
      };
      globalThis.addEventListener("simple-modal-confirmed", handler);
      card.dispatchEvent(
        new CustomEvent("hax-confirm-dialog-confirm", {
          bubbles: true,
          composed: true,
        }),
      );
      globalThis.removeEventListener("simple-modal-confirmed", handler);
      card.remove();
      expect(detail).to.exist;
      expect(detail.invokedBy).to.equal(trigger);
      expect(detail.opened).to.equal(false);
    });

    it("ignores other confirm cards", () => {
      const card = globalThis.document.createElement("hax-confirm-dialog");
      card.id = "something-else";
      globalThis.document.body.appendChild(card);
      let fired = false;
      const handler = () => {
        fired = true;
      };
      globalThis.addEventListener("simple-modal-confirmed", handler);
      card.dispatchEvent(
        new CustomEvent("hax-confirm-dialog-confirm", {
          bubbles: true,
          composed: true,
        }),
      );
      globalThis.removeEventListener("simple-modal-confirmed", handler);
      card.remove();
      expect(fired).to.equal(false);
    });
  });

  describe("focusInitial", () => {
    it("does not throw when shadowRoot exists", () => {
      expect(() => el.focusInitial()).to.not.throw();
    });

    it("returns early when no shadowRoot", () => {
      const originalSR = el.shadowRoot;
      Object.defineProperty(el, "shadowRoot", {
        get() {
          return null;
        },
        configurable: true,
      });
      expect(() => el.focusInitial()).to.not.throw();
      Object.defineProperty(el, "shadowRoot", {
        get() {
          return originalSR;
        },
        configurable: true,
      });
    });
  });
});
