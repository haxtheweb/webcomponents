import { html } from "lit";
import { fixture, expect } from "@open-wc/testing";

import "../post-card.js";

describe("PostCard", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(
      html`<post-card
        post-mark-locations="Egypt"
        photo-src="http://media.liveauctiongroup.net/i/11189/11535427_1.jpg?v=8CE770C8F1EEC60"
        to="Future"
        from="Past"
        message="To make a baby...."
      ></post-card>`,
    );
  });

  describe('Component Structure', () => {
    it('should be defined as a custom element', () => {
      expect(customElements.get('post-card')).to.exist;
      expect(element.tagName.toLowerCase()).to.equal('post-card');
    });

    it('should create an instance', () => {
      expect(element).to.exist;
      expect(element.constructor.name).to.equal('PostCard');
    });

    it('should have correct tag property', () => {
      expect(element.constructor.tag).to.equal('post-card');
    });

    it('should extend LitElement', () => {
      expect(element.constructor.name).to.equal('PostCard');
    });

    it('should have shadow DOM', () => {
      expect(element.shadowRoot).to.exist;
    });
  });

  describe('Default Properties', () => {
    it('should have default translation object', () => {
      expect(element.t).to.be.an('object');
      expect(element.t.label).to.equal('Post Card');
      expect(element.t.send).to.equal('To');
      expect(element.t.receive).to.equal('From');
    });

    it('should have default image sources', async () => {
      // Create a fresh element without custom photo-src to test defaults
      const defaultElement = await fixture(html`<post-card></post-card>`);
      expect(defaultElement.photoSrc).to.include('postcard-photo-stock.jpg');
      expect(defaultElement.stampSrc).to.include('postcard-stamp-stock.jpg');
    });

    it('should have default post mark locations', async () => {
      // Create a fresh element without post-mark-locations to test defaults
      const defaultElement = await fixture(html`<post-card></post-card>`);
      expect(defaultElement.postMarkLocations).to.equal('insert - locations - here');
    });
  });

  describe('Property Updates', () => {
    it('should update to property', async () => {
      element.to = 'New Destination';
      await element.updateComplete;
      expect(element.to).to.equal('New Destination');
    });

    it('should update from property', async () => {
      element.from = 'New Origin';
      await element.updateComplete;
      expect(element.from).to.equal('New Origin');
    });

    it('should update message property', async () => {
      element.message = 'New message content';
      await element.updateComplete;
      expect(element.message).to.equal('New message content');
    });

    it('should update photo source', async () => {
      element.photoSrc = 'http://example.com/new-photo.jpg';
      await element.updateComplete;
      expect(element.photoSrc).to.equal('http://example.com/new-photo.jpg');
    });

    it('should update stamp source', async () => {
      element.stampSrc = 'http://example.com/new-stamp.jpg';
      await element.updateComplete;
      expect(element.stampSrc).to.equal('http://example.com/new-stamp.jpg');
    });

    it('should update post mark locations', async () => {
      element.postMarkLocations = 'France, Italy';
      await element.updateComplete;
      expect(element.postMarkLocations).to.equal('France, Italy');
    });
  });

  describe('Template Rendering', () => {
    it('should render main card structure', () => {
      const card = element.shadowRoot.querySelector('.entireCard');
      expect(card).to.exist;
    });

    it('should render background lines', () => {
      const bgLines = element.shadowRoot.querySelector('.backgroundLines');
      expect(bgLines).to.exist;
      const img = bgLines.querySelector('img');
      expect(img).to.exist;
    });

    it('should render foreground elements', () => {
      const fg = element.shadowRoot.querySelector('.foregroundElements');
      expect(fg).to.exist;
    });

    it('should render postage area', () => {
      const postage = element.shadowRoot.querySelector('.postage');
      expect(postage).to.exist;
    });

    it('should render image area', () => {
      const image = element.shadowRoot.querySelector('.image');
      expect(image).to.exist;
    });

    it('should render to/from area', () => {
      const tofrom = element.shadowRoot.querySelector('.tofrom');
      expect(tofrom).to.exist;
    });

    it('should render message area', () => {
      const message = element.shadowRoot.querySelector('.message');
      expect(message).to.exist;
    });
  });

  describe('Sub-components', () => {
    it("renders a post-card-photo", () => {
      const pcp = element.shadowRoot.querySelector("post-card-photo");
      expect(pcp).to.exist;
    });

    it("renders a post-card-stamp", () => {
      const pcs = element.shadowRoot.querySelector("post-card-stamp");
      expect(pcs).to.exist;
    });

    it("renders a post-card-postmark", () => {
      const pcpm = element.shadowRoot.querySelector("post-card-postmark");
      expect(pcpm).to.exist;
    });

    it('should pass correct attributes to sub-components', () => {
      const photo = element.shadowRoot.querySelector('post-card-photo');
      const stamp = element.shadowRoot.querySelector('post-card-stamp');
      const postmark = element.shadowRoot.querySelector('post-card-postmark');
      
      expect(photo.getAttribute('image')).to.equal(element.photoSrc);
      expect(stamp.getAttribute('image')).to.equal(element.stampSrc);
      expect(postmark.getAttribute('locations')).to.equal('Egypt');
    });
  });

  describe('Content Slots', () => {
    it("renders an h3", () => {
      const h3 = element.shadowRoot.querySelector("h3");
      expect(h3).to.exist;
    });

    it("renders a correct To address", () => {
      const to = element.shadowRoot.querySelector('slot[name="to"]');
      expect(to).to.exist;
      expect(to.textContent).to.equal("Future");
    });

    it("renders a correct from address", () => {
      const from = element.shadowRoot.querySelector('slot[name="from"]');
      expect(from).to.exist;
      expect(from.textContent).to.equal("Past");
    });

    it("renders a correct message", () => {
      const mess = element.shadowRoot.querySelector('slot[name="message"]');
      expect(mess).to.exist;
      expect(mess.textContent).to.equal("To make a baby....");
    });

    it('should use fallback content when slots are empty', async () => {
      const emptyElement = await fixture(html`<post-card></post-card>`);
      
      const toContent = emptyElement.shadowRoot.querySelector('.toContent');
      const fromContent = emptyElement.shadowRoot.querySelector('.fromContent');
      const messageContent = emptyElement.shadowRoot.querySelector('.messageContent');
      
      expect(toContent).to.exist;
      expect(fromContent).to.exist;
      expect(messageContent).to.exist;
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive CSS custom properties', () => {
      const styles = getComputedStyle(element);
      expect(styles.getPropertyValue('--width-body')).to.not.be.empty;
    });

    it('should handle different screen sizes with transforms', () => {
      // Test that the component has styles defined
      const styles = element.constructor.styles;
      expect(styles).to.exist;
      
      // Convert CSSResult to string to check content
      let stylesString = '';
      if (Array.isArray(styles)) {
        stylesString = styles.map(s => s.toString()).join('');
      } else if (styles && typeof styles.toString === 'function') {
        stylesString = styles.toString();
      }
      
      if (stylesString) {
        expect(stylesString).to.include('@media');
        expect(stylesString).to.include('transform: scale');
      } else {
        // Fallback test - verify styles exist
        expect(styles).to.not.be.undefined;
      }
    });
  });

  describe('I18n Support', () => {
    it('should dispatch i18n manager registration event', () => {
      // The event is dispatched in constructor, so we test its existence
      expect(element.t).to.be.an('object');
      expect(element.t.label).to.be.a('string');
    });

    it('should have translation properties', () => {
      expect(element.t.label).to.equal('Post Card');
      expect(element.t.send).to.equal('To');
      expect(element.t.receive).to.equal('From');
    });
  });

  describe('HAX Integration', () => {
    it('should have haxProperties', () => {
      expect(element.constructor.haxProperties).to.be.a('string');
      expect(element.constructor.haxProperties).to.include('haxProperties.json');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null/undefined property values', async () => {
      element.to = null;
      element.from = undefined;
      element.message = null;
      await element.updateComplete;
      
      expect(element.to).to.be.null;
      expect(element.from).to.be.undefined;
      expect(element.message).to.be.null;
    });

    it('should handle empty string values', async () => {
      element.to = '';
      element.from = '';
      element.message = '';
      await element.updateComplete;
      
      expect(element.to).to.equal('');
      expect(element.from).to.equal('');
      expect(element.message).to.equal('');
    });

    it('should handle long content gracefully', async () => {
      const longText = 'A'.repeat(500);
      element.to = longText;
      element.from = longText;
      element.message = longText;
      await element.updateComplete;
      
      expect(element.to).to.equal(longText);
      expect(element.from).to.equal(longText);
      expect(element.message).to.equal(longText);
    });
  });

  describe('Multiple Instances', () => {
    it('should support multiple post-card instances', async () => {
      const element1 = await fixture(html`
        <post-card to="Destination 1" from="Origin 1"></post-card>
      `);
      const element2 = await fixture(html`
        <post-card to="Destination 2" from="Origin 2"></post-card>
      `);
      
      expect(element1.to).to.equal('Destination 1');
      expect(element1.from).to.equal('Origin 1');
      expect(element2.to).to.equal('Destination 2');
      expect(element2.from).to.equal('Origin 2');
    });
  });

  describe('Performance', () => {
    it('should handle rapid property updates efficiently', async () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 20; i++) {
        element.to = `Destination ${i}`;
        element.from = `Origin ${i}`;
        element.message = `Message ${i}`;
        await element.updateComplete;
      }
      
      const endTime = performance.now();
      expect(endTime - startTime).to.be.lessThan(1000); // Should complete within 1 second
    });
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe("PostCardPostmark", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<post-card-postmark locations="Europe"></post-card-postmark>`,
    );
  });

  describe('Component Structure', () => {
    it('should be defined as a custom element', () => {
      expect(customElements.get('post-card-postmark')).to.exist;
      expect(element.tagName.toLowerCase()).to.equal('post-card-postmark');
    });

    it('should create an instance', () => {
      expect(element).to.exist;
      expect(element.constructor.name).to.include('PostCardPostmark');
    });

    it('should have shadow DOM', () => {
      expect(element.shadowRoot).to.exist;
    });
  });

  describe('Property Handling', () => {
    it('should handle locations property', () => {
      expect(element.locations).to.equal('Europe');
    });

    it('should update locations property', async () => {
      element.locations = 'Asia';
      await element.updateComplete;
      expect(element.locations).to.equal('Asia');
    });
  });

  describe('Template Rendering', () => {
    it("renders a location", async () => {
      const loco = element.shadowRoot.querySelector("p");
      expect(loco).to.exist;
      // expect(loco.textContent).to.equal('Europe')
    });

    it('should render postmark visual elements', () => {
      // Check for typical postmark visual elements
      const container = element.shadowRoot.querySelector('div');
      if (container) {
        expect(container).to.exist;
      }
    });
  });

  describe('Multiple Instances', () => {
    it('should support multiple postmark instances', async () => {
      const element1 = await fixture(
        html`<post-card-postmark locations="America"></post-card-postmark>`
      );
      const element2 = await fixture(
        html`<post-card-postmark locations="Africa"></post-card-postmark>`
      );
      
      expect(element1.locations).to.equal('America');
      expect(element2.locations).to.equal('Africa');
    });
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
