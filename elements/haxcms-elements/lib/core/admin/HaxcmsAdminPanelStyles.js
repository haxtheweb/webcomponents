import { css } from "lit";

/**
 * Settings-panel layout shared by the admin sections that render grouped
 * fields as label / control rows (SEO, site details, editor settings):
 * the host box, the admin fieldset summaries, the .fr row, .lab, .help and
 * the changed .dot. Include it right after the HAX UI admin styles and
 * before the section's own rules.
 */
export const HaxcmsAdminPanelStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    padding: var(--hax-ui-gap) var(--ddd-spacing-6, 24px)
      var(--ddd-spacing-8, 32px);
    font-family: var(--hax-ui-admin-font-family);
    font-size: var(--hax-ui-admin-font-size);
    color: var(--hax-ui-text);
    background-color: var(--hax-ui-surface);
  }
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  /* admin fieldset (contract-admin-fieldset), not DDD's content-scale
       details: no +/- marker, no 650px cap, no tinted bar */
  details {
    margin: 0;
    padding: 0;
    max-width: none;
    overflow: visible;
  }
  details > summary::after,
  details[open] > summary::after {
    content: none;
  }
  summary,
  details[open] > summary {
    background-color: transparent;
    color: inherit;
    filter: none;
    font-size: var(--hax-ui-admin-font-size);
    text-wrap: nowrap;
    user-select: none;
    transition: none;
  }
  summary {
    list-style: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: var(--hax-ui-gap-md);
    height: var(--hax-ui-row-height);
    margin-top: var(--ddd-spacing-4, 16px);
    padding: 0 var(--hax-ui-gap-md);
    border-radius: var(--hax-ui-radius);
    font-weight: var(--ddd-font-weight-bold, 700);
  }
  summary::-webkit-details-marker {
    display: none;
  }
  details > summary:hover,
  details[open] > summary:hover {
    background-color: var(--hax-ui-hover);
  }
  summary:focus-visible {
    outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
    outline-offset: 2px;
  }
  summary simple-icon-lite {
    --simple-icon-width: var(--hax-ui-icon);
    --simple-icon-height: var(--hax-ui-icon);
    transition: transform var(--hax-ui-duration) var(--hax-ui-easing);
  }
  details[open] > summary simple-icon-lite {
    transform: rotate(90deg);
  }
  summary h3 {
    margin: 0;
    font-size: var(--hax-ui-admin-font-size);
    font-weight: inherit;
  }
  .fr {
    display: grid;
    grid-template-columns: minmax(160px, 240px) minmax(0, 480px);
    gap: var(--ddd-spacing-6, 24px);
    align-items: start;
    padding: var(--hax-ui-gap-lg) var(--hax-ui-gap-md);
    border-bottom: 1px solid var(--hax-ui-line);
  }
  .lab {
    display: flex;
    align-items: center;
    gap: var(--hax-ui-gap-md);
    font-weight: var(--ddd-font-weight-bold, 700);
  }
  .help {
    display: block;
    margin-top: 2px;
    font-size: var(--hax-ui-admin-font-size-xs);
    line-height: 1.35;
    color: var(--hax-ui-text-muted);
  }
  .dot {
    width: 8px;
    height: 8px;
    flex: none;
    border-radius: 50%;
    background-color: var(--hax-ui-accent-strong);
  }
  @media (max-width: 768px) {
    :host {
      padding: var(--hax-ui-gap) var(--ddd-spacing-4, 16px)
        var(--ddd-spacing-6, 24px);
    }
    .fr {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--hax-ui-gap-md);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    summary simple-icon-lite {
      transition: none;
    }
  }
`;
