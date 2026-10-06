# vcf-render

Render a contact file (`.vcf`) in place as person cards, quotes, a table or a list.

Point `data-source` at a file and it is fetched once the element scrolls into
view, parsed in the browser and rendered. Parsing is local: the file's contents
are never sent anywhere to be read, so this works offline and on premises.
`contact-data` takes the same file contents inline instead, which is what
the demo and the tests use.

## Use

```html
<vcf-render data-source="files/directory.vcf" display-as="cards"></vcf-render>
```

| Property      | Attribute      | What it does                                                 |
| ------------- | -------------- | ------------------------------------------------------------ |
| `dataSource`  | `data-source`  | URL of the `.vcf` file                                       |
| `contactData` | `contact-data` | File contents, for rendering without a fetch                 |
| `displayAs`   | `display-as`   | `cards` (the default), `quotes`, `table` or `list`           |
| `caption`     | `caption`      | Heading above the output, and the table caption              |
| `status`      | `status`       | `idle`, `loading`, `ready` or `error`, reflected for styling |

## What it reads

Each `VCARD` becomes a contact. `FN`, `N`, `ORG`, `TITLE`, `ROLE`, `TEL`,
`EMAIL`, `ADR`, `URL`, `PHOTO`, `NOTE`, `NICKNAME`, `BDAY`, `KIND` and
`CATEGORIES` are read. A missing `FN` is assembled from `N`, then `ORG`, then
the first email, so a card without a formatted name still has something to show.

Folded lines are joined before anything is read, which is also what keeps an
embedded `AGENT` card part of its contact rather than turning it into a separate
entry. vCard 2.1 bare parameters (`TEL;WORK;VOICE:`) and repeated types
(`TYPE=HOME,TYPE=VOICE`) are both understood.

A `PHOTO` is only used when it is an `http(s)` URL, an `image/*` data URI, or
base64 with a declared image type, so a card cannot smuggle a script URL into
an image.

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
