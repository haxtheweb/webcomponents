import { fixture, expect, html } from "@open-wc/testing";
import { CountUp } from "../lib/countup.js";

const flush = (ms = 20) => new Promise((r) => setTimeout(r, ms));

// poll until a condition flips true (or time out) so rAF-based animations
// never rely on exact frame timing
async function waitFor(fn, timeout = 3000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (fn()) {
      return true;
    }
    await flush(25);
  }
  return fn();
}

function makeTarget(tag = "div") {
  const el = globalThis.document.createElement(tag);
  globalThis.document.body.appendChild(el);
  return el;
}

describe("CountUp library (lib/countup.js)", () => {
  it("constructs with element targets and merged defaults", () => {
    const div = makeTarget();
    const cu = new CountUp(div, 10, { duration: 1 });
    expect(cu.target).to.equal(div);
    expect(cu.version).to.equal("2.0.4");
    expect(cu.options.startVal).to.equal(0);
    expect(cu.options.duration).to.equal(1);
    expect(cu.options.separator).to.equal(",");
    expect(cu.error).to.equal("");
    // the start value is printed immediately on construction
    expect(div.innerHTML).to.equal("0");
  });

  it("constructs from a string element id", () => {
    const div = makeTarget();
    div.id = "count-up-id-target";
    const cu = new CountUp("count-up-id-target", 5);
    expect(cu.el).to.equal(div);
    expect(cu.error).to.equal("");
  });

  it("flags a missing target as an error and start is a no-op", async () => {
    const cu = new CountUp("does-not-exist-anywhere", 5);
    expect(cu.el).to.equal(null);
    expect(cu.error).to.equal(
      "[CountUp] target is null or undefined",
    );
    cu.start();
    await flush(100);
    expect(cu.paused).to.equal(true);
  });

  it("formats grouping separators, decimals, negatives and affixes", () => {
    const div = makeTarget();
    const cu = new CountUp(div, 0, {
      prefix: "$",
      suffix: " USD",
    });
    cu.printValue(1234567);
    expect(div.innerHTML).to.equal("$1,234,567 USD");
    cu.printValue(-1234);
    expect(div.innerHTML).to.equal("-$1,234 USD");
  });

  it("supports custom separator and decimal characters", () => {
    const div = makeTarget();
    const cu = new CountUp(div, 0, {
      separator: ".",
      decimal: ",",
      decimalPlaces: 2,
    });
    cu.printValue(1234567.89);
    expect(div.innerHTML).to.equal("1.234.567,89");
  });

  it("supports custom numeral systems", () => {
    const div = makeTarget();
    const cu = new CountUp(div, 0, {
      numerals: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"],
    });
    cu.printValue(12);
    expect(div.innerHTML).to.equal("bc");
  });

  it("disables grouping when the separator is empty", () => {
    const div = makeTarget();
    const cu = new CountUp(div, 0, { separator: "" });
    expect(cu.options.useGrouping).to.equal(false);
    cu.printValue(1234567);
    expect(div.innerHTML).to.equal("1234567");
  });

  it("prints into INPUT value and SVG text/tspan textContent", () => {
    const input = makeTarget("input");
    const cuInput = new CountUp(input, 5);
    cuInput.printValue(5);
    expect(input.value).to.equal("5");

    const svgns = "http://www.w3.org/2000/svg";
    const text = globalThis.document.createElementNS(svgns, "text");
    globalThis.document.body.appendChild(text);
    const cuText = new CountUp(text, 5);
    cuText.printValue(5);
    expect(text.textContent).to.equal("5");

    const tspan = globalThis.document.createElementNS(svgns, "tspan");
    globalThis.document.body.appendChild(tspan);
    const cuTspan = new CountUp(tspan, 5);
    cuTspan.printValue(5);
    expect(tspan.textContent).to.equal("5");
  });

  it("prints the end value immediately when duration is 0", () => {
    const div = makeTarget();
    const cu = new CountUp(div, 99, { duration: 0 });
    let callbacks = 0;
    cu.start(() => callbacks++);
    expect(div.innerHTML).to.equal("99");
    expect(callbacks).to.equal(0);
  });

  it("animates to the end value and fires the callback", async () => {
    const div = makeTarget();
    const cu = new CountUp(div, 10, { duration: 0.2, useEasing: false });
    let callbacks = 0;
    cu.start(() => callbacks++);
    expect(await waitFor(() => div.innerHTML === "10")).to.equal(true);
    expect(callbacks).to.equal(1);
  });

  it("uses smart easing for large jumps and still lands exactly", async () => {
    const div = makeTarget();
    // 0 -> 5000 exceeds the smart easing threshold (999) so the library
    // animates to a reduced value first, then updates to the real end
    const cu = new CountUp(div, 5000, { duration: 0.2 });
    let callbacks = 0;
    cu.start(() => callbacks++);
    expect(cu.finalEndVal).to.equal(5000);
    expect(cu.endVal).to.equal(5000 - 333);
    expect(cu.useEasing).to.equal(false);
    expect(await waitFor(() => div.innerHTML === "5,000")).to.equal(true);
    expect(callbacks).to.equal(1);
  });

  it("counts down when the start is above the end", async () => {
    const div = makeTarget();
    div.innerHTML = "";
    const cu = new CountUp(div, 0, {
      startVal: 10,
      duration: 0.2,
      useEasing: false,
    });
    cu.start();
    expect(await waitFor(() => div.innerHTML === "0")).to.equal(true);
  });

  it("pauseResume stops and resumes the animation", async () => {
    const div = makeTarget();
    const cu = new CountUp(div, 100, { duration: 1 });
    cu.start();
    await flush(80);
    cu.pauseResume();
    expect(cu.paused).to.equal(true);
    const frozen = div.innerHTML;
    expect(frozen === "100").to.equal(false);
    await flush(80);
    // still frozen while paused
    expect(div.innerHTML).to.equal(frozen);
    cu.pauseResume();
    expect(cu.paused).to.equal(false);
    expect(await waitFor(() => div.innerHTML === "100")).to.equal(true);
  });

  it("reset cancels the run and prints the start value again", async () => {
    const div = makeTarget();
    const cu = new CountUp(div, 100, { duration: 1 });
    cu.start();
    await flush(80);
    expect(cu.paused).to.equal(false);
    cu.reset();
    expect(cu.paused).to.equal(true);
    expect(div.innerHTML).to.equal("0");
    await flush(120);
    // no frames run after the reset
    expect(div.innerHTML).to.equal("0");
  });

  it("update retargets a finished counter", async () => {
    const div = makeTarget();
    const cu = new CountUp(div, 10, { duration: 0.1, useEasing: false });
    cu.start();
    expect(await waitFor(() => div.innerHTML === "10")).to.equal(true);
    cu.update(20);
    expect(await waitFor(() => div.innerHTML === "20")).to.equal(true);
    // updating to the current value is a no-op (no error, no change)
    cu.update(20);
    await flush(150);
    expect(div.innerHTML).to.equal("20");
    expect(cu.error).to.equal("");
  });

  it("validateValue and ensureNumber guard bad input", () => {
    const div = makeTarget();
    const cu = new CountUp(div, 10);
    expect(cu.ensureNumber(5)).to.equal(true);
    expect(cu.ensureNumber("5")).to.equal(false);
    expect(cu.ensureNumber(NaN)).to.equal(false);
    expect(cu.validateValue("12")).to.equal(12);
    expect(cu.validateValue("abc")).to.equal(null);
    expect(cu.error).to.equal("[CountUp] invalid start or end value: abc");
  });

  it("rejects invalid end values at construction time", () => {
    const div = makeTarget();
    const cu = new CountUp(div, "not-a-number");
    expect(cu.endVal).to.equal(null);
    expect(cu.error).to.equal(
      "[CountUp] invalid start or end value: not-a-number",
    );
  });

  it("supports custom easing and formatting functions", async () => {
    const div = makeTarget();
    const cu = new CountUp(div, 10, {
      duration: 0.2,
      easingFn: (t, b, c, d) => b + (c * t) / d,
      formattingFn: (value) => "N" + value,
    });
    cu.start();
    expect(await waitFor(() => div.innerHTML === "N10")).to.equal(true);
  });
});

describe("count-up element re-exports the CountUp library", () => {
  it("shares the same class from the element module", async () => {
    const mod = await import("../count-up.js");
    const libMod = await import("../lib/countup.js");
    expect(mod.CountUp).to.equal(libMod.CountUp);
    const el = await fixture(html`<count-up end="7"></count-up>`);
    expect(el._countUp.version).to.equal("2.0.4");
    expect(el._countUp.endVal).to.equal(7);
  });
});
