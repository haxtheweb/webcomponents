/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
/**
 * Helpers for adopting document level stylesheets into a shadow root.
 *
 * A sheet written for the document can mean something else inside a shadow
 * root: ":host" matches nothing at document level, but matches the shadow
 * host once adopted. DDD's page sheet, for one, sets every design token on
 * ":root, :host"; adopted as is into an editor's shadow root it would set
 * the tokens again on the editor and undo whatever the page around it had
 * changed (a theme's reading measure or body text size). These helpers make
 * a copy that keeps the document meaning.
 */

/**
 * Split a selector list on its top level commas (not those inside :is(),
 * :not(), attribute values and the like).
 * @param {string} selectorText
 * @returns {Array<string>}
 */
export function splitSelectorList(selectorText) {
  const parts = [];
  let depth = 0;
  let quote = null;
  let current = "";
  for (let i = 0; i < selectorText.length; i++) {
    const c = selectorText[i];
    if (quote) {
      if (c === "\\" && i + 1 < selectorText.length) {
        current += c + selectorText[i + 1];
        i++;
        continue;
      }
      if (c === quote) {
        quote = null;
      }
    } else if (c === '"' || c === "'") {
      quote = c;
    } else if (c === "(" || c === "[") {
      depth++;
    } else if (c === ")" || c === "]") {
      depth = Math.max(0, depth - 1);
    } else if (c === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
      continue;
    }
    current += c;
  }
  if (current.trim() !== "") {
    parts.push(current.trim());
  }
  return parts;
}

/**
 * Rewrite every style rule's selector list in a sheet (or grouping rule),
 * walking into @media, @supports, @layer, @container and nested style rules.
 * mapSelector gets one selector of a list and returns it rewritten, or ""
 * to drop it. A rule left with no selector is deleted.
 * @param {CSSStyleSheet|CSSGroupingRule|CSSStyleRule} parent
 * @param {function(string): string} mapSelector
 */
export function rewriteSheetSelectors(parent, mapSelector) {
  const rules = parent.cssRules;
  if (!rules) {
    return;
  }
  for (let i = rules.length - 1; i >= 0; i--) {
    const rule = rules[i];
    if (typeof rule.selectorText === "string") {
      const selector = splitSelectorList(rule.selectorText)
        .map((part) => mapSelector(part))
        .filter((part) => part !== "")
        .join(", ");
      if (selector === "") {
        parent.deleteRule(i);
        continue;
      }
      if (selector !== rule.selectorText) {
        rule.selectorText = selector;
      }
    }
    if (rule.cssRules && rule.cssRules.length > 0) {
      rewriteSheetSelectors(rule, mapSelector);
    }
  }
}

/**
 * Drop a selector that uses :host (it would match the shadow host instead
 * of nothing); keep the rest as is.
 * @param {string} selector one selector of a list
 * @returns {string}
 */
export function withoutHost(selector) {
  return selector.includes(":host") ? "" : selector;
}

/**
 * Whether any style rule in the sheet uses :host.
 * @param {CSSStyleSheet|CSSRule} parent
 * @returns {boolean}
 */
function usesHost(parent) {
  const rules = parent.cssRules;
  if (!rules) {
    return false;
  }
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    if (
      typeof rule.selectorText === "string" &&
      rule.selectorText.includes(":host")
    ) {
      return true;
    }
    if (rule.cssRules && usesHost(rule)) {
      return true;
    }
  }
  return false;
}

const shadowCopies = new WeakMap();

/**
 * A sheet to adopt into a shadow root in place of a document level sheet:
 * the same sheet when nothing in it uses :host, otherwise a copy without
 * the :host selectors (kept per source sheet, so each root adopts the same
 * copy). The copy is made once; a source changed later with replaceSync is
 * not followed, so a sheet meant to change in place either has no :host or
 * is written for the shadow root already and says so with
 * sheet.shadowSafe = true (then it is adopted as is).
 * @param {CSSStyleSheet} sheet
 * @returns {CSSStyleSheet}
 */
export function shadowSafeSheet(sheet) {
  if (!sheet || !globalThis.CSSStyleSheet || sheet.shadowSafe) {
    return sheet;
  }
  if (shadowCopies.has(sheet)) {
    return shadowCopies.get(sheet);
  }
  let result = sheet;
  try {
    if (usesHost(sheet)) {
      const copy = new globalThis.CSSStyleSheet();
      copy.replaceSync(
        Array.from(sheet.cssRules)
          .map((rule) => rule.cssText)
          .join("\n"),
      );
      rewriteSheetSelectors(copy, withoutHost);
      result = copy;
    }
  } catch {
    result = sheet;
  }
  shadowCopies.set(sheet, result);
  return result;
}
