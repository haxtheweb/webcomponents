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
  safeImage,
  lensOf,
  impactIndex,
  impactCuts,
  timelineSteps,
  searchNodes,
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

  it("keeps a many-ink glyph whole as static art, without script", () => {
    const g = parseGlyph(
      '<defs><mask id="a"><path d="M0 0h24v24H0z"/></mask></defs><script>x()</script><path mask="url(#a)" d="M0 0h24v24H0z"/>',
      "0 0 24 24",
    );
    expect(g.shapes).to.equal(undefined);
    expect(g.art.startsWith("data:image/svg+xml;charset=utf-8,")).to.be.true;
    const svgText = decodeURIComponent(g.art.split(",").slice(1).join(","));
    expect(svgText).to.contain("<mask");
    expect(svgText).to.not.contain("script");
    expect(parseGlyph('<text x="1">HAX</text>').art).to.exist;
  });

  it("allows tile art as http(s) or a carried image, nothing else", () => {
    expect(safeImage("data:image/png;base64,AAAA")).to.equal(
      "data:image/png;base64,AAAA",
    );
    expect(safeImage("https://hax.cloud/a.jpg")).to.equal(
      "https://hax.cloud/a.jpg",
    );
    expect(safeImage("data:text/html,<script>x()</script>")).to.equal("#");
    expect(safeImage("javascript:x()")).to.equal("#");
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

  it("reads tiles through lenses from the webs and the outside layers", () => {
    const models = buildWebs({
      webs: {
        main: {
          mmd: MMD,
          json: {
            nodes: {
              b: { links: { repo: "https://github.com/haxtheweb/x" } },
            },
            evidence: { "a>b": ["a talk"] },
          },
        },
      },
    });
    const M = models.main;
    const impact = impactIndex(models);
    expect(impact.b.n).to.equal(2);
    const day = 864e5;
    const now = Date.parse("2026-11-01");
    const iso = (d) => new Date(now - d * day).toISOString().slice(0, 10);
    const ctx = {
      M,
      web: "main",
      layers: {
        fresh: { main: { b: iso(10), c: iso(500) } },
        released: { main: { b: iso(40) } },
      },
      impact,
      cut: impactCuts(M, impact),
      people: new Set(),
      maintainers: new Set(),
      now,
    };
    const b = lensOf("fresh", M.nodes.get("b"), ctx);
    expect(b.band).to.equal("a");
    expect(b.due).to.be.true;
    expect(lensOf("fresh", M.nodes.get("c"), ctx).band).to.equal("c");
    expect(lensOf("fresh", M.nodes.get("a"), ctx)).to.equal(null);
    // b has a link and evidence on a connection; c has nothing
    expect(lensOf("evidence", M.nodes.get("b"), ctx).count).to.equal(2);
    expect(lensOf("evidence", M.nodes.get("c"), ctx).band).to.equal("c");
    expect(lensOf("impact", M.nodes.get("b"), ctx).band).to.equal("a");
    // only code parts have a bus factor
    expect(lensOf("bus", M.nodes.get("b"), ctx).band).to.equal("c");
    expect(lensOf("bus", M.nodes.get("c"), ctx)).to.equal(null);
  });

  it("grows a web year by year, then today and what is planned", () => {
    const M = buildWebs({
      webs: {
        main: {
          mmd: MMD,
          json: {
            nodes: {
              a: { always: true },
              b: { year: 2019, yearNote: "B ships" },
              c: { status: "planned" },
            },
          },
        },
      },
    }).main;
    const words = {
      today: "Today",
      todayCaption: "All of it.",
      next: "Next",
      nextCaption: "Planned next:",
      personJoins: "1 person joins",
      peopleJoin: "{n} people join",
      andMore: "and {n} more",
    };
    const steps = timelineSteps(M, words);
    expect(steps.map((s) => s.label)).to.deep.equal(["2019", "Today", "Next"]);
    expect(steps[0].ids).to.deep.equal(["a", "b"]);
    expect(steps[0].caption).to.equal("B ships.");
    expect(steps[2].caption).to.equal("Planned next: C.");
  });

  it("finds tiles by label first, then by what else they say", () => {
    const M = buildWebs({ webs: { main: { mmd: MMD, json: {} } } }).main;
    expect(searchNodes(M, "c").map((n) => n.id)).to.deep.equal(["c"]);
    // a connection's verb finds both ends
    expect(searchNodes(M, "speaks").map((n) => n.id)).to.deep.equal(["b", "c"]);
    expect(searchNodes(M, "")).to.deep.equal([]);
  });
});
