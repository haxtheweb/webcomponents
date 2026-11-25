import { expect } from "@open-wc/testing";
import "../lib/core/haxcms-site-builder.js";
import { store } from "../lib/core/haxcms-site-store.js";

// a bulk delete fires one haxcms-trigger-update per page; each must change
// the cache-busting stamp, or the manifest is only fetched once
describe("haxcms-site-builder refresh stamp", () => {
  it("changes on every update, even within the same second", async () => {
    const Builder = globalThis.customElements.get("haxcms-site-builder");
    const stub = { isLoggedIn: true, _timeStamp: "" };
    Builder.prototype._triggerUpdatedData.call(stub);
    const first = stub._timeStamp;
    await new Promise((r) => setTimeout(r, 5));
    Builder.prototype._triggerUpdatedData.call(stub);
    expect(stub._timeStamp).to.not.equal(first);
  });

  it("stays empty when logged out, as before", () => {
    const Builder = globalThis.customElements.get("haxcms-site-builder");
    const stub = { isLoggedIn: false, _timeStamp: 1 };
    Builder.prototype._triggerUpdatedData.call(stub);
    expect(stub._timeStamp).to.equal("");
  });
});

// security: the 404 message interpolated the requested route into innerHTML
describe("haxcms-site-builder display404Error", () => {
  let savedTheme;
  let savedLocation;
  beforeEach(() => {
    savedTheme = store.themeElement;
    savedLocation = store.currentRouterLocation;
  });
  afterEach(() => {
    store.themeElement = savedTheme;
    store.currentRouterLocation = savedLocation;
  });
  it("renders the missing route as text and encodes it in the search link", () => {
    const Builder = globalThis.customElements.get("haxcms-site-builder");
    const theme = globalThis.document.createElement("div");
    store.themeElement = theme;
    store.currentRouterLocation = {
      params: ['x/<img src=x onerror="globalThis.__404XSS = 1">&"'],
    };
    const stub = {
      t: {
        couldNotBeLocated: "could not be located",
        hereAreSomePossibleRemedies: "Here are some possible remedies",
        useSearchToLocateTheContentYouAreLookingFor: "Use search",
        goToTheHomePage: "Go home",
        navigateToAnotherPageInTheMenu: "Navigate",
      },
      _setThemeBusyState() {},
    };
    Builder.prototype.display404Error.call(stub);
    expect(theme.querySelector("img")).to.equal(null);
    expect(theme.querySelector("strong").textContent).to.equal(
      '<img src=x onerror="globalThis.__404XSS = 1">&"',
    );
    const link = theme.querySelector("a");
    expect(link.getAttribute("href")).to.equal(
      "x/displays/search?search=" +
        encodeURIComponent('<img src=x onerror="globalThis.__404XSS = 1">&"'),
    );
    expect(theme.querySelectorAll("li").length).to.equal(3);
    expect(globalThis.__404XSS).to.equal(undefined);
  });
});

// security: _updateActiveItemContent parsed page HTML in a live div
describe("haxcms-site-builder _updateActiveItemContent", () => {
  it("normalizes ids without running anything in the page HTML", async () => {
    const Builder = globalThis.customElements.get("haxcms-site-builder");
    let seen = null;
    const stub = {
      nodeNormalizeIDs: Builder.prototype.nodeNormalizeIDs,
      hashCode: Builder.prototype.hashCode,
      _activeItemContentChanged(content) {
        seen = content;
      },
      _flushAfterFirstContent() {},
    };
    Builder.prototype._updateActiveItemContent.call(
      stub,
      '<h2>Title</h2><img src="x" onerror="globalThis.__updateXSS = 1">',
      { id: "p1" },
    );
    await new Promise((r) => setTimeout(r, 100));
    expect(globalThis.__updateXSS).to.equal(undefined);
    expect(seen).to.include('<h2 id="h2-');
    expect(stub.__pageContentOwner).to.equal("p1");
  });

  // Vercel preview deploys add their toolbar script to every HTML file,
  // page content included; it rendered as `<script></script>` text
  it("drops a host-added <script src> from the page content", async () => {
    const Builder = globalThis.customElements.get("haxcms-site-builder");
    let seen = null;
    const stub = {
      nodeNormalizeIDs: Builder.prototype.nodeNormalizeIDs,
      hashCode: Builder.prototype.hashCode,
      _activeItemContentChanged(content) {
        seen = content;
      },
      _flushAfterFirstContent() {},
    };
    Builder.prototype._updateActiveItemContent.call(
      stub,
      '<p>Body</p><script async data-explicit-opt-in="true" src="https://vercel.live/_next-live/feedback/feedback.js"></script>',
      { id: "p2" },
    );
    await new Promise((r) => setTimeout(r, 100));
    expect(seen).to.include("<p");
    expect(seen).to.not.include("script");
  });

  // pages saved by older editors kept role="textbox" and other editing state;
  // a screen reader announced every such block as an unnamed text field
  it("renders without editing state an older editor saved", () => {
    const Builder = globalThis.customElements.get("haxcms-site-builder");
    let seen = null;
    const stub = {
      nodeNormalizeIDs: Builder.prototype.nodeNormalizeIDs,
      hashCode: Builder.prototype.hashCode,
      _activeItemContentChanged(content) {
        seen = content;
      },
      _flushAfterFirstContent() {},
    };
    Builder.prototype._updateActiveItemContent.call(
      stub,
      '<h2 role="textbox" data-hax-grid="">Title</h2><ul><li role="textbox" contenteditable="true">One</li></ul><p><rich-text-editor-highlight id="rte-1" range="{}">Kept text</rich-text-editor-highlight></p>',
      { id: "p3" },
    );
    expect(seen).to.not.include("textbox");
    expect(seen).to.not.include("contenteditable");
    expect(seen).to.not.include("rich-text-editor-highlight");
    expect(seen).to.include("Kept text");
    expect(seen).to.include("data-hax-grid");
  });
});
