/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, svg, css, LitElement } from "lit";
import "./simple-icon-lite.js";
import "./simple-icons.js";
import { SimpleIconsetStore } from "./simple-iconset.js";
import { SimpleIconIconsetsManifest } from "./simple-iconset-manifest.js";
import { HaxIconsetManifest } from "@haxtheweb/hax-iconset/lib/hax-iconset-manifest.js";

/**
 * `simple-iconset-demo`
 * @element simple-iconset-demo
 * `iterates through an iconset array to generate a demo of all of the icons`
 *
 * @microcopy - language worth noting:
 *  -
 *

 * @polymer
 * @demo demo/index.html
 */
class SimpleIconsetDemo extends LitElement {
  /**
   * This is a convention, not the standard
   */
  static get tag() {
    return "simple-iconset-demo";
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
          box-shadow:
            0 2px 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12),
            0 3px 1px -2px rgba(0, 0, 0, 0.2);
          margin-bottom: 40px;
          padding: 20px 40px;
        }

        ul {
          list-style-type: none;
          padding: 0;
        }

        li {
          display: inline-block;
          width: 160px;
          margin: 16px 8px;
          text-align: center;
          font-size: 10px;
        }

        simple-icon-lite {
          display: inline-block;
        }

        .iconset:not(:first-of-type) {
          border-top: 1px solid #ddd;
        }

        .iconset:nth-of-type(9n + 1) {
          color: #444444;
        }

        .iconset:nth-of-type(9n + 2) {
          color: #be3300;
        }

        .iconset:nth-of-type(9n + 3) {
          color: #0000b5;
        }

        .iconset:nth-of-type(9n + 4) {
          color: #750075;
        }

        .iconset:nth-of-type(9n + 5) {
          color: #aa5d00;
        }

        .iconset:nth-of-type(9n + 6) {
          color: #db0a5b;
        }

        .iconset:nth-of-type(9n + 7) {
          color: #005500;
        }

        .iconset:nth-of-type(9n + 8) {
          color: #cf000f;
        }

        .iconset:nth-of-type(9n) {
          color: #005f8b;
        }
      `,
    ];
  }

  // render function
  render() {
    return this.iconsets.length < 1
      ? "Looking for iconsets..."
      : this.iconsets.map(
          (iconset) =>
            html`<div class="iconset">
              <p><strong>${iconset.name}</strong></p>
              <ul>
                ${iconset.icons.map(
                  (icon) => html`
                    <li>
                      <div id="icon">
                        <simple-icon-lite
                          icon="${iconset.name}:${icon}"
                        ></simple-icon-lite>
                        <div id="icon-text">
                          ${iconset.name === "icons"
                            ? ""
                            : `${iconset.name}:`}${icon}
                        </div>
                      </div>
                    </li>
                  `,
                )}
              </ul>
            </div> `,
        );
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * a space-separated blacklist of iconsets by name
       */
      exclude: {
        attribute: "exclude",
        type: String,
      },
      /**
       * a space-separated list of paths to iconsets.json
       */
      iconsets: {
        type: Array,
      },
      /**
       * a space-separated whitelist of iconsets by name
       */
      include: {
        attribute: "include",
        type: String,
      },
      /**
       * a space-separated list of paths to iconsets.json
       */
      imports: {
        type: Array,
      },
    };
  }
  constructor() {
    super();
    globalThis.SimpleIconset.requestAvailability();
    this.imports = [];
    this._getIconsets();
  }

  updated(changedProperties) {
    changedProperties.forEach((oldVlaue, propName) => {
      if (propName == "imports") this._getIconsets();
    });
  }
  _getIconsets() {
    let imports =
        this.imports.length < 1
          ? [SimpleIconIconsetsManifest, HaxIconsetManifest]
          : this.imports,
      iconsets = imports.flat(),
      excludeSets = (this.exclude || "").split(" "),
      includeSets = (this.include || "").split(" ");

    this.iconsets = iconsets.filter(
      (iconset) =>
        !!iconset &&
        !excludeSets.includes(iconset) &&
        (!this.include || includeSets.includes(iconset)),
    );
  }
}
customElements.define(SimpleIconsetDemo.tag, SimpleIconsetDemo);
export { SimpleIconsetDemo };
