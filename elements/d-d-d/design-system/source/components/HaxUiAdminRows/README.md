# HaxUiAdminRows

The row states every admin list, table and tree shares, taken from outline-designer: hover, selected, current, focus, changed, drop target and marked for deletion.

Part of the HAX UI admin layer.

## States

| State | Treatment | Notes |
|---|---|---|
| Hover | `--hax-ui-hover` | |
| Selected | `--hax-ui-selected` | Paired with a checked checkbox |
| Current / inspected | inset 3px `--hax-ui-accent-strong` on the left | The page being edited, the file in the side panel, the open rail item |
| Keyboard focus | inset `--hax-ui-focus-width` outline in `--hax-ui-focus` | Never removed; `forced-colors` uses `Highlight` |
| Changed, not saved | `--hax-ui-accent-soft` and a dot | The dot carries `aria-label="changed"` |
| Drop target | `--hax-ui-accent-soft` and a dashed `--hax-ui-drop` outline | Drag and drop, as outline-designer draws it |
| Will be deleted on save | `--hax-ui-danger-soft` stripes, struck-through label | Staged until Save |

## Sizes

Rows are `--hax-ui-row-height` (32px) in trees and 36 to 40px in tables, with a 32px sticky header row in 12px muted text. Compact and roomy densities use `--hax-ui-row-height-compact` and `--hax-ui-row-height-roomy`.
