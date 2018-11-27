import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@lrnwebcomponents/mtz-marked-editor/mtz-marked-editor.js";
import "../node_modules/@lrnwebcomponents/mtz-marked-editor/lib/mtz-marked-control-generic-wrap.js";
import "../node_modules/@lrnwebcomponents/mtz-marked-editor/lib/mtz-marked-control-generic-line.js";
import "@lrnwebcomponents/mtz-marked-editor/lib/controls/mtz-marked-control-link.js";
import "../node_modules/@polymer/iron-icons/editor-icons.js";
import "../node_modules/@polymer/iron-icons/places-icons.js";
import "../node_modules/@polymer/iron-icon/iron-icon.js";
import "../node_modules/@polymer/paper-input/paper-textarea.js";
import "../node_modules/@polymer/paper-input/paper-input.js";
Polymer({
  _template: html`
    <style>
       :host {
        display: block;
      }

      .mtz-controls {
        display: flex;
        width: 100%;
      }

      .mtz-toolbar {
        flex-grow: 5;
      }

    </style>
    <mtz-marked-editor id="markededitor">
      <div slot="controls" class="mtz-controls">
        <mtz-marked-control-generic-wrap icon="editor:format-bold" title="Bold" syntax-prefix="**" syntax-suffix="**" keys="ctrl+b"></mtz-marked-control-generic-wrap>
        <mtz-marked-control-generic-wrap icon="editor:format-italic" title="Italic" syntax-prefix="_" syntax-suffix="_" keys="ctrl+i"></mtz-marked-control-generic-wrap>
        <mtz-marked-control-generic-line icon="editor:format-size" title="Heading" syntax-prefix="# "></mtz-marked-control-generic-line>
        <mtz-marked-control-generic-line icon="editor:format-list-numbered" title="Ordered List" syntax-prefix="1. "></mtz-marked-control-generic-line>
        <mtz-marked-control-generic-line icon="editor:format-list-bulleted" title="Unordered List" syntax-prefix="- "></mtz-marked-control-generic-line>
        <mtz-marked-control-link icon="editor:insert-link" title="Link"></mtz-marked-control-link>
      </div>
      <paper-textarea slot="textarea" label="Start typing..." value="{{content}}"></paper-textarea>
    </mtz-marked-editor>
`,
  is: "lrn-markdown-editor-editor",
  properties: { content: { type: String, notify: !0 } },
  _changed: function(e) {
    var content = this.$.markededitor.getContent();
    console.log("changed");
    this.set("content", content);
    this.fire("content-updated", { content: this.content });
  }
});
