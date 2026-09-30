import { fixture, expect, html } from "@open-wc/testing";
import "@github/relative-time-element";
import "../lib/grade-book-pop-up.js";
import { GradeBookPopUp } from "../lib/grade-book-pop-up.js";
import { GradeBookStore } from "../lib/grade-book-store.js";
import { makeDatabase, flush } from "./fixtures.js";

describe("grade-book-pop-up", () => {
  let savedDatabase;
  let savedStudent;
  let savedAssignment;

  beforeEach(() => {
    savedDatabase = GradeBookStore.database;
    savedStudent = GradeBookStore.activeStudent;
    savedAssignment = GradeBookStore.activeAssignment;
    // the pop-up reads the store database directly while rendering, so it
    // needs a fully populated database with _ISODueDate values present
    GradeBookStore.database = makeDatabase();
    GradeBookStore.activeStudent = 0;
    GradeBookStore.activeAssignment = 0;
  });

  afterEach(() => {
    // leave a VALID database behind: straggler renders of pop-ups and other
    // grade-book elements crash against an empty store
    GradeBookStore.database = makeDatabase();
    GradeBookStore.activeStudent = 0;
    GradeBookStore.activeAssignment = 0;
    void savedDatabase;
    void savedStudent;
    void savedAssignment;
  });

  it("has the expected tag and renders into light DOM", async () => {
    expect(GradeBookPopUp.tag).to.equal("grade-book-pop-up");
    const el = await fixture(html`<grade-book-pop-up></grade-book-pop-up>`);
    await flush();
    expect(el.shadowRoot).to.equal(null);
    expect(el.querySelector("div.shortcut-btns")).to.exist;
    expect(el.querySelectorAll("div.shortcut-btns button").length).to.equal(4);
  });

  it("changeActive steps the active student and assignment through the store", async () => {
    const el = await fixture(html`<grade-book-pop-up></grade-book-pop-up>`);
    await flush();
    el.querySelector('button[value="next-Student"]').click();
    expect(GradeBookStore.activeStudent).to.equal(1);
    el.querySelector('button[value="prev-Student"]').click();
    expect(GradeBookStore.activeStudent).to.equal(0);
    el.querySelector('button[value="next-Assignment"]').click();
    expect(GradeBookStore.activeAssignment).to.equal(1);
    el.querySelector('button[value="prev-Assignment"]').click();
    expect(GradeBookStore.activeAssignment).to.equal(0);
  });

  it("renders a URL submission as an iframe with the cleaned video source", async () => {
    const el = await fixture(html`<grade-book-pop-up></grade-book-pop-up>`);
    await flush();
    const iframe = el.querySelector(".active-submission iframe");
    expect(iframe).to.exist;
    expect(String(iframe.getAttribute("src")).indexOf("youtube")).to.not.equal(
      -1,
    );
    const anchor = el.querySelector('a[target="_blank"]');
    expect(anchor).to.exist;
    expect(anchor.getAttribute("href")).to.equal(
      "https://www.youtube.com/watch?v=abc123",
    );
  });

  it("renders a non-URL submission through md-block", async () => {
    GradeBookStore.activeAssignment = 1;
    const el = await fixture(html`<grade-book-pop-up></grade-book-pop-up>`);
    await flush();
    // the tag renders into light DOM right away; the module upgrade (which
    // renders the markdown into md-block's own shadow root) lands async
    expect(el.querySelector("md-block")).to.exist;
    await flush(400);
    const md = el.querySelector("md-block");
    if (md.shadowRoot) {
      expect(md.shadowRoot.innerHTML.includes("plain text feedback")).to.equal(
        true,
      );
    }
    GradeBookStore.activeAssignment = 0;
  });

  it("renders the submitted heading from the assignment due date", async () => {
    const el = await fixture(html`<grade-book-pop-up></grade-book-pop-up>`);
    await flush();
    expect(el.innerHTML.includes("Student submission")).to.equal(true);
    expect(el.querySelector("relative-time")).to.exist;
    expect(el.querySelector("relative-time").getAttribute("datetime")).to.not
      .equal(null);
  });

  it("changeActive respects the roster and assignment bounds", async () => {
    const el = await fixture(html`<grade-book-pop-up></grade-book-pop-up>`);
    await flush();
    // next / prev are no-ops at either end of each list
    GradeBookStore.activeStudent = 1;
    el.querySelector('button[value="next-Student"]').click();
    expect(GradeBookStore.activeStudent).to.equal(1);
    GradeBookStore.activeStudent = 0;
    el.querySelector('button[value="prev-Student"]').click();
    expect(GradeBookStore.activeStudent).to.equal(0);
    GradeBookStore.activeAssignment = 1;
    el.querySelector('button[value="next-Assignment"]').click();
    expect(GradeBookStore.activeAssignment).to.equal(1);
    GradeBookStore.activeAssignment = 0;
    el.querySelector('button[value="prev-Assignment"]').click();
    expect(GradeBookStore.activeAssignment).to.equal(0);
    // an empty store leaves every button a no-op
    GradeBookStore.database = {
      tags: { categories: [], data: [] },
      roster: [],
      assignments: [],
    };
    el.querySelector('button[value="next-Student"]').click();
    el.querySelector('button[value="next-Assignment"]').click();
    expect(GradeBookStore.activeStudent).to.equal(0);
    expect(GradeBookStore.activeAssignment).to.equal(0);
    // restore a valid store database SYNCHRONOUSLY so any straggler render
    // queued by the empty-store swap finds safe data when it runs
    GradeBookStore.database = makeDatabase();
  });
  it("render() is safe when the store database has no assignments (was BUG: unguarded store access)", async () => {
    // regression: renderStudentSubmission used to dereference
    // GradeBookStore.database.assignments[activeAssignment]._ISODueDate
    // with no guard, so any render against an empty store (no assignments
    // loaded) threw a TypeError instead of showing the heading alone
    const empty = { tags: { categories: [], data: [] } };
    GradeBookStore.database = empty;
    const el = globalThis.document.createElement("grade-book-pop-up");
    let threw = false;
    try {
      el.render();
    } catch (e) {
      threw = true;
    }
    expect(threw).to.equal(false);
    // restore a valid store database SYNCHRONOUSLY: the empty-store change
    // above queued an autorun-driven update on this (disconnected) element
    // and that scheduled render must find a safe database when it runs
    GradeBookStore.database = makeDatabase();
  });
});
