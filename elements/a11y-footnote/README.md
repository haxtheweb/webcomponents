# a11y-footnote

Accessible footnotes for HAX content ([haxtheweb/issues#280](https://github.com/haxtheweb/issues/issues/280)).

Write the note where it belongs in the text:

```html
<p>The Morrill Act of 1862<a11y-footnote>Morrill Land-Grant Act, 7 U.S.C. § 301 (1862).</a11y-footnote> granted each state land.</p>
```

- The note shows as a number. Hover or focus it to read the note in place; activate it to jump to the list.
- The numbered list (`a11y-footnotes`) assembles itself at the bottom of the content area. Authors never place it, it is never saved into the page, and it disappears when the last note goes. In HAXcms it lands below the page content in every theme; while editing it sits after `hax-body`.
- The note is the element's own content, so it is in the saved HTML. Where the element never loads, DDD's global styles show it in brackets where it was written.
- A list already in the page (server rendered) is adopted instead of drawing a second one.

| Attribute | Description |
| --- | --- |
| `no-preview` | Don't show the note on hover and focus |

## Commands

- `npm start` - development server
- `npm run build` - build and analyze
- `npm run test` - run tests

# Credits

A brighter future dreamed and developed by the Penn State [HAXTheWeb](https://hax.psu.edu/) initiative.
