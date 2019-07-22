define(["exports","meta","require","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@polymer/polymer/lib/utils/render-status.js","./node_modules/@polymer/polymer/lib/utils/resolve-url.js","./node_modules/@lrnwebcomponents/es-global-bridge/es-global-bridge.js","./node_modules/@polymer/polymer/lib/elements/dom-if.js"],function(_exports,meta,_require,_polymerElement,_renderStatus,_resolveUrl,_esGlobalBridge,_domIf){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.ImgPanZoom=void 0;meta=babelHelpers.interopRequireWildcard(meta);_require=babelHelpers.interopRequireWildcard(_require);function _templateObject_7b6972a0ab1211e981c7a96d8b4382c5(){var data=babelHelpers.taggedTemplateLiteral(["\n      <style>\n        :host {\n          display: block;\n          position: relative;\n          height: 500px;\n        }\n        #viewer {\n          position: relative;\n          height: 100%;\n          width: 100%;\n        }\n\n        paper-spinner {\n          opacity: 0;\n          display: block;\n          transition: opacity 700ms;\n          position: absolute;\n          margin: auto;\n          top: 0;\n          left: 0;\n          bottom: 0;\n          right: 0;\n          z-index: 1;\n          height: 70px;\n          width: 70px;\n          --paper-spinner-color: var(--img-pan-zoom-spinner-color, #2196f3);\n          --paper-spinner-stroke-width: var(--img-pan-zoom-spinner-width, 5px);\n          @apply --img-pan-zoom-spinner;\n        }\n        paper-spinner[active] {\n          opacity: 1;\n        }\n      </style>\n\n      <!-- Only preload regular images -->\n      <template is=\"dom-if\" if=\"[[!dzi]]\">\n        <paper-spinner\n          hidden$=\"[[hideSpinner]]\"\n          active=\"[[loading]]\"\n        ></paper-spinner>\n        <img-loader\n          loaded=\"{{loaded}}\"\n          loading=\"{{loading}}\"\n          src=\"[[src]]\"\n        ></img-loader>\n      </template>\n\n      <!-- Openseadragon -->\n      <div id=\"viewer\"></div>\n    "]);_templateObject_7b6972a0ab1211e981c7a96d8b4382c5=function _templateObject_7b6972a0ab1211e981c7a96d8b4382c5(){return data};return data}/**
`img-pan-zoom` Image pan zoom element

Images are preloaded by `img-loader` and a spinner is shown until loaded
Deep Zoom Images are supported

### Styling

Custom property | Description | Default
----------------|-------------|----------
`--img-pan-zoom-spinner` | Mixin applied to spinner |
`--img-pan-zoom-spinner-color` | Spinner color | `#2196F3`
`--img-pan-zoom-spinner-width` | Spinner width | `5px`

### Credits

<a href="https://openseadragon.github.io">openSeadragon</a>


* @demo demo/index.html
*/var ImgPanZoom=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(ImgPanZoom,_PolymerElement);babelHelpers.createClass(ImgPanZoom,null,[{key:"template",get:function get(){return(0,_polymerElement.html)(_templateObject_7b6972a0ab1211e981c7a96d8b4382c5())}},{key:"tag",get:function get(){return"img-pan-zoom"}},{key:"properties",get:function get(){return{// Image source
src:{type:String},// Set to true if you are using a deep zoom image
dzi:{type:Boolean,value:!1},// Fade in new items added to the viewer
fadeIn:{type:Boolean,value:!0},// loading
loading:{type:Boolean,notify:!0},// hides spinner
hideSpinner:{type:Boolean,value:!1},// loaded
loaded:{type:Boolean,notify:!0,observer:"_loadedChanged"},// Set to false to prevent the appearance of the default navigation controls. Note that if set to false, the customs buttons set by the options zoomInButton, zoomOutButton etc, are rendered inactive.
showNavigationControl:{type:Boolean,value:!1},// Set to true to make the navigator minimap appear.
showNavigator:{type:Boolean,value:!1},// The "zoom distance" per mouse click or touch tap. Note: Setting this to 1.0 effectively disables the click-to-zoom feature (also see gestureSettings[Mouse|Touch|Pen].clickToZoom/dblClickToZoom).
zoomPerClick:{type:Number,value:2},// The "zoom distance" per mouse scroll or touch pinch. Note: Setting this to 1.0 effectively disables the mouse-wheel zoom feature (also see gestureSettings[Mouse|Touch|Pen].scrollToZoom}).
zoomPerScroll:{type:Number,value:1.2},// Specifies the animation duration per each OpenSeadragon.Spring which occur when the image is dragged or zoomed.
animationTime:{type:Number,value:1.2},// If true then the 'previous' button will wrap to the last image when viewing the first image and the 'next' button will wrap to the first image when viewing the last image.
navPrevNextWrap:{type:Boolean,value:!1},// If true then the rotate left/right controls will be displayed as part of the standard controls. This is also subject to the browser support for rotate (e.g. viewer.drawer.canRotate()).
showRotationControl:{type:Boolean,value:!1},// The minimum percentage ( expressed as a number between 0 and 1 ) of the viewport height or width at which the zoom out will be constrained. Setting it to 0, for example will allow you to zoom out infinity.
minZoomImageRatio:{type:Number,value:1},// The maximum ratio to allow a zoom-in to affect the highest level pixel ratio. This can be set to Infinity to allow 'infinite' zooming into the image though it is less effective visually if the HTML5 Canvas is not availble on the viewing device.
maxZoomPixelRatio:{type:Number,value:1.1},// Constrain during pan
constrainDuringPan:{type:Boolean,value:!1},// The percentage ( as a number from 0 to 1 ) of the source image which must be kept within the viewport. If the image is dragged beyond that limit, it will 'bounce' back until the minimum visibility ratio is achieved. Setting this to 0 and wrapHorizontal ( or wrapVertical ) to true will provide the effect of an infinitely scrolling viewport.
visibilityRatio:{type:Number,value:1}}}/**
   * life cycle
   */}]);function ImgPanZoom(){var _this;babelHelpers.classCallCheck(this,ImgPanZoom);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(ImgPanZoom).call(this));new Promise(function(res,rej){return _require.default(["./node_modules/@polymer/paper-spinner/paper-spinner.js"],res,rej)});new Promise(function(res,rej){return _require.default(["./node_modules/@lrnwebcomponents/img-pan-zoom/lib/img-loader.js"],res,rej)});var basePath=(0,_resolveUrl.pathFromUrl)(decodeURIComponent(meta.url)),location="".concat(basePath,"lib/openseadragon/build/openseadragon/openseadragon.min.js");window.addEventListener("es-bridge-openseadragon-loaded",_this._openseadragonLoaded.bind(babelHelpers.assertThisInitialized(_this)));window.ESGlobalBridge.requestAvailability();window.ESGlobalBridge.instance.load("openseadragon",location);return _this}babelHelpers.createClass(ImgPanZoom,[{key:"_openseadragonLoaded",value:function _openseadragonLoaded(){this.__openseadragonLoaded=!0;if(this.dzi){this._initOpenSeadragon()}}/**
   * life cycle
   */},{key:"connectedCallback",value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(ImgPanZoom.prototype),"connectedCallback",this).call(this);this.animationConfig={fade:{name:"fade-in-animation",node:this.shadowRoot.querySelector("#viewer")}};(0,_renderStatus.afterNextRender)(this,function(){// Init openseadragon if we are using a deep zoom image
if(this.dzi&&this.__openseadragonLoaded){// Add src changed observer
this._initOpenSeadragon()}})}/**
   * life cycle
   */},{key:"disconnectedCallback",value:function disconnectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(ImgPanZoom.prototype),"disconnectedCallback",this).call(this);window.removeEventListener("es-bridge-openseadragon-loaded",this._openseadragonLoaded.bind(this))}// Init openseadragon
},{key:"_initOpenSeadragon",value:function _initOpenSeadragon(){var _this2=this;setTimeout(function(){var tileSources=_this2.src;if(!_this2.dzi){tileSources={type:"image",url:_this2.src,buildPyramid:!1}}_this2.viewer=new OpenSeadragon({element:_this2.shadowRoot.querySelector("#viewer"),visibilityRatio:_this2.visibilityRatio,constrainDuringPan:_this2.constrainDuringPan,showNavigationControl:_this2.showNavigationControl,showNavigator:_this2.showNavigator,zoomPerClick:_this2.zoomPerClick,zoomPerScroll:_this2.zoomPerScroll,animationTime:_this2.animationTime,navPrevNextWrap:_this2.navPrevNextWrap,showRotationControl:_this2.showRotationControl,minZoomImageRatio:_this2.minZoomImageRatio,maxZoomPixelRatio:_this2.maxZoomPixelRatio,tileSources:tileSources});_this2.init=!0},100)}//Function to destroy the viewer and clean up everything created by OpenSeadragon.
},{key:"destroy",value:function destroy(){this.viewer.destroy()}// Zoom in
},{key:"zoomIn",value:function zoomIn(){// TODO: Replace with native openseadragon zoomIn
var currentZoom=this.viewer.viewport.getZoom(),maxZoom=this.viewer.viewport.getMaxZoom(),zoomTo=currentZoom+.7;if(zoomTo<maxZoom){this.viewer.viewport.zoomTo(zoomTo)}}// Zoom out
},{key:"zoomOut",value:function zoomOut(){// TODO: Replace with openseadragon native zoomOut
var currentZoom=this.viewer.viewport.getZoom(),minZoom=this.viewer.viewport.getMinZoom(),zoomTo=currentZoom-.7;if(zoomTo>minZoom){this.viewer.viewport.zoomTo(zoomTo)}else{if(minZoom!=currentZoom){this.resetZoom()}}}// reset zoom
},{key:"resetZoom",value:function resetZoom(){this.viewer.viewport.goHome()}},{key:"_srcChanged",value:function _srcChanged(){if(this.dzi&&this.init){// add tiled image
this._addTiledImage()}}// Add loaded images to viewer
},{key:"_loadedChanged",value:function _loadedChanged(){if(this.loaded){if(!this.init){this._initOpenSeadragon()}else{this._addImage()}}}},{key:"_addImage",value:function _addImage(){this.viewer.addSimpleImage({url:this.src,index:0,replace:!0})}},{key:"_addTiledImage",value:function _addTiledImage(){this.viewer.addTiledImage({tileSource:this.src,index:0,replace:!0})}}]);return ImgPanZoom}(_polymerElement.PolymerElement);_exports.ImgPanZoom=ImgPanZoom;window.customElements.define(ImgPanZoom.tag,ImgPanZoom)});