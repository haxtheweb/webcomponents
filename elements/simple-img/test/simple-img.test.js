import { fixture, expect, html } from "@open-wc/testing";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import "../simple-img.js";

// simple-img converts its src through the @core/imgManipulate microservice
// and then loads the returned URL with new Image(); stub the registry so
// tests never leave the browser session.
// NOTE: document.createElement("simple-img") can NEVER be used here: the
// constructor sets attributes on itself during construction, which violates
// the custom element constructor rules, so createElement always throws
// NotSupportedError ("The result must not have attributes").
const DATA_URL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

let originalUrl = null;
before(() => {
  originalUrl = MicroFrontendRegistry.url;
  MicroFrontendRegistry.url = () => DATA_URL;
});
after(() => {
  if (originalUrl) {
    MicroFrontendRegistry.url = originalUrl;
  } else {
    delete MicroFrontendRegistry.url;
  }
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function poll(predicate, attempts = 100, delayMs = 20) {
  for (let i = 0; i < attempts; i++) {
    if (predicate()) return true;
    await sleep(delayMs);
  }
  return predicate();
}

describe("elementName test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<simple-img></simple-img>`);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe("simple-img defaults", () => {
  it("applies documented default attributes and wrapper styles", async () => {
    const el = await fixture(html`<simple-img></simple-img>`);
    expect(el.getAttribute("alt")).to.equal("");
    expect(el.getAttribute("src")).to.equal("");
    expect(el.getAttribute("loading")).to.equal("lazy");
    expect(el.getAttribute("decoding")).to.equal("async");
    expect(el.getAttribute("fetchpriority")).to.equal("high");
    expect(el.getAttribute("width")).to.equal("300");
    expect(el.getAttribute("height")).to.equal("200");
    expect(el.getAttribute("quality")).to.equal("80");
    // wrapper element styles
    expect(el.style.display).to.equal("inline-block");
    expect(el.style.width).to.equal("300px");
    expect(el.style.height).to.equal("200px");
    // nothing to render without a source
    expect(el.querySelector("img")).to.equal(null);
    expect(el.updateconvertedurl()).to.equal(undefined);
    expect(el.getAttribute("srcconverted")).to.equal(null);
  });

  it("round-trips every attribute-backed getter and setter", async () => {
    const el = await fixture(html`<simple-img></simple-img>`);
    el.rotate = "90";
    expect(el.rotate).to.equal("90");
    el.fit = "cover";
    expect(el.fit).to.equal("cover");
    el.watermark = "wm.png";
    expect(el.watermark).to.equal("wm.png");
    el.wmspot = "se";
    expect(el.wmspot).to.equal("se");
    el.format = "webp";
    expect(el.format).to.equal("webp");
    el.baseurl = "https://example.com";
    expect(el.baseurl).to.equal("https://example.com");
    el.decoding = "sync";
    expect(el.decoding).to.equal("sync");
    el.fetchpriority = "low";
    expect(el.fetchpriority).to.equal("low");
    el.quality = "70";
    expect(el.quality).to.equal("70");
    el.alt = "Alt text";
    expect(el.alt).to.equal("Alt text");
    el.loading = "eager";
    expect(el.loading).to.equal("eager");
    el.width = "77";
    expect(el.width).to.equal("77");
    el.height = "66";
    expect(el.height).to.equal("66");
    expect(el.getAttribute("rotate")).to.equal("90");
    // attributes reflect and there is still nothing to convert without a src
    expect(el.getAttribute("srcconverted")).to.equal(null);
  });
});

describe("simple-img conversion pipeline", () => {
  it("renders the converted image once the manipulated src loads", async () => {
    const el = await fixture(
      html`<simple-img
        src="${DATA_URL}"
        alt="A gif"
        width="50"
        height="40"
        quality="70"
        loading="eager"
        decoding="sync"
        fetchpriority="low"
      ></simple-img>`,
    );
    expect(el.srcconverted).to.equal(DATA_URL);
    const rendered = await poll(() => el.querySelector("img") !== null);
    expect(rendered).to.be.true;
    const img = el.querySelector("img");
    // the light DOM image uses the converted src with the element params
    expect(img.getAttribute("src")).to.equal(DATA_URL);
    expect(img.getAttribute("alt")).to.equal("A gif");
    expect(img.getAttribute("width")).to.equal("50");
    expect(img.getAttribute("height")).to.equal("40");
    expect(img.getAttribute("loading")).to.equal("eager");
    expect(img.getAttribute("decoding")).to.equal("sync");
    expect(img.getAttribute("fetchpriority")).to.equal("low");
    expect(el.rendering).to.be.false;
  });

  it("falls back to the original src when the converted image fails", async () => {
    // converted src 404s on the local test server, so the fallback runs
    MicroFrontendRegistry.url = () => "/definitely-missing.png";
    try {
      const el = await fixture(html`<simple-img src="${DATA_URL}"></simple-img>`);
      expect(el.srcconverted).to.equal("/definitely-missing.png");
      const rendered = await poll(() => el.querySelector("img") !== null);
      expect(rendered).to.be.true;
      // onerror renders the original src instead of the converted one
      expect(el.querySelector("img").getAttribute("src")).to.equal(DATA_URL);
    } finally {
      MicroFrontendRegistry.url = () => DATA_URL;
    }
  });

  it("recomputes the converted url when element params change", async () => {
    const el = await fixture(html`<simple-img src="${DATA_URL}"></simple-img>`);
    await poll(() => el.querySelector("img") !== null);
    el.width = "77";
    const updated = await poll(
      () => el.querySelector("img").getAttribute("width") === "77",
    );
    expect(updated).to.be.true;
    expect(el.querySelector("img").getAttribute("height")).to.equal("200");
  });
});

describe("simple-img hax integration", () => {
  it("haxHooks maps mediaSourceUpdated", async () => {
    const el = await fixture(html`<simple-img></simple-img>`);
    expect(el.haxHooks()).to.deep.equal({
      mediaSourceUpdated: "haxmediaSourceUpdated",
    });
  });

  it("haxmediaSourceUpdated ignores bad input", async () => {
    const el = await fixture(html`<simple-img></simple-img>`);
    expect(el.haxmediaSourceUpdated(null, null)).to.equal(undefined);
    expect(el.haxmediaSourceUpdated("x.png", null)).to.equal(undefined);
    expect(el.haxmediaSourceUpdated("x.png", {})).to.equal(undefined);
  });

  it("haxmediaSourceUpdated ignores elements without a rendered image", async () => {
    // no src means no conversion and no light DOM img, deterministically
    const el = await fixture(html`<simple-img></simple-img>`);
    expect(
      el.haxmediaSourceUpdated(DATA_URL, {
        _mediaSrcMatches: () => true,
      }),
    ).to.equal(undefined);
    expect(el.querySelector("img")).to.equal(null);
  });

  it("haxmediaSourceUpdated cache-busts the light DOM img on match", async () => {
    const el = await fixture(html`<simple-img src="${DATA_URL}"></simple-img>`);
    const rendered = await poll(() => el.querySelector("img") !== null);
    expect(rendered).to.be.true;
    const img = el.querySelector("img");
    const store = {
      _mediaSrcMatches: (src, path) => src === path,
    };
    el.haxmediaSourceUpdated(el.src, store);
    expect(img.getAttribute("src").startsWith("data:image/gif")).to.be.true;
    expect(img.getAttribute("src")).to.contain("?t=");
    // non-matching paths leave the img untouched
    el.haxmediaSourceUpdated("other.png", store);
    expect(img.getAttribute("src")).to.contain("?t=");
  });

  it("haxProperties points at the external schema file", () => {
    const Ctor = globalThis.customElements.get("simple-img");
    expect(Ctor.haxProperties).to.be.a("string");
    expect(Ctor.haxProperties.endsWith("lib/simple-img.haxProperties.json")).to
      .be.true;
  });
});
