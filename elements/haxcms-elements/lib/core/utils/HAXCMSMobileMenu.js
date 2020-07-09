import { css, html } from "lit-element/lit-element.js";
const HAXCMSMobileMenuMixin = function(SuperClass) {
  return class extends SuperClass {
    constructor() {
      super();
      this.menuOpen = true;
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
            height: auto;
          }
        `
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
      import("@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-menu.js");
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
            case "xs":
              // auto close for small layouts
              if (this.menuOpen) {
                this.__HAXCMSMobileMenuToggle({});
              }
              break;
            default: {
              // auto open for large layouts
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
          attribute: "menu-open"
        }
      };
    }
  };
};

export { HAXCMSMobileMenuMixin };
