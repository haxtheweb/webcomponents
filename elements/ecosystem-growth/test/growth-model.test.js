import { expect } from "@open-wc/testing";
import {
  FILES,
  buildModel,
  themeCost,
  elementLinks,
  seriesValues,
  journeyCost,
  layLattice,
  buildPeople,
  heatAt,
  heatLevel,
  peopleAt,
  DAY,
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

  it("grows contributors out from the root, and their glow fades", async () => {
    const contrib = await (await fetch(SRC + "contributors.json")).json();
    const P = buildPeople(contrib, M.T0, M.T1);
    expect(P.root.key).to.equal(contrib.root);
    expect(P.root.f).to.equal(0);
    const later = P.list.filter((p) => p.kind === "person" && p !== P.root);
    later.forEach((p) => expect(p.f).to.be.within(0.12, 1));
    // a month's work glows, and fades once it is months old
    const one = { act: [[Date.parse("2020-01-15"), 10]] };
    const hot = heatAt(one, Date.parse("2020-01-20"));
    const cold = heatAt(one, Date.parse("2021-01-20"));
    expect(hot).to.be.above(9);
    expect(cold).to.be.below(hot / 10);
    expect(heatAt(one, Date.parse("2019-12-01"))).to.equal(0);
    expect(heatLevel(P.max, P.max)).to.equal(1);
    const now = peopleAt(P, M.T1, 3);
    expect(now.contributors).to.equal(
      contrib.people.filter((p) => p.kind === "person").length,
    );
    expect(now.hottest.length).to.be.at.most(3);
    expect(peopleAt(P, M.T0 - 400 * DAY).contributors).to.be.below(
      now.contributors,
    );
    expect(buildPeople(null, M.T0, M.T1)).to.equal(null);
  });
});
