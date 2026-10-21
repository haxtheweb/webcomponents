import { stripHtmlComments as removeHtmlComments } from "@haxtheweb/utils/lib/safe-html.js";

/**
 * Remove HTML comments from a string. Repeats until nothing changes so nested
 * input such as "<!<!-- x -->-- y -->" cannot leave a comment opener behind.
 * @param {string} str
 * @returns {string}
 */
export function stripHtmlComments(str) {
  let result = `${str || ""}`;
  let previous;
  do {
    previous = result;
    result = removeHtmlComments(result);
  } while (result !== previous);
  return result;
}
