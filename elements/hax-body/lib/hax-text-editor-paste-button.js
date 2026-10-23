/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement } from "lit";
import { HAXStore } from "./hax-store.js";
import { RichTextEditorButtonBehaviors } from "@haxtheweb/rich-text-editor/lib/buttons/rich-text-editor-button.js";
/**
 * `hax-text-editor-paste-button`
 * a link button for rich text editor
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @extends RichTextEditorPromptButtonBehaviors
 * @extends LitElement
 * @element hax-text-editor-paste-button
 * @demo ./demo/buttons.html
 */
class HaxTextEditorPasteButton extends RichTextEditorButtonBehaviors(
  LitElement,
) {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "hax-text-editor-paste-button";
  }

  // render function for template
  render() {
    return super.render();
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
    };
  }
  constructor() {
    super();
    this.command = "paste";
    this.icon = "content-paste";
    this.label = "Paste Clipboard";
  }
  async sendCommand(e) {
    // eslint-disable-next-line baseline-js/use-baseline -- feature checked right here; clipboard.read falls back to readText
    const clipboard = globalThis.navigator && globalThis.navigator.clipboard;
    if (!clipboard) return;
    // navigator.clipboard is not a DataTransfer, so _onPaste cannot call
    // getData on it; read the clipboard and hand over an object that is
    const data = { "text/html": "", "text/plain": "" };
    try {
      if (typeof clipboard.read === "function") {
        for (const item of await clipboard.read()) {
          for (const type of ["text/html", "text/plain"]) {
            if (!data[type] && item.types.includes(type)) {
              data[type] = await (await item.getType(type)).text();
            }
          }
        }
      }
      if (!data["text/html"] && !data["text/plain"]) {
        data["text/plain"] = await clipboard.readText();
      }
    } catch (err) {
      // permission denied or no user gesture; try plain text before giving up
      try {
        data["text/plain"] = await clipboard.readText();
      } catch (err2) {
        console.warn("Unable to read the clipboard", err, err2);
        return;
      }
    }
    HAXStore._onPaste({
      preventDefault: () => {},
      stopPropagation: () => {},
      stopImmediatePropagation: () => {},
      ...e,
      clipboardData: {
        getData: (type) => {
          const key = type === "text" ? "text/plain" : type;
          return data[key] || "";
        },
        items: [],
      },
    });
  }
}
globalThis.customElements.define(
  HaxTextEditorPasteButton.tag,
  HaxTextEditorPasteButton,
);
export { HaxTextEditorPasteButton };
