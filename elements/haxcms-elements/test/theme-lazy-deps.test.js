import { expect, fixture, html } from "@open-wc/testing";
import * as behaviors from "@haxtheweb/editable-table/lib/editable-table-behaviors.js";
import * as styles from "@haxtheweb/editable-table/lib/editable-table-styles.js";
import "../lib/ui-components/active-item/site-active-tags.js";

// HAXcms themes need only the editable-table display styles, and only
// pages with tags need simple-tags; both stay off the first-paint path
describe("theme lazy dependencies", () => {
  it("editable-table-behaviors still exports the very same styles", () => {
    for (const name of [
      "editableTableCellStyles",
      "editableTableStyles",
      "editableTableDisplayStyles",
    ]) {
      expect(behaviors[name], name).to.equal(styles[name]);
    }
    expect(styles.editableTableDisplayStyles.length).to.be.greaterThan(1);
  });

  it("site-active-tags loads simple-tags once it has tags to show", async () => {
    const el = await fixture(html`<site-active-tags></site-active-tags>`);
    el.tags = "alpha, beta";
    await el.updateComplete;
    for (
      let i = 0;
      i < 100 && !globalThis.customElements.get("simple-tag");
      i++
    ) {
      await new Promise((r) => setTimeout(r, 20));
    }
    expect(globalThis.customElements.get("simple-tag")).to.not.equal(undefined);
    await el.updateComplete;
    const tags = el.shadowRoot.querySelectorAll("simple-tag");
    expect(tags.length).to.equal(2);
    expect(tags[0].getAttribute("value")).to.equal("alpha");
  });
});
