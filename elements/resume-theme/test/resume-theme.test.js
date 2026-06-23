import { html, fixture, expect } from '@open-wc/testing';
import "../resume-theme.js";

describe("ResumeTheme test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <resume-theme
        title="title"
      ></resume-theme>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
