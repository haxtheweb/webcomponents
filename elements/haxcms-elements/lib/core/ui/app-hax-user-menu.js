// TODO: Create app-hax-user-menu-button to be tossed into this
// TODO: Create prefix and suffix sections for sound/light toggles and other shtuff

// dependencies / things imported
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import {
  HaxUiAdminTokens,
  HaxUiAdminPrimitives,
} from "@haxtheweb/d-d-d/lib/HaxUiAdminTokens.js";

export class AppHaxUserMenu extends I18NMixin(DDDSuper(LitElement)) {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return "app-hax-user-menu";
  }

  constructor() {
    super();
    this.isOpen = false;
    this.icon = "account-circle";
    this.align = "end";
    this.label = "";
    this.shortcut = "";
    this._groups = { pre: false, main: false, post: false };
    this.t = this.t || {};
    this.t = {
      ...this.t,
      menuControls: "Menu Controls",
      mainMenuItems: "Main Menu Items",
      accountActions: "Account Actions",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../../locales/", import.meta.url).href,
    });
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
      /** which edge the menu lines up with: "end" (default, opens leftward
       * from a right-side toggle) or "start" (opens rightward) */
      align: { type: String, reflect: true },
      /** optional heading at the top of the open menu */
      label: { type: String },
      /** optional keyboard shortcut shown next to the heading */
      shortcut: { type: String },
      /** which slot groups have content, for the lines between them */
      _groups: { type: Object, state: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      ...HaxUiAdminTokens,
      ...HaxUiAdminPrimitives,
      css`
        :host {
          font-family: var(--hax-ui-admin-font-family);
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
        /* a HAX UI popover: surface, line, 8px corners, rows inside */
        .user-menu.open {
          display: block;
          position: absolute;
          top: calc(var(--ddd-spacing-16, 64px) - var(--hax-ui-gap, 4px));
          right: 0px;
          z-index: 1000;
          box-sizing: border-box;
          min-width: var(--app-hax-user-menu-width, 280px);
          padding: var(--hax-ui-gap-md, 8px);
          text-align: left;
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius-lg);
          box-shadow: var(--hax-ui-shadow-popover);
          overflow: hidden;
        }
        :host([align="start"]) .user-menu.open {
          left: 0px;
          right: auto;
        }
        .menu-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--hax-ui-gap-md, 8px);
          padding: var(--hax-ui-gap, 4px) var(--hax-ui-gap-md, 8px)
            var(--hax-ui-gap-md, 8px);
          font-size: var(--hax-ui-admin-font-size-xs);
          font-weight: var(--ddd-font-weight-bold, 700);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--hax-ui-text-muted);
        }
        .menu-header .hax-ui-kbd {
          letter-spacing: 0;
          text-transform: none;
        }
        .user-menu.open ::slotted(*) {
          display: block;
          width: 100%;
          margin: 0;
          text-decoration: none;
        }
        .user-menu ::slotted(button) {
          cursor: pointer;
        }
        /* groups are split by a thin line, as in the admin rail */
        .pre-menu,
        .main-menu,
        .post-menu {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .group-line {
          height: 1px;
          margin: var(--hax-ui-gap-md, 8px) var(--hax-ui-gap, 4px);
          background-color: var(--hax-ui-line);
        }
        .group-line[hidden] {
          display: none;
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="entireComponent">
        <!-- no ARIA here: this div is a presentational wrapper. The slotted
             menuButton (app-hax-user-menu-toggle) is the real disclosure
             control and carries aria-expanded itself; aria-expanded/haspopup
             on a role-less div is invalid (axe: aria-allowed-attr) -->
        <div class="menuToggle" part="menuToggle">
          <slot name="menuButton"
            ><simple-icon-lite
              icon="${this.icon}"
              aria-hidden="true"
            ></simple-icon-lite
          ></slot>
        </div>

        <!-- disclosure panel (not role=menu): it contains labeled groups of
             mixed controls (toggle switches, links, buttons) which are not
             valid menuitem children (axe: aria-required-children) -->
        <div
          id="user-menu-dropdown"
          class="user-menu ${this.isOpen ? "open" : ""}"
          part="dropdown"
          ?inert="${!this.isOpen}"
        >
          ${
            this.label
              ? html`<div class="menu-header" part="menu-header">
                  <span>${this.label}</span>
                  ${
                    this.shortcut
                      ? html`<kbd class="hax-ui-kbd" aria-hidden="true"
                          >${this.shortcut}</kbd
                        >`
                      : ""
                  }
                </div>`
              : ""
          }
          <div
            class="pre-menu"
            role="group"
            aria-label="${this.t.menuControls}"
          >
            <slot name="pre-menu" @slotchange="${this._groupsChanged}"></slot>
          </div>
          <div
            class="group-line"
            ?hidden="${!(this._groups.pre && this._groups.main)}"
          ></div>
          <div
            class="main-menu"
            role="group"
            aria-label="${this.t.mainMenuItems}"
          >
            <slot name="main-menu" @slotchange="${this._groupsChanged}"></slot>
          </div>
          <div
            class="group-line"
            ?hidden="${!(
              this._groups.post &&
              (this._groups.pre || this._groups.main)
            )}"
          ></div>
          <div
            class="post-menu"
            role="group"
            aria-label="${this.t.accountActions}"
          >
            <slot name="post-menu" @slotchange="${this._groupsChanged}"></slot>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Track which groups have slotted content so the dividers between
   * them only show when both sides have something.
   */
  _groupsChanged() {
    const has = (name) => {
      const slot = this.shadowRoot.querySelector(`slot[name="${name}"]`);
      return !!(slot && slot.assignedElements({ flatten: true }).length);
    };
    this._groups = {
      pre: has("pre-menu"),
      main: has("main-menu"),
      post: has("post-menu"),
    };
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
      this.shadowRoot &&
      this.shadowRoot.querySelector('slot[name="menuButton"]');
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
          if (nestedFocusable && typeof nestedFocusable.focus === "function") {
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
