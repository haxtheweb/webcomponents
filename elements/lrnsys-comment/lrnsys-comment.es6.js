/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{dom}from"./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";import*as async from"./node_modules/@polymer/polymer/lib/utils/async.js";import"./node_modules/@polymer/paper-input/paper-textarea.js";import"./node_modules/@lrnwebcomponents/materializecss-styles/lib/colors.js";import"./node_modules/@lrnwebcomponents/mtz-marked-editor/mtz-marked-editor.js";import"./node_modules/@lrnwebcomponents/mtz-marked-editor/lib/mtz-marked-control-generic-line.js";import"./node_modules/@lrnwebcomponents/mtz-marked-editor/lib/mtz-marked-control-generic-wrap.js";import"./node_modules/@lrnwebcomponents/mtz-marked-editor/lib/mtz-marked-control-link.js";import"./node_modules/@lrnwebcomponents/word-count/word-count.js";import"./node_modules/@lrnwebcomponents/lrnsys-button/lrnsys-button.js";import"./node_modules/@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js";/**
`lrnsys-comment`
A well styled comment for a user with markdown support.

* @demo demo/index.html
*/class LrnsysComment extends PolymerElement{constructor(){super();import("./node_modules/@polymer/iron-icons/editor-icons.js");import("./node_modules/@polymer/paper-tooltip/paper-tooltip.js");import("./node_modules/@polymer/marked-element/marked-element.js");import("./node_modules/@polymer/paper-badge/paper-badge.js");import("./node_modules/@lrnwebcomponents/moment-element/moment-element.js")}static get template(){return html`
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
      <div class\$="comment-outer [[commentNew]]">
        <div class="comment-inner">
          <div
            class\$="comment-depth comment-depth-[[comment.attributes.threadDepth]] grey lighten-3"
          ></div>
          <div class="comment-avatar">
            <lrndesign-avatar
              id="avatar"
              label="[[comment.relationships.author.data.name]]"
              src="[[comment.relationships.author.data.avatar]]"
              class="float-left ferpa-protect"
            ></lrndesign-avatar>
            <paper-tooltip
              for="avatar"
              animation-delay="0"
              class="ferpa-protect"
              >[[displayName]]</paper-tooltip
            >
          </div>
          <div class="comment-content">
            <div class="comment-body">
              <div id="bodyarea" class="nowrap-me">
                <h4 class="ferpa-protect comment-heading">
                  <span class="element-invisible">At </span
                  ><moment-element
                    datetime\$="[[comment.attributes.created]]"
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
                  data-commentid="[[comment.id]]"
                  alt="Reply"
                  icon="reply"
                  hover-class="[[hoverClass]]"
                  icon-class="grey-text no-margin"
                  hidden\$="[[!comment.actions.reply]]"
                ></lrnsys-button>
                <lrnsys-button
                  on-click="actionHandler"
                  id="like"
                  data-commentid="[[comment.id]]"
                  alt="Like"
                  icon="thumb-up"
                  hover-class="[[hoverClass]]"
                  icon-class="grey-text no-margin"
                  hidden\$="[[!comment.actions.like]]"
                ></lrnsys-button>
              </div>
              <div class="comment-actions-group right-actions">
                <lrnsys-button
                  on-click="actionHandler"
                  id="edit"
                  data-commentid="[[comment.id]]"
                  icon="create"
                  alt="Edit"
                  hover-class="[[hoverClass]]"
                  icon-class="grey-text no-margin"
                  hidden\$="[[!comment.actions.edit]]"
                ></lrnsys-button>
                <lrnsys-button
                  on-click="actionHandler"
                  id="delete"
                  data-commentid="[[comment.id]]"
                  icon="delete-forever"
                  alt="Delete"
                  hover-class="[[hoverClass]]"
                  icon-class="grey-text no-margin"
                  hidden\$="[[!comment.actions.delete]]"
                ></lrnsys-button>
              </div>
            </div>
          </div>
        </div>
      </div>
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
    `}static get tag(){return"lrnsys-comment"}static get properties(){return{comment:{type:Object,notify:!0,observer:"_commentLoaded"},displayName:{type:String,notify:!0,computed:"_generateName(comment.relationships.author.data.display_name, comment.relationships.author.data.visual)"},commentNew:{type:String,notify:!0,computed:"_isCommentNew(comment.relationships.author.data.visual)"},hoverClass:{type:String,reflectToAttribute:!0},editform:{type:Boolean,notify:!0,observer:"_editTrigger",reflectToAttribute:!0},disabled:{type:Boolean,notify:!0,reflectToAttribute:!0}}}/**
   * attached lifecycle
   */connectedCallback(){super.connectedCallback();this.$.bodyarea.addEventListener("click",this.bodyToggle.bind(this));this.$.bodyarea.addEventListener("dblclick",this.bodyToggleOn.bind(this))}/**
   * detached lifecycle
   */disconnectedCallback(){super.disconnectedCallback();this.$.bodyarea.removeEventListener("click",this.bodyToggle.bind(this));this.$.bodyarea.removeEventListener("dblclick",this.bodyToggleOn.bind(this))}_generateName(name,visual){if(typeof visual!==typeof void 0&&!1!==visual.label){return name+" ("+visual.label+")"}return name}_isCommentNew(visual){if(typeof visual!==typeof void 0&&!1!==visual.label){return"new-comment"}return""}_commentLoaded(e){this.editform=this.comment.metadata.editing;this.disabled=this.comment.metadata.disabled;this.blockFirstState=!0}/**
   * Handle all actions from the button bar.
   */actionHandler(e){// convert click handler into local dom object
var normalizedEvent=dom(e),target=normalizedEvent.localTarget,comment=null;// ensure we have a comment ID to operate against
if(null!=target.dataCommentid&&!target.disabled){comment=target.dataCommentid;// handle the type of event requested
if("reply"==target.id){this.dispatchEvent(new CustomEvent("comment-reply",{bubbles:!0,cancelable:!0,composed:!0,detail:{comment:this.comment,target:target}}))}else if("like"==target.id){this.$.like.classList.toggle("like-icon-color");this.dispatchEvent(new CustomEvent("comment-like",{bubbles:!0,cancelable:!0,composed:!0,detail:{comment:this.comment,target:target}}))}else if("edit"==target.id){// toggle edit, allow edit state handle itself via observer
this.editform=!this.editform}else if("delete"==target.id){this.dispatchEvent(new CustomEvent("comment-delete-dialog",{bubbles:!0,cancelable:!0,composed:!0,detail:{comment:this.comment,target:target}}))}}}/**
   * Trigger the edit form.
   */_editTrigger(e){// bother checking if they can edit or not first
if(typeof this.comment!==typeof void 0&&this.comment.actions.edit){async.microTask.run(()=>{// show / hide the edit vs display area
this.$.renderedcomment.hidden=this.editform;this.$.commenteditor.hidden=!this.editform;// simple icon toggle
if(this.editform){this.$.edit.icon="save";this.$.edit.alt="Save";this.$.reply.disabled=!0;this.$.editcomment.focus();this.dispatchEvent(new CustomEvent("comment-editing",{bubbles:!0,cancelable:!0,composed:!0,detail:{comment:this.comment}}));this.blockFirstState=!1}else{if(!this.blockFirstState){this.dispatchEvent(new CustomEvent("comment-save",{bubbles:!0,cancelable:!0,composed:!0,detail:{comment:this.comment}}))}else{this.blockFirstState=!1}this.$.edit.icon="create";this.$.edit.alt="Edit";this.$.reply.disabled=!1}})}}/**
   * Toggle the body field expanding to show the whole comment
   */bodyToggle(e){this.$.bodyarea.classList.remove("nowrap-me")}/**
   * Toggle the body field expanding to show the whole comment
   */bodyToggleOn(e){this.$.bodyarea.classList.toggle("nowrap-me")}}window.customElements.define(LrnsysComment.tag,LrnsysComment);export{LrnsysComment};