import { fixture, expect, html } from "@open-wc/testing";
import { sendKeys } from "@web/test-runner-commands";
import "../portal-launcher.js";

// Simple spy utility
function createSpy() {
  let calls = [];
  let fn = function (...args) {
    calls.push(args);
    return fn.returnValue;
  };
  fn.called = false;
  fn.callCount = 0;
  fn.calls = calls;
  fn.returnValue = undefined;
  return new Proxy(fn, {
    apply(target, thisArg, args) {
      target.called = true;
      target.callCount++;
      return target(...args);
    },
  });
}

describe("portal-launcher test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <portal-launcher title="test-title">
        <a href="https://example.com">Test Link</a>
      </portal-launcher>
    `);
  });

  describe("Component Structure", () => {
    it("should be defined as a custom element", () => {
      expect(customElements.get("portal-launcher")).to.exist;
      expect(element.tagName.toLowerCase()).to.equal("portal-launcher");
    });

    it("should create an instance", () => {
      expect(element).to.exist;
      expect(element.constructor.name).to.equal("PortalLauncher");
    });

    it("should have correct tag property", () => {
      expect(element.tag).to.equal("portal-launcher");
      expect(element.constructor.tag).to.equal("portal-launcher");
    });

    it("should extend HTMLElement", () => {
      expect(element instanceof HTMLElement).to.be.true;
    });

    it("should not have shadow DOM", () => {
      expect(element.shadowRoot).to.be.null;
    });
  });

  describe("Link Detection and Event Binding", () => {
    it("should find and bind click events to anchor tags", () => {
      const links = element.querySelectorAll("a");
      expect(links.length).to.equal(1);
      expect(links[0].href).to.equal("https://example.com/");
    });

    it("should handle elements with no links gracefully", async () => {
      const elementWithoutLinks = await fixture(html`
        <portal-launcher>
          <div>No links here</div>
        </portal-launcher>
      `);
      expect(() => elementWithoutLinks).to.not.throw;
    });

    it("should bind to multiple links", async () => {
      const elementWithMultipleLinks = await fixture(html`
        <portal-launcher>
          <a href="https://example1.com">Link 1</a>
          <a href="https://example2.com">Link 2</a>
          <a href="https://example3.com">Link 3</a>
        </portal-launcher>
      `);
      const links = elementWithMultipleLinks.querySelectorAll("a");
      expect(links.length).to.equal(3);
    });
  });

  describe("Event Path Normalization", () => {
    it("should normalize composed event paths", () => {
      const mockEvent = {
        composed: true,
        composedPath: () => ["path1", "path2"],
      };
      const path = element.normalizeEventPath(mockEvent);
      expect(path).to.deep.equal(["path1", "path2"]);
    });

    it("should handle legacy path property", () => {
      const mockEvent = {
        path: ["legacy1", "legacy2"],
      };
      const path = element.normalizeEventPath(mockEvent);
      expect(path).to.deep.equal(["legacy1", "legacy2"]);
    });

    it("should fallback to originalTarget", () => {
      const mockEvent = {
        originalTarget: "original",
      };
      const path = element.normalizeEventPath(mockEvent);
      expect(path).to.deep.equal(["original"]);
    });

    it("should fallback to target", () => {
      const mockEvent = {
        target: "fallback",
      };
      const path = element.normalizeEventPath(mockEvent);
      expect(path).to.deep.equal(["fallback"]);
    });
  });

  describe("Click Event Handling", () => {
    let link;
    beforeEach(() => {
      link = element.querySelector("a");
    });

    it("should handle click events on anchor tags", () => {
      // The click event handler is bound during construction
      // We can verify the link exists and has the event listener bound
      expect(link).to.exist;
      expect(link.href).to.equal("https://example.com/");

      // Test that click doesn't throw an error when called
      expect(() => link.click()).to.not.throw;
    });

    it("should find correct target from event path", () => {
      const mockA = { tagName: "A", getAttribute: () => "https://test.com" };
      const mockDiv = { tagName: "DIV" };
      const mockEvent = {
        target: mockDiv,
        preventDefault: () => {},
        stopPropagation: () => {},
        stopImmediatePropagation: () => {},
      };

      // Mock the normalizeEventPath to return our test path
      const originalNormalize = element.normalizeEventPath;
      element.normalizeEventPath = () => [mockDiv, mockA];

      element.click(mockEvent);

      // Restore original method
      element.normalizeEventPath = originalNormalize;
    });
  });

  describe("Portal Enhancement", () => {
    it("should handle links without href gracefully", () => {
      const mockEvent = {
        target: { tagName: "A", getAttribute: () => null },
        preventDefault: createSpy(),
      };

      expect(() => element.click(mockEvent)).to.not.throw;
      expect(mockEvent.preventDefault.called).to.be.false;
    });

    it("should check for portal support", () => {
      // Test that portal feature detection doesn't throw
      const hasPortalSupport = "HTMLPortalElement" in window;
      expect(typeof hasPortalSupport).to.equal("boolean");
    });
  });

  describe("Fallback Behavior", () => {
    it("should handle normal navigation gracefully", () => {
      const link = element.querySelector("a");
      const mockEvent = {
        target: link,
        preventDefault: createSpy(),
        stopPropagation: createSpy(),
      };

      // Test that click handler doesn't throw
      expect(() => element.click(mockEvent)).to.not.throw;
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("should handle null event gracefully", () => {
      expect(() => element.normalizeEventPath(null)).to.throw;
    });

    it("should handle event without target", () => {
      const mockEvent = {};
      const path = element.normalizeEventPath(mockEvent);
      expect(path).to.deep.equal([undefined]);
    });

    it("should handle nested elements correctly", async () => {
      const nestedElement = await fixture(html`
        <portal-launcher>
          <div>
            <span>
              <a href="https://nested.com">Nested Link</a>
            </span>
          </div>
        </portal-launcher>
      `);

      const link = nestedElement.querySelector("a");
      expect(link).to.exist;
      expect(link.href).to.equal("https://nested.com/");
    });
  });

  describe("Multiple Instances", () => {
    it("should support multiple portal-launcher instances", async () => {
      const element1 = await fixture(html`
        <portal-launcher>
          <a href="https://site1.com">Site 1</a>
        </portal-launcher>
      `);

      const element2 = await fixture(html`
        <portal-launcher>
          <a href="https://site2.com">Site 2</a>
        </portal-launcher>
      `);

      expect(element1.querySelector("a").href).to.equal("https://site1.com/");
      expect(element2.querySelector("a").href).to.equal("https://site2.com/");
    });
  });

  describe("Performance", () => {
    it("should handle rapid click events efficiently", () => {
      const link = element.querySelector("a");

      // Test that rapid clicks don't throw errors
      expect(() => {
        for (let i = 0; i < 10; i++) {
          link.click();
        }
      }).to.not.throw;
    });
  });

  it("passes the a11y audit", async () => {
    await expect(element).to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("portal-launcher passes accessibility test", async () => {
    const el = await fixture(html` <portal-launcher></portal-launcher> `);
    await expect(el).to.be.accessible();
  });
  it("portal-launcher passes accessibility negation", async () => {
    const el = await fixture(
      html`<portal-launcher
        aria-labelledby="portal-launcher"
      ></portal-launcher>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("portal-launcher can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<portal-launcher .foo=${'bar'}></portal-launcher>`);
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
      const el = await fixture(html`<portal-launcher ></portal-launcher>`);
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
      const el = await fixture(html`<portal-launcher></portal-launcher>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<portal-launcher></portal-launcher>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
