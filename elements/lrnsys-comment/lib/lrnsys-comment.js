import "moment-element/moment-element.js";
import "materializecss-styles/colors.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/marked-element/marked-element.js";
import "mtz-marked-editor/mtz-marked-editor.js";
import "mtz-marked-editor/mtz-marked-control-generic-line.js";
import "mtz-marked-editor/mtz-marked-control-generic-wrap.js";
import "mtz-marked-editor/controls/mtz-marked-control-link.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/paper-badge/paper-badge.js";
import "word-count/word-count.js";
import "lrnsys-button/lrnsys-button.js";
import "lrndesign-avatar/lrndesign-avatar.js";
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
      :host[disabled] {
        opacity: .5;
        background-color: #cccccc;
        pointer-events: none;
      }
      :host:focus,
      :host:hover {
        z-index: 2;
      }
      :host:focus .comment-outer,
      :host:hover .comment-outer {
        border: 1px #0277bd solid;
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
        padding-top: 0.5em;
        padding-bottom: 0.5em;
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
        font-size: 1rem;
        line-height: 1.25rem;
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
      #edit-comment {
        background-color: white;
        padding: .25em;
      }
      marked-element {
        line-height: 1rem;
        font-size: 0.9rem;
      }
      .nowrap-me marked-element:hover {
        box-shadow: -1px 0 0 0 black inset;
        cursor: pointer;
      }
      .nowrap-me marked-element ::slotted(#content p.marked-element) {
        height: 2em;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 35px;
      }
      .nowrap-me marked-element ::slotted(#content p.marked-element::after) {
        content: "see more";
        position: absolute;
        bottom: 65px;
        right: 17px;
        color: #1976d2;
      }
      .comment-depth-1 {
        width: 0em;
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
              <marked-element smartypants="" id="rendered-comment" markdown="[[comment.attributes.body]]">
                <word-count class="markdown-html-slot" slot="markdown-html"></word-count>
              </marked-element>
            </div>
            <mtz-marked-editor id="comment-editor" hidden="">
              <div slot="controls">
                <mtz-marked-control-generic-wrap icon="editor:format-bold" title="Bold" syntax-prefix="**" syntax-suffix="**" keys="ctrl+b"></mtz-marked-control-generic-wrap>
                <mtz-marked-control-generic-wrap icon="editor:format-italic" title="Italic" syntax-prefix="_" syntax-suffix="_" keys="ctrl+i"></mtz-marked-control-generic-wrap>
                <mtz-marked-control-generic-line icon="editor:format-size" title="Heading 3" syntax-prefix="### "></mtz-marked-control-generic-line>
                <mtz-marked-control-generic-line icon="editor:format-list-numbered" title="Ordered List" syntax-prefix="1. "></mtz-marked-control-generic-line>
                <mtz-marked-control-generic-line icon="editor:format-list-bulleted" title="Unordered List" syntax-prefix="- "></mtz-marked-control-generic-line>
                <mtz-marked-control-link icon="editor:insert-link" title="Link"></mtz-marked-control-link>
              </div>
              <paper-textarea char-counter="" autofocus="" id="edit-comment" label="Comment" value="{{comment.attributes.body}}" slot="textarea"></paper-textarea>
            </mtz-marked-editor>
          </div>
          <div class="comment-actions">
            <div class="comment-actions-group left-actions">
              <lrnsys-button on-click="actionHandler" id="reply" data-commentid="[[comment.id]]" alt="Reply" icon="reply" hover-class="[[hoverClass]]" icon-class="grey-text no-margin" hidden\$="[[!comment.actions.reply]]"></lrnsys-button>
              <lrnsys-button on-click="actionHandler" id="like" data-commentid="[[comment.id]]" alt="Like" icon="thumb-up" hover-class="[[hoverClass]]" icon-class="grey-text no-margin" hidden\$="[[!comment.actions.like]]"></lrnsys-button>
            </div>
            <div class="comment-actions-group right-actions">
              <lrnsys-button on-click="actionHandler" id="edit" data-commentid="[[comment.id]]" icon="create" alt="Edit" hover-class="[[hoverClass]]" icon-class="grey-text no-margin" hidden\$="[[!comment.actions.edit]]"></lrnsys-button>
              <lrnsys-button on-click="actionHandler" id="delete" data-commentid="[[comment.id]]" icon="delete-forever" alt="Delete" hover-class="[[hoverClass]]" icon-class="grey-text no-margin" hidden\$="[[!comment.actions.delete]]"></lrnsys-button>
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

  listeners: {
    "bodyarea.tap": "bodyToggle",
    "bodyarea.dblclick": "bodyToggleOn"
  },

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
    let root = this;
    root.editform = root.comment.metadata.editing;
    root.disabled = root.comment.metadata.disabled;
    root.blockFirstState = true;
  },

  /**
   * Handle all actions from the button bar.
   */
  actionHandler: function(e) {
    let root = this;
    // convert click handler into local dom object
    var normalizedEvent = Polymer.dom(e);
    var target = normalizedEvent.localTarget;
    var comment = null;
    // ensure we have a comment ID to operate against
    if (target.dataCommentid != null && !target.disabled) {
      comment = target.dataCommentid;
      // handle the type of event requested
      if (target.id == "reply") {
        root.fire("comment-reply", { comment: root.comment });
      } else if (target.id == "like") {
        root.$$("#like").classList.toggle("like-icon-color");
        root.fire("comment-like", { comment: root.comment });
      } else if (target.id == "edit") {
        // toggle edit, allow edit state handle itself via observer
        root.editform = !root.editform;
      } else if (target.id == "delete") {
        root.fire("comment-delete-dialog", { comment: root.comment });
      }
    }
  },

  /**
   * Trigger the edit form.
   */
  _editTrigger: function(e) {
    let root = this;
    // bother checking if they can edit or not first
    if (typeof root.comment !== typeof undefined && root.comment.actions.edit) {
      root.async(function() {
        // show / hide the edit vs display area
        root.$$("#rendered-comment").hidden = root.editform;
        root.$$("#comment-editor").hidden = !root.editform;
        // simple icon toggle
        if (root.editform) {
          root.$$("#edit").icon = "save";
          root.$$("#edit").alt = "Save";
          root.$$("#reply").disabled = true;
          root.$$("#edit-comment").focus();
          root.fire("comment-editing", { comment: root.comment });
          root.blockFirstState = false;
        } else {
          if (!root.blockFirstState) {
            root.fire("comment-save", { comment: root.comment });
          } else {
            root.blockFirstState = false;
          }
          root.$$("#edit").icon = "create";
          root.$$("#edit").alt = "Edit";
          root.$$("#reply").disabled = false;
        }
        document.querySelector("iron-list").fire("iron-resize");
        // access sibling or parent elements here
      });
    }
  },

  /**
   * Toggle the body field expanding to show the whole comment
   */
  bodyToggle: function(e) {
    let root = this;
    root.$.bodyarea.classList.remove("nowrap-me");
    document.querySelector("iron-list").fire("iron-resize");
  },

  /**
   * Toggle the body field expanding to show the whole comment
   */
  bodyToggleOn: function(e) {
    let root = this;
    root.$.bodyarea.classList.toggle("nowrap-me");
    document.querySelector("iron-list").fire("iron-resize");
  }
});
