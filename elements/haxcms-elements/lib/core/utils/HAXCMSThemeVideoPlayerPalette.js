/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { css } from "lit";

/**
 * Opt-in styles for a HAXcms theme: once the site has a palette
 * (data-palette on the theme element), video-player draws its surface,
 * text, borders and hover states from that palette instead of the plain
 * DDD defaults. Without a palette nothing changes.
 *
 * Every surface colour is paired with the palette text colour made for it
 * (palette-text-color-N on palette-color-N), so the controls keep their
 * contrast in every palette. The accent itself already follows the
 * palette inside video-player (--ddd-palette-accent).
 *
 * Usage: add HAXCMSThemeVideoPlayerPalette to the theme's static styles.
 */
export const HAXCMSThemeVideoPlayerPalette = css`
  :host([data-palette]) {
    --video-player-color: var(--ddd-palette-text-color-3);
    --video-player-caption-color: var(--ddd-palette-text-color-3);
    --video-player-bg-color: var(--ddd-palette-color-3);
    --video-player-border-color: var(--ddd-palette-color-2);
    --video-player-hover-color: var(--ddd-palette-text-color-2);
    --video-player-hover-bg-color: var(--ddd-palette-color-2);
    --video-player-faded-accent-color: var(--ddd-palette-color-4);
    --video-player-disabled-color: color-mix(
      in srgb,
      var(--ddd-palette-text-color-3) 60%,
      var(--ddd-palette-color-3)
    );
  }
`;
