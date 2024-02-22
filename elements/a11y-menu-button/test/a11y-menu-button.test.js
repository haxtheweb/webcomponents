import { fixture, expect, html } from "@open-wc/testing";
import "../lib/a11y-menu-button-item.js";
import "../a11y-menu-button.js";
describe("a11y-menu-button test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <a11y-menu-button>
        <span slot="button">Menu</span>
        <a11y-menu-button-item href="#top">Anchor</a11y-menu-button-item>
        <a11y-menu-button-item id="button" disabled
          >Button</a11y-menu-button-item
        >
        <a11y-menu-button-item href="../">Link</a11y-menu-button-item>
      </a11y-menu-button>
    `);
  });

  it("basic setup for testing the link case", async () => {
    // case 1 of the menu item
    const item = element.querySelector(
      "a11y-menu-button a11y-menu-button-item[href='../']",
    );
    expect(element).to.exist;
    expect(item.shadowRoot.querySelector("a[role='menuitem']")).to.exist;
    expect(
      item.shadowRoot.querySelector("slot").assignedNodes({ flatten: true })[0]
        .textContent,
    ).to.equal("Link");
    expect(item.href).to.equal("../");
  });
  it("basic setup for testing the button case", async () => {
    // case 2 with a button
    const button = element.querySelector(
      "a11y-menu-button a11y-menu-button-item#button",
    );
    expect(element).to.exist;
    expect(button.shadowRoot.querySelector("button[role='menuitem']")).to.exist;
    expect(
      button.shadowRoot
        .querySelector("slot")
        .assignedNodes({ flatten: true })[0].textContent,
    ).to.equal("Button");
    expect(button.disabled).to.equal(true);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
