# HAXcms Keyboard Shortcuts

HAXcms includes a centralized keyboard shortcut system that provides quick access to common operations. All shortcuts use `Ctrl+Shift+[Key]` to avoid conflicts with Super Daemon (which uses `Alt+Shift` or `Meta+Shift`).

## Architecture

The keyboard shortcut system is implemented in:
- **`lib/core/utils/HAXCMSKeyboardShortcuts.js`** - Centralized keyboard shortcut manager
- **`lib/core/haxcms-site-editor-ui.js`** - Registers all shortcuts in `_registerKeyboardShortcuts()`

### Key Features
- **Context-aware**: Shortcuts only work in appropriate contexts (edit mode vs view mode)
- **Condition-based**: Each shortcut has conditions that determine when it's active
- **No conflicts**: Uses `Ctrl+Shift` modifier to avoid conflicts with browser shortcuts and Super Daemon
- **Permission-aware**: Respects platform permissions (e.g., `platformAllows('addPage')`)

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
| `Ctrl+Shift+V` | View Source | Edit Mode | Toggle HTML source view |
| `Ctrl+Shift+B` | Block Browser | Edit Mode | Open the block/element browser |

### Numbered Tray Panel Shortcuts

These shortcuts provide quick access to HAX editor panels using numbers 1-6:

| Shortcut | Action | Context | Description |
|----------|--------|---------|-------------|
| `Ctrl+Shift+1` | Configure | Edit Mode | Toggle between configure panel and active element |
| `Ctrl+Shift+2` | Blocks | Edit Mode | Open blocks browser |
| `Ctrl+Shift+3` | Structure | Edit Mode | Open page structure/content map |
| `Ctrl+Shift+4` | View Source | Edit Mode | Toggle HTML source view |
| `Ctrl+Shift+5` | Media | Edit Mode | Open media browser |
| `Ctrl+Shift+6` | Merlin | Global | Open Merlin/Super Daemon (alternative to Alt+Shift) |

**Note**: `Ctrl+Shift+1` has special toggle behavior - press once to focus the configure panel, press again to return focus to the active element.

## Super Daemon Integration

HAXcms keyboard shortcuts are designed to work alongside Super Daemon:
- **Super Daemon**: `Alt+Shift` (or `Meta+Shift` on macOS)
- **HAXcms**: `Ctrl+Shift+[Key]`

These don't conflict because they use different modifier key combinations.

## Programmatic Access

### Getting Shortcut Labels

The keyboard shortcut system provides methods to programmatically access shortcut information:

```javascript
import { HAXCMSKeyboardShortcutsInstance } from './lib/core/utils/HAXCMSKeyboardShortcuts.js';

// Get all shortcuts formatted for display (e.g., in Merlin)
const shortcuts = HAXCMSKeyboardShortcutsInstance.getShortcutsForDisplay();
// Returns: [{ label: 'Ctrl⇧[', description: 'Create new page', context: 'view', key: 'Ctrl+Shift+[' }, ...]

// Get all shortcuts with full details
const allShortcuts = HAXCMSKeyboardShortcutsInstance.getShortcuts();

// Get shortcuts for a specific context
const editShortcuts = HAXCMSKeyboardShortcutsInstance.getShortcutsByContext('edit');

// Generate a label for a shortcut
import { HAXCMSKeyboardShortcuts } from './lib/core/utils/HAXCMSKeyboardShortcuts.js';
const label = HAXCMSKeyboardShortcuts.generateLabel({ key: '[', ctrl: true, shift: true });
// Returns: 'Ctrl⇧['
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

To add a new keyboard shortcut, add it to the `_registerKeyboardShortcuts()` method in `haxcms-site-editor-ui.js`:

```javascript
HAXCMSKeyboardShortcutsInstance.register({
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
