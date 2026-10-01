import { fixture, expect, html } from "@open-wc/testing";
import { ElmslnLoading } from "../elmsln-loading.js";

describe("elmsln-loading test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<elmsln-loading></elmsln-loading>`);
  });

  describe("Basic instantiation and properties", () => {
    it("element is an instance of ElmslnLoading", async () => {
      expect(element).to.be.instanceOf(ElmslnLoading);
    });

    it("has correct tag name", async () => {
      expect(ElmslnLoading.tag).to.equal("elmsln-loading");
    });

    it("element has correct default properties", async () => {
      const el = await fixture(html`<elmsln-loading></elmsln-loading>`);
      expect(el.size).to.equal("medium");
      expect(el.dark).to.be.false;
    });
  });

  describe("Rendering and DOM structure", () => {
    it("renders a spinning simple-icon", async () => {
      const icon = element.shadowRoot.querySelector("simple-icon");
      expect(icon).to.exist;
      expect(icon.getAttribute("icon")).to.equal("lrn:network");
    });

    it("passes accent color, contrast, and dark to the icon", async () => {
      element.contrast = 4;
      element.dark = true;
      await element.updateComplete;
      const icon = element.shadowRoot.querySelector("simple-icon");
      expect(icon.getAttribute("accent-color")).to.be.a("string");
      expect(icon.getAttribute("contrast")).to.equal("4");
      expect(icon.hasAttribute("dark")).to.be.true;
    });

    it("reflects size to the attribute", async () => {
      element.size = "epic";
      await element.updateComplete;
      expect(element.getAttribute("size")).to.equal("epic");
    });
  });

  describe("Accent color selection", () => {
    it("sets accentColor when a valid color is given", async () => {
      element.color = "red";
      await element.updateComplete;
      expect(element.accentColor).to.equal("red");
      // accentColor is set during updated(), so the icon attribute flips on the
      // follow-up render pass rather than the first one
      await element.updateComplete;
      const icon = element.shadowRoot.querySelector("simple-icon");
      expect(icon.getAttribute("accent-color")).to.equal("red");
    });

    it("strips the -text suffix from colors", async () => {
      element.color = "blue-text";
      await element.updateComplete;
      expect(element.accentColor).to.equal("blue");
    });

    it("ignores invalid colors", async () => {
      const before = element.accentColor;
      element.color = "not-a-color";
      await element.updateComplete;
      expect(element.accentColor).to.equal(before);
    });

    it("only switches accent color while unset or grey", async () => {
      element.color = "red";
      await element.updateComplete;
      element.color = "blue";
      await element.updateComplete;
      // once an accent color is locked in, a later color does not replace it
      expect(element.accentColor).to.equal("red");
    });
  });

  describe("Accessibility", () => {
    it("passes the a11y audit", async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it("announces the loading state with role=status and an aria-label", async () => {
      const icon = element.shadowRoot.querySelector("simple-icon");
      expect(icon.getAttribute("role")).to.equal("status");
      expect(icon.getAttribute("aria-label")).to.equal("Loading");
    });
  });
});
