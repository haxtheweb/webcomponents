import { html, css } from "lit-element/lit-element.js";
// LitElement based
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import {
  encapScript,
  wipeSlot,
  generateResourceID,
  nodeToHaxElement,
  haxElementToNode,
  camelToDash,
} from "@lrnwebcomponents/utils/utils.js";
import { UndoManagerBehaviors } from "@lrnwebcomponents/undo-manager/undo-manager.js";
import { HAXStore } from "./lib/hax-store.js";
import { autorun, toJS } from "mobx";

// variables required as part of the gravity drag and scroll
var gravityScrollTimer = null;
const maxStep = 25;
const edgeSize = 200;

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
class HaxBody extends UndoManagerBehaviors(SimpleColors) {
  static get tag() {
    return "hax-body";
  }
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
            --simple-colors-default-theme-grey-8,
            #009dc7
          );
          --hax-contextual-action-color: var(
            --simple-colors-default-theme-grey-12,
            #007999
          );
          --hax-body-editable-outline: 0px solid
            var(--simple-colors-default-theme-grey-4, #eeeeee);
          --hax-body-active-outline-hover: 1px solid
            var(--simple-colors-default-theme-grey-8, #eeeeee);
          --hax-body-active-outline: 0px solid
            var(
              --hax-contextual-action-hover-color,
              var(--simple-colors-default-theme-cyan-7, #009dc7)
            );
          --hax-body-active-drag-outline: 1px solid
            var(
              --hax-contextual-action-hover-color,
              var(--simple-colors-default-theme-cyan-7, #009dc7)
            );
          --hax-body-target-background-color: var(
            --simple-colors-default-theme-grey-11,
            #009dc7
          );
          --hax-body-possible-target-background-color: inherit;
        }
        #addincontext {
          opacity: 0.5;
          transition: 0.2s opacity ease-in-out;
        }
        #addincontext:hover,
        #addincontext:active,
        #addincontext:focus {
          opacity: 1;
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
          transition: 0.2s top ease-in-out, 0.2s left ease-in-out;
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
        .hax-context-menu-active {
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
        :host([edit-mode]) #bodycontainer ::slotted(img[contenteditable]) {
          max-width: 100%;
        }
        :host([edit-mode]) #bodycontainer ::slotted(*[contenteditable]) {
          outline: none;
          caret-color: var(--hax-color-text);
        }
        :host([edit-mode]) #bodycontainer ::slotted(*.blinkfocus) {
          outline: 4px solid var(--hax-contextual-action-hover-color);
        }
        :host([edit-mode])
          #bodycontainer
          ::slotted(*:not(grid-plate)[contenteditable]:hover) {
          outline: var(--hax-body-active-outline-hover);
          caret-color: #000000;
        }
        :host([edit-mode])
          #bodycontainer
          ::slotted(*.hax-active[contenteditable]:hover) {
          cursor: text !important;
          outline: var(--hax-body-active-outline-hover);
        }
        :host([edit-mode])
          #bodycontainer
          ::slotted(*:not(grid-plate)[contenteditable] .hax-active:hover) {
          cursor: text !important;
          outline: var(--hax-body-active-outline-hover);
        }
        :host([edit-mode])
          #bodycontainer
          ::slotted(code.hax-active[contenteditable]) {
          display: block;
        }
        :host([edit-mode])
          #bodycontainer
          ::slotted(*.hax-active[contenteditable]) {
          outline: var(--hax-body-active-outline) !important;
        }
        :host([edit-mode]) #bodycontainer ::slotted(hr[contenteditable]) {
          height: 2px;
          background-color: #eeeeee;
          padding-top: 4px;
          padding-bottom: 4px;
        }
        /** Fix to support safari as it defaults to none */
        :host([edit-mode]) #bodycontainer ::slotted(*[contenteditable]) {
          -webkit-user-select: text;
          cursor: pointer;
        }

        :host([edit-mode])
          #bodycontainer
          ::slotted(*[contenteditable]::-moz-selection),
        :host([edit-mode])
          #bodycontainer
          ::slotted(*[contenteditable] *::-moz-selection) {
          background-color: var(--hax-body-highlight, --paper-yellow-300);
          color: black;
        }
        :host([edit-mode])
          #bodycontainer
          ::slotted(*[contenteditable]::selection),
        :host([edit-mode])
          #bodycontainer
          ::slotted(*[contenteditable] *::selection) {
          background-color: var(--hax-body-highlight, --paper-yellow-300);
          color: black;
        }
        #bodycontainer {
          -webkit-user-select: text;
          user-select: text;
        }
        :host([edit-mode][hax-ray-mode])
          #bodycontainer
          ::slotted(*[contenteditable]):before {
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
          z-index: 1;
          margin: 0;
          float: right;
        }
        .hax-context-menu:not(:defined) {
          display: none;
        }
        /* drag and drop */
        :host([edit-mode][hax-mover]) #bodycontainer ::slotted(*):before {
          background-color: var(--hax-body-possible-target-background-color);
          content: " ";
          width: 100%;
          display: block;
          position: relative;
          margin: -12px 0 0 0;
          z-index: 2;
          height: 12px;
          transition: 0.2s all ease-in-out;
        }
        :host([edit-mode][hax-mover]) #bodycontainer ::slotted(img) {
          outline: var(--hax-body-editable-outline);
        }
        :host([edit-mode]) #bodycontainer ::slotted(img.hax-hovered),
        :host([edit-mode]) #bodycontainer ::slotted(*.hax-hovered):before {
          background-color: var(--hax-body-target-background-color) !important;
        }
        :host([edit-mode]) #bodycontainer ::slotted(img.hax-hovered) {
          border-top: 8px
            var(
              --hax-contextual-action-hover-color,
              var(--simple-colors-default-theme-cyan-7, #009dc7)
            );
          margin-top: -8px;
        }

        @media screen and (min-color-index: 0) and(-webkit-min-device-pixel-ratio:0) {
          /*
            Define here the CSS styles applied only to Safari browsers
            (any version and any device) via https://solvit.io/bcf61b6
          */
          :host([edit-mode][hax-mover]) #bodycontainer ::slotted(*) {
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
      `,
    ];
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    // lock to ensure we don't flood events on hitting the up / down arrows
    // as we use a mutation observer to manage draggable bindings
    this.__ignoreActive = false;
    this.__dragMoving = false;
    this.___moveLock = false;
    this.editMode = false;
    this.haxMover = false;
    this.globalPreferences = {};
    // xray goggles for tags visualized in context, developer thing
    this.haxRayMode = false;
    this.activeNode = null;
    setTimeout(() => {
      import("./lib/hax-text-context.js");
      import("./lib/hax-ce-context.js");
      import("./lib/hax-plate-context.js");
      import("@lrnwebcomponents/grid-plate/grid-plate.js");
      this.polyfillSafe = HAXStore.computePolyfillSafe();
      this.addEventListener(
        "hax-context-item-selected",
        this._haxContextOperation.bind(this)
      );
      this.addEventListener(
        "place-holder-replace",
        this.replacePlaceholder.bind(this)
      );
      this.addEventListener("focusin", this._focusIn.bind(this));
      this.addEventListener("mousemove", this._mouseMove.bind(this));
      this.addEventListener("touchstart", this._mouseMove.bind(this), {
        passive: true,
      });
      this.addEventListener("mousedown", this._mouseDown.bind(this));
      this.addEventListener("mouseup", this._mouseUp.bind(this));
      this.addEventListener("dragenter", this.dragEnterBody.bind(this));
      this.addEventListener("dragend", this.dragEndBody.bind(this));
      this.addEventListener("drop", this.dropEvent.bind(this));
      this.addEventListener("click", this.clickEvent.bind(this));
    }, 0);
    autorun(() => {
      this.globalPreferences = toJS(HAXStore.globalPreferences);
    });
    autorun(() => {
      this.editMode = toJS(HAXStore.editMode);
    });
    autorun(() => {
      this.activeNode = toJS(HAXStore.activeNode);
    });
  }
  /**
   * When we end dragging ensure we remove the mover class.
   */
  dragEndBody(e) {
    this.__manageFakeEndCap(false);
    HAXStore._lockContextPosition = false;
    this.querySelectorAll(".hax-hovered").forEach((el) => {
      el.classList.remove("hax-hovered");
    });
  }
  _mouseMove(e) {
    if (this.editMode && HAXStore.ready) {
      clearTimeout(this.__mouseQuickTimer);
      this.__mouseQuickTimer = setTimeout(() => {
        if (
          this.__activeHover &&
          this.__activeHover != e.path[0].closest("[data-hax-ray]:not(li)") &&
          !e.path[0].closest("#addincontext")
        ) {
          let keep;
          for (var i = 0; i < e.path.length; i++) {
            if (
              e.path[i].getAttribute &&
              e.path[i].getAttribute("id") == "addincontext"
            ) {
              keep = true;
            }
          }
          if (!keep) {
            this.__activeHover = null;
            this._hideContextMenu(this.contextMenus.add);
          }
        }
      }, 300);
      clearTimeout(this.__mouseTimer);
      this.__mouseTimer = setTimeout(() => {
        this.__addActiveVisible();
        let target = e.path[0].closest("[data-hax-ray]:not(li)");
        if (target) {
          this.__activeHover = target;
          let activeRect = this.__activeHover.getBoundingClientRect();
          let addRect = this.contextMenus.add.getBoundingClientRect();
          // calculate mouse position relative to the element on page
          // and position the add above or below as a result
          // this is bonkers :)
          let distance =
            (e.pageY - (activeRect.top + window.scrollY)) / activeRect.height;
          let height = -addRect.height - 1;
          // incentivize above
          if (distance > 0.3) {
            height = activeRect.height + 1;
            this.__addAbove = false;
          } else {
            this.__addAbove = true;
          }
          // wow, we have an in context addition menu just like that
          this._positionContextMenu(
            this.contextMenus.add,
            this.__activeHover,
            activeRect.width / 2 - addRect.width / 2,
            height
          );
        } else if (
          e.path[0].closest(".column") &&
          e.path[3] &&
          e.path[3].closest("grid-plate")
        ) {
          let addRect = this.contextMenus.add.getBoundingClientRect();
          let height = -addRect.height - 1;
          let activeRect, posMenuEl;
          // weird but we need the structure of grid plate here unfortunately
          // if it has nodes in the column we are active on then we need
          // to defer to the grid level because you could always force a node
          if (!e.path[0].closest(".column:not(.has-nodes")) {
            // way out of a column to the host of the template
            this.__activeHover = e.path[0].closest(
              ".column"
            ).parentNode.parentNode.host;
            posMenuEl = this.__activeHover;
            activeRect = this.__activeHover.getBoundingClientRect();
            let distance =
              (e.pageY - (activeRect.top + window.scrollY)) / activeRect.height;
            if (distance > 0.3) {
              height = activeRect.height + 1;
              this.__addAbove = false;
            } else {
              this.__addAbove = true;
            }
          } else {
            // to avoid a later loop, we force this to "false"
            this.__addAbove = false;
            // this is a grid column so get it's ID to understand it's slot
            // this leverages our internal __slot hack that gets picked up
            // by our MO in order to automatically set __slot on a node anywhere
            // it's inserted in the body area leveraging alternative logic to
            // figure out which it should place where
            this.__slot = e.path[0]
              .closest(".column")
              .getAttribute("id")
              .replace("col", "col-");
            // based on what we learned we don't have nodes in the path column
            // but we KNOW there MUST be an element somewhere in this
            if (
              e.path[0].closest(".column").parentNode.parentNode.host.children
                .length == 0
            ) {
              let p = document.createElement("p");
              p.innerHTML = "<br />";
              e.path[0]
                .closest(".column")
                .parentNode.parentNode.host.appendChild(p);
            }
            this.__activeHover = e.path[0].closest(
              ".column"
            ).parentNode.parentNode.host.children[0];
            // we focus on the column unlike anything else
            activeRect = e.path[0].closest(".column").getBoundingClientRect();
            // right in the middle of the column
            height = activeRect.height / 2 - addRect.height / 2;
            posMenuEl = e.path[0].closest(".column");
          }

          // wow, we have an in context addition menu just like that
          this._positionContextMenu(
            this.contextMenus.add,
            posMenuEl,
            activeRect.width / 2 - addRect.width / 2,
            height
          );
        } else if (e.path[0].closest("#bodycontainer")) {
          this.__activeHover = null;
          this._hideContextMenu(this.contextMenus.add);
        }
      }, 600);
    }
  }
  _mouseDown(e) {
    this.__mouseDown = true;
    let target = e.target;
    // resolve to the closest ediable element if possible
    // otherwise keep the target we had
    // @todo need to test more situations for this..
    if (target.closest("[draggable]")) {
      target = target.closest("[draggable]");
    } else if (target.closest("[slot]")) {
      target = target.closest("[slot]");
    } else if (target.closest("[data-hax-ray]")) {
      target = target.closest("[data-hax-ray]");
    } else if (target.closest("[contenteditable]")) {
      target = target.closest("[contenteditable]");
    }
    if (this.__focusLogic(target)) {
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }
  /**
   * On mouse release, dump any scroller and the end cap element
   */
  _mouseUp(e) {
    // this helps w/ ensuring that the "focusin" event doesn't
    // fire when a mousedown is executed
    setTimeout(() => {
      this.__mouseDown = false;
    }, 0);
    // failsafe to clear to the gravity scrolling
    clearTimeout(gravityScrollTimer);
    this.__manageFakeEndCap(false);
  }
  clickEvent(e) {
    // failsafe to clear to the gravity scrolling
    clearTimeout(gravityScrollTimer);
  }
  /**
   * Make a fake end cap element so we can drop in the last position
   * @note This is much easier logic than the alternatives to account for.
   */
  __manageFakeEndCap(create = true) {
    if (create && !this.__fakeEndCap) {
      let fake = document.createElement("fake-hax-body-end");
      fake.style.width = "100%";
      fake.style.height = "20px";
      fake.style.zIndex = "2";
      fake.style.display = "block";
      this.__fakeEndCap = fake;
      this.haxMover = true;
      this.appendChild(this.__fakeEndCap);
      this.__applyNodeEditableState(this.__fakeEndCap, true);
    } else if (!create && this.__fakeEndCap) {
      this.__fakeEndCap.remove();
      this.haxMover = false;
      this.__fakeEndCap = null;
    }
  }
  /**
   * Activation allowed from outside this grid as far as drop areas
   */
  dragEnterBody(e) {
    // insert a fake child at the end
    this.__manageFakeEndCap(true);
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
      <hax-context-item
        id="addincontext"
        class="hax-context-menu ignore-activation"
        icon="icons:add-circle"
        label="Add here"
        mini
        circle
      >
      </hax-context-item>
    `;
  }
  /**
   * LitElement / popular convention
   */
  static get properties() {
    return {
      ...super.properties,
      haxMover: {
        type: Boolean,
        attribute: "hax-mover",
        reflect: true,
      },
      openDrawer: {
        type: Object,
      },
      /**
       * State of if we are editing or not.
       */
      editMode: {
        type: Boolean,
        reflect: true,
        attribute: "edit-mode",
      },
      /**
       * Bust out the HAX Ray mode
       */
      haxRayMode: {
        type: Boolean,
        reflect: true,
        attribute: "hax-ray-mode",
      },
      /**
       * Access to the global properties object.
       */
      globalPreferences: {
        type: Object,
      },
      /**
       * A reference to the active node in the slot.
       */
      activeNode: {
        type: Object,
      },
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
        detail: this,
      })
    );
    // try to normalize paragraph insert on enter
    try {
      document.execCommand("enableObjectResizing", false, false);
      document.execCommand("defaultParagraphSeparator", false, "p");
    } catch (e) {
      console.warn(e);
    }
    this.contextMenus = {
      text: this.shadowRoot.querySelector("#textcontextmenu"),
      plate: this.shadowRoot.querySelector("#platecontextmenu"),
      ce: this.shadowRoot.querySelector("#cecontextmenu"),
      add: this.shadowRoot.querySelector("#addincontext"),
    };
    // wire up our in context add button
    this.contextMenus.add.addEventListener(
      "click",
      this._addInContextClick.bind(this)
    );
    // track and store range on mouse up. this helps w/ Safari focus selection
    // issues as well as any "tap" event from a phone knowing what text
    // WAS selected prior to an operation that might lose focus / selection
    // during the workflow like replacing an element in context / inline
    this.shadowRoot.querySelector("slot").addEventListener("mouseup", (e) => {
      if (!this.openDrawer && this.editMode) {
        setTimeout(() => {
          const tmp = HAXStore.getSelection();
          HAXStore._tmpSelection = tmp;
          HAXStore.haxSelectedText = tmp.toString();
          try {
            const range = HAXStore.getRange();
            if (range.cloneRange) {
              HAXStore._tmpRange = range.cloneRange();
            }
          } catch (e) {
            console.warn(e);
          }
        }, 10);
      }
    });
    // in case we miss this on the initial setup. possible in auto opening environments.
    this.editMode = HAXStore.editMode;
    // ensure this resets every append
    this.__tabTrap = false;
    this.__ready = true;
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
  }
  /**
   * Handle adding an item in context based on where the context add
   * was set to follow
   */
  _addInContextClick(e) {
    // break mouse trap so we auto focus the insert
    this.__mouseDown = false;
    let tag = "p";
    // special case for lists nested in lists to make sure we don't get
    // stuck placing a P into a ul
    if (
      ["ul", "ol"].includes(this.__activeHover.parentNode.tagName.toLowerCase())
    ) {
      this.__activeHover = this.__activeHover.parentNode;
    }
    // active will be set via this
    this.haxInsert(tag, "", {}, this.__activeHover);
    // drop active hover to reset state
    this.__activeHover = null;
    this._hideContextMenu(this.contextMenus.add);
  }
  /**
   * LitElement life cycle - properties changed callback
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "editMode") {
        this._editModeChanged(this[propName], oldValue);
        if (this[propName]) {
          this._activeNodeChanged(this.activeNode);
          this.activeNode.focus();
        }
      }
      if (propName == "globalPreferences") {
        this._globalPreferencesUpdated(this[propName], oldValue);
      }
      if (propName == "activeNode" && this.__ready) {
        this._activeNodeChanged(this[propName], oldValue);
      }
    });
    if (super.updated) {
      super.updated(changedProperties);
    }
  }

  /**
   * HTMLElement
   */
  connectedCallback() {
    super.connectedCallback();
    // mutation observer that ensures state of hax applied correctly
    this._observer = new MutationObserver((mutations) => {
      var mutFind = false;
      if (
        !this.__ignoreActive &&
        !this.__dragMoving &&
        !this.undoStackIgnore &&
        !this.__fakeEndCap
      ) {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach((node) => {
              if (this._validElementTest(node)) {
                // notice the slot being set during an enter event
                // and ensure we replicate it
                if (this.__slot) {
                  node.setAttribute("slot", this.__slot);
                  this.__slot = null;
                }
                // force images to NOT be draggable as we will manage D&D
                if (node.tagName === "IMG") {
                  node.setAttribute("draggable", false);
                }
                // trap for user hitting the outdent / indent keys or tabbing
                // browser will try and wrap text in a span when it's added to
                // the top level of the document (for no reason)
                if (this.__indentTrap) {
                  // span should not be created, we want a paragraph for this
                  if (node.tagName === "SPAN") {
                    if (node.parentNode === this) {
                      this.haxChangeTagName(node, "p", true);
                    } else if (node.parentNode.tagName === "LI") {
                      node.parentNode.innerHTML = node.textContent;
                    }
                  }
                  // we don't want BR's injected at top of body area
                  else if (node.tagName === "BR") {
                    node.remove();
                  }
                }
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
                    detail: { node: node },
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
                // special trap for BR being added into the page
                // this avoids empty elements however we don't want it to trigger
                // active to change
                if (!this.___moveLock && !mutFind) {
                  mutFind = true;
                  HAXStore.activeNode = node;
                  if (node.tagName === "BR") {
                    const tmp = HAXStore.getSelection();
                    HAXStore._tmpSelection = tmp;
                    HAXStore.haxSelectedText = tmp.toString();
                    const rng = HAXStore.getRange();
                    if (
                      rng.collapsed &&
                      this.activeNode.tagName === "BR" &&
                      this.activeNode.parentNode ===
                        rng.commonAncestorContainer &&
                      this.activeNode.innerText === ""
                    ) {
                      HAXStore.activeNode = this.activeNode.parentNode;
                    }
                  }
                } else {
                  this.___moveLock = false;
                }
              }
            });
            if (this.__indentTrap) {
              setTimeout(() => {
                this.__indentTrap = false;
              }, 0);
            }
          }
          // if we dropped nodes via the UI (delete event basically)
          if (mutation.removedNodes.length > 0) {
            // handle removing items... not sure we need to do anything here
            mutation.removedNodes.forEach((node) => {
              if (
                this._validElementTest(node) &&
                !node.classList.contains("hax-active")
              ) {
                this.dispatchEvent(
                  new CustomEvent("hax-body-tag-removed", {
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                    detail: { node: node },
                  })
                );
              }
            });
          }
        });
      }
      // our undo/redo history is being applied. Make sure events
      // are bound but that we don't actively track other changes
      // or it'll poisen our undo stack
      else if (this.undoStackIgnore) {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach((node) => {
              // valid element to apply state to
              if (this._validElementTest(node)) {
                // make it editable / drag/drop capable
                setTimeout(() => {
                  this.__applyNodeEditableState(node, this.editMode);
                }, 0);
              }
            });
          }
        });
      } else if (this.__ignoreActive) {
        this.__ignoreActive = false;
      }
    });
    this._observer.observe(this, {
      childList: true,
      subtree: true,
    });
    window.addEventListener("keydown", this._onKeyDown.bind(this));
    window.addEventListener("keypress", this._onKeyPress.bind(this));
    document.body.addEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
    window.addEventListener("scroll", this._keepContextVisible.bind(this), {
      passive: true,
    });
    window.addEventListener("resize", this._keepContextVisible.bind(this), {
      passive: true,
    });
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
        if (this.contextMenus.text.classList.contains("hax-context-visible")) {
          el = this.contextMenus.text;
        } else if (
          this.contextMenus.ce.classList.contains("hax-context-visible")
        ) {
          el = this.contextMenus.ce;
        }
        // if we see it, ensure we don't have the pin
        if (el) {
          if (this.elementMidViewport()) {
            el.classList.add("hax-context-pin-top");
            this.contextMenus.plate.classList.add("hax-context-pin-top");
          } else {
            el.classList.remove("hax-context-pin-top");
            this.contextMenus.plate.classList.remove("hax-context-pin-top");
          }
          this.positionContextMenus();
        }
      }, 100);
    }
  }
  _onKeyDown(e) {
    // make sure we don't have an open drawer, and editing, and we are not focused on tray
    if (
      !this.openDrawer &&
      this.editMode &&
      document.activeElement.tagName !== "HAX-TRAY"
    ) {
      // if we are NOT editing and delete key is hit, delete the element
      if (!this.getAttribute("contenteditable")) {
        switch (e.key) {
          case "Delete":
            this.haxDeleteNode(this.activeNode);
            break;
        }
      } else {
        this.__dropActiveVisible();
        this.__manageFakeEndCap(false);
        let sel = HAXStore.getSelection();
        if (sel.anchorNode != null) {
          switch (e.key) {
            case "Z":
            case "z":
              // trab for undo / redo
              if (e.ctrlKey) {
                if (e.shiftKey) {
                  this.redo();
                } else {
                  this.undo();
                }
                if (e.detail.keyboardEvent) {
                  e.detail.keyboardEvent.preventDefault();
                  e.detail.keyboardEvent.stopPropagation();
                  e.detail.keyboardEvent.stopImmediatePropagation();
                }
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
              }
              break;
            case "Tab":
              if (HAXStore.isTextElement(this.activeNode)) {
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
              this.__slot = this.activeNode.getAttribute("slot");
              this.setAttribute("contenteditable", true);
              if (
                this.activeNode.tagName === "P" &&
                ["1", "#", "`", ">", "-", "!"].includes(
                  this.activeNode.textContent[0]
                )
              ) {
                // ensure the "whitespace character" has been replaced w/ a normal space
                const guess = this.activeNode.textContent.replaceAll(/ /g, " ");
                // ensures that the user has done a matching action and a " " spacebar to ensure they
                // are ready to commit the action
                this.keyboardShortCutProcess(guess);
              }
              break;
            case "Backspace":
            case "Delete":
              this.__deleteItKey = true;
            case "ArrowUp":
            case "ArrowDown":
            case "ArrowLeft":
            case "ArrowRight":
              setTimeout(() => {
                const tmp = HAXStore.getSelection();
                HAXStore._tmpSelection = tmp;
                HAXStore.haxSelectedText = tmp.toString();
                const rng = HAXStore.getRange();
                if (
                  rng.commonAncestorContainer &&
                  this.activeNode !== rng.commonAncestorContainer &&
                  typeof rng.commonAncestorContainer.focus === "function"
                ) {
                  if (rng.commonAncestorContainer.tagName !== "HAX-BODY") {
                    if (HAXStore.isTextElement(rng.commonAncestorContainer)) {
                      this.setAttribute("contenteditable", true);
                    } else {
                      this.removeAttribute("contenteditable");
                    }
                    rng.commonAncestorContainer.focus();
                    this.__focusLogic(rng.commonAncestorContainer, false);
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
                    rng.commonAncestorContainer.parentNode.tagName !==
                    "HAX-BODY"
                  ) {
                    if (
                      HAXStore.isTextElement(
                        rng.commonAncestorContainer.parentNode
                      )
                    ) {
                      this.setAttribute("contenteditable", true);
                    } else {
                      this.removeAttribute("contenteditable");
                    }

                    rng.commonAncestorContainer.parentNode.focus();
                    this.__focusLogic(
                      rng.commonAncestorContainer.parentNode,
                      false
                    );
                  } else {
                    rng.commonAncestorContainer.focus();
                    this.__focusLogic(rng.commonAncestorContainer, false);
                  }
                }
              }, 0);
              break;
            default:
              // we only care about contextual ops in a paragraph
              // delay a micro-task to ensure activenode's innerText is set
              setTimeout(() => {
                if (
                  this.activeNode.tagName === "P" &&
                  ["1", "#", "`", ">", "-", "!"].includes(
                    this.activeNode.textContent[0]
                  )
                ) {
                  // ensure the "whitespace character" has been replaced w/ a normal space
                  const guess = this.activeNode.textContent.replaceAll(
                    / /g,
                    " "
                  );
                  // ensures that the user has done a matching action and a " " spacebar to ensure they
                  // are ready to commit the action
                  if (guess[guess.length - 1] === " ") {
                    this.keyboardShortCutProcess(guess);
                  }
                }
              }, 0);
              break;
          }
        }
      }
    }
  }
  keyboardShortCutProcess(guess) {
    // look for advanced detections for contextual operations
    let map = {
      "#": "h2",
      "##": "h3",
      "###": "h4",
      "####": "h5",
      "#####": "h6",
      "-": "ul",
      "1.": "ol",
      "---": "hr",
      "```": "code",
      ">": "blockquote",
    };
    // see if our map matches
    if (map[guess.replace(" ", "")]) {
      let el = document.createElement(map[guess.replace(" ", "")]);
      // silly thing for contenteditable to show it as full space height
      el.innerHTML = "<br />";
      if (["UL", "OL"].includes(el.tagName)) {
        el.innerHTML = "<li></li>";
      }
      this.haxReplaceNode(this.activeNode, el);
      this.__focusLogic(el);
      // breaks should jump just PAST the break
      // and add a p since it's a divider really
      if (el.tagName === "HR") {
        // then insert a P which will assume active status
        this.haxInsert("p", "", {});
      }
    }
    // look for wildcard / web component pro insert mode
    else if (guess[0] === "!") {
      let tag = guess.replace("!", "").replaceAll(/ /g, "");
      // see if this exists
      if (HAXStore.elementList[tag]) {
        // generate schema from the tag
        let schema = HAXStore.haxSchemaFromTag(tag);
        let target;
        if (schema.gizmo.tag && schema.demoSchema && schema.demoSchema[0]) {
          target = haxElementToNode(schema.demoSchema[0]);
        } else {
          target = document.createElement(tag);
        }
        this.haxReplaceNode(this.activeNode, target);
        this.__focusLogic(target);
      } else {
        // do nothing, we tried to be a pro but failed :(
        HAXStore.toast(`${tag} is not a valid tag`);
      }
    }
  }
  _onKeyPress(e) {
    clearTimeout(this.__keyPress);
    this.__keyPress = setTimeout(() => {
      if (
        !this.openDrawer &&
        this.editMode &&
        this.activeNode &&
        HAXStore.isTextElement(this.activeNode)
      ) {
        // If the user has paused for awhile, show the menu
        clearTimeout(this.__positionContextTimer);
        this.__positionContextTimer = setTimeout(() => {
          // always on active if we were just typing
          this.__addActiveVisible();
          this.positionContextMenus();
        }, 2500);
      }
    }, 50);
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
      this.__focusLogic(p);
      if (this.activeNode.parentNode) {
        this.activeNode.parentNode.setAttribute("contenteditable", true);
      }
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
      typeof HAXStore.elementList[element.tag] !== typeof undefined &&
      HAXStore.elementList[element.tag].gizmo !== false &&
      typeof HAXStore.elementList[element.tag].gizmo.handles !==
        typeof undefined &&
      HAXStore.elementList[element.tag].gizmo.handles.length > 0
    ) {
      // get the haxProperties for this item
      let gizmo = HAXStore.elementList[element.tag].gizmo;
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
    let haxElements = HAXStore.guessGizmo(type, props, skipPropMatch);
    // see if we got anything
    if (haxElements.length > 0) {
      // hand off to hax-app-picker to deal with the rest of this
      let tag = activeNode.tagName.toLowerCase();
      let humanName = tag.replace("-", " ");
      if (
        typeof HAXStore.elementList[tag] !== typeof undefined &&
        HAXStore.elementList[tag].gizmo !== false
      ) {
        humanName = HAXStore.elementList[tag].gizmo.title;
      }
      if (!testOnly) {
        HAXStore.activePlaceHolder = this.activeNode;
        HAXStore.haxAppPicker.presentOptions(
          haxElements,
          "__convert",
          `Transform ${humanName} to..`,
          "gizmo"
        );
      }
    } else {
      if (!testOnly) {
        HAXStore.toast("Sorry, this can not be transformed!", 5000);
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
  haxInsert(tag, content, properties = {}, active = this.activeNode) {
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
      let attributeName = camelToDash(property);
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
      HAXStore.activePlaceHolder !== null &&
      typeof HAXStore.activePlaceHolder.style !== typeof undefined
    ) {
      // replicate styles so that it doesn't jar the UI
      newNode.style.width = HAXStore.activePlaceHolder.style.width;
      newNode.style.float = HAXStore.activePlaceHolder.style.float;
      newNode.style.margin = HAXStore.activePlaceHolder.style.margin;
      newNode.style.display = HAXStore.activePlaceHolder.style.display;
      this.haxReplaceNode(HAXStore.activePlaceHolder, newNode);
      HAXStore.activePlaceHolder = null;
    }
    // insert at active insert point if we have one
    else if (active.parentNode != null) {
      // allow for inserting things into things but not grid plate
      if (active.parentNode.tagName === "GRID-PLATE") {
        if (active.getAttribute("slot") != null) {
          newNode.setAttribute("slot", active.getAttribute("slot"));
        }
        // special in context add for grids
        if (this.__addAbove) {
          active.parentNode.insertBefore(newNode, active);
        } else {
          active.parentNode.insertBefore(newNode, active.nextElementSibling);
        }
      } else {
        if (active.parentNode && active.parentNode.nextElementSibling) {
          active.parentNode.nextElementSibling.parentNode.insertBefore(
            newNode,
            active.parentNode.nextElementSibling
          );
        } else if (active.parentNode && active.nextElementSibling) {
          if (this.__addAbove) {
            active.parentNode.insertBefore(newNode, active);
          } else {
            active.parentNode.insertBefore(newNode, active.nextElementSibling);
          }
          // test for the LAST item in a group, insert at top and it'll flow to the end
        } else if (
          active.parentNode &&
          active.parentNode.children[active.parentNode.children.length - 1] ===
            active
        ) {
          if (this.__addAbove) {
            active.parentNode.insertBefore(newNode, active);
          } else {
            active.parentNode.appendChild(newNode);
          }
        } else if (active.parentNode) {
          active.parentNode.insertBefore(newNode, active);
        } else {
          // something odd happened let's just make sure we insert this safely
          this.appendChild(newNode);
        }
      }
    } else {
      // send this into the root, which should filter it back down into the slot
      this.appendChild(newNode);
    }
    this.contextMenus.text.hasSelectedText = false;
    setTimeout(() => {
      this.__focusLogic(newNode);
      // wait so that the DOM can have the node to then attach to
      this.scrollHere(newNode);
    }, 0);
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
    HAXStore.activeNode = null;
    let children =
      this.shadowRoot.querySelector("#body").localName === "slot"
        ? this.shadowRoot.querySelector("#body").assignedNodes({
            flatten: true,
          })
        : [];
    var content = "";
    for (var i = 0, len = children.length; i < len; i++) {
      // some mild front-end sanitization
      if (this._validElementTest(children[i])) {
        children[i].removeAttribute("data-hax-ray");
        // remove some of the protected classes though they shouldn't leak through
        children[i].classList.remove("hax-hovered");
        children[i].contentEditable = false;
        content += HAXStore.nodeToContent(children[i]);
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
      let tags = HAXStore.validTagList;
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
    HAXStore.activeNode = __active;
    // oh one last thing. escape all script/style tags
    content = encapScript(content);
    return content;
  }
  /**
   * Duplicate node into the local DOM below the current item if we can.
   */
  haxDuplicateNode(node) {
    // convert the node to a hax element
    let haxElement = nodeToHaxElement(node, null);
    var props = HAXStore.elementList[node.tagName.toLowerCase()];
    // support for tag defining which properties NOT to save
    // for simplification, everything is an attribute during this
    // operation
    if (
      typeof props !== typeof undefined &&
      typeof props.saveOptions.unsetAttributes !== typeof undefined
    ) {
      for (var i in props.saveOptions.unsetAttributes) {
        if (haxElement.properties[props.saveOptions.unsetAttributes[i]]) {
          delete haxElement.properties[props.saveOptions.unsetAttributes[i]];
        }
      }
    }
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
      properties: haxElement.properties,
    });
    if (
      nodeClone.tagName.toLowerCase() === "webview" &&
      HAXStore._isSandboxed &&
      typeof nodeClone.guestinstance !== typeof undefined
    ) {
      delete nodeClone.guestinstance;
    }
    // shouldn't be possible but might as well check
    if (node !== null) {
      node.parentNode.insertBefore(nodeClone, node.nextSibling);
    } else {
      node.parentNode.appendChild(nodeClone);
    }
    HAXStore.activeNode = nodeClone;
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
    this._hideContextMenu(this.contextMenus.text);
    this._hideContextMenu(this.contextMenus.ce);
    this._hideContextMenu(this.contextMenus.add);
    this.__activeHover = null;
    // secondary menus and clean up areas
    if (hidePlate) {
      this._hideContextMenu(this.contextMenus.plate);
    }
  }
  /**
   * Reposition context menus to match an element.
   */
  positionContextMenus(node = this.activeNode) {
    // sanity chekc and ensure we are not told to lock position of all menus
    clearTimeout(this.__positionContextTimer);
    this.__positionContextTimer = setTimeout(() => {
      if (
        node &&
        node.tagName &&
        !HAXStore._lockContextPosition &&
        this.__ready
      ) {
        // menu width starts out w/ the plate context which is a set size
        let menuWidth = 140;
        let tag = node.tagName.toLowerCase();
        if (HAXStore._isSandboxed && tag === "webview") {
          tag = "iframe";
        }
        let props = HAXStore.elementList[tag];
        // try and work against anything NOT a P tag
        if (
          typeof props !== typeof undefined &&
          !HAXStore.isTextElement(node)
        ) {
          this._hideContextMenu(this.contextMenus.text);
          props.element = node;
          this._positionContextMenu(this.contextMenus.ce, node, 0, -28);
          menuWidth += 28;
        } else {
          this._hideContextMenu(this.contextMenus.ce);
          this._positionContextMenu(this.contextMenus.text, node, 0, -28);
          // text menu can expand based on selection
          let textRect = this.contextMenus.text.getBoundingClientRect();
          menuWidth += textRect.width;
        }
        let activeRect = node.getBoundingClientRect();
        // hide menu if we have active on a list item
        // special case because it should not be moved anywhere or have these
        // operations shown as it only makes sense as part of something larger
        // ul / ol which I believe is the ONLY tag that works this way
        if (
          this.activeNode.tagName === "LI" ||
          this._HTMLInlineTextDecorationTest(this.activeNode)
        ) {
          this._hideContextMenu(this.contextMenus.plate);
        }
        // need to account for the item being small than the menu
        else if (Math.round(menuWidth) >= Math.round(activeRect.width)) {
          this._positionContextMenu(this.contextMenus.plate, node, 0, -56);
        } else {
          this._positionContextMenu(
            this.contextMenus.plate,
            node,
            activeRect.width -
              this.contextMenus.plate.getBoundingClientRect().width +
              1,
            -26
          );
        }
        // special case for node not matching container yet it being editable
        if (node && node.tagName !== "HR" && !HAXStore.isTextElement(node)) {
          node.removeAttribute("contenteditable");
        } else if (node) {
          node.setAttribute("contenteditable", true);
        }
      }
    }, 50);
  }
  /**
   * No idea how to describe these name wise but basically we want to only
   * show the menus when we need them. This toggle allows us the ability
   * to hide the context menus while the user is engaged in typing or
   * other actions where the in-context menus are distracting
   */
  __addActiveVisible() {
    for (var i in this.contextMenus) {
      if (i != "add" || this.__activeHover) {
        this.contextMenus[i].classList.add("hax-context-menu-active");
      }
    }
  }
  __dropActiveVisible() {
    for (var i in this.contextMenus) {
      this.contextMenus[i].classList.remove("hax-context-menu-active");
    }
    // force hiding add menu
    this.__activeHover = null;
    this._hideContextMenu(this.contextMenus.add);
  }
  /**
   * Move grid plate around
   */
  haxMoveGridPlate(direction, node) {
    // menu is actually in the element for render purposes
    // support moving things multiple directions
    this.___moveLock = true;
    switch (direction) {
      case "up":
        // ensure we can go up
        if (node.previousElementSibling !== null) {
          node.parentNode.insertBefore(node, node.previousElementSibling);
        }
        break;
      case "down":
        if (node.nextElementSibling !== null) {
          node.parentNode.insertBefore(node.nextElementSibling, node);
        }
        break;
    }
    this.scrollHere(node);
    this.positionContextMenus(node);
    return true;
  }
  /**
   * Inject / modify a grid plate where something currently lives
   */
  async haxGridPlateOps(add = true, side = "right", node = this.activeNode) {
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
            await node.childNodes.forEach((el) => {
              // verify its a tag
              if (el.tagName) {
                // remove slot name
                cloneEl = el.cloneNode(true);
                if (node.getAttribute("slot")) {
                  cloneEl.setAttribute("slot", node.getAttribute("slot"));
                } else {
                  cloneEl.removeAttribute("slot");
                }
                node.parentNode.insertBefore(cloneEl, node);
              }
            });
            // whatever was moved out last use as active now
            HAXStore.activeNode = cloneEl;
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
        let right = this.contextMenus.plate.shadowRoot.querySelector("#right");
        let rightremove = this.contextMenus.plate.shadowRoot.querySelector(
          "#rightremove"
        );
        right.disabled = false;
        rightremove.disabled = false;
        if (node.layout == "1-1-1-1-1-1") {
          right.disabled = true;
        }
        if (side == "left") {
          node.childNodes.forEach((el) => {
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
      if (node.getAttribute("slot")) {
        grid.setAttribute("slot", node.getAttribute("slot"));
      }
      let col = "2";
      if (side == "right") {
        col = "1";
      }
      let tmp = node.cloneNode(true);
      tmp.setAttribute("slot", "col-" + col);
      grid.appendChild(tmp);
      node.parentNode.insertBefore(grid, node);
      setTimeout(() => {
        node.remove();
      }, 0);
    }
    // edge case where we need to force form to update
    HAXStore.haxTray.refreshActiveNodeForm();
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
      if (!node.replaceWith && HAXStore._tmpRange) {
        node = HAXStore._tmpRange;
        HAXStore._tmpRange = null;
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
  haxChangeTagName(node, tagName, maintainContent = true) {
    // Create a replacement tag of the desired type
    var replacement = document.createElement(tagName);
    // Grab all of the original's attributes, and pass them to the replacement
    for (var i = 0, l = node.attributes.length; i < l; ++i) {
      let nodeName = node.attributes.item(i).nodeName;
      let value = node.attributes.item(i).value;
      try {
        replacement.setAttribute(nodeName, value);
      } catch (e) {
        console.warn(node.attributes);
        console.warn(e);
      }
    }
    // Persist contents
    // account for empty list and ordered list items
    if (maintainContent) {
      replacement.innerHTML = node.innerHTML.trim();
    } else {
      replacement.innerHTML = "<br />";
    }
    if (tagName == "ul" || tagName == "ol") {
      if (replacement.innerHTML == "<br />") {
        replacement.innerHTML = "<li><br /></li>";
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
      if (maintainContent) {
        // focus on the thing switched to
        setTimeout(() => {
          let children = replacement.children;
          // see if there's a child element and focus that instead if there is
          if (children[0] && children.tagName) {
            children[0].focus();
          } else {
            replacement.focus();
          }
        }, 10);
      }
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
  haxDeleteNode(node) {
    if (node.previousElementSibling) {
      HAXStore.activeNode = node.previousElementSibling;
    } else if (node.nextElementSibling) {
      HAXStore.activeNode = node.nextElementSibling;
    } else {
      // implies nothing; let's not allow NOTHING as it breaks user context
      this.haxInsert("p", "", {});
      try {
        var range = document.createRange();
        var sel = HAXStore.getSelection();
        range.setStart(this.activeNode, 0);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        this.activeNode.focus();
      } catch (e) {
        console.warn(e);
      }
    }
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
    html = encapScript(html);
    let fragment = document.createElement("div");
    fragment.insertAdjacentHTML("beforeend", html);
    while (fragment.firstChild !== null) {
      if (typeof fragment.firstChild.tagName !== typeof undefined) {
        // ensure import doesn't import non-sandbox safe things!
        if (
          HAXStore._isSandboxed &&
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
        HAXStore.activeNode = this.haxChangeTagName(
          this.activeNode,
          detail.value
        );
        this.positionContextMenus();
        break;
      case "text-tag-ul":
        // trigger the default selected value in context menu to match
        this.contextMenus.text.realSelectedValue = "ul";
        HAXStore.activeNode = this.haxChangeTagName(this.activeNode, "ul");
        this.positionContextMenus();
        break;
      case "text-tag-ol":
        // trigger the default selected value in context menu to match
        this.contextMenus.text.realSelectedValue = "ol";
        HAXStore.activeNode = this.haxChangeTagName(this.activeNode, "ol");
        this.positionContextMenus();
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
        this.haxGridPlateOps();
        break;
      case "hax-plate-remove-right":
        this.haxGridPlateOps(false);
        break;
      // duplicate the active item or container
      case "hax-plate-duplicate":
        this.haxDuplicateNode(this.activeNode);
        break;
      case "hax-plate-delete":
        if (this.activeNode != null) {
          this.haxDeleteNode(this.activeNode);
        }
        break;
      case "hax-plate-up":
        this.haxMoveGridPlate("up", this.activeNode);
        break;
      case "hax-plate-down":
        this.haxMoveGridPlate("down", this.activeNode);
        break;
    }
  }
  /**
   * Item has gained focus, change active element to match
   */
  _focusIn(e) {
    if (!this.__mouseDown) {
      if (this.__focusLogic(e.target)) {
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }
  }
  /**
   * Focus a target and update the data model to reflect this.
   * This helps ensure that keyboard and non click based focusing
   * registers the same as click events
   * @param target object - dom node to focus on
   * @param autoFocus boolean - whether to auto focus / place cursor
   */
  __focusLogic(target, autoFocus = true) {
    let stopProp = false;
    // only worry about these when we are in edit mode
    // and there is no drawer open
    if (!this.openDrawer && this.editMode && !this.__tabTrap) {
      let containerNode = target;
      // edge case, thing selected is inside a paragraph tag
      // HTML is stupid and allows this
      if (
        containerNode.tagName === "SPAN" &&
        HAXStore.isTextElement(containerNode.parentNode) &&
        containerNode.parentNode.getAttribute("slot") == ""
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
        // of the document unless we have a special common case
        // where we have a valid element yet the parent is a paragraph
        if (
          containerNode.parentNode.tagName === "P" &&
          containerNode.parentNode.getAttribute("slot") == ""
        ) {
          activeNode = containerNode;
          stopProp = true;
        } else {
          while (
            containerNode.parentNode &&
            containerNode.parentNode.tagName &&
            containerNode.parentNode.tagName != "HAX-BODY"
          ) {
            // make sure active is set after closest legit element
            if (
              activeNode === null &&
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
          else if (!HAXStore.isGridPlateElement(containerNode)) {
            activeNode = containerNode;
          }
        }
        // ensure this is a tag we care about / have support for and
        // that it is a new value
        if (
          this.activeNode &&
          this.activeNode.parentNode !== containerNode &&
          !containerNode.classList.contains("ignore-activation")
        ) {
          stopProp = true;
        } else if (containerNode.classList.contains("ignore-activation")) {
          stopProp = true;
        }
        // test for ignore edge case
        if (!activeNode.classList.contains("ignore-activation")) {
          HAXStore.activeNode = activeNode;
          setTimeout(() => {
            if (
              autoFocus &&
              !this.__mouseDown &&
              HAXStore.isTextElement(activeNode)
            ) {
              try {
                var range = document.createRange();
                var sel = HAXStore.getSelection();
                range.setStart(this.activeNode, 0);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
                this.activeNode.focus();
              } catch (e) {
                console.warn(e);
              }
            }
            this.positionContextMenus(activeNode);
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
   * Simple utility to do nice scrolling or only scroll if we can't see it
   * as that is better behavior but not in all browsers
   */
  scrollHere(node) {
    // scroll to it w/ timing delay as this uses resources
    // and we want to ensure it's in the next micro-task
    setTimeout(() => {
      if (typeof node.scrollIntoViewIfNeeded === "function") {
        node.scrollIntoViewIfNeeded(true);
      } else {
        node.scrollIntoView({
          behavior: "smooth",
          inline: "center",
        });
      }
    }, 0);
  }
  undo() {
    super.undo();
    setTimeout(() => {
      let active = this.querySelector(".hax-active");
      if (active) {
        this.__focusLogic(active);
        this.scrollHere(active);
      } else {
        this.hideContextMenus();
      }
    }, 0);
  }
  redo() {
    super.redo();
    setTimeout(() => {
      let active = this.querySelector(".hax-active");
      if (active) {
        this.__focusLogic(active);
        this.scrollHere(active);
      } else {
        this.hideContextMenus();
      }
    }, 0);
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
        if (this.children && this.children[0] && this.children[0].focus) {
          this.__focusLogic(this.children[0]);
        } else {
          this.haxInsert("p", "", {});
          try {
            var range = document.createRange();
            var sel = HAXStore.getSelection();
            range.setStart(this.activeNode, 0);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
            this.activeNode.focus();
          } catch (e) {
            console.warn(e);
          }
        }
      }
      // force a reset when we start editing
      // the delay gives HAX / HAX endpoints some room to manipulate the DOM first
      setTimeout(() => {
        this.undoStack.undoStackLimit = 20;
        this.undoStack.undoStackPosition = -1;
        this.undoStack.commands = [];
        // execute once just to get these values
        this.undoStack.changed();
        // reset initial value to avoid some state management issues
        this.undoStackInitialValue = this.innerHTML;
        this.undoStackPrevValue = this.undoStackInitialValue;
      }, 0);
    }
    // hide menus when state changes
    if (newValue == false) {
      this.removeAttribute("contenteditable");
      this.hideContextMenus();
      // clean up for nested items we might miss
      this.querySelectorAll("[contenteditable],.hax-active").forEach((el) => {
        el.removeAttribute("contenteditable");
        el.classList.remove("hax-active");
      });
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
    // ignore hax internal tags
    // search results can be drag'ed from their panel for exact placement
    // special place holder in drag and drop
    if (
      node.tagName &&
      !["HAX-BODY", "HAX-APP-SEARCH-RESULT", "FAKE-HAX-BODY-END"].includes(
        node.tagName
      )
    ) {
      // special case of SPAN as it can often get embedded places without actually
      // being the thing that should grad actual block level focus
      // this would be like a B or I tag grabbing focus as well
      if (
        this._HTMLInlineTextDecorationTest(node) &&
        node.parentNode != "HAX-BODY"
      ) {
        return false;
      }
      return true;
    }
    return false;
  }
  /**
   * test for inline tags
   */
  _HTMLInlineTextDecorationTest(node) {
    return ["span", "b", "strong", "i", "em"].includes(
      node.tagName.toLowerCase()
    );
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
    let i = HAXStore.gizmoList.findIndex((j) => {
      if (j) {
        return j.tag === node.tagName.toLowerCase();
      }
    });
    if (i !== -1) {
      haxRay = HAXStore.gizmoList[i].title;
    }
    // oooooo snap, drag and drop..
    if (status) {
      node.setAttribute("data-hax-ray", haxRay);
      listenerMethod = "addEventListener";
    } else {
      node.removeAttribute("data-hax-ray");
      listenerMethod = "removeEventListener";
    }
    node[listenerMethod]("drop", this.dropEvent.bind(this));
    node[listenerMethod]("dragenter", this.dragEnter.bind(this));
    node[listenerMethod]("dragleave", this.dragLeave.bind(this));
    node[listenerMethod]("dragover", (e) => {
      this.__dragMoving = true;
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
          } else {
            links[j].removeAttribute("contenteditable");
          }
          links[j][listenerMethod]("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
          });
        }
      }
    }
  }
  /**
   * Refine the stack logic so that visual class markers
   * do not bleed over into state changes
   */
  undoManagerStackLogic(mutations) {
    if (!this.__dragMoving) {
      this.querySelectorAll(".hax-hovered").forEach((el) => {
        el.classList.remove("hax-hovered");
      });
      super.undoManagerStackLogic(mutations);
    }
  }
  /**
   * Drop an item onto another
   */
  dropEvent(e) {
    if (!this.openDrawer && this.editMode) {
      this.__dragMoving = false;
      // make sure that IF we had mutations they don't fire till AFTER
      // this prevents issues where the mutation record was combined
      // and then blocked because of being moved
      this.undoManagerStackLogic({});
      // esnure we clear the gravity scrolling drag effect
      clearTimeout(gravityScrollTimer);
      HAXStore._lockContextPosition = false;
      // trick the tray into forcing active to be Configure
      HAXStore.haxTray.activeTab = "item-1";
      var target = null;
      if (
        e.target.closest("grid-plate") &&
        e.target.parentNode != e.target.closest("grid-plate")
      ) {
        target = e.target.closest("grid-plate");
      } else if (e.target.closest("[contenteditable],img")) {
        target = e.target.closest("[contenteditable],img");
      } else if (e.originalTarget) {
        target = e.originalTarget;
      } else {
        target = e.target;
      }
      // account for slot drop on a place holder
      if (e.path[0].classList.contains("column")) {
        this.__slot = e.path[0].getAttribute("id").replace("col", "col-");
      } else if (target.getAttribute("slot")) {
        this.__slot = target.getAttribute("slot");
      }
      // establish an activeNode /container based on drop poisition
      HAXStore.activeNode = target;
      // walk the children and remove the draggable state needed
      this.querySelectorAll(".hax-hovered").forEach((el) => {
        el.classList.remove("hax-hovered");
      });
      // remove grid-plate drops
      this.querySelectorAll(".active").forEach((el) => {
        el.classList.remove("active");
      });
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
              detail: e,
            })
          );
        } else {
          // set taget based on drag target
          target = HAXStore.__dragTarget;
          var local = e.target;
          if (
            e.target.closest("grid-plate") &&
            e.target.parentNode != e.target.closest("grid-plate")
          ) {
            local = e.target.closest("grid-plate");
          } else if (e.target.closest("[contenteditable],img")) {
            local = e.target.closest("[contenteditable],img");
          }
          // if we have a slot on what we dropped into then we need to mirror that item
          // and place ourselves below it in the DOM
          if (
            local &&
            target &&
            this._validElementTest(target) &&
            target !== local
          ) {
            // incase this came from a grid plate, drop the slot so it works
            try {
              if (
                !["GRID-PLATE", "HAX-BODY"].includes(local.tagName) ||
                e.path[0].tagName === "GRID-PLATE"
              ) {
                if (local.getAttribute("slot")) {
                  target.setAttribute("slot", local.getAttribute("slot"));
                } else if (e.path[0].classList.contains("column")) {
                  target.setAttribute(
                    "slot",
                    e.path[0].getAttribute("id").replace("col", "col-")
                  );
                } else {
                  target.removeAttribute("slot");
                }
                local.parentNode.insertBefore(target, local);
              } else {
                if (e.path[0].classList.contains("column")) {
                  target.setAttribute(
                    "slot",
                    e.path[0].getAttribute("id").replace("col", "col-")
                  );
                }
                // account for drop target of main body yet still having a slot attr
                else if (
                  local.tagName === "HAX-BODY" &&
                  target.getAttribute("slot")
                ) {
                  target.removeAttribute("slot");
                }
                local.appendChild(target);
              }
            } catch (e) {
              console.warn(e);
            }
            // ensure that if we caught this event we process it
            e.preventDefault();
            e.stopPropagation();
          }
          // position arrows / set focus in case the DOM got updated above
          if (
            target &&
            this._validElementTest(target) &&
            typeof target.focus === "function"
          ) {
            HAXStore.activeNode = target;
            // fire event saying that we dropped an item and gained
            // focus which should prioritize certain actions over a
            // normal focus shift
            this.dispatchEvent(
              new CustomEvent("hax-drop-focus-event", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: this.activeNode,
              })
            );
            this.scrollHere(this.activeNode);
            this.positionContextMenus();
          }
        }
      } catch (e) {
        console.warn(e);
      }
    }
    // reset this after the drop happens
    HAXStore.__dragTarget = null;
    this.__manageFakeEndCap(false);
  }
  /**
   * Enter an element, meaning we've over it while dragging
   */
  dragEnter(e) {
    if (!this.openDrawer && this.editMode && e.target) {
      this.__dragMoving = true;
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
      this.__dragMoving = true;
      e.target.classList.remove("hax-hovered");
    }
  }
  /**
   * React to a new node being set to active.
   */
  async _activeNodeChanged(newValue, oldValue) {
    // remove anything currently with the active class
    await this.querySelectorAll(".hax-active").forEach((el) => {
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
        HAXStore.isTextElement(newValue) ||
        newValue.tagName === "HR" ||
        HAXStore.isGridPlateElement(newValue)
      ) {
        newValue.setAttribute("contenteditable", true);
        this.setAttribute("contenteditable", true);
      } else {
        newValue.removeAttribute("contenteditable");
        this.removeAttribute("contenteditable");
      }
      // why you no position yo?
      this._keepContextVisible();
      this.contextMenus.text.realSelectedValue = tag;
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
    menu.classList.add("hax-context-visible", "hax-context-menu-active");
  }
  /**
   * Simple hide / reset of whatever menu it's handed.
   */
  _hideContextMenu(menu) {
    menu.removeAttribute("on-screen");
    menu.visible = false;
    menu.classList.remove(
      "hax-context-visible",
      "hax-context-pin-top",
      "hax-context-menu-active"
    );
  }
  /**
   * Find the next thing to tab forward to.
   */
  _tabKeyPressed() {
    // try selection / tab block since range can cause issues
    if (this.activeNode && HAXStore.getRange().cloneRange) {
      try {
        let focus = false;
        let node = this.activeNode.parentNode;
        const activeNodeTagName = this.activeNode.parentNode.tagName;
        let range = HAXStore.getRange().cloneRange();
        var tagTest = range.commonAncestorContainer.tagName;
        if (typeof tagTest === typeof undefined) {
          tagTest = range.commonAncestorContainer.parentNode.tagName;
        }
        if (
          ["UL", "OL", "LI"].includes(activeNodeTagName) ||
          ["UL", "OL", "LI"].includes(tagTest)
        ) {
          if (this.polyfillSafe) {
            this.__tabTrap = true;
            this.__indentTrap = true;
            document.execCommand("indent");
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
    // try selection / tab block since range can cause issues
    if (this.activeNode && HAXStore.getRange().cloneRange) {
      try {
        let node = this.activeNode.parentNode;
        const activeNodeTagName = this.activeNode.parentNode.tagName;
        let range = HAXStore.getRange().cloneRange();
        var tagTest = range.commonAncestorContainer.tagName;
        if (typeof tagTest === typeof undefined) {
          tagTest = range.commonAncestorContainer.parentNode.tagName;
        }
        if (
          ["UL", "OL", "LI"].includes(activeNodeTagName) ||
          ["UL", "OL", "LI"].includes(tagTest)
        ) {
          if (this.polyfillSafe) {
            this.__tabTrap = true;
            this.__indentTrap = true;
            document.execCommand("outdent");
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
