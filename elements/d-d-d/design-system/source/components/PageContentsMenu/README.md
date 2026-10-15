# PageContentsMenu

Links that jump you to the right place in the page's content.

- Package `@haxtheweb/page-contents-menu` 26.8.0

## Usage

```html
<div style="display:flex;gap:24px;align-items:flex-start">
  <page-contents-menu id="pcm" style="min-width:220px"></page-contents-menu>
  <div id="content"><h2>Introduction</h2><p>Body text.</p><h3>Background</h3><p>Body text.</p><h2>Method</h2><p>Body text.</p><h3>Results</h3><p>Body text.</p></div>
</div>
```

## Properties

No HAX settings are declared; these are its public reactive properties.

| Attribute | Type |
|---|---|
| `schemamap` | Object |
| `contentcontainer` | Object |
| `relationship` | String |
| `items` | Array |
| `position` | String |
| `mobile` | Boolean |
| `label` | String |
| `hidesettings` | Boolean |
| `hide-if-empty` | Boolean |
| `is-empty` | Boolean |

## DDD usage

Its source references 12 distinct design-system variables. By family: font (7), spacing (3), theme (2), accent (1). Most used: `--ddd-font-size-3xs`, `--ddd-font-navigation`, `--ddd-font-weight-light`, `--ddd-theme-default-link`, `--ddd-theme-default-linkLight`, `--ddd-accent-6`.
