/**
 * Copyright 2025 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";

/**
 * `simple-context-menu`
 * `Reusable context menu dialog with keyboard navigation and accessibility`
 *
 * @demo demo/index.html
 * @element simple-context-menu
 */
class SimpleContextMenu extends DDD {
  static get tag() {
    return "simple-context-menu";
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: inline-block;
        }

        dialog {
          position: absolute;
          background: light-dark(
            var(--simple-context-menu-background, white),
            var(--simple-context-menu-background-dark, #000000)
          );
          border: var(--ddd-border-sm);
          border-color: light-dark(
            var(--simple-context-menu-border-color, #e0e0e0),
            var(--simple-context-menu-border-color-dark, #444)
          );
          box-shadow: var(
            --simple-context-menu-shadow,
            0 2px 8px rgba(0, 0, 0, 0.15)
          );
          min-width: var(--simple-context-menu-min-width, 200px);
          padding: 0;
          margin: 0;
          z-index: var(--simple-context-menu-z-index, 1000);
          border-radius: var(--ddd-radius-sm);
        }

        dialog::backdrop {
          background: transparent;
        }

        .menu-header {
          padding: var(--ddd-spacing-2);
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-4xs);
          text-transform: uppercase;
          border-bottom: var(--ddd-border-sm);
          margin-bottom: var(--ddd-spacing-1);
          color: var(--simple-context-menu-header-color, inherit);
        }

        ::slotted(*) {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          cursor: pointer;
          border: none;
          background: transparent;
          text-align: left;
          font-size: 12px;
          color: inherit;
        }

        ::slotted(*:hover),
        ::slotted(*:focus) {
          background: light-dark(#f0f0f0, #333);
          outline: none;
        }

        ::slotted([disabled]) {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }
      `,
    ];
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * Title displayed in menu header
       */
      title: {
        type: String,
      },
      /**
       * Whether the menu is open
       */
      open: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Position strategy: 'anchor' (relative to trigger), 'fixed' (custom positioning)
       */
      positionStrategy: {
        type: String,
        attribute: "position-strategy",
      },
      /**
       * X coordinate for fixed positioning
       */
      x: {
        type: Number,
      },
      /**
       * Y coordinate for fixed positioning
       */
      y: {
        type: Number,
      },
      /**
       * Offset from anchor element (in pixels)
       */
      offset: {
        type: Number,
      },
    };
  }

  constructor() {
    super();
    this.title = "";
    this.open = false;
    this.positionStrategy = "anchor";
    this.x = 0;
    this.y = 0;
    this.offset = 4;
    this._anchorElement = null;
  }

  render() {
    return html`
      <dialog
        id="menu"
        @click=${this._handleBackdropClick}
        @keydown=${this._handleKeydown}
      >
        ${this.title
          ? html` <div class="menu-header">${this.title}</div> `
          : ""}
        <slot></slot>
      </dialog>
    `;
  }

  /**
   * Toggle menu visibility
   * @param {Element} anchorElement - Element to position menu relative to
   */
  toggle(anchorElement = null) {
    if (this.open) {
      this.close();
    } else {
      this.openMenu(anchorElement);
    }
  }

  /**
   * Open the menu
   * @param {Element} anchorElement - Element to position menu relative to
   */
  openMenu(anchorElement = null) {
    const dialog = this.shadowRoot.querySelector("#menu");
    if (!dialog) return;

    this._anchorElement = anchorElement;
    dialog.showModal();
    this.open = true;

    // Position the dialog
    this._positionDialog(dialog, anchorElement);

    // Focus first focusable item
    setTimeout(() => {
      const firstItem = this._getFocusableItems()[0];
      if (firstItem) firstItem.focus();
    }, 0);

    this.dispatchEvent(
      new CustomEvent("simple-context-menu-opened", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * Close the menu
   */
  close() {
    const dialog = this.shadowRoot.querySelector("#menu");
    if (dialog && dialog.open) {
      dialog.close();
      this.open = false;
      this.dispatchEvent(
        new CustomEvent("simple-context-menu-closed", {
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  /**
   * Position the dialog based on strategy
   */
  _positionDialog(dialog, anchorElement) {
    if (this.positionStrategy === "fixed") {
      dialog.style.top = `${this.y}px`;
      dialog.style.left = `${this.x}px`;
    } else if (this.positionStrategy === "anchor" && anchorElement) {
      const rect = anchorElement.getBoundingClientRect();
      dialog.style.top = `${rect.bottom + this.offset}px`;
      dialog.style.left = `${rect.left}px`;
    }
  }

  /**
   * Get all focusable items in the menu
   */
  _getFocusableItems() {
    const slot = this.shadowRoot.querySelector("slot");
    const nodes = slot.assignedElements();
    return nodes.filter(
      (node) =>
        !node.hasAttribute("disabled") &&
        (node.tagName === "BUTTON" ||
          node.tabIndex >= 0 ||
          node.hasAttribute("tabindex")),
    );
  }

  /**
   * Handle keyboard navigation
   */
  _handleKeydown(e) {
    const menuItems = this._getFocusableItems();
    if (menuItems.length === 0) return;
    
    const currentIndex = menuItems.indexOf(globalThis.document.activeElement);

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % menuItems.length;
        if (menuItems[nextIndex]) {
          menuItems[nextIndex].focus();
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        const prevIndex =
          currentIndex === 0 ? menuItems.length - 1 : currentIndex - 1;
        if (menuItems[prevIndex]) {
          menuItems[prevIndex].focus();
        }
        break;
      case "Escape":
        this.close();
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (currentIndex >= 0 && menuItems[currentIndex]) {
          menuItems[currentIndex].click();
        }
        break;
    }
  }

  /**
   * Handle backdrop click to close
   */
  _handleBackdropClick(e) {
    const dialog = e.target;
    if (e.target.nodeName === "DIALOG") {
      const rect = dialog.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        this.close();
      }
    }
  }
}

globalThis.customElements.define(SimpleContextMenu.tag, SimpleContextMenu);
export { SimpleContextMenu };
