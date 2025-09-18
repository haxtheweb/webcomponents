import { fixture, expect, html } from "@open-wc/testing";
import { store } from "../lib/v1/AppHaxStore.js";
import "../app-hax.js";

describe("app-hax test", () => {
  let element;

  beforeEach(async () => {
    // Reset store state before each test
    if (store) {
      store.appMode = "home";
      store.darkMode = false;
      store.soundStatus = false;
      store.appReady = false;
    }

    element = await fixture(html`
      <app-hax base-path="/test/" token="test-token">
        <a href="https://www.example.edu" slot="app-header-pre">
          <img
            src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
            style="height:48px;display:inline-flex;vertical-align:top;"
            alt="Example University"
          />
        </a>
        <div slot="externalproviders">
          <button>External Login</button>
        </div>
      </app-hax>
    `);
    await element.updateComplete;
  });

  it("basic setup", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("app-hax");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Component structure and properties", () => {
    it("should have correct tag name", () => {
      expect(element.constructor.tag).to.equal("app-hax");
    });

    it("should initialize with default properties", () => {
      expect(element.unlockComingSoon).to.equal(false);
      expect(element.unlockTerrible).to.equal(false);
      expect(element.basePath).to.equal("/test/");
      expect(element.token).to.equal("test-token");
    });

    it("should have translation object", () => {
      expect(element.t).to.be.an("object");
      expect(element.t.save).to.equal("Save");
      expect(element.t.cancel).to.equal("Cancel");
      expect(element.t.home).to.equal("Home");
    });
  });

  describe("Property validation with accessibility", () => {
    let testElement;

    beforeEach(async () => {
      testElement = await fixture(html` <app-hax></app-hax> `);
      await testElement.updateComplete;
    });

    describe("Boolean properties", () => {
      it("should handle unlockComingSoon property", async () => {
        testElement.unlockComingSoon = true;
        await testElement.updateComplete;
        expect(testElement.unlockComingSoon).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();

        testElement.unlockComingSoon = false;
        await testElement.updateComplete;
        expect(testElement.unlockComingSoon).to.equal(false);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle unlockTerrible property", async () => {
        testElement.unlockTerrible = true;
        await testElement.updateComplete;
        expect(testElement.unlockTerrible).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle isNewUser property", async () => {
        testElement.isNewUser = true;
        await testElement.updateComplete;
        expect(testElement.isNewUser).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle userMenuOpen property", async () => {
        testElement.userMenuOpen = true;
        await testElement.updateComplete;
        expect(testElement.userMenuOpen).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle siteReady property", async () => {
        testElement.siteReady = true;
        await testElement.updateComplete;
        expect(testElement.siteReady).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();
      });
    });

    describe("String properties", () => {
      it("should handle basePath property", async () => {
        testElement.basePath = "/custom/path/";
        await testElement.updateComplete;
        expect(testElement.basePath).to.equal("/custom/path/");
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle token property", async () => {
        testElement.token = "custom-auth-token";
        await testElement.updateComplete;
        expect(testElement.token).to.equal("custom-auth-token");
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle userName property", async () => {
        testElement.userName = "Test User";
        await testElement.updateComplete;
        expect(testElement.userName).to.equal("Test User");
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle searchTerm property", async () => {
        testElement.searchTerm = "test search";
        await testElement.updateComplete;
        expect(testElement.searchTerm).to.equal("test search");
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle appMode property", async () => {
        const modes = ["home", "search", "create", "404"];
        for (const mode of modes) {
          testElement.appMode = mode;
          await testElement.updateComplete;
          expect(testElement.appMode).to.equal(mode);
          await expect(testElement).shadowDom.to.be.accessible();
        }
      });
    });

    describe("Object and Array properties", () => {
      it("should handle courses property", async () => {
        const testCourses = [
          { id: 1, name: "Course 1" },
          { id: 2, name: "Course 2" },
        ];
        testElement.courses = testCourses;
        await testElement.updateComplete;
        expect(testElement.courses).to.deep.equal(testCourses);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle activeItem property", async () => {
        const testItem = { id: "test", title: "Test Item" };
        testElement.activeItem = testItem;
        await testElement.updateComplete;
        expect(testElement.activeItem).to.deep.equal(testItem);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle phrases property", async () => {
        const testPhrases = { welcome: "Welcome!", goodbye: "Goodbye!" };
        testElement.phrases = testPhrases;
        await testElement.updateComplete;
        expect(testElement.phrases).to.deep.equal(testPhrases);
        await expect(testElement).shadowDom.to.be.accessible();
      });
    });
  });

  describe("Slot functionality", () => {
    it("should have app-header-pre slot with correct content", () => {
      const slottedLink = element.querySelector('a[slot="app-header-pre"]');
      expect(slottedLink).to.exist;
      expect(slottedLink.getAttribute("href")).to.equal(
        "https://www.example.edu",
      );

      const slottedImg = slottedLink.querySelector("img");
      expect(slottedImg).to.exist;
      expect(slottedImg.getAttribute("alt")).to.equal("Example University");
    });

    it("should have externalproviders slot", () => {
      const slottedProviders = element.querySelector(
        'div[slot="externalproviders"]',
      );
      expect(slottedProviders).to.exist;

      const button = slottedProviders.querySelector("button");
      expect(button).to.exist;
      expect(button.textContent).to.equal("External Login");
    });
  });

  describe("Sound functionality", () => {
    let originalAudio;
    let mockAudio;

    beforeEach(() => {
      originalAudio = globalThis.Audio;
      mockAudio = {
        play: () => Promise.resolve(),
        pause: () => {},
        volume: 1,
        onended: null,
      };
      globalThis.Audio = function (src) {
        Object.assign(this, mockAudio);
        this.src = src;
        return this;
      };
    });

    afterEach(() => {
      globalThis.Audio = originalAudio;
    });

    it("should play sound when sound is enabled", async () => {
      element.store.soundStatus = true;
      element.store.appReady = true;

      let playCalled = false;
      mockAudio.play = () => {
        playCalled = true;
        return Promise.resolve();
      };

      await element.playSound("click");
      expect(playCalled).to.be.true;
    });

    it("should not play sound when sound is disabled", async () => {
      element.store.soundStatus = false;

      let playCalled = false;
      mockAudio.play = () => {
        playCalled = true;
        return Promise.resolve();
      };

      await element.playSound("click");
      expect(playCalled).to.be.false;
    });

    it("should handle different sound types", async () => {
      element.store.soundStatus = true;
      element.store.appReady = true;

      const soundTypes = ["click", "click2", "coin", "coin2", "hit", "success"];

      for (const sound of soundTypes) {
        let capturedSrc = null;
        globalThis.Audio = function (src) {
          capturedSrc = src;
          Object.assign(this, mockAudio);
          return this;
        };

        await element.playSound(sound);
        expect(capturedSrc).to.include(`${sound}.mp3`);
      }
    });

    it("should fallback to 'hit' sound for invalid sound types", async () => {
      element.store.soundStatus = true;
      element.store.appReady = true;

      let capturedSrc = null;
      globalThis.Audio = function (src) {
        capturedSrc = src;
        Object.assign(this, mockAudio);
        return this;
      };

      await element.playSound("invalid-sound");
      expect(capturedSrc).to.include("hit.mp3");
    });
  });

  describe("Authentication functionality", () => {
    it("should handle JWT login events", () => {
      let eventFired = false;
      element.__logoutUserAction = true;

      const mockEvent = {
        detail: false,
      };

      expect(() => {
        element._jwtLoggedIn(mockEvent);
      }).to.not.throw();
    });

    it("should dispatch logout event", () => {
      let logoutEventFired = false;
      element.addEventListener("jwt-login-logout", () => {
        logoutEventFired = true;
      });

      element.logout();
      expect(logoutEventFired).to.be.true;
    });

    it("should handle token refresh failures", () => {
      let refreshFailureHandled = false;
      element.addEventListener("jwt-login-logout", () => {
        refreshFailureHandled = true;
      });

      element._tokenRefreshFailed({});
      expect(refreshFailureHandled).to.be.true;
    });
  });

  describe("Navigation and routing", () => {
    let originalLocation;

    beforeEach(() => {
      originalLocation = globalThis.location;
    });

    afterEach(() => {
      globalThis.location = originalLocation;
    });

    it("should navigate to specified location", () => {
      let capturedLocation = null;
      Object.defineProperty(globalThis, "location", {
        set: (value) => {
          capturedLocation = value;
        },
        configurable: true,
      });

      element.goToLocation("https://example.com");
      expect(capturedLocation).to.equal("https://example.com");
    });

    it("should open external links", () => {
      let openedUrl = null;
      let openedTarget = null;

      globalThis.open = (url, target) => {
        openedUrl = url;
        openedTarget = target;
      };

      element._openExternalLink("https://external.com");
      expect(openedUrl).to.equal("https://external.com");
      expect(openedTarget).to.equal("_blank");
    });
  });

  describe("Store contribution functionality", () => {
    let originalOpen;
    let originalNavigator;

    beforeEach(() => {
      originalOpen = globalThis.open;
      originalNavigator = globalThis.navigator;

      globalThis.navigator = {
        userAgent: "Test Browser",
        userAgentData: { platform: "Test OS" },
        deviceMemory: 8,
        hardwareConcurrency: 4,
        connection: { effectiveType: "4g" },
      };
    });

    afterEach(() => {
      globalThis.open = originalOpen;
      globalThis.navigator = originalNavigator;
    });

    it("should create bug report URL", async () => {
      let capturedUrl = null;
      globalThis.open = (url, target) => {
        capturedUrl = url;
      };

      await element._haxStoreContribute("bug", "bug,ui");
      expect(capturedUrl).to.include("github.com/haxtheweb/issues");
      expect(capturedUrl).to.include("labels=bug,ui");
      expect(capturedUrl).to.include("[bug]%20User%20report");
    });

    it("should create feature request URL", async () => {
      let capturedUrl = null;
      globalThis.open = (url, target) => {
        capturedUrl = url;
      };

      await element._haxStoreContribute("feature", "feature,enhancement");
      expect(capturedUrl).to.include("github.com/haxtheweb/issues");
      expect(capturedUrl).to.include("labels=feature,enhancement");
      expect(capturedUrl).to.include("[feature]%20User%20report");
    });

    it("should create merlin command request", async () => {
      let capturedUrl = null;
      globalThis.open = (url, target) => {
        capturedUrl = url;
      };

      await element._haxStoreContribute("merlin", "merlin", "test command");
      expect(capturedUrl).to.include("[merlin]%20New%20command%20request");
      expect(capturedUrl).to.include("test%20command");
    });
  });

  describe("Unlock features", () => {
    beforeEach(() => {
      // Mock SuperDaemonInstance
      globalThis.SuperDaemonInstance = {
        merlinSpeak: () => {},
      };

      // Mock store.appEl to have playSound method
      if (element.store) {
        element.store.appEl = element;
      }
    });

    it("should fire unlock terrible feature", async () => {
      expect(element.unlockTerrible).to.be.false;
      element.fireTerrible();
      expect(element.unlockTerrible).to.be.true;
    });

    it("should fire unlock coming soon feature", async () => {
      expect(element.unlockComingSoon).to.be.false;
      element.fireUnlocked();
      expect(element.unlockComingSoon).to.be.true;
    });
  });

  describe("Reset functionality", () => {
    let originalLocalStorage;
    let originalLocation;

    beforeEach(() => {
      originalLocalStorage = globalThis.localStorage;
      originalLocation = globalThis.location;

      globalThis.localStorage = {
        removeItem: () => {},
      };
    });

    afterEach(() => {
      globalThis.localStorage = originalLocalStorage;
      globalThis.location = originalLocation;
    });

    it("should clear localStorage items", () => {
      let removedItems = [];
      globalThis.localStorage.removeItem = (key) => {
        removedItems.push(key);
      };

      element.reset(false);
      expect(removedItems).to.include("app-hax-step");
      expect(removedItems).to.include("app-hax-site");
    });

    it("should handle localStorage errors gracefully", () => {
      globalThis.localStorage.removeItem = () => {
        throw new Error("Access denied");
      };

      expect(() => {
        element.reset(false);
      }).to.not.throw();
    });
  });

  describe("Accessibility scenarios", () => {
    it("should remain accessible in different app modes", async () => {
      const modes = ["home", "search", "create", "404"];

      for (const mode of modes) {
        element.appMode = mode;
        await element.updateComplete;
        await expect(element).shadowDom.to.be.accessible();
      }
    });

    it("should remain accessible with user menu open", async () => {
      element.userMenuOpen = true;
      await element.updateComplete;
      await expect(element).shadowDom.to.be.accessible();
    });

    it("should remain accessible with different user states", async () => {
      element.isNewUser = true;
      element.siteReady = true;
      await element.updateComplete;
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe("Edge cases and error handling", () => {
    it("should handle missing slots gracefully", async () => {
      const testElement = await fixture(html` <app-hax></app-hax> `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle undefined store gracefully", () => {
      const testElement = new element.constructor();
      expect(() => {
        testElement.connectedCallback();
      }).to.not.throw();
    });

    it("should handle missing browser APIs gracefully", async () => {
      const originalNavigator = globalThis.navigator;
      globalThis.navigator = {
        userAgent: "Test",
      };

      await element._haxStoreContribute("bug", "test");

      globalThis.navigator = originalNavigator;
    });
  });

  describe("CSS styles and theming", () => {
    it("should have proper CSS custom properties", () => {
      const styles = element.constructor.styles;
      expect(styles).to.exist;
      expect(styles.length).to.be.greaterThan(0);

      const styleString =
        styles[styles.length - 1].cssText ||
        styles[styles.length - 1].toString();
      expect(styleString).to.include("--app-hax-accent-color");
      expect(styleString).to.include("--app-hax-background-color");
      expect(styleString).to.include(":host");
    });

    it("should support dark mode theming", () => {
      const styles = element.constructor.styles;
      const styleString =
        styles[styles.length - 1].cssText ||
        styles[styles.length - 1].toString();
      expect(styleString).to.include("light-dark");
    });
  });

  describe("WindowControllers and cleanup", () => {
    it("should initialize window controllers", () => {
      const testElement = new element.constructor();
      expect(testElement.windowControllers).to.exist;
      expect(testElement.windowControllers.constructor.name).to.equal(
        "AbortController",
      );
    });

    it("should clean up on disconnect", () => {
      const testElement = new element.constructor();
      let abortCalled = false;
      testElement.windowControllers.abort = () => {
        abortCalled = true;
      };

      testElement.disconnectedCallback();
      expect(abortCalled).to.be.true;
    });
  });
});
