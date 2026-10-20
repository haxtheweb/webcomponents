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
        // security: script.src executes code, so only http(s) URLs (relative
        // ones resolve against the page) are accepted; javascript:, data: and
        // other schemes are rejected (JS-URL-002)
        let safeLocation = null;
        try {
          if (typeof location !== "string" || location.trim() === "") {
            throw new Error("empty location");
          }
          const parsed = new URL(location, globalThis.location.href);
          if (parsed.protocol === "https:" || parsed.protocol === "http:") {
            safeLocation = parsed.href;
          }
        } catch {
          // intentionally empty
        }
        if (!safeLocation) {
          return Promise.reject(
            new Error(`Refused to load ${name} script from ${location}.`),
          );
        }
        return new Promise((resolve, reject) => {
          const script = globalThis.document.createElement("script");
          script.src = safeLocation;
          script.setAttribute("data-name", name);
          this.imports[name] = location;
          script.onload = () => {
            resolve(this.imports[name]);
            // a slow real network failure for a prior attempt at this same
            // name can fire its onerror after a newer load already started
            // (or finished); only flip state if this attempt is still the
            // one on record, so a stale callback can't clobber a newer one
            if (this.imports[name] === location) {
              this.imports[name] = true;
            }
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
              globalThis.document.dispatchEvent(evt);
            }, 100);
          };
          script.onerror = () => {
            reject(
              new Error(
                `Failed to load ${name} script with location ${location}.`
              )
            );
            // see note in onload above: don't clobber a newer attempt's state
            if (this.imports[name] === location) {
              delete this.imports[name];
              this.imports[name] = false;
            }
          };
          globalThis.document.documentElement.appendChild(script);
        });
      } else {
        return new Promise((resolve, _reject) => {
          resolve(this.imports[name]);
        });
      }
    };
  }
}
// register global bridge on window if needed
globalThis.ESGlobalBridge = globalThis.ESGlobalBridge || {};

globalThis.ESGlobalBridge.requestAvailability = () => {
  if (!globalThis.ESGlobalBridge.instance) {
    globalThis.ESGlobalBridge.instance = new ESGlobalBridge();
  }
  return globalThis.ESGlobalBridge.instance;
};
export const ESGlobalBridgeStore = globalThis.ESGlobalBridge.requestAvailability();
