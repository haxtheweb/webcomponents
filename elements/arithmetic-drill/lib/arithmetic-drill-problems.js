/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */

/**
 * Problem generator for `arithmetic-drill`. Plain functions with no DOM so
 * the rules can be tested on their own:
 *
 * - operands are whole numbers from `min` to `max`
 * - subtraction never goes below zero
 * - division is built from a product, so the answer is always a whole
 *   number and the divisor is never zero
 */

// the order operations are listed in everywhere
export const OPERATIONS = ["add", "subtract", "multiply", "divide"];

export const DEFAULT_OPERATIONS = ["add", "subtract", "multiply"];

// the sign shown for each operation
export const OPERATION_SIGNS = {
  add: "+",
  subtract: "−",
  multiply: "×",
  divide: "÷",
};

// limits that keep a drill a drill
export const MAX_OPERAND = 9999;
export const MAX_COUNT = 100;
export const MAX_TIME_LIMIT = 3600;

const UINT32_RANGE = 4294967296;

/**
 * A whole number from 0 to 4294967295 from the platform's cryptographic
 * random source.
 * @returns {Number}
 */
export function cryptoUint32() {
  const buffer = new Uint32Array(1);
  globalThis.crypto.getRandomValues(buffer);
  return buffer[0];
}

/**
 * A whole number from low to high, both included, with every value equally
 * likely (values that would favour the low end are drawn again).
 * @param {Number} low
 * @param {Number} high
 * @param {Function} [next] source of whole numbers from 0 to 4294967295;
 *   the cryptographic source unless a test passes its own
 * @returns {Number}
 */
export function randomInt(low, high, next) {
  const source = typeof next === "function" ? next : cryptoUint32;
  const span = high - low + 1;
  if (!(span > 1)) {
    return low;
  }
  const limit = UINT32_RANGE - (UINT32_RANGE % span);
  let value = source();
  // a source that keeps returning out of range values stops after a few
  // draws instead of looping for ever
  for (let tries = 0; value >= limit && tries < 32; tries++) {
    value = source();
  }
  return low + (value % span);
}

function wholeNumber(value, fallback) {
  const n = Math.floor(Number(value));
  return Number.isFinite(n) ? n : fallback;
}

/**
 * The operations named in a space or comma separated list, in the standard
 * order and without repeats. Unknown words are ignored; a list with nothing
 * usable gives the default set.
 * @param {String|Array} value
 * @returns {String[]}
 */
export function parseOperations(value) {
  const words = Array.isArray(value)
    ? value.map((w) => String(w).trim().toLowerCase())
    : String(value == null ? "" : value)
        .toLowerCase()
        .split(/[\s,]+/);
  const found = OPERATIONS.filter((op) => words.includes(op));
  return found.length ? found : DEFAULT_OPERATIONS.slice();
}

/**
 * Settings with every number made safe: whole, non-negative, in order and
 * inside the limits.
 * @param {Object} settings { operations, min, max, count, timeLimit }
 * @returns {Object} { operations, min, max, count, timeLimit }
 */
export function normalizeSettings(settings) {
  const s = settings || {};
  let min = Math.min(MAX_OPERAND, Math.max(0, wholeNumber(s.min, 2)));
  let max = Math.min(MAX_OPERAND, Math.max(0, wholeNumber(s.max, 12)));
  if (max < min) {
    const swap = min;
    min = max;
    max = swap;
  }
  return {
    operations: parseOperations(s.operations),
    min,
    max,
    count: Math.min(MAX_COUNT, Math.max(1, wholeNumber(s.count, 10))),
    timeLimit: Math.min(
      MAX_TIME_LIMIT,
      Math.max(0, wholeNumber(s.timeLimit, 0)),
    ),
  };
}

/**
 * One problem: { operation, a, b, answer } where "a operation b = answer".
 * @param {String} operation add, subtract, multiply or divide
 * @param {Number} min smallest operand
 * @param {Number} max largest operand
 * @param {Function} [next] see randomInt
 * @returns {Object}
 */
export function makeProblem(operation, min, max, next) {
  const first = randomInt(min, max, next);
  const second = randomInt(min, max, next);
  if (operation === "subtract") {
    const a = Math.max(first, second);
    const b = Math.min(first, second);
    return { operation, a, b, answer: a - b };
  }
  if (operation === "multiply") {
    return { operation, a: first, b: second, answer: first * second };
  }
  if (operation === "divide") {
    // from a product: the divisor is at least 1, the answer a whole number
    const low = Math.max(1, min);
    const divisor = randomInt(low, Math.max(low, max), next);
    return {
      operation,
      a: divisor * first,
      b: divisor,
      answer: first,
    };
  }
  return { operation: "add", a: first, b: second, answer: first + second };
}

/**
 * The problems for one run. The same problem is not asked twice in a row
 * when the range allows another one.
 * @param {Object} settings { operations, min, max, count }
 * @param {Function} [next] see randomInt
 * @returns {Object[]}
 */
export function makeProblems(settings, next) {
  const s = normalizeSettings(settings);
  const problems = [];
  for (let i = 0; i < s.count; i++) {
    let problem = null;
    for (let tries = 0; tries < 4; tries++) {
      const operation =
        s.operations[randomInt(0, s.operations.length - 1, next)];
      problem = makeProblem(operation, s.min, s.max, next);
      const last = problems[problems.length - 1];
      if (
        !last ||
        last.operation !== problem.operation ||
        last.a !== problem.a ||
        last.b !== problem.b
      ) {
        break;
      }
    }
    problems.push(problem);
  }
  return problems;
}

/**
 * The whole number a learner typed, or null when what they typed is not
 * one. Only digits count (answers are never negative or fractional).
 * @param {String} text
 * @returns {Number|null}
 */
export function parseAnswer(text) {
  const s = String(text == null ? "" : text).trim();
  if (s === "" || s.length > 12) {
    return null;
  }
  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i);
    if (code < 48 || code > 57) {
      return null;
    }
  }
  return Number(s);
}
