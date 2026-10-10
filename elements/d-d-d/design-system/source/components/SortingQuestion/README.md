# SortingQuestion

Sort items into the correct order.

- Package `@haxtheweb/sorting-question` 26.8.0
- HAX block "Sorting Question" (Instructional, self check, sorting, question, quiz)
- HAX design-system controls offered: accent, primary

## Usage

```html
<sorting-question question="Sorting these in numerical order"><p slot="evidence">Self evident, Refer back to 1st grade</p><p slot="hint">Consider that numbers tend to go zero, one, two...</p><input value="1" /><input value="2" /><input value="3" /></sorting-question>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `question` | Question | Question Header. | textfield |
| `grading-format` | Grading format | OER Schema: grading format for this assessment (e.g. points, letter, percent, completion). | textfield |
| `has-learning-objective` | Learning objective | OER Schema: learning objective associated with this assessment. | textfield |
| `for-course` | Course | OER Schema: course this assessment is intended for. | textfield |
| `answers` | Answers | Answer order defines the correct sequence. | array |

## DDD usage

Its source references 29 distinct design-system variables. By family: theme (18), spacing (12), radius (8), font (8), border (6), simple-colors (5). Most used: `--ddd-radius-xs`, `--ddd-spacing-4`, `--ddd-font-navigation`, `--ddd-spacing-8`, `--simple-colors-default-theme-accent-12`, `--ddd-font-size-xs`.
