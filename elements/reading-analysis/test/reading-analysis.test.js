import { fixture, expect, html } from "@open-wc/testing";
import { executeServerCommand } from "@web/test-runner-commands";
import "../reading-analysis.js";
import {
  componentId,
  deviceActor,
  setActorProvider,
} from "@haxtheweb/user-action/lib/xapi.js";

const flush = (ms = 60) => new Promise((r) => setTimeout(r, ms));

const S = [
  "Records were split by race.",
  "Covers by white singers outsold the originals.",
  "Some shows mixed audiences for the first time.",
  "Critics called the music a communist plot.",
];
const sid = (i) => componentId(`sentence:${S[i]}`);
const pid = (i) =>
  componentId(`paragraph:${i === 0 ? `${S[0]} ${S[1]}` : `${S[2]} ${S[3]}`}`);
const FIG = "A ticket stub marked open seating.";
const fid = componentId(`figure:${FIG}`);

const reading = html`<h3>Who was afraid?</h3>
  <p>${S[0]} ${S[1]}</p>
  <p>${S[2]} <em>${S[3]}</em></p>
  <figure>
    <img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="Ticket" />
    <figcaption>${FIG}</figcaption>
  </figure>`;

async function ready(el) {
  await flush();
  await el.updateComplete;
  await flush();
  await el.updateComplete;
}
const target = (el, id) => el.shadowRoot.querySelector(`[data-t="${id}"]`);
const flag = (el, label) =>
  Array.from(el.shadowRoot.querySelectorAll("button.flag")).find((b) =>
    b.textContent.includes(label),
  );
async function place(el, label, id) {
  // a held flag stays held after placing, so only pick it up when needed
  const b = flag(el, label);
  if (b.getAttribute("aria-pressed") !== "true") {
    b.click();
  }
  await el.updateComplete;
  target(el, id).click();
  await el.updateComplete;
}

describe("reading-analysis", () => {
  before(() =>
    setActorProvider(() =>
      deviceActor(
        "4b9f1c1e-0000-4000-8000-00000000000a",
        "https://example.org/",
      ),
    ),
  );
  after(() => setActorProvider(null));

  describe("flag evidence by sentence", () => {
    let el;
    beforeEach(async () => {
      el = await fixture(
        html`<reading-analysis
          question="Find the evidence"
          mode="flag"
          unit="sentence"
          max-attempts="2"
          >${reading}
          <input value="Racism" data-targets="${sid(0)},${sid(1)},${fid}" />
          <input value="Communism" data-targets="${sid(3)}" />
        </reading-analysis>`,
      );
      await ready(el);
    });

    it("passes the a11y audit", async () => {
      await expect(el).shadowDom.to.be.accessible();
    });

    it("segments sentences, keeps a sentence across inline markup, and adds the figure", () => {
      expect(target(el, sid(0))).to.exist;
      expect(target(el, sid(3))).to.exist;
      expect(target(el, fid)).to.exist;
      expect(target(el, fid).querySelector("figure")).to.exist;
      // headings are never targets
      const h3 = el.shadowRoot.querySelector("#reading h3");
      expect(h3.hasAttribute("data-t")).to.equal(false);
      expect(target(el, sid(0)).getAttribute("role")).to.equal("button");
      // the sentence itself is the accessible name
      expect(target(el, sid(0)).hasAttribute("aria-label")).to.equal(false);
    });

    it("never changes or saves runtime markup in the light dom", async () => {
      expect(el.querySelector(".ra-t")).to.equal(null);
      expect(el.querySelector("[data-t]")).to.equal(null);
      const node = el.cloneNode(true);
      node.answers = el.answers;
      node.mode = el.mode;
      await el.haxpreProcessNodeToContent(node);
      const inputs = Array.from(node.querySelectorAll("input:not([slot])"));
      expect(inputs.map((i) => i.value)).to.deep.equal(["Racism", "Communism"]);
      expect(inputs[0].getAttribute("data-targets")).to.equal(
        `${sid(0)},${sid(1)},${fid}`,
      );
      expect(inputs[0].hasAttribute("data-correct")).to.equal(false);
    });

    it("places flags in the margin with labels as accessible names", async () => {
      await place(el, "Racism", sid(0));
      const tabs = el.shadowRoot.querySelectorAll("#margin .tab");
      expect(tabs.length).to.equal(1);
      expect(tabs[0].getAttribute("aria-label")).to.include(
        "Racism beside Sentence 1",
      );
      // no visible text on the margin flag
      expect(tabs[0].textContent.trim()).to.equal("");
      // the same flag can go beside the same passage again (two pieces of
      // evidence in one paragraph); each shows as its own tab
      await place(el, "Racism", sid(0));
      expect(el.shadowRoot.querySelectorAll("#margin .tab").length).to.equal(2);
    });

    it("counts a repeated flag once for scoring and xAPI", async () => {
      await place(el, "Racism", sid(0));
      await place(el, "Racism", sid(0));
      await place(el, "Racism", sid(1));
      await place(el, "Racism", fid);
      await place(el, "Communism", sid(3));
      expect(el._placed.length).to.equal(5);
      expect(el.isCorrect()).to.equal(true);
      const events = [];
      el.addEventListener("user-engagement", (e) => events.push(e.detail));
      el.checkAnswer();
      await flush(150);
      const s = events[0].statement;
      expect(s.result.success).to.equal(true);
      expect(s.result.score).to.include({ raw: 4, max: 4 });
      expect(s.result.response.split("[,]").length).to.equal(4);
      const r = await executeServerCommand("xapi-validate", s);
      expect(r.errors).to.deep.equal([]);
    });

    it("pins the action bar to the viewport when sticky cannot hold", async () => {
      // an overflow: hidden wrapper the size of the viewport stops sticky
      const wrap = document.createElement("div");
      wrap.style.cssText = "overflow: hidden;";
      el.parentNode.insertBefore(wrap, el);
      wrap.appendChild(el);
      await el.updateComplete;
      const bar = el.shadowRoot.querySelector(".shell-action-bar");
      const desk = el.shadowRoot.querySelector(".desk");
      // a reading taller than the viewport: the bar's place is below it
      desk.style.minHeight = `${globalThis.innerHeight * 2}px`;
      el._pinRail();
      expect(bar.classList.contains("ra-pinned")).to.equal(true);
      expect(Math.round(bar.getBoundingClientRect().bottom)).to.be.at.most(
        globalThis.innerHeight,
      );
      // the shell keeps the bar's space, so nothing below it moves
      expect(
        el.shadowRoot.querySelector(".shell").style.paddingBottom,
      ).to.not.equal("");
      // the whole activity fits again: the bar goes back in the flow
      desk.style.minHeight = "";
      desk.style.maxHeight = "80px";
      desk.style.overflow = "hidden";
      el._pinRail();
      expect(bar.classList.contains("ra-pinned")).to.equal(false);
      expect(
        el.shadowRoot.querySelector(".shell").style.paddingBottom,
      ).to.equal("");
    });

    it("shows the label in a tooltip and lights the target on focus", async () => {
      await place(el, "Racism", sid(1));
      const tab = el.shadowRoot.querySelector("#margin .tab");
      tab.focus();
      tab.dispatchEvent(
        new FocusEvent("focusin", { bubbles: true, composed: true }),
      );
      const tip = el.shadowRoot.querySelector("#tip");
      expect(tip.hidden).to.equal(false);
      expect(tip.textContent).to.include("Racism");
      expect(tip.textContent).to.include("Sentence 2");
      expect(target(el, sid(1)).hasAttribute("data-lit")).to.equal(true);
    });

    it("removes a flag when its tab is activated", async () => {
      await place(el, "Racism", sid(0));
      el.shadowRoot.querySelector("#margin .tab").click();
      await el.updateComplete;
      expect(el._placed.length).to.equal(0);
    });

    it("is one tab stop; the arrow keys, Home and End move between passages", async () => {
      const stops = () =>
        Array.from(el.shadowRoot.querySelectorAll('[data-t][tabindex="0"]'));
      expect(stops().length).to.equal(1);
      expect(stops()[0].getAttribute("data-t")).to.equal(sid(0));
      const key = (k) =>
        el.shadowRoot.activeElement.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: k,
            bubbles: true,
            composed: true,
            cancelable: true,
          }),
        );
      target(el, sid(0)).focus();
      key("ArrowDown");
      expect(el.shadowRoot.activeElement.getAttribute("data-t")).to.equal(
        sid(1),
      );
      expect(stops().length).to.equal(1);
      key("End");
      expect(el.shadowRoot.activeElement.getAttribute("data-t")).to.equal(fid);
      key("ArrowDown");
      expect(el.shadowRoot.activeElement.getAttribute("data-t")).to.equal(fid);
      key("Home");
      expect(el.shadowRoot.activeElement.getAttribute("data-t")).to.equal(
        sid(0),
      );
      key("ArrowUp");
      expect(el.shadowRoot.activeElement.getAttribute("data-t")).to.equal(
        sid(0),
      );
      // the passage reached last keeps the tab stop
      key("ArrowRight");
      expect(stops().map((n) => n.getAttribute("data-t"))).to.deep.equal([
        sid(1),
      ]);
      expect(
        el.shadowRoot
          .querySelector("#reading")
          .getAttribute("aria-describedby"),
      ).to.equal("ra-keys");
      expect(el.shadowRoot.querySelector("#ra-keys").textContent).to.include(
        "sentence",
      );
      expect(
        el.shadowRoot.querySelector("#ra-live").getAttribute("aria-live"),
      ).to.equal("polite");
    });

    it("names correct and incorrect placements in words, not only the mark", async () => {
      await place(el, "Racism", sid(0));
      await place(el, "Communism", sid(2));
      el.checkAnswer();
      await flush(150);
      await el.updateComplete;
      const rows = Array.from(
        el.shadowRoot.querySelectorAll("ul.placements li"),
      );
      const ok = rows.find((r) => r.classList.contains("res-correct"));
      const bad = rows.find((r) => r.classList.contains("res-incorrect"));
      expect(ok.textContent).to.include("evidence for this flag");
      expect(ok.textContent).to.not.include("not evidence");
      expect(bad.textContent).to.include("not evidence for this flag");
    });

    it("scores, marks each tab, and sends a conformant matching statement", async () => {
      await place(el, "Racism", sid(0));
      await place(el, "Racism", sid(1));
      await place(el, "Communism", sid(2));
      const events = [];
      el.addEventListener("user-engagement", (e) => events.push(e.detail));
      el.checkAnswer();
      await flush(150);
      await el.updateComplete;
      expect(el.isCorrect()).to.equal(false);
      const tabs = Array.from(el.shadowRoot.querySelectorAll("#margin .tab"));
      expect(
        tabs.filter((t) => t.classList.contains("res-correct")).length,
      ).to.equal(2);
      expect(
        tabs.filter((t) => t.classList.contains("res-incorrect")).length,
      ).to.equal(1);
      expect(events.length).to.equal(1);
      const s = events[0].statement;
      // flag and passage pairs as choices: 2 flags x 5 passages
      expect(s.object.definition.interactionType).to.equal("choice");
      expect(s.object.definition.choices.length).to.equal(10);
      expect(
        Object.values(s.object.definition.choices[0].description)[0],
      ).to.include("Racism");
      expect(s.result.success).to.equal(false);
      expect(s.result.score).to.include({ raw: 2, max: 4 });
      expect(s.result.response.split("[,]").length).to.equal(3);
      const r = await executeServerCommand("xapi-validate", s);
      expect(r.errors).to.deep.equal([]);
    });

    it("keeps flags on try again so the learner can fix them, then passes", async () => {
      await place(el, "Racism", sid(0));
      el.checkAnswer();
      await flush(150);
      el.resetAnswer();
      await el.updateComplete;
      expect(el._placed.length).to.equal(1);
      await place(el, "Racism", sid(1));
      await place(el, "Racism", fid);
      await place(el, "Communism", sid(3));
      expect(el.isCorrect()).to.equal(true);
    });

    it("restores a saved response from ids and ignores unknown ids", async () => {
      const pair = el
        ._xapiPairs()
        .find((p) => p.t === sid(0) && p.f === el._flagIds()[0].id);
      const ok = el.restoreLearnerResponse(`${pair.id}[,]c-deadbeef`);
      expect(ok).to.equal(true);
      expect(el._placed.length).to.equal(1);
    });

    it("declares an xAPI vocabulary", () => {
      const v = el.constructor.xapiVocabulary;
      expect(v.tag).to.equal("reading-analysis");
      expect(v.countsTowardCompletion).to.equal(true);
    });
  });

  describe("paragraph unit", () => {
    it("makes each paragraph one target", async () => {
      const el = await fixture(
        html`<reading-analysis question="Q" mode="flag" unit="paragraph"
          >${reading}<input value="Racism" data-targets="${pid(0)}"
        /></reading-analysis>`,
      );
      await ready(el);
      expect(target(el, pid(0)).tagName.toLowerCase()).to.equal("p");
      expect(target(el, pid(1))).to.exist;
      expect(el.shadowRoot.querySelectorAll("span.ra-t").length).to.equal(0);
    });
  });

  describe("select one", () => {
    let el;
    beforeEach(async () => {
      el = await fixture(
        html`<reading-analysis question="Pick one" mode="one" unit="sentence"
          >${reading}<input data-select-one data-targets="${sid(1)}"
        /></reading-analysis>`,
      );
      await ready(el);
    });

    it("has no flag pad and reads the key from its own input", () => {
      expect(el.shadowRoot.querySelector(".pad")).to.equal(null);
      expect(el._selectKey).to.deep.equal([sid(1)]);
      expect(el.answers.length).to.equal(0);
    });

    it("grades a pick and sends a conformant choice statement", async () => {
      target(el, sid(1)).click();
      await el.updateComplete;
      expect(target(el, sid(1)).getAttribute("aria-pressed")).to.equal("true");
      const events = [];
      el.addEventListener("user-engagement", (e) => events.push(e.detail));
      el.checkAnswer();
      await flush(150);
      expect(el.isCorrect()).to.equal(true);
      const s = events[0].statement;
      expect(s.object.definition.interactionType).to.equal("choice");
      expect(s.result.response).to.equal(sid(1));
      expect(s.object.definition.correctResponsesPattern).to.deep.equal([
        sid(1),
      ]);
      const r = await executeServerCommand("xapi-validate", s);
      expect(r.errors).to.deep.equal([]);
    });

    it("saves the select-one key back as its own input", async () => {
      const node = el.cloneNode(true);
      node.answers = el.answers;
      node.mode = el.mode;
      node._selectKey = el._selectKey;
      await el.haxpreProcessNodeToContent(node);
      const input = node.querySelector("input[data-select-one]");
      expect(input).to.exist;
      expect(input.getAttribute("data-targets")).to.equal(sid(1));
    });
  });

  describe("HAX editing", () => {
    it("shows the authored slot while editing and the key layer while marking", async () => {
      const el = await fixture(
        html`<reading-analysis question="Q" mode="flag" unit="sentence"
          >${reading}<input value="Racism" data-targets="${sid(0)}"
        /></reading-analysis>`,
      );
      await ready(el);
      el.haxeditModeChanged(true);
      await el.updateComplete;
      expect(el.shadowRoot.querySelector(".author slot")).to.exist;
      el.haxToggleMarking();
      await el.updateComplete;
      await flush();
      expect(el.shadowRoot.querySelector(".desk.marking")).to.exist;
      // the key shows as a flag in the margin
      expect(el.shadowRoot.querySelectorAll("#margin .tab").length).to.equal(1);
      await place(el, "Racism", sid(2));
      expect(el.answers[0].targets).to.include(sid(2));
      el.haxeditModeChanged(false);
      await el.updateComplete;
      expect(el._marking).to.equal(false);
    });
  });
});

describe("reading-segments", () => {
  it("splits sentences without Intl.Segmenter too", async () => {
    const { sentenceRanges } = await import("../lib/reading-segments.js");
    const text = 'One. "Two!" Three? Open site.json now. Four';
    const withSeg = sentenceRanges(text).map((r) =>
      text.slice(r.start, r.end).trim(),
    );
    const Seg = Intl.Segmenter;
    Intl.Segmenter = undefined;
    try {
      const fallback = sentenceRanges(text).map((r) =>
        text.slice(r.start, r.end).trim(),
      );
      expect(fallback).to.deep.equal([
        "One.",
        '"Two!"',
        "Three?",
        "Open site.json now.",
        "Four",
      ]);
      expect(fallback).to.deep.equal(withSeg);
    } finally {
      Intl.Segmenter = Seg;
    }
  });
});
