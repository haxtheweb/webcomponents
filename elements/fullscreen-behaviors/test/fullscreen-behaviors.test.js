import { fixture, expect, html } from "@open-wc/testing";

import { LitElement } from "lit";
import { FullscreenBehaviors } from "../fullscreen-behaviors.js";

describe("fullscreen-behaviors test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <fullscreen-behaviors title="test-title"></fullscreen-behaviors>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe("fullscreen-behaviors core behavior", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<fullscreen-behaviors></fullscreen-behaviors>`,
    );
  });

  it("reflects the fullscreen boolean properties as attributes", async () => {
    expect(element.fullscreen).to.be.false;
    expect(element.hasAttribute("fullscreen")).to.be.false;
    expect(typeof element.fullscreenEnabled).to.equal("boolean");
    element.fullscreen = true;
    await element.updateComplete;
    expect(element.hasAttribute("fullscreen")).to.be.true;
    expect(element.getAttribute("fullscreen")).to.equal("");
    element.fullscreen = false;
    await element.updateComplete;
    expect(element.hasAttribute("fullscreen")).to.be.false;
  });

  it("fullscreenTarget defaults to the element itself", () => {
    expect(element.fullscreenTarget === element).to.be.true;
  });

  it("_handleFullscreenChange tracks the document fullscreen element", async () => {
    element._handleFullscreenChange({});
    expect(element.fullscreen).to.be.false;
    Object.defineProperty(globalThis.document, "fullscreenElement", {
      get: () => element,
      configurable: true,
    });
    try {
      // the document-level handler wired in the constructor runs this
      globalThis.document.dispatchEvent(new Event("fullscreenchange"));
      await element.updateComplete;
      expect(element.fullscreen).to.be.true;
      expect(element.hasAttribute("fullscreen")).to.be.true;
      // element-level handler is wired as well
      Object.defineProperty(globalThis.document, "fullscreenElement", {
        get: () => null,
        configurable: true,
      });
      element.dispatchEvent(new Event("fullscreenchange"));
      await element.updateComplete;
      expect(element.fullscreen).to.be.false;
      expect(element.hasAttribute("fullscreen")).to.be.false;
    } finally {
      delete globalThis.document.fullscreenElement;
    }
  });

  it("preserves existing document-level fullscreen handlers", async () => {
    const sentinel = () => {};
    globalThis.document.onfullscreenchange = sentinel;
    await fixture(html`<fullscreen-behaviors></fullscreen-behaviors>`);
    // fixed: the document-level handler is wired with addEventListener so
    // the document.onfullscreenchange handler slot is never clobbered
    expect(globalThis.document.onfullscreenchange === sentinel).to.be.true;
    globalThis.document.onfullscreenchange = null;
  });

  it("multiple instances independently track document fullscreen state", async () => {
    const el1 = await fixture(
      html`<fullscreen-behaviors></fullscreen-behaviors>`,
    );
    const el2 = await fixture(
      html`<fullscreen-behaviors></fullscreen-behaviors>`,
    );
    el2.fullscreen = true;
    await el2.updateComplete;
    Object.defineProperty(globalThis.document, "fullscreenElement", {
      get: () => el1,
      configurable: true,
    });
    try {
      globalThis.document.dispatchEvent(new Event("fullscreenchange"));
      await el1.updateComplete;
      await el2.updateComplete;
      // both listeners fired: el1 is the fullscreen element, while el2's own
      // listener flipped it back off since it is not the fullscreen element
      expect(el1.fullscreen).to.be.true;
      expect(el2.fullscreen).to.be.false;
      expect(el1.hasAttribute("fullscreen")).to.be.true;
      expect(el2.hasAttribute("fullscreen")).to.be.false;
    } finally {
      delete globalThis.document.fullscreenElement;
    }
  });
});

describe("fullscreen-behaviors toggleFullscreen", () => {
  let element;
  let requested;
  let exited;

  beforeEach(async () => {
    element = await fixture(
      html`<fullscreen-behaviors></fullscreen-behaviors>`,
    );
    requested = 0;
    exited = 0;
    element.requestFullscreen = () => {
      requested++;
    };
    Object.defineProperty(globalThis.document, "exitFullscreen", {
      value: () => {
        exited++;
      },
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    delete globalThis.document.exitFullscreen;
    delete globalThis.document.fullscreenElement;
  });

  it("requests fullscreen when mode is true and not already fullscreen", () => {
    element.toggleFullscreen(true);
    expect(requested).to.equal(1);
    expect(exited).to.equal(0);
  });

  it("exits fullscreen when mode is false", () => {
    element.toggleFullscreen(false);
    expect(exited).to.equal(1);
    expect(requested).to.equal(0);
  });

  it("defaults mode from the document fullscreen state", () => {
    // not fullscreen so the default mode is true
    element.toggleFullscreen();
    expect(requested).to.equal(1);
    expect(exited).to.equal(0);
    // already fullscreen as this element so the default mode is false
    Object.defineProperty(globalThis.document, "fullscreenElement", {
      get: () => element,
      configurable: true,
    });
    element.toggleFullscreen();
    expect(exited).to.equal(1);
    expect(requested).to.equal(1);
  });

  it("is a no-op when already fullscreen with mode true", () => {
    Object.defineProperty(globalThis.document, "fullscreenElement", {
      get: () => element,
      configurable: true,
    });
    // fixed: mode true while already fullscreen no longer fires BOTH
    // exitFullscreen() and requestFullscreen() (the async exit used to
    // race the immediate request); we are already in the requested state
    // so nothing happens
    element.toggleFullscreen(true);
    expect(exited).to.equal(0);
    expect(requested).to.equal(0);
  });
});

// a target inside the element's own shadow root, the way a11y-media-player
// (#player-section) and img-view-viewer (#container) override fullscreenTarget
class FullscreenShadowTarget extends FullscreenBehaviors(LitElement) {
  render() {
    return html`<div id="target"></div>`;
  }
  get fullscreenTarget() {
    return this.shadowRoot && this.shadowRoot.querySelector("#target")
      ? this.shadowRoot.querySelector("#target")
      : this;
  }
}
globalThis.customElements.define(
  "fullscreen-shadow-target",
  FullscreenShadowTarget,
);

describe("fullscreen-behaviors with a target inside a shadow root", () => {
  let element;
  let target;
  let requested;
  let exited;

  beforeEach(async () => {
    element = await fixture(
      html`<fullscreen-shadow-target></fullscreen-shadow-target>`,
    );
    target = element.fullscreenTarget;
    requested = 0;
    exited = 0;
    target.requestFullscreen = () => {
      requested++;
    };
    Object.defineProperty(globalThis.document, "exitFullscreen", {
      value: () => {
        exited++;
      },
      configurable: true,
      writable: true,
    });
    // the browser retargets document.fullscreenElement to the shadow host
    // and reports the real element on the shadow root that holds it
    Object.defineProperty(globalThis.document, "fullscreenElement", {
      get: () => element,
      configurable: true,
    });
    Object.defineProperty(element.shadowRoot, "fullscreenElement", {
      get: () => target,
      configurable: true,
    });
  });

  afterEach(() => {
    delete globalThis.document.exitFullscreen;
    delete globalThis.document.fullscreenElement;
    delete element.shadowRoot.fullscreenElement;
  });

  it("targets an element inside the shadow root", () => {
    expect(target === element).to.be.false;
    expect(target.getRootNode() === element.shadowRoot).to.be.true;
  });

  it("tracks fullscreen through the shadow root, not the document", async () => {
    globalThis.document.dispatchEvent(new Event("fullscreenchange"));
    await element.updateComplete;
    expect(element.fullscreen).to.be.true;
    expect(element.hasAttribute("fullscreen")).to.be.true;
  });

  it("toggles out of fullscreen instead of requesting it again", () => {
    element.toggleFullscreen();
    expect(exited).to.equal(1);
    expect(requested).to.equal(0);
  });

  it("requests fullscreen when the shadow root reports nothing", () => {
    Object.defineProperty(element.shadowRoot, "fullscreenElement", {
      get: () => null,
      configurable: true,
    });
    element.toggleFullscreen();
    expect(requested).to.equal(1);
    expect(exited).to.equal(0);
  });
});

describe("fullscreen-behaviors quiets the exitFullscreen promise", () => {
  afterEach(() => {
    delete globalThis.document.exitFullscreen;
  });

  it("does not leave a rejected exitFullscreen promise unhandled", async () => {
    const element = await fixture(
      html`<fullscreen-behaviors></fullscreen-behaviors>`,
    );
    let caught = false;
    const rejected = Promise.reject(new TypeError("not in full screen"));
    const realCatch = rejected.catch.bind(rejected);
    rejected.catch = (fn) => {
      caught = true;
      return realCatch(fn);
    };
    Object.defineProperty(globalThis.document, "exitFullscreen", {
      value: () => rejected,
      configurable: true,
      writable: true,
    });
    element.toggleFullscreen(false);
    expect(caught).to.be.true;
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("fullscreen-behaviors passes accessibility test", async () => {
    const el = await fixture(
      html` <fullscreen-behaviors></fullscreen-behaviors> `
    );
    await expect(el).to.be.accessible();
  });
  it("fullscreen-behaviors passes accessibility negation", async () => {
    const el = await fixture(
      html`<fullscreen-behaviors
        aria-labelledby="fullscreen-behaviors"
      ></fullscreen-behaviors>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("fullscreen-behaviors can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<fullscreen-behaviors .foo=${'bar'}></fullscreen-behaviors>`);
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
      const el = await fixture(html`<fullscreen-behaviors ></fullscreen-behaviors>`);
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
      const el = await fixture(html`<fullscreen-behaviors></fullscreen-behaviors>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<fullscreen-behaviors></fullscreen-behaviors>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
