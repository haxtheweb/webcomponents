# quick-poll

A poll: a question with no right answer, where the point is seeing how everyone answered.

It differs from `multiple-choice` (graded) and `self-check` (reveals an answer): nothing is judged, and the results are an aggregate across learners.

```html
<quick-poll question="When a layout breaks, what do you do first?">
  <input value="Open DevTools" />
  <input value="Rewrite the CSS" />
  <input value="Ask a classmate" />
  <input value="Search the error" />
</quick-poll>
```

The learner picks one option and presses **Vote**. Pressing Vote with nothing picked says "Pick an option first." After voting, the vote cannot be changed in the same visit unless `allow-change` is set.

## Anonymous

The poll never sends a name or any identity. The vote event and the endpoint request carry the activity id and the id of the option chosen, nothing else. Requests to another origin are sent without cookies or HTTP credentials.

(The learner's own record, through `user-engagement`, is a separate thing: the page's learner-record listener decides who the actor is, as it does for every activity.)

## Attributes and properties

| Attribute | Property | Default | What it does |
|---|---|---|---|
| `question` | `question` | `""` | The question, shown as the block title. |
| (light DOM) | `options` | `[]` | The options, `[{ label }]`. Authored as `<input value="...">` children, which stay in the page unchanged. |
| `show-results` | `showResults` | `after` | When the learner sees results: `after` (after voting), `closed` (after `closes` passes), `never` (instructor only). |
| `closes` | `closes` | `""` | Date-time the poll closes, e.g. `2026-12-01T17:00`. Voting stops then. |
| `allow-change` | `allowChange` | `false` | Let the learner change their vote in the same visit. |
| `endpoint` | `endpoint` | `""` | Optional http(s) address that counts votes (below). |
| | `results` | `null` | Counts set by a host: an object of option id to number. |
| `accent-color` | `accentColor` | | Optional accent for the chip, markers and Vote button (the names `DDDAccent.js` maps). |
| | `choices` (read only) | | `[{ id, label }]`: the options with their ids. |
| | `vote` (read only) | `""` | Id of the option the learner voted for. |

Option ids are `c-` plus 8 hex characters of a hash of the option text, so reordering keeps them and rewording an option gives it a new id.

There are no slots. `<input>` children are data and are not displayed.

## Results

The element works with no backend: with no results source it shows "Your vote is in: (option)" only. Results appear when a host supplies them, either way:

1. **`results` property.** A host or plugin sets `poll.results = { "<optionId>": 14, ... }`, usually after hearing `quick-poll-vote`.
2. **`endpoint` attribute.** On vote the poll POSTs JSON `{ "activityId": "...", "choice": "<optionId>" }` (plus `"previous": "<optionId>"` when a vote is being changed). On load, for a learner who may see results, it GETs `?activityId=...`. Both answer `{ "counts": { "<optionId>": <number> } }`.

The endpoint must be `http:` or `https:` and is resolved against the page. If a request fails the vote is kept and the poll says results are unavailable. A response never replaces a `results` value set while it was in flight. With `show-results="never"` the counts in a response are not kept on the learner's page.

When shown, results are one row per option with the label, percent and count as text; the bar is decoration. The learner's own choice is marked with the words "your vote" and an icon.

## Events

| Event | Detail | When |
|---|---|---|
| `quick-poll-vote` | `{ activityId, choice, label, previous }` | A vote was cast. Bubbles, composed. `previous` is the replaced option id on a changed vote, else `""`. |
| `user-engagement` | `{ activityDisplay, objectName, statement }` | The xAPI statement for the vote. Bubbles, composed. |
| `learner-progress-request` (on `window`) | `{ activityId, tag, record }` | On load, to restore the learner's vote. |

## xAPI

One statement per vote: verb `answered`, interaction type `choice`, `definition.choices` = the options, `result.response` = the chosen option's id, `result.completion: true`. There is no `result.success` and no `correctResponsesPattern`, because nothing is judged. It counts toward page completion; done means voted.

The learner's vote is restored from the learner record; an id that is no longer an option is ignored. Nothing is sent, restored or posted while HAX is editing.

## Keyboard and accessibility

- The options are a real radio group named by the question: Tab enters it, arrow keys move between options, Space selects.
- Vote, the directions toggle (the info button in the header) and Change vote are buttons.
- "Pick an option first.", "Thanks, your vote counted." and the results are announced through a live region; focus moves to that message after voting.
- Chosen option and "your vote" never rely on colour alone. Accent colours are decoration; the needs-input and voted messages use DDD status tokens with an icon and words.
- Works at 360px wide, in dark mode and with reduced motion (the only motion is the header chip's completion burst).

## Commands

- `yarn start` - development server
- `yarn run build` - format, analyze and refresh the docs data
- `yarn test` - run tests (web-test-runner, Chromium)
