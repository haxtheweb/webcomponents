import { fixture, expect, html } from "@open-wc/testing";
import "../product-card.js";

describe("debug collapse mode", () => {
  it("prints rendered structure", async () => {
    const el = await fixture(html`<product-card title="t"></product-card>`);
    await el.updateComplete;
    const collapses = el.shadowRoot.querySelectorAll("a11y-collapse");
    collapses.forEach((c, i) => {
      console.log(`--- collapse ${i} ---`);
      console.log("headingButton prop:", c.headingButton);
      console.log("accordion prop:", c.accordion);
      console.log("heading prop:", JSON.stringify(c.heading));
      console.log("label prop:", JSON.stringify(c.label));
      console.log("tooltip prop:", JSON.stringify(c.tooltip));
      console.log("has native button:", !!c.shadowRoot.querySelector("button"));
      console.log(
        "has simple-icon-button-lite:",
        !!c.shadowRoot.querySelector("simple-icon-button-lite"),
      );
      const sib = c.shadowRoot.querySelector("simple-icon-button-lite");
      if (sib) {
        console.log("sib.label:", JSON.stringify(sib.label));
        console.log(
          "sib inner button aria-label:",
          JSON.stringify(sib.shadowRoot.querySelector("button")?.getAttribute("aria-label")),
        );
      }
      const tip = c.shadowRoot.querySelector("simple-tooltip");
      if (tip) {
        console.log("tooltip textContent:", JSON.stringify(tip.textContent));
      }
      // dump the full shadow HTML of the collapse for inspection
      console.log("collapse shadowHTML:", c.shadowRoot.innerHTML.replace(/\s+/g, " ").slice(0, 800));
    });
    expect(true).to.be.true;
  });

  // walk every element and penetrate nested shadow roots
  function allShadows(root, acc = []) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
    const seen = new Set();
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.shadowRoot && !seen.has(node.shadowRoot)) {
        seen.add(node.shadowRoot);
        acc.push(node);
        allShadows(node.shadowRoot, acc);
      }
    }
    return acc;
  }

  it("runs a11y audit directly", async () => {
    const el = await fixture(html`<product-card title="test-title"></product-card>`);
    await el.updateComplete;
    console.log("product-card count in body:", document.querySelectorAll("product-card").length);
    // hard settle: let all microtasks + a frame flush
    await new Promise((r) => setTimeout(r, 100));
    const collapses = el.shadowRoot.querySelectorAll("a11y-collapse");
    collapses.forEach((c, i) => {
      console.log(
        `collapse ${i} AFTER settle: hasButton=${!!c.shadowRoot.querySelector("button")} hasSIB=${!!c.shadowRoot.querySelector("simple-icon-button-lite")}`,
      );
    });
    await expect(el).shadowDom.to.be.accessible();
  });
});
