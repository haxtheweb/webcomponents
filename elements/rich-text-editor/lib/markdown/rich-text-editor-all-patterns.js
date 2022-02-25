
import { html } from "lit";
import { rteMarkdownPatterns } from "./rich-text-editor-markdown.js";
import { rteEmojiPatterns } from "./rich-text-editor-emoji-patterns.js";
import { rteIconPatterns } from "./rich-text-editor-icon-patterns";
import { rteSymbolPatterns } from "./rich-text-editor-symbol-patterns.js";
import { rteMiscPatterns } from "./rich-text-editor-misc-patterns.js";
/**
 * rich-text-editor regex patterns 
 * and documentation for basic markdown
 */
export const rteAllPatterns = {
 documentation : {
   id: "rte-patterns",
   title: "Replacement Patterns",
   contents: [
     html`<p>The following replacement patterns run automatically:</p>`
   ]
 },
 cheatsheetHeadings: ["Pattern","Replacement"],
 patterns: [
   rteMarkdownPatterns,
   rteMiscPatterns,
   rteEmojiPatterns,
   rteIconPatterns,
   rteSymbolPatterns
 ]
};