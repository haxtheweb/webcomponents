import { expect } from "@open-wc/testing";
import { HAXStore } from "../lib/hax-store.js";

// security: clipboard HTML must be parsed in an inert document and sanitized
// before anything from it is written into the live page. These tests drive
// _onPaste with a fake clipboard event for an inline paste (cursor in the
// middle of a text element) and check that inline event handlers and
// javascript: URLs never reach the editable content.

function makeClipboardEvent(html, text) {
  const data = {
    "text/html": html,
    "text/plain": text || "",
    text: text || "",
  };
  return {
    clipboardData: {
      getData: (type) => data[type] || "",
      items: [],
      files: [],
    },
    preventDefault() {},
    stopPropagation() {},
    stopImmediatePropagation() {},
  };
}

describe("hax-store paste sanitizing", () => {
  let host;
  let p;
  let originals;

  beforeEach(() => {
    originals = {
      editMode: HAXStore.editMode,
      activeHaxBody: HAXStore.activeHaxBody,
      activeNode: HAXStore.activeNode,
      toast: HAXStore.toast,
    };
    HAXStore.toast = () => {};
    host = globalThis.document.createElement("div");
    host.setAttribute("contenteditable", "true");
    p = globalThis.document.createElement("p");
    p.textContent = "hello world";
    host.appendChild(p);
    globalThis.document.body.appendChild(host);
    // _onPaste ignores pastes while BODY is the active element
    host.focus();
    // stub body: paste only needs getRootNode for the selection and
    // positionContextMenus for the cursor helper
    HAXStore.activeHaxBody = {
      getRootNode: () => globalThis.document,
      positionContextMenus() {},
      editMode: true,
    };
    HAXStore.activeNode = p;
    HAXStore.editMode = true;
    // put the cursor in the middle of "hello world" (inline paste)
    const range = globalThis.document.createRange();
    range.setStart(p.firstChild, 5);
    range.collapse(true);
    const sel = globalThis.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  });

  afterEach(() => {
    HAXStore.editMode = originals.editMode;
    HAXStore.activeHaxBody = originals.activeHaxBody;
    HAXStore.activeNode = originals.activeNode;
    HAXStore.toast = originals.toast;
    host.remove();
    delete globalThis.__haxPasteXSS;
  });

  it("strips inline event handlers from pasted HTML", async () => {
    await HAXStore._onPaste(
      makeClipboardEvent(
        '<img src="x" onerror="globalThis.__haxPasteXSS = 1"> <b>bold</b>',
        "bold",
      ),
    );
    // give a (now removed) onerror handler time to fire after the 404
    await new Promise((r) => setTimeout(r, 300));
    expect(globalThis.__haxPasteXSS).to.equal(undefined);
    expect(host.querySelectorAll("[onerror]").length).to.equal(0);
    expect(host.innerHTML.toLowerCase()).to.not.include("onerror");
  });

  it("strips javascript: hrefs from pasted links", async () => {
    await HAXStore._onPaste(
      makeClipboardEvent(
        '<a href="javascript:globalThis.__haxPasteXSS = 2">x</a> <em>y</em>',
        "x y",
      ),
    );
    await new Promise((r) => setTimeout(r, 10));
    expect(globalThis.__haxPasteXSS).to.equal(undefined);
    expect(host.innerHTML.toLowerCase()).to.not.include("javascript:");
    const links = host.querySelectorAll("a");
    for (let i = 0; i < links.length; i++) {
      expect(links[i].hasAttribute("href")).to.equal(false);
    }
  });

  it("keeps legitimate inline formatting", async () => {
    await HAXStore._onPaste(
      makeClipboardEvent(
        // span wrapper: clipboard clean up changes the markup, so HAX (not the
        // browser's native paste) inserts the result, as Word / GDocs pastes do
        '<strong>bold</strong> and <span><a href="https://haxtheweb.org/">a link</a></span>',
        "bold and a link",
      ),
    );
    await new Promise((r) => setTimeout(r, 10));
    expect(host.querySelector("strong")).to.exist;
    const a = host.querySelector("a");
    expect(a).to.exist;
    expect(a.getAttribute("href")).to.equal("https://haxtheweb.org/");
  });
});
