import { css, html } from "lit";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { HAXCMSI18NMixin } from "./HAXCMSI18NMixin.js";
import { autorun, toJS } from "mobx";
import {
  localStorageSet,
  localStorageGet,
} from "@lrnwebcomponents/utils/utils.js";

const HAXCMSMobileMenuMixin = function (SuperClass) {
  return class extends HAXCMSI18NMixin(SuperClass) {
    constructor() {
      super();
      this.menuOpen = true;
      this.t = this.t || {};
      this.t.toggleMenu = "Toggle menu";
      let status = localStorageGet("hax-mobile-menu-menuOpen", null);
      if (status !== null) {
        if (status === true) {
          this.menuOpen = true;
        } else if (status === false) {
          this.menuOpen = false;
        }
      }
      this.__disposer = this.__disposer ? this.__disposer : [];
      autorun((reaction) => {
        // if menu is open, and the active item changes AND we're on mobile...
        // close the menu
        if (
          this.shadowRoot &&
          this.shadowRoot.querySelector("#haxcmsmobilemenunav") &&
          this.menuOpen &&
          toJS(store.activeId) &&
          ["sm", "xs"].includes(this.responsiveSize) &&
          localStorageGet("hax-mobile-menu-menuOpen", null) === null
        ) {
          this.__HAXCMSMobileMenuToggle();
        }
        this.__disposer.push(reaction);
      });
    }
    static get styles() {
      let styles = [];
      if (super.styles) {
        styles = super.styles;
      }
      return [
        ...styles,
        css`
          site-menu:not(:defined) {
            display: none;
          }
          replace-tag[with="site-menu"] {
            height: 100vh;
          }
          :host([responsive-size="xs"][menu-open]),
          :host([responsive-size="sm"][menu-open]) {
            overflow: hidden;
          }
          simple-icon-button-lite {
            color: inherit;
          }
        `,
      ];
    }
    HAXCMSMobileMenuButton(position = "auto") {
      import("@lrnwebcomponents/simple-icon/simple-icon.js");
      import("@lrnwebcomponents/simple-icon/lib/simple-icons.js");
      import("@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js");
      import("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");
      return html`
        <simple-icon-button-lite
          class="btn"
          icon="icons:menu"
          label="${this.t.toggleMenu}"
          id="haxcmsmobilemenubutton"
          .part="${this.editMode ? `edit-mode-active` : ``}"
          @click="${this.__HAXCMSMobileMenuClickToggle}"
        ></simple-icon-button-lite>
        <simple-tooltip for="haxcmsmobilemenubutton" position="${position}">
          ${this.t.toggleMenu}
        </simple-tooltip>
      `;
    }
    __HAXCMSMobileMenuClickToggle() {
      this.__HAXCMSMobileMenuToggle();
      //set local storage when clicking by the user
      localStorageSet("hax-mobile-menu-menuOpen", this.menuOpen);
    }
    __HAXCMSMobileMenuToggle() {
      if (this.menuOpen) {
        this.menuOpen = false;
        if (this.shadowRoot.querySelector("#haxcmsmobilemenunav")) {
          this.shadowRoot
            .querySelector("#haxcmsmobilemenunav")
            .setAttribute("tabindex", "-1");
        }
      } else {
        this.menuOpen = true;
        if (this.shadowRoot.querySelector("#haxcmsmobilemenunav")) {
          this.shadowRoot
            .querySelector("#haxcmsmobilemenunav")
            .removeAttribute("tabindex");
        }
      }
    }
    HAXCMSMobileMenu(e) {
      return html`
        <nav
          id="haxcmsmobilemenunav"
          role="navigation"
          aria-labelledby="sitemenu"
        >
          <replace-tag
            with="site-menu"
            part="site-menu"
            id="sitemenu"
            import-method="view"
          ></replace-tag>
        </nav>
      `;
    }
    /**
     * Notice small size and if menu is open, close it
     */
    updated(changedProperties) {
      if (super.updated) {
        super.updated(changedProperties);
      }
      changedProperties.forEach((oldValue, propName) => {
        // these cases only fire if the user has not changed the state themselves
        // when the menuOpen setting is placed in local storage we no longer
        // abide by these things
        if (
          propName == "responsiveSize" &&
          localStorageGet("hax-mobile-menu-menuOpen", null) === null
        ) {
          switch (this[propName]) {
            case "sm":
              // auto close for small layouts
              if (this.menuOpen && oldValue != "xs") {
                this.__HAXCMSMobileMenuToggle();
              }
              break;
            case "xs":
              // auto close for small layouts
              if (this.menuOpen && oldValue != "sm") {
                this.__HAXCMSMobileMenuToggle();
              }
              break;
            default: {
              // auto open for larger layouts
              if (!this.menuOpen) {
                this.__HAXCMSMobileMenuToggle();
              }
            }
          }
        }
      });
    }
    static get properties() {
      let props = {};
      if (super.properties) {
        props = super.properties;
      }
      return {
        ...props,
        menuOpen: {
          type: Boolean,
          reflect: true,
          attribute: "menu-open",
        },
      };
    }
  };
};

export { HAXCMSMobileMenuMixin };
