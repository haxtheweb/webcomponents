# StopNote

A message to alert readers to specific directions.

- Package `@haxtheweb/stop-note` 26.8.0
- HAX block "Stop Note" (Instructional, content, layout, pedagogy, warning)

## Usage

```html
<stop-note title="Hold up there"><p slot="message"><strong>Read these important things!</strong>
</p>
</stop-note>
<stop-note title="Warning" icon="stopnoteicons:warning-icon"><p slot="message">You can write any warning message you want here.</p>
</stop-note>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `title` | Title | Enter title for stop-note. | textfield |
| `url` | URL | Enter an external url. | haxupload |
| `status` | Status | Setting status changes the colors and icons to match | select |
| `slot "message"` | Note Text | IText for the stop-note. | textfield |

## DDD usage

Its source references 25 distinct design-system variables. By family: theme (23), spacing (8), component (6), font (3), icon (2), border (1). Most used: `--ddd-theme-default-errorLight`, `--ddd-spacing-2`, `--ddd-component-stop-note-icon-background`, `--ddd-component-stop-note-text-background`, `--ddd-spacing-5`, `--ddd-icon-4xl`.
