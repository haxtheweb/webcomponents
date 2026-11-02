import { html } from "lit";

export const kustomLight = html`
  <style>
    /* token colors tuned to meet WCAG AA 4.5:1 against this background and highlighted lines */
    .hljs {
      line-height: 1.35;
      display: block;
      overflow-x: auto;
      color: var(--code-sample-color, #505359);
      background: var(--code-sample-background, #f7f7f9);
    }

    /* line numbers, hover and highlighted lines follow this theme's background, not the page color scheme */
    .hljs-ln {
      color-scheme: light;
    }

    .hljs-comment,
    .hljs-quote {
      color: #5c6370;
      font-style: italic;
    }

    .hljs-doctag,
    .hljs-keyword,
    .hljs-formula {
      color: #895398;
    }

    .hljs-section,
    .hljs-name,
    .hljs-selector-tag,
    .hljs-deletion,
    .hljs-subst,
    .hljs-tag {
      color: #4f66ab;
    }

    .hljs-literal {
      color: #357178;
    }

    .hljs-string,
    .hljs-regexp,
    .hljs-addition,
    .hljs-attribute,
    .hljs-meta-string {
      color: #217281;
    }

    .hljs-built_in,
    .hljs-class .hljs-title {
      color: #8f5e04;
    }

    .hljs-attr,
    .hljs-variable,
    .hljs-template-variable,
    .hljs-type,
    .hljs-selector-class,
    .hljs-selector-attr,
    .hljs-selector-pseudo,
    .hljs-number {
      color: #a44f3a;
    }

    .hljs-symbol,
    .hljs-bullet,
    .hljs-link,
    .hljs-meta,
    .hljs-selector-id,
    .hljs-title {
      color: #3c6c94;
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
      color: #7a6641;
    }
  </style>
`;
