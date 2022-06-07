import { MicroFrontend, MicroFrontendRegistry } from "@lrnwebcomponents/micro-frontend-registry/micro-frontend-registry.js";

export class SimpleImg extends HTMLElement {
  static get tag() {
    return 'simple-img';
  }

  constructor() {
    super();
    // simple-image
    // simple image conversion work
    const simpleImg = new MicroFrontend();
    // simple debugging support for vercel locally
    const base = window.location.origin.replace(/localhost:8(.*)/, "localhost:3000");
    simpleImg.endpoint = `${base}/api/media/image/manipulate`;
    simpleImg.name = "simple-img";
    simpleImg.title = "simple image manipulation";
    simpleImg.description = "manipulation";
    simpleImg.params = {
      src: 'image source',
      height: 'height in numbers',
      width: 'width in numbers',
      quality: '0-100, jpeg quality to reduce image by if jpeg',
      fit: 'how to crop if height and width are supplied (https://sharp.pixelplumbing.com/api-resize)',
      rotate: 'https://sharp.pixelplumbing.com/api-operation#rotate',
      format: 'png,jpg,gif,webp',
    };
    MicroFrontendRegistry.define(simpleImg);

    this.rendering = false;
    // progressive enhancement, tho less performant
    var img = this.querySelector("img");
    if (!img) {
      // performance minded prog enhancement
      if (this.querySelector("template") && this.querySelector("template").content.children[0] && this.querySelector("template").content.children[0].tagName === 'IMG') {
        img = this.querySelector("template").content.children[0];
      }
      else {
        img = {};
      }
    }
    // defaults, using img pulled in or default
    this.alt = img.alt || this.alt || '';
    this.src = img.src || this.src || '';
    this.loading = img.loading || this.loading || 'lazy';
    this.decoding = img.decoding || this.decoding || 'async';
    this.fetchpriority = img.fetchpriority || this.fetchpriority || 'high';
    this.width = parseInt(img.width || this.width || 300);
    this.height = parseInt(img.height || this.height || 200);
    console.log(this.src);
    // defaults on the wrapper element
    this.style.display = 'inline-block';
    this.style.width = this.width + 'px';
    this.style.height = this.height + 'px';
    // wipe anything that may be here from before as we'll replace with our own
    this.innerHTML = null;
    this.quality = this.quality || 80;    
  }

  // notice these changing
  static get observedAttributes() {
    return ['srcconverted', 'src', 'loading', 'fetchpriority', 'decoding', 'alt', 'quality', 'height', 'width']
  }

  simpleImgCallback(data) {
    /**
     * this is not how this API works
     * we want to point to the endpoint and it just do its thing
     * we can still access the API via the registry BUT we might
     * want to make a new API so that it can give you the address
     * to what it's going to call in GET format as opposed to fetching
     * the API.
     */
    this.srcconverted = data;
  }

  // rerender when we get hits on these important aspects
  attributeChangedCallback(attr, oldValue, newValue) {
    if (['width', 'height', 'quality', 'src'].includes(attr) && this.width && this.height && this.quality && this.src) {
      const params = {
        src: this.shadowRoot.querySelector('#src').value,
      };
      MicroFrontendRegistry.call('simple-img', params, this.simpleImgCallback.bind(this));

      
      this.srcconverted = new URL(this.baseurl).toString() + `?${new URLSearchParams({
        height: this.height,
        width: this.width,
        quality: this.quality,
        src: this.src,
      }).toString()}`;
    }
    // render when srcconverted is set
    if (attr === 'srcconverted' && this.src != '' && !this.rendering) {
      this.rendering = true;
      // loads the image in the background in-case of quality change
      let i = new Image();
      i.onload = () => {
        this.render();
      };
      i.onerror = () => {
        this.rendering = false;
      };
      i.src = this.srcconverted;
    }
  }

  render() {
    this.innerHTML = null;
    this.innerHTML = `
    <img 
      src="${this.srcconverted}" 
      height="${this.height}" 
      width="${this.width}" 
      alt="${this.alt}" 
      fetchpriority="${this.fetchpriority}"
      decoding="${this.decoding}"
      loading="${this.loading}"
    />`;
    this.rendering = false;
  }

  // getter and setter palooza

  get endpoint() {
    return this.getAttribute('endpoint');
  }

  set endpoint(val) {
    this.setAttribute('endpoint', val);
  }

  get height() {
    return this.getAttribute('height');
  }

  set height(val) {
    this.setAttribute('height', val);
  }

  get width() {
    return this.getAttribute('width');
  }

  set width(val) {
    this.setAttribute('width', val);
  }

  get src() {
    return this.getAttribute('src');
  }

  set src(val) {
    this.setAttribute('src', val);
  }

  set srcconverted(val) {
    this.setAttribute('srcconverted', val);
  }

  get srcconverted() {
    return this.getAttribute('srcconverted');
  }

  set loading(val) {
    this.setAttribute('loading', val);
  }

  get loading() {
    return this.getAttribute('loading');
  }

  set fetchpriority(val) {
    this.setAttribute('fetchpriority', val);
  }

  get fetchpriority() {
    return this.getAttribute('fetchpriority');
  }

  get quality() {
    return this.getAttribute('quality');
  }

  set quality(val) {
    this.setAttribute('quality', val);
  }

  get alt() {
    return this.getAttribute('alt');
  }

  set alt(val) {
    this.setAttribute('alt', val);
  }

  get baseurl() {
    return this.getAttribute('baseurl');
  }

  set baseurl(val) {
    this.setAttribute('baseurl', val);
  }

  get decoding() {
    return this.getAttribute('decoding');
  }

  set decoding(val) {
    this.setAttribute('decoding', val);
  }
}

customElements.define(SimpleImg.tag, SimpleImg);