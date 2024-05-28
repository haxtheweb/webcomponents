import "@haxtheweb/es-global-bridge/es-global-bridge.js";

class QRCodeElement extends HTMLElement {
  constructor() {
    super();
    this.windowControllers = new AbortController();
    // method bindings
    this._defineProperty = this._defineProperty.bind(this);
    // Shadow DOM
    this.attachShadow({ mode: "open" });
    // Define Properties
    Object.keys(QRCodeElement.defaultAttributes).map(this._defineProperty);
    const location = new URL("./qr.js", import.meta.url).href;
    globalThis.addEventListener(
      `es-bridge-qr-loaded`,
      this._qrLoaded.bind(this),
      {
        signal: this.windowControllers.signal,
      },
    );
    globalThis.ESGlobalBridge.requestAvailability().load("qr", location);
  }
  disconnectedCallback() {
    this.windowControllers.abort();
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
    if (
      globalThis.ESGlobalBridge.requestAvailability().imports["qr"] === true
    ) {
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
      let img = globalThis.document.createElement("img");
      img.src = globalThis.QRCode.generatePNG(this.data, this.getOptions());
      this.clear();
      this.shadowRoot.appendChild(img);
    } catch (e) {
      this.shadowRoot.innerHTML = "<div>qr-code: no canvas support!</div>";
    }
  }
  generateHTML() {
    let div = globalThis.QRCode.generateHTML(this.data, this.getOptions());
    this.clear();
    this.shadowRoot.appendChild(div);
  }
  generateSVG() {
    let div = globalThis.QRCode.generateSVG(this.data, this.getOptions());
    this.clear();
    this.shadowRoot.appendChild(div);
  }
  clear() {
    while (this.shadowRoot.lastChild) {
      this.shadowRoot.removeChild(this.shadowRoot.lastChild);
    }
  }
}
customElements.define(QRCodeElement.tag, QRCodeElement);
export { QRCodeElement };
