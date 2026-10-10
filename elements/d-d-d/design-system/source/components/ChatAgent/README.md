# ChatAgent

Chatbot agent style chat widget.

- Package `@haxtheweb/chat-agent` 26.8.0

## Usage

```html
<!doctype html>
<html>
<head>
<meta charset="utf-8">
</head>
<body class="show-chat-agent">
<p>chat-agent is a floating widget: it pins itself to the lower-right corner of the page rather than rendering inline.</p>
</body>
</html>
```

## Properties

No HAX settings are declared; these are its public reactive properties.

| Attribute | Type |
|---|---|
| `is-safari` | Boolean |
| `is-full-view` | Boolean |
| `is-interface-hidden` | Boolean |

## DDD usage

Its source references 36 distinct design-system variables. By family: spacing (56), theme (47), radius (18), primary (13), font (9), icon (6). Most used: `--ddd-spacing-2`, `--ddd-theme-default-white`, `--ddd-theme-default-coalyGray`, `--ddd-spacing-0`, `--ddd-spacing-1`, `--ddd-spacing-3`.

## Preview notes

Floats over the lower-right corner of the page. Answers need the HAX AI backend; the preview shows the launcher.
