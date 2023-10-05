/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { IntersectionObserverMixin } from "@lrnwebcomponents/intersection-element/lib/IntersectionObserverMixin.js";

/**
 * `accent-card`
 * @element accent-card
 * a card with optional accent stylings.
 * 
### Styling

`<accent-card>` provides following custom properties and mixins
for styling:

#### Defaults
Custom property | Description | Default
----------------|-------------|----------
`--accent-card-image-width` | Width of image when card is horizontal. | 30%
`--accent-card-image-height` | Height of image when card is vertical. | 10%
`--accent-card-padding` | Sets padding inside accent card. | 20px
`--accent-card-footer-border-color` | Card footer's border color.* | `--simple-colors-default-theme-grey-3`
`--accent-card-box-shadow` | Card footer's box-shadow. | 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2)
`--accent-card-heading-align` | Corner and heading align-items | unset

#### Overriding Default Padding
Custom property | Description | Default
----------------|-------------|----------
`--accent-card-image-padding-top` | Overrides top padding of image. | 0
`--accent-card-image-padding-left` | Overrides left padding of image. | `--accent-card-padding`
`--accent-card-image-padding-right` | Overrides right padding of image. | `--accent-card-padding`
`--accent-card-image-padding-bottom` | Overrides bottom padding of image. | `--accent-card-padding`
`--accent-card-heading-padding-top` | Overrides top padding of heading. | `--accent-card-padding`
`--accent-card-heading-padding-left` | Overrides left padding of heading. | `--accent-card-padding`
`--accent-card-heading-padding-right` | Overrides right padding of heading. | `--accent-card-padding`
`--accent-card-heading-padding-bottom` | Overrides bottom padding of heading. | 0
`--accent-card-subheading-padding-top` | Overrides top padding of subheading. | unset
`--accent-card-subheading-padding-left` | Overrides left padding of subheading. | `--accent-card-padding`
`--accent-card-subheading-padding-right` | Overrides right padding of subheading. | `--accent-card-padding`
`--accent-card-subheading-padding-bottom` | Overrides bottom padding of subheading. | unset
`--accent-card-content-padding-top` | Overrides top padding of content. | `--accent-card-padding`
`--accent-card-content-padding-left` | Overrides left padding of content. | `--accent-card-padding`
`--accent-card-content-padding-right` | Overrides right padding of content. | `--accent-card-padding`
`--accent-card-content-padding-bottom` | Overrides bottom padding of content. | --accent-card-padding`
`--accent-card-footer-padding-top` | Overrides top padding of footer. | unset
`--accent-card-footer-padding-left` | Overrides left padding of footer. | `--accent-card-padding`
`--accent-card-footer-padding-right` | Overrides right padding of footer. | `--accent-card-padding`
`--accent-card-footer-padding-bottom` | Overrides bottom padding of footer. | unset

#### Overriding Default Colors
Custom property | Description | Default
----------------|-------------|----------
`--accent-card-color`	| Card's text color.* | `--simple-colors-default-theme-grey-9`
`--accent-card-background-color` | Card's background color.* | varies based on attributes
`--accent-card-border-color` | Card's border color.* | varies based on attributes
`--accent-card-heading-color` | Card's heading color.* | varies based on attributes
 *
 * @extends SimpleColors

 * @demo ./demo/index.html demo
 * @demo ./demo/colors.html colors
 * @demo ./demo/orientation.html card orientation
 * @demo ./demo/borders.html borders and shadow
 * @demo ./demo/images.html image aligmnent
 * @demo ./demo/variables.html css variables
 */
class AccentCard extends IntersectionObserverMixin(SimpleColors) {
  /**
   * Store tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "accent-card";
  }
  // render function
  static get styles() {
    return [
      ...super.styles,
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
        }
        :host([dark]),
        :host([dark]) .body ::slotted(*) {
          color: var(
            --accent-card-color,
            var(--simple-colors-default-theme-grey-12, #fff)
          );
        }
        :host([accent-background]) {
          background-color: var(
            --accent-card-background-color,
            var(--simple-colors-default-theme-accent-1, #fff)
          );
        }
        article {
          position: relative;
          width: 100%;
          box-sizing: border-box;
        }
        article,
        .body {
          display: flex;
          flex: 1 1 auto;
          flex-direction: column;
        }
        :host([horizontal]) article {
          display: flex;
          justify-content: space-between;
          align-items: stretch;
          flex-direction: row;
        }
        :host([flat]) {
          box-shadow: none;
        }
        :host([flat]:not([accent-background])) {
          border-width: 1px;
          border-style: solid;
          border-color: var(--accent-card-footer-border-color);
        }
        :host([dark][flat]:not([accent-background])) {
          border-color: var(
            --accent-card-footer-border-color,
            var(--simple-colors-default-theme-grey-6, #666)
          );
        }
        :host(:not([horizontal]):not([no-border])) article {
          border-top-width: 4px;
          border-top-style: solid;
          border-top-color: var(
            --accent-card-border-color,
            var(--simple-colors-default-theme-accent-6, #ddd)
          );
        }
        :host([horizontal]:not([no-border])) article {
          border-left-width: 4px;
          border-left-style: solid;
          border-left-color: var(
            --accent-card-border-color,
            var(--simple-colors-default-theme-accent-6, #ddd)
          );
        }
        :host([dark]:not([horizontal]):not([no-border])) article {
          border-top-color: var(
            --accent-card-border-color,
            var(--simple-colors-default-theme-accent-7, #fff)
          );
        }
        :host([dark][horizontal]:not([no-border])) article {
          border-left-color: var(
            --accent-card-border-color,
            var(--simple-colors-default-theme-accent-7, #fff)
          );
        }
        .image-outer {
          box-sizing: border-box;
          position: relative;
          overflow: visible;
        }
        :host([horizontal]) .image-outer {
          height: auto;
          width: var(--accent-card-image-width, 30%);
          flex: 0 0 auto;
        }
        :host(:not([horizontal])) .image-outer {
          height: auto;
          width: 100%;
          min-height: var(--accent-card-heading-min-height);
        }
        .image {
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
          padding-top: var(--accent-card-image-height, 10%);
        }
        #imagecorner {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding-top: var(--accent-card-image-padding-top, 0);
          padding-bottom: var(
            --accent-card-image-padding-bottom,
            var(--accent-card-padding, 20px)
          );
          padding-left: var(
            --accent-card-image-padding-left,
            var(--accent-card-padding, 20px)
          );
          padding-right: var(
            --accent-card-image-padding-right,
            var(--accent-card-padding, 20px)
          );
        }
        ::slotted([slot="image-corner"]) {
          text-align: right;
          color: var(
            --accent-card-background-color,
            var(--simple-colors-default-theme-grey-1, #fff)
          );
        }
        .body {
          flex-grow: 1;
          overflow: visible;
        }
        #heading {
          flex: 0 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: var(--accent-card-heading-align, unset);
          padding-left: var(
            --accent-card-heading-padding-left,
            var(--accent-card-padding, 20px)
          );
          padding-right: var(
            --accent-card-heading-padding-right,
            var(--accent-card-padding, 20px)
          );
          padding-bottom: var(--accent-card-heading-padding-bottom, 0px);
          margin: 0;
        }
        ::slotted(*[slot="heading"]) {
          font-size: 26px;
          font-weight: bold;
          padding-top: var(
            --accent-card-heading-padding-top,
            var(--accent-card-padding, 20px)
          );
        }
        #heading div {
          flex: 0 0 auto;
        }
        #heading [data-layout-slotname="heading"] {
          margin: 0;
          flex: 1 1 auto;
        }
        :host([accent-heading][accent-color]) #heading ::slotted(*) {
          color: var(
            --accent-card-heading-color,
            var(--simple-colors-default-theme-accent-7, #000) !important
          );
        }
        #subheading {
          flex: 0 0 auto;
          font-size: 90%;
          font-style: italic;
          padding-top: var(--accent-card-subheading-padding-top, unset);
          padding-left: var(
            --accent-card-subheading-padding-left,
            var(--accent-card-padding, 20px)
          );
          padding-right: var(
            --accent-card-subheading-padding-right,
            var(--accent-card-padding, 20px)
          );
          padding-bottom: var(--accent-card-subheading-padding-bottom, unset);
        }
        #content {
          font-size: 100%;
          padding-top: var(
            --accent-card-content-padding-top,
            var(--accent-card-padding, 20px)
          );
          padding-left: var(
            --accent-card-content-padding-left,
            var(--accent-card-padding, 20px)
          );
          padding-right: var(
            --accent-card-content-padding-right,
            var(--accent-card-padding, 20px)
          );
          padding-bottom: var(
            --accent-card-content-padding-bottom,
            var(--accent-card-padding, 20px)
          );
          flex: 1 1 auto;
        }
        ::slotted(*[slot]:first-of-type) {
          margin-top: 0;
          margin-block-start: 0;
        }
        ::slotted(*[slot]:last-of-type) {
          margin-bottom: 0;
          margin-block-end: 0;
        }
        #footer {
          flex: 0 0 auto;
          border-top-width: 1px;
          border-top-style: solid;
          border-top-color: var(
            --accent-card-footer-border-color,
            var(--simple-colors-default-theme-grey-3, #ddd)
          );
          padding-top: var(--accent-card-footer-padding-top, unset);
          padding-left: var(
            --accent-card-footer-padding-left,
            var(--accent-card-padding, 20px)
          );
          padding-right: var(
            --accent-card-footer-padding-right,
            var(--accent-card-padding, 20px)
          );
          padding-bottom: var(--accent-card-footer-padding-bottom, unset);
        }
        :host([dark]) #footer {
          border-top-color: var(
            --accent-card-footer-border-color,
            var(--simple-colors-default-theme-grey-6, #666)
          );
        }
        :host([ready]) [data-layout-slotname] {
          transition: var(
            --hax-layout-container-transition,
            0.5s width ease-in-out,
            0.5s padding ease-in-out,
            0.5s margin ease-in-out
          );
        }
      `,
    ];
  }
  render() {
    return html`
      <article id="card">
        <div
          class="image-outer"
          ?hidden="${!this.elementVisible || !this.imageSrc}"
        >
          <div
            class="image"
            .style="${this.elementVisible && this.imageSrc
              ? `background-image: url(${this.imageSrc});`
              : ``}"
          ></div>
          <div id="imagecorner"><slot name="image-corner"></slot></div>
        </div>
        <div class="body">
          <div id="heading">
            <div>
              <slot name="heading"></slot>
            </div>
            <div data-label="Corner">
              <slot name="corner"></slot>
            </div>
          </div>
          <div id="subheading">
            <slot name="subheading"></slot>
          </div>
          <div id="content">
            <slot name="content"></slot>
          </div>
          <div id="footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </article>
    `;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      type: "grid",
      canScale: true,
      canPosition: true,
      canEditSource: true,
      contentEditable: true,
      gizmo: {
        title: "Card",
        description: "A card with optional accent styling.",
        icon: "chrome-reader-mode",
        color: "light-blue",
        tags: ["Layout", "content", "card", "Image", "Presentation", "style"],
        handles: [
          {
            type: "media",
            url: "source",
          },
          {
            type: "image",
          },
          {
            type: "text",
            url: "source",
          },
        ],
        meta: {
          author: "HAXTheWeb core team",
          owner: "The Pennsylvania State University",
        },
      },
      settings: {
        configure: [
          {
            slot: "heading",
            title: "Heading",
            description: "A heading for card.",
            inputMethod: "textfield",
            slotWrapper: "h1",
            allowedSlotWrappers: [
              "span",
              "div",
              "p",
              "h1",
              "h2",
              "h3",
              "h4",
              "h5",
              "h6",
            ],
            excludedSlotWrappers: ["pre"],
          },
          {
            slot: "subheading",
            title: "Subheading",
            description: "An optional subheading for card.",
            inputMethod: "textfield",
            slotWrapper: "p",
            allowedSlotWrappers: ["div", "p"],
          },
          {
            slot: "content",
            title: "Content",
            description: "Content for card.",
            inputMethod: "textfield",
            slotWrapper: "p",
          },
          {
            slot: "footer",
            title: "Footer",
            description: "An optional footer for card.",
            inputMethod: "textfield",
            slotWrapper: "p",
            allowedSlotWrappers: ["div", "p"],
          },
          {
            property: "imageSrc",
            title: "Image",
            description: "Optional image",
            inputMethod: "haxupload",
            noVoiceRecord: true,
            icon: "editor:insert-photo",
          },
          {
            property: "imageAlign",
            title: "imageAlign",
            description: "Image Horizontal Alignment",
            inputMethod: "select",
            options: {
              left: "left",
              center: "center",
              right: "right",
            },
          },
          {
            property: "imageValign",
            title: "imageValign",
            description: "Image Vertical Alignment",
            inputMethod: "select",
            options: {
              top: "top",
              center: "center",
              bottom: "bottom",
            },
          },
          {
            property: "accentColor",
            title: "Accent Color",
            description: "An optional accent color.",
            inputMethod: "colorpicker",
            icon: "editor:format-color-fill",
          },
          {
            property: "dark",
            title: "Dark Theme",
            description: "Enable Dark Theme",
            inputMethod: "boolean",
            icon: "icons:invert-colors",
          },
          {
            property: "horizontal",
            title: "Horizontal",
            description: "Horizontal orientation?",
            inputMethod: "boolean",
          },
          {
            property: "accentHeading",
            title: "Heading Accent",
            description: "Apply accent color to heading?",
            inputMethod: "boolean",
          },
          {
            property: "accentBackground",
            title: "Background Accent",
            description: "Apply accent color to card background?",
            inputMethod: "boolean",
          },
          {
            property: "noBorder",
            title: "No Border Accent",
            description: "Remove border accent?",
            inputMethod: "boolean",
          },
          {
            property: "flat",
            title: "Flat",
            description: "Remove box shadow?",
            inputMethod: "boolean",
          },
        ],
        advanced: [
          {
            slot: "corner",
            title: "Corner",
            description: "Content for card corner.",
            inputMethod: "textfield",
            slotWrapper: "div",
            allowedSlotWrappers: ["div", "p"],
          },
        ],
      },
      demoSchema: [
        {
          tag: "accent-card",
          properties: {
            accentColor: "red",
            accentHeading: true,
            horizontal: true,
            imageSrc: "http://placekitten.com/200/600",
          },
          content:
            '<div slot="heading">Accent Card</div><div slot="subheading">A card with optional accent stylings.</div><div slot="content"><p>This card is highly customizable to contain any content you\'d like</p></div>',
        },
      ],
      saveOptions: {
        unsetAttributes: ["colors", "element-visible"],
      },
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
    this.ready = false;
  }
  /**
   * life cycle
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) super.firstUpdated(changedProperties);
    setTimeout(() => {
      this.ready = true;
    }, 100);
  }

  // properties available to custom element for data binding
  static get properties() {
    return {
      ...(super.properties || {}),

      /**
       * Apply accent color to card background
       */
      accentBackground: {
        type: Boolean,
        attribute: "accent-background",
        reflect: true,
      },

      /**
       * Apply accent color to heading
       */
      accentHeading: {
        type: Boolean,
        attribute: "accent-heading",
        reflect: true,
      },

      /**
       * Display card as flat (no box shadow);
       */
      flat: {
        type: Boolean,
        reflect: true,
      },

      /**
       * Display card as a horizontal layout? Default is vertical.
       */
      horizontal: {
        type: Boolean,
        reflect: true,
      },

      /**
       * "Optional": Horizontal alignment of image, so that:
       * - "left" will align left edge of image.
       * - "right" will align right edge of image.
       * - "center" will align center of image
       * - A null will allow temporary support to deprecated CSS variables
       */
      imageAlign: {
        type: String,
        attribute: "image-align",
        reflect: true,
      },

      /**
       * "Optional": source for an image on card
       */
      imageSrc: {
        type: String,
        attribute: "image-src",
      },

      /**
       * "Optional": vertical alignment of image, so that:
       * - "top" will align top of edge of image.
       * - "bottom" will align bottom edge of image.
       * - "center" will align middle of image.
       * - A null will allow temporary support to deprecated CSS variables
       */
      imageValign: {
        type: String,
        attribute: "image-valign",
        reflect: true,
      },

      /**
       * Removes think accent border
       */
      noBorder: {
        type: Boolean,
        attribute: "no-border",
        reflect: true,
      },
      ready: {
        type: Boolean,
        reflect: true,
      },
    };
  }
}
customElements.define(AccentCard.tag, AccentCard);
export { AccentCard };
