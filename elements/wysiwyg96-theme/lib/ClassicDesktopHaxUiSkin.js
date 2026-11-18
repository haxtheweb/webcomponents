/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * The HAX editor in Classic Desktop: while the system is active, the HAX UI
 * tokens the editor reads point at the classic palette. The top bar becomes
 * the application's title bar (navy, white text); it keeps color-scheme
 * dark, so the pieces that pin their own dark wells (Merlin's field) still
 * read. The tray, menus and dialogs become classic windows (white work
 * areas, as the classic list boxes and fields were, on gray wells; the
 * admin's status colors and field edges are tuned for a light surface, so
 * the surface stays light), and the
 * high contrast black scheme follows the HAX UI dark setting and the
 * page's dark mode. Only HAX UI tokens are set, and only on a body the
 * editor has given a HAX UI theme: the page's own color scheme is never
 * touched, so content keeps following dark mode.
 *
 * The top bar sets its own chrome tokens on itself, so they are answered
 * through its existing "top-bar" part, which a rule in the page outranks.
 * The groups of declarations below are plain text, dropped into rules.
 */
import { css, unsafeCSS } from "lit";

const titleBar = unsafeCSS(`
  color-scheme: dark;
  --hax-ui-color-scheme: dark;
  --hax-ui-color: var(--classic-desktop-palette-white);
  --hax-ui-color-focus: var(--classic-desktop-palette-white);
  --hax-ui-color-faded: var(--classic-desktop-palette-white);
  --hax-ui-background-color: var(--classic-desktop-palette-navy);
  --hax-ui-background-color-secondary: var(--classic-desktop-palette-black);
  --hax-ui-background-color-faded: var(--classic-desktop-palette-black);
  --hax-ui-color-accent: var(--classic-desktop-palette-aqua);
  --hax-ui-color-accent-secondary: var(--classic-desktop-palette-aqua);
  --hax-ui-background-color-accent: var(--classic-desktop-palette-black);
  --hax-ui-border-color: var(--classic-desktop-palette-black);
  --hax-ui-on-titlebar: var(--classic-desktop-palette-white);
  --hax-ui-border-radius: 0px;
  --hax-ui-font-family: var(--classic-desktop-font-ui);
  --hax-ui-admin-font-family: var(--classic-desktop-font-ui);
  --bg-color: var(--classic-desktop-palette-navy);
  --accent-color: var(--classic-desktop-palette-white);
`);

const windowLight = unsafeCSS(`
  --hax-ui-color-scheme: light;
  --hax-ui-color: var(--classic-desktop-palette-black);
  --hax-ui-color-focus: var(--classic-desktop-palette-black);
  --hax-ui-color-faded: var(--classic-desktop-palette-black);
  --hax-ui-background-color: var(--classic-desktop-palette-white);
  --hax-ui-background-color-secondary: var(--classic-desktop-ink-light);
  --hax-ui-background-color-faded: var(--classic-desktop-palette-silver);
  --hax-ui-color-accent: var(--classic-desktop-palette-navy);
  --hax-ui-color-accent-secondary: var(--classic-desktop-palette-navy);
  --hax-ui-background-color-accent: var(--classic-desktop-palette-sky-blue);
  --hax-ui-color-danger: var(--classic-desktop-palette-maroon);
  --hax-ui-color-danger-secondary: var(--classic-desktop-palette-maroon);
  --hax-ui-background-color-danger: var(--classic-desktop-palette-cream);
  --hax-ui-border-color: var(--classic-desktop-palette-black);
  --hax-ui-border-radius: 0px;
  --hax-ui-font-family: var(--classic-desktop-font-ui);
  --hax-ui-admin-font-family: var(--classic-desktop-font-ui);
`);

const windowHighContrast = unsafeCSS(`
  --hax-ui-color-scheme: dark;
  --hax-ui-color: var(--classic-desktop-palette-white);
  --hax-ui-color-focus: var(--classic-desktop-palette-white);
  --hax-ui-color-faded: var(--classic-desktop-palette-white);
  --hax-ui-background-color: var(--classic-desktop-palette-black);
  --hax-ui-background-color-secondary: var(--classic-desktop-palette-black);
  --hax-ui-background-color-faded: var(--classic-desktop-palette-black);
  --hax-ui-color-accent: var(--classic-desktop-palette-aqua);
  --hax-ui-color-accent-secondary: var(--classic-desktop-palette-aqua);
  --hax-ui-background-color-accent: var(--classic-desktop-palette-black);
  --hax-ui-color-danger: var(--classic-desktop-palette-yellow);
  --hax-ui-color-danger-secondary: var(--classic-desktop-palette-yellow);
  --hax-ui-background-color-danger: var(--classic-desktop-palette-black);
  --hax-ui-border-color: var(--classic-desktop-palette-white);
  --hax-ui-on-titlebar: var(--classic-desktop-palette-white);
  --bg-color: var(--classic-desktop-palette-black);
  --accent-color: var(--classic-desktop-palette-white);
`);

export const ClassicDesktopHaxUiSkin = css`
  html body[hax-ui-theme] {
    ${windowLight}
  }
  html body[hax-ui-theme="haxdark"],
  html body.dark-mode[hax-ui-theme="system"] {
    ${windowHighContrast}
  }
  @media (prefers-color-scheme: dark) {
    html body[hax-ui-theme="system"] {
      ${windowHighContrast}
    }
  }
  haxcms-site-editor-ui::part(top-bar) {
    ${titleBar}
    color: var(--classic-desktop-palette-white);
    background-color: var(--classic-desktop-palette-navy);
    box-shadow:
      inset 0 -2px 0 var(--classic-desktop-palette-silver),
      inset 0 -3px 0 var(--classic-desktop-palette-black);
    font-family: var(--classic-desktop-font-ui);
  }
  body.dark-mode haxcms-site-editor-ui::part(top-bar),
  html[data-theme="dark"] haxcms-site-editor-ui::part(top-bar) {
    ${windowHighContrast}
    color-scheme: dark;
    color: var(--classic-desktop-palette-white);
    background-color: var(--classic-desktop-palette-black);
    box-shadow: inset 0 -2px 0 var(--classic-desktop-palette-white);
  }
`;
