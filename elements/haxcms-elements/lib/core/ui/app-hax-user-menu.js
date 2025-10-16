// TODO: Create app-hax-user-menu-button to be tossed into this
// TODO: Create prefix and suffix sections for sound/light toggles and other shtuff

// dependencies / things imported
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";

export class AppHaxUserMenu extends DDDSuper(LitElement) {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return "app-hax-user-menu";
  }

  constructor() {
    super();
    this.isOpen = false;
    this.icon = "account-circle";
    this.addEventListener("keydown", this._handleKeydown.bind(this));
  }

  static get properties() {
    return {
      isOpen: { type: Boolean, reflect: true, attribute: "is-open" },
      icon: { type: String, reflect: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          font-family: var(--ddd-font-primary, sans-serif);
          text-align: center;
          display: inline-block;
          margin: 0px;
          padding: 0px;
          position: relative;
        }

        .entireComponent {
          max-height: var(--ddd-spacing-10, 40px);
        }

        .menuToggle {
          cursor: pointer;
          max-height: var(--ddd-spacing-10, 40px);
        }

        .user-menu {
          display: none;
        }

        .user-menu.open {
          display: block;
          top: var(--ddd-spacing-12, 48px);
          right: 0px;
          position: absolute;
          border: var(--ddd-border-xs, 1px solid)
            var(--ddd-theme-default-slateGray, #666);
          background: var(--ddd-theme-default-white, white);
          border-radius: var(--ddd-radius-sm, 4px);
          box-shadow: var(--ddd-boxShadow-lg);
          min-width: var(--ddd-spacing-30, 200px);
          z-index: 1000;
          overflow: hidden;
        }

        :host([dark]) .user-menu.open,
        body.dark-mode .user-menu.open {
          background: var(--ddd-theme-default-coalyGray, #333);
          border-color: var(--ddd-theme-default-slateGray, #666);
        }

        .user-menu.open ::slotted(*) {
          display: block;
          width: 100%;
          margin: 0;
          font-size: var(--ddd-font-size-3xs, 12px);
          text-align: left;
          font-family: var(--ddd-font-primary, sans-serif);
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
          background: transparent;
          text-decoration: none;
        }

        :host([dark]) .user-menu.open ::slotted(*),
        body.dark-mode .user-menu.open ::slotted(*) {
          color: var(--ddd-theme-default-white, white);
        }

        .user-menu.open .main-menu ::slotted(*:hover),
        .user-menu.open .main-menu ::slotted(*:active),
        .user-menu.open .main-menu ::slotted(*:focus) {
          background: var(--ddd-theme-default-limestoneGray, #f5f5f5);
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
        }

        :host([dark]) .user-menu.open .main-menu ::slotted(*:hover),
        :host([dark]) .user-menu.open .main-menu ::slotted(*:active),
        :host([dark]) .user-menu.open .main-menu ::slotted(*:focus),
        body.dark-mode .user-menu.open .main-menu ::slotted(*:hover),
        body.dark-mode .user-menu.open .main-menu ::slotted(*:active),
        body.dark-mode .user-menu.open .main-menu ::slotted(*:focus) {
          background: var(--ddd-theme-default-slateGray, #666);
          color: var(--ddd-theme-default-white, white);
        }

        .user-menu.open .post-menu ::slotted(*:hover),
        .user-menu.open .post-menu ::slotted(*:active),
        .user-menu.open .post-menu ::slotted(*:focus) {
          background: var(--ddd-theme-default-original87Pink, #e4007c);
          color: var(--ddd-theme-default-white, white);
        }

        .user-menu ::slotted(button) {
          cursor: pointer;
        }

        .user-menu ::slotted(*) simple-icon-lite {
          padding-right: var(--ddd-spacing-2, 8px);
        }

        .pre-menu,
        .post-menu {
          border-top: var(--ddd-border-xs, 1px solid)
            var(--ddd-theme-default-limestoneGray, #f5f5f5);
        }

        .pre-menu:first-child,
        .main-menu:first-child {
          border-top: none;
        }

        /* Keyboard focus indicators */
        .user-menu ::slotted(*:focus),
        .user-menu ::slotted(*[tabindex="0"]:focus) {
          outline: var(--ddd-border-sm, 2px solid)
            var(--ddd-theme-default-keystoneYellow, #ffd100);
          outline-offset: -2px;
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="entireComponent">
        <div
          class="menuToggle"
          part="menuToggle"
          aria-expanded="${this.isOpen}"
          aria-haspopup="menu"
          aria-controls="user-menu-dropdown"
        >
          <slot name="menuButton"
            ><simple-icon-lite
              icon="${this.icon}"
              aria-hidden="true"
            ></simple-icon-lite
          ></slot>
        </div>

        <div
          id="user-menu-dropdown"
          class="user-menu ${this.isOpen ? "open" : ""}"
          role="menu"
          aria-hidden="${!this.isOpen}"
        >
          <div class="pre-menu" role="group" aria-label="Menu header">
            <slot name="pre-menu"></slot>
          </div>
          <div class="main-menu" role="group" aria-label="Main menu items">
            <slot name="main-menu"></slot>
          </div>
          <div class="post-menu" role="group" aria-label="Menu footer">
            <slot name="post-menu"></slot>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Handle keyboard navigation for menu toggle
   */
  _handleMenuToggleKeydown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this._toggleMenu();
    } else if (e.key === "Escape" && this.isOpen) {
      e.preventDefault();
      this._closeMenu();
    }
  }

  /**
   * Handle keyboard navigation within menu
   */
  _handleKeydown(e) {
    if (!this.isOpen) return;

    const menuItems = this._getMenuItems();
    const currentIndex = this._getCurrentMenuItemIndex(menuItems);

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        this._closeMenu();
        this._focusToggle();
        break;
      case "ArrowDown":
        e.preventDefault();
        this._focusNextItem(menuItems, currentIndex);
        break;
      case "ArrowUp":
        e.preventDefault();
        this._focusPreviousItem(menuItems, currentIndex);
        break;
      case "Home":
        e.preventDefault();
        this._focusFirstItem(menuItems);
        break;
      case "End":
        e.preventDefault();
        this._focusLastItem(menuItems);
        break;
    }
  }

  /**
   * Toggle menu open/closed state
   */
  _toggleMenu() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      // Focus first menu item when opening
      setTimeout(() => {
        const menuItems = this._getMenuItems();
        if (menuItems.length > 0) {
          menuItems[0].focus();
        }
      }, 0);
    }
  }

  /**
   * Close menu and restore focus
   */
  _closeMenu() {
    this.isOpen = false;
  }

  /**
   * Focus the menu toggle button
   */
  _focusToggle() {
    const toggle = this.shadowRoot.querySelector(".menuToggle");
    if (toggle) {
      toggle.focus();
    }
  }

  /**
   * Get all focusable menu items
   */
  _getMenuItems() {
    const menu = this.shadowRoot.querySelector(".user-menu");
    if (!menu) return [];

    const items = menu.querySelectorAll("slot");
    const menuItems = [];

    items.forEach((slot) => {
      const assignedElements = slot.assignedElements();
      assignedElements.forEach((el) => {
        // Find focusable elements within slotted content
        const focusable = el.matches('a, button, [tabindex="0"]')
          ? [el]
          : el.querySelectorAll('a, button, [tabindex="0"]');
        menuItems.push(...focusable);
      });
    });

    return menuItems;
  }

  /**
   * Get current focused menu item index
   */
  _getCurrentMenuItemIndex(menuItems) {
    const activeElement =
      this.shadowRoot.activeElement || document.activeElement;
    return menuItems.indexOf(activeElement);
  }

  /**
   * Focus next menu item
   */
  _focusNextItem(menuItems, currentIndex) {
    const nextIndex =
      currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
    if (menuItems[nextIndex]) {
      menuItems[nextIndex].focus();
    }
  }

  /**
   * Focus previous menu item
   */
  _focusPreviousItem(menuItems, currentIndex) {
    const prevIndex =
      currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
    if (menuItems[prevIndex]) {
      menuItems[prevIndex].focus();
    }
  }

  /**
   * Focus first menu item
   */
  _focusFirstItem(menuItems) {
    if (menuItems[0]) {
      menuItems[0].focus();
    }
  }

  /**
   * Focus last menu item
   */
  _focusLastItem(menuItems) {
    if (menuItems[menuItems.length - 1]) {
      menuItems[menuItems.length - 1].focus();
    }
  }
}
customElements.define(AppHaxUserMenu.tag, AppHaxUserMenu);
