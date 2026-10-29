// Content as a "selection" section of the one admin dialog
// (haxtheweb/issues#3180): find / replace across pages is its action,
// run from the shell's action bar through runAction("replace").
import { fixture, expect, html, oneEvent, waitUntil } from "@open-wc/testing";
import "../lib/core/admin/haxcms-site-admin.js";
import "../lib/core/haxcms-content-admin-dialog.js";

const ITEMS = [
  {
    id: "item-1",
    title: "Welcome",
    slug: "welcome",
    parent: null,
    metadata: { published: true, updated: 1700000000, tags: ["intro"] },
  },
  {
    id: "item-2",
    title: "Cell membrane",
    slug: "cell-membrane",
    parent: "item-1",
    metadata: { published: false, updated: 1700000100, hideInMenu: true },
  },
];

async function contentSection(inShell = true) {
  const el = document.createElement("haxcms-content-admin-dialog");
  el.inShell = inShell;
  const host = await fixture(html`<div></div>`);
  host.appendChild(el);
  await el.updateComplete;
  el.rows = el._buildRows(JSON.parse(JSON.stringify(ITEMS)));
  await el.updateComplete;
  return el;
}

// a replace-ready state: mode replace, "membrane" searched and matched
async function readyToReplace(el, replacement) {
  el._onFilterField({ detail: { value: "search" } });
  el._onOperationMode({ detail: { value: "replace" } });
  el._onFilterValue({ detail: { value: "membrane" } });
  el._onReplaceValue({ detail: { value: replacement } });
  // let the filter controls render (and settle) before the results arrive
  await el.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 50));
  // the search request is debounced; answer it as the editor would
  globalThis.dispatchEvent(
    new CustomEvent("haxcms-content-dashboard-search-results", {
      detail: { query: "membrane", matches: [{ id: "item-2" }] },
    }),
  );
  await el.updateComplete;
}

// the replace detail the old Replace button fired, by reading of the code
// before this change (_applyReplace) and confirmed by the first test
const REPLACE_DETAIL = {
  operation: "replace",
  search: "membrane",
  replace: "wall",
  searchMode: "fulltext",
  searchSelector: false,
  searchField: "content",
  searchCaseSensitive: false,
  replaceConfirm: true,
  replaceDestroyConfirm: false,
};

describe("haxcms-content-admin-dialog replace payload", () => {
  let realConfirm, prompts;
  beforeEach(() => {
    realConfirm = globalThis.confirm;
    prompts = [];
    globalThis.confirm = (msg) => {
      prompts.push(msg);
      return true;
    };
  });
  afterEach(() => {
    globalThis.confirm = realConfirm;
  });

  it("the original replace path fires the captured detail", async () => {
    const el = await contentSection(false);
    await readyToReplace(el, "  wall ");
    setTimeout(() => el._applyReplace());
    const e = await oneEvent(el, "haxcms-content-dashboard-operation");
    expect(e.detail).to.deep.equal(REPLACE_DETAIL);
    expect(prompts).to.deep.equal([
      "This bulk replacement cannot be undone. Continue?",
    ]);
  });

  it('runAction("replace") fires the same event and detail', async () => {
    const el = await contentSection();
    await readyToReplace(el, "  wall ");
    setTimeout(() => el.runAction("replace"));
    const e = await oneEvent(el, "haxcms-content-dashboard-operation");
    expect(e.detail).to.deep.equal(REPLACE_DETAIL);
    expect(prompts).to.deep.equal([
      "This bulk replacement cannot be undone. Continue?",
    ]);
  });

  it("an empty replacement still asks twice and flags it", async () => {
    const el = await contentSection();
    await readyToReplace(el, "");
    setTimeout(() => el.runAction("replace"));
    const e = await oneEvent(el, "haxcms-content-dashboard-operation");
    expect(e.detail).to.deep.equal(
      Object.assign({}, REPLACE_DETAIL, {
        replace: "",
        replaceDestroyConfirm: true,
      }),
    );
    expect(prompts.length).to.equal(2);
    expect(prompts[1]).to.contain("remove all matches");
  });

  it("cancelling the confirm sends nothing", async () => {
    const el = await contentSection();
    await readyToReplace(el, "wall");
    globalThis.confirm = (msg) => {
      prompts.push(msg);
      return false;
    };
    let sent = 0;
    el.addEventListener("haxcms-content-dashboard-operation", () => {
      sent++;
    });
    el.runAction("replace");
    expect(sent).to.equal(0);
    expect(prompts.length).to.equal(1);
  });

  it("the search request detail is unchanged", async () => {
    const el = await contentSection();
    el._onFilterValue({ detail: { value: "membrane" } });
    setTimeout(() => el._applySearch());
    const e = await oneEvent(el, "haxcms-content-dashboard-operation");
    expect(e.detail).to.deep.equal({
      operation: "search",
      search: "membrane",
      searchMode: "fulltext",
      searchSelector: false,
      searchField: "all",
      searchLimit: 25,
      searchCaseSensitive: false,
    });
  });
});

describe("haxcms-content-admin-dialog section state", () => {
  let realConfirm;
  beforeEach(() => {
    realConfirm = globalThis.confirm;
    globalThis.confirm = () => true;
  });
  afterEach(() => {
    globalThis.confirm = realConfirm;
  });

  it("offers no action while searching", async () => {
    const el = await contentSection();
    setTimeout(() => el._onFilterValue({ detail: { value: "cell" } }));
    const e = await oneEvent(el, "haxcms-admin-section-state");
    expect(e.detail).to.deep.equal({
      selected: 0,
      selectionText: "",
      actions: [],
    });
  });

  it("reports matched pages and Replace in Search and replace mode", async () => {
    const el = await contentSection();
    await readyToReplace(el, "wall");
    const e = await new Promise((resolve) => {
      el.addEventListener("haxcms-admin-section-state", resolve, {
        once: true,
      });
      el.replaceValue = "walls";
    });
    expect(e.detail.selected).to.equal(1);
    expect(e.detail.actions).to.deep.equal([
      {
        id: "replace",
        label: "Replace",
        icon: "",
        danger: true,
        disabled: false,
      },
    ]);
    // a one-letter replacement is rejected, as the old button was disabled
    el._onReplaceValue({ detail: { value: "w" } });
    expect(el.selectionActions[0].disabled).to.equal(true);
  });

  it("clearSelection clears the text to find and its matches", async () => {
    const el = await contentSection();
    await readyToReplace(el, "wall");
    el.clearSelection();
    await el.updateComplete;
    expect(el.filterValue).to.equal("");
    expect(el.replaceValue).to.equal("");
    expect(el.searchMatches).to.equal(null);
    expect(el._searchMatchCount()).to.equal(0);
    expect(el.operationMode).to.equal("replace");
  });

  it("drops its Replace button in the shell and keeps it standalone", async () => {
    const inShell = await contentSection(true);
    await readyToReplace(inShell, "wall");
    expect(inShell.shadowRoot.querySelector(".replace-btn")).to.not.exist;
    expect(inShell.shadowRoot.querySelector(".filters-title")).to.not.exist;
    const standalone = await contentSection(false);
    await readyToReplace(standalone, "wall");
    const button = standalone.shadowRoot.querySelector(".replace-btn");
    expect(button).to.exist;
    expect(button.disabled).to.equal(false);
    expect(standalone.shadowRoot.querySelector(".filters-title")).to.exist;
  });

  it("the filter controls drive the same state", async () => {
    const el = await contentSection();
    const field = el.shadowRoot.querySelector('select[name="filter-field"]');
    field.value = "visibility";
    field.dispatchEvent(new Event("change"));
    expect(el.filterField).to.equal("visibility");
    expect(el.filterValue).to.equal("any");
    await el.updateComplete;
    const value = el.shadowRoot.querySelector('select[name="filter-value"]');
    value.value = "not-visible";
    value.dispatchEvent(new Event("change"));
    await el.updateComplete;
    expect(el.filteredRows.map((r) => r.id)).to.deep.equal(["item-2"]);
  });

  it("page revisions still open from the row", async () => {
    const el = await contentSection();
    await waitUntil(() => {
      const table = el.shadowRoot.querySelector("editable-table-display");
      return table && table.querySelector('[data-action="open-revisions"]');
    }, "revisions buttons rendered");
    const button = el.shadowRoot
      .querySelector("editable-table-display")
      .querySelector('[data-node-id="item-2"]');
    setTimeout(() =>
      el._handleTableActionClick({
        composedPath: () => [button],
        stopPropagation() {},
      }),
    );
    const e = await oneEvent(globalThis, "haxcms-open-page-revisions");
    expect(e.detail.nodeId).to.equal("item-2");
    expect(e.detail.nodeTitle).to.equal("Cell membrane");
    expect(e.detail.source).to.equal("content-admin-dialog");
  });
});

describe("haxcms-content-admin-dialog in haxcms-site-admin", () => {
  let realConfirm;
  beforeEach(() => {
    realConfirm = globalThis.confirm;
    globalThis.confirm = () => true;
  });
  afterEach(() => {
    globalThis.confirm = realConfirm;
  });

  it("the shell's Replace runs the section's replace", async () => {
    const shell = await fixture(
      html`<haxcms-site-admin
        style="--simple-modal-height: 720px"
      ></haxcms-site-admin>`,
    );
    shell.allowRoute = () => true;
    shell.route = "content";
    await waitUntil(() => shell._sectionEl, "section element created");
    const el = shell._sectionEl;
    expect(el.inShell).to.equal(true);
    el.rows = el._buildRows(JSON.parse(JSON.stringify(ITEMS)));
    await readyToReplace(el, "  wall ");
    await shell.updateComplete;
    const bar = shell.shadowRoot.querySelector(".ftr.selection");
    expect(bar.textContent).to.contain("1 page matches");
    const replace = bar.querySelector('[data-action="replace"]');
    expect(replace.disabled).to.equal(false);
    expect(replace.classList.contains("danger")).to.equal(true);
    setTimeout(() => replace.click());
    const e = await oneEvent(el, "haxcms-content-dashboard-operation");
    expect(e.detail).to.deep.equal(REPLACE_DETAIL);
  });
});
