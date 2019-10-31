/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * `A11yCollapseButtonStyles`
 * `a shared set of styles for a11y-collapse-button`
 *
 * @customElement
 * @see ./a11y-collapse-icon-button.js
 * @see ./a11y-collapse-accordion-button.js
 */
import { css } from "lit-element/lit-element.js";

export const A11yCollapseButtonStyles = css`
  :host #heading {
    display: flex;
    justify-content: stretch;
    align-items: center;
    padding: 0
      var(
        --a11y-collapse-padding-right,
        var(--a11y-collapse-horizontal-padding, 16px)
      )
      0
      var(
        --a11y-collapse-padding-left,
        var(--a11y-collapse-horizontal-padding, 16px)
      );
    font-weight: var(--a11y-collapse-font-weight, bold);
    margin: var(--a11y-collapse-margin, unset);
    color: var(--a11y-collapse-heading-color, unset);
    background-color: var(--a11y-collapse-heading-background-color, unset);
  }
  #text {
    flex-grow: 1;
  }
  #expand {
    transition: transform 0.5s;
    padding: (--a11y-collapse-icon-padding, unset);
  }
  #expand[rotated] {
    transform: rotate(-90deg);
  }
  :host [aria-controls] {
    cursor: pointer;
  }
  :host([disabled]) [aria-controls] {
    cursor: not-allowed;
  }
`;
