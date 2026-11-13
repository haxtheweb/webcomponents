// Files as a "selection" section of the one admin dialog
// (haxtheweb/issues#3180): the bulk actions move from the hax-file-actions
// select into the shell's action bar via runAction(id) / clearSelection().
import { fixture, expect, html, oneEvent, waitUntil } from "@open-wc/testing";
import { answerAdminDialogs } from "./fixtures/admin-dialog-answers.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import "../lib/core/admin/haxcms-site-admin.js";
import "../lib/core/haxcms-files-admin-dialog.js";

const FILES = [
  { path: "files/a.png", uuid: "u1", name: "a.png", mimetype: "image/png" },
  { path: "files/b.jpg", uuid: "u2", name: "b.jpg", mimetype: "image/jpeg" },
  {
    path: "files/c.pdf",
    uuid: "u3",
    name: "c.pdf",
    mimetype: "application/pdf",
  },
];

// Captured from the code before this change by selecting all three files and
// choosing each option of the hax-file-actions select (it fires
// hax-file-action with { action, value } and _onFileAction runs it):
// the confirm / prompt text, then every file operation call in order.
const BASELINE = {
  "rotate:rotate-90": [
    [
      "confirm",
      "Rotate 2 files? This replaces the original files and cannot be undone.",
    ],
    ["@site/updateFileByUuid", { fileUuid: "u1", operation: "rotate-90" }],
    ["@site/updateFileByUuid", { fileUuid: "u2", operation: "rotate-90" }],
  ],
  "scale:md": [
    [
      "confirm",
      "Scale 2 files? This replaces the original files and cannot be undone.",
    ],
    [
      "@site/updateFileByUuid",
      { fileUuid: "u1", operation: "scale", size: "md" },
    ],
    [
      "@site/updateFileByUuid",
      { fileUuid: "u2", operation: "scale", size: "md" },
    ],
  ],
  "transform:sepia": [
    [
      "confirm",
      "Transform 3 files? This replaces the original files and cannot be undone.",
    ],
    ["@site/updateFileByUuid", { fileUuid: "u1", operation: "sepia" }],
    ["@site/updateFileByUuid", { fileUuid: "u2", operation: "sepia" }],
    ["@site/updateFileByUuid", { fileUuid: "u3", operation: "sepia" }],
  ],
  "transform:convert-jpg": [
    [
      "confirm",
      "Convert to JPG 3 files? This replaces the original files and cannot be undone.",
    ],
    ["@site/updateFileByUuid", { fileUuid: "u1", operation: "convert-jpg" }],
    ["@site/updateFileByUuid", { fileUuid: "u2", operation: "convert-jpg" }],
    ["@site/updateFileByUuid", { fileUuid: "u3", operation: "convert-jpg" }],
  ],
  "compress:light": [
    [
      "confirm",
      "Compress 2 files? This replaces the original files and cannot be undone.",
    ],
    [
      "@site/updateFileByUuid",
      { fileUuid: "u1", operation: "compress", level: "light" },
    ],
    [
      "@site/updateFileByUuid",
      { fileUuid: "u2", operation: "compress", level: "light" },
    ],
  ],
  "duplicate:duplicate": [
    ["@site/updateFileByUuid", { fileUuid: "u1", operation: "duplicate" }],
    ["@site/updateFileByUuid", { fileUuid: "u2", operation: "duplicate" }],
    ["@site/updateFileByUuid", { fileUuid: "u3", operation: "duplicate" }],
  ],
  "rename:rename": [
    [
      "prompt",
      "Rename 3 files. Enter a base name; files will be named base-1, base-2, etc.",
      "",
    ],
    [
      "@site/updateFileByUuid",
      { fileUuid: "u1", operation: "rename", newName: "pic-1" },
    ],
    [
      "@site/updateFileByUuid",
      { fileUuid: "u2", operation: "rename", newName: "pic-2" },
    ],
    [
      "@site/updateFileByUuid",
      { fileUuid: "u3", operation: "rename", newName: "pic-3" },
    ],
  ],
  "delete:delete": [
    ["confirm", "Delete 3 selected files? This cannot be undone."],
    ["@site/deleteFileByUuid", { fileUuid: "u1" }],
    ["@site/deleteFileByUuid", { fileUuid: "u2" }],
    ["@site/deleteFileByUuid", { fileUuid: "u3" }],
  ],
};

let calls, real, restoreDialogs;

function stubBackend() {
  calls = [];
  real = {
    has: MicroFrontendRegistry.has,
    call: MicroFrontendRegistry.call,
  };
  MicroFrontendRegistry.has = () => true;
  MicroFrontendRegistry.call = async (name, params) => {
    if (name !== "@site/listFiles") {
      calls.push([name, params]);
    }
    return { status: 200, data: { files: FILES, total: FILES.length } };
  };
  restoreDialogs = answerAdminDialogs({
    confirm: (msg) => {
      calls.push(["confirm", msg]);
      return true;
    },
    prompt: (msg, def) => {
      calls.push(["prompt", msg, def]);
      return "pic";
    },
  });
}

function restoreBackend() {
  MicroFrontendRegistry.has = real.has;
  MicroFrontendRegistry.call = real.call;
  restoreDialogs();
}

async function filesSection(inShell = true) {
  const el = document.createElement("haxcms-files-admin-dialog");
  el.inShell = inShell;
  const host = await fixture(html`<div></div>`);
  host.appendChild(el);
  await el.updateComplete;
  el.siteName = "site";
  await el.refreshFiles();
  await el.updateComplete;
  return el;
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 50));

describe("haxcms-files-admin-dialog selection actions keep the old payloads", () => {
  beforeEach(stubBackend);
  afterEach(restoreBackend);

  const direct = {
    rotate: "rotate:rotate-90",
    duplicate: "duplicate:duplicate",
    rename: "rename:rename",
    delete: "delete:delete",
  };
  Object.keys(direct).forEach((id) => {
    it(`runAction("${id}") makes the same calls as the old select`, async () => {
      const el = await filesSection();
      el._toggleSelectAll(true);
      el.runAction(id);
      await settle();
      expect(calls).to.deep.equal(BASELINE[direct[id]]);
    });
  });

  [
    ["scale", "md", "scale:md"],
    ["transform", "sepia", "transform:sepia"],
    ["transform", "convert-jpg", "transform:convert-jpg"],
    ["compress", "light", "compress:light"],
  ].forEach(([id, choice, key]) => {
    it(`runAction("${id}") asks for the value, then matches ${key}`, async () => {
      const el = await filesSection();
      el._toggleSelectAll(true);
      el.runAction(id);
      await el.updateComplete;
      expect(calls).to.deep.equal([]);
      const option = el.shadowRoot.querySelector(
        `.choice [data-choice="${choice}"]`,
      );
      expect(option, "chooser option").to.exist;
      option.click();
      await settle();
      expect(calls).to.deep.equal(BASELINE[key]);
      expect(el.shadowRoot.querySelector(".choice")).to.not.exist;
    });
  });

  it("takes action:value ids directly", async () => {
    const el = await filesSection();
    el._toggleSelectAll(true);
    el.runAction("compress:light");
    await settle();
    expect(calls).to.deep.equal(BASELINE["compress:light"]);
  });

  it("cancelling the chooser runs nothing", async () => {
    const el = await filesSection();
    el._toggleSelectAll(true);
    el.runAction("scale");
    await el.updateComplete;
    el.shadowRoot.querySelector(".choice-cancel").click();
    await settle();
    expect(calls).to.deep.equal([]);
    expect(el.shadowRoot.querySelector(".choice")).to.not.exist;
  });

  it("does nothing with no selection", async () => {
    const el = await filesSection();
    el.runAction("delete");
    await settle();
    expect(calls).to.deep.equal([]);
  });
});

describe("haxcms-files-admin-dialog embed action", () => {
  let realBody, inserts, hides;
  const onHide = () => {
    hides++;
  };
  beforeEach(() => {
    stubBackend();
    realBody = HAXStore.activeHaxBody;
    inserts = [];
    hides = 0;
    HAXStore.activeHaxBody = {
      haxInsert: (tag, content, props) => inserts.push([tag, content, props]),
    };
    globalThis.addEventListener("simple-modal-hide", onHide);
  });
  afterEach(() => {
    HAXStore.activeHaxBody = realBody;
    globalThis.removeEventListener("simple-modal-hide", onHide);
    restoreBackend();
  });

  it("several images: chooser, then the same insert as insert:gallery", async () => {
    const el = await filesSection();
    el._toggleRowSelectedByKey("u1", true);
    el._toggleRowSelectedByKey("u2", true);
    await el.updateComplete;
    el.runAction("insert");
    await el.updateComplete;
    el.shadowRoot.querySelector('.choice [data-choice="gallery"]').click();
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(hides).to.equal(1);
    expect(inserts).to.deep.equal([
      [
        "image-gallery",
        '<media-image source="/files/a.png" alt="a.png"></media-image><media-image source="/files/b.jpg" alt="b.jpg"></media-image>',
        { mode: "grid" },
      ],
    ]);
  });

  it("mixed selection inserts each file as insert:standalone did", async () => {
    const el = await filesSection();
    el._toggleRowSelectedByKey("u1", true);
    el._toggleRowSelectedByKey("u3", true);
    el.runAction("insert");
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(el.shadowRoot.querySelector(".choice")).to.not.exist;
    expect(hides).to.equal(1);
    expect(inserts).to.deep.equal([
      ["media-image", "", { source: "/files/a.png", alt: "a.png" }],
      ["media-image", "", { source: "/files/c.pdf", alt: "c.pdf" }],
    ]);
  });
});

describe("haxcms-files-admin-dialog section state", () => {
  beforeEach(stubBackend);
  afterEach(restoreBackend);

  it("reports the selection and its actions", async () => {
    const el = await filesSection();
    setTimeout(() => el._toggleRowSelectedByKey("u3", true));
    const e = await oneEvent(el, "haxcms-admin-section-state");
    expect(e.detail.selected).to.equal(1);
    expect(e.detail.actions.map((a) => a.id)).to.deep.equal([
      "insert",
      "crop",
      "scale",
      "rotate",
      "transform",
      "compress",
      "duplicate",
      "rename",
      "delete",
    ]);
    const byId = {};
    e.detail.actions.forEach((a) => {
      byId[a.id] = a;
    });
    // a PDF alone: the image operations are not offered, as before
    expect(byId.scale.disabled).to.equal(true);
    expect(byId.rotate.disabled).to.equal(true);
    expect(byId.delete.disabled).to.equal(false);
    expect(byId.delete.danger).to.equal(true);
  });

  it("clearSelection deselects and reports zero", async () => {
    const el = await filesSection();
    el._toggleSelectAll(true);
    await el.updateComplete;
    setTimeout(() => el.clearSelection());
    const e = await oneEvent(el, "haxcms-admin-section-state");
    expect(e.detail.selected).to.equal(0);
    expect(el.selectedRows.size).to.equal(0);
  });

  it("drops the bulk select in the shell and keeps it standalone", async () => {
    const inShell = await filesSection(true);
    inShell._toggleSelectAll(true);
    await inShell.updateComplete;
    expect(inShell.shadowRoot.querySelector("hax-file-actions")).to.not.exist;
    const standalone = await filesSection(false);
    standalone._toggleSelectAll(true);
    await standalone.updateComplete;
    expect(standalone.shadowRoot.querySelector("hax-file-actions")).to.exist;
  });

  it("filters still use the same handlers", async () => {
    const el = await filesSection();
    el.shadowRoot.querySelector('.hax-ui-seg [data-type="image"]').click();
    expect(el.filterType).to.equal("image");
    const name = el.shadowRoot.querySelector(
      'input[name="filter-name-contains"]',
    );
    name.value = "cell";
    name.dispatchEvent(new Event("input"));
    expect(el.filterNameContains).to.equal("cell");
  });
});

describe("haxcms-files-admin-dialog in haxcms-site-admin", () => {
  beforeEach(stubBackend);
  afterEach(restoreBackend);

  it("the shell's action bar runs the section's actions", async () => {
    const shell = await fixture(
      html`<haxcms-site-admin
        style="--simple-modal-height: 720px"
      ></haxcms-site-admin>`,
    );
    shell.allowRoute = () => true;
    shell.route = "files";
    await waitUntil(() => shell._sectionEl, "section element created");
    const el = shell._sectionEl;
    expect(el.inShell).to.equal(true);
    el.siteName = "site";
    await el.refreshFiles();
    el._toggleSelectAll(true);
    await el.updateComplete;
    await shell.updateComplete;
    const bar = shell.shadowRoot.querySelector(".ftr.selection");
    expect(bar.textContent).to.contain("3 selected");
    bar.querySelector('[data-action="delete"]').click();
    await settle();
    expect(calls).to.deep.equal(BASELINE["delete:delete"]);
    // the list reloads after the operation and the selection clears
    await shell.updateComplete;
    expect(shell._selected).to.equal(0);
  });
});

// right click (or Shift+F10) on a file opens the bar's actions as a menu,
// as outline-designer's page menu does; each runs the bar's runAction
describe("haxcms-files-admin-dialog file actions menu", () => {
  beforeEach(stubBackend);
  afterEach(restoreBackend);

  const menu = (el) => el.shadowRoot.querySelector(".admin-row-menu");
  const item = (el, action) =>
    menu(el).querySelector(`simple-toolbar-button[data-action="${action}"]`);
  // a pointer or the menu's Enter presses the inner button
  const press = (el, action) =>
    item(el, action).shadowRoot.querySelector("button").click();
  const touchHold = async (el, target, { move = 0, lift = true } = {}) => {
    const r = target.getBoundingClientRect();
    const at = { x: r.x + 4, y: r.y + 4 };
    const fire = (type, dx = 0) =>
      target.dispatchEvent(
        new PointerEvent(type, {
          bubbles: true,
          composed: true,
          cancelable: true,
          pointerType: "touch",
          clientX: at.x + dx,
          clientY: at.y,
        }),
      );
    fire("pointerdown");
    if (move) {
      fire("pointermove", move);
    }
    await new Promise((r2) => setTimeout(r2, 600));
    if (lift) {
      fire("pointerup", move);
    }
    await el.updateComplete;
    await el.updateComplete;
  };
  const rightClick = async (el, tr) => {
    const r = tr.getBoundingClientRect();
    tr.querySelector("td.num").dispatchEvent(
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

  it("a right click on an unselected file selects only it and lists the bar's actions", async () => {
    const el = await filesSection();
    el._toggleSelectAll(false);
    await el.updateComplete;
    const tr = el.shadowRoot.querySelectorAll("tr[data-row-key]")[1];
    const key = tr.getAttribute("data-row-key");
    await rightClick(el, tr);
    expect(menu(el).open).to.equal(true);
    expect([...el.selectedRows]).to.deep.equal([key]);
    const ids = [...menu(el).querySelectorAll("simple-toolbar-button")].map(
      (b) => b.getAttribute("data-action"),
    );
    const barIds = el.selectionActions.map((a) => a.id);
    expect(ids.filter((id) => id !== "open")).to.deep.equal(barIds);
    menu(el).close();
  });

  it("shows the outline-designer keys, and F2 / Ctrl+D / Del run them", async () => {
    const el = await filesSection();
    el._toggleSelectAll(false);
    await el.updateComplete;
    const tr = el.shadowRoot.querySelectorAll("tr[data-row-key]")[1];
    await rightClick(el, tr);
    expect(item(el, "rename").getAttribute("shortcut-label")).to.equal("F2");
    expect(item(el, "duplicate").getAttribute("shortcut-label")).to.equal(
      "CtrlD",
    );
    expect(item(el, "delete").getAttribute("shortcut-label")).to.equal("Del");
    menu(el).close();
    const ran = [];
    el.runAction = (id) => ran.push(id);
    const press = (key, opts = {}) =>
      tr.querySelector("td.num").dispatchEvent(
        new KeyboardEvent("keydown", {
          key,
          bubbles: true,
          composed: true,
          cancelable: true,
          ...opts,
        }),
      );
    press("F2");
    press("d", { ctrlKey: true });
    press("Delete");
    expect(ran).to.deep.equal(["rename", "duplicate", "delete"]);
    expect([...el.selectedRows]).to.deep.equal([
      tr.getAttribute("data-row-key"),
    ]);
  });

  it("a touch long press opens the menu without a contextmenu event (iOS)", async () => {
    const el = await filesSection();
    el._toggleSelectAll(false);
    await el.updateComplete;
    const tr = el.shadowRoot.querySelectorAll("tr[data-row-key]")[1];
    await touchHold(el, tr.querySelector("td.num"));
    expect(menu(el).open).to.equal(true);
    expect([...el.selectedRows]).to.deep.equal([
      tr.getAttribute("data-row-key"),
    ]);
    menu(el).close();
  });

  it("a right click inside a selection keeps the selection", async () => {
    const el = await filesSection();
    el._toggleSelectAll(true);
    await el.updateComplete;
    await rightClick(el, el.shadowRoot.querySelectorAll("tr[data-row-key]")[0]);
    expect(el.selectedRows.size).to.equal(3);
    menu(el).close();
  });

  it("Delete from the menu makes the same calls as the bar", async () => {
    const el = await filesSection();
    el._toggleSelectAll(true);
    await el.updateComplete;
    await rightClick(el, el.shadowRoot.querySelectorAll("tr[data-row-key]")[2]);
    press(el, "delete");
    await settle();
    expect(calls).to.deep.equal(BASELINE["delete:delete"]);
    expect(menu(el).open).to.equal(false);
  });

  it("Scale from the menu opens the same chooser", async () => {
    const el = await filesSection();
    el._toggleSelectAll(true);
    await el.updateComplete;
    await rightClick(el, el.shadowRoot.querySelectorAll("tr[data-row-key]")[0]);
    press(el, "scale");
    await el.updateComplete;
    const option = el.shadowRoot.querySelector('.choice [data-choice="md"]');
    expect(option, "chooser option").to.exist;
    option.click();
    await settle();
    expect(calls).to.deep.equal(BASELINE["scale:md"]);
  });

  it("the context menu key opens it from a focused file", async () => {
    const el = await filesSection();
    const tr = el.shadowRoot.querySelectorAll("tr[data-row-key]")[0];
    const name = tr.querySelector("button.fname");
    name.focus();
    name.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "ContextMenu",
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );
    await el.updateComplete;
    await el.updateComplete;
    expect(menu(el).open).to.equal(true);
    expect(el._rowMenuFor).to.equal(tr.getAttribute("data-row-key"));
    menu(el).close();
  });
});

// the row ⋯, the shared list keyboard and Shift+click ranges: the same
// ways of working as Content and Structure
describe("haxcms-files-admin-dialog list kit", () => {
  beforeEach(stubBackend);
  afterEach(restoreBackend);

  const rows = (el) => [...el.shadowRoot.querySelectorAll("tr[data-row-key]")];
  const key = (tr) => tr.getAttribute("data-row-key");
  const keydown = (target, init) =>
    target.dispatchEvent(
      new KeyboardEvent(
        "keydown",
        Object.assign(
          { bubbles: true, composed: true, cancelable: true },
          init,
        ),
      ),
    );
  const settled = async (el) => {
    await el.updateComplete;
    await el.updateComplete;
  };

  it("the row ⋯ opens the file menu under itself and selects that file", async () => {
    const el = await filesSection();
    const tr = rows(el)[1];
    const more = tr.querySelector(".row-more");
    expect(more, "row ⋯").to.exist;
    expect(more.getAttribute("aria-haspopup")).to.equal("menu");
    expect(more.getAttribute("aria-label")).to.contain(
      tr.querySelector(".nm").textContent,
    );
    more.click();
    await settled(el);
    const menu = el.shadowRoot.querySelector(".admin-row-menu");
    expect(menu.open).to.equal(true);
    expect([...el.selectedRows]).to.deep.equal([key(tr)]);
    // anchored to the ⋯ itself (it flips above when there is no room)
    expect(menu._anchorElement).to.equal(more);
    menu.close();
  });

  it("Space checks the focused row and arrows move to the next row's same control", async () => {
    const el = await filesSection();
    const list = rows(el);
    const name0 = list[0].querySelector("button.fname");
    name0.focus();
    keydown(name0, { key: " " });
    await settled(el);
    expect([...el.selectedRows]).to.deep.equal([key(list[0])]);
    keydown(name0, { key: "ArrowDown" });
    await settled(el);
    expect(el.shadowRoot.activeElement).to.equal(
      list[1].querySelector("button.fname"),
    );
    // Shift+Down extends the selection to the row it moves to
    keydown(list[1].querySelector("button.fname"), {
      key: "ArrowDown",
      shiftKey: true,
    });
    await settled(el);
    expect(el.selectedRows.size).to.equal(3);
    expect(el.shadowRoot.activeElement).to.equal(
      list[2].querySelector("button.fname"),
    );
  });

  it("Ctrl+A checks every file and Escape clears", async () => {
    const el = await filesSection();
    const name = rows(el)[0].querySelector("button.fname");
    keydown(name, { key: "a", ctrlKey: true });
    await settled(el);
    expect(el.selectedRows.size).to.equal(3);
    keydown(name, { key: "Escape" });
    await settled(el);
    expect(el.selectedRows.size).to.equal(0);
  });

  it("Shift+click on a checkbox checks the range from the last one clicked", async () => {
    const el = await filesSection();
    const box = (i) => rows(el)[i].querySelector("input.cb");
    box(0).click();
    await settled(el);
    box(2).dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        composed: true,
        shiftKey: true,
      }),
    );
    await settled(el);
    expect(el.selectedRows.size).to.equal(3);
    // Shift+click again unchecks the range
    box(0).dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        composed: true,
        shiftKey: true,
      }),
    );
    await settled(el);
    expect(el.selectedRows.size).to.equal(0);
    // clicking a name still selects only that file
    rows(el)[1].querySelector("button.fname").click();
    await settled(el);
    expect([...el.selectedRows]).to.deep.equal([key(rows(el)[1])]);
  });

  it("files cards get the ⋯ too", async () => {
    const el = await filesSection();
    el.compact = true;
    await settled(el);
    const card = el.shadowRoot.querySelector("li.card[data-row-key]");
    expect(card.querySelector('[data-action="embed"]')).to.exist;
    card.querySelector(".row-more").click();
    await settled(el);
    expect(el.shadowRoot.querySelector(".admin-row-menu").open).to.equal(true);
    el.shadowRoot.querySelector(".admin-row-menu").close();
  });
});
