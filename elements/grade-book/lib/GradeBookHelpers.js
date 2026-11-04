/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * Small pure helpers shared by grade-book, grade-book-lite and letter-grade.
 * No imports on purpose, so letter-grade stays light.
 */
/**
 * Is this grade value set? "", null, undefined and anything that is not a
 * number mean "not graded"; 0 is a real grade.
 */
export function isGraded(value) {
  if (value === undefined || value === null || value === "") {
    return false;
  }
  return !isNaN(Number(value));
}

/**
 * Letter for a score on the grade scale, "" when it is not graded or there
 * is no scale. The scale runs from the highest letter down; a percentage
 * that falls between two ranges (92.5 with A 93-100 and A- 90-92) takes the
 * highest letter whose low end it reaches, never the bottom letter.
 */
export function gradeBookLetter(score, total, scale) {
  if (!isGraded(score) || !scale || !scale.length) {
    return "";
  }
  const points = Number(total);
  if (!points) {
    return "";
  }
  return scale[gradeBookLetterIndex(score, points, scale)].letter;
}

/**
 * Index into the grade scale for a graded score (see gradeBookLetter).
 */
export function gradeBookLetterIndex(score, total, scale) {
  const percent = (Number(score) / Number(total)) * 100;
  if (percent >= Number(scale[0].highRange)) {
    return 0;
  }
  for (let i = 0; i < scale.length; i++) {
    if (percent >= Number(scale[i].lowRange)) {
      return i;
    }
  }
  return scale.length - 1;
}

/**
 * A student's display name from either data shape: roster rows
 * ({ student, surname }) or the { name } shape.
 */
export function studentDisplayName(student) {
  if (!student) {
    return "";
  }
  if (student.name) {
    return student.name;
  }
  return [student.student, student.surname].filter((n) => !!n).join(" ");
}

/**
 * Tag category colours. accent-color names (the data model stores the name
 * on each dragged tag) in the order of the DDD chart series, so through the
 * DDD accent map category 1 is series 1 (beaverBlue), category 2 series 2
 * (skyBlue) and so on, and neighbouring categories stay apart for colour
 * blind readers.
 */
export const GradeBookTagColors = [
  "blue",
  "light-blue",
  "amber",
  "teal",
  "red",
  "light-green",
  "purple",
  "blue-grey",
];

// index -> position in the series, wrapping, safe for odd input
export function gradeBookSeriesIndex(val) {
  const n = parseInt(val, 10);
  if (isNaN(n) || n < 0) {
    return 0;
  }
  return n % GradeBookTagColors.length;
}
