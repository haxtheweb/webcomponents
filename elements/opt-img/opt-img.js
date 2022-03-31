/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

/**
 * `opt-img`
 * `an optimized image delivery that is vanilla`
 *
 * @demo demo/index.html
 * @element opt-img
 */
class OptImg extends HTMLElement {
  constructor() {
    super();
    // for translation support if globally managed
    this.t = this.t || {};
    this.t.imageLoading = "Image loading..";
    // alt as nothing for decorative purposes if not set
    this.alt = '';
    this.src = '';
    this.width = "300px";
    this.height = "200px";
    // see if we have anything to pull data from light dom
    if (this.querySelector("img")) {
      const img = this.querySelector("img");
      this.alt = img.alt || '';
      this.src = img.src || '';
      this.width = img.width || "300px";
      this.height = img.height || "200px";
    }
    // wipe anything that may be here from before
    this.innerHTML = null;
    // create a 'loading' container
    this._loading = document.createElement("div");
    this._loading.style.height = this.height;
    this._loading.style.width = this.width;
    this._loading.innerHTML = this.loading;
    this.appendChild(this._loading);
    // used for flipping visibility status to change what loads
    this.loadingvisible = false;
    this.template = document.createElement("template");
    // preconnect the domain early on
    this._preconnect = document.createElement("link");
    this._preconnect.rel = "preconnect";
  }
  handleIntersectionCallback(entries) {
    super.handleIntersectionCallback(entries);
    for (let entry of entries) {
      let ratio = Number(entry.intersectionRatio).toFixed(2);
      if (ratio >= .1 && this._preconnect.rel != "preload" && !this.loadingvisible) {
        // preload the image via header request
        this._preconnect.remove();
        this._preconnect = document.createElement("link");
        this._preconnect.rel = "preload";
        this._preconnect.href = this.src;
        this._preconnect.as = "image";
        document.head.appendChild(this._preconnect);
      }
    }
  }
  // return a basic img tag w/ values printed in
  get html() {
    return `<img 
    src="${this.src}" 
    height="${this.height}" 
    width="${this.width}" 
    alt="${this.alt}" 
    decoding="async" 
    loading="lazy"
    fetchpriority="high" />`;
  }
  // get a basic loading svg that's styled
  get loading() {
    return `
    <style>
    opt-img {
      display: inline;
    }
    opt-img #dots circle{
      animation: load 1s infinite;
    }
    
    opt-img #dots #dot2{
      animation-delay: 0.2s;
    }
    
    opt-img #dots #dot3{
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
    </svg>
    <div aria-busy="true" aria-live="polite">${this.t.imageLoading}</div>
    `;
  }
  /**
   * only update on the 3 values we care about changing
   */
  static get observedAttributes() {
    return ["src", "alt", "loadingvisible"];
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
    else if (['loadingvisible'].includes(attr)) {
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
  set loadingvisible(val) {
    if (val === false) {
      this.removeAttribute("loadingvisible");
    }
    else {
      this.setAttribute("loadingvisible", "loadingvisible");
    }
  }
  get loadingvisible() {
    return this.getAttribute("loadingvisible");
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
    if (this.loadingvisible) {
      // make a fake image
      let i = new Image();
      i.fetchpriority = "high";
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
  /**
     * HTMLElement specification
     */
   connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    window.dispatchEvent(
      new CustomEvent("i18n-manager-register-element", {
        detail: {
          context: this,
          namespace: "opt-img",
          localesPath: new URL("./locales", import.meta.url).href,
          updateCallback: "render",
          locales: ["es"],
        },
      })
    );
    // setup the intersection observer, only if we are not visible
    if (!this.loadingvisible) {
      this.intersectionObserver = new IntersectionObserver(
        this.handleIntersectionCallback.bind(this),
        {
          root: null,
          rootMargin: "0px",
          threshold: [0.0, 0.25, 0.5, 0.75, 1.0], // when to return records
          delay: 500, // how often to query this
        }
      );
      this.intersectionObserver.observe(this);
    }
  }
  /**
   * HTMLElement specification
   */
  disconnectedCallback() {
    // if we have an intersection observer, disconnect it
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      // edge case where element is moved in the DOM so that
      // connnected will set the event back up accurately
      this.loadingvisible = false;
    }
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
  }
  /**
   * Very basic IntersectionObserver callback which will set loadingvisible to true
   */
  handleIntersectionCallback(entries) {
    for (let entry of entries) {
      let ratio = Number(entry.intersectionRatio).toFixed(2);
      // ensure ratio is higher than our limit before trigger visibility
      // call when 1/2 of our loader is visible
      if (ratio >= .25) {
        this.loadingvisible = true;
        // remove the observer if we've reached our target of being visible
        this.intersectionObserver.disconnect();
      } else {
        this.loadingvisible = false;
      }
    }
  }
}
customElements.define(OptImg.tag, OptImg);
export { OptImg };