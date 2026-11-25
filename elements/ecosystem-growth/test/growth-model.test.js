import { expect } from "@open-wc/testing";
import {
  FILES,
  buildModel,
  themeCost,
  elementLinks,
  seriesValues,
  journeyCost,
  layLattice,
} from "../lib/growth-model.js";

const SRC = new URL("../demo/growth/", import.meta.url).href;

describe("growth model", () => {
  let raw;
  let M;
  before(async () => {
    raw = {};
    for (const f of FILES) {
      raw[f] = await (await fetch(SRC + f + ".json")).json();
    }
    M = buildModel(raw);
  });

  it("places every theme on its own lattice cell", () => {
    const cells = new Set(M.themes.map((t) => t.q + "," + t.r));
    expect(cells.size).to.equal(M.themes.length);
  });

  it("keeps a family next to its base", () => {
    const list = [{ key: "a" }, { key: "b" }];
    list[1].home = list[0];
    layLattice(list, 1);
    const d =
      (Math.abs(list[0].q - list[1].q) +
        Math.abs(list[0].r - list[1].r) +
        Math.abs(list[0].q + list[0].r - list[1].q - list[1].r)) /
      2;
    expect(d).to.equal(1);
  });

  it("prices a theme against the cache", () => {
    const cold = themeCost(M, "clean-two", []);
    const warm = themeCost(M, "clean-two", ["clean-one"]);
    expect(cold.fetchGz).to.equal(cold.firstVisitGz);
    expect(warm.fetchGz).to.be.below(cold.fetchGz);
    expect(warm.fetchGz + warm.alreadyCachedGz).to.equal(warm.firstVisitGz);
    expect(themeCost(M, "not-a-theme", [])).to.equal(null);
  });

  it("lists both directions of an element's dependencies", () => {
    const ddd = elementLinks(M, "d-d-d");
    expect(ddd.usedBy.length).to.be.above(10);
    const vp = elementLinks(M, "video-player");
    expect(vp.dependsOn).to.include("d-d-d");
  });

  it("reads a series between two months", () => {
    const s = seriesValues(M, "themes", "2026-01", "2026-06");
    expect(s.values.length).to.equal(6);
    expect(seriesValues(M, "nope")).to.equal(null);
  });

  it("only fetches what a journey has not cached", () => {
    const steps = journeyCost(
      M,
      [
        { theme: "clean-one", elements: ["media-image"] },
        { theme: "clean-one", elements: ["media-image"] },
      ],
      raw.payload,
    );
    expect(steps[0].fetchGz).to.equal(steps[0].needGz);
    expect(steps[1].fetchGz).to.equal(0);
  });
});
