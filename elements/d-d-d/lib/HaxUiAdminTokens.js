/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * HAX UI admin layer: tokens, the color-scheme follower and the small
 * primitives (pills, keyboard hints, visually hidden text, focus ring).
 * Part of @haxtheweb/d-d-d/lib/HaxUiAdminStyles.js, which re-exports it
 * with the rest of the layer. Import this file directly when an element
 * needs only this piece, so a page does not download the whole layer.
 */
import { css, unsafeCSS } from "lit";

/**
 * HAX UI admin tokens: the semantic layer admin surfaces (outline designer,
 * dashboard, dialogs, trays) style themselves with. Every value maps to a
 * DDD primitive; surface, text and accent defer to the HAX UI theme tokens
 * (--hax-ui-background-color, --hax-ui-color, --hax-ui-color-accent) when
 * the editor has set them, so the HAX UI theme switch still applies.
 * Include it in an admin element's static styles; a page can override any
 * token on the element from outside. Admin elements use these tokens
 * instead of raw values or DDD content tokens, and new needs are added
 * here, mapped to DDD, before an element uses them.
 * See haxtheweb/issues#3180.
 */
export const HaxUiAdminTokens = [
  css`
    :host {
      --hax-ui-surface: var(
        --hax-ui-background-color,
        light-dark(
          var(--ddd-theme-default-white, #ffffff),
          var(--ddd-theme-default-coalyGray, #262626)
        )
      );
      --hax-ui-text: var(
        --hax-ui-color,
        light-dark(
          var(--ddd-theme-default-coalyGray, #262626),
          var(--ddd-theme-default-white, #ffffff)
        )
      );
      --hax-ui-text-muted: light-dark(
        var(--ddd-theme-default-slateGray, #314d64),
        var(--ddd-theme-default-white65, rgba(255, 255, 255, 0.65))
      );
      --hax-ui-line: light-dark(
        var(--ddd-theme-default-limestoneLight, #e4e5e7),
        color-mix(
          in srgb,
          var(--ddd-theme-default-white, #ffffff) 18%,
          transparent
        )
      );
      /* the edge that shows where a field, select or switch is (WCAG
         1.4.11): 3:1 against the surface and the sunken well in light
         (DDD has no mid grey, so slate is mixed with white; limestone gray
         was 2.4:1), and 45% white over the dark surfaces (40% fell just under 3:1 on
         the Spectrum top bar) */
      --hax-ui-line-strong: light-dark(
        color-mix(
          in srgb,
          var(--ddd-theme-default-slateGray, #314d64) 70%,
          var(--ddd-theme-default-white, #ffffff)
        ),
        color-mix(
          in srgb,
          var(--ddd-theme-default-white, #ffffff) 45%,
          transparent
        )
      );
      --hax-ui-hover: light-dark(
        var(--ddd-theme-default-limestoneMaxLight, #f2f2f4),
        color-mix(
          in srgb,
          var(--ddd-theme-default-white, #ffffff) 8%,
          transparent
        )
      );
      /* laid over a control's own fill while it is held down (see the
         pressed rule in HaxUiAdminControls): a mid gray, so a light fill
         darkens and a dark fill lightens, whatever color a design system
         gives it and in either color scheme */
      --hax-ui-pressed: rgba(128, 128, 128, 0.28);
      /* hover for a control (button, chip, segment): a tint of the text
         color instead of a fixed gray, so it shows on every admin
         background (the fixed gray is the sunken and hover background
         itself) and under a design system that maps that gray to white.
         On the plain surface it matches --hax-ui-hover. */
      --hax-ui-control-hover: light-dark(
        color-mix(in srgb, var(--hax-ui-text) 6%, transparent),
        var(--hax-ui-hover)
      );
      /* rows that belong to the row above (a page's content structure):
         a lighter wash than hover, so hovering one still shows */
      --hax-ui-content-group: light-dark(
        color-mix(
          in srgb,
          var(--ddd-theme-default-limestoneMaxLight, #f2f2f4) 55%,
          transparent
        ),
        color-mix(
          in srgb,
          var(--ddd-theme-default-white, #ffffff) 4%,
          transparent
        )
      );
      --hax-ui-accent: var(
        --hax-ui-color-accent,
        light-dark(
          var(--ddd-theme-default-beaverBlue, #1e407c),
          var(--ddd-theme-default-skyLight, #ccf0ff)
        )
      );
      --hax-ui-accent-strong: light-dark(
        var(--ddd-theme-default-link, #005fa9),
        var(--ddd-theme-default-skyBlue, #009cde)
      );
      --hax-ui-accent-soft: color-mix(
        in srgb,
        var(--hax-ui-accent-strong) 12%,
        transparent
      );
      --hax-ui-selected: color-mix(
        in srgb,
        var(--hax-ui-accent-strong) 18%,
        transparent
      );
      --hax-ui-on-accent: light-dark(
        var(--ddd-theme-default-white, #ffffff),
        var(--ddd-theme-default-potentialMidnight, #000321)
      );
      --hax-ui-danger: light-dark(
        var(--ddd-theme-default-original87Pink, #bc204b),
        var(--ddd-theme-default-discoveryCoral, #f2665e)
      );
      --hax-ui-danger-soft: color-mix(
        in srgb,
        var(--hax-ui-danger) 10%,
        transparent
      );
      /* meaning channel for a wrong answer or a mismatch: purple, never red
         (HAX/DDD: purple is incorrect, green is correct), and always with an
         icon and words beside it */
      --hax-ui-incorrect: light-dark(
        var(--ddd-theme-default-wonderPurple, #491d70),
        var(--ddd-theme-default-athertonViolet, #ac8dce)
      );
      --hax-ui-incorrect-soft: color-mix(
        in srgb,
        var(--hax-ui-incorrect) 12%,
        transparent
      );
      /* "this throws work away", as a texture rather than a color, so it
         still reads in greyscale and with red/green color vision: the
         diagonal hatch outline-designer draws on rows pending delete.
         -hatch goes on an unfilled surface, -hatch-on-fill on top of a
         solid --hax-ui-danger fill. Checked by
         scripts/vision-pairs-check.mjs (haxtheweb/issues#3219). */
      --hax-ui-danger-hatch: repeating-linear-gradient(
        -45deg,
        color-mix(in srgb, var(--hax-ui-danger) 22%, transparent) 0 4px,
        transparent 4px 8px
      );
      --hax-ui-danger-hatch-on-fill: repeating-linear-gradient(
        -45deg,
        light-dark(rgba(0, 0, 0, 0.2), rgba(255, 255, 255, 0.3)) 0 4px,
        transparent 4px 8px
      );
      --hax-ui-success: light-dark(
        var(--ddd-theme-default-opportunityGreen, #008755),
        var(--ddd-theme-default-creekLight, #cfeceb)
      );
      --hax-ui-focus: light-dark(
        var(--ddd-theme-default-link, #005fa9),
        var(--ddd-theme-default-keystoneYellow, #ffd100)
      );
      --hax-ui-focus-width: var(--ddd-border-size-sm, 2px);
      --hax-ui-drop: var(--hax-ui-accent-strong);
      --hax-ui-drop-width: var(--ddd-border-size-sm, 2px);

      --hax-ui-admin-font-family: var(
        --hax-ui-font-family,
        var(--ddd-font-navigation, sans-serif)
      );
      --hax-ui-admin-font-size: var(--hax-ui-font-size-sm, 14px);
      --hax-ui-admin-font-size-xs: var(--hax-ui-font-size-xs, 12px);
      /* titles in admin chrome: card and dialog names (lg), page and panel
         headings and big figures (xl). Same steps as the HAX UI layer */
      --hax-ui-admin-font-size-lg: var(--hax-ui-font-size-lg, 18px);
      --hax-ui-admin-font-size-xl: var(--hax-ui-font-size-xl, 24px);
      --hax-ui-row-height: var(--ddd-control-height-xs, 32px);
      --hax-ui-row-height-compact: calc(
        var(--ddd-target-min, 24px) + var(--ddd-spacing-1, 4px)
      );
      --hax-ui-row-height-roomy: var(--ddd-control-height-sm, 40px);
      --hax-ui-target: var(--ddd-target-min, 24px);
      --hax-ui-indent: var(--ddd-spacing-5, 20px);
      --hax-ui-gap: var(--ddd-spacing-1, 4px);
      --hax-ui-gap-md: var(--ddd-spacing-2, 8px);
      --hax-ui-gap-lg: var(--ddd-spacing-3, 12px);
      --hax-ui-icon: var(--ddd-icon-4xs, 16px);
      --hax-ui-radius: var(--ddd-radius-xs, 4px);
      --hax-ui-radius-lg: var(--ddd-radius-sm, 8px);
      --hax-ui-radius-pill: var(--ddd-radius-rounded, 100px);
      --hax-ui-shadow-popover: var(
        --ddd-boxShadow-md,
        0 4px 12px rgba(0, 0, 0, 0.16)
      );
      --hax-ui-duration: var(--ddd-duration-fast, 150ms);
      --hax-ui-easing: var(--ddd-timing-ease, ease);
      /* showing what changed: rows sliding to new places, new rows
         growing in, the landing highlight; scaled per input in script */
      --hax-ui-duration-move: var(--ddd-duration-fast, 150ms);
      --hax-ui-easing-move: var(
        --ddd-timing-emphasized,
        cubic-bezier(0.2, 0, 0, 1)
      );
      --hax-ui-landed: color-mix(
        in srgb,
        var(--hax-ui-accent-strong) 24%,
        transparent
      );
      /* promoted from the spec's proposed list (site admin, system
         settings, page history, rpg-character-builder, toast and Merlin
         each wrote these by hand before) */
      --hax-ui-sunken: light-dark(
        var(--ddd-theme-default-limestoneMaxLight, #f2f2f4),
        rgba(0, 0, 0, 0.22)
      );
      --hax-ui-titlebar: light-dark(
        var(--ddd-theme-default-coalyGray, #262626),
        var(--ddd-theme-default-potentialMidnight, #000321)
      );
      --hax-ui-on-titlebar: var(--ddd-theme-default-white, #ffffff);
      --hax-ui-primary: light-dark(
        var(--ddd-theme-default-nittanyNavy, #001e44),
        var(--ddd-theme-default-linkLight, #cce9ff)
      );
      --hax-ui-primary-hover: light-dark(
        var(--ddd-theme-default-beaverBlue, #1e407c),
        var(--ddd-theme-default-skyLight, #ccf0ff)
      );
      --hax-ui-on-primary: light-dark(
        var(--ddd-theme-default-white, #ffffff),
        var(--ddd-theme-default-potentialMidnight, #000321)
      );
      --hax-ui-success-soft: color-mix(
        in srgb,
        var(--hax-ui-success) 14%,
        transparent
      );
      --hax-ui-warning: light-dark(#8a5300, #ffcf80);
      --hax-ui-warning-soft: light-dark(
        var(--ddd-theme-default-warningLight, #fff4e5),
        rgba(255, 174, 0, 0.14)
      );
      --hax-ui-info: light-dark(
        var(--ddd-theme-default-info, #014361),
        var(--ddd-theme-default-infoLight, #e5f6fd)
      );
      --hax-ui-info-soft: light-dark(
        var(--ddd-theme-default-infoLight, #e5f6fd),
        color-mix(
          in srgb,
          var(--ddd-theme-default-skyBlue, #009cde) 14%,
          transparent
        )
      );
      --hax-ui-field-height: var(--ddd-textfield-height-sm, 40px);
      --hax-ui-titlebar-height: 48px;
      --hax-ui-action-bar-height: 56px;
      --hax-ui-rail-width: 192px;
      --hax-ui-rail-width-collapsed: 56px;
      /* accent text that sits on an accent tint (a badge on the selected
         row, an accent pill); see the clamp below */
      --hax-ui-accent-text: var(--hax-ui-accent);
    }
  `,
  /* A design system bridge remaps the DDD colors these tokens read, often
     to a lighter brand color (Carbon and Spectrum blues, a Web Awesome
     green, a Keepcase magenta) that holds 4.5:1 on white but not on a
     tint or a warm surface. In light mode each text color keeps its hue
     and chroma and is only darkened when it is lighter than oklch
     lightness 0.5 (about 4.5:1 on the admin surfaces); text on an accent
     tint is held to 0.45. The DDD values already sit under those, so DDD
     looks the same. The field edge is held to 0.6 (3:1). Browsers without
     relative color syntax keep the plain values above. */
  css`
    @supports (color: oklch(from red l c h)) {
      :host {
        --hax-ui-text-muted: light-dark(
          oklch(
            from var(--ddd-theme-default-slateGray, #314d64) min(l, 0.5) c h
          ),
          var(--ddd-theme-default-white65, rgba(255, 255, 255, 0.65))
        );
        /* a bridge sets --hax-ui-color-accent to its brand color, so the
           clamp reads it first */
        --hax-ui-accent: light-dark(
          oklch(
            from
              var(
                --hax-ui-color-accent,
                var(--ddd-theme-default-beaverBlue, #1e407c)
              )
              min(l, 0.5) c h
          ),
          var(--hax-ui-color-accent, var(--ddd-theme-default-skyLight, #ccf0ff))
        );
        --hax-ui-accent-strong: light-dark(
          oklch(from var(--ddd-theme-default-link, #005fa9) min(l, 0.5) c h),
          var(--ddd-theme-default-skyBlue, #009cde)
        );
        --hax-ui-accent-text: light-dark(
          oklch(
            from
              var(
                --hax-ui-color-accent,
                var(--ddd-theme-default-beaverBlue, #1e407c)
              )
              min(l, 0.45) c h
          ),
          var(--hax-ui-color-accent, var(--ddd-theme-default-skyLight, #ccf0ff))
        );
        --hax-ui-danger: light-dark(
          oklch(
            from var(--ddd-theme-default-original87Pink, #bc204b) min(l, 0.5) c
              h
          ),
          var(--ddd-theme-default-discoveryCoral, #f2665e)
        );
        --hax-ui-success: light-dark(
          oklch(
            from var(--ddd-theme-default-opportunityGreen, #008755) min(l, 0.5)
              c h
          ),
          var(--ddd-theme-default-creekLight, #cfeceb)
        );
        --hax-ui-info: light-dark(
          oklch(from var(--ddd-theme-default-info, #014361) min(l, 0.5) c h),
          var(--ddd-theme-default-infoLight, #e5f6fd)
        );
        --hax-ui-line-strong: light-dark(
          oklch(
            from
              color-mix(
                in srgb,
                var(--ddd-theme-default-slateGray, #314d64) 70%,
                var(--ddd-theme-default-white, #ffffff)
              )
              min(l, 0.6) c h
          ),
          color-mix(
            in srgb,
            var(--ddd-theme-default-white, #ffffff) 45%,
            transparent
          )
        );
      }
    }
  `,
  /* Held down: every button on a surface that takes these tokens shows the
     pressed overlay while it is pushed, so a push is confirmed before it is
     let go. :where() keeps this under any rule a control writes for its own
     held-down state (.hax-ui-btn, a selected segment), and above the
     all: unset resets local buttons start from. Never on a disabled
     button. simple-toolbar-button and simple-icon-button(-lite) carry the
     same look in their own styles. */
  css`
    :where(button, [role="button"], summary):active:not(
        [disabled],
        [aria-disabled="true"]
      ) {
      box-shadow: inset 0 0 0 999px var(--hax-ui-pressed);
    }
  `,
];
/**
 * Small pieces every admin surface repeats, built on HaxUiAdminTokens:
 * status pills, keyboard hints, visually hidden text and the focus ring.
 */
export const HaxUiAdminPrimitives = [
  css`
    .hax-ui-pill {
      display: inline-flex;
      align-items: center;
      flex: none;
      padding: 0 var(--hax-ui-gap-md);
      border-radius: var(--hax-ui-radius-pill);
      font-size: var(--hax-ui-admin-font-size-xs);
      font-weight: var(--ddd-font-weight-medium, 500);
      line-height: 1.5;
      white-space: nowrap;
      color: var(--hax-ui-text-muted);
      background-color: var(--hax-ui-hover);
    }
    /* tones: success (ok), warning, danger (error), info, accent, muted,
       soon and beta. Each pill also carries a word, so colour is never
       the only signal. */
    .hax-ui-pill[data-tone="success"],
    .hax-ui-pill[data-tone="ok"] {
      color: var(--hax-ui-success);
      background-color: transparent;
      box-shadow: inset 0 0 0 1px currentColor;
    }
    .hax-ui-pill[data-tone="warning"] {
      color: var(--hax-ui-warning);
      background-color: var(--hax-ui-warning-soft);
    }
    .hax-ui-pill[data-tone="danger"],
    .hax-ui-pill[data-tone="error"] {
      color: var(--hax-ui-danger);
      background-color: var(--hax-ui-danger-soft);
    }
    .hax-ui-pill[data-tone="info"] {
      color: var(--hax-ui-info);
      background-color: var(--hax-ui-info-soft);
    }
    /* secondary state, e.g. an older revision */
    .hax-ui-pill[data-tone="muted"] {
      color: var(--hax-ui-text-muted);
      background-color: transparent;
      box-shadow: inset 0 0 0 1px var(--hax-ui-line-strong);
    }
    .hax-ui-pill[data-tone="accent"] {
      color: var(--hax-ui-accent-text);
      background-color: var(--hax-ui-accent-soft);
    }
    /* not built yet: a dashed outline, as the dashboard's coming soon */
    .hax-ui-pill[data-tone="soon"] {
      color: var(--hax-ui-text-muted);
      background-color: transparent;
      box-shadow: inset 0 0 0 1px var(--hax-ui-line-strong);
    }
    /* works, still changing */
    .hax-ui-pill[data-tone="beta"] {
      color: var(--hax-ui-accent-text);
      background-color: transparent;
      box-shadow: inset 0 0 0 1px currentColor;
    }
    .hax-ui-kbd {
      font-family: var(--ddd-font-mono, monospace);
      font-size: var(--hax-ui-admin-font-size-xs);
      padding: 0 var(--hax-ui-gap);
      border: 1px solid var(--hax-ui-line);
      border-bottom-width: var(--hax-ui-focus-width);
      border-radius: var(--hax-ui-radius);
      color: var(--hax-ui-text);
      background-color: var(--hax-ui-surface);
    }
    .hax-ui-sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
      border: 0;
    }
  `,
];

/**
 * Follow the editor's HAX UI theme switch (--hax-ui-color-scheme, set on
 * body by hax-ui-styles) so light-dark() in an admin element agrees with
 * the --hax-ui-* colors; without it the element inherits as before.
 */
export const HaxUiAdminScheme = [
  css`
    :host {
      color-scheme: var(--hax-ui-color-scheme, inherit);
    }
  `,
];

/**
 * HAX UI dark chrome: the HAX UI theme tokens pinned to their dark values
 * (the same values hax-ui-styles uses for its dark theme), plus
 * color-scheme dark. Surfaces that must look the same in every theme wear
 * it: the site editor and app-hax top bars, the Merlin popover they open,
 * and toasts. The menus, fields and avatar frame inside them follow along.
 * A plain object for setting on an element's style from script.
 */
export const HAX_UI_DARK_CHROME = {
  "color-scheme": "dark",
  "--hax-ui-color-scheme": "dark",
  "--hax-ui-color": "var(--ddd-theme-default-white, #ffffff)",
  "--hax-ui-color-focus": "var(--ddd-theme-default-white, #ffffff)",
  "--hax-ui-color-faded": "#c5c3be",
  "--hax-ui-background-color": "var(--ddd-theme-default-coalyGray, #262626)",
  "--hax-ui-background-color-secondary": "#111",
  "--hax-ui-background-color-faded": "#222",
  "--hax-ui-color-accent": "#00c9ff",
  "--hax-ui-color-accent-secondary": "#00c9ff",
  "--hax-ui-background-color-accent": "#000",
  "--hax-ui-color-danger": "#ff8f8f",
  "--hax-ui-color-danger-secondary": "#ff2222",
  "--hax-ui-background-color-danger": "#000",
  "--hax-ui-border-color": "#000",
};

/**
 * HAX_UI_DARK_CHROME as declarations, to drop into a rule:
 * css`app-hax-top-bar { ${HaxUiDarkChromeDeclarations} }`.
 */
export const HaxUiDarkChromeDeclarations = unsafeCSS(
  Object.keys(HAX_UI_DARK_CHROME)
    .map((name) => `${name}: ${HAX_UI_DARK_CHROME[name]};`)
    .join("\n"),
);
