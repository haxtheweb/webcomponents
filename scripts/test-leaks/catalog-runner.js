/**
 * Every element in elements-catalog.json, connected and removed a few times:
 * nothing it creates may outlive it (haxtheweb/issues#3246). Uses
 * measureLeaks() from scripts/test-setup/expect-no-leak.js.
 *
 * Elements that leaked before this suite existed are listed in
 * leak-baseline.json with their counts. A new leak, or a known one that got
 * worse, fails. A known one that got better is logged so its baseline entry
 * can be lowered or removed in the same PR as the fix.
 *
 *   yarn test:leaks
 *
 * leak-baseline.json: { "leaks": { tag: counts }, "skip": { tag: reason } }.
 * The counts are the highest seen across two full runs: a few elements'
 * numbers move a little with what loaded before them.
 * To rebuild "leaks" after fixing leaks, run the suite and merge the
 * LEAK_BASELINE_<shard> lines it logs. "skip" lists elements that can't be
 * created bare (they hang or need a host page), each with its reason.
 */
import { expect } from "@open-wc/testing";
import { measureLeaks } from "../test-setup/expect-no-leak.js";

const METRICS = ["reactions", "observed", "i18n"];
// a leak repeats every cycle, so a new one adds at least CYCLES to a count;
// smaller moves are noise from what loaded before the element
const CYCLES = 3;
const NOISE = CYCLES - 1;

/**
 * Register the tests for one shard of the catalog. The catalog runs in
 * several test files (one browser page each), so one element that hangs or
 * breaks its page only takes its own shard down.
 * @param {number} shard 0-based shard index
 * @param {number} shards total shard count
 */
export async function runCatalogShard(shard, shards) {
  const catalog = await (
    await globalThis.fetch("/elements-catalog.json")
  ).json();
  const baseline = await (
    await globalThis.fetch("/scripts/test-leaks/leak-baseline.json")
  ).json();
  const known = baseline.leaks || {};
  const skip = baseline.skip || {};

  describe(`element catalog ${shard + 1}/${shards}: nothing outlives a removed element`, () => {
    const found = {};
    const skipped = {};

    // elements created outside a site throw from their own async work
    // (reactions, timers, network); that is not what this suite measures, and
    // left alone mocha pins each one on whichever test is running
    let savedOnError = null;
    let savedOnRejection = null;
    before(() => {
      savedOnError = globalThis.onerror;
      savedOnRejection = globalThis.onunhandledrejection;
      globalThis.onerror = () => true;
      globalThis.onunhandledrejection = (e) => e.preventDefault();
    });

    after(() => {
      globalThis.onerror = savedOnError;
      globalThis.onunhandledrejection = savedOnRejection;
      // the counts for every leaking element, ready to paste as the baseline
      const next = {};
      Object.keys(found)
        .sort()
        .forEach((tag) => {
          if (METRICS.some((m) => found[tag][m] > 0)) {
            next[tag] = {
              reactions: found[tag].reactions,
              observed: found[tag].observed,
              i18n: found[tag].i18n,
            };
          }
        });
      console.log(`LEAK_BASELINE_${shard} ` + JSON.stringify(next));
      console.log(`LEAK_SKIPPED_${shard} ` + JSON.stringify(skipped));
    });

    catalog.elements
      .filter((entry) => entry.type === "element" && entry.import && entry.tag)
      .filter((entry, i) => i % shards === shard)
      .forEach((entry) => {
        if (skip[entry.tag]) {
          it.skip(`<${entry.tag}> (${skip[entry.tag]})`);
          return;
        }
        it(`<${entry.tag}>`, async function () {
          this.timeout(60000);
          try {
            // the element's own path, the same URL its sibling imports
            // resolve to, so nothing gets defined twice
            await import(
              "/elements/" + entry.import.replace("@haxtheweb/", "")
            );
          } catch (e) {
            skipped[entry.tag] =
              "import failed: " + String(e && e.message).slice(0, 120);
            this.skip();
          }
          if (!globalThis.customElements.get(entry.tag)) {
            skipped[entry.tag] = "not defined by its import";
            this.skip();
          }
          let result;
          try {
            // measured twice, keeping the lower count of each kind: a real
            // per-element leak shows up both times, while one-time lazy
            // setup that finishes late (async imports, shared stores) only
            // lands in the first measurement
            const first = await measureLeaks(entry.tag, { cycles: CYCLES });
            const second = await measureLeaks(entry.tag, { cycles: CYCLES });
            result = { cycles: CYCLES };
            METRICS.forEach((m) => {
              result[m] = Math.min(first[m], second[m]);
            });
          } catch (e) {
            // elements that need a host page (themes, editors) can throw when
            // created bare; that is not what this suite checks
            skipped[entry.tag] =
              "threw when connected: " + String(e && e.message).slice(0, 120);
            this.skip();
          }
          found[entry.tag] = result;
          const allowed = known[entry.tag] || {
            reactions: 0,
            observed: 0,
            i18n: 0,
          };
          const worse = METRICS.filter(
            (m) => result[m] > (allowed[m] || 0) + NOISE,
          );
          const better = METRICS.filter(
            (m) => result[m] < (allowed[m] || 0) - NOISE,
          );
          if (better.length) {
            console.log(
              `<${entry.tag}> leaks less than leak-baseline.json says (${better.join(", ")}): lower its entry`,
            );
          }
          expect(
            worse.map(
              (m) => `${m}: ${result[m]} (baseline ${allowed[m] || 0})`,
            ),
            `<${entry.tag}> leaks more than leak-baseline.json allows`,
          ).to.deep.equal([]);
        });
      });
  });
}
