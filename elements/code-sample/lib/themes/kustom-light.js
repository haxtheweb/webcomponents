import { html } from "lit";

export const kustomLight = html`
  <style>
    .hljs {
      line-height: 1.35;
      display: block;
      overflow-x: auto;
      color: var(--code-sample-color, #505359);
      background: var(--code-sample-background, #f7f7f9);
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
      color: #5b75c5;
    }

    .hljs-literal {
      color: #56b6c2;
    }

    .hljs-string,
    .hljs-regexp,
    .hljs-addition,
    .hljs-attribute,
    .hljs-meta-string {
      color: #268394;
    }

    .hljs-built_in,
    .hljs-class .hljs-title {
      color: #e09306;
    }

    .hljs-attr,
    .hljs-variable,
    .hljs-template-variable,
    .hljs-type,
    .hljs-selector-class,
    .hljs-selector-attr,
    .hljs-selector-pseudo,
    .hljs-number {
      color: #d06449;
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

    .hljs-params {
      color: #e6c07b;
    }
  </style>
`;
