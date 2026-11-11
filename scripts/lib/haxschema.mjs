/**
 * Node side of the HAXSchema gate (scripts/haxschema-check.mjs): the checks
 * that do not need the custom elements manifest analyzer, so they can be
 * unit tested.
 *
 * checkTag(tag, facts, validate) returns { <check>: { <key>: count } } for
 * one authorable tag, where facts come from api-snapshot's extractTag (the
 * raw HAXSchema plus the attributes, Lit properties and slots the element
 * declares) and validate is the compiled JSON Schema.
 *
 * Checks:
 *   schema            the HAXSchema is valid against the HAX properties JSON
 *                     Schema (scripts/lib/haxProperties.schema.json, from
 *                     https://github.com/haxtheweb/hax-schema) plus the rules
 *                     its validator adds: select/radio fields need options,
 *                     an array of options is only for iconpicker, and an
 *                     element with a gizmo needs a demoSchema entry
 *   setting-property  a settings field's "property" is a property the element
 *                     declares (Lit properties, inherited ones included)
 *   setting-attribute a settings field's "attribute" is an attribute the
 *                     element observes (or a global HTML attribute)
 *   setting-slot      a settings field's "slot" is a slot the element renders
 *                     ("" is the default slot)
 *   demo-tag          every demoSchema entry inserts this element's own tag
 *   unreadable        the HAXSchema could not be read statically
 *
 * Settings sub-fields (array items, "prop[].child") describe the shape of a
 * value, not the element, and are not matched against it. Values computed at
 * runtime (this.t strings, new URL(...)) cannot be read statically and are
 * never reported.
 */
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DOM_PROPERTY, GLOBAL_ATTRIBUTE } from "../api-snapshot.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
export const SCHEMA_PATH = path.join(here, "haxProperties.schema.json");

export const CHECKS = {
  schema: "HAXSchema is not valid against the HAX properties JSON Schema",
  "setting-property":
    "a HAX setting edits a property the element does not declare",
  "setting-attribute":
    "a HAX setting edits an attribute the element does not observe",
  "setting-slot": "a HAX setting targets a slot the element does not render",
  "demo-tag": "a demoSchema entry inserts a different tag than the element",
  unreadable: "the HAXSchema could not be read statically",
};

/** compiled HAX properties JSON Schema (ajv 8, draft 2020-12) */
export function loadValidator(schemaPath = SCHEMA_PATH) {
  let Ajv2020;
  try {
    const mod = createRequire(import.meta.url)("ajv/dist/2020");
    Ajv2020 = mod.default || mod;
  } catch {
    throw new Error(
      "ajv 8 (ajv/dist/2020) is not installed in this monorepo: run yarn install",
    );
  }
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  return ajv.compile(JSON.parse(fs.readFileSync(schemaPath, "utf8")));
}

/**
 * The statically read schema with values computed at runtime (symbols from
 * the evaluator) dropped. unresolved lists the JSON pointers dropped, so
 * errors about them are not reported.
 */
export function plainSchema(value) {
  const unresolved = new Set();
  const walk = (v, ptr) => {
    if (typeof v === "symbol") {
      unresolved.add(ptr);
      return undefined;
    }
    if (Array.isArray(v)) {
      return v.map((x, i) => {
        const r = walk(x, `${ptr}/${i}`);
        return r === undefined ? null : r;
      });
    }
    if (v && typeof v === "object") {
      const out = {};
      for (const k of Object.keys(v)) {
        const r = walk(v[k], `${ptr}/${k}`);
        if (r !== undefined) {
          out[k] = r;
        }
      }
      return out;
    }
    return v;
  };
  return { doc: walk(value, ""), unresolved };
}

const target = (f) =>
  typeof f.property === "string"
    ? `property=${f.property}`
    : typeof f.attribute === "string"
      ? `attribute=${f.attribute}`
      : typeof f.slot === "string"
        ? `slot=${f.slot}`
        : null;

/**
 * A JSON pointer made stable for a baseline: settings fields are named by
 * what they edit instead of their position, other array positions become N.
 */
export function stablePath(doc, pointer) {
  const parts = String(pointer || "")
    .split("/")
    .slice(1);
  const out = [];
  let node = doc;
  for (const raw of parts) {
    const seg = raw.replace(/~1/g, "/").replace(/~0/g, "~");
    if (Array.isArray(node) && /^\d+$/.test(seg)) {
      const item = node[Number(seg)];
      const name = item && typeof item === "object" ? target(item) : null;
      out.push(name ? `[${name}]` : "N");
      node = item;
    } else {
      out.push(seg);
      node = node && typeof node === "object" ? node[seg] : undefined;
    }
  }
  return `/${out.join("/")}`;
}

// keywords whose verdict on an object can hinge on a child that was dropped
const COMPOSITE = new Set([
  "required",
  "oneOf",
  "anyOf",
  "allOf",
  "const",
  "if",
  "then",
  "else",
  "not",
]);

/** whether an error is about, or may be caused by, a value read at runtime */
const covered = (unresolved, pointer, keyword) => {
  for (const u of unresolved) {
    if (pointer === u || pointer.startsWith(`${u}/`)) {
      return true;
    }
    if (keyword && COMPOSITE.has(keyword) && u.startsWith(`${pointer}/`)) {
      return true;
    }
  }
  return false;
};

function walkFields(list, ptr, cb, depth = 0) {
  if (!Array.isArray(list)) {
    return;
  }
  list.forEach((f, i) => {
    if (!f || typeof f !== "object") {
      return;
    }
    cb(f, `${ptr}/${i}`, depth);
    if (Array.isArray(f.properties)) {
      walkFields(f.properties, `${ptr}/${i}/properties`, cb, depth + 1);
    }
  });
}

/** JSON Schema errors plus the checks the hax-schema validator adds */
export function schemaFindings(doc, unresolved, validate) {
  const found = [];
  validate(doc);
  const errors = validate.errors || [];
  // a field with none of property/attribute/slot gives one anyOf error and
  // one required error per branch; report the anyOf one
  const anyOf = new Set(
    errors.filter((e) => e.keyword === "anyOf").map((e) => e.instancePath),
  );
  for (const e of errors) {
    if (e.keyword === "required" && anyOf.has(e.instancePath)) {
      continue;
    }
    if (covered(unresolved, e.instancePath, e.keyword)) {
      continue;
    }
    let msg = e.message;
    if (e.keyword === "anyOf" && /\/settings\//.test(e.instancePath)) {
      msg = 'must target "property", "attribute" or "slot"';
    }
    const extra =
      e.params && (e.params.additionalProperty || e.params.unevaluatedProperty);
    if (extra) {
      msg += ` "${extra}"`;
    }
    if (e.params && Array.isArray(e.params.allowedValues)) {
      msg += `: ${e.params.allowedValues.join(", ")}`;
    }
    found.push(`${stablePath(doc, e.instancePath)}: ${msg}`);
  }
  const settings = (doc && doc.settings) || {};
  for (const group of Object.keys(settings)) {
    walkFields(settings[group], `/settings/${group}`, (f, ptr) => {
      const where = stablePath(doc, ptr);
      if (
        (f.inputMethod === "select" || f.inputMethod === "radio") &&
        !f.options &&
        !f.itemsList &&
        !covered(unresolved, `${ptr}/options`, "required") &&
        !covered(unresolved, `${ptr}/itemsList`, "required")
      ) {
        found.push(`${where}: ${f.inputMethod} needs options or itemsList`);
      }
      if (Array.isArray(f.options) && f.inputMethod !== "iconpicker") {
        found.push(
          `${where}: an array of options is only for iconpicker; ${f.inputMethod} needs a value -> label map`,
        );
      }
    });
  }
  if (
    doc &&
    doc.gizmo &&
    !covered(unresolved, "/demoSchema", "required") &&
    (!Array.isArray(doc.demoSchema) || doc.demoSchema.length === 0)
  ) {
    found.push(
      "/demoSchema: an element with a gizmo needs a demoSchema entry (the first is what HAX inserts)",
    );
  }
  return found;
}

/** findings for one tag: { check: { key: count } } */
export function checkTag(tag, facts, validate) {
  const out = {};
  const add = (check, key) => {
    out[check] = out[check] || {};
    out[check][key] = (out[check][key] || 0) + 1;
  };
  if (!facts) {
    return out;
  }
  if (facts.error) {
    add("unreadable", facts.error);
    return out;
  }
  const { doc, unresolved } = plainSchema(facts.schema);
  if (!doc || typeof doc !== "object") {
    add("unreadable", "HAXSchema is not an object");
    return out;
  }
  if (validate) {
    for (const f of schemaFindings(doc, unresolved, validate)) {
      add("schema", f);
    }
  }
  const attributes = facts.attributes || {};
  const fields = new Set(facts.fields || []);
  const slots = new Set(facts.slots || []);
  const settings = doc.settings || {};
  for (const group of Object.keys(settings)) {
    walkFields(settings[group], `/settings/${group}`, (f, ptr, depth) => {
      if (depth > 0) {
        return;
      }
      if (typeof f.property === "string" && f.property) {
        const p = f.property;
        if (
          !fields.has(p) &&
          !(p.toLowerCase() in attributes) &&
          !DOM_PROPERTY.test(p)
        ) {
          add("setting-property", p);
        }
      }
      if (typeof f.attribute === "string" && f.attribute) {
        const a = f.attribute;
        if (!(a.toLowerCase() in attributes) && !GLOBAL_ATTRIBUTE.test(a)) {
          add("setting-attribute", a);
        }
      }
      // slots are only known when the render template was read
      if (typeof f.slot === "string" && facts.templateRead) {
        const s = f.slot === "" ? "(default)" : f.slot;
        if (!slots.has(s)) {
          add("setting-slot", f.slot === "" ? '"" (default slot)' : f.slot);
        }
      }
    });
  }
  (Array.isArray(doc.demoSchema) ? doc.demoSchema : []).forEach((d) => {
    if (d && typeof d.tag === "string" && d.tag !== tag) {
      add("demo-tag", d.tag);
    }
  });
  return out;
}
