// hax-image-crop: the in-browser crop editor (haxtheweb/issues#1149)
import { fixture, expect, html, oneEvent, waitUntil } from "@open-wc/testing";
import {
  canCropMime,
  centeredCropRect,
  cropOutputType,
  croppedFileName,
  encodeCrop,
  loadCropImage,
} from "../lib/hax-image-crop.js";

/** a same-origin PNG of the given size, as a blob URL */
async function pngUrl(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const g = canvas.getContext("2d");
  g.fillStyle = "#336699";
  g.fillRect(0, 0, width, height);
  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );
  return URL.createObjectURL(blob);
}

async function sizeOf(blob) {
  const bitmap = await createImageBitmap(blob);
  return { width: bitmap.width, height: bitmap.height };
}

describe("hax-image-crop helpers", () => {
  it("keeps the source format when a canvas can write it", () => {
    expect(cropOutputType("image/jpg")).to.equal("image/jpeg");
    expect(cropOutputType("image/JPEG")).to.equal("image/jpeg");
    expect(cropOutputType("image/webp")).to.equal("image/webp");
    expect(cropOutputType("image/gif")).to.equal("image/png");
    expect(cropOutputType("")).to.equal("image/png");
  });

  it("crops JPG, PNG and WebP only", () => {
    expect(canCropMime("image/jpeg")).to.equal(true);
    expect(canCropMime("image/jpg")).to.equal(true);
    expect(canCropMime("image/png")).to.equal(true);
    expect(canCropMime("image/webp")).to.equal(true);
    expect(canCropMime("image/svg+xml")).to.equal(false);
    expect(canCropMime("image/gif")).to.equal(false);
    expect(canCropMime(undefined)).to.equal(false);
  });

  it("names the crop after the file and its output type", () => {
    expect(croppedFileName("files/rink-banner.jpg", "image/jpeg")).to.equal(
      "rink-banner-cropped.jpg",
    );
    expect(croppedFileName("logo.webp", "image/webp")).to.equal(
      "logo-cropped.webp",
    );
    expect(croppedFileName("anim.gif", "image/gif")).to.equal(
      "anim-cropped.png",
    );
    expect(croppedFileName("", "image/png")).to.equal("image-cropped.png");
  });

  it("centers the largest box of a ratio", () => {
    expect(centeredCropRect(1600, 900, 1)).to.deep.equal({
      x: 350,
      y: 0,
      width: 900,
      height: 900,
    });
    expect(centeredCropRect(800, 800, 16 / 9)).to.deep.equal({
      x: 0,
      y: 175,
      width: 800,
      height: 450,
    });
    // no ratio: the whole image
    expect(centeredCropRect(300, 200, null)).to.deep.equal({
      x: 0,
      y: 0,
      width: 300,
      height: 200,
    });
  });

  it("encodes a crop at its own size and refuses huge ones", async () => {
    const img = await loadCropImage(await pngUrl(120, 80));
    const blob = await encodeCrop(
      img,
      { x: 10, y: 10, width: 50, height: 40 },
      "image/png",
    );
    expect(blob.type).to.equal("image/png");
    expect(await sizeOf(blob)).to.deep.equal({ width: 50, height: 40 });
    let error = null;
    try {
      await encodeCrop(
        img,
        { x: 0, y: 0, width: 5000, height: 5000 },
        "image/png",
      );
    } catch (e) {
      error = e;
    }
    expect(error && error.message).to.equal("too-large");
  });
});

describe("hax-image-crop element", () => {
  let src;
  before(async () => {
    src = await pngUrl(200, 100);
  });

  async function loaded() {
    const el = await fixture(
      html`<hax-image-crop
        style="width: 480px"
        src="${src}"
        file-name="banner.png"
        mime-type="image/png"
        heading="Crop banner.png"
        note="Saves a new file."
      >
        <button slot="actions" type="button">Use</button>
      </hax-image-crop>`,
    );
    await waitUntil(() => el.naturalWidth === 200, "image loads");
    await el.updateComplete;
    return el;
  }

  it("starts on the whole image with the host's heading, note and buttons", async () => {
    const el = await loaded();
    expect(el.cropRect).to.deep.equal({ x: 0, y: 0, width: 200, height: 100 });
    const root = el.shadowRoot;
    expect(root.querySelector(".title").textContent).to.equal(
      "Crop banner.png",
    );
    expect(root.querySelector(".hax-ui-note").textContent).to.contain(
      "Saves a new file.",
    );
    const slot = root.querySelector('slot[name="actions"]');
    expect(slot.assignedElements().length).to.equal(1);
    expect(el.croppedFileName).to.equal("banner-cropped.png");
    await expect(el).shadowDom.to.be.accessible();
  });

  it("choosing an aspect fits the box and announces it", async () => {
    const el = await loaded();
    setTimeout(() => el.setAspect("1:1"));
    const e = await oneEvent(el, "crop-changed");
    expect(el.aspect).to.equal("1:1");
    expect(e.detail.width).to.equal(e.detail.height);
    expect(e.detail.height).to.be.at.most(100);
  });

  it("the crop area moves with the arrow keys", async () => {
    const el = await loaded();
    el.setAspect("1:1");
    await el.updateComplete;
    const area = el.shadowRoot.querySelector(".area");
    const before = el.cropRect.x;
    area.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }),
    );
    await el.updateComplete;
    expect(el.cropRect.x).to.be.below(before);
  });

  it("toBlob makes the cropped image", async () => {
    const el = await loaded();
    el.setAspect("1:1");
    await el.updateComplete;
    const blob = await el.toBlob();
    expect(blob.type).to.equal("image/png");
    expect(await sizeOf(blob)).to.deep.equal({ width: 100, height: 100 });
  });

  it("says when the image can't be loaded", async () => {
    const el = await fixture(
      html`<hax-image-crop src="/no-such-image-1149.png"></hax-image-crop>`,
    );
    await waitUntil(() => el.error, "load error");
    expect(el.error).to.equal(el.t.loadFailed);
    let error = null;
    try {
      await el.toBlob();
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
  });
});
