import { fixture, expect, html } from "@open-wc/testing";
import "../product-offering.js";

// tiny inline image so no network request is ever issued
const DATA_IMAGE =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

describe("product-offering title splitting", () => {
  it("splits a multi word title into two rendered spans", async () => {
    const el = await fixture(html`
      <product-offering
        title="Product Launch"
        element-visible
      ></product-offering>
    `);
    await el.updateComplete;
    expect(el._titleOne).to.equal("Product");
    expect(el._titleTwo).to.equal("Launch");
    const underline = el.shadowRoot.querySelector("span.underline");
    expect(underline.textContent).to.equal("Product");
    const second = el.shadowRoot.querySelectorAll("h4 span")[1];
    expect(second.textContent).to.equal("Launch");
  });

  it("keeps a single word title in the first span only", async () => {
    const el = await fixture(html`
      <product-offering title="Offering" element-visible></product-offering>
    `);
    await el.updateComplete;
    expect(el._titleOne).to.equal("Offering");
    expect(el._titleTwo).to.equal(undefined);
    const underline = el.shadowRoot.querySelector("span.underline");
    expect(underline.textContent).to.equal("Offering");
  });

  it("re-splits the title when it changes after initial render", async () => {
    const el = await fixture(html`
      <product-offering title="First" element-visible></product-offering>
    `);
    await el.updateComplete;
    el.title = "New Words Here";
    await el.updateComplete;
    expect(el._titleOne).to.equal("New");
    expect(el._titleTwo).to.equal("Words Here");
  });
});

describe("product-offering render", () => {
  it("renders image, icon and description when visible", async () => {
    const el = await fixture(html`
      <product-offering
        title="Offering"
        element-visible
        source=${DATA_IMAGE}
        alt="Product photo"
        icon="icons:store"
        accent-color="green"
        description="A fine product"
      ></product-offering>
    `);
    await el.updateComplete;
    const img = el.shadowRoot.querySelector("img.image");
    expect(img.getAttribute("alt")).to.equal("Product photo");
    expect(img.getAttribute("src")).to.equal(DATA_IMAGE);
    expect(img.getAttribute("loading")).to.equal("lazy");
    const icon = el.shadowRoot.querySelector("simple-icon");
    expect(icon.getAttribute("accent-color")).to.equal("green");
    expect(icon.getAttribute("icon")).to.equal("icons:store");
    const description = el.shadowRoot.querySelector(".sqaureDescription slot");
    expect(description.textContent.trim()).to.equal("A fine product");
  });

  it("renders nothing before the element is visible", async () => {
    const el = await fixture(
      html`<product-offering title="Hidden"></product-offering>`,
    );
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".container")).to.equal(null);
    el.elementVisible = true;
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".container")).to.not.equal(null);
  });

  it("defaults alt to empty and accent color to blue", async () => {
    const el = await fixture(html`
      <product-offering element-visible></product-offering>
    `);
    expect(el.alt).to.equal("");
    expect(el.accentColor).to.equal("blue");
  });

  it("defines the element on the custom element registry", () => {
    expect(globalThis.customElements.get("product-offering")).to.exist;
  });
});

describe("product-offering DDD redesign", () => {
  it("draws the icon background as a true circle", async () => {
    const el = await fixture(html`
      <product-offering
        title="A very long product offering title that wraps onto many lines in a narrow card"
        element-visible
        source=${DATA_IMAGE}
        icon="icons:store"
      ></product-offering>
    `);
    await el.updateComplete;
    const circle = el.shadowRoot.querySelector(".icon-background");
    const box = circle.getBoundingClientRect();
    expect(box.width > 0).to.equal(true);
    expect(box.width).to.equal(box.height);
    const cs = getComputedStyle(circle);
    expect(cs.flexGrow).to.equal("0");
    expect(cs.flexShrink).to.equal("0");
  });

  it("still accepts accent-color and paints the circle from the DDD map", async () => {
    const el = await fixture(html`
      <product-offering
        title="Accent"
        element-visible
        icon="icons:store"
        accent-color="green"
      ></product-offering>
    `);
    await el.updateComplete;
    expect(el.getAttribute("accent-color")).to.equal("green");
    expect(
      getComputedStyle(el).getPropertyValue("--ddd-accent-color").trim(),
    ).to.not.equal("");
    const circle = el.shadowRoot.querySelector(".icon-background");
    // opportunityGreen #008755
    expect(getComputedStyle(circle).backgroundColor).to.equal(
      "rgb(0, 135, 85)",
    );
  });

  it("uses readable DDD text colours in both schemes", async () => {
    const wrap = await fixture(html`
      <div style="color-scheme: light">
        <product-offering title="Light one" element-visible></product-offering>
        <product-offering
          title="Dark one"
          element-visible
          dark
        ></product-offering>
      </div>
    `);
    const [light, dark] = wrap.querySelectorAll("product-offering");
    await light.updateComplete;
    await dark.updateComplete;
    const heading = (el) =>
      getComputedStyle(el.shadowRoot.querySelector("h4")).color;
    // nittanyNavy on light, white when dark
    expect(heading(light)).to.equal("rgb(0, 30, 68)");
    expect(heading(dark)).to.equal("rgb(255, 255, 255)");
    wrap.style.colorScheme = "dark";
    expect(heading(light)).to.equal("rgb(255, 255, 255)");
  });

  it("stacks the image above the text at narrow widths", async () => {
    const wrap = await fixture(html`
      <div style="width: 320px">
        <product-offering
          title="Narrow"
          element-visible
          source=${DATA_IMAGE}
          icon="icons:store"
        ></product-offering>
      </div>
    `);
    const el = wrap.querySelector("product-offering");
    await el.updateComplete;
    const img = el.shadowRoot
      .querySelector("img.image")
      .getBoundingClientRect();
    const square = el.shadowRoot
      .querySelector(".square")
      .getBoundingClientRect();
    expect(square.top >= img.bottom).to.equal(true);
  });

  it("keeps description text readable on a light page with dark set, for every accent", async () => {
    const accents = ["pink", "cyan", "yellow", "blue", "grey", "purple"];
    for (const accent of accents) {
      for (const dark of [false, true]) {
        const wrap = await fixture(html`
          <div
            style="color-scheme: light; background-color: rgb(255, 255, 255)"
          >
            <product-offering
              title="Technical mentor support"
              element-visible
              icon="social:group"
              accent-color=${accent}
              ?dark=${dark}
            >
              <div slot="description">Our mentors guide your learning.</div>
            </product-offering>
          </div>
        `);
        const el = wrap.querySelector("product-offering");
        await el.updateComplete;
        const hostBg = getComputedStyle(el).backgroundColor;
        // transparent host shows the white page behind it
        const bg =
          hostBg === "rgba(0, 0, 0, 0)" ? "rgb(255, 255, 255)" : hostBg;
        const desc = getComputedStyle(
          el.querySelector('[slot="description"]'),
        ).color;
        const heading = getComputedStyle(
          el.shadowRoot.querySelector("h4"),
        ).color;
        expect(desc, `${accent} dark=${dark}`).to.not.equal(bg);
        expect(heading, `${accent} dark=${dark}`).to.not.equal(bg);
        if (dark) {
          // potentialMidnight surface under light text
          expect(hostBg).to.equal("rgb(0, 3, 33)");
        }
      }
    }
  });
});
