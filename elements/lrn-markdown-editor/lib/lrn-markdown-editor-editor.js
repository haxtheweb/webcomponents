import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/mtz-marked-editor/mtz-marked-editor.js";
import "@lrnwebcomponents/mtz-marked-editor/lib/mtz-marked-control-generic-wrap.js";
import "@lrnwebcomponents/mtz-marked-editor/lib/mtz-marked-control-generic-line.js";
import "@lrnwebcomponents/mtz-marked-editor/lib/mtz-marked-control-link.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/iron-icons/places-icons.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/paper-input/paper-textarea.js";
import "@polymer/paper-input/paper-input.js";
class LrnMarkdownEditorEditor extends PolymerElement {
  static get template() {
    return html`
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
            title="Heading"
            syntax-prefix="# "
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
          slot="textarea"
          label="Start typing..."
          value="{{content}}"
        ></paper-textarea>
      </mtz-marked-editor>
    `;
  }

  static get tag() {
    return "lrn-markdown-editor-editor";
  }

  static get properties() {
    return {
      content: {
        type: String,
        notify: true
      }
    };
  }

  _changed(e) {
    var content = this.shadowRoot.querySelector("#markededitor").getContent();
    this.set("content", content);
    this.dispatchEvent(
      new CustomEvent("content-updated", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: { content: this.content }
      })
    );
  }
}
window.customElements.define(
  LrnMarkdownEditorEditor.tag,
  LrnMarkdownEditorEditor
);
export { LrnMarkdownEditorEditor };
