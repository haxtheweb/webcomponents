import "@polymer/polymer/polymer.js";
/**
`beaker-broker`
An element to help check for and broker calls to read and write beaker browser dat sites.
This allows for data binding and figuring out if we're in an environment that we can even use this.

@demo demo/index.html

@microcopy - the mental model for this element
 - beaker browser - a transformative, decentralized platform
 - dat - a communication protocol for serving sites up p2p

*/
Polymer({
  _template: `
    <style>
    </style>
    <slot></slot>
`,

  is: "beaker-broker",

  properties: {
    /**
     * Archive
     */
    archive: {
      type: Object,
      notify: true
    },
    /**
     * datUrl
     */
    datUrl: {
      type: String,
      value: window.location.host,
      observer: "_dateUrlChanged",
      notify: true
    }
  },

  /**
   * notice dat address has changed, build the object for it
   */
  _dateUrlChanged: async function(newValue, oldValue) {
    if (typeof DatArchive !== typeof undefined && newValue) {
      // load current site, set to archive
      this.set("archive", new DatArchive(newValue));
    }
  },

  /**
   * Write to file
   * @usage - this.write('hello.txt', 'things and stuff');
   */
  write: async function(path, data) {
    // well that was easy
    await this.archive.writeFile(path, data);
  },

  /**
   * Read to file
   * @var path - location of file
   * @var type - utf8, base64, hex, binary or specialized ones jpeg / png
   * @return Promise() with reference to the data in the file if await / async is active
   * @usage - await this.read('index.html'); to get this file
   */
  read: async function(path, type) {
    var ftype = "utf8";
    var response;
    // special cases for image types
    switch (type) {
      case "jpeg":
      case "jpg":
        ftype = "binary";
        var buf = await this.archive.readFile(path, ftype);
        var blob = new Blob([buf], { type: "image/jpeg" });
        response = URL.createObjectURL(blob);
        break;
      case "png":
        ftype = "binary";
        var buf = await this.archive.readFile(path, ftype);
        var blob = new Blob([buf], { type: "image/png" });
        response = URL.createObjectURL(blob);
        break;
      case "base64":
        var str = await this.archive.readFile(path, type);
        response = "data:image/png;base64," + str;
        break;
      default:
        var str = await this.archive.readFile(path, type);
        response = str;
        break;
    }
    return await response;
  },

  /**
   * Attached to the DOM, now fire.
   */
  attached: function() {
    if (typeof DatArchive === typeof undefined) {
      console.log("Beaker is not available from this site loading methodology");
    }
  }
});
