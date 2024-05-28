import { LitElement, html, css } from "lit";
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
        qr-code {
          display: block;
        }
        #link {
          position: absolute;
          left: -10000px;
          top: auto;
          width: 1px;
          height: 1px;
          overflow: hidden;
        }
      `,
    ];
  }
  constructor() {
    super();
    this.modulesize = 4;
    this.margin = 2;
    this.format = "png";
    import("@haxtheweb/q-r/lib/qr-code.js");
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
    return new URL("./lib/q-r.haxProperties.json", import.meta.url).href;
  }
}
customElements.define(QR.tag, QR);
export { QR };
