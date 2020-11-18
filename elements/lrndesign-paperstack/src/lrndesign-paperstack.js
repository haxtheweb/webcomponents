/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html } from "@polymer/polymer/polymer-element.js";
import { SimpleColorsPolymer } from "@lrnwebcomponents/simple-colors/lib/simple-colors-polymer.js";
import { A11yBehaviors } from "@lrnwebcomponents/a11y-behaviors/a11y-behaviors.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
/**
 * `lrndesign-paperstack`
 * @element lrndesign-paperstack
 * `Stack of papers visually`
 *
 * @demo demo/index.html
 */
class LrndesignPaperstack extends A11yBehaviors(SimpleColorsPolymer) {
  static get template() {
    return html`
      <style include="simple-colors-shared-styles-polymer">
        :host {
          display: block;
          font-size: 14px;
          --lrndesign-paperstack-bg: var(--simple-colors-default-theme-grey-1);
          --lrndesign-paperstack-faded-bg: var(
            --simple-colors-default-theme-grey-2
          );
          --lrndesign-paperstack-border: var(
            --simple-colors-default-theme-grey-4
          );
          --lrndesign-paperstack-shadow: var(
            --simple-colors-default-theme-grey-12
          );
          --lrndesign-paperstack-accent: var(
            --simple-colors-default-theme-accent-8
          );
          --lrndesign-paperstack-text: var(
            --simple-colors-default-theme-grey-12
          );
          --lrndesign-paperstack-heading-font: cursive;
        }
        :host([dark]) {
          --lrndesign-paperstack-bg: var(
            --simple-colors-default-theme-accent-4
          );
          --lrndesign-paperstack-faded-bg: var(
            --simple-colors-default-theme-accent-3
          );
          --lrndesign-paperstack-border: var(
            --simple-colors-default-theme-accent-1
          );
          --lrndesign-paperstack-shadow: var(
            --simple-colors-default-theme-grey-1
          );
          --lrndesign-paperstack-accent: var(
            --simple-colors-default-theme-grey-12
          );
          --lrndesign-paperstack-text: var(
            --simple-colors-default-theme-grey-12
          );
        }
        .stack {
          width: 100%;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        .paper {
          min-height: 160px;
          width: 80%;
          padding: 12px 24px;
          position: absolute;
          flex: 1 1 auto;
          left: 0;
          top: 0;
          box-shadow: 0 0 1px var(--lrndesign-paperstack-shadow);
          border: 1px solid var(--lrndesign-paperstack-border);
        }
        .paper:first-of-type {
          left: -0.32px;
          top: 0.32px;
          transform: rotate(-2.5deg);
          background-color: var(--lrndesign-paperstack-faded-bg);
        }
        .paper:nth-of-type(2) {
          right: -0.32px;
          top: 1.6px;
          transform: rotate(1.4deg);
          background-color: var(--lrndesign-paperstack-faded-bg);
        }
        .front {
          flex: 0 0 100%;
          position: relative;
          margin-bottom: 48px;
          background-color: var(--lrndesign-paperstack-bg);
          color: var(--lrndesign-paperstack-text);
        }

        simple-icon {
          --simple-icon-width: 40px;
          --simple-icon-height: 40px;
          margin: 4px;
          color: var(--lrndesign-paperstack-bg);
        }
        .heading {
          display: flex;
          align-items: center;
        }
        .icon-container {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: var(--lrndesign-paperstack-accent);
          margin-right: 8px;
          display: flex;
          align-items: center;
        }
        .title {
          font-size: 16px;
          color: var(--lrndesign-paperstack-accent);
          font-family: var(--lrndesign-paperstack-heading-font);
        }
      </style>
      <div class="stack">
        <div class="paper"></div>
        <div class="paper"></div>
        <div class="front paper">
          <div class="heading">
            <div class="icon-container circle">
              <simple-icon icon="[[icon]]"></simple-icon>
            </div>
            <span class="title">[[title]]</span>
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
        value: "",
      },
      /**
       * icon
       */
      icon: {
        type: String,
        value: "lrn:assignment",
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
        configure: [
          {
            property: "title",
            title: "Title",
            description: "Title of the cards",
            inputMethod: "boolean",
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
