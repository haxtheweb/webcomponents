import { expect } from "@open-wc/testing";
import { GradeBookStore } from "../lib/grade-book-store.js";
import { GradeBookStoreClass } from "../lib/grade-book-store.js";
import { makeDatabase, flush } from "./fixtures.js";

describe("grade-book-store", () => {
  it("is a singleton resolved through requestAvailability", () => {
    const first = globalThis.GradeBookStore.requestAvailability();
    const second = globalThis.GradeBookStore.requestAvailability();
    expect(first).to.equal(second);
    expect(first).to.equal(GradeBookStore);
    expect(first instanceof GradeBookStoreClass).to.equal(true);
    expect(globalThis.GradeBookStore.instance).to.equal(GradeBookStore);
  });

  it("starts with an empty but fully shaped database", () => {
    // the exported singleton may have been mutated by other tests in this
    // file, so verify the CLASS shape via a fresh instance instead
    const fresh = new GradeBookStoreClass();
    expect(fresh.gradeScale.length).to.equal(0);
    expect(fresh.activeRubric.length).to.equal(0);
    expect(fresh.activeStudent).to.equal(0);
    expect(fresh.activeAssignment).to.equal(0);
    expect(Array.isArray(fresh.database.tags.categories)).to.equal(true);
    expect(Array.isArray(fresh.database.submissions)).to.equal(true);
    expect(Array.isArray(fresh.database.rubrics)).to.equal(true);
    expect(Array.isArray(fresh.database.assignments)).to.equal(true);
    expect(Array.isArray(fresh.database.roster)).to.equal(true);
    expect(typeof fresh.database.grades).to.equal("object");
    expect(typeof fresh.database.settings).to.equal("object");
  });

  describe("activeSubmission computed", () => {
    it("returns the submission for the active student and assignment", async () => {
      const store = new GradeBookStoreClass();
      store.database = makeDatabase();
      expect(store.activeSubmission).to.equal(
        "https://www.youtube.com/watch?v=abc123",
      );
      store.activeAssignment = 1;
      await flush();
      expect(store.activeSubmission).to.equal("plain text feedback");
      // back to assignment 0 before switching students: Bob has no a2 column
      store.activeAssignment = 0;
      store.activeStudent = 1;
      await flush();
      expect(store.activeSubmission).to.equal("https://example.com/submission");
    });

    it("returns null when no submission row matches the active student", async () => {
      const store = new GradeBookStoreClass();
      const db = makeDatabase();
      db.submissions = [{ student: "Nobody", a1: "x" }];
      store.database = db;
      expect(store.activeSubmission).to.equal(null);
    });

    it("returns null when the submission column is empty for the assignment", async () => {
      const store = new GradeBookStoreClass();
      const db = makeDatabase();
      db.submissions = [
        { student: "Alice", a1: "", a2: "" },
      ];
      store.database = db;
      expect(store.activeSubmission).to.equal(null);
    });

    it("returns null when submissions are empty", async () => {
      const store = new GradeBookStoreClass();
      const db = makeDatabase();
      db.submissions = [];
      store.database = db;
      expect(store.activeSubmission).to.equal(null);
    });

    it("tracks changes to activeStudent and activeAssignment on the singleton", async () => {
      GradeBookStore.database = makeDatabase();
      GradeBookStore.activeStudent = 1;
      GradeBookStore.activeAssignment = 1;
      await flush();
      expect(GradeBookStore.activeSubmission).to.equal(null);
      GradeBookStore.activeStudent = 0;
      await flush();
      expect(GradeBookStore.activeSubmission).to.equal(
        "plain text feedback",
      );
      // leave the shared singleton in a safe state for other suites
      GradeBookStore.activeStudent = 0;
      GradeBookStore.activeAssignment = 0;
    });
  });
});
