import { html, fixture, expect } from '@open-wc/testing';
import "../haxma-theme.js";

describe("HaxmaTheme test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <haxma-theme
        title="title"
      ></haxma-theme>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
