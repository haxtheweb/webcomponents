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
