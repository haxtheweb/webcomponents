/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */

/**
 * Editing state an older editor could save into page HTML. None of it is
 * content: role="textbox" turns headings, paragraphs, list items and links
 * into unnamed text fields for a screen reader (and breaks the lists they sit
 * in), contenteditable makes published text editable, and the text editor's
 * temporary highlight wraps whatever was selected when the page was saved.
 *
 * Invariant: a page renders without any of it. The editor removes the same
 * attributes when it saves (hax-body _stripEditorAttributes), so content saved
 * today never carries them; this keeps everything saved before that rendering
 * the same way, without rewriting anyone's files.
 * Layout attributes (data-hax-grid, data-hax-layout) are left alone: view
 * styles can use them.
 *
 * @param {ParentNode} root a detached node or fragment holding page content
 * @returns {ParentNode} the same root
 */
export function removeEditorArtifacts(root) {
  if (!root || typeof root.querySelectorAll !== "function") {
    return root;
  }
  root.querySelectorAll('[role="textbox"]').forEach((el) => {
    el.removeAttribute("role");
  });
  root.querySelectorAll("[contenteditable]").forEach((el) => {
    el.removeAttribute("contenteditable");
  });
  // the name the text editor gives the block being edited
  root.querySelectorAll("[data-rte-editing-name]").forEach((el) => {
    el.removeAttribute("aria-label");
    el.removeAttribute("data-rte-editing-name");
  });
  // keep what the highlight wrapped, drop the wrapper
  root.querySelectorAll("rich-text-editor-highlight").forEach((el) => {
    el.replaceWith(...el.childNodes);
  });
  return root;
}
