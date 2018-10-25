import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/paper-spinner/paper-spinner.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");

$_documentContainer.innerHTML = `<dom-module id="cms-token">
    <template strip-whitespace="">
        <style>
            :host {
                display: inline;
                min-width: 112px;
                min-height: 112px;
                transition: .6s all ease;
                background-color: transparent;
            }

            paper-spinner {
                transition: .6s all ease;
                position: absolute;
                visibility: hidden;
                display: none;
                opacity: 0;
                height: 0;
                width: 0;
            }

            #replacementcontent {
                transition: .6s all ease;
                visibility: visible;
                opacity: 1;
                height: auto;
                width: auto;
            }

            :host[loading] {
                text-align: center;
            }

            :host[loading] paper-spinner {
                visibility: visible;
                opacity: 1;
                position: relative;
                height: 80px;
                width: 80px;
                padding: 16px;
                display: flex;
            }

            :host[loading] #replacementcontent {
                opacity: 0;
                visibility: hidden;
                height: 0;
                width: 0;
            }
        </style>
        <iron-ajax id="tokenrequest" method="GET" params="[[bodyData]]" url="[[tokenEndPoint]]" handle-as="json" last-response="{{tokenData}}"></iron-ajax>
        <paper-spinner active="[[loading]]"></paper-spinner>
        <span id="replacementcontent">
            <slot></slot>
        </span>
    </template>

    
</dom-module>`;

document.head.appendChild($_documentContainer);
/**
`cms-token`
Render and process a shortcode / token from a content management system.

@demo demo/index.html

@microcopy - the mental model for this element
 - cms - Content management system, while writen against Drupal should be
         abstract enough to work with just about anything.
 - token - a snippet / shortcode of logic to unpack and turn into something
           more complex. Usually of the form [actual:thing:here] or
           [[action|thing=stuff|here=place]] style. Either way, it's a
           snippet which will get sent to a backend and dynamically replaced.
*/
Polymer({
  is: "cms-token",
  behaviors: [HAXBehaviors.PropertiesBehaviors],
  properties: {
    /**
     * Loading state
     */
    loading: {
      type: Boolean,
      reflectToAttribute: true,
      value: false
    },
    /**
     * Token changed (somehow) do the token processing.
     */
    token: {
      type: String,
      reflectToAttribute: true
    },
    /**
     * Token end point updated, change the way we do processing.
     */
    tokenEndPoint: {
      type: String
    },
    /**
     * Body data which is just token with some encapsulation.
     */
    bodyData: {
      type: Object,
      computed: "_generateBodyData(token, _clickInvoked)",
      observer: "_tokenChanged"
    },
    /**
     * internal tracking for edit button being clicked in HAX presentation
     */
    _clickInvoked: {
      type: String,
      value: false
    },
    /**
     * Token data from the end point.
     */
    tokenData: {
      type: String,
      observer: "_handleTokenResponse"
    },
    /**
     * Prefix for the token to be processed
     */
    tokenPrefix: {
      type: String,
      value: "["
    },
    /**
     * Suffix for the token to be processed
     */
    tokenSuffix: {
      type: String,
      value: "]"
    },
    /**
     *
     */
    _displayMode: {
      type: String,
      value: "full",
      observer: "_displayModeChanged"
    }
  },
  /**
   * Display mode value updated.
   */
  _displayModeChanged: function(newValue, oldValue) {
    if (
      typeof newValue !== typeof undefined &&
      newValue != "" &&
      typeof this.token !== typeof undefined
    ) {
      // @todo need more sanity checks then this to get default and replace better
      this.token = this.token.replace(oldValue, newValue);
    }
  },
  /**
   * Generate body data.
   */
  _generateBodyData: function(token, $editingState) {
    if (token !== null && token !== "") {
      let tokenPrefix = this.tokenPrefix;
      let tokenSuffix = this.tokenSuffix;
      return {
        token: `${tokenPrefix}${token}${tokenSuffix}`,
        cachedResponse: $editingState
      };
    }
  },
  /**
   * Handle the response from the token processing endpoint
   */
  _handleTokenResponse: function(newValue, oldValue) {
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
      this.wipeSlot(dom(this));
      // now inject the content we got
      this.async(() => {
        let template = document.createElement("template");
        template.innerHTML = newValue.content;
        dom(this).appendChild(document.importNode(template.content, true));
        this.loading = false;
      });
    }
  },
  /**
   * wipe out the slot
   */
  wipeSlot: function(element) {
    while (element.firstChild !== null) {
      element.removeChild(element.firstChild);
    }
  },
  /**
   * Token end point changed
   */
  _tokenChanged: function(newValue, oldValue) {
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
        this.async(() => {
          this.$.tokenrequest.generateRequest();
        });
      }
    }
  },
  /**
   * Window visibility callback to monitor when we are being seen
   */
  _windowVisibilityChanged: function(e) {
    // ensure we aren't already loading
    if (!this.loading && this._clickInvoked) {
      // generate request which will kick off "loading" state
      this.$.tokenrequest.generateRequest();
      // kill our clickInvoked handler so we aren't generating requests until the
      // user clicks to edit the thing again
      this._clickInvoked = false;
    }
  },
  /**
   * Notice a click on our edit button and set a flag.
   */
  __tokenClicked: function(e) {
    // set flag so we know to generate a new request when we come back into focus
    this._clickInvoked = true;
  },
  /**
   * Detatched life cycle.
   */
  detached: function() {
    // remove event listener for clean up
    document.removeEventListener(
      "visibilitychange",
      this._windowVisibilityChanged.bind(this)
    );
  },
  /**
   * Attached to the DOM, now fire.
   */
  attached: function() {
    // notice visibilty change
    document.addEventListener(
      "visibilitychange",
      this._windowVisibilityChanged.bind(this)
    );
    if (
      typeof this.token !== typeof undefined &&
      this.token !== null &&
      this.token !== ""
    ) {
      let slot = dom(this).getEffectiveChildNodes();
      // only kick off request if there's nothing in it
      // if it has something in it that means we did some
      // remote rendering ahead of time
      if (slot.length === 0 && !this.loading) {
        // support for autoloading the token data needed for the request from globals
        if (
          typeof this.tokenEndPoint === typeof undefined &&
          typeof window.cmstokenEndPoint !== typeof undefined
        ) {
          this.tokenEndPoint = window.cmstokenEndPoint;
        }
        if (this.tokenEndPoint) {
          this.loading = true;
          this.async(() => {
            this.$.tokenrequest.generateRequest();
          });
        }
      }
    }
    // Establish hax property binding
    let props = {
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
          author: "LRNWebComponents"
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
    this.setHaxProperties(props);
  },
  /**
   * Implements getHaxJSONSchema post processing callback.
   */
  postProcessgetHaxJSONSchema: function(schema) {
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
});
