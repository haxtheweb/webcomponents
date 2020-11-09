import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleFieldsFieldset } from "./simple-fields-fieldset.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
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
 * @group simple-fields
 * @element simple-fields-array-item
 * @demo ./demo/schema.html Schema
 * @demo ./demo/form.html Form
 */
class SimpleFieldsArrayItem extends SimpleFieldsFieldset {
  static get styles() {
    return [
      css`
        :host {
          padding: 0 var(--simple-fields-margin-small, 8px);
          border-radius: var(--simple-fields-border-radius, 2px);
          display: block;
          border: none;
          transform: rotate(0deg);
          transition: all 0.5s ease;
        }
        :host([disabled]) {
          opacity: 0.5;
        }
        :host([aria-expanded="true"]) {
          padding: var(--simple-fields-margin, 16px)
            var(--simple-fields-margin-small, 8px);
          border: 1px solid var(--simple-fields-border-color-light, #ccc);
          transition: all 0.5s ease;
        }
        :host([error]) {
          border: 1px solid var(--simple-fields-error-color, #dd2c00);
          transition: border 0.5s ease;
        }
        :host(:focus-within) {
          border: 1px solid var(--simple-fields-border-color, #999);
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
        :host #content-inner {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.75s ease 0.1s;
        }
        :host([aria-expanded="true"]) #content {
          max-height: 20000vh;
          transition: max-height 0.75s ease 0.1s;
        }
        :host([aria-expanded="true"]) #content-inner {
          max-height: 20000vh;
        }
        #content-inner > * {
          flex: 1 1 auto;
        }
        #remove {
          flex: 0 0 auto;
          color: var(--simple-fields-error-color, #ac0000);
        }
        #expand {
          padding: var(--simple-fields-margin-small, 8px);
          transform: rotate(0deg);
          transition: transform 0.5s ease-in-out;
        }
        :host([aria-expanded="true"]) #expand {
          transform: rotate(-90deg);
          transition: transform 0.5s ease-in-out;
        }
        simple-icon-button,
        simple-tooltip {
          font-family: var(--simple-fields-detail-font-family, sans-serif);
          font-size: var(--simple-fields-detail-font-size, 12px);
          line-height: var(--simple-fields-detail-line-height, 22px);
        }
        ::slotted([slot="preview"]:first-of-type) {
          margin-top: 0;
        }
        ::slotted([slot="preview"]:last-of-type) {
          margin-bottom: 0;
        }
      `,
    ];
  }
  render() {
    return html`
      <div id="heading">
        <simple-icon-button
          id="drag-handle"
          controls="${this.id}"
          icon="icons:open-with"
          label="Reorder this item"
          ?hidden="${!this.sortable}"
          ?disabled="${this.disabled}"
        >
        </simple-icon-button>
        <div id="preview"><slot name="preview"></slot></div>
        <simple-icon-button
          id="expand"
          controls="${this.id}"
          icon="icons:expand-more"
          label="Toggle expand"
          @click="${this.toggle}"
        >
        </simple-icon-button>
      </div>
      <div id="content">
        <div id="content-inner">
          <div><slot></slot></div>
          <simple-icon-button
            id="remove"
            controls="${this.id}"
            icon="delete"
            label="Remove this item"
            ?disabled="${this.disabled}"
            @click="${(e) => this._handleRemove()}"
          >
          </simple-icon-button>
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
        type: Boolean,
      },
      /**
       * is disabled?
       */
      disabled: {
        type: Boolean,
        reflect: true,
        attribute: "disabled",
      },
      /**
       * is disabled?
       */
      sortable: {
        type: Boolean,
        reflect: true,
        attribute: "sortable",
      },
      /**
       * is disabled?
       */
      preview: {
        type: Boolean,
      },
      /**
       * fields to preview by
       */
      previewBy: {
        type: Array,
        reflect: true,
        attribute: "preview-by",
      },
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
          detail: this,
        })
      );
    }, 0);
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      let expanded = this.getAttribute("aria-expanded");
      if (propName === "error")
        this.setAttribute("aria-expanded", this.error || expanded);
    });
  }
  get slots() {
    let slots = {};
    this.previewBy.forEach((field) => (slots[field] = "preview"));
    return slots;
  }
  /**
   * handles individual toggling
   */
  toggle() {
    if (this.getAttribute("aria-expanded") === "true") {
      this.setAttribute("aria-expanded", "false");
    } else {
      this.setAttribute("aria-expanded", "true");
    }
  }

  /**
   * Fires add event
   * @event add
   */
  _handleCopy() {
    this.dispatchEvent(
      new CustomEvent("copy", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this,
      })
    );
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
        detail: this,
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
        detail: this,
      })
    );
    super.disconnectedCallback();
  }
}
window.customElements.define(SimpleFieldsArrayItem.tag, SimpleFieldsArrayItem);
export { SimpleFieldsArrayItem };
