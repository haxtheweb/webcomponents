import { html, fixture, expect, waitUntil } from "@open-wc/testing";
import {
  executeServerCommand,
  sendKeys,
  setViewport,
} from "@web/test-runner-commands";
import "../arithmetic-drill.js";
import {
  deviceActor,
  setActorProvider,
  XAPI_EXTENSIONS,
} from "@haxtheweb/user-action/lib/xapi.js";

const $ = (el, sel) => el.shadowRoot.querySelector(sel);

// type an answer and submit it the way a learner does
async function answer(el, value) {
  const input = $(el, "#answer");
  input.value = String(value);
  $(el, "form").requestSubmit();
  await el.updateComplete;
}

async function answerAll(el, wrongAt = []) {
  const total = el._problems.length;
  for (let i = 0; i < total; i++) {
    const p = el._problems[el._index];
    await answer(el, wrongAt.includes(i) ? p.answer + 1 : p.answer);
  }
  await waitUntil(() => el._phase === "done", "run finishes");
  await el.updateComplete;
}

describe("arithmetic-drill", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`
      <arithmetic-drill title="Quick math" count="3"></arithmetic-drill>
    `);
  });

  describe("frame and start screen", () => {
    it("renders the DDD block frame with the authored title and a footer", () => {
      const block = $(el, ".ddd-block");
      expect(block.getAttribute("role")).to.equal("group");
      expect($(el, ".ddd-block-header")).to.exist;
      expect($(el, ".ddd-block-chip")).to.exist;
      expect($(el, ".ddd-block-title").textContent).to.equal("Quick math");
      expect($(el, ".ddd-block-label").textContent).to.include("Arithmetic");
      expect($(el, ".ddd-block-footer #start")).to.exist;
      expect($(el, "#" + block.getAttribute("aria-labelledby"))).to.exist;
    });

    it("says what will be asked", () => {
      expect($(el, ".summary").textContent).to.include(
        "3 problems with numbers from 2 to 12",
      );
      const ops = [...el.shadowRoot.querySelectorAll(".op")];
      expect(ops.map((b) => b.getAttribute("data-op"))).to.deep.equal([
        "add",
        "subtract",
        "multiply",
      ]);
      ops.forEach((b) =>
        expect(b.getAttribute("aria-pressed")).to.equal("true"),
      );
      expect($(el, "#start").textContent.trim()).to.equal("Start 3 problems");
      expect($(el, "#use-timer")).to.not.exist;
    });

    it("toggles the directions", async () => {
      const toggle = $(el, "#directions-toggle");
      expect($(el, "#directions").hidden).to.equal(true);
      toggle.click();
      await el.updateComplete;
      expect($(el, "#directions").hidden).to.equal(false);
      expect(toggle.getAttribute("aria-expanded")).to.equal("true");
      await expect(el).shadowDom.to.be.accessible();
    });

    it("lets the learner switch operations off, but never all of them", async () => {
      $(el, '.op[data-op="add"]').click();
      await el.updateComplete;
      $(el, '.op[data-op="multiply"]').click();
      await el.updateComplete;
      $(el, '.op[data-op="subtract"]').click();
      await el.updateComplete;
      expect(el._ops).to.deep.equal(["subtract"]);
      expect(
        $(el, '.op[data-op="subtract"]').getAttribute("aria-pressed"),
      ).to.equal("true");
      await el.start();
      el._problems.forEach((p) => expect(p.operation).to.equal("subtract"));
    });

    it("passes the a11y audit on the start screen", async () => {
      await expect(el).shadowDom.to.be.accessible();
    });

    it("does not change its light DOM or attributes", async () => {
      const before = el.outerHTML;
      await el.start();
      await answerAll(el);
      expect(el.outerHTML).to.equal(before);
    });
  });

  describe("a run", () => {
    it("shows one problem as text with a spoken label on a numeric input", async () => {
      await el.start();
      const p = el._problems[0];
      const input = $(el, "#answer");
      expect(input.getAttribute("inputmode")).to.equal("numeric");
      const label = $(el, 'label[for="answer"]');
      expect(label.querySelector("[aria-hidden]").textContent).to.include(
        String(p.a),
      );
      expect(label.querySelector(".sr-only").textContent).to.match(
        /^\d+ (plus|minus|times) \d+$/,
      );
      expect($(el, "#progress").textContent.trim()).to.equal("Problem 1 of 3");
      expect(el.shadowRoot.activeElement).to.equal(input);
      expect($(el, "#live").textContent).to.include("Problem 1 of 3");
    });

    it("gives correct feedback, moves on and keeps focus in the input", async () => {
      await el.start();
      const first = el._problems[0];
      await answer(el, first.answer);
      const res = $(el, "#feedback");
      expect(res.classList.contains("res-correct")).to.equal(true);
      expect(res.querySelector("strong").textContent).to.equal("Correct");
      expect(
        res.querySelector("simple-icon-lite").getAttribute("icon"),
      ).to.equal("icons:check");
      expect(getComputedStyle(res).borderTopStyle).to.equal("solid");
      expect($(el, "#progress").textContent.trim()).to.equal("Problem 2 of 3");
      expect($(el, "#answer").value).to.equal("");
      expect(el.shadowRoot.activeElement).to.equal($(el, "#answer"));
      const live = $(el, "#live").textContent;
      expect(live).to.include("Correct.");
      expect(live).to.include("Problem 2 of 3");
    });

    it("gives incorrect feedback with the right answer", async () => {
      await el.start();
      const first = el._problems[0];
      await answer(el, first.answer + 1);
      const res = $(el, "#feedback");
      expect(res.classList.contains("res-incorrect")).to.equal(true);
      expect(res.querySelector("strong").textContent).to.equal("Incorrect");
      expect(
        res.querySelector("simple-icon-lite").getAttribute("icon"),
      ).to.equal("icons:close");
      expect(getComputedStyle(res).borderTopStyle).to.equal("dotted");
      expect(res.querySelector(".math").textContent).to.include(
        `= ${first.answer}`,
      );
      expect($(el, "#live").textContent).to.include(`is ${first.answer}.`);
      await expect(el).shadowDom.to.be.accessible();
    });

    it("submits with the Enter key", async () => {
      await el.start();
      const input = $(el, "#answer");
      input.value = String(el._problems[0].answer);
      input.focus();
      await sendKeys({ press: "Enter" });
      await waitUntil(() => el._answered === 1, "Enter submits");
    });

    it("does not count something that is not a whole number", async () => {
      await el.start();
      await answer(el, "abc");
      expect(el._answered).to.equal(0);
      expect($(el, "#hint").textContent).to.include("whole number");
      await answer(el, "");
      expect(el._answered).to.equal(0);
      await expect(el).shadowDom.to.be.accessible();
    });

    it("ends with the score as text and Go again", async () => {
      await el.start();
      await answerAll(el, [1]);
      const score = $(el, "#score");
      expect(score.textContent.replace(/\s+/g, " ").trim()).to.equal(
        "2 of 3 right.",
      );
      expect(el.shadowRoot.activeElement).to.equal(score);
      expect($(el, ".ddd-block-chip").hasAttribute("data-done")).to.equal(true);
      await expect(el).shadowDom.to.be.accessible();
      $(el, "#again").click();
      await waitUntil(() => el._phase === "start");
      await el.updateComplete;
      expect($(el, "#start")).to.exist;
      expect($(el, "#feedback")).to.not.exist;
    });

    it("says a perfect run is perfect", async () => {
      await el.start();
      await answerAll(el);
      expect($(el, "#score").textContent).to.include("Perfect run.");
    });
  });

  describe("timer", () => {
    let timed;
    beforeEach(async () => {
      timed = await fixture(html`
        <arithmetic-drill
          title="Timed"
          count="5"
          time-limit="60"
        ></arithmetic-drill>
      `);
    });

    it("is off unless the author sets a time limit", async () => {
      await el.start();
      expect($(el, "#timer")).to.not.exist;
      expect($(el, "#timer-off")).to.not.exist;
      expect(el._timerId).to.not.be.ok;
    });

    it("shows the time left as text that is not a live region", async () => {
      await timed.start();
      const timer = $(timed, "#timer");
      expect(timer.textContent.trim()).to.equal("Time left: 1:00");
      expect(timer.closest("[aria-live]")).to.equal(null);
      expect($(timed, "#live").textContent).to.include(
        "Timer started: 60 seconds.",
      );
      await expect(timed).shadowDom.to.be.accessible();
    });

    it("announces halfway and at 10 seconds, not every second", async () => {
      await timed.start();
      const said = [];
      const live = () => $(timed, "#live").textContent.trim();
      for (let left = 59; left >= 1; left--) {
        timed._deadline = Date.now() + left * 1000 - 500;
        const before = live();
        timed._tick();
        await timed.updateComplete;
        if (live() !== before) {
          said.push(live());
        }
      }
      expect(said).to.deep.equal(["30 seconds left.", "10 seconds left."]);
    });

    it("lets the learner turn it off on the start screen", async () => {
      const box = $(timed, "#use-timer");
      expect(box.checked).to.equal(true);
      box.click();
      await timed.updateComplete;
      await timed.start();
      expect($(timed, "#timer")).to.not.exist;
      expect(timed._timerId).to.not.be.ok;
    });

    it("lets the learner turn it off during a run", async () => {
      await timed.start();
      $(timed, "#timer-off").click();
      await waitUntil(() => !$(timed, "#timer"), "timer text goes away");
      expect(timed._timerId).to.equal(null);
      expect($(timed, "#live").textContent).to.include("Timer off");
      expect(timed.shadowRoot.activeElement).to.equal($(timed, "#answer"));
      expect(timed._phase).to.equal("run");
    });

    it("ends the run with what was answered when time runs out", async () => {
      const events = [];
      timed.addEventListener("user-engagement", (e) => events.push(e.detail));
      await timed.start();
      await answer(timed, timed._problems[0].answer);
      timed._deadline = Date.now() - 1;
      await waitUntil(() => timed._phase === "done", "time runs out");
      await timed.updateComplete;
      expect($(timed, "#time-up").textContent).to.include(
        "You answered 1 of 5.",
      );
      expect($(timed, "#score").textContent).to.include("1 of 5");
      const done = events.filter((d) => d.activityDisplay === "completed");
      expect(done.length).to.equal(1);
      expect(done[0].statement.result.score.raw).to.equal(1);
      expect(done[0].statement.result.score.max).to.equal(5);
      expect(done[0].statement.result.completion).to.equal(true);
      expect(timed._timerId).to.equal(null);
      await expect(timed).shadowDom.to.be.accessible();
    });

    it("stops the timer when removed from the page", async () => {
      await timed.start();
      expect(timed._timerId).to.be.ok;
      timed.remove();
      expect(timed._timerId).to.equal(null);
    });
  });

  describe("xAPI", () => {
    before(() =>
      setActorProvider(() =>
        deviceActor(
          "4b9f1c1e-0000-4000-8000-0000000000d1",
          "https://example.org/",
        ),
      ),
    );
    after(() => setActorProvider(null));

    it("sends attempted, progressed per answer and one completed, all conformant", async () => {
      const events = [];
      let bubbled = 0;
      const onDoc = () => bubbled++;
      document.addEventListener("user-engagement", onDoc);
      el.addEventListener("user-engagement", (e) => events.push(e.detail));
      await el.start();
      await answerAll(el, [0]);
      document.removeEventListener("user-engagement", onDoc);
      expect(events.map((d) => d.activityDisplay)).to.deep.equal([
        "attempted",
        "progressed",
        "progressed",
        "progressed",
        "completed",
      ]);
      expect(bubbled).to.equal(5);
      for (const d of events) {
        const r = await executeServerCommand("xapi-validate", d.statement);
        expect(r.errors, d.activityDisplay).to.deep.equal([]);
        expect(d.objectName).to.equal("Quick math");
        expect(d.statement.object.definition.type).to.equal(
          "http://adlnet.gov/expapi/activities/simulation",
        );
      }
      const progress = events
        .filter((d) => d.activityDisplay === "progressed")
        .map((d) => d.statement.result.extensions[XAPI_EXTENSIONS.progress]);
      expect(progress).to.deep.equal([0.3333, 0.6667, 1]);
      const done = events[4].statement;
      expect(done.result.score).to.deep.include({ raw: 2, min: 0, max: 3 });
      expect(done.result.completion).to.equal(true);
      expect(done.result.duration).to.match(/^PT[\d.]+S$/);
      expect(events[4].resultScore).to.be.closeTo(2 / 3, 0.001);
      expect(events[0].statement.result.completion).to.equal(false);
    });

    it("keeps one activity id across statements and runs, and uses an authored id", async () => {
      const ids = [];
      el.addEventListener("user-engagement", (e) =>
        ids.push(e.detail.statement.object.id),
      );
      await el.start();
      await answerAll(el);
      await el.reset();
      await el.start();
      await answerAll(el);
      expect(new Set(ids).size).to.equal(1);
      expect(ids.filter(Boolean).length).to.equal(10);
      const named = await fixture(
        html`<arithmetic-drill id="facts" title="Facts"></arithmetic-drill>`,
      );
      let id = "";
      named.addEventListener("user-engagement", (e) => {
        id = e.detail.statement.object.id;
      });
      await named.start();
      expect(id.endsWith("#facts")).to.equal(true);
    });

    it("sends one completed per run and one per later run", async () => {
      const done = [];
      el.addEventListener("user-engagement", (e) => {
        if (e.detail.activityDisplay === "completed") {
          done.push(e.detail);
        }
      });
      await el.start();
      await answerAll(el);
      await el._finish(false);
      expect(done.length).to.equal(1);
      await el.reset();
      await el.start();
      await answerAll(el);
      expect(done.length).to.equal(2);
    });

    it("declares its vocabulary", () => {
      const v = customElements.get("arithmetic-drill").xapiVocabulary;
      expect(v.tag).to.equal("arithmetic-drill");
      expect(v.event).to.equal("user-engagement");
      expect(v.verbs).to.deep.equal(["attempted", "progressed", "completed"]);
      expect(v.countsTowardCompletion).to.equal(true);
      expect(v.result).to.include(`extensions.${XAPI_EXTENSIONS.progress}`);
      expect(v.done).to.be.a("string");
    });
  });

  describe("HAX and the learner record", () => {
    it("sends nothing and starts nothing in edit mode", async () => {
      const events = [];
      el.addEventListener("user-engagement", (e) => events.push(e.detail));
      expect(el.haxHooks().editModeChanged).to.equal("haxeditModeChanged");
      el.haxeditModeChanged(true);
      await el.start();
      expect(el._phase).to.equal("start");
      expect(events.length).to.equal(0);
      el.haxeditModeChanged(false);
      await el.start();
      expect(el._phase).to.equal("run");
      expect(events.length).to.equal(1);
    });

    it("sends nothing when the HAX store says it is editing", async () => {
      const previous = globalThis.HaxStore;
      globalThis.HaxStore = {
        requestAvailability: () => ({ editMode: true }),
      };
      try {
        const events = [];
        el.addEventListener("user-engagement", (e) => events.push(e.detail));
        await el.start();
        el._send("completed");
        expect(events.length).to.equal(0);
      } finally {
        globalThis.HaxStore = previous;
      }
    });

    it("drops the run and the done chip when editing starts", async () => {
      await el.start();
      await answerAll(el);
      expect($(el, ".ddd-block-chip").hasAttribute("data-done")).to.equal(true);
      el.haxeditModeChanged(true);
      await el.updateComplete;
      expect(el._phase).to.equal("start");
      expect($(el, ".ddd-block-chip").hasAttribute("data-done")).to.equal(
        false,
      );
      expect($(el, "#feedback")).to.not.exist;
    });

    it("shows the done chip when the learner record says a run was finished", async () => {
      const asked = [];
      const answerRequest = (e) => {
        asked.push(e.detail);
        if (e.detail.tag === "arithmetic-drill") {
          e.detail.record = { done: true };
        }
      };
      globalThis.addEventListener("learner-progress-request", answerRequest);
      try {
        const again = await fixture(
          html`<arithmetic-drill title="Seen before"></arithmetic-drill>`,
        );
        await waitUntil(() => again._doneBefore, "record read");
        await again.updateComplete;
        expect($(again, ".ddd-block-chip").hasAttribute("data-done")).to.equal(
          true,
        );
        expect(asked[asked.length - 1].activityId).to.include(
          "arithmetic-drill-",
        );
        expect(again._phase).to.equal("start");
        // an unknown record shape is ignored
        globalThis.dispatchEvent(new CustomEvent("learner-progress-cleared"));
        await again.updateComplete;
        expect($(again, ".ddd-block-chip").hasAttribute("data-done")).to.equal(
          false,
        );
      } finally {
        globalThis.removeEventListener(
          "learner-progress-request",
          answerRequest,
        );
      }
    });

    it("ignores a record that is not a finished run", async () => {
      const answerRequest = (e) => {
        e.detail.record = "nonsense";
      };
      globalThis.addEventListener("learner-progress-request", answerRequest);
      try {
        const other = await fixture(
          html`<arithmetic-drill title="Other"></arithmetic-drill>`,
        );
        await other.updateComplete;
        await Promise.resolve();
        expect(other._doneBefore).to.equal(false);
      } finally {
        globalThis.removeEventListener(
          "learner-progress-request",
          answerRequest,
        );
      }
    });

    it("points at its haxProperties file", async () => {
      const url = customElements.get("arithmetic-drill").haxProperties;
      const props = await (await fetch(url)).json();
      expect(props.gizmo.tags).to.include("Instructional");
      expect(props.demoSchema[0].tag).to.equal("arithmetic-drill");
      const advanced = props.settings.advanced.map((f) => f.property);
      expect(advanced).to.include("timeLimit");
    });
  });

  describe("settings", () => {
    it("asks only the authored operations with safe numbers", async () => {
      const div = await fixture(html`
        <arithmetic-drill
          operations="divide"
          min="0"
          max="9"
          count="40"
        ></arithmetic-drill>
      `);
      await div.start();
      expect(div._problems.length).to.equal(40);
      div._problems.forEach((p) => {
        expect(p.operation).to.equal("divide");
        expect(p.b).to.be.at.least(1);
        expect(p.a % p.b).to.equal(0);
      });
      expect($(div, 'label[for="answer"] .sr-only').textContent).to.include(
        "divided by",
      );
    });
  });

  describe("phone width", () => {
    before(async () => {
      await setViewport({ width: 360, height: 740 });
    });
    after(async () => {
      await setViewport({ width: 1024, height: 768 });
    });

    it("fits 360px on every screen with targets of at least 24px", async () => {
      const wide = await fixture(html`
        <arithmetic-drill
          title="A long title for a drill that has to wrap on a phone"
          operations="add subtract multiply divide"
          min="1000"
          max="9999"
          count="2"
          time-limit="90"
        ></arithmetic-drill>
      `);
      const fits = () => {
        const doc = document.documentElement;
        expect(doc.scrollWidth).to.be.at.most(doc.clientWidth);
        wide.shadowRoot.querySelectorAll("button, input").forEach((control) => {
          const box = control.getBoundingClientRect();
          expect(box.right).to.be.at.most(doc.clientWidth);
          expect(box.height).to.be.at.least(24);
          expect(box.width).to.be.at.least(24);
        });
      };
      fits();
      await wide.start();
      fits();
      await answer(wide, 1);
      fits();
      await answer(wide, 1);
      await waitUntil(() => wide._phase === "done");
      await wide.updateComplete;
      fits();
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

    it("passes the a11y audit in dark mode on every screen", async () => {
      await expect(el).shadowDom.to.be.accessible();
      await el.start();
      await answer(el, el._problems[0].answer);
      await expect(el).shadowDom.to.be.accessible();
      await answer(el, el._problems[1].answer + 1);
      await expect(el).shadowDom.to.be.accessible();
      await answer(el, el._problems[2].answer);
      await waitUntil(() => el._phase === "done");
      await el.updateComplete;
      await expect(el).shadowDom.to.be.accessible();
    });
  });

  describe("reduced motion", () => {
    it("has no transition or animation of its own outside the completion burst", () => {
      const sheets = customElements.get("arithmetic-drill").elementStyles;
      const own = sheets[sheets.length - 1].cssText;
      expect(own).to.not.match(/transition|animation/);
    });
  });
});
