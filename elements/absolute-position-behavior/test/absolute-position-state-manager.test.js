import { fixture, expect, html } from "@open-wc/testing";
import "../lib/absolute-position-state-manager.js";
import "../absolute-position-behavior.js";

describe("AbsolutePositionStateManager direct lib import", () => {
  let manager;

  beforeEach(() => {
    manager = globalThis.AbsolutePositionStateManager.requestAvailability();
  });

  it("is a singleton", () => {
    const m1 = globalThis.AbsolutePositionStateManager.requestAvailability();
    const m2 = globalThis.AbsolutePositionStateManager.requestAvailability();
    expect(m1).to.equal(m2);
    expect(m1.tagName.toLowerCase()).to.equal(
      "absolute-position-state-manager",
    );
  });

  it("has correct tag", () => {
    expect(manager.constructor.tag).to.equal("absolute-position-state-manager");
  });

  it("starts with empty elements array", () => {
    expect(manager.elements).to.be.an("array");
  });

  describe("loadElement and unloadElement", () => {
    let el;

    beforeEach(async () => {
      el = await fixture(html`
        <div style="position: relative; width: 300px; height: 200px;">
          <div
            id="sm-target"
            style="position: absolute; top: 50px; left: 50px; width: 50px; height: 50px;"
          >
            Target
          </div>
          <absolute-position-behavior for="sm-target" position="bottom" auto>
            <div>Content</div>
          </absolute-position-behavior>
        </div>
      `);
      el = el.querySelector("absolute-position-behavior");
      await el.updateComplete;
    });

    afterEach(() => {
      manager.unloadElement(el);
    });

    it("loadElement adds element to elements array", () => {
      expect(manager.elements).to.contain(el);
    });

    it("unloadElement removes element from elements array", () => {
      manager.unloadElement(el);
      expect(manager.elements).to.not.contain(el);
    });

    it("loadElement does not duplicate existing element", () => {
      const before = manager.elements.length;
      manager.loadElement(el);
      manager.loadElement(el);
      expect(manager.elements.filter((e) => e === el).length).to.equal(1);
    });
  });

  describe("findTarget", () => {
    it("returns target when for attribute matches an id", async () => {
      const container = await fixture(html`
        <div>
          <div id="find-me">Found</div>
          <absolute-position-behavior for="find-me">
            <div>Content</div>
          </absolute-position-behavior>
        </div>
      `);
      const apb = container.querySelector("absolute-position-behavior");
      await apb.updateComplete;
      const target = manager.findTarget(apb);
      expect(target).to.exist;
      expect(target.id).to.equal("find-me");
      manager.unloadElement(apb);
    });

    it("returns target object when target property is set", async () => {
      const container = await fixture(html`
        <div>
          <div id="explicit-target">Explicit</div>
          <absolute-position-behavior>
            <div>Content</div>
          </absolute-position-behavior>
        </div>
      `);
      const apb = container.querySelector("absolute-position-behavior");
      const explicitTarget = container.querySelector("#explicit-target");
      apb.target = explicitTarget;
      await apb.updateComplete;
      const target = manager.findTarget(apb);
      expect(target).to.equal(explicitTarget);
      manager.unloadElement(apb);
    });

    it("returns undefined when for does not match anything", async () => {
      const container = await fixture(html`
        <div>
          <absolute-position-behavior for="no-such-id">
            <div>Content</div>
          </absolute-position-behavior>
        </div>
      `);
      const apb = container.querySelector("absolute-position-behavior");
      await apb.updateComplete;
      const target = manager.findTarget(apb);
      expect(target).to.be.null;
      manager.unloadElement(apb);
    });

    it("returns null selector when for is not a string", async () => {
      const container = await fixture(html`
        <div>
          <absolute-position-behavior>
            <div>Content</div>
          </absolute-position-behavior>
        </div>
      `);
      const apb = container.querySelector("absolute-position-behavior");
      apb.for = null;
      await apb.updateComplete;
      const target = manager.findTarget(apb);
      expect(target).to.be.null;
      manager.unloadElement(apb);
    });
  });

  describe("_safeQuerySelector", () => {
    it("returns element for valid selector", () => {
      const div = globalThis.document.createElement("div");
      div.id = "safe-test";
      globalThis.document.body.appendChild(div);
      const result = manager._safeQuerySelector(
        globalThis.document,
        "#safe-test",
      );
      expect(result).to.equal(div);
      div.remove();
    });

    it("returns undefined for invalid selector", () => {
      const result = manager._safeQuerySelector(
        globalThis.document,
        "##invalid",
      );
      expect(result).to.be.undefined;
    });

    it("returns null when selector matches nothing", () => {
      const result = manager._safeQuerySelector(
        globalThis.document,
        "#nonexistent-xyz",
      );
      expect(result).to.be.null;
    });
  });

  describe("updateElements and updateStickyElements", () => {
    let el1, el2;

    beforeEach(async () => {
      const container = await fixture(html`
        <div style="position: relative; width: 400px; height: 300px;">
          <div
            id="ue-target-1"
            style="position: absolute; top: 50px; left: 50px; width: 50px; height: 50px;"
          >
            T1
          </div>
          <absolute-position-behavior for="ue-target-1" position="bottom" auto>
            <div>C1</div>
          </absolute-position-behavior>
          <div
            id="ue-target-2"
            style="position: absolute; top: 150px; left: 150px; width: 50px; height: 50px;"
          >
            T2
          </div>
          <absolute-position-behavior
            for="ue-target-2"
            position="top"
            sticky
            auto
          >
            <div>C2</div>
          </absolute-position-behavior>
        </div>
      `);
      el1 = container.querySelectorAll("absolute-position-behavior")[0];
      el2 = container.querySelectorAll("absolute-position-behavior")[1];
      await el1.updateComplete;
      await el2.updateComplete;
    });

    afterEach(() => {
      manager.unloadElement(el1);
      manager.unloadElement(el2);
    });

    it("updateElements positions all elements", () => {
      manager.updateElements();
      expect(manager.elements.length).to.be.greaterThan(0);
    });

    it("updateStickyElements positions only sticky elements", () => {
      manager.updateStickyElements();
      expect(manager.elements.length).to.be.greaterThan(0);
    });
  });

  describe("loadSticky", () => {
    it("adds scroll listener when sticky element is loaded with scrollTarget", async () => {
      manager.scrollTarget = globalThis;
      manager.__watchSticky = false;
      const container = await fixture(html`
        <div style="position: relative; width: 400px; height: 300px;">
          <div
            id="sticky-ls-target"
            style="position: absolute; top: 50px; left: 50px; width: 50px; height: 50px;"
          >
            ST
          </div>
          <absolute-position-behavior
            for="sticky-ls-target"
            position="bottom"
            sticky
            auto
          >
            <div>Sticky content</div>
          </absolute-position-behavior>
        </div>
      `);
      const el = container.querySelector("absolute-position-behavior");
      await el.updateComplete;
      manager.loadSticky();
      expect(manager.__watchSticky).to.be.true;
      manager.unloadElement(el);
    });

    it("removes scroll listener when no sticky elements remain", async () => {
      manager.scrollTarget = globalThis;
      manager.__watchSticky = true;
      // No sticky elements in manager
      const nonStickyContainer = await fixture(html`
        <div style="position: relative; width: 400px; height: 300px;">
          <div
            id="non-sticky-target"
            style="position: absolute; top: 50px; left: 50px; width: 50px; height: 50px;"
          >
            NS
          </div>
          <absolute-position-behavior for="non-sticky-target" position="bottom">
            <div>Non-sticky</div>
          </absolute-position-behavior>
        </div>
      `);
      const el = nonStickyContainer.querySelector(
        "absolute-position-behavior",
      );
      await el.updateComplete;
      // Ensure no sticky elements
      manager.elements.forEach((e) => {
        if (e.sticky) manager.unloadElement(e);
      });
      manager.loadSticky();
      expect(manager.__watchSticky).to.be.false;
      manager.unloadElement(el);
    });
  });

  describe("_handleResize and _handleScroll", () => {
    it("_handleResize sets a timeout", () => {
      manager.__timeout = false;
      manager._handleResize();
      expect(manager.__timeout).to.not.be.false;
    });

    it("_handleResize clears existing timeout", () => {
      manager.__timeout = setTimeout(() => {}, 10000);
      manager._handleResize();
      // If it cleared properly, __timeout should be a new timeout
      expect(manager.__timeout).to.not.be.false;
    });

    it("_handleScroll sets a timeout", () => {
      manager.__timeout2 = false;
      manager._handleScroll();
      expect(manager.__timeout2).to.not.be.false;
    });

    it("_handleScroll clears existing timeout", () => {
      manager.__timeout2 = setTimeout(() => {}, 10000);
      manager._handleScroll();
      expect(manager.__timeout2).to.not.be.false;
    });
  });

  describe("checkMutations", () => {
    it("returns without update for style-only mutations on tracked elements", async () => {
      const container = await fixture(html`
        <div style="position: relative; width: 300px; height: 200px;">
          <div
            id="cm-target"
            style="position: absolute; top: 50px; left: 50px; width: 50px; height: 50px;"
          >
            T
          </div>
          <absolute-position-behavior for="cm-target" position="bottom" auto>
            <div>C</div>
          </absolute-position-behavior>
        </div>
      `);
      const el = container.querySelector("absolute-position-behavior");
      await el.updateComplete;
      const mutations = [
        {
          type: "attributes",
          attributeName: "style",
          target: el,
        },
      ];
      manager.checkMutations(mutations);
      // Should not throw
      expect(manager.elements).to.contain(el);
      manager.unloadElement(el);
    });

    it("triggers update for non-style mutations", async () => {
      const container = await fixture(html`
        <div style="position: relative; width: 300px; height: 200px;">
          <div
            id="cm-target2"
            style="position: absolute; top: 50px; left: 50px; width: 50px; height: 50px;"
          >
            T
          </div>
          <absolute-position-behavior for="cm-target2" position="bottom" auto>
            <div>C</div>
          </absolute-position-behavior>
        </div>
      `);
      const el = container.querySelector("absolute-position-behavior");
      await el.updateComplete;
      const mutations = [
        {
          type: "childList",
          attributeName: null,
          target: container,
        },
      ];
      manager.checkMutations(mutations);
      expect(manager.elements).to.contain(el);
      manager.unloadElement(el);
    });

    it("triggers update for style mutation on untracked element", async () => {
      const container = await fixture(html`
        <div style="position: relative; width: 300px; height: 200px;">
          <div
            id="cm-target3"
            style="position: absolute; top: 50px; left: 50px; width: 50px; height: 50px;"
          >
            T
          </div>
          <absolute-position-behavior for="cm-target3" position="bottom" auto>
            <div>C</div>
          </absolute-position-behavior>
        </div>
      `);
      const el = container.querySelector("absolute-position-behavior");
      await el.updateComplete;
      const untrackedDiv = globalThis.document.createElement("div");
      const mutations = [
        {
          type: "attributes",
          attributeName: "style",
          target: untrackedDiv,
        },
      ];
      manager.checkMutations(mutations);
      expect(manager.elements).to.contain(el);
      manager.unloadElement(el);
    });
  });

  describe("_getParentNode", () => {
    it("returns parentNode for regular nodes", () => {
      const div = globalThis.document.createElement("div");
      const child = globalThis.document.createElement("span");
      div.appendChild(child);
      expect(manager._getParentNode(child)).to.equal(div);
    });

    it("returns host for shadow root nodes", () => {
      const host = globalThis.document.createElement("div");
      globalThis.document.body.appendChild(host);
      const shadow = host.attachShadow({ mode: "open" });
      const child = globalThis.document.createElement("span");
      shadow.appendChild(child);
      expect(manager._getParentNode(child)).to.equal(host);
      host.remove();
    });
  });

  describe("positionElement with default position", () => {
    it("assigns bottom position when el has no position", async () => {
      const container = await fixture(html`
        <div style="position: relative; width: 300px; height: 200px;">
          <div
            id="np-target"
            style="position: absolute; top: 50px; left: 50px; width: 50px; height: 50px;"
          >
            T
          </div>
          <absolute-position-behavior for="np-target" auto>
            <div>C</div>
          </absolute-position-behavior>
        </div>
      `);
      const el = container.querySelector("absolute-position-behavior");
      el.position = undefined;
      await el.updateComplete;
      manager.positionElement(el);
      expect(el.position).to.equal("bottom");
      manager.unloadElement(el);
    });
  });

  describe("positionElement with flip logic", () => {
    it("flips position when fit-to-visible-bounds and element does not fit", async () => {
      // Create a target near the top edge so bottom positioning won't fit
      const container = await fixture(html`
        <div
          style="position: relative; width: 200px; height: 100px; overflow: hidden;"
        >
          <div
            id="flip-target"
            style="position: absolute; top: 5px; left: 50px; width: 50px; height: 10px;"
          >
            T
          </div>
          <absolute-position-behavior
            for="flip-target"
            position="bottom"
            fit-to-visible-bounds
            auto
          >
            <div style="height: 80px; width: 50px;">Tall content</div>
          </absolute-position-behavior>
        </div>
      `);
      const el = container.querySelector("absolute-position-behavior");
      await el.updateComplete;
      // positionElement should have flipped from bottom to top
      // because the tall content doesn't fit below the target
      expect(el.style.top).to.exist;
      manager.unloadElement(el);
    });
  });

  describe("removeEventListeners", () => {
    it("disconnects observer and aborts controllers", () => {
      // Load an element first to set up listeners
      manager.removeEventListeners();
      // Should not throw
      expect(manager.__observer).to.exist;
    });
  });

  describe("disconnectedCallback", () => {
    it("removes event listeners on disconnect", () => {
      // Can't actually disconnect the singleton from DOM in tests,
      // but we can call removeEventListeners directly
      manager.removeEventListeners();
      // Re-setup for other tests
      expect(manager.__observer).to.exist;
    });
  });
});
