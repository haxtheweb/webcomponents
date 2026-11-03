// Tests for site-active-media-banner, the hero media used by polaris-flex
// and clean-portfolio. Covers the pause control for background video.
import { fixture, expect, html } from "@open-wc/testing";
import { emulateMedia } from "@web/test-runner-commands";
import { SiteActiveMediaBanner } from "../lib/ui-components/active-item/site-active-media-banner.js";

async function videoBanner() {
  const el = await fixture(
    html`<site-active-media-banner></site-active-media-banner>`,
  );
  // let the store autorun settle before setting our own source
  await new Promise((r) => setTimeout(r, 0));
  el.mediaSource = "files/hero.mp4";
  await el.updateComplete;
  await el.updateComplete;
  return el;
}

describe("site-active-media-banner", () => {
  afterEach(async () => {
    await emulateMedia({ reducedMotion: "no-preference" });
  });

  it("detects video from the file extension", async () => {
    const el = await videoBanner();
    expect(el.mediaType).to.equal("video");
    expect(el.shadowRoot.querySelector("video")).to.exist;
  });

  it("renders a labelled pause button for background video", async () => {
    await emulateMedia({ reducedMotion: "no-preference" });
    const el = await videoBanner();
    const control = el.shadowRoot.querySelector(".media-control");
    expect(control).to.exist;
    expect(control.localName).to.equal("simple-icon-button-lite");
    expect(control.getAttribute("label")).to.equal("Pause background video");
    expect(control.getAttribute("icon")).to.equal("av:pause-circle-outline");
  });

  it("hides the decorative video from assistive tech", async () => {
    const el = await videoBanner();
    const video = el.shadowRoot.querySelector("video");
    expect(video.getAttribute("aria-hidden")).to.equal("true");
    expect(video.getAttribute("tabindex")).to.equal("-1");
  });

  it("toggles between pause and play from the button", async () => {
    await emulateMedia({ reducedMotion: "no-preference" });
    const el = await videoBanner();
    const control = el.shadowRoot.querySelector(".media-control");
    control.click();
    await el.updateComplete;
    expect(el.playing).to.equal(false);
    expect(control.getAttribute("label")).to.equal("Play background video");
    expect(control.getAttribute("icon")).to.equal("av:play-circle-outline");
    control.click();
    await el.updateComplete;
    expect(el.playing).to.equal(true);
    expect(control.getAttribute("label")).to.equal("Pause background video");
  });

  it("does not toggle when the banner itself is clicked", async () => {
    const el = await videoBanner();
    const before = el.playing;
    el.click();
    await el.updateComplete;
    expect(el.playing).to.equal(before);
  });

  it("starts paused without autoplay when reduced motion is requested", async () => {
    await emulateMedia({ reducedMotion: "reduce" });
    expect(SiteActiveMediaBanner.prefersReducedMotion()).to.equal(true);
    const el = await videoBanner();
    expect(el.playing).to.equal(false);
    expect(el.shadowRoot.querySelector("video").hasAttribute("autoplay")).to.be
      .false;
    expect(
      el.shadowRoot.querySelector(".media-control").getAttribute("label"),
    ).to.equal("Play background video");
  });

  it("keeps the control inside the banner at the end corner", async () => {
    const el = await videoBanner();
    el.style.setProperty("--media-banner-height", "300px");
    el.style.width = "600px";
    await el.updateComplete;
    const banner = el.shadowRoot.querySelector(".media-banner");
    const control = el.shadowRoot.querySelector(".media-control");
    const b = banner.getBoundingClientRect();
    const c = control.getBoundingClientRect();
    expect(Math.round(c.width)).to.equal(48);
    expect(Math.round(c.height)).to.equal(48);
    expect(Math.round(b.right - c.right)).to.equal(16);
    expect(Math.round(b.bottom - c.bottom)).to.equal(16);
  });

  it("renders nothing for an unsupported source", async () => {
    const el = await fixture(
      html`<site-active-media-banner></site-active-media-banner>`,
    );
    await new Promise((r) => setTimeout(r, 0));
    el.mediaSource = "files/notes.pdf";
    await el.updateComplete;
    await el.updateComplete;
    expect(el.mediaType).to.equal("");
    expect(el.shadowRoot.querySelector(".media-control")).to.not.exist;
  });
});
