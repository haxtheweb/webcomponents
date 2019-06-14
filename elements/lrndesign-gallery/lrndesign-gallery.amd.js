define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./lib/lrndesign-gallery-behaviors.js","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js","./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js","./node_modules/@lrnwebcomponents/simple-colors/simple-colors.js","./lib/lrndesign-gallery-carousel.js","./lib/lrndesign-gallery-grid.js"],function(_exports,_polymerElement,_lrndesignGalleryBehaviors,_HAXWiring,_schemaBehaviors,_simpleColors,_lrndesignGalleryCarousel,_lrndesignGalleryGrid){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.LrndesignGallery=void 0;function _templateObject_b74d40d081c311e98550133e33ad20b3(){var data=babelHelpers.taggedTemplateLiteral(["\n      <style>\n        :host {\n          display: block;\n        }\n        :host([hidden]) {\n          display: none;\n        }\n      </style>\n      <div id=\"gallery\">\n        <template is=\"dom-if\" if=\"[[!grid]]\" restamp>\n          <lrndesign-gallery-carousel\n            accent-color$=\"[[accentColor]]\"\n            aspect-ratio$=\"[[aspectRatio]]\"\n            title$=\"[[title]]\"\n            dark$=\"[[dark]]\"\n            gallery-id$=\"[[id]]\"\n            responsive-size$=\"[[responsiveSize]]\"\n            sizing$=\"[[sizing]]\"\n            sources=\"[[sources]]\"\n            title$=\"[[title]]\"\n          >\n            <slot></slot>\n          </lrndesign-gallery-carousel>\n        </template>\n        <template is=\"dom-if\" if=\"[[grid]]\">\n          <lrndesign-gallery-grid\n            accent-color$=\"[[accentColor]]\"\n            aspect-ratio$=\"[[aspectRatio]]\"\n            dark$=\"[[dark]]\"\n            gallery-id$=\"[[id]]\"\n            responsive-size$=\"[[responsiveSize]]\"\n            sizing$=\"[[sizing]]\"\n            sources=\"[[sources]]\"\n            title$=\"[[title]]\"\n          >\n            <slot></slot>\n          </lrndesign-gallery-grid>\n        </template>\n      </div>\n    "]);_templateObject_b74d40d081c311e98550133e33ad20b3=function _templateObject_b74d40d081c311e98550133e33ad20b3(){return data};return data}/**
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
 */var LrndesignGallery=/*#__PURE__*/function(_LrndesignGalleryBeha){babelHelpers.inherits(LrndesignGallery,_LrndesignGalleryBeha);function LrndesignGallery(){babelHelpers.classCallCheck(this,LrndesignGallery);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(LrndesignGallery).apply(this,arguments))}babelHelpers.createClass(LrndesignGallery,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){var root=this;babelHelpers.get(babelHelpers.getPrototypeOf(LrndesignGallery.prototype),"connectedCallback",this).call(this);this.HAXWiring=new _HAXWiring.HAXWiring;this.HAXWiring.setup(LrndesignGallery.haxProperties,LrndesignGallery.tag,this);root.__gallery=root.$.gallery;root.anchorData=root._getAnchorData();window.ResponsiveUtility.requestAvailability();window.dispatchEvent(new CustomEvent("responsive-element",{detail:{element:root,attribute:"responsive-size",relativeToParent:!0}}))}/**
   * life cycle, element is ready
   */},{key:"ready",value:function ready(){babelHelpers.get(babelHelpers.getPrototypeOf(LrndesignGallery.prototype),"ready",this).call(this)}}],[{key:"tag",/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */get:function get(){return"lrndesign-gallery"}},{key:"behaviors",get:function get(){return[_lrndesignGalleryBehaviors.LrndesignGalleryBehaviors]}// render function
},{key:"template",get:function get(){return(0,_polymerElement.html)(_templateObject_b74d40d081c311e98550133e33ad20b3())}// haxProperty definition
},{key:"haxProperties",get:function get(){return{canScale:!1,canPosition:!1,canEditSource:!0,gizmo:{title:"Image Gallery",description:"An image gallery displayed as a carousel or a grid",icon:"image:collections",color:"cyan",groups:["Content","Instructional","Media","Image"],handles:[{type:"image",source:"image"}],meta:{author:"LRNWebComponents"}},settings:{quick:[],configure:[{property:"title",title:"Gallery Title",description:"A title for the gallery.",inputMethod:"textfield",icon:"editor:title"},{property:"accentColor",title:"Accent Color",description:"An optional accent color.",inputMethod:"colorpicker",icon:"editor:format-color-fill"},{property:"dark",title:"Dark Theme",description:"Enable Dark Theme",inputMethod:"boolean",icon:"icons:invert-colors"},{property:"grid",title:"Grid View",description:"Display as grid?",inputMethod:"boolean",icon:"icons:view-module"},{slot:"description",title:"Gallery Description",description:"An optional description for the gallery.",inputMethod:"textfield"},{property:"sources",title:"Gallery Images",description:"The images for the gallery.",inputMethod:"array",properties:[{property:"title",title:"Image Title",description:"The heading for the image.",inputMethod:"textfield"},{property:"details",title:"Image Details",description:"The body text with details for the image.",inputMethod:"textfield"},{property:"src",title:"Image Source",description:"The path of the image.",inputMethod:"haxupload"},{property:"thumbnail",title:"Image Thumbnail Source",description:"The path of an optional thumbnail version of the image.",inputMethod:"haxupload"},{property:"large",title:"Image Full Size Source",description:"The path of an optional large version of the image for zooming.",inputMethod:"haxupload"}]}],advanced:[{property:"aspectRatio",title:"Aspect Ratio",description:"Custom aspect ratio, default is calculated based on the first image's aspect ratio",inputMethod:"textfield"},{property:"sizing",title:"Fit to Aspect Ratio",description:"Fit images to aspect ratio",inputMethod:"select",options:{cover:"crop",contain:"letterbox"}}]}};this.setHaxProperties(props)}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{}}}]);return LrndesignGallery}(_lrndesignGalleryBehaviors.LrndesignGalleryBehaviors);_exports.LrndesignGallery=LrndesignGallery;window.customElements.define(LrndesignGallery.tag,LrndesignGallery)});