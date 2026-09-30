import { fixture, expect, html } from "@open-wc/testing";
import "../promise-progress.js";
import { PromiseProgressLite } from "../lib/promise-progress-lite.js";
import "../lib/wc-preload-progress.js";

const flush = (ms = 60) => new Promise((r) => setTimeout(r, ms));

// controllable promise so we can drive process() step by step
function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise: promise, resolve: resolve, reject: reject };
}

describe("promise-progress-lite behavior", () => {
  it("exposes the expected static tag", () => {
    expect(PromiseProgressLite.tag).to.equal("promise-progress-lite");
  });

  it("has sensible defaults", async () => {
    const el = await fixture(
      html`<promise-progress-lite></promise-progress-lite>`,
    );
    expect(el.list.length).to.equal(0);
    expect(el.value).to.equal(0);
    expect(el.max).to.equal(100);
    expect(el.showCount).to.equal(false);
    expect(el.canLoad).to.equal(false);
  });

  it("renders a native progress element wired to max/value", async () => {
    const el = await fixture(
      html`<promise-progress-lite></promise-progress-lite>`,
    );
    const bar = el.shadowRoot.querySelector('progress[part="progress"]');
    expect(bar).to.exist;
    expect(bar.getAttribute("max")).to.equal("100");
    expect(bar.getAttribute("value")).to.equal("0");
    // firstUpdated captured the loading bar for later updates
    expect(el.loadingBar.tagName).to.equal("PROGRESS");
  });

  it("reflects value as an attribute and renders it into the bar", async () => {
    const el = await fixture(
      html`<promise-progress-lite></promise-progress-lite>`,
    );
    el.value = 40;
    await el.updateComplete;
    expect(el.getAttribute("value")).to.equal("40");
    expect(el.shadowRoot.querySelector("progress").getAttribute("value")).to.equal(
      "40",
    );
  });

  it("renders the counter text only when show-count is on", async () => {
    let el = await fixture(
      html`<promise-progress-lite></promise-progress-lite>`,
    );
    expect(el.shadowRoot.textContent.includes("0 / 100")).to.equal(false);
    el = await fixture(
      html`<promise-progress-lite show-count></promise-progress-lite>`,
    );
    expect(el.showCount).to.equal(true);
    expect(el.shadowRoot.textContent.includes("0 / 100")).to.equal(true);
  });

  it("notifies value and max changes as custom events", async () => {
    const el = await fixture(
      html`<promise-progress-lite></promise-progress-lite>`,
    );
    const seen = [];
    el.addEventListener("value-changed", (e) => seen.push(["value", e.detail.value]));
    el.addEventListener("max-changed", (e) => seen.push(["max", e.detail.value]));
    el.value = 40;
    await el.updateComplete;
    el.max = 200;
    await el.updateComplete;
    expect(seen.length).to.equal(2);
    expect(seen[0][0]).to.equal("value");
    expect(seen[0][1]).to.equal(40);
    expect(seen[1][0]).to.equal("max");
    expect(seen[1][1]).to.equal(200);
  });

  it("arms canLoad once a non-empty list arrives", async () => {
    const el = await fixture(
      html`<promise-progress-lite></promise-progress-lite>`,
    );
    expect(el.canLoad).to.equal(false);
    el.list = [() => Promise.resolve(1)];
    await el.updateComplete;
    expect(el.canLoad).to.equal(true);
  });

  it("process is a no-op without a list (canLoad stays false)", async () => {
    const el = await fixture(
      html`<promise-progress-lite></promise-progress-lite>`,
    );
    let finished = 0;
    el.addEventListener("promise-progress-finished", () => finished++);
    await el.process();
    await flush(150);
    expect(el.value).to.equal(0);
    expect(el.loadingBar.textContent).to.equal("");
    expect(finished).to.equal(0);
  });

  it("process ticks value per completed item and finishes", async () => {
    const el = await fixture(
      html`<promise-progress-lite></promise-progress-lite>`,
    );
    const one = deferred();
    const two = deferred();
    let finished = 0;
    const valueEvents = [];
    el.addEventListener("promise-progress-finished", (e) => {
      finished++;
      finishedDetail = e.detail.value;
    });
    let finishedDetail = null;
    el.addEventListener("value-changed", (e) => valueEvents.push(e.detail.value));
    el.list = [() => one.promise, () => two.promise];
    await el.updateComplete;
    const done = el.process();
    // first item resolves: half way through the list
    one.resolve("a");
    await flush(20);
    expect(el.value).to.equal(50);
    expect(el.loadingBar.textContent).to.equal("Loading 50 of 100");
    // second item resolves: full way through
    two.resolve("b");
    await flush(20);
    expect(el.value).to.equal(100);
    await done;
    await flush(150);
    expect(el.loadingBar.textContent).to.equal("Loading Finished");
    expect(finished).to.equal(1);
    expect(finishedDetail).to.equal(true);
    expect(valueEvents.includes(50)).to.equal(true);
    expect(valueEvents.includes(100)).to.equal(true);
  });

  it("BUG(lib/promise-progress-lite.js:124,128): process() reports 100% and completion even when every item rejects", async () => {
    // resolve() and reject() are referenced inside the per-item handlers but
    // never defined anywhere; the resulting ReferenceError is silently
    // swallowed by Promise.allSettled, so failures are indistinguishable from
    // successes by the time the finished event fires.
    const el = await fixture(
      html`<promise-progress-lite></promise-progress-lite>`,
    );
    let finished = 0;
    el.addEventListener("promise-progress-finished", () => finished++);
    el.list = [
      () => Promise.reject(new Error("boom 0")),
      () => Promise.reject(new Error("boom 1")),
    ];
    await el.updateComplete;
    await el.process();
    await flush(150);
    expect(el.value).to.equal(100);
    expect(el.loadingBar.textContent).to.equal("Loading Finished");
    expect(finished).to.equal(1);
  });

  it("BUG(lib/promise-progress-lite.js:124): the success handler throws ReferenceError because resolve is not defined", async () => {
    // drive process() with a thenable whose .then we control so we can
    // observe the ReferenceError thrown by the undefined resolve() call
    const el = await fixture(
      html`<promise-progress-lite></promise-progress-lite>`,
    );
    const captured = [];
    el.list = [
      () => ({
        then: (onFulfilled) => {
          try {
            onFulfilled("x");
          } catch (err) {
            captured.push(err.message);
          }
          return { catch: () => ({}) };
        },
      }),
    ];
    await el.updateComplete;
    await el.process();
    await flush(150);
    expect(captured.length).to.equal(1);
    expect(captured[0]).to.include("resolve is not defined");
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<promise-progress-lite show-count></promise-progress-lite>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });
});

describe("promise-progress element", () => {
  it("uses the promise-progress tag and renders the bar", async () => {
    const el = await fixture(html`<promise-progress></promise-progress>`);
    expect(el.tagName).to.equal("PROMISE-PROGRESS");
    const bar = el.shadowRoot.querySelector('progress[part="progress"]');
    expect(bar).to.exist;
    expect(bar.getAttribute("max")).to.equal("100");
  });

  it("shows the count when show-count is set", async () => {
    const el = await fixture(
      html`<promise-progress show-count></promise-progress>`,
    );
    expect(el.shadowRoot.textContent.includes("0 / 100")).to.equal(true);
  });
});

describe("wc-preload-progress behavior", () => {
  it("defaults to an empty wcList and grabs the shared registry", async () => {
    const el = await fixture(html`<wc-preload-progress></wc-preload-progress>`);
    expect(el.tagName).to.equal("WC-PRELOAD-PROGRESS");
    expect(el.wcList.length).to.equal(0);
    expect(el.registry).to.equal(
      globalThis.DynamicImportRegistry.requestAvailability(),
    );
    expect(el.max).to.equal(100);
  });

  it("ignores an empty wcList", async () => {
    const el = await fixture(html`<wc-preload-progress></wc-preload-progress>`);
    el.wcList = [];
    await el.updateComplete;
    expect(el.list.length).to.equal(0);
    expect(el.canLoad).to.equal(false);
  });

  it("maps wcList entries into registry load functions and runs them", async () => {
    const el = await fixture(html`<wc-preload-progress></wc-preload-progress>`);
    const registry = el.registry;
    // promise-progress is already defined locally so loadDefinition
    // short-circuits without any network access
    registry.register({
      tag: "promise-progress",
      path: "elements/promise-progress/promise-progress.js",
    });
    el.wcList = ["promise-progress"];
    // setting list inside updated() schedules a second update cycle
    await el.updateComplete;
    await el.updateComplete;
    expect(el.list.length).to.equal(1);
    expect(typeof el.list[0]).to.equal("function");
    expect(el.canLoad).to.equal(true);
    let finished = 0;
    el.addEventListener("promise-progress-finished", () => finished++);
    await el.process();
    await flush(150);
    expect(el.value).to.equal(100);
    expect(el.loadingBar.textContent).to.equal("Loading Finished");
    expect(finished).to.equal(1);
  });

  it("rebuilds the list when wcList changes again", async () => {
    const el = await fixture(html`<wc-preload-progress></wc-preload-progress>`);
    const registry = el.registry;
    registry.register({
      tag: "promise-progress",
      path: "elements/promise-progress/promise-progress.js",
    });
    el.wcList = ["promise-progress"];
    await el.updateComplete;
    await el.updateComplete;
    expect(el.list.length).to.equal(1);
    el.wcList = ["promise-progress", "promise-progress"];
    await el.updateComplete;
    await el.updateComplete;
    expect(el.list.length).to.equal(2);
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<wc-preload-progress></wc-preload-progress>`);
    await expect(el).shadowDom.to.be.accessible();
  });
});
