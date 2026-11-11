import { fixture, expect, html } from "@open-wc/testing";
import "../a11y-tabs.js";
import "../lib/a11y-tab.js";

// The observer getter used to build a new MutationObserver on every read,
// so disconnectedCallback stopped a fresh one and the observing one kept
// the element alive. The HAX editor moves blocks by removing and re-adding
// them, so a reconnected element must observe again.
describe("a11y-tabs MutationObserver across removal and moves", () => {
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
        <a11y-tabs
          ><a11y-tab id="t1" label="One">One</a11y-tab
          ><a11y-tab id="t2" label="Two">Two</a11y-tab></a11y-tabs
        >
      </div>`,
    );
    const el = wrap.querySelector("a11y-tabs");
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

describe("a11y-tab MutationObserver across removal and moves", () => {
  it("keeps one observer per tab, stops it on removal and restarts it on reconnect", async () => {
    const wrap = await fixture(
      html`<a11y-tabs><a11y-tab id="t1" label="One">One</a11y-tab></a11y-tabs>`,
    );
    const tab = wrap.querySelector("a11y-tab");
    await tab.updateComplete;
    const watching = () => {
      tab.appendChild(globalThis.document.createElement("span"));
      const n = tab.observer.takeRecords().length;
      tab.lastElementChild.remove();
      tab.observer.takeRecords();
      return n > 0;
    };
    expect(tab.observer).to.equal(tab.observer);
    expect(watching()).to.equal(true);
    tab.remove();
    expect(watching()).to.equal(false);
    wrap.appendChild(tab);
    expect(watching()).to.equal(true);
  });
});
