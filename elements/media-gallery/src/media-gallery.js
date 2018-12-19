/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/lrndesign-gallery/lrndesign-gallery.js";
import "@lrnwebcomponents/lrndesign-gallery/lib/lrndesign-gallery-grid.js";
export { MediaGallery };
/**
 * `media-gallery`
 * `Connects lrndesign-gallery to HAX`
 *
 * @microcopy - language worth noting: ```
 <media-gallery  
  accent-color="grey"               //optional, the accent color from simple-colors; default is grey
  dark                              //optional, if true, gallery will use the simple-colors dark theme; default is false (light-theme)
  gallery-id="mygallery1"           //optional, a unique id for the gallery; if true, you can use the id in anchors to access gallery items on page load
  grid                              //optional, if true, gallery will display as a grid; default is a carousel
  sources="[]"                      //required, array of image sources
  sizing="contain"                  //optional, "cover" for cropping (default) or "contain" for letterboxing
  title="My Gallery">               //optional, the title of the gallery
  Optional description of the gallery.
</lrndesign-gallery>```
 </media-gallery>```
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
}]
 *
 * @customElement
 * @polymer
 * @demo demo/index.html default gallery (carousel)
 * @demo demo/grid.html gallery grid
 */
class MediaGallery extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "media-gallery";
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setHaxProperties(
      MediaGallery.haxProperties,
      MediaGallery.tag,
      this
    );
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(MediaGallery.tag, MediaGallery);
