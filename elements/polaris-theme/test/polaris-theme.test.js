import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import '../polaris-theme.js';

describe('polaris-theme test', () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<polaris-theme></polaris-theme>`);
  });

  it('should exist as a custom element', () => {
    expect(customElements.get('polaris-theme')).to.exist;
  });

  it('should create an instance', () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal('polaris-theme');
  });

  it('should have shadow DOM', () => {
    expect(element.shadowRoot).to.exist;
  });

  it('should have default properties', () => {
    expect(element.searchTerm).to.equal('');
    expect(element.imageAlt).to.equal('');
    expect(element.image).to.equal('');
    expect(element.imageLink).to.equal('');
    expect(element.editMode).to.be.false;
  });

  it('should update properties', async () => {
    element.searchTerm = 'test search';
    element.imageAlt = 'Test image';
    element.image = '/test.jpg';
    element.imageLink = '/test-link';
    await element.updateComplete;
    
    expect(element.searchTerm).to.equal('test search');
    expect(element.imageAlt).to.equal('Test image');
    expect(element.image).to.equal('/test.jpg');
    expect(element.imageLink).to.equal('/test-link');
  });

  it('should render basic structure', () => {
    const shadowRoot = element.shadowRoot;
    expect(shadowRoot.querySelector('header')).to.exist;
    expect(shadowRoot.querySelector('nav')).to.exist;
    expect(shadowRoot.querySelector('main')).to.exist;
    expect(shadowRoot.querySelector('aside')).to.exist;
    expect(shadowRoot.querySelector('footer')).to.exist;
  });

  it('should handle edit mode toggle', async () => {
    element.editMode = true;
    await element.updateComplete;
    expect(element.editMode).to.be.true;
    
    element.editMode = false;
    await element.updateComplete;
    expect(element.editMode).to.be.false;
  });

  it('should handle null property values gracefully', async () => {
    element.image = null;
    await element.updateComplete;
    
    // Should handle null gracefully
    expect(element.image).to.be.null;
  });

  it('should support multiple instances', async () => {
    const element2 = await fixture(html`<polaris-theme image="/test.jpg"></polaris-theme>`);
    
    expect(element.image).to.equal('');
    expect(element2.image).to.equal('/test.jpg');
  });

  it('should cleanup on disconnection', () => {
    expect(() => element.disconnectedCallback()).to.not.throw;
  });
});
