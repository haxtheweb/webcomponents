/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Opt-in seasonal costumes for rpg-character. A season offers a few presets
 * (or a hat); which one a character wears is picked from its seed, so a
 * person keeps the same costume for the whole season.
 */
/**
 * Easter Sunday (Western) for a year: the anonymous Gregorian algorithm.
 * Returns [month (1-12), day].
 */
export function easterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return [month, day];
}

/**
 * US Thanksgiving for a year: the fourth Thursday of November.
 * Returns [month (1-12), day].
 */
export function thanksgivingDay(year) {
  const firstWeekday = new Date(year, 10, 1).getDay();
  const firstThursday = 1 + ((4 - firstWeekday + 7) % 7);
  return [11, firstThursday + 21];
}

const DAY = 24 * 60 * 60 * 1000;

/**
 * The season for a date, or null outside every season. A season is
 * { name, preset: [...] } or { name, hat: [...] }.
 */
export function seasonFor(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if ((month === 12 && day === 31) || (month === 1 && day === 1)) {
    return { name: "new-year", hat: ["party"] };
  }
  if (month === 10 && day >= 15) {
    return {
      name: "halloween",
      preset: [
        "witch",
        "vampire",
        "mummy",
        "skeleton",
        "ghost",
        "pumpkin",
        "zombie",
      ],
    };
  }
  // Nov 15 through the Sunday after Thanksgiving (which can be Dec 1)
  const thanksgiving = new Date(
    date.getFullYear(),
    10,
    thanksgivingDay(date.getFullYear())[1],
  );
  // the last moment of that Sunday
  const sunday = new Date(thanksgiving.getTime() + 4 * DAY - 1);
  if (
    ((month === 11 && day >= 15) || month === 12) &&
    date.getTime() <= sunday.getTime()
  ) {
    return {
      name: "thanksgiving",
      preset: ["pilgrim-boy", "pilgrim-girl", "turkey"],
    };
  }
  if (month === 12 && day <= 25) {
    return {
      name: "christmas",
      preset: ["santa", "elf", "reindeer", "snowman"],
    };
  }
  if (month === 7 && day <= 4) {
    return { name: "independence-day", preset: ["colonial"] };
  }
  const [em, ed] = easterSunday(date.getFullYear());
  const easter = new Date(date.getFullYear(), em - 1, ed).getTime();
  const today = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ).getTime();
  if (today <= easter && easter - today <= 6 * DAY) {
    return { name: "easter", preset: ["easter-bunny"] };
  }
  return null;
}

/**
 * Pick one of a season's options from a seed, stably.
 */
export function seasonalPick(options, seed) {
  const text = String(seed || "");
  let total = 0;
  for (let i = 0; i < text.length; i++) {
    total += text.charCodeAt(i) * (i + 1);
  }
  return options[total % options.length];
}
