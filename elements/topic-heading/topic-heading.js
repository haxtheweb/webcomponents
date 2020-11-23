/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `topic-heading`
 * `Semantic and visual meaning behind a heading break`
 * @demo demo/index.html
 * @element topic-heading
 */
class TopicHeading extends LitElement {
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none;
        }

        relative-heading {
          color: var(--topic-heading-text-color);
          display: inline-flex;
        }

        simple-icon {
          color: var(--topic-heading-icon-color);
          display: inline-flex;
          font-size: 16px;
          --simple-icon-height: 32px;
          --simple-icon-width: 32px;
          padding: 16px;
          line-height: 16px;
          vertical-align: bottom;
        }
      `,
    ];
  }

  // render function
  render() {
    return html` ${this.icon
      ? html` <simple-icon icon="${this.icon}"></simple-icon> `
      : ``}
    ${this.title
      ? html`
          <relative-heading text="${this.title}"
            >${this.title}</relative-heading
          >
        `
      : ``}`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: true,
      gizmo: {
        title: "Topic heading",
        description: "Semantic and visual meaning behind a heading break",
        icon: "icons:android",
        color: "green",
        groups: ["Heading"],
        handles: [
          {
            type: "todo:read-the-docs-for-usage",
          },
        ],
        meta: {
          author: "btopro",
          owner: "The Pennsylvania State University",
        },
      },
      settings: {
        configure: [
          {
            property: "icon",
            description: "",
            inputMethod: "iconpicker",
            required: false,
            icon: "icons:code",
          },
          {
            property: "title",
            description: "",
            inputMethod: "textfield",
            required: false,
            icon: "icons:heading",
          },
        ],
        advanced: [],
      },
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      icon: {
        type: String,
      },
      title: {
        type: String,
      },
    };
  }
  constructor() {
    super();
    this.icon = "";
    this.title = "";
    import("@lrnwebcomponents/relative-heading/relative-heading.js");
  }
  firstUpdated() {
    if (this.icon) {
      import("@lrnwebcomponents/simple-icon/simple-icon.js");
      import("@lrnwebcomponents/simple-icon/lib/simple-icons.js");
      import("@lrnwebcomponents/simple-icon/lib/simple-icon-button.js");
    }
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "topic-heading";
  }
}
window.customElements.define(TopicHeading.tag, TopicHeading);
export { TopicHeading };
