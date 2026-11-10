import { css } from "lit";

/**
 * The look shared by the editor tray's browsers (Blocks and Templates):
 * HAX UI tiles and category rows. Tiles have no border at rest; the icon
 * sits in a sunken well with its label under it, and hover or focus draws
 * the tile. Categories are HAX UI fieldset rows like the Configure groups:
 * 32px, chevron first, bold label, a line under. Values come from the
 * HAX UI tokens the tray defines, with DDD fallbacks.
 */
export const HaxTrayBrowserStyles = [
  css`
    /* block tiles: no border at rest, the icon in a sunken well, the
           label under it; hover and focus draw the tile */
    hax-tray-button {
      flex: auto;
      font-size: var(--hax-ui-admin-font-size-xs);
      --hax-ui-font-size-sm: var(--hax-ui-admin-font-size-xs);
      --simple-toolbar-button-height: var(--hax-ui-icon);
      --simple-toolbar-button-width: var(--hax-ui-icon);
    }
    hax-tray-button::part(button) {
      box-sizing: border-box;
      width: 100%;
      min-height: calc(var(--hax-ui-row-height) * 2);
      gap: var(--hax-ui-gap);
      padding: var(--hax-ui-gap);
      border: 1px solid transparent;
      border-radius: var(--hax-ui-radius);
      background-color: transparent;
      color: var(--hax-ui-text);
      font-size: var(--hax-ui-admin-font-size-xs);
      line-height: 1.2;
    }
    hax-tray-button:hover::part(button),
    hax-tray-button:focus-within::part(button) {
      background-color: var(--hax-ui-hover);
      border-color: var(--hax-ui-line-strong);
    }
    hax-tray-button::part(icon) {
      box-sizing: content-box;
      padding: var(--hax-ui-gap) var(--hax-ui-gap-md);
      border-radius: var(--hax-ui-radius);
      background-color: var(--hax-ui-sunken);
      color: var(--hax-ui-accent-strong);
    }
    hax-tray-button:hover::part(icon),
    hax-tray-button:focus-within::part(icon) {
      background-color: var(--hax-ui-accent-soft);
    }
    hax-tray-button::part(label) {
      margin: 0;
    }
    simple-button-grid {
      --simple-button-grid-margin: var(--hax-ui-gap);
      padding: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
      border-bottom: 1px solid var(--hax-ui-line);
      box-sizing: border-box;
    }
    /* categories are HAX UI fieldset rows: 32px, chevron first, bold
           label, a line under, like the Configure groups */
    a11y-collapse {
      margin: 0;
      --a11y-collapse-margin: 0;
      --a11y-collapse-border: none;
      --a11y-collapse-border-between: none;
      --a11y-collapse-vertical-padding: 0;
      --a11y-collapse-horizontal-padding: 0;
      --a11y-collapse-padding-left: 0;
      --a11y-collapse-heading-font-weight: 700;
      --a11y-collapse-heading-color: var(--hax-ui-text);
      border-bottom: 1px solid var(--hax-ui-line);
    }
    a11y-collapse::part(heading-id) {
      flex-direction: row-reverse;
      justify-content: flex-end;
      gap: var(--hax-ui-gap-md);
      min-height: var(--hax-ui-row-height);
      padding: 0 var(--hax-ui-gap-lg);
      border-bottom: 1px solid var(--hax-ui-line);
    }
    a11y-collapse::part(heading) {
      display: block;
      margin: 0;
      font-family: var(--ddd-font-primary, sans-serif);
      font-size: var(--hax-ui-admin-font-size);
      line-height: var(--hax-ui-row-height);
    }
    a11y-collapse::part(icon) {
      --simple-icon-width: var(--hax-ui-icon);
      --simple-icon-height: var(--hax-ui-icon);
    }
    a11y-collapse[disabled]::part(heading) {
      font-weight: 400;
      color: var(--hax-ui-text-muted);
    }
  `,
];
