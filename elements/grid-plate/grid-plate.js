import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import * as async from "@polymer/polymer/lib/utils/async.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/responsive-utility/responsive-utility.js";
/**
`grid-plate`
A grid plate based on a layout that manipulates it.

* @demo demo/index.html

@microcopy - the mental model for this element
 -

*/
let GridPlate = Polymer({
  _template: html`
    <custom-style>
      <style is="custom-style" include="simple-colors">
        :host {
          display: block;
          --grid-plate-row-margin: 0px;
          --grid-plate-row-padding: 0px;
          --grid-plate-item-margin: 15px;
          --grid-plate-editable-border-color: #ccc;
          --grid-plate-active-border-color: #6cd;
        }
        :host .row {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: stretch;
          margin: var(--grid-plate-row-margin);
          padding: var(--grid-plate-row-padding);
        }
        :host .column {
          width: 100%;
          flex: 0 0 auto;
          transition: all 0.5s;
        }
        :host([edit-mode]) .column {
          min-height: 150px;
        }

        :host([edit-mode]) .column {
          outline: 1px dotted var(--grid-plate-editable-border-color);
        }
        :host .column[style="min-height: unset"] {
          display: none;
        }
        :host([edit-mode]) .column[style="min-height: unset"]:not(:empty) {
          display: block;
          outline: 1px solid red;
          width: 20%;
          margin-top: var(--grid-plate-item-margin);
        }
        :host([edit-mode])
          .column[style="min-height: unset"]:not(:empty):before {
          content: "Hidden Column (" attr(id) ")";
          color: red;
          margin: var(--grid-plate-item-margin);
          padding: 15px 0;
          min-height: 150px;
        }
        :host ::slotted(*) {
          margin: var(--grid-plate-item-margin);
          padding: 0;
        }
        :host ::slotted(*.mover) {
          outline: 2px dashed var(--grid-plate-editable-border-color);
          outline-offset: 4px;
        }
        :host ::slotted(*.active-item) {
          outline: 2px dashed var(--grid-plate-active-border-color);
          outline-offset: 4px;
        }
        :host ::slotted(*[data-draggable]:focus),
        :host ::slotted(*[data-draggable]:hover),
        :host ::slotted(*[data-draggable]:active) {
          cursor: move;
        }

        :host([edit-mode]) .column.mover {
          background-color: yellow;
        }
        :host .column[data-draggable].mover {
          background-color: pink;
        }

        paper-icon-button {
          display: none;
          position: absolute;
          margin: 0;
          padding: 0;
          outline: none;
          width: 20px;
          height: 20px;
          color: black;
          background-color: #eeeeee;
          border-radius: 50%;
          box-sizing: content-box !important;
          z-index: 1;
          min-width: unset;
        }

        paper-icon-button[disabled] {
          color: #aaa;
          background-color: #ddd;
        }
        paper-icon-button[disabled]:focus,
        paper-icon-button[disabled]:hover {
          cursor: not-allowed;
        }
        paper-icon-button.active {
          display: block;
        }

        .button-holding-pen {
          position: relative;
        }
      </style>
    </custom-style>
    <div class="button-holding-pen">
      <paper-icon-button
        icon="icons:arrow-upward"
        title="move item up"
        id="up"
        on-tap="moveActiveElement"
      >
      </paper-icon-button>
      <paper-icon-button
        icon="icons:arrow-forward"
        title="move item right"
        id="right"
        on-tap="moveActiveElement"
      >
      </paper-icon-button>
      <paper-icon-button
        icon="icons:arrow-downward"
        title="move item down"
        id="down"
        on-tap="moveActiveElement"
      >
      </paper-icon-button>
      <paper-icon-button
        icon="icons:arrow-back"
        title="move item left"
        id="left"
        on-tap="moveActiveElement"
      >
      </paper-icon-button>
    </div>
    <div class="row">
      <div
        class="column"
        id="col1"
        style$="[[_getColumnWidth(0,columnWidths)]]"
      >
        <slot name="col-1"></slot>
      </div>
      <div
        class="column"
        id="col2"
        style$="[[_getColumnWidth(1,columnWidths)]]"
      >
        <slot name="col-2"></slot>
      </div>
      <div
        class="column"
        id="col3"
        style$="[[_getColumnWidth(2,columnWidths)]]"
      >
        <slot name="col-3"></slot>
      </div>
      <div
        class="column"
        id="col4"
        style$="[[_getColumnWidth(3,columnWidths)]]"
      >
        <slot name="col-4"></slot>
      </div>
      <div
        class="column"
        id="col5"
        style$="[[_getColumnWidth(4,columnWidths)]]"
      >
        <slot name="col-5"></slot>
      </div>
      <div
        class="column"
        id="col6"
        style$="[[_getColumnWidth(5,columnWidths)]]"
      >
        <slot name="col-6"></slot>
      </div>
    </div>
    <iron-a11y-keys
      stop-keyboard-event-propagation
      target="[[__activeItem]]"
      keys="enter"
      on-keys-pressed="setActiveElement"
    ></iron-a11y-keys>
    <iron-a11y-keys
      target="[[__activeItem]]"
      keys="esc"
      on-keys-pressed="cancelActive"
    ></iron-a11y-keys>
  `,

  is: "grid-plate",

  listeners: {
    focusin: "_focusIn",
    focusout: "_focusOut"
  },

  behaviors: [HAXBehaviors.PropertiesBehaviors],

  properties: {
    /**
     * number of columns at this layout / responsive size
     */
    columns: {
      type: Number,
      computed: "_getColumns(columnWidths)",
      reflectToAttribute: true
    },
    /**
     * name of selected layout
     */
    columnWidths: {
      type: String,
      computed: "_getColumnWidths(responsiveSize,layout,layouts)"
    },
    /**
     * If the grid plate is in a state where its items
     * can be modified as far as order or column placement.
     */
    editMode: {
      reflectToAttribute: true,
      type: Boolean,
      value: false,
      observer: "_editModeChanged"
    },
    /**
     * an object with a layout's column sizes
     * at the current responsive width
     */
    layout: {
      type: String,
      value: "1-1",
      reflectToAttribute: true
    },
    /**
     * Predefined layouts of column sizes and various responsive widths. 
     * For example:```
{
  "1-1-1-1": {                         //the name of the layout
    "xs": ["100%","100%","100%","100%] //the responsive width of each column when the grid is extra small
    "sm": ["50%","50%","50%","50%"]    //the responsive width of each column when the grid is small
    "md": ["50%","50%","50%","50%"]    //the responsive width of each column when the grid is medium
    "lg": ["25%","25%","25%","25%"]    //the responsive width of each column when the grid is large
    "xl": ["25%","25%","25%","25%"]    //the responsive width of each column when the grid is extra large
  },
  {...}
}

              "1": "1: full width",
              "1-1": "2: equal width",
              "2-1": "2: wide and narrow",
              "1-2": "2: narrow and wide",
              "3-1": "2: wider and narrower",
              "1-3": "2: narrower and wider",
              "1-1-1": "3: equal width",
              "2-1-1": "3: wide, narrow, and narrow",
              "1-2-1": "3: narrow, wide, and narrow",
              "1-1-2": "3: narrow,  narrow, and wide",
              "1-1-1-1": "4: equal width",
     */
    layouts: {
      type: Object,
      value: {
        "1": {
          columnLayout: "1: full width",
          xs: ["100%"],
          sm: ["100%"],
          md: ["100%"],
          lg: ["100%"],
          xl: ["100%"]
        },
        "1-1": {
          columnLayout: "2: equal width",
          xs: ["100%", "100%"],
          sm: ["50%", "50%"],
          md: ["50%", "50%"],
          lg: ["50%", "50%"],
          xl: ["50%", "50%"]
        },
        "2-1": {
          columnLayout: "2: wide & narrow",
          xs: ["100%", "100%"],
          sm: ["50%", "50%"],
          md: ["66.6666667%", "33.3333337%"],
          lg: ["66.6666667%", "33.3333337%"],
          xl: ["66.6666667%", "33.3333337%"]
        },
        "1-2": {
          columnLayout: "2: narrow & wide",
          xs: ["100%", "100%"],
          sm: ["50%", "50%"],
          md: ["33.3333333%", "66.6666667%"],
          lg: ["33.3333333%", "66.6666667%"],
          xl: ["33.3333333%", "66.6666667%"]
        },
        "3-1": {
          columnLayout: "2: wider & narrower",
          xs: ["100%", "100%"],
          sm: ["50%", "50%"],
          md: ["75%", "25%"],
          lg: ["75%", "25%"],
          xl: ["75%", "25%"]
        },
        "1-3": {
          columnLayout: "2: narrower & wider",
          xs: ["100%", "100%"],
          sm: ["50%", "50%"],
          md: ["25%", "75%"],
          lg: ["25%", "75%"],
          xl: ["25%", "75%"]
        },
        "1-1-1": {
          columnLayout: "3: equal width",
          xs: ["100%", "100%", "100%"],
          sm: ["100%", "100%", "100%"],
          md: ["33.3333333%", "33.3333333%", "33.3333333%"],
          lg: ["33.3333333%", "33.3333333%", "33.3333333%"],
          xl: ["33.3333333%", "33.3333333%", "33.3333333%"]
        },
        "2-1-1": {
          columnLayout: "3: wide, narrow, and narrow",
          xs: ["100%", "100%", "100%"],
          sm: ["100%", "50%", "50%"],
          md: ["50%", "25%", "25%"],
          lg: ["50%", "25%", "25%"],
          xl: ["50%", "25%", "25%"]
        },
        "1-2-1": {
          columnLayout: "3: narrow, wide, and narrow",
          xs: ["100%", "100%", "100%"],
          sm: ["100%", "100%", "100%"],
          md: ["25%", "50%", "25%"],
          lg: ["25%", "50%", "25%"],
          xl: ["25%", "50%", "25%"]
        },
        "1-1-2": {
          columnLayout: "3: narrow, narrow, and wide",
          xs: ["100%", "100%", "100%"],
          sm: ["50%", "50%", "100%"],
          md: ["25%", "25%", "50%"],
          lg: ["25%", "25%", "50%"],
          xl: ["25%", "25%", "50%"]
        },
        "1-1-1-1": {
          columnLayout: "4: equal width",
          xs: ["100%", "100%", "100%", "100%"],
          sm: ["50%", "50%", "50%", "50%"],
          md: ["25%", "25%", "25%", "25%"],
          lg: ["25%", "25%", "25%", "25%"],
          xl: ["25%", "25%", "25%", "25%"]
        },
        "1-1-1-1-1": {
          columnLayout: "5: equal width",
          xs: ["100%", "100%", "100%", "100%", "100%"],
          sm: ["50%", "50%", "50%", "50%", "50%"],
          md: ["20%", "20%", "20%", "20%", "20%"],
          lg: ["20%", "20%", "20%", "20%", "20%"],
          xl: ["20%", "20%", "20%", "20%", "20%"]
        },
        "1-1-1-1-1-1": {
          columnLayout: "6: equal width",
          xs: ["100%", "100%", "100%", "100%", "100%", "100%"],
          sm: ["50%", "50%", "50%", "50%", "50%", "50%"],
          md: [
            "33.3333333%",
            "33.3333333%",
            "33.3333333%",
            "33.3333333%",
            "33.3333333%",
            "33.3333333%"
          ],
          lg: [
            "16.6666667%",
            "16.6666667%",
            "16.6666667%",
            "16.6666667%",
            "16.6666667%",
            "16.6666667%"
          ],
          xl: [
            "16.6666667%",
            "16.6666667%",
            "16.6666667%",
            "16.6666667%",
            "16.6666667%",
            "16.6666667%"
          ]
        }
      }
    },
    /**
     * Responsive size as `xs`, `sm`, `md`, `lg`, or `xl`
     */
    responsiveSize: {
      type: String,
      value: "xs",
      reflectToAttribute: true
    },
    /**
     * Track active item
     */
    __activeItem: {
      type: Object,
      observer: "_activeItemChanged"
    }
  },

  /**
   * Cancel active element
   */
  cancelActive: function(e) {
    this.__activeItem = null;
  },

  /**
   * Determines if the item can move a set number of slots.
   *
   * @param {object} the item
   * @param {number} -1 for left or +1 for right
   * @returns {boolean} if the item can move a set number of slots
   */
  canMoveSlot: function(item, before) {
    let dir = before ? -1 : 1,
      max = this.shadowRoot.querySelectorAll(".column").length,
      col = item.getAttribute("slot").split("-"),
      dest = parseInt(col[1]) + dir;
    return dest >= 1 && dest <= max;
  },

  /**
   * Moves an item a set number of slots.
   *
   * @param {object} the item
   * @param {number} -1 for left or +1 for right
   */
  moveSlot: function(item, before) {
    let dir = before ? -1 : 1,
      col = item.getAttribute("slot").split("-"),
      dest = parseInt(col[1]) + dir;
    if (this.canMoveSlot(item, dir)) {
      item.setAttribute("slot", "col-" + dest);
    }
  },

  /**
   * Determines if the item can move a set number of slots.
   *
   * @param {object} the item
   * @param {boolean} move item before previous? (false for move item after next)
   * @returns {boolean} if the item can move a set number of slots
   */
  canMoveOrder: function(item, before) {
    let target = before ? item.previousElementSibling : item.nextElementSibling;
    return (
      target !== null &&
      target.getAttribute("slot") === item.getAttribute("slot")
    );
  },

  /**
   * Moves an item's order within a slot.
   *
   * @param {object} the item
   * @param {boolean} move item before previous? (false for move item after next)
   */
  moveOrder: function(item, before = true) {
    let dir = before ? -1 : 1;
    if (this.canMoveOrder(item, before)) {
      if (before) {
        dom(this).insertBefore(
          this.__activeItem,
          this.__activeItem.previousElementSibling
        );
      } else {
        dom(this).insertBefore(
          this.__activeItem,
          this.__activeItem.nextElementSibling.nextElementSibling
        );
      }
    }
  },

  /**
   * Move the active element based on which button got pressed.
   */
  moveActiveElement: function(e) {
    var normalizedEvent = dom(e);
    var local = normalizedEvent.localTarget;
    // see if this was an up down left or right movement
    switch (local.id) {
      case "up":
        this.moveOrder(this.__activeItem, true);
        break;
      case "down":
        this.moveOrder(this.__activeItem, false);
        break;
      case "left":
        this.moveSlot(this.__activeItem, true);
        break;
      case "right":
        this.moveSlot(this.__activeItem, false);
        break;
    }
    // ensure arrows are correctly positioned after the move
    setTimeout(() => {
      this.positionArrows(this.__activeItem);
      this.__activeItem.focus();
    }, 100);
  },

  /**
   * Notice changes to what's active and ensure UX associated w/ it is visble
   */
  _activeItemChanged: function(newValue, oldValue) {
    if (typeof newValue !== typeof undefined && newValue != null) {
      // position arrows
      newValue.classList.add("active-item");
      this.positionArrows(newValue);
    } else if (newValue == null) {
      this.positionArrows(newValue);
    }
    // if we had a previous value then remove the active item class
    if (typeof oldValue !== typeof undefined && oldValue != null) {
      oldValue.classList.remove("active-item");
      oldValue.blur();
    }
  },

  /**
   * Set the target element to active
   */
  setActiveElement: function(e) {
    var normalizedEvent = dom(e);
    var local = normalizedEvent.localTarget;
    //this.$.up.focus();
    this.$.right.focus();
    e.preventDefault();
    e.stopPropagation();
  },
  /**
   * gets the column widths based on selected layout and current responsive width
   *
   * @param {string} a string that describes the current responsive width
   * @param {string} the name of selected layout
   * @param {object} predefined layouts of column sizes and various responsive widths
   * @returns {object} an object with a layout's column sizes at the current responsive width
   */
  _getColumnWidths(responsiveSize = "sm", layout = "1-1", layouts) {
    let newl = layouts[layout],
      //how old layout names map to the new ones
      oldLayouts = {
        "12": "1",
        "8/4": "2-1",
        "6/6": "1-1",
        "4/8": "1-2",
        "4/4/4": "1-1-1",
        "3/3/3/3": "1-1-1-1"
      },
      oldl = oldLayouts[layout];

    if (newl !== undefined && newl[responsiveSize] !== undefined) {
      //return the layout
      return layouts[layout][responsiveSize];
    } else if (
      layouts[oldl] !== undefined &&
      layouts[oldl][responsiveSize] !== undefined
    ) {
      //return new layout that maps to old one
      return layouts[oldl][responsiveSize];
    } else {
      //return 2-column layout
      return layouts["1-1"][responsiveSize];
    }
  },

  /**
   * gets a given column's current width based on layout and current responsive width
   *
   * @param {number} the index of the column
   * @param {object} an object with a layout's column sizes at the current responsive width
   * @returns {string} a given column's current width based on layout and current responsive width
   */
  _getColumnWidth(column, columnWidths) {
    return columnWidths !== undefined && columnWidths[column] !== undefined
      ? "width:" + columnWidths[column]
      : "min-height: unset";
  },
  /**
   * gets a given column's current width based on layout and current responsive width
   *
   * @param {string} the name of selected layout
   * @returns {number} the number of columns in this layout
   */
  _getColumns(columnWidths) {
    return columnWidths.length;
  },
  /**
   * Focus / tab / click event normalization
   */
  _focusIn: function(e) {
    if (this.editMode) {
      var normalizedEvent = dom(e);
      var local = normalizedEvent.localTarget;
      // only activate if we touch something that's in the slot of the grid plate
      if (dom(local).parentNode === this) {
        this.__activeItem = local;
      }
    }
  },
  /**
   * Focus / tab / click event normalization
   */
  _focusOut: function(e) {
    if (this.editMode) {
      var normalizedEvent = dom(e);
      var local = normalizedEvent.localTarget;
      // @todo need to correctly de-focus when the element loses focus entirely
      if (
        local.parentNode === this ||
        document.activeElement.parentNode === this ||
        document.activeElement === this
      ) {
      } else {
        //this.__activeItem = null;
      }
    }
  },
  /**
   * Position the arrows to change directions around something
   */
  positionArrows: function(item) {
    if (item == null) {
      this.$.up.classList.remove("active");
      this.$.down.classList.remove("active");
      this.$.left.classList.remove("active");
      this.$.right.classList.remove("active");
    } else {
      this.$.up.classList.add("active");
      this.$.down.classList.add("active");
      this.$.left.classList.add("active");
      this.$.right.classList.add("active");

      // ensure we disable invalid options contextually
      // test for an element above us
      this.$.up.disabled = !this.canMoveOrder(item, true);
      // test for an element below us
      this.$.down.disabled = !this.canMoveOrder(item, false);
      // test for a column to the left of us
      this.$.left.disabled = !this.canMoveSlot(item, true);
      // test for a column to the right of us
      this.$.right.disabled = !this.canMoveSlot(item, false);

      // get coordinates of the page and active element
      let bodyRect = this.getBoundingClientRect();
      let elemRect = item.getBoundingClientRect();
      let topOffset = elemRect.top - bodyRect.top;
      let leftOffset = elemRect.left - bodyRect.left;

      // set the arrows to position correctly at all 4 sides
      this.$.up.style.top = topOffset - 20 + "px";
      this.$.down.style.top = topOffset + elemRect.height + "px";
      this.$.left.style.top = topOffset + elemRect.height / 2 + "px";
      this.$.right.style.top = topOffset + elemRect.height / 2 + "px";

      this.$.up.style.left = leftOffset + elemRect.width / 2 - 10 + "px";
      this.$.down.style.left = leftOffset + elemRect.width / 2 - 10 + "px";
      this.$.left.style.left = leftOffset - 20 + "px";
      this.$.right.style.left = leftOffset + elemRect.width + "px";
    }
  },

  /**
   * Notice edit state has changed
   */
  _editModeChanged: function(newValue, oldValue) {
    // flipping from false to true
    let children = dom(this).getEffectiveChildNodes();
    if (typeof children === "object") {
      if (newValue && !oldValue) {
        // walk the children and apply the draggable state needed
        for (var i in children) {
          if (typeof children[i].tagName !== typeof undefined) {
            children[i].addEventListener("drop", this.dropEvent.bind(this));
            children[i].addEventListener(
              "dragstart",
              this.dragStart.bind(this)
            );
            children[i].addEventListener("dragend", this.dragEnd.bind(this));
            children[i].addEventListener("dragover", function(e) {
              e.preventDefault();
            });
            children[i].setAttribute("draggable", true);
            children[i].setAttribute("data-draggable", true);
            // ensure they can be focused
            children[i].setAttribute("tabindex", 0);
          }
        }
        async.microTask.run(() => {
          for (var j = 1; j <= this.columns.length; j++) {
            if (this.shadowRoot.querySelector("#col" + j) !== undefined) {
              this.shadowRoot
                .querySelector("#col" + j)
                .addEventListener("drop", this.dropEvent.bind(this));
              this.shadowRoot
                .querySelector("#col" + j)
                .addEventListener("dragstart", this.dragStart.bind(this));
              this.shadowRoot
                .querySelector("#col" + j)
                .addEventListener("dragend", this.dragEnd.bind(this));
              this.shadowRoot
                .querySelector("#col" + j)
                .addEventListener("dragover", function(e) {
                  e.preventDefault();
                });
              this.shadowRoot
                .querySelector("#col" + j)
                .setAttribute("data-draggable", true);
            }
          }
        });
      }
      // flipping from true to false
      else if (!newValue && oldValue) {
        // walk the children and apply the draggable state needed
        for (var i in children) {
          if (typeof children[i].tagName !== typeof undefined) {
            children[i].removeEventListener("drop", this.dropEvent.bind(this));
            children[i].removeEventListener(
              "dragstart",
              this.dragStart.bind(this)
            );
            children[i].removeEventListener("dragend", this.dragEnd.bind(this));
            children[i].removeEventListener("dragover", function(e) {
              e.preventDefault();
            });
            children[i].removeAttribute("draggable");
            children[i].removeAttribute("data-draggable");
            children[i].removeAttribute("tabindex");
          }
        }
        async.microTask.run(() => {
          for (var j = 1; j <= this.columns.length; j++) {
            if (this.shadowRoot.querySelector("#col" + j) !== undefined) {
              this.shadowRoot
                .querySelector("#col" + j)
                .removeEventListener("drop", this.dropEvent.bind(this));
              this.shadowRoot
                .querySelector("#col" + j)
                .removeEventListener("dragstart", this.dragStart.bind(this));
              this.shadowRoot
                .querySelector("#col" + j)
                .removeEventListener("dragend", this.dragEnd.bind(this));
              this.shadowRoot
                .querySelector("#col" + j)
                .removeEventListener("dragover", function(e) {
                  e.preventDefault();
                });
              this.shadowRoot
                .querySelector("#col" + j)
                .removeAttribute("data-draggable");
            }
          }
        });
      }
    }
  },

  /**
   * Drop an item onto another
   */
  dropEvent: function(e) {
    var normalizedEvent = dom(e);
    var local = normalizedEvent.localTarget;
    // if we have a slot on what we dropped into then we need to mirror that item
    // and place ourselves below it in the DOM
    if (
      typeof this.__activeItem !== typeof undefined &&
      typeof local !== typeof undefined &&
      local.getAttribute("slot") != null &&
      this.__activeItem !== local
    ) {
      this.__activeItem.setAttribute("slot", local.getAttribute("slot"));
      dom(this).insertBefore(this.__activeItem, local);
      // ensure that if we caught this event we process it
      e.preventDefault();
      e.stopPropagation();
    }
    // special case for dropping on an empty column or between items
    // which could involve a miss on the column
    else if (local.tagName === ".column") {
      var col = local.id.replace("col", "");
      this.__activeItem.setAttribute("slot", "col-" + col);
      dom(this).appendChild(this.__activeItem);
      // ensure that if we caught this event we process it
      e.preventDefault();
      e.stopPropagation();
    }
    let children = dom(this).children;
    // walk the children and apply the draggable state needed
    for (var i in children) {
      if (typeof children[i].classList !== typeof undefined) {
        children[i].classList.remove("mover");
      }
    }
    for (var j = 1; j <= this.columns.length; j++) {
      if (this.shadowRoot.querySelector("#col" + j) !== undefined) {
        this.shadowRoot.querySelector("#col" + j).classList.remove("mover");
      }
    }
    // position arrows / set focus in case the DOM got updated above
    setTimeout(() => {
      this.positionArrows(this.__activeItem);
      this.__activeItem.focus();
    }, 100);
  },

  /**
   * Start a drag event, this is an element being dragged
   */
  dragStart: function(e) {
    let children = dom(this).children;
    // walk the children and apply the draggable state needed
    for (var i in children) {
      if (typeof children[i].classList !== typeof undefined) {
        children[i].classList.add("mover");
      }
    }
    for (var j = 1; j <= this.columns.length; j++) {
      if (this.shadowRoot.querySelector("#col" + j) !== undefined) {
        this.shadowRoot.querySelector("#col" + j).classList.add("mover");
      }
    }
  },

  /**
   * When we end dragging ensure we remove the mover class.
   */
  dragEnd: function(e) {
    let children = dom(this).children;
    // walk the children and apply the draggable state needed
    for (var i in children) {
      if (typeof children[i].classList !== typeof undefined) {
        children[i].classList.remove("mover");
      }
    }
    for (var j = 1; j <= this.columns.length; j++) {
      if (this.shadowRoot.querySelector("#col" + j) !== undefined) {
        this.shadowRoot.querySelector("#col" + j).classList.remove("mover");
      }
    }
  },
  /**
   * Attached to the DOM, now fire.
   */
  attached: function() {
    let root = this;
    // listen for HAX if it's around
    document.body.addEventListener(
      "hax-store-property-updated",
      root._haxStorePropertyUpdated.bind(root)
    );
    // listen for HAX insert events if it exists
    document.body.addEventListener(
      "hax-insert-content",
      root.haxInsertContent.bind(root)
    );
    window.ResponsiveUtility.requestAvailability();
    window.dispatchEvent(
      new CustomEvent("responsive-element", {
        detail: {
          element: root,
          attribute: "responsive-size",
          relativeToParent: true
        }
      })
    );
    // Establish hax property binding
    let options = {},
      layouts = Object.keys(root.layouts),
      getOptions = function() {
        //loop through all the supplied layouts to get the HAX layout options & descriptions
        for (let i = 0; i < layouts.length; i++) {
          options[layouts[i]] = root.layouts[layouts[i]].columnLayout;
        }
      };
    getOptions();
    let props = {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      settings: {
        quick: [],
        configure: [
          {
            property: "layout",
            title: "Column Layout",
            description:
              "Style to present these items (may change for small screens)",
            inputMethod: "select",
            options: options
          }
        ],
        advanced: []
      },
      saveOptions: {
        unsetAttributes: ["__active-item", "edit-mode"]
      }
    };
    root.setHaxProperties(props);
  },

  /**
   * Insert event noticed by HAX
   */
  haxInsertContent: function(e) {
    // see if WE are the thing that's active when insert was fired
    if (this === window.HaxStore.instance.activeContainerNode) {
      // trick events into rebinding since this event is only possible
      // when we are in an edit state
      this.editMode = false;
      // delay and then set it back, re-applying all events
      setTimeout(() => {
        this.editMode = true;
        // reposition arrows on what had active status
        this.positionArrows(this.__activeItem);
        // focus which then hax will kick in
        this.__activeItem.focus();
      }, 250);
    }
  },

  /**
   * Store updated, sync.
   */
  _haxStorePropertyUpdated: function(e) {
    if (
      e.detail &&
      typeof e.detail.value !== typeof undefined &&
      e.detail.property
    ) {
      if (typeof e.detail.value === "object") {
        this.set(e.detail.property, null);
      }
      this.set(e.detail.property, e.detail.value);
    }
  }
});
export { GridPlate };
