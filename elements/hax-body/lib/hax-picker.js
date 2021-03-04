import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-toolbar/lib/simple-button-grid.js";
import { HaxComponentStyles } from "./hax-ui-styles.js";
import { HAXStore } from "./hax-store.js";
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
          --simple-button-grid-cols: 100px;
        }
      `,
    ];
  }
  constructor() {
    super();
    this._elements = [];
    this.selectionList = [];
    this.pickerType = "gizmo";
  }
  render() {
    return html`
      <simple-button-grid cols="100px">
        ${this.selectionList.map(
          (element, index) => html`
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
            ></hax-tray-button>
          `
        )}
      </simple-button-grid>
    `;
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
    pickerType = "gizmo"
  ) {
    // wipe existing
    this.pickerType = pickerType;
    var tmp = [];
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
          });
        }
        break;
      // app selector
      case "app":
        for (var i in elements) {
          tmp.push({
            icon: elements[i].details.icon,
            title: elements[i].details.title,
            color: elements[i].details.color,
            tag: elements[i].gizmo.tag,
          });
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
  /**
   * Handle the user selecting an app.
   */
  _selected(e) {
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
          })
        );
      } else {
        // bubble this up
        this.dispatchEvent(
          new CustomEvent("hax-app-picker-selection", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: this._elements[key],
          })
        );
      }
    }
    this.close();
  }
  close() {
    window.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        cancelable: true,
        detail: {},
      })
    );
  }
}
window.customElements.define(HaxPicker.tag, HaxPicker);
export { HaxPicker };
