# HaxAppInstaller

A step-by-step installer for HAXcms: choose a language, verify requirements, configure the system and start HAXing.

- Package `@haxtheweb/hax-app-installer` 26.8.0

## Usage

```html
<hax-app-installer></hax-app-installer>
```

## Properties

No HAX settings are declared; these are its public reactive properties.

| Attribute | Type |
|---|---|
| `is-safari` | Boolean |
| `step` | Number |
| `language` | String |
| `api-endpoint` | String |
| `statedata` | Object |
| `loading` | Boolean |
| `error` | String |

## DDD usage

Its source references 59 distinct design-system variables. By family: spacing (96), primary (95), font (64), accent (54), icon (46), theme (28). Most used: `--ddd-accent-6`, `--ddd-spacing-2`, `--ddd-spacing-3`, `--ddd-icon-4xs`, `--ddd-spacing-6`, `--ddd-font-weight-bold`.

## Preview notes

Talks to a HAXcms backend; with none present the preview shows its error state.
