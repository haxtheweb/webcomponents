import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import {
  executeServerCommand,
  sendKeys,
  setViewport,
} from "@web/test-runner-commands";
import "../quick-poll.js";
import {
  componentId,
  deviceActor,
  setActorProvider,
} from "@haxtheweb/user-action/lib/xapi.js";

const O = ["Open DevTools", "Rewrite the CSS", "Ask a classmate"];
const id = (i) => componentId(O[i]);
const QUESTION = "When a layout breaks, what do you do first?";

async function poll(attrs = {}) {
  const el = await fixture(
    html`<quick-poll
      question="${QUESTION}"
      show-results="${attrs.showResults || "after"}"
      closes="${attrs.closes || ""}"
      endpoint="${attrs.endpoint || ""}"
      ?allow-change="${attrs.allowChange}"
    >
      <input value="${O[0]}" /><input value="${O[1]}" /><input
        value="${O[2]}"
      />
    </quick-poll>`,
  );
  await waitUntil(() => el.choices.length === 3, "options were read");
  await el.updateComplete;
  return el;
}
const $ = (el, sel) => el.shadowRoot.querySelector(sel);
const $$ = (el, sel) => Array.from(el.shadowRoot.querySelectorAll(sel));
const text = (node) => node.textContent.replace(/\s+/g, " ").trim();

async function pick(el, i) {
  $$(el, "input[type='radio']")[i].click();
  await el.updateComplete;
}
async function vote(el, i) {
  await pick(el, i);
  $(el, "#vote").click();
  await waitUntil(() => el.vote === id(i), "the vote was cast");
  await el.updateComplete;
}
function listen(el, name) {
  const events = [];
  el.addEventListener(name, (e) => events.push(e.detail));
  return events;
}
// answer fetch with what the test queues; returns the calls and a restore
function stubFetch(handler) {
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = (url, init) => {
    calls.push({ url: String(url), init: init || {} });
    return handler(String(url), init || {});
  };
  return {
    calls,
    restore() {
      globalThis.fetch = original;
    },
  };
}
const json = (body, ok = true) =>
  Promise.resolve({ ok, json: () => Promise.resolve(body) });
// answer learner-progress-request with a record
function withRecord(record) {
  const handler = (e) => {
    if (e.detail && e.detail.tag === "quick-poll") {
      e.detail.record = record;
    }
  };
  globalThis.addEventListener("learner-progress-request", handler);
  return () =>
    globalThis.removeEventListener("learner-progress-request", handler);
}
function editing(on) {
  const saved = globalThis.HaxStore;
  globalThis.HaxStore = {
    requestAvailability: () => ({ editMode: on }),
  };
  return () => {
    if (saved === undefined) {
      delete globalThis.HaxStore;
    } else {
      globalThis.HaxStore = saved;
    }
  };
}

describe("quick-poll", () => {
  before(() =>
    setActorProvider(() =>
      deviceActor(
        "4b9f1c1e-0000-4000-8000-0000000000c7",
        "https://example.org/",
      ),
    ),
  );
  after(() => setActorProvider(null));

  describe("frame and options", () => {
    it("renders the block frame with the question as the title", async () => {
      const el = await poll();
      expect($(el, ".ddd-block")).to.exist;
      expect(text($(el, ".ddd-block-label"))).to.equal("Poll · anonymous");
      expect(text($(el, ".ddd-block-title"))).to.equal(QUESTION);
      expect($(el, ".ddd-block-chip simple-icon-lite").icon).to.equal(
        "social:poll",
      );
      expect($(el, "#vote")).to.exist;
    });

    it("is a real radio group named by the question", async () => {
      const el = await poll();
      const group = $(el, "[role='radiogroup']");
      expect(group.getAttribute("aria-labelledby")).to.equal("question");
      const radios = $$(el, "input[type='radio']");
      expect(radios.length).to.equal(3);
      expect(new Set(radios.map((r) => r.name)).size).to.equal(1);
      expect(radios.map((r) => r.value)).to.deep.equal([id(0), id(1), id(2)]);
      expect($$(el, ".option-text").map(text)).to.deep.equal(O);
    });

    it("moves and selects with the arrow keys", async () => {
      const el = await poll();
      const radios = $$(el, "input[type='radio']");
      radios[0].focus();
      await sendKeys({ press: "Space" });
      await el.updateComplete;
      expect(radios[0].checked).to.equal(true);
      await sendKeys({ press: "ArrowDown" });
      await el.updateComplete;
      expect(radios[1].checked).to.equal(true);
      expect(el.shadowRoot.activeElement).to.equal(radios[1]);
    });

    it("toggles directions that say when results show", async () => {
      const el = await poll({ showResults: "never" });
      const toggle = $(el, "#directions-toggle");
      expect($(el, "#directions").hidden).to.equal(true);
      toggle.click();
      await el.updateComplete;
      expect($(el, "#directions").hidden).to.equal(false);
      expect(toggle.getAttribute("aria-expanded")).to.equal("true");
      expect(text($(el, "#directions"))).to.contain("no right answer");
      expect(text($(el, "#directions"))).to.contain("instructor");
    });

    it("leaves the authored light DOM unchanged", async () => {
      const el = await poll();
      const before = el.innerHTML;
      await vote(el, 1);
      expect(el.innerHTML).to.equal(before);
      expect(el.querySelectorAll("input").length).to.equal(3);
    });

    it("asks for options when there are fewer than two", async () => {
      const el = await fixture(html`<quick-poll question="Q"></quick-poll>`);
      await el.updateComplete;
      expect(text($(el, ".empty"))).to.contain("at least two");
      expect($(el, "#vote")).to.equal(null);
    });
  });

  describe("voting", () => {
    it("says what is needed when nothing is picked", async () => {
      const el = await poll();
      const votes = listen(el, "quick-poll-vote");
      $(el, "#vote").click();
      await el.updateComplete;
      const status = $(el, "#status");
      expect(status.getAttribute("role")).to.equal("status");
      expect(status.getAttribute("data-status")).to.equal("needs");
      expect(text(status)).to.equal("Pick an option first.");
      expect(el.vote).to.equal("");
      expect(votes.length).to.equal(0);
      // picking clears the message
      await pick(el, 0);
      expect(text(status)).to.equal("");
    });

    it("casts the vote, fires quick-poll-vote and shows the receipt", async () => {
      const el = await poll();
      const votes = listen(el, "quick-poll-vote");
      await vote(el, 1);
      expect(votes.length).to.equal(1);
      expect(votes[0].choice).to.equal(id(1));
      expect(votes[0].label).to.equal(O[1]);
      expect(votes[0].previous).to.equal("");
      expect(votes[0].activityId).to.be.a("string").and.not.equal("");
      // anonymous: only the activity and the choice
      expect(Object.keys(votes[0]).sort()).to.deep.equal([
        "activityId",
        "choice",
        "label",
        "previous",
      ]);
      // no results source: the vote only
      expect(text($(el, ".receipt"))).to.equal(`Your vote is in: ${O[1]}.`);
      expect($(el, ".bars")).to.equal(null);
      expect($(el, ".note")).to.equal(null);
      expect(text($(el, "#status"))).to.equal("Thanks, your vote counted.");
      // cannot change it in the same visit
      expect($(el, "#vote")).to.equal(null);
      expect($(el, "#change")).to.equal(null);
      expect($$(el, "input[type='radio']").length).to.equal(0);
      // the chip shows done, and focus is on the message, not lost
      expect($(el, ".ddd-block-chip").hasAttribute("data-done")).to.equal(true);
      expect(el.shadowRoot.activeElement).to.equal($(el, "#status"));
    });

    it("lets the vote change only with allow-change", async () => {
      const el = await poll({ allowChange: true });
      const votes = listen(el, "quick-poll-vote");
      const sent = listen(el, "user-engagement");
      await vote(el, 0);
      $(el, "#change").click();
      await el.updateComplete;
      const radios = $$(el, "input[type='radio']");
      expect(radios[0].checked).to.equal(true);
      // keeping the vote sends nothing
      $(el, "#keep").click();
      await el.updateComplete;
      expect(votes.length).to.equal(1);
      $(el, "#change").click();
      await el.updateComplete;
      await vote(el, 2);
      expect(votes.length).to.equal(2);
      expect(votes[1].choice).to.equal(id(2));
      expect(votes[1].previous).to.equal(id(0));
      expect(sent.length).to.equal(2);
      // voting for the same option again sends nothing
      $(el, "#change").click();
      await el.updateComplete;
      $(el, "#vote").click();
      await el.updateComplete;
      expect(votes.length).to.equal(2);
    });
  });

  describe("results", () => {
    it("shows results set through the property, with text for everything", async () => {
      const el = await poll();
      el.results = { [id(0)]: 6, [id(1)]: 3, [id(2)]: 1 };
      await el.updateComplete;
      // not before voting
      expect($(el, ".bars")).to.equal(null);
      await vote(el, 1);
      const rows = $$(el, ".bar");
      expect(rows.length).to.equal(3);
      expect(rows.map((r) => text(r.querySelector(".label")))).to.deep.equal(O);
      expect(text(rows[0].querySelector(".num"))).to.equal("60% · 6 votes");
      expect(text(rows[1].querySelector(".num"))).to.equal("30% · 3 votes");
      // own choice: words and an icon, not colour alone
      const mine = rows[1].querySelector(".mine");
      expect(text(mine)).to.equal("your vote");
      expect(mine.querySelector("simple-icon-lite")).to.exist;
      expect(rows[0].querySelector(".mine")).to.equal(null);
      // the bar is decoration
      expect(
        rows[0].querySelector(".fill").getAttribute("aria-hidden"),
      ).to.equal("true");
      expect(text($(el, ".responses"))).to.equal("10 responses");
      // a host updating the counts after the vote
      el.results = { [id(0)]: 6, [id(1)]: 4, [id(2)]: 1 };
      await el.updateComplete;
      expect(text($$(el, ".num")[1])).to.equal("36% · 4 votes");
    });

    it("ignores unknown ids and bad counts", async () => {
      const el = await poll();
      el.results = { [id(0)]: "2", [id(1)]: -5, "c-ffffffff": 40, x: NaN };
      await vote(el, 0);
      expect($$(el, ".num").map(text)).to.deep.equal([
        "100% · 2 votes",
        "0% · 0 votes",
        "0% · 0 votes",
      ]);
      expect(text($(el, ".responses"))).to.equal("2 responses");
    });

    it("posts the vote to the endpoint and shows the counts it answers", async () => {
      const net = stubFetch(() =>
        json({ counts: { [id(0)]: 1, [id(1)]: 3, [id(2)]: 0 } }),
      );
      try {
        const el = await poll({ endpoint: "/api/poll" });
        // nothing is asked for before the learner votes
        expect(net.calls.length).to.equal(0);
        await vote(el, 1);
        await waitUntil(() => $(el, ".bars"), "results arrived");
        expect(net.calls.length).to.equal(1);
        const call = net.calls[0];
        expect(call.url).to.equal(`${location.origin}/api/poll`);
        expect(call.init.method).to.equal("POST");
        expect(call.init.credentials).to.equal("same-origin");
        const body = JSON.parse(call.init.body);
        expect(Object.keys(body).sort()).to.deep.equal([
          "activityId",
          "choice",
        ]);
        expect(body.choice).to.equal(id(1));
        expect(text($$(el, ".num")[1])).to.equal("75% · 3 votes");
        expect(el.results).to.deep.equal({
          [id(0)]: 1,
          [id(1)]: 3,
          [id(2)]: 0,
        });
      } finally {
        net.restore();
      }
    });

    it("sends no credentials to another origin", async () => {
      const net = stubFetch(() => json({ counts: {} }));
      try {
        const el = await poll({ endpoint: "https://votes.example.org/poll" });
        await vote(el, 0);
        expect(net.calls.length).to.equal(1);
        expect(net.calls[0].init.credentials).to.equal("omit");
      } finally {
        net.restore();
      }
    });

    it("never calls an endpoint that is not http(s)", async () => {
      const net = stubFetch(() => json({ counts: {} }));
      try {
        for (const endpoint of [
          "javascript:alert(1)",
          "data:application/json,{}",
          "ftp://example.org/poll",
          "https://user:pass@example.org/poll",
        ]) {
          const el = await poll({ endpoint });
          await vote(el, 0);
          expect(text($(el, ".receipt"))).to.contain(O[0]);
        }
        expect(net.calls.length).to.equal(0);
      } finally {
        net.restore();
      }
    });

    it("keeps the vote and says results are unavailable when the endpoint fails", async () => {
      const net = stubFetch(() => Promise.reject(new Error("offline")));
      try {
        const el = await poll({ endpoint: "/api/poll" });
        await vote(el, 2);
        await waitUntil(() => $(el, ".note"), "the failure was noted");
        expect(el.vote).to.equal(id(2));
        expect(text($(el, ".receipt"))).to.equal(`Your vote is in: ${O[2]}.`);
        expect(text($(el, ".note"))).to.equal(
          "Results are unavailable right now.",
        );
        expect($(el, ".bars")).to.equal(null);
      } finally {
        net.restore();
      }
      // a bad answer is a failure too
      const bad = stubFetch(() => json({ nope: true }));
      try {
        const el = await poll({ endpoint: "/api/poll" });
        await vote(el, 0);
        await waitUntil(() => $(el, ".note"), "the bad answer was noted");
        expect(el.results).to.equal(null);
      } finally {
        bad.restore();
      }
    });

    it("does not let an older fetch overwrite newer results", async () => {
      let release;
      const net = stubFetch(
        () =>
          new Promise((resolve) => {
            release = () =>
              resolve({
                ok: true,
                json: () => Promise.resolve({ counts: { [id(0)]: 99 } }),
              });
          }),
      );
      try {
        const el = await poll({ endpoint: "/api/poll" });
        await vote(el, 0);
        // the host sets newer results while the request is in flight
        const newer = { [id(0)]: 5, [id(1)]: 5, [id(2)]: 0 };
        el.results = newer;
        await el.updateComplete;
        release();
        // let the response settle
        await new Promise((r) => setTimeout(r, 0));
        await new Promise((r) => setTimeout(r, 0));
        await el.updateComplete;
        expect(el.results).to.equal(newer);
        expect(text($$(el, ".num")[0])).to.equal("50% · 5 votes");
      } finally {
        net.restore();
      }
    });
  });

  describe("show-results", () => {
    const counts = () => ({ [id(0)]: 2, [id(1)]: 1, [id(2)]: 1 });

    it("never: the vote only, and counts from the endpoint are not kept", async () => {
      const net = stubFetch(() => json({ counts: counts() }));
      try {
        const el = await poll({ showResults: "never", endpoint: "/api/poll" });
        el.results = counts();
        await vote(el, 0);
        expect(net.calls.length).to.equal(1);
        expect(net.calls[0].init.method).to.equal("POST");
        expect($(el, ".bars")).to.equal(null);
        expect($(el, ".responses")).to.equal(null);
        expect(text($(el, ".receipt"))).to.contain(O[0]);
        expect(text($(el, ".note"))).to.equal(
          "Your instructor will share the results.",
        );
      } finally {
        net.restore();
      }
    });

    it("closed: results wait for the closes date-time", async () => {
      const el = await poll({
        showResults: "closed",
        closes: "2099-01-01T12:00",
      });
      el.results = counts();
      await vote(el, 0);
      expect($(el, ".bars")).to.equal(null);
      expect(text($(el, ".note"))).to.contain(
        "Results open when the poll closes on",
      );
      // the date passes
      el.closes = "2001-01-01T12:00";
      await el.updateComplete;
      expect($$(el, ".bar").length).to.equal(3);
    });

    it("a closed poll takes no more votes and shows results to everyone", async () => {
      const el = await poll({
        showResults: "closed",
        closes: "2001-01-01T12:00",
      });
      expect($(el, "#vote")).to.equal(null);
      expect($$(el, "input[type='radio']").length).to.equal(0);
      expect(text($(el, ".closed"))).to.equal("This poll is closed.");
      el.results = counts();
      await el.updateComplete;
      expect($$(el, ".bar").length).to.equal(3);
      expect($(el, ".mine")).to.equal(null);
      await el.submitVote();
      expect(el.vote).to.equal("");
    });

    it("falls back to after for an unknown value", async () => {
      const el = await poll({ showResults: "sometimes" });
      expect(el.showResults).to.equal("after");
    });
  });

  describe("xAPI", () => {
    it("sends a conformant choice statement with no success", async () => {
      const el = await poll();
      const sent = listen(el, "user-engagement");
      await vote(el, 2);
      expect(sent.length).to.equal(1);
      expect(sent[0].activityDisplay).to.equal("answered");
      expect("resultSuccess" in sent[0]).to.equal(false);
      const s = sent[0].statement;
      expect(s.verb.id).to.match(/answered$/);
      const def = s.object.definition;
      expect(def.interactionType).to.equal("choice");
      expect(def.choices.map((c) => c.id)).to.deep.equal([id(0), id(1), id(2)]);
      expect("correctResponsesPattern" in def).to.equal(false);
      expect(s.result.response).to.equal(id(2));
      expect(s.result.completion).to.equal(true);
      expect("success" in s.result).to.equal(false);
      expect("score" in s.result).to.equal(false);
      const r = await executeServerCommand("xapi-validate", s);
      expect(r.errors).to.deep.equal([]);
    });

    it("keeps ids when options are reordered", async () => {
      const el = await poll();
      const first = el.choices.map((c) => c.id);
      el.options = [{ label: O[2] }, { label: O[0] }, { label: O[1] }];
      await el.updateComplete;
      expect(el.choices.map((c) => c.id)).to.deep.equal([
        first[2],
        first[0],
        first[1],
      ]);
    });

    it("declares its vocabulary", () => {
      const v = customElements.get("quick-poll").xapiVocabulary;
      expect(v.tag).to.equal("quick-poll");
      expect(v.verbs).to.deep.equal(["answered"]);
      expect(v.interactionType).to.equal("choice");
      expect(v.countsTowardCompletion).to.equal(true);
      expect(v.result).to.not.include("success");
    });

    it("sends nothing in edit mode", async () => {
      const restore = editing(true);
      const net = stubFetch(() => json({ counts: {} }));
      try {
        const el = await poll({ endpoint: "/api/poll" });
        const sent = listen(el, "user-engagement");
        const votes = listen(el, "quick-poll-vote");
        await pick(el, 0);
        $(el, "#vote").click();
        await el.updateComplete;
        expect(sent.length).to.equal(0);
        expect(votes.length).to.equal(0);
        expect(net.calls.length).to.equal(0);
        expect(el.vote).to.equal("");
        expect(text($(el, "#status"))).to.equal("Voting is off while editing.");
      } finally {
        net.restore();
        restore();
      }
    });
  });

  describe("restore", () => {
    it("restores the vote from the learner record without sending it again", async () => {
      const done = withRecord({ done: true, response: id(1) });
      const net = stubFetch(() =>
        json({ counts: { [id(0)]: 1, [id(1)]: 1, [id(2)]: 0 } }),
      );
      try {
        const sent = [];
        const on = (e) => sent.push(e.detail);
        globalThis.addEventListener("user-engagement", on);
        const el = await poll({ endpoint: "/api/poll" });
        await waitUntil(() => el.vote === id(1), "the vote came back");
        await waitUntil(() => $(el, ".bars"), "results were loaded");
        globalThis.removeEventListener("user-engagement", on);
        expect(sent.length).to.equal(0);
        // on load the counts are read, never posted
        expect(net.calls.length).to.equal(1);
        expect(net.calls[0].init.method).to.equal("GET");
        const url = new URL(net.calls[0].url);
        expect(url.pathname).to.equal("/api/poll");
        expect(url.searchParams.get("activityId"))
          .to.be.a("string")
          .and.not.equal("");
        expect(text($(el, ".mine"))).to.equal("your vote");
        expect($(el, "#vote")).to.equal(null);
        const chip = $(el, ".ddd-block-chip");
        expect(chip.hasAttribute("data-done")).to.equal(true);
        expect(chip.hasAttribute("data-ddd-celebrate")).to.equal(false);
      } finally {
        net.restore();
        done();
      }
    });

    it("ignores an id that is no longer an option", async () => {
      const done = withRecord({ done: true, response: "c-00000000" });
      try {
        const el = await poll();
        await el.updateComplete;
        expect(el.vote).to.equal("");
        expect($(el, "#vote")).to.exist;
        expect(el.restoreLearnerResponse("c-00000000")).to.equal(false);
        expect(el.restoreLearnerResponse(id(0))).to.equal(true);
      } finally {
        done();
      }
    });

    it("restores nothing in edit mode", async () => {
      const restore = editing(true);
      const done = withRecord({ done: true, response: id(1) });
      try {
        const el = await poll();
        await el.updateComplete;
        expect(el.vote).to.equal("");
        expect(el.restoreLearnerResponse(id(1))).to.equal(false);
      } finally {
        done();
        restore();
      }
    });

    it("forgets the vote when progress is cleared", async () => {
      const el = await poll();
      await vote(el, 0);
      globalThis.dispatchEvent(new CustomEvent("learner-progress-cleared"));
      await el.updateComplete;
      expect(el.vote).to.equal("");
      expect($(el, "#vote")).to.exist;
    });
  });

  describe("HAX", () => {
    it("declares its hooks", async () => {
      const el = await poll();
      expect(el.haxHooks()).to.deep.equal({
        editModeChanged: "haxeditModeChanged",
        activeElementChanged: "haxactiveElementChanged",
        preProcessNodeToContent: "haxpreProcessNodeToContent",
        preProcessInsertContent: "haxpreProcessInsertContent",
      });
    });

    it("edit mode drops the learner's vote", async () => {
      const el = await poll();
      await vote(el, 1);
      el.haxeditModeChanged(true);
      await el.updateComplete;
      expect(el.vote).to.equal("");
      expect($$(el, "input[type='radio']").length).to.equal(3);
      expect($$(el, "input[type='radio']:checked").length).to.equal(0);
      expect($(el, ".ddd-block-chip").hasAttribute("data-done")).to.equal(
        false,
      );
    });

    it("saves untouched options exactly as authored", async () => {
      const el = await poll();
      const before = el.outerHTML;
      await vote(el, 0);
      el.haxeditModeChanged(true);
      const node = el.haxpreProcessNodeToContent(el);
      expect(node).to.equal(el);
      expect(el.outerHTML).to.equal(before);
    });

    it("writes options edited in the form to the light DOM", async () => {
      const el = await poll();
      el.options = [{ label: "Yes" }, { label: " No " }, { label: "" }];
      await el.updateComplete;
      el.haxpreProcessNodeToContent(el);
      const inputs = Array.from(el.querySelectorAll("input"));
      expect(inputs.map((i) => i.getAttribute("value"))).to.deep.equal([
        "Yes",
        "No",
      ]);
      // and reads them back the same after a reload of that markup
      const again = await fixture(el.outerHTML);
      await waitUntil(() => again.choices.length === 2);
      expect(again.choices.map((c) => c.label)).to.deep.equal(["Yes", "No"]);
      expect(again.outerHTML).to.equal(el.outerHTML);
    });

    it("never inserts host results as content", async () => {
      const el = await poll();
      const detail = el.haxpreProcessInsertContent({
        properties: { question: "Q", results: { a: 1 } },
      });
      expect(detail.properties).to.deep.equal({ question: "Q" });
    });

    it("follows options changed in the light DOM", async () => {
      const el = await poll();
      const input = document.createElement("input");
      input.setAttribute("value", "Take a walk");
      el.appendChild(input);
      await waitUntil(() => el.choices.length === 4, "the new option shows");
      await el.updateComplete;
      expect($$(el, "input[type='radio']").length).to.equal(4);
    });
  });

  describe("accessibility", () => {
    it("passes axe before voting", async () => {
      const el = await poll();
      await expect(el).shadowDom.to.be.accessible();
    });

    it("passes axe with the needs-input message", async () => {
      const el = await poll();
      $(el, "#vote").click();
      await el.updateComplete;
      await expect(el).shadowDom.to.be.accessible();
    });

    it("passes axe on the receipt and on results", async () => {
      const el = await poll({ allowChange: true });
      await vote(el, 0);
      await expect(el).shadowDom.to.be.accessible();
      el.results = { [id(0)]: 3, [id(1)]: 1, [id(2)]: 0 };
      await el.updateComplete;
      expect($(el, ".bars")).to.exist;
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

      it("passes axe before voting, picked and on results", async () => {
        const el = await poll();
        await expect(el).shadowDom.to.be.accessible();
        await pick(el, 1);
        await expect(el).shadowDom.to.be.accessible();
        el.results = { [id(0)]: 3, [id(1)]: 1, [id(2)]: 0 };
        await vote(el, 1);
        expect($(el, ".bars")).to.exist;
        await expect(el).shadowDom.to.be.accessible();
      });
    });
  });

  describe("phone width", () => {
    afterEach(() => setViewport({ width: 800, height: 600 }));

    it("fits 360px without page scroll, before and after voting", async () => {
      await setViewport({ width: 360, height: 640 });
      const el = await fixture(
        html`<quick-poll
          question="A long question that needs to wrap over a few lines on a phone screen without pushing anything sideways?"
          allow-change
        >
          <input
            value="A long option with a-very-long-unbroken-word-in-the-middle-of-it that wraps"
          /><input value="Short" />
        </quick-poll>`,
      );
      await waitUntil(() => el.choices.length === 2);
      await el.updateComplete;
      const fits = () =>
        document.documentElement.scrollWidth <= window.innerWidth;
      expect(fits()).to.equal(true);
      $$(el, "label.option").forEach((row) => {
        expect(row.getBoundingClientRect().height).to.be.at.least(24);
      });
      el.results = { [el.choices[0].id]: 120, [el.choices[1].id]: 3 };
      $$(el, "input[type='radio']")[0].click();
      await el.updateComplete;
      $(el, "#vote").click();
      await waitUntil(() => $(el, ".bars"));
      expect(fits()).to.equal(true);
      $$(el, ".bar").forEach((row) => {
        expect(row.getBoundingClientRect().right).to.be.at.most(360);
      });
    });
  });
});
