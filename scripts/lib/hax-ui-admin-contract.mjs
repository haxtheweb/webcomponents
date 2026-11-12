/**
 * Static checks for the HAX UI admin pattern contracts
 * (elements/d-d-d/lib/DDDPatternLibrary.js, the contract-admin-* entries,
 * and elements/d-d-d/design-system/source/hax-ui-admin.md).
 *
 * Two kinds of file are checked:
 *
 * - A contract target: the element a contract-admin-* entry lists in
 *   targetElements. It is admin chrome, so it must build on the HAX UI
 *   layer and keep to its scale.
 * - An admin opener: any file in the admin areas (app-hax, HAXcms core,
 *   the character builder, the editor) that opens a modal or draws its own
 *   dialog. Every admin modal wears the one frame and every "are you sure"
 *   is the one confirm card.
 *
 * Each rule says what the contract requires, so a finding reads as the rule
 * it breaks:
 *
 *   layer          a target imports the HAX UI layer
 *                  (@haxtheweb/d-d-d/lib/HaxUiAdmin*.js, HaxUiDialogFrame.js,
 *                  hax-body/lib/hax-ui-styles.js or the site admin shell's
 *                  exports)
 *   content-type   a target sizes admin text with --hax-ui-admin-font-size*,
 *                  never DDD's content scale (--ddd-font-size-*)
 *   px-type        a target never hard codes a font size in px
 *   simple-colors  a target never uses SimpleColors
 *   raw-hex        a target never uses a raw hex colour, except as the
 *                  fallback inside var(--token, #hex)
 *   native-dialog  no admin file calls the browser's confirm(), prompt()
 *                  or alert(); use adminConfirm / hax-confirm-dialog
 *   modal-frame    every simple-modal-show in an admin file passes the one
 *                  frame (HaxUiDialogFrame, HaxUiDialogConfirm,
 *                  HaxUiDialogTitlebar or the SITE_ADMIN_* maps built on them)
 *   modal-close    a modal: true admin dialog with a titlebar keeps its close
 *                  button (showClose), so every dialog can be left the same way
 *   own-dialog     an admin file that draws its own <dialog> or <web-dialog>
 *                  uses the frame classes (.hax-ui-dialog-titlebar) or the
 *                  confirm card (hax-confirm-dialog)
 *
 * The checks read source text, not a running page, so they are a floor: the
 * screenshots in a review still decide whether a surface looks right.
 */

/** imports that bring in the HAX UI layer */
const LAYER_IMPORT =
  /@haxtheweb\/d-d-d\/lib\/(HaxUiAdmin\w*|HaxUiDialogFrame)\.js|@haxtheweb\/hax-body\/lib\/hax-ui-styles\.js|HaxcmsAdminPanelStyles\.js|admin\/site-admin-sections\.js/;

/** style maps that carry the one dialog frame into a simple-modal */
const FRAME_REF =
  /\b(HaxUiDialogFrame|HaxUiDialogConfirm|HaxUiDialogTitlebar|haxUiDialogVars|SITE_ADMIN_(?:MODAL_SIZE|TITLEBAR_STYLES|CONFIRM_STYLES)|siteAdminDockedModalStyles)\b/;

/** the confirm card's style map, which has no titlebar and so no close */
const CONFIRM_REF = /\b(HaxUiDialogConfirm|SITE_ADMIN_CONFIRM_STYLES)\b/;

/**
 * Strip comments so documentation that names a forbidden call or token is
 * not reported. Strings and templates are kept: CSS lives in them.
 */
export function stripComments(source) {
  let out = "";
  let i = 0;
  let quote = null;
  while (i < source.length) {
    const c = source[i];
    const n = source[i + 1];
    if (quote) {
      out += c;
      if (c === "\\") {
        out += n === undefined ? "" : n;
        i += 2;
        continue;
      }
      if (c === quote) {
        quote = null;
      }
      i++;
      continue;
    }
    if (c === "/" && n === "*") {
      const end = source.indexOf("*/", i + 2);
      const stop = end === -1 ? source.length : end + 2;
      // keep line numbers stable
      out += source.slice(i, stop).replace(/[^\n]/g, " ");
      i = stop;
      continue;
    }
    if (c === "/" && n === "/" && source[i - 1] !== ":") {
      const end = source.indexOf("\n", i);
      const stop = end === -1 ? source.length : end;
      out += " ".repeat(stop - i);
      i = stop;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      quote = c;
    }
    out += c;
    i++;
  }
  return out;
}

function lineOf(source, index) {
  let line = 1;
  for (let i = 0; i < index && i < source.length; i++) {
    if (source[i] === "\n") {
      line++;
    }
  }
  return line;
}

function add(findings, rule, key, line, message) {
  findings.push({ rule, key, line, message });
}

/**
 * The text of one simple-modal-show event: from the event name to the
 * end of the CustomEvent call, so a check reads that dialog's own detail.
 */
function eventSpan(source, start) {
  const open = source.lastIndexOf("new CustomEvent", start);
  let i = source.indexOf("(", open === -1 ? start : open);
  if (i === -1) {
    return source.slice(start, start + 2000);
  }
  let depth = 0;
  for (let j = i; j < source.length; j++) {
    const c = source[j];
    if (c === "(") {
      depth++;
    } else if (c === ")") {
      depth--;
      if (depth === 0) {
        return source.slice(i, j + 1);
      }
    }
  }
  return source.slice(i, i + 2000);
}

/**
 * The checks for one file.
 * @param {string} source  file text
 * @param {{ target?: boolean, opener?: boolean }} scope  which rules apply
 * @returns {{ rule: string, key: string, line: number, message: string }[]}
 */
export function checkAdminSource(
  source,
  { target = false, opener = true } = {},
) {
  const findings = [];
  const code = stripComments(source);

  if (target) {
    if (!LAYER_IMPORT.test(code)) {
      add(
        findings,
        "layer",
        "no HAX UI import",
        1,
        "admin chrome must import the HAX UI layer (@haxtheweb/d-d-d/lib/HaxUiAdminStyles.js or one of its parts)",
      );
    }
    for (const m of code.matchAll(/var\(\s*(--ddd-font-size-[\w-]+)/g)) {
      add(
        findings,
        "content-type",
        m[1],
        lineOf(code, m.index),
        `${m[1]} is DDD's content scale; admin text uses --hax-ui-admin-font-size or --hax-ui-admin-font-size-xs`,
      );
    }
    for (const m of code.matchAll(/font-size\s*:\s*(\d+(?:\.\d+)?px)/g)) {
      add(
        findings,
        "px-type",
        m[1],
        lineOf(code, m.index),
        `font-size ${m[1]} is hard coded; use a --hax-ui-admin-font-size* token (add one to HaxUiAdminTokens if none fits)`,
      );
    }
    for (const m of code.matchAll(
      /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g,
    )) {
      const lineStart = code.lastIndexOf("\n", m.index) + 1;
      const before = code.slice(lineStart, m.index);
      // a fallback behind a token (var(--hax-ui-x, #fff)) is allowed
      if (/var\([^()]*,\s*$/.test(before) || /[\w&]$/.test(before)) {
        continue;
      }
      add(
        findings,
        "raw-hex",
        m[0].toLowerCase(),
        lineOf(code, m.index),
        `${m[0]} is a raw colour; use a --hax-ui-* token (a hex fallback inside var() is fine)`,
      );
    }
    for (const m of code.matchAll(/--simple-colors-[\w-]+/g)) {
      add(
        findings,
        "simple-colors",
        m[0],
        lineOf(code, m.index),
        `${m[0]}: SimpleColors is not part of HAX UI; use --hax-ui-* tokens`,
      );
    }
  }

  if (opener) {
    // a call, not a method definition such as `confirm() {` or `this.confirm(`
    const native =
      /(^|[^\w.$])((?:globalThis|window)\.)?(confirm|prompt|alert)\s*\(([^)]*)\)(\s*\{)?/gm;
    for (const m of code.matchAll(native)) {
      if (m[5] && !m[2]) {
        continue; // `confirm(x) {` defines a method
      }
      const at = m.index + m[1].length;
      add(
        findings,
        "native-dialog",
        m[3],
        lineOf(code, at),
        `${m[3]}() is the browser's dialog; use adminConfirm / adminPrompt or hax-confirm-dialog`,
      );
    }

    for (const m of code.matchAll(/["']simple-modal-show["']/g)) {
      const before = code.slice(Math.max(0, m.index - 80), m.index);
      if (!/new\s+CustomEvent\s*\(\s*$/.test(before)) {
        continue; // a listener, not an opener
      }
      const span = eventSpan(code, m.index);
      const line = lineOf(code, m.index);
      // a style map built elsewhere in the file still counts when the file
      // pulls in the frame and the event passes a styles value
      const framed =
        FRAME_REF.test(span) ||
        (FRAME_REF.test(code) && /\bstyles\b/.test(span));
      if (!framed) {
        add(
          findings,
          "modal-frame",
          "simple-modal-show",
          line,
          "this modal does not pass the one dialog frame (HaxUiDialogFrame / SITE_ADMIN_* maps)",
        );
      }
      if (
        /\bmodal\s*:\s*true\b/.test(span) &&
        !/\bshowClose\s*:\s*true\b/.test(span) &&
        !CONFIRM_REF.test(span) &&
        /\btitle\s*[:,]/.test(span)
      ) {
        add(
          findings,
          "modal-close",
          "modal without close",
          line,
          "a titled modal: true dialog drops the titlebar close button; pass showClose: true (or use the confirm card)",
        );
      }
    }

    for (const m of code.matchAll(/<(dialog|web-dialog)[\s>]/g)) {
      if (
        /hax-ui-dialog-titlebar|hax-confirm-dialog|HaxUiDialogTitlebarStyles/.test(
          code,
        )
      ) {
        continue;
      }
      add(
        findings,
        "own-dialog",
        m[1],
        lineOf(code, m.index),
        `a hand-drawn <${m[1]}> must use the frame classes (.hax-ui-dialog-titlebar) or the confirm card (hax-confirm-dialog)`,
      );
    }
  }
  return findings;
}

/** { rule: { key: count } } for one file, the baseline's shape */
export function countFindings(findings) {
  const out = {};
  for (const f of findings) {
    out[f.rule] = out[f.rule] || {};
    out[f.rule][f.key] = (out[f.rule][f.key] || 0) + 1;
  }
  return out;
}

/**
 * Contracts whose targets are shared form elements used by admin and by
 * authored content alike (simple-fields, grade-book): they describe one
 * pattern inside those elements, not the element as admin chrome.
 */
const SHARED_ELEMENT_CONTRACTS = new Set(["contract-admin-fieldset"]);

/** the tags every contract-admin-* entry targets as admin chrome */
export function adminContractTargets(contracts) {
  const tags = new Set();
  for (const c of contracts || []) {
    if (
      c &&
      typeof c.id === "string" &&
      c.id.indexOf("contract-admin-") === 0 &&
      !SHARED_ELEMENT_CONTRACTS.has(c.id)
    ) {
      for (const t of c.targetElements || []) {
        tags.add(t);
      }
    }
  }
  return [...tags].sort();
}
