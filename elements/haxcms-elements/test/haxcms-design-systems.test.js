import { expect } from "@open-wc/testing";
import { DesignSystemManager } from "@haxtheweb/d-d-d/lib/DesignSystemManager.js";
import {
  HAXCMS_DESIGN_SYSTEMS,
  activateSiteDesignSystem,
  siteDesignSystemName,
  themeSupportsDesignSystems,
} from "../lib/core/utils/haxcms-design-systems.js";

// haxtheweb/issues#3350: a site picks its design system separately from
// its theme. These pin the parts the site builder, theme preview and
// appearance settings share.
class DesignSystemProbeTheme extends HTMLElement {
  static get designSystems() {
    return "any";
  }
}
class OwnSystemProbeTheme extends HTMLElement {}
if (!globalThis.customElements.get("ds-probe-any-theme")) {
  globalThis.customElements.define(
    "ds-probe-any-theme",
    DesignSystemProbeTheme,
  );
  globalThis.customElements.define("ds-probe-own-theme", OwnSystemProbeTheme);
}

describe("haxcms design systems", () => {
  afterEach(() => {
    DesignSystemManager.active = "ddd";
  });

  it("only themes that opt in take a site design system", () => {
    expect(themeSupportsDesignSystems("ds-probe-any-theme")).to.be.true;
    expect(themeSupportsDesignSystems("ds-probe-own-theme")).to.be.false;
    expect(themeSupportsDesignSystems("not-defined-theme")).to.be.false;
    expect(themeSupportsDesignSystems("")).to.be.false;
  });

  it("resolves site data to a shipped system or plain DDD", () => {
    expect(siteDesignSystemName({ designSystem: "Carbon" })).to.equal("carbon");
    expect(siteDesignSystemName({ designSystem: "nope" })).to.equal("ddd");
    expect(siteDesignSystemName(null)).to.equal("ddd");
  });

  it("imports the chosen system and makes it active", async () => {
    expect(await activateSiteDesignSystem("patternfly")).to.be.true;
    expect(DesignSystemManager.active).to.equal("patternfly");
    expect(await activateSiteDesignSystem("not-shipped")).to.be.false;
    expect(DesignSystemManager.active).to.equal("patternfly");
  });

  it("every registry entry loads and activates", async () => {
    for (const system of HAXCMS_DESIGN_SYSTEMS) {
      expect(await activateSiteDesignSystem(system.name), system.name).to.be
        .true;
      expect(DesignSystemManager.active).to.equal(system.name);
    }
  });
});
