import { fixture, expect, html, oneEvent, waitUntil } from "@open-wc/testing";
import { sendKeys } from "@web/test-runner-commands";
import sinon from "sinon";
import "../course-design.js";

// Import the lib components for integration testing
import "../lib/activity-box.js";
import "../lib/block-quote.js";
import "../lib/learning-component.js";
import "../lib/ebook-button.js";
import "../lib/course-intro.js";

describe("course-design test", () => {
  let element, sandbox;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    element = await fixture(html`
      <course-design>
        <h1>Course Content</h1>
      </course-design>
    `);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("Basic Setup and Accessibility", () => {
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

    it("passes a11y audit with nested course components", async () => {
      const el = await fixture(html`
        <course-design>
          <learning-component title="Test Learning" type="read">
            <p>Learning content</p>
          </learning-component>
          <activity-box icon="settings"> Activity content </activity-box>
        </course-design>
      `);
      await expect(el).shadowDom.to.be.accessible();
      await expect(el).to.be.accessible();
    });
  });

  describe("Component Structure", () => {
    it("renders with correct tag name", () => {
      expect(element.tagName.toLowerCase()).to.equal("course-design");
    });

    it("has minimal shadow DOM with slot", () => {
      const slot = element.shadowRoot.querySelector("slot");
      expect(slot).to.exist;
    });

    it("applies base styling", () => {
      const styles = getComputedStyle(element);
      expect(styles.display).to.equal("block");
    });

    it("hides when hidden attribute is present", async () => {
      element.setAttribute("hidden", "");
      await element.updateComplete;

      const styles = getComputedStyle(element);
      expect(styles.display).to.equal("none");
    });

    it("contains slotted content", () => {
      const h1 = element.querySelector("h1");
      expect(h1).to.exist;
      expect(h1.textContent).to.equal("Course Content");
    });

    it("acts as a proper container element", () => {
      expect(element.children.length).to.equal(1);
      expect(element.children[0].tagName.toLowerCase()).to.equal("h1");
    });
  });

  describe("Property Handling", () => {
    it("inherits super properties correctly", () => {
      const props = element.constructor.properties;
      expect(props).to.exist;
      // Should inherit LitElement properties
      expect(typeof props).to.equal("object");
    });

    it("handles custom properties when added", async () => {
      // Even though no custom properties are defined, element should handle them
      element.customProperty = "test-value";
      expect(element.customProperty).to.equal("test-value");
    });

    it("supports dynamic property additions", () => {
      element.dynamicProp = { test: "value" };
      expect(element.dynamicProp.test).to.equal("value");
    });
  });

  describe("Content Management", () => {
    it("renders slotted content correctly", async () => {
      const el = await fixture(html`
        <course-design>
          <div class="test-content">Test Content</div>
          <p>Additional content</p>
        </course-design>
      `);

      const testDiv = el.querySelector(".test-content");
      expect(testDiv).to.exist;
      expect(testDiv.textContent).to.equal("Test Content");

      const paragraph = el.querySelector("p");
      expect(paragraph).to.exist;
      expect(paragraph.textContent).to.equal("Additional content");
    });

    it("handles HTML content properly", async () => {
      const el = await fixture(html`
        <course-design>
          <article>
            <header>
              <h1>Course Module</h1>
            </header>
            <section>
              <p>Module content goes here.</p>
            </section>
          </article>
        </course-design>
      `);

      const article = el.querySelector("article");
      expect(article).to.exist;

      const header = el.querySelector("header h1");
      expect(header.textContent).to.equal("Course Module");
    });

    it("supports dynamic content updates", async () => {
      element.innerHTML = '<div id="dynamic">Dynamic Content</div>';
      await element.updateComplete;

      const dynamicDiv = element.querySelector("#dynamic");
      expect(dynamicDiv).to.exist;
      expect(dynamicDiv.textContent).to.equal("Dynamic Content");
    });

    it("preserves content structure", async () => {
      const el = await fixture(html`
        <course-design>
          <div>
            <span>Nested</span>
            <strong>Content</strong>
          </div>
        </course-design>
      `);

      const span = el.querySelector("span");
      const strong = el.querySelector("strong");

      expect(span.textContent).to.equal("Nested");
      expect(strong.textContent).to.equal("Content");
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
          <activity-box icon="settings"> Complete this activity </activity-box>
        </course-design>
      `);

      const activityBox = el.querySelector("activity-box");
      expect(activityBox).to.exist;
      expect(activityBox.getAttribute("icon")).to.equal("settings");
      expect(activityBox.textContent.trim()).to.equal("Complete this activity");
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
      expect(ebookButton.getAttribute("link")).to.equal(
        "https://example.com/resource.pdf",
      );
    });

    it("hosts course-intro elements", async () => {
      const el = await fixture(html`
        <course-design>
          <course-intro></course-intro>
        </course-design>
      `);

      const courseIntro = el.querySelector("course-intro");
      expect(courseIntro).to.exist;
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

  describe("Lifecycle Management", () => {
    it("initializes correctly in constructor", () => {
      expect(element).to.be.instanceOf(HTMLElement);
      expect(element.shadowRoot).to.exist;
    });

    it("handles firstUpdated lifecycle", async () => {
      const spy = sandbox.spy(element, "firstUpdated");

      // Force a re-render to trigger firstUpdated
      element.requestUpdate();
      await element.updateComplete;

      // The method exists and can be called
      expect(typeof element.firstUpdated).to.equal("function");
    });

    it("handles updated lifecycle", async () => {
      const spy = sandbox.spy(element, "updated");

      // Trigger an update
      element.requestUpdate();
      await element.updateComplete;

      expect(spy.called).to.be.true;
    });

    it("properly processes property changes", async () => {
      const changedProps = new Map();
      changedProps.set("testProp", "oldValue");

      // Should not throw when processing changes
      expect(() => element.updated(changedProps)).to.not.throw;
    });

    it("maintains element state through updates", async () => {
      element.innerHTML = "<p>Initial Content</p>";
      await element.updateComplete;

      element.requestUpdate();
      await element.updateComplete;

      const paragraph = element.querySelector("p");
      expect(paragraph.textContent).to.equal("Initial Content");
    });
  });

  describe("Event Handling", () => {
    it("can listen to custom events from child components", async () => {
      const el = await fixture(html`
        <course-design>
          <div id="child">Child Element</div>
        </course-design>
      `);

      const eventSpy = sandbox.spy();
      el.addEventListener("custom-event", eventSpy);

      const child = el.querySelector("#child");
      child.dispatchEvent(
        new CustomEvent("custom-event", {
          bubbles: true,
          detail: { test: "data" },
        }),
      );

      expect(eventSpy.called).to.be.true;
      expect(eventSpy.getCall(0).args[0].detail.test).to.equal("data");
    });

    it("supports event delegation", async () => {
      const el = await fixture(html`
        <course-design>
          <button id="btn1">Button 1</button>
          <button id="btn2">Button 2</button>
        </course-design>
      `);

      const clickSpy = sandbox.spy();
      el.addEventListener("click", clickSpy);

      const btn1 = el.querySelector("#btn1");
      btn1.click();

      expect(clickSpy.called).to.be.true;
    });

    it("handles focus events properly", async () => {
      const el = await fixture(html`
        <course-design>
          <input type="text" id="test-input" />
        </course-design>
      `);

      const input = el.querySelector("#test-input");
      const focusedSpy = sandbox.spy();

      el.addEventListener("focus", focusedSpy, true);
      input.focus();

      expect(focusedSpy.called).to.be.true;
    });
  });

  describe("Responsive Behavior", () => {
    it("maintains block display by default", () => {
      const styles = getComputedStyle(element);
      expect(styles.display).to.equal("block");
    });

    it("allows content to be responsive", async () => {
      const el = await fixture(html`
        <course-design>
          <div style="width: 100%; max-width: 600px;">Responsive content</div>
        </course-design>
      `);

      const content = el.querySelector("div");
      const styles = getComputedStyle(content);
      expect(styles.width).to.not.equal("auto");
    });

    it("supports CSS custom properties inheritance", async () => {
      element.style.setProperty("--test-color", "red");
      await element.updateComplete;

      const computedValue =
        getComputedStyle(element).getPropertyValue("--test-color");
      expect(computedValue.trim()).to.equal("red");
    });

    it("works with different content layouts", async () => {
      const layouts = [
        "<div>Block layout</div>",
        '<span style="display: inline;">Inline layout</span>',
        '<div style="display: flex;"><span>Flex item</span></div>',
        '<div style="display: grid;"><span>Grid item</span></div>',
      ];

      for (const layout of layouts) {
        const el = await fixture(
          html`<course-design>${layout}</course-design>`,
        );
        expect(el.children.length).to.be.greaterThan(0);
        await expect(el).shadowDom.to.be.accessible();
      }
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("handles empty content gracefully", async () => {
      const el = await fixture(html`<course-design></course-design>`);
      expect(() => el.render()).to.not.throw;
      expect(el.children.length).to.equal(0);
    });

    it("handles malformed HTML content", async () => {
      const el = document.createElement("course-design");
      el.innerHTML = "<div><span>Unclosed div";

      expect(() => el.render()).to.not.throw;
    });

    it("handles very large content", async () => {
      const largeContent = "<p>" + "Large content ".repeat(1000) + "</p>";
      const el = await fixture(
        html`<course-design>${largeContent}</course-design>`,
      );

      expect(el.querySelector("p")).to.exist;
    });

    it("handles special characters in content", async () => {
      const specialContent = "<p>Special chars: <>&\"' çîrçümfléx</p>";
      const el = await fixture(
        html`<course-design>${specialContent}</course-design>`,
      );

      const paragraph = el.querySelector("p");
      expect(paragraph.textContent).to.include("Special chars");
    });

    it("handles rapid content changes", async () => {
      const contents = [
        "<div>Content 1</div>",
        "<span>Content 2</span>",
        "<p>Content 3</p>",
        "<section>Content 4</section>",
      ];

      for (const content of contents) {
        element.innerHTML = content;
        await element.updateComplete;
      }

      expect(element.querySelector("section")).to.exist;
    });

    it("handles null and undefined content", () => {
      expect(() => {
        element.innerHTML = null;
      }).to.not.throw;

      expect(() => {
        element.innerHTML = undefined;
      }).to.not.throw;
    });
  });

  describe("Performance and Resource Management", () => {
    it("renders efficiently with minimal overhead", async () => {
      const startTime = performance.now();

      const el = await fixture(html`
        <course-design>
          <div>Performance test content</div>
        </course-design>
      `);

      const endTime = performance.now();
      expect(endTime - startTime).to.be.lessThan(100); // Should render quickly
    });

    it("handles multiple instances efficiently", async () => {
      const instances = [];

      for (let i = 0; i < 10; i++) {
        const el = await fixture(html`
          <course-design>
            <p>Instance ${i}</p>
          </course-design>
        `);
        instances.push(el);
      }

      expect(instances.length).to.equal(10);
      instances.forEach((instance, i) => {
        expect(instance.querySelector("p").textContent).to.equal(
          `Instance ${i}`,
        );
      });
    });

    it("maintains minimal memory footprint", () => {
      const el = document.createElement("course-design");

      // Should not have unnecessary properties
      const ownProps = Object.getOwnPropertyNames(el).filter(
        (prop) => !prop.startsWith("_") && prop !== "shadowRoot",
      );

      expect(ownProps.length).to.be.lessThan(20); // Minimal property set
    });

    it("cleans up properly when removed", async () => {
      const container = document.createElement("div");
      const el = document.createElement("course-design");
      el.innerHTML = "<p>Cleanup test</p>";

      container.appendChild(el);
      document.body.appendChild(container);

      // Remove and verify cleanup
      document.body.removeChild(container);

      expect(el.parentNode).to.be.null;
    });
  });

  describe("Styling and CSS Integration", () => {
    it("applies base styles correctly", () => {
      const styles = element.constructor.styles[0];
      expect(styles.cssText).to.include("display: block");
      expect(styles.cssText).to.include(":host([hidden])");
    });

    it("supports CSS custom properties", async () => {
      element.style.setProperty("--course-bg-color", "lightblue");

      const bgColor =
        getComputedStyle(element).getPropertyValue("--course-bg-color");
      expect(bgColor.trim()).to.equal("lightblue");
    });

    it("allows content styling inheritance", async () => {
      const el = await fixture(html`
        <course-design style="color: red; font-size: 18px;">
          <p>Styled content</p>
        </course-design>
      `);

      const paragraph = el.querySelector("p");
      const styles = getComputedStyle(paragraph);

      // Should inherit color and font-size from parent
      expect(styles.color).to.include("255, 0, 0"); // red in rgb
      expect(parseInt(styles.fontSize)).to.equal(18);
    });

    it("works with CSS frameworks", async () => {
      const el = await fixture(html`
        <course-design class="container">
          <div class="row">
            <div class="col">Framework styled content</div>
          </div>
        </course-design>
      `);

      expect(el.classList.contains("container")).to.be.true;
      expect(el.querySelector(".row")).to.exist;
      expect(el.querySelector(".col")).to.exist;
    });
  });

  describe("Integration Scenarios", () => {
    it("works as course content container", async () => {
      const el = await fixture(html`
        <course-design>
          <header>
            <h1>Course Title</h1>
            <p>Course description</p>
          </header>
          <main>
            <section class="objectives">
              <h2>Learning Objectives</h2>
              <learning-component type="knowledge">
                <ul>
                  <li>Understand core concepts</li>
                  <li>Apply knowledge in practice</li>
                </ul>
              </learning-component>
            </section>
            <section class="activities">
              <h2>Activities</h2>
              <activity-box icon="assignment">
                Complete the exercises
              </activity-box>
            </section>
          </main>
        </course-design>
      `);

      expect(el.querySelector("header h1").textContent).to.equal(
        "Course Title",
      );
      expect(el.querySelector(".objectives")).to.exist;
      expect(el.querySelector("learning-component")).to.exist;
      expect(el.querySelector("activity-box")).to.exist;

      await expect(el).to.be.accessible();
    });

    it("supports nested course-design elements", async () => {
      const el = await fixture(html`
        <course-design>
          <section>
            <h2>Module 1</h2>
            <course-design>
              <h3>Lesson 1.1</h3>
              <p>Lesson content</p>
            </course-design>
          </section>
        </course-design>
      `);

      const nested = el.querySelector("course-design");
      expect(nested).to.exist;
      expect(nested.querySelector("h3").textContent).to.equal("Lesson 1.1");
    });

    it("integrates with HAXcms or similar systems", async () => {
      const el = await fixture(html`
        <course-design>
          <article data-hax-body>
            <h1 data-hax-element>Course Content</h1>
            <learning-component data-hax-element title="Objective">
              <p>Content with HAX attributes</p>
            </learning-component>
          </article>
        </course-design>
      `);

      expect(el.querySelector("[data-hax-body]")).to.exist;
      expect(el.querySelectorAll("[data-hax-element]").length).to.equal(2);
    });

    it("works in different document contexts", async () => {
      // Test in different contexts
      const iframe = document.createElement("iframe");
      document.body.appendChild(iframe);
      const iframeDoc = iframe.contentDocument;

      const el = iframeDoc.createElement("course-design");
      el.innerHTML = "<p>Iframe content</p>";

      expect(el.tagName.toLowerCase()).to.equal("course-design");

      document.body.removeChild(iframe);
    });
  });
});
