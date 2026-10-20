# bullet-check-list

A bulleted or numbered list of real checkboxes, styled like `stop-note`. Reader
progress is saved to `localStorage` on their own machine.

## Usage

```html
<bullet-check-list
  title="Before you begin"
  storage-id="week-1-prep"
  items='[{"label":"Read the syllabus"},{"label":"Already done","checked":true}]'
></bullet-check-list>
```

## Properties

- `title` - visible heading and accessible name of the checkbox group
- `items` - array of `{label, checked?, disabled?}`; `checked`/`disabled` items are locked
- `ordered` - numbered list
- `status` - `info` (default), `success`, `warning`, `stop`
- `storage-id` - optional id for the storage key

## Storage key

`bullet-check-list:v1:<location.pathname>:<id>[:<n>]` where `<id>` is `storage-id`
or an FNV-1a fingerprint of the title and labels, and `<n>` disambiguates identical
lists on one page (omitted for the first). Value: `{"v":1,"checked":[labels]}`.
If storage is unavailable the list works for the session only.

## Events

- `user-engagement` with `activityDisplay` `progressed` / `completed`
- `bullet-check-list-changed` with `{checked, done, total}`

## CSS custom properties

`--ddd-component-bullet-check-list-text-color`, `-background`, `-icon-background`,
`-border`, `-focus`

## Development

```
yarn start
yarn test
```
