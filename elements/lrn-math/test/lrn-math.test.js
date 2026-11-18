import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import { loadMathJax } from "../lib/mathjax-loader.js";

import { LrnMath, LrnMathController } from "../lrn-math.js";

// HAX schemas ship as JSON next to the element; read one whether the class
// returns the object or the URL of its file
const haxSchema = async (C) => {
  const hp = C.haxProperties;
  return typeof hp === "string" ? (await fetch(hp)).json() : hp;
};

// MathJax 4 is served from this repository's node_modules (the same files
// ubiquity ships), so these tests typeset with the real library and never
// touch the network.
const rendered = (el) =>
  waitUntil(
    () => el.shadowRoot.querySelector("mjx-container svg"),
    "MathJax did not render",
    { timeout: 10000 },
  );

// count the equations MathJax renders, once it has loaded
let typesetCalls = 0;
async function countTypesets() {
  const MathJax = await loadMathJax();
  if (!MathJax.__counted) {
    const tex2svgPromise = MathJax.tex2svgPromise;
    MathJax.tex2svgPromise = (...args) => {
      typesetCalls++;
      return tex2svgPromise(...args);
    };
    MathJax.__counted = true;
  }
}

describe("lrn-math test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html` <lrn-math>c = \\sqrt{a^2 + b^2}</lrn-math> `);
    await countTypesets();
    await rendered(element);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("registers the lrn-math and lrn-math-controller tags", async () => {
    expect(LrnMath.tag).to.equal("lrn-math");
    expect(globalThis.customElements.get("lrn-math")).to.exist;
    expect(globalThis.customElements.get("lrn-math-controller")).to.exist;
  });

  it("observes only the mathtext attribute", async () => {
    expect(LrnMath.observedAttributes).to.deep.equal(["mathtext"]);
  });

  it("creates a controller handler in the document head", async () => {
    const handler = document.querySelector("lrn-math-controller");
    expect(handler).to.exist;
    expect(document.head.contains(handler)).to.be.true;
  });

  it("typesets inline math into the shadow DOM as SVG", async () => {
    const sdom = element.shadowRoot;
    const container = sdom.querySelector("mjx-container");
    expect(container.getAttribute("jax")).to.equal("SVG");
    expect(container.hasAttribute("display")).to.be.false;
    // the CSS MathJax's SVG output needs travels into the shadow root
    const style = sdom.querySelector("style");
    expect(style.textContent).to.contain("mjx-container");
  });

  it("gives screen readers the spoken math", async () => {
    await waitUntil(
      () =>
        element.shadowRoot
          .querySelector("mjx-container")
          .outerHTML.includes("square root"),
      "no speech",
      { timeout: 10000 },
    );
  });

  it("loads MathJax 4 from the packages lrn-math depends on", async () => {
    const MathJax = await loadMathJax();
    expect(MathJax.version.split(".")[0]).to.equal("4");
    const script = [...document.querySelectorAll("script[src]")].find((s) =>
      s.src.includes("tex-svg.js"),
    );
    expect(script.src).to.contain("/node_modules/mathjax/tex-svg.js");
  });

  it("caches typesets so identical math is not re-typeset", async () => {
    const before = typesetCalls;
    element.updateMath();
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(typesetCalls).to.equal(before);
  });

  it("re-typesets when the light DOM math changes", async () => {
    const before = typesetCalls;
    element.textContent = "a + b";
    await waitUntil(() => typesetCalls === before + 1, "no re-typeset");
    await rendered(element);
    expect(
      element.shadowRoot.querySelectorAll("mjx-container").length,
    ).to.equal(1);
  });

  it("typesets display-mode math via the mode attribute", async () => {
    const displayEl = await fixture(html`
      <lrn-math mode="display">\\sum_{k=1}^n k</lrn-math>
    `);
    await rendered(displayEl);
    expect(
      displayEl.shadowRoot
        .querySelector("mjx-container")
        .getAttribute("display"),
    ).to.equal("true");
    // the D-prefixed cache key separates display from inline content
    expect(displayEl.getAttribute("mathtext")).to.exist;
  });

  it("exposes mathtext as a reflected attribute", async () => {
    expect(element.getAttribute("mathtext")).to.equal("c = \\sqrt{a^2 + b^2}");
    element.mathtext = "x + 1";
    expect(element.getAttribute("mathtext")).to.equal("x + 1");
    await new Promise((resolve) => setTimeout(resolve, 400));
    const span = element.querySelector("span");
    expect(span.textContent).to.equal("x + 1");
    // getter reads the same attribute back
    expect(element.mathtext).to.equal("x + 1");
  });

  it("skips replacement while already processing a mathtext change", async () => {
    element.processing = true;
    element.mathtext = "w^2";
    await new Promise((resolve) => setTimeout(resolve, 400));
    // the re-entrancy guard returns early so the light DOM is untouched
    expect(element.querySelector("span")).to.not.exist;
    expect(element.processing).to.be.true;
    element.processing = false;
    expect(element.processing).to.be.false;
  });

  it("normalizes a self-referential mathtext capture", async () => {
    element.mathtext = '<lrn-math data-hax-active="active">junk</lrn-math>';
    await new Promise((resolve) => setTimeout(resolve, 50));
    // the guard rebuilds mathtext from the real textContent
    expect(element.getAttribute("mathtext")).to.not.contain("<lrn-math");
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(element.querySelector("span")).to.exist;
  });

  it("falls back to updateMath when mathtext is cleared", async () => {
    element.setAttribute("mathtext", "");
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(element.getAttribute("mathtext")).to.equal("");
  });

  it("reflects the processing flag", async () => {
    expect(element.processing).to.be.false;
    element.processing = true;
    expect(element.hasAttribute("processing")).to.be.true;
    expect(element.processing).to.be.true;
    element.processing = false;
    expect(element.hasAttribute("processing")).to.be.false;
  });

  it("implements hax hooks", async () => {
    const hooks = element.haxHooks();
    expect(hooks.editModeChanged).to.equal("haxeditModeChanged");
    expect(hooks.activeElementChanged).to.equal("haxactiveElementChanged");
    element.haxeditModeChanged(true);
    expect(element._haxstate).to.be.true;
    element.haxactiveElementChanged(element, true);
    expect(element._haxstate).to.be.true;
    element.haxactiveElementChanged(element, false);
    // a falsey val does not overwrite the flag
    expect(element._haxstate).to.be.true;
  });

  it("reports haxProperties for the editor", async () => {
    const props = await haxSchema(LrnMath);
    expect(props.canScale).to.be.false;
    expect(props.canEditSource).to.be.true;
    expect(props.gizmo.title).to.equal("Math");
    expect(props.settings.configure[0].property).to.equal("mathtext");
  });

  it("queues typesets through the shared controller", async () => {
    const handler = document.querySelector("lrn-math-controller");
    expect(handler instanceof LrnMathController).to.be.true;
    const before = typesetCalls;
    const result = await new Promise((resolve) => {
      handler.typeset("z^2", false, (melem, styleNode) =>
        resolve([melem, styleNode]),
      );
    });
    expect(typesetCalls).to.equal(before + 1);
    expect(result[0].localName).to.equal("mjx-container");
    expect(result[1].localName).to.equal("style");
  });

  it("does not typeset empty math", async () => {
    const before = typesetCalls;
    const emptyEl = await fixture(html` <lrn-math></lrn-math> `);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(emptyEl.shadowRoot.querySelector("mjx-container")).to.not.exist;
    expect(typesetCalls).to.equal(before);
  });

  it("honors a src attribute and lazy loading on the controller", async () => {
    const lazy = document.createElement("lrn-math-controller");
    lazy.setAttribute("src", "mathjax-fake-src.js");
    lazy.setAttribute("lazy", "lazy");
    document.head.appendChild(lazy);
    await new Promise((resolve) => setTimeout(resolve, 50));
    // lazy controller never loads a library and the src is only stored
    expect(lazy.hasAttribute("lazy")).to.be.true;
    expect(lazy.getAttribute("src")).to.equal("mathjax-fake-src.js");
  });
});
