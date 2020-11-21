import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `lrn-aside`
 * A content aside as a panel
 * @demo demo/index.html
 * @element lrn-aside
 */
class LrnAside extends LitElement {
  constructor() {
    super();
    this.title = "Related content";
    this.sticky = false;
    this.direction = "";
    setTimeout(() => {
      import("@lrnwebcomponents/lrndesign-panelcard/lrndesign-panelcard.js");
    }, 0);
  }
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          padding: 8px;
        }
        :host([sticky]) {
          top: 0;
          position: sticky;
        }
        :host([direction="left"]) {
          float: left;
          max-width: 480px;
        }
        :host([direction="right"]) {
          float: right;
          max-width: 480px;
        }
      `,
    ];
  }
  render() {
    return html`
      <aside>
        <lrndesign-panelcard title="${this.title}">
          <slot></slot>
        </lrndesign-panelcard>
      </aside>
    `;
  }
  static get tag() {
    return "lrn-aside";
  }
  static get properties() {
    return {
      /**
       * Title for the aside.
       */
      title: {
        type: String,
      },
      /**
       * Apply CSS sticky styling
       */
      sticky: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Direction to hang off UI if sticky, left or right.
       */
      direction: {
        type: String,
        reflect: true,
      },
    };
  }

  /**
   * Attached to the DOM, now fire.
   */
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Sticky note",
        description:
          "A sticky note to present some basic info offset on the page.",
        icon: "av:note",
        color: "yellow",
        groups: ["Content"],
        handles: [
          {
            type: "text",
            title: "title",
          },
        ],
        meta: {
          author: "ELMS:LN",
        },
      },
      settings: {
        configure: [
          {
            property: "title",
            title: "Title",
            description: "Enter title for sticky note.",
            inputMethod: "textfield",
            required: true,
          },
          {
            slot: "",
            title: "Content",
            description: "Content of the sticky note",
            inputMethod: "code-editor",
            required: true,
          },
          {
            property: "sticky",
            title: "Stick to page on scroll",
            description: "Appear sticky when the user scrolls past it",
            inputMethod: "boolean",
          },
          {
            property: "direction",
            title: "Direction to hang",
            description: "Location of the sticky note to hang",
            inputMethod: "select",
            options: {
              "": "none",
              right: "Right",
              left: "Left",
            },
          },
        ],
        advanced: [],
      },
    };
  }
}
window.customElements.define(LrnAside.tag, LrnAside);
export { LrnAside };
