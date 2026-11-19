import { fixture, expect, html } from "@open-wc/testing";

import { LrnMath, LrnMathController } from "../lrn-math.js";

// When the module appends the MathJax script, simulate a load failure by
// invoking its onerror handler instead of loading it.
const origAppendChild = document.head.appendChild.bind(document.head);
const warnings = [];
const origWarn = console.warn;
console.warn = function (msg) {
  warnings.push(String(msg));
};
document.head.appendChild = function (node) {
  if (
    node &&
    node.tagName === "SCRIPT" &&
    node.getAttribute &&
    String(node.getAttribute("src")).indexOf("mathjax") !== -1
  ) {
    if (typeof node.onerror === "function") {
      node.onerror();
    }
    return node;
  }
  return origAppendChild(node);
};

after(() => {
  console.warn = origWarn;
});

describe("lrn-math error state (library fails to load)", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html` <lrn-math>a + b</lrn-math> `);
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  it("warns when the MathJax library fails to load", async () => {
    expect(warnings.some((w) => w.indexOf("Error loading MathJax from") !== -1))
      .to.be.true;
  });

  it("shows the TeX source when MathJax can not load", async () => {
    expect(element.shadowRoot.querySelector("mjx-container")).to.not.exist;
    expect(element.shadowRoot.textContent).to.equal("a + b");
  });

  it("tells a typeset caller that nothing rendered", async () => {
    const handler = document.querySelector("lrn-math-controller");
    expect(handler).to.exist;
    const result = await new Promise((resolve) => {
      handler.typeset("q^2", false, (melem, styleNode) =>
        resolve([melem, styleNode]),
      );
    });
    expect(result).to.deep.equal([null, null]);
  });

  it("still reflects mathtext and processing while in error state", async () => {
    expect(element.getAttribute("mathtext")).to.equal("a + b");
    element.processing = true;
    expect(element.hasAttribute("processing")).to.be.true;
    element.processing = false;
    expect(element.hasAttribute("processing")).to.be.false;
    element.mathtext = "z + 9";
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(element.getAttribute("mathtext")).to.equal("z + 9");
    expect(element.querySelector("span")).to.exist;
    expect(element.shadowRoot.querySelector("mjx-container")).to.not.exist;
  });

  it("supports a lazy controller that defers library loading", async () => {
    const lazy = document.createElement("lrn-math-controller");
    lazy.setAttribute("src", "mathjax-local-fake.js");
    lazy.setAttribute("lazy", "lazy");
    origAppendChild(lazy);
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(lazy instanceof LrnMathController).to.be.true;
    expect(lazy.getAttribute("src")).to.equal("mathjax-local-fake.js");
    // MathJax is never fetched from a third-party CDN
    const scripts = document.querySelectorAll("script");
    let appendedCdnScript = false;
    scripts.forEach((s) => {
      if (
        String(s.getAttribute("src")).indexOf("cdnjs.cloudflare.com") !== -1
      ) {
        appendedCdnScript = true;
      }
    });
    expect(appendedCdnScript).to.be.false;
  });

  it("still reports tag and hax wiring", async () => {
    expect(LrnMath.tag).to.equal("lrn-math");
    const hooks = element.haxHooks();
    expect(hooks.editModeChanged).to.equal("haxeditModeChanged");
    element.haxeditModeChanged(false);
    expect(element._haxstate).to.be.false;
  });
});
