// Unit tests for the pure citation formatting helpers behind <site-citation>.
// No DOM or store is needed: fixtures are plain site.json style objects.
import { expect } from "@open-wc/testing";
import {
  CITATION_STYLES,
  buildCitationSource,
  formatCitation,
  escapeBibtex,
  bibtexKey,
  toDate,
} from "../lib/ui-components/site/lib/site-citation-formats.js";

// 1700000000 = 2023-11-14, 1709000000 = 2024-02-27, 1710000000 = 2024-03-09 (UTC)
const manifest = {
  title: "Intro to HAX",
  license: "by-sa",
  metadata: {
    author: { name: "Jane Q. Public", email: "jane@example.edu" },
    site: {
      domain: "example.edu/hax/",
      created: 1700000000,
      updated: 1710000000,
    },
  },
};
const page = {
  title: "Getting Started",
  slug: "getting-started",
  metadata: { created: 1705000000, updated: 1709000000 },
};
const accessed = new Date(Date.UTC(2026, 9, 19));

describe("site-citation-formats", () => {
  describe("toDate", () => {
    it("reads unix seconds, ms, ISO strings and Dates", () => {
      expect(toDate(1709000000).toISOString()).to.equal(
        "2024-02-27T02:13:20.000Z",
      );
      expect(toDate(1709000000000).toISOString()).to.equal(
        "2024-02-27T02:13:20.000Z",
      );
      expect(toDate("1709000000").getUTCFullYear()).to.equal(2024);
      expect(toDate("2024-02-27T00:00:00Z").getUTCDate()).to.equal(27);
    });
    it("treats empty, zero and garbage as absent", () => {
      [undefined, null, "", 0, -5, "not a date", {}].forEach((v) =>
        expect(toDate(v)).to.equal(null),
      );
    });
  });

  describe("buildCitationSource", () => {
    it("builds a page source from page and site fields", () => {
      const s = buildCitationSource(manifest, page, { scope: "page" });
      expect(s.author).to.equal("Jane Q. Public");
      expect(s.title).to.equal("Getting Started");
      expect(s.siteTitle).to.equal("Intro to HAX");
      expect(s.url).to.equal("https://example.edu/hax/getting-started");
      expect(s.license).to.equal("by-sa");
      expect(s.date.getUTCDate()).to.equal(27); // page updated, not site
    });
    it("builds a site source and ignores the page", () => {
      const s = buildCitationSource(manifest, page, { scope: "site" });
      expect(s.title).to.equal("Intro to HAX");
      expect(s.siteTitle).to.equal("");
      expect(s.url).to.equal("https://example.edu/hax");
      expect(s.date.getUTCDate()).to.equal(9);
    });
    it("falls back to created when updated is missing", () => {
      const s = buildCitationSource(manifest, {
        title: "P",
        metadata: { created: 1705000000 },
      });
      expect(s.date.getUTCFullYear()).to.equal(2024);
      expect(s.date.getUTCMonth()).to.equal(0);
    });
    it("prefers a page author and accepts string author shapes", () => {
      expect(
        buildCitationSource(manifest, {
          title: "P",
          metadata: { author: "Sam Lee" },
        }).author,
      ).to.equal("Sam Lee");
      expect(buildCitationSource({ author: "Top Level" }, {}).author).to.equal(
        "Top Level",
      );
      expect(
        buildCitationSource(
          { metadata: { site: { author: { name: "Site Author" } } } },
          {},
        ).author,
      ).to.equal("Site Author");
    });
    it("does not invent a date, author or url when absent", () => {
      const s = buildCitationSource({ title: "Bare" }, { title: "Page" });
      expect(s.author).to.equal("");
      expect(s.date).to.equal(null);
      expect(s.url).to.equal("");
      expect(s.license).to.equal("");
    });
    it("uses the supplied fallbackUrl only when there is no domain", () => {
      expect(
        buildCitationSource({}, {}, { fallbackUrl: "https://x.test/a" }).url,
      ).to.equal("https://x.test/a");
      expect(
        buildCitationSource(manifest, page, { fallbackUrl: "https://x.test/a" })
          .url,
      ).to.equal("https://example.edu/hax/getting-started");
    });
    it("keeps an explicit protocol on the domain", () => {
      const m = { metadata: { site: { domain: "http://old.test" } } };
      expect(buildCitationSource(m, { slug: "/a/b" }).url).to.equal(
        "http://old.test/a/b",
      );
    });
    it("does not repeat the site title when the page has the same title", () => {
      const s = buildCitationSource(manifest, { title: "Intro to HAX" });
      expect(s.siteTitle).to.equal("");
    });
    it("copes with null manifest and item", () => {
      const s = buildCitationSource(null, null);
      expect(s.title).to.equal("");
    });
  });

  describe("formatCitation fixtures (full data)", () => {
    const pageSrc = buildCitationSource(manifest, page, { scope: "page" });
    const siteSrc = buildCitationSource(manifest, page, { scope: "site" });

    it("APA page", () => {
      expect(formatCitation(pageSrc, "apa").text).to.equal(
        "Jane Q. Public. (2024, February 27). Getting Started. Intro to HAX. https://example.edu/hax/getting-started",
      );
    });
    it("APA site italicises the site title", () => {
      const c = formatCitation(siteSrc, "apa");
      expect(c.text).to.equal(
        "Jane Q. Public. (2024, March 9). Intro to HAX. https://example.edu/hax",
      );
      expect(
        c.segments.filter((s) => s.italic).map((s) => s.text),
      ).to.deep.equal(["Intro to HAX."]);
    });
    it("APA page italicises the site container, not the page title", () => {
      const it = formatCitation(pageSrc, "apa").segments.filter(
        (s) => s.italic,
      );
      expect(it.map((s) => s.text)).to.deep.equal(["Intro to HAX."]);
    });
    it("MLA page with access date", () => {
      expect(formatCitation(pageSrc, "mla", { accessed }).text).to.equal(
        "Jane Q. Public. “Getting Started.” Intro to HAX, 27 Feb. 2024, example.edu/hax/getting-started. Accessed 19 Oct. 2026.",
      );
    });
    it("MLA page without access date prints none", () => {
      expect(formatCitation(pageSrc, "mla").text).to.equal(
        "Jane Q. Public. “Getting Started.” Intro to HAX, 27 Feb. 2024, example.edu/hax/getting-started.",
      );
    });
    it("MLA site", () => {
      expect(formatCitation(siteSrc, "mla").text).to.equal(
        "Jane Q. Public. Intro to HAX. 9 Mar. 2024, example.edu/hax.",
      );
    });
    it("Chicago page and site", () => {
      expect(formatCitation(pageSrc, "chicago").text).to.equal(
        "Jane Q. Public. “Getting Started.” Intro to HAX. February 27, 2024. https://example.edu/hax/getting-started.",
      );
      expect(formatCitation(siteSrc, "chicago").text).to.equal(
        "Jane Q. Public. Intro to HAX. March 9, 2024. https://example.edu/hax.",
      );
    });
    it("BibTeX page", () => {
      expect(formatCitation(pageSrc, "bibtex", { accessed }).text).to.equal(
        [
          "@online{jane2024getting,",
          "  author = {Jane Q. Public},",
          "  title = {Getting Started},",
          "  organization = {Intro to HAX},",
          "  date = {2024-02-27},",
          "  url = {https://example.edu/hax/getting-started},",
          "  urldate = {2026-10-19},",
          "  note = {License: by-sa}",
          "}",
        ].join("\n"),
      );
    });
    it("BibTeX site", () => {
      expect(formatCitation(siteSrc, "bibtex").text).to.equal(
        [
          "@online{jane2024intro,",
          "  author = {Jane Q. Public},",
          "  title = {Intro to HAX},",
          "  date = {2024-03-09},",
          "  url = {https://example.edu/hax},",
          "  note = {License: by-sa}",
          "}",
        ].join("\n"),
      );
    });
  });

  describe("formatCitation with missing fields", () => {
    const noAuthorNoDate = {
      scope: "page",
      title: "Getting Started",
      siteTitle: "Intro to HAX",
      url: "https://example.edu/hax/getting-started",
    };
    it("APA: title leads when no author; n.d. when no date", () => {
      const c = formatCitation(noAuthorNoDate, "apa");
      expect(c.text).to.equal(
        "Getting Started. (n.d.). Intro to HAX. https://example.edu/hax/getting-started",
      );
      expect(c.missing).to.deep.equal(["author", "date"]);
    });
    it("MLA: no author, no date", () => {
      expect(formatCitation(noAuthorNoDate, "mla").text).to.equal(
        "“Getting Started.” Intro to HAX, example.edu/hax/getting-started.",
      );
    });
    it("Chicago: uses the access date only when there is no publication date", () => {
      expect(
        formatCitation(noAuthorNoDate, "chicago", { accessed }).text,
      ).to.equal(
        "“Getting Started.” Intro to HAX. Accessed October 19, 2026. https://example.edu/hax/getting-started.",
      );
      expect(
        formatCitation(
          { ...noAuthorNoDate, date: new Date(Date.UTC(2024, 0, 2)) },
          "chicago",
          {
            accessed,
          },
        ).text,
      ).to.not.include("Accessed");
    });
    it("BibTeX omits absent fields instead of empty braces", () => {
      const text = formatCitation(
        { scope: "page", title: "Only a title" },
        "bibtex",
      ).text;
      expect(text).to.equal("@online{only,\n  title = {Only a title}\n}");
      expect(text).to.not.include("author");
      expect(text).to.not.include("url");
      expect(text).to.not.include("{}");
    });
    it("BibTeX with nothing at all stays valid", () => {
      expect(formatCitation({}, "bibtex").text).to.equal("@online{citation}");
    });
    it("title only in every style never prints blanks or 'undefined'", () => {
      CITATION_STYLES.forEach((style) => {
        const t = formatCitation(
          { scope: "site", title: "Just Title" },
          style,
        ).text;
        expect(t).to.include("Just Title");
        expect(t).to.not.match(/undefined|null|NaN|\(\)|,\s*,/);
        if (style !== "bibtex") expect(t).to.not.include("  ");
      });
    });
    it("empty source yields empty text in prose styles", () => {
      ["mla", "chicago"].forEach((s) =>
        expect(formatCitation({}, s).text).to.equal(""),
      );
    });
    it("does not double a trailing period on author or title", () => {
      const t = formatCitation(
        {
          scope: "site",
          author: "ACME Inc.",
          title: "Why?",
          url: "https://a.test",
        },
        "apa",
      ).text;
      expect(t).to.equal("ACME Inc. (n.d.). Why? https://a.test");
    });
    it("unknown style falls back to APA", () => {
      expect(formatCitation(noAuthorNoDate, "harvard").style).to.equal("apa");
    });
    it("ignores invalid date values", () => {
      expect(
        formatCitation({ ...noAuthorNoDate, date: "garbage" }, "apa").text,
      ).to.include("(n.d.)");
    });
  });

  describe("BibTeX escaping", () => {
    it("escapes special characters in values", () => {
      expect(escapeBibtex("R&D 100% {x} a_b #1 $5 ~ ^")).to.equal(
        "R\\&D 100\\% \\{x\\} a\\_b \\#1 \\$5 \\textasciitilde{} \\textasciicircum{}",
      );
    });
    it("escapes a backslash once and keeps its replacement intact", () => {
      expect(escapeBibtex("a\\b {c}")).to.equal("a\\textbackslash{}b \\{c\\}");
    });
    it("leaves the url unescaped", () => {
      const t = formatCitation(
        { title: "T", url: "https://a.test/a_b?x=1&y=2%20" },
        "bibtex",
      ).text;
      expect(t).to.include("url = {https://a.test/a_b?x=1&y=2%20}");
    });
    it("makes an ascii cite key", () => {
      expect(
        bibtexKey({
          author: "Zoë Müller",
          title: "Über uns",
          date: new Date(Date.UTC(2020, 0, 1)),
        }),
      ).to.equal("zoe2020uber");
    });
  });
});
