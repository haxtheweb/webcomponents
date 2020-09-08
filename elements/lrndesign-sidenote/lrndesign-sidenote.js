import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icon/iron-icon.js";
/**
`lrndesign-sidenote`
A basic side note

* @demo demo/index.html
*/
class LrndesignSidenote extends SimpleColors {
  static get properties() {
    return {
      ...super.properties,
      label: { type: String },
      icon: { type: String }
    };
  }

  static get haxProperties() {
    return {
      canScale: !1,
      canPosition: !0,
      canEditSource: !1,
      gizmo: {
        title: "Side-Note",
        description: "A .",
        icon: "icons:bookmark",
        color: "blue",
        groups: [""],
        meta: { author: "ELMS:LN" }
      },
      settings: {
        configure: [
          {
            property: "label",
            title: "Label",
            description: "The label of the sidenote.",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "dark",
            title: "Dark",
            inputMethod: "boolean"
          },
          {
            property: "icon",
            title: "Icon",
            description: "The icon of the sidenote.",
            inputMethod: "iconpicker",
            options: [
              "icons:announcement",
              "icons:book",
              "icons:bookmark",
              "icons:check-circle",
              "icons:feedback",
              "icons:thumb-down",
              "icons:thumb-up",
              "icons:warning"
            ]
          },
          {
            property: "accentColor",
            title: "Color",
            description: "The background color of the sidenote.",
            inputMethod: "colorpicker",
            icon: "editor:format-color-fill"
          },
          {
            slot: "",
            title: "Content",
            description: "Content of the side note.",
            inputMethod: "code-editor"
          }
        ],
        advanced: []
      },
      demoSchema: [
        {
          tag: "lrndesign-sidenote",
          content: "<p>Content goes here...</p>",
          properties: { label: "Label", icon: "bookmark" }
        }
      ]
    };
  }

  constructor() {
    super();
    this.label = "";
    this.icon = "";
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
        }

        #container {
          display: block;
          background-color: var(
            --simple-colors-default-theme-accent-1,
            #ffffff
          );
          padding: var(--lrndesign-sidenote-container-padding, 16px);
          margin-left: var(--lrndesign-sidenote-container-margin-left, 0px);
          color: var(--simple-colors-default-theme-accent-12, #000);
        }

        #header {
          display: flex;
          align-items: center;
        }

        #icon {
          margin-right: 8px;
        }

        #label {
          font-size: 20.8px;
          margin: 12.8px 0;
          flex: 1 1 auto;
        }
      `
    ];
  }

  render() {
    return html`
      <div id="container">
        <div id="header">
          <iron-icon id="icon" icon=${this.icon}></iron-icon>
          <div id="label">${this.label}</div>
        </div>
        <slot></slot>
      </div>
    `;
  }
  static get tag() {
    return "lrndesign-sidenote";
  }
}
customElements.define("lrndesign-sidenote", LrndesignSidenote);
export { LrndesignSidenote };
