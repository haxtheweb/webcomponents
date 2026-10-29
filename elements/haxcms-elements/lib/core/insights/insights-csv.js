/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * CSV builders for the Insights "Export CSV" button: one pure function per
 * section, each taking the siteResults() object and returning CSV text
 * (RFC 4180: CRLF rows, quoted fields when needed). Text cells that start
 * with = + - @ (or a tab / carriage return) get a leading apostrophe so a
 * spreadsheet never runs them as formulas.
 */

function cell(value) {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "boolean") {
    return value ? "yes" : "no";
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "";
  }
  if (Array.isArray(value)) {
    return cell(value.join("; "));
  }
  let text = String(value);
  if (/^[=+\-@\t\r]/.test(text)) {
    text = `'${text}`;
  }
  if (/[",\r\n]/.test(text)) {
    text = `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

/**
 * Generic CSV writer.
 * @param {Array<[string, string|function]>} columns header label and either
 *   a row key or a function(row) returning the value
 * @param {Array<Object>} rows
 * @returns {string}
 */
export function toCsv(columns, rows) {
  const lines = [columns.map((c) => cell(c[0])).join(",")];
  (rows || []).forEach((row) => {
    lines.push(
      columns
        .map((c) => cell(typeof c[1] === "function" ? c[1](row) : row[c[1]]))
        .join(","),
    );
  });
  return lines.join("\r\n") + "\r\n";
}

const SEVERITY = { error: "Error", warning: "Warning", info: "Info" };
const ALT_STATUS = { fix: "Fix", check: "Check", ok: "Looks OK" };
const STATE = {
  fails: "Fails",
  check: "Check",
  passes: "Passes",
  warning: "Warning",
  info: "Info",
  notChecked: "Not checked",
  review: "Review",
};

export function overviewCsv(results) {
  return toCsv(
    [
      ["Severity", (r) => SEVERITY[r.severity]],
      ["Finding", "title"],
      ["Where", "detail"],
      ["Section", "section"],
      ["Count", "count"],
      ["Pages affected", "pages"],
    ],
    results.overview.findings,
  );
}

export function accessibilityCsv(results) {
  return toCsv(
    [
      ["Page", "pageTitle"],
      ["Slug", "slug"],
      ["Element", "tag"],
      ["Image", "src"],
      ["Alt text", (r) => (r.alt === null ? "" : r.alt)],
      ["Alt attribute", (r) => r.alt !== null],
      ["Inside a link", "inLink"],
      ["Has caption", "hasCaption"],
      ["Status", (r) => ALT_STATUS[r.status]],
      ["Reason", "reasonText"],
    ],
    results.accessibility.altRows,
  );
}

export function accessibilityCriteriaCsv(results) {
  return toCsv(
    [
      ["SC", "sc"],
      ["Criterion", "name"],
      ["Result", (r) => STATE[r.state]],
      ["What we found", "found"],
      ["How it is counted", "how"],
    ],
    results.accessibility.criteria,
  );
}

export function contentCsv(results) {
  return toCsv(
    [
      ["Page", "title"],
      ["Slug", "slug"],
      ["Section", "section"],
      ["Words", "words"],
      ["Paragraphs", "paragraphs"],
      ["Headings", "headings"],
      ["Read min", "readMinutes"],
      ["Videos", "videos"],
      ["Embeds", "embeds"],
      ["Reading grade", "grade"],
      ["Thin", "thin"],
    ],
    results.content.pages,
  );
}

export function linksCsv(results) {
  return toCsv(
    [
      ["Severity", (r) => SEVERITY[r.severity]],
      ["Finding", "label"],
      ["Link", "href"],
      ["Where", "page"],
      ["Slug", "slug"],
      ["Suggested fix", "fix"],
    ],
    results.links.findings,
  );
}

export function mediaCsv(results) {
  return toCsv(
    [
      ["Page", "title"],
      ["Slug", "slug"],
      ["Section", "section"],
      ["Videos", "videos"],
      ["Embeds", "embeds"],
      ["Images", "images"],
      ["Tables", "tables"],
    ],
    results.media.pages,
  );
}

export function instructionalCsv(results) {
  const STATES = {
    native: "Native check",
    worksheet: "Worksheet",
    embed: "Embed",
    none: "No practice",
  };
  return toCsv(
    [
      ["Practice page", "title"],
      ["Section", "section"],
      ["Contains", "what"],
      ["Embeds", "embeds"],
      ["Videos", "videos"],
      ["Worksheets", "worksheets"],
      ["Native checks", "nativeChecks"],
      ["State", (r) => STATES[r.state]],
    ],
    results.instructional.practice,
  );
}

export function freshnessCsv(results) {
  return toCsv(
    [
      ["Page", "title"],
      ["Slug", "slug"],
      ["Created", "created"],
      ["Updated", "updated"],
      ["Days since update", "daysSinceUpdate"],
      ["Likely to change each term", "termReason"],
    ],
    results.freshness.pages,
  );
}

export function metadataCsv(results) {
  return toCsv(
    [
      ["Page", "title"],
      ["Slug", "slug"],
      ["Has description", "hasDescription"],
      ["Shared title", "sharedTitle"],
      ["Generic title", "genericTitle"],
      ["Published", "published"],
    ],
    results.metadata.pages,
  );
}

export function componentsCsv(results) {
  const rows = results.components.hax
    .map((r) => Object.assign({ kind: "HAX element" }, r))
    .concat(
      results.components.html.map((r) =>
        Object.assign({ kind: "Plain HTML" }, r),
      ),
    );
  return toCsv(
    [
      ["Tag", "tag"],
      ["Kind", "kind"],
      ["Count", "count"],
      ["Pages", "pages"],
    ],
    rows,
  );
}

/**
 * Builders keyed by section id (plus "accessibility-criteria" for the WCAG
 * checks table).
 */
export const INSIGHTS_CSV_BUILDERS = {
  overview: overviewCsv,
  accessibility: accessibilityCsv,
  "accessibility-criteria": accessibilityCriteriaCsv,
  content: contentCsv,
  links: linksCsv,
  media: mediaCsv,
  instructional: instructionalCsv,
  freshness: freshnessCsv,
  metadata: metadataCsv,
  components: componentsCsv,
};

/**
 * CSV for one section, or "" for an unknown id.
 * @param {string} sectionId
 * @param {Object} results siteResults() output
 */
export function buildSectionCsv(sectionId, results) {
  const builder = INSIGHTS_CSV_BUILDERS[sectionId];
  return builder && results ? builder(results) : "";
}
