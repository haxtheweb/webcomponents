import { fixture, expect, html } from "@open-wc/testing";
import "../lib/ui-components/magic/active-when-visible.js";

// active-when-visible watches itself with an IntersectionObserver. Moving it
// (or removing and adding it again) must leave exactly one observer behind,
// and removing it must stop the one it had.
describe("active-when-visible", () => {
  it("disconnects its observer when removed", async () => {
    const el = await fixture(
      html`<active-when-visible item-id="x"></active-when-visible>`,
    );
    const first = el.observer;
    expect(first).to.be.an.instanceof(IntersectionObserver);
    let disconnected = 0;
    const original = first.disconnect.bind(first);
    first.disconnect = () => {
      disconnected += 1;
      original();
    };
    el.remove();
    expect(disconnected).to.equal(1);
    expect(el.observer).to.equal(null);
  });

  it("replaces, not stacks, its observer when moved", async () => {
    const el = await fixture(
      html`<active-when-visible item-id="x"></active-when-visible>`,
    );
    const first = el.observer;
    const host = el.parentNode;
    host.appendChild(el);
    expect(el.observer).to.be.an.instanceof(IntersectionObserver);
    expect(el.observer).to.not.equal(first);
  });
});
