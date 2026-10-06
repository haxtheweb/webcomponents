import { fixture, expect, html } from "@open-wc/testing";
import { SpotifyEmbed } from "../spotify-embed.js";

// network stub: iframe src attributes are captured instead of being loaded so
// no request to open.spotify.com ever leaves the test run
const blockedSrcs = [];
const origSetAttribute = Element.prototype.setAttribute;
Element.prototype.setAttribute = function (name, value) {
  if (
    this.tagName === "IFRAME" &&
    String(name).toLowerCase() === "src" &&
    String(value).startsWith("http")
  ) {
    blockedSrcs.push(String(value));
    return origSetAttribute.call(this, "data-blocked-src", String(value));
  }
  return origSetAttribute.call(this, name, value);
};
after(() => {
  Element.prototype.setAttribute = origSetAttribute;
});

describe("elementName test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <spotify-embed
        source="https://open.spotify.com/album/5dRcZuEijcy8xMfSaRjtk8"
        theme="0"
        size="compact"
      ></spotify-embed>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe("spotify-embed source parsing", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<spotify-embed></spotify-embed>`);
  });

  it("defaults its properties", async () => {
    expect(element.source).to.equal(null);
    expect(element.theme).to.equal(null);
    expect(element.size).to.equal("normal");
    expect(element.playlistid).to.equal(null);
    expect(element.type).to.equal(null);
    expect(element.editing).to.equal(false);
  });

  it("parses album sources", async () => {
    element.source = "https://open.spotify.com/album/5dRcZuEijcy8xMfSaRjtk8?si=abc";
    await element.updateComplete;
    expect(element.type).to.equal("album");
    expect(element.playlistid).to.equal("5dRcZuEijcy8xMfSaRjtk8");
  });

  it("parses track sources", async () => {
    element.source = "https://open.spotify.com/track/4uLU6hMCjMG";
    await element.updateComplete;
    expect(element.type).to.equal("track");
    expect(element.playlistid).to.equal("4uLU6hMCjMG");
  });

  it("parses playlist sources", async () => {
    element.source = "https://open.spotify.com/playlist/37i9dQZF1DXcBWIG";
    await element.updateComplete;
    expect(element.type).to.equal("playlist");
    expect(element.playlistid).to.equal("37i9dQZF1DXcBWIG");
  });

  it("parses artist sources", async () => {
    element.source = "https://open.spotify.com/artist/06HL4z0CvFAxyC27";
    await element.updateComplete;
    expect(element.type).to.equal("artist");
    expect(element.playlistid).to.equal("06HL4z0CvFAxyC27");
  });

  it("keeps the id but not a type for unknown sources", async () => {
    element.source = "https://open.spotify.com/user/example";
    await element.updateComplete;
    expect(element.playlistid).to.equal("example");
    expect(element.type).to.equal(null);
  });
});

describe("spotify-embed rendering", () => {
  it("renders the album embed url with size and theme", async () => {
    const el = await fixture(
      html`<spotify-embed
        source="https://open.spotify.com/album/5dRcZuEijcy8xMfSaRjtk8"
        theme="0"
        size="compact"
      ></spotify-embed>`,
    );
    await el.updateComplete;
    const iframe = el.shadowRoot.querySelector("iframe");
    expect(iframe).to.exist;
    expect(iframe.hasAttribute("src")).to.be.false;
    const src = iframe.getAttribute("data-blocked-src");
    expect(src).to.include("https://open.spotify.com/embed/album/5dRcZuEijcy8xMfSaRjtk8");
    expect(src).to.include("theme=0");
    expect(src).to.include("utm_source=generator");
    expect(iframe.getAttribute("height")).to.equal("152");
    expect(iframe.getAttribute("width")).to.equal("100%");
    // the iframe title reflects the embedded item type
    expect(iframe.getAttribute("title")).to.equal("Spotify Album Embed");
    // embed policy: the referrer is always sent, credentialless only on
    // cross-origin isolated pages (this test env is not isolated)
    expect(iframe.getAttribute("referrerpolicy")).to.equal(
      "strict-origin-when-cross-origin",
    );
    expect(iframe.hasAttribute("credentialless")).to.be.false;
    expect(blockedSrcs.includes(src)).to.be.true;
  });

  it("renders normal height and no theme parameter without a theme", async () => {
    const el = await fixture(
      html`<spotify-embed
        source="https://open.spotify.com/track/4uLU6hMCjMG"
      ></spotify-embed>`,
    );
    await el.updateComplete;
    const iframe = el.shadowRoot.querySelector("iframe");
    const src = iframe.getAttribute("data-blocked-src");
    expect(src).to.include("https://open.spotify.com/embed/track/4uLU6hMCjMG");
    expect(src).to.not.include("theme=");
    expect(iframe.getAttribute("height")).to.equal("352");
    expect(iframe.getAttribute("title")).to.equal("Spotify Track Embed");
  });
});

describe("spotify-embed HAX integration", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<spotify-embed></spotify-embed>`);
  });

  it("exposes haxProperties from its lib schema file", () => {
    expect(SpotifyEmbed.haxProperties).to.be.a("string");
    expect(SpotifyEmbed.haxProperties).to.include(
      "lib/spotify-embed.haxProperties.json",
    );
  });

  it("registers the pre process, edit mode and active element hooks", () => {
    expect(element.haxHooks()).to.deep.equal({
      preProcessNodeToContent: "haxpreProcessNodeToContent",
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
    });
  });

  it("clears editing state when converting to content", async () => {
    const node = { editing: true };
    const result = await element.haxpreProcessNodeToContent(node);
    expect(result === node).to.be.true;
    expect(node.editing).to.equal(false);
  });

  it("marks itself and the active element as editing", async () => {
    const target = {};
    const result = element.haxactiveElementChanged(target, true);
    expect(result === target).to.be.true;
    expect(target.editing).to.equal(true);
    expect(element.editing).to.equal(true);
    await element.updateComplete;
    expect(element.hasAttribute("editing")).to.be.true;
  });

  it("tracks hax edit mode changes", async () => {
    element.haxeditModeChanged(true);
    await element.updateComplete;
    expect(element.editing).to.equal(true);
    element.haxeditModeChanged(false);
    await element.updateComplete;
    expect(element.editing).to.equal(false);
    expect(element.hasAttribute("editing")).to.be.false;
  });
});
