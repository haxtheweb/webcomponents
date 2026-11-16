import { html, fixture, expect, waitUntil } from "@open-wc/testing";
import { executeServerCommand } from "@web/test-runner-commands";
import "../word-search.js";
import {
  XAPI_VERBS,
  XAPI_EXTENSIONS,
  componentId,
  deviceActor,
  setActorProvider,
} from "@haxtheweb/user-action/lib/xapi.js";

const WORDS = ["HTML", "CSS", "DOM"];
const make = (attrs = {}) =>
  fixture(
    html`<word-search
      title="Find three web words"
      id="${attrs.id || "ws"}"
      ?diagonal="${attrs.diagonal}"
      ?backwards="${attrs.backwards}"
      ><ul>
        <li>HTML</li>
        <li>CSS</li>
        <li>DOM</li>
      </ul></word-search
    >`,
  );
const cellEl = (el, cell) =>
  el.shadowRoot.querySelector(`[data-row="${cell[0]}"][data-col="${cell[1]}"]`);
const entry = (el, word) => el._puzzle.placed.find((e) => e.word === word);
// find a word by clicking its first and last letter
const find = async (el, word, reverse = false) => {
  const cells = entry(el, word).cells;
  const ends = [cells[0], cells[cells.length - 1]];
  if (reverse) ends.reverse();
  cellEl(el, ends[0]).click();
  await el.updateComplete;
  cellEl(el, ends[1]).click();
  await el.updateComplete;
};
const status = (el) =>
  el.shadowRoot.querySelector(".status").textContent.trim();
const key = (target, k) =>
  target.dispatchEvent(
    new KeyboardEvent("keydown", { key: k, bubbles: true, composed: true }),
  );

describe("word-search", () => {
  it("renders the frame, the grid and the numbered word list", async () => {
    const el = await make();
    const root = el.shadowRoot;
    expect(root.querySelector(".ddd-block-title").textContent).to.contain(
      "Find three web words",
    );
    expect(root.querySelector(".ddd-block-chip")).to.exist;
    expect(root.querySelector(".ddd-block-footer")).to.exist;
    const size = el._puzzle.size;
    expect(root.querySelectorAll('[role="gridcell"]').length).to.equal(
      size * size,
    );
    expect(root.querySelectorAll('[role="row"]').length).to.equal(size);
    expect(
      Array.from(root.querySelectorAll(".words .word")).map(
        (n) => n.textContent,
      ),
    ).to.deep.equal(WORDS);
    expect(root.querySelector(".counter").textContent.trim()).to.equal(
      "0 of 3",
    );
    // one tab stop
    expect(root.querySelectorAll('.cell[tabindex="0"]').length).to.equal(1);
  });

  it("passes the a11y audit, default and with words found", async () => {
    const el = await make();
    await expect(el).shadowDom.to.be.accessible();
    await find(el, "HTML");
    cellEl(el, [0, 0]).click();
    await el.updateComplete;
    await expect(el).shadowDom.to.be.accessible();
    await find(el, "CSS");
    await find(el, "DOM");
    await expect(el).shadowDom.to.be.accessible();
  });

  it("two taps find a word, in either tap order, and announce it", async () => {
    const el = await make();
    const cells = entry(el, "HTML").cells;
    cellEl(el, cells[0]).click();
    await el.updateComplete;
    expect(status(el)).to.equal(
      `Start at H, row ${cells[0][0] + 1} column ${cells[0][1] + 1}. Now choose the last letter.`,
    );
    expect(cellEl(el, cells[0]).getAttribute("aria-selected")).to.equal("true");
    cellEl(el, cells[3]).click();
    await el.updateComplete;
    expect(status(el)).to.equal("Found HTML.");
    cells.forEach((c) => {
      const node = cellEl(el, c);
      expect(node.classList.contains("found")).to.equal(true);
      expect(node.querySelector(".number").textContent).to.contain("1");
      expect(node.textContent).to.contain("found, word 1");
    });
    const item = el.shadowRoot.querySelectorAll(".words li")[0];
    expect(item.classList.contains("found")).to.equal(true);
    expect(item.textContent).to.contain("found");
    // last letter first also counts
    await find(el, "CSS", true);
    expect(status(el)).to.equal("Found CSS.");
    expect(el.shadowRoot.querySelector(".counter").textContent.trim()).to.equal(
      "2 of 3",
    );
  });

  it("says when there is no word, and a found word is not found twice", async () => {
    const el = await make();
    await find(el, "HTML");
    await find(el, "HTML");
    expect(status(el)).to.equal("No word there.");
    // not on a straight line
    cellEl(el, [0, 0]).click();
    await el.updateComplete;
    cellEl(el, [1, 2]).click();
    await el.updateComplete;
    expect(status(el)).to.equal("No word there.");
    expect(Object.keys(el._found).length).to.equal(1);
    // same letter twice clears the start
    cellEl(el, [0, 0]).click();
    await el.updateComplete;
    cellEl(el, [0, 0]).click();
    await el.updateComplete;
    expect(status(el)).to.equal("Start cleared.");
    expect(el._start).to.equal(null);
  });

  it("keyboard: arrows rove focus, Enter and Space choose, Escape clears", async () => {
    const el = await make();
    const first = cellEl(el, [0, 0]);
    first.focus();
    key(first, "ArrowRight");
    await el.updateComplete;
    expect(el.shadowRoot.activeElement).to.equal(cellEl(el, [0, 1]));
    key(cellEl(el, [0, 1]), "ArrowDown");
    await el.updateComplete;
    expect(el.shadowRoot.activeElement).to.equal(cellEl(el, [1, 1]));
    key(cellEl(el, [1, 1]), "ArrowUp");
    await el.updateComplete;
    key(cellEl(el, [0, 1]), "ArrowUp");
    await el.updateComplete;
    expect(el.shadowRoot.activeElement).to.equal(cellEl(el, [0, 1]));
    key(cellEl(el, [0, 1]), "End");
    await el.updateComplete;
    expect(el._focus).to.deep.equal([0, el._puzzle.size - 1]);
    key(el.shadowRoot.activeElement, "Home");
    await el.updateComplete;
    expect(el._focus).to.deep.equal([0, 0]);
    expect(
      el.shadowRoot.querySelectorAll('.cell[tabindex="0"]').length,
    ).to.equal(1);
    key(cellEl(el, [0, 0]), "Enter");
    await el.updateComplete;
    expect(el._start).to.deep.equal([0, 0]);
    key(cellEl(el, [0, 0]), "Escape");
    await el.updateComplete;
    expect(el._start).to.equal(null);
    expect(status(el)).to.equal("Start cleared.");
    // find a word with the keyboard only
    const cells = entry(el, "DOM").cells;
    key(cellEl(el, cells[0]), " ");
    await el.updateComplete;
    key(cellEl(el, cells[2]), "Enter");
    await el.updateComplete;
    expect(status(el)).to.equal("Found DOM.");
  });

  it("a mouse drag from first to last letter finds the word", async () => {
    const el = await make();
    const cells = entry(el, "CSS").cells;
    const from = cellEl(el, cells[0]);
    const to = cellEl(el, cells[2]).getBoundingClientRect();
    from.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        composed: true,
        pointerType: "mouse",
        button: 0,
      }),
    );
    from.dispatchEvent(
      new PointerEvent("pointerup", {
        bubbles: true,
        composed: true,
        pointerType: "mouse",
        clientX: to.left + to.width / 2,
        clientY: to.top + to.height / 2,
      }),
    );
    await el.updateComplete;
    expect(status(el)).to.equal("Found CSS.");
  });

  it("diagonal lines only count when diagonal is on", async () => {
    const el = await make();
    expect(el._line([0, 0], [2, 2])).to.deep.equal([]);
    el.diagonal = true;
    await el.updateComplete;
    expect(el._line([0, 0], [2, 2])).to.deep.equal([
      [0, 0],
      [1, 1],
      [2, 2],
    ]);
    expect(el._line([0, 0], [1, 2])).to.deep.equal([]);
  });

  it("finishing shows the done chip and status; start over clears", async () => {
    const el = await make();
    for (const w of WORDS) {
      await find(el, w);
    }
    await el.updateComplete;
    const root = el.shadowRoot;
    expect(root.querySelector(".ddd-block-chip").hasAttribute("data-done")).to
      .be.true;
    expect(status(el)).to.equal("All 3 words found");
    expect(root.querySelector(".ddd-block").hasAttribute("data-complete")).to.be
      .true;
    root.querySelector(".start-over").click();
    await el.updateComplete;
    expect(Object.keys(el._found).length).to.equal(0);
    expect(root.querySelector(".found")).to.equal(null);
    expect(status(el)).to.equal("Started over.");
  });

  it("light DOM is the content and is never changed", async () => {
    const el = await make();
    const before = el.innerHTML;
    await find(el, "HTML");
    el.haxeditModeChanged(true);
    await el.updateComplete;
    const saved = el.haxpreProcessNodeToContent(el);
    expect(saved.innerHTML).to.equal(before);
    el.haxeditModeChanged(false);
    await el.updateComplete;
    expect(el.innerHTML).to.equal(before);
    // reload round trip
    const again = await fixture(
      `<word-search title="Find three web words">${before}</word-search>`,
    );
    expect(again.innerHTML).to.equal(before);
    expect(again._puzzle.grid).to.deep.equal(el._puzzle.grid);
  });

  it("the HAX form's words array rewrites the list; edits to the list are read", async () => {
    const el = await make();
    el.words = [{ word: "LIT" }, { word: "ARIA" }];
    await el.updateComplete;
    expect(
      Array.from(el.querySelectorAll("li")).map((li) => li.textContent),
    ).to.deep.equal(["LIT", "ARIA"]);
    expect(el.querySelectorAll("ul").length).to.equal(1);
    await waitUntil(() => el._puzzle.placed.length === 2);
    const li = document.createElement("li");
    li.textContent = "SLOT";
    el.querySelector("ul").appendChild(li);
    await waitUntil(() => el._puzzle.placed.length === 3);
    expect(el.words).to.deep.equal([
      { word: "LIT" },
      { word: "ARIA" },
      { word: "SLOT" },
    ]);
    // an empty element gets a list when the form adds words
    const empty = await fixture(html`<word-search></word-search>`);
    expect(empty.shadowRoot.textContent).to.contain(
      "Add words to make a puzzle.",
    );
    empty.words = [{ word: "cat" }];
    await empty.updateComplete;
    expect(empty.innerHTML).to.equal("<ul><li>cat</li></ul>");
  });

  it("edit mode drops learner state, blocks play and reports words that do not fit", async () => {
    const el = await fixture(
      html`<word-search title="t" size="4"
        ><ul>
          <li>cat</li>
          <li>hippopotamus</li>
        </ul></word-search
      >`,
    );
    expect(el.shadowRoot.querySelector(".unplaced")).to.equal(null);
    expect(
      Array.from(el.shadowRoot.querySelectorAll(".words .word")).map(
        (n) => n.textContent,
      ),
    ).to.deep.equal(["cat"]);
    await find(el, "CAT");
    expect(Object.keys(el._found).length).to.equal(1);
    const seen = [];
    el.addEventListener("user-engagement", (e) => seen.push(e.detail));
    el.haxeditModeChanged(true);
    await el.updateComplete;
    expect(Object.keys(el._found).length).to.equal(0);
    expect(el.shadowRoot.querySelector(".unplaced").textContent).to.contain(
      "hippopotamus",
    );
    await find(el, "CAT");
    expect(Object.keys(el._found).length).to.equal(0);
    expect(seen.length).to.equal(0);
    expect(el.restoreLearnerResponse(componentId("CAT"))).to.equal(false);
    expect(
      el.shadowRoot.querySelectorAll('.cell[tabindex="0"]').length,
    ).to.equal(0);
    await expect(el).shadowDom.to.be.accessible();
    expect(Object.keys(el.haxHooks())).to.include.members([
      "editModeChanged",
      "preProcessNodeToContent",
    ]);
  });

  describe("xAPI", () => {
    beforeEach(() => {
      setActorProvider(() =>
        deviceActor(
          "4b9f1c1e-0000-4000-8000-0000000000c1",
          "https://example.org/",
        ),
      );
    });
    afterEach(() => setActorProvider(null));

    it("sends progressed per word and completed once, all conformant", async () => {
      const el = await make({ id: "ws-x" });
      const seen = [];
      el.addEventListener("user-engagement", (e) => seen.push(e.detail));
      for (const w of WORDS) {
        await find(el, w);
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
      }
      const first = seen[0].statement;
      expect(first.verb.id).to.equal(XAPI_VERBS.progressed);
      expect(first.object.id.endsWith("#ws-x")).to.equal(true);
      expect(first.result.completion).to.equal(false);
      expect(first.result.response).to.equal(componentId("HTML"));
      expect(first.result.extensions[XAPI_EXTENSIONS.progress]).to.be.closeTo(
        1 / 3,
        0.0001,
      );
      expect(first.context.extensions[XAPI_EXTENSIONS.element]).to.equal(
        "word-search",
      );
      const last = seen[3].statement;
      expect(last.verb.id).to.equal(XAPI_VERBS.completed);
      expect(last.result.completion).to.equal(true);
      expect(last.result.score).to.include({ raw: 3, max: 3 });
      expect(last.result.response).to.equal(
        WORDS.map((w) => componentId(w)).join("[,]"),
      );
      expect(last.result.response).to.match(/^c-[0-9a-f]{8}/);
      // one completion per visit
      el.startOver();
      await el.updateComplete;
      for (const w of WORDS) {
        await find(el, w);
      }
      expect(
        seen.filter((d) => d.activityDisplay === "completed").length,
      ).to.equal(1);
    });

    it("declares its vocabulary", () => {
      const v = customElements.get("word-search").xapiVocabulary;
      expect(v.tag).to.equal("word-search");
      expect(v.verbs).to.deep.equal(["progressed", "completed"]);
      expect(v.countsTowardCompletion).to.equal(true);
    });

    it("restores found words from the learner record, ignoring stale ids", async () => {
      const asked = [];
      const answer = (e) => {
        asked.push(e.detail);
        if (e.detail.tag === "word-search") {
          e.detail.record = {
            response: [componentId("CSS"), "c-00000000"].join("[,]"),
          };
        }
      };
      globalThis.addEventListener("learner-progress-request", answer);
      try {
        const el = await make({ id: "ws-r" });
        await el.updateComplete;
        expect(asked[0].activityId.endsWith("#ws-r")).to.equal(true);
        expect(Object.keys(el._found)).to.deep.equal([componentId("CSS")]);
        expect(
          el.shadowRoot.querySelectorAll(".words li.found").length,
        ).to.equal(1);
        // cleared by the record
        globalThis.dispatchEvent(new CustomEvent("learner-progress-cleared"));
        await el.updateComplete;
        expect(Object.keys(el._found).length).to.equal(0);
        // asked again when a record becomes ready
        globalThis.dispatchEvent(new CustomEvent("learner-progress-ready"));
        await el.updateComplete;
        expect(Object.keys(el._found).length).to.equal(1);
        el.forgetLearnerResponse();
        expect(Object.keys(el._found).length).to.equal(0);
      } finally {
        globalThis.removeEventListener("learner-progress-request", answer);
      }
    });
  });

  it("fits 360px without page scroll and keeps cells at least 24px", async () => {
    const wrap = await fixture(
      html`<div style="width: 328px">
        <word-search title="Wide" size="16"
          ><ul>
            <li>alpha</li>
            <li>beta</li>
          </ul></word-search
        >
      </div>`,
    );
    const el = wrap.querySelector("word-search");
    await el.updateComplete;
    expect(el.getBoundingClientRect().width).to.be.at.most(328);
    const scroll = el.shadowRoot.querySelector(".grid-scroll");
    expect(scroll.scrollWidth).to.be.above(scroll.clientWidth);
    expect(wrap.scrollWidth).to.be.at.most(wrap.clientWidth);
    const cell = cellEl(el, [0, 0]).getBoundingClientRect();
    expect(cell.width).to.be.at.least(24);
    expect(cell.height).to.be.at.least(24);
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

    it("passes the a11y audit in dark mode, with words found", async () => {
      const el = await make();
      await find(el, "HTML");
      cellEl(el, [0, 0]).click();
      await el.updateComplete;
      await expect(el).shadowDom.to.be.accessible();
      await find(el, "CSS");
      await find(el, "DOM");
      await expect(el).shadowDom.to.be.accessible();
    });
  });
});
