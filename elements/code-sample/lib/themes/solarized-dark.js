import { html } from "lit";

export const solarizedDark = html`
  <style>
    /* token colors tuned to meet WCAG AA 4.5:1 against this background and highlighted lines */
    /* Orginal Style from ethanschoonover.com/solarized (c) Jeremy Hull <sourdrums@gmail.com> */

    .hljs {
      display: block;
      overflow-x: auto;
      background: var(--code-sample-background, #002b36);
      color: var(--code-sample-color, #9daaac);
    }

    /* line numbers, hover and highlighted lines follow this theme's background, not the page color scheme */
    .hljs-ln {
      color-scheme: dark;
    }

    .hljs-comment,
    .hljs-quote {
      color: #9ca9ae;
    }

    /* Solarized Green */
    .hljs-keyword,
    .hljs-selector-tag,
    .hljs-addition {
      color: #a1b03b;
    }

    /* Solarized Cyan */
    .hljs-number,
    .hljs-string,
    .hljs-meta .hljs-meta-string,
    .hljs-literal,
    .hljs-doctag,
    .hljs-regexp {
      color: #59b6af;
    }

    /* Solarized Blue */
    .hljs-title,
    .hljs-section,
    .hljs-name,
    .hljs-selector-id,
    .hljs-selector-class {
      color: #67aee0;
    }

    /* Solarized Yellow */
    .hljs-attribute,
    .hljs-attr,
    .hljs-variable,
    .hljs-template-variable,
    .hljs-class .hljs-title,
    .hljs-type {
      color: #c6a43b;
    }

    /* Solarized Orange */
    .hljs-symbol,
    .hljs-bullet,
    .hljs-subst,
    .hljs-meta,
    .hljs-meta .hljs-keyword,
    .hljs-selector-attr,
    .hljs-selector-pseudo,
    .hljs-link {
      color: #e09576;
    }

    /* Solarized Red */
    .hljs-built_in,
    .hljs-deletion {
      color: #ec8e8d;
    }

    .hljs-formula {
      background: #073642;
    }

    .hljs-emphasis {
      font-style: italic;
    }

    .hljs-strong {
      font-weight: bold;
    }
  </style>
`;
