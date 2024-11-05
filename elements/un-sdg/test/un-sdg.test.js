import { html, fixture, expect } from '@open-wc/testing';
import {unSDGGoalData} from "../un-sdg.js";

const goalnum = 4;
describe("UN SDG tests", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <un-sdg
        goal="${goalnum}"
        color-only
      ></un-sdg>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("Number for goal", async () => {
    expect(element.goal).to.equal(goalnum);
  });
  it("Number for goal", async () => {
    expect(element.alt).to.equal(`Goal ${goalnum}: ${unSDGGoalData[goalnum-1].name}`);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
