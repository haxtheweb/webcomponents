// The leak detector itself: it must catch each leak pattern from
// haxtheweb/issues#3237 and pass an element that cleans up after itself.
import { expect } from "@open-wc/testing";
import { autorun, observable } from "mobx";
import { expectNoLeak, measureLeaks } from "../test-setup/expect-no-leak.js";

const shared = observable({ count: 0 });

class LeakCleanElement extends HTMLElement {
  connectedCallback() {
    this.__disposer = [autorun(() => shared.count)];
    this.__ro = new ResizeObserver(() => {});
    this.__ro.observe(this);
  }
  disconnectedCallback() {
    this.__disposer.forEach((d) => d());
    this.__ro.disconnect();
  }
}
globalThis.customElements.define("leak-clean-element", LeakCleanElement);

class LeakReactionElement extends HTMLElement {
  constructor() {
    super();
    // the pattern behind the theme-parts leak: never disposed
    autorun(() => shared.count);
  }
}
globalThis.customElements.define("leak-reaction-element", LeakReactionElement);

const sharedObserver = new ResizeObserver(() => {});
class LeakObserverElement extends HTMLElement {
  connectedCallback() {
    // a shared utility observing registered elements, never unobserving
    sharedObserver.observe(this);
  }
}
globalThis.customElements.define("leak-observer-element", LeakObserverElement);

describe("expectNoLeak", () => {
  it("passes an element that disposes and disconnects what it creates", async () => {
    const found = await expectNoLeak("leak-clean-element");
    expect(found).to.deep.equal({
      reactions: 0,
      observed: 0,
      i18n: 0,
      cycles: 5,
    });
  });

  it("counts one undisposed reaction per created element", async () => {
    const found = await measureLeaks("leak-reaction-element", { cycles: 4 });
    expect(found.reactions).to.equal(4);
    let error = null;
    try {
      await expectNoLeak("leak-reaction-element");
    } catch (e) {
      error = e;
    }
    expect(error).to.be.an("error");
    expect(error.message).to.contain(
      "MobX reaction(s) created and never disposed",
    );
  });

  it("counts removed nodes an observer still watches", async () => {
    const found = await measureLeaks("leak-observer-element", { cycles: 3 });
    expect(found.observed).to.equal(3);
    expect(found.reactions).to.equal(0);
  });

  it("allow raises the limit for a known leak", async () => {
    const found = await expectNoLeak("leak-observer-element", {
      cycles: 2,
      allow: { observed: 2 },
    });
    expect(found.observed).to.equal(2);
  });

  it("create() builds elements with attributes or children", async () => {
    const found = await expectNoLeak("leak-clean-element", {
      cycles: 2,
      create: () => {
        const el = globalThis.document.createElement("leak-clean-element");
        el.setAttribute("data-x", "1");
        return el;
      },
    });
    expect(found.cycles).to.equal(2);
  });
});
