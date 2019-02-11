/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";

/**
 * `accent-card`
 * `A card with optional accent stylings.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @extends SimpleColors
 * @customElement
 * @polymer
 * @demo demo/index.html demo
 * @demo demo/layout.html layout
 * @demo demo/colors.html colors
 * @demo demo/variables.html css variables
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
          border-radius: 2px;
          margin: 0 0 15px;
          box-shadow: var(
            --accent-card-box-shadow,
            0 2px 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12),
            0 3px 1px -2px rgba(0, 0, 0, 0.2)
          );
          color: var(
            --accent-card-color,
            var(--simple-colors-default-theme-grey-9, #222)
          );
          background-color: var(
            --accent-card-background-color,
            var(--simple-colors-default-theme-grey-1, #fff)
          );
          --accent-card-image-width: 30%;
          --accent-card-image-height: 10%;
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
          @apply --accent-card;
        }
        :host([dark]) {
          color: var(
            --accent-card-color,
            var(--simple-colors-default-theme-grey-12, #fff)
          );
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
          background-color: var(
            --accent-card-background-color,
            var(--simple-colors-default-theme-accent-1, #fff)
          );
          --accent-card-footer-border-color: var(--accent-card-border-color);
        }
        :host section {
          width: 100%;
          box-sizing: border-box;
        }
        :host([horizontal]) section {
          display: flex;
          justify-content: space-between;
          align-items: stretch;
        }
        :host([flat]) {
          box-shadow: none;
        }
        :host([flat]:not([accent-background])) {
          border: 1px solid var(--accent-card-footer-border-color);
        }
        :host(:not([horizontal]):not([no-border])) section {
          border-top: 4px solid var(--accent-card-border-color);
        }
        :host([horizontal]:not([no-border])) section {
          border-left: 4px solid var(--accent-card-border-color);
        }
        :host .image-outer {
          box-sizing: border-box;
          position: relative;
          overflow: visible;
        }
        :host([horizontal]) .image-outer {
          height: auto;
          width: var(--accent-card-image-width);
        }
        :host(:not([horizontal])) .image-outer {
          height: auto;
          width: 100%;
        }
        :host .image {
          height: 100%;
          width: 100%;
          background-size: cover;
          background-position-x: var(--accent-card-image-x, center);
          background-position-y: var(--accent-card-image-y, center);
          @apply --accent-card-image;
        }
        :host([horizontal]) .image {
          @apply --accent-card-image-horizontal;
        }
        :host(:not([horizontal])) .image {
          height: 0;
          padding-top: var(--accent-card-image-height);
          @apply --accent-card-image-vertical;
        }
        :host .body {
          flex-grow: 1;
          overflow: visible;
          @apply --accent-card-body;
        }
        :host #heading {
          padding-top: var(--accent-card-padding, 20px);
          padding-left: var(--accent-card-padding, 20px);
          padding-right: var(--accent-card-padding, 20px);
          padding-bottom: 0;
          margin: 0;
          @apply --accent-card-heading;
        }
        :host([accent-heading][accent-color]) #heading {
          color: var(--accent-card-heading-color);
        }
        :host #subheading {
          font-size: 90%;
          font-style: italic;
          padding-left: var(--accent-card-padding, 20px);
          padding-right: var(--accent-card-padding, 20px);
          @apply --accent-card-subheading;
        }
        :host #content {
          font-size: 100%;
          padding: var(--accent-card-padding, 20px);
          @apply --accent-card-content;
        }
        :host #content:not(:last-child) {
          border-bottom: 1px solid var(--accent-card-footer-border-color);
        }
        :host #footer {
          padding-left: var(--accent-card-padding, 20px);
          padding-right: var(--accent-card-padding, 20px);
          @apply --accent-card-footer;
        }
      </style>
      <section id="card">
        <div class="image-outer" hidden$="[[!_hasProp(imageSrc)]]">
          <div class="image" style$="[[__backgroundStyle]]"></div>
        </div>
        <div class="body">
          <h1 id="heading"><slot name="heading"></slot></h1>
          <div id="subheading"><slot name="subheading"></slot></div>
          <div id="content"><slot name="content"></slot></div>
          <div id="footer"><slot name="footer"></slot></div>
        </div>
      </section>
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
          },
          {
            property: "horizontal",
            title: "Horizontal",
            description: "Horizontal orientation?",
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
            property: "noBorder",
            title: "No Border Accent",
            description: "Remove the border accent?",
            inputMethod: "toggle"
          },
          {
            property: "flat",
            title: "Flat",
            description: "Remove the box shadow?",
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
      }
    };
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    // Establish hax property binding
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(AccentCard.haxProperties, AccentCard.tag, this);
  }

  /**
   * sets target for a11y keys
   */
  ready() {
    super.ready();
  }

  /**
   * Determine if the component has a property.
   *
   * @param {object} the property to test
   * @returns {boolean} `prop !== undefined && prop !== null`
   */
  _hasProp(prop) {
    return prop !== undefined && prop !== null;
  }

  /**
   * Determine if there is an image and style accordingly.
   *
   * @param {string} the source url of the image
   * @returns {string} the background style that adds the image to the card
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
export { AccentCard };
