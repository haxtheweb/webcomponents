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

  it("offers the same web as lists", async () => {
    element.listView = true;
    await element.updateComplete;
    expect(element.shadowRoot.querySelectorAll(".list button").length).to.equal(
      3,
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
