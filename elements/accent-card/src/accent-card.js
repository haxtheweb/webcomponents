import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/hax-body-behaviors/hax-body-behaviors.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
`accent-card`
A card with optional accent styling

@demo demo/index.html

@microcopy - the mental model for this element
 -

*/
let AccentCard = Polymer({
  _template: html`
    <style is="custom-style" include="simple-colors">
       :host {
        display: block;
        margin: var(--accent-card-margin, 20px) 0;
        --accent-card-color: var(--simple-colors-foreground3, #222);
        --accent-card-background-color: var(--simple-colors-background1, #fff);
        --accent-card-border-color: var(--simple-colors-accent-background5, #ddd);
        --accent-card-heading-color: var(--simple-colors-accent-foreground5, #000);
        --accent-card-footer-border-color: var(--simple-colors-background3, #ddd);
        --accent-card-box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        --accent-card-flat: none;
        @apply --accent-card;
      }
      :host([dark]) {
        --accent-card-color: var(--simple-colors-foreground1, #fff);
        --accent-card-border-color: var(--simple-colors-accent-foreground5, #fff);
        --accent-card-footer-border-color: var(--simple-colors-background5, #666);
      }
      :host([accent-background]) {
        --accent-card-background-color: var(--simple-colors-accent-background1, #fff);
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
      :host section[aria-role][disabled]{
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
      :host .image {
        background-size: cover; 
        background-position-x: var(--accent-card-image-x, center); 
        background-position-y: var(--accent-card-image-y, center);
      }
      :host(:not([horizontal])) .image {
        height: var(--accent-card-image-height, 100px);
        @apply --accent-card-vertical-image;
      }
      :host([horizontal]) .image {
        width: var(--accent-card-image-width, 100px);;
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
        padding: var(--accent-card-margin, 20px);
        @apply --accent-card-content;
      }
      :host .content:not(:last-child) {
        border-bottom: 1px solid var(--accent-card-footer-border-color);
      }
    </style>
    <section id="card" aria-role\$="[[button]]" disabled\$="[[disabled]]" tabindex\$="[[__tabindex]]">
      <div class="image" style\$="[[__backgroundStyle]]"></div>
      <div class="body">
        <template is="dom-if" if="[[__hasHeading]]" restamp="">
          <h1 class="heading">[[heading]]</h1>
        </template>
        <div class="subheading"><slot name="subheading"></slot></div>
        <div class="content"><slot name="content"></slot></div>
        <slot name="footer"></slot>
      </div>
    </section>
    <iron-a11y-keys id="a11y" target\$="[[__target]]" keys="enter space" on-keys-pressed="_handleTap"></iron-a11y-keys>
`,

  is: "accent-card",
  behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],
  listeners: { tap: "_handleTap" },

  properties: {
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
     * Optional: the heading for the card
     */
    heading: {
      type: String,
      value: null
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
  },

  /**
   * Attached to the DOM, now fire.
   */
  attached: function() {
    this.__target = this.$.card;
    // Establish hax property binding
    let props = {
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
          author: "LRNWebComponents"
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
    this.setHaxProperties(props);
  },

  /**
   * Set key target to card
   */
  ready: function() {
    this.__target = this.$.card;
  },

  /**
   * Determine if the component has a property.
   */
  _handleTap: function(e) {
    let root = this;
    if (root.button !== false && !root.disabled) {
      root.fire("accent-card-tap", root);
    }
  },

  /**
   * Determine if the component has a property.
   */
  _hasProp: function(prop) {
    return prop !== undefined && prop !== null;
  },

  /**
   * Get tabindex if card is a button.
   */
  _getTabindex: function(button) {
    if (button !== false) {
      return 0;
    } else {
      return null;
    }
  },

  /**
   * Determine if there is an image and style accordingly.
   */
  _getBackgroundStyle: function(imageSrc) {
    if (this._hasProp(imageSrc)) {
      return "background-image: url(" + imageSrc + ");";
    } else {
      return "display: none;";
    }
  }
});
export { AccentCard };
