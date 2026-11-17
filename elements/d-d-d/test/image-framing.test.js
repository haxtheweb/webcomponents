import { expect } from "@open-wc/testing";
import {
  FRAMING_SIZES,
  parseFraming,
  serializeFraming,
  autoFrame,
  placeFrame,
  frameZoom,
  fnv1a,
  framingKey,
  framingSource,
  framingFullUrl,
  framingCutUrl,
  framingCutWidths,
} from "../lib/ImageFraming.js";

// The golden names below are the contract with the backends: haxcms-nodejs
// test/unit/image-framing.test.cjs and haxcms-php ImageFramingTest expect the
// same names for the same framing.
const RECT = { x: 0.12, y: 0, w: 0.763, h: 1 };

describe("ImageFraming", () => {
  it("has the four DDD screen sizes in order", () => {
    expect(FRAMING_SIZES.map((s) => s.id)).to.deep.equal([
      "sm",
      "md",
      "lg",
      "xl",
    ]);
    expect(framingCutWidths("sm")).to.deep.equal([600, 1200]);
    expect(framingCutWidths("xl")).to.deep.equal([1920, 3840]);
  });

  it("names cuts the way the backends do", () => {
    expect(framingKey(RECT)).to.equal("0.120,0.000,0.763,1.000");
    expect(fnv1a("0.120,0.000,0.763,1.000")).to.equal("924e65bf");
    expect(framingCutUrl("files/field-day.jpg", "sm", RECT, 600)).to.equal(
      "files/haxcms-managed/framing/field-day-sm-924e65bf-600w.jpg",
    );
    expect(framingFullUrl("files/field-day.jpg", 1200)).to.equal(
      "files/haxcms-managed/framing/field-day-full-1200w.jpg",
    );
    expect(framingFullUrl("files/photos/Field.PNG", 600)).to.equal(
      "files/haxcms-managed/framing/photos--Field-full-600w.png",
    );
  });

  it("only frames still images under files/", () => {
    expect(framingSource("files/a.jpg")).to.deep.equal({
      stem: "a",
      ext: "jpg",
    });
    [
      "files/a.gif",
      "files/a.svg",
      "files/../a.jpg",
      "files/haxcms-managed/a.jpg",
      "https://example.com/a.jpg",
      "a.jpg",
      "files/.a.jpg",
    ].forEach((s) => expect(framingSource(s), s).to.equal(null));
  });

  it("keeps only well-formed custom framings, in order", () => {
    expect(parseFraming("nope")).to.deep.equal({});
    expect(
      parseFraming({ lg: RECT, zz: RECT, md: { x: 0.5, y: 0, w: 0.8, h: 1 } }),
    ).to.deep.equal({ lg: RECT });
    expect(serializeFraming({ lg: RECT, sm: RECT })).to.equal(
      '{"sm":{"x":0.12,"y":0,"w":0.763,"h":1},"lg":{"x":0.12,"y":0,"w":0.763,"h":1}}',
    );
    expect(serializeFraming({})).to.equal("");
  });

  it("frames automatically the way object-position does", () => {
    // a 1.6 photo in a 1.22 frame: the frame is full height, and x follows
    // the focal point like object-position: 25% 50%
    const r = autoFrame(1.22, 1.6, 0.25, 0.5);
    expect(r.h).to.equal(1);
    expect(r.w).to.be.closeTo(0.7625, 1e-9);
    expect(r.x).to.be.closeTo(0.25 * (1 - 0.7625), 1e-9);
    expect(frameZoom(r, 1.22, 1.6)).to.be.closeTo(1, 1e-9);
  });

  it("zooms around a point and stays in the photo", () => {
    const r = placeFrame(2, 1.6, 0.99, 0.99, 2);
    expect(r.x + r.w).to.be.at.most(1);
    expect(r.y + r.h).to.be.at.most(1);
    expect(frameZoom(r, 2, 1.6)).to.be.closeTo(2, 1e-9);
    // never closer than 300%
    expect(frameZoom(placeFrame(2, 1.6, 0.5, 0.5, 10), 2, 1.6)).to.be.closeTo(
      3,
      1e-9,
    );
  });
});
