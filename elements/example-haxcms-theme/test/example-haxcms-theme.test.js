import { html, fixture, expect } from '@open-wc/testing';
import "../example-haxcms-theme.js";

describe("ExampleHaxcmsTheme test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <example-haxcms-theme
        title="title"
      ></example-haxcms-theme>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
