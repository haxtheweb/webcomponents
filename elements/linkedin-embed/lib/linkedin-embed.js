import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";

const FALLBACK_LOCALE = "en_US";
const TRACKING_PARAM = "profile-badge";
const CALLBACK_NAME = "LIBadgeCallback";

/**
 * `linkedin-embed`
 * `LinkedIn profile badge rendered without loading LinkedIn's profile.js file`
 * @demo demo/index.html
 * @element linkedin-embed
 */
class LinkedinEmbed extends DDD {
  static get tag() {
    return "linkedin-embed";
  }

  static get properties() {
    return {
      vanityname: { type: String, reflect: true },
      locale: { type: String },
      _haxstate: { type: Boolean },
      _prefersDark: { type: Boolean, attribute: false },
      _responsiveSize: { type: String, attribute: false },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          container-type: inline-size;
          max-inline-size: 100%;
        }
        .badge-shell {
          display: flex;
          justify-content: center;
          inline-size: 100%;
          box-sizing: border-box;
          padding: 0;
          border-radius: 0;
          background-color: transparent;
        }
        .badge-shell[data-theme="dark"] {
          background-color: transparent;
        }
        .badge-shell[data-size="small"] {
          --_linkedin-max-inline-size: 320px;
        }
        .badge-shell[data-size="medium"] {
          --_linkedin-max-inline-size: 380px;
        }
        .badge-shell[data-size="large"] {
          --_linkedin-max-inline-size: 460px;
        }
        .badge-shell.is-editing {
          pointer-events: none;
        }
        .badge-host {
          inline-size: 100%;
          max-inline-size: var(--_linkedin-max-inline-size, 460px);
          display: flex;
          justify-content: center;
          line-height: 0;
        }
        iframe {
          border: 0;
          display: block;
          max-inline-size: 100%;
          vertical-align: top;
          overflow: hidden;
          background-color: transparent;
        }
        @container (max-width: 500px) {
          .badge-shell {}
        }
      `,
    ];
  }

  constructor() {
    super();
    this.vanityname = "btopro";
    this.locale = FALLBACK_LOCALE;
    this._prefersDark = false;
    this._responsiveSize = "large";
    this._haxstate = false;
    this.__resizeObserver = null;
    this.__darkModeMediaQuery = null;
    this.__darkModeHandler = null;
    this.__lastRequestUid = null;
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    this.__watchContainer();
    this.__watchPreferredTheme();
    this.__ensureCallbackManager();
  }

  disconnectedCallback() {
    if (this.__resizeObserver) {
      this.__resizeObserver.disconnect();
    }
    if (this.__darkModeMediaQuery && this.__darkModeHandler) {
      if (this.__darkModeMediaQuery.removeEventListener) {
        this.__darkModeMediaQuery.removeEventListener(
          "change",
          this.__darkModeHandler,
        );
      } else if (this.__darkModeMediaQuery.removeListener) {
        this.__darkModeMediaQuery.removeListener(this.__darkModeHandler);
      }
    }
    if (this.__lastRequestUid) {
      this.__removePendingHandler(this.__lastRequestUid);
      this.__lastRequestUid = null;
    }
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has("vanityname")) {
      this.vanityname = this.__normalizeVanityname(this.vanityname);
    }
    if (changedProperties.has("locale") && !this.locale) {
      this.locale = FALLBACK_LOCALE;
    }
    if (
      !this._haxstate &&
      (changedProperties.has("vanityname") ||
        changedProperties.has("locale") ||
        changedProperties.has("_responsiveSize") ||
        changedProperties.has("_prefersDark"))
    ) {
      this.__requestBadgeMarkup();
    }
  }

  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
    };
  }

  haxactiveElementChanged(el, value) {
    if (value) {
      this._haxstate = value;
    }
    return el;
  }

  haxeditModeChanged(value) {
    this._haxstate = value;
  }

  __normalizeVanityname(value) {
    if (!value || typeof value !== "string") {
      return "btopro";
    }
    return value.replace("https://www.linkedin.com/in/", "").replaceAll("/", "").trim();
  }

  __watchPreferredTheme() {
    if (!globalThis.matchMedia) {
      return;
    }
    this.__darkModeMediaQuery = globalThis.matchMedia(
      "(prefers-color-scheme: dark)",
    );
    this._prefersDark = this.__darkModeMediaQuery.matches;
    this.__darkModeHandler = (event) => {
      this._prefersDark = event.matches;
      this.requestUpdate();
    };
    if (this.__darkModeMediaQuery.addEventListener) {
      this.__darkModeMediaQuery.addEventListener("change", this.__darkModeHandler);
    } else if (this.__darkModeMediaQuery.addListener) {
      this.__darkModeMediaQuery.addListener(this.__darkModeHandler);
    }
  }

  __watchContainer() {
    if (typeof ResizeObserver !== "function" || this.__resizeObserver) {
      return;
    }
    this.__resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const width =
          entry && entry.contentRect && entry.contentRect.width
            ? entry.contentRect.width
            : this.offsetWidth;
        this.__setResponsiveSize(width);
      });
    });
    this.__resizeObserver.observe(this);
  }

  __setResponsiveSize(width) {
    let nextSize = "large";
    if (width < 330) {
      nextSize = "small";
    } else if (width < 500) {
      nextSize = "medium";
    }
    if (nextSize !== this._responsiveSize) {
      this._responsiveSize = nextSize;
    }
  }

  __ensureCallbackManager() {
    if (!globalThis.__linkedinBadgeCallbackManager) {
      const manager = {
        handlers: {},
        previousCallback: globalThis[CALLBACK_NAME],
      };
      globalThis[CALLBACK_NAME] = (badgeHtml, badgeUid) => {
        if (manager.handlers[badgeUid]) {
          manager.handlers[badgeUid](badgeHtml, badgeUid);
          delete manager.handlers[badgeUid];
        }
        if (
          manager.previousCallback &&
          manager.previousCallback !== globalThis[CALLBACK_NAME]
        ) {
          manager.previousCallback(badgeHtml, badgeUid);
        }
      };
      globalThis.__linkedinBadgeCallbackManager = manager;
    }
    return globalThis.__linkedinBadgeCallbackManager;
  }

  __removePendingHandler(uid) {
    const manager = this.__ensureCallbackManager();
    if (manager.handlers[uid]) {
      delete manager.handlers[uid];
    }
  }

  __generateBaseUrl() {
    const hostName =
      globalThis.location && globalThis.location.hostname
        ? globalThis.location.hostname
        : "";
    const isCNDomain = /linkedin(-ei)?\.cn$/.test(hostName);
    return isCNDomain ? "https://badges.linkedin.cn/" : "https://badges.linkedin.com/";
  }

  __requestBadgeMarkup() {
    const badgeHost = this.renderRoot.querySelector(".badge-host");
    if (!badgeHost || !globalThis.document || !globalThis.document.body) {
      return;
    }
    if (this.__lastRequestUid) {
      this.__removePendingHandler(this.__lastRequestUid);
    }
    const uid = Math.round(1000000 * Math.random());
    this.__lastRequestUid = uid;
    const url = this.__buildBadgeUrl(uid);
    const manager = this.__ensureCallbackManager();
    manager.handlers[uid] = (badgeHtml, badgeUid) => {
      if (badgeUid === uid) {
        this.__lastRequestUid = null;
        this.__renderIframeBadge(badgeHtml, badgeHost);
      }
    };
    const script = globalThis.document.createElement("script");
    script.src = url;
    script.async = true;
    script.defer = true;
    script.addEventListener(
      "load",
      () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      },
      { once: true },
    );
    script.addEventListener(
      "error",
      () => {
        this.__removePendingHandler(uid);
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      },
      { once: true },
    );
    globalThis.document.body.appendChild(script);
  }

  __buildBadgeUrl(uid) {
    const queryParams = [
      `locale=${encodeURIComponent(this.locale)}`,
      "badgetype=VERTICAL",
      `badgetheme=${encodeURIComponent(this._effectiveTheme)}`,
      `uid=${encodeURIComponent(uid)}`,
      "version=v1",
      `maxsize=${encodeURIComponent(this._effectiveSize)}`,
      `trk=${encodeURIComponent(TRACKING_PARAM)}`,
      `vanityname=${encodeURIComponent(this.vanityname)}`,
    ];
    return `${this.__generateBaseUrl()}profile?${queryParams.join("&")}`;
  }

  __renderIframeBadge(badgeHtml, badgeHost) {
    while (badgeHost.firstChild) {
      badgeHost.removeChild(badgeHost.firstChild);
    }
    const iframe = globalThis.document.createElement("iframe");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("scrolling", "no");
    iframe.style.display = "block";
    iframe.style.maxWidth = "100%";
    iframe.addEventListener("load", () => {
      if (iframe.contentWindow && iframe.contentWindow.document) {
        const iframeBody = iframe.contentWindow.document.body;
        if (iframeBody) {
          const height = iframeBody.scrollHeight ? iframeBody.scrollHeight : 300;
          const width = iframeBody.scrollWidth ? iframeBody.scrollWidth : 330;
          iframe.setAttribute("height", `${height}`);
          iframe.setAttribute("width", `${width}`);
        }
      }
    });
    badgeHost.appendChild(iframe);
    if (iframe.contentWindow && iframe.contentWindow.document) {
      iframe.contentWindow.document.open();
      iframe.contentWindow.document.write(`<!doctype html><html><head><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent;line-height:0;}</style></head><body>${badgeHtml}</body></html>`);
      iframe.contentWindow.document.close();
    }
  }

  get _effectiveTheme() {
    return this._prefersDark ? "dark" : "light";
  }

  get _effectiveSize() {
    return this._responsiveSize;
  }

  get _profileHref() {
    return `https://www.linkedin.com/in/${this.vanityname}`;
  }

  render() {
    return html`
      <div
        class="badge-shell ${this._haxstate ? "is-editing" : ""}"
        data-size="${this._effectiveSize}"
        data-theme="${this._effectiveTheme}"
      >
        <div class="badge-host">
          <a class="badge-base__link LI-simple-link" href="${this._profileHref}">
            View ${this.vanityname} on LinkedIn
          </a>
        </div>
      </div>
    `;
  }

  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}

globalThis.customElements.define(LinkedinEmbed.tag, LinkedinEmbed);
export { LinkedinEmbed };
