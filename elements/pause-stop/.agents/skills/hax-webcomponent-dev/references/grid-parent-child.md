# Grid parent and child elements

Use this when authors should be able to add, reorder and edit several items inside your element (a schedule of sessions, a timeline of positions, a list of steps). The parent is a **grid** element; each item is its own child element that HAX authors fill in. This page is a condensed walk-through of how `career-timeline` and `career-org-item` in the webcomponents monorepo do it (<https://github.com/haxtheweb/webcomponents/tree/master/elements/career-timeline>). Open those files if you can reach them; everything below works offline.

Names below are placeholders: `my-list` is the parent, `my-list-item` the child.

## 1. Files

```
my-list.js                              parent
lib/my-list-item.js                     child (imported by the parent)
lib/my-list.haxProperties.json          parent schema, loaded by file URL
locales/my-list.<lang>.json             parent strings (scaffolded for you)
locales/my-list-item.<lang>.json        child strings, if the child has any (add these yourself)
```

Scaffold the parent with `hax wc my-list --y --no-i`. The scaffold gives you a leaf element, so you add the child by hand and turn the parent into a grid.

## 2. Parent haxProperties

```json
{
  "api": "1",
  "type": "grid",
  "canScale": true,
  "canEditSource": true,
  "gizmo": {
    "title": "My list",
    "description": "A list that contains my-list-item entries",
    "icon": "icons:list",
    "color": "blue",
    "tags": ["Content", "list"],
    "handles": [],
    "meta": { "author": "your team" }
  },
  "settings": {
    "configure": [
      {
        "property": "title",
        "title": "Title",
        "description": "Heading for the list",
        "inputMethod": "textfield",
        "required": true
      }
    ]
  },
  "saveOptions": { "wipeSlot": false, "unsetAttributes": [] },
  "demoSchema": [
    {
      "tag": "my-list",
      "properties": { "title": "My list" },
      "content": "<my-list-item heading=\"First item\"></my-list-item>"
    }
  ]
}
```

- `"type": "grid"` is what makes HAX treat the slotted children as editable content.
- `demoSchema.content` holds an example child, so inserting the element from HAX shows something working.
- `saveOptions` is copied from `career-timeline`; keep it as is unless you have a reason to change it.

## 3. Parent element

- `import "./lib/my-list-item.js";` so the child is always defined when the parent is.
- Render `<slot></slot>` for the children. Put layout, not content, in the shadow DOM.
- To react to child changes, have the child fire an event and listen on the parent in `connectedCallback` (remove the listener in `disconnectedCallback`). `career-timeline` listens for `start-date-changed` and re-sorts its children by moving the existing nodes with `appendChild`, which keeps them in place instead of recreating them.
- Give authors an "add item" button with `haxHooks` and an inline context menu:

```js
haxHooks() {
  return { inlineContextMenu: "haxinlineContextMenu" };
}

haxinlineContextMenu(ceMenu) {
  ceMenu.ceButtons = [
    { icon: "icons:add", callback: "_addItemHandler", label: this.t.addItem },
  ];
}

_addItemHandler() {
  const item = globalThis.document.createElement("my-list-item");
  // career-timeline hydrates these when it appends a child directly
  item.setAttribute("data-hax-layout", true);
  item.setAttribute("data-hax-ray", "my-list-item");
  this.prepend(item);
}
```

`career-timeline` also lists `gizmoRegistration` in `haxHooks()` to register its haxProperties locale files by dispatching `i18n-manager-register-element`; see `career-timeline.js` if you ship those.

## 4. Child element

- A leaf child uses `"type": "element"` (the default). A child that holds more children of its own (`career-org-item` holds `career-role-item`s) is itself `"type": "grid"` and repeats this pattern.
- A child can return its schema inline from `static get haxProperties()` or point at a `lib/<tag>.haxProperties.json` file, as the parent does. Either is fine; keep one style.
- Options seen on a child: `"canScale": false`, `"canEditSource": false`, `"contentEditable": false`, `"hideDefaultSettings": true` for items that should only be edited through their fields.
- Expose each editable value as a property with a matching `settings.configure` entry; mark the ones the item cannot render without `"required": true`.
- Add `:host([data-hax-active])` styling so the selected child is visible while authors edit. Use DDD tokens for it; do not copy a hard-coded fallback such as `#000` from another element.
- Give the child its own `this.t` strings and call `registerLocalization` for it. The scaffold only creates locale stubs named after the parent, and `hax audit i18n` only flags hard-coded text, so locale files missing for the child are not reported; create them yourself.

## 5. Picking `inputMethod`

Values seen in `HAXWiring.js` and in the monorepo's own haxProperties files: `textfield` (the default when omitted), `textarea`, `boolean`, `colorpicker`, `haxupload`. The essentials section of `SKILL.md` also lists `select`.

- `haxupload` is for choosing or uploading a media file. `career-org-item` uses it for an image `source`. Do not use it for a plain link; use `textfield` unless an existing element shows a better method for the same kind of value.
- For any other `inputMethod`, find a `*.haxProperties.json` that edits the same kind of value and copy its method rather than guessing, then run `hax audit schema` to validate the file.

## 6. Check your work

- `hax audit` from the element folder.
- `hax audit schema` to validate the parent and child schemas and `demoSchema`.
- The scaffold's tests run the a11y audit in light and dark mode; add a case that renders the parent with two or three children.
