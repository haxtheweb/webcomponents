/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { RelativeHeadingLite } from "./lib/relative-heading-lite.js";
import "@haxtheweb/anchor-behaviors/anchor-behaviors.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";

/**
 * `relative-heading`
 * `outputs the correct heading hierarchy based on parent heading`
 *
 * @demo demo/index.html
 * @demo demo/nolinks.html Disable Links
 * @demo demo/rightalign.html Right-Align Links
 * @element relative-heading
 */
class RelativeHeading extends RelativeHeadingLite {
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-wrap: var(--relative-heading-wrap, wrap);
          align-items: var(--relative-heading-align, center);
          justify-content: flex-start;
        }

        :host([hidden]) {
          display: none;
        }

        ::slotted(*) {
          flex: 0 0 auto;
        }

        :host([link-align-right]) {
          justify-content: space-between;
        }

        :host([link-align-right]) ::slotted(*) {
          flex: 1 1 auto;
        }

        :host > simple-icon-button-lite:not(:defined) {
          opacity: 0;
        }

        :host > simple-icon-button-lite {
          flex: 0 0 auto;
        }

        simple-icon-button-lite {
          color: var(--relative-heading-button-color, #666);
          background: var(--relative-heading-button-bg);
          border: var(--relative-heading-button-border);
          outline: var(--relative-heading-button-outline);
          margin: var(--relative-heading-button-margin, 0 0 0 8px);
          padding: var(--relative-heading-button-padding, 8px);
          opacity: var(--relative-heading-button-opacity, 0);
          transition: var(--relative-heading-button-transition, all 0.5s);
        }

        :host([link-align-right]) simple-icon-button-lite,
        :host(:not([link-align-right]):focus) simple-icon-button-lite,
        :host(:not([link-align-right]):focus-within) simple-icon-button-lite,
        :host(:not([link-align-right]):hover) simple-icon-button-lite {
          opacity: var(--relative-heading-button-active-opacity, 1);
        }

        simple-icon-button-lite:focus-within,
        simple-icon-button-lite:focus,
        simple-icon-button-lite:hover {
          color: var(--relative-heading-button-focus-color, #000);
          background: var(--relative-heading-button-focus-bg);
          border: var(--relative-heading-button-focus-border);
          outline: var(--relative-heading-button-focus-outline);
          opacity: var(--relative-heading-button-focus-opacity, 1);
        }
      `,
    ];
  }

  // render function
  render() {
    return html` ${this.template} ${this.button}`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,

      canEditSource: true,
      gizmo: {
        title: "Relative heading",
        description:
          "outputs the correct heading hierarchy based on parent's heading",
        icon: "icons:android",
        color: "green",
        tags: ["Writing", "heading", "header", "h1", "h2", "h3", "h4", "h5", "h6"],
        handles: [],
        meta: {
          author: "HAXTheWeb core team",
          owner: "The Pennsylvania State University",
        },
      },
      settings: {
        configure: [
          {
            property: "parent",
            description: "Parent Heading's Resource ID",
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "disableLink",
            description: "Disables link button feature.",
            inputMethod: "boolean",
            required: false,
          },
          {
            property: "linkAlignRight",
            description: "Aligns copy link button to far right of heading.",
            inputMethod: "boolean",
            required: false,
          },
        ],
        advanced: [
          {
            property: "defaultLevel",
            description: "Heading level if parent is not found.",
            inputMethod: "number",
            required: false,
          },
          {
            property: "copyMessage",
            description:
              "Overrides default text for copy link's toast message.",
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "linkLabel",
            description: "Overrides default label copy link button.",
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "linkIcon",
            description: "Overrides default icon copy link button.",
            inputMethod: "iconpicker",
            required: false,
          },
          {
            property: "closeLabel",
            description:
              "Overrides default label for copy link's toast's close button.",
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "closeIcon",
            description:
              "Overrides default icon for copy link's toast's close button.",
            inputMethod: "iconpicker",
            required: false,
          },
        ],
      },
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      /**
       * overrides state manager's default icon for copy link's toast's close button
       */
      closeIcon: {
        type: String,
      },
      /**
       * overrides state manager's default label for copy link's toast's close button
       */
      closeLabel: {
        type: String,
      },
      /**
       * overrides state manager's default message for copy link's toast
       */
      copyMessage: {
        type: String,
      },
      /**
       * The relative-heading resource's UUID.
       */
      disableLink: {
        type: Boolean,
        attribute: "disable-link",
      },
      /**
       * label for copy link's button
       */
      linkAlignRight: {
        type: Boolean,
        attribute: "link-align-right",
        reflect: true,
      },
      /**
       * icon for copy link's button
       */
      linkIcon: {
        type: String,
      },
      /**
       * label for copy link's button
       */
      linkLabel: {
        type: String,
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "relative-heading";
  }

  /**
   * Makes sure there is a utility ready and listening for elements.
   */
  constructor() {
    super();
    this.linkAlignRight = false;
    this.disableLink = false;
    this.linkIcon = "link";
    this.linkLabel = "Get link";
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.disableLink) this.manager.useCopyLink();
  }

  /**
   * gets whether heading is currently anchored
   * @readonly
   * @returns {boolean}
   */
  get anchored() {
    return globalThis.AnchorBehaviors && globalThis.AnchorBehaviors.getTarget
      ? globalThis.AnchorBehaviors.getTarget(this)
      : false;
  }

  get button() {
    return this.disableLink
      ? html``
      : html`
          <simple-icon-button-lite
            controls="relative-heading-toast"
            .aria-describedby="${this.id}"
            .icon="${this.linkIcon}"
            .title="${this.linkLabel}"
            label="${this.linkLabel}"
            ?hidden="${this.disableLink}"
            ?disabled="${this.disableLink}"
            @click="${this._handleCopyClick}"
          >
          </simple-icon-button-lite>
        `;
  }
  _handleCopyClick() {
    if (!this.disableLink && this.manager && this.manager.copyLink)
      this.manager.copyLink(this);
  }
}
globalThis.customElements.define(RelativeHeading.tag, RelativeHeading);
export { RelativeHeading };
