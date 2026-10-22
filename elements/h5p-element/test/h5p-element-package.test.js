import { fixture, expect, html, oneEvent } from "@open-wc/testing";
import { zipSync, strToU8 } from "fflate";
import { H5PElement } from "../h5p-element.js";

// The legacy (extracted folder) path loads the h5p-standalone global through
// ESGlobalBridge. Stub it so these tests only see what the package path does.
const bridge = globalThis.ESGlobalBridge.requestAvailability();
const originalLoad = bridge.load;
const bridgeLoads = [];
bridge.load = (name, location) => {
  bridgeLoads.push({ name, location });
  return new Promise(() => {});
};
const realFetch = globalThis.fetch;
after(() => {
  bridge.load = originalLoad;
  globalThis.fetch = realFetch;
});

const zipResponse = (bytes) =>
  new Response(bytes, {
    status: 200,
    headers: { "content-type": "application/zip" },
  });

describe("h5p-element with a .h5p source", () => {
  beforeEach(() => {
    bridgeLoads.length = 0;
  });
  afterEach(() => {
    globalThis.fetch = realFetch;
  });

  describe("isPackage", () => {
    const cases = [
      ["quiz.h5p", true],
      ["https://example.org/files/Quiz.H5P", true],
      ["https://example.org/files/quiz.h5p?v=2", true],
      ["https://example.org/files/quiz.h5p#top", true],
      ["blob:https://example.org/1234-5678", true],
      ["https://example.org/h5p/extracted/", false],
      ["https://example.org/entity_iframe/node/4272", false],
      ["quiz.h5p.html", false],
    ];
    cases.forEach(([source, expected]) => {
      it(`${source} -> ${expected}`, () => {
        const el = new H5PElement();
        el.source = source;
        expect(el.isPackage).to.equal(expected);
      });
    });

    it("is false when there is no source", () => {
      expect(new H5PElement().isPackage).to.equal(false);
    });
  });

  it("does not load the h5p-standalone loader for a package", async () => {
    globalThis.fetch = () => new Promise(() => {});
    await fixture(html`<h5p-element source="quiz.h5p"></h5p-element>`);
    expect(bridgeLoads).to.have.length(0);
  });

  it("still loads h5p-standalone for an extracted folder", async () => {
    await fixture(
      html`<h5p-element source="https://example.org/extracted/"></h5p-element>`,
    );
    expect(bridgeLoads.map((b) => b.name)).to.deep.equal(["h5p-standalone"]);
  });

  it("renders into light DOM when it has a source", async () => {
    globalThis.fetch = () => new Promise(() => {});
    const el = await fixture(
      html`<h5p-element source="quiz.h5p"></h5p-element>`,
    );
    expect(el.shadowRoot).to.equal(null);
    expect(el.querySelector(".h5p-container")).to.exist;
  });

  it("reports a failed download through an event and a status message", async () => {
    globalThis.fetch = async () => new Response("", { status: 404 });
    const el = await fixture(
      html`<h5p-element source="missing.h5p"></h5p-element>`,
    );
    const evt = await oneEvent(el, "h5p-package-error");
    expect(evt.detail.message).to.match(/HTTP 404/);
    expect(el.status).to.equal("error");
    await el.updateComplete;
    const status = el.querySelector('[role="status"]');
    expect(status).to.exist;
    expect(status.textContent).to.contain("HTTP 404");
  });

  it("reports a file that is not an H5P package", async () => {
    globalThis.fetch = async () =>
      zipResponse(zipSync({ "a.txt": strToU8("x") }));
    const el = await fixture(
      html`<h5p-element source="notes.h5p"></h5p-element>`,
    );
    const evt = await oneEvent(el, "h5p-package-error");
    expect(evt.detail.message).to.match(/not an H5P package/i);
  });

  it("reports a file that is not a zip at all", async () => {
    globalThis.fetch = async () => zipResponse(strToU8("<html></html>"));
    const el = await fixture(
      html`<h5p-element source="page.h5p"></h5p-element>`,
    );
    const evt = await oneEvent(el, "h5p-package-error");
    expect(evt.detail.message).to.match(/zip archive/i);
  });

  it("loadFile points source at an object URL and revokes it on removal", async () => {
    globalThis.fetch = () => new Promise(() => {});
    const el = await fixture(html`<h5p-element></h5p-element>`);
    el.loadFile(new File([strToU8("x")], "quiz.h5p"));
    expect(el.source).to.match(/^blob:/);
    expect(el.isPackage).to.equal(true);
    const url = el._objectUrl;
    expect(url).to.equal(el.source);
    el.remove();
    expect(el._objectUrl).to.equal(null);
  });

  it("keeps the legacy iframe slot path when there is no source", async () => {
    const el = await fixture(
      html`<h5p-element
        ><iframe title="legacy" src="about:blank"></iframe
      ></h5p-element>`,
    );
    expect(el.shadowRoot).to.exist;
    expect(el.shadowRoot.querySelector("h5p-wrapped-element")).to.exist;
  });
});
