# reading-analysis

Learners work inside an authored reading. In **flag evidence** mode they pick a flag (a label such as a theme) from a pad that stays pinned to the bottom of the screen, and stick it beside each sentence, paragraph or figure that is evidence for it. Stuck flags hang off the page edge like a reader's sticky tabs; hover or focus one to see its label and light up the passage it marks. In **select one** mode they choose the single passage that best answers the question.

Built on `QuestionElement` (`@haxtheweb/multiple-choice`), so it shares the question shell, attempts, stacking, feedback slots and saved progress with the other question types.

## Usage

```html
<reading-analysis
  question="Identify evidence for each theme."
  mode="flag"
  unit="sentence"
  max-attempts="3"
>
  <h3>Who was afraid of rock and roll?</h3>
  <p>In the early 1950s, record charts in the United States were split by race. ...</p>
  <figure>
    <img src="ticket.svg" alt="Ticket stub marked open seating" />
    <figcaption>A ticket stub from a touring revue.</figcaption>
  </figure>
  <input value="Racism" data-targets="c-bc7f5e43,c-c8ffe489" />
  <input value="Violence" data-targets="c-244fcdea" />
</reading-analysis>
```

- The reading is the default slot: any HTML. It is never changed; the element segments a copy of it in its shadow root.
- `mode`: `flag` (default) or `one`.
- `unit`: `sentence` (default), `paragraph` or `figure`. Figures are always selectable.
- Answer key: one `<input>` per flag, its `data-targets` the ids of the passages it belongs beside. Select-one mode keeps its key in `<input data-select-one data-targets="c-...">`. Ids are `c-` plus 8 hex characters of `kind:text` (`componentId` in `@haxtheweb/user-action/lib/xapi.js`), so reordering keeps them and rewording a passage resets only that passage.
- In HAX, edit the reading in place; use **Mark answers** in the block menu to place the key with the same gestures learners use.

## Learner data

One xAPI `answered` statement per check through `user-engagement`, declared in `static get xapiVocabulary()`. Flag mode is a `choice` interaction whose choices are flag-and-passage pairs (one flag can mark several passages and one passage several flags, which `matching` cannot express); select-one mode is a `choice` over passages.

## Commands

- `yarn start` - development server
- `yarn run build` - format, analyze, write docs data
- `yarn test` - run tests
