/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { DDDBlockStyles } from "@haxtheweb/d-d-d/lib/DDDBlock.js";
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
      DDDBlockStyles,
      css`
        :host {
          display: block;
          margin: var(--ddd-stack-gap, var(--ddd-spacing-4)) 0;
          /* chip fill and the frame's top rule, last match wins: the type
             colour, theme primary (data-primary), theme palette
             (data-palette), a data-primary on the element itself */
          --learning-component-palette: var(--ddd-palette-chip);
          --learning-component-palette-ink: var(--ddd-palette-chip-ink);
          --learning-component-type-color: var(
            --ddd-component-learning-component-title-background,
            var(
              --learning-component-palette,
              var(
                --ddd-theme-primary,
                var(--simple-colors-default-theme-accent-8, #dc7927)
              )
            )
          );
        }
        /* a primary picked on the element is a local choice: it beats the
           palette */
        :host([data-primary]) {
          --learning-component-palette: initial;
          --learning-component-palette-ink: initial;
        }
        /* the type colour is kept on the chip and the frame's top rule */
        .ddd-block {
          --ddd-block-accent: var(--learning-component-type-color);
          /* the top rule is drawn here rather than with data-accent: inside
             a DDD element, DDDStyles also styles div[data-accent] */
          border-top: var(--ddd-border-size-md) solid var(--ddd-block-accent);
          --ddd-block-chip-background: var(--learning-component-type-color);
          --ddd-block-chip-color: var(
            --learning-component-palette-ink,
            var(
              --ddd-theme-font-color,
              var(--simple-colors-default-theme-accent-1, #fff)
            )
          );
        }
        /* light type colours (observe, reflect, read, unit, knowledge,
           present, activity, make) carry a dark icon so it keeps contrast */
        :host([accent-color="yellow"]) .ddd-block,
        :host([accent-color="amber"]) .ddd-block,
        :host([accent-color="lime"]) .ddd-block,
        :host([accent-color="light-green"]) .ddd-block,
        :host([accent-color="cyan"]) .ddd-block,
        :host([accent-color="light-blue"]) .ddd-block,
        :host([accent-color="orange"]) .ddd-block {
          --ddd-block-chip-color: var(
            --learning-component-palette-ink,
            var(--ddd-theme-font-color, var(--ddd-theme-default-coalyGray))
          );
        }
        .sub-title:empty,
        .title:empty {
          display: none;
        }
        .ddd-block-body {
          padding: var(--ddd-spacing-4);
          /* an author applied DDD accent still tints the body; otherwise the
             palette tint, or the page colour */
          background-color: var(
            --ddd-theme-accent,
            var(--ddd-palette-tint, transparent)
          );
        }
        /* DDD pairs every accent with a readable ink; without it light text
           sat on a light accent in dark mode */
        :host([data-accent]) .ddd-block-body {
          color: var(--ddd-theme-colorContrast, black);
          --ddd-theme-link: var(--ddd-theme-colorContrast, black);
        }
        :host([data-accent]) .ddd-block-body ::slotted(*) {
          color: inherit;
        }
      `,
    ];
  }

  /**
   * HTML
   */
  render() {
    return html`
      <div class="ddd-block">
        <div class="ddd-block-header header">
          ${
            this.icon
              ? html`<span class="ddd-block-chip" aria-hidden="true"
                  ><simple-icon-lite icon="${this.icon}"></simple-icon-lite
                ></span>`
              : ``
          }
          <div class="ddd-block-text">
            <div class="ddd-block-label sub-title">${this.subtitle}</div>
            <div class="ddd-block-title title">${this.title}</div>
          </div>
          ${
            this.url
              ? html`<div class="ddd-block-actions urlbutton">
                  <a
                    href="${this.url}"
                    id="url"
                    class="ddd-block-action"
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
              : ``
          }
        </div>
        <div class="ddd-block-body content ${this.url ? "urlPresent" : ""}">
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
      // an author picked accent tints the body (see :host([data-accent]))
      designSystem: {
        accent: true,
      },
      gizmo: {
        title: "Learning component",
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
            slot: "",
            title: "Contents",
            inputMethod: "code-editor",
          },
        ],
        advanced: [
          {
            property: "accentColor",
            title: "Accent color",
            description: "Set accent color, this overrides type based color",
            inputMethod: "colorpicker",
          },
        ],
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
