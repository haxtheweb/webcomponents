import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `q-r`
 * `Polymer wrapper for a qr code.`
 *
 * @demo demo/index.html
 * @element q-r
 */
class QR extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        #link {
          visibility: hidden;
          opacity: 0;
        }
      `,
    ];
  }
  constructor() {
    super();
    this.modulesize = 4;
    this.margin = 2;
    this.format = "png";
    import("@lrnwebcomponents/q-r/lib/qr-code.js");
  }
  render() {
    return html`
      <qr-code
        id="qr"
        data="${this.data}"
        modulesize="${this.modulesize}"
        margin="${this.margin}"
        format="${this.format}"
      ></qr-code>
      <a href="${this.data}" id="link">${this.title}</a>
    `;
  }
  static get tag() {
    return "q-r";
  }
  static get properties() {
    return {
      /**
       * Data to code via QR code
       */
      data: {
        type: String,
      },
      /**
       * Alternate title for the data
       */
      title: {
        type: String,
      },
      /**
       * module size of the square
       */
      modulesize: {
        type: Number,
      },
      /**
       * Margin on the square
       */
      margin: {
        type: Number,
      },
      /**
       * format to output
       */
      format: {
        type: String,
      },
    };
  }
  /**
   * Attached to the DOM, now fire.
   */
  static get haxProperties() {
    // Establish hax property binding
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "QR Code",
        description: "A code to scan from a smartphone.",
        icon: "hax:qr-code",
        color: "grey",
        groups: ["QR"],
        handles: [
          {
            type: "video",
            source: "data",
            title: "title",
          },
          {
            type: "image",
            source: "data",
            title: "title",
          },
          {
            type: "link",
            source: "data",
            title: "title",
          },
        ],
        meta: {
          author: "ELMS:LN",
        },
      },
      settings: {
        quick: [
          {
            property: "data",
            title: "QR data",
            description: "Source of the data for the QR code.",
            inputMethod: "textfield",
            icon: "hardware:developer-board",
          },
          {
            property: "title",
            title: "Alternate title",
            description:
              "An alternate title to go to the source of the QR code.",
            inputMethod: "textfield",
            icon: "editor:title",
          },
          {
            property: "modulesize",
            title: "Size",
            description: "Size of the QR code",
            inputMethod: "textfield",
            icon: "image:photo-size-select-small",
          },
          {
            property: "margin",
            title: "Margin",
            description: "Wrapper to the code.",
            inputMethod: "textfield",
            icon: "icons:settings-overscan",
          },
          {
            property: "format",
            title: "Output format",
            description: "Format to put it out.",
            inputMethod: "select",
            options: {
              png: "PNG",
              html: "HTML",
              svg: "SVG",
            },
            icon: "editor:bubble-chart",
          },
        ],
        configure: [
          {
            property: "data",
            title: "QR data",
            description: "Source of the data for the QR code.",
            inputMethod: "haxupload",
            icon: "hardware:developer-board",
          },
          {
            property: "title",
            title: "Alternate title",
            description:
              "An alternate title to go to the source of the QR code.",
            inputMethod: "alt",
            icon: "editor:title",
          },
          {
            property: "modulesize",
            title: "Size",
            description: "Size of the QR code",
            inputMethod: "number",
            icon: "image:photo-size-select-small",
          },
          {
            property: "margin",
            title: "Margin",
            description: "Wrapper to the code.",
            inputMethod: "number",
            icon: "icons:settings-overscan",
          },
          {
            property: "format",
            title: "Output format",
            description: "Format to put it out.",
            inputMethod: "select",
            options: {
              png: "PNG",
              html: "HTML",
              svg: "SVG",
            },
            icon: "editor:bubble-chart",
          },
        ],
        advanced: [],
      },
    };
  }
}
window.customElements.define(QR.tag, QR);
export { QR };
