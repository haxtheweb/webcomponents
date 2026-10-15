# PageBreak

Define a visual split between pages which CMSs can use to create pages.

- Package `@haxtheweb/page-break` 26.8.0
- HAX block "Page details" (Other)

## Usage

```html
<page-break published status="new" title="New page" data-hax-ray="Page break"></page-break>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `title` | Title | Title shown in the theme and first heading. | textfield |
| `page-type` | Type | Visual page context label. | select |
| `tags` | Tags | Comma-separated list of tags. | textfield |
| `link-url` | Link URL | Redirect URL shown instead of page content. | textfield |
| `link-target` | Link Target | Open links in the same window or a new window. | select |
| `published` | Published | Unpublished pages are hidden from end users. | boolean (advanced) |
| `locked` | Lock page | Lock or unlock all elements on this page. | boolean (advanced) |
| `override-pathauto` | Override automatic slug | Lock the slug from automatic updates based on title or parent. | boolean (advanced) |
| `slug` | Path | URL slug for this page. | textfield (advanced) |
| `image` | Media | Media that represents the page, used in some themes and views. | haxupload (advanced) |
| `parent` | Parent | Path of the parent page. | textfield (advanced) |
| `noderefs` | Related content | Pages related to this page. | array (advanced) |

## DDD usage

Its source references 26 distinct design-system variables. By family: theme (38), spacing (23), font (7), radius (6), border (5), boxShadow (3). Most used: `--ddd-spacing-2`, `--ddd-theme-default-limestoneGray`, `--ddd-theme-default-white`, `--ddd-theme-default-coalyGray`, `--ddd-spacing-1`, `--ddd-theme-default-skyBlue`.
