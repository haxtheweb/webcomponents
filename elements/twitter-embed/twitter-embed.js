import { LitElement, html, css } from "lit-element/lit-element.js";
const FALLBACK_LANG = "en";

/**
 * `twitter-embed`
 * `A simple way to embed tweets from twitter without their whole API, with LitElement
 *
 * @demo demo/index.html
 * @element twitter-embed
 */
class TwitterEmbed extends LitElement {
  static get tag() {
    return "twitter-embed";
  }
  /**
   * HTMLElement spec
   */
  constructor() {
    super();
    this.lang =
      document.body.getAttribute("xml:lang") ||
      document.body.getAttribute("lang") ||
      document.documentElement.getAttribute("xml:lang") ||
      document.documentElement.getAttribute("lang") ||
      navigator.language ||
      FALLBACK_LANG;
    this.dataWidth = "550px";
    this.dataTheme = "light";
    this.tweet = null;
    this.tweetId = null;
    this.allowPopups = "allow-popups";
  }
  /**
   * LitElement properties definition
   */
  static get properties() {
    return {
      tweet: {
        type: String,
      },
      lang: {
        type: String,
      },
      dataWidth: {
        type: String,
        attribute: "data-width",
      },
      dataTheme: {
        type: String,
        attribute: "data-theme",
      },
      tweetId: {
        type: String,
        attribute: "tweet-id",
      },
      noPopups: {
        type: Boolean,
        attribute: "no-popups",
      },
      allowPopups: {
        type: String,
      },
    };
  }
  /**
   * Attached to the DOM, now fire.
   */
  static get haxProperties() {
    return (
      decodeURIComponent(import.meta.url) +
      "/../lib/twitter-embed.haxProperties.json"
    );
  }
  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      gizmoRegistration: "haxgizmoRegistration",
    };
  }
  /**
   * Supply translations for the UI elements of HAX in meme-maker
   */
  haxgizmoRegistration(store) {
    window.dispatchEvent(
      new CustomEvent("i18n-manager-register-element", {
        detail: {
          namespace: "twitter-embed.haxProperties",
          localesPath: decodeURIComponent(import.meta.url) + "/../locales",
          locales: ["es"],
        },
      })
    );
  }
  /**
   * LitElement equivalent of attributeChangedCallback
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "noPopups") {
        if (this[propName]) {
          this.allowPopups = "";
        } else {
          this.allowPopups = "allow-popups";
        }
      }
      if (
        propName === "tweet" &&
        this[propName] &&
        this[propName].includes("twitter.com")
      ) {
        this.tweetId = this[propName].split("/").pop();
      }
    });
  }
  static get styles() {
    return [
      css`
        :host([contenteditable]) iframe {
          pointer-events: none;
        }
      `,
    ];
  }
  /**
   * Popular convention / LitElement
   */
  render() {
    return html`
      <div
        class="twitter-tweet twitter-tweet-rendered"
        style="display: flex; max-width: ${this
          .dataWidth}; width: 100%; margin-top: 10px; margin-bottom: 10px;"
      >
        <iframe
          .sandbox="allow-same-origin allow-scripts ${this.allowPopups}"
          scrolling="no"
          frameborder="0"
          loading="lazy"
          allowtransparency="true"
          allowfullscreen
          style="position: static; visibility: visible; width: ${this
            .dataWidth}; height: 498px; display: block; flex-grow: 1;"
          title="Twitter Tweet"
          src="https://platform.twitter.com/embed/index.html?dnt=true&amp;frame=false&amp;hideCard=false&amp;hideThread=false&amp;id=${this
            .tweetId}&amp;lang=${this.lang}&amp;theme=${this
            .dataTheme}&amp;widgetsVersion=223fc1c4%3A1596143124634&amp;width=${this
            .dataWidth}"
          data-tweet-id="${this.tweetId}"
        >
        </iframe>
      </div>
    `;
  }
}

customElements.define(TwitterEmbed.tag, TwitterEmbed);
export { TwitterEmbed };
