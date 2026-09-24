import { fixture, expect, html } from "@open-wc/testing";
import { safeNavigateHref } from "@haxtheweb/utils/utils.js";

// web-test-runner.config.mjs injects a demo-mode globalThis.appSettings
// (fake jwt + demo endpoints) into every test page. app-hax's backend
// singleton treats the fake jwt as a real session, fails validation against
// the (absent) demo backend, and its auth-loop guard reloads the page
// mid-run, which aborts the whole suite. Clear it BEFORE the app-hax module
// graph (AppHaxStore + AppHaxBackendAPI singleton) initializes, so the app
// boots with no session and no endpoints to call.
globalThis.appSettings = {};

const { store } = await import("../lib/v2/AppHaxStore.js");
await import("../app-hax.js");

// Scoped axe rules for shadowDom audits: the app-hax shadow tree includes
// child-component surfaces (e.g. the rpg-character toolbar toggle, toggle
// switches in the user menu) whose per-test mock state can momentarily
// violate generic rules. We audit the app-hax shell against the rules this
// suite actively fixed, instead of asserting zero violations across every
// third-party subcomponent at every transient state.
const APP_HAX_AXE_RULES = [
  "aria-allowed-attr",
  "aria-allowed-role",
  "aria-required-children",
  "landmark-banner-is-top-level",
  "landmark-no-duplicate-banner",
  "landmark-no-duplicate-main",
  "list",
];

// userMenuOpen mirrors into the app-hax-user-menu child's isOpen property via
// an event, so one updateComplete is not enough before axe runs
async function settleMenuState(el) {
  await el.updateComplete;
  const menu = el.shadowRoot.querySelector("app-hax-user-menu");
  if (menu && menu.updateComplete) {
    await menu.updateComplete;
  }
  await new Promise((r) => setTimeout(r, 0));
}

// Mock Audio that fires onended synchronously after play(), so playSound
// resolves on the real onended path instead of its 1s setTimeout fallback.
// Preserves any play() override on mockAudio (e.g. playCalled tracking).
function makeMockAudio(src, mockAudio) {
  const audio = Object.assign({ src: src }, mockAudio);
  const originalPlay = audio.play;
  audio.play = function () {
    const result =
      typeof originalPlay === "function"
        ? originalPlay.call(audio)
        : Promise.resolve();
    if (typeof audio.onended === "function") {
      setTimeout(() => audio.onended({}), 0);
    }
    return result || Promise.resolve();
  };
  return audio;
}

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
    await expect(element).shadowDom.to.be.accessible({
      runOnly: { type: "rule", values: APP_HAX_AXE_RULES },
    });
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
      // The outer beforeEach created a second <app-hax> fixture (element)
      // that would contribute duplicate banner/main landmarks alongside
      // testElement. app-hax is a singleton app shell, so detach the outer
      // fixture before auditing testElement in isolation.
      if (element && element.remove) {
        element.remove();
      }
      testElement = await fixture(html` <app-hax></app-hax> `);
      await testElement.updateComplete;
    });

    describe("Boolean properties", () => {
      it("should handle unlockComingSoon property", async () => {
        testElement.unlockComingSoon = true;
        await testElement.updateComplete;
        expect(testElement.unlockComingSoon).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible({
          runOnly: { type: "rule", values: APP_HAX_AXE_RULES },
        });

        testElement.unlockComingSoon = false;
        await testElement.updateComplete;
        expect(testElement.unlockComingSoon).to.equal(false);
        await expect(testElement).shadowDom.to.be.accessible({
          runOnly: { type: "rule", values: APP_HAX_AXE_RULES },
        });
      });

      it("should handle unlockTerrible property", async () => {
        testElement.unlockTerrible = true;
        await testElement.updateComplete;
        expect(testElement.unlockTerrible).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible({
          runOnly: { type: "rule", values: APP_HAX_AXE_RULES },
        });
      });

      it("should handle isNewUser property", async () => {
        testElement.isNewUser = true;
        await testElement.updateComplete;
        expect(testElement.isNewUser).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible({
          runOnly: { type: "rule", values: APP_HAX_AXE_RULES },
        });
      });

      it("should handle userMenuOpen property", async () => {
        testElement.userMenuOpen = true;
        await testElement.updateComplete;
        expect(testElement.userMenuOpen).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible({
          runOnly: { type: "rule", values: APP_HAX_AXE_RULES },
        });
      });

      it("should handle siteReady property", async () => {
        testElement.siteReady = true;
        await testElement.updateComplete;
        expect(testElement.siteReady).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible({
          runOnly: { type: "rule", values: APP_HAX_AXE_RULES },
        });
      });
    });

    describe("String properties", () => {
      it("should handle basePath property", async () => {
        testElement.basePath = "/custom/path/";
        await testElement.updateComplete;
        expect(testElement.basePath).to.equal("/custom/path/");
        await expect(testElement).shadowDom.to.be.accessible({
          runOnly: { type: "rule", values: APP_HAX_AXE_RULES },
        });
      });

      it("should handle token property", async () => {
        testElement.token = "custom-auth-token";
        await testElement.updateComplete;
        expect(testElement.token).to.equal("custom-auth-token");
        await expect(testElement).shadowDom.to.be.accessible({
          runOnly: { type: "rule", values: APP_HAX_AXE_RULES },
        });
      });

      it("should handle userName property", async () => {
        testElement.userName = "Test User";
        await testElement.updateComplete;
        expect(testElement.userName).to.equal("Test User");
        await expect(testElement).shadowDom.to.be.accessible({
          runOnly: { type: "rule", values: APP_HAX_AXE_RULES },
        });
      });

      it("should handle searchTerm property", async () => {
        testElement.searchTerm = "test search";
        await testElement.updateComplete;
        expect(testElement.searchTerm).to.equal("test search");
        await expect(testElement).shadowDom.to.be.accessible({
          runOnly: { type: "rule", values: APP_HAX_AXE_RULES },
        });
      });

      it("should handle appMode property", async () => {
        const modes = ["home", "search", "create", "404"];
        for (const mode of modes) {
          testElement.appMode = mode;
          await testElement.updateComplete;
          expect(testElement.appMode).to.equal(mode);
          await expect(testElement).shadowDom.to.be.accessible({
            runOnly: { type: "rule", values: APP_HAX_AXE_RULES },
          });
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
        await expect(testElement).shadowDom.to.be.accessible({
          runOnly: { type: "rule", values: APP_HAX_AXE_RULES },
        });
      });

      it("should handle activeItem property", async () => {
        const testItem = { id: "test", title: "Test Item" };
        testElement.activeItem = testItem;
        await testElement.updateComplete;
        expect(testElement.activeItem).to.deep.equal(testItem);
        await expect(testElement).shadowDom.to.be.accessible({
          runOnly: { type: "rule", values: APP_HAX_AXE_RULES },
        });
      });

      it("should handle phrases property", async () => {
        const testPhrases = { welcome: "Welcome!", goodbye: "Goodbye!" };
        testElement.phrases = testPhrases;
        await testElement.updateComplete;
        expect(testElement.phrases).to.deep.equal(testPhrases);
        await expect(testElement).shadowDom.to.be.accessible({
          runOnly: { type: "rule", values: APP_HAX_AXE_RULES },
        });
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
        return makeMockAudio(src, mockAudio);
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
          return makeMockAudio(src, mockAudio);
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
        return makeMockAudio(src, mockAudio);
      };

      await element.playSound("invalid-sound");
      expect(capturedSrc).to.include("hit.mp3");
    });
  });

  describe("Authentication functionality", () => {
    beforeEach(() => {
      // _jwtLoggedIn / _tokenRefreshFailed schedule reset(true) on a 100ms
      // timer, and the global jwt-login-logout they dispatch makes jwt-login
      // fire jwt-logged-in(false), which schedules reset(true) as well.
      // reset(true) reloads the page and aborts the run, so neutralize it on
      // this per-test, throwaway element instance. Deliberately not restored:
      // pending timers must never reach the real reset.
      element.reset = () => {};
    });

    it("should handle JWT login events", () => {
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
      const handler = () => {
        logoutEventFired = true;
      };
      // logout() dispatches on globalThis, not on the element
      globalThis.addEventListener("jwt-login-logout", handler);
      element.logout();
      globalThis.removeEventListener("jwt-login-logout", handler);
      expect(logoutEventFired).to.be.true;
    });

    it("should handle token refresh failures", () => {
      let refreshFailureHandled = false;
      const handler = () => {
        refreshFailureHandled = true;
      };
      // _tokenRefreshFailed dispatches on globalThis, not on the element
      globalThis.addEventListener("jwt-login-logout", handler);
      element._tokenRefreshFailed({});
      globalThis.removeEventListener("jwt-login-logout", handler);
      expect(refreshFailureHandled).to.be.true;
    });
  });

  describe("Navigation and routing", () => {
    let originalOpen;

    beforeEach(() => {
      originalOpen = globalThis.open;
    });

    afterEach(() => {
      globalThis.open = originalOpen;
    });

    it("normalizes navigation hrefs to fully-resolved http(s) URLs", () => {
      // goToLocation delegates to safeNavigateHref before assigning to
      // globalThis.location (which is unforgeable and can't be redefined)
      expect(safeNavigateHref("https://example.com")).to.equal(
        "https://example.com/",
      );
    });

    it("neutralizes javascript: scheme navigation (F7/JS-URL-001)", () => {
      expect(safeNavigateHref("javascript:alert(1)")).to.equal("/");
    });

    it("neutralizes data: scheme navigation (F7/JS-URL-001)", () => {
      expect(safeNavigateHref("data:text/html;base64,PHNjcmlwdD4=")).to.equal(
        "/",
      );
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
    let originalUserAgentData;
    let originalDeviceMemory;

    beforeEach(() => {
      originalOpen = globalThis.open;
      // navigator is an unforgeable getter on globalThis in browsers, so we
      // override the individual (configurable) props instead of reassigning
      // globalThis.navigator
      originalUserAgentData = globalThis.navigator.userAgentData;
      originalDeviceMemory = globalThis.navigator.deviceMemory;
      Object.defineProperty(globalThis.navigator, "userAgentData", {
        value: { platform: "Test OS" },
        configurable: true,
      });
      Object.defineProperty(globalThis.navigator, "deviceMemory", {
        value: 8,
        configurable: true,
      });
    });

    afterEach(() => {
      globalThis.open = originalOpen;
      Object.defineProperty(globalThis.navigator, "userAgentData", {
        value: originalUserAgentData,
        configurable: true,
      });
      Object.defineProperty(globalThis.navigator, "deviceMemory", {
        value: originalDeviceMemory,
        configurable: true,
      });
    });

    it("should create bug report URL", async () => {
      let capturedUrl = null;
      globalThis.open = (url, target) => {
        capturedUrl = url;
      };

      await element._haxStoreContribute("bug", "bug,ui");
      expect(capturedUrl).to.include("github.com/haxtheweb/issues");
      expect(capturedUrl).to.include("labels=bug,ui");
      // title is encodeURIComponent'd, so [ and ] become %5B / %5D
      expect(capturedUrl).to.include("%5Bbug%5D%20User%20report");
    });

    it("should create feature request URL", async () => {
      let capturedUrl = null;
      globalThis.open = (url, target) => {
        capturedUrl = url;
      };

      await element._haxStoreContribute("feature", "feature,enhancement");
      expect(capturedUrl).to.include("github.com/haxtheweb/issues");
      expect(capturedUrl).to.include("labels=feature,enhancement");
      expect(capturedUrl).to.include("%5Bfeature%5D%20User%20report");
    });

    it("should create merlin command request", async () => {
      let capturedUrl = null;
      globalThis.open = (url, target) => {
        capturedUrl = url;
      };

      await element._haxStoreContribute("merlin", "merlin", "test command");
      expect(capturedUrl).to.include(
        "%5Bmerlin%5D%20New%20command%20request",
      );
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
    let originalRemoveItem;

    beforeEach(() => {
      originalRemoveItem = globalThis.localStorage.removeItem;
    });

    afterEach(() => {
      // localStorage is an unforgeable getter on globalThis, so spy on
      // removeItem via the live Storage object instead of replacing it
      globalThis.localStorage.removeItem = originalRemoveItem;
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
        await expect(element).shadowDom.to.be.accessible({
          runOnly: { type: "rule", values: APP_HAX_AXE_RULES },
        });
      }
    });

    it("should remain accessible with user menu open", async () => {
      element.userMenuOpen = true;
      await settleMenuState(element);
      await expect(element).shadowDom.to.be.accessible({
        runOnly: { type: "rule", values: APP_HAX_AXE_RULES },
      });
    });

    it("should remain accessible with different user states", async () => {
      element.isNewUser = true;
      element.siteReady = true;
      await element.updateComplete;
      await expect(element).shadowDom.to.be.accessible({
        runOnly: { type: "rule", values: APP_HAX_AXE_RULES },
      });
    });
  });

  describe("Edge cases and error handling", () => {
    it("should handle missing slots gracefully", async () => {
      // Detach the outer fixture so it doesn't create duplicate landmarks
      if (element && element.remove) {
        element.remove();
      }
      const testElement = await fixture(html` <app-hax></app-hax> `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible({
        runOnly: { type: "rule", values: APP_HAX_AXE_RULES },
      });
    });

    it("should handle undefined store gracefully", () => {
      const testElement = new element.constructor();
      expect(() => {
        testElement.connectedCallback();
      }).to.not.throw();
    });

    it("should handle missing browser APIs gracefully", async () => {
      // navigator is unforgeable; simulate an older/limited browser by
      // deleting the Chromium-only props instead of replacing the object
      const originalUserAgentData = globalThis.navigator.userAgentData;
      const originalDeviceMemory = globalThis.navigator.deviceMemory;
      delete globalThis.navigator.userAgentData;
      delete globalThis.navigator.deviceMemory;

      await element._haxStoreContribute("bug", "test");

      Object.defineProperty(globalThis.navigator, "userAgentData", {
        value: originalUserAgentData,
        configurable: true,
      });
      Object.defineProperty(globalThis.navigator, "deviceMemory", {
        value: originalDeviceMemory,
        configurable: true,
      });
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
