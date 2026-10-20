/**
 * Frozen copies of the original regex-based implementations (pre-hardening),
 * kept only so the node tests can differentially compare the linear-time
 * replacements against them. Do not use in product code.
 */
export function encapScriptOld(html) {
  // ensure this is a string to then do replacements on, rare but possible w/ null
  if (html && typeof html.replace === "function") {
    html = html.replace(/<script[\s\S]*?>/gi, "&lt;script&gt;");
    html = html.replace(/<\/script>/gi, "&lt;/script&gt;");
    // ensure that HAX tags aren't leaking in here
    html = html.replace(/<hax-(body|tray|store)[\s\S]*?>/gi, "");
    html = html.replace(/<\/hax-(body|tray|store)[\s\S]*?>/gi, "");
    html = html.replace(/<h-a-x[\s\S]*?>/gi, "");
    html = html.replace(/<\/h-a-x*?>/gi, "");
    html = html.replace(/<style[\s\S]*?>/gi, "&lt;style&gt;");
    html = html.replace(/<\/style>/gi, "&lt;/style&gt;");
    // special case, it's inside a template tag
    html = html.replace(
      /<template[\s\S]*?>[\s\S]*?&lt;script[\s\S]*?&gt;[\s\S]*?&lt;\/script&gt;/gi,
      function (match, _contents, _offset, _input_string) {
        match = match.replace("&lt;script&gt;", "<script>");
        match = match.replace("&lt;/script&gt;", "</script>");
        match = match.replace("&lt;style&gt;", "<style>");
        match = match.replace("&lt;/style&gt;", "</style>");
        return match;
      },
    );
  }
  return html;
}

export function findTagsInHTMLOld(html) {
  let tags = {};
  let tag = "";
  let matches = html.match(/<\/([a-z,0-9]*?)-(\S*?)>/g);
  for (let i in matches) {
    tag = matches[i].replace("</", "").replace(">", "");
    tags[tag] = tag;
  }
  return tags;
}

export function stripMSWordOld(input) {
  // 1. remove line breaks / Mso classes right off the bat
  let output = input
    .split("\n\r")
    .join("\n")
    .split("\r")
    .join("\n")
    .split("\n\n")
    .join("\n")
    .split("\n\n")
    .join("\n")
    .split("\n\n")
    .join("\n")
    .split("\n")
    .join(" ")
    .replace(/( class=(")?Mso[a-zA-Z]+(")?)/g, "");

  // 2. strip Word generated HTML comments
  // repeat until stable so "<!<!-- x -->-- y -->" cannot leave a comment opener behind
  let beforeCommentStrip;
  do {
    beforeCommentStrip = output;
    output = output.replace(/<!--[\s\S]*?-->/gim, "");
  } while (output !== beforeCommentStrip);
  output = output.replace(/<![^>]*>/gim, "");
  // 3. remove tags leave content if any (but NOT span tags yet)
  output = output.replace(
    /<\/*(?:meta|link|title|html|head|body|font|br|\\\\?xml:|xml|st1:|o:|w:|m:|v:)[^>]*>/gim,
    "",
  );
  // Handle spans specially - remove span wrapper but preserve content and nested elements
  output = output.replace(/<span[^>]*>([\s\S]*?)<\/span>/gim, "$1");
  // 4. Remove everything in between and including tags '<style(.)style(.)>'
  let badTags = ["style", "script", "applet", "embed", "noframes", "noscript"];
  for (let i in badTags) {
    let tagStripper = new RegExp(
      "<" + badTags[i] + ".*?" + badTags[i] + ".*?>",
      "gim",
    );
    output = output.replace(tagStripper, "");
  }
  // 5. remove attributes ' style="..."', align, start and others that we know we dont need
  output = output.replace(/ style='[^']*'/gim, "");
  output = output.replace(/ style="[^"]*"/gim, ""); // Fix: handle double-quoted style attributes
  output = output.replace(/ face="[^"]*"/gim, "");
  output = output.replace(/ align=.*? /g, "");
  output = output.replace(/ start='.*?'/g, "");
  // remove line-height; commonly set via html copy and paste in google docs
  output = output.replace(/line-height:.*?"/g, '"');
  output = output.replace(/line-height:.*?;/g, "");
  // normal font cause... obviously
  output = output.replace(/font-weight:normal;/g, "");
  // text decoration in a link...
  output = output.replace(/text-decoration:none;/g, "");
  // margin clean up that is in point values; only machines make these
  output = output.replace(/margin-.*?:.*?"/g, '"');
  output = output.replace(/margin-.*?:.*?;/g, "");
  // empty style tags
  output = output.replace(/ style=""/g, "");
  // ID's wont apply meaningfully on a paste
  output = output.replace(/ id="[^"]*"/gim, "");
  // Google Docs ones
  output = output.replace(/ dir="[^"]*"/gim, "");
  output = output.replace(/ role="[^"]*"/gim, "");
  // Google AI internal tracking attributes (jsaction, jscontroller, jsuid, etc.)
  output = output.replace(/ jsaction="[^"]*"/gim, "");
  output = output.replace(/ jsaction='[^']*'/gim, "");
  output = output.replace(/ jscontroller="[^"]*"/gim, "");
  output = output.replace(/ jscontroller='[^']*'/gim, "");
  output = output.replace(/ jsuid="[^"]*"/gim, "");
  output = output.replace(/ jsuid='[^']*'/gim, "");
  output = output.replace(/ jsname="[^"]*"/gim, "");
  output = output.replace(/ jsname='[^']*'/gim, "");
  output = output.replace(/ jsslot="[^"]*"/gim, "");
  output = output.replace(/ jsslot='[^']*'/gim, "");
  output = output.replace(/ jsan="[^"]*"/gim, "");
  output = output.replace(/ jsan='[^']*'/gim, "");
  output = output.replace(/ jsdata="[^"]*"/gim, "");
  output = output.replace(/ jsdata='[^']*'/gim, "");
  // these are universally true tho so fine to have here
  output = output.replace(/ contenteditable="[^"]*"/gim, "");
  // some medium, box, github and other paste stuff as well as general paste clean up for classes
  // in multiple HTML primitives
  output = output.replace(/ data-[^"]*"[^"]*"/gim, "");
  output = output.replace(/ class="[^"]*"/gim, "");
  output = output.replace(/<pstyle/gm, "<p style");
  // HIGHLY specific to certain platforms, empty link tag
  output = output.replace(/<a name="_GoBack"><\/a>/gm, "");
  // 7. clean out empty paragraphs and endlines that cause weird spacing
  output = output.replace(/&nbsp;/gm, " ");
  // start of double, do it twice for nesting
  output = output.replace(/<section>/gm, "<p>");
  output = output.replace(/<\/section>/gm, "</p>");
  output = output.replace(/<p><p>/gm, "<p>");
  output = output.replace(/<p><p>/gm, "<p>");
  // double, do it twice for nesting
  output = output.replace(/<\/p><\/p>/gm, "</p>");
  output = output.replace(/<\/p><\/p>/gm, "</p>");
  // normalize BR's; common from GoogleDocs
  output = output.replace(/<br \/>/gm, "<br/>");
  output = output.replace(/<p><br \/><b>/gm, "<p><b>");
  output = output.replace(/<\/p><br \/><\/b>/gm, "</p></b>");
  // some other things we know not to allow to wrap and
  // some things bold stuff like crazy for some odd reason
  output = output.replace(/<b><p>/gm, "<p>");
  output = output.replace(/<\/p><\/b>/gm, "</p>");
  output = output.replace(/<b>/gm, "<strong>");
  output = output.replace(/<\/b>/gm, "</strong>");
  // clean up in lists because they get messy for no real reason...ever.
  // tables as well
  output = output.replace(/<p style=".*?">/gm, "<p>");
  output = output.replace(/<ul style=".*?">/gm, "<ul>");
  output = output.replace(/<ol style=".*?">/gm, "<ol>");
  output = output.replace(/<li style=".*?">/gm, "<li>");
  output = output.replace(/<td style=".*?">/gm, "<td>");
  output = output.replace(/<tr style=".*?">/gm, "<tr>");
  // drop list wrappers (handle attributes on <p> e.g. Google Docs)
  output = output.replace(/<li><p[^>]*>/gm, "<li>");
  output = output.replace(/<\/p><\/li>/gm, "</li>");
  // bold wraps as an outer tag like p can, and on lists
  output = output.replace(/<b><ul>/gm, "<ul>");
  output = output.replace(/<\/ul><\/b>/gm, "</ul>");
  output = output.replace(/<b><ol>/gm, "<ol>");
  output = output.replace(/<\/ol><\/b>/gm, "</ol>");
  // try ax'ing extra spans
  output = output.replace(/<span><p>/gm, "<p>");
  output = output.replace(/<\/p><\/span>/gm, "</p>");
  // empty with lots of space
  output = output.replace(/<p>(\s*)<\/p>/gm, " ");
  // empty p / more or less empty
  output = output.replace(/<p><\/p>/gm, "");
  output = output.replace(/<p>&nbsp;<\/p>/gm, " ");
  // br somehow getting through here
  output = output.replace(/<p><br\/><\/p>/gm, "");
  output = output.replace(/<p><br><\/p>/gm, "");

  // whitespace in reverse of the top case now that we've cleaned it up
  output = output.replace(/<\/p>(\s*)<p>/gm, "</p><p>");
  // target and remove hax specific things from output if they slipped through
  output = output.replace(/ data-hax-ray="[^"]*"/gim, "");
  output = output.replace(/ class=""/gim, "");
  output = output.replace(/ class="hax-active"/gim, "");
  output = output.replace(/ contenteditable="[^"]*"/gim, "");
  output = output.replace(/ t="[^"]*"/gim, "");
  // wow do I hate contenteditable and the dom....
  // bold and italic are treated as if they are block elements in a paste scenario
  // 8. check for empty bad tags
  for (let i in badTags) {
    let emptyTagRemove = new RegExp(
      "<" + badTags[i] + "></" + badTags[i] + ">",
      "gi",
    );
    output = output.replace(emptyTagRemove, "");
  }
  output = output.trim();
  return output;
}

export function detectMarkdownOld(text) {
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
