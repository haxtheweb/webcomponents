/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx/lib/mobx.module.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/query/site-query.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
/**
 * `site-top-menu`
 * `Menu on top of the site typically a bar of options`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SiteTopMenu extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "site-top-menu";
  }
  constructor() {
    super();
    this.__disposer = [];
    import("@polymer/paper-icon-button/paper-icon-button.js");
    import("@polymer/paper-button/paper-button.js");
  }
  // render function
  static get template() {
    return html`
      <style>
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
          @apply --site-top-menu-sticky;
        }
        .wrapper {
          display: flex;
          justify-content: space-evenly;
          background-color: var(--site-top-menu-bg);
          @apply --site-top-menu-wrapper;
        }
        :host .wrapper ::slotted(div.spacing) {
          display: inline-flex;
          @apply --site-top-menu-spacing;
        }
        .spacing {
          display: inline-flex;
          @apply --site-top-menu-spacing;
        }
        .link {
          color: var(--site-top-menu-link-color, #444444);
          @apply --site-top-menu-link;
        }
        paper-button {
          text-transform: unset;
          min-width: unset;
          @apply --site-top-menu-button;
        }
        .active {
          color: var(--site-top-menu-link-active-color, #000000);
          @apply --site-top-menu-link-active;
        }
        #indicator {
          transition: 0.4s ease-in-out left;
          transition-delay: 0.2s;
          position: relative;
          width: 0;
          height: 0;
          visibility: hidden;
        }
        :host([indicator="line"]) #indicator {
          border-bottom: 2px solid var(--site-top-menu-indicator-color, #000000);
          @apply --site-top-menu-indicator;
        }
        :host([indicator="arrow"]) #indicator {
          border-left: var(--site-top-menu-indicator-arrow) solid transparent;
          border-right: var(--site-top-menu-indicator-arrow) solid transparent;
          border-bottom: var(--site-top-menu-indicator-arrow) solid
            var(--site-top-menu-indicator-color, #000000);
          @apply --site-top-menu-indicator;
        }
        #indicator.activated {
          visibility: visible;
          position: absolute;
          @apply --site-top-menu-indicator-activated;
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
        paper-icon-button {
          display: none;
        }
        @media screen and (max-width: 640px) {
          .wrapper .spacing {
            display: none;
          }
          .wrapper .mobiletitle,
          .wrapper paper-icon-button {
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
      </style>
      <site-query
        result="{{__items}}"
        sort="[[sort]]"
        conditions="[[conditions]]"
      ></site-query>
      <div id="wrapper" class="wrapper">
        <paper-icon-button
          icon="menu"
          id="menu"
          title="Open navigation"
        ></paper-icon-button>
        <span class="mobiletitle">[[mobileTitle]]</span>
        <slot name="prefix"></slot>
        <dom-repeat items="[[__items]]" mutable-data>
          <template>
            <div class="spacing">
              <a
                data-id$="[[item.id]]"
                class="link"
                tabindex="-1"
                title$="Go to [[item.title]]"
                href$="[[item.location]]"
              >
                <paper-button id$="item-[[item.id]]" noink="[[noink]]">
                  <span class="link-index">[[humanIndex(index)]]</span>
                  <span class="link-title">[[item.title]]</span>
                </paper-button>
              </a>
            </div>
          </template>
        </dom-repeat>
        <slot name="suffix"></slot>
      </div>
      <div id="indicator"></div>
    `;
  }
  /**
   * Props
   */
  static get properties() {
    return {
      /**
       * manifest of everything, in case we need to check on children of parents
       */
      manifest: {
        type: Object
      },
      /**
       * acitvely selected item
       */
      activeId: {
        type: String,
        observer: "_activeIdChanged"
      },
      /**
       * visually stick to top of interface at all times
       */
      sticky: {
        type: Boolean,
        reflectToAttribute: true,
        value: false
      },
      /**
       * visualize the indicator as a a line, arrow, or not at all
       */
      indicator: {
        type: String,
        reflectToAttribute: true,
        value: "line"
      },
      /**
       * ink on the buttons
       */
      noink: {
        type: Boolean,
        reflectToAttribute: true,
        value: false
      },
      /**
       * hide title on the buttons
       */
      notitle: {
        type: Boolean,
        reflectToAttribute: true,
        value: false
      },
      /**
       * ink on the buttons
       */
      showindex: {
        type: Boolean,
        reflectToAttribute: true,
        value: false
      },
      /**
       * Stupid but faster then calculating on the fly for sure
       */
      arrowSize: {
        type: Number,
        value: 6
      },
      /**
       * Allow customization of sort
       */
      sort: {
        type: Object,
        value: {
          order: "ASC"
        }
      },
      /**
       * Allow customization of the conditions if needed
       */
      conditions: {
        type: Object,
        value: {
          parent: null
        }
      },
      mobileTitle: {
        type: String,
        value: "Navigation"
      },
      editMode: {
        type: Boolean,
        reflectToAttribute: true
      }
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
        this.$.indicator.classList.add("activated");
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
          if (this.indicator == "arrow") {
            this.$.indicator.style.left =
              el.offsetLeft + el.offsetWidth / 2 - this.arrowSize + "px";
            this.$.indicator.style.top =
              el.offsetTop + el.offsetHeight - this.arrowSize + "px";
          } else {
            this.$.indicator.style.left = el.offsetLeft + "px";
            this.$.indicator.style.top = el.offsetTop + el.offsetHeight + "px";
            this.$.indicator.style.width = el.offsetWidth + "px";
          }
        }
      } else {
        // shouldn't be possible but might as well list
        this.$.indicator.classList.remove("activated");
      }
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot
      .querySelector("#menu")
      .addEventListener("click", this.toggleOpen.bind(this));
    autorun(reaction => {
      this.manifest = toJS(store.manifest);
      this.__disposer.push(reaction);
    });
    autorun(reaction => {
      this.editMode = toJS(store.editMode);
      this.__disposer.push(reaction);
    });
    // minor timing thing to ensure store has picked active
    // needed if routes set on first paint or lifecycles miss
    setTimeout(() => {
      autorun(reaction => {
        this.activeId = toJS(store.activeId);
        this.__disposer.push(reaction);
      });
    }, 50);
    window.addEventListener(
      "resize",
      () => {
        this._activeIdChanged(this.activeId);
      },
      true
    );
  }
  disconnectedCallback() {
    // clean up state
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    window.removeEventListener(
      "resize",
      () => {
        this._activeIdChanged(this.activeId);
      },
      true
    );
    super.disconnectedCallback();
  }
}
window.customElements.define(SiteTopMenu.tag, SiteTopMenu);
export { SiteTopMenu };
