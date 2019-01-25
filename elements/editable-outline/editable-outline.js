/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { getRange } from "./lib/shadows-safari.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/editor-icons.js";
import "@lrnwebcomponents/json-outline-schema/json-outline-schema.js";

/**
 * `editable-outline`
 * `a simple outline thats contenteditable in nature`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class EditableOutline extends PolymerElement {
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          font-family: "Noto Serif", serif;
        }

        :host([hidden]) {
          display: none;
        }

        ul,
        ol {
          font-size: 16px;
          line-height: 32px;
          padding-left: 32px;
        }
        li {
          font-size: 16px;
          line-height: 32px;
          padding: 4px;
        }

        li:focus,
        li:active,
        li:hover {
          background-color: #eeeeee;
          outline: 1px solid #cccccc;
        }

        iron-icon {
          pointer-events: none;
        }
      </style>
      <button on-click="buttonEvents" id="down">
        <iron-icon icon="icons:arrow-downward"></iron-icon> Move down
      </button>
      <button on-click="buttonEvents" id="up">
        <iron-icon icon="icons:arrow-upward"></iron-icon> Move up
      </button>
      <button on-click="buttonEvents" id="outdent">
        <iron-icon icon="editor:format-indent-decrease"></iron-icon> Outdent
      </button>
      <button on-click="buttonEvents" id="indent">
        <iron-icon icon="editor:format-indent-increase"></iron-icon> Indent
      </button>
      <button on-click="buttonEvents" id="duplicate">
        <iron-icon icon="icons:content-copy"></iron-icon> Duplicate structure
      </button>

      <ul id="outline" contenteditable$="[[editMode]]">
        <li contenteditable="true"></li>
      </ul>

      <iron-a11y-keys
        target="[[__outlineNode]]"
        keys="shift+tab"
        on-keys-pressed="_tabBackKeyPressed"
        stop-keyboard-event-propagation
      ></iron-a11y-keys>
      <iron-a11y-keys
        target="[[__outlineNode]]"
        keys="tab"
        on-keys-pressed="_tabKeyPressed"
        stop-keyboard-event-propagation
      ></iron-a11y-keys>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * A items list of JSON Outline Schema Items
       */
      items: {
        name: "items",
        type: "Array",
        value: [],
        notify: true
      },
      /**
       * Edit mode
       */
      editMode: {
        name: "editMode",
        type: "Boolean",
        notify: true,
        observer: "_editModeChanged"
      },
      /**
       * Outline node for keyboard key binding
       */
      __outlineNode: {
        name: "__outlineNode",
        type: "Object"
      }
    };
  }
  constructor() {
    super();
    this.polyfillSafe = this.__computePolyfillSafe();
    window.JSONOutlineSchema.requestAvailability();
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "editable-outline";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.__outlineNode = this.$.outline;
    this._observer = new MutationObserver(this._observer.bind(this));
    this._observer.observe(this.__outlineNode, {
      childList: true,
      subtree: true
    });
  }
  /**
   * Mutation observer callback
   * @todo current issue if you copy and paste into the same node
   */
  _observer(record) {
    let reference;
    for (var index in record) {
      let info = record[index];
      if (info.removedNodes.length > 0 && this.__outdent) {
        for (let i in info.removedNodes) {
          if (
            info.removedNodes[i].tagName &&
            info.removedNodes[i].tagName === "LI" &&
            info.removedNodes[i].getAttribute("data-jos-id") !== null
          ) {
            reference.setAttribute(
              "data-jos-id",
              info.removedNodes[i].getAttribute("data-jos-id")
            );
            if (
              info.removedNodes[i].getAttribute("data-jos-location") !== null
            ) {
              reference.setAttribute(
                "data-jos-location",
                info.removedNodes[i].getAttribute("data-jos-location")
              );
            }
            reference = null;
          } else if (
            info.removedNodes[i].tagName === "UL" &&
            info.removedNodes[i].firstChild &&
            info.removedNodes[i].firstChild.tagName === "LI" &&
            info.removedNodes[i].firstChild.getAttribute("data-jos-id") !== null
          ) {
            reference.setAttribute(
              "data-jos-id",
              info.removedNodes[i].firstChild.getAttribute("data-jos-id")
            );
            if (
              info.removedNodes[i].firstChild.getAttribute(
                "data-jos-location"
              ) !== null
            ) {
              reference.setAttribute(
                "data-jos-location",
                info.removedNodes[i].firstChild.getAttribute(
                  "data-jos-location"
                )
              );
            }
            reference = null;
          }
        }
        // ensure there's always a first child node present
        // this way people can't break the interact via mass deleting
        if (!this.$.outline.firstChild) {
          this.$.outline.appendChild(document.createElement("li"));
        }
      }
      // if we've got new nodes to react to that were not imported
      if (info.addedNodes.length > 0) {
        // special rules for an outdent event
        if (this.__outdent) {
          for (let i in info.addedNodes) {
            if (
              info.addedNodes[i].tagName &&
              info.addedNodes[i].tagName === "LI"
            ) {
              reference = info.addedNodes[i];
            }
          }
        } else if (!this.__blockScrub) {
          for (let i in info.addedNodes) {
            if (info.addedNodes[i].tagName) {
              // @todo need to ensure that this isn't the same exact item in the same exact position
              window.JSONOutlineSchema.requestAvailability().scrubElementJOSData(
                info.addedNodes[i]
              );
            }
          }
        }
      }
    }
    setTimeout(() => {
      this.__blockScrub = false;
      this.__outdent = false;
      this.__indent = false;
    }, 100);
  }
  /**
   * Disconnected life cycle
   */
  disconnectedCallback() {
    super.disconnectedCallback();
  }

  // Observer editMode for changes
  _editModeChanged(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
    }
  }
  /**
   * Button events internally
   */
  buttonEvents(e) {
    switch (e.target.id) {
      case "indent":
        this._indent();
        break;
      case "outdent":
        this._outdent();
        break;
      case "up":
        this._move("up");
        break;
      case "down":
        this._move("down");
        break;
      case "duplicate":
        this._duplicate();
        break;
    }
  }
  /**
   * Duplicate whatever has selection
   */
  _duplicate() {
    // get active item from where cursor is
    try {
      let range = this.getDeepRange();
      if (typeof range.commonAncestorContainer === typeof undefined) {
        return;
      }
      let activeItem = range.commonAncestorContainer;
      if (
        activeItem === null ||
        typeof activeItem === typeof undefined ||
        typeof activeItem.tagName === typeof undefined
      ) {
        activeItem = activeItem.parentNode;
      }
      if (activeItem) {
        // clone the item's hierarchy as well
        if (
          activeItem.nextElementSibling !== null &&
          activeItem.nextElementSibling.tagName === "UL"
        ) {
          // copy the UL and all children and insert it after the UL it's duplicating
          const clone2 = activeItem.nextElementSibling.cloneNode(true);
          activeItem.parentNode.insertBefore(
            clone2,
            activeItem.nextElementSibling.nextElementSibling
          );
          // clone the LI, placing it before the UL we just made
          const clone = activeItem.cloneNode(true);
          activeItem.parentNode.insertBefore(
            clone,
            activeItem.nextElementSibling.nextElementSibling
          );
        } else {
          const clone = activeItem.cloneNode(true);
          // insert the clone AFTER the current selection
          activeItem.parentNode.insertBefore(
            clone,
            activeItem.nextElementSibling
          );
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  /**
   * Move whatever has selection up or down
   */
  _move(direction) {
    // get active item from where cursor is
    try {
      let range = this.getDeepRange();
      if (typeof range.commonAncestorContainer === typeof undefined) {
        return;
      }
      let activeItem = range.commonAncestorContainer;
      if (
        activeItem === null ||
        typeof activeItem === typeof undefined ||
        typeof activeItem.tagName === typeof undefined
      ) {
        activeItem = activeItem.parentNode;
      }
      let test = activeItem;
      let valid = false;
      // ensure this operation is executed in scope
      while (!valid && test.parentNode) {
        if (test.id === "outline") {
          valid = true;
        }
        test = test.parentNode;
      }
      // ensure from all that, we have something
      if (valid && activeItem) {
        // move the things above us, below us
        if (direction === "up") {
          // ensure there's something above us
          if (activeItem.previousElementSibling !== null) {
            // see if we are moving us, or us and the hierarchy
            if (
              activeItem.nextElementSibling &&
              activeItem.nextElementSibling.tagName === "UL"
            ) {
              // see if the thing we have to move above has it's own structure
              if (activeItem.previousElementSibling.tagName === "UL") {
                // ensure we don't lose our metadata
                this.__blockScrub = true;
                // insert the element currently above us, just before 2 places back; so behind our UL
                activeItem.parentNode.insertBefore(
                  activeItem.previousElementSibling,
                  activeItem.nextElementSibling.nextElementSibling
                );
              }
              this.__blockScrub = true;
              // now insert the LI above us, 2 places back so it is in front of the UL
              activeItem.parentNode.insertBefore(
                activeItem.previousElementSibling,
                activeItem.nextElementSibling.nextElementSibling
              );
              activeItem.focus();
            } else {
              // easier use case, we are moving ourselves only but above us is a UL
              if (activeItem.previousElementSibling.tagName === "UL") {
                this.__blockScrub = true;
                // move the UL after us
                activeItem.parentNode.insertBefore(
                  activeItem.previousElementSibling,
                  activeItem.nextElementSibling
                );
              }
              this.__blockScrub = true;
              // now move the LI after us
              activeItem.parentNode.insertBefore(
                activeItem.previousElementSibling,
                activeItem.nextElementSibling
              );
              activeItem.focus();
            }
          }
        } else if (direction === "down") {
          // if nothing after us, we can't move
          if (activeItem.nextElementSibling !== null) {
            // account for having to hop over children
            if (
              activeItem.nextElementSibling &&
              activeItem.nextElementSibling.tagName === "UL" &&
              activeItem.nextElementSibling.nextElementSibling !== null
            ) {
              // an outline is just below us
              if (
                activeItem.nextElementSibling.nextElementSibling.tagName ===
                  "LI" &&
                activeItem.nextElementSibling.nextElementSibling
                  .nextElementSibling !== null &&
                activeItem.nextElementSibling.nextElementSibling
                  .nextElementSibling.tagName === "UL"
              ) {
                this.__blockScrub = true;
                // move the thing 2 down to just before us; so the UL
                activeItem.parentNode.insertBefore(
                  activeItem.nextElementSibling.nextElementSibling,
                  activeItem
                );
              }
              this.__blockScrub = true;
              // now move the LI that is 2 below us just above us
              activeItem.parentNode.insertBefore(
                activeItem.nextElementSibling.nextElementSibling,
                activeItem
              );
              activeItem.focus();
            } else if (activeItem.nextElementSibling.tagName === "LI") {
              // just moving 1 tag, see if we need to move 2 things about us or 1
              if (
                activeItem.nextElementSibling.nextElementSibling !== null &&
                activeItem.nextElementSibling.nextElementSibling.tagName ===
                  "UL"
              ) {
                this.__blockScrub = true;
                activeItem.parentNode.insertBefore(
                  activeItem.nextElementSibling,
                  activeItem
                );
              }
              this.__blockScrub = true;
              // work on the LI
              activeItem.parentNode.insertBefore(
                activeItem.nextElementSibling,
                activeItem
              );
              activeItem.focus();
            }
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  /**
   * Take the current manifest and import it into an HTML outline
   */
  importJsonOutlineSchemaItems() {
    this.__blockScrub = true;
    // wipe out the outline
    while (this.$.outline.firstChild !== null) {
      this.$.outline.removeChild(this.$.outline.firstChild);
    }
    if (this.items.length === 0) {
      // get from JOS items if we have none currently
      this.set("items", window.JSONOutlineSchema.requestAvailability().items);
    }
    let outline = window.JSONOutlineSchema.requestAvailability().itemsToNodes(
      this.items
    );
    // rebuild the outline w/ children we just found
    while (outline.firstChild !== null) {
      this.__blockScrub = true;
      this.$.outline.appendChild(outline.firstChild);
    }
    return outline;
  }
  /**
   * Take what's currently in the area and get JSON Outline Schema; optionally save
   */
  exportJsonOutlineSchemaItems(save = false) {
    return window.JSONOutlineSchema.requestAvailability().nodesToItems(
      this.$.outline,
      save
    );
  }
  /**
   * Find the next thing to tab forward to.
   */
  _tabKeyPressed(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    if (e.detail.keyboardEvent) {
      e.detail.keyboardEvent.preventDefault();
      e.detail.keyboardEvent.stopPropagation();
      e.detail.keyboardEvent.stopImmediatePropagation();
    }
    try {
      this._indent();
    } catch (e) {}
  }
  _indent() {
    if (this.polyfillSafe) {
      this.__indent = true;
      this.__blockScrub = true;
      document.execCommand("indent");
    }
  }
  /**
   * Move back through things when tab back pressed
   */
  _tabBackKeyPressed(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    if (e.detail.keyboardEvent) {
      e.detail.keyboardEvent.preventDefault();
      e.detail.keyboardEvent.stopPropagation();
      e.detail.keyboardEvent.stopImmediatePropagation();
    }
    // try selection / tab block since range can cause issues
    try {
      this._outdent();
    } catch (e) {}
  }
  _outdent() {
    if (this.polyfillSafe) {
      this.__outdent = true;
      this.__blockScrub = true;
      document.execCommand("outdent");
    }
  }
  /**
   * Selection normalizer
   */
  getDeepSelection() {
    // try and obtain the selection from the nearest shadow
    // which would give us the selection object when running native ShadowDOM
    // with fallback support for the entire window which would imply Shady
    // native API
    if (this.shadowRoot.getSelection) {
      return this.shadowRoot.getSelection();
    }
    // ponyfill from google
    else if (getRange(this.$.outline.parentNode)) {
      return getRange(this.$.outline.parentNode);
    }
    // missed on both, hope the normal one will work
    return window.getSelection();
  }
  /**
   * Get a normalized range based on current selection
   */
  getDeepRange() {
    let sel = this.getDeepSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      return sel.getRangeAt(0);
    } else if (sel) {
      return sel;
    } else false;
  }
  /**
   * These are our bad actors in polyfill'ed browsers.
   * This means that https://github.com/webcomponents/webcomponentsjs/commit/ce464bb533bf39b544c312906499a6044ee0d30d
   * explains things but basically if shadow-dom is polyfilled
   * then we can't safely execute a DOM manipulating execCommand.
   * This
   */
  __computePolyfillSafe() {
    if (document.head.createShadowRoot || document.head.attachShadow) {
      return true;
    } else {
      console.log("Shadow DOM missing, certain operations hidden");
      return false;
    }
  }
}
window.customElements.define(EditableOutline.tag, EditableOutline);
export { EditableOutline };
