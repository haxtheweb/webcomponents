import { html, css } from "lit-element/lit-element.js";
// LitElement based
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import {
  encapScript,
  wipeSlot,
  generateResourceID,
  nodeToHaxElement,
  haxElementToNode
} from "@lrnwebcomponents/utils/utils.js";
// variables required as part of the gravity drag and scroll
var gravityScrollTimer = null;
const maxStep = 25;
const edgeSize = 100;

/**
 * `hax-body`
 * Manager of the body area that can be modified
 * 
### Styling
`<hax-bodys>` provides following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|--------
--haxcms-base-styles-body-font-size |   | 16px
--haxcms-base-styles-body-font-family, 'Noto Serif' |   | serif
--haxcms-base-styles-body-line-height |   | 1.8
--haxcms-base-styles-body-letter-spacing |   | .5px
--hax-ui-headings |   | #d4ff77;
--hax-color-text | default text color | #000
--hax-contextual-action-text-color |  | --simple-colors-default-theme-grey-1
--hax-contextual-action-color |  | --simple-colors-default-theme-cyan-7
--hax-contextual-action-hover-color |  | 
--hax-body-target-background-color: --simple-colors-default-theme-cyan-2
--hax-body-possible-target-background-color: --simple-colors-default-theme-grey-2

####Outlines
Custom property | Description | Default
----------------|-------------|--------
--hax-body-editable-outline |   | 1px solid --simple-colors-default-theme-deep-orange
--hax-body-active-outline-hover: 1px solid --hax-contextual-action-color
--hax-body-active-outline: 3px solid  --hax-contextual-action-color

####Headings
Custom property | Description | Default
----------------|-------------|--------
--hax-base-styles-h1-font-size |   | 2.5em
--hax-base-styles-h1-line-height |   | 2.5em
--hax-base-styles-h2-font-size |   | 2em
--hax-base-styles-h3-font-size |   | 1.75em
--hax-base-styles-h4-font-size |   | 1.5em
--hax-base-styles-h5-font-size |   | 1.25em
--hax-base-styles-h6-font-size |   | 1.25em
--hax-base-styles-p-min-height |   | 43px
--hax-base-styles-p-font-size |   | 24px
--hax-base-styles-p-line-height |   | 1.8
--hax-base-styles-p-letter-spacing |   | 0.5px

####Links
Custom property | Description | Default
----------------|-------------|--------
--hax-base-styles-a-color |  | --simple-colors-default-theme-grey-12
--hax-base-styles-a-font-size |   | 24px
--hax-base-styles-a-font-weight |   | normal
--hax-base-styles-a-color-visited |   | --simple-colors-default-theme-light-blue
--hax-base-styles-a-color-active |   | --simple-colors-default-theme-light-blue
--hax-base-styles-a-font-weight-active |   | normal

####Lists
Custom property | Description | Default
----------------|-------------|--------
--hax-base-styles-list-padding-bottom |   | 1.5em
--hax-base-styles-list-line-height |   | 40px
--hax-base-styles-list-font-size |   | 24px
--hax-base-styles-list-last-child-padding-bottom |   | 1em
--hax-base-styles-list-padding-left |   | 20px
--hax-base-styles-list-margin-left |   | 20px
 * 
 * @microcopy - the mental model for this element
 *  - body is effectively a body of content that can be manipulated in the browser. This is for other HAX elements ultimately to interface with and reside in. It is the controller of input and output for all of HAX as it exists in a document. body is not the <body> tag but we need a similar mental model container for all our other elements.
 *  - text-context - the context menu that shows up when an item is active so it can have text based operations performed to it.
 *  - plate/grid plate - a plate or grid plate is a container that we can operate on in HAX. it can also have layout / "global" type of body operations performed on it such as delete, duplicate and higher level format styling.
 * 
 * @demo demo/index.html
 * @LitElement
 * @element hax-body
 */
class HaxBody extends SimpleColors {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      ...super.styles,
      css`
        :host([edit-mode]),
        :host([edit-mode]) * ::slotted(*) {
          line-height: 1.8;
        }
        :host([edit-mode]) ul,
        :host([edit-mode]) ol {
          padding-left: 20px;
          margin-left: 20px;
        }
        :host([edit-mode]) ul {
          list-style-type: disc;
        }
        :host([edit-mode]) li {
          margin-bottom: 6px;
        }
        :host {
          display: block;
          position: relative;
          min-height: 32px;
          min-width: 32px;
          outline: none;
          --hax-contextual-action-text-color: var(
            --simple-colors-default-theme-grey-1,
            #fff
          );
          --hax-contextual-action-hover-color: var(
            --simple-colors-default-theme-cyan-7,
            #009dc7
          );
          --hax-contextual-action-color: var(
            --simple-colors-default-theme-cyan-8,
            #007999
          );
          --hax-body-editable-outline: 1px solid
            var(--simple-colors-default-theme-deep-orange, #ff8a64);
          --hax-body-active-outline-hover: 1px solid
            var(
              --hax-contextual-action-hover-color,
              var(--simple-colors-default-theme-cyan-7, #009dc7)
            );
          --hax-body-active-outline: 3px solid
            var(
              --hax-contextual-action-hover-color,
              var(--simple-colors-default-theme-cyan-7, #009dc7)
            );
          --hax-body-target-background-color: var(
            --simple-colors-default-theme-cyan-2,
            #9beaff
          );
          --hax-body-possible-target-background-color: var(
            --simple-colors-default-theme-grey-2,
            #dddddd;
          );
        }
        .hax-context-menu {
          padding: 0;
          margin-left: -5000px;
          position: fixed;
          visibility: hidden;
          opacity: 0;
          z-index: 1000;
          float: left;
          display: block;
          pointer-events: none;
          transition: 0.2s top ease-in-out, 0.2s left ease-in-out,
            0.2s visibility ease-in-out, 0.2s opacity ease-in-out;
        }
        #textcontextmenu.hax-context-menu {
          z-index: 1000;
        }
        .hax-context-visible {
          position: absolute;
          visibility: visible;
          pointer-events: all;
          opacity: 1;
        }
        .hax-context-visible.hax-active-hover {
          margin-left: unset;
        }
        :host([edit-mode]) #bodycontainer ::slotted(p) {
          min-height: var(--hax-base-styles-p-min-height, 1rem);
          font-size: var(--hax-base-styles-p-font-size);
          line-height: var(--hax-base-styles-p-line-height);
          letter-spacing: var(--hax-base-styles-p-letter-spacing);
        }
        :host([edit-mode]) #bodycontainer ::slotted(a) {
          color: var(--hax-base-styles-a-color);
          font-size: var(
            --hax-base-styles-a-font-size,
            var(--hax-base-styles-p-font-size)
          );
          font-weight: var(--hax-base-styles-a-font-weight);
        }
        :host([edit-mode]) #bodycontainer ::slotted(a:visited) {
          color: var(--hax-base-styles-a-color-visited);
        }
        :host([edit-mode]) #bodycontainer ::slotted(a:active),
        :host([edit-mode]) #bodycontainer ::slotted(a:focus),
        :host([edit-mode]) #bodycontainer ::slotted(a:hover) {
          color: var(--hax-base-styles-a-color-active);
          font-weight: var(--hax-base-styles-a-font-weight-active);
        }
        :host([edit-mode]) #bodycontainer ::slotted(ol),
        :host([edit-mode]) #bodycontainer ::slotted(ul),
        :host([edit-mode]) #bodycontainer ::slotted(li) {
          padding-bottom: var(--hax-base-styles-list-padding-bottom);
          line-height: var(
            --hax-base-styles-list-line-height,
            var(--hax-base-styles-p-line-height)
          );
          font-size: var(
            --hax-base-styles-list-font-size,
            var(--hax-base-styles-p-font-size)
          );
        }
        :host([edit-mode]) #bodycontainer ::slotted(ol > li:last-child),
        :host([edit-mode]) #bodycontainer ::slotted(ul > li:last-child) {
          padding-bottom: var(--hax-base-styles-list-last-child-padding-bottom);
        }
        :host([edit-mode]) #bodycontainer ::slotted(img[data-editable]) {
          max-width: 100%;
        }
        :host([edit-mode]) #bodycontainer ::slotted(*[data-editable]) {
          outline: none;
          transition: 0.8s ease-in-out outline;
          caret-color: var(--hax-color-text);
        }
        :host([edit-mode]) #bodycontainer ::slotted(*.blinkfocus) {
          outline: 8px solid var(--hax-contextual-action-hover-color);
        }
        :host([edit-mode])
          #bodycontainer
          ::slotted(*:not(grid-plate)[data-editable]:hover) {
          outline: var(--hax-body-active-outline-hover);
          caret-color: #000000;
        }
        :host([edit-mode])
          #bodycontainer
          ::slotted(*.hax-active[data-editable]:hover) {
          cursor: text !important;
          outline: var(--hax-body-active-outline-hover);
        }
        :host([edit-mode])
          #bodycontainer
          ::slotted(*:not(grid-plate)[data-editable] .hax-active:hover) {
          cursor: text !important;
          outline: var(--hax-body-active-outline-hover);
        }
        :host([edit-mode])
          #bodycontainer
          ::slotted(code.hax-active[data-editable]) {
          display: block;
        }
        :host([edit-mode])
          #bodycontainer
          ::slotted(*.hax-active[data-editable]) {
          outline: var(--hax-body-active-outline) !important;
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
          font-size: 12px;
          line-height: 12px;
          left: unset;
          right: unset;
          top: unset;
          background-color: var(--simple-colors-default-theme-cyan-7, #3b97e3);
          color: #ffffff;
          bottom: unset;
          width: auto;
          padding: 6px;
          margin: -2px;
          z-index: 1;
          margin: 0;
          float: right;
        }
        .hax-context-menu:not(:defined) {
          display: none;
        }
        /* drag and drop */
        :host([edit-mode]) #bodycontainer ::slotted(*.hax-moving) {
          outline: var(--hax-body-active-outline);
          background-color: #eeeeee;
        }
        :host([edit-mode]) #bodycontainer ::slotted(*.hax-mover):before {
          outline: var(--hax-body-editable-outline);
          background-color: var(--hax-body-possible-target-background-color);
          content: " ";
          width: 100%;
          display: block;
          position: relative;
          margin: -30px 0 0 0;
          z-index: 2;
          height: 30px;
        }
        :host([edit-mode]) #bodycontainer ::slotted(*.hax-hovered):before {
          background-color: var(--hax-body-target-background-color) !important;
          outline: var(--hax-body-active-outline);
        }
        @media screen and (min-color-index: 0) and(-webkit-min-device-pixel-ratio:0) {
          /*
            Define here the CSS styles applied only to Safari browsers
            (any version and any device) via https://solvit.io/bcf61b6
          */
          :host([edit-mode]) #bodycontainer ::slotted(*.hax-mover) {
            outline: var(--hax-body-editable-outline);
            background-color: var(--hax-body-possible-target-background-color);
          }
          :host([edit-mode]) #bodycontainer ::slotted(*.hax-hovered) {
            background-color: var(
              --hax-body-target-background-color
            ) !important;
            outline: var(--hax-body-active-outline);
          }
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
    this.haxSelectedText = "";
    this.activeContainerNode = null;
    setTimeout(() => {
      import("./lib/hax-text-context.js");
      import("./lib/hax-ce-context.js");
      import("./lib/hax-plate-context.js");
      import("@lrnwebcomponents/grid-plate/grid-plate.js");
      this.polyfillSafe = window.HaxStore.instance.computePolyfillSafe();
      this.addEventListener(
        "hax-context-item-selected",
        this._haxContextOperation.bind(this)
      );
      this.addEventListener(
        "place-holder-replace",
        this.replacePlaceholder.bind(this)
      );
      this.addEventListener("focusin", this._focusIn.bind(this));
      this.addEventListener("mousedown", this._focusIn.bind(this));
      this.addEventListener("dragenter", this.dragEnterBody.bind(this));
      this.addEventListener("drop", this.dropEvent.bind(this));
      this.addEventListener("click", this.clickEvent.bind(this));
    }, 0);
  }
  static get tag() {
    return "hax-body";
  }
  clickEvent(e) {
    // failsafe to clear to the gravity scrolling
    clearTimeout(gravityScrollTimer);
  }
  /**
   * Activation allowed from outside this grid as far as drop areas
   */
  dragEnterBody(e) {
    const children = this.childNodes;
    // walk the children and apply the draggable state needed
    for (var i in children) {
      if (children[i].classList && children[i] !== this.activeItem) {
        children[i].classList.add("hax-mover");
      }
    }
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
       * Text hax-store has detected is selected currently.
       */
      haxSelectedText: {
        type: String
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
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
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
      if (!this.openDrawer && this.editMode) {
        setTimeout(() => {
          const tmp = window.HaxStore.getSelection();
          window.HaxStore._tmpSelection = tmp;
          window.HaxStore.write("haxSelectedText", tmp.toString(), this);
          try {
            const range = window.HaxStore.getRange();
            if (range.cloneRange) {
              window.HaxStore._tmpRange = range.cloneRange();
            }
          } catch (e) {
            console.warn(e);
          }
        }, 10);
      }
    });
    // in case we miss this on the initial setup. possible in auto opening environments.
    this.editMode = window.HaxStore.instance.editMode;
    // ensure this resets every append
    this.__tabTrap = false;
    this.__ready = true;
  }
  /**
   * LitElement life cycle - properties changed callback
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "editMode") {
        this._editModeChanged(this[propName], oldValue);
      }
      if (propName == "globalPreferences") {
        this._globalPreferencesUpdated(this[propName], oldValue);
      }
      if (propName == "activeNode" && this.__ready) {
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
      if (propName == "activeContainerNode" && this.__ready) {
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
              // special support for Header tags showing up w.o. identifiers
              // this way it's easier to anchor to them in the future
              if (
                ["H1", "H2", "H3", "H4", "H5", "H6"].includes(node.tagName) &&
                node.getAttribute("id") == null
              ) {
                node.setAttribute("id", generateResourceID("header-"));
              }
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
      window.addEventListener("resize", this._keepContextVisible.bind(this));
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
    window.removeEventListener("resize", this._keepContextVisible.bind(this));
    this._observer.disconnect();
    super.disconnectedCallback();
  }
  /**
   * Keep the context menu visible if needed
   */
  _keepContextVisible(e = null) {
    if (!this.openDrawer && this.editMode) {
      clearTimeout(this.__contextVisibleLock);
      this.__contextVisibleLock = setTimeout(() => {
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
          if (this.elementMidViewport()) {
            el.classList.add("hax-context-pin-top");
            this.shadowRoot
              .querySelector("#platecontextmenu")
              .classList.add("hax-context-pin-top");
          } else {
            el.classList.remove("hax-context-pin-top");
            this.shadowRoot
              .querySelector("#platecontextmenu")
              .classList.remove("hax-context-pin-top");
          }
          this.positionContextMenus();
        }
      }, 50);
    }
  }
  _onKeyDown(e) {
    if (
      !this.openDrawer &&
      this.editMode &&
      this.getAttribute("contenteditable")
    ) {
      let sel = window.HaxStore.getSelection();
      if (sel.anchorNode != null) {
        switch (e.key) {
          case "Tab":
            if (window.HaxStore.instance.isTextElement(this.activeNode)) {
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
            clearTimeout(this.__keyPress);
            this.__keyPress = setTimeout(() => {
              const tmp = window.HaxStore.getSelection();
              window.HaxStore._tmpSelection = tmp;
              window.HaxStore.write("haxSelectedText", tmp.toString(), this);
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
                typeof rng.commonAncestorContainer.parentNode.focus ===
                  "function"
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
                } else {
                  this.activeNode = rng.commonAncestorContainer;
                  this.activeContainerNode = this.activeNode;
                  window.HaxStore.write(
                    "activeNode",
                    rng.commonAncestorContainer,
                    this
                  );
                  window.HaxStore.write(
                    "activeContainerNode",
                    rng.commonAncestorContainer,
                    this
                  );
                  setTimeout(() => {
                    this.positionContextMenus();
                  }, 0);
                }
              } else {
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
  }
  _onKeyPress(e) {
    clearTimeout(this.__keyPress);
    this.__keyPress = setTimeout(() => {
      if (
        !this.openDrawer &&
        this.editMode &&
        this.shadowRoot
          .querySelector("#textcontextmenu")
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
          this.positionContextMenus();
        }, 1500);
      }
    }, 50);
  }
  /**
   * on mouse over then fire the hax ray value if we have one
   */
  hoverEvent(e) {
    if (!this.openDrawer && this.editMode) {
      if (e.target && e.target.getAttribute("data-hax-ray") != null) {
        this.__activeHover = e.target;
      } else if (
        e.target &&
        e.target.parentNode &&
        e.target.parentNode.getAttribute("data-hax-ray") != null
      ) {
        this.__activeHover = e.target.parentNode;
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
          this.positionContextMenus();
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
   * Only true if we are scrolling and part way through an element
   */
  elementMidViewport() {
    const y = this.activeNode.getBoundingClientRect().y;
    return y < 0 && y > -1 * this.activeNode.offsetHeight + 140;
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
      this.haxReplaceNode(this.activeNode, p);
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
  canTansformNode(node = null) {
    return this.replaceElementWorkflow(node, true).length > 0 ? true : false;
  }
  /**
   * Whole workflow of replacing something in place contextually.
   * This can fire for things like events needing this workflow to
   * invoke whether it's a "convert" event or a "replace placeholder" event
   */
  replaceElementWorkflow(activeNode = null, testOnly = false) {
    // support for tests with things other than activeNode
    if (activeNode == null) {
      activeNode = this.activeNode;
    }
    let element = nodeToHaxElement(activeNode, null);
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
      let tag = activeNode.tagName.toLowerCase();
      let humanName = tag.replace("-", " ");
      if (
        typeof window.HaxStore.instance.elementList[tag] !== typeof undefined &&
        window.HaxStore.instance.elementList[tag].gizmo !== false
      ) {
        humanName = window.HaxStore.instance.elementList[tag].gizmo.title;
      }
      if (!testOnly) {
        window.HaxStore.instance.activePlaceHolder = this.activeNode;
        window.HaxStore.instance.haxAppPicker.presentOptions(
          haxElements,
          "__convert",
          `Transform ${humanName} to..`,
          "gizmo"
        );
      }
    } else {
      if (!testOnly) {
        window.HaxStore.toast("Sorry, this can not be transformed!", 5000);
      }
    }
    return haxElements;
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
  haxInsert(tag, content, properties = {}) {
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
    const newNode = frag.cloneNode(true);
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
      this.haxReplaceNode(window.HaxStore.instance.activePlaceHolder, newNode);
      window.HaxStore.instance.activePlaceHolder = null;
    }
    // insert at active insert point if we have one
    else if (this.activeContainerNode != null) {
      // allow for inserting things into things but not grid plate
      if (
        this.activeContainerNode.tagName === "GRID-PLATE" &&
        this.activeContainerNode !== this.activeNode
      ) {
        if (this.activeNode.getAttribute("slot") != null) {
          newNode.setAttribute("slot", this.activeNode.getAttribute("slot"));
        }
        if (this.activeNode.parentNode == this.activeContainerNode) {
          this.activeContainerNode.insertBefore(newNode, this.activeNode);
        } else {
          this.activeContainerNode.appendChild(newNode);
        }
      } else {
        if (
          this.activeContainerNode &&
          this.activeContainerNode.nextElementSibling
        ) {
          this.activeContainerNode.nextElementSibling.parentNode.insertBefore(
            newNode,
            this.activeContainerNode.nextElementSibling
          );
        } else if (this.activeNode.parentNode) {
          this.activeNode.parentNode.insertBefore(newNode, this.activeNode);
        } else {
          // something odd happened let's just make sure we insert this safely
          this.appendChild(newNode);
        }
      }
    } else {
      // send this into the root, which should filter it back down into the slot
      this.appendChild(newNode);
    }
    this.shadowRoot.querySelector("#textcontextmenu").highlightOps = false;
    this.activeContainerNode = newNode.parentNode;
    this.activeNode = newNode;
    window.HaxStore.write("activeContainerNode", newNode.parentNode, this);
    window.HaxStore.write("activeNode", newNode, this);
    // wait so that the DOM can have the node to then attach to
    setTimeout(() => {
      // scroll to it
      if (typeof newNode.scrollIntoViewIfNeeded === "function") {
        newNode.scrollIntoViewIfNeeded(true);
      } else {
        newNode.scrollIntoView({
          behavior: "smooth",
          inline: "center"
        });
      }
      this.positionContextMenus();
    }, 10);
    return true;
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
    var content = "";
    for (var i = 0, len = children.length; i < len; i++) {
      // some mild front-end sanitization
      if (this._validElementTest(children[i])) {
        children[i].removeAttribute("data-editable");
        children[i].removeAttribute("data-hax-ray");
        // remove some of the protected classes though they shouldn't leak through
        children[i].classList.remove(
          "hax-mover",
          "hax-moving",
          "hax-hovered",
          "grid-plate-active-item"
        );
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
    return content;
  }
  /**
   * Duplicate node into the local DOM below the current item if we can.
   */
  haxDuplicateNode(node, parent = this) {
    // move the context menu before duplicating!!!!
    this.hideContextMenus(false);
    // convert the node to a hax element
    let haxElement = nodeToHaxElement(node, null);
    // support for deep API call to clean up special elements
    if (typeof node.preProcessHaxInsertContent !== typeof undefined) {
      haxElement = node.preProcessHaxInsertContent(haxElement);
    }
    if (haxElement.content == haxElement.properties.innerHTML) {
      delete haxElement.properties.innerHTML;
    }
    // convert it back to a clone, seems odd I'm sure but this ensures that all props are copied
    // correctly and that we get a brand new object
    var nodeClone = haxElementToNode({
      tag: haxElement.tag,
      content: haxElement.content,
      properties: haxElement.properties
    });
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
  hideContextMenus(hidePlate = true) {
    // clear the timeouts for anything that could cause these to reapear
    clearTimeout(gravityScrollTimer);
    clearTimeout(this.__keyPress);
    clearTimeout(this.__contextVisibleLock);
    clearTimeout(this.__positionContextTimer);
    // primary context menus
    this._hideContextMenu(this.shadowRoot.querySelector("#textcontextmenu"));
    this._hideContextMenu(this.shadowRoot.querySelector("#cecontextmenu"));
    // secondary menus and clean up areas
    if (hidePlate) {
      this._hideContextMenu(this.shadowRoot.querySelector("#platecontextmenu"));
    }
    // force context menu state to closed
    this.shadowRoot.querySelector("#textcontextmenu").highlightOps = false;
  }
  /**
   * Reposition context menus to match an element.
   */
  positionContextMenus(node = this.activeNode, container = this.activeNode) {
    // sanity chekc and ensure we are not told to lock position of all menus
    clearTimeout(this.__positionContextTimer);
    this.__positionContextTimer = setTimeout(() => {
      if (
        node &&
        !window.HaxStore.instance._lockContextPosition &&
        this.__ready
      ) {
        // menu width starts out w/ the plate context which is a set size
        let menuWidth = 140;
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
          this._positionContextMenu(
            this.shadowRoot.querySelector("#cecontextmenu"),
            container,
            -1,
            -30
          );
          menuWidth += 28;
        } else {
          this._hideContextMenu(
            this.shadowRoot.querySelector("#cecontextmenu")
          );
          this._positionContextMenu(
            this.shadowRoot.querySelector("#textcontextmenu"),
            container,
            -1,
            -30
          );
          // text menu can expand based on selection
          let textRect = this.shadowRoot
            .querySelector("#textcontextmenu")
            .getBoundingClientRect();
          menuWidth += textRect.width;
        }
        if (container) {
          let activeRect = container.getBoundingClientRect();
          // need to account for the item being small than the menu
          if (Math.round(menuWidth) >= Math.round(activeRect.width)) {
            this._positionContextMenu(
              this.shadowRoot.querySelector("#platecontextmenu"),
              container,
              -1,
              -58
            );
          } else {
            this._positionContextMenu(
              this.shadowRoot.querySelector("#platecontextmenu"),
              container,
              activeRect.width -
                this.shadowRoot
                  .querySelector("#platecontextmenu")
                  .getBoundingClientRect().width +
                2,
              -28
            );
          }
        }
        // special case for node not matching container yet it being editable
        if (
          container &&
          !window.HaxStore.instance.isTextElement(node) &&
          node !== container
        ) {
          container.removeAttribute("contenteditable");
        } else if (container) {
          container.setAttribute("contenteditable", true);
        }
      }
    }, 10);
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
    }
    setTimeout(() => {
      if (typeof node.scrollIntoViewIfNeeded === "function") {
        node.scrollIntoViewIfNeeded(true);
      } else {
        node.scrollIntoView({ behavior: "smooth", inline: "center" });
      }
      this.positionContextMenus(node, node);
    }, 10);
    return true;
  }
  /**
   * Inject / modify a grid plate where something currently lives
   */
  async haxGridPlateOps(node, side, add = true) {
    // allow splitting the grid plate that is already there
    let changed = false;
    if (node.tagName === "GRID-PLATE") {
      if (add) {
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
          case "1-1-1-1":
            node.layout = "1-1-1-1-1";
            changed = true;
            break;
          case "1-1-1-1-1":
            node.layout = "1-1-1-1-1-1";
            changed = true;
            break;
        }
      } else {
        switch (node.layout) {
          case "1-1":
            // implies we are removing the grid plate
            let cloneEl;
            await node.childNodes.forEach(el => {
              // verify its a tag
              if (el.tagName) {
                // remove slot name
                cloneEl = el.cloneNode(true);
                cloneEl.removeAttribute("slot");
                cloneEl.classList.remove("hax-mover");
                cloneEl.classList.remove("hax-moving");
                node.parentNode.insertBefore(cloneEl, node);
              }
            });
            // whatever was moved out last use as active now
            this.activeNode = cloneEl;
            this.activeContainerNode = cloneEl;
            window.HaxStore.write("activeNode", cloneEl, this);
            window.HaxStore.write("activeContainerNode", cloneEl, this);
            setTimeout(() => {
              node.remove();
            }, 0);
            changed = true;
            break;
          case "1-1-1":
            node.layout = "1-1";
            changed = true;
            break;
          case "1-1-1-1":
            node.layout = "1-1-1";
            changed = true;
            break;
          case "1-1-1-1-1":
            node.layout = "1-1-1-1";
            changed = true;
            break;
          case "1-1-1-1-1-1":
            node.layout = "1-1-1-1-1";
            changed = true;
            break;
        }
      }
      // if left, nudge everything over 1, right simple
      if (changed) {
        let platecontextmenu = this.shadowRoot.querySelector(
          "#platecontextmenu"
        );
        let right = platecontextmenu.shadowRoot.querySelector("#right");
        let rightremove = platecontextmenu.shadowRoot.querySelector(
          "#rightremove"
        );
        right.disabled = false;
        rightremove.disabled = false;
        if (node.layout == "1-1-1-1-1-1") {
          right.disabled = true;
        }
        if (side == "left") {
          node.childNodes.forEach(el => {
            if (el.tagName) {
              let s =
                parseInt(el.getAttribute("slot").replace("col-", ""), 10) + 1;
              el.setAttribute("slot", `col-${s}`);
            }
          });
        }
      }
    } else {
      // make a new grid plate, default to 2 col and disable
      // responsive by default as this is what many will expect
      let grid = document.createElement("grid-plate");
      grid.layout = "1-1";
      grid.disableResponsive = true;
      node.parentNode.insertBefore(grid, node);
      let col = "2";
      if (side == "right") {
        col = "1";
      }
      setTimeout(() => {
        grid.appendChild(node);
        this.activeContainerNode = grid;
        window.HaxStore.write("activeContainerNode", grid, this);
        node.setAttribute("slot", "col-" + col);
      }, 0);
    }
  }
  /**
   * Convert an element from one tag to another.
   */
  haxReplaceNode(node, replacement) {
    // Switch, try loop in case we screwed up elsewhere
    try {
      if (node == null) {
        node = this.__oldActiveNode;
      }
      node.replaceWith(replacement);
      // test for slots to match
      if (node && node.getAttribute && node.getAttribute("slot") != null) {
        replacement.setAttribute("slot", node.getAttribute("slot"));
      }
    } catch (e) {
      console.warn(e);
    }
    return replacement;
  }
  /**
   * Convert an element from one tag to another.
   */
  haxChangeTagName(node, tagName) {
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
      node.replaceWith(replacement);
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
    this.activeNode = null;
    this.activeContainerNode = null;
    window.HaxStore.write("activeNode", null, this);
    window.HaxStore.write("activeContainerNode", null, this);
    try {
      return node.remove();
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
    // support a simple insert event to bubble up or everything else
    switch (detail.eventName) {
      // text based operations for primatives
      case "text-tag":
        // trigger the default selected value in context menu to match
        this.shadowRoot.querySelector("#textcontextmenu").realSelectedValue =
          detail.value;
        this.activeNode = this.haxChangeTagName(this.activeNode, detail.value);
        window.HaxStore.write("activeNode", this.activeNode, this);
        setTimeout(() => {
          this.positionContextMenus();
        }, 100);
        break;
      case "text-tag-ul":
        // trigger the default selected value in context menu to match
        this.shadowRoot.querySelector("#textcontextmenu").realSelectedValue =
          "ul";
        this.activeNode = this.haxChangeTagName(this.activeNode, "ul");
        window.HaxStore.write("activeNode", this.activeNode, this);
        setTimeout(() => {
          this.positionContextMenus();
        }, 100);
        break;
      case "text-tag-ol":
        // trigger the default selected value in context menu to match
        this.shadowRoot.querySelector("#textcontextmenu").realSelectedValue =
          "ol";
        this.activeNode = this.haxChangeTagName(this.activeNode, "ol");
        window.HaxStore.write("activeNode", this.activeNode, this);
        setTimeout(() => {
          this.positionContextMenus();
        }, 100);
        break;
      case "hax-plate-add-element":
        // support for the Other call, otherwise its a specific element + props
        if (detail.value == "other") {
          window.HaxStore.instance.haxInsertAnything({});
          return true;
        }
        // insert from here
        let addData = JSON.parse(detail.value);
        this.haxInsert(addData.tag, addData.content, addData.properties, false);
        // focus on 1st row w/ cursor if this a text element
        if (window.HaxStore.instance.isTextElement(addData)) {
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
        break;
      case "text-align-left":
        this.activeNode.style.textAlign = null;
        break;
      // grid plate based operations
      // allow for transforming this haxElement into another one
      case "hax-transform-node":
        this.replaceElementWorkflow();
        break;
      // grid plate based operations
      // allow for transforming this haxElement into another one
      case "hax-plate-create-right":
        this.haxGridPlateOps(this.activeContainerNode, "right");
        break;
      case "hax-plate-remove-right":
        this.haxGridPlateOps(this.activeContainerNode, "right", false);
        break;
      // duplicate the active item or container
      case "hax-plate-duplicate":
        if (this.activeNode === this.activeContainerNode) {
          this.haxDuplicateNode(this.activeNode);
        } else {
          this.haxDuplicateNode(this.activeNode, this.activeContainerNode);
        }
        break;
      case "hax-plate-delete":
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
      case "hax-plate-first":
        this.haxMoveGridPlate(
          "first",
          this.activeNode,
          this.activeContainerNode
        );
        break;
      case "hax-plate-up":
        this.haxMoveGridPlate("up", this.activeNode, this.activeContainerNode);
        break;
      case "hax-plate-down":
        this.haxMoveGridPlate(
          "down",
          this.activeNode,
          this.activeContainerNode
        );
        break;
      case "hax-plate-last":
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
    }
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
        containerNode.parentNode &&
        containerNode.parentNode.tagName
      ) {
        // keep looking til we are juuuust below the container
        // @notice this is where we force a selection on highest level
        // of the document
        while (
          containerNode.parentNode.tagName &&
          containerNode.parentNode.tagName != "HAX-BODY"
        ) {
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
        // ensure this is a tag we care about / have support for and
        // that it is a new value
        if (
          this.activeContainerNode !== containerNode &&
          !containerNode.classList.contains("ignore-activation")
        ) {
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
          setTimeout(() => {
            this.positionContextMenus(activeNode, activeNode);
          }, 0);
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
                this.positionContextMenus();
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
              this.positionContextMenus();
            }, 0);
          }
        }, 100);
      }
    }
    // hide menus when state changes
    if (newValue == false) {
      this.removeAttribute("contenteditable");
      setTimeout(() => {
        this.hideContextMenus();
      }, 50);
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
    let i = window.HaxStore.instance.gizmoList.findIndex(j => {
      if (j) {
        return j.tag === node.tagName.toLowerCase();
      }
    });
    if (i !== -1) {
      haxRay = window.HaxStore.instance.gizmoList[i].title;
    }
    // oooooo snap, drag and drop..
    if (status) {
      node.setAttribute("data-editable", status);
      node.setAttribute("data-hax-ray", haxRay);
      listenerMethod = "addEventListener";
    } else {
      node.removeAttribute("data-editable");
      node.removeAttribute("data-hax-ray");
      listenerMethod = "removeEventListener";
    }
    node[listenerMethod]("drop", this.dropEvent.bind(this));
    node[listenerMethod]("dragenter", this.dragEnter.bind(this));
    node[listenerMethod]("dragleave", this.dragLeave.bind(this));
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
      // esnure we clear the gravity scrolling drag effect
      clearTimeout(gravityScrollTimer);
      window.HaxStore.instance._lockContextPosition = false;
      // trick the tray into forcing active to be Configure
      window.HaxStore.instance.haxTray.activeTab = "item-1";
      var target = null;
      if (e.path && e.path[0]) {
        target = e.path[0];
      } else if (e.originalTarget) {
        target = e.originalTarget;
      } else {
        target = e.target;
      }
      // establish an activeNode /container based on drop poisition
      this.activeNode = target;
      window.HaxStore.write("activeNode", target, this);
      if (target.parentNode && target.parentNode.tagName === "GRID-PLATE") {
        this.activeContainerNode = target.parentNode;
        window.HaxStore.write("activeContainerNode", target.parentNode, this);
      } else {
        this.activeContainerNode = target.parentNode;
        window.HaxStore.write("activeContainerNode", target, this);
      }
      // walk the children and remove the draggable state needed
      setTimeout(() => {
        let children = this.querySelectorAll(
          ".hax-mover, .hax-hovered, .hax-moving, .grid-plate-active-item"
        );
        for (var i in children) {
          if (typeof children[i].classList !== typeof undefined) {
            children[i].classList.remove(
              "hax-mover",
              "hax-hovered",
              "hax-moving",
              "grid-plate-active-item"
            );
            // special support for grid plates as they manage internal drag/drop
            if (children[i].tagName === "GRID-PLATE") {
              children[i].dropEvent(e);
              for (var j = 1; j <= children[i].columns; j++) {
                if (
                  children[i].shadowRoot.querySelector("#col" + j) !== undefined
                ) {
                  children[i].shadowRoot
                    .querySelector("#col" + j)
                    .classList.remove("hax-mover");
                }
              }
            }
          }
        }
      }, 100);
      // this helps ensure that what gets drag and dropped is a file
      // this prevents issues with selecting and dragging text (which triggers drag/drop)
      // as well as compatibility with things that are legit in a draggable state
      try {
        // see if we are dropping a file
        if (
          e.dataTransfer &&
          e.dataTransfer.items &&
          e.dataTransfer.items.length > 0 &&
          e.dataTransfer.items[0].kind === "file"
        ) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          // inject a placeholder P tag which we will then immediately replace
          let tmp = document.createElement("p");
          this.activeNode.parentNode.insertBefore(tmp, this.activeNode);
          // this placeholder will be immediately replaced
          e.placeHolderElement = tmp;
          // fire this specialized event up so things like HAX can intercept
          this.dispatchEvent(
            new CustomEvent("place-holder-file-drop", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: e
            })
          );
        } else {
          // set taget based on drag target
          target = window.HaxStore.instance.__dragTarget;
          var local = e.target;
          // if we have a slot on what we dropped into then we need to mirror that item
          // and place ourselves below it in the DOM
          if (
            (target &&
              target != null &&
              typeof target.removeAttribute === "function" &&
              typeof local !== typeof undefined &&
              target !== local &&
              target !== local.parentNode &&
              target.parentNode === this) ||
            local.parentNode === this
          ) {
            // incase this came from a grid plate, drop the slot so it works
            target.removeAttribute("slot");
            try {
              local.parentNode.insertBefore(target, local);
            } catch (e) {
              console.warn(e);
            }
            // ensure that if we caught this event we process it
            e.preventDefault();
            e.stopPropagation();
          }
          // position arrows / set focus in case the DOM got updated above
          if (target && typeof target.focus === "function") {
            this.activeNode = target;
            if (
              this.activeNode &&
              this.activeNode.parentNode &&
              this.activeNode.parentNode.tagName === "GRID-PLATE"
            ) {
              this.activeContainerNode = this.activeNode.parentNode;
            }
            window.HaxStore.write("activeNode", this.activeNode, this);
            window.HaxStore.write(
              "activeContainerNode",
              this.activeContainerNode,
              this
            );
            // fire event saying that we dropped an item and gained
            // focus which should prioritize certain actions over a
            // normal focus shift
            this.dispatchEvent(
              new CustomEvent("hax-drop-focus-event", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: this.activeNode
              })
            );
            setTimeout(() => {
              if (typeof this.activeNode.scrollIntoViewIfNeeded === "function") {
                this.activeNode.scrollIntoViewIfNeeded(true);
              } else {
                this.activeNode.scrollIntoView({ behavior: "smooth", inline: "center" });
              }
              this.positionContextMenus();
            }, 250);
          }
        }
      } catch (e) {
        console.warn(e);
      }
    }
    // reset this after the drop goes through
    window.HaxStore.instance.__dragTarget = null;
  }
  /**
   * Enter an element, meaning we've over it while dragging
   */
  dragEnter(e) {
    if (!this.openDrawer && this.editMode && e.target) {
      e.preventDefault();
      if (e.target && e.target.classList) {
        e.target.classList.add("hax-hovered");
      }
      // perform check for edge of screen
      this.handleMousemove(e);
    }
  }
  // refactored from https://github.com/bennadel/JavaScript-Demos/blob/master/demos/window-edge-scrolling/index.htm
  // I adjust the window scrolling in response to the given mousemove event.
  handleMousemove(e) {
    // NOTE: Much of the information here, with regard to document dimensions,
    // viewport dimensions, and window scrolling is derived from JavaScript.info.
    // I am consuming it here primarily as NOTE TO SELF.
    // --
    // Read More: https://javascript.info/size-and-scroll-window
    // --
    // CAUTION: The viewport and document dimensions can all be CACHED and then
    // recalculated on window-resize events (for the most part). I am keeping it
    // all here in the mousemove event handler to remove as many of the moving
    // parts as possible and keep the demo as simple as possible.

    // Get the viewport-relative coordinates of the mousemove event.
    var viewportX = e.clientX;
    var viewportY = e.clientY;

    // Get the viewport dimensions.
    var viewportWidth = document.documentElement.clientWidth;
    var viewportHeight = document.documentElement.clientHeight;

    // Next, we need to determine if the mouse is within the "edge" of the
    // viewport, which may require scrolling the window. To do this, we need to
    // calculate the boundaries of the edge in the viewport (these coordinates
    // are relative to the viewport grid system).
    var edgeTop = edgeSize;
    var edgeLeft = edgeSize;
    var edgeBottom = viewportHeight - edgeSize;
    var edgeRight = viewportWidth - edgeSize;

    var isInLeftEdge = viewportX < edgeLeft;
    var isInRightEdge = viewportX > edgeRight;
    var isInTopEdge = viewportY < edgeTop;
    var isInBottomEdge = viewportY > edgeBottom;

    // If the mouse is not in the viewport edge, there's no need to calculate
    // anything else.
    if (!(isInLeftEdge || isInRightEdge || isInTopEdge || isInBottomEdge)) {
      clearTimeout(gravityScrollTimer);
      return;
    }

    // If we made it this far, the user's mouse is located within the edge of the
    // viewport. As such, we need to check to see if scrolling needs to be done.

    // Get the document dimensions.
    // --
    // NOTE: The various property reads here are for cross-browser compatibility
    // as outlined in the JavaScript.info site (link provided above).
    var documentWidth = Math.max(
      document.body.scrollWidth,
      document.body.offsetWidth,
      document.body.clientWidth,
      document.documentElement.scrollWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    );
    var documentHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.body.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight,
      document.documentElement.clientHeight
    );

    // Calculate the maximum scroll offset in each direction. Since you can only
    // scroll the overflow portion of the document, the maximum represents the
    // length of the document that is NOT in the viewport.
    var maxScrollX = documentWidth - viewportWidth;
    var maxScrollY = documentHeight - viewportHeight;

    // As we examine the mousemove event, we want to adjust the window scroll in
    // immediate response to the event; but, we also want to continue adjusting
    // the window scroll if the user rests their mouse in the edge boundary. To
    // do this, we'll invoke the adjustment logic immediately. Then, we'll setup
    // a timer that continues to invoke the adjustment logic while the window can
    // still be scrolled in a particular direction.
    // --
    // NOTE: There are probably better ways to handle the ongoing animation
    // check. But, the point of this demo is really about the math logic, not so
    // much about the interval logic.
    (function checkForWindowScroll() {
      clearTimeout(gravityScrollTimer);

      if (adjustWindowScroll()) {
        gravityScrollTimer = setTimeout(checkForWindowScroll, 30);
      }
    })();
    // Adjust the window scroll based on the user's mouse position. Returns True
    // or False depending on whether or not the window scroll was changed.
    function adjustWindowScroll() {
      // Get the current scroll position of the document.
      var currentScrollX = window.pageXOffset;
      var currentScrollY = window.pageYOffset;

      // Determine if the window can be scrolled in any particular direction.
      var canScrollUp = currentScrollY > 0;
      var canScrollDown = currentScrollY < maxScrollY;
      var canScrollLeft = currentScrollX > 0;
      var canScrollRight = currentScrollX < maxScrollX;

      // Since we can potentially scroll in two directions at the same time,
      // let's keep track of the next scroll, starting with the current scroll.
      // Each of these values can then be adjusted independently in the logic
      // below.
      var nextScrollX = currentScrollX;
      var nextScrollY = currentScrollY;

      // As we examine the mouse position within the edge, we want to make the
      // incremental scroll changes more "intense" the closer that the user
      // gets the viewport edge. As such, we'll calculate the percentage that
      // the user has made it "through the edge" when calculating the delta.
      // Then, that use that percentage to back-off from the "max" step value.

      // Should we scroll left?
      if (isInLeftEdge && canScrollLeft) {
        var intensity = (edgeLeft - viewportX) / edgeSize;

        nextScrollX = nextScrollX - maxStep * intensity;

        // Should we scroll right?
      } else if (isInRightEdge && canScrollRight) {
        var intensity = (viewportX - edgeRight) / edgeSize;

        nextScrollX = nextScrollX + maxStep * intensity;
      }

      // Should we scroll up?
      if (isInTopEdge && canScrollUp) {
        var intensity = (edgeTop - viewportY) / edgeSize;

        nextScrollY = nextScrollY - maxStep * intensity;

        // Should we scroll down?
      } else if (isInBottomEdge && canScrollDown) {
        var intensity = (viewportY - edgeBottom) / edgeSize;

        nextScrollY = nextScrollY + maxStep * intensity;
      }

      // Sanitize invalid maximums. An invalid scroll offset won't break the
      // subsequent .scrollTo() call; however, it will make it harder to
      // determine if the .scrollTo() method should have been called in the
      // first place.
      nextScrollX = Math.max(0, Math.min(maxScrollX, nextScrollX));
      nextScrollY = Math.max(0, Math.min(maxScrollY, nextScrollY));

      if (nextScrollX !== currentScrollX || nextScrollY !== currentScrollY) {
        window.scrollTo(nextScrollX, nextScrollY);
        return true;
      } else {
        return false;
      }
    }
  }
  /**
   * Leaving an element while dragging.
   */
  dragLeave(e) {
    if (!this.openDrawer && this.editMode && e.target && e.target.classList) {
      e.target.classList.remove("hax-hovered");
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
      // @notice this is a bit of a state hack between grid plate and hax
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
    if (
      this.editMode &&
      typeof newValue !== typeof undefined &&
      newValue !== null &&
      newValue.parentNode
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
      } else {
        newValue.removeAttribute("contenteditable");
        this.removeAttribute("contenteditable");
      }
      // why you no position yo?
      this.positionContextMenus();
      this.shadowRoot.querySelector("#textcontextmenu").realSelectedValue = tag;
    }
    // just hide menus if we don't have an active item
    else if (newValue === null) {
      this.hideContextMenus();
      this.__oldActiveNode = oldValue;
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
    menu.setAttribute("on-screen", "on-screen");
    menu.classList.add("hax-context-visible");
    // text we want to operate this way
    if (this.__activeHover) {
      menu.classList.add("hax-active-hover");
      menu.style.marginLeft = "";
      this.__typeLock = false;
    }
  }
  /**
   * Simple hide / reset of whatever menu it's handed.
   */
  _hideContextMenu(menu) {
    menu.removeAttribute("on-screen");
    menu.classList.remove(
      "hax-context-visible",
      "hax-active-hover",
      "hax-context-pin-top"
    );
  }
  /**
   * Find the next thing to tab forward to.
   */
  _tabKeyPressed() {
    let focus = false;
    let node = this.activeContainerNode;
    const activeNodeTagName = this.activeContainerNode.tagName;
    // try selection / tab block since range can cause issues
    if (window.HaxStore.getRange().cloneRange) {
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
  }
  /**
   * Move back through things when tab back pressed
   */
  _tabBackKeyPressed() {
    let node = this.activeContainerNode;
    const activeNodeTagName = this.activeContainerNode.tagName;
    // try selection / tab block since range can cause issues
    if (window.HaxStore.getRange().cloneRange) {
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
}
window.customElements.define(HaxBody.tag, HaxBody);
export { HaxBody };
