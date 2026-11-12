import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "../ecosystem-web.js";

const BUNDLE = {
  order: ["main", "sub"],
  webs: {
    main: {
      mmd: [
        "flowchart TB",
        '  subgraph hub ["Hub"]',
        '    people(("People"))',
        "  end",
        '  subgraph pillars ["Pillars"]',
        '    open{{"Free and open"}}',
        "  end",
        '  subgraph parts ["Parts"]',
        '    cms["HAXcms"]',
        "  end",
        "  people ==>|hold| open",
        "  cms -->|keeps| open",
        "  %%@ group hub tier=0",
        "  %%@ group pillars tier=1",
        "  %%@ group parts tier=2",
        "  %%@ node cms icon=hax:hax2022 color=beaverBlue web=sub",
      ].join("\n"),
      json: {
        nodes: { cms: { desc: "The content system." } },
        tours: [
          {
            id: "everyone",
            label: "Everyone",
            scenes: [
              { caption: "People first.", nodes: ["people"] },
              { caption: "Then the pillar.", nodes: ["open"] },
            ],
          },
        ],
      },
    },
    sub: {
      mmd: [
        "flowchart TB",
        '  subgraph hub ["HAXcms"]',
        '    cms["cms"]',
        "  end",
        '  subgraph inside ["Inside"]',
        '    outline["Outline"]',
        "  end",
        "  cms -->|has| outline",
        "  %%@ group hub tier=0",
        "  %%@ node cms portal",
      ].join("\n"),
      json: { meta: { name: "HAXcms", parent: "main" }, nodes: {} },
    },
  },
  slugs: {
    "web:main": "ecosystem",
    "web:sub": "haxcms",
    "tile:main:cms": "ecosystem/haxcms",
    "tour:main:everyone": "tours/everyone",
  },
  icons: {
    "hax:hax2022": {
      vb: "0 0 24 24",
      d: '<path d="M2 2h20v20H2z" onclick="alert(1)"/><script>alert(1)</script>',
    },
  },
};

describe("ecosystem-web", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<ecosystem-web></ecosystem-web>`);
    element.loadBundle(BUNDLE);
    await element.updateComplete;
  });

  it("draws one tile per node and one path per connection", () => {
    expect(element.shadowRoot.querySelectorAll(".node").length).to.equal(3);
    expect(element.shadowRoot.querySelectorAll(".edge").length).to.equal(2);
  });

  it("selects a tile from its attribute and shows its details", async () => {
    element.node = "cms";
    await element.updateComplete;
    const rail = element.shadowRoot.querySelector(".rail");
    expect(rail.textContent).to.contain("The content system.");
    expect(element.shadowRoot.querySelector(".node.sel")).to.exist;
  });

  it("reports the page path for a selected tile", async () => {
    setTimeout(() => {
      element.node = "cms";
    });
    const ev = await oneEvent(element, "ecosystem-web-changed");
    expect(ev.detail.path).to.equal("/ecosystem/haxcms");
  });

  it("opens a sub-web and offers the way back", async () => {
    element.openWeb("sub");
    // the old web fades out before the new one opens
    await new Promise((r) => setTimeout(r, 250));
    await element.updateComplete;
    expect(element.web).to.equal("sub");
    expect(element.shadowRoot.querySelector("h2").textContent).to.equal(
      "HAXcms",
    );
    expect(element.shadowRoot.querySelector(".rail").textContent).to.contain(
      "Back to the",
    );
  });

  it("hides tiles a tour step has not reached", async () => {
    element.pickTour("everyone");
    element.goStep(0);
    await element.updateComplete;
    const off = element.shadowRoot.querySelectorAll(".node.off");
    expect(off.length).to.equal(2);
    expect(element.pathFor("main", "", "everyone", 0)).to.equal(
      "/tours/everyone/step-1",
    );
  });

  it("folds the tours behind one button that names the tour picked", async () => {
    const r = element.shadowRoot;
    const btn = r.querySelector(".tours-toggle");
    expect(btn.getAttribute("aria-expanded")).to.equal("false");
    expect(btn.getAttribute("aria-controls")).to.equal("tourlist");
    btn.click();
    await element.updateComplete;
    expect(btn.getAttribute("aria-expanded")).to.equal("true");
    element.pickTour("everyone");
    await element.updateComplete;
    expect(btn.getAttribute("aria-expanded")).to.equal("false");
    expect(btn.textContent.trim()).to.equal("Tours: Everyone");
  });

  it("offers the same web as lists", async () => {
    element.listView = true;
    await element.updateComplete;
    expect(element.shadowRoot.querySelectorAll(".list button").length).to.equal(
      3,
    );
  });

  it("draws tile glyphs inline from the bundle, without markup it does not know", () => {
    const gl = element.shadowRoot.querySelector(".node .gl");
    expect(gl).to.exist;
    expect(gl.querySelector("path").getAttribute("d")).to.equal(
      "M2 2h20v20H2z",
    );
    expect(gl.querySelector("path").hasAttribute("onclick")).to.be.false;
    expect(element.shadowRoot.querySelector("script")).to.equal(null);
    expect(element.shadowRoot.querySelector("foreignObject")).to.equal(null);
  });

  it("moves the camera without re-rendering and lifts a selected tile's connections", async () => {
    const net = element.shadowRoot.querySelector("svg.net");
    expect(net.getAttribute("viewBox")).to.match(
      /^-?[\d.]+ -?[\d.]+ [\d.]+ [\d.]+$/,
    );
    element.select("cms");
    await element.updateComplete;
    expect(net.classList.contains("focus")).to.be.true;
    const lifted = element.shadowRoot.querySelectorAll(".lift .edge");
    expect(lifted.length).to.equal(1);
    expect(lifted[0].getAttribute("pathLength")).to.equal("1");
    // the lifted copies are for sight only: the real tiles stay the buttons
    expect(
      element.shadowRoot.querySelector(".lift").getAttribute("aria-hidden"),
    ).to.equal("true");
    expect(
      element.shadowRoot.querySelectorAll(".lift [role=button]").length,
    ).to.equal(0);
  });

  it("draws tile art from a web's own images", async () => {
    const b = JSON.parse(JSON.stringify(BUNDLE));
    b.webs.main.mmd += "\n  %%@ node open image=pic";
    b.webs.main.json.images = { pic: "data:image/png;base64,AAAA" };
    element.loadBundle(b);
    await element.updateComplete;
    const img = element.shadowRoot.querySelector(".node image");
    expect(img.getAttribute("href")).to.equal("data:image/png;base64,AAAA");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
