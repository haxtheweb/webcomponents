import { fixture, expect, html } from "@open-wc/testing";
import "../awesome-explosion.js";

describe("awesome-explosion test", () => {
  let element;
  let originalAudio;
  
  beforeEach(async () => {
    // Mock global audio to prevent actual sound playback during tests
    originalAudio = globalThis.audio;
    globalThis.audio = {
      play: () => Promise.resolve(),
      pause: () => {},
      currentTime: 0
    };
    
    element = await fixture(html`
      <awesome-explosion 
        size="medium" 
        color="blue" 
        title="test-explosion"
      ></awesome-explosion>
    `);
    await element.updateComplete;
  });
  
  afterEach(() => {
    // Restore original global audio
    globalThis.audio = originalAudio;
  });

  it("basic setup", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("awesome-explosion");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Component structure and properties", () => {
    it("should have correct tag name", () => {
      expect(element.constructor.tag).to.equal("awesome-explosion");
    });

    it("should initialize with default properties", () => {
      expect(element.state).to.equal("stop");
      expect(element.size).to.equal("medium");
      expect(element.color).to.equal("blue");
      expect(element.resetSound).to.equal(false);
    });

    it("should have default image and sound URLs", () => {
      expect(element.image).to.be.a('string');
      expect(element.image).to.include('explode.gif');
      expect(element.sound).to.be.a('string');
      expect(element.sound).to.include('.mp3');
    });
  });

  describe("Property validation with accessibility", () => {
    let testElement;

    beforeEach(async () => {
      testElement = await fixture(html`
        <awesome-explosion></awesome-explosion>
      `);
      await testElement.updateComplete;
    });

    describe("Size property", () => {
      it("should handle all valid size values and maintain accessibility", async () => {
        const validSizes = ['tiny', 'small', 'medium', 'large', 'epic'];
        
        for (const size of validSizes) {
          testElement.size = size;
          await testElement.updateComplete;
          expect(testElement.size).to.equal(size);
          expect(testElement.hasAttribute('size')).to.be.true;
          expect(testElement.getAttribute('size')).to.equal(size);
          await expect(testElement).shadowDom.to.be.accessible();
        }
      });

      it("should have correct default size", () => {
        expect(testElement.size).to.equal("medium");
      });
    });

    describe("Color property", () => {
      it("should handle all valid color values and maintain accessibility", async () => {
        const validColors = ['red', 'purple', 'blue', 'orange', 'yellow', ''];
        
        for (const color of validColors) {
          testElement.color = color;
          await testElement.updateComplete;
          expect(testElement.color).to.equal(color);
          if (color) {
            expect(testElement.hasAttribute('color')).to.be.true;
            expect(testElement.getAttribute('color')).to.equal(color);
          }
          await expect(testElement).shadowDom.to.be.accessible();
        }
      });

      it("should have correct default color", () => {
        expect(testElement.color).to.equal("");
      });
    });

    describe("State property", () => {
      it("should handle all valid state values and maintain accessibility", async () => {
        const validStates = ['play', 'pause', 'stop'];
        
        for (const state of validStates) {
          testElement.state = state;
          await testElement.updateComplete;
          expect(testElement.state).to.equal(state);
          expect(testElement.hasAttribute('state')).to.be.true;
          expect(testElement.getAttribute('state')).to.equal(state);
          await expect(testElement).shadowDom.to.be.accessible();
        }
      });

      it("should have correct default state", () => {
        expect(testElement.state).to.equal("stop");
      });
    });

    describe("Boolean properties", () => {
      it("should handle resetSound property", async () => {
        testElement.resetSound = true;
        await testElement.updateComplete;
        expect(testElement.resetSound).to.equal(true);
        expect(testElement.hasAttribute('reset-sound')).to.be.true;
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.resetSound = false;
        await testElement.updateComplete;
        expect(testElement.resetSound).to.equal(false);
        expect(testElement.hasAttribute('reset-sound')).to.be.false;
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle computed boolean properties", async () => {
        // Test stopped state
        testElement.state = 'stop';
        await testElement.updateComplete;
        expect(testElement.stopped).to.be.true;
        expect(testElement.playing).to.be.false;
        expect(testElement.paused).to.be.false;

        // Test playing state
        testElement.state = 'play';
        await testElement.updateComplete;
        expect(testElement.stopped).to.be.false;
        expect(testElement.playing).to.be.true;
        expect(testElement.paused).to.be.false;

        // Test paused state
        testElement.state = 'pause';
        await testElement.updateComplete;
        expect(testElement.stopped).to.be.false;
        expect(testElement.playing).to.be.false;
        expect(testElement.paused).to.be.true;

        await expect(testElement).shadowDom.to.be.accessible();
      });
    });

    describe("Media source properties", () => {
      it("should handle custom image property", async () => {
        testElement.image = "https://example.com/custom-explosion.gif";
        await testElement.updateComplete;
        expect(testElement.image).to.equal("https://example.com/custom-explosion.gif");
        
        const img = testElement.shadowRoot.querySelector('#image');
        expect(img.src).to.equal("https://example.com/custom-explosion.gif");
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle custom sound property", async () => {
        testElement.sound = "https://example.com/custom-explosion.mp3";
        await testElement.updateComplete;
        expect(testElement.sound).to.equal("https://example.com/custom-explosion.mp3");
        await expect(testElement).shadowDom.to.be.accessible();
      });
    });
  });

  describe("Visual rendering and image display", () => {
    it("should render image element with correct attributes", () => {
      const img = element.shadowRoot.querySelector('#image');
      expect(img).to.exist;
      expect(img.tagName.toLowerCase()).to.equal('img');
      expect(img.getAttribute('loading')).to.equal('lazy');
      expect(img.getAttribute('alt')).to.equal('');
      expect(img.classList.contains('image-tag')).to.be.true;
    });

    it("should update image source when image property changes", async () => {
      const testElement = await fixture(html`
        <awesome-explosion image="https://example.com/test.gif"></awesome-explosion>
      `);
      await testElement.updateComplete;
      
      const img = testElement.shadowRoot.querySelector('#image');
      expect(img.src).to.equal("https://example.com/test.gif");
    });

    it("should apply size-based CSS classes correctly", async () => {
      const sizes = ['tiny', 'small', 'medium', 'large', 'epic'];
      
      for (const size of sizes) {
        const testElement = await fixture(html`
          <awesome-explosion size="${size}"></awesome-explosion>
        `);
        await testElement.updateComplete;
        
        expect(testElement.getAttribute('size')).to.equal(size);
        await expect(testElement).shadowDom.to.be.accessible();
      }
    });

    it("should apply color-based CSS filters correctly", async () => {
      const colors = ['red', 'purple', 'blue', 'orange', 'yellow'];
      
      for (const color of colors) {
        const testElement = await fixture(html`
          <awesome-explosion color="${color}"></awesome-explosion>
        `);
        await testElement.updateComplete;
        
        expect(testElement.getAttribute('color')).to.equal(color);
        await expect(testElement).shadowDom.to.be.accessible();
      }
    });
  });

  describe("Sound functionality and audio controls", () => {
    let mockAudio;
    
    beforeEach(() => {
      let playCallCount = 0;
      let pauseCallCount = 0;
      
      mockAudio = {
        play: () => {
          playCallCount++;
          return Promise.resolve();
        },
        pause: () => {
          pauseCallCount++;
        },
        currentTime: 0,
        getPlayCallCount: () => playCallCount,
        getPauseCallCount: () => pauseCallCount
      };
      
      globalThis.audio = mockAudio;
    });

    it("should play sound when state changes to play", async () => {
      const testElement = await fixture(html`
        <awesome-explosion></awesome-explosion>
      `);
      
      testElement.state = 'play';
      await testElement.updateComplete;
      
      expect(mockAudio.getPlayCallCount()).to.be.greaterThan(0);
      expect(testElement.playing).to.be.true;
    });

    it("should pause sound when state changes to pause", async () => {
      const testElement = await fixture(html`
        <awesome-explosion></awesome-explosion>
      `);
      
      testElement.state = 'pause';
      await testElement.updateComplete;
      
      expect(mockAudio.getPauseCallCount()).to.be.greaterThan(0);
      expect(testElement.paused).to.be.true;
    });

    it("should stop sound when state changes to stop", async () => {
      const testElement = await fixture(html`
        <awesome-explosion></awesome-explosion>
      `);
      
      testElement.state = 'stop';
      await testElement.updateComplete;
      
      expect(mockAudio.getPauseCallCount()).to.be.greaterThan(0);
      expect(testElement.stopped).to.be.true;
      expect(mockAudio.currentTime).to.equal(0);
    });

    it("should reset sound currentTime when resetSound is true", async () => {
      const testElement = await fixture(html`
        <awesome-explosion reset-sound></awesome-explosion>
      `);
      
      mockAudio.currentTime = 5.5; // Set some progress
      testElement.state = 'pause';
      await testElement.updateComplete;
      
      expect(mockAudio.currentTime).to.equal(0);
    });

    it("should create new Audio instance if not exists", async () => {
      delete globalThis.audio;
      
      const testElement = await fixture(html`
        <awesome-explosion></awesome-explosion>
      `);
      
      // Mock the Audio constructor
      const originalAudio = globalThis.Audio;
      let audioCreated = false;
      globalThis.Audio = function(src) {
        audioCreated = true;
        this.play = () => Promise.resolve();
        this.pause = () => {};
        this.currentTime = 0;
        return this;
      };
      
      testElement.state = 'play';
      await testElement.updateComplete;
      
      expect(audioCreated).to.be.true;
      
      globalThis.Audio = originalAudio;
    });
  });

  describe("Event handling and user interaction", () => {
    it("should respond to click events", (done) => {
      const testElement = new (element.constructor)();
      
      // Wait for event listeners to be attached
      setTimeout(() => {
        expect(testElement.state).to.equal('stop');
        
        testElement.click();
        
        setTimeout(() => {
          expect(testElement.state).to.equal('play');
          done();
        }, 10);
      }, 10);
    });

    it("should respond to mouseover events", (done) => {
      const testElement = new (element.constructor)();
      
      setTimeout(() => {
        expect(testElement.state).to.equal('stop');
        
        const mouseoverEvent = new MouseEvent('mouseover');
        testElement.dispatchEvent(mouseoverEvent);
        
        setTimeout(() => {
          expect(testElement.state).to.equal('play');
          done();
        }, 10);
      }, 10);
    });

    it("should respond to mouseout events", (done) => {
      const testElement = new (element.constructor)();
      
      setTimeout(() => {
        testElement.state = 'play';
        
        const mouseoutEvent = new MouseEvent('mouseout');
        testElement.dispatchEvent(mouseoutEvent);
        
        setTimeout(() => {
          expect(testElement.state).to.equal('pause');
          done();
        }, 10);
      }, 10);
    });
  });

  describe("Custom events and communication", () => {
    it("should dispatch awesome-event when playing", (done) => {
      const testElement = new (element.constructor)();
      
      testElement.addEventListener('awesome-event', (e) => {
        expect(e.detail.message).to.equal('Sound played');
        expect(e.bubbles).to.be.true;
        expect(e.cancelable).to.be.true;
        expect(e.composed).to.be.true;
        done();
      });
      
      testElement.state = 'play';
    });

    it("should dispatch awesome-event when paused", (done) => {
      const testElement = new (element.constructor)();
      
      testElement.addEventListener('awesome-event', (e) => {
        expect(e.detail.message).to.equal('Sound paused');
        done();
      });
      
      testElement.state = 'pause';
    });

    it("should dispatch awesome-event when stopped", (done) => {
      const testElement = new (element.constructor)();
      
      testElement.addEventListener('awesome-event', (e) => {
        expect(e.detail.message).to.equal('Sound stopped');
        done();
      });
      
      testElement.state = 'stop';
    });
  });

  describe("Accessibility scenarios", () => {
    it("should remain accessible with different sizes", async () => {
      const sizes = ['tiny', 'small', 'medium', 'large', 'epic'];
      
      for (const size of sizes) {
        const testElement = await fixture(html`
          <awesome-explosion size="${size}" color="blue"></awesome-explosion>
        `);
        await testElement.updateComplete;
        await expect(testElement).shadowDom.to.be.accessible();
      }
    });

    it("should remain accessible with different colors", async () => {
      const colors = ['red', 'purple', 'blue', 'orange', 'yellow'];
      
      for (const color of colors) {
        const testElement = await fixture(html`
          <awesome-explosion size="medium" color="${color}"></awesome-explosion>
        `);
        await testElement.updateComplete;
        await expect(testElement).shadowDom.to.be.accessible();
      }
    });

    it("should remain accessible during state changes", async () => {
      const testElement = await fixture(html`
        <awesome-explosion size="medium" color="blue"></awesome-explosion>
      `);
      
      const states = ['play', 'pause', 'stop'];
      for (const state of states) {
        testElement.state = state;
        await testElement.updateComplete;
        await expect(testElement).shadowDom.to.be.accessible();
      }
    });

    it("should remain accessible with custom media sources", async () => {
      const testElement = await fixture(html`
        <awesome-explosion
          image="https://example.com/custom.gif"
          sound="https://example.com/custom.mp3"
          size="large"
          color="red"
        ></awesome-explosion>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Edge cases and error handling", () => {
    it("should handle missing global audio gracefully", () => {
      delete globalThis.audio;
      
      const testElement = new (element.constructor)();
      
      expect(() => {
        testElement._stopSound();
      }).to.not.throw();
    });

    it("should handle invalid state values", async () => {
      const testElement = await fixture(html`
        <awesome-explosion></awesome-explosion>
      `);
      
      testElement.state = 'invalid-state';
      await testElement.updateComplete;
      
      expect(testElement.state).to.equal('invalid-state');
      expect(testElement.stopped).to.be.false;
      expect(testElement.playing).to.be.false;
      expect(testElement.paused).to.be.false;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle invalid size and color values", async () => {
      const testElement = await fixture(html`
        <awesome-explosion size="invalid-size" color="invalid-color"></awesome-explosion>
      `);
      await testElement.updateComplete;
      
      expect(testElement.size).to.equal('invalid-size');
      expect(testElement.color).to.equal('invalid-color');
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle malformed media URLs", async () => {
      const testElement = await fixture(html`
        <awesome-explosion
          image="invalid-url"
          sound="malformed-url"
        ></awesome-explosion>
      `);
      await testElement.updateComplete;
      
      expect(testElement.image).to.equal('invalid-url');
      expect(testElement.sound).to.equal('malformed-url');
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle unusual property values", async () => {
      const testElement = await fixture(html`<awesome-explosion></awesome-explosion>`);
      
      const edgeCaseValues = [
        "   \t\n   ", // whitespace
        "💥 explosion with emoji 💥", // emoji
        "Very long size name that might cause issues",
        "Multi\nline\nvalue", // multiline
        "Value with 'quotes' and \"double quotes\" and special chars: !@#$%^&*()"
      ];
      
      for (const value of edgeCaseValues) {
        testElement.size = value;
        testElement.color = value;
        testElement.image = value;
        testElement.sound = value;
        await testElement.updateComplete;
        
        expect(testElement.size).to.equal(value);
        expect(testElement.color).to.equal(value);
        expect(testElement.image).to.equal(value);
        expect(testElement.sound).to.equal(value);
        await expect(testElement).shadowDom.to.be.accessible();
      }
    });
  });

  describe("CSS styles and visual effects", () => {
    it("should have proper CSS styles defined", () => {
      const styles = element.constructor.styles;
      expect(styles).to.exist;
      expect(styles.length).to.be.greaterThan(0);
      
      const styleString = styles[0].cssText || styles[0].toString();
      expect(styleString).to.include(':host');
      expect(styleString).to.include('display: inline-block');
      expect(styleString).to.include('#image');
    });

    it("should include size-specific CSS rules", () => {
      const styles = element.constructor.styles;
      const styleString = styles[0].cssText || styles[0].toString();
      
      expect(styleString).to.include(':host([size="tiny"])');
      expect(styleString).to.include(':host([size="small"])');
      expect(styleString).to.include(':host([size="medium"])');
      expect(styleString).to.include(':host([size="large"])');
      expect(styleString).to.include(':host([size="epic"])');
    });

    it("should include color filter CSS rules", () => {
      const styles = element.constructor.styles;
      const styleString = styles[0].cssText || styles[0].toString();
      
      expect(styleString).to.include(':host([color="red"])');
      expect(styleString).to.include(':host([color="purple"])');
      expect(styleString).to.include(':host([color="blue"])');
      expect(styleString).to.include(':host([color="orange"])');
      expect(styleString).to.include(':host([color="yellow"])');
      expect(styleString).to.include('filter: sepia()');
    });
  });

  describe("Lifecycle and initialization", () => {
    it("should set up event listeners after timeout", (done) => {
      const testElement = new (element.constructor)();
      
      // Initially the event listeners shouldn't be set up yet
      expect(testElement.state).to.equal('stop');
      
      // After timeout, event listeners should work
      setTimeout(() => {
        testElement.click();
        setTimeout(() => {
          expect(testElement.state).to.equal('play');
          done();
        }, 10);
      }, 10);
    });

    it("should initialize with correct default media URLs", () => {
      const testElement = new (element.constructor)();
      
      expect(testElement.image).to.include('explode.gif');
      expect(testElement.sound).to.include('.mp3');
      expect(testElement.sound).to.include('fireworks');
    });
  });
});
