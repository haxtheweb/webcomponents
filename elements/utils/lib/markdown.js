/**
 * Detect if pasted content appears to be markdown
 * @param {string} text - The text content to analyze
 * @return {boolean} - Whether the text appears to be markdown
 */
export function detectMarkdown(text) {
  if (!text || typeof text !== "string") return false;

  // Strip HTML tags for analysis but keep line breaks
  // (repeat until stable so nested input cannot leave a tag behind)
  let stripped = text;
  let previous;
  do {
    previous = stripped;
    stripped = stripped.replace(/<[^<>]*>/g, "");
  } while (stripped !== previous);
  const plainText = stripped.trim();

  // Strong indicators (these alone suggest markdown)
  const strongIndicators = [
    // Headers (# ## ### etc.)
    (t) => /^#{1,6}\s+\S/m.test(t),
    hasFencedCodeBlock, // Fenced code blocks
    hasTableRow, // Tables (at least 2 pipes per line)
    (t) => /^>\s+\S/m.test(t), // Blockquotes (line-level)
    (t) => HR_STAR.test(t), // Horizontal rules (***)
    (t) => HR_DASH.test(t), // Horizontal rules (---)
    (t) => HR_UNDERSCORE.test(t), // Horizontal rules (___)
  ];

  // Check for strong indicators first
  for (const check of strongIndicators) {
    if (check(plainText)) {
      return true;
    }
  }

  // Moderate indicators (need multiple matches)
  const moderateIndicators = [
    // Unordered lists (line-level)
    (t) => /^[^\S\n\r\u2028\u2029]*[-*+]\s+\S/m.test(t),
    // Ordered lists (line-level)
    (t) => /^[^\S\n\r\u2028\u2029]*\d+\.\s+\S/m.test(t),
    (t) => /\*\*[^*]+\*\*/.test(t), // Bold text (non-greedy)
    (t) => /(?<!\*)\*[^*]+\*(?!\*)/.test(t), // Italic text (not bold)
    hasLink, // Links [text](url)
    hasImage, // Images ![alt](url)
    (t) => /`[^`\n]+`/.test(t), // Inline code (no line breaks)
    // Indented code blocks (4+ whitespace; plainText is trimmed so a run of
    // whitespace is always followed by content)
    (t) => /^\s{4}/m.test(t),
  ];

  // Count moderate indicators
  let matches = 0;
  for (const check of moderateIndicators) {
    if (check(plainText)) {
      matches++;
    }
  }

  // Need at least 2 moderate indicators to consider it markdown
  return matches >= 2;
}

// Horizontal rules: optional indentation, 3+ marker characters, optional trailing
// whitespace, all on one line. Whitespace classes exclude line terminators so the
// scan is anchored per line (linear time) rather than spanning blank lines.
const HR_STAR = /^[^\S\n\r\u2028\u2029]*\*{3,}[^\S\n\r\u2028\u2029]*$/m;
const HR_DASH = /^[^\S\n\r\u2028\u2029]*-{3,}[^\S\n\r\u2028\u2029]*$/m;
const HR_UNDERSCORE = /^[^\S\n\r\u2028\u2029]*_{3,}[^\S\n\r\u2028\u2029]*$/m;
const LINE_BREAKS = /[\n\r\u2028\u2029]/;

/**
 * A line opening with ``` and a later ``` that ends a line. Only the first
 * opener needs checking: any later opener has a subset of possible closers.
 */
function hasFencedCodeBlock(text) {
  const opener = /^```/m.exec(text);
  if (!opener) return false;
  return /```(?=[\n\r\u2028\u2029]|$)/g.test(text.slice(opener.index + 3));
}

/** a line like `| a | b |`: starts with | and has two more pipes, each after at least one character */
function hasTableRow(text) {
  for (const line of text.split(LINE_BREAKS)) {
    if (line[0] !== "|") continue;
    const a = line.indexOf("|", 2);
    if (a !== -1 && line.indexOf("|", a + 2) !== -1) return true;
  }
  return false;
}

/** `[text](url)` on one line, with non-empty text and url */
function hasLink(text) {
  return text.split(LINE_BREAKS).some((line) => {
    const a = line.indexOf("[");
    if (a === -1) return false;
    const b = line.indexOf("](", a + 2);
    return b !== -1 && line.indexOf(")", b + 3) !== -1;
  });
}

/** `![alt](url)` on one line, alt may be empty, url non-empty */
function hasImage(text) {
  return text.split(LINE_BREAKS).some((line) => {
    const a = line.indexOf("![");
    if (a === -1) return false;
    const b = line.indexOf("](", a + 2);
    return b !== -1 && line.indexOf(")", b + 3) !== -1;
  });
}

/**
 * Convert markdown text to HTML using the marked library
 * @param {string} markdown - The markdown text to convert
 * @return {Promise<string>} - The converted HTML
 */
export async function markdownToHTML(markdown) {
  try {
    // Dynamically import the marked library from local utils
    const module = await import("./marked.js");
    const { marked } = module;
    return marked.parse(markdown);
  } catch (e) {
    console.warn("Failed to parse markdown, falling back to original text:", e);
    return markdown;
  }
}
