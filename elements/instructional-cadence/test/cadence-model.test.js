import { expect } from "@open-wc/testing";
import {
  CADENCE_WEIGHTS,
  pageWeight,
  median,
  buildLessons,
  lessonShape,
  analyzeCadence,
  cadenceToAlphaTex,
} from "../lib/cadence-model.js";

// a lesson shaped the way a well paced course plays: short setup, a middle
// that moves, a peak, a lighter follow-up and a recap
const wellPaced = [2, 1, 2, 3, 2, 5, 2, 3, 3];

function course(lessonsRows) {
  const items = [];
  const rows = [];
  lessonsRows.forEach((pages, l) => {
    pages.forEach((row, p) => {
      const id = `l${l}p${p}`;
      items.push({
        id,
        title: `Lesson ${l} page ${p}`,
        parent: p === 0 ? null : `l${l}p0`,
        order: p,
      });
      rows.push(Object.assign({ id }, row));
    });
  });
  return { items, rows };
}

describe("cadence-model", () => {
  it("weights video as an activity, not by duration", () => {
    expect(pageWeight({ videos: 1 })).to.equal(CADENCE_WEIGHTS.video);
    expect(pageWeight({ videos: 1, videoLength: 9000 })).to.equal(
      CADENCE_WEIGHTS.video,
    );
  });

  it("sums the content report fields", () => {
    const w = pageWeight({ readTime: 3, images: 2, selfChecks: 1, h5p: 1 });
    expect(w).to.be.closeTo(3 + 0.8 + 0.6 + 1, 0.0001);
  });

  it("ignores missing or bad values", () => {
    expect(pageWeight(null)).to.equal(0);
    expect(pageWeight({ readTime: "abc", images: -2 })).to.equal(0);
  });

  it("computes medians", () => {
    expect(median([3, 1, 2])).to.equal(2);
    expect(median([1, 2, 3, 4])).to.equal(2.5);
    expect(median([])).to.equal(0);
  });

  it("groups parents whose children are all leaves into lessons", () => {
    const items = [
      { id: "m", parent: null, title: "Module", order: 0 },
      { id: "l1", parent: "m", title: "Lesson 1", order: 0 },
      { id: "a", parent: "l1", title: "A", order: 1 },
      { id: "b", parent: "l1", title: "B", order: 0 },
      { id: "solo", parent: null, title: "Solo page", order: 1 },
    ];
    const lessons = buildLessons(items);
    expect(lessons.length).to.equal(1);
    expect(lessons[0].id).to.equal("l1");
    expect(lessons[0].pages.map((p) => p.id)).to.deep.equal(["l1", "b", "a"]);
  });

  it("treats items whose parent is filtered out as roots", () => {
    const items = [
      { id: "l1", parent: "gone", title: "Lesson 1", order: 0 },
      { id: "a", parent: "l1", title: "A", order: 0 },
    ];
    expect(buildLessons(items).map((l) => l.id)).to.deep.equal(["l1"]);
  });

  it("finds all five parts in a well paced lesson", () => {
    const shape = lessonShape(wellPaced);
    expect(shape.score).to.equal(5);
    expect(shape.roles[0]).to.equal("setup");
    expect(shape.roles[shape.peak]).to.equal("peak");
    expect(shape.roles[wellPaced.length - 1]).to.equal("recap");
  });

  it("flags a front-loaded lesson", () => {
    const shape = lessonShape([9, 12, 7, 0.2]);
    expect(shape.checks.setup).to.equal(false);
    expect(shape.checks.recap).to.equal(false);
    expect(shape.score).to.be.below(3);
  });

  it("treats an empty page in the middle as a break in the dance", () => {
    const shape = lessonShape([2, 1, 0, 2, 5, 2, 3]);
    expect(shape.checks.dance).to.equal(false);
  });

  it("does not penalize light pages that keep the shape", () => {
    const shape = lessonShape([1, 0.5, 1, 0.6, 2, 0.6, 1]);
    expect(shape.checks.setup).to.equal(true);
    expect(shape.checks.follow).to.equal(true);
  });

  it("scores a course and counts empty beats", () => {
    const good = wellPaced.map((readTime) => ({ readTime }));
    const bad = [{ readTime: 9 }, { readTime: 0 }, { readTime: 12 }];
    const { items, rows } = course([good, bad]);
    const result = analyzeCadence(items, rows);
    expect(result.lessons.length).to.equal(2);
    expect(result.lessons[0].score).to.equal(5);
    expect(result.emptyBeats).to.equal(1);
    expect(result.flow).to.be.below(100);
  });

  it("resolves the recap to the home note only when the recap passes", () => {
    const { items, rows } = course([
      wellPaced.map((readTime) => ({ readTime })),
    ]);
    const lesson = analyzeCadence(items, rows).lessons[0];
    const last = lesson.beats[lesson.beats.length - 1].pitches;
    expect(last[last.length - 1]).to.equal(5);
  });

  it("writes one bar per lesson with an N/4 time signature", () => {
    const { items, rows } = course([
      wellPaced.map((readTime) => ({ readTime })),
    ]);
    const tex = cadenceToAlphaTex(
      analyzeCadence(items, rows),
      'A "quoted" title',
    );
    expect(tex).to.contain("\\ts 9 4");
    expect(tex).to.contain("\\tuning piano");
    expect(tex).to.contain("\\instrument piano");
    expect(tex).to.not.contain('"quoted"');
    expect(tex.trim().endsWith("|")).to.equal(true);
  });

  it("writes nothing when there are no lessons", () => {
    expect(cadenceToAlphaTex(analyzeCadence([], []))).to.equal("");
  });
});
