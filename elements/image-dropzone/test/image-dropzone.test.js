import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import { executeServerCommand, setViewport } from "@web/test-runner-commands";
import "../image-dropzone.js";
import { safeImageSrc } from "../image-dropzone.js";
import {
  componentId,
  deviceActor,
  setActorProvider,
} from "@haxtheweb/user-action/lib/xapi.js";

// a 4:3 image so the zones have a real box to sit in
const IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3C/svg%3E";

const template = (extra = html``) =>
  html`<image-dropzone
    src="${IMG}"
    alt="Wireframe of a page"
    media-title="Page wireframe"
    question="Label the page regions"
    max-attempts="3"
  >
    <input
      type="checkbox"
      value="header"
      data-zone="Top band"
      data-x="3"
      data-y="5"
      data-width="94"
      data-height="20"
    />
    <input
      type="checkbox"
      value="main"
      data-zone="Center column"
      data-x="3"
      data-y="30"
      data-width="60"
      data-height="40"
    />
    <input
      type="checkbox"
      value="footer"
      data-zone="Bottom band"
      data-x="3"
      data-y="75"
      data-width="94"
      data-height="20"
    />
    <input type="checkbox" value="section" />
    ${extra}
  </image-dropzone>`;

async function ready(el) {
  await waitUntil(
    () => el.answers.length === 4 && el.querySelector("input") === null,
    "answers load from the light dom",
  );
  // QuestionElement briefly locks answers after first render
  await waitUntil(() => el.__answerLock === false, "answers settle");
  await el.updateComplete;
}
const zone = (el, name) =>
  Array.from(el.shadowRoot.querySelectorAll("button.dz-zone")).find((b) =>
    b.textContent.includes(`${name}:`),
  );
const label = (el, text) =>
  Array.from(el.shadowRoot.querySelectorAll("button.dz-label")).find(
    (b) => b.textContent.trim() === text,
  );
const name = (node) => node.textContent.replace(/\s+/g, " ").trim();
const live = (el) => name(el.shadowRoot.querySelector("#dz-live"));
async function place(el, text, zoneName) {
  label(el, text).click();
  await el.updateComplete;
  zone(el, zoneName).click();
  await el.updateComplete;
}
async function fill(el, pairs) {
  for (const [text, zoneName] of pairs) {
    await place(el, text, zoneName);
  }
}
const RIGHT = [
  ["header", "Top band"],
  ["main", "Center column"],
  ["footer", "Bottom band"],
];
const WRONG = [
  ["section", "Top band"],
  ["main", "Center column"],
  ["footer", "Bottom band"],
];
async function check(el) {
  const events = [];
  const on = (e) => events.push(e.detail);
  el.addEventListener("user-engagement", on);
  await el.checkAnswer();
  await waitUntil(() => el.showAnswer && events.length === 1, "check ran");
  await el.updateComplete;
  el.removeEventListener("user-engagement", on);
  return events[0].statement;
}

describe("image-dropzone", () => {
  before(() =>
    setActorProvider(() =>
      deviceActor(
        "4b9f1c1e-0000-4000-8000-00000000000d",
        "https://example.org/",
      ),
    ),
  );
  after(() => setActorProvider(null));

  let el;
  beforeEach(async () => {
    el = await fixture(template());
    await ready(el);
  });

  describe("content", () => {
    it("reads labels and zones from light dom inputs", () => {
      expect(el.answers.map((a) => a.label)).to.deep.equal([
        "header",
        "main",
        "footer",
        "section",
      ]);
      expect(el.answers[1]).to.include({
        zone: "Center column",
        x: 3,
        y: 30,
        width: 60,
        height: 40,
        correct: true,
      });
      // no zone name: a distractor
      expect(el.answers[3].zone).to.equal("");
      expect(el.answers[3].correct).to.equal(false);
    });

    it("positions zones in percentages of the image", () => {
      const z = zone(el, "Center column");
      expect(z.style.left).to.equal("3%");
      expect(z.style.top).to.equal("30%");
      expect(z.style.width).to.equal("60%");
      expect(z.style.height).to.equal("40%");
      expect(el.shadowRoot.querySelectorAll("button.dz-zone").length).to.equal(
        3,
      );
    });

    it("keeps zone numbers on the image", async () => {
      el.answers = [
        { label: "a", zone: "Far corner", x: 150, y: -4, width: 80, height: 0 },
        { label: "b", zone: "No numbers", x: "x", width: "" },
      ];
      await waitUntil(() => el.answers[0].x === 99);
      expect(el.answers[0]).to.include({ x: 99, y: 0, width: 1, height: 1 });
      expect(el.answers[1]).to.include({ x: 0, y: 0, width: 20, height: 15 });
    });

    it("shows the authored title, never the alt, as the image title", () => {
      const title = el.shadowRoot.querySelector(".dz-title");
      expect(name(title)).to.equal("Page wireframe");
      const img = el.shadowRoot.querySelector("img.dz-img");
      expect(img.getAttribute("alt")).to.equal("Wireframe of a page");
      const figure = el.shadowRoot.querySelector(".dz-figure");
      expect(figure.getAttribute("role")).to.equal("group");
      expect(figure.getAttribute("aria-labelledby")).to.equal("dz-title");
      expect(el.shadowRoot.textContent).to.not.include("Wireframe of a page");
    });

    it("shows no title when none is authored", async () => {
      el.mediaTitle = "";
      await el.updateComplete;
      expect(el.shadowRoot.querySelector(".dz-title")).to.equal(null);
      expect(
        el.shadowRoot.querySelector(".dz-figure").hasAttribute("role"),
      ).to.equal(false);
    });

    it("renders a caption below the image only when one is slotted", async () => {
      expect(el.shadowRoot.querySelector(".dz-caption")).to.equal(null);
      const withCaption = await fixture(
        template(html`<p slot="caption">A common page layout.</p>`),
      );
      await ready(withCaption);
      const caption = withCaption.shadowRoot.querySelector(".dz-caption");
      const stage = withCaption.shadowRoot.querySelector(".dz-stage");
      expect(caption).to.exist;
      expect(
        stage.compareDocumentPosition(caption) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).to.be.greaterThan(0);
    });

    it("only puts safe image addresses in src", async () => {
      expect(safeImageSrc("https://example.org/a.png")).to.equal(
        "https://example.org/a.png",
      );
      expect(safeImageSrc("files/a.png")).to.equal("files/a.png");
      expect(safeImageSrc(IMG)).to.equal(IMG);
      expect(safeImageSrc("javascript:alert(1)")).to.equal("");
      expect(safeImageSrc(" java\tscript:alert(1)")).to.equal("");
      expect(safeImageSrc("data:text/html,<p>x</p>")).to.equal("");
      expect(safeImageSrc("file:///etc/passwd")).to.equal("");
      el.src = "javascript:alert(1)";
      await el.updateComplete;
      expect(el.shadowRoot.querySelector("img.dz-img")).to.equal(null);
    });
  });

  describe("accessibility", () => {
    it("passes the a11y audit", async () => {
      await expect(el).shadowDom.to.be.accessible();
    });

    it("passes the a11y audit while a label is held", async () => {
      label(el, "header").click();
      await el.updateComplete;
      await expect(el).shadowDom.to.be.accessible();
    });

    it("passes the a11y audit once answered", async () => {
      await fill(el, WRONG);
      await check(el);
      await expect(el).shadowDom.to.be.accessible();
    });

    it("passes the a11y audit with the needs input message", async () => {
      await el.checkAnswer();
      await el.updateComplete;
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

      it("passes the a11y audit in dark mode", async () => {
        await expect(el).shadowDom.to.be.accessible();
      });

      it("passes the a11y audit in dark mode while held and once answered", async () => {
        label(el, "header").click();
        await el.updateComplete;
        await expect(el).shadowDom.to.be.accessible();
        zone(el, "Top band").click();
        await el.updateComplete;
        await fill(el, [
          ["section", "Center column"],
          ["footer", "Bottom band"],
        ]);
        await check(el);
        await expect(el).shadowDom.to.be.accessible();
      });
    });

    it("names each zone by its authored name plus what it holds", async () => {
      expect(name(zone(el, "Top band"))).to.equal("Top band: empty");
      expect(zone(el, "Top band").hasAttribute("aria-label")).to.equal(false);
      await place(el, "header", "Top band");
      expect(name(zone(el, "Top band"))).to.equal("Top band: header");
    });

    it("zones only look targetable while a label is held", async () => {
      const stage = el.shadowRoot.querySelector(".dz-stage");
      expect(stage.hasAttribute("data-targeting")).to.equal(false);
      const quiet = getComputedStyle(zone(el, "Top band")).borderTopWidth;
      label(el, "header").click();
      await el.updateComplete;
      expect(stage.hasAttribute("data-targeting")).to.equal(true);
      expect(label(el, "header").getAttribute("aria-pressed")).to.equal("true");
      expect(
        getComputedStyle(zone(el, "Top band")).borderTopWidth,
      ).to.not.equal(quiet);
    });

    it("gives every target at least 24px", () => {
      el.shadowRoot
        .querySelectorAll("button.dz-zone, button.dz-label")
        .forEach((b) => {
          const r = b.getBoundingClientRect();
          expect(r.width, name(b)).to.be.at.least(24);
          expect(r.height, name(b)).to.be.at.least(24);
        });
    });

    it("moves nothing for long under reduced motion rules", () => {
      const sheets = el.constructor.elementStyles.map((s) => s.cssText);
      const own = sheets[sheets.length - 1];
      expect(own).to.include("prefers-reduced-motion: reduce");
      expect(own.match(/transition:/g).length).to.equal(2);
    });
  });

  describe("placing labels", () => {
    it("tap a label, then a zone, and every move is announced", async () => {
      label(el, "header").click();
      await el.updateComplete;
      expect(el.held).to.equal(0);
      expect(live(el)).to.equal("Holding header. Choose a region.");
      zone(el, "Top band").click();
      await el.updateComplete;
      expect(el.held).to.equal(null);
      expect(el.placed).to.deep.equal([{ label: 0, zone: 0 }]);
      expect(live(el)).to.equal("header placed on Top band.");
      // a placed label stays in the bank, switched off
      expect(label(el, "header").disabled).to.equal(true);
    });

    it("tap a placed label to send it back to the bank", async () => {
      await place(el, "header", "Top band");
      zone(el, "Top band").click();
      await el.updateComplete;
      expect(el.placed).to.deep.equal([]);
      expect(live(el)).to.equal("header returned to the labels.");
      expect(label(el, "header").disabled).to.equal(false);
    });

    it("holds one label per zone and one zone per label", async () => {
      await place(el, "header", "Top band");
      await place(el, "main", "Top band");
      expect(el.placed).to.deep.equal([{ label: 1, zone: 0 }]);
      expect(live(el)).to.equal(
        "main placed on Top band. header returned to the labels.",
      );
      // restoring can not double a label or a zone either
      const s = el._xapiMatching();
      el.restoreLearnerResponse(
        [
          `${s.source[0].id}[.]${s.target[0].id}`,
          `${s.source[0].id}[.]${s.target[1].id}`,
          `${s.source[1].id}[.]${s.target[0].id}`,
        ].join("[,]"),
      );
      expect(el.placed).to.deep.equal([{ label: 0, zone: 0 }]);
    });

    it("says to pick a label first when an empty zone is tapped", async () => {
      zone(el, "Top band").click();
      await el.updateComplete;
      expect(el.placed).to.deep.equal([]);
      expect(live(el)).to.equal("Pick up a label first.");
    });

    it("keyboard: Enter picks up and carries focus to a zone, Enter places, focus returns to the labels", async () => {
      label(el, "header").focus();
      label(el, "header").click();
      await waitUntil(
        () => el.shadowRoot.activeElement === zone(el, "Top band"),
        "focus moves to the first empty zone",
      );
      zone(el, "Center column").focus();
      zone(el, "Center column").click();
      await waitUntil(
        () => el.shadowRoot.activeElement === label(el, "main"),
        "focus moves to the next label in the bank",
      );
      expect(el.placed).to.deep.equal([{ label: 0, zone: 1 }]);
    });

    it("keyboard: Escape puts a held label back and returns focus to it", async () => {
      label(el, "main").click();
      await waitUntil(
        () => el.shadowRoot.activeElement === zone(el, "Top band"),
      );
      zone(el, "Top band").dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Escape",
          bubbles: true,
          composed: true,
        }),
      );
      await waitUntil(() => el.shadowRoot.activeElement === label(el, "main"));
      expect(el.held).to.equal(null);
      expect(el.placed).to.deep.equal([]);
      expect(live(el)).to.equal("main put back.");
    });

    it("a pointer tap leaves focus where it is", async () => {
      const b = label(el, "header");
      b.focus();
      b.dispatchEvent(
        new MouseEvent("click", { bubbles: true, composed: true, detail: 1 }),
      );
      await el.updateComplete;
      await el.updateComplete;
      expect(el.held).to.equal(0);
      expect(el.shadowRoot.activeElement).to.equal(b);
    });

    it("mouse drag and drop places, moves and returns a label", async () => {
      const dt = new DataTransfer();
      const fire = (node, type) =>
        node.dispatchEvent(
          new DragEvent(type, {
            bubbles: true,
            cancelable: true,
            composed: true,
            dataTransfer: dt,
          }),
        );
      fire(label(el, "header"), "dragstart");
      await el.updateComplete;
      expect(el.held).to.equal(0);
      // a zone accepts the drop
      expect(fire(zone(el, "Top band"), "dragover")).to.equal(false);
      await el.updateComplete;
      expect(zone(el, "Top band").classList.contains("dz-over")).to.equal(true);
      fire(zone(el, "Top band"), "drop");
      await el.updateComplete;
      expect(el.placed).to.deep.equal([{ label: 0, zone: 0 }]);
      expect(el.held).to.equal(null);
      // drag the placed label on to another zone
      fire(zone(el, "Top band"), "dragstart");
      fire(zone(el, "Bottom band"), "drop");
      await el.updateComplete;
      expect(el.placed).to.deep.equal([{ label: 0, zone: 2 }]);
      // and back to the bank
      fire(zone(el, "Bottom band"), "dragstart");
      fire(el.shadowRoot.querySelector(".dz-bank"), "drop");
      await el.updateComplete;
      expect(el.placed).to.deep.equal([]);
      // something dragged in from outside is ignored
      expect(fire(zone(el, "Top band"), "dragover")).to.equal(true);
      fire(zone(el, "Top band"), "drop");
      expect(el.placed).to.deep.equal([]);
    });
  });

  describe("checking", () => {
    it("asks for every zone before checking, without using an attempt", async () => {
      await place(el, "header", "Top band");
      const events = [];
      el.addEventListener("user-engagement", (e) => events.push(e.detail));
      await el.checkAnswer();
      await el.updateComplete;
      expect(el.showAnswer).to.equal(false);
      expect(el.attempts).to.equal(0);
      expect(events.length).to.equal(0);
      const note = el.shadowRoot.querySelector(".dz-missing");
      expect(name(note)).to.equal("Place a label on every region (1 of 3).");
      expect(live(el)).to.equal("Place a label on every region (1 of 3).");
      // the message goes away on the next move
      await place(el, "main", "Center column");
      expect(el.shadowRoot.querySelector(".dz-missing")).to.equal(null);
    });

    it("scores a correct board and sends a conformant matching statement", async () => {
      await fill(el, RIGHT);
      const s = await check(el);
      expect(el.isCorrect()).to.equal(true);
      expect(el.attempts).to.equal(1);
      const def = s.object.definition;
      expect(def.interactionType).to.equal("matching");
      const text = (c) => Object.values(c.description)[0];
      expect(def.source.map(text)).to.deep.equal([
        "header",
        "main",
        "footer",
        "section",
      ]);
      expect(def.target.map(text)).to.deep.equal([
        "Top band",
        "Center column",
        "Bottom band",
      ]);
      // stable component ids, never copied text
      expect(def.source.map((c) => c.id)).to.deep.equal(
        ["header", "main", "footer", "section"].map(componentId),
      );
      expect(def.target.map((c) => c.id)).to.deep.equal(
        ["Top band", "Center column", "Bottom band"].map(componentId),
      );
      const pattern = [0, 1, 2]
        .map((i) => `${def.source[i].id}[.]${def.target[i].id}`)
        .join("[,]");
      expect(def.correctResponsesPattern).to.deep.equal([pattern]);
      expect(s.result.response).to.equal(pattern);
      expect(s.result.success).to.equal(true);
      expect(s.result.completion).to.equal(true);
      expect(s.result.score).to.include({ raw: 3, max: 3, min: 0 });
      const r = await executeServerCommand("xapi-validate", s);
      expect(r.errors).to.deep.equal([]);
    });

    it("scores a partly wrong board: correct zones out of zones", async () => {
      await fill(el, WRONG);
      const s = await check(el);
      expect(el.isCorrect()).to.equal(false);
      expect(s.result.success).to.equal(false);
      expect(s.result.completion).to.equal(false);
      expect(s.result.score).to.include({ raw: 2, max: 3 });
      const def = s.object.definition;
      expect(s.result.response).to.equal(
        [
          `${def.source[3].id}[.]${def.target[0].id}`,
          `${def.source[1].id}[.]${def.target[1].id}`,
          `${def.source[2].id}[.]${def.target[2].id}`,
        ].join("[,]"),
      );
      const r = await executeServerCommand("xapi-validate", s);
      expect(r.errors).to.deep.equal([]);
    });

    it("marks each zone with line, icon and word, from status tokens", async () => {
      await fill(el, WRONG);
      await check(el);
      const bad = zone(el, "Top band");
      const ok = zone(el, "Center column");
      expect(bad.classList.contains("dz-res-incorrect")).to.equal(true);
      expect(ok.classList.contains("dz-res-correct")).to.equal(true);
      expect(getComputedStyle(bad).borderTopStyle).to.equal("dotted");
      expect(getComputedStyle(ok).borderTopStyle).to.equal("solid");
      expect(getComputedStyle(bad).borderTopColor).to.not.equal(
        getComputedStyle(ok).borderTopColor,
      );
      expect(name(bad)).to.equal("Top band: Incorrect: section");
      expect(name(ok)).to.equal("Center column: Correct: main");
      expect(bad.getAttribute("title")).to.equal("Incorrect");
      expect(
        bad.querySelector("simple-icon-lite").getAttribute("icon"),
      ).to.not.equal(ok.querySelector("simple-icon-lite").getAttribute("icon"));
      // the same result in visible words below the image
      const rows = Array.from(el.shadowRoot.querySelectorAll(".dz-results li"));
      expect(rows.map(name)).to.deep.equal([
        "Incorrect section on Top band",
        "Correct main on Center column",
        "Correct footer on Bottom band",
      ]);
      expect(name(el.shadowRoot.querySelector("p.feedback"))).to.equal(
        "2 of 3 regions correct.",
      );
    });

    it("keeps labels on try again after a wrong answer, starts over after a right one", async () => {
      await fill(el, WRONG);
      await check(el);
      el.resetAnswer();
      await el.updateComplete;
      expect(el.showAnswer).to.equal(false);
      expect(el.placed.length).to.equal(3);
      await place(el, "header", "Top band");
      await check(el);
      expect(el.isCorrect()).to.equal(true);
      expect(el.attempts).to.equal(2);
      el.resetAnswer();
      await el.updateComplete;
      expect(el.placed).to.deep.equal([]);
    });

    it("completes when the attempts run out and takes no more checks", async () => {
      for (let i = 0; i < 3; i++) {
        if (i) {
          el.resetAnswer();
          await el.updateComplete;
        }
        await fill(
          el,
          WRONG.filter(([text]) => !label(el, text).disabled),
        );
        const s = await check(el);
        expect(s.result.completion).to.equal(i === 2);
        const r = await executeServerCommand("xapi-validate", s);
        expect(r.errors).to.deep.equal([]);
      }
      expect(el.attempts).to.equal(3);
      const events = [];
      el.addEventListener("user-engagement", (e) => events.push(e.detail));
      el.showAnswer = false;
      await el.checkAnswer();
      expect(events.length).to.equal(0);
      expect(el.attempts).to.equal(3);
    });

    it("declares an xAPI vocabulary", () => {
      const v = el.constructor.xapiVocabulary;
      expect(v.tag).to.equal("image-dropzone");
      expect(v.verbs).to.deep.equal(["answered"]);
      expect(v.interactionType).to.equal("matching");
      expect(v.countsTowardCompletion).to.equal(true);
      expect(el.xapiInteractionType()).to.equal("matching");
    });
  });

  describe("restore", () => {
    it("restores a saved response from ids and ignores unknown ids", async () => {
      await fill(el, WRONG);
      const s = await check(el);
      const fresh = await fixture(template());
      await ready(fresh);
      expect(
        fresh.restoreLearnerResponse(
          `${s.result.response}[,]c-deadbeef[.]c-0badf00d`,
        ),
      ).to.equal(true);
      expect(fresh.placed).to.deep.equal([
        { label: 3, zone: 0 },
        { label: 1, zone: 1 },
        { label: 2, zone: 2 },
      ]);
      expect(fresh.restoreLearnerResponse("c-deadbeef[.]c-0badf00d")).to.equal(
        false,
      );
      expect(fresh.restoreLearnerResponse("")).to.equal(false);
      fresh.forgetLearnerResponse();
      expect(fresh.placed).to.deep.equal([]);
    });

    it("resumes from the learner record a listener hands back", async () => {
      await fill(el, RIGHT);
      const s = await check(el);
      const give = (e) => {
        if (e.detail.tag === "image-dropzone") {
          e.detail.record = {
            status: "correct",
            done: true,
            attempts: 1,
            response: s.result.response,
          };
        }
      };
      globalThis.addEventListener("learner-progress-request", give);
      try {
        const fresh = await fixture(template());
        await ready(fresh);
        await waitUntil(() => fresh.showAnswer, "saved answer is put back");
        expect(fresh.placed.length).to.equal(3);
        expect(fresh.isCorrect()).to.equal(true);
        expect(fresh.attempts).to.equal(1);
        // editing drops what the learner did
        fresh.haxeditModeChanged(true);
        await fresh.updateComplete;
        expect(fresh.placed).to.deep.equal([]);
        expect(fresh.showAnswer).to.equal(false);
        expect(fresh.attempts).to.equal(0);
      } finally {
        globalThis.removeEventListener("learner-progress-request", give);
      }
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

    it("saves the same light dom it loaded and no runtime markup", async () => {
      await fill(el, WRONG);
      await check(el);
      const node = await el.haxpreProcessNodeToContent(el);
      const inputs = Array.from(node.querySelectorAll("input:not([slot])"));
      expect(inputs.map((i) => i.outerHTML)).to.deep.equal([
        '<input type="checkbox" value="header" data-zone="Top band" data-x="3" data-y="5" data-width="94" data-height="20">',
        '<input type="checkbox" value="main" data-zone="Center column" data-x="3" data-y="30" data-width="60" data-height="40">',
        '<input type="checkbox" value="footer" data-zone="Bottom band" data-x="3" data-y="75" data-width="94" data-height="20">',
        '<input type="checkbox" value="section">',
      ]);
      expect(node.querySelector("[class^='dz-']")).to.equal(null);
      expect(node.hasAttribute("placed")).to.equal(false);
      expect(node.hasAttribute("held")).to.equal(false);
      // save, then reload: the saved markup loads to the same answers
      const saved = node.outerHTML;
      const holder = document.createElement("div");
      holder.innerHTML = saved;
      const again = holder.firstElementChild;
      again.removeAttribute("show-answer");
      again.removeAttribute("attempts");
      document.body.appendChild(holder);
      try {
        await ready(again);
        const strip = (a) => ({ ...a, userGuess: undefined });
        expect(again.answers.map(strip)).to.deep.equal(el.answers.map(strip));
        const resaved = await again.haxpreProcessNodeToContent(again);
        expect(
          Array.from(resaved.querySelectorAll("input")).map((i) => i.outerHTML),
        ).to.deep.equal(inputs.map((i) => i.outerHTML));
      } finally {
        holder.remove();
      }
    });

    it("edit mode drops learner state and shows every zone outlined with its name", async () => {
      await fill(el, WRONG);
      await check(el);
      el.haxeditModeChanged(true);
      await el.updateComplete;
      expect(el.placed).to.deep.equal([]);
      expect(el.held).to.equal(null);
      expect(el.showAnswer).to.equal(false);
      expect(el.attempts).to.equal(0);
      expect(el.shadowRoot.querySelector("button.dz-zone")).to.equal(null);
      expect(el.shadowRoot.querySelector("button.dz-label")).to.equal(null);
      const zones = Array.from(
        el.shadowRoot.querySelectorAll(".dz-zone.dz-author"),
      );
      expect(zones.map(name)).to.deep.equal([
        "Top band header",
        "Center column main",
        "Bottom band footer",
      ]);
      expect(getComputedStyle(zones[0]).borderTopStyle).to.equal("dashed");
      // the extra label is pointed out to the author
      const labels = Array.from(el.shadowRoot.querySelectorAll(".dz-label"));
      expect(name(labels[3])).to.equal("section extra");
      await expect(el).shadowDom.to.be.accessible();
      el.haxeditModeChanged(false);
      await el.updateComplete;
      expect(el.shadowRoot.querySelectorAll("button.dz-zone").length).to.equal(
        3,
      );
    });

    it("sends nothing and counts no attempt while HAX is editing", async () => {
      await fill(el, RIGHT);
      const events = [];
      el.addEventListener("user-engagement", (e) => events.push(e.detail));
      el.haxeditModeChanged(true);
      el.placed = [
        { label: 0, zone: 0 },
        { label: 1, zone: 1 },
        { label: 2, zone: 2 },
      ];
      await el.checkAnswer();
      await el.updateComplete;
      expect(events.length).to.equal(0);
      expect(el.attempts).to.equal(0);
      expect(el.showAnswer).to.equal(false);
      el.haxeditModeChanged(false);
    });

    it("rebuilds the board when the author edits the answers", async () => {
      await place(el, "header", "Top band");
      el.answers = [
        ...el.answers,
        { label: "aside", zone: "Right column", x: 70, y: 30, width: 27 },
      ];
      await waitUntil(() => el.answers.length === 5 && el.answers[4].correct);
      await el.updateComplete;
      expect(el.placed).to.deep.equal([]);
      expect(zone(el, "Right column").style.height).to.equal("15%");
    });
  });

  describe("phone width", () => {
    afterEach(async () => {
      await setViewport({ width: 800, height: 600 });
    });

    it("fits 360px with no page scroll and zones still on the image", async () => {
      await setViewport({ width: 360, height: 740 });
      await el.updateComplete;
      await waitUntil(
        () => el.shadowRoot.querySelector("img.dz-img").complete,
        "image loads",
      );
      await fill(el, RIGHT);
      expect(document.documentElement.scrollWidth).to.be.at.most(
        globalThis.innerWidth,
      );
      const stage = el.shadowRoot
        .querySelector(".dz-stage")
        .getBoundingClientRect();
      expect(stage.width).to.be.at.most(360);
      el.shadowRoot.querySelectorAll("button.dz-zone").forEach((b) => {
        const r = b.getBoundingClientRect();
        expect(r.left).to.be.at.least(stage.left - 1);
        expect(r.right).to.be.at.most(stage.right + 1);
        expect(r.height).to.be.at.least(24);
      });
    });
  });
});
