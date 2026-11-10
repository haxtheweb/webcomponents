// Example-based coverage for Merlin's spoken search matcher: cleanup,
// word similarity, sound keys, phrase syntax, ranking, confidence bands and
// the navigation grammar, against the kinds of things people really say.
import { expect } from "@open-wc/testing";
import {
  merlinCleanText,
  merlinTokens,
  merlinJaroWinkler,
  merlinSoundKey,
  merlinWordSimilarity,
  merlinPhraseWords,
  merlinVoiceEntries,
  merlinRankVoice,
  merlinVoiceBand,
  merlinParseVoiceGrammar,
  merlinVoiceVocab,
  merlinWordList,
} from "../lib/merlin-voice-match.js";

const ITEMS = [
  { title: "Upload a file", tags: ["Agent", "help", "merlin"] },
  { title: "Create block from Link", tags: [] },
  {
    title: "Toggle Santa Mode",
    voice: "(toggle) santa (mode)",
    tags: ["santa"],
  },
  { title: "Dark mode", voice: "(toggle) dark mode" },
  { title: "Insert emoji", voice: "insert emoji" },
  { title: "Edit title", voice: "edit title" },
  { title: "Edit description", voice: "edit description" },
];
const ENTRIES = merlinVoiceEntries(ITEMS);
const rank = (alternatives) => merlinRankVoice(alternatives, ENTRIES);
const titles = (ranked) => ranked.map((r) => r.item.title);

describe("merlin voice text cleanup", () => {
  it("cleans case, punctuation and spacing in any script", () => {
    expect(merlinCleanText("  Upload, a FILE! ")).to.equal("upload a file");
    expect(merlinCleanText("I'd like")).to.equal("id like");
    expect(merlinCleanText("Ünïcödé  текст")).to.equal("ünïcödé текст");
  });

  it("drops fillers and stop words and turns numbers into digits", () => {
    expect(
      merlinTokens("Merlin, could you please upload the file"),
    ).to.deep.equal(["upload", "file"]);
    expect(merlinTokens("option two")).to.deep.equal(["option", "2"]);
    // repeats, found by fuzzing
    expect(merlinTokens("merlin merlin")).to.deep.equal([]);
    expect(merlinTokens("please please a")).to.deep.equal([]);
  });

  it("reads pipe separated vocabulary", () => {
    expect(merlinWordList(" Next | down||NEXT ONE ")).to.deep.equal([
      "next",
      "down",
      "next one",
    ]);
    // an empty translation falls back to English
    expect(merlinVoiceVocab({ next: "" }).next).to.include("next");
  });
});

describe("merlin voice word similarity", () => {
  it("scores spelling with Jaro-Winkler", () => {
    expect(merlinJaroWinkler("file", "file")).to.equal(1);
    expect(merlinJaroWinkler("", "file")).to.equal(0);
    expect(merlinJaroWinkler("martha", "marhta")).to.be.closeTo(0.961, 0.001);
    expect(merlinJaroWinkler("upload", "zebra")).to.be.below(0.6);
  });

  it("matches words that sound alike", () => {
    expect(merlinSoundKey("merlin")).to.equal(merlinSoundKey("marilyn"));
    expect(merlinSoundKey("phone")).to.equal(merlinSoundKey("fone"));
    expect(merlinSoundKey("knight")).to.equal(merlinSoundKey("night"));
    expect(merlinWordSimilarity("marilyn", "merlin")).to.be.at.least(0.92);
  });

  it("never treats different numbers as alike", () => {
    expect(merlinWordSimilarity("2", "3")).to.equal(0);
    expect(merlinWordSimilarity("2", "2")).to.equal(1);
  });

  it("leaves other scripts as they are for sound keys", () => {
    expect(merlinSoundKey("текст")).to.equal("текст");
  });
});

describe("merlin voice phrases and ranking", () => {
  it("reads optional words and drops params from voice phrases", () => {
    expect(merlinPhraseWords("(toggle) dark mode")).to.deep.equal({
      required: ["dark", "mode"],
      optional: ["toggle"],
    });
    expect(merlinPhraseWords("search for *term").required).to.deep.equal([
      "search",
    ]);
  });

  it("runs a clear answer", () => {
    for (const said of [
      "upload a file",
      "upload file please",
      "insert a emoji",
      "toggle dark mode",
      "edit the tittle",
    ]) {
      const ranked = rank([said]);
      expect(merlinVoiceBand(ranked), said).to.equal("high");
    }
    expect(titles(rank(["edit the tittle"]))[0]).to.equal("Edit title");
  });

  it("uses a lesser alternative when the best guess misheard", () => {
    const ranked = rank(["upload a pile", "upload a file"]);
    expect(titles(ranked)[0]).to.equal("Upload a file");
    expect(ranked[0].transcript).to.equal("upload a file");
    expect(merlinVoiceBand(ranked)).to.equal("high");
  });

  it("asks when more than one answer fits", () => {
    const ranked = rank(["edit"]);
    expect(merlinVoiceBand(ranked)).to.equal("medium");
    expect(titles(ranked).slice(0, 2)).to.have.members([
      "Edit title",
      "Edit description",
    ]);
  });

  it("falls back to search when nothing is close", () => {
    expect(merlinVoiceBand(rank(["open the pod bay doors"]))).to.equal("low");
    expect(merlinVoiceBand([])).to.equal("low");
  });

  it("counts tag matches for less than title matches", () => {
    const ranked = rank(["help"]);
    expect(titles(ranked)[0]).to.equal("Upload a file");
    expect(ranked[0].score).to.be.below(0.9);
  });
});

describe("merlin voice grammar", () => {
  const cases = {
    "second one": { action: "pick", index: 1 },
    "Option 2": { action: "pick", index: 1 },
    "option to": { action: "pick", index: 1 },
    "number for": { action: "pick", index: 3 },
    "the 2nd one": { action: "pick", index: 1 },
    "3rd": { action: "pick", index: 2 },
    "number 3": { action: "pick", index: 2 },
    "the third one": { action: "pick", index: 2 },
    "option five": { action: "pick", index: 4 },
    two: { action: "pick", index: 1 },
    1: { action: "pick", index: 0 },
    next: { action: "next" },
    "go back": { action: "back" },
    "Run it!": { action: "run" },
    "start over": { action: "clear" },
    "never mind": { action: "cancel" },
    "What can I say?": { action: "help" },
  };
  Object.keys(cases).forEach((said) => {
    it(`reads "${said}"`, () => {
      expect(merlinParseVoiceGrammar(said)).to.deep.equal(cases[said]);
    });
  });

  it("leaves everything else to search", () => {
    // a soundalike only counts after "option" / "number"
    expect(merlinParseVoiceGrammar("for")).to.equal(null);
    expect(merlinParseVoiceGrammar("to")).to.equal(null);
    expect(merlinParseVoiceGrammar("upload a file")).to.equal(null);
    expect(merlinParseVoiceGrammar("zero")).to.equal(null);
    expect(merlinParseVoiceGrammar("")).to.equal(null);
  });

  it("reads translated vocabulary", () => {
    const es = merlinVoiceVocab({
      next: "siguiente",
      numbers: "cero|uno|dos|tres",
      ordinals: "cero|primero|segundo|tercero",
      pickSuffix: "",
    });
    expect(merlinParseVoiceGrammar("siguiente", es)).to.deep.equal({
      action: "next",
    });
    expect(merlinParseVoiceGrammar("segundo", es)).to.deep.equal({
      action: "pick",
      index: 1,
    });
  });
});
