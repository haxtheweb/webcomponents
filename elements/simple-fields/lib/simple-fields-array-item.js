import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleFieldsFieldset } from "./simple-fields-fieldset.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
/**
 * `simple-fields-array-item`
 * an accessible expand collapse
 * 
### Styling

`<simple-fields-array-item>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--simple-fields-array-item-margin` | margin around simple-fields-array-item | 15px 0
`--simple-fields-array-item-border` | border around simple-fields-array-item | 1px solid
`--simple-fields-array-item-horizontal-padding` | horizontal padding inside simple-fields-array-item | 16px
`--simple-fields-array-item-horizontal-padding-left` | left padding inside simple-fields-array-item | `--simple-fields-array-item-horizontal-padding`
`--simple-fields-array-item-horizontal-padding-right` | right padding inside simple-fields-array-item | `--simple-fields-array-item-horizontal-padding`
`--simple-fields-array-item-vertical-padding` | vertical padding inside simple-fields-array-item | 16px
`--simple-fields-array-item-horizontal-padding-top` | top padding inside simple-fields-array-item | `--simple-fields-array-item-vertical-padding`
`--simple-fields-array-item-horizontal-padding-bottom` | bottom padding inside simple-fields-array-item | --simple-fields-array-item-vertical-padding
`--simple-fields-array-item-border-between` | border between simple-fields-array-item heading and content | --simple-fields-array-item-border
`--simple-fields-array-item-heading-font-weight` | font-weight for simple-fields-array-item heading | bold
`--simple-fields-array-item-heading-color` | text color for simple-fields-array-item heading | unset
`--simple-fields-array-item-heading-background-color` | background-color for simple-fields-array-item heading | unset
 *
 * @customElement simple-fields-array-item
 * @demo ./demo/index.html demo
 * @demo ./demo/group.html collapse groups
 */
class SimpleFieldsArrayItem extends SimpleFieldsFieldset {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          border-radius: 3px;
          border: none;
          transform: rotate(0deg);
          transition: border 0.5s ease;
        }
        :host([disabled]) {
          opacity: 0.5;
        }
        :host([aria-expanded="true"]) {
          border: 1px solid #ddd;
          transition: border 0.5s ease;
        }
        :host(:focus-within) {
          border: 1px solid #444;
          transition: border 0.5s ease;
          z-index: 2;
        }
        *[aria-controls="content"][disabled] {
          cursor: not-allowed;
        }
        #drag-handle {
          flex: 0 1 auto;
        }
        #preview {
          flex: 1 0 auto;
          margin: 0;
        }
        #heading,
        .heading-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        #content {
          overflow: hidden;
          max-height: 0;
        }
        :host([sortable]) {
          padding: 0 0 0 40px;
        }
        :host #content-inner {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.75s ease 0.1s;
        }
        :host(:focus-within) #content,
        :host([aria-expanded="true"]) #content {
          max-height: 20000vh;
          transition: max-height 0.75s ease 0.1s;
        }
        :host(:focus-within) #content-inner,
        :host([aria-expanded="true"]) #content-inner {
          max-height: 20000vh;
        }
        #content-inner > * {
          flex: 1 1 auto;
        }
        #remove {
          flex: 0 0 auto;
          color: #cc0000;
        }
        #expand {
          padding: 8px;
          transform: rotate(0deg);
          transition: transform 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
        }
        :host(:focus-within) #expand,
        :host([aria-expanded="true"]) #expand {
          transform: rotate(-180deg);
          transition: transform 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
        }
      `
    ];
  }
  render() {
    return html`
      <div id="heading">
        <paper-icon-button
          id="drag-handle"
          controls="${this.id}"
          icon="open-with"
          label="Reorder this item"
          ?hidden="${!this.sortable}"
          ?disabled="${this.disabled}"
        >
        </paper-icon-button>
        <div id="preview"><slot name="preview"></slot></div>
        <iron-icon
          id="expand"
          aria-hidden="true"
          icon="expand-more"
          @click="${this.toggle}"
        ></iron-icon>
      </div>
      <div id="content">
        <div id="content-inner">
          <div><slot></slot></div>
          <paper-icon-button
            id="remove"
            controls="${this.id}"
            icon="delete"
            label="Remove this item"
            ?disabled="${this.disabled}"
            @click="${e => this._handleRemove()}"
          >
          </paper-icon-button>
          <simple-tooltip for="remove">Remove this item</simple-tooltip>
        </div>
      </div>
    `;
  }

  static get tag() {
    return "simple-fields-array-item";
  }

  static get properties() {
    return {
      /**
       * is disabled?
       */
      expanded: {
        type: Boolean
      },
      /**
       * is disabled?
       */
      disabled: {
        type: Boolean,
        reflect: true,
        attribute: "disabled"
      },
      /**
       * is disabled?
       */
      sortable: {
        type: Boolean,
        reflect: true,
        attribute: "sortable"
      },
      /**
       * fields to preview by
       */
      previewBy: {
        type: Array,
        reflect: true,
        attribute: "preview-by"
      }
      /**
       * fields to sort by
       * /
      sortBy: {
        type: Array,
        reflect: true,
        attribute: "sort-by"
      }*/
    };
  }

  constructor() {
    super();
    this.disabled = false;
    this.sortable = false;
    this.previewBy = [];
    //this.sortBy = [];
  }
  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => {
      /**
       * Fires when constructed, so that parent radio group can listen for it.
       *
       * @event add-item
       */
      this.dispatchEvent(
        new CustomEvent("added", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this
        })
      );
    }, 0);
  }
  get slots() {
    let slots = {};
    this.previewBy.forEach(field => (slots[field] = "preview"));
    return slots;
  }

  /**
   * Fires add event
   * @event add
   */
  _handleRemove() {
    this.dispatchEvent(
      new CustomEvent("remove", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
  }

  /**
   * Let the group know that this is gone.
   */
  disconnectedCallback() {
    /**
     * Fires when detatched, so that parent radio group will no longer listen for it.
     *
     * @event remoive-item
     */
    this.dispatchEvent(
      new CustomEvent("removed", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
    super.disconnectedCallback();
  }
}
window.customElements.define(SimpleFieldsArrayItem.tag, SimpleFieldsArrayItem);
export { SimpleFieldsArrayItem };
