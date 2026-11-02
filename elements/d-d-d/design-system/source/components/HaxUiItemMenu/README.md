# HaxUiItemMenu

The item menu: the actions for one item, opened over the item. It is `simple-context-menu`, which draws this design itself, so outline-designer's page menu, the site menu's page operations, the admin lists' row menus, page-break and app-hax all look and work the same without styles of their own.

Part of the HAX UI admin layer.

## Opening it

| Input    | How                                                                 |
| -------- | ------------------------------------------------------------------- |
| Mouse    | Right click the item, or its ⋯ button                               |
| Touch    | Long press the item, or tap ⋯                                       |
| Keyboard | <kbd>Shift</kbd>+<kbd>F10</kbd> or the menu key on the focused item |

A pointer opens it where it was pressed; the keyboard and ⋯ open it under the item. Opening focuses the first item. <kbd>↑</kbd> <kbd>↓</kbd> <kbd>Home</kbd> <kbd>End</kbd> and <kbd>Tab</kbd> move, <kbd>Enter</kbd> and <kbd>Space</kbd> run, <kbd>Esc</kbd> closes and focus goes back to the item.

## Anatomy

| Part      | Design                                                                                                                            |
| --------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Panel     | `--hax-ui-surface`, 1px `--hax-ui-line-strong`, `--hax-ui-radius-lg`, `--hax-ui-shadow-popover`, 4px padding, at least 200px wide |
| Header    | Optional. 11px bold uppercase, `--hax-ui-text-muted`, like a group title                                                          |
| Item      | 32px (`--hax-ui-row-height`), 16px icon, label from the left, 8px gap, `--hax-ui-radius`; hover `--hax-ui-hover`                  |
| Focus     | 2px `--hax-ui-focus` ring inside the row, shown when the menu is used from the keyboard                                           |
| Disabled  | `--hax-ui-text-muted`, no hover                                                                                                   |
| Danger    | `class="danger"`: `--hax-ui-danger`, hover `--hax-ui-danger-soft`. Last, after a separator                                        |
| Separator | An `hr` in the menu: 1px `--hax-ui-line`, 4px above and below                                                                     |
| Shortcut  | Optional. `data-shortcut="F2"` on an item shows the keys at the right of the row in the mono face                                 |

## Content rules

- The item's own actions first (Open, History), then the action bar's actions for it, then danger.
- Every item runs the same code as the control it mirrors; the menu is another way in, never another behavior.
- Labels are verbs. An item that asks for more ends in "…" (Rename…, Delete…).

## Accessibility

The menu is a `role="menu"` named from its title; items are `menuitem` and separators `separator`, unless an item sets its own role (`menuitemcheckbox`). The visible header is hidden from assistive technology, since the menu already carries the name. It opens as a modal dialog, so focus stays in it until it closes.

## Usage

```html
<simple-context-menu title="Page actions">
  <simple-toolbar-button
    icon="hax:admin-edit"
    label="Rename…"
    show-text-label
    data-shortcut="F2"
  ></simple-toolbar-button>
  <simple-toolbar-button
    icon="hax:admin-copy"
    label="Duplicate"
    show-text-label
  ></simple-toolbar-button>
  <hr />
  <simple-toolbar-button
    class="danger"
    icon="hax:admin-delete"
    label="Delete…"
    show-text-label
  ></simple-toolbar-button>
</simple-context-menu>
```

## Tokens

`--hax-ui-surface`, `--hax-ui-text`, `--hax-ui-text-muted`, `--hax-ui-line`, `--hax-ui-line-strong`, `--hax-ui-hover`, `--hax-ui-focus`, `--hax-ui-focus-width`, `--hax-ui-danger`, `--hax-ui-danger-soft`, `--hax-ui-row-height`, `--hax-ui-icon`, `--hax-ui-radius`, `--hax-ui-radius-lg`, `--hax-ui-shadow-popover`.
