/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css, LitElement } from "lit";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/query/site-query.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
/**
 * `site-top-menu`
 * `Menu on top of the site typically a bar of options`
 *
 * @demo demo/index.html
 */
class SiteTopMenu extends LitElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "site-top-menu";
  }
  constructor() {
    super();
    this.windowControllers = new AbortController();
    this.__disposer = [];
    this.manifest = {};
    this.activeId = null;
    this.sticky = false;
    this.indicator = "line";
    this.notitle = false;
    this.showindex = false;
    this.arrowSize = 6;
    this.sort = {
      order: "ASC",
    };
    this.conditions = {
      parent: null,
    };
    this.mobileTitle = "Navigation";
    this.editMode = false;
    this.__items = [];
  }
  static get styles() {
    return [
      css`
    :host {
          display: block;
          --site-top-menu-bg: var(--haxcms-color, #ffffff);
          --site-top-menu-indicator-arrow: 6px;
          transition: 0.2s opacity linear;
          opacity: 1;
        }
        :host([edit-mode]) {
          opacity: 0.2;
          pointer-events: none;
        }
        :host([sticky]) {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }
        .wrapper {
          display: flex;
          justify-content: space-evenly;
          background-color: var(--site-top-menu-bg);
        }
        :host .wrapper ::slotted(div.spacing) {
          display: inline-flex;
        }
        .spacing {
          display: inline-flex;
        }
        .link {
          color: var(--site-top-menu-link-color, #444444);
        }
        button {
          text-transform: unset;
          min-width: unset;
          background-color: transparent;
          border: none;
        }
        .active {
          color: var(--site-top-menu-link-active-color, #000000);
        }
        #indicator {
          transition: 0.4s ease-in-out all;
          transition-delay: 0.2s;
          position: relative;
          width: 0;
          height: 0;
          visibility: hidden;
        }
        :host([indicator="line"]) #indicator {
          border-bottom: 2px solid var(--site-top-menu-indicator-color, #000000);
        }
        :host([indicator="arrow"]) #indicator {
          border-left: var(--site-top-menu-indicator-arrow) solid transparent;
          border-right: var(--site-top-menu-indicator-arrow) solid transparent;
          border-bottom: var(--site-top-menu-indicator-arrow) solid
            var(--site-top-menu-indicator-color, #000000);
        }
        #indicator.activated {
          visibility: visible;
          position: absolute;
        }
        :host([notitle]) .spacing .link-title {
          display: none;
        }
        .spacing .link-index {
          display: none;
        }
        :host([showindex]) .spacing .link-index {
          display: inline-flex;
        }
        .mobiletitle,
        simple-icon-button {
          display: none;
        }
        @media screen and (max-width: 640px) {
          .wrapper .spacing {
            display: none;
          }
          .wrapper .mobiletitle,
          .wrapper simple-icon-button {
            display: inline-block;
          }
          .wrapper {
            display: block;
          }
        }

        @media screen and (max-width: 640px) {
          #indicator {
            display: none !important;
          }
          .wrapper.responsive {
            position: relative;
          }
          .wrapper.responsive .spacing {
            float: none;
            display: block;
            text-align: left;
          }
        }
    `]
  }
  __resultChanged(e) {
    if (e.detail.value === null) {
      this.__items = [];
    }
    else {
      this.__items = e.detail.value;
    }
  }
  // render function
  render() {
    return html`
      <site-query
        .result="${this.__items}"
        @result-changed="${this.__resultChanged}"
        .sort="${this.sort}"
        .conditions="${this.conditions}"
      ></site-query>
      <div id="wrapper" class="wrapper">
        <simple-icon-button
          icon="menu"
          id="menu"
          title="Open navigation"
        ></simple-icon-button>
        <span class="mobiletitle">${this.mobileTitle}</span>
        <slot name="prefix"></slot>
        ${this.__items.map((item, index) => html`
          <div class="spacing">
              <a
                data-id="${item.id}"
                class="link"
                tabindex="-1"
                title="Go to ${item.title}"
                href="${item.slug}"
                part="a"
                >
                <button id="item-${item.id}" part="button">
                  <span class="link-index">${this.humanIndex(index)}</span>
                  <span class="link-title">${item.title}</span>
                </button>
              </a>
            </div>
            `)}
        <slot name="suffix"></slot>
      </div>
      <div id="indicator"></div>
    `;
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
   * Props
   */
  static get properties() {
    return {
      __items: {
        type: Array,
      },
      /**
       * manifest of everything, in case we need to check on children of parents
       */
      manifest: {
        type: Object,
      },
      /**
       * acitvely selected item
       */
      activeId: {
        type: String,
      },
      /**
       * visually stick to top of interface at all times
       */
      sticky: {
        type: Boolean,
        reflect: true,
      },
      /**
       * visualize the indicator as a a line, arrow, or not at all
       */
      indicator: {
        type: String,
        reflect: true,
      },
      /**
       * hide title on the buttons
       */
      notitle: {
        type: Boolean,
        reflect: true,
      },
      /**
       * ink on the buttons
       */
      showindex: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Stupid but faster then calculating on the fly for sure
       */
      arrowSize: {
        type: Number,
        attribute: "arrow-size",
      },
      /**
       * Allow customization of sort
       */
      sort: {
        type: Object,
      },
      /**
       * Allow customization of the conditions if needed
       */
      conditions: {
        type: Object,
      },
      mobileTitle: {
        type: String,
        attribute: "mobile-title",
      },
      editMode: {
        type: Boolean,
        reflect: true,
        attribute: "edit-mode",
      },
    };
  }
  humanIndex(index) {
    return index + 1;
  }
  toggleOpen() {
    var wrapper = this.shadowRoot.querySelector("#wrapper");
    if (wrapper.classList.contains("responsive")) {
      wrapper.classList.remove("responsive");
    } else {
      wrapper.classList.add("responsive");
    }
  }
  /**
   * When active ID changes, see if we know what to highlight automatically
   */
  _activeIdChanged(newValue) {
    // as long as didn't disable the indicator, do this processing
    if (this.indicator != "none") {
      if (newValue) {
        this.shadowRoot.querySelector("#indicator").classList.add("activated");
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
          let dim = el.getBoundingClientRect();
          if (this.indicator == "arrow") {
            this.shadowRoot.querySelector("#indicator").style.left =
            dim.left + el.offsetWidth / 2 - this.arrowSize + "px";
            this.shadowRoot.querySelector("#indicator").style.top =
            dim.top - (2.5*this.arrowSize) + "px";
          } else {
            this.shadowRoot.querySelector("#indicator").style.left =
            dim.left + "px";
            this.shadowRoot.querySelector("#indicator").style.top =
            dim.top - (2.5*this.arrowSize) + "px";
            this.shadowRoot.querySelector("#indicator").style.width =
              el.offsetWidth + "px";
          }           
          this._prevEl = el;
 
        }
      } else {
        // shouldn't be possible but might as well list
        this.shadowRoot
          .querySelector("#indicator")
          .classList.remove("activated");
      }
    }
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.shadowRoot
    .querySelector("#menu")
    .addEventListener("click", this.toggleOpen.bind(this));
    autorun((reaction) => {
      this.manifest = toJS(store.manifest);
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.editMode = toJS(store.editMode);
      this.__disposer.push(reaction);
    });
    // minor timing thing to ensure store has picked active
    // needed if routes set on first paint or lifecycles miss
    setTimeout(() => {
      autorun((reaction) => {
        this.activeId = toJS(store.activeId);
        this.__disposer.push(reaction);
      });
    }, 50);
    window.addEventListener(
      "resize",
      () => {
        this._activeIdChanged(this.activeId);
      },
      { signal: this.windowControllers.signal }
    );
    setTimeout(() => {
      this._activeIdChanged(this.activeId);
    }, 5000);
  }
  disconnectedCallback() {
    // clean up state
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    this.windowControllers.abort();
    super.disconnectedCallback();
  }
}
customElements.define(SiteTopMenu.tag, SiteTopMenu);
export { SiteTopMenu };
