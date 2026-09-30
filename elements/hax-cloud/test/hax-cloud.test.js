import { fixture, expect, html } from "@open-wc/testing";
import "../hax-cloud.js";

// suppress the constructor's Google Fonts <link> so this suite never issues
// a real network request; the font-link branch is covered in
// hax-cloud-behavior.test.js with head.appendChild stubbed instead
globalThis.__haxLogoFontLoaded = true;

describe("elementName test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<hax-cloud></hax-cloud>`);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
