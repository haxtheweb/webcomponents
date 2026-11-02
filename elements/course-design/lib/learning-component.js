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
    this.registerLocalization({
      context: this,
      localesPath: new URL("../locales/", import.meta.url).href,
    });
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
          /* the type colour: chip fill and the frame's top rule */
          --learning-component-type-color: var(
            --ddd-component-learning-component-title-background,
            var(
              --ddd-theme-primary,
              var(--simple-colors-default-theme-accent-8, #dc7927)
            )
          );
        }
        /* block header frame shared with the other DDD learning blocks
           (same treatment as stop-note): 1px rounded frame on the page
           colour, the type colour kept on the chip and the top rule */
        .frame {
          box-sizing: border-box;
          overflow: hidden;
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          border-top: var(--ddd-border-size-md) solid
            var(--learning-component-type-color);
          border-radius: var(--ddd-radius-md);
          font-family: var(--ddd-font-primary);
        }
        .header {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          padding-block: var(--ddd-spacing-2);
          padding-inline: var(--ddd-spacing-4) var(--ddd-spacing-2);
          min-height: var(--ddd-control-height-sm);
          border-bottom: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
        }
        .icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: none;
          width: var(--ddd-icon-xs);
          height: var(--ddd-icon-xs);
          border-radius: var(--ddd-radius-circle);
          background-color: var(--learning-component-type-color);
        }
        .icon simple-icon-lite {
          color: var(
            --ddd-theme-font-color,
            var(--simple-colors-default-theme-accent-1, #fff)
          );
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
        }
        .title-wrap {
          display: flex;
          flex-direction: column;
          flex: 1 1 auto;
          min-width: 0;
        }
        .sub-title {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        :host(:lang(ar)) .sub-title,
        :host(:lang(fa)) .sub-title,
        :host(:lang(he)) .sub-title,
        :host(:lang(ur)) .sub-title {
          letter-spacing: 0;
        }
        .sub-title:empty,
        .title:empty {
          display: none;
        }
        .title {
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
          font-size: var(--ddd-font-size-xs);
          font-weight: var(--ddd-font-weight-bold);
          overflow-wrap: anywhere;
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
        }
        .urlbutton {
          display: flex;
          flex: none;
        }
        .urlbutton a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          width: var(--ddd-control-height-sm);
          height: var(--ddd-control-height-sm);
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          border-radius: var(--ddd-radius-rounded);
          text-decoration: none;
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
          --simple-icon-width: var(--ddd-icon-4xs);
          --simple-icon-height: var(--ddd-icon-4xs);
        }
        .urlbutton a:hover {
          border-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
        }
        .urlbutton a:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .content {
          padding: var(--ddd-spacing-4);
          /* an author applied DDD accent still tints the body; otherwise it
             sits on the page colour */
          background-color: var(--ddd-theme-accent, transparent);
        }
      `,
    ];
  }

  /**
   * HTML
   */
  render() {
    return html`
      <div class="frame">
        <div class="header">
          ${this.icon
            ? html`<div class="icon">
                <simple-icon-lite
                  icon="${this.icon}"
                  aria-hidden="true"
                ></simple-icon-lite>
              </div>`
            : ``}
          <div class="title-wrap">
            <div class="sub-title lh-120">${this.subtitle}</div>
            <div class="title lh-120">${this.title}</div>
          </div>
          ${this.url
            ? html`<div class="urlbutton">
                <a
                  href="${this.url}"
                  id="url"
                  target="_blank"
                  rel="nofollow noopener"
                  aria-label="${this.t.readMore}"
                  ><simple-icon-lite
                    icon="icons:add-circle-outline"
                    aria-hidden="true"
                  ></simple-icon-lite
                ></a>
                <simple-tooltip for="url" animation-delay="0"
                  >${this.t.readMore}</simple-tooltip
                >
              </div>`
            : ``}
        </div>
        <div class="content ${this.url ? "urlPresent" : ""}">
          <div class="slot">
            <slot></slot>
          </div>
        </div>
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
