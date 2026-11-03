import { fixture, expect, html } from "@open-wc/testing";
import "../image-compare-slider.js";

// data URLs keep the slotted images local so no external request leaves the
// test session (the original fixture pointed at placekitten.com)
const TOP =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7?t=top";
const BOTTOM =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7?t=bottom";

// the test page has no DDD global styles, so define the colour tokens the
// slider controls read
[
  ["--ddd-theme-default-white", "#ffffff"],
  ["--ddd-theme-default-potentialMidnight", "#000321"],
  ["--ddd-theme-default-nittanyNavy", "#001e44"],
  ["--ddd-theme-default-limestoneLight", "#e4e5e7"],
  ["--ddd-theme-default-slateGray", "#314d64"],
].forEach(([name, value]) =>
  document.documentElement.style.setProperty(name, value),
);
const WHITE = "rgb(255, 255, 255)";
const MIDNIGHT = "rgb(0, 3, 33)";
const NAVY = "rgb(0, 30, 68)";

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
      progressiveEnhancement: "haxprogressiveEnhancement",
      editModeChanged: "haxeditModeChanged",
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
      Ctor.haxProperties.endsWith(
        "lib/image-compare-slider.haxProperties.json",
      ),
    ).to.be.true;
  });
});

describe("image-compare-slider progressive enhancement", () => {
  it("returns both images with escaped alt text", async () => {
    const el = await fixture(
      html`<image-compare-slider
        top-src="a.png"
        top-alt='say "hi"'
        bottom-src="b.png"
        bottom-alt="after"
      ></image-compare-slider>`,
    );
    const markup = el.haxprogressiveEnhancement(el);
    expect(markup).to.contain('src="a.png"');
    expect(markup).to.contain("say &quot;hi&quot;");
    expect(markup).to.contain('src="b.png"');
    expect(el.haxHooks().progressiveEnhancement).to.equal(
      "haxprogressiveEnhancement",
    );
  });

  it("skips images without a source", async () => {
    const el = await fixture(
      html`<image-compare-slider top-src="a.png"></image-compare-slider>`,
    );
    expect(el.haxprogressiveEnhancement(el).match(/<img/g).length).to.equal(1);
  });

  it("marks the images and removes them when editing starts, so none is saved twice", async () => {
    const el = await fixture(
      html`<image-compare-slider
        top-src="a.png"
        bottom-src="b.png"
      ></image-compare-slider>`,
    );
    const markup = el.haxprogressiveEnhancement(el);
    expect(markup.match(/data-prog-fallback/g).length).to.equal(2);
    el.insertAdjacentHTML("beforeend", markup);
    expect(el.querySelectorAll("[data-prog-fallback]").length).to.equal(2);
    el.haxeditModeChanged(false);
    expect(el.querySelectorAll("[data-prog-fallback]").length).to.equal(2);
    el.haxeditModeChanged(true);
    expect(el.querySelectorAll("[data-prog-fallback]").length).to.equal(0);
  });
});

const ImageCompareSliderClass = () =>
  globalThis.customElements.get("image-compare-slider");

describe("image-compare-slider accent color setting", () => {
  // accent-color is gone from the element and the HAX settings; old markup
  // that still carries the attribute keeps rendering, the attribute is inert.
  it("is not offered in the HAX settings and is not a property", async () => {
    const schema = await (
      await fetch(
        new URL(
          "../lib/image-compare-slider.haxProperties.json",
          import.meta.url,
        ),
      )
    ).json();
    Object.keys(schema.settings).forEach((section) => {
      const props = (schema.settings[section] || []).map((s) => s.property);
      expect(props, section).to.not.include("accentColor");
    });
    const el = await fixture(
      html`<image-compare-slider accent-color="green"></image-compare-slider>`,
    );
    expect(el.accentColor).to.equal(undefined);
    expect(ImageCompareSliderClass().properties.accentColor).to.equal(
      undefined,
    );
    expect(el.shadowRoot.querySelector(".ddd-block")).to.exist;
  });
});

describe("image-compare-slider block frame", () => {
  async function visible(el) {
    await poll(() => el.elementVisible === true);
    await el.updateComplete;
    const inner = el.shadowRoot.querySelector("a11y-compare-image");
    if (inner) {
      await inner.updateComplete;
      await inner.updateComplete;
    }
    return inner;
  }

  it("renders the block header with the label and the slotted heading as title", async () => {
    const el = await fixture(
      html`<image-compare-slider top-src="${TOP}" bottom-src="${BOTTOM}">
        <p slot="heading">Land use</p>
        <p slot="description">Slide to compare.</p>
      </image-compare-slider>`,
    );
    await visible(el);
    const frame = el.shadowRoot.querySelector(".ddd-block");
    expect(frame.getAttribute("role")).to.equal("group");
    expect(frame.getAttribute("aria-labelledby")).to.equal("hdr");
    expect(
      el.shadowRoot.querySelector(".ddd-block-label").textContent.trim(),
    ).to.equal("Interactive · Image compare");
    expect(
      el.shadowRoot
        .querySelector(".ddd-block-chip simple-icon-lite")
        .getAttribute("icon"),
    ).to.equal("image:compare");
    // the heading slot is rendered once, in the title position
    const slots = el.shadowRoot.querySelectorAll('slot[name="heading"]');
    expect(slots.length).to.equal(1);
    expect(slots[0].closest(".ddd-block-title")).to.exist;
    expect(
      el.shadowRoot.querySelector(".ddd-block-title").hasAttribute("hidden"),
    ).to.be.false;
    // the description sits in the frame body, not inside the comparison
    const desc = el.shadowRoot.querySelector("#description");
    expect(desc.classList.contains("ddd-block-body")).to.be.true;
    expect(desc.hasAttribute("hidden")).to.be.false;
    expect(desc.querySelector('slot[name="description"]')).to.exist;
  });

  it("hides the empty title and description", async () => {
    const el = await fixture(
      html`<image-compare-slider
        top-src="${TOP}"
        bottom-src="${BOTTOM}"
      ></image-compare-slider>`,
    );
    await visible(el);
    expect(
      el.shadowRoot.querySelector(".ddd-block-title").hasAttribute("hidden"),
    ).to.be.true;
    expect(el.shadowRoot.querySelector("#description").hasAttribute("hidden"))
      .to.be.true;
  });

  it("toggles the How to use panel with aria-expanded", async () => {
    const el = await fixture(
      html`<image-compare-slider
        top-src="${TOP}"
        bottom-src="${BOTTOM}"
      ></image-compare-slider>`,
    );
    await visible(el);
    const btn = el.shadowRoot.querySelector("#help-toggle");
    const help = el.shadowRoot.querySelector("#help");
    expect(btn.getAttribute("aria-controls")).to.equal("help");
    expect(btn.getAttribute("aria-label")).to.equal("How to use");
    expect(btn.getAttribute("aria-expanded")).to.equal("false");
    expect(help.hasAttribute("hidden")).to.be.true;
    btn.click();
    await el.updateComplete;
    expect(btn.getAttribute("aria-expanded")).to.equal("true");
    expect(help.hasAttribute("hidden")).to.be.false;
    expect(help.textContent).to.contain(
      "Compare the two images with the divider.",
    );
    expect(help.querySelectorAll("kbd").length).to.equal(6);
    // fade mode explains the footer slider instead
    el.opacity = true;
    await el.updateComplete;
    expect(help.textContent).to.contain("Fade between the two images.");
    btn.click();
    await el.updateComplete;
    expect(btn.getAttribute("aria-expanded")).to.equal("false");
    expect(help.hasAttribute("hidden")).to.be.true;
  });

  it("passes the label and names to the slider", async () => {
    const el = await fixture(
      html`<image-compare-slider
        top-src="${TOP}"
        top-alt="City in 2020"
        bottom-src="${BOTTOM}"
        bottom-alt="Field in 1990"
        position="60"
      ></image-compare-slider>`,
    );
    const inner = await visible(el);
    const slider = inner.shadowRoot.querySelector("#slider");
    expect(slider.getAttribute("aria-label")).to.equal(
      "Slide to compare images",
    );
    expect(slider.value).to.equal("60");
    expect(slider.getAttribute("aria-valuetext")).to.equal(
      "60% City in 2020, 40% Field in 1990",
    );
    expect(inner.shadowRoot.querySelector(".handle")).to.exist;
    // the images stay in this shadow root for the #3050 cache-busting poke
    expect(el.shadowRoot.querySelectorAll("img").length).to.equal(2);
  });

  it("shows the footer range and no handle in fade mode", async () => {
    const el = await fixture(
      html`<image-compare-slider
        opacity
        top-src="${TOP}"
        top-alt="City in 2020"
        bottom-src="${BOTTOM}"
        bottom-alt="Field in 1990"
      ></image-compare-slider>`,
    );
    const inner = await visible(el);
    expect(inner.opacity).to.be.true;
    expect(inner.shadowRoot.querySelector(".handle")).to.equal(null);
    expect(inner.shadowRoot.querySelector(".bar.fade #slider")).to.exist;
  });

  it("old markup with accent-color renders the same as without it", async () => {
    const el = await fixture(
      html`<image-compare-slider
        accent-color="red"
        top-src="${TOP}"
        bottom-src="${BOTTOM}"
      ></image-compare-slider>`,
    );
    const inner = await visible(el);
    expect(el.accentColor).to.equal(undefined);
    expect(inner.hasAttribute("accent-color")).to.be.false;
    const plain = await fixture(
      html`<image-compare-slider
        top-src="${TOP}"
        bottom-src="${BOTTOM}"
      ></image-compare-slider>`,
    );
    const plainInner = await visible(plain);
    const handle = inner.shadowRoot.querySelector(".handle");
    const plainHandle = plainInner.shadowRoot.querySelector(".handle");
    expect(getComputedStyle(handle).borderColor).to.equal(
      getComputedStyle(plainHandle).borderColor,
    );
    expect(
      getComputedStyle(inner.shadowRoot.querySelector(".nm, .readout")).color,
    ).to.equal(
      getComputedStyle(plainInner.shadowRoot.querySelector(".nm, .readout"))
        .color,
    );
  });

  it("dark inverts the handle but not the block surface", async () => {
    const el = await fixture(
      html`<image-compare-slider
        top-src="${TOP}"
        bottom-src="${BOTTOM}"
      ></image-compare-slider>`,
    );
    const inner = await visible(el);
    const frame = el.shadowRoot.querySelector(".ddd-block");
    const handle = inner.shadowRoot.querySelector(".handle");
    const surface = getComputedStyle(frame).backgroundColor;
    const text = getComputedStyle(frame).color;
    const scheme = getComputedStyle(frame).colorScheme;
    expect(getComputedStyle(handle).backgroundColor).to.equal(WHITE);
    el.dark = true;
    await el.updateComplete;
    await inner.updateComplete;
    expect(inner.hasAttribute("dark")).to.be.true;
    // the block keeps following the page colour scheme
    expect(getComputedStyle(frame).colorScheme).to.equal(scheme);
    expect(getComputedStyle(frame).backgroundColor).to.equal(surface);
    expect(getComputedStyle(frame).color).to.equal(text);
    // only the slider controls invert
    expect(getComputedStyle(handle).backgroundColor).to.equal(MIDNIGHT);
    expect(getComputedStyle(handle).borderTopColor).to.equal(WHITE);
  });

  it("offers full screen only where it is supported", async () => {
    const el = await fixture(
      html`<image-compare-slider
        top-src="${TOP}"
        bottom-src="${BOTTOM}"
      ></image-compare-slider>`,
    );
    await visible(el);
    const btn = el.shadowRoot.querySelector("#fs-toggle");
    expect(!!btn).to.equal(el._canFullscreen);
    if (btn) {
      expect(btn.getAttribute("aria-label")).to.equal("Full screen");
      // the full screen state swaps the label and makes the image fit
      el._fullscreen = true;
      await el.updateComplete;
      expect(btn.getAttribute("aria-label")).to.equal("Exit full screen");
      expect(el.shadowRoot.querySelector(".ddd-block").classList.contains("fs"))
        .to.be.true;
      expect(
        el.shadowRoot.querySelector("a11y-compare-image").hasAttribute("fit"),
      ).to.be.true;
      el._fullscreen = false;
      await el.updateComplete;
    }
  });
});
