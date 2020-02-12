import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 `hax-app-picker`
 A picker for selecting an item from a list of apps / hax gizmos which require
 a decision to be made. This is used when multiple things match either on upload
 in the add operation of the app or in the gizmo selection to render through,
 such as having multiple ways of presenting an image.

* @demo demo/index.html

@microcopy - the mental model for this element
 - data - this is the app data model for an element which expresses itself to hax
*/
class HaxAppPicker extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        iron-icon:not(:defined),
        paper-button:not(:defined),
        paper-dialog:not(:defined) {
          display: none;
        }
        #closedialog {
          float: right;
          top: 15px;
          right: 0;
          position: absolute;
          padding: 8px;
          margin: 0;
          background-color: var(--hax-color-menu-heading-bg, #eeeeee);
          color: var(--hax-color-menu-heading-color, black);
          background-color: transparent;
          width: 40px;
          height: 40px;
          min-width: unset;
        }
        #dialog {
          min-width: 400px;
          min-height: 200px;
          max-height: 60vh;
          max-width: 50vw;
          overflow: hidden;
          border-radius: 16px;
          z-index: 1000000;
          border: 2px solid var(--hax-color-border-outline);
          background-color: #ffffff;
          overflow: scroll;
        }
        .button-list {
          display: block;
          text-align: left;
          margin: 0px;
          max-width: 50vw;
          overflow-x: hidden;
          overflow-y: auto;
          display: flex;
          justify-content: space-evenly;
          flex-wrap: wrap;
        }
        #title {
          color: var(--hax-color-menu-heading-color, black);
        }
        #title {
          padding: 16px;
          border-bottom: 2px solid var(--hax-color-border-outline);
          margin: 0;
          width: calc(100% - 32px);
          background-color: var(--hax-color-menu-heading-bg, #eeeeee);
          color: var(--hax-color-menu-heading-color, black);
        }
      `
    ];
  }
  constructor() {
    super();
    this._elements = [];
    this.selectionList = [];
    this.title = "Pick an options";
    this.pickerType = "gizmo";
    this.opened = false;
    import("@polymer/paper-button/paper-button.js");
    import("@polymer/iron-icon/iron-icon.js");
    import("@polymer/paper-dialog/paper-dialog.js");
    setTimeout(() => {
      this.addEventListener("iron-overlay-canceled", this.close.bind(this));
      this.addEventListener("iron-overlay-closed", this.close.bind(this));
    }, 0);
  }
  render() {
    return html`
      <paper-dialog id="dialog" ?opened="${this.opened}">
        <h3 id="title">${this.title}</h3>
        <div class="button-list">
          ${this.selectionList.map(
            (element, index) => html`
              <hax-tray-button
                id="picker-item-${index}"
                @click="${this._selected}"
                data-selected="${index}"
                label="${element.title}"
                icon="${element.icon}"
                color="${element.color}"
              >
              </hax-tray-button>
            `
          )}
        </div>
        <paper-button id="closedialog" @click="${this.closeEvent}">
          <iron-icon icon="icons:cancel" title="Close dialog"></iron-icon>
        </paper-button>
      </paper-dialog>
    `;
  }
  static get tag() {
    return "hax-app-picker";
  }
  closeEvent(e) {
    this.opened = false;
  }
  static get properties() {
    return {
      /**
       * raw element set
       */
      _elements: {
        type: Array
      },
      /**
       * Refactored list for selection purposes
       */
      selectionList: {
        type: Array
      },
      /**
       * Title for the dialog
       */
      title: {
        type: String
      },
      /**
       * Allow multiple uses
       */
      pickerType: {
        type: String,
        attribute: "picker-type"
      },
      /**
       * Opened status to bind to the dialog box being open
       */
      opened: {
        type: Boolean
      }
    };
  }
  firstUpdated(changedProperties) {
    this.dispatchEvent(
      new CustomEvent("hax-register-core-piece", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          piece: "haxAppPicker",
          object: this
        }
      })
    );
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "opened") {
        this._openedChanged(this[propName], oldValue);
      }
    });
  }

  /**
   * Close the picker and ensure body locking is off.
   */
  close() {
    this.opened = false;
  }

  /**
   * Open status changed
   */
  _openedChanged(newValue, oldValue) {
    if (newValue) {
      // lock the background
      document.body.style.overflow = "hidden";
    } else {
      this.selectionList = [];
      document.body.style.overflow = null;
    }
  }

  /**
   * Present options to the user with a modal and selection method that
   * shifts itself to be above everything (stack order)
   * @param  [array] elements  a list of elements for presenting to the user
   * to select between.
   */
  presentOptions(
    elements,
    type = "element",
    title = "Select an option",
    pickerType = "gizmo"
  ) {
    // wipe existing
    this.title = title;
    this.pickerType = pickerType;
    var tmp = [];
    switch (pickerType) {
      // hax gizmo selector
      case "gizmo":
        for (var i in elements) {
          elements[i].__type = type;
          tmp[i] = {
            icon: elements[i].gizmo.icon,
            title: elements[i].gizmo.title,
            color: elements[i].gizmo.color
          };
        }
        break;
      // app selector
      case "app":
        for (var i in elements) {
          tmp[i] = {
            icon: elements[i].details.icon,
            title: elements[i].details.title,
            color: elements[i].details.color
          };
        }
        break;
      // we don't know what to do with this
      default:
        tmp = elements;
        break;
    }
    this._elements = elements;
    this.selectionList = [...tmp];
    this.opened = true;
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
        window.HaxStore.write("activeHaxElement", this._elements[key], this);
      } else if (this.pickerType == "delete") {
        if (this._elements[key]["title"] === "Yes") {
          if (
            window.HaxStore.instance.activeHaxBody.activeNode !==
            window.HaxStore.instance.activeHaxBody.activeContainerNode
          ) {
            window.HaxStore.instance.activeHaxBody.haxDeleteNode(
              window.HaxStore.instance.activeHaxBody.activeNode,
              window.HaxStore.instance.activeHaxBody.activeContainerNode
            );
          } else {
            window.HaxStore.instance.activeHaxBody.haxDeleteNode(
              window.HaxStore.instance.activeHaxBody.activeNode
            );
          }
          window.HaxStore.toast("Element deleted", 2000);
        }
      } else {
        // bubble this up
        this.dispatchEvent(
          new CustomEvent("hax-app-picker-selection", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: this._elements[key]
          })
        );
      }
    }
    this.opened = false;
  }
}
window.customElements.define(HaxAppPicker.tag, HaxAppPicker);
export { HaxAppPicker };
