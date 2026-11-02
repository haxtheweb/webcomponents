// The add area (area 9) of the record panels: the shared element, the
// shell's page header hook, Structure's chooser, and the opt-ins it uses
// on Merlin's upload program (Merlin's own calls are unchanged).
import { fixture, expect, html, oneEvent, waitUntil } from "@open-wc/testing";
import { store } from "../lib/core/haxcms-site-store.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import "../lib/core/admin/haxcms-admin-add-area.js";
import {
  splitAdminAddFiles,
  ADMIN_DOCUMENT_TYPES,
} from "../lib/core/admin/haxcms-admin-add-area.js";
import "../lib/core/admin/haxcms-site-admin.js";
import "../lib/core/haxcms-outline-editor-dialog.js";
import "../lib/core/haxcms-outline-import-dialog.js";
import "../lib/core/haxcms-site-editor-ui.js";

const doc = (name, body = "x") => new File([body], name);

describe("haxcms-admin-add-area", () => {
  it("is a labelled button that browses with its own picker", async () => {
    const el = await fixture(
      html`<haxcms-admin-add-area
        accept=".docx,.md"
        label="Drop documents here or"
        browse-label="browse"
        hint="Drop documents to make pages"
      ></haxcms-admin-add-area>`,
    );
    const button = el.shadowRoot.querySelector("button.drop");
    // named by its visible words; the hint describes it
    expect(button.getAttribute("aria-label")).to.equal(
      "Drop documents here or browse",
    );
    expect(el.shadowRoot.querySelector("#hint").textContent).to.equal(
      "Drop documents to make pages",
    );
    const input = el.shadowRoot.querySelector("input[type=file]");
    expect(input.getAttribute("accept")).to.equal(".docx,.md");
    expect(input.multiple).to.equal(true);
    let opened = 0;
    input.click = () => opened++;
    button.click();
    expect(opened).to.equal(1);
    await expect(el).shadowDom.to.be.accessible();
  });

  it("hands dropped files over and shows the drag-over state", async () => {
    const el = await fixture(
      html`<haxcms-admin-add-area></haxcms-admin-add-area>`,
    );
    const button = el.shadowRoot.querySelector("button.drop");
    const file = doc("a.docx");
    const over = new Event("dragover", { bubbles: true, cancelable: true });
    over.dataTransfer = { dropEffect: "" };
    button.dispatchEvent(over);
    await el.updateComplete;
    expect(button.classList.contains("over")).to.equal(true);
    const drop = new Event("drop", { bubbles: true, cancelable: true });
    drop.dataTransfer = { files: [file] };
    setTimeout(() => button.dispatchEvent(drop));
    const e = await oneEvent(el, "admin-add-files");
    expect(e.detail.files).to.deep.equal([file]);
    expect(e.detail.event).to.equal(drop);
    await el.updateComplete;
    expect(button.classList.contains("over")).to.equal(false);
  });

  it("hands chosen files over, and lets a panel open its own picker", async () => {
    const el = await fixture(
      html`<haxcms-admin-add-area></haxcms-admin-add-area>`,
    );
    const input = el.shadowRoot.querySelector("input[type=file]");
    const file = doc("b.pdf");
    Object.defineProperty(input, "files", { value: [file] });
    setTimeout(() => input.dispatchEvent(new Event("change")));
    const e = await oneEvent(el, "admin-add-files");
    expect(e.detail.files).to.deep.equal([file]);
    expect(e.detail.event).to.equal(null);
    el.browseHandled = true;
    await el.updateComplete;
    setTimeout(() => el.shadowRoot.querySelector("button.drop").click());
    await oneEvent(el, "admin-add-browse");
  });

  it("takes nothing while busy or disabled, and reads out its message", async () => {
    const el = await fixture(
      html`<haxcms-admin-add-area
        busy
        message="Making page 1 of 2"
      ></haxcms-admin-add-area>`,
    );
    const button = el.shadowRoot.querySelector("button.drop");
    expect(button.disabled).to.equal(true);
    const msg = el.shadowRoot.querySelector(".msg");
    expect(msg.getAttribute("role")).to.equal("status");
    expect(msg.textContent).to.contain("Making page 1 of 2");
    let sent = 0;
    el.addEventListener("admin-add-files", () => sent++);
    const drop = new Event("drop", { bubbles: true, cancelable: true });
    drop.dataTransfer = { files: [doc("c.docx")] };
    button.dispatchEvent(drop);
    expect(sent).to.equal(0);
  });

  it("splits files by extension, as Merlin reads the type", () => {
    const { taken, refused } = splitAdminAddFiles(
      [doc("A.DOCX"), doc("b.png"), doc("noext"), doc("c.htm")],
      ADMIN_DOCUMENT_TYPES,
    );
    expect(taken.map((f) => f.name)).to.deep.equal(["A.DOCX", "c.htm"]);
    expect(refused.map((f) => f.name)).to.deep.equal(["b.png", "noext"]);
  });
});

describe("haxcms-site-admin draws a section's add area", () => {
  it("in the page header, passing files and Browse to the section", async () => {
    const shell = await fixture(
      html`<haxcms-site-admin
        style="--simple-modal-height: 720px"
      ></haxcms-site-admin>`,
    );
    const calls = [];
    shell.allowRoute = () => true;
    shell.route = "content";
    await waitUntil(() => shell._sectionEl, "section element created");
    shell._sectionEl.addFiles = (detail) => calls.push(["add", detail]);
    shell._sectionEl.browseFiles = () => calls.push(["browse"]);
    shell._onSectionState({
      detail: {
        addArea: {
          accept: ".docx",
          label: "Drop documents here or",
          browseLabel: "browse",
          browseHandled: true,
          message: "Made 1 page",
        },
      },
    });
    await shell.updateComplete;
    const area = shell.shadowRoot.querySelector(".ph haxcms-admin-add-area");
    expect(!!area).to.equal(true);
    expect(area.accept).to.equal(".docx");
    expect(area.message).to.equal("Made 1 page");
    area.dispatchEvent(
      new CustomEvent("admin-add-files", {
        detail: { files: ["f"], event: null },
      }),
    );
    area.dispatchEvent(new CustomEvent("admin-add-browse"));
    expect(calls).to.deep.equal([
      ["add", { files: ["f"], event: null }],
      ["browse"],
    ]);
    // a section that reports none has none
    shell._onSectionState({ detail: { addArea: null } });
    await shell.updateComplete;
    expect(
      !!shell.shadowRoot.querySelector(".ph haxcms-admin-add-area"),
    ).to.equal(false);
  });
});

describe("Merlin's upload program opt-ins", () => {
  const proto = () =>
    globalThis.customElements.get("haxcms-site-editor-ui").prototype;
  let realCall, posted;
  beforeEach(() => {
    posted = [];
    realCall = MicroFrontendRegistry.call;
    MicroFrontendRegistry.call = async (name, data) => {
      posted.push([name, data]);
      return {
        status: 200,
        data: { contents: "<p>converted</p>", items: [{ id: "i" }] },
      };
    };
  });
  afterEach(() => {
    MicroFrontendRegistry.call = realCall;
  });
  // a stand-in "this" with the editor UI's own helpers
  const host = (record) => {
    const p = proto();
    return {
      t: {},
      setProcessingVisual() {},
      _createTypeFor: p._createTypeFor,
      _createOptionsFor: p._createOptionsFor,
      _branchParentFor: p._branchParentFor,
      _branchTypeFor: p._branchTypeFor,
      createNewNode: (...args) => record.push(["create", ...args]),
      _openImportHierarchy: (...args) => record.push(["import", ...args]),
    };
  };
  const values = (extra = {}) =>
    Object.assign(
      {
        operation: "file-selected",
        contents: "",
        data: doc("Chapter.docx"),
        type: "docx",
      },
      extra,
    );

  it("without opt-ins makes a child page exactly as Merlin does", async () => {
    const record = [];
    await proto().processFileContentsBasedOnUserDesire.call(
      host(record),
      values(),
      "create-child",
    );
    expect(posted[0][0]).to.equal("@system/docxToHtml");
    expect(record).to.deep.equal([
      [
        "create",
        "child",
        "Chapter.docx",
        "<p>converted</p>",
        null,
        { keepOpen: false },
      ],
    ]);
  });

  it("passes the parent, keepOpen and a top-level type through", async () => {
    const record = [];
    await proto().processFileContentsBasedOnUserDesire.call(
      host(record),
      values({ contextItemId: "p1", keepOpen: true }),
      "create-child",
    );
    await proto().processFileContentsBasedOnUserDesire.call(
      host(record),
      values({ createType: "branch", keepOpen: true }),
      "create-child",
    );
    expect(record[0].slice(1)).to.deep.equal([
      "child",
      "Chapter.docx",
      "<p>converted</p>",
      "p1",
      { keepOpen: true },
    ]);
    expect(record[1][1]).to.equal("branch");
  });

  it("an outline uses the given parent and import target, else the current page's parent", async () => {
    const record = [];
    const realActive = store.activeId;
    const realFind = store.findItem;
    store.findItem = (id) =>
      id === "cur" ? { id: "cur", parent: "cur-parent" } : null;
    store.activeId = "cur";
    try {
      await proto().processFileContentsBasedOnUserDesire.call(
        host(record),
        values(),
        "create-branch",
      );
      await proto().processFileContentsBasedOnUserDesire.call(
        host(record),
        values({ parentId: null, importTarget: "row-7" }),
        "create-branch",
      );
    } finally {
      store.activeId = realActive;
      store.findItem = realFind;
    }
    expect(posted[0][0]).to.equal("@system/importDocx");
    expect(posted[0][1].get("parentId")).to.equal("cur-parent");
    // null as Import from file sends it
    expect(posted[1][1].get("parentId")).to.equal("null");
    expect(record[0][0]).to.equal("import");
    expect(record[0][3]).to.deep.equal({ importTarget: undefined });
    expect(record[1][3]).to.deep.equal({ importTarget: "row-7" });
  });

  it("Merlin's outline import sends type branch; Structure's sends the site structure", async () => {
    const record = [];
    const realManifest = store.manifest;
    store.manifest = { metadata: { build: {}, structure: "course" } };
    try {
      await proto().processFileContentsBasedOnUserDesire.call(
        host(record),
        values({ parentId: null }),
        "create-branch",
      );
      await proto().processFileContentsBasedOnUserDesire.call(
        host(record),
        values({ parentId: null, importType: "structure" }),
        "create-branch",
      );
    } finally {
      store.manifest = realManifest;
    }
    expect(posted[0][1].get("type")).to.equal("branch");
    expect(posted[0][1].get("method")).to.equal("branch");
    // as Structure's Import from file sends it
    expect(posted[1][1].get("type")).to.equal("course");
    expect(posted[1][1].get("method")).to.equal("branch");
  });

  it("createNewNode sends keepOpen beside, not inside, the request values", async () => {
    const sent = [];
    const fake = {
      t: { newPageDefaultTitle: "New page" },
      dispatchEvent: (e) => sent.push(e.detail),
    };
    const realFind = store.findItemAsObject;
    const realLast = store.getLastChildItem;
    store.findItemAsObject = async () => ({ id: "p1", parent: null, order: 0 });
    store.getLastChildItem = async () => null;
    try {
      await proto().createNewNode.call(fake, "child", "A", "<p></p>", "p1", {
        keepOpen: true,
      });
      await proto().createNewNode.call(fake, "child", "B", "<p></p>", "p1");
    } finally {
      store.findItemAsObject = realFind;
      store.getLastChildItem = realLast;
    }
    expect(sent[0].keepOpen).to.equal(true);
    expect(sent[0].values).to.deep.equal({
      node: { title: "A", location: "", contents: "<p></p>" },
      order: 0,
      parent: "p1",
    });
    expect(sent[1].keepOpen).to.equal(false);
  });
});

describe("haxcms-outline-import-dialog import target", () => {
  it("starts the import under the given page, and keeps its default without one", async () => {
    const items = [{ id: "imp-1", title: "Chapter", parent: null, order: 0 }];
    const make = async (target) => {
      const host = await fixture(html`<div style="height: 600px"></div>`);
      const el = globalThis.document.createElement(
        "haxcms-outline-import-dialog",
      );
      el.inShell = true;
      if (target !== undefined) {
        el.importTarget = target;
      }
      el.items = JSON.parse(JSON.stringify(items));
      host.appendChild(el);
      await el.updateComplete;
      const od = el.shadowRoot.querySelector("outline-designer");
      await od.updateComplete;
      await new Promise((r) => setTimeout(r, 50));
      return od;
    };
    const targeted = await make("row-7");
    expect(targeted.activeId).to.equal("row-7");
    const top = await make(null);
    expect(top.activeId).to.equal(null);
    const plain = await make(undefined);
    expect(plain.activeId).to.equal(store.activeId);
  });
});

describe("Structure's add area", () => {
  let realUI, realFind, calls, nextId, made, realConfirm, confirmAnswer;
  const fakeUI = {
    async processFileContentsBasedOnUserDesire(values, mode) {
      calls.push([mode, values]);
      if (mode === "create-child") {
        const id = `new-${nextId++}`;
        setTimeout(() => {
          made[id] = { id };
          globalThis.dispatchEvent(
            new CustomEvent("haxcms-create-node-success", {
              detail: { value: true, item: { id } },
            }),
          );
        }, 10);
      }
    },
  };
  beforeEach(() => {
    calls = [];
    nextId = 1;
    made = {};
    confirmAnswer = true;
    realUI = store.cmsSiteEditor.haxCmsSiteEditorUIElement;
    realFind = store.findItem;
    realConfirm = globalThis.confirm;
    store.cmsSiteEditor.haxCmsSiteEditorUIElement = fakeUI;
    store.findItem = (id) => made[id] || null;
    globalThis.confirm = () => confirmAnswer;
  });
  afterEach(() => {
    store.cmsSiteEditor.haxCmsSiteEditorUIElement = realUI;
    store.findItem = realFind;
    globalThis.confirm = realConfirm;
  });

  const structure = async () => {
    const el = await fixture(
      html`<haxcms-outline-editor-dialog
        in-shell
      ></haxcms-outline-editor-dialog>`,
    );
    await el.updateComplete;
    const outline = el.shadowRoot.querySelector("#outline");
    outline.items = [
      { id: "a", title: "Alpha", parent: null, order: 0, indent: 0 },
      { id: "b", title: "Beta", parent: null, order: 1, indent: 0 },
    ];
    await outline.updateComplete;
    return { el, outline };
  };

  it("reports an add area to the shell", async () => {
    const { el } = await structure();
    const states = [];
    el.addEventListener("haxcms-admin-section-state", (e) =>
      states.push(e.detail),
    );
    el._addMessage = "hello";
    await el.updateComplete;
    const last = states[states.length - 1];
    expect(last.addArea.accept).to.contain(".docx");
    expect(last.addArea.message).to.equal("hello");
  });

  it("asks one page or outline, under the focused row", async () => {
    const { el, outline } = await structure();
    outline._focusId = "b";
    el.addFiles({ files: [doc("Book.docx")] });
    await el.updateComplete;
    const choice = el.shadowRoot.querySelector(".add-choice");
    expect(choice.textContent).to.contain("Add Book.docx under Beta as:");
    expect(!!choice.querySelector('[data-choice="outline"]')).to.equal(true);
    choice.querySelector('[data-choice="outline"]').click();
    await waitUntil(() => calls.length === 1, "outline import run");
    expect(calls[0][0]).to.equal("create-branch");
    expect(calls[0][1].parentId).to.equal(null);
    expect(calls[0][1].importTarget).to.equal("b");
  });

  it("one page goes under the focused row and stays open", async () => {
    const { el, outline } = await structure();
    outline._focusId = "a";
    el.addFiles({ files: [doc("notes.md", "# N")] });
    await el.updateComplete;
    const choice = el.shadowRoot.querySelector(".add-choice");
    // Markdown has no headings import: one page only
    expect(!!choice.querySelector('[data-choice="outline"]')).to.equal(false);
    choice.querySelector('[data-choice="page"]').click();
    await waitUntil(() => el._addMessage.includes("Added"), "page made");
    expect(calls[0][0]).to.equal("create-child");
    expect(calls[0][1].contextItemId).to.equal("a");
    expect(calls[0][1].keepOpen).to.equal(true);
    expect(calls[0][1].contents).to.equal("# N");
    expect(el._addMessage).to.contain("Added 1 page under Alpha");
  });

  it("with no row focused, pages go to the top level", async () => {
    const { el } = await structure();
    el.addFiles({ files: [doc("x.docx"), doc("y.pdf")] });
    await el.updateComplete;
    const choice = el.shadowRoot.querySelector(".add-choice");
    expect(choice.textContent).to.contain(
      "Add 2 documents under the top level as:",
    );
    // several files: one page each, no outline
    expect(!!choice.querySelector('[data-choice="outline"]')).to.equal(false);
    choice.querySelector('[data-choice="page"]').click();
    await waitUntil(() => el._addMessage.includes("Added"), "pages made");
    expect(calls.map((c) => c[1].createType)).to.deep.equal([
      "branch",
      "branch",
    ]);
    expect(calls.map((c) => c[1].contextItemId)).to.deep.equal([
      undefined,
      undefined,
    ]);
  });

  it("asks before letting unsaved outline changes go, as Import from file does", async () => {
    const { el, outline } = await structure();
    confirmAnswer = false;
    el.addFiles({ files: [doc("x.docx")] });
    await el.updateComplete;
    // unsaved changes in the outline when the answer is given
    outline.items = [
      { id: "a", title: "Alpha", parent: null, order: 0, modified: true },
    ];
    el.shadowRoot.querySelector('[data-choice="page"]').click();
    await new Promise((r) => setTimeout(r, 30));
    expect(calls.length).to.equal(0);
  });

  it("turns images away to Files", async () => {
    const { el } = await structure();
    el.addFiles({ files: [doc("p.png")] });
    await el.updateComplete;
    expect(!!el.shadowRoot.querySelector(".add-choice")).to.equal(false);
    expect(el._addTone).to.equal("error");
    expect(el._addMessage).to.contain("go in Files");
  });
});

describe("a dropped outline saves what Import from file saves", () => {
  // both end in the import step: Import from file opens it with the pages
  // the import returned; a drop opens it with the same pages and the
  // focused row as the starting parent. With the same page as parent, the
  // haxcms-create-node the step's Save sends is the same.
  const ITEMS = [
    { id: "imp-1", title: "Chapter 1", parent: null, order: 0, indent: 0 },
    { id: "imp-2", title: "Section 1.1", parent: "imp-1", order: 0, indent: 1 },
    { id: "imp-3", title: "Chapter 2", parent: null, order: 1, indent: 0 },
  ];
  let realActive, realFindObj;
  beforeEach(() => {
    realActive = store.activeId;
    realFindObj = store.findItemAsObject;
    store.activeId = "page-9";
    store.findItemAsObject = async (id) => ({ id, parent: null, order: 3 });
  });
  afterEach(() => {
    store.activeId = realActive;
    store.findItemAsObject = realFindObj;
  });

  const saveFrom = async (target) => {
    const host = await fixture(html`<div style="height: 600px"></div>`);
    const el = globalThis.document.createElement(
      "haxcms-outline-import-dialog",
    );
    el.inShell = true;
    if (target !== undefined) {
      el.importTarget = target;
    }
    el.items = JSON.parse(JSON.stringify(ITEMS));
    host.appendChild(el);
    await el.updateComplete;
    const od = el.shadowRoot.querySelector("outline-designer");
    await od.updateComplete;
    await new Promise((r) => setTimeout(r, 80));
    const created = oneEvent(globalThis, "haxcms-create-node");
    expect(el.save()).to.equal(true);
    const e = await created;
    return JSON.parse(JSON.stringify(e.detail.values));
  };

  it("matches with the focused row as the open page", async () => {
    const fromImport = await saveFrom(undefined);
    const fromDrop = await saveFrom("page-9");
    expect(fromDrop).to.deep.equal(fromImport);
    // the top-level pages go under the starting page
    expect(
      fromDrop.items.filter((i) => i.parent === "page-9").map((i) => i.id),
    ).to.deep.equal(["imp-1", "imp-3"]);
  });

  it("with no focused row the pages stay at the top level", async () => {
    const fromDrop = await saveFrom(null);
    expect(
      fromDrop.items.filter((i) => i.parent === null).map((i) => i.id),
    ).to.deep.equal(["imp-1", "imp-3"]);
  });
});
