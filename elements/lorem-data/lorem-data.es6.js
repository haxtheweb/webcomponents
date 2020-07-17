import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
/**
 * `lorem-data`
 * an accessible expand collapse
 * 
### Styling

`<lorem-data>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--lorem-data-margin` | margin around lorem-data | 15px 0
`--lorem-data-border` | border around lorem-data | 1px solid
`--lorem-data-horizontal-padding` | horizontal padding inside lorem-data | 16px
`--lorem-data-horizontal-padding-left` | left padding inside lorem-data | `--lorem-data-horizontal-padding`
`--lorem-data-horizontal-padding-right` | right padding inside lorem-data | `--lorem-data-horizontal-padding`
`--lorem-data-vertical-padding` | vertical padding inside lorem-data | 16px
`--lorem-data-horizontal-padding-top` | top padding inside lorem-data | `--lorem-data-vertical-padding`
`--lorem-data-horizontal-padding-bottom` | bottom padding inside lorem-data | --lorem-data-vertical-padding
`--lorem-data-border-between` | border between lorem-data heading and content | --lorem-data-border
`--lorem-data-heading-font-weight` | font-weight for lorem-data heading | bold
`--lorem-data-heading-color` | text color for lorem-data heading | unset
`--lorem-data-heading-background-color` | background-color for lorem-data heading | unset
`--lorem-data-overflow-y` | override default overflow behavior | hidden
`--lorem-data-max-height` | override maximum height of collapse section | 200000000000vh, so that aanimation effect works
 *
 * @element lorem-data
 * @demo ./demo/index.html demo
 * @demo ./demo/group.html collapse groups
 * @element lorem-data
 */
class LoremData extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          margin: var(--lorem-data-margin, 15px 0);
          border: var(--lorem-data-border, 1px solid);
          transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
        }
        :host(:not(:first-of-type)) {
          border-top: var(
            --lorem-data-border-between,
            var(--lorem-data-border, 1px solid)
          );
        }
        :host([disabled]) {
          opacity: 0.5;
        }
        *[aria-controls="content"][disabled] {
          cursor: not-allowed;
        }
        #heading {
          display: flex;
          justify-content: stretch;
          align-items: center;
          padding: 0
            var(
              --lorem-data-padding-right,
              var(--lorem-data-horizontal-padding, 16px)
            )
            0
            var(
              --lorem-data-padding-left,
              var(--lorem-data-horizontal-padding, 16px)
            );
          font-weight: var(--lorem-data-heading-font-weight, bold);
          margin: var(--lorem-data-margin, unset);
          color: var(--lorem-data-heading-color, unset);
          background-color: var(
            --lorem-data-heading-background-color,
            unset
          );
        }
        #text {
          flex-grow: 1;
          overflow: hidden;
        }
        #expand {
          transform: rotate(0deg);
          transition: transform 0.75s ease;
          padding: (--lorem-data-icon-padding, unset);
        }
        #expand.rotated {
          transform: rotate(-90deg);
          transition: transform 0.75s ease;
        }
        #content {
          padding: 0
            var(
              --lorem-data-padding-right,
              var(--lorem-data-horizontal-padding, 16px)
            )
            0
            var(
              --lorem-data-padding-left,
              var(--lorem-data-horizontal-padding, 16px)
            );
          border-top: 0px solid;
          max-height: 0;
          transition: all 0.75s ease;
          overflow-y: hidden;
        }
        :host #content-inner {
          max-height: 0;
          overflow-y: var(--lorem-data-overflow-y, hidden);
        }
        :host([expanded]) #content {
          padding: var(
              --lorem-data-padding-top,
              var(--lorem-data-vertical-padding, 16px)
            )
            var(
              --lorem-data-padding-right,
              var(--lorem-data-horizontal-padding, 16px)
            )
            var(
              --lorem-data-padding-bottom,
              var(--lorem-data-vertical-padding, 16px)
            )
            var(
              --lorem-data-padding-left,
              var(--lorem-data-horizontal-padding, 16px)
            );
          border-top: var(--lorem-data-border, 1px solid);
          max-height: 200000000000vh;
        }
        :host([expanded]) #content-inner {
          max-height: var(--lorem-data-max-height, 200000000000vh);
          transition: max-height 0.75s ease;
        }
      `
    ];
  }
  render() {
    return html`
      ${this.accordion ? this._makeAccordionButton() : this._makeIconButton()}
      <div
        id="content"
        aria-hidden="${this.expanded ? "false" : "true"}"
        aria-labelledby="heading"
        aria-live="polite"
      >
        <div id="content-inner">
          <slot name="content"></slot>
          <slot></slot>
        </div>
      </div>
    `;
  }

  static get tag() {
    return "lorem-data";
  }

  static get properties() {
    return {
      /**
       * accordion-style: whole header acts as button? default is just icon.
       */
      accordion: {
        type: Boolean,
        reflect: true
      },
      /**
       * is disabled?
       */
      disabled: {
        type: Boolean,
        reflect: true
      },
      /**
       * icon when expanded
       */
      expanded: {
        type: Boolean,
        reflect: true
      },
      /**
       * icon for the button
       */
      icon: {
        type: String
      },
      /**
       * icon when expanded
       */
      iconExpanded: {
        type: String,
        attribute: "icon-expanded"
      },
      /**
       * label for the button
       */
      label: {
        type: String
      },
      /**
       * optional label for the button when expanded
       */
      labelExpanded: {
        type: String,
        attribute: "label-expanded"
      },
      /**
       * tooltip for the button
       */
      tooltip: {
        type: String
      },
      /**
       * optional tooltip for the button when expanded
       */
      tooltipExpanded: {
        type: String,
        attribute: "tooltip-expanded"
      }
    };
  }

  constructor() {
    super();
    this.accordion = false;
    this.disabled = false;
    this.expanded = false;
    this.icon = "icons:expand-more";
    this.label = "expand / collapse";
    this.tooltip = "toggle expand / collapse";
  }
  static get haxProperties() {
    return {
      canScale: false,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Single Expand Collapse",
        description: "A single instance of an expand collapse.",
        icon: "view-day",
        color: "grey",
        groups: ["Text"]
      },
      settings: {
        quick: [
          {
            property: "accordion",
            title: "Heading Button",
            description: "Make entire heading clickble.",
            inputMethod: "boolean"
          },
          {
            property: "expanded",
            title: "Expanded",
            description: "Expand by default",
            inputMethod: "boolean"
          }
        ],
        configure: [
          {
            slot: "heading",
            title: "Heading",
            description: "The heading for the collapse.",
            inputMethod: "textfield"
          },
          {
            slot: "content",
            title: "Content",
            description: "The content for the collapse.",
            inputMethod: "code-editor"
          },
          {
            property: "accordion",
            title: "Heading Button",
            description: "Make entire heading clickble.",
            inputMethod: "boolean"
          },
          {
            property: "expanded",
            title: "Expanded",
            description: "Expand by default",
            inputMethod: "boolean"
          },
          {
            property: "icon",
            title: "Icon",
            description: "The icon for the toggle expand/collapse button.",
            inputMethod: "iconpicker",
            options: []
          },
          {
            property: "iconExpanded",
            title: "Icon (when expanded)",
            description:
              "Optional: The icon for the toggle expand/collapse button when expanded",
            inputMethod: "iconpicker",
            options: []
          },
          {
            property: "label",
            title: "Label",
            description: "The label of the toggle expand/collapse button",
            inputMethod: "textfield"
          },
          {
            property: "labelExpanded",
            title: "Label (when expanded)",
            description:
              "The label of the toggle expand/collapse button when expanded.",
            inputMethod: "textfield"
          },
          {
            property: "tooltip",
            title: "Tooltip",
            description: "The tooltip for the toggle expand/collapse button",
            inputMethod: "textfield"
          },
          {
            property: "tooltipExpanded",
            title: "Tooltip (when expanded)",
            description:
              "The tooltip for the toggle expand/collapse button when expanded",
            inputMethod: "textfield"
          }
        ],
        advanced: []
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => {
      /**
       * Fires when constructed, so that parent radio group can listen for it.
       *
       * @event lorem-data-attached
       */
      this.dispatchEvent(
        new CustomEvent("lorem-data-attached", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this
        })
      );
    }, 0);
  }

  /**
   * Let the group know that this is gone.
   */
  disconnectedCallback() {
    /**
     * Fires when detatched, so that parent radio group will no longer listen for it.
     *
     * @event lorem-data-detached
     */
    this.dispatchEvent(
      new CustomEvent("lorem-data-detached", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
    super.disconnectedCallback();
  }
  /**
   * Collapses the content
   */
  collapse() {
    this.toggle(false);
  }

  /**
   * Expands the content
   */
  expand() {
    this.toggle(true);
  }

  /**
   * Toggles based on mode
   * @param {boolean} open whether to toggle open
   */
  toggle(open = !this.expanded) {
    this.expanded = open;
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "expanded") this._fireToggleEvents();
    });
  }

  /**
   * Fires toggling events
   */
  _fireToggleEvents() {
    /**
     * Fires when toggled.
     *
     * @event toggle
     */
    this.dispatchEvent(
      new CustomEvent("toggle", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
    /**
     * Deprecated. Fires when toggled.
     *
     * @event lorem-data-toggle
     */
    this.dispatchEvent(
      new CustomEvent("lorem-data-toggle", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
    if (this.expanded) {
      /**
       * Fires when expanded.
       *
       * @event expand
       */
      this.dispatchEvent(
        new CustomEvent("expand", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this
        })
      );
    } else {
      /**
       * Fires when collapsed.
       *
       * @event collapse
       */
      this.dispatchEvent(
        new CustomEvent("collapse", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this
        })
      );
    }
  }
  /**
   * determines the property based on expanded state
   * @param {string} defaultProp default property
   * @param {string} expandedProp property when expanded
   * @param {boolean} expanded whether lorem-data is expanded
   * @returns {string} property based on expanded state
   */
  _getExpanded(defaultProp, expandedProp, expanded) {
    return expanded && expandedProp ? expandedProp : defaultProp;
  }
  /**
   * renders collapse item where only entire heading is clickable button
   * @returns {object} html template for a heading as a clickable button
   */
  _makeAccordionButton() {
    return html`
      <div
        id="heading"
        aria-controls="content"
        aria-expanded="${this.expanded ? "true" : "false"}"
        role="button"
        @click="${this._onClick}"
        ?disabled="${this.disabled}"
        .label="${this._getExpanded(
          this.label,
          this.labelExpanded,
          this.expanded
        )}"
      >
        <div id="text"><slot name="heading"></slot></div>
        <iron-icon
          id="expand"
          class="${!this.expanded && !this.iconExpanded ? "rotated" : ""}"
          .icon="${this._getExpanded(
            this.icon,
            this.iconExpanded,
            this.expanded
          )}"
          aria-hidden="true"
        >
        </iron-icon>
      </div>
      <simple-tooltip for="heading"
        >${this._getExpanded(
          this.tooltip,
          this.tooltipExpanded,
          this.expanded
        )}</simple-tooltip
      >
    `;
  }
  /**
   * renders collapse item where only icon is a clickable button
   * @returns {object} html template for a heading with an icon button
   */
  _makeIconButton() {
    return html`
      <div id="heading">
        <div id="text"><slot name="heading"></slot></div>
        <paper-icon-button
          id="expand"
          class="${!this.expanded && !this.iconExpanded ? "rotated" : ""}"
          @click="${this._onClick}"
          ?disabled="${this.disabled}"
          .label="${this._getExpanded(
            this.label,
            this.labelExpanded,
            this.expanded
          )}"
          .icon="${this._getExpanded(
            this.icon,
            this.iconExpanded,
            this.expanded
          )}"
          aria-controls="content"
          aria-expanded="${this.expanded ? "true" : "false"}"
        >
        </paper-icon-button>
        <simple-tooltip for="expand"
          >${this._getExpanded(
            this.tooltip,
            this.tooltipExpanded,
            this.expanded
          )}</simple-tooltip
        >
      </div>
    `;
  }

  /**
   * Handle click
   */
  _onClick() {
    if (!this.disabled) {
      this.toggle();
      /**
       * Fires when clicked.
       *
       * @event lorem-data-click
       */
      this.dispatchEvent(
        new CustomEvent("lorem-data-click", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this
        })
      );
    }
  }
}
window.customElements.define(LoremData.tag, LoremData);
export { LoremData };
