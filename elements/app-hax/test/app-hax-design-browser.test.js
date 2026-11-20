import { fixture, expect, html, oneEvent } from "@open-wc/testing";
import "../lib/v2/app-hax-design-browser.js";

// the shapes the dashboard hands the browser: theme items carry the
// themes.json entry, template items carry the skeleton list entry
const items = [
  {
    dataType: "blank",
    machineName: "clean-one",
    useCaseTitle: "Clean One",
    useCaseDescription: "",
    originalData: {
      category: ["Course", "Documentation"],
      layout: "Sidebar",
      acceptsDesignSystems: true,
    },
  },
  {
    dataType: "blank",
    machineName: "carbon-theme",
    useCaseTitle: "Carbon",
    useCaseDescription: "",
    originalData: {
      category: ["Website", "Organization"],
      layout: "Sidebar",
      designSystem: "Carbon",
    },
  },
  {
    dataType: "blank",
    machineName: "papermod-theme",
    useCaseTitle: "PaperMod",
    useCaseDescription: "",
    originalData: {
      category: ["Blog", "Website"],
      layout: "Single column",
      inspiredBy: "Hugo PaperMod",
    },
  },
  {
    dataType: "skeleton",
    machineName: "blog",
    useCaseTitle: "Blog",
    useCaseDescription: "Posts and a journal",
    originalData: { category: ["Blog"], theme: "clean-one", pageCount: 10 },
  },
  {
    dataType: "skeleton",
    machineName: "studio",
    useCaseTitle: "Studio Starter",
    useCaseDescription: "",
    originalData: { category: ["Course"], scope: "user" },
  },
];

async function makeBrowser(kind) {
  const el = await fixture(
    html`<app-hax-design-browser .items=${items}></app-hax-design-browser>`,
  );
  el.show(kind);
  await el.updateComplete;
  return el;
}

const titles = (el) =>
  [...el.shadowRoot.querySelectorAll(".grid app-hax-use-case")].map(
    (c) => c.title,
  );

describe("app-hax-design-browser", () => {
  it("lists only the open tab's items", async () => {
    const el = await makeBrowser("blank");
    expect(titles(el)).to.deep.equal(["Clean One", "Carbon", "PaperMod"]);
  });

  it("drops Website from use cases and defaults the design system to DDD", async () => {
    const el = await makeBrowser("blank");
    expect(el._values(items[1], "useCase")).to.deep.equal(["Organization"]);
    expect(el._values(items[0], "designSystem")).to.deep.equal(["DDD"]);
    expect(el._values(items[1], "designSystem")).to.deep.equal(["Carbon"]);
  });

  it("filters by a facet and ORs values within one group", async () => {
    const el = await makeBrowser("blank");
    el._toggle("layout", "Single column");
    await el.updateComplete;
    expect(titles(el)).to.deep.equal(["PaperMod"]);
    el._toggle("layout", "Sidebar");
    await el.updateComplete;
    expect(titles(el)).to.have.length(3);
  });

  it("templates read layout and design system from their theme", async () => {
    const el = await makeBrowser("skeleton");
    expect(el._values(items[3], "layout")).to.deep.equal(["Sidebar"]);
    // a template whose list entry does not name its theme has no layout
    expect(el._values(items[4], "layout")).to.deep.equal([]);
    expect(el._values(items[4], "source")).to.deep.equal([el.t.yours]);
    expect(el._meta(items[3])).to.equal("Built on Clean One · 10 pages");
    expect(el._meta(items[4])).to.equal("");
  });

  it("searches title, description, tags and facet values", async () => {
    const el = await makeBrowser("blank");
    el.search = "hugo";
    await el.updateComplete;
    expect(titles(el)).to.deep.equal(["PaperMod"]);
    el.search = "nothing-matches-this";
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".empty-state")).to.exist;
  });

  it("hands the pick to the dashboard and closes", async () => {
    const el = await makeBrowser("skeleton");
    const card = el.shadowRoot.querySelector(".grid app-hax-use-case");
    setTimeout(() => card.click());
    const ev = await oneEvent(el, "design-chosen");
    expect(ev.detail.machineName).to.equal("blog");
    expect(el.open).to.equal(false);
  });

  it("passes the a11y audit", async () => {
    const el = await makeBrowser("blank");
    await expect(el).shadowDom.to.be.accessible();
  });
});
