import { expect } from "@open-wc/testing";
import {
  crosswordLayout,
  crosswordCells,
  CROSSWORD_MAX_WORDS,
  CROSSWORD_MAX_LENGTH,
} from "../lib/crossword-layout.js";

const WEB = ["HTML", "HREF", "LINK", "FORK"];
const VOCAB = [
  "component",
  "attribute",
  "shadow",
  "slot",
  "template",
  "event",
  "property",
  "render",
  "style",
  "import",
];

const draw = (layout) => {
  const rows = Array.from({ length: layout.rows }, () =>
    Array(layout.cols).fill("."),
  );
  layout.cells.forEach((c) => {
    rows[c.r][c.c] = c.ch;
  });
  return rows.map((r) => r.join(""));
};

// every maximal run of two or more letters, across and down: in a legal
// crossword each one is exactly a placed word
const runs = (layout) => {
  const rows = draw(layout);
  const cols = Array.from({ length: layout.cols }, (_x, c) =>
    rows.map((r) => r[c]).join(""),
  );
  const pick = (lines) =>
    lines.flatMap((line) => line.split(".").filter((s) => s.length > 1));
  return { across: pick(rows).sort(), down: pick(cols).sort() };
};
const placedBy = (layout, dir) =>
  layout.words
    .filter((w) => w.dir === dir)
    .map((w) => w.text)
    .sort();

describe("crossword-layout", () => {
  it("lays out the web basics words like the approved mock", () => {
    const layout = crosswordLayout(WEB);
    expect(draw(layout)).to.deep.equal(["HTML", "R..I", "E..N", "FORK"]);
    expect(
      layout.words.map((w) => `${w.number}${w.dir[0]} ${w.text}`),
    ).to.deep.equal(["1a HTML", "3a FORK", "1d HREF", "2d LINK"]);
    expect(layout.unplaced).to.deep.equal([]);
  });

  it("is deterministic: the same words in the same order give the same grid", () => {
    const a = crosswordLayout(VOCAB);
    const b = crosswordLayout(VOCAB.slice());
    expect(JSON.stringify(a)).to.equal(JSON.stringify(b));
    expect(a.words.length).to.equal(VOCAB.length);
  });

  it("places the longest word first, across, and crosses the rest on shared letters", () => {
    const layout = crosswordLayout(VOCAB);
    const first = layout.words.find((w) => w.text === "COMPONENT");
    expect(first.dir).to.equal("across");
    // every word shares at least one square with a word going the other way
    layout.words.forEach((w, i) => {
      const dir = w.dir;
      const other = dir === "across" ? "down" : "across";
      const mine = layout.cells.filter((c) => c[dir] === i);
      expect(mine.length).to.equal(w.cells.length);
      expect(mine.some((c) => c[other] !== -1)).to.equal(true);
    });
    // both directions are used
    expect(placedBy(layout, "across").length).to.be.greaterThan(0);
    expect(placedBy(layout, "down").length).to.be.greaterThan(0);
  });

  it("has valid crossings and no illegal adjacency: every run of letters is a placed word", () => {
    [WEB, VOCAB, ["alpha", "beta", "gamma", "delta", "theta", "kappa"]].forEach(
      (list) => {
        const layout = crosswordLayout(list);
        const found = runs(layout);
        expect(found.across).to.deep.equal(placedBy(layout, "across"));
        expect(found.down).to.deep.equal(placedBy(layout, "down"));
        // a crossing square holds the letter of both words
        layout.cells.forEach((c) => {
          ["across", "down"].forEach((dir) => {
            if (c[dir] !== -1) {
              const w = layout.words[c[dir]];
              const k = dir === "across" ? c.c - w.c : c.r - w.r;
              expect(w.cells[k]).to.equal(c.ch);
            }
          });
        });
      },
    );
  });

  it("numbers squares in reading order and orders clues across then down", () => {
    const layout = crosswordLayout(VOCAB);
    const numbered = layout.cells.filter((c) => c.number);
    expect(numbered.map((c) => c.number)).to.deep.equal(
      numbered.map((_c, i) => i + 1),
    );
    const dirs = layout.words.map((w) => w.dir);
    expect(dirs.lastIndexOf("across")).to.be.lessThan(dirs.indexOf("down"));
    ["across", "down"].forEach((dir) => {
      const nums = layout.words
        .filter((w) => w.dir === dir)
        .map((w) => w.number);
      expect(nums).to.deep.equal(nums.slice().sort((a, b) => a - b));
    });
    layout.words.forEach((w) => {
      const start = layout.cells.find((c) => c.r === w.r && c.c === w.c);
      expect(start.number).to.equal(w.number);
    });
  });

  it("reports words it could not place, with the reason", () => {
    const layout = crosswordLayout([
      "HTML",
      "zzz",
      "q",
      "",
      "html",
      { word: "LINK", clue: "c" },
    ]);
    expect(layout.words.map((w) => w.text).sort()).to.deep.equal([
      "HTML",
      "LINK",
    ]);
    expect(layout.unplaced).to.deep.equal([
      { index: 1, word: "zzz", reason: "nofit" },
      { index: 2, word: "q", reason: "short" },
      { index: 3, word: "", reason: "empty" },
      { index: 4, word: "html", reason: "duplicate" },
    ]);
    // a placed word keeps its authored index and clue
    const link = layout.words.find((w) => w.text === "LINK");
    expect(link.index).to.equal(5);
    expect(link.clue).to.equal("c");
  });

  it("handles case and characters that are not letters", () => {
    expect(crosswordCells("ice-cream")).to.deep.equal("ICECREAM".split(""));
    expect(crosswordCells("  Rock 'n' Roll! ")).to.deep.equal(
      "ROCKNROLL".split(""),
    );
    expect(crosswordCells("html5")).to.deep.equal(["H", "T", "M", "L", "5"]);
    expect(crosswordCells(null)).to.deep.equal([]);
    expect(crosswordCells("-- !")).to.deep.equal([]);
    const layout = crosswordLayout(["Ice-Cream", "cone"]);
    expect(layout.words.map((w) => w.text).sort()).to.deep.equal([
      "CONE",
      "ICECREAM",
    ]);
  });

  it("treats accented and non-Latin letters as single squares", () => {
    // precomposed and combining forms are the same single square
    expect(crosswordCells("éclair")).to.deep.equal(crosswordCells("éclair"));
    expect(crosswordCells("éclair").length).to.equal(6);
    expect(crosswordCells("Łódź")).to.deep.equal(["Ł", "Ó", "D", "Ź"]);
    expect(crosswordCells("日本語").length).to.equal(3);
    // a letter outside the basic plane is one square, not two
    expect(crosswordCells("𝐀b").length).to.equal(2);
    expect(crosswordCells("мир")).to.deep.equal(["М", "И", "Р"]);
    const layout = crosswordLayout(["éclair", "café"]);
    expect(layout.words.length).to.equal(2);
    expect(layout.cells.length).to.equal(6 + 4 - 1);
  });

  it("caps word count and length so it stays fast", () => {
    const many = Array.from({ length: 60 }, (_x, i) =>
      Array.from({ length: 5 + (i % 12) }, (_y, j) =>
        String.fromCharCode(97 + ((i * 7 + j * 3) % 26)),
      ).join(""),
    );
    many.push("a".repeat(CROSSWORD_MAX_LENGTH + 1));
    const started = performance.now();
    const layout = crosswordLayout(many);
    const took = performance.now() - started;
    expect(layout.words.length).to.be.at.most(CROSSWORD_MAX_WORDS);
    expect(layout.unplaced.some((u) => u.reason === "limit")).to.equal(true);
    expect(layout.unplaced.some((u) => u.reason === "long")).to.equal(true);
    expect(layout.words.length + layout.unplaced.length).to.equal(many.length);
    expect(took).to.be.lessThan(1000);
    const found = runs(layout);
    expect(found.across).to.deep.equal(placedBy(layout, "across"));
    expect(found.down).to.deep.equal(placedBy(layout, "down"));
  });

  it("returns an empty grid for no usable words", () => {
    [undefined, [], ["", "a"]].forEach((list) => {
      const layout = crosswordLayout(list);
      expect(layout.rows).to.equal(0);
      expect(layout.cells).to.deep.equal([]);
      expect(layout.words).to.deep.equal([]);
    });
  });
});
