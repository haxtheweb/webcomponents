import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import "../la-tex.js";

// security: PSTricks expressions used to go straight into eval, so content
// that passed the HAX sanitizer could still run script through la-tex.
describe("la-tex expression guard", () => {
  let originalWarn;
  let warnings;
  let hadMathJax;
  let previousMathJax;

  beforeEach(() => {
    warnings = [];
    originalWarn = console.warn;
    console.warn = (...args) => {
      warnings.push(args.join(" "));
    };
    // render() runs synchronously once MathJax exists, which keeps the test
    // offline (no CDN load)
    hadMathJax = "MathJax" in globalThis;
    previousMathJax = globalThis.MathJax;
    if (!hadMathJax) {
      globalThis.MathJax = { Hub: { Config: () => {}, Queue: () => {} } };
    }
    delete globalThis.__laTexPwned;
  });

  afterEach(() => {
    console.warn = originalWarn;
    if (!hadMathJax) {
      delete globalThis.MathJax;
    } else {
      globalThis.MathJax = previousMathJax;
    }
    delete globalThis.__laTexPwned;
  });

  it("does not evaluate script in a psplot expression", async function () {
    this.timeout(10000);
    // String.raw keeps the LaTeX backslashes (a lit html template would
    // turn "\b" into a backspace)
    const tex = String.raw`\begin{pspicture}(0,0)(1,1)
\psplot{0}{0.01}{(globalThis.__laTexPwned=1)}
\psplot{0}{0.01}{(__laTexPwned=2)}
\end{pspicture}`;
    const el = globalThis.document.createElement("la-tex");
    el.textContent = tex;
    await fixture(html`<div></div>`).then((host) => host.appendChild(el));
    await waitUntil(
      () =>
        warnings.some((w) => w.indexOf("not plain math") !== -1) ||
        globalThis.__laTexPwned,
      "la-tex never parsed the pspicture",
      { timeout: 8000 },
    );
    expect(globalThis.__laTexPwned).to.equal(undefined);
    expect(warnings.some((w) => w.indexOf("__laTexPwned") !== -1)).to.equal(
      true,
    );
  });
});
