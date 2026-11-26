/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
/**
 * Edit mode content styles: what a theme draws on its page content in view
 * mode, it draws on the same content in edit mode.
 *
 * In view mode page content is light DOM of the theme element, so a theme
 * styles it from document level (HAXCMSGlobalStyleSheetContent, rendered into
 * store.themeStyleElement) with selectors like "clean-one > p". In edit mode
 * the same nodes are children of hax-body, inside the shadow root of h-a-x,
 * where document styles do not reach. Without this the reading measure,
 * paragraph rhythm, heading colors and the like drop away while editing and
 * the text reflows.
 *
 * This keeps one constructed stylesheet holding the active theme's global
 * content CSS with the theme's tag name swapped for hax-body in selectors
 * (selectors only, so urls and strings are left alone). It is flagged .hax
 * like the design system sheet, so h-a-x adopts it into its shadow root;
 * replaceSync updates every root that adopted it when the theme changes.
 * Selectors that use :host are dropped, since inside that shadow root they
 * would match h-a-x instead of nothing.
 *
 * Two kinds of rule from the theme's own shadow styles are carried over too:
 * - "::slotted(X)" rules (heading colors and the like) become "hax-body > X",
 *   inside a cascade layer so that, as in view mode, they lose to page level
 *   rules for normal declarations and win for !important ones.
 * - rules on the theme's "#slot" wrapper (text size, line height, padding
 *   around the content) are put on hax-body, which stands in that place in
 *   edit mode. Only properties that inherit or that size the content box are
 *   copied; display and the like stay with the wrapper.
 * Rules that depend on the theme's own state (":host([...])") can't be
 * evaluated where the editor is, so they are left out.
 */

import {
  splitSelectorList,
  rewriteSheetSelectors,
} from "@haxtheweb/utils/lib/shadow-sheets.js";

// the layer holding a theme's ::slotted rules, see mirrorThemeShadowStyles
const SLOTTED_LAYER = "haxcms-theme-slotted";
// what the #slot wrapper rules become: hax-body, at the specificity h-a-x
// gives its own in-place rule so these come after and win
const SLOT_TARGET = ":host([in-place]) hax-body";
// properties of a #slot rule that reach the content: inherited text
// properties, plus the box around the content
const SLOT_PROPERTY =
  /^(--|font|line-height$|letter-spacing$|word-spacing$|color$|text-align|text-indent$|text-transform$|text-wrap|white-space|line-break$|word-break$|overflow-wrap$|hyphens$|tab-size$|direction$|writing-mode$|padding|margin|max-width$|min-width$|width$|box-sizing$|max-inline-size$|inline-size$)/;

// tag names come from theme code, never from content
const SAFE_TAG = /^[a-z][a-z0-9]*(-[a-z0-9]+)+$/;

let editModeSheet = null;

/**
 * Rewrite one selector for the edit mode content root: the theme's tag name
 * as a type selector becomes hax-body; a selector using :host is dropped.
 * @param {string} selector one selector of a list
 * @param {string} tag the theme's tag name, ex: "clean-one"
 * @returns {string} the rewritten selector, "" to drop it
 */
export function editModeSelectorPart(selector, tag) {
  if (!SAFE_TAG.test(tag) || selector.includes(":host")) {
    return "";
  }
  // the tag at the start, or after a combinator or an opening paren, and not
  // followed by more of a name
  const tagSelector = new RegExp(`(^|[\\s>+~(,])${tag}(?![\\w-])`, "g");
  return selector.replace(tagSelector, "$1hax-body");
}

/**
 * Rewrite a selector list for the edit mode content root.
 * @param {string} selectorText
 * @param {string} tag the theme's tag name
 * @returns {string} the rewritten list, "" when nothing is left
 */
export function editModeSelector(selectorText, tag) {
  return splitSelectorList(selectorText)
    .map((part) => editModeSelectorPart(part, tag))
    .filter((part) => part !== "")
    .join(", ");
}

/**
 * Split off the argument of the first ::slotted() in a selector.
 * @param {string} selector
 * @returns {{before: string, arg: string, after: string}|null}
 */
function splitSlotted(selector) {
  const start = selector.indexOf("::slotted(");
  if (start === -1) {
    return null;
  }
  let depth = 0;
  for (let i = start + 9; i < selector.length; i++) {
    if (selector[i] === "(") {
      depth++;
    } else if (selector[i] === ")") {
      depth--;
      if (depth === 0) {
        return {
          before: selector.slice(0, start),
          arg: selector.slice(start + 10, i),
          after: selector.slice(i + 1),
        };
      }
    }
  }
  return null;
}

/**
 * Map one selector of a theme's shadow styles to the edit mode content.
 * @param {string} selector
 * @returns {{kind: string, selector: string}|null} kind "slotted" or "slot"
 */
export function mirrorShadowSelector(selector) {
  // state of the theme element can't be seen from inside h-a-x
  if (selector.includes(":host(") || selector.includes(":host-context")) {
    return null;
  }
  const slotted = splitSlotted(selector);
  if (slotted) {
    if (slotted.arg.trim() === "" || slotted.after.includes("::slotted(")) {
      return null;
    }
    return {
      kind: "slotted",
      selector: `hax-body > :is(${slotted.arg.trim()})${slotted.after}`,
    };
  }
  if (/(^|[\s>+~])#slot$/.test(selector.trim())) {
    return { kind: "slot", selector: SLOT_TARGET };
  }
  return null;
}

/**
 * The CSS text of a rule's declarations, keeping only the properties allowed.
 * @param {CSSStyleDeclaration} style
 * @param {RegExp|null} allow null keeps them all
 * @returns {string}
 */
function declarations(style, allow) {
  // read the serialized text rather than the longhands: a shorthand written
  // with var() (padding: 0 var(--x)) has no longhand values to read back
  return splitDeclarations(style.cssText)
    .filter((decl) => {
      const name = decl.slice(0, decl.indexOf(":")).trim();
      return name && (!allow || allow.test(name));
    })
    .map((decl) => `${decl}; `)
    .join("");
}

/**
 * Split a declaration block on its top level semicolons.
 * @param {string} text
 * @returns {Array<string>}
 */
function splitDeclarations(text) {
  const out = [];
  let depth = 0;
  let quote = null;
  let current = "";
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quote) {
      if (c === "\\" && i + 1 < text.length) {
        current += c + text[i + 1];
        i++;
        continue;
      }
      if (c === quote) {
        quote = null;
      }
    } else if (c === '"' || c === "'") {
      quote = c;
    } else if (c === "(") {
      depth++;
    } else if (c === ")") {
      depth = Math.max(0, depth - 1);
    } else if (c === ";" && depth === 0) {
      if (current.trim()) {
        out.push(current.trim());
      }
      current = "";
      continue;
    }
    current += c;
  }
  if (current.trim()) {
    out.push(current.trim());
  }
  return out;
}

/**
 * Walk parsed theme shadow rules and collect what reaches page content.
 * @param {CSSRuleList} rules
 * @returns {{slotted: string, slot: string}}
 */
function mirrorRules(rules) {
  let slotted = "";
  let slot = "";
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    if (typeof rule.selectorText === "string" && rule.style) {
      const parts = splitSelectorList(rule.selectorText)
        .map((part) => mirrorShadowSelector(part))
        .filter((part) => part);
      const slottedParts = parts
        .filter((part) => part.kind === "slotted")
        .map((part) => part.selector);
      if (slottedParts.length > 0) {
        const body = declarations(rule.style, null);
        if (body) {
          slotted += `${slottedParts.join(", ")} { ${body}}\n`;
        }
      }
      if (parts.some((part) => part.kind === "slot")) {
        const body = declarations(rule.style, SLOT_PROPERTY);
        if (body) {
          slot += `${SLOT_TARGET} { ${body}}\n`;
        }
      }
    } else if (
      rule.cssRules &&
      typeof rule.conditionText === "string" &&
      rule.constructor &&
      /Media|Supports|Container/.test(rule.constructor.name)
    ) {
      const inner = mirrorRules(rule.cssRules);
      const at = rule.cssText.slice(0, rule.cssText.indexOf("{")).trim();
      if (inner.slotted) {
        slotted += `${at} {\n${inner.slotted}}\n`;
      }
      if (inner.slot) {
        slot += `${at} {\n${inner.slot}}\n`;
      }
    }
  }
  return { slotted, slot };
}

const mirrorCache = new WeakMap();

/**
 * CSS for the edit mode content from a theme's own (shadow) styles: its
 * ::slotted rules, in a cascade layer, and its #slot wrapper rules.
 * @param {Array} elementStyles the theme class's elementStyles (CSSResults
 *   or CSSStyleSheets)
 * @returns {string}
 */
export function mirrorThemeShadowStyles(elementStyles) {
  if (!Array.isArray(elementStyles) || !globalThis.CSSStyleSheet) {
    return "";
  }
  if (mirrorCache.has(elementStyles)) {
    return mirrorCache.get(elementStyles);
  }
  let cssText = "";
  for (const style of elementStyles.flat(Infinity)) {
    if (!style) {
      continue;
    }
    if (typeof style.cssText === "string") {
      cssText += style.cssText + "\n";
    } else if (style.cssRules) {
      try {
        cssText +=
          Array.from(style.cssRules)
            .map((rule) => rule.cssText)
            .join("\n") + "\n";
      } catch {
        // a sheet we can't read adds nothing
      }
    }
  }
  let result = "";
  try {
    const parsed = new globalThis.CSSStyleSheet();
    parsed.replaceSync(cssText);
    const mirrored = mirrorRules(parsed.cssRules);
    if (mirrored.slotted) {
      result += `@layer ${SLOTTED_LAYER} {\n${mirrored.slotted}}\n`;
    }
    result += mirrored.slot;
  } catch {
    result = "";
  }
  mirrorCache.set(elementStyles, result);
  return result;
}

/**
 * The shared edit mode content sheet; created on first use and added to the
 * document's adopted sheets with the .hax flag so h-a-x picks it up.
 * @returns {CSSStyleSheet|null} null where constructed sheets are missing
 */
export function getEditModeContentSheet() {
  if (editModeSheet) {
    return editModeSheet;
  }
  if (
    !globalThis.document ||
    !globalThis.CSSStyleSheet ||
    !("adoptedStyleSheets" in globalThis.document)
  ) {
    return null;
  }
  try {
    editModeSheet = new globalThis.CSSStyleSheet();
  } catch {
    return null;
  }
  editModeSheet.hax = true;
  // written for the h-a-x shadow root (its :host rules are meant), so h-a-x
  // adopts it as is and follows its replaceSync updates
  editModeSheet.shadowSafe = true;
  globalThis.document.adoptedStyleSheets = [
    ...globalThis.document.adoptedStyleSheets,
    editModeSheet,
  ];
  return editModeSheet;
}

/**
 * Put a theme's global content CSS into the edit mode sheet.
 * @param {Array} styles CSSResults (or anything with cssText) from the
 *   theme's HAXCMSGlobalStyleSheetContent()
 * @param {string} tag the theme's tag name
 * @param {Array} [elementStyles] the theme class's own styles, whose
 *   ::slotted and #slot rules are carried over (see mirrorThemeShadowStyles)
 * @returns {CSSStyleSheet|null} the sheet, or null when nothing was done
 */
export function syncEditModeContentStyles(styles, tag, elementStyles) {
  const sheet = getEditModeContentSheet();
  if (!sheet) {
    return null;
  }
  const cssText = SAFE_TAG.test(tag)
    ? (Array.isArray(styles) ? styles : [styles])
        .flat(Infinity)
        .map((s) => (s && typeof s.cssText === "string" ? s.cssText : ""))
        .join("\n")
    : "";
  try {
    sheet.replaceSync(cssText);
    rewriteSheetSelectors(sheet, (part) => editModeSelectorPart(part, tag));
    // the theme's shadow rules go first: the ::slotted ones sit in a layer
    // and the #slot ones target hax-body itself, so neither competes with
    // the page level rules above by source order
    const shadow = SAFE_TAG.test(tag)
      ? mirrorThemeShadowStyles(elementStyles)
      : "";
    if (shadow) {
      const mirrored = new globalThis.CSSStyleSheet();
      mirrored.replaceSync(shadow);
      Array.from(mirrored.cssRules)
        .reverse()
        .forEach((rule) => sheet.insertRule(rule.cssText, 0));
    }
  } catch {
    // a theme sheet the parser can't take whole: draw nothing rather than
    // half a theme
    sheet.replaceSync("");
  }
  return sheet;
}
