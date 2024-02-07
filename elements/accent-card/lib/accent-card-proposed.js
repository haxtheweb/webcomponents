/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { IntersectionObserverMixin } from "@lrnwebcomponents/intersection-element/lib/IntersectionObserverMixin.js";
import { DDD } from "@lrnwebcomponents/d-d-d/d-d-d.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";
/**
 * `accent-card`
 * @element accent-card
 * a card with optional accent stylings.
 * 
 *
 * @extends SimpleColors

 * @demo ./demo/index.html demo
 * @demo ./demo/colors.html colors
 * @demo ./demo/orientation.html card orientation
 * @demo ./demo/borders.html borders and shadow
 * @demo ./demo/images.html image aligmnent
 * @demo ./demo/variables.html css variables
 */
class AccentCard extends IntersectionObserverMixin(DDD) {
  /**
   * Store tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "accent-card-proposed";
  }
  // render function
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          margin: 0 0 var(--ddd-spacing-4);
        }
        .card {
          width: 100%;
          box-sizing: border-box;
          border-radius: var(--ddd-radius-xs);
          border: var(--ddd-border-xs);
          box-shadow: var(--ddd-boxShadow-xs);
        }
        .card,
        .body {
          display: flex;
          flex: 1 1 auto;
          flex-direction: column;
        }
        
        :host([horizontal]) .card {
          display: flex;
          justify-content: space-between;
          align-items: stretch;
          flex-direction: row;
        }

        :host([flat]) {
          box-shadow: none;
        }
        :host([flat]:not([accent-background])) {
          border: var(--ddd-border-xs);
          border-color: var(--accent-card-footer-border-color);
        }
        :host([dark][flat]:not([accent-background])) {
          border-color: var(--accent-card-footer-border-color, var(--simple-colors-default-theme-grey-6, #666));
        }
        :host(:not([horizontal]):not([no-border])) article {
          border-top: var(--ddd-border-lg);
          border-top-color: var(--accent-card-border-color, var(--simple-colors-default-theme-accent-6, #ddd));
        }
        :host([horizontal]:not([no-border])) article {
          border-left: var(--ddd-border-lg);
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
          object-fit: contain;
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
        }
        #imagecorner {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
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
          padding: var(--ddd-spacing-5);
        }
        #heading {
          flex: 0 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: var(--accent-card-heading-align, unset);
          margin: 0;
          overflow: hidden;
        }
        ::slotted(*[slot="heading"]) {
          font-size: 26px;
          font-weight: bold;
        }
        #heading div {
          flex: 0 0 auto;
          width: 100%;
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
        }
        #content {
          font-size: 100%;
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
        .footer {
          display: flex;
          flex: 0 0 auto;
          margin: var(--ddd-spacing-2) 0 0;
          padding: var(--ddd-spacing-2) 0 0;
          border-top: var(--ddd-border-xs);
          border-color: var(
            --accent-card-footer-border-color,
            var(--simple-colors-default-theme-grey-3, #ddd)
          );
          justify-content: flex-end;
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

        simple-icon-button-lite {
          aspect-ratio: 1;
        }
      `,
    ];
  }
  render() {
    return html`
      <div class="card">
        <div
          class="image-outer"
          part="image-wrapper"
          ?hidden="${!this.elementVisible || !this.imageSrc}"
        >
          <div
            part="image"
            class="image"
            .style="${this.elementVisible && this.imageSrc
              ? `background-image: url("${this.imageSrc}");`
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
          ${this.link ? 
            html`
              <div class="footer">
                <a href="${this.link}" target="_blank" rel="nofollow noopener">
                  <simple-icon-button-lite icon="${this.icon}" 
                  style="${this.iconSize ? `--simple-icon-height: var(--ddd-icon-${this.iconSize}); --simple-icon-width: var(--ddd-icon-${this.iconSize});` : `--simple-icon-height: var(--ddd-icon-xs); --simple-icon-width: var(--ddd-icon-xs);`}"></simple-icon-button-lite>
                </a>
              </div>
              ` : ""}
          
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
    this.link = null;
    this.icon = "icons:add-circle-outline";
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
      link: {
        type: String,
        reflect: true,
      },
      icon: {
        type: String,
        reflect: true,
      },
      iconSize: {
        type: String,
        reflect: true,
        attribute: "icon-size",
      },
    };
  }
}
customElements.define(AccentCard.tag, AccentCard);
export { AccentCard };
