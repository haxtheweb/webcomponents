import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";

class EbookButton extends LitElement {
  static get properties() {
    return {
      link: { type: String },
      title: { type: String },
    };
  }

  static get haxProperties() {
    return {
      canScale: false,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Ebook-Button",
        description: "A button that links to an Ebook.",
        icon: "icons:bookmark",
        color: "blue",
        groups: [""],
        handles: [
          {
            type: "",
            source: "",
            title: "",
            description: "",
          },
        ],
        meta: {
          author: "LRNWebComponents",
        },
      },
      settings: {
        configure: [
          {
            property: "title",
            title: "Title",
            description: "The title of the button.",
            inputMethod: "textfield",
            icon: "editor:title",
          },
          {
            property: "link",
            title: "Link",
            description: "The link  for the button.",
            inputMethod: "textfield",
            icon: "editor:insert-link",
          },
        ],
        advanced: [],
      },
    };
  }

  constructor() {
    super();
    this.link = "";
    this.title = "";
  }
  static get styles() {
    return [
      css`
        :host {
          display: inline-block;
          --paper-button-click-state: #000;
          --paper-button-title: #000;
          --link-color: #aeaeae;
        }

        button {
          min-height: 48px;
          text-transform: none;
          padding: 10px 25px 10px 0;
        }

        button:active,
        button:focus,
        button:hover {
          color: var(--paper-button-click-state);
          outline: 2px solid black;
          cursor: pointer;
        }

        simple-icon-lite {
          height: 55px;
          width: 55px;
          margin-right: 5px;
        }

        .title {
          color: var(--paper-button-title);
          font-size: 16px;
          font-weight: bold;
          display: inline-flex;
        }
        a,
        a:-webkit-any-link {
          display: block;
          color: var(--link-color);
          text-decoration: none;
        }
      `,
    ];
  }
  render() {
    return html`
      <div id="button wrapper">
        <a href="${this.link}" target="_blank" rel="noopener noreferrer">
          <button id="book">
            <simple-icon-lite icon="book"></simple-icon-lite>
            <div class="title">${this.title}</div>
          </button>
        </a>
      </div>
    `;
  }
  static get tag() {
    return "ebook-button";
  }
}
customElements.define(EbookButton.tag, EbookButton);
