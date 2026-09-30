import { fixture, expect, html } from "@open-wc/testing";
import { SimpleProgress } from "../simple-progress.js";

const flush = (ms = 20) => new Promise((r) => setTimeout(r, ms));

describe("simple-progress behavior", () => {
  it("exposes the expected static tag", () => {
    expect(SimpleProgress.tag).to.equal("simple-progress");
  });

  it("renders the bar and its styles into the shadow root", async () => {
    const el = await fixture(html`<simple-progress></simple-progress>`);
    expect(el.shadowRoot.querySelector("#primaryProgress")).to.exist;
    expect(el.shadowRoot.querySelector("style")).to.exist;
    expect(el.shadowRoot.textContent.includes("indeterminate-bar")).to.equal(
      true,
    );
  });

  it("defaults to enabled", async () => {
    const el = await fixture(html`<simple-progress></simple-progress>`);
    expect(el.disabled).to.equal(false);
    expect(el.hasAttribute("disabled")).to.equal(false);
  });

  it("toggles the disabled attribute from the property", async () => {
    const el = await fixture(html`<simple-progress></simple-progress>`);
    el.disabled = true;
    expect(el.hasAttribute("disabled")).to.equal(true);
    expect(el.disabled).to.equal(true);
    el.disabled = false;
    expect(el.hasAttribute("disabled")).to.equal(false);
    expect(el.disabled).to.equal(false);
  });

  it("adds the finished class when disabled and an animation iterates", async () => {
    const el = globalThis.document.createElement("simple-progress");
    const progress = el.shadowRoot.querySelector("#primaryProgress");
    expect(progress.classList.contains("finished")).to.equal(false);
    el.setAttribute("disabled", "");
    // attributeChangedCallback listens for the next animationiteration once
    progress.dispatchEvent(new Event("animationiteration"));
    expect(progress.classList.contains("finished")).to.equal(true);
  });

  it("removes the finished class when re-enabled", async () => {
    const el = globalThis.document.createElement("simple-progress");
    const progress = el.shadowRoot.querySelector("#primaryProgress");
    el.setAttribute("disabled", "");
    el._iterationCallback();
    expect(progress.classList.contains("finished")).to.equal(true);
    el.removeAttribute("disabled");
    expect(progress.classList.contains("finished")).to.equal(false);
  });

  it("re-renders cleanly when render() runs again", async () => {
    const el = await fixture(html`<simple-progress></simple-progress>`);
    el.render();
    expect(el.shadowRoot.querySelector("#primaryProgress")).to.exist;
    expect(el.shadowRoot.querySelectorAll("#primaryProgress").length).to.equal(
      1,
    );
  });

  it("wires into ShadyCSS when present", async () => {
    const original = globalThis.ShadyCSS;
    const calls = [];
    globalThis.ShadyCSS = {
      styleElement: (el) => calls.push(["styleElement", el]),
      prepareTemplate: (template, tag) => calls.push(["prepareTemplate", tag]),
    };
    try {
      const el = globalThis.document.createElement("simple-progress");
      globalThis.document.body.appendChild(el);
      await flush();
      const styles = calls.filter(
        (call) => call[0] === "styleElement" && call[1] === el,
      );
      expect(styles.length).to.equal(1);
      const prepared = calls.filter((call) => call[0] === "prepareTemplate");
      expect(prepared.length).to.be.above(0);
      // BUG(simple-progress.js:142): render() passes this.tag but tag is only
      // a static getter, so ShadyCSS.prepareTemplate always receives undefined
      expect(prepared[prepared.length - 1][1]).to.equal(undefined);
      el.render();
      const preparedAfter = calls.filter(
        (call) => call[0] === "prepareTemplate",
      );
      expect(preparedAfter.length).to.equal(prepared.length + 1);
      el.remove();
    } finally {
      if (original === undefined) {
        delete globalThis.ShadyCSS;
      } else {
        globalThis.ShadyCSS = original;
      }
    }
  });

  it("passes the a11y audit while disabled", async () => {
    const el = await fixture(
      html`<simple-progress disabled></simple-progress>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });
});
