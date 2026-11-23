// The drawer and its scrim sit on the modal layer (d-d-d docs,
// stacking-order.md): scrim under drawer, both above the editor bar and the
// network bar, both under the tooltip layer.
import { fixture, expect, html } from "@open-wc/testing";
import "../lib/ui-components/layout/site-drawer.js";

const zOf = (node) => Number(globalThis.getComputedStyle(node).zIndex);

describe("site-drawer stacking", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`<site-drawer opened>Menu</site-drawer>`);
    await el.updateComplete;
  });

  it("keeps the scrim under the drawer", () => {
    const drawer = el.shadowRoot.querySelector(".drawer");
    const scrim = el.shadowRoot.querySelector(".scrim");
    expect(zOf(scrim)).to.be.below(zOf(drawer));
  });

  it("sits above the editor bar and network bar, under tooltips, without DDD", () => {
    const drawer = el.shadowRoot.querySelector(".drawer");
    const scrim = el.shadowRoot.querySelector(".scrim");
    expect(zOf(scrim)).to.be.above(10001);
    expect(zOf(drawer)).to.be.below(10100);
  });

  it("moves with --ddd-z-modal", async () => {
    el.style.setProperty("--ddd-z-modal", "20000");
    const drawer = el.shadowRoot.querySelector(".drawer");
    const scrim = el.shadowRoot.querySelector(".scrim");
    expect(zOf(scrim)).to.equal(20005);
    expect(zOf(drawer)).to.equal(20006);
  });
});
