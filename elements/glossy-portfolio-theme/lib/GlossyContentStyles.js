/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * How Glossy treats links in content. DDD tells a link from the text around
 * it by weight and an accent background; on Glossy's dark floor the glass
 * cyan link color (DDD's linkLight) sits too close to the white text
 * (WCAG 1.4.1 needs 3:1 or a cue other than color), and a cyan background
 * under cyan text can't be read. So Glossy underlines links in content,
 * keeps the weight of the text around them and drops the background. The
 * color stays DDD's light-dark() link pair, mapped to glass blue on light
 * surfaces and glass cyan on the dark floor. Hover and focus thicken the
 * underline, so the state change is not color alone either.
 */
import { css } from "lit";

export const GlossyContentStyles = css`
  body a:any-link,
  body a:-webkit-any-link {
    background-color: transparent;
    font-weight: inherit;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.2em;
  }
  body a:any-link:hover,
  body a:any-link:focus-visible {
    text-decoration-thickness: 3px;
  }
`;
