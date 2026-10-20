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
    result = result.replace(/<!--[\s\S]*?-->/g, "");
  } while (result !== previous);
  return result;
}
