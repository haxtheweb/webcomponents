// Tests for haxcms-toast — the HAXcms toast notification element.
// Direct import so istanbul instruments haxcms-toast.js.
import { fixture, expect, html } from "@open-wc/testing";
import { haxcmsToastTone } from "../lib/core/haxcms-toast.js";
import { store } from "../lib/core/haxcms-site-store.js";

describe("haxcms-toast", () => {
  let element;
  let saved = {};

  beforeEach(async () => {
    saved = {
      darkMode: store.darkMode,
      userData: store.userData,
    };
    store.darkMode = false;
    store.userData = { userName: "testuser" };
    element = await fixture(html`<haxcms-toast></haxcms-toast>`);
  });

  afterEach(() => {
    store.darkMode = saved.darkMode;
    store.userData = saved.userData;
  });

  it("instantiates with the correct tag", () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("haxcms-toast");
  });

  it("has the expected static tag property", () => {
    const ctor = customElements.get("haxcms-toast");
    expect(ctor.tag).to.equal("haxcms-toast");
  });

  it("has static styles that return an array", () => {
    const ctor = customElements.get("haxcms-toast");
    const styles = ctor.styles;
    expect(Array.isArray(styles)).to.equal(true);
    expect(styles.length).to.be.greaterThan(0);
  });

  it("sets characterHeight and characterWidth in constructor", () => {
    expect(element.characterHeight).to.equal(40);
    expect(element.characterWidth).to.equal(40);
  });

  it("reflects store.userData.userName onto element after autorun settles", async () => {
    store.userData = { userName: "newuser" };
    await new Promise((r) => setTimeout(r, 0));
    expect(element.userName).to.equal("newuser");
  });

  it("reflects store.darkMode onto element after autorun settles", async () => {
    store.darkMode = true;
    await new Promise((r) => setTimeout(r, 0));
    expect(element.darkMode).to.equal(true);
  });

  describe("connectedCallback", () => {
    it("responds to haxcms-toast-hide event by hiding toast", () => {
      // The event listener is bound with .bind(this) in connectedCallback,
      // so we test behavior (awaitingMerlinInput cleared + hide called)
      // rather than method override.
      element.alwaysvisible = false;
      element.awaitingMerlinInput = true;
      globalThis.dispatchEvent(new CustomEvent("haxcms-toast-hide"));
      expect(element.awaitingMerlinInput).to.equal(false);
    });
  });

  describe("hideSimpleToast", () => {
    it("hides the toast when alwaysvisible is false", () => {
      element.alwaysvisible = false;
      element.awaitingMerlinInput = true;
      element.hideSimpleToast({});
      expect(element.awaitingMerlinInput).to.equal(false);
    });

    it("does not hide when alwaysvisible is true", () => {
      element.alwaysvisible = true;
      element.awaitingMerlinInput = true;
      element.hideSimpleToast({});
      expect(element.awaitingMerlinInput).to.equal(true);
    });
  });

  describe("disconnectedCallback", () => {
    it("aborts windowControllers without throwing", () => {
      expect(() => element.disconnectedCallback()).to.not.throw();
    });
  });

  describe("HAXCMSToast.requestAvailability", () => {
    it("returns the singleton instance", () => {
      const instance = globalThis.HAXCMSToast.requestAvailability();
      expect(instance).to.exist;
      expect(instance.tagName.toLowerCase()).to.equal("haxcms-toast");
      // calling again should return the same instance
      const instance2 = globalThis.HAXCMSToast.requestAvailability();
      expect(instance2).to.equal(instance);
    });
  });

  describe("HAX UI toast", () => {
    const show = (detail) =>
      element.showSimpleToast({ detail: Object.assign({}, detail) });
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));

    it("works out a tone from what callers already send", () => {
      expect(haxcmsToastTone({ hat: "error" })).to.equal("danger");
      expect(haxcmsToastTone({ hat: "construction" })).to.equal("working");
      expect(haxcmsToastTone({ walking: true })).to.equal("working");
      expect(haxcmsToastTone({ merlin: true, hat: "error" })).to.equal(
        "assistant",
      );
      expect(haxcmsToastTone({ hat: "random" })).to.equal("info");
      expect(haxcmsToastTone({ tone: "success", hat: "error" })).to.equal(
        "success",
      );
      expect(haxcmsToastTone({ tone: "nonsense" })).to.equal("info");
      expect(haxcmsToastTone(null)).to.equal("info");
    });

    it("shows the message, character and close button", async () => {
      show({ text: "Page saved", hat: "random", duration: 5000 });
      await element.updateComplete;
      expect(element.opened).to.be.true;
      expect(element.tone).to.equal("info");
      const root = element.shadowRoot;
      expect(root.querySelector(".message").textContent).to.contain(
        "Page saved",
      );
      expect(root.querySelector("rpg-character").getAttribute("hat")).to.equal(
        "random",
      );
      expect(root.querySelector(".close").getAttribute("aria-label")).to.equal(
        "Close",
      );
      expect(element.getAttribute("role")).to.equal("status");
    });

    it("announces a problem as an alert, with the tone in words", async () => {
      show({ text: "Could not save", hat: "error", duration: 5000 });
      await element.updateComplete;
      expect(element.tone).to.equal("danger");
      expect(element.getAttribute("role")).to.equal("alert");
      expect(element.getAttribute("aria-live")).to.equal("assertive");
      expect(element.shadowRoot.querySelector(".body").textContent).to.contain(
        "Problem:",
      );
    });

    it("stays until closed when the duration is 0", async () => {
      show({ text: "View only mode", duration: 0 });
      await element.updateComplete;
      expect(element.duration).to.equal(0);
      expect(element.sticky).to.be.true;
      await wait(700);
      expect(element.opened).to.be.true;
      element.shadowRoot.querySelector(".close").click();
      await element.updateComplete;
      expect(element.opened).to.be.false;
    });

    it("pauses its timer while hovered or focused", async () => {
      show({ text: "Saved", duration: 300 });
      await element.updateComplete;
      element.dispatchEvent(new Event("pointerenter"));
      expect(element.paused).to.be.true;
      await wait(500);
      expect(element.opened).to.be.true;
      element.dispatchEvent(new Event("pointerleave"));
      expect(element.paused).to.be.false;
      await wait(600);
      expect(element.opened).to.be.false;
    });

    it("closes with Escape and fires its eventCallback as before", async () => {
      let fired = 0;
      const onDone = () => fired++;
      globalThis.addEventListener("toast-test-done", onDone);
      show({ text: "Saved", duration: 5000, eventCallback: "toast-test-done" });
      await element.updateComplete;
      element.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
      await element.updateComplete;
      globalThis.removeEventListener("toast-test-done", onDone);
      expect(element.opened).to.be.false;
      expect(fired).to.equal(1);
    });

    it("shows a caller's slotted button as an action", async () => {
      const button = document.createElement("button");
      button.innerText = "Exit view only mode";
      show({ text: "View only", duration: 0, slot: button });
      await wait(30);
      await element.updateComplete;
      expect(button.parentNode).to.equal(element);
      expect(
        element.shadowRoot.querySelector(".actions").classList.contains("has"),
      ).to.be.true;
      await expect(element).shadowDom.to.be.accessible();
    });

    it("leaves out the old spinner for work in progress", async () => {
      const spinner = document.createElement("simple-icon-lite");
      spinner.setAttribute("icon", "hax:loading");
      show({
        text: "Processing",
        hat: "construction",
        walking: true,
        duration: 5000,
        slot: spinner,
      });
      await wait(30);
      await element.updateComplete;
      expect(element.tone).to.equal("working");
      expect(
        element.shadowRoot.querySelector(".actions").classList.contains("has"),
      ).to.be.false;
    });

    it("uses Merlin's icon for the assistant", async () => {
      show({ text: "Thinking", merlin: true, duration: 5000 });
      await element.updateComplete;
      expect(element.tone).to.equal("assistant");
      expect(element.shadowRoot.querySelector(".merlin-icon")).to.exist;
      expect(element.shadowRoot.querySelector("rpg-character")).to.equal(null);
    });
  });
});
