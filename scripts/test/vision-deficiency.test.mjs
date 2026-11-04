// node --test scripts/test/*.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseColor,
  simulate,
  contrastRatio,
  deltaE2000,
  comparePair,
  toHex,
} from "../lib/vision-deficiency.mjs";
import { readTokens, resolveColor, scorePair } from "../vision-pairs-check.mjs";

const hex = (h) => parseColor(h);

test("WCAG contrast: black on white is 21:1, a color on itself is 1:1", () => {
  assert.equal(contrastRatio(hex("#000"), hex("#fff")).toFixed(2), "21.00");
  assert.equal(contrastRatio(hex("#009cde"), hex("#009cde")), 1);
});

test("CIEDE2000: identical colors are 0 apart, black and white about 100", () => {
  assert.equal(deltaE2000(hex("#ff0000"), hex("#ff0000")), 0);
  const bw = deltaE2000(hex("#000000"), hex("#ffffff"));
  assert.ok(bw > 99 && bw < 101);
  // symmetric
  const ab = deltaE2000(hex("#009cde"), hex("#f2665e"));
  const ba = deltaE2000(hex("#f2665e"), hex("#009cde"));
  assert.ok(Math.abs(ab - ba) < 1e-9);
});

test("greyscale keeps luminance, so contrast against white is unchanged", () => {
  const c = hex("#bc204b");
  const g = simulate(c, "achromatopsia");
  assert.equal(g.r, g.g);
  assert.equal(g.g, g.b);
  assert.ok(
    Math.abs(contrastRatio(c, hex("#fff")) - contrastRatio(g, hex("#fff"))) <
      0.05,
  );
});

test("deuteranopia collapses red and green toward the same yellow", () => {
  const red = simulate(hex("#ff0000"), "deuteranopia");
  const green = simulate(hex("#00ff00"), "deuteranopia");
  assert.ok(deltaE2000(red, green) < deltaE2000(hex("#f00"), hex("#0f0")) / 2);
  // greys stay grey under every matrix
  assert.equal(toHex(simulate(hex("#808080"), "protanopia")), "#808080");
});

test("old editor toolbar: skyBlue Save and discoveryCoral Cancel are the same grey", () => {
  const rows = comparePair("#009cde", "#f2665e", "#000000");
  const grey = rows.find((r) => r.mode === "achromatopsia");
  assert.equal(grey.a, grey.b);
  assert.ok(rows.every((r) => r.pairContrast < 3));
});

test("tokens resolve through var(), light-dark() and color-mix()", () => {
  const tokens = readTokens();
  assert.equal(
    toHex(resolveColor("--hax-ui-primary", "light", tokens)),
    "#001e44",
  );
  assert.equal(
    toHex(resolveColor("--hax-ui-primary", "dark", tokens)),
    "#cce9ff",
  );
  const soft = resolveColor("--hax-ui-danger-soft", "dark", tokens);
  assert.equal(toHex(soft), "#f2665e");
  assert.ok(Math.abs(soft.a - 0.1) < 1e-9);
});

test("a pair separated only by hue fails; a declared pattern cue rescues it", () => {
  const tokens = readTokens();
  const base = {
    id: "t",
    background: "#000000",
    accept: { label: "Save", fill: "#009cde", cues: [] },
    reject: { label: "Cancel", fill: "#f2665e", cues: [] },
  };
  assert.ok(scorePair(base, "dark", tokens).every((r) => r.status === "fail"));
  const striped = {
    ...base,
    reject: { ...base.reject, cues: ["pattern"] },
  };
  assert.ok(
    scorePair(striped, "dark", tokens).every((r) => r.status === "cue"),
  );
});
