import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
/**
`code-pen-button`
A LRN element to do a post of data to codepen

@demo demo/index.html

@microcopy - the mental model for this element
 -
 -

*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
    <form action="[[endPoint]]" method="POST" target="_blank">
      <input type="hidden" name="data" value\$="[[dataString]]">
      <input type="image" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-1/cp-arrow-right.svg" width="40" height="40" value="Create New Pen with Prefilled Data" class="codepen-mover-button">
    </form>
`,

  is: "code-pen-button",

  properties: {
    /**
     * End point for posting should it change in the future.
     */
    endPoint: {
      type: String,
      value: "https://codepen.io/pen/define"
    },
    /**
     * Data object as a JSON string for the POST data in page.
     */
    dataString: {
      type: String,
      computed: "_getDataString(data)"
    },
    /**
     * Data object to post to code pen
     */
    data: {
      type: Object,
      value: {}
    }
  },

  /**
   * Return string from data object so it can be posted correctly.
   */
  _getDataString: function(data) {
    return JSON.stringify(data)
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }
});
