/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import { navigator } from "lit-element-router";
import "./elmsln-studio-modal.js";
import "./elmsln-studio-modal-button.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/image-icons.js";

/**
 * `elmsln-studio-zoom`
 * Navigation Link for ELMS:LN Studio
 *
 * @customElement elmsln-studio-zoom
 * @lit-html
 * @lit-element 
 */
class ElmslnStudioZoom extends navigator(LitElement) {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "elmsln-studio-zoom";
  }

  static get properties() {
    return {
      path: { type: String },
      prev: { type: Number, attribute: "prev" },
      next: { type: Number, attribute: "next" },
      src: { type: String },
      modal: { type: Object }
    };
  }
  static get styles() {
    return css`
      :host {
        display: block;
      }
      :host([hidden]) {
        display: none;
      }
    `;
  }
  constructor() {
    super();
    this.modal = window.SimpleModal.requestAvailability();
    this.path = "";
    this.src = "";
    this.prev = -1;
    this.next = -1;
    import("@lrnwebcomponents/img-pan-zoom/img-pan-zoom.js");
  }

  updated(changedProperties) {
    if(super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "src" && this.__img){ 
        this.__img.src = this.src;
        this.__img.resetZoom();
      }
    });
  }

  render() {
    return html`
      <elmsln-studio-modal id="zoom" @modal-button-click="${this.setModal}">
        <iron-icon
          aria-hidden="true"
          icon="zoom-in"
        ></iron-icon>
        <slot></slot>
      </elmsln-studio-modal>
    `;
  }
  setModal(){
    let zoom = this.shadowRoot.getElementById('zoom');
    this.__img = document.createElement('img-pan-zoom');
    this.__img.minZoomImageRatio = 1;
    this.__img.maxZoomPixelRatio = 3;
    this.__img.src = this.src;
    this.__img.style.height = "calc(90vh - 55px - 36px)";
    zoom.buttons = this._buttonGroup([
      this._buttonGroup([
        this._button('prev',e=>this.swapImg(this.prev,e),'chevron-left',true),
        this._buttonGroup([
          this._button('rotate counterclockwise',e=>this.rotateCCW(this.__img,e),'image:rotate-left'),
          this._button('rotate clockwise',e=>this.rotateCW(this.__img,e),'image:rotate-right')
        ],true,"flex-start"),
        this._buttonGroup([
          this._button('zoom in',e=>this.zoomIn(this.__img,e),'zoom-in'),
          this._button('zoom out',e=>this.zoomOut(this.__img,e),'zoom-out')
        ],true,"center"),
        this._buttonGroup([
          this._button('pan up',e=>this.panUp(this.__img,e),'arrow-upward'),
          this._button('pan down',e=>this.panDown(this.__img,e),'arrow-downward'),
          this._button('pan left',e=>this.panLeft(this.__img,e),'arrow-back'),
          this._button('pan right',e=>this.panRight(this.__img,e),'arrow-forward')
        ],true,"flex-end"),
        this._button('next',e=>this.swapImg(this.next,e),'chevron-right',true)
      ],true)
    ]);
    zoom.header = this._buttonGroup([this.__img]);
  }
  swapImg(query,e){
    console.log('swapImg',query,e);
    let submissions = this.closest('#primary'),
      button = submissions ? submissions.querySelector(`#zoom-${query}`) : false;
    console.log('button',button);
    if(button){
      this.prev = button.prev;
      this.next = button.next;
      this.src = button.src;
    }
  }
  rotateCCW(img,e){
    console.log('rotateCCW',img,e);
    img.rotate(-90);
  }
  rotateCW(img,e){
    console.log('rotateCW',img,e);
    img.rotate();
  }
  zoomIn(img,e){
    console.log('zoomIn',img,e);
    img.zoomIn(0.2);
  }
  zoomOut(img,e){
    console.log('zoomOut',img,e);
    img.zoomOut(0.2);
  }
  panUp(img,e){
    console.log('panUp',img,e);
    img.pan(0,0.2);
  }
  panDown(img,e){
    console.log('panDown',img,e);
    img.pan(0,-0.2);
  }
  panLeft(img,e){
    console.log('panLeft',img,e);
    img.pan(0.2,0);
  }
  panRight(img,e){
    console.log('panRight',img,e);
    img.pan(-0.2,0);
  }

  _buttonGroup(buttons,flex=false,justify){
    let div = document.createElement('div');
    if(flex) {
      div.style.display = "flex";
      div.style.alignItems = "stretch";
      div.style.justifyContent = justify || "space-between";
      div.style.flexWrap = "wrap";
    }
    if(justify) div.style.border = "1px solid #ddd";
    buttons.forEach(button=>div.appendChild(button));
    return div;
  }

  _button(text,onclick,icon,border=false){
    let button = document.createElement('elmsln-studio-modal-button');
    button.text = text;
    button.callback = onclick;
    button.icon = icon;
    button.border = border;
    if(text === "prev" || text === "next") {
      if(text === "prev") {
        button.align = "left";
        button.disabled = !this.prev;
      }
      if(text === "next") {
        button.align = "right";
        button.disabled = !this.next;
      }
      button.flexible = true;
    } else {
      button.hideText =  true;
    } 
    return button;
  }
  _buttonEvent(evt){
    /**
     * Fires when constructed, so that parent radio group can listen for it.
     *
     * @event 
     */
    this.dispatchEvent(
      new CustomEvent(evt, {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
  }
}
customElements.define("elmsln-studio-zoom", ElmslnStudioZoom);
export { ElmslnStudioZoom };
