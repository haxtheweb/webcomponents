/**
 * Copyright 2021
 * @license Apache-2.0, see License.md for full text.
 */
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import {
  iconFromPageType,
  learningComponentColors,
  learningComponentNouns,
  learningComponentTypes,
  learningComponentVerbs,
} from "@haxtheweb/d-d-d/lib/DDDStyles.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import { css, html } from "lit";

// export as other things have imported this previously
export {
  iconFromPageType,
  learningComponentColors,
  learningComponentNouns,
  learningComponentTypes,
  learningComponentVerbs,
};
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
          background-color: light-dark(
            var(
              --ddd-theme-acccent,
              var(--ddd-theme-default-limestoneMaxLight, inherit)
            ),
            var(
              --ddd-theme-acccent,
              var(--ddd-theme-default-coalyGray, inherit)
            )
          );
          border-color: var(
            --ddd-component-learning-component-title-background,
            var(
              --ddd-theme-primary,
              var(--simple-colors-default-theme-accent-8, #dc7927)
            )
          ) !important;
          position: relative;
        }

        .content.urlPresent {
          padding-right: var(--ddd-spacing-12);
        }

        @media screen and (min-width: 320px) {
          .title {
            font-size: var(--ddd-font-size-3xs);
          }
          .sub-title {
            font-size: var(--ddd-font-size-4xs);
          }
          .urlbutton {
            position: absolute;
            right: -16px;
            bottom: 0;
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

        /* The following classes are duplicated from DDDStyle, but for some reason need to be redundant otherwise the styling breaks. */

        .b-sm {
          border: var(--ddd-border-sm);
        }
        .r-circle {
          border-radius: var(--ddd-radius-circle);
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
globalThis.customElements.define(LearningComponent.tag, LearningComponent);
export { LearningComponent };
