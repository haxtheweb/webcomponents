import { ESGlobalBridgeStore } from "@haxtheweb/es-global-bridge/es-global-bridge.js";
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
    this.libPath =
      new URL("./docx-file-system-broker.js", import.meta.url).href + "/../";
    this.libPath += "mammoth/";
    ESGlobalBridgeStore.load(
      "mammoth",
      this.libPath + "mammoth.browser.min.js",
    ).then(() => {
      if (globalThis.mammoth) {
        this.docx = globalThis.mammoth;
        // fire event in case anyone wants to react on loaded event
        this.dispatchEvent(
          new CustomEvent("docx-reader-ready", {
            bubbles: true,
            composed: true,
            cancelable: false,
            detail: this,
          }),
        );
      }
    });
  }

  __toHTML(buffer, name) {
    // need an event to imply loaded here
    globalThis.dispatchEvent(
      new CustomEvent("docx-file-system-data", {
        composed: false,
        bubbles: false,
        cancelable: true,
        detail: {
          name: name,
          value: buffer.value,
        },
      }),
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
      let dl = globalThis.document.createElement("a");
      globalThis.document.body.appendChild(dl);
      dl.href =
        `data:application/vnd.ms-word;charset=utf-8,` +
        encodeURIComponent(fileContents);
      dl.download = `${filename}.docx`;
      dl.click();
      globalThis.document.body.removeChild(dl);
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
globalThis.DOCXFileSystemBroker = globalThis.DOCXFileSystemBroker || {};
globalThis.DOCXFileSystemBroker.requestAvailability = () => {
  // if there is no single instance, generate one and append it to end of the document
  if (!globalThis.DOCXFileSystemBroker.instance) {
    globalThis.DOCXFileSystemBroker.instance =
      globalThis.document.createElement("docx-file-system-broker");
    globalThis.document.body.appendChild(
      globalThis.DOCXFileSystemBroker.instance,
    );
  }
  return globalThis.DOCXFileSystemBroker.instance;
};
// forces appending
const DOCXFileSystemBrokerSingleton =
  globalThis.DOCXFileSystemBroker.requestAvailability();
export {
  DOCXFileSystemBrokerSingleton,
  DOCXFileSystemBroker,
  FileSystemBroker,
  FileSystemBrokerSingleton,
};
