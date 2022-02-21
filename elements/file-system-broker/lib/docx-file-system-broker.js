import { ESGlobalBridgeStore } from "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
import {
  FileSystemBroker,
  FileSystemBrokerSingleton,
} from "../file-system-broker.js";

/**
 * Web component that bridges local file system via File API and
 * combines the functionality of the DOCX parser so that you can easily
 * load a file / directory from the user's file system and then access
 * that data from DOCX
 */
class DOCXFileSystemBroker extends FileSystemBroker {
  static get tag() {
    return "docx-file-system-broker";
  }
  constructor() {
    super();
    this.libPath = new URL(`./`, import.meta.url).href;
    this.libPath += "mammoth/";
    ESGlobalBridgeStore.load(
      "mammoth",
      this.libPath + "mammoth.browser.min.js"
    ).then(() => {
      if (window.mammoth) {
        this.docx = window.mammoth;
        // fire event in case anyone wants to react on loaded event
        this.dispatchEvent(
          new CustomEvent("docx-reader-ready", {
            bubbles: true,
            composed: true,
            cancelable: false,
            detail: this,
          })
        );
      }
    });
  }

  __toHTML(buffer, name) {
    // need an event to imply loaded here
    window.dispatchEvent(
      new CustomEvent("docx-file-system-data", {
        composed: false,
        bubbles: false,
        cancelable: true,
        detail: {
          name: name,
          value: buffer.value,
        },
      })
    );
  }
  /**
   * Take contents and return a docx file downloaded to the user's browser
   */
  HTMLToDOCX(content, filename, dl = true) {
    const fileContents = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${filename}</title>
      </head>
      <body>
      ${content}
      </body>
    </html>`;
    if (dl) {
      let dl = document.createElement("a");
      document.body.appendChild(dl);
      dl.href =
        `data:application/vnd.ms-word;charset=utf-8,` +
        encodeURIComponent(fileContents);
      dl.download = `${filename}.docx`;
      dl.click();
      document.body.removeChild(dl);
    }
    return fileContents;
  }

  fileToHTML(input, name = "filepicked") {
    var reader = new FileReader();
    reader.onload = async (arrayBuffer) => {
      await this.docx
        .convertToHtml({ arrayBuffer: arrayBuffer.target.result })
        .then((data) => {
          return this.__toHTML(data, name);
        })
        .done();
    };
    reader.readAsBinaryString(input);
  }
}

customElements.define(DOCXFileSystemBroker.tag, DOCXFileSystemBroker);
// register globally so we can make sure there is only one
window.DOCXFileSystemBroker = window.DOCXFileSystemBroker || {};
window.DOCXFileSystemBroker.requestAvailability = () => {
  // if there is no single instance, generate one and append it to end of the document
  if (!window.DOCXFileSystemBroker.instance) {
    window.DOCXFileSystemBroker.instance = document.createElement(
      "docx-file-system-broker"
    );
    document.body.appendChild(window.DOCXFileSystemBroker.instance);
  }
  return window.DOCXFileSystemBroker.instance;
};
// forces appending
const DOCXFileSystemBrokerSingleton =
  window.DOCXFileSystemBroker.requestAvailability();
export {
  DOCXFileSystemBrokerSingleton,
  DOCXFileSystemBroker,
  FileSystemBroker,
  FileSystemBrokerSingleton,
};
