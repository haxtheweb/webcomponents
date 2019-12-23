import { html, css } from "lit-element/lit-element.js";
// LitElement based
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { encapScript, wipeSlot } from "@lrnwebcomponents/utils/utils.js";
/**
 * `hax-body`
 * @customElement hax-body
 * `Manager of the body area that can be modified`
 * @microcopy - the mental model for this element
 *  - body is effectively a body of content that can be manipulated in the browser. This is for other HAX elements ultimately to interface with and reside in. It is the controller of input and output for all of HAX as it exists in a document. body is not the <body> tag but we need a similar mental model container for all our other elements.
 *  - text-context - the context menu that shows up when an item is active so it can have text based operations performed to it.
 *  - plate/grid plate - a plate or grid plate is a container that we can operate on in HAX. it can also have layout / "global" type of body operations performed on it such as delete, duplicate and higher level format styling.
 */
class HaxBody extends SimpleColors {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      ...super.styles,
      css`
        :host,
        :host * ::slotted(*) {
          line-height: 1.8;
        }
        :host ul,
        :host * ::slotted(ul),
        :host ol,
        :host * ::slotted(ol) {
          padding-left: 20px;
          margin-left: 20px;
        }
        :host ul,
        :host * ::slotted(ul) {
          list-style-type: disc;
        }
        :host li,
        :host * ::slotted(li) {
          margin-bottom: 6px;
        }
        :host {
          display: block;
          position: relative;
          min-height: 32px;
          min-width: 32px;
          outline: none;
          --hax-body-editable-border-color: #bbbbbb;
          --hax-body-active-border-color: #000000;
          --hax-body-target-background-color: var(
            --simple-colors-default-theme-blue-1
          );
          --hax-body-possible-target-background-color: transparent;
        }
        .hax-context-menu {
          padding: 0;
          margin-left: -5000px;
          position: absolute;
          visibility: hidden;
          opacity: 0;
          z-index: 1000;
          float: left;
          display: block;
          pointer-events: none;
          transition: 0.2s opacity ease-in-out, 0.2s visibility ease-in-out;
        }
        #textcontextmenu.hax-context-menu {
          z-index: 1001;
        }
        #haxinputmixer {
          z-index: 10000000;
        }
        .hax-context-visible.hax-active-hover {
          visibility: visible;
          opacity: 1;
          pointer-events: all;
          margin-left: unset;
        }
        :host #bodycontainer ::slotted(h1) {
          font-size: var(--hax-base-styles-h1-font-size, 2.5em);
          line-height: var(--hax-base-styles-h1-line-height, 2.5em);
        }
        :host #bodycontainer ::slotted(h2) {
          font-size: var(--hax-base-styles-h2-font-size, 2em);
        }
        :host #bodycontainer ::slotted(h3) {
          font-size: var(--hax-base-styles-h3-font-size, 1.75em);
        }
        :host #bodycontainer ::slotted(h4) {
          font-size: var(--hax-base-styles-h4-font-size, 1.5em);
        }
        :host #bodycontainer ::slotted(h5) {
          font-size: var(--hax-base-styles-h5-font-size, 1.25em);
        }
        :host #bodycontainer ::slotted(h6) {
          font-size: var(--hax-base-styles-h6-font-size, 1.25em);
        }
        :host #bodycontainer ::slotted(p) {
          min-height: var(--hax-base-styles-p-min-height, 43px);
          font-size: var(--hax-base-styles-p-font-size, 24px);
          line-height: var(--hax-base-styles-p-line-height, 1.8);
          letter-spacing: var(--hax-base-styles-p-letter-spacing, 0.5px);
        }
        :host #bodycontainer ::slotted(a) {
          color: var(--hax-base-styles-a-color, #000);
          font-size: var(--hax-base-styles-a-font-size, 24px);
          font-weight: var(--hax-base-styles-a-font-weight, normal);
        }
        :host #bodycontainer ::slotted(a:visited) {
          color: var(--hax-base-styles-a-color-visited, #2196f3);
        }
        :host #bodycontainer ::slotted(a:active),
        :host #bodycontainer ::slotted(a:focus),
        :host #bodycontainer ::slotted(a:hover) {
          color: var(--hax-base-styles-a-color-active, #2196f3);
          font-weight: var(--hax-base-styles-a-font-weight-active, normal);
        }
        :host #bodycontainer ::slotted(ol),
        :host #bodycontainer ::slotted(ul),
        :host #bodycontainer ::slotted(li) {
          padding-bottom: var(--hax-base-styles-list-padding-bottom, 1.5em);
          line-height: var(--hax-base-styles-list-line-height, 40px);
          font-size: var(--hax-base-styles-list-font-size, 24px);
          max-width: var(--hax-base-styles-list-max-width, 28em);
        }
        :host #bodycontainer ::slotted(ol > li:last-child),
        :host #bodycontainer ::slotted(ul > li:last-child) {
          padding-bottom: var(
            --hax-base-styles-list-last-child-padding-bottom,
            1em
          );
        }
        :host #bodycontainer ::slotted(ul),
        :host #bodycontainer ::slotted(ol) {
          padding-left: var(--hax-base-styles-list-padding-left, 20px);
          padding-left: var(--hax-base-styles-list-margin-left, 20px);
        }

        :host([edit-mode]) #bodycontainer ::slotted(*[data-editable]) {
          outline: none;
          caret-color: var(--hax-color-text);
        }
        :host([edit-mode])
          #bodycontainer
          ::slotted(*:not(grid-plate)[data-editable]:hover) {
          outline: 2px dashed rgba(145, 151, 162, 0.5);
          caret-color: #000000;
        }
        :host([edit-mode])
          #bodycontainer
          ::slotted(*.hax-active[data-editable]:hover) {
          cursor: text !important;
          outline: 2px dashed rgba(145, 151, 162, 0.5);
        }
        :host([edit-mode])
          #bodycontainer
          ::slotted(*:not(grid-plate)[data-editable] .hax-active:hover) {
          cursor: text !important;
          outline: 2px dashed rgba(145, 151, 162, 0.5);
        }
        :host([edit-mode])
          #bodycontainer
          ::slotted(code.hax-active[data-editable]) {
          display: block;
        }
        :host([edit-mode])
          #bodycontainer
          ::slotted(*.hax-active[data-editable]) {
          outline: 2px dashed rgba(145, 151, 162, 0.25);
        }
        :host([edit-mode]) #bodycontainer ::slotted(hr[data-editable]) {
          height: 2px;
          background-color: #eeeeee;
          padding-top: 4px;
          padding-bottom: 4px;
        }
        /** Fix to support safari as it defaults to none */
        :host([edit-mode]) #bodycontainer ::slotted(*[data-editable]) {
          -webkit-user-select: text;
          cursor: pointer;
        }

        :host([edit-mode])
          #bodycontainer
          ::slotted(*[data-editable]::-moz-selection),
        :host([edit-mode])
          #bodycontainer
          ::slotted(*[data-editable] *::-moz-selection) {
          background-color: var(--hax-body-highlight, --paper-yellow-300);
          color: black;
        }
        :host([edit-mode])
          #bodycontainer
          ::slotted(*[data-editable]::selection),
        :host([edit-mode])
          #bodycontainer
          ::slotted(*[data-editable] *::selection) {
          background-color: var(--hax-body-highlight, --paper-yellow-300);
          color: black;
        }
        #bodycontainer {
          -webkit-user-select: text;
          user-select: text;
        }
        :host([edit-mode][hax-ray-mode])
          #bodycontainer
          ::slotted(*[data-editable]):before {
          content: attr(data-hax-ray) " " attr(resource) " " attr(typeof) " "
            attr(property) " " attr(content);
          font-size: 10px;
          font-style: italic;
          left: unset;
          right: unset;
          top: unset;
          background-color: #d3d3d3;
          color: #000000;
          bottom: unset;
          width: auto;
          padding: 8px;
          margin: 0;
          z-index: 1;
          margin: -16px 0 0 0;
          float: right;
          line-height: 2;
        }
        /* drag and drop */
        :host([edit-mode]) #bodycontainer ::slotted(.mover) {
          outline: 2px dashed var(--hax-body-editable-border-color);
        }
        :host([edit-mode]) #bodycontainer ::slotted(.mover) {
          background-color: var(--hax-body-possible-target-background-color);
          padding: 16px;
        }
        :host([edit-mode]) #bodycontainer ::slotted(.hovered) {
          background-color: var(--hax-body-target-background-color) !important;
          outline: dashed 2px var(--hax-body-active-border-color);
          z-index: 2;
        }
        .hax-context-menu:not(:defined) {
          display: none;
        }
      `
    ];
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    // lock to ensure we don't flood events on hitting the up / down arrows
    // as we use a mutation observer to manage draggable bindings
    this.___moveLock = false;
    this.editMode = false;
    this.globalPreferences = {};
    // xray goggles for tags visualized in context, developer thing
    this.haxRayMode = false;
    this.activeNode = null;
    this.activeContainerNode = null;
    setTimeout(() => {
      import("./lib/hax-text-context.js");
      import("./lib/hax-ce-context.js");
      import("./lib/hax-plate-context.js");
      import("./lib/hax-input-mixer.js");
      import("@lrnwebcomponents/grid-plate/grid-plate.js");
      this.polyfillSafe = window.HaxStore.instance.computePolyfillSafe();
      this.addEventListener(
        "hax-context-item-selected",
        this._haxContextOperation.bind(this)
      );
      this.addEventListener(
        "hax-input-mixer-update",
        this._haxInputMixerOperation.bind(this)
      );
      this.addEventListener(
        "place-holder-replace",
        this.replacePlaceholder.bind(this)
      );
      this.addEventListener("focusin", this._focusIn.bind(this));
      this.addEventListener("mousedown", this._focusIn.bind(this));
    }, 0);
  }
  static get tag() {
    return "hax-body";
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <div id="bodycontainer" class="ignore-activation">
        <slot id="body"></slot>
      </div>
      <hax-text-context
        id="textcontextmenu"
        class="hax-context-menu ignore-activation"
      ></hax-text-context>
      <hax-ce-context
        id="cecontextmenu"
        class="hax-context-menu ignore-activation"
      ></hax-ce-context>
      <hax-plate-context
        id="platecontextmenu"
        class="hax-context-menu ignore-activation"
      ></hax-plate-context>
      <hax-input-mixer
        id="haxinputmixer"
        class="hax-context-menu ignore-activation"
      ></hax-input-mixer>
    `;
  }
  /**
   * LitElement / popular convention
   */
  static get properties() {
    return {
      ...super.properties,
      openDrawer: {
        type: Object
      },
      /**
       * State of if we are editing or not.
       */
      editMode: {
        type: Boolean,
        reflect: true,
        attribute: "edit-mode"
      },
      /**
       * Bust out the HAX Ray mode
       */
      haxRayMode: {
        type: Boolean,
        reflect: true,
        attribute: "hax-ray-mode"
      },
      /**
       * Access to the global properties object.
       */
      globalPreferences: {
        type: Object
      },
      /**
       * A reference to the active node in the slot.
       */
      activeNode: {
        type: Object
      },
      /**
       * A reference to the active node in the slot.
       */
      activeContainerNode: {
        type: Object
      }
    };
  }
  /**
   * LitElement life cycle - ready
   */
  firstUpdated(changedProperties) {
    this.dispatchEvent(
      new CustomEvent("hax-register-body", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
    // try to normalize paragraph insert on enter
    try {
      document.execCommand("enableObjectResizing", false, false);
      document.execCommand("defaultParagraphSeparator", false, "p");
    } catch (e) {
      console.warn(e);
    }
    this.shadowRoot
      .querySelector("slot")
      .addEventListener("mousemove", this.hoverEvent.bind(this));
    this.shadowRoot.querySelector("slot").addEventListener("mouseup", e => {
      const tmp = window.HaxStore.getSelection();
      window.HaxStore._tmpSelection = tmp;
      try {
        const range = window.HaxStore.getRange();
        if (range.cloneRange) {
          window.HaxStore._tmpRange = range.cloneRange();
        }
      } catch (e) {
        console.warn(e);
      }
    });
    // in case we miss this on the initial setup. possible in auto opening environments.
    this.editMode = window.HaxStore.instance.editMode;
    // ensure this resets every append
    this.__tabTrap = false;
  }
  /**
   * LitElement life cycle - properties changed callback
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "openDrawer") {
        this._openDrawerChanged(this[propName], oldValue);
      }
      if (propName == "editMode") {
        this._editModeChanged(this[propName], oldValue);
      }
      if (propName == "globalPreferences") {
        this._globalPreferencesUpdated(this[propName], oldValue);
      }
      if (propName == "activeNode") {
        this._activeNodeChanged(this[propName], oldValue);
        // notify
        this.dispatchEvent(
          new CustomEvent("active-node-changed", {
            detail: {
              value: this[propName]
            }
          })
        );
      }
      if (propName == "activeContainerNode") {
        this._activeContainerNodeChanged(this[propName], oldValue);
        // notify
        this.dispatchEvent(
          new CustomEvent("active-container-node-changed", {
            detail: {
              value: this[propName]
            }
          })
        );
      }
    });
  }
  /**
   * Odd, but this is because NO DRAWER IS OPEN, meaning that
   * the hax body has regained focus / is visible
   */
  _openDrawerChanged(newValue, oldValue) {
    if (!newValue) {
      this.positionContextMenus(this.activeNode, this.activeContainerNode);
    } else {
      this.hideContextMenus();
    }
  }
  /**
   * HTMLElement
   */
  connectedCallback() {
    super.connectedCallback();
    // mutation observer that ensures state of hax applied correctly
    this._observer = new MutationObserver(mutations => {
      var mutFind = false;
      mutations.forEach(mutation => {
        // if we've got new nodes, we have to react to that
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (this._validElementTest(node)) {
              // edge case, thing is moved around in the dom so let's do the opposite
              // this is something that has PART of these applies
              // let's make sure that we maintain state associated with contenteditable
              if (
                this.editMode &&
                (node.getAttribute("contenteditable") == "true" ||
                  node.getAttribute("contenteditable") === true ||
                  node.getAttribute("contenteditable") == "contenteditable")
              ) {
                this.__applyNodeEditableState(node, !this.editMode);
              }
              this.__applyNodeEditableState(node, this.editMode);
              this.dispatchEvent(
                new CustomEvent("hax-body-tag-added", {
                  bubbles: true,
                  cancelable: true,
                  composed: true,
                  detail: { node: node }
                })
              );
              // set new nodes to be the active one
              // only if we didn't just do a grid plate move
              // if multiple mutations, only accept the 1st one in a group
              if (!this.___moveLock && !mutFind) {
                mutFind = true;
                this.activeNode = node;
                window.HaxStore.write("activeNode", node, this);
              } else {
                this.___moveLock = false;
              }
            }
          });
        }
        // if we dropped nodes via the UI (delete event basically)
        if (mutation.removedNodes.length > 0) {
          // handle removing items... not sure we need to do anything here
          mutation.removedNodes.forEach(node => {
            if (
              this._validElementTest(node) &&
              !node.classList.contains("hax-active")
            ) {
              this.dispatchEvent(
                new CustomEvent("hax-body-tag-removed", {
                  bubbles: true,
                  cancelable: true,
                  composed: true,
                  detail: { node: node }
                })
              );
            }
          });
        }
      });
    });
    this._observer.observe(this, {
      childList: true
    });
    setTimeout(() => {
      window.addEventListener("keydown", this._onKeyDown.bind(this));
      window.addEventListener("keypress", this._onKeyPress.bind(this));
      document.body.addEventListener(
        "hax-store-property-updated",
        this._haxStorePropertyUpdated.bind(this)
      );
      window.addEventListener("scroll", this._keepContextVisible.bind(this));
    }, 0);
  }
  /**
   * HTMLElement
   */
  disconnectedCallback() {
    window.removeEventListener("keydown", this._onKeyDown.bind(this));
    window.removeEventListener("keypress", this._onKeyPress.bind(this));
    document.body.removeEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
    window.removeEventListener("scroll", this._keepContextVisible.bind(this));
    this._observer.disconnect();
    super.disconnectedCallback();
  }
  /**
   * Keep the context menu visible if needed
   */
  _keepContextVisible(e) {
    if (!this.openDrawer && this.editMode) {
      // see if the text context menu is visible
      let el = false;
      if (
        this.shadowRoot
          .querySelector("#textcontextmenu")
          .classList.contains("hax-context-visible")
      ) {
        el = this.shadowRoot.querySelector("#textcontextmenu");
      } else if (
        this.shadowRoot
          .querySelector("#cecontextmenu")
          .classList.contains("hax-context-visible")
      ) {
        el = this.shadowRoot.querySelector("#cecontextmenu");
      }
      // if we see it, ensure we don't have the pin
      if (el) {
        if (this.elementInViewport(el)) {
          el.classList.remove("hax-context-pin-bottom", "hax-context-pin-top");
        } else {
          if (this.__OffBottom) {
            el.classList.add("hax-context-pin-top");
          } else {
            el.classList.add("hax-context-pin-bottom");
          }
        }
      }
    }
  }
  _onKeyDown(e) {
    // @todo need another state value to prevent key tests when dialogs open
    if (
      !this.openDrawer &&
      this.editMode &&
      this.getAttribute("contenteditable")
    ) {
      switch (e.key) {
        case "Tab":
          if (
            window.HaxStore.instance.isTextElement(this.activeContainerNode)
          ) {
            if (e.detail.keyboardEvent) {
              e.detail.keyboardEvent.preventDefault();
              e.detail.keyboardEvent.stopPropagation();
              e.detail.keyboardEvent.stopImmediatePropagation();
            }
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            if (e.shiftKey) {
              this._tabBackKeyPressed();
            } else {
              this._tabKeyPressed();
            }
          }
          break;
        case "Enter":
          this.setAttribute("contenteditable", true);
        case "Backspace":
        case "Delete":
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
          clearTimeout(this.__keyPressDirection);
          this.__keyPressDirection = setTimeout(() => {
            const rng = window.HaxStore.getRange();
            if (
              rng.commonAncestorContainer &&
              this.activeNode !== rng.commonAncestorContainer &&
              typeof rng.commonAncestorContainer.focus === "function"
            ) {
              if (rng.commonAncestorContainer.tagName !== "HAX-BODY") {
                if (
                  window.HaxStore.instance.isTextElement(
                    rng.commonAncestorContainer
                  )
                ) {
                  this.setAttribute("contenteditable", true);
                } else {
                  this.removeAttribute("contenteditable");
                }
                rng.commonAncestorContainer.focus();
                this.__focusLogic(rng.commonAncestorContainer);
              }
            }
            // need to check on the parent too if this was a text node
            else if (
              rng.commonAncestorContainer &&
              rng.commonAncestorContainer.parentNode &&
              this.activeNode !== rng.commonAncestorContainer.parentNode &&
              typeof rng.commonAncestorContainer.parentNode.focus === "function"
            ) {
              if (
                rng.commonAncestorContainer.parentNode.tagName !== "HAX-BODY"
              ) {
                if (
                  window.HaxStore.instance.isTextElement(
                    rng.commonAncestorContainer.parentNode
                  )
                ) {
                  this.setAttribute("contenteditable", true);
                } else {
                  this.removeAttribute("contenteditable");
                }
                rng.commonAncestorContainer.parentNode.focus();
                this.__focusLogic(rng.commonAncestorContainer.parentNode);
              }
            }
          }, 50);
          break;
      }
      if (
        this.shadowRoot
          .querySelector("#platecontextmenu")
          .classList.contains("hax-active-hover")
      ) {
        this.__dropActiveHover();
      }
    }
  }
  _onKeyPress(e) {
    if (
      !this.openDrawer &&
      this.editMode &&
      this.shadowRoot
        .querySelector("#platecontextmenu")
        .classList.contains("hax-active-hover") &&
      this.activeNode &&
      window.HaxStore.instance.isTextElement(this.activeNode)
    ) {
      this.__dropActiveHover();
    } else if (
      !this.openDrawer &&
      this.editMode &&
      this.activeNode &&
      window.HaxStore.instance.isTextElement(this.activeNode)
    ) {
      // If the user has paused for awhile, show the menu
      clearTimeout(this.__positionContextTimer);
      this.__positionContextTimer = setTimeout(() => {
        // always on active if we were just typing
        this.positionContextMenus(this.activeNode, this.activeNode);
      }, 2000);
    }
  }
  /**
   * on mouse over then fire the hax ray value if we have one
   */
  hoverEvent(e) {
    if (!this.openDrawer && this.editMode) {
      if (e.target && e.target.getAttribute("data-hax-ray") != null) {
        this.__activeHover = e.target;
        this.dispatchEvent(
          new CustomEvent("hax-active-hover-name", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: e.target.getAttribute("data-hax-ray")
          })
        );
      } else if (
        e.target &&
        e.target.parentNode &&
        e.target.parentNode.getAttribute("data-hax-ray") != null
      ) {
        this.__activeHover = e.target.parentNode;
        this.dispatchEvent(
          new CustomEvent("hax-active-hover-name", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: e.target.parentNode.getAttribute("data-hax-ray")
          })
        );
      }
      if (
        !this.shadowRoot
          .querySelector("#platecontextmenu")
          .classList.contains("hax-active-hover")
      ) {
        let local = e.target;
        // see if the target is relevent when showing the edit menu operations
        if (
          e.target === this.shadowRoot.querySelector("#cecontextmenu") ||
          e.target === this.shadowRoot.querySelector("#textcontextmenu") ||
          e.target === this.shadowRoot.querySelector("#platecontextmenu") ||
          local === this.activeNode ||
          local === this.activeContainerNode ||
          e.target === this.activeNode ||
          e.target === this.activeContainerNode ||
          local.parentNode === this.activeContainerNode ||
          local.parentNode.parentNode === this.activeContainerNode ||
          local.parentNode.parentNode.parentNode === this.activeContainerNode
        ) {
          this.positionContextMenus(this.activeNode, this.activeContainerNode);
          this.__addActiveHover();
          this.__typeLock = false;
        } else {
          this.__dropActiveHover();
        }
      }
    }
  }
  __addActiveHover() {
    this.shadowRoot
      .querySelector("#cecontextmenu")
      .classList.add("hax-active-hover");
    this.shadowRoot
      .querySelector("#textcontextmenu")
      .classList.add("hax-active-hover");
    this.shadowRoot
      .querySelector("#platecontextmenu")
      .classList.add("hax-active-hover");
  }
  __dropActiveHover() {
    this.shadowRoot
      .querySelector("#cecontextmenu")
      .classList.remove("hax-active-hover");
    this.shadowRoot
      .querySelector("#textcontextmenu")
      .classList.remove("hax-active-hover");
    this.shadowRoot
      .querySelector("#platecontextmenu")
      .classList.remove("hax-active-hover");
  }
  /**
   * Check if part of the passed element is int he viewport
   */
  elementInViewport(el) {
    let top =
      el.offsetTop -
      32 -
      window.HaxStore.instance.haxPanel.shadowRoot.querySelector("#drawer")
        .offsetHeight;
    let left = el.offsetLeft;
    let width = el.offsetWidth;
    let height = el.offsetHeight;
    while (el.offsetParent) {
      el = el.offsetParent;
      top += el.offsetTop;
      left += el.offsetLeft;
    }
    this.__OffBottom = top < window.pageYOffset + window.innerHeight;
    return (
      top < window.pageYOffset + window.innerHeight &&
      left < window.pageXOffset + window.innerWidth &&
      top + height > window.pageYOffset &&
      left + width > window.pageXOffset
    );
  }
  /**
   * Replace place holder after an event has called for it in the element itself
   */
  replacePlaceholder(e) {
    // generate a paragraph of text here on click
    if (e.detail === "text") {
      // make sure text just escalates to a paragraph tag
      let p = document.createElement("p");
      p.innerHTML = "<br/>";
      this.haxReplaceNode(this.activeNode, p, this.activeNode.parentNode);
      // allow swap out to happen
      setTimeout(() => {
        // set active to this p tag
        this.activeNode = p;
        window.HaxStore.write("activeNode", p, this);
        this.activeContainerNode.setAttribute("contenteditable", true);
        // focus on it
        p.focus();
        this.__focusLogic(p);
      }, 210);
    } else {
      this.replaceElementWorkflow();
    }
  }
  /**
   * Whole workflow of replacing something in place contextually.
   * This can fire for things like events needing this workflow to
   * invoke whether it's a "convert" event or a "replace placeholder" event
   */
  replaceElementWorkflow() {
    let element = window.HaxStore.nodeToHaxElement(this.activeNode, null);
    let type = "*";
    let skipPropMatch = false;
    // special support for place holder which defines exactly
    // what the user wants this replaced with
    if (
      element.tag === "place-holder" &&
      typeof element.properties["type"] !== typeof undefined
    ) {
      type = element.properties["type"];
      skipPropMatch = true;
    }
    var props = {};
    // see if we have a gizmo as it's not a requirement to registration
    // as well as having handlers since mapping is not required either
    if (
      typeof window.HaxStore.instance.elementList[element.tag] !==
        typeof undefined &&
      window.HaxStore.instance.elementList[element.tag].gizmo !== false &&
      typeof window.HaxStore.instance.elementList[element.tag].gizmo.handles !==
        typeof undefined &&
      window.HaxStore.instance.elementList[element.tag].gizmo.handles.length > 0
    ) {
      // get the haxProperties for this item
      let gizmo = window.HaxStore.instance.elementList[element.tag].gizmo;
      // walk through each handler
      for (var i = 0; i < gizmo.handles.length; i++) {
        // walk the properties defined as they would be to the
        // left side of the ledger and tell us which property to
        // mesh with. This effectively rehydrates / inverts that
        // relationship where we have an element and want to say
        // "oh ya, but what could have handled this" so that we
        // can use that translation to offer up convertion to a
        // new element. This is insane.
        for (var prop in gizmo.handles[i]) {
          // type is a reserved handler but any other property
          // which we actually have in our element let's go for it
          if (
            prop !== "type" &&
            typeof element.properties[gizmo.handles[i][prop]] !==
              typeof undefined
          ) {
            // The cake is a lie... oh wait... no it's not.
            // This will completely bend your mind when it comes to
            // what HTML is, how it should operate and what universe
            // we can now contort as a result. This effectively allows
            // reverse engineering any element on the page into any
            // other compatible element based on the properties in
            // each element claiming to be compatible.
            props[prop] = element.properties[gizmo.handles[i][prop]];
          }
        }
      }
    }
    let haxElements = window.HaxStore.guessGizmo(type, props, skipPropMatch);
    // see if we got anything
    if (haxElements.length > 0) {
      // hand off to hax-app-picker to deal with the rest of this
      let tag = this.activeNode.tagName.toLowerCase();
      let humanName = tag.replace("-", " ");
      if (
        typeof window.HaxStore.instance.elementList[tag] !== typeof undefined &&
        window.HaxStore.instance.elementList[tag].gizmo !== false
      ) {
        humanName = window.HaxStore.instance.elementList[tag].gizmo.title;
      }
      window.HaxStore.instance.haxAppPicker.presentOptions(
        haxElements,
        "__convert",
        `Transform ${humanName} to..`,
        "gizmo"
      );
    } else {
      window.HaxStore.toast("Sorry, this can not be transformed!", 5000);
    }
  }
  /**
   * Global prefs updated, let's visualize stuff from hax-ray
   */
  _globalPreferencesUpdated(newValue, oldValue) {
    if (typeof newValue !== typeof undefined && newValue != null) {
      this.haxRayMode = newValue.haxRayMode;
    }
  }
  /**
   * Store updated, sync.
   */
  _haxStorePropertyUpdated(e) {
    if (
      e.detail &&
      typeof e.detail.value !== typeof undefined &&
      e.detail.property
    ) {
      this[e.detail.property] = e.detail.value;
    }
  }
  /**
   * Clear area.
   */
  haxClearBody(confirm = true) {
    let status = true;
    // only confirm if asked so we can support wipes without it
    if (confirm) {
      status = prompt("Are you sure you want to delete all content?");
    }
    // ensure they said yes
    if (status) {
      wipeSlot(this);
    }
  }
  /**
   * Insert new tag + content into the local DOM as a node.
   */
  haxInsert(tag, content, properties = {}, waitForLock = true) {
    this.__activeHover = null;
    // verify this tag is a valid one
    // create a new element fragment w/ content in it
    // if this is a custom-element it won't expand though
    var frag = document.createElement(tag);
    // set text forcibly
    //frag.innerText = content;
    // now set html forcibly which would overwrite the other one
    frag.innerHTML = content;
    // clone the fragment which will force an escalation to full node
    var newNode = frag.cloneNode(true);
    // support for properties if they exist
    for (var property in properties) {
      let attributeName = window.HaxStore.camelToDash(property);
      if (properties.hasOwnProperty(property)) {
        // special supporting for boolean because html is weird :p
        if (properties[property] === true) {
          newNode.setAttribute(attributeName, attributeName);
        } else if (properties[property] === false) {
          newNode.removeAttribute(attributeName);
        } else if (
          properties[property] != null &&
          properties[property].constructor === Array
        ) {
          if (newNode.properties && newNode.properties[property].readOnly) {
          } else {
            if (newNode.set) {
              newNode.set(attributeName, properties[property]);
            } else {
              newNode[attributeName] = properties[property];
            }
          }
        } else if (
          properties[property] != null &&
          properties[property].constructor === Object
        ) {
          if (newNode.properties && newNode.properties[property].readOnly) {
          } else {
            if (newNode.set) {
              newNode.set(attributeName, properties[property]);
            } else {
              newNode[attributeName] = properties[property];
            }
          }
        } else {
          newNode.setAttribute(attributeName, properties[property]);
        }
      }
    }
    // special support for a drag and drop into a place-holder tag
    // as this is a more aggressive operation then the others
    if (
      window.HaxStore.instance.activePlaceHolder !== null &&
      typeof window.HaxStore.instance.activePlaceHolder.style !==
        typeof undefined
    ) {
      // replicate styles so that it doesn't jar the UI
      newNode.style.width =
        window.HaxStore.instance.activePlaceHolder.style.width;
      newNode.style.float =
        window.HaxStore.instance.activePlaceHolder.style.float;
      newNode.style.margin =
        window.HaxStore.instance.activePlaceHolder.style.margin;
      newNode.style.display =
        window.HaxStore.instance.activePlaceHolder.style.display;
      this.haxReplaceNode(
        window.HaxStore.instance.activePlaceHolder,
        newNode,
        window.HaxStore.instance.activePlaceHolder.parentNode
      );
      window.HaxStore.instance.activePlaceHolder = null;
    }
    // insert at active insert point if we have one
    else if (this.activeContainerNode != null) {
      // allow for inserting things into things but not grid plate
      if (
        newNode.tagName !== "GRID-PLATE" &&
        this.activeContainerNode.tagName === "GRID-PLATE" &&
        this.activeContainerNode !== this.activeNode
      ) {
        if (this.activeNode.getAttribute("slot") != null) {
          newNode.setAttribute("slot", this.activeNode.getAttribute("slot"));
        }
        this.activeContainerNode.insertBefore(newNode, this.activeNode);
      } else {
        this.insertBefore(newNode, this.activeContainerNode.nextElementSibling);
      }
    } else {
      // send this into the root, which should filter it back down into the slot
      this.appendChild(newNode);
    }
    this.shadowRoot.querySelector("#textcontextmenu").highlightOps = false;
    this.__updateLockFocus = newNode;
    // wait so that the DOM can have the node to then attach to
    if (waitForLock) {
      setTimeout(() => {
        this.breakUpdateLock();
      }, 50);
    }
    return true;
  }

  breakUpdateLock() {
    window.HaxStore.write("activeContainerNode", this.__updateLockFocus, this);
    window.HaxStore.write("activeNode", this.__updateLockFocus, this);
    // attempt to focus on the new node, may not always work
    this.__updateLockFocus.focus();
    // scroll to it
    if (typeof this.__updateLockFocus.scrollIntoViewIfNeeded === "function") {
      this.__updateLockFocus.scrollIntoViewIfNeeded(true);
    } else {
      this.__updateLockFocus.scrollIntoView({
        behavior: "smooth",
        inline: "center"
      });
    }
  }
  /**
   * Return the current hax content area as text that could be
   * inserted into something.
   */
  haxToContent() {
    this.hideContextMenus();
    var __active = this.activeNode;
    // null this to drop hax based classes
    this.activeNode = null;
    this.activeContainerNode = null;
    window.HaxStore.write("activeNode", null, this);
    window.HaxStore.write("activeContainerNode", null, this);
    let children =
      this.shadowRoot.querySelector("#body").localName === "slot"
        ? this.shadowRoot.querySelector("#body").assignedNodes({
            flatten: true
          })
        : [];
    if (this.globalPreferences.haxDeveloperMode) {
      console.warn(children);
    }
    var content = "";
    for (var i = 0, len = children.length; i < len; i++) {
      // some mild front-end sanitization
      if (this._validElementTest(children[i])) {
        children[i].removeAttribute("data-editable");
        children[i].removeAttribute("data-hax-ray");
        children[i].contentEditable = false;
        content += window.HaxStore.nodeToContent(children[i]);
        if (children[i].tagName.toLowerCase() === "grid-plate") {
          this._applyContentEditable(this.editMode, children[i]);
        }
      }
      // keep comments with a special case since they need wrapped
      else if (children[i].nodeType === 8) {
        content += "<!-- " + children[i].textContent + " -->";
      }
      // keep everything NOT an element at this point, this helps
      // preserve whitespace because we're crazy about accuracy
      else if (
        children[i].nodeType !== 1 &&
        typeof children[i].textContent !== typeof undefined &&
        children[i].textContent !== "undefined"
      ) {
        content += children[i].textContent;
      }
    }
    // remove the contenteditable attribute
    content = content.replace(/\scontenteditable=\"false\"/g, "");
    // remove the data-editable attribute
    content = content.replace(/\sdata-editable=\"true\"/g, "");
    content = content.replace(/\sdata-editable=\"false\"/g, "");
    content = content.replace(/\sdata-editable=\""/g, "");
    // remove other attributes that can linger in slots
    content = content.replace(/\sdata-editable/g, "");
    content = content.replace(/\scontenteditable/g, "");
    content = content.replace(/\sdraggable/g, "");
    content = content.replace(/\sdata-draggable/g, "");
    // clean up stray hax-ray leftovers
    content = content.replace(/\sdata-hax-ray=\".*?\"/g, "");
    // remove HAX specific classes / scoping classes
    if (this.parentNode.tagName) {
      let parentTag = this.parentNode.tagName.toLowerCase();
      let string = "style-scope " + parentTag + " x-scope";
      let re = new RegExp(string, "g");
      content = content.replace(re, "");
      // remove without the deeeper scope as well for primitives
      string = "style-scope " + parentTag;
      re = new RegExp(string, "g");
      content = content.replace(re, "");
      // remove the last common one unpacked
      string = "x-scope " + parentTag + "-0";
      re = new RegExp(string, "g");
      content = content.replace(re, "");
      // now all tags we have defined as valid
      let tags = window.HaxStore.instance.validTagList;
      tags.push("hax-preview");
      for (var i in tags) {
        string = "style-scope " + tags[i];
        re = new RegExp(string, "g");
        content = content.replace(re, "");
        string = "x-scope " + tags[i] + "-0 ";
        re = new RegExp(string, "g");
        content = content.replace(re, "");
        string = "x-scope " + tags[i] + "-0";
        re = new RegExp(string, "g");
        content = content.replace(re, "");
      }
    }
    // remove empty class structures
    content = content.replace(/\sclass=\"\"/g, "");
    content = content.replace(/\sclass=\"\s\"/g, "");
    // re-apply contenteditable if needed
    this._applyContentEditable(this.editMode);
    // set active again
    window.HaxStore.write("activeNode", __active, this);
    window.HaxStore.write("activeContainerNode", __active, this);
    // oh one last thing. escape all script/style tags
    content = encapScript(content);
    if (this.globalPreferences.haxDeveloperMode) {
      console.warn(content);
    }
    return content;
  }
  /**
   * Duplicate node into the local DOM below the current item if we can.
   */
  haxDuplicateNode(node, parent = this) {
    // move the context menu before duplicating!!!!
    this.hideContextMenus();
    // convert the node to a hax element
    let haxElement = window.HaxStore.nodeToHaxElement(node, null);
    // support for deep API call to clean up special elements
    if (typeof node.preProcessHaxInsertContent !== typeof undefined) {
      haxElement = node.preProcessHaxInsertContent(haxElement);
    }
    if (haxElement.content == haxElement.properties.innerHTML) {
      delete haxElement.properties.innerHTML;
    }
    // convert it back to a clone, seems odd I'm sure but this ensures that all props are copied
    // correctly and that we get a brand new object
    var nodeClone = window.HaxStore.haxElementToNode(
      haxElement.tag,
      haxElement.content,
      haxElement.properties
    );
    if (
      nodeClone.tagName.toLowerCase() === "webview" &&
      window.HaxStore.instance._isSandboxed &&
      typeof nodeClone.guestinstance !== typeof undefined
    ) {
      delete nodeClone.guestinstance;
    }
    // shouldn't be possible but might as well check
    if (node !== null) {
      parent.insertBefore(nodeClone, node.nextSibling);
    } else {
      parent.appendChild(nodeClone);
    }
    setTimeout(() => {
      // test for a grid plate clone
      if (parent === this) {
        window.HaxStore.write("activeContainerNode", nodeClone, this);
      }
      window.HaxStore.write("activeNode", nodeClone, this);
    }, 100);
    return true;
  }
  /**
   * Hide all context menus.
   */
  hideContextMenus() {
    // primary context menus
    this._hideContextMenu(this.shadowRoot.querySelector("#textcontextmenu"));
    this._hideContextMenu(this.shadowRoot.querySelector("#cecontextmenu"));
    // secondary menus and clean up areas
    this._hideContextMenu(this.shadowRoot.querySelector("#platecontextmenu"));
    this._hideContextMenu(this.shadowRoot.querySelector("#haxinputmixer"));
    // force context menu state to closed
    this.shadowRoot.querySelector("#textcontextmenu").highlightOps = false;
  }
  /**
   * Reposition context menus to match an element.
   */
  positionContextMenus(node, container) {
    if (node) {
      let tag = node.tagName.toLowerCase();
      if (window.HaxStore.instance._isSandboxed && tag === "webview") {
        tag = "iframe";
      }
      let props = window.HaxStore.instance.elementList[tag];
      // try and work against anything NOT a P tag
      if (
        typeof props !== typeof undefined &&
        !window.HaxStore.instance.isTextElement(node)
      ) {
        this._hideContextMenu(
          this.shadowRoot.querySelector("#textcontextmenu")
        );
        props.element = node;
        this.shadowRoot.querySelector("#cecontextmenu").setHaxProperties(props);
        this._positionContextMenu(
          this.shadowRoot.querySelector("#cecontextmenu"),
          node,
          -39,
          -39
        );
      } else {
        this._hideContextMenu(this.shadowRoot.querySelector("#cecontextmenu"));
        this._positionContextMenu(
          this.shadowRoot.querySelector("#textcontextmenu"),
          node,
          -39,
          -39
        );
      }
      this._positionContextMenu(
        this.shadowRoot.querySelector("#platecontextmenu"),
        container,
        -69,
        0
      );
      // special case for node not matching container
      if (container && !this._HTMLPrimativeTest(node) && node !== container) {
        container.contentEditable = false;
      } else if (container) {
        container.contentEditable = true;
      }
    }
  }
  /**
   * Move grid plate around
   */
  haxMoveGridPlate(direction, node, container) {
    // menu is actually in the element for render purposes
    // support moving things multiple directions
    this.___moveLock = true;
    switch (direction) {
      case "first":
        // ensure we can go up, first being a mode of up
        if (container.previousElementSibling !== null) {
          this.insertBefore(container, this.firstChild);
        }
        break;
      case "up":
        // ensure we can go up
        if (container.previousElementSibling !== null) {
          this.insertBefore(container, container.previousElementSibling);
        }
        break;
      case "down":
        if (container.nextElementSibling !== null) {
          this.insertBefore(container.nextElementSibling, container);
        }
        break;
      case "last":
        if (container.nextElementSibling !== null) {
          this.appendChild(container);
        }
        break;
      // @todo support other directions for when inside of an element
    }
    setTimeout(() => {
      this.positionContextMenus(node, container);
      if (typeof container.scrollIntoViewIfNeeded === "function") {
        container.scrollIntoViewIfNeeded(true);
      } else {
        container.scrollIntoView({ behavior: "smooth", inline: "center" });
      }
    }, 5);
    return true;
  }
  /**
   * Inject a grid plate where something currently lives
   */
  haxInjectGridplate(node, side) {
    // allow splitting the grid plate that is already there
    let changed = false;
    if (node.tagName === "GRID-PLATE") {
      switch (node.layout) {
        case "1":
          node.layout = "1-1";
          changed = true;
          break;
        case "1-1":
          node.layout = "1-1-1";
          changed = true;
          break;
        case "1-1-1":
          node.layout = "1-1-1-1";
          changed = true;
          break;
      }
      // if left, nudge everything over 1, right simple
      if (changed && side == "left") {
        node.childNodes.forEach(el => {
          if (el.tagName) {
            let s =
              parseInt(el.getAttribute("slot").replace("col-", ""), 10) + 1;
            el.setAttribute("slot", `col-${s}`);
          }
        });
      }
    } else {
      let grid = document.createElement("grid-plate");
      grid.layout = "1-1";
      this.insertBefore(grid, node);
      let col = "1";
      if (side == "right") {
        col = "2";
      }
      setTimeout(() => {
        grid.appendChild(node);
        node.setAttribute("slot", "col-" + col);
      }, 0);
    }
  }
  /**
   * Convert an element from one tag to another.
   */
  haxReplaceNode(node, replacement, parent = this) {
    // ensure we're not in the document tree for the replaced node
    this.hideContextMenus();
    // Switch, try loop in case we screwed up elsewhere
    try {
      // test for slots to match
      if (node && node.getAttribute && node.getAttribute("slot") != null) {
        replacement.setAttribute("slot", node.getAttribute("slot"));
      }
      if (node == null) {
        node = this.__oldActiveNode;
        parent = this.__oldActiveNode.parentNode;
      }
      parent.replaceChild(replacement, node);
    } catch (e) {
      console.warn(e);
    }
    return replacement;
  }
  /**
   * Convert an element from one tag to another.
   */
  haxChangeTagName(node, tagName) {
    // ensure we're not in the document tree for the replaced node
    this.hideContextMenus();
    // Create a replacement tag of the desired type
    var replacement = document.createElement(tagName);
    // Grab all of the original's attributes, and pass them to the replacement
    for (var i = 0, l = node.attributes.length; i < l; ++i) {
      var nodeName = node.attributes.item(i).nodeName;
      var value = node.attributes.item(i).value;
      replacement.setAttribute(nodeName, value);
    }
    // Persist contents
    // account for empty list and ordered list items
    replacement.innerHTML = node.innerHTML.trim();
    if (tagName == "ul" || tagName == "ol") {
      if (replacement.innerHTML == "") {
        replacement.innerHTML = "<li></li>";
      } else if (
        !(
          node.tagName.toLowerCase() == "ul" ||
          node.tagName.toLowerCase() == "ol"
        )
      ) {
        replacement.innerHTML =
          "<li>" +
          node.innerHTML
            .trim()
            .replace(/<br\/>/g, "</li>\n<li>")
            .replace(/<br>/g, "</li>\n<li>") +
          "</li>";
      }
    } else if (
      node.tagName.toLowerCase() == "ul" ||
      node.tagName.toLowerCase() == "ol"
    ) {
      // if we're coming from ul or ol strip out the li tags
      replacement.innerHTML = replacement.innerHTML
        .replace(/<ul>/g, "")
        .replace(/<\/ul>/g, "")
        .replace(/<li><\/li>/g, "")
        .replace(/<li>/g, "")
        .replace(/<\/li>/g, "<br/>");
    }
    // Switch!
    try {
      node.parentNode.replaceChild(replacement, node);
      // focus on the thing switched to
      setTimeout(() => {
        let children = replacement.children;
        // see if there's a child element and focus that instead if there is
        if (children[0] && children.tagName) {
          children[0].focus();
        } else {
          replacement.focus();
        }
      }, 50);
    } catch (e) {
      console.warn(e);
      console.warn(replacement);
      console.warn(node);
    }
    return replacement;
  }
  /**
   * Delete the node passed in
   */
  haxDeleteNode(node, parent = this) {
    // move the context menu before deleting!!!!
    this.hideContextMenus();
    // shift active to a viable replacement
    if (
      this.activeContainerNode != null &&
      this.activeContainerNode.previousElementSibling !== null
    ) {
      this.activeContainerNode.previousElementSibling.focus();
      // cursor at the END of the element assuming not empty
      if (
        this.activeContainerNode != null &&
        window.HaxStore.instance.isTextElement(this.activeContainerNode) &&
        this.activeContainerNode.textContent !== ""
      ) {
        try {
          var range = document.createRange();
          var sel = window.HaxStore.getSelection();
          range.setStart(this.activeContainerNode, 1);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
          this.activeContainerNode.focus();
        } catch (e) {
          console.warn(e);
        }
      }
    } else if (
      this.activeContainerNode != null &&
      this.activeContainerNode.nextElementSibling !== null
    ) {
      this.activeContainerNode.nextElementSibling.focus();
    } else {
      this.activeNode = null;
      this.activeContainerNode = null;
      window.HaxStore.write("activeNode", null, this);
      window.HaxStore.write("activeContainerNode", null, this);
    }
    // @todo figure out why this is complaining
    try {
      return parent.removeChild(node);
    } catch (e) {
      console.warn(e);
    }
  }
  /**
   * Bulk import HTML with option to clear what is currently
   * in the slot of this tag. This also validates tags
   * that are being inserted for security based on the
   * internal whitelist.
   */
  importContent(html, clear = true) {
    // kill the slot of the active body, all of it
    if (clear) {
      wipeSlot(this, "*");
    }
    // pause quickly to ensure wipe goes through successfully
    setTimeout(() => {
      html = encapScript(html);
      let fragment = document.createElement("div");
      fragment.insertAdjacentHTML("beforeend", html);
      while (fragment.firstChild !== null) {
        if (typeof fragment.firstChild.tagName !== typeof undefined) {
          // ensure import doesn't import non-sandbox safe things!
          if (
            window.HaxStore.instance._isSandboxed &&
            fragment.firstChild.tagName.toLowerCase() === "iframe"
          ) {
            // Create a replacement tag of the desired type
            var replacement = document.createElement("webview");
            // Grab all of the original's attributes, and pass them to the replacement
            for (
              var j = 0, l = fragment.firstChild.attributes.length;
              j < l;
              ++j
            ) {
              var nodeName = fragment.firstChild.attributes.item(j).nodeName;
              var value = fragment.firstChild.attributes.item(j).value;
              if (nodeName === "height" || nodeName === "width") {
                replacement.style[nodeName] == value;
              }
              replacement.setAttribute(nodeName, value);
            }
            this.appendChild(replacement);
          } else {
            this.appendChild(fragment.firstChild);
          }
        } else {
          // @todo might want to support appending or keeping track of comments / non tags
          // but this is not a must have
          fragment.removeChild(fragment.firstChild);
        }
      }
    }, 50);
  }
  /**
   * Respond to hax operations.
   */
  _haxContextOperation(e) {
    let detail = e.detail;
    var haxElement;
    // support a simple insert event to bubble up or everything else
    switch (detail.eventName) {
      // text based operations for primatives
      case "p":
      case "ol":
      case "ul":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
      case "blockquote":
      case "code":
        // trigger the default selected value in context menu to match
        this.shadowRoot.querySelector("#textcontextmenu").realSelectedValue =
          detail.eventName;
        this.activeNode = this.haxChangeTagName(
          this.activeNode,
          detail.eventName
        );
        window.HaxStore.write("activeNode", this.activeNode, this);
        this.positionContextMenus(this.activeNode, this.activeContainerNode);
        break;
      case "text-align-left":
        this.activeNode.style.textAlign = null;
        break;
      // grid plate based operations
      // allow for transforming this haxElement into another one
      case "grid-plate-convert":
        this.replaceElementWorkflow();
        break;
      // grid plate based operations
      // allow for transforming this haxElement into another one
      case "grid-plate-create-left":
        this.haxInjectGridplate(this.activeNode, "left");
        break;
      case "grid-plate-create-right":
        this.haxInjectGridplate(this.activeNode, "right");
        break;
      // duplicate the active item or container
      case "grid-plate-duplicate":
        if (this.activeNode === this.activeContainerNode) {
          this.haxDuplicateNode(this.activeNode);
        } else {
          this.haxDuplicateNode(this.activeNode, this.activeContainerNode);
        }
        break;
      case "grid-plate-delete":
        if (this.activeNode != null) {
          let options = [
            {
              icon: "thumb-up",
              color: "green",
              title: "Yes"
            },
            {
              icon: "thumb-down",
              color: "red",
              title: "No"
            }
          ];
          let tag = this.activeNode.tagName.toLowerCase();
          let humanName = tag.replace("-", " ");
          if (
            typeof window.HaxStore.instance.elementList[tag] !==
              typeof undefined &&
            window.HaxStore.instance.elementList[tag].gizmo !== false
          ) {
            humanName = window.HaxStore.instance.elementList[tag].gizmo.title;
          }
          window.HaxStore.instance.haxAppPicker.presentOptions(
            options,
            "",
            `Remove this \`${humanName}\`?`,
            "delete"
          );
        }
        break;
      case "grid-plate-first":
        this.haxMoveGridPlate(
          "first",
          this.activeNode,
          this.activeContainerNode
        );
        break;
      case "grid-plate-up":
        this.haxMoveGridPlate("up", this.activeNode, this.activeContainerNode);
        break;
      case "hax-manager-open":
        window.HaxStore.write("activeHaxElement", {}, this);
        window.HaxStore.instance.haxManager.resetManager(
          parseInt(detail.value)
        );
        window.HaxStore.write(
          "openDrawer",
          window.HaxStore.instance.haxManager,
          this
        );
        break;
      case "grid-plate-down":
        this.haxMoveGridPlate(
          "down",
          this.activeNode,
          this.activeContainerNode
        );
        break;
      case "grid-plate-last":
        this.haxMoveGridPlate(
          "last",
          this.activeNode,
          this.activeContainerNode
        );
        break;
      case "close-menu":
        this.activeNode = null;
        this.activeContainerNode = null;
        window.HaxStore.write("activeNode", null, this);
        window.HaxStore.write("activeContainerNode", null, this);
        break;
      case "hax-edit-property":
        let haxInputMixer = this.shadowRoot.querySelector("#haxinputmixer");
        haxInputMixer.label = detail.target.label;
        haxInputMixer.options = detail.target.options;
        haxInputMixer.icon = detail.target.icon;
        haxInputMixer.description = detail.target.description;
        haxInputMixer.required = detail.target.required;
        haxInputMixer.validation = detail.target.validation;
        haxInputMixer.validationType = detail.target.validationType;
        haxInputMixer.inputMethod = detail.target.inputMethod;
        haxInputMixer.value = "";
        // see if response should bind to the slot or property
        if (
          typeof detail.target.propertyToBind !== typeof undefined &&
          detail.target.propertyToBind != null &&
          detail.target.propertyToBind != false
        ) {
          haxInputMixer.propertyToBind = detail.target.propertyToBind;
          if (
            typeof this.activeNode[detail.target.propertyToBind] !==
            typeof undefined
          ) {
            haxInputMixer.value = this.activeNode[detail.target.propertyToBind];
          }
          // try to get an attribute bind
          else {
            haxInputMixer.value = this.activeNode.getAttribute(
              detail.target.propertyToBind
            );
          }
          // @todo need to be able to support slot binding
        }
        // make input mixer show up
        this._positionContextMenu(
          haxInputMixer,
          this.activeContainerNode,
          -1,
          -38
        );
        let style =
          this.shadowRoot.querySelector("#cecontextmenu").currentStyle ||
          window.getComputedStyle(
            this.shadowRoot.querySelector("#cecontextmenu")
          );
        // force input mixes to match width of the ce context menu currently
        haxInputMixer.style.width = style.width.replace("px", "") - 40 + "px";
        break;
      // directional / proportion operations
      case "hax-align-left":
        this.activeNode.style.float = null;
        this.activeNode.style.margin = null;
        this.activeNode.style.display = null;
        break;
      case "hax-align-center":
        this.activeNode.style.float = null;
        this.activeNode.style.margin = "0 auto";
        this.activeNode.style.display = "block";
        break;
      case "hax-size-change":
        if (this.activeNode) {
          this.activeNode.style.width = detail.value + "%";
        }
        break;
      // settings button selected from hax-ce-context bar
      // which means we should skip to the settings page after
      // we set the thing selected as the active element to work
      // on in the manager
      case "hax-manager-configure":
        // make sure input mixer is closed
        this._hideContextMenu(this.shadowRoot.querySelector("#haxinputmixer"));
        // reset the manager
        window.HaxStore.instance.haxManager.resetManager();
        // write activeElement updated so it'll go into the preview
        haxElement = window.HaxStore.nodeToHaxElement(this.activeNode);
        window.HaxStore.write("activeHaxElement", haxElement, this);
        // clean up the manager before opening
        window.HaxStore.instance.haxManager.editExistingNode = true;
        window.HaxStore.instance.haxManager.selectStep("configure");
        window.HaxStore.write(
          "openDrawer",
          window.HaxStore.instance.haxManager,
          this
        );
        // accessibility enhancement to keyboard focus configure button
        setTimeout(() => {
          window.HaxStore.instance.haxManager.shadowRoot
            .querySelector("#preview")
            .shadowRoot.querySelector("#configurebutton")
            .focus();
        }, 100);
        break;
      // container / layout settings button has been activated
      case "hax-manager-configure-container":
        window.HaxStore.write(
          "activeNode",
          window.HaxStore.instance.activeContainerNode,
          this
        );
        // make sure input mixer is closed
        this._hideContextMenu(this.shadowRoot.querySelector("#haxinputmixer"));
        // reset the manager
        window.HaxStore.instance.haxManager.resetManager();
        // write activeElement updated so it'll go into the preview
        haxElement = window.HaxStore.nodeToHaxElement(
          window.HaxStore.instance.activeNode
        );
        window.HaxStore.write("activeHaxElement", haxElement, this);
        // clean up the manager before opening
        window.HaxStore.instance.haxManager.editExistingNode = true;
        window.HaxStore.instance.haxManager.selectStep("configure");
        window.HaxStore.write(
          "openDrawer",
          window.HaxStore.instance.haxManager,
          this
        );
        // accessibility enhancement to keyboard focus configure button
        setTimeout(() => {
          window.HaxStore.instance.haxManager.shadowRoot
            .querySelector("#preview")
            .shadowRoot.querySelector("#configurebutton")
            .focus();
        }, 100);
        break;
    }
  }
  /**
   * Respond to an input mixer call.
   */
  _haxInputMixerOperation(e) {
    // this is a big deal how simple this part is in the end
    let mixer = e.detail.inputMixer;
    // if we have a property to bind, set that value from the
    // widget that was dictated by the element itself
    if (mixer.propertyToBind != null) {
      this.activeNode[mixer.propertyToBind] = mixer.value;
    }
    // if we're told instead to do a slot bind, make a span tag
    // with height same as parent and then mix in the innerHTML
    else if (mixer.slotToBind != null) {
      item = document.createElement("span");
      item.style.height = "inherit";
      item.innerHTML = mixer.value;
      //item.attribute.slot = mixer.slotToBind;
      item.slot = mixer.slotToBind;
      this.activeNode.appendChild(item);
    }
    // hide mixer
    this._hideContextMenu(this.shadowRoot.querySelector("#haxinputmixer"));
  }
  /**
   * Item has gained focus, change active element to match
   */
  _focusIn(e) {
    if (this.__focusLogic(e.target)) {
      e.stopPropagation();
    }
  }
  /**
   * Focus a target and update the data model to reflect this.
   * This helps ensure that keyboard and non click based focusing
   * registers the same as click events
   */
  __focusLogic(target) {
    let stopProp = false;
    // only worry about these when we are in edit mode
    // and there is no drawer open
    if (!this.openDrawer && this.editMode && !this.__tabTrap) {
      let containerNode = target;
      // edge case, thing selected is inside a paragraph tag
      // HTML is stupid and allows this
      if (
        containerNode.tagName === "SPAN" &&
        window.HaxStore.instance.isTextElement(target.parentNode)
      ) {
        containerNode = target.parentNode;
      }
      let activeNode = null;
      // ensure this is valid
      if (
        this._validElementTest(containerNode) &&
        containerNode.parentNode != null
      ) {
        // keep looking til we are juuuust below the container
        // @todo this is where we force a selection on highest level
        // of the document
        while (containerNode.parentNode.tagName != "HAX-BODY") {
          // make sure active is set after closest legit element
          if (
            activeNode === null &&
            containerNode.tagName !== "LI" &&
            containerNode.tagName !== "B" &&
            containerNode.tagName !== "I" &&
            containerNode.tagName !== "STRONG" &&
            containerNode.tagName !== "EM"
          ) {
            activeNode = containerNode;
          }
          containerNode = containerNode.parentNode;
        }
        // case with simple element
        if (activeNode === null) {
          activeNode = containerNode;
        }
        // we only allow disconnected node from container when
        // the container is a grid plate
        else if (!window.HaxStore.instance.isGridPlateElement(containerNode)) {
          activeNode = containerNode;
        }
        // won't deal with lists inside of p tags
        else if (
          ["UL", "OL", "LI", "P", "GRID-PLATE"].includes(
            containerNode.tagName
          ) &&
          ["UL", "OL", "LI"].includes(activeNode.tagName)
        ) {
          activeNode = containerNode;
        }
        // ensure this is a tag we care about / have support for and
        // that it is a new value
        if (
          this.activeContainerNode !== containerNode &&
          !containerNode.classList.contains("ignore-activation")
        ) {
          this.hideContextMenus();
          this.activeContainerNode = containerNode;
          window.HaxStore.write("activeContainerNode", containerNode, this);
          stopProp = true;
        } else if (containerNode.classList.contains("ignore-activation")) {
          stopProp = true;
        }
        // test for active node changing
        if (
          this.activeNode !== activeNode &&
          !activeNode.classList.contains("ignore-activation")
        ) {
          this.activeNode = activeNode;
          window.HaxStore.write("activeNode", activeNode, this);
          this.positionContextMenus(activeNode, containerNode);
          stopProp = true;
        }
      }
    } else {
      this.__tabTrap = false;
    }
    return stopProp;
  }
  /**
   * Notice the change between states for editing.
   */
  _editModeChanged(newValue, oldValue) {
    // fire above that we have changed states so things can react if needed
    if (typeof oldValue !== typeof undefined) {
      this._applyContentEditable(newValue);
      this.setAttribute("tabindex", "-1");
      if (newValue) {
        // minor timeout here to see if we have children or not. the slight delay helps w/
        // timing in scenarios where this is inside of other systems which are setting default
        // attributes and what not
        setTimeout(() => {
          if (this.children && this.children[0] && this.children[0].focus) {
            this.activeNode = this.children[0];
            this.activeContainerNode = this.activeNode;
            window.HaxStore.write("activeNode", this.children[0], this);
            window.HaxStore.write(
              "activeContainerNode",
              this.children[0],
              this
            );
            setTimeout(() => {
              if (window.HaxStore.instance.isTextElement(this.activeNode)) {
                try {
                  var range = document.createRange();
                  var sel = window.HaxStore.getSelection();
                  range.setStart(this.activeNode, 0);
                  range.collapse(true);
                  sel.removeAllRanges();
                  sel.addRange(range);
                  this.activeNode.focus();
                } catch (e) {
                  console.warn(e);
                }
              }
            }, 0);
          } else {
            this.haxInsert("p", "", {}, false);
            setTimeout(() => {
              try {
                var range = document.createRange();
                var sel = window.HaxStore.getSelection();
                range.setStart(this.activeNode, 0);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
                this.activeNode.focus();
                this.activeContainerNode = this.activeNode;
                window.HaxStore.write(
                  "activeContainerNode",
                  this.activeContainerNode,
                  this
                );
              } catch (e) {
                console.warn(e);
              }
            }, 0);
          }
        }, 100);
      }
    }
    // hide menus when state changes
    if (newValue === false) {
      this.removeAttribute("contenteditable");
      this.hideContextMenus();
    }
  }
  /**
   * Test if this is a HAX element or not
   */
  _haxResolvePreviousElement(node) {
    node = node.previousElementSibling;
    while (
      node != null &&
      typeof node.tagName !== typeof undefined &&
      node.tagName.substring(0, 4) === "HAX-"
    ) {
      node = node.previousElementSibling;
    }
    return node;
  }
  /**
   * Test if this is a HAX element or not
   * true means its a valid element for selection
   * We have special support for the hax-logo because it's hax.
   */
  _validElementTest(node) {
    if (typeof node.tagName !== typeof undefined) {
      if (
        node.tagName.substring(0, 4) !== "HAX-" ||
        node.tagName === "HAX-LOGO"
      ) {
        return true;
      }
    }
    return false;
  }
  /**
   * Test if this is an HTML primative
   */
  _HTMLPrimativeTest(node) {
    if (
      node != null &&
      typeof node.tagName !== typeof undefined &&
      node.tagName.indexOf("-") == -1
    ) {
      return true;
    }
    return false;
  }
  /**
   * Walk everything we find and either enable or disable editable state.
   */
  _applyContentEditable(
    status,
    target = this.shadowRoot.querySelector("#body")
  ) {
    let children =
      target.localName === "slot"
        ? target.assignedNodes({ flatten: true })
        : [];
    // fallback for content nodes if not polymer managed nodes above
    if (children.length === 0) {
      children = target.children;
    }
    for (var i = 0, len = children.length; i < len; i++) {
      // sanity check for being a valid element / not a "hax" element
      if (this._validElementTest(children[i])) {
        // correctly add or remove listeners
        if (
          !status ||
          (children[i].getAttribute("contenteditable") !== true &&
            children[i].getAttribute("contenteditable") != "true" &&
            children[i].getAttribute("contenteditable") != "contenteditable")
        ) {
          this.__applyNodeEditableState(children[i], status);
        }
      }
    }
  }
  /**
   * Apply the node editable state correctly so we can do drag and drop / editing uniformly
   */
  __applyNodeEditableState(node, status = true) {
    let listenerMethod;
    // create the hax-ray x ray googles thing
    let haxRay = node.tagName.replace("-", " ").toLowerCase();
    let i = window.HaxStore.instance.gizmoList.findIndex(
      j => j.tag === node.tagName.toLowerCase()
    );
    if (i !== -1) {
      haxRay = window.HaxStore.instance.gizmoList[i].title;
    }
    // oooooo snap, drag and drop..
    if (status) {
      node.setAttribute("data-draggable", true);
      node.setAttribute("data-editable", status);
      node.setAttribute("data-hax-ray", haxRay);
      listenerMethod = "addEventListener";
    } else {
      node.removeAttribute("data-draggable");
      node.removeAttribute("data-editable");
      node.removeAttribute("data-hax-ray");
      listenerMethod = "removeEventListener";
    }
    node[listenerMethod]("drop", this.dropEvent.bind(this));
    node[listenerMethod]("dragenter", this.dragEnter.bind(this));
    node[listenerMethod]("dragleave", this.dragLeave.bind(this));
    node[listenerMethod]("dragend", this.dragEnd.bind(this));
    node[listenerMethod]("dragover", function(e) {
      e.preventDefault();
    });
    // additional things for text based elements
    if (this._HTMLPrimativeTest(node)) {
      if (status) {
        node.setAttribute("contenteditable", status);
      } else {
        node.removeAttribute("contenteditable");
      }
      if (node.querySelectorAll("a").length > 0) {
        let links = node.querySelectorAll("a");
        for (var j = 0, len2 = links.length; j < len2; j++) {
          if (status) {
            links[j].setAttribute("contenteditable", status);
            links[j].setAttribute("data-editable", status);
          } else {
            links[j].removeAttribute("contenteditable");
            links[j].removeAttribute("data-editable");
          }
          links[j][listenerMethod]("click", e => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
          });
        }
      }
    }
  }
  /**
   * Drop an item onto another
   */
  dropEvent(e) {
    if (!this.openDrawer && this.editMode) {
      var target = window.HaxStore.instance.__dragTarget;
      var local = e.target;
      // if we have a slot on what we dropped into then we need to mirror that item
      // and place ourselves below it in the DOM
      if (
        (typeof target !== typeof undefined &&
          target !== null &&
          typeof local !== typeof undefined &&
          target !== local &&
          target !== local.parentNode &&
          target.parentNode === this) ||
        local.parentNode === this
      ) {
        // incase this came from a grid plate, drop the slot so it works
        target.removeAttribute("slot");
        try {
          this.insertBefore(target, local);
        } catch (e) {
          console.warn(e);
        }
        // ensure that if we caught this event we process it
        e.preventDefault();
        e.stopPropagation();
      }
      let children = this.children;
      // walk the children and apply the draggable state needed
      for (var i in children) {
        if (typeof children[i].classList !== typeof undefined) {
          children[i].classList.remove("mover", "hovered");
        }
      }
      // position arrows / set focus in case the DOM got updated above
      if (target && typeof target.focus === "function") {
        setTimeout(() => {
          this.positionContextMenus(this.activeNode, this.activeContainerNode);
        }, 0);
      }
    }
  }
  /**
   * Enter an element, meaning we've over it while dragging
   */
  dragEnter(e) {
    if (!this.openDrawer && this.editMode) {
      e.preventDefault();
      e.target.classList.add("hovered");
    }
  }
  /**
   * Leaving an element while dragging.
   */
  dragLeave(e) {
    if (!this.openDrawer && this.editMode) {
      e.target.classList.remove("hovered");
    }
  }
  /**
   * Start a drag event, this is an element being dragged
   */
  dragStart(e) {
    if (!this.openDrawer && this.editMode) {
      let children = this.children;
      // walk the children and apply the draggable state needed
      for (var i in children) {
        if (typeof children[i].classList !== typeof undefined) {
          children[i].classList.add("mover");
        }
      }
    }
  }

  /**
   * When we end dragging ensure we remove the mover class.
   */
  dragEnd(e) {
    if (!this.openDrawer && this.editMode) {
      let children = this.children;
      // walk the children and apply the draggable state needed
      for (var i in children) {
        if (typeof children[i].classList !== typeof undefined) {
          children[i].classList.remove("mover", "hovered");
        }
      }
    }
  }
  /**
   * Container has changed
   */
  _activeContainerNodeChanged(newValue, oldValue) {
    if (
      this.editMode &&
      typeof newValue !== typeof undefined &&
      newValue != null &&
      newValue.tagName != null
    ) {
      if (
        window.HaxStore.instance.isTextElement(newValue) ||
        window.HaxStore.instance.isGridPlateElement(newValue)
      ) {
        newValue.setAttribute("contenteditable", true);
        this.setAttribute("contenteditable", true);
      } else {
        newValue.removeAttribute("contenteditable");
        this.removeAttribute("contenteditable");
      }
      // @todo this is a bit of a state hack between grid plate and hax
      // this forces the active item to be dropped so that we can
      // correctly regain focus with the keyboard
      if (oldValue && oldValue.tagName == "GRID-PLATE") {
        oldValue.activeItem = null;
      }
      let tag = newValue.tagName.toLowerCase();
      // special case for the grid plate since it brings in nodes
      // nested in it and needs to be put into an editMode
      if (tag === "grid-plate") {
        newValue.editMode = this.editMode;
        this._applyContentEditable(this.editMode, newValue);
      }
    }
  }
  /**
   * React to a new node being set to active.
   */
  _activeNodeChanged(newValue, oldValue) {
    // remove anything currently with the active class
    this.querySelectorAll(".hax-active").forEach(el => {
      el.classList.remove("hax-active");
    });
    // clean up the older one
    if (
      this.editMode &&
      typeof newValue !== typeof undefined &&
      newValue !== null
    ) {
      let tag = newValue.tagName.toLowerCase();
      // remove the menu, establish the new active, then reapply
      // this is nessecary because the context menu gets appended into
      // the document
      // only hide if we change containers
      newValue.classList.add("hax-active");
      if (
        window.HaxStore.instance.isTextElement(newValue) ||
        window.HaxStore.instance.isGridPlateElement(newValue)
      ) {
        newValue.setAttribute("contenteditable", true);
        this.setAttribute("contenteditable", true);
        // position the operations / in context element
        // this seems odd but its in case a ton of elements are inserted
        // all at once to keep from things jumping around
        clearTimeout(this.__positionContextTimer);
        this.__positionContextTimer = setTimeout(() => {
          if (newValue === this.activeNode) {
            this.positionContextMenus(newValue, newValue);
          }
        }, 10);
      } else {
        newValue.removeAttribute("contenteditable");
        this.removeAttribute("contenteditable");
      }
      this.shadowRoot.querySelector("#textcontextmenu").realSelectedValue = tag;
      if (newValue.style.textAlign == "left") {
        this.shadowRoot.querySelector("#textcontextmenu").justifyIcon =
          "editor:format-align-left";
        this.shadowRoot.querySelector("#textcontextmenu").justifyValue =
          "text-align-left";
      } else if (newValue.style.float == "left") {
        this.shadowRoot.querySelector("#cecontextmenu").justifyIcon =
          "editor:format-align-left";
        this.shadowRoot.querySelector("#cecontextmenu").justifyValue =
          "hax-align-left";
      } else if (newValue.style.margin == "0 auto") {
        this.shadowRoot.querySelector("#cecontextmenu").justifyIcon =
          "editor:format-align-center";
        this.shadowRoot.querySelector("#cecontextmenu").justifyValue =
          "hax-align-center";
      }
    }
    // just hide menus if we don't have an active item
    else if (newValue === null) {
      this.hideContextMenus();
      this.__oldActiveNode = oldValue;
      this.shadowRoot.querySelector("#textcontextmenu").justifyIcon =
        "editor:format-align-left";
      this.shadowRoot.querySelector("#textcontextmenu").justifyValue =
        "text-align-left";
    }
  }
  /**
   * Get position from top and left of the page based on position:relative; being
   * set in a parent.
   *
   * @notice This only works correctly across browsers because hax-body
   * is position:relative in :host.
   */
  _getPosition(element) {
    let xPosition =
      element.offsetLeft - element.scrollLeft + element.clientLeft;
    let yPosition = element.offsetTop - element.scrollTop + element.clientTop;
    return { x: xPosition, y: yPosition };
  }
  /**
   * Handle display and position of the context menu
   */
  _positionContextMenu(menu, target, xoffset, yoffset) {
    // make it account for the offset if it's floated over to one side
    // or inside of something that's over that way
    if (target != null) {
      let pos = this._getPosition(target);
      if (xoffset != null) {
        menu.style["left"] = pos.x + xoffset + "px";
      } else {
        menu.style["left"] = pos.x + "px";
      }
      if (yoffset != null) {
        menu.style["top"] = pos.y + yoffset + "px";
      } else {
        menu.style["top"] = pos.y + "px";
      }
    }
    menu.classList.add("hax-context-visible");
    // text we want to operate this way
    if (this.__activeHover) {
      menu.classList.add("hax-active-hover");
      menu.style.marginLeft = "";
      this.__typeLock = false;
    }
    setTimeout(() => {
      this._keepContextVisible();
    }, 100);
  }
  /**
   * Simple hide / reset of whatever menu it's handed.
   */
  _hideContextMenu(menu) {
    menu.classList.remove(
      "hax-context-visible",
      "hax-context-pin-top",
      "hax-context-pin-bottom"
    );
    menu.style.left = "-100px";
  }
  /**
   * Find the next thing to tab forward to.
   */
  _tabKeyPressed() {
    let focus = false;
    let node = this.activeContainerNode;
    const activeNodeTagName = this.activeContainerNode.tagName;
    // try selection / tab block since range can cause issues
    try {
      let range = window.HaxStore.getRange().cloneRange();
      var tagTest = range.commonAncestorContainer.tagName;
      if (typeof tagTest === typeof undefined) {
        tagTest = range.commonAncestorContainer.parentNode.tagName;
      }
      if (
        ["UL", "OL", "LI"].includes(activeNodeTagName) ||
        ["UL", "OL", "LI"].includes(tagTest)
      ) {
        if (this.polyfillSafe) {
          document.execCommand("indent");
          this.__tabTrap = true;
        }
      } else {
        while (!focus) {
          // do nothing
          if (node.nextSibling == null) {
            focus = true;
          } else if (node.nextSibling.focus === "function") {
            node.nextSibling.focus();
            focus = true;
          } else {
            node = node.nextSibling;
          }
        }
      }
    } catch (e) {
      console.warn(e);
    }
  }
  /**
   * Move back through things when tab back pressed
   */
  _tabBackKeyPressed() {
    let node = this.activeContainerNode;
    const activeNodeTagName = this.activeContainerNode.tagName;
    // try selection / tab block since range can cause issues
    try {
      let range = window.HaxStore.getRange().cloneRange();
      var tagTest = range.commonAncestorContainer.tagName;
      if (typeof tagTest === typeof undefined) {
        tagTest = range.commonAncestorContainer.parentNode.tagName;
      }
      if (
        ["UL", "OL", "LI"].includes(activeNodeTagName) ||
        ["UL", "OL", "LI"].includes(tagTest)
      ) {
        if (this.polyfillSafe) {
          document.execCommand("outdent");
          this.__tabTrap = true;
        }
      } else {
        if (node != null) {
          // step back ignoring hax- prefixed elements
          while (node != null && !this._validElementTest(node)) {
            node = node.previousSibling;
          }
        }
        if (node != null) {
          setTimeout(() => {
            node.focus();
          }, 50);
        }
      }
    } catch (e) {
      console.warn(e);
    }
  }
}
window.customElements.define(HaxBody.tag, HaxBody);
export { HaxBody };
