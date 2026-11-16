/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
// Arithmetic for numeric-question: a small formula evaluator, the parser for
// what a learner types, and the helpers that pick variable values. Nothing
// here runs author text as code; a formula is tokenized and walked by hand.

// longest formula and deepest nesting that will be worked out
const MAX_LENGTH = 500;
const MAX_DEPTH = 40;
const FUNCTIONS = {
  sqrt: Math.sqrt,
  abs: Math.abs,
};
// characters authors paste from word processors, mapped to their operator
const OPERATOR_ALIASES = {
  "×": "*",
  "÷": "/",
  "−": "-",
};
const isDigit = (c) => c >= "0" && c <= "9";
const isNameStart = (c) =>
  (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === "_";
const isSpace = (c) => c === " " || c === "\t" || c === "\n" || c === "\r";
const own = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

/**
 * Whether a string can be used as a variable name: a letter or underscore,
 * then letters, digits or underscores, and not a function name
 * @param {string} name
 * @returns {boolean}
 */
export function isVariableName(name) {
  if (typeof name !== "string" || !name || name.length > 40) {
    return false;
  }
  if (!isNameStart(name[0]) || own(FUNCTIONS, name)) {
    return false;
  }
  for (let i = 1; i < name.length; i++) {
    if (!isNameStart(name[i]) && !isDigit(name[i])) {
      return false;
    }
  }
  return true;
}

// one pass over the text; null when a character does not belong
function tokenize(src) {
  const tokens = [];
  let i = 0;
  while (i < src.length) {
    const c = own(OPERATOR_ALIASES, src[i]) ? OPERATOR_ALIASES[src[i]] : src[i];
    if (isSpace(c)) {
      i++;
    } else if (isDigit(c) || c === ".") {
      let j = i;
      let dots = 0;
      let digits = 0;
      while (j < src.length && (isDigit(src[j]) || src[j] === ".")) {
        if (src[j] === ".") {
          dots++;
        } else {
          digits++;
        }
        j++;
      }
      if (dots > 1 || digits === 0) {
        return null;
      }
      tokens.push({ type: "number", value: Number(src.slice(i, j)) });
      i = j;
    } else if (isNameStart(c)) {
      let j = i + 1;
      while (j < src.length && (isNameStart(src[j]) || isDigit(src[j]))) {
        j++;
      }
      tokens.push({ type: "name", value: src.slice(i, j) });
      i = j;
    } else if ("+-*/^()".includes(c)) {
      tokens.push({ type: c });
      i++;
    } else {
      return null;
    }
  }
  return tokens;
}

/**
 * Work out an arithmetic formula. Supports numbers, variable names,
 * + - * / ^, parentheses, unary minus, sqrt() and abs(). Anything else, an
 * unknown name, or a result that is not a finite number gives NaN.
 * @param {string} formula for example "d / (t / 60)"
 * @param {Object} [variables] values by name, for example { d: 18, t: 45 }
 * @returns {number}
 */
export function evaluateFormula(formula, variables = {}) {
  if (
    typeof formula !== "string" ||
    !formula.trim() ||
    formula.length > MAX_LENGTH
  ) {
    return NaN;
  }
  const tokens = tokenize(formula);
  if (!tokens || !tokens.length) {
    return NaN;
  }
  const vars = variables && typeof variables === "object" ? variables : {};
  let pos = 0;
  let depth = 0;
  let failed = false;
  const peek = () => (pos < tokens.length ? tokens[pos].type : "");
  const fail = () => {
    failed = true;
    return NaN;
  };
  // every nested call goes through here so a long run of "(" or "-" can
  // not exhaust the stack
  const nested = (fn) => {
    if (failed || depth >= MAX_DEPTH) {
      return fail();
    }
    depth++;
    const value = fn();
    depth--;
    return value;
  };
  const expression = () => {
    let value = term();
    while (!failed && (peek() === "+" || peek() === "-")) {
      const op = tokens[pos++].type;
      const right = term();
      value = op === "+" ? value + right : value - right;
    }
    return value;
  };
  const term = () => {
    let value = unary();
    while (!failed && (peek() === "*" || peek() === "/")) {
      const op = tokens[pos++].type;
      const right = unary();
      value = op === "*" ? value * right : value / right;
    }
    return value;
  };
  // unary minus binds looser than ^, so -2^2 is -4
  const unary = () => {
    if (peek() === "-") {
      pos++;
      return -nested(unary);
    }
    if (peek() === "+") {
      pos++;
      return nested(unary);
    }
    return power();
  };
  // right to left: 2^3^2 is 2^9
  const power = () => {
    const base = primary();
    if (!failed && peek() === "^") {
      pos++;
      return Math.pow(base, nested(unary));
    }
    return base;
  };
  const group = () => {
    pos++;
    const value = nested(expression);
    if (peek() !== ")") {
      return fail();
    }
    pos++;
    return value;
  };
  const primary = () => {
    if (failed || pos >= tokens.length) {
      return fail();
    }
    const token = tokens[pos];
    if (token.type === "number") {
      pos++;
      return token.value;
    }
    if (token.type === "name") {
      pos++;
      if (own(FUNCTIONS, token.value)) {
        return peek() === "(" ? FUNCTIONS[token.value](group()) : fail();
      }
      if (own(vars, token.value)) {
        const value = Number(vars[token.value]);
        return Number.isFinite(value) ? value : fail();
      }
      return fail();
    }
    if (token.type === "(") {
      return group();
    }
    return fail();
  };
  const result = expression();
  if (failed || pos !== tokens.length || !Number.isFinite(result)) {
    return NaN;
  }
  return result;
}

/**
 * The number a learner typed, or NaN. A comma or a point is the decimal
 * separator; signs and spaces around the number are fine. Thousands
 * separators, units and words are not numbers.
 * @param {*} text
 * @returns {number}
 */
export function parseNumber(text) {
  if (typeof text === "number") {
    return Number.isFinite(text) ? text : NaN;
  }
  if (typeof text !== "string" || text.length > 40) {
    return NaN;
  }
  const s = text.trim();
  let i = 0;
  let out = "";
  if (s[i] === "+" || s[i] === "-" || s[i] === "−") {
    out = s[i] === "+" ? "" : "-";
    i++;
  }
  let digits = 0;
  let separators = 0;
  for (; i < s.length; i++) {
    if (isDigit(s[i])) {
      digits++;
      out += s[i];
    } else if (s[i] === "." || s[i] === ",") {
      separators++;
      out += ".";
    } else {
      return NaN;
    }
  }
  if (digits === 0 || separators > 1) {
    return NaN;
  }
  return Number(out);
}

// decimal places written in a number, so 0.1 steps stay 0.1 steps
function decimalPlaces(n) {
  const s = String(n);
  if (s.includes("e")) {
    return 10;
  }
  const dot = s.indexOf(".");
  return dot === -1 ? 0 : Math.min(10, s.length - dot - 1);
}

/**
 * Round to a number of decimal places (0 to 10)
 * @param {number} value
 * @param {number} places
 * @returns {number}
 */
export function roundTo(value, places) {
  const p = Math.min(10, Math.max(0, Math.floor(Number(places) || 0)));
  // shifting the decimal point as text avoids 1.005 * 100 = 100.49999
  if (String(value).includes("e")) {
    const f = Math.pow(10, p);
    return Math.round(value * f) / f;
  }
  return Number(`${Math.round(Number(`${value}e${p}`))}e-${p}`);
}

/**
 * Clean authored variables: [{ name, min, max, step }] with a usable name,
 * min not above max and a positive step. Entries without a usable name and
 * repeated names are dropped.
 * @param {Array} list
 * @returns {Array<{name: string, min: number, max: number, step: number}>}
 */
export function cleanVariables(list) {
  const seen = {};
  const out = [];
  (Array.isArray(list) ? list : []).forEach((v) => {
    const name = v && typeof v.name === "string" ? v.name.trim() : "";
    if (!isVariableName(name) || own(seen, name)) {
      return;
    }
    seen[name] = true;
    const a = parseNumber(typeof v.min === "number" ? v.min : String(v.min));
    const b = parseNumber(typeof v.max === "number" ? v.max : String(v.max));
    const s = parseNumber(typeof v.step === "number" ? v.step : String(v.step));
    const min = Number.isFinite(a) ? a : 0;
    const max = Number.isFinite(b) ? b : min;
    out.push({
      name,
      min: Math.min(min, max),
      max: Math.max(min, max),
      step: Number.isFinite(s) && s > 0 ? s : 1,
    });
  });
  return out;
}

/**
 * How many values a variable can take
 * @param {{min: number, max: number, step: number}} variable (cleaned)
 * @returns {number}
 */
export function variableSteps(variable) {
  const n = Math.floor((variable.max - variable.min) / variable.step + 1e-9);
  return Math.min(1000000, Math.max(0, n)) + 1;
}

/**
 * The value of a variable at one of its steps
 * @param {{min: number, max: number, step: number}} variable (cleaned)
 * @param {number} index 0 based; wraps around the number of steps
 * @returns {number}
 */
export function variableValue(variable, index) {
  const i = Math.abs(Math.floor(Number(index) || 0)) % variableSteps(variable);
  return roundTo(
    variable.min + i * variable.step,
    Math.max(decimalPlaces(variable.min), decimalPlaces(variable.step)),
  );
}

/**
 * Swap {name} tokens in text for values; tokens with no value stay as typed
 * @param {string} text
 * @param {Object} values by name
 * @returns {string}
 */
export function fillTokens(text, values) {
  const vals = values && typeof values === "object" ? values : {};
  return String(text == null ? "" : text)
    .split(/(\{\w+\})/g)
    .map((piece) => {
      const name =
        piece.length > 2 && piece[0] === "{" && piece[piece.length - 1] === "}"
          ? piece.slice(1, -1)
          : "";
      return name && own(vals, name) ? String(vals[name]) : piece;
    })
    .join("");
}
