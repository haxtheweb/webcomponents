import { fixture, expect, html } from "@open-wc/testing";
import "../image-gallery.js";
import "@haxtheweb/media-image/media-image.js";

// print / PDF styles (haxtheweb/issues#3123)
const printRules = (el) =>
  el.constructor.elementStyles
    .map((s) => s.cssText || "")
    .join("\n")
    .split("@media print")
    .slice(1)
    .join("\n");

describe("print styles", () => {
  it("image-gallery prints its slotted images, not the interactive layout", async () => {
    const el = await fixture(
      html`<image-gallery mode="gallery"
        ><media-image source="a.jpg" alt="a"></media-image
        ><media-image source="b.jpg" alt="b"></media-image
      ></image-gallery>`,
    );
    const rules = printRules(el);
    expect(rules).to.include(".gallery-layout");
    expect(rules).to.include(".slot-hidden");
    expect(rules).to.include("break-inside: avoid");
  });

  it("media-image keeps image and caption together and inside the page", async () => {
    const el = await fixture(
      html`<media-image source="a.jpg" alt="a" offset="wide"></media-image>`,
    );
    const rules = printRules(el);
    expect(rules).to.include("break-inside: avoid");
    expect(rules).to.include(':host([offset="wide"])');
  });
});
