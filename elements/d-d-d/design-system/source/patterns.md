# Pattern library

`DDDPatternLibrary.js` turns the tokens into a registry of patterns, in atomic levels, built from HAX web components. It has 69 patterns and 10 internal contracts. The `hax-pattern-library-audit` skill checks components against this registry.

- **Recipe-only** patterns are documentation: how to compose tokens and components.
- **Gate-published** patterns appear in the HAX authoring rail. They come either from `demoSchemaOverride` on a component that ships `haxProperties`, or from a `stax-area` or `stax-page` layout. Only components that ship `haxProperties` can be gate-published.

## Atoms (8, all recipe-only)

Heading pairings (colour, size, letter spacing, line height) · link + chevron · heading horizontal and vertical line treatments · drop cap · double-slash after headers · icon sizing with `--ddd-icon-*` · gradient surface · palette preview.

Several atoms close the "logical gaps" the DDD source lists.

## Molecules (21)

| Pattern | Component | Published |
|---|---|---|
| Media object | media-image | stax-area |
| Stat block | count-up | stax-area |
| Pill / tag | simple-tag | demoSchemaOverride |
| Callout (status variants) | stop-note | demoSchemaOverride |
| Link tile | accent-card | demoSchemaOverride |
| Avatar byline | author-card | demoSchemaOverride |
| Badge chip | figure-label | demoSchemaOverride |
| Pull quote | block-quote | demoSchemaOverride |
| CTA button | simple-cta | demoSchemaOverride |
| Self-check question | self-check | demoSchemaOverride |
| Figure with caption | a11y-figure | demoSchemaOverride |
| Form field | simple-fields | demoSchemaOverride |
| Audio player | audio-player | demoSchemaOverride |
| Count display | count-up | demoSchemaOverride |
| QR code | q-r | demoSchemaOverride |
| Tag / pill list, Breadcrumb, Toast, Progress bar, Social share, Promise progress | (various) | recipe-only |

## Organisms (34)

Gate-published: hero · feature card grid · FAQ accordion · testimonial · media playlist · timeline · data table · tabs · steps (`ddd-steps-list`) · empty state · contact form · settings panel · learning objectives · quiz · flashcard set · video feature · chart · stats grid · post header · post list · banner · newsletter · sidebar layout · two column · vocabulary term · course syllabus · category list.

Recipe-only: pagination · page contents menu · carousel · footer · site header · site menu · site top menu.

## Templates (6, stax-page)

Landing · Article / blog post · Course module · Profile / bio · FAQ page · Gallery / portfolio.

## Internal contracts (10)

Shared internals that several elements must render the same way: element title/caption · callout/status box · collapsible heading · click-to-reveal trigger · iframe/embed wrapper · admin fieldset · site menu · site footer · site title typography · theme header composition. The theme header contract covers all 13 DDD-based themes: learn-two, chamfer, journey, twenty-six, training, haxma, resume, spacebook, clean-portfolio, glossy-portfolio, polaris, clean-one and clean-two.
