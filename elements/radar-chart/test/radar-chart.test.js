import { html, fixture, expect } from "@open-wc/testing";
import "../radar-chart.js";

describe("RadarChart test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <radar-chart title="Test chart" scores="3,2,4,3,2,3,5,4,2"></radar-chart>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("draws one spoke and one table row per default category", async () => {
    expect(element.shadowRoot.querySelectorAll("line.axis").length).to.equal(9);
    expect(element.shadowRoot.querySelectorAll("tbody tr").length).to.equal(9);
  });

  it("gives the svg a name and a full text description", async () => {
    const svg = element.shadowRoot.querySelector("svg");
    expect(svg.getAttribute("role")).to.equal("img");
    const desc = element.shadowRoot.querySelector("#desc").textContent;
    expect(desc).to.contain("Legal & Licensing");
    expect(desc).to.contain("3 out of 5");
  });

  it("clamps scores to the scale and ignores missing values", async () => {
    element.maxScore = 4;
    element.scores = [99, -2];
    await element.updateComplete;
    const rows = element._data.rows;
    expect(rows[0].score).to.equal(4);
    expect(rows[1].score).to.equal(0);
    expect(rows[2].score).to.equal(0);
  });

  it("accepts JSON categories and hides the legend with show-legend=false", async () => {
    const el = await fixture(html`
      <radar-chart
        title="Custom"
        categories='["A","B","C","D"]'
        scores="1,2,3,4"
        show-legend="false"
      ></radar-chart>
    `);
    expect(el.shadowRoot.querySelectorAll("line.axis").length).to.equal(4);
    expect(el.shadowRoot.querySelector("ul.legend")).to.equal(null);
  });

  it("explains itself instead of drawing when fewer than 3 categories", async () => {
    element.categories = ["only", "two"];
    await element.updateComplete;
    expect(element.shadowRoot.querySelector("svg")).to.equal(null);
    expect(element.shadowRoot.textContent).to.contain("No categories");
  });
});
