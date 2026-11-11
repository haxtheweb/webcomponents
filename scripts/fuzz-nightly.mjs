// Nightly fuzz hunt (haxtheweb/issues#3262), run by
// .github/workflows/fuzz-nightly.yml. No AI involved: it is plain scripting.
//
//   node scripts/fuzz-nightly.mjs -- <fuzz command...>
//   e.g. node scripts/fuzz-nightly.mjs -- npm run test:fuzz
//
// 1. Picks an explicit random seed (or HAX_FUZZ_SEED_INPUT when given) and
//    runs the fuzz command with HAX_FUZZ_SEED set to it, so every run can be
//    replayed. The seed goes in the job summary.
// 2. On failure, reads each fast-check `{ seed, path }` report from the
//    output, names the failing property (the test name), and replays it once
//    with HAX_FUZZ_SEED + HAX_FUZZ_PATH to confirm it fails again.
// 3. When HAX_ISSUES_TOKEN is set, files (or comments on) one open issue per
//    confirmed property in haxtheweb/issues titled `[fuzz] <repo>: <property>`.
//    Without the token it skips that and says so in the summary.
// 4. Exits 1 when the fuzz command failed, so the scheduled run shows red.
//
// Test names and output are treated as data: they are only ever written into
// markdown code spans/blocks or sent as JSON API fields, never run.
//
// Seed convention: test/_helpers/fuzz-config.* (haxtheweb/issues#3272).
// This file is copied, not published, across haxtheweb/create,
// haxtheweb/haxcms-nodejs and haxtheweb/webcomponents; keep the copies in step.
import { spawn } from "node:child_process";
import { randomInt } from "node:crypto";
import fs from "node:fs";
import { Buffer } from "node:buffer";
import https from "node:https";
import process from "node:process";
import { pathToFileURL } from "node:url";

const ISSUES_REPO = "haxtheweb/issues";
const MAX_REPLAYS = 5;
const MAX_OUTPUT_IN_ISSUE = 3000;

const env = process.env;
const summaryLines = [];
function say(line) {
  summaryLines.push(line === undefined ? "" : line);
}
function flushSummary() {
  const text = summaryLines.join("\n") + "\n";
  if (env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(env.GITHUB_STEP_SUMMARY, text);
  } else {
    process.stdout.write("\n" + text);
  }
  summaryLines.length = 0;
}

// a value safe inside a markdown code span
function code(value) {
  // newlines would end the span and "|" would split a table cell, so "|" is
  // shown as a broken bar instead (no escaping, nothing to unescape)
  const text = String(value)
    .replace(/[\r\n]+/g, " ")
    .replace(/\|/g, "\u00a6");
  const fence = text.includes("`") ? "``" : "`";
  return `${fence} ${text} ${fence}`;
}
// a value safe inside a fenced block
function block(value) {
  return "~~~text\n" + String(value).replace(/^~~~/gm, " ~~~") + "\n~~~";
}

function repoShortName() {
  const full = env.GITHUB_REPOSITORY || "";
  const parts = full.split("/");
  return parts.length === 2 ? parts[1] : full || "local";
}

function runUrl() {
  if (!env.GITHUB_REPOSITORY || !env.GITHUB_RUN_ID) return "";
  const server = env.GITHUB_SERVER_URL || "https://github.com";
  return `${server}/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}`;
}

function pickSeed() {
  const given = (env.HAX_FUZZ_SEED_INPUT || "").trim();
  if (given !== "") {
    if (!/^-?\d+$/.test(given) || !Number.isSafeInteger(Number(given))) {
      throw new RangeError(
        `seed input must be an integer, got ${JSON.stringify(given)}`,
      );
    }
    return Number(given);
  }
  return randomInt(1, 2147483647);
}

// Run the command (argv array, no shell), echo its output live and return it.
function run(command, extraEnv) {
  return new Promise((resolve) => {
    const child = spawn(command[0], command.slice(1), {
      env: Object.assign({}, env, extraEnv),
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    const onData = (stream) => (chunk) => {
      output += chunk.toString();
      stream.write(chunk);
    };
    child.stdout.on("data", onData(process.stdout));
    child.stderr.on("data", onData(process.stderr));
    child.on("error", (error) => {
      output += `\n${error.message}\n`;
      resolve({ code: 1, output, spawnError: error.message });
    });
    child.on("close", (exitCode) =>
      resolve({ code: exitCode === null ? 1 : exitCode, output }),
    );
  });
}

// Test-name lines from the reporters these repos use:
//   TAP (node --test, no TTY):  "not ok 3 - name"
//   spec / dot (node --test):   "✖ name (12.3ms)"
//   wtr failures reporter:      "• name [chromium]"
const NAME_PATTERNS = [
  /^\s*not ok \d+ - (.+?)\s*$/,
  /^\s*✖ (.+?) \([\d.]+m?s\)\s*$/,
  /^\s*• (.+?)(?: \[[\w-]+\])?\s*$/,
];
const REPORT = /\{ seed: (-?\d+), path: "(\d+(?::\d+)*)"/;
const COUNTEREXAMPLE = /Counterexample: (.*)$/;

// [{ property, seed, path, counterexample }], one per property
export function parseFailures(output) {
  const lines = String(output).split(/\r?\n/);
  const found = new Map();
  for (let i = 0; i < lines.length; i++) {
    const m = REPORT.exec(lines[i]);
    if (!m) continue;
    let property = "unnamed property";
    for (let j = i - 1; j >= 0 && j >= i - 40; j--) {
      const hit = NAME_PATTERNS.map((re) => re.exec(lines[j])).find(Boolean);
      if (hit) {
        property = hit[1];
        break;
      }
    }
    let counterexample = "";
    for (let k = i + 1; k < lines.length && k <= i + 3; k++) {
      const c = COUNTEREXAMPLE.exec(lines[k]);
      if (c) {
        counterexample = c[1];
        break;
      }
    }
    if (!found.has(property)) {
      found.set(property, {
        property,
        seed: Number(m[1]),
        path: m[2],
        counterexample,
      });
    }
  }
  return Array.from(found.values());
}

// GitHub REST call (node:https, so it runs on every Node these repos support)
function github(token, method, url, body) {
  const payload = body ? JSON.stringify(body) : "";
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: "api.github.com",
        path: url,
        method,
        headers: {
          accept: "application/vnd.github+json",
          authorization: `Bearer ${token}`,
          "x-github-api-version": "2022-11-28",
          "user-agent": "hax-fuzz-nightly",
          "content-type": "application/json",
          "content-length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        let text = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          text += chunk;
        });
        res.on("end", () => {
          if (res.statusCode < 200 || res.statusCode > 299) {
            reject(
              new Error(
                `${method} ${url} -> ${res.statusCode}: ${text.slice(0, 500)}`,
              ),
            );
            return;
          }
          try {
            resolve(text ? JSON.parse(text) : {});
          } catch (error) {
            reject(error);
          }
        });
      },
    );
    req.on("error", reject);
    req.end(payload);
  });
}

async function fileIssue(token, failure, context) {
  const title = `[fuzz] ${context.repo}: ${failure.property}`;
  const query = `repo:${ISSUES_REPO} is:issue is:open in:title "[fuzz] ${context.repo}:"`;
  const search = await github(
    token,
    "GET",
    `/search/issues?per_page=100&q=${encodeURIComponent(query)}`,
  );
  const existing = (search.items || []).find((item) => item.title === title);
  const replay = `HAX_FUZZ_SEED=${failure.seed} HAX_FUZZ_PATH=${failure.path} ${context.commandText}`;
  const details = [
    `Nightly fuzz hunt in \`haxtheweb/${context.repo}\` found a failing property and replayed it to confirm.`,
    "",
    `- Property: ${code(failure.property)}`,
    `- Seed: \`${failure.seed}\`, path: \`${failure.path}\``,
    `- Commit: \`${env.GITHUB_SHA || "unknown"}\``,
    context.url ? `- Run: ${context.url}` : "",
    "",
    "Replay locally:",
    "",
    "```sh",
    replay,
    "```",
    "",
    "Counterexample (as printed by fast-check):",
    "",
    block(failure.counterexample || "(not printed)"),
    "",
    "When fixed, pin the counterexample so the default `npm test` run guards it (haxtheweb/issues#3272).",
  ].join("\n");
  if (existing) {
    await github(
      token,
      "POST",
      `/repos/${ISSUES_REPO}/issues/${existing.number}/comments`,
      {
        body: details,
      },
    );
    return { action: "commented on", url: existing.html_url };
  }
  const created = await github(token, "POST", `/repos/${ISSUES_REPO}/issues`, {
    title,
    body: `${details}\n\nTracking: https://github.com/haxtheweb/issues/issues/3262`,
  });
  return { action: "opened", url: created.html_url };
}

async function main() {
  const sep = process.argv.indexOf("--");
  const command = sep === -1 ? [] : process.argv.slice(sep + 1);
  if (!command.length) {
    throw new Error(
      "usage: node scripts/fuzz-nightly.mjs -- <fuzz command...>",
    );
  }
  const commandText = command.join(" ");
  const repo = repoShortName();
  const url = runUrl();
  const seed = pickSeed();

  say(`## Nightly fuzz hunt: ${repo}`);
  say();
  say(`- Command: ${code(commandText)}`);
  say(`- Seed: \`${seed}\` (HAX_FUZZ_SEED)`);
  say(`- Commit: \`${env.GITHUB_SHA || "local"}\``);
  say();
  say("Replay this whole run:");
  say();
  say("```sh");
  say(`HAX_FUZZ_SEED=${seed} ${commandText}`);
  say("```");
  flushSummary();

  const hunt = await run(command, { HAX_FUZZ_SEED: String(seed) });
  if (hunt.code === 0) {
    say();
    say("Result: **pass**, no property failed.");
    flushSummary();
    return 0;
  }

  say();
  say(`Result: **fail** (exit ${hunt.code}).`);
  const failures = parseFailures(hunt.output);
  if (!failures.length) {
    say();
    say(
      "The command failed without a fast-check `{ seed, path }` report (install, build or a non-property error). Last output:",
    );
    say();
    say(block(hunt.output.slice(-MAX_OUTPUT_IN_ISSUE)));
    flushSummary();
    return 1;
  }

  say();
  say("| Property | Seed | Path | Replay | Counterexample |");
  say("| --- | --- | --- | --- | --- |");
  const confirmed = [];
  for (let i = 0; i < failures.length; i++) {
    const failure = failures[i];
    let replay = "not replayed (limit)";
    if (i < MAX_REPLAYS) {
      process.stdout.write(
        `\n--- replay: ${failure.property} (seed ${failure.seed}, path ${failure.path})\n`,
      );
      const again = await run(command, {
        HAX_FUZZ_SEED: String(failure.seed),
        HAX_FUZZ_PATH: failure.path,
      });
      const still = parseFailures(again.output).some(
        (f) => f.property === failure.property,
      );
      replay = still ? "confirmed" : "did not fail again";
      if (still) confirmed.push(failure);
    }
    say(
      `| ${code(failure.property)} | \`${failure.seed}\` | \`${failure.path}\` | ${replay} | ${code(
        (failure.counterexample || "").slice(0, 200),
      )} |`,
    );
  }
  say();
  say("Replay one property:");
  say();
  say("```sh");
  for (const failure of failures) {
    say(
      `HAX_FUZZ_SEED=${failure.seed} HAX_FUZZ_PATH=${failure.path} ${commandText}`,
    );
  }
  say("```");
  flushSummary();

  const token = env.HAX_ISSUES_TOKEN || "";
  say();
  if (!confirmed.length) {
    say("No failure replayed, so no issue was filed.");
  } else if (!token) {
    say(
      `Issue filing skipped: the \`HAX_ISSUES_TOKEN\` secret is not set (it needs Issues: read and write on ${ISSUES_REPO}).`,
    );
  } else {
    for (const failure of confirmed) {
      try {
        const result = await fileIssue(token, failure, {
          repo,
          url,
          commandText,
        });
        say(`- ${result.action} ${result.url} for ${code(failure.property)}`);
      } catch (error) {
        say(
          `- Filing the issue for ${code(failure.property)} failed: ${code(error.message)}`,
        );
      }
    }
  }
  flushSummary();
  return 1;
}

const isMain =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  main().then(
    (exitCode) => {
      process.exitCode = exitCode;
    },
    (error) => {
      say();
      say(
        `fuzz-nightly failed: ${code(error && error.message ? error.message : error)}`,
      );
      flushSummary();
      process.exitCode = 1;
    },
  );
}
