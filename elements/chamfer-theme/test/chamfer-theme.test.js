import { html, fixture, expect } from '@open-wc/testing';
import "../chamfer-theme.js";

describe("ChamferTheme test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <chamfer-theme></chamfer-theme>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
