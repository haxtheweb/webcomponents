/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css, LitElement } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
/**
 * `lrndesign-paperstack`
 * @element lrndesign-paperstack
 * `Stack of papers visually`
 *
 * @demo demo/index.html
 */
class LrndesignPaperstack extends SimpleColors {
  constructor() {
    super();
    this.icon = "lrn:assignment";
  }
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          font-family: var(--lrndesign-paperstack-font-family, unset);
          font-family: var(--lrndesign-paperstack-font-size, 14px);
        }
        .stack {
          width: 100%;
          position: relative;
          margin: 24px 0;
        }
        .paper {
          width: calc(100% - 48px);
          padding: 12px 24px;
          position: absolute;
          box-shadow: 0 0 1px
            var(
              --lrndesign-paperstack-shadow,
              var(--simple-colors-default-theme-grey-12)
            );
          border: 1px solid
            var(
              --lrndesign-paperstack-border,
              var(--simple-colors-default-theme-grey-4)
            );
        }
        :host([dark]) .paper {
          box-shadow: 0 0 1px
            var(
              --lrndesign-paperstack-shadow,
              var(--simple-colors-default-theme-grey-1)
            );
          border: 1px solid
            var(
              --lrndesign-paperstack-border,
              var(--simple-colors-default-theme-grey-1)
            );
        }
        .paper:first-of-type {
          left: -0.32px;
          top: 0.32px;
          bottom: -0.32px;
          right: 0.32px;
          transform: rotate(-2.5deg);
          background-color: var(
            --lrndesign-paperstack-faded-bg,
            var(--simple-colors-default-theme-grey-2)
          );
        }
        .paper:nth-of-type(2) {
          right: -0.32px;
          top: 1.6px;
          left: 0.32px;
          right: -1.6px;
          transform: rotate(1.4deg);
          background-color: var(
            --lrndesign-paperstack-faded-bg,
            var(--simple-colors-default-theme-grey-2)
          );
        }
        :host([dark]) .paper:first-of-type,
        :host([dark]) .paper:nth-of-type(2) {
          background-color: var(
            --lrndesign-paperstack-faded-bg,
            var(--simple-colors-default-theme-grey-1)
          );
        }
        .front {
          position: relative;
          left: 0;
          top: 0;
          bottom: 0;
          right: 0;
          background-color: var(
            --lrndesign-paperstack-bg,
            var(--simple-colors-default-theme-grey-1)
          );
          color: var(
            --lrndesign-paperstack-text,
            var(--simple-colors-default-theme-grey-12)
          );
        }
        :host([dark]) .front {
          background-color: var(
            --lrndesign-paperstack-bg,
            var(--simple-colors-default-theme-grey-3)
          );
        }
        simple-icon-lite {
          --simple-icon-width: calc(
            var(--lrndesign-paperstack-icon-size, 32px) - 2 *
              var(--lrndesign-paperstack-icon-padding, 4px)
          );
          --simple-icon-height: calc(
            var(--lrndesign-paperstack-icon-size, 32px) - 2 *
              var(--lrndesign-paperstack-icon-padding, 4px)
          );
        }
        .heading {
          display: flex;
          align-items: center;
        }
        .icon-container {
          width: calc(
            var(--lrndesign-paperstack-icon-size, 32px) - 2 *
              var(--lrndesign-paperstack-icon-padding, 4px)
          );
          height: calc(
            var(--lrndesign-paperstack-icon-size, 32px) - 2 *
              var(--lrndesign-paperstack-icon-padding, 4px)
          );
          border-radius: 50%;
          background-color: var(
            --lrndesign-paperstack-accent,
            var(--simple-colors-default-theme-accent-8)
          );
          display: flex;
          align-items: center;
          padding: var(--lrndesign-paperstack-icon-padding, 4px);
          color: var(
            --lrndesign-paperstack-bg,
            var(--simple-colors-default-theme-grey-1)
          );
          margin-right: calc(2 * var(--lrndesign-paperstack-icon-padding, 2px));
        }
        :host([dark]) .icon-container {
          color: var(
            --lrndesign-paperstack-bg,
            var(--simple-colors-default-theme-grey-1)
          );
          background-color: var(
            --lrndesign-paperstack-accent,
            var(--simple-colors-default-theme-accent-9)
          );
        }
        .title {
          font-size: 16px;
          color: var(
            --lrndesign-paperstack-accent,
            var(--simple-colors-default-theme-accent-8)
          );
          font-family: var(--lrndesign-paperstack-heading-font-family, cursive);
          font-family: var(--lrndesign-paperstack-heading-font-size, 16px);
        }
        :host([dark]) .title {
          color: var(
            --lrndesign-paperstack-accent,
            var(--simple-colors-default-theme-grey-12)
          );
        }
      `,
    ];
  }
  render() {
    return html`
      <div class="stack">
        <div class="paper"></div>
        <div class="paper"></div>
        <div class="front paper">
          <div class="heading">
            <div class="icon-container circle">
              <simple-icon-lite icon="${this.icon}"></simple-icon-lite>
            </div>
            <span class="title">${this.title}</span>
          </div>
          <p><slot></slot></p>
        </div>
      </div>
    `;
  }
  static get tag() {
    return "lrndesign-paperstack";
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * Title
       */
      title: {
        type: String,
      },
      /**
       * icon
       */
      icon: {
        type: String,
      },
    };
  }
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Paper stack",
        description: "A stack of papers",
        icon: "icons:content-copy",
        color: "grey",
        groups: ["Content", "Layout"],
        handles: [],
        meta: {
          author: "ELMS:LN",
        },
      },
      settings: {
        quick: [
          {
            property: "title",
            title: "Title",
            description: "Title of the cards",
            inputMethod: "textfield",
            icon: "editor:title",
          },
          {
            property: "accentColor",
            title: "Accent Color",
            description: "Select the accent color use",
            inputMethod: "colorpicker",
            icon: "editor:format-color-fill",
          },
          {
            property: "dark",
            title: "Dark",
            description: "Use dark theme",
            inputMethod: "boolean",
            icon: "invert-colors",
          },
        ],
        configure: [
          {
            property: "title",
            title: "Title",
            description: "Title of the cards",
            inputMethod: "text",
          },
          {
            property: "accentColor",
            title: "Accent Color",
            description: "Select the accent color use",
            inputMethod: "colorpicker",
            icon: "editor:format-color-fill",
          },
          {
            property: "dark",
            title: "Dark",
            description: "Use dark theme",
            inputMethod: "boolean",
            icon: "invert-colors",
          },
          {
            property: "icon",
            title: "Icon",
            description: "Icon for the card",
            inputMethod: "iconpicker",
          },
          {
            slot: "",
            title: "Contents",
            description: "card contents",
            inputMethod: "code-editor",
          },
        ],
        advanced: [],
      },
    };
  }
}
window.customElements.define(LrndesignPaperstack.tag, LrndesignPaperstack);
export { LrndesignPaperstack };
