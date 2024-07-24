export const MtzFileDownloadBehaviors = function (SuperClass) {
  return class extends SuperClass {
    static get properties() {
      if (super.properties) {
        return Object.assign(
          {
            fileTypes: {
              type: Object,
              value() {
                return {
                  CSV: "text/csv",
                  JSON: "text/json",
                  PDF: "application/pdf",
                  TXT: "text/plain",
                  HTML: "text/html",
                };
              },
            },
          },
          super.properties,
        );
      } else {
        return {
          fileTypes: {
            type: Object,
            value() {
              return {
                CSV: "text/csv",
                JSON: "text/json",
                PDF: "application/pdf",
                TXT: "text/plain",
                HTML: "text/html",
              };
            },
          },
        };
      }
    }
    /**
     * Converts the data to a blob then uses navigator to save blob if it’s available, otherwise
     * creates an <a> with [download] attribute then simulates a click.
     * @param {String} data - data to encode.
     * @param {String} type - type of file to generate (i.e, JSON or CSV).
     * @param {String} [name = 'download'] - file name to save data under.
     * @param {Boolean} [newTab = true] - If false, downloads uri in existing tab. Otherwise,
     * downloads in new tab.
     */
    downloadFromData(data, type, name = "download", newTab = true) {
      const mimeType = this.fileTypes[type.toUpperCase()];
      const blob = new Blob([decodeURIComponent(encodeURI(data))], {
        type: mimeType,
      });
      const filename = name + "." + type.toLowerCase();
      if (globalThis.navigator && globalThis.navigator.msSaveOrOpenBlob) {
        globalThis.navigator.msSaveOrOpenBlob(blob, filename);
      } else {
        // Link elements have a download attribute which provides cross-platform
        // download behavior supporting all but IE 11. This creates new link and then
        // clicks it to initiate download.
        const link = globalThis.document.createElement("a");
        link.href = (globalThis.URL || globalThis.webkitURL).createObjectURL(
          blob,
        );
        link.download = filename;
        link.target = newTab ? "_blank" : "_self";
        this.appendChild(link);
        link.click();
        this.removeChild(link);
      }
    }

    /**
     * Opens a new tab at the URI so that download can be initiated from the page.
     * @param {String} uri - The uri to open.
     * @param {Boolean} [newTab = true] - If false, downloads uri in existing tab. Otherwise,
     * downloads in new tab.
     * @return {Boolean} Returns true.
     */
    downloadFromURI(uri, newTab = true) {
      globalThis.open(uri, newTab ? "_blank" : "_self");
      return true; // NOTE: Returning true to prevent error in some browsers during download.
    }
  };
};
