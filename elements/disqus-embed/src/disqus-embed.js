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
    this.pageURL = null;
    this.pageIdentifier = null;
    this.pageTitle = null;
    this.shortName = null;
    this.lang = "en";
  }

  static get properties() {
    return {
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

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // so we can target for anchor links if needed based on their docs
    this.setAttribute("id", "disqus_thread");
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          min-height: 64px;
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

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "shortName" && this[propName]) {
        clearTimeout(this._timeout);
        this._timeout = setTimeout(() => {
          this.createEmbedScript(this.shortName);
        }, 0);
      }
      // on ANY change to the element let's rebuild the configuration except initial shortName setting
      if (propName !== "shortName" && window.DISQUS) {
        clearTimeout(this._timeout);
        this._timeout = setTimeout(() => {
          this.rebuildConfiguration(
            this.pageIdentifier,
            this.pageURL,
            this.pageTitle,
            this.lang
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

  createEmbedScript(name) {
    // unset existing
    this.innerHTML = "";
    const embed = document.createElement("script");
    embed.setAttribute("data-timestamp", +new Date());
    embed.type = "text/javascript";
    embed.async = true;
    embed.src = `https://${name}.disqus.com/embed.js`;
    this.appendChild(embed);
  }

  rebuildConfiguration(identifier, url, title, lang) {
    if (window.DISQUS) {
      window.DISQUS.reset({
        reload: true,
        config: function () {
          this.page.identifier = identifier;
          this.page.url = url;
          this.page.title = title;
          this.language = lang;
        },
      });
    }
  }
}
customElements.define(DisqusEmbed.tag, DisqusEmbed);
export { DisqusEmbed };

// set initially and then modify based on prop changes in tag
window.disqus_config =
  window.disqus_config ||
  function () {
    this.language = "en";
  };
