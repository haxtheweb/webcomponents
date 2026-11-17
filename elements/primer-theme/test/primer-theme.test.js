globalThis.process = globalThis.process || {
  env: {
    NODE_ENV: "development",
  },
};
import { fixture, expect, html } from "@open-wc/testing";
import { PrimerTheme } from "../primer-theme.js";
import { DesignSystemManager } from "@haxtheweb/d-d-d/lib/DesignSystemManager.js";
import { PRIMER_SYSTEM } from "../lib/PrimerDesignSystem.js";

describe("primer-theme", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<primer-theme></primer-theme>`);
    await element.updateComplete;
  });

  it("is defined with its tag", () => {
    expect(PrimerTheme.tag).to.equal("primer-theme");
    expect(globalThis.customElements.get("primer-theme")).to.equal(PrimerTheme);
  });

  it("keeps the HAX content contract and a skip link", () => {
    const root = element.shadowRoot;
    expect(root.querySelector("a.skip-link[href='#contentcontainer']")).to
      .exist;
    expect(root.querySelector("#contentcontainer > #slot > slot")).to.exist;
    expect(root.querySelector("nav site-menu")).to.exist;
  });

  it("makes Primer the active design system as a DDD dialect", () => {
    expect(DesignSystemManager.active).to.equal(PRIMER_SYSTEM);
    expect(DesignSystemManager.systems[PRIMER_SYSTEM].extends).to.equal("ddd");
    expect(DesignSystemManager.isActiveCompatible("ddd")).to.be.true;
  });

  it("points DDD tokens at Primer tokens", () => {
    const styles = globalThis.getComputedStyle(element);
    expect(
      styles.getPropertyValue("--ddd-theme-default-beaverBlue").trim(),
    ).to.equal("#0969da");
    expect(styles.getPropertyValue("--ddd-font-primary")).to.contain(
      "Mona Sans",
    );
  });

  it("keeps DDD structure and rounds the corners", () => {
    const styles = globalThis.getComputedStyle(element);
    expect(styles.getPropertyValue("--ddd-spacing-4").trim()).to.equal("16px");
    expect(styles.getPropertyValue("--ddd-radius-sm").trim()).to.equal("6px");
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
