/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { getRange } from "@haxtheweb/utils/utils.js";
import "@haxtheweb/json-outline-schema/json-outline-schema.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import { normalizeEventPath } from "@haxtheweb/utils/utils.js";

/**
 * `editable-outline`
 * `a simple outline thats contenteditable in nature`
 * @demo demo/index.html
 * @element editable-outline
 */
class EditableOutline extends LitElement {
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: block;
          font-family: "Noto Serif", serif;
        }

        :host([hidden]) {
          display: none;
        }

        .button-wrapper {
          line-height: 36px;
          position: -webkit-sticky;
          position: sticky;
          top: 0px;
          background-color: white;
          display: block;
          justify-content: space-evenly;
        }
        @media (max-width: 1000px) {
          button span {
            opacity: 0;
            visibility: hidden;
            position: absolute;
            left: -9999px;
          }
        }

        button {
          height: 32px;
          font-size: 10px;
          margin: 0;
          padding: 0 8px;
        }

        button span {
          padding-left: 4px;
          pointer-events: none;
        }

        #outline {
          margin: 0;
        }

        ul {
          font-size: 16px;
          line-height: 32px;
          padding-left: 32px;
          visibility: visible;
          opacity: 1;
          overflow: hidden;
          height: auto;
          transition: 0.2s ease-in-out all;
        }

        li {
          font-size: 16px;
          line-height: 32px;
          padding: 4px;
          transition: 0.2s linear all;
        }

        ul:hover {
          outline: 1px solid #eeeeee;
        }

        li.collapsed-title {
          background-color: #dddddd;
        }

        li.collapsed-title:after {
          content: "    ( Double-click to expand )";
        }

        li:after {
          transition: 0.4s ease-in-out all;
          opacity: 0;
          font-size: 11px;
          visibility: hidden;
        }

        li.collapsed-title:hover:after {
          font-style: italic;
          opacity: 1;
          visibility: visible;
        }

        ul.collapsed-content {
          visibility: hidden;
          opacity: 0;
          height: 0;
        }

        li:focus,
        li:active,
        li:hover {
          background-color: #eeeeee;
          outline: 1px solid #cccccc;
        }

        simple-icon {
          pointer-events: none;
        }

        li[data-jos-published="false"] {
          text-decoration: line-through;
        }
      `,
    ];
  }

  // render function
  render() {
    return html` <div class="button-wrapper">
        <button @click="${this.buttonEvents}" id="add" title="Add a new node">
          <simple-icon icon="icons:add"></simple-icon><span>Add</span>
        </button>
        <button
          @click="${this.buttonEvents}"
          id="collapse"
          title="Toggle active node collapsed status"
        >
          <simple-icon icon="icons:swap-vert"></simple-icon
          ><span>Toggle active</span>
        </button>
        <button
          @click="${this.buttonEvents}"
          id="collapseall"
          title="Collapse all nodes"
        >
          <simple-icon icon="icons:swap-vert"></simple-icon
          ><span>Collapse all</span>
        </button>
        <button
          @click="${this.buttonEvents}"
          id="expandall"
          title="Expand all nodes"
        >
          <simple-icon icon="icons:swap-vert"></simple-icon
          ><span>Expand all</span>
        </button>
        <button
          @click="${this.buttonEvents}"
          id="down"
          title="Move active node down"
        >
          <simple-icon icon="icons:arrow-downward"></simple-icon
          ><span>Move down</span>
        </button>
        <button
          @click="${this.buttonEvents}"
          id="up"
          title="Move active node up"
        >
          <simple-icon icon="icons:arrow-upward"></simple-icon
          ><span>Move up</span>
        </button>
        <button
          @click="${this.buttonEvents}"
          id="outdent"
          title="Outdent active node"
        >
          <simple-icon icon="editor:format-indent-decrease"></simple-icon
          ><span>Outdent</span>
        </button>
        <button
          @click="${this.buttonEvents}"
          id="indent"
          title="Indent active node"
        >
          <simple-icon icon="editor:format-indent-increase"></simple-icon
          ><span>Indent</span>
        </button>
        <button
          @click="${this.buttonEvents}"
          id="duplicate"
          title="Duplicate active node tree"
        >
          <simple-icon icon="icons:content-copy"></simple-icon
          ><span>Duplicate</span>
        </button>
      </div>
      <ul id="outline"></ul>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      /**
       * A items list of JSON Outline Schema Items
       */
      items: {
        type: Array,
      },
      /**
       * Edit mode
       */
      editMode: {
        type: Boolean,
        attribute: "edit-mode",
      },
      /**
       * Outline node for keyboard key binding
       */
      __outlineNode: {
        type: Object,
      },
    };
  }
  constructor() {
    super();
    this.items = [];
    this.editMode = false;
    this.jos = window.JSONOutlineSchema.requestAvailability();
    setTimeout(() => {
      this.addEventListener("dblclick", this._collapseClickHandler.bind(this));
    }, 0);
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "editable-outline";
  }
  /**
   * Collapse button callback
   */
  _collapse(e) {
    let node = this.getSelectionNode();
    if (
      node &&
      node.tagName === "LI" &&
      node.nextElementSibling &&
      node.nextElementSibling.tagName === "UL"
    ) {
      node.classList.toggle("collapsed-title");
      node.nextElementSibling.classList.toggle("collapsed-content");
    }
  }
  /**
   * Expand all items
   */
  _expandall(e) {
    this.shadowRoot.querySelectorAll("li").forEach((el) => {
      el.classList.remove("collapsed-title");
    });
    this.shadowRoot.querySelectorAll("ul").forEach((el) => {
      el.classList.remove("collapsed-content");
    });
  }
  /**
   * Collapse all items
   */
  _collapseall(e) {
    this.shadowRoot.querySelectorAll("li").forEach((el) => {
      if (el.nextElementSibling && el.nextElementSibling.tagName === "UL") {
        el.classList.add("collapsed-title");
        el.nextElementSibling.classList.add("collapsed-content");
      }
    });
  }
  _onKeyDown(e) {
    if (this.editMode) {
      switch (e.key) {
        case "Enter":
          this._enterPressed(e);
          break;
        case "ArrowUp":
          this._upPressed(e);
          break;
        case "ArrowDown":
          this._downPressed(e);
          break;
        case "Tab":
          if (e.shiftKey) {
            this._tabBackKeyPressed(e);
          } else {
            this._tabKeyPressed(e);
          }
          break;
      }
    }
  }
  /**
   * Click handler method needs to walk a little different then normal collapse
   */
  _collapseClickHandler(e) {
    let el;
    let i = 0;
    let notFound = true;
    var path = normalizeEventPath(e);

    while (notFound && path.length > i + 1) {
      el = path[i];
      if (
        el.tagName === "LI" &&
        el.nextElementSibling &&
        el.nextElementSibling.tagName === "UL"
      ) {
        el.classList.toggle("collapsed-title");
        el.nextElementSibling.classList.toggle("collapsed-content");
        notFound = false;
      }
      i++;
    }
  }
  firstUpdated() {
    this.__outlineNode = this.shadowRoot.querySelector("#outline");
    this.__outlineNode.addEventListener("keydown", this._onKeyDown.bind(this));
    this._observer = new MutationObserver(this._observeRecord.bind(this));
    this._observer.observe(this.__outlineNode, {
      childList: true,
      subtree: true,
    });
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      let notifiedProps = ["editMode", "items"];
      if (notifiedProps.includes(propName)) {
        // notify
        let eventName = `${propName
          .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
          .toLowerCase()}-changed`;
        this.dispatchEvent(
          new CustomEvent(eventName, {
            detail: {
              value: this[propName],
            },
          }),
        );
      }
    });
  }
  /**
   * Mutation observer callback
   * @todo current issue if you copy and paste into the same node
   */
  _observeRecord(record) {
    for (var index in record) {
      let info = record[index];
      // if we've got new nodes to react to that were not imported
      if (info.addedNodes.length > 0) {
        // special rules for an outdent event
        for (let i in info.addedNodes) {
          if (info.addedNodes[i].tagName) {
            if (info.addedNodes[i].tagName === "LI") {
              if (this.__blockScrub) {
                info.addedNodes[i].setAttribute("contenteditable", "true");
              } else {
                this.jos.scrubElementJOSData(info.addedNodes[i]);
                info.addedNodes[i].setAttribute("contenteditable", "true");
              }
            }
            // we have an unknown hest of items, scrub em all if we are in scrub mode
            else if (info.addedNodes[i].tagName === "UL") {
              if (!this.__blockScrub) {
                this.jos.scrubElementJOSData(info.addedNodes[i]);
              }
            }
          }
        }
      }
    }
    setTimeout(() => {
      this.__blockScrub = false;
    }, 100);
  }
  /**
   * Disconnected life cycle
   */
  disconnectedCallback() {
    this.__outlineNode.removeEventListener(
      "keydown",
      this._onKeyDown.bind(this),
    );
    this._observer.disconnect();
    super.disconnectedCallback();
  }

  /**
   * Button events internally
   */
  buttonEvents(e) {
    switch (e.target.id) {
      case "add":
        this._add(e);
        break;
      case "collapse":
        this._collapse(e);
        break;
      case "collapseall":
        this._collapseall(e);
        break;
      case "expandall":
        this._expandall(e);
        break;
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
      this.__blockScrub = false;
      let activeItem = this.getSelectionNode();
      if (activeItem && activeItem.tagName === "LI") {
        // clone the item's hierarchy as well
        if (
          activeItem.nextElementSibling !== null &&
          activeItem.nextElementSibling.tagName === "UL"
        ) {
          // copy the UL and all children and insert it after the UL it's duplicating
          const clone2 = activeItem.nextElementSibling.cloneNode(true);
          activeItem.parentNode.insertBefore(
            clone2,
            activeItem.nextElementSibling.nextElementSibling,
          );
          // clone the LI, placing it before the UL we just made
          const clone = activeItem.cloneNode(true);
          activeItem.parentNode.insertBefore(
            clone,
            activeItem.nextElementSibling.nextElementSibling,
          );
        } else {
          const clone = activeItem.cloneNode(true);
          // insert the clone AFTER the current selection
          activeItem.parentNode.insertBefore(
            clone,
            activeItem.nextElementSibling,
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
      let activeItem = this.getSelectionNode();
      let test = activeItem;
      let valid = false;
      if (activeItem == null) {
        return false;
      }
      // ensure this operation is executed in scope
      while (!valid && test.parentNode) {
        if (test.id === "outline") {
          valid = true;
        }
        test = test.parentNode;
      }
      // ensure from all that, we have something
      if (valid && activeItem && activeItem.tagName === "LI") {
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
                  activeItem.nextElementSibling.nextElementSibling,
                );
              }
              this.__blockScrub = true;
              // now insert the LI above us, 2 places back so it is in front of the UL
              activeItem.parentNode.insertBefore(
                activeItem.previousElementSibling,
                activeItem.nextElementSibling.nextElementSibling,
              );
              activeItem.focus();
            } else {
              // easier use case, we are moving ourselves only but above us is a UL
              if (activeItem.previousElementSibling.tagName === "UL") {
                this.__blockScrub = true;
                // move the UL after us
                activeItem.parentNode.insertBefore(
                  activeItem.previousElementSibling,
                  activeItem.nextElementSibling,
                );
              }
              this.__blockScrub = true;
              // now move the LI after us
              activeItem.parentNode.insertBefore(
                activeItem.previousElementSibling,
                activeItem.nextElementSibling,
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
                  activeItem,
                );
              }
              this.__blockScrub = true;
              // now move the LI that is 2 below us just above us
              activeItem.parentNode.insertBefore(
                activeItem.nextElementSibling.nextElementSibling,
                activeItem,
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
                  activeItem,
                );
              }
              this.__blockScrub = true;
              // work on the LI
              activeItem.parentNode.insertBefore(
                activeItem.nextElementSibling,
                activeItem,
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
    setTimeout(() => {
      // wipe out the outline
      while (this.__outlineNode.firstChild) {
        this.__outlineNode.removeChild(this.__outlineNode.firstChild);
      }
      if (this.items.length === 0) {
        // get from JOS items if we have none currently
        this.items = [...this.jos.items];
      }
      let outline = this.jos.itemsToNodes(this.items);
      // rebuild the outline w/ children we just found
      while (outline.firstChild) {
        this.__blockScrub = true;
        this.__outlineNode.appendChild(outline.firstChild);
      }
      this.shadowRoot.querySelectorAll("li").forEach((el) => {
        el.setAttribute("contenteditable", "true");
      });
      return outline;
    }, 0);
  }
  /**
   * Take what's currently in the area and get JSON Outline Schema; optionally save
   */
  exportJsonOutlineSchemaItems(save = false) {
    return this.jos.nodesToItems(this.__outlineNode, save);
  }
  _upPressed(e) {
    let node = this.getSelectionNode();
    if (node && node.previousSibling && node.previousSibling.tagName === "LI") {
      node.previousSibling.focus();
    } else if (
      node &&
      node.previousSibling &&
      node.previousSibling.tagName === "UL" &&
      node.previousSibling.firstChild &&
      node.previousSibling.firstChild.tagName === "LI"
    ) {
      node.previousSibling.firstChild.focus();
    } else if (
      node &&
      node.previousSibling == null &&
      node.parentNode.tagName === "UL" &&
      node.parentNode.previousSibling &&
      node.parentNode.previousSibling.tagName === "LI"
    ) {
      node.parentNode.previousSibling.focus();
    }
  }
  _downPressed(e) {
    let node = this.getSelectionNode();
    if (node && node.nextSibling && node.nextSibling.tagName === "LI") {
      node.nextSibling.focus();
    } else if (
      node &&
      node.nextSibling &&
      node.nextSibling.tagName === "UL" &&
      node.nextSibling.firstChild &&
      node.nextSibling.firstChild.tagName === "LI"
    ) {
      node.nextSibling.firstChild.focus();
    } else if (
      node &&
      node.nextSibling == null &&
      node.parentNode.tagName === "UL" &&
      node.parentNode.nextSibling &&
      node.parentNode.nextSibling.tagName === "LI"
    ) {
      node.parentNode.nextSibling.focus();
    }
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
    try {
      this._outdent();
    } catch (e) {}
  }
  _enterPressed(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    // prevent the contenteditable stuff
    if (e.detail.keyboardEvent) {
      e.detail.keyboardEvent.preventDefault();
      e.detail.keyboardEvent.stopPropagation();
      e.detail.keyboardEvent.stopImmediatePropagation();
    }
    this._add();
  }
  _add() {
    let li = document.createElement("li");
    li.setAttribute("contenteditable", "true");
    let node = this.getSelectionNode();
    if (
      this.__outlineNode.querySelector("li") == null ||
      !node ||
      (node.tagName && node.tagName != "UL" && node.tagName != "LI")
    ) {
      this.__outlineNode.appendChild(li);
    } else {
      if ((node.tagName == null || node.tagName != "LI") && node.parentNode) {
        node = node.parentNode;
      }
      if (node.nextSibling == null) {
        node.parentNode.appendChild(li);
      } else {
        node.parentNode.insertBefore(li, node.nextSibling);
      }
      try {
        li.focus();
      } catch (e) {
        // prevent issue on polyfill browsers potentially
      }
    }
  }
  _outdent() {
    this.__blockScrub = true;
    try {
      let node = this.getSelectionNode();
      if (node == null) {
        return false;
      }
      // need to hold this in case it's empty at the end
      const parent = node.parentNode;
      if (
        node.parentNode &&
        node.parentNode != this.__outlineNode &&
        node.parentNode.nextSibling != null
      ) {
        node.parentNode.parentNode.insertBefore(
          node,
          node.parentNode.nextSibling,
        );
        if (parent.children.length == 0) {
          parent.remove();
        }
      } else if (
        node.parentNode &&
        node.parentNode != this.__outlineNode &&
        node.parentNode.nextSibling == null
      ) {
        node.parentNode.parentNode.appendChild(node);
        if (parent.children.length == 0) {
          parent.remove();
        }
      }
      node.focus();
    } catch (e) {
      console.warn(e);
    }
  }
  _indent() {
    this.__blockScrub = true;
    try {
      let node = this.getSelectionNode();
      if (node == null) {
        return false;
      }
      // see if the previous tag is a LI, if so we can indent
      if (
        node.previousSibling != null &&
        node.previousSibling.tagName === "LI"
      ) {
        let ul;
        if (node.nextSibling && node.nextSibling.tagName === "UL") {
          ul = node.nextSibling;
        } else {
          ul = document.createElement("ul");
          node.parentNode.insertBefore(ul, node);
        }
        // append a new list inside the child before the active node position
        // now append into that list the node that was active
        ul.appendChild(node);
        node.focus();
      } else if (
        node.previousSibling != null &&
        node.previousSibling.tagName === "UL"
      ) {
        node.previousSibling.appendChild(node);
        node.focus();
      }
    } catch (e) {
      console.warn(e);
    }
  }
  getSelectionNode() {
    let node = this.getDeepSelection().anchorNode;
    if (
      node &&
      (node.tagName == null || node.tagName != "LI") &&
      node.parentNode
    ) {
      node = node.parentNode;
    }
    return node;
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
    else if (getRange(this.__outlineNode.parentNode)) {
      return getRange(this.__outlineNode.parentNode);
    }
    // missed on both, hope the normal one will work
    return window.getSelection();
  }
  /**
   * Get a normalized range based on current selection
   */
  getDeepRange() {
    let sel = this.getSelection();
    if (sel && sel.getRangeAt && sel.rangeCount) {
      return sel.getRangeAt(0);
    } else if (sel) {
      return sel;
    } else {
      return false;
    }
  }
}
customElements.define(EditableOutline.tag, EditableOutline);
export { EditableOutline };
