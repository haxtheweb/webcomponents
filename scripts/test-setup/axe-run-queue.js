/**
 * Loaded by web-test-runner.config.mjs into the page every test file runs in.
 *
 * axe-core refuses to start an audit while another one is still running
 * ("Axe is already running. Use `await axe.run()` to wait for the previous
 * run to finish before starting a new run."). When one test times out, mocha
 * moves on but its axe.run() keeps going, so every later
 * `expect(el).shadowDom.to.be.accessible()` in that file failed instantly.
 * One slow audit on a busy CI runner turned into 5-20 red tests.
 *
 * chai-a11y-axe loads axe-core lazily, which sets window.axe. This traps that
 * assignment and wraps axe.run so a new audit waits for the in-flight one to
 * finish instead of throwing. Tests and assertions are unchanged; only the
 * cascade is gone, so the one test that really timed out is the only failure.
 */
(function () {
  "use strict";
  // longest a queued audit will wait before running anyway (and letting axe
  // report its own error), so a wedged audit can never hang the whole file
  var MAX_WAIT_MS = 30000;
  var POLL_MS = 25;

  function waitForIdle(axe) {
    return new Promise(function (resolve) {
      var started = Date.now();
      (function check() {
        if (!axe._running || Date.now() - started > MAX_WAIT_MS) {
          resolve();
        } else {
          setTimeout(check, POLL_MS);
        }
      })();
    });
  }

  function wrap(axe) {
    if (!axe || typeof axe.run !== "function" || axe.run.__queued) {
      return axe;
    }
    var run = axe.run;
    var queued = function () {
      var args = arguments;
      var self = this;
      var last = args.length ? args[args.length - 1] : null;
      if (typeof last === "function") {
        // callback form (what chai-a11y-axe uses): no return value
        waitForIdle(axe).then(function () {
          run.apply(self, args);
        });
        return undefined;
      }
      // promise form
      return waitForIdle(axe).then(function () {
        return run.apply(self, args);
      });
    };
    queued.__queued = true;
    axe.run = queued;
    return axe;
  }

  // axe-core assigns window.axe before it attaches axe.run, so wrap on read
  // (chai-a11y-axe reads window.axe once the import has finished); wrap() is
  // idempotent and mutates the axe object, so cached references are covered
  var current = globalThis.axe;
  Object.defineProperty(globalThis, "axe", {
    configurable: true,
    enumerable: true,
    get: function () {
      return wrap(current);
    },
    set: function (value) {
      current = value;
    },
  });
})();
