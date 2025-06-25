import { html, fixture, expect } from "@open-wc/testing";
import "../journey-sidebar-theme.js";
describe("JourneySidebarTheme test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <journey-sidebar-theme title="title"></journey-sidebar-theme>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
