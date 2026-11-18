# wysiwyg96-theme

**WYSIWYG 96** is a HAXcms theme in homage to the first WYSIWYG web editors of 1995-96, built on its own DDD-capable design system, **Classic Desktop**. The site is drawn as two windows on a desktop:

- **Explorer** holds the site outline (`site-menu`).
- **The page window** has a title bar naming the page's file, a menu bar of the site's top pages (`site-top-menu`), a toolbar of site actions (Explorer, previous and next page, print, search, View HTML, High Contrast), a Location field, the page on the classic gray canvas, and a status bar (state, last updated, page N of M).

The windows behave like windows:

| Control | What it does |
| --- | --- |
| Bar button (left of a title) | Rolls the window up to its title bar, and back down |
| Down arrow | Minimizes: Explorer goes back to the toolbar's Explorer button, the page window becomes an icon on the desktop that restores it |
| Up arrow (page window) | Maximizes the page window over the desktop, and restores it |
| View HTML | Opens the page source, as saved (Original) or as the browser draws it now (Generated). Drag its title bar to move it, or focus the title bar and use the arrow keys (Shift for bigger steps); it stays on screen |
| High Contrast | The site's dark mode, drawn as a high contrast black scheme |

Going to another page always shows it, whatever state its window was left in, and edit mode does the same.

## Classic Desktop

Classic Desktop is a DDD bridge with a local source (`design-system/classic-desktop.tokens.json`), like Keepcase in `vhs-blog-theme`, but listed in `designSystems.json`, so any theme that takes a design system can use it. It maps every named DDD color to the 20 static colors of the classic system palette (the 16 VGA colors plus money green, sky blue, cream and medium gray), sets every corner square, turns DDD elevation into two-tone bevels and focus into a dotted ring, and uses system font stacks only, so nothing is downloaded. A few colors that DDD uses as text move to keep contrast on silver: muted text (`slateGray`) and `success` take a darker gray and green than the palette has, `original87Pink` takes the palette purple instead of fuchsia, and `creekTeal`, which DDD pairs with dark text, is aqua (the theme still draws its desktop in teal).

It also carries a **HAX UI skin** (`lib/ClassicDesktopHaxUiSkin.js`): while the system is active, the editor's top bar is a navy title bar, and the tray, menus and dialogs are classic gray windows, with the high contrast black scheme in dark mode. The top bar sets its own chrome tokens on itself, so the skin answers them through its existing `top-bar` part. Labels, menus, shortcuts and every editing capability stay as they are.

The theme says `acceptsDesignSystems` (its chrome reads only `--ddd-*` tokens) and `defaultDesignSystem: "classic-desktop"`, so a site starts on Classic Desktop and can pick any other system in Appearance settings.

| File | What it is |
| --- | --- |
| `design-system/classic-desktop.tokens.json` | The tokens, as DTCG |
| `design-system/bridge.json` | Each DDD token → Classic Desktop token |
| `lib/ClassicDesktopTokens.js` | Generated: the tokens as custom properties |
| `lib/ClassicDesktopDDDMap.js` | Generated: the `--ddd-*` → Classic Desktop remap and the color picker names |
| `lib/classic-desktop.ddd-map.json` | Generated: the full map, coverage per contract tier and the contrast report |
| `lib/ClassicDesktopHaxUiSkin.js` | The HAX UI skin |
| `lib/ClassicDesktopDesignSystem.js` | Registers and activates the `classic-desktop` design system |
| `wysiwyg96-theme.js` | The theme |

## Coverage

Checked against the shared [bridge contract](../d-d-d/design-system/bridge/README.md): identity 92% (every named color, fonts, radius, shadows, focus), feel 13% (motion is instant: the classic desktop did not animate), component 63% (square cards, controls and tags; cards are raised panels), structure locked. Kept as DDD on purpose: font weights, state opacities, control heights, border widths and heading/body sizes.

## Rebuilding the tokens

```
yarn ddd:bridge elements/wysiwyg96-theme          # from the monorepo root
yarn ddd:bridge elements/wysiwyg96-theme --check  # fail if the generated files are stale
```

## Attribution

An independent homage to the look of mid-1990s desktop software and early visual web editors, not affiliated with or endorsed by Microsoft. FrontPage is named only in the demo's history page.
