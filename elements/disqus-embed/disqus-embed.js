/**
 * Copyright 2024
 * @license , see License.md for full text.
 */
import { LitElement, html, css } from "lit";
/**
 * `disqus-embed`
 * `Disqus service integration`
 * @demo demo/index.html
 * @element disqus-embed
 */
class DisqusEmbed extends LitElement {
  constructor() {
    super();
    this.loadingText = "Loading comments..";
    this.pageURL = null;
    this.pageIdentifier = null;
    this.pageTitle = null;
    this.shortName = null;
    this.lang = "en";
  }

  static get properties() {
    return {
      loadingText: { type: String, attribute: "loading-text" },
      pageURL: {
        type: String,
        attribute: "page-url",
      },
      pageIdentifier: {
        type: String,
        attribute: "page-identifier",
      },
      pageTitle: {
        type: String,
        attribute: "page-title",
      },
      shortName: {
        type: String,
        attribute: "short-name",
      },
      lang: {
        type: String,
      },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          min-height: 64px;
          background-color: white;
          color: black;
          border-radius: 16px;
          border: 2px solid black;
          padding: 24px;
        }
      `,
    ];
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`<slot>${this.loadingText}</slot>`;
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "shortName" && this[propName]) {
        DisqusInstance.createEmbedScript(this, this.shortName);
      }
      // on ANY change to the element let's rebuild the configuration except initial shortName setting
      if (propName !== "shortName" && globalThis.DISQUS) {
        clearTimeout(this._timeout);
        this._timeout = setTimeout(() => {
          DisqusInstance.rebuildConfiguration(
            this,
            this.pageIdentifier,
            this.pageURL,
            this.pageTitle,
            this.lang,
          );
        }, 100);
      }
    });
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "disqus-embed";
  }
  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    // ensure we're correctly built when connected
    clearTimeout(this._timeout);
    this._timeout = setTimeout(() => {
      DisqusInstance.rebuildConfiguration(
        this,
        this.pageIdentifier,
        this.pageURL,
        this.pageTitle,
        this.lang,
      );
    }, 100);
  }
  disconnectedCallback() {
    // if we are about to disconnect, ensure the lightDom's children
    // get sent back to the Disqus instance. This could be a theme
    // changing / the element moving around and needing to be reconnected
    // later on
    while (this.childNodes.length > 0) {
      DisqusInstance.appendChild(this.childNodes[0]);
    }
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
  }
}
customElements.define(DisqusEmbed.tag, DisqusEmbed);
export { DisqusEmbed };

class DisqusBroker extends LitElement {
  constructor() {
    super();
    // use this to store a reference to what is rendering the disqus visually
    // this also gets called in teh callbacks so that when events happen we can
    // move Disqus to the visual target once it's safe to do so
    this.renderTarget = null;
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // this ensures that the container gets populated from the jQuery-esk calls
    // to the global document
    this.setAttribute("id", "disqus_thread");
  }

  static get styles() {
    return [
      css`
        :host {
          display: none;
        }
      `,
    ];
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`<slot></slot>`;
  }

  /**
   * Convention we use
   */
  static get tag() {
    return "disqus-broker";
  }

  createEmbedScript(target, name) {
    this.renderTarget = target;
    this.innerHTML = "";
    if (!this._embed) {
      this._embed = document.createElement("script");
      this._embed.setAttribute("data-timestamp", +new Date());
      this._embed.type = "text/javascript";
      this._embed.async = true;
      this._embed.src = `https://${name}.disqus.com/embed.js`;
      this.insertAdjacentElement("afterend", this._embed);
    }
  }

  // when anything changes we need to ensure that we rebuild / reset Disqus object
  rebuildConfiguration(target, identifier, url, title, lang) {
    if (globalThis.DISQUS) {
      this.renderTarget = target;
      this.innerHTML = "";
      while (this.renderTarget.childNodes.length > 0) {
        this.appendChild(this.renderTarget.childNodes[0]);
      }
      setTimeout(() => {
        globalThis.DISQUS.reset({
          reload: true,
          config: function () {
            this.page.identifier = identifier;
            this.page.url = url;
            this.page.title = title;
            this.language = lang;
          },
        });
        setTimeout(() => {
          this.renderToTarget();
        }, 100);
      }, 500);
    }
  }

  renderToTarget() {
    // debounce to ensure we don't spam render
    // since we don't have control over the API in disqus as to how often or when
    // it decides to fire
    clearTimeout(this._timeout);
    this._timeout = setTimeout(() => {
      while (this.childNodes.length > 0) {
        this.renderTarget.appendChild(this.childNodes[0]);
      }
    }, 100);
  }

  // This brokers the 'events' that take place in the undocumented aspects of the
  // Disqus API. Brittle potentially but these were written in 2012 and still work as of 2023
  // so probably safe
  apiCallback(call) {
    switch (call) {
      // ready to use, render to target
      case "onReady":
      // user identified / logged in; this can fire multiple times
      case "onIdentify":
        this.renderToTarget();
        break;
      // the user posted a new comment or replied
      case "onNewComment":
      default:
        console.log(call);
        break;
    }
  }
}
customElements.define(DisqusBroker.tag, DisqusBroker);
export { DisqusBroker };

globalThis.DisqusSingleton = globalThis.DisqusSingleton || {};
globalThis.DisqusSingleton.requestAvailability = () => {
  if (
    !globalThis.DisqusSingleton.instance &&
    globalThis.document &&
    globalThis.document.body
  ) {
    globalThis.DisqusSingleton.instance = document.createElement(
      DisqusBroker.tag,
    );
    globalThis.document.body.insertAdjacentElement(
      "afterbegin",
      globalThis.DisqusSingleton.instance,
    );
  }
  return globalThis.DisqusSingleton.instance;
};
// most common way to access registry
export const DisqusInstance = globalThis.DisqusSingleton.requestAvailability();

// set initially and then modify based on prop changes in tag
globalThis.disqus_config =
  globalThis.disqus_config ||
  function () {
    this.language = "en";
    this.callbacks.onReady = [
      function () {
        DisqusInstance.apiCallback("onReady");
      },
    ];
    this.callbacks.onIdentify = [
      function () {
        DisqusInstance.apiCallback("onIdentify");
      },
    ];
    this.callbacks.afterRender = [
      function () {
        DisqusInstance.apiCallback("afterRender");
      },
    ];
    this.callbacks.beforeComment = [
      function () {
        DisqusInstance.apiCallback("beforeComment");
      },
    ];
    this.callbacks.onInit = [
      function () {
        DisqusInstance.apiCallback("onInit");
      },
    ];
    this.callbacks.onNewComment = [
      function () {
        DisqusInstance.apiCallback("onNewComment");
      },
    ];
    this.callbacks.onPaginate = [
      function () {
        DisqusInstance.apiCallback("onPaginate");
      },
    ];
    this.callbacks.preData = [
      function () {
        DisqusInstance.apiCallback("preData");
      },
    ];
    this.callbacks.preReset = [
      function () {
        DisqusInstance.apiCallback("preReset");
      },
    ];
  };
