import { LitElement } from "lit";
import { HAXStore } from "../hax-store.js";
import { RichTextEditorButtonBehaviors } from "@haxtheweb/rich-text-editor/lib/buttons/rich-text-editor-button.js";

class HaxTextEditorTagToggle extends RichTextEditorButtonBehaviors(LitElement) {
  static get tag() {
    return "hax-text-editor-tag-toggle";
  }

  sendCommand(e) {
    // Desired block tag from the toggle (ol, ul, h1, h2, blockquote)
    let newTag = this.operationCommand || this.command;
    console.log(this.commandVal)
    if(this.command && this.commandVal){
      newTag = this.commandVal
    } else if (this.operationCommand && this.operationCommandVal){
      newTag = this.operationCommandVal
    }

    // If we don't have a target tag, bail early
    if (!newTag) {
      return;
    }

    // Only intercept when HAX is active; otherwise fall back to
    // the base behavior.
    const body = HAXStore.activeHaxBody;
    if (!body) {
      // Not in a HAX context; use default behavior
      super.sendCommand(e);
      return;
    }

    // Start from the active HAX node if possible
    let node = HAXStore.activeNode;

    // If activeNode isn't a text element, fall back to the
    // block element that rich-text-editor thinks we're in.
    if (!node || !HAXStore.isTextElement(node)) {
      if (typeof this.rangeOrMatchingAncestor === "function") {
        const block = this.rangeOrMatchingAncestor();
        if (block) {
          node = block;
          HAXStore.activeNode = node;
        }
      }
    }

    // If we still don't have a usable node, or it's not a text block,
    // just fall back to the default behavior.
    if (!node || !node.tagName || !HAXStore.isTextElement(node)) {
      super.sendCommand(e);
      return;
    }

    // Revert the selected block to a basic p if the user
    // presses the corresponding toggle again
    if(node.tagName.toLowerCase()===newTag){
      const replacement = body.haxChangeTagName(node, "p", true);

      if (replacement && replacement.tagName) {
        HAXStore.activeNode = replacement;
      }
    }

    // Use HAX's style-guide-aware tag change logic. This will:
    // - preserve attributes and slot
    // - apply style guide overrides
    // - re-wire HAX editing state and focus via __applyNodeEditableStateWhenReady
    //   and __focusLogic (patched in hax-body).
    const replacement = body.haxChangeTagName(node, newTag, true);

    // Ensure HAX sees the new node as active, in case anything upstream
    // relies on activeNode directly after the conversion.
    if (replacement && replacement.tagName) {
      HAXStore.activeNode = replacement;
    }
  }
}

globalThis.customElements.define(
  HaxTextEditorTagToggle.tag,
  HaxTextEditorTagToggle,
);

export { HaxTextEditorTagToggle };