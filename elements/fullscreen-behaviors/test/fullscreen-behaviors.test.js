import { fixture, expect, html } from "@open-wc/testing";

import "../fullscreen-behaviors.js";

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

describe('fullscreen-behaviors core behavior', () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<fullscreen-behaviors></fullscreen-behaviors>`,
    );
  });

  it('reflects the fullscreen boolean properties as attributes', async () => {
    expect(element.fullscreen).to.be.false;
    expect(element.hasAttribute('fullscreen')).to.be.false;
    expect(typeof element.fullscreenEnabled).to.equal('boolean');
    element.fullscreen = true;
    await element.updateComplete;
    expect(element.hasAttribute('fullscreen')).to.be.true;
    expect(element.getAttribute('fullscreen')).to.equal('');
    element.fullscreen = false;
    await element.updateComplete;
    expect(element.hasAttribute('fullscreen')).to.be.false;
  });

  it('fullscreenTarget defaults to the element itself', () => {
    expect(element.fullscreenTarget === element).to.be.true;
  });

  it('_handleFullscreenChange tracks the document fullscreen element', async () => {
    element._handleFullscreenChange({});
    expect(element.fullscreen).to.be.false;
    Object.defineProperty(globalThis.document, 'fullscreenElement', {
      get: () => element,
      configurable: true,
    });
    try {
      // the document-level handler wired in the constructor runs this
      globalThis.document.dispatchEvent(new Event('fullscreenchange'));
      await element.updateComplete;
      expect(element.fullscreen).to.be.true;
      expect(element.hasAttribute('fullscreen')).to.be.true;
      // element-level handler is wired as well
      Object.defineProperty(globalThis.document, 'fullscreenElement', {
        get: () => null,
        configurable: true,
      });
      element.dispatchEvent(new Event('fullscreenchange'));
      await element.updateComplete;
      expect(element.fullscreen).to.be.false;
      expect(element.hasAttribute('fullscreen')).to.be.false;
    } finally {
      delete globalThis.document.fullscreenElement;
    }
  });

  it('constructor overwrites any existing document handler (BUG)', async () => {
    const sentinel = () => {};
    globalThis.document.onfullscreenchange = sentinel;
    const el = await fixture(
      html`<fullscreen-behaviors></fullscreen-behaviors>`,
    );
    // BUG: fullscreen-behaviors.js:29 assigns document.onfullscreenchange
    // unconditionally, clobbering any pre-existing document-level handler;
    // multiple instances also fight over the single document handler slot
    expect(globalThis.document.onfullscreenchange === sentinel).to.be.false;
    globalThis.document.onfullscreenchange = null;
  });
});

describe('fullscreen-behaviors toggleFullscreen', () => {
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
    Object.defineProperty(globalThis.document, 'exitFullscreen', {
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

  it('requests fullscreen when mode is true and not already fullscreen', () => {
    element.toggleFullscreen(true);
    expect(requested).to.equal(1);
    expect(exited).to.equal(0);
  });

  it('exits fullscreen when mode is false', () => {
    element.toggleFullscreen(false);
    expect(exited).to.equal(1);
    expect(requested).to.equal(0);
  });

  it('defaults mode from the document fullscreen state', () => {
    // not fullscreen so the default mode is true
    element.toggleFullscreen();
    expect(requested).to.equal(1);
    expect(exited).to.equal(0);
    // already fullscreen as this element so the default mode is false
    Object.defineProperty(globalThis.document, 'fullscreenElement', {
      get: () => element,
      configurable: true,
    });
    element.toggleFullscreen();
    expect(exited).to.equal(1);
    expect(requested).to.equal(1);
  });

  it('both exits and requests when already fullscreen with mode true', () => {
    Object.defineProperty(globalThis.document, 'fullscreenElement', {
      get: () => element,
      configurable: true,
    });
    // NOTE (bug): with mode true while already fullscreen both
    // exitFullscreen() and requestFullscreen() fire; in a real browser the
    // exit transition is async so the immediate request races it
    element.toggleFullscreen(true);
    expect(exited).to.equal(1);
    expect(requested).to.equal(1);
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
