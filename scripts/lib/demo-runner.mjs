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
 * - openDemo(context, origin, element, timeout): a page on the element's
 *   demo with every request that leaves the local server aborted, custom
 *   elements upgraded, the network idle, fonts loaded and a short settle,
 *   so results are the same offline, locally and in CI.
 * - runPool(jobs, concurrency, work, label): run jobs a few at a time with
 *   progress lines.
 */
import console from "node:console";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

export const SETTLE_MS = 750;

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
export async function openDemo(context, origin, element, timeout) {
  await context.route(
    (url) => !LOCAL.test(url.href),
    (route) => route.abort(),
  );
  const page = await context.newPage();
  page.setDefaultTimeout(timeout);
  await page.goto(`${origin}/elements/${element}/demo/index.html`, {
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
  return page;
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
