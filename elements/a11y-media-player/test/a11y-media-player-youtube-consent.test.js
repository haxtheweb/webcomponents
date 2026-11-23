import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import "../a11y-media-player.js";
import { HaxConsent } from "@haxtheweb/utils/lib/hax-consent.js";
import { installOfflineYouTubeStubs } from "./offline-stubs.js";

// keep every youtube / thumbnail request off the real network, and start
// every test as a visitor who has not chosen yet
installOfflineYouTubeStubs({ consent: false });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe("a11y-media-player asks before contacting YouTube", () => {
  beforeEach(() => {
    HaxConsent.set("youtube", null);
  });

  it("shows the header and the consent choice instead of creating the player", async () => {
    const el = await fixture(
      html`<a11y-media-player
        youtube-id="abc123"
        media-title="Gated video"
      ></a11y-media-player>`,
    );
    await el.updateComplete;
    const consent = el.shadowRoot.querySelector("#consent");
    expect(consent).to.not.equal(null);
    expect(consent.getAttribute("role")).to.equal("group");
    expect(el.shadowRoot.querySelector("#consent-allow")).to.not.equal(null);
    expect(el.shadowRoot.querySelector("#playbutton").hidden).to.equal(true);
    expect(el.shadowRoot.querySelector("#controls").hidden).to.equal(true);
    expect(el.shadowRoot.querySelector("#slider").hidden).to.equal(true);
    expect(el.shadowRoot.textContent).to.contain("Gated video");
    // longer than the idle fallback that creates an allowed player
    await sleep(2000);
    expect(el.shadowRoot.querySelector("a11y-media-youtube")).to.equal(null);
    expect(
      globalThis.document.querySelector("#a11y-media-youtube-api"),
    ).to.equal(null);
  });

  it("play() does not reach YouTube before consent", async () => {
    const el = await fixture(
      html`<a11y-media-player youtube-id="abc123"></a11y-media-player>`,
    );
    await el.updateComplete;
    el.play();
    await el.updateComplete;
    expect(el.__playing).to.not.equal(true);
    expect(el.shadowRoot.querySelector("a11y-media-youtube")).to.equal(null);
    expect(el.shadowRoot.activeElement).to.equal(
      el.shadowRoot.querySelector("#consent-allow"),
    );
  });

  it("uses no YouTube thumbnail before consent, and the site's own when given", async () => {
    const el = await fixture(
      html`<a11y-media-player youtube-id="abc123"></a11y-media-player>`,
    );
    expect(el.poster).to.equal(false);
    el.thumbnailSrc = "files/poster.jpg";
    expect(el.poster).to.equal("files/poster.jpg");
  });

  it("Always allow saves the choice and starts this video", async () => {
    const el = await fixture(
      html`<a11y-media-player youtube-id="abc123"></a11y-media-player>`,
    );
    await el.updateComplete;
    el.shadowRoot.querySelector("#consent-allow").click();
    expect(HaxConsent.get("youtube")).to.equal("allow");
    await waitUntil(() => el.youtube, "youtube player created", {
      timeout: 3000,
    });
    expect(el.youtube.autoplay).to.equal(true);
    expect(el.shadowRoot.querySelector("#consent")).to.equal(null);
    expect(el.shadowRoot.querySelector("#controls").hidden).to.equal(false);
    // the embed itself comes from the reduced-cookie host
    await waitUntil(() => el.youtube.__yt, "embed built", { timeout: 3000 });
    expect(el.youtube.__yt.opts.host).to.equal(
      "https://www.youtube-nocookie.com",
    );
  });

  it("opens every other player on the page without starting them", async () => {
    const el = await fixture(
      html`<a11y-media-player youtube-id="abc123"></a11y-media-player>`,
    );
    await el.updateComplete;
    // allowed from another player or the privacy choices
    HaxConsent.set("youtube", "allow");
    await waitUntil(() => el.youtube, "youtube player created", {
      timeout: 3000,
    });
    expect(el.youtube.autoplay).to.equal(false);
  });

  it("goes back behind the choice when consent is withdrawn", async () => {
    HaxConsent.set("youtube", "allow");
    const el = await fixture(
      html`<a11y-media-player youtube-id="abc123"></a11y-media-player>`,
    );
    await el.updateComplete;
    HaxConsent.set("youtube", null);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("#consent")).to.not.equal(null);
  });

  it("links to the site's privacy choices only when the site sets them", async () => {
    const el = await fixture(
      html`<a11y-media-player youtube-id="abc123"></a11y-media-player>`,
    );
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("#consent-choices")).to.equal(null);
    HaxConsent.choicesUrl = "privacy-choices";
    el.requestUpdate();
    await el.updateComplete;
    expect(
      el.shadowRoot.querySelector("#consent-choices").getAttribute("href"),
    ).to.equal("privacy-choices");
    HaxConsent.choicesUrl = null;
  });
});

describe("a11y-media-player never hands YouTube URLs to the HTML5 video", () => {
  it("recognizes YouTube addresses only", async () => {
    const el = await fixture(html`<a11y-media-player></a11y-media-player>`);
    expect(el._isYoutubeSrc("https://www.youtube.com/embed/abc123")).to.equal(
      true,
    );
    expect(el._isYoutubeSrc("https://youtu.be/abc123")).to.equal(true);
    expect(
      el._isYoutubeSrc("https://www.youtube-nocookie.com/embed/abc123"),
    ).to.equal(true);
    expect(el._isYoutubeSrc("files/clip.mp4")).to.equal(false);
    expect(
      el._isYoutubeSrc("https://example.com/youtube.com/clip.mp4"),
    ).to.equal(false);
  });

  it("leaves a YouTube source off the media element, keeping local ones", async () => {
    const el = await fixture(html`<a11y-media-player></a11y-media-player>`);
    el.sources = [
      { src: "https://www.youtube.com/embed/abc123", type: "video/youtube" },
      { src: "files/clip.mp4", type: "video/mp4" },
    ];
    await el.updateComplete;
    const srcs = Array.from(el.querySelectorAll("source")).map((s) =>
      s.getAttribute("src"),
    );
    expect(srcs).to.include("files/clip.mp4");
    expect(srcs.some((s) => s.indexOf("youtube") > -1)).to.equal(false);
  });
});
