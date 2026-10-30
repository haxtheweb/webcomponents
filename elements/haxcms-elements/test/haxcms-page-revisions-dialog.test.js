import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import "../lib/core/haxcms-page-revisions-dialog.js";

// Page history (haxtheweb/issues#3191): a fake backend answers the same
// events haxcms-site-editor does.
const now = Math.floor(Date.now() / 1000);
const REVISIONS = [
  {
    hash: "c3".repeat(20),
    author: "Agent Smith",
    timestamp: now - 60,
    date: new Date((now - 60) * 1000).toISOString(),
    message: "[A:updateContentByIdOrSlug:ab12] Committed changes",
  },
  {
    hash: "b2".repeat(20),
    author: "Bryan",
    timestamp: now - 3600,
    date: new Date((now - 3600) * 1000).toISOString(),
    message: "Page details updated: Intro (item-1)",
  },
  {
    hash: "a1".repeat(20),
    author: "Bryan",
    timestamp: now - 86400 * 3,
    date: new Date((now - 86400 * 3) * 1000).toISOString(),
    message: "edited by hand",
  },
];
const CONTENT = {
  ["c3".repeat(20)]: "<p>The slow brown fox jumps</p>",
  ["b2".repeat(20)]: "<p>The quick brown fox</p>",
  ["a1".repeat(20)]: "<p>The quick fox</p>",
};
const META = {
  ["c3".repeat(20)]: { title: "Intro", metadata: {} },
  ["b2".repeat(20)]: { title: "Intro", metadata: {} },
  ["a1".repeat(20)]: { title: "Welcome", metadata: { published: false } },
};

function fakeBackend() {
  const calls = { list: 0, detail: [], restore: [] };
  const onList = (e) => {
    calls.list++;
    setTimeout(() =>
      globalThis.dispatchEvent(
        new CustomEvent("haxcms-node-revisions-loaded", {
          detail: {
            data: {
              nodeId: e.detail.nodeId,
              nodeTitle: "Intro",
              total: REVISIONS.length,
              revisions: REVISIONS,
            },
          },
        }),
      ),
    );
  };
  const onDetail = (e) => {
    calls.detail.push(e.detail.hash);
    const rev = REVISIONS.find((r) => r.hash === e.detail.hash);
    setTimeout(() =>
      globalThis.dispatchEvent(
        new CustomEvent("haxcms-node-revision-loaded", {
          detail: {
            data: {
              nodeId: e.detail.nodeId,
              revision: rev,
              content: CONTENT[e.detail.hash],
              hasItemMetadata: true,
              itemMetadata: META[e.detail.hash],
            },
          },
        }),
      ),
    );
  };
  const onRestore = (e) => {
    calls.restore.push(e.detail.hash);
  };
  globalThis.addEventListener("haxcms-load-node-revisions", onList);
  globalThis.addEventListener("haxcms-load-node-revision", onDetail);
  globalThis.addEventListener("haxcms-restore-node-revision", onRestore);
  return {
    calls,
    stop() {
      globalThis.removeEventListener("haxcms-load-node-revisions", onList);
      globalThis.removeEventListener("haxcms-load-node-revision", onDetail);
      globalThis.removeEventListener("haxcms-restore-node-revision", onRestore);
    },
  };
}

async function openHistory() {
  const backend = fakeBackend();
  const el = await fixture(html`
    <haxcms-page-revisions-dialog
      style="height: 640px"
      node-id="item-1"
    ></haxcms-page-revisions-dialog>
  `);
  await waitUntil(() => el.revisions.length === 3, "revisions loaded");
  await waitUntil(
    () => el.shadowRoot.querySelector(".diff"),
    "selected version diffed",
  );
  return { el, backend };
}

describe("haxcms-page-revisions-dialog", () => {
  let backend;
  afterEach(() => {
    if (backend) {
      backend.stop();
      backend = null;
    }
  });

  it("lists versions by day with plain labels and who made them", async () => {
    const opened = await openHistory();
    backend = opened.backend;
    const el = opened.el;
    const rows = [...el.shadowRoot.querySelectorAll("button.rev")];
    expect(rows.length).to.equal(3);
    expect(rows[0].querySelector(".what").textContent.trim()).to.equal(
      "Content edit",
    );
    expect(rows[0].textContent).to.contain("AI agent");
    expect(rows[0].textContent).to.contain("Current");
    // legacy wording still gets a label; hand edits are flagged
    expect(rows[1].querySelector(".what").textContent.trim()).to.equal(
      "Page details",
    );
    expect(rows[2].textContent).to.contain("Not labelled");
    expect(el.shadowRoot.querySelector(".day").textContent.trim()).to.equal(
      "Today",
    );
    expect(el.shadowRoot.querySelector(".count").textContent).to.contain(
      "3 saved versions",
    );
  });

  it("filters by kind of change", async () => {
    const opened = await openHistory();
    backend = opened.backend;
    const el = opened.el;
    const chip = el.shadowRoot.querySelector('.chip[data-filter="details"]');
    expect(chip.textContent).to.contain("1");
    chip.click();
    await el.updateComplete;
    expect(chip.getAttribute("aria-pressed")).to.equal("true");
    expect(el.shadowRoot.querySelectorAll("button.rev").length).to.equal(1);
    el.shadowRoot.querySelector('.chip[data-filter="restore"]').click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".empty").textContent).to.contain(
      "No versions match",
    );
  });

  it("shows what a version changed, and how it compares with now", async () => {
    const opened = await openHistory();
    backend = opened.backend;
    const el = opened.el;
    // newest: this change against the one before it
    let diff = el.shadowRoot.querySelector(".diff");
    expect(diff.querySelector("del").textContent).to.contain("quick");
    expect(diff.querySelector("ins").textContent).to.contain("slow");
    expect(
      el.shadowRoot.querySelector('[data-compare="now"]').disabled,
    ).to.equal(true);
    // the oldest is the first version shown so far, with older not needed
    el.shadowRoot.querySelectorAll("button.rev")[2].click();
    await waitUntil(
      () => el.shadowRoot.textContent.includes("first saved version"),
      "oldest version loaded",
    );
    expect(el.shadowRoot.textContent).to.contain("first saved version");
    // compare with now: what a restore would bring back
    el.shadowRoot.querySelector('[data-compare="now"]').click();
    await waitUntil(() =>
      el.shadowRoot.querySelector(".legend").textContent.includes("restore"),
    );
    diff = el.shadowRoot.querySelector(".diff");
    expect(diff.querySelector("ins")).to.exist;
    // page details that differ, with words not only colour
    const row = el.shadowRoot.querySelector('tr[data-field="title"]');
    expect(row.textContent).to.contain("Intro");
    expect(row.textContent).to.contain("Welcome");
    expect(
      el.shadowRoot.querySelector('tr[data-field="published"]').textContent,
    ).to.contain("No");
  });

  it("switches between text, rendered and HTML views", async () => {
    const opened = await openHistory();
    backend = opened.backend;
    const el = opened.el;
    el.shadowRoot.querySelector('[data-view="rendered"]').click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".rendered").textContent).to.contain(
      "slow brown fox",
    );
    el.shadowRoot.querySelector('[data-view="source"]').click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".diff.source").textContent).to.contain(
      "<p>",
    );
    expect(el.shadowRoot.querySelector(".stats").textContent).to.contain(
      "lines",
    );
  });

  it("shows the op code and commit in technical details", async () => {
    const opened = await openHistory();
    backend = opened.backend;
    const el = opened.el;
    const tech = el.shadowRoot.querySelector("details.tech");
    expect(tech.textContent).to.contain("updateContentByIdOrSlug");
    expect(tech.textContent).to.contain("AI agent (A)");
    expect(tech.textContent).to.contain("ab12");
    expect(tech.textContent).to.contain("c3c3c3");
  });

  it("explains a restore before it happens and then sends it", async () => {
    const opened = await openHistory();
    backend = opened.backend;
    const el = opened.el;
    // the current version cannot be restored
    expect(el.shadowRoot.querySelector(".restore-btn").disabled).to.equal(true);
    el.shadowRoot.querySelectorAll("button.rev")[2].click();
    await waitUntil(
      () => el.shadowRoot.textContent.includes("first saved version"),
      "oldest version loaded",
    );
    const restoreBtn = el.shadowRoot.querySelector(".restore-btn");
    expect(restoreBtn.disabled).to.equal(false);
    restoreBtn.click();
    await el.updateComplete;
    const confirm = el.shadowRoot.querySelector(".confirm");
    expect(confirm.getAttribute("role")).to.equal("alertdialog");
    expect(confirm.textContent).to.contain("undoes 2 later changes");
    expect(confirm.textContent).to.contain("title and description");
    expect(confirm.textContent).to.contain("Nothing is deleted");
    expect(confirm.textContent).to.contain("Page revision restored: Intro");
    await expect(el).shadowDom.to.be.accessible();
    // Cancel closes it with nothing sent
    confirm.querySelector(".cancel").click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".confirm")).to.equal(null);
    expect(backend.calls.restore).to.deep.equal([]);
    el.shadowRoot.querySelector(".restore-btn").click();
    await el.updateComplete;
    el.shadowRoot.querySelector(".confirm-restore").click();
    expect(backend.calls.restore).to.deep.equal(["a1".repeat(20)]);
    expect(el.restoring).to.be.true;
    // a failed restore says so and keeps the prompt
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-node-revision-restore-failed", {
        detail: { nodeId: "item-1" },
      }),
    );
    await el.updateComplete;
    expect(el.restoring).to.be.false;
    expect(
      el.shadowRoot.querySelector(".confirm .error").textContent,
    ).to.contain("could not be restored");
    // success reloads the list and closes the prompt
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-node-revision-restored", {
        detail: { data: { nodeId: "item-1" } },
      }),
    );
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".confirm")).to.equal(null);
    await waitUntil(() => backend.calls.list === 2, "list reloaded");
  });

  it("names the page in the dialog header when in the shell", async () => {
    backend = fakeBackend();
    const el = document.createElement("haxcms-page-revisions-dialog");
    const states = [];
    el.addEventListener("haxcms-admin-section-state", (e) =>
      states.push(e.detail),
    );
    el.inShell = true;
    el.nodeId = "item-1";
    const host = await fixture(html`<div style="height: 600px"></div>`);
    host.appendChild(el);
    await waitUntil(() => el.revisions.length === 3);
    await el.updateComplete;
    const last = states[states.length - 1];
    expect(last.headerText.title).to.equal("Page history: Intro");
  });

  it("is accessible", async () => {
    const opened = await openHistory();
    backend = opened.backend;
    await expect(opened.el).shadowDom.to.be.accessible();
  });
});

describe("haxcms-page-revisions-dialog order", () => {
  it("keeps git's order even when a date is out of step", async () => {
    const el = await fixture(html`
      <haxcms-page-revisions-dialog></haxcms-page-revisions-dialog>
    `);
    el.nodeId = "item-9";
    await el.updateComplete;
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-node-revisions-loaded", {
        detail: {
          data: {
            nodeId: "item-9",
            total: 2,
            revisions: [
              { hash: "bb".repeat(20), timestamp: 100, message: "newer" },
              { hash: "aa".repeat(20), timestamp: 999999, message: "older" },
            ],
          },
        },
      }),
    );
    await el.updateComplete;
    expect(el.revisions.map((r) => r.message)).to.deep.equal([
      "newer",
      "older",
    ]);
  });
});
