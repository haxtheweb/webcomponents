/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE.md for full text.
 *
 * grid-plate: 50 three column grid-plates with text and images in each
 * column, then every grid switched to a two column (1-2) layout.
 */
import "@haxtheweb/grid-plate/grid-plate.js";
import { run, settle } from "./lib/bench.js";

const COUNT = 50;
const PIXEL = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

function plate(i) {
  let cols = "";
  for (let c = 1; c <= 3; c++) {
    cols +=
      '<div slot="col-' +
      c +
      '"><h3>Column ' +
      c +
      "</h3><p>Grid " +
      i +
      ' text with <a href="#x">a link</a> and <strong>bold</strong> words.</p>' +
      '<img src="' +
      PIXEL +
      '" alt="pixel" width="40" height="40"></div>';
  }
  return '<grid-plate layout="1-1-1">' + cols + "</grid-plate>";
}

run({
  setup() {
    let markup = "";
    for (let i = 0; i < COUNT; i++) {
      markup += plate(i);
    }
    const tpl = document.createElement("template");
    tpl.innerHTML = markup;
    return { host: document.getElementById("host"), tpl };
  },
  async firstRender({ host, tpl }) {
    host.appendChild(document.importNode(tpl.content, true));
    await settle(host);
    if (host.querySelectorAll("grid-plate").length !== COUNT) {
      throw new Error("grid-plate did not render");
    }
  },
  async update({ host }) {
    const plates = host.querySelectorAll("grid-plate");
    for (let i = 0; i < plates.length; i++) {
      plates[i].layout = "1-2";
    }
    await settle(host);
  },
});
