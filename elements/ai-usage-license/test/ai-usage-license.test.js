import { html, fixture, expect } from '@open-wc/testing';
import "../ai-usage-license.js";

describe("AiUsageLicense test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <ai-usage-license
        title="title"
      ></ai-usage-license>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
