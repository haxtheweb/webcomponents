import { fixture, expect, html } from "@open-wc/testing";

import { H5PElement } from "../h5p-element.js";

// network stub: ESGlobalBridge would load the (locally served) h5p-standalone
// player bundle on connect; record the request and leave the import pending so
// the auto-setup path stays deterministic and no player script ever executes
const bridge = globalThis.ESGlobalBridge.requestAvailability();
const originalLoad = bridge.load;
const bridgeLoads = [];
bridge.load = (name, location) => {
  bridgeLoads.push({ name, location });
  return new Promise(() => {});
};
after(() => {
  bridge.load = originalLoad;
});

describe("h5p-element test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <h5p-element title="test-title"></h5p-element>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("h5p-element passes accessibility test", async () => {
    const el = await fixture(html` <h5p-element></h5p-element> `);
    await expect(el).to.be.accessible();
  });
  it("h5p-element passes accessibility negation", async () => {
    const el = await fixture(
      html`<h5p-element aria-labelledby="h5p-element"></h5p-element>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("h5p-element can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<h5p-element .foo=${'bar'}></h5p-element>`);
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
      const el = await fixture(html`<h5p-element ></h5p-element>`);
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
        const el = await fixture(html`<h5p-element></h5p-element>`);
        const width = getComputedStyle(el).width;
        expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
        const el await fixture(html`<h5p-element></h5p-element>`);
        const hidden = el.getAttribute('hidden');
        expect(hidden).to.equal(true);
    })
}) */

describe("h5p-element with a source", () => {
  let playerCalls;
  let realStandalone;
  beforeEach(() => {
    playerCalls = [];
    realStandalone = globalThis.H5PStandalone;
    globalThis.H5PStandalone = {
      H5P: class {
        constructor(container, options) {
          playerCalls.push({ container, options });
        }
      },
    };
  });
  afterEach(() => {
    if (realStandalone === undefined) {
      delete globalThis.H5PStandalone;
    } else {
      globalThis.H5PStandalone = realStandalone;
    }
  });

  it("exposes its tag and haxProperties", () => {
    expect(H5PElement.tag).to.equal("h5p-element");
    expect(H5PElement.haxProperties).to.be.a("string");
    expect(H5PElement.haxProperties).to.include(
      "lib/h5p-element.haxProperties.json",
    );
  });

  it("generates an item-style uuid for content targeting", () => {
    const el = globalThis.document.createElement("h5p-element");
    expect(el.contentId).to.match(
      /^item-[0-9a-f]{12}-[0-9a-f]{8}-[0-9a-f]{8}$/,
    );
  });

  it("renders a light dom container when a source is set", async () => {
    const el = await fixture(
      html`<h5p-element
        source="/elements/h5p-element/test/fake-content"
      ></h5p-element>`,
    );
    const container = el.querySelector(".h5p-container");
    expect(container).to.exist;
    expect(container.getAttribute("data-content-id")).to.include("wrapper-");
    expect(el.shadowRoot === null).to.be.true;
  });

  it("requests the h5p-standalone bundle through the bridge", async () => {
    const el = await fixture(html`<h5p-element></h5p-element>`);
    expect(bridgeLoads.length).to.be.greaterThan(0);
    const request = bridgeLoads[bridgeLoads.length - 1];
    expect(request.name).to.equal("h5p-standalone");
    expect(request.location).to.include(
      "node_modules/h5p-standalone/dist/main.bundle.js",
    );
  });

  it("honors an explicit h5p lib path for the standalone base", async () => {
    const el = await fixture(html`<h5p-element></h5p-element>`);
    el.h5pLibPath = "https://example.com/h5p/dist";
    expect(el.h5pStandaloneBase).to.equal("https://example.com/h5p/dist/");
    el.h5pLibPath = "https://example.com/h5p/dist/";
    expect(el.h5pStandaloneBase).to.equal("https://example.com/h5p/dist/");
  });

  it("defaults the standalone base to the co-installed package", async () => {
    const el = await fixture(html`<h5p-element></h5p-element>`);
    expect(el.h5pStandaloneBase).to.include("node_modules/h5p-standalone/dist/");
  });

  it("sets up h5p content through the player", async () => {
    const el = await fixture(
      html`<h5p-element
        source="/elements/h5p-element/test/fake-content"
      ></h5p-element>`,
    );
    const container = globalThis.document.createElement("div");
    const queries = [];
    el.querySelector = (selector) => {
      queries.push(selector);
      return container;
    };
    const result = await el.setupH5P("custom-id");
    delete el.querySelector;
    expect(result).to.be.true;
    expect(queries.length).to.equal(1);
    expect(playerCalls.length).to.equal(1);
    expect(playerCalls[0].container === container).to.be.true;
    const options = playerCalls[0].options;
    expect(options.h5pJsonPath).to.equal(
      "/elements/h5p-element/test/fake-content",
    );
    expect(options.frameJs).to.include("frame.bundle.js");
    expect(options.frameCss).to.include("styles/h5p.css");
    expect(options.id).to.equal("h5p-iframe-custom-id");
    expect(options.frame).to.be.false;
    expect(options.copyright).to.be.false;
    expect(options.embed).to.be.false;
    expect(options.download).to.be.false;
    expect(options.icon).to.be.false;
    expect(options.export).to.be.false;
  });

  it("returns false when the content container is missing", async () => {
    const el = await fixture(html`<h5p-element></h5p-element>`);
    el.querySelector = () => null;
    const result = await el.setupH5P();
    delete el.querySelector;
    expect(result).to.be.false;
    expect(playerCalls.length).to.equal(0);
  });

  it("returns false when the player has not loaded yet", async () => {
    const el = await fixture(
      html`<h5p-element
        source="/elements/h5p-element/test/fake-content"
      ></h5p-element>`,
    );
    const container = globalThis.document.createElement("div");
    el.querySelector = () => container;
    delete globalThis.H5PStandalone;
    const result = await el.setupH5P();
    delete el.querySelector;
    expect(result).to.be.false;
    expect(playerCalls.length).to.equal(0);
  });

  it("runs setup when the bridge reports the player loaded", async () => {
    const el = await fixture(
      html`<h5p-element
        source="/elements/h5p-element/test/fake-content"
      ></h5p-element>`,
    );
    const container = globalThis.document.createElement("div");
    el.querySelector = () => container;
    globalThis.dispatchEvent(
      new CustomEvent("es-bridge-h5p-standalone-loaded"),
    );
    await new Promise((resolve) => setTimeout(resolve, 50));
    delete el.querySelector;
    expect(playerCalls.length).to.be.greaterThan(0);
  });

  it("auto sets up content once the bridge import is ready", async () => {
    const previous = bridge.imports["h5p-standalone"];
    bridge.imports["h5p-standalone"] = true;
    let el;
    try {
      el = await fixture(
        html`<h5p-element
          source="/elements/h5p-element/test/fake-content"
        ></h5p-element>`,
      );
      await new Promise((resolve) => setTimeout(resolve, 50));
    } finally {
      bridge.imports["h5p-standalone"] = previous;
    }
    // the real container selector resolves the rendered light dom container
    const container = el.querySelector(".h5p-container");
    expect(container).to.exist;
    expect(
      container.getAttribute("data-content-id") ===
        "wrapper-" + el.contentId,
    ).to.be.true;
    expect(playerCalls.length).to.be.greaterThan(0);
    expect(playerCalls[playerCalls.length - 1].container === container).to.be
      .true;
  });
});
