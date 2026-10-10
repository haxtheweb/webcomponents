# MultipleChoice

Multiple-choice self-check question.

- Package `@haxtheweb/multiple-choice` 26.8.0
- HAX block "Multiple choice" (Instructional, quiz, form, multiple, self check)
- HAX design-system controls offered: accent, primary

## Usage

```html
<multiple-choice question="Which is correct?" single-option randomize><input type="checkbox" value="Answer 1" data-correct="true">
<input type="checkbox" value="Another potential answer"></multiple-choice>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `question` | Question | Question for users to respond to. | textfield |
| `randomize` | Randomize | Randomize answers dynamically. | boolean |
| `single-option` | Single answer | Allow only one answer. | boolean |
| `grading-format` | Grading format | OER Schema: grading format for this assessment (e.g. points, letter, percent, completion). | textfield |
| `has-learning-objective` | Learning objective | OER Schema: learning objective associated with this assessment. | textfield |
| `for-course` | Course | OER Schema: course this assessment is intended for. | textfield |
| `answers` | Answers |  | array |

## DDD usage

Its source references 38 distinct design-system variables. By family: theme (30), spacing (17), font (12), simple-colors (10), border (5), radius (4). Most used: `--ddd-spacing-2`, `--ddd-spacing-4`, `--ddd-font-navigation`, `--simple-colors-default-theme-grey-12`, `--ddd-border-sm`, `--ddd-icon-xs`.
