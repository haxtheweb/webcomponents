/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "../src/simple-colors.js";
let getTable = function() {
  let table = document.createElement("table"),
    colors = [
      "accent",
      "grey",
      "red",
      "pink",
      "purple",
      "deep-purple",
      "indigo",
      "blue",
      "light-blue",
      "cyan",
      "teal",
      "green",
      "light-green",
      "lime",
      "yellow",
      "amber",
      "orange",
      "deep-orange",
      "brown",
      "blue-grey"
    ];
  table.setAttribute("border-spacing", "0");
  for (let i = 0; i < colors.length; i++) {
    let tr = document.createElement("tr");
    for (let j = 1; j < 13; j++) {
      let k = j > 6 ? 1 : 12,
        td = document.createElement("td");
      td.style.color = "var(--simple-colors-default-theme-grey-" + k + ")";
      td.style.backgroundColor =
        "var(--simple-colors-default-theme-" + colors[i] + "-" + j + ")";
      td.innerHTML = colors[i] + "-" + j;
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  return table;
};
let $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");
$_documentContainer.innerHTML = `<style>
  table {
      width: 100%;
      border-collapse: collapse;
      border: 2px solid #888;
  }
  table td {
      padding: 3px;
      border: 1px solid #888;
  }
</style>
${getTable()}
`;
document.head.appendChild($_documentContainer);
