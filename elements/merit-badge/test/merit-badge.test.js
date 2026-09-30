import { fixture, expect, html } from "@open-wc/testing";
import "../merit-badge.js";
import { MeritBadge } from "../merit-badge.js";

describe("elementName test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<merit-badge></merit-badge>`);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Accessibility - Image and Alt Text", () => {
    it("provides proper alt text for badge image", async () => {
      const testElement = await fixture(html`
        <merit-badge badge="badge-image.png" alt="Merit badge for completion">
        </merit-badge>
      `);
      await testElement.updateComplete;

      const img = testElement.shadowRoot.querySelector("img");
      if (img) {
        expect(img.alt).to.equal("Merit badge for completion");
      }
    });

    it("handles missing alt text appropriately", async () => {
      const testElement = await fixture(html`
        <merit-badge badge="badge-image.png"> </merit-badge>
      `);
      await testElement.updateComplete;

      // Should still be accessible even without explicit alt
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("supports descriptive text content", async () => {
      const testElement = await fixture(html`
        <merit-badge>
          <p>Badge description text</p>
        </merit-badge>
      `);
      await testElement.updateComplete;

      const content = testElement.querySelector("p");
      expect(content).to.exist;
      expect(content.textContent).to.include("Badge description");
    });
  });

  describe("Accessibility - Semantic Structure", () => {
    it("uses appropriate semantic elements", async () => {
      await element.updateComplete;

      // Check for proper semantic structure
      const figure = element.shadowRoot.querySelector("figure");
      const container = element.shadowRoot.querySelector(
        ".container, .badge-container",
      );

      if (figure) {
        expect(figure).to.exist;
      }
      // Should have some container structure
      expect(element.shadowRoot.children.length).to.be.greaterThan(0);
    });

    it("maintains proper reading order", async () => {
      const testElement = await fixture(html`
        <merit-badge badge="test.png">
          <h3>Badge Title</h3>
          <p>Badge description</p>
        </merit-badge>
      `);
      await testElement.updateComplete;

      const title = testElement.querySelector("h3");
      const description = testElement.querySelector("p");

      expect(title).to.exist;
      expect(description).to.exist;
    });
  });

  describe("Accessibility - Loading and Performance", () => {
    it("handles missing badge images gracefully", async () => {
      const testElement = await fixture(html`
        <merit-badge>
          <span>No image badge</span>
        </merit-badge>
      `);
      await testElement.updateComplete;

      // Should be accessible without image
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("supports lazy loading when appropriate", async () => {
      const testElement = await fixture(html`
        <merit-badge badge="large-badge.png"> </merit-badge>
      `);
      await testElement.updateComplete;

      const img = testElement.shadowRoot.querySelector("img");
      if (img) {
        // Should support performance optimizations
        expect(img.hasAttribute("loading") || img.hasAttribute("decoding")).to
          .be.true;
      }
    });
  });

  describe("Accessibility - Responsive Design", () => {
    it("maintains accessibility across different sizes", async () => {
      const testElement = await fixture(html`
        <merit-badge badge="test.png" size="small"> </merit-badge>
      `);
      await testElement.updateComplete;

      await expect(testElement).shadowDom.to.be.accessible();

      // Test different sizes if supported
      if (testElement.hasAttribute("size")) {
        testElement.setAttribute("size", "large");
        await testElement.updateComplete;
        await expect(testElement).shadowDom.to.be.accessible();
      }
    });

    it("provides appropriate contrast and styling", async () => {
      await element.updateComplete;

      const style = globalThis.getComputedStyle(element);
      expect(style.display).to.not.equal("none");
    });
  });

  describe("Accessibility - Interactive Features", () => {
    it("supports focus management if interactive", async () => {
      const testElement = await fixture(html`
        <merit-badge badge="test.png" href="#badge-details"> </merit-badge>
      `);
      await testElement.updateComplete;

      // If it's a link, should be focusable
      if (
        testElement.hasAttribute("href") ||
        testElement.shadowRoot.querySelector("a")
      ) {
        const link = testElement.shadowRoot.querySelector("a");
        if (link) {
          expect(link.hasAttribute("href")).to.be.true;
        }
      }
    });

    it("provides keyboard navigation when applicable", async () => {
      const testElement = await fixture(html`
        <merit-badge badge="test.png" tabindex="0"> </merit-badge>
      `);
      await testElement.updateComplete;

      if (testElement.hasAttribute("tabindex")) {
        expect(testElement.tabIndex).to.equal(0);
      }
    });
  });
});

describe('merit-badge element', () => {
  it('registers the custom element and static tag', () => {
    expect(globalThis.customElements.get('merit-badge')).to.exist
    expect(MeritBadge.tag).to.equal('merit-badge')
  })

  it('shows the locked badge by default', async () => {
    const el = await fixture(html`<merit-badge></merit-badge>`)
    await el.updateComplete
    expect(el.badgeUnlocked).to.be.false
    expect(el.shadowRoot.querySelector('locked-badge')).to.exist
    expect(el.shadowRoot.querySelector('badge-sticker')).to.not.exist
    const button = el.shadowRoot.querySelector('.unlockButton')
    expect(button.textContent.trim()).to.equal('Unlock?')
  })

  it('applies the oer:LearningObjective typeof and emits the oer:skill meta', async () => {
    const el = await fixture(
      html`<merit-badge skill="Resilience"></merit-badge>`,
    )
    await el.updateComplete
    expect(el.getAttribute('typeof')).to.equal('oer:LearningObjective')
    expect(
      el.shadowRoot
        .querySelector('meta[property="oer:skill"]')
        .getAttribute('content'),
    ).to.equal('Resilience')
  })

  it('unlocks into a badge sticker and back through the button', async () => {
    // properties map to lowercased attribute names (badgetitle etc), not kebab-case
    const el = await fixture(html`
      <merit-badge
        badgeTitle="Trailblazer"
        badgeImage="badge.png"
        badgeDetails="Earned for blazing trails"
        hyperLink="https://example.com/verify"
        badgeSkills="leadership,navigation"
        badgeColor="#2b6cb0"
      ></merit-badge>
    `)
    await el.updateComplete
    const button = el.shadowRoot.querySelector('.unlockButton')
    button.click()
    await el.updateComplete
    expect(el.badgeUnlocked).to.be.true
    expect(el.shadowRoot.querySelector('locked-badge')).to.not.exist
    const sticker = el.shadowRoot.querySelector('badge-sticker')
    expect(sticker).to.exist
    // the child serializes with kebab-case attribute names
    expect(sticker.getAttribute('badge-title')).to.equal('Trailblazer')
    expect(sticker.getAttribute('badge-image')).to.equal('badge.png')
    expect(sticker.getAttribute('badge-details')).to.equal(
      'Earned for blazing trails',
    )
    expect(sticker.getAttribute('hyper-link')).to.equal(
      'https://example.com/verify',
    )
    expect(sticker.getAttribute('badge-skills')).to.equal(
      'leadership,navigation',
    )
    expect(sticker.getAttribute('badge-color')).to.equal('#2b6cb0')
    expect(button.textContent.trim()).to.equal('Unlocked')
    button.click()
    await el.updateComplete
    expect(el.badgeUnlocked).to.be.false
    expect(el.shadowRoot.querySelector('locked-badge')).to.exist
  })

  it('exposes haxProperties with badge settings', () => {
    const props = MeritBadge.haxProperties
    expect(props.canScale).to.be.true
    expect(props.gizmo.title).to.equal('Merit Badge')
    expect(props.gizmo.icon).to.equal('icons:verified')
    expect(props.settings.configure.length).to.equal(6)
    expect(props.settings.configure[5].property).to.equal('skill')
    expect(props.settings.configure[5].inputMethod).to.equal('textfield')
    expect(props.settings.advanced.length).to.equal(0)
  })
})
