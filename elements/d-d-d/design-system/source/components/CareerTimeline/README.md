# CareerTimeline

A career timeline containing organizations, roles, and other data.

- Package `career-timeline` 26.8.0
- HAX block "Career timeline" (Content, portfolio, career, timeline, resume)
- HAX design-system controls offered: accent, primary, card, text

## Usage

```html
<career-timeline title="Career Timeline"><career-org-item organization="Add Organization" location="Enter Location"></career-org-item></career-timeline>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `title` | Timeline Title | A title for the career timeline (OER Schema: oer:name). | textfield |

## DDD usage

Its source references 12 distinct design-system variables. By family: spacing (8), border (3), icon (3), font (2), theme (1). Most used: `--ddd-spacing-4`, `--ddd-spacing-2`, `--ddd-border-sm`, `--ddd-icon-4xs`, `--ddd-font-navigation`, `--ddd-border-md`.
