/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * Runs the Insights analyzer off the main thread.
 *
 * This one module is both:
 *  - the module Web Worker (when loaded with `new Worker(url, {type:
 *    "module"})` it listens for a "run" message), and
 *  - the main-thread API, runInsights(), which starts that worker and falls
 *    back to running the analyzer on the main thread (in small chunks that
 *    yield to the editor) when module workers are unavailable, blocked, or
 *    fail to load.
 *
 * Messages, main -> worker:
 *   { type: "run", id, pages: [{ html, item }], manifest, spec, options }
 * worker -> main:
 *   { type: "progress", id, phase: "analyze", done, total }
 *   { type: "result", id, results }
 *   { type: "error", id, message }
 *
 * Inside a worker DOMParser does not exist, so pages are parsed with the
 * built-in parser from insights-html.js; on the main thread DOMParser is used.
 */
import { pageFacts, siteResults } from "./insights-analyzer.js";

const IN_WORKER =
  typeof globalThis.WorkerGlobalScope !== "undefined" &&
  globalThis instanceof globalThis.WorkerGlobalScope;

// pages analyzed between progress messages / main-thread yields
const CHUNK = 8;

function nextTick() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Analyze pages in chunks, reporting progress. Shared by the worker and the
 * main-thread fallback.
 */
async function analyzeInChunks(
  pages,
  manifest,
  spec,
  options,
  parser,
  onProgress,
  isCancelled,
  yieldBetween,
) {
  const list = Array.isArray(pages) ? pages : [];
  const facts = [];
  const total = list.length;
  for (let i = 0; i < total; i++) {
    if (isCancelled()) {
      throw new Error("Insights scan cancelled");
    }
    const page = list[i] || {};
    facts.push(pageFacts(page.html, page.item, spec, { parser }));
    if ((i + 1) % CHUNK === 0 || i + 1 === total) {
      onProgress({ phase: "analyze", done: i + 1, total });
      if (yieldBetween) {
        await yieldBetween();
      }
    }
  }
  if (total === 0) {
    onProgress({ phase: "analyze", done: 0, total: 0 });
  }
  return siteResults(facts, manifest, spec, options || {});
}

if (IN_WORKER) {
  globalThis.addEventListener("message", async (event) => {
    const msg = event.data || {};
    if (msg.type !== "run") {
      return;
    }
    try {
      const results = await analyzeInChunks(
        msg.pages,
        msg.manifest,
        msg.spec,
        msg.options,
        "lite",
        (p) =>
          globalThis.postMessage(
            Object.assign({ type: "progress", id: msg.id }, p),
          ),
        () => false,
        null,
      );
      globalThis.postMessage({ type: "result", id: msg.id, results });
    } catch (e) {
      globalThis.postMessage({
        type: "error",
        id: msg.id,
        message: e && e.message ? e.message : String(e),
      });
    }
  });
}

let moduleWorkerSupport = null;

/**
 * Whether this browser can start module workers. Cached.
 */
export function supportsModuleWorkers() {
  if (typeof globalThis.Worker !== "function") {
    return false;
  }
  if (moduleWorkerSupport !== null) {
    return moduleWorkerSupport;
  }
  moduleWorkerSupport = false;
  const probe = {
    get type() {
      moduleWorkerSupport = true;
      return "module";
    },
  };
  let url = "";
  try {
    url = URL.createObjectURL(new Blob([""], { type: "text/javascript" }));
    new globalThis.Worker(url, probe).terminate();
  } catch {
    // the getter already recorded support; a CSP refusal still lands here
  } finally {
    if (url) {
      URL.revokeObjectURL(url);
    }
  }
  return moduleWorkerSupport;
}

/**
 * Start the insights worker. Same-origin module URLs load directly; when the
 * code is served from another origin (a CDN), a same-origin blob module
 * imports it instead, since workers must be same-origin. Throws when the
 * browser refuses (CSP, no module workers).
 * @param {string|URL} [workerUrl]
 */
export function createInsightsWorker(workerUrl) {
  if (!supportsModuleWorkers()) {
    throw new Error("Module workers are not supported");
  }
  const url = new URL(String(workerUrl || import.meta.url), import.meta.url);
  const pageOrigin =
    globalThis.location && globalThis.location.origin
      ? globalThis.location.origin
      : "";
  if (pageOrigin === "" || url.origin === pageOrigin) {
    return new globalThis.Worker(url.href, { type: "module" });
  }
  const shim = URL.createObjectURL(
    new Blob([`import ${JSON.stringify(url.href)};`], {
      type: "text/javascript",
    }),
  );
  try {
    return new globalThis.Worker(shim, { type: "module" });
  } finally {
    // the worker has its own reference once constructed
    setTimeout(() => URL.revokeObjectURL(shim), 30000);
  }
}

let runCounter = 0;

function runOnMainThread(pages, manifest, spec, options, onProgress, signal) {
  return analyzeInChunks(
    pages,
    manifest,
    spec,
    options,
    "auto",
    onProgress,
    () => !!(signal && signal.aborted),
    nextTick,
  );
}

function runInWorker(
  pages,
  manifest,
  spec,
  options,
  onProgress,
  signal,
  workerUrl,
) {
  return new Promise((resolve, reject) => {
    let worker = null;
    try {
      worker = createInsightsWorker(workerUrl);
    } catch (e) {
      reject(Object.assign(e, { workerUnavailable: true }));
      return;
    }
    const id = `insights-${++runCounter}`;
    let settled = false;
    const finish = (fn, value) => {
      if (settled) {
        return;
      }
      settled = true;
      worker.terminate();
      if (signal) {
        signal.removeEventListener("abort", onAbort);
      }
      fn(value);
    };
    const onAbort = () => finish(reject, new Error("Insights scan cancelled"));
    if (signal) {
      if (signal.aborted) {
        onAbort();
        return;
      }
      signal.addEventListener("abort", onAbort);
    }
    worker.addEventListener("message", (event) => {
      const msg = event.data || {};
      if (msg.id !== id) {
        return;
      }
      if (msg.type === "progress") {
        onProgress({ phase: msg.phase, done: msg.done, total: msg.total });
      } else if (msg.type === "result") {
        finish(resolve, msg.results);
      } else if (msg.type === "error") {
        finish(reject, new Error(msg.message));
      }
    });
    // a module that fails to load (blocked import, CSP, syntax) only shows
    // up as an error event; treat it as "no worker" so the caller falls back
    worker.addEventListener("error", (event) => {
      if (event && typeof event.preventDefault === "function") {
        event.preventDefault();
      }
      finish(
        reject,
        Object.assign(new Error("Insights worker failed to load"), {
          workerUnavailable: true,
        }),
      );
    });
    worker.addEventListener("messageerror", () =>
      finish(
        reject,
        Object.assign(new Error("Insights worker message failed"), {
          workerUnavailable: true,
        }),
      ),
    );
    try {
      worker.postMessage({ type: "run", id, pages, manifest, spec, options });
    } catch (e) {
      // e.g. DataCloneError on a proxy; the main thread can still run it
      finish(
        reject,
        Object.assign(
          new Error(`Insights worker message failed: ${e.message}`),
          {
            workerUnavailable: true,
          },
        ),
      );
    }
  });
}

/**
 * Analyze pages and build site results, off the main thread when possible.
 * @param {Object} args
 * @param {Array<{html: string, item: Object}>} args.pages
 * @param {Object} args.manifest site.json
 * @param {Object} args.spec insights spec
 * @param {Object} [args.options] siteResults() options (now, extras, ...)
 * @param {function} [args.onProgress] ({phase, done, total}) => void
 * @param {AbortSignal} [args.signal]
 * @param {"auto"|"worker"|"main"} [args.mode] auto: worker, else main thread
 * @param {string|URL} [args.workerUrl] override (tests)
 * @returns {Promise<Object>} results, with results.engine = { ranIn, parser }
 */
export async function runInsights({
  pages = [],
  manifest = {},
  spec,
  options = {},
  onProgress = null,
  signal = null,
  mode = "auto",
  workerUrl = null,
} = {}) {
  const progress = typeof onProgress === "function" ? onProgress : () => {};
  let fallbackReason = "";
  if (mode !== "main") {
    try {
      const results = await runInWorker(
        pages,
        manifest,
        spec,
        options,
        progress,
        signal,
        workerUrl,
      );
      results.engine = { ranIn: "worker", parser: "lite" };
      return results;
    } catch (e) {
      if (!e || !e.workerUnavailable || mode === "worker") {
        throw e;
      }
      fallbackReason = e.message;
    }
  }
  const results = await runOnMainThread(
    pages,
    manifest,
    spec,
    options,
    progress,
    signal,
  );
  results.engine = {
    ranIn: "main",
    parser: typeof globalThis.DOMParser === "function" ? "dom" : "lite",
    fallbackReason,
  };
  return results;
}
