globalThis.process = globalThis.process || {
  env: {
    NODE_ENV: "development",
  },
};
import { fixture, expect, html } from "@open-wc/testing";
import { PatternflyTheme } from "../patternfly-theme.js";
import { DesignSystemManager } from "@haxtheweb/d-d-d/lib/DesignSystemManager.js";
import { PATTERNFLY_SYSTEM } from "../lib/PatternflyDesignSystem.js";

describe("patternfly-theme", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<patternfly-theme></patternfly-theme>`);
    await element.updateComplete;
  });

  it("is defined with its tag", () => {
    expect(PatternflyTheme.tag).to.equal("patternfly-theme");
    expect(globalThis.customElements.get("patternfly-theme")).to.equal(
      PatternflyTheme,
    );
  });

  it("keeps the HAX content contract and a skip link", () => {
    const root = element.shadowRoot;
    expect(root.querySelector("a.skip-link[href='#contentcontainer']")).to
      .exist;
    expect(root.querySelector("#contentcontainer > #slot > slot")).to.exist;
    expect(root.querySelector("nav site-menu")).to.exist;
  });

  it("makes PatternFly the active design system as a DDD dialect", () => {
    expect(DesignSystemManager.active).to.equal(PATTERNFLY_SYSTEM);
    expect(DesignSystemManager.systems[PATTERNFLY_SYSTEM].extends).to.equal(
      "ddd",
    );
    expect(DesignSystemManager.isActiveCompatible("ddd")).to.be.true;
  });

  it("points DDD tokens at PatternFly tokens", () => {
    const styles = globalThis.getComputedStyle(element);
    expect(
      styles.getPropertyValue("--ddd-theme-default-beaverBlue").trim(),
    ).to.equal("#0066cc");
    expect(styles.getPropertyValue("--ddd-font-primary")).to.contain(
      "Red Hat Text",
    );
  });

  it("toggles the sidebar with the masthead button", async () => {
    const before = element.sidebarOpen;
    element.shadowRoot
      .querySelector(".masthead simple-icon-button-lite")
      .click();
    await element.updateComplete;
    expect(element.sidebarOpen).to.equal(!before);
    const toggle = element.shadowRoot.querySelector(
      ".masthead simple-icon-button-lite",
    );
    expect(toggle.getAttribute("aria-expanded")).to.equal(
      element.sidebarOpen ? "true" : "false",
    );
  });

  it("passes the a11y audit", async () => {
    // with no site loaded the site title is empty, and axe can't follow a
    // skip link into the shadow root; both are covered in a loaded site
    await expect(element).shadowDom.to.be.accessible({
      ignoredRules: ["skip-link", "empty-heading"],
    });
  });
});
