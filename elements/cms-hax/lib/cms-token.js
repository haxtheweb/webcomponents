import { CMSBase } from "./cms-base.js";
/**
 * `cms-token`
 * Render and process a shortcode / token from a content management system.
 *
 * @demo demo/index.html
 *
 * @microcopy - the mental model for this element
 *  - cms - Content management system, while written against Drupal should be
 *          abstract enough to work with just about anything.
 *  - token - a snippet / shortcode of logic to unpack and turn into something
 *            more complex. Usually of the form [actual:thing:here] or
 *            [[action|thing=stuff|here=place]] style. Either way, it's a
 *            snippet which will get sent to a backend and dynamically replaced.
 */
class CMSToken extends CMSBase {
  static get tag() {
    return "cms-token";
  }
  constructor() {
    super();
    this._globalEndPointVar = "cmstokenEndPoint";
    this.token = "";
    this.tokenEndPoint = null;
    this.tokenPrefix = "";
    this.tokenSuffix = "";
    this._clickInvoked = false;
    this.windowControllers = new AbortController();
  }
  static get styles() {
    return super.styles;
  }
  static get properties() {
    return {
      token: {
        type: String,
        reflect: true,
      },
      tokenEndPoint: {
        type: String,
      },
      tokenPrefix: {
        type: String,
      },
      tokenSuffix: {
        type: String,
      },
      _clickInvoked: {
        type: Boolean,
      },
    };
  }
  /**
   * Build request body data.
   */
  _buildBodyData() {
    if (this.token && this.token !== "") {
      return {
        token: `${this.tokenPrefix || ""}${this.token}${this.tokenSuffix || ""}`,
        cachedResponse: this._clickInvoked,
      };
    }
    return null;
  }
  /**
   * Resolve endpoint.
   */
  _resolveEndPoint() {
    if (this.tokenEndPoint) {
      return this.tokenEndPoint;
    }
    if (typeof globalThis.cmstokenEndPoint !== typeof undefined) {
      return globalThis.cmstokenEndPoint;
    }
    return null;
  }
  /**
   * Override response handler to add click listener to edit link.
   */
  _handleResponse(data) {
    if (data && typeof data.content !== typeof undefined) {
      this._updateEditLink(data);
      if (
        data.editEndpoint &&
        globalThis.document.getElementById("cmstokenidtolockonto") != null
      ) {
        const link = globalThis.document.getElementById("cmstokenidtolockonto");
        link.addEventListener("click", this.__tokenClicked.bind(this));
      }
      wipeSlot(this);
      let template = globalThis.document.createElement("template");
      template.innerHTML = data.content;
      this.appendChild(globalThis.document.importNode(template.content, true));
      setTimeout(() => {
        if (globalThis.WCAutoload) {
          globalThis.WCAutoload.process();
        }
      }, 0);
      this.loading = false;
    }
  }
  updated(changedProperties) {
    if (changedProperties.has("token")) {
      this._doRequest();
    }
  }
  /**
   * Window visibility callback to monitor when we are being seen
   */
  _windowVisibilityChanged(e) {
    if (!this.loading && this._clickInvoked) {
      this._doRequest();
      this._clickInvoked = false;
    }
  }
  /**
   * Notice a click on our edit button and set a flag.
   */
  __tokenClicked(e) {
    this._clickInvoked = true;
  }
  connectedCallback() {
    super.connectedCallback();
    globalThis.document.addEventListener(
      "visibilitychange",
      this._windowVisibilityChanged.bind(this),
      { signal: this.windowControllers.signal },
    );
  }
  disconnectedCallback() {
    this.windowControllers.abort();
    super.disconnectedCallback();
  }
  static get haxProperties() {
    return {
      canScale: true,
      canEditSource: true,
      gizmo: {
        title: "CMS Token",
        description: "CMS token rendered on the backend",
        icon: "icons:code",
        color: "light-blue",
        tags: ["Other", "elmsln", "cms", "block"],
        handles: [
          {
            type: "cmstoken",
            token: "token",
          },
        ],
        meta: {
          author: "HAXTheWeb core team",
        },
      },
      settings: {
        configure: [
          {
            property: "token",
            title: "Token",
            description: "Token from our CMS",
            inputMethod: "textfield",
            icon: "editor:title",
          },
        ],
        advanced: [],
      },
      saveOptions: {
        wipeSlot: true,
        unsetAttributes: [
          "loading",
          "token-data",
          "body-data",
          "hax-edit-mode",
          "token-end-point",
        ],
      },
    };
  }
  postProcessgetHaxJSONSchema(schema) {
    let href = "";
    let slot = "Edit";
    if (typeof this.tokenData !== typeof undefined) {
      href = this.tokenData.editEndpoint;
      slot = this.tokenData.editText;
      for (var i in this.tokenData.schema) {
        schema.properties[i] = this.tokenData.schema[i];
      }
    }
    schema.properties["__editThis"] = {
      type: "string",
      component: {
        name: "a",
        properties: {
          id: "cmstokenidtolockonto",
          href: href,
          target: "_blank",
        },
        slot: slot,
      },
    };
    return schema;
  }
}
globalThis.customElements.define(CMSToken.tag, CMSToken);
export { CMSToken };
