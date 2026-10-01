import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import { LinkedinEmbed } from "../linkedin-embed.js";

const scriptsMatching = (marker) =>
  [...globalThis.document.body.querySelectorAll("script")].filter((s) =>
    s.src.includes(marker),
  );

// network stub: badge requests aimed at linkedin's real CDN are redirected to
// a local 404 so no external request ever leaves the test run
const origSetAttribute = Element.prototype.setAttribute;
Element.prototype.setAttribute = function (name, value) {
  if (
    this.tagName === "SCRIPT" &&
    String(name).toLowerCase() === "src" &&
    String(value).startsWith("http")
  ) {
    return origSetAttribute.call(
      this,
      "src",
      "/elements/linkedin-embed/test/does-not-exist.js",
    );
  }
  return origSetAttribute.call(this, name, value);
};
after(() => {
  Element.prototype.setAttribute = origSetAttribute;
});

// the element assigns script.src through the property setter, so the src
// descriptor on HTMLScriptElement is patched the same way as well
const scriptSrcDescriptor = Object.getOwnPropertyDescriptor(
  HTMLScriptElement.prototype,
  "src",
);
Object.defineProperty(HTMLScriptElement.prototype, "src", {
  ...scriptSrcDescriptor,
  set(value) {
    if (String(value).startsWith("http")) {
      return scriptSrcDescriptor.set.call(
        this,
        "/elements/linkedin-embed/test/does-not-exist.js",
      );
    }
    return scriptSrcDescriptor.set.call(this, value);
  },
});
after(() => {
  Object.defineProperty(
    HTMLScriptElement.prototype,
    "src",
    scriptSrcDescriptor,
  );
});

describe("linkedin-embed test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<linkedin-embed></linkedin-embed>`);
  });

  describe("Basic instantiation and properties", () => {
    it("element is an instance of LinkedinEmbed", async () => {
      expect(element).to.be.instanceOf(LinkedinEmbed);
    });

    it("has correct tag name", async () => {
      expect(LinkedinEmbed.tag).to.equal("linkedin-embed");
    });

    it("element has correct default properties", async () => {
      const el = await fixture(html`<linkedin-embed></linkedin-embed>`);
      expect(el.vanityname).to.equal("btopro");
      expect(el.locale).to.equal("en_US");
      expect(el._responsiveSize).to.equal("large");
      expect(el._prefersDark).to.be.false;
      expect(el._haxstate).to.be.false;
    });

    it("has haxProperties pointing at its schema file", async () => {
      expect(LinkedinEmbed.haxProperties).to.be.a("string");
      expect(LinkedinEmbed.haxProperties).to.include(
        "linkedin-embed.haxProperties.json",
      );
    });
  });

  describe("Rendering and DOM structure", () => {
    it("renders the badge shell with size and theme", async () => {
      const shell = element.renderRoot.querySelector(".badge-shell");
      expect(shell).to.exist;
      expect(shell.getAttribute("data-size")).to.equal("large");
      expect(shell.getAttribute("data-theme")).to.equal("light");
    });

    it("renders a link to the profile as the base state", async () => {
      const link = element.renderRoot.querySelector("a");
      expect(link).to.exist;
      expect(link.getAttribute("href")).to.equal(
        "https://www.linkedin.com/in/btopro",
      );
      expect(link.textContent.trim()).to.equal("View btopro on LinkedIn");
    });

    it("reflects vanityname to the attribute", async () => {
      element.vanityname = "someuser";
      await element.updateComplete;
      await element.updateComplete;
      expect(element.getAttribute("vanityname")).to.equal("someuser");
    });
  });

  describe("Vanity name normalization", () => {
    it("normalizes full profile urls", async () => {
      element.vanityname = "https://www.linkedin.com/in/jane-doe/";
      await element.updateComplete;
      expect(element.vanityname).to.equal("jane-doe");
    });

    it("falls back to the default vanity name for empty values", async () => {
      element.vanityname = "";
      await element.updateComplete;
      expect(element.vanityname).to.equal("btopro");
    });

    it("strips slashes and trims whitespace", async () => {
      element.vanityname = " jane/doe ";
      await element.updateComplete;
      expect(element.vanityname).to.equal("janedoe");
    });

    it("falls back to the default locale when empty", async () => {
      element.locale = "";
      await element.updateComplete;
      expect(element.locale).to.equal("en_US");
    });
  });

  describe("Responsive sizing", () => {
    it("picks small for narrow containers", () => {
      element.__setResponsiveSize(200);
      expect(element._responsiveSize).to.equal("small");
    });

    it("picks medium for mid-sized containers", () => {
      element.__setResponsiveSize(400);
      expect(element._responsiveSize).to.equal("medium");
    });

    it("picks large for wide containers", () => {
      element.__setResponsiveSize(700);
      expect(element._responsiveSize).to.equal("large");
    });

    it("ignores repeated sizes", () => {
      element._responsiveSize = "large";
      element.__setResponsiveSize(800);
      expect(element._responsiveSize).to.equal("large");
    });

    it("watches the container with a ResizeObserver", () => {
      expect(element.__resizeObserver).to.be.instanceOf(ResizeObserver);
    });
  });

  describe("Theme", () => {
    it("returns light theme by default", () => {
      expect(element._effectiveTheme).to.equal("light");
    });

    it("tracks the preferred color scheme", async () => {
      element.__darkModeHandler({ matches: true });
      expect(element._prefersDark).to.be.true;
      expect(element._effectiveTheme).to.equal("dark");
      await element.updateComplete;
      const shell = element.renderRoot.querySelector(".badge-shell");
      expect(shell.getAttribute("data-theme")).to.equal("dark");
    });
  });

  describe("Badge url building", () => {
    it("defaults the badge host for local hostnames", () => {
      expect(element.__generateBaseUrl()).to.equal(
        "https://badges.linkedin.com/",
      );
    });

    it("builds a badge url from state", () => {
      const url = element.__buildBadgeUrl(123);
      expect(url).to.include("https://badges.linkedin.com/profile?");
      expect(url).to.include("locale=en_US");
      expect(url).to.include("badgetype=VERTICAL");
      expect(url).to.include("badgetheme=light");
      expect(url).to.include("uid=123");
      expect(url).to.include("maxsize=large");
      expect(url).to.include("vanityname=btopro");
      expect(url).to.include("trk=profile-badge");
    });
  });

  describe("Callback manager", () => {
    it("registers a global badge callback manager", () => {
      const manager = element.__ensureCallbackManager();
      expect(manager).to.exist;
      expect(manager.handlers).to.be.an("object");
      expect(globalThis.LIBadgeCallback).to.be.a("function");
    });

    it("delivers badge html to the registered handler and cleans up", () => {
      const manager = element.__ensureCallbackManager();
      let delivered = null;
      manager.handlers[999111] = (badgeHtml, badgeUid) => {
        delivered = { badgeHtml, badgeUid };
      };
      globalThis.LIBadgeCallback("<b>badge</b>", 999111);
      expect(delivered).to.deep.equal({
        badgeHtml: "<b>badge</b>",
        badgeUid: 999111,
      });
      expect(manager.handlers[999111]).to.be.undefined;
    });

    it("chains a pre-existing global callback", async () => {
      // reset the manager so a fresh one captures a pre-existing callback
      delete globalThis.__linkedinBadgeCallbackManager;
      const previousCalls = [];
      globalThis.LIBadgeCallback = (badgeHtml) => previousCalls.push(badgeHtml);
      const el = await fixture(html`<linkedin-embed></linkedin-embed>`);
      const manager = el.__ensureCallbackManager();
      let delivered = null;
      manager.handlers[777] = (badgeHtml) => (delivered = badgeHtml);
      globalThis.LIBadgeCallback("<i>badge</i>", 777);
      expect(delivered).to.equal("<i>badge</i>");
      expect(previousCalls).to.deep.equal(["<i>badge</i>"]);
    });

    it("removes pending handlers by uid", () => {
      const manager = element.__ensureCallbackManager();
      manager.handlers[42] = () => {};
      element.__removePendingHandler(42);
      expect(manager.handlers[42]).to.be.undefined;
    });
  });

  describe("Badge requests", () => {
    it("requests badge markup and tracks the pending uid", async () => {
      element.__buildBadgeUrl = (uid) =>
        `/elements/linkedin-embed/test/does-not-exist.js?uid=${uid}`;
      element.__requestBadgeMarkup();
      expect(scriptsMatching("does-not-exist.js").length).to.equal(1);
      expect(element.__lastRequestUid).to.be.a("number");
      const manager = element.__ensureCallbackManager();
      expect(manager.handlers[element.__lastRequestUid]).to.be.a("function");
    });

    it("replaces the pending handler on a new request", async () => {
      element.__buildBadgeUrl = (uid) =>
        `/elements/linkedin-embed/test/does-not-exist.js?uid=${uid}`;
      element.__requestBadgeMarkup();
      const firstUid = element.__lastRequestUid;
      const manager = element.__ensureCallbackManager();
      element.__requestBadgeMarkup();
      expect(manager.handlers[firstUid]).to.be.undefined;
      expect(manager.handlers[element.__lastRequestUid]).to.be.a("function");
    });

    it("cleans up when the badge script fails to load", async () => {
      element.__buildBadgeUrl = (uid) =>
        `/elements/linkedin-embed/test/does-not-exist.js?uid=${uid}`;
      element.__requestBadgeMarkup();
      const uid = element.__lastRequestUid;
      const manager = element.__ensureCallbackManager();
      expect(manager.handlers[uid]).to.be.a("function");
      // wait for the 404 to fire and the cleanup to run
      await aTimeout(300);
      expect(manager.handlers[uid]).to.be.undefined;
      expect(scriptsMatching("does-not-exist.js").length).to.equal(0);
    });

    it("removes the script after it loads", async () => {
      element.__buildBadgeUrl = (uid) =>
        `/elements/linkedin-embed/test/fixture-badge.js?uid=${uid}`;
      element.__requestBadgeMarkup();
      const uid = element.__lastRequestUid;
      await aTimeout(300);
      expect(scriptsMatching("fixture-badge.js").length).to.equal(0);
      // the handler stays registered until the callback delivers the badge
      const manager = element.__ensureCallbackManager();
      expect(manager.handlers[uid]).to.be.a("function");
    });

    it("renders badge html into an isolated iframe", async () => {
      const badgeHost = element.renderRoot.querySelector(".badge-host");
      element.__renderIframeBadge("<p>badge content</p>", badgeHost);
      const iframe = badgeHost.querySelector("iframe");
      expect(iframe).to.exist;
      expect(iframe.getAttribute("frameborder")).to.equal("0");
      expect(iframe.getAttribute("scrolling")).to.equal("no");
      expect(iframe.srcdoc).to.include("<p>badge content</p>");
      // once the srcdoc loads, the iframe is sized to its content
      await aTimeout(300);
      expect(iframe.getAttribute("height")).to.exist;
      expect(iframe.getAttribute("width")).to.exist;
    });

    it("cleans up observers and pending handlers on disconnect", async () => {
      element.__buildBadgeUrl = (uid) =>
        `/elements/linkedin-embed/test/does-not-exist.js?uid=${uid}`;
      element.__requestBadgeMarkup();
      const uid = element.__lastRequestUid;
      element.remove();
      expect(element.__lastRequestUid).to.be.null;
      const manager = element.__ensureCallbackManager();
      expect(manager.handlers[uid]).to.be.undefined;
    });
  });

  describe("HAX integration", () => {
    it("registers edit mode hooks", () => {
      expect(element.haxHooks()).to.deep.equal({
        editModeChanged: "haxeditModeChanged",
        activeElementChanged: "haxactiveElementChanged",
      });
    });

    it("tracks hax edit mode", async () => {
      element.haxeditModeChanged(true);
      expect(element._haxstate).to.be.true;
      await element.updateComplete;
      const shell = element.renderRoot.querySelector(".badge-shell");
      expect(shell.classList.contains("is-editing")).to.be.true;
    });

    it("marks the active element and returns it", () => {
      const el = {};
      expect(element.haxactiveElementChanged(el, true)).to.equal(el);
      expect(element._haxstate).to.be.true;
    });

    it("skips badge requests while editing", async () => {
      element.haxeditModeChanged(true);
      await element.updateComplete;
      element.__buildBadgeUrl = (uid) =>
        `/elements/linkedin-embed/test/should-not-load.js?uid=${uid}`;
      element.vanityname = "someone-else";
      await element.updateComplete;
      await aTimeout(100);
      expect(scriptsMatching("should-not-load.js").length).to.equal(0);
    });
  });

  describe("Accessibility", () => {
    it("passes the a11y audit", async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe("Legacy fallbacks and guards", () => {
    it('skips theme watching when matchMedia is unavailable', () => {
      const original = globalThis.matchMedia
      globalThis.matchMedia = undefined
      const el = document.createElement('linkedin-embed')
      el.__watchPreferredTheme()
      expect(el.__darkModeMediaQuery).to.equal(null)
      globalThis.matchMedia = original
    })

    it('uses the legacy addListener and removeListener APIs', () => {
      const original = globalThis.matchMedia
      const added = []
      const fakeQuery = {
        matches: true,
        addListener(fn) {
          added.push(fn)
        },
        removeListener(fn) {
          const index = added.indexOf(fn)
          if (index > -1) {
            added.splice(index, 1)
          }
        },
      }
      globalThis.matchMedia = () => fakeQuery
      const el = document.createElement('linkedin-embed')
      el.__watchPreferredTheme()
      expect(added.length).to.equal(1)
      expect(el._prefersDark).to.be.true
      el.disconnectedCallback()
      expect(added.length).to.equal(0)
      globalThis.matchMedia = original
    })

    it('does not attach a second resize observer', () => {
      const before = element.__resizeObserver
      element.__watchContainer()
      expect(element.__resizeObserver).to.equal(before)
    })

    it('returns early from badge requests before the badge host renders', () => {
      // simulate the pre-render window: renderRoot exists but has no badge host
      const pending = element.__lastRequestUid
      const root = element.renderRoot
      root.querySelector = () => null
      element.__requestBadgeMarkup()
      delete root.querySelector
      expect(element.__lastRequestUid).to.equal(pending)
      expect(scriptsMatching('badges.linkedin').length).to.equal(0)
    })

    it('returns early from badge requests before the render root exists', () => {
      // a detached element has no renderRoot until its first render commits;
      // requesting a badge that early must not throw or hit the network
      const el = document.createElement('linkedin-embed')
      el.__requestBadgeMarkup()
      expect(el.__lastRequestUid).to.equal(null)
      expect(scriptsMatching('badges.linkedin').length).to.equal(0)
    })

    it('renders the badge when the callback delivers matching html', async () => {
      element.__buildBadgeUrl = (uid) =>
        `/elements/linkedin-embed/test/does-not-exist.js?uid=${uid}`
      element.__requestBadgeMarkup()
      const uid = element.__lastRequestUid
      const manager = element.__ensureCallbackManager()
      const handler = manager.handlers[uid]
      expect(handler).to.be.a('function')
      handler('<b>badge</b>', uid)
      expect(element.__lastRequestUid).to.equal(null)
      const badgeHost = element.renderRoot.querySelector('.badge-host')
      const iframe = badgeHost.querySelector('iframe')
      expect(iframe).to.exist
      expect(iframe.srcdoc).to.include('<b>badge</b>')
      // a callback for a different uid is ignored
      handler('<i>other</i>', uid + 1)
      expect(element.__lastRequestUid).to.equal(null)
      expect(badgeHost.querySelectorAll('iframe').length).to.equal(1)
    })
  });
});
