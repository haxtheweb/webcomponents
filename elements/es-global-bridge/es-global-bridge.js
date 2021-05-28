/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

/**
 * Object to help load things in globally scoped and fire events when ready
 */
export class ESGlobalBridge {
  constructor() {
    this.imports = {};
    this.webpack = false;
    /**
     * alias for load
     */
    this.import = (name, location, webpack = false) => {
      return this.load(name, location, webpack);
    };
    /**
     * Load location and register it by name
     */
    this.load = (name, location, webpack = false) => {
      //don't try to load file if a story.js is already working on importing the packed version of the file
      let imported = this.imports[name],
        importing = !webpack && this.webpack && this.webpack[name];
      if (!importing && !imported) {
        return new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = location;
          script.setAttribute("data-name", name);
          this.imports[name] = location;
          script.onload = () => {
            resolve(this.imports[name]);
            this.imports[name] = true;
            // delay firing the event just to be safe
            setTimeout(() => {
              const evt = new CustomEvent(`es-bridge-${name}-loaded`, {
                bubbles: true,
                cancelable: true,
                detail: {
                  name: name,
                  location: location,
                },
              });
              document.dispatchEvent(evt);
            }, 100);
          };
          script.onerror = () => {
            reject(
              new Error(
                `Failed to load ${name} script with location ${location}.`
              )
            );
            delete this.imports[name];
            this.imports[name] = false;
          };
          document.documentElement.appendChild(script);
        });
      } else {
        return new Promise((resolve, reject) => {
          resolve(this.imports[name]);
        });
      }
    };
  }
}
// register global bridge on window if needed
window.ESGlobalBridge = window.ESGlobalBridge || {};

window.ESGlobalBridge.requestAvailability = () => {
  if (!window.ESGlobalBridge.instance) {
    window.ESGlobalBridge.instance = new ESGlobalBridge();
  }
  return window.ESGlobalBridge.instance;
};
export const ESGlobalBridgeStore = window.ESGlobalBridge.requestAvailability();
