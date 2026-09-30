import { expect } from "@open-wc/testing";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import "../simple-img.js";

// simple-img adopts pre-upgrade light DOM content (an <img> or a
// <template><img></template>) in its constructor. Parsing markup into a
// DETACHED div keeps the fragment inert (no constructors run), so appending
// the div upgrades the simple-img with its children already in place — the
// same upgrade path real progressive-enhancement markup takes. The registry
// url is stubbed so no conversion request leaves the test session.
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

function upgradedElement(markup) {
  const div = globalThis.document.createElement("div");
  // inert fragment parse: constructors do not run yet
  div.innerHTML = markup;
  // connecting the fragment upgrades the simple-img WITH its children
  globalThis.document.body.appendChild(div);
  return div.querySelector("simple-img");
}

describe("simple-img progressive enhancement on upgrade", () => {
  it("adopts a pre-upgrade light DOM img", async () => {
    const el = upgradedElement(
      '<simple-img><img src="' +
        DATA_URL +
        '" alt="A" loading="eager" width="50" height="40"></simple-img>',
    );
    expect(el).to.exist;
    // the pre-upgrade img supplied src, alt, loading and dimensions
    expect(el.src).to.equal(DATA_URL);
    expect(el.alt).to.equal("A");
    expect(el.loading).to.equal("eager");
    expect(el.getAttribute("width")).to.equal("50");
    expect(el.getAttribute("height")).to.equal("40");
    expect(el.style.width).to.equal("50px");
    // the original light DOM content is replaced by the rendered image
    const rendered = await poll(() => el.querySelector("img") !== null);
    expect(rendered).to.be.true;
    const img = el.querySelector("img");
    expect(img.getAttribute("src")).to.equal(DATA_URL);
    expect(img.getAttribute("alt")).to.equal("A");
    expect(img.getAttribute("loading")).to.equal("eager");
    expect(img.getAttribute("width")).to.equal("50");
    expect(img.getAttribute("height")).to.equal("40");
  });

  it("adopts an img inside a pre-upgrade template", async () => {
    const el = upgradedElement(
      '<simple-img><template><img src="' +
        DATA_URL +
        '" alt="T"></template></simple-img>',
    );
    expect(el).to.exist;
    expect(el.src).to.equal(DATA_URL);
    expect(el.alt).to.equal("T");
    const rendered = await poll(() => el.querySelector("img") !== null);
    expect(rendered).to.be.true;
    expect(el.querySelector("img").getAttribute("alt")).to.equal("T");
    // the template itself was wiped with the rest of the light DOM
    expect(el.querySelector("template")).to.equal(null);
  });

  it("falls back to defaults with no pre-upgrade content", () => {
    const el = upgradedElement("<simple-img></simple-img>");
    expect(el).to.exist;
    expect(el.getAttribute("alt")).to.equal("");
    expect(el.getAttribute("src")).to.equal("");
    expect(el.getAttribute("loading")).to.equal("lazy");
    expect(el.getAttribute("decoding")).to.equal("async");
    expect(el.getAttribute("fetchpriority")).to.equal("high");
    expect(el.getAttribute("width")).to.equal("300");
    expect(el.getAttribute("height")).to.equal("200");
    expect(el.getAttribute("quality")).to.equal("80");
    // no src, nothing renders
    expect(el.querySelector("img")).to.equal(null);
  });
});
