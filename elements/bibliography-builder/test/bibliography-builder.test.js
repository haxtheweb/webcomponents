import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import sinon from "sinon";
import "../bibliography-builder.js";
import { BibliographyBuilder } from "../bibliography-builder.js";

describe("BibliographyBuilder test", () => {
  let element;
  let sandbox;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    element = await fixture(html`
      <bibliography-builder title="title"></bibliography-builder>
    `);
  });

  afterEach(() => {
    sandbox.restore();
    // remove any simple-modal instances opened via simple-modal-show so
    // they do not leak between tests
    document.querySelectorAll("simple-modal").forEach((modal) => {
      modal.remove();
    });
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("defaults", () => {
    it("has sensible default property values", () => {
      expect(element.tagName.toLowerCase()).to.equal("bibliography-builder");
      expect(element.title).to.equal("title");
      expect(element.exportMode).to.equal("");
      expect(element.forCourse).to.equal("");
      expect(Array.isArray(element.citationArr)).to.be.true;
      // empty until a format is picked; the prompt is rendered from this.t
      expect(element.citationArr.length).to.equal(0);
      expect(element.t.selectCitationFormatBelow).to.equal(
        "Select a citation format below",
      );
    });

    it("has the correct static tag", () => {
      expect(BibliographyBuilder.tag).to.equal("bibliography-builder");
    });
  });

  describe("rendered structure", () => {
    it("renders the block header with the label and the title", () => {
      const header = element.shadowRoot.querySelector(".ddd-block-header");
      expect(header).to.exist;
      expect(
        header.querySelector(".ddd-block-label").textContent.trim(),
      ).to.equal("References");
      const h3 = header.querySelector("h3.ddd-block-title");
      expect(h3).to.exist;
      expect(h3.textContent.trim()).to.equal("title");
      const frame = element.shadowRoot.querySelector(".ddd-block");
      expect(frame.getAttribute("role")).to.equal("group");
      expect(frame.getAttribute("aria-labelledby")).to.equal("hdr");
    });

    it("drops the title line when it repeats the label or is empty", async () => {
      element.title = "References";
      await element.updateComplete;
      expect(element.shadowRoot.querySelector(".ddd-block-title")).to.not.exist;
      expect(element.shadowRoot.textContent).to.not.include(
        "References: References",
      );
      element.title = "";
      await element.updateComplete;
      expect(element.shadowRoot.querySelector(".ddd-block-title")).to.not.exist;
      element.title = "Week 4 readings";
      await element.updateComplete;
      expect(
        element.shadowRoot.querySelector(".ddd-block-title").textContent.trim(),
      ).to.equal("Week 4 readings");
    });

    it("renders an export button", () => {
      const button = element.shadowRoot.querySelector("#export-button");
      expect(button).to.exist;
      expect(button.tagName.toLowerCase()).to.equal("button");
      expect(button.classList.contains("ddd-block-action")).to.be.true;
      expect(button.classList.contains("has-text")).to.be.true;
      expect(button.textContent.trim()).to.equal("Export");
    });

    it("renders a default slot for citation items", () => {
      const slot = element.shadowRoot.querySelector("slot");
      expect(slot).to.exist;
    });

    it("emits OER schema markup for the learning component", () => {
      const wrapper = element.shadowRoot.querySelector(".wrapper");
      expect(wrapper.getAttribute("typeof")).to.equal("oer:LearningComponent");
      const forCourseMeta = element.shadowRoot.querySelector(
        'meta[property="oer:forCourse"]',
      );
      expect(forCourseMeta).to.exist;
      expect(forCourseMeta.getAttribute("content")).to.equal("");
    });

    it("reflects the forCourse OER schema property in content", async () => {
      element.forCourse = "course-123";
      await element.updateComplete;
      const forCourseMeta = element.shadowRoot.querySelector(
        'meta[property="oer:forCourse"]',
      );
      expect(forCourseMeta.getAttribute("content")).to.equal("course-123");
    });
  });

  describe("export modal", () => {
    it("dispatches simple-modal-show when the export button is clicked", async () => {
      const button = element.shadowRoot.querySelector("#export-button");
      const listener = oneEvent(globalThis, "simple-modal-show");
      button.click();
      const event = await listener;
      expect(event.detail.title).to.equal("Export Citations");
      expect(event.detail.elements.content).to.exist;
      expect(event.detail.elements.content.tagName.toLowerCase()).to.equal(
        "div",
      );
      // invokedBy points back at the button that was clicked
      expect(event.detail.invokedBy === button).to.be.true;
    });

    it("builds modal content with the citation list and controls", async () => {
      element._showExportModal({ target: null });
      const content = element._modalContent;
      expect(content.querySelector(".citation-list")).to.exist;
      expect(content.querySelector("#export-dropdown")).to.exist;
      expect(content.querySelector(".copy-button")).to.exist;
      const options = content.querySelectorAll("#export-dropdown option");
      const values = Array.from(options).map((o) => o.getAttribute("value"));
      expect(values.join(",")).to.equal("Export,APA,BibTeX");
    });

    it("reuses the same modal content node across invocations", async () => {
      element._showExportModal({ target: null });
      const first = element._modalContent;
      element._showExportModal({ target: null });
      expect(element._modalContent === first).to.be.true;
    });

    it("labels the export dropdown with a visible label", async () => {
      // a11y: the export format select has a visible, associated label
      element._showExportModal({ target: null });
      const select = element._modalContent.querySelector("#export-dropdown");
      const label = element._modalContent.querySelector(
        'label[for="export-dropdown"]',
      );
      expect(select).to.exist;
      expect(label).to.exist;
      expect(label.textContent.trim()).to.equal("Export citation format");
    });

    it("renders Copy as a named text button", async () => {
      element._showExportModal({ target: null });
      const copy = element._modalContent.querySelector("button.copy-button");
      expect(copy).to.exist;
      expect(copy.getAttribute("type")).to.equal("button");
      expect(copy.textContent.trim()).to.equal("Copy");
    });

    it("styles modal borders with DDD tokens instead of hardcoded black", async () => {
      // DDD dark-mode fix: hardcoded black borders were invisible on dark
      // mode modal backgrounds; the export modal now uses DDD border tokens
      element._showExportModal({ target: null });
      const style = element._modalContent.querySelector("style");
      expect(style.textContent).to.include("var(--ddd-border-xs)");
      expect(style.textContent).to.not.include("black");
    });

    it("renders each citation entry from citationArr", async () => {
      // modal content must exist before citationArr changes re-render it
      element._showExportModal({ target: null });
      element.citationArr = ["Citation One", "Citation Two"];
      await element.updateComplete;
      const entries = element._modalContent.querySelectorAll(".citation-entry");
      expect(entries.length).to.equal(2);
      expect(entries[0].textContent).to.equal("Citation One");
      expect(entries[1].textContent).to.equal("Citation Two");
    });
  });

  describe("export handler", () => {
    let container;

    beforeEach(async () => {
      container = await fixture(html`
        <bibliography-builder title="My Sources">
          <bibliography-item
            title="Web Source"
            url="https://example.com"
            publication-date="03/07/2020"
          ></bibliography-item>
          <bibliography-item
            title="Journal Source"
            citation-type="journal"
            parent-ver="5"
            child-ver="2"
            start-page="10"
            end-page="20"
            url="https://journal.example.com"
          ></bibliography-item>
        </bibliography-builder>
      `);
      // open the export modal so _modalContent exists for renderExport
      container._showExportModal({ target: null });
    });

    const changeExport = async (el, value) => {
      const select = el._modalContent.querySelector("#export-dropdown");
      select.value = value;
      select.dispatchEvent(new Event("change"));
      await el.updateComplete;
    };

    it("exports APA citations for slotted items", async () => {
      await changeExport(container, "APA");
      expect(container.exportMode).to.equal("APA");
      const entries =
        container._modalContent.querySelectorAll(".citation-entry");
      expect(entries.length).to.equal(2);
      expect(entries[0].textContent).to.include("Web Source");
      expect(entries[0].textContent).to.include("(2020, March 7)");
      expect(entries[1].textContent).to.include("Journal Source");
      expect(entries[1].textContent).to.include("10 - 20");
    });

    it("exports BibTeX citations for slotted items", async () => {
      await changeExport(container, "BibTeX");
      expect(container.exportMode).to.equal("BibTeX");
      const entries =
        container._modalContent.querySelectorAll(".citation-entry");
      expect(entries.length).to.equal(2);
      expect(entries[0].textContent).to.include("@misc{WebSource,");
      expect(entries[1].textContent).to.include("@article{JournalSource,");
      expect(entries[1].textContent).to.include("pages = {10--20}");
    });

    it("resets to the placeholder message for the Export option", async () => {
      await changeExport(container, "APA");
      await changeExport(container, "Export");
      expect(container.exportMode).to.equal("Export");
      const entries =
        container._modalContent.querySelectorAll(".citation-entry");
      expect(entries.length).to.equal(1);
      expect(entries[0].textContent).to.equal("Select a citation format below");
    });
  });

  describe("add-citation handler", () => {
    let container;
    let first;
    let second;

    beforeEach(async () => {
      container = await fixture(html`
        <bibliography-builder title="Additions">
          <bibliography-item title="First"></bibliography-item>
          <bibliography-item title="Second"></bibliography-item>
        </bibliography-builder>
      `);
      const items = container.querySelectorAll("bibliography-item");
      first = items[0];
      second = items[1];
    });

    it("inserts a new item above the dispatched node", () => {
      first.dispatchEvent(
        new CustomEvent("add-citation", {
          detail: { direction: "above", node: first },
          bubbles: true,
          composed: true,
        }),
      );
      const children = container.querySelectorAll("bibliography-item");
      expect(children.length).to.equal(3);
      expect(children[0].title).to.equal("HAX The Web");
      expect(children[1] === first).to.be.true;
      expect(children[2] === second).to.be.true;
    });

    it("inserts a new item below the dispatched node", () => {
      second.dispatchEvent(
        new CustomEvent("add-citation", {
          detail: { direction: "below", node: second },
          bubbles: true,
          composed: true,
        }),
      );
      const children = container.querySelectorAll("bibliography-item");
      expect(children.length).to.equal(3);
      expect(children[2].title).to.equal("HAX The Web");
      expect(children[0] === first).to.be.true;
      expect(children[1] === second).to.be.true;
    });

    it("appends a new item at the end when no direction is given", () => {
      container.dispatchEvent(
        new CustomEvent("add-citation", {
          detail: {},
          bubbles: true,
          composed: true,
        }),
      );
      const children = container.querySelectorAll("bibliography-item");
      expect(children.length).to.equal(3);
      expect(children[2].title).to.equal("HAX The Web");
    });

    it("tags created items with HAX layout attributes", () => {
      container.dispatchEvent(
        new CustomEvent("add-citation", {
          detail: {},
          bubbles: true,
          composed: true,
        }),
      );
      const created = container.querySelectorAll("bibliography-item")[2];
      expect(created.hasAttribute("data-hax-layout")).to.be.true;
      expect(created.getAttribute("data-hax-layout")).to.equal("true");
      expect(created.getAttribute("data-hax-ray")).to.equal(
        "bibliography-item",
      );
    });
  });

  describe("copy to clipboard", () => {
    it("writes the citation list to the clipboard", async () => {
      const writeStub = sandbox
        .stub(navigator.clipboard, "write")
        .resolves(undefined);
      element._showExportModal({ target: null });
      element._copyToClipboard();
      expect(writeStub.calledOnce).to.be.true;
      const data = writeStub.firstCall.args[0];
      expect(Array.isArray(data)).to.be.true;
      expect(data.length).to.equal(1);
      expect(data[0] instanceof globalThis.ClipboardItem).to.be.true;
    });
  });

  describe("HAX integration", () => {
    it("registers an inline context menu hook", () => {
      const hooks = element.haxHooks();
      expect(hooks.inlineContextMenu).to.equal("haxinlineContextMenu");
    });

    it("supplies the add citation context menu button", () => {
      const ceMenu = { ceButtons: [] };
      element.haxinlineContextMenu(ceMenu);
      expect(ceMenu.ceButtons.length).to.equal(1);
      expect(ceMenu.ceButtons[0].icon).to.equal("icons:add");
      expect(ceMenu.ceButtons[0].callback).to.equal("_addItemHandler");
      expect(ceMenu.ceButtons[0].label).to.equal(
        "Add citation to bibliography",
      );
    });

    it("exposes haxProperties as a lib file URL", () => {
      const url = BibliographyBuilder.haxProperties;
      expect(typeof url).to.equal("string");
      expect(url.endsWith("lib/bibliography-builder.haxProperties.json")).to.be
        .true;
    });
  });
});
