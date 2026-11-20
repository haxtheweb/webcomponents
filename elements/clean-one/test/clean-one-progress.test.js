import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import "@haxtheweb/replace-tag/replace-tag.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu.js";
import "../clean-one.js";

describe("clean-one learner progress", () => {
  it("leaves progress to the My learning button, not the site-menu", async () => {
    // learner progress is shown by the My learning button; the menu itself
    // has no per-page marks
    const el = await fixture(html`<clean-one></clean-one>`);
    await waitUntil(
      () => el.shadowRoot.querySelector("site-menu"),
      "site-menu replaced in",
      { timeout: 8000 },
    );
    expect(el.siteMenuShowProgress).to.equal(false);
    expect(el.shadowRoot.querySelector("site-menu").showProgress).to.not.equal(
      true,
    );
  });
});
