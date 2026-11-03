import { html } from "lit";

export const github = html`
  <style>
    /* token colors tuned to meet WCAG AA 4.5:1 against this background and highlighted lines */
    /* github.com style (c) Vasily Polovnyov <vast@whiteants.net> */

    .hljs {
      display: block;
      overflow-x: auto;
      color: var(--code-sample-color, #333);
      background: var(--code-sample-background, #f8f8f8);
    }

    /* line numbers, hover and highlighted lines follow this theme's background, not the page color scheme */
    .hljs-ln {
      color-scheme: light;
    }

    .hljs-comment,
    .hljs-quote {
      color: #6a6a5e;
      font-style: italic;
    }

    .hljs-keyword,
    .hljs-selector-tag,
    .hljs-subst {
      color: #333;
      font-weight: bold;
    }

    .hljs-number,
    .hljs-literal,
    .hljs-variable,
    .hljs-template-variable,
    .hljs-tag .hljs-attr {
      color: #007676;
    }

    .hljs-string,
    .hljs-doctag {
      color: #d01040;
    }

    .hljs-title,
    .hljs-section,
    .hljs-selector-id {
      color: #900;
      font-weight: bold;
    }

    .hljs-subst {
      font-weight: normal;
    }

    .hljs-type,
    .hljs-class .hljs-title {
      color: #458;
      font-weight: bold;
    }

    .hljs-tag,
    .hljs-name,
    .hljs-attribute {
      color: #000080;
      font-weight: normal;
    }

    .hljs-regexp,
    .hljs-link {
      color: #007a1e;
    }

    .hljs-symbol,
    .hljs-bullet {
      color: #990073;
    }

    .hljs-built_in,
    .hljs-builtin-name {
      color: #007196;
    }

    .hljs-meta {
      color: #686868;
      font-weight: bold;
    }

    .hljs-deletion {
      background: #fdd;
    }

    .hljs-addition {
      background: #dfd;
    }

    .hljs-emphasis {
      font-style: italic;
    }

    .hljs-strong {
      font-weight: bold;
    }
  </style>
`;
