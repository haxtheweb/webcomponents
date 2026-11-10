import { fixture, expect, html } from "@open-wc/testing";

import "../q-r.js";
import { QR } from "../q-r.js";

describe("q-r test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html` <q-r title="test-title"></q-r> `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe("q-r element", () => {
  it("registers the custom element", () => {
    expect(globalThis.customElements.get("q-r")).to.exist;
  });

  it("has the expected static tag", () => {
    expect(QR.tag).to.equal("q-r");
  });

  it("exposes haxProperties as a URL to the schema file", () => {
    const url = QR.haxProperties;
    expect(typeof url).to.equal("string");
    expect(url.endsWith("lib/q-r.haxProperties.json")).to.be.true;
  });

  it("has default property values", async () => {
    const el = await fixture(html`<q-r></q-r>`);
    expect(el.modulesize).to.equal(4);
    expect(el.margin).to.equal(2);
    expect(el.format).to.equal("png");
    expect(el.data).to.be.undefined;
    expect(el.title).to.be.undefined;
  });

  it("renders a qr-code child and a fallback link", async () => {
    const el = await fixture(
      html`<q-r data="https://haxtheweb.org" title="Scan me"></q-r>`,
    );
    await el.updateComplete;
    const code = el.shadowRoot.querySelector("qr-code");
    expect(code).to.exist;
    expect(code.getAttribute("data")).to.equal("https://haxtheweb.org");
    const link = el.shadowRoot.querySelector("#link");
    expect(link).to.exist;
    expect(link.getAttribute("href")).to.equal("https://haxtheweb.org");
    expect(link.textContent.trim()).to.equal("Scan me");
  });

  it("reflects property changes onto the qr-code child", async () => {
    const el = await fixture(html`<q-r></q-r>`);
    el.data = "tel:+18148654321";
    el.modulesize = 8;
    el.margin = 1;
    el.format = "svg";
    await el.updateComplete;
    const code = el.shadowRoot.querySelector("qr-code");
    expect(code.getAttribute("data")).to.equal("tel:+18148654321");
    expect(code.getAttribute("modulesize")).to.equal("8");
    expect(code.getAttribute("margin")).to.equal("1");
    expect(code.getAttribute("format")).to.equal("svg");
  });
});

describe("q-r figure, link and notes", () => {
  it("shows the title as a visible link under the code", async () => {
    const el = await fixture(
      html`<q-r data="https://google.com/" title="Google link"></q-r>`,
    );
    await el.updateComplete;
    const fig = el.shadowRoot.querySelector("figure.frame");
    expect(fig).to.exist;
    expect(fig.querySelector(".tile qr-code")).to.exist;
    const link = fig.querySelector("figcaption a#link");
    expect(link.getAttribute("href")).to.equal("https://google.com/");
    const r = link.getBoundingClientRect();
    expect(r.width).to.be.greaterThan(1);
    expect(r.left).to.be.greaterThan(-1);
    expect(
      link.querySelector("simple-icon-lite").getAttribute("aria-hidden"),
    ).to.equal("true");
  });

  it("names the code from the title, else the data", async () => {
    const el = await fixture(
      html`<q-r data="https://google.com/" title="Google link"></q-r>`,
    );
    await el.updateComplete;
    const code = el.shadowRoot.querySelector("qr-code");
    expect(code.getAttribute("alt")).to.equal("QR code for Google link");
    el.title = "";
    await el.updateComplete;
    expect(code.getAttribute("alt")).to.equal(
      "QR code for https://google.com/",
    );
    expect(el.shadowRoot.querySelector("figcaption")).to.not.exist;
  });

  it("shows a muted note instead of a code without data", async () => {
    const el = await fixture(html`<q-r title="Nothing"></q-r>`);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("qr-code")).to.not.exist;
    const note = el.shadowRoot.querySelector(".note");
    expect(note.textContent.trim()).to.equal(el.t.noData);
  });

  it("shows a note for formats qr-code can't draw", async () => {
    const el = await fixture(html`<q-r data="hello" format="bmp"></q-r>`);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("qr-code")).to.not.exist;
    expect(el.shadowRoot.querySelector(".note").textContent).to.include("bmp");
  });

  it("shows a note when the code can't be drawn", async () => {
    const el = await fixture(html`<q-r data="hello"></q-r>`);
    await el.updateComplete;
    const code = el.shadowRoot.querySelector("qr-code");
    code.dispatchEvent(
      new CustomEvent("qr-code-error", { detail: { reason: "canvas" } }),
    );
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".note").textContent.trim()).to.equal(
      el.t.noCanvas,
    );
    // new data tries again
    el.data = "hello again";
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("qr-code")).to.exist;
  });

  it("never links script urls", async () => {
    const el = await fixture(
      html`<q-r data="javascript:alert(1)" title="Bad"></q-r>`,
    );
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("a")).to.not.exist;
    expect(el.shadowRoot.querySelector("#link").textContent).to.equal("Bad");
  });

  it("passes the a11y audit with a code and a link", async () => {
    const el = await fixture(
      html`<q-r data="https://google.com/" title="Google link"></q-r>`,
    );
    await el.updateComplete;
    await expect(el).shadowDom.to.be.accessible();
  });
});

describe("q-r full integration", () => {
  it("renders a generated svg through the bridge-loaded library", async () => {
    const el = await fixture(
      html`<q-r
        data="https://haxtheweb.org"
        title="Open HAX"
        format="svg"
      ></q-r>`,
    );
    // wait for the inner qr-code element to be created
    let code = el.shadowRoot.querySelector("qr-code");
    for (let i = 0; i < 100 && code === null; i++) {
      await new Promise((resolve) => setTimeout(resolve, 25));
      code = el.shadowRoot.querySelector("qr-code");
    }
    expect(code).to.exist;
    // wait for the es-global-bridge to load the qr library
    const bridge = globalThis.ESGlobalBridge.requestAvailability();
    for (let i = 0; i < 100 && bridge.imports["qr"] !== true; i++) {
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
    expect(bridge.imports["qr"]).to.equal(true);
    // the one-time loaded event may have fired before this element existed,
    // so force a regeneration through a property change
    el.data = "https://haxtheweb.org/webcomponents";
    await el.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 25));
    expect(code.shadowRoot.querySelector("svg")).to.exist;
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("q-r passes accessibility test", async () => {
    const el = await fixture(html` <q-r></q-r> `);
    await expect(el).to.be.accessible();
  });
  it("q-r passes accessibility negation", async () => {
    const el = await fixture(html`<q-r aria-labelledby="q-r"></q-r>`);
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("q-r can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<q-r .foo=${'bar'}></q-r>`);
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
      const el = await fixture(html`<q-r ></q-r>`);
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
      const el = await fixture(html`<q-r></q-r>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<q-r></q-r>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
