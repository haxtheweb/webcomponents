import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import "../github-preview.js";
import "../lib/github-rpg-contributors.js";
import { HaxConsent } from "@haxtheweb/utils/lib/hax-consent.js";

// nothing is requested from GitHub until the visitor allows it
const originalFetch = globalThis.fetch;
let fetched = [];
const ok = (data) => ({
  ok: true,
  json: () => Promise.resolve(data),
  text: () => Promise.resolve("# Readme"),
});

describe("github-preview consent", () => {
  beforeEach(() => {
    HaxConsent.clearAll();
    fetched = [];
    globalThis.fetch = (url) => {
      fetched.push(String(url));
      return Promise.resolve(
        ok({ description: "repo", language: "JavaScript" }),
      );
    };
  });
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });
  after(() => HaxConsent.clearAll());

  it("classes every GitHub host as the github service", () => {
    expect(HaxConsent).to.exist;
    return import("@haxtheweb/utils/lib/hax-consent.js").then((m) => {
      [
        "https://api.github.com/repos/a/b",
        "https://raw.githubusercontent.com/a/b/main/README.md",
        "https://gist.github.com/a/1",
      ].forEach((url) =>
        expect(m.consentServiceForUrl(url).service).to.equal("github"),
      );
      // GitHub Pages sites are their own hosts, not GitHub's service
      expect(
        m.consentServiceForUrl("https://haxtheweb.github.io/").service,
      ).to.equal("embed:haxtheweb.github.io");
    });
  });

  it("shows the panel and requests nothing before consent", async () => {
    const el = await fixture(
      html`<github-preview org="haxtheweb" repo="webcomponents" extended>
      </github-preview>`,
    );
    await aTimeout(20);
    expect(fetched).to.be.empty;
    const gate = el.shadowRoot.querySelector("hax-consent-gate");
    expect(gate.getAttribute("service")).to.equal("github");
    await expect(el).shadowDom.to.be.accessible();
  });

  it("fetches once allowed and asks again when withdrawn", async () => {
    const el = await fixture(
      html`<github-preview org="haxtheweb" repo="webcomponents" extended>
      </github-preview>`,
    );
    HaxConsent.set("github", "allow");
    await aTimeout(20);
    await el.updateComplete;
    expect(fetched).to.include(
      "https://api.github.com/repos/haxtheweb/webcomponents",
    );
    expect(fetched).to.include(
      "https://raw.githubusercontent.com/haxtheweb/webcomponents/master/README.md",
    );
    expect(el.shadowRoot.querySelector("hax-consent-gate")).to.not.exist;
    HaxConsent.set("github", null);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("hax-consent-gate")).to.exist;
  });

  it("an unconfigured card asks nothing and requests nothing", async () => {
    const el = await fixture(html`<github-preview></github-preview>`);
    await aTimeout(20);
    expect(fetched).to.be.empty;
    expect(el.shadowRoot.querySelector("hax-consent-gate")).to.not.exist;
  });

  it("github-rpg-contributors waits for consent too", async () => {
    const el = await fixture(
      html`<github-rpg-contributors org="haxtheweb" repo="webcomponents">
      </github-rpg-contributors>`,
    );
    await aTimeout(20);
    expect(fetched).to.be.empty;
    expect(
      el.shadowRoot.querySelector("hax-consent-gate").getAttribute("service"),
    ).to.equal("github");
    HaxConsent.set("github", "allow");
    await el.updateComplete;
    await aTimeout(20);
    expect(fetched).to.include(
      "https://api.github.com/repos/haxtheweb/webcomponents/contributors",
    );
  });
});
