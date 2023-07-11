import { fixture, expect, html } from "@open-wc/testing";

import "../chartist-render.js";

describe("chartist-render test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<chartist-render id="pie-chart" 
      type="pie"
      scale="ct-square">
      <h3 slot="heading">A pie chart of favorite pies (chart)</h3>
      <table>
        <caption>A pie chart of favorite pies (table)</caption>
        <thead>
          <tr>
            <th scope="col">Key Lime</th>
            <th scope="col">Lemon Merangue</th>
            <th scope="col">Apple</th>
            <th scope="col">Pumpkin</th>
            <th scope="col">Cherry</th>
            <th scope="col">Pecan</th>
          </tr></thead>
        <tbody>
          <tr><td>23</td><td>15</td><td>40</td><td>30</td><td>12</td><td>20</td></tr>
        </tbody>
      </table>
    </chartist-render>`
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

