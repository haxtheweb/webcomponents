import { fixture, expect, html } from "@open-wc/testing";
import "../course-design.js";

// Import the lib components that course-design houses. These are lightweight
// (no haxcms-site-store dependency) so they can be top-level imports.
import "../lib/activity-box.js";
import "../lib/block-quote.js";
import "../lib/learning-component.js";
import "../lib/ebook-button.js";

describe("course-design test", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`
      <course-design>
        <h1>Course Content</h1>
      </course-design>
    `);
  });

  describe("Basic Setup and Accessibility", () => {
    it("renders with correct tag name", () => {
      expect(element.tagName.toLowerCase()).to.equal("course-design");
    });

    it("passes the a11y audit", async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it("passes a11y audit with complex content", async () => {
      const el = await fixture(html`
        <course-design>
          <h1>Course Title</h1>
          <p>Course description content</p>
          <section>
            <h2>Learning Objectives</h2>
            <ul>
              <li>Objective 1</li>
              <li>Objective 2</li>
            </ul>
          </section>
        </course-design>
      `);
      await expect(el).shadowDom.to.be.accessible();
      await expect(el).to.be.accessible();
    });

    it("passes a11y audit when empty", async () => {
      const el = await fixture(html`<course-design></course-design>`);
      await expect(el).shadowDom.to.be.accessible();
    });

    it("passes a11y audit when hidden", async () => {
      const el = await fixture(html`<course-design hidden></course-design>`);
      await expect(el).shadowDom.to.be.accessible();
    });
  });

  describe("Container structure", () => {
    it("has minimal shadow DOM with slot", () => {
      const slot = element.shadowRoot.querySelector("slot");
      expect(slot).to.exist;
    });

    it("applies base styling", () => {
      expect(getComputedStyle(element).display).to.equal("block");
    });

    it("hides when hidden attribute is present", async () => {
      element.setAttribute("hidden", "");
      await element.updateComplete;
      expect(getComputedStyle(element).display).to.equal("none");
    });

    it("contains slotted content", () => {
      const h1 = element.querySelector("h1");
      expect(h1).to.exist;
      expect(h1.textContent).to.equal("Course Content");
    });
  });

  describe("Educational Component Integration", () => {
    it("hosts learning-component elements", async () => {
      const el = await fixture(html`
        <course-design>
          <learning-component title="Learning Objective" type="read">
            <p>Read this content carefully.</p>
          </learning-component>
        </course-design>
      `);

      const learningComponent = el.querySelector("learning-component");
      expect(learningComponent).to.exist;
      expect(learningComponent.getAttribute("type")).to.equal("read");
      expect(learningComponent.getAttribute("title")).to.equal(
        "Learning Objective",
      );
    });

    it("hosts activity-box elements", async () => {
      const el = await fixture(html`
        <course-design>
          <activity-box icon="settings">
            Complete this activity
          </activity-box>
        </course-design>
      `);

      const activityBox = el.querySelector("activity-box");
      expect(activityBox).to.exist;
      expect(activityBox.getAttribute("icon")).to.equal("settings");
    });

    it("hosts block-quote elements", async () => {
      const el = await fixture(html`
        <course-design>
          <block-quote citation="Albert Einstein">
            <span slot="quote"
              >Imagination is more important than knowledge.</span
            >
          </block-quote>
        </course-design>
      `);

      const blockQuote = el.querySelector("block-quote");
      expect(blockQuote).to.exist;
      expect(blockQuote.getAttribute("citation")).to.equal("Albert Einstein");
    });

    it("hosts ebook-button elements", async () => {
      const el = await fixture(html`
        <course-design>
          <ebook-button
            title="Download Resource"
            link="https://example.com/resource.pdf"
          >
          </ebook-button>
        </course-design>
      `);

      const ebookButton = el.querySelector("ebook-button");
      expect(ebookButton).to.exist;
      expect(ebookButton.getAttribute("title")).to.equal("Download Resource");
    });

    it("supports multiple component types together", async () => {
      const el = await fixture(html`
        <course-design>
          <learning-component title="Objective" type="knowledge">
            <p>Learn about the topic</p>
          </learning-component>
          <activity-box icon="assignment"> Practice exercise </activity-box>
          <block-quote citation="Expert">
            <span slot="quote">Important insight</span>
          </block-quote>
        </course-design>
      `);

      expect(el.querySelector("learning-component")).to.exist;
      expect(el.querySelector("activity-box")).to.exist;
      expect(el.querySelector("block-quote")).to.exist;

      await expect(el).to.be.accessible();
    });
  });

  describe("HAX configuration", () => {
    it("has haxProperties defined", () => {
      expect(element.constructor.haxProperties).to.exist;
      expect(element.constructor.haxProperties.gizmo).to.exist;
      expect(element.constructor.haxProperties.settings).to.exist;
    });

    it("has correct tag name", () => {
      expect(element.constructor.tag).to.equal("course-design");
    });
  });
});
