/**
 * Claude Code PreToolUse hook (matcher: Bash).
 *
 * Blocks `git push` and `gh pr create` until `npm run precheck` passes, so
 * code that CI would reject on lint or formatting is fixed before it is sent
 * up instead of after. Exit code 2 blocks the tool call and feeds stderr back
 * to Claude, which should fix the reported problems and try again.
 *
 * Any other Bash command passes straight through.
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

// Matches `git push`, `git -C dir push`, and `gh pr create` as a command.
const GATED =
  /(^|[\s;&|(])(git(\s+(-C|-c)\s+\S+)*\s+push|gh\s+pr\s+create)(\s|$)/;
// Deleting a remote branch does not publish code, so it is not gated.
const DELETING = /\s--delete(\s|$)/;
const MAX_OUTPUT_LINES = 120;

function check(command) {
  if (!GATED.test(command) || DELETING.test(command)) {
    return;
  }
  const dir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const script = path.join(dir, "scripts", "precheck.mjs");
  if (!fs.existsSync(script)) {
    // Branch predates the precheck script; do not block on a missing tool.
    return;
  }
  const res = spawnSync(process.execPath, [script], {
    cwd: dir,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  if (res.status === 0) {
    return;
  }
  const output = `${res.stdout || ""}${res.stderr || ""}`
    .split("\n")
    .slice(-MAX_OUTPUT_LINES)
    .join("\n");
  process.stderr.write(
    [
      "BLOCKED: precheck found problems that CI (or review) will reject.",
      "Fix them, then retry the push or PR.",
      "Run `yarn precheck:fix` to auto-fix formatting and fixable lint,",
      "then `yarn precheck` to confirm it passes.",
      "",
      output,
    ].join("\n"),
  );
  process.exitCode = 2;
}

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  input += chunk;
});
process.stdin.on("end", () => {
  let command = "";
  try {
    const payload = JSON.parse(input);
    command = (payload.tool_input && payload.tool_input.command) || "";
  } catch {
    // Unparseable input: never block on a hook problem.
    return;
  }
  check(command);
});
