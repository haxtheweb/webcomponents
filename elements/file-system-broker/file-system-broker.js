/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

/**
 * `file-system-broker`
 * `singleton to simplify interactions with the file system on a user&#39;s device`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @demo demo/index.html
 * @element file-system-broker
 */
class FileSystemBroker extends HTMLElement {
  /**
   * object life cycle
   */
  constructor() {
    super();
    this.directoryHandler = null;
    this.fileHandler = null;
  }
  /**
   * This is a convention, not the standard
   */
  static get tag() {
    return "file-system-broker";
  }
  /**
   * Get contents of a file based on type
   * @param {String} type
   * @param {Boolean} multiple
   * @param {Boolean} excludeAll
   * @returns
   */
  async loadFile(type, multiple = false, excludeAll = true) {
    let accept = this.typeToAccept(type);
    let fileHandle;
    let description = `${type} file`;
    [fileHandle] = await window.showOpenFilePicker({
      types: [
        {
          description: description,
          accept: accept,
        },
      ],
      excludeAcceptAllOption: excludeAll,
      multiple: multiple,
    });
    this.fileHandler = await fileHandle.getFile();
    return await this.fileHandler.text();
  }
  typeToAccept(type) {
    let accept = {};
    switch (type) {
      case "csv":
        accept = { "text/*": [".csv", ".txt"] };
        break;
      case "image":
        accept = { "image/*": [".jpg", ".jpeg", ".gif", ".png"] };
        break;
      case "video":
        accept = { "video/*": [".mp4"] };
        break;
      case "markdown":
        accept = { "text/*": [".txt", ".md"] };
        break;
    }
    return accept;
  }
  async saveFile(type, content) {
    let accept = this.typeToAccept(type);
    let description = `Save ${type} file`;
    const options = {
      types: [
        {
          description: description,
          accept: accept,
        },
      ],
    };
    this.fileHandler = await window.showSaveFilePicker(options);
    // Create a FileSystemWritableFileStream to write to.
    const writable = await this.fileHandler.createWritable();
    // Write the contents of the file to the stream.
    await writable.write(content);
    // Close the file and write the contents to disk.
    await writable.close();
  }
  async openDirectory(
    fileName = null,
    op = "read",
    recursive = false,
    content = ""
  ) {
    this.directoryHandler = await window.showDirectoryPicker();
    // need to load references found in the directory
    for await (const entry of this.directoryHandler.values()) {
      if (
        fileName &&
        typeof entry.getFile === "function" &&
        entry.name === fileName
      ) {
        // read this file from the directory
        if (op === "read") {
          const file = await entry.getFile();
          let contents = await file.text();
          return contents;
        } else if (op === "write") {
          // very destructive
          var FileSystemFileHandle = await this.directoryHandler.getFileHandle(
            entry.name
          );
          const writable = await FileSystemFileHandle.createWritable();
          // Write the contents of the file to the stream.
          await writable.write(content);
          // Close the file and write the contents to disk.
          await writable.close();
        }
      }
    }
    // we allow the 1st pass to try and find something before getting recursive in our loading
    if (recursive) {
      openDirectory(fileName, op, recursive, content);
    }
  }
}
// register globally so we can make sure there is only one
window.FileSystemBroker = window.FileSystemBroker || {};
window.FileSystemBroker.requestAvailability = () => {
  // if there is no single instance, generate one and append it to end of the document
  if (!window.FileSystemBroker.instance) {
    window.FileSystemBroker.instance = document.createElement(
      "file-system-broker"
    );
    document.body.appendChild(window.FileSystemBroker.instance);
  }
  return window.FileSystemBroker.instance;
};
// forces appending
const FileSystemBrokerSingleton = window.FileSystemBroker.requestAvailability();

customElements.define(FileSystemBroker.tag, FileSystemBroker);
export { FileSystemBroker, FileSystemBrokerSingleton };
