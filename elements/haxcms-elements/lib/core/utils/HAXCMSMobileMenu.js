import { css, html } from "lit-element/lit-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";

const HAXCMSMobileMenuMixin = function (SuperClass) {
  return class extends SuperClass {
    constructor() {
      super();
      this.menuOpen = true;
    }
    firstUpdated(changedProperties) {
      if (super.firstUpdated) {
        super.firstUpdated(changedProperties);
      }
      this.__disposer = this.__disposer ? this.__disposer : [];
      autorun((reaction) => {
        // if menu is open, and the active item changes AND we're on mobile...
        // close the menu
        if (
          this.shadowRoot.querySelector("#haxcmsmobilemenunav") &&
          this.menuOpen &&
          toJS(store.activeId) &&
          ["sm", "xs"].includes(this.responsiveSize)
        ) {
          this.__HAXCMSMobileMenuToggle({});
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
          site-menu {
            height: 100vh;
          }
          :host([responsive-size="xs"][menu-open]),
          :host([responsive-size="sm"][menu-open]) {
            overflow: hidden;
          }
        `,
      ];
    }
    HAXCMSMobileMenuButton() {
      import("@polymer/iron-icons/iron-icons.js");
      import("@polymer/paper-icon-button/paper-icon-button.js");
      import("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");
      return html`
        <paper-icon-button
          class="btn"
          icon="icons:menu"
          aria-label="Toggle menu"
          id="haxcmsmobilemenubutton"
          .part="${this.editMode ? `edit-mode-active` : ``}"
          @click="${this.__HAXCMSMobileMenuToggle}"
        ></paper-icon-button>
        <simple-tooltip for="haxcmsmobilemenubutton">
          Toggle menu
        </simple-tooltip>
      `;
    }
    __HAXCMSMobileMenuToggle(e) {
      if (this.menuOpen) {
        this.menuOpen = false;
        this.shadowRoot
          .querySelector("#haxcmsmobilemenunav")
          .setAttribute("tabindex", "-1");
      } else {
        this.menuOpen = true;
        this.shadowRoot
          .querySelector("#haxcmsmobilemenunav")
          .removeAttribute("tabindex");
      }
    }
    HAXCMSMobileMenu(e) {
      import(
        "@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-menu.js"
      );
      return html`
        <nav
          id="haxcmsmobilemenunav"
          role="navigation"
          aria-labelledby="sitemenu"
        >
          <site-menu id="sitemenu"></site-menu>
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
        if (propName == "responsiveSize") {
          switch (this[propName]) {
            case "sm":
              // auto close for small layouts
              if (this.menuOpen && oldValue != "xs") {
                this.__HAXCMSMobileMenuToggle({});
              }
              break;
            case "xs":
              // auto close for small layouts
              if (this.menuOpen && oldValue != "sm") {
                this.__HAXCMSMobileMenuToggle({});
              }
              break;
            default: {
              // auto open for larger layouts
              if (!this.menuOpen) {
                this.__HAXCMSMobileMenuToggle({});
              }
            }
          }
        }
      });
    }
    static get properties() {
      let props = {};
      if (super.properties) {
        props = super.props;
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
