import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

const FALLBACK_LOCALE = "en_US";
const TRACKING_PARAM = "profile-badge";
const CALLBACK_NAME = "LIBadgeCallback";

/**
 * `linkedin-embed`
 * `LinkedIn profile badge rendered without loading LinkedIn's profile.js file`
 * @demo demo/index.html
 * @element linkedin-embed
 */
class LinkedinEmbed extends I18NMixin(DDD) {
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
          .badge-shell {
          }
        }
      `,
    ];
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      viewOnLinkedin: "View {name} on LinkedIn",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../locales/", import.meta.url).href,
    });
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
    if (this.__badgeSizeHandler) {
      globalThis.removeEventListener("message", this.__badgeSizeHandler);
      this.__badgeSizeHandler = null;
    }
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
    return value
      .replace("https://www.linkedin.com/in/", "")
      .replaceAll("/", "")
      .trim();
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
      this.__darkModeMediaQuery.addEventListener(
        "change",
        this.__darkModeHandler,
      );
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
    return isCNDomain
      ? "https://badges.linkedin.cn/"
      : "https://badges.linkedin.com/";
  }

  __requestBadgeMarkup() {
    // renderRoot does not exist until the first render commits, so requests
    // that arrive before that point have no badge host to build against yet
    if (!this.renderRoot) {
      return;
    }
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
    iframe.setAttribute("height", "300");
    iframe.setAttribute("width", "330");
    // security: the badge HTML is third-party content, so it runs in a
    // sandboxed (opaque origin) frame with no access to this page's DOM,
    // cookies or storage. Popups stay allowed so profile links still open.
    iframe.setAttribute(
      "sandbox",
      "allow-scripts allow-popups allow-popups-to-escape-sandbox",
    );
    // sizing can no longer read the frame DOM, so the frame reports its own
    // size; only messages from this exact frame with numeric sizes are used
    if (this.__badgeSizeHandler) {
      globalThis.removeEventListener("message", this.__badgeSizeHandler);
    }
    this.__badgeSizeHandler = (event) => {
      if (!iframe.contentWindow || event.source !== iframe.contentWindow) {
        return;
      }
      // the sandboxed (no allow-same-origin) frame has an opaque origin
      if (event.origin !== "null") {
        return;
      }
      const data = event.data;
      if (
        !data ||
        data.type !== "linkedin-embed-size" ||
        typeof data.height !== "number" ||
        typeof data.width !== "number"
      ) {
        return;
      }
      const height = Math.max(1, Math.min(2000, Math.round(data.height)));
      const width = Math.max(1, Math.min(2000, Math.round(data.width)));
      iframe.setAttribute("height", `${height}`);
      iframe.setAttribute("width", `${width}`);
    };
    globalThis.addEventListener("message", this.__badgeSizeHandler);
    badgeHost.appendChild(iframe);
    const parentOrigin = JSON.stringify(
      globalThis.location &&
        globalThis.location.origin &&
        globalThis.location.origin !== "null"
        ? globalThis.location.origin
        : "*",
    );
    const sizeScript = `<script>(function(){function s(){var b=document.body;if(!b)return;parent.postMessage({type:"linkedin-embed-size",height:b.scrollHeight||300,width:b.scrollWidth||330},${parentOrigin});}window.addEventListener("load",s);setTimeout(s,500);setTimeout(s,2000);})();</script>`;
    // security: write badge via srcdoc instead of document.write (avoids JS-XSS-002 document.write sink)
    iframe.srcdoc = `<!doctype html><html><head><base target="_blank"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent;line-height:0;}</style></head><body>${badgeHtml}${sizeScript}</body></html>`;
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
          <a
            class="badge-base__link LI-simple-link"
            href="${this._profileHref}"
          >
            ${this.t.viewOnLinkedin.replace("{name}", () => this.vanityname)}
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
