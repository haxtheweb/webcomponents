import { fixture, expect, html } from "@open-wc/testing";

import "../paper-input-flagged.js";

describe("paper-input-flagged test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<paper-input-flagged
        value="Some content"
        label="URL"
      ></paper-input-flagged> `,
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe("paper-input-flagged behavior", () => {
  it("has expected defaults", async () => {
    const el = await fixture(html`<paper-input-flagged></paper-input-flagged>`);
    expect(el.label).to.equal("");
    expect(el.value).to.equal("");
    expect(el.disabled).to.equal(false);
    expect(el.charCounter).to.equal(false);
    expect(el.inputSuccess.status).to.equal("info");
    expect(el.flaggedInput.length).to.equal(6);
  });

  it("flags an empty value as a notice", async () => {
    const el = await fixture(
      html`<paper-input-flagged value=""></paper-input-flagged>`,
    );
    await el.updateComplete;
    expect(el.status).to.equal("notice");
    expect(el.getAttribute("status")).to.equal("notice");
    expect(el.icon).to.equal("icons:warning");
    expect(
      el.shadowRoot.querySelector(".element-invisible").textContent,
    ).to.equal("Alt data is required for everything except decoration images.");
  });

  it("flags short values with the description message", async () => {
    const el = await fixture(
      html`<paper-input-flagged value="Some content"></paper-input-flagged>`,
    );
    await el.updateComplete;
    expect(el.status).to.equal("error");
    expect(el.icon).to.equal("icons:error");
    expect(
      el.shadowRoot.querySelector(".element-invisible").textContent,
    ).to.equal(
      "Description not effective enough. This should be at least a sentance about what the image is.",
    );
  });

  it("flags values that contain image", async () => {
    const el = await fixture(
      html`<paper-input-flagged
        value="this is an image of a cat"
      ></paper-input-flagged>`,
    );
    await el.updateComplete;
    expect(el.status).to.equal("error");
    expect(
      el.shadowRoot.querySelector(".element-invisible").textContent,
    ).to.equal(
      "Screenreaders will say the word image, don't put it in the descriptive text",
    );
  });

  it("flags values that contain photo or picture", async () => {
    const el = await fixture(
      html`<paper-input-flagged value="photo of a dog"></paper-input-flagged>`,
    );
    await el.updateComplete;
    expect(el.status).to.equal("error");
    expect(
      el.shadowRoot.querySelector(".element-invisible").textContent,
    ).to.equal(
      "Screenreaders will say the word image, don't put photo in the descriptive text",
    );
    el.value = "picture of a house";
    await el.updateComplete;
    await el.updateComplete;
    expect(
      el.shadowRoot.querySelector(".element-invisible").textContent,
    ).to.equal(
      "Screenreaders will say the word image, don't put picture in the descriptive text",
    );
  });

  it("flags mid-length values as a warning", async () => {
    const el = await fixture(
      html`<paper-input-flagged
        value="a big brown dog runs fast"
      ></paper-input-flagged>`,
    );
    await el.updateComplete;
    expect(el.status).to.equal("warning");
    expect(el.icon).to.equal("icons:warning");
    expect(
      el.shadowRoot.querySelector(".element-invisible").textContent,
    ).to.equal(
      "Make sure your alt text is descriptive enough for those that can't see the media.",
    );
  });

  it("rewards long descriptive values with the success status", async () => {
    const el = await fixture(
      html`<paper-input-flagged
        value="a big brown dog runs fast outside of the house today"
      ></paper-input-flagged>`,
    );
    await el.updateComplete;
    expect(el.status).to.equal("info");
    expect(el.icon).to.equal("icons:info-outline");
    expect(
      el.shadowRoot.querySelector(".element-invisible").textContent,
    ).to.equal("You passed our simple accessibility checks.");
  });

  it("falls back to the info icon for unknown statuses", async () => {
    const el = await fixture(html`<paper-input-flagged></paper-input-flagged>`);
    expect(el._iconFromStatus("anything")).to.equal("icons:info");
    expect(el._iconFromStatus("error")).to.equal("icons:error");
    expect(el._iconFromStatus("warning")).to.equal("icons:warning");
    expect(el._iconFromStatus("notice")).to.equal("icons:warning");
    expect(el._iconFromStatus("info")).to.equal("icons:info-outline");
  });

  it("updates value from the field value-changed event", async () => {
    const el = await fixture(
      html`<paper-input-flagged value="Some content"></paper-input-flagged>`,
    );
    el.valueEvent({ detail: { value: "photo of a dog" } });
    await el.updateComplete;
    await el.updateComplete;
    expect(el.value).to.equal("photo of a dog");
    expect(el.status).to.equal("error");
  });

  it("notifies value changes", async () => {
    const el = await fixture(html`<paper-input-flagged></paper-input-flagged>`);
    let eventValue = null;
    el.addEventListener("value-changed", (e) => {
      eventValue = e.detail.value;
    });
    el.value = "a photo";
    await el.updateComplete;
    expect(eventValue).to.equal("a photo");
  });

  it("renders the label and field attributes", async () => {
    const el = await fixture(
      html`<paper-input-flagged
        label="URL"
        value="Some content"
        disabled
        maxlength="120"
        minlength="3"
        char-counter
      ></paper-input-flagged>`,
    );
    await el.updateComplete;
    const field = el.shadowRoot.querySelector("simple-fields-field");
    expect(field.getAttribute("label")).to.equal("URL");
    expect(field.getAttribute("value")).to.equal("Some content");
    expect(field.hasAttribute("disabled")).to.equal(true);
    expect(field.getAttribute("maxlength")).to.equal("120");
    expect(field.getAttribute("minlength")).to.equal("3");
    // FIXED (haxtheweb/issues#3102 #33): the charCounter property is now
    // declared (type Boolean, attribute 'char-counter'), so the host
    // attribute reaches the render binding and is forwarded to the field
    // instead of reading undefined
    expect(el.charCounter).to.equal(true);
    expect(field.hasAttribute("char-counter")).to.equal(true);
    expect(el.shadowRoot.querySelector("simple-tooltip")).to.exist;
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("paper-input-flagged passes accessibility test", async () => {
    const el = await fixture(
      html` <paper-input-flagged></paper-input-flagged> `
    );
    await expect(el).to.be.accessible();
  });
  it("paper-input-flagged passes accessibility negation", async () => {
    const el = await fixture(
      html`<paper-input-flagged
        aria-labelledby="paper-input-flagged"
      ></paper-input-flagged>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("paper-input-flagged can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<paper-input-flagged .foo=${'bar'}></paper-input-flagged>`);
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
      const el = await fixture(html`<paper-input-flagged ></paper-input-flagged>`);
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
      const el = await fixture(html`<paper-input-flagged></paper-input-flagged>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<paper-input-flagged></paper-input-flagged>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
