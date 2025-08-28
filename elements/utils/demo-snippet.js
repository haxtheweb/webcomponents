/**
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
 * found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
 * part of the polymer project is also subject to an additional IP rights grant
 * found at http://polymer.github.io/PATENTS.txt
 * 
 * Modernized Lit-based version for HAXTheWeb with dark mode compatibility
 */

import { LitElement, html, css } from "lit";
import "@haxtheweb/d-d-d/d-d-d.js";

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
class DemoSnippet extends LitElement {
  static get tag() {
    return "demo-snippet";
  }

  static get properties() {
    return {
      _markdown: { type: String, state: true },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          box-shadow: var(--ddd-boxShadow-md);
          margin-bottom: var(--ddd-spacing-10);
          border-radius: var(--ddd-radius-sm);
          overflow: hidden;
        }

        .demo {
          display: block;
          border-bottom: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-coalyGray)
          );
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          margin: 0;
          padding: var(--ddd-spacing-5);
        }

        .code-container {
          margin: 0;
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-coalyGray)
          );
          font-size: var(--ddd-font-size-4xs);
          overflow: auto;
          position: relative;
          padding: 0 var(--ddd-spacing-5);
        }

        .code {
          padding: var(--ddd-spacing-5);
          margin: 0;
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-coalyGray)
          );
          font-size: var(--ddd-font-size-4xs);
          overflow: auto;
          font-family: monospace;
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-limestoneLight)
          );
          line-height: var(--ddd-lh-150);
        }

        .code > pre {
          margin: 0;
          padding: 0 0 var(--ddd-spacing-2) 0;
          font-family: inherit;
          color: inherit;
          background: transparent;
        }

        .copy-button {
          position: absolute;
          top: var(--ddd-spacing-3);
          right: var(--ddd-spacing-3);
          text-transform: uppercase;
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-slateGray)
          );
          cursor: pointer;
          background: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-4xs);
          font-family: var(--ddd-font-primary);
          border-radius: var(--ddd-radius-xs);
          transition: all 0.3s ease-in-out;
        }

        .copy-button:hover {
          background: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-coalyGray)
          );
          transform: translateY(-1px);
          box-shadow: var(--ddd-boxShadow-sm);
        }

        .copy-button:active {
          transform: translateY(0);
          box-shadow: none;
        }

        .copy-button.success {
          background: light-dark(
            var(--ddd-theme-default-successLight),
            var(--ddd-theme-default-success)
          );
          color: light-dark(
            var(--ddd-theme-default-success),
            var(--ddd-theme-default-successLight)
          );
        }

        .copy-button.error {
          background: light-dark(
            var(--ddd-theme-default-errorLight),
            var(--ddd-theme-default-error)
          );
          color: light-dark(
            var(--ddd-theme-default-error),
            var(--ddd-theme-default-errorLight)
          );
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

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .copy-button,
          * {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="demo">
        <slot id="content" @slotchange="${this._onSlotChange}"></slot>
      </div>
      
      <div class="code-container">
        <div class="code" id="code">
          <pre>${this._markdown}</pre>
        </div>
        <button 
          class="copy-button" 
          id="copyButton" 
          title="Copy to clipboard"
          @click="${this._copyToClipboard}"
        >
          Copy
        </button>
      </div>
    `;
  }

  constructor() {
    super();
    this._markdown = "";
    this._observer = null;
  }

  connectedCallback() {
    super.connectedCallback();
    // Set up slot change observer after first render
    this.updateComplete.then(() => {
      this._updateMarkdown();
    });
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
    const template = assignedNodes.find(node => 
      node.nodeType === Node.ELEMENT_NODE && node.tagName === "TEMPLATE"
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
    this.dispatchEvent(new CustomEvent("dom-ready", {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: this
    }));
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
    lines.forEach(line => {
      if (line.trim()) {
        const match = line.match(/^(\s*)/);
        if (match) {
          minIndent = Math.min(minIndent, match[1].length);
        }
      }
    });
    
    if (minIndent === Infinity) minIndent = 0;
    
    // Remove common indentation
    return lines.map(line => line.substring(minIndent)).join("\n");
  }

  async _copyToClipboard() {
    const button = this.shadowRoot.querySelector("#copyButton");
    const codeElement = this.shadowRoot.querySelector("#code");
    
    try {
      // Use modern clipboard API if available
      if (navigator.clipboard && globalThis.isSecureContext) {
        await navigator.clipboard.writeText(this._markdown);
        this._showCopySuccess(button);
      } else {
        // Fallback to legacy method
        const range = document.createRange();
        range.selectNodeContents(codeElement);
        const selection = globalThis.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        
        const result = document.execCommand("copy");
        selection.removeAllRanges();
        
        if (result) {
          this._showCopySuccess(button);
        } else {
          this._showCopyError(button);
        }
      }
    } catch (err) {
      console.error("Copy failed:", err);
      this._showCopyError(button);
    }
  }

  _showCopySuccess(button) {
    button.textContent = "Copied!";
    button.classList.add("success");
    button.classList.remove("error");
    setTimeout(() => this._resetCopyButton(button), 2000);
  }

  _showCopyError(button) {
    button.textContent = "Error";
    button.classList.add("error");
    button.classList.remove("success");
    setTimeout(() => this._resetCopyButton(button), 2000);
  }

  _resetCopyButton(button) {
    button.textContent = "Copy";
    button.classList.remove("success", "error");
  }
}

globalThis.customElements.define(DemoSnippet.tag, DemoSnippet);
export { DemoSnippet };
