/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import { SimpleModalHandler } from "@lrnwebcomponents/simple-modal/lib/simple-modal-handler.js";
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
          max-height: 600px;
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

        @media screen and (min-width: 450px) {
          :host([size="small"]) {
            max-width: 50%;
          }
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
      `,
    ];
  }
  constructor() {
    super();
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
      if (propName == "__figureLabel") {
        if (this[propName]) {
          import("@lrnwebcomponents/figure-label/figure-label.js");
        }
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
       * Sets aria-describedby attribute.
       */
      describedBy: {
        type: String,
        attrbute: "described-by",
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
    return title.length > 0 || description.length > 0;
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
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Styled image",
        descrption:
          "An image gizmo with the ability to provide simple, consistent styling and accessibility options.",
        icon: "editor:insert-photo",
        color: "indigo",
        groups: ["Image", "Media"],
        handles: [
          {
            type: "image",
            source: "source",
            title: "alt",
            alt: "alt",
            citation: "citation",
            caption: "caption",
            ariaDescribedby: "describedBy",
          },
        ],
        meta: {
          author: "ELMS:LN",
        },
      },
      settings: {
        quick: [
          {
            property: "source",
            title: "Source",
            description: "The URL for the image.",
            inputMethod: "textfield",
            icon: "link",
            required: true,
          },
          {
            property: "alt",
            title: "Alternative text",
            description: "Text to describe the image to non-sighted users.",
            inputMethod: "textfield",
            icon: "accessibility",
            required: false,
          },
        ],
        configure: [
          {
            property: "source",
            title: "Source",
            description: "The URL for the image.",
            inputMethod: "haxupload",
            icon: "link",
            required: true,
          },
          {
            property: "alt",
            title: "Alternative text",
            description: "Text to describe the image to non-sighted users.",
            inputMethod: "alt",
            icon: "accessibility",
            required: true,
          },
          {
            property: "round",
            title: "Round image",
            description: "Crops the image appearance to be circle in shape.",
            inputMethod: "boolean",
            icon: "account",
            required: false,
          },
          {
            property: "card",
            title: "Card",
            description:
              "Apply a drop shadow to give the appearance of being a raised card.",
            inputMethod: "boolean",
            icon: "check-box-outline-blank",
            required: false,
          },
          {
            property: "box",
            title: "Box",
            description: "Apply a visual box around the image.",
            inputMethod: "boolean",
            icon: "image:crop-square",
            required: false,
          },
          {
            property: "offset",
            title: "Offset",
            description: "Apply a left or right offset to the image.",
            inputMethod: "select",
            icon: "image:crop-square",
            options: {
              none: "none",
              left: "left",
              right: "right",
              wide: "wide",
              narrow: "narrow",
            },
          },
          {
            property: "citation",
            title: "Citation",
            description: "Citation for the image.",
            inputMethod: "textfield",
            icon: "text-format",
            required: false,
          },
          {
            property: "caption",
            title: "Caption",
            description: "Caption for the image.",
            inputMethod: "textfield",
            icon: "text-format",
            required: false,
          },
          {
            property: "figureLabelTitle",
            title: "Figure Label Title",
            description: "Title for the figure label.",
            inputMethod: "textfield",
            icon: "text-format",
            required: false,
          },
          {
            property: "figureLabelDescription",
            title: "Figure Label Description",
            description: "Description for the figure label.",
            inputMethod: "textfield",
            icon: "text-format",
            required: false,
          },
        ],
        advanced: [
          {
            property: "describedBy",
            title: "aria-describedby",
            description:
              "Space-separated list of IDs for elements that describe the image.",
            inputMethod: "textfield",
          },
        ],
      },
      demoSchema: [
        {
          tag: "media-image",
          properties: {
            source: "http://unsplash.it/600",
            figureLabelTitle: "1.3",
            figureLabelDescription: "This is the description of the figure.",
            citation: "This is my citation.",
          },
        },
      ],
    };
  }
}
window.customElements.define(MediaImage.tag, MediaImage);

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
        :host(:hover) {
          cursor: pointer;
        }
        .image-wrap {
          max-height: 600px;
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
window.customElements.define(MediaImageImage.tag, MediaImageImage);

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
        }

        .citation {
          font-size: 12.8px;
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
window.customElements.define(MediaImageCitation.tag, MediaImageCitation);

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
        }

        .caption {
          padding-bottom: 25px;
          border-bottom: dashed 2px lightgray;
          margin-bottom: 25px;
          line-height: 1.5;
          font-size: 18px;
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
window.customElements.define(MediaImageCaption.tag, MediaImageCaption);

export { MediaImage };
