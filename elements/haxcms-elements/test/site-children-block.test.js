// site-children-block follows the site store through MobX autoruns. They
// hold the element from the store, so a removed block must dispose them, and
// a block the HAX editor moves (remove + re-add) must follow the store again.
import { fixture, expect, html } from "@open-wc/testing";
import { store } from "../lib/core/haxcms-site-store.js";
import "../lib/ui-components/blocks/site-children-block.js";

const settle = () => new Promise((r) => setTimeout(r, 30));

describe("site-children-block store subscriptions across removal and moves", () => {
  let savedEditMode;
  before(() => {
    savedEditMode = store.editMode;
  });
  after(() => {
    store.editMode = savedEditMode;
  });

  it("stops following the store when removed and follows it again after a move", async () => {
    store.editMode = false;
    const wrap = await fixture(
      html`<div><site-children-block></site-children-block></div>`,
    );
    const el = wrap.querySelector("site-children-block");
    await settle();
    expect(el.editMode).to.equal(false);
    expect(el.__disposer.length).to.equal(3);

    el.remove();
    expect(el.__disposer.length).to.equal(0);
    store.editMode = true;
    await settle();
    expect(el.editMode).to.equal(false);

    wrap.appendChild(el);
    await settle();
    expect(el.editMode).to.equal(true);
    expect(el.__disposer.length).to.equal(3);
    store.editMode = false;
    await settle();
    expect(el.editMode).to.equal(false);
  });
});
