/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { IntersectionObserverMixin } from "@haxtheweb/intersection-element/lib/IntersectionObserverMixin.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { DDDAccentStyles } from "@haxtheweb/d-d-d/lib/DDDAccent.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
/**
 * `accent-card`
 * @element accent-card
 * a card with optional accent stylings.
 * 
 *
 * @extends SimpleColors

 * @demo demo/index.html demo
 * @demo ./demo/colors.html colors
 * @demo ./demo/orientation.html card orientation
 * @demo ./demo/borders.html borders and shadow
 * @demo ./demo/images.html image aligmnent
 * @demo ./demo/variables.html css variables
 */
class AccentCard extends I18NMixin(IntersectionObserverMixin(DDD)) {
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
      super.styles,
      DDDAccentStyles,
      css`
        :host {
          display: block;
          margin: 0 0 var(--ddd-spacing-4);
          /* surface, text and link follow the page colour scheme */
          --accent-card-surface: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          --accent-card-text: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --accent-card-heading: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
          --accent-card-muted: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
          --accent-card-line: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          --accent-card-link: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-linkLight)
          );
          --accent-card-rule: var(
            --accent-card-border-color,
            var(--ddd-accent-color, var(--ddd-theme-default-beaverBlue))
          );
          color: var(--accent-card-color, var(--accent-card-text));
          background-color: var(
            --accent-card-background-color,
            var(--accent-card-surface)
          );
          border-radius: var(--ddd-radius-sm);
          box-shadow: var(--ddd-boxShadow-sm);
          --base-width: 480px;
          width: var(
            --accent-card-width,
            var(--base-width)
          ); /* default width - used css variable for container query */
          max-width: 100%;
          container-type: inline-size; /* set up container query */
          --imgHW: 100%;
        }
        :host([horizontal]) {
          --base-width: 100%;
        }
        /* dark forces the dark surface whatever the page scheme is */
        :host([dark]) {
          color-scheme: dark;
        }
        /* accent background: the soft DDD tint of the accent colour */
        :host([accent-background]) {
          background-color: var(
            --accent-card-background-color,
            var(
              --ddd-accent-color-tint,
              light-dark(
                var(--ddd-theme-default-skyMaxLight),
                var(--ddd-theme-default-nittanyNavy)
              )
            )
          );
        }

        .card {
          width: 100%;
          box-sizing: border-box;
          border: var(--ddd-border-xs);
          border-color: var(--accent-card-line);
          border-radius: var(--ddd-radius-sm);
          overflow: hidden;
          position: relative;
        }
        :host(:not([horizontal]):not([no-border])) .card {
          border-top: var(--ddd-border-md);
          border-top-width: 4px;
          border-top-color: var(--accent-card-rule);
        }
        :host([horizontal]:not([no-border])) .card {
          border-inline-start: var(--ddd-border-md);
          border-inline-start-width: 4px;
          border-inline-start-color: var(--accent-card-rule);
        }

        .body {
          display: flex;
          flex: 1 1 auto;
          flex-direction: column;
        }

        :host([horizontal]) .card {
          display: flex;
          justify-content: space-between;
          align-items: stretch;
        }
        @container (max-width: 499px) {
          :host([horizontal]) .card {
            /* Ensure the card layout follows the vertical design */
            display: block;
          }
          :host([horizontal]) .card div.image-outer {
            width: 100%;
          }
        }

        :host([flat]) {
          box-shadow: none;
        }
        :host([flat]:not([accent-background])) .card {
          border-color: var(
            --accent-card-footer-border-color,
            var(--accent-card-line)
          );
        }
        .image-outer {
          display: flex;
          box-sizing: border-box;
          position: relative;
          overflow: visible;
        }
        :host([horizontal]) .image-outer {
          width: var(--accent-card-image-width, 35%);
          flex: 0 0 auto;
        }
        :host([horizontal][image-width="wide"]) .image-outer {
          width: var(--accent-card-image-width, 50%);
        }
        :host([horizontal][image-width="narrow"]) .image-outer {
          width: var(--accent-card-image-width, 20%);
        }
        :host([image-width="narrow"]:not([horizontal])) {
          --base-width: 320px;
        }
        :host([image-width="wide"]:not([horizontal])) {
          --base-width: 640px;
        }

        :host(:not([horizontal])) .image-outer {
          height: auto;
          width: 100%;
          min-height: var(--accent-card-image-min-height, 100px);
        }
        .image {
          object-fit: scale-down;
          height: var(--imageHW, 100%);
          width: var(--imageHW, 100%);
        }
        :host(:not([image-src])) .image-outer,
        :host(:not([image-src])) .image {
          display: none;
          height: 0;
        }
        :host([horizontal][image-width="wide"]) .image {
          object-fit: contain;
        }
        :host([image-align]) .image,
        :host([image-valign]) .image,
        :host([horizontal][image-width="wide"][image-valign]) .image,
        :host([horizontal][image-width="wide"][image-align]) .image {
          object-fit: cover;
        }
        :host([image-align]) .image-outer,
        :host([image-valign]) .image-outer {
          height: var(--image-height, 300px);
        }
        :host([image-align="left"]) .image {
          object-position: left;
        }
        :host([image-align="right"]) .image {
          object-position: right;
        }
        :host([image-valign="top"]) .image {
          object-position: top;
        }
        :host([image-valign="bottom"]) .image {
          object-position: bottom;
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
            var(--ddd-theme-default-white)
          );
        }
        .body {
          flex-grow: 1;
          overflow: visible;
          padding: 0 var(--ddd-spacing-5);
        }
        #heading {
          flex: 0 0 auto;
          display: flex;
          justify-content: space-between;
          margin: 0;
          overflow: hidden;
        }
        #heading ::slotted(*) {
          color: var(--accent-card-color, var(--accent-card-heading));
        }
        :host([accent-heading][accent-color]) #heading ::slotted(*) {
          /* accent hue mixed toward the text colour so light accents
             (yellow, lime) still read on the surface */
          color: var(
            --accent-card-color,
            color-mix(
              in srgb,
              var(--ddd-accent-color, var(--ddd-theme-default-beaverBlue)) 65%,
              var(--accent-card-heading)
            )
          );
        }
        #subheading {
          flex: 0 0 auto;
          font-style: italic;
          color: var(--accent-card-color, var(--accent-card-muted));
        }
        #content {
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
          justify-content: flex-end;
          padding-bottom: var(--bottom-padding, 0);
          align-content: end;
        }
        .footer a {
          margin-left: var(--ddd-spacing-2);
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          color: var(--accent-card-link);
          font-weight: var(--ddd-font-weight-bold);
          border-radius: var(--ddd-radius-xs);
        }
        .footer a:focus-visible {
          outline: var(--ddd-border-sm);
          outline-color: var(--accent-card-link);
          outline-offset: var(--ddd-spacing-1);
        }
        .footer ::slotted(*) {
          display: inline-flex;
        }
        .footer a ::slotted(*) {
          color: inherit;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
          border: 0;
        }

        :host([ready]) [data-layout-slotname] {
          transition: var(
            --hax-layout-container-transition,
            var(--ddd-duration-slow, 0.6s) width ease-in-out,
            var(--ddd-duration-slow, 0.6s) padding ease-in-out,
            var(--ddd-duration-slow, 0.6s) margin ease-in-out
          );
        }

        :host([link]) .footer,
        .footer:has(*:not(:empty)) {
          border-top: var(--ddd-border-xs);
          border-color: var(
            --accent-card-footer-border-color,
            var(--accent-card-line)
          );
          padding-top: var(--ddd-spacing-4);
          --bottom-padding: var(--ddd-spacing-4);
        }

        simple-icon-lite {
          flex: none;
          color: inherit;
        }

        a:hover {
          text-decoration: underline;
          opacity: var(--ddd-opacity-80, 0.8);
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
          ${this.imageSrc
            ? html`
                <img
                  src="${this.imageSrc}"
                  alt="${this.imageAlt || ""}"
                  class="image"
                  part="image"
                />
              `
            : ""}
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
          <div class="footer">
            ${this._opensNewTab()
              ? html`
                  <a
                    href="${this.link}"
                    target="_blank"
                    rel="nofollow noopener"
                    part="link"
                  >
                    <slot name="footer"></slot>
                    <simple-icon-lite
                      icon="${this.icon}"
                      aria-hidden="true"
                      style="${this.iconSize
                        ? `--simple-icon-height: var(--ddd-icon-${this.iconSize}); --simple-icon-width: var(--ddd-icon-${this.iconSize});`
                        : `--simple-icon-height: var(--ddd-icon-xxs); --simple-icon-width: var(--ddd-icon-xxs);`}"
                    ></simple-icon-lite>
                    <span class="sr-only new-tab">${this.t.opensInNewTab}</span>
                  </a>
                `
              : html`<slot name="footer"></slot>`}
          </div>
        </div>
      </div>
    `;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      type: "grid",
      canScale: true,

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
            slotWrapper: "h3",
            allowedSlotWrappers: ["h3", "h4", "h5", "h6"],
          },
          {
            slot: "subheading",
            title: "Subheading",
            description: "An optional subheading for card.",
            inputMethod: "textfield",
            slotWrapper: "p",
            allowedSlotWrappers: ["div", "p", "h4", "h5", "h6"],
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
            fileActions: true,
            noVoiceRecord: true,
            noScreenRecord: true,
            icon: "editor:insert-photo",
          },
          {
            property: "imageAlt",
            title: "Image Alt Text",
            description:
              "Alternative text describing the image for screen readers. Leave empty only if the image is purely decorative.",
            inputMethod: "textfield",
            icon: "editor:mode-edit",
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
          {
            property: "accentColor",
            title: "Accent Color",
            description: "An optional accent color.",
            inputMethod: "colorpicker",
            icon: "editor:format-color-fill",
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
            imageSrc: "https://placehold.co/500x300",
          },
          content:
            '<h3 slot="heading">Accent Card</h3><h4 slot="subheading">A card with optional accent stylings.</h4><div slot="content"><p>This card is highly customizable to contain any content you\'d like</p></div>',
        },
      ],
      saveOptions: {
        unsetAttributes: ["colors", "element-visible"],
      },
    };
  }
  /**
   * #3050: a file backing this image was modified in place (rotate / compress /
   * scale / transform). Refresh the live preview by cache-busting the shadow
   * <img> src directly so the persisted `imageSrc` property (and saved
   * content) stays clean.
   */
  haxHooks() {
    return {
      mediaSourceUpdated: "haxmediaSourceUpdated",
    };
  }
  haxmediaSourceUpdated(path, store) {
    if (!path || !store || typeof store._mediaSrcMatches !== "function") {
      return;
    }
    if (!store._mediaSrcMatches(this.imageSrc, path)) return;
    store._pokeMatchingImgs(this.shadowRoot, path);
  }
  constructor() {
    super();
    this.accentBackground = false;
    this.accentHeading = false;
    this.flat = false;
    this.horizontal = false;
    this.imageAlign = null;
    this.imageSrc = null;
    this.imageAlt = null;
    this.imageValign = null;
    this.noBorder = false;
    this.ready = false;
    this.link = null;
    this.icon = "icons:open-in-new";
    this.t = {
      opensInNewTab: "(opens in a new tab)",
    };
    this.registerLocalization({
      context: this,
      basePath: import.meta.url,
    });
  }
  /**
   * The footer link always opens in a new tab, so it is announced as such.
   * @returns {Boolean}
   */
  _opensNewTab() {
    return !!(this.link && this.link.trim());
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
       * "Optional": alt text for the image on card. Leave empty if the image
       * is purely decorative; otherwise describe the image for screen readers.
       */
      imageAlt: {
        type: String,
        attribute: "image-alt",
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
      iconSize: {
        type: String,
        reflect: true,
        attribute: "icon-size",
      },
      imageWidth: {
        type: String,
        reflect: true,
        attribute: "image-width",
      },
    };
  }
}
globalThis.customElements.define(AccentCard.tag, AccentCard);
export { AccentCard };
