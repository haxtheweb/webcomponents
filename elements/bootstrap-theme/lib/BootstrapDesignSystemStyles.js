/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * The two Bootstrap-only content attributes. Bootstrap is a DDD dialect, so
 * text alignment, float, padding, margin, radius and shadow come from DDD's
 * own data attributes (the same names content already uses); these cover
 * what DDD has no attribute for, drawn with Bootstrap 5 tokens.
 */
import { css } from "lit";

export const BootstrapDesignSystemDataAttributes = css`
  [data-bootstrap-surface="subtle"] {
    background-color: var(--bs-tertiary-bg);
    color: var(--bs-body-color);
  }
  [data-bootstrap-surface="strong"] {
    background-color: var(--bs-emphasis-color);
    color: var(--bs-body-bg);
  }
  [data-bootstrap-surface="outline"] {
    border: var(--bs-border-width) solid var(--bs-border-color);
  }

  [data-bootstrap-emphasis="lead"] {
    font-size: var(--ddd-font-size-s);
    font-weight: var(--ddd-font-weight-light);
  }
  [data-bootstrap-emphasis="small"] {
    font-size: var(--ddd-font-size-4xs);
  }
  [data-bootstrap-emphasis="muted"] {
    color: var(--bs-secondary-color);
  }
  [data-bootstrap-emphasis="strong"] {
    font-weight: var(--ddd-font-weight-bold);
  }
`;

export const BootstrapDesignSystemStyles = [
  BootstrapDesignSystemDataAttributes,
];
