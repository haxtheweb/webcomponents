import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import "@haxtheweb/replace-tag/replace-tag.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu.js";
import "../clean-one.js";

describe("clean-one learner progress", () => {
  it("opts its site-menu into the progress ring", async () => {
    // site-menu is already defined, so replace-tag copies its attributes in
    // its constructor; show-progress must still reach the site-menu
    const el = await fixture(html`<clean-one></clean-one>`);
    await waitUntil(
      () => el.shadowRoot.querySelector("site-menu"),
      "site-menu replaced in",
      { timeout: 8000 },
    );
    expect(el.siteMenuShowProgress).to.equal(true);
    expect(el.shadowRoot.querySelector("site-menu").showProgress).to.equal(
      true,
    );
  });
});
