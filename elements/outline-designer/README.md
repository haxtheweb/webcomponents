# &lt;outline-designer&gt;

Designer
> tools to modify and visualize JSON Outline Schema for editing

## Usage
To use this web component in your project you can utilize one of the following styles of syntax.

```js
/* In an existing JS module / web component */
import '@haxtheweb/outline-designer/outline-designer.js';

/* CDN */
<script type="module" src="https://cdn.hax.cloud/cdn/build/es6/node_modules/@haxtheweb/outline-designer/outline-designer.js"></script>
```

## Working with the outline

Set `items` to JSON Outline Schema items. `getData()` returns `{ items }` in tree order, with `new`, `modified`, `delete` and `duplicate` flags on the items a save should act on.

**Pointer (mouse, pen and touch).** Drag a page by its title. Over another page, the top 30% places it before that page, the bottom 30% after it, and the middle nests it inside. Drag sideways to change the level it lands at; an insertion line with a dot shows the level, and the status line under the tree says the result in words. On touch, press and hold a page (or drag its grip) to pick it up. Holding the mouse still on an open parent folds it before you drag it.

**Keyboard.** Each page row is one Tab stop.

| Keys | Action |
| --- | --- |
| ↑ ↓ Home End | Move focus |
| → ← | Open or fold a page, or go to its first child or its parent |
| Alt+↑ Alt+↓ | Move the page up or down within its level |
| Alt+→ Alt+← | Indent (into the page above) or outdent |
| Enter, F2 | Rename |
| Ctrl/⌘+Enter, Ctrl/⌘+Shift+Enter | Add a page after, or a sub-page |
| Space, Shift+↑↓ | Select pages |
| Delete | Mark for deletion, or restore |
| Shift+F10, context menu key | Page actions |
| Letters | Jump to the next title starting with them |

**Attributes.** `density` (`compact`, `default`, `roomy`; remembered per browser), `hide-add-rows`, `hide-content-ops`.

**Showing what changed.** Moves, adds, deletes and folds made from the keyboard, the page menu or touch are animated so you can see where things went: rows slide to their new places (a view transition scoped to the tree where the browser supports it), added pages flip down into the gap opened for them, deleted pages turn over to their Deleting side (or flip away when deleted pages are hidden), and the page that moved is highlighted. Every change can be undone from the status line or with Ctrl/⌘+Z. How much is shown depends on the input: mouse stays light, keyboard adds a group highlight, and touch is slowest and leaves move buttons on the row after a menu move.

| Attribute | Values |
| --- | --- |
| `motion-profile` | `auto` (follows the last input), `mouse`, `keyboard`, `touch` |
| `reduced-motion` | `auto` (follows `prefers-reduced-motion`), `reduce`, `full` |

Timing comes from `--hax-ui-duration-move` and `--hax-ui-easing-move`; the landing highlight uses `--hax-ui-landed`.

**Styling.** The element uses the HAX UI admin tokens (`HaxUiAdminTokens` in `@haxtheweb/hax-body/lib/hax-ui-styles.js`), which map to DDD. Override any of them on the element, for example `outline-designer { --hax-ui-row-height: 36px; --hax-ui-drop: var(--ddd-theme-default-skyBlue); }`.

## Develop / Demo
Running `npm start` will start a local development server and open your default browser to display it. It will start watching *.js and lib/*.js files for changes automatically for your demo.
```bash
$ npm start
```


## Contributing

1. Fork it! `git clone git@github.com/haxtheweb/webcomponents.git`
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

Designer

## License
[Apache-2.0 License](http://opensource.org/licenses/Apache-2.0)