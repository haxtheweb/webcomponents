import { expect } from "@open-wc/testing";
import {
  INSIGHTS_SECTIONS,
  pageFacts,
  siteResults,
  analyzeSite,
  altStatus,
  contrastRatio,
  groupKey,
  parseLlmsTxt,
  parseRobotsTxt,
} from "../lib/core/insights/insights-analyzer.js";
import {
  loadSpec,
  loadFixtureSite,
  loadExtras,
  fixtureText,
  RESULT_OPTIONS,
} from "./insights-fixture-helpers.js";

let spec;
let site;
let results;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

before(async () => {
  spec = await loadSpec();
  site = await loadFixtureSite();
  results = analyzeSite(
    site.pages,
    site.manifest,
    spec,
    Object.assign({ extras: await loadExtras() }, RESULT_OPTIONS),
  );
});

describe("insights-analyzer: shape", () => {
  it("keys the results by the nine section ids", () => {
    expect(INSIGHTS_SECTIONS).to.have.length(9);
    INSIGHTS_SECTIONS.forEach((id) => {
      expect(results[id], id).to.be.an("object");
      expect(results.nav[id], `nav ${id}`).to.be.an("object");
    });
    expect(results.generatedAt).to.equal("2026-10-15T00:00:00.000Z");
  });

  it("is deterministic and structured-clone safe", async () => {
    const again = analyzeSite(
      site.pages,
      site.manifest,
      spec,
      Object.assign({ extras: await loadExtras() }, RESULT_OPTIONS),
    );
    expect(JSON.stringify(again)).to.equal(JSON.stringify(results));
    expect(() => structuredClone(results)).to.not.throw();
  });

  it("marks every server-only feature unavailable with what it needs", () => {
    [
      "outsideLinkStatus",
      "youtubeCaptions",
      "videoDuration",
      "bulkAltSave",
      "mediaIndexRebuild",
      "savedHistory",
      "schedules",
      "editHistory",
      "thresholdSettings",
      "cli",
    ].forEach((key) => {
      expect(results.unavailable[key].available, key).to.equal(false);
      expect(results.unavailable[key].needs, key).to.be.a("string").and.not
        .empty;
    });
    expect(results.links.outsideLinkStatus.available).to.equal(false);
    expect(results.media.videoMinutes.available).to.equal(false);
    expect(results.media.rebuildIndex.available).to.equal(false);
    expect(results.accessibility.youtubeCaptions.available).to.equal(false);
    expect(results.accessibility.bulkAltSave.available).to.equal(false);
    expect(results.freshness.editHistory.available).to.equal(false);
    expect(results.instructional.thresholds.available).to.equal(false);
    expect(results.overview.health.outsideLinks.available).to.equal(false);
    expect(results.content.trends.available).to.equal(false);
  });
});

describe("insights-analyzer: overview", () => {
  it("counts pages, words, paragraphs and read time", () => {
    const s = results.overview.stats;
    expect(s.pages).to.equal(18);
    expect(s.paragraphs).to.equal(32);
    expect(s.words).to.equal(results.totals.words);
    expect(s.readMinutes).to.equal(Math.ceil(s.words / 200));
    expect(s.videos).to.equal(3);
    expect(s.videoPages).to.equal(2);
    expect(s.practicePages).to.equal(4);
    expect(s.untitledIframes).to.equal(2);
    expect(s.daysSinceLastEdit).to.equal(629);
    expect(s.lastEdit).to.equal("2025-01-24");
  });

  it("adds accessibility errors as fix images + heading pages + tables + unnamed links + untitled iframes", () => {
    // 4 fix + 2 heading pages + 1 table + 2 unnamed links + 2 iframes
    expect(results.totals.accessibilityErrors).to.equal(11);
    expect(results.nav.accessibility.badge).to.equal(11);
  });

  it("orders fix-next by severity, then pages affected", () => {
    const fix = results.overview.fixNext;
    expect(fix).to.have.length(spec.overview.fixNextLimit);
    const ranks = fix.map((f) =>
      ["error", "warning", "info"].indexOf(f.severity),
    );
    expect(ranks).to.deep.equal(ranks.slice().sort());
    expect(fix[0].code).to.equal("needsJs");
    const codes = results.overview.findings.map((f) => f.code);
    expect(codes).to.include.members([
      "untitledIframes",
      "unnamedLinks",
      "headingErrors",
      "tablesWithoutHeaders",
      "brokenInternal",
      "themeContrast",
      "emptyPractice",
      "imagesToReview",
      "sharedTitles",
    ]);
  });

  it("averages the health checks, skipping empty ones", () => {
    const h = results.overview.health;
    const byId = {};
    h.checks.forEach((c) => {
      byId[c.id] = c;
    });
    expect([
      byId.headingsOnLongPages.passed,
      byId.headingsOnLongPages.total,
    ]).to.deep.equal([1, 2]);
    expect([byId.usableAlt.passed, byId.usableAlt.total]).to.deep.equal([1, 9]);
    expect([byId.titledEmbeds.passed, byId.titledEmbeds.total]).to.deep.equal([
      2, 4,
    ]);
    // the theme header region page is not checked for a description
    expect([byId.descriptions.passed, byId.descriptions.total]).to.deep.equal([
      13, 17,
    ]);
    expect([
      byId.practiceWithPractice.passed,
      byId.practiceWithPractice.total,
    ]).to.deep.equal([3, 4]);
    // (50 + 11 + 50 + 76 + 75) / 5 = 52.4
    expect(h.score).to.equal(52);
  });

  it("leaves the health score null when no check has anything to measure", () => {
    const f = pageFacts("<p>Hi</p>", { id: "a", title: "A" }, spec);
    const r = siteResults(
      [f],
      { items: [{ id: "a", title: "A", description: "Has one" }] },
      spec,
      RESULT_OPTIONS,
    );
    const desc = r.overview.health.checks.find((c) => c.id === "descriptions");
    expect(desc.total).to.equal(1);
    const r2 = siteResults([], { items: [] }, spec, RESULT_OPTIONS);
    expect(r2.overview.health.score).to.equal(null);
    r2.overview.health.checks.forEach((c) => {
      expect(c.score, c.id).to.equal(null);
    });
  });

  it("gives every finding a capped pageList of the pages it is about", () => {
    const by = {};
    results.overview.findings.forEach((f) => {
      by[f.code] = f;
      expect(f.pageList, f.code).to.be.an("array");
      expect(f.pageList.length, f.code).to.be.at.most(
        results.thresholds.pageListLimit,
      );
      f.pageList.forEach((p) => {
        expect(Object.keys(p)).to.deep.equal(["id", "slug", "title"]);
      });
    });
    expect(by.brokenInternal.pageList).to.deep.equal([
      { id: "week5", slug: "week-4/week-5", title: "Week 5" },
    ]);
    expect(by.untitledIframes.pageList.length).to.equal(
      by.untitledIframes.pages,
    );
    expect(by.thinPages.pageList.length).to.equal(8);
    // tables: pages counts pages, not tables
    expect(by.tablesWithoutHeaders.pages).to.equal(
      by.tablesWithoutHeaders.pageList.length,
    );
    // site-wide and folder findings point at no single page
    expect(by.themeContrast.pageList).to.deep.equal([]);
    expect(by.weeksWithoutPractice.pageList).to.deep.equal([]);
    const s = clone(spec);
    s.overview.pageListLimit = 2;
    const r = analyzeSite(site.pages, site.manifest, s, RESULT_OPTIONS);
    const thin = r.overview.findings.find((f) => f.code === "thinPages");
    expect(thin.pages).to.equal(8);
    expect(thin.pageList).to.have.length(2);
  });

  it("groups pages by top-level URL folder", () => {
    const f = {};
    results.overview.folders.forEach((g) => {
      f[g.name] = g;
    });
    expect(f["(root)"].pages).to.equal(7);
    expect(f["(root)"].flagged).to.equal(true);
    expect(f["(raw IDs)"].pages).to.equal(1);
    expect(f["lesson-1"].pages).to.equal(4);
    expect(f["week-8"].pages).to.equal(3);
    expect(results.overview.folders[0].name).to.equal("(root)");
  });
});

describe("insights-analyzer: alt text status", () => {
  const ctx = (inLink, file) => ({ inLink, file: file || "photo.png" });

  it("follows the Fix / Check / Looks OK patterns", () => {
    const cases = [
      [null, false, "fix", "noAlt"],
      [null, true, "fix", "noAltInLink"],
      ["", true, "fix", "emptyAltInLink"],
      ["", false, "check", "emptyAlt"],
      ["  ", false, "check", "emptyAlt"],
      ["photo.png", false, "fix", "fileName"],
      ["diagram.JPEG", false, "fix", "fileName"],
      ["image", false, "fix", "placeholder"],
      ["Try it!", false, "fix", "placeholder"],
      ["Logo", false, "fix", "placeholder"],
      ["A picture of a beaker", false, "check", "mentionsImage"],
      ["OK", false, "check", "tooShort"],
      ["x".repeat(151), false, "check", "tooLong"],
      ["x".repeat(150), false, "ok", "none"],
      ["Sugar and Salt Solutions", true, "ok", "none"],
    ];
    cases.forEach(([alt, inLink, status, reason]) => {
      const r = altStatus(alt, ctx(inLink), spec);
      expect([r.status, r.reason], String(alt)).to.deep.equal([status, reason]);
      expect(r.text).to.be.a("string").and.not.empty;
    });
  });

  it("builds one review row per image with page, file and caption", () => {
    const a = results.accessibility;
    expect(a.altCounts).to.deep.equal({ all: 9, fix: 4, check: 4, ok: 1 });
    expect(a.kpis.imagesToReview).to.equal(8);
    const logos = a.altRows.filter((r) => r.pageId === "hdr");
    expect(logos.map((r) => r.file)).to.deep.equal([
      "ecos-logo.png",
      "odl-logo-site.png",
    ]);
    logos.forEach((r) => {
      expect(r.alt).to.equal(null);
      expect(r.inLink).to.equal(true);
      expect(r.reason).to.equal("noAltInLink");
      expect(r.pageTitle).to.equal("Theme header, every page");
    });
    const eq = a.altRows.find((r) => r.file === "eq.png");
    expect(eq.hasCaption).to.equal(true);
    expect(eq.status).to.equal("check");
    const mediaImage = a.altRows.find((r) => r.file === "one.png");
    expect(mediaImage.tag).to.equal("media-image");
    expect(mediaImage.alt).to.equal("");
  });
});

describe("insights-analyzer: accessibility", () => {
  it("computes every WCAG row", () => {
    const c = {};
    results.accessibility.criteria.forEach((row) => {
      c[row.sc] = row;
    });
    expect(c["1.1.1"].state).to.equal("fails");
    expect(c["1.1.1"].params).to.include({
      noAlt: 2,
      noAltInLink: 2,
      emptyAlt: 2,
    });
    expect(c["1.2.2"].state).to.equal("check");
    expect(c["1.2.2"].params).to.include({
      videos: 3,
      withoutTrack: 2,
      youtube: 3,
    });
    expect(c["1.2.2"].unavailable.available).to.equal(false);
    expect(c["1.3.1"].state).to.equal("fails");
    expect(c["1.3.1"].params).to.include({
      extraH1Pages: 1,
      skipPages: 1,
      tables: 2,
      tablesWithoutHeaders: 1,
    });
    expect(c["1.4.3"].state).to.equal("fails");
    expect(c["2.4.2"].state).to.equal("check");
    expect(c["2.4.4"].state).to.equal("fails");
    expect(c["2.4.4"].params).to.include({
      unnamed: 2,
      urlAsText: 2,
      vague: 1,
    });
    expect(c["2.4.6"].params).to.include({ longPages: 2, withoutHeadings: 1 });
    expect(c["3.1.1"].state).to.equal("passes");
    expect(c["4.1.2"].params).to.include({ iframes: 4, pages: 3, untitled: 2 });
    expect(c.Math.params).to.include({ math: 2, equationImages: 0 });
  });

  it("lists heading order errors with chips", () => {
    expect(results.accessibility.headingErrors).to.deep.equal([
      {
        pageId: "mole",
        title: "The Mole",
        slug: "lesson-1/video-1",
        chips: ["h1 in body"],
      },
      {
        pageId: "week5",
        title: "Week 5",
        slug: "week-4/week-5",
        chips: ["h1 → h3"],
      },
    ]);
  });

  it("checks theme contrast like the mockup", () => {
    const [white, black, ddd] = results.accessibility.contrast;
    expect(white).to.include({ bg: "#57bbff", ratio: 2.1, passes: false });
    expect(black).to.include({ ratio: 10, passes: true });
    expect(ddd).to.include({ bg: "#1e407c", ratio: 10.1, passes: true });
    expect(contrastRatio("#000", "#fff")).to.equal(21);
    expect(contrastRatio("nope", "#fff")).to.equal(null);
  });
});

describe("insights-analyzer: content", () => {
  it("reports words, paragraphs, headings and thin pages", () => {
    const k = results.content.kpis;
    expect(k.pages).to.equal(18);
    expect(k.paragraphsPerPage).to.equal(1.8);
    expect(k.paragraphsMedian).to.equal(1);
    expect(k.noHeadings).to.equal(14);
    expect(k.thinPages).to.equal(8);
    expect(k.longest).to.include({
      title: "Algebra",
      paragraphs: 11,
      headings: 1,
      warn: true,
    });
    expect(results.nav.content.badge).to.equal(9);
    const thin = results.content.thin.map((t) => [t.title, t.what]);
    expect(thin).to.deep.include(["Chem110", "2 words"]);
    expect(thin).to.deep.include(["Prerequisites", "empty"]);
    expect(thin.map((t) => t[0])).to.not.include("Theme header, every page");
  });

  it("builds the by-section table and read-time buckets", () => {
    const lesson = results.content.sections.find((s) => s.name === "lesson-1");
    expect(lesson).to.include({
      pages: 4,
      paragraphs: 19,
      headings: 2,
      videos: 2,
      embeds: 3,
    });
    const total = results.content.readTime.reduce((n, b) => n + b.count, 0);
    expect(total).to.equal(18);
    expect(results.content.readTime[0].label).to.equal("1 min");
    expect(results.content.readTime[4].label).to.equal("5+ min");
  });

  it("scores readability once a page passes the minimum word count", () => {
    const s = clone(spec);
    s.content.readability.minWords = 10;
    const r = analyzeSite(site.pages, site.manifest, s, RESULT_OPTIONS);
    expect(r.content.readability.scored).to.be.greaterThan(0);
    const counted = r.content.readability.bands.reduce(
      (n, b) => n + b.count,
      0,
    );
    expect(counted).to.equal(r.content.readability.scored);
    expect(results.content.readability.scored).to.equal(0);
  });
});

describe("insights-analyzer: links", () => {
  it("resolves internal links against site.json and shape-checks outside links", () => {
    const rows = results.links.findings;
    const codes = rows.map((r) => `${r.code}:${r.href}`);
    expect(codes).to.include("brokenInternal:lesson-1/does-not-exist");
    expect(codes).to.include("unpublishedTarget:week-8/draft");
    expect(codes).to.include("tracking:https://youtu.be/abc?si=XYZ");
    expect(codes).to.include("urlAsText:https://genchem.science.psu.edu/");
    expect(codes).to.include("vagueText:lesson-1/video-1");
    expect(codes).to.include("insecure:http://canvas.psu.edu/");
    expect(codes).to.include("script:javascript:void(0)");
    expect(codes).to.include(
      "rawId:/item-b007296d-bd14-46be-8dd4-2f0e559d6b4c",
    );
    expect(codes).to.include("slugTitle:/lesson-1/video-1");
    expect(codes).to.include("folderWeek:/week-4/week-5");
    // files and existing pages are not findings
    expect(codes.join(" ")).to.not.include("handout.pdf");
    expect(results.links.counts).to.deep.equal({
      all: 13,
      errors: 3,
      warnings: 8,
      info: 2,
    });
    expect(results.nav.links.badge).to.equal(11);
  });

  it("reports link KPIs", () => {
    expect(results.links.kpis).to.include({
      unnamedLinks: 2,
      unnamedPages: 1,
      rawIdPages: 1,
      textbookLinks: 2,
      textbookPages: 2,
      embeds: 4,
      embedPages: 3,
      pathauto: false,
      brokenInternal: 1,
      outsideLinks: 5,
    });
    expect(results.links.embedHosts[0]).to.deep.equal({
      host: "phet.colorado.edu",
      count: 3,
    });
    expect(results.links.leanOnHosts[0].pageId).to.equal("mole");
  });

  it("treats same-site absolute URLs under the base path as internal", () => {
    const manifest = clone(site.manifest);
    const page = {
      item: manifest.items[0],
      html: '<p><a href="https://example.edu/sites/chem110/lesson-1/algebra">Algebra</a> <a href="https://example.edu/sites/chem110/nope">Gone</a> <a href="https://example.edu/other/x">Other site</a> <a href="../lesson-1/algebra/">Up</a> <a href="#top">Top</a> <a href="mailto:a@b.c">Mail</a></p>',
    };
    const r = analyzeSite([page], manifest, spec, RESULT_OPTIONS);
    const codes = r.links.findings.map((f) => `${f.code}:${f.href}`);
    expect(codes).to.deep.equal([
      "brokenInternal:https://example.edu/sites/chem110/nope",
    ]);
    expect(r.links.kpis.outsideLinks).to.equal(1);
  });
});

describe("insights-analyzer: media", () => {
  it("counts videos, embeds, images and tables", () => {
    expect(results.media.kpis).to.deep.include({
      videos: 3,
      videoPages: 2,
      embeds: 4,
      embedPages: 3,
      images: 9,
      tables: 2,
      tablesWithoutHeaders: 1,
      noMedia: 12,
    });
    expect(results.media.kpis.imagesByTag).to.deep.equal({
      img: 7,
      "media-image": 2,
    });
    expect(results.media.videosPerPage.map((b) => b.count)).to.deep.equal([
      16, 1, 1, 0, 0,
    ]);
  });

  it("compares page HTML with the site.json media index", () => {
    expect(results.media.mediaIndex).to.deep.equal({
      videos: { html: 3, index: 1, missing: 2 },
      images: { html: 9, index: 1, missing: 8 },
    });
  });
});

describe("insights-analyzer: instructional design", () => {
  it("classifies practice pages", () => {
    const states = {};
    results.instructional.practice.forEach((p) => {
      states[p.pageId] = p.state;
    });
    expect(states).to.deep.equal({
      tryit1: "embed",
      enthalpy: "none",
      bohr: "worksheet",
      tryit2: "native",
    });
    expect(results.instructional.kpis).to.include({
      practicePages: 4,
      nativeChecks: 1,
      emptyPractice: 1,
      weeksWithoutPractice: 1,
      objectives: 5,
      lowerOrderPct: 40,
    });
    expect(results.instructional.weeksWithoutPractice).to.deep.equal([
      "week-12",
    ]);
    expect(results.nav.instructional.badge).to.equal(2);
  });

  it("matches objective verbs to Bloom levels", () => {
    expect(
      results.instructional.objectives.map((o) => [o.verb, o.level]),
    ).to.deep.equal([
      ["calculate", "Apply"],
      ["define", "Remember"],
      ["explains", "Understand"],
      ["compare", "Analyze"],
      ["zorp", "Unmatched"],
    ]);
  });

  it("fills the activity map from the spec columns", () => {
    const week8 = results.instructional.activityMap.find(
      (r) => r.name === "week-8",
    );
    const cells = {};
    week8.cells.forEach((c) => {
      cells[c.id] = [c.count, c.level];
    });
    expect(cells).to.deep.equal({
      read: [3, "2"],
      watch: [0, "0"],
      embed: [1, "1"],
      tryit: [2, "2"],
      textbook: [0, "0"],
      guide: [0, "0"],
      worksheet: [1, "1"],
    });
  });
});

describe("insights-analyzer: freshness", () => {
  it("dates the last edit and buckets page ages", () => {
    expect(results.freshness.kpis).to.include({
      daysSinceLastEdit: 629,
      lastEdit: "2025-01-24",
      editedRecently: 0,
      bulkSaved: 0,
      termSpecific: 3,
      oldestCreatedYear: 2019,
      oldestCreatedCount: 12,
      neverSaved: 1,
    });
    expect(results.freshness.ageBuckets.map((b) => b.count)).to.deep.equal([
      0, 4, 0, 13, 0,
    ]);
    // the oldest page was last saved 3.5 years ago, past the warning age
    expect(results.nav.freshness.badge).to.equal("3.5 yr");
    expect(
      results.freshness.termSpecific.map((t) => [t.title, t.reason, t.where]),
    ).to.deep.equal([
      ["Syllabus", "policies, dates", "title"],
      ["Week 12", "people", "text"],
      ["Exam Review", "exam date", "title"],
    ]);
  });

  it("finds term words and dates in page text with a snippet", () => {
    const w12 = results.freshness.termSpecific.find((t) => t.pageId === "w12");
    expect(w12).to.include({
      slug: "week-12",
      match: "Office hours",
    });
    expect(w12.snippet).to.contain("Office hours");
    expect(w12.matches.map((m) => [m.where, m.kind, m.match])).to.deep.equal([
      ["text", "word", "Office hours"],
      ["text", "date", "Fall 2025"],
    ]);
    expect(results.freshness.kpis.termInText).to.equal(1);
    const row = results.freshness.pages.find((p) => p.pageId === "w12");
    expect(row).to.include({ termWhere: "text", termMatch: "Office hours" });
    // title-only words do not fire on body text
    const syl = results.freshness.termSpecific.find(
      (t) => t.pageId === "syllabus",
    );
    expect(syl.matches.every((m) => m.where === "title")).to.equal(true);
  });

  it("matches the spec's date patterns in body text", () => {
    const cases = [
      ["Grades post Spring 2024.", "Spring 2024", "semester"],
      [
        "Plan for academic year 2024-25 now.",
        "academic year 2024-25",
        "academic year",
      ],
      ["Quiz on March 3, 2025 in class.", "March 3, 2025", "date"],
      ["Due 10/15/2025 at noon.", "10/15/2025", "date"],
      ["Updated 2025-01-24 by staff.", "2025-01-24", "date"],
    ];
    cases.forEach(([text, match, reason]) => {
      const f = pageFacts(`<p>${text}</p>`, { id: "x", title: "Notes" }, spec);
      expect(
        f.termHits.map((h) => [h.match, h.reason]),
        text,
      ).to.deep.equal([[match, reason]]);
    });
    const none = pageFacts(
      "<p>Mix 1/2 cup with 3.14 grams in 1990 conditions.</p>",
      { id: "y", title: "Lab" },
      spec,
    );
    expect(none.termHits).to.deep.equal([]);
  });

  it("gives each age bucket a tone from the spec age bands", () => {
    expect(
      results.freshness.ageBuckets.map((b) => [b.label, b.tone]),
    ).to.deep.equal([
      ["< 1 yr", ""],
      ["1–2 yr", "warning"],
      ["2–3 yr", "warning"],
      ["3–4 yr", "danger"],
      ["4+ yr", "danger"],
    ]);
    const s = clone(spec);
    s.freshness.ageBands = { warningYears: 2, dangerYears: 4 };
    const r = analyzeSite(site.pages, site.manifest, s, RESULT_OPTIONS);
    expect(r.freshness.ageBuckets.map((b) => b.tone)).to.deep.equal([
      "",
      "",
      "warning",
      "warning",
      "danger",
    ]);
  });

  it("finds bulk saves with the spec threshold", () => {
    const s = clone(spec);
    s.freshness.bulkSave.minPages = 10;
    const r = analyzeSite(site.pages, site.manifest, s, RESULT_OPTIONS);
    expect(r.freshness.bulkSaves).to.have.length(1);
    expect(r.freshness.bulkSaves[0]).to.include({
      date: "2023-04-01",
      count: 13,
    });
    expect(r.freshness.kpis.bulkSaved).to.equal(13);
    const codes = r.freshness.events.map((e) => e.code);
    expect(codes).to.deep.equal([
      "earliestCreated",
      "siteCreated",
      "bulkSave",
      "largestEditDay",
      "lastEdit",
      "now",
    ]);
  });
});

describe("insights-analyzer: metadata", () => {
  it("runs the robots, llms, no-JS and site.json checks", () => {
    const c = {};
    results.metadata.checks.forEach((row) => {
      c[row.code] = row;
    });
    expect(c.noJs.state).to.equal("fails");
    expect(c.robots.state).to.equal("fails");
    expect(c.robots.params.blocked).to.deep.equal(["/sites/chem110/pages/"]);
    expect(c.llms.state).to.equal("passes");
    expect(c.llms.params).to.include({
      listed: 16,
      visible: 16,
      hasSiteJson: true,
    });
    expect(c.optionalResources.params.found).to.have.length(5);
    expect(c.license.state).to.equal("passes");
    expect(c.descriptions.params.count).to.equal(4);
    expect(c.siteDescription.params.words).to.equal(2);
    expect(c.author.params.blank).to.deep.equal([
      "image",
      "description",
      "socialLink",
      "socialHandle",
    ]);
    expect(c.analytics.params.gaID).to.equal("G-TEST123");
    expect(results.metadata.kpis).to.deep.include({
      readableWithoutJs: false,
      aiFiles: { found: 7, total: 7, optional: 5, optionalFound: 5 },
      noDescription: 4,
      sharedTitlePages: 2,
      license: "BY-SA",
    });
    expect(results.nav.metadata.badge).to.equal(4);
  });

  it("passes the no-JS check when the plain page contains the text", async () => {
    const extras = await loadExtras("syllabus");
    extras.noJs.html =
      "<html><body><p>The syllabus lists policies and dates. See <a>https://genchem.science.psu.edu/</a> and more</p></body></html>";
    const r = analyzeSite(
      site.pages,
      site.manifest,
      spec,
      Object.assign({ extras }, RESULT_OPTIONS),
    );
    expect(r.metadata.kpis.readableWithoutJs).to.equal(true);
  });

  it("marks public-file checks not checked without loader extras", () => {
    const r = analyzeSite(site.pages, site.manifest, spec, RESULT_OPTIONS);
    const states = r.metadata.checks
      .filter((c) => ["noJs", "robots", "llms"].indexOf(c.code) !== -1)
      .map((c) => c.state);
    expect(states).to.deep.equal(["notChecked", "notChecked", "notChecked"]);
    expect(r.metadata.kpis.readableWithoutJs).to.equal(null);
  });

  it("parses robots.txt groups and llms.txt sections", async () => {
    const robots = parseRobotsTxt(await fixtureText("robots.txt"), [
      "/sites/a/pages/x",
      "/sites/a/",
    ]);
    expect(robots.disallow).to.deep.equal(["/sites/*/pages/"]);
    expect(robots.blocked).to.deep.equal(["/sites/a/pages/x"]);
    const allowWins = parseRobotsTxt(
      "User-agent: *\nDisallow: /a\nAllow: /a/b",
      ["/a/b/c", "/a/c"],
    );
    expect(allowWins.blocked).to.deep.equal(["/a/c"]);
    const llms = parseLlmsTxt(await fixtureText("llms.txt"));
    expect(llms.pageLinks).to.equal(16);
    expect(llms.sections.optional).to.have.length(5);
  });
});

describe("insights-analyzer: components", () => {
  it("counts HAX elements and plain HTML by tag", () => {
    const k = results.components.kpis;
    expect(k.haxElements).to.equal(13);
    expect(k.distinctHax).to.equal(8);
    expect(k.distinctHtml).to.equal(6);
    expect(k.elements).to.equal(
      k.haxElements + results.components.html.reduce((n, r) => n + r.count, 0),
    );
    expect(k.flags).to.equal(4);
    expect(k.nativeChecks).to.equal(1);
    expect(results.components.hax[0]).to.deep.equal({
      tag: "video-player",
      count: 3,
      pages: 2,
    });
    expect(
      results.components.html.find((r) => r.tag === "h2–h6").count,
    ).to.equal(3);
    const flags = results.components.flags.map((f) => f.code);
    expect(flags).to.deep.equal([
      "rawIframes",
      "placeholder",
      "h1",
      "divs",
      "haxShare",
    ]);
    const ph = results.components.flags.find((f) => f.code === "placeholder");
    expect(ph.tags).to.deep.equal(["place-holder"]);
    expect(ph.pageList).to.deep.equal([
      { id: "draft", slug: "week-8/draft", title: "Draft notes" },
    ]);
    const iframes = results.components.flags.find(
      (f) => f.code === "rawIframes",
    );
    expect(iframes.tags).to.deep.equal(["iframe"]);
    expect(iframes.pageList).to.have.length(iframes.pages);
    expect(results.components.suggestions.map((s) => s.tag)).to.deep.equal([
      "multiple-choice",
      "a11y-collapse",
    ]);
  });
});

describe("insights-analyzer: slugs, thresholds and badges", () => {
  it("puts slug and title on every row that names a page", () => {
    const r = results;
    const lists = {
      "content.thin": r.content.thin,
      "content.longest": r.content.longest,
      "content.pages": r.content.pages,
      "links.findings": r.links.findings,
      "links.leanOnHosts": r.links.leanOnHosts,
      "media.noMedia": r.media.noMedia,
      "media.pages": r.media.pages,
      "instructional.practice": r.instructional.practice,
      "instructional.walls": r.instructional.walls,
      "instructional.objectives": r.instructional.objectives,
      "freshness.termSpecific": r.freshness.termSpecific,
      "freshness.pages": r.freshness.pages,
      "metadata.noDescription": r.metadata.noDescription,
      "metadata.pages": r.metadata.pages,
      "accessibility.altRows": r.accessibility.altRows,
      "accessibility.headingErrors": r.accessibility.headingErrors,
    };
    Object.keys(lists).forEach((key) => {
      expect(lists[key].length, key).to.be.greaterThan(0);
      lists[key].forEach((row) => {
        expect(row.pageId, key).to.be.a("string");
        expect(row.slug, `${key} ${row.pageId}`).to.be.a("string").and.not
          .empty;
        expect(row.title, `${key} ${row.pageId}`).to.be.a("string");
      });
    });
    expect(r.content.kpis.longest.slug).to.equal("lesson-1/algebra");
    r.metadata.sharedTitles.forEach((g) => {
      expect(g.pageList.map((p) => p.id)).to.deep.equal(g.pageIds);
    });
  });

  it("reports the spec values the screens put in words", () => {
    expect(results.thresholds).to.deep.include({
      wordsPerMinute: spec.text.wordsPerMinute,
      longPageParagraphs: spec.content.longPageParagraphs,
      paragraphsPerHeadingWarn: spec.content.paragraphsPerHeadingWarn,
      thinMaxBlocks: spec.content.thinMaxBlocks,
      thinMaxWords: spec.content.thinMaxWords,
      sectionNoHeadingsParagraphs: spec.content.sectionNoHeadingsParagraphs,
      altMaxLength: spec.accessibility.alt.maxLength,
      contrastMinRatio: spec.accessibility.contrast.minRatio,
      editedRecentlyDays: spec.freshness.editedRecentlyDays,
      ageWarningYears: spec.freshness.ageBands.warningYears,
      ageDangerYears: spec.freshness.ageBands.dangerYears,
      pageListLimit: spec.overview.pageListLimit,
    });
    const s = clone(spec);
    s.text.wordsPerMinute = 150;
    s.content.thinMaxWords = 25;
    const r = analyzeSite(site.pages, site.manifest, s, RESULT_OPTIONS);
    expect(r.thresholds.wordsPerMinute).to.equal(150);
    expect(r.thresholds.thinMaxWords).to.equal(25);
  });

  it("leaves rail badges null when there is nothing to flag", () => {
    const item = {
      id: "a",
      slug: "a",
      title: "A page",
      description: "About A",
      metadata: { updated: Math.floor(Date.UTC(2026, 8, 1) / 1000) },
    };
    const manifest = {
      items: [item],
      metadata: { site: { settings: { lang: "en" } } },
    };
    const r = analyzeSite(
      [
        {
          item,
          html: "<h2>Start</h2><p>Plenty of words here so the page is not thin at all, with a heading and a clear structure for readers who arrive here and want to learn the topic in steps.</p>",
        },
      ],
      manifest,
      spec,
      RESULT_OPTIONS,
    );
    Object.keys(r.nav).forEach((id) => {
      expect(r.nav[id].badge, id).to.not.equal(0);
      expect(r.nav[id].badge, id).to.not.equal("0 yr");
    });
    expect(r.nav.freshness.badge).to.equal(null);
    expect(r.nav.content.badge).to.equal(null);
    expect(r.nav.components.badge).to.equal(null);
  });
});

describe("insights-analyzer: spec thresholds", () => {
  it("moves results when thresholds change", () => {
    const s = clone(spec);
    s.content.longPageParagraphs = 2;
    s.content.thinMaxWords = 3;
    s.accessibility.alt.minLength = 1;
    s.instructional.practiceTitlePatterns = ["^nothing matches$"];
    const r = analyzeSite(site.pages, site.manifest, s, RESULT_OPTIONS);
    expect(r.content.kpis.longNoHeadings).to.be.greaterThan(
      results.content.kpis.longNoHeadings,
    );
    expect(r.content.kpis.thinPages).to.be.lessThan(
      results.content.kpis.thinPages,
    );
    expect(
      r.accessibility.altRows.find((x) => x.file === "long.png").status,
    ).to.equal("ok");
    expect(r.instructional.kpis.practicePages).to.equal(0);
  });

  it("uses the spec words per minute", () => {
    const s = clone(spec);
    s.text.wordsPerMinute = 10;
    const r = analyzeSite(site.pages, site.manifest, s, RESULT_OPTIONS);
    expect(r.totals.readMinutes).to.equal(Math.ceil(r.totals.words / 10));
  });

  it("groups slugs into folders", () => {
    expect(groupKey("index", spec)).to.equal("(root)");
    expect(groupKey("week-4/a/b", spec)).to.equal("week-4");
    expect(
      groupKey("item-b007296d-bd14-46be-8dd4-2f0e559d6b4c", spec),
    ).to.equal("(raw IDs)");
  });
});

describe("insights-analyzer: pageFacts parsers", () => {
  it("gives the same facts with DOMParser and the built-in parser", () => {
    site.pages.forEach((p) => {
      const dom = pageFacts(p.html, p.item, spec, { parser: "dom" });
      const lite = pageFacts(p.html, p.item, spec, { parser: "lite" });
      expect(lite, p.item.id).to.deep.equal(dom);
    });
  });

  it("handles implied end tags, entities and raw text in the built-in parser", () => {
    const html =
      '<table><td>bare cell</td></table><p>One &amp; two<p>Three<ul><li>a<li>b</ul><script>var x = "<p>no</p>";</script><h2>T</h2><p>caf&eacute; &#233; &#xE9;</p><my-el /><p>after</p>';
    const dom = pageFacts(html, { id: "x" }, spec, { parser: "dom" });
    const lite = pageFacts(html, { id: "x" }, spec, { parser: "lite" });
    expect(lite.paragraphs).to.equal(dom.paragraphs);
    expect(lite.tags).to.deep.equal(dom.tags);
    expect(lite.headings).to.deep.equal([2]);
    expect(lite.textStart).to.equal(dom.textStart);
    expect(lite.textStart).to.include("One two Three");
    expect(lite.textStart).to.include("café é é");
  });

  it("returns empty facts for an empty page", () => {
    const f = pageFacts("", { id: "e", title: "E" }, spec);
    expect(f).to.include({ words: 0, paragraphs: 0, blocks: 0 });
    expect(
      siteResults([f], { items: [] }, spec, RESULT_OPTIONS).totals.pages,
    ).to.equal(1);
  });
});
