/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
/**
 * The HAX gizmo (title, icon, description) of an element, for admin views
 * that name elements outside the editor. An element's haxProperties is
 * either the schema object or the URL of its schema JSON file; this reads
 * both, so a view does not have to know which one an element uses.
 */

// tag -> gizmo object, or null when the element has none
const gizmoCache = new Map();
// tag -> promise of the schema file being read
const gizmoPending = new Map();

/**
 * Fired on globalThis when a gizmo read from a schema file is ready, so
 * a view that drew a fallback name can draw again. detail: { tag }
 */
export const ELEMENT_GIZMO_READY = "haxcms-element-gizmo-ready";

function schemaOf(tag) {
  try {
    const ce = globalThis.customElements
      ? globalThis.customElements.get(tag)
      : null;
    return ce ? ce.haxProperties : null;
  } catch {
    return null;
  }
}

function gizmoOf(schema) {
  return schema && typeof schema === "object" && schema.gizmo
    ? schema.gizmo
    : null;
}

/**
 * Read the gizmo of an element, from its schema object or its schema file.
 * @param {string} tag
 * @returns {Promise<Object|null>} the gizmo, or null when there is none
 */
export function loadElementGizmo(tag) {
  const t = String(tag || "");
  if (gizmoCache.has(t)) {
    return Promise.resolve(gizmoCache.get(t));
  }
  if (gizmoPending.has(t)) {
    return gizmoPending.get(t);
  }
  const schema = schemaOf(t);
  if (typeof schema !== "string" || !schema) {
    const gizmo = gizmoOf(schema);
    // an element that is not defined yet may still be; do not remember that
    if (gizmo) {
      gizmoCache.set(t, gizmo);
    }
    return Promise.resolve(gizmo);
  }
  const request = globalThis
    .fetch(schema)
    .then((response) => (response && response.ok ? response.json() : null))
    .catch(() => null)
    .then((data) => {
      const gizmo = gizmoOf(data);
      gizmoCache.set(t, gizmo);
      gizmoPending.delete(t);
      if (gizmo && typeof globalThis.dispatchEvent === "function") {
        globalThis.dispatchEvent(
          new CustomEvent(ELEMENT_GIZMO_READY, { detail: { tag: t } }),
        );
      }
      return gizmo;
    });
  gizmoPending.set(t, request);
  return request;
}

/**
 * The gizmo of an element if it is known right now. When the schema lives in
 * a file this starts reading it and returns undefined; ELEMENT_GIZMO_READY
 * fires once it can be asked for again.
 * @param {string} tag
 * @returns {Object|null|undefined} gizmo, null for none, undefined while
 * the schema file is being read
 */
export function elementGizmo(tag) {
  const t = String(tag || "");
  if (gizmoCache.has(t)) {
    return gizmoCache.get(t);
  }
  const schema = schemaOf(t);
  if (typeof schema === "string" && schema) {
    loadElementGizmo(t);
    return undefined;
  }
  return gizmoOf(schema);
}
