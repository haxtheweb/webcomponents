import { css, html } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { HAXCMSI18NMixin } from "./HAXCMSI18NMixin.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import { autorun, toJS } from "mobx";
import { localStorageSet, localStorageGet } from "@haxtheweb/utils/utils.js";

const HAXCMSMobileMenuMixin = function (SuperClass) {
  return class extends HAXCMSI18NMixin(SuperClass) {
    constructor() {
      super();
      this.isHorizontal = true;
      this.isFlex = true;
      this.menuOpen = true;
      this.t.closeMenu = "Close menu";
      this.t.openMenu = "Open menu";
      this.t.toggleSiteMenu = "Toggle site menu";
      let status = localStorageGet("hax-mobile-menu-menuOpen", null);
      if (status !== null) {
        if (status === true) {
          this.menuOpen = true;
        } else if (status === false) {
          this.menuOpen = false;
        }
      }
      this.__disposer = this.__disposer ? this.__disposer : [];
      this.__disposer.push(
        autorun((reaction) => {
          const _mobx_val_0 = toJS(store.activeId);
          Promise.resolve().then(() => {
            const activeId = _mobx_val_0;
            // if menu is open, and the active item changes AND we're on mobile...
            // close the menu
            if (
              this.shadowRoot &&
              this.shadowRoot.querySelector("#haxcmsmobilemenunav") &&
              this.menuOpen &&
              activeId &&
              ["sm", "xs"].includes(this.responsiveSize)
            ) {
              this.__HAXCMSMobileMenuToggle();
            }
          });
        }),
      );
      this.dispatchEvent(
        new CustomEvent("super-daemon-define-option", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            title: this.t.toggleSiteMenu,
            icon: "hax:menu-open",
            tags: ["CMS", "site", "menu"],
            value: {
              target: this,
              method: "__HAXCMSMobileMenuClickToggle",
            },
            context: "CMS",
            eventName: "super-daemon-element-method",
            path: "CMS/site/menu/toggle",
          },
        }),
      );
    }
    static get styles() {
      let styles = [];
      if (super.styles) {
        styles = super.styles;
      }
      return [
        styles,
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
          #haxcmsmobilemenunav a:focus-visible,
          #haxcmsmobilemenunav button:focus-visible {
            outline: 2px solid currentColor;
            outline-offset: 2px;
          }
        `,
      ];
    }
    HAXCMSMobileMenuButton(position = "auto") {
      return html`
        <simple-icon-button-lite
          class="btn"
          icon="${this.menuOpen ? "hax:menu-open" : "icons:menu"}"
          label="${this.menuOpen ? this.t.closeMenu : this.t.openMenu}"
          id="haxcmsmobilemenubutton"
          .part="${this.editMode ? `edit-mode-active` : ``}"
          @click="${this.__HAXCMSMobileMenuClickToggle}"
        ></simple-icon-button-lite>
        <simple-tooltip for="haxcmsmobilemenubutton" position="${position}">
          ${this.menuOpen ? this.t.closeMenu : this.t.openMenu}
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
          aria-label="Site navigation"
          aria-labelledby="sitemenu"
          itemscope
          itemtype="http://schema.org/SiteNavigationElement"
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
    HAXCMSFlexMenu(maxDepth = 3) {
      return html`
        <nav
          id="haxcmsmobilemenunav"
          role="navigation"
          aria-label="Site navigation"
          aria-labelledby="sitemenu"
          itemscope
          itemtype="http://schema.org/SiteNavigationElement"
        >
          <replace-tag
            with="site-menu"
            part="site-menu"
            id="sitemenu"
            max-depth="${maxDepth}"
            ?is-flex="${this.isFlex}"
            ?is-horizontal="${this.isHorizontal}"
            import-method="view"
          ></replace-tag>
        </nav>
      `;
    }
  /**
   * Notice small size and if menu is open, close it. isHorizontal + menuOpen
   * are derived in willUpdate so they batch into the current update cycle;
   * setting them in updated() (via __HAXCMSMobileMenuToggle) scheduled a
   * redundant second update (Lit change-in-update warning).
   */
  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    if (changedProperties.has("responsiveSize") && this.responsiveSize) {
      const oldValue = changedProperties.get("responsiveSize");
      switch (this.responsiveSize) {
        case "sm":
          this.isHorizontal = false;
          // auto close for small layouts
          if (this.menuOpen && oldValue != "xs") {
            this.menuOpen = false;
          }
          break;
        case "xs":
          this.isHorizontal = false;
          // auto close for small layouts
          if (this.menuOpen && oldValue != "sm") {
            this.menuOpen = false;
          }
          break;
        default:
          this.isHorizontal = true;
          // auto open for larger layouts
          if (!this.menuOpen) {
            this.menuOpen = true;
          }
      }
    }
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    // Apply tabindex DOM state when menuOpen changes. menuOpen is set in
    // willUpdate (responsiveSize) or via __HAXCMSMobileMenuToggle (click /
    // autorun); either way this mirrors the nav tabindex side-effect that
    // __HAXCMSMobileMenuToggle used to do inline.
    if (changedProperties.has("menuOpen")) {
      const nav =
        this.shadowRoot &&
        this.shadowRoot.querySelector("#haxcmsmobilemenunav");
      if (nav) {
        if (this.menuOpen) {
          nav.removeAttribute("tabindex");
        } else {
          nav.setAttribute("tabindex", "-1");
        }
      }
    }
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
        isFlex: {
          type: Boolean,
          attribute: "is-flex",
        },
        isHorizontal: {
          type: Boolean,
          attribute: "is-horizontal",
        },
      };
    }
  };
};

export { HAXCMSMobileMenuMixin };
