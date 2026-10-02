/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, css, html } from "lit";

/**
 * `simple-wc`
 * `A simple web component wrapper to simplify consistent patterns of element creation`
 * @demo demo/index.html
 * @element simple-wc
 */
function camelCaseToDash(key) {
  return key.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
}
export function createSWC(swc) {
  let MyComponent = class SWC extends LitElement {
    /**
     * HTMLElement
     */
    constructor() {
      super();
      for (let key in swc.callbacks) {
        this[key] = swc.callbacks[key];
      }
      // internal var to access everywhere
      // set the values from defaults
      for (let key in swc.data.values) {
        this[key] = swc.data.values[key];
      }
      // dynamically import dependencies
      setTimeout(() => {
        swc.deps.map((i) => {
          import(`../../${i}`);
        });
      }, 0);
    }
    static get tag() {
      return swc.name;
    }
    /**
     * LitElement render function
     */
    render() {
      return swc.html(this, html);
    }
    /**
     * LitElement style rendering
     */
    static get styles() {
      return [
        css`
          /* this style helps ease FOUC w/ dynamic imports */
          :host *:not(:defined) {
            display: none;
          }
        `,
        swc.css(this, css),
      ];
    }
    /**
     * LitElement / popular convention
     */
    static get properties() {
      let props = {};
      for (let key in swc.data.values) {
        // Lit expects constructor functions for attribute/type coercion;
        // map the runtime typeof strings to them (issue #3102 bug 37)
        let valueType = typeof swc.data.values[key];
        let ctor = String;
        if (valueType === "number") {
          ctor = Number;
        } else if (valueType === "boolean") {
          ctor = Boolean;
        } else if (valueType === "object") {
          ctor = Array.isArray(swc.data.values[key]) ? Array : Object;
        }
        props[key] = {
          type: ctor,
        };
        // convert camel to attr name IF it doesn't match
        let attr = camelCaseToDash(key);
        if (attr !== key) {
          props[key].attribute = attr;
        }
        // LitElement syntax
        if (swc.data.reflect && swc.data.reflect.includes(key)) {
          props[key].reflect = true;
        }
      }
      return { ...super.properties, ...props };
    }
    /**
     * Updated attribute / property callback
     */
    updated(changedProperties) {
      if (super.updated) {
        super.updated(changedProperties);
      }
      changedProperties.forEach((old, name) => {
        if (swc.data.observe) {
          swc.data.observe.forEach((value, key) => {
            // we have something we are observing
            if (value[0].includes(name)) {
              let result;
              // there's 1 value so pass new and old value
              if (value[0].length === 1) {
                result = swc.callbacks[value[1]](this[value[0][0]], old);
              } else {
                // pass in all the current values looking off of this
                let valueMap = [];
                value[0].map((val) => {
                  valueMap.push(this[val]);
                });
                // spread the value map so we get the values populated as args correctly
                result = swc.callbacks[value[1]](...valueMap);
              }
              // set the result to this value while also spreading
              // array values to propagate data binding
              // this only happens if we have a 3rd value which is what we are
              // storing the result in otherwise the result is not used
              if (value.length == 3) {
                this[value[2]] = Array.isArray(result) ? [...result] : result;
              }
            }
          });
        }
        // notify changes
        if (swc.data.notify && swc.data.notify.includes(name)) {
          // notify
          this.dispatchEvent(
            new CustomEvent(`${camelCaseToDash(name)}-changed`, {
              detail: {
                value: this[name],
              },
            }),
          );
        }
      });
    }
    /**
     * Window events add and remove
     * @param {String} status
     */
    __applyWinEvents(status) {
      if (swc.events && swc.events.window) {
        // cache the bound handlers on the instance so removeEventListener
        // receives the identical function reference that was added;
        // binding fresh per call made removal never match and window
        // listeners leaked after disconnect (issue #3102 bug 38)
        if (!this.__winEventHandlers) {
          this.__winEventHandlers = {};
          for (let eName in swc.events.window) {
            this.__winEventHandlers[eName] =
              swc.callbacks[swc.events.window[eName]].bind(this);
          }
        }
        for (let eName in swc.events.window) {
          globalThis[`${status ? "add" : "remove"}EventListener`](
            eName,
            this.__winEventHandlers[eName],
          );
        }
      }
    }
    /**
     * LitElement shadow dom ready
     */
    firstUpdated(changedProperties) {
      if (super.firstUpdated) {
        super.firstUpdated(changedProperties);
      }
      if (swc.events && swc.events.shadow) {
        for (let target in swc.events.shadow) {
          for (let eName in swc.events.shadow[target]) {
            this.shadowRoot
              .querySelector(target)
              .addEventListener(
                eName,
                swc.callbacks[swc.events.shadow[target][eName]].bind(this),
              );
          }
        }
      }
    }
    /**
     * HTMLElement connected element
     */
    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      this.__applyWinEvents(true);
    }
    /**
     * HTMLElement disconnected element
     */
    disconnectedCallback() {
      this.__applyWinEvents(false);
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
    }
    /**
     * return HAX Schema for wiring to HAX
     * @todo build this on the fly from swc
     */
    haxProperties() {
      return {};
    }
  };
  customElements.define(MyComponent.tag, MyComponent);
  return MyComponent;
}
