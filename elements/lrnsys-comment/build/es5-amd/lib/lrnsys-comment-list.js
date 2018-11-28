define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/utils/async.js",
  "../node_modules/@polymer/iron-ajax/iron-ajax.js",
  "../node_modules/@polymer/iron-list/iron-list.js",
  "../node_modules/@polymer/iron-form-element-behavior/iron-form-element-behavior.js",
  "../node_modules/@polymer/app-layout/app-layout.js",
  "../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js",
  "../node_modules/@polymer/paper-toast/paper-toast.js",
  "../node_modules/@lrnwebcomponents/simple-modal/simple-modal.js",
  "../node_modules/@polymer/paper-input/paper-input.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js",
  "../node_modules/@polymer/paper-item/paper-item.js",
  "../node_modules/@polymer/paper-listbox/paper-listbox.js",
  "../node_modules/@lrnwebcomponents/lrnsys-button/lrnsys-button.js",
  "../node_modules/@lrnwebcomponents/grafitto-filter/grafitto-filter.js",
  "../node_modules/@lrnwebcomponents/dropdown-select/dropdown-select.js",
  "../lrnsys-comment.js"
], function(
  _polymerLegacy,
  async,
  _ironAjax,
  _ironList,
  _ironFormElementBehavior,
  _appLayout,
  _appToolbar,
  _paperToast,
  _simpleModal,
  _paperInput,
  _paperButton,
  _paperDropdownMenu,
  _paperItem,
  _paperListbox,
  _lrnsysButton,
  _grafittoFilter,
  _dropdownSelect,
  _lrnsysComment
) {
  "use strict";
  async = babelHelpers.interopRequireWildcard(async);
  function _templateObject_d2df39d0f32e11e89c50c57318d42957() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      :host {\n        display: block;\n      }\n      app-toolbar {\n        padding: 0;\n      }\n      app-toolbar > *:not(:last-child) {\n        margin-right: 10px;\n      }\n      .comment-button {\n        min-width: 125px;\n      }\n    </style>\n    <!-- Load all comments on load of element -->\n    <iron-ajax auto url="[[sourcePath]]" handle-as="json" method="[[opsRequestMethod.list]]" last-response="{{comments}}"></iron-ajax>\n    <!-- Create stub-comment -->\n     <iron-ajax id="ajaxcreatestub" url="[[createStubUrl]]" method="[[opsRequestMethod.create]]" body="[[activeComment.id]]" on-response="_updateReply" handle-as="json" last-response="{{newComment}}"></iron-ajax>\n     <!-- Update comment -->\n    <iron-ajax id="ajaxupdaterequest" url="[[reqUrl]]" method="[[opsRequestMethod.update]]" body="[[activeComment]]" content-type="application/json" handle-as="json" on-response="_handleUpdateResponse"></iron-ajax>\n    <!-- Delete comment -->\n    <iron-ajax id="ajaxdeleterequest" url="[[reqUrl]]" method="[[opsRequestMethod.delete]]" body="[[activeComment]]" content-type="application/json" handle-as="json" on-response="_handleDeleteResponse"></iron-ajax>\n    <!-- Like comment -->\n    <iron-ajax id="ajaxlikerequest" url="[[reqUrl]]" method="[[opsRequestMethod.like]]" body="[[activeComment]]" content-type="application/json" handle-as="json" on-response="_handleLikeResponse"></iron-ajax>\n    <app-toolbar>\n      <lrnsys-button class="comment-button" raised="" on-click="handleTopReply" id="leavecomment" hover-class="blue white-text" label="Add Comment"></lrnsys-button>\n      <dropdown-select id="filtertype" label="Filter Comments by" value="attributes.body">\n        <paper-item value="attributes.body">Body</paper-item>\n        <paper-item value="relationships.author.data.name">User Name</paper-item>\n      </dropdown-select>\n      <paper-input label="Filter Text" id="filtercomments" aria-controls="filteredcomments" value="" always-float-label=""></paper-input>   \n    </app-toolbar>\n    <grafitto-filter id="filteredcomments" items$="[[_toArray(comments.data)]]" where="" as="filtered" like="">\n      <template>\n        <iron-list id="commentlist" items="[[filtered]]" as="item">\n          <template>\n          <lrnsys-comment comment="{{item}}" hover-class="blue white-text"></lrnsys-comment>\n          </template>\n        </iron-list>\n      </template>\n    </grafitto-filter>\n    <paper-toast text="Updated" id="toast"></paper-toast>\n'
      ],
      [
        '\n    <style>\n      :host {\n        display: block;\n      }\n      app-toolbar {\n        padding: 0;\n      }\n      app-toolbar > *:not(:last-child) {\n        margin-right: 10px;\n      }\n      .comment-button {\n        min-width: 125px;\n      }\n    </style>\n    <!-- Load all comments on load of element -->\n    <iron-ajax auto url="[[sourcePath]]" handle-as="json" method="[[opsRequestMethod.list]]" last-response="{{comments}}"></iron-ajax>\n    <!-- Create stub-comment -->\n     <iron-ajax id="ajaxcreatestub" url="[[createStubUrl]]" method="[[opsRequestMethod.create]]" body="[[activeComment.id]]" on-response="_updateReply" handle-as="json" last-response="{{newComment}}"></iron-ajax>\n     <!-- Update comment -->\n    <iron-ajax id="ajaxupdaterequest" url="[[reqUrl]]" method="[[opsRequestMethod.update]]" body="[[activeComment]]" content-type="application/json" handle-as="json" on-response="_handleUpdateResponse"></iron-ajax>\n    <!-- Delete comment -->\n    <iron-ajax id="ajaxdeleterequest" url="[[reqUrl]]" method="[[opsRequestMethod.delete]]" body="[[activeComment]]" content-type="application/json" handle-as="json" on-response="_handleDeleteResponse"></iron-ajax>\n    <!-- Like comment -->\n    <iron-ajax id="ajaxlikerequest" url="[[reqUrl]]" method="[[opsRequestMethod.like]]" body="[[activeComment]]" content-type="application/json" handle-as="json" on-response="_handleLikeResponse"></iron-ajax>\n    <app-toolbar>\n      <lrnsys-button class="comment-button" raised="" on-click="handleTopReply" id="leavecomment" hover-class="blue white-text" label="Add Comment"></lrnsys-button>\n      <dropdown-select id="filtertype" label="Filter Comments by" value="attributes.body">\n        <paper-item value="attributes.body">Body</paper-item>\n        <paper-item value="relationships.author.data.name">User Name</paper-item>\n      </dropdown-select>\n      <paper-input label="Filter Text" id="filtercomments" aria-controls="filteredcomments" value="" always-float-label=""></paper-input>   \n    </app-toolbar>\n    <grafitto-filter id="filteredcomments" items\\$="[[_toArray(comments.data)]]" where="" as="filtered" like="">\n      <template>\n        <iron-list id="commentlist" items="[[filtered]]" as="item">\n          <template>\n          <lrnsys-comment comment="{{item}}" hover-class="blue white-text"></lrnsys-comment>\n          </template>\n        </iron-list>\n      </template>\n    </grafitto-filter>\n    <paper-toast text="Updated" id="toast"></paper-toast>\n'
      ]
    );
    _templateObject_d2df39d0f32e11e89c50c57318d42957 = function _templateObject_d2df39d0f32e11e89c50c57318d42957() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_d2df39d0f32e11e89c50c57318d42957()
    ),
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
    attached: function attached(e) {
      var _this = this;
      window.simpleModal.requestAvailability();
      async.microTask.run(function() {
        _this.$.filteredcomments.querySelector("iron-list").fire("iron-resize");
        window.dispatchEvent(new Event("resize"));
      });
      this.$.filtercomments.addEventListener("value-changed", function(e) {
        _this.$.filteredcomments.like = e.target.value;
      });
      this.$.filtertype.addEventListener("change", function(e) {
        _this.$.filtercomments.value = "";
        _this.$.filteredcomments.where = e.detail.value;
        _this.$.filteredcomments.like = "";
      });
    },
    detached: function detached(e) {
      var _this2 = this;
      this.$.filtercomments.removeEventListener("value-changed", function(e) {
        _this2.$.filteredcomments.like = e.target.value;
      });
      this.$.filtertype.removeEventListener("change", function(e) {
        _this2.$.filtercomments.value = "";
        _this2.$.filteredcomments.where = e.detail.value;
        _this2.$.filteredcomments.like = "";
      });
    },
    _computeCommentOpsUrl: function _computeCommentOpsUrl(
      activeComment,
      commentOpsBase,
      csrfToken
    ) {
      if (
        babelHelpers.typeof(activeComment) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        return commentOpsBase + "/" + activeComment.id + "?token=" + csrfToken;
      }
    },
    handleLike: function handleLike(e) {
      this.activeComment = e.detail.comment;
      this.$.ajaxlikerequest.generateRequest();
    },
    _handleLikeResponse: function _handleLikeResponse(e) {},
    handleDeleteDialog: function handleDeleteDialog(e) {
      this.activeComment = e.detail.comment;
      var c = document.createElement("p"),
        t = document.createTextNode(
          "Are you sure you want to delete your comment?"
        );
      c.appendChild(t);
      var b = document.createElement("div");
      b.classList.add("buttons");
      var pb = document.createElement("paper-button");
      pb.setAttribute("dialog-dismiss", "dialog-dismiss");
      t = document.createTextNode("Decline");
      pb.appendChild(t);
      b.appendChild(pb);
      var pb2 = document.createElement("paper-button");
      pb2.setAttribute("dialog-confirm", "dialog-confirm");
      pb2.setAttribute("autofocus", "autofocus");
      pb2.addEventListener("click", this._handleDeleteConfirm.bind(this));
      t = document.createTextNode("Accept");
      pb2.appendChild(t);
      b.appendChild(pb2);
      var evt = new CustomEvent("simple-modal-show", {
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
    handleEditing: function handleEditing(e) {
      this.$.toast.text = "Be awesome to each other";
      this.$.toast.toggle();
    },
    handleTopReply: function handleTopReply(e) {
      this.set("newComment", []);
      this.set("activeComment", []);
      this.$.ajaxcreatestub.generateRequest();
    },
    handleReply: function handleReply(e) {
      this.set("newComment", []);
      this.activeComment = e.detail.comment;
      this.$.ajaxcreatestub.generateRequest();
    },
    _updateReply: function _updateReply(e) {
      var comment = this.activeComment,
        comments = this.comments.data;
      this.newComment = this.newComment.data;
      if (0 == comments.length) {
        comments.push(this.newComment);
      } else if (
        babelHelpers.typeof(comment.id) ==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
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
    _handleDeleteConfirm: function _handleDeleteConfirm(e) {
      this.$.ajaxdeleterequest.generateRequest();
    },
    _handleDeleteResponse: function _handleDeleteResponse(e) {
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
    handleSave: function handleSave(e) {
      this.activeComment = e.detail.comment;
      this.$.ajaxupdaterequest.generateRequest();
    },
    _handleUpdateResponse: function _handleUpdateResponse(e) {
      this.$.toast.text = "Comment saved!";
      this.$.toast.toggle();
    },
    _toArray: function _toArray(obj) {
      return Object.keys(obj).map(function(key) {
        return obj[key];
      });
    }
  });
});
