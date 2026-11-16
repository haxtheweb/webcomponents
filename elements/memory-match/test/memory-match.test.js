import { html, fixture, expect, waitUntil } from "@open-wc/testing";
import { executeServerCommand } from "@web/test-runner-commands";
import "../memory-match.js";
import { memoryMatchShuffle, memoryMatchImage } from "../memory-match.js";
import {
  XAPI_VERBS,
  XAPI_EXTENSIONS,
  deviceActor,
  setActorProvider,
} from "@haxtheweb/user-action/lib/xapi.js";

const CIRCLE = new URL("../demo/circle.svg", import.meta.url).href;
const make = (id = "mm") =>
  fixture(
    html`<memory-match title="Match the term to its job" id="${id}"
      ><dl>
        <dt>alt</dt>
        <dd>Text alternative for an image</dd>
        <dt>lang</dt>
        <dd>Sets the page's language</dd>
        <dt>nav</dt>
        <dd>Landmark for the main links</dd>
      </dl></memory-match
    >`,
  );
const dealt = async (el) => {
  await waitUntil(() => el._order.length > 0, "cards dealt");
  await el.updateComplete;
};
const cards = (el) => Array.from(el.shadowRoot.querySelectorAll("button.card"));
const name = (button) => button.textContent.replace(/\s+/g, " ").trim();
const status = (el) =>
  el.shadowRoot
    .querySelector(".status")
    .textContent.replace(/\s+/g, " ")
    .trim();
// board positions of the two cards of a pair
const spots = (el, pairId) =>
  el._order.map((c, i) => (c.pair === pairId ? i : -1)).filter((i) => i > -1);
const click = async (el, index) => {
  cards(el)[index].click();
  await el.updateComplete;
};
const matchPair = async (el, pairId) => {
  const s = spots(el, pairId);
  await click(el, s[0]);
  await click(el, s[1]);
};

describe("memory-match", () => {
  it("shuffles with crypto, never Math.random, and keeps every item", () => {
    const real = Math.random;
    Math.random = () => {
      throw new Error("Math.random must not be used");
    };
    try {
      const list = Array.from({ length: 40 }, (_, i) => i);
      const a = memoryMatchShuffle(list);
      expect(a.slice().sort((x, y) => x - y)).to.deep.equal(list);
      expect(a).to.not.deep.equal(list);
      expect(list[0]).to.equal(0);
      expect(memoryMatchShuffle(null)).to.deep.equal([]);
    } finally {
      Math.random = real;
    }
  });

  it("only loads http(s) or relative images", () => {
    expect(memoryMatchImage("circle.svg")).to.equal("circle.svg");
    expect(memoryMatchImage("https://example.org/a.png")).to.equal(
      "https://example.org/a.png",
    );
    expect(memoryMatchImage("javascript:alert(1)")).to.equal("");
    expect(memoryMatchImage(" JaVaScript:alert(1)")).to.equal("");
    expect(memoryMatchImage("data:image/svg+xml,<svg/>")).to.equal("");
    expect(memoryMatchImage("")).to.equal("");
    expect(memoryMatchImage(null)).to.equal("");
  });

  it("renders the frame and deals two face down buttons per pair", async () => {
    const el = await make();
    await dealt(el);
    const root = el.shadowRoot;
    expect(root.querySelector(".ddd-block-title").textContent).to.contain(
      "Match the term to its job",
    );
    expect(root.querySelector(".ddd-block-chip")).to.exist;
    expect(root.querySelector(".ddd-block-footer")).to.exist;
    expect(cards(el).length).to.equal(6);
    cards(el).forEach((b, i) => {
      expect(name(b)).to.equal(`?Card ${i + 1}, face down`);
      expect(b.querySelector('[aria-hidden="true"]').textContent).to.equal("?");
    });
    expect(root.querySelector(".counter").textContent.trim()).to.equal(
      "0 moves",
    );
    expect(
      el.playable.map((p) => p.id).every((id) => /^c-[0-9a-f]{8}/.test(id)),
    ).to.be.true;
  });

  it("render does not reshuffle", async () => {
    const el = await make();
    await dealt(el);
    const before = JSON.stringify(el._order);
    el.requestUpdate();
    await el.updateComplete;
    el.title = "Another title";
    await el.updateComplete;
    expect(JSON.stringify(el._order)).to.equal(before);
  });

  it("passes the a11y audit: dealt, mismatch showing, matched, finished", async () => {
    const el = await make();
    await dealt(el);
    await expect(el).shadowDom.to.be.accessible();
    const ids = el.playable.map((p) => p.id);
    await click(el, spots(el, ids[0])[0]);
    await click(el, spots(el, ids[1])[0]);
    await expect(el).shadowDom.to.be.accessible();
    for (const id of ids) {
      await matchPair(el, id);
    }
    await expect(el).shadowDom.to.be.accessible();
  });

  it("a match stays up, is marked matched and announced; moves are counted", async () => {
    const el = await make();
    await dealt(el);
    const id = el.playable[0].id;
    const s = spots(el, id);
    await click(el, s[0]);
    const first = cards(el)[s[0]];
    expect(first.classList.contains("up")).to.be.true;
    expect(name(first)).to.match(new RegExp(`^Card ${s[0] + 1}, `));
    expect(status(el)).to.match(new RegExp(`^Card ${s[0] + 1}: .+\\.$`));
    await click(el, s[1]);
    s.forEach((i) => {
      const b = cards(el)[i];
      expect(b.classList.contains("matched")).to.be.true;
      expect(name(b)).to.contain("Matched");
      expect(b.querySelector("simple-icon-lite")).to.exist;
    });
    expect(status(el)).to.match(/^Match: .+ and .+\.$/);
    expect(status(el)).to.contain("alt");
    expect(status(el)).to.contain("Text alternative for an image");
    expect(el.shadowRoot.querySelector(".counter").textContent.trim()).to.equal(
      "1 move",
    );
    // choosing a matched card changes nothing
    await click(el, s[0]);
    expect(el._moves).to.equal(1);
    expect(el._matched).to.deep.equal([id]);
  });

  it("a mismatch stays face up until any card is chosen, with no timer", async () => {
    const el = await make();
    await dealt(el);
    const ids = el.playable.map((p) => p.id);
    const a = spots(el, ids[0])[0];
    const b = spots(el, ids[1])[0];
    await click(el, a);
    await click(el, b);
    expect(status(el)).to.match(
      /^No match: .+ and .+\. Choose any card to turn them back\.$/,
    );
    expect(el._up).to.deep.equal([a, b]);
    // still up after time passes: nothing flips on its own
    await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
    expect(cards(el)[a].classList.contains("up")).to.be.true;
    expect(cards(el)[b].classList.contains("up")).to.be.true;
    // choosing one of the two turns both back and turns that one again
    await click(el, a);
    expect(el._up).to.deep.equal([a]);
    expect(cards(el)[b].classList.contains("down")).to.be.true;
    // choosing a third card turns the two back and turns that one
    await click(el, b);
    const c = spots(el, ids[2])[0];
    await click(el, c);
    expect(el._up).to.deep.equal([c]);
    expect(el._moves).to.equal(2);
  });

  it("focus stays on the activated card", async () => {
    const el = await make();
    await dealt(el);
    const ids = el.playable.map((p) => p.id);
    const order = [
      spots(el, ids[0])[0],
      spots(el, ids[1])[0],
      ...spots(el, ids[2]),
    ];
    for (const i of order) {
      const button = cards(el)[i];
      button.focus();
      button.click();
      await el.updateComplete;
      expect(el.shadowRoot.activeElement).to.equal(cards(el)[i]);
      expect(cards(el)[i]).to.equal(button);
    }
  });

  it("finishing shows the done chip and status; start over deals again", async () => {
    const el = await make();
    await dealt(el);
    for (const p of el.playable) {
      await matchPair(el, p.id);
    }
    await el.updateComplete;
    const root = el.shadowRoot;
    expect(root.querySelector(".ddd-block-chip").hasAttribute("data-done")).to
      .be.true;
    expect(status(el)).to.equal("All pairs found in 3 moves");
    root.querySelector(".start-over").click();
    await el.updateComplete;
    expect(el._matched).to.deep.equal([]);
    expect(el._moves).to.equal(0);
    expect(cards(el).every((b) => b.classList.contains("down"))).to.be.true;
    expect(status(el)).to.equal("Cards dealt again.");
  });

  it("supports image sides with alt, and unsafe image addresses are dropped", async () => {
    const el = await fixture(
      html`<memory-match title="Shapes"
        ><dl>
          <dt><img src="${CIRCLE}" alt="A round outline" /></dt>
          <dd>Circle</dd>
          <dt><img src="javascript:alert(1)" alt="bad" />Square</dt>
          <dd>Four sides</dd>
        </dl></memory-match
      >`,
    );
    await dealt(el);
    expect(el.pairs[0]).to.deep.equal({
      a: "",
      aImage: CIRCLE,
      aAlt: "A round outline",
      b: "Circle",
      bImage: "",
      bAlt: "",
    });
    const id = el.playable[0].id;
    await matchPair(el, id);
    const img = el.shadowRoot.querySelector("button.card img");
    expect(img.getAttribute("src")).to.equal(CIRCLE);
    expect(img.getAttribute("alt")).to.equal("A round outline");
    expect(status(el)).to.contain("A round outline");
    await matchPair(el, el.playable[1].id);
    expect(el.shadowRoot.querySelectorAll("button.card img").length).to.equal(
      1,
    );
    await expect(el).shadowDom.to.be.accessible();
  });

  it("light DOM is the content and is never changed by play or save", async () => {
    const el = await make();
    await dealt(el);
    const before = el.innerHTML;
    await matchPair(el, el.playable[0].id);
    el.haxeditModeChanged(true);
    await el.updateComplete;
    expect(el.haxpreProcessNodeToContent(el).innerHTML).to.equal(before);
    el.haxeditModeChanged(false);
    await el.updateComplete;
    expect(el.innerHTML).to.equal(before);
    const again = await fixture(
      `<memory-match title="Match the term to its job">${before}</memory-match>`,
    );
    expect(again.innerHTML).to.equal(before);
    expect(again.playable.map((p) => p.id)).to.deep.equal(
      el.playable.map((p) => p.id),
    );
  });

  it("the HAX form's pairs array rewrites the list; edits to the list are read", async () => {
    const el = await fixture(html`<memory-match></memory-match>`);
    expect(el.shadowRoot.textContent).to.contain("Add pairs to make a game.");
    el.pairs = [
      { a: "one", b: "1" },
      { a: "", aImage: CIRCLE, aAlt: "A circle", b: "round" },
      { a: "bad", aImage: "javascript:alert(1)", b: "x" },
    ];
    await el.updateComplete;
    expect(el.innerHTML).to.equal(
      `<dl><dt>one</dt><dd>1</dd><dt><img src="${CIRCLE}" alt="A circle"></dt><dd>round</dd><dt>bad</dt><dd>x</dd></dl>`,
    );
    await waitUntil(() => el._order.length === 6);
    const dt = document.createElement("dt");
    dt.textContent = "two";
    const dd = document.createElement("dd");
    dd.textContent = "2";
    el.querySelector("dl").append(dt, dd);
    await waitUntil(() => el._order.length === 8);
    expect(el.pairs.length).to.equal(4);
    expect(el.querySelectorAll("dl").length).to.equal(1);
  });

  it("edit mode shows every pair face up, drops learner state and blocks play", async () => {
    const el = await fixture(
      html`<memory-match title="t"
        ><dl>
          <dt>a</dt>
          <dd>1</dd>
          <dt>b</dt>
          <dd>2</dd>
          <dt>orphan</dt>
        </dl></memory-match
      >`,
    );
    await dealt(el);
    expect(el.playable.length).to.equal(2);
    await matchPair(el, el.playable[0].id);
    const seen = [];
    el.addEventListener("user-engagement", (e) => seen.push(e.detail));
    el.haxeditModeChanged(true);
    await el.updateComplete;
    const root = el.shadowRoot;
    expect(el._matched).to.deep.equal([]);
    expect(root.querySelectorAll("button.card").length).to.equal(0);
    expect(
      Array.from(root.querySelectorAll(".board.editing .card")).map((c) =>
        c.textContent.trim(),
      ),
    ).to.deep.equal(["a", "1", "b", "2"]);
    expect(root.querySelector(".incomplete").textContent).to.contain("1");
    await el.turnCard(0);
    await el.turnCard(1);
    expect(el._moves).to.equal(0);
    expect(seen.length).to.equal(0);
    expect(el.restoreLearnerResponse(el.playable[0].id)).to.equal(false);
    await expect(el).shadowDom.to.be.accessible();
    expect(Object.keys(el.haxHooks())).to.include.members([
      "editModeChanged",
      "preProcessNodeToContent",
    ]);
    el.haxeditModeChanged(false);
    await el.updateComplete;
    expect(root.querySelectorAll("button.card").length).to.equal(4);
    expect(root.querySelector(".incomplete")).to.equal(null);
  });

  describe("xAPI", () => {
    beforeEach(() => {
      setActorProvider(() =>
        deviceActor(
          "4b9f1c1e-0000-4000-8000-0000000000c2",
          "https://example.org/",
        ),
      );
    });
    afterEach(() => setActorProvider(null));

    it("sends progressed per pair and completed once, all conformant, no moves", async () => {
      const el = await make("mm-x");
      await dealt(el);
      const seen = [];
      el.addEventListener("user-engagement", (e) => seen.push(e.detail));
      const ids = el.playable.map((p) => p.id);
      // a mismatch sends nothing
      await click(el, spots(el, ids[0])[0]);
      await click(el, spots(el, ids[1])[0]);
      expect(seen.length).to.equal(0);
      for (const id of ids) {
        await matchPair(el, id);
      }
      expect(seen.map((d) => d.activityDisplay)).to.deep.equal([
        "progressed",
        "progressed",
        "progressed",
        "completed",
      ]);
      for (const d of seen) {
        const r = await executeServerCommand("xapi-validate", d.statement);
        expect(r.errors).to.deep.equal([]);
        expect(JSON.stringify(d.statement)).to.not.contain("moves");
        expect(Object.keys(d.statement.result.extensions)).to.deep.equal([
          XAPI_EXTENSIONS.progress,
        ]);
      }
      const first = seen[0].statement;
      expect(first.verb.id).to.equal(XAPI_VERBS.progressed);
      expect(first.object.id.endsWith("#mm-x")).to.equal(true);
      expect(first.result.completion).to.equal(false);
      expect(first.result.response).to.equal(ids[0]);
      expect(first.result.extensions[XAPI_EXTENSIONS.progress]).to.be.closeTo(
        1 / 3,
        0.0001,
      );
      expect(first.context.extensions[XAPI_EXTENSIONS.element]).to.equal(
        "memory-match",
      );
      const last = seen[3].statement;
      expect(last.verb.id).to.equal(XAPI_VERBS.completed);
      expect(last.result.completion).to.equal(true);
      expect(last.result.response).to.equal(ids.join("[,]"));
      // one completion per visit
      el.startOver();
      await el.updateComplete;
      for (const id of ids) {
        await matchPair(el, id);
      }
      expect(
        seen.filter((d) => d.activityDisplay === "completed").length,
      ).to.equal(1);
    });

    it("declares its vocabulary", () => {
      const v = customElements.get("memory-match").xapiVocabulary;
      expect(v.tag).to.equal("memory-match");
      expect(v.verbs).to.deep.equal(["progressed", "completed"]);
      expect(v.countsTowardCompletion).to.equal(true);
    });

    it("restores matched pairs from the learner record, ignoring stale ids", async () => {
      let response = "";
      const asked = [];
      const answer = (e) => {
        asked.push(e.detail);
        if (e.detail.tag === "memory-match" && response) {
          e.detail.record = { response };
        }
      };
      globalThis.addEventListener("learner-progress-request", answer);
      try {
        const el = await make("mm-r");
        await dealt(el);
        expect(asked[0].activityId.endsWith("#mm-r")).to.equal(true);
        expect(el._matched).to.deep.equal([]);
        const id = el.playable[1].id;
        response = [id, "c-00000000"].join("[,]");
        globalThis.dispatchEvent(new CustomEvent("learner-progress-ready"));
        await el.updateComplete;
        expect(el._matched).to.deep.equal([id]);
        expect(
          el.shadowRoot.querySelectorAll("button.card.matched").length,
        ).to.equal(2);
        globalThis.dispatchEvent(new CustomEvent("learner-progress-cleared"));
        await el.updateComplete;
        expect(el._matched).to.deep.equal([]);
        expect(el.restoreLearnerResponse(id)).to.equal(true);
        el.forgetLearnerResponse();
        expect(el._matched).to.deep.equal([]);
      } finally {
        globalThis.removeEventListener("learner-progress-request", answer);
      }
    });
  });

  it("at phone width: two columns, cards at least 44px tall, text wraps, no overflow", async () => {
    const wrap = await fixture(
      html`<div style="width: 328px">
        <memory-match title="Long"
          ><dl>
            <dt>Pneumonoultramicroscopicsilicovolcanoconiosis</dt>
            <dd>A very long word that has to wrap inside its card</dd>
            <dt>b</dt>
            <dd>2</dd>
          </dl></memory-match
        >
      </div>`,
    );
    const el = wrap.querySelector("memory-match");
    await dealt(el);
    for (const p of el.playable) {
      await matchPair(el, p.id);
    }
    const rects = cards(el).map((b) => b.getBoundingClientRect());
    expect(new Set(rects.map((r) => Math.round(r.left))).size).to.equal(2);
    rects.forEach((r) => {
      expect(r.height).to.be.at.least(44);
      expect(r.right).to.be.at.most(wrap.getBoundingClientRect().right + 0.5);
    });
    cards(el).forEach((b) =>
      expect(b.scrollWidth).to.be.at.most(b.clientWidth + 1),
    );
    expect(wrap.scrollWidth).to.be.at.most(wrap.clientWidth);
  });

  it("Start over stays in place whatever the message length", async () => {
    for (const width of ["720px", "328px"]) {
      const wrap = await fixture(
        html`<div style="width: ${width}">
          <memory-match title="Steady"
            ><dl>
              <dt>a</dt>
              <dd>1</dd>
              <dt>b</dt>
              <dd>2</dd>
            </dl></memory-match
          >
        </div>`,
      );
      const el = wrap.querySelector("memory-match");
      await dealt(el);
      const spots = [];
      for (const text of [
        "",
        "Matched.",
        "No match: a very long first card and a very long second card. Choose any card to turn them back.",
      ]) {
        el._status = text;
        await el.updateComplete;
        const b = el.shadowRoot.querySelector(".start-over");
        const r = b.getBoundingClientRect();
        const h = el.getBoundingClientRect();
        spots.push(
          `${Math.round(r.left - h.left)},${Math.round(r.top - h.top)}`,
        );
      }
      expect(new Set(spots).size, `${width}: ${spots.join(" / ")}`).to.equal(1);
    }
  });

  it("has no transition or animation on the cards", async () => {
    const el = await make();
    await dealt(el);
    cards(el).forEach((b) => {
      const cs = getComputedStyle(b);
      expect(parseFloat(cs.transitionDuration)).to.equal(0);
      expect(cs.animationName).to.equal("none");
    });
  });

  it("removes its observers and listeners when disconnected", async () => {
    const el = await make();
    el.remove();
    expect(el._observer).to.equal(null);
    expect(el._progressListeners).to.equal(null);
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

    it("passes the a11y audit in dark mode: dealt, mismatch, matched", async () => {
      const el = await make();
      await dealt(el);
      await expect(el).shadowDom.to.be.accessible();
      const ids = el.playable.map((p) => p.id);
      await matchPair(el, ids[0]);
      await click(el, spots(el, ids[1])[0]);
      await click(el, spots(el, ids[2])[0]);
      await expect(el).shadowDom.to.be.accessible();
    });
  });
});
