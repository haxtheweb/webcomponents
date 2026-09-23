import { fixture, expect, html } from "@open-wc/testing";
import "../lib/block-quote.js";

describe("block-quote test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <block-quote citation="Albert Einstein">
        <span slot="quote"
          >Imagination is more important than knowledge.</span
        >
      </block-quote>
    `);
  });

  it("basic setup", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("block-quote");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Slot and citation rendering", () => {
    it("renders the citation when provided", () => {
      const citation = element.shadowRoot.querySelector("#citation p");
      expect(citation).to.exist;
      expect(citation.textContent).to.contain("Albert Einstein");
    });

    it("renders the quote slot content", () => {
      const slot = element.shadowRoot.querySelector('slot[name="quote"]');
      expect(slot).to.exist;
      const assignedNodes = slot.assignedNodes({ flatten: true });
      expect(assignedNodes.length).to.be.greaterThan(0);
      expect(assignedNodes[0].textContent).to.contain(
        "Imagination is more important",
      );
    });

    it("omits the citation paragraph when no citation is set", async () => {
      const el = await fixture(html`
        <block-quote><span slot="quote">Just a quote</span></block-quote>
      `);
      await el.updateComplete;
      const citation = el.shadowRoot.querySelector("#citation p");
      expect(citation).to.not.exist;
      await expect(el).shadowDom.to.be.accessible();
    });
  });

  describe("dataTextAlign property", () => {
    it("has correct default value", () => {
      expect(element.dataTextAlign).to.equal("center");
    });

    it("reflects dataTextAlign to the data-text-align attribute", async () => {
      element.dataTextAlign = "left";
      await element.updateComplete;
      expect(element.getAttribute("data-text-align")).to.equal("left");
      await expect(element).shadowDom.to.be.accessible();
    });

    it("applies the expected text-align to #wrap for each value", async () => {
      const values = ["left", "center", "right", "justify"];
      for (const value of values) {
        element.dataTextAlign = value;
        await element.updateComplete;
        const wrap = element.shadowRoot.querySelector("#wrap");
        const styles = globalThis.getComputedStyle(wrap);
        expect(styles.textAlign).to.equal(value);
        await expect(element).shadowDom.to.be.accessible();
      }
    });
  });

  describe("noBorder property", () => {
    it("has correct default value", () => {
      expect(element.noBorder).to.equal(false);
    });

    it("reflects noBorder to the no-border attribute", async () => {
      element.noBorder = true;
      await element.updateComplete;
      expect(element.hasAttribute("no-border")).to.be.true;
      await expect(element).shadowDom.to.be.accessible();
    });

    it("removes the left border when no-border is set", async () => {
      element.noBorder = true;
      await element.updateComplete;
      const wrap = element.shadowRoot.querySelector("#wrap");
      const styles = globalThis.getComputedStyle(wrap);
      expect(styles.borderLeftStyle).to.equal("none");
      await expect(element).shadowDom.to.be.accessible();
    });

    it("keeps the left border by default", async () => {
      const wrap = element.shadowRoot.querySelector("#wrap");
      const styles = globalThis.getComputedStyle(wrap);
      expect(styles.borderLeftStyle).to.not.equal("none");
    });
  });

  describe("Attribute to property mapping", () => {
    it("sets dataTextAlign from the data-text-align attribute", async () => {
      const el = await fixture(html`
        <block-quote data-text-align="right">
          <span slot="quote">Aligned right</span>
        </block-quote>
      `);
      expect(el.dataTextAlign).to.equal("right");
      await expect(el).shadowDom.to.be.accessible();
    });

    it("sets noBorder from the no-border attribute", async () => {
      const el = await fixture(html`
        <block-quote no-border>
          <span slot="quote">No border</span>
        </block-quote>
      `);
      expect(el.noBorder).to.equal(true);
      await expect(el).shadowDom.to.be.accessible();
    });
  });

  describe("DDD design system data attribute integration", () => {
    it("remains accessible across data-border values", async () => {
      const borders = ["xs", "sm", "md", "lg"];
      for (const value of borders) {
        const el = await fixture(html`
          <block-quote data-border="${value}">
            <span slot="quote">Border ${value}</span>
          </block-quote>
        `);
        await el.updateComplete;
        await expect(el).shadowDom.to.be.accessible();
      }
    });

    it("remains accessible across data-border-radius values", async () => {
      const radii = ["xs", "sm", "md", "lg", "xl"];
      for (const value of radii) {
        const el = await fixture(html`
          <block-quote data-border-radius="${value}">
            <span slot="quote">Radius ${value}</span>
          </block-quote>
        `);
        await el.updateComplete;
        await expect(el).shadowDom.to.be.accessible();
      }
    });

    it("remains accessible with data-box-shadow", async () => {
      const el = await fixture(html`
        <block-quote data-box-shadow="sm">
          <span slot="quote">Shadowed quote</span>
        </block-quote>
      `);
      await el.updateComplete;
      await expect(el).shadowDom.to.be.accessible();
    });

    it("remains accessible with data-accent and data-primary", async () => {
      const el = await fixture(html`
        <block-quote data-accent="0" data-primary="2">
          <span slot="quote">Colored quote</span>
        </block-quote>
      `);
      await el.updateComplete;
      await expect(el).shadowDom.to.be.accessible();
    });

    it("remains accessible with data-padding and data-margin", async () => {
      const el = await fixture(html`
        <block-quote data-padding="m" data-margin="center">
          <span slot="quote">Spaced quote</span>
        </block-quote>
      `);
      await el.updateComplete;
      await expect(el).shadowDom.to.be.accessible();
    });
  });

  describe("HAX Properties and Integration", () => {
    let props;
    beforeEach(async () => {
      const url = element.constructor.haxProperties;
      expect(url).to.be.a("string");
      const response = await fetch(url);
      props = await response.json();
    });

    it("has haxProperties defined", () => {
      expect(props).to.exist;
      expect(props.gizmo).to.exist;
      expect(props.settings).to.exist;
      expect(props.settings.configure).to.exist;
    });

    it("opts into the DDD design system with accent/primary/card", () => {
      expect(props.designSystem).to.be.an("object");
      expect(props.designSystem.accent).to.equal(true);
      expect(props.designSystem.primary).to.equal(true);
      expect(props.designSystem.card).to.equal(true);
      expect(props.designSystem.text).to.equal(false);
      expect(props.designSystem.designTreatment).to.equal(false);
    });
  });
});
