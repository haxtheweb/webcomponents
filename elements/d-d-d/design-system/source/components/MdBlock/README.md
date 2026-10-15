# MdBlock

A block of markdown content directly or remote loaded.

- Package `@haxtheweb/md-block` 26.8.0
- HAX block "Markdown" (Other, md, markdown, content, text)

## Usage

```html
<md-block markdown="- The first bulleted item in a long list.."></md-block>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `markdown` | Markdown | Raw markdown | textarea |
| `source` | Source | Source file for markdown | haxupload |

## DDD usage

Its source references 4 distinct design-system variables. By family: theme (2), font (2). Most used: `--ddd-theme-default-link`, `--ddd-font-primary`, `--ddd-theme-default-error`, `--ddd-font-size-xs`.
