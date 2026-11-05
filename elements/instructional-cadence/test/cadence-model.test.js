import { expect } from "@open-wc/testing";
import {
  CADENCE_WEIGHTS,
  CADENCE_PARTS,
  pageWeight,
  isRest,
  median,
  buildPhrases,
  lessonShape,
  analyzeCadence,
  cadenceToAlphaTex,
} from "../lib/cadence-model.js";
import { sampleItems, sampleRows } from "./larch060-sample.js";

const beat = (weight, rest, leaf) => ({
  weight,
  rest: !!rest,
  leaf: leaf !== false,
});

function lessonByTitle(analysis, start) {
  return analysis.lessons.find((l) => l.title.indexOf(start) === 0);
}

describe("cadence-model weights and rests", () => {
  it("counts a video once as an activity, not by length or tag count", () => {
    expect(pageWeight({ videos: 1 })).to.equal(CADENCE_WEIGHTS.video);
    expect(pageWeight({ videos: 2 })).to.equal(CADENCE_WEIGHTS.video);
  });

  it("reads words as reading minutes and adds media", () => {
    const w = pageWeight({ words: 400, images: 2, embeds: 1 });
    expect(w).to.be.closeTo(2 + 0.8 + 1, 0.0001);
  });

  it("ignores missing or bad values", () => {
    expect(pageWeight(null)).to.equal(0);
    expect(pageWeight({ words: "abc", images: -2 })).to.equal(0);
  });

  it("treats a blank page as a rest", () => {
    expect(isRest({ words: 0 })).to.equal(true);
    expect(isRest({ words: 8 })).to.equal(true);
    expect(isRest({ words: 8, videos: 1 })).to.equal(false);
    expect(isRest({ words: 200 })).to.equal(false);
  });

  it("computes medians", () => {
    expect(median([3, 1, 2])).to.equal(2);
    expect(median([1, 2, 3, 4])).to.equal(2.5);
    expect(median([])).to.equal(0);
  });
});

describe("cadence-model phrases", () => {
  it("finds lessons two levels deep, segments included", () => {
    const { depth, phrases } = buildPhrases(sampleItems);
    expect(depth).to.equal(1);
    const lessons = phrases.filter((p) => p.kind === "lesson");
    expect(lessons.map((l) => l.title)).to.deep.equal([
      "Orientation",
      "Lesson 1: Ancient Egypt and Mesopotamia",
      "Lesson 2: Ancient Greece",
      "Lesson 19: American Park Movement",
      'Lesson 35: "Urbanized" video by Gary Hustwit (2012)',
    ]);
    // lesson page, intro, outline, three segments of three, study guide
    expect(lessons[1].pages.length).to.equal(13);
  });

  it("puts module pages, reviews and quizzes in interludes", () => {
    const { phrases } = buildPhrases(sampleItems);
    const interludes = phrases.filter((p) => p.kind === "interlude");
    const titles = interludes.map((p) => p.pages.map((n) => n.item.title));
    expect(titles).to.deep.include([
      "Complete the Module 1 Review",
      "Complete the Module 1 Quiz",
    ]);
  });

  it("honours an explicit lesson depth", () => {
    const { phrases } = buildPhrases(sampleItems, 2);
    const first = phrases.find((p) => p.kind === "lesson" && p.pages.length);
    expect(first.title).to.equal("Orientation");
    expect(
      phrases.some(
        (p) => p.title === "1.1 The Beginning: Neolithic Revolution",
      ),
    ).to.equal(true);
  });

  it("treats items whose parent is filtered out as roots", () => {
    const items = [
      { id: "l1", parent: "gone", title: "Lesson 1", order: 0 },
      { id: "a", parent: "l1", title: "A", order: 0 },
    ];
    const lessons = buildPhrases(items).phrases.filter(
      (p) => p.kind === "lesson",
    );
    expect(lessons.map((l) => l.id)).to.deep.equal(["l1"]);
  });
});

describe("cadence-model lesson shape", () => {
  it("finds all five parts in a well paced lesson", () => {
    const shape = lessonShape([
      beat(0, true, false),
      beat(1.2),
      beat(0.4),
      beat(0, true, false),
      beat(1),
      beat(3.2),
      beat(0, true, false),
      beat(1),
      beat(3.2),
      beat(0.9),
      beat(3.2),
      beat(0.7),
    ]);
    expect(shape.score).to.equal(CADENCE_PARTS.length);
    expect(shape.cadence).to.equal("authentic");
  });

  it("flags a top-heavy lesson", () => {
    const shape = lessonShape([beat(9), beat(12), beat(7), beat(0.2, true)]);
    expect(shape.checks.anacrusis).to.equal(false);
    expect(shape.checks.cadence).to.equal(false);
    expect(shape.cadence).to.equal("half");
  });

  it("stops the development at a blank content page", () => {
    const shape = lessonShape([
      beat(1),
      beat(0.5),
      beat(0, true, true),
      beat(1.5),
      beat(5),
      beat(1),
      beat(1),
    ]);
    expect(shape.checks.development).to.equal(false);
  });

  it("lets a blank page that leads to pages below it breathe", () => {
    const shape = lessonShape([
      beat(1),
      beat(0.4),
      beat(0, true, false),
      beat(1.5),
      beat(5),
      beat(1),
      beat(1),
    ]);
    expect(shape.checks.development).to.equal(true);
  });

  it("leaves a lesson that ends on its climax open", () => {
    const shape = lessonShape([beat(1), beat(0.5), beat(1.5), beat(5)]);
    expect(shape.checks.cadence).to.equal(false);
  });
});

describe("cadence-model on LARCH 060", () => {
  const analysis = analyzeCadence(sampleItems, sampleRows);

  it("scores the evenly built lessons fully", () => {
    expect(lessonByTitle(analysis, "Orientation").score).to.equal(5);
    expect(lessonByTitle(analysis, "Lesson 2").score).to.equal(5);
  });

  it("hears the video placed before its preview in Lesson 19", () => {
    const lesson = lessonByTitle(analysis, "Lesson 19");
    expect(lesson.checks.decrescendo).to.equal(false);
    expect(analysis.blankPages.map((b) => b.slug)).to.include("node/76");
  });

  it("hears Lesson 35 open on its video", () => {
    const lesson = lessonByTitle(analysis, "Lesson 35");
    expect(lesson.checks.anacrusis).to.equal(false);
  });

  it("plays segment and lesson title pages as rests", () => {
    const lesson = lessonByTitle(analysis, "Lesson 1");
    expect(lesson.beats[0].rest).to.equal(true);
    expect(lesson.beats[3].rest).to.equal(true);
    expect(lesson.beats[3].leaf).to.equal(false);
  });

  it("writes one bar per phrase with its title and an N/4 meter", () => {
    const tex = cadenceToAlphaTex(analysis, 'LARCH "060"');
    expect(tex).to.contain("\\ts 13 4");
    expect(tex).to.contain(
      '\\section "Lesson 1: Ancient Egypt and Mesopotamia"',
    );
    expect(tex).to.contain("\\instrument piano");
    expect(tex).to.not.contain('"060"');
    expect(tex).to.contain(":4 r");
  });

  it("writes nothing when there is nothing to play", () => {
    expect(cadenceToAlphaTex(analyzeCadence([], []))).to.equal("");
  });
});
