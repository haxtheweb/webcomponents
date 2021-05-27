import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
import {
  FileSystemBroker,
  FileSystemBrokerSingleton,
} from "../file-system-broker.js";

/**
 * Web component that bridges local file system via File API and
 * combines the functionality of the XSLX parser so that you can easily
 * load a file / directory from the user's file system and then access
 * that data from XLSX / ODS / CSV repos
 */
class XLSXFileSystemBroker extends FileSystemBroker {
  static get tag() {
    return "xlsx-file-system-broker";
  }
  constructor() {
    super();
    this.XLSX = null;
    this.XLSXReady = false;
    // load our bridge so we can import this
    window.ESGlobalBridge.requestAvailability();
    // support global path value we use for resolving these on CDNs
    if (window.WCGlobalBasePath) {
      this.libPath = window.WCGlobalBasePath;
    } else {
      this.libPath = new URL(`/../../../node_modules/`, import.meta.url).href;
    }
    this.libPath += "xlsx/";
    window.ESGlobalBridge.instance.load(
      "xlsx",
      this.libPath + "dist/xlsx.full.min.js"
    );
    this.XW = {
      msg: "xlsx",
      worker: this.libPath + "xlsxworker.js",
    };
    window.addEventListener(
      `es-bridge-xlsx-loaded`,
      this.xlsxLoaded.bind(this)
    );
  }
  /**
   * Loaded so register it off of the XLSX object
   */
  xlsxLoaded(e) {
    if (window.XLSX) {
      this.XLSX = window.XLSX;
      // store just in case
      this.XLSXReady = true;
      // fire event in case anyone wants to react on loaded event
      this.dispatchEvent(
        new CustomEvent("xlsx-ready", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: this,
        })
      );
      window.removeEventListener(
        `es-bridge-xlsx-loaded`,
        this.xlsxLoaded.bind(this)
      );
    }
  }
  workbookFromJSON(data) {
    const wb = this.XLSX.utils.book_new();
    for (const i in data) {
      let ws = this.XLSX.utils.json_to_sheet(data[i], { skipHeader: true });
      this.XLSX.utils.book_append_sheet(wb, ws, i);
    }
    //this.XLSX.writeFile(wb, 'stuff.xlsx');
    return this.XLSX.write(wb, {
      bookType: "xlsx",
      bookSST: false,
      type: "array",
    });
  }

  __toJSON(workbook) {
    var result = {};
    workbook.SheetNames.forEach((sheetName) => {
      var roa = this.XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 1,
      });
      if (roa.length) result[sheetName] = roa;
    });
    return JSON.stringify(result, 2, 2);
  }

  __toCSV(workbook) {
    var result = [];
    workbook.SheetNames.forEach((sheetName) => {
      var csv = this.XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
      if (csv.length) {
        result.push("SHEET: " + sheetName);
        result.push("");
        result.push(csv);
      }
    });
    return result.join("\n");
  }

  __toFMLA(workbook) {
    var result = [];
    workbook.SheetNames.forEach((sheetName) => {
      var formulae = this.XLSX.utils.get_formulae(workbook.Sheets[sheetName]);
      if (formulae.length) {
        result.push("SHEET: " + sheetName);
        result.push("");
        result.push(formulae.join("\n"));
      }
    });
    return result.join("\n");
  }

  __toHTML(workbook) {
    var content = "";
    workbook.SheetNames.forEach((sheetName) => {
      var htmlstr = this.XLSX.write(workbook, {
        sheet: sheetName,
        type: "string",
        bookType: "html",
      });
      content += htmlstr;
    });
    return content;
  }
  __toXLSX(workbook, filename) {
    //this.XLSX.writeFile(workbook, filename);
    return this.XLSX.write(workbook);
  }

  processWorker(wb, format, filename) {
    var output = "";
    switch (format) {
      case "form":
        output = this.__toFMLA(wb);
        break;
      case "html":
        output = this.__toHTML(wb);
        break;
      case "json":
        output = this.__toJSON(wb);
        break;
      case "xlsx":
        output = this.__toXLSX(wb, filename);
        break;
      default:
        output = this.__toCSV(wb);
    }
    return output;
  }

  processFile(input, format, filename) {
    var reader = new FileReader();
    reader.onload = (e) => {
      this.__executeWorker(e.target.result, format, "read", filename);
    };
    reader.readAsBinaryString(input);
  }

  __executeWorker(data, format, op = "read", filename = "") {
    var worker = new Worker(this.XW.worker);
    worker.onmessage = (e) => {
      switch (e.data.t) {
        case "ready":
          break;
        case "e":
          console.error(e.data.d);
          break;
        case this.XW.msg:
          this.dispatchEvent(
            new CustomEvent("xlsx-file-system-data", {
              composed: true,
              bubbles: true,
              cancelable: true,
              detail: {
                filename: filename,
                format: format,
                operation: op,
                data: this.processWorker(
                  JSON.parse(e.data.d),
                  format,
                  filename
                ),
              },
            })
          );
          break;
      }
    };
    worker.postMessage({ d: data, b: "binary" });
  }

  disconnectedCallback() {
    window.removeEventListener(
      `es-bridge-xlsx-loaded`,
      this.xlsxLoaded.bind(this)
    );
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
  }
}

customElements.define(XLSXFileSystemBroker.tag, XLSXFileSystemBroker);
// register globally so we can make sure there is only one
window.XLSXFileSystemBroker = window.XLSXFileSystemBroker || {};
window.XLSXFileSystemBroker.requestAvailability = () => {
  // if there is no single instance, generate one and append it to end of the document
  if (!window.XLSXFileSystemBroker.instance) {
    window.XLSXFileSystemBroker.instance = document.createElement(
      "xlsx-file-system-broker"
    );
    document.body.appendChild(window.XLSXFileSystemBroker.instance);
  }
  return window.XLSXFileSystemBroker.instance;
};
// forces appending
const XLSXFileSystemBrokerSingleton = window.XLSXFileSystemBroker.requestAvailability();
export {
  XLSXFileSystemBrokerSingleton,
  XLSXFileSystemBroker,
  FileSystemBroker,
  FileSystemBrokerSingleton,
};
