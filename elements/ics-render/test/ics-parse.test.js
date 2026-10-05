import { expect } from "@open-wc/testing";
import {
  parseIcs,
  parseComponents,
  parseContentLine,
  parseDateValue,
  formatDateParts,
  unescapeText,
  unfoldLines,
} from "../lib/ics-parse.js";

// the sample from haxtheweb/issues#2941, verbatim
const SAMPLE = [
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  "PRODID:-//Example Corp//Example Calendar//EN",
  "CALSCALE:GREGORIAN",
  "BEGIN:VEVENT",
  "UID:uid-1234567890@example.com",
  "DTSTAMP:20260930T140000Z",
  "DTSTART:20261015T180000Z",
  "DTEND:20261015T190000Z",
  "SUMMARY:Project Kickoff Meeting",
  "DESCRIPTION:Initial alignment meeting with the project team.",
  "LOCATION:Conference Room A / Zoom Link",
  "STATUS:CONFIRMED",
  "SEQUENCE:0",
  "END:VEVENT",
  "END:VCALENDAR",
].join("\r\n");

describe("ics-parse line reading", () => {
  it("unfolds a folded line, dropping the break and the one space after it", () => {
    // RFC 5545 section 3.1: the CRLF and the single whitespace that follows it
    // are both inserted by folding, so both come back out
    expect(unfoldLines("SUMMARY:one\r\ntwo")).to.equal("SUMMARY:one\ntwo");
    expect(unfoldLines("SUMMARY:one\r\n two")).to.equal("SUMMARY:onetwo");
    expect(unfoldLines("SUMMARY:one\r\n\ttwo")).to.equal("SUMMARY:onetwo");
    // only the first space is the fold's; a second one belongs to the value
    expect(unfoldLines("SUMMARY:one\r\n  two")).to.equal("SUMMARY:one two");
  });

  it("treats a bare CR as a line break", () => {
    expect(unfoldLines("A:1\rB:2")).to.equal("A:1\nB:2");
  });

  it("tolerates no input at all", () => {
    expect(unfoldLines(undefined)).to.equal("");
    expect(unfoldLines(null)).to.equal("");
  });

  it("splits a content line into name, params and value", () => {
    const line = parseContentLine("DTSTART;VALUE=DATE:20261015");
    expect(line.name).to.equal("DTSTART");
    expect(line.params.VALUE).to.equal("DATE");
    expect(line.value).to.equal("20261015");
  });

  it("keeps a colon inside the value", () => {
    expect(parseContentLine("URL:https://hax.psu.edu/").value).to.equal(
      "https://hax.psu.edu/",
    );
  });

  it("ignores a colon inside a quoted parameter", () => {
    const line = parseContentLine('DTSTART;TZID="GMT+01:00":20261015T120000');
    expect(line.name).to.equal("DTSTART");
    expect(line.params.TZID).to.equal("GMT+01:00");
    expect(line.value).to.equal("20261015T120000");
  });

  it("drops a group prefix from the property name", () => {
    expect(parseContentLine("item1.SUMMARY:Grouped").name).to.equal("SUMMARY");
  });

  it("returns nothing for a line with no colon", () => {
    expect(parseContentLine("NOT A CONTENT LINE")).to.equal(null);
  });

  it("unescapes text values", () => {
    expect(unescapeText("one\\ntwo")).to.equal("one\ntwo");
    expect(unescapeText("one\\Ntwo")).to.equal("one\ntwo");
    expect(unescapeText("Sackett 221\\; bring questions")).to.equal(
      "Sackett 221; bring questions",
    );
    expect(unescapeText("Campus\\, wide")).to.equal("Campus, wide");
    expect(unescapeText("back\\\\slash")).to.equal("back\\slash");
  });
});

describe("ics-parse dates", () => {
  it("reads a UTC date-time as a real instant", () => {
    const parsed = parseDateValue("20261015T180000Z", {});
    expect(parsed.utc).to.equal(true);
    expect(parsed.allDay).to.equal(false);
    expect(parsed.date.toISOString()).to.equal("2026-10-15T18:00:00.000Z");
  });

  it("reads an all day date without a time", () => {
    const parsed = parseDateValue("20261126", { VALUE: "DATE" });
    expect(parsed.allDay).to.equal(true);
    expect(parsed.utc).to.equal(false);
    // built in local time so the day cannot shift with the reader's timezone
    expect(parsed.date.getFullYear()).to.equal(2026);
    expect(parsed.date.getMonth()).to.equal(10);
    expect(parsed.date.getDate()).to.equal(26);
  });

  it("keeps the wall clock of a floating time in a named zone", () => {
    const parsed = parseDateValue("20261029T110000", {
      TZID: "America/New_York",
    });
    expect(parsed.utc).to.equal(false);
    expect(parsed.allDay).to.equal(false);
    expect(parsed.tzid).to.equal("America/New_York");
    expect(parsed.date.getHours()).to.equal(11);
    expect(parsed.date.getMinutes()).to.equal(0);
  });

  it("returns nothing for a value it cannot read", () => {
    expect(parseDateValue("", {})).to.equal(null);
    expect(parseDateValue("next tuesday", {})).to.equal(null);
    expect(parseDateValue("20261315", {})).to.equal(null);
    expect(parseDateValue("20260230", {})).to.equal(null);
    expect(parseDateValue("20261015T250000Z", {})).to.equal(null);
  });

  it("formats the pieces a date card needs", () => {
    const parts = formatDateParts(
      parseDateValue("20261029T110000", {}),
      "en-US",
    );
    expect(parts.month).to.equal("October");
    expect(parts.date).to.equal("29");
    expect(parts.day).to.equal("Thursday");
    expect(parts.time).to.equal("11:00 AM");
    expect(parts.dateLabel).to.equal("October 29, 2026");
  });

  it("formats in the locale it is given", () => {
    const parts = formatDateParts(parseDateValue("20261029T110000", {}), "fr");
    expect(parts.month).to.equal("octobre");
    expect(parts.day).to.equal("jeudi");
  });

  it("leaves the time empty for an all day date", () => {
    const parts = formatDateParts(
      parseDateValue("20261126", { VALUE: "DATE" }),
      "en-US",
    );
    expect(parts.time).to.equal("");
    expect(parts.date).to.equal("26");
  });

  it("formats nothing when there is no date", () => {
    expect(formatDateParts(null, "en-US").month).to.equal("");
  });
});

describe("ics-parse components", () => {
  it("reads nesting as a tree", () => {
    const root = parseComponents(SAMPLE);
    expect(root.children.length).to.equal(1);
    expect(root.children[0].name).to.equal("VCALENDAR");
    expect(root.children[0].children[0].name).to.equal("VEVENT");
  });

  it("does not let a stray END unwind past the root", () => {
    const root = parseComponents("END:VCALENDAR\r\nSUMMARY:loose");
    expect(root.name).to.equal("ROOT");
    expect(root.props.length).to.equal(1);
  });
});

describe("ics-parse events", () => {
  it("reads the sample calendar", () => {
    const { events, calendar } = parseIcs(SAMPLE, "en-US");
    expect(events.length).to.equal(1);
    const event = events[0];
    expect(event.uid).to.equal("uid-1234567890@example.com");
    expect(event.title).to.equal("Project Kickoff Meeting");
    expect(event.description).to.equal(
      "Initial alignment meeting with the project team.",
    );
    expect(event.location).to.equal("Conference Room A / Zoom Link");
    expect(event.status).to.equal("CONFIRMED");
    expect(event.start.date.toISOString()).to.equal("2026-10-15T18:00:00.000Z");
    expect(event.end.date.toISOString()).to.equal("2026-10-15T19:00:00.000Z");
    expect(calendar.prodId).to.equal("-//Example Corp//Example Calendar//EN");
    expect(calendar.scale).to.equal("GREGORIAN");
  });

  it("ignores VTIMEZONE blocks and the DTSTART inside them", () => {
    const text = [
      "BEGIN:VCALENDAR",
      "X-WR-CALNAME:Fall Term",
      "BEGIN:VTIMEZONE",
      "TZID:America/New_York",
      "BEGIN:DAYLIGHT",
      "DTSTART:19700308T020000",
      "TZNAME:EDT",
      "END:DAYLIGHT",
      "END:VTIMEZONE",
      "BEGIN:VEVENT",
      "DTSTART;VALUE=DATE:20261201",
      "SUMMARY:Reading Day",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const { events, calendar } = parseIcs(text, "en-US");
    expect(calendar.name).to.equal("Fall Term");
    expect(events.length).to.equal(1);
    expect(events[0].title).to.equal("Reading Day");
    expect(events[0].start.date.getFullYear()).to.equal(2026);
  });

  it("does not let a VALARM description become the event's", () => {
    const text = [
      "BEGIN:VCALENDAR",
      "BEGIN:VEVENT",
      "DTSTART:20261015T180000Z",
      "SUMMARY:Kickoff",
      "BEGIN:VALARM",
      "TRIGGER:-PT15M",
      "DESCRIPTION:Alarm text",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const { events } = parseIcs(text, "en-US");
    expect(events.length).to.equal(1);
    expect(events[0].description).to.equal("");
  });

  it("sorts events chronologically whatever order the file uses", () => {
    const text = [
      "BEGIN:VCALENDAR",
      "BEGIN:VEVENT",
      "DTSTART;VALUE=DATE:20261201",
      "SUMMARY:December",
      "END:VEVENT",
      "BEGIN:VEVENT",
      "DTSTART;VALUE=DATE:20261015",
      "SUMMARY:October",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const { events } = parseIcs(text, "en-US");
    expect(events.map((event) => event.title)).to.deep.equal([
      "October",
      "December",
    ]);
  });

  it("keeps an event with no usable start, sorted last", () => {
    const text = [
      "BEGIN:VCALENDAR",
      "BEGIN:VEVENT",
      "SUMMARY:No date at all",
      "END:VEVENT",
      "BEGIN:VEVENT",
      "DTSTART;VALUE=DATE:20261015",
      "SUMMARY:Dated",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const { events } = parseIcs(text, "en-US");
    expect(events.map((event) => event.title)).to.deep.equal([
      "Dated",
      "No date at all",
    ]);
    expect(events[1].start).to.equal(null);
    expect(events[1].month).to.equal("");
  });

  it("splits categories on unescaped commas only", () => {
    const text = [
      "BEGIN:VCALENDAR",
      "BEGIN:VEVENT",
      "DTSTART;VALUE=DATE:20261015",
      "SUMMARY:Tagged",
      "CATEGORIES:Academic,Campus\\, wide",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const { events } = parseIcs(text, "en-US");
    expect(events[0].categories).to.deep.equal(["Academic", "Campus, wide"]);
  });

  it("reports a recurring event once and says that it repeats", () => {
    const text = [
      "BEGIN:VCALENDAR",
      "BEGIN:VEVENT",
      "DTSTART;VALUE=DATE:20261126",
      "SUMMARY:Thanksgiving",
      "RRULE:FREQ=YEARLY",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const { events } = parseIcs(text, "en-US");
    expect(events.length).to.equal(1);
    expect(events[0].recurring).to.equal(true);
    expect(events[0].rrule).to.equal("FREQ=YEARLY");
  });

  it("reads a VEVENT with no enclosing VCALENDAR", () => {
    const text = [
      "BEGIN:VEVENT",
      "DTSTART:20260101T120000Z",
      "SUMMARY:Loose event",
      "END:VEVENT",
    ].join("\r\n");
    expect(parseIcs(text, "en-US").events.length).to.equal(1);
  });

  it("falls back to DUE when there is no DTEND", () => {
    const text = [
      "BEGIN:VEVENT",
      "DTSTART:20260101T120000Z",
      "DUE:20260101T130000Z",
      "SUMMARY:Assignment",
      "END:VEVENT",
    ].join("\r\n");
    const { events } = parseIcs(text, "en-US");
    expect(events[0].end.date.toISOString()).to.equal(
      "2026-01-01T13:00:00.000Z",
    );
  });

  it("returns an empty calendar rather than throwing on junk", () => {
    [undefined, null, "", "not a calendar", "{}"].forEach((input) => {
      const { events } = parseIcs(input, "en-US");
      expect(events).to.deep.equal([]);
    });
  });
});
