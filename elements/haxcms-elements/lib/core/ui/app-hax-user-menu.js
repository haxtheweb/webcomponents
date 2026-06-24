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
    this.__boundKeydownHandler = this._handleKeydown.bind(this);
    this.__boundDocumentPointerDown =
      this._handleDocumentPointerDown.bind(this);
    this.__boundDocumentFocusIn = this._handleDocumentFocusIn.bind(this);
    this.addEventListener("keydown", this.__boundKeydownHandler);
  }

  connectedCallback() {
    super.connectedCallback();
    globalThis.document.addEventListener(
      "pointerdown",
      this.__boundDocumentPointerDown,
    );
    globalThis.document.addEventListener(
      "focusin",
      this.__boundDocumentFocusIn,
    );
  }

  disconnectedCallback() {
    globalThis.document.removeEventListener(
      "pointerdown",
      this.__boundDocumentPointerDown,
    );
    globalThis.document.removeEventListener(
      "focusin",
      this.__boundDocumentFocusIn,
    );
    this.removeEventListener("keydown", this.__boundKeydownHandler);
    super.disconnectedCallback();
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "isOpen" && oldValue !== undefined) {
        this.dispatchEvent(
          new CustomEvent("is-open-changed", {
            bubbles: true,
            composed: true,
            detail: {
              value: this.isOpen,
            },
          }),
        );
      }
    });
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
          height: var(--ddd-spacing-16, 64px);
        }

        .menuToggle {
          cursor: pointer;
          height: var(--ddd-spacing-16, 64px);
        }

        .user-menu {
          display: none;
        }

        .user-menu.open {
          display: block;
          top: var(--ddd-spacing-16, 64px);
          right: 0px;
          position: absolute;
          border: var(--ddd-border-xs, 1px solid)
            var(--ddd-theme-default-slateGray, #666);
          background: light-dark(white, black);
          color: light-dark(black, white);
          border-radius: none;
          box-shadow: var(--ddd-boxShadow-lg);
          min-width: var(--ddd-spacing-30, 200px);
          z-index: 1000;
          overflow: hidden;
        }

        .user-menu.open ::slotted(*) {
          display: block;
          width: 100%;
          margin: 0;
          font-size: var(--ddd-font-size-6xs, 12px);
          text-align: left;
          font-family: var(--ddd-font-primary, sans-serif);
          background: transparent;
          text-decoration: none;
        }

        .user-menu.open .main-menu ::slotted(*:hover),
        .user-menu.open .main-menu ::slotted(*:active),
        .user-menu.open .main-menu ::slotted(*:focus) {
          background-color: light-dark(
            var(--ddd-theme-default-limestoneGray, #f5f5f5),
            var(--ddd-theme-default-coalyGray, #333)
          );
        }

        :host([dark]) .user-menu.open .main-menu ::slotted(*:hover),
        :host([dark]) .user-menu.open .main-menu ::slotted(*:active),
        :host([dark]) .user-menu.open .main-menu ::slotted(*:focus),
        body.dark-mode .user-menu.open .main-menu ::slotted(*:hover),
        body.dark-mode .user-menu.open .main-menu ::slotted(*:active),
        body.dark-mode .user-menu.open .main-menu ::slotted(*:focus) {
          color: var(--ddd-theme-default-white, white);
        }

        .user-menu.open .post-menu ::slotted(*:hover),
        .user-menu.open .post-menu ::slotted(*:active),
        .user-menu.open .post-menu ::slotted(*:focus) {
          background-color: var(--ddd-theme-default-original87Pink, #e4007c);
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
          <div class="pre-menu" role="group" aria-label="Menu Controls">
            <slot name="pre-menu"></slot>
          </div>
          <div class="main-menu" role="group" aria-label="Main Menu Items">
            <slot name="main-menu"></slot>
          </div>
          <div class="post-menu" role="group" aria-label="Account Actions">
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

  _handleDocumentPointerDown(e) {
    if (!this.isOpen) {
      return;
    }
    const path = e && e.composedPath ? e.composedPath() : [];
    if (path.indexOf(this) === -1) {
      this._closeMenu();
    }
  }

  _handleDocumentFocusIn(e) {
    if (!this.isOpen) {
      return;
    }
    const path = e && e.composedPath ? e.composedPath() : [];
    if (path.indexOf(this) !== -1) {
      return;
    }
    this._closeMenu();
  }

  /**
   * Focus the menu toggle button
   */
  _focusToggle() {
    const menuButtonSlot =
      this.shadowRoot && this.shadowRoot.querySelector('slot[name="menuButton"]');
    if (menuButtonSlot) {
      const assignedElements = menuButtonSlot.assignedElements({
        flatten: true,
      });
      if (assignedElements && assignedElements.length > 0) {
        const firstAssigned = assignedElements[0];
        if (firstAssigned && typeof firstAssigned.focus === "function") {
          firstAssigned.focus();
          return;
        }
        if (firstAssigned && firstAssigned.querySelector) {
          const nestedFocusable = firstAssigned.querySelector(
            'button, a, [tabindex]:not([tabindex="-1"])',
          );
          if (
            nestedFocusable &&
            typeof nestedFocusable.focus === "function"
          ) {
            nestedFocusable.focus();
            return;
          }
        }
      }
    }
    const toggle = this.shadowRoot.querySelector(".menuToggle");
    if (toggle && typeof toggle.focus === "function") {
      toggle.focus();
    }
  }

  /**
   * Collect all focusable elements from an element, piercing shadow DOM.
   */
  _collectFocusable(el, results) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return;
    if (el.matches('a, button, [tabindex]:not([tabindex="-1"])')) {
      results.push(el);
    }
    if (el.children) {
      Array.from(el.children).forEach((child) => {
        this._collectFocusable(child, results);
      });
    }
    if (el.shadowRoot) {
      Array.from(el.shadowRoot.querySelectorAll("*")).forEach((child) => {
        this._collectFocusable(child, results);
      });
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
      const assignedElements = slot.assignedElements({ flatten: true });
      assignedElements.forEach((el) => {
        this._collectFocusable(el, menuItems);
      });
    });

    return menuItems;
  }

  /**
   * Get current focused menu item index, piercing shadow DOM.
   */
  _getCurrentMenuItemIndex(menuItems) {
    let activeElement = document.activeElement;
    while (
      activeElement &&
      activeElement.shadowRoot &&
      activeElement.shadowRoot.activeElement
    ) {
      activeElement = activeElement.shadowRoot.activeElement;
    }
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
