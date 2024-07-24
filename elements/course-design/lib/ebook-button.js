import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";

export class EbookButton extends LitElement {
  static get properties() {
    return {
      link: { type: String },
      title: { type: String },
      icon: { type: String },
    };
  }

  static get haxProperties() {
    return {
      canScale: false,

      canEditSource: false,
      gizmo: {
        title: "Ebook button",
        description: "A button that links to an Ebook.",
        icon: "icons:book",
        color: "blue",
        tags: ["Instructional", "link", "ebook", "book"],
        handles: [
          {
            type: "link",
            source: "link",
            title: "title",
          },
        ],
        meta: {
          author: "HAXTheWeb core team",
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
            description: "The link to redirect to on click.",
            inputMethod: "textfield",
            icon: "editor:insert-link",
          },
          {
            property: "icon",
            title: "Icon",
            description: "Icon to represent this link",
            inputMethod: "iconpicker",
            icon: "editor:insert-link",
          },
        ],
        advanced: [],
      },
      demoSchema: [
        {
          tag: "ebook-button",
          properties: {
            title: "Access Ebook",
            icon: "icons:book",
          },
          content: "",
        },
      ],
    };
  }

  constructor() {
    super();
    this.link = "";
    this.title = "";
    this.icon = "icons:book";
  }
  static get styles() {
    return [
      css`
        :host {
          display: inline-block;
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
          outline: 2px solid black;
          cursor: pointer;
        }

        simple-icon-lite {
          height: 55px;
          width: 55px;
          margin-right: 5px;
        }

        .title {
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
  render() {
    return html`
      <div id="button wrapper">
        <a
          href="${this.link}"
          target="_blank"
          rel="noopener noreferrer"
          @click="${this._clickLink}"
        >
          <button id="book">
            <simple-icon-lite icon="${this.icon}"></simple-icon-lite>
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
