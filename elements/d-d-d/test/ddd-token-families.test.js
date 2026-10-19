import { expect } from "@open-wc/testing";
import { DDDVariables } from "../lib/DDDStyles.js";

// token -> value, read from the DDDVariables block
const text = DDDVariables.cssText;
const value = (name) => {
  const m = new RegExp(`${name}:\\s*([^;]+);`).exec(text);
  return m ? m[1].replace(/\s+/g, " ").trim() : undefined;
};

describe("DDD control sizes and touch targets", () => {
  it("defines the control height scale", () => {
    expect(value("--ddd-control-height-xs")).to.equal("32px");
    expect(value("--ddd-control-height-sm")).to.equal("40px");
    expect(value("--ddd-control-height-md")).to.equal("48px");
    expect(value("--ddd-control-height-lg")).to.equal("56px");
  });

  it("keeps sm / md / lg aligned with the text field heights", () => {
    ["sm", "md", "lg"].forEach((size) => {
      expect(value(`--ddd-control-height-${size}`)).to.equal(
        value(`--ddd-textfield-height-${size}`),
      );
    });
  });

  it("defines WCAG target sizes, and no control is smaller than the minimum", () => {
    expect(value("--ddd-target-min")).to.equal("24px");
    expect(value("--ddd-target-comfortable")).to.equal("44px");
    expect(parseInt(value("--ddd-control-height-xs"))).to.be.at.least(
      parseInt(value("--ddd-target-min")),
    );
  });
});

describe("DDD interaction states", () => {
  it("defines state layer opacities in increasing emphasis", () => {
    const hover = Number(value("--ddd-state-hover-opacity"));
    const focus = Number(value("--ddd-state-focus-opacity"));
    const pressed = Number(value("--ddd-state-pressed-opacity"));
    const selected = Number(value("--ddd-state-selected-opacity"));
    expect(hover).to.equal(0.08);
    expect(focus).to.equal(0.12);
    expect(pressed).to.equal(0.12);
    expect(selected).to.equal(0.16);
    expect(hover).to.be.below(focus);
    expect(pressed).to.be.below(selected);
  });

  it("matches the disabled opacity the monorepo already uses", () => {
    expect(value("--ddd-state-disabled-opacity")).to.equal("0.5");
  });
});

describe("DDD motion", () => {
  it("defines easing by intent", () => {
    expect(value("--ddd-timing-enter")).to.equal("cubic-bezier(0, 0, 0.2, 1)");
    expect(value("--ddd-timing-exit")).to.equal("cubic-bezier(0.4, 0, 1, 1)");
    expect(value("--ddd-timing-emphasized")).to.equal(
      "cubic-bezier(0.2, 0, 0, 1)",
    );
    expect(value("--ddd-timing-linear")).to.equal("linear");
  });

  it("keeps the reduced duration above zero so transitionend still fires", () => {
    expect(value("--ddd-duration-reduced")).to.equal("0.01ms");
  });
});

describe("DDD typography, measure and aspect ratios", () => {
  it("defines a monospace font stack ending in the generic family", () => {
    const mono = value("--ddd-font-mono");
    expect(mono.startsWith("ui-monospace")).to.be.true;
    expect(mono.endsWith("monospace")).to.be.true;
  });

  it("defines reading measures and a theme alias", () => {
    expect(value("--ddd-measure-sm")).to.equal("45ch");
    expect(value("--ddd-measure-md")).to.equal("65ch");
    expect(value("--ddd-measure-lg")).to.equal("80ch");
    expect(value("--ddd-theme-measure")).to.equal("var(--ddd-measure-md)");
  });

  it("defines aspect ratios", () => {
    expect(value("--ddd-aspect-video")).to.equal("16 / 9");
    expect(value("--ddd-aspect-standard")).to.equal("4 / 3");
    expect(value("--ddd-aspect-square")).to.equal("1 / 1");
  });

  it("resolves the new tokens in a rendered element", async () => {
    const host = globalThis.document.createElement("div");
    const root = host.attachShadow({ mode: "open" });
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(text);
    root.adoptedStyleSheets = [sheet];
    root.innerHTML = `<span style="aspect-ratio: var(--ddd-aspect-video); min-height: var(--ddd-control-height-md)"></span>`;
    globalThis.document.body.appendChild(host);
    try {
      const style = getComputedStyle(root.querySelector("span"));
      expect(style.aspectRatio).to.equal("16 / 9");
      expect(style.minHeight).to.equal("48px");
    } finally {
      host.remove();
    }
  });
});
