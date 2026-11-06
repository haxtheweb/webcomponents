/**
 * xAPI 1.0.3 statement conformance, for tests.
 *
 * validateStatement(statement) checks a statement against
 * ./xapi-statement-1.0.3.schema.json with ajv (JSON Schema draft-07), then
 * the rules JSON Schema can not express:
 * - result.score: raw within min and max, min below max
 * - interaction components: ids unique in each list
 * - result.response and every correctResponsesPattern entry follow the
 *   grammar of the interactionType ("Interaction Activities" and
 *   "Response Patterns" in xAPI-Data.md): true-false literals; choice /
 *   sequencing / likert ids from the definition joined by "[,]"; matching
 *   "source[.]target" pairs; fill-in / long-fill-in items with only the
 *   characterstring parameters the spec allows ({case_matters=},
 *   {order_matters=} at the start of a pattern, {lang=} at the start of an
 *   item)
 * - with { haxExtensions: true }: every extension IRI HAX writes is under
 *   https://haxtheweb.org/xapi/extensions/ (statement-wide)
 *
 * xapiConformancePlugin() is a @web/test-runner plugin: browser tests call
 *   executeServerCommand("xapi-validate", statement)
 * (from @web/test-runner-commands) and get { valid, errors }.
 *
 * ajv comes from the monorepo's node_modules (a dependency of workbox-build
 * and table); when it can not be loaded, validation throws instead of
 * passing.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
export const SCHEMA_PATH = path.join(here, "xapi-statement-1.0.3.schema.json");
export const HAX_EXTENSION_PREFIX = "https://haxtheweb.org/xapi/extensions/";
const HAX_PREFIX = "https://haxtheweb.org/";

let validator = null;
function schemaValidator() {
  if (!validator) {
    const require = createRequire(import.meta.url);
    const AjvModule = require("ajv");
    const Ajv = AjvModule.default || AjvModule;
    // ajv is not a declared dependency of this repo; whichever major is
    // hoisted is used (6 today, 8 elsewhere in the tree), and errors are
    // reported the same way for both (see schemaErrors)
    const major = parseInt(require("ajv/package.json").version, 10);
    const ajv = new Ajv(
      major >= 8
        ? { allErrors: true, strict: false }
        : { allErrors: true, jsonPointers: true },
    );
    validator = ajv.compile(JSON.parse(fs.readFileSync(SCHEMA_PATH, "utf8")));
  }
  return validator;
}

const ITEM = "[,]";
const PAIR = "[.]";
const LANG_TAG = /^[a-zA-Z]{2,8}(-[a-zA-Z0-9]{1,8})*$/;

// leading characterstring parameters of a fill-in pattern / item
function stripListParams(text, errors, where) {
  let s = text;
  const seen = new Set();
  let m;
  while ((m = /^\{(case_matters|order_matters)=([^}]*)\}/.exec(s))) {
    if (m[2] !== "true" && m[2] !== "false") {
      errors.push(`${where}: {${m[1]}=} must be true or false`);
    }
    if (seen.has(m[1])) {
      errors.push(`${where}: {${m[1]}=} given twice`);
    }
    seen.add(m[1]);
    s = s.slice(m[0].length);
  }
  return s;
}
function checkFillInItem(item, errors, where) {
  let s = item;
  const m = /^\{lang=([^}]*)\}/.exec(s);
  if (m) {
    if (!LANG_TAG.test(m[1])) {
      errors.push(`${where}: {lang=${m[1]}} is not a language tag`);
    }
    s = s.slice(m[0].length);
  } else if (/^\{(case_matters|order_matters)=/.test(s)) {
    errors.push(`${where}: list parameter in the middle of the list`);
  } else if (/^\{[a-z_]+=/.test(s)) {
    errors.push(`${where}: unknown characterstring parameter`);
  }
  return s;
}

function checkResponse(text, def, errors, where, isPattern) {
  const type = def.interactionType;
  const ids = (list) =>
    new Set((Array.isArray(def[list]) ? def[list] : []).map((c) => c.id));
  const items = (s) => (s === "" ? [] : s.split(ITEM));
  const idList = (s, list) => {
    const known = ids(list);
    const got = items(s);
    got.forEach((id) => {
      if (!known.has(id)) {
        errors.push(`${where}: "${id}" is not an id in ${list}`);
      }
    });
    if (new Set(got).size !== got.length) {
      errors.push(`${where}: an id is repeated`);
    }
    return got;
  };
  switch (type) {
    case "true-false":
      if (text !== "true" && text !== "false") {
        errors.push(`${where}: must be "true" or "false"`);
      }
      break;
    case "choice":
      idList(text, "choices");
      break;
    case "sequencing": {
      const got = idList(text, "choices");
      if (isPattern && got.length !== ids("choices").size) {
        errors.push(`${where}: a sequence pattern orders every choice`);
      }
      break;
    }
    case "likert":
      if (items(text).length > 1) {
        errors.push(`${where}: likert takes one scale id`);
      }
      idList(text, "scale");
      break;
    case "matching": {
      const source = ids("source");
      const target = ids("target");
      const used = new Set();
      items(text).forEach((pair) => {
        const parts = pair.split(PAIR);
        if (parts.length !== 2) {
          errors.push(`${where}: "${pair}" is not source[.]target`);
          return;
        }
        if (!source.has(parts[0])) {
          errors.push(`${where}: "${parts[0]}" is not an id in source`);
        }
        if (!target.has(parts[1])) {
          errors.push(`${where}: "${parts[1]}" is not an id in target`);
        }
        if (used.has(parts[0])) {
          errors.push(`${where}: source "${parts[0]}" matched twice`);
        }
        used.add(parts[0]);
      });
      break;
    }
    case "fill-in":
    case "long-fill-in": {
      let s = text;
      if (isPattern) {
        s = stripListParams(s, errors, where);
      } else if (/^\{(case_matters|order_matters)=/.test(s)) {
        errors.push(`${where}: a response can not carry pattern parameters`);
      }
      items(s).forEach((item, i) =>
        checkFillInItem(item, errors, `${where} item ${i + 1}`),
      );
      break;
    }
    default:
      break;
  }
}

function extensionKeys(statement) {
  const out = [];
  const visit = (obj, at) => {
    if (!obj || typeof obj !== "object") {
      return;
    }
    if (obj.extensions && typeof obj.extensions === "object") {
      Object.keys(obj.extensions).forEach((k) => out.push([`${at}`, k]));
    }
  };
  const obj = statement.object || {};
  visit(obj.definition, "object.definition");
  visit(statement.result, "result");
  visit(statement.context, "context");
  return out;
}

/**
 * @param {Object} statement
 * @param {{ haxExtensions?: boolean }} [options]
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateStatement(statement, options = {}) {
  const errors = [];
  const validate = schemaValidator();
  if (!validate(statement)) {
    (validate.errors || []).forEach((e) => {
      // ajv 8 reports instancePath and "must ..."; ajv 6 reports dataPath
      // and "should ..."
      const at = e.instancePath !== undefined ? e.instancePath : e.dataPath;
      const message = String(e.message || "").replace(/^should\b/, "must");
      errors.push(
        `schema ${at || "/"} ${message}${
          e.params && e.params.additionalProperty
            ? ` (${e.params.additionalProperty})`
            : ""
        }`,
      );
    });
  }
  const s = statement && typeof statement === "object" ? statement : {};
  const result = s.result || {};
  const score = result.score;
  if (score) {
    if (score.min != null && score.max != null && !(score.min < score.max)) {
      errors.push("result.score: min must be below max");
    }
    if (score.raw != null && score.min != null && score.raw < score.min) {
      errors.push("result.score: raw below min");
    }
    if (score.raw != null && score.max != null && score.raw > score.max) {
      errors.push("result.score: raw above max");
    }
  }
  const def = s.object && s.object.definition ? s.object.definition : {};
  ["choices", "scale", "source", "target", "steps"].forEach((list) => {
    if (Array.isArray(def[list])) {
      const seen = new Set();
      def[list].forEach((c) => {
        if (seen.has(c.id)) {
          errors.push(`object.definition.${list}: id "${c.id}" repeated`);
        }
        seen.add(c.id);
      });
    }
  });
  if (def.interactionType) {
    if (typeof result.response === "string") {
      checkResponse(result.response, def, errors, "result.response", false);
    }
    (def.correctResponsesPattern || []).forEach((p, i) =>
      checkResponse(
        String(p),
        def,
        errors,
        `correctResponsesPattern[${i}]`,
        true,
      ),
    );
  }
  if (options.haxExtensions) {
    extensionKeys(s).forEach(([at, key]) => {
      if (key.indexOf(HAX_PREFIX) === 0 && key.indexOf(HAX_EXTENSION_PREFIX)) {
        errors.push(
          `${at}.extensions: ${key} is outside ${HAX_EXTENSION_PREFIX}`,
        );
      }
    });
  }
  return { valid: errors.length === 0, errors };
}

/**
 * @web/test-runner plugin: the "xapi-validate" server command
 */
export function xapiConformancePlugin() {
  return {
    name: "xapi-conformance",
    executeCommand({ command, payload }) {
      if (command !== "xapi-validate") {
        return undefined;
      }
      const statement =
        payload && payload.statement ? payload.statement : payload;
      return validateStatement(statement, {
        haxExtensions: !(payload && payload.haxExtensions === false),
      });
    },
  };
}
