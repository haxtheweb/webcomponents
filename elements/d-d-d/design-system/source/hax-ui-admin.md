# HAX UI: admin surfaces

HAX UI is DDD's layer for the screens people use to manage a site, never what visitors read. Content uses DDD's content scale: 20px body text, 48px fields and generous spacing. Admin surfaces are denser and quieter, with 14px text, 32px rows and one accent, so long lists and many settings fit and the content stays the loudest thing on screen. Every HAX UI value is a DDD value; nothing here adds a colour DDD does not already have.

outline-designer is the reference implementation ([haxtheweb/issues#3180](https://github.com/haxtheweb/issues/issues/3180)). Site admin is moving to it next, then system admin.

## When to apply it

Use one test: **if a visitor to the published site can see it, it is content and uses DDD. If only a signed-in editor sees it and its job is to change settings or data, it is admin and uses HAX UI.**

| Surface | Layer |
|---|---|
| Site admin: the Site settings dialog and every section in it | HAX UI (now) |
| Structure / outline-designer, revisions, reports | HAX UI (now) |
| System admin: the HAXcms dashboard and app-hax admin areas | HAX UI (after site admin) |
| Editor chrome: top bar, tray, the element settings panel | HAX UI (adopting with the editing update) |
| Any element whose job is managing records: tables of data, bulk actions, settings forms | HAX UI |
| Authored content, HAX blocks, `data-*` authoring attributes | DDD content |
| Themes, site menus, footers, anything a visitor sees | DDD content |
| Content-level elements such as `grid-plate` | DDD defaults with fallbacks, never HAX UI |

An admin element can render content (a preview, a thumbnail of a block). The preview keeps DDD content styling; the chrome around it uses HAX UI.

## How it works

The layer is two style arrays in `@haxtheweb/hax-body/lib/hax-ui-styles.js`:

- **`HaxUiAdminTokens`** sets the `--hax-ui-*` custom properties on `:host`. Each one maps to a DDD primitive as a `light-dark()` pair. Surface, text and accent defer to the editor's HAX UI theme (`--hax-ui-background-color`, `--hax-ui-color`, `--hax-ui-color-accent`), so the editor's light and dark switch still applies.
- **`HaxUiAdminPrimitives`** holds the small pieces every admin surface repeats: `.hax-ui-pill` with `data-tone="accent|success|danger"`, `.hax-ui-kbd`, `.hax-ui-sr-only` and `.hax-ui-focus-ring`.

```js
import {
  HaxUiAdminTokens,
  HaxUiAdminPrimitives,
} from "@haxtheweb/hax-body/lib/hax-ui-styles.js";

static get styles() {
  return [
    ...HaxUiAdminTokens,
    ...HaxUiAdminPrimitives,
    css`
      :host {
        font-family: var(--hax-ui-admin-font-family);
        font-size: var(--hax-ui-admin-font-size);
        color: var(--hax-ui-text);
      }
    `,
  ];
}
```

Rules:

- Style admin chrome with `--hax-ui-*` only. No raw hex, no `--ddd-font-size-*` content sizes, no SimpleColors.
- A need the layer lacks is added to `HaxUiAdminTokens` first, mapped to a DDD primitive, then used. Never invent a one-off value in an element.
- A page can override any token on the element from outside, so admin elements stay themeable.

## Tokens

### In code today (`HaxUiAdminTokens`)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--hax-ui-surface` | white | coalyGray | Panel and dialog background |
| `--hax-ui-text` | coalyGray | white | Body text, row labels |
| `--hax-ui-text-muted` | slateGray | white65 | Help text, counts, secondary labels |
| `--hax-ui-line` | limestoneLight | white 18% | Row dividers, panel edges |
| `--hax-ui-line-strong` | limestoneGray | white 40% | Control borders, connector lines |
| `--hax-ui-hover` | limestoneMaxLight | white 8% | Row and control hover |
| `--hax-ui-content-group` | limestoneMaxLight 55% | white 4% | Rows that belong to the row above |
| `--hax-ui-accent` | beaverBlue | skyLight | Accent text and icons |
| `--hax-ui-accent-strong` | link | skyBlue | Current marker, switches, drop line |
| `--hax-ui-accent-soft` | accent-strong 12% | accent-strong 12% | Pressed segment, set filter, changed row |
| `--hax-ui-selected` | accent-strong 18% | accent-strong 18% | Selected rows, current rail item |
| `--hax-ui-on-accent` | white | potentialMidnight | Text on an accent fill |
| `--hax-ui-danger` / `-soft` | original87Pink | discoveryCoral | Destructive actions, rows marked for deletion |
| `--hax-ui-success` | opportunityGreen | creekLight | Success pills and saved state |
| `--hax-ui-focus` | link | keystoneYellow | Focus rings |
| `--hax-ui-drop`, `--hax-ui-landed` | accent-strong, 24% | | Drag-and-drop targets, landing highlight |
| `--hax-ui-row-height` | 32px (`compact` 28, `roomy` 40) | | Rows and toolbar controls |
| `--hax-ui-target` | 24px | | Smallest hit area (WCAG 2.5.8) |
| `--hax-ui-gap`, `-md`, `-lg` | 4, 8, 12px | | Spacing inside admin chrome |
| `--hax-ui-icon` | 16px | | Icons beside words |
| `--hax-ui-radius`, `-lg`, `-pill` | 4, 8px, rounded | | Controls, panels, pills |
| `--hax-ui-admin-font-size`, `-xs` | 14, 12px | | Body text, small labels |
| `--hax-ui-duration`, `--hax-ui-easing` | 150ms, ease | | Hover and state changes |

### Proposed, not in code yet

These come from the site admin redesign and stay proposals until the editing update and the element settings panel can shape them too. Until then a component writes the DDD value directly and leaves a comment naming the proposed token.

| Proposed token | Light | Dark | Use |
|---|---|---|---|
| `--hax-ui-sunken` | limestoneMaxLight | black 22% | Section rail, side panels |
| `--hax-ui-titlebar` | coalyGray | potentialMidnight | Dialog titlebar |
| `--hax-ui-primary` / `-hover` | nittanyNavy / beaverBlue | linkLight / skyLight | The one primary action per bar |
| `--hax-ui-on-primary` | white | potentialMidnight | Text on the primary fill |
| `--hax-ui-warning` / `-soft` | warning on warningLight | warningLight on amber 14% | Caution callouts and field messages |
| `--hax-ui-info` / `-soft` | info on infoLight | infoLight on skyBlue 14% | Neutral callouts |
| `--hax-ui-field-height` | 40px | | Form inputs (DDD textfield `sm`) |
| `--hax-ui-titlebar-height` | 48px | | Dialog titlebar |
| `--hax-ui-action-bar-height` | 56px | | Action bar |
| `--hax-ui-rail-width` | 192px | | Section rail |

## Patterns

### One admin dialog

Every admin section opens inside the same dialog. From top to bottom: titlebar (breadcrumb, Esc, close), then the section rail on the left beside the page header, the toolbar, the section body and the action bar. The launcher (the Site settings home) and the rail list the same sections in the same order, from one registry, and hide what Features turns off. A section supplies only its body and tells the shell whether it has unsaved changes; it never draws its own titlebar or Save button.

### Action bar and staged save

The shell owns the action bar. A section picks one mode.

| Mode | Left | Right |
|---|---|---|
| `form` | "No unsaved changes", or "2 unsaved changes" and the field names | Discard (ghost), Save (primary) |
| `selection` | "3 selected", Clear | The section's bulk actions; a destructive one is a danger outline ending in "…" |
| `none` | | |

- Save stays quiet until something changes, then becomes the primary fill. Changed fields carry a dot beside their label, and the count says how many.
- Leaving with unsaved changes asks first, whichever way the person leaves: rail, breadcrumb, close button, Esc or browser back. The prompt offers Stay, Discard and leave, and Save and leave.
- A commit that cannot be undone (bulk replace, delete) uses a danger fill and names its scope ("Replace 7 matches").
- Auto-save is planned, not current: when it comes, the status line shows its progress and the buttons go.

### Controls

- **Buttons** are 32px with words beside icons. One primary per bar. Secondary is outlined, ghost has no border, danger is an outline for a step that opens a confirm and a fill only for the final commit. An icon-only button carries `aria-label` and a tooltip.
- **Segmented controls** switch a view or mode, using `aria-pressed`; the pressed segment is `--hax-ui-accent-soft` and bold.
- **Filter chips**: dashed and muted when unset ("+ Tags"), solid with an accent wash when set ("Status: Draft ×").
- **Switches** (`role="switch"`) change a setting; checkboxes select rows.
- **Pills** state status in a word (`.hax-ui-pill` with a tone). Colour never carries meaning alone.
- **Keyboard hints** use `.hax-ui-kbd`.

### Rows

Lists, tables and trees share one set of row states, from outline-designer:

| State | Treatment |
|---|---|
| Hover | `--hax-ui-hover` |
| Selected | `--hax-ui-selected` |
| Current or inspected | inset 3px `--hax-ui-accent-strong` on the left |
| Keyboard focus | inset `--hax-ui-focus` outline, `--hax-ui-focus-width` |
| Changed, not saved | `--hax-ui-accent-soft` and a dot |
| Drop target | `--hax-ui-accent-soft` and a dashed `--hax-ui-drop` outline |
| Will be deleted on save | `--hax-ui-danger-soft` stripes and struck-through label |

Rows are 32px in trees, 36 to 40px in tables, with a 32px sticky header row in muted 12px text.

### Field rows

A setting is one row: label (bold) and one line of help on the left in a 240px column, the control on the right at most 480px wide. Inputs are 40px. A message under the control pairs a word with its colour: warning on warning-soft for "recommended", danger on danger-soft for an error. Collapsed groups of fields follow the `contract-admin-fieldset` internal contract.

### Callouts and empty states

Callouts are a single line with an icon on the warning or info pair, used for consequences people must know before acting ("This bulk replacement cannot be undone"). An empty state centres an icon, a bold line, one line of help and one action ("Clear filters").

### Density and motion

Rows offer compact, default and roomy densities through `--hax-ui-row-height-*`. Most admin users work with a mouse, so feedback stays brief: 150ms state changes, no bounce, no motion on hover beyond colour. Respect `prefers-reduced-motion`.

## Accessibility

- Text meets 4.5:1 and controls 3:1 in both themes; every pairing above is checked in light and dark.
- Focus is always visible (`--hax-ui-focus`, yellow in dark), and `forced-colors` falls back to `Highlight`.
- The rail is a `nav` with `aria-current` on the open section. The action bar status is a live region. The leave prompt is an `alertdialog`.
- Closing the dialog returns focus to what opened it.
- Status is never colour alone: changed fields have a dot and a count, pills have words.

## Checklist for an admin surface

1. Apply the test above. If it is admin, use HAX UI.
2. Spread `HaxUiAdminTokens` and `HaxUiAdminPrimitives` and style with `--hax-ui-*` only.
3. In site or system admin, build a section for the shell: no titlebar, no Save button, report unsaved changes.
4. Reuse the controls, rows, field rows and action bar modes above before inventing anything.
5. Check light, dark and forced colours, keyboard-only use, and widths down to 360px.
6. Run `hax-pattern-library-audit` on the element; it grades the `contract-admin-*` internal contracts.
