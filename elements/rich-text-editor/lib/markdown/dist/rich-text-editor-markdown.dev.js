"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rteMarkdownPatterns = exports.rteFootnoteMarkdown = exports.rteHorizontalRuleMarkdown = exports.rteListMarkdown = exports.rteBlockquoteMarkdown = exports.rtePreformattedMarkdown = exports.rteCodeMarkdown = exports.rteImageMarkdown = exports.rteLinkMarkdown = exports.rteMarkMarkdown = exports.rteSuperscriptMarkdown = exports.rteSubscriptMarkdown = exports.rteStrikeMarkdown = exports.rteBoldMarkdown = exports.rteItalicsMarkdown = exports.rteHeadingMarkdown = void 0;

/**
 * rich-text-editor regex patterns 
 * and documentation for heading markdown
 */
var rteHeadingMarkdown = {
  patterns: [1, 2, 3, 4, 5, 6].map(function (num) {
    var pound = function pound() {
      var str = '';

      for (var i = 0; i < num; i++) {
        str += '#';
      }

      return str;
    };

    return {
      match: new RegExp("(\n|^)".concat(pound(), " (.+)(\n|$)"), ''),
      replace: "<h".concat(num, ">$2</h").concat(num, ">"),
      excludeAncestors: ["pre", "code"],
      lastChars: ["enter"],
      examples: ["".concat(pound(), " Heading Level ").concat(num)]
    };
  })
};
/**
 * rich-text-editor regex patterns 
 * and documentation for italics markdown
 */

exports.rteHeadingMarkdown = rteHeadingMarkdown;
var rteItalicsMarkdown = {
  patterns: [{
    match: /([^\*]|^)\*(([^\*]*\*{2}[^\*]+\*{2}[^\*]*)+|[^\*]+)\*(?!\*)/,
    replace: "$1<i>$2</i>",
    excludeAncestors: ["em", "i", "pre", "code"],
    lastChars: ["*"],
    examples: ["*italics* with asterisks"]
  }, {
    match: /([^_]|^)_(([^_]*_{2}[^_]+_{2}[^_]*)+|[^_]+)_(?!_)/,
    replace: "$1<i>$2</i>",
    excludeAncestors: ["em", "i", "pre", "code"],
    lastChars: ["_"],
    examples: ["_italics_ with underscores"]
  }, {
    match: /([^\*]|^|\*{2})\*([^\*]+)\*(?=[^\*])/,
    replace: "$1<i>$2</i>",
    excludeAncestors: ["em", "i", "pre", "code"],
    lastChars: ["*"]
  }, {
    match: /([^_]|^|_{2})_([^_]+)_(?=[^_])/,
    replace: "$1<i>$2</i>",
    excludeAncestors: ["em", "i", "pre", "code"],
    lastChars: ["_"]
  }, {
    match: /(\*{2}[^\*]+)\*([^\*]+)\*(?=\*)/,
    replace: "$1<i>$2</i>",
    excludeAncestors: ["em", "i", "pre", "code"],
    lastChars: ["*"]
  }, {
    match: /(_{2}[^_]+)_([^_]+)_(?=_)/,
    replace: "$1<i>$2</i>",
    excludeAncestors: ["em", "i", "pre", "code"],
    lastChars: ["_"]
  }]
};
/**
 * rich-text-editor regex patterns 
 * and documentation for bold markdown
 */

exports.rteItalicsMarkdown = rteItalicsMarkdown;
var rteBoldMarkdown = {
  patterns: [{
    match: /(_{2}|\*{2})(([^_\*]*(([_\*])([^_\*]+)\5)*[^_\*]?)*)(\1)/,
    replace: "<b>$2</b>",
    excludeAncestors: ["b", "strong", "pre", "code"],
    lastChars: ["*", "_"],
    examples: ['**bold** with asterisks', '__bold__ with underscores']
  }]
};
/**
 * rich-text-editor regex patterns 
 * and documentation for strikethorugh markdown
 */

exports.rteBoldMarkdown = rteBoldMarkdown;
var rteStrikeMarkdown = {
  patterns: [{
    match: /~{2}(([^~]|(~[^~]+~))+)~{2}/,
    replace: "<strike>$1</strike>",
    excludeAncestors: ["strike", "pre", "code"],
    lastChars: ["~"],
    examples: ["~~strikethrough~~"]
  }]
};
/**
 * rich-text-editor regex patterns 
 * and documentation for subscript markdown
 */

exports.rteStrikeMarkdown = rteStrikeMarkdown;
var rteSubscriptMarkdown = {
  patterns: [{
    match: /([^~]|^)~(([^~]*~{2}[^~]+~{2}[^~]*)+|[^~]+)~(?!~)/,
    replace: "$1<sub>$2</sub>",
    excludeAncestors: ["sub", "pre", "code"],
    lastChars: ["~"],
    examples: ["text~subscript~"]
  }, {
    match: /([^~]|^|~{2})~([^~]+)~(?=[^~])/,
    replace: "$1<sub>$2</sub>",
    excludeAncestors: ["sub", "pre", "code"],
    lastChars: ["~"]
  }]
};
/**
 * rich-text-editor regex patterns 
 * and documentation for superscript markdown
 */

exports.rteSubscriptMarkdown = rteSubscriptMarkdown;
var rteSuperscriptMarkdown = {
  patterns: [{
    match: /([^\^]|^)\^(([^\^]*\^{2}[^\^]+\^{2}[^\^]*)+|[^\^]+)\^(?!\^)/,
    replace: "$1<sup>$2</sup>",
    excludeAncestors: ["sup", "pre", "code"],
    lastChars: ["^"],
    examples: ["text^superscript^"]
  }, {
    match: /([^\^]|^|\^{2})\^([^\^]+)\^(?=[^\^])/,
    replace: "$1<sup>$2</sup>",
    excludeAncestors: ["sup", "pre", "code"],
    lastChars: ["^"]
  }]
};
/**
 * rich-text-editor regex patterns 
 * and documentation for mark markdown
 */

exports.rteSuperscriptMarkdown = rteSuperscriptMarkdown;
var rteMarkMarkdown = {
  patterns: [{
    match: /={2}([^=]+)={2}/,
    replace: "<mark>$1</mark>",
    excludeAncestors: ["mark", "pre", "code"],
    lastChars: ["="],
    examples: ["==mark (highlight)=="]
  }]
};
/**
 * rich-text-editor regex patterns 
 * and documentation for link markdown
 */

exports.rteMarkMarkdown = rteMarkMarkdown;
var rteLinkMarkdown = {
  patterns: [{
    match: /(&lt;|<)(#\S+|(https?:\/\/|\.{1,2}\/)+[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))(&gt;|>)/,
    replace: '<a href="$2">$2</a>',
    excludeAncestors: ["a", "pre", "code"],
    lastChars: [">", ";"],
    examples: ["<http://haxtheweb.org>"]
  }, {
    match: /([^!]|^)\[([^\]]+)\]\((#\S+|(https?:\/\/|\.{1,2}\/)+[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)(?=\)))\)/,
    replace: '$1<a href="$3">$2</a>',
    excludeAncestors: ["a", "pre", "code"],
    lastChars: [")"],
    examples: ["[HAX](http://haxtheweb.org)"]
  }, {
    match: /\[([^\]]+)\]\((?:mailto\:)?(\w+@(\w+\.)+\w{2,4})\)/,
    replace: '<a href="mailto:$2">$1</a>',
    excludeAncestors: ["a", "pre", "code"],
    lastChars: [")"],
    examples: ["[My Email](email@domain.com)"]
  }, {
    match: /(&lt;|<)(?:mailto\:)?(\w+@(\w+\.)+\w{2,4})(\&gt;|>)/,
    replace: '<a href="mailto:$1">$2</a>',
    excludeAncestors: ["a", "pre", "code"],
    lastChars: [">", ";"],
    examples: ["<email@domain.com>"]
  }]
};
/**
 * rich-text-editor regex patterns 
 * and documentation for image markdown
 */

exports.rteLinkMarkdown = rteLinkMarkdown;
var rteImageMarkdown = {
  patterns: [{
    match: /!\[([^\]]+)\]\(((https?:\/\/|\.{1,2}\/)+[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)(?=\)))\)/,
    replace: '<img alt="$1" src="$2"/>',
    excludeAncestors: ["pre", "code"],
    lastChars: [")"],
    examples: ["![Black Labrador Puppy](https://picsum.photos/id/237/100/75)"]
  }]
};
/**
 * rich-text-editor regex patterns 
 * and documentation for code markdown
 */

exports.rteImageMarkdown = rteImageMarkdown;
var rteCodeMarkdown = {
  patterns: [{
    match: /([^`]|^)`([^`]+)`(?!`)/,
    replace: "$1<code>$2</code>",
    excludeAncestors: ["pre", "code"],
    lastChars: ["`"],
    examples: ["`code`"]
  }]
};
/**
* rich-text-editor regex patterns 
* and documentation for pre markdown
*/

exports.rteCodeMarkdown = rteCodeMarkdown;
var rtePreformattedMarkdown = {
  patterns: [{
    match: /(\n|^)`{3}/,
    command: "formatBlock",
    commandVal: "pre",
    excludeAncestors: ["code"],
    lastChars: ["enter"]
  }, {
    match: /`{3}([^`]+)`{3}(?!`)/,
    replace: "<pre>$1</pre>",
    excludeAncestors: ["pre", "code"],
    lastChars: ["`"],
    examples: ["```preformatted```"]
  }]
};
/**
 * rich-text-editor regex patterns 
 * and documentation for blockquote markdown
 */

exports.rtePreformattedMarkdown = rtePreformattedMarkdown;
var rteBlockquoteMarkdown = {
  patterns: [{
    match: /(\n|^)(\>|&gt;) (.+)(\n|$)/,
    replace: "<blockquote>$3</blockquote>",
    excludeAncestors: ["pre", "code"],
    lastChars: ["enter"],
    examples: ["> blockquote"]
  }]
};
/**
 * rich-text-editor regex patterns 
 * and documentation for list markdown
 */

exports.rteBlockquoteMarkdown = rteBlockquoteMarkdown;
var rteListMarkdown = {
  patterns: [{
    match: /(\n|^)- (.+)(\n|$)/,
    replace: "<ul><li>$2</li></ul>",
    excludeAncestors: ["pre", "code"],
    lastChars: ["enter"],
    examples: ["- bulleted list item"]
  }, {
    match: /(\n|^)1\. (.+)(\n|$)/,
    replace: "<ol><li>$2</li></ol>",
    excludeAncestors: ["pre", "code"],
    lastChars: ["enter"],
    examples: ["1. numbered list item"]
  }]
};
/**
 * rich-text-editor regex patterns 
 * and documentation for hr markdown
 */

exports.rteListMarkdown = rteListMarkdown;
var rteHorizontalRuleMarkdown = {
  patterns: [{
    match: /(\n|^)[-\*_]{3,}(?=\n|$)/,
    replace: "<hr>",
    excludeAncestors: ["pre", "code"],
    lastChars: ["enter"],
    examples: ["---"]
  }]
};
/**
 * rich-text-editor regex patterns 
 * and documentation for footnote markdown
 */

exports.rteHorizontalRuleMarkdown = rteHorizontalRuleMarkdown;
var rteFootnoteMarkdown = {
  patterns: [{
    match: /([^\]]+)\[\^([^\]]+)\]/,
    replace: '$1<sup>(<a href="#$2">$2</a>)</sup>',
    excludeAncestors: ["pre", "code", "a"],
    lastChars: ["]"],
    examples: ["see footnote[^1]"]
  }, {
    match: /(\n|^)\[\^([^\]]+)\]: (.+)(\n|$)/,
    replace: '$1<a id="$2">$2</a>. $3$4',
    excludeAncestors: ["pre", "code", "a"],
    lastChars: ["enter"],
    examples: ["[^1]: This is a footnote (footnote above will link to it)."]
  }]
};
/**
 * rich-text-editor regex patterns 
 * and documentation for basic markdown
 */

exports.rteFootnoteMarkdown = rteFootnoteMarkdown;
var rteMarkdownPatterns = {
  documentation: {
    id: "rte-markdown",
    title: "Basic Markdown Cheatsheet",
    cheatsheet: {}
  },
  patterns: [rteHeadingMarkdown, rteImageMarkdown, rteLinkMarkdown, rteBoldMarkdown, rteItalicsMarkdown, rteStrikeMarkdown, rteMarkMarkdown, rteSubscriptMarkdown, rteSuperscriptMarkdown, rteCodeMarkdown, rtePreformattedMarkdown, rteBlockquoteMarkdown, rteListMarkdown, rteHorizontalRuleMarkdown, rteFootnoteMarkdown]
};
exports.rteMarkdownPatterns = rteMarkdownPatterns;