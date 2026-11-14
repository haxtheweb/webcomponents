import { html, fixture, expect, waitUntil } from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";
import "../mermaid-diagram.js";
import {
  parseFlowchartSource,
  flowchartFromDb,
  plainLabel,
} from "../lib/flowchart-text.js";

const FLOW = `flowchart TD
  A[Draft the page] --> B{Has media?}
  B -->|Yes| C[Add captions and alt text]
  B -->|No| D[Run the a11y audit]
  C --> D
  D --> E((Publish))`;

const SEQUENCE = `sequenceDiagram
  A->>B: Save
  B-->>A: Saved`;

const settled = (el, status = "ready") =>
  waitUntil(() => el._status === status, `diagram never became ${status}`, {
    timeout: 20000,
  });
const svgOf = (el) => el.shadowRoot.querySelector("#stage svg");
const altText = (el) =>
  el.shadowRoot.querySelector("#alt").textContent.replace(/\s+/g, " ").trim();

describe("mermaid-diagram", function () {
  this.timeout(30000);

  describe("drawing a flowchart", () => {
    let el;
    beforeEach(async () => {
      el = await fixture(
        html`<mermaid-diagram diagram-title="Publishing checklist">
          <pre>${FLOW}</pre>
        </mermaid-diagram>`,
      );
      await settled(el);
    });

    it("draws the real Mermaid SVG in the shadow root", () => {
      const svg = svgOf(el);
      expect(svg).to.exist;
      expect(svg.querySelectorAll("g.node").length).to.equal(5);
      expect(svg.textContent).to.contain("Has media?");
      expect(el._diagramType).to.contain("flowchart");
      expect(
        el.shadowRoot.querySelector(".ddd-block-label").textContent,
      ).to.contain("flowchart");
      expect(
        el.shadowRoot.querySelector(".ddd-block-title").textContent,
      ).to.equal("Publishing checklist");
    });

    it("makes the drawing one image described by the text alternative", () => {
      const svg = svgOf(el);
      expect(svg.getAttribute("role")).to.equal("img");
      expect(svg.getAttribute("aria-describedby")).to.equal("alt");
      expect(svg.getAttribute("aria-labelledby")).to.equal("header");
      expect(el.shadowRoot.getElementById("alt")).to.exist;
      expect(el.shadowRoot.getElementById("header")).to.exist;
    });

    it("writes the text alternative from the graph", () => {
      const items = Array.from(el.shadowRoot.querySelectorAll("#alt li")).map(
        (li) => li.textContent.replace(/\s+/g, " ").trim(),
      );
      expect(items).to.deep.equal([
        "Draft the page: go to Has media?",
        "Has media? (decision): if Yes, go to Add captions and alt text; if No, go to Run the a11y audit",
        "Add captions and alt text: go to Run the a11y audit",
        "Run the a11y audit: go to Publish",
        "Publish: end",
      ]);
    });

    it("keeps the text alternative in the page when it is not shown", async () => {
      const panel = el.shadowRoot.querySelector("#alt-panel");
      expect(panel.classList.contains("sr-only")).to.be.true;
      expect(panel.hidden).to.be.false;
      el.shadowRoot.querySelector("#alt-toggle").click();
      await el.updateComplete;
      expect(panel.classList.contains("sr-only")).to.be.false;
      expect(
        el.shadowRoot
          .querySelector("#alt-toggle")
          .getAttribute("aria-expanded"),
      ).to.equal("true");
    });

    it("hides the source once drawn and shows it on request", async () => {
      const panel = el.shadowRoot.querySelector("#source-panel");
      expect(panel.hidden).to.be.true;
      el.shadowRoot.querySelector("#source-toggle").click();
      await el.updateComplete;
      expect(panel.hidden).to.be.false;
      expect(panel.classList.contains("sr-only")).to.be.false;
    });

    it("leaves the authored light DOM exactly as written", async () => {
      expect(el.children.length).to.equal(1);
      expect(el.querySelector("pre").textContent).to.equal(FLOW);
      expect(el.code).to.equal(FLOW);
      expect(el.hasAttribute("code")).to.be.false;
      const before = el.innerHTML;
      el.shadowRoot.querySelector("#source-toggle").click();
      el.shadowRoot.querySelector("#alt-toggle").click();
      await el.updateComplete;
      expect(el.innerHTML).to.equal(before);
    });

    it("leaves nothing behind in the page body", () => {
      expect(
        document.body.querySelectorAll(':scope > [id^="dmermaid-diagram-"]')
          .length,
      ).to.equal(0);
    });

    it("passes the a11y audit", async () => {
      await expect(el).shadowDom.to.be.accessible();
      el.showSource = true;
      el.showDescription = true;
      await el.updateComplete;
      await expect(el).shadowDom.to.be.accessible();
    });
  });

  describe("a source that does not parse", () => {
    it("shows a message and the source, never a blank block", async () => {
      let detail = null;
      const listen = (e) => {
        detail = e.detail;
      };
      document.addEventListener("mermaid-diagram-error", listen);
      const el = await fixture(
        html`<mermaid-diagram diagram-title="Broken">
          <pre>
flowchart TD
  A[Start --> B{Missing</pre>
        </mermaid-diagram>`,
      );
      await settled(el, "error");
      document.removeEventListener("mermaid-diagram-error", listen);
      await el.updateComplete;
      expect(svgOf(el)).to.equal(null);
      const problem = el.shadowRoot.querySelector(".problem");
      expect(problem.textContent).to.contain(el.t.error);
      expect(problem.textContent).to.contain(el.t.parseError);
      expect(
        el.shadowRoot.querySelector(".problem-detail").textContent,
      ).to.contain("Parse error");
      expect(el.shadowRoot.querySelector("#source-panel").hidden).to.be.false;
      expect(
        el.shadowRoot
          .querySelector("#source-panel")
          .classList.contains("sr-only"),
      ).to.be.false;
      expect(detail.message).to.contain("Parse error");
      expect(
        document.body.querySelectorAll(':scope > [id^="dmermaid-diagram-"]')
          .length,
      ).to.equal(0);
      await expect(el).shadowDom.to.be.accessible();
    });

    it("recovers when the source is fixed", async () => {
      const el = await fixture(
        html`<mermaid-diagram>
          <pre>
flowchart TD
  A[Start --> </pre>
        </mermaid-diagram>`,
      );
      await settled(el, "error");
      el.code = "flowchart TD\n  A[Start] --> B[Done]";
      await settled(el);
      expect(svgOf(el).textContent).to.contain("Done");
      expect(el.shadowRoot.querySelector(".problem")).to.equal(null);
    });

    it("says there is nothing to draw when empty", async () => {
      const el = await fixture(html`<mermaid-diagram></mermaid-diagram>`);
      await settled(el, "empty");
      await el.updateComplete;
      expect(el.shadowRoot.querySelector(".message").textContent).to.equal(
        el.t.empty,
      );
    });
  });

  describe("security", () => {
    it("draws in strict mode: no scripts, handlers, links or HTML labels", async () => {
      globalThis.__mermaidDiagramPwned = 0;
      const source = `%%{init: {"securityLevel": "loose", "htmlLabels": true, "flowchart": {"htmlLabels": true}}}%%
flowchart TD
  A[Draft] --> B["<img src=x onerror='globalThis.__mermaidDiagramPwned=1'>Kept label"]
  B --> C["<script>globalThis.__mermaidDiagramPwned=2</script>Third"]
  click A call globalThis.__mermaidDiagramPwned()
  click B href "javascript:globalThis.__mermaidDiagramPwned=3"`;
      const el = await fixture(html`<mermaid-diagram></mermaid-diagram>`);
      el.code = source;
      await settled(el);
      const svg = svgOf(el);
      expect(svg).to.exist;
      expect(globalThis.mermaid.mermaidAPI.getConfig().securityLevel).to.equal(
        "strict",
      );
      // Mermaid keeps an empty wrapper for the link it refused
      expect(
        svg.querySelectorAll("script, foreignObject, img, a[href]").length,
      ).to.equal(0);
      const all = [svg, ...svg.querySelectorAll("*")];
      all.forEach((node) => {
        Array.from(node.attributes).forEach((attribute) => {
          expect(attribute.name.startsWith("on"), attribute.name).to.be.false;
          expect(attribute.value).to.not.contain("javascript:");
        });
        expect(node.onclick).to.equal(null);
      });
      // labels are SVG text: the init directive could not turn HTML on
      expect(svg.querySelector("text")).to.exist;
      expect(svg.textContent).to.contain("Kept label");
      svg.querySelectorAll("g.node").forEach((node) => {
        node.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });
      expect(globalThis.__mermaidDiagramPwned).to.equal(0);
      // the text alternative is text, not markup
      expect(
        el.shadowRoot.querySelectorAll("#alt img, #alt script").length,
      ).to.equal(0);
      // the source is saved as text
      expect(el.querySelector("pre").children.length).to.equal(0);
      expect(el.querySelector("pre").textContent).to.equal(source);
      delete globalThis.__mermaidDiagramPwned;
    });

    it("checks the drawing again before it is adopted", async () => {
      const el = await fixture(html`<mermaid-diagram></mermaid-diagram>`);
      await el.updateComplete;
      const mounted = el._mount(
        '<svg viewBox="0 0 10 10" onload="x()"><script>1</script><a href="javascript:x()" xlink:href="https://example.com/"><rect onclick="x()" width="1" height="1"></rect></a><use href="#ok"></use><foreignObject><div>x</div></foreignObject></svg>',
      );
      expect(mounted).to.be.true;
      const svg = svgOf(el);
      expect(svg.hasAttribute("onload")).to.be.false;
      expect(svg.querySelector("script")).to.equal(null);
      expect(svg.querySelector("foreignObject")).to.equal(null);
      expect(svg.querySelector("a").hasAttribute("href")).to.be.false;
      expect(svg.querySelector("a").hasAttribute("xlink:href")).to.be.false;
      expect(svg.querySelector("rect").hasAttribute("onclick")).to.be.false;
      expect(svg.querySelector("use").getAttribute("href")).to.equal("#ok");
      expect(el._mount("<p>no drawing</p>")).to.be.false;
    });

    it("only loads src from http(s) addresses", async () => {
      const el = await fixture(
        html`<mermaid-diagram src="javascript:alert(1)">
          <pre>
flowchart TD
  A[Inline] --> B[Source]</pre>
        </mermaid-diagram>`,
      );
      await settled(el);
      expect(el._remote).to.equal(null);
      expect(svgOf(el).textContent).to.contain("Inline");
    });
  });

  describe("source", () => {
    it("draws a file given in src and keeps the inline source", async () => {
      const el = await fixture(
        html`<mermaid-diagram
          src="${new URL("./fixture.mmd", import.meta.url).href}"
        >
          <pre>
flowchart TD
  A[Inline] --> B[Source]</pre>
        </mermaid-diagram>`,
      );
      await waitUntil(
        () => svgOf(el) && svgOf(el).textContent.includes("From a file"),
        "the file was never drawn",
        { timeout: 20000 },
      );
      expect(el.querySelector("pre").textContent).to.contain("Inline");
    });

    it("writes the code property to the pre and draws it again", async () => {
      const el = await fixture(
        html`<mermaid-diagram>
          <pre>
flowchart TD
  A[First] --> B[Version]</pre>
        </mermaid-diagram>`,
      );
      await settled(el);
      el.code = "flowchart TD\n  A[Second] --> B[Version]";
      await waitUntil(
        () => svgOf(el).textContent.includes("Second"),
        "the new source was never drawn",
        { timeout: 20000 },
      );
      expect(el.querySelectorAll("pre").length).to.equal(1);
      expect(el.querySelector("pre").textContent).to.equal(
        "flowchart TD\n  A[Second] --> B[Version]",
      );
    });

    it("draws again when the pre is edited in place", async () => {
      const el = await fixture(
        html`<mermaid-diagram>
          <pre>
flowchart TD
  A[First] --> B[Version]</pre>
        </mermaid-diagram>`,
      );
      await settled(el);
      el.querySelector("pre").textContent =
        "flowchart TD\n  A[Edited] --> B[Here]";
      await waitUntil(
        () => svgOf(el).textContent.includes("Edited"),
        "the edit was never drawn",
        { timeout: 20000 },
      );
      expect(el.code).to.contain("Edited");
    });

    it("never lets an older drawing replace a newer one", async () => {
      const el = await fixture(html`<mermaid-diagram></mermaid-diagram>`);
      await settled(el, "empty");
      // start drawings directly (no debounce) so several are in flight
      el.code = "flowchart TD\n  A[One] --> B[Old]";
      await el.updateComplete;
      const first = el._draw();
      el._lightCode = el.code = "flowchart TD\n  A[Two] --> B[Older]";
      el.querySelector("pre").textContent = el.code;
      const second = el._draw();
      el._lightCode = el.code = "flowchart TD\n  A[Three] --> B[Newest]";
      el.querySelector("pre").textContent = el.code;
      const third = el._draw();
      await Promise.all([first, second, third]);
      await settled(el);
      expect(svgOf(el).textContent).to.contain("Newest");
      expect(svgOf(el).textContent).to.not.contain("Old");
      expect(el.shadowRoot.querySelectorAll("#stage svg").length).to.equal(1);
      expect(altText(el)).to.contain("Three: go to Newest");
    });
  });

  describe("text alternative", () => {
    it("uses the description attribute over the generated list", async () => {
      const el = await fixture(
        html`<mermaid-diagram description="How a page gets published.">
          <pre>${FLOW}</pre>
        </mermaid-diagram>`,
      );
      await settled(el);
      await el.updateComplete;
      expect(altText(el)).to.equal("How a page gets published.");
      expect(el.shadowRoot.querySelector("#alt ol")).to.equal(null);
    });

    it("uses the description slot over everything", async () => {
      const el = await fixture(
        html`<mermaid-diagram description="Attribute text">
          <pre>${FLOW}</pre>
          <p slot="description">
            Slotted <strong>description</strong>
          </p></mermaid-diagram
        >`,
      );
      await settled(el);
      const slot = el.shadowRoot.querySelector('slot[name="description"]');
      expect(slot.assignedElements().length).to.equal(1);
      expect(slot.assignedElements()[0].textContent.trim()).to.equal(
        "Slotted description",
      );
      expect(el._hasDescriptionSlot).to.be.true;
    });

    it("uses accDescr written in the source", async () => {
      const el = await fixture(
        html`<mermaid-diagram>
          <pre>
flowchart TD
  accDescr: Two steps in a row
  A[One] --> B[Two]</pre>
        </mermaid-diagram>`,
      );
      await settled(el);
      await el.updateComplete;
      expect(altText(el)).to.equal("Two steps in a row");
    });

    it("says other diagram types are described by their source, and keeps the source reachable", async () => {
      const el = await fixture(
        html`<mermaid-diagram diagram-title="Saving">
          <pre>${SEQUENCE}</pre>
        </mermaid-diagram>`,
      );
      await settled(el);
      await el.updateComplete;
      expect(svgOf(el)).to.exist;
      expect(altText(el)).to.equal(el.t.describedBySource);
      const source = el.shadowRoot.querySelector("#source-panel");
      expect(source.hidden).to.be.false;
      expect(source.classList.contains("sr-only")).to.be.true;
      await expect(el).shadowDom.to.be.accessible();
    });

    it("reads the common flowchart forms without Mermaid", () => {
      expect(
        parseFlowchartSource(FLOW).steps.map((s) => s.label),
      ).to.deep.equal([
        "Draft the page",
        "Has media?",
        "Add captions and alt text",
        "Run the a11y audit",
        "Publish",
      ]);
      const chained = parseFlowchartSource(
        'graph LR\n  %% note\n  A -- yes --> B --> C("Round <br/> one");\n  style A fill:none',
      );
      expect(chained.steps[0].links).to.deep.equal([
        { label: "yes", target: "B" },
      ]);
      expect(chained.steps[2].label).to.equal("Round one");
      expect(parseFlowchartSource(FLOW).steps[1].decision).to.be.true;
    });

    it("gives up on anything it does not understand", () => {
      expect(parseFlowchartSource("graph LR\n A & B --> C")).to.equal(null);
      expect(parseFlowchartSource(SEQUENCE)).to.equal(null);
      expect(parseFlowchartSource("flowchart TD\n A[oops --> B")).to.equal(
        null,
      );
      expect(parseFlowchartSource("flowchart TD")).to.equal(null);
      expect(parseFlowchartSource("")).to.equal(null);
      expect(parseFlowchartSource(null)).to.equal(null);
      expect(flowchartFromDb(null)).to.equal(null);
      expect(flowchartFromDb({})).to.equal(null);
    });

    it("reads a parsed graph and strips markup from labels", () => {
      const db = {
        getVertices: () =>
          new Map([
            ["A", { id: "A", text: "<b>Bold</b> start", type: "square" }],
            ["B", { id: "B", text: "Ready?", type: "diamond" }],
          ]),
        getEdges: () => [
          { start: "A", end: "B", text: "" },
          { start: "B", end: "A", text: "No" },
          { start: "B", end: "missing", text: "" },
        ],
      };
      expect(flowchartFromDb(db)).to.deep.equal({
        steps: [
          {
            label: "Bold start",
            decision: false,
            links: [{ label: "", target: "Ready?" }],
          },
          {
            label: "Ready?",
            decision: true,
            links: [{ label: "No", target: "Bold start" }],
          },
        ],
      });
      expect(plainLabel('"quoted <i>text</i>"')).to.equal("quoted text");
    });
  });

  describe("title and caption", () => {
    it("shows a caption below the drawing only when one is slotted", async () => {
      const el = await fixture(
        html`<mermaid-diagram diagram-title="Titled">
          <pre>${FLOW}</pre>
        </mermaid-diagram>`,
      );
      await settled(el);
      const caption = el.shadowRoot.querySelector("figcaption");
      expect(caption.hidden).to.be.true;
      const span = document.createElement("span");
      span.slot = "caption";
      span.textContent = "A caption";
      el.appendChild(span);
      await waitUntil(() => !caption.hidden, "caption never showed");
      const canvas = el.shadowRoot.querySelector(".canvas");
      expect(
        canvas.compareDocumentPosition(caption) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).to.be.ok;
      expect(caption.getBoundingClientRect().top).to.be.at.least(
        canvas.getBoundingClientRect().bottom,
      );
      // the caption is content, not the source
      expect(el.code).to.equal(FLOW);
    });

    it("paints only the chip from accent-color", async () => {
      const el = await fixture(
        html`<mermaid-diagram accent-color="purple">
          <pre>${FLOW}</pre>
        </mermaid-diagram>`,
      );
      await settled(el);
      const plain = await fixture(
        html`<mermaid-diagram><pre>${FLOW}</pre></mermaid-diagram>`,
      );
      await settled(plain);
      const chip = (node) =>
        getComputedStyle(node.shadowRoot.querySelector(".ddd-block-chip"))
          .backgroundColor;
      expect(chip(el)).to.not.equal(chip(plain));
      expect(el._themeKey).to.equal(plain._themeKey);
    });
  });

  describe("colour scheme and palette", () => {
    const root = document.documentElement;
    const body = document.body;
    let previous;
    beforeEach(() => {
      previous = {
        scheme: root.style.colorScheme,
        background: body.style.backgroundColor,
        color: body.style.color,
      };
    });
    afterEach(() => {
      root.style.colorScheme = previous.scheme;
      body.style.backgroundColor = previous.background;
      body.style.color = previous.color;
    });

    it("draws again with different token values in dark mode", async () => {
      root.style.colorScheme = "light";
      const el = await fixture(
        html`<mermaid-diagram><pre>${FLOW}</pre></mermaid-diagram>`,
      );
      await settled(el);
      const light = JSON.parse(el._themeKey);
      const lightSvg = svgOf(el);
      const lightStyle = lightSvg.querySelector("style").textContent;
      expect(light.darkMode).to.be.false;
      expect(lightStyle).to.contain(light.primaryColor);
      root.style.colorScheme = "dark";
      await waitUntil(
        () => el._themeKey && JSON.parse(el._themeKey).darkMode === true,
        "the diagram was not drawn again for dark mode",
        { timeout: 20000 },
      );
      const dark = JSON.parse(el._themeKey);
      [
        "primaryColor",
        "primaryBorderColor",
        "primaryTextColor",
        "background",
      ].forEach((key) => {
        expect(dark[key], key).to.match(/^#[0-9a-f]{6}$/);
        expect(dark[key], key).to.not.equal(light[key]);
      });
      const darkSvg = svgOf(el);
      expect(darkSvg).to.not.equal(lightSvg);
      const darkStyle = darkSvg.querySelector("style").textContent;
      expect(darkStyle).to.contain(dark.primaryColor);
      expect(darkStyle).to.not.contain(light.primaryColor);
    });

    it("takes node fill and lines from the palette roles", async () => {
      const wrap = await fixture(
        html`<div
          style="--ddd-palette-tint: rgb(1, 2, 3); --ddd-palette-marker: rgb(200, 100, 50);"
        >
          <mermaid-diagram><pre>${FLOW}</pre></mermaid-diagram>
        </div>`,
      );
      const el = wrap.querySelector("mermaid-diagram");
      await settled(el);
      const theme = JSON.parse(el._themeKey);
      expect(theme.primaryColor).to.equal("#010203");
      expect(theme.lineColor).to.equal("#c86432");
      expect(theme.primaryBorderColor).to.equal("#c86432");
      expect(svgOf(el).querySelector("style").textContent).to.contain(
        "#010203",
      );
    });

    it("passes the a11y audit in dark mode", async () => {
      // light-dark() resolves against the used color-scheme. The explicit
      // Canvas background is needed because axe assumes a white page when
      // none is set, which would hide dark mode contrast failures.
      root.style.colorScheme = "dark";
      body.style.backgroundColor = "Canvas";
      body.style.color = "CanvasText";
      const el = await fixture(
        html`<mermaid-diagram
          diagram-title="Publishing checklist"
          show-source
          show-description
        >
          <pre>${FLOW}</pre>
        </mermaid-diagram>`,
      );
      await settled(el);
      await expect(el).shadowDom.to.be.accessible();
    });
  });

  describe("phone width", () => {
    afterEach(async () => {
      await setViewport({ width: 800, height: 600 });
    });

    it("scrolls a wide diagram inside the block at 360px, never the page", async () => {
      await setViewport({ width: 360, height: 700 });
      const el = await fixture(
        html`<mermaid-diagram diagram-title="A long row of steps" show-source>
          <pre>
flowchart LR
  A[The first step] --> B[The second step] --> C[The third step] --> D[The fourth step] --> E[The fifth step]</pre>
        </mermaid-diagram>`,
      );
      await settled(el);
      const canvas = el.shadowRoot.querySelector(".canvas");
      await waitUntil(() => el._scrollable, "the canvas never scrolled");
      await el.updateComplete;
      expect(canvas.scrollWidth).to.be.greaterThan(canvas.clientWidth);
      expect(document.documentElement.scrollWidth).to.be.at.most(
        globalThis.innerWidth,
      );
      expect(el.getBoundingClientRect().right).to.be.at.most(
        globalThis.innerWidth,
      );
      // a scroll area is reachable by keyboard and named
      expect(canvas.getAttribute("tabindex")).to.equal("0");
      expect(canvas.getAttribute("aria-label")).to.equal(el.t.scrollable);
      el.shadowRoot.querySelectorAll(".ddd-block-action").forEach((button) => {
        const box = button.getBoundingClientRect();
        expect(box.width).to.be.at.least(24);
        expect(box.height).to.be.at.least(24);
      });
      await expect(el).shadowDom.to.be.accessible();
    });
  });

  describe("presenting", () => {
    it("covers the window where full screen is not available, and Escape leaves", async () => {
      const el = await fixture(
        html`<mermaid-diagram><pre>${FLOW}</pre></mermaid-diagram>`,
      );
      await settled(el);
      const own = (name) =>
        Object.defineProperty(document, name, {
          value: false,
          configurable: true,
        });
      own("fullscreenEnabled");
      own("webkitFullscreenEnabled");
      try {
        const button = el.shadowRoot.querySelector("#present-toggle");
        const frame = el.shadowRoot.querySelector(".ddd-block");
        expect(button.getAttribute("aria-label")).to.equal(el.t.present);
        button.click();
        await el.updateComplete;
        expect(frame.classList.contains("presenting")).to.be.true;
        expect(getComputedStyle(frame).position).to.equal("fixed");
        expect(button.getAttribute("aria-pressed")).to.equal("true");
        expect(button.getAttribute("aria-label")).to.equal(el.t.exitPresent);
        frame.dispatchEvent(
          new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
        );
        await el.updateComplete;
        expect(frame.classList.contains("presenting")).to.be.false;
        expect(button.getAttribute("aria-pressed")).to.equal("false");
      } finally {
        delete document.fullscreenEnabled;
        delete document.webkitFullscreenEnabled;
      }
    });
  });

  describe("HAX", () => {
    it("declares its hooks and settings file", () => {
      const el = document.createElement("mermaid-diagram");
      expect(Object.keys(el.haxHooks())).to.deep.equal([
        "editModeChanged",
        "activeElementChanged",
        "preProcessNodeToContent",
      ]);
      expect(customElements.get("mermaid-diagram").haxProperties).to.match(
        /lib\/mermaid-diagram\.haxProperties\.json$/,
      );
    });

    it("shows the source and the text alternative while editing", async () => {
      const el = await fixture(
        html`<mermaid-diagram><pre>${FLOW}</pre></mermaid-diagram>`,
      );
      await settled(el);
      el.haxeditModeChanged(true);
      await el.updateComplete;
      expect(el.shadowRoot.querySelector("#source-panel").hidden).to.be.false;
      expect(
        el.shadowRoot.querySelector("#alt-panel").classList.contains("sr-only"),
      ).to.be.false;
      el.haxeditModeChanged(false);
      await el.updateComplete;
      expect(el.shadowRoot.querySelector("#source-panel").hidden).to.be.true;
      expect(el.hasAttribute("show-source")).to.be.false;
    });

    it("takes the form value (a code attribute) into the pre and saves only authored content", async () => {
      const el = await fixture(
        html`<mermaid-diagram diagram-title="Saved">
          <pre>${FLOW}</pre>
          <span slot="caption">Kept</span></mermaid-diagram
        >`,
      );
      await settled(el);
      const edited = 'flowchart TD\n  A["Uses <b> & quotes"] --> B[Done]';
      // what hax-tray does for a field that is not an own property
      el.setAttribute("code", edited);
      await waitUntil(
        () => svgOf(el).textContent.includes("Done"),
        "the form value was never drawn",
        { timeout: 20000 },
      );
      expect(el.querySelector("pre").textContent).to.equal(edited);
      const node = el.haxpreProcessNodeToContent(el);
      expect(node).to.equal(el);
      await el.updateComplete;
      expect(el.hasAttribute("code")).to.be.false;
      expect(el.code).to.equal(edited);
      expect(el.querySelector("pre").textContent).to.equal(edited);
      // only authored nodes are in the light DOM: no drawing, no ids
      expect(el.querySelectorAll("svg, style, [id]").length).to.equal(0);
      expect(Array.from(el.children).map((c) => c.localName)).to.deep.equal([
        "pre",
        "span",
      ]);
      // save then reload: the same markup draws the same diagram
      const saved = el.outerHTML;
      const holder = await fixture(html`<div></div>`);
      holder.innerHTML = saved;
      const again = holder.querySelector("mermaid-diagram");
      await settled(again);
      expect(again.code).to.equal(edited);
      expect(again.outerHTML).to.equal(saved);
    });
  });

  describe("clean up", () => {
    it("stops watching when removed and draws again when put back", async () => {
      const el = await fixture(
        html`<mermaid-diagram><pre>${FLOW}</pre></mermaid-diagram>`,
      );
      await settled(el);
      const parent = el.parentNode;
      el.remove();
      expect(el._contentObserver).to.equal(null);
      expect(el._pageObserver).to.equal(null);
      expect(el._schemeQuery).to.equal(null);
      expect(el._sizeObserver).to.equal(null);
      expect(el._viewObserver).to.not.be.ok;
      parent.appendChild(el);
      el.code = "flowchart TD\n  A[Back] --> B[Again]";
      await waitUntil(
        () => svgOf(el) && svgOf(el).textContent.includes("Again"),
        "it did not draw after being put back",
        { timeout: 20000 },
      );
    });
  });
});
