// Shared fixtures for grade-book behavioral tests.
// NOTE: keep this file free of a `.test.js` suffix so WTR does not pick it up.
import { GradeBookStore } from "../lib/grade-book-store.js";

export const gradeScale = [
  { letter: "A", highRange: 100, lowRange: 93 },
  { letter: "B", highRange: 92, lowRange: 85 },
  { letter: "C", highRange: 84, lowRange: 75 },
  { letter: "D", highRange: 74, lowRange: 60 },
  { letter: "F", highRange: 59, lowRange: 0 },
];

export function makeDatabase() {
  return {
    tags: {
      categories: ["design", "writing"],
      data: [
        {
          term: "kerning",
          category: ["design"],
          associatedMaterial: ["https://example.com/kerning"],
          description: "Spacing between letters",
        },
        {
          term: "tone",
          category: ["writing"],
          associatedMaterial: [],
          description: "Voice of the piece",
        },
      ],
    },
    submissions: [
      {
        student: "Alice",
        a1: "https://www.youtube.com/watch?v=abc123",
        a2: "plain text feedback",
      },
      { student: "Bob", a1: "https://example.com/submission" },
    ],
    rubrics: [
      {
        shortName: "r1",
        name: "Design rubric",
        criteria: "design",
        description: "Design criteria",
        qualitative: ["good", "bad"],
        percentage: 50,
      },
      {
        shortName: "r2",
        name: "Writing rubric",
        criteria: "writing",
        description: "Writing criteria",
        qualitative: ["strong", "weak"],
        percentage: 50,
      },
    ],
    assignments: [
      {
        shortName: "a1",
        name: "Assignment 1",
        points: 10,
        rubric: "r1",
        dueDate: "2026-09-01",
        dueTime: "12:00",
        _ISODueDate: "2026-09-01T16:00:00.000Z",
      },
      {
        shortName: "a2",
        name: "Assignment 2",
        points: 20,
        rubric: "r2",
        dueDate: "2026-09-08",
        dueTime: "12:00",
        _ISODueDate: "2026-09-08T16:00:00.000Z",
      },
    ],
    roster: [
      {
        student: "Alice",
        photo: "",
        email: "alice@example.com",
        interests: ["art"],
      },
      {
        student: "Bob",
        photo: "https://example.com/bob.jpg",
        email: "bob@example.com",
      },
    ],
    grades: { 0: { a1: 9, a2: "" }, 1: { a1: 5 } },
    gradesDetails: { 0: { a1: "neat work" } },
    gradeScale: JSON.parse(JSON.stringify(gradeScale)),
    settings: {},
  };
}

// raw sheet tables (array-of-arrays, the shape gSheet / filesystem data uses
// BEFORE transformTable runs)
export const rawTables = {
  tags: [
    ["term", "category", "description", "associatedMaterial"],
    ["kerning", "design", "Spacing between letters", "https://example.com/k"],
    ["tone", "writing", "Voice of the piece", ""],
  ],
  roster: [
    ["student", "photo", "email", "interests"],
    ["Alice", "", "alice@example.com", "art"],
    ["Bob", "https://example.com/bob.jpg", "bob@example.com", ""],
  ],
  assignments: [
    ["shortName", "name", "points", "rubric", "dueDate", "dueTime"],
    ["a1", "Assignment 1", "10", "r1", "2026-09-01", "12:00"],
    ["a2", "Assignment 2", "20", "r2", "2026-09-08", "12:00"],
    ["a3", "Assignment 3", "5", "r1", "not-a-date", "99:99"],
  ],
  rubrics: [
    ["shortName", "name", "criteria", "description", "qualitative", "percentage"],
    ["r1", "Design rubric", "design", "Design criteria", "good,bad", "50"],
    ["r2", "Writing rubric", "writing", "Writing criteria", "strong,weak", "50"],
  ],
  submissions: [
    ["student", "a1", "a2"],
    ["Alice", "https://www.youtube.com/watch?v=abc123", "plain text feedback"],
    ["Bob", "https://example.com/submission", ""],
  ],
  // keep this scale the SAME SIZE as the fixture gradeScale (5 entries):
  // letter-grade elements hold a stale _letterIndex across store scale swaps
  // and their render crashes when the scale shrinks underneath them
  gradeScale: [
    ["letter", "highRange", "lowRange"],
    ["A", "100", "93"],
    ["B", "92", "85"],
    ["C", "84", "75"],
    ["D", "74", "60"],
    ["F", "59", "0"],
  ],
  grades: [
    ["student", "a1", "a2"],
    ["Alice", "9", ""],
    ["Bob", "5", ""],
  ],
  gradesDetails: [
    ["student", "a1"],
    ["Alice", "neat work"],
  ],
  settings: [
    ["key", "value"],
    ["photo", "true"],
  ],
};

// CSV versions of rawTables for the googledocs import path
export function csvTables() {
  const tables = {};
  for (const key in rawTables) {
    tables[key] = rawTables[key]
      .map((row) =>
        row
          .map((cell) => (cell.indexOf(",") > -1 ? `"${cell}"` : cell))
          .join(","),
      )
      .join("\n");
  }
  return tables;
}

// gid mapping that grade-book.js hardcodes for its google sheet
export const sheetGids = {
  tags: 0,
  roster: 118800528,
  assignments: 540222065,
  rubrics: 1744429439,
  submissions: 2104732668,
  gradeScale: 980501320,
  grades: 2130903440,
  gradesDetails: 644559151,
  settings: 1413275461,
};

export function fakeWindowFactory() {
  return () => {
    const doc = globalThis.document.implementation.createHTMLDocument("popup");
    return {
      closed: false,
      focusCount: 0,
      focus() {
        this.focusCount++;
      },
      document: doc,
      onbeforeunload: null,
    };
  };
}

// save/restore helpers for the GradeBookStore singleton (stub/restore pattern)
export function snapshotStore() {
  return {
    database: GradeBookStore.database,
    activeStudent: GradeBookStore.activeStudent,
    activeAssignment: GradeBookStore.activeAssignment,
    gradeScale: GradeBookStore.gradeScale,
    activeRubric: GradeBookStore.activeRubric,
  };
}

export function restoreStore(snap) {
  GradeBookStore.database = snap.database;
  GradeBookStore.activeStudent = snap.activeStudent;
  GradeBookStore.activeAssignment = snap.activeAssignment;
  GradeBookStore.gradeScale = snap.gradeScale;
  GradeBookStore.activeRubric = snap.activeRubric;
}

export function flush(ms = 60) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
