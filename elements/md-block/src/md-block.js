/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
/**
 * `md-block`
 * `a markdown block`
 * @demo demo/index.html
 * @element md-block
 */
class MdBlock extends DDD {
  //styles function
  static get styles() {
    return [
      super.styles,
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
      ${this.markdown && this.source == ""
        ? html` <marked-element markdown="${this.markdown}">
            <div slot="markdown-html"></div>
          </marked-element>`
        : html` <marked-element>
            <div slot="markdown-html"></div>
            <script
              type="text/markdown"
              .src="${this.source ? this.source : undefined}"
            ></script>
          </marked-element>`}
    </div>`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: false,

      canEditSource: true,
      gizmo: {
        title: "Markdown",
        description: "A block of markdown content directly or remote loaded",
        icon: "icons:code",
        color: "yellow",
        tags: [
          "Resource",
          "md",
          "markdown",
          "content",
          "text",
          "code",
          "codeblock",
          "code-block",
          "code block",
          "html",
        ],
        handles: [],
        meta: {
          author: "HAXTheWeb",
          owner: "The Pennsylvania State University",
        },
      },
      settings: {
        configure: [
          {
            property: "markdown",
            title: "Markdown",
            description: "Raw markdown",
            inputMethod: "textarea",
          },
          {
            property: "source",
            title: "Source",
            description: "Source file for markdown",
            inputMethod: "haxupload",
            noVoiceRecord: true,
            noCamera: true,
          },
        ],
        advanced: [],
      },
      demoSchema: [
        {
          tag: "md-block",
          properties: {
            markdown: "- The first bulleted item in a long list..",
          },
          content: "",
        },
      ],
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
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
    if (this.innerHTML) {
      this.markdown = this.innerHTML.trim();
      this.innerHTML = null;
    }
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "md-block";
  }
}
customElements.define(MdBlock.tag, MdBlock);
export { MdBlock };
