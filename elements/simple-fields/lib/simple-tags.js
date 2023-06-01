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
      ${this.tags
        ? this.tags.split(",").map((tag) => {
            return html`
              <simple-tag
                ?auto-accent-color="${this.autoAccentColor}"
                value="${tag.trim()}"
                accent-color="${this.accentColor}"
              ></simple-tag>
            `;
          })
        : ``}
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
        simple-tag {
          margin: 2px 2px;
        }
      `,
    ];
  }
}
customElements.define(SimpleTags.tag, SimpleTags);
