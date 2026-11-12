/**
 * Copyright 2023 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { css, html, LitElement } from "lit";
import "./simple-tag.js";
export class SimpleTags extends LitElement {
  static get properties() {
    return {
      tags: { type: String },
      accentColor: { type: String, attribute: "accent-color" },
      autoAccentColor: { type: Boolean, attribute: "auto-accent-color" },
    };
  }

  constructor() {
    super();
    this.tags = "";
    this.autoAccentColor = false;
    this.accentColor = null;
  }

  render() {
    return html` <div class="tag-container">
      ${
        this.tags && this.tags != "" && this.tags.split
          ? this.tags.split(",").map((tag) => {
              return html`
                <simple-tag
                  ?auto-accent-color="${this.autoAccentColor}"
                  value="${tag.trim()}"
                  accent-color="${this.accentColor}"
                ></simple-tag>
              `;
            })
          : ``
      }
    </div>`;
  }
  static get tag() {
    return "simple-tags";
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        .tag-container {
          display: flex;
          flex-wrap: wrap;
          overflow-x: hidden;
          justify-content: flex-start;
        }
        .tag-container {
          gap: var(--ddd-spacing-2, 8px);
          padding-block: var(--ddd-spacing-1, 4px);
        }
      `,
    ];
  }
}
globalThis.customElements.define(SimpleTags.tag, SimpleTags);
