import { fixture, expect, html } from "@open-wc/testing";

import "../simple-wc.js";
import { createSWC } from "../simple-wc.js";

// createSWC builds a LitElement subclass from a config object; the suites
// below drive every factory branch with a comprehensive config and a
// minimal config.
//
// FIXED (issue #3102 bug 37): the factory now stores real Lit type
// CONSTRUCTORS (String/Number/Boolean/Array/Object) instead of capitalized
// strings.
// CRITICAL harness rule: a failing chai assertion whose expected value is a
// constructor function (e.g. .to.equal(String)) wedges the web-test-runner
// session for this package: the runner serializes the failed assertion's
// expected/actual values and never recovers from recursing the
// constructor's property graph, so the whole run reports "0 passed, 0
// failed" until the session timeout. Type assertions therefore use the
// `expect(type === String).to.equal(true)` style, never a constructor as
// the expected value.

const observed = { single: [], multi: [], plain: [], win: [], shadowBtn: [] };

const swcComprehensive = {
  name: "swc-comp-el",
  html: (self, html) =>
    html`<button id="btn">go</button>
      <div id="out">${self.myProp}</div>`,
  css: (self, css) => css`
    :host {
      display: block;
    }
    #out {
      border: 1px solid black;
    }
  `,
  callbacks: {
    onMyProp(newVal, oldVal) {
      observed.single.push([newVal, oldVal]);
      return "derived-" + newVal;
    },
    onMulti(count, flag) {
      observed.multi.push([count, flag]);
      return [count, flag, "x"];
    },
    onPlainNoStore(newVal, oldVal) {
      observed.plain.push([newVal, oldVal]);
      return "unused-result";
    },
    onWinClick() {
      observed.win.push(this);
    },
    onBtnClick() {
      observed.shadowBtn.push(this);
    },
  },
  data: {
    values: { myProp: "initial", count: 1, flag: true, plain: "p" },
    reflect: ["count"],
    observe: [
      [["myProp"], "onMyProp", "derivedProp"],
      [["count", "flag"], "onMulti", "multiResult"],
      [["plain"], "onPlainNoStore"],
    ],
    notify: ["myProp"],
  },
  deps: [],
  events: {
    window: { click: "onWinClick" },
    shadow: { "#btn": { click: "onBtnClick" } },
  },
};
const SwcComp = createSWC(swcComprehensive);
// static getter values are computed at module level for assertions; the
// type strings are asserted in tests against the precomputed maps
const compProps = SwcComp.properties;

const swcMinimal = {
  name: "swc-min-el",
  html: (self, html) => html`<div>minimal</div>`,
  css: (self, css) => css`
    :host {
      display: inline;
    }
  `,
  callbacks: {},
  data: { values: {} },
  // deps are resolved as ../../<dep> relative to simple-wc.js, i.e. against
  // the monorepo root, so the entry must include the elements/ prefix
  deps: ["elements/shadow-style/shadow-style.js"],
};
const SwcMin = createSWC(swcMinimal);
const minPropsKeys = Object.keys(SwcMin.properties);

describe("simple-wc test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html` <simple-wc title="test-title"></simple-wc> `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe("createSWC factory registration and properties", () => {
  it("defines the custom element from the config name and returns the class", () => {
    expect(globalThis.customElements.get("swc-comp-el")).to.equal(SwcComp);
    expect(SwcComp.tag).to.equal("swc-comp-el");
    expect(globalThis.customElements.get("swc-min-el")).to.equal(SwcMin);
    expect(SwcMin.tag).to.equal("swc-min-el");
  });

  it("maps value types to Lit constructor functions and camelCase keys to dashed attributes", () => {
    // FIXED (issue #3102 bug 37): constructors, not capitalized strings.
    // Compared via === so a constructor never becomes chai's expected
    // value (a failing .to.equal(String) wedges the whole WTR session)
    expect(compProps.myProp.type === String).to.equal(true);
    expect(compProps.myProp.attribute).to.equal("my-prop");
    expect(compProps.count.type === Number).to.equal(true);
    expect(compProps.flag.type === Boolean).to.equal(true);
    expect(compProps.plain.attribute).to.equal(undefined);
  });

  it("maps object and array default values to Object and Array constructors", () => {
    const SwcObj = createSWC({
      name: "swc-obj-el",
      html: (self, html) => html`<div>obj</div>`,
      css: (self, css) => css`
        :host {
          display: block;
        }
      `,
      callbacks: {},
      data: { values: { objVal: {}, arrVal: [] } },
      deps: [],
    });
    const props = SwcObj.properties;
    expect(props.objVal.type === Object).to.equal(true);
    expect(props.arrVal.type === Array).to.equal(true);
  });

  it("applies reflect only to listed keys", () => {
    expect(compProps.count.reflect).to.equal(true);
    expect(compProps.flag.reflect).to.equal(undefined);
    expect(compProps.myProp.reflect).to.equal(undefined);
  });

  it("produces an empty property set for a config without values", () => {
    expect(minPropsKeys).to.deep.equal([]);
  });
});

describe("createSWC generated element behavior", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<swc-comp-el></swc-comp-el>`);
    await element.updateComplete;
  });

  it("copies callbacks onto the instance and applies default values", () => {
    expect(element.onMyProp).to.be.a("function");
    expect(element.onWinClick).to.be.a("function");
    expect(element.myProp).to.equal("initial");
    expect(element.count).to.equal(1);
    expect(element.flag).to.equal(true);
    expect(element.plain).to.equal("p");
  });

  it("renders the config template and styles", () => {
    expect(element.shadowRoot.querySelector("#btn")).to.exist;
    const out = element.shadowRoot.querySelector("#out");
    expect(out).to.exist;
    expect(out.textContent).to.equal("initial");
    expect(element.shadowRoot.adoptedStyleSheets.length).to.be.greaterThan(0);
  });

  it("reflects listed properties to attributes and leaves others alone", async () => {
    element.count = 2;
    await element.updateComplete;
    expect(element.getAttribute("count")).to.equal("2");
    element.myProp = "attr-check";
    await element.updateComplete;
    expect(element.getAttribute("my-prop")).to.equal(null);
  });

  it("runs single-property observers with new and old values and stores results", async () => {
    observed.single.length = 0;
    element.myProp = "changed";
    await element.updateComplete;
    // the initial update also ran the observer with the constructor default
    // (old value undefined), so filter to the explicit change
    const explicit = observed.single.filter(
      (entry) => entry[0] === "changed" && entry[1] === "initial",
    );
    expect(explicit.length).to.equal(1);
    expect(element.derivedProp).to.equal("derived-changed");
  });

  it("runs multi-property observers with the current values and spreads array results", async () => {
    observed.multi.length = 0;
    element.count = 2;
    await element.updateComplete;
    const explicit = observed.multi.filter((entry) => entry[0] === 2);
    expect(explicit.length).to.equal(1);
    expect(explicit[0]).to.deep.equal([2, true]);
    expect(element.multiResult).to.deep.equal([2, true, "x"]);
    expect(Array.isArray(element.multiResult)).to.equal(true);
  });

  it("discards observer results when no result property is configured", async () => {
    observed.plain.length = 0;
    element.plain = "q";
    await element.updateComplete;
    const explicit = observed.plain.filter(
      (entry) => entry[0] === "q" && entry[1] === "p",
    );
    expect(explicit.length).to.equal(1);
    expect(element.unusedResult).to.equal(undefined);
  });

  it("skips observers entirely for properties that are not observed", async () => {
    observed.single.length = 0;
    observed.multi.length = 0;
    observed.plain.length = 0;
    element.flag = false;
    await element.updateComplete;
    expect(observed.single.length).to.equal(0);
    expect(observed.plain.length).to.equal(0);
    expect(observed.multi.filter((entry) => entry[0] === 1)).to.deep.equal([
      [1, false],
    ]);
  });

  it("dispatches dashed-name changed events for notified properties", async () => {
    let evt = null;
    element.addEventListener("my-prop-changed", (e) => {
      evt = e;
    });
    element.myProp = "notified";
    await element.updateComplete;
    expect(evt).to.exist;
    expect(evt.detail.value).to.equal("notified");
  });

  it("does not dispatch change events for non-notified properties", async () => {
    let evt = null;
    element.addEventListener("count-changed", (e) => {
      evt = e;
    });
    element.count = 5;
    await element.updateComplete;
    expect(evt).to.equal(null);
  });

  it("wires shadow DOM event maps in firstUpdated", () => {
    observed.shadowBtn.length = 0;
    element.shadowRoot.querySelector("#btn").click();
    expect(observed.shadowBtn.length).to.equal(1);
    expect(observed.shadowBtn[0]).to.equal(element);
  });

  // FIXED (issue #3102 bug 38): __applyWinEvents caches the bound handlers
  // on the instance (__winEventHandlers), so removeEventListener now
  // receives the identical function reference that was added and window
  // listeners no longer fire after the element disconnects.
  it("removes window event listeners on disconnect", async () => {
    const el = await fixture(html`<swc-comp-el></swc-comp-el>`);
    await el.updateComplete;
    const firedFor = () => observed.win.filter((w) => w === el).length;
    observed.win.length = 0;
    globalThis.dispatchEvent(new Event("click"));
    expect(firedFor()).to.equal(1);
    el.remove();
    globalThis.dispatchEvent(new Event("click"));
    // the listener was removed with the cached bound fn: no second firing
    expect(firedFor()).to.equal(1);
  });

  it("returns an empty haxProperties object", () => {
    expect(element.haxProperties()).to.deep.equal({});
  });
});

describe("createSWC minimal config", () => {
  it("renders without observers, notify, events or reflect", async () => {
    const el = await fixture(html`<swc-min-el></swc-min-el>`);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("div").textContent).to.equal("minimal");
    expect(el.haxProperties()).to.deep.equal({});
  });

  it("dynamically imports the configured deps list after construction", async () => {
    const el = await fixture(html`<swc-min-el></swc-min-el>`);
    await el.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 150));
    // the deps entry resolves ../../<dep> from simple-wc.js, which lands
    // on the real shadow-style package at the monorepo root and defines
    // its element once imported
    expect(globalThis.customElements.get("shadow-style")).to.exist;
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("simple-wc passes accessibility test", async () => {
    const el = await fixture(html` <simple-wc></simple-wc> `);
    await expect(el).to.be.accessible();
  });
  it("simple-wc passes accessibility negation", async () => {
    const el = await fixture(
      html`<simple-wc aria-labelledby="simple-wc"></simple-wc>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("simple-wc can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<simple-wc .foo=${'bar'}></simple-wc>`);
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
      const el = await fixture(html`<simple-wc ></simple-wc>`);
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
      const el = await fixture(html`<simple-wc></simple-wc>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<simple-wc></simple-wc>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
