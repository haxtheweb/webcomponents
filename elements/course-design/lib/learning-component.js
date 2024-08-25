/**
 * Copyright 2021
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";

// Defines the type options available in the HAX wiring, "Learning Objectives" is the default.
export const learningComponentNouns = {
  content: "Content",
  assessment: "Assessment",
  quiz: "Quiz",
  submission: "Submission",
  lesson: "Lesson",
  module: "Module",
  task: "Task",
  activity: "Activity",
  project: "Project",
  practice: "Practice",
  unit: "Unit",
  objectives: "Learning Objectives",
};

export const learningComponentVerbs = {
  connection: "Connection",
  knowledge: "Did You Know?",
  strategy: "Learning Strategy",
  discuss: "Discuss",
  listen: "Listen",
  make: "Make",
  observe: "Observe",
  present: "Present",
  read: "Read",
  reflect: "Reflect",
  research: "Research",
  watch: "Watch",
  write: "Write",
};

export const learningComponentTypes = {
  ...learningComponentVerbs,
  ...learningComponentNouns,
};

export const learningComponentColors = {
  content: "blue-grey",
  assessment: "red",
  quiz: "blue",
  submission: "deep-purple",
  lesson: "purple",
  module: "red",
  task: "blue-grey",
  activity: "orange",
  project: "deep-orange",
  practice: "brown",
  unit: "light-green",
  objectives: "indigo",
  connection: "green",
  knowledge: "cyan",
  strategy: "teal",
  discuss: "blue",
  listen: "purple",
  make: "orange",
  observe: "yellow",
  present: "light-blue",
  read: "lime",
  reflect: "amber",
  research: "deep-orange",
  watch: "pink",
  write: "deep-purple",
};

export function iconFromPageType(type) {
  switch (type) {
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
    case "read":
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
class LearningComponent extends I18NMixin(DDD) {
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
      ...super.properties,
      type: { type: String, reflect: true },
      subtitle: { type: String },
      title: { type: String },
      icon: { type: String },
      url: { type: String },
    };
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has("type") && this.type && this.type != "") {
      this.accentColor = learningComponentColors[this.type];
      this.title = learningComponentTypes[this.type];
      this.icon = iconFromPageType(this.type);
    }
  }

  constructor() {
    super();
    this.icon = null;
    this.accentColor = null;
    this.dark = false;
    this.type = "";
    this.subtitle = null;
    this.title = null;
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
    return [
      super.styles,
      css`
        :host {
          display: block;
          margin: var(--ddd-spacing-4) 0;
          color: black;
          background-color: var(--ddd-theme-accent, white);
        }
        .header {
          display: grid;
          grid-template-columns: 0.1fr 1fr;
          align-items: center;
          background-color: var(
            --ddd-component-learning-component-title-background,
            var(
              --ddd-theme-primary,
              var(--simple-colors-default-theme-accent-8, #dc7927)
            )
          );
          padding: var(--ddd-spacing-3);
          color: var(
            --ddd-theme-font-color,
            var(--simple-colors-default-theme-accent-1, #fff)
          );
        }
        .title {
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
          font-weight: var(--ddd-font-weight-bold);
          text-transform: uppercase;
        }
        .sub-title {
          font-weight: var(--ddd-font-weight-regular);
          text-transform: uppercase;
        }
        .icon {
          display: flex;
          min-height: var(--ddd-icon-xl);
          min-width: var(--ddd-icon-xl);
        }
        .urlbutton a {
          display: flex;
          align-items: center;
          text-decoration: none;
        }
        simple-icon-lite,
        simple-icon-button-lite {
          color: var(
            --ddd-app-color-icons,
            var(--simple-colors-default-theme-grey-1, #fff)
          );
          margin: 0 var(--ddd-spacing-4) 0 var(--ddd-spacing-3);
          padding: var(--ddd-spacing-1);
        }

        simple-icon-button-lite {
          color: var(--simple-colors-default-theme-accent-8);
        }

        .content {
          padding: var(--ddd-spacing-5) var(--ddd-spacing-3)
            var(--ddd-spacing-5) var(--ddd-spacing-6);
        }

        .urlPresent {
          display: grid;
          grid-template-columns: 1fr 0.1fr;
        }

        @media screen and (min-width: 320px) {
          .title {
            font-size: var(--ddd-font-size-3xs);
          }
          .sub-title {
            font-size: var(--ddd-font-size-4xs);
          }
          .urlbutton {
            display: flex;
            flex-direction: column;
            justify-content: end;
          }
          simple-icon-lite {
            aspect-ratio: 1 / 1;
            --simple-icon-width: var(--ddd-icon-xxs);
            --simple-icon-height: var(--ddd-icon-xxs);
            height: 35px;
            width: 35px;
          }
        }

        @media screen and (min-width: 920px) {
          .title {
            font-size: var(--ddd-font-size-ms);
          }
          .sub-title {
            font-size: var(--ddd-font-size-s);
          }
          simple-icon-lite {
            --simple-icon-width: var(--ddd-icon-xs);
            --simple-icon-height: var(--ddd-icon-xs);
            height: var(--ddd-icon-sm);
            width: var(--ddd-icon-sm);
          }
          simple-icon-button-lite {
            --simple-icon-width: var(--ddd-icon-md);
            --simple-icon-height: var(--ddd-icon-md);
            height: var(--ddd-icon-xl);
            width: var(--ddd-icon-xl);
          }
        }

        .b-sm {
          border: var(--ddd-border-sm);
        }
        .r-circle {
          border-radius: var(--ddd-radius-circle);
        }
        .lh-120 {
          line-height: var(--ddd-lh-120);
        }
        .bt-0 {
          border-top: none;
        }
        .bs-lg {
          box-shadow: var(--ddd-boxShadow-lg);
        }
      `,
    ];
  }

  /**
   * HTML
   */
  render() {
    return html`
      <div class="header">
        <div class="icon">
          ${this.icon
            ? html` <simple-icon-lite
                icon="${this.icon}"
                class="b-sm r-circle"
              ></simple-icon-lite>`
            : ``}
        </div>
        <div class="title-wrap">
          <div class="sub-title lh-120">${this.subtitle}</div>
          <div class="title lh-120">${this.title}</div>
        </div>
      </div>
      <div class="content b-sm bt-0 bs-lg ${this.url ? "urlPresent" : ""}">
        <div class="slot">
          <slot></slot>
        </div>
        ${this.url
          ? html` <div class="urlbutton">
              <a
                href="${this.url}"
                id="url"
                target="_blank"
                rel="nofollow noopener"
              >
                <simple-icon-button-lite
                  icon="icons:add-circle-outline"
                  label="${this.t.readMore}"
                ></simple-icon-button-lite>
              </a>
              <simple-tooltip for="url" animation-delay="0"
                >${this.t.readMore}</simple-tooltip
              >
            </div>`
          : ``}
      </div>
    `;
  }

  // Implement HAX Wiring
  static get haxProperties() {
    return {
      type: "grid",
      canScale: false,

      hideDefaultSettings: true,
      gizmo: {
        title: "Learning Component",
        description:
          "A card for instructors to communicate pedagogy and instructional strategies.",
        icon: "icons:bookmark",
        color: "orange",
        tags: [
          "Instructional",
          "content",
          "design",
          "presentation",
          "instruction",
          "course",
          "learning",
          "card",
        ],
        handles: [],
        meta: {
          author: "HAXTheWeb core team",
        },
      },
      settings: {
        configure: [
          {
            property: "type",
            title: "Type",
            description: "The type of card to be used.",
            inputMethod: "select",
            options: { "": "", ...learningComponentTypes },
            required: false,
          },
          {
            property: "subtitle",
            title: "Sub-Title",
            description: "The sub-title of the card.",
            inputMethod: "textfield",
          },
          {
            property: "url",
            title: "Link",
            description:
              "An optional link  for the card (Link not available for Learning Objectives).",
            inputMethod: "url",
          },
          {
            property: "title",
            title: "Title",
            description: "Set Title, this overrides type based title",
            inputMethod: "textfield",
          },
          {
            property: "icon",
            title: "Icon",
            description: "Set icon, this overrides type based icon",
            inputMethod: "iconpicker",
          },
          {
            property: "accentColor",
            title: "Accent color",
            description: "Set accent color, this overrides type based color",
            inputMethod: "colorpicker",
          },
          {
            slot: "",
            title: "Contents",
          },
        ],
        advanced: [],
      },
      saveOptions: {
        unsetAttributes: ["t"],
      },
      demoSchema: [
        {
          tag: "learning-component",
          properties: {
            subtitle: "Unit 1",
          },
          content: "<p>By the end of this lesson, you should be able to...</p>",
        },
      ],
    };
  }
}
customElements.define(LearningComponent.tag, LearningComponent);
export { LearningComponent };
