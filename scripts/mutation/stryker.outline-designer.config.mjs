// Mutation testing for outline-designer's outline data logic (yarn
// test:mutation:outline). Stryker changes one thing at a time in the code
// below (a condition, an operator, a value) and runs the outline tests; a
// change no test notices is a "survived" mutant, a spot where a bug in
// moves, indent/outdent, delete, ordering or the save payload would ship.
// Report only: it never fails a build (see .github/workflows/mutation-outline-designer.yml).
//
// Stryker has no web-test-runner plugin, so the command runner runs
// web-test-runner itself; scripts/mutation/wtr-outline-designer.config.mjs
// hands the active mutant to the browser. inPlace: the instrumented file is
// written over elements/outline-designer/outline-designer.js for the run and
// restored at the end (workspace symlinks would otherwise load the original
// from a sandbox), so do not edit that file while a run is going.

// The data-model code the save depends on: how pages are added, moved,
// indented, outdented and deleted, and how sibling order is kept: about 400
// mutants, under an hour on 2 CPUs (all of the element's data operations,
// drag and drop included, came to 564). Update the line ranges in a PR when
// this code moves.
const SOURCE = "elements/outline-designer/outline-designer.js";
const RANGES = [
  // hasChildren: decides whether sub-pages move and delete with a page
  "3210-3216",
  // _renumber: sibling groups get whole-number orders, changes are flagged
  "5355-5364",
  // getData: the items handed to Save Outline
  "5676-5678",
  // addNewItem: a new page's parent, order and the siblings it pushes down
  "5730-5807",
  // recurseAction: delete / lock carried down to sub-pages
  "5838-5859",
  // itemOp: the locked guard, delete/restore, add, in, out, up, down
  "5861-5865",
  "5903-6071",
  // _schemaOrderUpdate: the item order the outline (and the save) uses
  "6093-6130",
];

// The tests that drive those operations, plus the Save Outline fault tests
// in haxcms-elements (the glob matches nothing until that file exists).
const TESTS = [
  "elements/outline-designer/test/outline-designer-{actions,integrity}.test.js",
  "elements/haxcms-elements/test/outline-designer-save-*.test.js",
];

export default {
  testRunner: "command",
  commandRunner: {
    command: `node node_modules/@web/test-runner/dist/bin.js ${TESTS.map((t) => `"${t}"`).join(" ")} --config scripts/mutation/wtr-outline-designer.config.mjs --playwright --browsers chromium --static-logging`,
  },
  // the command runner cannot tell which test covers which mutant
  coverageAnalysis: "off",
  inPlace: true,
  // plain JavaScript: without this Stryker rewrites every file in the repo
  // (adding @ts-nocheck), which inPlace would leave changed
  disableTypeChecks: false,
  mutate: RANGES.map((range) => `${SOURCE}:${range}`),
  // template strings (labels, CSS) and console output are not outline data
  mutator: {
    excludedMutations: ["StringLiteral", "Regex"],
  },
  concurrency: 2,
  // one run is a browser start plus the test files above; give a slow
  // shared runner room before a mutant counts as a timeout
  timeoutMS: 30000,
  timeoutFactor: 1.5,
  reporters: ["html", "json", "clear-text", "progress"],
  htmlReporter: {
    fileName: "reports/mutation/outline-designer/index.html",
  },
  jsonReporter: {
    fileName: "reports/mutation/outline-designer/mutation.json",
  },
  clearTextReporter: {
    allowColor: false,
    logTests: false,
    maxTestsToLog: 0,
  },
  // report only: no score fails the run
  thresholds: { high: 80, low: 60, break: null },
  tempDirName: ".stryker-tmp",
  cleanTempDir: "always",
};
