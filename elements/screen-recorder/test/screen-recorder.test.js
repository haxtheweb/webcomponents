import { html, fixture, expect } from '@open-wc/testing';
import "../screen-recorder.js";

describe("ScreenRecorder test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <screen-recorder
        title="title"
      ></screen-recorder>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
