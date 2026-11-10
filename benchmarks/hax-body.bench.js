/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE.md for full text.
 *
 * hax-body: a realistic ~300 element page of mixed blocks (headings, text,
 * lists, quotes, tables, images, nested grid-plates) imported into a fresh
 * hax-body, then edit mode entered until every block is editable, as the
 * HAXcms editor does when someone presses Edit.
 */
import "@haxtheweb/hax-body/hax-body.js";
import "@haxtheweb/grid-plate/grid-plate.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import { run, settle, frame } from "./lib/bench.js";

const PIXEL = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

function section(i) {
  return (
    "<h2>Section " +
    i +
    "</h2>" +
    "<p>Paragraph " +
    i +
    ' with <a href="https://example.com/' +
    i +
    '">a link</a>, <strong>bold</strong> and <em>emphasis</em>.</p>' +
    "<ul><li>First point</li><li>Second point</li><li>Third point</li></ul>" +
    '<grid-plate layout="1-1">' +
    '<p slot="col-1">Left column ' +
    i +
    "</p>" +
    '<div slot="col-2"><img src="' +
    PIXEL +
    '" alt="pixel ' +
    i +
    '"><p>Caption ' +
    i +
    "</p></div>" +
    "</grid-plate>" +
    "<blockquote>A quote worth reading, number " +
    i +
    ".</blockquote>" +
    "<h3>Details</h3>" +
    "<ol><li>Step one</li><li>Step two</li></ol>" +
    "<table><caption>Data " +
    i +
    "</caption><tr><th>A</th><th>B</th></tr><tr><td>1</td><td>2</td></tr></table>"
  );
}

let content = "";
for (let i = 0; i < 12; i++) {
  content += section(i);
}

async function untilEditable(body) {
  const start = performance.now();
  for (;;) {
    const all = body.querySelectorAll("p, h2, img, grid-plate");
    let missing = 0;
    for (let i = 0; i < all.length; i++) {
      if (!all[i].hasAttribute("data-hax-ray")) {
        missing++;
      }
    }
    if (all.length > 0 && missing === 0) {
      return;
    }
    if (performance.now() - start > 20000) {
      throw new Error(missing + " elements never became editable");
    }
    await frame();
  }
}

// Without the editor's hax-tray on the page, focusing the first block logs one
// "trayDetail" error from hax-body's focus handler; it does not change what
// is measured.
run({
  async setup() {
    // the app store registers grid-plate as a layout in the real editor
    if (!HAXStore.validGridTagList.includes("grid-plate")) {
      HAXStore.validGridTagList.push("grid-plate");
    }
    const body = document.createElement("hax-body");
    document.getElementById("host").appendChild(body);
    await settle(body);
    return { body };
  },
  async firstRender({ body }) {
    const ready = new Promise((resolve) => {
      body.addEventListener("hax-body-content-ready", resolve, { once: true });
    });
    body.importContent(content);
    await ready;
    await settle(body);
  },
  async update({ body }) {
    body.editMode = true;
    await untilEditable(body);
    await settle(body);
  },
});
