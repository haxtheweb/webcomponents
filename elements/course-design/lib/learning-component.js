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
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";

// Defines the type options available in the HAX wiring, "Learning Objectives" is the default.

const typeOptions = {
  objectives: "Learning Objectives",
  connection: "Connection",
  knowledge: "Did You Know?",
  strategy: "Learning Strategy",
  assess: "Assess",
  discuss: "Discuss",
  listen: "Listen",
  make: "Make",
  observe: "Observe",
  present: "Present",
  reading: "Reading",
  reflect: "Reflect",
  research: "Research",
  watch: "Watch",
  write: "Write",
};

/**
 * `learning-component`
 * `An element for displaying learning materials.`
 * @demo demo/index.html
 * @element learning-component
 */
class LearningComponent extends I18NMixin(LitElement) {
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
    this.subtitle = null;
    this.url = null;
    this.t = {
      ...super.t,
      readMore: "Read More",
    };
  }

  /**
   * CSS
   */

  static get styles() {
    return [css`
  :host {
    display: block;
    font-family: "Open Sans", sans-serif;
    border: 1px solid var(--card-border-color, #d9d9d9);
    margin: 15px 0 15px;
  }
  :host([type="knowledge"]) .header {
    background-color: var(--header-knowledge-bg-color, var(--simple-colors-default-theme-cyan-8,#1d6ba0));
  }
  :host([type="knowledge"]) simple-icon-button-lite {
    --simple-icon-color: var(--svg-url-knowledge-fill-color, var(--simple-colors-default-theme-cyan-8,#1d6ba0));
  }
  :host([type="strategy"]) .header {
    background-color: var(--header-connection-bg-color, var(--simple-colors-default-theme-teal-8,#008080));
  }
  :host([type="strategy"]) simple-icon-button-lite {
    --simple-icon-color: var(--svg-url-strategy-fill-color, var(--simple-colors-default-theme-teal-8,#008080));
  }
  :host([type="connection"]) .header {
    background-color: var(--header-connection-bg-color, var(--simple-colors-default-theme-green-7,#268842));
  }
  :host([type="connection"]) simple-icon-button-lite {
    --simple-icon-color: var(--svg-url-connection-fill-color, var(--simple-colors-default-theme-green-7,#268842));
  }
  :host([type="assess"]) .header {
    background-color: var(--header-assess-bg-color, var(--simple-colors-default-theme-red-7,#c62828));
  }
  :host([type="assess"]) simple-icon-button-lite {
    --simple-icon-color: var(--svg-url-assess-fill-color, var(--simple-colors-default-theme-red-7,#c62828));
  }
  :host([type="discuss"]) .header {
    background-color: var(--header-discuss-bg-color, var(--simple-colors-default-theme-blue-7,#1e88e5));
  } 
  :host([type="discuss"]) simple-icon-button-lite {
    --simple-icon-color: var(--svg-url-discuss-fill-color, var(--simple-colors-default-theme-blue-7,#1e88e5));
  }
  :host([type="listen"]) .header {
    background-color: var(--header-listen-bg-color, var(--simple-colors-default-theme-purple-7,#6a1b9a));
  }
  :host([type="listen"]) simple-icon-button-lite {
    --simple-icon-color: var(--svg-url-listen-fill-color, var(--simple-colors-default-theme-purple-7,#6a1b9a));
  }
  :host([type="make"]) .header {
    background-color: var(--header-make-bg-color, var(--simple-colors-default-theme-orange-7,#dc7927));
  }
  :host([type="make"]) simple-icon-button-lite {
    --simple-icon-color: var(--svg-url-make-fill-color, var(--simple-colors-default-theme-orange-7,#dc7927));
  }
  :host([type="observe"]) .header {
    background-color: var(--header-observe-bg-color, var(--simple-colors-default-theme-yellow-7,#f9a825));
  }
  :host([type="observe"]) simple-icon-button-lite {
    --simple-icon-color: var(--svg-url-observe-fill-color, var(--simple-colors-default-theme-yellow-7,#f9a825));
  }
  :host([type="present"]) .header {
    background-color: var(--header-present-bg-color, var(--simple-colors-default-theme-light-blue-7,#1e88e5));
  }
  :host([type="present"]) simple-icon-button-lite {
    --simple-icon-color: var(--svg-url-present-fill-color, var(--simple-colors-default-theme-light-blue-7,#1e88e5));
  }
  :host([type="read"]) .header {
    background-color: var(--header-read-bg-color, var(--simple-colors-default-theme-lime-7,#268842));
  }
  :host([type="read"]) simple-icon-button-lite {
    --simple-icon-color: var(--svg-url-read-fill-color, var(--simple-colors-default-theme-lime-7,#268842));
  }
  :host([type="reflect"]) .header {
    background-color: var(--header-reflect-bg-color, var(--simple-colors-default-theme-amber-7,#6a1b9a));
  }
  :host([type="reflect"]) simple-icon-button-lite {
    --simple-icon-color: var(--svg-url-reflect-fill-color, var(--simple-colors-default-theme-amber-7,#6a1b9a));
  }
  :host([type="research"]) .header {
    background-color: var(--header-research-bg-color, var(--simple-colors-default-theme-deep-orange-7,#c62828));
  }
  :host([type="research"]) simple-icon-button-lite {
    --simple-icon-color: var(--svg-url-research-fill-color, var(--simple-colors-default-theme-deep-orange-7,#c62828));
  }
  :host([type="watch"]) .header {
    background-color: var(--header-watch-bg-color, var(--simple-colors-default-theme-pink-7,#c62828));
  }
  :host([type="watch"]) simple-icon-button-lite {
    --simple-icon-color: var(--svg-url-watch-fill-color, var(--simple-colors-default-theme-pink-7,#c62828));
  }
  :host([type="write"]) .header {
    background-color: var(--header-write-bg-color, var(--simple-colors-default-theme-deep-purple-7,#c62828));
  }
  :host([type="write"]) simple-icon-button-lite {
    --simple-icon-color: var(--svg-url-write-fill-color, var(--simple-colors-default-theme-deep-purple-7,#c62828));
  }
  .header {
    display: flex;
    align-items: center;
    background-color: var(--header-objectives-bg-color, var(--simple-colors-default-theme-orange-7, #dc7927));
    padding: 10px;
    color: var(--header-font-color, var(--simple-colors-default-theme-grey-1, #fff));
  }
  .title {
    margin: 0;
    padding: 0;
    font-weight: 600;
    text-transform: uppercase;
  }
  .sub-title {
    font-weight: 300;
    text-transform: uppercase;
  }
  .icon {
    display: flex;
  }
  .urlbutton {
    margin: 25px 0 0 0;
  }
  .urlbutton a {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #000;
  }
  simple-icon-lite,
  simple-icon-button-lite {
    fill: var(--header-svg-fill-color, var(--simple-colors-default-theme-grey-1, #fff));
    border-radius: 50%;
    margin: 0 15px 0 10px;
    padding: 5px;
  }

  @media screen and (min-width: 320px) {
    .content {
      padding: 25px 30px;
    }
    .title {
      font-size: 18px;
    }
    .sub-title {
      font-size: 14px;
    }
    .urlbutton {
      display: flex;
      justify-content: center;
    }
    simple-icon-lite {
      --simple-icon-width: 24px;
      --simple-icon-height: 24px;
      height: 35px;
      width: 35px;
      border: 2px solid var(--header-svg-border-color, var(--simple-colors-default-theme-grey-1, #fff));
    }
  }

  @media screen and (min-width: 920px) {
    .content {
      padding: 25px 90px;
    }
    .title {
      font-size: 28px;
    }
    .sub-title {
      font-size: 24px;
    }
    .urlbutton {
      display: flex;
      justify-content: end;
    }
    simple-icon-lite,
    simple-icon-button-lite {
      --simple-icon-width: 36px;
      --simple-icon-height: 36px;
      height: 50px;
      width: 50px;
    }
  }
`];
  }

  /**
   * HTML
   */
  render() {
    return html`
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
      ${this.url ? html`
      <div class="urlbutton">
        <a href="${this.url}" id="url" target="_blank" rel="nofollow noopener">
          <simple-icon-button-lite icon="icons:add-circle-outline" label="${this.t.readMore}"></simple-icon-button-lite>
        </a>
        <simple-tooltip for="url" animation-delay="0">${this.t.readMore}</simple-tooltip>
      </div>`: ``}
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
      case "assess":
        return "courseicons:strategy";
        break;
      case "discuss":
        return "courseicons:strategy";
        break;
      case "listen":
        return "courseicons:listen";
        break;
      case "make":
        return "courseicons:strategy";
        break;
      case "observe":
        return "courseicons:strategy";
        break;
      case "present":
        return "courseicons:strategy";
        break;
      case "reading":
        return "courseicons:strategy";
        break;
      case "reflect":
        return "courseicons:strategy";
        break;
      case "research":
        return "courseicons:strategy";
        break;
      case "watch":
        return "courseicons:strategy";
        break;
      case "write":
        return "lrn:write";
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
            inputMethod: "url",
            icon: "editor:insert-link"
          },
          {
            slot: "",
            title: "Contents",
          },
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