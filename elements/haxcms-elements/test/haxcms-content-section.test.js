// Content as a "selection" section of the one admin dialog
// (haxtheweb/issues#3180): find / replace across pages is its action,
// run from the shell's action bar through runAction("replace").
import { fixture, expect, html, oneEvent, waitUntil } from "@open-wc/testing";
import { sendKeys } from "@web/test-runner-commands";
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

// a replace-ready state with two matched pages
async function readyToMultiReplace(el, replacement) {
  el._onFilterField({ detail: { value: "search" } });
  el._onOperationMode({ detail: { value: "replace" } });
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

  it("clearSelection unchecks every page and keeps the search", async () => {
    const el = await contentSection();
    await readyToMultiReplace(el, "wall");
    el.clearSelection();
    await el.updateComplete;
    expect(el._checkedMatchIds()).to.deep.equal([]);
    expect(el.filterValue).to.equal("ce");
    expect(el.replaceValue).to.equal("wall");
    expect(el.searchMatches).to.deep.equal(["item-1", "item-2"]);
    expect(el._searchMatchCount()).to.equal(2);
    expect(el.operationMode).to.equal("replace");
    const boxes = [
      ...el.shadowRoot.querySelectorAll("input.select-page, input.select-all"),
    ];
    expect(boxes.length).to.equal(3);
    boxes.forEach((box) => expect(box.checked).to.equal(false));
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
    [...el.shadowRoot.querySelectorAll("table.pages tbody a.title-link")].map(
      (a) => a.textContent.trim(),
    );

  it("the segmented control switches between Search and Search and replace", async () => {
    const el = await contentSection();
    const seg = (mode) =>
      el.shadowRoot.querySelector(`.seg button[data-mode="${mode}"]`);
    expect(seg("search").getAttribute("aria-pressed")).to.equal("true");
    expect(el.shadowRoot.querySelector('input[name="replace-value"]')).to.not
      .exist;
    seg("replace").click();
    await el.updateComplete;
    expect(el.operationMode).to.equal("replace");
    expect(seg("replace").getAttribute("aria-pressed")).to.equal("true");
    expect(seg("search").getAttribute("aria-pressed")).to.equal("false");
    expect(el.shadowRoot.querySelector('input[name="replace-value"]')).to.exist;
    expect(el.shadowRoot.querySelector(".note").textContent).to.contain(
      "cannot be undone",
    );
    seg("search").click();
    await el.updateComplete;
    expect(el.operationMode).to.equal("search");
    expect(el.shadowRoot.querySelector('input[name="replace-value"]')).to.not
      .exist;
    expect(el.shadowRoot.querySelector(".note")).to.not.exist;
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

  it("status is a pill and updated carries the full date", async () => {
    const el = await contentSection();
    const pills = [
      ...el.shadowRoot.querySelectorAll("table.pages td.status .hax-ui-pill"),
    ];
    expect(pills.map((p) => p.textContent.trim())).to.deep.equal([
      "Unpublished",
      "Published",
    ]);
    expect(pills[1].getAttribute("data-tone")).to.equal("success");
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
    expect(bar.textContent).to.contain("1 of 1 page selected");
    const replace = bar.querySelector('[data-action="replace"]');
    expect(replace.disabled).to.equal(false);
    expect(replace.classList.contains("danger")).to.equal(true);
    setTimeout(() => replace.click());
    const e = await oneEvent(el, "haxcms-content-dashboard-operation");
    expect(e.detail).to.deep.equal(REPLACE_DETAIL);
  });
});

describe("haxcms-content-admin-dialog page checkboxes", () => {
  let realConfirm;
  beforeEach(() => {
    realConfirm = globalThis.confirm;
    globalThis.confirm = () => true;
  });
  afterEach(() => {
    globalThis.confirm = realConfirm;
  });

  function rowBox(el, id) {
    return el.shadowRoot.querySelector(
      `input.select-page[data-node-id="${id}"]`,
    );
  }

  function click(box) {
    box.click();
  }

  const readyTwoMatches = (el) => readyToMultiReplace(el, "wall");

  const MULTI_DETAIL = Object.assign({}, REPLACE_DETAIL, { search: "ce" });

  it("every match starts checked, with a labelled checkbox per page", async () => {
    const el = await contentSection();
    await readyTwoMatches(el);
    expect(el._checkedMatchIds()).to.deep.equal(["item-1", "item-2"]);
    const one = rowBox(el, "item-1");
    const two = rowBox(el, "item-2");
    expect(one.checked).to.equal(true);
    expect(two.checked).to.equal(true);
    expect(one.getAttribute("aria-label")).to.equal("Select Welcome");
    expect(two.getAttribute("aria-label")).to.equal("Select Cell membrane");
    const all = el.shadowRoot.querySelector("input.select-all");
    expect(all.checked).to.equal(true);
    expect(all.indeterminate).to.equal(false);
    expect(all.getAttribute("aria-label")).to.equal(
      "Select all matching pages",
    );
    expect(el._selectionText()).to.equal("2 of 2 pages selected");
  });

  it("all checked sends the old detail with no nodeIds", async () => {
    const el = await contentSection();
    await readyTwoMatches(el);
    setTimeout(() => el.runAction("replace"));
    const e = await oneEvent(el, "haxcms-content-dashboard-operation");
    expect(e.detail).to.deep.equal(MULTI_DETAIL);
    expect("nodeIds" in e.detail).to.equal(false);
  });

  it("a subset adds nodeIds and the bar counts it", async () => {
    const el = await contentSection();
    await readyTwoMatches(el);
    const state = new Promise((resolve) => {
      el.addEventListener("haxcms-admin-section-state", resolve, {
        once: true,
      });
    });
    click(rowBox(el, "item-1"));
    const e = await state;
    expect(e.detail.selected).to.equal(1);
    expect(e.detail.selectionText).to.equal("1 of 2 pages selected");
    expect(e.detail.actions[0].disabled).to.equal(false);
    await el.updateComplete;
    const all = el.shadowRoot.querySelector("input.select-all");
    expect(all.checked).to.equal(false);
    expect(all.indeterminate).to.equal(true);
    setTimeout(() => el.runAction("replace"));
    const op = await oneEvent(el, "haxcms-content-dashboard-operation");
    expect(op.detail).to.deep.equal(
      Object.assign({}, MULTI_DETAIL, { nodeIds: ["item-2"] }),
    );
  });

  it("select all checks every match again", async () => {
    const el = await contentSection();
    await readyTwoMatches(el);
    click(rowBox(el, "item-1"));
    click(rowBox(el, "item-2"));
    await el.updateComplete;
    expect(el._checkedMatchIds()).to.deep.equal([]);
    const all = el.shadowRoot.querySelector("input.select-all");
    expect(all.checked).to.equal(false);
    click(all);
    await el.updateComplete;
    expect(el._checkedMatchIds()).to.deep.equal(["item-1", "item-2"]);
    expect(rowBox(el, "item-1").checked).to.equal(true);
    expect(rowBox(el, "item-2").checked).to.equal(true);
    click(all);
    await el.updateComplete;
    expect(el._checkedMatchIds()).to.deep.equal([]);
  });

  it("Replace is disabled and sends nothing with none checked", async () => {
    const el = await contentSection();
    await readyTwoMatches(el);
    el.clearSelection();
    await el.updateComplete;
    expect(el.selectionActions[0].disabled).to.equal(true);
    expect(el._selectionText()).to.equal("0 of 2 pages selected");
    let sent = 0;
    el.addEventListener("haxcms-content-dashboard-operation", () => {
      sent++;
    });
    el.runAction("replace");
    expect(sent).to.equal(0);
    const standalone = await contentSection(false);
    await readyTwoMatches(standalone);
    standalone.clearSelection();
    await standalone.updateComplete;
    expect(
      standalone.shadowRoot.querySelector(".replace-btn").disabled,
    ).to.equal(true);
  });

  it("a new search checks all of its matches again", async () => {
    const el = await contentSection();
    await readyTwoMatches(el);
    el.clearSelection();
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-content-dashboard-search-results", {
        detail: { query: "ce", matches: [{ id: "item-1" }, { id: "item-2" }] },
      }),
    );
    await el.updateComplete;
    expect(el._checkedMatchIds()).to.deep.equal(["item-1", "item-2"]);
  });

  it("checkboxes are keyboard operable", async () => {
    const el = await contentSection();
    await readyTwoMatches(el);
    const box = rowBox(el, "item-2");
    box.focus();
    expect(el.shadowRoot.activeElement).to.equal(box);
    await sendKeys({ press: "Space" });
    await el.updateComplete;
    expect(el._checkedMatchIds()).to.deep.equal(["item-1"]);
    expect(el.shadowRoot.activeElement).to.equal(rowBox(el, "item-2"));
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
