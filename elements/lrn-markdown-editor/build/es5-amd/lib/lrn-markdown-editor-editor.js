define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@lrnwebcomponents/mtz-marked-editor/mtz-marked-editor.js",
  "../node_modules/@lrnwebcomponents/mtz-marked-editor/lib/mtz-marked-control-generic-wrap.js",
  "../node_modules/@lrnwebcomponents/mtz-marked-editor/lib/mtz-marked-control-generic-line.js",
  "../node_modules/@lrnwebcomponents/mtz-marked-editor/lib/controls/mtz-marked-control-link.js",
  "../node_modules/@polymer/iron-icons/editor-icons.js",
  "../node_modules/@polymer/iron-icons/places-icons.js",
  "../node_modules/@polymer/iron-icon/iron-icon.js",
  "../node_modules/@polymer/paper-input/paper-textarea.js",
  "../node_modules/@polymer/paper-input/paper-input.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_aef0af50ecf211e88394557895c93694() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n       :host {\n        display: block;\n      }\n\n      .mtz-controls {\n        display: flex;\n        width: 100%;\n      }\n\n      .mtz-toolbar {\n        flex-grow: 5;\n      }\n\n    </style>\n    <mtz-marked-editor id="markededitor">\n      <div slot="controls" class="mtz-controls">\n        <mtz-marked-control-generic-wrap icon="editor:format-bold" title="Bold" syntax-prefix="**" syntax-suffix="**" keys="ctrl+b"></mtz-marked-control-generic-wrap>\n        <mtz-marked-control-generic-wrap icon="editor:format-italic" title="Italic" syntax-prefix="_" syntax-suffix="_" keys="ctrl+i"></mtz-marked-control-generic-wrap>\n        <mtz-marked-control-generic-line icon="editor:format-size" title="Heading" syntax-prefix="# "></mtz-marked-control-generic-line>\n        <mtz-marked-control-generic-line icon="editor:format-list-numbered" title="Ordered List" syntax-prefix="1. "></mtz-marked-control-generic-line>\n        <mtz-marked-control-generic-line icon="editor:format-list-bulleted" title="Unordered List" syntax-prefix="- "></mtz-marked-control-generic-line>\n        <mtz-marked-control-link icon="editor:insert-link" title="Link"></mtz-marked-control-link>\n      </div>\n      <paper-textarea slot="textarea" label="Start typing..." value="{{content}}"></paper-textarea>\n    </mtz-marked-editor>\n'
    ]);
    _templateObject_aef0af50ecf211e88394557895c93694 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_aef0af50ecf211e88394557895c93694()
    ),
    is: "lrn-markdown-editor-editor",
    properties: { content: { type: String, notify: !0 } },
    _changed: function _changed() {
      var content = this.$.markededitor.getContent();
      console.log("changed");
      this.set("content", content);
      this.fire("content-updated", { content: this.content });
    }
  });
});
