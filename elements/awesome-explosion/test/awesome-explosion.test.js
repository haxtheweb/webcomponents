import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import { AwesomeExplosion } from "../awesome-explosion.js";

describe("awesome-explosion test", () => {
  let element;
  beforeEach(async () => {
    globalThis.localStorage.removeItem("awesome-explosion-sound-enabled");
    delete globalThis.audio;
    element = await fixture(html`<awesome-explosion></awesome-explosion>`);
    // the constructor wires its event listeners inside a setTimeout
    await aTimeout(50);
  });

  describe("Basic instantiation and properties", () => {
    it("element is an instance of AwesomeExplosion", async () => {
      expect(element).to.be.instanceOf(AwesomeExplosion);
    });

    it("has correct tag name", async () => {
      expect(AwesomeExplosion.tag).to.equal("awesome-explosion");
    });

    it("element has correct default properties", async () => {
      const el = await fixture(html`<awesome-explosion></awesome-explosion>`);
      expect(el.state).to.equal("stop");
      expect(el.size).to.equal("medium");
      expect(el.color).to.equal("");
      expect(el.resetSound).to.be.false;
      expect(el.soundEnabled).to.be.true;
      expect(el.disabled).to.be.false;
      expect(el.image).to.include("explode.gif");
      expect(el.sound).to.include("fireworks.mp3");
      expect(el.stopped).to.be.true;
      expect(el.playing).to.be.false;
      expect(el.paused).to.be.false;
    });

    it("has haxProperties pointing at its schema file", async () => {
      expect(AwesomeExplosion.haxProperties).to.be.a("string");
      expect(AwesomeExplosion.haxProperties).to.include(
        "awesome-explosion.haxProperties.json",
      );
    });
  });

  describe("Rendering and DOM structure", () => {
    it("renders the image with button semantics", async () => {
      const img = element.shadowRoot.querySelector("#image");
      expect(img).to.exist;
      expect(img.getAttribute("role")).to.equal("button");
      expect(img.getAttribute("aria-pressed")).to.equal("false");
      expect(img.getAttribute("loading")).to.equal("lazy");
      expect(img.src).to.include("explode.gif");
    });

    it("includes a visually hidden description", async () => {
      const span = element.shadowRoot.querySelector(".visually-hidden");
      expect(span).to.exist;
      expect(span.textContent.trim()).to.equal(
        "Click or hover to play explosion sound",
      );
    });

    it("shows sound disabled text when sound is off", async () => {
      element.soundEnabled = false;
      await element.updateComplete;
      const span = element.shadowRoot.querySelector(".visually-hidden");
      expect(span.textContent.trim()).to.equal(
        "Visual explosion effect (sound disabled)",
      );
    });

    it("reflects size, color, and toggles to attributes", async () => {
      element.size = "epic";
      element.color = "red";
      element.soundEnabled = false;
      element.disabled = true;
      await element.updateComplete;
      expect(element.getAttribute("size")).to.equal("epic");
      expect(element.getAttribute("color")).to.equal("red");
      // Lit reflects booleans as attribute presence, not "true"/"false" values
      expect(element.hasAttribute("sound-enabled")).to.be.false;
      expect(element.hasAttribute("disabled")).to.be.true;
    });
  });

  describe("Alt text and aria label generation", () => {
    it("builds alt text from size and color", async () => {
      expect(element._getAltText().trim()).to.equal("explosion animation");
      element.size = "large";
      await element.updateComplete;
      expect(element._getAltText().trim()).to.equal(
        "large explosion animation",
      );
      element.color = "purple";
      await element.updateComplete;
      expect(element._getAltText().trim()).to.equal(
        "large purple explosion animation",
      );
    });

    it("builds aria label from playing state and sound", async () => {
      expect(element._getAriaLabel()).to.equal(
        "Explosion animation stopped with sound. Click to toggle.",
      );
      element.state = "play";
      await element.updateComplete;
      expect(element._getAriaLabel()).to.equal(
        "Explosion animation playing with sound. Click to toggle.",
      );
      element.soundEnabled = false;
      await element.updateComplete;
      expect(element._getAriaLabel()).to.include("(muted)");
    });
  });

  describe("State transitions and events", () => {
    it("toggles state via clicks", async () => {
      element.click();
      await element.updateComplete;
      expect(element.state).to.equal("play");
      expect(element.playing).to.be.true;
      // playing is set during updated(), so the aria-pressed flip lands on
      // the follow-up render pass rather than the first one
      await element.updateComplete;
      const img = element.shadowRoot.querySelector("#image");
      expect(img.getAttribute("aria-pressed")).to.equal("true");
      element.click();
      await element.updateComplete;
      await element.updateComplete;
      expect(element.state).to.equal("stop");
      expect(element.stopped).to.be.true;
    });

    it("responds to keyboard activation", async () => {
      element.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
      await element.updateComplete;
      expect(element.state).to.equal("play");
      element.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      await element.updateComplete;
      expect(element.state).to.equal("stop");
    });

    it("ignores keys other than space and enter", async () => {
      element.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
      await element.updateComplete;
      expect(element.state).to.equal("stop");
    });

    it("dispatches awesome-event on each state change", async () => {
      const events = [];
      const handler = (e) => events.push(e.detail.message);
      element.addEventListener("awesome-event", handler);
      element.state = "play";
      await element.updateComplete;
      element.state = "pause";
      await element.updateComplete;
      element.state = "stop";
      await element.updateComplete;
      element.removeEventListener("awesome-event", handler);
      expect(events).to.deep.equal([
        "Sound played",
        "Sound paused",
        "Sound stopped",
      ]);
    });

    it("plays audio on play state and resets it when asked", async () => {
      element.state = "play";
      await element.updateComplete;
      expect(globalThis.audio).to.exist;
      expect(globalThis.audio.volume).to.equal(0.1);
      // stub the global audio so we can verify stop/reset behavior
      globalThis.audio = { paused: false, pause() {}, currentTime: 7 };
      element.resetSound = true;
      element.state = "stop";
      await element.updateComplete;
      expect(globalThis.audio.currentTime).to.equal(0);
      expect(element.stopped).to.be.true;
    });

    it("pause state stops the sound and flags paused", async () => {
      globalThis.audio = { paused: false, pause() {}, currentTime: 3 };
      element.state = "pause";
      await element.updateComplete;
      expect(element.paused).to.be.true;
      expect(element.playing).to.be.false;
    });

    it("skips playing audio when sound is disabled", async () => {
      element.soundEnabled = false;
      await element.updateComplete;
      element.state = "play";
      await element.updateComplete;
      expect(element.playing).to.be.true;
      expect(globalThis.audio).to.not.exist;
    });
  });

  describe("Hover interactions", () => {
    it("plays on hover and pauses on mouse out", async () => {
      element.dispatchEvent(new MouseEvent("mouseover"));
      await element.updateComplete;
      expect(element.state).to.equal("play");
      element.dispatchEvent(new MouseEvent("mouseout"));
      await element.updateComplete;
      expect(element.state).to.equal("pause");
    });

    it("does not play on hover when sound is disabled", async () => {
      element.soundEnabled = false;
      await element.updateComplete;
      element.dispatchEvent(new MouseEvent("mouseover"));
      await element.updateComplete;
      expect(element.state).to.equal("stop");
    });
  });

  describe("Disabled state", () => {
    it("ignores interactions while disabled", async () => {
      element.disabled = true;
      await element.updateComplete;
      element.click();
      element.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      element.dispatchEvent(new MouseEvent("mouseover"));
      element.dispatchEvent(new MouseEvent("mouseout"));
      await element.updateComplete;
      expect(element.state).to.equal("stop");
    });

    it("skips playing audio while disabled", async () => {
      element.disabled = true;
      await element.updateComplete;
      element.state = "play";
      await element.updateComplete;
      expect(globalThis.audio).to.not.exist;
    });
  });

  describe("User preferences", () => {
    it("reads sound preference from localStorage", async () => {
      globalThis.localStorage.setItem(
        "awesome-explosion-sound-enabled",
        "false",
      );
      const elOff = await fixture(html`<awesome-explosion></awesome-explosion>`);
      expect(elOff.soundEnabled).to.be.false;
      globalThis.localStorage.setItem(
        "awesome-explosion-sound-enabled",
        "true",
      );
      const elOn = await fixture(html`<awesome-explosion></awesome-explosion>`);
      expect(elOn.soundEnabled).to.be.true;
      globalThis.localStorage.removeItem("awesome-explosion-sound-enabled");
    });

    it("respects prefers-reduced-motion", async () => {
      const originalMatchMedia = globalThis.matchMedia;
      globalThis.matchMedia = () => ({ matches: true });
      try {
        const el = await fixture(html`<awesome-explosion></awesome-explosion>`);
        await aTimeout(50);
        // reduced motion preference disables sound entirely
        expect(el.soundEnabled).to.be.false;
        el.soundEnabled = true;
        el._playSound();
        expect(globalThis.audio).to.not.exist;
        el._handleMouseOver();
        expect(el.state).to.equal("stop");
      } finally {
        globalThis.matchMedia = originalMatchMedia;
      }
    });
  });

  describe("External wiring helpers", () => {
    it("has play/stop helpers for external wiring", async () => {
      element._setPlaySound();
      await element.updateComplete;
      expect(element.state).to.equal("play");
      element._setStopSound();
      await element.updateComplete;
      expect(element.state).to.equal("pause");
    });
  });

  describe("Accessibility", () => {
    it("passes the a11y audit", async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it("is keyboard focusable by default", async () => {
      expect(element.tabIndex).to.equal(0);
    });
  });
});
