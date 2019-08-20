import { LitElement, html } from "lit-element/lit-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icon/iron-icon.js";
/**
`lrndesign-sidenote`
A basic side note

* @demo demo/index.html
*/
class LrndesignSidenote extends LitElement {
  static get properties() {
    return {
      label: { type: String },
      icon: { type: String },
      bgColor: { type: String }
    };
  }

  static get haxProperties() {
    return {
      canScale: false,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Side-Note",
        description: "A .",
        icon: "icons:bookmark",
        color: "blue",
        groups: [""],
        handles: [
          {
            type: "",
            source: "",
            title: "",
            description: ""
          }
        ],
        meta: {
          author: "LRNWebComponents"
        }
      },
      settings: {
        quick: [
          {
            property: "label",
            title: "Label",
            description: "The label of the sidenote.",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        configure: [
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
            property: "bgColor",
            title: "Color",
            description: "The background color of the sidenote.",
            inputMethod: "colorpicker",
            icon: "editor:format-color-fill"
          }
        ],
        advanced: []
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(EbookButton.haxProperties, EbookButton.tag, this);
  }

  constructor() {
    super();
    this.label = "";
    this.icon = "";
    this.bgColor = "";
  }

  render() {
    return html`
      <style>
        :host {
          display: block;
          --container-bg-color: lightgray;
          --container-text-color: black;
          --container-padding: 16px;
          --container-outset: 0;
          @apply --host-styles;
        }

        #container {
          display: block;
          background: var(--container-bg-color);
          color: var(--container-text-color);
          padding: var(--container-padding);
          margin-left: -var(--container-outset);
          @apply --container-styles;
        }

        #header {
          display: flex;
          align-items: center;
          @apply --container-header;
        }

        #icon {
          margin-right: 8px;
          @apply --icon-styles;
        }

        #label {
          font-size: 20.8px;
          margin: 12.8px 0;
          flex: 1 1 auto;
          @apply --label-styles;
        }
      </style>
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
