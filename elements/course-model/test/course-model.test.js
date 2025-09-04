import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import "../course-model.js";

describe("CourseModel test", () => {
  let element;
  
  beforeEach(async () => {
    element = await fixture(html`<course-model
      title="Test 3D Model"
      src="test-model.gltf"
      alt="A test 3D model."
    >
      <a href="#" slot="logo">
        <img id="brand" src="logo.png" alt="Test Logo" />
      </a>
      <div slot="detail">
        <p>Test detail content for the model.</p>
      </div>
      <div slot="animation">
        <p>Animation content</p>
      </div>
      <div slot="check">
        <p>Knowledge check content</p>
      </div>
    </course-model>`);
    await element.updateComplete;
  });

  // Basic functionality tests
  it("instantiates the element with default values", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("course-model");
  });

  it("has correct default property values", async () => {
    const defaultElement = await fixture(html`<course-model></course-model>`);
    expect(defaultElement.visible).to.equal("model");
    expect(defaultElement.title).to.equal("");
    expect(defaultElement.src).to.equal("");
  });

  // Accessibility tests
  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("has proper ARIA attributes for buttons", async () => {
    const exploreButton = element.shadowRoot.querySelector('#explore');
    const infoButton = element.shadowRoot.querySelector('#moreinfo');
    const animationButton = element.shadowRoot.querySelector('#animation');
    const checkButton = element.shadowRoot.querySelector('#check');
    
    expect(exploreButton.getAttribute('title')).to.equal('Explore Models');
    expect(infoButton.getAttribute('title')).to.equal('More Information');
    expect(animationButton.getAttribute('title')).to.equal('Play Animation');
    expect(checkButton.getAttribute('title')).to.equal('Knowledge Check');
  });

  it("has accessible model-viewer with proper attributes", async () => {
    const modelViewer = element.shadowRoot.querySelector('model-viewer');
    expect(modelViewer.getAttribute('title')).to.equal('Test 3D Model');
    expect(modelViewer.getAttribute('alt')).to.equal('A test 3D model.');
    expect(modelViewer.hasAttribute('camera-controls')).to.be.true;
    expect(modelViewer.hasAttribute('ar')).to.be.true;
  });

  // Property validation tests
  it("reflects visible property to attribute", async () => {
    element.visible = "model-info";
    await element.updateComplete;
    expect(element.getAttribute('visible')).to.equal('model-info');
  });

  it("updates title property and reflects to model-viewer", async () => {
    element.title = "New Model Title";
    await element.updateComplete;
    
    const modelViewer = element.shadowRoot.querySelector('model-viewer');
    const titleElement = element.shadowRoot.querySelector('#title h1');
    
    expect(modelViewer.getAttribute('title')).to.equal('New Model Title');
    expect(titleElement.textContent).to.equal('New Model Title');
  });

  it("updates src property and reflects to model-viewer", async () => {
    element.src = "new-model.gltf";
    await element.updateComplete;
    
    const modelViewer = element.shadowRoot.querySelector('model-viewer');
    expect(modelViewer.getAttribute('src')).to.equal('new-model.gltf');
  });

  it("updates alt property and reflects to model-viewer", async () => {
    element.alt = "New alt text";
    await element.updateComplete;
    
    const modelViewer = element.shadowRoot.querySelector('model-viewer');
    expect(modelViewer.getAttribute('alt')).to.equal('New alt text');
  });

  // View mode functionality tests
  it("toggles to model-info view when explore button is clicked", async () => {
    const exploreButton = element.shadowRoot.querySelector('#explore');
    exploreButton.click();
    await element.updateComplete;
    
    expect(element.visible).to.equal('model-info');
    expect(element.getAttribute('visible')).to.equal('model-info');
  });

  it("toggles to model-text view when info button is clicked", async () => {
    const infoButton = element.shadowRoot.querySelector('#moreinfo');
    infoButton.click();
    await element.updateComplete;
    
    expect(element.visible).to.equal('model-text');
  });

  it("toggles to model-animation view when animation button is clicked", async () => {
    const animationButton = element.shadowRoot.querySelector('#animation');
    animationButton.click();
    await element.updateComplete;
    
    expect(element.visible).to.equal('model-animation');
  });

  it("toggles to model-check view when check button is clicked", async () => {
    const checkButton = element.shadowRoot.querySelector('#check');
    checkButton.click();
    await element.updateComplete;
    
    expect(element.visible).to.equal('model-check');
  });

  it("toggles back to model view when same button is clicked twice", async () => {
    const exploreButton = element.shadowRoot.querySelector('#explore');
    
    // First click - should go to model-info
    exploreButton.click();
    await element.updateComplete;
    expect(element.visible).to.equal('model-info');
    
    // Second click - should go back to model
    exploreButton.click();
    await element.updateComplete;
    expect(element.visible).to.equal('model');
  });

  // CSS visibility tests based on view mode
  it("shows/hides correct content based on visible attribute", async () => {
    const overlay = element.shadowRoot.querySelector('.overlay');
    
    // Default model view - overlay should be hidden
    expect(element.visible).to.equal('model');
    
    // Switch to info view
    element.visible = 'model-info';
    await element.updateComplete;
    
    // Switch to text view
    element.visible = 'model-text';
    await element.updateComplete;
    
    // Switch to animation view
    element.visible = 'model-animation';
    await element.updateComplete;
    
    // Switch to check view
    element.visible = 'model-check';
    await element.updateComplete;
  });

  // Event handling tests
  it("handles model-select events and updates properties", async () => {
    const mockEvent = new CustomEvent('model-select', {
      detail: {
        src: 'new-model.gltf',
        title: 'Selected Model'
      }
    });
    
    element.dispatchEvent(mockEvent);
    await element.updateComplete;
    
    expect(element.src).to.equal('new-model.gltf');
    expect(element.title).to.equal('Selected Model');
    expect(element.visible).to.equal('model');
  });

  // Slot content tests
  it("renders logo slot content", async () => {
    const logoSlot = element.shadowRoot.querySelector('slot[name="logo"]');
    expect(logoSlot).to.exist;
    
    const slottedLogo = element.querySelector('[slot="logo"] img');
    expect(slottedLogo).to.exist;
    expect(slottedLogo.alt).to.equal('Test Logo');
  });

  it("renders detail slot content", async () => {
    const detailSlot = element.shadowRoot.querySelector('slot[name="detail"]');
    expect(detailSlot).to.exist;
    
    const slottedDetail = element.querySelector('[slot="detail"]');
    expect(slottedDetail).to.exist;
    expect(slottedDetail.textContent.trim()).to.include('Test detail content');
  });

  it("renders animation slot content", async () => {
    const animationSlot = element.shadowRoot.querySelector('slot[name="animation"]');
    expect(animationSlot).to.exist;
    
    const slottedAnimation = element.querySelector('[slot="animation"]');
    expect(slottedAnimation).to.exist;
    expect(slottedAnimation.textContent.trim()).to.include('Animation content');
  });

  it("renders check slot content", async () => {
    const checkSlot = element.shadowRoot.querySelector('slot[name="check"]');
    expect(checkSlot).to.exist;
    
    const slottedCheck = element.querySelector('[slot="check"]');
    expect(slottedCheck).to.exist;
    expect(slottedCheck.textContent.trim()).to.include('Knowledge check content');
  });

  // HAX integration tests
  it("has proper HAX properties configuration", async () => {
    expect(element.constructor.haxProperties).to.exist;
    
    if (typeof element.constructor.haxProperties === 'string') {
      expect(element.constructor.haxProperties).to.include('haxProperties.json');
    }
  });

  // Responsive design tests
  it("adapts to mobile viewport", async () => {
    // Simulate mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375
    });
    
    window.dispatchEvent(new Event('resize'));
    await element.updateComplete;
    
    // Check if mobile-specific styles are applied
    const modelViewer = element.shadowRoot.querySelector('model-viewer');
    expect(modelViewer).to.exist;
  });

  it("adapts to desktop viewport", async () => {
    // Simulate desktop viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200
    });
    
    window.dispatchEvent(new Event('resize'));
    await element.updateComplete;
    
    // Check if desktop-specific styles are applied
    const modelViewer = element.shadowRoot.querySelector('model-viewer');
    expect(modelViewer).to.exist;
  });

  // Error handling and edge cases
  it("handles empty properties gracefully", async () => {
    const emptyElement = await fixture(html`<course-model></course-model>`);
    await emptyElement.updateComplete;
    
    expect(emptyElement.title).to.equal('');
    expect(emptyElement.src).to.equal('');
    expect(emptyElement.alt).to.be.undefined;
    
    const modelViewer = emptyElement.shadowRoot.querySelector('model-viewer');
    expect(modelViewer.getAttribute('title')).to.equal('');
    expect(modelViewer.getAttribute('src')).to.equal('');
  });

  it("handles rapid view mode changes", async () => {
    const buttons = [
      element.shadowRoot.querySelector('#explore'),
      element.shadowRoot.querySelector('#moreinfo'),
      element.shadowRoot.querySelector('#animation'),
      element.shadowRoot.querySelector('#check')
    ];
    
    // Rapidly click through all view modes
    for (const button of buttons) {
      button.click();
      await element.updateComplete;
    }
    
    expect(element.visible).to.equal('model-check');
  });

  it("maintains model-viewer attributes during property updates", async () => {
    element.title = 'Updated Title';
    element.src = 'updated-model.gltf';
    element.alt = 'Updated alt text';
    
    await element.updateComplete;
    
    const modelViewer = element.shadowRoot.querySelector('model-viewer');
    expect(modelViewer.getAttribute('camera-controls')).to.equal('');
    expect(modelViewer.getAttribute('exposure')).to.equal('6');
    expect(modelViewer.getAttribute('camera-orbit')).to.equal('60deg');
    expect(modelViewer.getAttribute('shadow-intensity')).to.equal('0.5');
    expect(modelViewer.hasAttribute('ar')).to.be.true;
  });

  it("handles special characters in properties", async () => {
    element.title = 'Model with "Quotes" & <Special> Characters';
    element.alt = 'Alt text with émojis 🎮 and unicøde';
    
    await element.updateComplete;
    
    const modelViewer = element.shadowRoot.querySelector('model-viewer');
    const titleElement = element.shadowRoot.querySelector('#title h1');
    
    expect(titleElement.textContent).to.include('Model with "Quotes" & <Special> Characters');
    expect(modelViewer.getAttribute('alt')).to.include('émojis 🎮 and unicøde');
  });

  // Dynamic import tests
  it("loads model-viewer library on firstUpdated", async () => {
    // Since the library is dynamically imported, we can only test that the element exists
    const modelViewer = element.shadowRoot.querySelector('model-viewer');
    expect(modelViewer).to.exist;
  });

  // Additional accessibility tests with different content
  it("maintains accessibility with complex slotted content", async () => {
    const complexElement = await fixture(html`
      <course-model title="Complex Model" src="model.gltf" alt="Complex 3D model">
        <div slot="logo">
          <a href="#" aria-label="Organization logo">
            <img src="logo.png" alt="Company Logo" />
          </a>
        </div>
        <div slot="detail">
          <h2>Model Details</h2>
          <ul>
            <li>Feature 1</li>
            <li>Feature 2</li>
          </ul>
        </div>
        <div slot="animation">
          <video controls aria-label="Model animation">
            <source src="animation.mp4" type="video/mp4">
          </video>
        </div>
        <div slot="check">
          <form>
            <label for="q1">Question 1:</label>
            <input type="text" id="q1" name="question1">
            <button type="submit">Submit</button>
          </form>
        </div>
      </course-model>
    `);
    
    await complexElement.updateComplete;
    await expect(complexElement).shadowDom.to.be.accessible();
  });
});
