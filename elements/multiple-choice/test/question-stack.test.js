import { fixture, expect, html } from "@open-wc/testing";
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

  it("opening one sibling closes the others (accordion)", async () => {
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
        <multiple-choice id="d" question="Not collapsible">
          <input data-correct="true" value="A" />
        </multiple-choice>
      </div>`,
    );
    const [a, b, c, d] = ["a", "b", "c", "d"].map((id) =>
      wrap.querySelector(`#${id}`),
    );
    await settle([a, b, c, d]);
    disclosure(b).click();
    await settle([a, b, c, d]);
    expect(b.collapsed).to.equal(false);
    expect(a.collapsed).to.equal(true);
    expect(c.collapsed).to.equal(true);
    // a question that did not opt in is never touched
    expect(d.collapsed).to.equal(false);
    expect(d.hasAttribute("collapsed")).to.equal(false);
    disclosure(c).click();
    await settle([a, b, c, d]);
    expect(c.collapsed).to.equal(false);
    expect(b.collapsed).to.equal(true);
    expect(disclosure(b).getAttribute("aria-expanded")).to.equal("false");
    // closing the open one leaves the rest alone
    disclosure(c).click();
    await settle([a, b, c, d]);
    expect([a.collapsed, b.collapsed, c.collapsed]).to.deep.equal([
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
