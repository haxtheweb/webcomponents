# LinkedinEmbed

Embed a LinkedIn profile card.

- Package `@haxtheweb/linkedin-embed` 26.8.0
- HAX block "LinkedIn embed" (Other, social media, linkedin, profile, card)

## Usage

```html
<linkedin-embed vanityname="btopro" locale="en_US"></linkedin-embed>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `vanityname` | Vanity name | LinkedIn vanity username segment. | textfield |
| `locale` | Locale | Locale metadata value such as en_US. | textfield (advanced) |

## Preview notes

Loads LinkedIn's badge script at runtime; without it, only the profile link shows.
