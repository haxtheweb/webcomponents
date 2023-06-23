import { fixture, expect, html } from "@open-wc/testing";
import "../terrible-themes.js";

describe("elementName test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<terrible-themes></terrible-themes>`);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });
  /*
  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });*/
});
