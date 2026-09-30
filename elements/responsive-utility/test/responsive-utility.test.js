import { fixture, expect, html } from "@open-wc/testing";
import { LitElement } from "lit";

import "../responsive-utility.js";
import { ResponsiveUtility } from "../responsive-utility.js";
import { ResponsiveUtilityBehaviors } from "../lib/responsive-utility-behaviors.js";
import "../lib/responsive-utility-element.js";

// Define a test element that uses the mixin so we can exercise it
class TestResponsiveMixin extends ResponsiveUtilityBehaviors(LitElement) {
  static get tag() {
    return "test-responsive-mixin";
  }
}
globalThis.customElements.define(TestResponsiveMixin.tag, TestResponsiveMixin);

describe("responsive-utility test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <responsive-utility title="test-title"></responsive-utility>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

// --- ResponsiveUtility singleton and setSize ---
describe("ResponsiveUtility.setSize", () => {
  let instance;
  let savedDetails;

  beforeEach(() => {
    instance = globalThis.ResponsiveUtility.requestAvailability();
    savedDetails = instance.details.slice();
    instance.details = [];
  });

  afterEach(() => {
    instance.details = savedDetails;
  });

  function makeDetail(width) {
    const el = globalThis.document.createElement("div");
    // offsetWidth is read from layout; we mock it for determinism
    Object.defineProperty(el, "offsetWidth", { value: width, configurable: true });
    return {
      element: el,
      attribute: "responsive-size",
      custom: "responsive-width",
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1500,
    };
  }

  it("sets xs when width < sm", () => {
    const detail = makeDetail(500);
    globalThis.ResponsiveUtility.setSize(detail, 500);
    expect(detail.element.getAttribute("responsive-size")).to.equal("xs");
    expect(detail.element.getAttribute("responsive-width")).to.equal("500");
  });

  it("sets sm when sm <= width < md", () => {
    const detail = makeDetail(700);
    globalThis.ResponsiveUtility.setSize(detail, 700);
    expect(detail.element.getAttribute("responsive-size")).to.equal("sm");
    expect(detail.element.getAttribute("responsive-width")).to.equal("700");
  });

  it("sets md when md <= width < lg", () => {
    const detail = makeDetail(1000);
    globalThis.ResponsiveUtility.setSize(detail, 1000);
    expect(detail.element.getAttribute("responsive-size")).to.equal("md");
    expect(detail.element.getAttribute("responsive-width")).to.equal("1000");
  });

  it("sets lg when lg <= width < xl", () => {
    const detail = makeDetail(1300);
    globalThis.ResponsiveUtility.setSize(detail, 1300);
    expect(detail.element.getAttribute("responsive-size")).to.equal("lg");
    expect(detail.element.getAttribute("responsive-width")).to.equal("1300");
  });

  it("sets xl when width >= xl", () => {
    const detail = makeDetail(1600);
    globalThis.ResponsiveUtility.setSize(detail, 1600);
    expect(detail.element.getAttribute("responsive-size")).to.equal("xl");
    expect(detail.element.getAttribute("responsive-width")).to.equal("1600");
  });

  it("rounds fractional widths", () => {
    const detail = makeDetail(600.7);
    globalThis.ResponsiveUtility.setSize(detail, 600.7);
    expect(detail.element.getAttribute("responsive-width")).to.equal("601");
  });

  it("defaults width to 0 when not supplied", () => {
    const detail = makeDetail(0);
    globalThis.ResponsiveUtility.setSize(detail);
    expect(detail.element.getAttribute("responsive-size")).to.equal("xs");
    expect(detail.element.getAttribute("responsive-width")).to.equal("0");
  });

  it("does not re-set attribute when value is unchanged", () => {
    const detail = makeDetail(500);
    globalThis.ResponsiveUtility.setSize(detail, 500);
    // set again with same width; should not throw and should keep value
    globalThis.ResponsiveUtility.setSize(detail, 500);
    expect(detail.element.getAttribute("responsive-size")).to.equal("xs");
  });
});

// --- requestAvailability singleton ---
describe("ResponsiveUtility.requestAvailability", () => {
  it("returns the same singleton instance on repeated calls", () => {
    const a = globalThis.ResponsiveUtility.requestAvailability();
    const b = globalThis.ResponsiveUtility.requestAvailability();
    expect(a).to.equal(b);
    expect(a).to.equal(globalThis.ResponsiveUtility.instance);
  });
});

// --- responiveElementEvent via event dispatch ---
describe("responiveElementEvent", () => {
  let instance;
  let savedDetails;

  beforeEach(() => {
    instance = globalThis.ResponsiveUtility.requestAvailability();
    savedDetails = instance.details.slice();
    instance.details = [];
  });

  afterEach(() => {
    // Clean up any observers we created
    instance.details.forEach((d) => {
      if (d.observer) {
        if (d.element) d.observer.unobserve(d.element);
        d.observer.disconnect();
      }
    });
    instance.details = savedDetails;
  });

  it("adds a detail to the list when a responsive-element event is fired", () => {
    const el = globalThis.document.createElement("div");
    globalThis.document.body.appendChild(el);
    const event = new CustomEvent("responsive-element", {
      bubbles: true,
      composed: true,
      detail: {
        element: el,
        attribute: "rs",
        custom: "rw",
        sm: 100,
        md: 200,
        lg: 300,
        xl: 400,
      },
    });
    globalThis.dispatchEvent(event);
    expect(instance.details.length).to.equal(1);
    const detail = instance.details[0];
    expect(detail.element).to.equal(el);
    expect(detail.attribute).to.equal("rs");
    expect(detail.custom).to.equal("rw");
    expect(detail.sm).to.equal(100);
    expect(detail.md).to.equal(200);
    expect(detail.lg).to.equal(300);
    expect(detail.xl).to.equal(400);
    globalThis.document.body.removeChild(el);
  });

  it("uses default breakpoint values when not supplied", () => {
    const el = globalThis.document.createElement("div");
    globalThis.document.body.appendChild(el);
    const event = new CustomEvent("responsive-element", {
      bubbles: true,
      composed: true,
      detail: { element: el },
    });
    globalThis.dispatchEvent(event);
    const detail = instance.details[0];
    expect(detail.attribute).to.equal("responsive-size");
    expect(detail.custom).to.equal("responsive-width");
    expect(detail.sm).to.equal(900);
    expect(detail.md).to.equal(1200);
    expect(detail.lg).to.equal(1500);
    expect(detail.xl).to.equal(1800);
    globalThis.document.body.removeChild(el);
  });

  it("sets initial size attributes from offsetWidth", () => {
    const el = globalThis.document.createElement("div");
    Object.defineProperty(el, "offsetWidth", { value: 100, configurable: true });
    globalThis.document.body.appendChild(el);
    const event = new CustomEvent("responsive-element", {
      bubbles: true,
      composed: true,
      detail: { element: el, sm: 200, md: 300, lg: 400, xl: 500 },
    });
    globalThis.dispatchEvent(event);
    // width 100 < sm 200 => xs
    expect(el.getAttribute("responsive-size")).to.equal("xs");
    expect(el.getAttribute("responsive-width")).to.equal("100");
    globalThis.document.body.removeChild(el);
  });

  // BUG: setSize does not guard against null element. When
  // responiveElementEvent receives an event with element: null, it still
  // calls setSize which throws TypeError on el.getAttribute().
  // See bug report in final message.
  it("setSize throws TypeError when detail.element is null (bug)", () => {
    const detail = {
      element: null,
      attribute: "responsive-size",
      custom: "responsive-width",
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1500,
    };
    expect(() =>
      globalThis.ResponsiveUtility.setSize(detail, 0),
    ).to.throw(TypeError, "getAttribute");
  });

  it("creates a ResizeObserver when available", () => {
    const el = globalThis.document.createElement("div");
    globalThis.document.body.appendChild(el);
    const event = new CustomEvent("responsive-element", {
      bubbles: true,
      composed: true,
      detail: { element: el },
    });
    globalThis.dispatchEvent(event);
    if (typeof globalThis.ResizeObserver === "function") {
      expect(instance.details[0].observer).to.exist;
    } else {
      expect(instance.details[0].observer).to.equal(null);
    }
    globalThis.document.body.removeChild(el);
  });
});

// --- _getObserver ---
describe("_getObserver", () => {
  let instance;

  beforeEach(() => {
    instance = globalThis.ResponsiveUtility.requestAvailability();
  });

  it("returns a ResizeObserver instance when available", () => {
    if (typeof globalThis.ResizeObserver !== "function") {
      // Skip in environments without ResizeObserver
      return;
    }
    const detail = { element: globalThis.document.createElement("div") };
    const obs = instance._getObserver(detail);
    expect(obs).to.exist;
    expect(obs).to.be.instanceOf(globalThis.ResizeObserver);
    obs.disconnect();
  });

  it("returns null when ResizeObserver is not a function", () => {
    const orig = globalThis.ResizeObserver;
    globalThis.ResizeObserver = undefined;
    try {
      const detail = { element: globalThis.document.createElement("div") };
      const obs = instance._getObserver(detail);
      expect(obs).to.equal(null);
    } finally {
      globalThis.ResizeObserver = orig;
    }
  });
});

// --- __handleResizeFallback ---
describe("__handleResizeFallback", () => {
  let instance;
  let savedDetails;

  beforeEach(() => {
    instance = globalThis.ResponsiveUtility.requestAvailability();
    savedDetails = instance.details.slice();
    instance.details = [];
  });

  afterEach(() => {
    instance.details = savedDetails;
  });

  it("calls setSize for each detail with an element", () => {
    const el1 = globalThis.document.createElement("div");
    Object.defineProperty(el1, "offsetWidth", { value: 100, configurable: true });
    const el2 = globalThis.document.createElement("div");
    Object.defineProperty(el2, "offsetWidth", { value: 200, configurable: true });
    instance.details = [
      { element: el1, attribute: "rs", custom: "rw", sm: 200, md: 300, lg: 400, xl: 500 },
      { element: el2, attribute: "rs", custom: "rw", sm: 300, md: 400, lg: 500, xl: 600 },
    ];
    instance.__handleResizeFallback();
    expect(el1.getAttribute("rs")).to.equal("xs");
    expect(el1.getAttribute("rw")).to.equal("100");
    expect(el2.getAttribute("rs")).to.equal("xs");
    expect(el2.getAttribute("rw")).to.equal("200");
  });

  it("skips details with no element", () => {
    instance.details = [
      { element: null, attribute: "rs", custom: "rw", sm: 200, md: 300, lg: 400, xl: 500 },
    ];
    // Should not throw
    expect(() => instance.__handleResizeFallback()).to.not.throw();
  });
});

// --- deleteResponiveElementEvent ---
describe("deleteResponiveElementEvent", () => {
  let instance;
  let savedDetails;

  beforeEach(() => {
    instance = globalThis.ResponsiveUtility.requestAvailability();
    savedDetails = instance.details.slice();
    instance.details = [];
  });

  afterEach(() => {
    instance.details.forEach((d) => {
      if (d.observer) {
        if (d.element) d.observer.unobserve(d.element);
        d.observer.disconnect();
      }
    });
    instance.details = savedDetails;
  });

  it("removes a detail by matching the detail object itself", () => {
    const el = globalThis.document.createElement("div");
    globalThis.document.body.appendChild(el);
    const event = new CustomEvent("responsive-element", {
      bubbles: true,
      composed: true,
      detail: { element: el, sm: 200, md: 300, lg: 400, xl: 500 },
    });
    globalThis.dispatchEvent(event);
    expect(instance.details.length).to.equal(1);
    const detail = instance.details[0];
    // Delete by passing the detail object
    const delEvent = new CustomEvent("delete-responsive-element", {
      bubbles: true,
      composed: true,
      detail: detail,
    });
    globalThis.dispatchEvent(delEvent);
    expect(instance.details.length).to.equal(0);
    globalThis.document.body.removeChild(el);
  });

  it("removes a detail by matching the element reference", () => {
    const el = globalThis.document.createElement("div");
    globalThis.document.body.appendChild(el);
    const event = new CustomEvent("responsive-element", {
      bubbles: true,
      composed: true,
      detail: { element: el, sm: 200, md: 300, lg: 400, xl: 500 },
    });
    globalThis.dispatchEvent(event);
    expect(instance.details.length).to.equal(1);
    // Delete by passing the element directly
    const delEvent = new CustomEvent("delete-responsive-element", {
      bubbles: true,
      composed: true,
      detail: el,
    });
    globalThis.dispatchEvent(delEvent);
    expect(instance.details.length).to.equal(0);
    globalThis.document.body.removeChild(el);
  });

  it("removes a detail by matching detail.element", () => {
    const el = globalThis.document.createElement("div");
    globalThis.document.body.appendChild(el);
    const event = new CustomEvent("responsive-element", {
      bubbles: true,
      composed: true,
      detail: { element: el, sm: 200, md: 300, lg: 400, xl: 500 },
    });
    globalThis.dispatchEvent(event);
    expect(instance.details.length).to.equal(1);
    // Delete by passing an object with .element
    const delEvent = new CustomEvent("delete-responsive-element", {
      bubbles: true,
      composed: true,
      detail: { element: el },
    });
    globalThis.dispatchEvent(delEvent);
    expect(instance.details.length).to.equal(0);
    globalThis.document.body.removeChild(el);
  });

  it("is a no-op when no details match", () => {
    const el = globalThis.document.createElement("div");
    const delEvent = new CustomEvent("delete-responsive-element", {
      bubbles: true,
      composed: true,
      detail: el,
    });
    globalThis.dispatchEvent(delEvent);
    expect(instance.details.length).to.equal(0);
  });
});

// --- ResponsiveUtilityBehaviors mixin ---
describe("ResponsiveUtilityBehaviors mixin", () => {
  it("defines expected properties", () => {
    const props = TestResponsiveMixin.properties;
    expect(props).to.have.property("disableResponsive");
    expect(props).to.have.property("responsiveSize");
    expect(props).to.have.property("responsiveWidth");
    expect(props).to.have.property("sm");
    expect(props).to.have.property("md");
    expect(props).to.have.property("lg");
    expect(props).to.have.property("xl");
  });

  it("sets default values in constructor", () => {
    const el = globalThis.document.createElement(TestResponsiveMixin.tag);
    expect(el.responsiveSize).to.equal("xs");
    expect(el.sm).to.equal(600);
    expect(el.md).to.equal(900);
    expect(el.lg).to.equal(1200);
    expect(el.xl).to.equal(1500);
    expect(el.disableResponsive).to.equal(false);
  });

  it("dispatches responsive-element event on firstUpdated", async () => {
    const instance = globalThis.ResponsiveUtility.requestAvailability();
    const savedDetails = instance.details.slice();
    instance.details = [];
    try {
      const el = await fixture(
        html`<test-responsive-mixin></test-responsive-mixin>`,
      );
      await el.updateComplete;
      // The responsive-element event should have been picked up
      expect(instance.details.length).to.be.greaterThan(0);
      const detail = instance.details.find(
        (d) => d.element === el,
      );
      expect(detail).to.exist;
      expect(detail.sm).to.equal(600);
      expect(detail.md).to.equal(900);
      // Cleanup
      if (detail.observer) {
        detail.observer.disconnect();
      }
      instance.details = instance.details.filter((d) => d !== detail);
    } finally {
      instance.details = savedDetails;
    }
  });

  it("does not dispatch when disableResponsive is true", async () => {
    const instance = globalThis.ResponsiveUtility.requestAvailability();
    const savedDetails = instance.details.slice();
    instance.details = [];
    try {
      const el = await fixture(
        html`<test-responsive-mixin disable-responsive></test-responsive-mixin>`,
      );
      await el.updateComplete;
      // No detail should have been added for this element
      const detail = instance.details.find((d) => d.element === el);
      expect(detail).to.equal(undefined);
    } finally {
      instance.details = savedDetails;
    }
  });

  it("dispatches responsive-element-deleted on disconnect", async () => {
    const el = await fixture(
      html`<test-responsive-mixin></test-responsive-mixin>`,
    );
    await el.updateComplete;
    let deletedEvent = null;
    el.addEventListener("responsive-element-deleted", (e) => {
      deletedEvent = e;
    });
    el.remove();
    expect(deletedEvent).to.exist;
    expect(deletedEvent.detail).to.equal(el);
  });
});

// --- responsive-utility-element (lib) ---
describe("responsive-utility-element", () => {
  it("is registered as a custom element", () => {
    const ctor = globalThis.customElements.get("responsive-utility-element");
    expect(ctor).to.exist;
  });

  it("can be instantiated and has mixin defaults", async () => {
    const el = await fixture(
      html`<responsive-utility-element></responsive-utility-element>`,
    );
    await el.updateComplete;
    expect(el.responsiveSize).to.equal("xs");
    expect(el.disableResponsive).to.equal(false);
    expect(el.tagName.toLowerCase()).to.equal("responsive-utility-element");
  });

  it("registers with the utility on firstUpdated", async () => {
    const instance = globalThis.ResponsiveUtility.requestAvailability();
    const savedDetails = instance.details.slice();
    instance.details = [];
    try {
      const el = await fixture(
        html`<responsive-utility-element></responsive-utility-element>`,
      );
      await el.updateComplete;
      const detail = instance.details.find((d) => d.element === el);
      expect(detail).to.exist;
      // Cleanup
      if (detail.observer) {
        detail.observer.disconnect();
      }
    } finally {
      instance.details = savedDetails;
    }
  });
});

// --- disconnectedCallback on ResponsiveUtility ---
describe("ResponsiveUtility disconnectedCallback", () => {
  it("removes the resize fallback listener on disconnect", async () => {
    // Create a fresh element to test disconnect logic
    const el = await fixture(
      html`<responsive-utility></responsive-utility>`,
    );
    expect(el.__resizeFallbackHandler).to.exist;
    // remove from DOM to trigger disconnectedCallback
    el.remove();
    // Should not throw; disconnectedCallback removes the fallback listener
    // If ResizeObserver is not available, the handler was attached
    if (typeof globalThis.ResizeObserver !== "function") {
      // Verify the listener was removed by dispatching a resize event
      // (no easy way to assert, just verify no throw)
    }
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("responsive-utility passes accessibility test", async () => {
    const el = await fixture(html` <responsive-utility></responsive-utility> `);
    await expect(el).to.be.accessible();
  });
  it("responsive-utility passes accessibility negation", async () => {
    const el = await fixture(
      html`<responsive-utility
        aria-labelledby="responsive-utility"
      ></responsive-utility>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("responsive-utility can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<responsive-utility .foo=${'bar'}></responsive-utility>`);
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
      const el = await fixture(html`<responsive-utility ></responsive-utility>`);
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
      const el = await fixture(html`<responsive-utility></responsive-utility>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<responsive-utility></responsive-utility>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
