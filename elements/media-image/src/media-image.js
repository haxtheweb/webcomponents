/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import { SimpleModalHandler } from "@lrnwebcomponents/simple-modal/lib/simple-modal-handler.js";
import "@lrnwebcomponents/figure-label/figure-label.js";
/**
 * `media-image`
 * `A simple image presentaiton with minor documented options`
 * @demo demo/index.html
 * @element media-image
 */
class MediaImage extends SchemaBehaviors(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          width: auto;
          margin: auto;
          max-width: 600px;
          --box-background-color: #f7f6ef;
        }

        :host([card]) {
          box-shadow: 0 1px 5px rgba(0, 0, 0, 0.14);
          padding: 20px;
        }

        :host([box]) {
          background-color: var(--box-background-color);
          padding: 20px;
        }
        @media screen and (min-width: 650px) {
          :host([size="small"]) {
            max-width: 35%;
          }
        }

        @media screen and (min-width: 900px) {
          :host([size="small"]) {
            max-width: 25%;
          }
        }

        :host([offset="left"]) {
          float: left;
          margin: var(--media-image-offset-width, 1.5vw);
          margin-left: calc(-2 * var(--media-image-offset-width, 1.5vw));
          padding-left: calc(4 * var(--media-image-offset-width, 1.5vw));
          margin-top: 0;
          margin-bottom: calc(0.1 * var(--media-image-offset-width, 1.5vw));
        }

        :host([offset="right"]) {
          float: right;
          margin: var(--media-image-offset-width, 1.5vw);
          margin-right: calc(-2 * var(--media-image-offset-width, 1.5vw));
          padding-right: calc(4 * var(--media-image-offset-width, 1.5vw));
          margin-top: 0;
          margin-bottom: calc(0.1 * var(--media-image-offset-width, 1.5vw));
        }

        :host([offset="wide"]) {
          margin: 0 calc(-1 * var(--media-image-offset-wide-width, 3.5vw));
          max-width: 100vw;
        }

        :host([offset="narrow"]) {
          max-width: var(--media-image-offset-narrow-max-width, 500px);
          margin: auto;
        }

        media-image-caption {
          max-height: 100px;
          padding-bottom: 20px;
          border-bottom: dashed 2px lightgray;
          margin-bottom: 20px;
        }
        :host(:not([disable-zoom])) media-image-image:hover {
          cursor: pointer;
        }
      `,
    ];
  }
  constructor() {
    super();
    this.disableZoom = false;
    this.modalTitle = "";
    this.source = "";
    this.citation = "";
    this.caption = "";
    this.figureLabelTitle = "";
    this.figureLabelDescription = "";
    this.alt = "";
    this.size = "wide";
    this.round = false;
    this.card = false;
    this.box = false;
    this.offset = "none";
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "caption") {
        this._computeHasCaption(this[propName]);
      }
      if (["figureLabelTitle", "figureLabelDescription"].includes(propName)) {
        this.__figureLabel = this._hasFigureLabel(
          this.figureLabelTitle,
          this.figureLabelDescription
        );
      }
      if (["figureLabelTitle", "caption"].includes(propName)) {
        this.modalTitle = this.figureLabelTitle
          ? this.figureLabelTitle
          : this.caption;
        this.modalTitle += this.figureLabelDescription
          ? " - " + this.figureLabelDescription
          : "";
      }
    });
  }
  render() {
    return html`
      ${this.__figureLabel
        ? html`
            <figure-label
              title="${this.figureLabelTitle}"
              description="${this.figureLabelDescription}"
            ></figure-label>
          `
        : ``}
      <media-image-image
        ?round="${this.round}"
        resource="${this.schemaResourceID}-image"
        source="${this.source}"
        modal-title="${this.modalTitle}"
        alt="${this.alt}"
        .described-by="${this.describedBy}"
        tabindex="${!this.disableZoom ? "0" : "-1"}"
        @click="${this._handleClick}"
      ></media-image-image>
      <media-image-citation>
        <slot name="citation"> ${this.citation} </slot>
      </media-image-citation>
      ${this._hasCaption
        ? html`
            <media-image-caption>
              <slot name="caption"> ${this.caption} </slot>
            </media-image-caption>
          `
        : ``}
    `;
  }
  haxHooks() {
    return {
      editModeChanged: "haxEditModeChanged",
      activeElementChanged: "haxActiveElementChanged",
    };
  }
  _handleClick(event) {
    if (this._haxState || this.disableZoom) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
  }
  haxEditModeChanged(value) {
    this._haxState = value;
  }
  haxActiveElementChanged(element, value) {
    if (value) {
      this._haxState = value;
    }
  }
  static get tag() {
    return "media-image";
  }
  static get properties() {
    return {
      ...super.properties,
      __figureLabel: {
        type: Boolean,
      },
      modalTitle: {
        type: String,
      },
      // support disabing zoom, zoom by default
      disableZoom: {
        type: Boolean,
        attribute: "disable-zoom",
        reflect: true,
      },
      _hasCaption: {
        type: Boolean,
      },
      /**
       * Image source.
       */
      source: {
        type: String,
      },
      /**
       * Image citation.
       */
      citation: {
        type: String,
      },
      /**
       * image aria-described by
       */
      describedBy: {
        type: String,
        attribute: "described-by",
      },
      /**
       * Image caption.
       */
      caption: {
        type: String,
      },
      /**
       * Image alt.
       */
      alt: {
        type: String,
      },
      /**
       * The size of the image (small, wide).
       */
      size: {
        type: String,
        reflect: true,
      },
      /**
       * The shape of the image (round).
       */
      round: {
        type: Boolean,
      },
      /**
       * Applies card styling.
       */
      card: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Applies box styling.
       */
      box: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Applies left or right offset
       * - none
       * - left
       * - right
       * - wide
       * - narrow
       */
      offset: {
        type: String,
        reflect: true,
      },
      /**
       * Added a figure label title to the top of the media-image
       */
      figureLabelTitle: {
        type: String,
        attribute: "figure-label-title",
      },
      /**
       * Added a figure label description to the top of the media-image
       */
      figureLabelDescription: {
        type: String,
        attribute: "figure-label-description",
      },
    };
  }

  // Observe the name sub-property on the user object
  // if the either of the figure label values are present then display
  // the figure label
  _hasFigureLabel(title, description) {
    return (
      (title && title.length > 0) || (description && description.length > 0)
    );
  }
  _computeHasCaption() {
    this._hasCaption =
      this.caption.length > 0 ||
      this.querySelector('[slot="caption"]') !== null;
  }
  connectedCallback() {
    super.connectedCallback();
    this._observer = new MutationObserver((mutations) => {
      this._computeHasCaption();
    });
    this._observer.observe(this, {
      childList: true,
    });
  }
  disconnectedCallback() {
    this._observer.disconnect();
    super.disconnectedCallback();
  }

  static get haxProperties() {
    return {
      canScale: true,
      canPosition: false,
      canEditSource: true,
      gizmo: {
        title: "Image",
        descrption: "A way of presenting images with various enhancements.",
        icon: "editor:insert-photo",
        color: "indigo",
        groups: ["Image", "Media", "core"],
        handles: [
          {
            type: "image",
            type_exclusive: true,
            source: "source",
            title: "alt",
            alt: "alt",
            citation: "citation",
            caption: "caption",
          },
        ],
        meta: {
          author: "HAXTheWeb core team",
          outlineDesigner: true,
        },
      },
      settings: {
        configure: [
          {
            property: "source",
            title: "Source",
            description: "The URL for the image.",
            inputMethod: "haxupload",
            required: true,
          },
          {
            property: "alt",
            title: "Alternative text",
            description: "Text to describe the image to non-sighted users.",
            inputMethod: "alt",
            required: true,
          },
          {
            property: "card",
            title: "Card",
            description:
              "Apply a drop shadow to give the appearance of being a raised card.",
            inputMethod: "boolean",
            required: false,
          },
          {
            property: "box",
            title: "Box",
            description: "Apply a visual box around the image.",
            inputMethod: "boolean",
            required: false,
          },
          {
            property: "offset",
            title: "Offset",
            description: "Apply a left or right offset to the image.",
            inputMethod: "select",
            options: {
              none: "none",
              wide: "wide",
              narrow: "narrow",
            },
          },
          {
            property: "citation",
            title: "Citation",
            description: "Citation for the image.",
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "caption",
            title: "Caption",
            description: "Caption for the image.",
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "figureLabelTitle",
            title: "Figure Label Title",
            description: "Title for the figure label.",
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "figureLabelDescription",
            title: "Figure Label Description",
            description: "Description for the figure label.",
            inputMethod: "textfield",
            required: false,
          },
        ],
        advanced: [
          {
            property: "round",
            title: "Round image",
            description: "Crops the image appearance to be circle in shape.",
            inputMethod: "boolean",
            required: false,
          },
          {
            property: "disableZoom",
            title: "Disable image modal",
            description:
              "Disable clicks opening the image in an image inspector dialog.",
            inputMethod: "boolean",
            required: false,
          },
        ],
      },
      demoSchema: [
        {
          tag: "media-image",
          properties: {
            source: "https://dummyimage.com/300x200/000/fff",
            card: true,
            citation: "This is my citation.",
          },
        },
      ],
    };
  }
}
customElements.define(MediaImage.tag, MediaImage);

/**
 * `media-image-image`
 * `A simple image presentaiton with minor documented options`
 * @element media-image-image
 */
class MediaImageImage extends SimpleModalHandler(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        .image-wrap {
          overflow: hidden;
        }
        .image-wrap img {
          width: 100%;
        }
        :host([round]) .image-wrap {
          border-radius: 50%;
        }
      `,
    ];
  }
  constructor() {
    super();
    this.round = false;
    this.modalContent = document.createElement("image-inspector");
    this.modalContent.noLeft = true;
    this.modalTitle = "";
    setTimeout(() => {
      this.addEventListener(
        "simple-modal-show",
        this.__modalShowEvent.bind(this)
      );
    }, 0);
  }
  /**
   * Only import the definition if they call up the modal because it's a pretty
   * heavy library tree
   */
  __modalShowEvent(e) {
    import("@lrnwebcomponents/image-inspector/image-inspector.js");
  }
  render() {
    return html`
      <div class="image-wrap">
        <img
          src="${this.source}"
          alt="${this.alt}"
          aria-describedby="${this.describedBy || ""}"
          loading="lazy"
        />
      </div>
    `;
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      // ensure pop up matches source url
      if (propName == "source") {
        this.modalContent.src = this[propName];
      }
    });
  }
  static get properties() {
    return {
      source: {
        type: String,
      },
      alt: {
        type: String,
      },
      describedBy: {
        type: String,
        attribute: "described-by",
      },
      round: {
        type: Boolean,
        reflect: true,
      },
      modalTitle: {
        type: String,
        attribute: "modal-title",
      },
    };
  }
  static get tag() {
    return "media-image-image";
  }
}
customElements.define(MediaImageImage.tag, MediaImageImage);

/**
 * `media-image-citation`
 * `A simple image presentaiton with minor documented options`
 * @demo demo/index.html
 * @element media-image-citation
 */
class MediaImageCitation extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          overflow: auto;
        }

        .citation {
          font-size: 13.3333px;
          line-height: 24px;
          font-weight: 400;
          font-style: italic;
          color: #4c4c4c;
          margin: 15px 0 15px;
        }
      `,
    ];
  }
  render() {
    return html` <div class="citation"><slot></slot></div> `;
  }
  static get tag() {
    return "media-image-citation";
  }
}
customElements.define(MediaImageCitation.tag, MediaImageCitation);

/**
 * `media-image-caption`
 * `A simple image presentaiton with minor documented options`
 * @demo demo/index.html
 * @element media-image-caption
 */
class MediaImageCaption extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          overflow: auto;
        }

        .caption {
          line-height: 28.8px;
          font-size: 16px;
          font-weight: 400;
        }

        .caption ::slotted(*) {
          margin-top: 0;
        }
        .caption ::slotted(*:last-child) {
          margin-bottom: 0;
        }
      `,
    ];
  }
  render() {
    return html`
      <div class="caption">
        ${!this.__hasContent ? html` <slot id="slot"></slot> ` : ``}
      </div>
    `;
  }
  static get tag() {
    return "media-image-caption";
  }
}
customElements.define(MediaImageCaption.tag, MediaImageCaption);

export { MediaImage };
