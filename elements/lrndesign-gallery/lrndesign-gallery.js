/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { LrndesignGalleryBehaviors } from "./lib/lrndesign-gallery-behaviors.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "./lib/lrndesign-gallery-carousel.js";
import "./lib/lrndesign-gallery-grid.js";

export { LrndesignGallery };
/**
 * `lrndesign-gallery`
 * `An element that renders a collection of gallery items into a carousel or a single media item into a layout.`
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
 * @customElement
 * @polymer
 * @demo demo/index.html carousel demo
 * @demo demo/grid.html grid demo
 */
class LrndesignGallery extends LrndesignGalleryBehaviors {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "lrndesign-gallery";
  }

  static get behaviors() {
    return [LrndesignGalleryBehaviors];
  }

  // render function
  static get template() {
    return html`
      <style is="custom-style" include="simple-colors">
        :host {
          display: block;
        }
        :host([hidden]) {
          display: none;
        }
      </style>
      <div id="gallery">
        <template is="dom-if" if="[[!grid]]" restamp>
          <lrndesign-gallery-carousel
            accent-color$="[[accentColor]]"
            aspect-ratio$="[[aspectRatio]]"
            title$="[[title]]"
            dark$="[[dark]]"
            gallery-id$="[[id]]"
            responsive-size$="[[responsiveSize]]"
            sizing$="[[sizing]]"
            sources="[[sources]]"
            title$="[[title]]"
          >
            <slot name="description"></slot>
          </lrndesign-gallery-carousel>
        </template>
        <template is="dom-if" if="[[grid]]">
          <lrndesign-gallery-grid
            accent-color$="[[accentColor]]"
            aspect-ratio$="[[aspectRatio]]"
            dark$="[[dark]]"
            gallery-id$="[[id]]"
            responsive-size$="[[responsiveSize]]"
            sizing$="[[sizing]]"
            sources="[[sources]]"
            title$="[[title]]"
          >
            <slot name="description"></slot>
          </lrndesign-gallery-grid>
        </template>
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
          author: "LRNWebComponents"
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
                inputMethod: "textfield"
              },
              {
                property: "thumbnail",
                title: "Image Thumbnail Source",
                description:
                  "The path of an optional thumbnail version of the image.",
                inputMethod: "textfield"
              },
              {
                property: "large",
                title: "Image Full Size Source",
                description:
                  "The path of an optional large version of the image for zooming.",
                inputMethod: "textfield"
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
    this.setHaxProperties(props);
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {};
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    let root = this;
    super.connectedCallback();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(
      LrndesignGallery.haxProperties,
      LrndesignGallery.tag,
      this
    );
    root.__gallery = root.$.gallery;
    root.anchorData = root._getAnchorData();
    window.ResponsiveUtility.requestAvailability();
    window.dispatchEvent(
      new CustomEvent("responsive-element", {
        detail: {
          element: root,
          attribute: "responsive-size",
          relativeToParent: true
        }
      })
    );
  }

  /**
   * life cycle, element is ready
   */
  ready() {
    super.ready();
  }
}
window.customElements.define(LrndesignGallery.tag, LrndesignGallery);
