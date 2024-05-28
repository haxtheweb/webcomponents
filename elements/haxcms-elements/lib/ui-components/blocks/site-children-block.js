/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/haxcms-elements/lib/ui-components/query/site-query-menu-slice.js";
/**
 * `site-children-block`
 * `Child pages of whatever is active`
 * @demo demo/index.html
 */
class SiteChildrenBlock extends LitElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "site-children-block";
  }
  static get haxProperties() {
    return {
      canScale: false,

      canEditSource: true,
      gizmo: {
        title: "HAXcms: child block",
        description: "Dynamic block to show child of the current page",
        icon: "av:call-to-action",
        color: "grey",
        tags: ["Other", "haxcms"],
        handles: [],
        meta: {
          author: "HAXTheWeb core team",
          owner: "The Pennsylvania State University",
        },
      },
      settings: {
        configure: [],
        advanced: [
          {
            property: "dynamicMethodology",
            title: "Dynamic method",
            description:
              "How to calculate the children relative to this element",
            inputMethod: "select",
            options: {
              active: "Active children",
              parent: "Parent's children",
              ancestor: "All children from the highest ancestor",
            },
          },
          {
            property: "start",
            title: "Start level",
            inputMethod: "number",
          },
          {
            property: "end",
            title: "End level",
            inputMethod: "number",
          },
        ],
      },
      demoSchema: [
        {
          tag: "site-children-block",
          properties: {},
          content: "",
        },
      ],
    };
  }
  constructor() {
    super();
    this.__disposer = [];
    this.dynamicMethodology = "active";
    this.start = 0;
    this.end = 1000;
    this.fixedId = false;
    this.__items = [];
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          --site-children-block-indent: 16px;
          --site-children-block-link-active-bg: rgba(255, 255, 255, 0.1);
          transition: 0.2s opacity linear;
          opacity: 1;
        }
        :host([edit-mode]) {
          opacity: 0.2;
          pointer-events: none;
        }
        .link {
          display: block;
          color: var(--site-children-block-link-color, #444444);
          text-decoration: none;
        }
        .link button:hover,
        .link button:focus {
          text-decoration: underline;
        }
        button {
          cursor: pointer;
          display: block;
          line-height: inherit;
          font-size: inherit;
          padding: 0;
          margin: 0;
          text-align: left;
          text-transform: unset;
          min-width: unset;
          width: 100%;
          margin: 0;
          border-radius: 0;
          justify-content: flex-start;
          background-color: transparent;
          border: none;
          color: inherit;
        }
        ul {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        li {
          margin: 0;
          padding: 0;
        }
        .active {
          color: var(--site-children-block-link-active-color, #000000);
          background-color: var(--site-children-block-link-active-bg);
        }
        .spacing .indent {
          display: inline-flex;
        }
        .indent-1 {
          margin-left: calc(var(--site-children-block-indent) * 1);
        }
        .indent-2 {
          margin-left: calc(var(--site-children-block-indent) * 2);
        }
        .indent-3 {
          margin-left: calc(var(--site-children-block-indent) * 3);
        }
        .indent-4 {
          margin-left: calc(var(--site-children-block-indent) * 4);
        }
        .indent-5 {
          margin-left: calc(var(--site-children-block-indent) * 5);
        }
        .indent-6 {
          margin-left: calc(var(--site-children-block-indent) * 6);
        }
        .indent-7 {
          margin-left: calc(var(--site-children-block-indent) * 7);
        }
        .indent-8 {
          margin-left: calc(var(--site-children-block-indent) * 8);
        }
        .indent-9 {
          margin-left: calc(var(--site-children-block-indent) * 9);
        }
        .indent-10 {
          margin-left: calc(var(--site-children-block-indent) * 10);
        }
      `,
    ];
  }
  resultChanged(e) {
    this.__items = [...e.detail];
  }
  // render function
  render() {
    return html`
      <ul class="wrapper">
        <site-query-menu-slice
          @result-changed="${this.resultChanged}"
          dynamic-methodology="${this.dynamicMethodology}"
          start="${this.start}"
          end="${this.end}"
          parent="${this.parent}"
          ?fixed-id="${this.fixedId}"
        ></site-query-menu-slice>
        ${this.__items.map(
          (item) =>
            html`${item.metadata.hideInMenu === true ||
            item.metadata.published === false
              ? ``
              : html`
                  <li class="spacing">
                    <a
                      data-id="${item.id}"
                      class="link"
                      tabindex="-1"
                      href="${item.slug}"
                    >
                      <button>
                        <div class="indent indent-${item.indent}"></div>
                        ${item.title}
                      </button>
                    </a>
                  </li>
                `} `,
        )}
      </ul>
    `;
  }
  static get properties() {
    return {
      /**
       * How we should obtain the parent who's children we should show
       * options are direct, above, or root
       */
      dynamicMethodology: {
        type: String,
        attribute: "dynamic-methodology",
      },
      /**
       * starting level for the menu items
       */
      start: {
        type: Number,
      },
      /**
       * ending level for the menu items
       */
      end: {
        type: Number,
      },
      /**
       * parent for the menu id
       */
      parent: {
        type: String,
      },
      /**
       * Use this boolean to force this to fix to 1 parent
       * Otherwise it will dynamically update (default behavior)
       */
      fixedId: {
        type: Boolean,
        attribute: "fixed-id",
      },
      /**
       * just to bind data between things
       */
      __items: {
        type: Array,
      },
      /**
       * acitvely selected item
       */
      activeId: {
        type: String,
        attribute: "active-id",
      },
      editMode: {
        type: Boolean,
        reflect: true,
        attribute: "edit-mode",
      },
    };
  }
  /**
   * When active ID changes, see if we know what to highlight automatically
   */
  _activeIdChanged(newValue) {
    if (newValue) {
      let el = null;
      //ensure that this level is included
      if (this.shadowRoot.querySelector('[data-id="' + newValue + '"]')) {
        el = this.shadowRoot.querySelector('[data-id="' + newValue + '"]');
      } else {
        let tmpItem = this.manifest.items.find((i) => i.id == newValue);
        // fallback, maybe there's a child of this currently active
        while (el === null && tmpItem && tmpItem.parent != null) {
          // take the parent object of this current item
          tmpItem = this.manifest.items.find((i) => i.id == tmpItem.parent);
          // see if IT lives in the dom, if not, keep going until we run out
          if (
            tmpItem &&
            this.shadowRoot.querySelector('[data-id="' + tmpItem.id + '"]')
          ) {
            el = this.shadowRoot.querySelector(
              '[data-id="' + tmpItem.id + '"]',
            );
          }
        }
      }
      if (this._prevEl) {
        this._prevEl.classList.remove("active");
      }
      if (el) {
        el.classList.add("active");
        this._prevEl = el;
      }
    } else {
      // shouldn't be possible but might as well list
      if (this._prevEl) {
        this._prevEl.classList.remove("active");
      }
    }
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "__items") {
        this.dispatchEvent(
          new CustomEvent(`${this[propName]}-changed`, {
            detail: this[propName],
          }),
        );
      }
      if (propName === "_activeId" && this.shadowRoot) {
        this._activeIdChanged(this[(propName, oldValue)]);
      }
    });
  }

  connectedCallback() {
    super.connectedCallback();
    autorun((reaction) => {
      this.editMode = toJS(store.editMode);
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.manifest = toJS(store.manifest);
      this.__disposer.push(reaction);
    });
    // minor timing thing to ensure store has picked active
    // needed if routes set on first paint or lifecycles miss
    setTimeout(() => {
      autorun((reaction) => {
        this.activeId = toJS(store.activeId);
        this.__disposer.push(reaction);
      });
    }, 250);
  }
  disconnectedCallback() {
    // clean up state
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    super.disconnectedCallback();
  }
}
customElements.define(SiteChildrenBlock.tag, SiteChildrenBlock);
export { SiteChildrenBlock };
