import { expect } from "@open-wc/testing";

import {
  DDDBreakpoints,
  DDDContentWidths,
  DDDSidebarWidths,
  DDDContainerWidths,
  DDDLayout,
  dddSizeForWidth,
} from "../lib/DDDLayout.js";
import {
  DDDVariables,
  DDDBreakpoints as ReExported,
} from "../lib/DDDStyles.js";

describe("DDDLayout scales", () => {
  it("breakpoints are ascending and match the shared theme scale", () => {
    expect(DDDBreakpoints).to.deep.equal({
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1440,
    });
    expect(DDDBreakpoints.sm).to.be.below(DDDBreakpoints.md);
    expect(DDDBreakpoints.md).to.be.below(DDDBreakpoints.lg);
    expect(DDDBreakpoints.lg).to.be.below(DDDBreakpoints.xl);
  });

  it("a default sidebar plus content column and two gutters fit within lg", () => {
    // two 24px gutters (--ddd-theme-layout-gutter is --ddd-spacing-6)
    expect(DDDSidebarWidths.md + DDDContentWidths.md + 2 * 24).to.be.at.most(
      DDDBreakpoints.lg,
    );
  });

  it("xl matches the large container width", () => {
    expect(DDDBreakpoints.xl).to.equal(DDDContainerWidths.lg);
  });

  it("container widths are ascending", () => {
    expect(DDDContainerWidths.md).to.be.below(DDDContainerWidths.lg);
  });

  it("scales are frozen so consumers cannot mutate the system", () => {
    expect(Object.isFrozen(DDDBreakpoints)).to.be.true;
    expect(Object.isFrozen(DDDLayout)).to.be.true;
  });

  it("DDDLayout groups every scale", () => {
    expect(DDDLayout.breakpoint).to.equal(DDDBreakpoints);
    expect(DDDLayout.contentWidth).to.equal(DDDContentWidths);
    expect(DDDLayout.sidebarWidth).to.equal(DDDSidebarWidths);
    expect(DDDLayout.containerWidth).to.equal(DDDContainerWidths);
  });

  it("is re-exported from DDDStyles", () => {
    expect(ReExported).to.equal(DDDBreakpoints);
  });
});

describe("dddSizeForWidth", () => {
  it("maps widths to size names at the boundaries", () => {
    expect(dddSizeForWidth(0)).to.equal("xs");
    expect(dddSizeForWidth(599)).to.equal("xs");
    expect(dddSizeForWidth(600)).to.equal("sm");
    expect(dddSizeForWidth(899)).to.equal("sm");
    expect(dddSizeForWidth(900)).to.equal("md");
    expect(dddSizeForWidth(1199)).to.equal("md");
    expect(dddSizeForWidth(1200)).to.equal("lg");
    expect(dddSizeForWidth(1439)).to.equal("lg");
    expect(dddSizeForWidth(1440)).to.equal("xl");
  });

  it("defaults to xs with no width", () => {
    expect(dddSizeForWidth()).to.equal("xs");
  });
});

describe("DDDVariables layout tokens", () => {
  const text = DDDVariables.cssText;

  it("generates breakpoint properties from DDDBreakpoints", () => {
    expect(text).to.include("--ddd-breakpoint-sm: 600px");
    expect(text).to.include("--ddd-breakpoint-md: 900px");
    expect(text).to.include("--ddd-breakpoint-lg: 1200px");
    expect(text).to.include("--ddd-breakpoint-xl: 1440px");
  });

  it("defines content, sidebar and container primitives", () => {
    expect(text).to.include("--ddd-content-width-md: 840px");
    expect(text).to.include("--ddd-sidebar-width-md: 300px");
    expect(text).to.include("--ddd-sidebar-width-rail: var(--ddd-spacing-14)");
    expect(text).to.include("--ddd-container-width-md: 1200px");
  });

  it("defines theme aliases and grid tokens", () => {
    expect(text).to.include(
      "--ddd-theme-content-width: var(--ddd-content-width-md)",
    );
    expect(text).to.include(
      "--ddd-theme-sidebar-width: var(--ddd-sidebar-width-md)",
    );
    expect(text).to.include(
      "--ddd-theme-container-width: var(--ddd-container-width-md)",
    );
    expect(text).to.include("--ddd-theme-layout-gutter: var(--ddd-spacing-6)");
    expect(text).to.include("--ddd-grid-gap: var(--ddd-spacing-4)");
    expect(text).to.include("--ddd-grid-item-spacing: var(--ddd-spacing-4)");
  });
});
