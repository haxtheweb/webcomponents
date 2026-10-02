import { fixture, expect, html } from "@open-wc/testing";
import { LitElement } from "lit";

// shadow-style parses `tag::shadow(selector) { css }` text at construction
// time and, once every referenced tag is defined, injects <style> elements
// into those tags' shadow roots (or the element itself when it has no
// shadow root). The evil attribute additionally hijacks
// Element.prototype.attachShadow, which must be undone immediately.
//
// Constructor-time attribute/text visibility requires the UPGRADE path
// (element in the DOM before the definition exists), so shadow-style is
// imported dynamically below instead of statically.

class SsTargetEl extends LitElement {
  static get tag() {
    return "s-s-target-el";
  }
  render() {
    return html`<div>shadow target</div>`;
  }
}
globalThis.customElements.define(SsTargetEl.tag, SsTargetEl);

class SsPlainEl extends HTMLElement {}
globalThis.customElements.define("s-s-plain-el", SsPlainEl);

let ShadowStyleClass = null;
let upgradedEvilElement = null;
let styleHost = null;
let targetHost = null;
let hijackProbe = null;
let evilErrors = [];
let evilWarns = [];

before(async () => {
  // targets exist in the document before any injection can happen
  targetHost = globalThis.document.createElement("div");
  targetHost.innerHTML = `<s-s-target-el></s-s-target-el><s-s-target-el></s-s-target-el><s-s-plain-el></s-s-plain-el>`;
  globalThis.document.body.appendChild(targetHost);

  // stub console so the evil constructor messages are captured, not noisy
  const originalError = console.error;
  const originalWarn = console.warn;
  console.error = (...args) => {
    evilErrors.push(args.join(" "));
  };
  console.warn = (...args) => {
    evilWarns.push(args.join(" "));
  };
  try {
    // element created BEFORE the definition so the constructor runs via
    // upgrade and can see the evil attribute and its inner text
    styleHost = globalThis.document.createElement("div");
    styleHost.innerHTML = `<shadow-style evil>s-s-target-el::shadow(.thing) {color: red}</shadow-style>`;
    globalThis.document.body.appendChild(styleHost);

    const mod = await import("../shadow-style.js");
    ShadowStyleClass = mod.ShadowStyle;

    // while the evil hijack is still installed, attachShadow must force open
    // mode; probe it with an element that requests a closed shadow root
    globalThis.customElements.define(
      "hijack-probe",
      class extends HTMLElement {
        constructor() {
          super();
          this.requestedClosedRoot = this.attachShadow({ mode: "closed" });
        }
      },
    );
    hijackProbe = globalThis.document.createElement("hijack-probe");

    // undo the evil attachShadow hijack immediately after the upgrade
    if (globalThis.Element.prototype._attachShadow) {
      globalThis.Element.prototype.attachShadow =
        globalThis.Element.prototype._attachShadow;
      delete globalThis.Element.prototype._attachShadow;
    }
    upgradedEvilElement = styleHost.querySelector("shadow-style");
    // let the post-whenDefined injection setTimeout fire
    await new Promise((resolve) => setTimeout(resolve, 50));
  } finally {
    console.error = originalError;
    console.warn = originalWarn;
  }
});

after(() => {
  if (styleHost) {
    styleHost.remove();
  }
  if (targetHost) {
    targetHost.remove();
  }
});

describe("shadow-style test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <shadow-style title="test-title"></shadow-style>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe("shadow-style upgrade-time processing (evil mode)", () => {
  it("registers the shadow-style tag and exports the class", () => {
    expect(globalThis.customElements.get("shadow-style")).to.exist;
    expect(ShadowStyleClass).to.exist;
    expect(ShadowStyleClass.tag).to.equal("shadow-style");
  });

  it("forced attachShadow into open mode while the evil hijack was active", () => {
    // the probe requested a closed root but the hijacked attachShadow forced
    // open mode, so the shadow root is still reachable from the element
    expect(hijackProbe.shadowRoot).to.exist;
    expect(hijackProbe.requestedClosedRoot).to.exist;
  });

  it("ran the evil branch and left the attachShadow hijack undone", () => {
    // console messages from the evil constructor were captured in before()
    expect(evilErrors.length).to.be.greaterThan(0);
    expect(evilWarns.length).to.be.greaterThan(0);
    expect(evilErrors).to.include("Leave us..");
    expect(evilWarns.some((w) => w.includes("stay here"))).to.equal(true);
    expect(globalThis.Element.prototype._attachShadow).to.not.exist;
    // the original attachShadow still works after the restore
    const probe = globalThis.document.createElement("div");
    const root = probe.attachShadow({ mode: "open" });
    expect(root).to.exist;
  });

  it("hides itself visually and builds the css map from its text", () => {
    expect(upgradedEvilElement.style.display).to.equal("none");
    expect(upgradedEvilElement.cssMap).to.deep.equal({
      "s-s-target-el": {
        ".thing": "color: red",
      },
    });
  });

  it("injects the parsed rule into every target shadow root", async () => {
    const targets = [
      ...globalThis.document.querySelectorAll("s-s-target-el"),
    ];
    expect(targets.length).to.equal(2);
    for (const target of targets) {
      const styles = [...target.shadowRoot.querySelectorAll("style")];
      expect(
        styles.some((s) => s.innerHTML.includes(".thing {color: red}")),
        `expected .thing rule in ${target.tagName}`,
      ).to.equal(true);
    }
  });
});

describe("shadow-style processShadowText behavior", () => {
  it("fixture elements hide themselves and start with an empty css map", async () => {
    const el = await fixture(html`<shadow-style></shadow-style>`);
    expect(el.style.display).to.equal("none");
    expect(el.cssMap).to.deep.equal({});
  });

  it("injects multiple selectors for one tag into a single style", async () => {
    const el = await fixture(html`<shadow-style></shadow-style>`);
    await el.processShadowText(
      "s-s-target-el::shadow(.a) {color: blue} s-s-target-el::shadow(.b) {background: green}",
    );
    await new Promise((resolve) => setTimeout(resolve, 50));
    const target = globalThis.document.querySelector("s-s-target-el");
    const styles = [...target.shadowRoot.querySelectorAll("style")];
    expect(
      styles.some(
        (s) =>
          s.innerHTML.includes(".a {color: blue}") &&
          s.innerHTML.includes(".b {background: green}"),
      ),
    ).to.equal(true);
  });

  it("appends to the element itself when the target has no shadow root", async () => {
    const el = await fixture(html`<shadow-style></shadow-style>`);
    await el.processShadowText("s-s-plain-el::shadow(.p) {padding: 2px}");
    await new Promise((resolve) => setTimeout(resolve, 50));
    const plain = globalThis.document.querySelector("s-s-plain-el");
    const styles = [...plain.querySelectorAll("style")];
    expect(
      styles.some((s) => s.innerHTML.includes(".p {padding: 2px}")),
    ).to.equal(true);
  });

  it("trims whitespace and collapses runs of spaces in the css text", async () => {
    const el = await fixture(html`<shadow-style></shadow-style>`);
    await el.processShadowText(
      "s-s-target-el::shadow(.ws) {  color:   orange;   background: pink;  }",
    );
    expect(el.cssMap["s-s-target-el"][".ws"]).to.equal(
      "color: orange; background: pink;",
    );
  });

  // FIXED (issue #3102 bug 40): duplicate tag+selector blocks are joined
  // with a newline so the generated css stays valid (was the invalid
  // concatenation "color: redcolor: blue").
  it("joins duplicate tag+selector blocks with a newline", async () => {
    const el = await fixture(html`<shadow-style></shadow-style>`);
    await el.processShadowText(
      "s-s-target-el::shadow(.dup) {color: red} s-s-target-el::shadow(.dup) {color: blue}",
    );
    expect(el.cssMap["s-s-target-el"][".dup"]).to.equal(
      "color: red\ncolor: blue",
    );
  });

  // FIXED (issue #3102 bug 9): plain css rules (no ::shadow part) are
  // skipped during parsing, so tmp[1] can never be undefined and the
  // un-awaited constructor promise can never reject with a TypeError.
  it("skips plain selectors without ::shadow instead of rejecting", async () => {
    const el = await fixture(html`<shadow-style></shadow-style>`);
    let caught = null;
    try {
      await el.processShadowText("plain-el {color: red}");
    } catch (e) {
      caught = e;
    }
    expect(caught).to.equal(null);
    // the plain rule was skipped entirely, not tolerated into the map
    expect(el.cssMap).to.deep.equal({});
  });

  // FIXED (issue #3102 bug 41): injection is now waited per tag, so one
  // never-defined tag no longer blocks the rest of the batch.
  it("one never-defined tag no longer blocks the injection batch", async () => {
    const el = await fixture(html`<shadow-style></shadow-style>`);
    el.processShadowText(
      "s-s-target-el::shadow(.blocked) {color: purple} never-defined-el::shadow(.x) {margin: 2px}",
    );
    await new Promise((resolve) => setTimeout(resolve, 50));
    const target = globalThis.document.querySelector("s-s-target-el");
    const styles = [...target.shadowRoot.querySelectorAll("style")];
    expect(
      styles.some((s) => s.innerHTML.includes(".blocked {color: purple}")),
    ).to.equal(true);
    // the never-defined tag is mapped but never injected anywhere
    expect(el.cssMap["never-defined-el"][".x"]).to.equal("margin: 2px");
  });

  // FIXED (issue #3102 bug 41): an INVALID custom element name rejects
  // whenDefined; the tag is skipped with a warning and the valid tag in
  // the same batch still gets injected.
  it("skips and warns for an invalid custom element name", async () => {
    const el = await fixture(html`<shadow-style></shadow-style>`);
    const originalWarn = console.warn;
    const warns = [];
    console.warn = (...args) => {
      warns.push(args.join(" "));
    };
    try {
      el.processShadowText(
        "NoDash::shadow(.bad) {color: red} s-s-target-el::shadow(.okname) {color: teal}",
      );
      await new Promise((resolve) => setTimeout(resolve, 50));
    } finally {
      console.warn = originalWarn;
    }
    expect(
      warns.some((w) => w.includes("NoDash") && w.includes("skipping")),
    ).to.equal(true);
    const target = globalThis.document.querySelector("s-s-target-el");
    const styles = [...target.shadowRoot.querySelectorAll("style")];
    expect(
      styles.some((s) => s.innerHTML.includes(".okname {color: teal}")),
    ).to.equal(true);
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("shadow-style passes accessibility test", async () => {
    const el = await fixture(html` <shadow-style></shadow-style> `);
    await expect(el).to.be.accessible();
  });
  it("shadow-style passes accessibility negation", async () => {
    const el = await fixture(
      html`<shadow-style aria-labelledby="shadow-style"></shadow-style>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("shadow-style can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<shadow-style .foo=${'bar'}></shadow-style>`);
    expect(el.foo).to.equal('bar');
  })
})
*/

/*
// Test if element is mobile responsive
describe('Test Mobile Responsiveness', () => {
    before(async () => {z   
      await setViewport({width: 375, height: 750});
    })
    it('sizes down to 360px', async () => {
      const el = await fixture(html`<shadow-style ></shadow-style>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('360px');
    })
}) */

/*
// Test if element sizes up for desktop behavior
describe('Test Desktop Responsiveness', () => {
    before(async () => {
      await setViewport({width: 1000, height: 1000});
    })
    it('sizes up to 410px', async () => {
      const el = await fixture(html`<shadow-style></shadow-style>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<shadow-style></shadow-style>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
