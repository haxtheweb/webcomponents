globalThis.process = globalThis.process || {
  env: {
    NODE_ENV: "development",
  },
};
import { fixture, expect, html } from "@open-wc/testing";
import { WebawesomeTheme } from "../webawesome-theme.js";
import { DesignSystemManager } from "@haxtheweb/d-d-d/lib/DesignSystemManager.js";
import { WEBAWESOME_SYSTEM } from "../lib/WebawesomeDesignSystem.js";

describe("webawesome-theme", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<webawesome-theme></webawesome-theme>`);
    await element.updateComplete;
  });

  it("is defined with its tag", () => {
    expect(WebawesomeTheme.tag).to.equal("webawesome-theme");
    expect(globalThis.customElements.get("webawesome-theme")).to.equal(
      WebawesomeTheme,
    );
  });

  it("keeps the HAX content contract and a skip link", () => {
    const root = element.shadowRoot;
    expect(root.querySelector("a.skip-link[href='#contentcontainer']")).to
      .exist;
    expect(root.querySelector("#contentcontainer > #slot > slot")).to.exist;
    expect(root.querySelector("nav site-menu")).to.exist;
  });

  it("makes Web Awesome the active design system as a DDD dialect", () => {
    expect(DesignSystemManager.active).to.equal(WEBAWESOME_SYSTEM);
    expect(DesignSystemManager.systems[WEBAWESOME_SYSTEM].extends).to.equal(
      "ddd",
    );
    expect(DesignSystemManager.isActiveCompatible("ddd")).to.be.true;
  });

  it("points DDD tokens at Web Awesome tokens", () => {
    const styles = globalThis.getComputedStyle(element);
    expect(
      styles.getPropertyValue("--ddd-theme-default-beaverBlue").trim(),
    ).to.not.equal("");
    expect(styles.getPropertyValue("--ddd-font-primary")).to.contain(
      "system-ui",
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

  it("renders section links and page tags from the outline", async () => {
    element._topItems = [
      { id: "a", slug: "start", title: "Start" },
      { id: "b", slug: "docs", title: "Docs" },
    ];
    element._currentTop = "b";
    element._activeId = "c";
    element._tags = ["Stable", "Layout"];
    element._lead = "A lead paragraph.";
    await element.updateComplete;
    const root = element.shadowRoot;
    const links = root.querySelectorAll(".sections a");
    expect(links.length).to.equal(2);
    expect(links[0].getAttribute("aria-current")).to.equal("false");
    expect(links[1].getAttribute("aria-current")).to.equal("true");
    expect(root.querySelectorAll(".tags li").length).to.equal(2);
    expect(root.querySelector(".lead").textContent).to.equal(
      "A lead paragraph.",
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
