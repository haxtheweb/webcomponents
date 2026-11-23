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
    const order = [
      "base",
      "dropdown",
      "sticky",
      "overlay",
      "modal",
      "tooltip",
      "toast",
    ];
    order.slice(1).forEach((layer, i) => {
      expect(z(layer), `${layer} above ${order[i]}`).to.be.above(z(order[i]));
    });
  });

  it("puts tooltips above modals so a tooltip inside a modal is visible", () => {
    expect(z("tooltip")).to.be.above(z("modal"));
  });

  it("keeps toasts above every other layer", () => {
    expect(z("toast")).to.be.above(z("tooltip"));
  });

  // offsets written as calc(var(--ddd-z-<layer>) + n) must stay inside
  // their layer, or an offset quietly lands on the next one
  it("keeps the modal layer's offsets between the overlay and tooltip layers", () => {
    // - 2 (theme preview panel) up to + 6 (an open drawer)
    expect(z("modal") - 2).to.be.above(z("overlay"));
    expect(z("modal") + 6).to.be.below(z("tooltip"));
  });

  it("keeps a drawer above its scrim and both above the bars on the modal layer", () => {
    const networkBar = z("modal") + 1;
    const scrim = z("modal") + 5;
    const drawer = z("modal") + 6;
    expect(scrim).to.be.above(networkBar);
    expect(drawer).to.be.above(scrim);
  });

  it("keeps the always-on-top offsets under the largest z-index a browser keeps", () => {
    // + 5 is the goggles overlay; browsers clamp at 2147483647
    expect(z("toast") + 5).to.be.below(2147483647);
  });

  it("puts sticky chrome above dropdowns and under every dialog", () => {
    expect(z("sticky")).to.be.above(z("dropdown"));
    expect(z("sticky")).to.be.below(z("modal") - 2);
  });

  it("documents the same values in docs/stacking-order.md", async () => {
    const doc = await (
      await fetch(new URL("../docs/stacking-order.md", import.meta.url))
    ).text();
    [
      "base",
      "dropdown",
      "sticky",
      "overlay",
      "modal",
      "tooltip",
      "toast",
    ].forEach((layer) => {
      const row = doc
        .split("\n")
        .find((line) => line.indexOf("| `--ddd-z-" + layer + "`") === 0);
      expect(row, `a row for --ddd-z-${layer}`).to.be.a("string");
      expect(Number(row.split("|")[2].trim()), layer).to.equal(z(layer));
    });
  });
});
