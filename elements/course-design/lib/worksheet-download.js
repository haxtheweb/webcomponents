import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";

class WorksheetDownload extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      link: { type: String },
    };
  }
  static get tag() {
    return "worksheet-download";
  }

  static get haxProperties() {
    return {
      canScale: false,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Worksheet-Download",
        description: "A button for displaying files available for download.",
        icon: "icons:file-download",
        color: "blue",
        meta: {
          author: "LRNWebComponents",
        },
      },
      settings: {
        configure: [
          {
            property: "title",
            title: "Title",
            description: "The title of the download.",
            inputMethod: "textfield",
            icon: "editor:title",
          },
          {
            property: "link",
            title: "Link",
            description: "The link for the download.",
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
    this.title = "";
    this.link = "";
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        a {
          text-decoration: none;
          color: #0c7cd5;
          display: block;
        }

        button {
          text-transform: none;
          border: solid 2px #dcdcdc;
          width: 100%;
          margin: 0 auto 0;
          min-height: 48px;
          text-align: center;
        }

        button:active,
        button:focus,
        button:hover {
          cursor: pointer;
          background-color: #0c7cd5;
          color: #fff;
        }

        simple-icon {
          margin-right: 5px;
        }
      `,
    ];
  }
  render() {
    return html`
      <div id="button_wrap">
        <a
          tabindex="-1"
          href="${this.link}"
          target="_blank"
          download
          rel="noopener noreferrer"
        >
          <button>
            <simple-icon-lite icon="icons:file-download"></simple-icon-lite
            >${this.title}
          </button>
        </a>
      </div>
    `;
  }
}
customElements.define(WorksheetDownload.tag, WorksheetDownload);
export { WorksheetDownload };
