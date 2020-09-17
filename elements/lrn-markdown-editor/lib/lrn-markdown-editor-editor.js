import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/mtz-marked-editor/mtz-marked-editor.js";
import "@lrnwebcomponents/mtz-marked-editor/lib/mtz-marked-control-generic-wrap.js";
import "@lrnwebcomponents/mtz-marked-editor/lib/mtz-marked-control-generic-line.js";
import "@lrnwebcomponents/mtz-marked-editor/lib/mtz-marked-control-link.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/iron-icons/places-icons.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/paper-input/paper-textarea.js";
import "@polymer/paper-input/paper-input.js";
class LrnMarkdownEditorEditor extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
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
      `,
    ];
  }
  /**
   * LitElement render
   */
  render() {
    return html`
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
          value="${this.content}"
          @value-changed="${this._contentChanged}"
        ></paper-textarea>
      </mtz-marked-editor>
    `;
  }
  _contentChanged(e) {
    this.content = e.detail.value;
  }
  static get tag() {
    return "lrn-markdown-editor-editor";
  }

  static get properties() {
    return {
      content: {
        type: String,
      },
    };
  }
  /**
   * LitElement properties changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "content") {
        // notify
        this.dispatchEvent(
          new CustomEvent("content-changed", {
            detail: {
              value: this[propName],
            },
          })
        );
      }
    });
  }

  _changed(e) {
    var content = this.shadowRoot.querySelector("#markededitor").getContent();
    this.content = content;
    this.dispatchEvent(
      new CustomEvent("content-updated", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: { content: this.content },
      })
    );
  }
}
window.customElements.define(
  LrnMarkdownEditorEditor.tag,
  LrnMarkdownEditorEditor
);
export { LrnMarkdownEditorEditor };
