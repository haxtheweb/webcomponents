/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
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
        img {
          max-width: 100%;
        }

        h1 {
          font-size: var(--hax-base-styles-h1-font-size);
          line-height: var(--hax-base-styles-h1-line-height);
        }

        h2 {
          font-size: var(--hax-base-styles-h2-font-size);
        }

        h3 {
          font-size: var(--hax-base-styles-h3-font-size);
        }

        h4 {
          font-size: var(--hax-base-styles-h4-font-size);
        }

        h5 {
          font-size: var(--hax-base-styles-h5-font-size);
        }

        h6 {
          font-size: var(--hax-base-styles-h6-font-size);
        }

        p {
          min-height: var(--hax-base-styles-p-min-height);
          font-size: var(--hax-base-styles-p-font-size);
          line-height: var(--hax-base-styles-p-line-height);
          letter-spacing: var(--hax-base-styles-p-letter-spacing);
        }

        a,
        a:-webkit-any-link {
          color: var(--hax-base-styles-a-color);
          font-size: var(--hax-base-styles-a-font-size);
          font-weight: var(--hax-base-styles-a-font-weight);
        }

        a:visited {
          color: var(--hax-base-styles-a-color-visited);
        }

        a:active,
        a:focus,
        a:hover {
          color: var(--hax-base-styles-a-color-active);
          font-weight: var(--hax-base-styles-a-font-weight-active);
        }

        ol,
        ul ol li,
        ul li {
          padding-bottom: var(--hax-base-styles-list-padding-bottom);
          line-height: var(--hax-base-styles-list-line-height);
          font-size: var(--hax-base-styles-list-font-size);
          max-width: var(--hax-base-styles-list-max-width);
        }

        ol li:last-child,
        ul li:last-child {
          padding-bottom: var(--hax-base-styles-list-last-child-padding-bottom);
        }

        ul,
        ol {
          padding-left: var(--hax-base-styles-list-padding-left);
          padding-left: var(--hax-base-styles-list-margin-left);
        }

        code {
          padding: 0.2em 0.4em;
          margin: 0;
          font-size: 12px;
          background-color: var(
            --hax-base-styles-code-background-color,
            rgba(175, 184, 193, 0.2)
          );
          border-radius: 6px;
          font-family: var(
            --hax-base-styles-code-font-family,
            ui-monospace,
            monospace
          );
        }

        pre {
          padding: 16px;
          overflow: auto;
          line-height: 1.45;
          background-color: var(
            --hax-base-styles-pre-background-color,
            rgba(175, 184, 193, 0.2)
          );
          border-radius: 6px;
          margin-bottom: 0;
          word-break: normal;
          word-wrap: normal;
          margin-top: 0;
          font-family: var(
            --hax-base-styles-pre-font-family,
            ui-monospace,
            monospace
          );
          font-size: 12px;
        }
        pre code {
          background-color: transparent;
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
      canPosition: false,
      canEditSource: true,
      gizmo: {
        title: "Markdown",
        description: "A block of markdown content directly or remote loaded",
        icon: "icons:code",
        color: "yellow",
        tags: [
          "Other",
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
