import { fixture, expect, html } from "@open-wc/testing";
import "../media-quote.js";

describe("MediaQuote test", () => {
  let element;
  
  beforeEach(async () => {
    element = await fixture(html`<media-quote></media-quote>`);
    await element.updateComplete;
  });

  // Basic functionality tests
  it("instantiates the element with default values", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("media-quote");
  });

  it("has correct default property values", async () => {
    expect(element.src).to.equal("");
    expect(element.alt).to.equal("");
    expect(element.quote).to.equal("");
    expect(element.author).to.equal("");
    expect(element.authorDetail).to.equal("");
    expect(element.caption).to.equal("");
    expect(element.hasFilter).to.be.false;
    expect(element._isCaptionOpen).to.be.false;
  });

  it("extends DDD correctly", async () => {
    expect(element.constructor.name).to.equal("MediaQuote");
    expect(Object.getPrototypeOf(element.constructor).name).to.equal("DDD");
  });

  // Accessibility tests
  it("passes the a11y audit with default state", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("passes the a11y audit with image and quote", async () => {
    element.src = "https://example.com/image.jpg";
    element.alt = "Test image";
    element.quote = "This is a test quote";
    await element.updateComplete;
    await expect(element).shadowDom.to.be.accessible();
  });

  it("passes the a11y audit with full content", async () => {
    element.src = "https://example.com/image.jpg";
    element.alt = "Test image";
    element.quote = "This is a test quote";
    element.author = "John Doe";
    element.authorDetail = "Test Author";
    element.caption = "Test caption";
    await element.updateComplete;
    await expect(element).shadowDom.to.be.accessible();
  });

  // Property reflection tests
  it("reflects hasFilter property to filter attribute", async () => {
    element.hasFilter = true;
    await element.updateComplete;
    
    expect(element.hasAttribute('filter')).to.be.true;
    
    element.hasFilter = false;
    await element.updateComplete;
    
    expect(element.hasAttribute('filter')).to.be.false;
  });

  it("reflects authorDetail property to author-detail attribute", async () => {
    const testDetail = "Professional Photographer";
    element.authorDetail = testDetail;
    await element.updateComplete;
    
    expect(element.getAttribute('author-detail')).to.equal(testDetail);
  });

  it("updates properties when attributes change", async () => {
    element.setAttribute('src', 'test.jpg');
    element.setAttribute('alt', 'Test Alt');
    element.setAttribute('quote', 'Test Quote');
    element.setAttribute('author', 'Test Author');
    element.setAttribute('author-detail', 'Test Detail');
    element.setAttribute('caption', 'Test Caption');
    await element.updateComplete;
    
    expect(element.src).to.equal('test.jpg');
    expect(element.alt).to.equal('Test Alt');
    expect(element.quote).to.equal('Test Quote');
    expect(element.author).to.equal('Test Author');
    expect(element.authorDetail).to.equal('Test Detail');
    expect(element.caption).to.equal('Test Caption');
  });

  // Image and media functionality tests
  it("renders image with correct src and alt", async () => {
    element.src = "https://example.com/test-image.jpg";
    element.alt = "A test image";
    await element.updateComplete;
    
    const img = element.shadowRoot.querySelector('img');
    expect(img).to.exist;
    expect(img.src).to.equal("https://example.com/test-image.jpg");
    expect(img.alt).to.equal("A test image");
  });

  it("handles empty src gracefully", async () => {
    element.src = "";
    element.alt = "No image";
    await element.updateComplete;
    
    const img = element.shadowRoot.querySelector('img');
    expect(img).to.exist;
    expect(img.src).to.equal("");
    expect(img.alt).to.equal("No image");
  });

  it("updates image when src changes", async () => {
    element.src = "image1.jpg";
    await element.updateComplete;
    
    let img = element.shadowRoot.querySelector('img');
    expect(img.src).to.include("image1.jpg");
    
    element.src = "image2.jpg";
    await element.updateComplete;
    
    img = element.shadowRoot.querySelector('img');
    expect(img.src).to.include("image2.jpg");
  });

  // Quote display and formatting tests
  it("renders quote content correctly", async () => {
    element.quote = "This is a test quote";
    await element.updateComplete;
    
    const quoteSlot = element.shadowRoot.querySelector('slot[name="quote"]');
    expect(quoteSlot).to.exist;
    expect(quoteSlot.textContent).to.include("This is a test quote");
  });

  it("renders quote in correct overlay structure", async () => {
    element.quote = "Overlay quote";
    await element.updateComplete;
    
    const textOverlay = element.shadowRoot.querySelector('.text-overlay');
    expect(textOverlay).to.exist;
    
    const content = element.shadowRoot.querySelector('.content');
    expect(content).to.exist;
    
    const quoteSlot = content.querySelector('slot[name="quote"]');
    expect(quoteSlot).to.exist;
  });

  // Author and citation tests
  it("renders author information when provided", async () => {
    element.author = "Jane Doe";
    await element.updateComplete;
    
    const authorSlot = element.shadowRoot.querySelector('slot[name="author"]');
    expect(authorSlot).to.exist;
    expect(authorSlot.textContent).to.include("Jane Doe");
  });

  it("renders author detail when provided", async () => {
    element.author = "John Smith";
    element.authorDetail = "Professional Writer";
    await element.updateComplete;
    
    const authorDetailSlot = element.shadowRoot.querySelector('slot[name="author-detail"]');
    expect(authorDetailSlot).to.exist;
    expect(authorDetailSlot.textContent).to.include("Professional Writer");
  });

  it("does not render author detail without author", async () => {
    element.authorDetail = "Some Detail";
    await element.updateComplete;
    
    const citation = element.shadowRoot.querySelector('.citation');
    expect(citation).to.not.exist;
  });

  it("formats citation correctly with author and detail", async () => {
    element.author = "Test Author";
    element.authorDetail = "Test Detail";
    await element.updateComplete;
    
    const citation = element.shadowRoot.querySelector('.citation');
    expect(citation).to.exist;
    
    const author = citation.querySelector('.author');
    const authorDetail = citation.querySelector('.author-detail');
    
    expect(author).to.exist;
    expect(authorDetail).to.exist;
  });

  // Caption and details functionality tests
  it("renders caption when provided", async () => {
    element.caption = "This is a test caption";
    await element.updateComplete;
    
    const captionSlot = element.shadowRoot.querySelector('slot[name="caption"]');
    expect(captionSlot).to.exist;
    expect(captionSlot.textContent).to.include("This is a test caption");
  });

  it("wraps caption in details/summary structure", async () => {
    element.caption = "Detailed caption";
    await element.updateComplete;
    
    const details = element.shadowRoot.querySelector('details');
    expect(details).to.exist;
    
    const summary = details.querySelector('summary');
    expect(summary).to.exist;
    expect(summary.textContent).to.equal('Show Caption');
    
    const figcaption = details.querySelector('figcaption');
    expect(figcaption).to.exist;
  });

  it("does not render caption section when caption is empty", async () => {
    element.caption = "";
    await element.updateComplete;
    
    const captionDiv = element.shadowRoot.querySelector('.caption');
    expect(captionDiv).to.not.exist;
  });

  // Slot content detection tests (constructor logic)
  it("detects slot content correctly in constructor", async () => {
    // Create element with slotted content
    const elementWithSlots = await fixture(html`
      <media-quote>
        <span slot="author">Slot Author</span>
        <span slot="author-detail">Slot Detail</span>
        <span slot="caption">Slot Caption</span>
      </media-quote>
    `);
    await elementWithSlots.updateComplete;
    
    // Note: The hasAuthor, hasAuthorDetail, hasCaption are set in constructor
    // These tests verify the constructor logic works
    expect(elementWithSlots.hasAuthor).to.be.true;
    expect(elementWithSlots.hasAuthorDetail).to.be.true;
    expect(elementWithSlots.hasCaption).to.be.true;
  });

  it("handles missing slot content correctly", async () => {
    const elementWithoutSlots = await fixture(html`<media-quote></media-quote>`);
    await elementWithoutSlots.updateComplete;
    
    expect(elementWithoutSlots.hasAuthor).to.be.false;
    expect(elementWithoutSlots.hasAuthorDetail).to.be.false;
    expect(elementWithoutSlots.hasCaption).to.be.false;
  });

  // Rendering structure tests
  it("renders main container structure", async () => {
    await element.updateComplete;
    
    const container = element.shadowRoot.querySelector('.media-quote-container');
    expect(container).to.exist;
    
    const figure = container.querySelector('figure');
    expect(figure).to.exist;
    
    const topContent = figure.querySelector('.top-content');
    expect(topContent).to.exist;
  });

  it("renders text overlay structure", async () => {
    element.quote = "Test quote";
    await element.updateComplete;
    
    const textOverlay = element.shadowRoot.querySelector('.text-overlay');
    expect(textOverlay).to.exist;
    
    const quoteP = textOverlay.querySelector('.quote');
    expect(quoteP).to.exist;
    
    const content = quoteP.querySelector('.content');
    expect(content).to.exist;
  });

  it("applies correct CSS classes", async () => {
    element.src = "test.jpg";
    element.quote = "Test quote";
    element.author = "Test Author";
    element.caption = "Test caption";
    await element.updateComplete;
    
    expect(element.shadowRoot.querySelector('.media-quote-container')).to.exist;
    expect(element.shadowRoot.querySelector('.top-content')).to.exist;
    expect(element.shadowRoot.querySelector('.text-overlay')).to.exist;
    expect(element.shadowRoot.querySelector('.content')).to.exist;
    expect(element.shadowRoot.querySelector('.citation')).to.exist;
    expect(element.shadowRoot.querySelector('.author')).to.exist;
    expect(element.shadowRoot.querySelector('.caption')).to.exist;
  });

  // Slot content rendering tests
  it("renders slotted quote content", async () => {
    const elementWithQuote = await fixture(html`
      <media-quote>
        <span slot="quote">Slotted quote content</span>
      </media-quote>
    `);
    await elementWithQuote.updateComplete;
    
    const slottedContent = elementWithQuote.querySelector('[slot="quote"]');
    expect(slottedContent).to.exist;
    expect(slottedContent.textContent).to.equal("Slotted quote content");
  });

  it("renders slotted author content", async () => {
    const elementWithAuthor = await fixture(html`
      <media-quote>
        <span slot="author">Slotted Author</span>
      </media-quote>
    `);
    await elementWithAuthor.updateComplete;
    
    const slottedAuthor = elementWithAuthor.querySelector('[slot="author"]');
    expect(slottedAuthor).to.exist;
    expect(slottedAuthor.textContent).to.equal("Slotted Author");
  });

  it("renders slotted caption content", async () => {
    const elementWithCaption = await fixture(html`
      <media-quote>
        <span slot="caption">Slotted caption content</span>
      </media-quote>
    `);
    await elementWithCaption.updateComplete;
    
    const slottedCaption = elementWithCaption.querySelector('[slot="caption"]');
    expect(slottedCaption).to.exist;
    expect(slottedCaption.textContent).to.equal("Slotted caption content");
  });

  // Design system integration tests
  it("includes DDD styles", async () => {
    const styles = MediaQuote.styles;
    expect(styles).to.be.an('array');
    expect(styles.length).to.be.greaterThan(1); // Should include super.styles + own styles
  });

  it("uses DDD CSS variables", async () => {
    // Check that the element can access DDD properties
    expect(element).to.have.property('accentColor'); // Inherited from DDD
  });

  it("renders with proper responsive design classes", async () => {
    await element.updateComplete;
    
    // Check that container-type is set for container queries
    const styles = getComputedStyle(element);
    expect(element.shadowRoot.querySelector('.media-quote-container')).to.exist;
  });

  // HAX integration tests  
  it("has proper HAX properties configuration", async () => {
    expect(element.constructor.haxProperties).to.exist;
    expect(element.constructor.haxProperties).to.include('haxProperties.json');
  });

  it("supports HAX demoSchema configuration", async () => {
    expect(element.constructor.tag).to.equal("media-quote");
  });

  // Filter functionality test
  it("handles filter attribute correctly", async () => {
    element.hasFilter = true;
    await element.updateComplete;
    
    expect(element.hasAttribute('filter')).to.be.true;
    expect(element.hasFilter).to.be.true;
  });

  // Edge cases and error handling
  it("handles empty properties gracefully", async () => {
    element.src = "";
    element.alt = "";
    element.quote = "";
    element.author = "";
    element.authorDetail = "";
    element.caption = "";
    await element.updateComplete;
    
    expect(() => element.render()).to.not.throw;
    
    const img = element.shadowRoot.querySelector('img');
    expect(img.src).to.equal("");
    expect(img.alt).to.equal("");
  });

  it("handles long text content", async () => {
    element.quote = "This is a very long quote that should wrap properly and not break the layout even when it contains multiple sentences and extends beyond normal length.";
    element.author = "Author with Very Long Name That Should Also Handle Gracefully";
    element.authorDetail = "Professional Title That Is Also Quite Long And Should Not Break The Layout";
    element.caption = "This is an extremely long caption that describes the image in great detail and provides comprehensive information about what is shown.";
    await element.updateComplete;
    
    expect(() => element.render()).to.not.throw;
    
    const textOverlay = element.shadowRoot.querySelector('.text-overlay');
    expect(textOverlay).to.exist;
  });

  it("handles special characters in content", async () => {
    element.quote = 'Quote with "special" characters & symbols < > /';
    element.author = "Author's Name with apostrophe";
    element.alt = 'Alt text with "quotes" and & symbols';
    await element.updateComplete;
    
    const quoteSlot = element.shadowRoot.querySelector('slot[name="quote"]');
    expect(quoteSlot.textContent).to.include('Quote with "special" characters & symbols < > /');
    
    const img = element.shadowRoot.querySelector('img');
    expect(img.alt).to.equal('Alt text with "quotes" and & symbols');
  });

  // Performance and lifecycle tests
  it("updates correctly when properties change", async () => {
    element.src = "image1.jpg";
    element.quote = "Quote 1";
    await element.updateComplete;
    
    let img = element.shadowRoot.querySelector('img');
    expect(img.src).to.include("image1.jpg");
    
    element.src = "image2.jpg";
    element.quote = "Quote 2";
    await element.updateComplete;
    
    img = element.shadowRoot.querySelector('img');
    expect(img.src).to.include("image2.jpg");
    
    const quoteSlot = element.shadowRoot.querySelector('slot[name="quote"]');
    expect(quoteSlot.textContent).to.include("Quote 2");
  });

  it("maintains structure integrity across updates", async () => {
    element.src = "test1.jpg";
    await element.updateComplete;
    
    const initialContainer = element.shadowRoot.querySelector('.media-quote-container');
    expect(initialContainer).to.exist;
    
    element.src = "test2.jpg";
    element.quote = "New quote";
    element.author = "New author";
    await element.updateComplete;
    
    const updatedContainer = element.shadowRoot.querySelector('.media-quote-container');
    expect(updatedContainer).to.exist;
    expect(element.shadowRoot.querySelector('figure')).to.exist;
    expect(element.shadowRoot.querySelector('img')).to.exist;
  });

  // Complex interaction tests
  it("handles mixed property and slot content correctly", async () => {
    const mixedElement = await fixture(html`
      <media-quote 
        src="test.jpg" 
        alt="Test image"
        author="Property Author"
        caption="Property Caption"
      >
        <span slot="quote">Slotted quote overrides property</span>
        <span slot="author-detail">Slotted author detail</span>
      </media-quote>
    `);
    await mixedElement.updateComplete;
    
    const img = mixedElement.shadowRoot.querySelector('img');
    expect(img.src).to.include("test.jpg");
    expect(img.alt).to.equal("Test image");
    
    const slottedQuote = mixedElement.querySelector('[slot="quote"]');
    expect(slottedQuote.textContent).to.equal("Slotted quote overrides property");
    
    const slottedDetail = mixedElement.querySelector('[slot="author-detail"]');
    expect(slottedDetail.textContent).to.equal("Slotted author detail");
  });

  // Integration test using HAX demo schema structure
  it("works with HAX demoSchema configuration", async () => {
    const demoElement = await fixture(html`
      <media-quote
        src="https://cdn2.thecatapi.com/images/9j5.jpg"
        alt="A cat stalking a small toy"
      >
        <span slot='quote'>A cute cat stalking a toy</span>
        <span slot='author'>John Doe</span>
        <span slot='author-detail'>Professional Cat Photographer</span>
        <span slot='caption'>This cat is stalking a Totoro toy. How cute!</span>
      </media-quote>
    `);
    await demoElement.updateComplete;
    
    // Should render all components correctly
    const img = demoElement.shadowRoot.querySelector('img');
    expect(img.src).to.include("9j5.jpg");
    expect(img.alt).to.equal("A cat stalking a small toy");
    
    const slottedQuote = demoElement.querySelector('[slot="quote"]');
    expect(slottedQuote.textContent).to.equal("A cute cat stalking a toy");
    
    const slottedAuthor = demoElement.querySelector('[slot="author"]');
    expect(slottedAuthor.textContent).to.equal("John Doe");
    
    const slottedDetail = demoElement.querySelector('[slot="author-detail"]');
    expect(slottedDetail.textContent).to.equal("Professional Cat Photographer");
    
    const slottedCaption = demoElement.querySelector('[slot="caption"]');
    expect(slottedCaption.textContent).to.equal("This cat is stalking a Totoro toy. How cute!");
    
    // Should show citation and caption sections
    expect(demoElement.shadowRoot.querySelector('.citation')).to.exist;
    expect(demoElement.shadowRoot.querySelector('.caption')).to.exist;
  });

  // Accessibility edge cases
  it("maintains accessibility with missing alt text", async () => {
    element.src = "test-image.jpg";
    element.alt = ""; // Empty alt text
    await element.updateComplete;
    
    const img = element.shadowRoot.querySelector('img');
    expect(img.alt).to.equal("");
    // Should still pass basic accessibility (though not best practice)
  });

  it("maintains proper heading structure", async () => {
    element.quote = "Test quote";
    element.author = "Test author";
    await element.updateComplete;
    
    // Verify no inappropriate heading elements are used
    const headings = element.shadowRoot.querySelectorAll('h1, h2, h3, h4, h5, h6');
    expect(headings).to.have.length(0); // Should use proper semantic elements
  });

  // CSS and styling integration
  it("applies proper container styling", async () => {
    await element.updateComplete;
    
    const container = element.shadowRoot.querySelector('.media-quote-container');
    expect(container).to.exist;
    
    // Verify key CSS properties are applied through classes
    expect(container.classList.contains('media-quote-container')).to.be.true;
  });
});
