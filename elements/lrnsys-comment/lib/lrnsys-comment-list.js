import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import * as async from "@polymer/polymer/lib/utils/async.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/iron-list/iron-list.js";
import "@polymer/iron-form-element-behavior/iron-form-element-behavior.js";
import "@polymer/app-layout/app-layout.js";
import "@polymer/app-layout/app-toolbar/app-toolbar.js";
import "@polymer/paper-toast/paper-toast.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-dropdown-menu/paper-dropdown-menu.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/paper-listbox/paper-listbox.js";
import "@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
import "@lrnwebcomponents/grafitto-filter/grafitto-filter.js";
import "@lrnwebcomponents/dropdown-select/dropdown-select.js";
import "../lrnsys-comment.js";

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
    <iron-ajax auto url="[[sourcePath]]" handle-as="json" method="[[opsRequestMethod.list]]" last-response="{{comments}}"></iron-ajax>
    <!-- Create stub-comment -->
     <iron-ajax id="ajaxcreatestub" url="[[createStubUrl]]" method="[[opsRequestMethod.create]]" body="[[activeComment.id]]" on-response="_updateReply" handle-as="json" last-response="{{newComment}}"></iron-ajax>
     <!-- Update comment -->
    <iron-ajax id="ajaxupdaterequest" url="[[reqUrl]]" method="[[opsRequestMethod.update]]" body="[[activeComment]]" content-type="application/json" handle-as="json" on-response="_handleUpdateResponse"></iron-ajax>
    <!-- Delete comment -->
    <iron-ajax id="ajaxdeleterequest" url="[[reqUrl]]" method="[[opsRequestMethod.delete]]" body="[[activeComment]]" content-type="application/json" handle-as="json" on-response="_handleDeleteResponse"></iron-ajax>
    <!-- Like comment -->
    <iron-ajax id="ajaxlikerequest" url="[[reqUrl]]" method="[[opsRequestMethod.like]]" body="[[activeComment]]" content-type="application/json" handle-as="json" on-response="_handleLikeResponse"></iron-ajax>
    <app-toolbar>
      <lrnsys-button class="comment-button" raised="" on-click="handleTopReply" id="leavecomment" hover-class="blue white-text" label="Add Comment"></lrnsys-button>
      <dropdown-select id="filtertype" label="Filter Comments by" value="attributes.body">
        <paper-item value="attributes.body">Body</paper-item>
        <paper-item value="relationships.author.data.name">User Name</paper-item>
      </dropdown-select>
      <paper-input label="Filter Text" id="filtercomments" aria-controls="filteredcomments" value="" always-float-label=""></paper-input>   
    </app-toolbar>
    <grafitto-filter id="filteredcomments" items\$="[[_toArray(comments.data)]]" where="" as="filtered" like="">
      <template>
        <iron-list id="commentlist" items="[[filtered]]" as="item">
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
     * Request methods
     */
    opsRequestMethod: {
      type: Object,
      value: {
        list: "GET",
        create: "POST",
        update: "PUT",
        delete: "DELETE",
        like: "PATCH"
      }
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
      notify: true
    },
    /**
     * Base for ops calls
     */
    commentOpsBase: {
      type: String,
      notify: true
    },
    /**
     * Source to get stub comments from
     */
    createStubUrl: {
      type: String,
      notify: true
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
   * attached life cycle
   */
  attached: function(e) {
    async.microTask.run(() => {
      this.$.filteredcomments.querySelector("iron-list").fire("iron-resize");
      window.dispatchEvent(new Event("resize"));
    });
    this.$.filtercomments.addEventListener("value-changed", e => {
      this.$.filteredcomments.like = e.target.value;
    });
    this.$.filtertype.addEventListener("change", e => {
      this.$.filtercomments.value = "";
      this.$.filteredcomments.where = e.detail.value;
      this.$.filteredcomments.like = "";
    });
  },
  /**
   * detached life cycle
   */
  detached: function(e) {
    this.$.filtercomments.removeEventListener("value-changed", e => {
      this.$.filteredcomments.like = e.target.value;
    });
    this.$.filtertype.removeEventListener("change", e => {
      this.$.filtercomments.value = "";
      this.$.filteredcomments.where = e.detail.value;
      this.$.filteredcomments.like = "";
    });
  },
  /**
   * Generate the ops URL based on the active comment
   */
  _computeCommentOpsUrl: function(activeComment, commentOpsBase, csrfToken) {
    if (typeof activeComment !== typeof undefined) {
      return commentOpsBase + "/" + activeComment.id + "?token=" + csrfToken;
    }
  },
  /**
   * Handle liking a comment.
   */
  handleLike: function(e) {
    this.activeComment = e.detail.comment;
    this.$.ajaxlikerequest.generateRequest();
  },
  /**
   * @todo not sure we need to do anything post like button
   */
  _handleLikeResponse: function(e) {},
  /**
   * Handle a delete dialog to confirm.
   */
  handleDeleteDialog: function(e) {
    this.activeComment = e.detail.comment;
    // @todo convert to the new dialog methodology
    document.body.appendChild(this.$.deleteaction);
    this.$.deleteaction.open();
  },
  /**
   * Handle editing response
   */
  handleEditing: function(e) {
    this.$.toast.text = "Be awesome to each other";
    this.$.toast.toggle();
  },

  /**
   * Handle a reply event bubbling up from a comment we've printed
   * via our template in this element. This allows the higher element
   * to create new lower ones which can invoke more lower ones from
   * up above.
   */
  handleTopReply: function(e) {
    // ensure nothing is set as active for when this goes out the door
    this.set("newComment", []);
    this.set("activeComment", []);
    this.$.ajaxcreatestub.generateRequest();
  },

  /**
   * Handle a reply event bubbling up from a comment we've printed
   * via our template in this element. This allows the higher element
   * to create new lower ones which can invoke more lower ones from
   * up above.
   */
  handleReply: function(e) {
    this.set("newComment", []);
    this.activeComment = e.detail.comment;
    // shift where the response will go
    this.$.ajaxcreatestub.generateRequest();
  },

  /**
   * Update the UI to reflect the new comment based on returned data
   * added to the end since it's a new comment.
   */
  _updateReply: function(e) {
    var comment = this.activeComment;
    var comments = this.comments.data;
    // normalize response
    this.newComment = this.newComment.data;
    // see if we have any comments at all
    if (comments.length == 0) {
      // top level replys need to get added to the end of the array
      comments.push(this.newComment);
    }
    // see if this is top level
    else if (typeof comment.id == typeof undefined) {
      // top level replys need to get added to the end of the array
      comments.push(this.newComment);
    } else {
      for (var index = 0; index < comments.length; index++) {
        if (comments[index].id == comment.id) {
          comments.splice(index + 1, 0, this.newComment);
        }
      }
    }
    this.activeComment = this.newComment;
    // force tree to notice element updated
    this.set("comments.data", []);
    this.set("comments.data", comments);
  },

  /**
   * Handle a delete event bubbling up from a comment we've printed.
   */
  _handleDeleteConfirm: function(e) {
    this.$.ajaxdeleterequest.generateRequest();
  },

  _handleDeleteResponse: function(e) {
    var comment = this.activeComment;
    var comments = this.comments.data;
    for (var index = 0; index < comments.length; index++) {
      if (comments[index].id == comment.id) {
        comments.splice(index, 1);
        // nulify the active comment since it's been removed
        this.set("activeComment", []);
        // force tree to notice element updated
        this.set("comments.data", []);
        this.set("comments.data", comments);
        // force tree to notice element updated
        this.$.toast.text = "Comment deleted";
        this.$.toast.toggle();
        // bail early
        return true;
      }
    }
  },

  /**
   * Handle saving a comment.
   */
  handleSave: function(e) {
    this.activeComment = e.detail.comment;
    this.$.ajaxupdaterequest.generateRequest();
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
