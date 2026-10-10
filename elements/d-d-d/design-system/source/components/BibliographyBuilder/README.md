# BibliographyBuilder

A tool for creating and managing bibliographies.

- Package `bibliography-builder` 26.8.0
- HAX block "Bibliography builder" (Content, portfolio, citation, reference, bibliography)

## Usage

```html
<bibliography-builder><bibliography-item title="Make your own citation"></bibliography-item></bibliography-builder>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `default slot` | Citations | Citation items in this bibliography | code-editor |
| `for-course` | Course | Identifier or name of the Course this bibliography is for (OER Schema forCourse). | textfield |

## DDD usage

Its source references 10 distinct design-system variables. By family: spacing (9), border (5), font (4), icon (2), radius (1). Most used: `--ddd-spacing-2`, `--ddd-spacing-4`, `--ddd-border-xs`, `--ddd-font-navigation`, `--ddd-icon-xs`, `--ddd-border-md`.
