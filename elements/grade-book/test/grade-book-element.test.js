import { fixture, expect, html } from "@open-wc/testing";
import "../grade-book.js";
import { GradeBook } from "../grade-book.js";
import { GradeBookStore } from "../lib/grade-book-store.js";
import { ESGlobalBridgeStore } from "@haxtheweb/es-global-bridge/es-global-bridge.js";
import { XLSXFileSystemBrokerSingleton } from "@haxtheweb/file-system-broker/lib/xlsx-file-system-broker.js";
import {
  makeDatabase,
  gradeScale,
  rawTables,
  csvTables,
  sheetGids,
  fakeWindowFactory,
  flush,
} from "./fixtures.js";

// Teardown invariant: the store is ALWAYS left holding a valid, fully
// populated database with activeStudent/activeAssignment back at 0.
// Elements from the finished test can still have pending autoruns and
// setTimeout renders queued; if the store were left empty (or with a stale
// active index) those stragglers crash mid-render. Keeping a valid database
// at teardown means stragglers re-render safely instead of throwing.

// small helper events / fake objects (no real event needed for most methods)
const noOpEvent = () => ({
  stopPropagation() {},
  stopImmediatePropagation() {},
  preventDefault() {},
});

describe("grade-book element", () => {
  let originalFetch;
  let originalOpen;
  let fakeWindow;
  let makeFakeWindow;
  let originalJsPdfImport;
  let jsPdfCalls;
  let brokerStubs;
  let brokerCalls;

  beforeEach(() => {
    // deterministic store state for every test in this file
    GradeBookStore.database = makeDatabase();
    GradeBookStore.gradeScale = JSON.parse(JSON.stringify(gradeScale));
    GradeBookStore.activeStudent = 0;
    GradeBookStore.activeAssignment = 0;
    originalFetch = globalThis.fetch;
    originalOpen = globalThis.open;
    makeFakeWindow = fakeWindowFactory();
    fakeWindow = makeFakeWindow();
    globalThis.open = () => fakeWindow;
    originalJsPdfImport = ESGlobalBridgeStore.import;
    jsPdfCalls = { imports: 0, constructed: 0, fromHtml: 0, saved: [] };
    ESGlobalBridgeStore.import = () => {
      jsPdfCalls.imports++;
      return Promise.resolve(true);
    };
    globalThis.jsPDF = function () {
      jsPdfCalls.constructed++;
      this.fromHTML = () => {
        jsPdfCalls.fromHtml++;
      };
      this.save = (fname) => {
        jsPdfCalls.saved.push(fname);
      };
    };
    brokerCalls = { saved: [], processed: [], loaded: 0, workbooks: [] };
    brokerStubs = {
      workbookFromJSON: XLSXFileSystemBrokerSingleton.workbookFromJSON,
      saveFile: XLSXFileSystemBrokerSingleton.saveFile,
      loadFile: XLSXFileSystemBrokerSingleton.loadFile,
      processFile: XLSXFileSystemBrokerSingleton.processFile,
    };
    XLSXFileSystemBrokerSingleton.workbookFromJSON = (db) => {
      brokerCalls.workbooks.push(db);
      return "fake-xlsx-bytes";
    };
    XLSXFileSystemBrokerSingleton.saveFile = (format, output) => {
      brokerCalls.saved.push([format, output]);
      return Promise.resolve(true);
    };
    XLSXFileSystemBrokerSingleton.loadFile = (ext) => {
      brokerCalls.loaded++;
      return Promise.resolve({ name: "book.xls" });
    };
    XLSXFileSystemBrokerSingleton.processFile = (file, format) => {
      brokerCalls.processed.push([file, format]);
    };
  });

  afterEach(() => {
    // reset indexes and re-seed a valid database FIRST so any straggler
    // render queued by the finished test paints against safe data
    GradeBookStore.activeStudent = 0;
    GradeBookStore.activeAssignment = 0;
    GradeBookStore.database = makeDatabase();
    globalThis.fetch = originalFetch;
    globalThis.open = originalOpen;
    ESGlobalBridgeStore.import = originalJsPdfImport;
    delete globalThis.jsPDF;
    XLSXFileSystemBrokerSingleton.workbookFromJSON =
      brokerStubs.workbookFromJSON;
    XLSXFileSystemBrokerSingleton.saveFile = brokerStubs.saveFile;
    XLSXFileSystemBrokerSingleton.loadFile = brokerStubs.loadFile;
    XLSXFileSystemBrokerSingleton.processFile = brokerStubs.processFile;
  });

  // loads a grade-book via the JSON source branch and waits for autoruns
  async function loadJsonBook() {
    const el = await fixture(html`<grade-book></grade-book>`);
    el.source = "json";
    el.sourceData = JSON.stringify(makeDatabase());
    await el.updateComplete;
    await flush();
    await el.updateComplete;
    return el;
  }

  describe("statics and defaults", () => {
    it("has expected tag and haxProperties", () => {
      expect(GradeBook.tag).to.equal("grade-book");
      expect(GradeBook.haxProperties.gizmo.title).to.equal("Grade Book");
      expect(GradeBook.haxProperties.settings.configure.length).to.equal(3);
    });
    it("defaults sensible state", async () => {
      const el = await fixture(html`<grade-book></grade-book>`);
      // headless chromium exposes showOpenFilePicker so the source defaults
      // to filesystem there and googledocs everywhere else
      expect(["googledocs", "filesystem"].indexOf(el.source)).to.not.equal(-1);
      expect(el.ready).to.equal(false);
      expect(el.loading).to.equal(false);
      expect(el.displayMode).to.equal(0);
      expect(el.scoreLock).to.equal(true);
      expect(el.totalScore).to.equal(0);
      expect(el.forCourse).to.equal("");
      // the checkbox fields inside the settings popover can fire their own
      // value-changed events which normalize the boolean to a string
      expect(String(el.settings.photo)).to.equal("true");
      expect(el.resetAssessmentView().qualitative.length).to.equal(0);
      expect(el.resetAssessmentView().written.length).to.equal(0);
    });
  });

  describe("json source import", () => {
    it("loads database, flips ready, and mirrors gradeScale into the store", async () => {
      const el = await loadJsonBook();
      expect(el.ready).to.equal(true);
      expect(el.loading).to.equal(false);
      expect(el.database.roster.length).to.equal(2);
      expect(el.database.assignments.length).to.equal(2);
      expect(GradeBookStore.gradeScale.length).to.equal(5);
      expect(GradeBookStore.gradeScale[0].letter).to.equal("A");
      // renders the student grid with a data-active cell for student 0 / assignment 0
      expect(el.shadowRoot.querySelector("#studentgrid")).to.exist;
      expect(
        el.shadowRoot.querySelectorAll("#studentgrid td[data-active]").length,
      ).to.equal(1);
    });
    it("renders OER schema markup with forCourse", async () => {
      const el = await loadJsonBook();
      el.forCourse = "ART-100";
      await el.updateComplete;
      await flush();
      const schemaHtml = el.shadowRoot.querySelector(
        ".oer-assessment-schema",
      ).innerHTML;
      expect(schemaHtml.includes("oer:Assessment")).to.equal(true);
      expect(schemaHtml.includes("oer:forCourse")).to.equal(true);
      expect(schemaHtml.includes("ART-100")).to.equal(true);
      expect(
        el.shadowRoot.querySelectorAll(
          ".oer-assessment-schema span[typeof='oer:Assessment']",
        ).length,
      ).to.equal(2);
    });
    it("renders submission views: video, iframe, and markdown", async () => {
      const el = await loadJsonBook();
      // Alice / a1 is a youtube URL -> video-player branch
      expect(el.shadowRoot.innerHTML.includes("video-player")).to.equal(true);
      // Bob / a1 is a plain URL -> iframe branch
      GradeBookStore.activeStudent = 1;
      await el.updateComplete;
      await flush();
      expect(el.activeStudent).to.equal(1);
      expect(
        el.shadowRoot.querySelectorAll(".active-submission iframe").length,
      ).to.equal(1);
      // Alice / a2 is plain text -> md-block branch
      GradeBookStore.activeStudent = 0;
      GradeBookStore.activeAssignment = 1;
      await el.updateComplete;
      await flush();
      expect(el.shadowRoot.innerHTML.includes("md-block")).to.equal(true);
    });
  });

  describe("data helpers", () => {
    it("getAssignmentByShortName finds, sets index, and misses cleanly", async () => {
      const el = await loadJsonBook();
      const a = el.getAssignmentByShortName("a1");
      expect(a.name).to.equal("Assignment 1");
      expect(a.index).to.equal(0);
      expect(el.getAssignmentByShortName("nope")).to.equal(null);
    });
    it("getCurrentScore returns stored score or 0", async () => {
      const el = await loadJsonBook();
      expect(el.getCurrentScore(0, 0)).to.equal(9);
      expect(el.getCurrentScore(1, 0)).to.equal(5);
      expect(el.getCurrentScore(0, 1)).to.equal(0);
    });
    it("getActiveRubric filters by active assignment rubric", async () => {
      const el = await loadJsonBook();
      expect(el.getActiveRubric().length).to.equal(1);
      expect(el.getActiveRubric()[0].criteria).to.equal("design");
      GradeBookStore.activeAssignment = 1;
      await flush();
      expect(el.getActiveRubric()[0].criteria).to.equal("writing");
    });
    it("getStudentSubmissions maps scores, missing grades and empty strings to null", async () => {
      const el = await loadJsonBook();
      const subs = el.getStudentSubmissions(0);
      expect(subs.length).to.equal(2);
      expect(subs[0].studentScore).to.equal(9);
      expect(subs[0].assignmentPoints).to.equal(10);
      // grades[0].a2 == "" so a null score is expected
      expect(subs[1].studentScore).to.equal(null);
      // student with no matching submission row gets an empty list
      const fresh = await fixture(html`<grade-book></grade-book>`);
      fresh.database = {
        ...makeDatabase(),
        submissions: [{ student: "Nobody" }],
      };
      expect(fresh.getStudentSubmissions(0).length).to.equal(0);
    });
    it("transformTable converts array-of-arrays into objects keyed on headings", async () => {
      const el = await loadJsonBook();
      const out = el.transformTable([
        ["h1", "h2"],
        ["v1", "v2"],
      ]);
      expect(out.length).to.equal(1);
      expect(out[0].h1).to.equal("v1");
      expect(out[0].h2).to.equal("v2");
    });
    it("processassignmentsData sets _ISODueDate, skips empty and survives invalid dates", async () => {
      const el = await loadJsonBook();
      const data = [
        { dueDate: "2026-09-01", dueTime: "12:00" },
        { dueDate: "", dueTime: "12:00" },
        { dueDate: "not-a-date", dueTime: "99:99" },
      ];
      const out = el.processassignmentsData(data);
      expect(out[0]._ISODueDate).to.equal(
        new Date("2026-09-01 12:00").toISOString(),
      );
      expect(out[1]._ISODueDate).to.equal(undefined);
      expect(out[2]._ISODueDate).to.equal(undefined);
    });
    it("processtagsData splits categories/materials and dedupes categories", async () => {
      const el = await loadJsonBook();
      const out = el.processtagsData([
        {
          term: "a",
          category: "design,writing",
          associatedMaterial: "https://x.example",
        },
        { term: "b", category: "design" },
        { term: "c" },
      ]);
      expect(out.categories.length).to.equal(2);
      expect(out.categories.includes("design")).to.equal(true);
      expect(out.data[0].category).to.eql(["design", "writing"]);
      expect(out.data[0].associatedMaterial).to.eql(["https://x.example"]);
      expect(out.data[2].category).to.eql([]);
    });
    it("processrubricsData splits qualitative lists", async () => {
      const el = await loadJsonBook();
      const out = el.processrubricsData([
        { qualitative: "good,bad" },
        {},
      ]);
      expect(out[0].qualitative).to.eql(["good", "bad"]);
      expect(out[1].qualitative).to.eql([]);
    });
    it("processrosterData splits interests", async () => {
      const el = await loadJsonBook();
      const out = el.processrosterData([{ interests: "art,code" }, {}]);
      expect(out[0].interests).to.eql(["art", "code"]);
      expect(out[1].interests).to.eql([]);
    });
    it("processsettingsData keys on key/value pairs", async () => {
      const el = await loadJsonBook();
      const out = el.processsettingsData([
        { key: "photo", value: "true" },
        { key: "fname", value: "false" },
      ]);
      expect(out.photo).to.equal("true");
      expect(out.fname).to.equal("false");
    });
  });

  describe("student / assignment navigation", () => {
    it("changeStudent prev/next respect roster bounds", async () => {
      const el = await loadJsonBook();
      const prev = el.shadowRoot.querySelector(
        "simple-icon-button-lite[icon='arrow-upward']",
      );
      const next = el.shadowRoot.querySelector(
        "simple-icon-button-lite[icon='arrow-downward']",
      );
      // at student 0 prev is a no-op
      prev.click();
      await flush();
      expect(GradeBookStore.activeStudent).to.equal(0);
      next.click();
      await flush();
      expect(GradeBookStore.activeStudent).to.equal(1);
      expect(el.activeStudent).to.equal(1);
      // at the end of the roster next is a no-op
      next.click();
      await flush();
      expect(GradeBookStore.activeStudent).to.equal(1);
      prev.click();
      await flush();
      expect(GradeBookStore.activeStudent).to.equal(0);
    });
    it("changeAssignment prev/next respect assignment bounds", async () => {
      const el = await loadJsonBook();
      const prev = el.shadowRoot.querySelector(
        "simple-icon-button-lite[icon='arrow-back']",
      );
      const next = el.shadowRoot.querySelector(
        "simple-icon-button-lite[icon='arrow-forward']",
      );
      prev.click();
      await flush();
      expect(GradeBookStore.activeAssignment).to.equal(0);
      next.click();
      await flush();
      expect(GradeBookStore.activeAssignment).to.equal(1);
      next.click();
      await flush();
      expect(GradeBookStore.activeAssignment).to.equal(1);
      prev.click();
      await flush();
      expect(GradeBookStore.activeAssignment).to.equal(0);
    });
    it("activateOption sets student+assignment from data attributes and collapses the grid", async () => {
      const el = await loadJsonBook();
      const button = el.shadowRoot.querySelector(
        "#studentgrid td[data-student='1'][data-assignment='1'] button",
      );
      button.click();
      await flush();
      expect(GradeBookStore.activeStudent).to.equal(1);
      expect(GradeBookStore.activeAssignment).to.equal(1);
      expect(el.shadowRoot.querySelector("#studentgrid").style.height).to.equal(
        "140px",
      );
    });
    it("studentLetterGradeHistoryClick jumps to the assignment index", async () => {
      const el = await loadJsonBook();
      el.studentLetterGradeHistoryClick({ target: { value: "1" } });
      await flush();
      expect(GradeBookStore.activeAssignment).to.equal(1);
    });
  });

  describe("grid interactions", () => {
    it("mouseHighlight and mouseLeave toggle col-highlight", async () => {
      const el = await loadJsonBook();
      const td = el.shadowRoot.querySelector(
        "#studentgrid td[data-assignment='0']",
      );
      td.dispatchEvent(
        new MouseEvent("mousemove", { bubbles: true, composed: true }),
      );
      await flush(40);
      expect(
        el.shadowRoot.querySelectorAll(
          "#studentgrid .th-or-td[data-assignment='0'].col-highlight",
        ).length,
      ).to.be.above(0);
      el.shadowRoot
        .querySelector("#studentgrid")
        .dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
      await flush(150);
      expect(
        el.shadowRoot.querySelectorAll("#studentgrid .col-highlight").length,
      ).to.equal(0);
    });
    it("handleGridScaling toggles the table height on dblclick", async () => {
      const el = await loadJsonBook();
      const table = el.shadowRoot.querySelector("#studentgrid");
      table.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      expect(table.style.height).to.equal("90vh");
      table.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      expect(table.style.height).to.equal("");
    });
    it("renders the surname column from the roster surname field (was BUG: copy-paste)", async () => {
      // regression: the fname and surname columns both rendered s.student;
      // the surname column now renders the roster surname field
      const el = await loadJsonBook();
      el.database.roster[0].surname = "Alvarez";
      // direct nested mutation needs an explicit repaint
      el.requestUpdate();
      await el.updateComplete;
      const cols = el.shadowRoot
        .querySelector("#studentgrid tbody tr .user-right")
        .querySelectorAll("div");
      // fname column falls back to the student name; surname shows surname
      expect(cols[0].textContent.trim()).to.equal("Alice");
      expect(cols[1].textContent.trim()).to.equal("Alvarez");
    });
    it("labels each grade cell button with student and assignment (a11y regression)", async () => {
      // regression: the cell aria-label used to read assignement (typo)
      const el = await loadJsonBook();
      const button = el.shadowRoot.querySelector(
        "#studentgrid tbody td[data-student='0'][data-assignment='0'] button",
      );
      expect(button.getAttribute("aria-label")).to.equal(
        "Alice's assignment Assignment 1",
      );
    });
    it("maintainScrollPosition runs without error once a data-active cell exists", async () => {
      const el = await loadJsonBook();
      el.maintainScrollPosition();
      await flush(40);
      expect(el.shadowRoot.querySelector("#studentgrid").scrollTop).to.equal(0);
    });
    it("checkTabHeight runs without error", async () => {
      const el = await loadJsonBook();
      el.checkTabHeight();
      expect(typeof el.totalScore).to.equal("number");
    });
  });

  describe("settings popover and popovers", () => {
    it("toggleActiveStudentOverview opens its popover and closes the others", async () => {
      const el = await loadJsonBook();
      el.shadowRoot.querySelector("#activestudentbtn").click();
      expect(el.hideActiveStudentOverview).to.equal(false);
      expect(el.hideSettings).to.equal(true);
      expect(el.hideGradeScale).to.equal(true);
      expect(el.hideActiveAssignment).to.equal(true);
      // the popover shows the student block with the active student
      expect(
        el.shadowRoot.querySelector("simple-popover grade-book-student-block"),
      ).to.exist;
      el.shadowRoot.querySelector("#activestudentbtn").click();
      expect(el.hideActiveStudentOverview).to.equal(true);
    });
    it("toggleGradeScale opens its popover and closes others", async () => {
      const el = await loadJsonBook();
      el.shadowRoot.querySelector("#gradescalebtn").click();
      expect(el.hideGradeScale).to.equal(false);
      expect(el.hideSettings).to.equal(true);
      el.shadowRoot.querySelector("#gradescalebtn").click();
      expect(el.hideGradeScale).to.equal(true);
    });
    it("toggleSettings opens its popover and closes others", async () => {
      const el = await loadJsonBook();
      el.shadowRoot.querySelector("simple-icon-button-lite[icon='settings']")
        .click();
      expect(el.hideSettings).to.equal(false);
      expect(el.hideGradeScale).to.equal(true);
      expect(el.hideActiveStudentOverview).to.equal(true);
      el.shadowRoot.querySelector("simple-icon-button-lite[icon='settings']")
        .click();
      expect(el.hideSettings).to.equal(true);
    });
    it("toggleActiveAssignment opens its popover and closes others", async () => {
      const el = await loadJsonBook();
      el.shadowRoot.querySelector("#activeassignmentbtn").click();
      expect(el.hideActiveAssignment).to.equal(false);
      expect(el.hideSettings).to.equal(true);
      el.shadowRoot.querySelector("#activeassignmentbtn").click();
      expect(el.hideActiveAssignment).to.equal(true);
    });
    it("settingChanged updates the settings map", async () => {
      const el = await loadJsonBook();
      el.settingChanged({
        ...noOpEvent(),
        detail: { name: "photo", value: false },
      });
      // assert immediately: the real checkbox fields inside the settings
      // popover also fire their own value-changed (string-normalized) events
      // asynchronously, which can overwrite the boolean after a yield
      expect(el.settings.photo).to.equal(false);
      await flush(100);
      // once the popover fields settle the intent is unchanged, though the
      // field may have normalized the value to a string
      expect(String(el.settings.photo)).to.equal("false");
      el.settingChanged({
        ...noOpEvent(),
        detail: { name: "photo", value: true },
      });
      expect(el.settings.photo).to.equal(true);
    });
    it("toggleRubricInfo flips the per-rubric visibility flag", async () => {
      const el = await loadJsonBook();
      expect(el.hideRubricInfo[0]).to.equal(false);
      el.shadowRoot.querySelector("#rubricinfo0").click();
      expect(el.hideRubricInfo[0]).to.equal(true);
      el.shadowRoot.querySelector("#rubricinfo0").click();
      expect(el.hideRubricInfo[0]).to.equal(false);
    });
    it("displayMode buttons switch layout and mode 2 opens a window", async () => {
      const el = await loadJsonBook();
      expect(el.displayModeData().length).to.equal(3);
      const mode1 = el.shadowRoot.querySelector(
        ".tag-group simple-icon-button-lite[data-id='1']",
      );
      mode1.click();
      expect(el.displayMode).to.equal(1);
      const mode2 = el.shadowRoot.querySelector(
        ".tag-group simple-icon-button-lite[data-id='2']",
      );
      mode2.click();
      expect(el.displayMode).to.equal(2);
      await flush();
      // openWindow was stubbed to a fake window and grade-book-pop-up got rendered into it
      expect(fakeWindow.document.body.innerHTML.includes("grade-book-pop-up"))
        .to.equal(true);
      // a second openWindow call focuses the existing window
      el.openWindow();
      expect(fakeWindow.focusCount).to.equal(1);
    });
  });

  describe("scoring and feedback", () => {
    it("toggleLock flips the score lock", async () => {
      const el = await loadJsonBook();
      expect(el.scoreLock).to.equal(true);
      el.toggleLock();
      expect(el.scoreLock).to.equal(false);
      el.toggleLock();
      expect(el.scoreLock).to.equal(true);
    });
    it("totalScoreChangedEvent writes the score into the grades database", async () => {
      const el = await loadJsonBook();
      el.totalScoreChangedEvent({
        ...noOpEvent(),
        detail: { value: 8 },
      });
      await el.updateComplete;
      expect(el.totalScore).to.equal(8);
      expect(el.database.grades[0].a1).to.equal(8);
      expect(el.activeStudentSubmissions.length).to.equal(2);
    });
    it("qualitativeFeedbackUpdate groups tags by criteria then label", async () => {
      const el = await loadJsonBook();
      const field = globalThis.document.createElement("div");
      field.setAttribute("data-criteria", "design");
      field.label = "good";
      field.tagList = [{ term: "kerning", description: "spacing" }];
      el.dispatchEvent(
        new CustomEvent("simple-fields-tag-list-changed", {
          detail: field,
          bubbles: true,
        }),
      );
      await el.updateComplete;
      expect(el.activeGrading.design.good[0].term).to.equal("kerning");
      // and the student report renders the tag back out
      expect(el.shadowRoot.innerHTML.includes("kerning")).to.equal(true);
    });
    it("rubricCriteriaPointsChange recalculates the total and locks the score", async () => {
      const el = await loadJsonBook();
      el.scoreLock = false;
      const field = globalThis.document.createElement("input");
      field.setAttribute("data-rubric-score", "1");
      el.dispatchEvent(
        new CustomEvent("value-changed", { detail: field, bubbles: true }),
      );
      await flush(40);
      expect(el.scoreLock).to.equal(true);
      expect(el.shadowRoot.querySelector("#totalpts").value).to.equal(
        el.totalScore,
      );
    });
    it("updateTotalScore sums injected number fields and writes the total", async () => {
      const el = await loadJsonBook();
      const extra = globalThis.document.createElement("simple-fields-field");
      extra.setAttribute("type", "number");
      extra.value = 7;
      el.shadowRoot.querySelector("#assessment").appendChild(extra);
      const extra2 = globalThis.document.createElement("simple-fields-field");
      extra2.setAttribute("type", "number");
      extra2.value = 3;
      el.shadowRoot.querySelector("#assessment").appendChild(extra2);
      el.updateTotalScore();
      expect(el.totalScore).to.equal(10);
      expect(el.shadowRoot.querySelector("#totalpts").value).to.equal(10);
    });
    it("getCriteriaScore/getCriteriaFeedback fall back to 0 / empty string", async () => {
      const el = await loadJsonBook();
      expect(el.getCriteriaScore("nope")).to.equal(0);
      expect(el.getCriteriaFeedback("nope")).to.equal("");
      // for a rendered-but-uninitialized field the value can still be
      // undefined until the field itself settles
      expect(
        ["string", "undefined"].indexOf(typeof el.getCriteriaFeedback("design")),
      ).to.not.equal(-1);
    });
    it("updateStudentReport just requests an update", async () => {
      const el = await loadJsonBook();
      el.updateStudentReport();
      await el.updateComplete;
      expect(el.ready).to.equal(true);
    });
  });

  describe("drag and drop of tags", () => {
    it("drop events dispatch a global simple-tag-drop event", async () => {
      const el = await loadJsonBook();
      let got = null;
      const handler = (e) => {
        got = e.detail.value;
      };
      globalThis.addEventListener("simple-tag-drop", handler);
      el.dispatchEvent(new Event("drop", { bubbles: true }));
      await flush();
      globalThis.removeEventListener("simple-tag-drop", handler);
      expect(got).to.equal("drop");
    });
    it("setDragTransfer dispatches dragstart and sets transfer data with color", async () => {
      const el = await loadJsonBook();
      let dragEvt = null;
      const handler = (e) => {
        dragEvt = e;
      };
      globalThis.addEventListener("simple-tag-dragstart", handler);
      const tag = globalThis.document.createElement("div");
      tag.data = { term: "kerning" };
      tag.accentColor = "blue";
      const transfer = { payload: null };
      el.setDragTransfer({
        target: tag,
        dataTransfer: {
          setData: (type, value) => {
            transfer.payload = [type, value];
          },
        },
      });
      await flush();
      globalThis.removeEventListener("simple-tag-dragstart", handler);
      expect(dragEvt.detail.value).to.exist;
      expect(transfer.payload[0]).to.equal("text");
      expect(JSON.parse(transfer.payload[1]).color).to.equal("blue");
    });
    it("pickColor returns color names and wraps large indexes", async () => {
      const el = await loadJsonBook();
      expect(typeof el.pickColor(0)).to.equal("string");
      expect(typeof el.pickColor(500)).to.equal("string");
    });
  });

  describe("source selection UI", () => {
    it("selectSource reads the select value", async () => {
      const el = await loadJsonBook();
      // clear sourceData FIRST: leaving the json blob in place while flipping
      // the source to "url" would trigger the url-import branch against the
      // blob-as-url (a real 404 plus the unguarded non-ok path writes
      // undefined into GradeBookStore.database; see BUG notes)
      el.sourceData = null;
      await el.updateComplete;
      const select = el.shadowRoot.querySelector("#source");
      select.value = "url";
      el.selectSource();
      expect(el.source).to.equal("url");
    });
    it("loadFromSource json branch reads the textarea blob", async () => {
      const el = await loadJsonBook();
      el.sourceData = null;
      await el.updateComplete;
      const select = el.shadowRoot.querySelector("#source");
      select.value = "json";
      el.shadowRoot.querySelector("#sourcedatablob").value = JSON.stringify(
        makeDatabase(),
      );
      el.loadFromSource();
      await flush();
      expect(typeof el.sourceData).to.equal("string");
      expect(el.ready).to.equal(true);
    });
    it("loadFromSource url branch reads the url input and fetches", async () => {
      const el = await loadJsonBook();
      el.sourceData = null;
      await el.updateComplete;
      globalThis.fetch = () =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(makeDatabase()),
        });
      const select = el.shadowRoot.querySelector("#source");
      select.value = "url";
      el.shadowRoot.querySelector("#sourcedata").value =
        "https://example.com/gradebook.json";
      el.loadFromSource();
      await flush();
      expect(el.ready).to.equal(true);
      expect(el.loading).to.equal(false);
    });
    it("url source import warns on fetch failure without exploding", async () => {
      const el = await fixture(html`<grade-book></grade-book>`);
      globalThis.fetch = () => Promise.reject(new Error("offline"));
      el.source = "url";
      el.sourceData = "https://example.com/nope.json";
      await flush();
      expect(el.ready).to.equal(false);
      expect(el.loading).to.equal(true);
    });
    it("url source import leaves the store intact on a non-ok response (was BUG: undefined json write)", async () => {
      // regression: a non-ok fetch used to resolve json to undefined and
      // write it into GradeBookStore.database, silently corrupting the
      // whole store (every autorun / render downstream then throws)
      const el = await fixture(html`<grade-book></grade-book>`);
      const before = GradeBookStore.database;
      globalThis.fetch = () =>
        Promise.resolve({
          ok: false,
          status: 404,
          json: () => Promise.resolve({}),
        });
      el.source = "url";
      el.sourceData = "https://example.com/nope.json";
      await flush();
      // the store was NOT overwritten with undefined
      expect(GradeBookStore.database).to.equal(before);
      expect(el.ready).to.equal(false);
      expect(el.loading).to.equal(true);
    });
    it("loadFromSource googledocs branch reads the url input", async () => {
      const el = await loadJsonBook();
      el.sourceData = null;
      await el.updateComplete;
      const select = el.shadowRoot.querySelector("#source");
      select.value = "googledocs";
      el.shadowRoot.querySelector("#sourcedata").value = "2PACX-fake";
      el.loadFromSource();
      await flush();
      expect(el.sourceData).to.equal("2PACX-fake");
      expect(el.loading).to.equal(true);
    });
  });

  describe("googledocs import pipeline", () => {
    it("loads every sheet through gSheetInterface, transforms and processes it", async () => {
      const csvs = csvTables();
      const byGid = {};
      for (const key in sheetGids) {
        byGid[String(sheetGids[key])] = csvs[key];
      }
      globalThis.fetch = (url) => {
        const m = String(url).match(/gid=(\d+)/);
        const csv =
          m && byGid[m[1]] !== undefined ? byGid[m[1]] : "letter,high\nZ,1\n";
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(csv),
        });
      };
      const el = await fixture(html`<grade-book></grade-book>`);
      el.source = "googledocs";
      el.sourceData = "2PACX-fakesheet";
      await flush(250);
      await el.updateComplete;
      expect(el.ready).to.equal(true);
      expect(el.database.assignments.length).to.equal(3);
      expect(el.database.assignments[0].shortName).to.equal("a1");
      expect(el.database.assignments[0]._ISODueDate).to.equal(
        new Date("2026-09-01 12:00").toISOString(),
      );
      expect(el.database.roster[0].interests).to.eql(["art"]);
      expect(el.database.tags.categories.length).to.equal(2);
      expect(el.database.tags.data[0].associatedMaterial).to.eql([
        "https://example.com/k",
      ]);
      expect(el.database.rubrics[0].qualitative).to.eql(["good", "bad"]);
      expect(el.database.gradeScale[0].letter).to.equal("A");
      expect(GradeBookStore.gradeScale[0].letter).to.equal("A");
      expect(el.database.settings.photo).to.equal("true");
      expect(el.database.grades[0].a1).to.equal("9");
      expect(el.database.gradesDetails[0].a1).to.equal("neat work");
    });
  });

  describe("filesystem source", () => {
    it("registers the xlsx-file-system-data handler and imports raw table data", async () => {
      const el = await fixture(html`<grade-book></grade-book>`);
      el.source = "filesystem";
      await el.updateComplete;
      const raw = {};
      for (const key in rawTables) {
        raw[key] = JSON.parse(JSON.stringify(rawTables[key]));
      }
      globalThis.dispatchEvent(
        new CustomEvent("xlsx-file-system-data", {
          detail: { data: raw },
        }),
      );
      await flush(120);
      expect(el.ready).to.equal(true);
      expect(el.database.assignments.length).to.equal(3);
      expect(GradeBookStore.database.assignments.length).to.equal(3);
      // settings sheet got folded into a keyed object
      expect(el.database.settings.photo).to.equal("true");
    });
    it("loadFromExistingSource reprocesses the previous file", async () => {
      const el = await loadJsonBook();
      const prev = { name: "book.xls" };
      el.prevLocalFileReference = prev;
      const select = el.shadowRoot.querySelector("#source");
      select.value = "filesystem";
      el.loadFromExistingSource();
      await flush(60);
      expect(brokerCalls.processed.length).to.equal(1);
      expect(brokerCalls.processed[0][0]).to.equal(prev);
      expect(brokerCalls.processed[0][1]).to.equal("json");
      expect(el.sourceData).to.equal(prev);
      expect(el.loading).to.equal(true);
    });
    it("loadFromFilesystem saves the file reference and processes it", async () => {
      const el = await loadJsonBook();
      el.loadFromFilesystem();
      await flush(80);
      expect(brokerCalls.loaded).to.equal(1);
      expect(brokerCalls.processed.length).to.equal(1);
      expect(el.sourceData).to.eql({ name: "book.xls" });
    });
    it("saveToFilesystem builds a workbook and saves it as xlsx", async () => {
      const el = await loadJsonBook();
      await el.saveToFilesystem();
      expect(brokerCalls.workbooks.length).to.equal(1);
      expect(brokerCalls.saved[0][0]).to.equal("xlsx");
      expect(brokerCalls.saved[0][1]).to.equal("fake-xlsx-bytes");
    });
  });

  describe("PDF report", () => {
    it("studentreportClick imports jspdf via the ES bridge, renders and saves", async () => {
      const el = await loadJsonBook();
      el.studentreportClick();
      await flush(60);
      expect(jsPdfCalls.imports).to.equal(1);
      expect(jsPdfCalls.constructed).to.equal(1);
      expect(jsPdfCalls.fromHtml).to.equal(1);
      expect(jsPdfCalls.saved.length).to.equal(1);
      expect(jsPdfCalls.saved[0].indexOf("Alice--a1--")).to.equal(0);
      expect(jsPdfCalls.saved[0].endsWith(".pdf")).to.equal(true);
      // regression: the filename month used to be the 0-indexed getMonth()
      // value, so January saved as 0 and September as 8
      const now = new Date();
      const expectedPrefix =
        "Alice--a1--" +
        now.getFullYear() +
        "-" +
        (now.getMonth() + 1) +
        "-" +
        now.getDate() +
        "__";
      expect(jsPdfCalls.saved[0].indexOf(expectedPrefix)).to.equal(0);
    });
  });

  describe("submission window", () => {
    it("renderSubmissionInWindow renders grade-book-pop-up into the open window", async () => {
      const el = await loadJsonBook();
      el.__openWindow = fakeWindow;
      el.displayMode = 2;
      el.renderSubmissionInWindow();
      expect(fakeWindow.document.body.innerHTML.includes("grade-book-pop-up"))
        .to.equal(true);
      // CSSStyleDeclaration normalizes "0" to "0px"
      expect(fakeWindow.document.body.style.margin).to.equal("0px");
    });
    it("renderSubmissionInWindow shows no submission text when assignments are missing", async () => {
      const el = await loadJsonBook();
      const fresh = makeFakeWindow();
      el.__openWindow = fresh;
      // direct nested mutation does NOT schedule a re-render (a full property
      // reassignment would re-render the assessment tab first and crash on
      // the stale activeRubric against an empty assignments list)
      el.database.assignments = [];
      el.displayMode = 2;
      el.renderSubmissionInWindow();
      expect(fresh.document.body.innerHTML.includes("No submission found"))
        .to.equal(true);
    });
    it("openWindow replaces a closed window instead of focusing it", async () => {
      const el = await loadJsonBook();
      el.__openWindow = { closed: true };
      el.openWindow();
      // the stale window was never focused; a new one took its place
      expect(fakeWindow.focusCount).to.equal(0);
      expect(el.__openWindow.closed).to.equal(false);
      expect(el.__openWindow).to.equal(fakeWindow);
    });
  });

  describe("lifecycle", () => {
    it("disconnectedCallback cleans up observers and disposers", async () => {
      const el = await loadJsonBook();
      const disposerCount = el.__disposer.length;
      expect(disposerCount).to.be.above(0);
      expect(el.__resizeObserver).to.exist;
      el.remove();
      expect(el.__resizeObserver).to.equal(null);
      expect(el.__disposer.length).to.equal(0);
    });
  });
});
