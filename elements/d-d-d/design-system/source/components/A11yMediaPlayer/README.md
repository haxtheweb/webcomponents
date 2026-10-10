# A11yMediaPlayer

A feature rich, highly accessible video player.

- Package `@haxtheweb/a11y-media-player` 26.8.0

## Usage

```html
<a11y-media-player accent-color="pink" linkable media-title="Sample player" thumbnail-src="media/banner.jpg"><video crossorigin="anonymous" controls></video></a11y-media-player>
```

## Properties

No HAX settings are declared; these are its public reactive properties.

| Attribute | Type |
|---|---|
| `fullscreen` | Boolean |
| `fullscreen-enabled` | Boolean |
| `schemamap` | Object |
| `allow-concurrent` | Boolean |
| `audio-only` | Boolean |
| `autoplay` | Boolean |
| `captions-track` | Object |
| `cc` | Boolean |
| `currenttime` | Number |
| `crossorigin` | String |
| `disable-print-button` | Boolean |
| `disable-search` | Boolean |
| `disable-scroll` | Boolean |
| `disable-seek` | Boolean |

## DDD usage

Its source references 17 distinct design-system variables. By family: theme (60), simple-colors (8), font (3), spacing (2). Most used: `--ddd-theme-default-white`, `--ddd-theme-default-coalyGray`, `--ddd-theme-default-black`, `--ddd-theme-default-potentialMidnight`, `--ddd-theme-default-limestoneLight`, `--ddd-theme-default-limestoneMaxLight`.

## Preview notes

No media file ships with this preview, so the player shows its chrome and loading state.
