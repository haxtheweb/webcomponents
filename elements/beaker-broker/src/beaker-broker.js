/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";

/**
 * `beaker-broker`
 * `An element to help check for and broker calls to read and write beaker browser dat sites.
 * This allows for data binding and figuring out if we're in an environment that we can even use this.`
 *
 * @microcopy - language worth noting:
 *  - beaker browser - a transformative, decentralized platform
 *  - dat - a communication protocol for serving sites up p2p
 *
 * @demo demo/index.html
 * @element beaker-broker
 */
class BeakerBroker extends LitElement {
  // render function
  render() {
    return html` <style>
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none;
        }
      </style>
      <slot></slot>`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {};
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      archive: {
        type: Object,
      },
      datUrl: {
        type: String,
        attribute: "dat-url",
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "beaker-broker";
  }
  /**
   * LitElement ready
   */
  firstUpdated() {
    if (typeof DatArchive === typeof undefined) {
      console.warn(
        "Beaker is not available from this site loading methodology",
      );
    }
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.datUrl = globalThis.location.host;
  }
  /**
   * LitElement properties changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "archive") {
        // notify
        this.dispatchEvent(
          new CustomEvent("archive-changed", {
            detail: {
              value: this[propName],
            },
          }),
        );
      }
      if (propName == "datUrl") {
        this._datUrlChanged(this[propName]);
        // notify
        this.dispatchEvent(
          new CustomEvent("dat-url-changed", {
            detail: {
              value: this[propName],
            },
          }),
        );
      }
    });
  }
  /**
   * notice dat address has changed, build the object for it
   */
  async _datUrlChanged(newValue) {
    if (typeof DatArchive !== typeof undefined && newValue) {
      // load current site, set to archive
      this.archive = new DatArchive(newValue);
    }
  }

  /**
   * Write to file
   * @usage - this.write('hello.txt', 'things and stuff');
   */
  async write(path, data) {
    // well that was easy
    await this.archive.writeFile(path, data);
  }

  /**
   * Read to file
   * @var path - location of file
   * @var type - utf8, base64, hex, binary or specialized ones jpeg / png
   * @return Promise() with reference to the data in the file if await / async is active
   * @usage - await this.read('index.html'); to get this file
   */
  async read(path, type) {
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
  }
}
customElements.define(BeakerBroker.tag, BeakerBroker);
export { BeakerBroker };
