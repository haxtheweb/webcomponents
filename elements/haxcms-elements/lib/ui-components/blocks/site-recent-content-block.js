import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/haxcms-elements/lib/ui-components/query/site-query.js";
import { LitElement, css, html } from "lit";

/**
 * `site-recent-content-block`
 * `Block to display recent content`
 *

 * @polymer
 * @demo demo/index.html
 */
class SiteRecentContentBlock extends LitElement {
  constructor() {
    super();
    this.limit = 10;
    this.startIndex = 0;
    this.sort = {
      "metadata.created": "ASC",
    };
    this.conditions = {};
    this.title = "Recent content";
    this.__disposer = autorun(() => {
      this.activeId = toJS(store.activeId);
    });
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }

    if (changedProperties.has("activeId")) {
      this._activeIdChanged(this.activeId);
    }
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "site-recent-content-block";
  }
  static get styles() {
    return [
      css`
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
        }
        .item-heading a {
          text-decoration: none;
          text-transform: none;
          color: var(--site-recent-content-block-item-link-color);
          font-size: 16px;
        }
        .active {
          border-left: solid;
          border-left-width: 4px;
          border-left-color: var(--site-recent-content-block-active-color);
          background-color: whitesmoke;
          padding-left: 5px;
        }
        .image-wrapper {
          display: flex;
          margin-right: 10px;
        }
        .image-wrapper img.image {
          height: 50px;
          width: 50px;
        }
      `,
    ];
  }

  __resultChanged(e) {
    if (e.detail && e.detail.value) {
      this.__items = [...e.detail.value];
    }
  }

  // render function
  render() {
    return html`
      <aside>
        <div class="header">
          <h3>${title}</h3>
        </div>
        <site-query
          @result-changed="${this.__resultChanged}"
          sort="${sort}"
          conditions="${conditions}"
          limit="${limit}"
          start-index="${startIndex}"
        >
        </site-query>
        ${this.__items.map(
          (item) => html`
            <div class="item-wrap" data-id="${item.id}">
              <div class="image-wrapper">
                <img
                  class="image"
                  loading="lazy"
                  src="${item.metadata.fields.image}"
                />
              </div>
              <div class="item-heading">
                <a .href="${item.slug}">${item.title}</a>
              </div>
            </div>
          `,
        )}
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
      },
      /**
       * ending level for the menu items
       */
      startIndex: {
        type: Number,
        attribute: "start-index",
      },
      __items: {
        type: Array,
      },
      /**
       * optional sort
       */
      sort: {
        type: Object,
      },
      /**
       * conditions to query on
       */
      conditions: {
        type: Object,
      },
      /**
       * title for the block;
       */
      title: {
        type: String,
      },
      /**
       * acitvely selected item
       */
      activeId: {
        type: String,
        attribute: "active-id",
      },
    };
  }

  _activeIdChanged(newValue) {
    if (newValue) {
      let el = null;
      //ensure that this level is included
      if (this.shadowRoot.querySelector('[data-id="' + newValue + '"]')) {
        el = this.shadowRoot.querySelector('[data-id="' + newValue + '"]');
      } else {
        let tmpItem = store.manifest.items.find((i) => i.id == newValue);
        // fallback, maybe there's a child of this currently active
        while (el === null && tmpItem && tmpItem.parent != null) {
          // take the parent object of this current item
          tmpItem = store.manifest.items.find((i) => i.id == tmpItem.parent);
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
    }
  }
  disconnectedCallback() {
    if (this.__disposer) {
      this.__disposer();
    }
    super.disconnectedCallback();
  }
}
customElements.define(SiteRecentContentBlock.tag, SiteRecentContentBlock);
export { SiteRecentContentBlock };
