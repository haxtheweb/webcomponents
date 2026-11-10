/**
 * web-test-runner config for the memory-leak check. Started by
 * scripts/leak-check.mjs; not meant to be run by hand.
 *
 * Reuses the repo's test page (globals the elements expect) and adds:
 * - the generated batch files from LEAK_CHECK_DIR
 * - a "leak-report" server command that stores each tag's results as JSON in
 *   that folder
 * - a "leak-gc" server command, the fallback garbage collection through the
 *   Chrome DevTools Protocol when the page has no globalThis.gc
 * - Chromium only, started with --js-flags=--expose-gc, with every request
 *   that leaves the local test server aborted, so embeds and web fonts never
 *   load from the network and runs are the same offline, locally and in CI
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { playwrightLauncher } from "@web/test-runner-playwright";
import base from "../../web-test-runner.config.mjs";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const outDir = path.resolve(process.env.LEAK_CHECK_DIR || "");
const resultsDir = path.join(outDir, "results");
if (
  !process.env.LEAK_CHECK_DIR ||
  !outDir.startsWith(path.join(root, ".cache"))
) {
  throw new Error(
    "LEAK_CHECK_DIR must point inside .cache/ (set by scripts/leak-check.mjs)",
  );
}

const TAG = /^[a-z][a-z0-9]*-[a-z0-9-]*$/;

function leakPlugin() {
  return {
    name: "leak-check",
    async executeCommand({ command, payload, session }) {
      if (command === "leak-gc") {
        const page = session.browser.getPage(session.id);
        const cdp = await page.context().newCDPSession(page);
        await cdp.send("HeapProfiler.collectGarbage");
        await cdp.detach();
        return true;
      }
      if (command !== "leak-report") {
        return undefined;
      }
      // the tag names the file, so it must be a plain custom element name
      if (
        !payload ||
        typeof payload.tag !== "string" ||
        !TAG.test(payload.tag)
      ) {
        return false;
      }
      fs.mkdirSync(resultsDir, { recursive: true });
      fs.writeFileSync(
        path.join(resultsDir, `${payload.tag}.json`),
        JSON.stringify(payload.data || {}),
      );
      return true;
    },
  };
}

const LOCAL =
  /^(https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/|data:|blob:|about:)/;

export default {
  ...base,
  rootDir: root,
  files: [
    path
      .join(path.relative(root, outDir), "batch-*.test.js")
      .split(path.sep)
      .join("/"),
  ],
  concurrency: Number(process.env.LEAK_CHECK_CONCURRENCY) || 2,
  coverage: false,
  testFramework: { config: { timeout: 300000 } },
  testsFinishTimeout: 20 * 60 * 1000,
  browsers: [
    playwrightLauncher({
      product: "chromium",
      launchOptions: {
        args: ["--js-flags=--expose-gc"],
        // optional: a Chromium binary other than the one Playwright bundles
        ...(process.env.LEAK_CHECK_CHROMIUM
          ? { executablePath: process.env.LEAK_CHECK_CHROMIUM }
          : {}),
      },
      createPage: async ({ context }) => {
        await context.route(
          (url) => !LOCAL.test(url.href),
          (route) => route.abort(),
        );
        return context.newPage();
      },
    }),
  ],
  plugins: [...(base.plugins || []), leakPlugin()],
};
