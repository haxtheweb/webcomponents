import { html, fixture, expect } from '@open-wc/testing';
import "../warp-glitch.js";

describe("LangkahBertahap test", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`
      <langkah-bertahap>
        <div slot="content-1">Content 1</div>
        <div slot="content-2">Content 2</div>
        <div slot="content-3">Content 3</div>
      </langkah-bertahap>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
    expect(element.visibleContent).to.equal(1);
    expect(element.showButtons).to.be.true;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("advances visible content when main button is clicked", async () => {
    const mainBtn = element.shadowRoot.querySelector(".btn-main");
    expect(mainBtn).to.exist;

    mainBtn.click();
    await element.updateComplete;

    expect(element.visibleContent).to.equal(2);
  });

  it("shows all content and hides buttons when show all is clicked", async () => {
    const showAllBtn = element.shadowRoot.querySelector(".dropdown-item");
    expect(showAllBtn).to.exist;

    showAllBtn.click();
    await element.updateComplete;

    expect(element.visibleContent).to.equal(element.labels.length);
    expect(element.showButtons).to.be.false;
    expect(element.shadowRoot.querySelector(".btn-group")).to.not.exist;
  });

  it("supports legacy warp-glitch alias", async () => {
    const legacyEl = await fixture(html`
      <warp-glitch>
        <div slot="content-1">Step 1</div>
        <div slot="content-2">Step 2</div>
      </warp-glitch>
    `);
    expect(legacyEl).to.exist;
    expect(legacyEl.constructor.tag).to.equal("warp-glitch");
    await expect(legacyEl).shadowDom.to.be.accessible();
  });

  it("supports alias split-pause custom element", async () => {
    const splitPauseEl = await fixture(html`
      <split-pause>
        <div slot="content-1">Step 1</div>
        <div slot="content-2">Step 2</div>
      </split-pause>
    `);
    expect(splitPauseEl).to.exist;
    await expect(splitPauseEl).shadowDom.to.be.accessible();
  });

  describe("HAX editor adoption", () => {
    let store;
    let applied;
    let rehydrated;

    beforeEach(() => {
      applied = [];
      rehydrated = [];
      store = {
        editMode: true,
        activeNode: null,
        activeHaxBody: {
          _validElementTest: () => true,
          __applyNodeEditableStateWhenReady: (node, status) => {
            applied.push({ node, status });
            return Promise.resolve();
          },
          __rehydrateLayoutDescendants: (node, status) => {
            rehydrated.push({ node, status });
            return Promise.resolve();
          },
        },
      };
      globalThis.HaxStore = { instance: store };
    });

    afterEach(() => {
      delete globalThis.HaxStore;
    });

    it("registers a paragraph added by the step tools", async () => {
      element._addParagraph(1);
      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));

      const paragraphs = element.querySelectorAll('p[slot="content-1"]');
      const added = paragraphs[paragraphs.length - 1];
      expect(added).to.exist;
      expect(applied.map((entry) => entry.node)).to.include(added);
      expect(applied.every((entry) => entry.status)).to.be.true;
      expect(store.activeNode).to.equal(added);
    });

    it("registers blocks created for a new step", async () => {
      element._addStepAfter(1);
      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));

      const added = element.querySelector('p[slot="content-2"]');
      expect(added).to.exist;
      expect(applied.map((entry) => entry.node)).to.include(added);
      expect(store.activeNode).to.equal(added);
    });

    it("registers cloned blocks from a duplicated step", async () => {
      element._duplicateStep(1);
      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));

      // the original step 2 shifts to 3, so slot 2 now holds the clones
      const clones = element.querySelectorAll('div[slot="content-2"]');
      expect(clones.length).to.be.greaterThan(0);
      expect(applied.map((entry) => entry.node)).to.include(
        clones[clones.length - 1],
      );
      expect(rehydrated.length).to.be.greaterThan(0);
    });

    it("leaves the store alone when edit mode is off", async () => {
      store.editMode = false;
      element._addParagraph(1);
      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(applied.length).to.equal(0);
      expect(rehydrated.length).to.equal(0);
      expect(store.activeNode).to.be.null;
    });

    it("still adds blocks when no HAX store is present", async () => {
      delete globalThis.HaxStore;
      element._addParagraph(1);
      await element.updateComplete;

      const paragraphs = element.querySelectorAll('p[slot="content-1"]');
      expect(paragraphs.length).to.equal(1);
    });
  });
});
