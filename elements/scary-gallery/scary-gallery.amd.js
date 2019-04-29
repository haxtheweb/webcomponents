define(["exports","./node_modules/@polymer/polymer/polymer-legacy.js","./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js","./node_modules/@polymer/polymer/lib/utils/flattened-nodes-observer.js","./lib/scary-image.js"],function(_exports,_polymerLegacy,_polymerDom,_flattenedNodesObserver,_scaryImage){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.ScaryGallery=void 0;function _templateObject_f3be8ed06a8411e980832161c3199b3a(){var data=babelHelpers.taggedTemplateLiteral(["\n    <style>\n      :host {\n        width: 100%;\n        display: flex;\n        flex-wrap: wrap;\n      }\n    </style>\n    <slot></slot>\n  "]);_templateObject_f3be8ed06a8411e980832161c3199b3a=function _templateObject_f3be8ed06a8411e980832161c3199b3a(){return data};return data}/**
`<scary-gallery>` will (try to) layout any of its `<scary-image>` children
to make best use of available space, and rearranges the images, when the
size changes.

Sample usage:
```
<scary-gallery>
  <scary-image src="img1.jpg"></scary-image>
  <scary-image src="img2.jpg"></scary-image>
  <scary-image src="img3.jpg"></scary-image>
  <scary-image src="img4.jpg"></scary-image>
  <scary-image src="img5.jpg"></scary-image>
  <scary-image src="img6.jpg"></scary-image>
</scary-gallery>
```

Disclaimer:

Work in progress, the algorithm to layout the images is far from perfect.

* @demo demo/index.html
*/var ScaryGallery=(0,_polymerLegacy.Polymer)({_template:(0,_polymerLegacy.html)(_templateObject_f3be8ed06a8411e980832161c3199b3a()),is:"scary-gallery",properties:{/**
     * Minimum height of photos, unless they are too wide to fit.
     */minHeight:{type:Number,value:200},/**
     * Spacing between the images in pixels
     */gap:{type:Number,value:4}},observers:["_init(minHeight, gap)"],attached:function attached(){this._observer=new _flattenedNodesObserver.FlattenedNodesObserver(this,this._init);this._boundResize=this._resize.bind(this);window.addEventListener("resize",this._boundResize)},detached:function detached(){(0,_polymerDom.dom)(this).unobserveNodes(this._observer);window.removeEventListener("resize",this._boundResize)},_init:function _init(){this.debounce("init",function(){this._firstResize=!0;this._children=Array.prototype.slice.call((0,_polymerDom.dom)(this).querySelectorAll("scary-image"));this._resize()},50)},_resize:function _resize(){this.debounce("resize",function(){var loaded=!0,rows=[],row=[],rowWidth=0;this._maxWidth=this.offsetWidth;this._children.forEach(function(img){img.style.margin=(this.gap/2).toString(10)+"px";if(img.loaded){var width=this.minHeight/img.naturalHeight*img.naturalWidth+this.gap;if(rowWidth+width>this._maxWidth){if(0<row.length){rows.push({images:row,width:rowWidth});row=[]}rowWidth=0}rowWidth+=width;img.tmpWidth=width;row.push(img)}else{loaded=!1}}.bind(this));if(0<row.length){rows.push({images:row,width:rowWidth})}rows.forEach(function(row){var totalGap=row.images.length*this.gap,targetWidth=this._maxWidth-totalGap,rowWidth=row.width-totalGap,targetHeight=this.minHeight*targetWidth/rowWidth;row.images.forEach(function(img){img.height=targetHeight;img.width=targetHeight/img.naturalHeight*img.naturalWidth}.bind(this))}.bind(this));if(!loaded){this._resize()}if(loaded&&this._firstResize){// Unfortunately there is no way (I know of) to detect size changes
// because of scrollbars appearing after the initial load.
// Therefore I trigger a second _resize() manually here.
this._firstResize=!1;this._resize()}},50)}});_exports.ScaryGallery=ScaryGallery});