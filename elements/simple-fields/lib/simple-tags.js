import { css, html, LitElement } from "lit";
import "./simple-tag.js";
export class SimpleTags extends LitElement {
  static get properties() {
    return {
      tags: { type: String },
      accentColor: { type: String, attribute: "accent-color" },
    };
  }

  constructor() {
    super();
    this.tags = "";
    this.accentColor = "orange";
  }

  render() {
    return html` <div class="tag-container">
      ${this.tags.split(",").map((tag) => {
        return html`
          <simple-tag
            value="${tag.trim()}"
            accent-color="${this.accentColor}"
          ></simple-tag>
        `;
      })}
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
          justify-content: center;
        }
      `,
    ];
  }
}
customElements.define(SimpleTags.tag, SimpleTags);
