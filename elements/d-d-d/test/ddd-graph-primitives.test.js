import { fixture, expect, html, oneEvent } from "@open-wc/testing";
import { LitElement, svg } from "lit";
import * as DDDModule from "../d-d-d.js";
import { DDDMotionStyles } from "../lib/DDDMotion.js";
import {
  DDDConnectorKinds,
  DDDConnectorStyles,
  measureDDDConnector,
} from "../lib/DDDConnector.js";
import {
  DDDNodeShapeNames,
  DDDNodeStyles,
  dddNodeShapePath,
  dddNodeShapeInset,
  dddNodeMonogram,
  renderDDDNode,
} from "../lib/DDDNodeShapes.js";
import {
  DDDComboboxStyles,
  DDDToggleGroupStyles,
} from "../lib/DDDReaderControls.js";
import {
  DDDLifecycleStates,
  DDDLifecycleStyles,
  renderDDDStatusPill,
} from "../lib/DDDLifecycle.js";
import {
  DDDViewport,
  DDDViewportStyles,
  renderDDDZoomControls,
} from "../lib/DDDViewport.js";

const cssOf = (styles) =>
  [styles]
    .flat(Infinity)
    .map((s) => s.cssText)
    .join("\n");

class DDDGraphPrimitivesTester extends LitElement {
  static get styles() {
    return [
      DDDConnectorStyles,
      DDDNodeStyles,
      DDDComboboxStyles,
      DDDToggleGroupStyles,
      DDDLifecycleStyles,
      DDDViewportStyles,
    ];
  }
  render() {
    return html`<svg viewBox="0 0 200 100" width="200" height="100">
        ${DDDConnectorKinds.map(
          (k) =>
            svg`<path class="ddd-connector" data-kind="${k.kind}" d="M0 10 H200"></path>`,
        )}
        <g class="ddd-node">
          ${renderDDDNode({
            shape: "cylinder",
            width: 60,
            height: 60,
            label: "HAX CLI",
          })}
        </g>
      </svg>
      <div class="ddd-toggle-group swatches" role="group" aria-label="Lines">
        <button class="ddd-block-action has-text" aria-pressed="true">
          <span
            class="ddd-toggle-swatch"
            style="--ddd-toggle-swatch-color: rgb(10, 20, 30)"
          ></span
          >Contract
        </button>
        <button class="ddd-block-action has-text" aria-pressed="false">
          Credit
        </button>
      </div>
      ${renderDDDStatusPill({ state: "legacy" })}`;
  }
}
globalThis.customElements.define(
  "ddd-graph-primitives-tester",
  DDDGraphPrimitivesTester,
);

describe("DDD graph primitives", () => {
  it("are standalone modules that add nothing to the d-d-d exports", () => {
    [
      "DDDMotionStyles",
      "DDDConnectorStyles",
      "DDDNodeStyles",
      "DDDComboboxStyles",
      "DDDToggleGroupStyles",
      "DDDLifecycleStyles",
      "DDDViewport",
      "DDDViewportStyles",
    ].forEach((name) => expect(DDDModule[name], name).to.equal(undefined));
  });
});

describe("DDDMotion", () => {
  const text = cssOf(DDDMotionStyles);
  it("prefixes its keyframes ddd-motion-*", () => {
    expect(text).to.contain("@keyframes ddd-motion-draw-in");
    expect(text).to.contain("@keyframes ddd-motion-flow");
    expect(text).to.not.match(/@keyframes (?!ddd-motion-)/);
  });
  it("builds its durations on the DDD duration and timing tokens", () => {
    expect(text).to.contain("--ddd-motion-draw-in-duration");
    expect(text).to.contain("--ddd-motion-flow-duration");
    expect(text).to.contain("var(--ddd-duration-slow");
    expect(text).to.contain("var(--ddd-timing-linear");
  });
  it("stops both motions under prefers-reduced-motion", () => {
    expect(text).to.match(
      /prefers-reduced-motion: reduce\)\s*\{\s*\.ddd-motion-draw-in,\s*\.ddd-motion-flow\s*\{\s*animation: none/,
    );
  });
  it("does not loop flow forever by default", () => {
    expect(text).to.contain("--ddd-motion-flow-iterations: 4");
  });
});

describe("DDDConnector", () => {
  it("names five kinds that differ by width or dash, not only colour", () => {
    expect(DDDConnectorKinds.map((k) => k.kind)).to.deep.equal([
      "relationship",
      "contract",
      "membership",
      "credit",
      "emphasis",
    ]);
    const looks = DDDConnectorKinds.map((k) => `${k.width}|${k.dash}`);
    expect(new Set(looks).size).to.equal(5);
  });

  it("includes the chart palette and the motion library", () => {
    const text = cssOf(DDDConnectorStyles);
    expect(text).to.contain("--ddd-chart-1");
    expect(text).to.contain("@keyframes ddd-motion-flow");
  });

  it("applies each kind's dash pattern and width to its line", async () => {
    const el = await fixture(
      html`<ddd-graph-primitives-tester
        style="--ddd-border-size-xs: 1px; --ddd-border-size-sm: 2px; --ddd-border-size-lg: 4px"
      ></ddd-graph-primitives-tester>`,
    );
    const line = (kind) =>
      getComputedStyle(
        el.shadowRoot.querySelector(`.ddd-connector[data-kind="${kind}"]`),
      );
    expect(line("relationship").strokeDasharray).to.equal("none");
    expect(line("contract").strokeDasharray).to.match(/^8(px)?,? 4(px)?$/);
    expect(line("membership").strokeLinecap).to.equal("round");
    expect(line("emphasis").strokeWidth).to.equal("4px");
    expect(line("credit").strokeWidth).to.equal("1px");
    expect(line("relationship").fill).to.equal("none");
  });

  it("measures a line into --ddd-connector-length", async () => {
    const el = await fixture(
      html`<ddd-graph-primitives-tester></ddd-graph-primitives-tester>`,
    );
    const path = el.shadowRoot.querySelector(".ddd-connector");
    expect(measureDDDConnector(path)).to.equal(200);
    expect(path.style.getPropertyValue("--ddd-connector-length")).to.equal(
      "200",
    );
    expect(measureDDDConnector(null)).to.equal(0);
    expect(measureDDDConnector({})).to.equal(0);
  });
});

describe("DDDNodeShapes", () => {
  it("draws a path for every shape and nothing for an empty box", () => {
    DDDNodeShapeNames.forEach((shape) => {
      const d = dddNodeShapePath(shape, 80, 60);
      expect(d, shape).to.match(/^M/);
      expect(d, shape).to.not.contain("NaN");
    });
    expect(dddNodeShapePath("tile", 0, 60)).to.equal("");
    expect(dddNodeShapePath("tile", "x", 60)).to.equal("");
  });

  it("adds the cylinder lid and the subroutine sides as subpaths", () => {
    expect(dddNodeShapePath("cylinder", 80, 60).split("M").length - 1).to.equal(
      2,
    );
    expect(
      dddNodeShapePath("subroutine", 80, 60).split("M").length - 1,
    ).to.equal(3);
  });

  it("offsets the path by x and y", () => {
    expect(dddNodeShapePath("subroutine", 10, 10, 5, 7)).to.match(/^M5 7H15/);
  });

  it("keeps the icon box inside the frame", () => {
    DDDNodeShapeNames.forEach((shape) => {
      const box = dddNodeShapeInset(shape, 80, 60);
      expect(box.width, shape).to.equal(box.height);
      expect(box.width, shape).to.be.above(0);
      expect(box.x, shape).to.be.at.least(0);
      expect(box.y, shape).to.be.at.least(0);
      expect(box.x + box.width, shape).to.be.at.most(80);
      expect(box.y + box.height, shape).to.be.at.most(60);
    });
    const lid = dddNodeShapeInset("cylinder", 60, 60);
    expect(lid.y).to.be.above(dddNodeShapeInset("tile", 60, 60).y);
  });

  it("makes a one or two letter monogram, or none", () => {
    expect(dddNodeMonogram("HAX CLI")).to.equal("HC");
    expect(dddNodeMonogram("haxcms-nodejs")).to.equal("HN");
    expect(dddNodeMonogram("Merlin")).to.equal("ME");
    expect(dddNodeMonogram("Merlin", 1)).to.equal("M");
    expect(dddNodeMonogram("  ")).to.equal("");
    expect(dddNodeMonogram("3D viewer")).to.equal("");
    expect(dddNodeMonogram(null)).to.equal("");
  });

  it("renders a frame and a hidden monogram", async () => {
    const el = await fixture(
      html`<ddd-graph-primitives-tester></ddd-graph-primitives-tester>`,
    );
    const frame = el.shadowRoot.querySelector(".ddd-node-frame");
    expect(frame.getAttribute("data-shape")).to.equal("cylinder");
    const mono = el.shadowRoot.querySelector(".ddd-node-monogram");
    expect(mono.textContent.trim()).to.equal("HC");
    expect(mono.getAttribute("aria-hidden")).to.equal("true");
  });
});

describe("DDDReaderControls", () => {
  it("styles the combobox parts and its active option", () => {
    const text = cssOf(DDDComboboxStyles);
    [
      ".ddd-combobox-input",
      ".ddd-combobox-listbox",
      ".ddd-combobox-group-label",
      '.ddd-combobox-option[aria-selected="true"]',
      "var(--ddd-focus-ring)",
    ].forEach((sel) => expect(text, sel).to.contain(sel));
  });

  it("keeps a swatch's colour inside a pressed legend toggle", async () => {
    const el = await fixture(
      html`<ddd-graph-primitives-tester
        style="color-scheme: light; --ddd-theme-default-link: rgb(0, 95, 169); --ddd-theme-default-linkLight: rgb(204, 233, 255); --ddd-theme-default-skyMaxLight: rgb(230, 247, 255); --ddd-theme-default-potentialMidnight: rgb(0, 3, 33); --ddd-theme-default-nittanyNavy: rgb(0, 30, 68); --ddd-border-size-xs: 1px; --ddd-border-size-md: 3px"
      ></ddd-graph-primitives-tester>`,
    );
    const pressed = el.shadowRoot.querySelector('[aria-pressed="true"]');
    const cs = getComputedStyle(pressed);
    expect(cs.backgroundColor).to.equal("rgb(230, 247, 255)");
    expect(cs.borderTopColor).to.equal("rgb(0, 95, 169)");
    const swatch = getComputedStyle(
      el.shadowRoot.querySelector(".ddd-toggle-swatch"),
    );
    expect(swatch.borderTopColor).to.equal("rgb(10, 20, 30)");
  });
});

describe("DDDLifecycle", () => {
  it("names four states with tokens for each", () => {
    expect(DDDLifecycleStates).to.deep.equal([
      "released",
      "pre-release",
      "planned",
      "legacy",
    ]);
    const text = cssOf(DDDLifecycleStyles);
    DDDLifecycleStates.forEach((s) => {
      ["signal", "ink", "bg", "line"].forEach((part) =>
        expect(text).to.contain(`--ddd-lifecycle-${s}-${part}:`),
      );
    });
  });

  it("gives every state its own line style", () => {
    const text = cssOf(DDDLifecycleStyles);
    const lines = DDDLifecycleStates.map((s) => {
      const m = text.match(new RegExp(`--ddd-lifecycle-${s}-line: (\\w+);`));
      return m ? m[1] : null;
    });
    expect(lines).to.deep.equal(["solid", "dashed", "dotted", "double"]);
  });

  it("always shows a word, and falls back to planned", async () => {
    const el = await fixture(
      html`<div>
        ${renderDDDStatusPill({ state: "released", label: "Disponible" })}
        ${renderDDDStatusPill({ state: "nope" })}
      </div>`,
    );
    const pills = el.querySelectorAll(".ddd-status-pill");
    expect(pills[0].getAttribute("data-lifecycle")).to.equal("released");
    expect(pills[0].textContent.trim()).to.equal("Disponible");
    expect(pills[1].getAttribute("data-lifecycle")).to.equal("planned");
    expect(pills[1].textContent.trim()).to.equal("Planned");
  });

  it("draws the legacy pill with a double border", async () => {
    const el = await fixture(
      html`<ddd-graph-primitives-tester
        style="--ddd-border-size-md: 3px"
      ></ddd-graph-primitives-tester>`,
    );
    const pill = el.shadowRoot.querySelector(".ddd-status-pill");
    expect(getComputedStyle(pill).borderTopStyle).to.equal("double");
  });
});

describe("DDDViewport", () => {
  async function setup(opts) {
    const el = await fixture(
      html`<div style="width: 200px; height: 100px">
        <svg
          viewBox="0 0 200 100"
          width="200"
          height="100"
          tabindex="0"
          aria-label="graph"
          role="img"
        >
          <rect x="0" y="0" width="200" height="100"></rect>
        </svg>
      </div>`,
    );
    const target = el.querySelector("svg");
    const vp = new DDDViewport(null, { target, ...(opts || {}) });
    expect(vp.attach()).to.equal(true);
    return { target, vp };
  }
  const box = (target) => target.getAttribute("viewBox").split(" ").map(Number);

  it("zooms around the middle, clamps, and fits back", async () => {
    const { target, vp } = await setup({ maxScale: 2 });
    vp.zoomIn();
    expect(vp.scale).to.be.closeTo(1.25, 0.001);
    const [x, y, w, h] = box(target);
    expect(w).to.be.closeTo(160, 0.01);
    expect(h).to.be.closeTo(80, 0.01);
    expect(x + w / 2).to.be.closeTo(100, 0.01);
    expect(y + h / 2).to.be.closeTo(50, 0.01);
    for (let i = 0; i < 10; i++) {
      vp.zoomIn();
    }
    expect(vp.scale).to.be.closeTo(2, 0.001);
    vp.fit();
    expect(box(target)).to.deep.equal([0, 0, 200, 100]);
  });

  it("pans and reports each change", async () => {
    const { target, vp } = await setup();
    setTimeout(() => vp.panBy(10, -5));
    const e = await oneEvent(target, "ddd-viewport-change");
    expect(e.detail.x).to.equal(10);
    expect(e.detail.y).to.equal(-5);
    expect(e.detail.scale).to.equal(1);
  });

  it("zooms on Ctrl + wheel and leaves a plain wheel to the page", async () => {
    const { target, vp } = await setup();
    const plain = new WheelEvent("wheel", {
      deltaY: -100,
      cancelable: true,
      clientX: 10,
      clientY: 10,
    });
    target.dispatchEvent(plain);
    expect(plain.defaultPrevented).to.equal(false);
    expect(vp.scale).to.equal(1);
    const zoom = new WheelEvent("wheel", {
      deltaY: -100,
      ctrlKey: true,
      cancelable: true,
      clientX: 10,
      clientY: 10,
    });
    target.dispatchEvent(zoom);
    expect(zoom.defaultPrevented).to.equal(true);
    expect(vp.scale).to.be.above(1);
  });

  it("pans and zooms from the keyboard when the svg has focus", async () => {
    const { target, vp } = await setup();
    target.focus();
    target.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
    );
    expect(box(target)[0]).to.be.closeTo(20, 0.01);
    target.dispatchEvent(
      new KeyboardEvent("keydown", { key: "+", bubbles: true }),
    );
    expect(vp.scale).to.be.above(1);
    target.dispatchEvent(
      new KeyboardEvent("keydown", { key: "0", bubbles: true }),
    );
    expect(box(target)).to.deep.equal([0, 0, 200, 100]);
  });

  it("stops listening once detached", async () => {
    const { target, vp } = await setup();
    vp.detach();
    target.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
    );
    expect(box(target)[0]).to.equal(0);
  });

  it("renders labelled zoom controls that call back", async () => {
    let calls = "";
    const el = await fixture(
      html`<div>
        ${renderDDDZoomControls({
          onZoomIn: () => (calls += "i"),
          onZoomOut: () => (calls += "o"),
          onFit: () => (calls += "f"),
          labels: { zoomIn: "Agrandir" },
        })}
      </div>`,
    );
    const group = el.querySelector(".ddd-viewport-controls");
    expect(group.getAttribute("role")).to.equal("group");
    const buttons = group.querySelectorAll("button.ddd-block-action");
    expect(buttons.length).to.equal(3);
    expect(buttons[0].getAttribute("aria-label")).to.equal("Agrandir");
    expect(buttons[1].getAttribute("aria-label")).to.equal("Zoom out");
    buttons.forEach((b) => b.click());
    expect(calls).to.equal("iof");
  });

  it("ships the viewport and corner control styles", () => {
    const text = cssOf(DDDViewportStyles);
    expect(text).to.contain(".ddd-viewport-controls");
    expect(text).to.contain("touch-action: none");
  });
});
