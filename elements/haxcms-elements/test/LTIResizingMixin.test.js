import { expect } from "@open-wc/testing";
import { store } from "../lib/core/haxcms-site-store.js";
import { LTIResizingMixin } from "../lib/core/utils/LTIResizingMixin.js";

// The mixin loads h5p-resizer via ESGlobalBridge in the constructor; stub the
// bridge loader so nothing is injected into the document, and spy on
// parent.postMessage (same window in the test frame) to observe the LTI
// protocol messages.

class LTIHost extends LTIResizingMixin(HTMLElement) {
  constructor() {
    super();
    this.HAXCMSThemeSettings = {};
  }
}
if (!globalThis.customElements.get("lti-resizing-test-host")) {
  globalThis.customElements.define("lti-resizing-test-host", LTIHost);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("LTIResizingMixin", () => {
  let savedBridge;
  let savedHAXCMS;
  let savedAppReady;
  let savedActiveItemContent;
  let postMessageCalls;
  let originalPostMessage;

  beforeEach(() => {
    savedBridge = globalThis.ESGlobalBridge;
    savedHAXCMS = globalThis.HAXCMS;
    savedAppReady = store.appReady;
    savedActiveItemContent = store.activeItemContent;
    postMessageCalls = [];
    originalPostMessage = globalThis.parent.postMessage;
    globalThis.ESGlobalBridge = {
      requestAvailability: () => ({ load: () => {} }),
    };
    store.appReady = false;
    store.activeItemContent = "";
  });

  afterEach(() => {
    globalThis.ESGlobalBridge = savedBridge;
    if (savedHAXCMS === undefined) {
      delete globalThis.HAXCMS;
    } else {
      globalThis.HAXCMS = savedHAXCMS;
    }
    store.appReady = savedAppReady;
    store.activeItemContent = savedActiveItemContent;
    globalThis.parent.postMessage = originalPostMessage;
  });

  function stubPostMessage() {
    globalThis.parent.postMessage = function (message, origin) {
      postMessageCalls.push({ message, origin });
    };
  }

  it("can be applied to a base class and instantiated", () => {
    const el = globalThis.document.createElement("lti-resizing-test-host");
    expect(el).to.exist;
  });

  it("posts lti.scrollToTop immediately and lti.frameResize after timers when content is ready", async () => {
    stubPostMessage();
    globalThis.document.createElement("lti-resizing-test-host");
    store.appReady = true;
    await wait(0);
    expect(postMessageCalls.length).to.be.greaterThan(0);
    expect(postMessageCalls[0].message).to.equal(
      '{"subject":"lti.scrollToTop"}',
    );
    // 100ms timer: frameResize + scrollToTop
    await wait(150);
    const subjects = postMessageCalls.map(
      (c) =>
        JSON.parse(c.message.replace(/, "height":(\d+) }/, ', "height": $1 }'))
          .subject,
    );
    expect(subjects).to.include("lti.frameResize");
    // 1000ms timer: another round
    await wait(1000);
    const frameResizes = postMessageCalls.filter(
      (c) => c.message.indexOf("lti.frameResize") !== -1,
    );
    expect(frameResizes.length).to.be.greaterThan(1);
  });

  it("uses the scrollTarget scrollHeight when HAXCMSThemeSettings.scrollTarget exists", async () => {
    stubPostMessage();
    const el = globalThis.document.createElement("lti-resizing-test-host");
    el.HAXCMSThemeSettings = { scrollTarget: { scrollHeight: 4321 } };
    store.activeItemContent = "<p>stuff</p>";
    await wait(150);
    // elements from earlier tests keep undisposed autoruns, so frameResize
    // messages from their (empty) settings also arrive; assert that a
    // frameResize carrying this element's scrollTarget height was posted
    const withScrollTarget = postMessageCalls.filter(
      (c) =>
        c.message.indexOf("lti.frameResize") !== -1 &&
        c.message.indexOf("4321") !== -1,
    );
    expect(withScrollTarget.length).to.be.greaterThan(0);
  });

  it("resolves the target origin from HAXCMS instance appSettings.ltiOrigin", async () => {
    stubPostMessage();
    globalThis.HAXCMS = {
      instance: {
        store: {
          appSettings: { ltiOrigin: "https://canvas.example.edu/courses/1" },
        },
      },
    };
    globalThis.document.createElement("lti-resizing-test-host");
    store.appReady = true;
    await wait(0);
    expect(postMessageCalls[0].origin).to.equal("https://canvas.example.edu");
  });

  it('passes ltiOrigin "*" straight through as the target origin', async () => {
    stubPostMessage();
    globalThis.HAXCMS = {
      instance: {
        store: { appSettings: { ltiOrigin: "*" } },
      },
    };
    globalThis.document.createElement("lti-resizing-test-host");
    store.appReady = true;
    await wait(0);
    expect(postMessageCalls[0].origin).to.equal("*");
  });

  it("falls back to the location origin when no ltiOrigin is configured", async () => {
    stubPostMessage();
    globalThis.document.createElement("lti-resizing-test-host");
    store.appReady = true;
    await wait(0);
    expect(postMessageCalls[0].origin).to.equal(globalThis.location.origin);
  });

  it("falls back to the location origin when ltiOrigin is not a valid URL", async () => {
    stubPostMessage();
    globalThis.HAXCMS = {
      instance: {
        store: { appSettings: { ltiOrigin: "not a url at all :::" } },
      },
    };
    globalThis.document.createElement("lti-resizing-test-host");
    store.appReady = true;
    await wait(0);
    expect(postMessageCalls[0].origin).to.equal(globalThis.location.origin);
  });
});
