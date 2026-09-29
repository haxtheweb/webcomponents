import { fixture, expect, html } from "@open-wc/testing";
import "../lib/letter-grade.js";
import { LetterGrade } from "../lib/letter-grade.js";
import { GradeBookStore } from "../lib/grade-book-store.js";
import { gradeScale, flush } from "./fixtures.js";

describe("letter-grade", () => {
  beforeEach(() => {
    // letter-grade syncs gradeScale from the store through an autorun that
    // captures the value at construction time, so seed the store first
    GradeBookStore.gradeScale = JSON.parse(JSON.stringify(gradeScale));
  });

  afterEach(() => {
    // leave the store with a valid scale so any straggler renders of
    // letter-grade instances stay safe
    GradeBookStore.gradeScale = JSON.parse(JSON.stringify(gradeScale));
    GradeBookStore.activeStudent = 0;
    GradeBookStore.activeAssignment = 0;
  });

  it("has the expected tag and defaults", () => {
    expect(LetterGrade.tag).to.equal("letter-grade");
    const el = globalThis.document.createElement("letter-grade");
    expect(el.pointsSystem).to.equal("pts");
    expect(el.score).to.equal(null);
    expect(el.total).to.equal(null);
    expect(el.letter).to.equal("");
    expect(el.showScale).to.equal(false);
    expect(el.mini).to.equal(false);
    expect(el.displayOnly).to.equal(false);
    expect(el.value).to.equal("");
    expect(el.label).to.equal("");
    expect(el.active).to.equal(false);
  });

  it("computes an A when the percentage meets the top of the scale", async () => {
    const el = await fixture(
      html`<letter-grade score="100" total="100"></letter-grade>`,
    );
    await flush();
    expect(el.letter).to.equal("A");
    expect(el.getAttribute("letter")).to.equal("A");
    // progressive enhancement markup gets stamped into light DOM
    expect(el.innerHTML.includes("Range:")).to.equal(true);
    expect(el.innerHTML.includes("100/100 pts")).to.equal(true);
  });

  it("maps percentage ranges to the matching letter", async () => {
    const cases = [
      [95, 100, "A"],
      [90, 100, "B"],
      [80, 100, "C"],
      [65, 100, "D"],
      [10, 100, "F"],
    ];
    for (const [score, total, letter] of cases) {
      const el = await fixture(
        html`<letter-grade score="${score}" total="${total}"></letter-grade>`,
      );
      await flush();
      expect(el.letter).to.equal(letter);
    }
  });

  it("falls back to the last scale entry below every range", async () => {
    const el = await fixture(
      html`<letter-grade score="0" total="100"></letter-grade>`,
    );
    await flush();
    expect(el.letter).to.equal("F");
  });

  it("shows a slash for a null score (not turned in)", async () => {
    const el = await fixture(html`<letter-grade total="100"></letter-grade>`);
    await flush();
    expect(el.letter).to.equal("/");
    expect(el.getAttribute("letter")).to.equal("/");
    // no scale information can be shown without a letter index
    expect(el.shadowRoot.querySelector(".score")).to.equal(null);
  });

  it("renders score and range when show-scale is set", async () => {
    const el = await fixture(
      html`<letter-grade
        score="90"
        total="100"
        show-scale
      ></letter-grade>`,
    );
    await flush();
    expect(el.showScale).to.equal(true);
    expect(el.shadowRoot.querySelector(".score")).to.exist;
    expect(el.shadowRoot.querySelector(".range")).to.exist;
    // compare normalized textContent: the template interpolates the range
    // across lines so raw innerHTML is full of interleaved whitespace
    const scoreText = el.shadowRoot
      .querySelector(".score")
      .textContent.replace(/\s+/g, " ")
      .trim();
    expect(scoreText).to.equal("(90/100 pts)");
    const rangeText = el.shadowRoot
      .querySelector(".range")
      .textContent.replace(/\s+/g, " ")
      .trim();
    expect(rangeText).to.equal("85% - 92%");
  });

  it("render is safe when the scale shrinks beneath a stale letter index (was BUG: unguarded range read)", async () => {
    // regression: letter-grade keeps its _letterIndex across gradeScale
    // changes; when the scale shrinks underneath the element the stale
    // index used to make render read .lowRange off undefined and throw
    const el = await fixture(
      html`<letter-grade score="90" total="100" show-scale></letter-grade>`,
    );
    await flush();
    expect(el.letter).to.equal("B");
    expect(el.shadowRoot.querySelector(".range")).to.exist;
    // an empty scale skips the recalc so the index goes stale
    el.gradeScale = [];
    await el.updateComplete;
    let threw = false;
    try {
      el.render();
    } catch (e) {
      threw = true;
    }
    expect(threw).to.equal(false);
    // the range block is skipped entirely without a matching scale entry
    expect(el.shadowRoot.querySelector(".range")).to.equal(null);
  });

  it("renders a tooltip when mini is set with a label", async () => {
    const el = await fixture(
      html`<letter-grade
        mini
        label="Assignment 1"
        score="9"
        total="10"
      ></letter-grade>`,
    );
    await flush();
    expect(el.mini).to.equal(true);
    expect(el.shadowRoot.querySelector("simple-tooltip")).to.exist;
    const tooltipText = el.shadowRoot
      .querySelector("simple-tooltip")
      .textContent.replace(/\s+/g, " ")
      .trim();
    expect(tooltipText.indexOf("Assignment 1")).to.not.equal(-1);
    expect(tooltipText.indexOf("(9/10 pts)")).to.not.equal(-1);
  });

  it("mini without a label does not trigger the tooltip import branch", async () => {
    const el = await fixture(
      html`<letter-grade mini score="9" total="10"></letter-grade>`,
    );
    await flush();
    expect(el.shadowRoot.querySelector("simple-tooltip")).to.exist;
  });

  it("display-only skips letter recalculation", async () => {
    const el = await fixture(
      html`<letter-grade
        display-only
        score="95"
        total="100"
      ></letter-grade>`,
    );
    await flush();
    expect(el.letter).to.equal("");
  });
});
