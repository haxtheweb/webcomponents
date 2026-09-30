import { fixture, expect, html } from "@open-wc/testing";

import "../img-view-modal.js";

describe("img-view-modal test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <img-view-modal title="test-title"></img-view-modal>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe("img-view-modal modalOpen", () => {
  // a toolbars object is required: modalOpen copies it onto the created
  // img-view-viewer, whose render otherwise dereferences an unset toolbars
  // (see the BUG note in test/img-view-viewer.test.js)
  const TOOLBARS = {
    bottom: { id: "bottom", type: "toolbar-group", contents: [] },
  };
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <img-view-modal
        title="test-title"
        .toolbars=${TOOLBARS}
        .figures=${[{ src: "figure.png" }]}
      ></img-view-modal>
    `);
  });

  it("opens the modal with a configured viewer on click", async () => {
    const shown = [];
    const clicked = [];
    element.addEventListener("simple-modal-show", (e) => shown.push(e.detail));
    element.addEventListener("modal-button-click", (e) =>
      clicked.push(e.detail),
    );
    element.page = 1;
    element.describedBy = "desc-1";
    element.click();
    expect(clicked.length).to.equal(1);
    expect(clicked[0] === element).to.be.true;
    expect(shown.length).to.equal(1);
    const detail = shown[0];
    expect(detail.title).to.equal("test-title");
    expect(detail.clone).to.equal(false);
    expect(detail.invokedBy === element).to.be.true;
    const viewer = detail.elements.content;
    expect(viewer.tagName.toLowerCase()).to.equal("img-view-viewer");
    // truthy properties are copied onto the created viewer
    expect(viewer.figures).to.deep.equal([{ src: "figure.png" }]);
    expect(viewer.page).to.equal(1);
    expect(viewer.describedBy).to.equal("desc-1");
    expect(viewer.toolbars).to.deep.equal(TOOLBARS);
    // the detached viewer must not receive the delayed bridge loaded event
    viewer.windowControllers.abort();
    // inline viewer styles are applied
    expect(viewer.style.getPropertyValue("--img-view-viewer-height")).to.equal(
      "calc(var(--simple-modal-height) - var(--simple-modal-titlebar-height))",
    );
    expect(viewer.style.getPropertyValue("--img-view-viewer-color").trim()).to
      .equal("black");
    expect(viewer.style.getPropertyValue("--img-view-viewer-borderColor").trim())
      .to.equal("#ddd");
    expect(
      viewer.style.getPropertyValue("--img-view-viewer-toggled-backgroundColor")
        .trim(),
    ).to.equal("#eee");
    // modal styles read from the host css variables
    expect(detail.styles["--simple-modal-titlebar-height"].trim()).to.equal(
      "40px",
    );
  });

  it("falls back to white for the viewer background color (css var typo)", async () => {
    element.style.setProperty("--img-view-modal-backgroundColor", "purple");
    const shown = [];
    element.addEventListener("simple-modal-show", (e) => shown.push(e.detail));
    element.click();
    const viewer = shown[0].elements.content;
    viewer.windowControllers.abort();
    // BUG: modalOpen reads the css var "i--mg-view-viewer-backgroundColor"
    // (a typo for --img-view-viewer-backgroundColor), so the host's
    // --img-view-modal-backgroundColor can never reach the viewer; every
    // viewer falls back to the hardcoded "white"
    expect(
      viewer.style.getPropertyValue("--img-view-viewer-backgroundColor").trim(),
    ).to.equal("white");
  });

  it("does not open the modal when disabled", async () => {
    element.disabled = true;
    await element.updateComplete;
    let shown = 0;
    let clicked = 0;
    element.addEventListener("simple-modal-show", () => shown++);
    element.addEventListener("modal-button-click", () => clicked++);
    element.click();
    expect(shown).to.equal(0);
    expect(clicked).to.equal(0);
  });

  it("defaults the modal title to false when unset", async () => {
    const el = await fixture(
      html` <img-view-modal .toolbars=${TOOLBARS}></img-view-modal> `,
    );
    const shown = [];
    el.addEventListener("simple-modal-show", (e) => shown.push(e.detail));
    el.click();
    expect(shown.length).to.equal(1);
    expect(shown[0].title).to.equal(false);
    shown[0].elements.content.windowControllers.abort();
  });

  it("_getCssVar reads computed custom properties", () => {
    const value = element._getCssVar("--img-view-viewer-color");
    expect(typeof value).to.equal("string");
    expect(value.trim()).to.equal("black");
    expect(element._getCssVar("--not-a-real-var")).to.equal("");
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("img-view-modal passes accessibility test", async () => {
    const el = await fixture(html` <img-view-modal></img-view-modal> `);
    await expect(el).to.be.accessible();
  });
  it("img-view-modal passes accessibility negation", async () => {
    const el = await fixture(
      html`<img-view-modal aria-labelledby="img-view-modal"></img-view-modal>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("img-view-modal can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<img-view-modal .foo=${'bar'}></img-view-modal>`);
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
      const el = await fixture(html`<img-view-modal ></img-view-modal>`);
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
      const el = await fixture(html`<img-view-modal></img-view-modal>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<img-view-modal></img-view-modal>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
