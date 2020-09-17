import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";

class QRCodeElement extends HTMLElement {
  constructor() {
    super();
    // method bindings
    this._defineProperty = this._defineProperty.bind(this);
    // Shadow DOM
    this.attachShadow({ mode: "open" });
    // Define Properties
    Object.keys(QRCodeElement.defaultAttributes).map(this._defineProperty);
    const basePath = this.pathFromUrl(decodeURIComponent(import.meta.url));
    const location = `${basePath}/qr.js`;
    window.addEventListener(`es-bridge-qr-loaded`, this._qrLoaded.bind(this));
    window.ESGlobalBridge.requestAvailability();
    window.ESGlobalBridge.instance.load("qr", location);
  }
  // simple path from a url modifier
  pathFromUrl(url) {
    return url.substring(0, url.lastIndexOf("/") + 1);
  }
  disconnectedCallback() {
    window.removeEventListener(
      `es-bridge-qr-loaded`,
      this._qrLoaded.bind(this)
    );
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
  }
  static get tag() {
    return "qr-code";
  }
  _qrLoaded() {
    // q-r library has loaded, now try to generate
    this.generate();
  }
  static get defaultAttributes() {
    return {
      data: null,
      format: "png",
      modulesize: 5,
      margin: 4,
    };
  }
  static get observedAttributes() {
    return Object.keys(QRCodeElement.defaultAttributes);
  }
  // LifeCycle Callbacks
  //
  attributeChangedCallback(attributeName, oldValue, newValue) {
    let fn = this[attributeName + "Changed"];
    if (fn && typeof fn === "function") {
      fn.call(this, oldValue, newValue);
    }
    if (window.ESGlobalBridge.imports["qr"]) {
      this.generate();
    }
  }
  // Methods
  //
  _defineProperty(attributeName) {
    Object.defineProperty(this, attributeName, {
      get: () => {
        let value = this.getAttribute(attributeName);
        return value === null
          ? QRCodeElement.defaultAttributes[attributeName]
          : value;
      },
      set: (value) => {
        this.setAttribute(attributeName, value);
      },
    });
  }
  getOptions() {
    let { modulesize, margin } = this;
    return {
      modulesize: modulesize !== null ? parseInt(modulesize) : modulesize,
      margin: margin !== null ? parseInt(margin) : margin,
    };
  }
  generate() {
    if (this.data !== null) {
      if (this.format === "png") {
        this.generatePNG();
      } else if (this.format === "html") {
        this.generateHTML();
      } else if (this.format === "svg") {
        this.generateSVG();
      } else {
        this.shadowRoot.innerHTML =
          "<div>qr-code: " + this.format + " not supported!</div>";
      }
    } else {
      this.shadowRoot.innerHTML = "<div>qr-code: no data!</div>";
    }
  }
  generatePNG() {
    try {
      let img = document.createElement("img");
      img.src = window.QRCode.generatePNG(this.data, this.getOptions());
      this.clear();
      this.shadowRoot.appendChild(img);
    } catch (e) {
      this.shadowRoot.innerHTML = "<div>qr-code: no canvas support!</div>";
    }
  }
  generateHTML() {
    let div = window.QRCode.generateHTML(this.data, this.getOptions());
    this.clear();
    this.shadowRoot.appendChild(div);
  }
  generateSVG() {
    let div = window.QRCode.generateSVG(this.data, this.getOptions());
    this.clear();
    this.shadowRoot.appendChild(div);
  }
  clear() {
    while (this.shadowRoot.lastChild) {
      this.shadowRoot.removeChild(this.shadowRoot.lastChild);
    }
  }
}
window.customElements.define(QRCodeElement.tag, QRCodeElement);
export { QRCodeElement };
