# &lt;mermaid-diagram&gt;

A diagram written as text ([Mermaid](https://mermaid.js.org/)), drawn in the page, with a text
alternative. A content block: it records nothing about the reader and sends no xAPI.

```html
<mermaid-diagram diagram-title="Publishing checklist">
  <pre>
flowchart TD
  A[Draft the page] --> B{Has media?}
  B -->|Yes| C[Add captions and alt text]
  B -->|No| D[Run the a11y audit]
  C --> D
  D --> E((Publish))</pre>
  <span slot="caption">What happens to a page before it is published.</span>
</mermaid-diagram>
```

## How it works

- **The source is the content.** The Mermaid text lives in a `<pre>` in the light DOM and is saved
  exactly as written. Without JavaScript, in a feed or under server side rendering it is still
  readable text. The drawing lives in the shadow root and is never saved.
- **Mermaid loads late.** The Mermaid library (vendored, see below) is loaded only when a diagram
  comes within 200px of the screen, once per page, and is never part of the module graph.
- **Any diagram type Mermaid 11 supports is drawn.** Wide diagrams are drawn at their natural size
  and scroll inside the block, never the page.
- **It follows the page.** Colours are read from DDD tokens on the element when it draws: node fill
  from `--ddd-palette-tint`, node borders and arrows from `--ddd-palette-marker`, text from the DDD
  text colour. It is drawn again when the colour scheme changes.
- **A source that does not parse** shows a translated message, Mermaid's own explanation and the
  source. It never throws and never leaves an empty block.

## Attributes and properties

| Attribute          | Property          | Type    | What it does                                                                                     |
| ------------------ | ----------------- | ------- | ------------------------------------------------------------------------------------------------ |
| `diagram-title`    | `diagramTitle`    | String  | Visible title in the block header; also names the drawing.                                       |
| `description`      | `description`     | String  | Authored text alternative (plain text).                                                          |
| `src`              | `src`             | String  | Optional `.mmd` file drawn instead of the inline source. `http`, `https` or a relative path only. |
| `show-source`      | `showSource`      | Boolean | Show the source next to the drawing.                                                             |
| `show-description` | `showDescription` | Boolean | Show the text alternative below the drawing.                                                     |
| `accent-color`     | `accentColor`     | String  | DDD accent name for the header chip only.                                                        |
| (none)             | `code`            | String  | The Mermaid source. Mirrors the `<pre>`: setting it rewrites the `<pre>`. Never saved as an attribute. |

## Slots

| Slot          | What goes in it                                                                 |
| ------------- | ------------------------------------------------------------------------------- |
| (default)     | A `<pre>` holding the Mermaid source.                                           |
| `caption`     | Optional caption, shown below the drawing only when filled.                     |
| `description` | Optional authored text alternative with markup. Wins over everything else.     |

## Events

| Event                      | Detail            | When                              |
| -------------------------- | ----------------- | --------------------------------- |
| `mermaid-diagram-rendered` | `{ diagramType }` | A drawing was shown.              |
| `mermaid-diagram-error`    | `{ message }`     | The source could not be drawn.    |

Both bubble and are composed.

## CSS

- `--mermaid-diagram-surface`: background behind the drawing (also given to Mermaid).
- `--mermaid-diagram-max-height`: tallest the drawing area gets before it scrolls.
- Parts: `frame`, `diagram`, `caption`, plus the DDD block parts `block-header`, `block-chip`,
  `block-text`.

## Accessibility

- The SVG is one image (`role="img"`), named by the block header and described by the text
  alternative, which is real text in the page: shown with the header button, and always there for
  assistive technology.
- The text alternative is, in order: the `description` slot, the `description` attribute,
  `accDescr` written in the Mermaid source, and for flowcharts an ordered list written from the
  graph ("Has media? (decision): if Yes, go to ...; if No, go to ..."). Other diagram types without
  an authored description say "Diagram described by its source." and keep the source available to
  assistive technology. **Write a description for anything that is not a flowchart.**
- Header buttons are real buttons with labels and tooltips: Source and Text alternative
  (`aria-expanded`), Present (`aria-pressed`).
- Present uses the Fullscreen API where there is one. Where there is not (for example an iPhone),
  the block covers the window instead; Escape or the same button leaves.
- When a diagram is wider than the block, its scroll area takes keyboard focus (arrow keys scroll)
  and is labelled.
- Messages (loading, nothing to draw, an error) are in a live region. An error uses the DDD status
  tokens with an icon and the word "Error", never colour alone.
- Works at 360px wide, in light and dark, and has no animation.

## Security

- Mermaid runs with `securityLevel: "strict"`. HTML labels are off, and the keys that control this
  are locked, so an `init` directive or front matter in the source cannot turn them back on.
- Mermaid's SVG (already sanitized by its bundled DOMPurify) is parsed in an inert document and
  checked again before it is adopted: no `script`, `foreignObject` or frames, no `on*` attributes,
  links only to ids inside the drawing. Because of that, `click` lines in a source do nothing:
  links and callbacks from diagram text are not supported.
- Author text (title, description, error detail, generated steps) is rendered as text.
- `src` is fetched only from `http:` / `https:` addresses.

## Editing in HAX

- Configure: title, diagram source (code editor), text alternative, caption, show source, show
  text alternative. Advanced: source file, accent colour.
- While editing, the source and the text alternative are shown beside the drawing, and the drawing
  follows the source 300ms after the last change. A slower drawing never replaces a newer one.
- Saved content is the authored light DOM and attributes only.

## Mermaid

`lib/mermaid/mermaid.min.js` is the unmodified build from `mermaid@11.16.1` (MIT), loaded with
`@haxtheweb/es-global-bridge`. See `lib/mermaid/README.md` for its hashes, what it bundles and how
to update it.

## Develop

```bash
yarn test        # draws real diagrams in Chromium
yarn run build   # refreshes custom-elements.json and lib/mermaid-diagram.docs.json
```
