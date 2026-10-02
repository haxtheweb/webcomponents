/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { marked } from "marked";
import { sanitizeHTMLString } from "@haxtheweb/utils/utils.js";

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

        /* anchors rendered from markdown must be visually distinguishable
           from surrounding text without relying on color alone (a11y). */
        ::slotted(a),
        a {
          color: var(
            --md-block-link-color,
            var(--ddd-theme-default-link, #0000ee)
          );
          text-decoration: underline;
          text-underline-offset: 0.15em;
        }

        /* tables and code blocks inherit sensible defaults as well */
        pre,
        code {
          font-family: var(--ddd-font-primary, monospace);
        }

        /* user-visible fallback when a remote source fails to load */
        .source-error {
          color: var(--ddd-theme-default-error, #b1040e);
          font-size: var(--ddd-font-size-xs, 0.8rem);
        }
      `,
    ];
  }

  // render function
  render() {
    return html`<div>${unsafeHTML(this._parsedMarkdown)}</div>
      ${this._loadError
        ? html`<div class="source-error" role="status" aria-live="polite">
            ${this._loadError}
          </div>`
        : ``}`;
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
            noVoiceRecord: true,
            noCamera: true,
            noVoiceRecord: true,
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
      _parsedMarkdown: {
        type: String,
        state: true,
      },
      _loadError: {
        type: String,
        state: true,
      },
    };
  }
  constructor() {
    super();
    this.markdown = "";
    this.source = "";
    this._parsedMarkdown = "";
    this._loadError = "";
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

  async updated(changedProperties) {
    if (changedProperties.has("markdown") || changedProperties.has("source")) {
      if (this.source && this.source !== "") {
        try {
          const response = await fetch(this.source);
          if (response.ok) {
            const text = await response.text();
            // security: sanitize remote markdown HTML before unsafeHTML (prevents stored XSS)
            this._parsedMarkdown = sanitizeHTMLString(await marked.parse(text));
            this._loadError = "";
          } else {
            // user-visible fallback for a bad HTTP response (issue #3102 bug 57)
            this._loadError =
              "Unable to load markdown source" +
              (response.status
                ? " (HTTP " + response.status + ")"
                : " (HTTP error)");
          }
        } catch (e) {
          // differentiate a network throw from a bad response so assistive
          // tech and users get an accurate, announced message
          this._loadError = "Unable to load markdown source (network error)";
        }
      } else if (this.markdown) {
        // security: sanitize markdown HTML before unsafeHTML (prevents stored XSS)
        this._parsedMarkdown = sanitizeHTMLString(
          await marked.parse(this.markdown),
        );
      } else {
        this._parsedMarkdown = "";
      }
    }
  }
}
globalThis.customElements.define(MdBlock.tag, MdBlock);
export { MdBlock };
