import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "../instructional-cadence.js";
import { sampleItems, sampleRows } from "./larch060-sample.js";

describe("InstructionalCadence test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <instructional-cadence
        hide-score
        .items="${sampleItems}"
        .rows="${sampleRows}"
        course-title="LARCH 060"
      ></instructional-cadence>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("lists lessons and interludes in reading order", async () => {
    const lessons = element.shadowRoot.querySelectorAll(
      "ol.lessons > li:not(.interlude)",
    );
    const interludes = element.shadowRoot.querySelectorAll(
      "ol.lessons > li.interlude",
    );
    expect(lessons.length).to.equal(5);
    expect(interludes.length).to.be.above(0);
  });

  it("draws a beat per page with rests", async () => {
    const strip = element.shadowRoot.querySelectorAll(".beats")[1];
    expect(strip.querySelectorAll(".beat").length).to.equal(13);
    expect(strip.querySelectorAll(".beat.rest").length).to.equal(4);
    expect(strip.querySelectorAll(".beat.climax").length).to.equal(1);
  });

  it("links a missing part to the page behind it", async () => {
    const links = element.shadowRoot.querySelectorAll("ul.parts li.miss a");
    expect(links.length).to.be.above(0);
  });

  it("lets a host take over page links", async () => {
    const link = element.shadowRoot.querySelector("ul.parts li.miss a");
    element.addEventListener("cadence-open-page", (e) => e.preventDefault());
    setTimeout(() => link.click());
    const e = await oneEvent(element, "cadence-open-page");
    expect(e.detail.slug).to.be.a("string");
  });

  it("re-groups lessons when the depth changes", async () => {
    element.lessonDepth = 2;
    await element.updateComplete;
    const lessons = element.shadowRoot.querySelectorAll(
      "ol.lessons > li:not(.interlude)",
    );
    expect(lessons.length).to.be.above(5);
  });

  it("shows an empty state without lessons", async () => {
    element.items = [];
    await element.updateComplete;
    expect(element.shadowRoot.querySelector("ol.lessons")).to.not.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
