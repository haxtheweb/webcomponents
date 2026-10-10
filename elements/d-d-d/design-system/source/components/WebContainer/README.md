# WebContainer

Runs a Node.js project in the browser through the WebContainer API, with a terminal and a live preview.

- Package `@haxtheweb/web-container` 26.8.0
- HAX block "NodeJS Container" (Other, web, developer, code)
- HAX design-system controls offered: accent, card

## Usage

```html
<web-container><template>npm install @haxtheweb/create</template></web-container>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `hide-editor` | Hide editor | Hide the file editing interface. | boolean |
| `hide-terminal` | Hide terminal | Hide the terminal for auto-running programs. | boolean |
| `hide-window` | Hide window | Hide the output window for terminal-only use. | boolean |
| `default slot` | Commands | Commands (one per line) to run before loading. | code-editor |

## DDD usage

Its source references 11 distinct design-system variables. By family: theme (7), font (4), primary (1). Most used: `--ddd-font-navigation`, `--ddd-theme-primary`, `--ddd-theme-accent`, `--ddd-theme-default-infoLight`, `--ddd-theme-default-info`, `--ddd-font-size-xxs`.

## Preview notes

Needs the WebContainer API and cross-origin isolation, which this preview frame does not provide.
