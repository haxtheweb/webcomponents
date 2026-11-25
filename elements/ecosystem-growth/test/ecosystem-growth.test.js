import { html, fixture, expect, waitUntil } from "@open-wc/testing";
import "../ecosystem-growth.js";

const SRC = new URL("../demo/growth/", import.meta.url).href;

describe("EcosystemGrowth test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <ecosystem-growth src="${SRC}"></ecosystem-growth>
    `);
    await waitUntil(
      () => element.shadowRoot.querySelector("canvas"),
      "the growth data loads",
      { timeout: 5000 },
    );
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
    expect(element.shadowRoot.querySelector("h3").textContent).to.equal(
      "Themes over time",
    );
  });

  it("switches views from the header", async () => {
    const buttons = [
      ...element.shadowRoot.querySelectorAll("header .group button"),
    ];
    buttons[1].click();
    await element.updateComplete;
    expect(element.view).to.equal("elements");
    expect(element.shadowRoot.querySelector("aside h3").textContent).to.equal(
      "Elements over time",
    );
    buttons[3].click();
    await element.updateComplete;
    expect(
      element.shadowRoot.querySelectorAll("ol.journey li").length,
    ).to.be.above(1);
    buttons[4].click();
    await element.updateComplete;
    expect(element.view).to.equal("contributors");
    expect(element.shadowRoot.querySelector("aside h3").textContent).to.equal(
      "Contributors over time",
    );
  });

  it("labels every header button with an icon and words", async () => {
    const buttons = [...element.shadowRoot.querySelectorAll("header button")];
    expect(buttons.length).to.equal(6);
    buttons.forEach((b) => {
      expect(b.querySelector("simple-icon-lite")).to.exist;
      expect(b.textContent.trim().length).to.be.above(2);
    });
    expect(buttons[3].textContent.trim()).to.equal("Magic Script");
  });

  it("shows an error, not a blank, when the data is missing", async () => {
    const el = await fixture(html`
      <ecosystem-growth src="./no-such-folder/"></ecosystem-growth>
    `);
    await waitUntil(
      () => el.shadowRoot.querySelector("[role=alert]"),
      "error shown",
      { timeout: 5000 },
    );
    expect(el.shadowRoot.querySelector("[role=alert]").textContent).to.contain(
      "could not be loaded",
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("dark mode", () => {
    const root = document.documentElement;
    const body = document.body;
    let previous;
    beforeEach(() => {
      previous = {
        scheme: root.style.colorScheme,
        background: body.style.backgroundColor,
        color: body.style.color,
      };
      // light-dark() resolves against the used color-scheme. The explicit
      // Canvas background is needed because axe assumes a white page when
      // none is set, which would hide dark mode contrast failures.
      root.style.colorScheme = "dark";
      body.style.backgroundColor = "Canvas";
      body.style.color = "CanvasText";
    });
    afterEach(() => {
      root.style.colorScheme = previous.scheme;
      body.style.backgroundColor = previous.background;
      body.style.color = previous.color;
    });

    it("passes the a11y audit in dark mode", async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });
});
