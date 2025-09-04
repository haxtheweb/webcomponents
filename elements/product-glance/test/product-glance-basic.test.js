import { fixture, expect, html } from "@open-wc/testing";

import "../product-glance.js";
import { ProductGlance } from "../product-glance.js";

describe("product-glance basic test", () => {
  let element;
  
  beforeEach(async () => {
    element = await fixture(html`
      <product-glance title="test-title"></product-glance>
    `);
  });

  describe('Core Component', () => {
    it('should be defined as a custom element', () => {
      expect(customElements.get('product-glance')).to.exist;
      expect(element.tagName.toLowerCase()).to.equal('product-glance');
    });

    it('should create an instance', () => {
      expect(element).to.exist;
      expect(element instanceof ProductGlance).to.be.true;
    });

    it('should have shadow DOM', () => {
      expect(element.shadowRoot).to.exist;
    });
  });

  describe('Properties', () => {
    it('should accept title property from attribute', () => {
      expect(element.title).to.equal('test-title');
    });

    it('should update title property', async () => {
      element.title = 'New Title';
      await element.updateComplete;
      expect(element.title).to.equal('New Title');
    });

    it('should update subtitle property', async () => {
      element.subtitle = 'Test Subtitle';
      await element.updateComplete;
      expect(element.subtitle).to.equal('Test Subtitle');
    });
  });

  describe('Template', () => {
    it('should render wrapper div', async () => {
      await element.updateComplete;
      const wrapper = element.shadowRoot.querySelector('.wrapper');
      expect(wrapper).to.exist;
    });

    it('should display title when provided', async () => {
      element.title = 'Product Title';
      await element.updateComplete;
      
      const titleDiv = element.shadowRoot.querySelector('.title-text');
      expect(titleDiv.textContent.trim()).to.include('Product Title');
    });

    it('should display subtitle when provided', async () => {
      element.subtitle = 'Product Subtitle';
      await element.updateComplete;
      
      const subtitleDiv = element.shadowRoot.querySelector('.subtitle-text');
      expect(subtitleDiv.textContent.trim()).to.include('Product Subtitle');
    });
  });

  describe('Slot Support', () => {
    it('should support title slot', async () => {
      const slottedElement = await fixture(html`
        <product-glance>
          <span slot="title">Slotted Title</span>
        </product-glance>
      `);
      
      await slottedElement.updateComplete;
      const titleSlot = slottedElement.shadowRoot.querySelector('slot[name="title"]');
      expect(titleSlot).to.exist;
      
      // Check that slotted content is assigned
      const assignedElements = titleSlot.assignedElements();
      expect(assignedElements).to.have.length(1);
      expect(assignedElements[0].textContent).to.equal('Slotted Title');
    });
    
    it('should show property value when no slot content provided', async () => {
      const noSlotElement = await fixture(html`
        <product-glance title="Property Only">
        </product-glance>
      `);
      
      await noSlotElement.updateComplete;
      const titleDiv = noSlotElement.shadowRoot.querySelector('.title-text');
      
      expect(titleDiv.textContent.trim()).to.include('Property Only');
    });
  });

  describe('SimpleColors', () => {
    it('should have SimpleColors properties available', () => {
      expect(element).to.have.property('accentColor');
      expect(element).to.have.property('dark');
      expect(element).to.have.property('contrast');
    });

    it('should handle accent color changes', async () => {
      element.accentColor = 'blue';
      await element.updateComplete;
      expect(element.accentColor).to.equal('blue');
    });

    it('should have SimpleColors in prototype chain', () => {
      expect(element.constructor.properties).to.include.keys('accentColor');
      expect(element.constructor.properties).to.include.keys('dark');
    });
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
