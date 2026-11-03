import { expect } from "@open-wc/testing";
import { whenIdle } from "../lib/idle.js";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

describe("whenIdle", () => {
  it("runs the callback once the browser is idle", async () => {
    let ran = 0;
    whenIdle(() => ran++, { timeout: 500 });
    expect(ran).to.equal(0);
    await wait(600);
    expect(ran).to.equal(1);
  });

  it("returns a cancel function that stops pending work", async () => {
    let ran = 0;
    const cancel = whenIdle(() => ran++, { timeout: 500 });
    cancel();
    await wait(600);
    expect(ran).to.equal(0);
  });

  it("falls back to setTimeout without requestIdleCallback", async () => {
    const ric = globalThis.requestIdleCallback;
    globalThis.requestIdleCallback = undefined;
    try {
      let ran = 0;
      const cancel = whenIdle(() => ran++, { fallbackDelay: 20 });
      await wait(60);
      expect(ran).to.equal(1);
      let skipped = 0;
      whenIdle(() => skipped++, { fallbackDelay: 20 })();
      await wait(60);
      expect(skipped).to.equal(0);
      expect(cancel).to.be.a("function");
    } finally {
      globalThis.requestIdleCallback = ric;
    }
  });
});
