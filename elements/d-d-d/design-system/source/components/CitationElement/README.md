# CitationElement

Citation element with three presentation modes.

- Package `@haxtheweb/citation-element` 26.8.0
- HAX block "Citation" (Text, content, citation, reference, cc0)

## Usage

```html
<citation-element creator="Cool Joe" license="by" title="Te Futr Da Biz" source="https://duckduckgo.com/" date="03/07/2020"></citation-element>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `title` | Title | Title of the cited work. | textfield |
| `source` | Source link | Source URL for the cited work. | textfield |
| `date` | Date accessed | Date the source was accessed. | textfield |
| `scope` | Scope | Element scope to cite. | select |
| `license` | License | License for the cited work. | select |
| `creator` | Creator | Creator or owner of the cited work. | textfield |
| `typeof` | OER Schema type | OER Schema class for this citation. Defaults to oer:ReferencedMaterial; override only with a valid OER class (e.g. oer:SupportingMaterial). | textfield |

## DDD usage

Its source references 3 distinct design-system variables. By family: spacing (2), theme (1), font (1). Most used: `--ddd-spacing-2`, `--ddd-theme-default-link`, `--ddd-font-weight-bold`.
