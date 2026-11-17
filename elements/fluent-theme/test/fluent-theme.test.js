globalThis.process = globalThis.process || {
  env: {
    NODE_ENV: "development",
  },
};
import { fixture, expect, html } from "@open-wc/testing";
import { FluentTheme } from "../fluent-theme.js";
import { DesignSystemManager } from "@haxtheweb/d-d-d/lib/DesignSystemManager.js";
import { FLUENT_SYSTEM } from "../lib/FluentDesignSystem.js";

describe("fluent-theme", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<fluent-theme></fluent-theme>`);
    await element.updateComplete;
  });

  it("is defined with its tag", () => {
    expect(FluentTheme.tag).to.equal("fluent-theme");
    expect(globalThis.customElements.get("fluent-theme")).to.equal(FluentTheme);
  });

  it("keeps the HAX content contract and a skip link", () => {
    const root = element.shadowRoot;
    expect(root.querySelector("a.skip-link[href='#contentcontainer']")).to
      .exist;
    expect(root.querySelector("#contentcontainer > #slot > slot")).to.exist;
    expect(root.querySelector("nav site-menu")).to.exist;
  });

  it("makes Fluent the active design system as a DDD dialect", () => {
    expect(DesignSystemManager.active).to.equal(FLUENT_SYSTEM);
    expect(DesignSystemManager.systems[FLUENT_SYSTEM].extends).to.equal("ddd");
    expect(DesignSystemManager.isActiveCompatible("ddd")).to.be.true;
  });

  it("points DDD tokens at Fluent tokens", () => {
    const styles = globalThis.getComputedStyle(element);
    expect(
      styles.getPropertyValue("--ddd-theme-default-beaverBlue").trim(),
    ).to.equal("#0f6cbd");
    expect(styles.getPropertyValue("--ddd-font-primary")).to.contain(
      "Segoe UI",
    );
  });

  it("keeps DDD structure and rounds the corners", () => {
    const styles = globalThis.getComputedStyle(element);
    expect(styles.getPropertyValue("--ddd-spacing-4").trim()).to.equal("16px");
    expect(styles.getPropertyValue("--ddd-radius-sm").trim()).to.equal("4px");
  });

  it("toggles the sidebar with the masthead button", async () => {
    const before = element.sidebarOpen;
    element.shadowRoot.querySelector(".header simple-icon-button-lite").click();
    await element.updateComplete;
    expect(element.sidebarOpen).to.equal(!before);
    const toggle = element.shadowRoot.querySelector(
      ".header simple-icon-button-lite",
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
