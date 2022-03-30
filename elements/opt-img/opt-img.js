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
    // alt as nothing for decorative purposes if not set
    this.alt = '';
    this.src = '';
    // 10% of image visible === visible
    this.IOVisibleLimit = 0.1;
    // these help w/ threashold being set
    this.IOThresholds = [0.0, 0.10, 0.25, 0.5, 0.75, 1.0];
    this.template = document.createElement("template");
    // preconnect the domain early on
    this._preconnect = document.createElement("link");
    this._preconnect.rel = "preconnect";
    // wipe anything that may be here from before
    this.innerHTML = null;
    // create a 'loading' container
    this._loading = document.createElement("div");
    this._loading.innerHTML = this.loading;
    this.appendChild(this._loading);
  }
  // return a basic img tag w/ values printed in
  get html() {
    return `<img src="${this.src}" height="${this.height}" width="${this.width}" alt="${this.alt}" decoding="async" loading="lazy" />`;
  }
  // get a basic loading svg that's styled
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
   * only update on the 3 values we care about changing
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
      // force a repaint
      this.render();
    }
    else if (['element-visible'].includes(attr)) {
      this.render();
    }
    // source being set, let's preconnect the domain prior to usage
    if (attr === 'src') {
      // preconnect domain
      this._preconnect.href = new URL(this.src).origin;
      document.head.appendChild(this._preconnect);
    }
  }
  // peg attribute to property change internally
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
   * Render for guts of the tag
   */
  render() {
    // only render if we're visible
    if (this.elementVisible) {
      // make a fake image
      let i = new Image();
      // when we load, we'll have the props about it
      i.onload = () => {
        // subtle, but these 4 lines help reduce the jarring of painting the image
        // by setting the height/width quickly on the container + img tag
        this.style.height = i.height + 'px';
        this.style.width = i.width + 'px';
        this.height = i.height + 'px';
        this.width = i.width + 'px';
        // render the actual image happens in this block
        this.template.innerHTML = this.html;
        this.appendChild(this.template.content);
        // delay a cycle, undo the style height/width on container
        // and remove the loading element. this delay helps reduce layout jar
        setTimeout(() => {
          this.style.height = '';
          this.style.width = '';
          this._loading.remove();
        }, 0);
      }
      // setting the src triggers the image to be requested
      i.src = this.src;
      // delete the preconnect tag in the head for clean up
      this._preconnect.remove();
    }
  }
}
customElements.define(OptImg.tag, OptImg);
export { OptImg };
