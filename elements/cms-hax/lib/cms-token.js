import { LitElement, html, css } from "lit-element/lit-element.js";
import { wipeSlot } from "@lrnwebcomponents/utils/utils.js";
import "@polymer/iron-ajax/iron-ajax.js";
/**
 * `cms-token`
 * `Render and process a shortcode / token from a content management system.`
 * @microcopy - the mental model for this element
 * - cms   Content management system, while writen against Drupal should be
 *         abstract enough to work with just about anything.
 * - token a snippet / shortcode of logic to unpack and turn into something
 *         more complex. Usually of the form [actual:thing:here] or
 *         [[action|thing=stuff|here=place]] style. Either way, it's a
 *         snippet which will get sent to a backend and dynamically replaced.
 * @customElement cms-token
 */
class CMSToken extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: inline;
          min-width: 112px;
          min-height: 112px;
          transition: 0.6s all ease;
          background-color: transparent;
        }
        #replacementcontent {
          transition: 0.6s all ease;
          visibility: visible;
          opacity: 1;
          height: auto;
          width: auto;
        }
        :host([loading]) {
          text-align: center;
        }
        :host([loading]) #replacementcontent {
          opacity: 0;
          visibility: hidden;
          height: 0;
          width: 0;
        }
      `
    ];
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <iron-ajax
        id="tokenrequest"
        method="GET"
        url="${this.tokenEndPoint}"
        handle-as="json"
        @last-response-changed="${this.tokenDataChanged}"
      ></iron-ajax>
      ${this.loading
        ? html`
            <hexagon-loader
              item-count="4"
              loading
              size="small"
            ></hexagon-loader>
          `
        : html``}
      <span id="replacementcontent"><slot></slot></span>
    `;
  }
  tokenDataChanged(e) {
    this.tokenData = e.detail.value;
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.loading = false;
    this.tokenPrefix = "[";
    this.tokenSuffix = "]";
    this._clickInvoked = false;
    this._displayMode = "full";
    import("@lrnwebcomponents/hexagon-loader/hexagon-loader.js");
  }
  static get tag() {
    return "cms-token";
  }
  /**
   * LitElement properties changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (["token", "_clickInvoked"].includes(propName)) {
        this.bodyData = this._generateBodyData(this.token, this._clickInvoked);
      }
      if (propName == "bodyData") {
        this._bodyDataChanged(this[propName]);
      }
      if (propName == "tokenData") {
        this._handleTokenResponse(this[propName]);
      }
      if (propName == "_displayMode") {
        this._displayModeChanged(this[propName]);
      }
    });
  }
  static get properties() {
    return {
      /**
       * Loading state
       */
      loading: {
        type: Boolean,
        reflect: true
      },
      /**
       * Token changed (somehow) do the token processing.
       */
      token: {
        type: String,
        reflect: true
      },
      /**
       * Token end point updated, change the way we do processing.
       */
      tokenEndPoint: {
        type: String,
        attribute: "token-end-point"
      },
      /**
       * Body data which is just token with some encapsulation.
       */
      bodyData: {
        type: Object
      },
      /**
       * internal tracking for edit button being clicked in HAX presentation
       */
      _clickInvoked: {
        type: String
      },
      /**
       * Token data from the end point.
       */
      tokenData: {
        type: String,
        attribute: "token-data"
      },
      /**
       * Prefix for the token to be processed
       */
      tokenPrefix: {
        type: String,
        attribute: "token-prefix"
      },
      /**
       * Suffix for the token to be processed
       */
      tokenSuffix: {
        type: String,
        attribute: "token-suffix"
      },
      _displayMode: {
        type: String
      }
    };
  }
  /**
   * Display mode value updated.
   */
  _displayModeChanged(newValue, oldValue) {
    if (
      typeof newValue !== typeof undefined &&
      newValue != "" &&
      typeof this.token !== typeof undefined
    ) {
      // @todo need more sanity checks then this to get default and replace better
      this.token = this.token.replace(oldValue, newValue);
    }
  }
  /**
   * Generate body data.
   */
  _generateBodyData(token, $editingState) {
    if (token !== null && token !== "") {
      let tokenPrefix = this.tokenPrefix;
      let tokenSuffix = this.tokenSuffix;
      return {
        token: `${tokenPrefix}${token}${tokenSuffix}`,
        cachedResponse: $editingState
      };
    }
  }
  /**
   * Handle the response from the token processing endpoint
   */
  _handleTokenResponse(newValue) {
    if (newValue !== null && typeof newValue.content !== typeof undefined) {
      // store the text and url callbacks in the event we're in an editing mode
      if (document.getElementById("cmstokenidtolockonto") != null) {
        document
          .getElementById("cmstokenidtolockonto")
          .setAttribute("href", newValue.editEndpoint);
        document.getElementById("cmstokenidtolockonto").innerHTML =
          newValue.editText;
        document
          .getElementById("cmstokenidtolockonto")
          .addEventListener("click", this.__tokenClicked.bind(this));
      }
      // wipe our own slot here
      wipeSlot(this);
      // now inject the content we got
      let template = document.createElement("template");
      template.innerHTML = newValue.content;
      this.appendChild(document.importNode(template.content, true));
      this.loading = false;
    }
  }
  /**
   * Body data changed end point changed
   */
  _bodyDataChanged(newValue) {
    // ensure we have something and are not loading currently
    if (
      typeof newValue !== typeof undefined &&
      newValue !== "" &&
      !this.loading
    ) {
      // support going from a null element to a real one
      if (
        typeof this.tokenEndPoint === typeof undefined &&
        typeof window.cmstokenEndPoint !== typeof undefined
      ) {
        this.tokenEndPoint = window.cmstokenEndPoint;
      }
      if (this.tokenEndPoint) {
        this.loading = true;
        this.shadowRoot.querySelector("#tokenrequest").body = newValue;
        this.shadowRoot.querySelector("#tokenrequest").generateRequest();
      }
    }
  }
  /**
   * Window visibility callback to monitor when we are being seen
   */
  _windowVisibilityChanged(e) {
    // ensure we aren't already loading
    if (!this.loading && this._clickInvoked) {
      // generate request which will kick off "loading" state
      this.shadowRoot.querySelector("#tokenrequest").generateRequest();
      // kill our clickInvoked handler so we aren't generating requests until the
      // user clicks to edit the thing again
      this._clickInvoked = false;
    }
  }
  /**
   * Notice a click on our edit button and set a flag.
   */
  __tokenClicked(e) {
    // set flag so we know to generate a new request when we come back into focus
    this._clickInvoked = true;
  }
  /**
   * HTMLElement
   */
  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => {
      document.addEventListener(
        "visibilitychange",
        this._windowVisibilityChanged.bind(this)
      );
    }, 0);
  }
  /**
   * HTMLElement
   */
  disconnectedCallback() {
    document.removeEventListener(
      "visibilitychange",
      this._windowVisibilityChanged.bind(this)
    );
    super.disconnectedCallback();
  }
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "CMS Token",
        description: "CMS token rendered on the backend",
        icon: "icons:code",
        color: "light-blue",
        groups: ["CMS"],
        handles: [
          {
            type: "cmstoken",
            token: "token"
          }
        ],
        meta: {
          author: "ELMS:LN"
        }
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "token",
            title: "Token",
            description: "Token from our CMS",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        advanced: []
      },
      saveOptions: {
        wipeSlot: true,
        unsetAttributes: [
          "loading",
          "token-data",
          "body-data",
          "token-end-point"
        ]
      }
    };
  }
  /**
   * Implements getHaxJSONSchema post processing callback.
   */
  postProcessgetHaxJSONSchema(schema) {
    let href = "";
    let slot = "Edit";
    // if we have values populate them
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
          target: "_blank"
        },
        slot: slot
      }
    };
    return schema;
  }
}
window.customElements.define(CMSToken.tag, CMSToken);
export { CMSToken };
