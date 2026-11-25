import { fixture, expect, html } from "@open-wc/testing";
import "../simple-img.js";
import {
  simpleImgVariantUrl,
  simpleImgSource,
} from "../lib/SimpleImgVariants.js";

// simple-img shows the sized copy of a site photo the HAXcms backends make
// when the page is saved (lib/SimpleImgVariants.js), and the original src
// when there is no such copy (a remote photo, or no variant made yet).
// NOTE: the light DOM adoption and default attributes used to run in the
// constructor, which set attributes during construction and made
// document.createElement("simple-img") throw NotSupportedError. The
// adoption and defaults now run in connectedCallback, so createElement is
// safe and the element upgrades on connect.
const DATA_URL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

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

  it("document.createElement does not throw and upgrades on connect", async () => {
    let created;
    expect(() => {
      created = globalThis.document.createElement("simple-img");
    }).to.not.throw();
    globalThis.document.body.appendChild(created);
    const upgraded = await poll(() => created.getAttribute("width") === "300");
    expect(upgraded).to.be.true;
    expect(created.getAttribute("height")).to.equal("200");
    expect(created.getAttribute("quality")).to.equal("80");
    expect(created.getAttribute("loading")).to.equal("lazy");
    expect(created.getAttribute("alt")).to.equal("");
    expect(created.style.display).to.equal("inline-block");
    expect(created.style.width).to.equal("300px");
    globalThis.document.body.removeChild(created);
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

describe("simple-img variants", () => {
  it("golden names match haxcms-nodejs and haxcms-php", () => {
    expect(simpleImgVariantUrl({ src: "files/field-day.jpg" })).to.equal(
      "files/haxcms-managed/simple-img/field-day-a9eb28d6.jpg",
    );
    // simple-img's defaults spelled out name the same file
    expect(
      simpleImgVariantUrl({
        src: "files/field-day.jpg",
        width: "300",
        height: "200",
        quality: "80",
        rotate: "0",
        fit: "cover",
        format: "jpg",
        wmspot: "se",
      }),
    ).to.equal("files/haxcms-managed/simple-img/field-day-a9eb28d6.jpg");
    expect(
      simpleImgVariantUrl({
        src: "files/photos/Field.PNG?v=2",
        width: 640,
        height: 480,
        quality: 60,
        rotate: "-90",
        fit: "Inside",
        format: "webp",
        watermark: "files/logo.png",
        wmspot: "nw",
      }),
    ).to.equal("files/haxcms-managed/simple-img/photos--Field-00167df4.webp");
    expect(
      simpleImgVariantUrl({
        src: "files/clip.gif",
        quality: 50,
        format: "jpeg",
      }),
    ).to.equal("files/haxcms-managed/simple-img/clip-4aff2e69.jpg");
  });

  it("only site photos, quarter turns, sane sizes and site watermarks get a variant", () => {
    [
      { src: "https://example.com/files/a.jpg" },
      { src: "/files/a.jpg" },
      { src: "files/../site.json" },
      { src: "files/haxcms-managed/simple-img/a-00000000.jpg" },
      { src: "files/a.svg" },
      { src: "files/a b.jpg" },
      { src: "files/a.jpg", rotate: 45 },
      { src: "files/a.jpg", width: 5000 },
      { src: "files/a.jpg", watermark: "https://example.com/logo.png" },
      { src: "files/a.jpg", watermark: "files/logo.gif" },
      { src: DATA_URL },
    ].forEach((attrs) => {
      expect(simpleImgVariantUrl(attrs), JSON.stringify(attrs)).to.equal(null);
    });
    expect(simpleImgSource("files/a.gif?x=1")).to.deep.equal({
      path: "files/a.gif",
      stem: "a",
      ext: "gif",
    });
  });
});

describe("simple-img rendering", () => {
  it("shows a photo with no variant (not a site file) straight from its src", async () => {
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
    expect(img.getAttribute("src")).to.equal(DATA_URL);
    expect(img.getAttribute("alt")).to.equal("A gif");
    expect(img.getAttribute("width")).to.equal("50");
    expect(img.getAttribute("height")).to.equal("40");
    expect(img.getAttribute("loading")).to.equal("eager");
    expect(img.getAttribute("decoding")).to.equal("sync");
    expect(img.getAttribute("fetchpriority")).to.equal("low");
    expect(el.rendering).to.be.false;
  });

  it("asks for the saved variant of a site photo and falls back to the original when it is missing", async () => {
    const el = await fixture(
      html`<simple-img
        src="files/definitely-missing.jpg"
        width="50"
        height="40"
      ></simple-img>`,
    );
    expect(el.srcconverted).to.equal(
      simpleImgVariantUrl({
        src: "files/definitely-missing.jpg",
        width: 50,
        height: 40,
      }),
    );
    expect(el.srcconverted.startsWith("files/haxcms-managed/simple-img/")).to.be
      .true;
    const rendered = await poll(() => el.querySelector("img") !== null);
    expect(rendered).to.be.true;
    // the variant 404s on the test server, so the original src is shown
    expect(el.querySelector("img").getAttribute("src")).to.equal(
      "files/definitely-missing.jpg",
    );
  });

  it("never calls an outside image service, and ignores one saved in older content", async () => {
    const el = await fixture(
      html`<simple-img
        srcconverted="https://open-apis.hax.cloud/api/services/media/image/manipulate?src=x"
        src="${DATA_URL}"
      ></simple-img>`,
    );
    const rendered = await poll(() => el.querySelector("img") !== null);
    expect(rendered).to.be.true;
    expect(el.srcconverted).to.equal(DATA_URL);
    expect(el.querySelector("img").getAttribute("src")).to.equal(DATA_URL);
    expect(el.innerHTML.indexOf("open-apis")).to.equal(-1);
  });

  it("recomputes the src when element params change", async () => {
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
