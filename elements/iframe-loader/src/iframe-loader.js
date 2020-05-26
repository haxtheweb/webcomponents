import { LitElement, html, css } from "lit-element/lit-element.js";
import { FlattenedNodesObserver } from "@polymer/polymer/lib/utils/flattened-nodes-observer.js";
import "./loading-indicator.js"

class IframeLoader extends LitElement {
  static get properties() {
    return {
      loading: { type: Boolean },
      __iframeHeight: { type: Number }
    };
  }
  static get styles() {
    return css`
      :host {
        display: block;
      }
      #container {
        position: relative;
        overflow: hidden;
        transition: height .4s ease-in-out;
      }
      #loading-screen {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 50%;
      }
      .loaded#container {
        height: auto;
        overflow: visible;
      }
      .loaded #loading-screen {
        display: none;
      }
      #slot {
        transition: opacity 1s ease-in-out;
      }
    `;
  }
  constructor() {
    super();
    this.loading = true;
    this.__iframeHeight = 100;
    this.__iframe = null;
    this.__mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.target.offsetHeight) {
          // if we are still in the loading state
          if (this.loading && mutation.target.offsetHeight > 100) {
            this.loading = false;
            this.__iframeHeight = mutation.target.offsetHeight + 25;
          }
        }
      })
    })
  }
  connectedCallback() {
    super.connectedCallback();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
  }
  firstUpdated() {
    this.__observer = new FlattenedNodesObserver(this.shadowRoot.querySelector('slot'), (info) => {
      if (info.addedNodes.length > 0) {
        info.addedNodes.forEach(item => {
          let iframe = null;
          if (item.nodeName === "IFRAME") {
            iframe = item
          }
          else if (item.querySelector) {
            const selector = item.querySelector("iframe");
            if (selector) {
              iframe = selector;
            }
          }
          if (iframe) {
            this.__iframe = iframe;
            // add lazy loading
            // Evergreen only right now.
            iframe.loading = 'lazy';
            this.__mutationObserver.observe(this.__iframe, { attributes: true })
          }
        })
      }
    })
  }

  updated(propertiesChanged) {
    propertiesChanged.forEach((oldValue, propName) => {
      if (propName === 'loading') {
        if (this.loading === false) {
          if (this.__observer) {
            this.__observer.disconnect();
          }
        }
      }
    });
  }

  render() {
    return html`
      <div id="container" class="${this.loading ? 'loading' : 'loaded' }" style="height: ${this.__iframeHeight}px;">
        <div id="loading-screen">
          <loading-indictor></loading-indictor>
        </div>
        <div id="slot" style="height: ${this.__iframeHeight}px; opacity: ${this.loading ? '0' : '1'}">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
customElements.define("iframe-loader", IframeLoader);
