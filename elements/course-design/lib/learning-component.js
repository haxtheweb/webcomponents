/**
 * Copyright 2021
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css, unsafeCSS } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";

// Defines the type options available in the HAX wiring, "Learning Objectives" is the default.
export const learningComponentTypes = {
  "content": "Content",
  "assessment": "Assessment",
  "quiz": "Quiz",
  "submission": "Submission",
  "lesson": "Lesson",
  "module": "Module",
  "task": "Task",
  "activity": "Activity",
  "project": "Project",
  "practice": "Practice",
  "unit": "Unit",
  "objectives": "Learning Objectives",
  "connection": "Connection",
  "knowledge": "Did You Know?",
  "strategy": "Learning Strategy",
  "discuss": "Discuss",
  "listen": "Listen",
  "make": "Make",
  "observe": "Observe",
  "present": "Present",
  "read": "Read",
  "reflect": "Reflect",
  "research": "Research",
  "watch": "Watch",
  "write": "Write"
};

export const learningComponentColors = {
  "content": "blue-grey",
  "assessment": "red",
  "quiz": "blue",
  "submission": "deep-purple",
  "lesson": "purple",
  "module": "red",
  "task": "blue-grey",
  "activity": "orange",
  "project": "deep-orange",
  "practice": "brown",
  "unit": "light-green",
  "objectives": "indigo",
  "connection": "green",
  "knowledge": "cyan",
  "strategy": "teal",
  "discuss": "blue",
  "listen": "purple",
  "make": "orange",
  "observe": "yellow",
  "present": "light-blue",
  "read": "lime",
  "reflect": "amber",
  "research": "deep-orange",
  "watch": "pink",
  "write": "deep-purple"
};

export function iconFromPageType(type) {
  switch(type) {
    case "content":
      return "lrn:page";
    case "assessment":
      return "lrn:assessment";
    case "quiz":
      return "lrn:quiz";
    case "submission":
      return "icons:move-to-inbox";
    case "lesson":
      return "hax:lesson";
    case "module":
      return "hax:module";
    case "unit":
        return "hax:unit";
    case "task":
      return "hax:task";
    case "activity":
      return "hax:ticket";
    case "project":
      return "hax:bulletin-board";
    case "practice":
      return "hax:shovel";
    case "connection":
      return "courseicons:chem-connection";
      break;
    case "knowledge":
      return "courseicons:knowledge";
      break;
    case "strategy":
      return "courseicons:strategy";
      break
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
    let typeToColors = Object.keys(learningComponentColors).map((type) => {
      let color = learningComponentColors[type];
      return `
        :host([type="${type}"]) .header {
          --header-objectives-bg-color: var(--header-${type}-bg-color, var(--simple-colors-default-theme-${color}-8));
        }
        :host([type="${type}"]) simple-icon-button-lite {
          --simple-icon-color: var(--svg-url-${type}-fill-color, var(--simple-colors-default-theme-${color}-8));
        }
      `
    });
        
    return [css`
  :host {
    display: block;
    font-family: "Open Sans", sans-serif;
    border: 1px solid var(--card-border-color, #d9d9d9);
    margin: 15px 0 15px;
  }

  ${unsafeCSS(typeToColors.join("\n"))}

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
        <simple-icon-lite icon="${iconFromPageType(this.type)}"></simple-icon-lite>
      </div>
      <div class="title-wrap">
        <div class="sub-title">${this.subtitle}</div>
        <div class="title">${learningComponentTypes[this.type]}</div>
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
        tags: ["Instructional", "content","design","presentation"],
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
            options: learningComponentTypes,
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