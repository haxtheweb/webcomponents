/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import { FlattenedNodesObserver } from "@polymer/polymer/lib/utils/flattened-nodes-observer.js";
import "@lrnwebcomponents/figure-label/figure-label.js";

/**
 * `media-image`
 * `A simple image presentaiton with minor documented options`
 * @demo demo/index.html
 */
class MediaImage extends SchemaBehaviors(PolymerElement) {
  constructor() {
    super();
    import("@polymer/iron-image/iron-image.js");
    import("@polymer/iron-icons/iron-icons.js");
  }
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          width: auto;
          margin: auto;
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

        :host([round]) iron-image {
          border-radius: 50%;
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

        iron-image {
          width: 100%;
          --iron-image-width: 100%;
        }

        :host([offset="left"]) {
          float: left;
          margin: var(--media-image-offset-width, 1.5vw);
          margin-left: calc(-2 * var(--media-image-offset-width, 1.5vw));
          margin-top: 0;
          margin-bottom: calc(0.1 * var(--media-image-offset-width, 1.5vw));
        }

        :host([offset="right"]) {
          float: right;
          margin: var(--media-image-offset-width, 1.5vw);
          margin-right: calc(-2 * var(--media-image-offset-width, 1.5vw));
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
      </style>

      <dom-if if="[[_hasFigureLabel(figureLabelTitle, figureLabelDescription)]]">
        <template>
          <figure-label title="[[figureLabelTitle]]" description="[[figureLabelDescription]]">
        </template>
      </dom-if>

      <iron-image
        resource\$="[[schemaResourceID]]-image"
        src\$="[[source]]"
        alt\$="[[alt]]"
      ></iron-image>


      <media-image-citation>
        <slot name="citation">
          [[citation]]
        </slot>
      </media-image-citation>

      <dom-if if="[[_hasCaption]]">
        <template>
          <media-image-caption>
            <slot name="caption">
              [[caption]]
            </slot>
          </media-image-caption>
        </template>
      </dom-if>
    `;
  }
  static get tag() {
    return "media-image";
  }
  static get properties() {
    return {
      ...super.properties,

      /**
       * Image source.
       */
      source: {
        type: String,
        value: ""
      },
      /**
       * Image citation.
       */
      citation: {
        type: String,
        value: ""
      },
      /**
       * Image caption.
       */
      caption: {
        type: String,
        value: "",
        observer: "_computeHasCaption"
      },
      /**
       * Image alt.
       */
      alt: {
        type: String,
        value: ""
      },
      /**
       * The size of the image (small, wide).
       */
      size: {
        type: String,
        value: "wide",
        reflectToAttribute: true
      },
      /**
       * The shape of the image (round).
       */
      round: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * Applies card styling.
       */
      card: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * Applies box styling.
       */
      box: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
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
        value: "none",
        reflectToAttribute: true
      },
      /**
       * Added a figure label title to the top of the media-image
       */
      figureLabelTitle: {
        type: String,
        value: ""
      },
      /**
       * Added a figure label description to the top of the media-image
       */
      figureLabelDescription: {
        type: String,
        value: ""
      }
    };
  }

  // Observe the name sub-property on the user object
  // if the either of the figure label values are present then display
  // the figure label
  _hasFigureLabel(title, description) {
    return title.length > 0 || description.length > 0;
  }

  ready() {
    super.ready();
    this._observer = new FlattenedNodesObserver(this, info => {
      this._computeHasCaption();
    });
  }

  _computeHasCaption() {
    this._hasCaption =
      this.caption.length > 0 ||
      this.querySelector('[slot="caption"]') !== null;
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
            caption: "caption"
          }
        ],
        meta: {
          author: "LRNWebComponents"
        }
      },
      settings: {
        quick: [
          {
            property: "source",
            title: "Source",
            description: "The URL for the image.",
            inputMethod: "textfield",
            icon: "link",
            required: true
          },
          {
            property: "alt",
            title: "Alternative text",
            description: "Text to describe the image to non-sighted users.",
            inputMethod: "textfield",
            icon: "accessibility",
            required: false
          }
        ],
        configure: [
          {
            property: "source",
            title: "Source",
            description: "The URL for the image.",
            inputMethod: "haxupload",
            icon: "link",
            required: true
          },
          {
            property: "alt",
            title: "Alternative text",
            description: "Text to describe the image to non-sighted users.",
            inputMethod: "alt",
            icon: "accessibility",
            required: true
          },
          {
            property: "round",
            title: "Round image",
            description: "Crops the image appearance to be circle in shape.",
            inputMethod: "boolean",
            icon: "account",
            required: false
          },
          {
            property: "card",
            title: "Card",
            description:
              "Apply a drop shadow to give the appearance of being a raised card.",
            inputMethod: "boolean",
            icon: "check-box-outline-blank",
            required: false
          },
          {
            property: "box",
            title: "Box",
            description: "Apply a visual box around the image.",
            inputMethod: "boolean",
            icon: "image:crop-square",
            required: false
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
              narrow: "narrow"
            }
          },
          {
            property: "citation",
            title: "Citation",
            description: "Citation for the image.",
            inputMethod: "textfield",
            icon: "text-format",
            required: false
          },
          {
            property: "caption",
            title: "Caption",
            description: "Caption for the image.",
            inputMethod: "textfield",
            icon: "text-format",
            required: false
          },
          {
            property: "figureLabelTitle",
            title: "Figure Label Title",
            description: "Title for the figure label.",
            inputMethod: "textfield",
            icon: "text-format",
            required: false
          },
          {
            property: "figureLabelDescription",
            title: "Figure Label Description",
            description: "Description for the figure label.",
            inputMethod: "textfield",
            icon: "text-format",
            required: false
          }
        ]
      }
    };
  }
}
window.customElements.define(MediaImage.tag, MediaImage);

/**
 * `media-image-citation`
 * `A simple image presentaiton with minor documented options`
 * @demo demo/index.html
 */
class MediaImageCitation extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        .citation {
          font-size: 12.8px;
          font-style: italic;
          color: #4c4c4c;
          margin: 15px 0 15px;
        }
      </style>
      <div class="citation"><slot></slot></div>
    `;
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
 */
class MediaImageCaption extends PolymerElement {
  static get template() {
    return html`
      <style>
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

        ::slotted(*) {
          margin-top: 0;
        }
        ::slotted(*:last-child) {
          margin-bottom: 0;
        }
      </style>
      <div class="caption" hidden$="[[!__hasContent]]">
        <slot id="slot"></slot>
      </div>
    `;
  }
  static get tag() {
    return "media-image-caption";
  }
}
window.customElements.define(MediaImageCaption.tag, MediaImageCaption);

export { MediaImage };
