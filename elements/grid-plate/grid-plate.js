import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/responsive-utility/responsive-utility.js";
import { normalizeEventPath } from "@lrnwebcomponents/utils/utils.js";

// need to make this an object so that HAX can listen for it correctly
class GridPlateLayoutOptions {
  constructor() {
    this.resizeTimer = null;
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
        }
        :host .row {
          width: 100%;
          overflow-wrap: break-word;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: stretch;
          margin: var(--grid-plate-row-margin, 0px);
          padding: var(--grid-plate-row-padding, 0px);
        }
        .column.active {
          outline: 2px solid var(--simple-colors-default-theme-grey-12, #009dc7) !important;
          outline-offset: -2px;
        }
        :host([disable-responsive]) .column {
          overflow: hidden;
        }
        :host .column {
          width: 100%;
          flex: 0 0 auto;
          min-height: 50px;
        }
        :host([ready]) .column {
          transition: var(
            --grid-plate-col-transition,
            0.5s width ease-in-out,
            0.5s padding ease-in-out,
            0.5s margin ease-in-out
          );
        }
        :host([data-hax-ray]) .column[style="min-height: unset;"] {
          display: block !important;
          opacity: 0.4;
        }
        /* make sure that animation for nothing to 2 col doesn't jar layout */
        :host([layout="1-1"]) #col1 {
          width: 50%;
        }
        :host([layout="1-1-1"]) #col1 {
          width: 33.33%;
        }
        :host([layout="1-1-1-1"]) #col1 {
          width: 25%;
        }
        :host([layout="1-1-1-1-1"]) #col1 {
          width: 20%;
        }
        :host([layout="1-1-1-1-1-1"]) #col1 {
          width: 16.66%;
        }
        :host .column[style="min-height: unset;"] {
          display: none;
          outline: none;
        }
        :host([data-hax-ray]) .column[style="min-height: unset;"] {
          width: 0;
        }

        :host([data-hax-ray]) .column.has-nodes[style="min-height: unset;"] {
          width: 100%;
          transition: none;
        }
        :host([data-hax-ray]) .column[style="min-height: unset;"]:hover {
          opacity: 1;
        }
        :host([data-hax-ray])
          .column[style="min-height: unset;"]:hover::before {
          content: "Hidden by column layout";
          position: sticky;
          display: inline-flex;
          background-color: black;
          color: white;
          padding: 0px 8px;
          font-size: 12px;
          line-height: 16px;
          margin: 12px 13px;
          float: right;
          width: 124px;
        }
        :host .column ::slotted(*) {
          margin: var(--grid-plate-item-margin, 15px);
          padding: var(--grid-plate-item-padding, 15px);
          max-width: calc(100% - 60px);
          max-width: -webkit-fill-available;
        }
        :host([ready]) .column ::slotted(*) {
          transition: var(
            --grid-plate-col-transition,
            0.5s color ease-in-out,
            0.5s background-color ease-in-out
          );
        }
        /** this implies hax editing state is available **/
        :host([data-hax-ray]) .column ::slotted(*) {
          outline: 1px solid var(--simple-colors-default-theme-grey-2, #eeeeee);
          outline-offset: -2px;
        }
        :host([data-hax-ray]) .column ::slotted(*:hover) {
          outline: 1px solid var(--simple-colors-default-theme-grey-8, #eeeeee);
        }
        :host([data-hax-ray]) .column {
          outline: 1px solid var(--simple-colors-default-theme-grey-2, #eeeeee);
          outline-offset: -2px;
        }
        :host([data-hax-ray]) .column:hover {
          outline: 1px solid var(--simple-colors-default-theme-grey-8, #eeeeee);
        }
        :host([data-hax-ray]) div ::slotted(*.active):before {
          outline: 1px var(--simple-colors-default-theme-grey-4) solid;
          background-color: inherit;
          content: " ";
          width: 100%;
          display: block;
          position: relative;
          margin: -10px 0 0 0;
          z-index: 2;
          height: 10px;
        }
        :host([data-hax-ray]) div ::slotted(img.active),
        :host([data-hax-ray]) div ::slotted(*.active):before {
          background-color: var(
            --simple-colors-default-theme-grey-12,
            #009dc7
          ) !important;
          outline: 1px solid var(--simple-colors-default-theme-grey-12, #009dc7);
        }

        @media screen and (min-color-index: 0) and(-webkit-min-device-pixel-ratio:0) {
          :host([data-hax-ray]) div ::slotted(*.active) {
            background-color: var(
              --simple-colors-default-theme-grey-12,
              #009dc7
            ) !important;
            outline: 1px solid
              var(--simple-colors-default-theme-grey-12, #009dc7);
          }
        }
      `,
    ];
  }
  constructor() {
    super();
    this.ready = false;
    this.breakpointSm = 900;
    this.breakpointMd = 1200;
    this.breakpointLg = 1500;
    this.breakpointXl = 1800;
    this.columns = 6;
    this.disableResponsive = false;
    this.layout = "1-1";
    this.layouts = new GridPlateLayoutOptions().layouts;
    this.responsiveSize = "xs";
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
   * life cycle
   */
  firstUpdated(changedProperties) {
    this.resize();
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
    this.__columnWidths = this._getColumnWidths(
      this.responsiveSize,
      this.layout,
      this.layouts,
      this.disableResponsive
    );
    setTimeout(() => {
      this.ready = true;
    }, 100);
  }
  /**
   * Wire to HAX
   */
  static get haxProperties() {
    return {
      type: "grid",
      canScale: true,
      canPosition: true,
      canEditSource: true,
      gizmo: {
        title: "Grid layout",
        description: "Simple card in a cool retro design",
        icon: "hax:3-3-3-3",
        color: "grey",
        groups: ["Layout"],
        handles: [],
        meta: {
          author: "ELMS:LN",
          owner: "The Pennsylvania State University",
        },
      },
      settings: {
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
          "ready",
          "layouts",
          "columns",
          "options",
          "responsive-width",
        ],
      },
    };
  }
  static get properties() {
    return {
      ready: {
        type: Boolean,
        reflect: true,
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
       * disables responsive layouts
       */
      disableResponsive: {
        type: Boolean,
        attribute: "disable-responsive",
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
       * name of selected layout
       */
      __columnWidths: {
        type: String,
      },
      dataHaxRay: {
        type: String,
        reflect: true,
        attribute: "data-hax-ray",
      },
    };
  }
  _dragEnter(e) {
    e.target.classList.add("active");
  }
  _dragLeave(e) {
    e.target.classList.remove("active");
  }
  _dropEvent(e) {
    this.querySelectorAll(".active").forEach((el) => {
      el.classList.remove("active");
    });
    this.shadowRoot.querySelectorAll(".active").forEach((el) => {
      el.classList.remove("active");
    });
  }
  /**
   * Use slot events to track which slots have nodes and apply to the shadowRoot
   * column wrappers. This helps with trasitions and animations
   */
  _slotMonitor(e) {
    // sanity, we have a local slot
    var eventPath = normalizeEventPath(e);

    if (
      eventPath[0] &&
      eventPath[0].assignedNodes &&
      eventPath[0].assignedNodes().length
    ) {
      // has nodes so we can make sure to track this elsewhere
      this.shadowRoot
        .querySelector("#" + eventPath[0].getAttribute("name").replace("-", ""))
        .classList.add("has-nodes");
    } else {
      this.shadowRoot
        .querySelector("#" + eventPath[0].getAttribute("name").replace("-", ""))
        .classList.remove("has-nodes");
    }
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "dataHaxRay" && this.shadowRoot) {
        if (this[propName]) {
          // apply handlers to the columns themselves
          this.addEventListener("drop", this._dropEvent.bind(this));
          for (var j = 1; j <= this.columns; j++) {
            if (this.shadowRoot.querySelector("#col" + j) !== undefined) {
              let col = this.shadowRoot.querySelector("#col" + j);
              col.addEventListener("dragenter", this._dragEnter.bind(this));
              col.addEventListener("dragleave", this._dragLeave.bind(this));
            }
          }
          let slots = this.shadowRoot.querySelectorAll("slot");
          for (var j = 0; j < slots.length; j++) {
            slots[j].addEventListener(
              "slotchange",
              this._slotMonitor.bind(this)
            );
          }
          this.observer = new MutationObserver((mutations) => {
            if (!this.__sorting) {
              mutations.forEach((mutation) => {
                // this implies something was added dynamically or drag and drop
                // from outside this element or dragging between grid plates
                // so we need to disconnect the handlers from here and pick them
                // up in the new plate
                mutation.addedNodes.forEach((node) => {
                  if (node.tagName && node !== this) {
                    // verify this has a slot set otherwise we need to set one on the fly
                    // otherwise this won't show up. This could be incorrectly formed HTML
                    // DOM that was pushed in via an outside system or edge cases of things
                    // dropping in without a slot set in anyway
                    // validate slot name, otherwise force it to col-1
                    if (
                      node.parentElement &&
                      node.parentElement.tagName !== "HAX-BODY" &&
                      !this.validateElementSlot(node)
                    ) {
                      node.setAttribute("slot", "col-1");
                    }
                  }
                });
              });
              this.__sortChildren();
            }
          });
          this.observer.observe(this, {
            childList: true,
          });
        } else {
          if (this.observer) {
            this.observer.disconnect();
          }
          this.removeEventListener("drop", this._dropEvent.bind(this));
          for (var j = 1; j <= this.columns; j++) {
            if (this.shadowRoot.querySelector("#col" + j) !== undefined) {
              let col = this.shadowRoot.querySelector("#col" + j);
              col.removeEventListener("dragenter", this._dragEnter.bind(this));
              col.removeEventListener("dragleave", this._dragLeave.bind(this));
            }
          }
          let slots = this.shadowRoot.querySelectorAll("slot");
          for (var j = 0; j < slots.length; j++) {
            slots[j].removeEventListener(
              "slotchange",
              this._slotMonitor.bind(this)
            );
          }
        }
      }
      // if any of these changed, update col widths
      if (
        ["responsiveSize", "layout", "layouts", "disableResponsive"].includes(
          propName
        )
      ) {
        clearTimeout(this.__calcWidthLock);
        this.__calcWidthLock = setTimeout(() => {
          this.__columnWidths = this._getColumnWidths(
            this.responsiveSize,
            this.layout,
            this.layouts,
            this.disableResponsive
          );
        }, 0);
      }
      switch (propName) {
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
   * Sort children based on slot name
   */
  async __sortChildren() {
    this.__sorting = true;
    try {
      // select all direct children w/ a slot attribute and convert to an Array
      let children = Array.prototype.reduce.call(
        this.querySelectorAll("[slot]"),
        function (acc, e) {
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
      await children.forEach((el) => {
        // sanity check that we only move things that are a direct child
        if (el.parentNode === this) {
          this.appendChild(el);
        }
      });
    } catch (error) {
      console.warn(error);
    }
    this.__sorting = false;
  }
}
window.customElements.define(GridPlate.tag, GridPlate);
export { GridPlate };
