import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";

export class WorksheetDownload extends LitElement {
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

      canEditSource: false,
      gizmo: {
        title: "Worksheet Download",
        description: "A button for displaying files available for download.",
        icon: "icons:file-download",
        color: "blue",
        tags: ["Instructional", "link", "worksheet", "download", "url", "file"],
        meta: {
          author: "HAXTheWeb core team",
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
            inputMethod: "haxupload",
            icon: "editor:insert-link",
          },
        ],
        advanced: [],
      },
      demoSchema: [
        {
          tag: "worksheet-download",
          properties: {
            title: "Download worksheet",
          },
          content: "",
        },
      ],
    };
  }
  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
    };
  }
  /**
   * double-check that we are set to inactivate click handlers
   * this is for when activated in a duplicate / adding new content state
   */
  haxactiveElementChanged(el, val) {
    if (val) {
      this._haxstate = val;
    }
  }
  /**
   * Set a flag to test if we should block link clicking on the entire card
   * otherwise when editing in hax you can't actually edit it bc its all clickable.
   * if editMode goes off this helps ensure we also become clickable again
   */
  haxeditModeChanged(val) {
    this._haxstate = val;
  }
  /**
   * special support for HAX since the whole card is selectable
   */
  _clickLink(e) {
    if (this._haxstate) {
      // do not do default
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
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
          @click="${this._clickLink}"
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
