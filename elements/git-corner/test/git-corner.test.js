import { fixture, expect, html } from "@open-wc/testing";
import "../git-corner.js";

describe("GitCorner test", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`
      <git-corner
        source="https://github.com/user/repo"
        alt="View source on GitHub"
      ></git-corner>
    `);
    await element.updateComplete;
  });

  // Basic functionality tests
  it("instantiates the element correctly", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("git-corner");
  });

  it("has correct default values", () => {
    expect(element.source).to.equal("https://github.com/user/repo");
    expect(element.alt).to.equal("View source on GitHub");
  });

  // Property validation tests
  it("sets source and alt properties correctly", async () => {
    element.source = "https://github.com/test/project";
    element.alt = "GitHub Repository";
    await element.updateComplete;

    expect(element.source).to.equal("https://github.com/test/project");
    expect(element.alt).to.equal("GitHub Repository");
  });

  it("reflects corner and size attributes", async () => {
    element.corner = true;
    element.size = "large";
    await element.updateComplete;

    expect(element.hasAttribute("corner")).to.be.true;
    expect(element.getAttribute("size")).to.equal("large");
  });

  // Rendering tests
  it("renders GitHub link with correct attributes", () => {
    const link = element.shadowRoot.querySelector("a");
    expect(link).to.exist;
    expect(link.href).to.equal("https://github.com/user/repo");
    expect(link.title).to.equal("View source on GitHub");
    expect(link.target).to.equal("_blank");
    expect(link.rel).to.equal("noopener noreferrer");
  });

  it("renders SVG with Octocat design", () => {
    const svg = element.shadowRoot.querySelector("svg");
    expect(svg).to.exist;
    expect(svg.getAttribute("viewBox")).to.equal("0 0 250 250");

    const paths = element.shadowRoot.querySelectorAll("path");
    expect(paths.length).to.be.greaterThan(0);

    const octoArm = element.shadowRoot.querySelector(".octo-arm");
    const octoBody = element.shadowRoot.querySelector(".octo-body");
    expect(octoArm).to.exist;
    expect(octoBody).to.exist;
  });

  // Size variation tests
  it("applies size variations correctly", async () => {
    const sizes = ["micro", "small", "large"];

    for (const size of sizes) {
      element.size = size;
      await element.updateComplete;
      expect(element.getAttribute("size")).to.equal(size);
    }
  });

  // Corner positioning tests
  it("applies corner positioning when enabled", async () => {
    element.corner = true;
    await element.updateComplete;

    expect(element.hasAttribute("corner")).to.be.true;
  });

  it("works without corner positioning", async () => {
    element.corner = false;
    await element.updateComplete;

    expect(element.hasAttribute("corner")).to.be.false;
  });

  // CSS custom properties tests
  it("supports CSS custom property theming", () => {
    const styles = element.constructor.styles.toString();
    expect(styles).to.include("--github-corner-background");
    expect(styles).to.include("--github-corner-color");
    expect(styles).to.include("--github-corner-size");
    expect(styles).to.include("--github-corner-z-index");
  });

  // Animation tests
  it("includes Octocat wave animation", () => {
    const styles = element.constructor.styles.toString();
    expect(styles).to.include("octocat-wave");
    expect(styles).to.include("@keyframes");
    expect(styles).to.include("animation");
  });

  // Accessibility tests
  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("provides accessible link with proper attributes", () => {
    const link = element.shadowRoot.querySelector("a");
    expect(link.title).to.exist;
    expect(link.href).to.exist;
    expect(link.rel).to.include("noopener");
  });

  // Edge cases
  it("handles empty source gracefully", async () => {
    element.source = "";
    await element.updateComplete;

    const link = element.shadowRoot.querySelector("a");
    expect(link.href).to.equal("");
  });

  it("handles special characters in alt text", async () => {
    element.alt = "View on GitHub - Special chars: & < > \" 'test'";
    await element.updateComplete;

    const link = element.shadowRoot.querySelector("a");
    expect(link.title).to.include("Special chars");
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("git-corner passes accessibility test", async () => {
    const el = await fixture(html` <git-corner></git-corner> `);
    await expect(el).to.be.accessible();
  });
  it("git-corner passes accessibility negation", async () => {
    const el = await fixture(
      html`<git-corner aria-labelledby="git-corner"></git-corner>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("git-corner can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<git-corner .foo=${'bar'}></git-corner>`);
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
      const el = await fixture(html`<git-corner ></git-corner>`);
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
      const el = await fixture(html`<git-corner></git-corner>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<git-corner></git-corner>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
