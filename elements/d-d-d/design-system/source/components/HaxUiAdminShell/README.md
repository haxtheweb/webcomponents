# HaxUiAdminShell

The one dialog every admin section opens in: titlebar with breadcrumb, a section rail, page header, optional toolbar, the section body and an action bar the shell owns.

Part of the HAX UI admin layer (see the HAX UI section of this system). Use it for site admin now and system admin next; never for content a visitor sees.

## Anatomy

| Part | Height | Owner | Notes |
|---|---|---|---|
| Titlebar | 48px | shell (`simple-modal` titlebar) | Breadcrumb from the route, Esc closes, close asks first when there are unsaved changes |
| Section rail | full height, 192px wide | shell | Same list and order as the launcher, from one registry; Features-disabled sections hidden; icons only under 1080px, a menu under 768px |
| Page header | auto | shell | Title, one line of help, optional header actions |
| Toolbar | 32px controls | section | Only when the section has search, filters or view switches |
| Body | rest | section | The section element; loads and saves as it always has |
| Action bar | 56px | shell | `form`, `selection` or `none` (see HaxUiAdminActionBar) |

## What a section provides

- Its body element and, in the registry, its route, group, icon, Features key and action bar mode.
- A `haxcms-admin-section-state` event whenever staged values change: `{ dirty, changes, canSave }`.
- `save()` (runs its existing save, firing the same `haxcms-save-*` event) and `discard()`.
- For `selection` mode, its bulk actions in `slot="actions"`.

A section never renders its own titlebar or Save button.

## Tokens

`--hax-ui-surface`, `--hax-ui-text`, `--hax-ui-text-muted`, `--hax-ui-line`, `--hax-ui-line-strong`, `--hax-ui-hover`, `--hax-ui-selected`, `--hax-ui-accent-strong`, `--hax-ui-focus`. Proposed: `--hax-ui-titlebar`, `--hax-ui-sunken`, `--hax-ui-primary`, `--hax-ui-rail-width`, `--hax-ui-titlebar-height`, `--hax-ui-action-bar-height`.
