import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import { store } from "../lib/core/haxcms-site-store.js";
import "../lib/core/admin/haxcms-site-admin.js";
import "../lib/core/ui/haxcms-about-dialog-ui.js";
import "../lib/core/haxcms-site-import-export-dashboard.js";
import "../lib/core/haxcms-views-admin-dialog.js";

// Footer "none" sections in the one admin dialog: About, Import / Export
// and Views. They save nothing; these tests pin what they still do.

async function sectionInShell(route, configure) {
  const shell = await fixture(
    html`<haxcms-site-admin
      style="--simple-modal-height: 720px"
    ></haxcms-site-admin>`,
  );
  shell.allowRoute = () => true;
  shell.configureSection = (r, el) => {
    if (typeof configure === "function") {
      configure(r, el);
    }
  };
  shell.route = route;
  await waitUntil(() => shell._sectionEl, "section element created");
  await shell.updateComplete;
  const section = shell._sectionEl;
  await section.updateComplete;
  await shell.updateComplete;
  return { shell, section };
}

// the exact `haxcms-site-import-export-action` details the tiles fired
// before the restyle, in render order
const IMPORT_EXPORT_DETAILS = [
  { action: "import-file", format: "" },
  { action: "import-link", format: "" },
  { action: "export-page", format: "html" },
  { action: "export-page", format: "markdown" },
  { action: "export-page", format: "json" },
  { action: "export-page", format: "yaml" },
  { action: "export-page", format: "xml" },
  { action: "export-page", format: "docx" },
  { action: "export-page", format: "pdf" },
  { action: "export-page", format: "epub" },
  { action: "export-site", format: "zip" },
  { action: "export-site", format: "html" },
  { action: "export-site", format: "markdown" },
  { action: "export-site", format: "docx" },
  { action: "export-site", format: "pdf" },
  { action: "export-site", format: "epub" },
  { action: "export-site", format: "skeleton" },
];

function collectActions(el) {
  const fired = [];
  const listener = (e) => fired.push(e.detail);
  el.addEventListener("haxcms-site-import-export-action", listener);
  return {
    fired,
    stop: () =>
      el.removeEventListener("haxcms-site-import-export-action", listener),
  };
}

describe("About section", () => {
  it("keeps its own title and intro when standalone", async () => {
    const el = await fixture(
      html`<haxcms-about-dialog-ui></haxcms-about-dialog-ui>`,
    );
    const head = el.shadowRoot.querySelector(".page-head h2");
    expect(head).to.exist;
    expect(head.textContent.trim()).to.equal(el.t.helpAndAbout);
    expect(el.shadowRoot.querySelector(".page-head .intro")).to.exist;
  });

  it("drops its title in the shell and keeps every group", async () => {
    const { shell, section } = await sectionInShell("about");
    expect(section.localName).to.equal("haxcms-about-dialog-ui");
    expect(section.inShell).to.equal(true);
    expect(section.hasAttribute("in-shell")).to.equal(true);
    expect(section.shadowRoot.querySelector(".page-head")).to.equal(null);
    // the shell header is the only page title
    expect(
      shell.shadowRoot.querySelector(".ph h2").textContent.trim(),
    ).to.equal(shell.t.about);
    const groups = [...section.shadowRoot.querySelectorAll("[data-group]")].map(
      (node) => node.getAttribute("data-group"),
    );
    expect(groups).to.deep.equal([
      "community",
      "tutorials",
      "api",
      "shortcuts",
    ]);
  });

  it("keeps every help and API link", async () => {
    const el = await fixture(
      html`<haxcms-about-dialog-ui></haxcms-about-dialog-ui>`,
    );
    const hrefs = [...el.shadowRoot.querySelectorAll("a")].map((a) =>
      a.getAttribute("href"),
    );
    [
      "https://haxtheweb.org/",
      "https://haxtheweb.org/documentation",
      "https://discord.gg/aCGxmRHEJP",
      "https://github.com/haxtheweb/issues/issues",
      "https://haxtheweb.org/tutorials",
      "https://haxtheweb.org/documentation/developers/haxsite/custom-theme-development",
      "https://haxtheweb.org/documentation/data-formats",
      "https://haxtheweb.org/documentation/developers/schema/json-outline-schema",
      "https://haxtheweb.org/documentation/oer-schema",
      "https://haxtheweb.org/hax-lab/hax-ai",
    ].forEach((href) => expect(hrefs).to.include(href));
    ["llms.txt", "site.json", "lunrSearchIndex.json", "x/api/openapi"].forEach(
      (resource) =>
        expect(hrefs.some((href) => href && href.endsWith(resource))).to.equal(
          true,
          resource,
        ),
    );
    // five page formats
    expect(
      el.shadowRoot.querySelectorAll(".api li:first-child a").length,
    ).to.equal(5);
  });

  it("lists shortcuts for the chosen context", async () => {
    const el = await fixture(
      html`<haxcms-about-dialog-ui></haxcms-about-dialog-ui>`,
    );
    el.keyboardShortcuts = [
      { label: "Ctrl⇧1", description: "Global one", context: "global" },
      { label: "Ctrl⇧E", description: "View one", context: "view" },
      { label: "Ctrl⇧S", description: "Edit one", context: "edit" },
      {
        label: "##",
        description: "Heading",
        context: "edit",
        type: "markdown",
      },
    ];
    await el.updateComplete;
    const rows = () =>
      [...el.shadowRoot.querySelectorAll(".shortcut-list li")].map((li) =>
        li.textContent.replace(/\s+/g, " ").trim(),
      );
    expect(rows()).to.deep.equal(["Global one Ctrl⇧1"]);
    el.shadowRoot.querySelector('.seg [data-context="edit"]').click();
    await el.updateComplete;
    expect(el.shortcutContext).to.equal("edit");
    expect(
      el.shadowRoot
        .querySelector('.seg [data-context="edit"]')
        .getAttribute("aria-pressed"),
    ).to.equal("true");
    expect(rows()).to.deep.equal(["Edit one Ctrl⇧S", "Heading ##"]);
    el.shadowRoot.querySelector('.seg [data-context="view"]').click();
    await el.updateComplete;
    expect(rows()).to.deep.equal(["View one Ctrl⇧E"]);
  });
});

describe("Import / Export section", () => {
  it("fires the same action detail for every tile", async () => {
    const el = await fixture(
      html`<haxcms-site-import-export-dashboard></haxcms-site-import-export-dashboard>`,
    );
    const { fired, stop } = collectActions(el);
    const buttons = [...el.shadowRoot.querySelectorAll(".action-button")];
    expect(buttons.length).to.equal(IMPORT_EXPORT_DETAILS.length);
    buttons.forEach((button) => button.click());
    stop();
    expect(fired).to.deep.equal(IMPORT_EXPORT_DETAILS);
  });

  it("keeps a turned-off action disabled and silent", async () => {
    const el = await fixture(
      html`<haxcms-site-import-export-dashboard></haxcms-site-import-export-dashboard>`,
    );
    el.allowImportFiles = false;
    await el.updateComplete;
    const { fired, stop } = collectActions(el);
    const first = el.shadowRoot.querySelector(".action-button");
    expect(first.disabled).to.equal(true);
    expect(first.getAttribute("title")).to.equal(el.t.disabledInFeatures);
    el._emitAction({ action: "import-file" });
    first.click();
    stop();
    expect(fired).to.deep.equal([]);
  });

  it("fires the same details inside the shell, as the editor configures it", async () => {
    const { shell, section } = await sectionInShell("transfer", (r, el) => {
      // what _configureSiteAdminSection sets for "transfer"
      el.allowImportFiles = true;
      el.allowImportLinks = true;
      el.allowPageExport = true;
      el.allowSiteExport = true;
    });
    expect(section.localName).to.equal("haxcms-site-import-export-dashboard");
    expect(section.inShell).to.equal(true);
    // no page title of its own: the shell header is the only one
    expect(
      shell.shadowRoot.querySelector(".ph h2").textContent.trim(),
    ).to.equal(shell.t.importExport);
    expect(section.shadowRoot.querySelector("h1, h2")).to.equal(null);
    // footer "none": no action bar
    expect(shell.shadowRoot.querySelector(".ftr")).to.equal(null);
    const { fired, stop } = collectActions(shell);
    section.shadowRoot
      .querySelectorAll(".action-button")
      .forEach((button) => button.click());
    stop();
    expect(fired).to.deep.equal(IMPORT_EXPORT_DETAILS);
  });
});

const VIEWS_SPEC = {
  entities: [{ name: "item", title: "Pages" }],
  entityMap: {
    item: {
      name: "item",
      title: "Pages",
      selectableFields: ["title"],
      sortableFields: [],
      includes: [],
      defaultFields: ["title"],
    },
  },
};

function quietViews(el) {
  // no site API in the test page: skip the spec fetch and preview calls
  el._loadSpecData = async () => {};
  el._schedulePreviewRefresh = () => {};
}

async function loadViews(el) {
  el.specData = JSON.parse(JSON.stringify(VIEWS_SPEC));
  el.entityOptions = [{ value: "item", text: "Pages" }];
  el.selectedEntity = "item";
  await el.updateComplete;
}

describe("Views section", () => {
  it("keeps the in-body embed and create buttons when standalone", async () => {
    const el = globalThis.document.createElement("haxcms-views-admin-dialog");
    quietViews(el);
    const states = [];
    el.addEventListener("haxcms-admin-section-state", (e) =>
      states.push(e.detail),
    );
    await fixture(html`<div>${el}</div>`);
    await loadViews(el);
    expect(el.inShell).to.equal(false);
    expect(el.headerActions).to.deep.equal([]);
    expect(el.shadowRoot.querySelector('[data-action="embed"]')).to.exist;
    expect(el.shadowRoot.querySelector('[data-action="create-page"]')).to.exist;
    expect(el.shadowRoot.querySelector('[data-action="copy-path"]')).to.exist;
    // standalone it reports nothing to a shell
    expect(states).to.deep.equal([]);
  });

  it("moves embed and create to the shell header", async () => {
    const { shell, section } = await sectionInShell("views", (r, el) =>
      quietViews(el),
    );
    expect(section.inShell).to.equal(true);
    expect(
      shell.shadowRoot.querySelector(".ph h2").textContent.trim(),
    ).to.equal(shell.t.views);
    // not ready yet: both header actions are there and disabled
    let buttons = [
      ...shell.shadowRoot.querySelectorAll(".ph-actions .header-action"),
    ];
    expect(buttons.map((b) => b.getAttribute("data-action"))).to.deep.equal([
      "embed",
      "create-page",
    ]);
    expect(buttons.every((b) => b.disabled)).to.equal(true);
    await loadViews(section);
    await shell.updateComplete;
    buttons = [
      ...shell.shadowRoot.querySelectorAll(".ph-actions .header-action"),
    ];
    expect(buttons.every((b) => !b.disabled)).to.equal(true);
    expect(buttons[0].textContent.trim()).to.equal(section.t.embedInPage);
    expect(buttons[1].textContent.trim()).to.equal(section.t.createAsNewPage);
    // only one copy of each action: not in the body as well
    expect(section.shadowRoot.querySelector('[data-action="embed"]')).to.equal(
      null,
    );
    expect(
      section.shadowRoot.querySelector('[data-action="create-page"]'),
    ).to.equal(null);
    expect(section.shadowRoot.querySelector('[data-action="copy-path"]')).to
      .exist;
  });

  it("runs the same embed and create steps from the header", async () => {
    const { shell, section } = await sectionInShell("views", (r, el) =>
      quietViews(el),
    );
    const calls = [];
    section._embedInPage = () => calls.push("embed");
    section._createAsNewPage = () => calls.push("create-page");
    // disabled until the spec loads: nothing runs
    expect(section.runHeaderAction("embed")).to.equal(false);
    expect(calls).to.deep.equal([]);
    await loadViews(section);
    await shell.updateComplete;
    shell.shadowRoot.querySelector('.ph-actions [data-action="embed"]').click();
    shell.shadowRoot
      .querySelector('.ph-actions [data-action="create-page"]')
      .click();
    expect(calls).to.deep.equal(["embed", "create-page"]);
    expect(section.runHeaderAction("nope")).to.equal(false);
  });

  it("closes the dialog on embed, the same as before", async () => {
    const { section } = await sectionInShell("views", (r, el) =>
      quietViews(el),
    );
    await loadViews(section);
    let hidden = 0;
    const onHide = () => {
      hidden += 1;
    };
    globalThis.addEventListener("simple-modal-hide", onHide);
    try {
      expect(section.runHeaderAction("embed")).to.equal(true);
    } finally {
      globalThis.removeEventListener("simple-modal-hide", onHide);
      store.editMode = false;
    }
    expect(hidden).to.equal(1);
  });
});
