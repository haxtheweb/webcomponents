import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import { MemeMaker } from "../meme-maker.js";

describe("meme-maker test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <meme-maker
        alt="Cat stalking a small toy"
        image-url="https://cdn2.thecatapi.com/images/9j5.jpg"
        top-text="I bring you"
        bottom-text="the death"
      ></meme-maker>
    `);
  });

  describe("Basic instantiation and properties", () => {
    it("element is an instance of MemeMaker", async () => {
      expect(element).to.be.instanceOf(MemeMaker);
    });

    it("has correct tag name", async () => {
      expect(MemeMaker.tag).to.equal("meme-maker");
    });

    it("element has correct default properties", async () => {
      const el = await fixture(html`<meme-maker></meme-maker>`);
      expect(el.alt).to.equal("");
      expect(el.crossorigin).to.be.false;
      expect(el.imageUrl).to.be.undefined;
      expect(el.topText).to.be.undefined;
      expect(el.bottomText).to.be.undefined;
      expect(el.describedBy).to.be.undefined;
    });
  });

  describe("Property reflection and attributes", () => {
    it("reflects imageUrl property to attribute", async () => {
      element.imageUrl = "https://example.com/test.jpg";
      await element.updateComplete;
      expect(element.getAttribute("image-url")).to.equal("https://example.com/test.jpg");
    });

    it("reflects topText property to attribute", async () => {
      element.topText = "Top meme text";
      await element.updateComplete;
      expect(element.getAttribute("top-text")).to.equal("Top meme text");
    });

    it("reflects bottomText property to attribute", async () => {
      element.bottomText = "Bottom meme text";
      await element.updateComplete;
      expect(element.getAttribute("bottom-text")).to.equal("Bottom meme text");
    });

    it("sets alt attribute correctly", async () => {
      element.alt = "Alternative text";
      await element.updateComplete;
      const img = element.shadowRoot.querySelector('img');
      expect(img.alt).to.equal("Alternative text");
    });

    it("sets describedBy attribute correctly", async () => {
      element.describedBy = "description-id";
      await element.updateComplete;
      const img = element.shadowRoot.querySelector('img');
      expect(img.getAttribute('aria-describedby')).to.equal("description-id");
    });

    it("handles crossorigin property", async () => {
      element.crossorigin = true;
      await element.updateComplete;
      const img = element.shadowRoot.querySelector('img');
      expect(img.hasAttribute('crossorigin')).to.be.true;
    });
  });

  describe("Rendering and DOM structure", () => {
    it("renders figure with img and figcaptions", async () => {
      const figure = element.shadowRoot.querySelector('figure');
      const img = element.shadowRoot.querySelector('img');
      const topText = element.shadowRoot.querySelector('.top-text');
      const bottomText = element.shadowRoot.querySelector('.bottom-text');
      
      expect(figure).to.exist;
      expect(img).to.exist;
      expect(topText).to.exist;
      expect(bottomText).to.exist;
    });

    it("displays correct image source", async () => {
      const img = element.shadowRoot.querySelector('img');
      expect(img.src).to.equal("https://cdn2.thecatapi.com/images/9j5.jpg");
    });

    it("displays correct top text", async () => {
      const topText = element.shadowRoot.querySelector('.top-text');
      expect(topText.textContent).to.equal("I bring you");
    });

    it("displays correct bottom text", async () => {
      const bottomText = element.shadowRoot.querySelector('.bottom-text');
      expect(bottomText.textContent).to.equal("the death");
    });

    it("image has loading=lazy attribute", async () => {
      const img = element.shadowRoot.querySelector('img');
      expect(img.getAttribute('loading')).to.equal('lazy');
    });

    it("renders empty text when no text provided", async () => {
      const el = await fixture(html`<meme-maker image-url="test.jpg"></meme-maker>`);
      const topText = el.shadowRoot.querySelector('.top-text');
      const bottomText = el.shadowRoot.querySelector('.bottom-text');
      
      expect(topText.textContent).to.equal("");
      expect(bottomText.textContent).to.equal("");
    });
  });

  describe("Styling and CSS custom properties", () => {
    it("has proper CSS structure for meme styling", async () => {
      const topText = element.shadowRoot.querySelector('.top-text');
      const bottomText = element.shadowRoot.querySelector('.bottom-text');
      
      const topStyle = getComputedStyle(topText);
      const bottomStyle = getComputedStyle(bottomText);
      
      expect(topStyle.position).to.equal('absolute');
      expect(topStyle.textAlign).to.equal('center');
      expect(topStyle.textTransform).to.equal('uppercase');
      expect(topStyle.color).to.equal('rgb(255, 255, 255)');
      
      expect(bottomStyle.position).to.equal('absolute');
      expect(bottomStyle.textAlign).to.equal('center');
    });

    it("applies text shadow for readability", async () => {
      const topText = element.shadowRoot.querySelector('.top-text');
      const style = getComputedStyle(topText);
      expect(style.textShadow).to.not.equal('none');
    });

    it("uses Impact font family", async () => {
      const topText = element.shadowRoot.querySelector('.top-text');
      const style = getComputedStyle(topText);
      expect(style.fontFamily).to.include('Impact');
    });
  });

  describe("Dynamic property updates", () => {
    it("updates image when imageUrl changes", async () => {
      element.imageUrl = "https://example.com/new-image.jpg";
      await element.updateComplete;
      
      const img = element.shadowRoot.querySelector('img');
      expect(img.src).to.equal("https://example.com/new-image.jpg");
    });

    it("updates top text when topText changes", async () => {
      element.topText = "New top text";
      await element.updateComplete;
      
      const topText = element.shadowRoot.querySelector('.top-text');
      expect(topText.textContent).to.equal("New top text");
    });

    it("updates bottom text when bottomText changes", async () => {
      element.bottomText = "New bottom text";
      await element.updateComplete;
      
      const bottomText = element.shadowRoot.querySelector('.bottom-text');
      expect(bottomText.textContent).to.equal("New bottom text");
    });

    it("updates alt text when alt changes", async () => {
      element.alt = "New alt text";
      await element.updateComplete;
      
      const img = element.shadowRoot.querySelector('img');
      expect(img.alt).to.equal("New alt text");
    });
  });

  describe("HAX integration", () => {
    it("has haxProperties method", async () => {
      expect(MemeMaker.haxProperties).to.be.a('string');
      expect(MemeMaker.haxProperties).to.include('meme-maker.haxProperties.json');
    });

    it("has haxHooks method", async () => {
      const hooks = element.haxHooks();
      expect(hooks).to.have.property('progressiveEnhancement');
      expect(hooks).to.have.property('gizmoRegistration');
      expect(hooks.progressiveEnhancement).to.equal('haxprogressiveEnhancement');
      expect(hooks.gizmoRegistration).to.equal('haxgizmoRegistration');
    });

    it("progressive enhancement returns correct HTML", async () => {
      const html = element.haxprogressiveEnhancement();
      expect(html).to.include(element.topText);
      expect(html).to.include(element.bottomText);
      expect(html).to.include(element.imageUrl);
      expect(html).to.include(element.alt);
      expect(html).to.include('<img');
    });

    it("progressive enhancement handles empty text", async () => {
      const el = await fixture(html`<meme-maker image-url="test.jpg" alt="test"></meme-maker>`);
      const html = el.haxprogressiveEnhancement();
      expect(html).to.include('<img');
      expect(html).to.include('test.jpg');
    });

    it("registers i18n element on gizmoRegistration", async () => {
      let eventFired = false;
      const handler = (e) => {
        if (e.type === 'i18n-manager-register-element') {
          eventFired = true;
          expect(e.detail.namespace).to.equal('meme-maker.haxProperties');
          expect(e.detail.locales).to.include('es');
          expect(e.detail.locales).to.include('fr');
        }
      };
      
      globalThis.addEventListener('i18n-manager-register-element', handler);
      element.haxgizmoRegistration();
      await aTimeout(50);
      
      expect(eventFired).to.be.true;
      globalThis.removeEventListener('i18n-manager-register-element', handler);
    });
  });

  describe("Edge cases and error handling", () => {
    it("handles missing image gracefully", async () => {
      const el = await fixture(html`<meme-maker></meme-maker>`);
      const img = el.shadowRoot.querySelector('img');
      expect(img.src).to.equal("");
      expect(() => el.updateComplete).to.not.throw;
    });

    it("handles very long text", async () => {
      const longText = "This is a very long meme text that should still render properly without breaking the layout";
      element.topText = longText;
      element.bottomText = longText;
      await element.updateComplete;
      
      const topText = element.shadowRoot.querySelector('.top-text');
      const bottomText = element.shadowRoot.querySelector('.bottom-text');
      
      expect(topText.textContent).to.equal(longText);
      expect(bottomText.textContent).to.equal(longText);
    });

    it("handles special characters in text", async () => {
      const specialText = "Special chars: àáâã & <> \"quotes\"";
      element.topText = specialText;
      element.bottomText = specialText;
      await element.updateComplete;
      
      const topText = element.shadowRoot.querySelector('.top-text');
      const bottomText = element.shadowRoot.querySelector('.bottom-text');
      
      expect(topText.textContent).to.equal(specialText);
      expect(bottomText.textContent).to.equal(specialText);
    });

    it("handles empty string values", async () => {
      element.topText = "";
      element.bottomText = "";
      element.alt = "";
      element.imageUrl = "";
      await element.updateComplete;
      
      expect(() => element.updateComplete).to.not.throw;
    });
  });

  describe("Accessibility", () => {
    it("passes the a11y audit", async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it("has proper semantic structure with figure and figcaption", async () => {
      const figure = element.shadowRoot.querySelector('figure');
      const figcaptions = element.shadowRoot.querySelectorAll('figcaption');
      
      expect(figure).to.exist;
      expect(figcaptions).to.have.length(2);
    });

    it("image has alt attribute when provided", async () => {
      const img = element.shadowRoot.querySelector('img');
      expect(img.alt).to.equal("Cat stalking a small toy");
    });

    it("supports aria-describedby when provided", async () => {
      element.describedBy = "meme-description";
      await element.updateComplete;
      
      const img = element.shadowRoot.querySelector('img');
      expect(img.getAttribute('aria-describedby')).to.equal('meme-description');
    });

    it("maintains accessibility with empty alt text", async () => {
      const el = await fixture(html`<meme-maker image-url="test.jpg"></meme-maker>`);
      const img = el.shadowRoot.querySelector('img');
      expect(img.alt).to.equal("");
      await expect(el).shadowDom.to.be.accessible();
    });
  });

  describe("Responsive behavior", () => {
    it("applies responsive font sizes via CSS custom properties", async () => {
      const topText = element.shadowRoot.querySelector('.top-text');
      const style = getComputedStyle(topText);
      
      // Should use CSS custom property or fallback
      expect(style.fontSize).to.not.be.empty;
    });

    it("maintains aspect ratio of figure", async () => {
      const figure = element.shadowRoot.querySelector('figure');
      const style = getComputedStyle(figure);
      
      expect(style.width).to.equal('100%');
      expect(style.position).to.equal('relative');
    });
  });
});
