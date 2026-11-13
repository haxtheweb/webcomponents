globalThis.process = globalThis.process || {
  env: {
    NODE_ENV: "development",
  },
};
import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import { UswdsTheme } from "../uswds-theme.js";
import { DesignSystemManager } from "@haxtheweb/d-d-d/lib/DesignSystemManager.js";
import { USWDS_SYSTEM } from "../lib/UswdsDesignSystem.js";

describe("uswds-theme", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<uswds-theme></uswds-theme>`);
    await element.updateComplete;
  });

  it("is defined with its tag", () => {
    expect(UswdsTheme.tag).to.equal("uswds-theme");
    expect(globalThis.customElements.get("uswds-theme")).to.equal(UswdsTheme);
  });

  it("keeps the HAX content contract and a skip link", () => {
    const root = element.shadowRoot;
    expect(root.querySelector("a.skip-link[href='#contentcontainer']")).to
      .exist;
    expect(root.querySelector("#contentcontainer > #slot > slot")).to.exist;
    expect(root.querySelector("nav site-menu")).to.exist;
  });

  it("makes USWDS the active design system as a DDD dialect", () => {
    expect(DesignSystemManager.active).to.equal(USWDS_SYSTEM);
    expect(DesignSystemManager.systems[USWDS_SYSTEM].extends).to.equal("ddd");
    expect(DesignSystemManager.isActiveCompatible("ddd")).to.be.true;
  });

  it("points DDD tokens at the USWDS palette", () => {
    const styles = globalThis.getComputedStyle(element);
    expect(
      styles.getPropertyValue("--ddd-theme-default-beaverBlue").trim(),
    ).to.not.equal("");
    expect(styles.getPropertyValue("--ddd-font-primary")).to.contain(
      "Source Sans 3",
    );
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

  it("uses a text Menu button like usa-menu-btn", () => {
    const toggle = element.shadowRoot.querySelector("button.menu-btn");
    expect(toggle).to.exist;
    expect(toggle.textContent.trim()).to.be.oneOf(["Menu", "Close"]);
  });

  it("carries no official government banner or identifier", () => {
    const root = element.shadowRoot;
    expect(root.querySelector(".usa-banner, .usa-identifier")).to.equal(null);
    expect(root.textContent).to.not.contain("official website");
  });

  it("passes the a11y audit", async () => {
    // the base theme fades in on first load; axe blends half-faded colors,
    // so wait until the theme is fully shown before measuring contrast
    await waitUntil(
      () => globalThis.getComputedStyle(element).opacity === "1",
      "the theme never finished its first-load fade",
      { timeout: 3000 },
    );
    // with no site loaded the site title is empty, and axe can't follow a
    // skip link into the shadow root; both are covered in a loaded site
    await expect(element).shadowDom.to.be.accessible({
      ignoredRules: ["skip-link", "empty-heading"],
    });
  });
});
