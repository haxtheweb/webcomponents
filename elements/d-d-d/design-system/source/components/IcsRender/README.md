# IcsRender

Show the events in a calendar file as date cards, a timeline, a table or a list.

- Package `@haxtheweb/ics-render` 26.8.0
- HAX block "Calendar" (Content, calendar, events, ics, schedule)
- HAX design-system controls offered: accent, primary, card, text

## Usage

```html
<ics-render calendar-data="BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//HAX//ics-render demo//EN
X-WR-CALNAME:Project schedule
BEGIN:VEVENT
UID:kickoff@example.com
DTSTART:20261015T180000Z
DTEND:20261015T190000Z
SUMMARY:Project Kickoff Meeting
DESCRIPTION:Initial alignment meeting with the project team.
LOCATION:Conference Room A
END:VEVENT
BEGIN:VEVENT
UID:review@example.com
DTSTART:20261029T150000Z
DTEND:20261029T160000Z
SUMMARY:Design Review
LOCATION:Zoom
END:VEVENT
END:VCALENDAR" display-as="cards"></ics-render>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `data-source` | Calendar file | Upload or choose an .ics calendar file. Its events are read in the browser. | haxupload |
| `display-as` | Display as | How to present what the file contains. | select |
| `caption` | Heading | Shown above the events, and as the table caption. Defaults to the calendar's own name. | textfield |

## DDD usage

Its source references 7 distinct design-system variables. By family: font (5), spacing (3), theme (1). Most used: `--ddd-font-navigation`, `--ddd-spacing-2`, `--ddd-font-size-s`, `--ddd-font-weight-bold`, `--ddd-spacing-4`, `--ddd-font-size-4xs`.
