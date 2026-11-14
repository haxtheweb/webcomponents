import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import { executeServerCommand, setViewport } from "@web/test-runner-commands";
import "../identify-hotspots.js";
import {
  componentId,
  deviceActor,
  setActorProvider,
} from "@haxtheweb/user-action/lib/xapi.js";
import {
  normalizeRegion,
  regionContains,
  safeImageSrc,
} from "../lib/hotspot-regions.js";

const SCENE = new URL("../lib/workshop-scene.svg", import.meta.url).href;
const ALT = "A workshop with a bench, an outlet over a puddle and a heater.";
const CORD = componentId("Frayed power cord");
const WATER = componentId("Water by the outlet");
const PAINT = componentId("Paint can beside the heater");
const BENCH = componentId("Workbench");
// a point inside each region, and one inside nothing
const AT = {
  cord: [31, 62.8],
  water: [54, 78],
  paint: [85.5, 70.4],
  bench: [24, 49.5],
  nothing: [50, 10],
};

const make = (attrs = {}) =>
  fixture(
    html`<identify-hotspots
      question="Spot the three hazards"
      media-title="Workshop floor"
      src="${SCENE}"
      alt="${ALT}"
      max-misses="${attrs.maxMisses === undefined ? 4 : attrs.maxMisses}"
      max-attempts="${attrs.maxAttempts || 0}"
    >
      <input
        type="checkbox"
        value="Frayed power cord"
        data-correct="true"
        data-x="25.5"
        data-y="56.4"
        data-width="11"
        data-height="12.8"
      />
      <input
        type="checkbox"
        value="Water by the outlet"
        data-correct="true"
        data-x="43"
        data-y="69.2"
        data-width="22"
        data-height="17.6"
      />
      <input
        type="checkbox"
        value="Paint can beside the heater"
        data-correct="true"
        data-x="79.5"
        data-y="62.4"
        data-width="12"
        data-height="16"
      />
      <input
        type="checkbox"
        value="Workbench"
        data-x="5"
        data-y="44"
        data-width="38"
        data-height="11"
      />
    </identify-hotspots>`,
  );

async function ready(el) {
  await waitUntil(() => el.answers && el.answers.length === 4, "answers load");
  await waitUntil(() => el._progressChecked === true, "progress asked for");
  await el.updateComplete;
  const img = el.shadowRoot.querySelector("#hs-img");
  await waitUntil(() => img.complete && img.naturalWidth > 0, "image loads");
}
const $ = (el, sel) => el.shadowRoot.querySelector(sel);
const $$ = (el, sel) => Array.from(el.shadowRoot.querySelectorAll(sel));
// simple-toolbar-button replaces click(), so send the event a pointer would
const press = (node) =>
  node.dispatchEvent(
    new MouseEvent("click", { bubbles: true, composed: true }),
  );
const settle = async (el) => {
  await waitUntil(() => el.showAnswer === true, "attempt ends");
  await el.updateComplete;
};
const key = (el, k, shiftKey = false) => {
  $(el, "#stage").dispatchEvent(
    new KeyboardEvent("keydown", { key: k, shiftKey, bubbles: true }),
  );
  return el.updateComplete;
};

describe("identify-hotspots", () => {
  before(() =>
    setActorProvider(() =>
      deviceActor(
        "4b9f1c1e-0000-4000-8000-0000000000b7",
        "https://example.org/",
      ),
    ),
  );
  after(() => setActorProvider(null));

  let el;
  beforeEach(async () => {
    el = await make();
    await ready(el);
  });

  describe("content", () => {
    it("reads the answers from light DOM inputs and removes them", () => {
      expect(el.querySelectorAll("input").length).to.equal(0);
      expect(el.answers.map((a) => a.label)).to.deep.equal([
        "Frayed power cord",
        "Water by the outlet",
        "Paint can beside the heater",
        "Workbench",
      ]);
      expect(el.answers[0]).to.include({
        x: 25.5,
        y: 56.4,
        width: 11,
        height: 12.8,
        correct: true,
      });
      expect(el.answers[3].correct).to.equal(false);
    });

    it("keeps the title, the alt and the question as three separate things", async () => {
      expect($(el, "#hs-title").textContent.trim()).to.equal("Workshop floor");
      expect($(el, "#hs-img").getAttribute("alt")).to.equal(ALT);
      expect($(el, "#question-heading").textContent.trim()).to.equal(
        "Spot the three hazards",
      );
      // no title: nothing is made up from the alt
      el.mediaTitle = "";
      await el.updateComplete;
      expect($(el, "#hs-title")).to.equal(null);
      expect($(el, ".shell").textContent).to.not.include(ALT);
      expect($(el, "#stage").getAttribute("aria-label")).to.equal(
        el.t.stageLabel,
      );
    });

    it("saves the same markup it loaded, with no runtime markup", async () => {
      await el.probe(...AT.cord);
      await el.probe(...AT.nothing);
      const node = el.cloneNode(true);
      node.answers = el.answers;
      await el.haxpreProcessNodeToContent(node);
      const inputs = Array.from(node.querySelectorAll("input:not([slot])"));
      expect(inputs.length).to.equal(4);
      expect(
        inputs.map((i) =>
          [
            "value",
            "data-correct",
            "data-x",
            "data-y",
            "data-width",
            "data-height",
          ].map((n) => (n === "value" ? i.value : i.getAttribute(n))),
        ),
      ).to.deep.equal([
        ["Frayed power cord", "true", "25.5", "56.4", "11", "12.8"],
        ["Water by the outlet", "true", "43", "69.2", "22", "17.6"],
        ["Paint can beside the heater", "true", "79.5", "62.4", "12", "16"],
        ["Workbench", null, "5", "44", "38", "11"],
      ]);
      expect(node.querySelector("[class^='hs-']")).to.equal(null);
      // reload from the saved markup: the same key comes back
      const again = await fixture(node.outerHTML);
      await ready(again);
      expect(again.answers).to.deep.equal(el.answers);
      const second = again.cloneNode(true);
      second.answers = again.answers;
      await again.haxpreProcessNodeToContent(second);
      expect(
        Array.from(second.querySelectorAll("input")).map((i) => i.outerHTML),
      ).to.deep.equal(inputs.map((i) => i.outerHTML));
    });

    it("never shows where an unfound hotspot is", () => {
      expect($$(el, ".hs-region").length).to.equal(0);
      expect($$(el, ".hs-badge").length).to.equal(0);
      // hidden hotspots are not tab stops: the picture is the only one
      expect($$(el, ".shell-body [tabindex='0']").length).to.equal(1);
    });
  });

  describe("accessibility", () => {
    it("passes the a11y audit before answering", async () => {
      await expect(el).shadowDom.to.be.accessible();
    });

    it("passes the a11y audit with found, missed and revealed marks", async () => {
      await el.probe(...AT.cord);
      for (let i = 0; i < 4; i++) {
        await el.probe(...AT.nothing);
      }
      await settle(el);
      await expect(el).shadowDom.to.be.accessible();
      press($(el, "#reveal"));
      await waitUntil(() => el._revealed);
      await el.updateComplete;
      await expect(el).shadowDom.to.be.accessible();
    });

    it("passes the a11y audit when everything is found", async () => {
      await el.probe(...AT.cord);
      await el.probe(...AT.water);
      await el.probe(...AT.paint);
      await settle(el);
      await expect(el).shadowDom.to.be.accessible();
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
        root.style.colorScheme = "dark";
        body.style.backgroundColor = "Canvas";
        body.style.color = "CanvasText";
      });
      afterEach(() => {
        root.style.colorScheme = previous.scheme;
        body.style.backgroundColor = previous.background;
        body.style.color = previous.color;
      });

      it("passes the a11y audit in dark mode, before and after answering", async () => {
        await expect(el).shadowDom.to.be.accessible();
        await el.probe(...AT.cord);
        for (let i = 0; i < 4; i++) {
          await el.probe(...AT.nothing);
        }
        await settle(el);
        press($(el, "#reveal"));
        await waitUntil(() => el._revealed);
        await el.updateComplete;
        await expect(el).shadowDom.to.be.accessible();
      });
    });

    it("the picture is a named, described keyboard target", () => {
      const stage = $(el, "#stage");
      expect(stage.getAttribute("tabindex")).to.equal("0");
      expect(stage.getAttribute("role")).to.equal("application");
      expect(stage.getAttribute("aria-labelledby")).to.equal("hs-title");
      expect(stage.hasAttribute("aria-label")).to.equal(false);
      expect(stage.getAttribute("aria-describedby")).to.equal("hs-img hs-keys");
      expect($(el, "#hs-note").getAttribute("aria-live")).to.equal("polite");
    });

    it("has no page scroll at 360px", async () => {
      await setViewport({ width: 360, height: 740 });
      try {
        await el.updateComplete;
        await el.probe(...AT.cord);
        await el.probe(...AT.nothing);
        await el.updateComplete;
        expect(document.documentElement.scrollWidth).to.be.at.most(
          globalThis.innerWidth,
        );
        const right = el.getBoundingClientRect().right;
        $$(el, ".shell *").forEach((node) => {
          // sr-only text is clipped on purpose
          if (node.closest(".sr-only") || node.closest(".hs-marks")) return;
          expect(
            Math.floor(node.getBoundingClientRect().right),
            node.className || node.tagName,
          ).to.be.at.most(Math.ceil(right));
        });
        // positions are percentages, so a mark stays on its spot
        const stage = $(el, "#stage").getBoundingClientRect();
        const badge = $(el, ".hs-badge").getBoundingClientRect();
        const cx =
          ((badge.left + badge.width / 2 - stage.left) / stage.width) * 100;
        expect(Math.abs(cx - 31)).to.be.below(1);
      } finally {
        await setViewport({ width: 800, height: 600 });
      }
    });
  });

  describe("finding", () => {
    it("a hit marks the hotspot found, numbers it and says its name", async () => {
      await el.probe(...AT.water);
      await el.updateComplete;
      expect(el._foundIds()).to.deep.equal([WATER]);
      expect(el._misses.length).to.equal(0);
      const region = $(el, ".hs-region");
      expect(region.getAttribute("data-state")).to.equal("found");
      expect(getComputedStyle(region).borderTopStyle).to.equal("solid");
      expect($(el, ".hs-badge").textContent.trim()).to.equal("1");
      expect($(el, ".hs-badge simple-icon-lite").getAttribute("icon")).to.equal(
        "icons:check",
      );
      const note = $(el, "#hs-note");
      expect(note.getAttribute("data-kind")).to.equal("correct");
      expect(note.textContent.replace(/\s+/g, " ").trim()).to.equal(
        "Found: Water by the outlet.",
      );
      expect($(el, ".hs-count").textContent.trim()).to.equal("1 of 3 found");
      expect($(el, ".hs-results").textContent).to.include(
        "Water by the outlet",
      );
      expect(el.showAnswer).to.equal(false);
    });

    it("anything else is a miss, marked with a cross where it landed", async () => {
      await el.probe(...AT.nothing);
      await el.updateComplete;
      expect(el._misses).to.deep.equal([{ x: 50, y: 10 }]);
      const miss = $(el, ".hs-miss");
      expect(miss.getAttribute("style")).to.equal("left:50%;top:10%");
      expect(getComputedStyle(miss).borderTopStyle).to.equal("dotted");
      expect(
        miss.querySelector("simple-icon-lite").getAttribute("icon"),
      ).to.equal("icons:close");
      const note = $(el, "#hs-note");
      expect(note.getAttribute("data-kind")).to.equal("incorrect");
      expect(note.textContent.replace(/\s+/g, " ").trim()).to.equal(
        "Miss: Nothing to find at 50% across, 10% down.",
      );
      expect(
        $(el, ".hs-misses").textContent.replace(/\s+/g, " ").trim(),
      ).to.equal("0 of 3 found Misses: 1 of 4");
      // a named decoy is a miss that says what it was
      await el.probe(...AT.bench);
      await el.updateComplete;
      expect($(el, "#hs-note").textContent).to.include(
        "Workbench is not one to find.",
      );
      // so is a hotspot already found
      await el.probe(...AT.cord);
      await el.probe(...AT.cord);
      await el.updateComplete;
      expect(el._foundIds()).to.deep.equal([CORD]);
      expect(el._misses.length).to.equal(3);
      expect($(el, "#hs-note").textContent).to.include(
        "Frayed power cord was already found.",
      );
    });

    it("a real click probes where the pointer is", async () => {
      const rect = $(el, "#stage").getBoundingClientRect();
      const click = (p) =>
        $(el, "#stage").dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            composed: true,
            clientX: rect.left + (rect.width * p[0]) / 100,
            clientY: rect.top + (rect.height * p[1]) / 100,
          }),
        );
      click(AT.paint);
      click(AT.nothing);
      await el.updateComplete;
      expect(el._foundIds()).to.deep.equal([PAINT]);
      expect(el._misses.length).to.equal(1);
    });

    it("the ellipse, not its box, is the target", async () => {
      // the top left corner of the water box is outside its ellipse
      await el.probe(43.5, 69.7);
      expect(el._foundIds()).to.deep.equal([]);
      expect(el._misses.length).to.equal(1);
    });

    it("finding every hotspot ends the attempt as correct", async () => {
      await el.probe(...AT.cord);
      await el.probe(...AT.nothing);
      await el.probe(...AT.water);
      await el.probe(...AT.paint);
      await settle(el);
      expect(el.isCorrect()).to.equal(true);
      expect(el.attempts).to.equal(1);
      expect($(el, ".shell").getAttribute("data-status")).to.equal("correct");
      expect($(el, "#reveal")).to.equal(null);
      expect(
        $(el, ".feedback").textContent.replace(/\s+/g, " ").trim(),
      ).to.equal("3 of 3 found. Misses: 1 of 4.");
      // the picture stops being a control
      expect($(el, "#stage").hasAttribute("tabindex")).to.equal(false);
      await el.probe(...AT.nothing);
      expect(el._misses.length).to.equal(1);
    });

    it("the last miss ends the attempt; revealing uses the revealed status, never incorrect", async () => {
      await el.probe(...AT.cord);
      for (let i = 0; i < 4; i++) {
        await el.probe(...AT.nothing);
      }
      await settle(el);
      expect(el.isCorrect()).to.equal(false);
      expect($(el, ".shell").getAttribute("data-status")).to.equal("incorrect");
      expect($(el, "#hs-note").textContent).to.include(el.t.lastMiss);
      const reveal = $(el, "#reveal");
      expect(reveal.getAttribute("label")).to.equal("Show what I missed");
      press(reveal);
      await waitUntil(() => el._revealed);
      await el.updateComplete;
      const revealed = $$(el, ".hs-region[data-state='revealed']");
      expect(revealed.length).to.equal(2);
      revealed.forEach((r) => {
        const cs = getComputedStyle(r);
        expect(cs.borderTopStyle).to.equal("dashed");
        const found = getComputedStyle($(el, ".hs-region[data-state='found']"));
        const miss = getComputedStyle($(el, ".hs-miss"));
        expect(cs.borderTopColor).to.not.equal(miss.borderTopColor);
        expect(cs.borderTopColor).to.not.equal(found.borderTopColor);
      });
      expect(
        $$(el, ".hs-badge[data-state='revealed'] simple-icon-lite").map((i) =>
          i.getAttribute("icon"),
        ),
      ).to.deep.equal(["icons:visibility", "icons:visibility"]);
      const note = $(el, "#hs-note");
      expect(note.getAttribute("data-kind")).to.equal("revealed");
      expect(note.textContent.replace(/\s+/g, " ")).to.include(
        "Revealed: Dashed outlines show what you missed: Water by the outlet, Paint can beside the heater.",
      );
      expect(
        $$(el, ".hs-results li").map((li) => li.getAttribute("data-state")),
      ).to.deep.equal(["found", "revealed", "revealed"]);
      expect($(el, "#reveal")).to.equal(null);
      // revealing does not change the answer
      expect(el._foundIds()).to.deep.equal([CORD]);
    });

    it("try again starts a clean attempt", async () => {
      for (let i = 0; i < 4; i++) {
        await el.probe(...AT.nothing);
      }
      await settle(el);
      press($(el, "#reset"));
      await waitUntil(() => el.showAnswer === false);
      await el.updateComplete;
      expect(el._misses.length).to.equal(0);
      expect(el._found.length).to.equal(0);
      expect($$(el, ".hs-miss").length).to.equal(0);
      expect($(el, "#stage").getAttribute("tabindex")).to.equal("0");
    });

    it("max-misses 0 is unlimited and ends with Finish", async () => {
      const free = await make({ maxMisses: 0 });
      await ready(free);
      expect($(free, "#check").hasAttribute("disabled")).to.equal(true);
      for (let i = 0; i < 6; i++) {
        await free.probe(...AT.nothing);
      }
      await free.probe(...AT.cord);
      await free.updateComplete;
      expect(free.showAnswer).to.equal(false);
      expect(
        $(free, ".hs-misses").textContent.replace(/\s+/g, " ").trim(),
      ).to.equal("1 of 3 found Misses: 6");
      const finish = $(free, "#check");
      expect(finish.getAttribute("label")).to.equal("Finish");
      expect(finish.hasAttribute("disabled")).to.equal(false);
      await free.checkAnswer();
      await settle(free);
      expect(free.isCorrect()).to.equal(false);
      expect(free.learnerScore()).to.deep.equal({ raw: 1, max: 3 });
    });

    it("stops when the attempts are used up", async () => {
      const one = await make({ maxAttempts: 1 });
      await ready(one);
      for (let i = 0; i < 4; i++) {
        await one.probe(...AT.nothing);
      }
      await settle(one);
      expect(one.attemptsExhausted()).to.equal(true);
      expect($(one, "#reset").hasAttribute("hidden")).to.equal(true);
    });
  });

  describe("keyboard", () => {
    it("arrow keys move the crosshair, Shift moves further, Enter and Space probe", async () => {
      const stage = $(el, "#stage");
      stage.focus();
      expect(el._cross).to.deep.equal({ x: 50, y: 50 });
      await key(el, "ArrowRight");
      await key(el, "ArrowDown");
      expect(el._cross).to.deep.equal({ x: 52, y: 52 });
      expect(stage.classList.contains("hs-cross-on")).to.equal(true);
      const cross = $(el, ".hs-cross");
      expect(getComputedStyle(cross).display).to.equal("block");
      expect(cross.getAttribute("style")).to.equal("left:52%;top:52%");
      await key(el, "ArrowDown", true);
      await key(el, "ArrowDown", true);
      await key(el, "ArrowDown");
      await key(el, "ArrowDown");
      await key(el, "ArrowDown");
      // 52, 78: inside the water
      await key(el, "Enter");
      expect(el._foundIds()).to.deep.equal([WATER]);
      await key(el, "ArrowUp", true);
      await key(el, "ArrowLeft", true);
      await key(el, " ");
      expect(el._misses).to.deep.equal([{ x: 42, y: 68 }]);
      // the edges hold it
      for (let i = 0; i < 12; i++) {
        await key(el, "ArrowLeft", true);
      }
      expect(el._cross.x).to.equal(0);
    });

    it("keys the crosshair uses do not scroll the page; others pass through", () => {
      const fire = (k) => {
        const e = new KeyboardEvent("keydown", {
          key: k,
          bubbles: true,
          cancelable: true,
        });
        $(el, "#stage").dispatchEvent(e);
        return e.defaultPrevented;
      };
      expect(fire("ArrowDown")).to.equal(true);
      expect(fire(" ")).to.equal(true);
      expect(fire("Tab")).to.equal(false);
    });

    it("the crosshair has a light and a dark stroke so it reads on any picture", async () => {
      await key(el, "ArrowRight");
      const cs = getComputedStyle($(el, ".hs-cross"));
      expect(cs.borderTopColor).to.not.equal(cs.outlineColor);
      expect(cs.outlineStyle).to.equal("solid");
      expect(parseFloat(cs.borderTopWidth)).to.be.at.least(2);
    });

    it("the directions explain the keyboard path and the miss limit", async () => {
      const toggle = $(el, "#directions-toggle");
      toggle.click();
      await el.updateComplete;
      const text = $(el, "#directions").textContent.replace(/\s+/g, " ");
      expect($(el, "#directions").hasAttribute("hidden")).to.equal(false);
      expect(text).to.include("There are 3 to find.");
      expect(text).to.include("arrow keys");
      expect(text).to.include("You can miss 4 times");
    });
  });

  describe("xAPI", () => {
    it("declares its vocabulary", () => {
      const v = el.constructor.xapiVocabulary;
      expect(v.tag).to.equal("identify-hotspots");
      expect(v.verbs).to.deep.equal(["answered"]);
      expect(v.interactionType).to.equal("choice");
      expect(v.countsTowardCompletion).to.equal(true);
    });

    it("sends one conformant answered statement when every hotspot is found", async () => {
      const events = [];
      el.addEventListener("user-engagement", (e) => events.push(e.detail));
      await el.probe(...AT.paint);
      await el.probe(...AT.bench);
      expect(events.length).to.equal(0);
      await el.probe(...AT.cord);
      await el.probe(...AT.water);
      await settle(el);
      expect(events.length).to.equal(1);
      const { statement } = events[0];
      expect(events[0].activityDisplay).to.equal("answered");
      expect(events[0].resultSuccess).to.equal(true);
      expect(statement.verb.id).to.equal(
        "http://adlnet.gov/expapi/verbs/answered",
      );
      const def = statement.object.definition;
      expect(def.interactionType).to.equal("choice");
      expect(def.choices.map((c) => c.id)).to.deep.equal([
        CORD,
        WATER,
        PAINT,
        BENCH,
      ]);
      expect(def.correctResponsesPattern).to.deep.equal([
        `${CORD}[,]${WATER}[,]${PAINT}`,
      ]);
      // ids in authored order, never the names
      expect(statement.result.response).to.equal(
        `${CORD}[,]${WATER}[,]${PAINT}`,
      );
      expect(statement.result.success).to.equal(true);
      expect(statement.result.completion).to.equal(true);
      expect(statement.result.score).to.include({ raw: 3, max: 3, min: 0 });
      const iris = JSON.stringify(statement);
      expect(iris).to.not.include("misses");
      const r = await executeServerCommand("xapi-validate", statement);
      expect(r.errors).to.deep.equal([]);
    });

    it("sends a conformant statement with a partial score when the misses run out", async () => {
      const events = [];
      el.addEventListener("user-engagement", (e) => events.push(e.detail));
      await el.probe(...AT.water);
      for (let i = 0; i < 4; i++) {
        await el.probe(...AT.nothing);
      }
      await settle(el);
      expect(events.length).to.equal(1);
      const { statement } = events[0];
      expect(statement.result.success).to.equal(false);
      expect(statement.result.response).to.equal(WATER);
      expect(statement.result.score).to.include({ raw: 1, max: 3 });
      const r = await executeServerCommand("xapi-validate", statement);
      expect(r.errors).to.deep.equal([]);
      // nothing found at all is still a valid statement
      const none = await make();
      await ready(none);
      const sent = [];
      none.addEventListener("user-engagement", (e) => sent.push(e.detail));
      for (let i = 0; i < 4; i++) {
        await none.probe(...AT.nothing);
      }
      await settle(none);
      expect(sent[0].statement.result.response || "").to.equal("");
      expect(sent[0].statement.result.score).to.include({ raw: 0, max: 3 });
      const r2 = await executeServerCommand("xapi-validate", sent[0].statement);
      expect(r2.errors).to.deep.equal([]);
    });

    it("region ids come from the name, so moving or reordering keeps them", async () => {
      const before = el._regions().map((r) => r.id);
      el.answers = [el.answers[2], { ...el.answers[0], x: 1, y: 1 }];
      await waitUntil(() => el._regions().length === 2);
      expect(el._regions().map((r) => r.id)).to.deep.equal([
        before[2],
        before[0],
      ]);
    });

    it("sends nothing while HAX is editing", async () => {
      const events = [];
      el.addEventListener("user-engagement", (e) => events.push(e.detail));
      el.haxeditModeChanged(true);
      await el.updateComplete;
      await el.probe(...AT.cord);
      await el.probe(...AT.water);
      await el.probe(...AT.paint);
      const rect = $(el, "#stage").getBoundingClientRect();
      $(el, "#stage").dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          clientX: rect.left + 5,
          clientY: rect.top + 5,
        }),
      );
      await el.updateComplete;
      expect(events.length).to.equal(0);
      expect(el._found.length).to.equal(0);
      expect(el._misses.length).to.equal(0);
      expect(el.showAnswer).to.equal(false);
    });
  });

  describe("restore", () => {
    it("puts found hotspots back from ids and ignores unknown and decoy ids", () => {
      const ok = el.restoreLearnerResponse(
        `${PAINT}[,]c-deadbeef[,]${BENCH}[,]${CORD}`,
      );
      expect(ok).to.equal(true);
      expect(el._foundIds()).to.deep.equal([CORD, PAINT]);
      expect(el.restoreLearnerResponse("c-deadbeef")).to.equal(false);
      expect(el.restoreLearnerResponse("")).to.equal(false);
      expect(el.restoreLearnerResponse(null)).to.equal(false);
    });

    it("resumes a saved record through the learner progress request", async () => {
      const answer = (e) => {
        if (e.detail.tag === "identify-hotspots") {
          e.detail.record = {
            status: "incorrect",
            done: false,
            attempts: 1,
            response: `${WATER}[,]c-deadbeef`,
          };
        }
      };
      globalThis.addEventListener("learner-progress-request", answer);
      try {
        const back = await make();
        await ready(back);
        await waitUntil(() => back.showAnswer === true, "record applied");
        await back.updateComplete;
        expect(back._foundIds()).to.deep.equal([WATER]);
        expect(back.attempts).to.equal(1);
        expect($$(back, ".hs-region[data-state='found']").length).to.equal(1);
        expect($(back, "#reveal")).to.exist;
        // editing never sees a restored answer
        back.haxeditModeChanged(true);
        await back.updateComplete;
        expect(back._found.length).to.equal(0);
        expect(back.showAnswer).to.equal(false);
        expect(back.attempts).to.equal(0);
      } finally {
        globalThis.removeEventListener("learner-progress-request", answer);
      }
    });

    it("forgets a restored answer when progress is cleared", async () => {
      el._applyLearnerRecord({
        status: "correct",
        done: true,
        attempts: 1,
        response: `${CORD}[,]${WATER}[,]${PAINT}`,
      });
      await el.updateComplete;
      expect(el.showAnswer).to.equal(true);
      expect(el.isCorrect()).to.equal(true);
      globalThis.dispatchEvent(new CustomEvent("learner-progress-cleared"));
      await el.updateComplete;
      expect(el._found.length).to.equal(0);
      expect(el.showAnswer).to.equal(false);
    });
  });

  describe("HAX", () => {
    it("implements the question haxHooks", () => {
      expect(el.haxHooks()).to.include({
        editModeChanged: "haxeditModeChanged",
        activeElementChanged: "haxactiveElementChanged",
        preProcessNodeToContent: "haxpreProcessNodeToContent",
        preProcessInsertContent: "haxpreProcessInsertContent",
        inlineContextMenu: "haxinlineContextMenu",
      });
    });

    it("edit mode drops learner state and outlines every region with its name", async () => {
      await el.probe(...AT.cord);
      await el.probe(...AT.nothing);
      el.haxeditModeChanged(true);
      await el.updateComplete;
      expect(el._found.length).to.equal(0);
      expect(el._misses.length).to.equal(0);
      const regions = $$(el, ".hs-region");
      expect(regions.map((r) => r.getAttribute("data-state"))).to.deep.equal([
        "key",
        "key",
        "key",
        "decoy",
      ]);
      expect(regions[0].getAttribute("style")).to.equal(
        "left:25.5%;top:56.4%;width:11%;height:12.8%",
      );
      const labels = $$(el, ".hs-badge").map((b) =>
        b.textContent.replace(/\s+/g, " ").trim(),
      );
      expect(labels).to.deep.equal([
        "Frayed power cord Hotspot",
        "Water by the outlet Hotspot",
        "Paint can beside the heater Hotspot",
        "Workbench Decoy",
      ]);
      // not a control while editing, and no learner buttons
      expect($(el, "#stage").hasAttribute("tabindex")).to.equal(false);
      expect($(el, "#buttons")).to.equal(null);
      await expect(el).shadowDom.to.be.accessible();
      // back to the visitor view: the key is hidden again
      el.haxeditModeChanged(false);
      await el.updateComplete;
      expect($$(el, ".hs-region").length).to.equal(0);
    });

    it("cleans numbers typed into the settings form", async () => {
      el.answers = [
        {
          label: "A",
          correct: true,
          x: "12.5",
          y: "-4",
          width: "0",
          height: "400",
        },
        { label: "B" },
      ];
      await waitUntil(
        () => el.answers.length === 2 && el.answers[0].x === 12.5,
      );
      expect(el.answers[0]).to.include({
        x: 12.5,
        y: 0,
        width: 1,
        height: 100,
      });
      // a new answer starts as a hotspot in the middle of the picture
      expect(el.answers[1]).to.include({
        correct: true,
        x: 40,
        y: 40,
        width: 20,
        height: 20,
      });
    });

    it("does not render an image from an unsafe address", async () => {
      el.src = "javascript:alert(1)";
      await el.updateComplete;
      expect($(el, "#hs-img")).to.equal(null);
      await el.probe(50, 50);
      expect(el._misses.length).to.equal(0);
    });
  });
});

describe("hotspot-regions", () => {
  it("tests the ellipse inscribed in a box", () => {
    const r = { x: 10, y: 20, width: 40, height: 20 };
    expect(regionContains(r, 30, 30)).to.equal(true);
    expect(regionContains(r, 10, 30)).to.equal(true);
    expect(regionContains(r, 50, 30)).to.equal(true);
    expect(regionContains(r, 30, 20)).to.equal(true);
    expect(regionContains(r, 11, 21)).to.equal(false);
    expect(regionContains(r, 51, 30)).to.equal(false);
    expect(regionContains({ x: 0, y: 0, width: 0, height: 0 }, 0, 0)).to.equal(
      false,
    );
    expect(regionContains(null, 0, 0)).to.equal(false);
  });

  it("normalizes a region", () => {
    expect(
      normalizeRegion({ x: "5", y: 200, width: -3, height: "x" }),
    ).to.deep.equal({
      x: 5,
      y: 100,
      width: 1,
      height: 20,
      correct: false,
    });
    expect(normalizeRegion(undefined)).to.deep.equal({
      x: 40,
      y: 40,
      width: 20,
      height: 20,
      correct: false,
    });
  });

  it("only lets image addresses through", () => {
    expect(safeImageSrc("https://example.org/a.png")).to.equal(
      "https://example.org/a.png",
    );
    expect(safeImageSrc("HTTP://example.org/a.png")).to.equal(
      "HTTP://example.org/a.png",
    );
    expect(safeImageSrc("files/a.png")).to.equal("files/a.png");
    expect(safeImageSrc("../lib/a.svg?x=1:2")).to.equal("../lib/a.svg?x=1:2");
    expect(safeImageSrc("data:image/svg+xml;base64,AAAA")).to.equal(
      "data:image/svg+xml;base64,AAAA",
    );
    expect(safeImageSrc("data:text/html,<script>1</script>")).to.equal("");
    expect(safeImageSrc("javascript:alert(1)")).to.equal("");
    expect(safeImageSrc(" JaVa\tScRiPt:alert(1)")).to.equal("");
    expect(safeImageSrc("java\nscript:alert(1)")).to.equal("");
    expect(safeImageSrc("vbscript:x")).to.equal("");
    expect(safeImageSrc("")).to.equal("");
    expect(safeImageSrc(null)).to.equal("");
  });
});
