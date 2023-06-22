void !function () {
  typeof self == 'undefined'
    && typeof global == 'object'
    && (global.self = global);
}();
window = global.self;
require('html-element/global-shim');
/* eslint no-param-reassign: 0 */
(function() {
  // Polyfills
  
  global.document = {
    querySelector: () => { return null},
    querySelectorAll: () => { return []},
    addEventListener: () => {},
    createTextNode: () => {},
    createElement: () => ({
        addEventListener: () => {},
        style: {},
        classList: { add: () => {}, remove: () => {} },
        setAttribute: () => {},
        remove: () => {},
        attachShadow: () => ({
          getSelection: () => {},
        }),
        getSelection: () => {},
      }),
    body: {
        appendChild: () => {},
    },
  };
  
  global.localStorage = {
    store: {},
    getItem: (key = '') => localStorage.store[key],
    setItem: (key = '', value = '') => {
        localStorage.store[key] = value;
    },
    removeItem: (key = '') => {
        delete localStorage.store[key];
    }
  };
  
  global.sessionStorage = {
    store: {},
    getItem: (key = '') => sessionStorage.store[key],
    setItem: (key = '', value = '') => {
        sessionStorage.store[key] = value;
    },
    removeItem: (key = '') => {
        delete sessionStorage.store[key];
    }
  };
  
  global.navigator = {
    language: 'en',
  };
  
  global.document = {
    querySelector: () => { return null},
    querySelectorAll: () => { return []},
    addEventListener: () => {},
    createTextNode: () => {},
    createElement: () => ({
        addEventListener: () => {},
        style: {},
        classList: { add: () => {}, remove: () => {} },
        setAttribute: () => {},
        remove: () => {},
        attachShadow: () => ({
          getSelection: () => {},
        }),
        getSelection: () => {},
    }),
    body: {
        appendChild: () => {},
    },
  };
  
  global.location = {
    ancestorOrigins: {},
    assign: () => {},
    reload: () => {},
    replace: () => {},
    toString: () => {},
    hash: '',
    host: '',
    hostname: '',
    href: '',
    origin: '',
    pathname: '',
    port: '',
    protocol: '',
    search: '',
  };
  global.getSelection = () => {};
  
  global.top = {
    location,
  };
  
  global.parent = {
    location,
  }
  
  global.window = {
    localStorage,
    sessionStorage,
    navigator,
    document,
    location,
    getSelection
  };
  })();
/**
 * JavaScript implementation of W3 DOM4 TreeWalker interface.
 *
 * See also:
 * - https://dom.spec.whatwg.org/#interface-treewalker
 *
 * Attributes like "read-only" and "private" are ignored in this implementation
 * due to ECMAScript 3 (as opposed to ES5) not supporting creation of such properties.
 * There are workarounds, but under "keep it simple" and "don't do stupid things" they
 * are ignored in this implementation.
 */
(function(window, factory) {
  var lazySizes = factory(window, window.document);
  window.lazySizes = lazySizes;
  if(typeof module == 'object' && module.exports){
      module.exports = lazySizes;
  } else if (typeof define == 'function' && define.amd) {
      define(lazySizes);
  }
}(window, function l(win, doc) {
 var TreeWalker, NodeFilter, create, toString, is, mapChild, mapSibling,
     nodeFilter, traverseChildren, traverseSiblings, nextSkippingChildren;

 // Cross-browser polyfill for these constants
 NodeFilter = {
     // Constants for acceptNode()
     FILTER_ACCEPT: 1,
     FILTER_REJECT: 2,
     FILTER_SKIP: 3,

     // Constants for whatToShow
     SHOW_ALL: 0xFFFFFFFF,
     SHOW_ELEMENT: 0x1,
     SHOW_ATTRIBUTE: 0x2, // historical
     SHOW_TEXT: 0x4,
     SHOW_CDATA_SECTION: 0x8, // historical
     SHOW_ENTITY_REFERENCE: 0x10, // historical
     SHOW_ENTITY: 0x20, // historical
     SHOW_PROCESSING_INSTRUCTION: 0x40,
     SHOW_COMMENT: 0x80,
     SHOW_DOCUMENT: 0x100,
     SHOW_DOCUMENT_TYPE: 0x200,
     SHOW_DOCUMENT_FRAGMENT: 0x400,
     SHOW_NOTATION: 0x800 // historical
 };

 /* Local utilities */

 create = Object.create || function (proto) {
     function Empty() {}
     Empty.prototype = proto;
     return new Empty();
 };

 mapChild = {
     first: 'firstChild',
     last: 'lastChild',
     next: 'firstChild',
     previous: 'lastChild'
 };

 mapSibling = {
     next: 'nextSibling',
     previous: 'previousSibling'
 };

 toString = mapChild.toString;

 is = function (x, type) {
     return toString.call(x).toLowerCase() === '[object ' + type.toLowerCase() + ']';
 };

 /* Private methods and helpers */

 /**
  * See https://dom.spec.whatwg.org/#concept-node-filter
  *
  * @private
  * @method
  * @param {TreeWalker} tw
  * @param {Node} node
  */
 nodeFilter = function (tw, node) {
     // Maps nodeType to whatToShow
     if (!(((1 << (node.nodeType - 1)) & tw.whatToShow))) {
         return NodeFilter.FILTER_SKIP;
     }

     if (tw.filter === null) {
         return NodeFilter.FILTER_ACCEPT;
     }

     return tw.filter.acceptNode(node);
 };

 /**
  * See https://dom.spec.whatwg.org/#concept-traverse-children
  *
  * @private
  * @method
  * @param {TreeWalker} tw
  * @param {string} type One of 'first' or 'last'.
  * @return {Node|null}
  */
 traverseChildren = function (tw, type) {
     var child, node, parent, result, sibling;
     node = tw.currentNode[ mapChild[ type ] ];
     while (node !== null) {
         result = nodeFilter(tw, node);
         if (result === NodeFilter.FILTER_ACCEPT) {
             tw.currentNode = node;
             return node;
         }
         if (result === NodeFilter.FILTER_SKIP) {
             child = node[ mapChild[ type ] ];
             if (child !== null) {
                 node = child;
                 continue;
             }
         }
         while (node !== null) {
             sibling = node[ mapChild[ type ] ];
             if (sibling !== null) {
                 node = sibling;
                 break;
             }
             parent = node.parentNode;
             if (parent === null || parent === tw.root || parent === tw.currentNode) {
                 return null;
             } else {
                 node = parent;
             }
         }
     }
     return null;
 };

 /**
  * See https://dom.spec.whatwg.org/#concept-traverse-siblings
  *
  * @private
  * @method
  * @param {TreeWalker} tw
  * @param {TreeWalker} type One of 'next' or 'previous'.
  * @return {Node|null}
  */
 traverseSiblings = function (tw, type) {
     var node, result, sibling;
     node = tw.currentNode;
     if (node === tw.root) {
         return null;
     }
     while (true) {
         sibling = node[ mapSibling[ type ] ];
         while (sibling !== null) {
             node = sibling;
             result = nodeFilter(tw, node);
             if (result === NodeFilter.FILTER_ACCEPT) {
                 tw.currentNode = node;
                 return node;
             }
             sibling = node[ mapChild[ type ] ];
             if (result === NodeFilter.FILTER_REJECT) {
                 sibling = node[ mapSibling[ type ] ];
             }
         }
         node = node.parentNode;
         if (node === null || node === tw.root) {
             return null;
         }
         if (nodeFilter(tw, node) === NodeFilter.FILTER_ACCEPT) {
             return null;
         }
     }
 };

 /**
  * Based on WebKit's NodeTraversal::nextSkippingChildren
  * https://trac.webkit.org/browser/trunk/Source/WebCore/dom/NodeTraversal.h?rev=137221#L103
  */
 nextSkippingChildren = function (node, stayWithin) {
     if (node === stayWithin) {
         return null;
     }
     if (node.nextSibling !== null) {
         return node.nextSibling;
     }

     /**
      * Based on WebKit's NodeTraversal::nextAncestorSibling
      * https://trac.webkit.org/browser/trunk/Source/WebCore/dom/NodeTraversal.cpp?rev=137221#L43
      */
     while (node.parentNode !== null) {
         node = node.parentNode;
         if (node === stayWithin) {
             return null;
         }
         if (node.nextSibling !== null) {
             return node.nextSibling;
         }
     }
     return null;
 };

 /**
  * See https://dom.spec.whatwg.org/#interface-treewalker
  *
  * @constructor
  * @param {Node} root
  * @param {number} [whatToShow]
  * @param {Function} [filter]
  * @throws Error
  */
 TreeWalker = function (root, whatToShow, filter) {
     var tw = this, active = false;

     if (!root || !root.nodeType) {
      return root;
         //throw new Error('DOMException: NOT_SUPPORTED_ERR');
     }

     tw.root = root;
     tw.whatToShow = Number(whatToShow) || 0;

     tw.currentNode = root;

     if (!is(filter, 'function')) {
         tw.filter = null;
     } else {
         tw.filter = create(win.NodeFilter.prototype);

         /**
          * See https://dom.spec.whatwg.org/#dom-nodefilter-acceptnode
          *
          * @method
          * @member NodeFilter
          * @param {Node} node
          * @return {number} Constant NodeFilter.FILTER_ACCEPT,
          *  NodeFilter.FILTER_REJECT or NodeFilter.FILTER_SKIP.
          */
         tw.filter.acceptNode = function (node) {
             var result;
             if (active) {
                 throw new Error('DOMException: INVALID_STATE_ERR');
             }

             active = true;
             result = filter(node);
             active = false;

             return result;
         };
     }
 };

 TreeWalker.prototype = {

     constructor: TreeWalker,

     /**
      * See https://dom.spec.whatwg.org/#ddom-treewalker-parentnode
      *
      * @method
      * @return {Node|null}
      */
     parentNode: function () {
         var node = this.currentNode;
         while (node !== null && node !== this.root) {
             node = node.parentNode;
             if (node !== null && nodeFilter(this, node) === NodeFilter.FILTER_ACCEPT) {
                 this.currentNode = node;
                 return node;
             }
         }
         return null;
     },

     /**
      * See https://dom.spec.whatwg.org/#dom-treewalker-firstchild
      *
      * @method
      * @return {Node|null}
      */
     firstChild: function () {
         return traverseChildren(this, 'first');
     },

     /**
      * See https://dom.spec.whatwg.org/#dom-treewalker-lastchild
      *
      * @method
      * @return {Node|null}
      */
     lastChild: function () {
         return traverseChildren(this, 'last');
     },

     /**
      * See https://dom.spec.whatwg.org/#dom-treewalker-previoussibling
      *
      * @method
      * @return {Node|null}
      */
     previousSibling: function () {
         return traverseSiblings(this, 'previous');
     },

     /**
      * See https://dom.spec.whatwg.org/#dom-treewalker-nextsibling
      *
      * @method
      * @return {Node|null}
      */
     nextSibling: function () {
         return traverseSiblings(this, 'next');
     },

     /**
      * See https://dom.spec.whatwg.org/#dom-treewalker-previousnode
      *
      * @method
      * @return {Node|null}
      */
     previousNode: function () {
         var node, result, sibling;
         node = this.currentNode;
         while (node !== this.root) {
             sibling = node.previousSibling;
             while (sibling !== null) {
                 node = sibling;
                 result = nodeFilter(this, node);
                 while (result !== NodeFilter.FILTER_REJECT && node.lastChild !== null) {
                     node = node.lastChild;
                     result = nodeFilter(this, node);
                 }
                 if (result === NodeFilter.FILTER_ACCEPT) {
                     this.currentNode = node;
                     return node;
                 }
             }
             if (node === this.root || node.parentNode === null) {
                 return null;
             }
             node = node.parentNode;
             if (nodeFilter(this, node) === NodeFilter.FILTER_ACCEPT) {
                 this.currentNode = node;
                 return node;
             }
         }
         return null;
     },

     /**
      * See https://dom.spec.whatwg.org/#dom-treewalker-nextnode
      *
      * @method
      * @return {Node|null}
      */
     nextNode: function () {
         var node, result, following;
         node = this.currentNode;
         result = NodeFilter.FILTER_ACCEPT;

         while (true) {
             while (result !== NodeFilter.FILTER_REJECT && node.firstChild !== null) {
                 node = node.firstChild;
                 result = nodeFilter(this, node);
                 if (result === NodeFilter.FILTER_ACCEPT) {
                     this.currentNode = node;
                     return node;
                 }
             }
             following = nextSkippingChildren(node, this.root);
             if (following !== null) {
                 node = following;
             } else {
                 return null;
             }
             result = nodeFilter(this, node);
             if (result === NodeFilter.FILTER_ACCEPT) {
                 this.currentNode = node;
                 return node;
             }
         }
     }
 };

 /**
  * See http://www.w3.org/TR/dom/#dom-document-createtreewalker
  *
  * @param {Node} root
  * @param {number} [whatToShow=NodeFilter.SHOW_ALL]
  * @param {Function|Object} [filter=null]
  * @return {TreeWalker}
  */
 doc.createTreeWalker = function (root, whatToShow, filter) {
     whatToShow = whatToShow === undefined ? NodeFilter.SHOW_ALL : whatToShow;

     if (filter && is(filter.acceptNode, 'function')) {
         filter = filter.acceptNode;
     // Support Gecko-ism of filter being a function.
     // https://developer.mozilla.org/en-US/docs/DOM/document.createTreeWalker
     } else if (!is(filter, 'function')) {
         filter = null;
     }

     return new TreeWalker(root, whatToShow, filter);
 };

 if (!win.NodeFilter) {
     win.NodeFilter = NodeFilter.constructor = NodeFilter.prototype = NodeFilter;
 }

 if (!win.TreeWalker) {
     win.TreeWalker = TreeWalker;
 }
}));
/*! (c) Andrea Giammarchi @webreflection ISC */
(function () {
  'use strict';

  var attributesObserver = (function (whenDefined) {
    var attributeChanged = function attributeChanged(records) {
      for (var i = 0, length = records.length; i < length; i++) dispatch(records[i]);
    };
    var dispatch = function dispatch(_ref) {
      var target = _ref.target,
        attributeName = _ref.attributeName,
        oldValue = _ref.oldValue;
      target.attributeChangedCallback(attributeName, oldValue, target.getAttribute(attributeName));
    };
    return function (target, is) {
      var attributeFilter = target.constructor.observedAttributes;
      if (attributeFilter) {
        whenDefined(is).then(function () {
          for (var i = 0, length = attributeFilter.length; i < length; i++) {

          }
        });
      }
      return target;
    };
  });

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;
        var F = function () {};
        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true,
      didErr = false,
      err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  var QSA = 'querySelectorAll';
  var _self$1 = self,
    document$2 = _self$1.document,
    Element$1 = _self$1.Element,
    Set$2 = _self$1.Set,
    WeakMap$1 = _self$1.WeakMap;
  var elements = function elements(element) {
    return QSA in element;
  };
  var filter = [].filter;
  var qsaObserver = (function (options) {
    var live = new WeakMap$1();
    var drop = function drop(elements) {
      for (var i = 0, length = elements.length; i < length; i++) live["delete"](elements[i]);
    };
    var flush = function flush() {
      var records = observer.takeRecords();
      for (var i = 0, length = records.length; i < length; i++) {
        parse(filter.call(records[i].removedNodes, elements), false);
        parse(filter.call(records[i].addedNodes, elements), true);
      }
    };
    var matches = function matches(element) {
      return element.matches || element.webkitMatchesSelector || element.msMatchesSelector;
    };
    var notifier = function notifier(element, connected) {
      var selectors;
      if (connected) {
        for (var q, m = matches(element), i = 0, length = query.length; i < length; i++) {
          if (m.call(element, q = query[i])) {
            if (!live.has(element)) live.set(element, new Set$2());
            selectors = live.get(element);
            if (!selectors.has(q)) {
              selectors.add(q);
              options.handle(element, connected, q);
            }
          }
        }
      } else if (live.has(element)) {
        selectors = live.get(element);
        live["delete"](element);
        selectors.forEach(function (q) {
          options.handle(element, connected, q);
        });
      }
    };
    var parse = function parse(elements) {
      var connected = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      for (var i = 0, length = elements.length; i < length; i++) notifier(elements[i], connected);
    };
    var query = options.query;
    var root = options.root || document$2;
    var attachShadow = Element$1.prototype.attachShadow;
    if (attachShadow) Element$1.prototype.attachShadow = function (init) {
      var shadowRoot = attachShadow.call(this, init);
      return shadowRoot;
    };
    if (query.length) parse(root[QSA](query));
    return {
      drop: drop,
      flush: flush,
      parse: parse
    };
  });

  var _self = self,
    document$1 = _self.document,
    Map = _self.Map,
    Object$1 = _self.Object,
    Set$1 = _self.Set,
    WeakMap = _self.WeakMap,
    Element = _self.Element,
    HTMLElement = _self.Element,
    Node = _self.Node,
    Error = _self.Error,
    TypeError$1 = _self.TypeError,
    Reflect = _self.Reflect;
  var defineProperty = Object$1.defineProperty,
    keys = Object$1.keys,
    getOwnPropertyNames = Object$1.getOwnPropertyNames,
    setPrototypeOf = Object$1.setPrototypeOf;
  var legacy = !self.customElements;
  var expando = function expando(element) {
    var key = keys(element);
    var value = [];
    var length = key.length;
    for (var i = 0; i < length; i++) {
      value[i] = element[key[i]];
      delete element[key[i]];
    }
    return function () {
      for (var _i = 0; _i < length; _i++) element[key[_i]] = value[_i];
    };
  };
  if (legacy) {
    var HTMLBuiltIn = function HTMLBuiltIn() {
      var constructor = this.constructor;
      if (!classes.has(constructor)) throw new TypeError$1('Illegal constructor');
      var is = classes.get(constructor);
      if (override) return augment(override, is);
      var element = createElement.call(document$1, is);
      return augment(setPrototypeOf(element, constructor.prototype), is);
    };
    var createElement = document$1.createElement;
    var classes = new Map();
    var defined = new Map();
    var prototypes = new Map();
    var registry = new Map();
    var query = [];
    var handle = function handle(element, connected, selector) {
      var proto = prototypes.get(selector);
      if (connected && !proto.isPrototypeOf(element)) {
        var redefine = expando(element);
        override = setPrototypeOf(element, proto);
        try {
          new proto.constructor();
        } finally {
          override = null;
          redefine();
        }
      }
      var method = "".concat(connected ? '' : 'dis', "connectedCallback");
      if (method in proto) element[method]();
    };
    var _qsaObserver = qsaObserver({
        query: query,
        handle: handle
      }),
      parse = _qsaObserver.parse;
    var override = null;
    var whenDefined = function whenDefined(name) {
      if (!defined.has(name)) {
        var _,
          $ = new Promise(function ($) {
            _ = $;
          });
        defined.set(name, {
          $: $,
          _: _
        });
      }
      return defined.get(name).$;
    };
    var augment = attributesObserver(whenDefined);
    self.customElements = {
      define: function define(is, Class) {
        if (registry.has(is)) throw new Error("the name \"".concat(is, "\" has already been used with this registry"));
        classes.set(Class, is);
        prototypes.set(is, Class.prototype);
        registry.set(is, Class);
        query.push(is);
        whenDefined(is).then(function () {
          parse(document$1.querySelectorAll(is));
        });
        defined.get(is)._(Class);
      },
      get: function get(is) {
        return registry.get(is);
      },
      whenDefined: whenDefined
    };
    defineProperty(HTMLBuiltIn.prototype = HTMLElement.prototype, 'constructor', {
      value: HTMLBuiltIn
    });
    self.HTMLElement = HTMLBuiltIn;
    document$1.createElement = function (name, options) {
      var is = options && options.is;
      var Class = is ? registry.get(is) : registry.get(name);
      return Class ? new Class() : createElement.call(document$1, name);
    };
    // in case ShadowDOM is used through a polyfill, to avoid issues
    // with builtin extends within shadow roots
    if (!('isConnected' in Node.prototype)) defineProperty(Node.prototype, 'isConnected', {
      configurable: true,
      get: function get() {
        return !(this.ownerDocument.compareDocumentPosition(this) & this.DOCUMENT_POSITION_DISCONNECTED);
      }
    });
  } else {
    legacy = !self.customElements.get('extends-li');
    if (legacy) {
      try {
        var LI = function LI() {
          return self.Reflect.construct(HTMLLIElement, [], LI);
        };
        LI.prototype = HTMLLIElement.prototype;
        var is = 'extends-li';
        self.customElements.define('extends-li', LI, {
          'extends': 'li'
        });
        legacy = document$1.createElement('li', {
          is: is
        }).outerHTML.indexOf(is) < 0;
        var _self$customElements = self.customElements,
          get = _self$customElements.get,
          _whenDefined = _self$customElements.whenDefined;
        self.customElements.whenDefined = function (is) {
          var _this = this;
          return _whenDefined.call(this, is).then(function (Class) {
            return Class || get.call(_this, is);
          });
        };
      } catch (o_O) {}
    }
  }
  if (legacy) {
    var _parseShadow = function _parseShadow(element) {
      var root = shadowRoots.get(element);
      _parse(root.querySelectorAll(this), element.isConnected);
    };
    var customElements = self.customElements;
    var _createElement = document$1.createElement;
    var define = customElements.define,
      _get = customElements.get,
      upgrade = customElements.upgrade;
    var _ref = Reflect || {
        construct: function construct(HTMLElement) {
          return HTMLElement.call(this);
        }
      },
      construct = _ref.construct;
    var shadowRoots = new WeakMap();
    var shadows = new Set$1();
    var _classes = new Map();
    var _defined = new Map();
    var _prototypes = new Map();
    var _registry = new Map();
    var shadowed = [];
    var _query = [];
    var getCE = function getCE(is) {
      return _registry.get(is) || _get.call(customElements, is);
    };
    var _handle = function _handle(element, connected, selector) {
      var proto = _prototypes.get(selector);
      if (connected && !proto.isPrototypeOf(element)) {
        var redefine = expando(element);
        _override = setPrototypeOf(element, proto);
        try {
          new proto.constructor();
        } finally {
          _override = null;
          redefine();
        }
      }
      var method = "".concat(connected ? '' : 'dis', "connectedCallback");
      if (method in proto) element[method]();
    };
    var _qsaObserver2 = qsaObserver({
        query: _query,
        handle: _handle
      }),
      _parse = _qsaObserver2.parse;
    var _qsaObserver3 = qsaObserver({
        query: shadowed,
        handle: function handle(element, connected) {
          if (shadowRoots.has(element)) {
            if (connected) shadows.add(element);else shadows["delete"](element);
            if (_query.length) _parseShadow.call(_query, element);
          }
        }
      }),
      parseShadowed = _qsaObserver3.parse;
    // qsaObserver also patches attachShadow
    // be sure this runs *after* that
    var attachShadow = Element.prototype.attachShadow;
    if (attachShadow) Element.prototype.attachShadow = function (init) {
      var root = attachShadow.call(this, init);
      shadowRoots.set(this, root);
      return root;
    };
    var _whenDefined2 = function _whenDefined2(name) {
      if (!_defined.has(name)) {
        var _,
          $ = new Promise(function ($) {
            _ = $;
          });
        _defined.set(name, {
          $: $,
          _: _
        });
      }
      return _defined.get(name).$;
    };
    var _augment = attributesObserver(_whenDefined2);
    var _override = null;
    getOwnPropertyNames(self).filter(function (k) {
      return /^HTML.*Element$/.test(k);
    }).forEach(function (k) {
      var HTMLElement = self[k];
      function HTMLBuiltIn() {
        var constructor = this.constructor;
        if (!_classes.has(constructor)) throw new TypeError$1('Illegal constructor');
        var _classes$get = _classes.get(constructor),
          is = _classes$get.is,
          tag = _classes$get.tag;
        if (is) {
          if (_override) return _augment(_override, is);
          var element = _createElement.call(document$1, tag);
          element.setAttribute('is', is);
          return _augment(setPrototypeOf(element, constructor.prototype), is);
        } else return construct.call(this, HTMLElement, [], constructor);
      }


      defineProperty(self, k, {
        value: HTMLBuiltIn
      });
    });
    document$1.createElement = function (name, options) {
      var is = options && options.is;
      if (is) {
        var Class = _registry.get(is);
        if (Class && _classes.get(Class).tag === name) return new Class();
      }
      var element = _createElement.call(document$1, name);
      if (is) element.setAttribute('is', is);
      return element;
    };
    customElements.get = getCE;
    customElements.whenDefined = _whenDefined2;
    customElements.upgrade = function (element) {
      var is = element.getAttribute('is');
      if (is) {
        var _constructor = _registry.get(is);
        if (_constructor) {
          _augment(setPrototypeOf(element, _constructor.prototype), is);
          // apparently unnecessary because this is handled by qsa observer
          // if (element.isConnected && element.connectedCallback)
          //   element.connectedCallback();
          return;
        }
      }
      upgrade.call(customElements, element);
    };
    customElements.define = function (is, Class, options) {
      if (getCE(is)) throw new Error("'".concat(is, "' has already been defined as a custom element"));
      var selector;
      var tag = options && options["extends"];
      _classes.set(Class, tag ? {
        is: is,
        tag: tag
      } : {
        is: '',
        tag: is
      });
      if (tag) {
        selector = "".concat(tag, "[is=\"").concat(is, "\"]");
        _prototypes.set(selector, Class.prototype);
        _registry.set(is, Class);
        _query.push(selector);
      } else {
        define.apply(customElements, arguments);
        shadowed.push(selector = is);
      }
      _whenDefined2(is).then(function () {
        if (tag) {
          _parse(document$1.querySelectorAll(selector));
          shadows.forEach(_parseShadow, [selector]);
        } else parseShadowed(document$1.querySelectorAll(selector));
      });
      _defined.get(is)._(Class);
    };
  }

})();
