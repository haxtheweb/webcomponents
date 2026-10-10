# WikipediaQuery

This can display a wikipedia article in context in a variety of formats.

- Package `@haxtheweb/wikipedia-query` 26.8.0
- HAX block "Wikipedia" (Other, creative commons, wikipedia, search, web)

## Usage

```html
<wikipedia-query search="Internet"></wikipedia-query>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `search` | Article name | Word to search wikipedia for. | textfield |
| `hide-title` | Hide title | Whether or not to render the title of the article. | boolean |
| `language` | Language | The language of the article. | select |

## DDD usage

Its source references 15 distinct design-system variables. By family: spacing (7), theme (5), font (4), radius (2), border (1), lh (1). Most used: `--ddd-spacing-2`, `--ddd-radius-xs`, `--ddd-spacing-4`, `--ddd-spacing-32`, `--ddd-theme-default-limestoneMaxLight`, `--ddd-theme-primary`.

## Preview notes

Fetches the article from Wikipedia at runtime; the preview shows the citation and frame without the text.
