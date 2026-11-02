import { html } from "lit";

export const solarizedLight = html`
  <style>
    /* token colors tuned to meet WCAG AA 4.5:1 against this background and highlighted lines */
    /* Orginal Style from ethanschoonover.com/solarized (c) Jeremy Hull <sourdrums@gmail.com> */

    .hljs {
      display: block;
      overflow-x: auto;
      background: var(--code-sample-background, #fdf6e3);
      color: var(--code-sample-color, #586b72);
    }

    /* line numbers, hover and highlighted lines follow this theme's background, not the page color scheme */
    .hljs-ln {
      color-scheme: light;
    }

    .hljs-comment,
    .hljs-quote {
      color: #616a6a;
    }

    /* Solarized Green */
    .hljs-keyword,
    .hljs-selector-tag,
    .hljs-addition {
      color: #606e00;
    }

    /* Solarized Cyan */
    .hljs-number,
    .hljs-string,
    .hljs-meta .hljs-meta-string,
    .hljs-literal,
    .hljs-doctag,
    .hljs-regexp {
      color: #1e746d;
    }

    /* Solarized Blue */
    .hljs-title,
    .hljs-section,
    .hljs-name,
    .hljs-selector-id,
    .hljs-selector-class {
      color: #1e6ca4;
    }

    /* Solarized Yellow */
    .hljs-attribute,
    .hljs-attr,
    .hljs-variable,
    .hljs-template-variable,
    .hljs-class .hljs-title,
    .hljs-type {
      color: #826300;
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
      color: #b54314;
    }

    /* Solarized Red */
    .hljs-built_in,
    .hljs-deletion {
      color: #c42d2a;
    }

    .hljs-formula {
      background: #eee8d5;
    }

    .hljs-emphasis {
      font-style: italic;
    }

    .hljs-strong {
      font-weight: bold;
    }
  </style>
`;
