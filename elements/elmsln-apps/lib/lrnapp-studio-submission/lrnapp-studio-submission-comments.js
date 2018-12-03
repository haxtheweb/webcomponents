import "./lrnapp-studio-submission-comment.js";
Polymer({
  _template: `
    <style>
       :host {
        display: block;
      }
    </style>
    <template is="dom-if" if="[[submission.relationships.comments]]">
      <template is="dom-repeat" items="[[_toArray(submission.relationships.comments.data)]]" as="comment">
        <lrnapp-studio-submission-comment comment="{{comment}}"></lrnapp-studio-submission-comment>
      </template>
    </template>
`,

  is: "lrnapp-studio-submission-comments",

  properties: {
    submission: {
      type: Object
    }
  },

  /**
   * Simple way to convert from object to array.
   */
  _toArray: function(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
});
