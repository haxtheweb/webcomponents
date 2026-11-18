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

  it("boxes a picture whose author color is lost on a dark page", async function () {
    this.timeout(20000);
    const host = await fixture(
      html`<div style="background:#262626;color:#e4e5e7"></div>`,
    );
    const make = (backdrop) => {
      const el = globalThis.document.createElement("la-tex");
      if (backdrop) {
        el.setAttribute("backdrop", backdrop);
      }
      el.textContent =
        "\n\\begin{pspicture}(0,-1)(4,1)\n\\psline[linecolor=black](0,0)(3,0)\n\\end{pspicture}\n";
      host.appendChild(el);
      return el;
    };
    const auto = make();
    const none = make("none");
    const picture = (el) => el.shadowRoot.querySelector(".pspicture");
    await waitUntil(
      () => [auto, none].every((el) => el.hydrated && picture(el)),
      "la-tex did not render",
      { timeout: 15000 },
    );
    await waitUntil(
      () => picture(auto).getAttribute("data-hax-contrast") === "light",
      "no backdrop for black lines on a dark page",
      { timeout: 5000 },
    );
    expect(picture(none).hasAttribute("data-hax-contrast")).to.be.false;
    // the author can switch it at any time
    auto.backdrop = "none";
    await auto.updateComplete;
    expect(picture(auto).hasAttribute("data-hax-contrast")).to.be.false;
  });
});
