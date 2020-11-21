/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `md-block`
 * `a markdown block`
 * @demo demo/index.html
 * @element md-block
 */
class MdBlock extends LitElement {
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
      `,
    ];
  }

  // render function
  render() {
    return html` <div>
      <marked-element markdown="${this.markdown}">
        <div slot="markdown-html"></div>
        <script
          type="text/markdown"
          .src="${this.source ? this.source : undefined}"
        ></script>
      </marked-element>
    </div>`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Markdown",
        description: "A block of markdown content directly or remote loaded",
        icon: "icons:code",
        color: "yellow",
        groups: ["Block"],
        handles: [
          {
            type: "markdown",
            source: "source",
            src: "source",
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
            property: "markdown",
            title: "Markdown",
            description: "Raw markdown",
            inputMethod: "code-editor",
          },
          {
            property: "source",
            title: "Source",
            description: "Source file for markdown",
            inputMethod: "haxupload",
          },
        ],
        advanced: [],
      },
      demoSchema: [
        {
          tag: "md-block",
          properties: {
            source:
              "https://raw.githubusercontent.com/elmsln/HAXcms/master/HAXDocs.md",
          },
          content: "",
        },
      ],
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      source: {
        type: String,
      },
      markdown: {
        type: String,
      },
    };
  }
  constructor() {
    super();
    this.markdown = "";
    this.source = "";
    import("@polymer/marked-element/marked-element.js");
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "md-block";
  }
}
window.customElements.define(MdBlock.tag, MdBlock);
export { MdBlock };
