import { html } from "lit";

export const oneDark = html`
  <style>
    /* token colors tuned to meet WCAG AA 4.5:1 against this background and highlighted lines */
    /*

  Atom One Dark by Daniel Gamage
  Original One Dark Syntax theme from https://github.com/atom/one-dark-syntax

  base:    #282c34
  mono-1:  #abb2bf
  mono-2:  #818896
  mono-3:  #5c6370
  hue-1:   #56b6c2
  hue-2:   #61aeee
  hue-3:   #c678dd
  hue-4:   #98c379
  hue-5:   #e06c75
  hue-5-2: #be5046
  hue-6:   #d19a66
  hue-6-2: #e6c07b

  */

    .hljs {
      display: block;
      overflow-x: auto;
      color: var(--code-sample-color, #abb2bf);
      background: var(--code-sample-background, #282c34);
    }

    /* line numbers, hover and highlighted lines follow this theme's background, not the page color scheme */
    .hljs-ln {
      color-scheme: dark;
    }

    .hljs-comment,
    .hljs-quote {
      color: #a7abb2;
      font-style: italic;
    }

    .hljs-doctag,
    .hljs-keyword,
    .hljs-formula {
      color: #d294e4;
    }

    .hljs-section,
    .hljs-name,
    .hljs-selector-tag,
    .hljs-deletion,
    .hljs-subst,
    .hljs-tag {
      color: #e8949a;
    }

    .hljs-literal {
      color: #5bb8c4;
    }

    .hljs-string,
    .hljs-regexp,
    .hljs-addition,
    .hljs-attribute,
    .hljs-meta-string {
      color: #98c379;
    }

    .hljs-built_in,
    .hljs-class .hljs-title {
      color: #e6c07b;
    }

    .hljs-attr,
    .hljs-variable,
    .hljs-template-variable,
    .hljs-type,
    .hljs-selector-class,
    .hljs-selector-attr,
    .hljs-selector-pseudo,
    .hljs-number {
      color: #d4a06f;
    }

    .hljs-symbol,
    .hljs-bullet,
    .hljs-link,
    .hljs-meta,
    .hljs-selector-id,
    .hljs-title {
      color: #67b1ef;
    }

    .hljs-emphasis {
      font-style: italic;
    }

    .hljs-strong {
      font-weight: bold;
    }

    .hljs-link {
      text-decoration: underline;
    }

    .hljs-params {
      color: #e6c07b;
    }
  </style>
`;
