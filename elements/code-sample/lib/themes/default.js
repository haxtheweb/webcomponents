import { html } from "lit";

export const defaultTheme = html`
  <style>
    /* token colors tuned to meet WCAG AA 4.5:1 against this background and highlighted lines */
    /* Original highlight.js style (c) Ivan Sagalaev <maniac@softwaremaniacs.org> */

    .hljs {
      display: block;
      overflow-x: auto;
      background: var(--code-sample-background, #f0f0f0);
    }

    /* line numbers, hover and highlighted lines follow this theme's background, not the page color scheme */
    .hljs-ln {
      color-scheme: light;
    }

    /* Base color: saturation 0; */

    .hljs,
    .hljs-subst {
      color: var(--code-sample-color, #444);
    }

    .hljs-comment {
      color: #656565;
    }

    .hljs-keyword,
    .hljs-attribute,
    .hljs-selector-tag,
    .hljs-meta-keyword,
    .hljs-doctag,
    .hljs-name {
      font-weight: bold;
    }

    /* User color: hue: 0 */

    .hljs-type,
    .hljs-string,
    .hljs-number,
    .hljs-selector-id,
    .hljs-selector-class,
    .hljs-quote,
    .hljs-template-tag,
    .hljs-deletion {
      color: #880000;
    }

    .hljs-title,
    .hljs-section {
      color: #880000;
      font-weight: bold;
    }

    .hljs-regexp,
    .hljs-symbol,
    .hljs-variable,
    .hljs-template-variable,
    .hljs-link,
    .hljs-selector-attr,
    .hljs-selector-pseudo {
      color: #9a4f4f;
    }

    /* Language color: hue: 90; */

    .hljs-literal {
      color: #4d6c3d;
    }

    .hljs-built_in,
    .hljs-bullet,
    .hljs-code,
    .hljs-addition {
      color: #387200;
    }

    /* Meta color: hue: 200 */

    .hljs-meta {
      color: #1d6b91;
    }

    .hljs-meta-string {
      color: #366b86;
    }

    /* Misc effects */

    .hljs-emphasis {
      font-style: italic;
    }

    .hljs-strong {
      font-weight: bold;
    }
  </style>
`;
