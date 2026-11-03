import { fixture, expect, html, oneEvent } from "@open-wc/testing";
import "../multiple-choice.js";
import "../lib/true-false-question.js";
import "../lib/short-answer-question.js";

const flush = (ms = 30) => new Promise((r) => setTimeout(r, ms));

const settle = async (els) => {
  await flush();
  await Promise.all(els.map((el) => el.updateComplete));
};

const disclosure = (el) => el.shadowRoot.querySelector("#disclosure");
const panel = (el) => el.shadowRoot.querySelector("#shell-panel");

describe("QuestionElement collapsible stack", () => {
  it("is off by default and renders the shell as before", async () => {
    const el = await fixture(
      html`<multiple-choice question="Which are ducks?">
        <input data-correct="true" value="Huey" />
        <input value="Mickey" />
      </multiple-choice>`,
    );
    await settle([el]);
    expect(el.collapsible).to.equal(false);
    expect(el.collapsed).to.equal(false);
    expect(el.hasAttribute("collapsible")).to.equal(false);
    expect(el.hasAttribute("collapsed")).to.equal(false);
    const shell = el.shadowRoot.querySelector(".shell");
    expect(shell.hasAttribute("data-stack")).to.equal(false);
    expect(disclosure(el)).to.equal(null);
    expect(panel(el)).to.equal(null);
    // the question heading stays in the body and the header keeps its tools
    const h3 = el.shadowRoot.querySelector(".shell-body h3#question-heading");
    expect(h3).to.exist;
    expect(h3.textContent.trim()).to.equal("Which are ducks?");
    expect(
      el.shadowRoot.querySelector(".shell-header > .shell-eyebrow#eyebrow"),
    ).to.exist;
    expect(el.shadowRoot.querySelector("#directions-toggle")).to.exist;
  });

  it("collapsed alone has no effect without collapsible", async () => {
    const el = await fixture(
      html`<multiple-choice collapsed question="Q">
        <input data-correct="true" value="A" />
      </multiple-choice>`,
    );
    await settle([el]);
    expect(disclosure(el)).to.equal(null);
    expect(el.shadowRoot.querySelector(".shell-body")).to.exist;
    expect(el.shadowRoot.querySelector(".shell").hasAttribute("data-stack")).to
      .be.false;
  });

  it("collapsed shows a header row with the question and its status", async () => {
    const el = await fixture(
      html`<multiple-choice collapsible collapsed question="Which are ducks?">
        <input data-correct="true" value="Huey" />
        <input value="Mickey" />
      </multiple-choice>`,
    );
    await settle([el]);
    const btn = disclosure(el);
    expect(btn).to.exist;
    expect(btn.tagName).to.equal("BUTTON");
    expect(btn.parentElement.tagName).to.equal("H3");
    expect(btn.getAttribute("aria-expanded")).to.equal("false");
    expect(btn.getAttribute("aria-controls")).to.equal("shell-panel");
    expect(panel(el).hidden).to.equal(true);
    expect(el.shadowRoot.querySelector(".shell").dataset.stack).to.equal(
      "collapsed",
    );
    const title = el.shadowRoot.querySelector("#question-heading");
    expect(btn.contains(title)).to.equal(true);
    expect(title.textContent.trim()).to.equal("Which are ducks?");
    // no duplicate heading in the body
    expect(el.shadowRoot.querySelector(".shell-body h3")).to.equal(null);
    const pill = el.shadowRoot.querySelector(".shell-pill");
    expect(pill.dataset.pill).to.equal("ready");
    expect(pill.textContent.trim()).to.equal(el.t.notAttempted);
    // header tools only show while expanded
    expect(el.shadowRoot.querySelector("#directions-toggle")).to.equal(null);
    await expect(el).shadowDom.to.be.accessible();
  });

  it("toggles open and closed from the disclosure button", async () => {
    const el = await fixture(
      html`<true-false-question
        collapsible
        collapsed
        question="Ducks have wings."
      >
        <input data-correct="true" value="True" />
        <input value="False" />
      </true-false-question>`,
    );
    await settle([el]);
    disclosure(el).click();
    await el.updateComplete;
    expect(el.collapsed).to.equal(false);
    expect(el.hasAttribute("collapsed")).to.equal(false);
    expect(disclosure(el).getAttribute("aria-expanded")).to.equal("true");
    expect(panel(el).hidden).to.equal(false);
    expect(el.shadowRoot.querySelector(".shell").dataset.stack).to.equal(
      "expanded",
    );
    expect(el.shadowRoot.querySelector(".shell-pill")).to.equal(null);
    expect(el.shadowRoot.querySelector("#directions-toggle")).to.exist;
    await expect(el).shadowDom.to.be.accessible();
    disclosure(el).click();
    await el.updateComplete;
    expect(el.collapsed).to.equal(true);
    expect(el.hasAttribute("collapsed")).to.equal(true);
    expect(panel(el).hidden).to.equal(true);
  });

  it("shows the result in the collapsed row once answered", async () => {
    const el = await fixture(
      html`<multiple-choice collapsible question="Q">
        <input data-correct="true" value="A" />
        <input value="B" />
      </multiple-choice>`,
    );
    await settle([el]);
    el.displayedAnswers.forEach((a) => {
      a.userGuess = a.correct ? true : "";
    });
    el.showAnswer = true;
    el.collapsed = true;
    await el.updateComplete;
    let pill = el.shadowRoot.querySelector(".shell-pill");
    expect(pill.dataset.pill).to.equal("correct");
    expect(pill.textContent.trim()).to.equal(el.t.correct);
    expect(
      pill.querySelector("simple-icon-lite").getAttribute("icon"),
    ).to.equal("icons:check");
    el.displayedAnswers.forEach((a) => {
      a.userGuess = a.correct ? "" : true;
    });
    el.requestUpdate();
    await el.updateComplete;
    pill = el.shadowRoot.querySelector(".shell-pill");
    expect(pill.dataset.pill).to.equal("incorrect");
    expect(pill.textContent.trim()).to.equal(el.t.incorrect);
  });

  it("accordion is limited to the contiguous run", async () => {
    const wrap = await fixture(
      html`<div>
        <multiple-choice id="a" collapsible question="One">
          <input data-correct="true" value="A" />
        </multiple-choice>
        <p>Text between questions</p>
        <true-false-question id="b" collapsible collapsed question="Two">
          <input data-correct="true" value="True" />
          <input value="False" />
        </true-false-question>
        <short-answer-question id="c" collapsible collapsed question="Three">
          <input data-correct="true" value="North" />
        </short-answer-question>
        <multiple-choice id="d" question="Joins the run by being adjacent">
          <input data-correct="true" value="A" />
        </multiple-choice>
      </div>`,
    );
    const [a, b, c, d] = ["a", "b", "c", "d"].map((id) =>
      wrap.querySelector(`#${id}`),
    );
    await settle([a, b, c, d]);
    // a is a lone explicit collapsible; b, c, d are one run
    expect(a._inStack).to.equal(false);
    expect([b._inStack, c._inStack, d._inStack]).to.deep.equal([
      true,
      true,
      true,
    ]);
    // d had no collapsed attribute and is not first, so it starts collapsed
    expect(d.collapsed).to.equal(true);
    disclosure(b).click();
    await settle([a, b, c, d]);
    expect(b.collapsed).to.equal(false);
    expect(c.collapsed).to.equal(true);
    expect(d.collapsed).to.equal(true);
    // the lone question across the paragraph is never touched
    expect(a.collapsed).to.equal(false);
    disclosure(d).click();
    await settle([a, b, c, d]);
    expect(d.collapsed).to.equal(false);
    expect(b.collapsed).to.equal(true);
    expect(disclosure(b).getAttribute("aria-expanded")).to.equal("false");
    expect(a.collapsed).to.equal(false);
    // closing the open one leaves the rest alone
    disclosure(d).click();
    await settle([a, b, c, d]);
    expect([b.collapsed, c.collapsed, d.collapsed]).to.deep.equal([
      true,
      true,
      true,
    ]);
    // opening the lone explicit question does not touch the run
    disclosure(a).click();
    await settle([a, b, c, d]);
    expect([b.collapsed, c.collapsed, d.collapsed]).to.deep.equal([
      true,
      true,
      true,
    ]);
  });

  it("keeps grid-plate columns (slots) as separate stacks", async () => {
    const wrap = await fixture(
      html`<div>
        <multiple-choice id="l1" slot="col-1" collapsible question="L1">
          <input data-correct="true" value="A" />
        </multiple-choice>
        <multiple-choice
          id="l2"
          slot="col-1"
          collapsible
          collapsed
          question="L2"
        >
          <input data-correct="true" value="A" />
        </multiple-choice>
        <multiple-choice id="r1" slot="col-2" collapsible question="R1">
          <input data-correct="true" value="A" />
        </multiple-choice>
      </div>`,
    );
    const [l1, l2, r1] = ["l1", "l2", "r1"].map((id) =>
      wrap.querySelector(`#${id}`),
    );
    await settle([l1, l2, r1]);
    disclosure(l2).click();
    await settle([l1, l2, r1]);
    expect(l1.collapsed).to.equal(true);
    expect(l2.collapsed).to.equal(false);
    expect(r1.collapsed).to.equal(false);
  });

  it("keeps the full authoring view while HAX is editing", async () => {
    const el = await fixture(
      html`<multiple-choice collapsible collapsed question="Q">
        <input data-correct="true" value="A" />
      </multiple-choice>`,
    );
    await settle([el]);
    expect(disclosure(el)).to.exist;
    // a visitor opens it, then HAX edit mode starts
    disclosure(el).click();
    await el.updateComplete;
    expect(el.collapsed).to.equal(false);
    el.haxeditModeChanged(true);
    await el.updateComplete;
    // the authored starting state comes back so HAX saves what the author set
    expect(el.collapsed).to.equal(true);
    expect(disclosure(el)).to.equal(null);
    expect(el.shadowRoot.querySelector(".shell").hasAttribute("data-stack")).to
      .be.false;
    expect(el.shadowRoot.querySelector(".shell-body h3")).to.exist;
    // the author changes the setting while editing
    el.collapsed = false;
    await el.updateComplete;
    el.haxeditModeChanged(false);
    await el.updateComplete;
    expect(el.collapsed).to.equal(false);
    expect(disclosure(el).getAttribute("aria-expanded")).to.equal("true");
  });

  it("does not collapse a sibling that HAX is editing", async () => {
    const wrap = await fixture(
      html`<div>
        <multiple-choice id="x" collapsible question="X">
          <input data-correct="true" value="A" />
        </multiple-choice>
        <multiple-choice id="y" collapsible collapsed question="Y">
          <input data-correct="true" value="A" />
        </multiple-choice>
      </div>`,
    );
    const x = wrap.querySelector("#x");
    const y = wrap.querySelector("#y");
    await settle([x, y]);
    x._haxstate = true;
    y._toggleCollapsed();
    await settle([x, y]);
    expect(x.collapsed).to.equal(false);
  });

  it("adds the stack settings to HAX advanced settings", async () => {
    const res = await fetch(
      new URL("../lib/multiple-choice.haxProperties.json", import.meta.url),
    );
    const props = await res.json();
    const adv = props.settings.advanced.map((s) => s.property);
    expect(adv).to.include("collapsible");
    expect(adv).to.include("collapsed");
  });
});

// answer a multiple-choice / true-false question correctly or not
const guess = (el, right = true) => {
  el.displayedAnswers.forEach((a) => {
    a.userGuess = a.correct === right ? true : "";
  });
  el.requestUpdate();
};

const stackFixture = () =>
  fixture(
    html`<div>
      <multiple-choice id="q1" question="One">
        <input data-correct="true" value="A" />
        <input value="B" />
      </multiple-choice>
      <true-false-question id="q2" question="Two">
        <input data-correct="true" value="True" />
        <input value="False" />
      </true-false-question>
      <multiple-choice id="q3" question="Three">
        <input data-correct="true" value="A" />
        <input value="B" />
      </multiple-choice>
    </div>`,
  );

describe("QuestionElement automatic stacks", () => {
  it("leaves a single question with no attributes unchanged", async () => {
    const wrap = await fixture(
      html`<div>
        <p>Before</p>
        <multiple-choice id="solo" question="Solo">
          <input data-correct="true" value="A" />
        </multiple-choice>
        <p>After</p>
      </div>`,
    );
    const el = wrap.querySelector("#solo");
    await settle([el]);
    expect(el._inStack).to.equal(false);
    expect(el.collapsed).to.equal(false);
    expect(el.hasAttribute("collapsible")).to.equal(false);
    expect(disclosure(el)).to.equal(null);
    expect(el.shadowRoot.querySelector(".shell").hasAttribute("data-stack")).to
      .be.false;
  });

  it("stacks adjacent questions only; any element between breaks it", async () => {
    const wrap = await fixture(
      html`<div>
        <multiple-choice id="a" question="A">
          <input data-correct="true" value="A" />
        </multiple-choice>
        <true-false-question id="b" question="B">
          <input data-correct="true" value="True" />
        </true-false-question>
        <p>A paragraph ends the stack</p>
        <short-answer-question id="c" question="C">
          <input data-correct="true" value="C" />
        </short-answer-question>
      </div>`,
    );
    const [a, b, c] = ["a", "b", "c"].map((id) => wrap.querySelector(`#${id}`));
    await settle([a, b, c]);
    expect(a._inStack).to.equal(true);
    expect(b._inStack).to.equal(true);
    expect(c._inStack).to.equal(false);
    expect(disclosure(a)).to.exist;
    expect(disclosure(c)).to.equal(null);
    // stack state is internal only: nothing is written to attributes
    [a, b, c].forEach((el) => {
      expect(el.hasAttribute("collapsible")).to.equal(false);
      expect(el.hasAttribute("_instack")).to.equal(false);
    });
    expect(a._stackRun()).to.deep.equal([a, b]);
  });

  it("opens the first question and collapses the rest unless authored", async () => {
    const wrap = await fixture(
      html`<div>
        <multiple-choice id="a" question="A">
          <input data-correct="true" value="A" />
        </multiple-choice>
        <multiple-choice id="b" question="B">
          <input data-correct="true" value="A" />
        </multiple-choice>
        <multiple-choice id="c" question="C">
          <input data-correct="true" value="A" />
        </multiple-choice>
      </div>`,
    );
    const [a, b, c] = ["a", "b", "c"].map((id) => wrap.querySelector(`#${id}`));
    await settle([a, b, c]);
    expect([a.collapsed, b.collapsed, c.collapsed]).to.deep.equal([
      false,
      true,
      true,
    ]);
    expect(disclosure(a).getAttribute("aria-expanded")).to.equal("true");
    expect(disclosure(b).getAttribute("aria-expanded")).to.equal("false");
    // what HAX would save is still the author's (absent) collapsed value
    expect(b._authoredCollapsed).to.equal(false);
    await expect(a).shadowDom.to.be.accessible();
    await expect(b).shadowDom.to.be.accessible();

    const wrap2 = await fixture(
      html`<div>
        <multiple-choice id="x" collapsed question="X">
          <input data-correct="true" value="A" />
        </multiple-choice>
        <multiple-choice id="y" question="Y">
          <input data-correct="true" value="A" />
        </multiple-choice>
      </div>`,
    );
    const x = wrap2.querySelector("#x");
    const y = wrap2.querySelector("#y");
    await settle([x, y]);
    // the author collapsed the first one; it stays collapsed
    expect(x.collapsed).to.equal(true);
    expect(y.collapsed).to.equal(true);
  });

  it("updates live when questions are inserted or removed", async () => {
    const wrap = await fixture(
      html`<div>
        <multiple-choice id="a" question="A">
          <input data-correct="true" value="A" />
        </multiple-choice>
        <p id="gap">Gap</p>
      </div>`,
    );
    const a = wrap.querySelector("#a");
    await settle([a]);
    expect(a._inStack).to.equal(false);
    const b = globalThis.document.createElement("true-false-question");
    b.setAttribute("question", "B");
    a.after(b);
    await settle([a, b]);
    expect(a._inStack).to.equal(true);
    expect(b._inStack).to.equal(true);
    expect(b.collapsed).to.equal(true);
    expect(disclosure(a)).to.exist;
    // a paragraph moved between them breaks the stack
    a.after(wrap.querySelector("#gap"));
    await settle([a, b]);
    expect(a._inStack).to.equal(false);
    expect(b._inStack).to.equal(false);
    expect(disclosure(a)).to.equal(null);
    // and moving it away joins them again
    b.after(wrap.querySelector("#gap"));
    await settle([a, b]);
    expect(a._inStack).to.equal(true);
    b.remove();
    await settle([a]);
    expect(a._inStack).to.equal(false);
    expect(b._inStack).to.equal(false);
    expect(disclosure(a)).to.equal(null);
  });

  it("collapses on a correct answer and opens the next unanswered one", async () => {
    const wrap = await stackFixture();
    const [q1, q2, q3] = ["q1", "q2", "q3"].map((id) =>
      wrap.querySelector(`#${id}`),
    );
    await settle([q1, q2, q3]);
    [q1, q2, q3].forEach((q) => {
      q._completionDelay = () => 0;
    });
    guess(q1, false);
    q1.checkAnswer();
    await oneEvent(wrap, "question-element-state");
    await settle([q1, q2, q3]);
    // incorrect stays open
    expect(q1.collapsed).to.equal(false);
    q1.resetAnswer();
    await settle([q1]);
    guess(q1, true);
    q1.checkAnswer();
    await oneEvent(wrap, "question-element-state");
    await settle([q1, q2, q3]);
    expect(q1.collapsed).to.equal(true);
    expect(q2.collapsed).to.equal(false);
    expect(q3.collapsed).to.equal(true);
    const pill = q1.shadowRoot.querySelector(".shell-pill");
    expect(pill.dataset.pill).to.equal("correct");
    // reopening shows the answered state with try again
    disclosure(q1).click();
    await settle([q1, q2, q3]);
    expect(q1.showAnswer).to.equal(true);
    expect(q2.collapsed).to.equal(true);
  });

  it("skips questions already answered correctly when opening the next", async () => {
    const wrap = await stackFixture();
    const [q1, q2, q3] = ["q1", "q2", "q3"].map((id) =>
      wrap.querySelector(`#${id}`),
    );
    await settle([q1, q2, q3]);
    [q1, q2, q3].forEach((q) => {
      q._completionDelay = () => 0;
    });
    disclosure(q2).click();
    await settle([q1, q2, q3]);
    guess(q2, true);
    q2.checkAnswer();
    await oneEvent(wrap, "question-element-state");
    await settle([q1, q2, q3]);
    expect(q3.collapsed).to.equal(false);
    disclosure(q1).click();
    await settle([q1, q2, q3]);
    guess(q1, true);
    q1.checkAnswer();
    await oneEvent(wrap, "question-element-state");
    await settle([q1, q2, q3]);
    expect([q1.collapsed, q2.collapsed, q3.collapsed]).to.deep.equal([
      true,
      true,
      false,
    ]);
  });

  it("collapses a lone explicit collapsible question when correct", async () => {
    const el = await fixture(
      html`<multiple-choice collapsible question="Q">
        <input data-correct="true" value="A" />
        <input value="B" />
      </multiple-choice>`,
    );
    await settle([el]);
    el._completionDelay = () => 0;
    guess(el, true);
    el.checkAnswer();
    await oneEvent(el, "question-element-state");
    await settle([el]);
    expect(el.collapsed).to.equal(true);
  });

  it("fires question-element-state with the result", async () => {
    const wrap = await stackFixture();
    const q2 = wrap.querySelector("#q2");
    await settle([q2]);
    q2._completionDelay = () => 0;
    guess(q2, false);
    q2.checkAnswer();
    const e = await oneEvent(wrap, "question-element-state");
    expect(e.bubbles).to.equal(true);
    expect(e.composed).to.equal(true);
    expect(e.target).to.equal(q2);
    expect(e.detail.tag).to.equal("true-false-question");
    expect(e.detail.question).to.equal("Two");
    expect(e.detail.status).to.equal("incorrect");
    expect(e.detail.correct).to.equal(false);
    expect(e.detail.attempts).to.equal(1);
    expect(e.detail.guess).to.be.an("array");
  });

  it("writes nothing to browser storage", async () => {
    const proto = globalThis.Storage.prototype;
    const original = proto.setItem;
    const writes = [];
    proto.setItem = function (key, value) {
      writes.push(key);
      return original.call(this, key, value);
    };
    const cookie = globalThis.document.cookie;
    try {
      const wrap = await stackFixture();
      const [q1, q2, q3] = ["q1", "q2", "q3"].map((id) =>
        wrap.querySelector(`#${id}`),
      );
      await settle([q1, q2, q3]);
      q1._completionDelay = () => 0;
      disclosure(q2).click();
      disclosure(q1).click();
      guess(q1, true);
      q1.checkAnswer();
      await oneEvent(wrap, "question-element-state");
      await settle([q1, q2, q3]);
      expect(q1.collapsed).to.equal(true);
    } finally {
      proto.setItem = original;
    }
    expect(writes).to.deep.equal([]);
    expect(globalThis.document.cookie).to.equal(cookie);
  });

  it("keeps HAX editing expanded and never saves stack state", async () => {
    const wrap = await stackFixture();
    const [q1, q2, q3] = ["q1", "q2", "q3"].map((id) =>
      wrap.querySelector(`#${id}`),
    );
    await settle([q1, q2, q3]);
    expect(q2.collapsed).to.equal(true);
    [q1, q2, q3].forEach((q) => q.haxeditModeChanged(true));
    await settle([q1, q2, q3]);
    [q1, q2, q3].forEach((q) => {
      expect(disclosure(q)).to.equal(null);
      expect(q.collapsed).to.equal(false);
      expect(q.hasAttribute("collapsed")).to.equal(false);
    });
    // HAX inserting another question while editing does not collapse it
    const q4 = globalThis.document.createElement("multiple-choice");
    q4._haxstate = true;
    q3.after(q4);
    await settle([q4]);
    expect(q4.collapsed).to.equal(false);
    // leaving edit mode rebuilds the visitor starting state
    [q1, q2, q3, q4].forEach((q) => q.haxeditModeChanged(false));
    await settle([q1, q2, q3, q4]);
    expect([
      q1.collapsed,
      q2.collapsed,
      q3.collapsed,
      q4.collapsed,
    ]).to.deep.equal([false, true, true, true]);
  });
});
