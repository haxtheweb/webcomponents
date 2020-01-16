import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
/**
 * `a11y-collapse`
 * @customElement a11y-collapse
 * an accessible expand collapse
 * 
### Styling

`<a11y-collapse>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--a11y-collapse-margin` | margin around a11y-collapse | 15px 0
`--a11y-collapse-border` | border around a11y-collapse | 1px solid
`--a11y-collapse-horizontal-padding` | horizontal padding inside a11y-collapse | 16px
`--a11y-collapse-horizontal-padding-left` | left padding inside a11y-collapse | `--a11y-collapse-horizontal-padding`
`--a11y-collapse-horizontal-padding-right` | right padding inside a11y-collapse | `--a11y-collapse-horizontal-padding`
`--a11y-collapse-vertical-padding` | vertical padding inside a11y-collapse | 16px
`--a11y-collapse-horizontal-padding-top` | top padding inside a11y-collapse | `--a11y-collapse-vertical-padding`
`--a11y-collapse-horizontal-padding-bottom` | bottom padding inside a11y-collapse | --a11y-collapse-vertical-padding
`--a11y-collapse-border-between` | border between a11y-collapse heading and content | --a11y-collapse-border
`--a11y-collapse-heading-font-weight` | font-weight for a11y-collapse heading | bold
`--a11y-collapse-heading-color` | text color for a11y-collapse heading | unset
`--a11y-collapse-heading-background-color` | background-color for a11y-collapse heading | unset
 *

 * @demo ./demo/index.html demo
 * @demo ./demo/group.html collapse groups
 */
class A11yCollapse extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          margin: var(--a11y-collapse-margin, 15px 0);
          border: var(--a11y-collapse-border, 1px solid);
          transition: all 0.5s;
        }
        :host(:not(:first-of-type)) {
          border-top: var(
            --a11y-collapse-border-between,
            var(--a11y-collapse-border, 1px solid)
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
              --a11y-collapse-padding-right,
              var(--a11y-collapse-horizontal-padding, 16px)
            )
            0
            var(
              --a11y-collapse-padding-left,
              var(--a11y-collapse-horizontal-padding, 16px)
            );
          font-weight: var(--a11y-collapse-heading-font-weight, bold);
          margin: var(--a11y-collapse-margin, unset);
          color: var(--a11y-collapse-heading-color, unset);
          background-color: var(
            --a11y-collapse-heading-background-color,
            unset
          );
        }
        #text {
          flex-grow: 1;
        }
        #expand {
          transition: transform 0.5s;
          padding: (--a11y-collapse-icon-padding, unset);
        }
        #expand[rotated] {
          transform: rotate(-90deg);
        }
        #content {
          max-height: 0;
          overflow: hidden;
          padding: 0
            var(
              --a11y-collapse-padding-right,
              var(--a11y-collapse-horizontal-padding, 16px)
            )
            0
            var(
              --a11y-collapse-padding-left,
              var(--a11y-collapse-horizontal-padding, 16px)
            );
          border-top: 0px solid rgba(255, 255, 255, 0);
          transition: all 0.5s ease-in-out;
        }
        :host #content-inner {
          overflow: hidden;
        }
        :host([expanded]) #content {
          max-height: unset;
          overflow: hidden;
          padding: var(
              --a11y-collapse-padding-top,
              var(--a11y-collapse-vertical-padding, 16px)
            )
            var(
              --a11y-collapse-padding-right,
              var(--a11y-collapse-horizontal-padding, 16px)
            )
            var(
              --a11y-collapse-padding-bottom,
              var(--a11y-collapse-vertical-padding, 16px)
            )
            var(
              --a11y-collapse-padding-left,
              var(--a11y-collapse-horizontal-padding, 16px)
            );
          border-top: var(--a11y-collapse-border, 1px solid);
        }
        :host([expanded]) #content-inner {
          overflow: unset;
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
    return "a11y-collapse";
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
    this.icon = "expand-more";
    this.iconExpanded = null;
    this.label = "expand/collapse";
    this.labelExpanded = null;
    this.tooltip = "toggle expand/collapse";
    this.tooltipExpanded = null;
    /**
     * Fires when constructed, so that parent radio group can listen for it.
     *
     * @event a11y-collapse-attached
     */
    this.dispatchEvent(
      new CustomEvent("a11y-collapse-attached", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
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
            inputMethod: "textfield"
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
            inputMethod: "textfield"
          },
          {
            property: "iconExpanded",
            title: "Icon (when expanded)",
            description:
              "Optional: The icon for the toggle expand/collapse button when expanded",
            inputMethod: "textfield"
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

  /**
   * Let the group know that this is gone.
   */
  disconnectedCallback() {
    /**
     * Fires when detatched, so that parent radio group will no longer listen for it.
     *
     * @event a11y-collapse-detached
     */
    this.dispatchEvent(
      new CustomEvent("a11y-collapse-detached", {
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
     * @event a11y-collapse-toggle
     */
    this.dispatchEvent(
      new CustomEvent("a11y-collapse-toggle", {
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
   * @param {boolean} expanded whether a11y-collapse is expanded
   * @returns {string} property based on expanded state
   */
  _getExpanded(defaultProp, expandedProp, expanded) {
    return expanded && expandedProp !== null ? expandedProp : defaultProp;
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
          ?rotated="${!this.expanded && this.iconExpanded === null}"
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
          @click="${this._onClick}"
          ?disabled="${this.disabled}"
          ?rotated="${!this.expanded && this.iconExpanded === null}"
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
       * @event a11y-collapse-click
       */
      this.dispatchEvent(
        new CustomEvent("a11y-collapse-click", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this
        })
      );
    }
  }
}
window.customElements.define(A11yCollapse.tag, A11yCollapse);
export { A11yCollapse };
