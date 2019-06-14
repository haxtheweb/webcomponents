/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{dom}from"./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";/**
 * `media-video`
 * `Video wrapper class`
 *
 * @demo demo/index.html
 */class MediaVideo extends PolymerElement{static get template(){return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <slot></slot>
    `}static get tag(){return"media-video"}static get properties(){return{}}ready(){super.ready();const videoSrc=this.querySelector("*[data-mediavideo-src]");this.addEventListener("click",e=>{e.stopPropagation();const target=dom(e).localTarget,videoContainer=this.querySelector(".mediavideo"),videoPoster=this.querySelector(".mediavideo-button-container"),videoSrc=this.querySelector("*[data-mediavideo-src]");videoPoster.classList.toggle("mediavideo-button-display");// Add the is-open tag to the base element.
videoContainer.classList.toggle("mediavideo--is-open");if(target.classList.contains("poster--image")||target.classList.contains("mediavideo-icon")){// Give the animation enough time to complete.
setTimeout(()=>{this._startIframeVideo(videoSrc)},500)}else{this._stopIframeVideo(videoSrc)}})}disconnectedCallback(){this.removeEventListener("click",e=>{e.stopPropagation();const target=dom(e).localTarget,videoContainer=this.querySelector(".mediavideo"),videoPoster=this.querySelector(".mediavideo-button-container"),videoSrc=this.querySelector("*[data-mediavideo-src]");videoPoster.classList.toggle("mediavideo-button-display");// Add the is-open tag to the base element.
videoContainer.classList.toggle("mediavideo--is-open");if(target.classList.contains("poster--image")||target.classList.contains("mediavideo-icon")){// Give the animation enough time to complete.
setTimeout(()=>{this._startIframeVideo(videoSrc)},500)}else{this._stopIframeVideo(videoSrc)}});super.disconnectedCallback()}_startIframeVideo(video){// Start the iframe videos.
var videoIframeSrc=video.dataset.mediavideoSrc;// If it's a youtube or vimeo video then add an autoplay attr on the end
// of the url.
if(0<=videoIframeSrc.indexOf("youtube")||0<=videoIframeSrc.indexOf("vimeo")){// Find out if we need to fstart the query parameter or add
// on to an existing one.
if(0<=videoIframeSrc.indexOf("?")){videoIframeSrc+="&autoplay=1"}else{videoIframeSrc+="?autoplay=1"}}// Add it to the source attribute to load the video.
video.setAttribute("src",videoIframeSrc)}_stopIframeVideo(video){video.setAttribute("src","")}}window.customElements.define(MediaVideo.tag,MediaVideo);export{MediaVideo};