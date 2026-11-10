// Markdown summary of a Stryker JSON report (mutation-testing-report-schema),
// for the GitHub job summary of the weekly mutation run or a local look:
//
//   node scripts/mutation/summarize.mjs reports/mutation/outline-designer/mutation.json
//
// Prints the score, the counts by status and the surviving mutants grouped
// by line. Always exits 0: the mutation run is report only.
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const MAX_SURVIVORS = 40;

function out(line = "") {
  process.stdout.write(`${line}\n`);
}

// mutant source text is code: keep it on one line and out of the table markup
function cell(text, max = 80) {
  const flat = String(text).replace(/\s+/g, " ").trim();
  const short = flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
  // backticks would end the code span and pipes the table cell
  const safe = short.replace(/[\\`|]/g, (ch) =>
    ch === "`" ? "'" : ch === "|" ? "\\|" : "\\\\",
  );
  return `\`${safe}\``;
}

function originalText(source, location) {
  const lines = source.split("\n");
  const start = location.start;
  const end = location.end;
  if (start.line === end.line) {
    return lines[start.line - 1].slice(start.column - 1, end.column - 1);
  }
  return `${lines[start.line - 1].slice(start.column - 1)} …`;
}

const reportPath = process.argv[2];
if (!reportPath || !fs.existsSync(reportPath)) {
  out("## Mutation testing");
  out();
  out(
    "No report was produced (see the Stryker step log). This run is report only.",
  );
  process.exit(0);
}

const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
const counts = {};
const survivors = [];
Object.keys(report.files || {}).forEach((file) => {
  const entry = report.files[file];
  (entry.mutants || []).forEach((mutant) => {
    counts[mutant.status] = (counts[mutant.status] || 0) + 1;
    if (mutant.status === "Survived" || mutant.status === "NoCoverage") {
      survivors.push({
        file: path.relative(process.cwd(), path.resolve(file)),
        line: mutant.location.start.line,
        mutator: mutant.mutatorName,
        original: originalText(entry.source, mutant.location),
        replacement: mutant.replacement,
      });
    }
  });
});

const killed = (counts.Killed || 0) + (counts.Timeout || 0);
const valid = killed + (counts.Survived || 0) + (counts.NoCoverage || 0);
const score = valid ? ((killed / valid) * 100).toFixed(1) : "n/a";

out("## Mutation testing: outline-designer (report only)");
out();
out(
  `**Mutation score: ${score}%** (${killed} of ${valid} mutants detected; timeouts count as detected)`,
);
out();
out("| status | mutants |");
out("| --- | ---: |");
Object.keys(counts)
  .sort()
  .forEach((status) => out(`| ${status} | ${counts[status]} |`));
out();
if (survivors.length) {
  survivors.sort((a, b) => a.line - b.line);
  out(
    `### Surviving mutants${survivors.length > MAX_SURVIVORS ? ` (first ${MAX_SURVIVORS} of ${survivors.length}, by line)` : ""}`,
  );
  out();
  out("| file:line | mutator | original | mutant |");
  out("| --- | --- | --- | --- |");
  survivors
    .slice(0, MAX_SURVIVORS)
    .forEach((s) =>
      out(
        `| ${s.file}:${s.line} | ${s.mutator} | ${cell(s.original)} | ${cell(s.replacement)} |`,
      ),
    );
  out();
  out(
    "A surviving mutant is a change to the code that no test noticed. Download the HTML report artifact to see each one in context.",
  );
}
