/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
import { LrndesignGalleryBehaviors } from "./lib/lrndesign-gallery-behaviors.js";
import "@lrnwebcomponents/responsive-utility/responsive-utility.js";
import "./lib/lrndesign-gallery-carousel.js";
import "./lib/lrndesign-gallery-grid.js";

/**
 * `lrndesign-gallery`
 * An element that renders a collection of gallery items into a carousel or a single media item into a layout.
 * 
 * @customElement lrndesign-gallery
 * @demo ./demo/index.html carousel demo
 * @demo ./demo/grid.html grid demo
 *
 * @microcopy - language worth noting:```
 <lrndesign-gallery 
  accent-color="grey"               //optional, the accent color from simple-colors; default is grey
  dark                              //optional, if true, gallery will use the simple-colors dark theme; default is false (fixed-theme)
  id="mygallery1"                   //optional, a unique id for the gallery; if true, you can use the id in anchors to access gallery items on page load
  sources="[]"                      //required, array of image sources
  sizing="contain"                  //optional, "cover" for cropping (default) or "contain" for letterboxing
  title="My Gallery">               //optional, the title of the gallery
  Optional description of the gallery.
</lrndesign-gallery>```
 * where `sources` array is:```
[{
  "alt": "IMAGE ALT TEXT",                          //required
  "details": "TEXT ABOUT IMAGE HERE",               //optional 
  "heading": "IMAGE HEADING HERE",                  //required, the image heading when in zoom mode
  "id": "123"                                       //required, unique id  
  "sizing": "contain",                              //optional, "cover" for cropping (default) or "contain" for letterboxing, default is parent's sizing
  "large": "PATH/TO/LARGE/IMAGE/HERE.JPG",          //optional, larger image for zoom instead of src 
  "src": "PATH/TO/FULL/IMAGE/HERE.JPG",             //required
  "thumbnail": "PATH/TO/THUMBAIL/IMAGE/HERE.JPG",   //required
  "tooltip": "IMAGE TOOLTIP HERE",                  //required, the tooltip for the image thumbnail
  "title": "IMAGE TITLE HERE",                      //optional, the image title when viewed
  "type": "image",                                  //required, "image", "video", "audio", etc.
}]```
 *

 */
class LrndesignGallery extends LrndesignGalleryBehaviors {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "lrndesign-gallery";
  }
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
        }
        :host([hidden]) {
          display: none;
        }
      `
    ];
  }

  // render function
  render() {
    return html`
      <div id="gallery">
        ${this.grid
          ? html`
              <lrndesign-gallery-grid
                accent-color="${this.accentColor}"
                .aspect-ratio="${this.aspectRatio}"
                ?dark="${this.dark}"
                .gallery-id="${this.id}"
                responsive-size="${this.responsiveSize}"
                sizing="${this.sizing}"
                .sources="${this.sources}"
                title="${this.title}"
              >
                <slot></slot>
              </lrndesign-gallery-grid>
            `
          : html`
              <lrndesign-gallery-carousel
                accent-color="${this.accentColor}"
                .aspect-ratio="${this.aspectRatio}"
                ?dark="${this.dark}"
                .gallery-id="${this.id}"
                responsive-size="${this.responsiveSize}"
                sizing="${this.sizing}"
                .sources="${this.sources}"
                title="${this.title}"
              >
                <slot></slot>
              </lrndesign-gallery-carousel>
            `}
      </div>
    `;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: false,
      canPosition: false,
      canEditSource: true,
      gizmo: {
        title: "Image Gallery",
        description: "An image gallery displayed as a carousel or a grid",
        icon: "image:collections",
        color: "cyan",
        groups: ["Content", "Instructional", "Media", "Image"],
        handles: [
          {
            type: "image",
            source: "image"
          }
        ],
        meta: {
          author: "ELMS:LN"
        }
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "title",
            title: "Gallery Title",
            description: "A title for the gallery.",
            inputMethod: "textfield",
            icon: "editor:title"
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
            property: "grid",
            title: "Grid View",
            description: "Display as grid?",
            inputMethod: "boolean",
            icon: "icons:view-module"
          },
          {
            slot: "description",
            title: "Gallery Description",
            description: "An optional description for the gallery.",
            inputMethod: "textfield"
          },
          {
            property: "sources",
            title: "Gallery Images",
            description: "The images for the gallery.",
            inputMethod: "array",
            itemLabel: "title",
            properties: [
              {
                property: "title",
                title: "Image Title",
                description: "The heading for the image.",
                inputMethod: "textfield"
              },
              {
                property: "details",
                title: "Image Details",
                description: "The body text with details for the image.",
                inputMethod: "textfield"
              },
              {
                property: "src",
                title: "Image Source",
                description: "The path of the image.",
                inputMethod: "haxupload"
              },
              {
                property: "thumbnail",
                title: "Image Thumbnail Source",
                description:
                  "The path of an optional thumbnail version of the image.",
                inputMethod: "haxupload"
              },
              {
                property: "large",
                title: "Image Full Size Source",
                description:
                  "The path of an optional large version of the image for zooming.",
                inputMethod: "haxupload"
              }
            ]
          }
        ],
        advanced: [
          {
            property: "aspectRatio",
            title: "Aspect Ratio",
            description:
              "Custom aspect ratio, default is calculated based on the first image's aspect ratio",
            inputMethod: "textfield"
          },
          {
            property: "sizing",
            title: "Fit to Aspect Ratio",
            description: "Fit images to aspect ratio",
            inputMethod: "select",
            options: {
              cover: "crop",
              contain: "letterbox"
            }
          }
        ]
      }
    };
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties
    };
  }
  firstUpdated() {
    this.__gallery = this.shadowRoot.querySelector("#gallery");
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.anchorData = this._getAnchorData();
    window.ResponsiveUtility.requestAvailability();
    window.dispatchEvent(
      new CustomEvent("responsive-element", {
        detail: {
          element: this,
          attribute: "responsive-size",
          relativeToParent: true
        }
      })
    );
  }

  /**
   * calls responsive-utility to get parent's responsive size
   *
   * @param {object} a set of responsive for options, eg: `{element: root, attribute: "responsive-size", relativeToParent: true}`
   */
  _addResponsiveUtility(options) {
    window.ResponsiveUtility.requestAvailability();
    window.dispatchEvent(
      new CustomEvent("responsive-element", {
        detail:
          options !== undefined
            ? options
            : {
                element: this,
                attribute: "responsive-size",
                relativeToParent: true
              }
      })
    );
  }
}
window.customElements.define(LrndesignGallery.tag, LrndesignGallery);
export { LrndesignGallery };
