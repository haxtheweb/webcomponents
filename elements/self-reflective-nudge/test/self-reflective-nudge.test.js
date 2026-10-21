import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "../self-reflective-nudge.js";

const nudgeFixture = () => html`
  <self-reflective-nudge input="grade" prompt="How did you do?">
    <p data-nudge data-max-value="1" data-link="node/15">Try the exercises.</p>
    <p data-nudge data-min-value="2">Keep it up!</p>
  </self-reflective-nudge>
`;

describe("SelfReflectiveNudge test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(nudgeFixture());
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("passes the a11y audit with the mood input", async () => {
    element.input = "mood";
    await element.updateComplete;
    await expect(element).shadowDom.to.be.accessible();
  });

  it("renders the prompt and one radio per scale step", async () => {
    expect(element.shadowRoot.querySelector("legend").textContent).to.equal(
      "How did you do?",
    );
    expect(
      element.shadowRoot.querySelectorAll("input[type=radio]").length,
    ).to.equal(5);
  });

  it("falls back to a default prompt per input type", async () => {
    element.prompt = "";
    element.input = "mood";
    await element.updateComplete;
    expect(element.activePrompt).to.equal(element.t.moodPrompt);
    element.input = "grade";
    await element.updateComplete;
    expect(element.activePrompt).to.equal(element.t.gradePrompt);
  });

  it("reads nudges off the light DOM", async () => {
    expect(element.nudges).to.deep.equal([
      {
        minValue: null,
        maxValue: 1,
        nudge: "Try the exercises.",
        link: "node/15",
      },
      { minValue: 2, maxValue: null, nudge: "Keep it up!", link: null },
    ]);
  });

  it("shows no nudge until the student answers", async () => {
    expect(element.shadowRoot.querySelector(".nudge")).to.not.exist;
  });

  it("shows the low nudge and review link for a D (value 1)", async () => {
    element.shadowRoot.querySelector("#option-1").click();
    await element.updateComplete;
    expect(element.response).to.equal(1);
    const nudge = element.shadowRoot.querySelector(".nudge");
    expect(nudge.textContent).to.contain("Try the exercises.");
    expect(nudge.querySelector("a").getAttribute("href")).to.equal("node/15");
  });

  it("shows the alternate nudge without a link for a C (value 2)", async () => {
    element.shadowRoot.querySelector("#option-2").click();
    await element.updateComplete;
    const nudge = element.shadowRoot.querySelector(".nudge");
    expect(nudge.textContent).to.contain("Keep it up!");
    expect(nudge.querySelector("a")).to.not.exist;
  });

  it("treats a missing minValue / maxValue as an open range", async () => {
    element.response = 0;
    expect(element.selectedNudge.nudge).to.equal("Try the exercises.");
    element.response = 4;
    expect(element.selectedNudge.nudge).to.equal("Keep it up!");
  });

  it("returns no nudge when no range matches", async () => {
    element.nudges = [{ minValue: 3, maxValue: 4, nudge: "High only" }];
    element.response = 0;
    expect(element.selectedNudge).to.equal(null);
  });

  it("fires an event with the response and matched nudge", async () => {
    setTimeout(() => element.shadowRoot.querySelector("#option-0").click());
    const { detail } = await oneEvent(
      element,
      "self-reflective-nudge-response",
    );
    expect(detail.input).to.equal("grade");
    expect(detail.response).to.equal(0);
    expect(detail.label).to.equal("Grade F");
    expect(detail.nudge).to.equal("Try the exercises.");
    expect(detail.link).to.equal("node/15");
  });

  it("does not fire the event for an authored response attribute", async () => {
    let fired = false;
    const authored = await fixture(html`
      <self-reflective-nudge
        input="grade"
        response="3"
        @self-reflective-nudge-response="${() => (fired = true)}"
      ></self-reflective-nudge>
    `);
    await authored.updateComplete;
    expect(authored.response).to.equal(3);
    expect(fired).to.equal(false);
  });

  it("picks up light DOM changes after first paint", async () => {
    const p = globalThis.document.createElement("p");
    p.setAttribute("data-nudge", "");
    p.setAttribute("data-min-value", "4");
    p.textContent = "Perfect";
    element.appendChild(p);
    // MutationObserver callbacks are microtasks
    await new Promise((resolve) => setTimeout(resolve));
    await element.updateComplete;
    expect(element.nudges.length).to.equal(3);
  });

  it("writes the response as a checked attribute so server output is right", async () => {
    // ?checked is what server side rendering can express; .checked is not
    const radios = () => element.shadowRoot.querySelectorAll("input");
    expect(Array.from(radios()).some((r) => r.hasAttribute("checked"))).to.be
      .false;
    element.response = 3;
    await element.updateComplete;
    expect(
      Array.from(radios()).map((radio) => radio.hasAttribute("checked")),
    ).to.deep.equal([false, false, false, true, false]);
  });

  it("clears the selected radio when the response is reset after a click", async () => {
    element.shadowRoot.querySelector("#option-2").click();
    await element.updateComplete;
    expect(element.shadowRoot.querySelector("#option-2").checked).to.be.true;
    element.response = null;
    await element.updateComplete;
    const radios = Array.from(element.shadowRoot.querySelectorAll("input"));
    expect(radios.some((radio) => radio.checked)).to.be.false;
  });

  it("keeps picking up light DOM changes after the element is moved", async () => {
    const host = await fixture(html`<div><section></section></div>`);
    const section = host.querySelector("section");
    host.appendChild(element);
    await element.updateComplete;
    section.appendChild(element);
    await element.updateComplete;
    const p = globalThis.document.createElement("p");
    p.setAttribute("data-nudge", "");
    p.setAttribute("data-min-value", "4");
    p.textContent = "Perfect";
    element.appendChild(p);
    await new Promise((resolve) => setTimeout(resolve));
    await element.updateComplete;
    expect(element.nudges.length).to.equal(3);
  });

  it("refuses script-bearing nudge links", async () => {
    expect(element._safeLink("javascript:alert(1)")).to.equal(null);
    expect(element._safeLink("  JaVa\tScRiPt:alert(1)")).to.equal(null);
    expect(element._safeLink("data:text/html,<b>x</b>")).to.equal(null);
    expect(element._safeLink("node/15")).to.equal("node/15");
    expect(element._safeLink("https://haxtheweb.org")).to.equal(
      "https://haxtheweb.org",
    );
  });

  it("does not render an unsafe link", async () => {
    element.nudges = [
      { minValue: 0, maxValue: 4, nudge: "Hi", link: "javascript:alert(1)" },
    ];
    element.response = 2;
    await element.updateComplete;
    expect(element.shadowRoot.querySelector(".nudge")).to.exist;
    expect(element.shadowRoot.querySelector(".nudge a")).to.not.exist;
  });

  it("does not inherit a tight line-height from the surrounding theme", async () => {
    const tight = await fixture(html`
      <div style="line-height: 1">
        <self-reflective-nudge input="mood">
          <p data-nudge data-max-value="4">
            A nudge that is long enough to wrap.
          </p>
        </self-reflective-nudge>
      </div>
    `);
    const el = tight.querySelector("self-reflective-nudge");
    await el.updateComplete;
    el.shadowRoot.querySelector("#option-1").click();
    await el.updateComplete;
    const text = el.shadowRoot.querySelector(".nudge p");
    const style = globalThis.getComputedStyle(text);
    // an inherited line-height of 1 would make this equal to the font size
    expect(parseFloat(style.lineHeight)).to.be.greaterThan(
      parseFloat(style.fontSize) * 1.2,
    );
    // the nudge fits entirely inside the element's own box
    const host = el.getBoundingClientRect();
    const nudge = el.shadowRoot.querySelector(".nudge").getBoundingClientRect();
    expect(nudge.bottom).to.be.at.most(host.bottom);
  });

  it("keeps the prompt inside the box instead of straddling the top border", async () => {
    // a native legend straddles the border, putting half of it on the page
    // background (dark text on a dark page is unreadable)
    const fieldset = element.shadowRoot.querySelector("fieldset");
    const legend = element.shadowRoot.querySelector("legend");
    const borderLine =
      fieldset.getBoundingClientRect().top +
      parseFloat(globalThis.getComputedStyle(fieldset).borderTopWidth);
    expect(legend.getBoundingClientRect().top).to.be.at.least(borderLine);
  });

  it("follows the page color-scheme (light-dark) for dark mode", async () => {
    const colors = async (scheme) => {
      const wrap = await fixture(html`
        <div style="color-scheme: ${scheme}">
          <self-reflective-nudge
            input="grade"
            prompt="Q"
          ></self-reflective-nudge>
        </div>
      `);
      const el = wrap.querySelector("self-reflective-nudge");
      await el.updateComplete;
      const fieldset = el.shadowRoot.querySelector("fieldset");
      const style = globalThis.getComputedStyle(fieldset);
      return { background: style.backgroundColor, text: style.color };
    };
    const light = await colors("light");
    const dark = await colors("dark");
    expect(light.background).to.equal("rgb(255, 255, 255)");
    expect(dark.background).to.not.equal(light.background);
    expect(dark.text).to.not.equal(light.text);
  });

  it("writes the nudges array to light DOM on a HAX save", async () => {
    const node = globalThis.document.createElement("self-reflective-nudge");
    node.nudges = [
      { minValue: 0, maxValue: 4, nudge: "Anything", link: "node/2" },
      { minValue: null, maxValue: null, nudge: "Open", link: null },
    ];
    // a stale child from an earlier save must be replaced, not duplicated
    const stale = globalThis.document.createElement("p");
    stale.setAttribute("data-nudge", "");
    node.appendChild(stale);
    const result = element.haxpreProcessNodeToContent(node);
    const written = Array.from(result.querySelectorAll("p[data-nudge]"));
    expect(written.length).to.equal(2);
    expect(written[0].getAttribute("data-min-value")).to.equal("0");
    expect(written[0].getAttribute("data-max-value")).to.equal("4");
    expect(written[0].getAttribute("data-link")).to.equal("node/2");
    expect(written[0].textContent).to.equal("Anything");
    expect(written[1].hasAttribute("data-min-value")).to.equal(false);
    expect(written[1].hasAttribute("data-max-value")).to.equal(false);
  });
});
