import { fixture, expect, html } from "@open-wc/testing";
import "../image-compare-slider.js";

// data URLs keep the slotted images local so no external request leaves the
// test session (the original fixture pointed at placekitten.com)
const TOP =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7?t=top";
const BOTTOM =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7?t=bottom";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function poll(predicate, attempts = 100, delayMs = 20) {
  for (let i = 0; i < attempts; i++) {
    if (predicate()) return true;
    await sleep(delayMs);
  }
  return predicate();
}

describe("Image comparison", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html` <image-compare-slider
        top-description-id="cloudy"
        top-src="${TOP}"
        top-alt="Matterhorn without snow"
        bottom-description-id="snowy"
        bottom-src="${BOTTOM}"
        bottom-alt="Matterhorn with snow"
      >
        <h2 slot="heading">Default Compare Mode</h2>
        <div slot="description">
          The slider will fade away the top image
          <span id="cloudy">(Matterhorn on a cloudy day without snow)</span>
          to reveal the bottom image
          <span id="snowy">(Matterhorn on a clear day with snow)</span>.
        </div>
      </image-compare-slider>`,
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe("image-compare-slider behavior", () => {
  it("renders a title heading when the deprecated title is set", async () => {
    const el = await fixture(
      html` <image-compare-slider
        title="Titled comparison"
        top-src="${TOP}"
        bottom-src="${BOTTOM}"
      ></image-compare-slider>`,
    );
    const visible = await poll(() => el.elementVisible === true);
    expect(visible).to.be.true;
    await el.updateComplete;
    const heading = el.shadowRoot.querySelector("h2");
    expect(heading).to.exist;
    expect(heading.textContent).to.equal("Titled comparison");
    // slotted heading content still renders next to it
    expect(el.shadowRoot.querySelector('slot[name="heading"]')).to.exist;
  });

  it("haxHooks maps mediaSourceUpdated", async () => {
    const el = await fixture(
      html` <image-compare-slider
        top-src="${TOP}"
        bottom-src="${BOTTOM}"
      ></image-compare-slider>`,
    );
    expect(el.haxHooks()).to.deep.equal({
      mediaSourceUpdated: "haxmediaSourceUpdated",
    });
  });

  it("haxmediaSourceUpdated ignores bad input", async () => {
    const el = await fixture(
      html` <image-compare-slider
        top-src="${TOP}"
        bottom-src="${BOTTOM}"
      ></image-compare-slider>`,
    );
    expect(el.haxmediaSourceUpdated(null, null)).to.equal(undefined);
    expect(el.haxmediaSourceUpdated("x.png", null)).to.equal(undefined);
    expect(el.haxmediaSourceUpdated("x.png", {})).to.equal(undefined);
  });

  it("haxmediaSourceUpdated pokes matching imgs from either layer", async () => {
    const el = await fixture(
      html` <image-compare-slider
        top-src="${TOP}"
        bottom-src="${BOTTOM}"
      ></image-compare-slider>`,
    );
    const pokes = [];
    const store = {
      _mediaSrcMatches: (src, path) => src === path,
      _pokeMatchingImgs: (root, path) =>
        pokes.push([path, root === el.shadowRoot]),
    };
    // non-matching paths do nothing
    el.haxmediaSourceUpdated("other.png", store);
    expect(pokes.length).to.equal(0);
    // a top match pokes
    el.haxmediaSourceUpdated(TOP, store);
    expect(pokes).to.deep.equal([[TOP, true]]);
    // and a bottom match pokes too
    el.haxmediaSourceUpdated(BOTTOM, store);
    expect(pokes.length).to.equal(2);
  });

  it("haxProperties points at the external schema file", () => {
    const Ctor = globalThis.customElements.get("image-compare-slider");
    expect(Ctor.haxProperties).to.be.a("string");
    expect(
      Ctor.haxProperties.endsWith("lib/image-compare-slider.haxProperties.json"),
    ).to.be.true;
  });
});
