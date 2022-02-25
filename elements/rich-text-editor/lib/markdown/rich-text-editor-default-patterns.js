
import { html } from "lit";
import { rteMarkdownPatterns } from "./rich-text-editor-markdown.js";
import { rteMiscPatterns } from "./rich-text-editor-misc-patterns.js";
/**
 * rich-text-editor regex patterns 
 * and documentation for basic markdown
 */
 export const rteDefaultPatterns = {
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
    rteMiscPatterns
  ]
};