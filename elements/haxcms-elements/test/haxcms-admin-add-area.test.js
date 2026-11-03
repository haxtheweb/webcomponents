// The add area (area 9) of the record panels: the shared element, the
// shell's page header hook, and the keepOpen opt-in Content uses on
// Merlin's upload program (Merlin's own calls are unchanged).
import { fixture, expect, html, oneEvent, waitUntil } from "@open-wc/testing";
import { store } from "../lib/core/haxcms-site-store.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import "../lib/core/admin/haxcms-admin-add-area.js";
import {
  splitAdminAddFiles,
  ADMIN_DOCUMENT_TYPES,
} from "../lib/core/admin/haxcms-admin-add-area.js";
import "../lib/core/admin/haxcms-site-admin.js";
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
      _createOptionsFor: p._createOptionsFor,
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

  it("passes the parent and keepOpen through", async () => {
    const record = [];
    await proto().processFileContentsBasedOnUserDesire.call(
      host(record),
      values({ contextItemId: "p1", keepOpen: true }),
      "create-child",
    );
    expect(record[0].slice(1)).to.deep.equal([
      "child",
      "Chapter.docx",
      "<p>converted</p>",
      "p1",
      { keepOpen: true },
    ]);
  });

  it("Merlin's outline import is unchanged: type branch, the current page's parent", async () => {
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
    } finally {
      store.activeId = realActive;
      store.findItem = realFind;
    }
    expect(posted[0][0]).to.equal("@system/importDocx");
    expect(posted[0][1].get("method")).to.equal("branch");
    expect(posted[0][1].get("type")).to.equal("branch");
    expect(posted[0][1].get("parentId")).to.equal("cur-parent");
    expect(record[0][0]).to.equal("import");
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
