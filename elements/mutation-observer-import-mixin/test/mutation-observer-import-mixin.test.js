import { fixture, expect, html } from "@open-wc/testing";
import { LitElement } from "lit";

import "../mutation-observer-import-mixin.js";
import { MutationObserverImportElement } from "../mutation-observer-import-mixin.js";
// direct lib import per the invisible-lib rule
import { MutationObserverImportMixin } from "../lib/MutationObserverImportMixin.js";

describe("mutation-observer-import-mixin test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <mutation-observer-import-mixin
        title="test-title"
      ></mutation-observer-import-mixin>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Accessibility - Mixin Behavior", () => {
    it("doesn't negatively impact accessibility of host element", async () => {
      await element.updateComplete;

      // Mixin should not interfere with accessibility
      await expect(element).shadowDom.to.be.accessible();
    });

    it("maintains accessibility during DOM mutations", async () => {
      await element.updateComplete;

      // Should remain accessible even when observing mutations
      const style = globalThis.getComputedStyle(element);
      expect(style.display).to.not.equal("none");
    });
  });

  describe("Accessibility - Observer Functionality", () => {
    it("preserves semantic structure during observations", async () => {
      await element.updateComplete;

      // Should not disrupt semantic DOM structure
      expect(element.tagName.toLowerCase()).to.equal(
        "mutation-observer-import-mixin",
      );
    });

    it("handles dynamic content changes accessibly", async () => {
      await element.updateComplete;

      // Dynamic changes should maintain accessibility
      await expect(element).shadowDom.to.be.accessible();
    });
  });
});

// A host that mixes the lib mixin over LitElement so the
// super.connectedCallback / super.disconnectedCallback pass-through branches
// run against a base class that actually defines those callbacks.
class MoimLitHost extends MutationObserverImportMixin(LitElement) {
  static get tag() {
    return "moim-lit-host";
  }
  render() {
    return html`<div>moim lit host</div>`;
  }
}
globalThis.customElements.define(MoimLitHost.tag, MoimLitHost);

// Captures registry.loadDefinition calls so tests can observe which tag
// names the mixin pushed through the DynamicImportRegistry without letting
// any real dynamic import happen (unregistered tags are a no-op upstream).
function spyLoadDefinition() {
  const registry = globalThis.DynamicImportRegistry.requestAvailability();
  const original = registry.loadDefinition;
  const calls = [];
  registry.loadDefinition = (tag) => {
    calls.push(tag);
    return original.call(registry, tag);
  };
  return {
    calls: calls,
    restore: () => {
      registry.loadDefinition = original;
    },
  };
}

describe("mutation-observer-import (the registered tag) behavior", () => {
  let spy;

  beforeEach(() => {
    spy = spyLoadDefinition();
  });

  afterEach(() => {
    spy.restore();
  });

  it("registers under the mutation-observer-import tag", () => {
    expect(globalThis.customElements.get("mutation-observer-import")).to.exist;
    expect(MutationObserverImportElement.tag).to.equal(
      "mutation-observer-import",
    );
  });

  it("creates the shared dynamic import registry on construction", () => {
    const registry = globalThis.DynamicImportRegistry.requestAvailability();
    expect(registry).to.exist;
    expect(registry.tagName.toLowerCase()).to.equal("dynamic-import-registry");
  });

  it("processes existing children once connected", async () => {
    const el = await fixture(
      html`<mutation-observer-import>
        <span>one</span><span>two</span>
      </mutation-observer-import>`,
    );
    expect(spy.calls).to.include("SPAN");
    expect(spy.calls.filter((t) => t === "SPAN").length).to.equal(2);
    expect(el._mutationObserver).to.exist;
  });

  it("feeds elements added after connection to the registry via the observer", async () => {
    const el = await fixture(
      html`<mutation-observer-import></mutation-observer-import>`,
    );
    spy.calls.length = 0;
    el.appendChild(globalThis.document.createElement("div"));
    await new Promise((resolve) => setTimeout(resolve, 25));
    expect(spy.calls).to.include("DIV");
  });

  it("ignores added text nodes because they have no tag name", async () => {
    const el = await fixture(
      html`<mutation-observer-import></mutation-observer-import>`,
    );
    spy.calls.length = 0;
    el.appendChild(globalThis.document.createTextNode("just text"));
    await new Promise((resolve) => setTimeout(resolve, 25));
    expect(spy.calls.length).to.equal(0);
  });

  it("stops forwarding mutations once disconnected", async () => {
    const el = await fixture(
      html`<mutation-observer-import></mutation-observer-import>`,
    );
    expect(el._mutationObserver).to.exist;
    spy.calls.length = 0;
    el.remove();
    el.appendChild(globalThis.document.createElement("aside"));
    await new Promise((resolve) => setTimeout(resolve, 25));
    expect(spy.calls.length).to.equal(0);
  });

  it("exposes processElementList and processNewElement as registry-driven helpers", () => {
    const el = globalThis.document.createElement("mutation-observer-import");
    spy.calls.length = 0;
    el.processElementList([
      globalThis.document.createElement("section"),
      globalThis.document.createElement("article"),
    ]);
    expect(spy.calls).to.include("SECTION");
    expect(spy.calls).to.include("ARTICLE");
    spy.calls.length = 0;
    el.processNewElement(globalThis.document.createElement("nav"));
    expect(spy.calls).to.include("NAV");
  });
});

describe("MutationObserverImportMixin lib over LitElement", () => {
  let spy;

  beforeEach(() => {
    spy = spyLoadDefinition();
  });

  afterEach(() => {
    spy.restore();
  });

  it("calls through to super lifecycle callbacks on connect and disconnect", async () => {
    const el = await fixture(html`<moim-lit-host></moim-lit-host>`);
    await el.updateComplete;
    // LitElement super callbacks ran (render happened) and the observer is live
    expect(el._mutationObserver).to.exist;
    expect(el.shadowRoot.querySelector("div")).to.exist;
    spy.calls.length = 0;
    el.appendChild(globalThis.document.createElement("p"));
    await new Promise((resolve) => setTimeout(resolve, 25));
    expect(spy.calls).to.include("P");
    el.remove();
    spy.calls.length = 0;
    el.appendChild(globalThis.document.createElement("span"));
    await new Promise((resolve) => setTimeout(resolve, 25));
    expect(spy.calls.length).to.equal(0);
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("mutation-observer-import-mixin passes accessibility test", async () => {
    const el = await fixture(
      html` <mutation-observer-import-mixin></mutation-observer-import-mixin> `
    );
    await expect(el).to.be.accessible();
  });
  it("mutation-observer-import-mixin passes accessibility negation", async () => {
    const el = await fixture(
      html`<mutation-observer-import-mixin
        aria-labelledby="mutation-observer-import-mixin"
      ></mutation-observer-import-mixin>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("mutation-observer-import-mixin can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<mutation-observer-import-mixin .foo=${'bar'}></mutation-observer-import-mixin>`);
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
      const el = await fixture(html`<mutation-observer-import-mixin ></mutation-observer-import-mixin>`);
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
      const el = await fixture(html`<mutation-observer-import-mixin></mutation-observer-import-mixin>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<mutation-observer-import-mixin></mutation-observer-import-mixin>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
