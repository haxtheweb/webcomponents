import { expect } from "@open-wc/testing";
import { analyzeSite } from "../lib/core/insights/insights-analyzer.js";
import {
  runInsights,
  supportsModuleWorkers,
  createInsightsWorker,
} from "../lib/core/insights/insights-worker.js";
import {
  loadSpec,
  loadFixtureSite,
  loadExtras,
  RESULT_OPTIONS,
} from "./insights-fixture-helpers.js";

let spec;
let site;
let options;
let expected;

function withoutEngine(results) {
  const copy = JSON.parse(JSON.stringify(results));
  delete copy.engine;
  return copy;
}

before(async () => {
  spec = await loadSpec();
  site = await loadFixtureSite();
  options = Object.assign({ extras: await loadExtras() }, RESULT_OPTIONS);
  expected = JSON.parse(
    JSON.stringify(analyzeSite(site.pages, site.manifest, spec, options)),
  );
});

describe("insights-worker", () => {
  it("detects module worker support in Chromium", () => {
    expect(supportsModuleWorkers()).to.equal(true);
  });

  it("runs the analyzer in a module worker with progress", async () => {
    const progress = [];
    const results = await runInsights({
      pages: site.pages,
      manifest: site.manifest,
      spec,
      options,
      onProgress: (p) => progress.push(p),
      mode: "worker",
    });
    expect(results.engine).to.deep.equal({ ranIn: "worker", parser: "lite" });
    expect(withoutEngine(results)).to.deep.equal(expected);
    expect(progress.length).to.be.greaterThan(1);
    const last = progress[progress.length - 1];
    expect(last).to.deep.equal({ phase: "analyze", done: 18, total: 18 });
    const done = progress.map((p) => p.done);
    expect(done).to.deep.equal(done.slice().sort((a, b) => a - b));
  });

  it("runs on the main thread when asked, with the same results", async () => {
    const progress = [];
    const results = await runInsights({
      pages: site.pages,
      manifest: site.manifest,
      spec,
      options,
      onProgress: (p) => progress.push(p),
      mode: "main",
    });
    expect(results.engine.ranIn).to.equal("main");
    expect(results.engine.parser).to.equal("dom");
    expect(withoutEngine(results)).to.deep.equal(expected);
    expect(progress[progress.length - 1].done).to.equal(18);
  });

  it("falls back to the main thread when module workers are unavailable", async () => {
    const original = globalThis.Worker;
    globalThis.Worker = undefined;
    try {
      expect(supportsModuleWorkers()).to.equal(false);
      expect(() => createInsightsWorker()).to.throw();
      const results = await runInsights({
        pages: site.pages,
        manifest: site.manifest,
        spec,
        options,
      });
      expect(results.engine.ranIn).to.equal("main");
      expect(results.engine.fallbackReason).to.contain("not supported");
      expect(withoutEngine(results)).to.deep.equal(expected);
    } finally {
      globalThis.Worker = original;
    }
  });

  it("refuses a browser that only has classic workers", () => {
    const original = globalThis.Worker;
    let terminated = false;
    // a classic-only Worker never reads the type option
    globalThis.Worker = function ClassicOnly() {
      this.terminate = () => {
        terminated = true;
      };
    };
    try {
      expect(() => createInsightsWorker()).to.throw("Module workers");
      expect(terminated).to.equal(true);
    } finally {
      globalThis.Worker = original;
    }
  });

  it("starts a same-origin worker without a blob: URL (strict CSP)", () => {
    const original = globalThis.Worker;
    const urls = [];
    globalThis.Worker = function Recording(url, opts) {
      urls.push(String(url));
      // read the option the way a module-capable browser does
      this.type = opts && opts.type;
      this.terminate = () => {};
    };
    try {
      createInsightsWorker();
      expect(urls.length).to.equal(1);
      expect(urls[0].indexOf("blob:")).to.equal(-1);
      expect(urls[0]).to.contain("insights-worker.js");
    } finally {
      globalThis.Worker = original;
    }
  });

  it("falls back to the main thread when the worker fails to load", async () => {
    const results = await runInsights({
      pages: site.pages,
      manifest: site.manifest,
      spec,
      options,
      workerUrl: new URL(
        "./fixtures/insights/missing-worker.js",
        import.meta.url,
      ),
    });
    expect(results.engine.ranIn).to.equal("main");
    expect(results.engine.fallbackReason).to.contain("failed to load");
    expect(withoutEngine(results)).to.deep.equal(expected);
  });

  it("does not fall back when the worker is required", async () => {
    let error = null;
    try {
      await runInsights({
        pages: site.pages,
        manifest: site.manifest,
        spec,
        options,
        mode: "worker",
        workerUrl: new URL(
          "./fixtures/insights/missing-worker.js",
          import.meta.url,
        ),
      });
    } catch (e) {
      error = e;
    }
    expect(error).to.be.an("error");
  });

  it("falls back when the input cannot be cloned to the worker", async () => {
    const manifest = Object.assign({}, site.manifest, { fn: () => 1 });
    const results = await runInsights({
      pages: site.pages,
      manifest,
      spec,
      options,
    });
    expect(results.engine.ranIn).to.equal("main");
    expect(results.totals.pages).to.equal(18);
  });

  it("stops when the scan is cancelled", async () => {
    for (const mode of ["worker", "main"]) {
      const controller = new AbortController();
      controller.abort();
      let error = null;
      try {
        await runInsights({
          pages: site.pages,
          manifest: site.manifest,
          spec,
          options,
          mode,
          signal: controller.signal,
        });
      } catch (e) {
        error = e;
      }
      expect(error, mode).to.be.an("error");
      expect(error.message, mode).to.contain("cancelled");
    }
  });

  it("handles an empty scan", async () => {
    const progress = [];
    const results = await runInsights({
      pages: [],
      manifest: { items: [] },
      spec,
      options: RESULT_OPTIONS,
      onProgress: (p) => progress.push(p),
      mode: "main",
    });
    expect(results.totals.pages).to.equal(0);
    expect(results.overview.health.score).to.equal(null);
    expect(progress).to.deep.equal([{ phase: "analyze", done: 0, total: 0 }]);
  });
});
