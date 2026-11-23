# Stacking order

How HAX decides what sits on top of what. `z-index` only matters when two things overlap, so a wrong value is invisible until a modal, a toast and a tooltip meet on one page. These rules keep that meeting predictable.

## The layers

Lowest to highest. Each layer sits above every layer before it (`test/ddd-z-index.test.js` checks this).

| Token              | Value     | What goes on it                                                                                                                     |
| ------------------ | --------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `--ddd-z-base`     | 0         | Page content.                                                                                                                       |
| `--ddd-z-dropdown` | 100       | A menu or list that drops from its trigger: select lists, action menus, autocomplete.                                               |
| `--ddd-z-sticky`   | 200       | Something that stays put while the page scrolls under it: sticky headers, pinned bars.                                              |
| `--ddd-z-overlay`  | 300       | A scrim or veil that dims the page behind something else.                                                                           |
| `--ddd-z-modal`    | 10000     | Anything that takes the page over until it is dismissed: dialogs, full-screen presenting, the HAXcms editor bar.                    |
| `--ddd-z-tooltip`  | 10100     | Tooltips and popovers. Above modals, so a tooltip opened inside a dialog is visible.                                                |
| `--ddd-z-toast`    | 100000000 | Always on top: toasts, and the system UI that has to stay reachable beside them (Merlin, the HAX admin dialog, the docked top bar). |

## Rules

1. **Choose the layer by what the element is, not by its number.** A back-to-top button that happens to use `10000` is not a modal. Matching by value re-labels it, and the next change to the scale moves it somewhere it never belonged.
2. **Keep the literal as the fallback.** Write `z-index: var(--ddd-z-modal, 10000)`. A page without DDD then stacks exactly as it does with it.
3. **Order inside a layer is an offset from the layer.** When several things on one layer overlap in a fixed order, write the order down: `z-index: calc(var(--ddd-z-toast, 100000000) + 2)`. Never give two things that must not tie the same bare token.
4. **Stacking inside one component stays a plain number.** `1`, `2`, `-1`, `10` on a badge, a handle or a pseudo-element only order siblings inside that component's own stacking context. A token there adds indirection and no meaning.
5. **A z-index a script reads stays a plain number.** `--simple-modal-z-index` is read with `getPropertyValue()` and turned into a `Number` (`simple-modal-template`, `app-hax`). A custom property keeps `calc(...)` as text, so a token there would read as `NaN`. Set it to the number the layer resolves to.
6. **Nothing is gained above 2147483647.** Browsers clamp `z-index` to a 32-bit integer, so every larger value is the same value.

## Order inside the always-on-top layer

These overlap each other in the editor, so their order is part of the contract.

| Offset | Value     | What                                                                                                 |
| ------ | --------- | ---------------------------------------------------------------------------------------------------- |
| `+ 0`  | 100000000 | Dialogs opened over the editor (`--simple-modal-z-index` set from script), Merlin's matrix backdrop. |
| `+ 1`  | 100000001 | The HAX admin dialog (`simple-modal[mode="hax-ui"]`).                                                |
| `+ 2`  | 100000002 | The top bar while the admin dialog is docked under it, Merlin (super-daemon), HAL.                   |
| `+ 3`  | 100000003 | Merlin's toast (`super-daemon-toast`).                                                               |
| `+ 4`  | 100000004 | The system toast (`haxcms-toast`, which `app-hax-toast` reuses).                                     |

## Order inside the modal layer

| Offset         | Value          | What                                                                                                                |
| -------------- | -------------- | ------------------------------------------------------------------------------------------------------------------- |
| `- 2`          | 9998           | The theme preview panel.                                                                                            |
| `- 1`          | 9999           | The editor bar in edit mode, the media player raised over its transcript, decorations that fly over the page.       |
| `+ 0`          | 10000          | The HAXcms editor bar, theme headers built on `HAXCMSLitElementTheme`, a presenting diagram, full-screen takeovers. |
| `+ 1`          | 10001          | The network bar above the editor bar; windows inside a takeover.                                                    |
| `+ 2` to `+ 4` | 10002 to 10004 | Ordered pieces inside a takeover (speech bubble, menu and score, win screen).                                       |

## Where each element sits today

On a token:

- `--ddd-z-dropdown`: outline-designer (item operations menu), simple-picker (list).
- `--ddd-z-sticky`: my-learning-button.
- `--ddd-z-modal`: haxcms-site-editor-ui (the bar), HAXCMSLitElementTheme, haxcms-json-theme, haxcms-print-theme, QRCodeMixin, mermaid-diagram (presenting), haxcms-cheat-codes (takeovers, with offsets), hax-network-bar (`+ 1`).
- `--ddd-z-tooltip`: simple-tooltip, a11y-media-button (its tooltip).
- `--ddd-z-toast`: haxcms-cheat-codes (matrix backdrop), hax-ui-styles (`+ 1`), app-hax and haxcms-site-editor-ui docked bar and hal-9000 (`+ 2`), super-daemon-toast (`+ 3`), haxcms-toast (`+ 4`).

Still a literal, with the role each one plays:

| Value              | Element                                                                                                                                                                                                    | Role                               |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| 100                | haxor-slevin, journey-theme (topbar)                                                                                                                                                                       | Header and fixed bars.             |
| 100                | map-menu (`is-flex`), haxcms-site-editor (edit button)                                                                                                                                                     | Raised above neighbouring content. |
| 200                | a11y-carousel, lrndesign-timeline                                                                                                                                                                          | Inside the component.              |
| 900 to 999         | haxcms-tracking-lens, haxcms-site-editor-ui (preview stage)                                                                                                                                                | Panels under the editor bar.       |
| 1000               | site-top-menu, site-outline-block, site-dot-indicator, glossy-portfolio-theme, haxcms-json-theme, reading-analysis (pinned bar), simple-blog (back button), journey-theme (scroll button), app-hax-top-bar | Sticky and fixed chrome.           |
| 1000               | app-hax (design browser, site creation dialog, file drop veil), learn-two-theme (drawer), ecosystem-web (presenting), hax-view-source (preview), hax-palette-picker (peek), hax-style-switcher             | Dialogs, drawers and panels.       |
| 1000               | app-hax-use-case-filter (sort menu), app-hax-user-menu                                                                                                                                                     | Dropdown menus.                    |
| 1000               | multiple-choice (confetti), hax-body (loader), haxcms-site-builder (progress), reading-analysis (drag ghost), outline-designer (close button), learn-two-theme (git corner)                                | Decoration and feedback.           |
| 1001               | hax-body (`--hax-ui-focus-z-index`)                                                                                                                                                                        | The editor tray.                   |
| 10000              | chamfer-theme, polaris-theme, polaris-flex-theme, polaris-invent-theme, journey-theme, ddd-brochure-theme                                                                                                  | Back-to-top button.                |
| 10000              | hax-map (drag ghost), DDD `data-pulse`, portal-launcher                                                                                                                                                    | Feedback and transitions.          |
| 100000             | simple-fields-array-item                                                                                                                                                                                   | Focused row above its siblings.    |
| 100001             | UXStudyRecorder                                                                                                                                                                                            | Recorder panel.                    |
| 999999 and 1000000 | site-drawer, learn-two-theme, outline-player                                                                                                                                                               | Drawer scrim and drawer.           |
| 999999             | a11y-media-player (`sticky-mode`)                                                                                                                                                                          | Player pinned to the corner.       |
| 10000000           | editable-table (focused row or column), haxcms-basic-theme (scroll button), `base.css` (`--simple-modal-z-index`, `--simple-toast-z-index`)                                                                | Site-level defaults.               |
| above 2147483647   | a11y-details, absolute-position-behavior, haxcms-goggles                                                                                                                                                   | Clamped to the top of the range.   |
