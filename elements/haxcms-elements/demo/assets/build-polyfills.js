var t, e, n, o, r;
(t = window),
  (e = document),
  !t.getSelection &&
    e.selection &&
    ((n = null),
    (t.getSelection = function () {
      return null != n ? n : (n = new o());
    }),
    (e.createRange = function () {
      return new Range();
    }),
    e.attachEvent("onkeydown", function () {
      return t.getSelection().setRangeAt(0, new Range(!0));
    }),
    e.attachEvent("onselectionchange", function () {
      var n, o;
      return (
        t.getSelection().setRangeAt(0, new Range(!0)),
        "INPUT" === (n = e.selection.createRange().parentElement()).tagName ||
        "TEXTAREA" === n.tagName
          ? ((o = t.getSelection().getRangeAt(0)),
            (n.selectionStart = o.selectionStart),
            (n.selectionEnd = o.selectionEnd))
          : void 0
      );
    }),
    (t.Range = (function () {
      function t(t) {
        t
          ? (this.range = e.selection.createRange())
          : ((this.range = e.body.createTextRange()), this.collapse(!0)),
          this.init();
      }
      return (
        (t.END_TO_END = "EndToEnd"),
        (t.END_TO_START = "EndToStart"),
        (t.START_TO_END = "StartToEnd"),
        (t.START_TO_START = "StartToStart"),
        (t.prototype.init = function () {
          var t, e, n, o, i, a;
          return (
            (e = this.range.parentElement()),
            (this.commonAncestorContainer = e),
            (this.collapsed =
              0 === this.compareBoundaryPoints("StartToEnd", this)),
            (a = this.range.duplicate()).moveToElementText(e),
            (t = this.range.text.length > 0 ? 0 : 1),
            (i = r.findLength("StartToStart", a, this.range)),
            (n = r.findNodeByPos(e, i, t)),
            (this.startContainer = n.el),
            (this.startOffset = n.offset),
            (o = r.findLength("StartToEnd", a, this.range)),
            (n = r.findNodeByPos(e, o, 1)),
            (this.endContainer = n.el),
            (this.endOffset = n.offset),
            (this.selectionStart = r.findLength(
              "StartToStart",
              a,
              this.range,
              !0,
            )),
            (this.selectionEnd = r.findLength("StartToEnd", a, this.range, !0))
          );
        }),
        (t.prototype.select = function () {
          return this.range.select();
        }),
        (t.prototype.setStart = function (t, e) {
          var n, o;
          return r.getText(t).length >= e && e >= 0
            ? ((o = this.range.duplicate()),
              3 === t.nodeType &&
                ((n = r.findPosFromNode(t)),
                o.moveToElementText(t.parentNode),
                o.moveStart("character", n + e)),
              -1 === this.range.compareEndPoints("StartToEnd", o) &&
                this.range.setEndPoint("EndToStart", o),
              this.range.setEndPoint("StartToStart", o))
            : void 0;
        }),
        (t.prototype.setEnd = function (t, e) {
          var n, o;
          return r.getText(t).length >= e && e >= 0
            ? ((o = this.range.duplicate()),
              3 === t.nodeType &&
                ((n = r.findPosFromNode(t)),
                o.moveToElementText(t.parentNode),
                o.moveStart("character", n + e)),
              this.range.setEndPoint("EndToStart", o))
            : void 0;
        }),
        (t.prototype.selectNodeContents = function (t) {
          return this.range.moveToElementText(t);
        }),
        (t.prototype.collapse = function (t) {
          return t
            ? this.range.setEndPoint("EndToStart", this.range)
            : this.range.setEndPoint("StartToEnd", this.range);
        }),
        (t.prototype.compareBoundaryPoints = function (t, e) {
          return this.range.compareEndPoints(t, e.range);
        }),
        (t.prototype.cloneRange = function () {
          var e;
          return ((e = new t()).range = this.range.duplicate()), e.init(), e;
        }),
        (t.prototype.detach = function () {
          return delete this.range;
        }),
        (t.prototype.getBoundingClientRect = function () {
          var e;
          return {
            width: (e = this.range.getBoundingClientRect()).right - e.left,
            height: e.bottom - e.top,
            left: e.left,
            right: e.right,
            bottom: e.bottom,
            top: e.top,
          };
        }),
        (t.prototype.toString = function () {
          return this.range.text || "";
        }),
        t
      );
    })()),
    (o = (function () {
      function t() {
        (this.selection = e.selection), (this.ranges = []), this.init();
      }
      return (
        (t.prototype.init = function () {
          var t, e, n, o, r;
          return (
            (this.rangeCount = this.ranges.length),
            this.rangeCount
              ? ((e = this.ranges[0]),
                null == this.prev && (this.prev = e),
                0 === e.compareBoundaryPoints(Range.END_TO_END, this.prev)
                  ? ((t = (o = ["end", "start"])[0]), (n = o[1]))
                  : ((t = (r = ["start", "end"])[0]), (n = r[1])),
                (this.anchorNode = e[t + "Container"]),
                (this.anchorOffset = e[t + "Offset"]),
                (this.focusNode = e[n + "Container"]),
                (this.focusOffset = e[n + "Offset"]),
                (this.isCollapsed = this.anchorNode === this.focusNode))
              : void 0
          );
        }),
        (t.prototype.getRangeAt = function (t) {
          return this.ranges[t];
        }),
        (t.prototype.setRangeAt = function (t, e) {
          return (
            (this.prev = this.ranges[t]), (this.ranges[t] = e), this.init()
          );
        }),
        (t.prototype.removeAllRanges = function () {
          return (this.ranges = []), this.init();
        }),
        (t.prototype.addRange = function (t) {
          var e, n, o, r, i;
          for (
            this.ranges.push(t),
              this.init(),
              i = [],
              n = 0,
              o = (r = this.ranges).length;
            o > n;
            n++
          )
            (e = r[n]), i.push(e.select());
          return i;
        }),
        (t.prototype.deleteFromDocument = function () {
          return this.selection.clear();
        }),
        (t.prototype.toString = function () {
          return this.ranges[0].toString();
        }),
        t
      );
    })()),
    (r = {
      convertLineBreaks: function (t) {
        return t.replace(/\r\n/g, "\n");
      },
      stripLineBreaks: function (t) {
        return t.replace(/\r\n/g, "");
      },
      getText: function (t) {
        return t.innerText || t.nodeValue;
      },
      findLength: function (t, e, n, o) {
        var i;
        switch (((i = e.duplicate()), t)) {
          case "StartToStart":
            i.setEndPoint("EndToStart", n);
            break;
          case "StartToEnd":
            i.setEndPoint("EndToEnd", n);
        }
        return o
          ? r.convertLineBreaks(i.text).length
          : r.stripLineBreaks(i.text).length;
      },
      findNodeByPos: function (t, e, n) {
        var o, r;
        return (
          null == n && (n = 0),
          (o = function (t, e, n, r) {
            var i, a, s, h, c;
            for (c = [], a = 0, s = (h = t.childNodes).length; s > a; a++)
              if (((i = h[a]), !r.found))
                if (3 === i.nodeType) {
                  if (r.length + i.length + n > e) {
                    (r.found = !0), (r.el = i), (r.offset = e - r.length);
                    break;
                  }
                  c.push((r.length += i.length));
                } else c.push(o(i, e, n, r));
            return c;
          })(t, e, n, (r = { length: 0, el: t, offset: 0 })),
          r
        );
      },
      findPosFromNode: function (t) {
        var e, n, o;
        return (
          (n = { pos: 0 }),
          (o = t.parentNode),
          (e = function (t, n, o) {
            var r, i, a, s, h;
            for (h = [], i = 0, a = (s = t.childNodes).length; a > i; i++)
              if (((r = s[i]), !o.found)) {
                if (r === n) {
                  o.found = !0;
                  break;
                }
                3 === r.nodeType
                  ? h.push((o.pos += r.length))
                  : r.hasChildNodes()
                    ? h.push(e(r, n, o))
                    : h.push(void 0);
              }
            return h;
          })(o, t, n),
          n.pos
        );
      },
    })),
  "NodeList" in window &&
    !NodeList.prototype.forEach &&
    (NodeList.prototype.forEach = function (callback, thisArg) {
      thisArg = thisArg || window;
      for (var i = 0; i < this.length; i++)
        callback.call(thisArg, this[i], i, this);
    }),
  Object.entries ||
    (Object.entries = function (obj) {
      for (
        var ownProps = Object.keys(obj),
          i = ownProps.length,
          resArray = new Array(i);
        i--;

      )
        resArray[i] = [ownProps[i], obj[ownProps[i]]];
      return resArray;
    }),
  Object.is ||
    Object.defineProperty(Object, "is", {
      value: function (x, y) {
        return x === y ? 0 !== x || 1 / x == 1 / y : x != x && y != y;
      },
    }),
  Array.prototype.find ||
    Object.defineProperty(Array.prototype, "find", {
      value: function (predicate) {
        if (null == this) throw new TypeError('"this" is null or not defined');
        var o = Object(this),
          len = o.length >>> 0;
        if ("function" != typeof predicate)
          throw new TypeError("predicate must be a function");
        for (var thisArg = arguments[1], k = 0; k < len; ) {
          var kValue = o[k];
          if (predicate.call(thisArg, kValue, k, o)) return kValue;
          k++;
        }
      },
    }),
  String.prototype.includes ||
    (String.prototype.includes = function (search, start) {
      return (
        "number" != typeof start && (start = 0),
        !(start + search.length > this.length) &&
          -1 !== this.indexOf(search, start)
      );
    }),
  Array.prototype.includes ||
    Object.defineProperty(Array.prototype, "includes", {
      value: function (searchElement, fromIndex) {
        if (null == this) throw new TypeError('"this" is null or not defined');
        var o = Object(this),
          len = o.length >>> 0;
        if (0 === len) return !1;
        var x,
          y,
          n = 0 | fromIndex,
          k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
        for (; k < len; ) {
          if (
            (x = o[k]) === (y = searchElement) ||
            ("number" == typeof x &&
              "number" == typeof y &&
              isNaN(x) &&
              isNaN(y))
          )
            return !0;
          k++;
        }
        return !1;
      },
    }),
  (function () {
    if ("object" == typeof window)
      if (
        "IntersectionObserver" in window &&
        "IntersectionObserverEntry" in window &&
        "intersectionRatio" in window.IntersectionObserverEntry.prototype
      )
        "isIntersecting" in window.IntersectionObserverEntry.prototype ||
          Object.defineProperty(
            window.IntersectionObserverEntry.prototype,
            "isIntersecting",
            {
              get: function () {
                return this.intersectionRatio > 0;
              },
            },
          );
      else {
        var document = (function (startDoc) {
            for (
              var doc = window.document, frame = getFrameElement(doc);
              frame;

            )
              frame = getFrameElement((doc = frame.ownerDocument));
            return doc;
          })(),
          registry = [],
          crossOriginUpdater = null,
          crossOriginRect = null;
        (IntersectionObserver.prototype.THROTTLE_TIMEOUT = 100),
          (IntersectionObserver.prototype.POLL_INTERVAL = null),
          (IntersectionObserver.prototype.USE_MUTATION_OBSERVER = !0),
          (IntersectionObserver._setupCrossOriginUpdater = function () {
            return (
              crossOriginUpdater ||
                (crossOriginUpdater = function (
                  boundingClientRect,
                  intersectionRect,
                ) {
                  (crossOriginRect =
                    boundingClientRect && intersectionRect
                      ? convertFromParentRect(
                          boundingClientRect,
                          intersectionRect,
                        )
                      : {
                          top: 0,
                          bottom: 0,
                          left: 0,
                          right: 0,
                          width: 0,
                          height: 0,
                        }),
                    registry.forEach(function (observer) {
                      observer._checkForIntersections();
                    });
                }),
              crossOriginUpdater
            );
          }),
          (IntersectionObserver._resetCrossOriginUpdater = function () {
            (crossOriginUpdater = null), (crossOriginRect = null);
          }),
          (IntersectionObserver.prototype.observe = function (target) {
            if (
              !this._observationTargets.some(function (item) {
                return item.element == target;
              })
            ) {
              if (!target || 1 != target.nodeType)
                throw new Error("target must be an Element");
              this._registerInstance(),
                this._observationTargets.push({ element: target, entry: null }),
                this._monitorIntersections(target.ownerDocument),
                this._checkForIntersections();
            }
          }),
          (IntersectionObserver.prototype.unobserve = function (target) {
            (this._observationTargets = this._observationTargets.filter(
              function (item) {
                return item.element != target;
              },
            )),
              this._unmonitorIntersections(target.ownerDocument),
              0 == this._observationTargets.length &&
                this._unregisterInstance();
          }),
          (IntersectionObserver.prototype.disconnect = function () {
            (this._observationTargets = []),
              this._unmonitorAllIntersections(),
              this._unregisterInstance();
          }),
          (IntersectionObserver.prototype.takeRecords = function () {
            var records = this._queuedEntries.slice();
            return (this._queuedEntries = []), records;
          }),
          (IntersectionObserver.prototype._initThresholds = function (
            opt_threshold,
          ) {
            var threshold = opt_threshold || [0];
            return (
              Array.isArray(threshold) || (threshold = [threshold]),
              threshold.sort().filter(function (t, i, a) {
                if ("number" != typeof t || isNaN(t) || t < 0 || t > 1)
                  throw new Error(
                    "threshold must be a number between 0 and 1 inclusively",
                  );
                return t !== a[i - 1];
              })
            );
          }),
          (IntersectionObserver.prototype._parseRootMargin = function (
            opt_rootMargin,
          ) {
            var margins = (opt_rootMargin || "0px")
              .split(/\s+/)
              .map(function (margin) {
                var parts = /^(-?\d*\.?\d+)(px|%)$/.exec(margin);
                if (!parts)
                  throw new Error(
                    "rootMargin must be specified in pixels or percent",
                  );
                return { value: parseFloat(parts[1]), unit: parts[2] };
              });
            return (
              (margins[1] = margins[1] || margins[0]),
              (margins[2] = margins[2] || margins[0]),
              (margins[3] = margins[3] || margins[1]),
              margins
            );
          }),
          (IntersectionObserver.prototype._monitorIntersections = function (
            doc,
          ) {
            var win = doc.defaultView;
            if (win && -1 == this._monitoringDocuments.indexOf(doc)) {
              var callback = this._checkForIntersections,
                monitoringInterval = null,
                domObserver = null;
              this.POLL_INTERVAL
                ? (monitoringInterval = win.setInterval(
                    callback,
                    this.POLL_INTERVAL,
                  ))
                : (addEvent(win, "resize", callback, !0),
                  addEvent(doc, "scroll", callback, !0),
                  this.USE_MUTATION_OBSERVER &&
                    "MutationObserver" in win &&
                    (domObserver = new win.MutationObserver(callback)).observe(
                      doc,
                      {
                        attributes: !0,
                        childList: !0,
                        characterData: !0,
                        subtree: !0,
                      },
                    )),
                this._monitoringDocuments.push(doc),
                this._monitoringUnsubscribes.push(function () {
                  var win = doc.defaultView;
                  win &&
                    (monitoringInterval &&
                      win.clearInterval(monitoringInterval),
                    removeEvent(win, "resize", callback, !0)),
                    removeEvent(doc, "scroll", callback, !0),
                    domObserver && domObserver.disconnect();
                });
              var rootDoc =
                (this.root && (this.root.ownerDocument || this.root)) ||
                document;
              if (doc != rootDoc) {
                var frame = getFrameElement(doc);
                frame && this._monitorIntersections(frame.ownerDocument);
              }
            }
          }),
          (IntersectionObserver.prototype._unmonitorIntersections = function (
            doc,
          ) {
            var index = this._monitoringDocuments.indexOf(doc);
            if (-1 != index) {
              var rootDoc =
                (this.root && (this.root.ownerDocument || this.root)) ||
                document;
              if (
                !this._observationTargets.some(function (item) {
                  var itemDoc = item.element.ownerDocument;
                  if (itemDoc == doc) return !0;
                  for (; itemDoc && itemDoc != rootDoc; ) {
                    var frame = getFrameElement(itemDoc);
                    if ((itemDoc = frame && frame.ownerDocument) == doc)
                      return !0;
                  }
                  return !1;
                })
              ) {
                var unsubscribe = this._monitoringUnsubscribes[index];
                if (
                  (this._monitoringDocuments.splice(index, 1),
                  this._monitoringUnsubscribes.splice(index, 1),
                  unsubscribe(),
                  doc != rootDoc)
                ) {
                  var frame = getFrameElement(doc);
                  frame && this._unmonitorIntersections(frame.ownerDocument);
                }
              }
            }
          }),
          (IntersectionObserver.prototype._unmonitorAllIntersections =
            function () {
              var unsubscribes = this._monitoringUnsubscribes.slice(0);
              (this._monitoringDocuments.length = 0),
                (this._monitoringUnsubscribes.length = 0);
              for (var i = 0; i < unsubscribes.length; i++) unsubscribes[i]();
            }),
          (IntersectionObserver.prototype._checkForIntersections = function () {
            if (this.root || !crossOriginUpdater || crossOriginRect) {
              var rootIsInDom = this._rootIsInDom(),
                rootRect = rootIsInDom
                  ? this._getRootRect()
                  : {
                      top: 0,
                      bottom: 0,
                      left: 0,
                      right: 0,
                      width: 0,
                      height: 0,
                    };
              this._observationTargets.forEach(function (item) {
                var target = item.element,
                  targetRect = getBoundingClientRect(target),
                  rootContainsTarget = this._rootContainsTarget(target),
                  oldEntry = item.entry,
                  intersectionRect =
                    rootIsInDom &&
                    rootContainsTarget &&
                    this._computeTargetAndRootIntersection(
                      target,
                      targetRect,
                      rootRect,
                    ),
                  rootBounds = null;
                this._rootContainsTarget(target)
                  ? (crossOriginUpdater && !this.root) ||
                    (rootBounds = rootRect)
                  : (rootBounds = {
                      top: 0,
                      bottom: 0,
                      left: 0,
                      right: 0,
                      width: 0,
                      height: 0,
                    });
                var newEntry = (item.entry = new IntersectionObserverEntry({
                  time:
                    window.performance && performance.now && performance.now(),
                  target,
                  boundingClientRect: targetRect,
                  rootBounds,
                  intersectionRect,
                }));
                oldEntry
                  ? rootIsInDom && rootContainsTarget
                    ? this._hasCrossedThreshold(oldEntry, newEntry) &&
                      this._queuedEntries.push(newEntry)
                    : oldEntry &&
                      oldEntry.isIntersecting &&
                      this._queuedEntries.push(newEntry)
                  : this._queuedEntries.push(newEntry);
              }, this),
                this._queuedEntries.length &&
                  this._callback(this.takeRecords(), this);
            }
          }),
          (IntersectionObserver.prototype._computeTargetAndRootIntersection =
            function (target, targetRect, rootRect) {
              if ("none" != window.getComputedStyle(target).display) {
                for (
                  var rect1,
                    rect2,
                    top,
                    bottom,
                    left,
                    right,
                    width,
                    height,
                    intersectionRect = targetRect,
                    parent = getParentNode(target),
                    atRoot = !1;
                  !atRoot && parent;

                ) {
                  var parentRect = null,
                    parentComputedStyle =
                      1 == parent.nodeType
                        ? window.getComputedStyle(parent)
                        : {};
                  if ("none" == parentComputedStyle.display) return null;
                  if (parent == this.root || 9 == parent.nodeType)
                    if (
                      ((atRoot = !0), parent == this.root || parent == document)
                    )
                      crossOriginUpdater && !this.root
                        ? !crossOriginRect ||
                          (0 == crossOriginRect.width &&
                            0 == crossOriginRect.height)
                          ? ((parent = null),
                            (parentRect = null),
                            (intersectionRect = null))
                          : (parentRect = crossOriginRect)
                        : (parentRect = rootRect);
                    else {
                      var frame = getParentNode(parent),
                        frameRect = frame && getBoundingClientRect(frame),
                        frameIntersect =
                          frame &&
                          this._computeTargetAndRootIntersection(
                            frame,
                            frameRect,
                            rootRect,
                          );
                      frameRect && frameIntersect
                        ? ((parent = frame),
                          (parentRect = convertFromParentRect(
                            frameRect,
                            frameIntersect,
                          )))
                        : ((parent = null), (intersectionRect = null));
                    }
                  else {
                    var doc = parent.ownerDocument;
                    parent != doc.body &&
                      parent != doc.documentElement &&
                      "visible" != parentComputedStyle.overflow &&
                      (parentRect = getBoundingClientRect(parent));
                  }
                  if (
                    (parentRect &&
                      ((rect1 = parentRect),
                      (rect2 = intersectionRect),
                      (top = void 0),
                      (bottom = void 0),
                      (left = void 0),
                      (right = void 0),
                      (width = void 0),
                      (height = void 0),
                      (top = Math.max(rect1.top, rect2.top)),
                      (bottom = Math.min(rect1.bottom, rect2.bottom)),
                      (left = Math.max(rect1.left, rect2.left)),
                      (right = Math.min(rect1.right, rect2.right)),
                      (height = bottom - top),
                      (intersectionRect =
                        ((width = right - left) >= 0 &&
                          height >= 0 && {
                            top,
                            bottom,
                            left,
                            right,
                            width,
                            height,
                          }) ||
                        null)),
                    !intersectionRect)
                  )
                    break;
                  parent = parent && getParentNode(parent);
                }
                return intersectionRect;
              }
            }),
          (IntersectionObserver.prototype._getRootRect = function () {
            var rootRect;
            if (this.root && !isDoc(this.root))
              rootRect = getBoundingClientRect(this.root);
            else {
              var doc = isDoc(this.root) ? this.root : document,
                html = doc.documentElement,
                body = doc.body;
              rootRect = {
                top: 0,
                left: 0,
                right: html.clientWidth || body.clientWidth,
                width: html.clientWidth || body.clientWidth,
                bottom: html.clientHeight || body.clientHeight,
                height: html.clientHeight || body.clientHeight,
              };
            }
            return this._expandRectByRootMargin(rootRect);
          }),
          (IntersectionObserver.prototype._expandRectByRootMargin = function (
            rect,
          ) {
            var margins = this._rootMarginValues.map(function (margin, i) {
                return "px" == margin.unit
                  ? margin.value
                  : (margin.value * (i % 2 ? rect.width : rect.height)) / 100;
              }),
              newRect = {
                top: rect.top - margins[0],
                right: rect.right + margins[1],
                bottom: rect.bottom + margins[2],
                left: rect.left - margins[3],
              };
            return (
              (newRect.width = newRect.right - newRect.left),
              (newRect.height = newRect.bottom - newRect.top),
              newRect
            );
          }),
          (IntersectionObserver.prototype._hasCrossedThreshold = function (
            oldEntry,
            newEntry,
          ) {
            var oldRatio =
                oldEntry && oldEntry.isIntersecting
                  ? oldEntry.intersectionRatio || 0
                  : -1,
              newRatio = newEntry.isIntersecting
                ? newEntry.intersectionRatio || 0
                : -1;
            if (oldRatio !== newRatio)
              for (var i = 0; i < this.thresholds.length; i++) {
                var threshold = this.thresholds[i];
                if (
                  threshold == oldRatio ||
                  threshold == newRatio ||
                  threshold < oldRatio != threshold < newRatio
                )
                  return !0;
              }
          }),
          (IntersectionObserver.prototype._rootIsInDom = function () {
            return !this.root || containsDeep(document, this.root);
          }),
          (IntersectionObserver.prototype._rootContainsTarget = function (
            target,
          ) {
            var rootDoc =
              (this.root && (this.root.ownerDocument || this.root)) || document;
            return (
              containsDeep(rootDoc, target) &&
              (!this.root || rootDoc == target.ownerDocument)
            );
          }),
          (IntersectionObserver.prototype._registerInstance = function () {
            registry.indexOf(this) < 0 && registry.push(this);
          }),
          (IntersectionObserver.prototype._unregisterInstance = function () {
            var index = registry.indexOf(this);
            -1 != index && registry.splice(index, 1);
          }),
          (window.IntersectionObserver = IntersectionObserver),
          (window.IntersectionObserverEntry = IntersectionObserverEntry);
      }
    function getFrameElement(doc) {
      try {
        return (doc.defaultView && doc.defaultView.frameElement) || null;
      } catch (e) {
        return null;
      }
    }
    function IntersectionObserverEntry(entry) {
      (this.time = entry.time),
        (this.target = entry.target),
        (this.rootBounds = ensureDOMRect(entry.rootBounds)),
        (this.boundingClientRect = ensureDOMRect(entry.boundingClientRect)),
        (this.intersectionRect = ensureDOMRect(
          entry.intersectionRect || {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            width: 0,
            height: 0,
          },
        )),
        (this.isIntersecting = !!entry.intersectionRect);
      var targetRect = this.boundingClientRect,
        targetArea = targetRect.width * targetRect.height,
        intersectionRect = this.intersectionRect,
        intersectionArea = intersectionRect.width * intersectionRect.height;
      this.intersectionRatio = targetArea
        ? Number((intersectionArea / targetArea).toFixed(4))
        : this.isIntersecting
          ? 1
          : 0;
    }
    function IntersectionObserver(callback, opt_options) {
      var options = opt_options || {};
      if ("function" != typeof callback)
        throw new Error("callback must be a function");
      if (
        options.root &&
        1 != options.root.nodeType &&
        9 != options.root.nodeType
      )
        throw new Error("root must be a Document or Element");
      (this._checkForIntersections = (function throttle(fn, timeout) {
        var timer = null;
        return function () {
          timer ||
            (timer = setTimeout(function () {
              fn(), (timer = null);
            }, timeout));
        };
      })(this._checkForIntersections.bind(this), this.THROTTLE_TIMEOUT)),
        (this._callback = callback),
        (this._observationTargets = []),
        (this._queuedEntries = []),
        (this._rootMarginValues = this._parseRootMargin(options.rootMargin)),
        (this.thresholds = this._initThresholds(options.threshold)),
        (this.root = options.root || null),
        (this.rootMargin = this._rootMarginValues
          .map(function (margin) {
            return margin.value + margin.unit;
          })
          .join(" ")),
        (this._monitoringDocuments = []),
        (this._monitoringUnsubscribes = []);
    }
    function addEvent(node, event, fn, opt_useCapture) {
      "function" == typeof node.addEventListener
        ? node.addEventListener(event, fn, opt_useCapture || !1)
        : "function" == typeof node.attachEvent &&
          node.attachEvent("on" + event, fn);
    }
    function removeEvent(node, event, fn, opt_useCapture) {
      "function" == typeof node.removeEventListener
        ? node.removeEventListener(event, fn, opt_useCapture || !1)
        : "function" == typeof node.detatchEvent &&
          node.detatchEvent("on" + event, fn);
    }
    function getBoundingClientRect(el) {
      var rect;
      try {
        rect = el.getBoundingClientRect();
      } catch (err) {}
      return rect
        ? ((rect.width && rect.height) ||
            (rect = {
              top: rect.top,
              right: rect.right,
              bottom: rect.bottom,
              left: rect.left,
              width: rect.right - rect.left,
              height: rect.bottom - rect.top,
            }),
          rect)
        : { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 };
    }
    function ensureDOMRect(rect) {
      return !rect || "x" in rect
        ? rect
        : {
            top: rect.top,
            y: rect.top,
            bottom: rect.bottom,
            left: rect.left,
            x: rect.left,
            right: rect.right,
            width: rect.width,
            height: rect.height,
          };
    }
    function convertFromParentRect(parentBoundingRect, parentIntersectionRect) {
      var top = parentIntersectionRect.top - parentBoundingRect.top,
        left = parentIntersectionRect.left - parentBoundingRect.left;
      return {
        top,
        left,
        height: parentIntersectionRect.height,
        width: parentIntersectionRect.width,
        bottom: top + parentIntersectionRect.height,
        right: left + parentIntersectionRect.width,
      };
    }
    function containsDeep(parent, child) {
      for (var node = child; node; ) {
        if (node == parent) return !0;
        node = getParentNode(node);
      }
      return !1;
    }
    function getParentNode(node) {
      var parent = node.parentNode;
      return 9 == node.nodeType && node != document
        ? getFrameElement(node)
        : (parent &&
            parent.assignedSlot &&
            (parent = parent.assignedSlot.parentNode),
          parent && 11 == parent.nodeType && parent.host
            ? parent.host
            : parent);
    }
    function isDoc(node) {
      return node && 9 === node.nodeType;
    }
  })();
