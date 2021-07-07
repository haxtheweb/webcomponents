import { html } from "lit";

export const kustomDark = html`
  <style>
    .hljs {
      line-height: 1.35;
      display: block;
      overflow-x: auto;
      color: var(--code-sample-color, #d7ccc8);
      background: var(--code-sample-background, #2f1e1b);
    }

    .hljs-comment,
    .hljs-quote {
      color: #5c6370;
      font-style: italic;
    }

    .hljs-doctag,
    .hljs-keyword,
    .hljs-formula {
      color: #c678dd;
    }

    .hljs-section,
    .hljs-name,
    .hljs-selector-tag,
    .hljs-deletion,
    .hljs-subst,
    .hljs-tag {
      color: #ff6f00;
    }

    .hljs-string,
    .hljs-regexp,
    .hljs-addition,
    .hljs-attribute,
    .hljs-meta-string,
    .hljs-literal {
      color: #00bcd4;
    }

    .hljs-built_in,
    .hljs-class .hljs-title,
    .hljs-params {
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
      color: #afb42b;
    }

    .hljs-symbol,
    .hljs-bullet,
    .hljs-link,
    .hljs-meta,
    .hljs-selector-id,
    .hljs-title {
      color: #61aeee;
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
  </style>
`;
