# arithmetic-drill

A short run of generated arithmetic problems with instant feedback: a start screen, one problem at a time, then the score. It is practice, not a test. Nothing is authored but the settings, and every run is new.

```html
<arithmetic-drill title="Quick math"></arithmetic-drill>

<arithmetic-drill
  title="Division facts"
  operations="multiply divide"
  min="1"
  max="10"
  count="8"
  time-limit="60"
></arithmetic-drill>
```

## Attributes

| Attribute | Property | Default | Notes |
| --- | --- | --- | --- |
| `title` | `title` | `""` | Name of the drill, shown in the header. |
| `operations` | `operations` | `add subtract multiply` | Any of `add`, `subtract`, `multiply`, `divide`, separated by spaces or commas. Unknown words are ignored. |
| `min` | `min` | `2` | Smallest operand. Whole numbers, 0 to 9999. |
| `max` | `max` | `12` | Largest operand. |
| `count` | `count` | `10` | Problems in one run, 1 to 100. |
| `time-limit` | `timeLimit` | `0` | Seconds for a whole run. `0` means no timer. |
| `accent-color` | `accentColor` | none | A SimpleColors name (`blue`, `orange`, ...) for the chip and buttons. Without it they follow the theme palette. |

There are no slots. Methods: `start()`, `turnOffTimer()`, `reset()`.

## The rules the generator keeps

`lib/arithmetic-drill-problems.js` holds them as plain functions, tested with property tests:

- Operands are whole numbers from `min` to `max`.
- Subtraction never goes below zero (the larger number comes first).
- Division is built from a product, so the answer is always a whole number, and the divisor is never zero. The divisor and the answer stay in the range; the number being divided can be larger.
- The same problem is not asked twice in a row when the range allows another.
- Random numbers come from `crypto.getRandomValues`, drawn when a run starts, never while rendering.

## The timer

Off by default, because timed drills fail learners who need more time. When an author sets `time-limit`:

- the start screen has a "Use the timer" checkbox and the run has a "Turn off timer" button, so a learner can always turn it off for themselves;
- the time left is shown as text and is not read out every second. It is announced when the run starts, at the halfway point and at 10 seconds left;
- when time runs out the run ends with what was answered.

## Events

| Event | When | Detail |
| --- | --- | --- |
| `user-engagement` (bubbles, composed) | Start, each answer, end of a run | `{ activityDisplay, objectName, resultCompletion, resultScore, statement }` |
| `learner-progress-request` (on `window`) | The visitor view loads | `{ activityId, tag, record }`; a listener sets `record` |

## Learner record (xAPI)

| Verb | When | Result |
| --- | --- | --- |
| `attempted` | Start is pressed | `completion: false` |
| `progressed` | After each answered problem | the HAX progress extension = answered / count |
| `completed` | Once per run: every problem answered, or the timer ran out | `score.raw` = right, `score.max` = count, `completion: true`, `duration` |

The activity type is `simulation`, as for the other HAX games. The drill counts toward page completion; it is done when a run finished. Nothing is sent while HAX is editing. When a learner progress listener reports that a run was finished on an earlier visit, the header chip shows the done check without celebrating again.

## Keyboard and accessibility

- Each problem is real text. The visible form (`7 × 8 = ?`) is hidden from assistive technology and the input is labelled with the spoken form ("7 times 8").
- Enter in the input, or the Enter button, submits. Focus stays in the input from one problem to the next. Something that is not a whole number is not counted; a hint asks for a number.
- Feedback carries a word, an icon, a line style and a color (correct: green, solid, check; incorrect: purple, dotted, cross, with the right answer), and is announced with the next problem through a polite live region.
- Progress is text ("Problem 3 of 10"). At the end, focus moves to the score.
- Operation buttons are toggle buttons (`aria-pressed`); an operation that is on has a filled button and a check mark, one that is off a dashed outline.
- Colors come from DDD tokens and work in dark mode. The only motion is the completion burst on the header chip, which does not play with reduced motion.

## HAX

Configure: title, operations, smallest and largest number, number of problems. Advanced: time limit, accent color. While editing, Start does nothing and no learner state is kept.

## Commands

- `yarn start` - development server
- `yarn run build` - format, analyze and refresh the docs data
- `yarn test` - run the tests
