/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { FlattenedNodesObserver } from "@polymer/polymer/lib/utils/flattened-nodes-observer.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "@polymer/iron-icon/iron-icon.js";
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
  /* REQUIRED FOR TOOLING DO NOT TOUCH */
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
    window.addEventListener("paste", this._onPaste.bind(this));
    // mutation observer that ensures state of hax applied correctly
    this._observer = new FlattenedNodesObserver(this.__outlineNode, info => {
      // if we've got new nodes to react to... AND they were pasted
      if (info.addedNodes.length > 0 && this.__pasteFlag) {
        info.addedNodes.map(node => {
          // deep scrub the node that we just got to remove possible JOS metadata
          window.JSONOutlineSchema.requestAvailability().scrubElementJOSData(
            node
          );
        });
        this.__pasteFlag = false;
      }
      // if we dropped nodes via the UI (delete event basically)
      if (info.removedNodes.length > 0) {
        // ensure there's always a first child node present
        // this way people can't break the interact via mass deleting
        if (!this.$.outline.firstChild) {
          this.$.outline.appendChild(document.createElement("li"));
        }
      }
    });
  }
  /**
   * Disconnected life cycle
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("paste", this._onPaste.bind(this));
  }

  // Observer editMode for changes
  _editModeChanged(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
    }
  }
  /**
   * Set flag on paste so we know to wipe data in the mutation observer
   */
  _onPaste(e) {
    this.__pasteFlag = true;
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
    }
  }

  /**
   * Take the current manifest and import it into an HTML outline
   */
  importJsonOutlineSchemaItems() {
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
    // try selection / tab block since range can cause issues
    try {
      this._indent();
      if (e.detail.keyboardEvent) {
        e.detail.keyboardEvent.preventDefault();
        e.detail.keyboardEvent.stopPropagation();
        e.detail.keyboardEvent.stopImmediatePropagation();
      }
    } catch (e) {}
  }
  _indent() {
    if (this.polyfillSafe) {
      document.execCommand("indent");
    }
  }
  _outdent() {
    if (this.polyfillSafe) {
      document.execCommand("outdent");
    }
  }
  /**
   * Move back through things when tab back pressed
   */
  _tabBackKeyPressed(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    // try selection / tab block since range can cause issues
    try {
      this._outdent();
      if (e.detail.keyboardEvent) {
        e.detail.keyboardEvent.preventDefault();
        e.detail.keyboardEvent.stopPropagation();
        e.detail.keyboardEvent.stopImmediatePropagation();
      }
    } catch (e) {}
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
