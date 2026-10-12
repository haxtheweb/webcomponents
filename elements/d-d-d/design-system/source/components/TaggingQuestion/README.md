# TaggingQuestion

Select tags to answer the question.

- Package `@haxtheweb/tagging-question` 26.8.0
- HAX block "Tagging Question" (Instructional, self check, assessment, tag)
- HAX design-system controls offered: primary, accent

## Usage

```html
<tagging-question question="What does the fox say?" data-accent="2"><input data-correct="true" value="DingDingDing"/><input data-correct="true" value="PaPaPower"/><input value="Moo"/></tagging-question>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `question` | Question | Question for users to respond to. | textfield |
| `grading-format` | Grading format | OER Schema: grading format for this assessment (e.g. points, letter, percent, completion). | textfield |
| `has-learning-objective` | Learning objective | OER Schema: learning objective associated with this assessment. | textfield |
| `for-course` | Course | OER Schema: course this assessment is intended for. | textfield |
| `answers` | Answers |  | array |

## DDD usage

Its source references 16 distinct design-system variables. By family: theme (15), spacing (10), radius (4), border (3), font (2). Most used: `--ddd-theme-default-coalyGray`, `--ddd-radius-sm`, `--ddd-spacing-5`, `--ddd-theme-default-limestoneLight`, `--ddd-spacing-4`, `--ddd-border-sm`.
