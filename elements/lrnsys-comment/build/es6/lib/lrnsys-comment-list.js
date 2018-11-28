import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import * as async from "../node_modules/@polymer/polymer/lib/utils/async.js";
import "../node_modules/@polymer/iron-ajax/iron-ajax.js";
import "../node_modules/@polymer/iron-list/iron-list.js";
import "../node_modules/@polymer/iron-form-element-behavior/iron-form-element-behavior.js";
import "../node_modules/@polymer/app-layout/app-layout.js";
import "../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js";
import "../node_modules/@polymer/paper-toast/paper-toast.js";
import "../node_modules/@lrnwebcomponents/simple-modal/simple-modal.js";
import "../node_modules/@polymer/paper-input/paper-input.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
import "../node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js";
import "../node_modules/@polymer/paper-item/paper-item.js";
import "../node_modules/@polymer/paper-listbox/paper-listbox.js";
import "../node_modules/@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
import "../node_modules/@lrnwebcomponents/grafitto-filter/grafitto-filter.js";
import "../node_modules/@lrnwebcomponents/dropdown-select/dropdown-select.js";
import "../lrnsys-comment.js";
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
    csrfToken: { type: String },
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
    activeComment: { type: Object, notify: !0 },
    newComment: { type: Object, notify: !0 },
    comments: { type: Object, notify: !0 },
    sourcePath: { type: String, notify: !0 },
    commentOpsBase: { type: String, notify: !0 },
    createStubUrl: { type: String, notify: !0 },
    reqUrl: {
      type: String,
      notify: !0,
      computed:
        "_computeCommentOpsUrl(activeComment, commentOpsBase, csrfToken)"
    }
  },
  attached: function(e) {
    window.simpleModal.requestAvailability();
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
  _computeCommentOpsUrl: function(activeComment, commentOpsBase, csrfToken) {
    if (typeof activeComment !== typeof void 0) {
      return commentOpsBase + "/" + activeComment.id + "?token=" + csrfToken;
    }
  },
  handleLike: function(e) {
    this.activeComment = e.detail.comment;
    this.$.ajaxlikerequest.generateRequest();
  },
  _handleLikeResponse: function(e) {},
  handleDeleteDialog: function(e) {
    this.activeComment = e.detail.comment;
    let c = document.createElement("p"),
      t = document.createTextNode(
        "Are you sure you want to delete your comment?"
      );
    c.appendChild(t);
    let b = document.createElement("div");
    b.classList.add("buttons");
    let pb = document.createElement("paper-button");
    pb.setAttribute("dialog-dismiss", "dialog-dismiss");
    t = document.createTextNode("Decline");
    pb.appendChild(t);
    b.appendChild(pb);
    let pb2 = document.createElement("paper-button");
    pb2.setAttribute("dialog-confirm", "dialog-confirm");
    pb2.setAttribute("autofocus", "autofocus");
    pb2.addEventListener("click", this._handleDeleteConfirm.bind(this));
    t = document.createTextNode("Accept");
    pb2.appendChild(t);
    b.appendChild(pb2);
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: !0,
      cancelable: !0,
      detail: {
        title: "Delete comment",
        elements: { content: c, buttons: b },
        invokedBy: e.detail.target,
        clone: !1
      }
    });
    this.dispatchEvent(evt);
  },
  handleEditing: function(e) {
    this.$.toast.text = "Be awesome to each other";
    this.$.toast.toggle();
  },
  handleTopReply: function(e) {
    this.set("newComment", []);
    this.set("activeComment", []);
    this.$.ajaxcreatestub.generateRequest();
  },
  handleReply: function(e) {
    this.set("newComment", []);
    this.activeComment = e.detail.comment;
    this.$.ajaxcreatestub.generateRequest();
  },
  _updateReply: function(e) {
    var comment = this.activeComment,
      comments = this.comments.data;
    this.newComment = this.newComment.data;
    if (0 == comments.length) {
      comments.push(this.newComment);
    } else if (typeof comment.id == typeof void 0) {
      comments.push(this.newComment);
    } else {
      for (var index = 0; index < comments.length; index++) {
        if (comments[index].id == comment.id) {
          comments.splice(index + 1, 0, this.newComment);
        }
      }
    }
    this.activeComment = this.newComment;
    this.set("comments.data", []);
    this.set("comments.data", comments);
  },
  _handleDeleteConfirm: function(e) {
    this.$.ajaxdeleterequest.generateRequest();
  },
  _handleDeleteResponse: function(e) {
    for (
      var comment = this.activeComment,
        comments = this.comments.data,
        index = 0;
      index < comments.length;
      index++
    ) {
      if (comments[index].id == comment.id) {
        comments.splice(index, 1);
        this.set("activeComment", []);
        this.set("comments.data", []);
        this.set("comments.data", comments);
        this.$.toast.text = "Comment deleted";
        this.$.toast.toggle();
        return !0;
      }
    }
  },
  handleSave: function(e) {
    this.activeComment = e.detail.comment;
    this.$.ajaxupdaterequest.generateRequest();
  },
  _handleUpdateResponse: function(e) {
    this.$.toast.text = "Comment saved!";
    this.$.toast.toggle();
  },
  _toArray: function(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
});
