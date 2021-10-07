/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css, LitElement } from "lit";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
//import { IntersectionObserverMixin } from "@lrnwebcomponents/intersection-element/lib/IntersectionObserverMixin.js";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";

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
    this.editMode = false;
    this.title = this.t.newPage;
  }
  static get properties() {
    return {
      title: { type: String, reflect: true },
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
      this.titleTag = this.nextElementSibling;
    } else {
      console.log("else");
      // @todo need to have logic to figure out what headings proceed this one
      // HAX should be able to tell us this
      this.titleTag = document.createElement("h2");
      this.titleTag.innerText = this.title;
      this.parentNode.insertBefore(this.titleTag, this.nextElementSibling);
    }
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (this.titleTag && propName === "title" && this[propName]) {
        // change title text to match title if updated
        // @todo we need to ensure that when the text of titleTag changes
        // that we update the title to match
        // mutationObserver on the tag monitoring just text changes
        this.titleTag.innerText = this[propName];
      }
    });
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
          margin: 40px 20px;
        }
        .wrap {
        }
        .top {
          height: 30px;
          border-style: solid;
          border-color: black;
          border-width: 1px 0 0 0;
          border-radius: 20px;
        }
        .top:before {
          display: block;
          content: "";
          height: 30px;
          margin-top: -31px;
          border-style: solid;
          border-color: black;
          border-width: 0 0 1px 0;
          border-radius: 20px;
        }
        .mid {
          border: 1px dotted blue;
        }
        .bottom {
          height: 30px;
          border-style: solid;
          border-color: black;
          border-width: 1px 0 0 0;
          border-radius: 20px;
        }
        .bottom:before {
          display: block;
          content: "";
          height: 30px;
          margin-top: -31px;
          border-style: solid;
          border-color: black;
          border-width: 0 0 1px 0;
          border-radius: 20px;
        }
      `,
    ];
  }
  render() {
    return html`
      <div class="wrap">
        <hr class="top" />
        <hr class="mid" />
        <hr class="bottom" />
      </div>
    `;
  }
}
customElements.define(PageBreak.tag, PageBreak);
