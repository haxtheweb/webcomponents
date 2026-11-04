import { expect } from "@open-wc/testing";

// the "Learning activity lab" branch of the demo site
const LAB = "item-learning-lab";
const demo = (p) => new URL(`../demo/${p}`, import.meta.url).href;

describe("demo site: Learning activity lab", () => {
  let site;
  before(async () => {
    const res = await fetch(demo("site.json"));
    expect(res.ok).to.equal(true);
    site = JSON.parse(await res.text());
  });

  it("is a top level branch with tagged child pages", () => {
    const root = site.items.find((i) => i.id === LAB);
    expect(root.parent).to.equal(null);
    const kids = site.items.filter((i) => i.parent === LAB);
    expect(kids.map((i) => i.title)).to.deep.equal([
      "Questions: choice",
      "Questions: text",
      "Questions: ordering and matching",
      "Question stack",
      "Checklist",
      "Video and audio",
      "Flash cards",
      "Games",
      "My learning",
    ]);
    kids.forEach((k, i) => expect(k.order).to.equal(i));
    const tags = new Set(kids.map((k) => k.metadata.tags).filter(Boolean));
    expect([...tags].sort()).to.deep.equal([
      "cards",
      "checklists",
      "games",
      "media",
      "questions",
    ]);
    // ids stay unique across the whole manifest
    const ids = site.items.map((i) => i.id);
    expect(new Set(ids).size).to.equal(ids.length);
  });

  it("has a page file for every lab item, with stable element ids", async () => {
    const lab = site.items.filter((i) => i.id === LAB || i.parent === LAB);
    for (const item of lab) {
      const res = await fetch(demo(item.location));
      expect(res.ok, item.location).to.equal(true);
      const doc = new DOMParser().parseFromString(
        await res.text(),
        "text/html",
      );
      doc.body
        .querySelectorAll(
          "multiple-choice, true-false-question, short-answer-question, fill-in-the-blanks, sorting-question, matching-question, tagging-question, mark-the-words, bullet-check-list, video-player, audio-player, flash-card, flash-card-set, concept-map-game, concept-runner-game, concept-quest-game, my-learning",
        )
        .forEach((el) => {
          expect(el.id, `${item.location} ${el.tagName}`).to.match(/^lab-/);
        });
    }
    const last = lab[lab.length - 1];
    const page = await (await fetch(demo(last.location))).text();
    expect(page).to.contain('<my-learning id="lab-my-learning" scope="branch"');
  });

  it("game pages carry their demo data as JSON attributes", async () => {
    const games = site.items.find((i) => i.id === `${LAB}-games`);
    const doc = new DOMParser().parseFromString(
      await (await fetch(demo(games.location))).text(),
      "text/html",
    );
    const map = doc.querySelector("concept-map-game");
    expect(JSON.parse(map.getAttribute("nodes")).length).to.be.greaterThan(2);
    const runner = doc.querySelector("concept-runner-game");
    expect(JSON.parse(runner.getAttribute("items")).length).to.be.greaterThan(
      2,
    );
  });
});
