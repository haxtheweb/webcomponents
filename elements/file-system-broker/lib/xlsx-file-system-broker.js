import { ESGlobalBridgeStore } from "@haxtheweb/es-global-bridge/es-global-bridge.js";
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
    // support global path value we use for resolving these on CDNs
    this.libPath =
      new URL("./xlsx-file-system-broker.js", import.meta.url).href + "/../";
    this.libPath += "xlsx/";
    ESGlobalBridgeStore.load(
      "xlsx",
      this.libPath + "dist/xlsx.full.min.js",
    ).then(() => {
      if (globalThis.XLSX) {
        this.XLSX = globalThis.XLSX;
        // fire event in case anyone wants to react on loaded event
        this.dispatchEvent(
          new CustomEvent("xlsx-ready", {
            bubbles: true,
            composed: true,
            cancelable: false,
            detail: this,
          }),
        );
      }
    });
    this.XW = {
      msg: "xlsx",
      worker: this.libPath + "xlsxworker.js",
    };
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

  __toJSON(workbook, stringify) {
    var result = {};
    workbook.SheetNames.forEach((sheetName) => {
      var roa = this.XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 1,
        blankrows: false,
        raw: false,
        dateNF: "yyyy-mm-dd",
      });
      if (roa.length) result[sheetName] = roa;
    });
    if (stringify) {
      return JSON.stringify(result, null, 2);
    } else {
      return result;
    }
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
      case "jsonstringify":
        output = this.__toJSON(wb, true);
        break;
      case "json":
        output = this.__toJSON(wb, false);
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
          globalThis.dispatchEvent(
            new CustomEvent("xlsx-file-system-data", {
              composed: false,
              bubbles: false,
              cancelable: true,
              detail: {
                filename: filename,
                format: format,
                operation: op,
                data: this.processWorker(
                  JSON.parse(e.data.d),
                  format,
                  filename,
                ),
              },
            }),
          );
          break;
      }
    };
    worker.postMessage({ d: data, b: "binary" });
  }
}

customElements.define(XLSXFileSystemBroker.tag, XLSXFileSystemBroker);
// register globally so we can make sure there is only one
globalThis.XLSXFileSystemBroker = globalThis.XLSXFileSystemBroker || {};
globalThis.XLSXFileSystemBroker.requestAvailability = () => {
  // if there is no single instance, generate one and append it to end of the document
  if (!globalThis.XLSXFileSystemBroker.instance) {
    globalThis.XLSXFileSystemBroker.instance =
      globalThis.document.createElement("xlsx-file-system-broker");
    globalThis.document.body.appendChild(
      globalThis.XLSXFileSystemBroker.instance,
    );
  }
  return globalThis.XLSXFileSystemBroker.instance;
};
// forces appending
const XLSXFileSystemBrokerSingleton =
  globalThis.XLSXFileSystemBroker.requestAvailability();
export {
  XLSXFileSystemBrokerSingleton,
  XLSXFileSystemBroker,
  FileSystemBroker,
  FileSystemBrokerSingleton,
};
