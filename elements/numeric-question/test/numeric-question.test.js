import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import { executeServerCommand, setViewport } from "@web/test-runner-commands";
import "../numeric-question.js";
import {
  deviceActor,
  setActorProvider,
  XAPI_VERBS,
} from "@haxtheweb/user-action/lib/xapi.js";

const ATTEMPTS = "https://haxtheweb.org/xapi/extensions/attempts";

// the element reads its key off the light DOM a microtask after first paint
async function ready(el) {
  await waitUntil(
    () => el.querySelectorAll("input:not([slot])").length === 0,
    "key inputs are read and removed",
  );
  await el.updateComplete;
  await waitUntil(() => el._progressChecked, "asked for saved progress");
  await el.updateComplete;
  return el;
}
const speed = (attrs = {}) =>
  fixture(
    html`<numeric-question
      id="${attrs.id || "speed"}"
      question="A cyclist rides {d} km in {t} minutes. What is her average speed?"
      unit="km/h"
      tolerance="1"
      tolerance-type="percent"
      decimals="1"
      max-attempts="${attrs.max == null ? 3 : attrs.max}"
      ?reroll="${attrs.reroll}"
    >
      <p slot="hint">The time is in minutes but the answer is per hour.</p>
      <p slot="evidence">Speed is distance divided by hours.</p>
      <input type="checkbox" value="d / (t / 60)" data-correct="true" /><input
        type="checkbox"
        data-variable="d"
        data-min="12"
        data-max="30"
        data-step="1"
      /><input
        type="checkbox"
        data-variable="t"
        data-min="30"
        data-max="90"
        data-step="5"
      />
    </numeric-question>`,
  ).then(ready);
const fixed = () =>
  fixture(
    html`<numeric-question id="boil" question="Boiling point?" unit="°C">
      <input type="checkbox" value="100" data-correct="true" />
    </numeric-question>`,
  ).then(ready);
const field = (el) => el.shadowRoot.querySelector("#nq-in");
async function type(el, text) {
  const input = field(el);
  input.value = text;
  input.dispatchEvent(new Event("input", { bubbles: true }));
  await el.updateComplete;
}
async function check(el) {
  await el.checkAnswer();
  await el.updateComplete;
  await el._celebration;
  await el.updateComplete;
}
const exact = (el) => el._values.d / (el._values.t / 60);
const collect = (el) => {
  const events = [];
  el.addEventListener("user-engagement", (e) => events.push(e.detail));
  return events;
};

describe("numeric-question", () => {
  before(() => {
    setActorProvider(() =>
      deviceActor(
        "4b9f1c1e-0000-4000-8000-000000000031",
        "https://example.org/",
      ),
    );
  });
  after(() => setActorProvider(null));

  describe("rendering", () => {
    it("passes the a11y audit in the default state", async () => {
      const el = await speed();
      await expect(el).shadowDom.to.be.accessible();
    });
    it("shows the question with variable values and never the key", async () => {
      const el = await speed();
      const heading = el.shadowRoot.querySelector("#question-heading");
      const { d, t } = el._values;
      expect(d).to.be.within(12, 30);
      expect(t).to.be.within(30, 90);
      expect(t % 5).to.equal(0);
      expect(heading.textContent.trim()).to.equal(
        `A cyclist rides ${d} km in ${t} minutes. What is her average speed?`,
      );
      // what the author wrote is untouched
      expect(el.question).to.contain("{d} km in {t} minutes");
      expect(el.getAttribute("question")).to.contain("{d}");
      expect(el.shadowRoot.textContent).to.not.contain("d / (t / 60)");
      expect(el.shadowRoot.querySelector(".nq-author")).to.equal(null);
    });
    it("labels the field and shows the unit and rounding hint as its description", async () => {
      const el = await speed();
      const input = field(el);
      expect(input.getAttribute("inputmode")).to.equal("decimal");
      expect(
        el.shadowRoot.querySelector('label[for="nq-in"]').textContent,
      ).to.equal("Your answer");
      expect(el.shadowRoot.querySelector("#nq-unit").textContent).to.equal(
        "km/h",
      );
      expect(el.shadowRoot.querySelector("#nq-hint").textContent).to.equal(
        "Round to 1 decimal place.",
      );
      input
        .getAttribute("aria-describedby")
        .split(" ")
        .forEach((id) => {
          expect(el.shadowRoot.getElementById(id), id).to.exist;
        });
    });
    it("shows the same numbers on every load", async () => {
      const a = await speed();
      const values = { ...a._values };
      a.remove();
      const b = await speed();
      expect(b._values).to.deep.equal(values);
    });
    it("fits a 360px screen", async () => {
      await setViewport({ width: 360, height: 700 });
      const el = await speed();
      await type(el, "1");
      await check(el);
      expect(document.documentElement.scrollWidth).to.be.at.most(
        globalThis.innerWidth,
      );
      const box = el.getBoundingClientRect();
      el.shadowRoot.querySelectorAll(".nq-row > *").forEach((node) => {
        expect(node.getBoundingClientRect().right).to.be.at.most(box.right + 1);
      });
      await setViewport({ width: 800, height: 600 });
    });
  });

  describe("light DOM", () => {
    it("reads the key from inputs and removes them", async () => {
      const el = await speed();
      expect(el.formula).to.equal("d / (t / 60)");
      expect(el.answer).to.equal(null);
      expect(el.variables).to.deep.equal([
        { name: "d", min: 12, max: 30, step: 1 },
        { name: "t", min: 30, max: 90, step: 5 },
      ]);
      expect(el.querySelectorAll("input").length).to.equal(0);
      expect(el.querySelector('[slot="hint"]')).to.exist;
      const f = await fixed();
      expect(f.answer).to.equal(100);
      expect(f.formula).to.equal("");
    });
    it("saves the same markup it loaded", async () => {
      const authored =
        '<p slot="hint">Minutes, not hours.</p><input type="checkbox" value="d / (t / 60)" data-correct="true"><input type="checkbox" data-variable="d" data-min="12" data-max="30" data-step="1"><input type="checkbox" data-variable="t" data-min="30" data-max="90" data-step="0.5">';
      const el = await fixture(
        html`<numeric-question question="Speed of {d} in {t}?" unit="km/h"
          >.</numeric-question
        >`,
      );
      // parsed the way a saved page is
      const again = document.createElement("numeric-question");
      again.setAttribute("question", "Speed of {d} in {t}?");
      again.innerHTML = authored;
      el.parentNode.appendChild(again);
      await ready(again);
      await type(again, "12");
      await check(again);
      const saved = await again.haxpreProcessNodeToContent(again);
      expect(saved.innerHTML).to.equal(authored);
      // learner state and the key are never attributes
      ["answer", "formula", "variables", "typed"].forEach((name) => {
        expect(saved.hasAttribute(name), name).to.equal(false);
      });
      // saving twice does not pile inputs up
      await again.haxpreProcessNodeToContent(again);
      expect(again.innerHTML).to.equal(authored);
      again.remove();
    });
    it("saves a fixed answer as one input", async () => {
      const el = await fixed();
      const saved = await el.haxpreProcessNodeToContent(el);
      expect(saved.innerHTML.trim()).to.equal(
        '<input type="checkbox" value="100" data-correct="true">',
      );
    });
  });

  describe("scoring", () => {
    it("accepts the exact answer, a comma decimal, and anything in tolerance", async () => {
      const el = await speed({ max: 0 });
      const ex = exact(el);
      for (const text of [
        String(ex),
        ex.toFixed(1).replace(".", ","),
        String(ex * 1.009),
        String(ex * 0.991),
      ]) {
        el.typed = text;
        expect(el.isCorrect(), text).to.equal(true);
      }
      for (const text of [String(ex * 1.02), String(ex * 0.98), "", "abc"]) {
        el.typed = text;
        expect(el.isCorrect(), text).to.equal(false);
      }
    });
    it("absolute tolerance and rounding to decimals", async () => {
      const el = await fixed();
      el.tolerance = 0.5;
      el.typed = "100,5";
      expect(el.isCorrect()).to.equal(true);
      el.typed = "99.4";
      expect(el.isCorrect()).to.equal(false);
      el.tolerance = 0;
      el.typed = "100.0";
      expect(el.isCorrect()).to.equal(true);
      el.typed = "100.01";
      expect(el.isCorrect()).to.equal(false);
      el.answer = 18.4615;
      el.decimals = 1;
      await el.updateComplete;
      el.typed = "18.5";
      expect(el.isCorrect()).to.equal(true);
      el.typed = "18.6";
      expect(el.isCorrect()).to.equal(false);
    });
    it("marks a correct answer with line, icon and word, and reveals the answer", async () => {
      const el = await speed();
      await type(el, exact(el).toFixed(1));
      await check(el);
      expect(el.attempts).to.equal(1);
      expect(el.shadowRoot.querySelector(".shell").dataset.status).to.equal(
        "correct",
      );
      expect(field(el).classList.contains("nq-correct")).to.equal(true);
      expect(field(el).disabled).to.equal(true);
      expect(
        el.shadowRoot.querySelector(".option-status.correct").textContent,
      ).to.contain("Correct");
      expect(el.shadowRoot.querySelector(".nq-reveal").textContent).to.contain(
        `${exact(el).toFixed(1)} km/h`,
      );
      expect(el.shadowRoot.querySelector('slot[name="evidence"]')).to.exist;
      await expect(el).shadowDom.to.be.accessible();
    });
    it("marks a wrong answer, shows the authored hint, and keeps the answer back", async () => {
      const el = await speed();
      await type(el, "1");
      await check(el);
      expect(el.attempts).to.equal(1);
      expect(field(el).classList.contains("nq-incorrect")).to.equal(true);
      expect(field(el).getAttribute("aria-invalid")).to.equal("true");
      expect(
        el.shadowRoot.querySelector(".option-status.incorrect").textContent,
      ).to.contain("Incorrect");
      expect(el.shadowRoot.querySelector('slot[name="hint"]')).to.exist;
      expect(el.shadowRoot.querySelector(".nq-reveal")).to.equal(null);
      await expect(el).shadowDom.to.be.accessible();
      // try again keeps the wrong answer to fix and the same numbers
      const values = { ...el._values };
      el.resetAnswer();
      await el.updateComplete;
      expect(el.showAnswer).to.equal(false);
      expect(field(el).value).to.equal("1");
      expect(el._values).to.deep.equal(values);
    });
    it("reveals the answer once the attempts are used up", async () => {
      const el = await speed({ max: 2 });
      await type(el, "1");
      await check(el);
      el.resetAnswer();
      await el.updateComplete;
      await type(el, "2");
      await check(el);
      expect(el.attempts).to.equal(2);
      expect(el.shadowRoot.querySelector(".nq-reveal").textContent).to.contain(
        exact(el).toFixed(1),
      );
      // no more checks
      el.resetAnswer();
      await el.updateComplete;
      await type(el, String(exact(el)));
      await check(el);
      expect(el.attempts).to.equal(2);
      expect(el.showAnswer).to.equal(false);
    });
  });

  describe("needs input", () => {
    it("asks for a number without marking it wrong or using an attempt", async () => {
      const el = await speed();
      const events = collect(el);
      for (const text of ["", "fast", "18.5 km/h", "1,234.5"]) {
        await type(el, text);
        await check(el);
        expect(el.attempts, text).to.equal(0);
        expect(el.showAnswer, text).to.equal(false);
        const note = el.shadowRoot.querySelector("#nq-note");
        expect(note.getAttribute("role")).to.equal("status");
        expect(note.textContent).to.contain("Needs input");
        expect(note.textContent).to.contain("Enter a number, like 18.5.");
        expect(field(el).classList.contains("nq-missing")).to.equal(true);
        expect(field(el).classList.contains("nq-incorrect")).to.equal(false);
        expect(el.shadowRoot.activeElement).to.equal(field(el));
      }
      expect(events.length).to.equal(0);
      await expect(el).shadowDom.to.be.accessible();
      // typing clears the message
      await type(el, "1");
      expect(
        el.shadowRoot.querySelector("#nq-note").textContent.trim(),
      ).to.equal("");
    });
    it("does not grade a question with no usable key", async () => {
      const el = await fixture(
        html`<numeric-question question="Broken"
          ><input type="checkbox" value="d * nope" data-correct="true"
        /></numeric-question>`,
      ).then(ready);
      await type(el, "4");
      await check(el);
      expect(el.attempts).to.equal(0);
      expect(el.shadowRoot.querySelector("#nq-note").textContent).to.contain(
        "no answer set up",
      );
    });
    it("Enter in the field checks the answer", async () => {
      const el = await speed();
      await type(el, "1");
      field(el).dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      );
      await waitUntil(() => el.showAnswer, "checked");
      expect(el.attempts).to.equal(1);
    });
  });

  describe("xAPI", () => {
    it("declares a numeric vocabulary like its siblings", () => {
      const v = customElements.get("numeric-question").xapiVocabulary;
      expect(v.tag).to.equal("numeric-question");
      expect(v.verbs).to.deep.equal(["answered"]);
      expect(v.interactionType).to.equal("numeric");
      expect(v.event).to.equal("user-engagement");
    });
    it("sends a conformant numeric statement for wrong and right answers", async () => {
      const el = await speed();
      const events = collect(el);
      await type(el, "3,5");
      await check(el);
      el.resetAnswer();
      await el.updateComplete;
      await type(el, exact(el).toFixed(1));
      await check(el);
      expect(events.length).to.equal(2);
      const [wrong, right] = events.map((d) => d.statement);
      for (const s of [wrong, right]) {
        const r = await executeServerCommand("xapi-validate", s);
        expect(r.errors).to.deep.equal([]);
        expect(s.verb.id).to.equal(XAPI_VERBS.answered);
        const def = s.object.definition;
        expect(def.interactionType).to.equal("numeric");
        const [min, max] = def.correctResponsesPattern[0]
          .split("[:]")
          .map(Number);
        expect(def.correctResponsesPattern.length).to.equal(1);
        expect(min).to.be.closeTo(exact(el) * 0.99, 1e-6);
        expect(max).to.be.closeTo(exact(el) * 1.01, 1e-6);
        // only the extensions the base class already uses
        Object.keys(s.result.extensions).forEach((iri) => {
          expect(iri).to.match(/\/extensions\/(attempts|max-attempts)$/);
        });
        expect(def.extensions).to.equal(undefined);
        expect(s.object.id).to.match(/#speed$/);
      }
      expect(wrong.result.response).to.equal("3.5");
      expect(wrong.result.success).to.equal(false);
      expect(wrong.result.completion).to.equal(false);
      expect(wrong.result.extensions[ATTEMPTS]).to.equal(1);
      expect(right.result.response).to.equal(
        String(Number(exact(el).toFixed(1))),
      );
      expect(right.result.success).to.equal(true);
      expect(right.result.completion).to.equal(true);
      expect(right.result.score).to.include({ raw: 1, max: 1 });
      expect(right.object.id).to.equal(wrong.object.id);
      expect(events[1].activityDisplay).to.equal("answered");
      expect(events[1].resultSuccess).to.equal(true);
    });
    it("sends nothing while HAX is editing", async () => {
      const el = await speed();
      const events = collect(el);
      el.haxeditModeChanged(true);
      await el.updateComplete;
      await type(el, "1");
      await check(el);
      expect(events.length).to.equal(0);
      expect(el.attempts).to.equal(0);
      expect(el.showAnswer).to.equal(false);
    });
  });

  describe("learner record", () => {
    const withRecord = async (record, make) => {
      const listener = (e) => {
        e.detail.record = record;
      };
      globalThis.addEventListener("learner-progress-request", listener);
      try {
        return await make();
      } finally {
        globalThis.removeEventListener("learner-progress-request", listener);
      }
    };
    it("puts a saved answer back", async () => {
      const el = await withRecord(
        { status: "incorrect", attempts: 2, response: "3.5", done: false },
        () => speed(),
      );
      await el.updateComplete;
      expect(el.typed).to.equal("3.5");
      expect(field(el).value).to.equal("3.5");
      expect(el.showAnswer).to.equal(true);
      expect(el.attempts).to.equal(2);
      expect(field(el).classList.contains("nq-incorrect")).to.equal(true);
    });
    it("ignores a saved response that is not a number", async () => {
      const el = await withRecord(
        { status: "incorrect", attempts: 1, response: "c-12345678" },
        () => speed(),
      );
      expect(el.typed).to.equal("");
      expect(el.showAnswer).to.equal(false);
      expect(el.attempts).to.equal(1);
    });
    it("drops restored state in edit mode", async () => {
      const el = await withRecord(
        { status: "incorrect", attempts: 2, response: "3.5" },
        () => speed(),
      );
      el.haxeditModeChanged(true);
      await el.updateComplete;
      expect(el.typed).to.equal("");
      expect(el.showAnswer).to.equal(false);
      expect(el.attempts).to.equal(0);
    });
    it("with reroll brings back the status only", async () => {
      const el = await withRecord(
        { status: "correct", attempts: 1, response: "24", done: true },
        () => speed({ reroll: true, id: "speed-reroll" }),
      );
      await el.updateComplete;
      expect(el.typed).to.equal("");
      expect(el.showAnswer).to.equal(false);
      expect(el.attempts).to.equal(1);
      expect(el._chipDone()).to.equal(true);
    });
  });

  describe("reroll", () => {
    it("draws new values from the crypto source on every try again", async () => {
      const real = globalThis.crypto.getRandomValues.bind(globalThis.crypto);
      let calls = 0;
      let next = 0;
      const stub = (arr) => {
        calls++;
        arr[0] = next;
        return arr;
      };
      Object.defineProperty(globalThis.crypto, "getRandomValues", {
        value: stub,
        configurable: true,
        writable: true,
      });
      try {
        const el = await speed({ reroll: true, id: "speed-reroll" });
        expect(calls).to.be.at.least(2);
        expect(el._values).to.deep.equal({ d: 12, t: 30 });
        await type(el, "1");
        await check(el);
        next = 3;
        el.resetAnswer();
        await el.updateComplete;
        expect(el._values).to.deep.equal({ d: 15, t: 45 });
        expect(field(el).value).to.equal("");
        expect(
          el.shadowRoot.querySelector("#question-heading").textContent,
        ).to.contain("15 km in 45 minutes");
        // editing goes back to the stable numbers
        el.haxeditModeChanged(true);
        await el.updateComplete;
        expect(el._roll).to.equal(null);
      } finally {
        Object.defineProperty(globalThis.crypto, "getRandomValues", {
          value: real,
          configurable: true,
          writable: true,
        });
      }
    });
  });

  describe("HAX", () => {
    it("inherits the QuestionElement hooks", async () => {
      const el = await fixed();
      const hooks = el.haxHooks();
      [
        "editModeChanged",
        "activeElementChanged",
        "preProcessNodeToContent",
        "preProcessInsertContent",
        "inlineContextMenu",
      ].forEach((hook) => {
        expect(typeof el[hooks[hook]], hook).to.equal("function");
      });
      const menu = {};
      el.haxinlineContextMenu(menu);
      expect(menu.ceButtons.length).to.be.at.least(1);
    });
    it("edit mode drops learner state and shows the key to edit in place", async () => {
      const el = await speed();
      await type(el, "1");
      await check(el);
      el.haxeditModeChanged(true);
      await el.updateComplete;
      expect(el.showAnswer).to.equal(false);
      expect(el.typed).to.equal("");
      const author = el.shadowRoot.querySelector(".nq-author");
      expect(author).to.exist;
      const key = author.querySelector("#nq-key");
      expect(key.value).to.equal("d / (t / 60)");
      expect(author.querySelector("#nq-preview").textContent).to.contain(
        `${exact(el).toFixed(1)} km/h`,
      );
      await expect(el).shadowDom.to.be.accessible();
      // change the formula in place
      key.value = "d * 2";
      key.dispatchEvent(new Event("change", { bubbles: true }));
      await el.updateComplete;
      expect(el.formula).to.equal("d * 2");
      expect(author.querySelector("#nq-preview").textContent).to.contain(
        (el._values.d * 2).toFixed(1),
      );
      // a number makes it a fixed answer
      key.value = "42,5";
      key.dispatchEvent(new Event("change", { bubbles: true }));
      await el.updateComplete;
      expect(el.answer).to.equal(42.5);
      expect(el.formula).to.equal("");
      // a formula with an unknown name says so
      key.value = "d * q";
      key.dispatchEvent(new Event("change", { bubbles: true }));
      await el.updateComplete;
      expect(author.querySelector("#nq-preview").textContent).to.contain(
        "can not be worked out",
      );
      // add, edit and remove a variable
      const buttons = () => Array.from(author.querySelectorAll("button"));
      buttons()
        .find((b) => b.textContent.includes("Add variable"))
        .click();
      await el.updateComplete;
      expect(el.variables.length).to.equal(3);
      const name = author.querySelector(
        'input[data-index="2"][data-field="name"]',
      );
      name.value = "q";
      name.dispatchEvent(new Event("change", { bubbles: true }));
      const max = author.querySelector(
        'input[data-index="2"][data-field="max"]',
      );
      max.value = "1";
      max.dispatchEvent(new Event("change", { bubbles: true }));
      await el.updateComplete;
      expect(el._values.q).to.equal(1);
      expect(el._exact()).to.equal(el._values.d);
      buttons()
        .filter((b) => b.textContent.includes("Remove"))[2]
        .click();
      await el.updateComplete;
      expect(el.variables.map((v) => v.name)).to.deep.equal(["d", "t"]);
      // leaving edit mode hides the key again
      el.haxeditModeChanged(false);
      await el.updateComplete;
      expect(el.shadowRoot.querySelector(".nq-author")).to.equal(null);
    });
    it("keys typed in the author view do not reach HAX shortcuts", async () => {
      const el = await fixed();
      el.haxeditModeChanged(true);
      await el.updateComplete;
      let heard = 0;
      const listener = () => heard++;
      el.addEventListener("keydown", listener);
      el.shadowRoot.querySelector("#nq-key").dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Backspace",
          bubbles: true,
          composed: true,
        }),
      );
      el.removeEventListener("keydown", listener);
      expect(heard).to.equal(0);
    });
    it("takes the key from the settings form as properties", async () => {
      const el = await fixture(
        html`<numeric-question question="Double {n}"></numeric-question>`,
      ).then(ready);
      el.formula = "n * 2";
      el.variables = [{ name: "n", min: "4", max: "4", step: "1" }];
      await el.updateComplete;
      expect(el._exact()).to.equal(8);
      expect(
        el.shadowRoot.querySelector("#question-heading").textContent.trim(),
      ).to.equal("Double 4");
      el.formula = "";
      el.answer = "7";
      await el.updateComplete;
      expect(el._exact()).to.equal(7);
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
    it("passes the a11y audit in every state", async () => {
      const el = await speed();
      await expect(el).shadowDom.to.be.accessible();
      await type(el, "x");
      await check(el);
      await expect(el).shadowDom.to.be.accessible();
      await type(el, "1");
      await check(el);
      await expect(el).shadowDom.to.be.accessible();
      el.resetAnswer();
      await el.updateComplete;
      await type(el, exact(el).toFixed(1));
      await check(el);
      await expect(el).shadowDom.to.be.accessible();
    });
  });
});
