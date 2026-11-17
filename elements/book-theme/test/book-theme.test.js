globalThis.process = globalThis.process || {
  env: {
    NODE_ENV: "development",
  },
};
import { fixture, expect, html } from "@open-wc/testing";
import { BookTheme } from "../book-theme.js";

describe("book-theme", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<book-theme></book-theme>`);
    await element.updateComplete;
  });

  it("is defined with its tag", () => {
    expect(BookTheme.tag).to.equal("book-theme");
    expect(globalThis.customElements.get("book-theme")).to.equal(BookTheme);
  });

  it("keeps the HAX content contract and a skip link", () => {
    const root = element.shadowRoot;
    expect(root.querySelector("a.skip-link[href='#contentcontainer']")).to
      .exist;
    expect(root.querySelector("#contentcontainer > #slot > slot")).to.exist;
    expect(root.querySelector("nav site-menu")).to.exist;
  });

  it("lists the headings of the page", () => {
    expect(element.shadowRoot.querySelector("site-menu-content")).to.exist;
  });

  it("toggles the site menu from the header button", async () => {
    const toggle = element.shadowRoot.querySelector(".header .tool");
    const before = element.menuOpen;
    toggle.click();
    await element.updateComplete;
    expect(element.menuOpen).to.equal(!before);
    expect(toggle.getAttribute("aria-expanded")).to.equal(
      element.menuOpen ? "true" : "false",
    );
  });

  it("closes an overlaid menu with Escape", async () => {
    element._overlay = true;
    element.menuOpen = true;
    await element.updateComplete;
    element.shadowRoot
      .querySelector(".menu")
      .dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await element.updateComplete;
    expect(element.menuOpen).to.be.false;
  });

  it("leaves a docked menu open on Escape", async () => {
    element._overlay = false;
    element.menuOpen = true;
    await element.updateComplete;
    element.shadowRoot
      .querySelector(".menu")
      .dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await element.updateComplete;
    expect(element.menuOpen).to.be.true;
  });

  it("shows the updated date only when the page has one", async () => {
    const updated = element.shadowRoot.querySelector("[part='page-updated']");
    expect(updated.querySelector("simple-datetime")).to.not.exist;
    element.pageTimestamp = 1736889000;
    await element.updateComplete;
    expect(updated.querySelector("simple-datetime")).to.exist;
  });

  it("passes the a11y audit", async () => {
    // with no site loaded the site title is empty, and axe can't follow a
    // skip link into the shadow root; both are covered in a loaded site
    await expect(element).shadowDom.to.be.accessible({
      ignoredRules: ["skip-link", "empty-heading"],
    });
  });
});
