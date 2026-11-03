import { expect } from "@open-wc/testing";
import "../lib/core/haxcms-site-editor-ui.js";

// copyCurrentPageShareLink falls back to a temporary textarea when the
// async clipboard is unavailable; that textarea must hold exactly the link.
describe("haxcms-site-editor-ui share link copy fallback", () => {
  it("copies exactly the share link when the clipboard API fails", async () => {
    const ui = globalThis.document.createElement("haxcms-site-editor-ui");
    const link = "https://example.org/site/welcome?x=1";
    const clipboard = globalThis.navigator.clipboard;
    const originalWrite = clipboard ? clipboard.writeText : null;
    if (clipboard) {
      clipboard.writeText = async () => {
        throw new Error("denied");
      };
    }
    const originalExec = globalThis.document.execCommand;
    let copied = null;
    globalThis.document.execCommand = (command) => {
      const active = globalThis.document.activeElement;
      if (command === "copy" && active && active.tagName === "TEXTAREA") {
        copied = active.value;
      }
      return true;
    };
    try {
      await ui.copyCurrentPageShareLink(link, "Welcome");
    } finally {
      globalThis.document.execCommand = originalExec;
      if (clipboard) {
        clipboard.writeText = originalWrite;
      }
    }
    expect(copied).to.equal(link);
    expect(globalThis.document.body.querySelector(":scope > textarea")).to.not
      .exist;
  });
});
