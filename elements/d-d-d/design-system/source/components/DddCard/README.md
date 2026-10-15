# DddCard

`<ddd-card>` is a content card with an optional image, a title, a slot for a description, and one link button. It is part of `@haxtheweb/d-d-d` and is HAX-capable.

```html
<ddd-card title="Getting started with HAX" src="hero.jpg" alt="…" href="/start" data-primary="1">
  <p>Cards collect a title, a short description and one call to action.</p>
</ddd-card>
```

## The consumer provides

- `title`: card heading.
- Default slot: the description, as one or more `<p>`. Paragraph margins are reset to 0 inside the card.
- `src` + `alt`: optional image. It is lazy-loaded with `object-fit: cover` at `--ddd-card-img-height` (260px).
- `href`: the button target. With no `href` the button is not rendered. `target` and `rel` are also accepted (`rel` defaults to `noopener nofollow noreferrer`).
- `label`: button text (defaults to "Explore", localized). `no-arrow` hides the trailing ">".
- `data-primary`: colours the 12px bar under the image and the button's hover/focus fill.

## Visual spec

- 400px wide (auto under 600px), `--ddd-radius-xl`, `--ddd-border-sm` in `ddd-scheme-border`, `--ddd-boxShadow-sm`, `--ddd-spacing-2` margin.
- Surface and ink switch with the scheme: white / `coalyGray`. Title is 24px bold `nittanyNavy` (white in dark).
- Description is 16px with a fixed height of `--ddd-card-height` (88px) and scrolls if longer.
- Button: full width, `nittanyNavy` fill, white Roboto Condensed bold 16px, `--ddd-radius-xl`. On hover/focus it fills with `--ddd-theme-primary`; the text turns black when `--lowContrast-override` is set.

## Do / don't

- Do keep the description to two or three short sentences.
- Do set `alt` whenever `src` is set.
- Don't nest interactive elements in the slot; the whole button area is the link.
- Customise with the CSS hooks `--ddd-card-img-height`, `--ddd-card-height`, `--ddd-card-button-color` and `--ddd-card-content-p-margin`, and the parts `image`, `img`, `title`, `description`, `button-wrapper`, `a` and `button`.

The preview renders the real element from the bundled `@haxtheweb/d-d-d`.
