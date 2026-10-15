# FlashCard

Practice concepts with front-and-back flash cards.

- Package `@haxtheweb/flash-card` 26.8.0
- HAX block "Flash card" (Instructional, self check, flash card, quiz, educational)

## Usage

```html
<flash-card speak img-source="media/card-1.jpg" listen><p slot='front'>What is strawberry in Spanish</p><p slot='back'>fresa</p></flash-card>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `slot "front"` | Front of the Card | Front text or question. | textfield |
| `slot "back"` | Back of the Card | Expected answer. | textfield |
| `img-source` | Image Source | Image file used for the card. Overrides Image Keyword. | haxupload |
| `type-of-action` | Type of Action | OER Schema: the type of action this practice involves (e.g. Reading, Writing, Making, Researching, Listening, Watching, Reflecting, Discussing, Observing, Presenting, Assess). | textfield |
| `has-learning-objective` | Learning Objective | OER Schema: ID or URL of the learning objective this practice supports. | textfield |
| `dark` | Dark | Use dark mode. | boolean (advanced) |
| `accent-color` | Accent Color | Card accent color. | colorpicker (advanced) |
| `img-keyword` | Image Keyword | Random image keyword. Overridden by Image Source. | textfield (advanced) |

## DDD usage

Its source references 29 distinct design-system variables. By family: theme (58), spacing (15), font (10), radius (9), border (4), boxShadow (3). Most used: `--ddd-theme-default-white`, `--ddd-theme-default-coalyGray`, `--ddd-spacing-4`, `--ddd-spacing-2`, `--ddd-theme-default-wonderPurple`, `--ddd-font-navigation`.
