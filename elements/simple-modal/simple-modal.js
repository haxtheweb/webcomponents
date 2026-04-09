/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

const SimpleModalCssVars = [
  "--simple-modal-resize",
  "--simple-modal-width",
  "--simple-modal-z-index",
  "--simple-modal-height",
  "--simple-modal-min-width",
  "--simple-modal-min-height",
  "--simple-modal-max-width",
  "--simple-modal-max-height",
  "--simple-modal-titlebar-color",
  "--simple-modal-titlebar-height",
  "--simple-modal-titlebar-line-height",
  "--simple-modal-titlebar-background",
  "--simple-modal-titlebar-padding",
  "--simple-modal-header-color",
  "--simple-modal-header-background",
  "--simple-modal-header-padding",
  "--simple-modal-content-container-color",
  "--simple-modal-content-container-background",
  "--simple-modal-content-padding",
  "--simple-modal-buttons-color",
  "--simple-modal-buttons-background",
  "--simple-modal-buttons-padding",
  "--simple-modal-button-color",
  "--simple-modal-button-background",
];
/**
  * `simple-modal`
  * `A simple modal that ensures accessibility and stack order context appropriately`
  * 
  * ### Styling
 `<simple-fields>` provides following custom properties
 for styling:
 
 Custom property | Description | Default
 ----------------|-------------|--------
 --simple-modal-resize | whether modal can be resized by user (see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/resize}) | unset
 --simple-modal-titlebar-color | height for modal's titlebar | #444
 --simple-modal-titlebar-background | background color for modal's titlebar | #ddd
 --simple-modal-titlebar-padding | padding for modal's titlebar | 0px 16px
 --simple-modal-titlebar-height | height for modal's titlebar | unset
 --simple-modal-titlebar-line-height | text's line height for modal's titlebar | unset
 --simple-modal-header-color | text color for modal's header | #222
 --simple-modal-header-background | background color for modal's header | #ccc
 --simple-modal-header-padding | padding for modal's header | 0px 16px
 --simple-modal-content-container-color | text color for modal's content | #222;
 --simple-modal-content-container-background | text color for modal's content | #fff 
 --simple-modal-content-padding | text color for modal's content | 8px 16px
 --simple-modal-buttons-color | text color for modal's buttons | unset
 --simple-modal-buttons-background | background color for modal's buttons | unset
 --simple-modal-buttons-padding | padding for modal's buttons | 0
 --simple-modal-button-color | text color for modal's buttons | var(--simple-modal-buttons-color)
 --simple-modal-button-background | background color for modal's buttons | var(--simple-modal-buttons-background-color)
 --simple-modal-z-index | z-index for modal | 1000
 --simple-modal-width | width of modal | 75vw
 --simple-modal-height | height of modal | auto;
 --simple-modal-min-width | min-width of modal | unset
 --simple-modal-min-height | min-height of modal | unset
 --simple-modal-max-width | max-width of modal | unset
 --simple-modal-max-height | max-height of modal | unset
  * 
  * @demo ./demo/index.html demo
  * @demo ./demo/css.html styling simple-modal via CSS
  * @demo ./demo/details.html styling simple-modal via event details
  * @demo ./demo/template.html using simple-modal-template
  * @element simple-modal
  */
class SimpleModal extends LitElement {
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none;
        }

        #titlebar {
          margin-top: 0;
          padding: var(
            --simple-modal-titlebar-padding,
            0px var(--ddd-spacing-4)
          );
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: var(
            --simple-modal-titlebar-background,
            light-dark(black, var(--ddd-theme-default-coalyGray))
          );
          color: var(
            --simple-modal-titlebar-color,
            var(--ddd-theme-default-white, white)
          );
          height: var(--simple-modal-titlebar-height, unset);
          line-height: var(--simple-modal-titlebar-line-height, unset);
          font-family: var(--ddd-font-navigation);
        }
        #simple-modal-title {
          margin: 0;
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          flex-wrap: wrap;
          line-height: 1;
        }
        .title-inline {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          flex-wrap: wrap;
          color: currentColor;
           font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-m);
          font-weight: var(--ddd-font-weight-bold);
        }
        .title-inline span {
          transform: translateY(2px);
          display: inline-block; 
        }
        .title-icon{
          --simple-icon-color: currentColor;
          --simple-icon-width: 40px;
          --simple-icon-height: 40px;
          display: inline-flex; 
          align-items: center;  
          vertical-align: middle;
        }


        .breadcrumb-icon {
          --simple-icon-color: currentColor;
          --simple-icon-width: 1em;
          --simple-icon-height: 1em;
          display: inline-flex; 
          align-items: center;  
          vertical-align: middle;
        }
        .breadcrumbs {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          flex-wrap: wrap;
        }
        .breadcrumb-separator {
          display: inline-flex;
          align-items: center;
          font-size: var(--ddd-font-size-xs);
          color: currentColor;
          font-family: var(--ddd-font-navigation);
        }
        .breadcrumb-button,
        .breadcrumb-current {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
           color: currentColor;
          font: inherit;
          line-height: inherit;
          border: 0;
          background: transparent;
          padding: 0;
          margin: 0;
          text-align: left;
          font-family: var(--ddd-font-navigation);
        }
        .breadcrumb-button {
          cursor: pointer;
        }
        .breadcrumb-button:hover,
        .breadcrumb-button:focus-visible {
          text-decoration: underline;
          outline: none;
        }

        #headerbar {
          margin: 0;
          padding: var(--simple-modal-header-padding, 0px var(--ddd-spacing-4));
        }

        #close {
          top: 0;
          border: var(--simple-modal-titlebar-button-border, none);
          padding: var(
            --simple-modal-titlebar-button-padding,
            var(--ddd-spacing-3) 0
          );
          min-width: unset;
          text-transform: none;
          background-color: transparent;
          color: var(
            --simple-modal-titlebar-color,
            var(--ddd-theme-default-white, white)
          );
          --simple-icon-width: var(--ddd-icon-sm);
          --simple-icon-height: var(--ddd-icon-sm);
        }

        #close:hover,
        #close:focus-visible {
          color: var(--ddd-theme-default-skyBlue);
          opacity: 0.7;
        }

        #close simple-icon-lite {
          --simple-icon-height: var(
            --simple-modal-titlebar-icon-height,
            --ddd-icon-3xs
          );
          --simple-icon-width: var(
            --simple-modal-titlebar-icon-width,
            --ddd-icon-3xs
          );
        }

        #simple-modal-content {
          flex-grow: 1;
          padding: var(
            --simple-modal-content-padding,
            var(--ddd-spacing-2) var(--ddd-spacing-4) var(--ddd-spacing-4)
          );
          margin: 0;
          color: var(
            --simple-modal-content-container-color,
            var(--ddd-theme-primary)
          );
          background-color: var(
            --simple-modal-content-container-background,
            light-dark(white, black)
          );
        }

        .buttons {
          padding: 0;
          padding: var(--simple-modal-buttons-padding, 0);
          margin: var(--ddd-spacing-2);
          background-color: var(
            --simple-modal-buttons-background,
            var(
              --simple-modal-content-container-background,
              light-dark(white, black)
            )
          );
        }

        .buttons ::slotted(*) {
          padding: 0 var(--ddd-spacing-4) var(--ddd-spacing-4);
          margin: 0;
          color: var(
            --simple-modal-button-color,
            var(--simple-modal-buttons-color, inherit)
          );
          background-color: var(
            --simple-modal-button-background,
            var(
              --simple-modal-buttons-background,
              var(
                --simple-modal-content-container-background,
                light-dark(white, black)
              )
            )
          );
        }
        web-dialog {
          --dialog-border-radius: var(--ddd-radius-sm);
          z-index: var(--simple-modal-z-index, 1) !important;
          padding: 0;
        }
        web-dialog::part(dialog) {
          background-color: var(
            --simple-modal-content-container-background,
            light-dark(white, black)
          );
          min-height: var(--simple-modal-min-height, unset);
          min-width: var(--simple-modal-min-width, unset);
          z-index: var(--simple-modal-z-index, 1000);
          resize: var(--simple-modal-resize, unset);
          padding: 0;
          --dialog-height: var(--simple-modal-height, auto);
          --dialog-width: var(--simple-modal-width, 75vw);
          --dialog-max-width: var(--simple-modal-max-width, 100vw);
          --dialog-max-height: var(--simple-modal-max-height, 100vh);
        }
        web-dialog.style-scope.simple-modal {
          display: none !important;
        }
        web-dialog[open].style-scope.simple-modal {
          display: flex !important;
          position: fixed !important;
          margin: auto;
        }
        :host([resize="none"]) web-dialog[open].style-scope.simple-modal,
        :host([resize="horizontal"]) web-dialog[open].style-scope.simple-modal {
          top: calc(50% - var(--simple-modal-height, auto) / 2);
        }
        :host([resize="none"]) web-dialog[open].style-scope.simple-modal,
        :host([resize="vertical"]) web-dialog[open].style-scope.simple-modal {
          left: calc(50% - var(--simple-modal-width, 75vw) / 2);
        }

        .full {
          background-color: var(
            --simple-modal-titlebar-background,
            light-dark(black, var(--ddd-theme-default-coalyGray))
          );
        }

        div.empty {
          background-color: transparent;
        }
      `,
    ];
  }
  render() {
    return html` <web-dialog
      id="dialog"
      center
      role="dialog"
      part="dialog"
      aria-describedby="simple-modal-content"
      aria-label="${this._getAriaLabel(this.title)}"
      aria-labelledby="${this._getAriaLabelledby(this.title)}"
      aria-modal="true"
      ?open="${this.opened}"
      @open="${this.open}"
      @close="${this.close}"
    >
      <div id="titlebar" part="titlebar" class=${this.title ? "full" : "empty"}>
        <h3 id="simple-modal-title" ?hidden="${!this.title}" part="title" class=${this.title ? "hr-vert" : ""}>
          ${this._renderTitle()}
        </h3>
        <div></div>
        ${
          !this.modal || this.showClose
            ? html`<simple-icon-button-lite
                id="close"
                dark
                icon="${this.closeIcon}"
                @click="${this.close}"
                label="${this.closeLabel}"
                part="close"
              >
              </simple-icon-button-lite>`
            : ``
        }
      </div>
      <h5 id="headerbar" part="headerbar"><slot name="header"></slot></h4>
      <p id="simple-modal-content" part="content">
        <slot name="content"></slot>
      </p>
      <slot name="custom" part="custom"></slot>
      <div class="buttons" part="buttons">
        <slot name="buttons"></slot>
      </div>
    </web-dialog>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      /**
       * heading / label of the modal
       */
      title: {
        type: String,
      },
      /**
       * open state
       */
      opened: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Close label
       */
      closeLabel: {
        attribute: "close-label",
        type: String,
      },
      /**
       * Close icon
       */
      closeIcon: {
        type: String,
        attribute: "close-icon",
      },
      /**
       * The element that invoked this. This way we can track our way back accessibly
       */
      invokedBy: {
        type: Object,
      },
      /**
       * support for modal flag
       */
      modal: {
        type: Boolean,
      },
      /**
       * support showing close icon while still in modal mode
       */
      showClose: {
        type: Boolean,
        attribute: "show-close",
      },
      /**
       * can add a custom string to style modal based on what is calling it
       */
      mode: {
        type: String,
        reflect: true,
      },
      /**
       * Optional icon shown with the modal title
       */
      titleIcon: {
        type: String,
        attribute: "title-icon",
      },
      /**
       * Optional breadcrumb metadata for title rendering
       */
      breadcrumbs: {
        type: Array,
      },
    };
  }

  /**
   * convention
   */
  static get tag() {
    return "simple-modal";
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.windowControllers = new AbortController();
    this.title = "";
    this.opened = false;
    this.closeLabel = "Close";
    this.closeIcon = "close";
    this.modal = false;
    this.showClose = false;
    this.titleIcon = "";
    this.breadcrumbs = [];
  }
  /**
   * LitElement
   */
  firstUpdated() {
    import("web-dialog/index.js").then((e) => {
      setTimeout(() => {
        this.shadowRoot
          .querySelector("web-dialog")
          .shadowRoot.querySelector("#backdrop").style.backgroundColor =
          "var(--ddd-theme-default-potential70)";
      }, 0);
    });
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "opened") {
        this._openedChanged(this[propName]);
      }
    });
  }
  /**
   * HTMLElement
   */
  connectedCallback() {
    super.connectedCallback();
    this.close = this.close.bind(this);
    this.showEvent = this.showEvent.bind(this);
    setTimeout(() => {
      globalThis.addEventListener("simple-modal-hide", this.close, {
        signal: this.windowControllers.signal,
      });

      globalThis.addEventListener("simple-modal-show", this.showEvent, {
        signal: this.windowControllers.signal,
      });
    }, 0);
  }
  /**
   * HTMLElement
   */
  disconnectedCallback() {
    this.windowControllers.abort();
    super.disconnectedCallback();
  }
  /**
   * show event call to open the modal and display it's content
   *
   */
  showEvent(e) {
    // if we're already opened and we get told to open again....
    // swap out the contents
    // ensure things don't conflict w/ the modal if its around
    globalThis.dispatchEvent(
      new CustomEvent("simple-toast-hide", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: false,
      }),
    );
    if (this.opened) {
      // wipe the slot of our modal
      this.innerHTML = "";
      setTimeout(() => {
        this.show(
          e.detail.title,
          e.detail.mode,
          e.detail.elements,
          e.detail.invokedBy,
          e.detail.id,
          e.detail.modalClass,
          e.detail.styles,
          e.detail.clone,
          e.detail.modal,
          e.detail.showClose,
          e.detail.titleIcon,
          e.detail.breadcrumbs,
        );
      }, 0);
    } else {
      this.show(
        e.detail.title,
        e.detail.mode,
        e.detail.elements,
        e.detail.invokedBy,
        e.detail.id,
        e.detail.modalClass,
        e.detail.styles,
        e.detail.clone,
        e.detail.modal,
        e.detail.showClose,
        e.detail.titleIcon,
        e.detail.breadcrumbs,
      );
    }
  }
  /**
   * Show the modal and display the material
   */
  show(
    title,
    mode,
    elements,
    invokedBy,
    id = null,
    modalClass = null,
    styles = null,
    clone = false,
    modal = false,
    showClose = false,
    titleIcon = null,
    breadcrumbs = [],
  ) {
    this.invokedBy = invokedBy;
    this.modal = modal;
    this.showClose = showClose;
    this.title = title;
    this.mode = mode;
    this.titleIcon = titleIcon || "";
    this.breadcrumbs = Array.isArray(breadcrumbs) ? breadcrumbs : [];
    let element;
    // append element areas into the appropriate slots
    // ensuring they are set if it wasn't previously
    let slots = ["header", "content", "buttons", "custom"];
    if (id) {
      this.setAttribute("id", id);
    } else {
      this.removeAttribute("id");
    }
    this.setAttribute("style", "");
    if (styles) {
      SimpleModalCssVars.forEach((prop) => {
        this.style.setProperty(prop, styles[prop] || "inherit");
      });
    }
    if (modalClass) {
      this.setAttribute("class", modalClass);
    } else {
      this.removeAttribute("class");
    }
    for (var i in slots) {
      if (elements[slots[i]]) {
        if (clone) {
          element = elements[slots[i]].cloneNode(true);
        } else {
          element = elements[slots[i]];
        }
        element.setAttribute("slot", slots[i]);
        this.appendChild(element);
      }
    }
    // minor delay to help the above happen prior to opening
    this.opened = true;
  }
  /**
   * Close the modal and do some clean up
   */
  close() {
    // Restore body scrolling
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";

    this.opened = false;
    if (globalThis.ShadyCSS && !globalThis.ShadyCSS.nativeShadow) {
      this.shadowRoot
        .querySelector("web-dialog")
        .shadowRoot.querySelector("#backdrop").style.position = "relative";
    }
  }
  open() {
    this.opened = true;
    const wd = this.shadowRoot.querySelector("web-dialog");
    // modal mode kills off the ability to close the dialog
    if (this.modal) {
      wd.$backdrop.removeEventListener("click", wd.onBackdropClick);
      wd.removeEventListener("keydown", wd.onKeyDown, { capture: true });
    } else {
      wd.$backdrop.addEventListener("click", wd.onBackdropClick);
      wd.addEventListener("keydown", wd.onKeyDown, {
        capture: true,
        passive: true,
      });
    }
    if (globalThis.ShadyCSS && !globalThis.ShadyCSS.nativeShadow) {
      this.shadowRoot
        .querySelector("web-dialog")
        .shadowRoot.querySelector("#backdrop").style.position = "fixed";
      this.shadowRoot
        .querySelector("web-dialog")
        .shadowRoot.querySelector("#backdrop").style.top = 0;
      this.shadowRoot
        .querySelector("web-dialog")
        .shadowRoot.querySelector("#backdrop").style.bottom = 0;
      this.shadowRoot
        .querySelector("web-dialog")
        .shadowRoot.querySelector("#backdrop").style.left = 0;
      this.shadowRoot
        .querySelector("web-dialog")
        .shadowRoot.querySelector("#backdrop").style.right = 0;
    }
  }
  // Observer opened for changes
  _openedChanged(newValue) {
    if (typeof newValue !== typeof undefined && !newValue) {
      // Restore body scrolling when modal closes
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      // wipe the slot of our modal
      this.title = "";
      this.titleIcon = "";
      this.breadcrumbs = [];
      while (this.firstChild !== null) {
        this.removeChild(this.firstChild);
      }
      if (this.invokedBy) {
        setTimeout(() => {
          this.invokedBy.focus();
        }, 500);
      }
      this.showClose = false;
      const evt = new CustomEvent("simple-modal-closed", {
        bubbles: true,
        cancelable: true,
        detail: {
          opened: false,
          invokedBy: this.invokedBy,
        },
      });
      this.dispatchEvent(evt);
    } else if (newValue) {
      // Prevent body scrolling when modal opens
      document.body.style.overflow = "hidden";
      // p dialog backport; a nice, simple solution for close buttons
      let dismiss = this.querySelectorAll("[dialog-dismiss]");
      dismiss.forEach((el) => {
        el.addEventListener("click", (e) => {
          const evt = new CustomEvent("simple-modal-dismissed", {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
              opened: false,
              invokedBy: this.invokedBy,
            },
          });
          this.dispatchEvent(evt);
          this.close();
        });
      });
      let confirm = this.querySelectorAll("[dialog-confirm]");
      confirm.forEach((el) => {
        el.addEventListener("click", (e) => {
          const evt = new CustomEvent("simple-modal-confirmed", {
            composed: true,
            bubbles: true,
            cancelable: true,
            detail: {
              opened: false,
              invokedBy: this.invokedBy,
            },
          });
          this.dispatchEvent(evt);
          this.close();
        });
      });
      const evt = new CustomEvent("simple-modal-opened", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          opened: true,
          invokedBy: this.invokedBy,
        },
      });
      this.dispatchEvent(evt);
      setTimeout(() => {
        this._focusModalContent();
      }, 0);
    }
  }
  _focusModalContent(attempt = 0) {
    if (!this.opened) {
      return;
    }
    const maxAttempts = 20;
    const contentTarget = this.querySelector(
      [
        "[slot='content'] [autofocus]",
        "[slot='content'] button:not([disabled])",
        "[slot='content'] [href]",
        "[slot='content'] input:not([disabled]):not([type='hidden'])",
        "[slot='content'] select:not([disabled])",
        "[slot='content'] textarea:not([disabled])",
        "[slot='content'] [tabindex]:not([tabindex='-1'])",
        "[slot='buttons'] button:not([disabled])",
        "[slot='buttons'] [tabindex]:not([tabindex='-1'])",
      ].join(", "),
    );
    if (contentTarget && typeof contentTarget.focus === "function") {
      contentTarget.focus();
      return;
    }
    const close = this.shadowRoot.querySelector("#close");
    if (close && close.shadowRoot) {
      const closeButton = close.shadowRoot.querySelector("button");
      if (closeButton && typeof closeButton.focus === "function") {
        closeButton.focus();
        return;
      }
    }
    const dialog = this.shadowRoot.querySelector("#dialog");
    if (dialog && typeof dialog.focus === "function") {
      if (!dialog.hasAttribute("tabindex")) {
        dialog.setAttribute("tabindex", "-1");
      }
      dialog.focus();
      return;
    }
    if (attempt < maxAttempts) {
      setTimeout(() => {
        this._focusModalContent(attempt + 1);
      }, 25);
    }
  }
  /**
   * If there is a title, aria-labelledby should point to #simple-modal-title
   */
  _getAriaLabelledby(title) {
    return !title ? null : "simple-modal-title";
  }
  /**
   * If there is no title, supply a generic aria-label
   */
  _getAriaLabel(title) {
    return !title ? "Modal Dialog" : null;
  }
  _renderTitle() {
    if (Array.isArray(this.breadcrumbs) && this.breadcrumbs.length > 0) {
      return this._renderBreadcrumbs();
    }
    if (this.titleIcon) {
      return html`<span class="title-inline">
        <simple-icon-lite
          class="title-icon"
          icon="${this.titleIcon}"
          aria-hidden="true"
        ></simple-icon-lite>
        <span>${this.title}</span>
      </span>`;
    }
    return this.title;
  }
  _renderBreadcrumbs() {
    const crumbs = this.breadcrumbs.filter(
      (crumb) => crumb && crumb.label && typeof crumb.label === "string",
    );
    if (crumbs.length === 0) {
      return this.title;
    }
    const lastIndex = crumbs.length - 1;
    return html`<nav class="breadcrumbs" aria-label="Modal breadcrumb">
      ${crumbs.map((crumb, index) => {
        const icon =
          crumb.icon || (index === lastIndex && this.titleIcon ? this.titleIcon : "");
        const clickable = this._isBreadcrumbClickable(crumb, index, lastIndex);
        const item = clickable
          ? html`<button
              type="button"
              class="breadcrumb-button"
              @click="${(e) => this._handleBreadcrumbClick(crumb, index, e)}"
            >
              ${icon
                ? html`<simple-icon-lite
                    class="breadcrumb-icon"
                    icon="${icon}"
                    aria-hidden="true"
                  ></simple-icon-lite>`
                : ``}
              <span>${crumb.label}</span>
            </button>`
          : html`<span class="breadcrumb-current" aria-current="page">
              ${icon
                ? html`<simple-icon-lite
                    class="breadcrumb-icon"
                    icon="${icon}"
                    aria-hidden="true"
                  ></simple-icon-lite>`
                : ``}
              <span>${crumb.label}</span>
            </span>`;
        return html`${index > 0
            ? html`<span class="breadcrumb-separator" aria-hidden="true"
                >&gt;</span
              >`
            : ``}${item}`;
      })}
    </nav>`;
  }
  _isBreadcrumbClickable(crumb, index, lastIndex) {
    if (index >= lastIndex) {
      return false;
    }
    if (crumb.clickable === false) {
      return false;
    }
    if (crumb.action || typeof crumb.onClick === "function") {
      return true;
    }
    return false;
  }
  _handleBreadcrumbClick(crumb, index, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const detail = {
      breadcrumb: crumb,
      index: index,
      breadcrumbs: this.breadcrumbs,
      title: this.title,
    };
    if (crumb && typeof crumb.onClick === "function") {
      crumb.onClick(detail);
    }
    this.dispatchEvent(
      new CustomEvent("simple-modal-breadcrumb-click", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: detail,
      }),
    );
  }
}
globalThis.customElements.define(SimpleModal.tag, SimpleModal);
export { SimpleModal, SimpleModalCssVars };

// register globally so we can make sure there is only one
globalThis.SimpleModal = globalThis.SimpleModal || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
globalThis.SimpleModal.requestAvailability = () => {
  if (
    !globalThis.SimpleModal.instance &&
    globalThis.document &&
    globalThis.document.body
  ) {
    globalThis.SimpleModal.instance =
      globalThis.document.createElement("simple-modal");
    globalThis.document.body.appendChild(globalThis.SimpleModal.instance);
  }
  return globalThis.SimpleModal.instance;
};

export const SimpleModalStore = globalThis.SimpleModal.requestAvailability();
