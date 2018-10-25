import "./lrnsys-comment.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/iron-list/iron-list.js";
import "@polymer/iron-form-element-behavior/iron-form-element-behavior.js";
import "@polymer/app-layout/app-layout.js";
import "@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
import "@polymer/paper-toast/paper-toast.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/grafitto-filter/grafitto-filter.js";
import "@lrnwebcomponents/dropdown-select/dropdown-select.js";
import "@polymer/paper-dropdown-menu/paper-dropdown-menu.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/paper-listbox/paper-listbox.js";
/**
`lrnsys-comment-list`
A listing and event handling for comments.

@demo demo/index.html
*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
      app-toolbar {
        padding: 0;
      }
      app-toolbar > *:not(:last-child) {
        margin-right: 10px;
      }
      .comment-button {
        min-width: 125px;
      }
    </style>
    <!-- Load all comments on load of element -->
    <iron-ajax auto="" url="[[sourcePath]]" handle-as="json" last-response="{{comments}}"></iron-ajax>
    <!-- Create stub-comment -->
     <iron-ajax id="ajaxCreateStub" url="[[createStubUrl]]" method="POST" body="[[activeComment.id]]" on-response="_updateReply" last-response="{{newComment}}" handle-as="json"></iron-ajax>
     <!-- Update comment -->
    <iron-ajax id="ajaxUpdateRequest" url="[[reqUrl]]" method="PUT" body="[[activeComment]]" content-type="application/json" handle-as="json" on-response="_handleUpdateResponse"></iron-ajax>
    <!-- Delete comment -->
    <iron-ajax id="ajaxDeleteRequest" url="[[reqUrl]]" method="DELETE" body="[[activeComment]]" content-type="application/json" handle-as="json" on-response="_handleDeleteResponse"></iron-ajax>
    <!-- Like comment -->
    <iron-ajax id="ajaxLikeRequest" url="[[reqUrl]]" method="PATCH" body="[[activeComment]]" content-type="application/json" handle-as="json" on-response="_handleLikeResponse"></iron-ajax>
    <app-toolbar>
      <lrnsys-button class="comment-button" raised="" on-click="handleTopReply" id="leave-comment" hover-class="blue white-text" label="Add Comment"></lrnsys-button>
      <dropdown-select id="filter-type" label="Filter Comments by" value="attributes.body">
        <paper-item value="attributes.body">Body</paper-item>
        <paper-item value="relationships.author.data.name">User Name</paper-item>
      </dropdown-select>
      <paper-input label="Filter Text" id="filter-comments" aria-controls="filtered-comments" value="" always-float-label=""></paper-input>   
    </app-toolbar>
    <grafitto-filter id="filtered-comments" items\$="[[_toArray(comments.data)]]" where="" as="filtered" like="">
      <template>
        <iron-list id="comment-list" items\$="[[filtered]]" as="item">
          <template>
          <lrnsys-comment comment="{{item}}" hover-class="blue white-text"></lrnsys-comment>
          </template>
        </iron-list>
      </template>
    </grafitto-filter>
    <paper-toast text="Updated" id="toast"></paper-toast>
    <paper-dialog id="deleteaction" modal="">
      <h3>Delete comment</h3>
      <p>Are you sure you want to delete your comment?</p>
      <div class="buttons">
        <paper-button dialog-dismiss="">Decline</paper-button>
        <paper-button on-click="_handleDeleteConfirm" dialog-confirm="" autofocus="">Accept</paper-button>
      </div>
    </paper-dialog>
`,

  is: "lrnsys-comment-list",

  listeners: {
    "comment-save": "handleSave",
    "comment-editing": "handleEditing",
    "comment-reply": "handleReply",
    "comment-like": "handleLike",
    "comment-delete-dialog": "handleDeleteDialog"
  },

  properties: {
    /**
     * CSRF Token
     */
    csrfToken: {
      type: String
    },
    /**
     * Comment currently in scope
     */
    activeComment: {
      type: Object,
      notify: true
    },
    /**
     * New stub comment from backend.
     */
    newComment: {
      type: Object,
      notify: true
    },
    /**
     * An object containing all comments to render in the list
     */
    comments: {
      type: Object,
      notify: true
    },
    /**
     * Source to pull the comments from
     */
    sourcePath: {
      type: String,
      notify: true,
      reflectToAttribute: true
    },
    /**
     * Base for ops calls
     */
    commentOpsBase: {
      type: String,
      notify: true,
      reflectToAttribute: true
    },
    /**
     * Source to get stub comments from
     */
    createStubUrl: {
      type: String,
      notify: true,
      reflectToAttribute: true
    },
    /**
     * Source for CRUD ops against individual comments.
     */
    reqUrl: {
      type: String,
      notify: true,
      computed:
        "_computeCommentOpsUrl(activeComment, commentOpsBase, csrfToken)"
    }
  },

  /**
   * Ready event should ensure that the iron-list is the correct size.
   */
  ready: function(e) {
    let root = this;
    root
      .$$("#filtered-comments")
      .$$("#comment-list")
      .fire("iron-resize");
    root.$$("#filter-comments").addEventListener("value-changed", function(e) {
      root.$$("#filtered-comments").like = e.target.value;
    });
    root.$$("#filter-type").addEventListener("change", function(e) {
      root.$$("#filter-comments").value = "";
      root.$$("#filtered-comments").where = e.detail.value;
      root.$$("#filtered-comments").like = "";
    });
  },

  /**
   * Generate the ops URL based on the active comment
   */
  _computeCommentOpsUrl: function(activeComment, sourcePath, csrfToken) {
    return sourcePath + "/" + activeComment.id + "?token=" + csrfToken;
  },

  /**
   * Handle filtering comments list.
   */
  handleLike: function(e) {
    let root = this;
    root.activeComment = e.detail.comment;
    this.$.ajaxLikeRequest.generateRequest();
  },

  /**
   * Handle liking a comment.
   */
  handleLike: function(e) {
    let root = this;
    root.activeComment = e.detail.comment;
    this.$.ajaxLikeRequest.generateRequest();
  },

  _handleLikeResponse: function(e) {
    // @todo not sure we need to do anything post like button
  },

  /**
   * Handle a delete dialog to confirm.
   */
  handleDeleteDialog: function(e) {
    let root = this;
    root.activeComment = e.detail.comment;
    document.body.appendChild(root.$.deleteaction);
    root.$.deleteaction.open();
  },

  handleEditing: function(e) {
    let root = this;
    root.$.toast.text = "Be awesome to each other";
    root.$.toast.toggle();
  },

  /**
   * Handle a reply event bubbling up from a comment we've printed
   * via our template in this element. This allows the higher element
   * to create new lower ones which can invoke more lower ones from
   * up above.
   */
  handleTopReply: function(e) {
    let root = this;
    // ensure nothing is set as active for when this goes out the door
    root.set("newComment", []);
    root.set("activeComment", []);
    root.$.ajaxCreateStub.generateRequest();
  },

  /**
   * Handle a reply event bubbling up from a comment we've printed
   * via our template in this element. This allows the higher element
   * to create new lower ones which can invoke more lower ones from
   * up above.
   */
  handleReply: function(e) {
    let root = this;
    root.set("newComment", []);
    root.activeComment = e.detail.comment;
    // shift where the response will go
    root.$.ajaxCreateStub.generateRequest();
  },

  /**
   * Update the UI to reflect the new comment based on returned data
   * added to the end since it's a new comment.
   */
  _updateReply: function(e) {
    let root = this;
    var comment = root.activeComment;
    var comments = root.comments.data;
    // normalize response
    root.newComment = root.newComment.data;
    // see if we have any comments at all
    if (comments.length == 0) {
      // top level replys need to get added to the end of the array
      comments.push(root.newComment);
    }
    // see if this is top level
    else if (typeof comment.id == typeof undefined) {
      // top level replys need to get added to the end of the array
      comments.push(root.newComment);
    } else {
      for (var index = 0; index < comments.length; index++) {
        if (comments[index].id == comment.id) {
          comments.splice(index + 1, 0, root.newComment);
        }
      }
    }
    root.activeComment = root.newComment;
    // force tree to notice element updated
    root.set("comments.data", []);
    root.set("comments.data", comments);
  },

  /**
   * Handle a delete event bubbling up from a comment we've printed.
   */
  _handleDeleteConfirm: function(e) {
    this.$.ajaxDeleteRequest.generateRequest();
  },

  _handleDeleteResponse: function(e) {
    let root = this;
    var comment = root.activeComment;
    var comments = root.comments.data;
    for (var index = 0; index < comments.length; index++) {
      if (comments[index].id == comment.id) {
        comments.splice(index, 1);
        // nulify the active comment since it's been removed
        root.set("activeComment", []);
        // force tree to notice element updated
        root.set("comments.data", []);
        root.set("comments.data", comments);
        // force tree to notice element updated
        root.$.toast.text = "Comment deleted";
        root.$.toast.toggle();
        // bail early
        return true;
      }
    }
  },

  /**
   * Handle saving a comment.
   */
  handleSave: function(e) {
    let root = this;
    root.activeComment = e.detail.comment;
    this.$.ajaxUpdateRequest.generateRequest();
  },

  _handleUpdateResponse: function(e) {
    this.$.toast.text = "Comment saved!";
    this.$.toast.toggle();
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
