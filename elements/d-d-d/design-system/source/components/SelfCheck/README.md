# SelfCheck

Users can complete a self-check.

- Package `@haxtheweb/self-check` 26.8.0
- HAX block "Self Check" (Instructional, media, self check, pedagogy, quiz)

## Usage

```html
<self-check accent-color="primary" title="Sharks Self Check" image="media/card-2.jpg" alt="Great White Shark"><p slot="question">How large can the average great white shark grow to be?</p><p>The Great White shark can grow to be 15 ft to more than 20 ft in length and weigh 2.5 tons or more.</p></self-check>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `image` | Image | Image for the self-check. | haxupload |
| `title` | Title | Title of the self-check. | textfield |
| `alt` | Alt Text | Alt text for the image. | alt |
| `slot "question"` | Question |  | textarea |
| `default slot` | Answer |  | textarea |
| `accent-color` | Theme Color | Choose a theme color from the design system. | select |
| `has-learning-objective` | Learning Objective | Learning objective reference emitted as oer:hasLearningObjective. | textfield |
| `assessing` | Assessing | Activity reference emitted as oer:assessing. | textfield |
| `link` | More link | Link to additional information. | textfield (advanced) |

## DDD usage

Its source references 46 distinct design-system variables. By family: theme (34), spacing (26), component (18), simple-colors (6), icon (6), radius (3). Most used: `--ddd-component-self-check-title-background`, `--ddd-theme-default-white`, `--ddd-spacing-3`, `--ddd-spacing-5`, `--ddd-spacing-6`, `--ddd-spacing-4`.
