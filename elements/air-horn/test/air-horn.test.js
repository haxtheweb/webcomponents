import { fixture, expect, html } from "@open-wc/testing";
import "../air-horn.js";

describe("air-horn test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <air-horn title="test-title">
        <button>🎺 Air Horn</button>
      </air-horn>
    `);
  });

  it("basic setup", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("air-horn");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Component structure and rendering", () => {
    it("should have correct tag name", () => {
      expect(element.constructor.tag).to.equal("air-horn");
      expect(element.tag).to.equal("air-horn");
    });

    it("should render with shadow DOM", () => {
      expect(element.shadowRoot).to.exist;
      expect(element.shadowRoot.mode).to.equal("open");
    });

    it("should have template element", () => {
      expect(element.template).to.exist;
      expect(element.template.tagName).to.equal("TEMPLATE");
    });

    it("should render slot for content", () => {
      const slot = element.shadowRoot.querySelector('slot');
      expect(slot).to.exist;
    });

    it("should have proper CSS styles", () => {
      const style = element.shadowRoot.querySelector('style');
      expect(style).to.exist;
      
      const styleContent = style.textContent;
      expect(styleContent).to.include(':host');
      expect(styleContent).to.include('display: inline-flex');
      expect(styleContent).to.include(':host([hidden])');
      expect(styleContent).to.include('display: none');
    });
  });

  describe("Slot functionality", () => {
    it("should display slotted content", () => {
      const slot = element.shadowRoot.querySelector('slot');
      expect(slot).to.exist;
      
      const slottedButton = element.querySelector('button');
      expect(slottedButton).to.exist;
      expect(slottedButton.textContent).to.include('Air Horn');
    });

    it("should remain accessible with various slotted content", async () => {
      const testElement = await fixture(html`
        <air-horn>
          <div role="button" tabindex="0">Click for Sound</div>
        </air-horn>
      `);
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should work with complex slotted content", async () => {
      const testElement = await fixture(html`
        <air-horn>
          <button type="button" aria-label="Play air horn sound">
            <span>🎺</span>
            <span>Air Horn</span>
          </button>
        </air-horn>
      `);
      
      const slottedButton = testElement.querySelector('button');
      expect(slottedButton.getAttribute('aria-label')).to.equal('Play air horn sound');
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Audio functionality and interaction", () => {
    let originalAudio;
    let mockAudio;
    
    beforeEach(() => {
      // Mock Audio constructor
      originalAudio = globalThis.Audio;
      mockAudio = {
        play: () => Promise.resolve(),
        pause: () => {},
        volume: 1,
        currentTime: 0,
        duration: 0,
        paused: true
      };
      globalThis.Audio = function(src) {
        Object.assign(this, mockAudio);
        this.src = src;
        return this;
      };
    });
    
    afterEach(() => {
      globalThis.Audio = originalAudio;
    });

    it("should have click event listener attached", (done) => {
      const testElement = new (element.constructor)();
      
      // Wait for the setTimeout in constructor to complete
      setTimeout(() => {
        expect(testElement._playSound).to.be.a('function');
        done();
      }, 10);
    });

    it("should play sound when clicked", (done) => {
      let playCallCount = 0;
      mockAudio.play = () => {
        playCallCount++;
        return Promise.resolve();
      };
      
      // Wait for event listener to be attached
      setTimeout(() => {
        element.click();
        
        // Check if play was called
        setTimeout(() => {
          expect(playCallCount).to.be.greaterThan(0);
          done();
        }, 10);
      }, 10);
    });

    it("should create Audio object with correct source", (done) => {
      let capturedSrc = null;
      globalThis.Audio = function(src) {
        capturedSrc = src;
        Object.assign(this, mockAudio);
        this.src = src;
        return this;
      };
      
      setTimeout(() => {
        element.click();
        
        setTimeout(() => {
          expect(capturedSrc).to.be.a('string');
          expect(capturedSrc).to.include('airhorn.mp3');
          done();
        }, 10);
      }, 10);
    });

    it("should handle multiple rapid clicks", (done) => {
      let playCallCount = 0;
      mockAudio.play = () => {
        playCallCount++;
        return Promise.resolve();
      };
      
      setTimeout(() => {
        element.click();
        element.click();
        element.click();
        
        setTimeout(() => {
          expect(playCallCount).to.equal(3);
          done();
        }, 10);
      }, 10);
    });
  });

  describe("Accessibility scenarios", () => {
    it("should remain accessible when hidden", async () => {
      const testElement = await fixture(html`
        <air-horn hidden>
          <button>Hidden Air Horn</button>
        </air-horn>
      `);
      
      expect(testElement.hasAttribute('hidden')).to.be.true;
      // Hidden elements should not be tested for accessibility as they're not visible
      expect(testElement.shadowRoot.querySelector('style').textContent).to.include('display: none');
    });

    it("should work with keyboard activation on slotted buttons", async () => {
      const testElement = await fixture(html`
        <air-horn>
          <button type="button">Keyboard Accessible Horn</button>
        </air-horn>
      `);
      
      const button = testElement.querySelector('button');
      expect(button.tabIndex).to.equal(0); // Default focusable
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with ARIA attributes", async () => {
      const testElement = await fixture(html`
        <air-horn>
          <button 
            type="button" 
            aria-label="Play air horn sound effect"
            aria-describedby="horn-description"
          >
            🎺 Sound
          </button>
          <div id="horn-description" class="sr-only">Plays a loud air horn sound</div>
        </air-horn>
      `);
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should work with custom elements as slotted content", async () => {
      const testElement = await fixture(html`
        <air-horn>
          <div role="button" tabindex="0" aria-label="Custom air horn trigger">
            Custom Horn Button
          </div>
        </air-horn>
      `);
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Constructor and lifecycle", () => {
    it("should initialize with default constructor", () => {
      const testElement = new (element.constructor)();
      expect(testElement.tag).to.equal('air-horn');
      expect(testElement.template).to.exist;
      expect(testElement.shadowRoot).to.exist;
    });

    it("should support delayed rendering", () => {
      const testElement = new (element.constructor)(true);
      expect(testElement.shadowRoot.innerHTML).to.equal('');
      
      testElement.render();
      expect(testElement.shadowRoot.innerHTML).to.not.equal('');
    });

    it("should render HTML correctly", () => {
      const testElement = new (element.constructor)();
      expect(testElement.html).to.include('<style>');
      expect(testElement.html).to.include(':host');
      expect(testElement.html).to.include('<slot></slot>');
    });

    it("should handle multiple render calls", () => {
      const testElement = new (element.constructor)();
      const initialHTML = testElement.shadowRoot.innerHTML;
      
      testElement.render();
      testElement.render();
      
      expect(testElement.shadowRoot.innerHTML).to.equal(initialHTML);
    });
  });

  describe("Cross-browser compatibility", () => {
    it("should handle ShadyCSS when available", () => {
      const originalShadyCSS = globalThis.ShadyCSS;
      let prepareTemplateCalled = false;
      
      globalThis.ShadyCSS = {
        prepareTemplate: (template, tag) => {
          prepareTemplateCalled = true;
          expect(template).to.exist;
          expect(tag).to.equal('air-horn');
        }
      };
      
      const testElement = new (element.constructor)();
      expect(prepareTemplateCalled).to.be.true;
      
      globalThis.ShadyCSS = originalShadyCSS;
    });

    it("should work without ShadyCSS", () => {
      const originalShadyCSS = globalThis.ShadyCSS;
      globalThis.ShadyCSS = undefined;
      
      expect(() => {
        new (element.constructor)();
      }).to.not.throw();
      
      globalThis.ShadyCSS = originalShadyCSS;
    });
  });

  describe("Edge cases and error handling", () => {
    it("should remain accessible with no slotted content", async () => {
      const testElement = await fixture(html`
        <air-horn></air-horn>
      `);
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle empty slotted content", async () => {
      const testElement = await fixture(html`
        <air-horn>   </air-horn>
      `);
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should work with text-only slotted content", async () => {
      const testElement = await fixture(html`
        <air-horn>Click me for sound!</air-horn>
      `);
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle Audio constructor errors gracefully", (done) => {
      const originalAudio = globalThis.Audio;
      globalThis.Audio = function() {
        throw new Error('Audio not supported');
      };
      
      setTimeout(() => {
        expect(() => {
          element.click();
        }).to.not.throw();
        
        globalThis.Audio = originalAudio;
        done();
      }, 10);
    });

    it("should handle audio play failures gracefully", (done) => {
      const originalAudio = globalThis.Audio;
      globalThis.Audio = function(src) {
        this.src = src;
        this.play = () => Promise.reject(new Error('Play failed'));
        return this;
      };
      
      setTimeout(() => {
        expect(() => {
          element.click();
        }).to.not.throw();
        
        globalThis.Audio = originalAudio;
        done();
      }, 10);
    });

    it("should work with unusual slotted content", async () => {
      const unusualContent = [
        "🎺🎺🎺",
        "<script>alert('test')</script>", // Should be escaped/safe
        "Very long button text that might cause layout issues or other problems",
        "Multi\nline\ntext",
        "Text with 'quotes' and \"double quotes\""
      ];
      
      for (const content of unusualContent) {
        const testElement = await fixture(html`
          <air-horn><button>${content}</button></air-horn>
        `);
        await expect(testElement).shadowDom.to.be.accessible();
      }
    });
  });

  describe("Performance considerations", () => {
    it("should only attach event listener after timeout", (done) => {
      let listenerAttached = false;
      const originalAddEventListener = element.addEventListener;
      element.addEventListener = (...args) => {
        if (args[0] === 'click') {
          listenerAttached = true;
        }
        return originalAddEventListener.apply(element, args);
      };
      
      // Should not be attached immediately
      expect(listenerAttached).to.be.false;
      
      // Should be attached after timeout
      setTimeout(() => {
        expect(listenerAttached).to.be.true;
        done();
      }, 10);
    });

    it("should create new Audio instance for each click", (done) => {
      let audioInstanceCount = 0;
      const originalAudio = globalThis.Audio;
      globalThis.Audio = function(src) {
        audioInstanceCount++;
        this.src = src;
        this.play = () => Promise.resolve();
        return this;
      };
      
      setTimeout(() => {
        element.click();
        element.click();
        
        setTimeout(() => {
          expect(audioInstanceCount).to.equal(2);
          globalThis.Audio = originalAudio;
          done();
        }, 10);
      }, 10);
    });
  });

  describe("File path resolution", () => {
    it("should resolve audio file path correctly", (done) => {
      let capturedSrc = null;
      const originalAudio = globalThis.Audio;
      globalThis.Audio = function(src) {
        capturedSrc = src;
        this.src = src;
        this.play = () => Promise.resolve();
        return this;
      };
      
      setTimeout(() => {
        element.click();
        
        setTimeout(() => {
          expect(capturedSrc).to.be.a('string');
          expect(capturedSrc).to.include('/lib/airhorn.mp3');
          // Should be a full URL
          expect(capturedSrc).to.match(/^https?:\/\/|^file:\/\/|^\//); 
          globalThis.Audio = originalAudio;
          done();
        }, 10);
      }, 10);
    });
  });
});
