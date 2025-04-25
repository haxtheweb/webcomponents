import { html, fixture, expect } from '@open-wc/testing';
import "../journey-theme.js";

describe("JourneyTheme test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <journey-theme
        title="title"
      ></journey-theme>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
