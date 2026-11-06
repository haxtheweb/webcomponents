import { expect } from "@open-wc/testing";
import * as utils from "../utils.js";
import * as storage from "../lib/storage.js";
import * as sanitize from "../lib/sanitize.js";
import * as url from "../lib/url.js";
import * as safeHtml from "../lib/safe-html.js";

// first-paint code imports these lib files directly instead of the utils
// barrel; utils.js must keep exporting the very same functions
describe("utils deep imports", () => {
  it("utils.js re-exports the storage helpers", () => {
    for (const name of [
      "localStorageGet",
      "localStorageSet",
      "localStorageDelete",
    ]) {
      expect(utils[name], name).to.equal(storage[name]);
    }
  });

  it("utils.js re-exports every sanitizer", () => {
    const names = Object.keys(sanitize);
    expect(names).to.include.members([
      "badJSEventAttributes",
      "badIFrameAttributes",
      "badContentElements",
      "isEventHandlerAttribute",
      "removeUnsafeElements",
      "isURLAttribute",
      "removeUnsafeURLAttributes",
      "removeUnsafeIframeAttributes",
      "removeBadJSEventAttributes",
      "sanitizeNodeTree",
      "neutralizeStrayScripts",
      "sanitizeHTMLForImport",
      "sanitizeHTMLString",
      "safeNavigateHref",
    ]);
    for (const name of names) {
      expect(utils[name], name).to.equal(sanitize[name]);
    }
  });

  it("utils.js re-exports validURL, encapScript and findTagsInHTML", () => {
    expect(utils.validURL).to.equal(url.validURL);
    expect(utils.encapScript).to.equal(safeHtml.encapScript);
    expect(utils.findTagsInHTML).to.equal(safeHtml.findTagsInHTML);
  });

  it("storage helpers still never throw and round-trip JSON", () => {
    storage.localStorageSet("utils-deep-imports-test", { a: 1 });
    expect(storage.localStorageGet("utils-deep-imports-test")).to.deep.equal({
      a: 1,
    });
    storage.localStorageDelete("utils-deep-imports-test");
    expect(storage.localStorageGet("utils-deep-imports-test", "none")).to.equal(
      "none",
    );
  });

  it("parses untrusted HTML without running or loading it", async () => {
    globalThis.__sanitizeProbe = 0;
    const raw = '<img src="data:," onload="globalThis.__sanitizeProbe++">';
    const frag = sanitize.sanitizeHTMLForImport(raw);
    const str = sanitize.sanitizeHTMLString(raw);
    await new Promise((r) => setTimeout(r, 50));
    expect(globalThis.__sanitizeProbe).to.equal(0);
    expect(str).to.not.contain("onload");
    // fragment rules: a lone table cell survives
    const cell = sanitize.sanitizeHTMLForImport("<td>cell</td>");
    expect(cell.querySelector("td").textContent).to.equal("cell");
    // the result can go straight into the page
    const host = globalThis.document.createElement("div");
    host.appendChild(frag);
    expect(host.querySelector("img").ownerDocument).to.equal(
      globalThis.document,
    );
    delete globalThis.__sanitizeProbe;
  });
});
