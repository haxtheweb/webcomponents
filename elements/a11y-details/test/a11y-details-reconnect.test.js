import { fixture, expect, html } from "@open-wc/testing";
import "../a11y-details.js";

// The observer getter used to build a new MutationObserver on every read,
// so disconnectedCallback stopped a fresh one and the observing one kept
// the element alive. The HAX editor moves blocks by removing and re-adding
// them, so a reconnected element must observe again.
describe("a11y-details MutationObserver across removal and moves", () => {
  // queued records prove the observer still watches (takeRecords drains them)
  const watching = (el, observer) => {
    el.appendChild(globalThis.document.createElement("span"));
    const n = observer.takeRecords().length;
    el.lastElementChild.remove();
    observer.takeRecords();
    return n > 0;
  };

  it("keeps one observer per instance, stops it on removal and restarts it on reconnect", async () => {
    const wrap = await fixture(
      html`<div>
        <a11y-details
          ><div slot="summary">Sum</div>
          <div slot="details">Det</div></a11y-details
        >
      </div>`,
    );
    const el = wrap.querySelector("a11y-details");
    await el.updateComplete;
    expect(el.observer).to.equal(el.observer);
    expect(watching(el, el.observer)).to.equal(true);

    el.remove();
    expect(watching(el, el.observer)).to.equal(false);

    wrap.appendChild(el);
    await el.updateComplete;
    expect(watching(el, el.observer)).to.equal(true);
  });
});
