/**
 * Detect if pasted content appears to be markdown
 * @param {string} text - The text content to analyze
 * @return {boolean} - Whether the text appears to be markdown
 */
export function detectMarkdown(text) {
  if (!text || typeof text !== "string") return false;

  // Strip HTML tags for analysis but keep line breaks
  const plainText = text.replace(/<[^>]*>/g, "").trim();

  // Strong indicators (these alone suggest markdown)
  const strongIndicators = [
    /^#{1,6}\s+.+$/m, // Headers (# ## ### etc.)
    /^```[\s\S]*?```$/m, // Fenced code blocks
    /^\|.+\|.+\|.*$/m, // Tables (at least 2 pipes per line)
    /^>\s+.+$/m, // Blockquotes (line-level)
    /^\s*\*{3,}\s*$/m, // Horizontal rules (***)
    /^\s*-{3,}\s*$/m, // Horizontal rules (---)
    /^\s*_{3,}\s*$/m, // Horizontal rules (___)
  ];

  // Check for strong indicators first
  for (const pattern of strongIndicators) {
    if (pattern.test(plainText)) {
      return true;
    }
  }

  // Moderate indicators (need multiple matches)
  const moderateIndicators = [
    /^\s*[-*+]\s+.+$/m, // Unordered lists (line-level)
    /^\s*\d+\.\s+.+$/m, // Ordered lists (line-level)
    /\*\*[^*]+\*\*/, // Bold text (non-greedy)
    /(?<!\*)\*[^*]+\*(?!\*)/, // Italic text (not bold)
    /\[.+?\]\(.+?\)/, // Links [text](url)
    /!\[.*?\]\(.+?\)/, // Images ![alt](url)
    /`[^`\n]+`/, // Inline code (no line breaks)
    /^\s{4,}.+$/m, // Indented code blocks (4+ spaces)
  ];

  // Count moderate indicators
  let matches = 0;
  for (const pattern of moderateIndicators) {
    if (pattern.test(plainText)) {
      matches++;
    }
  }

  // Need at least 2 moderate indicators to consider it markdown
  return matches >= 2;
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
