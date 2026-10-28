# HaxUiAdminActionBar

The bar at the foot of every admin section, owned by the shell, in one of three modes: `form`, `selection` or `none`.

Part of the HAX UI admin layer.

## Modes

| Mode | Left | Right | Used by |
|---|---|---|---|
| `form` | Status: "No unsaved changes", or the count and changed field names | Discard (ghost), Save (primary) | Details, SEO, Features, Editor, Blocks, Appearance, Structure |
| `selection` | "N selected", Clear | The section's bulk actions | Files, Content (replace) |
| `none` | | | About, Reports, Views, Import / Export |

## Rules

- **Staged save.** Edits wait until Save. Save is quiet (outlined, muted) until there is a change, then takes the primary fill. Changed fields carry a dot, and the status names them.
- **Leaving asks first.** With unsaved changes, every way out (rail, breadcrumb, close, Esc, browser back) shows the prompt: Stay, Discard and leave, Save and leave.
- **One primary per bar.** Destructive steps that open a confirm are a danger outline ending in "…"; only the final, irreversible commit is a danger fill, and it names its scope ("Replace 7 matches").
- **Status is a live region.** Failures use `role="alert"` and keep the person's edits.
- **No auto-save yet.** When it comes, the status line shows its progress.

## Tokens

`--hax-ui-line`, `--hax-ui-text-muted`, `--hax-ui-accent-strong`, `--hax-ui-danger`, `--hax-ui-focus`, `--hax-ui-radius`. Proposed: `--hax-ui-primary`, `--hax-ui-on-primary`, `--hax-ui-action-bar-height` (56px).
