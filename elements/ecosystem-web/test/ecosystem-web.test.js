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
        nodes: {
          cms: {
            desc: "The content system.",
            year: 2019,
            yearNote: "HAXcms ships",
            links: { repo: "https://github.com/haxtheweb/haxcms-nodejs" },
          },
          open: { year: 2018, yearNote: "The pillars" },
          people: { always: true },
        },
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
  layers: {
    fresh: { main: { cms: new Date().toISOString().slice(0, 10) } },
    released: { main: { cms: "2020-01-01" } },
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

  it("reads the web through a lens, with a key and a note per tile", async () => {
    const r = element.shadowRoot;
    r.querySelector('[aria-controls="layers"]').click();
    await element.updateComplete;
    const lensBtn = [...r.querySelectorAll("#layers button")].find(
      (b) => b.textContent.trim() === "Freshness",
    );
    lensBtn.click();
    await element.updateComplete;
    expect(element.lens).to.equal("fresh");
    expect(r.querySelector("svg.net.lensing")).to.exist;
    expect(r.querySelector('.node.lens-a[aria-label^="HAXcms"]')).to.exist;
    // main changed long after the last release: a release is due
    expect(r.querySelector(".node.lens-a .lbadge .due")).to.exist;
    expect(r.querySelectorAll(".node.lens-na").length).to.equal(2);
    expect(r.querySelector(".lenskey").textContent).to.contain(
      "Changed in the last 90 days",
    );
    element.node = "cms";
    await element.updateComplete;
    expect(r.querySelector(".lensnote").textContent).to.contain(
      "Main has changed since the last release.",
    );
  });

  it("hides a kind of connection", async () => {
    element.toggleLayer("pillar");
    await element.updateComplete;
    expect(element.shadowRoot.querySelector("svg.net.hide-pillar")).to.exist;
  });

  it("searches the web as a combobox and selects what it finds", async () => {
    const r = element.shadowRoot;
    r.querySelector('[aria-controls="search"]').click();
    await element.updateComplete;
    const q = r.querySelector("#q");
    q.value = "haxc";
    q.dispatchEvent(new Event("input"));
    await element.updateComplete;
    expect(q.getAttribute("aria-expanded")).to.equal("true");
    const opts = r.querySelectorAll('#qres [role="option"]');
    expect(opts.length).to.equal(1);
    expect(q.getAttribute("aria-activedescendant")).to.equal("qo-cms");
    expect(r.querySelector("svg.net.searching .node.match")).to.exist;
    q.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    await element.updateComplete;
    expect(element.node).to.equal("cms");
    expect(r.querySelector("svg.net.searching")).to.equal(null);
  });

  it("grows the web over time and records finishing it", async () => {
    element.pickTour("_time");
    await element.updateComplete;
    const chip = [
      ...element.shadowRoot.querySelectorAll("#tourlist button"),
    ].find((b) => b.textContent.trim() === "Over time");
    expect(chip.getAttribute("aria-pressed")).to.equal("true");
    element.goStep(0);
    await element.updateComplete;
    // 2018 brings the pillar, with the hub that is always shown
    expect(element.shadowRoot.querySelectorAll(".node.off").length).to.equal(1);
    expect(element.shadowRoot.querySelector(".cap").textContent).to.contain(
      "2018",
    );
    setTimeout(() => element.goStep(9));
    const ev = await oneEvent(element, "user-engagement");
    expect(ev.detail.activityDisplay).to.equal("experienced");
    expect(ev.detail.objectName).to.equal("Ecosystem web: Over time");
    expect(ev.detail.resultCompletion).to.be.true;
  });

  it("shows the web's source to authors in the HAX editor", async () => {
    expect(element.shadowRoot.querySelector(".author")).to.equal(null);
    element.haxeditModeChanged(true);
    await element.updateComplete;
    const box = element.shadowRoot.querySelector(".author textarea");
    expect(box.value).to.contain("flowchart TB");
    expect(box.getAttribute("aria-label")).to.equal("hax-ecosystem.mmd");
  });

  it("passes the a11y audit with the strips open", async () => {
    element._toggle("layers");
    element.setLens("evidence");
    await element.updateComplete;
    await expect(element).shadowDom.to.be.accessible();
    element._toggle("search");
    element._q = "o";
    await element.updateComplete;
    await expect(element).shadowDom.to.be.accessible();
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
