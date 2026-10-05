/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */

/**
 * iCalendar (RFC 5545) reader, in the spirit of `CSVtoArray` in csv-render:
 * small, dependency free, and run client side so a calendar renders offline.
 *
 * It reads the parts of the format that a page actually displays. Recurrence
 * rules are reported as written (`rrule`) rather than expanded, so a recurring
 * event shows up once instead of silently appearing to be a single occurrence.
 */

/**
 * Undo RFC 5545 line folding. A folded line is a CRLF followed by exactly one
 * space or tab, and both the break and that one character go away. This has to
 * happen before anything else is read, because a property value may be spread
 * over any number of lines.
 */
export function unfoldLines(text) {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n[ \t]/g, "");
}

/**
 * Split on a delimiter, ignoring delimiters that were escaped with a backslash.
 */
function splitUnescaped(value, delimiter) {
  const out = [];
  let current = "";
  for (let i = 0; i < value.length; i++) {
    const character = value[i];
    if (character === "\\" && i + 1 < value.length) {
      current += character + value[i + 1];
      i++;
    } else if (character === delimiter) {
      out.push(current);
      current = "";
    } else {
      current += character;
    }
  }
  out.push(current);
  return out;
}

/**
 * RFC 5545 section 3.3.11 text unescaping. `\n` and `\N` are newlines, and a
 * backslash escapes a comma, a semicolon or another backslash.
 */
export function unescapeText(value) {
  return String(value == null ? "" : value)
    .replace(/\\([nN])/g, "\n")
    .replace(/\\([,;\\])/g, "$1");
}

/**
 * Read one content line into its name, its parameters and its raw value.
 * The name/value separator is the first colon that is not inside a quoted
 * parameter value, which is what keeps a `TZID="GMT+01:00"` parameter or the
 * colon in a `URL:https://...` value from splitting the line in the wrong place.
 */
export function parseContentLine(line) {
  let cut = -1;
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const character = line[i];
    if (character === '"') {
      quoted = !quoted;
    } else if (character === ":" && !quoted) {
      cut = i;
      break;
    }
  }
  if (cut === -1) {
    return null;
  }
  const pieces = splitUnescaped(line.slice(0, cut), ";");
  // a property may carry a group prefix ("item1.TEL"); the group is not part
  // of the name and nothing here needs it
  const name = pieces.shift().split(".").pop().toUpperCase();
  if (!name) {
    return null;
  }
  const params = {};
  pieces.forEach((piece) => {
    const equals = piece.indexOf("=");
    const key = (equals === -1 ? piece : piece.slice(0, equals)).toUpperCase();
    const raw = equals === -1 ? "" : piece.slice(equals + 1);
    params[key] = raw.replace(/^"/, "").replace(/"$/, "");
  });
  return { name, params, value: line.slice(cut + 1) };
}

/**
 * Read BEGIN/END blocks into a tree. Nesting matters: a VEVENT can hold a
 * VALARM, and a VCALENDAR usually holds VTIMEZONE blocks, all of which carry
 * properties with the same names an event uses (DTSTART, DESCRIPTION). Reading
 * them as a tree keeps those out of the events.
 */
export function parseComponents(text) {
  const root = { name: "ROOT", props: [], children: [] };
  const stack = [root];
  unfoldLines(text)
    .split("\n")
    .forEach((line) => {
      if (!line.trim()) {
        return;
      }
      const parsed = parseContentLine(line);
      if (!parsed) {
        return;
      }
      const parent = stack[stack.length - 1];
      if (parsed.name === "BEGIN") {
        const child = {
          name: parsed.value.trim().toUpperCase(),
          props: [],
          children: [],
        };
        parent.children.push(child);
        stack.push(child);
      } else if (parsed.name === "END") {
        // only unwind for the block we are actually inside, so a stray END
        // cannot pop past the root
        if (
          stack.length > 1 &&
          parent.name === parsed.value.trim().toUpperCase()
        ) {
          stack.pop();
        }
      } else {
        parent.props.push(parsed);
      }
    });
  return root;
}

function firstProp(component, name) {
  return component.props.find((prop) => prop.name === name) || null;
}

function textProp(component, name) {
  const prop = firstProp(component, name);
  return prop ? unescapeText(prop.value).trim() : "";
}

/**
 * Turn an iCalendar date or date-time into a Date plus the facts needed to
 * display it honestly.
 *
 * A UTC value (trailing Z) is a real instant, so it becomes a UTC Date and is
 * displayed in the reader's own timezone. A date-only or floating value has no
 * instant attached to it, so it is built in local time, which makes the
 * formatted output match the characters in the file instead of shifting the
 * day by a timezone the file never specified.
 */
export function parseDateValue(value, params = {}) {
  const raw = String(value || "").trim();
  const match = raw.match(
    /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?$/,
  );
  if (!match) {
    return null;
  }
  const [, year, month, day, hour, minute, second, zulu] = match;
  const dateOnly = !hour || String(params.VALUE || "").toUpperCase() === "DATE";
  const utc = Boolean(zulu);
  const numbers = [
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour || 0),
    Number(minute || 0),
    Number(second || 0),
  ];
  const date = utc
    ? new Date(Date.UTC(...numbers))
    : new Date(
        numbers[0],
        numbers[1],
        numbers[2],
        numbers[3],
        numbers[4],
        numbers[5],
      );
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  // a month or day outside its range rolls over into the next one rather than
  // failing (month 13 becomes January of the next year, 30 February becomes
  // 2 March), so check the pieces came back as the file wrote them
  const roundTrip = utc
    ? [date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()]
    : [date.getFullYear(), date.getMonth(), date.getDate()];
  if (
    roundTrip[0] !== numbers[0] ||
    roundTrip[1] !== numbers[1] ||
    roundTrip[2] !== numbers[2]
  ) {
    return null;
  }
  return {
    date,
    allDay: dateOnly,
    utc,
    tzid: params.TZID || "",
    raw,
  };
}

/**
 * Locale aware display fields for a parsed date. `date-card` wants these
 * already split apart (month name, day number, weekday, clock time), and the
 * table and list modes reuse the same strings so every mode agrees.
 */
export function formatDateParts(parsed, locale) {
  if (!parsed) {
    return { month: "", date: "", day: "", time: "", dateLabel: "" };
  }
  const { date, allDay } = parsed;
  const tag = locale || undefined;
  return {
    month: date.toLocaleDateString(tag, { month: "long" }),
    date: String(date.getDate()),
    day: date.toLocaleDateString(tag, { weekday: "long" }),
    time: allDay
      ? ""
      : date.toLocaleTimeString(tag, { hour: "numeric", minute: "2-digit" }),
    dateLabel: date.toLocaleDateString(tag, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };
}

function readEvent(component, locale) {
  const startProp = firstProp(component, "DTSTART");
  const endProp =
    firstProp(component, "DTEND") || firstProp(component, "DUE") || null;
  const start = startProp
    ? parseDateValue(startProp.value, startProp.params)
    : null;
  const end = endProp ? parseDateValue(endProp.value, endProp.params) : null;
  const startParts = formatDateParts(start, locale);
  const endParts = formatDateParts(end, locale);
  const categories = firstProp(component, "CATEGORIES")
    ? splitUnescaped(firstProp(component, "CATEGORIES").value, ",")
        .map((entry) => unescapeText(entry).trim())
        .filter(Boolean)
    : [];
  return {
    uid: textProp(component, "UID"),
    title: textProp(component, "SUMMARY"),
    description: textProp(component, "DESCRIPTION"),
    location: textProp(component, "LOCATION"),
    status: textProp(component, "STATUS"),
    url: textProp(component, "URL"),
    organizer: textProp(component, "ORGANIZER"),
    categories,
    rrule: textProp(component, "RRULE"),
    recurring: Boolean(textProp(component, "RRULE")),
    allDay: Boolean(start && start.allDay),
    tzid: start ? start.tzid : "",
    start,
    end,
    // flattened for date-card, which takes these as separate attributes
    month: startParts.month,
    date: startParts.date,
    day: startParts.day,
    startTime: startParts.time,
    endTime: endParts.time,
    dateLabel: startParts.dateLabel,
    sortKey: start ? start.date.getTime() : Number.MAX_SAFE_INTEGER,
  };
}

/**
 * Parse an .ics file into a calendar and its events, sorted chronologically.
 * Events without a usable DTSTART sort last rather than being dropped, because
 * a titled event with a broken date is still worth showing.
 *
 * @param {string} text contents of an .ics file
 * @param {string} [locale] BCP 47 tag for the display strings
 */
export function parseIcs(text, locale) {
  const root = parseComponents(text);
  const calendars = root.children.filter((child) => child.name === "VCALENDAR");
  // tolerate a bare VEVENT with no enclosing VCALENDAR
  const containers = calendars.length ? calendars : [root];
  const events = [];
  let calendar = { name: "", prodId: "", version: "", scale: "" };
  containers.forEach((container) => {
    if (!calendar.name) {
      calendar = {
        name:
          textProp(container, "X-WR-CALNAME") || textProp(container, "NAME"),
        prodId: textProp(container, "PRODID"),
        version: textProp(container, "VERSION"),
        scale: textProp(container, "CALSCALE"),
      };
    }
    container.children
      .filter((child) => child.name === "VEVENT")
      .forEach((child) => events.push(readEvent(child, locale)));
  });
  events.sort((a, b) => a.sortKey - b.sortKey);
  return { calendar, events };
}
