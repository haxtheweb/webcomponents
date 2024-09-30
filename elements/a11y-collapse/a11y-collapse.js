import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
/**
 * `a11y-collapse`
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
`--a11y-collapse-overflow-y` | override default overflow behavior | hidden
`--a11y-collapse-max-height` | override maximum height of collapse section | 200000000000vh, so that aanimation effect works
 *
 * @customElement
 * @extends LitElement
 * @demo demo/index.html
 * @demo ./demo/group.html collapse groups
 */
class A11yCollapse extends DDD {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          margin: var(--a11y-collapse-margin, var(--ddd-spacing-4) 0);
          border: var(--a11y-collapse-border, var(--ddd-border-sm));
          border-color: var(
            --a11y-collapse-border-color,
            var(--ddd-theme-default-coalyGray)
          );
          transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
        }
        :host([heading-button]) #heading {
          cursor: pointer;
        }
        :host(:not(:first-of-type)) {
          border-top: var(
            --a11y-collapse-border-between,
            var(--a11y-collapse-border, var(--ddd-border-xs))
          );
        }
        :host([disabled]) {
          opacity: 0.5;
        }
        *[aria-controls="content"][disabled] {
          cursor: not-allowed;
        }
        button {
          background: transparent;
          border: 0;
          padding: 0;
          margin: 0;
          width: 100%;
          text-align: left;
          font-size: var(--ddd-theme-body-font-size);
          font-family: var(--ddd-font-primary);
        }
        #heading {
          display: flex;
          justify-content: stretch;
          align-items: center;
          padding: 0
            var(
              --a11y-collapse-padding-right,
              var(--a11y-collapse-horizontal-padding, var(--ddd-spacing-4))
            )
            0
            var(
              --a11y-collapse-padding-left,
              var(--a11y-collapse-horizontal-padding, var(--ddd-spacing-4))
            );
          font-weight: var(
            --a11y-collapse-heading-font-weight,
            var(--ddd-font-weight-bold)
          );
          margin: var(--a11y-collapse-margin);
          color: var(--a11y-collapse-heading-color);

          background-color: var(--a11y-collapse-heading-background-color);
        }
        #text {
          flex-grow: 1;
          overflow: hidden;
        }
        #expand {
          transform: rotate(0deg);
          transition: transform 0.75s ease;
        }
        #content {
          padding: var(
              --a11y-collapse-padding-top,
              var(--a11y-collapse-vertical-padding, var(--ddd-spacing-4))
            )
            var(
              --a11y-collapse-padding-right,
              var(--a11y-collapse-horizontal-padding, var(--ddd-spacing-4))
            )
            var(
              --a11y-collapse-padding-bottom,
              var(--a11y-collapse-vertical-padding, var(--ddd-spacing-4))
            )
            var(
              --a11y-collapse-padding-left,
              var(--a11y-collapse-horizontal-padding, var(--ddd-spacing-4))
            );
          border-top: var(--a11y-collapse-border, var(--ddd-border-xs));
          border-color: var(
            --a11y-collapse-border-color,
            var(--ddd-theme-default-coalyGray)
          );
        }
        @media screen {
          #expand.rotated {
            transform: rotate(-90deg);
            transition: transform 0.75s ease;
          }
          :host #content {
            padding: 0
              var(
                --a11y-collapse-padding-right,
                var(--a11y-collapse-horizontal-padding, var(--ddd-spacing-4))
              )
              0
              var(
                --a11y-collapse-padding-left,
                var(--a11y-collapse-horizontal-padding, var(--ddd-spacing-4))
              );
            border-top: none;
            border-color: var(--a11y-collapse-border-color);
            max-height: 0;
            transition:
              visibility 0.75s ease,
              opacity 0.75s ease,
              max-height 0.75s ease;
            overflow-y: hidden;
            opacity: 1;
            visibility: visible;
          }
          :host #content-inner {
            max-height: 0;
            overflow-y: var(--a11y-collapse-overflow-y, hidden);
          }
          :host([expanded]) #content {
            padding: var(
                --a11y-collapse-padding-top,
                var(--a11y-collapse-vertical-padding, var(--ddd-spacing-4))
              )
              var(
                --a11y-collapse-padding-right,
                var(--a11y-collapse-horizontal-padding, var(--ddd-spacing-4))
              )
              var(
                --a11y-collapse-padding-bottom,
                var(--a11y-collapse-vertical-padding, var(--ddd-spacing-4))
              )
              var(
                --a11y-collapse-padding-left,
                var(--a11y-collapse-horizontal-padding, var(--ddd-spacing-4))
              );
            border-top: var(--a11y-collapse-border, var(--ddd-border-xs));
            border-color: var(
              --a11y-collapse-border-color,
              var(--ddd-theme-default-coalyGray)
            );
            max-height: 200000000000vh; /* why is this needed? */
          }
          :host([expanded]) #content-inner {
            max-height: var(--a11y-collapse-max-height, 200000000000vh);
            transition: max-height 0.75s ease;
          }
          :host(:not([expanded])) #content {
            visibility: hidden;
            opacity: 0;
            height: 0;
          }
        }
      `,
    ];
  }
  render() {
    return html`
      ${this.headingButton || this.accordion
        ? this._makeHeadingButton()
        : this._makeIconButton()}
      <div
        id="content"
        aria-hidden="${this.expanded ? "false" : "true"}"
        aria-labelledby="heading"
        aria-live="polite"
      >
        <div id="content-inner">
          ${this.expanded
            ? html`<slot name="content"></slot><slot></slot>`
            : ``}
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
       * Heading is the expand button.
       */
      headingButton: {
        type: Boolean,
        reflect: true,
        attribute: "heading-button",
      },
      /**
       * disbled
       */
      disabled: {
        type: Boolean,
        reflect: true,
      },
      /**
       * hidden
       */
      hidden: {
        type: Boolean,
        reflect: true,
      },
      /**
       * icon when expanded
       */
      expanded: {
        type: Boolean,
        reflect: true,
      },
      /**
       * icon for the button
       */
      icon: {
        type: String,
      },
      /**
       * icon when expanded
       */
      iconExpanded: {
        type: String,
        attribute: "icon-expanded",
      },
      /**
       * label for the button
       */
      label: {
        type: String,
      },
      /**
       * heading / title for the button
       */
      heading: {
        type: String,
      },
      /**
       * optional label for the button when expanded
       */
      labelExpanded: {
        type: String,
        attribute: "label-expanded",
      },
      /**
       * tooltip for the button
       */
      tooltip: {
        type: String,
      },
      /**
       * optional tooltip for the button when expanded
       */
      tooltipExpanded: {
        type: String,
        attribute: "tooltip-expanded",
      },
      /**
       * @deprecated Use {@link headingButton} instead
       */
      accordion: {
        type: Boolean,
        reflect: true,
      },
    };
  }

  constructor() {
    super();
    this.headingButton = false;
    this.accordion = false;
    this.disabled = false;
    this.hidden = false;
    this.expanded = false;
    this.heading = null;
    this.icon = "icons:expand-more";
    this.label = "expand";
    this.tooltip = "expand";
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => {
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
          detail: this,
        }),
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
     * @event a11y-collapse-detached
     */

    this.dispatchEvent(
      new CustomEvent("a11y-collapse-detached", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this,
      }),
    );
    super.disconnectedCallback();
  }
  /**
   * Collapses the content
   */
  collapse() {
    this.toggle(false);
  }

  /**button

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
        detail: this,
      }),
    );
    /**
     * Fires when toggled. @deprecated Use `toggle` instead
     *
     * @event a11y-collapse-toggle
     */
    this.dispatchEvent(
      new CustomEvent("a11y-collapse-toggle", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this,
      }),
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
          detail: this,
        }),
      );
      this.label = "collapse";
      this.tooltip = "collapse";
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
          detail: this,
        }),
      );
      this.label = "expand";
      this.tooltip = "expand";
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
    return expanded && expandedProp ? expandedProp : defaultProp;
  }
  /**
   * renders collapse item where only entire heading is clickable button
   * @returns {object} html template for a heading as a clickable button
   */
  _makeHeadingButton() {
    return html`
      <button
        @click="${this._onClick}"
        aria-controls="content"
        aria-expanded="${this.expanded ? "true" : "false"}"
      >
        <div
          id="heading"
          part="heading-id"
          ?disabled="${this.disabled}"
          .label="${this._getExpanded(
            this.label,
            this.labelExpanded,
            this.expanded,
          )}"
        >
          <div id="text">
            ${this.heading
              ? html`<p part="heading">${this.heading}</p>`
              : ``}<slot name="heading"></slot>
          </div>
          <simple-icon-lite
            id="expand"
            part="icon"
            class="${!this.expanded && !this.iconExpanded ? "rotated" : ""}"
            .icon="${this._getExpanded(
              this.icon || "icons:expand-more",
              this.iconExpanded,
              this.expanded,
            )}"
            aria-hidden="true"
          >
          </simple-icon-lite>
        </div>
      </button>
      <simple-tooltip for="heading"
        >${this._getExpanded(
          this.tooltip,
          this.tooltipExpanded,
          this.expanded,
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
      <div id="heading" part="heading-id">
        <div id="text">
          ${this.heading
            ? html`<p part="heading">${this.heading}</p>`
            : ``}<slot name="heading"></slot>
        </div>
        <simple-icon-button-lite
          id="expand"
          part="icon"
          class="${!this.expanded && !this.iconExpanded ? "rotated" : ""}"
          @click="${this._onClick}"
          ?disabled="${this.disabled}"
          .label="${this._getExpanded(
            this.label,
            this.labelExpanded,
            this.expanded,
          )}"
          .icon="${this._getExpanded(
            this.icon || "icons:expand-more",
            this.iconExpanded,
            this.expanded,
          )}"
          aria-controls="content"
          aria-expanded="${this.expanded ? "true" : "false"}"
        >
        </simple-icon-button-lite>
        <simple-tooltip for="expand"
          >${this._getExpanded(
            this.tooltip,
            this.tooltipExpanded,
            this.expanded,
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
      this.shadowRoot.querySelector("simple-tooltip").hide();
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
          detail: this,
        }),
      );
    }
  }
  /**
   *  @deprecated Use  {@link _makeHeadingButton} instead
   *
   * @memberof A11yCollapse
   */
  _makeAccordionButton() {
    this._makeHeadingButton();
  }
}
customElements.define(A11yCollapse.tag, A11yCollapse);
export { A11yCollapse };
