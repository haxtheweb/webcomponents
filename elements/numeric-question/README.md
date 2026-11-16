# numeric-question

A question the learner answers by typing a number. The unit is shown as text beside the field, and the answer counts when it is within a tolerance of the exact value. The answer is either a fixed number or a formula worked out from variables, so one element covers both the Numerical and the Formula question types of an LMS.

Built on `QuestionElement` (`@haxtheweb/multiple-choice`), so it shares the question shell, attempts, stacking, feedback slots and saved progress with the other question types.

## Usage

```html
<numeric-question
  question="A cyclist rides {d} km in {t} minutes. What is her average speed?"
  unit="km/h"
  tolerance="1"
  tolerance-type="percent"
  decimals="1"
  max-attempts="3"
>
  <p slot="hint">The time is in minutes but the answer is per hour.</p>
  <input type="checkbox" value="d / (t / 60)" data-correct="true" />
  <input type="checkbox" data-variable="d" data-min="12" data-max="30" data-step="1" />
  <input type="checkbox" data-variable="t" data-min="30" data-max="90" data-step="5" />
</numeric-question>
```

A fixed answer is the same without variables: `<input type="checkbox" value="100" data-correct="true" />`.

## Attributes

| Attribute | Default | What it does |
|---|---|---|
| `question` | | The question. `{name}` is replaced with the value of the variable `name`. |
| `unit` | | Text shown beside the field, for example `km/h`. |
| `tolerance` | `0` | How far from the exact answer still counts. |
| `tolerance-type` | `absolute` | `absolute` (plus or minus the tolerance) or `percent` (plus or minus that percent of the exact answer). |
| `decimals` | | Decimal places. Learners are asked to round to it, the answer is shown rounded to it, and an answer rounded to it always counts. |
| `max-attempts` | `0` | Checks allowed; `0` is unlimited. |
| `reroll` | off | Draw new variable values on every Try again (see below). |
| `quiz-name`, `collapsible`, `collapsed`, `typeof` | | As on every `QuestionElement`. |

## The key

The key lives in light DOM `<input>` children that are read once and then removed from the page, the same as the other question types:

- one input whose `value` is the answer: a number (fixed answer, property `answer`) or a formula (property `formula`);
- one input per variable: `data-variable` (name), `data-min`, `data-max`, `data-step` (property `variables`, `[{ name, min, max, step }]`).

In HAX the key is edited on the block itself while editing (the "Answer key" panel, which shows the answer for the current values) or in the block settings. It is saved back as the same inputs and never as attributes.

Formulas are worked out by a small evaluator in `lib/numeric-formula.js`, never run as code. It supports numbers, variable names, `+ - * / ^`, parentheses, unary minus, `sqrt()` and `abs()`. Anything else gives no answer, and the question then tells learners it is not set up rather than marking them wrong.

## Variable values

By default each variable's value is picked from a hash of the activity key (the element `id`, else its authored `resource`, else a fingerprint of the question). Every learner sees the same numbers on every visit, so a saved answer can be put back.

With `reroll`, values are drawn from `crypto.getRandomValues` when the question loads and on every Try again. A returning learner then gets their status and attempts back, not the number they typed, because it belonged to other numbers.

## Slots

`hint` and `feedbackIncorrect` show after a wrong answer, `feedbackCorrect` and `evidence` after a correct one, `content` is related content. No feedback text is built in beyond the result.

## Events

- `user-engagement`: after every check; `detail.statement` is the xAPI statement.
- `question-element-state`: after every check (see `QuestionElement`).

## Learner data

One xAPI `answered` statement per check, declared in `static get xapiVocabulary()`: interaction type `numeric`, `correctResponsesPattern` the accepted range as `min[:]max`, `result.response` the number typed. With variables, `context.extensions` carries `https://haxtheweb.org/xapi/extensions/variables`: the values this attempt drew (`{ "d": 18, "t": 45 }`), so the answer can be checked against the numbers the learner saw.

## Keyboard and accessibility

- A native text field with `inputmode="decimal"` and a visible label; the unit and rounding hint are its description.
- A comma or a point is the decimal separator. Enter checks the answer.
- Something that is not a number gets a "Needs input" message in a live region. It is not marked incorrect and does not use an attempt.
- Correct, incorrect, needs input and revealed each have their own line style, icon and word, from the `--ddd-status-*` tokens.

## Commands

- `yarn start` - development server
- `yarn run build` - format, analyze, write docs data
- `yarn test` - run tests
