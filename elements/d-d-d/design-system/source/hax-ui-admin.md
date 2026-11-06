# HAX UI: admin surfaces

HAX UI is DDD's layer for the screens people use to manage a site, never what visitors read. Content uses DDD's content scale: 20px body text, 48px fields and generous spacing. Admin surfaces are denser and quieter, with 14px text, 32px rows and one accent, so long lists and many settings fit and the content stays the loudest thing on screen. Every HAX UI value is a DDD value; nothing here adds a colour DDD does not already have.

outline-designer is the reference implementation ([haxtheweb/issues#3180](https://github.com/haxtheweb/issues/issues/3180)). Site admin is moving to it next, then system admin.

## When to apply it

Use one test: **if a visitor to the published site can see it, it is content and uses DDD. If only a signed-in editor sees it and its job is to change settings or data, it is admin and uses HAX UI.**

| Surface                                                                                 | Layer                                     |
| --------------------------------------------------------------------------------------- | ----------------------------------------- |
| Site admin: the Site settings dialog and every section in it                            | HAX UI (now)                              |
| Structure / outline-designer, revisions, reports                                        | HAX UI (now)                              |
| System admin: the HAXcms dashboard and app-hax admin areas                              | HAX UI (after site admin)                 |
| Editor chrome: top bar, tray, the element settings panel                                | HAX UI (adopting with the editing update) |
| Any element whose job is managing records: tables of data, bulk actions, settings forms | HAX UI                                    |
| Authored content, HAX blocks, `data-*` authoring attributes                             | DDD content                               |
| Themes, site menus, footers, anything a visitor sees                                    | DDD content                               |
| Content-level elements such as `grid-plate`                                             | DDD defaults with fallbacks, never HAX UI |

An admin element can render content (a preview, a thumbnail of a block). The preview keeps DDD content styling; the chrome around it uses HAX UI.

## How it works

The layer's entry point is `@haxtheweb/d-d-d/lib/HaxUiAdminStyles.js`, which re-exports every piece. The pieces live in small modules beside it, so an element that needs only part of the layer imports just that part: `HaxUiAdminTokens.js` (`HaxUiAdminTokens`, `HaxUiAdminScheme`, `HaxUiAdminPrimitives`), `HaxUiAdminIcons.js`, `HaxUiAdminControls.js` (`HaxUiAdminControls`, `HaxUiAdminSimpleFields`), `HaxUiAdminShell.js` and `HaxUiDialogFrame.js` (the modal frame, below). Anything a visitor can load, such as the toast, imports the small modules. The layer lives in d-d-d so every admin element can use it, including packages that hax-body depends on (super-daemon, simple-modal, rpg-character, simple-fields). `@haxtheweb/hax-body/lib/hax-ui-styles.js` re-exports it, so existing imports keep working.

- **`HaxUiAdminTokens`** sets the `--hax-ui-*` custom properties on `:host`. Each one maps to a DDD primitive as a `light-dark()` pair. Surface, text and accent defer to the editor's HAX UI theme (`--hax-ui-background-color`, `--hax-ui-color`, `--hax-ui-color-accent`), so the editor's light and dark switch still applies.
- **`HaxUiAdminScheme`** applies the HAX UI theme's `color-scheme` to the host, so `light-dark()` agrees with the tokens.
- **`HaxUiAdminPrimitives`** holds the small pieces every admin surface repeats: `.hax-ui-pill` with `data-tone="accent|success|danger"`, `.hax-ui-kbd` and `.hax-ui-sr-only`.
- **`HaxUiAdminControls`** is the Controls and Field rows patterns below as classes: `.hax-ui-btn` (`.primary`, `.ghost`, `.danger`, `.danger-fill`), `.hax-ui-icon-btn`, `.hax-ui-seg`, `.hax-ui-chip` (`[data-set]`), `.hax-ui-switch`, `.hax-ui-input` / `-select` (`.compact` for a 32px toolbar control), `.hax-ui-field-row` with `.hax-ui-field-label` and `.hax-ui-field-control`, `.hax-ui-message` and `.hax-ui-callout` (`data-tone="warning|danger|info"`; a `.hax-ui-message` with no tone is a muted note box), `.hax-ui-note` (muted note text), `.hax-ui-empty`, `.hax-ui-tool-field` (`.grow`), `.hax-ui-seg.fill` and `.wrap`, `.hax-ui-chip[aria-pressed]`, `.hax-ui-tokens` with `.hax-ui-token`, and `.hax-ui-input-group` with `.unit`.
- **`HaxUiAdminSimpleFields`**: `class="hax-ui-simple-field"` on a `simple-fields-field` draws it as a HAX UI field.
- **`HaxUiAdminIcons`** names the admin icon for each meaning (`HaxUiAdminIcons.close`, `.search`, `.external` ...).
- **`HaxUiAdminStyles`** is all of the style arrays above in order; most surfaces spread just this.

```js
import {
  HaxUiAdminStyles,
  HaxUiAdminIcons,
} from "@haxtheweb/d-d-d/lib/HaxUiAdminStyles.js";

static get styles() {
  return [
    ...HaxUiAdminStyles,
    css`
      :host {
        font-family: var(--hax-ui-admin-font-family);
        font-size: var(--hax-ui-admin-font-size);
        color: var(--hax-ui-text);
      }
      .rail {
        background-color: var(--hax-ui-sunken);
      }
    `,
  ];
}

render() {
  return html`<button class="hax-ui-btn primary">Save</button>
    <button class="hax-ui-icon-btn" aria-label="Close">
      <simple-icon-lite icon="${HaxUiAdminIcons.close}"></simple-icon-lite>
    </button>`;
}
```

Rules:

- Style admin chrome with `--hax-ui-*` only. No raw hex, no `--ddd-font-size-*` content sizes, no SimpleColors.
- Use the shared control classes; do not restyle a button, switch, input or field row inside an element. A variant the classes lack is added to `HaxUiAdminControls`.
- A need the layer lacks is added to `HaxUiAdminTokens` first, mapped to a DDD primitive, then used. Never invent a one-off value in an element.
- A page can override any token on the element from outside, so admin elements stay themeable.

## Tokens

### In code today (`HaxUiAdminTokens`)

| Token                                  | Light                           | Dark              | Use                                           |
| -------------------------------------- | ------------------------------- | ----------------- | --------------------------------------------- |
| `--hax-ui-surface`                     | white                           | coalyGray         | Panel and dialog background                   |
| `--hax-ui-text`                        | coalyGray                       | white             | Body text, row labels                         |
| `--hax-ui-text-muted`                  | slateGray                       | white65           | Help text, counts, secondary labels           |
| `--hax-ui-line`                        | limestoneLight                  | white 18%         | Row dividers, panel edges                     |
| `--hax-ui-line-strong`                 | limestoneGray                   | white 40%         | Control borders, connector lines              |
| `--hax-ui-hover`                       | limestoneMaxLight               | white 8%          | Row and control hover                         |
| `--hax-ui-content-group`               | limestoneMaxLight 55%           | white 4%          | Rows that belong to the row above             |
| `--hax-ui-accent`                      | beaverBlue                      | skyLight          | Accent text and icons                         |
| `--hax-ui-accent-strong`               | link                            | skyBlue           | Current marker, switches, drop line           |
| `--hax-ui-accent-soft`                 | accent-strong 12%               | accent-strong 12% | Pressed segment, set filter, changed row      |
| `--hax-ui-selected`                    | accent-strong 18%               | accent-strong 18% | Selected rows, current rail item              |
| `--hax-ui-on-accent`                   | white                           | potentialMidnight | Text on an accent fill                        |
| `--hax-ui-danger` / `-soft`            | original87Pink                  | discoveryCoral    | Destructive actions, rows marked for deletion |
| `--hax-ui-danger-hatch` / `-on-fill`   | danger 22% stripes / black 20%  | danger 22% / white 30% | The diagonal hatch on danger buttons and rows pending delete, so they read apart without colour |
| `--hax-ui-success`                     | opportunityGreen                | creekLight        | Success pills and saved state                 |
| `--hax-ui-focus`                       | link                            | keystoneYellow    | Focus rings                                   |
| `--hax-ui-drop`, `--hax-ui-landed`     | accent-strong, 24%              |                   | Drag-and-drop targets, landing highlight      |
| `--hax-ui-row-height`                  | 32px (`compact` 28, `roomy` 40) |                   | Rows and toolbar controls                     |
| `--hax-ui-target`                      | 24px                            |                   | Smallest hit area (WCAG 2.5.8)                |
| `--hax-ui-gap`, `-md`, `-lg`           | 4, 8, 12px                      |                   | Spacing inside admin chrome                   |
| `--hax-ui-icon`                        | 16px                            |                   | Icons beside words                            |
| `--hax-ui-radius`, `-lg`, `-pill`      | 4, 8px, rounded                 |                   | Controls, panels, pills                       |
| `--hax-ui-admin-font-size`, `-xs`      | 14, 12px                        |                   | Body text, small labels                       |
| `--hax-ui-duration`, `--hax-ui-easing` | 150ms, ease                     |                   | Hover and state changes                       |

### Admin chrome tokens

These came from the site admin redesign as proposals and are now tokens in `HaxUiAdminTokens`, because site admin, system settings, Page history, the character builder, the toast and Merlin all needed them and each was copying the values. The editing update can still adjust their values in this one place.

| Token                           | Light                    | Dark                     | Use                                 |
| ------------------------------- | ------------------------ | ------------------------ | ----------------------------------- |
| `--hax-ui-sunken`               | limestoneMaxLight        | black 22%                | Section rail, side panels           |
| `--hax-ui-titlebar`             | coalyGray                | potentialMidnight        | Dialog titlebar                     |
| `--hax-ui-primary` / `-hover`   | nittanyNavy / beaverBlue | linkLight / skyLight     | The one primary action per bar      |
| `--hax-ui-on-primary`           | white                    | potentialMidnight        | Text on the primary fill            |
| `--hax-ui-on-titlebar`          | white                    | white                    | Text and icons on the titlebar      |
| `--hax-ui-success-soft`         | success 14%              | success 14%              | Success tone behind text            |
| `--hax-ui-warning` / `-soft`    | #8a5300 on warningLight  | #ffcf80 on amber 14%     | Caution callouts and field messages |
| `--hax-ui-info` / `-soft`       | info on infoLight        | infoLight on skyBlue 14% | Neutral callouts                    |
| `--hax-ui-field-height`         | 40px                     |                          | Form inputs (DDD textfield `sm`)    |
| `--hax-ui-titlebar-height`      | 48px                     |                          | Dialog titlebar                     |
| `--hax-ui-action-bar-height`    | 56px                     |                          | Action bar                          |
| `--hax-ui-rail-width`           | 192px                    |                          | Section rail                        |
| `--hax-ui-rail-width-collapsed` | 56px                     |                          | Section rail as icons               |

## Patterns

### One admin dialog: the eight areas

Every admin section opens inside the same dialog, and every section uses the same eight areas. Each area has one job, so people learn where to look once. Use these names when talking about the admin UI.

| #   | Area                | Where                                         | Holds                                                                                                                                                                     | Never holds                |
| --- | ------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| 1   | **Title bar**       | Dark band across the top                      | Breadcrumb (Site settings › section), Close                                                                                                                               | Section actions, filters   |
| 2   | **Section rail**    | Left; collapses to icons, lays over on phones | Sections and their parts, badges (counts, Beta, Soon), collapse toggle, help at the foot                                                                                  | Anything that changes data |
| 3   | **Page header**     | Top of the main column                        | Section title, one-line purpose, a status pill (Beta)                                                                                                                     | Buttons that act on items  |
| 4   | **Toolbar**         | Under the page header (the top rail)          | Search, filters, sort, view mode, density, page size, count, refresh, expand/collapse, Keyboard shortcuts                                                                 | Anything that changes data |
| 5   | **Workspace**       | Main column                                   | The list, table, tree or grid of items; a row's name focuses it; quick row icons and ⋯ at the row end                                                                     |                            |
| 5a  | **Selector column** | Left edge of the workspace                    | One checkbox per item, select-all in the header; what is checked is what bulk actions act on                                                                              |                            |
| 6   | **Detail panel**    | Right (hidden when narrow)                    | Preview and facts of the one focused item; open and copy links for that item                                                                                              | Bulk actions               |
| 7   | **Action bar**      | Bottom (the bottom rail)                      | Left: status ("3 selected", "Unsaved changes"), Clear. Right: every action that changes data, then Discard and Save, primary last; on phones extra actions fold into More | Filters, navigation        |
| 8   | **Item menu**       | Over a row                                    | That item's own actions, then the action bar's actions for it (or for the selection it belongs to). Opens from right click, ⋯, long press, Shift+F10 or the menu key      |                            |

#### The add area (record panels)

Content, Structure and Files work on the site's records (pages and files) and share the selector column, bulk actions and item menu. Content and Files also take new records from outside, so they have one more area: **9, the add area**, a drop zone with Browse at the top right of the page header. A file dropped there becomes a new record of that panel, and the panel answers in place: the list refreshes with the new items checked and the first one focused.

| Panel   | Accepts                                                           | Becomes                                                                                                                                                                                                       |
| ------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Content | Word (.docx, .doc), PDF, PowerPoint (.pptx), Markdown, text, HTML | One new unpublished page per document, under the page open behind the dialog; several documents are siblings under that parent, in drop order. Images and other files are turned away with a pointer to Files |
| Files   | Anything the site allows                                          | Uploaded files, listed first                                                                                                                                                                                  |

Structure arranges the pages that exist and has no add area: documents come in through Content (or Merlin, which can also build an outline of pages from a document). Its Add page is an action in the action bar, available with nothing selected. Settings panels have no add area.

Two overlays sit over the workspace when needed: a **chooser** (an action needs a value first: Scale…, Replace…) and the **leave prompt** (unsaved changes when switching sections).

The shell (`haxcms-site-admin`, and `haxcms-system-settings` for system admin) draws areas 1, 2, 3 and 7 from one registry; a section supplies the toolbar, workspace and detail panel, tells the shell its state and runs the actions the shell calls. It never draws its own titlebar or Save button. Merlin follows the same map in its own frame: search is its toolbar, results its workspace, the right pane its detail panel, the keyboard footer its action bar.

A section that is not finished says so where people look first: `status: "beta"` on its registry entry shows Beta on the rail and in the page header, and an action that is not built yet is sent with `soon: true` and shows dashed with a Soon pill (Views: Embed in page, Create as new page).

#### One way to work: mouse, touch and keyboard

| To                            | Mouse                                                                          | Touch             | Keyboard                      |
| ----------------------------- | ------------------------------------------------------------------------------ | ----------------- | ----------------------------- |
| Focus one item (detail panel) | Click its name                                                                 | Tap its name      | Up and Down between rows      |
| Select for bulk               | Click its checkbox                                                             | Tap its checkbox  | Space                         |
| Select a range                | Shift+click a checkbox                                                         | Tap each checkbox | Shift+Up and Shift+Down       |
| Select all, clear             | Header checkbox, Clear                                                         | Same              | Ctrl+A, Esc                   |
| Item menu                     | Right click, or ⋯                                                              | Long press, or ⋯  | Shift+F10 or the menu key     |
| Run a bulk action             | Action bar, or the item menu on a selected item: the same code runs either way |                   |                               |
| Save                          | Save in the action bar                                                         | Same              | Tab to Save in the action bar |

`haxcms-elements/lib/core/admin/admin-row-menu.js` holds the shared pieces: the item menu, the row ⋯ button, the list keyboard model (`handleAdminListKey`) and Shift+click ranges (`createRangeSelector`). Content, Files and Structure use them.

### Dialog size

The admin dialog takes nearly the whole screen. The margin around it grows from 0 on a phone to 32px on a wide screen (`clamp(0px, 2vw - 8px, 32px)` each side), up to 1680px wide, and its corners round from square to 8px the same way. A phone gets the full screen; a desktop keeps a thin frame of the page behind it. `SITE_ADMIN_MODAL_SIZE` in `site-admin-sections.js` holds these values for every admin modal.

On narrow screens, sections keep their controls to one row: the page header shrinks to a title and one line of help, a selection bar keeps its first action and puts the rest under More, and a section that scrolls inside itself (Structure) folds its toolbar into an Options menu.

### Dialog frame

Every HAX modal wears one frame: a 48px titlebar (`--hax-ui-titlebar`, coalyGray in light and potentialMidnight in dark) with a 16px bold title and a 32px close button with a 20px icon, on a white / coalyGray surface with 8px corners. Site admin, system settings, Merlin, site creation, the login prompt, platform settings, the image pop up and the editor's own dialogs (app picker, view source) all use it. `HaxUiDialogFrame.js` is the only place these values live; an opener keeps only its size, z-index and padding.

| Export                      | Use it for                                                                                                         |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `HaxUiDialogFrame`          | A `simple-modal`: spread it into `styles` in the `simple-modal-show` detail, then add the dialog's size            |
| `HaxUiDialogTitlebar`       | The titlebar alone (`SITE_ADMIN_TITLEBAR_STYLES` is this map)                                                      |
| `HaxUiDialogConfirm`        | The confirm card (discard changes, delete): no dark bar, the question as a bold heading, with `hax-confirm-dialog` |
| `haxUiDialogVars(map)`      | A `simple-modal-template`: put it in the element's styles; the template passes the values to the modal             |
| `HaxUiDialogTitlebarStyles` | A `web-dialog` that draws its own bar: `.hax-ui-dialog-titlebar`, `.hax-ui-dialog-title`, `.hax-ui-dialog-close`   |

Each value puts the `--hax-ui-*` token first with its DDD value behind it, because a modal sits outside the shadow roots that define the tokens.

Every "are you sure" uses the confirm card: `hax-confirm-dialog` (in `@haxtheweb/d-d-d/lib/hax-confirm-dialog.js`) in a modal opened with `HaxUiDialogConfirm`. The safe choice is plain and focused first; the destructive one is a danger fill. HAXcms's discard and delete prompts and the editor's cancel prompt are all this card.

Theme modals that a visitor sees (`site-modal`, `img-view-modal`, a theme's own colors) follow the site's theme, not this frame.

### Section rail

The rail lists every section, with a section's parts nested under it like outline-designer's tree. A button at the top collapses it to icons (`hax:admin-rail-collapse`) and opens it out again (`hax:admin-rail-expand`); the choice is kept per browser. Collapsed, the rail is 56px wide, still shows every icon and the parts of the open section, and each icon shows its name in a tooltip on hover and on keyboard focus. Badges become a dot on the icon. On a narrow screen (768px or less) the rail starts collapsed, and opening it lays it over the section, with a scrim, until the person picks a section, presses Esc or clicks outside it.

### Action bar and staged save

The shell owns the action bar. A section picks one mode.

| Mode        | Left                                                             | Right                                                                           |
| ----------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `form`      | "No unsaved changes", or "2 unsaved changes" and the field names | Discard (ghost), Save (primary)                                                 |
| `selection` | "3 selected", Clear                                              | The section's bulk actions; a destructive one is a danger outline ending in "…" |
| `none`      |                                                                  |                                                                                 |

A `form` section may also report a selection and bulk actions (Structure): the bar then reads "2 selected · No unsaved changes", Clear, the bulk actions, a rule, then Discard and Save. An action sent with `needsSelection: false` (Structure's Add page) is enabled with nothing selected.

- Save stays quiet until something changes, then becomes the primary fill. Changed fields carry a dot beside their label, and the count says how many.
- Leaving with unsaved changes asks first, whichever way the person leaves: rail, breadcrumb, close button, Esc or browser back. The prompt offers Stay, Discard and leave, and Save and leave.
- A commit that cannot be undone (bulk replace, delete) uses a danger fill and names its scope ("Replace 7 matches").
- Auto-save is planned, not current: when it comes, the status line shows its progress and the buttons go.

### Controls

- **Buttons** are 32px with words beside icons. One primary per bar. Secondary is outlined, ghost has no border, danger is an outline for a step that opens a confirm and a fill only for the final commit; both carry the danger hatch, because primary and danger fills are under 3:1 apart by luminance and look alike in greyscale. An icon-only button carries `aria-label` and a tooltip.
- **Segmented controls** switch a view or mode, using `aria-pressed`; the pressed segment is `--hax-ui-accent-soft`, bold and underlined with a 3px `--hax-ui-accent-strong` bar (the wash alone disappears in greyscale).
- **Segmented controls** that span their container share the width equally (`.hax-ui-seg.fill`); a long one may wrap (`.wrap`).
- **Filter chips**: dashed and muted when unset ("+ Tags"), solid with an accent wash when set ("Status: Draft ×").
- **Toggle chips** (`.hax-ui-chip[aria-pressed]`) turn one filter on or off: solid, accent border and wash when pressed, with an optional muted count (`.n`).
- **Toolbar fields** (`.hax-ui-tool-field`) are one 32px bordered row: a short muted label beside a bare select or input ("Sort by Title ▾"). `.grow` lets a search fill the toolbar.
- **Tokens** (`.hax-ui-tokens`, `.hax-ui-token`) list removable values inside one field (file formats, tags); each token has a remove button with an accessible name, and a bare input after them adds more.
- **Input groups** (`.hax-ui-input-group`) join a value to its unit (`84` `MB`); `.warning` turns the border warning when the value needs attention.
- **Switches** (`role="switch"`) change a setting; checkboxes select rows.
- **Pills** state status in a word (`.hax-ui-pill` with a tone). Colour never carries meaning alone.
- **Keyboard hints** use `.hax-ui-kbd`.

### Rows

Lists, tables and trees share one set of row states, from outline-designer:

| State                   | Treatment                                                   |
| ----------------------- | ----------------------------------------------------------- |
| Hover                   | `--hax-ui-hover`                                            |
| Selected                | `--hax-ui-selected`                                         |
| Current or inspected    | inset 3px `--hax-ui-accent-strong` on the left              |
| Keyboard focus          | inset `--hax-ui-focus` outline, `--hax-ui-focus-width`      |
| Changed, not saved      | `--hax-ui-accent-soft` and a dot                            |
| Drop target             | `--hax-ui-accent-soft` and a dashed `--hax-ui-drop` outline |
| Will be deleted on save | `--hax-ui-danger-soft` stripes and struck-through label     |

Rows are 32px in trees, 36 to 40px in tables, with a 32px sticky header row in muted 12px text.

### Field rows

A setting is one row: label (bold) and one line of help on the left in a 240px column, the control on the right at most 480px wide. Inputs are 40px. A message under the control pairs a word with its colour: warning on warning-soft for "recommended", danger on danger-soft for an error. Collapsed groups of fields follow the `contract-admin-fieldset` internal contract: a 32px bold 14px heading row, HAX UI field rows inside. Admin UI deliberately does not mirror the DDD content scale; only a fieldset inside authored content keeps content spacing.

### Callouts and empty states

A **note** is quiet status or help with no tone ("Saving…", "3 pages selected in another view"): a `.hax-ui-message` with no `data-tone` draws it as a muted box, `.hax-ui-note` as muted text. Callouts are a single line with an icon on the warning or info pair, used for consequences people must know before acting ("This bulk replacement cannot be undone"). An empty state centres an icon, a bold line, one line of help and one action ("Clear filters").

### Item menu

The actions for one item, opened over it by right click, long press, its ⋯ button or <kbd>Shift</kbd>+<kbd>F10</kbd>. It is `simple-context-menu`, which draws the design itself: a surface panel, 32px rows of icon and label, an optional small header, separators, danger last, and a focus ring for keyboard use. outline-designer, the site menu's page operations and the admin lists share it, so no consumer styles its own menu. Each item runs the same code as the control it mirrors. See the HaxUiItemMenu card.

### Density and motion

Rows offer compact, default and roomy densities through `--hax-ui-row-height-*`. Most admin users work with a mouse, so feedback stays brief: 150ms state changes, no bounce, no motion on hover beyond colour. Respect `prefers-reduced-motion`.

### Admin icons

Admin chrome uses one icon family, `hax:admin-*`, kept in `@haxtheweb/hax-iconset` (`lib/svgs/hax/`). Icons come from the hax iconset or get added to it; admin UI does not use `icons:`, `editor:`, `av:`, `social:`, `device:`, `image:`, `hardware:`, `lrn:` or bare Polymer names.

**Spec.** Every glyph:

- is a 24×24 `viewBox`, one filled `<path>` and no stroke, so it takes `currentColor` (simple-icon colours it) and never thins out at 16px;
- reads at about 2px visual weight, with rounded joins and corners;
- sits inside a 2px inner padding (live area 2–22); a wide shape (triangle, eye, mortarboard, people) may reach 1px, as Material's keylines allow;
- is still recognisable at 14–16px, so no fine detail, text or more than about three separate parts;
- is a Material Design Icons / Material Symbols filled path (Apache-2.0, credited in the iconset README) or an existing `hax:` glyph that already meets the above, so the family shares one visual language.

**Names.** `hax:admin-<name>`, named for what it stands for in the admin, not for its picture.

| Group             | Names                                                                                                                                                                                                                                                                                                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Sections          | `reports`, `content`, `structure`, `files`, `appearance`, `views`, `blocks`, `editor`, `features`, `seo`, `details`, `import-export`, `about`                                                                                                                                                                                                                                        |
| Reports screens   | `accessibility`, `text` (Content report), `links`, `media`, `instructional`, `freshness`, `metadata`, `components`                                                                                                                                                                                                                                                                   |
| Section parts     | `author`, `theme`, `palette`, `branding`, `regions`, `advanced`, `cms`, `shortcuts`, `api`, `community`, `tutorials`, `docs`, `issues`, `history`                                                                                                                                                                                                                                    |
| Shell and actions | `home` (Site settings), `chevron`, `rail-collapse`, `rail-expand`, `check`, `refresh`, `download`, `upload`, `external`, `search`, `preview`, `select-all`, `warning`, `delete`, `close`, `back`, `add`, `edit`, `copy`, `more`, `info`, `drag`, `enter` (run / Return), `voice`, `chevron-left`, `move-up`, `move-down`, `error`, `find-replace`, `page`, `language`, `hide`, `key` |

Every name above is in `HaxUiAdminIcons`, sections included (`HaxUiAdminIcons.close` is `hax:admin-close`, `HaxUiAdminIcons.structure` is `hax:admin-structure`, `HaxUiAdminIcons.importExport` is `hax:admin-import-export`); use the constant, not a typed name, so a section draws the same glyph in the rail, system settings and every panel that lists it. A section's registry entry in `site-admin-sections.js` names its icon, and the rail, launcher, titlebar and breadcrumb all read it from there. A chevron is always `hax:admin-chevron`, rotated with CSS for open and closed. Every element that draws one imports `@haxtheweb/hax-iconset/lib/simple-hax-iconset.js`.

Icons that describe content rather than admin chrome stay what they are: block icons from each element's HAX schema, file-type icons (`hax:file-*`) and brand marks (`hax:hax2022`).

**Adding one.** Add an icon when a new section, Reports screen or shell control needs one and no name above fits its meaning. Reuse a name only when the meaning is the same, not just the picture. Take the filled Material path, check it against the spec at 16px and 24px in light and dark beside the rest of the family, save it as `lib/svgs/hax/admin-<name>.svg` in the hax-iconset format, run `yarn run build` in `elements/hax-iconset`, and add the name to the table above.

## Accessibility

- Text meets 4.5:1 and controls 3:1 in both themes; every pairing above is checked in light and dark.
- Focus is always visible (`--hax-ui-focus`, yellow in dark), and `forced-colors` falls back to `Highlight`.
- The rail is a `nav` with `aria-current` on the open section. The action bar status is a live region. The leave prompt is an `alertdialog`.
- Closing the dialog returns focus to what opened it.
- Status is never colour alone: changed fields have a dot and a count, pills have words.
- Opposing actions and states (save vs discard, keep vs delete, on vs off, pressed vs not) read apart in greyscale and with colour vision deficiencies: by 3:1 luminance, or by fill weight (filled, outlined, text), the danger hatch, a bar, border or knob position. Declare each pair in `scripts/vision-pairs.json` with `evidence` for its cue; `yarn lint:vision` checks them and runs in `yarn precheck` ([haxtheweb/issues#3219](https://github.com/haxtheweb/issues/issues/3219)).

## Checklist for an admin surface

1. Apply the test above. If it is admin, use HAX UI.
2. Spread `HaxUiAdminStyles` from `@haxtheweb/d-d-d/lib/HaxUiAdminStyles.js`, use its control classes and `HaxUiAdminIcons`, and style the rest with `--hax-ui-*` only.
3. In site or system admin, build a section for the shell: no titlebar, no Save button, report unsaved changes. Put things in the eight areas above: finding in the toolbar, data-changing actions in the action bar, the focused item in the detail panel, a selector column and item menu on any list people act on in bulk.
4. Reuse the controls, rows, field rows and action bar modes above before inventing anything. Use `hax:admin-*` icons (see Admin icons) and add any missing one to the hax iconset.
5. Check light, dark and forced colours, greyscale and colour vision (`yarn lint:vision`, `yarn vision:gallery`), keyboard-only use, and widths down to 360px.
6. Run `hax-pattern-library-audit` on the element; it grades the `contract-admin-*` internal contracts.
