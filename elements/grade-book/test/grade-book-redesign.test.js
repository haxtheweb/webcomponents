// Toolbar + roster redesign: bug fixes 1-5, roster grid keyboard support,
// the live region, grade-book-lite parity and the unchanged front end API.
import { fixture, expect, html } from "@open-wc/testing";
import { sendKeys } from "@web/test-runner-commands";
import "../grade-book.js";
import { GradeBook } from "../grade-book.js";
import "../lib/grade-book-lite.js";
import { GradeBookLite } from "../lib/grade-book-lite.js";
import "../lib/grade-book-student-block.js";
import "../lib/letter-grade.js";
import "../lib/letter-grade-picker.js";
import { GradeBookStore } from "../lib/grade-book-store.js";
import {
  isGraded,
  gradeBookLetter,
  studentDisplayName,
  GradeBookTagColors,
} from "../lib/GradeBookHelpers.js";
import { makeDatabase, gradeScale, flush } from "./fixtures.js";

async function loadJson(tag) {
  const el =
    tag === "lite"
      ? await fixture(html`<grade-book-lite></grade-book-lite>`)
      : await fixture(html`<grade-book></grade-book>`);
  el.source = "json";
  el.sourceData = JSON.stringify(makeDatabase());
  await el.updateComplete;
  await flush();
  await el.updateComplete;
  await flush();
  await el.updateComplete;
  return el;
}
const deep = () => {
  let a = globalThis.document.activeElement;
  while (a && a.shadowRoot && a.shadowRoot.activeElement) {
    a = a.shadowRoot.activeElement;
  }
  return a;
};
const cell = (el, s, a) =>
  el.shadowRoot.querySelector(
    `#studentgrid button[data-student="${s}"][data-assignment="${a}"]`,
  );
const key = (target, k, opts = {}) =>
  target.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: k,
      bubbles: true,
      composed: true,
      cancelable: true,
      ...opts,
    }),
  );

describe("grade-book redesign", () => {
  beforeEach(() => {
    GradeBookStore.database = makeDatabase();
    GradeBookStore.gradeScale = JSON.parse(JSON.stringify(gradeScale));
    GradeBookStore.activeStudent = 0;
    GradeBookStore.activeAssignment = 0;
  });
  afterEach(() => {
    GradeBookStore.activeStudent = 0;
    GradeBookStore.activeAssignment = 0;
    GradeBookStore.database = makeDatabase();
    GradeBookStore.gradeScale = JSON.parse(JSON.stringify(gradeScale));
  });

  describe("helpers", () => {
    it("isGraded treats empty / missing / non-numeric as not graded, 0 as graded", () => {
      expect(isGraded(undefined)).to.equal(false);
      expect(isGraded(null)).to.equal(false);
      expect(isGraded("")).to.equal(false);
      expect(isGraded("n/a")).to.equal(false);
      expect(isGraded(0)).to.equal(true);
      expect(isGraded("17")).to.equal(true);
    });
    it("gradeBookLetter never falls to the bottom letter between ranges", () => {
      const scale = [
        { letter: "A", highRange: "100", lowRange: "93" },
        { letter: "A-", highRange: "92", lowRange: "90" },
        { letter: "F", highRange: "59", lowRange: "0" },
      ];
      // 92.5% sits between A (93) and A- (90-92): A-, not the bottom F
      expect(gradeBookLetter(18.5, 20, scale)).to.equal("A-");
      expect(gradeBookLetter(18.7, 20, scale)).to.equal("A");
      expect(gradeBookLetter(185, 200, scale)).to.equal("A-");
      expect(gradeBookLetter(30, 20, scale)).to.equal("A");
      expect(gradeBookLetter(undefined, 20, scale)).to.equal("");
      expect(gradeBookLetter(10, 20, [])).to.equal("");
    });
    it("studentDisplayName supports both data shapes", () => {
      expect(studentDisplayName({ name: "Ann Lee" })).to.equal("Ann Lee");
      expect(studentDisplayName({ student: "Ann", surname: "Lee" })).to.equal(
        "Ann Lee",
      );
      expect(studentDisplayName({ student: "Ann" })).to.equal("Ann");
      expect(studentDisplayName(null)).to.equal("");
    });
  });

  describe("bug 1: json / url sources set the grade scale", () => {
    it("json source fills an empty store grade scale (grade-book)", async () => {
      GradeBookStore.gradeScale = [];
      const el = await loadJson();
      expect(GradeBookStore.gradeScale.length).to.equal(5);
      expect(el.ready).to.equal(true);
      // the roster cell shows its letter from the scale
      expect(
        cell(el, 0, 0).querySelector(".gb-letter").textContent.trim(),
      ).to.equal("B");
    });
    it("json source fills an empty store grade scale (grade-book-lite)", async () => {
      GradeBookStore.gradeScale = [];
      await loadJson("lite");
      expect(GradeBookStore.gradeScale.length).to.equal(5);
    });
    it("url source fills an empty store grade scale", async () => {
      const originalFetch = globalThis.fetch;
      globalThis.fetch = () =>
        Promise.resolve({ ok: true, json: () => makeDatabase() });
      GradeBookStore.gradeScale = [];
      const el = await fixture(html`<grade-book></grade-book>`);
      el.source = "url";
      el.sourceData = "https://example.com/book.json";
      await flush(100);
      globalThis.fetch = originalFetch;
      expect(GradeBookStore.gradeScale.length).to.equal(5);
      expect(el.ready).to.equal(true);
    });
    it("importStateCleanup prefers the database it is handed", async () => {
      const el = await fixture(html`<grade-book></grade-book>`);
      GradeBookStore.gradeScale = [];
      el.importStateCleanup({
        gradeScale: [{ letter: "P", highRange: 100, lowRange: 0 }],
      });
      expect(GradeBookStore.gradeScale[0].letter).to.equal("P");
    });
  });

  describe("bug 2: student popover shows name and ID", () => {
    it("reads the roster shape { student, surname, id }", async () => {
      const el = await fixture(
        html`<grade-book-student-block
          .student="${{
            student: "Yet",
            surname: "More",
            id: "ppl994",
            photo: "https://example.com/p.jpg",
          }}"
        ></grade-book-student-block>`,
      );
      expect(el.shadowRoot.querySelector("h2").textContent.trim()).to.equal(
        "Yet More",
      );
      expect(el.shadowRoot.querySelector("li").textContent).to.include(
        "ppl994",
      );
      expect(el.shadowRoot.querySelector("img").getAttribute("alt")).to.include(
        "Yet More",
      );
    });
    it("still reads the { name, userId } shape", async () => {
      const el = await fixture(
        html`<grade-book-student-block
          .student="${{ name: "Ann Lee", userId: "al1" }}"
        ></grade-book-student-block>`,
      );
      expect(el.shadowRoot.querySelector("h2").textContent.trim()).to.equal(
        "Ann Lee",
      );
      expect(el.shadowRoot.querySelector("li").textContent).to.include("al1");
    });
  });

  describe("bug 3: ungraded work is never an F", () => {
    it("history entries for a missing grade are null", async () => {
      const el = await loadJson();
      // Bob (1) has a1 = 5 and no a2 at all
      const history = el.getStudentSubmissions(1);
      expect(history.length).to.equal(1);
      expect(history[0].studentScore).to.equal(5);
      // Alice (0) has a2 = "" in the data
      const alice = el.getStudentSubmissions(0);
      expect(alice[1].studentScore).to.equal(null);
    });
    it("letter-grade shows not graded for undefined / empty scores", async () => {
      const lg = await fixture(
        html`<letter-grade
          .total="${20}"
          .score="${undefined}"
        ></letter-grade>`,
      );
      lg.gradeScale = JSON.parse(JSON.stringify(gradeScale));
      await lg.updateComplete;
      expect(lg.letter).to.equal("/");
      expect(
        lg.shadowRoot.querySelector(".letter").textContent.trim(),
      ).to.equal("–");
    });
    it("the history popover and grid cells say not graded", async () => {
      const el = await loadJson();
      GradeBookStore.activeStudent = 0;
      await flush();
      await el.updateComplete;
      await flush();
      await el.updateComplete;
      const labels = Array.from(
        el.shadowRoot.querySelectorAll(".active-student-grade-history button"),
      ).map((b) => b.getAttribute("aria-label"));
      expect(labels).to.include("Assignment 2, Not graded");
      expect(cell(el, 0, 1).querySelector(".gb-ungraded").textContent).to.equal(
        "–",
      );
      expect(cell(el, 0, 1).textContent).to.include("Not graded");
      expect(cell(el, 0, 1).querySelector(".gb-letter")).to.equal(null);
    });
  });

  describe("bug 4: score area", () => {
    it("names the lock button and the score field", async () => {
      const el = await loadJson();
      const lock = el.shadowRoot.querySelector(
        ".student-feedback-score .gb-lock",
      );
      expect(lock.getAttribute("aria-label")).to.equal("Lock total score");
      expect(lock.getAttribute("aria-pressed")).to.equal("true");
      lock.click();
      await el.updateComplete;
      expect(el.scoreLock).to.equal(false);
      expect(lock.getAttribute("aria-pressed")).to.equal("false");
      expect(
        el.shadowRoot.querySelector("#totalpts").getAttribute("label"),
      ).to.equal("Total score");
    });
    it("keeps / N pts on one line and lays the group out without overlap", async () => {
      const el = await loadJson();
      el.style.width = "420px";
      el.style.display = "block";
      await flush(100);
      const out = el.shadowRoot.querySelector(".gb-out-of");
      expect(out.textContent.trim()).to.equal("/ 10 pts");
      expect(getComputedStyle(out).whiteSpace).to.equal("nowrap");
      const lineHeight = parseFloat(getComputedStyle(out).fontSize) * 2;
      expect(out.getBoundingClientRect().height).to.be.below(lineHeight);
      const lock = el.shadowRoot
        .querySelector(".gb-lock")
        .getBoundingClientRect();
      const field = el.shadowRoot
        .querySelector("#totalpts")
        .getBoundingClientRect();
      // side by side or wrapped below, never on top of each other
      expect(lock.right <= field.left + 1 || lock.bottom <= field.top + 1).to.be
        .true;
    });
    it("the score letter is not graded when nothing is entered", async () => {
      const el = await loadJson();
      GradeBookStore.activeAssignment = 1;
      await flush(100);
      await el.updateComplete;
      const lg = el.shadowRoot.querySelector(
        ".student-feedback-score letter-grade",
      );
      await lg.updateComplete;
      expect(lg.letter).to.equal("/");
    });
  });

  describe("bug 5: letter-grade-picker follows the store", () => {
    it("renders the scale once it arrives and updates after changes", async () => {
      GradeBookStore.gradeScale = [];
      const el = await fixture(
        html`<letter-grade-picker></letter-grade-picker>`,
      );
      expect(el.shadowRoot.querySelectorAll("button").length).to.equal(0);
      GradeBookStore.gradeScale = JSON.parse(JSON.stringify(gradeScale));
      await el.updateComplete;
      expect(el.shadowRoot.querySelectorAll("button").length).to.equal(5);
      GradeBookStore.gradeScale = [
        { letter: "P", highRange: 100, lowRange: 0 },
      ];
      await el.updateComplete;
      expect(el.shadowRoot.querySelectorAll("button").length).to.equal(1);
      // disconnected pickers stop listening
      el.remove();
      expect(el.__disposer).to.equal(null);
    });
  });

  describe("roster grid", () => {
    it("has a caption, scoped headers and a grid role", async () => {
      const el = await loadJson();
      const grid = el.shadowRoot.querySelector("#studentgrid");
      expect(grid.getAttribute("role")).to.equal("grid");
      expect(grid.classList.contains("ddd-table")).to.equal(true);
      expect(grid.querySelector("caption").textContent).to.include(
        "2 students · 2 assignments",
      );
      expect(grid.querySelectorAll("thead th[scope='col']").length).to.equal(3);
      expect(grid.querySelectorAll("tbody th[scope='row']").length).to.equal(2);
      // existing header label is unchanged
      expect(
        grid
          .querySelector(".student-table-label")
          .textContent.replace(/\s+/g, " ")
          .trim(),
      ).to.equal("Student (1 / 2)");
    });
    it("is one tab stop with aria-current on the active cell only", async () => {
      const el = await loadJson();
      const stops = el.shadowRoot.querySelectorAll(
        "#studentgrid button[tabindex='0']",
      );
      expect(stops.length).to.equal(1);
      expect(stops[0]).to.equal(cell(el, 0, 0));
      expect(
        el.shadowRoot.querySelectorAll("#studentgrid [aria-current='true']")
          .length,
      ).to.equal(1);
      expect(cell(el, 0, 0).getAttribute("aria-current")).to.equal("true");
      // email links are not extra tab stops
      expect(
        el.shadowRoot.querySelector("#studentgrid a").getAttribute("tabindex"),
      ).to.equal("-1");
    });
    it("arrow keys, Home / End and Ctrl+Home / End move the tab stop and focus", async () => {
      const el = await loadJson();
      cell(el, 0, 0).focus();
      key(cell(el, 0, 0), "ArrowRight");
      await flush();
      expect(cell(el, 0, 1).getAttribute("tabindex")).to.equal("0");
      expect(cell(el, 0, 0).getAttribute("tabindex")).to.equal("-1");
      expect(deep()).to.equal(cell(el, 0, 1));
      // moving does not change the active cell
      expect(GradeBookStore.activeAssignment).to.equal(0);
      key(cell(el, 0, 1), "ArrowRight");
      await flush();
      expect(deep()).to.equal(cell(el, 0, 1));
      key(cell(el, 0, 1), "ArrowDown");
      await flush();
      expect(deep()).to.equal(cell(el, 1, 1));
      key(cell(el, 1, 1), "Home");
      await flush();
      expect(deep()).to.equal(cell(el, 1, 0));
      key(cell(el, 1, 0), "End");
      await flush();
      expect(deep()).to.equal(cell(el, 1, 1));
      key(cell(el, 1, 1), "Home", { ctrlKey: true });
      await flush();
      expect(deep()).to.equal(cell(el, 0, 0));
      key(cell(el, 0, 0), "End", { ctrlKey: true });
      await flush();
      expect(deep()).to.equal(cell(el, 1, 1));
      key(cell(el, 1, 1), "ArrowUp");
      await flush();
      expect(deep()).to.equal(cell(el, 0, 1));
      expect(
        el.shadowRoot.querySelectorAll("#studentgrid button[tabindex='0']")
          .length,
      ).to.equal(1);
    });
    it("Enter activates the focused cell like a click", async () => {
      const el = await loadJson();
      cell(el, 0, 0).focus();
      key(cell(el, 0, 0), "ArrowDown");
      await flush();
      expect(deep()).to.equal(cell(el, 1, 0));
      await sendKeys({ press: "Enter" });
      await flush(100);
      await el.updateComplete;
      expect(GradeBookStore.activeStudent).to.equal(1);
      expect(GradeBookStore.activeAssignment).to.equal(0);
      expect(cell(el, 1, 0).getAttribute("aria-current")).to.equal("true");
      expect(cell(el, 0, 0).hasAttribute("aria-current")).to.equal(false);
      expect(
        el.shadowRoot.querySelector("#studentgrid td[data-active] button"),
      ).to.equal(cell(el, 1, 0));
    });
    it("a click on the score inside a cell still activates it", async () => {
      const el = await loadJson();
      cell(el, 1, 0).querySelector(".gb-score").click();
      await flush();
      expect(GradeBookStore.activeStudent).to.equal(1);
    });
    it("announces the new selection in a polite live region", async () => {
      const el = await loadJson();
      const region = el.shadowRoot.querySelector("#gbannounce");
      expect(region.getAttribute("aria-live")).to.equal("polite");
      expect(region.textContent).to.equal("");
      GradeBookStore.activeStudent = 1;
      await flush();
      await el.updateComplete;
      expect(region.textContent).to.equal("Bob, a1, 5 of 10, F");
      GradeBookStore.activeStudent = 0;
      GradeBookStore.activeAssignment = 1;
      await flush();
      await el.updateComplete;
      expect(region.textContent).to.equal("Alice, a2, Not graded");
    });
  });

  describe("axe", () => {
    it("the loaded toolbar and roster grid pass axe", async () => {
      const el = await loadJson();
      await expect(el.shadowRoot.querySelector(".gb-frame")).to.be.accessible();
    });
  });

  describe("toolbar", () => {
    it("keeps ids and labels and marks popover buttons with aria-expanded", async () => {
      const el = await loadJson();
      const bar = el.shadowRoot.querySelector(".top-controls");
      const text = bar.textContent.replace(/\s+/g, " ");
      [
        "Active student",
        "Previous",
        "Next",
        "Active assignment",
        "Grading scale",
        "Settings",
      ].forEach((label) => expect(text).to.include(label));
      expect(bar.querySelector("slot[name='app-name']")).to.exist;
      expect(text).to.include("Student 1 / 2 · Alice");
      const scale = el.shadowRoot.querySelector("#gradescalebtn");
      expect(scale.getAttribute("aria-expanded")).to.equal("false");
      scale.click();
      await el.updateComplete;
      expect(scale.getAttribute("aria-expanded")).to.equal("true");
      [
        "#activestudentbtn",
        "#activeassignmentbtn",
        "#gradescalebtn",
        "#settings",
      ].forEach((id) => expect(el.shadowRoot.querySelector(id)).to.exist);
    });
    it("a click on the icon inside previous / next still navigates", async () => {
      const el = await loadJson();
      el.shadowRoot
        .querySelector(
          "button[data-nav='student'][value='next'] simple-icon-lite",
        )
        .click();
      await flush();
      expect(GradeBookStore.activeStudent).to.equal(1);
    });
    it("shows Save as the one filled action for a file system gradebook", async () => {
      const el = await loadJson();
      expect(el.shadowRoot.querySelector("#savegradebook")).to.equal(null);
      el.source = "filesystem";
      await el.updateComplete;
      const save = el.shadowRoot.querySelector("#savegradebook");
      expect(save.classList.contains("gb-primary")).to.equal(true);
      expect(save.textContent).to.include("Save gradebook");
    });
    it("associates the source picker label with its select", async () => {
      const el = await fixture(html`<grade-book></grade-book>`);
      const label = el.shadowRoot.querySelector(".source-selection label");
      expect(label.getAttribute("for")).to.equal("source");
      expect(
        el.shadowRoot.querySelector("#sourcedata").getAttribute("aria-label"),
      ).to.equal("Source data");
    });
  });

  describe("tag categories", () => {
    it("pickColor follows the DDD chart series order and wraps", async () => {
      const el = await loadJson();
      expect(el.pickColor(0)).to.equal(GradeBookTagColors[0]);
      expect(el.pickColor(8)).to.equal(GradeBookTagColors[0]);
      expect(el.pickChartColor(1)).to.equal("var(--ddd-chart-2)");
    });
    it("category headings show a dot next to the name", async () => {
      const el = await loadJson();
      const heading = el.shadowRoot.querySelector(
        "a11y-collapse div[slot='heading']",
      );
      expect(heading.querySelector(".gb-cat-dot")).to.exist;
      expect(heading.textContent.trim()).to.equal("design");
    });
  });

  describe("grade-book-lite parity", () => {
    it("shares the toolbar, live region, score area and fixes", async () => {
      GradeBookStore.gradeScale = [];
      const el = await loadJson("lite");
      expect(GradeBookStore.gradeScale.length).to.equal(5);
      expect(el.shadowRoot.querySelector(".top-controls .ddd-block-header")).to
        .exist;
      expect(el.shadowRoot.querySelector("#activeassignmentbtn")).to.exist;
      expect(el.shadowRoot.querySelector("#gradescalebtn")).to.exist;
      expect(el.shadowRoot.querySelector("#gbannounce")).to.exist;
      expect(el.shadowRoot.querySelector(".gb-lock")).to.exist;
      expect(el.getStudentSubmissions(1)[0].studentScore).to.equal(5);
      expect(el.pickColor(0)).to.equal(GradeBookTagColors[0]);
      // lite never had student navigation, settings or a roster grid
      expect(el.shadowRoot.querySelector("#activestudentbtn")).to.equal(null);
      expect(el.shadowRoot.querySelector("#settings")).to.equal(null);
      expect(el.shadowRoot.querySelector("#studentgrid")).to.equal(null);
      GradeBookStore.activeAssignment = 1;
      await flush();
      await el.updateComplete;
      expect(el.shadowRoot.querySelector("#gbannounce").textContent).to.equal(
        "Alice, a2, Not graded",
      );
    });
  });

  describe("front end API is unchanged", () => {
    const attrs = (cls) => {
      const out = {};
      cls.elementProperties.forEach((opts, name) => {
        // Lit: no attribute option means the lowercased property name
        out[name] =
          opts.attribute === undefined || opts.attribute === true
            ? name.toLowerCase()
            : opts.attribute;
      });
      return out;
    };
    it("grade-book attributes", () => {
      const a = attrs(GradeBook);
      expect(a.source).to.equal("source");
      expect(a.sourceData).to.equal("source-data");
      expect(a.activeStudent).to.equal("active-student");
      expect(a.activeAssignment).to.equal("active-assignment");
      expect(a.forCourse).to.equal("for-course");
      expect(a.accentColor).to.equal("accent-color");
      expect(a.dark).to.equal("dark");
    });
    it("grade-book-lite attributes", () => {
      const a = attrs(GradeBookLite);
      expect(a.source).to.equal("source");
      expect(a.sourceData).to.equal("source-data");
      expect(a.activeStudent).to.equal("active-student");
      expect(a.activeAssignment).to.equal("active-assignment");
      expect(a.accentColor).to.equal("accent-color");
      expect(a.dark).to.equal("dark");
    });
    it("accent-color and dark still apply", async () => {
      const el = await fixture(
        html`<grade-book accent-color="green" dark></grade-book>`,
      );
      expect(getComputedStyle(el).colorScheme).to.equal("dark");
      expect(
        getComputedStyle(el).getPropertyValue("--ddd-accent-color").trim(),
      ).to.not.equal("");
    });
  });
});
