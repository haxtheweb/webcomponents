globalThis.process = globalThis.process || {
  env: {
    NODE_ENV: "development",
  },
};
import { fixture, expect, html } from "@open-wc/testing";
import { Wysiwyg96Theme } from "../wysiwyg96-theme.js";
import { DesignSystemManager } from "@haxtheweb/d-d-d/lib/DesignSystemManager.js";
import { CLASSIC_DESKTOP_SYSTEM } from "../lib/ClassicDesktopDesignSystem.js";

describe("wysiwyg96-theme", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<wysiwyg96-theme></wysiwyg96-theme>`);
    await element.updateComplete;
    // the base theme stays hidden (so unfocusable) until its first paint
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(() => r())),
    );
    await element.updateComplete;
  });

  afterEach(() => {
    const dialog = element.shadowRoot.querySelector("#viewhtml");
    if (dialog && dialog.open) {
      dialog.close();
    }
  });

  it("is defined with its tag", () => {
    expect(Wysiwyg96Theme.tag).to.equal("wysiwyg96-theme");
    expect(globalThis.customElements.get("wysiwyg96-theme")).to.equal(
      Wysiwyg96Theme,
    );
  });

  it("takes any design system and starts on Classic Desktop", () => {
    expect(Wysiwyg96Theme.acceptsDesignSystems).to.equal(true);
    expect(Wysiwyg96Theme.defaultDesignSystem).to.equal(CLASSIC_DESKTOP_SYSTEM);
    expect(DesignSystemManager.active).to.equal(CLASSIC_DESKTOP_SYSTEM);
    expect(
      DesignSystemManager.systems[CLASSIC_DESKTOP_SYSTEM].extends,
    ).to.equal("ddd");
    expect(DesignSystemManager.isActiveCompatible("ddd")).to.be.true;
  });

  it("points DDD tokens at the classic palette and squares the corners", () => {
    const styles = globalThis.getComputedStyle(element);
    expect(
      styles.getPropertyValue("--ddd-theme-default-beaverBlue").trim(),
    ).to.equal("#000080");
    expect(styles.getPropertyValue("--ddd-radius-sm").trim()).to.equal("0px");
    // DDD's structure stays DDD
    expect(styles.getPropertyValue("--ddd-spacing-4").trim()).to.equal("16px");
  });

  it("keeps the HAX content contract and a skip link", () => {
    const root = element.shadowRoot;
    expect(root.querySelector("a.skip-link[href='#contentcontainer']")).to
      .exist;
    expect(root.querySelector("#contentcontainer > #slot > slot")).to.exist;
    expect(root.querySelector(".explorer site-menu")).to.exist;
    expect(root.querySelector(".menubar site-top-menu")).to.exist;
  });

  it("rolls a window up to its title bar and back", async () => {
    const sys = element.shadowRoot.querySelector(".editor .winbtn.sys");
    expect(sys.getAttribute("aria-expanded")).to.equal("true");
    sys.click();
    await element.updateComplete;
    expect(element.pageRolled).to.equal(true);
    expect(element.shadowRoot.querySelector("#pagebody").hidden).to.equal(true);
    expect(sys.getAttribute("aria-expanded")).to.equal("false");
    sys.click();
    await element.updateComplete;
    expect(element.shadowRoot.querySelector("#pagebody").hidden).to.equal(
      false,
    );
  });

  it("minimizes the page window to a desktop icon and restores it", async () => {
    element.shadowRoot.querySelector(".editor .winbtn.min").click();
    await element.updateComplete;
    expect(element.pageMinimized).to.equal(true);
    const icon = element.shadowRoot.querySelector(".desk-icon");
    expect(icon.closest(".icons").hidden).to.equal(false);
    // focus moves to the icon, the one way back
    await new Promise((r) => setTimeout(r, 0));
    expect(element.shadowRoot.activeElement === icon).to.equal(true);
    icon.click();
    await element.updateComplete;
    expect(element.pageMinimized).to.equal(false);
    expect(icon.closest(".icons").hidden).to.equal(true);
  });

  it("maximizes the page window over Explorer and restores it", async () => {
    const max = element.shadowRoot.querySelector(".editor .winbtn.max");
    max.click();
    await element.updateComplete;
    expect(element.pageMaximized).to.equal(true);
    expect(max.getAttribute("aria-pressed")).to.equal("true");
    expect(element.shadowRoot.querySelector("#explorer").inert).to.equal(true);
    max.click();
    await element.updateComplete;
    expect(element.pageMaximized).to.equal(false);
  });

  it("minimizes Explorer, and the toolbar brings it back", async () => {
    element.explorerOpen = true;
    await element.updateComplete;
    element.shadowRoot.querySelector(".explorer .winbtn.min").click();
    await element.updateComplete;
    expect(element.explorerOpen).to.equal(false);
    element.shadowRoot.querySelector(".toolbar .tool").click();
    await element.updateComplete;
    expect(element.explorerOpen).to.equal(true);
  });

  it("opens View HTML and moves it with the keyboard, kept on screen", async () => {
    await element.openViewHtml();
    const dialog = element.shadowRoot.querySelector("#viewhtml");
    expect(dialog.open).to.equal(true);
    const bar = dialog.querySelector(".titlebar");
    const before = dialog.getBoundingClientRect();
    bar.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
    );
    expect(dialog.classList.contains("moved")).to.equal(true);
    expect(Math.round(dialog.getBoundingClientRect().left)).to.equal(
      Math.min(
        Math.round(before.left + 10),
        Math.round(globalThis.innerWidth - before.width),
      ),
    );
    // far past the edge stays on screen
    for (let i = 0; i < 100; i++) {
      bar.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "ArrowUp",
          shiftKey: true,
          bubbles: true,
        }),
      );
    }
    expect(dialog.getBoundingClientRect().top).to.equal(0);
    element.closeViewHtml();
    expect(dialog.open).to.equal(false);
    // the next time, it opens in the middle again
    expect(dialog.classList.contains("moved")).to.equal(false);
  });

  it("passes the a11y audit", async () => {
    // with no site loaded the site title is empty, and axe can't follow a
    // skip link into the shadow root; both are covered in a loaded site
    await expect(element).shadowDom.to.be.accessible({
      ignoredRules: ["skip-link", "empty-heading"],
    });
  });
});
