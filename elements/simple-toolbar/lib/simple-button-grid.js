/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { SimpleToolbarBehaviors } from "../simple-toolbar.js";
/**
 * @customElement
 * @extends SimpleToolbarBehaviors
 * @class
 */
const SimpleButtonGridBehaviors = function (SuperClass) {
  return class extends SimpleToolbarBehaviors(SuperClass) {
    /**
     * Store the tag name to make it easier to obtain directly.
     * @notice function name must be here for tooling to operate correctly
     */
    static get tag() {
      return "simple-toolbar-grid";
    }

    // render function for styles
    static get baseStyles() {
      return [
        css`
          :host {
            padding: 0;
            margin: 0;
            max-width: 100%;
            display: flex;
            overflow: hidden;
            flex-direction: column;
            align-items: stretch;
            overflow: hidden !important;
            --simple-button-grid-cols: var(
              --simple-toolbar-button-min-width,
              var(
                --simple-toolbar-button-width,
                var(--simple-toolbar-button-height, 24px)
              )
            );
            transition: all 0.5s;
            transition: z-index 0s;
          }
          :host([hidden]) {
            z-index: -1;
            visibility: hidden;
            opacity: 0;
            height: 0;
          }
          #grid {
            flex: 1 1 auto;
            max-width: 100%;
            overflow: auto;
          }

          #buttons {
            flex: 0 1 100%;
            max-width: 100%;
            display: flex;
            flex-wrap: wrap;
            --simple-toolbar-button-flex: var(
              --simple-toolbar-button-grid-flex,
              1 1 100%
            );
          }
          #buttons {
            display: grid;
            overflow: visible;
            grid-gap: var(--simple-button-grid-margin, 4px);
            grid-template-columns: repeat(
              auto-fill,
              minmax(
                calc(
                  var(--simple-button-grid-cols) - 2 *
                    var(--simple-button-grid-margin, 4px)
                ),
                1fr
              )
            );
          }
          :host([collapsed]:not([always-expanded]))
            ::slotted(*[collapse-hide]) {
            display: none !important;
          }
        `,
      ];
    }

    // properties available to custom element for data binding
    static get properties() {
      return {
        ...super.properties,
        columns: {
          type: Number,
          attribute: "columns",
        },
        rows: {
          type: Number,
          attribute: "rows",
        },
        disableAutogrow: {
          type: Boolean,
          attribute: "disable-autogrow",
          reflect: true,
        },
      };
    }

    get gridStyles() {
      let styles = [];
      if (!!this.columns)
        styles.push(`--simple-button-grid-cols:${100 / this.columns}%`);
      return styles.join(";");
    }

    /**
     * toolbar element's template
     *
     * @readonly
     * @memberof SimpleToolbar
     */
    get toolbarTemplate() {
      return html`
        <div id="grid">
          <div
            id="buttons"
            class="${!this.alwaysExpanded && this.collapsed ? "collapsed" : ""}"
            style="${this.gridStyles}"
            part="buttons"
          >
            <slot></slot>
            ${this.alwaysExpanded ? "" : this.moreButton}
          </div>
        </div>
      `;
    }

    _bottom(item) {
      return !!item && !!item.offsetTop && !!item.clientHeight
        ? item.offsetTop + item.clientHeight
        : undefined;
    }

    resizeToolbar() {
      if (this.alwaysExpanded) return;
      let more = !this.shadowRoot
          ? undefined
          : this.shadowRoot.querySelector("#morebutton"),
        morebottom = this._bottom(more),
        max = this._bottom(this),
        items = [...(this.children || [])],
        shown = true,
        lastVisible,
        rows = [];
      items.forEach((item) => {
        if (item.removeAttribute) item.removeAttribute("collapse-hide");
        if (rows.length == 0) {
          rows.unshift(item.offsetTop);
        } else {
          let newrow = item.offsetTop > rows[0];
          if (newrow) rows.unshift(item.offsetTop);
          if (
            (!!this.rows && rows.length > this.rows) ||
            (!this.rows && newrow && this._bottom(item) > max)
          ) {
            item.setAttribute("collapse-hide", true);
            shown = false;
          } else if (!shown) {
            item.setAttribute("collapse-hide", true);
          } else {
            lastVisible = item;
          }
        }
      });
      this.collapseDisabled =
        shown && !(more && lastVisible && this._bottom(more) > max);
      if (!this.collapseDisabled && lastVisible)
        lastVisible.setAttribute("collapse-hide", true);
    }

    // life cycle
    constructor() {
      super();
    }
  };
};

/**
 * `simple-toolbar`
 * a customizable toolbar
 *
### Styling

`<simple-toolbar>` provides following custom properties and mixins
for styling:

Custom property | Description | Default
----------------|-------------|----------
--simple-toolbar-border-color | default border color | transparent
--simple-toolbar-border-width | default border width | 1px
--simple-toolbar-group-border-color | border color for button groups | --simple-toolbar-border-color
--simple-toolbar-group-border-width | border width for button groups | --simple-toolbar-border-width
--simple-toolbar-group-padding | padding for button groups | 0 3px
 * 
 * @customElement
 * @extends SimpleButtonGridBehaviors
 * @extends LitElement
 * @lit-html
 * @lit-element
 * @demo demo/grid.html
 */
class SimpleButtonGrid extends SimpleButtonGridBehaviors(LitElement) {}
customElements.define("simple-button-grid", SimpleButtonGrid);
export { SimpleButtonGrid, SimpleButtonGridBehaviors };
