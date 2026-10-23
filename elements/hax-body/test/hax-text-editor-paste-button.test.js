import { fixture, expect, html } from "@open-wc/testing";

import "../lib/hax-text-editor-paste-button.js";
import { HAXStore } from "../lib/hax-store.js";

// RichTextEditor behaviors call getRangeAt(0) during render; we need a
// valid selection range in the document before the element renders.
function setupSelection() {
  const selNode = globalThis.document.createElement("div");
  selNode.textContent = "selection target";
  globalThis.document.body.appendChild(selNode);
  const range = globalThis.document.createRange();
  range.selectNodeContents(selNode);
  const sel = globalThis.getSelection();
  if (sel) {
    sel.removeAllRanges();
    sel.addRange(range);
  }
  return selNode;
}

function teardownSelection(node) {
  if (node && node.parentNode) {
    node.parentNode.removeChild(node);
  }
  const sel = globalThis.getSelection();
  if (sel) sel.removeAllRanges();
}

describe("hax-text-editor-paste-button", () => {
  let el;
  let selNode;
  beforeEach(async () => {
    selNode = setupSelection();
    el = await fixture(
      html`<hax-text-editor-paste-button></hax-text-editor-paste-button>`,
    );
    await el.updateComplete;
  });

  afterEach(() => {
    teardownSelection(selNode);
  });

  it("instantiates with default props", () => {
    expect(el.tagName.toLowerCase()).to.equal("hax-text-editor-paste-button");
    expect(el.command).to.equal("paste");
    expect(el.icon).to.equal("content-paste");
    expect(el.label).to.equal("Paste Clipboard");
  });

  describe("sendCommand", () => {
    async function withClipboard(fakeClipboard, fn) {
      let receivedArg = null;
      const originalOnPaste = HAXStore._onPaste;
      HAXStore._onPaste = (arg) => {
        receivedArg = arg;
      };
      const originalClipboard = globalThis.navigator.clipboard;
      Object.defineProperty(globalThis.navigator, "clipboard", {
        value: fakeClipboard,
        configurable: true,
      });
      try {
        await fn();
      } finally {
        HAXStore._onPaste = originalOnPaste;
        Object.defineProperty(globalThis.navigator, "clipboard", {
          value: originalClipboard,
          configurable: true,
        });
      }
      return receivedArg;
    }

    it("reads the clipboard and gives _onPaste something with getData (was BUG: passed navigator.clipboard)", async () => {
      const fake = {
        read: () =>
          Promise.resolve([
            {
              types: ["text/html", "text/plain"],
              getType: (t) =>
                Promise.resolve(
                  new Blob([t === "text/html" ? "<b>hi</b>" : "hi"]),
                ),
            },
          ]),
        readText: () => Promise.resolve("hi"),
      };
      const arg = await withClipboard(fake, () => el.sendCommand({}));
      expect(arg.clipboardData).to.not.equal(fake);
      expect(arg.clipboardData.getData("text/html")).to.equal("<b>hi</b>");
      expect(arg.clipboardData.getData("text/plain")).to.equal("hi");
      expect(arg.clipboardData.getData("text")).to.equal("hi");
      expect(arg.preventDefault).to.be.a("function");
    });

    it("falls back to readText when clipboard.read is unavailable (Firefox/Safari)", async () => {
      const fake = { readText: () => Promise.resolve("plain only") };
      const arg = await withClipboard(fake, () => el.sendCommand({}));
      expect(arg.clipboardData.getData("text/plain")).to.equal("plain only");
      expect(arg.clipboardData.getData("text/html")).to.equal("");
    });

    it("does not call _onPaste when the clipboard cannot be read", async () => {
      const fake = {
        readText: () => Promise.reject(new Error("denied")),
      };
      const originalWarn = console.warn;
      console.warn = () => {};
      let arg;
      try {
        arg = await withClipboard(fake, () => el.sendCommand({}));
      } finally {
        console.warn = originalWarn;
      }
      expect(arg).to.equal(null);
    });
  });

  describe("sendCommand without clipboard", () => {
    it("does not call _onPaste when navigator.clipboard is missing", async () => {
      let called = false;
      const originalOnPaste = HAXStore._onPaste;
      HAXStore._onPaste = () => {
        called = true;
      };
      const originalClipboard = globalThis.navigator.clipboard;
      Object.defineProperty(globalThis.navigator, "clipboard", {
        value: undefined,
        configurable: true,
      });
      await el.sendCommand({});
      expect(called).to.equal(false);
      HAXStore._onPaste = originalOnPaste;
      Object.defineProperty(globalThis.navigator, "clipboard", {
        value: originalClipboard,
        configurable: true,
      });
    });
  });
});
