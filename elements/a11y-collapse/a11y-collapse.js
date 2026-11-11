import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import {
  activityId,
  buildStatement,
  XAPI_ACTIVITY_TYPES,
  XAPI_EXTENSIONS,
} from "@haxtheweb/user-action/lib/xapi.js";

class A11yCollapse extends I18NMixin(DDD) {
  static get styles() {
    return [
      super.styles,
      css`
        /* DDD frame: 1px line, medium radius; a11y-collapse-group sets
           --a11y-collapse-border-radius to 0 and --a11y-collapse-group-radius
           so its items share one frame (first and last keep the corners) */
        :host {
          display: block;
          color-scheme: light dark;
          --a11y-collapse-_radius-top: var(
            --a11y-collapse-border-radius,
            var(--ddd-radius-md)
          );
          --a11y-collapse-_radius-bottom: var(
            --a11y-collapse-border-radius,
            var(--ddd-radius-md)
          );
          --a11y-collapse-_line: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          --a11y-collapse-_tint: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            color-mix(in srgb, var(--ddd-theme-default-white) 6%, transparent)
          );
          --a11y-collapse-_title: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
          --a11y-collapse-_action: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
          --a11y-collapse-_action-ink: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          margin: var(--a11y-collapse-margin, var(--ddd-spacing-4) 0);
          border: var(--a11y-collapse-border, var(--ddd-border-xs));
          border-color: var(
            --a11y-collapse-border-color,
            var(--a11y-collapse-_line)
          );
          border-radius: var(--a11y-collapse-_radius-top)
            var(--a11y-collapse-_radius-top) var(--a11y-collapse-_radius-bottom)
            var(--a11y-collapse-_radius-bottom);
          transition: all var(--ddd-duration-slow, 0.6s)
            cubic-bezier(0.075, 0.82, 0.165, 1);
        }
        :host(:first-of-type) {
          --a11y-collapse-_radius-top: var(
            --a11y-collapse-group-radius,
            var(--a11y-collapse-border-radius, var(--ddd-radius-md))
          );
        }
        :host(:last-of-type) {
          --a11y-collapse-_radius-bottom: var(
            --a11y-collapse-group-radius,
            var(--a11y-collapse-border-radius, var(--ddd-radius-md))
          );
        }
        :host([heading-button]) #heading {
          cursor: pointer;
        }
        :host(:not(:first-of-type)) {
          border-top: var(
            --a11y-collapse-border-between,
            var(--a11y-collapse-border, var(--ddd-border-xs))
          );
          border-top-color: var(
            --a11y-collapse-border-color,
            var(--a11y-collapse-_line)
          );
        }
        :host([disabled]) #text {
          opacity: var(--ddd-state-disabled-opacity, 0.5);
        }
        *[aria-controls="content"][disabled] {
          cursor: not-allowed;
        }
        /* heading-button: the whole row is the button */
        button {
          display: block;
          background: transparent;
          border: 0;
          padding: 0;
          margin: var(--ddd-spacing-0);
          width: 100%;
          text-align: start;
          color: inherit;
          font-size: var(--ddd-theme-body-font-size);
          font-family: var(--ddd-font-primary);
          border-radius: max(
              0px,
              calc(var(--a11y-collapse-_radius-top) - var(--ddd-border-size-xs))
            )
            max(
              0px,
              calc(var(--a11y-collapse-_radius-top) - var(--ddd-border-size-xs))
            )
            max(
              0px,
              calc(
                var(--a11y-collapse-_radius-bottom) - var(--ddd-border-size-xs)
              )
            )
            max(
              0px,
              calc(
                var(--a11y-collapse-_radius-bottom) - var(--ddd-border-size-xs)
              )
            );
        }
        :host([expanded]) button {
          border-end-start-radius: 0;
          border-end-end-radius: 0;
        }
        /* hover tint: a light wash, not a filled bar (a faint white over
           the dark page, so it also reads on themed dark backgrounds) */
        button:not([disabled]):hover {
          background-color: var(
            --a11y-collapse-heading-hover-background-color,
            var(--a11y-collapse-_tint)
          );
        }
        button:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: calc(-1 * var(--ddd-focus-offset));
        }
        #heading {
          display: flex;
          justify-content: stretch;
          align-items: center;
          gap: var(--ddd-spacing-3);
          box-sizing: border-box;
          min-height: var(
            --a11y-collapse-heading-min-height,
            var(--ddd-control-height-md)
          );
          padding-block: var(
            --a11y-collapse-heading-vertical-padding,
            var(--ddd-spacing-1)
          );
          padding-inline: var(
              --a11y-collapse-padding-left,
              var(--a11y-collapse-horizontal-padding, var(--ddd-spacing-4))
            )
            var(
              --a11y-collapse-padding-right,
              var(--a11y-collapse-horizontal-padding, var(--ddd-spacing-2))
            );
          font-weight: var(
            --a11y-collapse-heading-font-weight,
            var(--ddd-font-weight-bold)
          );
          margin: var(--a11y-collapse-margin);
          color: var(
            --a11y-collapse-heading-color,
            var(--a11y-collapse-_title)
          );
          background-color: var(--a11y-collapse-heading-background-color);
        }
        #text {
          flex-grow: 1;
          overflow: hidden;
        }
        /* the heading property renders as the block title */
        [part="heading"] {
          display: block;
          margin: 0;
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-xs);
          font-weight: inherit;
          line-height: var(--ddd-lh-120);
          overflow-wrap: anywhere;
        }
        /* page margins on a slotted heading (a p or h3) would double the
           row height; the row has its own padding */
        ::slotted([slot="heading"]) {
          margin-block: 0 !important;
        }
        /* the toggle: the 40px round DDD block action */
        #expand {
          flex: none;
          box-sizing: border-box;
          width: var(--a11y-collapse-toggle-size, var(--ddd-control-height-sm));
          height: var(
            --a11y-collapse-toggle-size,
            var(--ddd-control-height-sm)
          );
          border: var(--ddd-border-xs);
          border-color: var(--a11y-collapse-_line);
          border-radius: var(--ddd-radius-circle);
          background-color: transparent;
          color: var(--a11y-collapse-_action);
          --simple-icon-color: currentColor;
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
          --simple-icon-button-focus-opacity: 1;
          --simple-icon-button-disabled-opacity: 1;
          transform: rotate(var(--a11y-collapse-transform-deg, 0deg));
          transition: transform var(--ddd-duration-slow, 0.6s) ease-in-out;
        }
        simple-icon-lite#expand {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        simple-icon-button-lite#expand:hover,
        button:not([disabled]):hover #expand {
          border-color: var(--a11y-collapse-_action);
        }
        simple-icon-button-lite#expand:focus-within {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        :host([expanded]) #expand {
          border-color: var(--a11y-collapse-_action);
          background-color: var(--a11y-collapse-_action);
          color: var(--a11y-collapse-_action-ink);
        }
        /* DDD bg treatment (data-design-treatment="bg" + data-primary, as a
           site style guide may add on insert): the host is filled with the
           primary colour and DDD sets a contrasting text colour, so the
           title, lines, tint and toggle follow that colour instead of the
           page light / dark pair, which would put white on a light fill */
        :host([data-design-treatment="bg"]) {
          --a11y-collapse-_line: color-mix(
            in srgb,
            currentColor 35%,
            transparent
          );
          --a11y-collapse-_tint: color-mix(
            in srgb,
            currentColor 8%,
            transparent
          );
          --a11y-collapse-_title: currentColor;
          /* same contrast colour DDD gives the filled host */
          --a11y-collapse-_action: var(
            --ddd-theme-bgContrast,
            var(--lowContrast-override, black)
          );
          --a11y-collapse-_action-ink: var(
            --ddd-theme-primary,
            var(--ddd-primary-0)
          );
        }
        /* tooltip: a dark label (coaly, slate on dark pages so it stands
           off the page) placed above the toggle, whatever the page or the
           editor sets for simple-tooltip */
        simple-tooltip {
          --simple-tooltip-background: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-slateGray)
          );
          --simple-tooltip-text-color: var(--ddd-theme-default-white);
          --simple-tooltip-opacity: 1;
          --simple-tooltip-font-size: var(--ddd-font-size-5xs);
          --simple-tooltip-padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          --simple-tooltip-border-radius: var(--ddd-radius-xs);
          font-family: var(--ddd-font-navigation);
          font-weight: var(--ddd-font-weight-medium);
          white-space: nowrap;
        }
        :host([disabled]) #expand {
          border-style: dashed;
          opacity: 0.6;
        }
        :host([disabled]) simple-icon-button-lite#expand:hover {
          border-color: var(--a11y-collapse-_line);
        }
        #content {
          padding-block: var(
              --a11y-collapse-padding-top,
              var(--a11y-collapse-vertical-padding, var(--ddd-spacing-4))
            )
            var(
              --a11y-collapse-padding-bottom,
              var(--a11y-collapse-vertical-padding, var(--ddd-spacing-4))
            );
          padding-inline: var(
              --a11y-collapse-padding-left,
              var(--a11y-collapse-horizontal-padding, var(--ddd-spacing-4))
            )
            var(
              --a11y-collapse-padding-right,
              var(--a11y-collapse-horizontal-padding, var(--ddd-spacing-4))
            );
          border-top: var(--a11y-collapse-border, var(--ddd-border-xs));
          border-color: var(
            --a11y-collapse-border-color,
            var(--a11y-collapse-_line)
          );
        }
        @media screen {
          #expand.rotated {
            transform: rotate(
              var(--a11y-collapse-transform-rotated-deg, -90deg)
            );
            transition: transform var(--ddd-duration-slow, 0.6s) ease-in-out;
          }
          :host #content {
            padding-block: 0;
            padding-inline: var(
                --a11y-collapse-padding-left,
                var(--a11y-collapse-horizontal-padding, var(--ddd-spacing-4))
              )
              var(
                --a11y-collapse-padding-right,
                var(--a11y-collapse-horizontal-padding, var(--ddd-spacing-4))
              );
            border-top: none;
            border-color: var(
              --a11y-collapse-border-color,
              var(--a11y-collapse-_line)
            );
            max-height: 0;
            transition:
              visibility var(--a11y-collapse-transition-duration, 0.6s)
                ease-in-out,
              opacity var(--a11y-collapse-transition-duration, 0.6s) ease-in-out,
              max-height var(--a11y-collapse-transition-duration, 0.6s)
                ease-in-out;
            overflow-y: hidden;
            opacity: 1;
            visibility: visible;
          }
          :host #content-inner {
            max-height: 0;
            overflow-y: var(--a11y-collapse-overflow-y, hidden);
          }
          :host([expanded]) #content {
            padding-block: var(
                --a11y-collapse-padding-top,
                var(--a11y-collapse-vertical-padding, var(--ddd-spacing-4))
              )
              var(
                --a11y-collapse-padding-bottom,
                var(--a11y-collapse-vertical-padding, var(--ddd-spacing-4))
              );
            padding-inline: var(
                --a11y-collapse-padding-left,
                var(--a11y-collapse-horizontal-padding, var(--ddd-spacing-4))
              )
              var(
                --a11y-collapse-padding-right,
                var(--a11y-collapse-horizontal-padding, var(--ddd-spacing-4))
              );
            border-top: var(--a11y-collapse-border, var(--ddd-border-xs));
            border-color: var(
              --a11y-collapse-border-color,
              var(--a11y-collapse-_line)
            );
            max-height: 200000000000vh; /* why is this needed? */
          }
          :host([expanded]) #content-inner {
            max-height: var(--a11y-collapse-max-height, 200000000000vh);
            transition: max-height var(--ddd-duration-slow, 0.6s) ease-in-out;
          }
          :host(:not([expanded])) #content {
            visibility: hidden;
            opacity: 0;
            height: 0;
          }
        }
        /* reduced motion: open and close at once, the chevron just swaps */
        @media (prefers-reduced-motion: reduce) {
          :host,
          #expand,
          #expand.rotated,
          :host #content,
          :host #content-inner,
          :host([expanded]) #content-inner {
            transition: none;
          }
        }
      `,
    ];
  }
  render() {
    return html`
      ${
        this.headingButton || this.accordion
          ? this._makeHeadingButton()
          : this._makeIconButton()
      }
      <div id="content" aria-hidden="${this.expanded ? "false" : "true"}">
        <div id="content-inner">
          ${
            this.expanded ? html`<slot name="content"></slot><slot></slot>` : ``
          }
        </div>
      </div>
    `;
  }

  static get tag() {
    return "a11y-collapse";
  }
  /**
   * xAPI statements this element sends (see scripts/generate-xapi-vocabulary.mjs)
   */
  static get xapiVocabulary() {
    return {
      tag: "a11y-collapse",
      event: "user-engagement",
      verbs: ["experienced"],
      objectType: "http://adlnet.gov/expapi/activities/interaction",
      result: ["completion"],
      countsTowardCompletion: true,
      done: "opened by the learner (one already open when the page loads has nothing to open and does not count)",
    };
  }
  /**
   * Whether this section counts toward its page being done right now: it
   * does while there is something to open. One the author left expanded,
   * that the learner has not opened themselves, has nothing to open.
   * @returns {boolean}
   */
  xapiCountsTowardCompletion() {
    return !(this.expanded && !this._openSent);
  }
  /**
   * HAX: authors opening sections while editing are not learners
   */
  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
    };
  }
  haxactiveElementChanged(el, val) {
    if (val) {
      this._haxstate = val;
    }
  }
  haxeditModeChanged(val) {
    this._haxstate = val;
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * Heading is the expand button.
       */
      headingButton: {
        type: Boolean,
        reflect: true,
        attribute: "heading-button",
      },
      /**
       * disabled
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
    // remember the user-provided collapsed-state labels so they can be
    // restored after expanding. _fireToggleEvents mutates label/tooltip to
    // reflect the current state, which would otherwise clobber custom values.
    this.__collapsedLabel = "expand";
    this.__collapsedTooltip = "expand";
    this.__hasExpandedOnce = false;
    this._haxstate = false;
    this._openSent = false;
    // fallback words shown when the author left label / tooltip at their
    // defaults; the "expand" / "collapse" property values stay as they are
    // so saved markup does not change
    this.t = {
      ...this.t,
      expand: "expand",
      collapse: "collapse",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
  }
  /**
   * The default "expand" / "collapse" values read in the page language;
   * anything an author wrote is shown as written.
   * @param {string} value label or tooltip value
   * @returns {string}
   */
  _localizeLabel(value) {
    if (value === "expand") {
      return this.t.expand;
    }
    if (value === "collapse") {
      return this.t.collapse;
    }
    return value;
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
     * Fires when detached, so that parent radio group will no longer listen for it.
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
    if (super.updated) {
      super.updated(changedProperties);
    }
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
      // save the current collapsed-state labels before overwriting so they
      // can be restored when the element is collapsed again.
      this.__collapsedLabel = this.label;
      this.__collapsedTooltip = this.tooltip;
      this.__hasExpandedOnce = true;
      Promise.resolve().then(() => {
        // use custom expanded labels when provided, otherwise default.
        this.label = this.labelExpanded || "collapse";
        this.tooltip = this.tooltipExpanded || "collapse";
      });
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
      Promise.resolve().then(() => {
        // restore the user-provided collapsed labels once the element has
        // expanded at least once. before that, keep whatever the author set
        // so custom attributes are not clobbered on first render.
        if (this.__hasExpandedOnce) {
          this.label = this.__collapsedLabel || "expand";
          this.tooltip = this.__collapsedTooltip || "expand";
        }
      });
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
        @mouseenter="${this._showTooltip}"
        @mouseleave="${this._hideTooltip}"
        @focus="${this._showTooltip}"
        @blur="${this._hideTooltip}"
        aria-controls="content"
        aria-expanded="${this.expanded ? "true" : "false"}"
        ?disabled="${this.disabled}"
      >
        <span id="heading" part="heading-id">
          <span id="text">
            ${
              this.heading
                ? html`<span part="heading">${this.heading}</span>`
                : ``
            }<slot name="heading"></slot>
          </span>
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
        </span>
      </button>
      <simple-tooltip for="expand" position="top" offset="8" manual-mode
        >${this._localizeLabel(
          this._getExpanded(this.tooltip, this.tooltipExpanded, this.expanded),
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
          ${
            this.heading ? html`<p part="heading">${this.heading}</p>` : ``
          }<slot name="heading"></slot>
        </div>
        <simple-icon-button-lite
          id="expand"
          part="icon"
          class="${!this.expanded && !this.iconExpanded ? "rotated" : ""}"
          @click="${this._onClick}"
          ?disabled="${this.disabled}"
          .label="${this._localizeLabel(
            this._getExpanded(this.label, this.labelExpanded, this.expanded),
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
        <simple-tooltip for="expand" position="top" offset="8"
          >${this._localizeLabel(
            this._getExpanded(
              this.tooltip,
              this.tooltipExpanded,
              this.expanded,
            ),
          )}</simple-tooltip
        >
      </div>
    `;
  }

  /**
   * heading-button: the whole row is the control, so hovering or focusing
   * anywhere on it shows the tooltip, placed above the toggle
   */
  _showTooltip() {
    const tip = this.shadowRoot.querySelector("simple-tooltip");
    if (tip) {
      tip.show();
    }
  }
  _hideTooltip() {
    const tip = this.shadowRoot.querySelector("simple-tooltip");
    if (tip) {
      tip.hide();
    }
  }
  /**
   * Handle click
   */
  _onClick() {
    if (!this.disabled) {
      this.toggle();
      if (this.expanded) {
        this._announceOpen();
      }
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
   * Learner data: a learner opened this section's hidden content, which is
   * all there is to do with it (result.completion true: done). Once per
   * visit, only from a learner's click (not an author default of expanded),
   * never while HAX is editing, and only for content on the page itself:
   * a11y-collapse inside another element's shadow root (editor panels,
   * menus, admin screens) is interface, not learning material.
   */
  _announceOpen() {
    if (this._openSent || this._haxstate) {
      return;
    }
    const root = this.getRootNode ? this.getRootNode() : null;
    if (root !== globalThis.document) {
      return;
    }
    this._openSent = true;
    const slotted = this.querySelector('[slot="heading"]');
    const name =
      String(
        this.heading || (slotted ? slotted.textContent : "") || "",
      ).trim() || "Collapsed section";
    this.dispatchEvent(
      new CustomEvent("user-engagement", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          activityDisplay: "experienced",
          objectName: name.slice(0, 120),
          // opening it is all there is to do: the section is done
          resultCompletion: true,
          statement: buildStatement({
            verb: "experienced",
            result: { completion: true },
            object: {
              id: activityId(this, `a11y-collapse\u0001${name}`),
              name: name.slice(0, 120),
              type: XAPI_ACTIVITY_TYPES.interactionGeneric,
            },
            context: {
              extensions: { [XAPI_EXTENSIONS.element]: A11yCollapse.tag },
            },
          }),
        },
      }),
    );
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
globalThis.customElements.define(A11yCollapse.tag, A11yCollapse);
export { A11yCollapse };
