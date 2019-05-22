import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/query/site-query.js";

/**
 * `site-recent-content-block`
 * `Block to display recent content`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SiteRecentContentBlock extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "site-recent-content-block";
  }
  constructor() {
    super();
    import("@polymer/iron-image/iron-image.js");
  }
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          background-color: #fff;
          box-shadow: 0 1px 2px #dcdcdc;
          padding: 10px;
          margin-top: 10px;
          --site-recent-content-block-header-color: #363533;
          --site-recent-content-block-item-link-color: #363533;
        }
        .header h3 {
          font-size: 26px;
          margin: 0 0 10px;
          color: var(--site-recent-content-block-header-color);
        }
        .item-wrap {
          display: flex;
          align-items: center;
          border-bottom: solid 1px #dcdcdc;
          padding-bottom: 8px;
          padding-top: 8px;
          @apply --site-recent-content-block-item-wrap;
        }
        .item-heading a {
          text-decoration: none;
          text-transform: none;
          color: var(--site-recent-content-block-item-link-color);
          font-size: 16px;
          @apply --site-recent-content-block-item-link;
        }
        .item-heading a:hover,
        .item-heading a:focus,
        .item-heading a:active {
          @apply --site-recent-content-block-item-link-hover;
        }
        .active {
          border-left: solid;
          border-left-width: 4px;
          border-left-color: var(--site-recent-content-block-active-color);
          background-color: whitesmoke;
          padding-left: 5px;
          @apply --site-recent-content-block-item-active;
        }
        .image-wrapper {
          display: flex;
          margin-right: 10px;
          @apply --site-recent-content-block-image-wrapper;
        }
        .image-wrapper iron-image {
          height: 50px;
          width: 50px;
          @apply --site-recent-content-block-image;
        }
      </style>
      <aside>
        <div class="header">
          <h3>[[title]]</h3>
        </div>
        <site-query
          result="{{__items}}"
          sort="[[sort]]"
          conditions="[[conditions]]"
          limit="[[limit]]"
          start-index="[[startIndex]]"
        >
        </site-query>
        <dom-repeat items="[[__items]]" mutable-data>
          <template>
            <div class="item-wrap" data-id$="[[item.id]]">
              <div class="image-wrapper">
                <iron-image
                  sizing="cover"
                  src="[[item.metadata.fields.image]]"
                ></iron-image>
              </div>
              <div class="item-heading">
                <a href\$="[[item.location]]">[[item.title]]</a>
              </div>
            </div>
          </template>
        </dom-repeat>
      </aside>
    `;
  }
  /**
   * Props
   */
  static get properties() {
    return {
      /**
       * starting level for the menu items
       */
      limit: {
        type: Number,
        value: 10
      },
      /**
       * ending level for the menu items
       */
      startIndex: {
        type: Number,
        value: 0
      },
      /**
       * optional sort
       */
      sort: {
        type: Object,
        value: {
          "metadata.created": "ASC"
        }
      },
      /**
       * conditions to query on
       */
      conditions: {
        type: Object,
        value: {}
      },
      /**
       * title for the block;
       */
      title: {
        type: String,
        value: "Recent content"
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

  _activeIdChanged(newValue) {
    if (newValue) {
      let el = null;
      //ensure that this level is included
      if (this.shadowRoot.querySelector('[data-id="' + newValue + '"]')) {
        el = this.shadowRoot.querySelector('[data-id="' + newValue + '"]');
      } else {
        let tmpItem = store.manifest.items.find(i => i.id == newValue);
        // fallback, maybe there's a child of this currently active
        while (el === null && tmpItem && tmpItem.parent != null) {
          // take the parent object of this current item
          tmpItem = store.manifest.items.find(i => i.id == tmpItem.parent);
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
    }
  }
  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => {
      this.__disposer = autorun(() => {
        this.activeId = toJS(store.activeId);
      });
    }, 50);
  }
  disconnectedCallback() {
    if (this.__disposer) {
      this.__disposer();
    }
    super.disconnectedCallback();
  }
}
window.customElements.define(
  SiteRecentContentBlock.tag,
  SiteRecentContentBlock
);
export { SiteRecentContentBlock };
