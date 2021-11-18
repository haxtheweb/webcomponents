import { fixture, expect, html } from "@open-wc/testing";
import "../image-compare-slider.js";
describe("Image comparison", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html` <image-compare-slider
      top-description-id="cloudy"
      top-src="${new URL("../demo/images/Matterhorn02.png", import.meta.url)
        .href}"
      top-alt="Matterhorn without snow"
      bottom-description-id="snowy"
      bottom-src="${new URL("../demo/images/Matterhorn01.png", import.meta.url)
        .href}"
      bottom-alt="Matterhorn with snow"
    >
      <h2 slot="heading">Default Compare Mode</h2>
      <div slot="description">
        The slider will fade away the top image
        <span id="cloudy">(Matterhorn on a cloudy day without snow)</span>
        to reveal the bottom image
        <span id="snowy">(Matterhorn on a clear day with snow)</span>.
      </div>
    </image-compare-slider>`);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
