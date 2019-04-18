/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
/**
 * `site-print-button`
 * `Dynamic print button to request and generate what to print`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SitePrintButton extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "site-print-button";
  }
  constructor() {
    super();
    import("@polymer/paper-tooltip/paper-tooltip.js");
    import("@polymer/paper-icon-button/paper-icon-button.js");
  }
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          text-rendering: optimizelegibility;
          position: relative;
        }
        paper-icon-button {
          @apply --site-print-button-button;
        }
        paper-icon-button:hover,
        paper-icon-button:focus,
        paper-icon-button:active {
          @apply --site-print-button-button-hover;
        }
        paper-tooltip {
          @apply --site-print-button-tooltip;
        }
      </style>
      <paper-icon-button
        id="btn"
        icon="[[icon]]"
        on-click="print"
        title$="[[label]]"
      ></paper-icon-button>
      <paper-tooltip for="btn" position="[[position]]" offset="14">
        [[label]]
      </paper-tooltip>
    `;
  }
  /**
   * Props
   */
  static get properties() {
    return {
      /**
       * icon
       */
      icon: {
        type: String,
        value: "icons:print"
      },
      /**
       * label for the button
       */
      label: {
        type: String
      },
      /**
       * label for the button
       */
      position: {
        type: String,
        value: "bottom"
      },
      /**
       * How much do you want to print right now
       */
      type: {
        type: String,
        value: "page",
        observer: "_typeChanged"
      }
    };
  }
  /**
   * ensure we have a label set per type if its empty
   */
  _typeChanged(newValue) {
    if (typeof this.label === typeof undefined) {
      if (newValue === "page" || newValue === "site") {
        this.label = `Print ${newValue}`;
      } else {
        this.label = `Print outline`;
      }
    }
  }
  /**
   * Print the type in question
   */
  async print(e) {
    // now dynamic import the footer so we don't bloat all other page loads
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/layout/site-footer.js");
    const type = this.type;
    let content = "";
    if (type === "page") {
      // oh there you are
      content = `
      <h1>${store.activeItem.title}</h1>
      <div>${store.activeItemContent}</div>`;
    } else if (type === "parent") {
      // everything from the parent of this page, down
      const result = store.computeItems(
        1,
        100,
        store.activeId,
        "parent",
        store.routerManifest,
        true
      );
      for (var i in result) {
        content += await fetch("pages/" + result[i].location + "/index.html")
          .then(function(response) {
            return response.text();
          })
          .then(function(response) {
            let indent = result[i].indent + 1;
            if (indent > 6) {
              indent = 6;
            }
            return `<h${indent}>${result[i].title}</h${indent}>
              ${response}`;
          });
      }
    } else if (type === "ancestor") {
      // everything from highest parent
      const result = store.computeItems(
        1,
        100,
        store.activeId,
        "ancestor",
        store.routerManifest,
        true
      );
      for (var i in result) {
        content += await fetch("pages/" + result[i].location + "/index.html")
          .then(function(response) {
            return response.text();
          })
          .then(function(response) {
            let indent = result[i].indent + 1;
            if (indent > 6) {
              indent = 6;
            }
            return `<h${indent}>${result[i].title}</h${indent}>
              ${response}`;
          });
      }
    } else if (type === "site") {
      const result = store.routerManifest.items;
      for (var i in result) {
        content += await fetch("pages/" + result[i].location + "/index.html")
          .then(function(response) {
            return response.text();
          })
          .then(function(response) {
            let indent = result[i].indent + 1;
            if (indent > 6) {
              indent = 6;
            }
            return `<h${indent}>${result[i].title}</h${indent}>
              ${response}`;
          });
      }
    }
    // get current date
    var currentdate = new Date();
    var datetime =
      "Printed on: " +
      currentdate.getDate() +
      "/" +
      (currentdate.getMonth() + 1) +
      "/" +
      currentdate.getFullYear() +
      " at " +
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes() +
      ":" +
      currentdate.getSeconds();
    let element = document.createElement("div");
    element.innerHTML = `
<style>
  @media print {
    body {
      padding: 0 15px 5px;
      color: #000;
      background-color: #ffffff;
      border-top: 1px solid #aaa;
    }
  }
</style>
<h1>${store.siteTitle}</h1>
<site-footer></site-footer>
<p>${datetime}</p>
${content}`;
    // From https://stackoverflow.com/questions/1071962/how-do-i-print-part-of-a-rendered-html-page-in-javascript#answer-1072151
    let print = window.open(
      "",
      "",
      "left=0,top=0,width=800,height=800,toolbar=0,scrollbars=0,status =0"
    );
    // ensure base tag moves with it if set
    if (document.head.getElementsByTagName("base")) {
      let base = document.createElement("base");
      base.href = document.head
        .getElementsByTagName("base")[0]
        .getAttribute("href");
      print.document.head.appendChild(base);
    }
    print.document.body.appendChild(element);
    print.document.close();
    print.focus();
    print.print();
    print.close();
  }
}
window.customElements.define(SitePrintButton.tag, SitePrintButton);
export { SitePrintButton };
