/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import * as async from "@polymer/polymer/lib/utils/async.js";
import "@polymer/paper-input/paper-textarea.js";
import "@lrnwebcomponents/materializecss-styles/lib/colors.js";
import "@lrnwebcomponents/mtz-marked-editor/mtz-marked-editor.js";
import "@lrnwebcomponents/mtz-marked-editor/lib/mtz-marked-control-generic-line.js";
import "@lrnwebcomponents/mtz-marked-editor/lib/mtz-marked-control-generic-wrap.js";
import "@lrnwebcomponents/mtz-marked-editor/lib/mtz-marked-control-link.js";
import "@lrnwebcomponents/word-count/word-count.js";
import "@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
import "@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "@polymer/marked-element/marked-element.js";
import "@polymer/paper-badge/paper-badge.js";
import "@lrnwebcomponents/moment-element/moment-element.js";
/**
 `lrnsys-comment`
 A well styled comment for a user with markdown support.
 
 * @demo demo/index.html
 */
class LrnsysComment extends PolymerElement {
  constructor() {
    super();
  }
  static get template() {
    return html`
      <style include="materializecss-styles-colors">
        :host {
          display: block;
          padding: 10px 10px 10px 0px;
        }
        :host([disabled]) {
          opacity: 0.5;
          background-color: #cccccc;
          pointer-events: none;
        }
        :host(:focus),
        :host(:hover) {
          z-index: 2;
        }
        :host(:focus) .comment-outer,
        :host(:hover) .comment-outer {
          border: 1px #0277bd solid;
        }
        :host [hidden] {
          display: none;
        }
        .comment-outer {
          display: table;
          width: 100%;
          border: 1px #ddd solid;
          color: #444;
        }
        .comment-outer.new-comment {
          border: 1px #d81b60 dashed;
          color: #000;
        }
        .comment-inner {
          display: table-row;
        }
        .comment-avatar {
          padding: 0 7px;
          width: 40px;
        }

        @media (max-width: 800px) {
          .comment-depth,
          .comment-avatar,
          .comment-content {
            padding: 0;
          }
        }
        .comment-depth,
        .comment-avatar,
        .comment-content {
          padding-top: 8px;
          padding-bottom: 8px;
          display: table-cell;
          vertical-align: top;
        }
        .comment-content {
          padding-right: 7px;
          max-width: 300px;
        }
        h1,
        h2,
        h3,
        h4 {
          text-align: left;
          font-size: 20px;
          line-height: 20px;
        }
        h1.comment-heading,
        h2.comment-heading,
        h3.comment-heading,
        h4.comment-heading {
          margin-top: 7px;
          position: sticky;
        }
        p {
          font-size: 14px;
          line-height: 18px;
          text-align: left;
        }
        #editcomment {
          background-color: white;
          padding: 4px;
        }
        marked-element {
          line-height: 16px;
          font-size: 14.4px;
          max-height: 500px;
          overflow-y: auto;
        }
        .nowrap-me marked-element:hover {
          box-shadow: -1px 0 0 0 black inset;
          cursor: pointer;
        }
        .nowrap-me marked-element ::slotted(#content p.marked-element) {
          height: 32px;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 35px;
        }
        .nowrap-me marked-element ::slotted(#content p.marked-element:after) {
          content: "see more";
          position: absolute;
          bottom: 65px;
          right: 17px;
          color: #1976d2;
        }
        .comment-depth-1 {
          width: 0;
        }
        .comment-depth-2 {
          width: 54px;
          border-right: 3px solid #ccc;
        }
        .comment-depth-3,
        .comment-depth-4,
        .comment-depth-5,
        .comment-depth-6,
        .comment-depth-7,
        .comment-depth-8,
        .comment-depth-9 {
          width: 108px;
          border-right: 3px solid #ccc;
        }
        @media (max-width: 1000px) {
          .comment-depth-2,
          .comment-depth-3,
          .comment-depth-4,
          .comment-depth-5,
          .comment-depth-6,
          .comment-depth-7,
          .comment-depth-8,
          .comment-depth-9 {
            width: 54px;
          }
        }
        @media (max-width: 800px) {
          .comment-depth-2,
          .comment-depth-3,
          .comment-depth-4,
          .comment-depth-5,
          .comment-depth-6,
          .comment-depth-7,
          .comment-depth-8,
          .comment-depth-9 {
            width: 27px;
          }
        }
        @media (max-width: 700px) {
          .comment-depth-2,
          .comment-depth-3,
          .comment-depth-4,
          .comment-depth-5,
          .comment-depth-6,
          .comment-depth-7,
          .comment-depth-8,
          .comment-depth-9 {
            width: 8px;
          }
        }
        .center {
          padding: 0;
        }
        .circle {
          border-radius: 50% !important;
        }
        .comment-actions {
          margin: 0;
          padding: 0;
          display: block;
          border-top: 1px solid #ddd;
        }
        .comment-actions lrnsys-button {
          display: inline-flex;
          --lrnsys-button-height: 30px;
          padding: 1px;
        }
        @media (max-width: 800px) {
          .comment-actions lrnsys-button span {
            display: none;
          }
        }
        .comment-actions .comment-actions-group {
          margin: 0;
          padding: 0;
          display: block;
        }
        .comment-actions .comment-actions-group.left-actions {
          float: left;
        }
        .comment-actions .comment-actions-group.right-actions {
          float: right;
        }
        moment-element {
          float: right;
          font-size: 90%;
          font-style: italic;
          font-weight: normal;
        }
        paper-badge {
          display: flex;
          float: right;
        }
        .like-icon-color {
          color: #2196f3;
        }
        .element-invisible {
          position: absolute;
          left: -9999px;
          top: 0;
          width: 0;
          height: 0;
          overflow: hidden;
        }
      </style>
      <div class$="comment-outer [[commentNew]]">
        <div class="comment-inner">
          <div
            class$="comment-depth comment-depth-[[comment.attributes.threadDepth]] grey lighten-3"
          ></div>
          <div class="comment-avatar">
            <lrndesign-avatar
              id="avatar"
              label="[[comment.relationships.author.data.name]]"
              src="[[comment.relationships.author.data.avatar]]"
              class="float-left ferpa-protect"
            ></lrndesign-avatar>
            <simple-tooltip
              for="avatar"
              animation-delay="0"
              class="ferpa-protect"
              >[[displayName]]</simple-tooltip
            >
            <template
              is="dom-if"
              if="[[comment.relationships.author.data.visual.icon]]"
            >
              <paper-badge
                icon="[[comment.relationships.author.data.visual.icon]]"
                for="papercard"
                label="[[comment.relationships.author.data.visual.label]]"
              >
              </paper-badge>
            </template>
          </div>
          <div class="comment-content">
            <div class="comment-body">
              <div id="bodyarea" class="nowrap-me">
                <h4 class="ferpa-protect comment-heading">
                  <span class="element-invisible">At </span
                  ><moment-element
                    datetime$="[[comment.attributes.created]]"
                    output-format="MMM DD[,] YYYY"
                  ></moment-element>
                  [[comment.relationships.author.data.display_name]]
                  <span class="element-invisible"
                    >[[comment.relationships.author.data.visual.label]]</span
                  >
                  said:
                </h4>
                <marked-element
                  smartypants
                  id="renderedcomment"
                  markdown="[[comment.attributes.body]]"
                >
                  <word-count
                    class="markdown-html-slot"
                    slot="markdown-html"
                  ></word-count>
                </marked-element>
              </div>
              <mtz-marked-editor id="commenteditor" hidden>
                <div slot="controls">
                  <mtz-marked-control-generic-wrap
                    icon="editor:format-bold"
                    title="Bold"
                    syntax-prefix="**"
                    syntax-suffix="**"
                    keys="ctrl+b"
                  ></mtz-marked-control-generic-wrap>
                  <mtz-marked-control-generic-wrap
                    icon="editor:format-italic"
                    title="Italic"
                    syntax-prefix="_"
                    syntax-suffix="_"
                    keys="ctrl+i"
                  ></mtz-marked-control-generic-wrap>
                  <mtz-marked-control-generic-line
                    icon="editor:format-size"
                    title="Heading 3"
                    syntax-prefix="### "
                  ></mtz-marked-control-generic-line>
                  <mtz-marked-control-generic-line
                    icon="editor:format-list-numbered"
                    title="Ordered List"
                    syntax-prefix="1. "
                  ></mtz-marked-control-generic-line>
                  <mtz-marked-control-generic-line
                    icon="editor:format-list-bulleted"
                    title="Unordered List"
                    syntax-prefix="- "
                  ></mtz-marked-control-generic-line>
                  <mtz-marked-control-link
                    icon="editor:insert-link"
                    title="Link"
                  ></mtz-marked-control-link>
                </div>
                <paper-textarea
                  char-counter
                  autofocus
                  id="editcomment"
                  label="Comment"
                  value="{{comment.attributes.body}}"
                  slot="textarea"
                ></paper-textarea>
              </mtz-marked-editor>
            </div>
            <div class="comment-actions">
              <div class="comment-actions-group left-actions">
                <lrnsys-button
                  on-click="actionHandler"
                  id="reply"
                  no-padding
                  data-commentid="[[comment.id]]"
                  icon="reply"
                  hover-class="[[hoverClass]]"
                  icon-class="grey-text no-margin"
                  hidden$="[[!comment.actions.reply]]"
                  label="Reply"
                ></lrnsys-button>
              </div>
              <div class="comment-actions-group right-actions">
                <lrnsys-button
                  on-click="actionHandler"
                  id="edit"
                  data-commentid="[[comment.id]]"
                  icon="create"
                  no-padding
                  hover-class="[[hoverClass]]"
                  icon-class="grey-text no-margin"
                  hidden$="[[!comment.actions.edit]]"
                  label="Edit"
                ></lrnsys-button>
                <lrnsys-button
                  on-click="actionHandler"
                  id="delete"
                  no-padding
                  data-commentid="[[comment.id]]"
                  icon="delete-forever"
                  hover-class="[[hoverClass]]"
                  icon-class="grey-text no-margin"
                  hidden$="[[!comment.actions.delete]]"
                  label="Delete"
                ></lrnsys-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static get tag() {
    return "lrnsys-comment";
  }

  static get properties() {
    return {
      comment: {
        type: Object,
        notify: true,
        observer: "_commentLoaded",
      },
      displayName: {
        type: String,
        notify: true,
        computed:
          "_generateName(comment.relationships.author.data.display_name, comment.relationships.author.data.visual)",
      },
      commentNew: {
        type: String,
        notify: true,
        computed: "_isCommentNew(comment.relationships.author.data.visual)",
      },
      hoverClass: {
        type: String,
        reflectToAttribute: true,
      },
      editform: {
        type: Boolean,
        notify: true,
        observer: "_editTrigger",
        reflectToAttribute: true,
      },
      disabled: {
        type: Boolean,
        notify: true,
        reflectToAttribute: true,
      },
    };
  }

  /**
   * attached lifecycle
   */
  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot
      .querySelector("#bodyarea")
      .addEventListener("click", this.bodyToggle.bind(this));
    this.shadowRoot
      .querySelector("#bodyarea")
      .addEventListener("dblclick", this.bodyToggleOn.bind(this));
  }
  /**
   * detached lifecycle
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.shadowRoot
      .querySelector("#bodyarea")
      .removeEventListener("click", this.bodyToggle.bind(this));
    this.shadowRoot
      .querySelector("#bodyarea")
      .removeEventListener("dblclick", this.bodyToggleOn.bind(this));
  }

  _generateName(name, visual) {
    if (typeof visual !== typeof undefined && visual.label !== false) {
      return name + " (" + visual.label + ")";
    }
    return name;
  }

  _isCommentNew(visual) {
    if (typeof visual !== typeof undefined && visual.label !== false) {
      return "new-comment";
    }
    return "";
  }

  _commentLoaded(e) {
    this.editform = this.comment.metadata.editing;
    this.disabled = this.comment.metadata.disabled;
    this.blockFirstState = true;
  }

  /**
   * Handle all actions from the button bar.
   */
  actionHandler(e) {
    // convert click handler into local dom object
    var target = e.target;
    var comment = null;
    // ensure we have a comment ID to operate against
    if (target.dataCommentid != null && !target.disabled) {
      comment = target.dataCommentid;
      // handle the type of event requested
      if (target.id == "reply") {
        this.dispatchEvent(
          new CustomEvent("comment-reply", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: { comment: this.comment, target: target },
          })
        );
      } else if (target.id == "like") {
        this.shadowRoot
          .querySelector("#like")
          .classList.toggle("like-icon-color");
        this.dispatchEvent(
          new CustomEvent("comment-like", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: { comment: this.comment, target: target },
          })
        );
      } else if (target.id == "edit") {
        // toggle edit, allow edit state handle itself via observer
        this.editform = !this.editform;
      } else if (target.id == "delete") {
        this.dispatchEvent(
          new CustomEvent("comment-delete-dialog", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
              comment: this.comment,
              target: target,
            },
          })
        );
      }
    }
  }

  /**
   * Trigger the edit form.
   */
  _editTrigger(e) {
    // bother checking if they can edit or not first
    if (typeof this.comment !== typeof undefined && this.comment.actions.edit) {
      setTimeout(() => {
        // show / hide the edit vs display area
        this.shadowRoot.querySelector(
          "#renderedcomment"
        ).hidden = this.editform;
        this.shadowRoot.querySelector("#commenteditor").hidden = !this.editform;
        // simple icon toggle
        if (this.editform) {
          this.shadowRoot.querySelector("#edit").icon = "save";
          this.shadowRoot.querySelector("#edit").label = "Save";
          this.shadowRoot.querySelector("#reply").disabled = true;
          this.shadowRoot.querySelector("#editcomment").focus();
          this.dispatchEvent(
            new CustomEvent("comment-editing", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: { comment: this.comment },
            })
          );
          this.blockFirstState = false;
        } else {
          if (!this.blockFirstState) {
            this.dispatchEvent(
              new CustomEvent("comment-save", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: { comment: this.comment },
              })
            );
          } else {
            this.blockFirstState = false;
          }
          this.shadowRoot.querySelector("#edit").icon = "create";
          this.shadowRoot.querySelector("#edit").label = "Edit";
          this.shadowRoot.querySelector("#reply").disabled = false;
        }
      }, 0);
    }
  }
  /**
   * Toggle the body field expanding to show the whole comment
   */
  bodyToggle(e) {
    this.shadowRoot.querySelector("#bodyarea").classList.remove("nowrap-me");
  }

  /**
   * Toggle the body field expanding to show the whole comment
   */
  bodyToggleOn(e) {
    this.shadowRoot.querySelector("#bodyarea").classList.toggle("nowrap-me");
  }
}
window.customElements.define(LrnsysComment.tag, LrnsysComment);
export { LrnsysComment };
