import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { pathFromUrl } from "@polymer/polymer/lib/utils/resolve-url.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";

/**
 * `q-r`
 * `Polymer wrapper for a qr code.`
 *
 * @demo demo/index.html
 */
let QR = Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
      #link {
        visibility: hidden;
        opacity: 0;
      }
    </style>
    <qr-code
      id="qr"
      data$="[[data]]"
      modulesize$="[[modulesize]]"
      margin$="[[margin]]"
      format$="[[format]]"
    ></qr-code>
    <a href$="[[data]]" id="link">[[title]]</a>
  `,

  is: "q-r",
  behaviors: [HAXBehaviors.PropertiesBehaviors],

  properties: {
    /**
     * Data to code via QR code
     */
    data: {
      type: String
    },
    /**
     * Alternate title for the data
     */
    title: {
      type: String
    },
    /**
     * module size of the square
     */
    modulesize: {
      type: Number,
      value: 4
    },
    /**
     * Margin on the square
     */
    margin: {
      type: Number,
      value: 2
    },
    /**
     * format to output
     */
    format: {
      type: String,
      value: "png"
    }
  },

  /**
   * Attached to the DOM, now fire.
   */
  attached: function() {
    // Establish hax property binding
    let props = {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "QR Code",
        description: "A code to scan from a smartphone.",
        icon: "hardware:developer-board",
        color: "grey",
        groups: ["QR"],
        handles: [
          {
            type: "video",
            source: "data",
            title: "title"
          },
          {
            type: "image",
            source: "data",
            title: "title"
          },
          {
            type: "link",
            source: "data",
            title: "title"
          }
        ],
        meta: {
          author: "LRNWebComponents"
        }
      },
      settings: {
        quick: [
          {
            property: "data",
            title: "QR data",
            description: "Source of the data for the QR code.",
            inputMethod: "textfield",
            icon: "hardware:developer-board"
          },
          {
            property: "title",
            title: "Alternate title",
            description:
              "An alternate title to go to the source of the QR code.",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "modulesize",
            title: "Size",
            description: "Size of the QR code",
            inputMethod: "textfield",
            icon: "image:photo-size-select-small"
          },
          {
            property: "margin",
            title: "Margin",
            description: "Wrapper to the code.",
            inputMethod: "textfield",
            icon: "icons:settings-overscan"
          },
          {
            property: "format",
            title: "Output format",
            description: "Format to put it out.",
            inputMethod: "select",
            options: {
              png: "PNG",
              html: "HTML",
              svg: "SVG"
            },
            icon: "editor:bubble-chart"
          }
        ],
        configure: [
          {
            property: "data",
            title: "QR data",
            description: "Source of the data for the QR code.",
            inputMethod: "haxupload",
            icon: "hardware:developer-board"
          },
          {
            property: "title",
            title: "Alternate title",
            description:
              "An alternate title to go to the source of the QR code.",
            inputMethod: "alt",
            icon: "editor:title"
          },
          {
            property: "modulesize",
            title: "Size",
            description: "Size of the QR code",
            inputMethod: "number",
            icon: "image:photo-size-select-small"
          },
          {
            property: "margin",
            title: "Margin",
            description: "Wrapper to the code.",
            inputMethod: "number",
            icon: "icons:settings-overscan"
          },
          {
            property: "format",
            title: "Output format",
            description: "Format to put it out.",
            inputMethod: "select",
            options: {
              png: "PNG",
              html: "HTML",
              svg: "SVG"
            },
            icon: "editor:bubble-chart"
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(props);
  }
});

class QRCodeElement extends HTMLElement {
  constructor() {
    super();
    // method bindings
    this._defineProperty = this._defineProperty.bind(this);
    // Shadow DOM
    this.attachShadow({ mode: "open" });
    // Define Properties
    Object.keys(QRCodeElement.defaultAttributes).map(this._defineProperty);
    const name = "qr";
    const basePath = pathFromUrl(decodeURIComponent(import.meta.url));
    const location = `${basePath}lib/qr.js`;
    window.addEventListener(
      `es-bridge-${name}-loaded`,
      this._qrLoaded.bind(this)
    );
    window.ESGlobalBridge.requestAvailability();
    window.ESGlobalBridge.instance.load(name, location);
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
      margin: 4
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
      set: value => {
        this.setAttribute(attributeName, value);
      }
    });
  }
  getOptions() {
    let { modulesize, margin } = this;
    return {
      modulesize: modulesize !== null ? parseInt(modulesize) : modulesize,
      margin: margin !== null ? parseInt(margin) : margin
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
window.customElements.define("qr-code", QRCodeElement);
export { QRCodeElement };
export { QR };
