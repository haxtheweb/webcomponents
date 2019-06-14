import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";/**
 * `image-inspector`
 * `Zoom, Rotate, Mirror, Download, and View image`
 *
 * @demo demo/index.html
 */class ImageInspector extends PolymerElement{constructor(){super();import("./node_modules/@polymer/app-layout/app-layout.js");import("./node_modules/@lrnwebcomponents/img-pan-zoom/img-pan-zoom.js");import("./node_modules/@lrnwebcomponents/lrnsys-button/lrnsys-button.js");import("./node_modules/@polymer/iron-icons/iron-icons.js");import("./node_modules/@polymer/iron-icons/image-icons.js")}static get template(){return html`
      <style>
        :host {
          display: block;
          --image-inspector-background: #dddddd;
        }

        app-toolbar {
          width: 90%;
          background: var(--image-inspector-background);
          margin: 32px auto;
          z-index: 1;
          display: flex;
          text-align: center;
          justify-content: space-evenly;
        }

        lrnsys-button {
          display: inline-flex;
        }

        .top {
          top: 128px;
        }
      </style>

      <app-toolbar>
        <lrnsys-button
          alt="Zoom in"
          icon="zoom-in"
          on-click="zoomIn"
          hover-class="[[hoverClass]]"
        ></lrnsys-button>
        <lrnsys-button
          alt="Zoom out"
          icon="zoom-out"
          on-click="zoomOut"
          hover-class="[[hoverClass]]"
        ></lrnsys-button>
        <lrnsys-button
          alt="Rotate right"
          icon="image:rotate-right"
          on-click="rotateRight"
          hover-class="[[hoverClass]]"
        ></lrnsys-button>
        <lrnsys-button
          alt="Rotate left"
          icon="image:rotate-left"
          on-click="rotateLeft"
          hover-class="[[hoverClass]]"
        ></lrnsys-button>
        <lrnsys-button
          alt="Mirror image"
          icon="image:flip"
          on-click="mirrorImage"
          hover-class="[[hoverClass]]"
        ></lrnsys-button>
        <lrnsys-button
          alt="Open in new window"
          icon="launch"
          href="[[src]]"
          target="_blank"
          hover-class="[[hoverClass]]"
        ></lrnsys-button>
        <slot name="toolbar"></slot>
      </app-toolbar>
      <img-pan-zoom id="img" src="[[src]]"></img-pan-zoom>
      <slot></slot>
    `}static get tag(){return"image-inspector"}static get properties(){return{/**
       * Image rotation
       */degrees:{type:Number,value:0,reflectToAttribute:!0},/**
       * Image source.
       */src:{type:String,reflectToAttribute:!0},/**
       * Hover class for button styling
       */hoverClass:{type:String,value:"blue white-text"}}}connectedCallback(){super.connectedCallback();this.__img=this.shadowRoot.querySelector("#img")}/**
   * Rotate the image to the right.
   */rotateRight(){// spin 90
this.degrees+=90;this.__img.style.transform="rotate("+this.degrees+"deg)";this.__img.toggleClass("top")}/**
   * Rotate the image to the left.
   */rotateLeft(){// go back 90
this.degrees+=-90;this.__img.style.transform="rotate("+this.degrees+"deg)";this.__img.toggleClass("top")}/**
   * Flip the image.
   */mirrorImage(){if("scaleX(1)"===this.__img.style.transform){this.__img.style.transform="scaleX(-1)"}else{this.__img.style.transform="scaleX(1)"}}/**
   * Zoom in by calling  downstream function.
   */zoomIn(){this.__img.zoomIn()}/**
   * Zoom out by calling downstream function.
   */zoomOut(){this.__img.zoomOut()}}window.customElements.define(ImageInspector.tag,ImageInspector);export{ImageInspector};