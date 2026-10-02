import { fixture, expect, html } from "@open-wc/testing";

import "../star-rating.js";
import { StarRating } from "../star-rating.js";

describe("star-rating test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <star-rating title="test-title"></star-rating>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe("star-rating behavior", () => {
  it("exposes haxProperties for the HAX editor", () => {
    const props = StarRating.haxProperties;
    expect(props).to.exist;
    expect(props.canScale).to.equal(true);
    expect(props.gizmo.title).to.equal("Star Rating");
    expect(props.gizmo.icon).to.equal("icons:star");
    expect(props.gizmo.handles).to.deep.equal([]);
    const configure = props.settings.configure.map((s) => s.property);
    expect(configure).to.deep.equal([
      "score",
      "possible",
      "numStars",
      "interactive",
      "rubricScaleMode",
    ]);
  });

  it("has expected defaults and renders the score readout", async () => {
    const el = await fixture(html`<star-rating></star-rating>`);
    expect(el.numStars).to.equal(5);
    expect(el.score).to.equal(10);
    expect(el.possible).to.equal(100);
    expect(el._calPercent).to.equal(0.1);
    expect(el.dark).to.equal(true);
    expect(el.contrast).to.equal(0);
    expect(el.accentColor).to.equal("yellow");
    expect(el.rubricScaleMode).to.equal(false);
    expect(el.shadowRoot.querySelector(".rating").textContent.trim()).to.equal(
      "0.1 (10/100)",
    );
  });

  it("renders half and border stars for a partial score", async () => {
    const el = await fixture(html`<star-rating></star-rating>`);
    const icons = [...el.shadowRoot.querySelectorAll("simple-icon")];
    expect(icons.length).to.equal(5);
    expect(icons.map((i) => i.getAttribute("icon"))).to.deep.equal([
      "star-half",
      "star-border",
      "star-border",
      "star-border",
      "star-border",
    ]);
    expect(icons[0].getAttribute("accent-color")).to.equal("yellow");
  });

  it("renders full stars for a perfect score", async () => {
    const el = await fixture(
      html`<star-rating score="100" possible="100"></star-rating>`,
    );
    await el.updateComplete;
    const icons = [...el.shadowRoot.querySelectorAll("simple-icon")];
    expect(icons.map((i) => i.getAttribute("icon"))).to.deep.equal([
      "star",
      "star",
      "star",
      "star",
      "star",
    ]);
  });

  it("renders full, half and border stars for a mid score", async () => {
    const el = await fixture(
      html`<star-rating score="30" possible="100"></star-rating>`,
    );
    await el.updateComplete;
    const icons = [...el.shadowRoot.querySelectorAll("simple-icon")];
    expect(icons.map((i) => i.getAttribute("icon"))).to.deep.equal([
      "star",
      "star-half",
      "star-border",
      "star-border",
      "star-border",
    ]);
  });

  it("renders nothing but the readout when numStars is zero", async () => {
    const el = await fixture(html`<star-rating num-stars="0"></star-rating>`);
    await el.updateComplete;
    expect(el.shadowRoot.querySelectorAll("simple-icon").length).to.equal(0);
    expect(el.shadowRoot.querySelector(".rating").textContent.trim()).to.equal(
      "0.1 (10/100)",
    );
  });

  it("recalculates the percentage when score or possible change", async () => {
    const el = await fixture(html`<star-rating></star-rating>`);
    el.score = 50;
    // _calPercent is set inside updated() so the readout re-renders after a
    // second chained update
    await el.updateComplete;
    await el.updateComplete;
    expect(el._calPercent).to.equal(0.5);
    expect(el.shadowRoot.querySelector(".rating").textContent.trim()).to.equal(
      "0.5 (50/100)",
    );
    el.possible = 200;
    await el.updateComplete;
    await el.updateComplete;
    expect(el._calPercent).to.equal(0.25);
  });

  it("substitutes possible 1 when possible is set to 0", async () => {
    const el = await fixture(
      html`<star-rating score="10" possible="0"></star-rating>`,
    );
    await el.updateComplete;
    await el.updateComplete;
    expect(el.possible).to.equal(1);
    expect(el._calPercent).to.equal(10);
    expect(el.shadowRoot.querySelector(".rating").textContent.trim()).to.equal(
      "10 (10/1)",
    );
  });

  it("renders interactive star buttons that fire star-rating-click", async () => {
    const el = await fixture(html`<star-rating interactive></star-rating>`);
    await el.updateComplete;
    expect(el.hasAttribute("interactive")).to.equal(true);
    const buttons = [...el.shadowRoot.querySelectorAll("simple-icon-button")];
    expect(buttons.length).to.equal(5);
    expect(buttons.map((b) => b.getAttribute("data-value"))).to.deep.equal([
      "1",
      "2",
      "3",
      "4",
      "5",
    ]);
    expect(buttons[0].getAttribute("icon")).to.equal("star-half");
    let clickEvent = null;
    el.addEventListener("star-rating-click", (e) => {
      clickEvent = e;
    });
    buttons[2].click();
    expect(clickEvent).to.exist;
    expect(clickEvent.detail.value).to.equal("3");
    expect(clickEvent.bubbles).to.equal(true);
    expect(clickEvent.cancelable).to.equal(true);
  });

  it("gives interactive stars value-bearing labels and radiogroup semantics", async () => {
    const el = await fixture(
      html`<star-rating interactive score="60" possible="100"></star-rating>`,
    );
    await el.updateComplete;
    // _calPercent settles in updated() on a chained second update
    await el.updateComplete;
    // haxtheweb/issues#3107: true APG radiogroup semantics now that
    // simple-icon-button exposes the role pass-through. The container is
    // a labeled radiogroup and each star's internal native button
    // carries role=radio + aria-checked; the star hosts stay
    // semantic-free wrappers so axe nested-interactive stays clean
    const stars = el.shadowRoot.querySelector(".stars");
    expect(stars.getAttribute("role")).to.equal("radiogroup");
    expect(stars.getAttribute("aria-label")).to.equal("Star rating");
    const buttons = [...el.shadowRoot.querySelectorAll("simple-icon-button")];
    expect(buttons.length).to.equal(5);
    // value-bearing labels replace the generic icon-derived 'star' names;
    // label forwards to the inner button's accessible name
    expect(buttons.map((b) => b.getAttribute("label"))).to.deep.equal([
      "Rate 1 of 5",
      "Rate 2 of 5",
      "Rate 3 of 5",
      "Rate 4 of 5",
      "Rate 5 of 5",
    ]);
    const inner = (b) => b.shadowRoot.querySelector("button");
    buttons.forEach((b) => {
      expect(inner(b).getAttribute("aria-label")).to.equal(
        b.getAttribute("label"),
      );
      expect(inner(b).getAttribute("role")).to.equal("radio");
      expect(b.hasAttribute("role")).to.equal(false);
    });
    // score 60/100 -> 3 of 5 stars is the checked radio
    expect(
      buttons.map((b) => inner(b).getAttribute("aria-checked")),
    ).to.deep.equal(["false", "false", "true", "false", "false"]);
    // display mode keeps no group semantics
    const display = await fixture(html`<star-rating></star-rating>`);
    await display.updateComplete;
    const displayStars = display.shadowRoot.querySelector(".stars");
    expect(displayStars.getAttribute("role")).to.equal(null);
    expect(displayStars.getAttribute("aria-label")).to.equal(null);
  });

  it("rovers the tab stop onto the checked star", async () => {
    const el = await fixture(
      html`<star-rating interactive score="60" possible="100"></star-rating>`,
    );
    await el.updateComplete;
    await el.updateComplete;
    const buttons = [...el.shadowRoot.querySelectorAll("simple-icon-button")];
    const inner = (b) => b.shadowRoot.querySelector("button");
    // the checked star (3) is the single tab stop, the rest are -1
    expect(buttons.map((b) => inner(b).getAttribute("tabindex"))).to.deep.equal(
      ["-1", "-1", "0", "-1", "-1"],
    );
    // a rating that rounds to no star falls back to the first star
    const zero = await fixture(
      html`<star-rating interactive score="0" possible="100"></star-rating>`,
    );
    await zero.updateComplete;
    await zero.updateComplete;
    const zeroButtons = [
      ...zero.shadowRoot.querySelectorAll("simple-icon-button"),
    ];
    expect(
      zeroButtons.map((b) => inner(b).getAttribute("tabindex")),
    ).to.deep.equal(["0", "-1", "-1", "-1", "-1"]);
  });

  it("moves focus and selects with arrow keys with wraparound", async () => {
    const el = await fixture(
      html`<star-rating interactive score="60" possible="100"></star-rating>`,
    );
    await el.updateComplete;
    await el.updateComplete;
    const buttons = [...el.shadowRoot.querySelectorAll("simple-icon-button")];
    let clickEvent = null;
    el.addEventListener("star-rating-click", (e) => {
      clickEvent = e;
    });
    const keydown = (key) =>
      new KeyboardEvent("keydown", { key, bubbles: true, composed: true });
    const stars = el.shadowRoot.querySelector(".stars");
    // start on the checked star (3), the default tab stop
    buttons[2].focus();
    stars.dispatchEvent(keydown("ArrowRight"));
    // focus moved to star 4 through the focus delegation and selected it
    expect(el.shadowRoot.activeElement === buttons[3]).to.equal(true);
    expect(clickEvent.detail.value).to.equal("4");
    // the roving tab stop followed the focused star
    await el.updateComplete;
    const inner = (b) => b.shadowRoot.querySelector("button");
    expect(buttons.map((b) => inner(b).getAttribute("tabindex"))).to.deep.equal(
      ["-1", "-1", "-1", "0", "-1"],
    );
    // wraparound from the last star forward lands on the first
    buttons[4].focus();
    stars.dispatchEvent(keydown("ArrowRight"));
    expect(el.shadowRoot.activeElement === buttons[0]).to.equal(true);
    expect(clickEvent.detail.value).to.equal("1");
  });

  it("moves focus with Home and End without selecting", async () => {
    const el = await fixture(
      html`<star-rating interactive score="60" possible="100"></star-rating>`,
    );
    await el.updateComplete;
    await el.updateComplete;
    const buttons = [...el.shadowRoot.querySelectorAll("simple-icon-button")];
    let clickEvent = null;
    el.addEventListener("star-rating-click", (e) => {
      clickEvent = e;
    });
    const keydown = (key) =>
      new KeyboardEvent("keydown", { key, bubbles: true, composed: true });
    const stars = el.shadowRoot.querySelector(".stars");
    stars.dispatchEvent(keydown("End"));
    expect(el.shadowRoot.activeElement === buttons[4]).to.equal(true);
    expect(clickEvent).to.equal(null);
    await el.updateComplete;
    const inner = (b) => b.shadowRoot.querySelector("button");
    expect(buttons.map((b) => inner(b).getAttribute("tabindex"))).to.deep.equal(
      ["-1", "-1", "-1", "-1", "0"],
    );
    stars.dispatchEvent(keydown("Home"));
    expect(el.shadowRoot.activeElement === buttons[0]).to.equal(true);
    expect(clickEvent).to.equal(null);
  });

  it("renders OER schema metadata in rubric scale mode", async () => {
    const el = await fixture(
      html`<star-rating
        rubric-scale-mode
        score="100"
        possible="100"
      ></star-rating>`,
    );
    await el.updateComplete;
    expect(el.rubricScaleMode).to.equal(true);
    const wrapper = el.shadowRoot.querySelector(".wrapper");
    expect(wrapper.getAttribute("typeof")).to.equal("oer:RubricScale");
    const icons = [...el.shadowRoot.querySelectorAll("simple-icon")];
    expect(icons.length).to.equal(5);
    icons.forEach((icon, i) => {
      expect(icon.getAttribute("typeof")).to.equal("oer:RubricLevel");
      expect(icon.getAttribute("property")).to.equal("oer:hasLevel");
      const ordinal = icon.querySelector('meta[property="oer:levelOrdinal"]');
      const points = icon.querySelector('meta[property="oer:levelPoints"]');
      expect(ordinal.getAttribute("content")).to.equal(String(i + 1));
      expect(points.getAttribute("content")).to.equal(String((i + 1) * 20));
    });
    expect(el._rubricLevelPoints(1)).to.equal(20);
    expect(el._rubricLevelPoints(5)).to.equal(100);
  });

  it("renders OER schema metadata on interactive buttons in rubric scale mode", async () => {
    const el = await fixture(
      html`<star-rating
        rubric-scale-mode
        interactive
        score="100"
        possible="100"
      ></star-rating>`,
    );
    await el.updateComplete;
    const buttons = [...el.shadowRoot.querySelectorAll("simple-icon-button")];
    expect(buttons.length).to.equal(5);
    buttons.forEach((button, i) => {
      expect(button.getAttribute("typeof")).to.equal("oer:RubricLevel");
      expect(button.getAttribute("property")).to.equal("oer:hasLevel");
      const ordinal = button.querySelector('meta[property="oer:levelOrdinal"]');
      const points = button.querySelector('meta[property="oer:levelPoints"]');
      expect(ordinal.getAttribute("content")).to.equal(String(i + 1));
      expect(points.getAttribute("content")).to.equal(String((i + 1) * 20));
    });
  });

  it("returns zero rubric points when numStars is zero", async () => {
    const el = await fixture(html`<star-rating num-stars="0"></star-rating>`);
    await el.updateComplete;
    expect(el._rubricLevelPoints(1)).to.equal(0);
  });

  it("passes the a11y audit while interactive", async () => {
    const el = await fixture(html`<star-rating interactive></star-rating>`);
    await el.updateComplete;
    await expect(el).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("star-rating passes accessibility test", async () => {
    const el = await fixture(html` <star-rating></star-rating> `);
    await expect(el).to.be.accessible();
  });
  it("star-rating passes accessibility negation", async () => {
    const el = await fixture(
      html`<star-rating aria-labelledby="star-rating"></star-rating>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("star-rating can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<star-rating .foo=${'bar'}></star-rating>`);
    expect(el.foo).to.equal('bar');
  })
})
*/

/*
// Test if element is mobile responsive
describe('Test Mobile Responsiveness', () => {
    before(async () => {z   
      await setViewport({width: 375, height: 750});
    })
    it('sizes down to 360px', async () => {
      const el = await fixture(html`<star-rating ></star-rating>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('360px');
    })
}) */

/*
// Test if element sizes up for desktop behavior
describe('Test Desktop Responsiveness', () => {
    before(async () => {
      await setViewport({width: 1000, height: 1000});
    })
    it('sizes up to 410px', async () => {
      const el = await fixture(html`<star-rating></star-rating>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<star-rating></star-rating>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
