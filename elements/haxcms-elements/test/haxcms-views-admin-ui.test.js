import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";
import "../lib/core/admin/haxcms-site-admin.js";
import "../lib/core/haxcms-views-admin-dialog.js";

// The Views builder and preview panes: groups, controls and states. The
// query these controls build must match what the old simple-fields form
// built, so each control is checked against the generated query too.

const PARAM = (name, type, description, extra = {}) => ({
  name,
  type,
  description,
  required: false,
  enumValues: [],
  defaultValue: "",
  ...extra,
});

function viewsSpec() {
  const queryParams = [
    PARAM("fields", "string", ""),
    PARAM("include", "string", ""),
    PARAM("sort", "string", ""),
    PARAM("format", "string", ""),
    PARAM("filter.depth", "integer", "Levels deep"),
    PARAM("filter.tags", "string", "Tags to match"),
    PARAM("filter.published", "boolean", "Published state"),
  ];
  const queryParamMap = {};
  queryParams.forEach((p) => {
    queryParamMap[p.name] = p;
  });
  return {
    apiBasePath: "/x/api",
    entities: [{ name: "item", title: "Pages" }],
    entityMap: {
      item: {
        name: "item",
        title: "Pages",
        description: "Pages in the outline",
        listOperationId: "listItems",
        listEndpoint: "/x/api/v1/items",
        queryParams,
        queryParamMap,
        selectableFields: ["title", "slug", "tags"],
        sortableFields: ["title", "order"],
        includes: [],
        defaultFields: ["title", "slug"],
      },
    },
  };
}

async function views() {
  const el = globalThis.document.createElement("haxcms-views-admin-dialog");
  // no site API in the test page: skip the spec fetch and preview calls
  el._loadSpecData = async () => {};
  el._schedulePreviewRefresh = () => {};
  await fixture(html`<div style="height: 700px">${el}</div>`);
  el.specData = viewsSpec();
  el.entityOptions = [{ value: "item", text: "Pages" }];
  el._applyEntityConfig("item");
  el.__queryValueChangeLock = false;
  await el.updateComplete;
  return el;
}

function query(el) {
  return el._buildQueryDetails(el._selectedEntityConfig()).queryString;
}

describe("Views builder", () => {
  it("groups the builder into collapsible data-group sections", async () => {
    const el = await views();
    const groups = [...el.shadowRoot.querySelectorAll("details[data-group]")];
    expect(groups.map((g) => g.getAttribute("data-group"))).to.deep.equal([
      "source",
      "show",
      "filter",
      "sort",
    ]);
    expect(groups.every((g) => g.open)).to.equal(true);
    const show = groups[1];
    show.querySelector("summary").click();
    await waitUntil(() => el._openGroups.show === false, "group closed");
    await el.updateComplete;
    expect(show.open).to.equal(false);
    // re-rendering keeps it closed; the others stay open
    el.requestUpdate();
    await el.updateComplete;
    expect(show.open).to.equal(false);
    expect(groups[2].open).to.equal(true);
    show.querySelector("summary").click();
    await waitUntil(() => el._openGroups.show === true, "group reopened");
  });

  it("shows fields as a checklist that builds the same fields value", async () => {
    const el = await views();
    const boxes = [
      ...el.shadowRoot.querySelectorAll('[data-list="fields"] input'),
    ];
    expect(boxes.map((b) => b.getAttribute("data-value"))).to.deep.equal([
      "title",
      "slug",
      "tags",
    ]);
    expect(boxes.map((b) => b.checked)).to.deep.equal([true, true, false]);
    const pill = el.shadowRoot.querySelector(
      'details[data-group="show"] summary .hax-ui-pill',
    );
    expect(pill.textContent.trim()).to.equal("2 of 3");
    // checking appends, unchecking removes: the simple-fields order
    boxes[2].click();
    boxes[0].click();
    await el.updateComplete;
    expect(el.selectedFields).to.deep.equal(["slug", "tags"]);
    expect(query(el)).to.equal("fields=slug%2Ctags&format=json");
  });

  it("sorts with a field select and an ascending / descending control", async () => {
    const el = await views();
    const seg = () => [
      ...el.shadowRoot.querySelectorAll("[data-sort-direction]"),
    ];
    // no sort field yet: direction has nothing to act on
    expect(seg().every((b) => b.disabled)).to.equal(true);
    const select = el.shadowRoot.querySelector('[data-control="sort-field"]');
    select.value = "title";
    select.dispatchEvent(new Event("change"));
    await el.updateComplete;
    expect(el.sortField).to.equal("title");
    expect(seg().every((b) => !b.disabled)).to.equal(true);
    expect(seg().map((b) => b.getAttribute("aria-pressed"))).to.deep.equal([
      "true",
      "false",
    ]);
    expect(query(el)).to.contain("sort=title");
    seg()[1].click();
    await el.updateComplete;
    expect(el.sortDescending).to.equal(true);
    expect(seg().map((b) => b.getAttribute("aria-pressed"))).to.deep.equal([
      "false",
      "true",
    ]);
    expect(query(el)).to.contain("sort=-title");
    const pill = el.shadowRoot.querySelector(
      'details[data-group="sort"] summary .hax-ui-pill',
    );
    expect(pill.textContent.trim()).to.equal("Title ↓");
    seg()[0].click();
    await el.updateComplete;
    expect(el.sortDescending).to.equal(false);
  });

  it("renders filters as labelled 40px controls feeding the query", async () => {
    const el = await views();
    const rows = [
      ...el.shadowRoot.querySelectorAll('details[data-group="filter"] .fr'),
    ];
    expect(
      rows.map((r) => r.querySelector(".lab").textContent.trim()),
    ).to.deep.equal(["Depth", "Tags", "Published"]);
    const depth = el.shadowRoot.querySelector('[data-filter="filter.depth"]');
    expect(depth.type).to.equal("number");
    expect(Math.round(depth.getBoundingClientRect().height)).to.equal(40);
    const published = el.shadowRoot.querySelector(
      '[data-filter="filter.published"]',
    );
    expect(published.localName).to.equal("select");
    expect([...published.options].map((o) => o.value)).to.deep.equal([
      "",
      "true",
      "false",
    ]);
    depth.value = "1";
    depth.dispatchEvent(new Event("input"));
    published.value = "true";
    published.dispatchEvent(new Event("change"));
    await el.updateComplete;
    expect(el.queryValues).to.deep.equal({
      filter: { depth: "1", published: "true" },
    });
    expect(query(el)).to.equal(
      "filter.depth=1&filter.published=true&fields=title%2Cslug&format=json",
    );
    const pill = el.shadowRoot.querySelector(
      'details[data-group="filter"] summary .hax-ui-pill',
    );
    expect(pill.textContent.trim()).to.equal("2 active");
  });

  it("shows the query path in mono text with a copy path button", async () => {
    const el = await views();
    el.queryString = query(el);
    await el.updateComplete;
    const code = el.shadowRoot.querySelector(".query .query-path");
    expect(code.textContent.trim()).to.equal("?fields=title,slug&format=json");
    const button = el.shadowRoot.querySelector('[data-action="copy-path"]');
    expect(button.classList.contains("sm")).to.equal(true);
    let copied = null;
    el._copyToClipboard = (text) => {
      copied = text;
    };
    button.click();
    // the copied text is the encoded path, as before
    expect(copied).to.equal("?fields=title%2Cslug&format=json");
  });
});

describe("Views preview", () => {
  it("shows an empty state when the query returns nothing", async () => {
    const el = await views();
    el.previewRecords = [];
    el.previewCount = 0;
    await el.updateComplete;
    const empty = el.shadowRoot.querySelector(".pv-surface .empty-preview");
    expect(empty).to.exist;
    expect(empty.textContent).to.contain(el.t.noResultsTitle);
    expect(empty.textContent).to.contain(el.t.noResultsYet);
    expect(
      el.shadowRoot.querySelector(".pv-head [data-count]").textContent.trim(),
    ).to.equal("0 record(s) shown");
    // no pager for nothing
    expect(el.shadowRoot.querySelector("simple-pager")).to.equal(null);
  });

  it("shows loading and error states, with a retry on error", async () => {
    const el = await views();
    el.previewLoading = true;
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('.pv-surface [role="status"]')).to.exist;
    expect(
      el.shadowRoot.querySelector(".pv-head [data-count]").textContent.trim(),
    ).to.equal(el.t.loading);
    el.previewLoading = false;
    el.previewErrorMessage = el.t.unableToLoadPreview;
    await el.updateComplete;
    const error = el.shadowRoot.querySelector(".pv-surface .state.error");
    expect(error.textContent).to.contain(el.t.unableToLoadPreview);
    let refreshed = 0;
    el._refreshPreviewTap = () => {
      refreshed += 1;
    };
    el.requestUpdate();
    await el.updateComplete;
    error.querySelector('[data-action="retry-preview"]').click();
    expect(refreshed).to.equal(1);
  });

  it("changes display style from the preview header", async () => {
    const el = await views();
    const select = el.shadowRoot.querySelector(
      '.pv-head [data-control="renderer"]',
    );
    expect(select.value).to.equal("collection");
    select.value = "table";
    select.dispatchEvent(new Event("change"));
    await el.updateComplete;
    expect(el.renderer).to.equal("table");
  });

  it("replaces the panes with a state while loading or failing", async () => {
    const el = await views();
    el.specLoading = true;
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".workspace")).to.equal(null);
    expect(el.shadowRoot.querySelector('.state.whole[role="status"]')).to.exist;
    el.specLoading = false;
    el.errorMessage = el.t.unableToLoadViewsMetadata;
    await el.updateComplete;
    const error = el.shadowRoot.querySelector(".state.whole.error");
    expect(error.textContent).to.contain(el.t.unableToLoadViewsMetadata);
    expect(error.querySelector('[data-action="retry-spec"]')).to.exist;
  });

  it("stacks the panes, builder first, when narrow", async () => {
    await setViewport({ width: 1280, height: 800 });
    const el = await views();
    el.parentNode.style.width = "600px";
    await el.updateComplete;
    const builder = el.shadowRoot.querySelector(".builder");
    const preview = el.shadowRoot.querySelector(".preview");
    await waitUntil(
      () =>
        preview.getBoundingClientRect().top >=
        builder.getBoundingClientRect().bottom - 1,
      "preview below builder",
    );
    el.parentNode.style.width = "1200px";
    await waitUntil(
      () =>
        Math.round(builder.getBoundingClientRect().width) === 380 &&
        preview.getBoundingClientRect().left >=
          builder.getBoundingClientRect().right - 1,
      "panes side by side",
    );
    // under 900px the page stacks them whatever the section width
    await setViewport({ width: 800, height: 800 });
    await waitUntil(
      () =>
        preview.getBoundingClientRect().top >=
        builder.getBoundingClientRect().bottom - 1,
      "stacked on a narrow screen",
    );
  });
});
