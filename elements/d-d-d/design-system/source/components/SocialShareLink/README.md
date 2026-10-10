# SocialShareLink

A link to share content on social.

- Package `@haxtheweb/social-share-link` 26.8.0

## Usage

```html
<social-share-link button-style text="Share on Mastodon" message="DDD design system" type="Mastodon"></social-share-link>
<social-share-link url="https://haxtheweb.org/" mode="text-only" type="Facebook"></social-share-link>
<social-share-link url="https://haxtheweb.org/" button-style mode="icon-only" type="LinkedIn"></social-share-link>
```

## Properties

No HAX settings are declared; these are its public reactive properties.

| Attribute | Type |
|---|---|
| `is-safari` | Boolean |
| `button-style` | Boolean |
| `disabled` | Boolean |
| `image` | String |
| `message` | String |
| `mode` | String |
| `text` | String |
| `type` | String |
| `url` | String |

## DDD usage

Its source references 7 distinct design-system variables. By family: theme (13). Most used: `--ddd-theme-default-white`, `--ddd-theme-default-limestoneGray`, `--ddd-theme-default-slateLight`, `--ddd-theme-default-link`, `--ddd-theme-default-nittanyNavy`, `--ddd-theme-default-coalyGray`.

## Preview notes

Each link opens the network's share page in a new window.
