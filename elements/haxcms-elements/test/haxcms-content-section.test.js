// Content in the one admin layout (haxtheweb/issues#3180): the toolbar
// finds, the selector column checks pages, the shell's action bar runs
// Replace…, Publish, Unpublish, Show / Hide in menu and Delete… on them,
// and the detail panel shows the focused page.
import { fixture, expect, html, oneEvent, waitUntil } from "@open-wc/testing";
import { sendKeys } from "@web/test-runner-commands";
import { store } from "../lib/core/haxcms-site-store.js";
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

const THREE = ITEMS.concat([
  {
    id: "item-3",
    title: "Nucleus",
    slug: "nucleus",
    parent: "item-1",
    metadata: { published: true, updated: 1699999000, locked: true },
  },
]);

async function contentSection(inShell = true, items = ITEMS) {
  const el = document.createElement("haxcms-content-admin-dialog");
  el.inShell = inShell;
  // wide enough for the detail panel
  const host = await fixture(html`<div style="width: 1200px"></div>`);
  host.appendChild(el);
  await el.updateComplete;
  el.rows = el._buildRows(JSON.parse(JSON.stringify(items)));
  await el.updateComplete;
  return el;
}

// "membrane" searched and matched, its match checked, a replacement typed
async function readyToReplace(el, replacement) {
  el._onFilterField({ detail: { value: "search" } });
  el._onFilterValue({ detail: { value: "membrane" } });
  el._onReplaceValue({ detail: { value: replacement } });
  await el.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 50));
  // the search request is debounced; answer it as the editor would
  globalThis.dispatchEvent(
    new CustomEvent("haxcms-content-dashboard-search-results", {
      detail: { query: "membrane", matches: [{ id: "item-2" }] },
    }),
  );
  await el.updateComplete;
  el._toggleAllPages(true);
  await el.updateComplete;
}

// "ce" searched with two matches, both checked
async function readyToMultiReplace(el, replacement) {
  el._onFilterField({ detail: { value: "search" } });
  el._onFilterValue({ detail: { value: "ce" } });
  el._onReplaceValue({ detail: { value: replacement } });
  await el.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 50));
  globalThis.dispatchEvent(
    new CustomEvent("haxcms-content-dashboard-search-results", {
      detail: { query: "ce", matches: [{ id: "item-1" }, { id: "item-2" }] },
    }),
  );
  await el.updateComplete;
  el._toggleAllPages(true);
  await el.updateComplete;
}

// Replace… from the bar, then the chooser's Replace
async function replaceThroughChooser(el) {
  el.runAction("replace");
  await el.updateComplete;
  const apply = el.shadowRoot.querySelector(".choice .choice-apply");
  expect(apply, "chooser Replace").to.exist;
  apply.click();
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

const rowBox = (el, id) =>
  el.shadowRoot.querySelector(`input.select-page[data-node-id="${id}"]`);

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

  it("Replace… opens a chooser and sends the captured detail", async () => {
    const el = await contentSection();
    await readyToReplace(el, "  wall ");
    el.runAction("replace");
    await el.updateComplete;
    const choice = el.shadowRoot.querySelector(".choice");
    expect(choice).to.exist;
    expect(choice.textContent).to.contain("Replace in 1 checked page");
    // the toolbar's search is the text to find, shown and not editable
    const find = choice.querySelector('input[name="replace-find"]');
    expect(find.value).to.equal("membrane");
    expect(find.readOnly).to.equal(true);
    expect(choice.textContent).to.contain("cannot be undone");
    setTimeout(() => choice.querySelector(".choice-apply").click());
    const e = await oneEvent(el, "haxcms-content-dashboard-operation");
    expect(e.detail).to.deep.equal(REPLACE_DETAIL);
    expect(prompts).to.deep.equal([
      "This bulk replacement cannot be undone. Continue?",
    ]);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".choice")).to.not.exist;
  });

  it("without a search the chooser asks for the text to find", async () => {
    const el = await contentSection();
    el._togglePage("item-1", true);
    el.runAction("replace");
    await el.updateComplete;
    const find = el.shadowRoot.querySelector('input[name="replace-find"]');
    expect(find.readOnly).to.equal(false);
    const apply = el.shadowRoot.querySelector(".choice-apply");
    expect(apply.disabled).to.equal(true);
    find.value = "Welcome";
    find.dispatchEvent(new Event("input"));
    const replace = el.shadowRoot.querySelector('input[name="replace-value"]');
    replace.value = "Hello";
    replace.dispatchEvent(new Event("input"));
    await el.updateComplete;
    expect(apply.disabled).to.equal(false);
    setTimeout(() => apply.click());
    const e = await oneEvent(el, "haxcms-content-dashboard-operation");
    expect(e.detail).to.deep.equal(
      Object.assign({}, REPLACE_DETAIL, {
        search: "Welcome",
        replace: "Hello",
        nodeIds: ["item-1"],
      }),
    );
  });

  it("an empty replacement still asks twice and flags it", async () => {
    const el = await contentSection();
    await readyToReplace(el, "");
    setTimeout(() => replaceThroughChooser(el));
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
    await replaceThroughChooser(el);
    expect(sent).to.equal(0);
    expect(prompts.length).to.equal(1);
  });

  it("Escape closes the chooser", async () => {
    const el = await contentSection();
    await readyToReplace(el, "wall");
    el.runAction("replace");
    await el.updateComplete;
    el.shadowRoot
      .querySelector(".choice")
      .dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".choice")).to.not.exist;
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

  it("reports the checked pages and every bulk action", async () => {
    const el = await contentSection();
    setTimeout(() => el._togglePage("item-2", true));
    const e = await oneEvent(el, "haxcms-admin-section-state");
    expect(e.detail.selected).to.equal(1);
    expect(e.detail.selectionText).to.equal("1 selected");
    expect(e.detail.actions.map((a) => a.id)).to.deep.equal([
      "replace",
      "publish",
      "unpublish",
      "show",
      "hide",
      "delete",
    ]);
    expect(e.detail.actions.map((a) => a.label)).to.deep.equal([
      "Replace…",
      "Publish",
      "Unpublish",
      "Show in menu",
      "Hide in menu",
      "Delete…",
    ]);
    expect(
      e.detail.actions.filter((a) => a.danger).map((a) => a.id),
    ).to.deep.equal(["delete"]);
  });

  it("a search does not change what is checked", async () => {
    const el = await contentSection();
    el._togglePage("item-1", true);
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-content-dashboard-search-results", {
        detail: { query: "", matches: [{ id: "item-2" }] },
      }),
    );
    await el.updateComplete;
    expect(el._checkedIds).to.deep.equal(["item-1"]);
  });

  it("clearSelection unchecks every page and keeps the search", async () => {
    const el = await contentSection();
    await readyToMultiReplace(el, "wall");
    el.clearSelection();
    await el.updateComplete;
    expect(el._checkedIds).to.deep.equal([]);
    expect(el.filterValue).to.equal("ce");
    expect(el.searchMatches).to.deep.equal(["item-1", "item-2"]);
    const boxes = [
      ...el.shadowRoot.querySelectorAll("input.select-page, input.select-all"),
    ];
    expect(boxes.length).to.equal(3);
    boxes.forEach((box) => expect(box.checked).to.equal(false));
  });

  it("draws its own action bar only outside the shell", async () => {
    const inShell = await contentSection(true);
    expect(inShell.shadowRoot.querySelector(".local-bar")).to.not.exist;
    expect(inShell.shadowRoot.querySelector(".filters-title")).to.not.exist;
    const standalone = await contentSection(false);
    const bar = standalone.shadowRoot.querySelector(".local-bar");
    expect(bar).to.exist;
    expect(bar.querySelector('[data-action="replace"]').disabled).to.equal(
      true,
    );
    standalone._togglePage("item-1", true);
    await standalone.updateComplete;
    expect(bar.querySelector('[data-action="replace"]').disabled).to.equal(
      false,
    );
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
    await waitUntil(
      () =>
        el.shadowRoot.querySelector(
          'table.pages [data-action="open-revisions"]',
        ),
      "revisions buttons rendered",
    );
    const button = el.shadowRoot.querySelector(
      'table.pages [data-action="open-revisions"][data-node-id="item-2"]',
    );
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
    // clicking the row button sends the same detail
    setTimeout(() => button.click());
    const clicked = await oneEvent(globalThis, "haxcms-open-page-revisions");
    expect(Object.keys(clicked.detail).sort()).to.deep.equal([
      "invokedBy",
      "nodeId",
      "nodeTitle",
      "source",
    ]);
    expect(clicked.detail.nodeId).to.equal("item-2");
    expect(clicked.detail.nodeTitle).to.equal("Cell membrane");
    expect(clicked.detail.source).to.equal("content-admin-dialog");
    expect(clicked.detail.invokedBy).to.equal(button);
    expect(button.getAttribute("aria-label")).to.equal(
      "View revisions of Cell membrane",
    );
    expect(button.getAttribute("title")).to.equal("View page revisions");
  });
});

describe("haxcms-content-admin-dialog layout", () => {
  let realConfirm;
  beforeEach(() => {
    realConfirm = globalThis.confirm;
    globalThis.confirm = () => true;
  });
  afterEach(() => {
    globalThis.confirm = realConfirm;
  });

  const titles = (el) =>
    [...el.shadowRoot.querySelectorAll("table.pages tbody .title-btn")].map(
      (a) => a.textContent.trim(),
    );

  it("the toolbar only finds: no mode switch and no replace field", async () => {
    const el = await contentSection();
    expect(el.shadowRoot.querySelector(".filters .hax-ui-seg")).to.not.exist;
    expect(el.shadowRoot.querySelector('.filters input[name="replace-value"]'))
      .to.not.exist;
    expect(el.shadowRoot.querySelector('input[name="filter-value"]')).to.exist;
    const searchType = el.shadowRoot.querySelector(
      'select[name="search-mode"]',
    );
    expect([...searchType.options].map((o) => o.value)).to.deep.equal([
      "fulltext",
      "selector",
    ]);
  });

  it("case sensitive is a switch on the same state", async () => {
    const el = await contentSection();
    const toggle = el.shadowRoot.querySelector('.toggle[role="switch"]');
    expect(toggle.getAttribute("aria-checked")).to.equal("false");
    toggle.click();
    await el.updateComplete;
    expect(el.searchCaseSensitive).to.equal(true);
    expect(toggle.getAttribute("aria-checked")).to.equal("true");
  });

  it("sorts by Updated, newest first, and cycles a column's sort", async () => {
    const el = await contentSection();
    expect(titles(el)).to.deep.equal(["Cell membrane", "Welcome"]);
    const updatedTh = el.shadowRoot.querySelector("th.updated");
    expect(updatedTh.getAttribute("aria-sort")).to.equal("descending");
    const sortTitle = () =>
      el.shadowRoot.querySelector('button.sort[data-sort="title"]').click();
    sortTitle();
    await el.updateComplete;
    const titleTh = el.shadowRoot.querySelector("th.title");
    expect(titleTh.getAttribute("aria-sort")).to.equal("ascending");
    expect(updatedTh.hasAttribute("aria-sort")).to.equal(false);
    expect(titles(el)).to.deep.equal(["Cell membrane", "Welcome"]);
    sortTitle();
    await el.updateComplete;
    expect(titleTh.getAttribute("aria-sort")).to.equal("descending");
    expect(titles(el)).to.deep.equal(["Welcome", "Cell membrane"]);
    sortTitle();
    await el.updateComplete;
    expect(titleTh.hasAttribute("aria-sort")).to.equal(false);
    // site order
    expect(titles(el)).to.deep.equal(["Welcome", "Cell membrane"]);
  });

  it("sorts every filtered page before paging", async () => {
    const el = await contentSection();
    el.pageLimit = 1;
    await el.updateComplete;
    expect(titles(el)).to.deep.equal(["Cell membrane"]);
    expect(el.shadowRoot.querySelector(".paging .range").textContent).to.equal(
      "1–1 of 2",
    );
    el.shadowRoot.querySelector(".page-next").click();
    await el.updateComplete;
    expect(el.pageOffset).to.equal(1);
    expect(titles(el)).to.deep.equal(["Welcome"]);
    expect(el.shadowRoot.querySelector(".page-next").disabled).to.equal(true);
    // a new sort starts again on the first page
    el.shadowRoot.querySelector('button.sort[data-sort="slug"]').click();
    await el.updateComplete;
    expect(el.pageOffset).to.equal(0);
    expect(titles(el)).to.deep.equal(["Cell membrane"]);
  });

  it("status is a pill, a hidden page says so, updated carries the full date", async () => {
    const el = await contentSection();
    const pills = [
      ...el.shadowRoot.querySelectorAll("table.pages td.status .hax-ui-pill"),
    ];
    expect(pills.map((p) => p.textContent.trim())).to.deep.equal([
      "Unpublished",
      "Hidden in menu",
      "Published",
    ]);
    expect(pills[2].getAttribute("data-tone")).to.equal("success");
    const time = el.shadowRoot.querySelector("table.pages td.updated time");
    expect(time.getAttribute("datetime")).to.equal(
      new Date(1700000100 * 1000).toISOString(),
    );
    expect(time.getAttribute("title")).to.not.equal("");
  });

  it("summarises the pages and the matches", async () => {
    const el = await contentSection();
    const meta = () =>
      el.shadowRoot.querySelector(".summary .meta").textContent.trim();
    expect(meta()).to.equal("2 pages");
    el._onFilterField({ detail: { value: "visibility" } });
    el._onFilterValue({ detail: { value: "published" } });
    await el.updateComplete;
    expect(meta()).to.equal("1 of 2 pages");
    await readyToMultiReplace(el, "wall");
    expect(meta()).to.equal("2 pages match");
  });

  it("shows a positive empty state when nothing matches", async () => {
    const el = await contentSection();
    el._onFilterField({ detail: { value: "tags" } });
    el._onFilterValue({ detail: { value: "zzz" } });
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("table.pages")).to.not.exist;
    const empty = el.shadowRoot.querySelector(".empty");
    expect(empty.textContent).to.contain("Nothing matches “zzz” yet");
    el.rows = [];
    el._onFilterValue({ detail: { value: "" } });
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".empty").textContent).to.contain(
      "Pages you add show up here",
    );
  });

  it("shows loading, then an error with a retry that sends the same search", async () => {
    const el = await contentSection();
    el._onFilterValue({ detail: { value: "qqq" } });
    setTimeout(() => el._applySearch());
    const first = await oneEvent(el, "haxcms-content-dashboard-operation");
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".empty.loading")).to.exist;
    expect(
      el.shadowRoot.querySelector(".summary .meta").textContent.trim(),
    ).to.equal("Searching…");
    // what haxcms-site-editor fires when the request got no response
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-content-dashboard-search", {
        detail: first.detail,
      }),
    );
    await el.updateComplete;
    expect(el.searchLoading).to.equal(false);
    const error = el.shadowRoot.querySelector(".empty.error");
    expect(error).to.exist;
    setTimeout(() => error.querySelector(".retry").click());
    const again = await oneEvent(el, "haxcms-content-dashboard-operation");
    expect(again.detail).to.deep.equal(first.detail);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".empty.error")).to.not.exist;
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

  it("the shell's Replace… opens the chooser that sends the replace", async () => {
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
    expect(bar.textContent).to.contain("1 selected");
    const ids = [...bar.querySelectorAll("[data-action]")].map((b) =>
      b.getAttribute("data-action"),
    );
    expect(ids).to.include.members([
      "replace",
      "publish",
      "unpublish",
      "show",
      "hide",
      "delete",
    ]);
    bar.querySelector('[data-action="replace"]').click();
    await el.updateComplete;
    setTimeout(() =>
      el.shadowRoot.querySelector(".choice .choice-apply").click(),
    );
    const e = await oneEvent(el, "haxcms-content-dashboard-operation");
    expect(e.detail).to.deep.equal(REPLACE_DETAIL);
  });
});

describe("haxcms-content-admin-dialog selector column", () => {
  let realConfirm;
  beforeEach(() => {
    realConfirm = globalThis.confirm;
    globalThis.confirm = () => true;
  });
  afterEach(() => {
    globalThis.confirm = realConfirm;
  });

  const MULTI_DETAIL = Object.assign({}, REPLACE_DETAIL, { search: "ce" });

  it("every row has a labelled checkbox, before any search", async () => {
    const el = await contentSection();
    const one = rowBox(el, "item-1");
    const two = rowBox(el, "item-2");
    expect(one.checked).to.equal(false);
    expect(one.getAttribute("aria-label")).to.equal("Select Welcome");
    expect(two.getAttribute("aria-label")).to.equal("Select Cell membrane");
    const all = el.shadowRoot.querySelector("input.select-all");
    expect(all.getAttribute("aria-label")).to.equal(
      "Select all matching pages",
    );
    one.click();
    await el.updateComplete;
    expect(el._checkedIds).to.deep.equal(["item-1"]);
    expect(all.indeterminate).to.equal(true);
  });

  it("every match checked sends the old detail with no nodeIds", async () => {
    const el = await contentSection();
    await readyToMultiReplace(el, "wall");
    setTimeout(() => replaceThroughChooser(el));
    const e = await oneEvent(el, "haxcms-content-dashboard-operation");
    expect(e.detail).to.deep.equal(MULTI_DETAIL);
    expect("nodeIds" in e.detail).to.equal(false);
  });

  it("a subset adds nodeIds and the bar counts it", async () => {
    const el = await contentSection();
    await readyToMultiReplace(el, "wall");
    const state = new Promise((resolve) => {
      el.addEventListener("haxcms-admin-section-state", resolve, {
        once: true,
      });
    });
    rowBox(el, "item-1").click();
    const e = await state;
    expect(e.detail.selected).to.equal(1);
    await el.updateComplete;
    const all = el.shadowRoot.querySelector("input.select-all");
    expect(all.checked).to.equal(false);
    expect(all.indeterminate).to.equal(true);
    setTimeout(() => replaceThroughChooser(el));
    const op = await oneEvent(el, "haxcms-content-dashboard-operation");
    expect(op.detail).to.deep.equal(
      Object.assign({}, MULTI_DETAIL, { nodeIds: ["item-2"] }),
    );
  });

  it("select all checks every shown page, and again unchecks them", async () => {
    const el = await contentSection();
    const all = el.shadowRoot.querySelector("input.select-all");
    all.click();
    await el.updateComplete;
    expect([...el._checkedIds].sort()).to.deep.equal(["item-1", "item-2"]);
    all.click();
    await el.updateComplete;
    expect(el._checkedIds).to.deep.equal([]);
  });

  it("checked pages stay checked when the filter hides them", async () => {
    const el = await contentSection();
    rowBox(el, "item-2").click();
    el._onFilterField({ detail: { value: "visibility" } });
    el._onFilterValue({ detail: { value: "published" } });
    await el.updateComplete;
    expect(rowBox(el, "item-2")).to.not.exist;
    expect(el._checkedIds).to.deep.equal(["item-2"]);
  });

  it("Shift+click checks the range", async () => {
    const el = await contentSection(true, THREE);
    // newest first: Cell membrane, Welcome, Nucleus
    const boxes = () => [
      ...el.shadowRoot.querySelectorAll("tbody input.select-page"),
    ];
    boxes()[0].click();
    await el.updateComplete;
    boxes()[2].dispatchEvent(
      new MouseEvent("click", { bubbles: true, shiftKey: true }),
    );
    await el.updateComplete;
    expect([...el._checkedIds].sort()).to.deep.equal([
      "item-1",
      "item-2",
      "item-3",
    ]);
  });

  it("Replace… with nothing checked does nothing", async () => {
    const el = await contentSection();
    el.runAction("replace");
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".choice")).to.not.exist;
  });

  it("checkboxes toggle with Space", async () => {
    const el = await contentSection();
    const box = rowBox(el, "item-2");
    box.focus();
    await sendKeys({ press: "Space" });
    await el.updateComplete;
    expect(el._checkedIds).to.deep.equal(["item-2"]);
    expect(el.shadowRoot.activeElement).to.equal(rowBox(el, "item-2"));
  });

  it("arrows move between rows, Shift+arrows check, Ctrl+A and Escape", async () => {
    const el = await contentSection(true, THREE);
    const titleBtns = () => [
      ...el.shadowRoot.querySelectorAll("tbody .title-btn"),
    ];
    titleBtns()[0].focus();
    await el.updateComplete;
    expect(el._focusId).to.equal("item-2");
    await sendKeys({ press: "ArrowDown" });
    await el.updateComplete;
    expect(el.shadowRoot.activeElement).to.equal(titleBtns()[1]);
    expect(el._focusId).to.equal("item-1");
    await sendKeys({ press: "Shift+ArrowDown" });
    await el.updateComplete;
    expect([...el._checkedIds].sort()).to.deep.equal(["item-1", "item-3"]);
    await sendKeys({ press: "Space" });
    await el.updateComplete;
    expect(el._checkedIds).to.deep.equal(["item-1"]);
    await sendKeys({ press: "Control+a" });
    await el.updateComplete;
    expect(el._checkedIds.length).to.equal(3);
    await sendKeys({ press: "Escape" });
    await el.updateComplete;
    expect(el._checkedIds).to.deep.equal([]);
  });
});

describe("haxcms-content-admin-dialog bulk page actions", () => {
  let realConfirm, realFind, realToast, prompts, toasts, sent, manifest;
  // the editor's handling, as the store sees it: each save lands in the
  // manifest a moment later
  const onDetails = (e) => {
    sent.push(["haxcms-save-node-details", e.detail]);
    setTimeout(() => {
      const item = manifest[e.detail.id];
      if (e.detail.operation === "setPublished") {
        item.metadata.published = e.detail.published;
      } else if (e.detail.operation === "setHideInMenu") {
        item.metadata.hideInMenu = e.detail.hideInMenu;
      }
    }, 20);
  };
  const onDelete = (e) => {
    sent.push(["haxcms-delete-node", e.detail]);
    setTimeout(() => {
      delete manifest[e.detail.item.id];
    }, 20);
  };
  beforeEach(() => {
    sent = [];
    prompts = [];
    toasts = [];
    manifest = {};
    JSON.parse(JSON.stringify(THREE)).forEach((item) => {
      manifest[item.id] = item;
    });
    realConfirm = globalThis.confirm;
    realFind = store.findItem;
    realToast = store.toast;
    globalThis.confirm = (msg) => {
      prompts.push(msg);
      return true;
    };
    store.findItem = (id) => manifest[id] || null;
    store.toast = (msg, time, opts) => toasts.push([msg, opts]);
    globalThis.addEventListener("haxcms-save-node-details", onDetails);
    globalThis.addEventListener("haxcms-delete-node", onDelete);
  });
  afterEach(() => {
    globalThis.confirm = realConfirm;
    store.findItem = realFind;
    store.toast = realToast;
    globalThis.removeEventListener("haxcms-save-node-details", onDetails);
    globalThis.removeEventListener("haxcms-delete-node", onDelete);
  });

  it("Publish saves each unpublished checked page in turn and skips locked", async () => {
    const el = await contentSection(true, THREE);
    el._checkedIds = ["item-1", "item-2", "item-3"];
    await el._runDetailsBatch("publish");
    // item-1 is already published; item-3 is locked
    expect(sent).to.deep.equal([
      [
        "haxcms-save-node-details",
        { id: "item-2", operation: "setPublished", published: true },
      ],
    ]);
    expect(toasts[0][0]).to.equal(
      "Published 1 pages. Skipped locked: Nucleus.",
    );
    expect(el._busyText).to.equal("");
  });

  it("Unpublish, Show in menu and Hide in menu send the editor's operations", async () => {
    const el = await contentSection(true, THREE);
    el._checkedIds = ["item-1", "item-2"];
    await el._runDetailsBatch("unpublish");
    await el._runDetailsBatch("show");
    await el._runDetailsBatch("hide");
    // in table order (newest first), only pages not already that way
    expect(sent.map((s) => s[1])).to.deep.equal([
      { id: "item-1", operation: "setPublished", published: false },
      { id: "item-2", operation: "setHideInMenu", hideInMenu: false },
      { id: "item-2", operation: "setHideInMenu", hideInMenu: true },
      { id: "item-1", operation: "setHideInMenu", hideInMenu: true },
    ]);
  });

  it("runs one page at a time, waiting for each to land", async () => {
    const el = await contentSection(true, THREE);
    el._checkedIds = ["item-1", "item-2"];
    manifest["item-2"].metadata.hideInMenu = false;
    const order = [];
    const watch = (e) => {
      order.push([e.detail.id, manifest["item-2"].metadata.hideInMenu]);
    };
    globalThis.addEventListener("haxcms-save-node-details", watch);
    await el._runDetailsBatch("hide");
    globalThis.removeEventListener("haxcms-save-node-details", watch);
    // the second request went out after the first had landed
    expect(order).to.deep.equal([
      ["item-2", false],
      ["item-1", true],
    ]);
    expect(manifest["item-1"].metadata.hideInMenu).to.equal(true);
  });

  it("stops when a change never comes back and says where", async () => {
    const el = await contentSection(true, THREE);
    el._checkedIds = ["item-1", "item-2"];
    globalThis.removeEventListener("haxcms-save-node-details", onDetails);
    const realWait = el._waitFor;
    el._waitFor = (test) => realWait.call(el, test, 100);
    await el._runDetailsBatch("hide");
    // Cell membrane is already hidden, so Welcome is the first sent
    expect(toasts[0][0]).to.contain("Stopped at “Welcome”");
    expect(toasts[0][1].tone).to.equal("danger");
  });

  it("Delete… asks once, then deletes each page in turn", async () => {
    const el = await contentSection(true, THREE);
    el._checkedIds = ["item-1", "item-2", "item-3"];
    await el._runDeleteBatch();
    expect(prompts).to.deep.equal([
      "Delete 2 selected pages? This cannot be undone.",
    ]);
    expect(sent).to.deep.equal([
      ["haxcms-delete-node", { item: { id: "item-2" }, keepOpen: true }],
      ["haxcms-delete-node", { item: { id: "item-1" }, keepOpen: true }],
    ]);
    expect(toasts[0][0]).to.equal("Deleted 2 pages. Skipped locked: Nucleus.");
  });

  it("cancelling Delete… sends nothing", async () => {
    const el = await contentSection(true, THREE);
    el._checkedIds = ["item-2"];
    globalThis.confirm = (msg) => {
      prompts.push(msg);
      return false;
    };
    await el._runDeleteBatch();
    expect(prompts).to.deep.equal([
      "Delete “Cell membrane”? This cannot be undone.",
    ]);
    expect(sent).to.deep.equal([]);
  });

  it("spells out checked pages the filter or paging hides", async () => {
    const el = await contentSection(true, THREE);
    el._checkedIds = ["item-1", "item-2", "item-3"];
    await el.updateComplete;
    expect(el._selectionText()).to.equal("3 selected");
    // one page per screen: two of the three checked pages are off it
    el.pageLimit = 1;
    el.pageOffset = 0;
    await el.updateComplete;
    expect(el._selectionText()).to.equal("3 selected · 2 not shown");
    el.pageLimit = 25;
    el._checkedIds = ["item-1"];
    await el.updateComplete;
    expect(el._selectionText()).to.equal("1 selected");
    // a filter that shows only item-2 hides the checked page
    el.filterField = "visibility";
    el.filterValue = "not-visible";
    await el.updateComplete;
    expect(el.pagedRows.map((r) => r.id)).to.deep.equal(["item-2"]);
    expect(el._selectionText()).to.equal("1 selected · 1 not shown");
    el._checkedIds = [];
    await el.updateComplete;
    expect(el._selectionText()).to.equal("");
  });

  it("while a batch runs the actions are disabled and the bar says why", async () => {
    const el = await contentSection(true, THREE);
    el._checkedIds = ["item-2"];
    const states = [];
    el.addEventListener("haxcms-admin-section-state", (e) =>
      states.push(e.detail),
    );
    await el._runDetailsBatch("publish");
    const during = states.find(
      (s) => s.selectionText && s.selectionText.indexOf("Publishing") === 0,
    );
    expect(during.selectionText).to.equal("Publishing 1 of 1…");
    expect(during.actions.every((a) => a.disabled)).to.equal(true);
  });
});

describe("haxcms-content-admin-dialog detail panel", () => {
  let realFetch;
  beforeEach(() => {
    realFetch = globalThis.fetch;
  });
  afterEach(() => {
    globalThis.fetch = realFetch;
  });

  it("a title click shows the page's facts", async () => {
    const el = await contentSection();
    expect(el.shadowRoot.querySelector(".detail-empty")).to.exist;
    el.shadowRoot.querySelector('.title-btn[data-node-id="item-2"]').click();
    await el.updateComplete;
    const detail = el.shadowRoot.querySelector("aside.detail");
    expect(detail.querySelector(".detail-title").textContent.trim()).to.equal(
      "Cell membrane",
    );
    expect(detail.textContent).to.contain("Hidden in menu");
    expect(detail.textContent).to.contain("cell-membrane");
    expect(detail.textContent).to.contain("Welcome");
    expect(detail.querySelector("a.open-page").getAttribute("href")).to.equal(
      "cell-membrane",
    );
    setTimeout(() => detail.querySelector(".detail-revisions").click());
    const e = await oneEvent(globalThis, "haxcms-open-page-revisions");
    expect(e.detail.nodeId).to.equal("item-2");
  });

  it("previews the page content without scripts or handlers", async () => {
    const items = JSON.parse(JSON.stringify(ITEMS));
    items[0].location = "pages/welcome/index.html";
    globalThis.fetch = async () => ({
      ok: true,
      text: async () =>
        '<h2 onclick="bad()">Hello</h2><script>globalThis.__pv = 1;</script><iframe src="x"></iframe><a href="javascript:bad()">x</a>',
    });
    const el = await contentSection(true, items);
    el._focusId = "item-1";
    await waitUntil(
      () => el.shadowRoot.querySelector(".pv-page h2"),
      "preview rendered",
    );
    const page = el.shadowRoot.querySelector(".pv-page");
    expect(page.querySelector("h2").hasAttribute("onclick")).to.equal(false);
    expect(page.querySelector("script")).to.not.exist;
    expect(page.querySelector("iframe")).to.not.exist;
    expect(page.querySelector(".pv-embed")).to.exist;
    expect(page.querySelector("a").hasAttribute("href")).to.equal(false);
    expect(
      el.shadowRoot.querySelector(".pv-frame").hasAttribute("inert"),
    ).to.equal(true);
    expect(globalThis.__pv).to.equal(undefined);
  });

  it("drops script, vbscript and data URLs however they are disguised", async () => {
    const el = await contentSection();
    const clean = el._cleanPreview(
      [
        '<a id="a1" href=" JaVaScRiPt:bad()">1</a>',
        '<a id="a2" href="java\tscript:bad()">2</a>',
        '<a id="a3" href="vbscript:msgbox(1)">3</a>',
        '<a id="a4" href="data:text/html,&lt;script&gt;bad()&lt;/script&gt;">4</a>',
        '<img id="i1" src="data:image/png;base64,iVBORw0KGgo=">',
        '<img id="i2" src="data:image/svg+xml,&lt;svg onload=bad()&gt;">',
        '<object id="o1" data="javascript:bad()"></object>',
        '<form id="f1" action="javascript:bad()"><button formaction="vbscript:x">b</button></form>',
        '<video id="v1" poster="javascript:bad()"></video>',
        '<a id="ok" href="https://haxtheweb.org/">ok</a>',
        '<a id="rel" href="pages/welcome">rel</a>',
      ].join(""),
    );
    const doc = new DOMParser().parseFromString(clean, "text/html");
    const attr = (id, name) => {
      const node = doc.getElementById(id);
      return node ? node.getAttribute(name) : "removed";
    };
    expect(attr("a1", "href")).to.equal(null);
    expect(attr("a2", "href")).to.equal(null);
    expect(attr("a3", "href")).to.equal(null);
    expect(attr("a4", "href")).to.equal(null);
    // an inline picture stays; an svg data URL does not
    expect(attr("i1", "src")).to.contain("data:image/png");
    expect(attr("i2", "src")).to.equal(null);
    expect(attr("o1", "data")).to.equal("removed");
    expect(attr("f1", "action")).to.equal(null);
    expect(doc.querySelector("button").getAttribute("formaction")).to.equal(
      null,
    );
    expect(attr("v1", "poster")).to.equal(null);
    expect(attr("ok", "href")).to.equal("https://haxtheweb.org/");
    expect(attr("rel", "href")).to.equal("pages/welcome");
  });

  it("a narrow section has no detail panel", async () => {
    const el = await contentSection();
    el.compact = true;
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("aside.detail")).to.not.exist;
  });
});

describe("haxcms-site-editor contentDashboardOperation replace body", () => {
  // the editor turns the dialog's detail into the replaceContent body
  async function bodyFor(detail) {
    await import("../lib/core/haxcms-site-editor.js");
    const Editor = globalThis.customElements.get("haxcms-site-editor");
    const calls = [];
    const fake = {
      t: {},
      _siteName: () => "demo",
      _requestJson: async (request) => {
        calls.push(request);
        return null;
      },
      _handleContentSearchResponse() {},
    };
    await Editor.prototype.contentDashboardOperation.call(fake, { detail });
    return calls.length ? calls[0].payload : null;
  }

  const BODY = {
    operation: "replace",
    search: "membrane",
    site: { name: "demo" },
    searchMode: "fulltext",
    searchSelector: false,
    searchField: "content",
    replace: "wall",
    replaceConfirm: true,
  };

  it("the default detail builds the same body, without nodeIds", async () => {
    const body = await bodyFor(REPLACE_DETAIL);
    expect(body).to.deep.equal(BODY);
  });

  it("passes nodeIds through only when present", async () => {
    const body = await bodyFor(
      Object.assign({}, REPLACE_DETAIL, { nodeIds: ["item-2"] }),
    );
    expect(body).to.deep.equal(
      Object.assign({}, BODY, { nodeIds: ["item-2"] }),
    );
  });

  it("an empty nodeIds list never becomes a site-wide replace", async () => {
    const body = await bodyFor(
      Object.assign({}, REPLACE_DETAIL, { nodeIds: [] }),
    );
    expect(body).to.equal(null);
  });
});

// right click (or Shift+F10) on a row opens the item menu, the same
// pattern as outline-designer's page menu; each item runs the control it
// mirrors
describe("haxcms-content-admin-dialog page actions menu", () => {
  let realConfirm;
  beforeEach(() => {
    realConfirm = globalThis.confirm;
    globalThis.confirm = () => true;
  });
  afterEach(() => {
    globalThis.confirm = realConfirm;
  });

  const row = (el, id) =>
    el.shadowRoot.querySelector(`tr[data-node-id="${id}"]`);
  const menu = (el) => el.shadowRoot.querySelector(".admin-row-menu");
  const labels = (el) =>
    [...menu(el).querySelectorAll("simple-toolbar-button")].map((b) => b.label);
  const rightClick = async (el, id) => {
    const cell = row(el, id).querySelector("td.updated");
    const r = cell.getBoundingClientRect();
    cell.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        composed: true,
        cancelable: true,
        clientX: r.x + 4,
        clientY: r.y + 4,
      }),
    );
    await el.updateComplete;
    await el.updateComplete;
  };
  const item = (el, action) =>
    menu(el).querySelector(`simple-toolbar-button[data-action="${action}"]`);
  // a pointer or the menu's Enter presses the inner button
  const press = (el, action) =>
    item(el, action).shadowRoot.querySelector("button").click();

  it("a right click checks the row, focuses it and lists its actions", async () => {
    const el = await contentSection();
    await rightClick(el, "item-2");
    expect(menu(el).open).to.equal(true);
    expect(el._checkedIds).to.deep.equal(["item-2"]);
    expect(el._focusId).to.equal("item-2");
    expect(labels(el)).to.deep.equal([
      "Open page",
      "View page revisions",
      "Replace…",
      "Publish",
      "Unpublish",
      "Show in menu",
      "Hide in menu",
      "Delete…",
    ]);
    menu(el).close();
  });

  it("a right click inside a selection keeps the selection", async () => {
    const el = await contentSection();
    el._toggleAllPages(true);
    await el.updateComplete;
    await rightClick(el, "item-1");
    expect(el._checkedIds.length).to.equal(2);
    menu(el).close();
  });

  it("the row ⋯ opens the same menu", async () => {
    const el = await contentSection();
    row(el, "item-1").querySelector(".row-more").click();
    await el.updateComplete;
    await el.updateComplete;
    expect(menu(el).open).to.equal(true);
    expect(el._rowMenuFor).to.equal("item-1");
    menu(el).close();
  });

  it("Shift+F10 on a row's control opens it too", async () => {
    const el = await contentSection();
    const title = row(el, "item-1").querySelector(".title-btn");
    title.focus();
    title.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "F10",
        shiftKey: true,
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );
    await el.updateComplete;
    await el.updateComplete;
    expect(menu(el).open).to.equal(true);
    expect(el._rowMenuFor).to.equal("item-1");
    menu(el).close();
  });

  it("View page revisions sends what the row button sends", async () => {
    const el = await contentSection();
    await rightClick(el, "item-2");
    setTimeout(() => press(el, "open-revisions"));
    const e = await oneEvent(globalThis, "haxcms-open-page-revisions");
    expect(e.detail.nodeId).to.equal("item-2");
    expect(e.detail.nodeTitle).to.equal("Cell membrane");
    expect(e.detail.source).to.equal("content-admin-dialog");
    expect(e.detail.invokedBy).to.equal(
      row(el, "item-2").querySelector('[data-action="open-revisions"]'),
    );
    expect(menu(el).open).to.equal(false);
  });

  it("Replace… from the menu opens the same chooser as the bar", async () => {
    const el = await contentSection();
    await readyToReplace(el, "wall");
    await rightClick(el, "item-2");
    press(el, "replace");
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".choice")).to.exist;
  });

  it("typing in a field keeps the browser's own menu", async () => {
    const el = await contentSection();
    const input = el.shadowRoot.querySelector('input[name="filter-value"]');
    const e = new MouseEvent("contextmenu", {
      bubbles: true,
      composed: true,
      cancelable: true,
      clientX: 5,
      clientY: 5,
    });
    input.dispatchEvent(e);
    expect(e.defaultPrevented).to.equal(false);
    expect(menu(el).open).to.equal(false);
  });
});

// the add area (area 9): documents become unpublished child pages of the
// page open behind the dialog, through Merlin's upload program
describe("haxcms-content-admin-dialog add area", () => {
  let realFind, realUI, realActive, manifest, calls, nextId;
  // a stand-in for the editor UI: records what Merlin's program was asked
  // to do and makes the page, as the editor would, a moment later
  const fakeUI = {
    processFileContentsBasedOnUserDesire(values, mode) {
      calls.push([mode, values]);
      const id = `new-${nextId++}`;
      setTimeout(() => {
        manifest[id] = {
          id,
          title: values.data.name,
          parent: values.contextItemId,
          metadata: { published: true },
        };
        globalThis.dispatchEvent(
          new CustomEvent("haxcms-create-node-success", {
            detail: { value: true, item: { id, slug: id } },
          }),
        );
      }, 10);
    },
  };
  const onDetails = (e) => {
    calls.push(["details", e.detail]);
    setTimeout(() => {
      manifest[e.detail.id].metadata.published = e.detail.published;
    }, 10);
  };
  const doc = (name, body = "x") => new File([body], name);
  beforeEach(() => {
    calls = [];
    nextId = 1;
    manifest = {};
    JSON.parse(JSON.stringify(ITEMS)).forEach((item) => {
      manifest[item.id] = item;
    });
    realFind = store.findItem;
    realActive = store.activeId;
    realUI = store.cmsSiteEditor.haxCmsSiteEditorUIElement;
    store.findItem = (id) => manifest[id] || null;
    store.activeId = "item-1";
    store.cmsSiteEditor.haxCmsSiteEditorUIElement = fakeUI;
    globalThis.addEventListener("haxcms-save-node-details", onDetails);
  });
  afterEach(() => {
    store.findItem = realFind;
    store.activeId = realActive;
    store.cmsSiteEditor.haxCmsSiteEditorUIElement = realUI;
    globalThis.removeEventListener("haxcms-save-node-details", onDetails);
  });

  it("reports an add area for documents", async () => {
    const el = await contentSection();
    const area = el.addArea;
    expect(area.accept).to.equal(".docx,.doc,.pdf,.pptx,.md,.txt,.html,.htm");
    expect(area.disabled).to.equal(false);
  });

  it("makes each document an unpublished child of the open page, in drop order", async () => {
    const el = await contentSection();
    await el.addFiles({
      files: [doc("Chapter 1.docx"), doc("notes.md", "# Notes")],
    });
    const runs = calls.filter((c) => c[0] === "create-child");
    expect(runs.length).to.equal(2);
    // the values Merlin's upload builds, with the parent and keepOpen
    expect(runs[0][1].type).to.equal("docx");
    expect(runs[0][1].contextItemId).to.equal("item-1");
    expect(runs[0][1].keepOpen).to.equal(true);
    expect(runs[0][1].operation).to.equal("file-selected");
    // text documents carry their text, as Merlin reads it
    expect(runs[1][1].type).to.equal("md");
    expect(runs[1][1].contents).to.equal("# Notes");
    // each made page is set unpublished with the editor's own toggle
    expect(
      calls.filter((c) => c[0] === "details").map((c) => c[1]),
    ).to.deep.equal([
      { id: "new-1", operation: "setPublished", published: false },
      { id: "new-2", operation: "setPublished", published: false },
    ]);
    // one at a time: the second starts after the first is unpublished
    expect(calls.map((c) => c[0])).to.deep.equal([
      "create-child",
      "details",
      "create-child",
      "details",
    ]);
    // the new pages are checked and the first is in the detail panel
    expect(el._checkedIds).to.deep.equal(["new-1", "new-2"]);
    expect(el._focusId).to.equal("new-1");
    expect(el.addArea.message).to.contain("2 unpublished pages");
  });

  it("turns images and other files away to Files", async () => {
    const el = await contentSection();
    await el.addFiles({ files: [doc("photo.png"), doc("data.zip")] });
    expect(calls.length).to.equal(0);
    // said once, in the notice with Open Files
    expect(el.addArea.message).to.equal("");
    await el.updateComplete;
    const notice = el.shadowRoot.querySelector(".refused");
    expect(!!notice).to.equal(true);
    expect(notice.textContent).to.contain("photo.png, data.zip");
    setTimeout(() => notice.querySelector(".open-files").click());
    const go = await oneEvent(el, "haxcms-site-admin-navigate");
    expect(go.detail.route).to.equal("files");
  });

  it("a mixed drop makes the documents and lists what it turned away", async () => {
    const el = await contentSection();
    await el.addFiles({ files: [doc("photo.jpg"), doc("Intro.pdf")] });
    const runs = calls.filter((c) => c[0] === "create-child");
    expect(runs.length).to.equal(1);
    expect(runs[0][1].type).to.equal("pdf");
    expect(el.addArea.message).to.contain("1 unpublished page");
    expect(el._refused).to.deep.equal(["photo.jpg"]);
  });

  it("asks for an open page when there is none", async () => {
    store.activeId = null;
    const el = await contentSection();
    await el.addFiles({ files: [doc("a.docx")] });
    expect(calls.length).to.equal(0);
    expect(el.addArea.message).to.contain("Open a page first");
  });

  it("outside the shell it draws its own add area", async () => {
    const el = await contentSection(false);
    expect(
      !!el.shadowRoot.querySelector(".local-add haxcms-admin-add-area"),
    ).to.equal(true);
  });
});
