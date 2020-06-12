/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import { SimpleColorsSuper } from "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * `hero-banner`
 * `That thing no one wants to make over and over again yet always does...`
 * @demo demo/index.html
 * @element hero-banner
 */
class HeroBanner extends SimpleColorsSuper(LitElement) {
  constructor() {
    super();
    import("@polymer/paper-button/paper-button.js");
    import("@polymer/iron-image/iron-image.js");
  }
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          width: 100%;
          min-height: 600px;
          height: 100%;
          max-height: 600px;
          overflow: hidden;
          position: relative;
          --hero-banner-font-family: "Roboto";
          --hero-banner-title-weight: 500;
          --hero-banner-text: var(--simple-colors-default-theme-grey-12);
          --hero-banner-rgba: rgba(255, 255, 255, 0.65);
          --hero-banner-image-bg: var(--simple-colors-default-theme-grey-3);
          --hero-banner-button-weight: bold;
          --hero-banner-button-color: var(
            --simple-colors-default-theme-accent-5
          );
          --hero-banner-button-hover-color: var(
            --simple-colors-default-theme-accent-4
          );
        }
        :host([dark]) {
          --hero-banner-rgba: rgba(0, 0, 0, 0.65);
        }
        .image {
          position: absolute;
          left: 0;
          right: 0;
          width: 100%;
          height: 100%;
          background-color: var(--hero-banner-image-bg);
        }
        .itemwrapper {
          position: absolute;
          bottom: 10%;
          left: 10%;
          width: 50%;
        }
        .title {
          background-color: var(--hero-banner-rgba);
          padding: 10px 16px;
          font-size: 32px;
          color: var(--hero-banner-text);
          margin: 4px 0;
          font-family: var(--hero-banner-font-family);
          font-weight: var(--hero-banner-title-weight);
        }
        .details {
          background-color: var(--hero-banner-rgba);
          padding: 10px 16px;
          font-size: 16px;
          color: var(--hero-banner-text);
          margin: 4px 0;
          font-family: var(--hero-banner-font-family);
        }
        .linkbutton {
          padding: 0;
          margin: 8px 0;
          text-decoration: none;
          font-family: var(--hero-banner-font-family);
        }
        .linkbutton paper-button {
          text-transform: none;
          font-weight: var(--hero-banner-button-weight);
          color: var(--hero-banner-text);
          background-color: var(--hero-banner-button-color);
          font-size: 16px;
          margin: 0;
        }
        .linkbutton:focus paper-button,
        .linkbutton:hover paper-button {
          background-color: var(--hero-banner-button-hover-color);
        }
        @media screen and (max-width: 720px) {
          .title {
            font-size: 20px;
          }
          .details {
            font-size: 12px;
          }
          .itemwrapper {
            left: 5%;
            width: 50%;
          }
        }
        @media screen and (max-width: 500px) {
          .title {
            font-size: 16px;
          }
          .details {
            display: none;
          }
          .itemwrapper {
            left: 0;
            width: 300px;
          }
        }
      `
    ];
  }
  render() {
    return html`
      <iron-image
        class="image"
        src="${this.image}"
        fade
        preload
        sizing="cover"
        aria-describedby="${this.ariaDescribedby || ""}"
      ></iron-image>
      <div class="itemwrapper">
        <div class="title">${this.title}</div>
        <div class="details">${this.details}</div>
        <a
          class="linkbutton"
          href="${this.buttonLink || ""}"
          ?hidden="${!this.buttonLink}"
          ><paper-button raised=""
            >${this.buttonText || "Find out more"}</paper-button
          ></a
        >
      </div>
    `;
  }

  static get tag() {
    return "hero-banner";
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * Title
       */
      title: {
        type: String
      },
      /**
       * Image
       */
      image: {
        type: String
      },
      /**
       * Details / teaser text
       */
      details: {
        type: String
      },
      /**
       * button label
       */
      buttonText: {
        type: String,
        attribute: "button-text"
      },
      /**
       * url for the button
       */
      buttonLink: {
        type: String,
        attribute: "button-link"
      },
      /*
       * accessible long description
       */
      ariaDescribedby: {
        attribute: "aria-decsribedby",
        type: String
      }
    };
  }

  static get haxProperties() {
    return {
      canScale: false,
      canPosition: false,
      canEditSource: false,
      gizmo: {
        title: "Hero image",
        description:
          "Typically fancy banner image calling your attention to something.",
        icon: "image:panorama",
        color: "red",
        groups: ["Image", "Media"],
        handles: [
          {
            type: "image",
            source: "image",
            title: "title",
            description: "details",
            link: "buttonLink"
          }
        ],
        meta: {
          author: "ELMS:LN"
        }
      },
      settings: {
        quick: [
          {
            property: "title",
            title: "Title",
            description: "The title of the element",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "image",
            title: "Image",
            description: "URL of the image",
            inputMethod: "textfield",
            icon: "image:panorama"
          },
          {
            property: "details",
            title: "Details",
            description: "Additional text detail / teaser data",
            inputMethod: "textfield",
            icon: "editor:text-fields"
          },
          {
            property: "buttonText",
            title: "Button",
            description: "Label of the button",
            inputMethod: "textfield",
            icon: "icons:radio-button-unchecked"
          },
          {
            property: "accentColor",
            title: "Accent color",
            description: "Select the accent color use",
            inputMethod: "colorpicker",
            icon: "editor:format-color-fill"
          },
          {
            property: "dark",
            title: "Dark",
            description: "Use dark theme",
            inputMethod: "boolean",
            icon: "invert-colors"
          },
          {
            property: "buttonLink",
            title: "Button - Link",
            description: "Label of the button",
            inputMethod: "textfield",
            validationType: "url",
            icon: "icons:link"
          }
        ],
        configure: [
          {
            property: "title",
            title: "Title",
            description: "The title of the element",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "image",
            title: "Image",
            description: "URL of the image",
            inputMethod: "haxupload",
            icon: "image:panorama"
          },
          {
            property: "details",
            title: "Details",
            description: "Additional text detail / teaser data",
            inputMethod: "textfield",
            icon: "editor:text-fields"
          },
          {
            property: "buttonText",
            title: "Button",
            description: "Label of the button",
            inputMethod: "textfield",
            icon: "icons:radio-button-unchecked"
          },
          {
            property: "accentColor",
            title: "Accent color",
            description: "Select the accent color use",
            inputMethod: "colorpicker",
            icon: "editor:format-color-fill"
          },
          {
            property: "dark",
            title: "Dark",
            description: "Use dark theme",
            inputMethod: "boolean",
            icon: "invert-colors"
          },
          {
            property: "buttonLink",
            title: "Button - Link",
            description: "Label of the button",
            inputMethod: "haxupload",
            validationType: "url",
            icon: "icons:link"
          }
        ],
        advanced: [
          {
            property: "ariaDescribedby",
            title: "aria-decsribedby",
            description:
              "Space-separated id list for long descriptions that appear elsewhere",
            inputMethod: "textfield"
          }
        ]
      }
    };
  }
}
window.customElements.define(HeroBanner.tag, HeroBanner);
export { HeroBanner };
