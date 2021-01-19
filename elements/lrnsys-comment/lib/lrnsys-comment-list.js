import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/iron-form-element-behavior/iron-form-element-behavior.js";
import "@polymer/app-layout/app-layout.js";
import "@polymer/app-layout/app-toolbar/app-toolbar.js";
import "@lrnwebcomponents/simple-toast/simple-toast.js";
import "@lrnwebcomponents/simple-modal/simple-modal.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-listbox/paper-listbox.js";
import "@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
import "@lrnwebcomponents/grafitto-filter/grafitto-filter.js";
import "@lrnwebcomponents/simple-fields/lib/simple-fields-container.js";
import "../lrnsys-comment.js";

/**
 * `lrnsys-comment-list`
 * @element lrnsys-comment-list
 * `A listing and event handling for comments.`
 * @demo demo/index.html
 */
class LrnsysCommentList extends PolymerElement {
  static get template() {
    return html`
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
        lrnsys-button {
          font-size: 12px;
        }
        .comment-button {
          min-width: 125px;
        }
      </style>
      <!-- Load all comments on load of element -->
      <iron-ajax
        auto
        url="[[sourcePath]]"
        handle-as="json"
        method="[[opsRequestMethod.list]]"
        last-response="{{comments}}"
      ></iron-ajax>
      <!-- Create stub-comment -->
      <iron-ajax
        id="ajaxcreatestub"
        url="[[createStubUrl]]"
        method="[[opsRequestMethod.create]]"
        body="[[activeComment.id]]"
        on-response="_updateReply"
        handle-as="json"
        last-response="{{newComment}}"
      ></iron-ajax>
      <!-- Update comment -->
      <iron-ajax
        id="ajaxupdaterequest"
        url="[[reqUrl]]"
        method="[[opsRequestMethod.update]]"
        body="[[activeComment]]"
        content-type="application/json"
        handle-as="json"
        on-response="_handleUpdateResponse"
      ></iron-ajax>
      <!-- Delete comment -->
      <iron-ajax
        id="ajaxdeleterequest"
        url="[[reqUrl]]"
        method="[[opsRequestMethod.delete]]"
        body="[[activeComment]]"
        content-type="application/json"
        handle-as="json"
        on-response="_handleDeleteResponse"
      ></iron-ajax>
      <!-- Like comment -->
      <iron-ajax
        id="ajaxlikerequest"
        url="[[reqUrl]]"
        method="[[opsRequestMethod.like]]"
        body="[[activeComment]]"
        content-type="application/json"
        handle-as="json"
        on-response="_handleLikeResponse"
      ></iron-ajax>
      <app-toolbar>
        <lrnsys-button
          icon="add"
          class="comment-button"
          raised
          on-click="handleTopReply"
          id="leavecomment"
          hover-class="blue white-text"
          label="Add Comment"
        ></lrnsys-button>
        <paper-input
          label="Filter comments by text"
          id="filtercomments"
          aria-controls="filteredcomments"
          value=""
          always-float-label=""
        ></paper-input>
      </app-toolbar>
      <grafitto-filter
        id="filteredcomments"
        items$="[[_toArray(comments.data)]]"
        where="attributes.body"
        as="filtered"
        like=""
      >
        <template>
          <template
            is="dom-repeat"
            id="commentlist"
            items="[[filtered]]"
            as="item"
          >
            <lrnsys-comment
              comment="{{item}}"
              hover-class="blue white-text"
            ></lrnsys-comment>
          </template>
        </template>
      </grafitto-filter>
    `;
  }

  static get tag() {
    return "lrnsys-comment-list";
  }

  static get properties() {
    return {
      /**
       * CSRF Token
       */
      csrfToken: {
        type: String,
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
          like: "PATCH",
        },
      },
      /**
       * Comment currently in scope
       */
      activeComment: {
        type: Object,
        notify: true,
      },
      /**
       * New stub comment from backend.
       */
      newComment: {
        type: Object,
        notify: true,
      },
      /**
       * An object containing all comments to render in the list
       */
      comments: {
        type: Object,
        notify: true,
      },
      /**
       * Source to pull the comments from
       */
      sourcePath: {
        type: String,
        notify: true,
      },
      /**
       * Base for ops calls
       */
      commentOpsBase: {
        type: String,
        notify: true,
      },
      /**
       * Source to get stub comments from
       */
      createStubUrl: {
        type: String,
        notify: true,
      },
      /**
       * Source for CRUD ops against individual comments.
       */
      reqUrl: {
        type: String,
        notify: true,
        computed:
          "_computeCommentOpsUrl(activeComment, commentOpsBase, csrfToken)",
      },
    };
  }

  /**
   * attached life cycle
   */
  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot
      .querySelector("#filtercomments")
      .addEventListener("value-changed", (e) => {
        this.shadowRoot.querySelector("#filteredcomments").like =
          e.target.value;
      });
  }
  /**
   * detached life cycle
   */
  disconnectedCallback() {
    this.shadowRoot
      .querySelector("#filtercomments")
      .removeEventListener("value-changed", (e) => {
        this.shadowRoot.querySelector("#filteredcomments").like =
          e.target.value;
      });
    super.disconnectedCallback();
  }
  /**
   * Generate the ops URL based on the active comment
   */
  _computeCommentOpsUrl(activeComment, commentOpsBase, csrfToken) {
    if (typeof activeComment !== typeof undefined) {
      return commentOpsBase + "/" + activeComment.id + "?token=" + csrfToken;
    }
  }
  /**
   * Handle liking a comment.
   */
  handleLike(e) {
    this.activeComment = e.detail.comment;
    this.shadowRoot.querySelector("#ajaxlikerequest").generateRequest();
  }
  constructor() {
    super();
    window.SimpleModal.requestAvailability();
    setTimeout(() => {
      this.addEventListener("comment-save", this.handleSave.bind(this));
      this.addEventListener("comment-editing", this.handleEditing.bind(this));
      this.addEventListener("comment-reply", this.handleReply.bind(this));
      this.addEventListener("comment-like", this.handleLike.bind(this));
      this.addEventListener(
        "comment-delete-dialog",
        this.handleDeleteDialog.bind(this)
      );
    }, 0);
  }
  /**
   * @todo not sure we need to do anything post like button
   */
  _handleLikeResponse(e) {}
  /**
   * Handle a delete dialog to confirm.
   */
  handleDeleteDialog(e) {
    this.activeComment = e.detail.comment;
    // content of dialog
    let c = document.createElement("p");
    let t = document.createTextNode(
      "Are you sure you want to delete your comment? This cannot be undone."
    );
    c.appendChild(t);
    // buttons
    let b = document.createElement("div");
    b.classList.add("buttons");
    // close button
    let pb = document.createElement("button");
    pb.setAttribute("dialog-dismiss", "dialog-dismiss");
    pb.style.padding = "16px";
    pb.style.margin = "16px";
    t = document.createTextNode("Keep comment");
    pb.appendChild(t);
    // confirm button
    let pb2 = document.createElement("button");
    pb2.setAttribute("dialog-confirm", "dialog-confirm");
    pb2.setAttribute("autofocus", "autofocus");
    pb2.addEventListener("click", this._handleDeleteConfirm.bind(this));
    pb2.style.color = "white";
    pb2.style.backgroundColor = "red";
    pb2.style.padding = "16px";
    pb2.style.margin = "16px";
    t = document.createTextNode("Delete the comment");
    pb2.appendChild(t);
    // append buttons
    b.appendChild(pb2);
    b.appendChild(pb);
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        title: "Delete comment",
        elements: {
          content: c,
          buttons: b,
        },
        styles: {
          "--simple-modal-width": "15vw",
          "--simple-modal-max-width": "15vw",
          "--simple-modal-min-height": "10vh",
        },
        invokedBy: e.detail.target,
        clone: false,
      },
    });
    this.dispatchEvent(evt);
  }
  /**
   * Handle editing response
   */
  handleEditing(e) {
    const evt = new CustomEvent("simple-toast-show", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        text: "Be awesome to each other",
        duration: 4000,
      },
    });
    this.dispatchEvent(evt);
  }

  /**
   * Handle a reply event bubbling up from a comment we've printed
   * via our template in this element. This allows the higher element
   * to create new lower ones which can invoke more lower ones from
   * up above.
   */
  handleTopReply(e) {
    // ensure nothing is set as active for when this goes out the door
    this.set("newComment", []);
    this.set("activeComment", []);
    this.shadowRoot.querySelector("#ajaxcreatestub").generateRequest();
  }

  /**
   * Handle a reply event bubbling up from a comment we've printed
   * via our template in this element. This allows the higher element
   * to create new lower ones which can invoke more lower ones from
   * up above.
   */
  handleReply(e) {
    this.set("newComment", []);
    this.activeComment = e.detail.comment;
    // shift where the response will go
    this.shadowRoot.querySelector("#ajaxcreatestub").generateRequest();
  }

  /**
   * Update the UI to reflect the new comment based on returned data
   * added to the end since it's a new comment.
   */
  _updateReply(e) {
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
    this.notifyPath("comments.data");
  }

  /**
   * Handle a delete event bubbling up from a comment we've printed.
   */
  _handleDeleteConfirm(e) {
    this.shadowRoot.querySelector("#ajaxdeleterequest").generateRequest();
  }

  _handleDeleteResponse(e) {
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
        this.notifyPath("comments.data");
        // force tree to notice element updated
        const evt = new CustomEvent("simple-toast-show", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {
            text: "Comment deleted",
            duration: 4000,
          },
        });
        this.dispatchEvent(evt);
        // bail early
        return true;
      }
    }
  }

  /**
   * Handle saving a comment.
   */
  handleSave(e) {
    this.activeComment = e.detail.comment;
    this.shadowRoot.querySelector("#ajaxupdaterequest").generateRequest();
  }

  _handleUpdateResponse(e) {
    const evt = new CustomEvent("simple-toast-show", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        text: "Comment saved!",
        duration: 4000,
      },
    });
    this.dispatchEvent(evt);
  }

  /**
   * Simple way to convert from object to array.
   */
  _toArray(obj) {
    if (obj == null) {
      return [];
    }
    return Object.keys(obj).map(function (key) {
      return obj[key];
    });
  }
}
window.customElements.define(LrnsysCommentList.tag, LrnsysCommentList);
export { LrnsysCommentList };
