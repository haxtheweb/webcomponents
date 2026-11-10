/**
 * web-test-runner config for the i18n layout check. Started by
 * scripts/i18n-layout-check.mjs; not meant to be run by hand.
 *
 * Reuses the repo's test page (globals the elements expect) and adds:
 * - the generated batch files from I18N_LAYOUT_DIR
 * - an "i18n-layout-report" server command that stores each tag's results
 *   as JSON in that folder
 * - Chromium only, with every request that leaves the local test server
 *   aborted, so web fonts, images and embeds never load from the network
 *   and the measurements are the same offline, locally and in CI
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
const outDir = path.resolve(process.env.I18N_LAYOUT_DIR || "");
const resultsDir = path.join(outDir, "results");
if (
  !process.env.I18N_LAYOUT_DIR ||
  !outDir.startsWith(path.join(root, ".cache"))
) {
  throw new Error(
    "I18N_LAYOUT_DIR must point inside .cache/ (set by scripts/i18n-layout-check.mjs)",
  );
}

const TAG = /^[a-z][a-z0-9]*-[a-z0-9-]*$/;

function reportPlugin() {
  return {
    name: "i18n-layout-report",
    executeCommand({ command, payload }) {
      if (command !== "i18n-layout-report") {
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
  concurrency: Number(process.env.I18N_LAYOUT_CONCURRENCY) || 2,
  coverage: false,
  testFramework: { config: { timeout: 120000 } },
  testsFinishTimeout: 20 * 60 * 1000,
  browsers: [
    playwrightLauncher({
      product: "chromium",
      // optional: a Chromium binary other than the one Playwright bundles
      launchOptions: process.env.I18N_LAYOUT_CHROMIUM
        ? { executablePath: process.env.I18N_LAYOUT_CHROMIUM }
        : {},
      createPage: async ({ context }) => {
        await context.route(
          (url) => !LOCAL.test(url.href),
          (route) => route.abort(),
        );
        return context.newPage();
      },
    }),
  ],
  plugins: [...(base.plugins || []), reportPlugin()],
};
