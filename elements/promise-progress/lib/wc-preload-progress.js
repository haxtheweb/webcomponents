/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import "@haxtheweb/wc-autoload/wc-autoload.js";
import { PromiseProgress } from "../promise-progress.js";
/**
 * `promise-progress`
 * `layer on top of promise progress with specific integration with the WC Autoloader registry`
 * @element wc-preload-progress
 */
export class WCPreloadProgress extends PromiseProgress {
  static get tag() {
    return "wc-preload-progress";
  }
  constructor() {
    super();
    this.wcList = [];
    this.registry = globalThis.DynamicImportRegistry.requestAvailability();
  }
  static get properties() {
    return {
      ...super.properties,
      wcList: { type: Array },
    };
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "wcList" && this.wcList.length > 0) {
        let list = [];
        this.wcList.map((item) =>
          list.push(() => this.registry.loadDefinition(item)),
        );
        this.list = list;
      }
    });
  }
}

customElements.define(WCPreloadProgress.tag, WCPreloadProgress);
