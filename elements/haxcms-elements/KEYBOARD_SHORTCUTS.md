# HAXcms Keyboard Shortcuts

HAXcms includes a centralized keyboard shortcut system that provides quick access to common operations. All shortcuts use `Ctrl+Shift+[Key]` to avoid conflicts with Super Daemon (which uses `Alt+Shift` or `Meta+Shift`).

## Architecture

HAX keyboard/insertion shortcuts funnel through one shared registry so that
HAXcms key bindings, HAXStore markdown triggers, and Super Daemon (Merlin)
options all share a single descriptor shape and source of truth.

- **`@haxtheweb/utils/lib/keyboardShortcuts.js`** - `KeyboardShortcutManager`,
  the dependency-free shared registry singleton (re-exported from
  `@haxtheweb/utils/utils.js`). Holds canonical descriptors and provides
  `register`/`unregister`/`getAll`/`getByContext`/`getById`/`getByType`/
  `getByBinding`/`getByTrigger`/`getLabel`/`getForDisplay` plus a static
  `generateLabel`. Importable from haxcms-elements, hax-body, and
  super-daemon without circular dependencies.
- **`lib/core/utils/HAXCMSKeyboardShortcuts.js`** - `HAXCMSKeyboardShortcuts`,
  a backward-compatible facade over the shared registry. It keeps the
  CMS-specific keydown *execution* engine (modifier / admin-mode / modal
  guards + callback dispatch) and the legacy query/label API
  (`register`, `getShortcuts`, `getShortcutsByContext`, `getShortcut`,
  `getShortcutLabel`, `getShortcutsForDisplay`, static `generateLabel`).
  Storage is delegated to the registry, so `HAXCMSKeyboardShortcutsInstance`
  and `KeyboardShortcutManagerInstance` see the same data.
- **`lib/core/haxcms-site-editor-ui.js`** - Registers all CMS bindings in
  `_registerKeyboardShortcuts()` (called from `connectedCallback`).
- **`elements/hax-body/lib/hax-store.js`** - Registers the default markdown
  insertion triggers into the registry at construction; exposes the legacy
  `HAXStore.keyboardShortcuts` `{ trigger: { tag, content } }` map via a
  getter derived from the registry.
- **`elements/hax-body/hax-body.js`** - `keyboardShortCutProcess()` reads
  markdown triggers from the registry via `getByTrigger`.
- **`elements/super-daemon/super-daemon.js`** - `defineOption()` accepts an
  optional `shortcut` (registry id or inline descriptor) and resolves it to
  `option.shortcutLabel` for the Merlin UI.

### Canonical descriptor shape

```js
{
  id: 'cms-save' | 'markdown-h3' | ...,  // stable unique id
  type: 'binding' | 'markdown',          // binding = modifier+key; markdown = typed trigger
  key: 'S',                              // physical key (binding)
  ctrl, shift, alt, meta,                // binding modifiers
  trigger: '###',                        // markdown trigger
  tag: 'h3', content: '',                // markdown insert payload
  description: 'Save page',
  context: 'edit' | 'view' | 'global',
  allowInInput: false,
  callback: (e) => {},                   // optional (binding)
  condition: () => true,                 // optional active-condition (binding)
  eventName: '...',                      // optional
}
```

### Key Features
- **Context-aware**: Shortcuts only work in appropriate contexts (edit mode vs view mode)
- **Condition-based**: Each shortcut has conditions that determine when it's active
- **No conflicts**: Uses `Ctrl+Shift` modifier to avoid conflicts with browser shortcuts and Super Daemon
- **Permission-aware**: Respects platform permissions (e.g., `platformAllows('addPage')`)
- **Single source of truth**: Bindings, markdown triggers, and Merlin options all query one registry

## Available Shortcuts

### General Operations

| Shortcut | Action | Context | Description |
|----------|--------|---------|-------------|
| `Ctrl+Shift+E` | Enter Edit Mode | View Mode | Enter edit mode for the current page |
| `Ctrl+Shift+S` | Save Page | Edit Mode | Save page content and exit edit mode |

### Site Management

| Shortcut | Action | Context | Description |
|----------|--------|---------|-------------|
| `Ctrl+Shift+M` | Site Settings | View Mode | Open site settings/manifest dialog |
| `Ctrl+Shift+O` | Outline Designer | View Mode | Open outline/site structure dialog |
| `Ctrl+Shift+[` | New Page | View Mode | Create a new page (changed from N to avoid Chrome conflict) |

### Edit Mode Operations

| Shortcut | Action | Context | Description |
|----------|--------|---------|-------------|
| `Ctrl+Shift+Z` | Undo | Edit Mode | Undo the last change |
| `Ctrl+Shift+Y` | Redo | Edit Mode | Redo the last undone change |
| `Ctrl+Shift+B` | Block Browser | Edit Mode | Open the block/element browser |

### Numbered Shortcuts

Numbered shortcuts are contextual and prioritize view-mode actions from left to right in the site editor UI:

| Shortcut | Action | Context | Description |
|----------|--------|---------|-------------|
| `Ctrl+Shift+1` | Edit page | View Mode | Enter edit mode for the current page |
| `Ctrl+Shift+2` | Page actions | View Mode | Open page actions menu |
| `Ctrl+Shift+3` | Create page | View Mode | Open add page flow |
| `Ctrl+Shift+4` | Site outline actions | View Mode | Open outline actions menu |
| `Ctrl+Shift+5` | Outline designer | View Mode | Open site outline designer |
| `Ctrl+Shift+6` | Site settings | View Mode | Open site settings/manifest dialog |
| `Ctrl+Shift+7` | User menu | View Mode | Open user account menu |
| `Ctrl+Shift+1` | View Source | Edit Mode | Toggle HTML source view |
| `Ctrl+Shift+2` | Structure | Edit Mode | Open page structure/content map |
| `Ctrl+Shift+3` | Blocks | Edit Mode | Open blocks browser |
| `Ctrl+Shift+4` | Configure | Edit Mode | Open configure panel |

## Super Daemon Integration

HAXcms keyboard shortcuts are designed to work alongside Super Daemon:
- **Super Daemon**: `Alt+Shift` (or `Meta+Shift` on macOS)
- **HAXcms**: `Ctrl+Shift+[Key]`

These don't conflict because they use different modifier key combinations.

## Programmatic Access

The shared registry (`KeyboardShortcutManagerInstance`) is the primary API.
The CMS facade (`HAXCMSKeyboardShortcutsInstance`) delegates to it and keeps
the legacy method names working.

### Getting Shortcut Labels

```javascript
// Preferred: import the shared registry from anywhere in the ecosystem
import {
  KeyboardShortcutManagerInstance,
  KeyboardShortcutManager,
} from '@haxtheweb/utils/utils.js';

// Resolve a binding by its key + modifiers
const save = KeyboardShortcutManagerInstance.getByBinding('S', true, true);
// Resolve a markdown trigger
const h3 = KeyboardShortcutManagerInstance.getByTrigger('###');
// Label for an arbitrary descriptor
const label = KeyboardShortcutManager.generateLabel({ key: '[', ctrl: true, shift: true });
// Returns: 'Ctrl⇧['

// All shortcuts formatted for display (label/description/context/key)
const display = KeyboardShortcutManagerInstance.getForDisplay();
```

The CMS facade still works for existing call sites:

```javascript
import {
  HAXCMSKeyboardShortcutsInstance,
  HAXCMSKeyboardShortcuts,
} from './lib/core/utils/HAXCMSKeyboardShortcuts.js';

// Binding shortcuts only (markdown sourced separately from HAXStore.keyboardShortcuts)
const shortcuts = HAXCMSKeyboardShortcutsInstance.getShortcutsForDisplay();
// [{ label: 'Ctrl⇧E', description: 'Enter edit mode', context: 'view', key: 'E' }, ...]

const editShortcuts = HAXCMSKeyboardShortcutsInstance.getShortcutsByContext('edit');
const label = HAXCMSKeyboardShortcuts.generateLabel({ key: '[', ctrl: true, shift: true });
```

### Displaying Shortcuts in Merlin

To create a Merlin program that shows all keyboard shortcuts:

```javascript
const shortcuts = HAXCMSKeyboardShortcutsInstance.getShortcutsForDisplay();
// Display shortcuts grouped by context
const byContext = shortcuts.reduce((acc, s) => {
  acc[s.context] = acc[s.context] || [];
  acc[s.context].push(s);
  return acc;
}, {});
```

## Implementation Details

### Registering a New Shortcut

There are three registration paths, all writing into the same shared
`KeyboardShortcutManager` registry.

#### 1. Direct registry call (bindings and markdown triggers)

For CMS-level bindings, add to `_registerKeyboardShortcuts()` in
`haxcms-site-editor-ui.js` (the facade forwards to the registry):

```javascript
HAXCMSKeyboardShortcutsInstance.register({
  id: 'cms-your-action',       // optional but recommended; defaults to the combo
  key: 'X',                    // The key to press
  ctrl: true,                  // Require Ctrl
  shift: true,                 // Require Shift
  callback: (e) => {           // Function to execute
    this.yourMethod(e);
  },
  condition: () =>             // When shortcut should be active
    store.isLoggedIn &&
    this.pageAllowed &&
    !this.editMode,
  description: 'Your action',  // Human-readable description
  context: 'view'              // Context: 'edit', 'view', or 'global'
});
```

For markdown triggers outside the CMS facade, register directly:

```javascript
import { KeyboardShortcutManagerInstance } from '@haxtheweb/utils/utils.js';
KeyboardShortcutManagerInstance.register({
  id: 'markdown-callout',
  type: 'markdown',
  trigger: '/callout',
  tag: 'my-callout',
  content: '',
  description: 'Insert callout',
  context: 'edit',
});
```

#### 2. Declarative `haxProperties.gizmo.shortcut`

Element authors can declare shortcut(s) inline in `haxProperties` without
hand-editing `hax-store.js`. When HAXStore registers the element's gizmo it
auto-registers any `gizmo.shortcut` descriptor(s) into the shared registry
(a markdown entry defaults its `tag` to the gizmo's tag if omitted):

```javascript
gizmo: {
  title: 'My block',
  // ...
  shortcut: [
    { type: 'markdown', trigger: '/myblock' }
  ],
}
```

#### 3. Super Daemon `defineOption` reference

Merlin options can reference a registry id (or inline descriptor) so the
row can display the matching shortcut. `defineOption` resolves it to
`option.shortcutLabel`:

```javascript
SuperDaemonInstance.defineOption({
  title: 'Save',
  // ...
  shortcut: 'cms-save',   // id lookup into the shared registry
});
```

The `gizmoRegistration` haxHook remains the programmatic override point for
elements that need custom registration logic.

### Input Field Handling

The keyboard shortcut system intelligently handles input fields:
- Shortcuts are **disabled** when typing in regular input fields
- Shortcuts **work** in the HAX editor (content editable areas)
- This prevents shortcuts from interfering with normal typing

### Condition Functions

Conditions are evaluated before executing a shortcut. Common conditions include:

- `store.isLoggedIn` - User must be logged in
- `this.editMode` - Must be in edit mode
- `!this.editMode` - Must NOT be in edit mode
- `this.pageAllowed` - Page operations must be allowed
- `this.canUndo` / `this.canRedo` - Undo/redo must be available
- `this.platformAllows('feature')` - Platform must allow the feature

## Testing

To test keyboard shortcuts:

1. Start the demo site:
   ```bash
   cd elements/haxcms-elements/demo
   # Serve the site using your preferred method
   ```

2. Log in (if authentication is enabled)

3. Try the shortcuts in appropriate contexts:
   - View mode shortcuts work when not editing
   - Edit mode shortcuts work after pressing `Ctrl+Shift+E`

## Future Enhancements

Possible future keyboard shortcuts:
- `Ctrl+Shift+H` - Go to home page
- `Ctrl+Shift+P` - Previous page in outline
- `Ctrl+Shift+]` - Next page in outline
- `Ctrl+Shift+D` - Duplicate current page
- `Ctrl+Shift+T` - Toggle dark mode
- `Ctrl+Shift+I` - Open insights panel
- `Ctrl+Shift+/` - Show keyboard shortcuts help dialog

To implement any of these, simply add them to `_registerKeyboardShortcuts()` following the pattern above.

## Accessibility

Keyboard shortcuts enhance accessibility by providing:
- Quick navigation without requiring a mouse
- Consistent keyboard patterns across the interface
- Context-aware behavior that prevents accidental activation
- Clear visual feedback through existing UI elements

## Browser Compatibility

All shortcuts use standard keyboard events and should work in:
- Chrome/Edge
- Firefox
- Safari
- Other modern browsers

Note: Some browsers may have conflicting shortcuts. If a shortcut doesn't work, check your browser's keyboard shortcuts settings.
