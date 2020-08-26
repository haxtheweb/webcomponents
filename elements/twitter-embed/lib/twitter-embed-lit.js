import { LitElement, html } from "lit-element/lit-element.js";
/**
 * `twitter-embed`
 * `A simple way to embed tweets from twitter without their whole API, with LitElement
 *
 * @demo demo/index.html
 * @element twitter-embed
 */
class TwitterEmbedLit extends LitElement {
  static get tag() {
    return "twitter-embed-lit";
  }
  /**
   * HTMLElement spec
   */
  constructor() {
    super();
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
        type: String
      },
      dataWidth: {
        type: String,
        attribute: "data-width"
      },
      dataTheme: {
        type: String,
        attribute: "data-theme"
      },
      tweetId: {
        type: String,
        attribute: "tweet-id"
      },
      noPopups: {
        type: Boolean,
        attribute: "no-popups"
      },
      allowPopups: {
        type: String
      }
    };
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
          sandbox="allow-same-origin allow-scripts ${this.allowPopups}"
          scrolling="no"
          frameborder="0"
          loading="lazy"
          allowtransparency="true"
          allowfullscreen
          style="position: static; visibility: visible; width: ${this
            .dataWidth}; height: 498px; display: block; flex-grow: 1;"
          title="Twitter Tweet"
          src="https://platform.twitter.com/embed/index.html?dnt=true&amp;frame=false&amp;hideCard=false&amp;hideThread=false&amp;id=${this
            .tweetId}&amp;lang=en&amp;origin=http%3A%2F%2Flocalhost%3A8000%2Felements%2Ftwitter-embed%2Fdemo%2Findex.html&amp;theme=${this
            .dataTheme}&amp;widgetsVersion=223fc1c4%3A1596143124634&amp;width=${this
            .dataWidth}"
          data-tweet-id="${this.tweetId}"
        >
        </iframe>
      </div>
    `;
  }
}

customElements.define(TwitterEmbedLit.tag, TwitterEmbedLit);
export { TwitterEmbedLit };
