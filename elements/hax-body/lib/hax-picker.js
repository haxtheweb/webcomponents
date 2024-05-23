import { LitElement, html, css } from "lit";
import { HaxComponentStyles } from "./hax-ui-styles.js";
import { HAXStore } from "./hax-store.js";
import "./hax-element-demo.js";
import "@haxtheweb/simple-toolbar/lib/simple-button-grid.js";
import "@haxtheweb/simple-popover/lib/simple-popover-selection.js";
/**
 `hax-picker`
 A picker for selecting an item from a list of apps / hax gizmos which require
 a decision to be made. This is used when multiple things match either on upload
 in the add operation of the app or in the gizmo selection to render through,
 such as having multiple ways of presenting an image.

* @demo demo/index.html

@microcopy - the mental model for this element
 - data - this is the app data model for an element which expresses itself to hax
*/
class HaxPicker extends LitElement {
  static get styles() {
    return [
      ...HaxComponentStyles,
      css`
        simple-button-grid {
          overflow-y: auto;
          margin: var(--hax-ui-spacing-sm);
        }
        #filters {
          min-height: 24px;
        }
        simple-icon-button-lite {
          float: right;
          margin-left: -24px;
        }
        hax-tray-button {
          display: block;
        }
        simple-fields-field::part(fieldset-legend) {
          line-height: 24px;
        }
        simple-fields-field::part(fieldset-options) {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        }
        simple-fields-field::part(option) {
          display: flex;
          flex-wrap: no-wrap;
          align-items: center;
          justify-content: space-between;
          margin: 0 var(--simple-fields-margin-small, 8px);
          flex-direction: row-reverse;
        }
        simple-fields-field::part(option-inner) {
          flex: 0 0 auto;
          margin: 0 calc(var(--simple-fields-margin-small, 8px) * 0.5) 0 0;
        }
        simple-fields-field::part(option-label) {
          flex: 1 1 auto;
          margin: 0;
          font-size: var(--hax-ui-font-size-sm, 13px);
        }
        :host([filter-on]) simple-button-grid {
          margin-bottom: var(--simple-fields-margin-small, 8px);
        }
        :host([filter-on]) #hax-gizmo-filters {
          margin-bottom: 0;
        }
        :host([filter-on]) ::part(fieldset-options) {
          padding-bottom: var(--simple-fields-margin-small, 8px);
        }
      `,
    ];
  }
  constructor() {
    super();
    this._elements = [];
    this.selectionList = [];
    this.activePreview = null;
    this.pickerType = "gizmo";
  }
  render() {
    return html`
      ${!!this.keywords
        ? html` <div id="filters">
            <simple-icon-button-lite
              icon="editable-table:filter${!this.filterOn ? "" : "-off"}"
              label="Toggle Filters"
              tooltip-position="right"
              @click="${(e) => (this.filterOn = !this.filterOn)}"
            >
            </simple-icon-button-lite>
            <simple-fields-field
              ?hidden="${!this.filterOn}"
              id="hax-gizmo-filters"
              label="Filters"
              type="checkbox"
              .options="${this.keywords}"
              @value-changed="${this._handleFilters}"
            >
            </simple-fields-field>
          </div>`
        : ""}
      <simple-button-grid columns="4" always-expanded>
        ${this.selectionList.map((element, index) =>
          !this._isFiltered(element.keywords)
            ? ""
            : html`
                <simple-popover-selection
                  data-index="${index}"
                  @opened-changed="${this._hoverForPreviewChange}"
                  event="hover"
                >
                  <hax-tray-button
                    show-text-label
                    id="picker-item-${index}"
                    @click="${this._selected}"
                    data-selected="${index}"
                    ?disabled="${HAXStore.activeGizmo &&
                    HAXStore.activeGizmo.tag == element.tag}"
                    label="${element.title}"
                    icon="${element.icon}"
                    icon-position="top"
                    slot="button"
                  ></hax-tray-button>
                  ${this.activePreview === parseInt(index)
                    ? html`
                        <hax-element-demo
                          render-tag="${element.tag}"
                          slot="options"
                          active-picker-schema="${index}"
                        ></hax-element-demo>
                      `
                    : ``}
                </simple-popover-selection>
              `,
        )}
      </simple-button-grid>
    `;
  }
  // react to "opened" changing on the popover
  _hoverForPreviewChange(e) {
    const popover = e.detail;
    // this is open
    if (popover.opened) {
      this.activePreview = parseInt(popover.dataset.index);
      // @notice
      // timing hack because the act of opening the element triggers a light dom rebuild
      // in which the element is not yet visible, so we need to wait a tick
      // and then tell the pop up it should look at and re-clone it's light dom
      setTimeout(() => {
        e.detail.openedChanged(true);
      }, 10);
    }
  }
  static get tag() {
    return "hax-picker";
  }
  static get properties() {
    return {
      /**
       * raw element set
       */
      _elements: {
        type: Array,
      },
      activePreview: {
        type: Number,
      },
      keywords: {
        type: Object,
      },
      /**
       * Refactored list for selection purposes
       */
      selectionList: {
        type: Array,
      },
      /**
       * Allow multiple uses
       */
      pickerType: {
        type: String,
        attribute: "picker-type",
      },
      filters: {
        type: Array,
      },
      filterOn: {
        type: Boolean,
        attribute: "filter-on",
        reflect: true,
      },
    };
  }
  /**
   * Present options to the user with a modal and selection method that
   * shifts itself to be above everything (stack order)
   * @param  [array] elements  a list of elements for presenting to the user
   * to select between.
   */
  buildOptions(
    elements,
    type = "element",
    title = "Select an option",
    pickerType = "gizmo",
  ) {
    // wipe existing
    this.pickerType = pickerType;
    var tmp = [],
      addKeywords = (i) => {
        if (pickerType === "gizmo") {
          elements[i].gizmo.keywords.forEach((keyword) => {
            keyword = (keyword || "").toLowerCase();
            let sanitized = keyword.replace(/[\s\W]*/, "");
            if (sanitized.length > 0) this.keywords[keyword] = keyword;
          });
        } else if (pickerType === "app") {
          elements[i].details.tag.forEach((keyword) => {
            keyword = (keyword || "").toLowerCase();
            let sanitized = keyword.replace(/[\s\W]*/, "");
            if (sanitized.length > 0) this.keywords[keyword] = keyword;
          });
        }
      };
    this.keywords = {};
    switch (pickerType) {
      // hax gizmo selector
      case "gizmo":
        for (var i in elements) {
          elements[i].__type = type;
          tmp.push({
            icon: elements[i].gizmo.icon,
            title: elements[i].gizmo.title,
            color: elements[i].gizmo.color,
            tag: elements[i].gizmo.tag,
            keywords: elements[i].gizmo.keywords,
          });
          addKeywords(i);
        }
        break;
      // app selector
      case "app":
        for (var i in elements) {
          tmp.push({
            icon: elements[i].details.icon,
            title: elements[i].details.title,
            color: elements[i].details.color,
            tag: elements[i].details.tags || [],
            keywords: elements[i].details.tags || [],
          });
          addKeywords(i);
        }
        break;
      // we don't know what to do with this
      default:
        tmp = elements;
        break;
    }
    this._elements = elements;
    this.selectionList = [...tmp];
    // try to focus on option 0
    setTimeout(() => {
      this.shadowRoot.querySelector("#picker-item-0").focus();
    }, 50);
  }
  _handleFilters(e) {
    let filters =
      this.shadowRoot && this.shadowRoot.querySelector("#hax-gizmo-filters")
        ? this.shadowRoot.querySelector("#hax-gizmo-filters")
        : undefined;
    if (filters) this.filters = filters.value;
  }
  _isFiltered(keywords) {
    let i = 0,
      filtered = !this.filterOn || !this.filters || this.filters.length < 1;
    while (!filtered && i < this.filters.length) {
      if (keywords.includes(this.filters[i])) filtered = true;
      i++;
    }
    return filtered;
  }
  /**
   * Handle the user selecting an app.
   */
  _selected(e) {
    this.activePreview = null;
    let key = e.target.getAttribute("data-selected");
    e.preventDefault();
    e.stopPropagation();
    if (typeof this._elements[key] !== typeof undefined) {
      // haxElement is a unique case
      if (this.pickerType == "gizmo") {
        this._elements[key].replace = true;
        this.dispatchEvent(
          new CustomEvent("hax-insert-content", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: this._elements[key],
          }),
        );
      } else {
        // bubble this up
        this.dispatchEvent(
          new CustomEvent("hax-app-picker-selection", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: this._elements[key],
          }),
        );
      }
    }
    this.close();
  }
  close() {
    this.activePreview = null;
    globalThis.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        cancelable: true,
        detail: {},
      }),
    );
  }
}
customElements.define(HaxPicker.tag, HaxPicker);
export { HaxPicker };
