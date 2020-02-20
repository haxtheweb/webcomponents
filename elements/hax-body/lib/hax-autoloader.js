import { LitElement, html, css } from "lit-element/lit-element.js";
import { HAXElement } from "@lrnwebcomponents/hax-body-behaviors/hax-body-behaviors.js";
import { varGet } from "@lrnwebcomponents/utils/utils.js";

/**
 * `hax-autoloader`
 * @customElement hax-autoloader
 * `Automatically load elements based on the most logical location with future fallback support for CDNs.`
 * @microcopy - the mental model for this element
 * - hax-autoloader - autoloading of custom element imports which can then emmit events as needed
 * @customElement hax-autoloader
 */
class HaxAutoloader extends HAXElement(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: none;
        }
      `
    ];
  }
  render() {
    return html`
      <slot></slot>
    `;
  }
  static get tag() {
    return "hax-autoloader";
  }
  // simple path from a url modifier
  pathFromUrl(url) {
    return url.substring(0, url.lastIndexOf("/") + 1);
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * List of elements processed so we don't double process
       */
      processedList: {
        type: Object
      }
    };
  }
  constructor() {
    super();
    this.processedList = {};
  }
  /**
   * LitElement ready life cycle
   */
  firstUpdated(changedProperties) {
    // fire an event that this is a core piece of the system
    this.dispatchEvent(
      new CustomEvent("hax-register-core-piece", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          piece: "haxAutoloader",
          object: this
        }
      })
    );
  }
  connectedCallback() {
    super.connectedCallback();
    this.observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          this.processNewElements(node);
        });
      });
    });
    this.observer.observe(this, {
      childList: true
    });
  }
  disconnectedCallback() {
    this.observer.disconnect();
    super.disconnectedCallback();
  }
  /**
   * Process new elements
   */
  processNewElements(e) {
    // when new nodes show up in the slots then fire the needed pieces
    let effectiveChildren = this.childNodes;
    for (var i = 0; i < effectiveChildren.length; i++) {
      // strip invalid tags / textnodes
      if (
        typeof effectiveChildren[i].tagName !== typeof undefined &&
        typeof this.processedList[effectiveChildren[i].tagName] ===
          typeof undefined
      ) {
        // attempt a dynamic import with graceful failure / fallback
        try {
          let name = effectiveChildren[i].tagName.toLowerCase();
          // see if we already have this definition
          if (typeof effectiveChildren[i].getHaxProperties === "function") {
            const evt = new CustomEvent("hax-register-properties", {
              bubbles: true,
              composed: true,
              cancelable: true,
              detail: {
                tag: name,
                properties: effectiveChildren[i].getHaxProperties(),
                polymer: true
              }
            });
            context.dispatchEvent(evt);
          } else if (typeof effectiveChildren[i].HAXWiring === "function") {
            const evt = new CustomEvent("hax-register-properties", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: {
                tag: name,
                properties: effectiveChildren[i].HAXWiring.getHaxProperties(),
                polymer: false
              }
            });
            context.dispatchEvent(evt);
          } else {
            // @todo support CDN failover or a flag of some kind to ensure
            // this delivers locally or from remote
            // @todo need to support name spacing of packages so that we
            // don't assume they are all relative to lrnwebcomponents
            const basePath = this.pathFromUrl(
              decodeURIComponent(import.meta.url)
            );
            if (!window.customElements.get(name)) {
              let nameLocation = varGet(
                window.HaxStore,
                "instance.__appStoreData.autoloader." + name,
                `@lrnwebcomponents/${name}/${name}.js`
              );
              import(`${basePath}../../../${nameLocation}`)
                .then(response => {
                  // get the custom element definition we used to add that file
                  let CEClass = window.customElements.get(name);
                  if (!CEClass) {
                    console.error(
                      `${name} was not a valid custom element yet a load was attempted`
                    );
                  } else if (typeof CEClass.getHaxProperties === "function") {
                    this.setHaxProperties(CEClass.getHaxProperties(), name);
                  } else if (typeof CEClass.HAXWiring === "function") {
                    this.setHaxProperties(
                      CEClass.HAXWiring.getHaxProperties(),
                      name
                    );
                  } else if (CEClass.haxProperties) {
                    this.setHaxProperties(CEClass.haxProperties, name);
                  } else {
                    console.warn(`${name} didn't have hax wiring in the end`);
                  }
                })
                .catch(error => {
                  /* Error handling */
                  console.warn(error);
                });
            } else {
              // get the custom element definition we used to add that file
              let CEClass = window.customElements.get(name);
              if (!CEClass) {
                console.error(
                  `${name} was not a valid custom element yet a load was attempted`
                );
              } else if (typeof CEClass.getHaxProperties === "function") {
                this.setHaxProperties(CEClass.getHaxProperties(), name);
              } else if (typeof CEClass.HAXWiring === "function") {
                this.setHaxProperties(
                  CEClass.HAXWiring.getHaxProperties(),
                  name
                );
              } else if (CEClass.haxProperties) {
                this.setHaxProperties(CEClass.haxProperties, name);
              } else {
                console.warn(`${name} didn't have hax wiring in the end`);
              }
            }
          }
          this.processedList[name] = name;
        } catch (err) {
          // error in the event this is a double registration
        }
      }
      effectiveChildren[i].remove();
    }
  }
}
window.customElements.define(HaxAutoloader.tag, HaxAutoloader);
export { HaxAutoloader };
