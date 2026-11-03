import { fixture, expect, html } from "@open-wc/testing";
import "../a11y-compare-image.js";

const TOP =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7?t=top";
const BOTTOM =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7?t=bottom";
const MID =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7?t=mid";

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

describe("a11y-compare-image rendering", () => {
  it("renders the figure, layers and labeled slider", async () => {
    const el = await fixture(
      html`<a11y-compare-image label="Compare the images">
        <img slot="bottom" src="${BOTTOM}" alt="bottom image" />
        <img slot="top" src="${TOP}" alt="top image" />
      </a11y-compare-image>`,
    );
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("figure")).to.exist;
    expect(el.shadowRoot.querySelector('figcaption slot[name="heading"]')).to
      .exist;
    expect(el.shadowRoot.querySelector("#description")).to.exist;
    expect(el.shadowRoot.querySelector("#container")).to.exist;
    expect(el.shadowRoot.querySelector("#layer")).to.exist;
    expect(el.shadowRoot.querySelector("#placeholder")).to.exist;
    // the top slot is hidden in the shadow DOM; layers are backgrounds
    expect(
      el.shadowRoot.querySelector('slot[name="top"]').hasAttribute("hidden"),
    ).to.be.true;
    // one native range input drives the comparison
    const slider = el.shadowRoot.querySelector("#slider");
    expect(slider.tagName).to.equal("INPUT");
    expect(slider.type).to.equal("range");
    expect(slider.getAttribute("aria-label")).to.equal("Compare the images");
    expect(slider.value).to.equal("50");
    // wipe mode: the divider and handle sit on the image
    expect(el.shadowRoot.querySelector(".stage #input .divider")).to.exist;
    expect(el.shadowRoot.querySelector(".stage #input .handle")).to.exist;
    // the default enticement knob is off
    expect(el.dataPulse).to.be.false;
    expect(el.shadowRoot.querySelector(".knob-enticement")).to.equal(null);
    // default position is centered and reflected
    expect(el.position).to.equal(50);
    expect(el.hasAttribute("position")).to.be.true;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<a11y-compare-image label="Compare the images">
        <h2 slot="heading">A comparison</h2>
        <div slot="description">Slide to reveal the bottom image</div>
        <img slot="bottom" src="${BOTTOM}" alt="bottom image" />
        <img slot="top" src="${TOP}" alt="top image" />
      </a11y-compare-image>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });
});

describe("a11y-compare-image sliding", () => {
  it("wipes the top layer across the bottom at the position", async () => {
    const el = await fixture(
      html`<a11y-compare-image>
        <img slot="bottom" src="${BOTTOM}" alt="bottom image" />
        <img slot="top" src="${TOP}" alt="top image" />
      </a11y-compare-image>`,
    );
    await el.updateComplete;
    const container = el.shadowRoot.querySelector("#container");
    const wipe = el.shadowRoot.querySelector("#wipe");
    const input = el.shadowRoot.querySelector("#input");
    // firstUpdated slides to the default position
    expect(el.__upper).to.equal(TOP);
    expect(el.__lower).to.equal(BOTTOM);
    expect(el.activeLayer).to.equal(1);
    // the slider position marker on #input survives re-renders
    expect(
      input.style.getPropertyValue("--a11y-compare-image-position"),
    ).to.equal("50%");
    // two layers: one transition, so the single boundary marker at 100%
    // renders (hidden, since the 100% boundary sits at the far edge)
    expect(el.__markers).to.deep.equal([100]);
    const markers = el.shadowRoot.querySelectorAll(".marker");
    expect(markers.length).to.equal(1);
    expect(markers[0].hasAttribute("hidden")).to.be.true;
    // the container shows the lower layer as its background
    expect(container.style.backgroundImage).to.include("t=bottom");
    // the wipe geometry custom properties live on #wipe, which the template
    // never re-commits, so they persist from the very first slide (the
    // re-committed style attribute on #container used to wipe them)
    expect(wipe.style.getPropertyValue("--a11y-compare-image-width")).to.equal(
      "50%",
    );
    expect(
      wipe.style.getPropertyValue("--a11y-compare-image-opacity"),
    ).to.equal("1");
  });

  it("sets the wipe width on slides that keep the same layers", async () => {
    const el = await fixture(
      html`<a11y-compare-image>
        <img slot="bottom" src="${BOTTOM}" alt="bottom image" />
        <img slot="top" src="${TOP}" alt="top image" />
      </a11y-compare-image>`,
    );
    await el.updateComplete;
    const wipe = el.shadowRoot.querySelector("#wipe");
    // a slide within the same section keeps __lower unchanged
    el.position = 25;
    await el.updateComplete;
    expect(wipe.style.getPropertyValue("--a11y-compare-image-width")).to.equal(
      "25%",
    );
    expect(
      wipe.style.getPropertyValue("--a11y-compare-image-opacity"),
    ).to.equal("1");
  });

  it("fades the top layer in opacity mode", async () => {
    const el = await fixture(
      html`<a11y-compare-image opacity>
        <img slot="bottom" src="${BOTTOM}" alt="bottom image" />
        <img slot="top" src="${TOP}" alt="top image" />
      </a11y-compare-image>`,
    );
    await el.updateComplete;
    const wipe = el.shadowRoot.querySelector("#wipe");
    el.position = 60;
    await el.updateComplete;
    // opacity mode keeps the top layer full width and fades it instead
    expect(wipe.style.getPropertyValue("--a11y-compare-image-width")).to.equal(
      "100%",
    );
    expect(
      wipe.style.getPropertyValue("--a11y-compare-image-opacity"),
    ).to.equal("0.6");
  });

  it("slides between three layers and recomputes markers", async () => {
    const el = await fixture(
      html`<a11y-compare-image>
        <img slot="bottom" src="${BOTTOM}" alt="bottom image" />
        <img slot="top" src="${MID}" alt="middle image" />
        <img slot="top" src="${TOP}" alt="top image" />
      </a11y-compare-image>`,
    );
    await el.updateComplete;
    // three layers: two transitions, markers at 50 and 100
    expect(el.__markers).to.deep.equal([50, 100]);
    let markers = el.shadowRoot.querySelectorAll(".marker");
    expect(markers.length).to.equal(2);
    expect(markers[0].hasAttribute("hidden")).to.be.false;
    expect(markers[1].hasAttribute("hidden")).to.be.true;
    // position 75 selects the middle layer as upper and lower
    el.position = 75;
    await el.updateComplete;
    expect(el.activeLayer).to.equal(2);
    expect(el.__upper).to.equal(TOP);
    expect(el.__lower).to.equal(MID);
    // the wipe geometry persists through the layer transition (__lower
    // changed BOTTOM -> MID, which used to wipe the custom properties)
    const wipe = el.shadowRoot.querySelector("#wipe");
    expect(wipe.style.getPropertyValue("--a11y-compare-image-width")).to.equal(
      "75%",
    );
    expect(
      wipe.style.getPropertyValue("--a11y-compare-image-opacity"),
    ).to.equal("1");
    // position 100 collapses to the final layer on top
    el.position = 100;
    await el.updateComplete;
    expect(el.activeLayer).to.equal(3);
    expect(el.__upper).to.equal(TOP);
    expect(el.__lower).to.equal(TOP);
    // markers stay stable across slides
    expect(el.__markers).to.deep.equal([50, 100]);
    // more than two layers: the spoken value and readout are just the percent
    expect(
      el.shadowRoot.querySelector("#slider").getAttribute("aria-valuetext"),
    ).to.equal("100%");
    expect(el.shadowRoot.querySelector(".readout").textContent.trim()).to.equal(
      "100%",
    );
    markers = el.shadowRoot.querySelectorAll(".marker");
    expect(markers.length).to.equal(2);
  });

  it("relays slider value changes into the position", async () => {
    const el = await fixture(
      html`<a11y-compare-image>
        <img slot="bottom" src="${BOTTOM}" alt="bottom image" />
        <img slot="top" src="${TOP}" alt="top image" />
      </a11y-compare-image>`,
    );
    await el.updateComplete;
    const slider = el.shadowRoot.querySelector("#slider");
    slider.value = "25";
    slider.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(el.position).to.equal(25);
    expect(
      el.shadowRoot
        .querySelector("#wipe")
        .style.getPropertyValue("--a11y-compare-image-width"),
    ).to.equal("25%");
    expect(el.shadowRoot.querySelector("#slider").value).to.equal("25");
    // a legacy immediate-value-changed detail is still understood
    el._valueChanged({ detail: { value: 40 } });
    await el.updateComplete;
    expect(el.position).to.equal(40);
  });

  it("keeps the input value and handle position in sync with position", async () => {
    const el = await fixture(
      html`<a11y-compare-image position="60">
        <img slot="bottom" src="${BOTTOM}" alt="Field in 1990" />
        <img slot="top" src="${TOP}" alt="City in 2020" />
      </a11y-compare-image>`,
    );
    await el.updateComplete;
    await el.updateComplete;
    const slider = el.shadowRoot.querySelector("#slider");
    expect(slider.value).to.equal("60");
    expect(el.style.getPropertyValue("--a11y-compare-image-position")).to.equal(
      "60%",
    );
    // the spoken value names both images
    expect(slider.getAttribute("aria-valuetext")).to.equal(
      "60% City in 2020, 40% Field in 1990",
    );
    // the bottom bar shows the names and the readout, hidden from AT
    const bar = el.shadowRoot.querySelector(".bar");
    expect(bar.getAttribute("aria-hidden")).to.equal("true");
    const names = bar.querySelectorAll(".nm");
    expect(names[0].textContent.trim()).to.equal("City in 2020");
    expect(names[1].textContent.trim()).to.equal("Field in 1990");
    expect(bar.querySelector(".readout").textContent.trim()).to.equal(
      "60% · 40%",
    );
    el.position = 30;
    await el.updateComplete;
    await el.updateComplete;
    expect(slider.value).to.equal("30");
    expect(slider.getAttribute("aria-valuetext")).to.equal(
      "30% City in 2020, 70% Field in 1990",
    );
  });

  it("falls back to the bare percent without alt text", async () => {
    const el = await fixture(
      html`<a11y-compare-image position="60">
        <img slot="bottom" src="${BOTTOM}" alt="" />
        <img slot="top" src="${TOP}" alt="" />
      </a11y-compare-image>`,
    );
    await el.updateComplete;
    await el.updateComplete;
    const slider = el.shadowRoot.querySelector("#slider");
    expect(slider.getAttribute("aria-valuetext")).to.equal("60%");
    expect(el.shadowRoot.querySelectorAll(".bar .nm").length).to.equal(0);
  });

  it("handles Home, End, Page Up and Page Down", async () => {
    const el = await fixture(
      html`<a11y-compare-image position="50">
        <img slot="bottom" src="${BOTTOM}" alt="bottom image" />
        <img slot="top" src="${TOP}" alt="top image" />
      </a11y-compare-image>`,
    );
    await el.updateComplete;
    const slider = el.shadowRoot.querySelector("#slider");
    const key = async (k) => {
      const ev = new KeyboardEvent("keydown", {
        key: k,
        bubbles: true,
        cancelable: true,
      });
      slider.dispatchEvent(ev);
      await el.updateComplete;
      return ev.defaultPrevented;
    };
    expect(await key("PageUp")).to.be.true;
    expect(el.position).to.equal(60);
    await key("PageDown");
    await key("PageDown");
    expect(el.position).to.equal(40);
    await key("End");
    expect(el.position).to.equal(100);
    await key("PageUp");
    expect(el.position).to.equal(100);
    await key("Home");
    expect(el.position).to.equal(0);
    await key("PageDown");
    expect(el.position).to.equal(0);
    // other keys are left to the native input
    expect(await key("ArrowRight")).to.be.false;
    expect(slider.value).to.equal("0");
  });

  it("moves the slider into the bottom bar in opacity mode", async () => {
    const el = await fixture(
      html`<a11y-compare-image opacity position="60">
        <img slot="bottom" src="${BOTTOM}" alt="Field in 1990" />
        <img slot="top" src="${TOP}" alt="City in 2020" />
      </a11y-compare-image>`,
    );
    await el.updateComplete;
    await el.updateComplete;
    // no divider or handle on the image
    expect(el.shadowRoot.querySelector(".handle")).to.equal(null);
    expect(el.shadowRoot.querySelector(".divider")).to.equal(null);
    expect(el.shadowRoot.querySelector(".stage #slider")).to.equal(null);
    // the range sits in the footer between the two names
    const slider = el.shadowRoot.querySelector(".bar.fade #slider");
    expect(slider).to.exist;
    expect(slider.value).to.equal("60");
    const names = el.shadowRoot.querySelectorAll(".bar.fade .nm");
    expect(names[0].textContent.trim()).to.equal("Field in 1990");
    expect(names[1].textContent.trim()).to.equal("City in 2020");
  });

  it("refreshes the layers when an image changes after first paint", async () => {
    const el = await fixture(
      html`<a11y-compare-image>
        <img slot="bottom" src="${BOTTOM}" alt="bottom image" />
        <img slot="top" src="${TOP}" alt="top image" />
      </a11y-compare-image>`,
    );
    await el.updateComplete;
    el.querySelector('[slot="top"]').setAttribute("src", MID);
    el.querySelector('[slot="top"]').setAttribute("alt", "changed");
    await sleep(20);
    await el.updateComplete;
    expect(el.__upper).to.equal(MID);
    expect(el.__upperAlt).to.equal("changed");
  });
});

describe("a11y-compare-image enticement and colors", () => {
  it("shows the pulse knob until first interaction", async () => {
    const el = await fixture(
      html`<a11y-compare-image data-pulse>
        <img slot="bottom" src="${BOTTOM}" alt="bottom image" />
        <img slot="top" src="${TOP}" alt="top image" />
      </a11y-compare-image>`,
    );
    await el.updateComplete;
    expect(el.dataPulse).to.be.true;
    expect(el.hasAttribute("data-pulse")).to.be.true;
    expect(el.shadowRoot.querySelector(".knob-enticement")).to.exist;
    // the enticement now pulses the handle itself
    expect(el.shadowRoot.querySelector(".handle.knob-enticement")).to.exist;
    // a mouseenter dismisses the enticement
    el.dispatchEvent(new Event("mouseenter", { bubbles: true }));
    await el.updateComplete;
    expect(el.dataPulse).to.be.false;
    expect(el.shadowRoot.querySelector(".knob-enticement")).to.equal(null);
  });

  it("dismisses the pulse knob on focusin as well", async () => {
    const el = await fixture(
      html`<a11y-compare-image data-pulse>
        <img slot="bottom" src="${BOTTOM}" alt="bottom image" />
        <img slot="top" src="${TOP}" alt="top image" />
      </a11y-compare-image>`,
    );
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".knob-enticement")).to.exist;
    el.dispatchEvent(new Event("focusin", { bubbles: true }));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".knob-enticement")).to.equal(null);
  });

  it("ignores accent-color from old markup; dark only inverts controls", async () => {
    const el = await fixture(
      html`<a11y-compare-image accent-color="green">
        <img slot="bottom" src="${BOTTOM}" alt="bottom image" />
        <img slot="top" src="${TOP}" alt="top image" />
      </a11y-compare-image>`,
    );
    await el.updateComplete;
    // accent-color is no longer a property; the attribute is inert
    expect(el.accentColor).to.equal(undefined);
    expect(
      customElements.get("a11y-compare-image").properties.accentColor,
    ).to.equal(undefined);
    const handle = el.shadowRoot.querySelector(".handle");
    expect(el.shadowRoot.querySelector("[accent-color]")).to.equal(null);
    // dark only inverts the slider controls, never the colour scheme
    document.documentElement.style.colorScheme = "light";
    const scheme = getComputedStyle(el).colorScheme;
    expect(getComputedStyle(handle).backgroundColor).to.equal(WHITE);
    expect(getComputedStyle(handle).borderTopColor).to.equal(NAVY);
    el.dark = true;
    await el.updateComplete;
    expect(el.hasAttribute("dark")).to.be.true;
    expect(getComputedStyle(el).colorScheme).to.equal(scheme);
    expect(getComputedStyle(el).backgroundColor).to.equal("rgba(0, 0, 0, 0)");
    expect(getComputedStyle(handle).backgroundColor).to.equal(MIDNIGHT);
    expect(getComputedStyle(handle).borderTopColor).to.equal(WHITE);
    document.documentElement.style.colorScheme = "";
  });

  it("inverts the fade range thumb with dark", async () => {
    const el = await fixture(
      html`<a11y-compare-image opacity>
        <img slot="bottom" src="${BOTTOM}" alt="bottom image" />
        <img slot="top" src="${TOP}" alt="top image" />
      </a11y-compare-image>`,
    );
    await el.updateComplete;
    const slider = el.shadowRoot.querySelector("#slider");
    document.documentElement.style.colorScheme = "light";
    // pseudo-element styles are not readable here, so check the control
    // colours the thumb is painted with (fill, ink) as the range sees them
    const prop = (name) =>
      getComputedStyle(slider).getPropertyValue(name).replace(/\s+/g, "");
    expect(prop("--a11y-compare-image-control-fill")).to.equal(
      "light-dark(#ffffff,#000321)",
    );
    expect(prop("--a11y-compare-image-control-ink")).to.equal(
      "light-dark(#001e44,#ffffff)",
    );
    el.dark = true;
    await el.updateComplete;
    expect(prop("--a11y-compare-image-control-fill")).to.equal(
      "light-dark(#000321,#ffffff)",
    );
    expect(prop("--a11y-compare-image-control-ink")).to.equal(
      "light-dark(#ffffff,#001e44)",
    );
    document.documentElement.style.colorScheme = "";
  });

  it("keeps the stage at the image ratio inside the fit area", async () => {
    const el = await fixture(
      html`<a11y-compare-image fit style="height: 300px; width: 900px">
        <img slot="bottom" src="${BOTTOM}" alt="bottom image" />
        <img slot="top" src="${TOP}" alt="top image" />
      </a11y-compare-image>`,
    );
    await el.updateComplete;
    el.style.setProperty("--a11y-compare-image-ratio", "2");
    const stage = el.shadowRoot.querySelector(".stage");
    const wrap = el.shadowRoot.querySelector(".stage-wrap");
    // wide and short: the height limits the stage
    let r = stage.getBoundingClientRect();
    let w = wrap.getBoundingClientRect();
    expect(Math.abs(r.width / r.height - 2)).to.be.below(0.02);
    expect(Math.abs(r.height - w.height)).to.be.below(1);
    expect(r.width).to.be.below(w.width);
    // tall and narrow: the width limits the stage
    el.style.width = "300px";
    el.style.height = "900px";
    r = stage.getBoundingClientRect();
    w = wrap.getBoundingClientRect();
    expect(Math.abs(r.width / r.height - 2)).to.be.below(0.02);
    expect(Math.abs(r.width - w.width)).to.be.below(1);
    expect(r.height).to.be.below(w.height);
  });

  it("fills the available height when fit is set", async () => {
    const el = await fixture(
      html`<a11y-compare-image fit style="height: 300px">
        <img slot="bottom" src="${BOTTOM}" alt="bottom image" />
        <img slot="top" src="${TOP}" alt="top image" />
      </a11y-compare-image>`,
    );
    await el.updateComplete;
    expect(el.hasAttribute("fit")).to.be.true;
    const container = el.shadowRoot.querySelector("#container");
    expect(getComputedStyle(container).backgroundSize).to.equal("contain");
  });
});
