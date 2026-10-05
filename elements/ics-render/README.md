# ics-render

Render a calendar file (`.ics`) in place as date cards, a timeline, a table or a list.

Point `data-source` at a file and it is fetched once the element scrolls into
view, parsed in the browser and rendered. Parsing is local: the file's contents
are never sent anywhere to be read, so this works offline and on premises.
`calendar-data` takes the same file contents inline instead, which is what
the demo and the tests use.

## Use

```html
<ics-render data-source="files/schedule.ics" display-as="cards"></ics-render>
```

| Property       | Attribute       | What it does                                                 |
| -------------- | --------------- | ------------------------------------------------------------ |
| `dataSource`   | `data-source`   | URL of the `.ics` file                                       |
| `calendarData` | `calendar-data` | File contents, for rendering without a fetch                 |
| `displayAs`    | `display-as`    | `cards` (the default), `timeline`, `table` or `list`         |
| `caption`      | `caption`       | Heading above the output, and the table caption              |
| `status`       | `status`        | `idle`, `loading`, `ready` or `error`, reflected for styling |

## What it reads

`VEVENT` blocks become events, sorted by start date. `SUMMARY`, `DTSTART`,
`DTEND`, `LOCATION`, `DESCRIPTION`, `CATEGORIES`, `STATUS` and `URL` are read,
along with the calendar's own `X-WR-CALNAME`.

Folded lines are joined before anything is read, and `VTIMEZONE` and `VALARM`
blocks are skipped so their own `DTSTART` and `DESCRIPTION` cannot be mistaken
for an event's.

A `DTSTART` ending in `Z` is a real instant, so it is shown in the reader's own
timezone. An all day date (`VALUE=DATE`) or a time in a named zone (`TZID`) is
shown as the file writes it, because converting a wall clock time without the
zone's rules would move the event to a time the file never states.

A recurring event is shown once, at its first occurrence, and flagged as
repeating. Expanding an `RRULE` into its occurrences is a calendar engine's job
and guessing at it would invent dates.

## Accessibility

The cards are exposed as a list (`role="list"` with a `listitem` per entry) so
assistive technology announces how many there are. The waiting line is
`aria-live="polite"` and a file that could not be read is reported in a
`role="alert"`, rather than leaving an empty space. The element adds no
interactive controls and no keyboard traps of its own; keyboard behaviour inside
a mode is whatever the element rendering it provides (the timeline's events take
focus, the list's entries are links). Dates and times are rendered as text in
the reader's locale, not as images.

This element defines no CSS custom properties of its own; colours, spacing and
type come from DDD tokens, and it sets no background, so it inherits light and
dark themes from the page.

## Commands

- `yarn start` - development server
- `yarn run build` - build and analyze
- `yarn run test` - run tests

# Credits

A brighter future dreamed and developed by the Penn State [HAXTheWeb](https://hax.psu.edu/) initiative.
