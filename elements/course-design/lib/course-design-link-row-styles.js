import { css } from "lit";

/**
 * The single link row ebook-button and worksheet-download both render: a
 * bordered link with an icon tile, an eyebrow label, a bold title and a
 * trailing round icon action with a hover / focus label. Each element adds
 * its own title colour and picks the action icon.
 */
export const CourseDesignLinkRowStyles = css`
  :host {
    display: block;
  }
  .link-row {
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: var(--ddd-spacing-3);
    min-height: var(--ddd-spacing-12);
    padding-block: var(--ddd-spacing-2);
    padding-inline: var(--ddd-spacing-4) var(--ddd-spacing-3);
    border: var(--ddd-border-xs);
    border-color: light-dark(
      var(--ddd-theme-default-limestoneLight),
      var(--ddd-theme-default-slateGray)
    );
    border-radius: var(--ddd-radius-md);
    background-color: light-dark(
      var(--ddd-theme-default-white),
      var(--ddd-theme-default-potentialMidnight)
    );
    color: light-dark(
      var(--ddd-theme-default-coalyGray),
      var(--ddd-theme-default-white)
    );
    font-family: var(--ddd-font-primary);
    text-decoration: none;
    text-transform: none;
    transition: border-color var(--ddd-duration-normal, 0.3s) ease-in-out;
  }
  @media (prefers-reduced-motion: reduce) {
    .link-row {
      transition: none;
    }
  }
  .link-row:hover {
    border-color: light-dark(
      var(--ddd-theme-default-nittanyNavy),
      var(--ddd-theme-default-linkLight)
    );
    cursor: pointer;
  }
  .link-row:focus-visible {
    outline: var(--ddd-focus-ring);
    outline-offset: var(--ddd-focus-offset);
  }
  .tile {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    width: var(--ddd-icon-sm);
    height: var(--ddd-icon-sm);
    border-radius: var(--ddd-radius-sm);
    background-color: light-dark(
      var(--ddd-theme-default-skyMaxLight),
      var(--ddd-theme-default-nittanyNavy)
    );
    color: light-dark(
      var(--ddd-theme-default-nittanyNavy),
      var(--ddd-theme-default-linkLight)
    );
  }
  .tile simple-icon-lite {
    /* DDD icon sizing variables size the icon and its svg */
    --simple-icon-height: var(--ddd-icon-3xs);
    --simple-icon-width: var(--ddd-icon-3xs);
  }
  .text {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-width: 0;
  }
  .eyebrow {
    font-family: var(--ddd-font-navigation);
    font-size: var(--ddd-font-size-5xs);
    font-weight: var(--ddd-font-weight-medium);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: light-dark(
      var(--ddd-theme-default-slateGray),
      var(--ddd-theme-default-limestoneLight)
    );
  }
  :host(:lang(ar)) .eyebrow,
  :host(:lang(fa)) .eyebrow,
  :host(:lang(he)) .eyebrow,
  :host(:lang(ur)) .eyebrow {
    letter-spacing: 0;
  }
  .title {
    font-size: var(--ddd-font-size-3xs);
    font-weight: var(--ddd-font-weight-bold);
    line-height: var(--ddd-lh-140);
    overflow-wrap: anywhere;
  }
  /* trailing affordance: the 40px round DDD block action. The row is the
     one link, so this is a styled span inside it, not a nested button */
  .action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    box-sizing: border-box;
    width: var(--ddd-control-height-sm);
    height: var(--ddd-control-height-sm);
    border: var(--ddd-border-xs);
    border-color: light-dark(
      var(--ddd-theme-default-limestoneLight),
      var(--ddd-theme-default-slateGray)
    );
    border-radius: var(--ddd-radius-circle);
    color: light-dark(
      var(--ddd-theme-default-nittanyNavy),
      var(--ddd-theme-default-linkLight)
    );
    --simple-icon-color: currentColor;
    --simple-icon-width: var(--ddd-icon-3xs);
    --simple-icon-height: var(--ddd-icon-3xs);
  }
  .link-row:hover .action,
  .link-row:focus-visible .action {
    border-color: light-dark(
      var(--ddd-theme-default-nittanyNavy),
      var(--ddd-theme-default-linkLight)
    );
  }
  /* label shown above the row, over the action, on hover / keyboard
     focus, styled like the DDD block tooltips. It stays in the
     accessibility tree (opacity, not visibility) so it remains part of the
     link name */
  .tip {
    position: absolute;
    inset-block-end: calc(100% + var(--ddd-spacing-1));
    inset-inline-end: var(--ddd-spacing-3);
    z-index: 1;
    padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
    border-radius: var(--ddd-radius-xs);
    background-color: light-dark(
      var(--ddd-theme-default-coalyGray),
      var(--ddd-theme-default-slateGray)
    );
    color: var(--ddd-theme-default-white);
    font-family: var(--ddd-font-navigation);
    font-size: var(--ddd-font-size-5xs);
    font-weight: var(--ddd-font-weight-medium);
    line-height: var(--ddd-lh-120);
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity var(--ddd-duration-fast, 0.15s) ease-in-out;
  }
  .link-row:hover .tip,
  .link-row:focus-visible .tip {
    opacity: 1;
  }
  @media (prefers-reduced-motion: reduce) {
    .tip {
      transition: none;
    }
  }
`;
