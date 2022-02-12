/**
 * Copyright 2018 Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import "./rich-text-editor-highlight.js";
import "./rich-text-editor-clipboard.js";
import "./rich-text-editor-source.js";

export const RichTextEditorRangeBehaviors = function (SuperClass) {
  return class extends SuperClass {
    /**
     * Declared properties and their corresponding attributes
     */
    static get properties() {
      return {
        /**
         * current text selected range, which is actually a range.
         */
        range: {
          name: "range",
          type: Object,
        },
        __toolbar: {
          name: toolbar,
          type: Object,
        },
        __highlight: {
          type: Object,
        },
        __clipboard: {
          type: Object,
        },
        __source: {
          type: Object,
        },
      };
    }

    constructor() {
      super();
      this.haxUIElement = true;
      this.__highlight = window.RichTextEditorHighlight.requestAvailability();
      this.__clipboard = window.RichTextEditorClipboard.requestAvailability();
    }

    get commandIsToggled() {
      return this.commandToggledForRange(this.range);
    }
    /**
     * whether or not toolbar breadcrumbs
     * (override to force a toolbar to always use or not use them)
     *
     * @readonly
     */
    get hasBreadcrumbs() {
      return false;
    }
    /**
     * an array of all the valid commands that are toggled
     *
     * @readonly
     */
    get toggledCommands() {
      return this.toggledCommandsForRange();
    }

    /**
     * gets valid commands list
     *
     * @readonly
     */
    get validCommands() {
      return [
        "backColor",
        "bold",
        "copy",
        "createLink",
        "cut",
        "decreaseFontSize",
        "defaultParagraphSeparator",
        "delete",
        "fontName",
        "fontSize",
        "foreColor",
        "formatBlock",
        "forwardDelete",
        "hiliteColor",
        "increaseFontSize",
        "indent",
        "insertBrOnReturn",
        "insertHorizontalRule",
        "insertHTML",
        "insertImage",
        "insertLineBreak",
        "insertOrderedList",
        "insertUnorderedList",
        "insertParagraph",
        "insertText",
        "italic",
        "justifyCenter",
        "justifyFull",
        "justifyLeft",
        "justifyRight",
        "outdent",
        "paste",
        "redo",
        "removeFormat",
        "selectAll",
        "strikeThrough",
        "styleWithCss",
        "subscript",
        "superscript",
        "underline",
        "undo",
        "unlink",
        "useCSS",
        "wrapRange",
      ];
    }

    /**
     * closes the toolbar
     *
     * @param {object} toolbar
     * @param {object} editor
     * @memberof RichTextEditorManager
     */
    closeToolbar(toolbar = this.__toolbar, editor = this.__toolbar.target) {
      if (editor) toolbar.disableEditing(editor);
      toolbar.target = undefined;
      document.body.append(toolbar);
    }
    /* ------ HANDLES CLIPBOARD AND HTML ------------------------- */

    sanitizeHTML(html) {
      return this.__toolbar.sanitizeHTML(html);
    }
    /**
     * gets trimmed version of innerHTML
     *
     * @param {obj} node
     * @returns {string}
     * @memberof RichTextEditor
     */
    trimHTML(node) {
      let str = node ? node.innerHTML : undefined;
      return this.trimString(str);
    }
    /**
     * cleans and trims a string of HTML so that it has no extra spaces
     *
     * @param {string} str
     * @returns {string}
     */
    trimString(str) {
      return (str || "")
        .replace(/<!--[^(-->)]*-->/g, "")
        .replace(/[\s\t\r\n]/gim, "");
    }
    /**
     * cleans up indents and extra spaces in HTML string for source code editor
     *
     * @param {string} [str=""]
     * @returns {string}
     */
    outdentHTML(str = "") {
      str = (this.sanitizeHTML(str) || "")
        .replace(/[\s]*$/, "")
        .replace(/^[\n\r]*/, "")
        .replace(/[\n\r]+/gm, "\n");
      let match = str.match(/^\s+/),
        find = match ? match[0] : false,
        regex = !find ? false : new RegExp(`\\n${find}`, "gm");
      str = str.replace(/^\s+/, "");
      str = regex ? str.replace(regex, "\n ") : str;
      return str;
    }

    /**
     * pastes sanitized clipboard contents into current editor's selected range
     * @param {object} editor an HTML object that can be edited
     * @returns {void}
     */
    pasteFromClipboard(range = this.range) {
      this.__clipboard.setClipboard();
      setTimeout(async () => {
        this.paste(this.__clipboard.value, range, true);
      }, 100);
    }
    /**
     * pastes content into editor's selected range
     *
     * @param {obj} editor editor
     * @param {obj} pasteContent content to paste
     * @memberof RichTextEditorSelection
     */
    paste(pasteContent, range = this.range, sanitize = true) {
      this.dispatchEvent(
        new CustomEvent("paste", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this.target,
        })
      );
      let target = this.__toolbar.target;
      if (target) {
        let range = this.range,
          div = document.createElement("div"),
          parent = range.commonAncestorContainer.parentNode,
          closest = parent.closest(
            "[contenteditable=true]:not([disabled]),input:not([disabled]),textarea:not([disabled])"
          );
        if ((target = closest)) {
          div.innerHTML = sanitize
            ? this.sanitizeHTML(pasteContent || this.__clipboard.value)
            : pasteContent;
          if (range && range.extractContents) {
            range.extractContents();
          }
          range.insertNode(div);
          while (div.firstChild) {
            div.parentNode.insertBefore(div.firstChild, div);
          }
          div.parentNode.removeChild(div);
        }
        target.normalize();
      }
    }

    /* ------ GETS SELECTION / RANGE ------------------------- */
    /**
     * determines if range is being preserved by highlight
     *
     * @readonly
     */
    get highlighted() {
      return !!this.__highlight && !this.__highlight.hidden;
    }

    getRange() {
      let sel = this.getSelection();
      return this.__toolbar ? this.__toolbar.getRange() : sel.getRangeAt(0);
    }

    getSelection() {
      return this.__toolbar
        ? this.__toolbar.getSelection()
        : window.getSelection();
    }

    /**
     * gets closest shadowRoot or document from node
     *
     * @param {object} node
     * @returns object
     * @memberof RichTextEditorManager
     */
    getRoot(node) {
      return !node || node === document
        ? document
        : node.parentNode
        ? this.getRoot(node.parentNode)
        : node;
    }
    debugRange(range = this.getRange()) {
      let contents =
          !range || range.collapsed || !range.cloneContents
            ? false
            : range.cloneContents(),
        ancestor = !range ? false : range.commonAncestorContainer,
        elementSiblings = !ancestor ? [] : ancestor.children,
        siblings = !ancestor ? [] : ancestor.childNodes,
        ancestorHTML = !ancestor ? "" : ancestor.innerHTML;
      return {
        range: range,
        contents: contents,
        html: contents.innerHTML,
        text: !contents ? false : contents.textContent,
        siblngs: siblings,
        elementSiblings: elementSiblings,
        ancestorHTML: ancestorHTML,
      };
    }
    /**
     * determines if command should be toggled on for a specfified range.
     * Example: if range is bold, returns 'b'
     *
     * @param {*} [range=this.range || this.getRange()]
     * @param {*} [command=this.command]
     * @returns
     */
    commandToggledForRange(
      range = this.range || this.getRange(),
      command = this.command,
      commandVal = this.commandVal
    ) {
      let query =
          !!range && !!command
            ? document.queryCommandState(this.command)
            : false,
        /* workaround because queryCommandState("underline") returns true on links */
        block =
          command === "underline"
            ? !!this.rangeOrMatchingAncestor("u")
            : command === "wrapRange"
            ? !!this.rangeOrMatchingAncestor(commandVal)
            : query;
      return !!block ? true : false;
    }
    /**
     * returns an array of all toggled commands for a range.
     * Example: if range is bold and italicized, returns ['b','i']
     *
     * @param {range} [range=this.range || this.getRange()]
     * @returns {array}
     */
    toggledCommandsForRange(range = this.range || this.getRange()) {
      return this.validCommands.filter((command) => {
        this.commandToggledForRange(range, command);
      });
    }
    /**
     * selects command element that contains range.
     * Example: if command is 'a' and range is text inside <a/>, returns <a>
     *
     * @param {string} [cssQuery=this.tagsList || '']
     * @param {range} [range=this.range || this.getRange()]
     * @returns {node}
     */
    rangeOrMatchingAncestor(
      cssQuery = this.tagsList || "",
      range = this.range || this.getRange()
    ) {
      let start = this.rangeElementOrParentElement(range);

      return !start || cssQuery == ""
        ? undefined
        : start.matches(cssQuery)
        ? start
        : start.closest(cssQuery);
    }
    /**
     * returns elmement that includes range
     *
     * @param {object} [range=this.range || this.getRange()]
     * @returns {node}
     */
    rangeElementOrParentElement(range = this.range || this.getRange()) {
      return this.rangeIsElement(range)
        ? range.startContainer
        : this.rangeParentElement(range);
    }
    /**
     * returns node that includes range
     *
     * @param {*} [range=this.range || this.getRange()]
     * @returns
     */
    rangeNodeOrParentNode(range = this.range || this.getRange()) {
      return this.rangeIsNode(range)
        ? range.startContainer
        : this.rangeParentNode(range);
    }
    /**
     * returns a an array ancestor nodes of range to use for breadcrumbs
     *
     * @param {range} [range=this.range || this.getRange()]
     * @returns {array}
     */
    rangeBreadcrumbs(range = this.range || this.getRange()) {
      let nodes = [],
        getParentNode = (node) => {
          nodes.push(node);
          if (node.parentNode && node.parentNode !== this.target)
            getParentNode(node.parentNode);
        };
      nodes.push({
        nodeName: false,
      });
      return nodes.reverse();
    }
    /**
     * determines if range is a single node
     *
     * @param {range} [range=this.range || this.getRange()]
     * @returns {boolean}
     */
    rangeIsNode(range = this.range || this.getRange()) {
      let startContainer = !range ? undefined : range.startContainer,
        startOffset = !range ? undefined : range.startOffset,
        endContainer = !range ? undefined : range.endContainer,
        endOffset = !range ? undefined : range.endOffset;
      return (
        !!startContainer &&
        startContainer === endContainer &&
        endOffset - startOffset === 1
      );
    }
    /**
     * determines if range is a single element
     *
     * @param {*} [range=this.range || this.getRange()]
     * @returns {boolean}
     */
    rangeIsElement(range = this.range || this.getRange()) {
      return this.rangeIsNode(range) && range.startContainer.nodeType == 1;
    }
    /**
     * gets parent element of range
     *
     * @param {range} [range=this.range || this.getRange()]
     * @returns {node}
     */
    rangeParentElement(range = this.range || this.getRange()) {
      let common = !range ? undefined : range.commonAncestorContainer;
      return !common
        ? undefined
        : common.nodeType == 1
        ? common
        : common.parentElement;
    }
    /**
     * gets parent node of range
     *
     * @param {range} [range=this.range || this.getRange()]
     * @returns {node}
     */
    rangeParentNode(range = this.range || this.getRange()) {
      let common = !range ? undefined : range.commonAncestorContainer;
      return !common ? undefined : common.parentNode;
    }
    /**
     * returns an array of all node in a range
     *
     * @param {range} [range=this.range || this.getRange()]
     * @returns {array}
     */
    rangeNodes(range = this.range || this.getRange()) {
      let node = this.rangeFirstNode(range),
        nodes = [];
      while (!!node) {
        nodes.push(node);
        node = node.nextSibling;
      }
      return nodes;
    }
    getRangeForCopy(target, range = this.getRange()) {
      let startLocation,
        endLocation,
        getOffsets = (node) => {
          let offsets = [];
          while (
            !!node &&
            (!!node.parentNode || !!node.host) &&
            node !== target
          ) {
            offsets.push([...node.parentNode.childNodes].indexOf(node));
            node = node.parentNode || node.host;
          }
          return offsets;
        };
      if (
        range &&
        (range.commonAncestorContainer === target ||
          target.contains(range.commonAncestorContainer))
      ) {
        startLocation = getOffsets(range.startContainer, range.startOffset);
        endLocation = getOffsets(range.endContainer, range.endOffset);
      }
      return !startLocation || !endLocation
        ? undefined
        : {
            startOffset: range.startOffset,
            startLocation: startLocation,
            endOffset: range.endOffset,
            endLocation: endLocation,
          };
    }

    getRangeFromCopy(target, rangeInfo) {
      if (!rangeInfo || !target) return;
      let range = new Range(),
        getContainer = (offsets) => {
          let node = target;
          offsets.reverse().forEach((i) => {
            let childNodes = !node ? undefined : [...node.childNodes];
            if (childNodes) node = childNodes[i];
          });
          return node;
        },
        startContainer = getContainer(rangeInfo.startLocation),
        endContainer = getContainer(rangeInfo.endLocation);
      range.setStart(startContainer, rangeInfo.startOffset);
      range.setEnd(endContainer, rangeInfo.endOffset);
      return range;
    }

    /**
     * gets first node of range
     *
     * @param {range} [range=this.range || this.getRange()]
     * @returns {node}
     */
    rangeFirstNode(range = this.range || this.getRange()) {
      return !!range &&
        !!range.startContainer &&
        !!range.startContainer.childNodes
        ? range.startContainer.childNodes[range.startOffset - 1]
        : undefined;
    }
    /**
     * gets last node of range
     *
     * @param {range} [range=this.range || this.getRange()]
     * @returns {node}
     */
    rangeLastNode(range = this.range || this.getRange()) {
      return !!range && !!range.endContainer && !!range.endContainer.childNodes
        ? range.endContainer.childNodes[range.endOffset - 1]
        : undefined;
    }

    /* ------ CONTROLS RANGE ------------------------- */

    /**
     * sets selection range to specified node
     * @param {object} node node to select
     * @returns {void}
     */
    selectNode(node, range = this.range) {
      if (!node || !node.parentNode) return;
      if (!range) {
        let sel = this.getSelection();
        range = document.createRange();
        sel.removeAllRanges();
        sel.addRange(range);
      }
      if (range) {
        range.selectNode(node);
        this._rangeChanged(range);
      }
    }
    /**
     * sets selection range to specified node's contents
     * @param {object} node node to select
     * @returns {void}
     */
    selectNodeContents(node, range = this.range) {
      if (node) {
        if (!range) {
          let sel = this.getSelection();
          range = document.createRange();
          sel.removeAllRanges();
          sel.addRange(range);
        }
        if (range) {
          range.selectNodeContents(node);
          this._rangeChanged(range);
        }
      }
    }

    /**
     * selects and highlights a node
     *
     * @param {object} node
     * @param {object} range object
     */
    highlightNode(node, range = this.range) {
      let keepPaused = this.__toolbar.historyPaused;
      this.__toolbar.historyPaused = true;
      let element = node || this.rangeOrMatchingAncestor();
      if (!!element) this.selectNode(node, range);
      this.__toolbar.updateRange();
      this.__highlight.wrap(range);
      this.__toolbar.historyPaused = keepPaused;
    }
    /**
     * selects or deselects(collapses) a range
     *
     * @param {object} range
     * @param {boolean} [select=true] select range?
     * @memberof RichTextEditorSelection
     */
    selectRange(range = this.range, select = true) {
      if (range) {
        if (select) {
          let sel = this.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        } else {
          if (!range.isCollapsed) range.collapse();
        }
        //this._rangeChanged(range);
      }
      return range;
    }

    /**
     * sets range to content within a node
     *
     * @param {object} node
     * @param {range} range
     * @returns
     * @memberof RichTextEditorSelection
     */
    surroundRange(node, range = this.range) {
      if (range) {
        range.surroundContents(node);
        //this._rangeChanged(range);
      }
    }
    _rangeChanged(range) {
      this.dispatchEvent(
        new CustomEvent("rangechange", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {
            element: this,
            range: range,
          },
        })
      );
    }
    /**
     * only initialises view source if needed
     *
     */
    initViewSource() {
      this.__source =
        this.__source || window.RichTextEditorSource.requestAvailability();
    }
    /**
     * handles commands sent from toolbar
     *
     * @param {object} toolbar toolbar element
     * @param {string} command command string
     * @param {string} commandVal string for command
     * @param {object} range
     * @memberof RichTextEditorManager
     */
    _handleCommand(command, commandVal, range = this.getRange()) {
      let toolbar = this.__toolbar,
        target = toolbar.target,
        keepPaused = toolbar && toolbar.historyPaused;

      if (
        !toolbar ||
        !target ||
        target.disabled ||
        !target.getAttribute("contenteditable") |
          (!target.getAttribute("contenteditable") != "true")
      )
        return;

      console.log(command, commandVal, this.debugRange(range));

      //custom cancel source command
      if (command === "cancel") {
        toolbar.revertTarget(target);
        toolbar.close(target);
        //custom close source command
      } else if (command === "close") {
        toolbar.close(target);
        //custom view source command
      } else if (command === "viewSource") {
        this.__source.toggle(toolbar);
        //overrides default undo
      } else if (command == "undo") {
        console.log(target.innerHTML);
        toolbar.undo();
        return;
        //overrides default redo
      } else if (command == "redo") {
        toolbar.redo();
        return;
        //custom command wraps a range in element specified by commandVal
      } else if (command == "wrapRange" && !!commandVal) {
        // wrap or unwrapsa range with a commandVal element
        let toggled = this.commandToggledForRange(
            range,
            "wrapRange",
            commandVal
          ),
          node = this.rangeOrMatchingAncestor(commandVal);
        this.keepPaused = toolbar.historyPaused;
        toolbar.historyPaused = true;

        //if range not wrapped in specified element, nwrap it
        if (!toggled) {
          // if button is not toggled, wrap the range
          this.__highlight.wrap(range);
          let html = this.__highlight.innerHTML;
          this.__highlight.innerHTML = `<${commandVal}>${html.trim()}</${commandVal}>`;
          node = this.__highlight.querySelector(commandVal);
          range.selectNode(node);
          this.__highlight.unwrap(range);
          //if range is already wrapped in specified element, unwrap it
        } else if (toggled) {
          //if button is toggled, unwrap the range
          let nodes = node ? [...node.childNodes].reverse() : [];
          if (range) range.setStartBefore(node);
          nodes.forEach((node) => {
            if (range) range.insertNode(node);
          });
          if (node) node.parentElement.normalize();
          if (node) range.selectNodeContents(node);
          if (node) node.remove();
        }
        toolbar.historyPaused = keepPaused;
        target.normalize();
      } else if (this.validCommands.includes(command)) {
        commandVal =
          toolbar && commandVal ? toolbar.sanitizeHTML(commandVal) : commandVal;
        this.keepPaused = toolbar.historyPaused;
        toolbar.historyPaused = true;
        console.log(
          toolbar.historyPaused,
          toolbar,
          this.__highlight.isActiveForEditor(target),
          range
        );

        if (!this.__highlight.hidden) {
          range = this.__highlight.range || this.getRange();
        }
        this.selectRange(range);

        //override default paste
        if (command == "paste") {
          if (navigator.clipboard) this.pasteFromClipboard();
          //execute other commands as normal until I update deprecated execCommand
        } else {
          document.execCommand(command, false, commandVal);
        }
        this.__highlight.unwrap();
        target.normalize();
        console.log("exec", target.innerHTML);
        toolbar.historyPaused = keepPaused;
        toolbar.range = this.getRange();
      }
    }
  };
};
