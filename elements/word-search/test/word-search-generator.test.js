import { expect } from "@open-wc/testing";
import {
  generateWordSearch,
  wordSearchLetters,
  wordSearchHash,
  WORD_SEARCH_AUTO_MAX,
  WORD_SEARCH_MAX_SIZE,
} from "../lib/word-search-generator.js";

const WEB = ["HTML", "CSS", "DOM", "SLOT", "ARIA", "LIT"];
const spell = (puzzle, entry) =>
  entry.cells.map((c) => puzzle.grid[c[0]][c[1]]).join("");
const step = (entry) => [
  entry.cells[1][0] - entry.cells[0][0],
  entry.cells[1][1] - entry.cells[0][1],
];

describe("word-search generator", () => {
  it("gives the same grid for the same words, without Math.random", () => {
    const real = Math.random;
    Math.random = () => {
      throw new Error("Math.random must not be used");
    };
    try {
      const a = generateWordSearch(WEB, {});
      const b = generateWordSearch(WEB.slice(), {});
      expect(a).to.deep.equal(b);
      expect(a.size).to.equal(8);
      expect(a.unplaced).to.deep.equal([]);
    } finally {
      Math.random = real;
    }
  });

  it("gives a different grid for different words or options", () => {
    const a = JSON.stringify(generateWordSearch(WEB, {}).grid);
    const b = JSON.stringify(generateWordSearch([...WEB, "TAG"], {}).grid);
    const c = JSON.stringify(generateWordSearch(WEB, { diagonal: true }).grid);
    expect(a).to.not.equal(b);
    expect(a).to.not.equal(c);
    expect(wordSearchHash("a")).to.not.equal(wordSearchHash("b"));
  });

  it("places every word on its cells, in authored order", () => {
    const p = generateWordSearch(WEB, {});
    expect(p.placed.map((e) => e.label)).to.deep.equal(WEB);
    p.placed.forEach((e) => expect(spell(p, e)).to.equal(e.word));
    expect(p.grid.length).to.equal(p.size);
    p.grid.forEach((row) => {
      expect(row.length).to.equal(p.size);
      row.forEach((letter) => expect(letter).to.not.equal(""));
    });
  });

  it("uses across and down only by default", () => {
    const p = generateWordSearch(WEB, {});
    p.placed.forEach((e) => {
      expect(JSON.stringify(step(e))).to.be.oneOf(["[0,1]", "[1,0]"]);
    });
  });

  it("adds diagonal and backwards directions only when asked", () => {
    const words = [
      "nucleus",
      "ribosome",
      "membrane",
      "cytoplasm",
      "vacuole",
      "golgi",
      "lysosome",
      "cell",
      "wall",
      "plastid",
    ];
    const diag = generateWordSearch(words, { diagonal: true });
    diag.placed.forEach((e) => {
      expect(step(e)[1]).to.be.at.least(0);
      expect(spell(diag, e)).to.equal(e.word);
    });
    const all = generateWordSearch(words, { diagonal: true, backwards: true });
    const steps = all.placed.map((e) => JSON.stringify(step(e)));
    all.placed.forEach((e) => expect(spell(all, e)).to.equal(e.word));
    expect(steps.some((s) => s !== "[0,1]" && s !== "[1,0]")).to.equal(true);
  });

  it("fills with letters the words use", () => {
    const p = generateWordSearch(["привет", "мир"], {});
    const alphabet = new Set("ПРИВЕТМ".split(""));
    p.grid.forEach((row) =>
      row.forEach((letter) => expect(alphabet.has(letter)).to.equal(true)),
    );
  });

  it("splits by user perceived character and upper cases by locale", () => {
    expect(wordSearchLetters("straße").join("")).to.equal("STRASSE");
    expect(wordSearchLetters("web component!").join("")).to.equal(
      "WEBCOMPONENT",
    );
    expect(wordSearchLetters("istanbul", "tr")[0]).to.equal("İ");
    // e + combining acute stays one cell
    expect(wordSearchLetters("café")).to.deep.equal(["C", "A", "F", "É"]);
    // a bad locale falls back instead of throwing
    expect(wordSearchLetters("ok", "not a locale").join("")).to.equal("OK");
  });

  it("reports words that can not be placed and leaves them out", () => {
    const long = "supercalifragilisticexpialidocious";
    const p = generateWordSearch(["cat", long, "x", "dog"], {});
    expect(p.unplaced).to.deep.equal(["x", long]);
    expect(p.placed.map((e) => e.word)).to.deep.equal(["CAT", "DOG"]);
    expect(p.size).to.be.at.most(WORD_SEARCH_AUTO_MAX);
    const tight = generateWordSearch(["abcd", "efgh", "ijkl", "mnop", "qrst"], {
      size: 4,
    });
    expect(tight.placed.length + tight.unplaced.length).to.equal(5);
    expect(tight.unplaced.length).to.be.at.least(1);
  });

  it("drops duplicates and blanks, clamps the size", () => {
    const p = generateWordSearch(["cat", "CAT", " ", null, "dog"], {
      size: 99,
    });
    expect(p.placed.map((e) => e.word)).to.deep.equal(["CAT", "DOG"]);
    expect(p.size).to.equal(WORD_SEARCH_MAX_SIZE);
    expect(generateWordSearch(["cat"], { size: 1 }).size).to.equal(4);
  });

  it("returns an empty puzzle for no words", () => {
    expect(generateWordSearch([], {})).to.deep.equal({
      size: 0,
      grid: [],
      placed: [],
      unplaced: [],
    });
    expect(generateWordSearch(null).size).to.equal(0);
  });
});
