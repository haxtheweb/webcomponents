# vhs-blog-theme

A dark, bargain-bin video shelf theme for HAXcms blogs and vlogs.

- **The shelf (site root):** every post is a one-of-a-kind video case. Top level posts fill stacks of ten in outline order; a post with child pages becomes a box set stack. Hover or tab onto a case and it steps off the stack while the "Now holding" panel shows its front cover.
- **A post:** an old CRT powers on and rolls an 80s style title sequence, then the case opens: the generated front cover beside the page content, with the previous and next cases as spines.
- **Dark by design:** the theme always renders dark (`color-scheme: only dark`), so authored DDD content follows it.

## Cases are generated, never stored

`lib/vhs-blog-case.js` hashes the post title (one salt per visual axis), the same way `rpg-character` uses a seed. The same title always gives the same case, in any build, with nothing to store or migrate. Axes: 18 palettes, 16 title faces, 6 case types, 5 layouts, 5 art patterns, treatments, edition badges, invented studios and marks, sticker colour and tilt, barcode, catalog number.

Invariants (tested in `test/vhs-blog-case.test.js`):

- title text always uses the palette ink, and every ink is at least 4.5:1 on its case;
- an accent colour only colours title text when it is also at least 4.5:1;
- title faces are legible text faces and spine titles are never smaller than 18px; long titles wrap instead of truncating, and the decorative extras step aside;
- each case is a pure function of the title (and an optional seed).

Fonts load per family from Google Fonts only when a case on the page uses that face.

## Accessibility

- Each case on the shelf is a real link named by the post title and read time; the spine art is `aria-hidden`.
- Focus is visible (3px ring) and pulls the case out like hover; with reduced motion it steps out with no animation.
- The title sequence is one image named by the post title, has Replay intro and Skip intro controls, never animates with `prefers-reduced-motion: reduce`, and stays still in edit mode.

## Commands

- `yarn start` - development server
- `yarn run build` - format, analyze and extract docs
- `yarn run test` - run tests

# Credits

A brighter future dreamed and developed by the Penn State [HAXTheWeb](https://hax.psu.edu/) initiative.
