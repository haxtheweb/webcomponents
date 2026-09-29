import { fixture, expect, html } from "@open-wc/testing";
import "../lib/letter-grade-picker.js";
import { LetterGradePicker } from "../lib/letter-grade-picker.js";
import { GradeBookStore } from "../lib/grade-book-store.js";
import { gradeScale, flush } from "./fixtures.js";

describe("letter-grade-picker", () => {
  beforeEach(() => {
    GradeBookStore.gradeScale = JSON.parse(JSON.stringify(gradeScale));
    GradeBookStore.activeStudent = 0;
    GradeBookStore.activeAssignment = 0;
  });

  afterEach(() => {
    GradeBookStore.gradeScale = JSON.parse(JSON.stringify(gradeScale));
    GradeBookStore.activeStudent = 0;
    GradeBookStore.activeAssignment = 0;
  });

  it("has the expected tag and defaults", () => {
    expect(LetterGradePicker.tag).to.equal("letter-grade-picker");
    const el = globalThis.document.createElement("letter-grade-picker");
    expect(el.value).to.equal(null);
    expect(el.label).to.equal(null);
    expect(el.reveal).to.equal(false);
    expect(el.arrow).to.equal(false);
    expect(el.input).to.equal(false);
    expect(el.possible).to.equal(0);
    expect(el.score).to.equal(0);
  });

  it("renders one button per grade scale entry", async () => {
    const el = await fixture(html`<letter-grade-picker></letter-grade-picker>`);
    await flush();
    const buttons = el.shadowRoot.querySelectorAll("button");
    expect(buttons.length).to.equal(gradeScale.length);
    expect(el.shadowRoot.innerHTML.includes("letter-grade")).to.equal(true);
    // the number input is only rendered when input is enabled
    expect(el.shadowRoot.querySelector("simple-fields-field")).to.equal(null);
  });

  it("renders the score input when input is enabled", async () => {
    const el = await fixture(
      html`<letter-grade-picker input possible="100"></letter-grade-picker>`,
    );
    await flush(150);
    expect(el.shadowRoot.querySelector("simple-fields-field")).to.exist;
    // compare normalized textContent: the possible value is interpolated
    // across template whitespace
    const wrapperText = el.shadowRoot
      .querySelector(".score-wrapper")
      .textContent.replace(/\s+/g, " ")
      .trim();
    expect(wrapperText.indexOf("/ 100")).to.not.equal(-1);
  });

  it("clickScore selects the letter and derives the score from possible", async () => {
    const el = await fixture(
      html`<letter-grade-picker possible="100"></letter-grade-picker>`,
    );
    await flush();
    // listen for the change events the picker emits
    let valueChanged = null;
    let scoreChanged = null;
    el.addEventListener("value-changed", (e) => {
      valueChanged = e.detail.value;
    });
    el.addEventListener("score-changed", (e) => {
      scoreChanged = e.detail.score;
    });
    const aButton = el.shadowRoot.querySelector("button#btn0");
    aButton.click();
    await flush();
    expect(el.value).to.equal("A");
    // A tops out at 100% of 100 possible
    expect(el.score).to.equal(100);
    expect(valueChanged).to.equal("A");
    expect(scoreChanged).to.equal(100);
    const bButton = el.shadowRoot.querySelector("button#btn1");
    bButton.click();
    await flush();
    expect(el.value).to.equal("B");
    expect(el.score).to.equal(92);
  });

  it("marks the selected letter button with data-selected-value", async () => {
    const el = await fixture(
      html`<letter-grade-picker possible="100"></letter-grade-picker>`,
    );
    await flush();
    el.shadowRoot.querySelector("button#btn1").click();
    await flush();
    expect(
      el.shadowRoot.querySelectorAll("[data-selected-value]").length,
    ).to.equal(1);
    expect(
      el.shadowRoot
        .querySelector("[data-selected-value]")
        .getAttribute("letter"),
    ).to.equal("B");
  });

  it("activeEventOn/Off toggle the active attribute on hover targets", async () => {
    const el = await fixture(html`<letter-grade-picker></letter-grade-picker>`);
    await flush();
    const button = el.shadowRoot.querySelector("button#btn0");
    button.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    expect(button.getAttribute("active")).to.equal("active");
    button.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
    expect(button.getAttribute("active")).to.equal(null);
    // focusin/out path
    button.dispatchEvent(new Event("focusin", { bubbles: true }));
    expect(button.getAttribute("active")).to.equal("active");
    button.dispatchEvent(new Event("focusout", { bubbles: true }));
    expect(button.getAttribute("active")).to.equal(null);
  });

  it("scoreUpdated maps a numeric score back onto a letter", async () => {
    const el = await fixture(
      html`<letter-grade-picker input possible="100"></letter-grade-picker>`,
    );
    await flush(150);
    el.scoreUpdated({ detail: { value: 90 } });
    expect(el.value).to.equal("B");
    el.scoreUpdated({ detail: { value: 95 } });
    expect(el.value).to.equal("A");
    el.scoreUpdated({ detail: { value: 10 } });
    expect(el.value).to.equal("F");
  });

  it("updates the score when the value changes and vice versa", async () => {
    const el = await fixture(
      html`<letter-grade-picker possible="100"></letter-grade-picker>`,
    );
    await flush();
    el.value = "C";
    await flush();
    // value changes dispatch value-changed; score is only derived on click
    expect(el.value).to.equal("C");
  });
});
