!(function (t, e) {
  var n;
  if (!t.getSelection && e.selection) {
    (n = null),
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
          (n = e.selection.createRange().parentElement()),
          "INPUT" === n.tagName || "TEXTAREA" === n.tagName
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
              (a = this.range.duplicate()),
              a.moveToElementText(e),
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
              (this.selectionEnd = r.findLength(
                "StartToEnd",
                a,
                this.range,
                !0,
              ))
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
            return (
              (e = new t()), (e.range = this.range.duplicate()), e.init(), e
            );
          }),
          (t.prototype.detach = function () {
            return delete this.range;
          }),
          (t.prototype.getBoundingClientRect = function () {
            var t, e;
            return (
              (e = this.range.getBoundingClientRect()),
              (t = {
                width: e.right - e.left,
                height: e.bottom - e.top,
                left: e.left,
                right: e.right,
                bottom: e.bottom,
                top: e.top,
              })
            );
          }),
          (t.prototype.toString = function () {
            return this.range.text || "";
          }),
          t
        );
      })());
    var o;
    o = (function () {
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
                  ? ((o = ["end", "start"]), (t = o[0]), (n = o[1]))
                  : ((r = ["start", "end"]), (t = r[0]), (n = r[1])),
                (this.anchorNode = e["" + t + "Container"]),
                (this.anchorOffset = e["" + t + "Offset"]),
                (this.focusNode = e["" + n + "Container"]),
                (this.focusOffset = e["" + n + "Offset"]),
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
              r = this.ranges,
              i = [],
              n = 0,
              o = r.length;
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
    })();
    var r;
    r = {
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
          (r = { length: 0, el: t, offset: 0 }),
          (o = function (t, e, n, r) {
            var i, a, s, h, c;
            for (h = t.childNodes, c = [], a = 0, s = h.length; s > a; a++)
              if (((i = h[a]), !r.found))
                if (3 === i.nodeType) {
                  if (r.length + i.length + n > e) {
                    (r.found = !0), (r.el = i), (r.offset = e - r.length);
                    break;
                  }
                  c.push((r.length += i.length));
                } else c.push(o(i, e, n, r));
            return c;
          })(t, e, n, r),
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
            for (s = t.childNodes, h = [], i = 0, a = s.length; a > i; i++)
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
    };
  }
})(window, document);
"NodeList" in window &&
  !NodeList.prototype.forEach &&
  (NodeList.prototype.forEach = function (t, e) {
    e = e || window;
    for (var n = 0; n < this.length; n++) t.call(e, this[n], n, this);
  }),
  Object.entries ||
    (Object.entries = function (t) {
      for (var e = Object.keys(t), n = e.length, o = new Array(n); n--; )
        o[n] = [e[n], t[e[n]]];
      return o;
    }),
  Object.is ||
    Object.defineProperty(Object, "is", {
      value: function (t, e) {
        return t === e ? 0 !== t || 1 / t == 1 / e : t != t && e != e;
      },
    }),
  Array.prototype.find ||
    Object.defineProperty(Array.prototype, "find", {
      value: function (t) {
        if (null == this) throw new TypeError('"this" is null or not defined');
        var e = Object(this),
          n = e.length >>> 0;
        if ("function" != typeof t)
          throw new TypeError("predicate must be a function");
        for (var o = arguments[1], i = 0; i < n; ) {
          var r = e[i];
          if (t.call(o, r, i, e)) return r;
          i++;
        }
      },
    }),
  String.prototype.includes ||
    (String.prototype.includes = function (t, e) {
      "use strict";
      return (
        "number" != typeof e && (e = 0),
        !(e + t.length > this.length) && -1 !== this.indexOf(t, e)
      );
    }),
  Array.prototype.includes ||
    Object.defineProperty(Array.prototype, "includes", {
      value: function (t, e) {
        if (null == this) throw new TypeError('"this" is null or not defined');
        var n = Object(this),
          o = n.length >>> 0;
        if (0 === o) return !1;
        var i,
          r,
          s = 0 | e,
          h = Math.max(s >= 0 ? s : o - Math.abs(s), 0);
        for (; h < o; ) {
          if (
            (i = n[h]) === (r = t) ||
            ("number" == typeof i &&
              "number" == typeof r &&
              isNaN(i) &&
              isNaN(r))
          )
            return !0;
          h++;
        }
        return !1;
      },
    }),
  (function () {
    "use strict";
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
        var t = (function (t) {
            for (var e = window.document, n = i(e); n; )
              n = i((e = n.ownerDocument));
            return e;
          })(),
          e = [],
          n = null,
          o = null;
        (s.prototype.THROTTLE_TIMEOUT = 100),
          (s.prototype.POLL_INTERVAL = null),
          (s.prototype.USE_MUTATION_OBSERVER = !0),
          (s._setupCrossOriginUpdater = function () {
            return (
              n ||
                (n = function (t, n) {
                  (o =
                    t && n
                      ? l(t, n)
                      : {
                          top: 0,
                          bottom: 0,
                          left: 0,
                          right: 0,
                          width: 0,
                          height: 0,
                        }),
                    e.forEach(function (t) {
                      t._checkForIntersections();
                    });
                }),
              n
            );
          }),
          (s._resetCrossOriginUpdater = function () {
            (n = null), (o = null);
          }),
          (s.prototype.observe = function (t) {
            if (
              !this._observationTargets.some(function (e) {
                return e.element == t;
              })
            ) {
              if (!t || 1 != t.nodeType)
                throw new Error("target must be an Element");
              this._registerInstance(),
                this._observationTargets.push({ element: t, entry: null }),
                this._monitorIntersections(t.ownerDocument),
                this._checkForIntersections();
            }
          }),
          (s.prototype.unobserve = function (t) {
            (this._observationTargets = this._observationTargets.filter(
              function (e) {
                return e.element != t;
              },
            )),
              this._unmonitorIntersections(t.ownerDocument),
              0 == this._observationTargets.length &&
                this._unregisterInstance();
          }),
          (s.prototype.disconnect = function () {
            (this._observationTargets = []),
              this._unmonitorAllIntersections(),
              this._unregisterInstance();
          }),
          (s.prototype.takeRecords = function () {
            var t = this._queuedEntries.slice();
            return (this._queuedEntries = []), t;
          }),
          (s.prototype._initThresholds = function (t) {
            var e = t || [0];
            return (
              Array.isArray(e) || (e = [e]),
              e.sort().filter(function (t, e, n) {
                if ("number" != typeof t || isNaN(t) || t < 0 || t > 1)
                  throw new Error(
                    "threshold must be a number between 0 and 1 inclusively",
                  );
                return t !== n[e - 1];
              })
            );
          }),
          (s.prototype._parseRootMargin = function (t) {
            var e = (t || "0px").split(/\s+/).map(function (t) {
              var e = /^(-?\d*\.?\d+)(px|%)$/.exec(t);
              if (!e)
                throw new Error(
                  "rootMargin must be specified in pixels or percent",
                );
              return { value: parseFloat(e[1]), unit: e[2] };
            });
            return (
              (e[1] = e[1] || e[0]),
              (e[2] = e[2] || e[0]),
              (e[3] = e[3] || e[1]),
              e
            );
          }),
          (s.prototype._monitorIntersections = function (e) {
            var n = e.defaultView;
            if (n && -1 == this._monitoringDocuments.indexOf(e)) {
              var o = this._checkForIntersections,
                r = null,
                s = null;
              this.POLL_INTERVAL
                ? (r = n.setInterval(o, this.POLL_INTERVAL))
                : (h(n, "resize", o, !0),
                  h(e, "scroll", o, !0),
                  this.USE_MUTATION_OBSERVER &&
                    "MutationObserver" in n &&
                    (s = new n.MutationObserver(o)).observe(e, {
                      attributes: !0,
                      childList: !0,
                      characterData: !0,
                      subtree: !0,
                    })),
                this._monitoringDocuments.push(e),
                this._monitoringUnsubscribes.push(function () {
                  var t = e.defaultView;
                  t && (r && t.clearInterval(r), u(t, "resize", o, !0)),
                    u(e, "scroll", o, !0),
                    s && s.disconnect();
                });
              var c =
                (this.root && (this.root.ownerDocument || this.root)) || t;
              if (e != c) {
                var a = i(e);
                a && this._monitorIntersections(a.ownerDocument);
              }
            }
          }),
          (s.prototype._unmonitorIntersections = function (e) {
            var n = this._monitoringDocuments.indexOf(e);
            if (-1 != n) {
              var o =
                (this.root && (this.root.ownerDocument || this.root)) || t;
              if (
                !this._observationTargets.some(function (t) {
                  var n = t.element.ownerDocument;
                  if (n == e) return !0;
                  for (; n && n != o; ) {
                    var r = i(n);
                    if ((n = r && r.ownerDocument) == e) return !0;
                  }
                  return !1;
                })
              ) {
                var r = this._monitoringUnsubscribes[n];
                if (
                  (this._monitoringDocuments.splice(n, 1),
                  this._monitoringUnsubscribes.splice(n, 1),
                  r(),
                  e != o)
                ) {
                  var s = i(e);
                  s && this._unmonitorIntersections(s.ownerDocument);
                }
              }
            }
          }),
          (s.prototype._unmonitorAllIntersections = function () {
            var t = this._monitoringUnsubscribes.slice(0);
            (this._monitoringDocuments.length = 0),
              (this._monitoringUnsubscribes.length = 0);
            for (var e = 0; e < t.length; e++) t[e]();
          }),
          (s.prototype._checkForIntersections = function () {
            if (this.root || !n || o) {
              var t = this._rootIsInDom(),
                e = t
                  ? this._getRootRect()
                  : {
                      top: 0,
                      bottom: 0,
                      left: 0,
                      right: 0,
                      width: 0,
                      height: 0,
                    };
              this._observationTargets.forEach(function (o) {
                var i = o.element,
                  s = c(i),
                  h = this._rootContainsTarget(i),
                  u = o.entry,
                  a = t && h && this._computeTargetAndRootIntersection(i, s, e),
                  l = null;
                this._rootContainsTarget(i)
                  ? (n && !this.root) || (l = e)
                  : (l = {
                      top: 0,
                      bottom: 0,
                      left: 0,
                      right: 0,
                      width: 0,
                      height: 0,
                    });
                var f = (o.entry = new r({
                  time:
                    window.performance && performance.now && performance.now(),
                  target: i,
                  boundingClientRect: s,
                  rootBounds: l,
                  intersectionRect: a,
                }));
                u
                  ? t && h
                    ? this._hasCrossedThreshold(u, f) &&
                      this._queuedEntries.push(f)
                    : u && u.isIntersecting && this._queuedEntries.push(f)
                  : this._queuedEntries.push(f);
              }, this),
                this._queuedEntries.length &&
                  this._callback(this.takeRecords(), this);
            }
          }),
          (s.prototype._computeTargetAndRootIntersection = function (e, i, r) {
            if ("none" != window.getComputedStyle(e).display) {
              for (
                var s, h, u, a, f, d, g, m, v = i, b = p(e), w = !1;
                !w && b;

              ) {
                var y = null,
                  _ = 1 == b.nodeType ? window.getComputedStyle(b) : {};
                if ("none" == _.display) return null;
                if (b == this.root || 9 == b.nodeType)
                  if (((w = !0), b == this.root || b == t))
                    n && !this.root
                      ? !o || (0 == o.width && 0 == o.height)
                        ? ((b = null), (y = null), (v = null))
                        : (y = o)
                      : (y = r);
                  else {
                    var E = p(b),
                      I = E && c(E),
                      T = E && this._computeTargetAndRootIntersection(E, I, r);
                    I && T
                      ? ((b = E), (y = l(I, T)))
                      : ((b = null), (v = null));
                  }
                else {
                  var R = b.ownerDocument;
                  b != R.body &&
                    b != R.documentElement &&
                    "visible" != _.overflow &&
                    (y = c(b));
                }
                if (
                  (y &&
                    ((s = y),
                    (h = v),
                    (u = void 0),
                    (a = void 0),
                    (f = void 0),
                    (d = void 0),
                    (g = void 0),
                    (m = void 0),
                    (u = Math.max(s.top, h.top)),
                    (a = Math.min(s.bottom, h.bottom)),
                    (f = Math.max(s.left, h.left)),
                    (d = Math.min(s.right, h.right)),
                    (m = a - u),
                    (v =
                      ((g = d - f) >= 0 &&
                        m >= 0 && {
                          top: u,
                          bottom: a,
                          left: f,
                          right: d,
                          width: g,
                          height: m,
                        }) ||
                      null)),
                  !v)
                )
                  break;
                b = b && p(b);
              }
              return v;
            }
          }),
          (s.prototype._getRootRect = function () {
            var e;
            if (this.root && !d(this.root)) e = c(this.root);
            else {
              var n = d(this.root) ? this.root : t,
                o = n.documentElement,
                i = n.body;
              e = {
                top: 0,
                left: 0,
                right: o.clientWidth || i.clientWidth,
                width: o.clientWidth || i.clientWidth,
                bottom: o.clientHeight || i.clientHeight,
                height: o.clientHeight || i.clientHeight,
              };
            }
            return this._expandRectByRootMargin(e);
          }),
          (s.prototype._expandRectByRootMargin = function (t) {
            var e = this._rootMarginValues.map(function (e, n) {
                return "px" == e.unit
                  ? e.value
                  : (e.value * (n % 2 ? t.width : t.height)) / 100;
              }),
              n = {
                top: t.top - e[0],
                right: t.right + e[1],
                bottom: t.bottom + e[2],
                left: t.left - e[3],
              };
            return (
              (n.width = n.right - n.left), (n.height = n.bottom - n.top), n
            );
          }),
          (s.prototype._hasCrossedThreshold = function (t, e) {
            var n = t && t.isIntersecting ? t.intersectionRatio || 0 : -1,
              o = e.isIntersecting ? e.intersectionRatio || 0 : -1;
            if (n !== o)
              for (var i = 0; i < this.thresholds.length; i++) {
                var r = this.thresholds[i];
                if (r == n || r == o || r < n != r < o) return !0;
              }
          }),
          (s.prototype._rootIsInDom = function () {
            return !this.root || f(t, this.root);
          }),
          (s.prototype._rootContainsTarget = function (e) {
            var n = (this.root && (this.root.ownerDocument || this.root)) || t;
            return f(n, e) && (!this.root || n == e.ownerDocument);
          }),
          (s.prototype._registerInstance = function () {
            e.indexOf(this) < 0 && e.push(this);
          }),
          (s.prototype._unregisterInstance = function () {
            var t = e.indexOf(this);
            -1 != t && e.splice(t, 1);
          }),
          (window.IntersectionObserver = s),
          (window.IntersectionObserverEntry = r);
      }
    function i(t) {
      try {
        return (t.defaultView && t.defaultView.frameElement) || null;
      } catch (t) {
        return null;
      }
    }
    function r(t) {
      (this.time = t.time),
        (this.target = t.target),
        (this.rootBounds = a(t.rootBounds)),
        (this.boundingClientRect = a(t.boundingClientRect)),
        (this.intersectionRect = a(
          t.intersectionRect || {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            width: 0,
            height: 0,
          },
        )),
        (this.isIntersecting = !!t.intersectionRect);
      var e = this.boundingClientRect,
        n = e.width * e.height,
        o = this.intersectionRect,
        i = o.width * o.height;
      this.intersectionRatio = n
        ? Number((i / n).toFixed(4))
        : this.isIntersecting
          ? 1
          : 0;
    }
    function s(t, e) {
      var n,
        o,
        i,
        r = e || {};
      if ("function" != typeof t)
        throw new Error("callback must be a function");
      if (r.root && 1 != r.root.nodeType && 9 != r.root.nodeType)
        throw new Error("root must be a Document or Element");
      (this._checkForIntersections =
        ((n = this._checkForIntersections.bind(this)),
        (o = this.THROTTLE_TIMEOUT),
        (i = null),
        function () {
          i ||
            (i = setTimeout(function () {
              n(), (i = null);
            }, o));
        })),
        (this._callback = t),
        (this._observationTargets = []),
        (this._queuedEntries = []),
        (this._rootMarginValues = this._parseRootMargin(r.rootMargin)),
        (this.thresholds = this._initThresholds(r.threshold)),
        (this.root = r.root || null),
        (this.rootMargin = this._rootMarginValues
          .map(function (t) {
            return t.value + t.unit;
          })
          .join(" ")),
        (this._monitoringDocuments = []),
        (this._monitoringUnsubscribes = []);
    }
    function h(t, e, n, o) {
      "function" == typeof t.addEventListener
        ? t.addEventListener(e, n, o || !1)
        : "function" == typeof t.attachEvent && t.attachEvent("on" + e, n);
    }
    function u(t, e, n, o) {
      "function" == typeof t.removeEventListener
        ? t.removeEventListener(e, n, o || !1)
        : "function" == typeof t.detatchEvent && t.detatchEvent("on" + e, n);
    }
    function c(t) {
      var e;
      try {
        e = t.getBoundingClientRect();
      } catch (t) {}
      return e
        ? ((e.width && e.height) ||
            (e = {
              top: e.top,
              right: e.right,
              bottom: e.bottom,
              left: e.left,
              width: e.right - e.left,
              height: e.bottom - e.top,
            }),
          e)
        : { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 };
    }
    function a(t) {
      return !t || "x" in t
        ? t
        : {
            top: t.top,
            y: t.top,
            bottom: t.bottom,
            left: t.left,
            x: t.left,
            right: t.right,
            width: t.width,
            height: t.height,
          };
    }
    function l(t, e) {
      var n = e.top - t.top,
        o = e.left - t.left;
      return {
        top: n,
        left: o,
        height: e.height,
        width: e.width,
        bottom: n + e.height,
        right: o + e.width,
      };
    }
    function f(t, e) {
      for (var n = e; n; ) {
        if (n == t) return !0;
        n = p(n);
      }
      return !1;
    }
    function p(e) {
      var n = e.parentNode;
      return 9 == e.nodeType && e != t
        ? i(e)
        : (n && n.assignedSlot && (n = n.assignedSlot.parentNode),
          n && 11 == n.nodeType && n.host ? n.host : n);
    }
    function d(t) {
      return t && 9 === t.nodeType;
    }
  })();
