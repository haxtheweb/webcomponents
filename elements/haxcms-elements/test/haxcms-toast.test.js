// Tests for haxcms-toast — the HAXcms toast notification element.
// Direct import so istanbul instruments haxcms-toast.js.
import { fixture, expect, html } from "@open-wc/testing";
import { haxcmsToastTone } from "../lib/core/haxcms-toast.js";
import { store } from "../lib/core/haxcms-site-store.js";
import { encodeCharacter } from "@haxtheweb/rpg-character/lib/rpg-character-code.js";
import { saveAvatarCode } from "@haxtheweb/rpg-character/lib/rpg-character-avatar.js";

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
      // used for finished results too, so not work in progress on its own
      expect(haxcmsToastTone({ hat: "construction" })).to.equal("info");
      expect(haxcmsToastTone({ walking: true })).to.equal("info");
      const spinner = document.createElement("simple-icon-lite");
      spinner.setAttribute("icon", "hax:loading");
      expect(haxcmsToastTone({ slot: spinner })).to.equal("working");
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
      // let entry fades finish first: Firefox measured contrast mid-fade
      // (#a6a6a6 on white) when the audit ran 30ms after showing
      const finite = (a) => {
        const timing = a.effect && a.effect.getComputedTiming();
        return timing && timing.endTime !== Infinity;
      };
      const running = element
        .getAnimations({ subtree: true })
        .concat(element.shadowRoot.getAnimations())
        .filter(finite);
      await Promise.all(running.map((a) => a.finished.catch(() => {})));
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

    it("drops the Processing spinner when an error replaces it right away", async () => {
      const spinner = document.createElement("simple-icon-lite");
      spinner.setAttribute("icon", "hax:loading");
      show({ text: "Processing", duration: 5000, slot: spinner });
      // no tick between them: an offline request fails before the
      // spinner's slot is added
      show({
        text: "Page save endpoint is not available.",
        duration: 3000,
        fire: true,
        tone: "warning",
      });
      await wait(30);
      await element.updateComplete;
      expect(element.tone).to.equal("warning");
      expect(spinner.parentNode).to.equal(null);
      expect(element.children.length).to.equal(0);
    });

    it("takes the DDD form-status purple for incorrect answers", async () => {
      show({ text: "2 out of 4 correct", duration: 5000, tone: "incorrect" });
      await element.updateComplete;
      expect(element.tone).to.equal("incorrect");
      const styles = getComputedStyle(element);
      const signal = styles
        .getPropertyValue("--ddd-status-incorrect-signal")
        .trim();
      expect(signal).to.not.equal("");
      // the tone colour is the DDD incorrect signal (purple), not warning
      expect(styles.getPropertyValue("--haxcms-toast-tone").trim()).to.equal(
        signal,
      );
      expect(
        element.shadowRoot.querySelector(".hax-ui-sr-only").textContent,
      ).to.contain("Incorrect");
    });

    describe("the person's customized character", () => {
      const knight = encodeCharacter({ preset: "knight", hat: "crown" });
      const character = () => element.shadowRoot.querySelector("rpg-character");
      afterEach(() => {
        globalThis.localStorage.removeItem("rpg-character-avatar:testuser");
      });

      it("draws the seed character when none is saved", async () => {
        element.userName = "testuser";
        show({ text: "Saved", duration: 5000 });
        await element.updateComplete;
        expect(character().getAttribute("seed")).to.equal("testuser");
        expect(character().getAttribute("code")).to.equal("");
        // the toast's default hat stays for characters nobody customized
        expect(character().getAttribute("hat")).to.equal("coffee");
      });

      it("draws the character saved in this browser", async () => {
        globalThis.localStorage.setItem(
          "rpg-character-avatar:testuser",
          knight,
        );
        element.userName = "other";
        await element.updateComplete;
        element.userName = "testuser";
        show({ text: "Saved", duration: 5000 });
        await element.updateComplete;
        expect(character().getAttribute("code")).to.equal(knight);
        // no default hat over theirs
        expect(character().getAttribute("hat")).to.equal("none");
      });

      it("prefers the backend's avatar code", async () => {
        element.userName = "testuser";
        element.avatarCode = knight;
        show({ text: "Saved", duration: 5000 });
        await element.updateComplete;
        expect(character().getAttribute("code")).to.equal(knight);
      });

      it("keeps a hat the caller asked for on top of theirs", async () => {
        element.userName = "testuser";
        element.avatarCode = knight;
        show({ text: "Great job!", duration: 5000, hat: "party" });
        await element.updateComplete;
        expect(character().getAttribute("code")).to.equal(knight);
        expect(character().getAttribute("hat")).to.equal("party");
      });

      it("updates as soon as they save a new character", async () => {
        element.userName = "testuser";
        show({ text: "Saved", duration: 5000 });
        await element.updateComplete;
        expect(character().getAttribute("code")).to.equal("");
        saveAvatarCode("testuser", knight);
        await element.updateComplete;
        expect(character().getAttribute("code")).to.equal(knight);
        // another person's save does not change this toast
        saveAvatarCode("someone-else", "");
        await element.updateComplete;
        expect(character().getAttribute("code")).to.equal(knight);
      });
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
