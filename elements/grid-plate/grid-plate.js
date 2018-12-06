import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import * as async from "@polymer/polymer/lib/utils/async.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/responsive-grid/lib/responsive-grid-row.js";
import "@lrnwebcomponents/responsive-grid/lib/responsive-grid-col.js";
/**
`grid-plate`
A grid plate based on a layout that manipulates it.

@demo demo/index.html

@microcopy - the mental model for this element
 -

*/
let GridPlate = Polymer({
  _template: html`
    <custom-style>
      <style is="custom-style" include="simple-colors">
        :host {
          display: block;
        }

        responsive-grid-col {
          --responsive-grid-col-inner: {
            padding-left: 0;
            padding-right: 0;
          }
        }

        responsive-grid-row {
          --responsive-grid-row-inner: {
            margin-left: 0;
            margin-right: 0;
          }
        }

        :host([edit-mode]) responsive-grid-col.mover {
          min-height: 150px;
          background-color: #d1d1d1;
        }

        :host responsive-grid-row ::slotted(*) .mover,
        :host responsive-grid-col[data-draggable].mover {
          outline: 2px dotted #d1d1d1;
          outline-offset: 2px;
          background-color: rgba(240, 240, 240, 0.2);
        }

        :host responsive-grid-row ::slotted(*) .active-item {
          outline: 2px dashed #aaaaaa !important;
          outline-offset: 2px;
          background-color: rgba(220, 220, 220, 0.6) !important;
        }

        :host responsive-grid-row ::slotted(*) [data-draggable]:focus,
        :host responsive-grid-row ::slotted(*) [data-draggable]:hover,
        :host responsive-grid-row ::slotted(*) [data-draggable]:active {
          outline: 2px dotted #d1d1d1;
          outline-offset: 2px;
          background-color: rgba(240, 240, 240, 0.2);
          cursor: move !important;
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
      ></paper-icon-button>
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
    <responsive-grid-row gutter="0">
      <template is="dom-if" if="[[!hideCol1]]" strip-whitespace>
        <responsive-grid-col
          id="col1"
          style\$="background-color:[[__col1Color]];"
          xl\$="[[col1_xl]]"
          lg\$="[[col1_lg]]"
          md\$="[[col1_md]]"
          sm\$="[[col1_sm]]"
          xs\$="[[col1_xs]]"
        >
          <slot name="col-1"></slot>
        </responsive-grid-col>
      </template>
      <template is="dom-if" if="[[!hideCol2]]" strip-whitespace>
        <responsive-grid-col
          id="col2"
          style\$="background-color:[[__col2Color]];"
          xl\$="[[col2_xl]]"
          lg\$="[[col2_lg]]"
          md\$="[[col2_md]]"
          sm\$="[[col2_sm]]"
          xs\$="[[col2_xs]]"
        >
          <slot name="col-2"></slot>
        </responsive-grid-col>
      </template>
      <template is="dom-if" if="[[!hideCol3]]" strip-whitespace>
        <responsive-grid-col
          id="col3"
          style\$="background-color:[[__col3Color]];"
          xl\$="[[col3_xl]]"
          lg\$="[[col3_lg]]"
          md\$="[[col3_md]]"
          sm\$="[[col3_sm]]"
          xs\$="[[col3_xs]]"
        >
          <slot name="col-3"></slot>
        </responsive-grid-col>
      </template>
      <template is="dom-if" if="[[!hideCol4]]" strip-whitespace>
        <responsive-grid-col
          id="col4"
          style\$="background-color:[[__col4Color]];"
          xl\$="[[col4_xl]]"
          lg\$="[[col4_lg]]"
          md\$="[[col4_md]]"
          sm\$="[[col4_sm]]"
          xs\$="[[col4_xs]]"
        >
          <slot name="col-4"></slot>
        </responsive-grid-col>
      </template>
      <responsive-grid-col xl="12" lg="12" md="12" sm="12" xs="12">
        <slot></slot>
      </responsive-grid-col>
    </responsive-grid-row>
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
     * Predefined layouts
     */
    layout: {
      type: String,
      value: "12",
      observer: "_layoutChanged"
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
     * Color handling can happen two different ways
     * either as a whole like blue/blue/blue/blue or
     * per column.
     */
    colors: {
      type: String,
      value: ""
    },
    col1Color: {
      type: String,
      value: ""
    },
    col2Color: {
      type: String,
      value: ""
    },
    col3Color: {
      type: String,
      value: ""
    },
    col4Color: {
      type: String,
      value: ""
    },
    /**
     * Actually applies the colors correctly between the two methods
     */
    _colors: {
      type: String,
      computed:
        "_colorCreation(colors, col1Color, col2Color, col3Color, col4Color)",
      observer: "_colColors"
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
   * Move the active element based on which button got pressed.
   */
  moveActiveElement: function(e) {
    var normalizedEvent = dom(e);
    var local = normalizedEvent.localTarget;
    let col = this.__activeItem.getAttribute("slot").split("-");
    let max = 1;
    // calcuate max columns based on the layout defined
    let cols = [1, 2, 3, 4];
    for (var j in cols) {
      if (!this["hideCol" + cols[j]]) {
        max = cols[j];
      }
    }
    // see if this was an up down left or right movement
    switch (local.id) {
      case "up":
        // ensure we can go up
        if (this.__activeItem.previousElementSibling !== null) {
          dom(this).insertBefore(
            this.__activeItem,
            this.__activeItem.previousElementSibling
          );
        }
        break;
      case "down":
        if (this.__activeItem.nextElementSibling !== null) {
          dom(this).insertBefore(
            this.__activeItem.nextElementSibling,
            this.__activeItem
          );
        }
        break;
      case "left":
        if (parseInt(col[1]) > 1) {
          this.__activeItem.setAttribute(
            "slot",
            "col-" + (parseInt(col[1]) - 1)
          );
          dom(this).appendChild(this.__activeItem);
        }
        break;
      case "right":
        if (parseInt(col[1]) < max) {
          this.__activeItem.setAttribute(
            "slot",
            "col-" + (parseInt(col[1]) + 1)
          );
          dom(this).appendChild(this.__activeItem);
        }
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
    this.$.up.focus();
    e.preventDefault();
    e.stopPropagation();
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
      this.$.up.disabled = false;
      this.$.down.disabled = false;
      this.$.left.disabled = false;
      this.$.right.disabled = false;
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
      // ensure we disable invalid options contextually
      let col = item.getAttribute("slot").split("-");
      let max = 1;
      // calcuate max columns based on the layout defined
      let cols = [1, 2, 3, 4];
      for (var j in cols) {
        if (!this["hideCol" + cols[j]]) {
          max = cols[j];
        }
      }
      // test for an element above us
      if (item.previousElementSibling === null) {
        this.$.up.disabled = true;
      }
      // test for an element below us
      if (item.nextElementSibling === null) {
        this.$.down.disabled = true;
      }
      // test for a column to the left of us
      if (parseInt(col[1]) === 1) {
        this.$.left.disabled = true;
      }
      // test for a column to the right of us
      if (parseInt(col[1]) === max) {
        this.$.right.disabled = true;
      }
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
          let cols = [1, 2, 3, 4];
          for (var j in cols) {
            if (!this["hideCol" + cols[j]]) {
              this.shadowRoot
                .querySelector("#col" + cols[j])
                .addEventListener("drop", this.dropEvent.bind(this));
              this.shadowRoot
                .querySelector("#col" + cols[j])
                .addEventListener("dragstart", this.dragStart.bind(this));
              this.shadowRoot
                .querySelector("#col" + cols[j])
                .addEventListener("dragend", this.dragEnd.bind(this));
              this.shadowRoot
                .querySelector("#col" + cols[j])
                .addEventListener("dragover", function(e) {
                  e.preventDefault();
                });
              this.shadowRoot
                .querySelector("#col" + cols[j])
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
          let cols = [1, 2, 3, 4];
          for (var j in cols) {
            if (!this["hideCol" + cols[j]]) {
              this.shadowRoot
                .querySelector("#col" + cols[j])
                .removeEventListener("drop", this.dropEvent.bind(this));
              this.shadowRoot
                .querySelector("#col" + cols[j])
                .removeEventListener("dragstart", this.dragStart.bind(this));
              this.shadowRoot
                .querySelector("#col" + cols[j])
                .removeEventListener("dragend", this.dragEnd.bind(this));
              this.shadowRoot
                .querySelector("#col" + cols[j])
                .removeEventListener("dragover", function(e) {
                  e.preventDefault();
                });
              this.shadowRoot
                .querySelector("#col" + cols[j])
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
    else if (local.tagName === "RESPONSIVE-GRID-COL") {
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
    let cols = [1, 2, 3, 4];
    for (var j in cols) {
      if (!this["hideCol" + cols[j]]) {
        this.shadowRoot
          .querySelector("#col" + cols[j])
          .classList.remove("mover");
      }
    }
    // position arrows / set focus in case the DOM got updated above
    setTimeout(() => {
      this.positionArrows(this.__activeItem);
      this.__activeItem.focus();
    }, 100);
  },

  /**
   * Notice colors have changed
   */
  _colorCreation: function(colors, col1, col2, col3, col4) {
    let items = colors.split("/");
    let cols = [col1, col2, col3, col4];
    // merge the two
    for (var i in cols) {
      if (cols[i] != "") {
        items[i] = cols[i];
      }
    }
    return items;
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
    let cols = [1, 2, 3, 4];
    for (var j in cols) {
      if (!this["hideCol" + cols[j]]) {
        this.shadowRoot.querySelector("#col" + cols[j]).classList.add("mover");
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
    let cols = [1, 2, 3, 4];
    for (var j in cols) {
      if (!this["hideCol" + cols[j]]) {
        this.shadowRoot
          .querySelector("#col" + cols[j])
          .classList.remove("mover");
      }
    }
  },

  /**
   * Split a color value based on referencing the code
   * as color-number for name of the color hypthen numberical array position
   */
  splitColor: function(value) {
    if (value != "" && typeof SimpleColors.colors[value] !== typeof undefined) {
      return SimpleColors.colors[value][0];
    }
    return value;
  },

  /**
   * Generate the correct color code form the column
   */
  _colColors: function(newValue, oldValue) {
    // don't bother with things that are null
    if (newValue != "") {
      for (var i in newValue) {
        this["__col" + (parseInt(i) + 1) + "Color"] = this.splitColor(
          newValue[i]
        );
      }
    }
  },

  /**
   * See layout has changed, update all the possible data values
   */
  _layoutChanged: function(layout) {
    let items = layout.split("/");
    this.__colCount = items.length;
    switch (items.length) {
      case 1:
        this.hideCol1 = false;
        this.hideCol2 = true;
        this.hideCol3 = true;
        this.hideCol4 = true;
        break;
      case 2:
        this.hideCol1 = false;
        this.hideCol2 = false;
        this.hideCol3 = true;
        this.hideCol4 = true;
        break;
      case 3:
        this.hideCol1 = false;
        this.hideCol2 = false;
        this.hideCol3 = false;
        this.hideCol4 = true;
        break;
      case 4:
        this.hideCol1 = false;
        this.hideCol2 = false;
        this.hideCol3 = false;
        this.hideCol4 = false;
        break;
    }
    for (var i in items) {
      let col = Number(i) + 1;
      this["col" + col + "_xl"] = items[i];
      this["col" + col + "_lg"] = items[i];
      this["col" + col + "_md"] = items[i];
      this["col" + col + "_sm"] = items[i];
      this["col" + col + "_xs"] = items[i];
    }
  },
  /**
   * Attached to the DOM, now fire.
   */
  attached: function() {
    // listen for HAX if it's around
    document.body.addEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
    // listen for HAX insert events if it exists
    document.body.addEventListener(
      "hax-insert-content",
      this.haxInsertContent.bind(this)
    );
    // quickly build a basic selection array from known color names
    var colorOptions = [];
    for (var i in SimpleColors.colors) {
      colorOptions[i] = i;
    }
    // Establish hax property binding
    let props = {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      settings: {
        quick: [],
        configure: [
          {
            property: "layout",
            title: "Layout",
            description: "Style to present these items",
            inputMethod: "select",
            options: {
              "12": "1 col, full width",
              "8/4": "2 cols, 66% / 33% split",
              "6/6": "2 cols, 50% split",
              "4/8": "2 cols, 33% / 66% split",
              "4/4/4": "3 cols, 33% each",
              "3/3/3/3": "4 cols, 25% each"
            }
          },
          {
            property: "col1Color",
            title: "Col 1 color",
            description: "Color for the 1st column",
            inputMethod: "select",
            options: colorOptions
          },
          {
            property: "col2Color",
            title: "Col 2 color",
            description: "Color for the 1st column",
            inputMethod: "select",
            options: colorOptions
          },
          {
            property: "col3Color",
            title: "Col 3 color",
            description: "Color for the 1st column",
            inputMethod: "select",
            options: colorOptions
          },
          {
            property: "col4Color",
            title: "Col 4 color",
            description: "Color for the 1st column",
            inputMethod: "select",
            options: colorOptions
          }
        ],
        advanced: []
      },
      saveOptions: {
        unsetAttributes: ["__active-item", "_colors", "edit-mode"]
      }
    };

    this.setHaxProperties(props);
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
