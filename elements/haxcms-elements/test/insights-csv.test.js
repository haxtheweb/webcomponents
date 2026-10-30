import { expect } from "@open-wc/testing";
import { analyzeSite } from "../lib/core/insights/insights-analyzer.js";
import {
  toCsv,
  buildSectionCsv,
  INSIGHTS_CSV_BUILDERS,
} from "../lib/core/insights/insights-csv.js";
import {
  loadSpec,
  loadFixtureSite,
  loadExtras,
  RESULT_OPTIONS,
} from "./insights-fixture-helpers.js";

let results;

// minimal RFC 4180 reader for checking the output round-trips
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text.charAt(i);
    if (quoted) {
      if (ch === '"' && text.charAt(i + 1) === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        quoted = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\r" && text.charAt(i + 1) === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i++;
    } else {
      field += ch;
    }
  }
  return rows;
}

before(async () => {
  const spec = await loadSpec();
  const site = await loadFixtureSite();
  results = analyzeSite(
    site.pages,
    site.manifest,
    spec,
    Object.assign({ extras: await loadExtras() }, RESULT_OPTIONS),
  );
});

describe("insights-csv", () => {
  it("quotes, escapes and guards formula cells", () => {
    const csv = toCsv(
      [
        ["Name", "name"],
        ["Count", "n"],
        ["Flag", (r) => r.flag],
        ["List", "list"],
      ],
      [
        { name: 'He said "hi", twice', n: 3, flag: true, list: ["a", "b"] },
        { name: "=SUM(A1:A2)", n: -2, flag: false, list: [] },
        { name: "line\nbreak", n: null, flag: null, list: null },
      ],
    );
    expect(csv.endsWith("\r\n")).to.equal(true);
    const rows = parseCsv(csv);
    expect(rows).to.deep.equal([
      ["Name", "Count", "Flag", "List"],
      ['He said "hi", twice', "3", "yes", "a; b"],
      ["'=SUM(A1:A2)", "-2", "no", ""],
      ["line\nbreak", "", "", ""],
    ]);
  });

  it("has a builder for every section", () => {
    [
      "overview",
      "accessibility",
      "content",
      "links",
      "media",
      "instructional",
      "freshness",
      "metadata",
      "components",
    ].forEach((id) => {
      expect(INSIGHTS_CSV_BUILDERS[id], id).to.be.a("function");
      const rows = parseCsv(buildSectionCsv(id, results));
      expect(rows.length, id).to.be.greaterThan(1);
      const width = rows[0].length;
      rows.forEach((r) => expect(r.length, id).to.equal(width));
    });
    expect(buildSectionCsv("nope", results)).to.equal("");
  });

  it("exports the alt review table with status labels", () => {
    const rows = parseCsv(buildSectionCsv("accessibility", results));
    expect(rows[0]).to.deep.equal([
      "Page",
      "Slug",
      "Element",
      "Image",
      "Alt text",
      "Alt attribute",
      "Inside a link",
      "Has caption",
      "Status",
      "Reason",
    ]);
    expect(rows).to.have.length(10);
    expect(rows[1]).to.deep.equal([
      "Theme header, every page",
      "header-logos",
      "img",
      "assets/ecos-logo.png",
      "",
      "no",
      "yes",
      "no",
      "Fix",
      "No alt attribute on a linked image: the link has no name",
    ]);
    const statuses = rows.slice(1).map((r) => r[8]);
    expect(statuses.filter((s) => s === "Fix")).to.have.length(4);
    expect(statuses.filter((s) => s === "Check")).to.have.length(4);
    expect(statuses.filter((s) => s === "Looks OK")).to.have.length(1);
  });

  it("exports one row per page for content, media, freshness and metadata", () => {
    ["content", "media", "freshness", "metadata"].forEach((id) => {
      expect(parseCsv(buildSectionCsv(id, results)), id).to.have.length(19);
    });
    const content = parseCsv(buildSectionCsv("content", results));
    const algebra = content.find((r) => r[0] === "Algebra");
    expect(algebra.slice(1, 6)).to.deep.equal([
      "lesson-1/algebra",
      "lesson-1",
      algebra[3],
      "11",
      "1",
    ]);
  });

  it("exports link findings, practice pages, components and WCAG rows", () => {
    expect(parseCsv(buildSectionCsv("links", results))).to.have.length(14);
    const practice = parseCsv(buildSectionCsv("instructional", results));
    expect(practice.slice(1).map((r) => r[7])).to.deep.equal([
      "Embed",
      "No practice",
      "Worksheet",
      "Native check",
    ]);
    const comps = parseCsv(buildSectionCsv("components", results));
    expect(comps[1]).to.deep.equal(["video-player", "HAX element", "3", "2"]);
    const wcag = parseCsv(buildSectionCsv("accessibility-criteria", results));
    expect(wcag).to.have.length(11);
    expect(wcag[1].slice(0, 3)).to.deep.equal([
      "1.1.1",
      "Non-text content",
      "Fails",
    ]);
  });
});
