/**
 * `twitter-embed-vanilla`
 * `A simple way to embed tweets from twitter without their whole API.
 *
 * @demo demo/index.html
 * @element twitter-embed-vanilla
 */
class TwitterEmbedVanilla extends HTMLElement {
  static get tag() {
    return "twitter-embed-vanilla";
  }
  /**
   * HTMLElement spec / class based architecture in general
   */
  constructor() {
    super();
    this.lang = (document && document.documentElement && document.documentElement.lang) ? document.documentElement.lang : "en";
    this.dataWidth = this.getAttribute("data-width")
      ? this.getAttribute("data-width")
      : "550px";
    this.dataTheme = this.getAttribute("data-theme")
      ? this.getAttribute("data-theme")
      : "light";
    this.tweet = this.getAttribute("tweet") ? this.getAttribute("tweet") : null;
    this.tweetId = this.getAttribute("tweet-id")
      ? this.getAttribute("tweet-id")
      : null;
    this.allowPopups = this.getAttribute("no-popups") ? "" : "allow-popups";
  }
  /**
   * HTMLElement spec
   */
  static get observedAttributes() {
    return ["lang", "tweet", "data-width", "data-theme", "tweet-id", "no-popups"];
  }
  /**
   * HTMLElement spec
   */
  attributeChangedCallback(attr, oldValue, newValue) {
    if (attr == "tweet" && newValue && newValue.includes("twitter.com")) {
      this.tweetId = newValue.split("/").pop();
    }
    if (attr == "no-popups") {
      this.allowPopups =
        newValue == "no-popups" ||
        newValue == "" ||
        !newValue ||
        newValue == null ||
        newValue == "null"
          ? ""
          : "allow-popups";
    }
    if (["lang", "no-popups", "tweet-id", "data-width", "data-theme"].includes(attr)) {
      this.innerHTML = this.html;
    }
  }
  get dataWidth() {
    return this.getAttribute("data-width");
  }
  set dataWidth(value) {
    if (value == null || !value) {
      this.removeAttribute("data-width");
    } else {
      this.setAttribute("data-width", value);
    }
  }
  get dataTheme() {
    return this.getAttribute("data-theme");
  }
  set dataTheme(value) {
    if (!value || !["dark", "light"].includes(value)) {
      this.dataTheme = "light";
    } else {
      this.setAttribute("data-theme", value);
    }
  }
  get lang() {
    return this.getAttribute("lang");
  }
  set lang(value) {
    if (value == '' || value == null) {
      this.removeAttribute("lang");
    } else {
      this.setAttribute("lang", value);
    }
  }
  get tweetId() {
    return this.getAttribute("tweet-id");
  }
  set tweetId(value) {
    if (value == null) {
      this.removeAttribute("tweet-id");
    } else {
      this.setAttribute("tweet-id", value);
    }
  }
  get tweet() {
    return this.getAttribute("tweet");
  }
  set tweet(value) {
    if (value == null) {
      this.removeAttribute("tweet");
    } else {
      this.setAttribute("tweet", value);
    }
  }
  /**
   * my own convention, easy to remember
   */
  get html() {
    return `
    <div
      class="twitter-tweet twitter-tweet-rendered"
      style="display: flex; max-width: ${
        this.dataWidth
      }; width: 100%; margin-top: 10px; margin-bottom: 10px;">
      <iframe
        sandbox="allow-same-origin allow-scripts ${this.allowPopups}"
        scrolling="no"
        frameborder="0"
        loading="lazy"
        allowtransparency="true"
        allowfullscreen="true"
        style="position: static; visibility: visible; width: ${
          this.dataWidth
        }; height: 498px; display: block; flex-grow: 1;"
        title="Twitter Tweet"
        src="https://platform.twitter.com/embed/index.html?dnt=true&amp&amp;frame=false&amp;hideCard=false&amp;hideThread=false&amp;id=${
          this.tweetId
        }&amp;lang=${this.lang}&amp;theme=${
      this.dataTheme
    }&amp;widgetsVersion=223fc1c4%3A1596143124634&amp;width=${this.dataWidth}"
        data-tweet-id="${this.tweetId}">
      </iframe>
    </div>`;
  }
  /**
   * Attached to the DOM, now fire.
   */
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Twitter embed",
        description: "Embed a tweet from twitter in context",
        icon: "hax:meme",
        color: "blue",
        groups: ["Social Media"],
        handles: [],
        meta: {
          author: "ELMS:LN"
        }
      },
      settings: {
        quick: [],
        configure: [
          {
            attribute: "tweet",
            title: "Tweet URL",
            description: "URL of the tweet in question to be embedded",
            inputMethod: "textfield"
          },
          {
            attribute: "data-theme",
            title: "Theme",
            description: "Light or dark version of twitter tweets",
            inputMethod: "select",
            options: {
              light: "Light",
              dark: "Dark"
            }
          },
          {
            attribute: "no-popups",
            title: "Prevent popup on click",
            description:
              "This blocks the user from clicking the tweet and going to twitter.com",
            inputMethod: "boolean"
          }
        ],
        advanced: []
      },
      saveOptions: {
        wipeSlot: true
      },
      demoSchema: [
        {
          tag: "twitter-embed-vanilla",
          content: "",
          properties: {
            tweet: "https://twitter.com/btopro/status/1298632260707639298"
          }
        }
      ]
    };
  }
}
customElements.define(TwitterEmbedVanilla.tag, TwitterEmbedVanilla);
export { TwitterEmbedVanilla };