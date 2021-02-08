import { LitElement, html, css } from "lit-element/lit-element.js";
import { FlattenedNodesObserver } from "@polymer/polymer/lib/utils/flattened-nodes-observer.js";
import "./lib/loading-indicator.js";

class IframeLoader extends LitElement {
  static get properties() {
    return {
      loading: { type: Boolean },
      __iframeHeight: { type: Number },
    };
  }
  static get styles() {
    return css`
      :host {
        display: block;
      }
      #container {
        position: relative;
      }
      #loading-screen {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .loaded #loading-screen {
        display: none;
      }
    `;
  }
  constructor() {
    super();
    this.loading = true;
    this.__iframeLoaded = false;
    this.__iframeHeight = 100;
    this.__iframe = null;
    this.__mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.offsetHeight) {
          // if we are still in the loading state
          if (this.loading) {
            this.__iframeHeight = mutation.target.offsetHeight;
          }
        }
      });
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.__iframe.removeEventListener("load", (e) => {
      setTimeout(() => {
        this.loading = false;
        if (e.path[0].height) {
          this.__iframeHeight = e.path[0].height;
        }
      }, 500);
    });
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.__observer = new FlattenedNodesObserver(
      this.shadowRoot.querySelector("slot"),
      (info) => {
        if (info.addedNodes.length > 0) {
          info.addedNodes.forEach((item) => {
            let iframe = null;
            if (item.nodeName === "IFRAME") {
              iframe = item;
            } else if (item.querySelector) {
              const selector = item.querySelector("iframe");
              if (selector) {
                iframe = selector;
              }
            }
            if (iframe) {
              this.__iframe = iframe;
              // Listen for new
              this.__iframe.addEventListener("load", (e) => {
                setTimeout(() => {
                  this.loading = false;
                  if (e.path[0].height) {
                    this.__iframeHeight = e.path[0].height;
                  }
                }, 500);
              });
              this.__mutationObserver.observe(this.__iframe, {
                attributes: true,
              });
            }
          });
        }
      }
    );
  }
  render() {
    return html`
      <div id="container" class="${this.loading ? "loading" : "loaded"}">
        <div id="loading-screen" style="height:${this.__iframeHeight}px;">
          <loading-indicator></loading-indicator>
        </div>
        <div id="slot" style="display: ${this.loading ? "none" : "block"}">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
customElements.define("iframe-loader", IframeLoader);
