/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

/**
 * Object to help load things in globally scoped and fire events when ready
 */
export class ESGlobalBridge {
  constructor() {
    /**
     * Load location and register it by name
     */
    this.load = (name, location) => {
      if (!window.ESGlobalBridge.imports[name]) {
        return new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = location;
          script.setAttribute("data-name", name);
          window.ESGlobalBridge.imports[name] = location;
          script.onload = () => {
            resolve(window.ESGlobalBridge.imports[name]);
            window.ESGlobalBridge.imports[name] = true;
            // delay firing the event just to be safe
            setTimeout(() => {
              const evt = new CustomEvent(`es-bridge-${name}-loaded`, {
                bubbles: true,
                cancelable: true,
                detail: {
                  name: name,
                  location: location
                }
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
            delete window.ESGlobalBridge.imports[name];
            window.ESGlobalBridge.imports[name] = false;
          };
          document.documentElement.appendChild(script);
        });
      }
    };
  }
}
// register global bridge on window if needed
window.ESGlobalBridge = window.ESGlobalBridge || {};
window.ESGlobalBridge.imports = window.ESGlobalBridge.imports || {};

window.ESGlobalBridge.requestAvailability = () => {
  if (!window.ESGlobalBridge.instance) {
    window.ESGlobalBridge.instance = new ESGlobalBridge();
  }
};
