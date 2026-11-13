globalThis.process = globalThis.process || {
  env: {
    NODE_ENV: "development",
  },
};
import { fixture, expect, html } from "@open-wc/testing";
import { MaterialTheme } from "../material-theme.js";
import { DesignSystemManager } from "@haxtheweb/d-d-d/lib/DesignSystemManager.js";
import { MATERIAL_SYSTEM } from "../lib/MaterialDesignSystem.js";

describe("material-theme", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<material-theme></material-theme>`);
    await element.updateComplete;
  });

  it("is defined with its tag", () => {
    expect(MaterialTheme.tag).to.equal("material-theme");
    expect(globalThis.customElements.get("material-theme")).to.equal(
      MaterialTheme,
    );
  });

  it("keeps the HAX content contract and a skip link", () => {
    const root = element.shadowRoot;
    expect(root.querySelector("a.skip-link[href='#contentcontainer']")).to
      .exist;
    expect(root.querySelector("#contentcontainer > #slot > slot")).to.exist;
    expect(root.querySelector("nav site-menu")).to.exist;
  });

  it("makes Material 3 the active design system as a DDD dialect", () => {
    expect(DesignSystemManager.active).to.equal(MATERIAL_SYSTEM);
    expect(DesignSystemManager.systems[MATERIAL_SYSTEM].extends).to.equal(
      "ddd",
    );
    expect(DesignSystemManager.isActiveCompatible("ddd")).to.be.true;
  });

  it("points DDD tokens at Material 3 tokens", () => {
    const styles = globalThis.getComputedStyle(element);
    expect(
      styles.getPropertyValue("--ddd-theme-default-beaverBlue").trim(),
    ).to.not.equal("");
    expect(styles.getPropertyValue("--ddd-font-primary")).to.contain("Roboto");
  });

  it("keeps DDD structure", () => {
    const styles = globalThis.getComputedStyle(element);
    expect(styles.getPropertyValue("--ddd-spacing-4").trim()).to.equal("16px");
    expect(styles.getPropertyValue("--ddd-font-size-xxs").trim()).to.equal(
      "20px",
    );
  });

  it("toggles the navigation with its button", async () => {
    const before = element.sidebarOpen;
    element.shadowRoot.querySelector(".nav-toggle").click();
    await element.updateComplete;
    expect(element.sidebarOpen).to.equal(!before);
    const toggle = element.shadowRoot.querySelector(".nav-toggle");
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
