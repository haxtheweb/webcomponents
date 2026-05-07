import { html, fixture, expect } from '@open-wc/testing';
import "../career-timeline.js";

describe("CareerTimeline test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <career-timeline
        title="title"
      ></career-timeline>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
