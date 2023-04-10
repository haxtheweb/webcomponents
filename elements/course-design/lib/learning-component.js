/**
 * Copyright 2021
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";

// Defines the type options available in the HAX wiring, "Learning Objectives" is the default.

const typeOptions = {
  objectives: "Learning Objectives",
  connection: "Chem Connection",
  knowledge: "Did You Know?",
  strategy: "Learning Strategies"
};

/**
 * `learning-component`
 * `An element for displaying learning materials.`
 * @demo demo/index.html
 * @element learning-component
 */
class LearningComponent extends LitElement {
  /**
   * Convention we use
   */
  static get tag() {
    return "learning-component";
  }

  /**
   * Properties
   */

  static get properties() {
    return {
      type: { type: String, reflect: true },
      subtitle: { type: String },
      url: { type: String }
    };
  }

  constructor() {
    super();
    this.type = "objectives";
    this.subtitle = "";
    this.url = "";
  }

  /**
   * CSS
   */

  static get styles() {
    return [
      css`
        :host {
          display: block;
          font-family: "Open Sans", sans-serif;
          border: 1px solid var(--card-border-color, #d9d9d9);
          margin: 15px 0 15px;
        }

        :host([type="knowledge"]) .header {
          background-color: var(--header-knowledge-bg-color, var(--simple-colors-default-theme-cyan-8,#1d6ba0));
        }

        :host([type="connection"]) .header {
          background-color: var(--header-connection-bg-color, var(--simple-colors-default-theme-green-7,#268842));
        }

        :host([type="strategy"]) .header {
          background-color: var(--header-connection-bg-color, var(--simple-colors-default-theme-teal-8,#008080));
        }

        :host([type="knowledge"]) simple-icon-button-lite {
          --simple-icon-color: var(--svg-url-knowledge-fill-color, var(--simple-colors-default-theme-cyan-8,#1d6ba0));
        }

        :host([type="connection"]) simple-icon-button-lite {
          --simple-icon-color: var(--svg-url-connection-fill-color, var(--simple-colors-default-theme-green-7,#268842));
        }

        :host([type="strategy"]) simple-icon-button-lite {
          --simple-icon-color: var(--svg-url-strategy-fill-color, var(--simple-colors-default-theme-teal-8,#008080));
        }

        .header {
          display: flex;
          align-items: center;
          background-color: var(--header-objectives-bg-color, var(--simple-colors-default-theme-orange-7, #dc7927));
          padding: 10px;
          color: var(--header-font-color, #fff);
        }

        .title {
          margin: 0;
          padding: 0;
          font-wight: 600;
          text-transform: uppercase;
        }

        @media screen and (min-width: 320px) {
          .title {
            font-size: 18px;
          }
        }

        @media screen and (min-width: 920px) {
          .title {
            font-size: 28px;
          }
        }

        .sub-title {
          font-weight: 300;
          text-transform: uppercase;
        }

        @media screen and (min-width: 320px) {
          .sub-title {
            font-size: 14px;
          }
        }

        @media screen and (min-width: 920px) {
          .sub-title {
            font-size: 24px;
          }
        }

        @media screen and (min-width: 320px) {
          simple-icon-lite {
            --simple-icon-width: 24px;
            --simple-icon-height: 24px;
            height: 35px;
            width: 35px;
            border: 2px solid var(--header-svg-border-color, #fff);
          }
        }

        @media screen and (min-width: 920px) {
          simple-icon-lite,
          simple-icon-button-lite {
            --simple-icon-width: 36px;
            --simple-icon-height: 36px;
            height: 50px;
            width: 50px;
          }
        }

        .icon {
          display: flex;
        }

        simple-icon-lite,
        simple-icon-button-lite {
          fill: var(--header-svg-fill-color, #fff);
          border-radius: 50%;
          margin: 0 15px 0 10px;
          padding: 5px;
        }

        @media screen and (min-width: 320px) {
          .content {
            padding: 25px 30px;
          }
        }

        @media screen and (min-width: 920px) {
          .content {
            padding: 25px 90px;
          }
        }

        #url-button {
          margin: 25px 0 0 0;
        }

        #url-button a {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: #000;
        }

        @media screen and (min-width: 320px) {
          #url-button {
            display: flex;
            justify-content: center;
          }
        }

        @media screen and (min-width: 920px) {
          #url-button {
            display: flex;
            justify-content: end;
          }
        }
      `
    ];
  }

  /**
   * HTML
   */
  render() {
    return html`
      <div id="card-wrap">
        <div class="header">
          <div class="icon">
            <simple-icon-lite icon="${this.renderIcon(this.type)}"></simple-icon-lite>
          </div>
          <div class="title-wrap">
            <div class="sub-title">${this.subtitle}</div>
            <div class="title">${typeOptions[this.type]}</div>
          </div>
        </div>
        <div class="content">
          <slot></slot>
          ${this.url
            ? html`
                <div id="url-button">
                  <a href="${this.url}" id="link" target="_blank">
                  <simple-icon-button-lite icon="icons:add-circle-outline" label="Read more"></simple-icon-button-lite>
                  </a>
                  <simple-tooltip for="url" animation-delay="0">Read More</simple-tooltip>
                </div>
              `
            : ``}
        </div>
      </div>
    `;
  }

  renderIcon(type) {
    switch (type) {
      case "connection":
        return "courseicons:chem-connection";
        break;
      case "knowledge":
        return "courseicons:knowledge";
        break;
      case "strategy":
        return "courseicons:strategy";
        break;
    }
    return "courseicons:learning-objectives";
  }

  // Implement HAX Wiring
  static get haxProperties() {
    return {
      type: "grid",
      canScale: true,
      canPosition: false,
      canEditSource: true,
      gizmo: {
        title: "Learning Component",
        description:
          "A card for instructors to communicate pedagogy and instructional strategies.",
        icon: "icons:bookmark",
        color: "orange",
        groups: ["Instructional", "content","design","presentation"],
        handles: [],
        meta: {
          author: "HAXTheWeb core team"
        }
      },
      settings: {
        configure: [
          {
            property: "type",
            title: "Type",
            description: "The type of card to be used.",
            inputMethod: "select",
            options: typeOptions,
            required: true
          },
          {
            property: "subtitle",
            title: "Sub-Title",
            description: "The sub-title of the card.",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "url",
            title: "Link",
            description:
              "An optional link  for the card (Link not available for Learning Objectives).",
            inputMethod: "textfield",
            icon: "editor:insert-link"
          },
          {
            slot: "",
          }
        ],
        advanced: []
      },
      demoSchema: [
        {
          tag: "learning-component",
          properties: {
            type: "objectives",
            subtitle: "Unit 1"
          },
          content: "<p>By the end of this lesson, you should be able to...</p>"
        }
      ]
    };
  }
}
customElements.define(LearningComponent.tag, LearningComponent);
export { LearningComponent };