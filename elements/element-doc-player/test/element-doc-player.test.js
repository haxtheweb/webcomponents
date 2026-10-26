import { html, fixture, expect, aTimeout } from "@open-wc/testing";
import "../element-doc-player.js";

const docs = {
  tag: "x-demo",
  folder: "x-demo",
  package: "@haxtheweb/x-demo",
  version: "1.0.0",
  license: "Apache-2.0",
  title: "X demo",
  description: "A demo element",
  import: "@haxtheweb/x-demo/x-demo.js",
  cdn: "https://cdn.hax.cloud/cdn/build/es6/node_modules/@haxtheweb/x-demo/x-demo.js",
  install: "npm i @haxtheweb/x-demo",
  demoHtml: "<x-demo></x-demo>",
  attributes: [],
  slots: [],
  events: [],
  hax: {},
  surfaceHash: "abc123abc123",
  source: { path: "elements/x-demo", file: "x-demo.js" },
};

const scene = {
  surfaceHash: "abc123abc123",
  duration: 2,
  beats: [{ t: 0, title: "One" }],
  objects: [],
};

const tabNames = (el) =>
  [...el.shadowRoot.querySelectorAll('[role="tab"]')].map((t) =>
    t.textContent.trim(),
  );

describe("ElementDocPlayer test", () => {
  it("basic will it blend", async () => {
    const element = await fixture(
      html`<element-doc-player></element-doc-player>`,
    );
    expect(element).to.exist;
  });

  it("omits the walkthrough tab when there is no storyboard", async () => {
    const element = await fixture(
      html`<element-doc-player .docs="${docs}"></element-doc-player>`,
    );
    await element.updateComplete;
    expect(tabNames(element)).to.not.include("Walkthrough");
    expect(tabNames(element).length).to.be.greaterThan(0);
  });

  it("shows the walkthrough tab when a storyboard is supplied", async () => {
    const element = await fixture(
      html`<element-doc-player
        .docs="${docs}"
        .scene="${scene}"
      ></element-doc-player>`,
    );
    await element.updateComplete;
    expect(tabNames(element)).to.include("Walkthrough");
  });

  it("flags a storyboard written for a different element surface as stale", async () => {
    const element = await fixture(
      html`<element-doc-player
        .docs="${docs}"
        .scene="${{ ...scene, surfaceHash: "000000000000" }}"
      ></element-doc-player>`,
    );
    expect(element.reviewState).to.equal("stale");
  });

  it("reports review state from the storyboard review block", async () => {
    const element = await fixture(
      html`<element-doc-player
        .docs="${docs}"
        .scene="${scene}"
      ></element-doc-player>`,
    );
    expect(element.reviewState).to.equal("awaiting");
    element.scene = {
      ...scene,
      review: { status: "approved", hash: docs.surfaceHash },
    };
    expect(element.reviewState).to.equal("reviewed");
  });

  it("builds copy snippets from the docs data", async () => {
    const element = await fixture(
      html`<element-doc-player .docs="${docs}"></element-doc-player>`,
    );
    expect(element.snippets.html).to.equal("<x-demo></x-demo>");
    expect(element.snippets.import).to.equal(
      'import "@haxtheweb/x-demo/x-demo.js";',
    );
    expect(element.snippets.npm).to.equal("npm i @haxtheweb/x-demo");
  });

  it("passes the a11y audit", async () => {
    const element = await fixture(
      html`<element-doc-player .docs="${docs}"></element-doc-player>`,
    );
    await aTimeout(50);
    await expect(element).shadowDom.to.be.accessible();
  });
});
