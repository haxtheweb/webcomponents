/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { css, LitElement } from "lit";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
//import { IntersectionObserverMixin } from "@lrnwebcomponents/intersection-element/lib/IntersectionObserverMixin.js";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "./lib/page-break-manager.js";
// might be optional / using hooks to check in or a manager that does this
//import { HAXStore } from "@lrnwebcomponents/hax-body/lib/hax-store.js";
//import { toJS, autorun } from "mobx";
/**
  * `page-break`
  * `a visual break but also helps manage hierarchy`
  * Needs a uuid
    Path/node / it's actually the route!

    Could have intersection observer of visibility or test on scroll / resize

    Maybe intersection while NOT scrolling/resizing and denounce it

    Need a attribute for new or create it delete. Delete doesn't happen immediate IF it already existed. This way we can parse out and remove on backend.

    If brand new we can delete immediately

    It has a title Dom node AFTER itself in the tree

    Maybe an attribute for subpage or break type

    Make a static demo with content premocked up

    Need to have 2 modes. 1 mode the page break injects a locked page-title tag in slot
    Mode 2 the page break controls a heading after it

  * @demo demo/index.html
  * @element page-break
  */
export class PageBreak extends I18NMixin(SchemaBehaviors(LitElement)) {
  static get tag() {
    return "page-break";
  }
  constructor() {
    super();
    this.t = {
      newPage: "New page",
    };
    this.title = this.t.newPage;
    this.path = "#";
  }
  static get properties() {
    return {
      ...super.properties,
      title: { type: String, reflect: true },
      path: { type: String },
      parent: { type: String, reflect: true },
    };
  }
  connectedCallback() {
    super.connectedCallback();
    if (
      this.nextElementSibling &&
      this.nextElementSibling.tagName &&
      ["H1", "H2", "H3", "H4", "H5", "H6"].includes(
        this.nextElementSibling.tagName
      )
    ) {
      this.title = this.nextElementSibling.innerText;
      this.target = this.nextElementSibling;
    } else {
      // @todo need to have logic to figure out what headings proceed this one
      // HAX should be able to tell us this
      this.target = document.createElement("h2");
      this.target.innerText = this.title;
      this.target.setAttribute("data-hax-lock", true);
      this.parentNode.insertBefore(this.target, this.nextElementSibling);
    }
    this.observer = new MutationObserver(() => {
      if (this.title != this.target.innerText) {
        this.title = this.target.innerText;
      }
    });
    this.observer.observe(this.target, {
      characterData: true,
      childList: true,
      subtree: true,
    });
    window.dispatchEvent(
      new CustomEvent("page-break-registration", {
        composed: true,
        bubbles: true,
        cancelable: true,
        detail: {
          value: this,
          action: "add",
        },
      })
    );
    window.dispatchEvent(
      new CustomEvent("page-break-change", {
        composed: true,
        bubbles: true,
        cancelable: true,
        detail: {
          value: this,
        },
      })
    );
  }
  disconnectedCallback() {
    window.dispatchEvent(
      new CustomEvent("page-break-registration", {
        detail: {
          value: this,
          action: "remove",
        },
      })
    );
    window.dispatchEvent(
      new CustomEvent("page-break-change", {
        composed: true,
        bubbles: true,
        cancelable: true,
        detail: {
          value: this,
        },
      })
    );
    this.observer.disconnect();
    super.disconnectedCallback();
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (this.target) {
        if (propName === "title" && this[propName]) {
          // change title text to match title if updated
          // @todo we need to ensure that when the text of titleTag changes
          // that we update the title to match
          // mutationObserver on the tag monitoring just text changes
          this.target.innerText = this[propName];
        }
        if (["title", "parent", "path"].includes(propName)) {
          window.dispatchEvent(
            new CustomEvent("page-break-change", {
              composed: true,
              bubbles: true,
              cancelable: true,
              detail: {
                value: this,
              },
            })
          );
        }
      }
    });
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
          margin: 20px 0;
          padding: 20px;
          opacity: 0.6;
        }
        .mid {
          border: none;
          border-top: 3px dashed #2222ff;
          overflow: visible;
          margin: 0;
          padding: 0;
          height: 0;
        }
        :host(:hover) {
          opacity: 1;
        }
        :host(:hover) .mid::before {
          font-weight: bold;
          content: "Page break";
          color: #2222ff;
          background-color: #ffffff;
          font-size: 18px;
          left: calc(50% - 2.5em);
          top: -18px;
        }
        .mid::before {
          content: "📃";
          position: relative;
          height: 0;
          font-size: 36px;
          line-height: 36px;
          left: calc(50% - 0.5em);
          top: -0.5em;
        }
      `,
    ];
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    const hr = document.createElement("hr");
    hr.classList.add("mid");
    this.shadowRoot.appendChild(hr);
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/page-break.haxProperties.json`, import.meta.url).href;
  }
}
customElements.define(PageBreak.tag, PageBreak);
