# HaxUiAdminControls

The controls admin surfaces share: 32px buttons with words beside icons, segmented controls, filter chips, switches, status pills and keyboard hints.

Part of the HAX UI admin layer. Pills and keyboard hints already ship as `HaxUiAdminPrimitives` (`.hax-ui-pill`, `.hax-ui-kbd`); the rest are patterns each admin element styles with `--hax-ui-*`.

## Rules

- **Buttons** are `--hax-ui-row-height` (32px) tall, 13px, words beside a 16px icon. One primary per bar. Secondary is outlined with `--hax-ui-line-strong`, ghost has no border. A destructive step that opens a confirm is a `--hax-ui-danger` outline ending in "…"; only the final commit is a danger fill.
- **Icon-only buttons** carry `aria-label` and a tooltip, and are still 32px square.
- **Segmented controls** switch a mode or view with `aria-pressed`; the pressed segment is `--hax-ui-accent-soft` and bold.
- **Filter chips**: dashed and muted when unset ("+ Tags"), solid with `--hax-ui-accent-soft` when set, ending in "×".
- **Switches** use `role="switch"` and `aria-checked` and change a setting; checkboxes select rows.
- **Pills** say status in a word, toned `accent`, `success` or `danger`; never colour alone.
- **Focus** is `--hax-ui-focus-width` solid `--hax-ui-focus` at a 2px offset on every control.

## Tokens

`--hax-ui-row-height`, `--hax-ui-line-strong`, `--hax-ui-hover`, `--hax-ui-accent`, `--hax-ui-accent-soft`, `--hax-ui-accent-strong`, `--hax-ui-success`, `--hax-ui-danger`, `--hax-ui-focus`, `--hax-ui-radius`, `--hax-ui-radius-pill`. Proposed: `--hax-ui-primary`, `--hax-ui-primary-hover`, `--hax-ui-on-primary`.
