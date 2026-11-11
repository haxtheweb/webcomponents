/**
 * Shared runner for the gates that open element demos in Chromium (the
 * color-contrast gate, scripts/contrast-check.mjs, and the dark mode and
 * reduced motion gate, scripts/dark-motion-check.mjs).
 *
 * - demoElements(root): element folders that have demo/index.html.
 * - startServer(root, port): the repo's web-dev-server config
 *   (web-dev-server.config.mjs) serving the repo root over plain http on
 *   127.0.0.1, never a live site.
 * - launchChromium(executablePath): Playwright's Chromium, or the binary
 *   given (CONTRAST_CHROMIUM and friends).
 * - openDemo(context, origin, element, timeout, options): a page on the
 *   element's demo with every request that leaves the local server aborted,
 *   custom elements upgraded, the network idle, fonts loaded and a short
 *   settle, so results are the same offline, locally and in CI. With
 *   { settled: true } it also waits for a settled render (see
 *   waitForSettledRender), for checks that measure the page as it rests.
 * - openPage(context, origin, urlPath, timeout, options): the same for any
 *   page the local server serves, e.g. the component gallery (/index.html).
 * - waitForSettledRender(page): stop CSS animations and transitions at
 *   their end state, then wait until the page's layout stops changing.
 * - runPool(jobs, concurrency, work, label): run jobs a few at a time with
 *   progress lines.
 */
import console from "node:console";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

export const SETTLE_MS = 750;
// a render counts as settled when the layout is unchanged for this long
const QUIET_MS = 750;
const POLL_MS = 250;
// upper bound for waiting on a settled render (some demos never stop)
const SETTLED_MAX_MS = 10000;

export const LOCAL =
  /^(https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/|data:|blob:|about:)/;

/** element folders that have a demo page */
export function demoElements(root) {
  return fs
    .readdirSync(path.join(root, "elements"), { withFileTypes: true })
    .filter(
      (d) =>
        d.isDirectory() &&
        fs.existsSync(
          path.join(root, "elements", d.name, "demo", "index.html"),
        ),
    )
    .map((d) => d.name)
    .sort();
}

export async function startServer(root, port) {
  const { startDevServer } = await import("@web/dev-server");
  const repoConfig = (
    await import(path.join(root, "web-dev-server.config.mjs"))
  ).default;
  // the repo config is for `yarn start` in an element folder; serve the
  // repo root over plain http, without opening a browser or watching files
  const config = {
    ...repoConfig,
    rootDir: root,
    appIndex: undefined,
    open: false,
    watch: false,
    https: false,
    hostname: "127.0.0.1",
    port,
  };
  const server = await startDevServer({
    config,
    readCliArgs: false,
    readFileConfig: false,
    autoExitProcess: false,
    logStartMessage: false,
  });
  return {
    server,
    origin: `http://127.0.0.1:${server.config.port}`,
  };
}

export async function launchChromium(executablePath) {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    throw new Error(
      "playwright is not installed in this monorepo (yarn install), then yarn playwright install chromium",
    );
  }
  return chromium.launch(executablePath ? { executablePath } : {});
}

/** open an element's demo in a context and wait for it to settle */
export async function openDemo(
  context,
  origin,
  element,
  timeout,
  options = {},
) {
  return openPage(
    context,
    origin,
    `/elements/${element}/demo/index.html`,
    timeout,
    options,
  );
}

/**
 * open any page the local server serves (urlPath starts with "/") and wait
 * for it to settle the same way a demo does
 */
export async function openPage(
  context,
  origin,
  urlPath,
  timeout,
  options = {},
) {
  await context.route(
    (url) => !LOCAL.test(url.href),
    (route) => route.abort(),
  );
  const page = await context.newPage();
  page.setDefaultTimeout(timeout);
  await page.goto(`${origin}${urlPath}`, {
    waitUntil: "load",
    timeout,
  });
  // let custom elements upgrade and render (bounded: some never define)
  await page
    .waitForFunction(
      () => document.querySelectorAll(":not(:defined)").length === 0,
      null,
      { timeout: 10000 },
    )
    .catch(() => {});
  await page
    .waitForLoadState("networkidle", { timeout: 10000 })
    .catch(() => {});
  await page.evaluate(() => (document.fonts ? document.fonts.ready : null));
  await page.waitForTimeout(SETTLE_MS);
  if (options.settled) {
    await waitForSettledRender(page);
  }
  return page;
}

/**
 * Invariant: a measurement taken after this sees the page at rest, the same
 * on a fast or a slow machine.
 *
 * Elements that finish rendering after load (a score drawn by a worker, a
 * chunked list, a fade-in) move and resize what is around them, and a
 * slower runner can be measured part way through. So: every CSS animation
 * and transition, shadow trees included, is moved to its end state (one
 * that never ends is cancelled, which leaves the element's resting style),
 * then the layout (the box of every element, shadow trees included, and the
 * scroll position) is sampled until it has not changed for QUIET_MS. That
 * is done twice, since a render that lands late can start new animations.
 * Bounded by SETTLED_MAX_MS; a page still changing then is measured as is.
 */
async function waitForSettledRender(page) {
  const deadline = Date.now() + SETTLED_MAX_MS;
  for (let pass = 0; pass < 2; pass++) {
    await page.evaluate(freezeMotion).catch(() => {});
    let last = null;
    let quietSince = Date.now();
    while (Date.now() < deadline) {
      const now = await page.evaluate(layoutFingerprint).catch(() => null);
      if (now === null) {
        return;
      }
      if (now !== last) {
        last = now;
        quietSince = Date.now();
      } else if (Date.now() - quietSince >= QUIET_MS) {
        break;
      }
      await page.waitForTimeout(POLL_MS);
    }
  }
}

// runs in the page: end every running CSS animation and transition. A
// document's getAnimations() leaves out shadow trees, so each shadow root
// is asked too.
function freezeMotion() {
  const roots = [document];
  const walk = (root) => {
    for (const el of root.querySelectorAll("*")) {
      if (el.shadowRoot) {
        roots.push(el.shadowRoot);
        walk(el.shadowRoot);
      }
    }
  };
  walk(document);
  for (const root of roots) {
    if (!root.getAnimations) {
      continue;
    }
    for (const animation of root.getAnimations()) {
      try {
        animation.finish();
      } catch {
        // an infinite animation cannot finish
        animation.cancel();
      }
    }
  }
}

// runs in the page: one string for the box of every element and the scroll
function layoutFingerprint() {
  const parts = [globalThis.scrollX, globalThis.scrollY];
  const walk = (root) => {
    for (const el of root.querySelectorAll("*")) {
      const r = el.getBoundingClientRect();
      parts.push(
        Math.round(r.left),
        Math.round(r.top),
        Math.round(r.width),
        Math.round(r.height),
      );
      if (el.shadowRoot) {
        walk(el.shadowRoot);
      }
    }
  };
  walk(document);
  return parts.join(",");
}

/** run jobs with a few workers; work(job) resolves to anything */
export async function runPool(jobs, concurrency, work, label) {
  let next = 0;
  let done = 0;
  async function worker() {
    while (next < jobs.length) {
      const job = jobs[next++];
      await work(job);
      done += 1;
      if (process.stdout.isTTY || done % 25 === 0 || done === jobs.length) {
        console.log(`${label}: ${done}/${jobs.length}`);
      }
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, jobs.length) }, worker),
  );
}
