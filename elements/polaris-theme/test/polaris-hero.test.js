import { fixture, expect, html } from "@open-wc/testing";
import { PolarisHero } from "../lib/polaris-hero.js";

describe("polaris-hero", () => {
  it("registers and has the header banner's defaults", async () => {
    const el = await fixture(html`<polaris-hero></polaris-hero>`);
    expect(PolarisHero.tag).to.equal("polaris-hero");
    expect(el.fade).to.equal("blue");
    expect(el.height).to.equal("tall");
    expect(el.fullWidth).to.equal(false);
    expect(el.shadowRoot.querySelector(".hero").dataset.fade).to.equal("blue");
  });

  it("draws an image with the focal point as its object-position", async () => {
    const el = await fixture(
      html`<polaris-hero
        source="photo.png"
        alt="Rows of crops"
        focal-x="76"
        focal-y="28"
      ></polaris-hero>`,
    );
    const img = el.shadowRoot.querySelector("img");
    expect(img).to.exist;
    expect(img.getAttribute("alt")).to.equal("Rows of crops");
    expect(img.style.objectPosition).to.equal("76% 28%");
  });

  it("clamps the focal point to the image", async () => {
    const el = await fixture(
      html`<polaris-hero
        source="a.jpg"
        focal-x="140"
        focal-y="-5"
      ></polaris-hero>`,
    );
    expect(el.shadowRoot.querySelector("img").style.objectPosition).to.equal(
      "100% 0%",
    );
  });

  it("shows the heading and slotted text over the media", async () => {
    const el = await fixture(
      html`<polaris-hero source="a.webp" heading="Open house"
        ><p>Tour the plots.</p></polaris-hero
      >`,
    );
    await el.updateComplete;
    expect(el.mediaType).to.equal("image");
    expect(el.shadowRoot.querySelector("h2").textContent).to.equal(
      "Open house",
    );
    expect(el.shadowRoot.querySelector(".content").hidden).to.equal(false);
  });

  it("hides the text area when there is no heading or text", async () => {
    const el = await fixture(
      html`<polaris-hero source="a.jpg"></polaris-hero>`,
    );
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".content").hidden).to.equal(true);
  });

  it("keeps a fade under text even when the fade is set to none", async () => {
    const el = await fixture(
      html`<polaris-hero
        source="a.jpg"
        heading="Hi"
        fade="none"
      ></polaris-hero>`,
    );
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".hero").dataset.fade).to.equal(
      "bottom",
    );
    // the author's choice is kept, so it applies again once the text is gone
    expect(el.fade).to.equal("none");
    el.heading = "";
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".hero").dataset.fade).to.equal("none");
  });

  it("plays a video with a pause button", async () => {
    const el = await fixture(
      html`<polaris-hero source="clip.mp4"></polaris-hero>`,
    );
    expect(el.mediaType).to.equal("video");
    const video = el.shadowRoot.querySelector("video");
    expect(video).to.exist;
    expect(video.getAttribute("aria-hidden")).to.equal("true");
    const button = el.shadowRoot.querySelector(".media-control");
    const was = el.playing;
    el._toggleVideo();
    await el.updateComplete;
    expect(el.playing).to.equal(!was);
    expect(button.getAttribute("label")).to.equal(
      el.playing ? "Pause background video" : "Play background video",
    );
  });

  it("reflects full-width so it can break out of the content column", async () => {
    const el = await fixture(
      html`<polaris-hero source="a.jpg" full-width></polaris-hero>`,
    );
    expect(el.hasAttribute("full-width")).to.equal(true);
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<polaris-hero source="photo.png" heading="Open house"
        ><p>Tour the plots.</p></polaris-hero
      >`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });
});
