import "@polymer/polymer/polymer.js";
import "@polymer/paper-toast/paper-toast.js";
import "@polymer/iron-ajax/iron-ajax.js";
/**
`hax-ajax`
A small smart component that notices saves on HAX enabled content it wraps.

@demo demo/index.html
*/
Polymer({
  _template: `
    <slot></slot>
    <iron-ajax auto="{{auto}}" id="haxajax" url="[[url]]" handle-as="json" on-response="haxAjaxResponse" last-response="{{saveResponse}}"></iron-ajax>
    <paper-toast text="[[msg]]" id="response"></paper-toast>
`,

  is: "hax-ajax",

  properties: {
    /**
     * The url endpoint to save operations once noticed.
     */
    url: {
      type: String
    },
    /**
     * Automatically submit
     */
    auto: {
      type: Boolean,
      value: false
    },
    /**
     * If hax should be hidden or not.
     */
    hideHax: {
      type: Boolean,
      value: false
    },
    /**
     * Response object.
     */
    saveResponse: {
      type: Object
    }
  },

  listeners: {
    haxAction: "_triggerHaxSave"
  },

  /**
   * Handle a save event bubbling up from
   * some place down below in the DOM.
   */
  _triggerHaxSave: function(e) {
    if (e.detail.action == "save") {
      var params = {};
      var key, value;
      // look through the possible items and remap to params array
      for (i = 0; i < e.detail.attributes.length; i++) {
        params[e.detail.attributes[i].name] = e.detail.attributes[i].value;
      }
      // include innerHTML just to see
      params["innerHTML"] = e.detail.attributes.innerHTML;
      // bring in tag name for things to match the element mapping internally
      params["tagName"] = e.detail.attributes.tagName.toLowerCase();
      // set params
      this.$.haxajax.params = params;
      // trigger it to run
      this.$.haxajax.generateRequest();
    }
  },

  haxAjaxResponse: function(e) {
    // ensure there's a request that went through at all
    if (typeof this.saveResponse !== "undefined" && this.saveResponse != null) {
      // look for a nice response
      if (
        typeof this.saveResponse.status !== "undefined" &&
        this.saveResponse.status == 200
      ) {
        this.msg = "Item updated!";
      } else {
        this.msg = "Something went wrong! (bad response)";
        console.log(this.saveResponse);
      }
    } else {
      this.msg = "Something went wrong! (invalid request)";
      console.log(e);
    }
    this.$.response.opened = true;
  }
});
