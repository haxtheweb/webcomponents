/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import { SimpleModalHandler } from "@haxtheweb/simple-modal/lib/simple-modal-handler.js";
import "@haxtheweb/figure-label/figure-label.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
/**
 * `media-image`
 * `A simple image presentaiton with minor documented options`
 * @demo demo/index.html
 * @element media-image
 */
class MediaImage extends DDD {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          width: auto;
          margin: auto;
          max-width: 600px;
          font-family: var(--ddd-font-secondary);
          font-weight: var(--ddd-font-secondary-light);
          font-size: var(--ddd-font-size-4xs);
        }

        :host([card]) {
          box-shadow: var(--ddd-boxShadow-sm);
          border: var(--ddd-border-xs);
          border-color: var(--ddd-theme-default-limestoneLight);
          padding: var(--ddd-spacing-5);
          background-color: var(
            --ddd-component-media-image-card-color,
            var(--card-background-color)
          );
        }

        :host([box]) {
          padding: var(--ddd-spacing-5);
          background-color: var(--ddd-theme-accent, var(--ddd-accent-2));
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
          max-height: var(--ddd-icon-4xl);
          border: var(--ddd-border-sm);
          border-color: var(
            --ddd-component-figure-label-title,
            var(--ddd-theme-accent, var(--ddd-theme-default-limestoneLight))
          );
          background: var(--ddd-component-figure-label-description-background, transparent);
          padding: var(--ddd-spacing-2);
          margin-bottom: var(--ddd-spacing-5);
          line-height: var(--ddd-lh-140);
        }
        :host(:not([disable-zoom])) media-image-image:hover {
          cursor: pointer;
        }
      `,
    ];
  }
  constructor() {
    super();
    this.link = null;
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
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "caption") {
        this._computeHasCaption(this[propName]);
      }
      // if we have a link, we disable zoom automatically
      if (propName === "link" && this.link) {
        this.disableZoom = true;
      }
      if (["figureLabelTitle", "figureLabelDescription"].includes(propName)) {
        this.__figureLabel = this._hasFigureLabel(
          this.figureLabelTitle,
          this.figureLabelDescription,
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
      ${this.link
        ? html`<a href="${this.link}"
            ><media-image-image
              ?round="${this.round}"
              resource="${this.schemaResourceID}-image"
              source="${this.source}"
              modal-title="${this.modalTitle}"
              alt="${this.alt}"
              tabindex="${!this.disableZoom ? "0" : "-1"}"
              @click="${this._handleClick}"
            ></media-image-image
          ></a>`
        : html`<media-image-image
            ?round="${this.round}"
            resource="${this.schemaResourceID}-image"
            source="${this.source}"
            modal-title="${this.modalTitle}"
            alt="${this.alt}"
            tabindex="${!this.disableZoom ? "0" : "-1"}"
            @click="${this._handleClick}"
          ></media-image-image>`}
      <media-image-citation>
        <slot class="citation" name="citation">${this.citation}</slot>
      </media-image-citation>
      ${this._hasCaption
        ? html`
            <media-image-caption tabindex="0">
              <slot name="caption">${this.caption}</slot>
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
    // not editing, and we have a link, and disabled zoom
    // click the link
    if (!this._haxState && this.link && this.disableZoom) {
      this.shadowRoot.querySelector("a").click();
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
      link: {
        type: String,
      },
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

      canEditSource: true,
      gizmo: {
        title: "Image",
        descrption: "A way of presenting images with various enhancements.",
        icon: "editor:insert-photo",
        color: "indigo",
        tags: [
          "Images",
          "media",
          "core",
          "figure",
          "image",
          "caption",
          "presentation",
          "design",
        ],
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
            noVoiceRecord: true,
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
            property: "link",
            title: "Link",
            description: "Link the image to a URL",
            inputMethod: "haxupload",
            noVoiceRecord: true,
            noCamera: true,
            required: false,
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
class MediaImageImage extends SimpleModalHandler(DDD) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
        .image-wrap {
          overflow: hidden;
          height: fit-content;
        }
        :host([round]) .image-wrap {
          overflow: unset;
        }
        .image-wrap img {
          width: 100%;
        }
        :host([round]) .image-wrap img {
          border-radius: var(--ddd-radius-circle);
          height: fit-content;
          overflow: show;
          border: var(--ddd-border-sm);
          border-color: var(
            --ddd-component-figure-label-title,
            var(
              --ddd-theme-accent,
              var(
                --simple-colors-default-theme-accent-2,
                var(--ddd-theme-default-limestoneLight)
              )
            )
          );
        }
      `,
    ];
  }
  constructor() {
    super();
    this.round = false;
    if (globalThis.document) {
      this.modalContent = globalThis.document.createElement("image-inspector");
      this.modalContent.noLeft = true;
    }
    this.modalTitle = "";
    if (this.addEventListener) {
      this.addEventListener(
        "simple-modal-show",
        this.__modalShowEvent.bind(this),
      );
    }
  }
  /**
   * Only import the definition if they call up the modal because it's a pretty
   * heavy library tree
   */
  __modalShowEvent(e) {
    import("@haxtheweb/image-inspector/image-inspector.js");
  }
  render() {
    return html`
      <div class="image-wrap">
        <img src="${this.source}" alt="${this.alt}" loading="lazy" />
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
class MediaImageCitation extends DDD {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          overflow: auto;
        }

        .citation {
          line-height: var(--ddd-lh-120);
          margin: var(--ddd-spacing-1) 0;
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          font-family: var(--ddd-font-navigation);
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
class MediaImageCaption extends DDD {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          overflow: auto;
          margin-top: var(--ddd-spacing-1);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-regular);
          font-family: var(--ddd-font-primary);
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
