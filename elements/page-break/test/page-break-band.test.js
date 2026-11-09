import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import "../page-break.js";
// pre-load the dynamically imported editing UI so toolbar buttons upgrade
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
import "@haxtheweb/simple-fields/lib/simple-context-menu.js";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
// simple-toolbar-button overrides click(); press its inner button the way a
// user does so the composed click reaches the band listener
const press = (toolbarButton) =>
  toolbarButton.shadowRoot.querySelector("button").click();
// every network fetch of the lazily loaded band module so far
const bandRequests = () =>
  globalThis.performance
    .getEntriesByType("resource")
    .filter((entry) => entry.name.includes("lib/page-break-band.js"));
const bandRow = (el) => el.shadowRoot.querySelector(".pb-row");

// these run first, in a fresh page, before anything has edited a page-break
describe("page-break band: visitors", () => {
  it("does not download or render the band outside of edit mode", async () => {
    const el = await fixture(
      html`<page-break
        title="Visitor"
        slug="visitor"
        link-url="https://example.com"
      ></page-break>`,
    );
    el.isLoggedIn = true;
    await el.updateComplete;
    await wait(250);
    expect(bandRequests().length).to.equal(0);
    expect(bandRow(el)).to.equal(null);
    expect(el.shadowRoot.querySelector("button.pb")).to.equal(null);
    // what visitors get is unchanged: the anchor, hidden link details and,
    // when logged in, the page actions menu
    expect(el.shadowRoot.querySelector("a.sr-only").textContent).to.equal(
      "Visitor",
    );
    const info = el.shadowRoot.querySelector(".link-info");
    expect(getComputedStyle(info).display).to.equal("none");
    expect(el.shadowRoot.querySelector("#pageactionsbtn") === null).to.equal(
      false,
    );
    // no band styles were added to the shadow root
    expect(el.shadowRoot.adoptedStyleSheets.length).to.equal(1);
  });

  // HAXcms swaps the viewer for the editor once the editable copy reports
  // updateComplete, so the first band download has to be part of it or the
  // band pops in after the swap and pushes the page down (issues#3263)
  it("updateComplete includes the first band download", async () => {
    const el = await fixture(html`<page-break title="First"></page-break>`);
    await wait(50);
    expect(bandRequests().length).to.equal(0);
    el.haxeditModeChanged(true);
    await el.updateComplete;
    expect(bandRow(el)).to.not.equal(null);
    expect(el.shadowRoot.adoptedStyleSheets.length).to.equal(2);
    el.haxeditModeChanged(false);
    await el.updateComplete;
  });

  it("loads the band when HAX edit mode turns on", async () => {
    const el = await fixture(html`<page-break title="Toggle"></page-break>`);
    await wait(100);
    expect(bandRow(el)).to.equal(null);
    el.haxeditModeChanged(true);
    el.setAttribute("data-hax-ray", "page-break");
    await waitUntil(() => bandRow(el), "band did not render");
    expect(bandRequests().length).to.equal(1);
    expect(getComputedStyle(bandRow(el)).display).to.equal("flex");
    expect(el.shadowRoot.adoptedStyleSheets.length).to.equal(2);
    // toggling edit mode off and on again keeps a single copy of the styles
    el.removeAttribute("data-hax-ray");
    el.haxeditModeChanged(false);
    await el.updateComplete;
    expect(getComputedStyle(bandRow(el)).display).to.equal("none");
    el.setAttribute("data-hax-ray", "page-break");
    el.haxeditModeChanged(true);
    await el.updateComplete;
    expect(getComputedStyle(bandRow(el)).display).to.equal("flex");
    expect(el.shadowRoot.adoptedStyleSheets.length).to.equal(2);
    expect(bandRequests().length).to.equal(1);
  });
});

describe("page-break band: entering edit mode", () => {
  it("loads from the data-hax-ray attribute alone", async () => {
    const el = await fixture(html`<page-break title="Ray"></page-break>`);
    await wait(50);
    el.setAttribute("data-hax-ray", "page-break");
    await waitUntil(() => bandRow(el), "band did not render");
    expect(el._haxState).to.equal(false);
  });

  it("loads from the editModeChanged hook alone", async () => {
    const el = await fixture(html`<page-break title="Hook"></page-break>`);
    await wait(50);
    el.haxeditModeChanged(true);
    await waitUntil(() => bandRow(el), "band did not render");
  });

  it("renders straight away when created already in edit mode", async () => {
    const el = await fixture(
      html`<page-break
        title="Born editing"
        data-hax-ray="page-break"
      ></page-break>`,
    );
    await waitUntil(() => bandRow(el), "band did not render");
    expect(getComputedStyle(bandRow(el)).display).to.equal("flex");
    const created = globalThis.document.createElement("page-break");
    created.setAttribute("data-hax-ray", "page-break");
    created.setAttribute("title", "Created");
    globalThis.document.body.appendChild(created);
    await waitUntil(() => bandRow(created), "band did not render");
    expect(
      created.shadowRoot.querySelector(".pb-title-text").textContent,
    ).to.equal("Created");
    created.remove();
  });
});

describe("page-break band: editing paths", () => {
  let savedCmsSiteEditor;
  let editorCalls;
  beforeEach(() => {
    savedCmsSiteEditor = store.cmsSiteEditor;
    editorCalls = [];
    store.cmsSiteEditor = {
      haxCmsSiteEditorUIElement: {
        _editButtonTap: (...args) => {
          editorCalls.push(["edit", args]);
        },
        _cancelButtonTap: (...args) => {
          editorCalls.push(["cancel", args]);
        },
      },
    };
  });
  afterEach(() => {
    store.cmsSiteEditor = savedCmsSiteEditor;
  });

  const editingBreak = async () => {
    const el = await fixture(
      html`<page-break
        title="Edit me"
        slug="edit-me"
        tags="one"
        locked
      ></page-break>`,
    );
    el.isLoggedIn = true;
    el.setAttribute("data-hax-ray", "page-break");
    el.haxeditModeChanged(true);
    await waitUntil(() => el.shadowRoot.querySelector(".save-button"));
    await el.updateComplete;
    return el;
  };

  it("renders the same band markup, labels and state", async () => {
    const el = await editingBreak();
    const band = el.shadowRoot.querySelector(".pb-row > button.pb");
    expect(band.getAttribute("type")).to.equal("button");
    expect(band.getAttribute("title")).to.equal("Select to edit Page details");
    expect(band.getAttribute("aria-label")).to.equal(
      "Edit me, Page settings. Draft, Locked, 1 tag, /edit-me",
    );
    expect(
      Array.from(band.children).map((child) => child.className),
    ).to.deep.equal([
      "pb-rule lead",
      "pb-title",
      "pb-meta",
      "pb-rule",
      "pb-key",
      "pb-action",
    ]);
    expect(band.querySelector(".pb-key").textContent).to.equal("Enter");
    expect(band.querySelector(".pb-action-rest").textContent).to.equal(
      "Page settings",
    );
    const save = el.shadowRoot.querySelector(".pb-tools .save-button");
    const cancel = el.shadowRoot.querySelector(".pb-tools .cancel-button");
    expect(save.getAttribute("icon")).to.equal("icons:save");
    expect(save.getAttribute("label")).to.equal("Save page");
    expect(cancel.getAttribute("icon")).to.equal("icons:cancel");
    expect(cancel.getAttribute("label")).to.equal("Cancel");
    // band state stays reactive to the host
    el.locked = false;
    el.published = true;
    await el.updateComplete;
    expect(band.getAttribute("aria-label")).to.equal(
      "Edit me, Page settings. Published, Unlocked, 1 tag, /edit-me",
    );
  });

  it("saves through the editor UI from the band save button", async () => {
    const el = await editingBreak();
    await el.shadowRoot.querySelector(".save-button").updateComplete;
    press(el.shadowRoot.querySelector(".save-button"));
    expect(editorCalls.length).to.equal(1);
    expect(editorCalls[0][0]).to.equal("edit");
  });

  it("cancels through the editor UI with the click event", async () => {
    const el = await editingBreak();
    const cancel = el.shadowRoot.querySelector(".cancel-button");
    await cancel.updateComplete;
    let seen = null;
    cancel.addEventListener("click", (e) => {
      seen = e;
    });
    press(cancel);
    expect(editorCalls.length).to.equal(1);
    expect(editorCalls[0][0]).to.equal("cancel");
    const evt = editorCalls[0][1][0];
    expect(evt.type).to.equal("click");
    // the same click event the button received is handed to the editor UI
    expect(evt === seen).to.equal(true);
  });

  it("lets a band click reach HAX for selection and keeps Enter local", async () => {
    const el = await editingBreak();
    const band = el.shadowRoot.querySelector("button.pb");
    let clicks = 0;
    el.addEventListener("click", () => {
      clicks++;
    });
    band.click();
    expect(clicks).to.equal(1);
    let keys = 0;
    const listener = () => {
      keys++;
    };
    globalThis.addEventListener("keydown", listener);
    band.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
        composed: true,
      }),
    );
    band.dispatchEvent(
      new KeyboardEvent("keydown", { key: " ", bubbles: true, composed: true }),
    );
    band.dispatchEvent(
      new KeyboardEvent("keydown", { key: "a", bubbles: true, composed: true }),
    );
    globalThis.removeEventListener("keydown", listener);
    expect(keys).to.equal(1);
    expect(editorCalls.length).to.equal(0);
  });

  it("hides save / cancel when edit mode turns off", async () => {
    const el = await editingBreak();
    el.haxeditModeChanged(false);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".save-button")).to.equal(null);
    expect(el.shadowRoot.querySelector("#pageactionsbtn") === null).to.equal(
      false,
    );
  });
});
