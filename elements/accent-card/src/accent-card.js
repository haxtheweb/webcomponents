/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";

/**
 * `accent-card`
 * a card with optional accent stylings.
 * 
### Styling

`<accent-card>` provides the following custom properties and mixins
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--accent-card-image-width` | Width of image when card is horizontal. | 30%
`--accent-card-image-height` | Height of image when card is vertical. | 10%
`--accent-card-padding` | Sets padding inside the accent card. | 20px
`--accent-card-footer-border-color` | Card footer's border color.* | `--simple-colors-default-theme-grey-3`
`--accent-card-box-shadow` | Card footer's box-shadow. | 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2)
`--accent-card-color`	| Card's text color.* | `--simple-colors-default-theme-grey-9`
`--accent-card-background-color` | Card's background color.* | varies based on attributes
`--accent-card-border-color` | Card's border color.* | varies based on attributes
`--accent-card-heading-color` | Card's heading color.* | varies based on attributes
* Overrides colors set by accent-color and dark attributes.
 *
 * @extends SimpleColors
 * @customElement
 * @demo ./demo/index.html demo
 * @demo ./demo/colors.html colors
 * @demo ./demo/orientation.html card orientation
 * @demo ./demo/borders.html borders and shadow
 * @demo ./demo/images.html image aligmnent
 * @demo ./demo/variables.html css variables
 */
class AccentCard extends SimpleColors {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "accent-card";
  }
  // render function
  static get styles() {
    return [
      super.styles,
      css`
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
        }
        :host([image-align="left"]) .image {
          background-position-x: left;
        }
        :host([image-align="center"]) .image {
          background-position-x: center;
        }
        :host([image-align="right"]) .image {
          background-position-x: right;
        }
        :host([image-valign="top"]) .image {
          background-position-y: top;
        }
        :host([image-valign="center"]) .image {
          background-position-y: center;
        }
        :host([image-valign="bottom"]) .image {
          background-position-y: bottom;
        }
        :host(:not([horizontal])) .image {
          height: 0;
          padding-top: var(--accent-card-image-height);
        }
        :host .body {
          flex-grow: 1;
          overflow: visible;
        }
        :host #heading {
          padding-top: var(--accent-card-padding, 20px);
          padding-left: var(--accent-card-padding, 20px);
          padding-right: var(--accent-card-padding, 20px);
          padding-bottom: 0;
          margin: 0;
        }
        :host([accent-heading][accent-color]) #heading {
          color: var(--accent-card-heading-color);
        }
        :host #subheading {
          font-size: 90%;
          font-style: italic;
          padding-left: var(--accent-card-padding, 20px);
          padding-right: var(--accent-card-padding, 20px);
        }
        :host #content {
          font-size: 100%;
          padding: var(--accent-card-padding, 20px);
        }
        :host #content:not(:last-child) {
          border-bottom: 1px solid var(--accent-card-footer-border-color);
        }
        :host #footer {
          padding-left: var(--accent-card-padding, 20px);
          padding-right: var(--accent-card-padding, 20px);
        }
      `
    ];
  }
  render() {
    return html`
      <section id="card">
        <div class="image-outer" ?hidden="${!this.imageSrc}">
          <div
            class="image"
            .style="${this.imageSrc
              ? `background-image: url(${this.imageSrc});`
              : `display: none;`}"
          ></div>
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
      canPosition: false,
      canEditSource: false,
      gizmo: {
        title: "Accent Card",
        description: "A card with optional accent styling.",
        icon: "chrome-reader-mode",
        color: "light-blue",
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
            property: "accentColor",
            title: "Accent Color",
            description: "An optional accent color.",
            inputMethod: "colorpicker",
            icon: "editor:format-color-fill"
          },
          {
            property: "dark",
            title: "Dark Theme",
            description: "Enable Dark Theme",
            inputMethod: "boolean",
            icon: "icons:invert-colors"
          },
          {
            property: "horizontal",
            title: "Horizontal",
            description: "Horizontal orientation?",
            inputMethod: "boolean"
          }
        ],
        configure: [
          {
            slot: "heading",
            title: "Heading",
            description: "A heading for the card.",
            inputMethod: "textfield"
          },
          {
            slot: "subheading",
            title: "Subheading",
            description: "An optional subheading for the card.",
            inputMethod: "textfield"
          },
          {
            slot: "content",
            title: "Content",
            description: "Content for the card.",
            inputMethod: "textfield"
          },
          {
            slot: "footer",
            title: "Footer",
            description: "An optional footer for the card.",
            inputMethod: "textfield"
          },
          {
            property: "imageSrc",
            title: "Image",
            description: "Optional image",
            inputMethod: "haxupload",
            icon: "editor:insert-photo"
          },
          {
            property: "imageAlign",
            title: "imageAlign",
            description: "Image Horizontal Alignment",
            inputMethod: "select",
            options: {
              left: "left",
              center: "center",
              right: "right"
            }
          },
          {
            property: "imageValign",
            title: "imageValign",
            description: "Image Vertical Alignment",
            inputMethod: "select",
            options: {
              top: "top",
              center: "center",
              bottom: "bottom"
            }
          },
          {
            property: "accentColor",
            title: "Accent Color",
            description: "An optional accent color.",
            inputMethod: "colorpicker",
            icon: "editor:format-color-fill"
          },
          {
            property: "dark",
            title: "Dark Theme",
            description: "Enable Dark Theme",
            inputMethod: "boolean",
            icon: "icons:invert-colors"
          },
          {
            property: "horizontal",
            title: "Horizontal",
            description: "Horizontal orientation?",
            inputMethod: "boolean"
          },
          {
            property: "accentHeading",
            title: "Heading Accent",
            description: "Apply the accent color to the heading?",
            inputMethod: "boolean"
          },
          {
            property: "accentBackground",
            title: "Background Accent",
            description: "Apply the accent color to the card background?",
            inputMethod: "boolean"
          },
          {
            property: "noBorder",
            title: "No Border Accent",
            description: "Remove the border accent?",
            inputMethod: "boolean"
          },
          {
            property: "flat",
            title: "Flat",
            description: "Remove the box shadow?",
            inputMethod: "boolean"
          }
        ],
        advanced: []
      },
      saveOptions: {
        unsetAttributes: ["colors"]
      }
    };
  }
  constructor() {
    super();
    this.accentBackground = false;
    this.accentHeading = false;
    this.flat = false;
    this.horizontal = false;
    this.imageAlign = null;
    this.imageSrc = null;
    this.imageValign = null;
    this.noBorder = false;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      /**
       * Apply accent color to card background
       */
      accentBackground: {
        type: Boolean,
        attribute: "accent-background",
        reflect: true
      },

      /**
       * Apply accent color to heading
       */
      accentHeading: {
        type: Boolean,
        attribute: "accent-heading",
        reflect: true
      },

      /**
       * Display the card as flat (no box shadow);
       */
      flat: {
        type: Boolean,
        reflect: true
      },

      /**
       * Display the card as a horizontal layout? Default is vertical.
       */
      horizontal: {
        type: Boolean,
        reflect: true
      },

      /**
       * "Optional": The horizontal alignment of the image, so that:
       * - "left" will align the left edge of the image.
       * - "right" will align the right edge of the image.
       * - "center" will align the center of the image
       * - A null will allow temporary support to the deprecated CSS variables
       */
      imageAlign: {
        type: String,
        attribute: "image-align",
        reflect: true
      },

      /**
       * "Optional": The source for an image on the card
       */
      imageSrc: {
        type: String,
        attribute: "image-src"
      },

      /**
       * "Optional": The vertical alignment of the image, so that:
       * - "top" will align the top of edge of the image.
       * - "bottom" will align the bottom edge of the image.
       * - "center" will align the middle of the image.
       * - A null will allow temporary support to the deprecated CSS variables
       */
      imageValign: {
        type: String,
        attribute: "image-valign",
        reflect: true
      },

      /**
       * Removes the think accent border
       */
      noBorder: {
        type: Boolean,
        attribute: "no-border",
        reflect: true
      }
    };
  }
}
window.customElements.define(AccentCard.tag, AccentCard);
export { AccentCard };
