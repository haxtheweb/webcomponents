/**
 * Property-based (fuzz) tests for Merlin's spoken search matcher. Spoken
 * input is whatever the speech engine returns, so these generate arbitrary
 * transcripts and command lists and check the matcher's promises hold:
 * scores stay in range, exact phrases always win, rankings are ordered and
 * deterministic, and the grammar never invents a result number.
 */
import { expect } from "@open-wc/testing";
import fc from "fast-check";
import {
  merlinTokens,
  merlinJaroWinkler,
  merlinWordSimilarity,
  merlinSoundKey,
  merlinVoiceEntries,
  merlinRankVoice,
  merlinVoiceBand,
  merlinParseVoiceGrammar,
} from "../lib/merlin-voice-match.js";
import { fuzzConfig } from "../../../scripts/test-setup/fuzz-config.mjs";

// fixed seed so CI failures reproduce; `yarn test:fuzz` hunts on a random
// one (haxtheweb/issues#3272)
const RUNS = fuzzConfig({ defaultSeed: 20261109, defaultRuns: 300 });

const WORDS = [
  "upload",
  "file",
  "edit",
  "title",
  "dark",
  "mode",
  "insert",
  "emoji",
  "page",
  "site",
  "link",
  "block",
  "santa",
  "merlin",
  "the",
  "please",
  "two",
  "second",
];
const word = fc.oneof(
  fc.constantFrom(...WORDS),
  fc.stringMatching(/^[a-z]{1,9}$/),
);
const phrase = fc
  .array(word, { minLength: 1, maxLength: 5 })
  .map((w) => w.join(" "));
// what an engine might hand back: words, junk, other scripts, emoji
const transcript = fc.oneof(phrase, fc.string(), fc.string({ unit: "binary" }));
const items = fc
  .uniqueArray(phrase, { minLength: 1, maxLength: 12 })
  .map((titles) => titles.map((title) => ({ title: title })));

describe("merlin voice matcher properties", () => {
  it("word similarity is symmetric and between 0 and 1", () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), (a, b) => {
        const ab = merlinJaroWinkler(a, b);
        expect(ab).to.be.within(0, 1);
        expect(Math.abs(ab - merlinJaroWinkler(b, a))).to.be.below(1e-9);
        expect(merlinWordSimilarity(a, b)).to.be.within(0, 1);
      }),
      RUNS,
    );
  });

  it("sound keys never throw and are idempotent on their output length", () => {
    fc.assert(
      fc.property(fc.string({ unit: "binary" }), (w) => {
        const key = merlinSoundKey(w);
        expect(key).to.be.a("string");
        expect(key.length).to.be.at.most(Math.max(w.length * 2, 1));
      }),
      RUNS,
    );
  });

  it("tokens never contain fillers, stop words or empty strings", () => {
    fc.assert(
      fc.property(transcript, (t) => {
        merlinTokens(t).forEach((w) => {
          expect(w).to.not.equal("");
          expect(["the", "a", "please", "merlin"]).to.not.include(w);
        });
      }),
      RUNS,
    );
  });

  it("rankings are ordered, in range, and the same every time", () => {
    fc.assert(
      fc.property(
        items,
        fc.array(transcript, { minLength: 1, maxLength: 5 }),
        (list, alternatives) => {
          const entries = merlinVoiceEntries(list);
          const ranked = merlinRankVoice(alternatives, entries);
          for (let i = 0; i < ranked.length; i++) {
            expect(ranked[i].score).to.be.within(0, 1);
            if (i) {
              expect(ranked[i - 1].score).to.be.at.least(ranked[i].score);
            }
            expect(alternatives).to.include(ranked[i].transcript);
          }
          const again = merlinRankVoice(alternatives, entries);
          expect(again.map((r) => r.item)).to.deep.equal(
            ranked.map((r) => r.item),
          );
          expect(["high", "medium", "low"]).to.include(merlinVoiceBand(ranked));
        },
      ),
      RUNS,
    );
  });

  it("saying a command's exact title ranks it first with a perfect score", () => {
    fc.assert(
      fc.property(items, fc.nat(), (list, n) => {
        const target = list[n % list.length];
        // a title of only fillers / stop words has nothing to match on
        fc.pre(merlinTokens(target.title).length > 0);
        const ranked = merlinRankVoice(
          [target.title],
          merlinVoiceEntries(list),
        );
        expect(ranked[0].score).to.be.closeTo(1, 1e-9);
        const top = ranked.filter((r) => r.score > 1 - 1e-9).map((r) => r.item);
        expect(top).to.include(target);
      }),
      RUNS,
    );
  });

  it("the grammar never returns a negative or fractional result number", () => {
    fc.assert(
      fc.property(transcript, (t) => {
        const g = merlinParseVoiceGrammar(t);
        if (g && g.action === "pick") {
          expect(Number.isInteger(g.index)).to.be.true;
          expect(g.index).to.be.at.least(0);
        }
      }),
      RUNS,
    );
  });
});
