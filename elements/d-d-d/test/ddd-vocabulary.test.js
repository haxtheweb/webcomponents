import { html, fixture, expect } from "@open-wc/testing";
import { LitElement } from "lit";
import { DDDVocabulary, DDD_VOCABULARY } from "../lib/DDDVocabulary.js";
import "../d-d-d.js";
import { DDDAllStyles } from "../lib/DDDStyles.js";
import "../lib/ddd-card.js";
import "../lib/ddd-steps-list.js";

class VocabProbe extends DDDVocabulary(LitElement) {
  static get properties() {
    return {
      ...super.properties,
      status: { type: String },
      large: { type: Boolean },
    };
  }
  static get dddVocabulary() {
    return {
      variant: { from: "status", values: { stop: "danger", info: "brand" } },
      size: { from: "large", values: { true: "l" }, default: "m" },
    };
  }
  render() {
    return html`<slot></slot>`;
  }
}
globalThis.customElements.define("ddd-vocab-probe", VocabProbe);

describe("DDDVocabulary", () => {
  it("names three words with a fixed set of values", () => {
    expect(Object.keys(DDD_VOCABULARY)).to.deep.equal([
      "variant",
      "appearance",
      "size",
    ]);
  });

  it("translates an existing attribute into the shared word", async () => {
    const el = await fixture(
      html`<ddd-vocab-probe status="stop" large></ddd-vocab-probe>`,
    );
    expect(el.dddWord("variant")).to.equal("danger");
    expect(el.dddWord("size")).to.equal("l");
    expect(el.dddWord("appearance")).to.equal(null);
    expect(el.matches(":state(variant-danger)")).to.equal(true);
    expect(el.matches(":state(size-l)")).to.equal(true);
  });

  it("falls back to the declared default", async () => {
    const el = await fixture(html`<ddd-vocab-probe></ddd-vocab-probe>`);
    expect(el.dddWord("size")).to.equal("m");
    expect(el.dddWord("variant")).to.equal(null);
  });

  it("lets the shared word win when both are set", async () => {
    const el = await fixture(
      html`<ddd-vocab-probe status="stop" variant="brand"></ddd-vocab-probe>`,
    );
    expect(el.dddWord("variant")).to.equal("brand");
    expect(el.dddLegacy("variant")).to.equal("info");
    expect(el.matches(":state(variant-brand)")).to.equal(true);
    expect(el.matches(":state(variant-danger)")).to.equal(false);
  });

  it("ignores a value that is not part of the vocabulary", async () => {
    const el = await fixture(
      html`<ddd-vocab-probe status="stop" variant="loud"></ddd-vocab-probe>`,
    );
    expect(el.dddWord("variant")).to.equal("danger");
  });

  it("adds no attribute to the element", async () => {
    const el = await fixture(
      html`<ddd-vocab-probe status="stop"></ddd-vocab-probe>`,
    );
    expect(el.getAttributeNames().sort()).to.deep.equal(["status"]);
  });
});

/** a shadow root carrying every DDD stylesheet, as a page would */
function dddRoot(markup) {
  // a plain element appended directly: fixture() waits a frame for
  // non-Lit elements, and frames stall in a tab that is not showing
  const host = globalThis.document.createElement("div");
  globalThis.document.body.appendChild(host);
  const root = host.attachShadow({ mode: "open" });
  root.adoptedStyleSheets = DDDAllStyles.map((s) => s.styleSheet);
  root.innerHTML = markup;
  return root;
}

describe("paired text colors", () => {
  it("gives every primary palette a text color token", async () => {
    const root = await dddRoot("<div id='p'></div>");
    const style = globalThis.getComputedStyle(root.querySelector("#p"));
    for (let n = 0; n <= 25; n++) {
      expect(["black", "white"], `--ddd-primary-${n}-on`).to.include(
        style.getPropertyValue(`--ddd-primary-${n}-on`).trim(),
      );
    }
  });

  it("draws the bg treatment in the paired color, and follows a remap", async () => {
    const root = await dddRoot(
      `<div id="p7" data-primary="7" data-design-treatment="bg">Text</div>
       <div id="p19" data-primary="19" data-design-treatment="bg">Text</div>`,
    );
    const p7 = root.querySelector("#p7");
    const p19 = root.querySelector("#p19");
    expect(globalThis.getComputedStyle(p7).color).to.equal("rgb(0, 0, 0)");
    expect(globalThis.getComputedStyle(p19).color).to.equal(
      "rgb(255, 255, 255)",
    );
    // what a bridge does when it maps a palette to a darker or lighter color
    root.host.style.setProperty("--ddd-primary-7-on", "white");
    root.host.style.setProperty("--ddd-primary-19-on", "black");
    expect(globalThis.getComputedStyle(p7).color).to.equal(
      "rgb(255, 255, 255)",
    );
    expect(globalThis.getComputedStyle(p19).color).to.equal("rgb(0, 0, 0)");
  });
});

describe("ddd-card options", () => {
  it("follows the card background token", async () => {
    const el = await fixture(
      html`<ddd-card
        title="Tile"
        style="--ddd-card-background: rgb(244, 244, 244)"
      ></ddd-card>`,
    );
    expect(globalThis.getComputedStyle(el).backgroundColor).to.equal(
      "rgb(244, 244, 244)",
    );
  });

  it("draws no image area without an image", async () => {
    const el = await fixture(
      html`<ddd-card title="No image"><p>Text</p></ddd-card>`,
    );
    const image = el.shadowRoot.querySelector(".image");
    expect(image.classList.contains("empty")).to.equal(true);
    expect(image.querySelector("img")).to.equal(null);
    expect(globalThis.getComputedStyle(image).height).to.equal("0px");
  });

  it("keeps the image area when there is an image", async () => {
    const el = await fixture(
      html`<ddd-card
        title="Image"
        src="data:image/gif;base64,R0lGODlhAQABAAAAACw="
        alt=""
        ><p>Text</p></ddd-card
      >`,
    );
    const image = el.shadowRoot.querySelector(".image");
    expect(image.classList.contains("empty")).to.equal(false);
    expect(image.querySelector("img")).to.exist;
  });

  it("follows the card component tokens", async () => {
    const el = await fixture(
      html`<ddd-card
        title="Square"
        style="--ddd-card-radius: 0px; --ddd-card-border-width: 1px"
        ><p>Text</p></ddd-card
      >`,
    );
    const style = globalThis.getComputedStyle(el);
    expect(style.borderTopLeftRadius).to.equal("0px");
    expect(style.borderTopWidth).to.equal("1px");
  });

  it("makes the whole card the link when clickable", async () => {
    const el = await fixture(
      html`<ddd-card title="Link" href="#x" clickable><p>Text</p></ddd-card>`,
    );
    const a = el.shadowRoot.querySelector(".button-wrapper a");
    expect(a).to.exist;
    expect(globalThis.getComputedStyle(a, "::after").position).to.equal(
      "absolute",
    );
    await expect(el).shadowDom.to.be.accessible();
  });

  it("lays out horizontally", async () => {
    const el = await fixture(
      html`<ddd-card
        horizontal
        title="Side"
        src="data:image/gif;base64,R0lGODlhAQABAAAAACw="
        alt=""
        ><p>Text</p></ddd-card
      >`,
    );
    expect(
      globalThis.getComputedStyle(el.shadowRoot.querySelector(".card"))
        .flexDirection,
    ).to.equal(globalThis.innerWidth > 600 ? "row" : "column");
  });
});

describe("ddd-steps-list step indicator", () => {
  it("marks progress on the items without adding attributes to them", async () => {
    const el = await fixture(html`
      <ddd-steps-list horizontal current="2">
        <ddd-steps-list-item title="One"><p>a</p></ddd-steps-list-item>
        <ddd-steps-list-item title="Two"><p>b</p></ddd-steps-list-item>
        <ddd-steps-list-item title="Three"><p>c</p></ddd-steps-list-item>
      </ddd-steps-list>
    `);
    await el.updateComplete;
    const items = Array.from(el.querySelectorAll("ddd-steps-list-item"));
    await Promise.all(items.map((i) => i.updateComplete));
    expect(items.map((i) => i.progress)).to.deep.equal(["done", "current", ""]);
    expect(items[0].matches(":state(done)")).to.equal(true);
    expect(items[1].matches(":state(current)")).to.equal(true);
    expect(items[2].matches(":state(horizontal)")).to.equal(true);
    items.forEach((i) =>
      expect(i.getAttributeNames()).to.deep.equal(["title"]),
    );
    expect(items[0].shadowRoot.querySelector(".sr").textContent).to.contain(
      "completed",
    );
    await expect(el).shadowDom.to.be.accessible();
  });

  it("leaves the vertical list as it was", async () => {
    const el = await fixture(html`
      <ddd-steps-list>
        <ddd-steps-list-item title="One"><p>a</p></ddd-steps-list-item>
        <ddd-steps-list-item title="Two"><p>b</p></ddd-steps-list-item>
      </ddd-steps-list>
    `);
    const items = Array.from(el.querySelectorAll("ddd-steps-list-item"));
    await Promise.all(items.map((i) => i.updateComplete));
    expect(items.map((i) => i.step)).to.deep.equal([1, 2]);
    expect(items[0].matches(":state(horizontal)")).to.equal(false);
    expect(
      items[0].shadowRoot.querySelector(".circle").textContent.trim(),
    ).to.equal("1");
  });
});
