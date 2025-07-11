import { LitElement, html, css } from "lit";
import "./lib/loading-indicator.js";

export class IframeLoader extends LitElement {
  static get tag() {
    return "iframe-loader";
  }
  static get properties() {
    return {
      loading: { type: Boolean },
      height: { type: String },
      width: { type: String },
      isPDF: {
        type: Boolean,
        reflect: true,
        attribute: "is-pdf",
      },
      disabled: {
        type: Boolean,
        reflect: true,
      },
      source: {
        type: String,
        reflect: true,
      },
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
      :host([disabled]) #container {
        z-index: 1;
        opacity: 0.2;
        background-color: white;
        transition: 0.3s linear all;
      }
      :host([disabled]) #container:hover {
        opacity: 0.6;
      }
      :host([disabled]) #slot {
        z-index: -1;
        pointer-events: none;
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
    this.isPDF = false;
    this.invalidSource = false;
    this.disabled = false;
    this.loading = true;
    this.height = 500;
    this.width = "100%";
    this.__iframe = null;
    // if we have an initial iframe, go for it
    if (this.querySelector("iframe")) {
      this.__iframe = this.querySelector("iframe");
      this.__iframe.addEventListener(
        "load",
        this.iframeLoadingCallback.bind(this),
      );
      // ensure source matches iframe source
      if (this.__iframe.getAttribute("src")) {
        this.source = this.__iframe.getAttribute("src");
        this.height = this.__iframe.getAttribute("height") || this.height;
        this.width = this.__iframe.getAttribute("width") || this.width;
      }
    } else {
      this.source = null;
    }
    this.__mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.offsetHeight) {
          // if we are still in the loading state
          if (this.loading) {
            this.height = mutation.target.offsetHeight;
          }
        }
      });
    });
    this.__observer = new MutationObserver((mutations) => {
      if (this.querySelector("iframe")) {
        this.__iframe = this.querySelector("iframe");
        this.source = this.__iframe.getAttribute("src");
        // Listen for new
        this.__iframe.addEventListener(
          "load",
          this.iframeLoadingCallback.bind(this),
        );
        this.__mutationObserver.observe(this.__iframe, {
          attributes: true,
        });
      }
    });
    this.__observer.observe(this, {
      childList: true,
    });
    // parent iframe loader gobbles child. this is to avoid issues
    if (this.querySelector("iframe-loader")) {
      this.querySelector("iframe-loader").remove();
    }
  }

  iframeLoadingCallback(e) {
    clearTimeout(this.__debounce);
    this.__debounce = setTimeout(() => {
      this.loading = false;
      if (e && e.path && e.path[0] && e.path[0].height) {
        this.height = e.path[0].height;
      }
    }, 500);
  }

  // Support being an editing interface element for HAX
  haxHooks() {
    return {
      preProcessNodeToContent: "haxpreProcessNodeToContent",
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
    };
  }
  // about to convert to content, ensure we are no longer the editable-table
  async haxpreProcessNodeToContent(node) {
    node.disabled = false;
    return node;
  }
  // ALWAYS enable edit mode if HAX is around
  haxactiveElementChanged(el, val) {
    if (this.__iframe) {
      if (this.source !== this.__iframe.getAttribute("src")) {
        this.source = this.__iframe.getAttribute("src");
      }
    } else {
      if (el && el.src && this.source !== el.src) {
        this.source = el.src;
      }
    }
    this.disabled = true;
    el.disabled = true;
    return el;
  }
  // allow HAX to toggle edit state when activated
  haxeditModeChanged(val) {
    setTimeout(() => {
      this.disabled = val;
    }, 0);
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
  /**
   * LitElement lifecycle
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    if (!this.querySelector("iframe")) {
      this.__iframe = globalThis.document.createElement("iframe");
      this.__iframe.setAttribute("width", this.width);
      this.__iframe.setAttribute("height", this.height);
      this.__mutationObserver.observe(this.__iframe, {
        attributes: true,
      });
      this.__iframe.setAttribute("src", this.source);
      // PDFs can't work if this security is applied so we need to check
      if (!this.isPDF) {
        this.__iframe.setAttribute(
          "sandbox",
          "allow-scripts allow-same-origin",
        );
      }
      this.appendChild(this.__iframe);
    }
    if (
      globalThis.HaxStore &&
      globalThis.HaxStore.instance &&
      globalThis.HaxStore.instance.editMode
    ) {
      this.disabled = true;
    }
  }
  /**
   * HTMLElement lifecycle
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.__iframe) {
      this.__iframe.removeEventListener(
        "load",
        this.iframeLoadingCallback.bind(this),
      );
    }
    this.__observer.disconnect();
  }
  /**
   * LitElement lifecycle
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (!this.invalidSource) {
        if (propName === "isPDF" && this.__iframe) {
          if (this.isPDF) {
            this.__iframe.removeAttribute("sandbox");
          } else {
            this.__iframe.setAttribute(
              "sandbox",
              "allow-scripts allow-same-origin",
            );
          }
        } else if (propName === "source") {
          this.isPDF = false;
          // test if source is a PDF
          if (this.source && this.source.endsWith(".pdf")) {
            this.isPDF = true;
          }

          if (this.__iframe) {
            if (this.isPDF) {
              this.__iframe.removeAttribute("sandbox");
            } else {
              this.__iframe.setAttribute(
                "sandbox",
                "allow-scripts allow-same-origin",
              );
            }
            this.__iframe.setAttribute("src", this.source);
          } else {
            this.__iframe = globalThis.document.createElement("iframe");
            this.__iframe.setAttribute("width", this.width);
            this.__iframe.setAttribute("height", this.height);
            this.__mutationObserver.observe(this.__iframe, {
              attributes: true,
            });
            if (this.isPDF) {
              this.__iframe.removeAttribute("sandbox");
            } else {
              this.__iframe.setAttribute(
                "sandbox",
                "allow-scripts allow-same-origin",
              );
            }
            this.__iframe.setAttribute("src", this.source);
            this.appendChild(this.__iframe);
          }
        } else if (["height", "width"].includes(propName)) {
          if (this.__iframe) {
            this.__iframe.setAttribute(propName, this[propName]);
          }
        }
      }
    });
  }
  render() {
    return html`
      <div id="container" class="${this.loading ? "loading" : "loaded"}">
        <div id="loading-screen" style="height:${this.height}px;">
          <loading-indicator ?loading="${this.loading}"></loading-indicator>
        </div>
        <div id="slot" style="display: ${this.loading ? "none" : "block"}">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
globalThis.customElements.define(IframeLoader.tag, IframeLoader);
