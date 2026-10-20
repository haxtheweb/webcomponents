/**
 * `twitter-embed-vanilla`
 * `A simple way to embed tweets from twitter without their whole API.
 *
 * @demo demo/index.html
 * @element twitter-embed-vanilla
 */
const FALLBACK_LANG = "en";
const FALLBACK_WIDTH = "550px";

/**
 * True when `value` is an http(s) URL (scheme-less "twitter.com/..." is
 * accepted too) whose parsed hostname is x.com / twitter.com or a subdomain
 * of either, so the domain in a path or query string does not count.
 */
function isTweetUrl(value) {
  try {
    const text = `${value}`.trim();
    const url = new URL(
      /^[a-z][a-z0-9+.-]*:/i.test(text) || text.startsWith("/")
        ? text
        : `https://${text}`,
      "https://placeholder.invalid/",
    );
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return false;
    }
    const host = url.hostname.toLowerCase();
    return ["twitter.com", "x.com"].some(
      (domain) => host === domain || host.endsWith("." + domain),
    );
  } catch {
    return false;
  }
}
// security: every value interpolated into the innerHTML template below is
// validated against a strict pattern and then escaped, so author / imported
// attribute values can not break out of the markup (DOM XSS)
function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function safeTweetId(value) {
  const match = String(value || "").match(/^\d+/);
  return match ? match[0] : "";
}
function safeWidth(value) {
  return /^\d+(\.\d+)?(px|%|em|rem|vw)?$/.test(String(value || ""))
    ? String(value)
    : FALLBACK_WIDTH;
}
function safeLang(value) {
  return /^[a-zA-Z]{2,8}(-[a-zA-Z0-9]{1,8})*$/.test(String(value || ""))
    ? String(value)
    : FALLBACK_LANG;
}
class TwitterEmbedVanilla extends HTMLElement {
  static get tag() {
    return "twitter-embed-vanilla";
  }
  /**
   * HTMLElement spec / class based architecture in general
   */
  constructor() {
    super();
    this.__initialized = false;
  }
  /**
   * HTMLElement spec; attributes can not be read or written in the
   * constructor (document.createElement), so defaults are applied here.
   */
  connectedCallback() {
    if (this.__initialized) return;
    this.__initialized = true;
    if (globalThis.document && globalThis.document.body) {
      this.lang =
        this.getAttribute("lang") ||
        globalThis.document.body.getAttribute("xml:lang") ||
        globalThis.document.body.getAttribute("lang") ||
        globalThis.document.documentElement.getAttribute("xml:lang") ||
        globalThis.document.documentElement.getAttribute("lang") ||
        globalThis.navigator.language ||
        FALLBACK_LANG;
    } else {
      this.lang = FALLBACK_LANG;
    }
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
    // an authored no-popups attribute was already handled by
    // attributeChangedCallback (which runs before connection); only
    // apply the default when it is absent
    if (!this.hasAttribute("no-popups")) this.allowPopups = "allow-popups";
  }
  /**
   * HTMLElement spec
   */
  static get observedAttributes() {
    return [
      "lang",
      "tweet",
      "data-width",
      "data-theme",
      "tweet-id",
      "no-popups",
    ];
  }
  /**
   * HTMLElement spec
   */
  attributeChangedCallback(attr, oldValue, newValue) {
    if (attr == "tweet" && newValue && isTweetUrl(newValue)) {
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
    if (
      ["lang", "no-popups", "tweet-id", "data-width", "data-theme"].includes(
        attr,
      )
    ) {
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
    if (value == "" || value == null) {
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
    // cross-origin isolated pages (COEP+COOP, e.g. `hax serve` dev mode)
    // block third-party embed frames that don't opt into credentialless
    // loading; twitter's embed is always cross-origin so this is a fixed
    // origin check
    const credentialless =
      globalThis.crossOriginIsolated === true ? " credentialless" : "";
    const width = escapeAttr(safeWidth(this.dataWidth));
    const tweetId = escapeAttr(safeTweetId(this.tweetId));
    const lang = escapeAttr(encodeURIComponent(safeLang(this.lang)));
    const theme = this.dataTheme === "dark" ? "dark" : "light";
    const popups = this.allowPopups === "allow-popups" ? "allow-popups" : "";
    return `
    <div
      class="twitter-tweet twitter-tweet-rendered"
      style="display: flex; max-width: ${width}; width: 100%; margin-top: 10px; margin-bottom: 10px;">
      <iframe
        sandbox="allow-same-origin allow-scripts ${popups}"
        scrolling="no"
        frameborder="0"
        loading="lazy"
        allowtransparency="true"
        allow="autoplay; encrypted-media; fullscreen"${credentialless}
        referrerpolicy="strict-origin-when-cross-origin"
        style="position: static; visibility: visible; width: ${width}; height: 498px; display: block; flex-grow: 1;"
        title="Twitter Tweet"
        src="https://platform.twitter.com/embed/index.html?dnt=true&amp&amp;frame=false&amp;hideCard=false&amp;hideThread=false&amp;id=${tweetId}&amp;lang=${lang}&amp;theme=${theme}&amp;widgetsVersion=223fc1c4%3A1596143124634&amp;width=${escapeAttr(encodeURIComponent(safeWidth(this.dataWidth)))}"
        data-tweet-id="${tweetId}">
      </iframe>
    </div>`;
  }
}
globalThis.customElements.define(TwitterEmbedVanilla.tag, TwitterEmbedVanilla);
export { TwitterEmbedVanilla };
