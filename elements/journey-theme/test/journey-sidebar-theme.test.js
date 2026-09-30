import { html, fixture, expect } from "@open-wc/testing";
import "../lib/journey-sidebar-theme.js";
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
    // skip-link target (#contentcontainer) lives in the shadow DOM alongside
    // the link. axe-core resolves skip-link targets via document.getElementById
    // which cannot pierce shadow boundaries, so the rule always fails for
    // shadow-DOM skip-links even though the target exists and is focusable
    // (tabindex="-1"). This is an axe-core limitation, not a markup defect.
    await expect(element).shadowDom.to.be.accessible({
      ignoredRules: ["skip-link"],
    });
  });
});
