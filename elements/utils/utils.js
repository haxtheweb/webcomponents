/**
 * A collection of utility functions exported for convenience
 */

/**
 * copy to clipboard w/ toast and authorization
 * based on https://www.freecodecamp.org/news/copy-text-to-clipboard-javascript/
 */
export async function copyToClipboard(value, msg = null) {
  if (!msg) {
    msg = `Copied ${value} to clipboard`;
  }
  // the official way but they have to authorize it in navigator hence async
  try {
    await globalThis.navigator.clipboard.writeText(value);
  } catch (err) {
    msg = "Failed to authorize copy, refresh and authorize action";
  }
  let toastShowEventName = globalThis.HAXCMSToast ? "haxcms-toast-show" : "simple-toast-show";
  // gets it all the way to the top immediately
  globalThis.dispatchEvent(
    new CustomEvent(toastShowEventName, {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        text: msg,
        duration: 5000,
      },
    })
  );
}

/**
 * Convert a base64 encoded string to type Blob
 * @param {String} b64Data - base64 encoded string
 * @param {String} contentType - type to mark as the encoding of the blob
 * @param {Number} sliceSize - size of chunks
 * @returns {Blob} class blob for file operations
 */
export function b64toBlob(b64Data, contentType='', sliceSize=512) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

/**
 * Mix of solutions from https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
 */
export function CSVtoArray(text) {
  let p = "",
    row = [""],
    ret = [row],
    i = 0,
    r = 0,
    s = !0,
    l;
  for (l in text) {
    l = text[l];
    if ('"' === l) {
      if (s && l === p) row[i] += l;
      s = !s;
    } else if ("," === l && s) l = row[++i] = "";
    else if ("\n" === l && s) {
      if ("\r" === p) row[i] = row[i].slice(0, -1);
      row = ret[++r] = [(l = "")];
      i = 0;
    } else row[i] += l;
    p = l;
  }
  return ret;
}
/**
 * Check source of the video, potentially correcting bad links.
 */
export function cleanVideoSource(input) {
  // strip off the ? modifier for youtube/vimeo so we can build ourselves
  var tmp = input.split("?");
  var v = "";
  input = tmp[0];
  if (tmp.length == 2) {
    let tmp2 = tmp[1].split("&"),
      args = tmp2[0].split("="),
      qry = Array.isArray(tmp2.shift()) ? tmp2.shift().join("") : tmp2.shift();
    if (args[0] == "v") {
      let q = qry !== undefined && qry !== "" ? "?" + qry : "";
      v = args[1] + q;
    }
  }
  // link to the vimeo video instead of the embed player address
  if (
    input.indexOf("player.vimeo.com") == -1 &&
    input.indexOf("vimeo.com") != -1
  ) {
    // normalize what the API will return since it is API based
    // and needs cleaned up for front-end
    if (input.indexOf("/videos/") != -1) {
      input = input.replace("/videos/", "/");
    }
    return input.replace("vimeo.com/", "player.vimeo.com/video/");
  }
  // copy and paste from the URL
  else if (input.indexOf("youtube.com/watch") != -1) {
    return input.replace("youtube.com/watch", "youtube.com/embed/") + v;
  }
  // copy and paste from the URL
  else if (input.indexOf("youtube-no-cookie.com/") != -1) {
    return input.replace("youtube-no-cookie.com/", "youtube.com/") + v;
  }
  // weird share-ly style version
  else if (input.indexOf("youtu.be") != -1) {
    return input.replace("youtu.be/", "www.youtube.com/embed/") + v;
  }
  // copy and paste from the URL for sketchfab
  else if (
    input.indexOf("sketchfab.com") != -1 &&
    input.indexOf("/embed") == -1
  ) {
    return input + "/embed";
  }
  return input;
}
// wrap an element with another; super basic but makes it consistent across our apps
function wrap(el, wrapper) {
  if (el && el.parentNode) {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
  }
}

// shadowDOM consumption of lightDOM
// this is useful for progressive enhancement and other
// edge cases where we want HTML rendered in lightDOM but
// then be consumed and rendered as part of the shadowDOM
// tracking, self updating web engines, and SEO among reasons
export function lightChildrenToShadowRootSelector(el, selector) {
  let child = el.firstElementChild;
  while (child) {
    el.shadowRoot.querySelector(selector).appendChild(child);
    child = el.firstElementChild;
  }
}

/**
 * Wrap an array of items all at once
 */
function wrapAll(ary, wrapper) {
  if (ary && ary.length) {
    ary[0].parentNode.insertBefore(wrapper, ary[0]);
    for (var i in ary) {
      wrapper.appendChild(ary[i]);
    }
  }
}

// unwrap away from an element; super basic but makes it consistent across our apps
function unwrap(el) {
  if (el && el.parentNode) {
    // move all children out of the element
    while (el.firstChild) {
      el.parentNode.insertBefore(el.firstChild, el);
    }
    // remove the empty element
    el.remove();
  }
}
// resolve platform differences in mouse path
// some platforms falling back to just the target itself
export function normalizeEventPath(e) {
  if (e.composed && e.composedPath) {
    return e.composedPath();
  } else if (e.path) {
    return e.path;
  } else if (e.originalTarget) {
    return [e.originalTarget];
  } else {
    return [e.target];
  }
}

// based on https://github.com/max-mapper/commonjs-html-prettyprinter/blob/v1.0.0/lib/html.js#L39
function formatHTML(html_source, options) {
  //Wrapper function to invoke all the necessary constructors and deal with the output.
  
    var multi_parser,
        indent_size,
        indent_character,
        max_char,
        brace_style,
        unformatted;
  
    options = options || {};
    indent_size = options.indent_size || 2;
    indent_character = options.indent_char || ' ';
    brace_style = options.brace_style || 'collapse';
    max_char = options.max_char == 0 ? Infinity : options.max_char || 80;
    unformatted = options.unformatted || ['simple-icon', 'vocab-term', 'inline-audio', 'lrn-math', 'moar-sarcasm', 'a', 'span', 'bdo', 'em', 'strong', 'dfn', 'code', 'samp', 'kbd', 'var', 'cite', 'abbr', 'acronym', 'q', 'sub', 'sup', 'tt', 'i', 'b', 'big', 'small', 'u', 's', 'strike', 'font', 'ins', 'del', 'pre', 'address', 'dt', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    function Parser() {
  
      this.pos = 0; //Parser position
      this.token = '';
      this.current_mode = 'CONTENT'; //reflects the current Parser mode: TAG/CONTENT
      this.tags = { //An object to hold tags, their position, and their parent-tags, initiated with default values
        parent: 'parent1',
        parentcount: 1,
        parent1: ''
      };
      this.tag_type = '';
      this.token_text = this.last_token = this.last_text = this.token_type = '';
  
      this.Utils = { //Uilities made available to the various functions
        whitespace: "\n\r\t ".split(''),
        single_token: 'br,input,link,meta,!doctype,basefont,base,area,hr,wbr,param,img,isindex,?xml,embed,?php,?,?='.split(','), //all the single tags for HTML
        extra_liners: 'head,body,/html'.split(','), //for tags that need a line of whitespace before them
        in_array: function (what, arr) {
          for (var i=0; i<arr.length; i++) {
            if (what === arr[i]) {
              return true;
            }
          }
          return false;
        }
      }
  
      this.get_content = function () { //function to capture regular content between tags
  
        var input_char = '',
            content = [],
            space = false; //if a space is needed
  
        while (this.input.charAt(this.pos) !== '<') {
          if (this.pos >= this.input.length) {
            return content.length?content.join(''):['', 'TK_EOF'];
          }
  
          input_char = this.input.charAt(this.pos);
          this.pos++;
          this.line_char_count++;
  
          if (this.Utils.in_array(input_char, this.Utils.whitespace)) {
            if (content.length) {
              space = true;
            }
            this.line_char_count--;
            continue; //don't want to insert unnecessary space
          }
          else if (space) {
            if (this.line_char_count >= this.max_char) { //insert a line when the max_char is reached
              content.push('\n');
              for (var i=0; i<this.indent_level; i++) {
                content.push(this.indent_string);
              }
              this.line_char_count = 0;
            }
            else{
              content.push(' ');
              this.line_char_count++;
            }
            space = false;
          }
          content.push(input_char); //letter at-a-time (or string) inserted to an array
        }
        return content.length?content.join(''):'';
      }
  
      this.get_contents_to = function (name) { //get the full content of a script or style to pass to js_beautify
        if (this.pos == this.input.length) {
          return ['', 'TK_EOF'];
        }
        var input_char = '';
        var content = '';
        var reg_match = new RegExp('\<\/' + name + '\\s*\>', 'igm');
        reg_match.lastIndex = this.pos;
        var reg_array = reg_match.exec(this.input);
        var end_script = reg_array?reg_array.index:this.input.length; //absolute end of script
        if(this.pos < end_script) { //get everything in between the script tags
          content = this.input.substring(this.pos, end_script);
          this.pos = end_script;
        }
        return content;
      }
  
      this.record_tag = function (tag){ //function to record a tag and its parent in this.tags Object
        if (this.tags[tag + 'count']) { //check for the existence of this tag type
          this.tags[tag + 'count']++;
          this.tags[tag + this.tags[tag + 'count']] = this.indent_level; //and record the present indent level
        }
        else { //otherwise initialize this tag type
          this.tags[tag + 'count'] = 1;
          this.tags[tag + this.tags[tag + 'count']] = this.indent_level; //and record the present indent level
        }
        this.tags[tag + this.tags[tag + 'count'] + 'parent'] = this.tags.parent; //set the parent (i.e. in the case of a div this.tags.div1parent)
        this.tags.parent = tag + this.tags[tag + 'count']; //and make this the current parent (i.e. in the case of a div 'div1')
      }
  
      this.retrieve_tag = function (tag) { //function to retrieve the opening tag to the corresponding closer
        if (this.tags[tag + 'count']) { //if the openener is not in the Object we ignore it
          var temp_parent = this.tags.parent; //check to see if it's a closable tag.
          while (temp_parent) { //till we reach '' (the initial value);
            if (tag + this.tags[tag + 'count'] === temp_parent) { //if this is it use it
              break;
            }
            temp_parent = this.tags[temp_parent + 'parent']; //otherwise keep on climbing up the DOM Tree
          }
          if (temp_parent) { //if we caught something
            this.indent_level = this.tags[tag + this.tags[tag + 'count']]; //set the indent_level accordingly
            this.tags.parent = this.tags[temp_parent + 'parent']; //and set the current parent
          }
          delete this.tags[tag + this.tags[tag + 'count'] + 'parent']; //delete the closed tags parent reference...
          delete this.tags[tag + this.tags[tag + 'count']]; //...and the tag itself
          if (this.tags[tag + 'count'] == 1) {
            delete this.tags[tag + 'count'];
          }
          else {
            this.tags[tag + 'count']--;
          }
        }
      }
  
      this.get_tag = function () { //function to get a full tag and parse its type
        var input_char = '',
            content = [],
            space = false,
            tag_start, tag_end;
  
        do {
          if (this.pos >= this.input.length) {
            return content.length?content.join(''):['', 'TK_EOF'];
          }
  
          input_char = this.input.charAt(this.pos);
          this.pos++;
          this.line_char_count++;
  
          if (this.Utils.in_array(input_char, this.Utils.whitespace)) { //don't want to insert unnecessary space
            space = true;
            this.line_char_count--;
            continue;
          }
  
          if (input_char === "'" || input_char === '"') {
            if (!content[1] || content[1] !== '!') { //if we're in a comment strings don't get treated specially
              input_char += this.get_unformatted(input_char);
              space = true;
            }
          }
  
          if (input_char === '=') { //no space before =
            space = false;
          }
  
          if (content.length && content[content.length-1] !== '=' && input_char !== '>'
              && space) { //no space after = or before >
            if (this.line_char_count >= this.max_char) {
              this.print_newline(false, content);
              this.line_char_count = 0;
            }
            else {
              content.push(' ');
              this.line_char_count++;
            }
            space = false;
          }
          if (input_char === '<') {
              tag_start = this.pos - 1;
          }
          content.push(input_char); //inserts character at-a-time (or string)
        } while (input_char !== '>');
  
        var tag_complete = content.join('');
        var tag_index;
        if (tag_complete.indexOf(' ') != -1) { //if there's whitespace, thats where the tag name ends
          tag_index = tag_complete.indexOf(' ');
        }
        else { //otherwise go with the tag ending
          tag_index = tag_complete.indexOf('>');
        }
        var tag_check = tag_complete.substring(1, tag_index).toLowerCase();
        if (tag_complete.charAt(tag_complete.length-2) === '/' ||
            this.Utils.in_array(tag_check, this.Utils.single_token)) { //if this tag name is a single tag type (either in the list or has a closing /)
          this.tag_type = 'SINGLE';
        }
        else if (tag_check === 'script') { //for later script handling
          this.record_tag(tag_check);
          this.tag_type = 'SCRIPT';
        }
        else if (tag_check === 'style') { //for future style handling (for now it justs uses get_content)
          this.record_tag(tag_check);
          this.tag_type = 'STYLE';
        }
        else if (this.Utils.in_array(tag_check, unformatted)) { // do not reformat the "unformatted" tags
          var comment = this.get_unformatted('</'+tag_check+'>', tag_complete); //...delegate to get_unformatted function
          content.push(comment);
          // Preserve collapsed whitespace either before or after this tag.
          if (tag_start > 0 && this.Utils.in_array(this.input.charAt(tag_start - 1), this.Utils.whitespace)){
              content.splice(0, 0, this.input.charAt(tag_start - 1));
          }
          tag_end = this.pos - 1;
          if (this.Utils.in_array(this.input.charAt(tag_end + 1), this.Utils.whitespace)){
              content.push(this.input.charAt(tag_end + 1));
          }
          this.tag_type = 'SINGLE';
        }
        else if (tag_check.charAt(0) === '!') { //peek for <!-- comment
          if (tag_check.indexOf('[if') != -1) { //peek for <!--[if conditional comment
            if (tag_complete.indexOf('!IE') != -1) { //this type needs a closing --> so...
              var comment = this.get_unformatted('-->', tag_complete); //...delegate to get_unformatted
              content.push(comment);
            }
            this.tag_type = 'START';
          }
          else if (tag_check.indexOf('[endif') != -1) {//peek for <!--[endif end conditional comment
            this.tag_type = 'END';
            this.unindent();
          }
          else if (tag_check.indexOf('[cdata[') != -1) { //if it's a <[cdata[ comment...
            var comment = this.get_unformatted(']]>', tag_complete); //...delegate to get_unformatted function
            content.push(comment);
            this.tag_type = 'SINGLE'; //<![CDATA[ comments are treated like single tags
          }
          else {
            var comment = this.get_unformatted('-->', tag_complete);
            content.push(comment);
            this.tag_type = 'SINGLE';
          }
        }
        else {
          if (tag_check.charAt(0) === '/') { //this tag is a double tag so check for tag-ending
            this.retrieve_tag(tag_check.substring(1)); //remove it and all ancestors
            this.tag_type = 'END';
          }
          else { //otherwise it's a start-tag
            this.record_tag(tag_check); //push it on the tag stack
            this.tag_type = 'START';
          }
          if (this.Utils.in_array(tag_check, this.Utils.extra_liners)) { //check if this double needs an extra line
            this.print_newline(true, this.output);
          }
        }
        return content.join(''); //returns fully formatted tag
      }
  
      this.get_unformatted = function (delimiter, orig_tag) { //function to return unformatted content in its entirety
  
        if (orig_tag && orig_tag.toLowerCase().indexOf(delimiter) != -1) {
          return '';
        }
        var input_char = '';
        var content = '';
        var space = true;
        do {
  
          if (this.pos >= this.input.length) {
            return content;
          }
  
          input_char = this.input.charAt(this.pos);
          this.pos++
  
          if (this.Utils.in_array(input_char, this.Utils.whitespace)) {
            if (!space) {
              this.line_char_count--;
              continue;
            }
            if (input_char === '\n' || input_char === '\r') {
              content += '\n';
              /*  Don't change tab indention for unformatted blocks.  If using code for html editing, this will greatly affect <pre> tags if they are specified in the 'unformatted array'
              for (var i=0; i<this.indent_level; i++) {
                content += this.indent_string;
              }
              space = false; //...and make sure other indentation is erased
              */
              this.line_char_count = 0;
              continue;
            }
          }
          content += input_char;
          this.line_char_count++;
          space = true;
  
  
        } while (content.toLowerCase().indexOf(delimiter) == -1);
        return content;
      }
  
      this.get_token = function () { //initial handler for token-retrieval
        var token;
  
        if (this.last_token === 'TK_TAG_SCRIPT' || this.last_token === 'TK_TAG_STYLE') { //check if we need to format javascript
         var type = this.last_token.substr(7)
         token = this.get_contents_to(type);
          if (typeof token !== 'string') {
            return token;
          }
          return [token, 'TK_' + type];
        }
        if (this.current_mode === 'CONTENT') {
          token = this.get_content();
          if (typeof token !== 'string') {
            return token;
          }
          else {
            return [token, 'TK_CONTENT'];
          }
        }
  
        if (this.current_mode === 'TAG') {
          token = this.get_tag();
          if (typeof token !== 'string') {
            return token;
          }
          else {
            var tag_name_type = 'TK_TAG_' + this.tag_type;
            return [token, tag_name_type];
          }
        }
      }
  
      this.get_full_indent = function (level) {
        level = this.indent_level + level || 0;
        if (level < 1)
          return '';
  
        return Array(level + 1).join(this.indent_string);
      }
  
  
      this.printer = function (js_source, indent_character, indent_size, max_char, brace_style) { //handles input/output and some other printing functions
  
        this.input = js_source || ''; //gets the input for the Parser
        this.output = [];
        this.indent_character = indent_character;
        this.indent_string = '';
        this.indent_size = indent_size;
        this.brace_style = brace_style;
        this.indent_level = 0;
        this.max_char = max_char;
        this.line_char_count = 0; //count to see if max_char was exceeded
  
        for (var i=0; i<this.indent_size; i++) {
          this.indent_string += this.indent_character;
        }
  
        this.print_newline = function (ignore, arr) {
          this.line_char_count = 0;
          if (!arr || !arr.length) {
            return;
          }
          if (!ignore) { //we might want the extra line
            while (this.Utils.in_array(arr[arr.length-1], this.Utils.whitespace)) {
              arr.pop();
            }
          }
          arr.push('\n');
          for (var i=0; i<this.indent_level; i++) {
            arr.push(this.indent_string);
          }
        }
  
        this.print_token = function (text) {
          this.output.push(text);
        }
  
        this.indent = function () {
          this.indent_level++;
        }
  
        this.unindent = function () {
          if (this.indent_level > 0) {
            this.indent_level--;
          }
        }
      }
      return this;
    }
  
    /*_____________________--------------------_____________________*/
  
    multi_parser = new Parser(); //wrapping functions Parser
    multi_parser.printer(html_source, indent_character, indent_size, max_char, brace_style); //initialize starting values
  
    while (true) {
        var t = multi_parser.get_token();
        multi_parser.token_text = t[0];
        multi_parser.token_type = t[1];
  
      if (multi_parser.token_type === 'TK_EOF') {
        break;
      }
  
      switch (multi_parser.token_type) {
        case 'TK_TAG_START':
          multi_parser.print_newline(false, multi_parser.output);
          multi_parser.print_token(multi_parser.token_text);
          multi_parser.indent();
          multi_parser.current_mode = 'CONTENT';
          break;
        case 'TK_TAG_STYLE':
        case 'TK_TAG_SCRIPT':
          multi_parser.print_newline(false, multi_parser.output);
          multi_parser.print_token(multi_parser.token_text);
          multi_parser.current_mode = 'CONTENT';
          break;
        case 'TK_TAG_END':
          //Print new line only if the tag has no content and has child
          if (multi_parser.last_token === 'TK_CONTENT' && multi_parser.last_text === '') {
              var tag_name = multi_parser.token_text.match(/\w+/)[0];
              var tag_extracted_from_last_output = multi_parser.output[multi_parser.output.length -1].match(/<\s*(\w+)/);
              if (tag_extracted_from_last_output === null || tag_extracted_from_last_output[1] !== tag_name)
                  multi_parser.print_newline(true, multi_parser.output);
          }
          multi_parser.print_token(multi_parser.token_text);
          multi_parser.current_mode = 'CONTENT';
          break;
        case 'TK_TAG_SINGLE':
          // Don't add a newline before elements that should remain unformatted.
          var tag_check = multi_parser.token_text.match(/^\s*<([a-z]+)/i);
          if (!tag_check || !multi_parser.Utils.in_array(tag_check[1], unformatted)){
              multi_parser.print_newline(false, multi_parser.output);
          }
          multi_parser.print_token(multi_parser.token_text);
          multi_parser.current_mode = 'CONTENT';
          break;
        case 'TK_CONTENT':
          if (multi_parser.token_text !== '') {
            multi_parser.print_token(multi_parser.token_text);
          }
          multi_parser.current_mode = 'TAG';
          break;
        case 'TK_STYLE':
        case 'TK_SCRIPT':
          if (multi_parser.token_text !== '') {
            multi_parser.output.push('\n');
            var text = multi_parser.token_text;
            if (multi_parser.token_type == 'TK_SCRIPT') {
              var _beautifier = typeof js_beautify == 'function' && js_beautify;
            } else if (multi_parser.token_type == 'TK_STYLE') {
              var _beautifier = typeof css_beautify == 'function' && css_beautify;
            }
  
            if (options.indent_scripts == "keep") {
              var script_indent_level = 0;
            } else if (options.indent_scripts == "separate") {
              var script_indent_level = -multi_parser.indent_level;
            } else {
              var script_indent_level = 1;
            }
  
            var indentation = multi_parser.get_full_indent(script_indent_level);
            if (_beautifier) {
              // call the Beautifier if avaliable
              text = _beautifier(text.replace(/^\s*/, indentation), options);
            } else {
              // simply indent the string otherwise
              var white = text.match(/^\s*/)[0];
              var _level = white.match(/[^\n\r]*$/)[0].split(multi_parser.indent_string).length - 1;
              var reindent = multi_parser.get_full_indent(script_indent_level -_level);
              text = text.replace(/^\s*/, indentation)
                     .replace(/\r\n|\r|\n/g, '\n' + reindent)
                     .replace(/\s*$/, '');
            }
            if (text) {
              multi_parser.print_token(text);
              multi_parser.print_newline(true, multi_parser.output);
            }
          }
          multi_parser.current_mode = 'TAG';
          break;
      }
      multi_parser.last_token = multi_parser.token_type;
      multi_parser.last_text = multi_parser.token_text;
    }
    return multi_parser.output.join('');
  }

// with type, safely get data from local storage (assumes it was set using the setter below)
export function localStorageGet(name, defaultValue = "") {
  try {
    if (localStorage.getItem(name) === null) {
      return defaultValue;
    }
    return JSON.parse(localStorage.getItem(name));
  } catch (e) {
    return false;
  }
}

// convert mimetype into a readable file extension
export function mimeTypeToName(mimeType) {
  let data = mimeType.split('/');
  switch (data[1]) {
    case 'msword':
      return '.doc';
    case 'application/vnd.ms-excel':
      return '.xls';
    case 'vnd.ms-powerpoint':
      return '.ppt';
    case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
      return '.docx';
    case 'vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return '.xlsx';
    case 'vnd.openxmlformats-officedocument.presentationml.presentation':
      return '.pptx';
    case 'mpeg':
      return '.mp3';
    case 'svg+xml':
      return '.svg';
    case 'markdown':
      return '.md';
    case 'plain':
      return 'text';
    case 'text':
      return '.txt';
    case 'rtf':
    case 'gif':
    case 'jpeg':
    case 'jpg':
    case 'png':
    case 'webm':
    case 'webp':
    case 'html':
    case 'htm':
    case 'zip':
    case 'csv':
    case 'pdf':
    case 'mp4':
    return `.${data[1]}`;
  }

  return 'file';
}

// set type safe variables
export function localStorageSet(name, newItem) {
  try {
    return localStorage.setItem(name, JSON.stringify(newItem));
  } catch (e) {
    return false;
  }
}

// delete item from local storage
export function localStorageDelete(name) {
  try {
    return localStorage.removeItem(name);
  } catch (e) {
    return false;
  }
}

// https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
function validURL(str) {
  let url;
  try {
    url = new URL(str);
  } catch (e) {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  }
  return url.protocol === "https:";
}
/**
 * Take an array of items and apply a map of values to generate a new
 * array that is the structure you're looking for with default values
 * filling in the gaps.
 */
function valueMapTransform(items, map) {
  // ensure we have a map to render
  let tmpAry = [];
  if (map) {
    items.forEach((item) => {
      // create tag for the map
      let tmp = {};
      for (var key in map) {
        let value = map[key];
        // complex transform capability for values that need processing
        // prior to being set
        if (value === true || value === false || value === null) {
          tmp[key] = value;
        } else if (typeof value === "function") {
          try {
            tmp[key] = value(item);
          } catch (e) {
            console.warn(e);
          }
        }
        // only set the value in the node IF we have a match in the item for data
        // odd trap but the transform case can potentially miss above and this then pass
        // which varExists requires value be a string
        else if (typeof value === "string" && varExists(item, value)) {
          tmp[key] = varGet(item, value);
        } else {
          tmp[key] = value;
        }
      }
      tmpAry.push(tmp);
    });
  }
  return tmpAry;
}

/**
 * Helper to convert camel case to dash; important when setting attributes.
 */
function camelToDash(str) {
  return str
    .replace(/\W+/g, "-")
    .replace(/([a-z\d])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

/**
 * Helper to convert dash to camel; important when reading attributes.
 */
function dashToCamel(str) {
  return str.replace(/-([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
}
/**
 * Convert a haxElement to a DOM node.
 * @return {Node} DOM node.
 */
function haxElementToNode(haxSchema) {
  let tag = haxSchema.tag;
  let content = haxSchema.content ? haxSchema.content : "";
  let properties = haxSchema.properties ? haxSchema.properties : {};
  // support sandboxed environments which
  // will hate iframe tags but love webview
  if (
    globalThis.HaxStore &&
    globalThis.HaxStore.instance &&
    globalThis.HaxStore.instance._isSandboxed &&
    tag === "iframe"
  ) {
    tag = "webview";
  }
  var frag = globalThis.document.createElement(tag);
  frag.innerHTML = content;
  // clone the fragment which will force an escalation to full node
  var newNode = frag.cloneNode(true);

  // support for properties if they exist
  for (var property in properties) {
    let attributeName = camelToDash(property);
    if (properties.hasOwnProperty(property)) {
      // special supporting for boolean because html is weird :p
      if (properties[property] === true) {
        newNode.setAttribute(attributeName, properties[property]);
      } else if (properties[property] === false) {
        newNode.removeAttribute(attributeName);
      } else if (
        properties[property] != null &&
        properties[property].constructor === Array
      ) {
        // do nothing if we have additional data to suggest this is actually readOnly
        // polymer / typed specific thing
        if (
          frag.properties &&
          frag.properties[property] &&
          frag.properties[property].readOnly
        ) {
        } else {
          if (newNode.set) {
            newNode.set(attributeName, properties[property]);
          } else {
            newNode[attributeName] = [...properties[property]];
          }
        }
      } else if (
        properties[property] != null &&
        properties[property].constructor === Object
      ) {
        // do nothing if we have additional data to suggest this is actually readOnly
        // polymer / typed specific thing
        if (
          frag.properties &&
          frag.properties[property] &&
          frag.properties[property].readOnly
        ) {
        } else {
          if (newNode.set) {
            newNode.set(attributeName, properties[property]);
          } else {
            newNode[attributeName] = { ...properties[property] };
          }
        }
      } else {
        newNode.setAttribute(attributeName, properties[property]);
      }
    }
  }
  return newNode;
}
/**
 * Conver camel case to dash case
 */
function camelCaseToDash(key) {
  return key.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
}
/**
 * Encapsulate script types in an HTML blob
 */
function encapScript(html) {
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
      function (match, contents, offset, input_string) {
        match = match.replace("&lt;script&gt;", "<script>");
        match = match.replace("&lt;/script&gt;", "</script>");
        match = match.replace("&lt;style&gt;", "<style>");
        match = match.replace("&lt;/style&gt;", "</style>");
        return match;
      }
    );
  }
  return html;
}
/**
 * Find custom elements in HTML
 */
function findTagsInHTML(html) {
  let tags = {};
  let tag = "";
  var matches = html.match(/<\/([a-z,0-9]*?)-(\S*?)>/g);
  for (var i in matches) {
    tag = matches[i].replace("</", "").replace(">", "");
    tags[tag] = tag;
  }
  return tags;
}
/**
 * Wipe slotted content
 */
function wipeSlot(element, slot = "*") {
  // 100% clean slate
  if (slot === "*") {
    while (element.firstChild !== null) {
      element.removeChild(element.firstChild);
    }
  } else {
    for (var i in element.childNodes) {
      // test for element nodes to be safe
      if (
        typeof element.childNodes[i] !== typeof undefined &&
        element.childNodes[i].slot === slot
      ) {
        element.removeChild(element.childNodes[i]);
      }
    }
  }
}
/**
 * Generate a uinque ID
 */
function generateResourceID(base = "#") {
  function idPart() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return (
    base +
    idPart() +
    idPart() +
    "-" +
    idPart() +
    "-" +
    idPart() +
    "-" +
    idPart() +
    "-" +
    idPart() +
    idPart() +
    idPart()
  );
}
//converts unicode to HTML entity
export function utf2Html(str) {
  return [...str]
    .map((char) =>
      char.codePointAt() > 127 ? `&#${char.codePointAt()};` : char
    )
    .join("");
}

export function htmlEntities(s) {
  return s.replace(/[\u00A0-\u9999<>\&]/gim, function (i) {
    return "&#" + i.charCodeAt(0) + ";";
  });
}
/**
 * Strip word BS as well as GDocs, box notes, Medium and some others as best we can
 */
function stripMSWord(input) {
  // 1. remove line breaks / Mso classes right off the bat
  var output = input
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
  output = output.replace(/<\!--(\s|.)*?-->/gim, "");
  output = output.replace(/<\!(\s|.)*?>/gim, "");
  // 3. remove tags leave content if any
  output = output.replace(
    /<(\/)*(meta|link|title|html|head|body|span|font|br|\\\\?xml:|xml|st1:|o:|w:|m:|v:)(\s|.)*?>/gim,
    ""
  );
  // 4. Remove everything in between and including tags '<style(.)style(.)>'
  var badTags = ["style", "script", "applet", "embed", "noframes", "noscript"];
  for (var i in badTags) {
    let tagStripper = new RegExp(
      "<" + badTags[i] + "(s|.)*?" + badTags[i] + "(.*?)>",
      "gim"
    );
    output = output.replace(tagStripper, "");
  }
  // 5. remove attributes ' style="..."', align, start and others that we know we dont need
  output = output.replace(/ style='(\s|.)*?'/gim, "");
  output = output.replace(/ face="(\s|.)*?"/gim, "");
  output = output.replace(/ align=.*? /g, "");
  output = output.replace(/ start='.*?'/g, "");
  // remove line-height; commonly set via html copy and paste in google docs
  output = output.replace(/line-height:.*?\"/g, '"');
  output = output.replace(/line-height:.*?;/g, "");
  // normal font cause... obviously
  output = output.replace(/font-weight:normal;/g, "");
  // text decoration in a link...
  output = output.replace(/text-decoration:none;/g, "");
  // margin clean up that is in point values; only machines make these
  output = output.replace(/margin-.*?:.*?\"/g, '"');
  output = output.replace(/margin-.*?:.*?;/g, "");
  // empty style tags
  output = output.replace(/ style=""/g, "");
  // ID's wont apply meaningfully on a paste
  output = output.replace(/ id="(\s|.)*?"/gim, "");
  // Google Docs ones
  output = output.replace(/ dir="(\s|.)*?"/gim, "");
  output = output.replace(/ role="(\s|.)*?"/gim, "");
  // these are universally true tho so fine to have here
  output = output.replace(/ contenteditable="(\s|.)*?"/gim, "");
  // some medium, box, github and other paste stuff as well as general paste clean up for classes
  // in multiple html primatives
  output = output.replace(/ data-(\s|.)*?"(\s|.)*?"/gim, "");
  output = output.replace(/ class="(\s|.)*?"/gim, "");
  output = output.replace(/<pstyle/gm, "<p style");
  // HIGHLY specific to certain platforms, empty link tag
  output = output.replace(/<a name=\"_GoBack\"><\/a>/gm, "");
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
  output = output.replace(/<p style=\".*?\">/gm, "<p>");
  output = output.replace(/<ul style=\".*?\">/gm, "<ul>");
  output = output.replace(/<ol style=\".*?\">/gm, "<ol>");
  output = output.replace(/<li style=\".*?\">/gm, "<li>");
  output = output.replace(/<td style=\".*?\">/gm, "<td>");
  output = output.replace(/<tr style=\".*?\">/gm, "<tr>");
  // drop list wrappers
  output = output.replace(/<li><p>/gm, "<li>");
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
  output = output.replace(/ data-hax-ray="(\s|.)*?"/gim, "");
  output = output.replace(/ class=""/gim, "");
  output = output.replace(/ class="hax-active"/gim, "");
  output = output.replace(/ contenteditable="(\s|.)*?"/gim, "");
  // wow do I hate contenteditable and the dom....
  // bold and italic are treated as if they are block elements in a paste scenario
  // 8. check for empty bad tags
  for (var i in badTags) {
    let emptyTagRemove = new RegExp(
      "<" + badTags[i] + "></" + badTags[i] + ">",
      "gi"
    );
    output = output.replace(emptyTagRemove, "");
  }
  output = output.trim();
  return output;
}

/**
 * Test if a variable along a given object path exists
 */
function varExists(obj, path) {
  let g = objectValFromStringPos(obj, path, "__failedToFind__");
  if (g != "__failedToFind__") {
    return true;
  }
  return false;
}
/**
 * Return an object path or fallback value if not set
 */
function varGet(obj, path, fallback = "") {
  return objectValFromStringPos(obj, path, fallback);
}

// helper to use strings for index in Objects
function objectValFromStringPos(o, s, r = null) {
  s = s.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
  s = s.replace(/^\./, ""); // strip a leading dot
  var a = s.split(".");
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i];
    if (o) {
      if (k in o) {
        o = o[k];
      } else {
        return r;
      }
    } else {
      return r;
    }
  }
  return o;
}
/**
 * Convert a node to a HAX element. Hax elements ensure
 * a certain level of sanitization by verifying tags and
 * properties / attributes that have values.
 */
async function nodeToHaxElement(node, eventName = "insert-element") {
  if (!node) {
    return null;
  }
  // build out the properties to send along
  var props = {};
  // support basic styles
  if (typeof node.style !== typeof undefined) {
    props.style = node.getAttribute("style");
  }
  // don't set a null style
  if (props.style === null || props.style === "null") {
    delete props.style;
  }
  // test if a class exists, not everything scopes
  if (typeof node.attributes.class !== typeof undefined) {
    props.class = node.attributes.class.value.replace("hax-active", "");
  }
  // test if a id exists as its a special case in attributes... of course
  if (typeof node.attributes.id !== typeof undefined) {
    props.id = node.getAttribute("id");
  }
  let tmpProps;
  // relatively cross library
  if (customElements.get(node.tagName.toLowerCase())) {
    tmpProps = customElements.get(node.tagName.toLowerCase()).properties;
  }
  // weak fallback
  if (typeof tmpProps === typeof undefined) {
    tmpProps = node.__data;
  }
  // complex elements need complex support
  if (typeof tmpProps !== typeof undefined) {
    // run through attributes, though non-reflected props won't be here
    // run through props, we always defer to property values
    for (var property in tmpProps) {
      // make sure we only set things that have a value
      if (
        property != "class" &&
        property != "style" &&
        tmpProps.hasOwnProperty(property) &&
        typeof node[property] !== undefined &&
        node[property] != null &&
        node[property] != ""
      ) {
        props[property] = node[property];
      }
      // special support for false boolean
      else if (node[property] === false) {
        props[property] = false;
      } 
      else if (node[property] === true) {
        props[property] = true;
      }
      else if (node[property] === 0) {
        props[property] = 0;
      }
      else {
        // unknown prop setting / ignored
        //console.warn(node[property], property);
      }
    }
    for (var attribute in node.attributes) {
      // make sure we only set things that have a value
      if (
        typeof node.attributes[attribute].name !== typeof undefined &&
        node.attributes[attribute].name != "class" &&
        node.attributes[attribute].name != "style" &&
        node.attributes[attribute].name != "id" &&
        node.attributes.hasOwnProperty(attribute) &&
        typeof node.attributes[attribute].value !== undefined &&
        node.attributes[attribute].value != null &&
        node.attributes[attribute].value != "" &&
        !tmpProps.hasOwnProperty(dashToCamel(node.attributes[attribute].name))
      ) {
        props[node.attributes[attribute].name] =
          node.attributes[attribute].value;
      }
      else if (node.attributes[attribute].value == "0") {
        props[node.attributes[attribute].name] =
        node.attributes[attribute].value;
      }
      else {
        // note: debug here if experiencing attributes that won't bind
        //console.warn(node.attributes[attribute].name, node.attributes[attribute].value);
      }
    }
  } else {
    // much easier case, usually just in primatives
    for (var attribute in node.attributes) {
      // make sure we only set things that have a value
      if (
        typeof node.attributes[attribute].name !== typeof undefined &&
        node.attributes[attribute].name != "class" &&
        node.attributes[attribute].name != "style" &&
        node.attributes[attribute].name != "id" &&
        node.attributes.hasOwnProperty(attribute) &&
        typeof node.attributes[attribute].value !== undefined &&
        node.attributes[attribute].value != null &&
        node.attributes[attribute].value != ""
      ) {
        props[node.attributes[attribute].name] =
          node.attributes[attribute].value;
      }
    }
  }
  // support sandboxed environments which
  // will hate iframe tags but love webview
  let tag = node.tagName.toLowerCase();
  if (globalThis.HaxStore && globalThis.HaxStore.instance && globalThis.HaxStore.instance._isSandboxed && tag === "iframe") {
    tag = "webview";
  }
  let slotContent = '';
  // if hax store around, allow it to get slot content of the node
  if (globalThis.HaxStore && globalThis.HaxStore.instance) {
    slotContent = await globalThis.HaxStore.instance.getHAXSlot(node);
  }
  else {
    // if HAX isn't around, just return the innerHTML as a string for asignment to content
    slotContent = node.innerHTML;
  }
  // support fallback on inner text if there were no nodes
  if (slotContent == "") {
    slotContent = node.innerText;
  }
  // special edge case for slot binding in primatives
  if (tag === "a" || tag === "mark" || tag === "abbr") {
    props.innerText = slotContent;
  } else if (
    tag === "p" ||
    tag === "table" ||
    tag === "ol" ||
    tag === "ul" ||
    tag === "div"
  ) {
    props.innerHTML = slotContent;
  }
  let element = {
    tag: tag,
    properties: props,
    content: slotContent,
  };

  if (eventName !== null) {
    element.eventName = eventName;
  }
  return element;
}

/**
 * Manage window based events in a consistent and simple manner
 */
export const winEventsElement = function (SuperClass) {
  return class extends SuperClass {
    __applyWinEvents(status) {
      if (this.__winEvents) {
        for (var eName in this.__winEvents) {
          window[`${status ? "add" : "remove"}EventListener`](
            eName,
            this[this.__winEvents[eName]]
          );
        }
      }
    }
    /**
     * HTMLElement connected element
     */
    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      // bind to this context prior to assignment so we can enable and disable accurately from window
      for (var eName in this.__winEvents) {
        this[this.__winEvents[eName]] = this[this.__winEvents[eName]].bind(this);
      }
      this.__applyWinEvents(true);
    }
    /**
     * HTML Element disconnected element
     */
    disconnectedCallback() {
      this.__applyWinEvents(false);
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
    }
  };
};

export {
  wrap,
  wrapAll,
  unwrap,
  formatHTML,
  validURL,
  valueMapTransform,
  haxElementToNode,
  dashToCamel,
  camelToDash,
  camelCaseToDash,
  encapScript,
  findTagsInHTML,
  wipeSlot,
  generateResourceID,
  stripMSWord,
  varExists,
  varGet,
  objectValFromStringPos,
  nodeToHaxElement,
};

/**
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

const debug = false;

const validNodeTypes = globalThis.Node ? [
  globalThis.Node.ELEMENT_NODE,
  globalThis.Node.TEXT_NODE,
  globalThis.Node.DOCUMENT_FRAGMENT_NODE,
] : [];
function isValidNode(node) {
  return validNodeTypes.includes(node.nodeType);
}

function findNode(s, parentNode, isLeft) {
  const nodes = parentNode.childNodes || parentNode.children;
  if (!nodes) {
    return parentNode; // found it, probably text
  }

  for (let i = 0; i < nodes.length; ++i) {
    const j = isLeft ? i : nodes.length - 1 - i;
    const childNode = nodes[j];
    if (!isValidNode(childNode)) {
      continue;
    }

    debug && console.debug("checking child", childNode, "IsLeft", isLeft);
    if (s.containsNode(childNode, true)) {
      if (s.containsNode(childNode, false)) {
        debug && console.info("found child", childNode);
        return childNode;
      }
      debug && console.info("descending child", childNode);
      return findNode(s, childNode, isLeft);
    }
    debug && console.info(parentNode, "does NOT contain", childNode);
  }
  return parentNode;
}

/**
 * detect if an element is currently in the viewport / visible
 * @param {Node} el
 * @returns Boolean
 */
export function isElementInViewport(
  el,
  bounds = {
    top: 0,
    right: globalThis.innerWidth,
    bottom: globalThis.innerHeight,
    left: 0,
  }
) {
  var rect = el.getBoundingClientRect();
  return (
    rect.top >= bounds.top &&
    rect.left >= bounds.left &&
    rect.bottom <= bounds.bottom &&
    rect.right <= bounds.right
  );
}

/**
 * @param {!Selection} s the window selection to use
 * @param {!Node} node the node to walk from
 * @param {boolean} walkForward should this walk in natural direction
 * @return {boolean} whether the selection contains the following node (even partially)
 */
function containsNextElement(s, node, walkForward) {
  const start = node;
  while ((node = walkFromNode(node, walkForward))) {
    // walking (left) can contain our own parent, which we don't want
    if (!node.contains(start)) {
      break;
    }
  }
  if (!node) {
    return false;
  }
  // we look for Element as .containsNode says true for _every_ text node, and we only care about
  // elements themselves
  return node instanceof Element && s.containsNode(node, true);
}

/**
 * @param {!Selection} s the window selection to use
 * @param {!Node} leftNode the left node
 * @param {!Node} rightNode the right node
 * @return {boolean|undefined} whether this has natural direction
 */
function getSelectionDirection(s, leftNode, rightNode) {
  if (s.type !== "Range") {
    return undefined; // no direction
  }
  const measure = () => s.toString().length;

  const initialSize = measure();
  debug && console.info(`initial selection: "${s.toString()}"`);

  if (initialSize === 1 && leftNode === rightNode) {
    // nb. We need to reset a single selection as Safari _always_ tells us the cursor was dragged
    // left to right (maybe RTL on those devices).
    // To be fair, Chrome has the same bug.
    debug && console.debug("resetting size=1");
    s.extend(leftNode, 0);
    s.collapseToEnd();
    return undefined;
  }

  let updatedSize;

  // Try extending forward and seeing what happens.
  s.modify("extend", "forward", "character");
  updatedSize = measure();
  debug && console.info(`forward selection: "${s.toString()}"`);

  if (updatedSize > initialSize || containsNextElement(s, rightNode, true)) {
    debug && console.info("got forward >, moving right");
    s.modify("extend", "backward", "character");
    return true;
  } else if (updatedSize < initialSize || !s.containsNode(leftNode)) {
    debug && console.info("got forward <, moving left");
    s.modify("extend", "backward", "character");
    return false;
  }

  // Maybe we were at the end of something. Extend backwards.
  // TODO(samthor): We seem to be able to get away without the 'backwards' case.
  s.modify("extend", "backward", "character");
  updatedSize = measure();
  debug && console.info(`backward selection: "${s.toString()}"`);

  if (updatedSize > initialSize || containsNextElement(s, leftNode, false)) {
    debug && console.info("got backwards >, moving left");
    s.modify("extend", "forward", "character");
    return false;
  } else if (updatedSize < initialSize || !s.containsNode(rightNode)) {
    debug && console.info("got backwards <, moving right");
    s.modify("extend", "forward", "character");
    return true;
  }

  // This is likely a select-all.
  return undefined;
}

/**
 * Returns the next valid node (element or text). This is needed as Safari doesn't support
 * TreeWalker inside Shadow DOM. Don't escape shadow roots.
 *
 * @param {!Node} node to start from
 * @param {boolean} walkForward should this walk in natural direction
 * @return {Node} node found, if any
 */
function walkFromNode(node, walkForward) {
  if (!walkForward) {
    return node.previousSibling || node.parentNode || null;
  }
  while (node) {
    if (node.nextSibling) {
      return node.nextSibling;
    }
    node = node.parentNode;
  }
  return null;
}

/**
 * @param {!Node} node to start from
 * @param {boolean} isLeft is this a left node
 * @param {string} s expected string
 * @return {?{node: !Node, offset: number}}
 */
function walkTextFromNode(node, isLeft, s) {
  for (; node; node = walkFromNode(node, isLeft)) {
    if (node.nodeType !== Node.TEXT_NODE) {
      continue;
    }

    const t = node.textContent;
    if (isLeft) {
      if (s.length < t.length) {
        return { node, offset: s.length };
      }

      const prefix = s.substr(0, t.length);
      if (prefix !== t) {
        console.debug("unexpected string prefix", prefix, "expected", t);
      }

      s = s.substr(t.length);
    } else {
      if (s.length < t.length) {
        return { node, offset: t.length - s.length };
      }

      const suffix = s.substr(s.length - t.length);
      if (suffix !== t) {
        console.debug("unexpected string suffix", suffix, "expected", t);
      }

      s = s.substr(0, s.length - t.length);
    }
  }

  return null; // too far
}

/**
 * @param {!Node} node
 * @return {number} count of initial space
 */
function initialSpace(node) {
  if (node.nodeType !== Node.TEXT_NODE) {
    return 0;
  }
  return /^\s*/.exec(node.textContent)[0].length;
}

/**
 * @param {!Node} node
 * @return {number} count of ignored trailing space
 */
function ignoredTrailingSpace(node) {
  if (node.nodeType !== Node.TEXT_NODE) {
    return 0;
  }
  const trailingSpaceCount = /\s*$/.exec(node.textContent)[0].length;
  if (!trailingSpaceCount) {
    return 0;
  }
  return trailingSpaceCount - 1; // always allow single last
}

const cachedRange = new Map();
export function getRange(root) {
  if (root.getSelection) {
    const s = root.getSelection();
    return s.rangeCount ? s.getRangeAt(0) : null;
  }

  const thisFrame = cachedRange.get(root);
  if (thisFrame) {
    return thisFrame;
  }

  const initialText = globalThis.getSelection().toString();
  const result = internalGetShadowSelection(root);
  const rs = (result && result.range && result.range.toString()) || null;
  if (rs !== null && rs !== initialText) {
    // TODO: sometimes triggers on single-char hack etc

    if (rs.replace(/\s/g, "") !== initialText.replace(/\s/g, "")) {
      // nb. selection eats initial/ending space, range does not: if whitespace is the only
      // difference, then ignore
      console.warn("invalid range, initial text:", initialText);
      console.warn("vs", rs, result.mode, result.range);
    }
  }

  cachedRange.set(root, result.range);
  globalThis.setTimeout(() => {
    cachedRange.delete(root);
  }, 0);
  debug && console.debug("getRange got", result);
  return result.range;
}

export function internalGetShadowSelection(root) {
  const fakeSelectionNode = globalThis.document.createTextNode("");
  const range = globalThis.document.createRange();
  const s = globalThis.getSelection();
  if (s && root.host && !s.containsNode(root.host, true)) {
    return { range: null, mode: "none" };
  }

  // TODO: inserting fake nodes isn't ideal, but containsNode doesn't work on nearby adjacent
  // text nodes (in fact it returns true for all text nodes on the page?!).

  // insert a fake 'before' node to see if it's selected
  root.insertBefore(fakeSelectionNode, root.childNodes[0]);
  const includesBeforeRoot = s.containsNode(fakeSelectionNode);
  fakeSelectionNode.remove();
  if (includesBeforeRoot) {
    return { range: null, mode: "outside-before" };
  }

  // insert a fake 'after' node to see if it's selected
  root.appendChild(fakeSelectionNode);
  const includesAfterRoot = s.containsNode(fakeSelectionNode);
  fakeSelectionNode.remove();
  if (includesAfterRoot) {
    return { range: null, mode: "outside-after" };
  }

  const measure = () => s.toString().length;
  const initialSelectionContent = s.toString();
  if (s.type === "None") {
    return null;
  }
  if (!(s.type === "Caret" || s.type === "Range")) {
    throw new TypeError("unexpected type: " + s.type);
  }
  const initialCaret = s.type === "Caret";

  const leftNode = findNode(s, root, true);
  let rightNode;
  let isNaturalDirection = undefined;
  if (s.type === "Range") {
    rightNode = findNode(s, root, false); // get right node here _before_ getSelectionDirection
    isNaturalDirection = getSelectionDirection(s, leftNode, rightNode);
    // isNaturalDirection means "going right"
  }

  if (s.type === "Caret") {
    // we might transition to being a caret, so don't check initial value
    s.extend(leftNode, 0);
    const at = measure();
    s.collapseToEnd();
    if (
      leftNode.nodeType === 1 &&
      leftNode.childNodes &&
      leftNode.childNodes.length > 0
    ) {
      range.setStart(leftNode.childNodes[0], at);
      range.setEnd(leftNode.childNodes[0], at);
    } else {
      range.setStart(leftNode, at);
      range.setEnd(leftNode, at);
    }
    return { range, mode: "caret" };
  } else if (isNaturalDirection === undefined) {
    if (s.type !== "Range") {
      throw new TypeError("unexpected type: " + s.type);
    }
    // This occurs when we can't move because we can't extend left or right to measure the
    // direction we're moving in. Good news though: we don't need to _change_ the selection
    // to measure it, so just return immediately.
    range.setStart(leftNode.childNodes[0], 0);
    range.setEnd(rightNode, rightNode.length);
    return { range, mode: "all" };
  }

  const size = measure();
  let offsetLeft, offsetRight;

  // only one newline/space char is cared about
  const validRightLength = rightNode.length - ignoredTrailingSpace(rightNode);

  if (isNaturalDirection) {
    // walk in the opposite direction first
    s.extend(leftNode, 0);
    offsetLeft = measure() + initialSpace(leftNode); // measure doesn't include initial space

    // then in our actual direction
    s.extend(rightNode, validRightLength);
    offsetRight = validRightLength - (measure() - size);

    // then revert to the original position
    s.extend(rightNode, offsetRight);
  } else {
    // walk in the opposite direction first
    s.extend(rightNode, validRightLength);
    offsetRight = validRightLength - measure();

    // then in our actual direction
    s.extend(leftNode, 0);
    offsetLeft = measure() - size + initialSpace(leftNode); // doesn't include initial space

    // then revert to the original position
    s.extend(leftNode, offsetLeft);
  }

  if (debug) {
    if (leftNode === rightNode) {
      console.info(
        "got string",
        leftNode.textContent.substr(offsetLeft, offsetRight - offsetLeft)
      );
    } else {
      console.info(">>> string", leftNode.textContent.substr(offsetLeft));
      console.info("<<< string", rightNode.textContent.substr(0, offsetRight));
    }
  }

  range.setStart(leftNode, offsetLeft);
  range.setEnd(rightNode, offsetRight);
  return {
    mode: isNaturalDirection ? "right" : "left",
    range,
  };
}

// polyfill from https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/replaceWith
export function ReplaceWithPolyfill() {
  "use-strict"; // For safari, and IE > 10
  var parent = this.parentNode,
    i = arguments.length,
    currentNode;
  if (!parent) return;
  if (!i)
    // if there are no arguments
    parent.removeChild(this);
  while (i--) {
    // i-- decrements i and returns the value of i before the decrement
    currentNode = arguments[i];
    if (typeof currentNode !== "object") {
      currentNode = this.ownerDocument.createTextNode(currentNode);
    } else if (currentNode.parentNode) {
      currentNode.parentNode.removeChild(currentNode);
    }
    // the value of "i" below is after the decrement
    if (!i)
      // if currentNode is the first argument (currentNode === arguments[0])
      parent.replaceChild(currentNode, this);
    // if currentNode isn't the first
    else parent.insertBefore(currentNode, this.nextSibling);
  }
}
