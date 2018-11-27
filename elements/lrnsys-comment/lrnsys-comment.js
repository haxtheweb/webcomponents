import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import * as async from "@polymer/polymer/lib/utils/async.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/marked-element/marked-element.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/paper-input/paper-textarea.js";
import "@polymer/paper-badge/paper-badge.js";
import "@lrnwebcomponents/moment-element/moment-element.js";
import "@lrnwebcomponents/materializecss-styles/lib/colors.js";
import "@lrnwebcomponents/mtz-marked-editor/mtz-marked-editor.js";
import "@lrnwebcomponents/mtz-marked-editor/lib/mtz-marked-control-generic-line.js";
import "@lrnwebcomponents/mtz-marked-editor/lib/mtz-marked-control-generic-wrap.js";
import "@lrnwebcomponents/mtz-marked-editor/lib/mtz-marked-control-link.js";
import "@lrnwebcomponents/word-count/word-count.js";
import "@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
import "@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js";
/**
`lrnsys-comment`
A well styled comment for a user with markdown support.

@demo demo/index.html
*/
Polymer({
  _template: html`
    <style include="materializecss-styles-colors">
      :host {
        display: block;
        padding: 10px 10px 10px 0px;
      }
      :host([disabled]) {
        opacity: .5;
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
        right: 0px;
        top: 0px;
      }
      .like-icon-color {
        color: #2196F3;
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
    <div class\$="comment-outer [[commentNew]]">
      <div class="comment-inner">
        <div class\$="comment-depth comment-depth-[[comment.attributes.threadDepth]] grey lighten-3"></div>
        <div class="comment-avatar">
          <lrndesign-avatar id="avatar" label="[[comment.relationships.author.data.name]]" src="[[comment.relationships.author.data.avatar]]" class="float-left ferpa-protect"></lrndesign-avatar>
          <paper-tooltip for="avatar" animation-delay="0" class="ferpa-protect">[[displayName]]</paper-tooltip>
        </div>
        <div class="comment-content">
          <div class="comment-body">
            <div id="bodyarea" class="nowrap-me">
              <h4 class="ferpa-protect comment-heading">
                <span class="element-invisible">At </span><moment-element datetime\$="[[comment.attributes.created]]" output-format="MMM DD[,] YYYY"></moment-element>
                [[comment.relationships.author.data.display_name]] <span class="element-invisible">[[comment.relationships.author.data.visual.label]]</span> said:
              </h4>
              <marked-element smartypants id="renderedcomment" markdown="[[comment.attributes.body]]">
                <word-count class="markdown-html-slot" slot="markdown-html"></word-count>
              </marked-element>
            </div>
            <mtz-marked-editor id="commenteditor" hidden>
              <div slot="controls">
                <mtz-marked-control-generic-wrap icon="editor:format-bold" title="Bold" syntax-prefix="**" syntax-suffix="**" keys="ctrl+b"></mtz-marked-control-generic-wrap>
                <mtz-marked-control-generic-wrap icon="editor:format-italic" title="Italic" syntax-prefix="_" syntax-suffix="_" keys="ctrl+i"></mtz-marked-control-generic-wrap>
                <mtz-marked-control-generic-line icon="editor:format-size" title="Heading 3" syntax-prefix="### "></mtz-marked-control-generic-line>
                <mtz-marked-control-generic-line icon="editor:format-list-numbered" title="Ordered List" syntax-prefix="1. "></mtz-marked-control-generic-line>
                <mtz-marked-control-generic-line icon="editor:format-list-bulleted" title="Unordered List" syntax-prefix="- "></mtz-marked-control-generic-line>
                <mtz-marked-control-link icon="editor:insert-link" title="Link"></mtz-marked-control-link>
              </div>
              <paper-textarea char-counter autofocus id="editcomment" label="Comment" value="{{comment.attributes.body}}" slot="textarea"></paper-textarea>
            </mtz-marked-editor>
          </div>
          <div class="comment-actions">
            <div class="comment-actions-group left-actions">
              <lrnsys-button on-tap="actionHandler" id="reply" data-commentid="[[comment.id]]" alt="Reply" icon="reply" hover-class="[[hoverClass]]" icon-class="grey-text no-margin" hidden\$="[[!comment.actions.reply]]"></lrnsys-button>
              <lrnsys-button on-tap="actionHandler" id="like" data-commentid="[[comment.id]]" alt="Like" icon="thumb-up" hover-class="[[hoverClass]]" icon-class="grey-text no-margin" hidden\$="[[!comment.actions.like]]"></lrnsys-button>
            </div>
            <div class="comment-actions-group right-actions">
              <lrnsys-button on-tap="actionHandler" id="edit" data-commentid="[[comment.id]]" icon="create" alt="Edit" hover-class="[[hoverClass]]" icon-class="grey-text no-margin" hidden\$="[[!comment.actions.edit]]"></lrnsys-button>
              <lrnsys-button on-tap="actionHandler" id="delete" data-commentid="[[comment.id]]" icon="delete-forever" alt="Delete" hover-class="[[hoverClass]]" icon-class="grey-text no-margin" hidden\$="[[!comment.actions.delete]]"></lrnsys-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template is="dom-if" if="[[comment.relationships.author.data.visual.icon]]">
      <paper-badge icon="[[comment.relationships.author.data.visual.icon]]" for="papercard" label="[[comment.relationships.author.data.visual.label]]">
      </paper-badge>
    </template>
`,

  is: "lrnsys-comment",

  properties: {
    comment: {
      type: Object,
      notify: true,
      observer: "_commentLoaded"
    },
    displayName: {
      type: String,
      notify: true,
      computed:
        "_generateName(comment.relationships.author.data.display_name, comment.relationships.author.data.visual)"
    },
    commentNew: {
      type: String,
      notify: true,
      computed: "_isCommentNew(comment.relationships.author.data.visual)"
    },
    hoverClass: {
      type: String,
      reflectToAttribute: true
    },
    editform: {
      type: Boolean,
      notify: true,
      observer: "_editTrigger",
      reflectToAttribute: true
    },
    disabled: {
      type: Boolean,
      notify: true,
      reflectToAttribute: true
    }
  },

  /**
   * attached lifecycle
   */
  attached: function() {
    this.$.bodyarea.addEventListener("tap", this.bodyToggle.bind(this));
    this.$.bodyarea.addEventListener("dblclick", this.bodyToggleOn.bind(this));
  },
  /**
   * detached lifecycle
   */
  detached: function() {
    this.$.bodyarea.removeEventListener("tap", this.bodyToggle.bind(this));
    this.$.bodyarea.removeEventListener(
      "dblclick",
      this.bodyToggleOn.bind(this)
    );
  },

  _generateName: function(name, visual) {
    if (typeof visual !== typeof undefined && visual.label !== false) {
      return name + " (" + visual.label + ")";
    }
    return name;
  },

  _isCommentNew: function(visual) {
    if (typeof visual !== typeof undefined && visual.label !== false) {
      return "new-comment";
    }
    return "";
  },

  _commentLoaded: function(e) {
    this.editform = this.comment.metadata.editing;
    this.disabled = this.comment.metadata.disabled;
    this.blockFirstState = true;
  },

  /**
   * Handle all actions from the button bar.
   */
  actionHandler: function(e) {
    // convert click handler into local dom object
    var normalizedEvent = dom(e);
    var target = normalizedEvent.localTarget;
    var comment = null;
    // ensure we have a comment ID to operate against
    if (target.dataCommentid != null && !target.disabled) {
      comment = target.dataCommentid;
      // handle the type of event requested
      if (target.id == "reply") {
        this.fire("comment-reply", { comment: this.comment, target: target });
      } else if (target.id == "like") {
        this.$.like.classList.toggle("like-icon-color");
        this.fire("comment-like", { comment: this.comment, target: target });
      } else if (target.id == "edit") {
        // toggle edit, allow edit state handle itself via observer
        this.editform = !this.editform;
      } else if (target.id == "delete") {
        this.fire("comment-delete-dialog", {
          comment: this.comment,
          target: target
        });
      }
    }
  },

  /**
   * Trigger the edit form.
   */
  _editTrigger: function(e) {
    // bother checking if they can edit or not first
    if (typeof this.comment !== typeof undefined && this.comment.actions.edit) {
      async.microTask.run(() => {
        // show / hide the edit vs display area
        this.$.renderedcomment.hidden = this.editform;
        this.$.commenteditor.hidden = !this.editform;
        // simple icon toggle
        if (this.editform) {
          this.$.edit.icon = "save";
          this.$.edit.alt = "Save";
          this.$.reply.disabled = true;
          this.$.editcomment.focus();
          this.fire("comment-editing", { comment: this.comment });
          this.blockFirstState = false;
        } else {
          if (!this.blockFirstState) {
            this.fire("comment-save", { comment: this.comment });
          } else {
            this.blockFirstState = false;
          }
          this.$.edit.icon = "create";
          this.$.edit.alt = "Edit";
          this.$.reply.disabled = false;
        }
        this.fire("iron-resize");
      });
    }
  },
  /**
   * Toggle the body field expanding to show the whole comment
   */
  bodyToggle: function(e) {
    this.$.bodyarea.classList.remove("nowrap-me");
    this.fire("iron-resize");
  },

  /**
   * Toggle the body field expanding to show the whole comment
   */
  bodyToggleOn: function(e) {
    this.$.bodyarea.classList.toggle("nowrap-me");
    this.fire("iron-resize");
  }
});
