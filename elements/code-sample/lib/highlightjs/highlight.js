/*
Syntax highlighting with language autodetection.
https://highlightjs.org/
*/
var hljs = {};
// Convenience variables for build-in objects
var ArrayProto = [],
  objectKeys = Object.keys;

// Global internal variables used within the highlight.js library.
var languages = {},
  aliases = {};

// Regular expressions used throughout the highlight.js library.
var noHighlightRe = /^(no-?highlight|plain|text)$/i,
  languagePrefixRe = /\blang(?:uage)?-([\w-]+)\b/i,
  fixMarkupRe = /((^(<[^>]+>|\t|)+|(?:\n)))/gm;

var spanEndTag = "</span>";

// Global options used when within external APIs. This is modified when
// calling the `hljs.configure` function.
var options = {
  classPrefix: "hljs-",
  tabReplace: null,
  useBR: false,
  languages: undefined,
};

/* Utility functions */

function escape(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function tag(node) {
  return node.nodeName.toLowerCase();
}

function testRe(re, lexeme) {
  var match = re && re.exec(lexeme);
  return match && match.index === 0;
}

function isNotHighlighted(language) {
  return noHighlightRe.test(language);
}

function blockLanguage(block) {
  var i, match, length, _class;
  var classes = block.className + " ";

  classes += block.parentNode ? block.parentNode.className : "";

  // language-* takes precedence over non-prefixed class names.
  match = languagePrefixRe.exec(classes);
  if (match) {
    return getLanguage(match[1]) ? match[1] : "no-highlight";
  }

  classes = classes.split(/\s+/);

  for (i = 0, length = classes.length; i < length; i++) {
    _class = classes[i];

    if (isNotHighlighted(_class) || getLanguage(_class)) {
      return _class;
    }
  }
}

function inherit(parent) {
  // inherit(parent, override_obj, override_obj, ...)
  var key;
  var result = {};
  var objects = Array.prototype.slice.call(arguments, 1);

  for (key in parent) result[key] = parent[key];
  objects.forEach(function (obj) {
    for (key in obj) result[key] = obj[key];
  });
  return result;
}

/* Stream merging */

function nodeStream(node) {
  var result = [];
  (function _nodeStream(node, offset) {
    for (var child = node.firstChild; child; child = child.nextSibling) {
      if (child.nodeType === 3) offset += child.nodeValue.length;
      else if (child.nodeType === 1) {
        result.push({
          event: "start",
          offset: offset,
          node: child,
        });
        offset = _nodeStream(child, offset);
        // Prevent void elements from having an end tag that would actually
        // double them in the output. There are more void elements in HTML
        // but we list only those realistically expected in code display.
        if (!tag(child).match(/br|hr|img|input/)) {
          result.push({
            event: "stop",
            offset: offset,
            node: child,
          });
        }
      }
    }
    return offset;
  })(node, 0);
  return result;
}

function mergeStreams(original, highlighted, value) {
  var processed = 0;
  var result = "";
  var nodeStack = [];

  function selectStream() {
    if (!original.length || !highlighted.length) {
      return original.length ? original : highlighted;
    }
    if (original[0].offset !== highlighted[0].offset) {
      return original[0].offset < highlighted[0].offset
        ? original
        : highlighted;
    }

    /*
    To avoid starting the stream just before it should stop the order is
    ensured that original always starts first and closes last:

    if (event1 == 'start' && event2 == 'start')
      return original;
    if (event1 == 'start' && event2 == 'stop')
      return highlighted;
    if (event1 == 'stop' && event2 == 'start')
      return original;
    if (event1 == 'stop' && event2 == 'stop')
      return highlighted;

    ... which is collapsed to:
    */
    return highlighted[0].event === "start" ? original : highlighted;
  }

  function open(node) {
    function attr_str(a) {
      return (
        " " + a.nodeName + '="' + escape(a.value).replace('"', "&quot;") + '"'
      );
    }
    result +=
      "<" +
      tag(node) +
      ArrayProto.map.call(node.attributes, attr_str).join("") +
      ">";
  }

  function close(node) {
    result += "</" + tag(node) + ">";
  }

  function render(event) {
    (event.event === "start" ? open : close)(event.node);
  }

  while (original.length || highlighted.length) {
    var stream = selectStream();
    result += escape(value.substring(processed, stream[0].offset));
    processed = stream[0].offset;
    if (stream === original) {
      /*
      On any opening or closing tag of the original markup we first close
      the entire highlighted node stack, then render the original tag along
      with all the following original tags at the same offset and then
      reopen all the tags on the highlighted stack.
      */
      nodeStack.reverse().forEach(close);
      do {
        render(stream.splice(0, 1)[0]);
        stream = selectStream();
      } while (
        stream === original &&
        stream.length &&
        stream[0].offset === processed
      );
      nodeStack.reverse().forEach(open);
    } else {
      if (stream[0].event === "start") {
        nodeStack.push(stream[0].node);
      } else {
        nodeStack.pop();
      }
      render(stream.splice(0, 1)[0]);
    }
  }
  return result + escape(value.substr(processed));
}

/* Initialization */

function expand_mode(mode) {
  if (mode.variants && !mode.cached_variants) {
    mode.cached_variants = mode.variants.map(function (variant) {
      return inherit(mode, { variants: null }, variant);
    });
  }
  return (
    mode.cached_variants || (mode.endsWithParent && [inherit(mode)]) || [mode]
  );
}

function compileLanguage(language) {
  function reStr(re) {
    return (re && re.source) || re;
  }

  function langRe(value, global) {
    return new RegExp(
      reStr(value),
      "m" + (language.case_insensitive ? "i" : "") + (global ? "g" : ""),
    );
  }

  // joinRe logically computes regexps.join(separator), but fixes the
  // backreferences so they continue to match.
  function joinRe(regexps, separator) {
    // backreferenceRe matches an open parenthesis or backreference. To avoid
    // an incorrect parse, it additionally matches the following:
    // - [...] elements, where the meaning of parentheses and escapes change
    // - other escape sequences, so we do not misparse escape sequences as
    //   interesting elements
    // - non-matching or lookahead parentheses, which do not capture. These
    //   follow the '(' with a '?'.
    var backreferenceRe = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
    var numCaptures = 0;
    var ret = "";
    for (var i = 0; i < regexps.length; i++) {
      var offset = numCaptures;
      var re = reStr(regexps[i]);
      if (i > 0) {
        ret += separator;
      }
      while (re.length > 0) {
        var match = backreferenceRe.exec(re);
        if (match == null) {
          ret += re;
          break;
        }
        ret += re.substring(0, match.index);
        re = re.substring(match.index + match[0].length);
        if (match[0][0] == "\\" && match[1]) {
          // Adjust the backreference.
          ret += "\\" + String(Number(match[1]) + offset);
        } else {
          ret += match[0];
          if (match[0] == "(") {
            numCaptures++;
          }
        }
      }
    }
    return ret;
  }

  function compileMode(mode, parent) {
    if (mode.compiled) return;
    mode.compiled = true;

    mode.keywords = mode.keywords || mode.beginKeywords;
    if (mode.keywords) {
      var compiled_keywords = {};

      var flatten = function (className, str) {
        if (language.case_insensitive) {
          str = str.toLowerCase();
        }
        str.split(" ").forEach(function (kw) {
          var pair = kw.split("|");
          compiled_keywords[pair[0]] = [
            className,
            pair[1] ? Number(pair[1]) : 1,
          ];
        });
      };

      if (typeof mode.keywords === "string") {
        // string
        flatten("keyword", mode.keywords);
      } else {
        objectKeys(mode.keywords).forEach(function (className) {
          flatten(className, mode.keywords[className]);
        });
      }
      mode.keywords = compiled_keywords;
    }
    mode.lexemesRe = langRe(mode.lexemes || /\w+/, true);

    if (parent) {
      if (mode.beginKeywords) {
        mode.begin = "\\b(" + mode.beginKeywords.split(" ").join("|") + ")\\b";
      }
      if (!mode.begin) mode.begin = /\B|\b/;
      mode.beginRe = langRe(mode.begin);
      if (mode.endSameAsBegin) mode.end = mode.begin;
      if (!mode.end && !mode.endsWithParent) mode.end = /\B|\b/;
      if (mode.end) mode.endRe = langRe(mode.end);
      mode.terminator_end = reStr(mode.end) || "";
      if (mode.endsWithParent && parent.terminator_end)
        mode.terminator_end += (mode.end ? "|" : "") + parent.terminator_end;
    }
    if (mode.illegal) mode.illegalRe = langRe(mode.illegal);
    if (mode.relevance == null) mode.relevance = 1;
    if (!mode.contains) {
      mode.contains = [];
    }
    mode.contains = Array.prototype.concat.apply(
      [],
      mode.contains.map(function (c) {
        return expand_mode(c === "self" ? mode : c);
      }),
    );
    mode.contains.forEach(function (c) {
      compileMode(c, mode);
    });

    if (mode.starts) {
      compileMode(mode.starts, parent);
    }

    var terminators = mode.contains
      .map(function (c) {
        return c.beginKeywords ? "\\.?(?:" + c.begin + ")\\.?" : c.begin;
      })
      .concat([mode.terminator_end, mode.illegal])
      .map(reStr)
      .filter(Boolean);
    mode.terminators = terminators.length
      ? langRe(joinRe(terminators, "|"), true)
      : {
          exec: function (/*s*/) {
            return null;
          },
        };
  }

  compileMode(language);
}

/*
Core highlighting function. Accepts a language name, or an alias, and a
string with the code to highlight. Returns an object with the following
properties:

- relevance (int)
- value (an HTML string with highlighting markup)

*/
function highlight(name, value, ignore_illegals, continuation) {
  function escapeRe(value) {
    return new RegExp(value.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "m");
  }

  function subMode(lexeme, mode) {
    var i, length;

    for (i = 0, length = mode.contains.length; i < length; i++) {
      if (testRe(mode.contains[i].beginRe, lexeme)) {
        if (mode.contains[i].endSameAsBegin) {
          mode.contains[i].endRe = escapeRe(
            mode.contains[i].beginRe.exec(lexeme)[0],
          );
        }
        return mode.contains[i];
      }
    }
  }

  function endOfMode(mode, lexeme) {
    if (testRe(mode.endRe, lexeme)) {
      while (mode.endsParent && mode.parent) {
        mode = mode.parent;
      }
      return mode;
    }
    if (mode.endsWithParent) {
      return endOfMode(mode.parent, lexeme);
    }
  }

  function isIllegal(lexeme, mode) {
    return !ignore_illegals && testRe(mode.illegalRe, lexeme);
  }

  function keywordMatch(mode, match) {
    var match_str = language.case_insensitive
      ? match[0].toLowerCase()
      : match[0];
    return mode.keywords.hasOwnProperty(match_str) && mode.keywords[match_str];
  }

  function buildSpan(classname, insideSpan, leaveOpen, noPrefix) {
    var classPrefix = noPrefix ? "" : options.classPrefix,
      openSpan = '<span class="' + classPrefix,
      closeSpan = leaveOpen ? "" : spanEndTag;

    openSpan += classname + '">';

    return openSpan + insideSpan + closeSpan;
  }

  function processKeywords() {
    var keyword_match, last_index, match, result;

    if (!top.keywords) return escape(mode_buffer);

    result = "";
    last_index = 0;
    top.lexemesRe.lastIndex = 0;
    match = top.lexemesRe.exec(mode_buffer);

    while (match) {
      result += escape(mode_buffer.substring(last_index, match.index));
      keyword_match = keywordMatch(top, match);
      if (keyword_match) {
        relevance += keyword_match[1];
        result += buildSpan(keyword_match[0], escape(match[0]));
      } else {
        result += escape(match[0]);
      }
      last_index = top.lexemesRe.lastIndex;
      match = top.lexemesRe.exec(mode_buffer);
    }
    return result + escape(mode_buffer.substr(last_index));
  }

  function processSubLanguage() {
    var explicit = typeof top.subLanguage === "string";
    if (explicit && !languages[top.subLanguage]) {
      return escape(mode_buffer);
    }

    var result = explicit
      ? highlight(
          top.subLanguage,
          mode_buffer,
          true,
          continuations[top.subLanguage],
        )
      : highlightAuto(
          mode_buffer,
          top.subLanguage.length ? top.subLanguage : undefined,
        );

    // Counting embedded language score towards the host language may be disabled
    // with zeroing the containing mode relevance. Usecase in point is Markdown that
    // allows XML everywhere and makes every XML snippet to have a much larger Markdown
    // score.
    if (top.relevance > 0) {
      relevance += result.relevance;
    }
    if (explicit) {
      continuations[top.subLanguage] = result.top;
    }
    return buildSpan(result.language, result.value, false, true);
  }

  function processBuffer() {
    result +=
      top.subLanguage != null ? processSubLanguage() : processKeywords();
    mode_buffer = "";
  }

  function startNewMode(mode) {
    result += mode.className ? buildSpan(mode.className, "", true) : "";
    top = Object.create(mode, { parent: { value: top } });
  }

  function processLexeme(buffer, lexeme) {
    mode_buffer += buffer;

    if (lexeme == null) {
      processBuffer();
      return 0;
    }

    var new_mode = subMode(lexeme, top);
    if (new_mode) {
      if (new_mode.skip) {
        mode_buffer += lexeme;
      } else {
        if (new_mode.excludeBegin) {
          mode_buffer += lexeme;
        }
        processBuffer();
        if (!new_mode.returnBegin && !new_mode.excludeBegin) {
          mode_buffer = lexeme;
        }
      }
      startNewMode(new_mode, lexeme);
      return new_mode.returnBegin ? 0 : lexeme.length;
    }

    var end_mode = endOfMode(top, lexeme);
    if (end_mode) {
      var origin = top;
      if (origin.skip) {
        mode_buffer += lexeme;
      } else {
        if (!(origin.returnEnd || origin.excludeEnd)) {
          mode_buffer += lexeme;
        }
        processBuffer();
        if (origin.excludeEnd) {
          mode_buffer = lexeme;
        }
      }
      do {
        if (top.className) {
          result += spanEndTag;
        }
        if (!top.skip && !top.subLanguage) {
          relevance += top.relevance;
        }
        top = top.parent;
      } while (top !== end_mode.parent);
      if (end_mode.starts) {
        if (end_mode.endSameAsBegin) {
          end_mode.starts.endRe = end_mode.endRe;
        }
        startNewMode(end_mode.starts, "");
      }
      return origin.returnEnd ? 0 : lexeme.length;
    }

    if (isIllegal(lexeme, top))
      throw new Error(
        'Illegal lexeme "' +
          lexeme +
          '" for mode "' +
          (top.className || "<unnamed>") +
          '"',
      );

    /*
    Parser should not reach this point as all types of lexemes should be caught
    earlier, but if it does due to some bug make sure it advances at least one
    character forward to prevent infinite looping.
    */
    mode_buffer += lexeme;
    return lexeme.length || 1;
  }

  var language = getLanguage(name);
  if (!language) {
    throw new Error('Unknown language: "' + name + '"');
  }

  compileLanguage(language);
  var top = continuation || language;
  var continuations = {}; // keep continuations for sub-languages
  var result = "",
    current;
  for (current = top; current !== language; current = current.parent) {
    if (current.className) {
      result = buildSpan(current.className, "", true) + result;
    }
  }
  var mode_buffer = "";
  var relevance = 0;
  try {
    var match,
      count,
      index = 0;
    while (true) {
      top.terminators.lastIndex = index;
      match = top.terminators.exec(value);
      if (!match) break;
      count = processLexeme(value.substring(index, match.index), match[0]);
      index = match.index + count;
    }
    processLexeme(value.substr(index));
    for (current = top; current.parent; current = current.parent) {
      // close dangling modes
      if (current.className) {
        result += spanEndTag;
      }
    }
    return {
      relevance: relevance,
      value: result,
      language: name,
      top: top,
    };
  } catch (e) {
    if (e.message && e.message.indexOf("Illegal") !== -1) {
      return {
        relevance: 0,
        value: escape(value),
      };
    } else {
      throw e;
    }
  }
}

/*
Highlighting with language detection. Accepts a string with the code to
highlight. Returns an object with the following properties:

- language (detected language)
- relevance (int)
- value (an HTML string with highlighting markup)
- second_best (object with the same structure for second-best heuristically
  detected language, may be absent)

*/
function highlightAuto(text, languageSubset) {
  languageSubset = languageSubset || options.languages || objectKeys(languages);
  var result = {
    relevance: 0,
    value: escape(text),
  };
  var second_best = result;
  languageSubset
    .filter(getLanguage)
    .filter(autoDetection)
    .forEach(function (name) {
      var current = highlight(name, text, false);
      current.language = name;
      if (current.relevance > second_best.relevance) {
        second_best = current;
      }
      if (current.relevance > result.relevance) {
        second_best = result;
        result = current;
      }
    });
  if (second_best.language) {
    result.second_best = second_best;
  }
  return result;
}

/*
Post-processing of the highlighted markup:

- replace TABs with something more useful
- replace real line-breaks with '<br>' for non-pre containers

*/
function fixMarkup(value) {
  return !(options.tabReplace || options.useBR)
    ? value
    : value.replace(fixMarkupRe, function (match, p1) {
        if (options.useBR && match === "\n") {
          return "<br>";
        } else if (options.tabReplace) {
          return p1.replace(/\t/g, options.tabReplace);
        }
        return "";
      });
}

function buildClassName(prevClassName, currentLang, resultLang) {
  var language = currentLang ? aliases[currentLang] : resultLang,
    result = [prevClassName.trim()];

  if (!prevClassName.match(/\bhljs\b/)) {
    result.push("hljs");
  }

  if (prevClassName.indexOf(language) === -1) {
    result.push(language);
  }

  return result.join(" ").trim();
}

/*
Applies highlighting to a DOM node containing code. Accepts a DOM node and
two optional parameters for fixMarkup.
*/
function highlightBlock(block) {
  var node, originalStream, result, resultNode, text;
  var language = blockLanguage(block);

  if (isNotHighlighted(language)) return;

  if (options.useBR) {
    node = globalThis.document.createElementNS(
      "http://www.w3.org/1999/xhtml",
      "div",
    );
    node.innerHTML = block.innerHTML
      .replace(/\n/g, "")
      .replace(/<br[ \/]*>/g, "\n");
  } else {
    node = block;
  }
  text = node.textContent;
  result = language ? highlight(language, text, true) : highlightAuto(text);

  originalStream = nodeStream(node);
  if (originalStream.length) {
    resultNode = globalThis.document.createElementNS(
      "http://www.w3.org/1999/xhtml",
      "div",
    );
    resultNode.innerHTML = result.value;
    result.value = mergeStreams(originalStream, nodeStream(resultNode), text);
  }
  result.value = fixMarkup(result.value);

  block.innerHTML = result.value;
  block.className = buildClassName(block.className, language, result.language);
  block.result = {
    language: result.language,
    re: result.relevance,
  };
  if (result.second_best) {
    block.second_best = {
      language: result.second_best.language,
      re: result.second_best.relevance,
    };
  }
}

/*
Updates highlight.js global options with values passed in the form of an object.
*/
function configure(user_options) {
  options = inherit(options, user_options);
}

/*
Applies highlighting to all <pre><code>..</code></pre> blocks on a page.
*/
function initHighlighting() {
  if (initHighlighting.called) return;
  initHighlighting.called = true;

  var blocks = globalThis.document.querySelectorAll("pre code");
  ArrayProto.forEach.call(blocks, highlightBlock);
}

/*
Attaches highlighting to the page load event.
*/
function initHighlightingOnLoad() {
  addEventListener("DOMContentLoaded", initHighlighting, false);
  addEventListener("load", initHighlighting, false);
}

function registerLanguage(name, language) {
  var lang = (languages[name] = language(hljs));
  if (lang.aliases) {
    lang.aliases.forEach(function (alias) {
      aliases[alias] = name;
    });
  }
}

function listLanguages() {
  return objectKeys(languages);
}

function getLanguage(name) {
  name = (name || "").toLowerCase();
  return languages[name] || languages[aliases[name]];
}

function autoDetection(name) {
  var lang = getLanguage(name);
  return lang && !lang.disableAutodetect;
}

/* Interface definition */

hljs.highlight = highlight;
hljs.highlightAuto = highlightAuto;
hljs.fixMarkup = fixMarkup;
hljs.highlightBlock = highlightBlock;
hljs.configure = configure;
hljs.initHighlighting = initHighlighting;
hljs.initHighlightingOnLoad = initHighlightingOnLoad;
hljs.registerLanguage = registerLanguage;
hljs.listLanguages = listLanguages;
hljs.getLanguage = getLanguage;
hljs.autoDetection = autoDetection;
hljs.inherit = inherit;

// Common regexps
hljs.IDENT_RE = "[a-zA-Z]\\w*";
hljs.UNDERSCORE_IDENT_RE = "[a-zA-Z_]\\w*";
hljs.NUMBER_RE = "\\b\\d+(\\.\\d+)?";
hljs.C_NUMBER_RE =
  "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)"; // 0x..., 0..., decimal, float
hljs.BINARY_NUMBER_RE = "\\b(0b[01]+)"; // 0b...
hljs.RE_STARTERS_RE =
  "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~";

// Common modes
hljs.BACKSLASH_ESCAPE = {
  begin: "\\\\[\\s\\S]",
  relevance: 0,
};
hljs.APOS_STRING_MODE = {
  className: "string",
  begin: "'",
  end: "'",
  illegal: "\\n",
  contains: [hljs.BACKSLASH_ESCAPE],
};
hljs.QUOTE_STRING_MODE = {
  className: "string",
  begin: '"',
  end: '"',
  illegal: "\\n",
  contains: [hljs.BACKSLASH_ESCAPE],
};
hljs.PHRASAL_WORDS_MODE = {
  begin:
    /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/,
};
hljs.COMMENT = function (begin, end, inherits) {
  var mode = hljs.inherit(
    {
      className: "comment",
      begin: begin,
      end: end,
      contains: [],
    },
    inherits || {},
  );
  mode.contains.push(hljs.PHRASAL_WORDS_MODE);
  mode.contains.push({
    className: "doctag",
    begin: "(?:TODO|FIXME|NOTE|BUG|XXX):",
    relevance: 0,
  });
  return mode;
};
hljs.C_LINE_COMMENT_MODE = hljs.COMMENT("//", "$");
hljs.C_BLOCK_COMMENT_MODE = hljs.COMMENT("/\\*", "\\*/");
hljs.HASH_COMMENT_MODE = hljs.COMMENT("#", "$");
hljs.NUMBER_MODE = {
  className: "number",
  begin: hljs.NUMBER_RE,
  relevance: 0,
};
hljs.C_NUMBER_MODE = {
  className: "number",
  begin: hljs.C_NUMBER_RE,
  relevance: 0,
};
hljs.BINARY_NUMBER_MODE = {
  className: "number",
  begin: hljs.BINARY_NUMBER_RE,
  relevance: 0,
};
hljs.CSS_NUMBER_MODE = {
  className: "number",
  begin:
    hljs.NUMBER_RE +
    "(" +
    "%|em|ex|ch|rem" +
    "|vw|vh|vmin|vmax" +
    "|cm|mm|in|pt|pc|px" +
    "|deg|grad|rad|turn" +
    "|s|ms" +
    "|Hz|kHz" +
    "|dpi|dpcm|dppx" +
    ")?",
  relevance: 0,
};
hljs.REGEXP_MODE = {
  className: "regexp",
  begin: /\//,
  end: /\/[gimuy]*/,
  illegal: /\n/,
  contains: [
    hljs.BACKSLASH_ESCAPE,
    {
      begin: /\[/,
      end: /\]/,
      relevance: 0,
      contains: [hljs.BACKSLASH_ESCAPE],
    },
  ],
};
hljs.TITLE_MODE = {
  className: "title",
  begin: hljs.IDENT_RE,
  relevance: 0,
};
hljs.UNDERSCORE_TITLE_MODE = {
  className: "title",
  begin: hljs.UNDERSCORE_IDENT_RE,
  relevance: 0,
};
hljs.METHOD_GUARD = {
  // excludes method names from keyword processing
  begin: "\\.\\s*" + hljs.UNDERSCORE_IDENT_RE,
  relevance: 0,
};
export { hljs };

// forked from https://github.com/wcoder/highlightjs-line-numbers.js/
// in order to support modular JS (export) as well as direct query selector object
// as opposed to applying to the entire document
// jshint multistr:true

export function highlightjs_line_numbers() {
  "use strict";
  var w = window;
  var d = document;
  var TABLE_NAME = "hljs-ln",
    LINE_NAME = "hljs-ln-line",
    CODE_BLOCK_NAME = "hljs-ln-code",
    NUMBERS_BLOCK_NAME = "hljs-ln-numbers",
    NUMBER_LINE_NAME = "hljs-ln-n",
    DATA_ATTR_NAME = "data-line-number",
    BREAK_LINE_REGEXP = /\r\n|\r|\n/g;

  if (w.hljs) {
    w.hljs.initLineNumbersOnLoad = initLineNumbersOnLoad;
    w.hljs.lineNumbersBlock = lineNumbersBlock;
    w.hljs.lineNumbersValue = lineNumbersValue;
  } else {
    w.console.error("highlight.js not detected!");
  }

  function isHljsLnCodeDescendant(domElt) {
    var curElt = domElt;
    while (curElt) {
      if (curElt.className && curElt.className.indexOf("hljs-ln-code") !== -1) {
        return true;
      }
      curElt = curElt.parentNode;
    }
    return false;
  }

  function getHljsLnTable(hljsLnDomElt) {
    var curElt = hljsLnDomElt;
    while (curElt.nodeName !== "TABLE") {
      curElt = curElt.parentNode;
    }
    return curElt;
  }

  // Function to workaround a copy issue with Microsoft Edge.
  // Due to hljs-ln wrapping the lines of code inside a <table> element,
  // itself wrapped inside a <pre> element, globalThis.getSelection().toString()
  // does not contain any line breaks. So we need to get them back using the
  // rendered code in the DOM as reference.
  function edgeGetSelectedCodeLines(selection) {
    // current selected text without line breaks
    var selectionText = selection.toString();

    // get the <td> element wrapping the first line of selected code
    var tdAnchor = selection.anchorNode;
    while (tdAnchor.nodeName !== "TD") {
      tdAnchor = tdAnchor.parentNode;
    }

    // get the <td> element wrapping the last line of selected code
    var tdFocus = selection.focusNode;
    while (tdFocus.nodeName !== "TD") {
      tdFocus = tdFocus.parentNode;
    }

    // extract line numbers
    var firstLineNumber = parseInt(tdAnchor.dataset.lineNumber);
    var lastLineNumber = parseInt(tdFocus.dataset.lineNumber);

    // multi-lines copied case
    if (firstLineNumber != lastLineNumber) {
      var firstLineText = tdAnchor.textContent;
      var lastLineText = tdFocus.textContent;

      // if the selection was made backward, swap values
      if (firstLineNumber > lastLineNumber) {
        var tmp = firstLineNumber;
        firstLineNumber = lastLineNumber;
        lastLineNumber = tmp;
        tmp = firstLineText;
        firstLineText = lastLineText;
        lastLineText = tmp;
      }

      // discard not copied characters in first line
      while (selectionText.indexOf(firstLineText) !== 0) {
        firstLineText = firstLineText.slice(1);
      }

      // discard not copied characters in last line
      while (selectionText.lastIndexOf(lastLineText) === -1) {
        lastLineText = lastLineText.slice(0, -1);
      }

      // reconstruct and return the real copied text
      var selectedText = firstLineText;
      var hljsLnTable = getHljsLnTable(tdAnchor);
      for (var i = firstLineNumber + 1; i < lastLineNumber; ++i) {
        var codeLineSel = format('.{0}[{1}="{2}"]', [
          CODE_BLOCK_NAME,
          DATA_ATTR_NAME,
          i,
        ]);
        var codeLineElt = hljsLnTable.querySelector(codeLineSel);
        selectedText += "\n" + codeLineElt.textContent;
      }
      selectedText += "\n" + lastLineText;
      return selectedText;
      // single copied line case
    } else {
      return selectionText;
    }
  }

  // ensure consistent code copy/paste behavior across all browsers
  // (see https://github.com/wcoder/highlightjs-line-numbers.js/issues/51)
  globalThis.document.addEventListener("copy", function (e) {
    // get current selection
    var selection = globalThis.getSelection();
    // override behavior when one wants to copy line of codes
    if (isHljsLnCodeDescendant(selection.anchorNode)) {
      var selectionText;
      // workaround an issue with Microsoft Edge as copied line breaks
      // are removed otherwise from the selection string
      if (globalThis.navigator.userAgent.indexOf("Edge") !== -1) {
        selectionText = edgeGetSelectedCodeLines(selection);
      } else {
        // other browsers can directly use the selection string
        selectionText = selection.toString();
      }
      e.clipboardData.setData("text/plain", selectionText);
      e.preventDefault();
    }
  });

  function initLineNumbersOnLoad(options, selector) {
    if (d.readyState === "interactive" || d.readyState === "complete") {
      documentReady(options, selector);
    } else {
      w.addEventListener("DOMContentLoaded", function () {
        documentReady(options, selector);
      });
    }
  }

  function documentReady(options, selector = null) {
    try {
      if (selector) {
        if (!isPluginDisabledForBlock(selector)) {
          lineNumbersBlock(selector, options);
        }
      } else {
        var blocks = d.querySelectorAll("code-sample");
        for (var i in blocks) {
          if (blocks.hasOwnProperty(i)) {
            if (
              !isPluginDisabledForBlock(
                blocks[i].shadowRoot.querySelector("code"),
              )
            ) {
              lineNumbersBlock(
                blocks[i].shadowRoot.querySelector("code"),
                options,
              );
            }
          }
        }
      }
    } catch (e) {
      w.console.error("LineNumbers error: ", e);
    }
  }

  function isPluginDisabledForBlock(element) {
    return element.classList.contains("nohljsln");
  }

  function lineNumbersBlock(element, options) {
    if (typeof element !== "object") return;

    async(function () {
      element.innerHTML = lineNumbersInternal(element, options);
    });
  }

  function lineNumbersValue(value, options) {
    if (typeof value !== "string") return;

    var element = globalThis.document.createElement("code");
    element.innerHTML = value;

    return lineNumbersInternal(element, options);
  }

  function lineNumbersInternal(element, options) {
    var internalOptions = mapOptions(element, options);

    duplicateMultilineNodes(element);

    return addLineNumbersBlockFor(element.innerHTML, internalOptions);
  }

  function addLineNumbersBlockFor(inputHtml, options) {
    var lines = getLines(inputHtml);

    // if last line contains only carriage return remove it
    if (lines[lines.length - 1].trim() === "") {
      lines.pop();
    }

    if (lines.length > 1 || options.singleLine) {
      var html = "";

      for (var i = 0, l = lines.length; i < l; i++) {
        html += format(
          '<tr part="line">' +
            '<td class="{0} {1}" {3}="{5}">' +
            '<div class="{2}" {3}="{5}"></div>' +
            "</td>" +
            '<td class="{0} {4}" {3}="{5}">' +
            "{6}" +
            "</td>" +
            "</tr>",
          [
            LINE_NAME,
            NUMBERS_BLOCK_NAME,
            NUMBER_LINE_NAME,
            DATA_ATTR_NAME,
            CODE_BLOCK_NAME,
            i + options.startFrom,
            lines[i].length > 0 ? lines[i] : " ",
          ],
        );
      }

      return format('<table class="{0}">{1}</table>', [TABLE_NAME, html]);
    }

    return inputHtml;
  }

  /**
   * @param {HTMLElement} element Code block.
   * @param {Object} options External API options.
   * @returns {Object} Internal API options.
   */
  function mapOptions(element, options) {
    options = options || {};
    return {
      singleLine: getSingleLineOption(options),
      startFrom: getStartFromOption(element, options),
    };
  }

  function getSingleLineOption(options) {
    var defaultValue = false;
    if (!!options.singleLine) {
      return options.singleLine;
    }
    return defaultValue;
  }

  function getStartFromOption(element, options) {
    var defaultValue = 1;
    var startFrom = defaultValue;

    if (isFinite(options.startFrom)) {
      startFrom = options.startFrom;
    }

    // can be overridden because local option is priority
    var value = getAttribute(element, "data-ln-start-from");
    if (value !== null) {
      startFrom = toNumber(value, defaultValue);
    }

    return startFrom;
  }

  /**
   * Recursive method for fix multi-line elements implementation in highlight.js
   * Doing deep passage on child nodes.
   * @param {HTMLElement} element
   */
  function duplicateMultilineNodes(element) {
    var nodes = element.childNodes;
    for (var node in nodes) {
      if (nodes.hasOwnProperty(node)) {
        var child = nodes[node];
        if (getLinesCount(child.textContent) > 0) {
          if (child.childNodes.length > 0) {
            duplicateMultilineNodes(child);
          } else {
            duplicateMultilineNode(child.parentNode);
          }
        }
      }
    }
  }

  /**
   * Method for fix multi-line elements implementation in highlight.js
   * @param {HTMLElement} element
   */
  function duplicateMultilineNode(element) {
    var className = element.className;

    if (!/hljs-/.test(className)) return;

    var lines = getLines(element.innerHTML);

    for (var i = 0, result = ""; i < lines.length; i++) {
      var lineText = lines[i].length > 0 ? lines[i] : " ";
      result += format('<span class="{0}">{1}</span>\n', [className, lineText]);
    }

    element.innerHTML = result.trim();
  }

  function getLines(text) {
    if (text.length === 0) return [];
    return text.split(BREAK_LINE_REGEXP);
  }

  function getLinesCount(text) {
    return (text.trim().match(BREAK_LINE_REGEXP) || []).length;
  }

  ///
  /// HELPERS
  ///

  function async(func) {
    w.setTimeout(func, 0);
  }

  /**
   * {@link https://wcoder.github.io/notes/string-format-for-string-formating-in-javascript}
   * @param {string} format
   * @param {array} args
   */
  function format(format, args) {
    return format.replace(/\{(\d+)\}/g, function (m, n) {
      return args[n] !== undefined ? args[n] : m;
    });
  }

  /**
   * @param {HTMLElement} element Code block.
   * @param {String} attrName Attribute name.
   * @returns {String} Attribute value or empty.
   */
  function getAttribute(element, attrName) {
    return element.hasAttribute(attrName)
      ? element.getAttribute(attrName)
      : null;
  }

  /**
   * @param {String} str Source string.
   * @param {Number} fallback Fallback value.
   * @returns Parsed number or fallback value.
   */
  function toNumber(str, fallback) {
    if (!str) return fallback;
    var number = Number(str);
    return isFinite(number) ? number : fallback;
  }
}
