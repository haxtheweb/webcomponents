import { LitElement, css, html } from "lit";
import { MicroFrontendRegistry } from "../micro-frontend-registry.js";
import { enableServices } from "../lib/microServices.js";

export class DocxExample extends LitElement {
  static get tag() {
    return "docx-example";
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        textarea {
          display: block;
        }
        #asciihere {
          background-color: black;
          font-family: monospace;
          white-space: pre;
        }
      `,
    ];
  }

  static get properties() {
    return {
      html: { type: Boolean },
      pdf: { type: Boolean },
      ascii: { type: Boolean },
      screenshot: { type: Boolean },
    };
  }
  constructor() {
    super();
    this.html = false;
    this.pdf = false;
    this.ascii = false;
    this.screenshot = false;
    // enable these services
    enableServices(["core"]);
  }

  // ascii to image
  asciiImgRender() {
    return html`
      <label>Upload image file to get ASCII art</label>
      <input type="file" id="ascii" @change="${this.asciiImgUpload}" />
      <textarea id="asciiresponse" rows="10" cols="50"></textarea>
      <h1>Ascii that was in the file upload</h1>
      <pre id="asciihere"></pre>
    `;
  }

  asciiImgUpload(event) {
    const files = event.target.files;
    const formData = new FormData();
    formData.append("upload", files[0]);
    MicroFrontendRegistry.call(
      "@core/imgToAscii",
      formData,
      this.toAsciiResponse.bind(this),
    );
  }

  toAsciiResponse(data) {
    this.shadowRoot.querySelector("#asciihere").innerHTML = data.data.image;
    this.shadowRoot.querySelector("#asciiresponse").value =
      JSON.stringify(data);
  }

  // docx to html
  docxToHtmlRender() {
    return html`
      <label>Upload Docx file to get HTML</label>
      <input type="file" id="upload" @change="${this.docxToHtmlUpload}" />
      <textarea id="response" rows="10" cols="50"></textarea>
      <h1>HTML that was in the file upload</h1>
      <div id="here"></div>
    `;
  }

  docxToHtmlUpload(event) {
    const files = event.target.files;
    const formData = new FormData();
    formData.append("upload", files[0]);
    MicroFrontendRegistry.call(
      "@core/docxToHtml",
      formData,
      this.docxToHtmlResponse.bind(this),
    );
  }

  docxToHtmlResponse(data) {
    console.log(data);
    this.shadowRoot.querySelector("#here").innerHTML = data.data.contents;
  }

  // docx to pdf file
  docxToPdfRender() {
    return html`
      <label>Docx file to get PDF</label>
      <input
        type="file"
        id="uploadpdf"
        @change="${this.docxToPdfUpload.bind(this)}"
      />
      <h1>PDF file</h1>
      <iframe id="pdfframe" width="100%" height="500px"></iframe>
    `;
  }

  docxToPdfUpload(event) {
    const files = event.target.files;
    const formData = new FormData();
    formData.append("upload", files[0]);
    MicroFrontendRegistry.call(
      "@core/docxToPdf",
      formData,
      this.docxToPdfResponse.bind(this),
    );
  }

  docxToPdfResponse(data) {
    console.log(data);
    this.shadowRoot.querySelector("#pdfframe").src =
      `data:application/pdf;base64,${data.data.pdf}`;
    this.shadowRoot.querySelector("#response").value = JSON.stringify(data);
  }

  screenshotUrlRender() {
    return html`
      <label>Enter a URL to get a screenshot of it</label>
      <input type="text" id="screenshot" />
      <button id="getthething" @click="${this.screenshotUrlLink}">
        Get a screenshot
      </button>
      <h1>Image will appear here</h1>
      <img id="replaceimg" src="" alt="" />
    `;
  }

  screenshotUrlLink(event) {
    const urlToCapture = this.shadowRoot.querySelector("#screenshot").value;
    MicroFrontendRegistry.call(
      "@core/screenshotUrl",
      { urlToCapture: urlToCapture, quality: 80 },
      this.screenshotUrlResponse.bind(this),
    );
  }

  screenshotUrlResponse(data) {
    this.shadowRoot.querySelector("#replaceimg").src =
      `data:image/jpeg;base64, ${data.data.image}`;
    this.shadowRoot.querySelector("#replaceimg").alt =
      `screenshot of ${data.data.url}`;
  }

  render() {
    return html`
      ${this.ascii ? this.asciiImgRender() : ``}
      ${this.html ? this.docxToHtmlRender() : ``}
      ${this.pdf ? this.docxToPdfRender() : ``}
      ${this.screenshot ? this.screenshotUrlRender() : ``}
    `;
  }
}

customElements.define(DocxExample.tag, DocxExample);
