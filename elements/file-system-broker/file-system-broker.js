/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

/**
 * `file-system-broker`
 * `singleton to simplify interactions with the file system on a user&#39;s device`
 *
 * @demo demo/index.html Demo
 * @demo demo/xlsx.html XLSX loader
 * @demo demo/docx.html DOCX loader
 * @element file-system-broker
 */
class FileSystemBroker extends HTMLElement {
  /**
   * object life cycle
   */
  constructor() {
    super();
    this.dirHandler = null;
    this.fileHandler = null;
    this.files = [];
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
    [fileHandle] = await globalThis.showOpenFilePicker({
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
    return this.fileHandler;
  }
  /**
   * Get contents of a file based on type
   * @param {String} type
   * @param {Boolean} multiple
   * @param {Boolean} excludeAll
   * @returns
   */
  async getFileContents(type, multiple = false, excludeAll = true) {
    await this.loadFile(type, multiple, excludeAll);
    return await this.fileHandler.text();
  }
  typeToAccept(type) {
    let accept = {};
    switch (type) {
      case "html":
        accept = {
          "text/html": [".html", ".htm"],
        };
        break;
      case "xls":
      case "xlsx":
      case "ods":
        accept = {
          "text/csv": [".csv"],
          "application/*": [".xls", ".xlsx", ".ods"],
        };
        break;
      case "zip":
        accept = { "application/zip": [".zip", ".gz", ".tar", ".tar.gz"] };
        break;
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
    this.fileHandler = await globalThis.showSaveFilePicker(options);
    // Create a FileSystemWritableFileStream to write to.
    const writable = await this.fileHandler.createWritable();
    // Write the contents of the file to the stream.
    await writable.write(content);
    // Close the file and write the contents to disk.
    await writable.close();
  }
  /**
   * Open directory
   */
  async openDir(recursive = true, options = {}) {
    try {
      this.dirHandler = await globalThis.showDirectoryPicker(options);
    } catch (e) {
      console.warn(e);
    }
    this.files = [];
    this.files = await this.__readDir(
      this.dirHandler,
      recursive,
      this.dirHandler.name || "",
      this.dirHandler,
    );
    return this.files;
  }
  async readFileInDir(fileName, options = {}) {
    try {
      this.dirHandler = await globalThis.showDirectoryPicker(options);
      // need to load references found in the directory
      for await (const entry of this.dirHandler.values()) {
        if (
          fileName &&
          typeof entry.getFile === "function" &&
          entry.name === fileName
        ) {
          // read this file from the directory
          const file = await entry.getFile();
          return await file.text();
        }
      }
    } catch (e) {
      console.warn(e);
    }
    return "";
  }
  async writeFileInDir(fileName, content = "", options = {}) {
    try {
      this.dirHandler = await globalThis.showDirectoryPicker(options);
      // need to load references found in the directory
      for await (const entry of this.dirHandler.values()) {
        if (
          fileName &&
          typeof entry.getFile === "function" &&
          entry.name === fileName
        ) {
          var FileSystemFileHandle = await this.dirHandler.getFileHandle(
            entry.name,
          );
          const writable = await FileSystemFileHandle.createWritable();
          // Write the contents of the file to the stream.
          await writable.write(content);
          // Close the file and write the contents to disk.
          await writable.close();
          return true;
        }
      }
    } catch (e) {
      console.warn(e);
    }
    return false;
  }
  /**
   * Read contents of a directory and recursively load down from there
   */
  async __readDir(dirHandle, recursive, folder, parentHandler) {
    const files = [];
    for await (let [name, handle] of dirHandle) {
      const { kind } = handle;
      if (handle.kind === "directory") {
        files.push({ name, kind, handle, folder, parentHandler });
        if (name !== ".git" && recursive) {
          files.push(
            ...(await this.__readDir(
              handle,
              recursive,
              folder + "/" + name,
              handle,
            )),
          );
        }
      } else {
        files.push({ name, kind, handle, folder, parentHandler });
      }
    }
    return files;
  }
}
// register globally so we can make sure there is only one
globalThis.FileSystemBroker = globalThis.FileSystemBroker || {};
globalThis.FileSystemBroker.requestAvailability = () => {
  // if there is no single instance, generate one and append it to end of the document
  if (
    !globalThis.FileSystemBroker.instance &&
    globalThis.document &&
    globalThis.document.body
  ) {
    globalThis.FileSystemBroker.instance =
      globalThis.document.createElement("file-system-broker");
    globalThis.document.body.appendChild(globalThis.FileSystemBroker.instance);
  }
  return globalThis.FileSystemBroker.instance;
};
// forces appending
const FileSystemBrokerSingleton =
  globalThis.FileSystemBroker.requestAvailability();

customElements.define(FileSystemBroker.tag, FileSystemBroker);
export { FileSystemBroker, FileSystemBrokerSingleton };
