/**
 * Quiet web-test-runner reporter: instead of streaming every test file and
 * every browser console line, it prints a progress line every 25 files plus a
 * line the moment a file fails, then every failure grouped by file at the
 * end (test path, message, expected/actual, the test-file line, and the last
 * browser logs of that failing file only).
 *
 * Enabled by WTR_REPORTER=failures (see web-test-runner.config.mjs), e.g.
 *   yarn test:all:failures
 *   WTR_REPORTER=failures yarn test            (inside an element folder)
 *
 * WTR_FAILURES_JSON=path also writes the failures as JSON, so two runs can be
 * diffed to tell a flake (fails once) from a real failure (fails every time).
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const LOG_LINES_PER_FILE = 20;

function collectTests(suite, trail, out) {
  if (!suite) return;
  const here = suite.name ? trail.concat(suite.name) : trail;
  for (const test of suite.tests || []) {
    out.push(Object.assign({}, test, { fullName: here.concat(test.name).join(" > ") }));
  }
  for (const child of suite.suites || []) collectTests(child, here, out);
}

function browserName(session) {
  return session.browser && session.browser.name ? session.browser.name : "";
}

function formatLog(entry) {
  return (Array.isArray(entry) ? entry : [entry])
    .map((part) => (typeof part === "string" ? part : JSON.stringify(part)))
    .join(" ");
}

export function failuresReporter(options = {}) {
  const jsonFile = options.jsonFile || process.env.WTR_FAILURES_JSON;
  let rootDir = process.cwd();
  let done = 0;
  let total = 0;
  let passed = 0;
  let skipped = 0;
  const failures = [];
  const logsByFile = new Map();

  return {
    start({ config, testFiles }) {
      rootDir = config.rootDir || rootDir;
      total = testFiles.length;
    },
    reportTestFileResults({ sessionsForTestFile, testFile }) {
      done++;
      const rel = path.relative(rootDir, testFile);
      const before = failures.length;
      for (const session of sessionsForTestFile) {
        const tests = [];
        collectTests(session.testResults, [], tests);
        let testFailed = false;
        for (const test of tests) {
          if (test.skipped) {
            skipped++;
          } else if (test.passed) {
            passed++;
          } else {
            testFailed = true;
            const error = test.error || {};
            failures.push({
              file: rel,
              browser: browserName(session),
              test: test.fullName,
              message: error.message || "failed",
              stack: error.stack,
              expected: error.expected,
              actual: error.actual,
            });
          }
        }
        // errors outside any test: failed import, uncaught error, file timeout
        for (const error of session.errors || []) {
          failures.push({
            file: rel,
            browser: browserName(session),
            test: "(file-level error)",
            message: error.message,
            stack: error.stack,
          });
        }
        if (!session.passed && !testFailed && !(session.errors || []).length) {
          failures.push({
            file: rel,
            browser: browserName(session),
            test: "(session failed)",
            message: `status ${session.status}`,
          });
        }
        if (failures.length > before && (session.logs || []).length) {
          logsByFile.set(rel, session.logs.slice(-LOG_LINES_PER_FILE).map(formatLog));
        }
      }
      const fileFailed = failures.length > before;
      if (fileFailed || done % 25 === 0 || done === total) {
        process.stdout.write(
          `[${done}/${total}] ${fileFailed ? "FAIL " + rel : "ok"}  (failures so far: ${failures.length})\n`,
        );
      }
    },
    getTestProgress() {
      return "";
    },
    onTestRunFinished() {
      const lines = ["", "=".repeat(72)];
      lines.push(
        `Tests: ${passed} passed, ${failures.length} failed, ${skipped} skipped across ${total} files`,
      );
      lines.push("=".repeat(72));
      const byFile = new Map();
      for (const failure of failures) {
        if (!byFile.has(failure.file)) byFile.set(failure.file, []);
        byFile.get(failure.file).push(failure);
      }
      for (const [file, list] of byFile) {
        lines.push("", `✖ ${file}`);
        for (const failure of list) {
          lines.push(`  • ${failure.test}${failure.browser ? ` [${failure.browser}]` : ""}`);
          lines.push(`    ${String(failure.message).split("\n").join("\n    ")}`);
          if (failure.expected !== undefined || failure.actual !== undefined) {
            lines.push(`    expected: ${failure.expected}`);
            lines.push(`    actual:   ${failure.actual}`);
          }
          const frame = (failure.stack || "")
            .split("\n")
            .find((line) => line.includes(".test.js"));
          if (frame) lines.push(`    at ${frame.trim().replace(/^at /, "")}`);
        }
        if (logsByFile.has(file)) {
          lines.push(`  browser logs (last ${LOG_LINES_PER_FILE}):`);
          for (const log of logsByFile.get(file)) lines.push(`    | ${log}`);
        }
      }
      process.stdout.write(lines.join("\n") + "\n");
      if (jsonFile) {
        fs.writeFileSync(jsonFile, JSON.stringify({ passed, skipped, failures }, null, 2));
      }
    },
  };
}
