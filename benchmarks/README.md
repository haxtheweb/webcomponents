# Render benchmarks

Timing benchmarks for the elements whose render cost people feel most,
run with [tachometer](https://github.com/google/tachometer) in Chrome.
They answer one question for a change: did first render or a common update
of these elements get faster or slower, beyond the noise?

The check is **advisory**. It never fails a build: timings on shared CI
runners move by several percent between identical runs, so a result is a
reason to look closer, not a verdict.

## What is measured

Each page records two performance measures, both timed until every Lit
element in the tree has finished updating (`settle()` in `lib/bench.js`):

| Benchmark          | `first-render`                                                                                          | `update`                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `hax-body`         | import a ~300 element page of mixed blocks (headings, text, lists, quotes, tables, images, grid-plates) | enter edit mode until every block is editable |
| `video-player`     | 4 local-source players with captions and transcripts, all on screen                                     | change accent color and dark mode             |
| `grid-plate`       | 50 three column grids with text and images                                                              | switch every grid to the `1-2` layout         |
| `outline-designer` | a 300 page outline (units, lessons, sub-pages)                                                          | move one page down (`itemOp`)                 |
| `site-menu`        | the menu for a 300 page site from the site store                                                        | make a deep page active                       |
| `simple-icon`      | 500 icons                                                                                               | change every icon and color                   |

Benchmarks load no remote content; media sources are local paths.

## Running locally

```bash
yarn bench                          # this working tree vs origin/master
yarn bench --base <ref>             # vs any branch, tag or commit
yarn bench --no-base                # this tree only, absolute timings
yarn bench --only hax-body,grid-plate --sample-size 50
```

With a base, `run.mjs` extracts the base commit's `elements/` into
`benchmarks/work/base/` (gitignored) and links it to this tree's installed
third-party packages, so only our own code differs. Both sides run the
benchmark pages from this tree, in one tachometer run: same browser, samples
interleaved at random. The table shows 95% confidence intervals for each
side and for the change. The last column reads:

- **no change**: the change interval crosses 0
- **within noise**: it excludes 0 but not ±5%
- **faster** / **slower**: the whole interval is beyond 5%

The 5% margin is there because, at 95% confidence, about one row in twenty
shows an interval that just misses 0 even when both sides run identical
code.

Close other heavy work while it runs; 30 samples of all six benchmarks
against a base takes several minutes.

The first run installs pinned `tachometer` and `chromedriver` packages into
`benchmarks/work/tools/` with npm (needs network once). They are not
devDependencies because one of tachometer's own dependencies,
`truncate-utf8-bytes` (via `sanitize-filename`), is WTFPL licensed, which
the repo's license policy does not allow in `yarn.lock`. The chromedriver
package downloads a driver matching your installed Chrome. To use a
particular browser or driver instead:

| Variable              | Use                                                                                                                                           |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `BENCH_CHROME_BINARY` | Chrome or Chromium executable to launch                                                                                                       |
| `BENCH_CHROME_ARGS`   | extra Chrome flags, space separated (for example `--no-sandbox` when running as root in a container)                                          |
| `BENCH_WEBDRIVER_URL` | an already running chromedriver, e.g. `http://127.0.0.1:9515` (start it with `--disable-build-check` if its version differs from the browser) |

## In CI

`.github/workflows/render-bench.yml` runs on pull requests labeled `perf`,
on pull requests that touch a benchmarked element or this folder, and on
demand (Actions, "Run workflow"). It benchmarks the pull request against its
base commit and posts the table to the job summary, plus one comment on
pull requests from this repository that is updated on each push. The raw
JSON is kept as the `render-bench-results` artifact.

## Adding or changing a benchmark

Add `<name>.html` and `<name>.bench.js` here; any `.html` file in this folder
is a benchmark. Use `run({ setup, firstRender, update })` from `lib/bench.js`
so the page records `first-render` and `update`, and throw if the element did
not render what you expected (a broken page then times out instead of
reporting a fast, wrong number). Import our elements by their full `.js`
path. If the benchmark covers another element, add its folder to the path
filter in the workflow.

Measures are compared only between a base and a change in the same run,
never against stored numbers, so there is no baseline file to update.
