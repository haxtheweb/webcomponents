/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";

export { AccentCard };
/**
 * `accent-card`
 * `A card with optional accent stylings.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @extends A11yMediaPlayerProperties
 * @customElement
 * @polymer
 * @demo demo/index.html demo
 * @demo demo/layout.html layout
 * @demo demo/colors.html colors
 * @demo demo/buttons.html as buttons
 * @demo demo/css.html css variables
 */
class AccentCard extends SimpleColors {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "accent-card";
  }

  //get player-specifc properties
  static get behaviors() {
    return [SimpleColors];
  }
  // render function
  static get template() {
    return html`
      <style is="custom-style" include="simple-colors">
        :host {
          display: block;
          margin: var(--accent-card-margin, 20px) 0;
          --accent-card-color: var(--simple-colors-default-theme-grey-9, #222);
          --accent-card-background-color: var(
            --simple-colors-default-theme-grey-1,
            #fff
          );
          --accent-card-border-color: var(
            --simple-colors-default-theme-accent-6,
            #ddd
          );
          --accent-card-heading-color: var(
            --simple-colors-default-theme-accent-7,
            #000
          );
          --accent-card-footer-border-color: var(
            --simple-colors-default-theme-grey-3,
            #ddd
          );
          --accent-card-box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
          --accent-card-flat: none;
          @apply --accent-card;
        }
        :host([dark]) {
          --accent-card-color: var(--simple-colors-default-theme-grey-12, #fff);
          --accent-card-border-color: var(
            --simple-colors-default-theme-accent-7,
            #fff
          );
          --accent-card-footer-border-color: var(
            --simple-colors-default-theme-grey-6,
            #666
          );
        }
        :host([accent-background]) {
          --accent-card-background-color: var(
            --simple-colors-default-theme-accent-1,
            #fff
          );
          --accent-card-footer-border-color: var(--accent-card-border-color);
        }
        :host section {
          border-radius: 2px;
          box-sizing: border-box;
          box-shadow: var(--accent-card-box-shadow);
          display: block;
          color: var(--accent-card-color);
          background-color: var(--accent-card-background-color);
          @apply --accent-card-inner;
        }
        :host([horizontal]) section {
          display: flex;
          justify-content: space-between;
          align-items: stretch;
        }
        :host section[aria-role][disabled] {
          opacity: 0.7;
        }
        :host section[aria-role]:not([disabled]):focus,
        :host section[aria-role]:not([disabled]):hover {
          cursor: pointer;
          border-radius: 0px;
          outline: 1px solid var(--accent-card-border-color);
          @apply --accent-card-focus-heading;
        }
        :host section[aria-role]:not([disabled]):focus,
        :host section[aria-role]:not([disabled]):hover,
        :host([flat]) section {
          box-shadow: var(--accent-card-flat);
        }
        :host([flat]:not([accent-background])) section {
          border: 1px solid var(--accent-card-footer-border-color);
        }
        :host(:not([horizontal]):not([no-border])) section {
          border-top: 4px solid var(--accent-card-border-color);
        }
        :host([horizontal]:not([no-border])) section {
          border-left: 4px solid var(--accent-card-border-color);
        }
        :host .body {
          flex-grow: 1;
          @apply --accent-card-body;
        }
        :host .image-outer {
          width: auto;
          padding-left: var(--accent-card-image-width, 100px);
          padding-top: var(--accent-card-image-height, 100px);
          box-sizing: border-box;
          position: relative;
        }
        :host .image {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background-size: cover;
          background-position-x: var(--accent-card-image-x, center);
          background-position-y: var(--accent-card-image-y, center);
        }
        :host(:not([horizontal])) .image {
          @apply --accent-card-vertical-image;
        }
        :host([horizontal]) .image {
          @apply --accent-card-horizontal-image;
        }
        :host .heading {
          padding-top: var(--accent-card-margin, 20px);
          padding-left: var(--accent-card-margin, 20px);
          padding-right: var(--accent-card-margin, 20px);
          padding-bottom: 0;
          margin: 0;
          @apply --accent-card-heading;
        }
        :host section[aria-role]:not([disabled]):focus .heading,
        :host section[aria-role]:not([disabled]):hover .heading {
          @apply --accent-card-focus-heading;
        }
        :host([accent-heading][accent-color]) .heading {
          color: var(--accent-card-heading-color);
        }
        :host .subheading {
          font-size: 90%;
          font-style: italic;
          padding-left: var(--accent-card-margin, 20px);
          padding-right: var(--accent-card-margin, 20px);
          @apply --accent-card-subheading;
        }
        :host .content {
          font-size: 100%;
          padding: var(--accent-card-margin, 20px);
          @apply --accent-card-content;
        }
        :host .content:not(:last-child) {
          border-bottom: 1px solid var(--accent-card-footer-border-color);
        }
      </style>
      <section
        id="card"
        aria-role$="[[button]]"
        disabled$="[[disabled]]"
        tabindex$="[[__tabindex]]"
        on-click="_buttonTap"
      >
        <div class="image-outer" hidden$="[[!_hasProp(imageSrc)]]">
          <div class="image" style$="[[__backgroundStyle]]"></div>
        </div>
        <div class="body">
          <h1 class="heading"><slot name="heading"></slot></h1>
          <div class="subheading"><slot name="subheading"></slot></div>
          <div class="content"><slot name="content"></slot></div>
          <slot name="footer"></slot>
        </div>
      </section>
      <iron-a11y-keys
        id="a11y"
        target$="[[__target]]"
        keys="enter space"
        on-keys-pressed="_buttonTap"
      ></iron-a11y-keys>
    `;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canEditSource: false,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Accent Card",
        description: "A card with optional accent styling.",
        icon: "image:crop-landscape",
        color: "grey",
        groups: ["Media", "Text"],
        handles: [
          {
            type: "media",
            url: "source"
          },
          {
            type: "text",
            url: "source"
          }
        ],
        meta: {
          author: "nikkimk",
          owner: "The Pennsylvania State University"
        }
      },
      settings: {
        quick: [
          {
            property: "imageSrc",
            title: "Image",
            description: "Optional image",
            inputMethod: "textfield",
            icon: "editor:insert-photo"
          },
          {
            property: "heading",
            title: "Heading",
            description: "Optional heading",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "content",
            title: "Content",
            description: "content",
            inputMethod: "textfield",
            icon: "editor:format-align-left"
          },
          {
            property: "accentColor",
            title: "Accent Color",
            description: "Accent Color",
            inputMethod: "colorpicker",
            icon: "editor:format-color-fill"
          },
          {
            property: "dark",
            title: "Dark Theme",
            description: "Use dark theme?",
            inputMethod: "toggle"
          }
        ],
        configure: [
          {
            property: "accentHeading",
            title: "Heading Accent",
            description: "Apply the accent color to the heading?",
            inputMethod: "toggle"
          },
          {
            property: "accentBackground",
            title: "Background Accent",
            description: "Apply the accent color to the card background?",
            inputMethod: "toggle"
          },
          {
            property: "accentBackground",
            title: "No Border Accent",
            description: "Remove the border accent?",
            inputMethod: "toggle"
          }
        ],
        advanced: []
      }
    };
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * Apply accent color to card background
       */

      accentBackground: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * Apply accent color to heading
       */
      accentHeading: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * Is the card a button? Default is false.
       */
      button: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * Is the card a disabled button? Default is false.
       */
      disabled: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * Display the card as flat (no box shadow);
       */
      flat: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * Display the card as a horizontal layout? Default is vertical.
       */
      horizontal: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * Optional: The source for an image on the card
       */
      imageSrc: {
        type: String,
        value: null
      },
      /**
       * Removes the think accent border
       */
      noBorder: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * The style for the image if there is an image
       */
      __backgroundStyle: {
        type: String,
        computed: "_getBackgroundStyle(imageSrc)"
      },
      /**
       * Includes a heading if there is one.
       */
      __hasHeading: {
        type: String,
        computed: "_hasProp(heading)"
      },
      /**
       * The style for the image if there is an image
       */
      __tabindex: {
        type: Number,
        computed: "_getTabindex(button)"
      }
    };
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.__target = this.$.card;
    // Establish hax property binding
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setHaxProperties(
      AccentCard.haxProperties,
      AccentCard.tag,
      this
    );
  }

  /**
   * sets target for a11y keys
   */
  ready() {
    super.ready();
    this.__target = this.$.card;
  }

  /**
   * lets player know this button was clicked
   */
  _buttonTap(e) {
    let root = this;
    if (root.button !== false && !root.disabled) {
      console.log(e, root.button, root.disabled);
      root.dispatchEvent(new CustomEvent("tap", { detail: root }));
    }
  }

  /**
   * Determine if the component has a property.
   */
  _hasProp(prop) {
    return prop !== undefined && prop !== null;
  }

  /**
   * Get tabindex if card is a button.
   */
  _getTabindex(button) {
    if (button !== false) {
      return 0;
    } else {
      return null;
    }
  }

  /**
   * Determine if there is an image and style accordingly.
   */
  _getBackgroundStyle(imageSrc) {
    if (this._hasProp(imageSrc)) {
      return "background-image: url(" + imageSrc + ");";
    } else {
      return "display: none;";
    }
  }
}
window.customElements.define(AccentCard.tag, AccentCard);
