/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
/**
 * DDD long-form reading styles, shared by the course-content themes
 * (clean-one, clean-two, learn-two-theme, polaris-invent-theme) so they
 * read the same way: one line height, one measure, one paragraph rhythm and
 * one pair of reading colors, all from DDD tokens.
 *
 * Two pieces:
 * - DDDReadingSurface: put inside a theme's static styles and apply it to
 *   the element that wraps the content slot (add the class ddd-reading).
 *   Sets the line height and the measure. A theme widens the measure by
 *   setting --ddd-theme-measure on .ddd-reading in its own styles, after
 *   this one.
 * - dddReadingProse(tag, align): returns global (document level) CSS for the
 *   theme's HAXCMSGlobalStyleSheetContent(). It sets the reading text color
 *   on running text only, so headings keep the theme's own color, and adds a
 *   little tracking in dark mode, where light text on a dark ground reads
 *   tighter. Page content lives in the
 *   light DOM as direct children of the theme element, so prose rules target
 *   "tag > p" and friends. Only running text (paragraphs, lists, headings,
 *   blockquotes, definition lists) is capped at the reading measure; media,
 *   tables, grids and other elements keep the full content column.
 *
 * Selectors are kept at element-level specificity so any DDD data-attribute
 * an author set on a block (data-width, data-padding, data-accent and so on)
 * still wins.
 */
import { css, unsafeCSS } from "lit";

export const DDDReadingSurface = css`
  .ddd-reading {
    --ddd-theme-measure: var(--ddd-content-width-sm);
    line-height: var(--ddd-lh-170);
    text-align: start;
  }
`;

// tag names are only ever passed in by theme code, never by content
const SAFE_TAG = /^[a-z][a-z0-9]*(-[a-z0-9]+)+$/;

/**
 * Global prose rules for one theme.
 * @param {string} tag the theme's custom element name, ex: "clean-one"
 * @param {string} align "center" to center capped prose in the content column,
 *   "start" to keep it on the column's leading edge
 *
 * Running text is coaly gray / limestone, made for a white or near black
 * content surface. A theme whose content sits on another surface (a palette
 * fill, say) sets --ddd-reading-prose-color to the text color it pairs with
 * that surface.
 */
export function dddReadingProse(tag, align = "center") {
  if (!SAFE_TAG.test(tag)) {
    return css``;
  }
  const t = unsafeCSS(tag);
  const start = align === "start";
  const inline = start
    ? unsafeCSS("margin-inline-end: auto;")
    : unsafeCSS("margin-inline: auto;");
  // a start-aligned blockquote keeps its indent inside the measure instead of
  // pushing its right edge past the paragraphs around it
  const quote = start
    ? css`
        ${t} > blockquote {
          margin-inline-start: var(--ddd-spacing-10);
          max-width: calc(
            var(--ddd-theme-measure, var(--ddd-content-width-sm)) - var(
                --ddd-spacing-10
              )
          );
        }
      `
    : css``;
  return css`
    ${t} > :is(p, ul, ol, dl, blockquote, h1, h2, h3, h4, h5, h6) {
      max-width: var(--ddd-theme-measure, var(--ddd-content-width-sm));
      box-sizing: border-box;
      ${inline}
    }
    ${quote}
    ${t} > :is(p, ul, ol, dl, blockquote) {
      color: var(
        --ddd-reading-prose-color,
        light-dark(
          var(--ddd-theme-default-coalyGray),
          var(--ddd-theme-default-limestoneMaxLight)
        )
      );
    }
    ${t} > p {
      margin-block: 0 var(--ddd-spacing-8);
      text-wrap: pretty;
    }
    ${t} > :is(ul, ol) > li {
      margin-block-end: var(--ddd-spacing-2);
      text-wrap: pretty;
    }
    ${t} > :is(h2, h3, h4, h5, h6) {
      line-height: var(--ddd-lh-120);
      margin-block: var(--ddd-spacing-10) var(--ddd-spacing-3);
      text-wrap: balance;
    }
    ${t} > h2 {
      margin-block-start: var(--ddd-spacing-12);
    }
    body.dark-mode ${t} > :is(p, ul, ol, dl, blockquote) {
      letter-spacing: var(--ddd-ls-20-lg);
    }
    ${t} > :is(p, ul, ol, dl, blockquote) a:any-link {
      text-decoration-line: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 3px;
    }
  `;
}
