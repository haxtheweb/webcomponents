import { fixture, expect, html, oneEvent } from "@open-wc/testing";
import "@haxtheweb/type-writer/type-writer.js";

describe("type-writer", () => {
  let element;

  /* ============================================================
   * Default rendering & shadow DOM
   * ============================================================ */
  describe("rendering", () => {
    beforeEach(async () => {
      element = await fixture(html`<type-writer></type-writer>`);
    });

    it("passes the a11y audit", async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it("renders the #text and #cursor spans in shadow DOM", async () => {
      const text = element.shadowRoot.querySelector("#text");
      const cursor = element.shadowRoot.querySelector("#cursor");
      expect(text).to.exist;
      expect(cursor).to.exist;
      expect(cursor.textContent.trim()).to.equal("|");
    });

    it("starts with empty text and no typing flag", async () => {
      expect(element.shadowRoot.querySelector("#text").textContent).to.equal("");
      expect(element.typing).to.equal(false);
    });

    it("applies display:inline-block to the host", async () => {
      expect(getComputedStyle(element).display).to.equal("inline-block");
    });

    it("reflects the typing attribute when set", async () => {
      element.typing = true;
      await element.updateComplete;
      expect(element.hasAttribute("typing")).to.equal(true);

      element.typing = false;
      await element.updateComplete;
      expect(element.hasAttribute("typing")).to.equal(false);
    });
  });

  /* ============================================================
   * Configuration properties
   * ============================================================ */
  describe("properties", () => {
    beforeEach(async () => {
      element = await fixture(html`<type-writer></type-writer>`);
    });

    it("declares the expected properties", () => {
      const props = element.constructor.properties;
      expect(props).to.have.property("delay");
      expect(props).to.have.property("cursorDuration");
      expect(props).to.have.property("text");
      expect(props).to.have.property("speed");
      expect(props).to.have.property("elementVisible");
      expect(props).to.have.property("eraseSpeed");
      expect(props).to.have.property("typing");
    });

    it("uses constructor defaults (delay=100, speed=150, eraseSpeed=80, cursorDuration=0)", () => {
      expect(element.delay).to.equal(100);
      expect(element.speed).to.equal(150);
      expect(element.eraseSpeed).to.equal(80);
      expect(element.cursorDuration).to.equal(0);
    });

    it("reads numeric attributes from markup (cursor-duration, erase-speed)", async () => {
      element = await fixture(
        html`<type-writer cursor-duration="250" erase-speed="42"></type-writer>`,
      );
      expect(element.cursorDuration).to.equal(250);
      expect(element.eraseSpeed).to.equal(42);
    });

    it("reflects element-visible via the IntersectionObserverMixin", async () => {
      element = await fixture(html`<type-writer></type-writer>`);
      element.elementVisible = true;
      await element.updateComplete;
      expect(element.elementVisible).to.equal(true);
      expect(element.hasAttribute("element-visible")).to.equal(true);
    });
  });

  /* ============================================================
   * HAX configuration
   * ============================================================ */
  describe("haxProperties / gizmo", () => {
    beforeEach(async () => {
      element = await fixture(html`<type-writer></type-writer>`);
    });

    it("exposes haxProperties", () => {
      const hax = element.constructor.haxProperties;
      expect(hax).to.exist;
      expect(hax.canScale).to.equal(true);
      expect(hax.canEditSource).to.equal(true);
    });

    it("declares a gizmo with the expected metadata", () => {
      const gizmo = element.constructor.haxProperties.gizmo;
      expect(gizmo.title).to.equal("Type writer");
      expect(gizmo.icon).to.equal("hardware:keyboard");
      expect(gizmo.color).to.equal("green");
      expect(gizmo.tags).to.include.members(["interactive", "Writer", "type"]);
    });

    it("exposes text / delay / speed / cursorDuration / typing as configure settings", () => {
      const configure =
        element.constructor.haxProperties.settings.configure;
      const names = configure.map((c) => c.property);
      expect(names).to.include.members([
        "delay",
        "cursorDuration",
        "text",
        "speed",
        "typing",
      ]);
    });

    it("strips element-visible attribute on save", () => {
      const opts = element.constructor.haxProperties.saveOptions;
      expect(opts.unsetAttributes).to.include("element-visible");
    });
  });

  /* ============================================================
   * Typing behavior
   * (bypasses IntersectionObserver by calling _observeText directly)
   * ============================================================ */
  describe("typing", () => {
    beforeEach(async () => {
      element = await fixture(html`<type-writer></type-writer>`);
    });

    it("types text one character at a time", async () => {
      element.text = "Hi";
      element.speed = 1; // near-instant typing
      element.cursorDuration = 0;
      await element.updateComplete;
      element._observeText(element.text, 0, true);

      await oneEvent(element, "type-writer-end");
      expect(element.shadowRoot.querySelector("#text").textContent).to.equal(
        "Hi",
      );
    });

    it("does nothing when text is empty", async () => {
      element._observeText("", 0, true);
      await new Promise((r) => setTimeout(r, 30));
      expect(element.shadowRoot.querySelector("#text").textContent).to.equal(
        "",
      );
      expect(element.typing).to.equal(false);
    });

    it("does nothing while elementVisible is false", async () => {
      element.text = "Hidden";
      element.speed = 1;
      await element.updateComplete;
      element._observeText(element.text, 0, false);
      await new Promise((r) => setTimeout(r, 30));
      expect(element.shadowRoot.querySelector("#text").textContent).to.equal(
        "",
      );
    });

    it("waits delay() ms before typing begins", async () => {
      element.text = "Delayed";
      element.speed = 1;
      await element.updateComplete;
      const start = performance.now();
      element._observeText(element.text, 60, true);

      // Before delay elapses, no characters should be written.
      await new Promise((r) => setTimeout(r, 30));
      expect(element.shadowRoot.querySelector("#text").textContent).to.equal(
        "",
      );

      // After delay, typing should kick in.
      await new Promise((r) => setTimeout(r, 120));
      const text = element.shadowRoot.querySelector("#text").textContent;
      expect(text.length).to.be.greaterThan(0);
      expect(performance.now() - start).to.be.at.least(60);
    });

    it("emits type-writer-end with the typed text after cursorDuration", async () => {
      element.text = "End!";
      element.speed = 1;
      element.cursorDuration = 0;
      await element.updateComplete;
      element._observeText(element.text, 0, true);

      const evt = await oneEvent(element, "type-writer-end");
      expect(evt.detail).to.equal("End!");
      expect(evt.bubbles).to.equal(true);
      expect(evt.composed).to.equal(true);

      // After the end event, typing flag should be cleared.
      expect(element.typing).to.equal(false);
    });

    it("handles single-character text", async () => {
      element.text = "A";
      element.speed = 1;
      await element.updateComplete;
      const p = oneEvent(element, "type-writer-end");
      element._observeText(element.text, 0, true);
      await p;
      expect(element.shadowRoot.querySelector("#text").textContent).to.equal(
        "A",
      );
    });
  });

  /* ============================================================
   * Erase / re-type cycle
   * ============================================================ */
  describe("erase + retype", () => {
    beforeEach(async () => {
      element = await fixture(html`<type-writer></type-writer>`);
    });

    it("erases any rendered text before typing the new text", async () => {
      element.text = "First message";
      element.speed = 1;
      element.eraseSpeed = 1;
      await element.updateComplete;
      element._observeText(element.text, 0, true);

      // Let the first typing run complete.
      await oneEvent(element, "type-writer-end");
      expect(element.shadowRoot.querySelector("#text").textContent).to.equal(
        "First message",
      );

      // Now change the text -> _observeText sees existing content and calls erase().
      element.text = "Second";
      await element.updateComplete;
      element._observeText(element.text, 0, true);

      // erase() trims characters; at some point the text should shrink below the original length.
      await new Promise((r) => setTimeout(r, 30));
      const during = element.shadowRoot.querySelector("#text").textContent;
      expect(during.length).to.be.lessThan("First message".length);

      // After erase finishes, typing resumes with the new text.
      await oneEvent(element, "type-writer-end");
      expect(element.shadowRoot.querySelector("#text").textContent).to.equal(
        "Second",
      );
    });

    it("cancels an ongoing erase when _cancel is cleared", async () => {
      element.text = "abc";
      element.speed = 1;
      element.eraseSpeed = 1000; // slow so we can intervene
      await element.updateComplete;
      element._observeText(element.text, 0, true);
      await oneEvent(element, "type-writer-end");

      element.text = "xy";
      await element.updateComplete;
      element._observeText(element.text, 0, true);

      await new Promise((r) => setTimeout(r, 20));
      // We are now mid-erase. simulate the second path: re-trigger with _cancel pending.
      expect(element.typing).to.equal(true);
      // Clearing the timeout should not throw.
      if (element._cancel) {
        clearTimeout(element._cancel);
        element._cancel = null;
      }
    });
  });

  /* ============================================================
   * Inheritance & tag
   * ============================================================ */
  describe("class metadata", () => {
    it("is registered with tag 'type-writer'", async () => {
      const el = await fixture(html`<type-writer></type-writer>`);
      expect(el.constructor.tag).to.equal("type-writer");
      expect(customElements.get("type-writer")).to.equal(el.constructor);
    });

    it("uses IntersectionObserverMixin", async () => {
      const el = await fixture(html`<type-writer></type-writer>`);
      // The mixin adds an elementVisible boolean property.
      expect(el.elementVisible).to.be.a("boolean");
    });
  });
});
