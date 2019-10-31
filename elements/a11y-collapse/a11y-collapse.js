import { LitElement, html, css } from "lit-element/lit-element.js";
import "./lib/a11y-collapse-accordion-button.js";
import "./lib/a11y-collapse-icon-button.js";
/**
 * `a11y-collapse`
 * An accessible expand collapse.
 *
 * @customElement
 * @demo demo/index.html demo
 * @demo demo/accordion.html collapse groups
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
        :host(:not(:first-of-type)) {
          border-top: var(
            --a11y-collapse-border-between,
            var(--a11y-collapse-border, 1px solid)
          );
        }
        :host([disabled]) {
          opacity: 0.5;
        }
        :host([disabled]:not([accordion])) #expand,
        :host([disabled][accordion]) #heading {
          cursor: not-allowed;
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
        :host(:not([expanded])) #content-inner {
          overflow: hidden;
        }
      `
    ];
  }
  render() {
    let heading = this.accordion
      ? html`
          <a11y-collapse-accordion-button
            id="accordionbutton"
            ?disabled="${this.disabled}"
            ?expanded="${this.expanded}"
            ?rotated="${!this.expanded && this.iconExpanded === null}"
            .label="${this.expanded && this.labelExpanded
              ? this.labelExpanded
              : this.label}"
            .icon="${this.expanded && this.iconlExpanded
              ? this.iconExpanded
              : this.icon}"
            .tooltip="${this.expanded && this.tooltiplExpanded
              ? this.tooltipExpanded
              : this.tooltip}"
          >
            <slot name="heading"></slot>
          </a11y-collapse-accordion-button>
        `
      : html`
          <a11y-collapse-icon-button
            id="iconbutton"
            ?disabled="${this.disabled}"
            ?expanded="${this.expanded}"
            ?rotated="${!this.expanded && this.iconExpanded === null}"
            .label="${this.expanded && this.labelExpanded
              ? this.labelExpanded
              : this.label}"
            .icon="${this.expanded && this.iconlExpanded
              ? this.iconExpanded
              : this.icon}"
            .tooltip="${this.expanded && this.tooltiplExpanded
              ? this.tooltipExpanded
              : this.tooltip}"
          >
            <slot name="heading"></slot>
          </a11y-collapse-icon-button>
        `;
    return html`
      ${heading}
      <div
        id="content"
        aria-hidden="${this.expanded ? "false" : "true"}"
        aria-labelledby="heading"
        aria-live="polite"
      >
        <div id="content-inner"><slot name="content"></slot><slot></slot></div>
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
        type: String
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
        type: String
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
        type: String
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
  }
  /**
   * Attached to the DOM, now fire.
   */
  connectedCallback() {
    super.connectedCallback();
    this.dispatchEvent(
      new CustomEvent("a11y-collapse-attached", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
    this.addEventListener("a11y-collapse-tap", this._onTap.bind(this));
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
        groups: ["Text"],
        meta: {
          author: "Your organization on github"
        }
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "expanded",
            title: "Expanded",
            description: "Expand by default",
            inputMethod: "boolean"
          },
          {
            property: "label",
            title: "Label",
            description: "The label of the toggle expand/collapse button",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "tooltip",
            title: "Tooltip",
            description: "The tooltip for the toggle expand/collapse button",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "icon",
            title: "Icon",
            description: "The icon for the toggle expand/collapse button",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "iconExpanded",
            title: "Expanded Icon",
            description:
              "Optional: The icon for the toggle expand/collapse button when expanded",
            inputMethod: "textfield",
            icon: "editor:title"
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
    this.dispatchEvent(
      new CustomEvent("a11y-collapse-detached", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
    this.removeEventListener("a11y-collapse-tap", this._onTap.bind(this));
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
    this.dispatchEvent(
      new CustomEvent("toggle", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
    //supports legacy version
    this.dispatchEvent(
      new CustomEvent("a11y-collapse-toggle", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
    if (this.expanded) {
      this.dispatchEvent(
        new CustomEvent("expand", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this
        })
      );
    } else {
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
   * Handle tap
   */
  _onTap() {
    if (!this.disabled) {
      this.toggle();
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
