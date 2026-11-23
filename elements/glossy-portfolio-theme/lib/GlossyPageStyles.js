/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * The page typography of glossy-portfolio-theme: used inside the theme and
 * applied to the page by the Glossy design system (lib/GlossyDesignSystem.js)
 * so content in the light DOM reads the same. Links in content are then
 * underlined by lib/GlossyContentStyles.js.
 */
import { css } from "lit";

export const GlossyPageStyles = css`
  :root,
  html,
  body {
    /* font-size: 124px; */
    font-family: var(--main-font);
    color: white;
    background-color: var(--bg-color);
    font-size: var(--main-font-size);
  }

  /* text style */
  p,
  a,
  blockquote,
  pre,
  code,
  span,
  strong,
  em {
    margin: 1em 0; /* Top and bottom margins equal to the font size, no left/right margin */
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.8;
    font-family: inherit;
  }

  li {
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.8;
    font-family: inherit;
  }

  ol,
  ul {
    margin-bottom: 1em;
    display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    padding-inline-start: 40px;
    unicode-bidi: isolate;
  }
  img {
    margin: 1em 0;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0.5em 0; /* Slightly smaller margins for headings */
  }
  h1 {
    font-size: 3rem;
    font-weight: 700;
    line-height: 1.2;
    font-family: inherit;
  }

  h2 {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.3;
    font-family: inherit;
  }
  h3 {
    font-size: 1.75rem; /* 28px if root font size is 16px */
    font-weight: 700;
    line-height: 1.4;
    font-family: inherit;
  }

  a {
    text-decoration: none;
    color: var(--link-color); /* Sky Blue */
    font-family: inherit;
  }

  a:hover {
    color: var(--link-color-hover); /* Bright Cyan for hover effect */
    text-decoration: underline;
  }
  /* Keyboard focus indicators (WCAG 2.4.7) — currentColor adapts to the dark palette */
  a:focus-visible,
  button:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`;
