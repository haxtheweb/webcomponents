define(["exports","meta","./node_modules/@polymer/polymer/polymer-legacy.js","./node_modules/@polymer/polymer/lib/utils/resolve-url.js","./node_modules/@lrnwebcomponents/es-global-bridge/es-global-bridge.js","./lib/img-loader.js"],function(_exports,meta,_polymerLegacy,_resolveUrl,_esGlobalBridge,_imgLoader){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.ImgPanZoom=void 0;meta=babelHelpers.interopRequireWildcard(meta);function _templateObject_b95c08a06a8211e9831a0d3380216660(){var data=babelHelpers.taggedTemplateLiteral(["\n    <style>\n      :host {\n        display: block;\n        position: relative;\n        height: 500px;\n      }\n      #viewer {\n        position: relative;\n        height: 100%;\n        width: 100%;\n      }\n\n      paper-spinner-lite {\n        opacity: 0;\n        display: block;\n        transition: opacity 700ms;\n        position: absolute;\n        margin: auto;\n        top: 0;\n        left: 0;\n        bottom: 0;\n        right: 0;\n        z-index: 1;\n        height: 70px;\n        width: 70px;\n        --paper-spinner-color: var(--img-pan-zoom-spinner-color, #2196f3);\n        --paper-spinner-stroke-width: var(--img-pan-zoom-spinner-width, 5px);\n        @apply --img-pan-zoom-spinner;\n      }\n      paper-spinner-lite[active] {\n        opacity: 1;\n      }\n    </style>\n\n    <!-- Only preload regular images -->\n    <template is=\"dom-if\" if=\"[[!dzi]]\">\n      <paper-spinner-lite\n        hidden$=\"[[hideSpinner]]\"\n        active=\"[[loading]]\"\n      ></paper-spinner-lite>\n      <img-loader\n        loaded=\"{{loaded}}\"\n        loading=\"{{loading}}\"\n        src=\"[[src]]\"\n      ></img-loader>\n    </template>\n\n    <!-- Openseadragon -->\n    <div id=\"viewer\"></div>\n  "]);_templateObject_b95c08a06a8211e9831a0d3380216660=function _templateObject_b95c08a06a8211e9831a0d3380216660(){return data};return data}/**
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
*/var ImgPanZoom=(0,_polymerLegacy.Polymer)({_template:(0,_polymerLegacy.html)(_templateObject_b95c08a06a8211e9831a0d3380216660()),is:"img-pan-zoom",properties:{// Image source
src:{type:String},// Set to true if you are using a deep zoom image
dzi:{type:Boolean,value:!1},// Fade in new items added to the viewer
fadeIn:{type:Boolean,value:!0},// loading
loading:{type:Boolean,readonly:!0,notify:!0},// hides spinner
hideSpinner:{type:Boolean,value:!1},// loaded
loaded:{type:Boolean,readonly:!0,notify:!0,observer:"_loadedChanged"},// Set to false to prevent the appearance of the default navigation controls. Note that if set to false, the customs buttons set by the options zoomInButton, zoomOutButton etc, are rendered inactive.
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
visibilityRatio:{type:Number,value:1}},created:function created(){var name="openseadragon",basePath=(0,_resolveUrl.pathFromUrl)(decodeURIComponent(meta.url)),location="".concat(basePath,"lib/openseadragon/build/openseadragon/openseadragon.js");window.addEventListener("es-bridge-".concat(name,"-loaded"),this._openseadragonLoaded.bind(this));window.ESGlobalBridge.requestAvailability();window.ESGlobalBridge.instance.load(name,location)},_openseadragonLoaded:function _openseadragonLoaded(){this.__openseadragonLoaded=!0;if(this.dzi){this._initOpenSeadragon()}},ready:function ready(){this.animationConfig={fade:{name:"fade-in-animation",node:this.$.viewer}};// Init openseadragon if we are using a deep zoom image
if(this.dzi&&this.__openseadragonLoaded){// Add src changed observer
this._initOpenSeadragon()}},// Init openseadragon
_initOpenSeadragon:function _initOpenSeadragon(){var _this=this;setTimeout(function(){var tileSources=_this.src;if(!_this.dzi){tileSources={type:"image",url:_this.src,buildPyramid:!1}}_this.viewer=new OpenSeadragon({element:_this.$.viewer,visibilityRatio:_this.visibilityRatio,constrainDuringPan:_this.constrainDuringPan,showNavigationControl:_this.showNavigationControl,showNavigator:_this.showNavigator,zoomPerClick:_this.zoomPerClick,zoomPerScroll:_this.zoomPerScroll,animationTime:_this.animationTime,navPrevNextWrap:_this.navPrevNextWrap,showRotationControl:_this.showRotationControl,minZoomImageRatio:_this.minZoomImageRatio,maxZoomPixelRatio:_this.maxZoomPixelRatio,tileSources:tileSources});_this.init=!0},100)},//Function to destroy the viewer and clean up everything created by OpenSeadragon.
destroy:function destroy(){this.viewer.destroy()},// Zoom in
zoomIn:function zoomIn(){// TODO: Replace with native openseadragon zoomIn
var currentZoom=this.viewer.viewport.getZoom(),maxZoom=this.viewer.viewport.getMaxZoom(),zoomTo=currentZoom+.7;if(zoomTo<maxZoom){this.viewer.viewport.zoomTo(zoomTo)}},// Zoom out
zoomOut:function zoomOut(){// TODO: Replace with openseadragon native zoomOut
var currentZoom=this.viewer.viewport.getZoom(),minZoom=this.viewer.viewport.getMinZoom(),zoomTo=currentZoom-.7;if(zoomTo>minZoom){this.viewer.viewport.zoomTo(zoomTo)}else{if(minZoom!=currentZoom){this.resetZoom()}}},// reset zoom
resetZoom:function resetZoom(){this.viewer.viewport.goHome()},_srcChanged:function _srcChanged(){if(this.dzi&&this.init){// add tiled image
this._addTiledImage()}},// Add loaded images to viewer
_loadedChanged:function _loadedChanged(){if(this.loaded){if(!this.init){this._initOpenSeadragon()}else{this._addImage()}}},_addImage:function _addImage(){this.viewer.addSimpleImage({url:this.src,index:0,replace:!0})},_addTiledImage:function _addTiledImage(){this.viewer.addTiledImage({tileSource:this.src,index:0,replace:!0})}});_exports.ImgPanZoom=ImgPanZoom});