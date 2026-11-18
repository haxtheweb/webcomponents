import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import "../la-tex.js";

// The real vendored LaTeX2HTML5 bundle and the real MathJax 4 (served from
// this repository's node_modules, the same files ubiquity ships): math in
// la-tex's shadow root is typeset. MathJax 2 only scanned the main
// document, so this math used to stay as raw TeX.
describe("la-tex with MathJax 4", () => {
  it("lays out pspicture and typesets its math, in every instance", async function () {
    this.timeout(20000);
    // built in script: LaTeX2HTML5 needs one command per line, and a
    // formatter may reflow text inside an html template
    const sources = [
      [
        "\\begin{pspicture}(0,-1)(4,1)",
        "\\rput(0,0){$x(t)$}",
        "\\rput(3,0){$X_k = \\frac{1}{p} \\sum x(n)$}",
        "\\psline{->}(0.5,0)(2,0)",
        "\\end{pspicture}",
      ],
      [
        "\\begin{pspicture}(0,-1)(4,1)",
        "\\rput(1,0){$y = mx + b$}",
        "\\end{pspicture}",
      ],
    ];
    const host = await fixture(html`<div></div>`);
    sources.forEach((lines) => {
      const el = globalThis.document.createElement("la-tex");
      el.textContent = "\n" + lines.join("\n") + "\n";
      host.appendChild(el);
    });
    const elements = [...host.querySelectorAll("la-tex")];
    // typeset equations: MathJax containers holding their SVG
    const math = (el) =>
      [...el.shadowRoot.querySelectorAll(".wrapper mjx-container")].filter(
        (c) => c.querySelector("svg"),
      ).length;
    const state = () =>
      JSON.stringify(
        elements.map((el) => ({
          hydrated: el.hydrated,
          math: math(el),
          text: el.shadowRoot.querySelector(".wrapper").textContent.trim()
            .length,
        })),
      );
    try {
      await waitUntil(
        () => elements.every((el) => el.hydrated && math(el) > 0),
        "timeout",
        { timeout: 15000 },
      );
    } catch {
      throw new Error("la-tex did not render with typeset math: " + state());
    }
    expect(math(elements[0])).to.equal(2);
    expect(math(elements[1])).to.equal(1);
    elements.forEach((el) => {
      const wrapper = el.shadowRoot.querySelector(".wrapper");
      // no TeX delimiters left as text
      expect(wrapper.textContent).to.not.contain("$");
      // MathJax's SVG CSS was copied into the shadow root
      expect(el.shadowRoot.querySelector("style[data-mathjax-svg]")).to.exist;
    });
  });
});
