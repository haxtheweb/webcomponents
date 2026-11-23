# night-draft-theme

**Night Draft** is a dark HAXcms blogging theme about a writer at a typewriter, at night. Every post is a letter typed onto paper.

- **The desk (home page).** A lamp-lit desk with a typewriter. The posts' titles float above it, and the one you pick stays centered as you move: hover, Tab or Up / Down / Home / End choose, Enter or a click opens it.
- **The banner.** Opening a letter from the desk flashes to its banner: the post's image (`metadata.image`) darkened, with the title in bold in the middle and its date. An arrow nudges down; that is all you see until you scroll.
- **The paper.** The letter is typed onto a sheet that feeds out of the typewriter's roller, line by line, with a block cursor. Readers who scroll ahead don't wait: the typing jumps to where they are. **Finish typing** shows the whole page at once. A letter already read in this visit is not typed again. The title and date sit at the foot of the paper.
- **The footer.** A black bar at the end of the page: **Back to** the desk, and **Next letter**, which opens the next post at its banner straight away. After the last post it wraps to the first.

The first page in the outline is the desk; every other page is a letter, in outline order. Dates come from the page's `metadata.created`.

## Scratch-outs

Text marked as struck (`<s>`, `<strike>` or `<del>`, the HAX editor's strikethrough) is scratched out with marker: the words stay in the page, barely readable under the strokes. Screen readers hear it as "[scratched out: …]", since most of them don't announce `<s>`.

Scratched-out text is meant to be hard to read, so it is below text contrast on purpose. Don't put anything a reader needs inside it.

## Motion

With **reduced motion** set in the operating system or browser (`prefers-reduced-motion: reduce`):

- the paper is already typed: no cover, no cursor, no Finish typing button
- opening a letter doesn't flash
- the lamp doesn't flicker, the arrow doesn't bob, the sheet doesn't feed out
- the titles don't grow when chosen, and scrolling to the paper or a title jumps instead of gliding

The theme listens for the setting changing while a page is open: turning reduced motion on mid-letter shows the rest of the page at once. The host reflects it as `reduced-motion`.

In edit mode the page is never covered: the editor gets the whole letter, and the banner shrinks to 40% of the screen.

## Fonts

Typewriter text is **Special Elite** (Apache-2.0) and the banner and footer titles are **Oswald** (OFL-1.1), both served by HAX from `@haxtheweb/d-d-d/lib/fonts` through `loadFontFamily`, not from Google.

## Design system

The theme draws its own room, paper and ink from DDD color tokens and does not take a bridged design system (`acceptsDesignSystems` is false), like `glossy-portfolio-theme`.

| File | What it is |
| --- | --- |
| `night-draft-theme.js` | The theme |
| `locales/night-draft-theme.en.json` | English strings |
| `demo/` | A five-page demo blog (`demo/files/` holds its banner images) |
