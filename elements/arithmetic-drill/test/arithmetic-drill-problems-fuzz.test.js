/**
 * Property tests for the arithmetic-drill problem generator: whatever the
 * settings and whatever the random source returns, every problem keeps the
 * rules (whole numbers in range, no negative differences, whole number
 * quotients, never a zero divisor).
 */
import { expect } from "@open-wc/testing";
import fc from "fast-check";
import {
  OPERATIONS,
  DEFAULT_OPERATIONS,
  MAX_COUNT,
  MAX_OPERAND,
  cryptoUint32,
  makeProblems,
  normalizeSettings,
  parseAnswer,
  parseOperations,
  randomInt,
} from "../lib/arithmetic-drill-problems.js";
import { fuzzConfig } from "../../../scripts/test-setup/fuzz-config.mjs";

const RUNS = fuzzConfig({ defaultSeed: 20261114, defaultRuns: 300 });

// a random source driven by fast-check, biased toward the edges
const uint32 = fc.oneof(
  fc.constantFrom(0, 1, 4294967295, 4294967294, 2147483648),
  fc.integer({ min: 0, max: 4294967295 }),
);
const source = fc.array(uint32, { minLength: 1, maxLength: 64 }).map((list) => {
  let i = 0;
  return () => list[i++ % list.length];
});

const operand = fc.oneof(
  fc.constantFrom(0, 1, 2, 12, MAX_OPERAND, -5, 1.5, NaN, "7", null),
  fc.integer({ min: -20, max: 200 }),
);

function check(problem, s) {
  const { operation, a, b, answer } = problem;
  expect(s.operations).to.include(operation);
  [a, b, answer].forEach((n) => {
    expect(Number.isInteger(n), `${operation} ${a} ${b} ${answer}`).to.equal(
      true,
    );
    expect(n).to.be.at.least(0);
  });
  if (operation === "add") {
    expect(answer).to.equal(a + b);
    expect(a).to.be.within(s.min, s.max);
    expect(b).to.be.within(s.min, s.max);
  } else if (operation === "subtract") {
    expect(a).to.be.at.least(b);
    expect(answer).to.equal(a - b);
    expect(a).to.be.within(s.min, s.max);
    expect(b).to.be.within(s.min, s.max);
  } else if (operation === "multiply") {
    expect(answer).to.equal(a * b);
    expect(a).to.be.within(s.min, s.max);
    expect(b).to.be.within(s.min, s.max);
  } else {
    expect(b).to.be.at.least(1);
    expect(a % b).to.equal(0);
    expect(answer).to.equal(a / b);
    expect(answer).to.be.within(s.min, s.max);
    expect(b).to.be.within(Math.max(1, s.min), Math.max(1, s.max));
  }
}

describe("arithmetic-drill problem generator", () => {
  it("every generated problem keeps the rules, whatever the settings", () => {
    fc.assert(
      fc.property(
        fc.subarray(OPERATIONS),
        operand,
        operand,
        fc.oneof(fc.constantFrom(0, 1, 10, 100, 5000, -1, NaN), fc.nat(40)),
        source,
        (operations, min, max, count, next) => {
          const settings = { operations, min, max, count };
          const s = normalizeSettings(settings);
          const problems = makeProblems(settings, next);
          expect(problems.length).to.equal(s.count);
          expect(s.count).to.be.within(1, MAX_COUNT);
          expect(s.min).to.be.at.most(s.max);
          problems.forEach((p) => check(p, s));
        },
      ),
      RUNS,
    );
  });

  it("keeps the rules with the real cryptographic source", () => {
    const settings = {
      operations: "add subtract multiply divide",
      min: 0,
      max: 12,
      count: 100,
    };
    const s = normalizeSettings(settings);
    const seen = {};
    for (let run = 0; run < 20; run++) {
      makeProblems(settings).forEach((p) => {
        check(p, s);
        seen[p.operation] = true;
      });
    }
    expect(Object.keys(seen).sort()).to.deep.equal(OPERATIONS.slice().sort());
  });

  it("randomInt stays in range and cryptoUint32 is a 32 bit whole number", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 9999 }),
        fc.nat(9999),
        source,
        (low, span, next) => {
          const n = randomInt(low, low + span, next);
          expect(n).to.be.within(low, low + span);
          expect(Number.isInteger(n)).to.equal(true);
        },
      ),
      RUNS,
    );
    const n = cryptoUint32();
    expect(Number.isInteger(n)).to.equal(true);
    expect(n).to.be.within(0, 4294967295);
    expect(randomInt(5, 5)).to.equal(5);
  });

  it("does not ask the same problem twice in a row when it can avoid it", () => {
    const problems = makeProblems({
      operations: "add",
      min: 0,
      max: 50,
      count: 100,
    });
    const repeats = problems.filter(
      (p, i) => i > 0 && p.a === problems[i - 1].a && p.b === problems[i - 1].b,
    );
    expect(repeats.length).to.be.at.most(1);
  });

  it("reads the operations list and falls back to the default set", () => {
    expect(parseOperations("multiply, add")).to.deep.equal(["add", "multiply"]);
    expect(parseOperations("DIVIDE divide")).to.deep.equal(["divide"]);
    expect(parseOperations("")).to.deep.equal(DEFAULT_OPERATIONS);
    expect(parseOperations("modulo <script>")).to.deep.equal(
      DEFAULT_OPERATIONS,
    );
    expect(parseOperations(null)).to.deep.equal(DEFAULT_OPERATIONS);
    expect(parseOperations(["subtract"])).to.deep.equal(["subtract"]);
  });

  it("makes settings safe", () => {
    expect(normalizeSettings({ min: 12, max: 2 })).to.include({
      min: 2,
      max: 12,
    });
    expect(normalizeSettings({ min: -4, max: 99999, count: 0 })).to.include({
      min: 0,
      max: MAX_OPERAND,
      count: 1,
    });
    expect(normalizeSettings({ timeLimit: -3 }).timeLimit).to.equal(0);
    expect(normalizeSettings({ timeLimit: 999999 }).timeLimit).to.equal(3600);
    expect(normalizeSettings()).to.include({ min: 2, max: 12, count: 10 });
  });

  it("only accepts whole numbers as answers", () => {
    fc.assert(
      fc.property(fc.string(), (text) => {
        const n = parseAnswer(text);
        if (n !== null) {
          expect(Number.isInteger(n)).to.equal(true);
          expect(n).to.be.at.least(0);
        }
      }),
      RUNS,
    );
    expect(parseAnswer(" 56 ")).to.equal(56);
    expect(parseAnswer("0")).to.equal(0);
    ["", " ", "-3", "5.5", "1e3", "five", "5 6", "0x10", null].forEach((v) =>
      expect(parseAnswer(v)).to.equal(null),
    );
  });
});
