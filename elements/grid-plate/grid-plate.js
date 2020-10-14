import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/responsive-utility/responsive-utility.js";
// need to make this an object so that HAX can listen for it correctly
class GridPlateLayoutOptions {
  constructor() {
    this.resizeTimer = null;
    this.activeItem = null;
    this.layouts = {
      1: {
        columnLayout: "1: full width",
        xs: ["100%"],
        sm: ["100%"],
        md: ["100%"],
        lg: ["100%"],
        xl: ["100%"],
      },
      "1-1": {
        columnLayout: "2: equal width",
        xs: ["100%", "100%"],
        sm: ["50%", "50%"],
        md: ["50%", "50%"],
        lg: ["50%", "50%"],
        xl: ["50%", "50%"],
      },
      "2-1": {
        columnLayout: "2: wide & narrow",
        xs: ["100%", "100%"],
        sm: ["50%", "50%"],
        md: ["66.6666667%", "33.3333337%"],
        lg: ["66.6666667%", "33.3333337%"],
        xl: ["66.6666667%", "33.3333337%"],
      },
      "1-2": {
        columnLayout: "2: narrow & wide",
        xs: ["100%", "100%"],
        sm: ["50%", "50%"],
        md: ["33.3333333%", "66.6666667%"],
        lg: ["33.3333333%", "66.6666667%"],
        xl: ["33.3333333%", "66.6666667%"],
      },
      "3-1": {
        columnLayout: "2: wider & narrower",
        xs: ["100%", "100%"],
        sm: ["50%", "50%"],
        md: ["75%", "25%"],
        lg: ["75%", "25%"],
        xl: ["75%", "25%"],
      },
      "1-3": {
        columnLayout: "2: narrower & wider",
        xs: ["100%", "100%"],
        sm: ["50%", "50%"],
        md: ["25%", "75%"],
        lg: ["25%", "75%"],
        xl: ["25%", "75%"],
      },
      "1-1-1": {
        columnLayout: "3: equal width",
        xs: ["100%", "100%", "100%"],
        sm: ["100%", "100%", "100%"],
        md: ["33.3333333%", "33.3333333%", "33.3333333%"],
        lg: ["33.3333333%", "33.3333333%", "33.3333333%"],
        xl: ["33.3333333%", "33.3333333%", "33.3333333%"],
      },
      "2-1-1": {
        columnLayout: "3: wide, narrow, and narrow",
        xs: ["100%", "100%", "100%"],
        sm: ["100%", "50%", "50%"],
        md: ["50%", "25%", "25%"],
        lg: ["50%", "25%", "25%"],
        xl: ["50%", "25%", "25%"],
      },
      "1-2-1": {
        columnLayout: "3: narrow, wide, and narrow",
        xs: ["100%", "100%", "100%"],
        sm: ["100%", "100%", "100%"],
        md: ["25%", "50%", "25%"],
        lg: ["25%", "50%", "25%"],
        xl: ["25%", "50%", "25%"],
      },
      "1-1-2": {
        columnLayout: "3: narrow, narrow, and wide",
        xs: ["100%", "100%", "100%"],
        sm: ["50%", "50%", "100%"],
        md: ["25%", "25%", "50%"],
        lg: ["25%", "25%", "50%"],
        xl: ["25%", "25%", "50%"],
      },
      "1-1-1-1": {
        columnLayout: "4: equal width",
        xs: ["100%", "100%", "100%", "100%"],
        sm: ["50%", "50%", "50%", "50%"],
        md: ["25%", "25%", "25%", "25%"],
        lg: ["25%", "25%", "25%", "25%"],
        xl: ["25%", "25%", "25%", "25%"],
      },
      "1-1-1-1-1": {
        columnLayout: "5: equal width",
        xs: ["100%", "100%", "100%", "100%", "100%"],
        sm: ["50%", "50%", "50%", "50%", "50%"],
        md: ["20%", "20%", "20%", "20%", "20%"],
        lg: ["20%", "20%", "20%", "20%", "20%"],
        xl: ["20%", "20%", "20%", "20%", "20%"],
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
          "33.3333333%",
        ],
        lg: [
          "16.6666667%",
          "16.6666667%",
          "16.6666667%",
          "16.6666667%",
          "16.6666667%",
          "16.6666667%",
        ],
        xl: [
          "16.6666667%",
          "16.6666667%",
          "16.6666667%",
          "16.6666667%",
          "16.6666667%",
          "16.6666667%",
        ],
      },
    };
    this.options = {};
    let layoutFlip = Object.keys(this.layouts);
    // loop through all the supplied layouts to get the HAX layout options & descriptions
    for (let i = 1; i < layoutFlip.length; i++) {
      this.options[layoutFlip[i]] = this.layouts[layoutFlip[i]].columnLayout;
    }
  }
}
/**
 * `grid-plate`
 * `A grid plate based on a layout that manipulates it.`
 * @demo demo/index.html
 * @element grid-plate
 */
class GridPlate extends LitElement {
  /**
   * LitElement render styles
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          --grid-plate-row-margin: 0px;
          --grid-plate-row-padding: 0px;
          --grid-plate-item-margin: 15px;
          --grid-plate-editable-border-color: var(
            --simple-colors-default-theme-grey-4,
            #dddddd
          );
          --grid-plate-active-border-color: var(
            --simple-colors-default-theme-grey-4,
            #eeeeee
          );
          --grid-plate-target-background-color: inherit;
          --grid-plate-possible-target-background-color: transparent;
          --grid-plate-selected-background-color: #ffffff;
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
        }
        :host([edit-mode]) .column {
          min-height: 150px;
          transition: 0.2s color linear, 0.2s background-color linear;
        }
        :host([edit-mode]) {
          min-height: 150px;
        }
        :host([edit-mode]) .column {
          outline: 1px dashed var(--grid-plate-editable-border-color);
        }
        :host .column:empty[style="min-height: unset;"] {
          display: none;
          outline: none;
        }
        :host([edit-mode]) .column[style="min-height: unset;"]:not(:empty) {
          display: block;
          opacity: 0.4;
        }
        :host([edit-mode])
          .column[style="min-height: unset;"]:not(:empty):hover {
          opacity: 1;
        }
        :host([edit-mode])
          .column[style="min-height: unset;"]:not(:empty):before {
          margin: var(--grid-plate-item-margin);
          color: red;
          font-size: 14px;
          font-weight: bold;
          padding: 0px;
        }
        :host .column ::slotted(*) {
          margin: var(--grid-plate-item-margin);
          padding: var(--grid-plate-item-margin);
          max-width: calc(100% - 60px);
          max-width: -webkit-fill-available;
          transition: 0.2s color linear, 0.2s background-color linear;
        }
        :host([edit-mode]) .column ::slotted(img) {
          display: block;
        }
        :host([edit-mode]) .column ::slotted(.grid-plate-active-item) {
          outline: 1px solid var(--grid-plate-active-border-color);
          background-color: var(--grid-plate-selected-background-color);
        }
        :host([edit-mode]) .column ::slotted(ol.grid-plate-active-item),
        :host([edit-mode]) .column ::slotted(ul.grid-plate-active-item) {
          outline-offset: 8px;
        }
        :host([edit-mode]) .column ::slotted(*:focus),
        :host([edit-mode]) .column ::slotted(*:hover),
        :host([edit-mode]) .column ::slotted(*:active) {
          outline: 1px solid var(--grid-plate-editable-border-color);
        }
        :host([edit-mode]) .column ::slotted(ol:focus),
        :host([edit-mode]) .column ::slotted(ol:hover),
        :host([edit-mode]) .column ::slotted(ol:active),
        :host([edit-mode]) .column ::slotted(ul:focus),
        :host([edit-mode]) .column ::slotted(ul:hover),
        :host([edit-mode]) .column ::slotted(ul:active) {
          outline-offset: 8px;
        }
        :host([edit-mode]) ::slotted(*.hax-moving) {
          outline: 1px solid var(--simple-colors-default-theme-cyan-7, #009dc7);
        }
        :host([edit-mode].hax-hovered) .column ::slotted(img),
        :host([edit-mode].hax-hovered) .column ::slotted(*):before {
          background-color: var(
            --grid-plate-target-background-color
          ) !important;
          outline: solid 1px var(--grid-plate-active-border-color);
          content: " ";
          width: 100%;
          display: block;
          position: relative;
          margin: -20px 0 0 0;
          z-index: 2;
          height: 20px;
        }
        :host([edit-mode]) .column.hax-hovered {
          background-color: var(
            --grid-plate-target-background-color
          ) !important;
          outline: solid 1px var(--grid-plate-active-border-color);
          z-index: 2;
        }
      `,
    ];
  }
  constructor() {
    super();
    this.droppable = false;
    this.ignoreHax = false;
    this.breakpointSm = 900;
    this.breakpointMd = 1200;
    this.breakpointLg = 1500;
    this.breakpointXl = 1800;
    this.columns = 6;
    this.disableResponsive = false;
    this.editMode = false;
    if (window.HaxStore && window.HaxStore.instance) {
      this.editMode = window.HaxStore.instance.editMode;
    }
    this.layout = "1-1";
    this.layouts = new GridPlateLayoutOptions().layouts;
    this.responsiveSize = "xs";
    setTimeout(() => {
      this.addEventListener("focusin", this._focusIn.bind(this));
    }, 0);
    window.ResponsiveUtility.requestAvailability();
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <div class="row">
        <div
          class="column"
          id="col1"
          data-label="column 1"
          .style="${this._getColumnWidth(0, this.__columnWidths)}"
        >
          <slot name="col-1"></slot>
        </div>
        <div
          class="column"
          id="col2"
          data-label="column 2"
          .style="${this._getColumnWidth(1, this.__columnWidths)}"
        >
          <slot name="col-2"></slot>
        </div>
        <div
          class="column"
          id="col3"
          data-label="column 3"
          .style="${this._getColumnWidth(2, this.__columnWidths)}"
        >
          <slot name="col-3"></slot>
        </div>
        <div
          class="column"
          id="col4"
          data-label="column 4"
          .style="${this._getColumnWidth(3, this.__columnWidths)}"
        >
          <slot name="col-4"></slot>
        </div>
        <div
          class="column"
          id="col5"
          data-label="column 5"
          .style="${this._getColumnWidth(4, this.__columnWidths)}"
        >
          <slot name="col-5"></slot>
        </div>
        <div
          class="column"
          id="col6"
          data-label="column 6"
          .style="${this._getColumnWidth(5, this.__columnWidths)}"
        >
          <slot name="col-6"></slot>
        </div>
      </div>
    `;
  }
  static get tag() {
    return "grid-plate";
  }
  /**
   * Validate the slot name
   */
  validateElementSlot(node) {
    return ["col-1", "col-2", "col-3", "col-4", "col-5", "col-6"].includes(
      node.getAttribute("slot")
    );
  }
  /**
   * HTMLElement
   */
  connectedCallback() {
    super.connectedCallback();
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // only need to apply this when we're in editMode
        // this implies something was added dynamically or drag and drop
        // from outside this element or dragging between grid plates
        // so we need to disconnect the handlers from here and pick them
        // up in the new plate
        if (this.editMode) {
          mutation.addedNodes.forEach((node) => {
            if (node.tagName) {
              // verify this has a slot set otherwise we need to set one on the fly
              // otherwise this won't show up. This could be incorrectly formed HTML
              // DOM that was pushed in via an outside system or edge cases of things
              // dropping in without a slot set in anyway
              // validate slot name, otherwise force it to col-1
              if (
                node.getAttribute("slot") == null ||
                !this.validateElementSlot(node)
              ) {
                if (this.__slot) {
                  node.setAttribute("slot", this.__slot);
                  this.__slot = null;
                } else {
                  node.setAttribute("slot", "col-1");
                }
              }
              // event timeout is to help w/ between grid plate drops
              setTimeout(() => {
                node.addEventListener("drop", this.dropEvent.bind(this));
                node.addEventListener("dragenter", this.dragEnter.bind(this));
                node.addEventListener("dragleave", this.dragLeave.bind(this));
                node.addEventListener("dragend", this.dragEnd.bind(this));
                node.addEventListener("dragover", function (e) {
                  e.preventDefault();
                });
                // UX normalization
                if (node.tagName === "IMG") {
                  node.setAttribute("draggable", false);
                }
                // ensure they can be focused
                node.setAttribute("tabindex", 0);
              }, 50);
            }
          });
          mutation.removedNodes.forEach((node) => {
            if (node.tagName) {
              node.removeEventListener("drop", this.dropEvent.bind(this));
              node.removeEventListener("dragenter", this.dragEnter.bind(this));
              node.removeEventListener("dragleave", this.dragLeave.bind(this));
              node.removeEventListener("dragover", function (e) {
                e.preventDefault();
              });
              if (node.tagName === "IMG") {
                node.removeAttribute("draggable");
              }
              // ensure they can be focused
              node.removeAttribute("tabindex");
            }
          });
        }
      });
    });
    this.observer.observe(this, {
      childList: true,
    });
    // capture keydown events
    window.addEventListener("keydown", this._onKeyDown.bind(this));
    // listen for HAX if it's around
    window.addEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
    // dom loaded, resize to be safe
    window.addEventListener("load", this.resize.bind(this));
    // if we resize, listen and react
  }
  _onKeyDown(e) {
    if (this.editMode && this.getAttribute("contenteditable")) {
      switch (e.key) {
        case "Enter":
          // support HAX text operations should take priority
          if (
            window.HaxStore &&
            window.HaxStore.instance &&
            window.HaxStore.instance.isTextElement(this.activeItem)
          ) {
            this.__slot = this.activeItem.getAttribute("slot");
            return true;
          }
          break;
        // clear active
        case "Escape":
          this.activeItem = null;
          break;
      }
    }
  }
  /**
   * life cycle
   */
  firstUpdated(changedProperties) {
    window.dispatchEvent(
      new CustomEvent("responsive-element", {
        detail: {
          element: this,
          attribute: "responsive-size",
          relativeToParent: false,
          sm: this.breakpointSm,
          md: this.breakpointMd,
          lg: this.breakpointLg,
          xl: this.breakpointXl,
        },
      })
    );
    // apply handlers to the columns themselves
    for (var j = 1; j <= this.columns; j++) {
      if (this.shadowRoot.querySelector("#col" + j) !== undefined) {
        let col = this.shadowRoot.querySelector("#col" + j);
        col.addEventListener("drop", this.dropEvent.bind(this));
        col.addEventListener("dragenter", this.dragEnter.bind(this));
        col.addEventListener("dragleave", this.dragLeave.bind(this));
        col.addEventListener("dragover", function (e) {
          e.preventDefault();
        });
      }
    }
    this.__columnWidths = this._getColumnWidths(
      this.responsiveSize,
      this.layout,
      this.layouts,
      this.disableResponsive
    );
  }
  /**
   * life cycle
   */
  disconnectedCallback() {
    window.removeEventListener("keydown", this._onKeyDown.bind(this));
    // listen for HAX if it's around
    window.removeEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
    window.removeEventListener("load", this.resize.bind(this));
    // clean up mutation observer
    this.observer.disconnect();
    super.disconnectedCallback();
  }
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Grid layout",
        description: "Simple card in a cool retro design",
        icon: "hax:3/3/3/3",
        color: "grey",
        groups: ["Layout"],
        handles: [],
        meta: {
          author: "ELMS:LN",
          owner: "The Pennsylvania State University",
        },
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "layout",
            title: "Column Layout",
            description:
              "Style to present these items (may change for small screens)",
            inputMethod: "select",
            options: new GridPlateLayoutOptions().options,
          },
          {
            property: "disableResponsive",
            title: "Disable responsive",
            description:
              "Check box to force layout to stick regardless of screen breakpoins",
            inputMethod: "boolean",
          },
        ],
        advanced: [
          {
            property: "breakpointSm",
            title: "Small Breakpoint",
            description:
              "Anything less than this number (in pixels) will render with the smallest version of this layout",
            inputMethod: "textfield",
            validationType: "number",
          },
          {
            property: "breakpointMd",
            title: "Medium Breakpoint",
            description:
              "Anything less than this number (in pixels) will render with the small version of this layout",
            inputMethod: "textfield",
            validationType: "number",
          },
          {
            property: "breakpointLg",
            title: "Large Breakpoint",
            description:
              "Anything less than this number (in pixels) will render with the medium version of this layout.",
            inputMethod: "textfield",
            validationType: "number",
          },
          {
            property: "breakpointXl",
            title: "Extra-Large Breakpoint",
            description:
              "Anything less than this number (in pixels) will render with the large version of this layout. Anything greater than or equal to this number will display with the maximum number of columns for this layout.",
            inputMethod: "textfield",
            validationType: "number",
          },
        ],
      },
      saveOptions: {
        unsetAttributes: [
          "grid-plate-active-item",
          "edit-mode",
          "active-item",
          "layouts",
          "columns",
          "options",
          "droppable",
          "ignorehax",
          "activeitem",
          "responsive-width",
        ],
      },
    };
  }
  static get properties() {
    return {
      /**
       * allows other systems to trigger editMode in grid plate via property for D&D
       */
      droppable: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Flag for when using grid-plate in a system WITH hax yet not wanting to
       * be activated (like a HAXcms / other CMS theme layer)
       */
      ignoreHax: {
        type: Boolean,
        attribute: "ignore-hax",
      },
      /**
       * Custom small breakpoint for the layouts; only updated on attached
       */
      breakpointSm: {
        type: Number,
        attribute: "breakpoint-sm",
      },
      /**
       * Custom medium breakpoint for the layouts; only updated on attached
       */
      breakpointMd: {
        type: Number,
        attribute: "breakpoint-md",
      },
      /**
       * Custom large breakpoint for the layouts; only updated on attached
       */
      breakpointLg: {
        type: Number,
        attribute: "breakpoint-lg",
      },
      /**
       * Custom extra-large breakpoint for the layouts; only updated on attached
       */
      breakpointXl: {
        type: Number,
        attribute: "breakpoint-xl",
      },
      /**
       * number of columns at this layout / responsive size
       */
      columns: {
        type: Number,
        reflect: true,
      },
      /**
       * disables responsive layouts for HAX preview
       */
      disableResponsive: {
        type: Boolean,
        attribute: "disable-responsive",
      },
      /**
       * If the grid plate is in a state where its items
       * can be modified as far as order or column placement.
       */
      editMode: {
        reflect: true,
        type: Boolean,
        attribute: "edit-mode",
      },
      /**
       * an object with a layout's column sizes
       * at the current responsive width
       */
      layout: {
        type: String,
        reflect: true,
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
  }```
      */
      layouts: {
        type: Object,
      },
      /**
       * Responsive size as `xs`, `sm`, `md`, `lg`, or `xl`
       */
      responsiveSize: {
        type: String,
        reflect: true,
        attribute: "responsive-size",
      },
      /**
       * Track active item
       */
      activeItem: {
        type: Object,
        attribute: "active-item",
      },
      /**
       * name of selected layout
       */
      __columnWidths: {
        type: String,
      },
    };
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      // if any of these changed, update col widths
      if (
        ["responsiveSize", "layout", "layouts", "disableResponsive"].includes(
          propName
        )
      ) {
        this.__columnWidths = this._getColumnWidths(
          this.responsiveSize,
          this.layout,
          this.layouts,
          this.disableResponsive
        );
      }
      switch (propName) {
        // observer
        case "droppable":
          this._droppableChanged(this[propName], oldValue);
          break;
        // observer
        case "editMode":
          this._editModeChanged(this[propName], oldValue);
          this.resize();
          break;
        // observer
        case "activeItem":
          this._activeItemChanged(this[propName], oldValue);
          break;
        // observer, ensure we are sized correctly after widths change
        case "__columnWidths":
          // widths changed because of layout somehow, wait for the resize transition
          // to have processed, then fire a resize event which we are listening
          this.resize();
          break;
        case "disableResponsive":
          // fire an event that this is a core piece of the system
          this.dispatchEvent(
            new CustomEvent("disable-responsive-changed", {
              detail: this[propName],
            })
          );
          break;
      }
    });
  }
  resize() {
    window.dispatchEvent(new Event("resize"));
  }
  /**
   * Implements preProcessHaxInsertContent to clean up output on save
   */
  preProcessHaxInsertContent(detail) {
    // ensure this is wiped to avoid issues in building
    delete detail.properties.activeItem;
    return detail;
  }

  _droppableChanged(newValue) {
    if (newValue) {
      this.editMode = true;
    }
  }
  /**
   * Determines if the item can move a set number of slots.
   *
   * @param {object} the item
   * @param {number} -1 for left or +1 for right
   * @returns {boolean} if the item can move a set number of slots
   */
  canMoveSlot(item, before) {
    let dir = before ? -1 : 1,
      max = this.shadowRoot.querySelectorAll(".column").length,
      col = item.getAttribute("slot").split("-"),
      dest = parseInt(col[1]) + dir;
    return dest >= 1 && dest <= max;
  }
  /**
   * Moves an item a set number of slots.
   *
   * @param {object} the item
   * @param {number} -1 for left or +1 for right
   */
  moveSlot(item, before) {
    let dir = before ? -1 : 1,
      col = item.getAttribute("slot").split("-"),
      dest = parseInt(col[1]) + dir;
    item.setAttribute("slot", "col-" + dest);
  }

  /**
   * Determines if the item can move a set number of slots.
   *
   * @param {object} the item
   * @param {boolean} move item before previous? (false for move item after next)
   * @returns {boolean} if the item can move a set number of slots
   */
  canMoveOrder(item, before) {
    let slot = item.getAttribute("slot");
    let nodes = this.shadowRoot
      .querySelector(`slot[name='${slot}']`)
      .assignedNodes({ flatten: true });
    let target = null,
      position = 0;
    for (var i in nodes) {
      if (item === nodes[i]) {
        position = i;
      }
    }
    if (before && parseInt(position) - 1 >= 0) {
      target = nodes[parseInt(position) - 1];
    } else if (!before && parseInt(position) + 1 <= nodes.length - 1) {
      target = nodes[parseInt(position) + 1];
    }
    return target !== null && typeof target !== typeof undefined;
  }
  /**
   * Moves an item's order within a slot.
   *
   * @param {object} the item
   * @param {boolean} move item before previous? (false for move item after next)
   */
  moveOrder(item, before = true) {
    let slot = item.getAttribute("slot");
    let nodes = this.shadowRoot
      .querySelector(`slot[name='${slot}']`)
      .assignedNodes({ flatten: true });
    let target = null,
      position = 0;
    for (var i in nodes) {
      if (item === nodes[i]) {
        position = i;
      }
    }
    if (before) {
      target = nodes[parseInt(position) - 1];
      this.insertBefore(this.activeItem, target);
    } else {
      target = nodes[parseInt(position) + 1];
      this.insertBefore(target, this.activeItem);
    }
  }

  /**
   * Notice changes to what's active and ensure UX associated w/ it is visble
   */
  _activeItemChanged(newValue, oldValue) {
    // remove anything currently with the active class
    this.querySelectorAll(".grid-plate-active-item").forEach((el) => {
      el.classList.remove("grid-plate-active-item");
    });
    if (typeof newValue !== typeof undefined && newValue != null) {
      newValue.classList.add("grid-plate-active-item");
    }
    // if we had a previous value then remove the active item class
    if (typeof oldValue !== typeof undefined && oldValue != null) {
      oldValue.blur();
    }
  }
  /**
   * gets the column widths based on selected layout and current responsive width
   *
   * @param {string} a string that describes the current responsive width
   * @param {string} the name of selected layout
   * @param {object} predefined layouts of column sizes and various responsive widths
   * @param {boolean} disable responsive sizing?
   * @returns {object} an object with a layout's column sizes at the current responsive width
   */
  _getColumnWidths(
    responsiveSize = "sm",
    layout = "1-1",
    layouts,
    disableResponsive
  ) {
    if (layouts) {
      let newl = layouts[layout],
        //how old layout names map to the new ones
        oldLayouts = {
          12: "1",
          "8/4": "2-1",
          "6/6": "1-1",
          "4/8": "1-2",
          "4/4/4": "1-1-1",
          "3/3/3/3": "1-1-1-1",
        },
        size = disableResponsive !== false ? "xl" : responsiveSize;
      let oldl = oldLayouts[layout];
      if (newl !== undefined && newl[size] !== undefined) {
        //return the layout
        return layouts[layout][size];
      } else if (
        layouts[oldl] !== undefined &&
        layouts[oldl][size] !== undefined
      ) {
        //return new layout that maps to old one
        return layouts[oldl][size];
      } else if (typeof layouts["1-1"] !== typeof undefined) {
        //return 2-column layout
        return layouts["1-1"][size];
      }
    }
  }

  /**
   * gets a given column's current width based on layout and current responsive width
   *
   * @param {number} the index of the column
   * @param {object} an object with a layout's column sizes at the current responsive width
   * @returns {string} a given column's current width based on layout and current responsive width
   */
  _getColumnWidth(column, __columnWidths) {
    return __columnWidths !== undefined && __columnWidths[column] !== undefined
      ? "width:" + __columnWidths[column]
      : "min-height: unset";
  }
  /**
   * gets a given column's current width based on layout and current responsive width
   *
   * @param {string} the name of selected layout
   * @returns {number} the number of columns in this layout
   */
  _getColumns(__columnWidths) {
    return __columnWidths.length;
  }
  /**
   * Focus / tab / click event normalization
   */
  _focusIn(e) {
    if (this.editMode) {
      var local = e.target;
      // only activate if we touch something that's in the slot of the grid plate
      if (local.parentNode === this) {
        this.activeItem = local;
      }
    }
  }
  /**
   * Notice edit state has changed
   */
  _editModeChanged(newValue, oldValue) {
    // flipping from false to true
    if (newValue && !oldValue) {
      let children = this.children;
      // walk the children and apply the draggable state needed
      for (var i in children) {
        if (children[i].tagName) {
          children[i].addEventListener("drop", this.dropEvent.bind(this));
          children[i].addEventListener("dragenter", this.dragEnter.bind(this));
          children[i].addEventListener("dragleave", this.dragLeave.bind(this));
          children[i].addEventListener("dragover", function (e) {
            e.preventDefault();
          });
          if (children[i].tagName === "IMG") {
            children[i].setAttribute("draggable", false);
          }
          // ensure they can be focused
          children[i].setAttribute("tabindex", 0);
        }
      }
    }
    // flipping from true to false
    else if (!newValue && oldValue) {
      // unset active to clean up state
      this.activeItem = null;
      let children = this.children;
      // walk the children and remove the draggable state needed
      for (var i in children) {
        if (typeof children[i].tagName !== typeof undefined) {
          children[i].removeEventListener("drop", this.dropEvent.bind(this));
          children[i].removeEventListener(
            "dragenter",
            this.dragEnter.bind(this)
          );
          children[i].removeEventListener(
            "dragleave",
            this.dragLeave.bind(this)
          );
          children[i].removeEventListener("dragover", function (e) {
            e.preventDefault();
          });
          if (children[i].tagName === "IMG") {
            children[i].removeAttribute("draggable");
          }
          children[i].removeAttribute("tabindex");
        }
      }
    }
  }
  /**
   * Enter an element, meaning we've over it while dragging
   */
  dragEnter(e) {
    if (this.editMode) {
      e.preventDefault();
      if (e.target && e.target.classList) {
        e.target.classList.add("hax-hovered");
        this.classList.add("hax-hovered");
      }
    }
  }
  /**
   * Leaving an element while dragging.
   */
  dragLeave(e) {
    if (this.editMode && e.target && e.target.classList) {
      e.target.classList.remove("hax-hovered");
      this.classList.remove("hax-hovered");
    }
  }
  /**
   * Sort children based on slot name
   */
  __sortChildren() {
    try {
      // select all direct children w/ a slot attribute and convert to an Array
      let children = Array.prototype.reduce.call(
        this.children,
        function (acc, e) {
          if (e.slot) {
            acc.push(e);
          }
          return acc;
        },
        []
      );
      // sort the children by slot id being low to high
      children = children.sort(function (a, b) {
        if (
          parseInt(a.getAttribute("slot").split("-")[1]) <
          parseInt(b.getAttribute("slot").split("-")[1])
        ) {
          return -1;
        }
        return 1;
      });
      // loop through and append these back into the grid plate.
      // which will put them in the right order
      children.forEach((el) => {
        // sanity check that we only move things that are a direct child
        if (el.parentNode === this) {
          this.appendChild(el);
        }
      });
    } catch (error) {
      console.warn(error);
    }
  }
  /**
   * Drop an item onto another
   */
  dropEvent(e) {
    if (this.editMode) {
      var target = this.activeItem;
      if (this.__dragTarget) {
        target = this.__dragTarget;
      }
      // support global hax store target
      if (
        window.HaxStore &&
        window.HaxStore.instance &&
        window.HaxStore.instance.ready &&
        window.HaxStore.instance.__dragTarget
      ) {
        target = window.HaxStore.instance.__dragTarget;
        window.HaxStore.instance.__dragTarget = null;
      }
      setTimeout(() => {
        let children = this.querySelectorAll(
          ".hax-hovered, .hax-moving, .grid-plate-active-item"
        );
        // walk the children and apply the draggable state needed
        for (var i in children) {
          if (typeof children[i].classList !== typeof undefined) {
            children[i].classList.remove("hax-hovered", "hax-moving");
          }
        }
        for (var j = 1; j <= this.columns; j++) {
          if (this.shadowRoot.querySelector("#col" + j) !== undefined) {
            this.shadowRoot
              .querySelector("#col" + j)
              .classList.remove("hax-hovered", "hax-moving");
          }
        }
        // support hax and dropping back inside grid plate
        if (
          window.HaxStore &&
          window.HaxStore.instance &&
          window.HaxStore.instance.ready
        ) {
          let childrenHAX = window.HaxStore.instance.activeHaxBody.children;
          window.HaxStore.instance.activeHaxBody.haxMover = false;
          // walk the children and apply the draggable state needed
          for (var i in childrenHAX) {
            if (childrenHAX[i].classList) {
              childrenHAX[i].classList.remove("hax-hovered", "hax-moving");
            }
          }
        }
        // sort the children by slot to ensure they are in the correct semantic order
        this.__sortChildren();
      }, 100);
      // edge case, something caused this to drag and it tried to do
      // itself into itself
      if (target === this) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
      var local = e.target;
      // if we have a slot on what we dropped into then we need to mirror that item
      // and place ourselves below it in the DOM
      if (
        target &&
        typeof local !== typeof undefined &&
        local.getAttribute("slot") != null &&
        local.parentNode &&
        target !== local
      ) {
        target.setAttribute("slot", local.getAttribute("slot"));
        local.parentNode.insertBefore(target, local);
        // ensure that if we caught this event we process it
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
      // special case for dropping on an empty column or between items
      // which could involve a miss on the column
      else if (
        target &&
        local.tagName === "DIV" &&
        local.classList.contains("column")
      ) {
        var col = local.id.replace("col", "");
        target.setAttribute("slot", "col-" + col);
        this.appendChild(target);
        // ensure that if we caught this event we process it
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
      setTimeout(() => {
        // support for hax
        if (
          window.HaxStore &&
          window.HaxStore.instance &&
          window.HaxStore.instance.ready
        ) {
          if (
            target &&
            target.parentNode &&
            target.parentNode.tagName === "GRID-PLATE"
          ) {
            window.HaxStore.instance.write("activeNode", target, this);
            setTimeout(() => {
              window.HaxStore.instance.activeHaxBody.positionContextMenus(
                target,
                target.parentNode
              );
            }, 10);
          }
        }
        this.activeItem = null;
      }, 0);
    }
  }

  /**
   * Start a drag event, this is an element being dragged
   */
  dragStart(e) {
    if (this.editMode) {
      if (
        window.HaxStore &&
        window.HaxStore.instance &&
        window.HaxStore.instance.ready
      ) {
        window.HaxStore.instance.__dragTarget = this.activeItem;
      } else {
        this.__dragTarget = this.activeItem;
      }
      this.activeItem.classList.add("hax-moving");
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.setDragImage(this.activeItem, 0, 0);
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }

  /**
   * When we end dragging ensure we remove the mover class.
   */
  dragEnd(e) {
    if (this.editMode) {
      setTimeout(() => {
        let children = this.querySelectorAll(
          ".hax-hovered, .hax-moving, .grid-plate-active-item"
        );
        // walk the children and apply the draggable state needed
        for (var i in children) {
          if (typeof children[i].classList !== typeof undefined) {
            children[i].classList.remove("hax-hovered", "hax-moving");
          }
        }
        for (var i in this.children) {
          if (typeof this.children[i].classList !== typeof undefined) {
            this.children[i].classList.remove("hax-hovered", "hax-moving");
          }
        }
        for (var j = 1; j <= this.columns; j++) {
          if (this.shadowRoot.querySelector("#col" + j) !== undefined) {
            this.shadowRoot
              .querySelector("#col" + j)
              .classList.remove("hax-hovered", "hax-moving");
          }
        }
      }, 100);
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
      if (typeof e.detail.value === "object") {
        this[e.detail.property] = null;
      }
      if (e.detail.property === "editMode" && this.ignoreHax) {
        // do nothing, we were told to ignore hax
      } else {
        // if HAX modified our edit state then hide operations
        this[e.detail.property] = e.detail.value;
      }
    }
  }
}
window.customElements.define(GridPlate.tag, GridPlate);
export { GridPlate };
