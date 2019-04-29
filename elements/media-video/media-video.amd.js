define(["exports","./node_modules/@polymer/polymer/polymer-legacy.js","./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js"],function(_exports,_polymerLegacy,_polymerDom){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.MediaVideo=void 0;function _templateObject_9f9489906a8411e9b86ffb3623164daa(){var data=babelHelpers.taggedTemplateLiteral(["\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <slot></slot>\n  "]);_templateObject_9f9489906a8411e9b86ffb3623164daa=function _templateObject_9f9489906a8411e9b86ffb3623164daa(){return data};return data}/**
 * `media-video`
 * `Video wrapper class`
 *
 * @demo demo/index.html
 */var MediaVideo=(0,_polymerLegacy.Polymer)({_template:(0,_polymerLegacy.html)(_templateObject_9f9489906a8411e9b86ffb3623164daa()),is:"media-video",behaviors:[],properties:{},ready:function ready(){var _this=this,videoSrc=this.querySelector("*[data-mediavideo-src]");this.addEventListener("click",function(e){e.stopPropagation();var target=(0,_polymerDom.dom)(e).localTarget,videoContainer=_this.querySelector(".mediavideo"),videoPoster=_this.querySelector(".mediavideo-button-container"),videoSrc=_this.querySelector("*[data-mediavideo-src]");videoPoster.classList.toggle("mediavideo-button-display");// Add the is-open tag to the base element.
videoContainer.classList.toggle("mediavideo--is-open");if(target.classList.contains("poster--image")||target.classList.contains("mediavideo-icon")){// Give the animation enough time to complete.
setTimeout(function(){_this._startIframeVideo(videoSrc)},500)}else{_this._stopIframeVideo(videoSrc)}})},_startIframeVideo:function _startIframeVideo(video){// Start the iframe videos.
var videoIframeSrc=video.dataset.mediavideoSrc;// If it's a youtube or vimeo video then add an autoplay attr on the end
// of the url.
if(0<=videoIframeSrc.indexOf("youtube")||0<=videoIframeSrc.indexOf("vimeo")){// Find out if we need to fstart the query parameter or add
// on to an existing one.
if(0<=videoIframeSrc.indexOf("?")){videoIframeSrc+="&autoplay=1"}else{videoIframeSrc+="?autoplay=1"}}// Add it to the source attribute to load the video.
video.setAttribute("src",videoIframeSrc)},_stopIframeVideo:function _stopIframeVideo(video){video.setAttribute("src","")}});_exports.MediaVideo=MediaVideo});