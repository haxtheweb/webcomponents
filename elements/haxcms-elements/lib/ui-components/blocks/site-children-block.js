/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/query/site-query-menu-slice.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import "@polymer/paper-button/paper-button.js";

/**
 * `site-children-block`
 * `Child pages of whatever is active`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SiteChildrenBlock extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "site-children-block";
  }
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          --site-children-block-indent: 16px;
          --site-children-block-link-active-bg: rgba(255, 255, 255, 0.1);
        }
        .wrapper {
          @apply --site-children-block-wrapper;
        }
        .spacing {
          @apply --site-children-block-spacing;
        }
        .link {
          display: block;
          color: var(--site-children-block-link-color, #444444);
          @apply --site-children-block-link;
        }
        paper-button {
          text-transform: unset;
          min-width: unset;
          width: 100%;
          margin: 0;
          border-radius: 0;
          justify-content: flex-start;
          @apply --site-children-block-button;
        }
        paper-button:hover,
        paper-button:focus,
        paper-button:active {
          @apply --site-children-block-button-active;
        }
        .active {
          color: var(--site-children-block-link-active-color, #000000);
          background-color: var(--site-children-block-link-active-bg);
          @apply --site-children-block-link-active;
        }
        .spacing .indent {
          display: inline-flex;
        }
        .indent-1 {
          margin-left: calc(var(--site-children-block-indent) * 1);
          @apply --site-children-block-indent-1;
        }
        .indent-2 {
          margin-left: calc(var(--site-children-block-indent) * 2);
          @apply --site-children-block-indent-1;
        }
        .indent-3 {
          margin-left: calc(var(--site-children-block-indent) * 3);
          @apply --site-children-block-indent-1;
        }
        .indent-4 {
          margin-left: calc(var(--site-children-block-indent) * 4);
          @apply --site-children-block-indent-1;
        }
        .indent-5 {
          margin-left: calc(var(--site-children-block-indent) * 5);
          @apply --site-children-block-indent-1;
        }
        .indent-6 {
          margin-left: calc(var(--site-children-block-indent) * 6);
          @apply --site-children-block-indent-1;
        }
        .indent-7 {
          margin-left: calc(var(--site-children-block-indent) * 7);
          @apply --site-children-block-indent-1;
        }
        .indent-8 {
          margin-left: calc(var(--site-children-block-indent) * 8);
          @apply --site-children-block-indent-1;
        }
        .indent-9 {
          margin-left: calc(var(--site-children-block-indent) * 9);
          @apply --site-children-block-indent-1;
        }
        .indent-10 {
          margin-left: calc(var(--site-children-block-indent) * 10);
          @apply --site-children-block-indent-1;
        }
      </style>
      <div class="wrapper">
        <site-query-menu-slice
          result="{{__items}}"
          dynamic-methodology="[[dynamicMethodology]]"
          start="[[start]]"
          end="[[end]]"
          parent="[[parent]]"
          fixed-id="[[fixedId]]"
        ></site-query-menu-slice>
        <dom-repeat items="[[__items]]">
          <template>
            <div class="spacing">
              <a
                data-id$="[[item.id]]"
                class="link"
                tabindex="-1"
                href$="[[item.location]]"
              >
                <paper-button noink="[[noink]]">
                  <div class$="indent indent-[[item.indent]]"></div>
                  [[item.title]]
                </paper-button>
              </a>
            </div>
          </template>
        </dom-repeat>
      </div>
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
        value: "direct"
      },
      /**
       * starting level for the menu items
       */
      start: {
        type: Number,
        value: 1
      },
      /**
       * ending level for the menu items
       */
      end: {
        type: Number,
        value: 1000
      },
      /**
       * parent for the menu id
       */
      parent: {
        type: String
      },
      /**
       * Use this boolean to force this to fix to 1 parent
       * Otherwise it will dynamically update (default behavior)
       */
      fixedId: {
        type: Boolean,
        value: false
      },
      /**
       * to control ink on the buttons
       */
      noink: {
        type: Boolean,
        value: false
      },
      /**
       * just to bind data between things
       */
      __items: {
        type: Array,
        notify: true
      },
      /**
       * acitvely selected item
       */
      activeId: {
        type: String,
        observer: "_activeIdChanged"
      }
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
        let tmpItem = this.manifest.items.find(i => i.id == newValue);
        // fallback, maybe there's a child of this currently active
        while (el === null && tmpItem && tmpItem.parent != null) {
          // take the parent object of this current item
          tmpItem = this.manifest.items.find(i => i.id == tmpItem.parent);
          // see if IT lives in the dom, if not, keep going until we run out
          if (
            tmpItem &&
            this.shadowRoot.querySelector('[data-id="' + tmpItem.id + '"]')
          ) {
            el = this.shadowRoot.querySelector(
              '[data-id="' + tmpItem.id + '"]'
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
  connectedCallback() {
    super.connectedCallback();
    this.__disposer = autorun(() => {
      this.manifest = toJS(store.manifest);
    });
    // minor timing thing to ensure store has picked active
    // needed if routes set on first paint or lifecycles miss
    setTimeout(() => {
      this.__disposer2 = autorun(() => {
        this.activeId = toJS(store.activeId);
      });
    }, 5);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.__disposer();
    this.__disposer2();
  }
}
window.customElements.define(SiteChildrenBlock.tag, SiteChildrenBlock);
export { SiteChildrenBlock };
