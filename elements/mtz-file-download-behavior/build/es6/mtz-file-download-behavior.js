import { dom } from "./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
window.mtz = window.mtz || {};
mtz.FileDownloadBehavior = {
  properties: {
    fileTypes: {
      type: Object,
      value() {
        return {
          CSV: "text/csv",
          JSON: "text/json",
          PDF: "application/pdf",
          TXT: "text/plain"
        };
      }
    }
  },
  downloadFromData(data, type, name = "download", newTab = !0) {
    const mimeType = this.fileTypes[type.toUpperCase()],
      blob = new Blob([decodeURIComponent(encodeURI(data))], {
        type: mimeType
      }),
      filename = name + "." + type.toLowerCase();
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      const link = document.createElement("a");
      link.href = (window.URL || window.webkitURL).createObjectURL(blob);
      link.download = filename;
      link.target = newTab ? "_blank" : "_self";
      dom(this.root).appendChild(link);
      link.click();
      dom(this.root).removeChild(link);
    }
  },
  downloadFromURI(uri, newTab = !0) {
    window.open(uri, newTab ? "_blank" : "_self");
    return !0;
  }
};
