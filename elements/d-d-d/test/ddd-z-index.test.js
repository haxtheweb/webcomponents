import { expect } from "@open-wc/testing";
import { DDDVariables } from "../lib/DDDStyles.js";

const z = (name) => {
  const m = new RegExp(`--ddd-z-${name}:\\s*(-?\\d+)`).exec(
    DDDVariables.cssText,
  );
  return m ? Number(m[1]) : NaN;
};

describe("DDD z-index scale", () => {
  it("stacks every layer above the one before it", () => {
    const order = ["base", "dropdown", "sticky", "overlay", "modal", "tooltip"];
    order.slice(1).forEach((layer, i) => {
      expect(z(layer), `${layer} above ${order[i]}`).to.be.above(z(order[i]));
    });
  });

  it("puts tooltips above modals so a tooltip inside a modal is visible", () => {
    expect(z("tooltip")).to.be.above(z("modal"));
  });
});
