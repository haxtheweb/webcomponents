import { expect } from "@open-wc/testing";
import {
  parseWeb,
  attachDetails,
  layoutWeb,
  labelLines,
  glyphFor,
  safeUrl,
  visibleAt,
  buildWebs,
  parseGlyph,
  lerpView,
  easeOut,
} from "../lib/ecosystem-model.js";

const MMD = [
  "flowchart TB",
  '  subgraph hub ["Hub"]',
  '    a(("A"))',
  "  end",
  '  subgraph ring ["Ring"]',
  '    b["B"]',
  '    c[("C")]',
  "  end",
  "  a -->|uses| b",
  "  b -.->|speaks| c",
  "  %%@ group hub tier=0",
  "  %%@ group ring tier=2",
  "  %%@ node b color=beaverBlue icon=hax:hax2022",
].join("\n");

describe("ecosystem-model", () => {
  it("parses tiles, shapes, groups and connection kinds", () => {
    const M = parseWeb(MMD);
    expect(M.errors).to.deep.equal([]);
    expect(M.nodes.get("a").shape).to.equal("circle");
    expect(M.nodes.get("c").shape).to.equal("cyl");
    expect(M.nodes.get("b").color).to.equal("#1e407c");
    expect(M.edges.map((e) => e.kind)).to.deep.equal(["rel", "schema"]);
    expect(M.nodes.get("a").tier).to.equal(0);
  });

  it("reports what it cannot read", () => {
    const M = parseWeb("x -->|y| z\n%%@ node q color=nope");
    expect(M.errors.length).to.be.greaterThan(0);
  });

  it("lays out the same web the same way every time", () => {
    const one = parseWeb(MMD);
    attachDetails(one, {});
    layoutWeb(one);
    const two = parseWeb(MMD);
    attachDetails(two, {});
    layoutWeb(two);
    ["a", "b", "c"].forEach((id) => {
      expect(one.nodes.get(id).x).to.equal(two.nodes.get(id).x);
      expect(one.nodes.get(id).y).to.equal(two.nodes.get(id).y);
    });
  });

  it("lets a portal borrow its look from its home web", () => {
    const webs = buildWebs({
      order: ["main", "sub"],
      webs: {
        main: { mmd: MMD, json: { nodes: { b: { desc: "B in main" } } } },
        sub: {
          mmd: 'flowchart TB\n  subgraph s ["S"]\n    b["b"]\n  end\n  %%@ node b portal',
          json: {},
        },
      },
    });
    const b = webs.sub.nodes.get("b");
    expect(b.label).to.equal("B");
    expect(b.color).to.equal("#1e407c");
    expect(b.doc.desc).to.equal("B in main");
  });

  it("wraps labels, picks readable glyphs and refuses unsafe links", () => {
    expect(labelLines("one two three four", 9)).to.deep.equal([
      "one two",
      "three",
      "four",
    ]);
    expect(glyphFor("#001e44")).to.equal("#fff");
    expect(glyphFor("#ffd100")).to.equal("#000");
    expect(safeUrl("javascript:alert(1)")).to.equal("#");
    expect(safeUrl("https://hax.psu.edu")).to.equal("https://hax.psu.edu");
  });

  it("keeps only basic shapes and geometry from glyph markup", () => {
    const g = parseGlyph(
      '<path d="M0 0h4" fill="#f00" onload="x()"/><a href="javascript:x()"><circle cx="1" cy="2" r="3"/></a><image href="x.png"/>',
      "0 0 4 4",
    );
    expect(g.vb).to.equal("0 0 4 4");
    expect(g.shapes.map((x) => x.tag)).to.deep.equal(["path", "circle"]);
    expect(g.shapes[0].a).to.deep.equal({ d: "M0 0h4", fill: "currentColor" });
    expect(
      parseGlyph('<svg viewBox="0 0 8 8"><rect width="8" height="8"/></svg>')
        .vb,
    ).to.equal("0 0 8 8");
    expect(parseGlyph("<script>x()</script>")).to.equal(null);
  });

  it("eases the camera between views", () => {
    const a = { x: 0, y: 0, w: 100 };
    const b = { x: 100, y: 50, w: 300 };
    expect(lerpView(a, b, 0)).to.deep.equal(a);
    expect(lerpView(a, b, easeOut(1))).to.deep.equal(b);
    expect(easeOut(0.5)).to.be.above(0.5);
  });

  it("shows everything before a tour and builds up during it", () => {
    const steps = [{ ids: ["a"] }, { ids: ["b"] }, { ids: [] }];
    expect(visibleAt(steps, -1)).to.equal(null);
    expect([...visibleAt(steps, 1)]).to.deep.equal(["a", "b"]);
    expect(visibleAt(steps, 2)).to.equal(null);
  });
});
