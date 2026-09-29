import { fixture, expect, html } from "@open-wc/testing";
import "../lib/grade-book-lite.js";
import { GradeBookLite } from "../lib/grade-book-lite.js";
import { GradeBookStore } from "../lib/grade-book-store.js";
import { XLSXFileSystemBrokerSingleton } from "@haxtheweb/file-system-broker/lib/xlsx-file-system-broker.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import {
  makeDatabase,
  gradeScale,
  rawTables,
  csvTables,
  sheetGids,
  flush,
} from "./fixtures.js";

describe("grade-book-lite element", () => {
  let originalFetch;
  let originalOpen;
  let openUrls;
  let fetchUrls;
  let brokerStubs;
  let brokerCalls;

  beforeEach(() => {
    // deterministic store state for every test in this file
    GradeBookStore.database = makeDatabase();
    GradeBookStore.gradeScale = JSON.parse(JSON.stringify(gradeScale));
    GradeBookStore.activeStudent = 0;
    GradeBookStore.activeAssignment = 0;
    // BUG note: @core/htmlToPdf is NOT part of the core microservice bundle
    // (enableServices(["core"]) never registers it), so PDFPageButton never
    // renders its PDF button in production and downloadPDFviaMicro crashes
    // on the null call() response. Register it here so the PDF paths can be
    // exercised at all; see the dedicated BUG test below.
    if (!MicroFrontendRegistry.has("@core/htmlToPdf")) {
      MicroFrontendRegistry.add({
        name: "@core/htmlToPdf",
        endpoint: "/system/api/v1/actions/html-to-pdf",
        title: "HTML to PDF",
        params: { html: "HTML to convert to PDF" },
      });
    }
    originalFetch = globalThis.fetch;
    originalOpen = globalThis.open;
    openUrls = [];
    globalThis.open = (url) => {
      openUrls.push(String(url));
      return null;
    };
    fetchUrls = [];
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
    // leave a valid store so straggler renders of lite instances paint
    // against safe data instead of throwing
    GradeBookStore.activeStudent = 0;
    GradeBookStore.activeAssignment = 0;
    GradeBookStore.database = makeDatabase();
    globalThis.fetch = originalFetch;
    globalThis.open = originalOpen;
    XLSXFileSystemBrokerSingleton.workbookFromJSON =
      brokerStubs.workbookFromJSON;
    XLSXFileSystemBrokerSingleton.saveFile = brokerStubs.saveFile;
    XLSXFileSystemBrokerSingleton.loadFile = brokerStubs.loadFile;
    XLSXFileSystemBrokerSingleton.processFile = brokerStubs.processFile;
  });

  async function loadJsonLite() {
    const el = await fixture(html`<grade-book-lite></grade-book-lite>`);
    el.source = "json";
    el.sourceData = JSON.stringify(makeDatabase());
    await el.updateComplete;
    await flush();
    await el.updateComplete;
    return el;
  }

  it("has the expected tag and defaults", async () => {
    expect(GradeBookLite.tag).to.equal("grade-book-lite");
    const el = await fixture(html`<grade-book-lite></grade-book-lite>`);
    expect(el.where).to.equal("term");
    expect(el.like).to.equal("");
    expect(el.ready).to.equal(false);
    expect(el.displayMode).to.equal(0);
    expect(el.scoreLock).to.equal(true);
  });

  it("loads a json database and renders the assessment tabs", async () => {
    const el = await loadJsonLite();
    expect(el.ready).to.equal(true);
    expect(el.database.roster.length).to.equal(2);
    expect(el.shadowRoot.querySelector("#assessment")).to.exist;
    expect(el.shadowRoot.querySelector("#studentreporttab")).to.exist;
    // the tag data feeds the filter mixin items
    expect(el.items.length).to.equal(2);
  });

  it("filters the tag list via the like property", async () => {
    const el = await loadJsonLite();
    el.like = "kern";
    // SimpleFilterMixin debounces the filter computation by 250ms
    await flush(400);
    expect(el.filtered.length).to.equal(1);
    expect(el.filtered[0].term).to.equal("kerning");
    el.like = "";
    await flush(400);
    expect(el.filtered.length).to.equal(2);
  });

  it("inputfilterChanged applies the filter and expands all categories", async () => {
    const el = await loadJsonLite();
    el.inputfilterChanged({
      detail: { value: "tone" },
      target: { value: "tone" },
    });
    expect(el.like).to.equal("tone");
    await flush(400);
    expect(el.filtered.length).to.equal(1);
    expect(el.filtered[0].term).to.equal("tone");
    // an empty filter does not force expansion
    el.collapseAll();
    el.inputfilterChanged({
      detail: { value: "" },
      target: { value: "" },
    });
    expect(el.like).to.equal("");
  });

  it("expandAll and collapseAll flip every category collapse", async () => {
    const el = await loadJsonLite();
    const collapses = el.shadowRoot.querySelectorAll(
      "#categoriesgroup a11y-collapse",
    );
    expect(collapses.length).to.equal(2);
    el.collapseAll();
    expect(collapses[0].expanded).to.equal(false);
    el.expandAll();
    expect(collapses[0].expanded).to.equal(true);
    expect(collapses[1].expanded).to.equal(true);
    el.collapseAll();
    expect(collapses[0].expanded).to.equal(false);
  });

  it("renders the pdf and hash link buttons", async () => {
    const el = await loadJsonLite();
    expect(MicroFrontendRegistry.has("@core/htmlToPdf")).to.equal(true);
    expect(el.shadowRoot.querySelector("#pdf-page-btn")).to.exist;
    expect(el.shadowRoot.querySelector("#hash-page-btn")).to.exist;
  });

  it("downloadPDFviaMicro calls the htmlToPdf microservice and resets the loading flag", async () => {
    const el = await loadJsonLite();
    globalThis.fetch = (url, options) => {
      fetchUrls.push(String(url));
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 200, data: "JVBERi0xLjQK" }),
      });
    };
    await el.downloadPDFviaMicro();
    expect(fetchUrls.length).to.equal(1);
    expect(fetchUrls[0].indexOf("html-to-pdf")).to.not.equal(-1);
    expect(el.__pdfLoading).to.equal(false);
  });

  it("createHashLink calls the crypto microservice and opens the feedback url", async () => {
    const el = await loadJsonLite();
    globalThis.fetch = (url, options) => {
      fetchUrls.push(String(url));
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 200, data: "deadbeef" }),
      });
    };
    await el.createHashLink();
    expect(fetchUrls.length).to.equal(1);
    // @core/crypto is registered against the aes256 security endpoint
    expect(fetchUrls[0].indexOf("aes256")).to.not.equal(-1);
    expect(openUrls.length).to.equal(1);
    expect(openUrls[0].indexOf("secure-feedback.vercel.app")).to.not.equal(-1);
    expect(el.__hashLoading).to.equal(false);
  });

  it("downloadPDFviaMicro crashes when the service is not registered (BUG: unguarded null call)", async () => {
    // BUG grade-book-lite.js:1101 downloadPDFviaMicro does not guard the
    // null that MicroFrontendRegistry.call returns for an unregistered
    // service. @core/htmlToPdf is NOT in the core bundle, so calling the
    // method in the shipped default state reads response.status off null
    // and throws a TypeError
    const el = await loadJsonLite();
    globalThis.fetch = (url, options) => {
      fetchUrls.push(String(url));
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 200, data: "JVBERi0xLjQK" }),
      });
    };
    const bare = {};
    const savedList = MicroFrontendRegistry.list.slice();
    MicroFrontendRegistry.list = MicroFrontendRegistry.list.filter(
      (item) => item.name !== "@core/htmlToPdf",
    );
    let threw = false;
    try {
      await el.downloadPDFviaMicro();
    } catch (e) {
      threw = true;
    }
    MicroFrontendRegistry.list = savedList;
    bare.neverUsed = true;
    expect(threw).to.equal(true);
    expect(el.__pdfLoading).to.equal(true);
  });

  it("changeAssignment prev/next respect assignment bounds", async () => {
    const el = await loadJsonLite();
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

  it("studentLetterGradeHistoryClick jumps to the assignment index", async () => {
    const el = await loadJsonLite();
    el.studentLetterGradeHistoryClick({ target: { value: "1" } });
    await flush();
    expect(GradeBookStore.activeAssignment).to.equal(1);
  });

  it("activateOption reads student and assignment data attributes", async () => {
    const el = await loadJsonLite();
    const target = globalThis.document.createElement("div");
    target.setAttribute("data-student", "1");
    target.setAttribute("data-assignment", "1");
    el.activateOption({ composedPath: () => [target] });
    expect(GradeBookStore.activeStudent).to.equal(1);
    expect(GradeBookStore.activeAssignment).to.equal(1);
    // a target without the attributes is ignored
    const bare = globalThis.document.createElement("div");
    el.activateOption({ composedPath: () => [bare] });
    expect(GradeBookStore.activeStudent).to.equal(1);
  });

  it("handleGridScaling toggles a table height", async () => {
    const el = await loadJsonLite();
    const table = globalThis.document.createElement("table");
    el.handleGridScaling({ composedPath: () => [table] });
    expect(table.style.height).to.equal("90vh");
    el.handleGridScaling({ composedPath: () => [table] });
    expect(table.style.height).to.equal("");
    // non-table targets are ignored
    const div = globalThis.document.createElement("div");
    el.handleGridScaling({ composedPath: () => [div] });
    expect(div.style.height).to.equal("");
  });

  it("toggleLock flips the score lock and totalScoreChangedEvent writes grades", async () => {
    const el = await loadJsonLite();
    el.toggleLock();
    expect(el.scoreLock).to.equal(false);
    el.toggleLock();
    expect(el.scoreLock).to.equal(true);
    el.totalScoreChangedEvent({
      stopPropagation() {},
      stopImmediatePropagation() {},
      preventDefault() {},
      detail: { value: 12 },
    });
    await el.updateComplete;
    expect(el.totalScore).to.equal(12);
    expect(el.database.grades[0].a1).to.equal(12);
  });

  it("renders the student report view with criteria feedback", async () => {
    const el = await loadJsonLite();
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
    const report = el.shadowRoot.querySelector("#studentreport");
    expect(report.innerHTML.includes("kerning")).to.equal(true);
    expect(report.innerHTML.includes("Feedback report")).to.equal(true);
    expect(el.getCriteriaFeedback("nope")).to.equal("");
    expect(el.getCriteriaScore("nope")).to.equal(0);
  });

  it("source selection: selectSource and the json textarea branch", async () => {
    const el = await loadJsonLite();
    el.sourceData = null;
    await el.updateComplete;
    const select = el.shadowRoot.querySelector("#source");
    select.value = "json";
    el.selectSource();
    expect(el.source).to.equal("json");
    el.shadowRoot.querySelector("#sourcedatablob").value = JSON.stringify(
      makeDatabase(),
    );
    el.loadFromSource();
    await flush();
    expect(typeof el.sourceData).to.equal("string");
    expect(el.ready).to.equal(true);
  });

  it("url source import resolves a fetched database", async () => {
    const el = await fixture(html`<grade-book-lite></grade-book-lite>`);
    globalThis.fetch = () =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(makeDatabase()),
      });
    el.source = "url";
    el.sourceData = "https://example.com/gradebook.json";
    await flush();
    expect(el.ready).to.equal(true);
    expect(el.loading).to.equal(false);
    expect(el.database.assignments.length).to.equal(2);
  });

  it("googledocs import loads and processes every sheet", async () => {
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
    const el = await fixture(html`<grade-book-lite></grade-book-lite>`);
    el.source = "googledocs";
    el.sourceData = "2PACX-fakesheet";
    await flush(400);
    await el.updateComplete;
    expect(el.ready).to.equal(true);
    expect(el.database.assignments.length).to.equal(3);
    expect(el.database.assignments[0]._ISODueDate).to.equal(
      new Date("2026-09-01 12:00").toISOString(),
    );
    expect(el.database.tags.categories.length).to.equal(2);
    expect(el.database.rubrics[0].qualitative).to.eql(["good", "bad"]);
    expect(el.database.roster[0].interests).to.eql(["art"]);
    expect(el.database.settings.photo).to.equal("true");
    expect(el.database.grades[0].a1).to.equal("9");
    expect(el.database.gradesDetails[0].a1).to.equal("neat work");
    expect(el.database.gradeScale[0].letter).to.equal("A");
    // tags data flows into the filter mixin
    expect(el.items.length).to.equal(2);
  });

  it("filesystem handler imports raw table data", async () => {
    const el = await fixture(html`<grade-book-lite></grade-book-lite>`);
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
  });

  it("loadFromExistingSource and saveToFilesystem round trip through the broker", async () => {
    const el = await loadJsonLite();
    const prev = { name: "book.xls" };
    el.prevLocalFileReference = prev;
    const select = el.shadowRoot.querySelector("#source");
    select.value = "filesystem";
    el.loadFromExistingSource();
    await flush(60);
    expect(brokerCalls.processed.length).to.equal(1);
    expect(brokerCalls.processed[0][0]).to.equal(prev);
    expect(el.sourceData).to.equal(prev);
    await el.saveToFilesystem();
    expect(brokerCalls.workbooks.length).to.equal(1);
    expect(brokerCalls.saved[0][0]).to.equal("xlsx");
    expect(brokerCalls.saved[0][1]).to.equal("fake-xlsx-bytes");
  });

  it("disconnectedCallback cleans up", async () => {
    const el = await loadJsonLite();
    expect(el.__disposer.length).to.be.above(0);
    el.remove();
    expect(el.__disposer.length).to.equal(0);
    expect(el.__resizeObserver).to.equal(null);
  });
});
