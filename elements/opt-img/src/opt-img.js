/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { IntersectionObserverMixin } from "@lrnwebcomponents/intersection-element/lib/IntersectionObserverMixin.js";
/**
 * `opt-img`
 * `an optimized image delivery that is vanilla`
 *
 * @demo demo/index.html
 * @element opt-img
 */
class OptImg extends IntersectionObserverMixin(HTMLElement) {
  constructor() {
    super();
    this.alt = '';
    this.src = '';
    this.IOVisibleLimit = 0.1;
    this.IOThresholds = [0.0, 0.10, 0.25, 0.5, 0.75, 1.0];
    this.template = document.createElement("template");
    this._preconnect = document.createElement("link");
    this._preconnect.rel = "preconnect";
    this.innerHTML = null;
    this._loading = document.createElement("div");
    this._loading.innerHTML = this.loading;
    this.appendChild(this._loading);
  }
  /**
   * This is a convention, not the standard to return HTML of the element
   */
  get html() {
    return `<img src="${this.src}" height="${this.height}" width="${this.width}" alt="${this.alt}" decoding="async" loading="lazy" />`;
  }
  get loading() {
    return `
    <style>
    opt-img #dots {
      margin-bottom: 100px;
    }
    opt-img #dots #dot1{
      animation: load 1s infinite;
    }
    
    opt-img #dots #dot2{
      animation: load 1s infinite;
      animation-delay: 0.2s;
    }
    
    opt-img #dots #dot3{
      animation: load 1s infinite;
      animation-delay: 0.4s;
    }
    
    @keyframes load{
      0%{
        opacity: 0;
      }
      50%{
        opacity: 1;
      }
      100%{
        opacity: 0;
      }
    }
    </style>
    <svg id="dots" width="132px" height="58px" viewBox="0 0 132 58" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
          <g id="dots" sketch:type="MSArtboardGroup" fill="#A3A3A3">
              <circle id="dot1" sketch:type="MSShapeGroup" cx="25" cy="30" r="13"></circle>
              <circle id="dot2" sketch:type="MSShapeGroup" cx="65" cy="30" r="13"></circle>
              <circle id="dot3" sketch:type="MSShapeGroup" cx="105" cy="30" r="13"></circle>
          </g>
      </g>
    </svg>`;
  }
  /**
   * attributes to notice changes to
   */
  static get observedAttributes() {
    return ["src", "alt", "element-visible"];
  }
  /**
   * callback when any observed attribute changes
   */
  attributeChangedCallback(attr, oldValue, newValue) {
    if (['src','alt'].includes(attr)) {
      this[attr] = newValue;
      this.render();
    }
    else if (['element-visible'].includes(attr)) {
      this.render();
    }
    if (attr === 'src') {
      // preconnect domain
      this._preconnect.href = new URL(this.src).origin;
      document.head.appendChild(this._preconnect);
    }
  }
  set elementVisible(val) {
    if (val === false) {
      this.removeAttribute("element-visible");
    }
    else {
      this.setAttribute("element-visible", "element-visible");
    }
  }
  get elementVisible() {
    return this.getAttribute("element-visible");
  }
  /**
   * This is a convention, not the standard
   */
  static get tag() {
    return "opt-img";
  }
  /**
   * Render / rerender the shadowRoot
   */
  render() {
    if (this.elementVisible) {
      this.template.innerHTML = this.html;
      let i = new Image();
      i.onload = () => {
        this.style.height = i.height + 'px';
        this.style.width = i.width + 'px';
        this.height = i.height + 'px';
        this.width = i.width + 'px';
        this.appendChild(this.template.content);
        setTimeout(() => {
          setTimeout(() => {
            this._loading.remove();
          }, 0);
          this.style.height = '';
          this.style.width = '';
        }, 0);
      }
      i.src = this.src;
      this._preconnect.remove();
    }
  }
}
customElements.define(OptImg.tag, OptImg);
export { OptImg };
