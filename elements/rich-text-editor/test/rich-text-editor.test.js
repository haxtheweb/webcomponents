import { fixture, expect, html } from "@open-wc/testing";

import "../rich-text-editor.js";
import { sleep, makeToolbar } from "./helpers.js";

describe("rich-text-editor test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <rich-text-editor>
        <p>
          I'm the <a href="#top">easiest</a> way to implement editable rich
          text.
        </p>
      </rich-text-editor>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe("rich-text-editor behavior", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <rich-text-editor>
        <p id="first">hello world</p>
      </rich-text-editor>
    `);
  });

  afterEach(async () => {
    globalThis.getSelection().removeAllRanges();
    await sleep(0);
  });

  it("has default state", () => {
    expect(element.placeholder).to.equal("Click to edit");
    expect(element.type).to.equal("rich-text-editor-toolbar");
    expect(element.toolbarId).to.equal("");
    expect(element.id).to.equal("");
    expect(element.disabled).to.equal(false);
    // viewSource is not initialized in the constructor, so it is undefined
    expect(!element.viewSource).to.equal(true);
    expect(element.editing).to.equal(false);
    expect(element.getAttribute("tabindex")).to.equal("0");
  });

  it("tracks hover and focus on the container", async () => {
    const container = element.shadowRoot.querySelector("#container");
    expect(element.__hovered).to.equal(false);
    container.dispatchEvent(new Event("mouseover"));
    expect(element.__hovered).to.equal(true);
    container.dispatchEvent(new Event("mouseout"));
    expect(element.__hovered).to.equal(false);
    container.dispatchEvent(new Event("focus"));
    expect(element.__focused).to.equal(true);
    container.dispatchEvent(new Event("blur"));
    expect(element.__focused).to.equal(false);
  });

  it("editable follows the contenteditable attribute", () => {
    expect(element.editable).to.equal(false);
    element.contenteditable = "true";
    expect(element.editable).to.equal(true);
    element.contenteditable = "false";
    expect(element.editable).to.equal(false);
  });

  it("isEmpty detects empty and whitespace-only content", () => {
    expect(element.isEmpty).to.equal(false);
    const saved = element.innerHTML;
    element.innerHTML = "";
    expect(element.isEmpty).to.equal(true);
    element.innerHTML = "   \n\t ";
    expect(element.isEmpty).to.equal(true);
    element.innerHTML = "<!-- comment only -->  ";
    expect(element.isEmpty).to.equal(true);
    element.innerHTML = "<p>x</p>";
    expect(element.isEmpty).to.equal(false);
    element.innerHTML = saved;
  });

  it("firstUpdated seeds innerHTML from rawhtml when empty", async () => {
    const el = await fixture(
      html`<rich-text-editor rawhtml="<p>from rawhtml</p>"></rich-text-editor>`,
    );
    expect(el.innerHTML.trim()).to.equal("<p>from rawhtml</p>");
  });

  it("updated applies rawhtml changes", async () => {
    element.rawhtml = "<p>updated html</p>";
    await sleep(0);
    expect(element.innerHTML.trim()).to.equal("<p>updated html</p>");
  });

  it("updated clears innerHTML when empty", async () => {
    element.innerHTML = "";
    element.rawhtml = "";
    await sleep(0);
    expect(element.innerHTML).to.equal("");
  });

  it("focus enables editing and fires a focus event", async () => {
    const events = [];
    element.addEventListener("focus", (e) => events.push(e.detail));
    element.focus();
    expect(element.editable).to.equal(true);
    expect(element.__focused).to.equal(true);
    // the native focus event also fires, so at least one event carries the
    // first child element as its detail
    expect(events.some((detail) => detail === element.querySelector("*"))).to.equal(
      true,
    );
  });

  it("focus on a disabled editor does not enable editing", async () => {
    const events = [];
    element.addEventListener("focus", (e) => events.push(true));
    element.disabled = true;
    element.contenteditable = "false";
    element.focus();
    expect(element.editable).to.equal(false);
    // the focus event still fires
    expect(events.length >= 1).to.equal(true);
  });

  it("makeSticky toggles the heightmax class", () => {
    element.makeSticky(false);
    expect(element.classList.contains("heightmax")).to.equal(true);
    element.makeSticky(true);
    expect(element.classList.contains("heightmax")).to.equal(false);
  });

  it("contenteditable changes fire contenteditable-change", async () => {
    const events = [];
    element.addEventListener("contenteditable-change", (e) =>
      events.push(e.detail),
    );
    element.contenteditable = "true";
    await sleep(0);
    expect(events.length).to.equal(1);
    expect(events[0] === element).to.equal(true);
  });

  it("clicking wires up a registered toolbar", async () => {
    const toolbar = await makeToolbar();
    element.disabled = false;
    element.dispatchEvent(
      new MouseEvent("click", { bubbles: true, composed: true }),
    );
    expect(element.__toolbar === toolbar).to.equal(true);
    expect(toolbar.target === element).to.equal(true);
    expect(element.getAttribute("role")).to.equal("textbox");
    expect(element.getAttribute("contenteditable")).to.equal("true");
    toolbar.unsetTarget(element);
  });

  it("clicking prefers the toolbar matching toolbarId", async () => {
    const toolbar = await makeToolbar();
    const other = await makeToolbar();
    element.toolbarId = other.id;
    element.dispatchEvent(
      new MouseEvent("click", { bubbles: true, composed: true }),
    );
    expect(element.__toolbar === other).to.equal(true);
    expect(element.__toolbar === toolbar).to.equal(false);
    other.unsetTarget(element);
  });

  it("BUG: clicking falls back to the first toolbar regardless of type", async () => {
    // BUG (rich-text-editor.js:384-386): _handleClick filters toolbars by
    // toolbar.type === this.type but rich-text-editor toolbars do not expose
    // a `type` property, so the type filter never matches and the first
    // registered toolbar is always selected
    const mini = await makeToolbar("rich-text-editor-toolbar-mini");
    const full = await makeToolbar("rich-text-editor-toolbar-full");
    element.type = "rich-text-editor-toolbar-full";
    // capture the first registered toolbar before the click: wiring the
    // toolbar repositions it, which reorders the global registry
    const firstRegistered = globalThis.RichTextEditorToolbars[0];
    element.dispatchEvent(
      new MouseEvent("click", { bubbles: true, composed: true }),
    );
    // the type filter never matches, so the first registered toolbar wins
    expect(element.__toolbar === firstRegistered).to.equal(true);
    expect(element.__toolbar === full).to.equal(false);
    expect(element.__toolbar === mini).to.equal(false);
    if (element.__toolbar && element.__toolbar.target) {
      element.__toolbar.unsetTarget(element.__toolbar.target);
    }
  });

  it("clicking a disabled editor does nothing", async () => {
    await makeToolbar();
    element.disabled = true;
    element.dispatchEvent(
      new MouseEvent("click", { bubbles: true, composed: true }),
    );
    expect(element.__toolbar === undefined).to.equal(true);
  });

  it("clicking while already editable does not rewire", async () => {
    const toolbar = await makeToolbar();
    element.contenteditable = "true";
    element.dispatchEvent(
      new MouseEvent("click", { bubbles: true, composed: true }),
    );
    expect(element.__toolbar === undefined).to.equal(true);
    if (toolbar.target) {
      toolbar.unsetTarget(toolbar.target);
    }
  });
});

describe("rich-text-editor toolbar creation", () => {
  it("creates a toolbar when none are registered", async () => {
    const saved = globalThis.RichTextEditorToolbars
    globalThis.RichTextEditorToolbars = []
    const element = await fixture(
      html`<rich-text-editor>
        <p id="first">hello world</p>
      </rich-text-editor>`,
    );
    element.dispatchEvent(
      new MouseEvent("click", { bubbles: true, composed: true }),
    );
    const created = element.__toolbar
    expect(created === undefined).to.equal(false)
    expect(created.tagName.toLowerCase()).to.equal("rich-text-editor-toolbar")
    globalThis.RichTextEditorToolbars = saved
    // clean up: park the created toolbar without a target
    if (created && created.target) {
      created.unsetTarget(created.target)
    }
    if (created) {
      created.remove()
    }
  })
})

/* eslint-disable */
/*
describe("A11y/chai axe tests", () => {
  it("rich-text-editor passes accessibility test", async () => {
    const el = await fixture(html` <rich-text-editor></rich-text-editor> `);
    await expect(el).to.be.accessible();
  });
  it("rich-text-editor passes accessibility negation", async () => {
    const el = await fixture(
      html`<rich-text-editor
        aria-labelledby="rich-text-editor"
      ></rich-text-editor>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("rich-text-editor can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<rich-text-editor .foo=${'bar'}></rich-text-editor>`);
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
        const el = await fixture(html`<rich-text-editor ></rich-text-editor>`);
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
        const el = await fixture(html`<rich-text-editor></rich-text-editor>`);
        const width = getComputedStyle(el).width;
        expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
        const el await fixture(html`<rich-text-editor></rich-text-editor>`);
        const hidden = el.getAttribute('hidden');
        expect(hidden).to.equal(true);
    })
}) */
