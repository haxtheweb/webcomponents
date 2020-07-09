import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
/**
 * `threaded-discussion`
 * an accessible expand collapse
 * 
### Styling

`<threaded-discussion>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--threaded-discussion-margin` | margin around threaded-discussion | 15px 0
`--threaded-discussion-border` | border around threaded-discussion | 1px solid
`--threaded-discussion-horizontal-padding` | horizontal padding inside threaded-discussion | 16px
`--threaded-discussion-horizontal-padding-left` | left padding inside threaded-discussion | `--threaded-discussion-horizontal-padding`
`--threaded-discussion-horizontal-padding-right` | right padding inside threaded-discussion | `--threaded-discussion-horizontal-padding`
`--threaded-discussion-vertical-padding` | vertical padding inside threaded-discussion | 16px
`--threaded-discussion-horizontal-padding-top` | top padding inside threaded-discussion | `--threaded-discussion-vertical-padding`
`--threaded-discussion-horizontal-padding-bottom` | bottom padding inside threaded-discussion | --threaded-discussion-vertical-padding
`--threaded-discussion-border-between` | border between threaded-discussion heading and content | --threaded-discussion-border
`--threaded-discussion-heading-font-weight` | font-weight for threaded-discussion heading | bold
`--threaded-discussion-heading-color` | text color for threaded-discussion heading | unset
`--threaded-discussion-heading-background-color` | background-color for threaded-discussion heading | unset
`--threaded-discussion-overflow-y` | override default overflow behavior | hidden
`--threaded-discussion-max-height` | override maximum height of collapse section | 200000000000vh, so that aanimation effect works
 *
 * @element threaded-discussion
 * @demo ./demo/index.html demo
 * @demo ./demo/group.html collapse groups
 * @element threaded-discussion
 */
class ThreadedDiscussion extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          margin: var(--threaded-discussion-margin, 15px 0);
          border: var(--threaded-discussion-border, 1px solid);
          transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
        }
        :host(:not(:first-of-type)) {
          border-top: var(
            --threaded-discussion-border-between,
            var(--threaded-discussion-border, 1px solid)
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
              --threaded-discussion-padding-right,
              var(--threaded-discussion-horizontal-padding, 16px)
            )
            0
            var(
              --threaded-discussion-padding-left,
              var(--threaded-discussion-horizontal-padding, 16px)
            );
          font-weight: var(--threaded-discussion-heading-font-weight, bold);
          margin: var(--threaded-discussion-margin, unset);
          color: var(--threaded-discussion-heading-color, unset);
          background-color: var(
            --threaded-discussion-heading-background-color,
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
          padding: (--threaded-discussion-icon-padding, unset);
        }
        #expand.rotated {
          transform: rotate(-90deg);
          transition: transform 0.75s ease;
        }
        #content {
          padding: 0
            var(
              --threaded-discussion-padding-right,
              var(--threaded-discussion-horizontal-padding, 16px)
            )
            0
            var(
              --threaded-discussion-padding-left,
              var(--threaded-discussion-horizontal-padding, 16px)
            );
          border-top: 0px solid;
          max-height: 0;
          transition: all 0.75s ease;
          overflow-y: hidden;
        }
        :host #content-inner {
          max-height: 0;
          overflow-y: var(--threaded-discussion-overflow-y, hidden);
        }
        :host([expanded]) #content {
          padding: var(
              --threaded-discussion-padding-top,
              var(--threaded-discussion-vertical-padding, 16px)
            )
            var(
              --threaded-discussion-padding-right,
              var(--threaded-discussion-horizontal-padding, 16px)
            )
            var(
              --threaded-discussion-padding-bottom,
              var(--threaded-discussion-vertical-padding, 16px)
            )
            var(
              --threaded-discussion-padding-left,
              var(--threaded-discussion-horizontal-padding, 16px)
            );
          border-top: var(--threaded-discussion-border, 1px solid);
          max-height: 200000000000vh;
        }
        :host([expanded]) #content-inner {
          max-height: var(--threaded-discussion-max-height, 200000000000vh);
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
    return "threaded-discussion";
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
       * @event threaded-discussion-attached
       */
      this.dispatchEvent(
        new CustomEvent("threaded-discussion-attached", {
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
     * @event threaded-discussion-detached
     */
    this.dispatchEvent(
      new CustomEvent("threaded-discussion-detached", {
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
     * @event threaded-discussion-toggle
     */
    this.dispatchEvent(
      new CustomEvent("threaded-discussion-toggle", {
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
   * @param {boolean} expanded whether threaded-discussion is expanded
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
       * @event threaded-discussion-click
       */
      this.dispatchEvent(
        new CustomEvent("threaded-discussion-click", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this
        })
      );
    }
  }
}
window.customElements.define(ThreadedDiscussion.tag, ThreadedDiscussion);
export { ThreadedDiscussion };
