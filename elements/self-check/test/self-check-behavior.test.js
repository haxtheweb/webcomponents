import { fixture, expect, html } from "@open-wc/testing";
import { SelfCheck } from "../self-check.js";

const flush = (ms = 60) => new Promise((r) => setTimeout(r, ms));

async function waitFor(fn, timeout = 3000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (fn()) {
      return true;
    }
    await flush(25);
  }
  return fn();
}

const dataImage =
  "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

describe("self-check behavior", () => {
  it("exposes the expected static tag and haxProperties file reference", () => {
    expect(SelfCheck.tag).to.equal("self-check");
    const href = SelfCheck.haxProperties;
    expect(typeof href).to.equal("string");
    expect(href.endsWith("self-check.haxProperties.json")).to.equal(true);
  });

  it("has sensible defaults", async () => {
    const el = await fixture(
      html`<self-check><span slot="question">Q</span>A</self-check>`,
    );
    expect(el.correct).to.equal(false);
    expect(el.alt).to.equal("");
    expect(el.image).to.equal("");
    expect(el.question).to.equal("");
    expect(el.accentColor).to.equal("primary");
    expect(el.title).to.equal("Self-Check");
    expect(el.fullWidthImage).to.equal(false);
    expect(el.hasLearningObjective).to.equal("");
    expect(el.assessing).to.equal("");
  });

  it("marks itself as an OER assessment and renders heading + slots", async () => {
    const el = await fixture(
      html`<self-check title="Check yourself">
        <span slot="question">Is this a test?</span>
        Yes it is.
      </self-check>`,
    );
    expect(el.getAttribute("typeof")).to.equal("oer:Assessment");
    expect(el.shadowRoot.querySelector("#title").textContent.trim()).to.equal(
      "Check yourself",
    );
    expect(el.shadowRoot.querySelector('slot[name="question"]')).to.exist;
    expect(el.shadowRoot.querySelector("#answer_wrap slot")).to.exist;
    expect(el.shadowRoot.querySelector("#checkBtn")).to.exist;
    expect(el.shadowRoot.querySelector("#closeBtn")).to.exist;
  });

  it("renders OER meta tags for objectives and assessments", async () => {
    const el = await fixture(
      html`<self-check><span slot="question">Q</span>A</self-check>`,
    );
    expect(
      el.shadowRoot.querySelector('meta[property="oer:hasLearningObjective"]'),
    ).to.equal(null);
    expect(
      el.shadowRoot.querySelector('meta[property="oer:assessing"]'),
    ).to.equal(null);
    el.hasLearningObjective = "identify sharks";
    el.assessing = "quiz-42";
    await el.updateComplete;
    expect(
      el.shadowRoot
        .querySelector('meta[property="oer:hasLearningObjective"]')
        .getAttribute("content"),
    ).to.equal("identify sharks");
    expect(
      el.shadowRoot
        .querySelector('meta[property="oer:assessing"]')
        .getAttribute("content"),
    ).to.equal("quiz-42");
  });

  it("renders a lazy image with alt text, described-by, and the SVG loader", async () => {
    const el = await fixture(
      html`<self-check
        title="Image check"
        image="${dataImage}"
        alt="a marker"
        described-by="desc-1"
      >
        <span slot="question">Q</span>
        A
      </self-check>`,
    );
    const img = el.shadowRoot.querySelector('img[loading="lazy"]');
    expect(img).to.exist;
    expect(img.getAttribute("alt")).to.equal("a marker");
    expect(img.getAttribute("aria-describedby")).to.equal("desc-1");
    expect(img.getAttribute("src")).to.include("data:image/gif");
    // the lazy loader renders its SVG placeholder until the image loads
    expect(el.shadowRoot.querySelector("image")).to.exist;
  });

  it("toggles inert between the question and answer panels", async () => {
    const el = await fixture(
      html`<self-check><span slot="question">Q</span>A</self-check>`,
    );
    const question = el.shadowRoot.querySelector(".question");
    const answer = el.shadowRoot.querySelector("#answer_wrap");
    expect(question.hasAttribute("inert")).to.equal(false);
    expect(answer.hasAttribute("inert")).to.equal(true);
    expect(answer.getAttribute("aria-live")).to.equal("polite");
    el.correct = true;
    await el.updateComplete;
    expect(question.hasAttribute("inert")).to.equal(true);
    expect(answer.hasAttribute("inert")).to.equal(false);
  });

  it("openAnswer flips the panel state from both buttons", async () => {
    const el = await fixture(
      html`<self-check><span slot="question">Q</span>A</self-check>`,
    );
    el.shadowRoot.querySelector("#checkBtn").click();
    await el.updateComplete;
    await flush();
    expect(el.correct).to.equal(true);
    el.shadowRoot.querySelector("#closeBtn").click();
    await el.updateComplete;
    await flush();
    expect(el.correct).to.equal(false);
  });

  it("BUG(self-check.js:633-637): focus does not follow the revealed answer panel", async () => {
    // openAnswer calls .focus() on the simple-icon-button-lite HOST, but the
    // host is not focusable and no class in the chain enables delegatesFocus,
    // so the call is a no-op. When the question panel becomes inert the
    // focused button loses focus and keyboard/screen reader users are dropped
    // on <body> despite the code comment promising otherwise.
    const el = await fixture(
      html`<self-check><span slot="question">Q</span>A</self-check>`,
    );
    const checkBtn = el.shadowRoot.querySelector("#checkBtn");
    checkBtn.shadowRoot.querySelector("button").click();
    await el.updateComplete;
    await flush(150);
    expect(el.correct).to.equal(true);
    // walk inward: if focus had landed, activeElement would be self-check
    const active = globalThis.document.activeElement;
    expect(active.tagName === "BODY").to.equal(true);
  });

  it("renders the more information link when set", async () => {
    const el = await fixture(
      html`<self-check link="https://example.com/more">
        <span slot="question">Q</span>
        A
      </self-check>`,
    );
    const link = el.shadowRoot.querySelector(".more_info a");
    expect(link).to.exist;
    expect(link.getAttribute("href")).to.equal("https://example.com/more");
    expect(link.getAttribute("target")).to.equal("_blank");
    expect(link.getAttribute("rel")).to.equal("noopener");
    expect(link.textContent.trim()).to.include("More information");
  });

  it("lazy loads user-action and simple-tooltip once visible", async () => {
    const el = await fixture(
      html`<self-check><span slot="question">Q</span>A</self-check>`,
    );
    el.elementVisible = true;
    await el.updateComplete;
    const userActionReady = await waitFor(
      () => globalThis.customElements.get("user-action"),
    );
    const tooltipReady = await waitFor(
      () => globalThis.customElements.get("simple-tooltip"),
    );
    expect(userActionReady).to.equal(true);
    expect(tooltipReady).to.equal(true);
  });

  it("haxHooks maps the lifecycle hooks", async () => {
    const el = await fixture(
      html`<self-check><span slot="question">Q</span>A</self-check>`,
    );
    const hooks = el.haxHooks();
    expect(Object.keys(hooks).length).to.equal(2);
    expect(hooks.activeElementChanged).to.equal("haxactiveElementChanged");
    expect(hooks.mediaSourceUpdated).to.equal("haxmediaSourceUpdated");
  });

  it("haxactiveElementChanged toggles contenteditable on the title", async () => {
    const el = await fixture(
      html`<self-check title="Edit me"><span slot="question">Q</span>A</self-check>`,
    );
    const title = el.shadowRoot.querySelector("#title");
    el.haxactiveElementChanged(el, true);
    expect(title.getAttribute("contenteditable")).to.equal("true");
    el.haxactiveElementChanged(el, false);
    expect(title.hasAttribute("contenteditable")).to.equal(false);
    // BUG(self-check.js:620): the title resyncs from innerText, which returns
    // the RENDERED heading text; .heading is styled text-transform:uppercase
    // so the authored casing is lost on the HAX round-trip
    expect(el.title).to.equal("EDIT ME");
  });

  it("haxmediaSourceUpdated guards and pokes matching images", async () => {
    const el = await fixture(
      html`<self-check><span slot="question">Q</span>A</self-check>`,
    );
    // no path: early return
    expect(el.haxmediaSourceUpdated(null, {})).to.equal(undefined);
    // store without the helper: early return
    el.haxmediaSourceUpdated("x", {});
    // store that does not match this element: early return
    el.haxmediaSourceUpdated("x", { _mediaSrcMatches: () => false });
    // matching store: the images are poked with the path
    const pokes = [];
    el.haxmediaSourceUpdated("x", {
      _mediaSrcMatches: () => true,
      _pokeMatchingImgs: (root, path) => pokes.push(path),
    });
    expect(pokes.length).to.equal(1);
    expect(pokes[0]).to.equal("x");
  });

  it("reflects accent-color, correct, image, and alt attributes", async () => {
    const el = await fixture(
      html`<self-check><span slot="question">Q</span>A</self-check>`,
    );
    for (const color of ["accent", "success", "warning", "error", "info"]) {
      el.accentColor = color;
      await el.updateComplete;
      expect(el.getAttribute("accent-color")).to.equal(color);
    }
    el.correct = true;
    await el.updateComplete;
    expect(el.hasAttribute("correct")).to.equal(true);
    el.image = dataImage;
    el.alt = "marker";
    await el.updateComplete;
    expect(el.getAttribute("image")).to.include("data:image/gif");
    expect(el.getAttribute("alt")).to.equal("marker");
  });

  it("passes the a11y audit with image, question and answer", async () => {
    const el = await fixture(
      html`<self-check
        title="Sharks"
        image="${dataImage}"
        alt="A great white shark"
      >
        <span slot="question">How big?</span>
        Very big.
      </self-check>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });
});
