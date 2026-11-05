import { html, fixture, expect } from "@open-wc/testing";
import "../instructional-cadence.js";

const items = [
  { id: "l", parent: null, title: "Lesson 1", slug: "lesson-1", order: 0 },
  { id: "a", parent: "l", title: "Outline", slug: "outline", order: 0 },
  { id: "b", parent: "l", title: "Preview", slug: "preview", order: 1 },
  { id: "c", parent: "l", title: "Video", slug: "video", order: 2 },
  { id: "d", parent: "l", title: "Activity", slug: "activity", order: 3 },
  { id: "e", parent: "l", title: "Lecture", slug: "lecture", order: 4 },
  { id: "f", parent: "l", title: "Discussion", slug: "discussion", order: 5 },
  { id: "g", parent: "l", title: "Practice", slug: "practice", order: 6 },
  { id: "h", parent: "l", title: "Study Guide", slug: "study-guide", order: 7 },
];
const rows = [2, 1, 2, 3, 2, 5, 2, 3, 3].map((readTime, i) => ({
  id: items[i].id,
  readTime,
}));

describe("InstructionalCadence test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <instructional-cadence
        hide-score
        .items="${items}"
        .rows="${rows}"
        course-title="Test course"
      ></instructional-cadence>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("scores lessons from items and rows", async () => {
    const lessons = element.shadowRoot.querySelectorAll("ol.lessons > li");
    expect(lessons.length).to.equal(1);
    expect(
      element.shadowRoot.querySelectorAll("ul.parts li.pass").length,
    ).to.equal(5);
  });

  it("links a missing part to the page behind it", async () => {
    element.rows = rows.map((r) =>
      r.id === "h" ? { id: "h", readTime: 0 } : r,
    );
    await element.updateComplete;
    const link = element.shadowRoot.querySelector("ul.parts li.miss a");
    expect(link).to.exist;
    expect(link.getAttribute("href")).to.equal("study-guide");
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
