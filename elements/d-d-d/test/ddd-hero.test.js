import { fixture, expect, html } from "@open-wc/testing";
import { DDDHero } from "../lib/ddd-hero.js";

describe("ddd-hero", () => {
  it("registers and has the header banner's defaults", async () => {
    const el = await fixture(html`<ddd-hero></ddd-hero>`);
    expect(DDDHero.tag).to.equal("ddd-hero");
    expect(el.fade).to.equal("blue");
    expect(el.height).to.equal("tall");
    expect(el.fullWidth).to.equal(false);
    expect(el.shadowRoot.querySelector(".hero").dataset.fade).to.equal("blue");
  });

  it("draws an image with the focal point as its object-position", async () => {
    const el = await fixture(
      html`<ddd-hero
        source="photo.png"
        alt="Rows of crops"
        focal-x="76"
        focal-y="28"
      ></ddd-hero>`,
    );
    const img = el.shadowRoot.querySelector("img");
    expect(img).to.exist;
    expect(img.getAttribute("alt")).to.equal("Rows of crops");
    expect(img.style.objectPosition).to.equal("76% 28%");
  });

  it("clamps the focal point to the image", async () => {
    const el = await fixture(
      html`<ddd-hero source="a.jpg" focal-x="140" focal-y="-5"></ddd-hero>`,
    );
    expect(el.shadowRoot.querySelector("img").style.objectPosition).to.equal(
      "100% 0%",
    );
  });

  it("shows the heading and slotted text over the media", async () => {
    const el = await fixture(
      html`<ddd-hero source="a.webp" heading="Open house"
        ><p>Tour the plots.</p></ddd-hero
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
    const el = await fixture(html`<ddd-hero source="a.jpg"></ddd-hero>`);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".content").hidden).to.equal(true);
  });

  it("keeps a fade under text even when the fade is set to none", async () => {
    const el = await fixture(
      html`<ddd-hero source="a.jpg" heading="Hi" fade="none"></ddd-hero>`,
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
    const el = await fixture(html`<ddd-hero source="clip.mp4"></ddd-hero>`);
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
      html`<ddd-hero source="a.jpg" full-width></ddd-hero>`,
    );
    expect(el.hasAttribute("full-width")).to.equal(true);
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<ddd-hero source="photo.png" heading="Open house"
        ><p>Tour the plots.</p></ddd-hero
      >`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });

  it("serves a cut per framed screen size, and the original's widths", async () => {
    const el = await fixture(
      html`<ddd-hero
        source="files/field-day.jpg"
        framing='{"sm":{"x":0.12,"y":0,"w":0.763,"h":1}}'
      ></ddd-hero>`,
    );
    await el.updateComplete;
    const sources = el.shadowRoot.querySelectorAll("picture source");
    expect(sources.length).to.equal(1);
    expect(sources[0].getAttribute("media")).to.equal("(max-width: 599px)");
    expect(sources[0].getAttribute("srcset")).to.equal(
      "files/haxcms-managed/framing/field-day-sm-924e65bf-600w.jpg 600w, files/haxcms-managed/framing/field-day-sm-924e65bf-1200w.jpg 1200w",
    );
    const img = el.shadowRoot.querySelector("picture img");
    expect(img.getAttribute("src")).to.equal("files/field-day.jpg");
    expect(img.getAttribute("srcset")).to.contain(
      "files/haxcms-managed/framing/field-day-full-600w.jpg 600w",
    );
  });

  it("frames with CSS while editing, for a preview, or when a cut is missing", async () => {
    const el = await fixture(
      html`<ddd-hero
        source="files/field-day.jpg"
        framing='{"lg":{"x":0.1,"y":0.2,"w":0.5,"h":0.5}}'
      ></ddd-hero>`,
    );
    el.haxeditModeChanged(true);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("picture")).to.equal(null);
    const style = el.shadowRoot.querySelector("style").textContent;
    expect(style).to.contain("(min-width: 900px) and (max-width: 1439px)");
    expect(style).to.contain("width: calc(100% / 0.5)");
    el.haxeditModeChanged(false);
    el.previewSize = "lg";
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("picture")).to.equal(null);
    expect(el.shadowRoot.querySelector("style").textContent).to.not.contain(
      "@media",
    );
    el.previewSize = "";
    await el.updateComplete;
    el.shadowRoot
      .querySelector("picture img")
      .dispatchEvent(new Event("error"));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("picture")).to.equal(null);
  });

  it("puts Frame on the block toolbar for images", async () => {
    const el = await fixture(html`<ddd-hero source="a.jpg"></ddd-hero>`);
    const menu = {};
    el.haxinlineContextMenu(menu);
    expect(menu.ceButtons[0].callback).to.equal("haxFrame");
    let detail = null;
    const listen = (e) => (detail = e.detail);
    globalThis.addEventListener("hax-image-framing-open", listen);
    el.haxFrame();
    globalThis.removeEventListener("hax-image-framing-open", listen);
    expect(detail.element).to.equal(el);
    const video = await fixture(html`<ddd-hero source="a.mp4"></ddd-hero>`);
    const none = {};
    video.haxinlineContextMenu(none);
    expect(none.ceButtons).to.equal(undefined);
  });

  it("gives the frames for its height", async () => {
    const el = await fixture(html`<ddd-hero height="short"></ddd-hero>`);
    const frames = el.framingFrames();
    expect(frames.map((f) => [f.id, f.height])).to.deep.equal([
      ["sm", 220],
      ["md", 220],
      ["lg", 280],
      ["xl", 280],
    ]);
  });
});
