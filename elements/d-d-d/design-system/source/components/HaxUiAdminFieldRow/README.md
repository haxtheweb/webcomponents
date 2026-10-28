# HaxUiAdminFieldRow

One setting per row: a bold label and one line of help on the left, the control on the right, with a changed dot and an inline message when needed. Callouts and empty states are on the same card.

Part of the HAX UI admin layer.

## Field rows

- Label column 240px in a full-width section (narrower in tight panels), control column up to 480px. Rows divide with `--hax-ui-line`.
- Inputs and selects are 40px (DDD textfield `sm`, proposed `--hax-ui-field-height`), 14px text in `--ddd-font-primary`.
- A changed, unsaved field shows a `--hax-ui-accent-strong` dot before its label (`aria-label="changed"`); the action bar counts them.
- A message under the control pairs a word with its colour: warning on warning-soft for a recommendation, `--hax-ui-danger` on danger-soft for an error, linked with `aria-describedby`, and errors also set `aria-invalid`.
- Collapsed groups of fields follow the `contract-admin-fieldset` internal contract: a 32px bold 14px heading row, these field rows inside. Admin UI deliberately does not mirror the DDD content scale.

## Callouts

One line, an icon and plain words, on the warning or info pair. Use them for consequences people must know before they act ("This bulk replacement cannot be undone"), not for decoration.

## Empty states

Centred icon, a bold line, one line of help and one action ("Clear filters"), inside a dashed `--hax-ui-line-strong` box.

## Tokens

`--hax-ui-line`, `--hax-ui-line-strong`, `--hax-ui-text-muted`, `--hax-ui-accent-strong`, `--hax-ui-danger`, `--hax-ui-focus`, `--hax-ui-radius`, `--hax-ui-radius-lg`. Proposed: `--hax-ui-warning`, `--hax-ui-warning-soft`, `--hax-ui-info`, `--hax-ui-info-soft`, `--hax-ui-field-height`.
