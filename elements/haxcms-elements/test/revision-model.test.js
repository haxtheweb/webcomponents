import { expect } from "@open-wc/testing";
import {
  parseCommitMessage,
  legacyOp,
  describeRevision,
  revisionMatchesFilter,
  groupRevisionsByDay,
  htmlToText,
  diffTokens,
  tokenizeWords,
  diffPageText,
  diffPageSource,
  collapseUnchanged,
  diffItemMetadata,
  normalizeStructureChanges,
  structureLabelKeys,
  previousContentIndex,
  currentContentIndex,
} from "../lib/core/revisions/revision-model.js";

describe("revision model: commit messages", () => {
  it("parses the op-code prefix", () => {
    expect(
      parseCommitMessage("[A:updateContentByIdOrSlug:k3f9] Committed changes"),
    ).to.deep.equal({
      actor: "A",
      op: "updateContentByIdOrSlug",
      txn: "k3f9",
      summary: "Committed changes",
    });
    expect(
      parseCommitMessage("[H:updateItem] Page details updated: A"),
    ).to.deep.equal({
      actor: "H",
      op: "updateItem",
      txn: "",
      summary: "Page details updated: A",
    });
    // git-interface used to keep the quotes
    expect(
      parseCommitMessage("'[S:system] Managed files updated'").op,
    ).to.equal("system");
  });

  it("reads anything else as external", () => {
    expect(parseCommitMessage("fixed a typo  by hand")).to.deep.equal({
      actor: "X",
      op: "",
      txn: "",
      summary: "fixed a typo by hand",
    });
    // HAX never writes X, and the op must start with a letter
    expect(parseCommitMessage("[X:updateItem] nope").actor).to.equal("X");
    expect(parseCommitMessage("[H:9bad] nope").op).to.equal("");
  });

  it("recognises HAX wording from before op codes", () => {
    expect(legacyOp("Committed changes")).to.equal("updateContentByIdOrSlug");
    expect(legacyOp("Page details updated: Intro (item-1)")).to.equal(
      "updateItem",
    );
    expect(legacyOp('Bulk replace "a" -> "b" across 3 pages')).to.equal(
      "replaceContent",
    );
    expect(legacyOp("Page revision restored: X (1) from abc")).to.equal(
      "restoreItemRevision",
    );
    expect(legacyOp("A new journey begins: mysite (ab12)")).to.equal(
      "siteCreate",
    );
    expect(legacyOp("my own words")).to.equal("");
  });

  it("describes a revision from server fields or the message", () => {
    const agent = describeRevision({
      message: "[A:replaceContent:ab12] Bulk replace",
    });
    expect(agent.actor).to.equal("A");
    expect(agent.family).to.equal("content");
    expect(agent.labelKey).to.equal("opReplace");
    expect(agent.external).to.be.false;
    const server = describeRevision({
      message: "ignored",
      actor: "H",
      op: "updateSiteOutline",
      txn: "zz11",
      summary: "Outline updated in bulk",
    });
    expect(server.family).to.equal("structure");
    expect(server.summary).to.equal("Outline updated in bulk");
    const legacy = describeRevision({ message: "Committed changes" });
    expect(legacy.inferred).to.be.true;
    expect(legacy.external).to.be.false;
    expect(legacy.labelKey).to.equal("opContent");
    const outside = describeRevision({ message: "edited in vim" });
    expect(outside.external).to.be.true;
    expect(outside.labelKey).to.equal("opExternal");
    expect(outside.family).to.equal("other");
  });

  it("filters by family", () => {
    const r = describeRevision({ message: "[H:updateItem] x" });
    expect(revisionMatchesFilter(r, "all")).to.be.true;
    expect(revisionMatchesFilter(r, "details")).to.be.true;
    expect(revisionMatchesFilter(r, "content")).to.be.false;
  });
});

describe("revision model: grouping", () => {
  it("groups by local day with today and yesterday", () => {
    const now = new Date(2026, 9, 29, 15, 0, 0).getTime();
    const sec = (d) => Math.floor(d.getTime() / 1000);
    const groups = groupRevisionsByDay(
      [
        { timestamp: sec(new Date(2026, 9, 29, 14, 0)) },
        { timestamp: sec(new Date(2026, 9, 29, 9, 0)) },
        { timestamp: sec(new Date(2026, 9, 28, 22, 0)) },
        { date: new Date(2026, 9, 20, 10, 0).toISOString() },
      ],
      now,
    );
    expect(groups.map((g) => [g.kind, g.items.length])).to.deep.equal([
      ["today", 2],
      ["yesterday", 1],
      ["date", 1],
    ]);
  });
});

describe("revision model: diffs", () => {
  it("turns page HTML into readable blocks", () => {
    expect(
      htmlToText(
        "<h2>Title</h2><p>One <b>two</b></p><ul><li><p>Three</p></li></ul><script>bad()</script>",
      ),
    ).to.equal("Title\n\nOne two\n\nThree");
    expect(htmlToText("<video-player></video-player>plain")).to.equal("plain");
    expect(htmlToText("")).to.equal("");
  });

  it("diffs words and counts what changed", () => {
    const d = diffPageText(
      "<p>The quick brown fox</p>",
      "<p>The slow brown fox jumps</p>",
    );
    expect(d.added).to.equal(2);
    expect(d.removed).to.equal(1);
    expect(d.changed).to.be.true;
    const text = d.runs
      .map((r) =>
        r.type === "eq"
          ? r.text
          : r.type === "ins"
            ? `+${r.text}+`
            : `-${r.text}-`,
      )
      .join("");
    expect(text).to.contain("-quick-");
    expect(text).to.contain("+slow+");
    expect(text).to.contain("+ jumps+");
    expect(diffPageText("<p>same</p>", "<p>same</p>").changed).to.be.false;
  });

  it("diffs HTML source by line", () => {
    const d = diffPageSource("<p>a</p>\n<p>b</p>", "<p>a</p>\n<p>c</p>");
    expect(d.added).to.equal(1);
    expect(d.removed).to.equal(1);
  });

  it("keeps whole runs when the inputs are huge", () => {
    const big = Array.from({ length: 2500 }, (_, i) => "w" + i);
    const other = Array.from({ length: 2500 }, (_, i) => "v" + i);
    const runs = diffTokens(big, other);
    expect(runs.map((r) => r.type)).to.deep.equal(["del", "ins"]);
  });

  it("collapses long unchanged stretches", () => {
    const words = Array.from({ length: 60 }, (_, i) => "w" + i).join(" ");
    const runs = diffTokens(
      tokenizeWords(words + " old"),
      tokenizeWords(words + " new"),
    );
    const collapsed = collapseUnchanged(runs, 5);
    expect(collapsed[0].type).to.equal("skip");
    expect(collapsed[0].words).to.equal(55);
    expect(collapsed[1].text.trim()).to.equal("w55 w56 w57 w58 w59");
  });

  it("lists page detail changes", () => {
    const changes = diffItemMetadata(
      { title: "Old", description: "", metadata: {} },
      { title: "New", description: "", metadata: { published: false } },
    );
    expect(changes).to.deep.equal([
      { field: "title", before: "Old", after: "New" },
      { field: "published", before: true, after: false },
    ]);
    expect(diffItemMetadata(null, { title: "x" })).to.deep.equal([]);
  });
});

describe("revision model: outline changes", () => {
  it("gives structure rows plain labels and the Structure family", () => {
    const row = describeRevision({
      hash: "e5",
      message: "[H:updateItem:ab12] Page details updated: A",
      kind: "structure",
      changes: [
        { field: "slug", from: "a", to: "b" },
        { field: "title", from: "A", to: "B" },
        { field: "nope", from: "x", to: "y" },
      ],
    });
    expect(row.family).to.equal("structure");
    expect(row.structureLabelKeys).to.deep.equal([
      "opRenamed",
      "opAddressChanged",
    ]);
    expect(row.labelKey).to.equal("opRenamed");
    expect(row.changes.length).to.equal(2);
    expect(revisionMatchesFilter(row, "structure")).to.equal(true);
  });

  it("keeps content rows as they were, defaulting kind", () => {
    const row = describeRevision({ message: "Committed changes" });
    expect(row.kind).to.equal("content");
    expect(row.family).to.equal("content");
    expect(row.changes).to.deep.equal([]);
  });

  it("names each kind of outline change", () => {
    const keys = (changes) =>
      structureLabelKeys(normalizeStructureChanges(changes));
    expect(keys([{ field: "order", from: "1", to: "2" }])).to.deep.equal([
      "opMoved",
    ]);
    expect(
      keys([
        { field: "parent", from: "", to: "A" },
        { field: "order", from: "0", to: "3" },
      ]),
    ).to.deep.equal(["opMoved"]);
    expect(keys([{ field: "published", to: "true" }])).to.deep.equal([
      "opPublished",
    ]);
    expect(keys([{ field: "published", to: "false" }])).to.deep.equal([
      "opUnpublished",
    ]);
    expect(keys([{ field: "hideInMenu", to: "true" }])).to.deep.equal([
      "opHidden",
    ]);
    expect(keys([{ field: "hideInMenu", to: "false" }])).to.deep.equal([
      "opShown",
    ]);
    expect(keys([{ field: "locked", to: "true" }])).to.deep.equal(["opLocked"]);
    expect(keys([{ field: "locked", to: "false" }])).to.deep.equal([
      "opUnlocked",
    ]);
  });

  it("normalizes change values to text and drops junk", () => {
    expect(normalizeStructureChanges(null)).to.deep.equal([]);
    expect(
      normalizeStructureChanges([
        null,
        { field: "order", from: 0, to: 2 },
        { field: "parent", from: null, to: "A", toId: "item-a" },
      ]),
    ).to.deep.equal([
      { field: "order", from: "0", to: "2" },
      { field: "parent", from: "", to: "A", toId: "item-a" },
    ]);
  });

  it("finds content versions around outline rows", () => {
    const list = [
      { kind: "structure" },
      { kind: "content" },
      { kind: "structure" },
      {},
    ];
    expect(currentContentIndex(list)).to.equal(1);
    expect(previousContentIndex(list, 1)).to.equal(3);
    expect(previousContentIndex(list, 3)).to.equal(-1);
    expect(currentContentIndex([{ kind: "structure" }])).to.equal(-1);
  });
});
