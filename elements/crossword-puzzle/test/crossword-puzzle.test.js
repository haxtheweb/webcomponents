import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import {
  executeServerCommand,
  sendKeys,
  setViewport,
} from "@web/test-runner-commands";
import "../crossword-puzzle.js";
import {
  deviceActor,
  setActorProvider,
} from "@haxtheweb/user-action/lib/xapi.js";

// HTML      1a HTML, 3a FORK, 1d HREF, 2d LINK
// R..I
// E..N
// FORK
const KEY = { "1a": "HTML", "3a": "FORK", "1d": "HREF", "2d": "LINK" };

const make = (attrs = {}) =>
  fixture(
    html`<crossword-puzzle
      question="Web basics mini"
      max-attempts="${attrs.maxAttempts || 0}"
    >
      <input value="HTML" data-clue="Markup language of the web" />
      <input
        value="HREF"
        data-clue="Attribute that holds a link's destination"
      />
      <input value="LINK" data-clue="Element that loads a stylesheet" />
      <input value="FORK" data-clue="Copy a repo to your own account" />
      <p slot="hint">Three of the four start in a corner.</p>
    </crossword-puzzle>`,
  );

async function ready(el) {
  await waitUntil(
    () => el.shadowRoot.querySelectorAll("input[data-at]").length === 12,
    "grid did not render",
  );
  // saved progress is asked for after the answers settle
  await waitUntil(() => el._progressChecked, "progress was not requested");
  await el.updateComplete;
}
const cell = (el, at) => el.shadowRoot.querySelector(`input[data-at="${at}"]`);
const focused = (el) => el.shadowRoot.activeElement;
const at = (el) => focused(el) && focused(el).getAttribute("data-at");
// type the way a keyboard does: the field gets the character, then input
async function type(el, text) {
  for (const ch of text) {
    const input = focused(el);
    input.value = ch;
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    await el.updateComplete;
  }
}
const press = async (el, key) => {
  focused(el).dispatchEvent(
    new KeyboardEvent("keydown", {
      key,
      bubbles: true,
      composed: true,
      cancelable: true,
    }),
  );
  await el.updateComplete;
};
const clue = (el, n) => el.shadowRoot.querySelectorAll("button.xw-clue")[n];
// fill words by clue: { "1a": "HTML" }
async function fill(el, words) {
  const order = ["1a", "3a", "1d", "2d"];
  for (const id of Object.keys(words)) {
    clue(el, order.indexOf(id)).click();
    await el.updateComplete;
    await type(el, words[id]);
  }
}
async function check(el) {
  const events = [];
  const on = (e) => events.push(e.detail);
  el.addEventListener("user-engagement", on);
  await el.checkAnswer();
  await el.updateComplete;
  el.removeEventListener("user-engagement", on);
  return events;
}

describe("crossword-puzzle", () => {
  before(() =>
    setActorProvider(() =>
      deviceActor(
        "4b9f1c1e-0000-4000-8000-00000000000c",
        "https://example.org/",
      ),
    ),
  );
  after(() => setActorProvider(null));

  let el;
  beforeEach(async () => {
    el = await make({ maxAttempts: 3 });
    await ready(el);
  });

  describe("content", () => {
    it("builds the grid from the words and takes the key out of the light DOM", () => {
      expect(el.querySelectorAll("input").length).to.equal(0);
      expect(el.answers.map((a) => a.label)).to.deep.equal([
        "HTML",
        "HREF",
        "LINK",
        "FORK",
      ]);
      expect(el.shadowRoot.querySelectorAll(".xw-blk").length).to.equal(4);
      expect(
        Array.from(el.shadowRoot.querySelectorAll(".xw-num")).map(
          (n) => n.textContent,
        ),
      ).to.deep.equal(["1", "2", "3"]);
      // nothing in the learner view holds an answer
      expect(el.shadowRoot.querySelector(".xw-key")).to.equal(null);
      expect(el.shadowRoot.textContent).to.not.include("HREF");
      expect(el.hasAttribute("answers")).to.equal(false);
    });

    it("saves the same markup back: light DOM round trip", async () => {
      const save = async (source) => {
        const node = source.cloneNode(true);
        node.answers = source.answers;
        await source.haxpreProcessNodeToContent(node);
        return node;
      };
      const node = await save(el);
      const inputs = Array.from(node.querySelectorAll("input:not([slot])"));
      expect(inputs.map((i) => i.getAttribute("value"))).to.deep.equal([
        "HTML",
        "HREF",
        "LINK",
        "FORK",
      ]);
      expect(inputs[1].getAttribute("data-clue")).to.equal(
        "Attribute that holds a link's destination",
      );
      expect(inputs[0].hasAttribute("data-correct")).to.equal(false);
      expect(node.querySelector('[slot="hint"]').textContent).to.include(
        "Three of the four",
      );
      // reload what was saved, save again: identical
      const wrap = document.createElement("div");
      wrap.innerHTML = node.outerHTML;
      const again = wrap.firstElementChild;
      document.body.appendChild(wrap);
      await ready(again);
      const second = await save(again);
      const key = (n) =>
        Array.from(n.children)
          .map((c) => c.outerHTML)
          .join("");
      expect(key(second)).to.equal(key(node));
      wrap.remove();
    });

    it("shows an empty state with no words", async () => {
      const blank = await fixture(
        html`<crossword-puzzle question="Empty"></crossword-puzzle>`,
      );
      await blank.updateComplete;
      expect(blank.shadowRoot.querySelector(".xw-note").textContent).to.include(
        blank.t.noWords,
      );
      await expect(blank).shadowDom.to.be.accessible();
    });
  });

  describe("accessibility", () => {
    it("passes the a11y audit in the default state", async () => {
      await expect(el).shadowDom.to.be.accessible();
    });

    it("passes the a11y audit after a check, with correct, incorrect and missing squares", async () => {
      await fill(el, { "1a": "HTML", "3a": "FOXK" });
      await check(el);
      expect(el.showAnswer).to.equal(true);
      await expect(el).shadowDom.to.be.accessible();
    });

    it("names every square by clue and letter position", () => {
      expect(cell(el, "0,0").getAttribute("aria-label")).to.equal(
        "1 across, letter 1 of 4; 1 down, letter 1 of 4",
      );
      expect(cell(el, "0,2").getAttribute("aria-label")).to.equal(
        "1 across, letter 3 of 4",
      );
      expect(cell(el, "2,3").getAttribute("aria-label")).to.equal(
        "2 down, letter 3 of 4",
      );
      expect(cell(el, "3,3").getAttribute("aria-label")).to.equal(
        "3 across, letter 4 of 4; 2 down, letter 4 of 4",
      );
    });

    it("guards mobile keyboards: one character, no autocorrect or capitalize surprises", () => {
      const input = cell(el, "0,0");
      expect(input.getAttribute("autocomplete")).to.equal("off");
      expect(input.getAttribute("autocapitalize")).to.equal("characters");
      expect(input.getAttribute("autocorrect")).to.equal("off");
      expect(input.getAttribute("spellcheck")).to.equal("false");
      expect(input.getAttribute("inputmode")).to.equal("text");
    });

    it("is one tab stop and shows the active clue in a live region", async () => {
      const stops = () =>
        Array.from(el.shadowRoot.querySelectorAll("input[data-at]")).filter(
          (i) => i.tabIndex === 0,
        );
      expect(stops().length).to.equal(1);
      const live = el.shadowRoot.querySelector(".xw-active");
      expect(live.getAttribute("aria-live")).to.equal("polite");
      expect(live.textContent).to.include(el.t.startHint);
      cell(el, "2,3").focus();
      await el.updateComplete;
      expect(stops().length).to.equal(1);
      expect(stops()[0]).to.equal(cell(el, "2,3"));
      expect(live.textContent.replace(/\s+/g, " ")).to.include(
        "2 Down Element that loads a stylesheet (4)",
      );
      expect(clue(el, 3).getAttribute("aria-current")).to.equal("true");
    });

    it("fits a 360px screen: squares at least 24px, clues under the grid, no page scroll", async () => {
      await setViewport({ width: 360, height: 740 });
      const big = await fixture(
        html`<crossword-puzzle question="Web component vocabulary">
          <input value="component" data-clue="A reusable custom element" />
          <input value="attribute" data-clue="A name and value on a tag" />
          <input value="shadow" data-clue="Private DOM" />
          <input value="slot" data-clue="Placeholder for content" />
          <input value="template" data-clue="Markup not rendered until used" />
          <input value="event" data-clue="Says something happened" />
          <input value="property" data-clue="A value set with JavaScript" />
          <input value="render" data-clue="Returns what an element draws" />
          <input value="style" data-clue="Carries CSS" />
          <input value="import" data-clue="Loads a module" />
        </crossword-puzzle>`,
      );
      await waitUntil(() => big.shadowRoot.querySelector("input[data-at]"));
      await big.updateComplete;
      const doc = document.documentElement;
      expect(doc.scrollWidth).to.be.at.most(globalThis.innerWidth);
      const squares = Array.from(big.shadowRoot.querySelectorAll(".xw-cell"));
      squares.forEach((s) => {
        const box = s.getBoundingClientRect();
        expect(box.width).to.be.at.least(24);
        expect(box.height).to.be.at.least(24);
      });
      const grid = big.shadowRoot.querySelector(".xw-main");
      const clues = big.shadowRoot.querySelector(".xw-clues");
      expect(clues.getBoundingClientRect().top).to.be.at.least(
        grid.getBoundingClientRect().bottom,
      );
      await setViewport({ width: 800, height: 600 });
    });
  });

  describe("interaction", () => {
    it("typing fills one square and moves to the next in the current direction", async () => {
      cell(el, "0,0").focus();
      await el.updateComplete;
      await type(el, "ht");
      expect(cell(el, "0,0").value).to.equal("H");
      expect(cell(el, "0,1").value).to.equal("T");
      expect(at(el)).to.equal("0,2");
      // only one character stays in a square, and non-letters are refused
      await type(el, "?");
      expect(cell(el, "0,2").value).to.equal("");
      expect(at(el)).to.equal("0,2");
      const input = focused(el);
      input.value = "xyz";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      await el.updateComplete;
      expect(cell(el, "0,2").value).to.equal("Z");
      // the last square of a word stays put
      await type(el, "l");
      expect(at(el)).to.equal("0,3");
      await type(el, "q");
      expect(at(el)).to.equal("0,3");
      expect(cell(el, "0,3").value).to.equal("Q");
    });

    it("types with the real keyboard", async () => {
      cell(el, "0,0").focus();
      await sendKeys({ type: "html" });
      await el.updateComplete;
      expect(
        ["0,0", "0,1", "0,2", "0,3"].map((k) => cell(el, k).value).join(""),
      ).to.equal("HTML");
      await sendKeys({ press: "Backspace" });
      await el.updateComplete;
      expect(cell(el, "0,3").value).to.equal("");
    });

    it("arrow keys move between squares and step over black squares", async () => {
      cell(el, "0,0").focus();
      await press(el, "ArrowRight");
      expect(at(el)).to.equal("0,1");
      // nothing below 0,1 until the bottom row
      await press(el, "ArrowDown");
      expect(at(el)).to.equal("3,1");
      await press(el, "ArrowLeft");
      expect(at(el)).to.equal("3,0");
      await press(el, "ArrowUp");
      expect(at(el)).to.equal("2,0");
      expect(el._dir).to.equal("down");
      // at an edge nothing moves
      await press(el, "ArrowLeft");
      expect(at(el)).to.equal("2,0");
      await press(el, "End");
      expect(at(el)).to.equal("3,0");
      await press(el, "Home");
      expect(at(el)).to.equal("0,0");
    });

    it("Backspace clears a square, and on an empty square moves back and clears", async () => {
      cell(el, "0,0").focus();
      await type(el, "ht");
      expect(at(el)).to.equal("0,2");
      await press(el, "Backspace");
      expect(at(el)).to.equal("0,1");
      expect(cell(el, "0,1").value).to.equal("");
      expect(cell(el, "0,0").value).to.equal("H");
      await press(el, "ArrowLeft");
      await press(el, "Backspace");
      expect(at(el)).to.equal("0,0");
      expect(cell(el, "0,0").value).to.equal("");
      // the first square of a word has nowhere to go back to
      await press(el, "Backspace");
      expect(at(el)).to.equal("0,0");
    });

    it("a second activation of a crossing square switches across and down", async () => {
      const corner = cell(el, "0,0");
      const tap = async (input) => {
        input.dispatchEvent(
          new PointerEvent("pointerdown", { bubbles: true, composed: true }),
        );
        input.focus();
        input.click();
        await el.updateComplete;
      };
      await tap(corner);
      expect(el._dir).to.equal("across");
      expect(el._activeWord()).to.equal(0);
      await tap(corner);
      expect(el._dir).to.equal("down");
      expect(el.shadowRoot.querySelectorAll(".xw-in-word").length).to.equal(4);
      expect(
        cell(el, "3,0").parentNode.classList.contains("xw-in-word"),
      ).to.equal(true);
      await tap(corner);
      expect(el._dir).to.equal("across");
      // Space does the same from the keyboard
      await press(el, " ");
      expect(el._dir).to.equal("down");
      // a square in one word only has nothing to switch to
      await tap(cell(el, "0,1"));
      expect(el._dir).to.equal("across");
      await tap(cell(el, "0,1"));
      expect(el._dir).to.equal("across");
    });

    it("choosing a clue jumps to the word's first square and highlights the word", async () => {
      clue(el, 3).click();
      await el.updateComplete;
      expect(at(el)).to.equal("0,3");
      expect(el._dir).to.equal("down");
      const lit = Array.from(el.shadowRoot.querySelectorAll(".xw-in-word")).map(
        (c) => c.querySelector("input").getAttribute("data-at"),
      );
      expect(lit).to.deep.equal(["0,3", "1,3", "2,3", "3,3"]);
      expect(clue(el, 3).getAttribute("aria-current")).to.equal("true");
      expect(clue(el, 0).hasAttribute("aria-current")).to.equal(false);
    });

    it("shows nothing about correctness until Check", async () => {
      await fill(el, { "1a": "HTML", "3a": "XXXX" });
      const count = (sel) => el.shadowRoot.querySelectorAll(sel).length;
      expect(count(".xw-cell[data-status]")).to.equal(0);
      expect(count(".xw-mark")).to.equal(0);
      expect(count(".option-status")).to.equal(0);
      expect(cell(el, "3,1").getAttribute("aria-invalid")).to.equal("false");
    });
  });

  describe("check and scoring", () => {
    it("marks each square correct, incorrect or missing, with a word for assistive tech", async () => {
      await fill(el, { "1a": "HTML", "3a": "FOXK" });
      await check(el);
      const status = (k) => cell(el, k).parentNode.getAttribute("data-status");
      expect(status("0,1")).to.equal("correct");
      expect(status("3,2")).to.equal("incorrect");
      // an empty square is missing, not incorrect
      expect(status("1,0")).to.equal("missing");
      expect(cell(el, "1,0").getAttribute("aria-invalid")).to.equal("false");
      expect(cell(el, "3,2").getAttribute("aria-invalid")).to.equal("true");
      expect(cell(el, "0,1").getAttribute("aria-label")).to.equal(
        "1 across, letter 2 of 4. Correct",
      );
      expect(cell(el, "3,2").getAttribute("aria-label")).to.include(
        "Incorrect",
      );
      expect(cell(el, "1,0").getAttribute("aria-label")).to.include("Missing");
      expect(cell(el, "1,0").getAttribute("title")).to.equal("Missing");
      // every status has its own icon and line style
      const icon = (k) =>
        cell(el, k).parentNode.querySelector(".xw-mark").getAttribute("icon");
      expect(new Set([icon("0,1"), icon("3,2"), icon("1,0")]).size).to.equal(3);
      const line = (k) => getComputedStyle(cell(el, k)).borderTopStyle;
      expect(line("0,1")).to.equal("solid");
      expect(line("3,2")).to.equal("dotted");
      // squares are read only while the result shows
      expect(cell(el, "0,0").readOnly).to.equal(true);
      // each clue says how its word did, and the result is spoken
      const words = Array.from(
        el.shadowRoot.querySelectorAll("button.xw-clue .option-status"),
      ).map((s) => s.textContent.trim());
      expect(words).to.deep.equal([
        "Correct",
        "Incorrect",
        "Incorrect",
        "Incorrect",
      ]);
      const live = el.shadowRoot.querySelector("#feedback");
      expect(live.getAttribute("role")).to.equal("status");
      expect(live.textContent).to.include("1 of 4 words correct");
      expect(el.isCorrect()).to.equal(false);
      // the author's hint shows after a wrong check
      expect(el.shadowRoot.querySelector('slot[name="hint"]')).to.exist;
    });

    it("is solved when every placed word is correct, and the chip shows done", async () => {
      await fill(el, KEY);
      expect(el.isCorrect()).to.equal(true);
      const events = await check(el);
      expect(events.length).to.equal(1);
      expect(events[0].resultSuccess).to.equal(true);
      expect(
        el.shadowRoot.querySelectorAll(".xw-cell:not([data-status='correct'])")
          .length,
      ).to.equal(0);
      expect(
        el.shadowRoot.querySelector(".shell").getAttribute("data-status"),
      ).to.equal("correct");
      expect(el.shadowRoot.querySelector(".ddd-block-chip[data-done]")).to
        .exist;
    });

    it("keeps letters on Try again after a wrong check and clears a solved grid", async () => {
      await fill(el, { "1a": "HTML", "3a": "FOXK" });
      await check(el);
      el.resetAnswer();
      await el.updateComplete;
      expect(el.showAnswer).to.equal(false);
      expect(cell(el, "0,0").value).to.equal("H");
      expect(cell(el, "0,0").readOnly).to.equal(false);
      await fill(el, KEY);
      await check(el);
      expect(el.isCorrect()).to.equal(true);
      el.resetAnswer();
      await el.updateComplete;
      expect(el.guessCount()).to.equal(0);
      expect(cell(el, "0,0").value).to.equal("");
    });

    it("counts attempts and stops checking when they are used up", async () => {
      const two = await make({ maxAttempts: 2 });
      await ready(two);
      await fill(two, { "1a": "HXML" });
      let events = await check(two);
      expect(events[0].statement.result.completion).to.equal(false);
      two.resetAnswer();
      await two.updateComplete;
      events = await check(two);
      expect(two.attempts).to.equal(2);
      expect(events[0].statement.result.completion).to.equal(true);
      expect(events[0].statement.result.success).to.equal(false);
      two.resetAnswer();
      await two.updateComplete;
      events = await check(two);
      expect(events.length).to.equal(0);
      expect(two.attempts).to.equal(2);
    });
  });

  describe("xAPI", () => {
    it("declares its vocabulary", () => {
      const v = el.constructor.xapiVocabulary;
      expect(v.tag).to.equal("crossword-puzzle");
      expect(v.verbs).to.deep.equal(["answered"]);
      expect(v.interactionType).to.equal("fill-in");
      expect(v.countsTowardCompletion).to.equal(true);
    });

    it("sends a conformant fill-in statement for a partly right answer", async () => {
      await fill(el, { "1a": "HTML", "3a": "FOXK" });
      const events = await check(el);
      expect(events.length).to.equal(1);
      expect(events[0].activityDisplay).to.equal("answered");
      expect(events[0].objectName).to.equal(el.quizName);
      expect(events[0].resultSuccess).to.equal(false);
      const s = events[0].statement;
      expect(s.verb.id).to.match(/answered$/);
      expect(s.object.definition.interactionType).to.equal("fill-in");
      expect(s.object.definition.correctResponsesPattern).to.deep.equal([
        "HTML[,]FORK[,]HREF[,]LINK",
      ]);
      // words in clue order; _ is an empty square inside a word
      expect(s.result.response).to.equal("HTML[,]FOXK[,]H__F[,]L__K");
      expect(s.result.success).to.equal(false);
      expect(s.result.completion).to.equal(false);
      expect(s.result.score).to.include({ raw: 1, max: 4, min: 0 });
      const r = await executeServerCommand("xapi-validate", s);
      expect(r.errors).to.deep.equal([]);
    });

    it("sends a conformant statement when solved, with a stable activity id", async () => {
      await fill(el, KEY);
      const events = await check(el);
      const s = events[0].statement;
      expect(s.result.response).to.equal("HTML[,]FORK[,]HREF[,]LINK");
      expect(s.result.success).to.equal(true);
      expect(s.result.completion).to.equal(true);
      expect(s.result.score).to.include({ raw: 4, max: 4 });
      const r = await executeServerCommand("xapi-validate", s);
      expect(r.errors).to.deep.equal([]);
      // the same puzzle on another load has the same id
      const twin = await make();
      await ready(twin);
      el.remove();
      await fill(twin, { "1a": "HTML" });
      const again = await check(twin);
      expect(again[0].statement.object.id).to.equal(s.object.id);
      const r2 = await executeServerCommand(
        "xapi-validate",
        again[0].statement,
      );
      expect(r2.errors).to.deep.equal([]);
    });

    it("sends nothing while HAX is editing", async () => {
      await fill(el, KEY);
      el.haxeditModeChanged(true);
      await el.updateComplete;
      let events = await check(el);
      expect(events.length).to.equal(0);
      expect(el.attempts).to.equal(0);
      el.haxeditModeChanged(false);
      // the HAX store says editing even when the hook has not run
      const before = globalThis.HaxStore;
      globalThis.HaxStore = {
        requestAvailability: () => ({ editMode: true }),
      };
      el._letters = { "0,0": "H" };
      events = await check(el);
      globalThis.HaxStore = before;
      expect(events.length).to.equal(0);
    });
  });

  describe("learner record", () => {
    it("restores the entered letters from a saved response", async () => {
      const ok = el.restoreLearnerResponse("HTML[,]FOXK[,]H__F[,]L__K");
      expect(ok).to.equal(true);
      await el.updateComplete;
      expect(cell(el, "0,2").value).to.equal("M");
      expect(cell(el, "3,2").value).to.equal("X");
      expect(cell(el, "1,0").value).to.equal("");
      expect(el.learnerResponse()).to.equal("HTML[,]FOXK[,]H__F[,]L__K");
      el.forgetLearnerResponse();
      await el.updateComplete;
      expect(cell(el, "0,2").value).to.equal("");
    });

    it("ignores a response that no longer fits the puzzle", () => {
      // a different number of clues
      expect(el.restoreLearnerResponse("HTML[,]FORK")).to.equal(false);
      // a word whose length changed is skipped, the rest is kept
      expect(el.restoreLearnerResponse("HTMLX[,][,][,]LINK")).to.equal(true);
      expect(el._letters["0,0"]).to.equal(undefined);
      expect(el._letters["3,3"]).to.equal("K");
      expect(el.restoreLearnerResponse("")).to.equal(false);
      expect(el.restoreLearnerResponse(null)).to.equal(false);
      expect(el.restoreLearnerResponse("[,][,][,]")).to.equal(false);
    });

    it("resumes from the learner record when the page loads", async () => {
      const give = (e) => {
        if (e.detail.tag === "crossword-puzzle") {
          e.detail.record = {
            status: "incorrect",
            attempts: 1,
            response: "HTML[,][,]H__F[,]",
          };
        }
      };
      globalThis.addEventListener("learner-progress-request", give);
      const back = await make({ maxAttempts: 3 });
      await ready(back);
      globalThis.removeEventListener("learner-progress-request", give);
      await back.updateComplete;
      expect(cell(back, "0,3").value).to.equal("L");
      expect(cell(back, "3,0").value).to.equal("F");
      expect(back.attempts).to.equal(1);
      expect(back.showAnswer).to.equal(true);
      // none of it reaches edit mode
      back.haxeditModeChanged(true);
      await back.updateComplete;
      expect(back.guessCount()).to.equal(0);
      expect(back.showAnswer).to.equal(false);
      expect(back.attempts).to.equal(0);
    });
  });

  describe("HAX", () => {
    it("implements the question haxHooks", () => {
      const hooks = el.haxHooks();
      [
        "editModeChanged",
        "activeElementChanged",
        "preProcessNodeToContent",
        "preProcessInsertContent",
        "inlineContextMenu",
      ].forEach((name) => {
        expect(typeof el[hooks[name]]).to.equal("function");
      });
    });

    it("edit mode drops learner state and shows the key instead of fields", async () => {
      await fill(el, { "1a": "HXML" });
      await check(el);
      el.haxeditModeChanged(true);
      await el.updateComplete;
      expect(el.guessCount()).to.equal(0);
      expect(el.showAnswer).to.equal(false);
      expect(el.shadowRoot.querySelector("input[data-at]")).to.equal(null);
      expect(
        Array.from(el.shadowRoot.querySelectorAll(".xw-key"))
          .map((k) => k.textContent)
          .join(""),
      ).to.equal("HTMLRIENFORK");
      expect(
        el.shadowRoot.querySelector(".xw-clue-answer").textContent,
      ).to.equal("HTML");
      // saving from edit mode writes only the authored words
      const node = el.cloneNode(true);
      node.answers = el.answers;
      await el.haxpreProcessNodeToContent(node);
      expect(node.querySelectorAll("input:not([slot])").length).to.equal(4);
      expect(node.querySelector("[data-at]")).to.equal(null);
      el.haxeditModeChanged(false);
      await el.updateComplete;
      expect(el.shadowRoot.querySelectorAll("input[data-at]").length).to.equal(
        12,
      );
      expect(el.shadowRoot.querySelector(".xw-key")).to.equal(null);
    });

    it("lists words it could not place for the author only", async () => {
      const odd = await fixture(
        html`<crossword-puzzle question="Odd one out">
          <input value="HTML" data-clue="Markup" />
          <input value="LINK" data-clue="Loads a stylesheet" />
          <input value="zzz" data-clue="Sleepy" />
        </crossword-puzzle>`,
      );
      await waitUntil(() => odd.shadowRoot.querySelector("input[data-at]"));
      expect(odd._layout.unplaced.map((u) => u.word)).to.deep.equal(["zzz"]);
      expect(odd.shadowRoot.querySelector(".xw-unplaced")).to.equal(null);
      expect(odd.shadowRoot.querySelectorAll("button.xw-clue").length).to.equal(
        2,
      );
      // solved = every placed word, the left out word does not count
      odd.restoreLearnerResponse(
        odd._layout.words.map((w) => w.text).join("[,]"),
      );
      expect(odd.isCorrect()).to.equal(true);
      odd.haxeditModeChanged(true);
      await odd.updateComplete;
      const note = odd.shadowRoot.querySelector(".xw-unplaced");
      expect(note.textContent).to.include("zzz");
      expect(note.textContent).to.include(odd.t.reasonNofit);
      await expect(odd).shadowDom.to.be.accessible();
    });

    it("adds and removes words from the block menu and rebuilds the grid", async () => {
      const menu = {};
      el.haxinlineContextMenu(menu);
      expect(menu.ceButtons.map((b) => b.callback)).to.deep.equal([
        "haxClickInlineAdd",
        "haxClickInlineRemove",
        "haxToggleEdit",
      ]);
      el.haxeditModeChanged(true);
      el.haxClickInlineAdd();
      await waitUntil(
        () => el.answers.length === 5 && el.answers[4].order === 4,
      );
      expect(el.answers[4].label).to.equal(el.t.newWord);
      el.haxClickInlineRemove();
      el.haxClickInlineRemove();
      await waitUntil(() => el._layout.words.length === 3);
      expect(el._layout.words.map((w) => w.text).sort()).to.deep.equal([
        "HREF",
        "HTML",
        "LINK",
      ]);
    });

    it("takes the accent-color attribute through the DDD accent map", async () => {
      const tint = () =>
        getComputedStyle(el).getPropertyValue("--ddd-accent-color").trim();
      expect(tint()).to.equal("");
      el.setAttribute("accent-color", "teal");
      await el.updateComplete;
      expect(el.accentColor).to.equal("teal");
      expect(tint()).to.not.equal("");
    });
  });

  describe("dark mode", () => {
    const root = document.documentElement;
    const body = document.body;
    let previous;
    beforeEach(() => {
      previous = {
        scheme: root.style.colorScheme,
        background: body.style.backgroundColor,
        color: body.style.color,
      };
      // light-dark() resolves against the used color-scheme. The explicit
      // Canvas background is needed because axe assumes a white page when
      // none is set, which would hide dark mode contrast failures.
      root.style.colorScheme = "dark";
      body.style.backgroundColor = "Canvas";
      body.style.color = "CanvasText";
    });
    afterEach(() => {
      root.style.colorScheme = previous.scheme;
      body.style.backgroundColor = previous.background;
      body.style.color = previous.color;
    });

    it("passes the a11y audit in dark mode, before and after a check", async () => {
      await expect(el).shadowDom.to.be.accessible();
      await fill(el, { "1a": "HTML", "3a": "FOXK" });
      await check(el);
      await expect(el).shadowDom.to.be.accessible();
    });
  });
});
