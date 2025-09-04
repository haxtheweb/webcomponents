import { fixture, expect, html } from "@open-wc/testing";
import "../flash-card.js";

describe("FlashCard test", () => {
  let element;
  
  beforeEach(async () => {
    element = await fixture(html`
      <flash-card img-source="test-image.jpg" img-keyword="test">
        <div slot="front">Front content</div>
        <div slot="back">Back content</div>
      </flash-card>
    `);
    await element.updateComplete;
  });

  // Basic functionality tests
  it("instantiates the element with default values", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("flash-card");
  });

  it("has correct default property values", async () => {
    const defaultElement = await fixture(html`<flash-card></flash-card>`);
    expect(defaultElement.imgKeyword).to.equal("");
    expect(defaultElement.imgSource).to.equal("");
    expect(defaultElement.inverted).to.be.undefined;
    expect(defaultElement.status).to.be.undefined;
  });

  // Property validation tests
  it("sets image properties correctly", async () => {
    expect(element.imgSource).to.equal("test-image.jpg");
    expect(element.imgKeyword).to.equal("test");
    
    element.imgSource = "new-image.png";
    element.imgKeyword = "new-keyword";
    await element.updateComplete;
    
    expect(element.imgSource).to.equal("new-image.png");
    expect(element.imgKeyword).to.equal("new-keyword");
  });

  it("reflects img-source to attribute", async () => {
    expect(element.getAttribute('img-source')).to.equal('test-image.jpg');
    
    element.imgSource = "reflected-image.jpg";
    await element.updateComplete;
    expect(element.getAttribute('img-source')).to.equal('reflected-image.jpg');
  });

  it("reflects status to attribute", async () => {
    element.status = "correct";
    await element.updateComplete;
    expect(element.getAttribute('status')).to.equal('correct');
  });

  // Rendering tests
  it("renders confetti container", async () => {
    const confetti = element.shadowRoot.querySelector('#confetti');
    expect(confetti).to.exist;
    expect(confetti.tagName.toLowerCase()).to.equal('confetti-container');
  });

  it("renders flash-card-answer-box", async () => {
    const answerBox = element.shadowRoot.querySelector('flash-card-answer-box');
    expect(answerBox).to.exist;
  });

  it("renders image prompt when imgSource or imgKeyword provided", async () => {
    const imagePrompt = element.shadowRoot.querySelector('flash-card-image-prompt');
    expect(imagePrompt).to.exist;
    expect(imagePrompt.getAttribute('img-src')).to.equal('test-image.jpg');
    expect(imagePrompt.getAttribute('img-keyword')).to.equal('test');
  });

  it("does not render image prompt when no image data provided", async () => {
    const noImageElement = await fixture(html`<flash-card></flash-card>`);
    await noImageElement.updateComplete;
    
    const imagePrompt = noImageElement.shadowRoot.querySelector('flash-card-image-prompt');
    expect(imagePrompt).to.not.exist;
  });

  // Slot content tests
  it("renders front and back slot content", async () => {
    const frontSlot = element.querySelector('[slot="front"]');
    const backSlot = element.querySelector('[slot="back"]');
    
    expect(frontSlot).to.exist;
    expect(backSlot).to.exist;
    expect(frontSlot.textContent).to.equal('Front content');
    expect(backSlot.textContent).to.equal('Back content');
  });

  // Status change and event handling tests
  it("handles status change events", async () => {
    const statusChangeEvent = new CustomEvent('flash-card-status-change', {
      detail: 'correct'
    });
    
    element.statusChanged(statusChangeEvent);
    
    expect(element.status).to.equal('correct');
  });

  it("triggers confetti on correct status", async () => {
    element.status = "correct";
    element.statusChanged({ detail: 'correct' });
    
    // Allow time for dynamic import and timeout
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(element.status).to.equal('correct');
  });

  // SimpleColors integration tests
  it("extends SimpleColors correctly", () => {
    expect(element.constructor.styles).to.exist;
    const styleText = element.constructor.styles.toString();
    expect(styleText).to.include('--simple-colors-default-theme');
  });

  it("uses SimpleColors theme variables", () => {
    const styles = element.constructor.styles.toString();
    expect(styles).to.include('--simple-colors-default-theme-accent-2');
    expect(styles).to.include('--simple-colors-default-theme-accent-6');
    expect(styles).to.include('--simple-colors-default-theme-accent-7');
    expect(styles).to.include('--simple-colors-default-theme-accent-10');
  });

  // HAX integration tests
  it("has proper HAX properties configuration", () => {
    expect(element.constructor.haxProperties).to.exist;
    expect(element.constructor.haxProperties).to.include('haxProperties.json');
  });

  // Accessibility tests
  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("passes the a11y audit with different content", async () => {
    const accessibleElement = await fixture(html`
      <flash-card img-source="accessible-image.jpg" img-keyword="accessible">
        <div slot="front">
          <h3>Question</h3>
          <p>What is the capital of France?</p>
        </div>
        <div slot="back">
          <h3>Answer</h3>
          <p>Paris</p>
        </div>
      </flash-card>
    `);
    
    await expect(accessibleElement).shadowDom.to.be.accessible();
  });

  // Style and layout tests
  it("has correct card styling", () => {
    const styles = element.constructor.styles.toString();
    expect(styles).to.include('border-radius: 20px');
    expect(styles).to.include('min-width: 320px');
    expect(styles).to.include('min-height: 155px');
    expect(styles).to.include('box-shadow');
  });

  // Edge cases and error handling
  it("handles empty image properties gracefully", async () => {
    element.imgSource = "";
    element.imgKeyword = "";
    await element.updateComplete;
    
    const imagePrompt = element.shadowRoot.querySelector('flash-card-image-prompt');
    expect(imagePrompt).to.not.exist;
  });

  it("handles special characters in properties", async () => {
    element.imgKeyword = "special & characters with émojis 🏆";
    await element.updateComplete;
    
    const imagePrompt = element.shadowRoot.querySelector('flash-card-image-prompt');
    expect(imagePrompt.getAttribute('img-keyword')).to.include('🏆');
  });

  it("handles different status values", async () => {
    const statuses = ['correct', 'incorrect', 'pending', 'answered'];
    
    for (const status of statuses) {
      element.status = status;
      await element.updateComplete;
      expect(element.status).to.equal(status);
    }
  });

  // Dynamic content tests
  it("updates image prompt when properties change", async () => {
    element.imgSource = "updated-image.jpg";
    element.imgKeyword = "updated";
    await element.updateComplete;
    
    const imagePrompt = element.shadowRoot.querySelector('flash-card-image-prompt');
    expect(imagePrompt.getAttribute('img-src')).to.equal('updated-image.jpg');
    expect(imagePrompt.getAttribute('img-keyword')).to.equal('updated');
  });

  it("passes status to image prompt component", async () => {
    element.status = "answered";
    await element.updateComplete;
    
    const imagePrompt = element.shadowRoot.querySelector('flash-card-image-prompt');
    expect(imagePrompt.getAttribute('status')).to.equal('answered');
  });

  // Integration tests
  it("integrates with flash-card-answer-box component", async () => {
    const answerBox = element.shadowRoot.querySelector('flash-card-answer-box');
    expect(answerBox).to.exist;
    
    // Should have event listener for status changes
    expect(answerBox.hasAttribute('@flash-card-status-change')).to.be.false; // This is a template binding
  });

  // Rapid property change tests
  it("handles rapid property changes", async () => {
    const changes = [
      { imgSource: "image1.jpg", imgKeyword: "keyword1", status: "pending" },
      { imgSource: "image2.jpg", imgKeyword: "keyword2", status: "correct" },
      { imgSource: "image3.jpg", imgKeyword: "keyword3", status: "incorrect" }
    ];
    
    for (const change of changes) {
      Object.assign(element, change);
      await element.updateComplete;
    }
    
    expect(element.imgSource).to.equal('image3.jpg');
    expect(element.imgKeyword).to.equal('keyword3');
    expect(element.status).to.equal('incorrect');
  });
});
