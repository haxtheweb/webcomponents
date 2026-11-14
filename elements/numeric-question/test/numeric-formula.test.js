import { expect } from "@open-wc/testing";
import {
  cleanVariables,
  evaluateFormula,
  fillTokens,
  isVariableName,
  parseNumber,
  roundTo,
  variableSteps,
  variableValue,
} from "../lib/numeric-formula.js";

describe("numeric-formula", () => {
  describe("evaluateFormula", () => {
    it("does arithmetic with the usual precedence", () => {
      expect(evaluateFormula("1 + 2 * 3")).to.equal(7);
      expect(evaluateFormula("(1 + 2) * 3")).to.equal(9);
      expect(evaluateFormula("10 / 4")).to.equal(2.5);
      expect(evaluateFormula("10 - 4 - 3")).to.equal(3);
      expect(evaluateFormula("2 * 3 / 4")).to.equal(1.5);
      expect(evaluateFormula(".5 + 1.")).to.equal(1.5);
    });
    it("handles powers, right to left, and unary minus", () => {
      expect(evaluateFormula("2 ^ 3")).to.equal(8);
      expect(evaluateFormula("2 ^ 3 ^ 2")).to.equal(512);
      expect(evaluateFormula("-2 ^ 2")).to.equal(-4);
      expect(evaluateFormula("(-2) ^ 2")).to.equal(4);
      expect(evaluateFormula("2 ^ -1")).to.equal(0.5);
      expect(evaluateFormula("--3")).to.equal(3);
      expect(evaluateFormula("+3 - -2")).to.equal(5);
      expect(evaluateFormula("2 * -3")).to.equal(-6);
    });
    it("uses variables and the two functions", () => {
      expect(evaluateFormula("d / (t / 60)", { d: 18, t: 45 })).to.equal(24);
      expect(evaluateFormula("sqrt(a^2 + b^2)", { a: 3, b: 4 })).to.equal(5);
      expect(evaluateFormula("abs(x - 10)", { x: 4 })).to.equal(6);
      expect(evaluateFormula("rate_2 * 2", { rate_2: "1.5" })).to.equal(3);
    });
    it("accepts the operator characters authors paste", () => {
      expect(evaluateFormula("6 × 2 ÷ 4 − 1")).to.equal(2);
    });
    it("gives NaN for malformed input", () => {
      [
        "",
        "   ",
        "1 +",
        "* 2",
        "(1 + 2",
        "1 + 2)",
        "()",
        "1 2",
        "1..2",
        ".",
        "2 ** 3",
        "1,5 + 1",
        "a + 1",
        "sqrt 4",
        "sqrt",
        "abs()",
        "sin(1)",
        "1 / 0",
        "sqrt(-1)",
        "1e3",
        "2x",
        "x = 2",
        "1; 2",
        "alert(1)",
        "constructor",
        "__proto__",
        "toString()",
        "a.b",
        "a[0]",
        "`1`",
        "'1'",
      ].forEach((bad) => {
        expect(Number.isNaN(evaluateFormula(bad)), bad).to.equal(true);
      });
      expect(Number.isNaN(evaluateFormula(null))).to.equal(true);
      expect(Number.isNaN(evaluateFormula(12))).to.equal(true);
      expect(Number.isNaN(evaluateFormula("x", { x: "nope" }))).to.equal(true);
      expect(Number.isNaN(evaluateFormula("x", null))).to.equal(true);
    });
    it("never reaches inherited properties or functions", () => {
      const vars = Object.create({ secret: 5 });
      expect(Number.isNaN(evaluateFormula("secret", vars))).to.equal(true);
      expect(Number.isNaN(evaluateFormula("hasOwnProperty", {}))).to.equal(
        true,
      );
    });
    it("refuses very long and very deep formulas without throwing", () => {
      expect(Number.isNaN(evaluateFormula("1+".repeat(400) + "1"))).to.equal(
        true,
      );
      expect(
        Number.isNaN(evaluateFormula("(".repeat(200) + "1" + ")".repeat(200))),
      ).to.equal(true);
      expect(Number.isNaN(evaluateFormula("-".repeat(300) + "1"))).to.equal(
        true,
      );
      expect(evaluateFormula("((((1))))")).to.equal(1);
    });
    it("stays fast on hostile input", () => {
      const start = performance.now();
      for (let i = 0; i < 200; i++) {
        evaluateFormula("(".repeat(250) + "a".repeat(240));
        evaluateFormula("1" + "^1".repeat(240));
      }
      expect(performance.now() - start).to.be.below(1000);
    });
  });

  describe("parseNumber", () => {
    it("reads points and commas as the decimal separator", () => {
      expect(parseNumber("18.5")).to.equal(18.5);
      expect(parseNumber("18,5")).to.equal(18.5);
      expect(parseNumber(" -3 ")).to.equal(-3);
      expect(parseNumber("−3,25")).to.equal(-3.25);
      expect(parseNumber("+7")).to.equal(7);
      expect(parseNumber(",5")).to.equal(0.5);
      expect(parseNumber(4)).to.equal(4);
    });
    it("rejects everything that is not one number", () => {
      [
        "",
        " ",
        "abc",
        "18.5 km/h",
        "1,234.5",
        "1.2.3",
        "-",
        ".",
        "1e3",
        "0x10",
        "Infinity",
        "NaN",
        "1 000",
        "9".repeat(50),
      ].forEach((bad) => {
        expect(Number.isNaN(parseNumber(bad)), bad).to.equal(true);
      });
      expect(Number.isNaN(parseNumber(null))).to.equal(true);
      expect(Number.isNaN(parseNumber(Infinity))).to.equal(true);
    });
  });

  describe("variables", () => {
    it("names are identifiers and never a function name", () => {
      expect(isVariableName("d")).to.equal(true);
      expect(isVariableName("rate_2")).to.equal(true);
      expect(isVariableName("2x")).to.equal(false);
      expect(isVariableName("a b")).to.equal(false);
      expect(isVariableName("sqrt")).to.equal(false);
      expect(isVariableName("")).to.equal(false);
    });
    it("cleans authored variables", () => {
      expect(
        cleanVariables([
          { name: " d ", min: "30", max: "12", step: "0" },
          { name: "d", min: 1, max: 2, step: 1 },
          { name: "2bad", min: 1, max: 2, step: 1 },
          { name: "t", min: "0,5", max: "2", step: "0.5" },
          null,
        ]),
      ).to.deep.equal([
        { name: "d", min: 12, max: 30, step: 1 },
        { name: "t", min: 0.5, max: 2, step: 0.5 },
      ]);
      expect(cleanVariables("nope")).to.deep.equal([]);
    });
    it("picks values on the steps, inside the range", () => {
      const v = { name: "t", min: 30, max: 90, step: 5 };
      expect(variableSteps(v)).to.equal(13);
      expect(variableValue(v, 0)).to.equal(30);
      expect(variableValue(v, 12)).to.equal(90);
      expect(variableValue(v, 13)).to.equal(30);
      const f = { name: "x", min: 0.1, max: 0.5, step: 0.1 };
      expect(variableSteps(f)).to.equal(5);
      expect(variableValue(f, 2)).to.equal(0.3);
      expect(variableSteps({ min: 3, max: 3, step: 1 })).to.equal(1);
    });
    it("rounds without floating point surprises", () => {
      expect(roundTo(1.005, 2)).to.equal(1.01);
      expect(roundTo(18.4615, 1)).to.equal(18.5);
      expect(roundTo(1e-7, 2)).to.equal(0);
    });
  });

  describe("fillTokens", () => {
    it("swaps known tokens and leaves the rest", () => {
      expect(
        fillTokens("{d} km in {t} min, {x} and {toString}", { d: 18, t: 45 }),
      ).to.equal("18 km in 45 min, {x} and {toString}");
      expect(fillTokens(null, {})).to.equal("");
      expect(fillTokens("{d}", null)).to.equal("{d}");
    });
  });
});
