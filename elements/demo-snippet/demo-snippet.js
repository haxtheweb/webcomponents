/**
 * Copyright 2025 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * Inspired by @polymer version, updated for lit, DDD,
 * dark mode and to leverage the HAX ecosystem.
 */

import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/code-sample/code-sample.js";

/**
 * `demo-snippet` is a helper element that displays the source of a code snippet
 * and its rendered demo. It can be used for both native elements and Web Components.
 *
 * This is a modernized Lit-based version of the original Polymer demo-snippet
 * with dark mode compatibility using the DDD design system.
 *
 *     Example of a native element demo
 *
 *         <demo-snippet>
 *           <template>
 *             <input type="date">
 *           </template>
 *         </demo-snippet>
 *
 *     Example of a Web Component demo
 *
 *         <demo-snippet>
 *           <template>
 *             <my-element checked>My Element</my-element>
 *           </template>
 *         </demo-snippet>
 *
 * ### Styling
 *
 * The following custom properties and mixins are available for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--demo-snippet` | Mixin applied to the entire element | `{}`
 * `--demo-snippet-demo` | Mixin applied to just the demo section | `{}`
 * `--demo-snippet-code` | Mixin applied to just the code section | `{}`
 *
 * @element demo-snippet
 * @demo demo/index.html
 */
class DemoSnippet extends DDDSuper(LitElement) {
  static get tag() {
    return "demo-snippet";
  }

  static get properties() {
    return {
      _markdown: { type: String },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          border-radius: var(--ddd-radius-sm);
          overflow: hidden;
          box-shadow: var(--ddd-boxShadow-sm);
          margin: var(--ddd-spacing-10) auto;
          transition: all 0.3s ease-in-out;
        }

        :host(:hover),
        :host(:focus-within) {
          box-shadow: var(--ddd-boxShadow-lg);
        }

        .demo {
          display: block;
          border-bottom: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-coalyGray)
          );
          background-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-potentialMidnight)
          );
          margin: 0;
          padding: var(--ddd-spacing-5);
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          :host {
            border: 2px solid;
          }

          .demo {
            border-bottom-width: 2px;
          }
        }

        /* Code sample styling */
        code-sample {
          margin: 0;
          border-radius: 0;
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="demo">
        <slot id="content" @slotchange="${this._onSlotChange}"></slot>
      </div>

      <code-sample id="codeDisplay" type="html" copy-clipboard-button>
        <template></template>
      </code-sample>
    `;
  }

  constructor() {
    super();
    this._markdown = "";
    this._observer = null;
  }

  firstUpdated() {
    super.firstUpdated();
    // Set up slot change observer after first render
    this.updateComplete.then(() => {
      this._updateMarkdown();
    });
  }

  updated(changedProperties) {
    super.updated(changedProperties);

    // React to _markdown changes and update the code-sample
    if (changedProperties.has("_markdown") && this._markdown) {
      this._updateCodeSample();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
  }

  _onSlotChange() {
    this._updateMarkdown();
  }

  _updateMarkdown() {
    const slot = this.shadowRoot.querySelector("#content");
    if (!slot) return;

    const assignedNodes = slot.assignedNodes({ flatten: true });
    const template = assignedNodes.find(
      (node) =>
        node.nodeType === Node.ELEMENT_NODE && node.tagName === "TEMPLATE",
    );

    // If there's no template, render empty code
    if (!template) {
      this._markdown = "";
      return;
    }

    let snippet = template.innerHTML;

    // Clean up the snippet
    snippet = this._unindent(snippet);

    // Hack: In safari + shady dom, sometime we get an empty 'class' attribute
    snippet = snippet.replace(/ class=""/g, "");

    // Boolean properties are displayed as checked="", so remove the ="" bit
    snippet = snippet.replace(/=""/g, "");

    this._markdown = snippet;

    // Stamp the template content into the demo section
    if (!template.hasAttribute("is")) {
      // Create a document fragment from the template content
      const fragment = document.importNode(template.content, true);

      // Clear any existing demo content and append new content
      const demoSection = this.shadowRoot.querySelector(".demo slot");
      if (demoSection) {
        // Insert the template content after the slot
        const parent = demoSection.parentNode;
        parent.appendChild(fragment);
      }
    }

    // Dispatch dom-ready event
    this.dispatchEvent(
      new CustomEvent("dom-ready", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this,
      }),
    );
  }

  /**
   * Updates the code-sample element by manually creating a template element
   * and inserting it with the current _markdown content
   */
  _updateCodeSample() {
    const codeDisplay = this.shadowRoot.querySelector("#codeDisplay");
    if (!codeDisplay) return;

    // Clear any existing template elements in the code-sample
    const existingTemplate = codeDisplay.querySelector("template");
    if (existingTemplate) {
      codeDisplay.removeChild(existingTemplate);
    }

    // Create a new template element with the markdown content
    const newTemplate = document.createElement("template");
    newTemplate.setAttribute("preserve-content", "preserve-content");
    newTemplate.innerHTML = this._markdown;

    // Insert the template into the code-sample element
    codeDisplay.appendChild(newTemplate);
  }

  // Unindent helper method (simplified version of marked-element's unindent)
  _unindent(text) {
    if (!text) return "";

    const lines = text.split("\n");

    // Remove leading/trailing empty lines
    while (lines.length && lines[0].trim() === "") lines.shift();
    while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();

    if (lines.length === 0) return "";

    // Find minimum indentation (ignoring empty lines)
    let minIndent = Infinity;
    lines.forEach((line) => {
      if (line.trim()) {
        const match = line.match(/^(\s*)/);
        if (match) {
          minIndent = Math.min(minIndent, match[1].length);
        }
      }
    });

    if (minIndent === Infinity) minIndent = 0;

    // Remove common indentation
    return lines.map((line) => line.substring(minIndent)).join("\n");
  }
}

globalThis.customElements.define(DemoSnippet.tag, DemoSnippet);
export { DemoSnippet };
