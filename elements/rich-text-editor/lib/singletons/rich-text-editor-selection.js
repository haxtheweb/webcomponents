/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextEditorStyles } from "@lrnwebcomponents/rich-text-editor/lib/rich-text-editor-styles.js";
/**
 * `rich-text-editor-selection`
 * `a button for rich text editor (custom buttons can extend this)`
 *
 * @element rich-text-editor-selection
 * @demo ./demo/selection.html
 */
class RichTextEditorSelection extends RichTextEditorStyles(LitElement) {
  /**
   * Store tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "rich-text-editor-selection";
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          background-color: var(--rich-text-editor-selection-bg);
          margin: 0;
          padding: 0;
          display: inline;
        }
        :host([hidden]) {
          display: none;
        }
        :host([collapsed]):after {
          content: '|';
          color: var(--rich-text-editor-selection-bg);
          background-color: transparent;
        }
      `,
    ];
  }
  render() {
    return html` <slot></slot> `;
  }

  static get properties() {
    return {
      editor: {
        type: Object,
      },
      collapsed: {
        type: Boolean,
        reflect: true,
        attribute: "collapsed",
      },
      hidden: {
        type: Boolean,
        reflect: true,
        attribute: "hidden",
      },
      id: {
        type: String,
        reflect: true,
        attribute: "id",
      },
      observer: {
        type: Object,
      },
      range: {
        type: Object,
      },
      toolbar: {
        type: Object,
      },
      __toolbars: {
        type: Array,
      },
    };
  }
  constructor() {
    super();
    let sel = this;
    this.hidden = true;
    this.__toolbars = [];
    this.__clipboard = document.createElement("textarea");
    this.__clipboard.setAttribute("aria-hidden", true);
    this.__clipboard.style.position = "absolute";
    this.__clipboard.style.left = "-9999px";
    this.__clipboard.style.top = "0px";
    this.__clipboard.style.width = "0px";
    this.__clipboard.style.height = "0px";
    this.id = this._generateUUID();
    document.body.appendChild(this.__clipboard);
    window.addEventListener("paste", (e) => console.log("paste", e));
    window.addEventListener("register", this._handleRegistration.bind(sel));
  }
  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {});
  }

  /**
   * life cycle, element is disconnected
   */
  disconnectedCallback() {
    super.disconnectedCallback();
  }

  get selectedNode() {
    return this.getRangeNode(this.range);
  }

  get selectedNodeAncestors() {
    return this.getAncestors(this.range).map((breadcrumb) => breadcrumb.target);
  }

  cancelEdits(editor) {
    editor.revert();
    this.edit(editor, false);
  }
  /**
   * executes button command on current range
   *
   */
  execCommand(command, val, editor) {
    let range = this.hidden ? this.getRange(editor) : this.range;
    if (range) {
      if (command === "replaceHTML") {
        let node = this.getRangeNode();
        node.innerHTML = val;
      } else if (command !== "paste") {
        this.selectRange(range);
        document.execCommand(command, false, val);
      } else if (navigator.clipboard) {
        this.pasteFromClipboard(editor);
      }
    }
  }

  /**
   * searches for a closest ancestor by tagname,
   * expands selection to matching ancestor,
   * and returns ancestor, or returns null if not found
   * @param {string} tag tag to expand selection to
   * @returns {object} selected node
   */
  getAncestor(selector, range = this.getRange()) {
    let wrapper,
      tags = selector.toLowerCase().split(","),
      getMatchingTag = (ancestor) => {
        if (
          !!ancestor &&
          !!ancestor.tagName &&
          (!selector || tags.includes(ancestor.tagName.toLowerCase()))
        ) {
          return ancestor;
        } else if (
          !!ancestor &&
          !!ancestor.parentNode &&
          ancestor.parentNode.childNodes.length === 1
        ) {
          return getMatchingTag(ancestor.parentNode);
        } else {
          return undefined;
        }
      };
    //try to find an ancestor that matches tag
    if (range) {
      let ancestor = range.commonAncestorContainer;
      wrapper = getMatchingTag(ancestor);
    }
    return wrapper;
  }

  /**
   * updates the breadcrumbs
   * @param {object} the selected range
   * @param {string} controls id of what the breadcrumbs control
   * @returns {void}
   */
  getAncestors(range = this.getRange) {
    let nodes = [];
    let ancestor = false,
      parent = false,
      common = !range ? undefined : range.commonAncestorContainer,
      rangeNode = this.getRangeNode(range),
      rangeTag = !rangeNode ? undefined : rangeNode.tagName;
    if (!!this.range) ancestor = rangeTag ? rangeNode : common;
    if (!!ancestor) parent = ancestor;
    this.hidden = !ancestor;
    while (!!parent && !parent.contenteditable) {
      nodes.unshift(parent);
      parent = parent.parentNode;
    }
    return nodes;
  }

  /**
   * Normalizes selected range data.
   *
   * @returns {object} selected range
   */
  getRange(root = document) {
    let sel = this.getSelection(this.getRoot(root)),
      range;
    if (sel.getRangeAt && sel.rangeCount) {
      range = sel.getRangeAt(0);
    } else if (sel) {
      range = sel;
    } else {
      range = undefined;
    }
    return range && root.contains(this.getRangeNode(range)) ? range : undefined;
  }

  /**
  * gets contents of selected range
  * @returns {object} range contents
  * /
  getRangeContents(range=this.getRange) {
    return range ? range.cloneContents() : null;
  }

  /**
  * node selected or its parent node
  *
  * @param {object} [range=this.range]
  * @returns object
  * @memberof RichTextEditorSelection
  */
  getRangeNode(range = this.range) {
    let common = !range ? undefined : range.commonAncestorContainer,
      startContainer = !range ? undefined : range.startContainer,
      startOffset = !range ? undefined : range.startOffset,
      endContainer = !range ? undefined : range.endContainer,
      endOffset = !range ? undefined : range.endOffset,
      startNode =
        !startContainer || !startContainer.children
          ? undefined
          : startContainer.children[startOffset - 1],
      rootNode =
        startContainer === endContainer && endOffset - startOffset === 1
          ? startNode
          : common;
    return rootNode;
  }

  /**
   * expands selection to a specific ancestor
   * @param {string} selectors comma-separated list of selectors
   * @param {object} range
   * @returns {object} updated range
   */
  expandRangeTo(selectors = "", range = this.range) {
    let node = this.getRangeNode(range),
      tagName = node && node.tagName ? node.tagName.toLowerCase() : undefined,
      selectorsList = selectors.toLowerCase().replace(/\s*/g, "").split(",");
    if (selectorsList.includes(tagName)) {
      return node;
    } else if (node.closest(selectors)) {
      range.selectNode(node.closest(selectors));
      return range;
    }
  }

  /**
   * expands selection to a specific ancestor or wraps selection in a default tag
   * @param {string} selector ancestor selector to find
   * @param {string} wrapTag tagName to use if ancestor cannot be found
   * @returns {object} selected node
   * /
  expandSelection(selector, range = this.getRange(), wrapTag) {
    return (
      this.selectAncestor(selector, range) ||
      this.wrap(!!wrapTag ? document.createElement(wrapTag) : undefined)
    );
  }
  /**
   * gets closest shadowRoot or document from node
   *
   * @param {object} node
   * @returns object
   * @memberof RichTextEditorSelection
   */
  getRoot(node) {
    return !node
      ? document
      : node.parentNode
      ? this.getRoot(node.parentNode)
      : node;
  }

  /**
   * paste content into a range;
   * override this function to make your own filters
   *
   * @param {string} pasteContent html to be pasted
   * @returns {string} filtered html as string
   */
  getSanitizeClipboard(pasteContent) {
    let regex = "<body(.*\n)*>(.*\n)*</body>";
    if (pasteContent.match(regex) && pasteContent.match(regex).length > 0)
      pasteContent = pasteContent.match(regex)[0].replace(/<\?body(.*\n)*\>/i);
    return pasteContent;
  }

  /**
   * Normalizes selected range data.
   *
   * @returns {object} selected range
   */
  getSelection(root = document) {
    root = this.getRoot(root) || document;
    return !root || !root.getSelection ? undefined : root.getSelection();
  }

  getConnectedToolbar(editor) {
    if (!editor.id) editor.id = this._generateUUID();
    if (!editor.__connectedToolbar) {
      //get toolbar by id
      let toolbar,
        filter = !editor.toolbar
          ? []
          : (this.__toolbars || []).filter(
              (toolbar) => toolbar.id === editor.toolbar
            );
      //get toolbar by type
      if (filter.length === 0) {
        filter = !editor.type
          ? []
          : (this.__toolbars || []).filter(
              (toolbar) => toolbar.type === editor.type
            );
      }
      if (filter[0]) {
        toolbar = filter[0];
      } else if (filter.length === 0) {
        //make toolbar
        toolbar = document.createElement(
          editor.type || "rich-text-editor-toolbar"
        );
        editor.parentNode.insertBefore(toolbar, editor);
      }
      toolbar.id = editor.toolbar || this._generateUUID();
      editor.toolbar = toolbar.id;
      editor.__connectedToolbar = toolbar;
    }
    return editor.__connectedToolbar;
  }
  /**
   * selects and highlights a node
   *
   * @param {object} node
   * @param {object} [range=this.getRange()]
   * @returns {void}
   * @memberof RichTextEditorSelection
   */
  highlightNode(node, editor) {
    this.selectNode(node, editor.range);
    this.highlight(editor, false);
    this.selectNode(node, editor.range);
    this.highlight(editor);
  }

  /**
   * adds or removes hightlight
   * @param {object} contents contents to be highlighted
   * @param {boolean} [add=true] add highlight?
   * @returns {void}
   */
  highlight(editor, add = true) {
    let toolbar = this.getConnectedToolbar(editor),
      range = this.getRange(editor);
    if (add !== false) {
      if (!this.hidden) return;
      this.updateHighlight(range);
      this.hidden = !range || range.collapsed;
      this.range = range;
      this.updateRange(editor, range);
    } else {
      if (this.hidden || !range) return;
      this.normalize();
      let children = this.childNodes;
      if (children.length > 0) {
        children.forEach((child, i) => {
          this.parentNode.insertBefore(child, this);
          if (i === 0) range.setStart(child, 0);
          range.setEnd(child, 0);
        });
      } else if (this.previousSibling) {
        this.selectNode(this.previousSibling, range);
        range.collapse();
      } else if (this.nextSibling) {
        this.selectNode(this.nextSibling, range);
        range.collapse(true);
      } else if (this.parentNode) {
        this.selectNode(this.parentNode, range);
        range.collapse(true);
      }
      this.hidden = true;
      document.body.appendChild(this);
      this.range = undefined;
    }
    return range;
  }
  /**
   * gets clipboard data and pastes into an editor's range
   *
   * @param {obj} editor
   * @memberof RichTextEditorSelection
   */
  pasteFromClipboard(editor) {
    setTimeout(async () => {
      let sel = this.getSelection(editor),
        range = this.getRange(editor),
        text = await navigator.clipboard.readText();
      this.__clipboard.value = text;
      this.__clipboard.focus();
      this.__clipboard.select();
      document.execCommand("paste");
      sel.removeAllRanges();
      sel.addRange(range);
      this.pasteIntoEditor(editor, this.__clipboard.value);
    }, 2000);
  }
  /**
   * pastes content into editor's selected range
   *
   * @param {obj} editor editor
   * @param {obj} pasteContent content to paste
   * @param {boolean} [sanitize=true]
   * @memberof RichTextEditorSelection
   */
  pasteIntoEditor(editor, pasteContent, sanitize = true) {
    if (editor)
      this.pasteIntoRange(
        editor,
        this.getRange(editor),
        sanitize ? this.getSanitizeClipboard(pasteContent) : pasteContent
      );
  }

  /**
   * paste content into a range
   *
   * @param {object} range where content will be pasted
   * @param {string} pasteContent html to be pasted
   * @returns {void}
   */
  pasteIntoRange(editor, range, pasteContent) {
    let div = document.createElement("div"),
      parent = range.commonAncestorContainer.parentNode,
      closest = parent.closest(
        "[contenteditable=true]:not([disabled]),input:not([disabled]),textarea:not([disabled])"
      );
    if ((editor = closest)) {
      div.innerHTML = pasteContent;
      if (range && range.extractContents) {
        range.extractContents();
      }
      range.insertNode(div);
      while (div.firstChild) {
        div.parentNode.insertBefore(div.firstChild, div);
      }
      div.parentNode.removeChild(div);
    }
  }
  /**
   * sets up editor's event listeners
   *
   * @param {object} editor
   * @param {boolean} [add=true]
   * @returns {object} toolbar
   * @memberof RichTextEditorSelection
   */
  registerEditor(editor, remove = false) {
    let toolbar = !editor ? undefined : this.getConnectedToolbar(editor),
      handlers = {
        focus: (e) => this.edit(editor),
        blur: (e) => this._handleBlur(editor, e),
        keydown: (e) => this._handleShortcutKeys(editor, e),
        click: (e) => this._handleEditorClick(editor, e),
        getrange: (e) => this.updateRange(editor, this.getRange(editor)),
        pastefromclipboard: (e) => this.pasteFromClipboard(e.detail),
        pastecontent: (e) => this._handlePaste(e),
      };
    if (!remove) {
      //add event listeners
      editor.addEventListener("mousedown", handlers.focus);
      editor.addEventListener("focus", handlers.focus);
      editor.addEventListener("keydown", handlers.keydown);
      editor.addEventListener("blur", handlers.blur);
      editor.addEventListener("getrange", handlers.getrange);
      editor.addEventListener(
        "pastefromclipboard",
        handlers.pastefromclipboard
      );
      editor.addEventListener("pastecontent", handlers.pastecontent);
      //editor.addEventListener("click", handlers.click);
    } else {
      editor.removeEventListener("mousedown", handlers.focus);
      editor.removeEventListener("focus", handlers.focus);
      editor.removeEventListener("keydown", handlers.keydown);
      editor.removeEventListener("blur", handlers.blur);
      editor.removeEventListener("getrange", handlers.getrange);
      editor.removeEventListener(
        "pastefromclipboard",
        handlers.pastefromclipboard
      );
      editor.removeEventListener("pastecontent", handlers.pastecontent);
    }
    return editor.__connectedToolbar;
  }
  /**
   * updates toolbar list
   *
   * @param {*} toolbar
   * @param {boolean} [remove=false]
   * @memberof RichTextEditorSelection
   */
  registerToolbar(toolbar, remove = false) {
    let handlers = {
      exec: (e) =>
        this.execCommand(e.detail.command, e.detail.commandVal, toolbar.editor),
      highlight: (e) => this.highlight(toolbar.editor, e.detail),
      highlightnode: (e) => this.highlightNode(e.detail, toolbar.editor),
      selectnode: (e) => this.selectNode(e.detail, toolbar.range),
      selectnodecontents: (e) => this.selectNode(e.detail, toolbar.range),
      selectrange: (e) => this.selectRange(e.detail),
      pastefromclipboard: (e) => this.pasteFromClipboard(e.detail),
    };
    if (!remove) {
      this.__toolbars.push(toolbar);
      toolbar.addEventListener("command", handlers.exec);
      toolbar.addEventListener("highlight", handlers.highlight);
      toolbar.addEventListener("highlightnode", handlers.highlightnode);
      toolbar.addEventListener("selectnode", handlers.selectnode);
      toolbar.addEventListener(
        "selectnodecontents",
        handlers.selectnodecontents
      );
      toolbar.addEventListener("selectrange", handlers.selectrange);
      toolbar.addEventListener(
        "pastefromclipboard ",
        handlers.pastefromclipboard
      );
    } else {
      toolbar.removeEventListener("command", handlers.exec);
      toolbar.removeEventListener("highlight", handlers.highlight);
      toolbar.removeEventListener("highlightnode", handlers.highlightnode);
      toolbar.removeEventListener("selectnode", handlers.selectnode);
      toolbar.removeEventListener(
        "selectnodecontents",
        handlers.selectnodecontents
      );
      toolbar.removeEventListener("selectrange", handlers.selectrange);
      toolbar.removeEventListener(
        "pastefromclipboard ",
        handlers.pastefromclipboard
      );
      this.__toolbars = this.__toolbars.filter((bar) => bar !== toolbar);
    }
  }

  /**
   * searches for a closest ancestor by tagname,
   * expands selection to matching ancestor,
   * and returns ancestor, or returns null if not found
   * @param {string} tag tag to expand selection to
   * @returns {object} selected node
   */
  selectAncestor(selector, range = this.getRange()) {
    let wrapper = this.getAncestor(selector, range);
    if (wrapper) this.selectNode(wrapper, range);
    return wrapper;
  }

  /**
   * sets selection range to specified node
   * @param {object} node node to select
   * @returns {void}
   */
  selectNode(node, range = this.getRange()) {
    if (range) range.selectNode(node);
    return range;
  }
  /**
   * sets selection range to specified node's contents
   * @param {object} node node to select
   * @returns {void}
   */
  selectNodeContents(node = null, range = this.getRange()) {
    if (node) {
      if (!range) {
        let sel = this.getSelection();
        range = document.createRange();
        sel.removeAllRanges();
        sel.addRange(range);
      }
      range.selectNodeContents(node);
    }
  }
  /**
   * selects or deselects(collapses) a range
   *
   * @param {object} range
   * @param {boolean} [select=true] select range?
   * @memberof RichTextEditorSelection
   */
  selectRange(range = this.getRange(), select = true) {
    if (range) {
      if (select) {
        let sel = this.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      } else {
        if (!range.isCollapsed) range.collapse();
      }
    }
    return range;
  }

  updateHighlight(range = this.getRange()) {
    if (range) {
      range.surroundContents(this);
      this.normalize();
      this.innerHTML = this.innerHTML.trim();
    }
  }

  updateRange(editor, range = !editor ? undefined : this.getRange(editor)) {
    let toolbar = this.getConnectedToolbar(editor);
    editor.range = range;
    if (toolbar) {
      toolbar.selectedNode = editor.selectedNode;
      toolbar.selectionAncestors = editor.selectionAncestors;
      toolbar.range = editor.range;
    }
  }
  /**
   * gets range contents in specified wrapper
   * @param {object} wrapper a node to wrap range contents in
   * @returns {object} range which oncludes wrapper and wrapped contents
   */
  wrap(wrapper, range = this.getRange()) {
    wrapper = wrapper || document.createElement("span");
    range.surroundContents(wrapper);
    return wrapper;
  }

  /**
   * Generate a UUID
   * @returns {string} unique id
   */
  _generateUUID() {
    let hex = Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    return "rte-" + "ss-s-s-s-sss".replace(/s/g, hex);
  }

  _handleBlur(editor, e) {
    if (
      e.relatedTarget === null ||
      !e.relatedTarget.startsWith === "rich-text-editor"
    ) {
      this.edit(editor, true);
    } else if (editor) {
      this.highlight(editor);
    }
  }

  /**
   * Updates selected range based on toolbar and editor
   * @param {event} e editor change event
   * @param {deselect} if editor is being deselected
   * @returns {void}
   */
  edit(editor, editable = true) {
    let toolbar = !editor ? undefined : this.getConnectedToolbar(editor),
      oldEditor = editable ? toolbar.editor : undefined;
    this.highlight(editor, false);
    if (toolbar && oldEditor !== editor) {
      this.disableEditing(oldEditor);
      toolbar.editor = editor;
      this.enableEditing(editor, toolbar);
    }
  }
  disableEditing(editor) {
    if (!!editor) {
      this.getRoot(editor).onselectionchange = undefined;
      editor.observeChanges(false);
      editor.contenteditable = false;
      editor.makeSticky(false);
    }
  }
  enableEditing(editor, toolbar = this.getConnectedToolbar(editor)) {
    if (!!editor) {
      editor.makeSticky(toolbar.sticky);
      editor.parentNode.insertBefore(toolbar, editor);
      editor.contenteditable = true;
      this.updateRange(editor);
      editor.observeChanges(this.getRoot(editor));
      this.getRoot(editor).onselectionchange = (e) => this.updateRange(editor);
    }
  }

  _handleEditorClick(editor, e) {
    let toolbar = !editor ? undefined : this.getConnectedToolbar(editor),
      target = e.path[0];
    /*if (editor.contenteditable && e.path[0] !== editor) {
      editor.range = editor.getRange();
      let button = toolbar.buttons.filter(
          button => button.tag === e.path[0].tagName.toLowerCase()
        ),
        range =
          editor.range
            ? editor.range
            : false,
        start =
          range && range.startContainer
            ? range.startContainer.childNodes[range.startOffset]
            : false,
        end =
          range && range.endContainer
            ? range.endContainer.childNodes[range.endOffset - 1]
            : false;
      if (button && button[0] && start === end && start === e.path[0]) {
        button[0]._buttonTap(e);
      } else if (button && button[0]) {
        this.selectNode(e.path[0],range);
      }
    } else if (editor.contenteditable){
      //this.selectNodeContents(editor);
    }*/
  }
  /**
   * registers parts of the editor so that selection can manage them
   *
   * @param {event} e
   * @memberof RichTextEditorSelection
   */
  _handleRegistration(e) {
    if (e.detail) {
      if (e.detail.toolbar)
        this.registerToolbar(e.detail.toolbar, e.detail.remove);
      if (e.detail.editor)
        this.registerEditor(e.detail.editor, e.detail.remove);
    }
  }

  /**
   * when a shortcut key is pressed, fire keypressed event on button associated with it
   * @param {object} editor editor that detects a shortcut key
   * @param {event} e key event
   */

  _handleShortcutKeys(editor, e) {
    let toolbar = !editor ? undefined : this.getConnectedToolbar(editor);
    if (editor.contenteditable) {
      let key = e.key;
      if (e.shiftKey) key = "shift+" + key;
      if (e.altKey) key = "alt+" + key;
      if (
        (window.navigator.platform === "MacIntel" && e.metaKey) ||
        e.ctrlKey
      ) {
        key = "ctrl+" + key;
      }
      if (toolbar.shortcutKeys[key]) toolbar.shortcutKeys[key]._keysPressed(e);
    }
  }
}
window.customElements.define(
  RichTextEditorSelection.tag,
  RichTextEditorSelection
);
export { RichTextEditorSelection };

window.RichTextEditorSelection = {};
window.RichTextEditorSelection.instance = null;
/**
 * Checks to see if there is an instance available, and if not appends one
 */
window.RichTextEditorSelection.requestAvailability = function () {
  if (window.RichTextEditorSelection.instance == null) {
    window.RichTextEditorSelection.instance = new RichTextEditorSelection();
    document.body.appendChild(window.RichTextEditorSelection.instance);
  }
  return window.RichTextEditorSelection.instance;
};
