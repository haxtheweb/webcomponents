import { expect } from "@open-wc/testing";
import { DesignSystemManager } from "@haxtheweb/d-d-d/lib/DesignSystemManager.js";
import {
  FUTURE_TRAVELER_SYSTEM,
  registerFutureTravelerDesignSystem,
  activateFutureTravelerDesignSystem,
} from "../lib/FutureTravelerDesignSystem.js";

const tick = () => new Promise((r) => setTimeout(r, 60));

describe("Future Traveler design system", () => {
  let before;

  beforeEach(() => {
    before = DesignSystemManager.active;
  });

  afterEach(() => {
    DesignSystemManager.active = before;
  });

  it("registers as a dialect of DDD without becoming active", () => {
    registerFutureTravelerDesignSystem();
    expect(DesignSystemManager.systems[FUTURE_TRAVELER_SYSTEM]).to.exist;
    expect(DesignSystemManager.active).to.equal(before);
  });

  it("points the DDD identity tokens at its own when active", async () => {
    activateFutureTravelerDesignSystem();
    await tick();
    expect(DesignSystemManager.active).to.equal("future-traveler");
    const cs = globalThis.getComputedStyle(globalThis.document.documentElement);
    expect(
      cs.getPropertyValue("--ddd-theme-default-beaverBlue").trim(),
    ).to.equal("#bc204b");
    expect(cs.getPropertyValue("--ddd-radius-lg").trim()).to.equal("20px");
  });

  it("brings a default palette whose text reads on its colors", async () => {
    activateFutureTravelerDesignSystem();
    await tick();
    const cs = globalThis.getComputedStyle(globalThis.document.documentElement);
    expect(cs.getPropertyValue("--ddd-palette-color-1").trim()).to.equal(
      "#0b0f2b",
    );
    expect(cs.getPropertyValue("--ddd-palette-text-color-1").trim()).to.equal(
      "#ffffff",
    );
  });
});
